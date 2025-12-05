# Financial Aid Guide

## Overview
The Financial Aid System provides tools for calculating aid eligibility and accessing financial data for universities, helping users make informed decisions.

---

## Features

### ✨ Core Capabilities
- **Aid Calculator** – Estimate financial aid based on user profile
- **University Data** – Access financial aid statistics per university
- **Profile Integration** – Store and update user financial profiles

---

## Database Schema

### FinancialProfile Model
```prisma
model FinancialProfile {
  id          String   @id @default(uuid())
  userId      String
  income      Int
  dependents  Int
  assets      Int
  aidEstimate Int?
  createdAt   DateTime @default(now())
}
```

---

## API Endpoints

### Get Financial Aid Data
`GET /api/financial-aid?universityId=uni_123`
**Response:**
```json
{
  "averageAid": 12000,
  "minAid": 5000,
  "maxAid": 25000
}
```

### Submit Financial Profile
`POST /api/financial-aid/profile`
**Request:**
```json
{ "income": 40000, "dependents": 2, "assets": 10000 }
```
**Response:**
```json
{ "aidEstimate": 15000 }
```

---

## Frontend Integration Example
```tsx
// Example: Calculate aid
const res = await fetch("/api/financial-aid/profile", {
  method: "POST",
  body: JSON.stringify({ income: 40000, dependents: 2, assets: 10000 })
});
const { aidEstimate } = await res.json();
```

---

## Future Enhancements
- Advanced aid calculators
- Integration with external financial aid APIs
- Personalized recommendations
