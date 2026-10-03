import { test, expect } from '@playwright/test';
import { expectedRobots } from './helpers/face';
import { INDEXABLE_GATE_ROUTES } from './routes';

// Canonicals, hreflang and the sitemap are built from SITE_URL — the production origin — not
// from the host the run happens to hit, so these stay jobsadmire.com URLs against localhost.
const ORIGIN = 'https://www.jobsadmire.com';

// `absoluteUrl` returns `${ORIGIN}/` for the TR root; Next normalises the lone trailing slash
// away when it renders the <link> tag (`trailingSlash: false`) — but keeps it in the sitemap's
// <loc>, so the two helpers below differ for `/` only.
const canonicalOf = (route: string) => (route === '/' ? ORIGIN : `${ORIGIN}${route}`);
const sitemapLocOf = (route: string) => (route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`);

test('the home page has one h1, a canonical and all three hreflang links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', ORIGIN);
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', ORIGIN);
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', ORIGIN);
});

test('an inner page canonicalises to its own localized URL', async ({ page }) => {
  await page.goto('/en/hire-workers');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/hire-workers`,
  );
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/isci-talebi`,
  );
});

// Every indexable gate route: self-referencing canonical, both locales + x-default = TR
// (docs/SEO.md — a page missing its own locale in hreflang is a defect), and no noindex.
for (const route of INDEXABLE_GATE_ROUTES) {
  test(`canonical + hreflang on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalOf(route));
    await expect(page.locator('link[hreflang="tr"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    const tr = await page.locator('link[hreflang="tr"]').getAttribute('href');
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', tr ?? '');
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  });
}

test('the sitemap lists every indexable gate route and omits the noindex ones', async ({
  request,
}) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const route of INDEXABLE_GATE_ROUTES) {
    expect(xml).toContain(`<loc>${sitemapLocOf(route)}</loc>`);
  }
  expect(xml).not.toContain('/tesekkurler');
  expect(xml).not.toContain('/thank-you');
  expect(xml).not.toContain('[slug]');
  // W4: /blog and /blog/[slug] are noindex and out of the sitemap below the 6-TR-bodies threshold.
  expect(xml).not.toMatch(/<loc>[^<]*\/blog(\/|<)/);
});

test('every sitemap URL answers 200 — no unbuilt route is advertised (W20)', async ({
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.length).toBeGreaterThan(0);
  for (const loc of locs) {
    const url = new URL(loc);
    expect(url.origin).toBe(ORIGIN);
    const res = await request.get(`${url.pathname}${url.search}`);
    expect(res.status(), loc).toBe(200);
  }
});

test("robots.txt matches this run's face and points at the sitemap in production", async ({
  request,
  baseURL,
}) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  // W104/W135: a Vercel preview is `Disallow: /` by design (src/app/robots.ts, VERCEL_ENV-driven,
  // prerendered at build) — the e2e process cannot read that server-side env var, so the
  // expectation comes from the one site-face helper (e2e/helpers/face.ts). The preview body is
  // asserted strictly: the production rules also contain `Disallow: /api/`, so a substring check
  // would pass a preview that wrongly serves the indexable production rules.
  const face = expectedRobots(baseURL ?? 'http://localhost:3000');
  if (face === 'preview') {
    expect(body).toMatch(/^Disallow: \/$/m);
    expect(body).not.toMatch(/^Allow:/m);
    expect(body).not.toContain('Sitemap:');
    return;
  }
  expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  expect(body).toContain('Disallow: /tesekkurler');
  // T13 (W20/W37, W104): a built noindex route is disallowed in both locales, by itself.
  for (const path of [
    '/portal-girisi',
    '/en/portal-login',
    '/abone-onay',
    '/en/newsletter/confirm',
    '/abonelikten-cik',
    '/en/newsletter/unsubscribe',
  ])
    expect(body).toContain(`Disallow: ${path}`);
  // W20/W37: an unbuilt noindex route (/blog today) is never named — nothing is asserted about it.
  expect(body).not.toContain('[slug]');
});

test('every page carries the Organization/EmploymentAgency node', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('"@type":["Organization","EmploymentAgency"]');
});

test('the generated OG image answers as a PNG and the home page points at it', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/tr/home.png`,
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/tr/home.png`,
  );
  // Same host as the page under test, not ORIGIN: proves the route renders here, with its font.
  const res = await request.get('/og/tr/home.png');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  expect((await res.body()).subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
});

test('the OG route is not locale-rewritten and rejects unknown keys', async ({ request }) => {
  expect((await request.get('/og/en/hire.png')).status()).toBe(200);
  expect((await request.get('/og/tr/not-a-page.png')).status()).toBe(404);
  expect((await request.get('/og/de/home.png')).status()).toBe(404);
});
