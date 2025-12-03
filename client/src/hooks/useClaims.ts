import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'

type ClaimRequestPayload = {
  universityId?: string
  universityGroupId?: string
  requesterName: string
  requesterEmail: string
  position: string
  department?: string
  verificationDocuments: string[]
  comments?: string
}

type ClaimResponse = {
  id: string
  status: 'PENDING'
  requesterName: string
  requesterEmail: string
  position: string
  department?: string
  verificationDocuments: string[]
  comments?: string
  createdAt: string
  expiresAt: string
  universityId?: string
  universityGroupId?: string
}

/**
 * Hook to submit a new University Claim Request.
 */
export function useClaimRequest() {
  const queryClient = useQueryClient()

  return useMutation<ClaimResponse, Error, ClaimRequestPayload>({
    mutationFn: async (payload) => {
      // API call to the backend
      const { data } = await api.post('/claims/request', payload)
      return data
    },
    onSuccess: () => {
      toast.success('Claim request submitted successfully! We will review it within 48 hours.')
      // Optionally invalidate any admin query that tracks claims
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] })
      queryClient.invalidateQueries({ queryKey: ['my-claims'] })
    },
    onError: (error) => {
      const message = (error as any).response?.data?.message || 'Failed to submit claim. Please check your inputs.'
      toast.error(message)
    },
  })
}

// Future hooks (e.g., useMyClaims) will be added here
