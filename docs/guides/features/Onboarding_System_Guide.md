# Onboarding System Guide

## Overview
The Onboarding System guides new users through a personalized setup flow, collecting key information to tailor their experience on Academora.

---

## Features

### ✨ Core Capabilities
- **Step-by-Step Flow** – Interactive onboarding questions
- **Persona & Goals** – Capture user roles and objectives
- **Skip/Complete Tracking** – Track onboarding status

---

## Database Schema

### User Model Fields
```prisma
model User {
  onboarded         Boolean  @default(false)
  onboardingSkipped Boolean  @default(false)
  accountType       String?
  personaRole       String?
  focusArea         String?
  primaryGoal       String?
  organizationName  String?
  onboardingAnswers Json?
}
```

---

## API Endpoints

### Submit Onboarding
`POST /api/onboarding`
**Request:**
```json
{ "answers": { "personaRole": "Student", "primaryGoal": "Find scholarships" } }
```
**Response:**
```json
{ "success": true }
```

### Get Onboarding Status
`GET /api/onboarding/status`
**Response:**
```json
{ "onboarded": true, "onboardingSkipped": false }
```

---

## Controller
- **OnboardingController.ts** – Manages onboarding flow, answers, and status updates.

---

## Frontend Integration Example
```tsx
// Example: Submit onboarding answers
const submitOnboarding = async (answers) => {
  await fetch("/api/onboarding", {
    method: "POST",
    body: JSON.stringify({ answers })
  });
};
```

---

## Future Enhancements
- Dynamic onboarding questions
- Progress tracking
- Onboarding analytics
