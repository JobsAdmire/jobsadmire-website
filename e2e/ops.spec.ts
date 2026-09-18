import { test, expect } from '@playwright/test';
import tr from '../src/messages/tr.json';

// Matches the secret the task's local production server is started with; on a preview these
// cases are skipped rather than failing (see below).
const SECRET = process.env.REVALIDATE_SECRET ?? 'wp1-local-secret-0123456789';

test('site-health answers honestly and is never cached (D25)', async ({ request }) => {
  const res = await request.get('/api/site-health');
  expect(res.status()).toBe(200);
  expect(res.headers()['cache-control']).toContain('no-store');
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.source).toBe('LOCAL');
  expect(body.checks.bundleTr).toBe('ok');
  expect(body.checks.bundleEn).toBe('ok');
  // LOCAL has no publish pipeline and WP3a has not added the ping: both are skipped, not
  // reported green.
  expect(body.checks.lastRevalidate).toBe('skip');
  expect(body.checks.opsPing).toBe('skip');
  expect(body.reasons).toEqual([]);
  expect(body.contractVersion).toBe('1.0');
});

test('revalidate refuses an unauthenticated call', async ({ request }) => {
  const res = await request.post('/api/revalidate', { data: { tags: ['site:tr'] } });
  expect(res.status()).toBe(401);
});

test('revalidate refuses a wrong token', async ({ request }) => {
  const res = await request.post('/api/revalidate', {
    headers: { Authorization: 'Bearer not-the-secret-0123456789' },
    data: { tags: ['site:tr'] },
  });
  expect(res.status()).toBe(401);
});

test('revalidate accepts the secret and reports the tags it purged', async ({ request }) => {
  const res = await request.post('/api/revalidate', {
    headers: { Authorization: `Bearer ${SECRET}` },
    data: { tags: ['site:tr'] },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.revalidated).toEqual(['site:tr']);
  expect(Number.isNaN(Date.parse(body.at))).toBe(false);
});

test('revalidate rejects a malformed tag before purging anything', async ({ request }) => {
  const res = await request.post('/api/revalidate', {
    headers: { Authorization: `Bearer ${SECRET}` },
    data: { tags: ['bad tag!'] },
  });
  expect(res.status()).toBe(400);
});

test('an unmatched Turkish URL is a 404 inside the Turkish chrome (R6)', async ({ page }) => {
  const res = await page.goto('/this-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await expect(page.locator('h1')).toHaveText(tr.sys.notFoundTitle);
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('an unmatched English URL is a 404 inside the English chrome', async ({ page }) => {
  const res = await page.goto('/en/this-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the dev gallery does not exist in a production build (R41)', async ({ page }) => {
  const res = await page.goto('/dev/gallery');
  expect(res?.status()).toBe(404);
});
