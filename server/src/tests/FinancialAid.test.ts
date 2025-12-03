import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Prisma BEFORE any imports that use it
// Note: Everything must be defined inside the mock factory due to hoisting
vi.mock('@prisma/client', () => {
  // Create mock functions inside the factory
  const mockUserFindUnique = vi.fn();
  const mockUniversityFindUnique = vi.fn();
  
  // Create mock Prisma class
  class MockPrismaClient {
    user = {
      findUnique: mockUserFindUnique,
      update: vi.fn(),
      create: vi.fn(),
    };
    university = {
      findUnique: mockUniversityFindUnique,
      findMany: vi.fn(),
    };
    financialProfile = {
      findUnique: vi.fn(),
    };
    universityClaim = {
      findUnique: vi.fn(),
      create: vi.fn(),
    };
    $connect = vi.fn();
    $disconnect = vi.fn();
  }
  
  return {
    PrismaClient: MockPrismaClient,
    UserRole: { USER: 'USER', ADMIN: 'ADMIN' },
    ClaimStatus: { PENDING: 'PENDING', APPROVED: 'APPROVED' },
  };
});

// Now import the service (after mocking Prisma)
import { FinancialAidService } from '../services/FinancialAidService';
import { PrismaClient } from '@prisma/client';

// Get access to the mocked prisma instance
// We need to create a prisma instance to get the mocked methods
const prisma = new PrismaClient();

// Mock University data required by the service's logic
const mockUniversity = {
  id: 'uni-123',
  name: 'Elite University',
  slug: 'elite-uni',
  city: 'Boston',
  state: 'MA',
  country: 'USA',
  
  // Cost data - Core to testing
  tuitionOutState: 60000,
  tuitionInState: 40000,
  tuitionInternational: 65000,
  roomAndBoard: 12000,
  costOfLiving: 3000,
  booksAndSupplies: 1200,
  
  // Financial aid data
  averageGrantAid: 30000,
  percentReceivingAid: 0.75,
  scholarshipsIntl: true,
  needBlindAdmission: true,
  
  // Academic data for merit calculation
  avgGpa: 3.8,
  avgSatScore: 1450,
  minGpa: 3.5,
  acceptanceRate: 0.15,
  
  // Other required fields for model compliance
  logoUrl: null,
  heroImageUrl: null,
  description: 'Top university',
  shortName: 'Elite U',
  studentLifeScore: 4.5,
  safetyRating: 4.8,
  partySceneRating: 3.0,
  setting: 'URBAN' as any,
  climateZone: 'TEMPERATE' as any,
  ranking: 10,
  internationalEngReqs: null,
  applicationFee: 75,
  testPolicy: 'REQUIRED' as any,
  satMath25: 720,
  satMath75: 790,
  satVerbal25: 710,
  satVerbal75: 780,
  actComposite25: 32,
  actComposite75: 35,
  visaDurationMonths: 48,
  employmentRate: 0.95,
};

describe('FinancialAidService - Net Price Calculation', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset mock implementations
    vi.mocked(prisma.university.findUnique).mockReset();
    vi.mocked(prisma.user.findUnique).mockReset();
  });

  // Test Case 1: Basic Out-of-State Student with Moderate Income
  it('should calculate correct net price for out-of-state student with moderate income', async () => {
    // Mock the database call
    vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniversity as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'out-of-state',
        familyIncome: 80000,
        gpa: 3.8,
        satScore: 1450,
        savings: 10000,
        investments: 5000,
      },
      undefined // No authenticated user
    );

    // Expected calculations:
    // Tuition: 60000, Housing: 15000 (12000+3000), Books: 1200
    // Gross Cost: 76200
    expect(result.grossCost).toBe(76200);
    expect(result.tuition).toBe(60000);
    expect(result.housing).toBe(15000);

    // EFC Calculation:
    // Income: 80000 is between 70000-120000, so: 8000 + (80000-70000)*0.30 = 11000
    // Assets: (10000 + 5000) * 0.05 = 750
    // Total EFC: 11750
    expect(result.efc).toBe(11750);

    // Need-Based Aid:
    // Financial Need: 76200 - 11750 = 64450
    // Need Aid: 64450 * 0.75 (percentReceivingAid) = 48337.5 → 48338
    expect(result.needAid).toBe(48338);

    // Merit Aid:
    // GPA: 3.8 = avgGpa, no bonus
    // SAT: 1450 = avgSat, no bonus
    // Multiplier: 0, so Merit Aid: 0
    expect(result.meritAid).toBe(0);

    // Total Aid and Net Price
    expect(result.totalAid).toBe(48338);
    expect(result.netPrice).toBe(76200 - 48338); // 27862
    expect(result.eligibilityWarning).toBe(false);
  });

  // Test Case 2: High-Income Student with Strong Academics (Merit Aid)
  it('should award merit aid for high-achieving student above university averages', async () => {
    vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniversity as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'out-of-state',
        familyIncome: 150000,
        gpa: 4.2, // Well above avgGpa (3.8)
        satScore: 1580, // Well above avgSat (1450)
        savings: 50000,
        investments: 20000,
      },
      undefined
    );

    // Gross Cost: 76200 (same as before)
    expect(result.grossCost).toBe(76200);

    // EFC Calculation:
    // Income: 150000 > 120000, so: 25000 + (150000-120000)*0.40 = 37000
    // Assets: (50000 + 20000) * 0.05 = 3500
    // Total EFC: 40500
    expect(result.efc).toBe(40500);

    // Financial Need: 76200 - 40500 = 35700
    // Need Aid: 35700 * 0.75 = 26775
    expect(result.needAid).toBe(26775);

    // Merit Aid Calculation:
    // GPA: 4.2 >= 3.8 + 0.3 (4.1), multiplier += 0.5
    // SAT: 1580 >= 1450 + 100 (1550), multiplier += 0.5
    // Total Multiplier: 1.0
    // Base Merit: 30000 * 0.5 = 15000
    // Merit Aid: 15000 * 1.0 = 15000
    expect(result.meritAid).toBe(15000);

    // Total Aid: 26775 + 15000 = 41775
    expect(result.totalAid).toBe(41775);
    expect(result.netPrice).toBe(76200 - 41775); // 34425
  });

  // Test Case 3: Low-Income Student with High Need
  it('should provide maximum need-based aid for low-income student', async () => {
    vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniversity as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'out-of-state',
        familyIncome: 25000, // Very low income
        gpa: 3.5,
        satScore: 1300,
        savings: 0,
        investments: 0,
      },
      undefined
    );

    expect(result.grossCost).toBe(76200);

    // EFC Calculation:
    // Income: 25000 < 30000, so contribution = 0
    // Assets: 0
    // Total EFC: 0
    expect(result.efc).toBe(0);

    // Financial Need: 76200 - 0 = 76200
    // Need Aid: 76200 * 0.75 = 57150
    expect(result.needAid).toBe(57150);

    // Merit Aid: GPA and SAT below average, so 0
    expect(result.meritAid).toBe(0);

    expect(result.totalAid).toBe(57150);
    expect(result.netPrice).toBe(76200 - 57150); // 19050
  });

  // Test Case 4: In-State Residency (Lower Tuition)
  it('should apply lower in-state tuition rates', async () => {
    vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniversity as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'in-state',
        familyIncome: 60000,
        gpa: 3.6,
        satScore: undefined, // No SAT provided
        savings: 5000,
        investments: 0,
      },
      undefined
    );

    // Tuition should be in-state rate
    expect(result.tuition).toBe(40000);
    
    // Gross Cost: 40000 + 15000 + 1200 = 56200
    expect(result.grossCost).toBe(56200);

    // EFC Calculation:
    // Income: 60000 is between 30000-70000, so: (60000-30000)*0.20 = 6000
    // Assets: 5000 * 0.05 = 250
    // Total EFC: 6250
    expect(result.efc).toBe(6250);

    // Financial Need: 56200 - 6250 = 49950
    // Need Aid: 49950 * 0.75 = 37462.5 → 37463
    expect(result.needAid).toBe(37463);

    // No merit aid (average academics)
    expect(result.meritAid).toBe(0);

    expect(result.totalAid).toBe(37463);
    expect(result.netPrice).toBe(56200 - 37463); // 18737
  });

  // Test Case 5: International Student with Aid Available
  it('should calculate aid for international student when university offers it', async () => {
    vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniversity as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'international',
        familyIncome: 40000,
        gpa: 4.0,
        satScore: 1550,
        savings: 2000,
        investments: 0,
      },
      undefined
    );

    // International tuition
    expect(result.tuition).toBe(65000);
    
    // Gross Cost: 65000 + 15000 + 1200 = 81200
    expect(result.grossCost).toBe(81200);

    // Since scholarshipsIntl is true, should calculate aid normally
    expect(result.eligibilityWarning).toBe(false);

    // EFC: Income 40000 is between 30000-70000, so: (40000-30000)*0.20 = 2000
    // Assets: 2000 * 0.05 = 100
    // Total EFC: 2100
    expect(result.efc).toBe(2100);

    // Financial Need: 81200 - 2100 = 79100
    // Need Aid: 79100 * 0.75 = 59325
    expect(result.needAid).toBe(59325);

    // Merit Aid:
    // GPA: 4.0 >= 3.8 + 0.3 (4.1), no bonus (4.0 < 4.1)
    // SAT: 1550 >= 1450 + 100 (1550), multiplier += 0.5
    // Multiplier: 0.5
    // Merit: 15000 * 0.5 = 7500
    expect(result.meritAid).toBe(7500);

    expect(result.totalAid).toBe(59325 + 7500); // 66825
    expect(result.netPrice).toBe(81200 - 66825); // 14375
  });

  // Test Case 6: International Student - No Aid Available
  it('should return full cost for international student when university does not offer aid', async () => {
    // Create a version of the university without international scholarships
    const noIntlAidUni = { ...mockUniversity, scholarshipsIntl: false };
    vi.mocked(prisma.university.findUnique).mockResolvedValue(noIntlAidUni as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'international',
        familyIncome: 50000,
        gpa: 3.9,
        satScore: 1500,
        savings: 10000,
        investments: 5000,
      },
      undefined
    );

    // Should get full cost with eligibility warning
    expect(result.tuition).toBe(65000);
    expect(result.grossCost).toBe(81200);
    expect(result.efc).toBe(81200); // Full cost
    expect(result.needAid).toBe(0);
    expect(result.meritAid).toBe(0);
    expect(result.totalAid).toBe(0);
    expect(result.netPrice).toBe(81200);
    expect(result.eligibilityWarning).toBe(true);
    expect(result.breakdown).toContain('does not typically offer financial aid to international students');
  });

  // Test Case 7: Authenticated User with Saved Financial Profile
  it('should use saved financial profile for authenticated user', async () => {
    const mockUser = {
      clerkId: 'user_123',
      gpa: 3.7,
      satScore: 1400,
      financialProfile: {
        householdIncome: 70000,
        savings: 8000,
        investments: 3000,
      },
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.university.findUnique).mockResolvedValue(mockUniversity as any);

    // Only provide minimal data - should pull from profile
    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'out-of-state',
        // Not providing familyIncome, gpa, satScore, savings, investments
      },
      'user_123' // Authenticated
    );

    expect(result.grossCost).toBe(76200);

    // Should use profile data:
    // EFC: Income 70000, so: (70000-70000)*0.30 = 0 + 8000 base = 8000
    // Assets: (8000 + 3000) * 0.05 = 550
    // Total EFC: 8550
    expect(result.efc).toBe(8550);

    // Financial Need: 76200 - 8550 = 67650
    // Need Aid: 67650 * 0.75 = 50737.5 → 50738
    expect(result.needAid).toBe(50738);

    // Merit check with saved GPA 3.7 and SAT 1400 (both below avg)
    expect(result.meritAid).toBe(0);

    expect(result.breakdown).toContain('Calculation based on your saved financial profile');
  });

  // Test Case 8: University Not Found
  it('should throw error when university does not exist', async () => {
    vi.mocked(prisma.university.findUnique).mockResolvedValue(null);

    await expect(
      FinancialAidService.predict(
        {
          universityId: 'non-existent',
          residency: 'out-of-state',
          familyIncome: 50000,
        },
        undefined
      )
    ).rejects.toThrow('University not found');
  });

  // Test Case 9: Total Aid Cannot Exceed Gross Cost
  it('should cap total aid at gross cost to prevent negative net price', async () => {
    // Create a scenario where calculated aid would exceed cost
    const generousUni = {
      ...mockUniversity,
      tuitionOutState: 20000, // Lower cost
      roomAndBoard: 8000,
      costOfLiving: 2000,
      booksAndSupplies: 1000,
      percentReceivingAid: 1.0, // 100% of need met
      averageGrantAid: 50000, // Very generous
    };

    vi.mocked(prisma.university.findUnique).mockResolvedValue(generousUni as any);

    const result = await FinancialAidService.predict(
      {
        universityId: 'uni-123',
        residency: 'out-of-state',
        familyIncome: 20000, // Very low income
        gpa: 4.3, // Exceptional
        satScore: 1600, // Perfect score
        savings: 0,
        investments: 0,
      },
      undefined
    );

    // Gross Cost: 20000 + 10000 + 1000 = 31000
    expect(result.grossCost).toBe(31000);

    // Total aid should not exceed gross cost
    expect(result.totalAid).toBeLessThanOrEqual(31000);
    
    // Net price should never be negative
    expect(result.netPrice).toBeGreaterThanOrEqual(0);
    expect(result.netPrice).toBe(result.grossCost - result.totalAid);
  });
});
