# University Claims Guide

## Overview
The University Claims System allows universities to claim and verify their profiles, supporting a multi-stage approval workflow for administrators.

---

## Features

### ✨ Core Capabilities
- **Claim Submission** – Universities request ownership of their profile
- **Status Workflow** – PENDING, APPROVED, REJECTED, VERIFIED
- **Admin Review** – Approve or reject claims

---

## Database Schema

### UniversityClaim Model
```prisma
model UniversityClaim {
  id        String   @id @default(uuid())
  universityId String
  status    String   // PENDING, APPROVED, REJECTED, VERIFIED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## API Endpoints

### Submit Claim
`POST /api/claims`
**Request:**
```json
{ "universityId": "uni_123" }
```
**Response:**
```json
{ "success": true, "claimId": "claim_456" }
```

### Get Claims
`GET /api/claims`
**Response:**
```json
[
  { "id": "claim_456", "status": "PENDING" }
]
```

---

## Controller
- **ClaimController.ts** – Handles claim submission, status updates, and admin actions.

---

## Seeding Example
- **universityClaims.seed.ts** – Seeds initial claim requests for testing.

---

## Future Enhancements
- Email notifications for claim status
- Claim history and audit logs
- Multi-admin approval
