import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Re-defining the MatchRequest structure based on server/src/validation/matchingSchemas.ts
export interface ImportanceFactors {
  academics: number // 1-10
  social: number // 1-10
  cost: number // 1-10
  location: number // 1-10
  future: number // 1-10
}

export interface MatchProfileState {
  // Core Profile (synced from main profile)
  gpa: number
  maxBudget: number
  preferredMajor: string
  
  // Advanced Constraints
  preferredCountry?: string
  preferredSetting?: 'URBAN' | 'SUBURBAN' | 'RURAL'
  preferredClimate?: string
  minSafetyRating?: number
  minVisaMonths?: number
  needsVisaSupport: boolean
  strictMatch: boolean // Hard-filter dealbreakers

  // Weighting Factors (The Mixer)
  importanceFactors: ImportanceFactors

  // Actions
  setProfileBase: (gpa: number, maxBudget: number, preferredMajor: string) => void
  setFactor: (key: keyof ImportanceFactors, value: number) => void
  setConstraint: (key: keyof Omit<MatchProfileState, 'importanceFactors' | 'setFactor' | 'setConstraint' | 'setProfileBase'>, value: string | number | boolean | undefined) => void
}

export const useMatchingProfileStore = create<MatchProfileState>()(
  persist(
    (set) => ({
      // --- Default State (Mirrors MatchingSchema defaults) ---
      gpa: 0,
      maxBudget: 50000,
      preferredMajor: 'Undeclared',
      needsVisaSupport: false,
      strictMatch: false,
      importanceFactors: {
        academics: 5,
        social: 5,
        cost: 5,
        location: 5,
        future: 5,
      },
      
      // --- Actions ---
      setProfileBase: (gpa, maxBudget, preferredMajor) => set({ 
        gpa, maxBudget, preferredMajor
      }),
      setFactor: (key, value) => 
        set((state) => ({
          importanceFactors: {
            ...state.importanceFactors,
            [key]: value,
          },
        })),
      setConstraint: (key, value) => set(() => ({ [key]: value })),
    }),
    {
      name: 'matching-profile-storage',
      // Only persist the custom settings, not the transient profile data
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ['importanceFactors', 'preferredCountry', 'strictMatch', 'minVisaMonths', 'needsVisaSupport', 'preferredSetting'].includes(key))
        ),
    }
  )
)
