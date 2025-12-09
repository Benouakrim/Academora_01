import { z } from 'zod';

// --- Enums ---
export const ClaimStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'UNDER_REVIEW',
  'ACTION_REQUIRED',
  'PENDING_DOCUMENTS',
  'VERIFIED',
  'REJECTED',
  'ARCHIVED',
]);

export const ClaimTypeEnum = z.enum([
  'ACADEMIC_STAFF',
  'ALUMNI',
  'STUDENT',
  'ADMINISTRATIVE_STAFF',
]);

export const DocumentStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REPLACED',
]);

export const CommunicationTypeEnum = z.enum([
  'CHAT',
  'DOCUMENT_REQUEST',
  'INTERNAL_NOTE',
]);

// --- Claim Creation Schema ---
export const createClaimSchema = {
  body: z.object({
    universityId: z.string().uuid().optional(),
    universityGroupId: z.string().uuid().optional(),
    claimType: ClaimTypeEnum.default('ACADEMIC_STAFF'),
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

export type CreateClaimInput = z.infer<typeof createClaimSchema['body']>;

// --- Claim Status Update Schema ---
export const updateClaimStatusSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: ClaimStatusEnum,
    adminNotes: z.string().optional(),
    auditNote: z.string().min(1, 'Audit note is required for status changes'),
  }),
};

export type UpdateClaimStatusInput = z.infer<typeof updateClaimStatusSchema['body']>;

// --- Communication Message Schema ---
export const postMessageSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    attachments: z.array(z.string().url()).optional().default([]),
    type: CommunicationTypeEnum.default('CHAT'),
    isInternalNote: z.boolean().optional().default(false),
    // For DOCUMENT_REQUEST type
    dataRequestSchema: z.any().optional(), // JSON schema for requested data
  }),
};

export type PostMessageInput = z.infer<typeof postMessageSchema['body']>;

// --- Data Submission Schema ---
export const submitClaimDataSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    requestMessageId: z.string().uuid().optional(),
    submittedData: z.record(z.string(), z.any()), // Flexible JSON data
    documents: z.array(z.string().url()).optional().default([]),
  }),
};

export type SubmitClaimDataInput = z.infer<typeof submitClaimDataSchema['body']>;

// --- Audit Log Entry Schema ---
export const auditLogEntrySchema = z.object({
  timestamp: z.string().datetime(),
  userId: z.string().uuid(),
  userName: z.string(),
  action: z.string(),
  fromStatus: ClaimStatusEnum.optional(),
  toStatus: ClaimStatusEnum.optional(),
  note: z.string().optional(),
});

export type AuditLogEntry = z.infer<typeof auditLogEntrySchema>;

// --- Data Request Schema Template ---
export const dataRequestFieldSchema = z.object({
  fieldName: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'file', 'date', 'select', 'textarea']),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select fields
  description: z.string().optional(),
});

export const dataRequestSchemaTemplate = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(dataRequestFieldSchema),
});

export type DataRequestSchema = z.infer<typeof dataRequestSchemaTemplate>;
export type DataRequestField = z.infer<typeof dataRequestFieldSchema>;

// --- Type Exports ---
export type ClaimStatus = z.infer<typeof ClaimStatusEnum>;
export type ClaimType = z.infer<typeof ClaimTypeEnum>;
export type DocumentStatus = z.infer<typeof DocumentStatusEnum>;
export type CommunicationType = z.infer<typeof CommunicationTypeEnum>;

// --- Review Claim Schema (Legacy - kept for backward compatibility) ---
export const reviewClaimSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'VERIFIED']),
    adminNotes: z.string().optional(),
  }),
};

export type ReviewClaimInput = z.infer<typeof reviewClaimSchema['body']>;
