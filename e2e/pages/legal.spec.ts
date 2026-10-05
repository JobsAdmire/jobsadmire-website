import { test, expect } from '@playwright/test';

// T13 — the four legal pages (D14) in the (minimal) chrome (W19).
const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|\bundefined\b|MISSING_MESSAGE|\bsys\./;
const WHATSAPP_FAB = 'a.fixed[href^="https://wa.me/"]';

type Doc = {
  tr: string;
  en: string;
  sections: number;
  placeholder: { tr: string | null; en: string | null };
};
const DOCS: Doc[] = [
  { tr: '/gizlilik', en: '/en/privacy', sections: 15, placeholder: { tr: null, en: null } },
  {
    tr: '/kullanim-kosullari',
    en: '/en/terms',
    sections: 16,
    placeholder: { tr: 'legal-terms-tr', en: null },
  },
  { tr: '/kvkk', en: '/en/kvkk', sections: 0, placeholder: { tr: 'legal-kvkk', en: 'legal-kvkk' } },
  {
    tr: '/cerez-politikasi',
    en: '/en/cookie-policy',
    sections: 3,
    placeholder: { tr: 'legal-cookie-policy', en: 'legal-cookie-policy' },
  },
];

for (const doc of DOCS) {
  for (const locale of ['tr', 'en'] as const) {
    const path = doc[locale];
    test(`legal ${path}: minimal chrome, one h1, dated, indexable, one BreadcrumbList`, async ({
      page,
    }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
      await expect(page.locator('[data-lcp-slot]')).toHaveAttribute('data-testid', 'page-h1');
      expect(await page.locator('body').innerText()).not.toMatch(LEAK);
      // W19 (minimal): header and footer, no social rail, no WhatsApp FAB
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.locator(WHATSAPP_FAB)).toHaveCount(0);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      // D17: the last-updated date is data
      await expect(page.getByTestId('legal-updated').locator('time')).toHaveAttribute(
        'datetime',
        /^\d{4}-\d{2}-\d{2}$/,
      );
      const sections = page.locator('section[data-legal-section]');
      await expect(sections).toHaveCount(doc.sections);
      if (doc.sections > 0) {
        const hrefs = await page
          .getByTestId('legal-toc')
          .locator('a')
          .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
        const ids = await sections.evaluateAll((ss) => ss.map((s) => `#${s.id}`));
        expect(hrefs).toEqual(ids);
      } else {
        await expect(page.getByTestId('legal-toc')).toHaveCount(0);
      }
      // One Breadcrumbs per page → one BreadcrumbList node (WP2a final review §6 page rule).
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(ld.filter((s) => s.includes('"BreadcrumbList"'))).toHaveLength(1);
      // W109/W176: the Home crumb is the package string every page carries — "Ana Sayfa"
      // (capital S) / "Home", never `sys.nav.home` ("Ana sayfa") — and the last crumb is the
      // page's own title.
      const home = locale === 'tr' ? 'Ana Sayfa' : 'Home';
      const crumbs = JSON.parse(ld.find((s) => s.includes('"BreadcrumbList"')) ?? '{}') as {
        itemListElement?: { name: string; item: string }[];
      };
      const title = ((await page.getByTestId('page-h1').textContent()) ?? '').trim();
      expect(crumbs.itemListElement?.map((i) => i.name)).toEqual([home, title]);
      const trail = page.getByRole('navigation', {
        name: locale === 'tr' ? 'Sayfa yolu' : 'Breadcrumb',
      });
      await expect(trail.locator('a').first()).toHaveText(home);
      // D26/W55: named placeholders only, never the LCP slot.
      const expected = doc.placeholder[locale];
      const placeholders = page.locator('[data-placeholder]');
      await expect(placeholders).toHaveCount(expected ? 1 : 0);
      if (expected) {
        await expect(placeholders).toHaveAttribute('data-placeholder', expected);
        expect(await placeholders.getAttribute('data-lcp-slot')).toBeNull();
      }
    });
  }

  test(`legal ${doc.tr}: the language switch keeps the page`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop',
      'the header switcher sits in the hamburger below 901 px',
    );
    await page.goto(doc.tr);
    await page.getByRole('link', { name: 'English', exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${doc.en.replace(/\//g, '\\/')}$`));
    await expect(page.getByTestId('page-h1')).toBeVisible();
  });
}

test('the Turkish Terms say they are English for now and mark the English text (§10 row 6, WCAG 3.1.2)', async ({
  page,
}) => {
  await page.goto('/kullanim-kosullari');
  await expect(page.getByTestId('legal-notice')).toBeVisible();
  await expect(page.getByTestId('legal-body')).toHaveAttribute('lang', 'en');
  await expect(page.getByTestId('legal-final-note')).toBeVisible();
  await page.goto('/en/terms');
  await expect(page.getByTestId('legal-notice')).toHaveCount(0);
  expect(await page.getByTestId('legal-body').getAttribute('lang')).toBeNull();
});

test('the KVKK placeholder points at the Privacy Policy in each locale', async ({ page }) => {
  await page.goto('/kvkk');
  await expect(page.getByTestId('legal-pending').locator('a[href="/gizlilik"]')).toBeVisible();
  await page.goto('/en/kvkk');
  await expect(page.getByTestId('legal-pending').locator('a[href="/en/privacy"]')).toBeVisible();
});

test('the cookie notice names the cookies the site sets', async ({ page }) => {
  await page.goto('/en/cookie-policy');
  const essential = page.locator('section[data-legal-section]').first();
  for (const name of ['ja_locale', 'ja_consent_v1']) await expect(essential).toContainText(name);
});

test('the chrome legal links resolve (W152)', async ({ page, request }) => {
  const HOMES = [
    ['/', ['/gizlilik', '/kullanim-kosullari']],
    ['/en', ['/en/privacy', '/en/terms']],
  ] as const;
  for (const [home, hrefs] of HOMES) {
    await page.goto(home);
    for (const href of hrefs) {
      expect(await page.locator(`a[href="${href}"]`).count(), href).toBeGreaterThan(0);
      expect((await request.get(href)).status(), href).toBe(200);
    }
  }
});
