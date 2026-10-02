import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// Canonicals, hreflang and og:image are built from SITE_URL — the production origin, whatever
// host the run hits.
const ORIGIN = 'https://www.jobsadmire.com';
/**
 * `E2E_CAREERS_MOCK=1` means the server under test was BUILT and STARTED with
 * `OPS_API_URL=http://127.0.0.1:8481` while the fixture door ran (`npm run careers:door`,
 * e2e/mocks/careers-door.mjs): the task's W126 proof session, or `npm run e2e:careers` against
 * such a server (W112). Without it every case below holds on any face — a door-less preview (W92)
 * and a door-configured `staging` alike — and nothing here ever submits to a real door.
 */
const MOCK = process.env.E2E_CAREERS_MOCK === '1';
const FIX = {
  office: 'work-permit-officer-antalya',
  uz: 'country-representative-uzbekistan',
  pk: 'sourcing-coordinator-pakistan',
  portfolio: 'content-seo-specialist-antalya',
} as const;
const INDEX = [
  { path: '/kariyer', locale: 'tr', sys: tr.sys, cta: '/isci-talebi#request-form' },
  { path: '/en/careers', locale: 'en', sys: en.sys, cta: '/en/hire-workers#request-form' },
] as const;
const SECTIONS = [
  'careers-notice',
  'careers-roles',
  'careers-ways',
  'careers-process',
  'careers-apply',
  'careers-faq',
];
const PDF = {
  name: 'cv.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n%fixture\n'),
};

const jsonLd = async (page: Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');

async function expectNoLeaks(page: Page) {
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(text).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
}

for (const r of INDEX) {
  test.describe(`careers index ${r.path}`, () => {
    test('answers 200: one tagged h1, one LCP slot, the sections in design order, no leaked token', async ({
      page,
    }) => {
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', r.locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toHaveCount(1);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
      for (const id of SECTIONS) await expect(page.getByTestId(id)).toBeVisible();
      const order = await page
        .locator(SECTIONS.map((id) => `[data-testid="${id}"]`).join(', '))
        .evaluateAll((els) => els.map((el) => el.getAttribute('data-testid')));
      expect(order).toEqual(SECTIONS);
      await expectNoLeaks(page);
    });

    test('W6: the live list or the designed empty state — never both, never a blank section', async ({
      page,
    }) => {
      await page.goto(r.path);
      const roles = await page.getByTestId('careers-role').count();
      if (roles === 0) {
        await expect(page.getByTestId('careers-empty')).toBeVisible();
        await expect(page.getByTestId('careers-hiring-count')).toHaveCount(0);
        await expect(page.getByTestId('careers-hero-roles')).toHaveCount(0);
      } else {
        await expect(page.getByTestId('careers-empty')).toHaveCount(0);
        await expect(page.getByTestId('careers-hiring-count')).toBeVisible();
      }
      if (MOCK) {
        expect(roles).toBe(4); // five fixtures, four shown
        await expect(page.getByTestId('careers-hiring-count')).toContainText('5');
        await expect(page.getByTestId('careers-hero-role')).toHaveCount(3); // UZ, PK, IN
      }
    });

    test('W3/W89: the open application is WhatsApp + e-mail only, and nothing links to Operations', async ({
      page,
    }) => {
      await page.goto(r.path);
      const apply = page.getByTestId('careers-apply');
      await expect(apply.locator('form')).toHaveCount(0);
      await expect(apply.locator('a[href^="https://wa.me/905011240340?text="]')).toHaveCount(1);
      await expect(apply.locator('a[href^="mailto:careers@jobsadmire.com"]')).toHaveCount(1);
      await expect(page.locator('a[href*="operations.jobsadmire.com"]')).toHaveCount(0);
    });

    test('JSON-LD: FAQPage over the 8 on-page pairs, a two-item BreadcrumbList, no JobPosting (D15)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const ld = await jsonLd(page);
      expect(ld).toContain('"@type":"FAQPage"');
      expect(ld.match(/"@type":"Question"/g)).toHaveLength(8);
      expect(ld).toContain('"@type":"BreadcrumbList"');
      expect(ld.match(/"@type":"ListItem"/g)).toHaveLength(2);
      expect(ld).not.toContain('"@type":"JobPosting"');
    });

    test('metadata: canonical, both hreflangs, title, og:image; the header keeps the default CTA (W121/W158)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${ORIGIN}${r.path}`,
      );
      await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/kariyer`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/en/careers`,
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/kariyer`,
      );
      await expect(page).toHaveTitle(r.sys.seo.careers.title);
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        'content',
        `${ORIGIN}/og/${r.locale}/careers.png`,
      );
      // DEFAULT_CTAS → T2's #request-form (W158 sweeps that anchor on /isci-talebi at launch).
      expect(await page.locator(`header a[href="${r.cta}"]`).count()).toBeGreaterThan(0);
    });
  });
}

test('an unknown opening answers 404 inside the chrome, in both locales (W151)', async ({
  page,
}) => {
  for (const path of ['/kariyer/no-such-role-xyz', '/en/careers/no-such-role-xyz']) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
    // Next's __next_error__ shell first; the chrome-wrapped view after hydration (W151).
    await expect(page.locator('header').first()).toBeVisible();
  }
});

test.describe('careers — the fixture door (E2E_CAREERS_MOCK=1)', () => {
  test.skip(!MOCK, 'needs a server built and started against e2e/mocks/careers-door.mjs');

  test('filters, the no-match state, show more and show fewer', async ({ page }) => {
    await page.goto('/en/careers');
    const list = page.getByTestId('careers-roles-list');
    const roles = list.getByTestId('careers-role');
    // jt.048 "Where", jt.049 "Engagement" name the two radio groups; the chip labels are the
    // package's own (jt.262, jt.073, jt.261, jt.056, jt.306).
    const where = list.getByRole('radiogroup', { name: 'Where' });
    const engagement = list.getByRole('radiogroup', { name: 'Engagement' });
    await expect(roles).toHaveCount(4);
    await where.getByText('Overseas', { exact: true }).click();
    await expect(roles).toHaveCount(3);
    await engagement.getByText('Project-based', { exact: true }).click();
    await expect(roles).toHaveCount(1);
    await where.getByText('Antalya office', { exact: true }).click();
    await expect(list.getByTestId('careers-no-match')).toBeVisible();
    await list.getByRole('button', { name: 'Show all roles' }).click();
    await expect(roles).toHaveCount(4);
    await list.getByRole('button', { name: 'Show more roles (1)' }).click();
    await expect(roles).toHaveCount(5);
    await list.getByRole('button', { name: 'Show fewer roles' }).click();
    await expect(roles).toHaveCount(4);
  });

  test('a detail page: JobPosting from the opening, a three-item trail, both alternates, its own title, axe clean', async ({
    page,
  }) => {
    const res = await page.goto(`/kariyer/${FIX.uz}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId('page-h1')).toHaveText('Country Representative — Uzbekistan');
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const ld = await jsonLd(page);
    expect(ld).toContain('"@type":"JobPosting"');
    expect(ld).toContain(
      `"identifier":{"@type":"PropertyValue","name":"JobsAdmire","value":"${FIX.uz}"}`,
    );
    expect(ld).toContain('"addressCountry":"UZ"');
    expect(ld).toContain('"employmentType":"FULL_TIME"');
    expect(ld).toContain('"minValue":800');
    expect(ld).not.toContain('validThrough');
    expect(ld.match(/"@type":"ListItem"/g)).toHaveLength(3);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/kariyer/${FIX.uz}`,
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/en/careers/${FIX.uz}`,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/kariyer/${FIX.uz}`,
    );
    await expect(page).toHaveTitle(
      tr.sys.careers.detail.metaTitle.replace('{title}', 'Country Representative — Uzbekistan'),
    );
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      'content',
      `${ORIGIN}/og/tr/careers.png`,
    );
    await expectNoLeaks(page);
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
  });

  test('apply: career_apply_start once; server-side errors keep the page; the CV uploads and the door-less post ends on the fallback panel', async ({
    page,
  }) => {
    await page.goto(`/en/careers/${FIX.uz}`);
    const form = page.getByTestId('careers-apply-form');
    await expect(form.locator('select[name="country"]')).toHaveValue('UZ');
    await expect(form.locator('select[name="country"] option:not([value=""])')).toHaveCount(1);
    await expect(form.locator('input[name="expectedSalary"]')).toHaveCount(0);

    // W67: the first focus inside the form fires career_apply_start once, with the slug only.
    // The listener attaches after hydration, so re-focus until it has fired; it never fires twice.
    const starts = () =>
      page.evaluate(() =>
        (window.dataLayer ?? []).filter((event) => event.event === 'career_apply_start'),
      );
    await expect
      .poll(async () => {
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await form.locator('input[name="name"]').focus();
        return (await starts()).length;
      })
      .toBe(1);
    await form.locator('input[name="email"]').focus();
    expect(await starts()).toEqual([
      expect.objectContaining({ slug: FIX.uz, locale: 'en', page: `/en/careers/${FIX.uz}` }),
    ]);

    // An empty submit: the server answers field errors and the page stays.
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[aria-invalid="true"]').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(`/en/careers/${FIX.uz}`);

    // A valid one: the CV goes to the fixture door; there is no write token, so the post never
    // leaves the site and the D11 panel answers — never a fake success (W92).
    await form.locator('input[name="name"]').fill('Aziz Karimov');
    await form.locator('input[name="email"]').fill('aziz@example.com');
    await form.locator('input[name="phone"]').fill('+998 90 123 45 67');
    await form.locator('input[name="portfolioUrl"]').fill('behance.net/aziz');
    await form.locator('input[name="cv"]').setInputFiles(PDF);
    await form.getByRole('checkbox').check();
    await form.locator('button[type="submit"]').click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    // W76: the panel's WhatsApp href is the bare chat; the typed data is composed only on click.
    await expect(panel.locator('a[href^="https://wa.me/"]').first()).toHaveAttribute(
      'href',
      'https://wa.me/905011240340',
    );
    expect(new URL(page.url()).pathname).toBe(`/en/careers/${FIX.uz}`);
    await expect(form.locator('input[name="name"]')).toHaveValue('Aziz Karimov');
  });

  test('a Pakistan opening requires the expected salary — the server says so before any upload', async ({
    page,
  }) => {
    await page.goto(`/en/careers/${FIX.pk}`);
    const form = page.getByTestId('careers-apply-form');
    const salary = form.locator('input[name="expectedSalary"]');
    await expect(salary).toBeVisible();
    await expect(salary).toHaveAttribute('aria-required', 'true');
    await expect(form).toContainText(
      en.sys.careers.form.expectedSalaryHint.replace('{currency}', 'PKR'),
    );
    await form.locator('input[name="name"]').fill('Bilal Ahmed');
    await form.locator('input[name="email"]').fill('bilal@example.com');
    await form.locator('input[name="phone"]').fill('+92 300 123 4567');
    await form.locator('input[name="cv"]').setInputFiles(PDF);
    await form.getByRole('checkbox').check();
    await form.locator('button[type="submit"]').click();
    await expect(salary).toHaveAttribute('aria-invalid', 'true');
    await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  });

  test('a portfolio opening applies by e-mail — no form (W56)', async ({ page }) => {
    await page.goto(`/kariyer/${FIX.portfolio}`);
    const panel = page.getByTestId('careers-email-apply');
    await expect(panel).toBeVisible();
    await expect(page.locator('form[data-form-key="careers"]')).toHaveCount(0);
    await expect(panel.locator('a[href^="mailto:careers@jobsadmire.com?subject="]')).toHaveCount(1);
  });

  test('the sitemap lists the fixture openings in both locales (W31)', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const slug of Object.values(FIX)) {
      expect(xml).toContain(`<loc>${ORIGIN}/kariyer/${slug}</loc>`);
      expect(xml).toContain(`<loc>${ORIGIN}/en/careers/${slug}</loc>`);
    }
    expect(xml).not.toContain('[slug]');
  });
});

test.describe('careers — a configured door, read only', () => {
  test.skip(MOCK, 'the fixture-door cases cover the detail page');

  test('the first listed opening renders its detail page — nothing is submitted', async ({
    page,
  }) => {
    await page.goto('/kariyer');
    const cards = page.getByTestId('careers-role');
    test.skip(
      (await cards.count()) === 0,
      'no opening is listed on this face (a door-less build, W92)',
    );
    const href = await cards.first().getByRole('heading').getByRole('link').getAttribute('href');
    const res = await page.goto(href ?? '/kariyer');
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId('page-h1')).toHaveCount(1);
    expect(await jsonLd(page)).toContain('"@type":"JobPosting"');
    await expect(
      page.locator('[data-testid="careers-apply-form"], [data-testid="careers-email-apply"]'),
    ).toHaveCount(1);
  });
  test('a detail page never scrolls sideways on narrow phones (the long-word title) — W205', async ({
    page,
  }) => {
    for (const width of [390, 360, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/en/careers/${FIX.uz}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${width}px`).toBe(0);
    }
  });
});
