import { Router } from 'express';
import * as controller from '../controllers/reviewController';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createReviewSchema = {
  body: z.object({
    universityId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    academicRating: z.number().min(1).max(5).optional(),
    campusRating: z.number().min(1).max(5).optional(),
    socialRating: z.number().min(1).max(5).optional(),
    careerRating: z.number().min(1).max(5).optional(),
    title: z.string().min(2).max(100),
    content: z.string().min(10),
  }),
};

router.get('/:universityId', controller.getReviews);
router.post('/', requireAuth, validate(createReviewSchema), controller.createReview);
router.delete('/:id', requireAuth, controller.deleteReview);

export default router;
