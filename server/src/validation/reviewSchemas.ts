import { z } from 'zod';
import { ReviewStatus } from '@prisma/client';

export const createReviewSchema = {
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

export const moderateReviewSchema = {
  body: z.object({
    status: z.nativeEnum(ReviewStatus),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};
