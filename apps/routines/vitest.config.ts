import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'src/components/**/__tests__/*.{test,spec}.{ts,tsx}',
      'src/components/**/*.{test,spec}.{ts,tsx}'
    ],
    setupFiles: 'src/setupTests.ts'
  },
  resolve: {
    alias: {
      "@": "./src"
    }
  }
});
