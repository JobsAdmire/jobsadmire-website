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
