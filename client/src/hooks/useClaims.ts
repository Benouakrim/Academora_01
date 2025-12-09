import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { claimApi } from '@/api/claimApi';
import type { 
  CreateClaimInput, 
  UpdateClaimStatusInput, 
  PostMessageInput, 
  SubmitClaimDataInput 
} from '../../../shared/schemas/claimSchemas';

/**
 * Hook to submit a new University Claim Request
 */
export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClaimInput) => claimApi.createClaim(data),
    onSuccess: () => {
      toast.success('Claim request submitted successfully! We will review it within 48 hours.');
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit claim. Please check your inputs.';
      toast.error(message);
    },
  });
}

/**
 * Hook to fetch user's claims
 */
export function useMyClaims() {
  return useQuery({
    queryKey: ['my-claims'],
    queryFn: () => claimApi.getMyClaims(),
  });
}

/**
 * Hook to fetch detailed claim information
 */
export function useClaimDetails(claimId: string | null) {
  return useQuery({
    queryKey: ['claim-detail', claimId],
    queryFn: () => claimApi.getClaimDetails(claimId!),
    enabled: !!claimId,
  });
}

/**
 * Hook to post a message to a claim
 */
export function usePostMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: PostMessageInput }) =>
      claimApi.postMessage(claimId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claim-detail', variables.claimId] });
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });
}

/**
 * Hook to submit data in response to a document request
 */
export function useSubmitClaimData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: SubmitClaimDataInput }) =>
      claimApi.submitData(claimId, data),
    onSuccess: (_, variables) => {
      toast.success('Data submitted successfully for review!');
      queryClient.invalidateQueries({ queryKey: ['claim-detail', variables.claimId] });
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit data');
    },
  });
}

// ========== ADMIN HOOKS ==========

/**
 * Hook to fetch all claims (admin only)
 */
export function useAllClaims(status?: string) {
  return useQuery({
    queryKey: ['admin-claims', status],
    queryFn: () => claimApi.getAllClaims(status),
  });
}

/**
 * Hook to update claim status (admin only)
 */
export function useUpdateClaimStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: UpdateClaimStatusInput }) =>
      claimApi.updateClaimStatus(claimId, data),
    onSuccess: (_, variables) => {
      toast.success('Claim status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim-detail', variables.claimId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update claim status');
    },
  });
}

/**
 * Hook to review claim (legacy endpoint for backward compatibility)
 */
export function useReviewClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: { status: 'APPROVED' | 'REJECTED'; adminNotes?: string } }) =>
      claimApi.reviewClaim(claimId, data),
    onSuccess: () => {
      toast.success('Claim reviewed successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to review claim');
    },
  });
}

/**
 * Hook to update a claim
 */
export function useUpdateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, data }: { claimId: string; data: Partial<any> }) =>
      claimApi.updateClaim(claimId, data),
    onSuccess: () => {
      toast.success('Claim updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update claim');
    },
  });
}

/**
 * Hook to delete a claim
 */
export function useDeleteClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (claimId: string) => claimApi.deleteClaim(claimId),
    onSuccess: () => {
      toast.success('Claim deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete claim');
    },
  });
}

/**
 * Hook to get all documents for a claim
 */
export function useClaimDocuments(claimId: string | null) {
  return useQuery({
    queryKey: ['claim-documents', claimId],
    queryFn: () => claimApi.getClaimDocuments(claimId!),
    enabled: !!claimId,
  });
}

/**
 * Hook to review a document
 */
export function useReviewDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, data }: { 
      documentId: string; 
      data: { status: 'APPROVED' | 'REJECTED'; adminNotes?: string } 
    }) => claimApi.reviewDocument(documentId, data),
    onSuccess: () => {
      toast.success('Document reviewed successfully!');
      queryClient.invalidateQueries({ queryKey: ['claim-documents'] });
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to review document');
    },
  });
}
