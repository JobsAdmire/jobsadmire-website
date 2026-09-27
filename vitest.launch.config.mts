import { defineConfig } from 'vitest/config';
import base from './vitest.config.mjs';

// The launch profile's source-level check (scripts/launch/*.launch-check.ts). A separate config
// — not a filter — because the default `include` (scripts/**/*.test.ts) must never match these:
// they fail on purpose until Gate A, and the default suite runs inside every Vercel build.
// Spread, not mergeConfig: mergeConfig concatenates `include` arrays, which would run everything.
// No setup file: the jsdom/RTL setup is for component tests; this is a pure Node assertion.
export default defineConfig({
  ...base,
  test: {
    ...base.test,
    include: ['scripts/launch/**/*.launch-check.ts'],
    environment: 'node',
    setupFiles: [],
  },
});
