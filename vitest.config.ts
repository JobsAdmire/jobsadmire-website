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
    // R19: next-intl's navigation build deep-imports `next/navigation` extensionless. Left
    // external, Node's ESM resolver refuses it; inlined, Vite resolves it (aliases proved
    // unnecessary — Vite's own resolver completes the extension).
    server: { deps: { inline: ['next-intl'] } },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
