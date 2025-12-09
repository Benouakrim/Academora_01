import { z } from 'zod';

/**
 * Re-export schemas from shared package for backward compatibility
 * This allows existing imports to continue working
 */
export * from '../../../shared/schemas/claimSchemas';

/**
 * Server-specific schemas defined using the server's zod version
 * to avoid type incompatibilities with the validation middleware
 */

export const reviewClaimSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'VERIFIED']),
    adminNotes: z.string().optional(),
  }),
};

export const createClaimSchema = {
  body: z.object({
    universityId: z.string().uuid().optional(),
    universityGroupId: z.string().uuid().optional(),
    requesterName: z.string().min(1, 'Name is required'),
    requesterEmail: z.string().email('Invalid email'),
    institutionalEmail: z.string().email('Invalid institutional email'),
    position: z.string().min(1, 'Position is required'),
    department: z.string().optional(),
    verificationDocuments: z.array(z.string().url()).min(1, 'At least one verification document is required'),
    comments: z.string().optional(),
  }).refine((data) => data.universityId || data.universityGroupId, {
    message: 'Either universityId or universityGroupId must be provided',
  }),
};

export const postMessageSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    attachments: z.array(z.string().url()).optional().default([]),
    type: z.enum(['CHAT', 'DOCUMENT_REQUEST', 'INTERNAL_NOTE']).default('CHAT'),
    isInternalNote: z.boolean().optional().default(false),
    dataRequestSchema: z.any().optional(),
  }),
};

export const submitClaimDataSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    requestMessageId: z.string().uuid().optional(),
    submittedData: z.record(z.string(), z.any()),
    documents: z.array(z.string().url()).optional().default([]),
  }),
};

export const updateClaimStatusSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum([
      'PENDING',
      'APPROVED',
      'UNDER_REVIEW',
      'ACTION_REQUIRED',
      'PENDING_DOCUMENTS',
      'VERIFIED',
      'REJECTED',
      'ARCHIVED',
    ]),
    adminNotes: z.string().optional(),
    auditNote: z.string().min(1, 'Audit note is required for status changes'),
  }),
};
