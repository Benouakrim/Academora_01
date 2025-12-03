import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run tests within the server/src/tests directory
    include: ['server/src/tests/**/*.test.ts'], 
    // Global setup file for mocking Prisma and environment
    setupFiles: ['server/src/tests/setup.ts'], 
    // Set environment to Node.js
    environment: 'node',
    // Mock imports for better isolation (e.g., external libraries)
    deps: {
      interopDefault: true,
    },
    // Output settings
    coverage: {
      provider: 'v8',
      enabled: true,
    },
    // Ensure accurate type checking during test
    globals: true,
  },
});
