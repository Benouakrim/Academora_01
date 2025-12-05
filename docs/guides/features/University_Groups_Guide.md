# University Groups Guide

## Overview
The University Groups System enables categorization of universities into groups (e.g., Ivy League, Russell Group) for filtering and analytics.

---

## Features

### ✨ Core Capabilities
- **Group Creation** – Define and manage university groups
- **Many-to-Many Relationships** – Universities can belong to multiple groups
- **Group Filtering** – Filter universities by group

---

## Database Schema

### UniversityGroup Model
```prisma
model UniversityGroup {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  universities University[] @relation("GroupUniversities")
}
```

---

## API Endpoints

### Get Groups
`GET /api/groups`
**Response:**
```json
[
  { "id": "group_1", "name": "Ivy League" }
]
```

### Add University to Group
`POST /api/groups/:groupId/add`
**Request:**
```json
{ "universityId": "uni_123" }
```
**Response:**
```json
{ "success": true }
```

---

## Controller
- **groupController.ts** – Manages group creation, updates, and university assignments.

---

## Seeding Example
- **universityGroups.seed.ts** – Seeds common university groups for initial setup.

---

## Future Enhancements
- Group analytics and reporting
- Custom group creation by users
- Group badges and highlights
