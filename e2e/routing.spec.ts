import { test, expect } from '@playwright/test';
import { INDEXABLE_GATE_ROUTES } from './routes';

test('root is Turkish, unprefixed', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
});

test('/en is English', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('a superfluous /tr prefix redirects to the root form', async ({ page }) => {
  const res = await page.goto('/tr/isci-talebi');
  expect(new URL(page.url()).pathname).toBe('/isci-talebi');
  expect(res?.status()).toBe(200);
});

test('localized Turkish slug renders the internal route', async ({ page }) => {
  await page.goto('/isci-talebi');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.getByTestId('page-h1')).toBeVisible();
});

test('English slug under /en renders the internal route', async ({ page }) => {
  await page.goto('/en/hire-workers');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByTestId('page-h1')).toBeVisible();
});

test('the Link component emits the localized href', async ({ page }) => {
  // The desktop nav row's first entry is a next-intl <Link href="/hire-workers"> (the
  // `desktopNav` group, home.002) rendered on every page — in the DOM at every viewport, hidden
  // by CSS below lg — and the same row sits in the hamburger panel and the footer's employers
  // column. TR renders the Turkish slug, EN the prefixed English one. No link text is asserted:
  // the copy is the package's, the href is the routing layer's. (The header CTA is NOT the
  // anchor counted here: on `/` it is the homepage's own #proposal pair, W17/W50.)
  await page.goto('/');
  expect(await page.locator('a[href="/isci-talebi"]').count()).toBeGreaterThan(0);
  await page.goto('/en');
  expect(await page.locator('a[href="/en/hire-workers"]').count()).toBeGreaterThan(0);
});

// The page markup contract every port keeps (docs/ARCHITECTURE.md § Quality gate): one h1,
// tagged page-h1, with real copy — a `{placed}`-style token means a W1 metric placeholder was
// left unfilled, `undefined` means a missing package id rendered in production mode.
for (const route of INDEXABLE_GATE_ROUTES) {
  test(`page contract on ${route}: one h1 tagged page-h1 with real copy`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.locator('h1[data-testid="page-h1"]');
    await expect(h1).toHaveCount(1);
    const text = (await h1.innerText()).trim();
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
  });
}

test('API routes are not intercepted by the locale proxy', async ({ request }) => {
  // The handler's own refusal is the proof it was reached: 401 with a secret configured,
  // 503 without one. A locale-rewritten request could produce neither. The full status
  // matrix lives in e2e/ops.spec.ts.
  const res = await request.post('/api/revalidate');
  expect([401, 503]).toContain(res.status());
  expect(await res.json()).toHaveProperty('error');
});

test('the locale cookie uses our name', async ({ page, context }) => {
  // Two navigations on purpose: next-intl skips the cookie when the resolved locale already
  // matches the browser's accept-language, so a cold /en in an English browser sets nothing.
  await page.goto('/');
  await page.goto('/en');
  const names = (await context.cookies()).map((c) => c.name);
  expect(names).toContain('ja_locale');
  expect(names).not.toContain('NEXT_LOCALE');
});
