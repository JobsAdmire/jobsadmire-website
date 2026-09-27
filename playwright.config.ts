import { defineConfig, devices } from '@playwright/test';
import { protectionBypassHeaders } from './e2e/helpers/bypass';

// Gate runs target a URL (preview or local); see scripts/gate.sh.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    // W137: reach a Vercel-protected preview — `x-vercel-protection-bypass` only when
    // VERCEL_AUTOMATION_BYPASS_SECRET is non-blank. Unset sends no header at all: an empty one
    // is not a no-op (it still forces a CORS preflight on every cross-origin CORS-mode request).
    extraHTTPHeaders: protectionBypassHeaders(),
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
});
