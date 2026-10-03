import { test, expect } from '@playwright/test';

// T13 — the newsletter one-shots (W5, I12). The token below is a dummy and must stay one: the
// Ops routes run for real under every token class, so no run may ever carry a real subscriber's
// token. Door-less (a local build and every preview but `staging`, W92): the click answers
// `unconfigured` → the `unavailable` panel, the one-click POST 503. With the door (`staging`):
// Operations refuses the dummy → `invalid`, 400. Both are accepted, nothing else is.
const TOKEN = 'e2e-dummy-token-0000000000';
const NO_REAL_OUTCOME = /^(unavailable|invalid)$/;
const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|\bundefined\b|MISSING_MESSAGE|\bsys\./;

const PAGES = [
  { tr: '/abone-onay', en: '/en/newsletter/confirm' },
  { tr: '/abonelikten-cik', en: '/en/newsletter/unsubscribe' },
] as const;

for (const p of PAGES) {
  for (const locale of ['tr', 'en'] as const) {
    const path = p[locale];

    test(`newsletter ${path}: a click-to-forward page that forwards nothing on load`, async ({
      page,
    }) => {
      const res = await page.goto(`${path}?token=${TOKEN}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      expect(await page.locator('body').innerText()).not.toMatch(LEAK);
      await expect(page.getByTestId('newsletter-action').getByRole('button')).toBeVisible();
      await expect(page.getByTestId('newsletter-outcome')).toHaveCount(0);
      await expect(page.getByTestId('newsletter-fallback')).toHaveCount(0);
      // W76: the token never sits in an href — canonical, hreflang, switcher, contact links.
      await expect(page.locator(`[href*="${TOKEN}"]`)).toHaveCount(0);
    });

    test(`newsletter ${path}: the click reaches the server action and ends in the manual fallback`, async ({
      page,
    }) => {
      await page.goto(`${path}?token=${TOKEN}`);
      const action = page.getByTestId('newsletter-action');
      // The button acts from JavaScript only (no native form) — wait for hydration.
      await expect(action).toHaveAttribute('data-ready', 'true');
      await action.getByRole('button').click();
      const fallback = page.getByTestId('newsletter-fallback');
      await expect(fallback).toBeVisible();
      await expect(fallback).toHaveAttribute('data-outcome', NO_REAL_OUTCOME);
      await expect(page.getByTestId('newsletter-answer')).toBeFocused();
      await expect(fallback.locator('a[href^="mailto:info@jobsadmire.com"]')).toBeVisible();
      await expect(fallback.locator('a[href^="https://wa.me/"]')).toBeVisible();
      await expect(page.getByTestId('newsletter-action')).toHaveCount(0);
      await expect(page.locator(`[href*="${TOKEN}"]`)).toHaveCount(0);
    });

    test(`newsletter ${path}: without a token, the "link incomplete" state and the fallback`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      await expect(page.getByTestId('newsletter-action')).toHaveCount(0);
      await expect(page.getByTestId('newsletter-fallback')).toHaveAttribute(
        'data-outcome',
        'noToken',
      );
    });
  }
}

test('the language switch keeps the page and drops the token (W76)', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'the header switcher sits in the hamburger below 901 px',
  );
  await page.goto(`/abone-onay?token=${TOKEN}`);
  await page.getByRole('link', { name: 'English', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en\/newsletter\/confirm$/);
  await expect(page.getByTestId('newsletter-fallback')).toHaveAttribute('data-outcome', 'noToken');
});

test.describe('RFC 8058 one-click unsubscribe (I12)', () => {
  for (const path of ['/abonelikten-cik', '/en/newsletter/unsubscribe']) {
    test(`a one-click POST to ${path} reaches the handler through the proxy rewrite`, async ({
      request,
    }) => {
      const bodies = [
        { form: { 'List-Unsubscribe': 'One-Click' } },
        { multipart: { 'List-Unsubscribe': 'One-Click' } },
      ];
      for (const body of bodies) {
        const res = await request.post(`${path}?token=${TOKEN}`, body);
        expect([400, 503]).toContain(res.status());
        expect(res.headers()['cache-control']).toContain('no-store');
        expect((await res.json()).error).toMatch(/^(unconfigured|invalid)$/);
      }
    });
  }

  test('a POST that is not the one-click pair is refused with 400', async ({ request }) => {
    const res = await request.post(`/abonelikten-cik?token=${TOKEN}`, { form: { foo: 'bar' } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'not-one-click' });
  });

  test('an implausible token is refused with 400 before any forward', async ({ request }) => {
    const res = await request.post('/api/newsletter/unsubscribe?token=short', {
      form: { 'List-Unsubscribe': 'One-Click' },
    });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'invalid' });
  });
});
