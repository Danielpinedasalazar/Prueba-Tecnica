import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
    deps: {
      inline: ['recharts', 'd3', 'internmap', 'lodash-es'],
    },
    include: [
      '__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'tests/**/*.{test,spec}.?(c|m)[jt]s?(x)',
    ],
  },
});
