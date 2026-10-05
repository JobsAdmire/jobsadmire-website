import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';

type BundleJson = {
  strings: Record<string, string>;
  settings: { whatsappNumber: string; email: string };
  collections: { rateConfig: { reviewDueAt: string }[] };
};
type MessagesJson = {
  sys: { seo: { calc: { title: string } }; calc: { whatsapp: { generic: string } } };
};
// The committed LOCAL bundles and message catalogues are the data these assertions follow, read
// with `readFileSync` like the contract tests (D23's import rule covers `src/**`; the running
// site loads bundles only through the adapter).
const read = <T>(path: string) => JSON.parse(readFileSync(path, 'utf8')) as T;
const BUNDLE = {
  tr: read<BundleJson>('src/content/local/bundle.tr.json'),
  en: read<BundleJson>('src/content/local/bundle.en.json'),
};
const MSG = {
  tr: read<MessagesJson>('src/messages/tr.json'),
  en: read<MessagesJson>('src/messages/en.json'),
};
const s = (locale: 'tr' | 'en', id: string) => BUNDLE[locale].strings[id];
const ROUTES = { tr: '/maliyet-hesaplayici', en: '/en/hiring-cost-calculator' } as const;
const ORIGIN = 'https://www.jobsadmire.com';
const WA = `https://wa.me/${BUNDLE.tr.settings.whatsappNumber}`;
/** COPY_DELTAS model figures at the design defaults — welder × 1, full year, `other` tier (W142). */
const TOTALS = {
  tr: { monthly: '60.321 ₺', year: '751.852 ₺', five: '301.605 ₺' },
  en: { monthly: '₺60,321', year: '₺751,852', five: '₺301,605' },
} as const;
const BADGE = { tr: '2026 oranları · Ocak 2026 güncellemesi', en: s('en', 'calc.003') } as const;
const reviewDue =
  Date.now() >= Date.parse(`${BUNDLE.tr.collections.rateConfig[0].reviewDueAt}T00:00:00Z`);
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object |\bcalc\.\d{3}\b/;
const isMobile = () => test.info().project.name === 'mobile';
/** W92: the door variables reach only production and `staging`; every other target answers a
 *  valid submit with the D11 panel (`unauthorized`), deterministically. On a door face the
 *  submitting case skips — T14 owns real submissions. */
const DOOR_HOSTS = new Set(['jobsadmire.com', 'www.jobsadmire.com', 'staging.jobsadmire.com']);
const doorOn = () =>
  DOOR_HOSTS.has(
    new URL(test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000')
      .hostname,
  );

const dataLayer = (page: Page, event: string) =>
  page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (entry) => entry.event === name,
      ),
    event,
  );
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
type JsonLdNode = Record<string, unknown> & { '@type'?: string };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((text) => {
    const parsed = JSON.parse(text) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}
/** ≤ 700 px every content section waits behind its trigger (W10); open it, then bring it into
 *  view — the island inside loads 200 px before view (W13 amended). */
async function openSection(page: Page, id: string) {
  const toggle = page.locator(`#${id} button[aria-expanded]`).first();
  if ((await toggle.isVisible()) && (await toggle.getAttribute('aria-expanded')) === 'false')
    await toggle.click();
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
}

for (const locale of ['tr', 'en'] as const) {
  const route = ROUTES[locale];

  test(`${locale}: one h1 holding the only data-lcp-slot, the decorative calc-hero photo, the dated badge, no leaked ids or tokens (D17/D26/W1/W55/W233)`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    await expect(h1).toHaveText(
      `${s(locale, 'calc.004')} ${s(locale, 'calc.005')} ${s(locale, 'calc.006')}`,
    );
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    // W233: the hero photo is licensed stock — decorative and preloaded, never the LCP slot
    await expectHeroPhoto(
      page.getByTestId('calc-top').locator(`img[src*="hiring-cost-calculator.jpg"]`),
      '/hero/hiring-cost-calculator.jpg',
    );
    await expect(page.locator('img[data-lcp-slot]')).toHaveCount(0);
    await expect(page.locator('[data-placeholder="calc-hero"]')).toHaveCount(0);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
    if (reviewDue) await expect(page.getByTestId('calc-badge')).toHaveCount(0);
    else await expect(page.getByTestId('calc-badge')).toHaveText(BADGE[locale]);
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
  });

  test(`${locale}: #calculator is in the server HTML and the header CTA targets it; every section anchor exists once (W152/W158)`, async ({
    page,
  }) => {
    const html = await (await page.request.get(route)).text();
    expect(html).toContain('id="calculator"');
    await page.goto(route);
    for (const id of [
      'calculator',
      'basis',
      'salaries',
      'compare',
      'quota',
      'passcheck',
      'incentives',
      'penalties',
      'students',
      'faq',
      'calc-cta',
    ])
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    await expect(page.locator('#calculator')).toHaveClass(/\bprint-isolate\b/);
    const cta = page
      .getByRole('banner')
      .getByRole('link', { name: s(locale, 'calc.324'), exact: true })
      .first();
    await expect(cta).toHaveAttribute('href', `${route}#calculator`);
  });

  test(`${locale}: canonical, the hreflang pair, the calc OG image, sys.seo title; one BreadcrumbList and one FAQPage (W109/W123)`, async ({
    page,
  }) => {
    await page.goto(route);
    const other = locale === 'tr' ? 'en' : 'tr';
    await expect(page).toHaveTitle(MSG[locale].sys.seo.calc.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${route}`,
    );
    await expect(page.locator(`link[rel="alternate"][hreflang="${other}"]`)).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES[other]}`,
    );
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      'content',
      `${ORIGIN}/og/${locale}/calc.png`,
    );
    const nodes = await jsonLdNodes(page);
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(15);
    const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList') as unknown as {
      itemListElement: { name: string; item: string }[];
    }[];
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].itemListElement.map((i) => i.name)).toEqual([
      s(locale, 'calc.001'),
      s(locale, 'calc.002'),
    ]);
    expect(crumbs[0].itemListElement[1].item).toBe(`${ORIGIN}${route}`);
  });

  test(`${locale}: the skeleton paints the model before any interaction; the island loads on focus, recomputes and tracks the role key (W13 amended/W142/W12)`, async ({
    page,
  }) => {
    await page.goto(route);
    const card = page.getByTestId('calc-card');
    await expect(card).toHaveAttribute('data-island', 'idle');
    await expect(page.getByTestId('calc-monthly-total')).toHaveText(TOTALS[locale].monthly);
    await expect(page.getByTestId('calc-year-total')).toHaveText(TOTALS[locale].year);
    await expect(page.getByTestId('calc-island')).toHaveCount(0);
    // Arm first and wait for the island: a click that lands while the skeleton swaps could be lost.
    await page.getByTestId('calc-activate').focus();
    const island = page.getByTestId('calc-island');
    await expect(island).toBeVisible();
    await expect(card).toHaveAttribute('data-island', 'armed');
    await island.getByText('5', { exact: true }).click();
    await expect(page.getByTestId('calc-monthly-total')).toHaveText(TOTALS[locale].five);
    expect((await dataLayer(page, 'calculator_use')).at(-1)).toMatchObject({
      page: route,
      locale,
      role: 'welder',
      headcount: 5,
    });
  });
}

test('tr: opening the page at #calculator loads the island without a touch (the header CTA, W17)', async ({
  page,
}) => {
  await page.goto(`${ROUTES.tr}#calculator`);
  await expect(page.getByTestId('calc-island')).toBeVisible();
});

test('tr: the band opens the quote sheet; a valid submit ends on the D11 panel without a door; its WhatsApp href is bare (W3/W79/W92/W76/W95)', async ({
  page,
}) => {
  test.skip(doorOn(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  await page.getByTestId('calc-quote-open-band').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId('recap-total')).toHaveText(TOTALS.tr.year);
  const form = dialog.getByTestId('calc-quote-form');
  await expect(form).toHaveAttribute('data-form-key', 'calculator');
  await expect(form.locator('input[name="est_role"]')).toHaveValue('welder');
  await expect(form.locator('input[name="est_headcount"]')).toHaveValue('1');
  const submit = form.getByRole('button', { name: s('tr', 'calc.105'), exact: true });
  // 1. Empty submit → field errors (name, e-mail, the consent tick), no navigation.
  await submit.click();
  await expect(form.getByRole('alert').first()).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  // 2. Valid submit → no door → the fallback panel (D11), still no navigation.
  await form.getByLabel(/^Ad Soyad/).fill('Test Ziyaretçi');
  await form.getByLabel(/^E-posta/).fill('test@example.com');
  await form.locator('#f-calc-quote-consent').check();
  await submit.click();
  const panel = dialog.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  // 3. The prefill (the estimate + what was typed) exists only in the window the click opens.
  const wa = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(wa).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await wa.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  const text = decodeURIComponent(urls[0].split('?text=')[1]);
  expect(
    text.startsWith(
      'Merhaba JobsAdmire, maliyet hesaplayıcıyı kullandım: 1 × Kaynakçı, brüt 49.545 ₺, 12 aylık sözleşme.',
    ),
  ).toBe(true);
  expect(text).toContain('Test Ziyaretçi');
});

test('tr: the pass check never posts; "Send my result" composes the answers on click, its href stays bare (W95)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await openSection(page, 'passcheck');
  const view = page.getByTestId('pass-view');
  await expect(view).toHaveAttribute('data-live', 'true');
  const send = page.getByTestId('pass-send');
  await expect(send).toHaveAttribute('href', WA);
  await view.getByText(s('tr', 'calc.434'), { exact: true }).first().click();
  await expect(page.getByTestId('pass-verdict')).toHaveAttribute('data-tone', 'red');
  await stubWindowOpen(page);
  await send.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(urls[0].split('?text=')[1])).toContain(
    `1. ${s('tr', 'calc.445')} — ${s('tr', 'calc.434')}`,
  );
  await expect(send).toHaveAttribute('href', WA);
});

test('tr: the quota gate commits a typed staff count on Enter (W131)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  await openSection(page, 'quota');
  const suffix = isMobile() ? '-m' : '';
  await expect(page.getByTestId(`quota-view${suffix}`)).toHaveAttribute('data-live', 'true');
  const input = page.locator(`#calc-staff${suffix}`);
  await input.fill('9');
  await input.press('Enter');
  await expect(page.getByTestId(`quota-allowed${suffix}`)).toHaveText('1 yabancı işçi');
});

test('tr: ≤ 700 px the sections collapse behind their triggers and keep their h2 in the accessibility tree; from 701 px the bodies are open (W10/W119)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const basis = page.locator('#basis');
  const toggle = basis.getByRole('button', { name: new RegExp(s('tr', 'calc.060')) });
  const body = basis.getByTestId('section-body');
  await expect(basis.getByRole('heading', { level: 2, name: s('tr', 'calc.076') })).toHaveCount(1);
  if (isMobile()) {
    await expect(page.getByTestId('calc-jump')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(body).toBeHidden();
    await toggle.click();
    await expect(body).toBeVisible();
    await expect(body).toHaveAttribute('data-open', 'true');
  } else {
    await expect(page.getByTestId('calc-jump')).toBeHidden();
    await expect(toggle).toBeHidden();
    await expect(body).toBeVisible();
  }
});

test('desktop: Print isolates #calculator (print-isolate, PrintButton)', async ({ page }) => {
  test.skip(isMobile(), 'Print is desktop-only (design line 283)');
  await page.goto(ROUTES.tr);
  await page.getByTestId('calc-activate').focus();
  await expect(page.getByTestId('calc-island')).toBeVisible();
  await page.evaluate(() => {
    window.print = () => undefined;
  });
  await page
    .getByTestId('calc-island')
    .getByRole('button', { name: s('tr', 'calc.037'), exact: true })
    .click();
  await expect(page.locator('body')).toHaveClass(/\bprint-isolating\b/);
  await page.emulateMedia({ media: 'print' });
  const visibility = await page.evaluate(() =>
    ['calculator', 'basis'].map((id) => getComputedStyle(document.getElementById(id)!).visibility),
  );
  expect(visibility).toEqual(['visible', 'hidden']);
  await page.emulateMedia({ media: 'screen' });
});

test('desktop: the sticky bar appears past 700 px — even after a jump past its wrapper — hides near #calc-cta and tracks its contact CTAs (W18/W81)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries the offer below lg');
  await page.goto(ROUTES.tr);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 2600)); // one jump, past the wrapper after #basis
  await expect(bar).toBeVisible();
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sticky-cta-h').trim(),
    ),
  ).not.toBe('0px');
  const wa = bar.getByRole('link', { name: s('tr', 'calc.052'), exact: true });
  const href = (await wa.getAttribute('href')) ?? '';
  expect(decodeURIComponent(href.split('?text=')[1] ?? '')).toBe(MSG.tr.sys.calc.whatsapp.generic);
  const call = bar.getByRole('link', { name: s('tr', 'calc.051'), exact: true });
  await call.evaluate((a) =>
    a.addEventListener('click', (e) => e.preventDefault(), { once: true }),
  );
  await call.click();
  expect((await dataLayer(page, 'call_click')).some((e) => e.placement === 'page_cta')).toBe(true);
  await page.locator('#calc-cta').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});

test('desktop: the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(
    isMobile(),
    'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts',
  );
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/hiring-cost-calculator$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
