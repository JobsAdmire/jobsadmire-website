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
  const res = await request.post('/api/revalidate');
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

test('the locale cookie uses our name', async ({ page, context }) => {
  await page.goto('/en');
  const names = (await context.cookies()).map((c) => c.name);
  expect(names).not.toContain('NEXT_LOCALE');
});
