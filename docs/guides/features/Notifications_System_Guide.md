# Notifications System Guide

## Overview
The Notifications System provides real-time alerts to users, supporting read/unread states and actionable links. It ensures users are promptly informed about important events, updates, and actions within Academora.

---

## Features

### ✨ Core Capabilities
- **Real-Time Delivery** – Push notifications for instant updates
- **Read/Unread States** – Track which notifications have been seen
- **Actionable Links** – Direct users to relevant pages
- **Notification Types** – Support for various event categories

---

## Database Schema

### Notification Model
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String
  title     String
  message   String
  link      String?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## API Endpoints

### Get Notifications
`GET /api/notifications`
**Response:**
```json
[
  {
    "id": "...",
    "type": "INFO",
    "title": "Welcome!",
    "message": "Your account was created.",
    "link": "/dashboard",
    "isRead": false
  }
]
```

### Mark as Read
`PATCH /api/notifications/:id/read`
**Request:**
```json
{}
```
**Response:**
```json
{ "success": true }
```

### Mark All as Read
`PATCH /api/notifications/read-all`
**Request:**
```json
{}
```
**Response:**
```json
{ "success": true }
```

---

## Service Layer
- **NotificationService.ts** – Handles creation, delivery, and state updates for notifications.

---

## Frontend Integration Example
```tsx
// Example: Fetch and display notifications
const { data: notifications } = useQuery(["notifications"], fetchNotifications);

return (
  <ul>
    {notifications.map(n => (
      <li key={n.id} className={n.isRead ? "read" : "unread"}>
        <a href={n.link}>{n.title}</a>
      </li>
    ))}
  </ul>
);
```

---

## Future Enhancements
- Push notification support (WebSockets)
- Notification preferences
- In-app notification center
