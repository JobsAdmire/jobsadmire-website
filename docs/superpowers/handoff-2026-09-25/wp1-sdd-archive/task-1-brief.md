### Task 1: Stack spike — Next 16 + next-intl 4 routing (pass/fail, with fallback)

**Files:**

- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/messages/tr.json`, `src/messages/en.json`, `src/proxy.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/hire-workers/page.tsx`, `src/app/api/revalidate/route.ts` (stub)
- Modify: `next.config.ts`, `src/app/layout.tsx` (delete; the `[locale]` layout becomes the root), `package.json`
- Test: `e2e/routing.spec.ts`, `src/i18n/routing.test.ts`

**Interfaces:**

- Produces: `routing` (from `defineRouting`), `locales = ['tr','en'] as const`, `type Locale`, `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` (from `createNavigation`), internal pathname keys listed below (every later task links with these keys, never with `/isci-talebi`).

- [ ] **Step 1: Install next-intl and write the routing config**

```bash
npm install next-intl@^4
```

`src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Internal pathname → external path per locale (D16). Add routes here only. */
export const pathnames = {
  '/': '/',
  '/hire-workers': { tr: '/isci-talebi', en: '/hire-workers' },
  '/hiring-cost-calculator': { tr: '/maliyet-hesaplayici', en: '/hiring-cost-calculator' },
  '/partner-with-us': { tr: '/ortak-olun', en: '/partner-with-us' },
  '/work-permit': { tr: '/calisma-izni', en: '/work-permit' },
  '/about': { tr: '/hakkimizda', en: '/about' },
  '/verify': { tr: '/temsilci-dogrulama', en: '/verify' },
  '/careers': { tr: '/kariyer', en: '/careers' },
  '/careers/[slug]': { tr: '/kariyer/[slug]', en: '/careers/[slug]' },
  '/contact': { tr: '/iletisim', en: '/contact' },
  '/available-workers': { tr: '/adaylar', en: '/available-workers' },
  '/success-stories': { tr: '/basari-hikayeleri', en: '/success-stories' },
  '/blog': '/blog',
  '/blog/[slug]': '/blog/[slug]',
  '/portal-login': { tr: '/portal-girisi', en: '/portal-login' },
  '/privacy': { tr: '/gizlilik', en: '/privacy' },
  '/terms': { tr: '/kullanim-kosullari', en: '/terms' },
  '/kvkk': '/kvkk',
  '/cookie-policy': { tr: '/cerez-politikasi', en: '/cookie-policy' },
  '/thank-you': { tr: '/tesekkurler', en: '/thank-you' },
  '/newsletter/confirm': { tr: '/abone-onay', en: '/newsletter/confirm' },
  '/newsletter/unsubscribe': { tr: '/abonelikten-cik', en: '/newsletter/unsubscribe' },
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'tr',
  localePrefix: 'as-needed', // TR unprefixed, /en prefixed (D1)
  localeDetection: false, // crawlers and visitors always get TR at the root; the LanguageHint offers EN once
  localeCookie: { name: 'ja_locale', maxAge: 60 * 60 * 24 * 365 },
  pathnames,
});
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

`src/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    // sys.* UI copy only — page content comes from the bundle (src/content/adapter.ts)
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

`src/messages/tr.json`:

```json
{
  "sys": {
    "skipToContent": "İçeriğe geç",
    "languageName": "Türkçe",
    "notFoundTitle": "Sayfa bulunamadı",
    "notFoundBody": "Aradığınız sayfa taşınmış veya kaldırılmış olabilir.",
    "errorTitle": "Bir şeyler ters gitti",
    "errorRetry": "Tekrar dene",
    "home": "Ana sayfa"
  }
}
```

`src/messages/en.json`:

```json
{
  "sys": {
    "skipToContent": "Skip to content",
    "languageName": "English",
    "notFoundTitle": "Page not found",
    "notFoundBody": "The page you are looking for may have moved or been removed.",
    "errorTitle": "Something went wrong",
    "errorRetry": "Try again",
    "home": "Home"
  }
}
```

- [ ] **Step 2: Proxy, config plugin, and the `[locale]` layout**

`src/proxy.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function proxy(request: Parameters<typeof intl>[0]) {
  return intl(request);
}

export const config = {
  // never intercept API routes, Next internals, Vercel internals, or files with an extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

`next.config.ts`:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
```

Delete `src/app/layout.tsx` and `src/app/page.tsx`; create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = { title: 'JobsAdmire' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

`src/app/[locale]/page.tsx` (temporary, replaced in WP2):

```tsx
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <h1 data-testid="home-h1">{locale === 'tr' ? 'Ana sayfa' : 'Home'}</h1>
      <Link href="/hire-workers">hire</Link>
    </main>
  );
}
```

`src/app/[locale]/hire-workers/page.tsx` (temporary):

```tsx
import { setRequestLocale } from 'next-intl/server';

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <h1 data-testid="hire-h1">{locale}</h1>;
}
```

`src/app/api/revalidate/route.ts` (stub proving the matcher excludes it):

```ts
import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Unit test the pathname table shape**

`src/i18n/routing.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { pathnames, routing } from './routing';

describe('routing', () => {
  it('has tr as the unprefixed default and en prefixed', () => {
    expect(routing.defaultLocale).toBe('tr');
    expect(routing.localePrefix).toBe('as-needed');
    expect(routing.localeDetection).toBe(false);
  });
  it('gives every localized pathname a tr and an en form', () => {
    for (const [internal, ext] of Object.entries(pathnames)) {
      if (typeof ext === 'string') continue;
      expect(ext.tr, internal).toMatch(/^\/[a-z0-9\-\[\]/]+$/);
      expect(ext.en, internal).toMatch(/^\/[a-z0-9\-\[\]/]+$/);
    }
  });
  it('never reuses a Turkish slug for two routes', () => {
    const tr = Object.values(pathnames).map((p) => (typeof p === 'string' ? p : p.tr));
    expect(new Set(tr).size).toBe(tr.length);
  });
});
```

Run: `npm run test -- src/i18n/routing.test.ts` Expected: 3 passed.

- [ ] **Step 4: Build and run the routing e2e**

`e2e/routing.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('root is Turkish, unprefixed', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
});

test('/en is English', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('a superfluous /tr prefix redirects to the root form', async ({ page }) => {
  const res = await page.goto('/tr/isci-talebi');
  expect(new URL(page.url()).pathname).toBe('/isci-talebi');
  expect(res?.status()).toBe(200);
});

test('localized Turkish slug renders the internal route', async ({ page }) => {
  await page.goto('/isci-talebi');
  await expect(page.getByTestId('hire-h1')).toHaveText('tr');
});

test('English slug under /en renders the internal route', async ({ page }) => {
  await page.goto('/en/hire-workers');
  await expect(page.getByTestId('hire-h1')).toHaveText('en');
});

test('the Link component emits the localized href', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a', { hasText: 'hire' })).toHaveAttribute('href', '/isci-talebi');
});

test('API routes are not intercepted by the locale proxy', async ({ request }) => {
  const res = await request.post('/api/revalidate');
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

test('the locale cookie uses our name', async ({ page, context }) => {
  await page.goto('/en');
  const names = (await context.cookies()).map((c) => c.name);
  expect(names).not.toContain('NEXT_LOCALE');
});
```

Run:

```bash
npm run verify && npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4 && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/routing.spec.ts --project=desktop; kill $(cat /tmp/next.pid)
```

Expected: build succeeds with `proxy.ts` (no "middleware" deprecation), 8 passed.

**Pass/fail rule (D5):** all eight pass by the end of the first working day → continue. Otherwise record the failing behaviour in `docs/ARCHITECTURE.md` under "Stack spike" and switch to Next 15 + next-intl 3 (`npm install next@15 next-intl@3`, `src/middleware.ts` with the same routing object) before any other task starts. No further debate.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(i18n): Turkish-root routing with localized pathnames (next-intl 4, proxy.ts)"
```

---

