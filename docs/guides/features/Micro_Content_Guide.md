# Micro Content Guide

## Overview
The Micro Content System allows universities to display quick tips, highlights, and short-form content to users, enhancing discoverability and engagement.

---

## Features

### ✨ Core Capabilities
- **Quick Tips** – Display short, actionable advice
- **Highlights** – Showcase unique university features
- **Priority Sorting** – Order content by importance

---

## Database Schema

### MicroContent Model
```prisma
model MicroContent {
  id        String   @id @default(uuid())
  universityId String
  category  String
  title     String
  content   String
  priority  Int      @default(0)
  createdAt DateTime @default(now())
}
```

---

## API Endpoints

### Get Micro Content
`GET /api/micro-content?universityId=uni_123`
**Response:**
```json
[
  { "category": "Tip", "title": "Apply early!", "content": "Early applications have higher acceptance rates.", "priority": 1 }
]
```

---

## Controller
- **microContentController.ts** – Handles CRUD operations for micro content.

---

## Seeding Example
- **microContent.seed.ts** – Seeds sample tips and highlights for universities.

---

## Future Enhancements
- User-generated micro content
- Content moderation tools
- Analytics on content engagement
