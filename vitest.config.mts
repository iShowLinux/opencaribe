import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'tests/security/**/*.test.ts',
      'packages/**/*.test.ts',
      'modules/**/*.test.ts',
    ],
    exclude: ['**/node_modules/**', '**/.next/**'],
    testTimeout: 20_000,
  },
});
