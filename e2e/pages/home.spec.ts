import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';

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
 *  sample content (SampleTag), the team with the published founder, the guides from the blog rows. */
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
    const positions = ORDER.map((id) => ids.indexOf(id));
    positions.forEach((position, i) =>
      expect(position, `${ORDER[i]} is rendered`).toBeGreaterThanOrEqual(0),
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

test('the guides block: Turkish guides without a body are "yakında" cards, not links', async ({
  page,
}) => {
  await page.goto('/');
  const guides = page.getByTestId('guides');
  await expect(guides.getByTestId('guide-featured')).toBeVisible();
  const soon = await guides.getByTestId('guide-soon').count();
  expect(soon).toBeGreaterThan(0);
  await expect(guides.locator('a[href*="/blog/"]')).toHaveCount(0);
});
