import { z } from 'zod';

export const searchUniversitiesSchema = {
  query: z.object({
    q: z.string().optional(),
    country: z.string().optional(),
    maxTuition: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    minGpa: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    climateZone: z.string().optional(),
    setting: z.string().optional(),
    minSafetyRating: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    minPartySceneRating: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    
    // NEW ADVANCED FILTERS
    minAcceptanceRate: z.string().transform((val) => (val ? Number(val) : undefined)).optional(), // 0.0 to 1.0
    minAvgSat: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    requiredIelts: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    
    page: z.string().transform((val) => (val ? Number(val) : 1)).optional().default('1'),
    pageSize: z.string().transform((val) => (val ? Number(val) : 20)).optional().default('20'),
  }),
};
