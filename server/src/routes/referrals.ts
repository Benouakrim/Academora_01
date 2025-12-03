import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import * as controller from '../controllers/ReferralController';

const router = Router();

// --- PUBLIC ROUTES ---

// GET /api/referrals/apply/:code - Apply referral code (sets cookie)
router.get('/apply/:code', controller.applyReferral);

// --- AUTHENTICATED ROUTES ---

// GET /api/referrals - Get user's referral data (code, stats, list)
router.get('/', requireAuth, controller.getReferralData);

// POST /api/referrals/track - Track referral after signup (internal)
router.post('/track', requireAuth, controller.trackReferralAfterSignup);

export default router;
