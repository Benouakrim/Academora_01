import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type UniversityDetail = {
  id: string
  slug: string
  name: string
  description: string | null
  logoUrl: string | null
  heroImageUrl: string | null
  websiteUrl: string | null
  
  // Location
  city: string | null
  state: string | null
  country: string
  address: string | null
  
  // Classification
  ranking: number | null
  type: string | null
  setting: string | null
  classification: string | null
  
  // Admissions
  acceptanceRate: number | null
  applicationDeadline: string | null // ISO Date
  commonAppAccepted: boolean
  satMath25: number | null
  satMath75: number | null
  satVerbal25: number | null
  satVerbal75: number | null
  actComposite25: number | null
  actComposite75: number | null
  avgGpa: number | null
  
  // Costs
  tuitionInState: number | null
  tuitionOutState: number | null
  roomAndBoard: number | null
  costOfLiving: number | null
  averageNetPrice: number | null
  percentReceivingAid: number | null
  
  // Student Body
  studentPopulation: number | null
  studentFacultyRatio: number | null
  percentMale: number | null
  percentFemale: number | null
  
  // Outcomes
  graduationRate: number | null
  averageStartingSalary: number | null
  
  popularMajors: string[]
}

export function useUniversityDetail(slug: string) {
  return useQuery({
    queryKey: ['university', slug],
    queryFn: async () => {
      const { data } = await api.get<UniversityDetail>(`/universities/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}
