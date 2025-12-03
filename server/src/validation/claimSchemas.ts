import { z } from 'zod';

/**
 * Schema for creating a new claim request
 * Validates that either universityId OR universityGroupId is provided (not both)
 */
export const createClaimSchema = {
  body: z.object({
    requesterName: z.string().min(1, 'Requester name is required'),
    requesterEmail: z.string().email('Valid business email is required'),
    position: z.string().min(1, 'Position/title is required'),
    verificationDocuments: z.array(z.string().url('Each document must be a valid URL'))
      .min(1, 'At least one verification document is required'),
    universityId: z.string().optional(),
    universityGroupId: z.string().optional(),
    department: z.string().optional(),
    comments: z.string().optional(),
  }).refine(
    (data) => {
      // Ensure exactly one of universityId or universityGroupId is provided
      const hasUniversityId = !!data.universityId;
      const hasUniversityGroupId = !!data.universityGroupId;
      return (hasUniversityId && !hasUniversityGroupId) || (!hasUniversityId && hasUniversityGroupId);
    },
    {
      message: 'Either universityId or universityGroupId must be provided, but not both',
      path: ['universityId'], // Error will be attached to universityId field
    }
  ),
};

/**
 * Schema for admin reviewing a claim
 */
export const reviewClaimSchema = {
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: 'Status must be either APPROVED or REJECTED' }),
    }),
    adminNotes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};

// Type exports for use in controllers/services
export type CreateClaimData = z.infer<typeof createClaimSchema['body']>;
export type ReviewClaimData = z.infer<typeof reviewClaimSchema['body']>;
