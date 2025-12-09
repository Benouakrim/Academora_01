import { api } from '@/lib/api';
import type { 
  CreateClaimInput, 
  UpdateClaimStatusInput, 
  PostMessageInput, 
  SubmitClaimDataInput 
} from '../../../shared/schemas/claimSchemas';

/**
 * Comprehensive API client for Claims functionality
 */
export const claimApi = {
  // ========== USER ENDPOINTS ==========
  
  /**
   * Create a new claim request
   * POST /api/claims/request
   */
  createClaim: async (data: CreateClaimInput) => {
    const response = await api.post('/claims/request', data);
    return response.data;
  },

  /**
   * Get all claims for the current user
   * GET /api/claims/my-requests
   */
  getMyClaims: async () => {
    const response = await api.get('/claims/my-requests');
    return response.data;
  },

  /**
   * Get detailed information about a specific claim
   * GET /api/claims/:id
   */
  getClaimDetails: async (claimId: string) => {
    const response = await api.get(`/claims/${claimId}`);
    return response.data;
  },

  /**
   * Post a message to a claim (chat or document request)
   * POST /api/claims/:id/message
   */
  postMessage: async (claimId: string, data: PostMessageInput) => {
    const response = await api.post(`/claims/${claimId}/message`, data);
    return response.data;
  },

  /**
   * Submit data in response to a document request
   * POST /api/claims/:id/submit-data
   */
  submitData: async (claimId: string, data: SubmitClaimDataInput) => {
    const response = await api.post(`/claims/${claimId}/submit-data`, data);
    return response.data;
  },

  /**
   * Update a claim (user can edit their own pending claims)
   * PATCH /api/claims/:id
   */
  updateClaim: async (claimId: string, data: Partial<CreateClaimInput>) => {
    const response = await api.patch(`/claims/${claimId}`, data);
    return response.data;
  },

  /**
   * Delete a claim (user can delete their own pending claims)
   * DELETE /api/claims/:id
   */
  deleteClaim: async (claimId: string) => {
    const response = await api.delete(`/claims/${claimId}`);
    return response.data;
  },

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get all claims (admin only)
   * GET /api/admin/claims
   */
  getAllClaims: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/admin/claims${params}`);
    return response.data;
  },

  /**
   * Update claim status (admin only)
   * PATCH /api/claims/:id/status
   */
  updateClaimStatus: async (claimId: string, data: UpdateClaimStatusInput) => {
    const response = await api.patch(`/claims/${claimId}/status`, data);
    return response.data;
  },

  /**
   * Legacy review endpoint (admin only) - kept for backward compatibility
   * PATCH /api/admin/claims/:id/review
   */
  reviewClaim: async (claimId: string, data: { status: 'APPROVED' | 'REJECTED'; adminNotes?: string }) => {
    const response = await api.patch(`/admin/claims/${claimId}/review`, data);
    return response.data;
  },

  /**
   * Get all documents for a claim with approval status (admin only)
   * GET /api/admin/claims/:id/documents
   */
  getClaimDocuments: async (claimId: string) => {
    const response = await api.get(`/admin/claims/${claimId}/documents`);
    return response.data;
  },

  /**
   * Review a specific document (admin only)
   * PATCH /api/admin/documents/:id/review
   */
  reviewDocument: async (documentId: string, data: { status: 'APPROVED' | 'REJECTED'; adminNotes?: string }) => {
    const response = await api.patch(`/admin/documents/${documentId}/review`, data);
    return response.data;
  },
};

export default claimApi;
