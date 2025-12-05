# Billing & Subscription Guide

## Overview
The Billing System integrates Stripe to manage user subscriptions, payments, and webhook events. It enables secure checkout and automated subscription management.

---

## Features

### ✨ Core Capabilities
- **Stripe Checkout** – Secure payment flows
- **Subscription Management** – Create, update, and cancel subscriptions
- **Webhook Handling** – React to Stripe events (payment success, cancellation)

---

## API Endpoints

### Create Checkout Session
`POST /api/billing/checkout`
**Request:**
```json
{ "planId": "pro-monthly" }
```
**Response:**
```json
{ "checkoutUrl": "https://checkout.stripe.com/..." }
```

### Stripe Webhook
`POST /api/billing/webhook`
**Request:** Stripe sends event payloads
**Response:**
```json
{ "received": true }
```

---

## Service Layer
- **PaymentService.ts** – Handles Stripe API calls, subscription logic, and webhook event processing.

---

## Frontend Integration Example
```tsx
// Example: Start checkout
const handleSubscribe = async () => {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ planId: "pro-monthly" })
  });
  const { checkoutUrl } = await res.json();
  window.location.href = checkoutUrl;
};
```

---

## Future Enhancements
- Support for multiple payment providers
- Subscription analytics dashboard
- In-app invoice management
