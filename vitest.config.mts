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
    // The suite must not depend on the ambient environment: the Vercel build carries the
    // project's own variables (the legacy site's NEXT_PUBLIC_SITE_URL broke the routes tests
    // on 2026-09-20, dpl_9Nqoyyyc2…), so every variable the code reads is pinned here to the
    // values the tests were written against. A test that needs another value sets it itself.
    env: {
      NEXT_PUBLIC_SITE_URL: 'https://www.jobsadmire.com',
      CONTENT_SOURCE: 'LOCAL',
      OPS_API_URL: '',
      OPS_WEBSITE_READ_TOKEN: '',
      REVALIDATE_SECRET: '',
      VERCEL_ENV: '',
      NEXT_PUBLIC_GTM_ID: '',
      NEXT_PUBLIC_GA4_ID: '',
      NEXT_PUBLIC_ADS_ID: '',
      NEXT_PUBLIC_ADS_CONVERSION_LABEL: '',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
    },
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
