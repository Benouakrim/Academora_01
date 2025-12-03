import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UniversityDetail } from './useUniversityDetail'

// 1. Store for managing selected IDs (persists on reload)
type CompareState = {
  selectedSlugs: string[]
  addUniversity: (slug: string) => void
  removeUniversity: (slug: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      selectedSlugs: [],
      addUniversity: (slug) =>
        set((state) => {
          if (state.selectedSlugs.includes(slug)) return state
          if (state.selectedSlugs.length >= 3) return state // Max 3
          return { selectedSlugs: [...state.selectedSlugs, slug] }
        }),
      removeUniversity: (slug) =>
        set((state) => ({ selectedSlugs: state.selectedSlugs.filter((s) => s !== slug) })),
      clear: () => set({ selectedSlugs: [] }),
    }),
    { name: 'compare-storage' }
  )
)

// 2. Hook to fetch data for selected
export function useCompareData() {
  const slugs = useCompareStore((s) => s.selectedSlugs)

  return useQuery({
    queryKey: ['compare', slugs],
    queryFn: async () => {
      if (slugs.length === 0) return []
      // Use bulk endpoint for efficient single-request fetch
      const response = await api.get<UniversityDetail[]>('/compare', {
        params: { slugs: slugs.join(',') }
      })
      return response.data
    },
    enabled: slugs.length > 0,
  })
}
