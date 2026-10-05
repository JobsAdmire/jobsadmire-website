import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { settleMotion } from '../helpers/motion';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/temsilci-dogrulama', en: '/en/verify' } as const;
/** Canonicals, hreflang and JSON-LD URLs are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';
/** `bundle.settings.whatsappNumber` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';

/** W92: only `staging` and production carry the Operations door. Every other face — this task's
 *  localhost build (no door variables), any other Vercel preview — answers a valid report with the
 *  D11 panel (`unauthorized`) and an evidence pick with "could not be uploaded right now",
 *  deterministically and without filing anything. On a door face those cases skip: T14 owns real
 *  submissions and uploads. */
function onDoorFace(): boolean {
  const base =
    test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000';
  return /^(www\.|staging\.)?jobsadmire\.com$/.test(new URL(base).hostname);
}

/** The committed copy, read from disk (outside `src/`, so the D23 import rule does not apply). */
const json = (...parts: string[]) =>
  JSON.parse(readFileSync(join(process.cwd(), ...parts), 'utf8')) as unknown;
const S = {
  tr: (json('src', 'content', 'local', 'bundle.tr.json') as { strings: Record<string, string> })
    .strings,
  en: (json('src', 'content', 'local', 'bundle.en.json') as { strings: Record<string, string> })
    .strings,
};
type Sys = {
  verify: {
    lookup: { resultTitle: string; whatsapp: string };
    empty: { title: string };
    report: { submit: string };
  };
  form: { labels: Record<string, string>; evidence: Record<string, string> };
};
const SYS = {
  tr: (json('src', 'messages', 'tr.json') as { sys: Sys }).sys,
  en: (json('src', 'messages', 'en.json') as { sys: Sys }).sys,
};

type Pushed = Record<string, unknown>;
function pushed(page: Page, event: string): Promise<Pushed[]> {
  return page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (e) => e.event === name,
      ),
    event,
  );
}

/** Lets a test click a tel:/wa.me anchor without leaving the page: a capture-phase listener
 *  cancels the navigation; React's own click handler (the analytics push) still runs. */
async function neutraliseContactLinks(page: Page) {
  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (e) => {
        const a = (e.target as Element | null)?.closest?.(
          'a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me/"]',
        );
        if (a) e.preventDefault();
      },
      true,
    );
  });
}

/** Records what the page asks `window.open` to open (the click-time WhatsApp compositions). */
async function stubWindowOpen(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}
const opened = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

/** W76/W95: the fallback anchor's href is the bare chat; the prefilled URL (what the visitor
 *  typed) exists only in the window the click opens. */
async function expectBareWhatsAppFallback(page: Page, panel: Locator, typed: string) {
  const link = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(link).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await link.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(urls[0].split('?text=')[1])).toContain(typed);
}

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}
const typesOf = (n: JsonLdNode): string[] =>
  Array.isArray(n['@type']) ? n['@type'] : n['@type'] ? [n['@type']] : [];

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only LCP slot, no placeholder, the four anchors once, the sections in design order, the founder strip over the empty register frame, no leaked tokens (W6/D26/W17, parity 2026-10-05)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveText(`${S[locale]['verify.023']} ${S[locale]['verify.024']}`);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    // the founder's photo is committed: no labelled placeholder anywhere on the page (D26)
    await expect(page.locator('[data-placeholder]')).toHaveCount(0);
    for (const id of ['check', 'structure', 'report', 'faq'])
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    // S5.1: the FAQ is phones-only; the visible sections follow the design's order
    const visible = isMobile()
      ? ['verify-hero', 'verify-structure', 'verify-report', 'verify-faq']
      : ['verify-hero', 'verify-structure', 'verify-report'];
    if (!isMobile()) await expect(page.getByTestId('verify-faq')).toBeHidden();
    const tops = await page.evaluate(
      (ids) =>
        ids.map(
          (id) =>
            document.querySelector(`[data-testid="${id}"]`)?.getBoundingClientRect().top ??
            Number.NaN,
        ),
      visible,
    );
    expect(tops.every((y) => Number.isFinite(y))).toBe(true);
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    // owner ruling: the founder strip (published row) and NO people — the register frame's one
    // row is the empty register; no stats, people list, former strip or verdict (W6, D23)
    const founder = page.getByTestId('verify-founder');
    await expect(founder).toContainText('Haris Jiva');
    await expect(founder).toContainText('JA-REP-001');
    await expect(founder).toContainText(S[locale]['verify.061']);
    await expect(page.getByTestId('verify-feed-badge')).toHaveText(S[locale]['verify.220']);
    await expect(page.getByTestId('verify-empty')).toContainText(SYS[locale].verify.empty.title);
    for (const id of ['verify-stats', 'verify-register', 'verify-former'])
      await expect(page.getByTestId(id)).toHaveCount(0);
    await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
    expect(await page.locator('main').innerText()).not.toMatch(
      /\{[a-zA-Z]+\}|\{\{|undefined|\[object |verify\.\d{3}/,
    );
  });

  test(`${locale}: canonical, hreflang and JSON-LD — one BreadcrumbList of this page’s crumbs, one FAQPage of four pairs, the site-wide Organization only`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES[locale]}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES.en}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES.tr}`,
    );
    const nodes = await jsonLdNodes(page);
    const of = (type: string) => nodes.filter((n) => typesOf(n).includes(type));
    expect(of('BreadcrumbList')).toHaveLength(1);
    expect(of('FAQPage')).toHaveLength(1);
    expect(of('Organization')).toHaveLength(1); // the site-wide node only — never repeated here
    const crumbs = of('BreadcrumbList')[0] as { itemListElement: { item: string }[] };
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([
      locale === 'tr' ? `${ORIGIN}/` : `${ORIGIN}/en`,
      `${ORIGIN}${ROUTES[locale]}`,
    ]);
    expect((of('FAQPage')[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(4);
  });
}

test('tr: the header CTA lands on #report (W17/W152/W158)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const cta = page.getByRole('banner').locator(`a[href="${ROUTES.tr}#report"]`).first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/temsilci-dogrulama#report$/);
  await expect(page.locator('#report')).toBeInViewport();
});

test('tr: a lookup answers neutrally — never the red verdict — fires verify_lookup once, keeps the query out of every href, prefills WhatsApp on click (W6/W67/W95)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await stubWindowOpen(page);
  const card = page.getByTestId('verify-check');
  const input = card.getByRole('textbox', { name: S.tr['verify.032'] });
  await input.fill('JA');
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
  await input.fill('JA-REP-014');
  const result = page.getByTestId('verify-lookup-result');
  await expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
  await expect(result).toContainText(SYS.tr.verify.lookup.resultTitle);
  // S2.1: its own card below the hero, never inside the lookup card
  await expect(card.getByTestId('verify-lookup-result')).toHaveCount(0);
  await expect(page.locator('#verify [data-testid="verify-lookup-result"]')).toHaveCount(1);
  await expect(result).toContainText('JA-REP-014');
  for (const id of ['verify.048', 'verify.049'])
    await expect(page.locator('main')).not.toContainText(S.tr[id]);
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''));
  expect(hrefs.filter((h) => h.includes('JA-REP'))).toEqual([]);
  await expect.poll(async () => (await pushed(page, 'verify_lookup')).length).toBe(1);
  expect((await pushed(page, 'verify_lookup'))[0]).toEqual({
    event: 'verify_lookup',
    page: ROUTES.tr,
    locale: 'tr',
    outcome: 'register_unavailable',
  });
  await input.fill('JA-REP-0145');
  await expect(result).toContainText('JA-REP-0145');
  expect(await pushed(page, 'verify_lookup')).toHaveLength(1); // same query session
  const wa = result.getByRole('link', { name: SYS.tr.verify.lookup.whatsapp });
  await expect(wa).toHaveAttribute('href', WA);
  await wa.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(decodeURIComponent(urls[0].split('?text=')[1])).toBe(`${S.tr['verify.228']} JA-REP-0145`);
  expect((await pushed(page, 'whatsapp_click')).map((e) => e.placement)).toEqual(['page_cta']);
  await card.getByRole('button', { name: S.tr['verify.033'] }).click();
  await expect(input).toHaveValue('');
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
});

test('en: ?id= prefills the lookup and answers at once (V-1); the canonical ignores the query', async ({
  page,
}) => {
  await page.goto(`${ROUTES.en}?id=JA-REP-001`);
  await expect(page.getByTestId('verify-check').getByRole('textbox')).toHaveValue('JA-REP-001');
  await expect(page.getByTestId('verify-lookup-result')).toHaveAttribute(
    'data-outcome',
    'register_unavailable',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}${ROUTES.en}`,
  );
  await expect.poll(async () => (await pushed(page, 'verify_lookup')).length).toBe(1);
});

test('tr: a short description is reported on its field — nothing navigates, no panel (catalog min 20)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('fraud-form');
  await expect(form).toHaveAttribute('data-form-key', 'fraud');
  const description = form.getByRole('textbox', { name: S.tr['verify.096'], exact: true });
  await description.fill('çok kısa');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterName, exact: true })
    .fill('Test Bildiren');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterEmail, exact: true })
    .fill('bildiren@example.com');
  await form.getByRole('checkbox').check(); // W79
  await form.getByRole('button', { name: SYS.tr.verify.report.submit }).click();
  await expect(description).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#f-fraud-description-error')).toBeVisible();
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
});

test('tr: a valid report ends on the D11 panel without a door (W92) — values kept, bare wa.me, click-time prefill (W76)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('fraud-form');
  await form.getByRole('textbox', { name: S.tr['verify.094'], exact: true }).fill('Ali Veli');
  await form
    .getByRole('textbox', { name: S.tr['verify.096'], exact: true })
    .fill('Kendini JobsAdmire temsilcisi olarak tanıtan biri vize depozitosu istedi.');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterName, exact: true })
    .fill('Test Bildiren');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterEmail, exact: true })
    .fill('bildiren@example.com');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: SYS.tr.verify.report.submit }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByRole('textbox', { name: S.tr['verify.094'], exact: true })).toHaveValue(
    'Ali Veli',
  );
  await expectBareWhatsAppFallback(page, panel, 'Test Bildiren');
});

test('tr: evidence — a picked file goes to the upload action alone and, without a door, reads "could not be uploaded"; an oversize file is refused in the browser (W73/W101/W116)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: a door face would store the file — T14 owns real uploads');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('fraud-form');
  const input = form.getByLabel(SYS.tr.form.labels.evidence, { exact: true });
  await expect(input).not.toHaveAttribute('name'); // the bytes never ride the report
  await input.setInputFiles({
    name: 'shot.png',
    mimeType: 'image/png',
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  });
  const evidence = form.getByTestId('fraud-evidence');
  await expect(evidence).toContainText(SYS.tr.form.evidence.failed.replace('{name}', 'shot.png'));
  await expect(form.locator('input[type="hidden"][name="evidenceKeys"]')).toHaveCount(0);
  await input.setInputFiles({
    name: 'big.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(3 * 1024 * 1024 + 1),
  });
  await expect(evidence).toContainText(
    SYS.tr.form.evidence.tooBig.replace('{name}', 'big.png').replace('{maxMb}', '3'),
  );
});

test('tr: contact clicks fire page_cta — the empty state’s call and the report box’s WhatsApp (company prefill only, W12/W95)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  await page.getByTestId('verify-empty').getByRole('link', { name: S.tr['verify.051'] }).click();
  const reportWa = page
    .getByTestId('verify-report')
    .getByRole('link', { name: S.tr['verify.097'] });
  await expect(reportWa).toHaveAttribute(
    'href',
    `${WA}?text=${encodeURIComponent(S.tr['verify.229'])}`,
  );
  await reportWa.click();
  expect((await pushed(page, 'call_click')).map((e) => e.placement)).toEqual(['page_cta']);
  expect((await pushed(page, 'whatsapp_click')).map((e) => e.placement)).toEqual(['page_cta']);
});

/** S0s.1: the design's sticky mini search — desktop only, parked behind the header until the
 *  visitor passes 620 px, then on the page's one lookup query. W202's anchors bar is retired:
 *  no StickyCtaBar mounts (`--sticky-cta-h` is never published). */
test('en: the sticky mini search slides in past 620 px on desktop and shares the lookup query', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is desktop-only (hidden ≤ 700, Verify l. 262)');
  await page.goto(ROUTES.en);
  const bar = page.getByTestId('verify-sticky-search');
  await expect(bar).toHaveAttribute('aria-hidden', 'true');
  await expect(bar).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(bar).toBeVisible();
  await expect(bar).toHaveAttribute('data-sticky-subnav', '');
  const input = bar.getByRole('searchbox', { name: S.en['verify.032'] });
  await input.fill('JA-REP-022');
  await expect(page.getByTestId('verify-check').getByRole('textbox')).toHaveValue('JA-REP-022');
  await input.press('Enter');
  await expect(page.getByTestId('verify-lookup-result')).toBeInViewport();
  await expect(page.getByTestId('sticky-cta')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.style.getPropertyValue('--sticky-cta-h')),
  ).toBe('');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).toBeHidden();
});

test('mobile: the sticky mini search never shows', async ({ page }) => {
  test.skip(!isMobile(), 'phones only');
  await page.goto(ROUTES.en);
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(page.getByTestId('verify-sticky-search')).toBeHidden();
});

test('tr: the founder strip opens the founder’s record dialog — named, the May do / May never lists, no copy link in Phase A; Escape closes it and focus returns', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const open = page.getByTestId('verify-founder').getByRole('button', { name: S.tr['verify.062'] });
  await open.click();
  const dialog = page.getByRole('dialog', { name: 'Haris Jiva' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('JA-REP-001');
  for (const id of ['verify.117', 'verify.118', 'verify.198', 'verify.213'])
    await expect(dialog).toContainText(S.tr[id]);
  await expect(dialog.getByRole('button', { name: S.tr['verify.226'] })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
});

test('mobile tr: the register picker, the red-flag fold and the FAQ cards (M7/M8/M10)', async ({
  page,
}) => {
  test.skip(!isMobile(), 'the ≤ 700 px faces');
  await page.goto(ROUTES.tr);
  const frame = page.getByTestId('verify-register-frame');
  const picker = frame.getByRole('button', { name: new RegExp(S.tr['verify.227']) }).first();
  await expect(picker).toHaveAttribute('aria-expanded', 'false');
  await expect(frame.getByRole('button', { name: S.tr['verify.270'], exact: true })).toBeHidden();
  await picker.click();
  await frame.getByRole('button', { name: S.tr['home.132'], exact: true }).click();
  await expect(
    page.getByTestId('verify-register-panel').getByRole('heading', { level: 3 }),
  ).toHaveText(S.tr['home.132']);
  const report = page.getByTestId('verify-report');
  const more = report.getByRole('button', { name: S.tr['verify.231'] });
  await expect(report.locator('li').nth(3)).toBeHidden();
  await more.click();
  await expect(report.locator('li').nth(3)).toBeVisible();
  await expect(page.getByTestId('verify-faq')).toBeVisible();
});

test('en: axe stays clean with the lookup answer and an evidence refusal shown (states the route sweep never opens)', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await page.getByTestId('verify-check').getByRole('textbox').fill('JA-REP-014');
  await expect(page.getByTestId('verify-lookup-result')).toBeVisible();
  await page
    .getByTestId('fraud-form')
    .getByLabel(SYS.en.form.labels.evidence, { exact: true })
    .setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('x') });
  await expect(page.getByTestId('fraud-evidence')).toContainText('notes.txt');
  await settleMotion(page); // end states, never a mid-fade colour (motion.css)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id} ×${v.nodes.length}`)).toEqual([]);
});

test('tr: the language switch keeps the visitor on the verify page (W17)', async ({ page }) => {
  test.skip(isMobile(), 'the header switcher shows from 901 px; the hamburger carries it below');
  await page.goto(ROUTES.tr);
  await page.getByRole('banner').getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/verify$/);
  await expect(page.getByTestId('page-h1')).toHaveText(
    `${S.en['verify.023']} ${S.en['verify.024']}`,
  );
});
