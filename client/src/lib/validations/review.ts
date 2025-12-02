import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  academicRating: z.number().min(1).max(5).optional(),
  campusRating: z.number().min(1).max(5).optional(),
  socialRating: z.number().min(1).max(5).optional(),
  careerRating: z.number().min(1).max(5).optional(),
  title: z.string().min(2, 'Title is too short').max(100, 'Title is too long'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review is too long')
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
