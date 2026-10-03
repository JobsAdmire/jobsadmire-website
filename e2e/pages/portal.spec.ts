import { test, expect } from '@playwright/test';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// T13 — the portal entry (W8, W19, D22, I15): a link-only chooser in the chrome-less (bare) group.
const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|\bundefined\b|MISSING_MESSAGE|\bsys\./;
const LOGIN = 'https://portal.jobsadmire.com/auth/login';
const FORGOT = 'https://portal.jobsadmire.com/auth/forgot-password';

const PAGES = [
  {
    path: '/portal-girisi',
    locale: 'tr',
    other: 'English',
    otherPath: '/en/portal-login',
    prefill: tr.sys.whatsapp.prefill,
  },
  {
    path: '/en/portal-login',
    locale: 'en',
    other: 'Türkçe',
    otherPath: '/portal-girisi',
    prefill: en.sys.whatsapp.prefill,
  },
] as const;

for (const p of PAGES) {
  test(`portal entry ${p.path}: one h1, no chrome, noindex (W19)`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', p.locale);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByTestId('page-h1')).toBeVisible();
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-lcp-slot]')).toHaveAttribute('data-testid', 'page-h1');
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
  });

  test(`portal entry ${p.path}: links out only — no credential form, no Operations door (W8, D22)`, async ({
    page,
  }) => {
    await page.goto(p.path);
    await expect(page.locator('form, input')).toHaveCount(0);
    const login = page.getByTestId('portal-login-link');
    await expect(login).toBeVisible();
    await expect(login).toHaveAttribute('href', LOGIN);
    expect(await login.getAttribute('target')).toBeNull(); // same tab (R22)
    await expect(page.getByTestId('portal-forgot-link')).toHaveAttribute('href', FORGOT);
    await expect(
      page.locator(
        'a[href*="operations.jobsadmire.com"], a[href*="chatadmire"], a[href*="crm.jobsadmire.com"]',
      ),
    ).toHaveCount(0);
    await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(0);
    expect(await page.locator('a[href^="https://play.google.com/"]').count()).toBeGreaterThan(0);
    await expect(page.getByTestId('portal-help')).toBeVisible();
    // W76: every WhatsApp link carries only the static sys prefill.
    const waHrefs = await page
      .locator('a[href^="https://wa.me/"]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
    expect(waHrefs.length).toBeGreaterThan(0);
    for (const href of waHrefs) expect(new URL(href).searchParams.get('text')).toBe(p.prefill);
  });

  test(`portal entry ${p.path}: the app card carries the QR from 901 px and folds away below`, async ({
    page,
  }, testInfo) => {
    await page.goto(p.path);
    if (testInfo.project.name === 'desktop') {
      await expect(page.getByTestId('portal-app-desktop')).toBeVisible();
      await expect(page.getByTestId('portal-app-desktop').locator('svg[role="img"]')).toHaveCount(
        1,
      );
      await expect(page.getByTestId('portal-app-mobile')).toBeHidden();
    } else {
      await expect(page.getByTestId('portal-app-desktop')).toBeHidden();
      const details = page.getByTestId('portal-app-mobile');
      await expect(details).toBeVisible();
      await details.locator('summary').click();
      await expect(details.locator('a[href^="https://play.google.com/"]')).toBeVisible();
    }
  });

  test(`portal entry ${p.path}: the language switch keeps the page`, async ({ page }) => {
    await page.goto(p.path);
    await page.getByRole('link', { name: p.other, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${p.otherPath.replace(/\//g, '\\/')}$`));
    await expect(page.getByTestId('page-h1')).toBeVisible();
  });
}
