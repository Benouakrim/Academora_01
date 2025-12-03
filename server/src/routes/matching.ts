import { Router } from 'express';
import { calculateMatches } from '../controllers/matchingController';
import { requireAuth } from '../middleware/requireAuth';
import { requireFeatureAccess, Feature } from '../middleware/requireFeatureAccess';
import { validate } from '../middleware/validate';
import { matchRequestSchema } from '../validation/matchingSchemas';

const router = Router();

// Protected route: Requires authentication AND feature access
// This demonstrates the layered security approach for premium features
router.post(
  '/', 
  requireAuth, 
  requireFeatureAccess(Feature.ADVANCED_MATCHING), 
  validate(matchRequestSchema), 
  calculateMatches
);

export default router;
