import { test, expect } from '@playwright/test';

// W19: three route groups, one chrome each. `page.locator` counts DOM nodes, so the fixed
// social rail (display:none below xl) counts under both Playwright projects; `getByRole`
// would skip it on the mobile project.
const RAIL_OR_FOOTER_INSTAGRAM = 'a[aria-label="Instagram"]';
const WHATSAPP_FAB = 'a.fixed[href^="https://wa.me/"]';

test('the default chrome carries the social rail and FAB; the minimal chrome does not', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  // rail + footer social row
  expect(await page.locator(RAIL_OR_FOOTER_INSTAGRAM).count()).toBe(2);
  expect(await page.locator(WHATSAPP_FAB).count()).toBe(1);

  await page.goto('/tesekkurler?form=hire');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  // footer only — no rail, no FAB on the conversion page
  expect(await page.locator(RAIL_OR_FOOTER_INSTAGRAM).count()).toBe(1);
  expect(await page.locator(WHATSAPP_FAB).count()).toBe(0);
});

test('an unmatched URL 404s inside the site chrome (R6 survives the route groups)', async ({
  page,
}) => {
  const res = await page.goto('/boyle-bir-sayfa-yok');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Sayfa bulunamadı');
});
