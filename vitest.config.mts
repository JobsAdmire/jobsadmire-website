import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

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
      // `.mts` + `import.meta.url`, not `.ts` + `__dirname`: Vite warns that a config with ESM
      // syntax loaded as CommonJS (no `"type": "module"` here — Next owns that decision) breaks
      // under the `configLoader: 'native'` default of a coming major. The extension settles it.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
