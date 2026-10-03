### Task 13: Portal entry + legal + newsletter routes

Three route families on the WP2a foundation, none of them a pixel-harness page (D27: side-by-side review):

1. **`/portal-girisi` · `/en/portal-login`** — the `(bare)` route group (W19; no chrome, `(bare)/layout.tsx` owns `<main id="main">`). A **link-only chooser** (W8, D22, I15): one Partner Portal tile → `settings.portal.host + loginPath` and `+ forgotPath` (same-tab anchors), the Android store badge + a local QR (W14), the help card, the two legal-flagged notes. **No credential form, no reset flow, no Operations tile, no ChatAdmire tile, no session-reason banner, no e-mail-domain detection** — ~40 of the 99 `crmlogin.*` ids stay imported-but-unrendered (listed under Package ids). `noindex` (page record + forced, like `/thank-you`).
2. **`/gizlilik` · `/kullanim-kosullari` · `/kvkk` · `/cerez-politikasi`** (+ `/en/privacy|terms|kvkk|cookie-policy`) — the `(minimal)` group (`SiteChrome variant="minimal"`). Privacy (TR + EN) and Terms (EN only, with a Turkish notice on the TR route — spec §10 row 6 auto-default) are **seeded from the old site's JSON** on `origin/main-backup` (`public/locales/{en,tr}/privacy.json`, `public/locales/en/terms.json`; `tr/terms.json` is byte-identical to the English — never translated) and re-authored as `sys.legal.privacy.*` / `sys.legal.terms.*` (D14). KVKK and Cookie Policy are **counsel placeholders** (`data-placeholder`, D14/D26): the cookie page carries the minimal notice §10 row 6 names; the KVKK page points at the Privacy Policy. Every "last updated" date renders from a `sys.legal.<doc>.updatedAt` ISO key through `formatDate` (D17). Indexable, BreadcrumbList JSON-LD.
3. **`/abone-onay` · `/abonelikten-cik`** (+ `/en/newsletter/confirm|unsubscribe`) — `(minimal)` group, `noindex`. The token comes from `?token=`; it is forwarded to Operations **only on the visitor's click** (a server action; never on page load — mail-link scanners would consume the one-shot confirm token, W5/I12), plus the **RFC 8058 one-click handler** `src/app/api/newsletter/unsubscribe/route.ts` reached through a method-aware rewrite in `proxy.ts` (the mail client POSTs `List-Unsubscribe=One-Click` to the *page* URL Operations prints — `NEWSLETTER_PATHS` — not to `/api/…`). Outcomes render from the door's enum; 400/410/`UNKNOWN`/unreachable show the manual `info@jobsadmire.com` fallback (I12).

Ops door facts this task binds to (read from `jobsadmire-operations-website/apps/backend/src/modules/website/newsletter/*` on 2026-09-20): `GET ${OPS_API_URL}/api/website/v1/newsletter/confirm?token=` → 200 `{ data: { outcome: 'CONFIRMED' | 'ALREADY_CONFIRMED' } }`, 400 `{ code: 'NEWSLETTER_TOKEN_INVALID' }`, 410 (expired, 48 h TTL); `GET`/`POST ${OPS_API_URL}/api/website/v1/newsletter/unsubscribe?token=` → 200 `{ data: { outcome: 'UNSUBSCRIBED' | 'ALREADY_UNSUBSCRIBED' | 'UNKNOWN' } }`, 400 on a bad signature; the POST is the RFC 8058 forward (body ignored, `@HttpCode(200)`). `?token` DTO: string, length 16..200. Class-level `@Public() + WebsiteModuleEnabledGuard + WebsiteApiGuard` → module off = bare 404 before the token check; the write token is required (`Authorization: Bearer`). Every newsletter route answers `Cache-Control: private, no-store`. **These routes never read the token class — a test-token smoke run must never carry a real subscriber's token.** The website's `pathnames` and Ops `NEWSLETTER_PATHS` are a verbatim mirror (`/abone-onay`, `/abonelikten-cik`, `/en/newsletter/confirm`, `/en/newsletter/unsubscribe`) — never change one side alone.

**Files:**

Create
- `src/app/[locale]/(bare)/portal-login/page.tsx`
- `src/app/[locale]/(minimal)/_legal/LegalDocument.tsx`
- `src/app/[locale]/(minimal)/privacy/page.tsx`
- `src/app/[locale]/(minimal)/terms/page.tsx`
- `src/app/[locale]/(minimal)/kvkk/page.tsx`
- `src/app/[locale]/(minimal)/cookie-policy/page.tsx`
- `src/app/[locale]/(minimal)/newsletter/_components/TokenForwardForm.tsx`
- `src/app/[locale]/(minimal)/newsletter/_components/NewsletterOutcome.tsx`
- `src/app/[locale]/(minimal)/newsletter/_components/NewsletterPage.tsx`
- `src/app/[locale]/(minimal)/newsletter/confirm/page.tsx`
- `src/app/[locale]/(minimal)/newsletter/confirm/actions.ts`
- `src/app/[locale]/(minimal)/newsletter/unsubscribe/page.tsx`
- `src/app/[locale]/(minimal)/newsletter/unsubscribe/actions.ts`
- `src/app/api/newsletter/unsubscribe/route.ts`
- `src/lib/legal/body.ts`, `src/lib/legal/documents.ts`
- `src/lib/newsletter/types.ts`, `src/lib/newsletter/classify.ts`, `src/lib/newsletter/forward.ts`, `src/lib/newsletter/one-click.ts`, `src/lib/newsletter/copy.ts`
- `e2e/pages/portal.spec.ts`, `e2e/pages/legal.spec.ts`, `e2e/pages/newsletter.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — new `sys.portal`, `sys.legal`, `sys.newsletter` objects and seven `sys.seo.<pageKey>` entries (inside the `sys.seo` object Task 4 created for `ogTagline`)
- `src/proxy.ts` (today lines 1–20: the whole file) — the RFC 8058 POST rewrite before the `410` check
- `src/lib/seo/routes.ts` — delete seven keys from `UNBUILT_PATHNAMES` (Task 4's set; symbol, not line: `'/portal-login'`, `'/privacy'`, `'/terms'`, `'/kvkk'`, `'/cookie-policy'`, `'/newsletter/confirm'`, `'/newsletter/unsubscribe'`)
- `e2e/routes.ts` — append 14 rows to `GATE_ROUTE_TABLE` (Task 7's table)
- `e2e/seo.spec.ts` — one added assertion in the existing `robots.txt` case (today lines 42–49)
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md`, `docs/PRD.md`

Test
- `src/lib/legal/body.test.ts`, `src/lib/legal/documents.test.ts`
- `src/lib/newsletter/classify.test.ts`, `src/lib/newsletter/forward.test.ts`, `src/lib/newsletter/one-click.test.ts`, `src/lib/newsletter/copy.test.ts`
- `src/messages/task13-keys.test.ts`
- `e2e/pages/portal.spec.ts`, `e2e/pages/legal.spec.ts`, `e2e/pages/newsletter.spec.ts`

**Interfaces:**

Consumes (exact names — WP1 as read on `wp2/foundation`, WP2a as spelled in `produces-final.md`):
- WP1: `getBundle`, `makeT`, `makeTf`, `fill` from `@/content/adapter` (server; `makeTf`/`fill` are `pure.ts` exports re-exported); `Bundle`/`Settings` from `contract/website-bundle.v1`; `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` from `@/lib/seo/metadata`; `waLink`, `mailLink` from `@/lib/contact`; `Section`, `Button` from `@/design/primitives`; `LanguageSwitcher({ locale, label, variant? })` from `@/design/chrome/LanguageSwitcher`; `getTranslations`/`setRequestLocale` (next-intl/server), `useTranslations` (next-intl); `hasLocale`; the thank-you page pattern (`generateMetadata` → `hasLocale || notFound()` → `getBundle` → `buildMetadata` + forced `robots`; default export → `setRequestLocale`; no `<main>`); `sys.home`, `sys.whatsapp.prefill`; package ids `crmlogin.*` + `home.016`.
- WP2a Task 1: `getMetric` is not needed (both metric strings on the page are re-authored ids read through `makeTf`: `crmlogin.055` `{placed}`, `crmlogin.057` `{replySlaHours}` — `scripts/metric-placeholders.json` lines 79–80); `PAGE_KEYS` entries `portal`, `privacy`, `terms`, `kvkk`, `cookiePolicy`, `newsletterConfirm`, `newsletterUnsubscribe`; page records: `portal`/`newsletter*` `robots: 'noindex'`, the four legal `'index'` with `jsonLd: ['breadcrumb']`, every `titleId`/`descriptionId` `''` → `sys.seo.<pageKey>.*` fallbacks (W38).
- WP2a Task 2: `doorConfig(env?): DoorConfig | null` and `type DoorConfig = { base: string; token: string }` from `@/forms/env` (`server-only`; a type-only import is erased and safe in `src/lib/newsletter/forward.ts`).
- WP2a Task 3: `ContactLink({ href, placement, ...anchorProps })` from `@/analytics/ContactLink`; `buttonClassName(variant, size?, className?)` from `@/design/primitives`; `NOINDEX_PATHNAMES` unchanged (the three routes are already in it).
- WP2a Task 4: `UNBUILT_PATHNAMES`, `robotsDisallowPaths` (`src/lib/seo/routes.ts`), `src/lib/seo/unbuilt.test.ts` (fails when the set and the filesystem disagree), `sys.seo` object (`ogTagline`).
- WP2a Task 5: `Breadcrumbs({ locale, items: Crumb[] })`, `type Crumb = { name; href: Href }`, `ContactCta({ placement: 'page_cta', href, variant?, size?, external?, className?, children })`, `StoreBadges({ bundle, locale, android, ios?, tone? })` from `@/design/blocks`; `formatDate(iso, locale)` from `@/lib/format/date`; `Section` tone `'pale'`; `Button` variant `'inverse'`; `sys.nav.breadcrumbs`.
- WP2a Task 6: `QrCode({ text, label, size?, className? })` from `@/design/QrCode` (`server-only`); `BRAND.mark` from `@/design/assets/brand`.
- WP2a Task 7: `GATE_ROUTE_TABLE: readonly GateRoute[]` (`e2e/routes.ts`), `npm run js-size`, `npm run gate`, the page markup contract (`h1[data-testid="page-h1"]`, `data-lcp-slot`, named `data-placeholder`).

Produces (later tasks rely on):
- `src/lib/newsletter/*` — `forwardNewsletterToken`, `classifyNewsletterResponse`, `isPlausibleToken`, `isOneClickBody`, `isOneClickUnsubscribe`, `outcomeCopy` — T14 (forms E2E on staging) drives the confirm/unsubscribe smoke through these with a **test-token dry run only against a throw-away subscriber**.
- The `(minimal)/_legal/LegalDocument.tsx` renderer + `src/lib/legal/body.ts` Markdown-lite parser — the counsel copy for KVKK/Cookie lands by replacing `sys.legal.<doc>.*` values and removing the `data-placeholder` aside; no code change.
- The `proxy.ts` method-aware rewrite (`isOneClickUnsubscribe`) — documented in ARCHITECTURE § Routing; T15's launch sweep asserts it.
- `sys.legal.privacy.title` is the label every consent link (`FormShell consentLinkHref="/privacy"`) lands on; `sys.consent.policy` (WP1) already targets `/cookie-policy`, now a real page.

---

#### Cycle 1 — Portal entry page (`(bare)/portal-login`)

- [ ] **Step 1: Write the failing tests**

`src/messages/task13-keys.test.ts` (grows in later cycles; start with the portal keys):

```ts
import { describe, expect, it } from 'vitest';
import en from './en.json';
import tr from './tr.json';

type Tree = { [k: string]: string | Tree };
const get = (tree: Tree, path: string): unknown =>
  path.split('.').reduce<unknown>((n, k) => (n && typeof n === 'object' ? (n as Tree)[k] : undefined), tree);

/** Every key this task reads with `sys()` / `sys.raw()` — a missing key is a `MISSING_MESSAGE`
 *  string in the page, which no e2e text check catches reliably (W9/W23). */
export const TASK13_KEYS = [
  'sys.seo.portal.title',
  'sys.seo.portal.description',
  'sys.portal.intro',
  'sys.portal.signIn',
];

describe('Task 13 sys keys (portal)', () => {
  for (const key of TASK13_KEYS) {
    it(`${key} is a non-empty string in both locales`, () => {
      for (const [name, tree] of [['tr', tr], ['en', en]] as const) {
        const v = get(tree as unknown as Tree, key);
        expect(typeof v, `${name}: ${key}`).toBe('string');
        expect((v as string).length, `${name}: ${key}`).toBeGreaterThan(0);
      }
    });
  }
});
```

`e2e/pages/portal.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|\bundefined\b|MISSING_MESSAGE/;

for (const [path, other, otherPath] of [
  ['/portal-girisi', 'English', '/en/portal-login'],
  ['/en/portal-login', 'Türkçe', '/portal-girisi'],
] as const) {
  test(`portal entry ${path}: link-only chooser, no chrome, noindex`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByTestId('page-h1')).toBeVisible();
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);

    // W19: the bare group renders exactly one <main> and none of the shared chrome.
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('header nav')).toHaveCount(0);
    await expect(page.locator('footer')).toHaveCount(0);

    // W8 / D22: links out, never a credential form.
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.getByTestId('portal-login-link')).toHaveAttribute(
      'href',
      'https://portal.jobsadmire.com/auth/login',
    );
    await expect(page.getByTestId('portal-forgot-link')).toHaveAttribute(
      'href',
      'https://portal.jobsadmire.com/auth/forgot-password',
    );
    expect(await page.locator('a[href*="operations.jobsadmire.com"]').count()).toBe(0);
    expect(await page.locator('a[href*="chatadmire"]').count()).toBe(0);
    // Android only (settings.storeLinks.ios is null); the QR encodes the Play Store URL.
    await expect(page.locator('a[href*="play.google.com"]').first()).toBeVisible();
    await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(0);
    await expect(page.getByTestId('portal-help')).toBeVisible();
  });

  test(`portal entry ${path}: the language switch keeps the page`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole('link', { name: other, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${otherPath.replace(/\//g, '\\/')}$`));
    await expect(page.getByTestId('page-h1')).toBeVisible();
  });
}
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/messages/task13-keys.test.ts          # fails: sys.seo.portal.* / sys.portal.* undefined
npx vitest run src/lib/seo/unbuilt.test.ts              # passes today; will fail after the page is added until '/portal-login' leaves UNBUILT_PATHNAMES
```
(The e2e spec needs a build — it runs in Step 4.)

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside the existing `"seo": { "ogTagline": … }` object add:

```json
"portal": {
  "title": "Portal login | JobsAdmire",
  "description": "Sign in to the JobsAdmire Partner Portal: agreements, candidates and permit status in one place."
}
```

and as a new object inside `"sys"` (sibling of `"form"`):

```json
"portal": {
  "intro": "Sign in to the JobsAdmire portal with your partner account.",
  "signIn": "Sign in to the Partner Portal"
}
```

`src/messages/tr.json` — the same two additions:

```json
"portal": {
  "title": "Portal girişi | JobsAdmire",
  "description": "JobsAdmire İş Ortağı Portalı'na giriş yapın: sözleşmeler, adaylar ve izin durumu tek yerde."
}
```

```json
"portal": {
  "intro": "İş ortağı hesabınızla JobsAdmire portalına giriş yapın.",
  "signIn": "İş Ortağı Portalı'na giriş yap"
}
```

`src/app/[locale]/(bare)/portal-login/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { BRAND } from '@/design/assets/brand';
import { ContactCta, StoreBadges } from '@/design/blocks';
import { LanguageSwitcher } from '@/design/chrome/LanguageSwitcher';
import { Button, buttonClassName } from '@/design/primitives';
import { QrCode } from '@/design/QrCode';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** The four partner check-list points (crmlogin.049–052) and the three app points (059–062). */
const POINT_IDS = ['crmlogin.049', 'crmlogin.050', 'crmlogin.051', 'crmlogin.052'] as const;
const APP_POINT_IDS = ['crmlogin.060', 'crmlogin.061', 'crmlogin.062'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  return {
    ...buildMetadata({
      locale,
      href: '/portal-login',
      bundle,
      pageKey: 'portal',
      fallbackTitle: sys('seo.portal.title'),
      fallbackDescription: sys('seo.portal.description'),
    }),
    // W8 / spec §3.1: the portal door is never indexed, whatever a later page record says.
    robots: { index: false, follow: false },
  };
}

function CheckDot() {
  return (
    <span
      aria-hidden
      className="mt-px flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full border border-sky/45 bg-blue/20"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" className="text-sky">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

/** The "Get the mobile app" card. Rendered twice (R30 pattern): the dark desktop card with the
 *  QR (`hidden md:flex`), and a light `<details>` on phones without the QR — scanning a code with
 *  the phone you are holding is pointless, the badge is the door there. Android only (W8). */
function AppCard({
  bundle,
  locale,
  t,
  variant,
}: {
  bundle: Bundle;
  locale: Locale;
  t: (id: string) => string;
  variant: 'dark' | 'light';
}) {
  const android = bundle.settings.storeLinks.android;
  if (!android) return null;
  const dark = variant === 'dark';
  return (
    <div
      className={
        dark
          ? 'relative flex items-center gap-4 rounded-md border border-white/[0.13] bg-white/[0.06] px-4 py-4'
          : 'flex flex-col gap-3 rounded-md border border-border-1 bg-pale-1 p-4'
      }
      data-testid={`portal-app-${variant}`}
    >
      {dark && <QrCode text={android} label={t('crmlogin.030')} size={82} className="flex-none rounded-xs bg-white" />}
      <div className="min-w-0">
        {dark && (
          <div className="mb-2 inline-flex items-center gap-2">
            <span aria-hidden className="block h-[7px] w-[7px] rounded-full bg-success" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-[1.2px] text-sky">{t('crmlogin.011')}</span>
          </div>
        )}
        <p className={dark ? 'text-body-sm font-extrabold leading-tight' : 'text-body-sm font-extrabold text-ink'}>
          {t('crmlogin.059')}
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {APP_POINT_IDS.map((id) => (
            <li key={id} className={`flex items-start gap-2 text-body-sm font-semibold ${dark ? 'text-white/60' : 'text-text-secondary'}`}>
              <span aria-hidden className={`mt-[6px] block h-[5px] w-[5px] flex-none rounded-full ${dark ? 'bg-sky' : 'bg-blue-safe'}`} />
              <span>{t(id)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <StoreBadges bundle={bundle} locale={locale} android={android} ios={null} tone={dark ? 'dark' : 'light'} />
        </div>
      </div>
    </div>
  );
}

export default async function PortalLogin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale); // crmlogin.055 {placed}, crmlogin.057 {replySlaHours} (D17)
  const { settings } = bundle;
  const loginUrl = `${settings.portal.host}${settings.portal.loginPath}`;
  const forgotUrl = `${settings.portal.host}${settings.portal.forgotPath}`;
  const waHref = waLink(settings.whatsappNumber, sys('whatsapp.prefill'));

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.02fr_1fr]" data-testid="portal-shell">
      {/* 1 · Brand panel (design .ja-cl-brand — #0a1428 normalised to the navy token) */}
      <section className="relative overflow-hidden bg-navy px-5 py-8 text-white md:px-14 md:py-11" data-testid="portal-brand">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-36 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(24,153,213,0.32)_0%,rgba(24,153,213,0)_70%)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-28 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(24,153,213,0.14)_0%,rgba(24,153,213,0)_70%)]" />

        <div className="relative flex items-center gap-3">
          <Image src={BRAND.mark.src} alt="JobsAdmire" width={34} height={34} className="rounded-[9px] bg-white p-[3px]" priority />
          <span className="text-[16px] font-extrabold tracking-[-0.3px]">JobsAdmire</span>
          <span className="ml-0.5 rounded-pill border border-white/15 bg-white/10 px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[1px] text-white/70">
            {t('crmlogin.045')}
          </span>
        </div>

        {/* 2 · Headline block — the h1 is the LCP on every width (D20: stays visible on phones). */}
        <div className="relative mt-8 md:mt-10">
          <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">{t('crmlogin.046')}</p>
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-3 text-h2 leading-[1.08]">
            {t('crmlogin.047')}
          </h1>
          <p className="mt-3 max-w-[430px] text-body leading-relaxed text-white/70">{t('crmlogin.048')}</p>
          {/* W10: hidden on phones in the design → CSS, not conditional rendering */}
          <ul className="mt-7 hidden flex-col gap-3 md:flex" data-testid="portal-points">
            {POINT_IDS.map((id) => (
              <li key={id} className="flex items-start gap-3">
                <CheckDot />
                <span className="text-body-sm font-semibold leading-normal text-white/80">{t(id)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 · Support line — crmlogin.016's "~10 min" claim is dropped (D17: no signed SLA behind it). */}
        <div className="relative mt-8 hidden items-center gap-3 md:flex" data-testid="portal-trust">
          <span className="text-body-sm font-bold text-white/60">{t('crmlogin.014')}</span>
          <ContactCta placement="page_cta" href={waHref} external variant="inverse" size="md" className="ml-auto">
            {t('crmlogin.012')}
          </ContactCta>
        </div>

        {/* 4 · App card + QR (desktop) */}
        <div className="relative mt-5 hidden md:block">
          <AppCard bundle={bundle} locale={locale} t={t} variant="dark" />
        </div>

        {/* 5 · Licence chip (crmlogin.020 legal, verbatim) + agency line */}
        <div className="relative mt-6 hidden md:block" data-testid="portal-licence">
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.07] px-3 py-1.5 text-body-sm font-extrabold tracking-[0.4px] text-white/80">
            {t('crmlogin.020')}
          </span>
          <p className="mt-3 text-body-sm font-semibold text-white/55">{t('crmlogin.021')}</p>
        </div>
      </section>

      {/* 6 · Chooser column (design .ja-cl-form) */}
      <section className="flex flex-col bg-white px-5 py-8 md:px-14 md:py-10" data-testid="portal-chooser">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link href="/" prefetch={false} className="inline-flex min-h-[44px] items-center gap-2 text-body-sm font-bold text-text-tertiary no-underline hover:text-ink">
            <span aria-hidden>←</span>
            {t('crmlogin.001')}
          </Link>
          <LanguageSwitcher locale={locale} label={t('home.016')} />
        </div>

        <div className="mx-auto w-full max-w-[436px]">
          <h2 className="text-h2 leading-[1.12] text-ink">{t('crmlogin.002')}</h2>
          <p className="mt-2 text-body text-text-tertiary">{sys('portal.intro')}</p>

          {/* The single tile (W8): Partner Portal → login / forgot-password, same tab. */}
          <article className="mt-6 rounded-base border-[1.5px] border-tint-border bg-pale-1 p-4" data-testid="portal-tile">
            <div className="flex items-center gap-2">
              <span aria-hidden className="block h-2 w-2 rounded-full bg-blue" />
              <span className="text-body font-extrabold text-ink">{t('crmlogin.043')}</span>
            </div>
            <p className="mt-1 text-body-sm font-semibold text-text-secondary">{t('crmlogin.044')}</p>
            <a href={loginUrl} rel="noopener" className={buttonClassName('primary', 'lg', 'mt-4 w-full')} data-testid="portal-login-link">
              {sys('portal.signIn')}
            </a>
            <a href={forgotUrl} rel="noopener" className="mt-2 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-blue-safe no-underline hover:underline" data-testid="portal-forgot-link">
              {t('crmlogin.005')}
            </a>
            <p className="mt-3 text-body-sm font-semibold text-text-secondary">{t('crmlogin.054')}</p>
            <p className="mt-2 text-body-sm font-semibold text-text-secondary">{tf('crmlogin.055')}</p>
          </article>

          {/* Phone-only app card (design's ≤700px accordion) — native <details>, no JS. */}
          <details className="mt-3 md:hidden" data-testid="portal-app-mobile">
            <summary className="flex min-h-[50px] cursor-pointer list-none items-center rounded-sm border-[1.5px] border-border-1 bg-pale-1 px-4 text-body-sm font-extrabold text-ink">
              {t('crmlogin.013')}
            </summary>
            <div className="mt-2">
              <AppCard bundle={bundle} locale={locale} t={t} variant="light" />
            </div>
          </details>

          {/* 7 · Help card */}
          <aside className="mt-5 rounded-base border border-border-1 bg-pale-1 p-4" data-testid="portal-help">
            <h3 className="text-body-sm font-extrabold text-ink">{t('crmlogin.056')}</h3>
            <p className="mt-1 text-body-sm font-semibold text-text-secondary">{tf('crmlogin.057')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ContactCta placement="page_cta" href={waHref} external variant="secondary">
                {t('crmlogin.058')}
              </ContactCta>
              <Button variant="ghost" href="/contact">
                {t('crmlogin.019')}
              </Button>
            </div>
          </aside>

          {/* 8 · Anti-phishing (legal) · 9 · Licence foot (legal) — verbatim */}
          <p className="mt-4 text-body-sm font-bold text-text-secondary">{t('crmlogin.023')}</p>
          <p className="mt-3 text-center text-body-sm font-bold text-text-secondary">{t('crmlogin.022')}</p>
        </div>
      </section>
    </div>
  );
}
```

Notes for the executor: the page renders no `<main>` (the `(bare)` layout owns it, W19); the two portal anchors are plain `<a>` with `buttonClassName` because `Button external` forces `target="_blank"` and the design signs in in the same tab; `crmlogin.003` ("Pick the one your account belongs to") describes the multi-portal chooser D22 removed, so `sys.portal.intro` replaces it; `crmlogin.063` ("Free · iOS 15+ and Android 9+") is an unsupported iOS claim and is not rendered (W8); the design's CRM link host `crm.jobsadmire.com` does not resolve — `settings.portal.*` is the only source.

`src/lib/seo/routes.ts` — remove `'/portal-login'` from `UNBUILT_PATHNAMES` (Task 4's initialiser; keep the other 18 entries; `unbuilt.test.ts` now passes with the page present).

`e2e/routes.ts` — append to `GATE_ROUTE_TABLE`:

```ts
  { path: '/portal-girisi', indexable: false },
  { path: '/en/portal-login', indexable: false },
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run src/messages src/lib/seo
npm run verify
npm run build && (npx next start -p 3100 &) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/portal.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts --grep "portal" ; kill %1
```
Expected: unit green; `portal.spec.ts` green in both projects; axe 0 violations on both portal paths; no overflow at any width (the 1.02fr/1fr grid only from `lg`).

- [ ] **Step 5: Commit**

```
feat(portal): link-only portal entry page in the bare route group (T13, W8)

Partner Portal tile → settings.portal login/forgot, Android badge + local QR,
help card; no credential form, no Operations/ChatAdmire tiles (D22/I15).
noindex; /portal-login leaves UNBUILT_PATHNAMES; gate routes appended.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 2 — Legal body renderer + document tables (pure)

- [ ] **Step 1: Write the failing tests**

`src/lib/legal/body.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { parseLegalBody, parseRuns } from './body';

describe('parseRuns', () => {
  it('splits **bold** leads from plain text', () => {
    expect(parseRuns('**Address:** in the footer')).toEqual([
      { text: 'Address:', strong: true },
      { text: ' in the footer', strong: false },
    ]);
  });
  it('returns one plain run when there is no marker', () => {
    expect(parseRuns('plain')).toEqual([{ text: 'plain', strong: false }]);
  });
});

describe('parseLegalBody', () => {
  it('turns blank-line separated blocks into paragraphs and "- " blocks into lists', () => {
    const md = 'Intro line.\n\n- **A:** one\n- two\n\nOutro.';
    expect(parseLegalBody(md)).toEqual([
      { type: 'p', runs: [{ text: 'Intro line.', strong: false }] },
      {
        type: 'ul',
        items: [
          [
            { text: 'A:', strong: true },
            { text: ' one', strong: false },
          ],
          [{ text: 'two', strong: false }],
        ],
      },
      { type: 'p', runs: [{ text: 'Outro.', strong: false }] },
    ]);
  });
  it('joins wrapped lines inside one paragraph and ignores stray whitespace', () => {
    expect(parseLegalBody('  a\nb  \n\n\n c ')).toEqual([
      { type: 'p', runs: [{ text: 'a b', strong: false }] },
      { type: 'p', runs: [{ text: 'c', strong: false }] },
    ]);
  });
  it('returns [] for an empty body', () => {
    expect(parseLegalBody('')).toEqual([]);
  });
});
```

`src/lib/legal/documents.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { COOKIE_SECTIONS, LEGAL_DOCS, PRIVACY_SECTIONS, TERMS_SECTIONS, legalFillValues } from './documents';
import { BundleSchema } from '../../../contract/website-bundle.v1';
import fixture from '../../../contract/website-bundle.v1.fixture.json';

describe('legal document tables', () => {
  it('privacy has 15 unique section ids, terms 16, cookie 3', () => {
    expect(PRIVACY_SECTIONS).toHaveLength(15);
    expect(TERMS_SECTIONS).toHaveLength(16);
    expect(COOKIE_SECTIONS).toHaveLength(3);
    for (const list of [PRIVACY_SECTIONS, TERMS_SECTIONS, COOKIE_SECTIONS])
      expect(new Set(list).size).toBe(list.length);
  });
  it('every doc key is a PAGE_KEYS page record key', () => {
    expect(LEGAL_DOCS).toEqual(['privacy', 'terms', 'kvkk', 'cookiePolicy']);
  });
  it('fill values come from settings, never literals (D17)', () => {
    const { settings } = BundleSchema.parse(fixture);
    expect(legalFillValues(settings)).toEqual({
      email: settings.email,
      phoneDisplay: settings.phoneDisplay,
      permitNo: settings.licence.permitNo,
      lawRef: settings.licence.lawRef,
      taxNo: settings.licence.taxNo,
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/lib/legal        # fails: modules do not exist
```

- [ ] **Step 3: Implement**

`src/lib/legal/body.ts` — pure, no directive (R2/R23):

```ts
/**
 * Markdown-lite for the legal documents (D14): paragraphs separated by a blank line, a block
 * whose every line starts with `- ` is a bullet list, `**text**` is a bold run. Nothing else —
 * no links, no headings (section titles are their own sys keys), no HTML. The bodies are read
 * with `sys.raw()` (no ICU parse) and passed through `fill()` for the D17 placeholders first.
 */
export type LegalRun = { text: string; strong: boolean };
export type LegalBlock = { type: 'p'; runs: LegalRun[] } | { type: 'ul'; items: LegalRun[][] };

const BOLD = /\*\*(.+?)\*\*/g;

export function parseRuns(text: string): LegalRun[] {
  const runs: LegalRun[] = [];
  let last = 0;
  for (const m of text.matchAll(BOLD)) {
    const at = m.index ?? 0;
    if (at > last) runs.push({ text: text.slice(last, at), strong: false });
    runs.push({ text: m[1] ?? '', strong: true });
    last = at + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), strong: false });
  return runs.length ? runs : [{ text: '', strong: false }];
}

export function parseLegalBody(md: string): LegalBlock[] {
  return md
    .split(/\n[ \t]*\n/)
    .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map((lines) =>
      lines.every((l) => l.startsWith('- '))
        ? { type: 'ul' as const, items: lines.map((l) => parseRuns(l.slice(2).trim())) }
        : { type: 'p' as const, runs: parseRuns(lines.join(' ')) },
    );
}
```

`src/lib/legal/documents.ts`:

```ts
import type { Settings } from '../../../contract/website-bundle.v1';

/** The four legal page-record keys (PAGE_KEYS, T0b) in nav order. */
export const LEGAL_DOCS = ['privacy', 'terms', 'kvkk', 'cookiePolicy'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

/** Section ids = the `sys.legal.<doc>.sections.<id>.{title,body}` keys, in document order.
 *  Privacy: the old site's 16 numbered sections re-numbered 1–15 (its numbering skipped and
 *  duplicated — 3/'3.', 5/'5.', 6/'7.', 10/'12.'). Terms: the old site's 16 as they were. */
export const PRIVACY_SECTIONS = [
  'dataController',
  'scope',
  'dataCategories',
  'purposes',
  'cookies',
  'disclosures',
  'transfers',
  'retention',
  'rights',
  'security',
  'verbis',
  'children',
  'thirdParty',
  'changes',
  'contact',
] as const;

export const TERMS_SECTIONS = [
  'legalStatus',
  'services',
  'eligibility',
  'accounts',
  'candidateDuties',
  'employerDuties',
  'fees',
  'ip',
  'acceptableUse',
  'dataProtection',
  'thirdParty',
  'availability',
  'liability',
  'indemnification',
  'law',
  'amendments',
] as const;

/** The minimal cookie notice (§10 row 6 auto-default) until counsel copy lands. */
export const COOKIE_SECTIONS = ['essential', 'consent', 'manage'] as const;

/** D17: the identifiers the legal bodies cite come from settings through `fill()` —
 *  `{email}`, `{phoneDisplay}`, `{permitNo}`, `{lawRef}`, `{taxNo}` — never typed into copy. */
export function legalFillValues(settings: Settings): Record<string, string> {
  return {
    email: settings.email,
    phoneDisplay: settings.phoneDisplay,
    permitNo: settings.licence.permitNo,
    lawRef: settings.licence.lawRef,
    taxNo: settings.licence.taxNo,
  };
}
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run src/lib/legal && npm run verify
```

- [ ] **Step 5: Commit**

```
feat(legal): Markdown-lite body parser and the legal document tables (T13, D14)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 3 — The four legal pages

- [ ] **Step 1: Write the failing tests**

Extend `TASK13_KEYS` in `src/messages/task13-keys.test.ts` — replace the array with a generated one:

```ts
import { COOKIE_SECTIONS, PRIVACY_SECTIONS, TERMS_SECTIONS } from '@/lib/legal/documents';

const sectionKeys = (doc: string, ids: readonly string[]) =>
  ids.flatMap((id) => [`sys.legal.${doc}.sections.${id}.title`, `sys.legal.${doc}.sections.${id}.body`]);

export const TASK13_KEYS = [
  'sys.seo.portal.title',
  'sys.seo.portal.description',
  'sys.portal.intro',
  'sys.portal.signIn',
  ...['privacy', 'terms', 'kvkk', 'cookiePolicy'].flatMap((k) => [`sys.seo.${k}.title`, `sys.seo.${k}.description`]),
  'sys.legal.updatedLabel',
  'sys.legal.contents',
  ...['privacy', 'terms', 'kvkk', 'cookiePolicy'].flatMap((d) => [`sys.legal.${d}.title`, `sys.legal.${d}.intro`, `sys.legal.${d}.updatedAt`]),
  'sys.legal.terms.englishOnlyNotice',
  'sys.legal.terms.finalNote',
  'sys.legal.kvkk.pendingTitle',
  'sys.legal.kvkk.pendingBody',
  'sys.legal.cookiePolicy.pendingTitle',
  'sys.legal.cookiePolicy.pendingBody',
  ...sectionKeys('privacy', PRIVACY_SECTIONS),
  ...sectionKeys('terms', TERMS_SECTIONS),
  ...sectionKeys('cookiePolicy', COOKIE_SECTIONS),
];
```

and add two cases to the same file:

```ts
import { fill } from '@/content/pure';

describe('Task 13 legal bodies', () => {
  const values = { email: 'e', phoneDisplay: 'p', permitNo: '1', lawRef: '2', taxNo: '3' };
  for (const [name, tree] of [['tr', tr], ['en', en]] as const) {
    it(`${name}: every legal body fills with the five settings placeholders only`, () => {
      for (const key of TASK13_KEYS.filter((k) => k.endsWith('.body') && k.includes('.sections.'))) {
        const body = get(tree as unknown as Tree, key) as string;
        expect(() => fill(body, values), key).not.toThrow(); // an unknown {token} throws in test/dev
        expect(body, key).not.toMatch(/\{\{|\}\}/);
      }
    });
    it(`${name}: every updatedAt is an ISO calendar date`, () => {
      for (const d of ['privacy', 'terms', 'kvkk', 'cookiePolicy'])
        expect(get(tree as unknown as Tree, `sys.legal.${d}.updatedAt`)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  }
});
```

`e2e/pages/legal.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|\bundefined\b|MISSING_MESSAGE/;

const DOCS = [
  { tr: '/gizlilik', en: '/en/privacy', sections: 15, placeholder: null },
  { tr: '/kullanim-kosullari', en: '/en/terms', sections: 16, placeholder: 'legal-terms-tr' },
  { tr: '/kvkk', en: '/en/kvkk', sections: 0, placeholder: 'legal-kvkk' },
  { tr: '/cerez-politikasi', en: '/en/cookie-policy', sections: 3, placeholder: 'legal-cookie-policy' },
] as const;

for (const doc of DOCS) {
  for (const [locale, path] of [['tr', doc.tr], ['en', doc.en]] as const) {
    test(`legal ${path}: one h1, minimal chrome, dated, indexable, breadcrumb JSON-LD`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      await expect(page.locator('[data-lcp-slot="h1"]')).toHaveCount(1);
      expect(await page.locator('body').innerText()).not.toMatch(LEAK);
      // (minimal): header + footer, no social rail / FAB (W19)
      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      await expect(page.getByTestId('whatsapp-fab')).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index/);
      await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
      await expect(page.getByTestId('legal-updated')).toContainText(/20\d\d/);
      expect(await page.locator('section[data-legal-section]').count()).toBe(doc.sections);
      if (doc.sections > 0)
        expect(await page.getByTestId('legal-toc').locator('a').count()).toBe(doc.sections);
      expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toEqual(
        expect.arrayContaining([expect.stringContaining('"BreadcrumbList"')]),
      );
      // D26/W55: placeholders are named and never the LCP element
      const placeholders = page.locator('[data-placeholder]');
      const expected = doc.placeholder && !(doc.placeholder === 'legal-terms-tr' && locale === 'en') ? 1 : 0;
      await expect(placeholders).toHaveCount(expected);
      if (expected) {
        await expect(placeholders).toHaveAttribute('data-placeholder', doc.placeholder!);
        await expect(placeholders).not.toHaveAttribute('data-lcp-slot', /.+/);
      }
    });
  }
  test(`legal ${doc.tr}: the language switch keeps the page`, async ({ page }) => {
    await page.goto(doc.tr);
    await page.getByRole('link', { name: 'English', exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${doc.en.replace(/\//g, '\\/')}$`));
    await expect(page.getByTestId('page-h1')).toBeVisible();
  });
}

test('the TR terms page carries the English-only notice; the EN one does not', async ({ page }) => {
  await page.goto('/kullanim-kosullari');
  await expect(page.getByTestId('legal-notice')).toBeVisible();
  await page.goto('/en/terms');
  await expect(page.getByTestId('legal-notice')).toHaveCount(0);
});

test('the KVKK placeholder links to the privacy policy', async ({ page }) => {
  await page.goto('/kvkk');
  await expect(page.getByTestId('legal-pending').locator('a[href="/gizlilik"]')).toBeVisible();
});
```

(`whatsapp-fab` is the test id `WhatsAppFab` renders in WP1 — check `src/design/chrome/WhatsAppFab.tsx` and use its actual `data-testid`; if it has none, assert `page.locator('a[aria-label][href*="wa.me"].fixed')` count 0 instead — never add a test id to the chrome from this task.)

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/messages/task13-keys.test.ts     # fails: sys.legal.* missing
```

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside `"seo"` add:

```json
"privacy": { "title": "Privacy Policy | JobsAdmire", "description": "How JobsAdmire collects, uses, stores and protects personal data under the Turkish data protection law (KVKK)." },
"terms": { "title": "Terms and Conditions | JobsAdmire", "description": "The terms that govern the use of jobsadmire.com and JobsAdmire services." },
"kvkk": { "title": "KVKK Information Notice | JobsAdmire", "description": "Information notice under the Turkish Law on the Protection of Personal Data No. 6698 (KVKK)." },
"cookiePolicy": { "title": "Cookie Policy | JobsAdmire", "description": "The cookies jobsadmire.com uses and how to manage your preferences." }
```

and the `"legal"` object inside `"sys"`:

```json
"legal": {
  "updatedLabel": "Last updated",
  "contents": "Contents",
  "privacy": {
    "title": "Privacy Policy",
    "intro": "This Privacy Policy applies to jobsadmire.com and all of its subdomains (including portal.jobsadmire.com), as well as our mobile and communication channels (e-mail, WhatsApp, phone). We are committed to protecting your personal data in full compliance with the Turkish Law on the Protection of Personal Data No. 6698 (KVKK) and İŞKUR regulations.",
    "updatedAt": "2025-09-27",
    "sections": {
      "dataController": {
        "title": "Data controller",
        "body": "Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi\n\n- **Address:** as listed in the footer of this website and on the Contact page\n- **E-mail:** {email}\n- **Phone:** {phoneDisplay}\n- **Tax No:** {taxNo}\n\nWe operate as a Private Employment Agency licensed by İŞKUR (Permit No. {permitNo}, dated 19.09.2024). Under Law No. {lawRef}, charging job seekers any fee is prohibited. Complaints: İstanbul İŞKUR Provincial Directorate, Kadıköy Service Centre (tel. 0216 418 34 55)."
      },
      "scope": {
        "title": "Scope",
        "body": "This Policy explains how we process personal data when you:\n\n- browse our site\n- create a profile or upload a CV\n- apply to jobs\n- request services (recruitment, HR, immigration)\n- subscribe to job alerts or our newsletter\n- partner with us\n- interact with our portal and support channels"
      },
      "dataCategories": {
        "title": "Categories of personal data",
        "body": "- **Identification and contact:** name, e-mail, phone, address, nationality\n- **Candidate data:** CV/resume, education, work history, skills, references, interview notes, profile photo, uploaded documents (qualifications, licences)\n- **Immigration and relocation data:** passport/ID details, civil status, travel history, residence/work-permit information (only where needed)\n- **Employer/partner data (B2B):** company name, title, work contact details, role requirements, contracts\n- **Transaction data:** paid-service details, invoices (no card data is stored on our servers)\n- **Usage and device data:** logs, IP address, user agent, pages viewed, cookies\n- **Communications:** e-mails, calls/WhatsApp/chat, support tickets\n\n**Special categories:** We do not intentionally collect health or biometric data. If a role or a legal process requires such data, we process it only where lawful and necessary, and with your explicit consent where KVKK requires it."
      },
      "purposes": {
        "title": "Purposes and legal bases (KVKK Arts. 5–6)",
        "body": "We process personal data for the following purposes and on the following legal bases:\n\n- **Core services (candidates and employers):** creating accounts, matching and placing candidates, managing applications, interviews, offers, contracts and onboarding — performance of a contract, legitimate interests, legal obligation\n- **Immigration and relocation support:** residence and work permits, visa invitations, documentation — performance of a contract, legal obligation, explicit consent (for certain documents)\n- **B2B partner and recruiter management:** onboarding, compliance, invoicing — contract, legal obligation, legitimate interests\n- **Communications and alerts:** job alerts, consultation scheduling, service updates — explicit consent (marketing), contract/legitimate interests (service messages)\n- **Security and compliance:** audit logs, access controls, responding to authorities, İŞKUR requirements — legal obligation, legitimate interests\n- **Analytics and site performance:** aggregated usage, improving the experience — legitimate interests, consent (for non-essential cookies)"
      },
      "cookies": {
        "title": "Cookies and online identifiers",
        "body": "We use necessary cookies and, with your consent, analytics, functional and advertising cookies. You can manage or withdraw your consent at any time through the Cookie preferences button in the site footer.\n\nOur Cookie Policy lists the categories, purposes, providers, retention periods and withdrawal instructions, in line with the Personal Data Protection Board's cookie guidelines."
      },
      "disclosures": {
        "title": "Disclosures to third parties",
        "body": "We may disclose personal data to:\n\n- employers and clients seeking to hire (only the relevant candidate data)\n- authorised partners and recruiters assisting in placement\n- service providers and processors (hosting, portal and ATS tools, communications, payment processing, background checks)\n- public authorities and courts where legally required (İŞKUR, immigration authorities)\n\nAll processors act under contracts that meet KVKK requirements."
      },
      "transfers": {
        "title": "Cross-border transfers (KVKK Art. 9)",
        "body": "Where data is transferred outside Türkiye (for example cloud hosting, international employers, global tools), we rely on the mechanisms permitted under the 2024 amendments:\n\n- an adequacy decision (where the destination is recognised by the Board)\n- standard contracts or commitments approved by or notified to the Authority\n- binding corporate rules\n- explicit consent (as a last resort, where no other mechanism applies)\n\nWe keep a record of our transfer assessments."
      },
      "retention": {
        "title": "Retention",
        "body": "We retain data only for as long as the purposes above and the statutory limitation periods require (for example labour, commercial and İŞKUR regulations). When it is no longer needed, data is deleted or anonymised in accordance with KVKK."
      },
      "rights": {
        "title": "Your rights (KVKK Art. 11)",
        "body": "You may apply to us to:\n\n- learn whether we process your personal data\n- request information about that processing\n- learn the purposes and the recipients\n- request rectification\n- request deletion or anonymisation where the legal grounds apply\n- object to a result produced exclusively by automated processing\n- object to processing based on legitimate interests\n- claim compensation for unlawful processing\n\n**How to apply:** e-mail privacy@jobsadmire.com or {email} with enough identity details for us to verify your request. We respond within 30 days, as the KVKK procedure requires. If you are not satisfied, you may complain to the Personal Data Protection Authority after exhausting the application route to the data controller."
      },
      "security": {
        "title": "Security measures",
        "body": "We apply administrative, technical and physical safeguards:\n\n- access control and least privilege\n- encryption in transit and at rest\n- network and application security\n- vendor due diligence\n- staff confidentiality\n- backup and continuity\n- regular review of the data inventory"
      },
      "verbis": {
        "title": "VERBİS",
        "body": "Where JobsAdmire meets the legal thresholds, we register with VERBİS (the Data Controllers' Registry) and keep our records up to date. Public VERBİS entries can be checked on the Authority's portal."
      },
      "children": {
        "title": "Children's data",
        "body": "Our services are aimed at adults and employers. We do not knowingly collect data from children; if we learn of such processing without an appropriate legal basis and consent, we delete it."
      },
      "thirdParty": {
        "title": "Third-party links and social channels",
        "body": "Our site may link to external services (for example WhatsApp or map providers). Their privacy practices are governed by their own policies."
      },
      "changes": {
        "title": "Changes",
        "body": "We may update this Policy to reflect changes in our services or in the law (including future Board decisions or guidance). We publish the new version with an updated date."
      },
      "contact": {
        "title": "Contact",
        "body": "For any KVKK query or request:\n\n- **Data protection contact:** {email}\n- **Alternative e-mail:** privacy@jobsadmire.com\n- **Phone:** {phoneDisplay}\n- **Registered address:** see the footer of this website and the Contact page"
      }
    }
  },
  "terms": {
    "title": "Terms and Conditions",
    "intro": "These Terms and Conditions (\"Terms\") govern access to and use of jobsadmire.com, its sub-domains (including portal.jobsadmire.com), mobile interfaces and all related services operated by Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi (\"JobsAdmire\", \"we\", \"our\", \"us\"). By using our website or services you (\"User\", \"Candidate\", \"Employer\", \"Partner\") agree to these Terms. If you do not agree, please discontinue use.",
    "updatedAt": "2025-09-27",
    "englishOnlyNotice": "This page is available in English only.",
    "finalNote": "By accessing, browsing or using any services, communication channels or materials provided by JobsAdmire — including job search, recruitment, immigration services, career counselling and CV tools, whether through our website, partner portal, e-mail, phone, WhatsApp or any other means — you acknowledge that you have read, understood and agree to be bound by these Terms.",
    "sections": {
      "legalStatus": { "title": "Data controller and legal status", "body": "JobsAdmire operates as a Private Employment Agency under İŞKUR Permit No. {permitNo} dated 19.09.2024, in accordance with Law No. {lawRef}. Under this law no fee may be charged to job seekers for core recruitment services. Contact details and the complaints procedure are provided in our Privacy Policy." },
      "services": { "title": "Services", "body": "JobsAdmire provides: job search, candidate placement and recruitment support for employers; immigration, work-permit and residence-permit facilitation where requested; career counselling, interview preparation and related advisory services; online portal tools for candidates and employers. Some services may be free (for example job applications); others (for example employer recruitment packages) may be fee-based." },
      "eligibility": { "title": "Eligibility", "body": "Candidates must be at least 18 years old or of legal working age in their jurisdiction. Employers and Partners must have the legal capacity to enter binding contracts. By using the site you confirm the accuracy of all information you provide." },
      "accounts": { "title": "User accounts", "body": "You may be given an account to manage applications, candidates or employer postings. You are responsible for keeping your login credentials secure. Any activity under your account is deemed to have been performed by you." },
      "candidateDuties": { "title": "Candidate responsibilities", "body": "Provide true, current and complete information (CV, contact details, documents). Do not submit false, misleading or defamatory material. Understand that hiring decisions rest solely with employers." },
      "employerDuties": { "title": "Employer and partner responsibilities", "body": "Use candidate data only for legitimate hiring purposes and in compliance with KVKK and all labour regulations. Do not charge candidates any recruitment fee. Enter into written service agreements with JobsAdmire where paid recruitment services are required." },
      "fees": { "title": "Fees and payments", "body": "Job seekers: no recruitment fee is ever charged for standard job placement. Employers and Partners: service packages are governed by separate commercial agreements or purchase orders specifying scope, pricing and payment terms." },
      "ip": { "title": "Intellectual property", "body": "All content on the site (text, graphics, logos, trademarks, software) is owned by JobsAdmire or its licensors and protected by copyright and industrial property law. Users may view or print content for personal use only. Any reproduction or redistribution requires prior written consent." },
      "acceptableUse": { "title": "Acceptable use", "body": "You agree not to: violate any applicable Turkish or international law; post or transmit harmful code, spam or abusive content; harvest, scrape or misuse other people's personal data; interfere with or disrupt the security or functionality of the site. We may suspend or terminate access for violations without prior notice." },
      "dataProtection": { "title": "Data protection", "body": "The processing of personal data is explained in our Privacy Policy. By using our services you acknowledge that your data may be processed and, where necessary, transferred in accordance with KVKK and the cross-border transfer rules." },
      "thirdParty": { "title": "Third-party links and services", "body": "Our site may link to third-party websites or integrate third-party services (for example WhatsApp or map providers). We are not responsible for their content, policies or practices." },
      "availability": { "title": "Service availability", "body": "JobsAdmire aims for continuous service but does not guarantee uninterrupted or error-free operation. We reserve the right to modify or discontinue any service temporarily or permanently without liability." },
      "liability": { "title": "Limitation of liability", "body": "To the fullest extent permitted by law: JobsAdmire is not liable for employment outcomes, visa or permit approvals, or damages arising from employer decisions. We are not liable for indirect, incidental or consequential damages arising from the use of the site. Our total liability for any claim shall not exceed the amount (if any) paid by the user for the specific service giving rise to the claim. Nothing in these Terms limits liability where Turkish law prohibits such a limitation (for example wilful misconduct or gross negligence)." },
      "indemnification": { "title": "Indemnification", "body": "You agree to indemnify and hold JobsAdmire harmless from claims, damages or expenses arising from your breach of these Terms or unlawful use of the services." },
      "law": { "title": "Governing law and jurisdiction", "body": "These Terms are governed by Turkish law. Disputes shall be resolved by the İstanbul (Anadolu) Courts and Enforcement Offices, unless a mandatory forum is required by consumer protection law." },
      "amendments": { "title": "Amendments", "body": "JobsAdmire may update these Terms to reflect legal or service changes. Updates are published with a revised last-updated date. Continued use after an update constitutes acceptance." }
    }
  },
  "kvkk": {
    "title": "KVKK Information Notice",
    "intro": "The information notice on how JobsAdmire, as data controller, processes personal data under the Turkish Law on the Protection of Personal Data No. 6698 (KVKK).",
    "updatedAt": "2026-09-20",
    "pendingTitle": "The information notice is being prepared",
    "pendingBody": "Our counsel is preparing the KVKK information notice. Until it is published, how we process your personal data is described in the Privacy Policy, which applies in full."
  },
  "cookiePolicy": {
    "title": "Cookie Policy",
    "intro": "This page explains which cookies jobsadmire.com uses and how you can manage your preferences.",
    "updatedAt": "2026-09-20",
    "pendingTitle": "The full cookie policy is being prepared",
    "pendingBody": "Our counsel is preparing the detailed cookie policy. Until it is published, this summary and the Privacy Policy apply.",
    "sections": {
      "essential": { "title": "Essential cookies", "body": "- **ja_locale** — remembers your language choice for one year\n- **ja_consent_v1** — remembers your cookie choice for 180 days\n\nThese cookies are required for the site to work and do not need your consent." },
      "consent": { "title": "Consent-based cookies", "body": "Analytics and advertising-measurement cookies (Google Tag Manager, Google Analytics 4, Google Ads) load only after you choose Accept in the cookie notice. Until you choose, every measurement signal stays denied (Consent Mode v2)." },
      "manage": { "title": "Managing your preferences", "body": "You can change your choice at any time with the Cookie preferences button at the bottom of every page, or delete the cookies in your browser settings." }
    }
  }
}
```

`src/messages/tr.json` — inside `"seo"`:

```json
"privacy": { "title": "Gizlilik Politikası | JobsAdmire", "description": "JobsAdmire'ın kişisel verileri KVKK kapsamında nasıl topladığını, kullandığını, sakladığını ve koruduğunu öğrenin." },
"terms": { "title": "Kullanım Koşulları | JobsAdmire", "description": "jobsadmire.com ve JobsAdmire hizmetlerinin kullanımını düzenleyen koşullar." },
"kvkk": { "title": "KVKK Aydınlatma Metni | JobsAdmire", "description": "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni." },
"cookiePolicy": { "title": "Çerez Politikası | JobsAdmire", "description": "jobsadmire.com'da kullanılan çerezler ve tercihlerinizi nasıl yöneteceğiniz." }
```

and the `"legal"` object inside `"sys"` (Terms bodies are the English text — untranslated by the old site too; the TR page shows `englishOnlyNotice`, spec §10 row 6):

```json
"legal": {
  "updatedLabel": "Son güncelleme",
  "contents": "İçindekiler",
  "privacy": {
    "title": "Gizlilik Politikası",
    "intro": "Bu Gizlilik Politikası jobsadmire.com ve tüm alt alan adlarının (portal.jobsadmire.com dâhil) yanı sıra mobil ve iletişim kanallarımız (e-posta, WhatsApp, telefon) için de geçerlidir. Kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve İŞKUR düzenlemelerine tam uyum içinde korumayı taahhüt ediyoruz.",
    "updatedAt": "2025-09-27",
    "sections": {
      "dataController": {
        "title": "Veri sorumlusu",
        "body": "Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi\n\n- **Adres:** bu web sitesinin alt bilgisinde ve İletişim sayfasında belirtildiği gibi\n- **E-posta:** {email}\n- **Telefon:** {phoneDisplay}\n- **Vergi No:** {taxNo}\n\nİŞKUR tarafından yetkilendirilmiş Özel İstihdam Bürosu olarak faaliyet göstermekteyiz (19.09.2024 tarih ve {permitNo} sayılı İzin Belgesi). {lawRef} sayılı Kanun uyarınca iş arayanlardan herhangi bir ücret talep edilmesi yasaktır. Şikâyetler: İstanbul İŞKUR İl Müdürlüğü Kadıköy Hizmet Merkezi (tel. 0216 418 34 55)."
      },
      "scope": {
        "title": "Kapsam",
        "body": "Bu Politika, aşağıdaki durumlarda kişisel verilerinizi nasıl işlediğimizi açıklar:\n\n- sitemize göz attığınızda\n- profil oluşturduğunuzda veya CV yüklediğinizde\n- iş başvurusu yaptığınızda\n- hizmet talep ettiğinizde (işe alım, İK, göçmenlik)\n- iş uyarılarına veya bültenimize abone olduğunuzda\n- bizimle iş ortaklığı kurduğunuzda\n- portalımız ve destek kanallarımızla etkileşime geçtiğinizde"
      },
      "dataCategories": {
        "title": "Kişisel veri kategorileri",
        "body": "- **Kimlik ve iletişim:** ad soyad, e-posta, telefon, adres, uyruk\n- **Aday verileri:** özgeçmiş/CV, eğitim, iş geçmişi, beceriler, referanslar, mülakat notları, profil fotoğrafı, yüklenen belgeler (yeterlilikler, ruhsatlar)\n- **Göç ve yerleşim verileri:** pasaport/kimlik bilgileri, medeni durum, seyahat geçmişi, ikamet/çalışma izni bilgileri (yalnızca gerekli olduğunda)\n- **İşveren/iş ortağı verileri (B2B):** şirket adı, unvan, iş iletişim bilgileri, pozisyon gereklilikleri, sözleşmeler\n- **İşlem verileri:** ücretli hizmet ayrıntıları, faturalar (sunucularımızda kart verisi saklanmaz)\n- **Kullanım ve cihaz verileri:** günlük kayıtları, IP adresi, tarayıcı bilgisi, görüntülenen sayfalar, çerezler\n- **İletişim:** e-postalar, aramalar/WhatsApp/sohbet, destek talepleri\n\n**Özel nitelikli veriler:** Sağlık veya biyometrik verileri kasıtlı olarak toplamıyoruz. Bir pozisyon ya da hukuki süreç bu tür verileri gerektiriyorsa, yalnızca hukuka uygun ve gerekli olduğu ölçüde, KVKK'nın gerektirdiği hâllerde açık rızanızla işleriz."
      },
      "purposes": {
        "title": "Amaçlar ve hukuki sebepler (KVKK md. 5–6)",
        "body": "Kişisel verileri aşağıdaki amaçlarla ve hukuki sebeplere dayanarak işliyoruz:\n\n- **Temel hizmetler (adaylar ve işverenler):** hesap oluşturma, adayların eşleştirilmesi ve yerleştirilmesi; başvuru, mülakat, teklif, sözleşme ve işe başlama süreçlerinin yönetimi — sözleşmenin ifası, meşru menfaat, hukuki yükümlülük\n- **Göç ve yerleşim desteği:** ikamet ve çalışma izinleri, vize davetiyeleri, belgeler — sözleşmenin ifası, hukuki yükümlülük, açık rıza (belirli belgeler için)\n- **B2B iş ortağı ve işe alım yönetimi:** kabul süreci, uyum, faturalama — sözleşme, hukuki yükümlülük, meşru menfaat\n- **İletişim ve bildirimler:** iş uyarıları, görüşme planlama, hizmet güncellemeleri — açık rıza (pazarlama), sözleşme/meşru menfaat (hizmet mesajları)\n- **Güvenlik ve uyum:** denetim kayıtları, erişim kontrolleri, yetkili makamlara yanıt, İŞKUR gereklilikleri — hukuki yükümlülük, meşru menfaat\n- **Analitik ve site performansı:** toplu kullanım verileri, deneyimin iyileştirilmesi — meşru menfaat, rıza (zorunlu olmayan çerezler için)"
      },
      "cookies": {
        "title": "Çerezler ve çevrimiçi tanımlayıcılar",
        "body": "Zorunlu çerezleri ve izninizle analitik, işlevsel ve reklam çerezlerini kullanıyoruz. İzninizi istediğiniz zaman site alt bilgisindeki Çerez tercihleri düğmesinden yönetebilir veya geri çekebilirsiniz.\n\nÇerez Politikamız, Kişisel Verileri Koruma Kurulu'nun çerez rehberine uygun olarak kategorileri, amaçları, sağlayıcıları, saklama sürelerini ve geri çekme yöntemlerini içerir."
      },
      "disclosures": {
        "title": "Üçüncü taraflara aktarım",
        "body": "Kişisel verileri aşağıdaki taraflara aktarabiliriz:\n\n- işe alım yapmak isteyen işverenler ve müşteriler (yalnızca ilgili aday verileri)\n- yerleştirmeye yardımcı olan yetkili iş ortakları ve işe alım uzmanları\n- hizmet sağlayıcılar ve veri işleyenler (barındırma, portal ve ATS araçları, iletişim, ödeme işlemleri, geçmiş kontrolleri)\n- yasal olarak gerekli olduğu hâllerde kamu makamları ve mahkemeler (İŞKUR, göç idaresi)\n\nTüm veri işleyenler KVKK gerekliliklerini karşılayan sözleşmeler kapsamında hareket eder."
      },
      "transfers": {
        "title": "Yurt dışına aktarım (KVKK md. 9)",
        "body": "Verilerin Türkiye dışına aktarıldığı durumlarda (örneğin bulut barındırma, uluslararası işverenler, küresel araçlar) 2024 değişiklikleri kapsamında izin verilen mekanizmalara dayanırız:\n\n- yeterlilik kararı (hedef ülke Kurul tarafından tanınmışsa)\n- Kuruma onaylatılan veya bildirilen standart sözleşmeler ya da taahhütler\n- bağlayıcı şirket kuralları\n- açık rıza (başka bir mekanizmanın uygulanamadığı hâllerde, son çare olarak)\n\nAktarım değerlendirmelerimizin kaydını tutarız."
      },
      "retention": {
        "title": "Saklama süresi",
        "body": "Verileri yalnızca yukarıdaki amaçlar ve yasal zamanaşımı süreleri (örneğin iş, ticaret ve İŞKUR mevzuatı) gerektirdiği sürece saklarız. Artık ihtiyaç kalmadığında veriler KVKK'ya uygun olarak silinir veya anonim hâle getirilir."
      },
      "rights": {
        "title": "Haklarınız (KVKK md. 11)",
        "body": "Bize başvurarak:\n\n- kişisel verilerinizin işlenip işlenmediğini öğrenebilir\n- işlenmişse buna ilişkin bilgi talep edebilir\n- işlenme amacını ve alıcıları öğrenebilir\n- düzeltilmesini isteyebilir\n- hukuki sebepleri ortadan kalktığında silinmesini veya anonim hâle getirilmesini isteyebilir\n- münhasıran otomatik sistemlerle işlenmesi sonucu aleyhinize çıkan sonuca itiraz edebilir\n- meşru menfaate dayalı işlemeye itiraz edebilir\n- hukuka aykırı işleme nedeniyle zararınızın giderilmesini talep edebilirsiniz\n\n**Nasıl başvurulur:** Talebinizi doğrulamamıza yetecek kimlik bilgileriyle birlikte privacy@jobsadmire.com veya {email} adresine e-posta gönderin. KVKK'nın öngördüğü süre olan 30 gün içinde yanıt veririz. Sonuçtan memnun kalmazsanız, veri sorumlusuna başvuru yolunu tükettikten sonra Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz."
      },
      "security": {
        "title": "Güvenlik önlemleri",
        "body": "İdari, teknik ve fiziksel güvenlik tedbirleri uyguluyoruz:\n\n- erişim kontrolü ve en az yetki ilkesi\n- aktarım sırasında ve depolamada şifreleme\n- ağ ve uygulama güvenliği\n- tedarikçi denetimi\n- personel gizliliği\n- yedekleme ve süreklilik\n- veri envanterinin düzenli gözden geçirilmesi"
      },
      "verbis": {
        "title": "VERBİS",
        "body": "JobsAdmire yasal eşikleri karşıladığı ölçüde VERBİS'e (Veri Sorumluları Sicil Bilgi Sistemi) kayıt olur ve kayıtlarını güncel tutar. Kamuya açık VERBİS kayıtları Kurumun portalından sorgulanabilir."
      },
      "children": {
        "title": "Çocuklara ait veriler",
        "body": "Hizmetlerimiz yetişkinlere ve işverenlere yöneliktir. Çocuklardan bilerek veri toplamayız; uygun hukuki sebep ve rıza olmaksızın böyle bir işleme yapıldığını öğrenirsek verileri sileriz."
      },
      "thirdParty": {
        "title": "Üçüncü taraf bağlantıları ve sosyal kanallar",
        "body": "Sitemiz harici hizmetlere (örneğin WhatsApp veya harita sağlayıcıları) bağlantı verebilir. Bu hizmetlerin gizlilik uygulamaları kendi politikalarına tabidir."
      },
      "changes": {
        "title": "Değişiklikler",
        "body": "Bu Politikayı hizmetlerimizdeki veya mevzuattaki değişiklikleri (gelecekteki Kurul kararları veya rehberleri dâhil) yansıtmak için güncelleyebiliriz. Yeni sürümü güncellenmiş tarihiyle birlikte yayımlarız."
      },
      "contact": {
        "title": "İletişim",
        "body": "KVKK ile ilgili her türlü soru veya talep için:\n\n- **Veri koruma iletişim:** {email}\n- **Alternatif e-posta:** privacy@jobsadmire.com\n- **Telefon:** {phoneDisplay}\n- **Kayıtlı adres:** bu web sitesinin alt bilgisi ve İletişim sayfası"
      }
    }
  },
  "terms": {
    "title": "Kullanım Koşulları",
    "intro": "These Terms and Conditions (\"Terms\") govern access to and use of jobsadmire.com, its sub-domains (including portal.jobsadmire.com), mobile interfaces and all related services operated by Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi (\"JobsAdmire\", \"we\", \"our\", \"us\"). By using our website or services you (\"User\", \"Candidate\", \"Employer\", \"Partner\") agree to these Terms. If you do not agree, please discontinue use.",
    "updatedAt": "2025-09-27",
    "englishOnlyNotice": "Kullanım Koşulları'nın Türkçe çevirisi hukuk danışmanımızla birlikte hazırlanmaktadır; yayımlanana kadar aşağıdaki İngilizce metin geçerlidir.",
    "finalNote": "By accessing, browsing or using any services, communication channels or materials provided by JobsAdmire — including job search, recruitment, immigration services, career counselling and CV tools, whether through our website, partner portal, e-mail, phone, WhatsApp or any other means — you acknowledge that you have read, understood and agree to be bound by these Terms.",
    "sections": { "...": "IDENTICAL to en.json's sys.legal.terms.sections — copy the sixteen {title, body} pairs verbatim (the old site's tr/terms.json was byte-identical to the English; W/§10 row 6 accepts EN-only Terms on the TR route with the notice above)" }
  },
  "kvkk": {
    "title": "KVKK Aydınlatma Metni",
    "intro": "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla JobsAdmire'ın kişisel verilerinizi nasıl işlediğine ilişkin aydınlatma metni.",
    "updatedAt": "2026-09-20",
    "pendingTitle": "Aydınlatma metni hazırlanıyor",
    "pendingBody": "KVKK aydınlatma metni hukuk danışmanımızla birlikte hazırlanmaktadır. Yayımlanana kadar kişisel verilerinizin nasıl işlendiği Gizlilik Politikası'nda açıklanmıştır ve bu politika tüm hükümleriyle geçerlidir."
  },
  "cookiePolicy": {
    "title": "Çerez Politikası",
    "intro": "Bu sayfa jobsadmire.com'un hangi çerezleri kullandığını ve tercihlerinizi nasıl yönetebileceğinizi açıklar.",
    "updatedAt": "2026-09-20",
    "pendingTitle": "Ayrıntılı çerez politikası hazırlanıyor",
    "pendingBody": "Ayrıntılı çerez politikası hukuk danışmanımızla birlikte hazırlanmaktadır. Yayımlanana kadar bu özet ve Gizlilik Politikası geçerlidir.",
    "sections": {
      "essential": { "title": "Zorunlu çerezler", "body": "- **ja_locale** — dil tercihinizi bir yıl boyunca saklar\n- **ja_consent_v1** — çerez tercihinizi 180 gün boyunca saklar\n\nBu çerezler sitenin çalışması için gereklidir ve izninizi gerektirmez." },
      "consent": { "title": "İzne bağlı çerezler", "body": "Analitik ve reklam ölçümü çerezleri (Google Tag Manager, Google Analytics 4, Google Ads) yalnızca çerez bildiriminde Kabul et seçeneğini işaretlemeniz hâlinde yüklenir. Siz seçim yapana kadar tüm ölçüm sinyalleri reddedilmiş durumda kalır (Consent Mode v2)." },
      "manage": { "title": "Tercihlerinizi yönetme", "body": "Seçiminizi istediğiniz zaman her sayfanın altındaki Çerez tercihleri düğmesinden değiştirebilir veya çerezleri tarayıcı ayarlarınızdan silebilirsiniz." }
    }
  }
}
```

(The `"sections": { "...": … }` line in the TR terms block is an instruction, not JSON to paste: the executor pastes the sixteen English pairs. `messages.test.ts` (Task 2) asserts identical key sets, so the two files must end with the same keys.)

Counsel flags to record in `docs/PRIVACY.md` (one bullet list under a new "Seeded legal copy — counsel review" heading): the seed's `crm.jobsadmire.com` became `portal.jobsadmire.com`; "KURABİYELER" → "Çerezler"; "veri kontrolörü" → "veri sorumlusu"; section numbering normalised to 1–15; the dated claims kept verbatim in the legal text ("dated 19.09.2024", "within 30 days", the İŞKUR complaints line "0216 418 34 55", the two cookie lifetimes) are statutory/regulatory facts or config values, not metrics, and are NOT in the metric lint; `privacy@jobsadmire.com` must be verified to exist before Gate A; Terms §2/§7 still describe fee-based candidate services — counsel decides.

`src/app/[locale]/(minimal)/_legal/LegalDocument.tsx` (server component):

```tsx
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/design/blocks';
import { Section } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date';
import { parseLegalBody, type LegalBlock, type LegalRun } from '@/lib/legal/body';
import type { Href } from '@/lib/seo/routes';

export type LegalSection = { id: string; title: string; body: string /* already filled */ };

function Runs({ runs }: { runs: LegalRun[] }) {
  return (
    <>
      {runs.map((r, i) => (r.strong ? <strong key={i}>{r.text}</strong> : <span key={i}>{r.text}</span>))}
    </>
  );
}

export function LegalBody({ body }: { body: string }) {
  const blocks: LegalBlock[] = parseLegalBody(body);
  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i} className="my-3 list-disc space-y-1 pl-6 text-body text-text-secondary">
            {b.items.map((runs, j) => (
              <li key={j}>
                <Runs runs={runs} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-3 text-body text-text-secondary">
            <Runs runs={b.runs} />
          </p>
        ),
      )}
    </>
  );
}

/**
 * One layout for the four legal routes (D14): breadcrumbs → h1 (LCP) → dated line → intro →
 * optional notice/pending aside (the counsel placeholders carry `data-placeholder`, D26/W55) →
 * contents → sections. `sections` may be empty (the KVKK placeholder).
 */
export function LegalDocument({
  locale,
  href,
  homeLabel,
  title,
  intro,
  updatedAt,
  updatedLabel,
  contentsLabel,
  sections,
  notice,
  children,
}: {
  locale: Locale;
  href: Href;
  homeLabel: string;
  title: string;
  intro: string;
  updatedAt: string; // ISO YYYY-MM-DD from sys.legal.<doc>.updatedAt (D17)
  updatedLabel: string;
  contentsLabel: string;
  sections: LegalSection[];
  /** { testId, placeholder?, title?, body, cta? } — rendered as an <aside role="note"> */
  notice?: { testId: string; placeholder?: string; title?: string; body: string; cta?: ReactNode } | null;
  children?: ReactNode;
}) {
  return (
    <Section tone="light">
      <div className="container-site max-w-[760px]">
        <Breadcrumbs locale={locale} items={[{ name: homeLabel, href: '/' }, { name: title, href }]} />
        <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-6 text-h2">
          {title}
        </h1>
        <p className="mt-2 text-body-sm font-bold text-text-tertiary" data-testid="legal-updated">
          {updatedLabel}: <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time>
        </p>
        <p className="mt-5 text-body-lg text-text-secondary">{intro}</p>
        {notice && (
          <aside
            role="note"
            data-testid={notice.testId}
            data-placeholder={notice.placeholder}
            className="mt-6 rounded-base border border-warning-border bg-warning-surface p-4"
          >
            {notice.title && <p className="text-body font-extrabold text-warning-text">{notice.title}</p>}
            <p className="mt-1 text-body-sm font-semibold text-ink">{notice.body}</p>
            {notice.cta && <div className="mt-3">{notice.cta}</div>}
          </aside>
        )}
        {sections.length > 0 && (
          <nav aria-label={contentsLabel} data-testid="legal-toc" className="mt-8 rounded-base border border-border-2 bg-pale-1 p-4">
            <p className="text-body-sm font-extrabold uppercase tracking-[1px] text-text-tertiary">{contentsLabel}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-body-sm font-bold">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-blue-safe no-underline hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} data-legal-section className="mt-10 scroll-mt-24">
            <h2 className="text-card-title font-extrabold text-ink">
              {i + 1}. {s.title}
            </h2>
            <LegalBody body={s.body} />
          </section>
        ))}
        {children}
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(minimal)/privacy/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fill, getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { legalFillValues, PRIVACY_SECTIONS } from '@/lib/legal/documents';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalDocument } from '../_legal/LegalDocument';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  return buildMetadata({
    locale,
    href: '/privacy',
    bundle,
    pageKey: 'privacy',
    fallbackTitle: sys('seo.privacy.title'),
    fallbackDescription: sys('seo.privacy.description'),
  });
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const values = legalFillValues(bundle.settings);
  // `sys.raw`: the bodies are Markdown-lite, not ICU — no brace/apostrophe parsing (W23).
  const sections = PRIVACY_SECTIONS.map((id) => ({
    id,
    title: sys(`legal.privacy.sections.${id}.title`),
    body: fill(sys.raw(`legal.privacy.sections.${id}.body`) as string, values),
  }));
  return (
    <LegalDocument
      locale={locale}
      href="/privacy"
      homeLabel={sys('home')}
      title={sys('legal.privacy.title')}
      intro={sys('legal.privacy.intro')}
      updatedAt={sys('legal.privacy.updatedAt')}
      updatedLabel={sys('legal.updatedLabel')}
      contentsLabel={sys('legal.contents')}
      sections={sections}
    />
  );
}
```

`src/app/[locale]/(minimal)/terms/page.tsx` — identical shape with `href: '/terms'`, `pageKey: 'terms'`, `TERMS_SECTIONS`, `legal.terms.*`, plus the TR-only notice and the closing note:

```tsx
  const sections = TERMS_SECTIONS.map((id) => ({
    id,
    title: sys(`legal.terms.sections.${id}.title`),
    body: fill(sys.raw(`legal.terms.sections.${id}.body`) as string, values),
  }));
  return (
    <LegalDocument
      locale={locale}
      href="/terms"
      homeLabel={sys('home')}
      title={sys('legal.terms.title')}
      intro={sys('legal.terms.intro')}
      updatedAt={sys('legal.terms.updatedAt')}
      updatedLabel={sys('legal.updatedLabel')}
      contentsLabel={sys('legal.contents')}
      sections={sections}
      // §10 row 6: the Turkish Terms are pending counsel — the TR route says so and the launch
      // counter sees a named placeholder (W55); the EN route renders no notice.
      notice={
        locale === 'tr'
          ? { testId: 'legal-notice', placeholder: 'legal-terms-tr', body: sys('legal.terms.englishOnlyNotice') }
          : null
      }
    >
      <p className="mt-10 border-t border-border-2 pt-6 text-body-sm font-semibold text-text-secondary" data-testid="legal-final-note">
        {sys('legal.terms.finalNote')}
      </p>
    </LegalDocument>
  );
```

`src/app/[locale]/(minimal)/kvkk/page.tsx` — `href: '/kvkk'`, `pageKey: 'kvkk'`, no sections; the pending aside is the placeholder and links to the Privacy Policy:

```tsx
import { Button } from '@/design/primitives';
// … generateMetadata as above with seo.kvkk.* …
  return (
    <LegalDocument
      locale={locale}
      href="/kvkk"
      homeLabel={sys('home')}
      title={sys('legal.kvkk.title')}
      intro={sys('legal.kvkk.intro')}
      updatedAt={sys('legal.kvkk.updatedAt')}
      updatedLabel={sys('legal.updatedLabel')}
      contentsLabel={sys('legal.contents')}
      sections={[]}
      notice={{
        testId: 'legal-pending',
        placeholder: 'legal-kvkk',
        title: sys('legal.kvkk.pendingTitle'),
        body: sys('legal.kvkk.pendingBody'),
        cta: (
          <Button variant="secondary" href="/privacy">
            {sys('legal.privacy.title')}
          </Button>
        ),
      }}
    />
  );
```

`src/app/[locale]/(minimal)/cookie-policy/page.tsx` — `href: '/cookie-policy'`, `pageKey: 'cookiePolicy'`, `COOKIE_SECTIONS` bodies (no `fill` placeholders, but run `fill(…, values)` anyway for uniformity), and the pending aside `{ testId: 'legal-pending', placeholder: 'legal-cookie-policy', title: sys('legal.cookiePolicy.pendingTitle'), body: sys('legal.cookiePolicy.pendingBody') }`. No `generateStaticParams` on any of the four (the locale layout owns it).

`src/lib/seo/routes.ts` — remove `'/privacy'`, `'/terms'`, `'/kvkk'`, `'/cookie-policy'` from `UNBUILT_PATHNAMES`.

`e2e/routes.ts` — append (indexable: Lighthouse runs on all eight):

```ts
  { path: '/gizlilik', indexable: true },
  { path: '/en/privacy', indexable: true },
  { path: '/kullanim-kosullari', indexable: true },
  { path: '/en/terms', indexable: true },
  { path: '/kvkk', indexable: true },
  { path: '/en/kvkk', indexable: true },
  { path: '/cerez-politikasi', indexable: true },
  { path: '/en/cookie-policy', indexable: true },
```

`docs/PRIVACY.md` — the counsel-review bullet list named above.

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run src/messages src/lib/legal src/lib/seo
npm run verify
npm run build && (npx next start -p 3100 &) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/legal.spec.ts e2e/seo.spec.ts ; kill %1
```
Expected: the sitemap now lists the eight legal URLs (they left `UNBUILT`), `legal.spec.ts` green in both projects, one `[data-placeholder]` on `/kvkk`, `/en/kvkk`, `/cerez-politikasi`, `/en/cookie-policy`, `/kullanim-kosullari` and none on `/en/terms`, `/gizlilik`, `/en/privacy`.

- [ ] **Step 5: Commit**

```
feat(legal): privacy + terms seeded from main-backup, KVKK + cookie counsel placeholders (T13, D14)

sys.legal.* in both locales (Terms EN-only with a TR notice, §10 row 6);
dated lines from sys.legal.<doc>.updatedAt through formatDate (D17);
identifiers filled from settings; BreadcrumbList; four routes leave UNBUILT.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 4 — Newsletter token forwarding (pure modules + tests)

Why this is not `createFormAction`/`postForm` (CLAUDE.md "every page form goes through the forms kernel"): the confirm/unsubscribe door is **not** `POST /forms/:formKey` — `postForm`'s URL is hard-wired to `/api/website/v1/forms/${formKey}`, there is no catalog entry, no envelope, no honeypot, no captcha, no thank-you redirect and no `generate_lead` (a token click is not a lead). W5/I12 rule the shape: "click-to-forward (never on page load) and the RFC 8058 POST handler". The forwarder below is the one sanctioned hand-rolled Ops call outside the kernel; it reuses the kernel's `doorConfig()` for the base URL + write token and is recorded as the named exception in ARCHITECTURE § Forms flow (Cycle 6).

- [ ] **Step 1: Write the failing tests**

`src/lib/newsletter/classify.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { classifyNewsletterResponse, isOneClickBody, isPlausibleToken } from './classify';

describe('isPlausibleToken', () => {
  it('accepts the door DTO range (16..200, url-safe) and rejects everything else', () => {
    expect(isPlausibleToken('abcdefghijklmnop')).toBe(true); // 16
    expect(isPlausibleToken('cmfz1abc000012345678.QmFzZTY0dXJs_-signature')).toBe(true); // <id>.<hmac>
    expect(isPlausibleToken('short')).toBe(false);
    expect(isPlausibleToken('a'.repeat(201))).toBe(false);
    expect(isPlausibleToken('has space here 12345')).toBe(false);
    expect(isPlausibleToken(null)).toBe(false);
    expect(isPlausibleToken(undefined)).toBe(false);
    expect(isPlausibleToken(['a'.repeat(20)])).toBe(false);
  });
});

describe('classifyNewsletterResponse', () => {
  it('maps a 200 with a known outcome for the kind', () => {
    expect(classifyNewsletterResponse('confirm', 200, { data: { outcome: 'CONFIRMED' } })).toEqual({ kind: 'ok', outcome: 'CONFIRMED' });
    expect(classifyNewsletterResponse('unsubscribe', 200, { data: { outcome: 'UNKNOWN' } })).toEqual({ kind: 'ok', outcome: 'UNKNOWN' });
  });
  it('refuses an outcome that belongs to the other kind or an unreadable body', () => {
    expect(classifyNewsletterResponse('confirm', 200, { data: { outcome: 'UNSUBSCRIBED' } })).toEqual({ kind: 'unavailable', cause: 'server' });
    expect(classifyNewsletterResponse('confirm', 200, null)).toEqual({ kind: 'unavailable', cause: 'server' });
    expect(classifyNewsletterResponse('confirm', 200, '<html>')).toEqual({ kind: 'unavailable', cause: 'server' });
  });
  it('maps the door statuses', () => {
    expect(classifyNewsletterResponse('confirm', 400, { code: 'NEWSLETTER_TOKEN_INVALID' })).toEqual({ kind: 'invalid' });
    expect(classifyNewsletterResponse('confirm', 410, { message: 'expired' })).toEqual({ kind: 'expired' });
    expect(classifyNewsletterResponse('unsubscribe', 401, {})).toEqual({ kind: 'unauthorized' });
    expect(classifyNewsletterResponse('unsubscribe', 404, null)).toEqual({ kind: 'off' });
    expect(classifyNewsletterResponse('unsubscribe', 429, {})).toEqual({ kind: 'unavailable', cause: 'server' });
    expect(classifyNewsletterResponse('unsubscribe', 502, null)).toEqual({ kind: 'unavailable', cause: 'server' });
  });
});

describe('isOneClickBody', () => {
  it('requires the RFC 8058 form body', () => {
    expect(isOneClickBody('application/x-www-form-urlencoded', 'List-Unsubscribe=One-Click')).toBe(true);
    expect(isOneClickBody('application/x-www-form-urlencoded; charset=utf-8', 'List-Unsubscribe=One-Click')).toBe(true);
    expect(isOneClickBody('application/json', '{"List-Unsubscribe":"One-Click"}')).toBe(false);
    expect(isOneClickBody('application/x-www-form-urlencoded', 'foo=bar')).toBe(false);
    expect(isOneClickBody(null, '')).toBe(false);
  });
});
```

`src/lib/newsletter/forward.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { FORWARD_TIMEOUT_MS, forwardNewsletterToken } from './forward';

const CONFIG = { base: 'https://ops.example', token: 'wsw_' + 'a'.repeat(48) };
const TOKEN = 'confirm-token-0123456789abcdef';
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('forwardNewsletterToken', () => {
  it('returns unconfigured without a call when the door has no config', async () => {
    const fetchMock = vi.fn();
    expect(await forwardNewsletterToken('confirm', TOKEN, null, { fetch: fetchMock })).toEqual({ kind: 'unconfigured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('returns invalid without a call for an implausible token', async () => {
    const fetchMock = vi.fn();
    expect(await forwardNewsletterToken('confirm', 'x', CONFIG, { fetch: fetchMock })).toEqual({ kind: 'invalid' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('GETs confirm with the write token and the URL-encoded token, no cache', async () => {
    const fetchMock = vi.fn(async () => json(200, { data: { outcome: 'CONFIRMED' } }));
    const r = await forwardNewsletterToken('confirm', TOKEN + '+/=', CONFIG, { fetch: fetchMock });
    expect(r).toEqual({ kind: 'ok', outcome: 'CONFIRMED' });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`https://ops.example/api/website/v1/newsletter/confirm?token=${encodeURIComponent(TOKEN + '+/=')}`);
    expect(init.method).toBe('GET');
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${CONFIG.token}`);
    expect(init.cache).toBe('no-store');
    expect(init.body).toBeUndefined();
  });
  it('POSTs unsubscribe with no body (RFC 8058 forward)', async () => {
    const fetchMock = vi.fn(async () => json(200, { data: { outcome: 'UNSUBSCRIBED' } }));
    await forwardNewsletterToken('unsubscribe', TOKEN, CONFIG, { fetch: fetchMock });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`https://ops.example/api/website/v1/newsletter/unsubscribe?token=${TOKEN}`);
    expect(init.method).toBe('POST');
    expect(init.body).toBeUndefined();
  });
  it('makes exactly ONE attempt: a network error is unavailable/network, never retried', async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    expect(await forwardNewsletterToken('confirm', TOKEN, CONFIG, { fetch: fetchMock })).toEqual({ kind: 'unavailable', cause: 'network' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('a timeout is unavailable/timeout', async () => {
    const fetchMock = vi.fn(async () => {
      throw Object.assign(new Error('aborted'), { name: 'TimeoutError' });
    });
    expect(await forwardNewsletterToken('confirm', TOKEN, CONFIG, { fetch: fetchMock, timeoutMs: 5 })).toEqual({ kind: 'unavailable', cause: 'timeout' });
  });
  it('a non-JSON 200 is unavailable/server', async () => {
    const fetchMock = vi.fn(async () => new Response('<html>', { status: 200 }));
    expect(await forwardNewsletterToken('confirm', TOKEN, CONFIG, { fetch: fetchMock })).toEqual({ kind: 'unavailable', cause: 'server' });
  });
  it('the default budget is 8 s (W3 total budget, one attempt)', () => {
    expect(FORWARD_TIMEOUT_MS).toBe(8000);
  });
});
```

`src/lib/newsletter/one-click.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isOneClickUnsubscribe, ONE_CLICK_PATHS } from './one-click';

describe('isOneClickUnsubscribe (proxy predicate)', () => {
  it('lists the two locale paths of /newsletter/unsubscribe exactly', () => {
    expect([...ONE_CLICK_PATHS]).toEqual(['/abonelikten-cik', '/en/newsletter/unsubscribe']);
  });
  it('matches a plain POST to either page path', () => {
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik', false)).toBe(true);
    expect(isOneClickUnsubscribe('POST', '/en/newsletter/unsubscribe', false)).toBe(true);
    expect(isOneClickUnsubscribe('post', '/abonelikten-cik', false)).toBe(true);
  });
  it('never matches a GET, a server action, another path, or the confirm page', () => {
    expect(isOneClickUnsubscribe('GET', '/abonelikten-cik', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik', true)).toBe(false); // Next-Action header present
    expect(isOneClickUnsubscribe('POST', '/abone-onay', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik/', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/tr/abonelikten-cik', false)).toBe(false);
  });
});
```

`src/lib/newsletter/copy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { outcomeCopy } from './copy';

describe('outcomeCopy', () => {
  it('routes each result to its sys.newsletter key and decides the manual fallback (I12)', () => {
    expect(outcomeCopy('confirm', 'noToken')).toEqual({ key: 'newsletter.noToken', fallback: true, state: 'noToken' });
    expect(outcomeCopy('confirm', { kind: 'ok', outcome: 'CONFIRMED' })).toEqual({ key: 'newsletter.confirm.outcome.CONFIRMED', fallback: false, state: 'CONFIRMED' });
    expect(outcomeCopy('confirm', { kind: 'ok', outcome: 'ALREADY_CONFIRMED' })).toEqual({ key: 'newsletter.confirm.outcome.ALREADY_CONFIRMED', fallback: false, state: 'ALREADY_CONFIRMED' });
    expect(outcomeCopy('unsubscribe', { kind: 'ok', outcome: 'UNKNOWN' })).toEqual({ key: 'newsletter.unsubscribe.outcome.UNKNOWN', fallback: true, state: 'UNKNOWN' });
    expect(outcomeCopy('unsubscribe', { kind: 'invalid' })).toEqual({ key: 'newsletter.unsubscribe.invalid', fallback: true, state: 'invalid' });
    expect(outcomeCopy('confirm', { kind: 'expired' })).toEqual({ key: 'newsletter.confirm.expired', fallback: true, state: 'expired' });
    expect(outcomeCopy('unsubscribe', { kind: 'expired' })).toEqual({ key: 'newsletter.unsubscribe.invalid', fallback: true, state: 'invalid' });
    for (const r of [{ kind: 'off' }, { kind: 'unauthorized' }, { kind: 'unconfigured' }, { kind: 'unavailable', cause: 'network' }] as const)
      expect(outcomeCopy('confirm', r)).toEqual({ key: 'newsletter.unavailable', fallback: true, state: 'unavailable' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/lib/newsletter      # fails: modules do not exist
```

- [ ] **Step 3: Implement**

`src/lib/newsletter/types.ts` (client-safe):

```ts
export type NewsletterForwardKind = 'confirm' | 'unsubscribe';
export const CONFIRM_OUTCOMES = ['CONFIRMED', 'ALREADY_CONFIRMED'] as const;
export const UNSUBSCRIBE_OUTCOMES = ['UNSUBSCRIBED', 'ALREADY_UNSUBSCRIBED', 'UNKNOWN'] as const;
export type NewsletterOutcome = (typeof CONFIRM_OUTCOMES)[number] | (typeof UNSUBSCRIBE_OUTCOMES)[number];

/** The door's answer, classified (docs/INTEGRATIONS.md I12). */
export type NewsletterForwardResult =
  | { kind: 'ok'; outcome: NewsletterOutcome }
  | { kind: 'invalid' } // 400 NEWSLETTER_TOKEN_INVALID, or a token that never left the site
  | { kind: 'expired' } // 410 (confirm only, 48 h TTL on the Ops side)
  | { kind: 'off' } // bare 404: the website module flag is off
  | { kind: 'unauthorized' } // 401: write token rejected
  | { kind: 'unconfigured' } // no OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN in this environment
  | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' };

export type NewsletterActionState = { status: 'idle' } | { status: 'done'; result: NewsletterForwardResult };
export const IDLE_NEWSLETTER_STATE: NewsletterActionState = { status: 'idle' };
```

`src/lib/newsletter/classify.ts` (pure, client-safe):

```ts
import { CONFIRM_OUTCOMES, UNSUBSCRIBE_OUTCOMES, type NewsletterForwardKind, type NewsletterForwardResult, type NewsletterOutcome } from './types';

/** The door's `NewsletterTokenQueryDto`: string, 16..200. Confirm tokens are 32 base64url chars,
 *  unsubscribe tokens `<subscriberId>.<hmac>` — url-safe characters only, never whitespace. */
const TOKEN_RE = /^[A-Za-z0-9._~-]{16,200}$/;

export function isPlausibleToken(v: unknown): v is string {
  return typeof v === 'string' && TOKEN_RE.test(v);
}

function isOutcomeFor(kind: NewsletterForwardKind, v: unknown): v is NewsletterOutcome {
  const set: readonly string[] = kind === 'confirm' ? CONFIRM_OUTCOMES : UNSUBSCRIBE_OUTCOMES;
  return typeof v === 'string' && set.includes(v);
}

export function classifyNewsletterResponse(kind: NewsletterForwardKind, status: number, body: unknown): NewsletterForwardResult {
  if (status === 200) {
    const outcome = (body as { data?: { outcome?: unknown } } | null)?.data?.outcome;
    return isOutcomeFor(kind, outcome) ? { kind: 'ok', outcome } : { kind: 'unavailable', cause: 'server' };
  }
  if (status === 400) return { kind: 'invalid' };
  if (status === 410) return { kind: 'expired' };
  if (status === 401) return { kind: 'unauthorized' };
  if (status === 404) return { kind: 'off' };
  return { kind: 'unavailable', cause: 'server' };
}

/** RFC 8058 §3.1: the one-click POST carries `List-Unsubscribe=One-Click` as a form body. */
export function isOneClickBody(contentType: string | null, body: string): boolean {
  if (!contentType || !contentType.toLowerCase().includes('application/x-www-form-urlencoded')) return false;
  return new URLSearchParams(body).get('List-Unsubscribe') === 'One-Click';
}
```

`src/lib/newsletter/forward.ts` (no `server-only` so it is unit-testable, R2/R23 — the two `'use server'` actions and the route handler are its only callers; `DoorConfig` is a type-only import, erased at compile):

```ts
import type { DoorConfig } from '@/forms/env';
import { classifyNewsletterResponse, isPlausibleToken } from './classify';
import type { NewsletterForwardKind, NewsletterForwardResult } from './types';

/** One attempt inside W3's 8 s total budget. No retry: a confirm token is one-shot-ish
 *  (a second hit answers ALREADY_CONFIRMED), and the visitor can click again. */
export const FORWARD_TIMEOUT_MS = 8000;

export type ForwardDeps = { fetch?: typeof fetch; timeoutMs?: number };

const isTimeout = (e: unknown) => e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');

/**
 * Forwards a mail-link token to Operations: `GET …/newsletter/confirm?token=` or
 * `POST …/newsletter/unsubscribe?token=` (no body — the RFC 8058 shape the door accepts), with
 * the write token. Called ONLY from a visitor click (server action) or the one-click route
 * handler — never during a page render (I12: link scanners would consume the token).
 */
export async function forwardNewsletterToken(
  kind: NewsletterForwardKind,
  token: unknown,
  config: DoorConfig | null,
  deps: ForwardDeps = {},
): Promise<NewsletterForwardResult> {
  if (!isPlausibleToken(token)) return { kind: 'invalid' };
  if (!config) return { kind: 'unconfigured' };
  const f = deps.fetch ?? fetch;
  const url = `${config.base}/api/website/v1/newsletter/${kind}?token=${encodeURIComponent(token)}`;
  let res: Response;
  try {
    res = await f(url, {
      method: kind === 'confirm' ? 'GET' : 'POST',
      headers: { Authorization: `Bearer ${config.token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(deps.timeoutMs ?? FORWARD_TIMEOUT_MS),
    });
  } catch (e) {
    return { kind: 'unavailable', cause: isTimeout(e) ? 'timeout' : 'network' };
  }
  const body: unknown = await res.json().catch(() => null);
  return classifyNewsletterResponse(kind, res.status, body);
}
```

`src/lib/newsletter/one-click.ts` (edge-safe: imports only `routing`, which `proxy.ts` already imports):

```ts
import { routing } from '@/i18n/routing';

/** The two external paths Operations prints as the List-Unsubscribe URL (`NEWSLETTER_PATHS`
 *  mirrors `pathnames['/newsletter/unsubscribe']`): TR unprefixed, EN under /en. */
export const ONE_CLICK_PATHS: readonly string[] = routing.locales.map((locale) => {
  const entry = routing.pathnames['/newsletter/unsubscribe'];
  const external = typeof entry === 'string' ? entry : entry[locale];
  return locale === routing.defaultLocale ? external : `/${locale}${external}`;
});

/**
 * RFC 8058: the mail client POSTs `List-Unsubscribe=One-Click` to the PAGE URL. A server-action
 * POST to the same page carries the `Next-Action` header; anything else that POSTs there is the
 * one-click request, which `proxy.ts` rewrites to `/api/newsletter/unsubscribe` (same query).
 */
export function isOneClickUnsubscribe(method: string, pathname: string, hasNextActionHeader: boolean): boolean {
  return method.toUpperCase() === 'POST' && !hasNextActionHeader && ONE_CLICK_PATHS.includes(pathname);
}
```

`src/lib/newsletter/copy.ts` (pure, client-safe):

```ts
import type { NewsletterForwardKind, NewsletterForwardResult } from './types';

export type OutcomeCopy = { key: string; fallback: boolean; state: string };

/** Which `sys.newsletter.*` block renders for a result, and whether the manual
 *  info@jobsadmire.com fallback (I12: 400/410/UNKNOWN/unreachable) joins it. */
export function outcomeCopy(kind: NewsletterForwardKind, result: NewsletterForwardResult | 'noToken'): OutcomeCopy {
  if (result === 'noToken') return { key: 'newsletter.noToken', fallback: true, state: 'noToken' };
  switch (result.kind) {
    case 'ok':
      return { key: `newsletter.${kind}.outcome.${result.outcome}`, fallback: result.outcome === 'UNKNOWN', state: result.outcome };
    case 'invalid':
      return { key: `newsletter.${kind}.invalid`, fallback: true, state: 'invalid' };
    case 'expired':
      // only the confirm door answers 410; an unsubscribe 410 is treated as a bad link
      return kind === 'confirm'
        ? { key: 'newsletter.confirm.expired', fallback: true, state: 'expired' }
        : { key: 'newsletter.unsubscribe.invalid', fallback: true, state: 'invalid' };
    default:
      return { key: 'newsletter.unavailable', fallback: true, state: 'unavailable' };
  }
}
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run src/lib/newsletter && npm run verify
```

- [ ] **Step 5: Commit**

```
feat(newsletter): token forwarder, response classifier, RFC 8058 predicate, outcome copy map (T13, I12)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 5 — Newsletter pages, server actions, one-click route + proxy rewrite

- [ ] **Step 1: Write the failing tests**

Extend `TASK13_KEYS` in `src/messages/task13-keys.test.ts`:

```ts
  'sys.seo.newsletterConfirm.title',
  'sys.seo.newsletterConfirm.description',
  'sys.seo.newsletterUnsubscribe.title',
  'sys.seo.newsletterUnsubscribe.description',
  'sys.newsletter.noToken.title',
  'sys.newsletter.noToken.body',
  'sys.newsletter.unavailable.title',
  'sys.newsletter.unavailable.body',
  'sys.newsletter.fallback.lead',
  'sys.newsletter.fallback.email',
  'sys.newsletter.fallback.whatsapp',
  'sys.newsletter.fallback.subject',
  'sys.newsletter.backHome',
  ...['confirm', 'unsubscribe'].flatMap((k) => [`sys.newsletter.${k}.title`, `sys.newsletter.${k}.body`, `sys.newsletter.${k}.button`, `sys.newsletter.${k}.pending`, `sys.newsletter.${k}.invalid.title`, `sys.newsletter.${k}.invalid.body`]),
  'sys.newsletter.confirm.expired.title',
  'sys.newsletter.confirm.expired.body',
  ...['CONFIRMED', 'ALREADY_CONFIRMED'].flatMap((o) => [`sys.newsletter.confirm.outcome.${o}.title`, `sys.newsletter.confirm.outcome.${o}.body`]),
  ...['UNSUBSCRIBED', 'ALREADY_UNSUBSCRIBED', 'UNKNOWN'].flatMap((o) => [`sys.newsletter.unsubscribe.outcome.${o}.title`, `sys.newsletter.unsubscribe.outcome.${o}.body`]),
```

`e2e/pages/newsletter.spec.ts` (deterministic: the gate runs with `OPS_API_URL` unset, so every forward answers `unconfigured` → the manual fallback; a dummy token, never a real one):

```ts
import { test, expect } from '@playwright/test';

const TOKEN = 'e2e-dummy-token-0000000000';
const LEAK = /\{[A-Za-z][A-Za-z0-9]*\}|\bundefined\b|MISSING_MESSAGE/;

const PAGES = [
  { kind: 'confirm', tr: '/abone-onay', en: '/newsletter/confirm' },
  { kind: 'unsubscribe', tr: '/abonelikten-cik', en: '/newsletter/unsubscribe' },
] as const;

for (const p of PAGES) {
  for (const [locale, path] of [['tr', p.tr], ['en', `/en${p.en}`]] as const) {
    test(`newsletter ${path}: renders the click-to-forward form, never forwards on load`, async ({ page }) => {
      const res = await page.goto(`${path}?token=${TOKEN}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      expect(await page.locator('body').innerText()).not.toMatch(LEAK);
      // The token is in a hidden input, waiting for the click (I12) — nothing has fired yet.
      await expect(page.getByTestId('newsletter-form')).toBeVisible();
      await expect(page.getByTestId('newsletter-form').locator('input[name="token"]')).toHaveValue(TOKEN);
      await expect(page.getByTestId('newsletter-outcome')).toHaveCount(0);
      await expect(page.getByTestId('newsletter-fallback')).toHaveCount(0);
    });

    test(`newsletter ${path}: the click reaches the server action; with no door the manual fallback appears`, async ({ page }) => {
      await page.goto(`${path}?token=${TOKEN}`);
      await page.getByTestId('newsletter-form').getByRole('button').click();
      const fallback = page.getByTestId('newsletter-fallback');
      await expect(fallback).toBeVisible();
      await expect(fallback).toHaveAttribute('data-outcome', 'unavailable');
      await expect(fallback.locator('a[href^="mailto:info@jobsadmire.com"]')).toBeVisible();
      await expect(fallback.locator('a[href^="https://wa.me/"]')).toBeVisible();
      await expect(page.getByTestId('newsletter-form')).toHaveCount(0);
    });

    test(`newsletter ${path}: without a token, the "link incomplete" state and the fallback`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByTestId('page-h1')).toBeVisible();
      await expect(page.getByTestId('newsletter-form')).toHaveCount(0);
      await expect(page.getByTestId('newsletter-fallback')).toHaveAttribute('data-outcome', 'noToken');
    });
  }

  test(`newsletter ${p.tr}: the language switch keeps the page`, async ({ page }) => {
    await page.goto(`${p.tr}?token=${TOKEN}`);
    await page.getByRole('link', { name: 'English', exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`/en${p.en.replace(/\//g, '\\/')}`));
    await expect(page.getByTestId('page-h1')).toBeVisible();
  });
}

test.describe('RFC 8058 one-click unsubscribe', () => {
  for (const path of ['/abonelikten-cik', '/en/newsletter/unsubscribe']) {
    test(`a one-click POST to ${path} is rewritten to the handler (503 with no door, JSON, no-store)`, async ({ request }) => {
      const res = await request.post(`${path}?token=${TOKEN}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: 'List-Unsubscribe=One-Click',
      });
      expect(res.status()).toBe(503);
      expect(res.headers()['cache-control']).toContain('no-store');
      expect(await res.json()).toEqual({ error: 'unconfigured' });
    });
  }
  test('a POST without the one-click body is refused with 400', async ({ request }) => {
    const res = await request.post(`/abonelikten-cik?token=${TOKEN}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: 'foo=bar',
    });
    expect(res.status()).toBe(400);
  });
  test('a missing or short token is refused with 400 before any forward', async ({ request }) => {
    const res = await request.post('/api/newsletter/unsubscribe?token=short', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: 'List-Unsubscribe=One-Click',
    });
    expect(res.status()).toBe(400);
  });
  test('the confirm page is never rewritten (a POST there is not one-click)', async ({ request }) => {
    const res = await request.post(`/abone-onay?token=${TOKEN}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: 'List-Unsubscribe=One-Click',
    });
    expect(res.headers()['content-type'] ?? '').toContain('text/html');
  });
});
```

Also add to `e2e/seo.spec.ts`'s existing `robots.txt` case (today lines 42–49), after `expect(body).toContain('Disallow: /tesekkurler');`:

```ts
  // T13: the three noindex routes left UNBUILT, so robotsDisallowPaths now lists them (W37).
  for (const p of ['/portal-girisi', '/abone-onay', '/abonelikten-cik', '/en/portal-login', '/en/newsletter/confirm', '/en/newsletter/unsubscribe'])
    expect(body).toContain(`Disallow: ${p}`);
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/messages/task13-keys.test.ts     # fails: sys.newsletter.* / sys.seo.newsletter* missing
```

- [ ] **Step 3: Implement**

`src/messages/en.json` — inside `"seo"`:

```json
"newsletterConfirm": { "title": "Confirm your subscription | JobsAdmire", "description": "Confirm your JobsAdmire newsletter subscription." },
"newsletterUnsubscribe": { "title": "Unsubscribe | JobsAdmire", "description": "Unsubscribe from the JobsAdmire newsletter." }
```

and the `"newsletter"` object inside `"sys"`:

```json
"newsletter": {
  "noToken": {
    "title": "This link is incomplete",
    "body": "This page only works with the link in your e-mail, and that link seems to be missing its token. Please click the button in the e-mail again, or write to us."
  },
  "unavailable": {
    "title": "We could not process your request right now",
    "body": "Our server did not answer. Try again in a few minutes, or e-mail us and we will handle it by hand."
  },
  "fallback": {
    "lead": "Need a hand?",
    "email": "E-mail us",
    "whatsapp": "Message us on WhatsApp",
    "subject": "Newsletter subscription"
  },
  "backHome": "Back to home",
  "confirm": {
    "title": "Confirm your newsletter subscription",
    "body": "Click the button below to complete your subscription. If you do not confirm, we will not e-mail you.",
    "button": "Confirm subscription",
    "pending": "Confirming…",
    "outcome": {
      "CONFIRMED": { "title": "Your subscription is confirmed", "body": "Thank you. Hiring updates will reach your inbox about once a month; you can unsubscribe at any time." },
      "ALREADY_CONFIRMED": { "title": "Your subscription was already confirmed", "body": "This address was confirmed earlier. There is nothing more to do." }
    },
    "invalid": { "title": "This confirmation link is not valid", "body": "We did not recognise the link. Please subscribe again and we will send you a fresh confirmation e-mail." },
    "expired": { "title": "This confirmation link has expired", "body": "The link is past its validity window. Please subscribe again and we will send you a fresh confirmation e-mail." }
  },
  "unsubscribe": {
    "title": "Unsubscribe from the newsletter",
    "body": "Click the button below and we will stop sending the newsletter to this address.",
    "button": "Unsubscribe",
    "pending": "Processing…",
    "outcome": {
      "UNSUBSCRIBED": { "title": "You are unsubscribed", "body": "We will not send the newsletter to this address any more. If you change your mind, you can subscribe again at any time." },
      "ALREADY_UNSUBSCRIBED": { "title": "You were already unsubscribed", "body": "This address was removed earlier. There is nothing more to do." },
      "UNKNOWN": { "title": "We found no subscription for this link", "body": "There is no subscription on our list for this link, so no newsletter will be sent. If you keep receiving e-mails from us, write to us and we will fix it by hand." }
    },
    "invalid": { "title": "This unsubscribe link is not valid", "body": "We did not recognise the link. E-mail us and we will remove you from the list by hand." }
  }
}
```

`src/messages/tr.json` — inside `"seo"`:

```json
"newsletterConfirm": { "title": "Bülten aboneliğini onaylayın | JobsAdmire", "description": "JobsAdmire bülten aboneliğinizi onaylayın." },
"newsletterUnsubscribe": { "title": "Bülten aboneliğinden çıkın | JobsAdmire", "description": "JobsAdmire bülten aboneliğinizi sonlandırın." }
```

and inside `"sys"`:

```json
"newsletter": {
  "noToken": {
    "title": "Bağlantı eksik",
    "body": "Bu sayfa yalnızca e-postanızdaki bağlantıyla çalışır ve bağlantı eksik görünüyor. Lütfen e-postadaki düğmeye tekrar tıklayın ya da bize yazın."
  },
  "unavailable": {
    "title": "İsteğiniz şu anda işlenemedi",
    "body": "Sunucumuz yanıt vermedi. Birkaç dakika sonra tekrar deneyebilir ya da bize e-posta gönderebilirsiniz; talebinizi elle işleriz."
  },
  "fallback": {
    "lead": "Yardıma mı ihtiyacınız var?",
    "email": "E-posta gönderin",
    "whatsapp": "WhatsApp'tan yazın",
    "subject": "Bülten aboneliği"
  },
  "backHome": "Ana sayfaya dön",
  "confirm": {
    "title": "Bülten aboneliğinizi onaylayın",
    "body": "Aboneliğinizi tamamlamak için aşağıdaki düğmeye tıklayın. Onaylamazsanız size e-posta göndermeyiz.",
    "button": "Aboneliği onayla",
    "pending": "Onaylanıyor…",
    "outcome": {
      "CONFIRMED": { "title": "Aboneliğiniz onaylandı", "body": "Teşekkür ederiz. İşe alım güncellemeleri ayda yaklaşık bir kez e-posta kutunuza gelecek; dilediğiniz zaman abonelikten çıkabilirsiniz." },
      "ALREADY_CONFIRMED": { "title": "Aboneliğiniz zaten onaylanmış", "body": "Bu adres daha önce onaylanmış. Yapmanız gereken başka bir şey yok." }
    },
    "invalid": { "title": "Bu onay bağlantısı geçerli değil", "body": "Bağlantıyı tanıyamadık. Lütfen bültene yeniden abone olun; size yeni bir onay e-postası gönderelim." },
    "expired": { "title": "Bu onay bağlantısının süresi dolmuş", "body": "Bağlantının geçerlilik süresi geçmiş. Lütfen bültene yeniden abone olun; size yeni bir onay e-postası gönderelim." }
  },
  "unsubscribe": {
    "title": "Bülten aboneliğinden çıkın",
    "body": "Aşağıdaki düğmeye tıkladığınızda bu adrese bülten göndermeyi durdururuz.",
    "button": "Abonelikten çık",
    "pending": "İşleniyor…",
    "outcome": {
      "UNSUBSCRIBED": { "title": "Abonelikten çıktınız", "body": "Bu adrese artık bülten göndermeyeceğiz. Fikrinizi değiştirirseniz istediğiniz zaman yeniden abone olabilirsiniz." },
      "ALREADY_UNSUBSCRIBED": { "title": "Zaten abonelikten çıkmışsınız", "body": "Bu adres daha önce listeden çıkarılmış. Yapmanız gereken başka bir şey yok." },
      "UNKNOWN": { "title": "Bu bağlantı için abonelik bulunamadı", "body": "Listemizde bu bağlantıya ait bir abonelik yok; size bülten gönderilmeyecek. Yine de bizden e-posta almaya devam ederseniz bize yazın, elle düzeltelim." }
    },
    "invalid": { "title": "Bu abonelikten çıkma bağlantısı geçerli değil", "body": "Bağlantıyı tanıyamadık. Bize e-posta gönderin; sizi listeden elle çıkaralım." }
  }
}
```

`src/app/[locale]/(minimal)/newsletter/confirm/actions.ts`:

```ts
'use server';
import { doorConfig } from '@/forms/env';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';
import type { NewsletterActionState } from '@/lib/newsletter/types';

/** The visitor's click on /abone-onay — the ONLY place the confirm token leaves the site (I12). */
export async function confirmNewsletter(_prev: NewsletterActionState, data: FormData): Promise<NewsletterActionState> {
  const result = await forwardNewsletterToken('confirm', data.get('token'), doorConfig());
  return { status: 'done', result };
}
```

`src/app/[locale]/(minimal)/newsletter/unsubscribe/actions.ts`:

```ts
'use server';
import { doorConfig } from '@/forms/env';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';
import type { NewsletterActionState } from '@/lib/newsletter/types';

export async function unsubscribeNewsletter(_prev: NewsletterActionState, data: FormData): Promise<NewsletterActionState> {
  const result = await forwardNewsletterToken('unsubscribe', data.get('token'), doorConfig());
  return { status: 'done', result };
}
```

`src/app/[locale]/(minimal)/newsletter/_components/NewsletterOutcome.tsx`:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives';
import { mailLink } from '@/lib/contact';
import { outcomeCopy } from '@/lib/newsletter/copy';
import type { NewsletterForwardKind, NewsletterForwardResult } from '@/lib/newsletter/types';

export type NewsletterContact = { email: string; whatsappHref: string };

/** The outcome card. `data-testid` is `newsletter-fallback` whenever the manual door shows (I12:
 *  400/410/UNKNOWN/unreachable/no token), `newsletter-outcome` otherwise; `data-outcome` names
 *  the state so the e2e can assert it without reading copy. */
export function NewsletterOutcome({
  kind,
  result,
  contact,
}: {
  kind: NewsletterForwardKind;
  result: NewsletterForwardResult | 'noToken';
  contact: NewsletterContact;
}) {
  const sys = useTranslations('sys');
  const copy = outcomeCopy(kind, result);
  return (
    <div
      role="status"
      data-testid={copy.fallback ? 'newsletter-fallback' : 'newsletter-outcome'}
      data-outcome={copy.state}
      className="rounded-base border border-border-1 bg-pale-1 p-5"
    >
      <h2 className="text-card-title font-extrabold text-ink">{sys(`${copy.key}.title`)}</h2>
      <p className="mt-2 text-body text-text-secondary">{sys(`${copy.key}.body`)}</p>
      {copy.fallback && (
        <div className="mt-4">
          <p className="text-body-sm font-extrabold text-ink">{sys('newsletter.fallback.lead')}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ContactLink
              href={mailLink(contact.email, sys('newsletter.fallback.subject'))}
              placement="page_cta"
              className={buttonClassName('secondary')}
            >
              {sys('newsletter.fallback.email')}
            </ContactLink>
            <ContactLink
              href={contact.whatsappHref}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('secondary')}
            >
              {sys('newsletter.fallback.whatsapp')}
            </ContactLink>
          </div>
        </div>
      )}
    </div>
  );
}
```

`src/app/[locale]/(minimal)/newsletter/_components/TokenForwardForm.tsx`:

```tsx
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Button } from '@/design/primitives';
import { IDLE_NEWSLETTER_STATE, type NewsletterActionState, type NewsletterForwardKind } from '@/lib/newsletter/types';
import { NewsletterOutcome, type NewsletterContact } from './NewsletterOutcome';

function Submit({ label, pending }: { label: string; pending: string }) {
  const { pending: busy } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" disabled={busy} aria-busy={busy}>
      {busy ? pending : label}
    </Button>
  );
}

/** Click-to-forward (W5/I12): the token sits in a hidden input until the visitor presses the
 *  button; the server action is the only network call. No `next/dynamic`: this is the page's
 *  primary action and above the fold (W13). */
export function TokenForwardForm({
  kind,
  token,
  action,
  contact,
}: {
  kind: NewsletterForwardKind;
  token: string;
  action: (prev: NewsletterActionState, data: FormData) => Promise<NewsletterActionState>;
  contact: NewsletterContact;
}) {
  const [state, formAction] = useActionState(action, IDLE_NEWSLETTER_STATE);
  const sys = useTranslations('sys');
  if (state.status === 'done') return <NewsletterOutcome kind={kind} result={state.result} contact={contact} />;
  return (
    <form action={formAction} data-testid="newsletter-form" className="mt-6">
      <input type="hidden" name="token" value={token} />
      <Submit label={sys(`newsletter.${kind}.button`)} pending={sys(`newsletter.${kind}.pending`)} />
    </form>
  );
}
```

`src/app/[locale]/(minimal)/newsletter/_components/NewsletterPage.tsx` (server; shared by both routes):

```tsx
import { Button } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import { isPlausibleToken } from '@/lib/newsletter/classify';
import type { NewsletterActionState, NewsletterForwardKind } from '@/lib/newsletter/types';
import { Section } from '@/design/primitives';
import { NewsletterOutcome, type NewsletterContact } from './NewsletterOutcome';
import { TokenForwardForm } from './TokenForwardForm';

export function NewsletterPage({
  kind,
  token,
  action,
  contact,
  copy,
}: {
  kind: NewsletterForwardKind;
  locale: Locale;
  token: string | string[] | undefined;
  action: (prev: NewsletterActionState, data: FormData) => Promise<NewsletterActionState>;
  contact: NewsletterContact;
  copy: { title: string; body: string; backHome: string };
}) {
  // `?token=a&token=b` is a malformed link — the first value decides (the thank-you page's rule).
  const first = Array.isArray(token) ? token[0] : token;
  const usable = isPlausibleToken(first) ? first : null;
  return (
    <Section tone="light">
      <div className="container-site max-w-[720px]">
        <h1 data-testid="page-h1" data-lcp-slot="h1" className="text-h2">
          {copy.title}
        </h1>
        <p className="mt-3 text-body-lg text-text-secondary">{copy.body}</p>
        {usable ? (
          <TokenForwardForm kind={kind} token={usable} action={action} contact={contact} />
        ) : (
          <div className="mt-6">
            <NewsletterOutcome kind={kind} result="noToken" contact={contact} />
          </div>
        )}
        <div className="mt-8">
          <Button variant="ghost" href="/">
            {copy.backHome}
          </Button>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(minimal)/newsletter/confirm/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { NewsletterPage } from '../_components/NewsletterPage';
import { confirmNewsletter } from './actions';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  return {
    ...buildMetadata({
      locale,
      href: '/newsletter/confirm',
      bundle,
      pageKey: 'newsletterConfirm',
      fallbackTitle: sys('seo.newsletterConfirm.title'),
      fallbackDescription: sys('seo.newsletterConfirm.description'),
    }),
    // A one-shot token page is never indexed, whatever a later page record says (spec §3.1).
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterConfirm({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // Nothing is forwarded here: the token only travels on the visitor's click (I12/W5).
  return (
    <NewsletterPage
      kind="confirm"
      locale={locale}
      token={token}
      action={confirmNewsletter}
      contact={{ email: bundle.settings.email, whatsappHref: waLink(bundle.settings.whatsappNumber, sys('whatsapp.prefill')) }}
      copy={{ title: sys('newsletter.confirm.title'), body: sys('newsletter.confirm.body'), backHome: sys('newsletter.backHome') }}
    />
  );
}
```

`src/app/[locale]/(minimal)/newsletter/unsubscribe/page.tsx` — identical with `href: '/newsletter/unsubscribe'`, `pageKey: 'newsletterUnsubscribe'`, `seo.newsletterUnsubscribe.*`, `kind="unsubscribe"`, `action={unsubscribeNewsletter}` (from `./actions`), `copy` from `newsletter.unsubscribe.{title,body}`.

`src/app/api/newsletter/unsubscribe/route.ts` (plain `Response`, no `next/server` — the form-beacon route's rule):

```ts
import { doorConfig } from '@/forms/env';
import { isOneClickBody, isPlausibleToken } from '@/lib/newsletter/classify';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';

/**
 * RFC 8058 one-click unsubscribe (I12). Reached two ways: directly, and by `proxy.ts`'s rewrite of
 * a non-action POST to the page URL Operations prints in `List-Unsubscribe` (`/abonelikten-cik`,
 * `/en/newsletter/unsubscribe`). Forwards `POST …/newsletter/unsubscribe?token=` with the write
 * token; the body is checked for `List-Unsubscribe=One-Click` and never forwarded. Sits outside
 * the proxy matcher (`/api/…`), so it is never locale-rewritten.
 */
export const dynamic = 'force-dynamic';

const HEADERS = { 'Cache-Control': 'private, no-store', 'Content-Type': 'application/json' };
const json = (body: unknown, status: number) => new Response(JSON.stringify(body), { status, headers: HEADERS });

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!isPlausibleToken(token)) return json({ error: 'invalid token' }, 400);
  const body = await request.text().catch(() => '');
  if (!isOneClickBody(request.headers.get('content-type'), body)) return json({ error: 'not a one-click request' }, 400);
  const result = await forwardNewsletterToken('unsubscribe', token, doorConfig());
  switch (result.kind) {
    case 'ok':
      return json({ outcome: result.outcome }, 200);
    case 'invalid':
      return json({ error: 'invalid token' }, 400);
    case 'unconfigured':
      return json({ error: 'unconfigured' }, 503);
    case 'off':
    case 'unauthorized':
      return json({ error: result.kind }, 503);
    default:
      return json({ error: 'unavailable' }, 502);
  }
}
```

`src/proxy.ts` — replace the whole file (today lines 1–20):

```ts
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { isOneClickUnsubscribe } from './lib/newsletter/one-click';
import gone from '../redirects/gone.json';

const intl = createMiddleware(routing);
const GONE = gone as string[];

export default function proxy(request: Parameters<typeof intl>[0]) {
  const { pathname } = request.nextUrl;
  // RFC 8058 (I12): a mail client's one-click POST lands on the PAGE URL Operations printed in
  // List-Unsubscribe. A server-action POST to the same page carries `Next-Action`; anything else
  // that POSTs there is the one-click request and is answered by the route handler, same query.
  if (isOneClickUnsubscribe(request.method, pathname, request.headers.has('next-action'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/newsletter/unsubscribe';
    return NextResponse.rewrite(url);
  }
  if (GONE.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))) {
    return new NextResponse(null, { status: 410 });
  }
  return intl(request);
}

export const config = {
  // never intercept API routes, Next internals, Vercel internals, or files with an extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

`src/lib/seo/routes.ts` — remove `'/newsletter/confirm'` and `'/newsletter/unsubscribe'` from `UNBUILT_PATHNAMES` (the set now holds the twelve keys of the pages T1–T12 own or have already removed).

`e2e/routes.ts` — append (noindex → `indexable: false`; the dummy token renders the form state, the token-less variant is covered by the spec):

```ts
  { path: '/abone-onay?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/en/newsletter/confirm?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/abonelikten-cik?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/en/newsletter/unsubscribe?token=e2e-dummy-token-0000000000', indexable: false },
```

- [ ] **Step 4: Run tests + npm run verify**

```bash
npx vitest run src/messages src/lib/newsletter src/lib/seo
npm run verify
# R26 applies (proxy.ts changed): full build + routing/smoke/redirects on next start, one job at a time
npm run build && (npx next start -p 3100 &) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npx playwright test e2e/pages/newsletter.spec.ts e2e/routing.spec.ts e2e/smoke.spec.ts e2e/redirects.spec.ts e2e/seo.spec.ts ; kill %1
```
Expected: `newsletter.spec.ts` green in both projects — the click test proves the server-action POST is **not** intercepted by the rewrite (the fallback panel comes from the action), the one-click tests prove the rewrite (503 JSON from the page URL); `seo.spec.ts` sees the six new `Disallow` lines; the sitemap still omits the three noindex routes.

- [ ] **Step 5: Commit**

```
feat(newsletter): confirm/unsubscribe pages with click-to-forward, RFC 8058 one-click handler + proxy rewrite (T13, W5/I12)

Token from ?token=, forwarded to Operations only on the visitor's click (server
action) — never on load; POST /api/newsletter/unsubscribe answers the mail
client's List-Unsubscribe=One-Click via a method-aware rewrite of the page URL;
400/410/UNKNOWN/unreachable show the info@ manual fallback. noindex; both
routes leave UNBUILT; gate routes appended.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

---

#### Cycle 6 — Docs, gate, ledger

- [ ] **Step 1: Write the failing test**

None new — this cycle is documentation plus the full gate. The "test" is `npm run gate` against the built branch and the docs-sync checklist (CLAUDE.md item 3).

- [ ] **Step 2: Run to verify it fails**

```bash
grep -c "portal-girisi" docs/SEO.md   # 0 today — the page rows are missing
```

- [ ] **Step 3: Implement (docs)**

`docs/SEO.md` — in the `## Pages` table (create it before `## OG images` with this header if no earlier page task has: `| Route | Title source | Canonical | JSON-LD | LCP slot | Index |`), append:

```markdown
| `/portal-girisi` · `/en/portal-login` | `sys.seo.portal.*` (package has no SEO ids) | self, per locale | Organization (site-wide) | `h1` (crmlogin.047) | **noindex** (record + forced; robots Disallow; not in sitemap) |
| `/gizlilik` · `/en/privacy` | `sys.seo.privacy.*` | self, per locale | Organization + BreadcrumbList | `h1` | index |
| `/kullanim-kosullari` · `/en/terms` | `sys.seo.terms.*` | self, per locale | Organization + BreadcrumbList | `h1` | index (TR carries the `legal-terms-tr` placeholder notice until counsel delivers Turkish) |
| `/kvkk` · `/en/kvkk` | `sys.seo.kvkk.*` | self, per locale | Organization + BreadcrumbList | `h1` | index (body = `legal-kvkk` placeholder until counsel copy) |
| `/cerez-politikasi` · `/en/cookie-policy` | `sys.seo.cookiePolicy.*` | self, per locale | Organization + BreadcrumbList | `h1` | index (minimal notice + `legal-cookie-policy` placeholder) |
| `/abone-onay` · `/en/newsletter/confirm` | `sys.seo.newsletterConfirm.*` | self, per locale | Organization | `h1` | **noindex** (forced; robots Disallow; not in sitemap) |
| `/abonelikten-cik` · `/en/newsletter/unsubscribe` | `sys.seo.newsletterUnsubscribe.*` | self, per locale | Organization | `h1` | **noindex** (forced; robots Disallow; not in sitemap) |
```

and in `## Robots` replace the sentence "**`/abone-onay`/`/abonelikten-cik`/… are not yet in the disallow list** … in the same WP2 change that ships the newsletter pages." with: "`/portal-girisi`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms are disallowed since T13 (they left `UNBUILT_PATHNAMES`; `robotsDisallowPaths` derives the list, W37)."

`docs/ANALYTICS.md` — under the event table's paragraph that begins "**WP1 wires exactly one of these seven events**" (or the T0c-updated paragraph that replaced it), add:

```markdown
**T13 pages.** Portal entry: `whatsapp_click` (`placement: page_cta`) on the trust-line and help-card WhatsApp CTAs — no `call_click`/`email_click` sources on the page; the two portal links are outbound navigations, not events. Newsletter confirm/unsubscribe: `email_click` and `whatsapp_click` (`page_cta`) on the manual-fallback buttons only; **no `generate_lead` and no `conversion`** — a token click is not a lead and never navigates to `/tesekkurler`. Legal pages: no events.
```

`docs/CONTENT-MODEL.md` — in `### Adding copy (W9, W23, W54)` after the namespace sentence, add:

```markdown
T13 namespaces: `sys.portal.*` (the two composed strings of the link-only chooser: `intro`, `signIn`), `sys.legal.*` (`updatedLabel`, `contents`, then `privacy|terms|kvkk|cookiePolicy.{title,intro,updatedAt,…}` with `sections.<id>.{title,body}` — bodies are Markdown-lite read through `sys.raw()` and filled with `{email} {phoneDisplay} {permitNo} {lawRef} {taxNo}` from settings; Terms bodies are English in both files by ruling), `sys.newsletter.*` (`noToken`, `unavailable`, `fallback.*`, `backHome`, `confirm|unsubscribe.{title,body,button,pending,outcome.<OUTCOME>.{title,body},invalid.*}`, `confirm.expired.*`) and `sys.seo.{portal,privacy,terms,kvkk,cookiePolicy,newsletterConfirm,newsletterUnsubscribe}.{title,description}`. Every legal `updatedAt` is an ISO date rendered through `formatDate` (D17).
```

`docs/ARCHITECTURE.md` — § Routing, after the `proxy.ts` bullet list item "next-intl locale resolution", add a third bullet **before** the 410 one (the order in code is rewrite → 410 → intl):

```markdown
   - **RFC 8058 one-click rewrite (T13, I12):** a `POST` to `/abonelikten-cik` or `/en/newsletter/unsubscribe` **without** a `Next-Action` header is rewritten to `/api/newsletter/unsubscribe` (same query) — Operations prints the *page* URL in `List-Unsubscribe`, and a page cannot answer a mail client's POST; a server-action POST to the same page carries `Next-Action` and passes through untouched (`src/lib/newsletter/one-click.ts`, first check in `proxy.ts`).
```

and § Forms flow, append:

```markdown
**Newsletter tokens (I12, W5) — the one named exception to "every form goes through the kernel".** `/abone-onay` and `/abonelikten-cik` are not catalog forms: they forward the mail-link token to `GET …/newsletter/confirm?token=` / `POST …/newsletter/unsubscribe?token=` through `src/lib/newsletter/forward.ts` (one attempt, 8 s, write token from `doorConfig()`), **only on the visitor's click** (server action) or the RFC 8058 one-click POST — never during a page render, because link scanners would consume the one-shot confirm token. Outcomes render inline from the door's enum; 400/410/`UNKNOWN`/unreachable show the manual `info@jobsadmire.com` fallback. No thank-you redirect, no `generate_lead`. The routes run for real under every token class on the Ops side — a test-token smoke run must never carry a real subscriber's token.
```

`docs/INTEGRATIONS.md` — replace the `## I12` paragraph body with:

```markdown
**Direction:** Website → Ops. **Auth:** write token + a per-subscriber token in the confirm/unsubscribe link. **Routes:** `GET /api/website/v1/newsletter/confirm?token=` → `{ data: { outcome: CONFIRMED | ALREADY_CONFIRMED } }` (400 invalid, 410 expired after 48 h); `GET|POST /api/website/v1/newsletter/unsubscribe?token=` → `{ data: { outcome: UNSUBSCRIBED | ALREADY_UNSUBSCRIBED | UNKNOWN } }` (400 on a bad signature); every answer `Cache-Control: private, no-store`. **Website side (T13):** the pages at `pathnames['/newsletter/confirm' | '/newsletter/unsubscribe']` (a verbatim mirror of Ops `NEWSLETTER_PATHS`: `/abone-onay`, `/abonelikten-cik`, `/en/newsletter/confirm`, `/en/newsletter/unsubscribe` — never change one side alone) forward the token **only on the visitor's click**, never on page load; the mail client's RFC 8058 `List-Unsubscribe=One-Click` POST to the unsubscribe page URL is rewritten to `POST /api/newsletter/unsubscribe` and forwarded as a body-less POST. **Failure/degraded:** 400/410/`UNKNOWN`/unreachable/unconfigured show the manual `info@jobsadmire.com` + WhatsApp fallback, never a silent no-op; the one-click handler answers 503 (`unconfigured`/`off`/`unauthorized`), 502 (unreachable) or 400 (bad token / not a one-click body). **Smoke:** never with a real subscriber's token — the Ops routes ignore the token class.
```

`docs/PRD.md` — §8 Legal pages, append one sentence: "Shipped in WP2 T13: `/gizlilik` and `/kullanim-kosullari` seeded from the old site's JSON (Terms English-only on the TR route with a notice, pending counsel), `/kvkk` and `/cerez-politikasi` as named counsel placeholders (`data-placeholder`), every last-updated date from `sys.legal.<doc>.updatedAt` (D17)." Line 33 (portal row) gains " — `(bare)` route group, W8: one Partner Portal tile, Android badge + local QR, no credential form"; lines 39–40 gain " — click-to-forward on the visitor's action only; RFC 8058 POST rewritten to `/api/newsletter/unsubscribe`".

`docs/PRIVACY.md` — the counsel-review bullet list from Cycle 3 (if not already added there).

- [ ] **Step 4: Run tests + the full gate**

```bash
npm run verify
npm run build && (npx next start -p 3100 &) && sleep 4 \
  && E2E_BASE_URL=http://localhost:3100 npm run gate ; kill %1
npm run js-size
```
Expected: every T13 route passes axe (both projects) and the width sweep; Lighthouse on the eight legal paths ≥ 0.95 / 1.0 / 1.0 / 1.0 with `resource-summary:script:size` ≤ 204,800 B (the legal pages add no client JS beyond the minimal chrome; the newsletter pages add the `TokenForwardForm` island — expect ≤ 6 KB gz over the shell; the portal page loads no Header/Footer chunks so it sits *below* the shell). Note the HTML weight: `NextIntlClientProvider` inherits every message, so the legal bodies (~17 KB per locale) ride in every page's RSC payload — record the document size of `/` before and after this task in the ledger; if `/`'s LCP moves, T15 restricts the client provider to the namespaces the islands read (`sys.form`, `sys.newsletter`, `sys.consent`, `sys.languageHint`, `sys.nav`, `sys.marquee`, `sys.whatsapp`).

- [ ] **Step 5: Commit**

```
docs(t13): SEO page rows, analytics note, sys namespaces, RFC 8058 routing, I12 contract, PRD/PRIVACY (T13)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

**Ledger line (append to `docs/superpowers/plans/2026-09-20-wp2b-pages.md`'s ledger after the gate run — one row per route family, numbers from `npm run js-size` and the `lhci assert` output):**

```
| T13 | /portal-girisi, /en/portal-login (noindex) · /gizlilik, /kullanim-kosullari, /kvkk, /cerez-politikasi (+/en) · /abone-onay, /abonelikten-cik (+/en, noindex) | script gz: portal <n> B · legal <n> B · newsletter <n> B (ceiling 204,800; lazy line 194,560) | Lighthouse (indexable legal paths): perf <x.xx> / a11y 1.0 / bp 1.0 / seo 1.0; LCP <n> ms | pixel: n/a — not a D27 harness page (side-by-side review) | placeholders: legal-kvkk, legal-cookie-policy, legal-terms-tr (TR only) | HTML of `/` before/after: <n>/<n> B |
```

**Docs in this task:** `docs/SEO.md` (seven page rows + the robots sentence), `docs/ANALYTICS.md` (T13 instrumentation paragraph — no new events, no new params), `docs/CONTENT-MODEL.md` (the four sys namespaces), `docs/ARCHITECTURE.md` (§ Routing one-click rewrite; § Forms flow the named newsletter exception), `docs/INTEGRATIONS.md` (I12 rewritten with routes, paths, click-only rule, statuses), `docs/PRD.md` (§8 + rows 33/39/40), `docs/PRIVACY.md` (seeded-legal-copy counsel flags).

**Sys keys added (137):**
`sys.seo.portal.title`, `sys.seo.portal.description`, `sys.seo.privacy.title`, `sys.seo.privacy.description`, `sys.seo.terms.title`, `sys.seo.terms.description`, `sys.seo.kvkk.title`, `sys.seo.kvkk.description`, `sys.seo.cookiePolicy.title`, `sys.seo.cookiePolicy.description`, `sys.seo.newsletterConfirm.title`, `sys.seo.newsletterConfirm.description`, `sys.seo.newsletterUnsubscribe.title`, `sys.seo.newsletterUnsubscribe.description` (14);
`sys.portal.intro`, `sys.portal.signIn` (2);
`sys.legal.updatedLabel`, `sys.legal.contents`, `sys.legal.privacy.title`, `sys.legal.privacy.intro`, `sys.legal.privacy.updatedAt`, `sys.legal.privacy.sections.{dataController,scope,dataCategories,purposes,cookies,disclosures,transfers,retention,rights,security,verbis,children,thirdParty,changes,contact}.{title,body}` (30), `sys.legal.terms.title`, `sys.legal.terms.intro`, `sys.legal.terms.updatedAt`, `sys.legal.terms.englishOnlyNotice`, `sys.legal.terms.finalNote`, `sys.legal.terms.sections.{legalStatus,services,eligibility,accounts,candidateDuties,employerDuties,fees,ip,acceptableUse,dataProtection,thirdParty,availability,liability,indemnification,law,amendments}.{title,body}` (32), `sys.legal.kvkk.title`, `sys.legal.kvkk.intro`, `sys.legal.kvkk.updatedAt`, `sys.legal.kvkk.pendingTitle`, `sys.legal.kvkk.pendingBody`, `sys.legal.cookiePolicy.title`, `sys.legal.cookiePolicy.intro`, `sys.legal.cookiePolicy.updatedAt`, `sys.legal.cookiePolicy.pendingTitle`, `sys.legal.cookiePolicy.pendingBody`, `sys.legal.cookiePolicy.sections.{essential,consent,manage}.{title,body}` (6) — legal total 88;
`sys.newsletter.noToken.title`, `sys.newsletter.noToken.body`, `sys.newsletter.unavailable.title`, `sys.newsletter.unavailable.body`, `sys.newsletter.fallback.lead`, `sys.newsletter.fallback.email`, `sys.newsletter.fallback.whatsapp`, `sys.newsletter.fallback.subject`, `sys.newsletter.backHome`, `sys.newsletter.confirm.title`, `sys.newsletter.confirm.body`, `sys.newsletter.confirm.button`, `sys.newsletter.confirm.pending`, `sys.newsletter.confirm.outcome.CONFIRMED.title`, `sys.newsletter.confirm.outcome.CONFIRMED.body`, `sys.newsletter.confirm.outcome.ALREADY_CONFIRMED.title`, `sys.newsletter.confirm.outcome.ALREADY_CONFIRMED.body`, `sys.newsletter.confirm.invalid.title`, `sys.newsletter.confirm.invalid.body`, `sys.newsletter.confirm.expired.title`, `sys.newsletter.confirm.expired.body`, `sys.newsletter.unsubscribe.title`, `sys.newsletter.unsubscribe.body`, `sys.newsletter.unsubscribe.button`, `sys.newsletter.unsubscribe.pending`, `sys.newsletter.unsubscribe.outcome.UNSUBSCRIBED.title`, `sys.newsletter.unsubscribe.outcome.UNSUBSCRIBED.body`, `sys.newsletter.unsubscribe.outcome.ALREADY_UNSUBSCRIBED.title`, `sys.newsletter.unsubscribe.outcome.ALREADY_UNSUBSCRIBED.body`, `sys.newsletter.unsubscribe.outcome.UNKNOWN.title`, `sys.newsletter.unsubscribe.outcome.UNKNOWN.body`, `sys.newsletter.unsubscribe.invalid.title`, `sys.newsletter.unsubscribe.invalid.body` (33).

**Package ids used:** 33 — `crmlogin.001`, `crmlogin.002`, `crmlogin.005`, `crmlogin.011`, `crmlogin.012`, `crmlogin.013`, `crmlogin.014`, `crmlogin.019`, `crmlogin.020`, `crmlogin.021`, `crmlogin.022`, `crmlogin.023`, `crmlogin.030`, `crmlogin.043`, `crmlogin.044`, `crmlogin.045`, `crmlogin.046`, `crmlogin.047`, `crmlogin.048`, `crmlogin.049`, `crmlogin.050`, `crmlogin.051`, `crmlogin.052`, `crmlogin.054`, `crmlogin.055` (makeTf `{placed}`), `crmlogin.056`, `crmlogin.057` (makeTf `{replySlaHours}`), `crmlogin.058`, `crmlogin.059`, `crmlogin.060`, `crmlogin.061`, `crmlogin.062`, `home.016` — first `crmlogin.001`, last `home.016`; all 33 verified present in `src/content/local/catalogue.json` and both bundles. Deliberately unrendered (D22/W8/D17): `crmlogin.003` (multi-portal chooser copy), `.004`–`.010`, `.024`–`.029`, `.031`–`.042` (credential/reset/lockout/domain-detect UI), `.016` ("~10 min" reply claim), `.017`/`.018` (badge micro-copy — `StoreBadges` uses `hire.240`), `.053` (e-mail field label), `.063` ("iOS 15+" claim), `.064`–`.081` (Operations tile), `.082`–`.099` (ChatAdmire tile, incl. legal `.091`). `hire.240` is read by `StoreBadges`, not by the page. The legal pages and the newsletter pages use no package ids (the package has none for them: `strings/terms.json` is an 8-term glossary, not the Terms page).

**Foundation gaps:** (1) W8 says `/portal-girisi` is the site-wide "Portal" link target, but T0b's `bundle.nav` portal rows (`hamburger`, `slimBarRight`, `footerEmployers`, W36) point straight at `https://portal.jobsadmire.com/auth/login` — the page is reachable only by direct URL/deep link until a ruling changes the importer's row; this task does not edit `bundle.nav`. (2) No foundation piece handles a non-action `POST` to a page URL, which RFC 8058 requires on the unsubscribe *page* path — this task adds the method-aware rewrite to `proxy.ts` itself (`isOneClickUnsubscribe`), a foundation file. (3) `NextIntlClientProvider` inherits every message, so the ~17 KB-per-locale legal bodies ride in every page's RSC payload; a `messages` pick on the provider is a layout change (T15 candidate), noted in the ledger, not made here. (4) `FormShell`/`FallbackPanel`/`createFormAction` cannot express the token forward (no `formKey`, different door routes) — the page-local `NewsletterOutcome` + `forwardNewsletterToken` are the named exception (recorded in ARCHITECTURE § Forms flow); not a missing API, a scope boundary.
