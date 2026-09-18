import { test, expect } from '@playwright/test';

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
  await expect(page.getByTestId('hire-h1')).toHaveText('tr');
});

test('English slug under /en renders the internal route', async ({ page }) => {
  await page.goto('/en/hire-workers');
  await expect(page.getByTestId('hire-h1')).toHaveText('en');
});

test('the Link component emits the localized href', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a', { hasText: 'hire' })).toHaveAttribute('href', '/isci-talebi');
});

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
