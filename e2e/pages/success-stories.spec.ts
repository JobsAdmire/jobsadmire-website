import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';
import { expectHeroPhoto } from '../helpers/hero-photo';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// Canonicals, hreflang and og:image are built from SITE_URL (the production origin), not the run host.
const ORIGIN = 'https://www.jobsadmire.com';
const SYS = { tr: tr.sys, en: en.sys } as const;

/** Package copy as the LOCAL bundles carry it (read, not imported — the JSON is large). */
const strings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(__dirname, `../../src/content/local/bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;

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

    test('shows the design’s sample approvals wall with its seven chips (parity pass; D23: page-local, never the fixture)', async ({
      page,
    }, testInfo) => {
      const pkg = strings(r.locale);
      await page.goto(r.path);
      const wall = page.getByTestId('stories-wall');
      await expect(wall).toBeVisible();
      // "All sectors" + the design's six sectors (success.124–130), never the site taxonomy.
      await expect(wall.getByRole('radio')).toHaveCount(7);
      await expect(wall.getByRole('radio').first()).toBeChecked();
      await expect(page.getByTestId('stories-empty')).toHaveCount(0);
      // the design's own amber sample badge (success.134) and the section's sample tag
      await expect(page.getByTestId('stories-sample-badge')).toHaveText(pkg['success.134']);
      await expect(page.locator('#cases [data-sample-tag]').first()).toBeVisible();
      // every card frame is a labelled ImageSlot placeholder, never nothing
      await expect(page.locator('[data-placeholder="approval-a1"]')).toHaveCount(1);
      if (testInfo.project.name === 'desktop') {
        const grid = page.getByTestId('stories-grid');
        await expect(grid.getByRole('article')).toHaveCount(9);
        await expect(grid.getByRole('article').first()).toBeVisible();
        await expect(page.getByTestId('stories-slider')).toBeHidden();
        await expect(page.getByTestId('stories-more')).toBeHidden();
      } else {
        // ≤ 700 px: the swipe slider of the first three, the compact list of cards 4–7, the toggle
        const slider = page.getByTestId('stories-slider');
        await expect(slider).toBeVisible();
        await expect(slider).toContainText(pkg['success.144']);
        await expect(slider.getByRole('article')).toHaveCount(3);
        // by element, not role: getByRole skips hidden nodes, so a role query's nth(0) would be
        // the first VISIBLE card (card 4), never the phone-hidden card 1
        const items = page.getByTestId('stories-grid').locator(':scope > li');
        await expect(items.nth(0)).toBeHidden();
        await expect(items.nth(3)).toBeVisible();
        await expect(items.nth(7)).toBeHidden();
        const more = page.getByTestId('stories-more');
        await expect(more).toHaveText(pkg['success.136']);
        await more.click();
        await expect(more).toHaveAttribute('aria-expanded', 'true');
        await expect(items.nth(7)).toBeVisible();
        // a tap anywhere on a compact card opens its proof
        const card = items.nth(3).getByRole('article');
        await card.click();
        await expect(card).toHaveAttribute('data-open', 'true');
      }
      // Picking a chip filters the wall: Hotels & tourism carries two sample approvals.
      // The native radio is sr-only under its chip face, so click the chip (the <label>).
      await wall.locator('label').nth(1).click();
      await expect(wall.getByRole('radio').nth(1)).toBeChecked();
      if (testInfo.project.name === 'desktop') {
        await expect(page.getByTestId('stories-grid').getByRole('article')).toHaveCount(2);
      } else {
        // ≤ 3 cards on a phone: the slider holds them all and the compact list is empty (hidden)
        await expect(page.getByTestId('stories-slider').getByRole('article')).toHaveCount(2);
        await expect(page.getByTestId('stories-grid')).toBeHidden();
      }
      await expect(page.getByTestId('stories-none-in-sector')).toHaveCount(0);
      // The design's "live from CRM" wording never reaches the page body.
      const main = await page.locator('main').innerText();
      expect(main).not.toMatch(/live from CRM|CRM['’]den canlı/i);
    });

    test('shows the hero stats, the KPI box, testimonials and worker side as the design’s sample, each tagged (W1/§10 row 11)', async ({
      page,
    }) => {
      const pkg = strings(r.locale);
      await page.goto(r.path);
      // the hero badge: the 288 sample headcount with the design's own "örnek veri" (success.140)
      const live = page.getByTestId('stories-live');
      await expect(live).toBeVisible();
      await expect(live).toContainText('288');
      await expect(live).toContainText(pkg['success.140']);
      for (const id of [
        'stories-hero-stats',
        'stories-numbers',
        'stories-testimonials',
        'stories-workers',
      ]) {
        const sec = page.getByTestId(id);
        await expect(sec, id).toBeAttached();
        await expect(sec.locator('[data-sample-tag]'), id).toHaveCount(1);
      }
      await expect(page.getByTestId('stories-hero-stats').getByRole('listitem')).toHaveCount(4);
      await expect(page.getByTestId('stories-numbers').getByRole('listitem')).toHaveCount(4);
      await expect(page.getByTestId('stories-testimonials').getByRole('article')).toHaveCount(3);
      await expect(page.getByTestId('stories-workers').getByRole('article')).toHaveCount(2);
      // owner ruling: the hero body is success.025 over the sample wall
      await expect(page.locator('main')).toContainText(pkg['success.025']);
      // the design-time notes never render (success.033/034, success.069)
      const main = await page.locator('main').innerText();
      expect(main).not.toMatch(
        /Still to replace|Hâlâ değiştirilecek|Placeholder quotes|Yer tutucu yorumlar/,
      );
    });

    test('renders no <main> of its own (R31 — the (site) chrome owns #main)', async ({ page }) => {
      await page.goto(r.path);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
    });
  });
}
