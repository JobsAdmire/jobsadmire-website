import { test, expect } from '@playwright/test';
import { GATE_ROUTES } from './routes';

/**
 * W155 part 2 (§8 I) + W157 — the four cheap security headers `next.config.ts`'s `headers()` sets:
 * every page carries all four; `X-Content-Type-Options: nosniff` rides every response, static
 * chunks and optimised images included, while the three document headers stay off
 * `/_next/static/*` and `/_next/image` (they protect nothing there and cost transfer bytes on
 * every script, W157); and the OG image route, meant to be fetched and displayed by whatever
 * renders a shared link's preview, never carries X-Frame-Options: DENY. A CSP with nonces is a
 * separate, later item (Gate A).
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

const DOCUMENT_ONLY = ['referrer-policy', 'permissions-policy', 'x-frame-options'] as const;

test('a static chunk and an optimised image carry nosniff only — never the document headers (W157)', async ({
  page,
  request,
}) => {
  await page.goto('/');
  // Taken from the built page itself, so the hashed names never need maintaining here.
  const chunk = await page.locator('script[src*="/_next/static/"]').first().getAttribute('src');
  const image = await page.locator('img[src^="/_next/image"]').first().getAttribute('src');
  expect(chunk, 'a /_next/static script on /').toBeTruthy();
  expect(image, 'an optimised /_next/image on /').toBeTruthy();
  for (const url of [chunk!, image!]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    const headers = res.headers();
    expect(headers['x-content-type-options'], url).toBe('nosniff');
    for (const key of DOCUMENT_ONLY) expect(headers[key], `${key} on ${url}`).toBeUndefined();
  }
});

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
