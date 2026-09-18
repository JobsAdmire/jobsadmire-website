import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.test.{ts,tsx}',
      'contract/**/*.test.ts',
      'scripts/**/*.test.ts',
      'redirects/**/*.test.ts',
    ],
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
