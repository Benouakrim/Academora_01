import { Router } from 'express';
import * as controller from '../controllers/reviewController';
import { requireAuth } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';
import { validate } from '../middleware/validate';
import { createReviewSchema, moderateReviewSchema } from '../validation/reviewSchemas';

const router = Router();

router.get('/:universityId', controller.getReviews);

// Write
router.post('/', requireAuth, validate(createReviewSchema), controller.createReview);

// Admin
router.patch('/:id/status', requireAuth, requireAdmin, validate(moderateReviewSchema), controller.moderateReview);
router.delete('/:id', requireAuth, controller.deleteReview); // Controller handles permission check

export default router;
