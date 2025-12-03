import { vi } from 'vitest';

// 1. Mock Clerk Authentication Library Globally
vi.mock('@clerk/express', () => ({
  // Mock the entire Clerk module to prevent actual API calls during testing
  clerkClient: {
    users: {
      getUser: vi.fn(),
    },
  },
  requireAuth: vi.fn((req, res, next) => next()),
  clerkMiddleware: vi.fn((req, res, next) => next()),
}));

// 2. Mock Prisma Client
// This prevents tests from trying to connect to a real database.
// All Prisma client methods used in services must be mocked here.

// Create mock functions that will be shared across all instances
const mockUserFindUnique = vi.fn();
const mockUserUpdate = vi.fn();
const mockUserCreate = vi.fn();
const mockUniversityFindUnique = vi.fn();
const mockUniversityFindMany = vi.fn();
const mockFinancialProfileFindUnique = vi.fn();
const mockUniversityClaimFindUnique = vi.fn();
const mockUniversityClaimCreate = vi.fn();
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();

class MockPrismaClient {
  user = {
    findUnique: mockUserFindUnique,
    update: mockUserUpdate,
    create: mockUserCreate,
  };
  university = {
    findUnique: mockUniversityFindUnique,
    findMany: mockUniversityFindMany,
  };
  financialProfile = {
    findUnique: mockFinancialProfileFindUnique,
  };
  universityClaim = {
    findUnique: mockUniversityClaimFindUnique,
    create: mockUniversityClaimCreate,
  };
  $connect = mockConnect;
  $disconnect = mockDisconnect;
}

// Replace the real PrismaClient with our mock constructor
vi.mock('@prisma/client', () => ({
  PrismaClient: MockPrismaClient,
  // Export necessary Enums used in services
  UserRole: { USER: 'USER', ADMIN: 'ADMIN' },
  ClaimStatus: { PENDING: 'PENDING', APPROVED: 'APPROVED' },
}));

// 3. Mock Cache (Ensure service tests are isolated from cache logic)
vi.mock('../lib/cache', () => ({
    Cache: {
        get: vi.fn(),
        set: vi.fn(),
        isReady: true
    }
}));

// Global cleanup function can go here if needed, but Vitest handles most of it.
