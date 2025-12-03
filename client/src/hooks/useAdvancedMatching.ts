import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { MatchProfileState, ImportanceFactors } from '@/store/useMatchingProfileStore'

// Define the shape of a single match result (Backend structure is in MatchingService.ts)
export interface UniversityMatchResult {
  university: {
    id: string
    slug: string
    name: string
    country: string
    tuitionOutState: number | null
    logoUrl: string | null
    // Add other fields needed for display, e.g., ranking, acceptanceRate
  }
  matchScore: number // The final weighted score (0-100)
  breakdown: {
    academic: number
    financial: number
    social: number
    location: number
    future: number
  }
}

// Define the core payload structure for the API call
type MatchPayload = Pick<MatchProfileState, 
  'gpa' | 'maxBudget' | 'preferredMajor' | 'importanceFactors' | 'strictMatch' | 'minSafetyRating' | 'minVisaMonths' | 'needsVisaSupport'
> & {
    // We explicitly send all required fields for Zod validation
    gpa: number
    maxBudget: number
    preferredMajor: string
    importanceFactors: ImportanceFactors
}

/**
 * Hook to execute the Advanced Matching Algorithm on the backend.
 */
export function useAdvancedMatching() {
  return useMutation<UniversityMatchResult[], Error, MatchPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post('/match', payload)
      return data as UniversityMatchResult[]
    },
    onSuccess: () => {
      toast.success('Matching algorithm complete!')
    },
    onError: (error) => {
      const err = error as any;
      const msg = err.response?.data?.message || 'Failed to run matching engine. Please ensure you are logged in and have premium access.'
      
      // Feature access denied (403) from requireFeatureAccess
      if (err.response?.status === 403) {
          toast.error(msg, {
              description: "This feature requires a premium account. Check the Pricing page for details.",
          });
      } else {
          toast.error(msg);
      }
    },
  })
}
