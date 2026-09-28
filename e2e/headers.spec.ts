import { test, expect } from '@playwright/test';
import { GATE_ROUTES } from './routes';

/**
 * W155 part 2 (§8 I) — the four cheap security headers `next.config.ts`'s `headers()` now sets
 * on every route, and the one deliberate exception: the OG image route, meant to be fetched and
 * displayed by whatever renders a shared link's preview, must not carry X-Frame-Options: DENY.
 * A CSP with nonces is a separate, later item (Gate A).
 */
const HEADERS: Record<string, string> = {
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'x-frame-options': 'DENY',
};

for (const route of GATE_ROUTES) {
  test(`security headers on ${route}`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    const headers = res!.headers();
    for (const [key, value] of Object.entries(HEADERS)) {
      expect(headers[key], key).toBe(value);
    }
  });
}

test('the OG route carries the other three headers but never X-Frame-Options', async ({
  request,
}) => {
  // 'site' is OG_PAGE_KEYS' own always-valid fallback (src/lib/seo/routes.ts) — valid whatever
  // page keys exist today.
  const res = await request.get('/og/tr/site.png');
  expect(res.status()).toBe(200);
  const headers = res.headers();
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['permissions-policy']).toBe('camera=(), microphone=(), geolocation=()');
  expect(headers['x-frame-options']).toBeUndefined();
});
