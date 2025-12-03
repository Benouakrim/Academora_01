import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useDebounce } from 'use-debounce'

export type University = {
  id: string
  slug: string
  name: string
  city: string
  state: string | null
  country: string
  logoUrl: string | null
  heroImageUrl: string | null
  acceptanceRate: number | null
  tuitionOutState: number | null
  tuitionInternational: number | null
  ranking: number | null // Extract from rankings JSONB in the future
  studentLifeScore: number | null
}

export type SearchFilters = {
  search?: string
  country?: string
  major?: string
  maxTuition?: number
  minGpa?: number
  climateZone?: string
  setting?: string
  minSafetyRating?: number
  minPartySceneRating?: number
  
  // NEW ADVANCED FILTERS
  minAcceptanceRate?: number // e.g. 0.25 (find schools with rate <= 25%)
  minAvgSat?: number
  requiredIelts?: number
}

export function useUniversitySearch(filters: SearchFilters) {
  // Debounce the entire filter object to prevent rapid API calls
  const [debouncedFilters] = useDebounce(filters, 500)

  return useQuery({
    queryKey: ['universities', debouncedFilters],
    queryFn: async () => {
      // Map 'search' to 'q' for backend compatibility
      const { search, ...restFilters } = debouncedFilters
      const filtersForBackend = {
        ...restFilters,
        ...(search && { q: search }),
        // Map minAcceptanceRate (UX filter for 'Max Selectivity') to backend's max value
        ...(restFilters.minAcceptanceRate && { minAcceptanceRate: restFilters.minAcceptanceRate })
      }
      
      // Clean undefined values and convert numbers back to strings for API query
      const params = Object.fromEntries(
        Object.entries(filtersForBackend)
          .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
          .map(([k, v]) => [k, typeof v === 'number' ? String(v) : v])
      )
      
      const { data } = await api.get<{ data: University[], meta: { total: number, page: number, pageSize: number } }>('/universities', { params })
      return data.data // Extract the universities array from the response
    },
    // Override global default: shorter staleTime for search results (2 minutes)
    staleTime: 1000 * 60 * 2,
  })
}
