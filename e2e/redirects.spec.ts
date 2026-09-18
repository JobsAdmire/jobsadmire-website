import { test, expect } from '@playwright/test';

// Next may emit `location` as an absolute URL; resolve against the base and compare pathnames
// (and hash, where the redirect targets an anchor) rather than comparing raw header strings.
const base = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const target = (location: string | undefined | null, withHash = false) => {
  const u = new URL(location ?? '', base);
  return withHash ? `${u.pathname}${u.hash}` : u.pathname;
};

test.describe('legacy redirects (D21)', () => {
  test('/contact-us redirects to /en/contact', async ({ request }) => {
    const res = await request.get('/contact-us', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(target(res.headers()['location'])).toBe('/en/contact');
  });

  test('old /tr/* goes to the unprefixed Turkish slug', async ({ request }) => {
    const res = await request.get('/tr/hire-workers-in-turkey', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(target(res.headers()['location'])).toBe('/isci-talebi');
  });

  test('a dropped locale prefix goes to the /en equivalent', async ({ request }) => {
    const res = await request.get('/de/about', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(target(res.headers()['location'])).toBe('/en/about');
  });

  test('/home redirects to /en (301 row whose target is /)', async ({ request }) => {
    const res = await request.get('/home', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(target(res.headers()['location'])).toBe('/en');
  });

  test('/tr/home redirects to / (301 row whose target is /)', async ({ request }) => {
    const res = await request.get('/tr/home', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(target(res.headers()['location'])).toBe('/');
  });

  test('/job-detail/123 is gone (unbounded legacy space)', async ({ request }) => {
    const res = await request.get('/job-detail/123', { maxRedirects: 0 });
    expect(res.status()).toBe(410);
  });

  test('/blog/anything is gone (unbounded legacy space)', async ({ request }) => {
    const res = await request.get('/blog/anything', { maxRedirects: 0 });
    expect(res.status()).toBe(410);
  });

  test('/certifications redirects to the licence anchor on About', async ({ request }) => {
    const res = await request.get('/certifications', { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    // Assert exactly what legacy.json says for this rule (#lisans anchor on the EN About page).
    expect(target(res.headers()['location'], true)).toBe('/en/about#lisans');
  });
});
