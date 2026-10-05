import { test, expect } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// Canonicals, hreflang and og:image are built from SITE_URL (the production origin), not the run host.
const ORIGIN = 'https://www.jobsadmire.com';
const SYS = { tr: tr.sys, en: en.sys } as const;

const ROUTES = [
  { path: '/basari-hikayeleri', locale: 'tr', alternate: '/en/success-stories' },
  { path: '/en/success-stories', locale: 'en', alternate: '/basari-hikayeleri' },
] as const;

type DataLayerEvent = Record<string, unknown>;

// No form on this page (PRD §2 row 11: "none"): there is no fallback-panel case here on
// purpose — the page's only doors are WhatsApp / internal links.
for (const r of ROUTES) {
  test.describe(`Success Stories ${r.path}`, () => {
    test('answers 200 with one tagged h1 of real copy and no leaked tokens', async ({ page }) => {
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', r.locale);
      await expect(page.locator('h1')).toHaveCount(1);
      const h1 = page.locator('h1[data-testid="page-h1"]');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      expect(body.length).toBeGreaterThan(0);
      expect(body).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    });

    test('renders the hero photo (licensed stock), never as the LCP element (D26/W233)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expectHeroPhoto(
        page.locator('img[src*="success-stories.jpg"]'),
        '/hero/success-stories.jpg',
      );
      await expect(page.locator('img[data-lcp-slot]')).toHaveCount(0);
      await expect(page.locator('[data-placeholder="ss-hero"]')).toHaveCount(0);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    });

    test('canonical, hreflang, og:image and the language switch keep the page', async ({
      page,
    }, testInfo) => {
      await page.goto(r.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${ORIGIN}${r.path}`,
      );
      await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/en/success-stories`,
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      // 'stories' ∈ OG_PAGE_KEYS: the generated image, titled from sys.seo.stories.title.
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        'content',
        `${ORIGIN}/og/${r.locale}/stories.png`,
      );
      await expect(page).toHaveTitle(SYS[r.locale].seo.stories.title);
      // The header switcher is in the desktop row only (below the threshold it lives in the
      // hamburger) — click it on the desktop project, and prove the target on both.
      if (testInfo.project.name === 'desktop') {
        // `exact`: the LanguageHint's "Switch to English" link would otherwise match too.
        await page
          .getByRole('link', { name: r.locale === 'tr' ? 'English' : 'Türkçe', exact: true })
          .first()
          .click();
        await expect(page).toHaveURL(new RegExp(`${r.alternate}$`));
      } else {
        await page.goto(r.alternate);
      }
      await expect(page.locator('h1[data-testid="page-h1"]')).toBeVisible();
    });

    test('carries a BreadcrumbList ending at this page and the closing band with its doors', async ({
      page,
    }) => {
      await page.goto(r.path);
      const nodes = (await page.locator('script[type="application/ld+json"]').allTextContents())
        .map((n) => JSON.parse(n) as Record<string, unknown>)
        .filter((n) => n['@type'] === 'BreadcrumbList');
      expect(nodes).toHaveLength(1);
      const items = nodes[0].itemListElement as { position: number; item: string }[];
      expect(items).toHaveLength(2);
      expect(items[1].item).toBe(`${ORIGIN}${r.path}`);
      // Scoped to the breadcrumb nav: the header's own nav marks /success-stories current too.
      const trail = page.getByRole('navigation', { name: SYS[r.locale].nav.breadcrumbs });
      await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);

      const band = page.locator('#talk');
      await expect(band).toHaveCount(1);
      await expect(page.getByTestId('stories-closing')).toBeVisible();
      const wa = band.locator('a[href^="https://wa.me/"]');
      await expect(wa).toHaveCount(1);
      await expect(wa).toHaveAttribute('target', '_blank');
      await expect(wa).toHaveAttribute('rel', /noopener/);
      // W76/W95: the href carries only the static sys prefill — never a visitor-chosen value.
      const href = new URL((await wa.getAttribute('href')) ?? '');
      expect(href.searchParams.get('text')).toBe(SYS[r.locale].stories.whatsappPrefill);
      // The hero's "Discuss your case" is an in-page anchor to that band.
      await expect(page.locator('a[href="#talk"]')).toHaveCount(1);
    });

    test('the band WhatsApp door fires whatsapp_click with placement page_cta (W12)', async ({
      page,
      context,
    }) => {
      await context.route('https://wa.me/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: '' }),
      );
      await page.goto(r.path);
      const popup = page.waitForEvent('popup');
      await page.locator('#talk a[href^="https://wa.me/"]').click();
      await (await popup).close();
      const events = await page.evaluate(() =>
        ((window as unknown as { dataLayer?: DataLayerEvent[] }).dataLayer ?? []).filter(
          (e) => e.event === 'whatsapp_click',
        ),
      );
      expect(events).toContainEqual(
        expect.objectContaining({
          event: 'whatsapp_click',
          placement: 'page_cta',
          locale: r.locale,
        }),
      );
    });

    test('shows the W6 empty wall with the site sector chips (no stories in Phase A)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const wall = page.getByTestId('stories-wall');
      await expect(wall).toBeVisible();
      // "All sectors" + the seven site sectors (`sectors` collection), never the design's own six.
      await expect(wall.getByRole('radio')).toHaveCount(8);
      const empty = page.getByTestId('stories-empty');
      await expect(empty).toBeVisible();
      await expect(empty).toHaveAttribute('role', 'status');
      await expect(empty).toContainText(SYS[r.locale].stories.empty.title);
      const cta = empty.locator('a[href^="https://wa.me/"]');
      await expect(cta).toHaveCount(1);
      await expect(cta).toHaveAttribute('target', '_blank');
      const ctaHref = new URL((await cta.getAttribute('href')) ?? '');
      expect(ctaHref.searchParams.get('text')).toBe(SYS[r.locale].stories.empty.prefill);
      await expect(page.getByTestId('stories-grid')).toHaveCount(0);
      // Picking a chip on an empty collection keeps the empty wall — no per-sector text.
      // The native radio is sr-only under its chip face, so click the chip (the <label>).
      await wall.locator('label').nth(2).click();
      await expect(wall.getByRole('radio').nth(2)).toBeChecked();
      await expect(empty).toBeVisible();
      await expect(page.getByTestId('stories-none-in-sector')).toHaveCount(0);
      await expect(page.getByTestId('stories-result')).toHaveCount(0);
      // The design's feed/sample wording never reaches the page body (the chrome's own
      // "CRM Login" label, home.012, lives outside <main>, so the check is scoped to it).
      const main = await page.locator('main').innerText();
      expect(main).not.toMatch(/sample data|örnek veri|live from CRM|CRM['’]den canlı/i);
    });

    test('hides the unsigned metrics, the KPI box, testimonials and worker stories by data (W1/W6/§10 row 11)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expect(page.getByTestId('stories-live')).toHaveCount(0);
      await expect(page.getByTestId('stories-numbers')).toHaveCount(0);
      await expect(page.getByTestId('stories-testimonials')).toHaveCount(0);
      await expect(page.getByTestId('stories-workers')).toHaveCount(0);
      const main = await page.locator('main').innerText();
      // The design's unsigned figures, its design-time notes and the v1.1 document claims never render.
      expect(main).not.toMatch(
        /1[.,]240|\b68\b|\b91\s?%|%\s?91|\+19|Still to replace|Hâlâ değiştirilecek|Placeholder quotes|Yer tutucu yorumlar|blacked out|karartılır/,
      );
      // Delta 7: on the empty wall the hero body is the sys copy, not "Below are the actual…".
      await expect(page.locator('main')).toContainText(SYS[r.locale].stories.hero.bodyEmpty);
    });

    test('renders no <main> of its own (R31 — the (site) chrome owns #main)', async ({ page }) => {
      await page.goto(r.path);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
    });
  });
}
