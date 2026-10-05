import { readFileSync } from 'node:fs';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';

const ROUTES = { tr: '/adaylar', en: '/en/available-workers' } as const;
type Loc = keyof typeof ROUTES;
/** Canonicals, hreflang and og:image are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';

type Json = Record<string, unknown>;
/** Read, never imported: the committed bundles and message catalogues — exactly what the build
 *  rendered (the gate runs from the repo root). */
const readJson = (path: string): Json => JSON.parse(readFileSync(path, 'utf8')) as Json;
const BUNDLE: Record<Loc, Json> = {
  tr: readJson('src/content/local/bundle.tr.json'),
  en: readJson('src/content/local/bundle.en.json'),
};
const S = {
  tr: BUNDLE.tr.strings as Record<string, string>,
  en: BUNDLE.en.strings as Record<string, string>,
};
const SYS: Record<Loc, Json> = {
  tr: readJson('src/messages/tr.json').sys as Json,
  en: readJson('src/messages/en.json').sys as Json,
};
/** `sys.<path>` in one locale — e.g. `sysText('en', 'workers.pool.filter')`. */
const sysText = (locale: Loc, path: string): string =>
  path.split('.').reduce<unknown>((node, key) => (node as Json)[key], SYS[locale]) as string;

const SETTINGS = BUNDLE.tr.settings as { whatsappNumber: string; phone: string; email: string };
const WA = `https://wa.me/${SETTINGS.whatsappNumber}`;
const TEL = `tel:${SETTINGS.phone}`;
/** The one prefill every wa.me link on this page carries (availworkers.224, W95). */
const waHire = (locale: Loc) => `${WA}?text=${encodeURIComponent(S[locale]['availworkers.224'])}`;
const isMobile = () => test.info().project.name === 'mobile';
const escapeRe = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A label matcher anchored at the start — a required field's label reads "Label *". */
const label = (text: string) => new RegExp(`^${escapeRe(text)}`);
/** A package string up to its first `{metric}` token — the static head of a filled string. */
const head = (text: string) => text.split('{')[0].trim();

/** M2: on phones the request card is collapsed behind its CTA until opened. */
async function openRequestForm(page: Page) {
  const cta = page.getByTestId('workers-form-cta');
  if (await cta.isVisible()) await cta.getByRole('button').click();
  await expect(page.getByTestId('workers-form')).toBeVisible();
}

/** W92: only `staging` and production carry the Operations door. A door-less face (this task's
 *  localhost build, any other preview) reports `ops.state: 'unconfigured'`, and the kernel then
 *  answers `unauthorized` without a network call — deterministic, no lead filed. */
async function doorless(page: Page): Promise<boolean> {
  const res = await page.request.get('/api/site-health');
  const body = (await res.json()) as { ops?: { state?: string } };
  return body.ops?.state === 'unconfigured';
}

function pushed(page: Page, event: string): Promise<Json[]> {
  return page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (e) => e.event === name,
      ),
    event,
  );
}

/** Lets a test click a tel:/mailto:/wa.me anchor without leaving the page: a capture-phase
 *  listener cancels the navigation; React's own click handler (the analytics push) still runs. */
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

/** W76/W95: the fallback anchor's href is the bare chat; the prefilled URL (what the visitor
 *  typed) exists only in the window the click opens. */
async function expectBareWhatsAppFallback(page: Page, panel: Locator, typed: string) {
  const link = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(link).toHaveAttribute('href', WA);
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
  await link.click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  expect(opened[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(opened[0].split('?text=')[1])).toContain(typed);
}

type JsonLdNode = Json & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1, the aw-hero photo holding the only data-lcp-slot, only the sample avatars as placeholders, no leaked id or token (D26/W55/W1/W233)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(page.locator('h1[data-lcp-slot]')).toHaveCount(0); // W233: the photo is the slot
    await expect(h1).toContainText(S[locale]['availworkers.025']);
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expectHeroPhoto(
      page.locator('img[data-lcp-slot="aw-hero"]'),
      '/hero/available-workers.jpg',
    );
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder') ?? ''));
    // the anonymised sample avatars are labelled image spots (blurred under a lock); nothing else
    expect(placeholders.length).toBeGreaterThan(0);
    for (const slot of placeholders) expect(slot).toMatch(/^aw-avatar-ja-\d+$/);
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    expect(text).not.toMatch(/\b(?:availworkers|hire|wp)\.\d{3}\b/); // a package id as text
  });

  test(`${locale}: the designed sections in order, #pool for the header CTA (W17/W152/W158), the design's sample pool under its sample tag`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'workers-hero',
      'workers-pool',
      'workers-verified',
      'workers-after',
      'workers-faq',
      'workers-closing',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el, id).toBeVisible();
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    for (const id of ['pool', 'pool-form', 'verified-steps', 'faq', 'pool-cta'])
      await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
    // CTA_BY_PATHNAME['/available-workers'] (availworkers.016 + home.003) → this page's #pool.
    expect(await page.locator(`header a[href="${ROUTES[locale]}#pool"]`).count()).toBeGreaterThan(
      0,
    );
    // the sample pool: the hero's live pill and the pool heading each wear the sample tag
    await expect(page.getByTestId('pool-live')).toContainText(S[locale]['availworkers.023']);
    await expect(page.getByTestId('workers-hero').locator('[data-sample-tag]')).toHaveCount(1);
    await expect(page.getByTestId('workers-pool').locator('[data-sample-tag]')).toHaveCount(1);
    await expect(page.getByTestId('workers-pool')).toContainText(S[locale]['availworkers.052']);
    await expect(page.getByTestId('pool-stats')).toContainText('200+');
    await expect(page.getByTestId('pool-grid').locator(':scope > li')).toHaveCount(
      isMobile() ? 6 : 9,
    );
    await expect(page.getByTestId('pool-empty')).toHaveCount(0);
    await expect(page.getByTestId('workers-form-head')).toContainText(
      S[locale]['availworkers.107'],
    );
    await expect(page.locator('#verified-steps li')).toHaveCount(4);
    await expect(page.getByTestId('workers-after').locator('ol > li')).toHaveCount(4);
    await expect(page.locator('#faq [data-accordion-trigger]')).toHaveCount(8);
    await expect(page.locator('#faq [data-accordion-trigger]').first()).toContainText(
      S[locale]['availworkers.210'],
    );
  });
}

test('en: metadata — the sys.seo.workers title and description, canonical, hreflang, OG image; one BreadcrumbList with the page own labels (W109), one FAQPage of eight', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await expect(page).toHaveTitle(sysText('en', 'seo.workers.title'));
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    sysText('en', 'seo.workers.description'),
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/available-workers`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/adaylar`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/adaylar`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/en/workers.png`,
  );
  const nodes = await jsonLdNodes(page);
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList');
  expect(crumbs).toHaveLength(1);
  expect((crumbs[0].itemListElement as { name: string }[]).map((i) => i.name)).toEqual([
    S.en['availworkers.021'],
    S.en['availworkers.022'],
  ]);
  const faqs = nodes.filter((n) => n['@type'] === 'FAQPage');
  expect(faqs).toHaveLength(1);
  expect(faqs[0].mainEntity as unknown[]).toHaveLength(8);
  // the site-wide Organization/EmploymentAgency node once — the design's per-page block is not repeated
  expect(
    nodes.filter((n) => Array.isArray(n['@type']) && n['@type'].includes('EmploymentAgency')),
  ).toHaveLength(1);
});

test('en: an empty submit answers field errors from the server action — nothing is posted, the page stays, the first invalid field takes focus (W79/D20)', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  const s = S.en;
  await openRequestForm(page);
  const form = page.getByTestId('workers-form');
  await form.getByRole('button', { name: label(s['availworkers.146']) }).click();
  const required = sysText('en', 'form.errors.required');
  for (const name of ['company', 'name', 'email', 'phone', 'city', 'trade'])
    await expect(form.locator(`#f-workers-${name}-error`), name).toHaveText(required);
  await expect(form.locator('#f-workers-consent-error')).toHaveText(
    sysText('en', 'form.errors.consent'),
  );
  await expect(form.getByLabel(label(s['availworkers.143']))).toBeFocused();
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe(ROUTES.en);
});

test('tr: a valid HR-agency request ends on the D11 panel without a door (W92) — role and values echoed, bare wa.me href, click-time prefill (W76/W95)', async ({
  page,
}) => {
  test.skip(!(await doorless(page)), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const s = S.tr;
  await openRequestForm(page);
  const form = page.getByTestId('workers-form');
  await form.getByRole('tab', { name: s['availworkers.147'] }).click();
  await expect(form.getByRole('tab', { name: s['availworkers.147'] })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(form.locator('input[type="hidden"][name="iAm"]')).toHaveValue('hr_agency');
  await expect(page.getByTestId('workers-form-head')).toContainText(s['availworkers.148']);
  await form.getByLabel(label(s['availworkers.150'])).fill('Akdeniz İK A.Ş.');
  await form.getByLabel(label(s['availworkers.044'])).fill('Gate Runner');
  await form.getByLabel(label(s['availworkers.045'])).fill('gate@example.com');
  await form.getByLabel(label(s['availworkers.046'])).fill('+90 501 124 03 40');
  await form.getByLabel(label(s['availworkers.047'])).fill('Antalya');
  await form.getByLabel(label(s['availworkers.151'])).fill('2 kaynakçı, 3 aşçı');
  await form.getByRole('checkbox').check(); // W79: the consent tick
  await form.getByRole('button', { name: label(s['availworkers.146']) }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible({ timeout: 15_000 });
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expect(panel).toBeFocused();
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  // The echo: the role and the typed values survive the failed submit.
  await expect(form.locator('input[type="hidden"][name="iAm"]')).toHaveValue('hr_agency');
  await expect(form.getByLabel(label(s['availworkers.044']))).toHaveValue('Gate Runner');
  expect(await page.locator('a[href*="Gate"], a[href*="kaynak"]').count()).toBe(0);
  await expectBareWhatsAppFallback(page, panel, 'Akdeniz İK A.Ş.');
});

test('desktop: the sticky bar carries Call / WhatsApp / #pool-form, tracks the call (W81) and yields to the closing band', async ({
  page,
}) => {
  test.skip(
    isMobile(),
    'the bar renders from 901 px; below it the mobile bottom bar owns the space',
  );
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toBeVisible();
  await expect(bar).toContainText(head(S.tr['availworkers.048'])); // 048 over homepageReplyHours
  await expect(bar).toHaveAttribute('data-tone', 'light');
  await expect(bar.locator(`a[href="${TEL}"]`)).toHaveCount(1);
  await expect(bar.locator(`a[href="${waHire('tr')}"]`)).toHaveCount(1); // the static prefill only (W95)
  await expect(bar.locator('a[href="#pool-form"]')).toHaveCount(1);
  await bar.locator(`a[href="${TEL}"]`).click();
  expect(await pushed(page, 'call_click')).toEqual([
    { event: 'call_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  await page.locator('#pool-cta').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});

test('tr: every wa.me link carries only the catalogued prefill (W95); a WhatsApp door and the ask-card e-mail fire page_cta (W12/W83)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const hrefs = await page
    .locator('main a[href^="https://wa.me/"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
  // the hero, the form footer, the FAQ ask card (its side copy and its phone copy after the list,
  // M7), the closing band — the sticky bar is not mounted at the top, the basket bar is empty
  expect(hrefs).toHaveLength(5);
  for (const href of hrefs) expect(href).toBe(waHire('tr'));
  // the hero's "Profil isteyin" on desktop; it gives way to the card's CTA on phones (M1)
  await page.locator('main a[href^="https://wa.me/"]').filter({ visible: true }).first().click();
  const subject = encodeURIComponent(sysText('tr', 'workers.ask.emailSubject'));
  const mail = page
    .getByTestId('workers-faq')
    .locator(`a[href="mailto:${SETTINGS.email}?subject=${subject}"]`);
  await expect(mail).toHaveCount(2); // the side copy (≥ 901 px) and the phone copy (M7)
  await mail.filter({ visible: true }).click();
  expect(await pushed(page, 'whatsapp_click')).toEqual([
    { event: 'whatsapp_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  expect(await pushed(page, 'email_click')).toEqual([
    { event: 'email_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
});

test('the language links keep the visitor on this page (W17)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/available-workers`,
  );
  // The switcher anchor is in the DOM at every viewport (hidden by CSS below the header row).
  await expect(page.locator('a[hreflang="en"]').first()).toHaveAttribute(
    'href',
    /\/en\/available-workers$/,
  );
  await page.goto(ROUTES.en);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('a[hreflang="tr"]').first()).toHaveAttribute('href', /\/adaylar$/);
});
