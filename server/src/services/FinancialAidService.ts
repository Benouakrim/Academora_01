import { PrismaClient } from '@prisma/client';
import { create, all } from 'mathjs';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();
const math = create(all, { number: 'BigNumber', precision: 64 });

export interface FinancialAidInput {
  universityId: string;
  familyIncome: number;
  gpa: number;
  satScore?: number;
  inState: boolean;
}

export interface FinancialAidResult {
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

export class FinancialAidService {
  static async predict(data: FinancialAidInput): Promise<FinancialAidResult> {
    const { universityId, familyIncome, gpa, satScore, inState } = data;

    const university = await prisma.university.findUnique({ where: { id: universityId } });
    if (!university) throw new AppError(404, 'University not found');

    // --- 1. Define Variables for MathJS ---
    const scope = {
      income: familyIncome,
      gpa: gpa,
      sat: satScore || 0,
      tuition: inState ? (university.tuitionInState || 50000) : (university.tuitionOutState || 50000),
      housing: (university.roomAndBoard || 0) + (university.costOfLiving || 0),
      avgGrant: university.averageGrantAid || 15000,
      percentMet: university.percentReceivingAid || 0.6,
      uniAvgGpa: university.avgGpa || 3.5,
      uniAvgSat: university.avgSatScore || 1200
    };

    // --- 2. Calculate Gross Cost ---
    // Formula: Tuition + Housing
    const grossCost = math.evaluate('tuition + housing', scope);

    // --- 3. Calculate EFC (Simplified Federal Model) ---
    // Using mathjs expressions for clean logic
    let efcFormula = '0';
    if (familyIncome > 90000) {
      efcFormula = '17100 + (income - 90000) * 0.47';
    } else if (familyIncome > 60000) {
      efcFormula = '6600 + (income - 60000) * 0.35';
    } else if (familyIncome > 30000) {
      efcFormula = '(income - 30000) * 0.22';
    }
    
    const efcRaw = math.evaluate(efcFormula, scope);
    // EFC cannot exceed Gross Cost
    const efc = math.min(efcRaw, grossCost);

    // --- 4. Calculate Need-Based Aid ---
    // Need = Gross - EFC. Aid = Need * % Met by Uni
    const needRaw = math.max(0, math.subtract(grossCost, efc));
    const needAid = math.multiply(needRaw, scope.percentMet);

    // --- 5. Calculate Merit-Based Aid ---
    // Merit Multiplier: 1.0 (Average) + 0.2 for GPA match + 0.2 for SAT match
    let meritMultiplier = 1.0;
    if (gpa >= scope.uniAvgGpa) meritMultiplier += 0.2;
    if (scope.sat >= scope.uniAvgSat) meritMultiplier += 0.2;

    // Merit = (Average Grant * 0.5) * Multiplier
    const baseMerit = math.multiply(scope.avgGrant, 0.5);
    const meritAid = math.multiply(baseMerit, meritMultiplier);

    // --- 6. Final Totals ---
    // Total Aid = Need + Merit (Capped at Gross Cost)
    const totalAidRaw = math.add(needAid, meritAid);
    const totalAid = math.min(totalAidRaw, grossCost);
    const netPrice = math.subtract(grossCost, totalAid);

    return {
      tuition: Number(scope.tuition),
      housing: Number(scope.housing),
      grossCost: Number(grossCost),
      efc: Number(efc),
      needAid: Number(needAid),
      meritAid: Number(meritAid),
      totalAid: Number(totalAid),
      netPrice: Number(netPrice),
      breakdown: `Estimated using Federal Methodology. EFC: $${Math.round(Number(efc))}`
    };
  }
}
