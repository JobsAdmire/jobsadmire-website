import { test, expect } from '@playwright/test';
import { GATE_ROUTES } from './routes';

/**
 * W155 part 2 (§8 I) + W157 + W160 — the four cheap security headers: every page carries all
 * four (`X-Content-Type-Options: nosniff` from `next.config.ts`'s `headers()`, on every response;
 * the other three from `src/proxy.ts`'s middleware, W160 — Vercel's routing layer silently ignored
 * `headers()`'s old negative-lookahead `source` for them on `/_next/static` chunks, although
 * `next start` honoured it). A static chunk, an optimised image and the OG image route all bypass
 * that middleware (its matcher excludes any path with a file extension) and `next.config.ts` no
 * longer sets the other three anywhere, so all three carry `nosniff` only — the OG route in
 * particular, meant to be fetched and displayed by whatever renders a shared link's preview, must
 * never refuse framing either. A CSP with nonces is a separate, later item (Gate A).
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

test('the OG route carries nosniff only — never the document headers (W160)', async ({
  request,
}) => {
  // 'site' is OG_PAGE_KEYS' own always-valid fallback (src/lib/seo/routes.ts) — valid whatever
  // page keys exist today. Like a static chunk, it never reaches src/proxy.ts (config.matcher
  // excludes any path with a file extension), so it must still be fetchable wherever a shared
  // link's preview renders — and never carries X-Frame-Options: DENY.
  const res = await request.get('/og/tr/site.png');
  expect(res.status()).toBe(200);
  const headers = res.headers();
  expect(headers['x-content-type-options']).toBe('nosniff');
  for (const key of DOCUMENT_ONLY) expect(headers[key], `${key} on the OG route`).toBeUndefined();
});
