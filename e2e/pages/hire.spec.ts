import { test, expect, type Locator, type Page } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';

const ROUTES = { tr: '/isci-talebi', en: '/en/hire-workers' } as const;
/** `bundle.settings.whatsappNumber` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
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

async function fillFull(form: Locator) {
  await form.getByLabel(/Firma adı|Company name/).fill('Acme A.Ş.');
  await form.getByLabel(/İletişim kişisi|Contact person/).fill('Ayşe Yılmaz');
  await form.getByLabel(/Kurumsal e-posta|Work email/).fill('ayse@acme.example');
  await form.getByLabel(/Ülke kodu|Country code/).selectOption('TR');
  await form.getByLabel(/Telefon \/ WhatsApp|Phone \/ WhatsApp/).fill('0532 000 00 00');
  await form.getByLabel(/Sektör|Industry/).selectOption('factory');
  await form.getByLabel(/İhtiyaç duyulan pozisyonlar|Roles needed/).fill('kaynakçı');
  await form.getByLabel(/İşçi sayısı|Number of workers/).fill('5');
  await form.getByRole('checkbox').check(); // W79: the consent tick
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

type JsonLdNode = Record<string, unknown> & { '@type'?: string };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: the request form validates on the server and falls back to the D11 panel without a door (W92)`, async ({
    page,
  }) => {
    test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
    await page.goto(ROUTES[locale]);
    const form = page.getByTestId('hire-form-full');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute('data-form-key', 'hire');
    const submit = form.getByRole('button', { name: /İşçi talep edin|Request Workers/ });
    // 1. Empty submit → field errors (incl. the consent tick), no navigation.
    await submit.click();
    await expect(form.getByRole('alert').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 2. Valid submit → no door → the fallback panel (D11), still no navigation.
    await fillFull(form);
    await submit.click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 3. The typed values survive the failed submit and reach WhatsApp only on click.
    await expect(form.getByLabel(/Firma adı|Company name/)).toHaveValue('Acme A.Ş.');
    await expectBareWhatsAppFallback(page, panel, 'Acme A.Ş.');
  });

  test(`${locale}: one page-h1, the hero photo holding the only data-lcp-slot, named placeholders, no leaked ids or tokens, metric pills (D26/W55/W1/W233)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).not.toBeEmpty();
    await expect(page.locator('h1[data-lcp-slot]')).toHaveCount(0); // W233: the photo is the slot
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expectHeroPhoto(page.locator('img[data-lcp-slot="hw-hero"]'), '/hero/hire-workers.jpg');
    await expect(page.locator('[data-placeholder="hw-hero"]')).toHaveCount(0);
    for (const slot of ['portal-shortlist', 'portal-mobile-app'])
      await expect(page.locator(`[data-placeholder="${slot}"]`)).toHaveCount(1);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bhire\.\d{3}\b/); // a package id leaking as text
    // static `metricValues` text — this page mounts no Stat count-up, so no emulateMedia (W178)
    await expect(page.getByTestId('hire-hero-pills')).toContainText('470+');
  });

  test(`${locale}: the designed sections in order, one of each anchor, the sample logo band from 701 px, the header CTA's #request-form (W152/W158)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'hire-hero',
      // owner 2026-10-05: the design's labelled logo slots + the sample tag; ≤ 700 px it hides
      ...(isMobile() ? [] : ['hire-logos']),
      'hire-industries',
      'hire-source-countries',
      'hire-compare',
      'hire-process',
      'hire-portal',
      'hire-faq',
      'hire-request',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toBeVisible();
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    const logos = page.getByTestId('hire-logos');
    await expect(logos).toHaveCount(1);
    if (isMobile()) await expect(logos).toBeHidden();
    else {
      await expect(logos.locator('[data-sample-tag]')).toBeVisible();
      await expect(logos).toContainText('22+');
      // ten labelled slots in the visible copy of the marquee (the second copy is inert)
      await expect(
        logos.locator(':not([aria-hidden="true"]) > [data-placeholder^="logo-"]'),
      ).toHaveCount(10);
    }
    for (const anchor of ['request-form', 'industries', 'compare', 'process', 'faq'])
      await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
    // DEFAULT_CTAS (no CTA_BY_PATHNAME entry, W121) → the header CTA targets this page's form
    const cta = page.getByRole('banner').getByRole('link', { name: /^(Talep|Request)/ });
    await expect(cta).toHaveAttribute('href', `${ROUTES[locale]}#request-form`);
  });
}

test('tr: two hire shells with their own id scopes; the quick-quote is a form from 701 px and a CTA pair at ≤ 700 px (W10/W119)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await expect(page.locator('#f-hire-quick-consent')).toHaveCount(1);
  await expect(page.locator('#f-hire-full-consent')).toHaveCount(1);
  const quick = page.getByTestId('hire-form-quick');
  const mobile = page.getByTestId('hire-quick-mobile');
  if (isMobile()) {
    await expect(quick).toBeHidden();
    await expect(mobile.getByRole('link', { name: /İşçi talep edin/ })).toHaveAttribute(
      'href',
      '#request-form',
    );
    return;
  }
  await expect(mobile).toBeHidden();
  await expect(quick).toBeVisible();
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await quick.getByLabel(/Firma adı/).fill('Acme');
  await quick.getByLabel(/Hangi şehirde/).fill('Bursa');
  await quick.getByLabel(/İletişim kişisi/).fill('Ali Veli');
  await quick.getByLabel(/İhtiyaç duyulan pozisyonlar/).fill('kaynakçı');
  await quick.getByLabel(/Kaç kişi/).fill('3');
  await quick.getByLabel(/Telefon \/ WhatsApp/).fill('0532 000 00 00');
  await quick.getByLabel(/Kurumsal e-posta/).fill('ali@acme.example');
  await quick.getByRole('checkbox').check(); // W79: a checkbox here too, never the notice mode
  await quick.getByRole('button', { name: /İşçi talep edin/ }).click();
  const panel = quick.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expectBareWhatsAppFallback(page, panel, 'Ali Veli');
});

test('the ≤ 700 px rules are CSS classes on server-rendered markup (W10/W119)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const mobileOnly = [page.getByTestId('hire-jump'), page.getByTestId('hire-quick-mobile')];
  const desktopOnly = [
    page.getByTestId('hire-hero-ctas'),
    page.getByTestId('hire-form-quick'),
    page.getByTestId('hire-request').locator('ol').first(),
    page.locator('[data-placeholder="portal-mobile-app"]'),
  ];
  for (const l of isMobile() ? mobileOnly : desktopOnly) await expect(l).toBeVisible();
  for (const l of isMobile() ? desktopOnly : mobileOnly) await expect(l).toBeHidden();
  // the design hides nothing of this page at ≤ 460 px: the portal block shows at every width
  await expect(page.getByTestId('hire-portal')).toBeVisible();
});

test('tr: the source map carries every source country and the flag chips are sprite flags (W14)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const map = page.getByTestId('hire-map');
  await expect(map.locator('g[data-country]')).toHaveCount(14); // 13 sources + Türkiye
  await expect(map.locator('g[data-country="LK"] > title')).toHaveText(/Sri Lanka/);
  await expect(map.locator('g[data-country="TR"] > title')).toHaveText('Türkiye');
  const flags = page.getByTestId('hire-flags');
  expect(await flags.locator('svg use[href$="#flag-PK"]').count()).toBeGreaterThan(0);
  await expect(flags).toContainText('Pakistan');
});

test('tr: the industries accordion opens one sector at a time and its CTA prefills the request form (W77)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const region = page.getByTestId('hire-industries');
  await expect(region.getByRole('button', { expanded: false })).toHaveCount(6);
  await region.getByRole('button', { name: /Tekstil/ }).click();
  await expect(region.getByRole('button', { name: /Tekstil/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  // the open row's panel (named by its sector button) holds the prefill CTA
  await region
    .getByRole('region', { name: /Tekstil/ })
    .getByRole('link', { name: /Tekstil işçisi talep edin/ })
    .click();
  await expect(page.getByTestId('hire-form-full').getByLabel(/Sektör/)).toHaveValue('textile');
  expect(new URL(page.url()).hash).toBe('#request-form');
});

test('tr: at rest every industry row shows its chips; from 701 px the round → prefills its sector (S7.1/S7.4)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const region = page.getByTestId('hire-industries');
  await expect(region.getByText('Kaynakçı', { exact: true }).first()).toBeVisible();
  test.skip(isMobile(), 'the design hides the round arrow at ≤ 700 px');
  const arrow = region.locator('a.ja-arrow').nth(1); // 02 · İnşaat
  await expect(arrow).toBeVisible();
  await arrow.click();
  await expect(page.getByTestId('hire-form-full').getByLabel(/Sektör/)).toHaveValue('construction');
  // the arrow is not the row's toggle: the row stays closed
  await expect(region.getByRole('button', { name: 'İnşaat' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('tr: one BreadcrumbList on this page’s own labels and one FAQPage with seven pairs (W109)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const nodes = await jsonLdNodes(page);
  const faq = nodes.filter((n) => n['@type'] === 'FAQPage');
  expect(faq).toHaveLength(1);
  expect(faq[0].mainEntity).toHaveLength(7);
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList') as unknown as {
    itemListElement: { name: string; item: string }[];
  }[];
  expect(crumbs).toHaveLength(1);
  // W109: hire.020 → '/', hire.002 → this page
  expect(crumbs[0].itemListElement.map((i) => i.name)).toEqual(['Ana Sayfa', 'İşçi Talebi']);
  expect(crumbs[0].itemListElement[1].item.endsWith('/isci-talebi')).toBe(true);
});

test('the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(
    isMobile(),
    'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts',
  );
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/hire-workers$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('desktop: the sticky bar appears after 700 px, hides near #request-form, publishes its height and tracks its contact CTAs (W18/W81)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries the offer below lg');
  await page.goto(ROUTES.tr);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toBeVisible();
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sticky-cta-h').trim(),
    ),
  ).not.toBe('0px');
  // W81/W12: the bar's tel: CTA renders through ContactLink — its click pushes call_click page_cta
  const call = bar.getByRole('link', { name: /Arayın/ });
  await call.evaluate((a) =>
    a.addEventListener('click', (e) => e.preventDefault(), { once: true }),
  );
  await call.click();
  const pushed = await page.evaluate(
    () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [],
  );
  expect(pushed.some((e) => e.event === 'call_click' && e.placement === 'page_cta')).toBe(true);
  await page.locator('#request-form').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});
