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

// W180, widened by W228 (owner): the content container is 1240 px with 36 px gutters from 1101 (the
// design's 1280/48 wrapper at 0.75 was 960 px), the authored 48 px at 901–1100, 20 px below — while the slim bar and the
// header row stay full-bleed (padding only), as the design draws them. Final pass A2 (W184): the
// header row pads the design's own `.ja-nav` 14 px below 901 and 12 px at ≤ 460.
test('the content container is 1240 px from 1101 and the slim bar and header rows are full-bleed (W180, W228)', async ({
  page,
}) => {
  await page.goto('/');
  const measure = () =>
    page.evaluate(() => {
      const pad = (el: Element) => parseFloat(getComputedStyle(el).paddingLeft);
      const footerRow = document.querySelector('footer > .container-site')!;
      const header = document.querySelector('header > div')!;
      const slim = document.querySelector('div[role="region"].bg-navy > div')!;
      return {
        viewport: document.documentElement.clientWidth,
        gutter: pad(footerRow),
        content: footerRow.clientWidth - 2 * pad(footerRow),
        headerWidth: header.getBoundingClientRect().width,
        headerPad: pad(header),
        slimWidth: slim.getBoundingClientRect().width,
        slimPad: pad(slim),
      };
    });
  for (const [width, gutter, headerPad] of [
    [1920, 36, 24],
    [1440, 36, 24],
    [1280, 36, 24],
    [1101, 36, 24],
    [1100, 48, 32],
    [901, 48, 32],
    [900, 20, 14],
    [461, 20, 14],
    [460, 20, 12],
    [390, 20, 12],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    const m = await measure();
    const content =
      width >= 1101 ? Math.min(1240, m.viewport - 2 * gutter) : m.viewport - 2 * gutter;
    expect(m.gutter, `${width}px container gutter`).toBe(gutter);
    expect(m.content, `${width}px content box`).toBe(content);
    expect(m.headerWidth, `${width}px header row`).toBe(m.viewport);
    expect(m.headerPad, `${width}px header padding`).toBe(headerPad);
    expect(m.slimWidth, `${width}px slim bar row`).toBe(m.viewport);
    expect(m.slimPad, `${width}px slim bar padding`).toBe(gutter);
  }
});

// W183: the header renders the design's full wordmark — 30 px tall below 901 (the design's ≤ 900
// `.ja-nav img` rule), the authored 34 px at 901–1100, 34 × 0.75 = 25.5 px from 1101 (D19) — in
// its own ratio (never squeezed on these routes), and the row still never overflows.
test('the header wordmark renders at the design heights and nothing overflows (W183)', async ({
  page,
}) => {
  const ratio = 742 / 146; // public/brand/logo.png
  for (const route of ['/', '/en']) {
    await page.goto(route);
    for (const [width, height] of [
      [390, 30],
      [460, 30],
      [900, 30],
      [901, 34],
      [1000, 34],
      [1100, 34],
      [1101, 25.5],
      [1440, 25.5],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      const logo = page.getByRole('banner').getByRole('img', { name: 'JobsAdmire' });
      await expect(logo).toBeVisible();
      const m = await logo.evaluate((img: HTMLImageElement) => {
        const r = img.getBoundingClientRect();
        return { w: r.width, h: r.height, src: decodeURIComponent(img.currentSrc) };
      });
      expect(m.src, `${route} ${width}px`).toContain('/brand/logo.png');
      expect(m.h, `${route} ${width}px logo height`).toBeCloseTo(height, 0);
      // next/image serves a resized variant (256 or 384 px wide) whose rounded height moves the
      // ratio by < 1 %, so the width can sit ~1 px off 742/146 — a squeezed logo loses tens of px
      expect(Math.abs(m.w - height * ratio), `${route} ${width}px logo width`).toBeLessThanOrEqual(
        2,
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

// W180 follow-through: the design's footer sets its five columns in one row of the content box.
test('the footer keeps its five columns in one row at 1440 (W180, D19)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const tops = await page.evaluate(() =>
    [...document.querySelectorAll('footer > .container-site:first-child > *')]
      .filter((el) => getComputedStyle(el).display !== 'none')
      .map((el) => Math.round(el.getBoundingClientRect().top)),
  );
  expect(tops).toHaveLength(5);
  expect(new Set(tops).size).toBe(1);
});

test('the header CTA follows the page (W17)', async ({ page }) => {
  await page.goto('/');
  // accessible name is "Talep Oluştur" below 901 and from 1101 (the design's `.ja-cta-long`
  // shows at ≤ 900 and ≥ 1101 — final pass A4) and "Talep" at 901–1100 (the tail span is
  // display:none there)
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
  // `.bg-navy` is the slim bar's own root (the footer's equivalent background sits on a
  // `<footer>`, not a `div` — the slim bar is a `role="region"` landmark since M1/§8 F, but this
  // scopes by class regardless, so it never depends on that): `a[href^="tel:"]` finds its phone
  // link by HREF, never the bundle's `phoneDisplay` text (M4) — a copy change cannot break this.
  const phoneLink = page.locator('.bg-navy a[href^="tel:"]').first();

  await page.setViewportSize({ width: 1100, height: 900 });
  await expect(secondaryCta).not.toBeVisible();
  await page.setViewportSize({ width: 1101, height: 900 });
  await expect(secondaryCta).toBeVisible();

  await page.setViewportSize({ width: 900, height: 900 });
  await expect(phoneLink).not.toBeVisible();
  await page.setViewportSize({ width: 901, height: 900 });
  await expect(phoneLink).toBeVisible();
});

// N9 (final re-review): the rendered outcome of the three W155 cascade fixes — the static class
// scan and the jsdom class checks guard the class lists, not what the cascade makes of them (a
// Tailwind upgrade that changed rule order would pass both). Desktop project only: Tailwind 4
// gates `hover:` behind `(hover: hover)`, which the touch-emulated mobile project never matches.
test('the W155 colours render at 1440: header CTA ink, blue-safe on hover; slim-bar pills sky; footer store badge white', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', '`hover:` needs (hover: hover)');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const cta = page.getByRole('banner').getByRole('link', { name: /^Talep/ });
  await expect(cta).toHaveCSS('background-color', 'rgb(22, 32, 46)'); // ink
  await cta.hover();
  await expect(cta).toHaveCSS('background-color', 'rgb(16, 115, 168)'); // blue-safe
  // The slim bar's two pills — /verify (accent) and the portal chooser — found by href inside the
  // bar's own root, never by copy.
  for (const href of ['/temsilci-dogrulama', '/portal-girisi']) {
    await expect(page.locator(`div[role="region"].bg-navy a[href="${href}"]`)).toHaveCSS(
      'color',
      'rgb(127, 208, 245)', // sky
    );
  }
  // The footer renders its columns twice (desktop columns + the mobile accordion): the visible one.
  await expect(
    page
      .getByRole('contentinfo')
      .locator('a[href^="https://play.google.com/"]')
      .filter({ visible: true }),
  ).toHaveCSS('color', 'rgb(255, 255, 255)');
});
