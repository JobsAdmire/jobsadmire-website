import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import tr from '../../src/messages/tr.json';

// Canonicals and JSON-LD are built from SITE_URL (the production origin), whatever host the run hits.
const ORIGIN = 'https://www.jobsadmire.com';
const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;

/** Package copy as the LOCAL bundles carry it (read, not imported — the JSON is large). */
const strings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(__dirname, `../../src/content/local/bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;

const CASES = [
  {
    path: '/hakkimizda',
    lang: 'tr',
    alternate: '/en/about',
    requestHref: '/isci-talebi#request-form',
  },
  {
    path: '/en/about',
    lang: 'en',
    alternate: '/hakkimizda',
    requestHref: '/en/hire-workers#request-form',
  },
] as const;

const SECTION_IDS = [
  'about-corridor',
  'about-who',
  'about-journey',
  'about-tech',
  'about-offices',
  'about-lisans',
  'about-cta',
];

async function bodyText(page: Page) {
  return page.locator('body').innerText();
}

for (const { path, lang, alternate, requestHref } of CASES) {
  test.describe(`About ${path}`, () => {
    test('renders one real h1 and every section in the design order', async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const h1 = page.locator('h1[data-testid="page-h1"]');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      expect((await h1.innerText()).trim().length).toBeGreaterThan(3);
      expect(await bodyText(page)).not.toMatch(LEAK);
      const order = await page.evaluate(
        (ids) =>
          Array.from(
            document.querySelectorAll(ids.map((id) => `[data-testid="${id}"]`).join(',')),
          ).map((el) => el.getAttribute('data-testid')),
        SECTION_IDS,
      );
      expect(order).toEqual(SECTION_IDS);
    });

    test('the headline numbers come from the metrics collection (W1)', async ({ page }) => {
      // W178 (count-up flake): `Stat` counts its visible figure up from 0 after hydration (0→22
      // passes 12 and 14, 0→470 passes 112/312/412) unless motion is reduced; pin reduced motion
      // BEFORE `goto` so the "never 14+/12+" assertions read the final figures, never an animation
      // frame. (A case that cannot pin motion reads the `.sr-only` span inside the `Stat`, which
      // always carries the final figure, instead.)
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const text = await bodyText(page);
      expect(text).toContain('470+');
      expect(text).toContain('22+');
      // the design's unsigned figures never render
      expect(text).not.toContain('14+');
      expect(text).not.toContain('12+');
      // the design's 98 % retention is the stats row's one tagged SAMPLE cell (owner 2026-10-05)
      const band = page.locator('#about-journey');
      await expect(band.getByText(lang === 'tr' ? '%98' : '98%', { exact: true })).toHaveCount(1);
      await expect(band.locator('[data-sample-tag]')).toHaveCount(1);
    });

    test('the published founder and the newsletter band render; #lisans carries five named slots (D26)', async ({
      page,
    }) => {
      await page.goto(path);
      const founder = page.getByTestId('about-founder');
      await expect(founder).toHaveCount(1);
      await expect(founder).toContainText('Haris Jiva');
      await expect(founder.locator('img[src*="haris-jiva"]')).toHaveCount(1);
      await expect(page.locator('[data-placeholder="founder-photo"]')).toHaveCount(0);
      const newsletter = page.locator('#newsletter');
      await expect(newsletter).toHaveCount(1);
      await expect(newsletter.locator('input[type="email"]')).toHaveCount(1);
      const lisans = page.locator('#lisans');
      await expect(lisans).toHaveCount(1);
      const slots = await lisans
        .locator('[data-placeholder]')
        .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
      expect(slots).toHaveLength(5);
      for (const s of slots) expect(s).toMatch(/^licence-pdf-/);
      await expect(lisans.locator('a')).toHaveCount(0);
      // the profile strip's download waits for the PDF: disabled, described by the note
      const download = lisans.locator('button[data-placeholder="licence-pdf-company-profile"]');
      await expect(download).toBeDisabled();
      await expect(download).toHaveText(strings(lang)['about.109']);
      // no placeholder is the LCP element, and none is unnamed (D26, W55)
      await expect(page.locator('[data-placeholder][data-lcp-slot]')).toHaveCount(0);
      await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    });

    test('both offices render from the collection with the design contact lines', async ({
      page,
    }) => {
      await page.goto(path);
      for (const key of ['antalya', 'karachi']) {
        const card = page.getByTestId(`about-office-${key}`);
        await expect(card.locator('article')).toHaveCount(1);
        // the design's density (SHARED 14.8): WhatsApp and e-mail lines, no phone row, and the
        // directions link (phones only, but always in the DOM)
        await expect(card.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
        await expect(card.locator('a[href^="mailto:"]')).toHaveCount(1);
        await expect(card.locator('a[href^="tel:"]')).toHaveCount(0);
        await expect(card.locator('a[href^="https://www.google.com/maps/"]')).toHaveCount(1);
      }
    });

    test('canonical, hreflang and a BreadcrumbList that names the page with about.008 (W109)', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${ORIGIN}${path}`,
      );
      await expect(page.locator(`link[hreflang="${lang === 'tr' ? 'en' : 'tr'}"]`)).toHaveAttribute(
        'href',
        `${ORIGIN}${alternate}`,
      );
      const graphs = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((els) => els.map((el) => el.textContent ?? ''));
      const breadcrumb = graphs.find((g) => g.includes('"BreadcrumbList"'));
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb).toContain(`${ORIGIN}${path}`);
      expect(breadcrumb).toContain(JSON.stringify(strings(lang)['about.008']));
      // exactly one BreadcrumbList node (one Breadcrumbs mount — the WP2a final review's §6 rule)
      expect(graphs.filter((g) => g.includes('"BreadcrumbList"'))).toHaveLength(1);
      // no page-level Organization node: the layout's site-wide one carries the licence ids
      expect(graphs.filter((g) => g.includes('"EmploymentAgency"'))).toHaveLength(1);
    });

    test('both request-workers CTAs keep the localized #request-form hash (W82), and the primary green-band CTA wears the white-green face (W127/W128)', async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByTestId('about-hero-request')).toHaveAttribute('href', requestHref);
      const bandPrimary = page.getByTestId('about-cta').locator(`a[href="${requestHref}"]`);
      await expect(bandPrimary).toHaveCount(1);
      // W127/W128 + SHARED 9.4: the green band's primary is the white face with green text
      // (`white-green`), never the white/ink 'secondary' face the draft forced here.
      await expect(bandPrimary).not.toHaveClass(/border-border-1/);
      await expect(bandPrimary).toHaveClass(/text-success-text/);
    });

    test('the language switch keeps the visitor on About', async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name !== 'desktop',
        'the switcher sits in the hamburger on mobile',
      );
      await page.goto(path);
      // Header and footer both carry the switcher group; the header's comes first.
      const group = page.getByRole('group', { name: /Language|Dil/ }).first();
      await group.getByRole('link', { name: lang === 'tr' ? 'English' : 'Türkçe' }).click();
      await expect(page).toHaveURL(new RegExp(`${alternate.replace(/\//g, '\\/')}$`));
      await expect(page.locator('h1[data-testid="page-h1"]')).toHaveCount(1);
    });
  });
}

test('the demo CTA carries a fixed prefill and pushes whatsapp_click page_cta (W12/W95)', async ({
  page,
  context,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport proves the click contract');
  await context.route('https://wa.me/**', (route) => route.abort());
  await page.goto('/hakkimizda');
  const demo = page.getByTestId('about-tech').locator('a[href^="https://wa.me/"]');
  await expect(demo).toHaveCount(1);
  await expect(demo).toHaveAttribute(
    'href',
    `https://wa.me/905011240340?text=${encodeURIComponent(tr.sys.about.whatsapp.demo)}`,
  );
  await expect(demo).toHaveAttribute('target', '_blank');
  const popup = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
  await demo.click();
  await (await popup)?.close();
  const events = await page.evaluate(
    () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [],
  );
  const clicks = events.filter((e) => e.event === 'whatsapp_click');
  expect(clicks).toHaveLength(1);
  expect(clicks[0]).toMatchObject({ placement: 'page_cta', page: '/hakkimizda', locale: 'tr' });
});

test('the corridor lanes rotate every 2.5 s, and hold still under reduced motion', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport proves the timer');
  const firstLane = () => page.getByTestId('about-lanes').locator('li').first().innerText();
  await page.goto('/hakkimizda');
  const before = await firstLane();
  await expect.poll(firstLane, { timeout: 6000 }).not.toBe(before);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/hakkimizda');
  const still = await firstLane();
  await page.waitForTimeout(3000);
  expect(await firstLane()).toBe(still);
});

test('legacy /certifications and /tr/certifications land on the #lisans block (D26)', async ({
  page,
}) => {
  for (const [from, pathname] of [
    ['/certifications', '/en/about'],
    ['/tr/certifications', '/hakkimizda'],
  ] as const) {
    await page.goto(from);
    const url = new URL(page.url());
    expect(url.pathname).toBe(pathname);
    expect(url.hash).toBe('#lisans');
    await expect(page.locator('#lisans')).toHaveCount(1);
  }
});
