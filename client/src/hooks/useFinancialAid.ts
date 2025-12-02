import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface PredictCostPayload {
  universityId: string;
  income: number;
  gpa: number;
  sat?: number;
  inState: boolean;
}

export interface PredictCostResult {
  tuition: number;
  housing: number;
  grossCost: number;
  efc: number;
  needAid: number;
  meritAid: number;
  totalAid: number;
  netPrice: number;
  breakdown: string;
}

export function useFinancialAid() {
  const mutation = useMutation<PredictCostResult, Error, PredictCostPayload>({
    mutationFn: async (payload) => {
      const body = {
        universityId: payload.universityId,
        familyIncome: payload.income,
        gpa: payload.gpa,
        satScore: payload.sat,
        inState: payload.inState,
      };
      const { data } = await api.post('/aid/predict', body);
      return data as PredictCostResult;
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
