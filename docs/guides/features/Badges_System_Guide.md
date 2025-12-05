# Badges System Guide

## Overview
The Badges System is a gamification feature that rewards users with achievement badges for completing specific actions, milestones, or contributions to the Academora platform.

---

## Features

### ✨ Core Capabilities
- **Achievement Tracking** - Award badges for various accomplishments
- **Badge Categories** - Organize badges by type (Milestone, Community, Referral, etc.)
- **User Collections** - Users can display earned badges on their profiles
- **Award Timestamps** - Track when each badge was earned
- **Badge Metadata** - Include icons, descriptions, and categories

---

## Database Schema

### Badge Model
```prisma
model Badge {
  id          String     @id @default(uuid())
  slug        String     @unique  // e.g., "early-bird"
  name        String               // e.g., "Early Bird"
  description String?    @db.Text  // What the badge represents
  iconUrl     String?               // URL to badge icon/image
  category    String?               // e.g., "Milestone", "Community", "Referral"

  userBadges  UserBadge[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([category])
}
```

### UserBadge Model
```prisma
model UserBadge {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  badge     Badge    @relation(fields: [badgeId], references: [id])
  badgeId   String
  awardedAt DateTime @default(now())

  @@unique([userId, badgeId])  // User can't earn same badge twice
  @@index([userId])
  @@index([badgeId])
}
```

---

## Badge Categories

### 1. **Milestone Badges**
Awarded for reaching platform milestones:
- **Early Bird** - Joined during early launch phase
- **First Review** - Posted first university review
- **Profile Complete** - Completed full profile setup
- **Anniversary** - Platform anniversary (1 year, 2 years, etc.)

### 2. **Community Badges**
Awarded for community contributions:
- **Top Contributor** - Made significant contributions (reviews, articles, comments)
- **Helpful Reviewer** - Reviews marked helpful by others
- **Article Author** - Published articles
- **Verified Student** - Verified university student status

### 3. **Referral Badges**
Awarded for referral achievements:
- **Ambassador** - Referred multiple users
- **Super Ambassador** - Referred 10+ users
- **Referral Master** - Referred 50+ users

### 4. **Engagement Badges**
Awarded for platform engagement:
- **Active Member** - Logged in consistently for 30 days
- **Conversation Starter** - Started popular discussions
- **Helpful Commenter** - Comments with high engagement

### 5. **Academic Badges**
Awarded for academic achievements:
- **Accepted** - Got accepted to a university
- **Scholar** - Received scholarship
- **Graduate** - Graduated from university

---

## Seeding

### Example Badge Seeds
```typescript
// server/prisma/seeds/badges.seed.ts
export const badgesSeed: SeedFunction = {
  name: 'badges',
  dependencies: ['users'],
  seed: async (prisma: PrismaClient, data: any) => {
    const { adminUser, student2 } = data.users;

    // Create Badges
    const earlyBirdBadge = await prisma.badge.create({
      data: {
        slug: "early-bird",
        name: "Early Bird",
        description: "Joined Academora during our early launch phase. Thank you for being one of our first users!",
        iconUrl: "https://example.com/badges/early-bird.svg",
        category: "Milestone",
      }
    });

    const topContributorBadge = await prisma.badge.create({
      data: {
        slug: "top-contributor",
        name: "Top Contributor",
        description: "Made significant contributions to the community through reviews, articles, or helpful comments.",
        iconUrl: "https://example.com/badges/top-contributor.svg",
        category: "Community",
      }
    });

    const ambassadorBadge = await prisma.badge.create({
      data: {
        slug: "ambassador",
        name: "Ambassador",
        description: "Helped grow the Academora community by referring multiple users.",
        iconUrl: "https://example.com/badges/ambassador.svg",
        category: "Referral",
      }
    });

    // Award Badges
    await prisma.userBadge.create({
      data: {
        userId: adminUser.id,
        badgeId: earlyBirdBadge.id,
        awardedAt: new Date(),
      }
    });

    if (student2) {
      await prisma.userBadge.create({
        data: {
          userId: student2.id,
          badgeId: ambassadorBadge.id,
          awardedAt: new Date(),
        }
      });
    }

    return { earlyBirdBadge, topContributorBadge, ambassadorBadge };
  }
};
```

---

## Badge Service Implementation

### Award Badge Function
```typescript
// server/src/services/BadgeService.ts
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class BadgeService {
  /**
   * Award a badge to a user
   * @param userId - User to award badge to
   * @param badgeSlug - Slug of the badge to award
   * @returns UserBadge record or null if already awarded
   */
  static async awardBadge(userId: string, badgeSlug: string) {
    // Find badge by slug
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug }
    });

    if (!badge) {
      throw new AppError(404, `Badge not found: ${badgeSlug}`);
    }

    // Check if user already has this badge
    const existing = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      }
    });

    if (existing) {
      console.log(`User ${userId} already has badge ${badgeSlug}`);
      return null; // Already awarded
    }

    // Award the badge
    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id
      },
      include: {
        badge: true
      }
    });

    console.log(`✅ Awarded badge "${badge.name}" to user ${userId}`);
    return userBadge;
  }

  /**
   * Get all badges earned by a user
   * @param userId - User ID
   * @returns Array of user badges with badge details
   */
  static async getUserBadges(userId: string) {
    return await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { awardedAt: 'desc' }
    });
  }

  /**
   * Get all available badges
   * @returns Array of all badges
   */
  static async getAllBadges() {
    return await prisma.badge.findMany({
      include: {
        _count: {
          select: { userBadges: true }
        }
      },
      orderBy: { category: 'asc' }
    });
  }

  /**
   * Check if user has a specific badge
   * @param userId - User ID
   * @param badgeSlug - Badge slug
   * @returns boolean
   */
  static async hasBadge(userId: string, badgeSlug: string): Promise<boolean> {
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug }
    });

    if (!badge) return false;

    const userBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      }
    });

    return !!userBadge;
  }
}
```

---

## Triggering Badge Awards

### Example: Award Badge on First Review
```typescript
// In review controller after creating review
import { BadgeService } from '../services/BadgeService';

export const createReview = async (req: Request, res: Response) => {
  // ... create review logic ...

  // Check if this is user's first review
  const reviewCount = await prisma.review.count({
    where: { userId: user.id }
  });

  if (reviewCount === 1) {
    // Award "First Review" badge
    await BadgeService.awardBadge(user.id, 'first-review');
  }

  res.status(201).json({ review });
};
```

### Example: Award Badge on Referrals
```typescript
// In referral service after tracking referral
export const trackReferral = async (referralCode: string, newUserId: string) => {
  // ... tracking logic ...

  // Check referrer's total completed referrals
  const completedCount = await prisma.referral.count({
    where: {
      referrerId: referrer.id,
      status: 'COMPLETED'
    }
  });

  // Award ambassador badges based on count
  if (completedCount === 5) {
    await BadgeService.awardBadge(referrer.id, 'ambassador');
  } else if (completedCount === 10) {
    await BadgeService.awardBadge(referrer.id, 'super-ambassador');
  } else if (completedCount === 50) {
    await BadgeService.awardBadge(referrer.id, 'referral-master');
  }
};
```

---

## API Endpoints

### Get User's Badges
```typescript
// GET /api/users/me/badges
router.get('/me/badges', requireAuth, async (req, res) => {
  const userId = await getUserIdFromAuth(req);
  const badges = await BadgeService.getUserBadges(userId);
  res.json({ badges });
});
```

### Get All Badges
```typescript
// GET /api/badges
router.get('/', async (req, res) => {
  const badges = await BadgeService.getAllBadges();
  res.json({ badges });
});
```

---

## Frontend Integration

### Display User Badges
```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Badge as BadgeIcon } from 'lucide-react';

export function UserBadges({ userId }: { userId: string }) {
  const { data: badges } = useQuery({
    queryKey: ['badges', userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/badges`);
      return res.data.badges;
    }
  });

  if (!badges?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <BadgeIcon className="h-5 w-5" />
        Badges ({badges.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((userBadge: any) => (
          <div
            key={userBadge.id}
            className="flex flex-col items-center p-3 rounded-lg border bg-card hover:shadow-md transition"
            title={userBadge.badge.description}
          >
            <img
              src={userBadge.badge.iconUrl}
              alt={userBadge.badge.name}
              className="h-12 w-12 mb-2"
            />
            <span className="text-xs font-medium text-center">
              {userBadge.badge.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(userBadge.awardedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Badge Notification
```tsx
import { toast } from 'sonner';

export function showBadgeAward(badgeName: string, badgeIcon: string) {
  toast.success(
    <div className="flex items-center gap-3">
      <img src={badgeIcon} className="h-10 w-10" />
      <div>
        <p className="font-semibold">Badge Earned!</p>
        <p className="text-sm">{badgeName}</p>
      </div>
    </div>,
    {
      duration: 5000,
    }
  );
}
```

---

## Badge Icon Resources

### Recommended Icon Sets
- **Heroicons** - https://heroicons.com/
- **Lucide Icons** - https://lucide.dev/
- **Flaticon** - https://www.flaticon.com/
- **Custom SVGs** - Create custom badge designs

### Icon Guidelines
- **Size**: 64x64px minimum
- **Format**: SVG preferred (scalable)
- **Style**: Consistent design across all badges
- **Colors**: Use brand colors or category-specific colors

---

## Future Enhancements

- [ ] Badge rarity levels (Common, Rare, Epic, Legendary)
- [ ] Progress tracking toward badge requirements
- [ ] Badge showcasing on profile (featured badges)
- [ ] Badge leaderboards
- [ ] Seasonal/limited-time badges
- [ ] Badge rewards (unlock features, discounts)
- [ ] Badge sharing on social media
- [ ] Animated badge reveals
- [ ] Badge collections/sets
- [ ] Achievement notifications via email

---

## Summary

The Badges System provides:
- ✅ Flexible badge creation and categorization
- ✅ Automatic badge awarding based on triggers
- ✅ User badge collections
- ✅ Profile badge display
- ✅ Gamification incentives

**Files:**
- Schema: `server/prisma/schema.prisma` (Badge, UserBadge models)
- Service: `server/src/services/BadgeService.ts` (to be created)
- Seeds: `server/prisma/seeds/badges.seed.ts`
