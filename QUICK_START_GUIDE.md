# Quick Start Guide - University Claim System

## Step 1: Run Database Migration

```bash
cd server
npx prisma migrate dev --name add_claim_communication_system
npx prisma generate
```

This will:
- Add the new `ClaimCommunication` and `ClaimDataSubmission` tables
- Update the `UniversityClaim` table with `auditLog` field
- Update the `ClaimStatus` enum
- Add new relations to the `User` model

## Step 2: Install Dependencies (if needed)

```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install date-fns lucide-react
```

## Step 3: Create Missing User Claims Page

Copy the code from `MyClaimsPage_TEMPLATE.tsx` to:
```
client/src/pages/dashboard/MyClaimsPage.tsx
```

Or use this command:
```bash
cd client/src/pages/dashboard
Copy-Item ..\..\..\..\MyClaimsPage_TEMPLATE.tsx MyClaimsPage.tsx
```

## Step 4: Update Your Router

Add these routes to your React Router configuration:

```tsx
// In your App.tsx or router config
import AdminClaimDetailPage from '@/pages/admin/AdminClaimDetailPage';
import MyClaimsPage from '@/pages/dashboard/MyClaimsPage';

// Add routes:
<Route path="/admin/claims/:id" element={<AdminClaimDetailPage />} />
<Route path="/dashboard/claims" element={<MyClaimsPage />} />
```

## Step 5: Test the System

### As Admin:
1. Navigate to `/admin/claims`
2. Click on a claim with status `PENDING` or `UNDER_REVIEW`
3. Test the features:
   - Send a chat message
   - Click "Request Info" to build a custom form
   - Submit the form (claim status should change to `ACTION_REQUIRED`)
   - Update status to `VERIFIED` or `REJECTED`
   - Check the Audit Log tab

### As User:
1. Navigate to `/dashboard/claims`
2. Click on a claim
3. You should see:
   - Status Stepper showing progress
   - If `ACTION_REQUIRED`, an alert with the form to fill
   - Chat tab to communicate
   - Submit data and see status change

## Step 6: Verify API Endpoints

Test these endpoints in your API client (Postman/Insomnia):

### User Endpoints (require auth):
- `GET /api/claims/my-requests` - List user's claims
- `GET /api/claims/:id` - Get claim details
- `POST /api/claims/:id/message` - Send message
- `POST /api/claims/:id/submit-data` - Submit data response

### Admin Endpoints (require admin role):
- `GET /api/admin/claims` - List all claims
- `PATCH /api/claims/:id/status` - Update status
- `POST /api/claims/:id/message` with `type: "DOCUMENT_REQUEST"` - Send form request

## Common Issues & Solutions

### Issue: Prisma client not updated
**Solution:**
```bash
cd server
npx prisma generate
```

### Issue: TypeScript errors in frontend
**Solution:** Ensure all shadcn/ui components are installed:
```bash
cd client
npx shadcn-ui@latest add badge card dialog tabs separator alert
```

### Issue: API not found
**Solution:** Check that the routes are properly imported in `server/src/routes.ts`:
```typescript
import claimsRouter from './routes/claims';
app.use('/api/claims', claimsRouter);
```

### Issue: CORS errors
**Solution:** Ensure your CORS configuration allows the frontend URL.

## Features Overview

### State Machine
```
PENDING → UNDER_REVIEW → ACTION_REQUIRED → UNDER_REVIEW → VERIFIED
                      ↓                                     ↓
                   REJECTED                              ARCHIVED
```

### Admin Capabilities
1. **View all claims** with filtering
2. **Update status** with audit trail
3. **Send structured data requests** via form builder
4. **Chat with users** in real-time
5. **Add internal notes** (hidden from users)
6. **Review audit log** of all changes

### User Capabilities
1. **Submit claims** with documents
2. **Track status** via stepper
3. **Respond to data requests** dynamically
4. **Chat with admins**
5. **View claim history**

## Next: Enhancements

Consider adding:
1. **Real-time notifications** via WebSocket
2. **Email notifications** on status changes
3. **File upload to Cloudinary** (replace mock in DataRequestForm)
4. **Claim expiration reminders**
5. **Bulk claim management** for admins
6. **Export to PDF** for claim records

## Support

Check the implementation files:
- Backend logic: `server/src/services/ClaimService.ts`
- API endpoints: `server/src/routes/claims.ts`
- Admin UI: `client/src/pages/admin/AdminClaimDetailPage.tsx`
- User UI: `client/src/pages/dashboard/MyClaimsPage.tsx`
- Components: `client/src/components/claims/`

All code includes detailed comments and follows Clean Architecture principles.
