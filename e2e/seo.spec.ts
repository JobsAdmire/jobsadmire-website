import { test, expect } from '@playwright/test';

// Canonicals, hreflang and the sitemap are built from SITE_URL — the production origin — not
// from the host the run happens to hit, so these stay jobsadmire.com URLs against localhost.
const ORIGIN = 'https://www.jobsadmire.com';

test('the home page has one h1, a canonical and all three hreflang links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  // `absoluteUrl` returns `${ORIGIN}/` for the TR root; Next normalises the lone trailing
  // slash away when it renders the tag (`trailingSlash: false`) — the same URL either way.
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

test('the sitemap lists both locales and omits the noindex routes', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain(`${ORIGIN}/isci-talebi`);
  expect(xml).toContain(`${ORIGIN}/en/hire-workers`);
  expect(xml).not.toContain('/tesekkurler');
  expect(xml).not.toContain('[slug]');
  // W4: /blog is noindex and out of the sitemap in both locales until 6 Turkish bodies exist
  expect(xml).not.toContain(`${ORIGIN}/blog`);
  expect(xml).not.toContain(`${ORIGIN}/en/blog`);
});

test('robots.txt serves the production rules and points at the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  // VERCEL_ENV is unset locally, so this is the production ruleset, not the preview one.
  const body = await res.text();
  expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  expect(body).toContain('Disallow: /tesekkurler');
});

test('every page carries the Organization/EmploymentAgency node', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('"@type":["Organization","EmploymentAgency"]');
});

test('the OG image route answers a PNG, is not locale-rewritten and rejects unknown keys', async ({
  request,
}) => {
  // Same host as the page under test, not ORIGIN: proves the route renders here, with its font.
  const res = await request.get('/og/tr/home.png');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  expect((await res.body()).subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  expect((await request.get('/og/en/hire.png')).status()).toBe(200);
  expect((await request.get('/og/tr/not-a-page.png')).status()).toBe(404);
  expect((await request.get('/og/de/home.png')).status()).toBe(404);
});
