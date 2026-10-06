import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';
import { settleMotion } from '../helpers/motion';

// W92: the door variables reach only production and the `staging` preview. Every other target —
// a local `next start`, a branch preview — has no write token, so a submission answers
// `unauthorized` without a network call and the kernel renders the D11 fallback panel:
// deterministic. On a door-on host the submitting cases skip (a real lead would land in
// Operations); the door-on path is T14's (staging, real Turnstile).
const DOOR_HOSTS = new Set(['jobsadmire.com', 'www.jobsadmire.com', 'staging.jobsadmire.com']);
const doorOn = (baseURL: string | undefined) =>
  DOOR_HOSTS.has(new URL(baseURL ?? 'http://localhost:3000').hostname);
type BundleJson = {
  settings: { whatsappNumber: string };
  collections: {
    rateConfig: { legalMinGross: number; sgkRates: { other: number } }[];
  };
};
// The committed TR bundle is the data these assertions follow, read with `readFileSync` like the
// contract tests (D23's import rule covers `src/**`; the site loads bundles only via the adapter).
const bundle = JSON.parse(readFileSync('src/content/local/bundle.tr.json', 'utf8')) as BundleJson;
const WA = `https://wa.me/${bundle.settings.whatsappNumber}`;
const rate = bundle.collections.rateConfig[0];
/** W2/W58: the teaser's monthly payroll for the General preset (1×), support off, the `other`
 *  tier — the engine's sum (gross + SGK) × n, snapped to 4 dp and rounded once (W144(a)). */
const payrollTR = (n: number) => {
  const gross = rate.legalMinGross * n;
  const exact = Math.round((gross + gross * rate.sgkRates.other) * 1e4) / 1e4;
  return `${new Intl.NumberFormat('tr-TR').format(Math.round(exact))} ₺`;
};

const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;
/** Owner 2026-10-05: every design section renders — the case bar and the pool with the design's
 *  sample content (SampleTag), the team with the published founder, the guides from the blog's
 *  published articles (W248: a locale with none leaves the guides out — `ORDER_OF`). */
const ORDER = [
  'hero',
  'hero-form',
  'hero-proof',
  'live-case-bar',
  'choice-cards',
  'pool',
  'calc-teaser',
  'process',
  'season-planner',
  'network',
  'team',
  'portal',
  'work-with-us',
  'guides',
  'faq',
  'cta-band',
];

const testIds = (page: Page) =>
  page
    .locator('[data-testid]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-testid') ?? ''));
const dataLayer = (page: Page, event: string) =>
  page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (entry) => entry.event === name,
      ),
    event,
  );
/** Below 461 px the lead card waits behind its mode buttons (W10); from 461 px it is open. */
async function openHeroForm(page: Page, mode: 'proposal' | 'callback') {
  const button = page.getByTestId(`hero-mode-${mode}`);
  if (await button.isVisible()) await button.click();
}
/** W76/W95: capture the click-time WhatsApp URL instead of opening a tab. */
const stubWindowOpen = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
const opened = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

for (const [route, lang] of [
  ['/', 'tr'],
  ['/en', 'en'],
] as const) {
  test(`homepage ${route}: the page contract and the design's section order`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveCount(1);
    // D26 (W233): the hero photo is licensed stock, so the image is the page's one LCP slot,
    // loaded and preloaded; the h1 carries none.
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('h1[data-testid="page-h1"]:not([data-lcp-slot])')).toHaveCount(1);
    await expectHeroPhoto(page.locator('img[data-lcp-slot="v4-hero"]'), '/hero/home.jpg');
    await expect(page.locator('[data-placeholder="v4-hero"]')).toHaveCount(0);
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
    for (const name of placeholders) expect(name).toBeTruthy(); // W55: never unnamed
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
    const ids = await testIds(page);
    // W248: the LOCAL bundle's one article is English, so the Turkish homepage has no guides
    const order = lang === 'tr' ? ORDER.filter((id) => id !== 'guides') : ORDER;
    if (lang === 'tr') expect(ids).not.toContain('guides');
    const positions = order.map((id) => ids.indexOf(id));
    positions.forEach((position, i) =>
      expect(position, `${order[i]} is rendered`).toBeGreaterThanOrEqual(0),
    );
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    // D23: the sample blocks wear the tag; the pool's photos are placeholders, never real photos.
    await expect(page.getByTestId('live-case-bar').locator('[data-sample-tag]')).toHaveCount(1);
    await expect(page.getByTestId('pool').locator('[data-sample-tag]')).toHaveCount(1);
    await expect(page.getByTestId('pool').locator('img')).toHaveCount(0);
    // W17/W152: CTA_BY_PATHNAME['/'] and every in-page CTA point here.
    await expect(page.locator('#proposal')).toHaveCount(1);
    await expect(page.getByTestId('hire-form')).toHaveAttribute('data-form-key', 'hire');
    // W95: the teaser's estimate link is the bare chat in the DOM.
    await expect(
      page.getByTestId('calc-teaser').locator('a[href^="https://wa.me/"]'),
    ).toHaveAttribute('href', WA);
    // The page's one FaqBlock → one FAQPage node (AEO only), beside the site-wide nodes.
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.filter((text) => text.includes('"@type":"FAQPage"'))).toHaveLength(1);
  });
}

test('the proposal form posts to hire: field errors first, then the fallback panel with a bare WhatsApp href (W3/W76/W79)', async ({
  page,
  baseURL,
}) => {
  test.skip(doorOn(baseURL), 'W92: never submit a test lead to a door-on target');
  await page.goto('/');
  await openHeroForm(page, 'proposal');
  const form = page.getByTestId('hire-form');
  // A missing required field or consent tick is a field error, never a door call.
  await form.locator('input[name="company"]').fill('Akdeniz Tekstil A.Ş.');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('input[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  await form.locator('input[name="name"]').fill('Ayşe Yılmaz');
  await form.locator('input[name="email"]').fill('ayse@example.com');
  await form.locator('input[name="phone"]').fill('+90 501 000 00 00');
  await form.locator('input[name="headcount"]').fill('15');
  const sector = form.locator('select[name="sector"]');
  if (await sector.isVisible()) {
    // from 461 px only — the design hides its optional fields on phones (W10)
    await sector.selectOption('factory');
    await form.locator('select[name="startWhen"]').selectOption('month1');
    await form.locator('input[name="city"]').fill('Antalya');
  }
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe('/');
  const wa = panel.locator('a[href^="https://wa.me/"]');
  await expect(wa).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await wa.click();
  const [url] = await opened(page);
  expect(decodeURIComponent(url ?? '')).toContain('Ayşe Yılmaz');
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    placement: 'form_fallback',
  });
});

test('call me back (phones only, as designed) posts to callback', async ({
  page,
  baseURL,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the mode buttons exist below 461 px only (W10)');
  test.skip(doorOn(baseURL), 'W92: never submit a test lead to a door-on target');
  await page.goto('/en');
  await page.getByTestId('hero-mode-callback').click();
  const form = page.getByTestId('callback-form');
  await expect(form).toHaveAttribute('data-form-key', 'callback');
  await expect(form.locator('input[name="name"]')).toBeFocused();
  await form.locator('input[name="name"]').fill('Mehmet Kaya');
  await form.locator('input[name="phone"]').fill('+90 532 000 00 00');
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe('/en');
});

test('the hero WhatsApp link carries only the fixed hire prefill and fires whatsapp_click (page_cta)', async ({
  page,
}) => {
  await page.goto('/');
  await openHeroForm(page, 'proposal');
  const link = page.getByTestId('hero-form').locator(`a[href^="${WA}?text="]`);
  await expect(link).toHaveCount(1);
  // Keep the tab here: a capture-phase preventDefault still lets React's handler run.
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true));
  await link.click();
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    placement: 'page_cta',
  });
});

test('the calculator teaser: server default, island on approach, engine figures, estimate composed on click (W2/W58/W95)', async ({
  page,
}) => {
  await page.goto('/');
  const teaser = page.getByTestId('calc-teaser');
  await expect(teaser.getByTestId('calc-monthly')).toHaveText(payrollTR(15));
  await teaser.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="calc-teaser"][data-island="ready"]')).toBeVisible();
  await page.locator('[data-testid="calc-teaser"] label', { hasText: '30 işçi' }).click();
  await expect(page.getByTestId('calc-monthly')).toHaveText(payrollTR(30));
  expect((await dataLayer(page, 'calculator_use')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    role: 'generalPreset',
    headcount: 30,
  });
  const wa = page.getByTestId('calc-teaser').locator('a[href^="https://wa.me/"]');
  await expect(wa).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await wa.click();
  expect(decodeURIComponent((await opened(page))[0] ?? '')).toContain(payrollTR(30));
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({
    placement: 'page_cta',
  });
});

test('the season planner hydrates on approach and answers a row selection', async ({ page }) => {
  await page.goto('/en');
  await page.getByTestId('season-planner').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="season-planner"][data-island="ready"]')).toBeVisible();
  await expect(page.locator('[data-now-marker]').first()).toBeAttached();
  const headline = page.getByTestId('season-headline');
  const before = await headline.innerText();
  await page.getByTestId('season-row-tourism').click();
  await expect(page.getByTestId('season-row-tourism')).toHaveAttribute('aria-pressed', 'true');
  await expect(headline).not.toHaveText(before);
});

test('the sample case bar rotates and pauses; the pool track pauses (D20 / WCAG 2.2.2)', async ({
  page,
}) => {
  await page.goto('/');
  const line = page.getByTestId('case-line');
  // textContent on both sides: toHaveText compares textContent, while innerText puts a newline
  // between the line's flex items — an innerText snapshot never equals (and always "differs from")
  // the live line, which hid both the rotation and the pause from this test.
  const first = (await line.textContent()) ?? '';
  expect(first.length).toBeGreaterThan(0);
  await expect(line).not.toHaveText(first, { timeout: 7000 });
  await page.getByTestId('case-toggle').click();
  await expect(page.getByTestId('case-toggle')).toHaveAttribute('aria-label', 'Oynat'); // paused
  const held = (await line.textContent()) ?? '';
  // leave the row (pointer and focus): only the toggle may hold the line now, not the hover/focus hold
  await page.mouse.move(0, 0);
  await page.getByTestId('case-toggle').blur();
  await page.waitForTimeout(5000); // > one 4.5 s rotation step
  await expect(line).toHaveText(held);
  const track = page.getByTestId('pool-track');
  // scroll by the (static) toggle: the running track is never "stable", so an actionability
  // scroll on the track itself waits forever
  await page.getByTestId('pool-toggle').click();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
});

test('the guides block (W248): published articles only — no "yakında" card; TR has none on LOCAL', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByTestId('guides')).toHaveCount(0);
  await expect(page.getByTestId('guide-soon')).toHaveCount(0);
  await page.goto('/en');
  const guides = page.getByTestId('guides');
  const featured = guides.getByTestId('guide-featured');
  await expect(featured).toBeVisible();
  await expect(featured).toHaveAttribute(
    'href',
    '/en/blog/turkey-work-permit-process-employer-guide',
  );
  await expect(guides.getByTestId('guides-list')).toHaveCount(0); // one post: no side list
  await expect(guides.getByTestId('guide-soon')).toHaveCount(0);
});

// W249 — the home with the fixture door's feed: the owner's ATV interview post (featured, no
// cover; in English too since W250) drives the press strip under the hero and the guides'
// featured card, on the TR and the EN home. Run against a
// server BUILT and started with BLOG_SOURCE=OPS and OPS_API_URL on e2e/mocks/careers-door.mjs
// (`npm run e2e:blog-ops`, which greps these blocks: the rest of this file assumes LOCAL).
test.describe('the press strip and the guides from the fixture door (E2E_BLOG_OPS=1)', () => {
  test.skip(
    process.env.E2E_BLOG_OPS !== '1',
    'needs a server built and started with BLOG_SOURCE=OPS on e2e/mocks/careers-door.mjs',
  );
  const ATV = '/blog/atv-vizyon-jobsadmire-haris-jiva-roportaji';
  const ATV_EN = '/en/blog/jobsadmire-on-atv-vizyon-founder-haris-jiva-interview';
  const POSTER = /media%2Fblog%2Fatv-vizyon-haris-jiva\.jpg/;

  test('TR: the strip sits between the hero and the case bar, one link to the interview', async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    const ids = await testIds(page);
    const at = (id: string) => ids.indexOf(id);
    expect(at('home-press')).toBeGreaterThan(at('hero-proof'));
    expect(at('home-press')).toBeLessThan(at('live-case-bar'));
    const strip = page.getByTestId('home-press');
    await expect(strip).toBeVisible();
    const link = strip.getByRole('link');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', ATV);
    await expect(link).toHaveAccessibleName(
      'ATV Vizyon’da JobsAdmire Kurucu Haris Jiva ile röportaj Röportajı izleyin →',
    );
    await expect(link.locator('img')).toHaveAttribute('src', POSTER);
    await expect(link.locator('img')).toHaveAttribute('alt', '');
    // a fixed height per band: 88 px, 74 px at ≤ 460 (the Pixel project is 412 px wide)
    const phone = testInfo.project.name === 'mobile';
    expect((await link.boundingBox())!.height).toBeCloseTo(phone ? 74 : 88, 0);
    // every line fits on one line at this width (truncation is the guard, not the plan)
    const clipped = await link
      .locator('strong, span.truncate')
      .evaluateAll((els) => els.filter((el) => el.scrollWidth > el.clientWidth).length);
    expect(clipped).toBe(0);
    // keyboard: the strip takes focus and shows the ring
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(link).toHaveCSS('outline-style', 'solid');
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${ATV}$`));
    await expect(page.getByTestId('article-video')).toBeVisible();
  });

  test('TR: the guides feature the interview with its poster, linking to the article', async ({
    page,
  }) => {
    await page.goto('/');
    const featured = page.getByTestId('guides').getByTestId('guide-featured');
    await expect(featured).toHaveAttribute('href', ATV);
    await expect(featured.locator('img')).toHaveAttribute('src', POSTER);
    await expect(featured).toContainText('ATV Vizyon');
  });

  test('EN (W250): the strip links to the English interview, in English', async ({ page }) => {
    await page.goto('/en');
    const ids = await testIds(page);
    expect(ids.indexOf('home-press')).toBeGreaterThan(ids.indexOf('hero-proof'));
    expect(ids.indexOf('home-press')).toBeLessThan(ids.indexOf('live-case-bar'));
    const link = page.getByTestId('home-press').getByRole('link');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', ATV_EN);
    await expect(link).toHaveAccessibleName(
      'JobsAdmire on ATV Vizyon Interview with founder Haris Jiva Watch the interview →',
    );
    await expect(link.locator('img')).toHaveAttribute('src', POSTER);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${ATV_EN}$`));
    await expect(page.getByTestId('article-video')).toBeVisible();
  });

  test('EN (W250): the guides feature the English interview with its poster', async ({ page }) => {
    await page.goto('/en');
    const guides = page.getByTestId('guides');
    const featured = guides.getByTestId('guide-featured');
    await expect(featured).toHaveAttribute('href', ATV_EN);
    await expect(featured.locator('img')).toHaveAttribute('src', POSTER);
    await expect(featured.locator('img')).toHaveAttribute(
      'alt',
      'ATV Vizyon: interview with JobsAdmire founder Haris Jiva',
    );
    // the English work-permit guide is the one side row
    await expect(guides.getByTestId('guides-list').locator('[data-guide-row]')).toHaveCount(1);
  });

  test('390 px: thumbnail and text in one compact row, no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const link = page.getByTestId('home-press').getByRole('link');
    await link.scrollIntoViewIfNeeded();
    const box = (await link.boundingBox())!;
    expect(box.height).toBeCloseTo(74, 0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const thumb = (await link.locator('img').boundingBox())!;
    expect([Math.round(thumb.width), Math.round(thumb.height)]).toEqual([88, 50]);
  });

  test('axe: the TR and the EN home with the strip are clean', async ({ page }) => {
    for (const path of ['/', '/en']) {
      await page.goto(path);
      await settleMotion(page);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      expect(
        results.violations,
        JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))),
      ).toEqual([]);
    }
  });
});
