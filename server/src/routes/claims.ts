import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import { createClaimSchema } from '../validation/claimSchemas';
import * as controller from '../controllers/ClaimController';

const router = Router();

// --- USER ROUTES (Authenticated) ---

// POST /api/claims/request - Submit a new claim
router.post('/request', requireAuth, validate(createClaimSchema), controller.requestClaim);

// GET /api/claims/my-requests - Get user's claim history
router.get('/my-requests', requireAuth, controller.getMyClaims);

export default router;
