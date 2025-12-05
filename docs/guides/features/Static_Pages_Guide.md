# Static Pages Guide

## Overview
The Static Pages System provides a CMS for managing static content pages with SEO metadata, supporting easy publishing and editing.

---

## Features

### ✨ Core Capabilities
- **CMS Editing** – Create and update static pages
- **SEO Metadata** – Manage meta titles and descriptions
- **Publishing Workflow** – Control page visibility

---

## Database Schema

### StaticPage Model
```prisma
model StaticPage {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  content         String   @db.Text
  metaTitle       String?
  metaDescription String?
  published       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## API Endpoints

### Get Static Pages
`GET /api/pages`
**Response:**
```json
[
  { "slug": "about", "title": "About Us", "published": true }
]
```

### Create/Update Page
`POST /api/pages`
**Request:**
```json
{ "slug": "contact", "title": "Contact", "content": "Reach us at...", "metaTitle": "Contact Academora", "metaDescription": "Contact page for Academora", "published": true }
```
**Response:**
```json
{ "success": true }
```

---

## Controller
- **staticController.ts** – Manages page creation, updates, and publishing.

---

## Future Enhancements
- Rich text editor integration
- Page versioning
- SEO analytics
