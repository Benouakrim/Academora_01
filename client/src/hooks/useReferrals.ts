import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useUserStore } from '@/store/useUserStore'

// Define the shape of a single referral record from the API
type ReferralData = {
  id: string
  status: 'PENDING' | 'COMPLETED' | 'REJECTED'
  createdAt: string
  completedAt: string | null
  referred: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
    createdAt: string
  }
}

// Define the shape of the API response
type ReferralResponse = {
  status: string
  data: {
    referralCode: string
    referrals: ReferralData[]
    stats: {
      total: number
      pending: number
      completed: number
      rejected: number
    }
  }
}

/**
 * Fetches the current user's referral code and activity.
 */
export function useReferrals() {
  const { profile } = useUserStore() // Assume referralCode is on the user profile

  return useQuery<ReferralResponse['data']>({
    queryKey: ['referrals'],
    queryFn: async () => {
      // The backend controller should handle fetching the referral code via /user/profile injection
      // but we use /referrals to get the list of referred users and aggregate stats.
      const { data } = await api.get('/referrals')
      return data.data
    },
    // Only run this query if the user profile has been loaded
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })
}
