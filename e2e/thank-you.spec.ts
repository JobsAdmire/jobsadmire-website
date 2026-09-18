import { test, expect } from '@playwright/test';

type DataLayerEntry = Record<string, unknown>;

const dataLayer = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;

const conversions = async (page: import('@playwright/test').Page, formKey: string) =>
  (await dataLayer(page)).filter((e) => e.event === 'conversion' && e.form_key === formKey);

test('the Turkish conversion page is noindex and fires the conversion once', async ({ page }) => {
  const res = await page.goto('/tesekkurler?form=hire');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveCount(1);

  await expect.poll(async () => conversions(page, 'hire')).toHaveLength(1);
  expect((await conversions(page, 'hire'))[0]).toMatchObject({
    page: '/tesekkurler',
    locale: 'tr',
  });

  // R37: a reload (or a back-forward restore) must not re-count the same lead — the
  // per-session key survives the navigation, and the fresh dataLayer stays empty of it.
  await page.reload();
  await page.waitForTimeout(300);
  expect(await conversions(page, 'hire')).toHaveLength(0);
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

test('no container id means no consent sheet, but the denied defaults still ship', async ({
  page,
}) => {
  await page.goto('/');
  // R38: the Phase A bundle carries `gtmId: null`, so nothing can fire and asking for consent
  // would be theatre. The accept/reject flow itself is covered in ConsentBanner.test.tsx.
  await expect(page.getByTestId('consent-banner')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('ja_consent_v1'))).toBeNull();

  // The defaults run regardless, before any tag: `gtag` exists and denies everything.
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
  expect(await page.locator('script[src*="googletagmanager.com"]').count()).toBe(0);

  // The withdrawal door is in the footer whether or not the sheet is mounted.
  await expect(page.getByRole('button', { name: 'Çerez tercihleri' })).toHaveCount(1);
});
