# Referral System Guide

## Overview
The Referral System enables users to invite friends and track referrals through unique codes. Users earn rewards when their referrals complete specific actions.

---

## Features

### ✨ Core Capabilities
- **Unique Referral Codes** - Each user gets an 8-character URL-safe code
- **Cookie-Based Tracking** - 30-day tracking window for referrals
- **Referral Statistics** - Track total referrals, pending, completed, and rewards
- **Reward System** - Automated reward claiming when referrals complete actions
- **Self-Referral Prevention** - Built-in validation to prevent abuse

---

## Database Schema

### User Model Fields
```prisma
model User {
  referralCode String? @unique  // e.g., "ABC12XYZ"
  referredBy   String?          // ID of user who referred them
  referrer     User?   @relation("UserReferrals", fields: [referredBy], references: [id])
  myReferrals  User[]  @relation("UserReferrals")
  referralsMade Referral[] @relation("ReferrerReferrals")
  referralsReceived Referral[] @relation("ReferredUserReferrals")
}
```

### Referral Model
```prisma
model Referral {
  id              String          @id @default(uuid())
  referrerId      String
  referredUserId  String          @unique
  status          ReferralStatus  @default(PENDING)
  rewardClaimed   Boolean         @default(false)
  createdAt       DateTime        @default(now())
  
  referrer        User @relation("ReferrerReferrals", fields: [referrerId], references: [id])
  referredUser    User @relation("ReferredUserReferrals", fields: [referredUserId], references: [id])
}

enum ReferralStatus {
  PENDING
  COMPLETED
  EXPIRED
}
```

---

## API Endpoints

### 1. Get Referral Data
**Endpoint:** `GET /api/referrals`  
**Auth:** Required  
**Description:** Get user's referral code, list of referrals, and statistics

**Response:**
```json
{
  "status": "success",
  "data": {
    "referralCode": "ABC12XYZ",
    "referrals": [
      {
        "id": "uuid",
        "status": "COMPLETED",
        "rewardClaimed": true,
        "createdAt": "2025-12-01T10:00:00Z",
        "referredUser": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "avatarUrl": "https://...",
          "createdAt": "2025-12-01T10:00:00Z"
        }
      }
    ],
    "stats": {
      "totalReferrals": 5,
      "completedReferrals": 3,
      "pendingReferrals": 2,
      "rewardsClaimed": 3,
      "totalRewardsEarned": 150
    }
  }
}
```

### 2. Apply Referral Code
**Endpoint:** `GET /api/referrals/apply/:code`  
**Auth:** None (Public)  
**Description:** Apply a referral code and set tracking cookie

**Parameters:**
- `code` (path param) - The referral code to apply

**Response:**
```json
{
  "status": "success",
  "message": "Referral code applied successfully",
  "data": {
    "referredBy": "Jane Smith"
  }
}
```

**Side Effects:**
- Sets `referralCode` cookie (httpOnly, 30-day expiration)
- Cookie used during user registration to track referral

### 3. Track Referral After Signup
**Endpoint:** `POST /api/referrals/track`  
**Auth:** Required  
**Description:** Internal endpoint to track referral after user completes signup

**Request Body:**
```json
{
  "referralCode": "ABC12XYZ"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "referrerId": "uuid",
    "referredUserId": "uuid",
    "status": "PENDING",
    "createdAt": "2025-12-05T10:00:00Z"
  }
}
```

---

## Service Layer

### ReferralService Methods

#### `generateUniqueCode()`
Generates a unique 8-character URL-safe referral code.

```typescript
const code = await ReferralService.generateUniqueCode();
// Returns: "ABC12XYZ"
```

#### `ensureReferralCode(userId)`
Ensures user has a referral code, creating one if needed.

```typescript
const code = await ReferralService.ensureReferralCode(userId);
```

#### `trackReferral(referredByCode, newUserId)`
Tracks a new referral relationship when user signs up.

```typescript
const referral = await ReferralService.trackReferral('ABC12XYZ', newUserId);
```

#### `getReferralsByUserId(userId)`
Gets all referrals made by a specific user.

```typescript
const referrals = await ReferralService.getReferralsByUserId(userId);
```

#### `getReferralStats(userId)`
Gets referral statistics for a user.

```typescript
const stats = await ReferralService.getReferralStats(userId);
// Returns: { totalReferrals, completedReferrals, pendingReferrals, rewardsClaimed, totalRewardsEarned }
```

#### `updateReferralStatus(referralId, status)`
Updates the status of a referral (PENDING → COMPLETED → EXPIRED).

```typescript
await ReferralService.updateReferralStatus(referralId, 'COMPLETED');
```

#### `claimReward(referralId)`
Marks a referral reward as claimed.

```typescript
await ReferralService.claimReward(referralId);
```

---

## Implementation Flow

### 1. User Shares Referral Link
```typescript
// Frontend generates shareable link
const referralUrl = `https://academora.com/signup?ref=${user.referralCode}`;
```

### 2. New User Clicks Link
```typescript
// Frontend extracts code from URL
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');

// Call apply endpoint to set cookie
if (refCode) {
  await api.get(`/referrals/apply/${refCode}`);
}
```

### 3. New User Completes Signup
```typescript
// After Clerk signup, track referral
const referralCode = cookies.get('referralCode');
if (referralCode) {
  await api.post('/referrals/track', { referralCode });
}
```

### 4. Referral Completion & Rewards
```typescript
// When referred user completes qualifying action (e.g., onboarding)
await ReferralService.updateReferralStatus(referralId, 'COMPLETED');
await ReferralService.claimReward(referralId);
```

---

## Frontend Integration

### Custom Hook: `useReferrals`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useReferrals = () => {
  // Get referral data
  const { data, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const res = await api.get('/referrals');
      return res.data.data;
    }
  });

  // Apply referral code
  const applyCode = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.get(`/referrals/apply/${code}`);
      return res.data;
    }
  });

  return {
    referralCode: data?.referralCode,
    referrals: data?.referrals || [],
    stats: data?.stats,
    isLoading,
    applyCode
  };
};
```

### Referral Dashboard Component

```tsx
import { useReferrals } from '@/hooks/useReferrals';
import { Copy, Users, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ReferralDashboard() {
  const { referralCode, referrals, stats } = useReferrals();

  const copyLink = () => {
    const url = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    toast.success('Referral link copied!');
  };

  return (
    <div className="space-y-6">
      {/* Referral Code Card */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-semibold mb-2">Your Referral Code</h3>
        <div className="flex items-center gap-2">
          <code className="bg-muted px-3 py-2 rounded text-lg font-mono">
            {referralCode}
          </code>
          <Button size="sm" onClick={copyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Referrals" value={stats?.totalReferrals} />
        <StatCard icon={CheckCircle} label="Completed" value={stats?.completedReferrals} />
        <StatCard icon={Clock} label="Pending" value={stats?.pendingReferrals} />
        <StatCard icon={CheckCircle} label="Rewards Claimed" value={stats?.rewardsClaimed} />
      </div>

      {/* Referrals List */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Your Referrals</h3>
        </div>
        <div className="divide-y">
          {referrals.map((ref) => (
            <div key={ref.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={ref.referredUser.avatarUrl} 
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-medium">
                    {ref.referredUser.firstName} {ref.referredUser.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant={ref.status === 'COMPLETED' ? 'success' : 'secondary'}>
                {ref.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Seeding

```typescript
// server/prisma/seeds/referrals.seed.ts
export const referralsSeed: SeedFunction = {
  name: 'referrals',
  dependencies: ['users'],
  seed: async (prisma: PrismaClient, data: any) => {
    const { student1, student2 } = data.users;

    if (student2 && student1) {
      await prisma.user.update({
        where: { id: student1.id },
        data: { referredBy: student2.id }
      });

      await prisma.referral.create({
        data: {
          referrerId: student2.id,
          referredUserId: student1.id,
          status: ReferralStatus.COMPLETED,
          rewardClaimed: true,
        }
      });
    }

    return true;
  }
};
```

---

## Configuration

### Environment Variables
None required - uses existing database and authentication.

### Cookie Settings
```typescript
// 30-day expiration
const thirtyDays = 30 * 24 * 60 * 60 * 1000;

res.cookie('referralCode', code.toUpperCase(), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: thirtyDays,
});
```

---

## Reward System Integration

### Define Reward Rules
```typescript
// Example reward configuration
const REWARDS = {
  SIGNUP: { points: 50, description: 'User signed up' },
  ONBOARDING: { points: 50, description: 'User completed onboarding' },
  SUBSCRIPTION: { points: 100, description: 'User subscribed' }
};
```

### Trigger Rewards
```typescript
// When referred user completes action
const referral = await prisma.referral.findUnique({
  where: { referredUserId: userId }
});

if (referral && referral.status === 'PENDING') {
  await ReferralService.updateReferralStatus(referral.id, 'COMPLETED');
  await ReferralService.claimReward(referral.id);
  
  // Award points/credits to referrer
  await awardReferralReward(referral.referrerId, REWARDS.ONBOARDING.points);
}
```

---

## Security Considerations

1. **Self-Referral Prevention** - System validates referrer ≠ referred user
2. **Unique Codes** - 8-character codes with collision detection
3. **HttpOnly Cookies** - Tracking cookie not accessible via JavaScript
4. **Secure Cookies** - HTTPS-only in production
5. **30-Day Window** - Cookie expires after 30 days to prevent stale referrals

---

## Analytics & Reporting

### Track Referral Performance
```typescript
// Get top referrers
const topReferrers = await prisma.referral.groupBy({
  by: ['referrerId'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } },
  take: 10
});

// Get referral conversion rate
const stats = await prisma.referral.aggregate({
  _count: {
    id: true,
    _all: true
  },
  where: { status: 'COMPLETED' }
});

const conversionRate = (stats._count.id / stats._count._all) * 100;
```

---

## Testing

### Test Referral Flow
```bash
# 1. Get user's referral code
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/referrals

# 2. Apply referral code (no auth)
curl http://localhost:3000/api/referrals/apply/ABC12XYZ

# 3. Track referral after signup
curl -X POST \
  -H "Authorization: Bearer $NEW_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"referralCode":"ABC12XYZ"}' \
  http://localhost:3000/api/referrals/track
```

---

## Future Enhancements

- [ ] Multi-tier referral rewards
- [ ] Referral leaderboard
- [ ] Email notifications for new referrals
- [ ] Social sharing integration
- [ ] Custom referral links per campaign
- [ ] Referral expiration dates
- [ ] Admin dashboard for referral analytics

---

## Summary

The Referral System provides:
- ✅ Unique codes for each user
- ✅ Cookie-based tracking
- ✅ Automatic reward management
- ✅ Comprehensive statistics
- ✅ Production-ready security

**Files:**
- Controllers: `server/src/controllers/ReferralController.ts`
- Services: `server/src/services/ReferralService.ts`
- Routes: `server/src/routes/referrals.ts`
- Seeds: `server/prisma/seeds/referrals.seed.ts`
