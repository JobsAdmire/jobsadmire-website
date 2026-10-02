import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/ortak-olun', en: '/en/partner-with-us' } as const;
/** Canonicals, hreflang and og:image are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';
/** `bundle.settings` in the Phase A LOCAL bundle: the WhatsApp number is the main line's; every
 *  `tel:` on this page is the partner line (W176) — `settings.partnershipsPhone`, `null` since W208, so the main line. */
const WA = 'https://wa.me/905011240340';
const TEL = 'tel:+905011240340'; // W208: settings.partnershipsPhone is null → the main line (W176 fallback)
const isMobile = () => test.info().project.name === 'mobile';

/** W92: only `staging` and production carry the Operations door. Every other face — this task's
 *  localhost build (no door variables), any other Vercel preview — answers a valid submit with
 *  the D11 panel (`unauthorized`), deterministically and without filing a lead. On a door face
 *  the submitting cases skip: T14 owns real submissions. */
function onDoorFace(): boolean {
  const base =
    test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000';
  return /^(www\.|staging\.)?jobsadmire\.com$/.test(new URL(base).hostname);
}

/** partner.038 / 040 / 068 — the card radios' accessible names (`aria-labelledby`). */
const TRACK = {
  tr: {
    hr: 'Türkiye’deki İK ajansları',
    sourcing: 'Yurt dışındaki tedarik ortakları',
    institute: 'Eğitim kurumları',
  },
  en: {
    hr: 'HR agencies in Türkiye',
    sourcing: 'Sourcing partners abroad',
    institute: 'Training institutes',
  },
} as const;

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

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only data-lcp-slot, the two named placeholders, no leaked ids or tokens, signed metrics only (D26/W55/W1)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).not.toBeEmpty();
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // gradient hero — no photo slot (§10 #4)
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder') ?? '').sort());
    expect(placeholders).toEqual(['partner-portal-mobile', 'partner-portal-screen']);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bpartner\.\d{3}\b/); // a package id leaking as text
    const network = page.getByTestId('partner-network');
    await expect(network.locator('li')).toHaveCount(2);
    await expect(network).toContainText('13');
    await expect(network).toContainText('470+');
    // W176: every tel: the page renders (FAQ ask card, closing band) is the partner line (T5 review M6)
    const tels = await page
      .locator('#main a[href^="tel:"]')
      .evaluateAll((els) => [...new Set(els.map((el) => el.getAttribute('href')))]);
    expect(tels).toEqual([TEL]);
  });

  test(`${locale}: the designed sections in order, #tracks for the header CTA (W17/W152/W158), no logo band (W6)`, async ({
    page,
  }) => {
    // W163: the CTA target and its default form are server HTML, never lazy (T5 review M7)
    const html = await (await page.request.get(ROUTES[locale])).text();
    expect(html).toContain('id="tracks"');
    expect(html).toContain('data-testid="partner-form-hr"');
    await page.goto(ROUTES[locale]);
    const ids = [
      'partner-hero',
      'partner-chain',
      'partner-tracks',
      'partner-track-detail',
      'partner-process',
      'partner-portal',
      'partner-faq',
      'partner-closing',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toBeVisible();
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    await expect(page.getByTestId('partner-logos')).toHaveCount(0);
    await expect(page.locator('[id="tracks"]')).toHaveCount(1);
    await expect(page.locator('[id="closing"]')).toHaveCount(1);
    // CTA_BY_PATHNAME['/partner-with-us'] → this page's #tracks (partner.017/018)
    const cta = page.getByRole('banner').getByRole('link', { name: /^(Başvurun|Apply)/ });
    await expect(cta).toHaveAttribute('href', `${ROUTES[locale]}#tracks`);
    await expect(page.getByTestId('partner-chain').getByRole('link')).toHaveAttribute(
      'href',
      locale === 'tr' ? '/isci-talebi' : '/en/hire-workers',
    );
  });

  test(`${locale}: the HR track is the default; choosing sourcing swaps the panel, fires partner_track_select once and writes the hash (W26/W67/W96)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const names = TRACK[locale];
    await expect(page.getByRole('radio', { name: names.hr })).toBeChecked();
    await expect(page.getByTestId('partner-form-hr')).toHaveAttribute('data-form-key', 'hire');
    await expect(page.getByTestId('partner-form-sourcing')).toHaveCount(0);
    await expect(page.getByTestId('partner-form-institute')).toHaveCount(0);
    await page.locator('label[for="track-sourcing"]').click();
    await expect(page.getByRole('radio', { name: names.sourcing })).toBeChecked();
    await expect(page.getByTestId('partner-form-sourcing')).toHaveAttribute(
      'data-form-key',
      'partner',
    );
    await expect(page.getByTestId('partner-form-hr')).toHaveCount(0);
    expect(new URL(page.url()).hash).toBe('#track-sourcing');
    expect(await pushed(page, 'partner_track_select')).toEqual([
      { event: 'partner_track_select', page: ROUTES[locale], locale, track: 'sourcing' },
    ]);
    // Back to the HR card: the default is not a signal (the W67 enum has no `hr`).
    await page.locator('label[for="track-hr"]').click();
    await expect(page.getByTestId('partner-form-hr')).toBeVisible();
    expect(await pushed(page, 'partner_track_select')).toHaveLength(1);
  });
}

test('en: a #track-institute deep link preselects the institute panel and fires nothing', async ({
  page,
}) => {
  await page.goto(`${ROUTES.en}#track-institute`);
  await expect(page.getByTestId('partner-form-institute')).toBeVisible();
  await expect(page.getByRole('radio', { name: TRACK.en.institute })).toBeChecked();
  await expect(page.getByTestId('partner-form-hr')).toHaveCount(0);
  expect(await pushed(page, 'partner_track_select')).toEqual([]);
});

test('tr: the arrow keys move the radio group, keep focus on the chosen card, and each partner track fires once', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await page.getByRole('radio', { name: TRACK.tr.hr }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: TRACK.tr.sourcing })).toBeChecked();
  await expect(page.getByRole('radio', { name: TRACK.tr.sourcing })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: TRACK.tr.institute })).toBeChecked();
  await expect(page.getByTestId('partner-form-institute')).toBeVisible();
  expect((await pushed(page, 'partner_track_select')).map((e) => e.track)).toEqual([
    'sourcing',
    'institute',
  ]);
});

test('the sourcing and institute panels pass axe (the route sweep only sees the HR default)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  for (const key of ['sourcing', 'institute'] as const) {
    await page.locator(`label[for="track-${key}"]`).click();
    await expect(page.getByTestId(`partner-form-${key}`)).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include('[data-testid="partner-tracks"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        null,
        1,
      ),
    ).toEqual([]);
  }
});

test('metadata: package SEO strings, canonical, hreflang, OG image; one BreadcrumbList with the page own labels (W109), one FAQPage', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await expect(page).toHaveTitle(/^Recruitment Agency Partnership in Türkiye/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/partner-with-us`,
  );
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/ortak-olun`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/ortak-olun`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/en/partner.png`,
  );
  const nodes = await jsonLdNodes(page);
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList');
  expect(crumbs).toHaveLength(1);
  expect((crumbs[0].itemListElement as { name: string }[]).map((i) => i.name)).toEqual([
    'Home',
    'Partner With Us',
  ]);
  const faqs = nodes.filter((n) => n['@type'] === 'FAQPage');
  expect(faqs).toHaveLength(1);
  expect(faqs[0].mainEntity as unknown[]).toHaveLength(6);
  // the site-wide Organization node once — the design's per-page EmploymentAgency block is not repeated
  expect(
    nodes.filter((n) => Array.isArray(n['@type']) && n['@type'].includes('EmploymentAgency')),
  ).toHaveLength(1);
  await expect(
    page.getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]'),
  ).toHaveText('Partner With Us');
});

test('tr: the sourcing form requires the licence declaration AND the consent tick (W79), keeps what was typed, posts nothing', async ({
  page,
}) => {
  await page.goto(`${ROUTES.tr}#track-sourcing`);
  const form = page.getByTestId('partner-form-sourcing');
  await expect(form).toBeVisible();
  await form.getByLabel(/^Ajans adı/).fill('Karachi Manpower');
  await form.getByLabel(/^İletişim kişisi/).fill('Bilal Khan');
  await form.getByLabel(/^Ülke/).selectOption('PK');
  await form.getByLabel(/^İşe alım lisans numarası/).fill('OEP-1234');
  await form.getByLabel(/^E-posta/).fill('bilal@example.com');
  await form.getByLabel(/^Telefon \/ WhatsApp/).fill('+92 300 1234567');
  await form.getByRole('button', { name: /^Başvuruyu gönder/ }).click();
  await expect(form.locator('#f-partner-sourcing-licenceDeclaration-error')).toHaveText(
    'Bu alan zorunludur.',
  );
  await expect(form.locator('#f-partner-sourcing-consent-error')).toHaveText(
    'Devam etmek için aydınlatma metnini onaylamanız gerekir.',
  );
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByLabel(/^Ülke/)).toHaveValue('PK');
  await expect(form.getByLabel(/^Ajans adı/)).toHaveValue('Karachi Manpower');
});

test('tr: the HR-agency form (hire) ends on the D11 panel without a door (W92) — bare wa.me href, click-time prefill (W76/W95)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('partner-form-hr');
  await form.getByLabel(/^Ajans adı/).fill('Akdeniz İK A.Ş.');
  await form.getByLabel(/^İletişim kişisi/).fill('Ayşe Yılmaz');
  await form.getByLabel(/^Türkiye’deki şehir/).fill('Antalya');
  await form.getByLabel(/^Kurumsal e-posta/).fill('ayse@example.com');
  await form.getByLabel(/^Telefon \/ WhatsApp/).fill('+90 532 000 00 00');
  await form.getByRole('checkbox').check(); // W79: the consent tick
  await form.getByRole('button', { name: /^Başvuruyu gönder/ }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByLabel(/^Ajans adı/)).toHaveValue('Akdeniz İK A.Ş.');
  await expectBareWhatsAppFallback(page, panel, 'Akdeniz İK A.Ş.');
});

test('en: the institute form (partner) ends on the D11 panel without a door (W92)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(`${ROUTES.en}#track-institute`);
  const form = page.getByTestId('partner-form-institute');
  await expect(form).toBeVisible();
  await form.getByLabel(/^Institute name/).fill('Lahore Technical Institute');
  await form.getByLabel(/^Contact person/).fill('Sara Ahmed');
  await form.getByLabel(/^City/).fill('Lahore');
  await form.getByLabel(/^Country/).selectOption('PK');
  await form.getByLabel(/^Email/).fill('sara@example.com');
  await form.getByLabel(/^Phone \/ WhatsApp/).fill('+92 42 1234567');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: /^Send application/ }).click();
  await expect(form.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unauthorized');
  await expect(form.getByLabel(/^Country/)).toHaveValue('PK');
  expect(new URL(page.url()).pathname).toBe(ROUTES.en);
});

test('tr: the hero WhatsApp (static prefill, W95) and the FAQ ask card e-mail row (W83) fire their events with page_cta (W12)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const heroWa = page.getByTestId('partner-hero').locator(`a[href^="${WA}?text="]`);
  await expect(heroWa).toHaveCount(1);
  const href = (await heroWa.getAttribute('href')) ?? '';
  expect(decodeURIComponent(href.split('?text=')[1])).toBe(
    'Merhaba JobsAdmire, bir iş ortaklığı hakkında görüşmek istiyorum.',
  );
  await heroWa.click();
  const mail = page
    .getByTestId('partner-faq')
    .locator('a[href^="mailto:info@jobsadmire.com?subject="]');
  await expect(mail).toHaveCount(1);
  await mail.click();
  expect(await pushed(page, 'whatsapp_click')).toEqual([
    { event: 'whatsapp_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  expect(await pushed(page, 'email_click')).toEqual([
    { event: 'email_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
});

test('desktop: the sticky bar carries Call / WhatsApp / #tracks, tracks the call, pads the scroll by its height and yields to the closing band (W18/W81)', async ({
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
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(bar).toBeVisible();
  await expect(bar.locator(`a[href="${TEL}"]`)).toHaveCount(1);
  await expect(bar.locator(`a[href^="${WA}?text="]`)).toHaveCount(1); // the static prefill only (W95)
  await expect(bar.locator('a[href="#tracks"]')).toHaveCount(1);
  await bar.locator(`a[href="${TEL}"]`).click();
  expect(await pushed(page, 'call_click')).toEqual([
    { event: 'call_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  // delta 12 / D20: while the bar is up, a focused or scrolled-to control lands above it
  const height = await bar.evaluate((el) => (el as HTMLElement).offsetHeight);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom))
    .toBe(`${height}px`);
  await page.getByTestId('partner-closing').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom))
    .toBe('0px');
});
