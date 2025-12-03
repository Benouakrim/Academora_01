import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type AdminStats = {
  counts: {
    users: number
    universities: number
    articles: number
    reviews: number
    pendingReviews: number
    savedItems: number
  }
  recentUsers: Array<{
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
    createdAt: string
  }>
  recentReviews: Array<{
    id: string
    rating: number
    createdAt: string
    user: { firstName: string | null; lastName: string | null }
    university: { name: string }
  }>
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats')
      return data
    },
    refetchInterval: 30000, // Refresh every 30s
  })
}
