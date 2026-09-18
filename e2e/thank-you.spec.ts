import { test, expect } from '@playwright/test';

type DataLayerEntry = Record<string, unknown>;

const dataLayer = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;

test('the Turkish conversion page is noindex and fires the conversion once', async ({ page }) => {
  const res = await page.goto('/tesekkurler?form=hire');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveCount(1);

  await expect
    .poll(async () =>
      (await dataLayer(page)).filter((e) => e.event === 'conversion' && e.form_key === 'hire'),
    )
    .toHaveLength(1);
});

test('the English conversion page answers under /en', async ({ page }) => {
  const res = await page.goto('/en/thank-you?form=contact');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('an unknown form key renders the page without firing a conversion', async ({ page }) => {
  await page.goto('/tesekkurler?form=profile_select');
  await expect(page.locator('h1')).toHaveCount(1);
  expect((await dataLayer(page)).filter((e) => e.event === 'conversion')).toHaveLength(0);
});

test('the consent sheet shows once and stores the choice', async ({ page }) => {
  await page.goto('/');
  const banner = page.getByTestId('consent-banner');
  await expect(banner).toBeVisible();
  await expect(banner).toHaveAttribute('role', 'region');

  // Denied by default until the visitor chooses (D13): the inline script runs before any tag,
  // so `gtag` exists and the very first dataLayer entries are the denied defaults.
  const defaults = await page.evaluate(() => ({
    gtag: typeof (window as unknown as { gtag?: unknown }).gtag,
    first: Object.assign({}, (window as unknown as { dataLayer?: unknown[] }).dataLayer?.[0]),
  }));
  expect(defaults.gtag).toBe('function');
  expect(defaults.first).toMatchObject({
    0: 'consent',
    1: 'default',
    2: { ad_storage: 'denied', analytics_storage: 'denied' },
  });

  await banner.getByRole('button', { name: /kabul et/i }).click();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('ja_consent_v1'))).toBe('granted');

  await page.reload();
  await expect(page.getByTestId('consent-banner')).toHaveCount(0);
});
