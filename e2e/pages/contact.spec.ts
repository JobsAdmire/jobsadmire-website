import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/iletisim', en: '/en/contact' } as const;
/** Canonicals, hreflang and JSON-LD URLs are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';
/** `bundle.settings` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';

/** W92: only `staging` and production carry the Operations door. Every other face — this task's
 *  localhost build (no door variables), any other Vercel preview — answers a valid submit with the
 *  D11 panel (`unauthorized`), deterministically and without filing a lead. On a door face the
 *  submitting cases skip: T14 owns real submissions. */
function onDoorFace(): boolean {
  const base =
    test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000';
  return /^(www\.|staging\.)?jobsadmire\.com$/.test(new URL(base).hostname);
}

/** The rendered names the selectors use (W115: the package labels sit on the inputs). */
const COPY = {
  tr: {
    h1: 'İşi asıl yapan kişilerle konuşun',
    company: /^Firma adı/,
    name: /^Adınız/,
    email: /^E-posta/,
    phone: /^Telefon \/ WhatsApp/,
    subject: /^Pozisyonlar ve kişi sayısı/,
    submitHire: /^İşe alım talebimi gönder/,
    jobTopic: /İş arıyorum/,
    partnerTopic: /Ajans veya temsilci/,
    callbackToggle: /Şu anda konuşamıyor musunuz/,
    callbackSubmit: /^Arama talep et/,
    visitToggle: /^Bir gün ve saat seçin/,
    visitSubmit: /^Ziyaret saati talep edin/,
  },
  en: {
    h1: 'Talk to the people who do the work',
    company: /^Company name/,
    name: /^Your name/,
    email: /^Email/,
    phone: /^Phone \/ WhatsApp/,
    subject: /^Roles and headcount/,
    submitHire: /^Send my hiring request/,
    jobTopic: /I am looking for a job/,
    partnerTopic: /Agency or agent/,
    callbackToggle: /Can’t talk right now/,
    callbackSubmit: /^Request call/,
    visitToggle: /^Pick a day & time/,
    visitSubmit: /^Request a visit slot/,
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
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}
const typesOf = (n: JsonLdNode): string[] =>
  Array.isArray(n['@type']) ? n['@type'] : n['@type'] ? [n['@type']] : [];
const valuesOf = (inputs: Locator) =>
  inputs.evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only LCP slot, the named hero placeholder, #message once, the sections in design order, no leaked tokens (D26/W55/W17)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveText(COPY[locale].h1);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // the hero photo is a placeholder (§10 #4)
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
    expect(placeholders).toEqual(['contact-hero']);
    await expect(page.locator('#message')).toHaveCount(1);
    await expect(page.locator('#faq')).toHaveCount(1);
    const tops = await page.evaluate(() =>
      ['contact-hero', 'contact-message', 'contact-offices', 'contact-faq'].map(
        (id) =>
          document.querySelector(`[data-testid="${id}"]`)?.getBoundingClientRect().top ??
          Number.NaN,
      ),
    );
    expect(tops.every((y) => Number.isFinite(y))).toBe(true);
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    // After hydration (an unfilled template would read `{open}`) nothing leaks into the copy.
    await expect(page.getByTestId('live-status').first()).toHaveAttribute(
      'data-open',
      /^(true|false)$/,
    );
    expect(await page.locator('main').innerText()).not.toMatch(
      /\{[a-zA-Z]+\}|undefined|\[object |contact\.\d{3}/,
    );
  });

  test(`${locale}: JSON-LD — one ContactPage on the canonical URL with both lines, one BreadcrumbList of this page’s crumbs, one FAQPage of six pairs`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const nodes = await jsonLdNodes(page);
    const of = (type: string) => nodes.filter((n) => typesOf(n).includes(type));
    expect(of('ContactPage')).toHaveLength(1);
    expect(of('BreadcrumbList')).toHaveLength(1);
    expect(of('FAQPage')).toHaveLength(1);
    expect(of('Organization')).toHaveLength(1); // the site-wide node only — never repeated per page
    const contactPage = of('ContactPage')[0] as {
      url?: string;
      inLanguage?: string;
      mainEntity?: { contactPoint?: { telephone?: string }[] };
    };
    expect(contactPage.url).toBe(`${ORIGIN}${ROUTES[locale]}`);
    expect(contactPage.inLanguage).toBe(locale);
    expect(contactPage.mainEntity?.contactPoint?.map((p) => p.telephone)).toEqual([
      '+905011240340',
      '+905011240340', // W208: the partnerships point carries the main line while settings.partnershipsPhone is null
    ]);
    const crumbs = of('BreadcrumbList')[0] as { itemListElement: { item: string }[] };
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([
      locale === 'tr' ? `${ORIGIN}/` : `${ORIGIN}/en`,
      `${ORIGIN}${ROUTES[locale]}`,
    ]);
    expect((of('FAQPage')[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(6);
  });
}

test('tr: the header CTA lands on #message (W17/W152/W158)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const cta = page.getByRole('banner').locator('a[href="/iletisim#message"]').first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/iletisim#message$/);
  await expect(page.locator('#message')).toBeInViewport();
});

test('tr: every live pill hydrates from its offices row; the QR is inline SVG with no third-party image (R18/W14)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const pills = page.getByTestId('live-status');
  await expect(pills).toHaveCount(6); // hero, WhatsApp, the two phone lines, the two offices
  for (let i = 0; i < 6; i++)
    await expect(pills.nth(i)).toHaveAttribute('data-open', /^(true|false)$/);
  await expect(page.getByTestId('contact-qr').locator('svg[role="img"]')).toHaveCount(1);
  await expect(page.locator('img[src*="qrserver"]')).toHaveCount(0);
});

test('tr: the topic picker — the job card files nothing, partner swaps city for the licence, contact_topic carries the key only (W3/W12/W114)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const card = page.getByTestId('contact-message');
  const form = page.getByTestId('contact-enquiry-form');
  await expect(form.locator('input[name="topic"]')).toHaveValue('hire');
  await card.locator('label', { has: page.getByRole('radio', { name: COPY.tr.jobTopic }) }).click();
  await expect(page.getByTestId('contact-jobseeker')).toBeVisible();
  await expect(form).toHaveCount(0);
  await expect(page.getByTestId('contact-jobseeker').locator(`a[href^="${WA}?text="]`)).toHaveCount(
    1,
  );
  await card
    .locator('label', { has: page.getByRole('radio', { name: COPY.tr.partnerTopic }) })
    .click();
  await expect(form.locator('input[name="topic"]')).toHaveValue('partner');
  await expect(form.locator('input[name="licence"]')).toHaveCount(1);
  await expect(form.locator('input[name="city"]')).toHaveCount(0);
  const events = await pushed(page, 'contact_topic');
  expect(events.map((e) => e.topic)).toEqual(['job', 'partner']);
  for (const e of events) {
    expect(Object.keys(e).sort()).toEqual(['event', 'locale', 'page', 'topic']);
    expect(e).toMatchObject({ locale: 'tr', page: ROUTES.tr });
  }
});

test('tr: the enquiry ends on the D11 panel without a door (W92) — values kept, bare wa.me href, click-time prefill (W76/W95)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('contact-enquiry-form');
  await form.getByRole('textbox', { name: COPY.tr.company }).fill('Akdeniz Otel A.Ş.');
  await form.getByRole('textbox', { name: COPY.tr.name }).fill('Ayşe Yılmaz');
  await form.getByRole('textbox', { name: COPY.tr.email }).fill('ayse@example.com');
  await form.getByRole('textbox', { name: COPY.tr.phone }).fill('+90 532 000 00 00');
  await form.getByRole('textbox', { name: COPY.tr.subject }).fill('10 kaynakçı, 4 CNC operatörü');
  await form.getByRole('checkbox').check(); // W79: the consent tick
  await form.getByRole('button', { name: COPY.tr.submitHire }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByRole('textbox', { name: COPY.tr.company })).toHaveValue(
    'Akdeniz Otel A.Ş.',
  );
  await expectBareWhatsAppFallback(page, panel, 'Ayşe Yılmaz');
});

test('en: a missing required field is reported on its input; the typed values survive; nothing navigates', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  const form = page.getByTestId('contact-enquiry-form');
  await form.getByRole('textbox', { name: COPY.en.company }).fill('Acme Hotels');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: COPY.en.submitHire }).click();
  await expect(form.getByRole('textbox', { name: COPY.en.name })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(form.locator('#f-contact-enquiry-name-error')).toBeVisible();
  await expect(form.getByRole('textbox', { name: COPY.en.company })).toHaveValue('Acme Hotels');
  expect(new URL(page.url()).pathname).toBe(ROUTES.en);
});

test('en: the callback widget opens to a callback form — day and slot keys, name, phone, consent (W3/W79)', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  const toggle = page.getByRole('button', { name: COPY.en.callbackToggle });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByTestId('contact-callback-form')).toHaveCount(0);
  await toggle.click();
  const form = page.getByTestId('contact-callback-form');
  await expect(form).toHaveAttribute('data-form-key', 'callback');
  expect(await valuesOf(form.locator('input[name="day"]'))).toEqual([
    'today',
    'tomorrow',
    'this_week',
  ]);
  expect(await valuesOf(form.locator('input[name="slot"]'))).toEqual([
    '09-11',
    '11-13',
    '14-16',
    '16-18',
    'any',
  ]);
  await expect(form.getByRole('textbox', { name: COPY.en.name })).toBeVisible();
  await expect(form.getByRole('checkbox')).toBeVisible();
});

test('tr: the callback ends on the D11 panel without a door (W92)', async ({ page }) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  await page.getByRole('button', { name: COPY.tr.callbackToggle }).click();
  const form = page.getByTestId('contact-callback-form');
  await form.locator('input[name="slot"][value="14-16"]').check({ force: true }); // chips are sr-only radios
  await form.getByRole('textbox', { name: COPY.tr.name }).fill('Mehmet Kaya');
  await form.getByRole('textbox', { name: COPY.tr.phone }).fill('+90 532 000 00 00');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: COPY.tr.callbackSubmit }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  // W198: the chosen chip survives React 19's post-action form reset
  await expect(form.locator('input[name="slot"][value="14-16"]')).toBeChecked();
  await expectBareWhatsAppFallback(page, panel, 'Mehmet Kaya');
});

test('tr: book-a-visit — five ISO day chips from the Istanbul clock, five slots, the W3 trio, the D11 panel without a door', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const toggle = page.getByRole('button', { name: COPY.tr.visitToggle });
  if (await toggle.isVisible()) await toggle.click(); // ≤ 700 px the form sits behind the design's toggle
  const form = page.getByTestId('contact-visit-form');
  await expect(form).toHaveAttribute('data-form-key', 'visit');
  const days = form.locator('input[name="preferredDate"][type="radio"]');
  await expect(days).toHaveCount(5); // after hydration — the server sends a plain date input
  for (const value of await valuesOf(days)) expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await expect(form.locator('input[name="preferredTime"]')).toHaveCount(5);
  await days.first().check({ force: true });
  await form.locator('input[name="preferredTime"][value="11:00"]').check({ force: true });
  await form.getByRole('textbox', { name: COPY.tr.name }).fill('Ayşe Yılmaz');
  await form.getByRole('textbox', { name: COPY.tr.email }).fill('ayse@example.com');
  await form.getByRole('textbox', { name: COPY.tr.phone }).fill('+90 532 000 00 00');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: COPY.tr.visitSubmit }).click();
  await expect(form.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unauthorized');
  // W198: the chosen slot chip survives the post-action form reset
  await expect(form.locator('input[name="preferredTime"][value="11:00"]')).toBeChecked();
});

test('tr: contact clicks fire their placements — page_cta from the hero cards, office_card from the office rows (W12)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const hero = page.getByTestId('contact-hero');
  await hero.locator(`a[href^="${WA}?text="]`).first().click();
  await hero.locator('a[href="tel:+905011240340"]').first().click();
  await page.getByTestId('contact-offices').locator('article a[href^="tel:"]').first().click();
  expect(await pushed(page, 'whatsapp_click')).toEqual([
    expect.objectContaining({ placement: 'page_cta', locale: 'tr', page: ROUTES.tr }),
  ]);
  expect(await pushed(page, 'call_click')).toEqual([
    expect.objectContaining({ placement: 'page_cta' }),
    expect.objectContaining({ placement: 'office_card' }),
  ]);
});

test('en: axe stays clean with the callback open and the job-seeker panel shown (states the route sweep never opens)', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await page.getByRole('button', { name: COPY.en.callbackToggle }).click();
  await expect(page.getByTestId('contact-callback-form')).toBeVisible();
  await page
    .getByTestId('contact-message')
    .locator('label', { has: page.getByRole('radio', { name: COPY.en.jobTopic }) })
    .click();
  await expect(page.getByTestId('contact-jobseeker')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id} ×${v.nodes.length}`)).toEqual([]);
});

test('tr: the language switch keeps the visitor on the contact page (W17)', async ({ page }) => {
  test.skip(isMobile(), 'the header switcher shows from 901 px; the hamburger carries it below');
  await page.goto(ROUTES.tr);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    `${ORIGIN}${ROUTES.en}`,
  );
  await page.getByRole('banner').getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/contact$/);
  await expect(page.getByTestId('page-h1')).toHaveText(COPY.en.h1);
});
