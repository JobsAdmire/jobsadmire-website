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

test('the desktop nav row appears from 901px, the hamburger below it, nothing overflows (W11)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 901, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menü' })).toBeHidden();

  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Menü' })).toBeVisible();

  // 1100 is the tight one: the row is on, the links are 12px and may wrap inside the nav
  for (const width of [901, 1000, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
  }
});

test('the header CTA follows the page (W17)', async ({ page }) => {
  await page.goto('/');
  // accessible name is "Talep" below xl (the tail span is display:none) and "Talep Oluştur" from xl
  await expect(page.getByRole('banner').getByRole('link', { name: /^Talep/ })).toHaveAttribute(
    'href',
    '/#proposal',
  );
  await page.goto('/isci-talebi');
  await expect(page.getByRole('banner').getByRole('link', { name: /^Talep/ })).toHaveAttribute(
    'href',
    '/isci-talebi#request-form',
  );
});

test('the secondary CTA and the slim-bar contact links hide below their breakpoint, not at every width (W119)', async ({
  page,
}) => {
  await page.goto('/');
  // role+name, scoped to the header — never the copy's package id (W119 review note).
  const secondaryCta = page.getByRole('banner').getByRole('link', { name: 'İş Ortağı Olun' });
  // The slim bar has no landmark role; `div.bg-navy` is its own root (the footer's equivalent
  // background sits on a `<footer>`, not a `div`), so this scopes to the slim bar's copy of the
  // phone link, not the footer's contact-column one — never a data attribute keyed to a label id.
  const phoneLink = page
    .locator('div.bg-navy')
    .first()
    .getByRole('link', { name: '+90 501 124 03 40' });

  await page.setViewportSize({ width: 1100, height: 900 });
  await expect(secondaryCta).not.toBeVisible();
  await page.setViewportSize({ width: 1101, height: 900 });
  await expect(secondaryCta).toBeVisible();

  await page.setViewportSize({ width: 900, height: 900 });
  await expect(phoneLink).not.toBeVisible();
  await page.setViewportSize({ width: 901, height: 900 });
  await expect(phoneLink).toBeVisible();
});
