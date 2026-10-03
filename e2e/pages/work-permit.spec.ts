import { test, expect, type Page } from '@playwright/test';

const ROUTES = { tr: '/calisma-izni', en: '/en/work-permit' } as const;
/** `bundle.settings.whatsappNumber` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';
type Pushed = Record<string, unknown>[];

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}
const typesOf = (n: JsonLdNode) => ([] as string[]).concat(n['@type'] ?? []);

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only data-lcp-slot, the named wp-hero placeholder, no leaked ids or tokens (D26/W55/W1)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).not.toBeEmpty();
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // §10 row 4: no photo for this page
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="wp-hero"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bwp\.\d{3}\b/); // a package id leaking as text
    expect(body).toContain('470+'); // wp.030 {placed} (W1) — static text, no Stat count-up on this page (W178)
  });

  test(`${locale}: the designed sections in order, each anchor once, the header CTA's #permit-cta (W17/W152/W158)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'wp-hero',
      'wp-jump',
      'wp-router',
      'wp-routes',
      'wp-types',
      'wp-rules',
      'wp-muafiyet',
      'wp-process',
      'wp-timeline',
      'wp-costs',
      'wp-documents',
      'wp-renewal',
      'wp-faq',
      'wp-cta',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toHaveCount(1);
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    for (const anchor of [
      'eligibility',
      'routes',
      'rules',
      'muafiyet',
      'timeline',
      'costs',
      'documents',
      'faq',
      'permit-cta',
    ])
      await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
    // W222 (4): the TR CTA renders its tail first ("İzin İçin Başvurun"); EN stays "Apply for a permit"
    const cta = page.getByRole('banner').getByRole('link', { name: /\b(Başvurun|Apply)\b/ });
    await expect(cta).toHaveAttribute('href', `${ROUTES[locale]}#permit-cta`);
  });

  test(`${locale}: the wizard stores nothing, pushes one eligibility_check_complete (result only) and opens WhatsApp with a click-time prefill (W26/W67/W76/W95)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const card = page.getByTestId('wp-eligibility');
    await expect(card).toHaveAttribute('data-island', 'ready'); // hydrated — clicks now land
    const storage = await page.evaluate(() => [localStorage.length, sessionStorage.length]);
    const apiCalls: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).pathname.startsWith('/api/')) apiCalls.push(r.url());
    });
    // always the first option: a company, 5 or more, abroad, no debts → "eligible"
    for (let i = 0; i < 4; i++) await card.getByRole('group').getByRole('button').first().click();
    const result = page.getByTestId('wp-eligibility-result');
    await expect(result).toBeVisible();
    const events = await page.evaluate(() =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (e) => e.event === 'eligibility_check_complete',
      ),
    );
    expect(events).toEqual([
      { event: 'eligibility_check_complete', page: ROUTES[locale], locale, result: 'eligible' },
    ]);
    const link = result.getByRole('link', { name: /WhatsApp/ });
    await expect(link).toHaveAttribute('href', WA); // W76/W95: the DOM href is the bare chat
    await page.evaluate(() => {
      const w = window as unknown as { __opened: string[] };
      w.__opened = [];
      window.open = ((url?: string | URL) => {
        w.__opened.push(String(url));
        return null;
      }) as typeof window.open;
    });
    await link.click();
    const opened = await page.evaluate(
      () => (window as unknown as { __opened: string[] }).__opened,
    );
    expect(opened).toHaveLength(1);
    expect(opened[0].startsWith(`${WA}?text=`)).toBe(true);
    const text = decodeURIComponent(opened[0].split('?text=')[1]);
    expect(text).toMatch(
      locale === 'tr'
        ? /^Merhaba JobsAdmire, sitenizdeki uygunluk kontrolünü yaptım/
        : /^Hello JobsAdmire, I did the eligibility check/,
    );
    expect(text.split('\n')).toHaveLength(6); // intro, four answers, the verdict
    const pushed = await page.evaluate(
      () => (window as unknown as { dataLayer?: Pushed }).dataLayer ?? [],
    );
    expect(pushed.some((e) => e.event === 'whatsapp_click' && e.placement === 'page_cta')).toBe(
      true,
    );
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual(
      storage,
    );
    expect(apiCalls).toEqual([]); // no door, no beacon — "nothing is stored" (wp.045)
    await result.getByRole('button').click(); // Start again
    await expect(card.getByRole('group')).toBeVisible();
  });

  test(`${locale}: both routes and both timeline cards show at every width — no tab switchers (D20/W10)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    await expect(page.getByRole('tab')).toHaveCount(0);
    for (const id of [
      'wp-routes-permit',
      'wp-routes-exempt',
      'wp-timeline-abroad',
      'wp-timeline-here',
    ])
      await expect(page.getByTestId(id)).toBeVisible();
  });

  test(`${locale}: one BreadcrumbList on this page's own labels (W109), one FAQPage with nine pairs, the site-wide EmploymentAgency node once`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const nodes = await jsonLdNodes(page);
    const crumbs = nodes.filter((n) => typesOf(n).includes('BreadcrumbList')) as unknown as {
      itemListElement: { name: string; item: string }[];
    }[];
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].itemListElement.map((i) => i.name)).toEqual(
      locale === 'tr' ? ['Ana Sayfa', 'Çalışma İzinleri'] : ['Home', 'Work Permits'],
    );
    expect(crumbs[0].itemListElement[1].item.endsWith(ROUTES[locale])).toBe(true);
    const faq = nodes.filter((n) => typesOf(n).includes('FAQPage'));
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(9);
    expect(nodes.filter((n) => typesOf(n).includes('EmploymentAgency'))).toHaveLength(1);
  });
}

test('W4: the related-articles block is absent below the blog threshold (0 Turkish bodies)', async ({
  page,
}) => {
  for (const path of Object.values(ROUTES)) {
    await page.goto(path);
    await expect(page.getByTestId('wp-hero')).toBeVisible();
    await expect(page.getByTestId('wp-related')).toHaveCount(0);
  }
});

test('W10: the ≤ 700 px variants are CSS switches on server-rendered markup', async ({ page }) => {
  await page.goto(ROUTES.en);
  const mobileOnly = [
    page.getByTestId('wp-intro-mob'),
    page.getByTestId('wp-cta-routes'),
    page.getByTestId('wp-renewal-mob'),
  ];
  const desktopOnly = [
    page.getByTestId('wp-intro-desk'),
    page.getByTestId('wp-hero-ctas'),
    page.getByTestId('wp-cta-buttons'),
    page.getByTestId('wp-renewal-desk'),
  ];
  for (const l of isMobile() ? mobileOnly : desktopOnly) await expect(l).toBeVisible();
  for (const l of isMobile() ? desktopOnly : mobileOnly) await expect(l).toBeHidden();
});

test('the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(
    isMobile(),
    'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts',
  );
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/work-permit$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('desktop: the sticky bar appears after 700 px, hides near #permit-cta, publishes its height and tracks its contact CTAs (W18/W81)', async ({
  page,
}) => {
  test.skip(
    isMobile(),
    'the bar is lg+ only; the mobile bottom bar carries Call/WhatsApp below lg',
  );
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
    () => (window as unknown as { dataLayer?: Pushed }).dataLayer ?? [],
  );
  expect(pushed.some((e) => e.event === 'call_click' && e.placement === 'page_cta')).toBe(true);
  await page.locator('#permit-cta').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});
