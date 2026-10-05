import { test, expect } from '@playwright/test';

// Owner 2026-10-05: the /portal-login chooser page is retired. "CRM Girişi" / "CRM Login" in the
// chrome is an external link that opens the partner portal's login in a new tab; the old URLs
// answer one 308 straight to it (redirects/rules.json, docs/redirects.md).
const LOGIN = 'https://portal.jobsadmire.com/auth/login';

for (const [path, label] of [
  ['/', 'CRM Girişi'],
  ['/en', 'CRM Login'],
] as const) {
  test(`${path}: the chrome CRM login link is external and opens in a new tab`, async ({
    page,
  }) => {
    await page.goto(path);
    const links = page.locator(`a[href="${LOGIN}"]`);
    expect(await links.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await links.count()); i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }
    await expect(page.locator(`a:has-text("${label}")`).first()).toHaveAttribute('href', LOGIN);
    await expect(page.locator('a[href*="portal-login"], a[href*="portal-girisi"]')).toHaveCount(0);
  });
}

for (const path of ['/portal-login', '/en/portal-login', '/portal-girisi']) {
  test(`${path} answers one 308 to the partner portal login`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe(LOGIN);
  });
}
