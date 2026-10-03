### Task 3: Chrome foundation — route groups, nav groups, per-page CTAs, 901 px header, contact-click analytics + the W12/W26 event allowlist

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website` (branch `wp2/foundation`, on top of Task 1 + Task 2). Every path below is relative to that root. Line ranges cite `main @ ad58fb8`; Task 1 and Task 2 do not touch any file this task modifies except `docs/*` and `CLAUDE.md`, whose edits below are anchored on sentences (W45), never on line numbers.

**Preconditions (verify before Step 1 of Cycle 3):** Task 1 (T0b) has landed and `npm run content:import` has been re-run, so `src/content/local/bundle.{tr,en}.json` carry the five filled `nav` groups and the eight Phase A collections (W25 adds `countries`). Run `node -e 'const b=require("./src/content/local/bundle.tr.json");console.log([...new Set(b.nav.map(n=>n.group))], b.nav.filter(n=>n.external).length, (b.collections.blog??[]).length)'` — the output must list `desktopNav`, `hamburger`, `slimBarRight`, `footerEmployers`, `footerCompany`, then `3` (the portal-login row in `hamburger`, `slimBarRight` and `footerEmployers`), then `22`. If a group is empty, fix Task 1's `NAV_GROUPS` table in `scripts/import-design-package.ts` and re-import; never hard-code the list back into the chrome. `src/content/collections.ts` must export `BLOG_NAV_THRESHOLD`, `blogNavVisible`, `getCollection`, `CollectionSchemas` (Task 1's Produces).

**Rulings in force:** W4 (blog noindex + out of every chrome list behind the 6-Turkish-body threshold), W11 (901 px row, route groups, per-page CTAs, footer Privacy/Terms, nav groups filled by the importer), W12 (`call_click`/`whatsapp_click`/`email_click` with `placement`; page events only with enum-key params), W17 (`CTA_BY_PATHNAME` read through next-intl `usePathname()`, no context store), W19 (three route groups; locale layout keeps html/body/fonts/providers/ClientIslands/site-wide JSON-LD/`generateStaticParams`), W23/W54 (no invented package ids; composed labels in `sys.*`, `sys.nav.*` is an existing chrome namespace). **Reconcile rulings applied here:** W26 (the W12 page events join `track.ts` in this task; pages never extend the allowlist), W32 (`useContactClick` returns `(kind) => void` — canonical), W35 (one blog-threshold source: `nav.ts` re-exports Task 1's), W36 (the portal row lives in the nav groups only — no hard-coded portal anchors; Consumes describes Task 1's groups correctly), W37 (`noindexExternalPaths(locale)` is what Task 4's `robotsDisallowPaths` consumes; the e2e never asserts `Disallow: /blog`; `routes.test.ts` line 2 is a union Task 4 must keep), W39 (Task 5 keeps `sys.nav.legal` and `buttonClassName`), W41 (the dev gallery lives at `(site)/dev/gallery/` from here on), W45 (sentence-anchored docs on Task 1/2 text), W49 (cycle 1's proof run includes `e2e/smoke.spec.ts`), W52 (Footer test expects one link per entry while the accordion is collapsed). R46 (1101 px, WP1-only) is closed by W11. R6/R31 (404 inside the chrome, one `<main id="main">` owned by the chrome), R15 (one canonical package id per chrome string), R22 (tel:/mailto:/wa.me stay same-tab anchors), R26 (a root-layout restructure runs the smoke spec), R29/R30, R35 (analytics `page` = `next/navigation`'s `usePathname`), R47 (`prefetch={false}` on chrome links, islands out of the initial graph), R56 (no `design-package/**` or `src/content/local/*` imports from `src/**` except the exact-listed tests), R58 (`alternatePath`) all stay.

**Files:**

Create

- `src/app/[locale]/(site)/layout.tsx`
- `src/app/[locale]/(minimal)/layout.tsx`
- `src/app/[locale]/(minimal)/error.tsx`
- `src/app/[locale]/(minimal)/not-found.tsx`
- `src/app/[locale]/(bare)/layout.tsx`
- `src/analytics/useContactClick.ts`
- `src/analytics/ContactLink.tsx`
- `src/analytics/useContactClick.test.tsx`
- `src/design/chrome/nav.ts`
- `src/design/chrome/ctas.ts`
- `src/design/chrome/HeaderCtas.tsx`
- `src/design/chrome/__tests__/nav.test.ts`
- `src/design/chrome/__tests__/ctas.test.ts`
- `src/design/chrome/__tests__/SlimBar.test.tsx`
- `src/design/chrome/__tests__/ContactPlacements.test.tsx`
- `e2e/chrome.spec.ts`

Move (`git mv`, content unchanged unless listed under Modify)

- `src/app/[locale]/page.tsx` → `src/app/[locale]/(site)/page.tsx`
- `src/app/[locale]/hire-workers/` → `src/app/[locale]/(site)/hire-workers/`
- `src/app/[locale]/[...rest]/` → `src/app/[locale]/(site)/[...rest]/`
- `src/app/[locale]/dev/` → `src/app/[locale]/(site)/dev/` (W41 — Tasks 5 and 6 edit `(site)/dev/gallery/page.tsx`, never create a second one)
- `src/app/[locale]/not-found.tsx` → `src/app/[locale]/(site)/not-found.tsx`
- `src/app/[locale]/error.tsx` → `src/app/[locale]/(site)/error.tsx`
- `src/app/[locale]/thank-you/` → `src/app/[locale]/(minimal)/thank-you/`

Modify

- `src/app/[locale]/layout.tsx` — lines 8–9 (imports) and 55–65 (the `SiteChrome` wrap)
- `src/analytics/track.ts` — whole file (lines 1–33): `PARAM_ENUMS` + five W26 events + the enum-value drop
- `src/analytics/track.test.ts` — append two `it`s
- `src/design/chrome/SiteChrome.tsx` — line 31
- `src/design/chrome/Header.tsx` — whole file (lines 1–97)
- `src/design/chrome/SlimBar.tsx` — whole file (lines 1–71)
- `src/design/chrome/Footer.tsx` — whole file (lines 1–200)
- `src/design/chrome/MobileNav.tsx` — line 29
- `src/design/chrome/MobileBottomBar.tsx` — whole file (lines 1–41)
- `src/design/chrome/SocialRail.tsx` — lines 1–3 (imports) and 58–78 (the `SocialRail` component)
- `src/design/chrome/WhatsAppFab.tsx` — whole file (lines 1–22)
- `src/design/primitives/Button.tsx` — lines 16–50 (`SIZE`, `BASE`, `ButtonProps`, the `Button` head — extract `buttonClassName`)
- `src/design/primitives/index.ts` — line 2
- `src/lib/seo/routes.ts` — whole file (lines 1–42)
- `src/app/robots.ts` — whole file (lines 1–28)
- `src/app/globals.css` — lines 58–68 (`@theme inline`), 71–82 (`:root`), 83–96 (`@media (min-width: 1101px)`) + a new `901px` block between them
- `src/design/tokens.ts` — lines 47–56 (`type`) and 63 (`layout`)
- `src/design/tokens.test.ts` — lines 36–38
- `src/messages/tr.json` lines 9–12 and `src/messages/en.json` lines 9–12 (the `sys.nav` block)
- `src/app/[locale]/(site)/dev/gallery/page.tsx` — line 207 (after the move)
- `src/design/chrome/__tests__/Header.test.tsx` — whole file
- `src/design/chrome/__tests__/Footer.test.tsx` — whole file
- `src/lib/seo/routes.test.ts` — line 2 (imports) + append one `it`
- `eslint.config.mjs` — lines 31–42 (the exact exemption list gains `SlimBar.test.tsx`)
- `e2e/width-sweep.spec.ts` — line 9
- `e2e/seo.spec.ts` — lines 30–38 (the sitemap case only; the robots case is untouched, W37)
- `docs/ARCHITECTURE.md`, `docs/CONTENT-MODEL.md`, `docs/ANALYTICS.md`, `docs/SEO.md`, `docs/PRD.md`, `CLAUDE.md` (sentences listed under **Docs in this task**)

Test

- `src/analytics/useContactClick.test.tsx` (new), `src/analytics/track.test.ts` (extended)
- `src/design/chrome/__tests__/nav.test.ts`, `ctas.test.ts`, `SlimBar.test.tsx`, `ContactPlacements.test.tsx` (new)
- `src/design/chrome/__tests__/Header.test.tsx`, `Footer.test.tsx` (rewritten)
- `src/design/tokens.test.ts`, `src/lib/seo/routes.test.ts` (extended)
- `e2e/chrome.spec.ts` (new), `e2e/width-sweep.spec.ts`, `e2e/seo.spec.ts` (extended)

**Interfaces:**

Consumes (as they exist on `main @ ad58fb8` unless marked T0b)

- `getBundle(locale)` from `@/content/adapter` (server-only, React `cache()`-wrapped — a group layout calling it after the locale layout gets the same object). `makeT(bundle)` from `@/content/pure` (client-safe; throws on an unknown id outside production).
- `Bundle`, `NavItem`, `Settings`, `BundleSchema` from `contract/website-bundle.v1` — `NavItem = { group, order, labelId, href, external, visibleOn }`, `group` enum `slimBarLeft | slimBarRight | desktopNav | hamburger | footerEmployers | footerCompany | footerContact | mobileBottomBar | socialRail`; `href` is the internal pathname key or, with `external: true`, an absolute URL. The contract file is frozen and hash-pinned — nothing here touches it.
- **T0b (Task 1) — `bundle.nav`, filled by the importer's `NAV_GROUPS` table (verified against `scripts/import-design-package.ts` in Task 1's draft; W36):** `desktopNav` = the README order `/hire-workers, /available-workers, /work-permit, /hiring-cost-calculator, /about, /success-stories, (/blog), /verify, /partner-with-us, /careers, /contact` (10 rows; 11 once `/blog` clears the threshold); `hamburger` = `desktopNav` + the portal login (`https://portal.jobsadmire.com/auth/login`, `labelId: 'home.012'`, `external: true`); `slimBarRight` = `(/blog), /careers, /verify, portal`; `footerEmployers` = `/hire-workers, /available-workers, /hiring-cost-calculator, /work-permit, /verify, portal`; `footerCompany` = `/about, /success-stories, (/blog), /partner-with-us, /careers, /contact`. `slimBarLeft`, `footerContact`, `mobileBottomBar`, `socialRail` are declared **empty** (settings-driven, R15) — the chrome never reads them. Rows flagged blog are emitted **only** when the importer's own `blogNavVisible` is true, so today no group carries `/blog`; `navGroup()`'s filter (below) is the second door for an OPS bundle and for the day the threshold flips. The chrome never asserts on a label id.
- **T0b (Task 1) — `src/content/collections.ts`** (client-safe): `export const BLOG_NAV_THRESHOLD = 6; export function blogNavVisible(bundle: Bundle): boolean;` (counts `getCollection(bundle, 'blog')` rows with `hasBody.tr`; `getCollection` throws `CollectionError` on a schema miss outside production, returns `[]` in production), `export const CollectionSchemas: { …, blog: BlogPostSchema }`, `export type BlogPost = { key; slug: {tr: string|null; en: string|null}; title: {tr; en}; excerpt: {tr; en}; category: 'workPermits'|'recruitment'|'compliance'|'marketNews'; categoryLabelId; author; publishedAt: 'YYYY-MM-DD'; readMinutes: number; hasBody: {tr: boolean; en: boolean}; body: {tr: string|null; en: string|null} (W28) }`. This task re-exports the first two (W35) and builds test rows of exactly that shape.
- `pathnames`, `routing`, `Locale`, `locales` from `@/i18n/routing`; `Link`, `usePathname`, `getPathname`, `Href` from `@/i18n/navigation` (next-intl 4.14.5 typed navigation — verified in `node_modules/next-intl/dist/types/navigation/shared/createSharedNavigationFns.d.ts`: for a static key the `Link` href is `T | ({ pathname: T } & Omit<UrlObject, 'pathname'>)`, so `{ pathname: '/contact', hash: '#message' }` is a valid `Href` and `Link` renders `/iletisim#message`; `usePathname()` returns the **internal key** — `getRoute()` maps `/iletisim` → `/contact` and `/blog/x` → `/blog/[slug]` — and `null` outside the App Router).
- `track(event, params)` + `ALLOWED_PARAMS` from `@/analytics/track` (this task extends both; `call_click`/`whatsapp_click`/`email_click` → `page`, `locale`, `placement` are already allow-listed). Task 2's `FallbackPanel` fires `whatsapp_click`/`call_click`/`email_click` with `placement: 'form_fallback'` through `track()` directly — that value is in the enum below, so nothing in Task 2 changes.
- `waLink`, `telLink`, `mailLink` from `@/lib/contact`; `Accordion`, `Button`, `SkipLink` from `@/design/primitives`; `NavLink`/`ChromeNavItem`, `LanguageSwitcher`, `MobileNav`, `CookiePreferencesButton`, `icons`, `socialLinks` from `src/design/chrome/*`; `renderWithIntl` from `@/test/render` (wraps in `NextIntlClientProvider` with the real `sys.*` messages, default locale `tr`); `sys.*` via `useTranslations('sys')` / `getTranslations('sys')`.

Produces (frozen for Task 4/5/6/7 and every WP2b page — copy exactly)

```ts
// Route groups (W19) — src/app/[locale]/
//   (site)/layout.tsx     → <SiteChrome variant="default">; holds page.tsx, hire-workers/, [...rest]/, dev/gallery/, not-found.tsx, error.tsx
//                            and, in WP2b, every public page + careers/[slug] + blog/[slug]
//   (minimal)/layout.tsx  → <SiteChrome variant="minimal">; holds thank-you/ and, in WP2b, privacy/ terms/ kvkk/ cookie-policy/ newsletter/*
//                            (its own error.tsx / not-found.tsx re-render the (site) views inside the minimal chrome)
//   (bare)/layout.tsx     → no chrome, renders only <main id="main">{children}</main>; holds portal-login/ (T13)
//   The locale layout keeps html/body, Archivo, GtmLoader, site-wide JSON-LD, NextIntlClientProvider, ClientIslands, generateStaticParams.
//   A page's own `notFound()`/throw lands in its group's not-found/error boundary, so the chrome survives (R6 kept).
//   The dev gallery is src/app/[locale]/(site)/dev/gallery/page.tsx (W41): contract import from a demo file there is
//   '../../../../../../contract/website-bundle.v1' (six levels).

// src/analytics/track.ts — additive (W12/W26)
export const PARAM_ENUMS = {
  placement: ['slimbar', 'header', 'footer', 'social_rail', 'whatsapp_fab', 'bottom_bar', 'form_fallback', 'page_cta', 'office_card'],
  track: ['sourcing', 'institute'],                       // partner_track_select (W16 enum)
  topic: ['hire', 'partner', 'permit', 'job', 'other'],   // contact_topic (T0f enum)
  result: ['eligible', 'conditional', 'ineligible'],      // eligibility_check_complete (the wizard maps its outcomes onto these three)
  outcome: ['verified', 'not_found', 'register_unavailable'], // verify_lookup (W6: Phase A always 'register_unavailable')
} as const;
export type EnumParam = keyof typeof PARAM_ENUMS;
export const ALLOWED_PARAMS = { …the seven WP1 events unchanged…,
  partner_track_select: ['page', 'locale', 'track'], contact_topic: ['page', 'locale', 'topic'],
  eligibility_check_complete: ['page', 'locale', 'result'], career_apply_start: ['page', 'locale', 'slug'],
  verify_lookup: ['page', 'locale', 'outcome'] } as const;   // `slug` = the opening's public URL segment, never a visitor identifier
// track(): a value under an enum-keyed param that is not in its set is DROPPED before the push (free text can never ride).
// Pages never add events or params; a new event is a ruling + an edit here + docs/ANALYTICS.md in the same change.

// src/analytics/useContactClick.ts (no directive; imported by client components only)
export const CONTACT_PLACEMENTS = PARAM_ENUMS.placement;                 // same tuple, re-exported for the chrome/blocks
export type ContactPlacement = (typeof CONTACT_PLACEMENTS)[number];
export type ContactKind = 'call' | 'whatsapp' | 'email';
export function contactKindOf(href: string): ContactKind | null;        // tel: → call, mailto: → email, https://wa.me/ | https://api.whatsapp.com/ → whatsapp, else null
export function useContactClick(placement: ContactPlacement): (kind: ContactKind) => void; // track('<kind>_click', { page (next/navigation usePathname ?? '/', R35), locale (useLocale), placement })
//   W32 — canonical shape. A Button-style caller does: const fire = useContactClick(p); const kind = contactKindOf(href); onClick={kind ? () => fire(kind) : undefined}

// src/analytics/ContactLink.tsx ('use client') — the one anchor every tel:/mailto:/wa.me link in the chrome (and, in WP2b, pages/OfficeCard/FallbackPanel) renders through
export function ContactLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & { href: string; placement: ContactPlacement; children: ReactNode }): JSX.Element;
//   same-tab by default (R22); callers pass target/rel for wa.me; a non-contact href renders a plain anchor with no handler

// src/design/chrome/nav.ts (server-safe)
export { BLOG_NAV_THRESHOLD, blogNavVisible } from '@/content/collections';   // W35: re-exports, not copies
export function navGroup(bundle: Bundle, group: NavItem['group'], t: (id: string) => string): ChromeNavItem[];
//   rows of one group sorted by `order`, labels through t(), `external` passed through; '/blog' and '/blog/[slug]' dropped while !blogNavVisible(bundle)

// src/design/chrome/ctas.ts (server-safe, no directive)
export type CtaVariant = 'primary' | 'danger';
export type CtaLink = { labelId: string; tailId?: string; href: Href; variant?: CtaVariant };
export type PageCtas = { primary: CtaLink; secondary?: CtaLink | null }; // undefined → DEFAULT secondary, null → none
export const DEFAULT_CTAS: PageCtas;                                     // home.014+home.015 → {pathname:'/hire-workers', hash:'#request-form'}; home.008 → '/partner-with-us'
export const CTA_BY_PATHNAME: Partial<Record<keyof typeof pathnames, PageCtas>>;
//   '/'                        home.014+home.015 → {'/',                      '#proposal'}      secondary default
//   '/hiring-cost-calculator'  calc.324           → {'/hiring-cost-calculator','#calculator'}    secondary home.002 → '/hire-workers'
//   '/partner-with-us'         partner.017+018    → {'/partner-with-us',       '#tracks'}        secondary home.002 → '/hire-workers'
//   '/work-permit'             wp.016+017         → {'/work-permit',           '#permit-cta'}    secondary default
//   '/contact'                 contact.015+016    → {'/contact',               '#message'}       secondary home.002 → '/hire-workers'
//   '/verify'                  verify.015+016     → {'/verify',                '#report'}, variant 'danger'; secondary home.002 → '/hire-workers'
//   '/available-workers'       availworkers.016 + home.003 → {'/available-workers', '#pool'}     secondary default
//   (every other key, incl. '/hire-workers', '/careers/[slug]', '/blog/[slug]' → DEFAULT_CTAS)
//   CONTRACT FOR WP2b PAGE TASKS: the page owning a key must render the element id its entry names
//   (`proposal`, `request-form`, `calculator`, `tracks`, `permit-cta`, `message`, `report`, `pool`), or edit its entry here in the same task.
export type ResolvedCta = { label: string; tail?: string; href: Href; variant: CtaVariant };
export type ResolvedPageCtas = { primary: ResolvedCta; secondary?: ResolvedCta };
export type CtaTable = { defaults: ResolvedPageCtas; byPathname: Partial<Record<keyof typeof pathnames, ResolvedPageCtas>> };
export function resolveCtas(t: (id: string) => string): CtaTable;      // Header (server) calls it; labels resolved once
export function ctasFor(table: CtaTable, pathname: string | null): ResolvedPageCtas; // pure; null/unknown → defaults

// src/design/chrome/HeaderCtas.tsx ('use client')
export function HeaderCtas({ table }: { table: CtaTable }): JSX.Element;   // usePathname() from @/i18n/navigation (internal key, SSR-consistent)

// src/design/chrome/Header.tsx — signature change
export function Header({ locale, bundle }: { locale: Locale; bundle: Bundle }): JSX.Element; // `primaryCta` prop and `ChromeCta` type REMOVED (W17)
//   desktop row = navGroup(bundle,'desktopNav') minus the four promoted routes (/blog, /careers, /verify, /partner-with-us); hamburger = navGroup(bundle,'hamburger')
// SiteChrome({ locale, bundle, variant?, children }) unchanged. SlimBar/Footer render slimBarRight / footerEmployers+footerCompany
//   through navGroup() — the portal login is the groups' `external` row (W36); no chrome file hard-codes a route list except the footer legal pair.

// src/lib/seo/routes.ts
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>;   // exported (was local to sitemap.ts) — Task 4's type guards use it (W37)
export const NOINDEX_PATHNAMES = ['/thank-you', '/portal-login', '/newsletter/confirm', '/newsletter/unsubscribe', '/blog', '/blog/[slug]'] as const;
//   typed `satisfies readonly (keyof typeof pathnames)[]` — NOT `readonly Href[]` any more: '/blog/[slug]' is not a bare Href, so never pass this set to getPathname/absoluteUrl directly (W37)
export function isNoindexPathname(href: keyof typeof pathnames): boolean;
export function noindexExternalPaths(locale: Locale): string[];         // localized, deduped; a dynamic key is covered by its parent ('/blog/[slug]' → '/blog')
//   robots.ts consumes this in this task; Task 4 adds `UNBUILT_PATHNAMES`, `robotsDisallowPaths(locale)` (= this minus UNBUILT), `OG_PAGE_KEYS`, `pageOgImageUrl` below it and re-points robots.ts at robotsDisallowPaths — additive, no rename.
//   sitemap.ts's `EXCLUDED = new Set<string>(NOINDEX_PATHNAMES)` keeps working unchanged.

// src/design/primitives/Button.tsx — additive
export function buttonClassName(variant: ButtonVariant, size?: 'md' | 'lg', className?: string): string; // the exact class string <Button> renders; for callers that must render next-intl <Link> with an object href
// src/design/primitives/index.ts line 2: export { Button, buttonClassName, type ButtonProps, type ButtonVariant } from './Button';  (W39: Task 5 edits the barrel additively)

// src/design/tokens.ts — additive
tokens.type.nav = { mobile: 13.5, tablet: 12, desktop: 11 };            // header links: authored / from 901 px (W11) / from 1101 px
tokens.layout.headerRowFrom = 901; tokens.layout.socialRailFrom = 1101;  // = breakpoint.lg / breakpoint.xl
// globals.css: `--fs-nav` (13.5px, 12px ≥901, 11px ≥1101) exposed as the `text-nav` utility via `@theme inline { --text-nav: var(--fs-nav) }`

// src/messages/{tr,en}.json — additive: sys.nav.legal ("Yasal" / "Legal") — aria-label of the footer's Privacy/Terms nav. W39: Task 5's sys.nav block is { main, close, legal, breadcrumbs }.

// e2e/chrome.spec.ts — four cases (chrome variants, 404 inside chrome, 901/900 threshold + no overflow at 901/1000/1100, the CTA follows the page); width sweep gains 901.
// src/lib/seo/routes.test.ts line 2 after this task: import { absoluteUrl, localeAlternates, NOINDEX_PATHNAMES, noindexExternalPaths } from './routes';
//   Task 4 EXTENDS that line to the union (+ OG_PAGE_KEYS, pageOgImageUrl, UNBUILT_PATHNAMES, robotsDisallowPaths) — never replaces it (W37).
```

---

#### Cycle 1 — Route groups (W19): `(site)` / `(minimal)` / `(bare)`, chrome leaves the locale layout

- [ ] **Step 1: Write the failing test** — `e2e/chrome.spec.ts` (Playwright; needs a built server — see Step 2).

```ts
import { test, expect } from '@playwright/test';

// W19: three route groups, one chrome each. `page.locator` counts DOM nodes, so the fixed
// social rail (display:none below xl) counts under both Playwright projects; `getByRole`
// would skip it on the mobile project.
const RAIL_OR_FOOTER_INSTAGRAM = 'a[aria-label="Instagram"]';
const WHATSAPP_FAB = 'a.fixed[href^="https://wa.me/"]';

test('the default chrome carries the social rail and FAB; the minimal chrome does not', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  // rail + footer social row
  expect(await page.locator(RAIL_OR_FOOTER_INSTAGRAM).count()).toBe(2);
  expect(await page.locator(WHATSAPP_FAB).count()).toBe(1);

  await page.goto('/tesekkurler?form=hire');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  // footer only — no rail, no FAB on the conversion page
  expect(await page.locator(RAIL_OR_FOOTER_INSTAGRAM).count()).toBe(1);
  expect(await page.locator(WHATSAPP_FAB).count()).toBe(0);
});

test('an unmatched URL 404s inside the site chrome (R6 survives the route groups)', async ({
  page,
}) => {
  const res = await page.goto('/boyle-bir-sayfa-yok');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Sayfa bulunamadı');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run build && (PORT=3000 npm run start &) && sleep 4
npx playwright test e2e/chrome.spec.ts --project=desktop
```

Expected: `the default chrome carries the social rail and FAB; the minimal chrome does not` FAILS at `expect(await page.locator(RAIL_OR_FOOTER_INSTAGRAM).count()).toBe(1)` — received `2` (the locale layout mounts the default chrome on `/tesekkurler`, rail included). The 404 case passes today and must still pass after the move (that is what it guards).

- [ ] **Step 3: Implement**

Move the routes (paths contain brackets and parentheses — quote them):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website
mkdir -p "src/app/[locale]/(site)" "src/app/[locale]/(minimal)" "src/app/[locale]/(bare)"
git mv "src/app/[locale]/page.tsx"        "src/app/[locale]/(site)/page.tsx"
git mv "src/app/[locale]/hire-workers"    "src/app/[locale]/(site)/hire-workers"
git mv "src/app/[locale]/[...rest]"       "src/app/[locale]/(site)/[...rest]"
git mv "src/app/[locale]/dev"             "src/app/[locale]/(site)/dev"
git mv "src/app/[locale]/not-found.tsx"   "src/app/[locale]/(site)/not-found.tsx"
git mv "src/app/[locale]/error.tsx"       "src/app/[locale]/(site)/error.tsx"
git mv "src/app/[locale]/thank-you"       "src/app/[locale]/(minimal)/thank-you"
```

(Verified: the moved files import only `@/` aliases, `next*` packages or a sibling — `dev/gallery/page.tsx` imports `./DialogDemo`, which moves with it — so nothing inside them changes. `not-found.tsx`/`error.tsx` move _with_ the pages: a boundary renders inside the layout of the segment it lives in, so left at `[locale]/` they would replace the `(site)` layout — chrome and all — on every 404 and error.)

`src/app/[locale]/(site)/layout.tsx` (new):

```tsx
import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { SiteChrome } from '@/design/chrome/SiteChrome';
import { routing } from '@/i18n/routing';

/** W19: the default chrome — every public page, careers/blog detail and the `[...rest]` 404.
 *  `(minimal)` drops the social rail and the WhatsApp FAB; `(bare)` mounts no chrome at all.
 *  Group layouts only mount the chrome: html/body, fonts, providers, the client islands, the
 *  site-wide JSON-LD and `generateStaticParams` stay on the locale layout above. */
export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // `getBundle` is React `cache()`-wrapped: the locale layout resolved this bundle already,
  // so this is the same object, not a second load.
  const bundle = await getBundle(locale);
  return (
    <SiteChrome locale={locale} bundle={bundle} variant="default">
      {children}
    </SiteChrome>
  );
}
```

`src/app/[locale]/(minimal)/layout.tsx` (new):

```tsx
import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { SiteChrome } from '@/design/chrome/SiteChrome';
import { routing } from '@/i18n/routing';

/** W19: `SiteChrome variant="minimal"` — pages that must not compete with their own single
 *  action: the conversion page, the four legal pages and the two newsletter one-shots. No
 *  social rail, no WhatsApp FAB; slim bar, header, footer and mobile bar stay. */
export default async function MinimalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  return (
    <SiteChrome locale={locale} bundle={bundle} variant="minimal">
      {children}
    </SiteChrome>
  );
}
```

`src/app/[locale]/(minimal)/error.tsx` (new — Next requires the boundary file itself to be a client module; it renders the `(site)` boundary's view so the copy lives once):

```tsx
'use client';
import SiteError from '../(site)/error';

/** Same view as the `(site)` boundary, mounted inside the minimal chrome. */
export default function MinimalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SiteError {...props} />;
}
```

`src/app/[locale]/(minimal)/not-found.tsx` (new):

```tsx
/** R6 inside the minimal chrome: a `notFound()` from a legal/newsletter page still renders
 *  the localized 404 with a header and footer around it. */
export { default } from '../(site)/not-found';
```

`src/app/[locale]/(bare)/layout.tsx` (new):

```tsx
import type { ReactNode } from 'react';

/** W19: no chrome — the portal entry page (T13) only. `<main id="main">` is still owned by the
 *  layout, not the page (R31: one skip-link target per document, never one per page that has
 *  to remember to add it); the group holds no page until T13 lands. */
export default function BareLayout({ children }: { children: ReactNode }) {
  return <main id="main">{children}</main>;
}
```

`src/app/[locale]/layout.tsx` — full file after the change (line 9's `SiteChrome` import goes; the wrap at lines 59–61 becomes `{children}`; everything else is byte-identical to main):

```tsx
import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { GtmLoader } from '@/analytics/GtmLoader';
import { getBundle, makeT } from '@/content/adapter';
import { ClientIslands } from '@/design/chrome/ClientIslands';
import { routing } from '@/i18n/routing';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/seo/routes';
import '../globals.css';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-archivo',
});

/** Per-page title/description/alternates come from `buildMetadata`; this only anchors the
 *  origin every relative metadata URL resolves against. */
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: 'JobsAdmire' };

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
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  const { analytics } = bundle.settings;
  return (
    <html lang={locale} className={archivo.variable}>
      <body>
        {/* D13: consent defaults denied inline, before any tag; GA4/Ads load only inside the
            container. Off entirely when the bundle turns consent mode off. */}
        {analytics.consentMode && <GtmLoader gtmId={analytics.gtmId} />}
        {/* Site-wide graph nodes (docs/SEO.md): Organization/EmploymentAgency on every page. */}
        <JsonLd
          data={organizationJsonLd(bundle.settings, {
            name: 'JobsAdmire',
            description: t('home.188'),
          })}
        />
        <JsonLd data={websiteJsonLd(bundle.settings)} />
        <NextIntlClientProvider>
          {/* W19: the chrome is mounted by the route-group layouts — `(site)` default,
              `(minimal)` without rail/FAB, `(bare)` none — so `children` here is a group
              layout, never a page. */}
          {children}
          {/* Both islands load as their own chunks after hydration (`ssr: false`), so neither
              is in the initial script graph. R38 is unchanged and now also decides whether the
              consent chunk is fetched at all: no container id means no tag can fire, so there
              is nothing to consent to — asking anyway would be a dark pattern. Mounted after
              the chrome so the sheet is last in the tab order, not first. */}
          <ClientIslands
            locale={locale}
            consent={analytics.consentMode && Boolean(analytics.gtmId)}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run the tests + `npm run verify`** (W49/R26: a root-layout restructure runs the smoke spec too)

```bash
npm run verify
npm run build && (PORT=3000 npm run start &) && sleep 4
npx playwright test e2e/smoke.spec.ts e2e/chrome.spec.ts e2e/routing.spec.ts e2e/thank-you.spec.ts e2e/seo.spec.ts
```

Expected: `verify` green (typecheck/lint/format/vitest unchanged by a move — the only new TS is three layouts and two thin boundaries); the build output still lists `ƒ Proxy (Middleware)` and the same routes (`/[locale]`, `/[locale]/hire-workers`, `/[locale]/thank-you`, `/[locale]/[...rest]`, `/[locale]/dev/gallery` — route groups do not appear in URLs); all five specs green under both projects, including the two `chrome.spec.ts` cases.

- [ ] **Step 5: Commit**

```bash
git add -A "src/app/[locale]" e2e/chrome.spec.ts
git commit -m "feat(chrome): route groups (site)/(minimal)/(bare) mount the chrome per W19

The locale layout keeps html/body, fonts, providers, ClientIslands, site-wide JSON-LD and
generateStaticParams; SiteChrome moves to the group layouts. page.tsx, hire-workers/,
[...rest]/, dev/ and the 404/error boundaries move into (site), thank-you/ into (minimal),
(bare) holds the future portal entry. e2e/chrome.spec.ts proves the minimal variant and the
in-chrome 404.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `useContactClick` + `ContactLink` (W12) and the W26 event allowlist

- [ ] **Step 1: Write the failing tests**

`src/analytics/track.test.ts` — append inside the `describe` (after the `rejects unknown events` case; the import on line 2 becomes `import { ALLOWED_PARAMS, PARAM_ENUMS, track } from './track';`):

```ts
it('declares the W12 page events once, enum-keyed (W26) — pages never extend the allowlist', () => {
  expect(Object.keys(ALLOWED_PARAMS)).toEqual([
    'generate_lead',
    'conversion',
    'call_click',
    'whatsapp_click',
    'email_click',
    'calculator_use',
    'language_switch',
    'partner_track_select',
    'contact_topic',
    'eligibility_check_complete',
    'career_apply_start',
    'verify_lookup',
  ]);
  expect(ALLOWED_PARAMS.partner_track_select).toEqual(['page', 'locale', 'track']);
  expect(ALLOWED_PARAMS.contact_topic).toEqual(['page', 'locale', 'topic']);
  expect(ALLOWED_PARAMS.eligibility_check_complete).toEqual(['page', 'locale', 'result']);
  expect(ALLOWED_PARAMS.career_apply_start).toEqual(['page', 'locale', 'slug']);
  expect(ALLOWED_PARAMS.verify_lookup).toEqual(['page', 'locale', 'outcome']);
  expect(PARAM_ENUMS).toEqual({
    placement: [
      'slimbar',
      'header',
      'footer',
      'social_rail',
      'whatsapp_fab',
      'bottom_bar',
      'form_fallback',
      'page_cta',
      'office_card',
    ],
    track: ['sourcing', 'institute'],
    topic: ['hire', 'partner', 'permit', 'job', 'other'],
    result: ['eligible', 'conditional', 'ineligible'],
    outcome: ['verified', 'not_found', 'register_unavailable'],
  });
});
it('drops an enum-keyed value outside its set — free text can never ride under topic/placement', () => {
  track('contact_topic', { page: '/iletisim', locale: 'tr', topic: 'hire' });
  track('contact_topic', { page: '/iletisim', locale: 'tr', topic: 'Ahmet Yılmaz, +90 5…' });
  track('call_click', { page: '/', locale: 'tr', placement: 'hero-banner' });
  track('verify_lookup', {
    page: '/temsilci-dogrulama',
    locale: 'tr',
    outcome: 'register_unavailable',
  });
  expect((window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer).toEqual([
    { event: 'contact_topic', page: '/iletisim', locale: 'tr', topic: 'hire' },
    { event: 'contact_topic', page: '/iletisim', locale: 'tr' },
    { event: 'call_click', page: '/', locale: 'tr' },
    {
      event: 'verify_lookup',
      page: '/temsilci-dogrulama',
      locale: 'tr',
      outcome: 'register_unavailable',
    },
  ]);
});
```

`src/analytics/useContactClick.test.tsx` (new):

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContactLink } from './ContactLink';
import { PARAM_ENUMS } from './track';
import { CONTACT_PLACEMENTS, contactKindOf } from './useContactClick';
import { renderWithIntl } from '@/test/render';

type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

// jsdom has no navigation; a native listener swallows the default action while React's own
// handler (registered on the root) still runs.
async function click(name: string) {
  const link = screen.getByRole('link', { name });
  link.addEventListener('click', (e) => e.preventDefault());
  await userEvent.click(link);
}

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('contactKindOf', () => {
  it('classifies the three contact schemes and nothing else', () => {
    expect(contactKindOf('tel:+905011240340')).toBe('call');
    expect(contactKindOf('mailto:info@jobsadmire.com?subject=x')).toBe('email');
    expect(contactKindOf('https://wa.me/905011240340?text=Merhaba')).toBe('whatsapp');
    expect(contactKindOf('https://api.whatsapp.com/send?phone=905011240340')).toBe('whatsapp');
    expect(contactKindOf('https://www.instagram.com/jobsadmire')).toBeNull();
    expect(contactKindOf('/iletisim')).toBeNull();
  });
});

describe('ContactLink (W12)', () => {
  it('fires call_click with the placement and the real pathname, nothing else', async () => {
    renderWithIntl(
      <ContactLink href="tel:+905011240340" placement="slimbar">
        Ara
      </ContactLink>,
    );
    await click('Ara');
    // `page` is next/navigation's usePathname (R35) — null outside the App Router → '/'.
    expect(pushed()).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'slimbar' },
    ]);
  });

  it('maps wa.me to whatsapp_click and mailto: to email_click, keeping the anchor attributes', async () => {
    renderWithIntl(
      <>
        <ContactLink
          href="https://wa.me/905011240340?text=Merhaba"
          placement="whatsapp_fab"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <span aria-hidden="true">icon</span>
        </ContactLink>
        <ContactLink href="mailto:info@jobsadmire.com" placement="footer">
          info@jobsadmire.com
        </ContactLink>
      </>,
      { locale: 'en' },
    );
    const wa = screen.getByRole('link', { name: 'WhatsApp' });
    expect(wa).toHaveAttribute('target', '_blank');
    expect(wa).toHaveAttribute('rel', 'noopener noreferrer');
    await click('WhatsApp');
    await click('info@jobsadmire.com');
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'en', placement: 'whatsapp_fab' },
      { event: 'email_click', page: '/', locale: 'en', placement: 'footer' },
    ]);
  });

  it('renders a plain anchor and fires nothing for a non-contact href', async () => {
    renderWithIntl(
      <ContactLink href="https://www.instagram.com/jobsadmire" placement="social_rail">
        Instagram
      </ContactLink>,
    );
    await click('Instagram');
    expect(pushed()).toEqual([]);
  });

  it('exposes the closed placement enum — the same tuple track() enforces (never free text)', () => {
    expect(CONTACT_PLACEMENTS).toBe(PARAM_ENUMS.placement);
    expect(CONTACT_PLACEMENTS).toEqual([
      'slimbar',
      'header',
      'footer',
      'social_rail',
      'whatsapp_fab',
      'bottom_bar',
      'form_fallback',
      'page_cta',
      'office_card',
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/analytics
```

Expected: `useContactClick.test.tsx` fails to load — `Error: Failed to resolve import "./ContactLink"` (neither module exists yet); `track.test.ts` — the W26 case fails on `Object.keys(ALLOWED_PARAMS)` (seven keys, not twelve) and the enum case throws `unknown analytics event: contact_topic`.

- [ ] **Step 3: Implement**

`src/analytics/track.ts` — full file:

```ts
/** W12/W26: the closed value sets for the params that would otherwise be free text. `track()`
 *  drops a value outside its set, so no page can push a typed-in string under `topic` or a
 *  made-up `placement`; pages type their values as `(typeof PARAM_ENUMS)[K][number]`. */
export const PARAM_ENUMS = {
  placement: [
    'slimbar',
    'header',
    'footer',
    'social_rail',
    'whatsapp_fab',
    'bottom_bar',
    'form_fallback',
    'page_cta',
    'office_card',
  ],
  // partner_track_select — the two Partner tracks the door accepts (W16)
  track: ['sourcing', 'institute'],
  // contact_topic — the Contact page's topic select (T0f enum)
  topic: ['hire', 'partner', 'permit', 'job', 'other'],
  // eligibility_check_complete — the Work Permit wizard maps its outcomes onto these buckets
  result: ['eligible', 'conditional', 'ineligible'],
  // verify_lookup — W6: the public register is not published in Phase A, so 'register_unavailable'
  outcome: ['verified', 'not_found', 'register_unavailable'],
} as const;
export type EnumParam = keyof typeof PARAM_ENUMS;

/** D13: every event carries an explicit parameter allowlist. Anything not listed here — a
 *  candidate reference, a typed-in name, any free text from a form — is dropped before the
 *  push, so no caller can leak an identifier into GTM by passing the wrong object. */
export const ALLOWED_PARAMS = {
  generate_lead: ['form_key', 'page', 'locale'],
  conversion: ['form_key', 'page', 'locale'],
  call_click: ['page', 'locale', 'placement'],
  whatsapp_click: ['page', 'locale', 'placement'],
  email_click: ['page', 'locale', 'placement'],
  calculator_use: ['page', 'locale', 'role', 'headcount'],
  language_switch: ['from', 'to'],
  // W26: the page events, declared once and enum-keyed (W12). Pages never extend this list —
  // a new event is a ruling, an edit here and docs/ANALYTICS.md in the same change. `slug` is
  // the opening's public URL segment (/kariyer/[slug]), never anything a visitor typed.
  partner_track_select: ['page', 'locale', 'track'],
  contact_topic: ['page', 'locale', 'topic'],
  eligibility_check_complete: ['page', 'locale', 'result'],
  career_apply_start: ['page', 'locale', 'slug'],
  verify_lookup: ['page', 'locale', 'outcome'],
} as const;
export type EventName = keyof typeof ALLOWED_PARAMS;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, params: Partial<Record<string, string | number>>) {
  // `hasOwn`, not truthiness: an inherited `toString`/`constructor` must not pass for an event.
  if (!Object.hasOwn(ALLOWED_PARAMS, event))
    throw new Error(`unknown analytics event: ${String(event)}`);
  const clean: Record<string, unknown> = { event };
  for (const k of ALLOWED_PARAMS[event]) {
    // Scalars only. An object, an array or a null under an allow-listed key is a caller
    // passing the raw form state, which is exactly what D13 forbids from reaching GTM.
    const v = params[k];
    if (typeof v !== 'string' && typeof v !== 'number') continue;
    // An enum-keyed param outside its set is free text by definition — dropped, not pushed.
    if (
      Object.hasOwn(PARAM_ENUMS, k) &&
      !(PARAM_ENUMS[k as EnumParam] as readonly string[]).includes(String(v))
    )
      continue;
    clean[k] = v;
  }
  (window.dataLayer ??= []).push(clean);
}
```

`src/analytics/useContactClick.ts` (new — no `'use client'` directive on purpose: it exports plain values as well as a hook, and a directive would turn `contactKindOf`/`CONTACT_PLACEMENTS` into client references for any server importer; only client components call the hook):

```ts
import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { PARAM_ENUMS, track } from './track';

/** W12: where a contact click happened. The same closed tuple `track()` enforces, so
 *  `placement` can never carry free text or an identifier — the only page-context values GTM
 *  ever sees are these nine. */
export const CONTACT_PLACEMENTS = PARAM_ENUMS.placement;
export type ContactPlacement = (typeof CONTACT_PLACEMENTS)[number];

export type ContactKind = 'call' | 'whatsapp' | 'email';

const EVENT = { call: 'call_click', whatsapp: 'whatsapp_click', email: 'email_click' } as const;

/** Which of the three contact events an href belongs to — `null` for everything else, so a
 *  social link rendered through `ContactLink` fires nothing. */
export function contactKindOf(href: string): ContactKind | null {
  if (href.startsWith('tel:')) return 'call';
  if (href.startsWith('mailto:')) return 'email';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'whatsapp';
  return null;
}

/** One handler factory for every tel:/wa.me/mailto: anchor (W32: returns `(kind) => void`,
 *  not a mouse handler — a Button-style caller pairs it with `contactKindOf`). `page` is the
 *  real URL pathname from `next/navigation` (R35), never next-intl's internal key; `locale`
 *  comes from the provider, so callers pass nothing but the placement. */
export function useContactClick(placement: ContactPlacement): (kind: ContactKind) => void {
  const page = usePathname() ?? '/';
  const locale = useLocale();
  return useCallback(
    (kind: ContactKind) => {
      track(EVENT[kind], { page, locale, placement });
    },
    [page, locale, placement],
  );
}
```

`src/analytics/ContactLink.tsx` (new):

```tsx
'use client';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { contactKindOf, useContactClick, type ContactPlacement } from './useContactClick';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  href: string;
  placement: ContactPlacement;
  children: ReactNode;
};

/** The anchor every tel:/wa.me/mailto: link renders through (chrome now, pages and the form
 *  fallback panel in WP2b). Same-tab by default (R22); callers pass `target`/`rel` for wa.me.
 *  A non-contact href is a plain anchor with no handler, so a social row can map over it. */
export function ContactLink({ href, placement, children, ...rest }: Props) {
  const fire = useContactClick(placement);
  const kind = contactKindOf(href);
  return (
    <a {...rest} href={href} onClick={kind ? () => fire(kind) : undefined}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Run the tests + `npm run verify`**

```bash
npx prettier --write src/analytics
npx vitest run src/analytics
npm run verify
```

Expected: `useContactClick.test.tsx` 5 passed, `track.test.ts` 5 passed (the three WP1 cases unchanged — `generate_lead` has no enum-keyed param), `consent.test.ts` unchanged; `verify` green. (jsdom may print `Not implemented: navigation` for the `mailto:`/`tel:` clicks — the native `preventDefault` in the test's `click()` helper suppresses it; if it still prints, it is a virtual-console warning, not a failure.)

- [ ] **Step 5: Commit**

```bash
git add src/analytics/track.ts src/analytics/track.test.ts src/analytics/useContactClick.ts src/analytics/ContactLink.tsx src/analytics/useContactClick.test.tsx
git commit -m "feat(analytics): useContactClick + ContactLink for contact clicks; W12 page events + enum guard in track() (W26)

Closed placement enum, page from next/navigation's usePathname (R35), locale from the
provider; contactKindOf classifies tel:/mailto:/wa.me so non-contact hrefs fire nothing.
track.ts declares partner_track_select / contact_topic / eligibility_check_complete /
career_apply_start / verify_lookup once, and drops any enum-keyed value outside PARAM_ENUMS —
pages never extend the allowlist.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — Nav groups from the bundle, `/blog` behind the threshold (W35 re-export), footer Privacy/Terms, `NOINDEX_PATHNAMES` + robots, contact-click wiring in SlimBar/Footer/MobileBottomBar/SocialRail/WhatsAppFab — no hard-coded portal anchors (W36)

- [ ] **Step 1: Write the failing tests**

`src/design/chrome/__tests__/nav.test.ts` (new — builds bundles from the golden fixture, so it needs no local-bundle import; the blog rows are full T0b rows because `blogNavVisible` reads them through `getCollection`, which throws on a schema miss outside production — W35):

```ts
import { describe, expect, it } from 'vitest';
import { BLOG_NAV_THRESHOLD, blogNavVisible, navGroup } from '../nav';
import {
  BLOG_NAV_THRESHOLD as CANONICAL_THRESHOLD,
  blogNavVisible as canonicalBlogNavVisible,
} from '@/content/collections';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

const t = (id: string) => `<${id}>`;
type NavRow = Bundle['nav'][number];

/** A full T0b blog row (Task 1's BlogPostSchema, + `body` per W28). */
const post = (i: number, tr: boolean) => ({
  key: `post-${i}`,
  slug: { tr: tr ? `yazi-${i}` : null, en: `post-${i}` },
  title: { tr: tr ? `Yazı ${i}` : null, en: `Post ${i}` },
  excerpt: { tr: tr ? `Özet ${i}` : null, en: `Excerpt ${i}` },
  category: 'workPermits',
  categoryLabelId: 'home.001',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 5,
  hasBody: { tr, en: true },
  body: { tr: tr ? `Gövde ${i}` : null, en: `Body ${i}` },
});
const trBodies = (n: number) => Array.from({ length: n }, (_, i) => post(i, true));
const enOnly = (i: number) => post(100 + i, false);

function bundleWith(nav: NavRow[], blog: Record<string, unknown>[] = []): Bundle {
  return BundleSchema.parse({ ...fixture, nav, collections: { ...fixture.collections, blog } });
}
const item = (
  group: NavRow['group'],
  order: number,
  href: string,
  labelId = 'home.010',
): NavRow => ({
  group,
  order,
  labelId,
  href,
  external: href.startsWith('http'),
  visibleOn: ['desktop', 'mobile'],
});

describe('nav groups (W4, W11)', () => {
  it('reads one group, sorted by order, with labels resolved through t() and external passed through', () => {
    const b = bundleWith([
      item('footerEmployers', 2, 'https://portal.jobsadmire.com/auth/login', 'home.012'),
      item('footerEmployers', 0, '/hire-workers', 'home.002'),
      item('footerEmployers', 1, '/verify', 'home.011'),
      item('desktopNav', 0, '/hire-workers', 'home.002'),
    ]);
    expect(navGroup(b, 'footerEmployers', t)).toEqual([
      { href: '/hire-workers', label: '<home.002>', external: false },
      { href: '/verify', label: '<home.011>', external: false },
      { href: 'https://portal.jobsadmire.com/auth/login', label: '<home.012>', external: true },
    ]);
    expect(navGroup(b, 'footerCompany', t)).toEqual([]);
  });

  it('hides /blog and /blog/[slug] from every group while under the Turkish-body threshold', () => {
    const b = bundleWith(
      [
        item('slimBarRight', 0, '/blog', 'home.013'),
        item('slimBarRight', 1, '/careers', 'home.009'),
        item('hamburger', 0, '/blog/[slug]'),
      ],
      trBodies(BLOG_NAV_THRESHOLD - 1),
    );
    expect(blogNavVisible(b)).toBe(false);
    expect(navGroup(b, 'slimBarRight', t).map((i) => i.href)).toEqual(['/careers']);
    expect(navGroup(b, 'hamburger', t)).toEqual([]);
  });

  it('shows the blog once the threshold is met, counting Turkish bodies only', () => {
    const under = bundleWith(
      [item('footerCompany', 0, '/blog', 'home.013')],
      [...trBodies(BLOG_NAV_THRESHOLD - 1), enOnly(0), enOnly(1)],
    );
    expect(blogNavVisible(under)).toBe(false);
    const at = bundleWith(
      [item('footerCompany', 0, '/blog', 'home.013')],
      trBodies(BLOG_NAV_THRESHOLD),
    );
    expect(blogNavVisible(at)).toBe(true);
    expect(navGroup(at, 'footerCompany', t).map((i) => i.href)).toEqual(['/blog']);
  });

  it('treats a missing blog collection as zero bodies and is the one W4 source (W35)', () => {
    expect(blogNavVisible(bundleWith([]))).toBe(false);
    expect(BLOG_NAV_THRESHOLD).toBe(6);
    expect(BLOG_NAV_THRESHOLD).toBe(CANONICAL_THRESHOLD);
    expect(blogNavVisible).toBe(canonicalBlogNavVisible);
  });
});
```

`src/design/chrome/__tests__/SlimBar.test.tsx` (new):

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SlimBar } from '../SlimBar';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The real generated TR bundle carries the nav groups
// T0b's importer fills (the golden fixture only carries `desktopNav`) and the 22 blog rows
// `blogNavVisible` reads.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';
const portalHref = `${bundle.settings.portal.host}${bundle.settings.portal.loginPath}`;
type Entry = Record<string, unknown>;

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('SlimBar', () => {
  it('renders the slimBarRight group with localized hrefs, the verify accent and ONE portal pill (W36), never /blog', () => {
    const { container } = renderWithIntl(<SlimBar bundle={bundle} />);
    expect(screen.getByRole('link', { name: t('home.009') })).toHaveAttribute('href', '/kariyer');
    const verify = screen.getByRole('link', { name: t('home.011') });
    expect(verify).toHaveAttribute('href', '/temsilci-dogrulama');
    expect(verify.className).toContain('rounded-pill');
    expect(container.querySelector('a[href="/blog"]')).toBeNull();
    // the portal login is the group's `external` row — one anchor, not a group row plus a
    // hard-coded copy
    const portal = screen.getByRole('link', { name: t('home.012') });
    expect(portal).toHaveAttribute('href', portalHref);
    expect(portal).toHaveAttribute('target', '_blank');
    expect(portal).toHaveAttribute('rel', 'noopener noreferrer');
    expect(portal.className).toContain('rounded-pill');
    expect(container.querySelectorAll(`a[href="${portalHref}"]`)).toHaveLength(1);
  });

  it('fires call_click / email_click with placement slimbar (W12)', async () => {
    renderWithIntl(<SlimBar bundle={bundle} />);
    const phone = screen.getByRole('link', { name: bundle.settings.phoneDisplay });
    const mail = screen.getByRole('link', { name: bundle.settings.email });
    expect(phone).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    expect(mail).toHaveAttribute('href', `mailto:${bundle.settings.email}`);
    for (const a of [phone, mail]) a.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(phone);
    await userEvent.click(mail);
    expect((window as unknown as { dataLayer: Entry[] }).dataLayer).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'slimbar' },
      { event: 'email_click', page: '/', locale: 'tr', placement: 'slimbar' },
    ]);
  });
});
```

`src/design/chrome/__tests__/ContactPlacements.test.tsx` (new — the golden fixture plus the two chrome ids these three components read, so no local-bundle import and no eslint exemption):

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { MobileBottomBar } from '../MobileBottomBar';
import { SocialRail } from '../SocialRail';
import { WhatsAppFab } from '../WhatsAppFab';
import { renderWithIntl } from '@/test/render';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. `hire.032` / `home.221` are the two ids these three
// read that the 20-string golden fixture lacks.
const bundle: Bundle = BundleSchema.parse({
  ...fixture,
  strings: { ...fixture.strings, 'hire.032': 'Bizi arayın', 'home.221': "WhatsApp'tan yazın" },
});
const WA = `https://wa.me/${bundle.settings.whatsappNumber}?text=Merhaba%20JobsAdmire%2C%20`;
type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

async function click(link: HTMLElement) {
  link.addEventListener('click', (e) => e.preventDefault());
  await userEvent.click(link);
}

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('contact placements (W12)', () => {
  it('mobile bottom bar: call_click + whatsapp_click with placement bottom_bar', async () => {
    renderWithIntl(<MobileBottomBar bundle={bundle} />);
    const call = screen.getByRole('link', { name: 'Bizi arayın' });
    expect(call).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    expect(call).not.toHaveAttribute('target');
    const wa = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(wa).toHaveAttribute('href', WA);
    expect(wa).toHaveAttribute('target', '_blank');
    await click(call);
    await click(wa);
    expect(pushed()).toEqual([
      { event: 'call_click', page: '/', locale: 'tr', placement: 'bottom_bar' },
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'bottom_bar' },
    ]);
  });

  it('WhatsApp FAB: whatsapp_click with placement whatsapp_fab', async () => {
    renderWithIntl(<WhatsAppFab bundle={bundle} />);
    const fab = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(fab).toHaveAttribute('href', WA);
    expect(fab.className).toContain('fixed');
    await click(fab);
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'whatsapp_fab' },
    ]);
  });

  it('social rail: only the WhatsApp tile fires (social_rail); the other five stay plain anchors', async () => {
    renderWithIntl(<SocialRail bundle={bundle} />);
    for (const name of ['Facebook', 'Instagram', 'WhatsApp', 'Telegram', 'TikTok', 'LinkedIn']) {
      const a = screen.getByRole('link', { name });
      expect(a).toHaveAttribute('target', '_blank');
      await click(a);
    }
    expect(pushed()).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'social_rail' },
    ]);
  });
});
```

`src/design/chrome/__tests__/Footer.test.tsx` — full rewrite:

```tsx
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { Footer } from '../Footer';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import tr from '@/messages/tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// R13: a parsed bundle, never a cast. The real generated TR bundle, whole: since T0b the nav
// groups differ from the golden fixture's single `desktopNav` group, and `blogNavVisible`
// reads the 22 blog rows.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';
const portalHref = `${bundle.settings.portal.host}${bundle.settings.portal.loginPath}`;
type Entry = Record<string, unknown>;

// Each column is rendered twice — once in the `lg+` grid, once in the mobile accordion — and
// jsdom applies no CSS, so both copies are in the tree. Only the accordion's own headers are
// exposed while it is collapsed: its panels carry `hidden`, which role queries skip — so a
// link query sees ONE anchor per entry until a panel is opened (W52).
const COLUMNS = ['home.189', 'home.190', 'home.191', 'home.194'];

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});

describe('Footer', () => {
  it('renders the four column headings in both the grid and the accordion', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    for (const id of COLUMNS) {
      expect(screen.getAllByRole('heading', { name: t(id) })).toHaveLength(2);
    }
  });

  it('collapses the columns into real accordion buttons for mobile', async () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const first = screen.getByRole('button', { name: t('home.189') });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(first.getAttribute('aria-controls')!)!;
    expect(panel).not.toBeVisible();

    await userEvent.click(first);
    expect(screen.getByRole('button', { name: t('home.189') })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(panel).toBeVisible();
    expect(within(panel).getByRole('link', { name: t('home.002') })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    // several columns open at once: a footer is a directory, not a wizard
    await userEvent.click(screen.getByRole('button', { name: t('home.190') }));
    expect(screen.getByRole('button', { name: t('home.189') })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('fills the two link columns from the footerEmployers/footerCompany groups, never /blog (W4)', async () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const rows = (group: Bundle['nav'][number]['group']) =>
      bundle.nav.filter((n) => n.group === group).sort((a, b) => a.order - b.order);
    expect(rows('footerEmployers').length).toBeGreaterThanOrEqual(5);
    expect(rows('footerCompany').length).toBeGreaterThanOrEqual(5);
    // one anchor per entry while the accordion is collapsed (W52) …
    expect(within(footer).getAllByRole('link', { name: t('home.001') })).toHaveLength(1);
    expect(within(footer).getByRole('link', { name: t('home.001') })).toHaveAttribute(
      'href',
      '/hakkimizda',
    );
    expect(within(footer).getByRole('link', { name: t('home.005') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
    // … and two once the company panel is open (grid + accordion copy of the same body)
    await userEvent.click(screen.getByRole('button', { name: t('home.190') }));
    expect(within(footer).getAllByRole('link', { name: t('home.001') })).toHaveLength(2);
    expect(footer.querySelectorAll('a[href="/blog"]')).toHaveLength(0);
    expect(footer.querySelectorAll('a[href^="/blog/"]')).toHaveLength(0);
  });

  it('carries the licence number and the Privacy/Terms links in the legal row (home.218/219)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(bundle.settings.licence.permitNo);
    expect(screen.getByText(t('home.228'))).toBeInTheDocument();
    const legal = within(footer).getByRole('navigation', { name: tr.sys.nav.legal });
    expect(within(legal).getByRole('link', { name: t('home.218') })).toHaveAttribute(
      'href',
      '/gizlilik',
    );
    expect(within(legal).getByRole('link', { name: t('home.219') })).toHaveAttribute(
      'href',
      '/kullanim-kosullari',
    );
  });

  it('offers the cookie-preferences door in the legal row once a container id exists (R36)', () => {
    const withGtm: Bundle = {
      ...bundle,
      settings: {
        ...bundle.settings,
        analytics: { ...bundle.settings.analytics, gtmId: 'GTM-TEST123' },
      },
    };
    renderWithIntl(<Footer locale="tr" bundle={withGtm} />);
    const button = within(screen.getByRole('contentinfo')).getByRole('button', {
      name: tr.sys.consent.manage,
    });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('hides it while no tag can fire, exactly like the banner (R40)', () => {
    expect(bundle.settings.analytics.gtmId).toBeNull();
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    expect(
      within(screen.getByRole('contentinfo')).queryByRole('button', {
        name: tr.sys.consent.manage,
      }),
    ).toBeNull();
  });

  it('gives every social and contact link an accessible name', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const expected: Array<[string, string]> = [
      ['Instagram', bundle.settings.social.instagram],
      ['TikTok', bundle.settings.social.tiktok],
      ['LinkedIn', bundle.settings.social.linkedin],
      ['Facebook', bundle.settings.social.facebook],
      [
        'WhatsApp',
        `https://wa.me/${bundle.settings.whatsappNumber}?text=Merhaba%20JobsAdmire%2C%20`,
      ],
      ['Telegram', bundle.settings.telegramUrl],
    ];
    for (const [name, href] of expected) {
      expect(within(footer).getByRole('link', { name })).toHaveAttribute('href', href);
    }
  });

  it('links the phone, e-mail and both offices', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    for (const phone of within(footer).getAllByRole('link', {
      name: bundle.settings.phoneDisplay,
    })) {
      expect(phone).toHaveAttribute('href', `tel:${bundle.settings.phone}`);
    }
    for (const mail of within(footer).getAllByRole('link', { name: bundle.settings.email })) {
      expect(mail).toHaveAttribute('href', `mailto:${bundle.settings.email}`);
    }
    expect(within(footer).getByRole('heading', { name: t('home.196') })).toBeInTheDocument();
    expect(within(footer).getByRole('heading', { name: t('home.197') })).toBeInTheDocument();
    expect(within(footer).getAllByRole('link', { name: t('home.192') })).toHaveLength(2);
  });

  it('fires whatsapp_click / call_click with placement footer (W12)', async () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const wa = within(footer).getByRole('link', { name: t('home.193') });
    const phone = within(footer).getByRole('link', { name: bundle.settings.phoneDisplay });
    const tile = within(footer).getByRole('link', { name: 'WhatsApp' });
    const instagram = within(footer).getByRole('link', { name: 'Instagram' });
    for (const a of [wa, phone, tile, instagram]) {
      a.addEventListener('click', (e) => e.preventDefault());
    }
    await userEvent.click(wa);
    await userEvent.click(phone);
    await userEvent.click(tile);
    await userEvent.click(instagram);
    expect((window as unknown as { dataLayer: Entry[] }).dataLayer).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'footer' },
      { event: 'call_click', page: '/', locale: 'tr', placement: 'footer' },
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'footer' },
    ]);
  });

  it('opens the portal login in a new tab from the employers column — the group row, once (W36)', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    const links = within(footer).getAllByRole('link', { name: t('home.012') });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', portalHref);
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    // grid + collapsed accordion: two anchors in the DOM, still no hard-coded third
    expect(footer.querySelectorAll(`a[href="${portalHref}"]`)).toHaveLength(2);
  });

  it('shows the Android store link and no App Store link while storeLinks.ios is null', () => {
    renderWithIntl(<Footer locale="tr" bundle={bundle} />);
    const footer = screen.getByRole('contentinfo');
    expect(bundle.settings.storeLinks.ios).toBeNull();
    for (const link of within(footer).getAllByRole('link', { name: t('hire.240') })) {
      expect(link).toHaveAttribute('href', bundle.settings.storeLinks.android);
    }
    expect(within(footer).queryAllByRole('link', { name: t('hire.241') })).toHaveLength(0);
  });
});
```

`src/lib/seo/routes.test.ts` — line 2 becomes `import { absoluteUrl, localeAlternates, NOINDEX_PATHNAMES, noindexExternalPaths } from './routes';` (Task 4 extends this line to the union of both tasks' names — W37) and append inside the `describe`:

```ts
it('keeps the blog index and articles out of the index until the Turkish threshold (W4)', () => {
  expect(NOINDEX_PATHNAMES).toContain('/blog');
  expect(NOINDEX_PATHNAMES).toContain('/blog/[slug]');
  // robots form: localized, deduped — the dynamic key adds nothing beyond its parent prefix
  expect(noindexExternalPaths('tr')).toEqual([
    '/tesekkurler',
    '/portal-girisi',
    '/abone-onay',
    '/abonelikten-cik',
    '/blog',
  ]);
  expect(noindexExternalPaths('en')).toEqual([
    '/en/thank-you',
    '/en/portal-login',
    '/en/newsletter/confirm',
    '/en/newsletter/unsubscribe',
    '/en/blog',
  ]);
});
```

`e2e/seo.spec.ts` — replace lines 30–38 (the sitemap case only; the robots case at lines 40–47 is untouched — W37: the e2e never asserts `Disallow: /blog`, because Task 4's UNBUILT gating removes it from robots until the blog page lands; the unit test above is the proof of the set):

```ts
test('the sitemap lists both locales and omits the noindex routes', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain(`${ORIGIN}/isci-talebi`);
  expect(xml).toContain(`${ORIGIN}/en/hire-workers`);
  expect(xml).not.toContain('/tesekkurler');
  expect(xml).not.toContain('[slug]');
  // W4: /blog is noindex and out of the sitemap in both locales until 6 Turkish bodies exist
  expect(xml).not.toContain(`${ORIGIN}/blog`);
  expect(xml).not.toContain(`${ORIGIN}/en/blog`);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/design/chrome src/lib/seo/routes.test.ts
```

Expected: `nav.test.ts` fails to load (`Failed to resolve import "../nav"`); `SlimBar.test.tsx` — the first case fails on `a[href="/blog"]` (present: SlimBar's hard-coded `RIGHT` list) and the analytics case pushes nothing (`expected [] to deeply equal [ {event:'call_click' …} ]`); `ContactPlacements.test.tsx` — all three cases fail with an empty dataLayer; `Footer.test.tsx` — "Privacy/Terms" fails with `Unable to find an accessible element with the role "navigation"` (`tr.sys.nav.legal` is `undefined` at runtime — the TS error surfaces in `verify`) and the W12 case fails with an empty dataLayer (the other nine pass against the old Footer too: its `EMPLOYERS`/`COMPANY` constants plus the single hard-coded portal anchor happen to produce the same counts — the W36 proof is that they stay green once the constants and the anchor are gone); `routes.test.ts` fails: `noindexExternalPaths is not a function`. The five Header tests still pass (Header is untouched until Cycle 4; its test still passes `primaryCta`).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — the `sys.nav` block (lines 9–12) becomes:

```json
    "nav": {
      "main": "Ana menü",
      "close": "Kapat",
      "legal": "Yasal"
    },
```

`src/messages/en.json` — same block (lines 9–12):

```json
    "nav": {
      "main": "Main menu",
      "close": "Close",
      "legal": "Legal"
    },
```

(Only `legal` is new; `main`/`close` are the current values — verified on main. W39: Task 5 later prints this block as `{ main, close, legal, breadcrumbs }`.)

`src/design/chrome/nav.ts` (new):

```ts
import { blogNavVisible } from '@/content/collections';
import type { Bundle, NavItem } from '../../../contract/website-bundle.v1';
import type { ChromeNavItem } from './NavLink';

/** W35: one W4 source of truth. The threshold and the visibility test live in
 *  `src/content/collections.ts` (T0b — they read the `blog` collection through
 *  `getCollection`); the chrome re-exports them so no chrome caller has to know where the
 *  collection is parsed. Until then `/blog` is also `noindex` (`src/lib/seo/routes.ts`) — one
 *  number, two consumers is deliberate; the index/noindex flip is a manual step (T12/WP-C). */
export { BLOG_NAV_THRESHOLD, blogNavVisible } from '@/content/collections';

const BLOG_HREFS: ReadonlySet<string> = new Set(['/blog', '/blog/[slug]']);

/** One nav group of the bundle as chrome items: sorted by `order`, labels resolved through
 *  `t()`, `external` passed through, the blog routes dropped below the threshold. The importer
 *  already withholds the `/blog` rows today (T0b); this is the second door — for an OPS bundle
 *  and for the day the threshold flips — so the rule can never be forgotten in one placement. */
export function navGroup(
  bundle: Bundle,
  group: NavItem['group'],
  t: (id: string) => string,
): ChromeNavItem[] {
  const showBlog = blogNavVisible(bundle);
  return bundle.nav
    .filter((n) => n.group === group && (showBlog || !BLOG_HREFS.has(n.href)))
    .sort((a, b) => a.order - b.order)
    .map((n) => ({ href: n.href, label: t(n.labelId), external: n.external }));
}
```

`src/design/chrome/SlimBar.tsx` — full file (W36: the portal login is the group's `external` row; the hard-coded anchor is gone):

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { MailIcon, PhoneIcon } from './icons';
import { navGroup } from './nav';
import { NavLink } from './NavLink';

/** The one accented pill in the right-hand group. Keyed by route, not by position, so the
 *  importer's order cannot move the accent. */
const ACCENT: ReadonlySet<string> = new Set(['/verify']);

// 26 px, not the chrome's usual 44: these are inline utility links in a 33 px bar, which
// WCAG 2.5.8 exempts — forcing 44 px here would half again the height of every page's top
// edge. Every primary target (hamburger, language pills, CTAs, mobile bar) stays at 44 px.
const LINK =
  'inline-flex min-h-[26px] items-center gap-2 text-white/70 no-underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const PILL = `${LINK} rounded-pill px-3 text-sky`;

export function SlimBar({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const { settings } = bundle;
  return (
    <div className="bg-navy text-body-sm text-white/70">
      <div className="container-site flex flex-wrap items-center justify-between gap-x-5 py-1.5">
        <span className="flex flex-wrap items-center gap-x-5 font-semibold">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
            {/* the long licence line only fits from the desktop nav up */}
            <span className="hidden lg:inline">{t('hire.019')}</span>
            <span className="lg:hidden">{t('calc.419')}</span>
          </span>
          <ContactLink
            href={telLink(settings.phone)}
            placement="slimbar"
            className={`hidden lg:inline-flex ${LINK}`}
          >
            <PhoneIcon size={12} />
            {settings.phoneDisplay}
          </ContactLink>
          <ContactLink
            href={mailLink(settings.email)}
            placement="slimbar"
            className={`hidden lg:inline-flex ${LINK}`}
          >
            <MailIcon size={12} />
            {settings.email}
          </ContactLink>
        </span>
        <span className="hidden flex-wrap items-center gap-x-5 font-semibold lg:flex">
          {/* T0b fills `slimBarRight`: /careers, /verify and the portal login as an `external`
              row (W36 — nothing is hard-coded here); `navGroup` drops /blog below the
              threshold (W4). The external row wears the portal pill, /verify the accent. */}
          {navGroup(bundle, 'slimBarRight', t).map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className={
                item.external
                  ? `${PILL} border border-white/20 bg-white/10`
                  : ACCENT.has(item.href)
                    ? `${PILL} border border-success/40 bg-success/15`
                    : LINK
              }
            />
          ))}
        </span>
      </div>
    </div>
  );
}
```

`src/design/chrome/Footer.tsx` — full file (W36: the employers column no longer appends a portal anchor — the group carries it):

```tsx
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { Accordion } from '@/design/primitives';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { CookiePreferencesButton } from './CookiePreferencesButton';
import { MapPinIcon, TelegramIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navGroup } from './nav';
import { NavLink, type ChromeNavItem } from './NavLink';
import { socialLinks } from './SocialRail';

/** The legal row's two links (W11). The frozen contract has no `footerLegal` nav group, so
 *  this is the one route list still declared in the chrome — canonical ids per R15. */
const LEGAL = [
  { href: '/privacy', labelId: 'home.218' },
  { href: '/terms', labelId: 'home.219' },
] as const;

const HEADING = 'm-0 mb-4 text-[14px] font-extrabold uppercase tracking-[0.6px] text-white/90';
const FLINK =
  'inline-flex min-h-[34px] items-center gap-2 text-white/60 no-underline hover:text-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const OFFICE_LABEL = 'm-0 text-[11.5px] font-extrabold uppercase tracking-[1px] text-sky';
const STORE = `${FLINK} rounded-md border border-white/20 bg-white/5 px-4 text-white`;

export function Footer({ locale, bundle }: { locale: Locale; bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const waHref = waLink(settings.whatsappNumber, sys('whatsapp.prefill'));

  // T0b fills `footerEmployers` (incl. the portal login as an `external` row, W36) and
  // `footerCompany`; `navGroup` drops /blog below the threshold (W4).
  const column = (items: ChromeNavItem[]) =>
    items.map((item) => <NavLink key={item.href} item={item} className={FLINK} />);
  const office = (name: string, hours: string, map: string) => (
    <span key={name} className="flex flex-col gap-1 border-t border-white/10 pt-2.5">
      <h3 className={OFFICE_LABEL}>{name}</h3>
      {/* /40 is 3.8:1 on navy — opening hours are information, not decoration (D20). */}
      <span className="font-medium text-white/55">{hours}</span>
      <a href={map} target="_blank" rel="noopener noreferrer" className={FLINK}>
        <MapPinIcon size={13} />
        {t('home.192')}
      </a>
    </span>
  );
  const storeLink = (item: ChromeNavItem) => <NavLink item={item} className={STORE} />;

  // One body per column, rendered twice: as a static grid column from `lg` up and inside the
  // mobile accordion below it. The hidden copy is `display:none`, so it is out of the
  // accessibility tree and no media query has to be measured at runtime.
  const columns = [
    {
      id: 'employers',
      heading: t('home.189'),
      body: (
        <div className="flex flex-col gap-1">{column(navGroup(bundle, 'footerEmployers', t))}</div>
      ),
    },
    {
      id: 'company',
      heading: t('home.190'),
      body: (
        <div className="flex flex-col gap-1">{column(navGroup(bundle, 'footerCompany', t))}</div>
      ),
    },
    {
      id: 'contact',
      heading: t('home.191'),
      body: (
        <div className="flex flex-col gap-1">
          <ContactLink href={telLink(settings.phone)} placement="footer" className={FLINK}>
            {settings.phoneDisplay}
          </ContactLink>
          <ContactLink href={mailLink(settings.email)} placement="footer" className={FLINK}>
            {settings.email}
          </ContactLink>
          <a
            href={settings.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={FLINK}
          >
            <TelegramIcon />
            {t('home.202')}
          </a>
          {office(t('home.196'), t('home.198'), settings.maps.antalya)}
          {office(t('home.197'), t('home.199'), settings.maps.karachi)}
          <ContactLink
            href={waHref}
            placement="footer"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue-safe px-5 font-extrabold text-white no-underline hover:bg-sky hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {t('home.193')}
          </ContactLink>
        </div>
      ),
    },
    {
      id: 'app',
      heading: t('home.194'),
      body: (
        <>
          <p className="m-0 mb-3.5 text-white/55">{t('home.195')}</p>
          <div className="flex flex-col items-start gap-2">
            {settings.storeLinks.android &&
              storeLink({
                href: settings.storeLinks.android,
                label: t('hire.240'),
                external: true,
              })}
            {settings.storeLinks.ios &&
              storeLink({ href: settings.storeLinks.ios, label: t('hire.241'), external: true })}
          </div>
        </>
      ),
    },
  ];

  return (
    <footer className="border-t-[3px] border-blue bg-navy text-body-sm">
      <div className="container-site grid gap-10 pt-16 pb-12 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <div>
          {/* 50 × 42 is the asset's own 336 × 285 ratio: a square box here reserves 7 px too
              much and the whole footer jumps when the image lands (CLS). */}
          <Image src="/brand/ja-mark.png" alt="" width={50} height={42} className="mb-4" />
          <p className="m-0 mb-4 max-w-[330px] text-white/65">{t('home.188')}</p>
          <p className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-4 py-1.5 font-bold text-sky">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
            {t('hire.019')}
          </p>
          <div className="mb-4">
            <LanguageSwitcher locale={locale} label={t('home.016')} variant="dark" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* W12: the WhatsApp tile fires whatsapp_click; the others are plain anchors
                (`ContactLink` classifies by href). */}
            {socialLinks(settings, sys('whatsapp.prefill')).map((s) => (
              <ContactLink
                key={s.name}
                href={s.href}
                placement="footer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={`flex h-11 w-11 items-center justify-center rounded-pill border border-white/20 bg-white/5 text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${s.hover}`}
              >
                {s.icon}
              </ContactLink>
            ))}
          </div>
        </div>

        {columns.map((c) => (
          <div key={c.id} className="hidden lg:block">
            <h2 className={HEADING}>{c.heading}</h2>
            {c.body}
          </div>
        ))}

        <div className="text-white/80 lg:hidden">
          <Accordion
            headingLevel={2}
            singleOpen={false}
            items={columns.map((c) => ({ id: c.id, title: c.heading, body: c.body }))}
          />
        </div>
      </div>

      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/15 py-5">
        <p className="m-0 text-white/50">{t('home.228')}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {/* W11: Privacy/Terms in the legal row. The pages land in T13; until then the
              `[...rest]` catch-all answers 404 inside the chrome. */}
          <nav aria-label={sys('nav.legal')} className="flex items-center gap-x-4">
            {LEGAL.map((l) => (
              <NavLink
                key={l.href}
                item={{ href: l.href, label: t(l.labelId), external: false }}
                className={FLINK}
              />
            ))}
          </nav>
          {/* R36: consent is withdrawable, and this is where visitors look for it. R40 gates it
              exactly like the banner (R38): with no container id nothing ever asked for
              consent, so there is nothing to withdraw and the button would reopen nothing. */}
          {settings.analytics.consentMode && Boolean(settings.analytics.gtmId) && (
            <CookiePreferencesButton label={sys('consent.manage')} />
          )}
        </div>
      </div>
    </footer>
  );
}
```

`src/design/chrome/MobileBottomBar.tsx` — full file:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { PhoneIcon, WhatsAppIcon } from './icons';

/** Keeps the fixed bar from covering the end of the page. Rendered as its sibling. */
export function MobileBottomBarSpacer() {
  return <div aria-hidden="true" className="h-[74px] lg:hidden" />;
}

const ACTION =
  'flex min-h-12 items-center justify-center gap-2 rounded-pill text-[15px] font-extrabold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';

export function MobileBottomBar({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2.5 border-t border-white/15 bg-navy/95 px-3.5 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <ContactLink
        href={telLink(settings.phone)}
        placement="bottom_bar"
        className={`${ACTION} border-[1.5px] border-white/25 bg-white/10`}
      >
        <PhoneIcon />
        {t('hire.032')}
      </ContactLink>
      <ContactLink
        href={waLink(settings.whatsappNumber, sys('whatsapp.prefill'))}
        placement="bottom_bar"
        target="_blank"
        rel="noopener noreferrer"
        // `success` (#16a34a) is 3.3:1 under white — the darker green of the same family
        // clears AA (4.96:1) and keeps the WhatsApp action one colour everywhere.
        className={`${ACTION} bg-success-text`}
      >
        <WhatsAppIcon size={18} />
        {t('home.221')}
      </ContactLink>
    </div>
  );
}
```

`src/design/chrome/SocialRail.tsx` — lines 1–3 become:

```tsx
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { waLink } from '@/lib/contact';
```

and the `SocialRail` component (lines 58–78) becomes:

```tsx
/** Fixed left rail, desktop only — below 1101 px the WhatsApp FAB and the mobile bar carry
 *  the same actions. */
export function SocialRail({ bundle }: { bundle: Bundle }) {
  const sys = useTranslations('sys');
  return (
    <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 xl:flex">
      {/* W12: the WhatsApp tile fires whatsapp_click (placement social_rail); the rest are
          plain anchors — `ContactLink` classifies by href. */}
      {socialLinks(bundle.settings, sys('whatsapp.prefill')).map((s) => (
        <ContactLink
          key={s.name}
          href={s.href}
          placement="social_rail"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`flex h-11 w-11 items-center justify-center rounded-pill border border-border-2 bg-white text-text-secondary shadow-social transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe ${s.hover}`}
        >
          {s.icon}
        </ContactLink>
      ))}
    </div>
  );
}
```

(`socialLinks()` at lines 16–56 is unchanged.)

`src/design/chrome/WhatsAppFab.tsx` — full file:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { WhatsAppIcon } from './icons';

/** Only between the mobile bottom bar (≤900 px) and the social rail (≥1101 px). */
export function WhatsAppFab({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  return (
    <ContactLink
      href={waLink(bundle.settings.whatsappNumber, sys('whatsapp.prefill'))}
      placement="whatsapp_fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('home.221')}
      className="fixed bottom-[18px] right-[18px] z-40 hidden h-14 w-14 items-center justify-center rounded-pill bg-success-text text-white shadow-[0_12px_30px_rgba(18,129,60,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe lg:flex xl:hidden"
    >
      <WhatsAppIcon size={27} />
    </ContactLink>
  );
}
```

`src/lib/seo/routes.ts` — full file:

```ts
import { getPathname } from '@/i18n/navigation';
import { pathnames, routing, type Locale } from '@/i18n/routing';

/** Production origin; a trailing slash in the env value would double up in every URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.jobsadmire.com').replace(
  /\/$/,
  '',
);

/** The typed internal pathname `getPathname` accepts — a key of `pathnames`, or, for the
 *  dynamic routes, `{ pathname, params }`. */
export type Href = Parameters<typeof getPathname>[0]['href'];

/** A `pathnames` key with no dynamic segment — the only keys `getPathname` takes as a bare
 *  string. Exported for the sitemap/robots tests' type guards (W37). */
export type StaticPathname = Exclude<keyof typeof pathnames, `${string}[${string}`>;

/**
 * Internal pathnames that are never indexed: the conversion page (D13), the portal door, the
 * two newsletter one-shot pages, and — W4, until six Turkish article bodies exist — the blog
 * index and its articles. One set, two consumers (M-3): `app/sitemap.ts` excludes them and
 * `app/robots.ts` disallows their external form in both locales through
 * `noindexExternalPaths`, so a TR slug change in `pathnames` can never leave robots pointing
 * at a path that no longer exists. (`/api/` is disallowed literally there; it is not a
 * `pathnames` route.) Typed as keys, not `Href`s: '/blog/[slug]' is a key but not a bare
 * href, so never hand this set to `getPathname`/`absoluteUrl` directly — go through
 * `noindexExternalPaths`. The blog flip back to index is a manual, reviewed step (T12/WP-C):
 * remove both entries here and nowhere else.
 */
export const NOINDEX_PATHNAMES = [
  '/thank-you',
  '/portal-login',
  '/newsletter/confirm',
  '/newsletter/unsubscribe',
  '/blog',
  '/blog/[slug]',
] as const satisfies readonly (keyof typeof pathnames)[];

export function isNoindexPathname(href: keyof typeof pathnames): boolean {
  return (NOINDEX_PATHNAMES as readonly string[]).includes(href);
}

/** The noindex set as localized external paths for robots.txt, deduped: a dynamic key is
 *  covered by its parent's prefix (`/blog/[slug]` → `/blog`), since robots matching is by
 *  prefix and a template can never be a real path. */
export function noindexExternalPaths(locale: Locale): string[] {
  const out = new Set<string>();
  for (const href of NOINDEX_PATHNAMES) {
    const key = (
      href.includes('[') ? href.slice(0, href.lastIndexOf('/')) : href
    ) as StaticPathname;
    out.add(getPathname({ locale, href: key }));
  }
  return [...out];
}

/** Absolute, locale-correct URL for an internal pathname. `getPathname` is synchronous when
 *  the locale is passed explicitly, and returns `/` for the TR root and `/en` for the EN one,
 *  so the TR root keeps its trailing slash and no other URL gains one. */
export function absoluteUrl(locale: Locale, href: Href): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

/** hreflang map for one page: both locales plus `x-default` = TR, self-reference included
 *  (a page missing its own locale here is a defect — docs/SEO.md). */
export function localeAlternates(href: Href): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(locale, href);
  languages['x-default'] = absoluteUrl(routing.defaultLocale, href);
  return { languages };
}
```

(Task 4 appends `UNBUILT_PATHNAMES`, `robotsDisallowPaths`, `OG_PAGE_KEYS` and `pageOgImageUrl` below `localeAlternates` — W37; `sitemap.ts`'s `EXCLUDED = new Set<string>(NOINDEX_PATHNAMES)` keeps working unchanged — the dynamic keys were already filtered by pattern, and `sitemap.ts` is not touched here.)

`src/app/robots.ts` — full file:

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { noindexExternalPaths, SITE_URL } from '@/lib/seo/routes';

export default function robots(): MetadataRoute.Robots {
  // Previews are additionally protected by Vercel Deployment Protection — robots is a hint,
  // not access control (docs/SEO.md).
  const preview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  return preview
    ? { rules: { userAgent: '*', disallow: '/' } }
    : {
        rules: {
          userAgent: '*',
          allow: '/',
          // `/api/` is literal — it is not a `pathnames` route. Everything else is derived
          // from the one `NOINDEX_PATHNAMES` set the sitemap excludes (M-3), in both locales,
          // so a slug change cannot leave this list pointing at a path that no longer exists.
          disallow: ['/api/', ...routing.locales.flatMap((locale) => noindexExternalPaths(locale))],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
      };
}
```

(Task 4 re-points this at `robotsDisallowPaths(locale)` — the same list minus `UNBUILT_PATHNAMES` — W37.)

`eslint.config.mjs` — lines 31–42 become (the comment's count and the exact list; `ContactPlacements.test.tsx` and `nav.test.ts` use the golden fixture, so they need no exemption):

```js
  // The only files that fail the rule and should: three component tests that render the chrome
  // against the real generated TR bundle as a fixture. D23 governs how the *running site*
  // loads a bundle — `adapter.ts`'s own loader is a template-literal dynamic import the rule
  // cannot see, and the lint/contract tests read the JSON with `readFileSync`, so neither
  // needs an exemption. Keep this list exact; do not widen it to a glob.
  {
    files: [
      'src/design/chrome/__tests__/Footer.test.tsx',
      'src/design/chrome/__tests__/Header.test.tsx',
      'src/design/chrome/__tests__/SlimBar.test.tsx',
    ],
    rules: { 'no-restricted-imports': 'off' },
  },
```

- [ ] **Step 4: Run the tests + `npm run verify`**

```bash
npx prettier --write src/design/chrome src/lib/seo src/app/robots.ts src/messages eslint.config.mjs e2e
npx vitest run src/design/chrome src/lib/seo src/analytics
npm run verify
npm run build && (PORT=3000 npm run start &) && sleep 4 && npx playwright test e2e/seo.spec.ts e2e/chrome.spec.ts e2e/a11y.spec.ts
```

Expected: `nav.test.ts` 4 passed, `SlimBar.test.tsx` 2 passed, `ContactPlacements.test.tsx` 3 passed, `Footer.test.tsx` 11 passed, `routes.test.ts` 4 passed, `Header.test.tsx` still 5 passed (it still passes `primaryCta`; Cycle 4 rewrites it); `verify` green; `seo.spec.ts` shows no `/blog` URL in the sitemap (and the untouched robots case still sees `Disallow: /tesekkurler`); axe zero violations on every gate route (the new `<nav aria-label>` in the footer is a named landmark, and the two legal links are 34 px inline utility links under the same WCAG 2.5.8 exemption as the slim bar).

- [ ] **Step 5: Commit**

```bash
git add src/design/chrome src/lib/seo src/app/robots.ts src/messages eslint.config.mjs e2e/seo.spec.ts
git commit -m "feat(chrome): nav groups from the bundle, blog behind the threshold, footer legal links, contact-click wiring (W4, W11, W12, W35, W36)

SlimBar/Footer read slimBarRight/footerEmployers/footerCompany through navGroup(), which
re-exports Task 1's BLOG_NAV_THRESHOLD/blogNavVisible and drops /blog + /blog/[slug] below the
threshold; the portal login is the groups' external row — no hard-coded anchor remains. Both
blog keys join NOINDEX_PATHNAMES; robots disallows their localized prefix through
noindexExternalPaths. Footer legal row gains Privacy/Terms (home.218/219, sys.nav.legal). Every
tel:/mailto:/wa.me anchor in the slim bar, footer, social rail, FAB and mobile bar renders
through ContactLink with its placement.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — Header: `CTA_BY_PATHNAME` through `usePathname()` (W17) and the 901 px desktop row (W11)

- [ ] **Step 1: Write the failing tests**

`src/design/chrome/__tests__/ctas.test.ts` (new):

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CTA_BY_PATHNAME, DEFAULT_CTAS, ctasFor, resolveCtas } from '../ctas';
import { pathnames } from '@/i18n/routing';

const t = (id: string) => `<${id}>`;
const table = resolveCtas(t);

// The catalogue via readFileSync (lint.test.ts's pattern) — not a module import (R56/D23).
const strings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(
        join(__dirname, '..', '..', '..', 'content', 'local', `bundle.${locale}.json`),
        'utf8',
      ),
    ) as { strings: Record<string, string> }
  ).strings;

describe('header CTA table (W17)', () => {
  it('falls back to the defaults for null and for keys without an entry', () => {
    expect(ctasFor(table, null)).toBe(table.defaults);
    expect(ctasFor(table, '/hire-workers')).toBe(table.defaults);
    expect(ctasFor(table, '/blog/[slug]')).toBe(table.defaults);
    expect(ctasFor(table, '/careers/[slug]')).toBe(table.defaults);
    expect(ctasFor(table, '/not-a-key')).toBe(table.defaults);
    expect(table.defaults).toEqual({
      primary: {
        label: '<home.014>',
        tail: '<home.015>',
        href: { pathname: '/hire-workers', hash: '#request-form' },
        variant: 'primary',
      },
      secondary: { label: '<home.008>', href: '/partner-with-us', variant: 'primary' },
    });
  });

  it('resolves a page entry, inheriting the default secondary when the entry leaves it out', () => {
    expect(ctasFor(table, '/contact')).toEqual({
      primary: {
        label: '<contact.015>',
        tail: '<contact.016>',
        href: { pathname: '/contact', hash: '#message' },
        variant: 'primary',
      },
      secondary: { label: '<home.002>', href: '/hire-workers', variant: 'primary' },
    });
    expect(ctasFor(table, '/').primary.href).toEqual({ pathname: '/', hash: '#proposal' });
    expect(ctasFor(table, '/work-permit').secondary).toEqual(table.defaults.secondary);
    expect(ctasFor(table, '/verify').primary.variant).toBe('danger');
    expect(ctasFor(table, '/hiring-cost-calculator').primary).toEqual({
      label: '<calc.324>',
      href: { pathname: '/hiring-cost-calculator', hash: '#calculator' },
      variant: 'primary',
    });
  });

  it('only keys of `pathnames`, and every label id exists in both catalogues', () => {
    const ids = new Set<string>();
    const collect = (c: { labelId: string; tailId?: string } | null | undefined) => {
      if (!c) return;
      ids.add(c.labelId);
      if (c.tailId) ids.add(c.tailId);
    };
    collect(DEFAULT_CTAS.primary);
    collect(DEFAULT_CTAS.secondary);
    for (const [key, page] of Object.entries(CTA_BY_PATHNAME)) {
      expect(Object.hasOwn(pathnames, key), key).toBe(true);
      collect(page.primary);
      collect(page.secondary);
    }
    for (const locale of ['tr', 'en'] as const) {
      const s = strings(locale);
      for (const id of ids) expect(s[id], `${id} (${locale})`).toBeTruthy();
    }
  });
});
```

`src/design/chrome/__tests__/Header.test.tsx` — full rewrite:

```tsx
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '../Header';
import { renderWithIntl } from '@/test/render';
import trBundle from '@/content/local/bundle.tr.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

// W17: next-intl's `usePathname()` reads next/navigation's, which is `null` outside the App
// Router. Steering it with the *external* path walks the CTA table page by page (next-intl
// maps `/iletisim` back to the internal `/contact` key). `next-intl` is inlined by
// vitest.config.mts, so its own import of next/navigation sees this mock too.
const nav = vi.hoisted(() => ({ pathname: null as string | null }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => nav.pathname,
}));

// R13: a parsed bundle, never a cast. The real generated TR bundle, whole: since T0b the nav
// groups differ from the golden fixture's single `desktopNav` group.
const bundle: Bundle = BundleSchema.parse(trBundle);
const t = (id: string) => bundle.strings[id] ?? '';
const portalHref = `${bundle.settings.portal.host}${bundle.settings.portal.loginPath}`;

// what the hamburger must list: its own group (T0b: desktopNav + the portal login), minus the
// blog while under the threshold (W4)
const hamburger = bundle.nav.filter((n) => n.group === 'hamburger' && !n.href.startsWith('/blog'));

/** T0b fills no external row in `desktopNav` (the portal login sits in `hamburger`,
 *  `slimBarRight` and `footerEmployers`); the desktop row still has to honour one. Added to
 *  `desktopNav` only — the panel's copy is T0b's own row (W36: one portal link per list). */
const withExternalItem: Bundle = {
  ...bundle,
  nav: [
    ...bundle.nav,
    {
      group: 'desktopNav',
      order: 99,
      labelId: 'home.012',
      href: portalHref,
      external: true,
      visibleOn: ['desktop', 'mobile'],
    },
  ],
};

beforeEach(() => {
  nav.pathname = null;
});

describe('Header', () => {
  it('renders the desktop nav from the desktopNav group with localized hrefs, never /blog', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const row = screen.getByRole('navigation', { name: 'Ana menü' });
    expect(within(row).getAllByRole('link').length).toBeGreaterThanOrEqual(7);
    expect(within(row).getByRole('link', { name: t('home.002') })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(within(row).getByRole('link', { name: t('home.005') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
    expect(row.querySelector('a[href="/blog"]')).toBeNull();
    // the four promoted routes leave the row (slim bar / secondary CTA) but stay in the panel
    expect(within(row).queryByRole('link', { name: t('home.011') })).toBeNull();
    expect(within(row).queryByRole('link', { name: t('home.008') })).toBeNull();
  });

  it('labels the hamburger and reports the panel state on it', async () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const toggle = screen.getByRole('button', { name: t('hire.239') });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const panelId = toggle.getAttribute('aria-controls')!;
    expect(document.getElementById(panelId)).not.toBeVisible();
    expect(screen.queryByRole('navigation', { name: t('hire.239') })).toBeNull();

    await userEvent.click(toggle);
    const opened = screen.getByRole('button', { name: 'Kapat' });
    expect(opened).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(panelId)!;
    expect(panel).toBeVisible();
    // the panel keeps every `hamburger` entry, including the four the desktop row promotes
    const menu = within(panel).getByRole('navigation', { name: t('hire.239') });
    expect(within(menu).getAllByRole('link')).toHaveLength(hamburger.length);
    expect(within(menu).getByRole('link', { name: t('home.011') })).toHaveAttribute(
      'href',
      '/temsilci-dogrulama',
    );
    expect(menu.querySelector('a[href="/blog"]')).toBeNull();

    await userEvent.click(opened);
    expect(screen.getByRole('button', { name: t('hire.239') })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('renders an external nav entry as a new-tab anchor in both rows', async () => {
    renderWithIntl(<Header locale="tr" bundle={withExternalItem} />);
    const inRow = within(screen.getByRole('navigation', { name: 'Ana menü' })).getByRole('link', {
      name: t('home.012'),
    });
    expect(inRow).toHaveAttribute('href', portalHref);
    expect(inRow).toHaveAttribute('target', '_blank');
    expect(inRow).toHaveAttribute('rel', 'noopener noreferrer');

    await userEvent.click(screen.getByRole('button', { name: t('hire.239') }));
    // T0b's own hamburger row — exactly one in the panel (W36)
    const inPanel = within(screen.getByRole('navigation', { name: t('hire.239') })).getByRole(
      'link',
      { name: t('home.012') },
    );
    expect(inPanel).toHaveAttribute('href', portalHref);
    expect(inPanel).toHaveAttribute('target', '_blank');
    expect(inPanel).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the default split primary CTA and the partner secondary CTA off the table', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const banner = screen.getByRole('banner');
    expect(
      within(banner).getByRole('link', { name: `${t('home.014')} ${t('home.015')}` }),
    ).toHaveAttribute('href', '/isci-talebi#request-form');
    expect(within(banner).getByRole('link', { name: t('home.008') })).toHaveAttribute(
      'href',
      '/ortak-olun',
    );
  });

  it('swaps both CTAs per page from CTA_BY_PATHNAME through the internal pathname (W17)', () => {
    nav.pathname = '/iletisim';
    const { unmount } = renderWithIntl(<Header locale="tr" bundle={bundle} />);
    let banner = screen.getByRole('banner');
    expect(
      within(banner).getByRole('link', { name: `${t('contact.015')} ${t('contact.016')}` }),
    ).toHaveAttribute('href', '/iletisim#message');
    expect(within(banner).getByRole('link', { name: t('home.002') })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
    expect(within(banner).queryByRole('link', { name: t('home.008') })).toBeNull();
    unmount();

    nav.pathname = '/temsilci-dogrulama';
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    banner = screen.getByRole('banner');
    const report = within(banner).getByRole('link', {
      name: `${t('verify.015')} ${t('verify.016')}`,
    });
    expect(report).toHaveAttribute('href', '/temsilci-dogrulama#report');
    expect(report.className).toContain('bg-danger');
  });

  it('offers the other language with aria-current on the active one', () => {
    renderWithIntl(<Header locale="tr" bundle={bundle} />);
    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('link', { name: 'Türkçe' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(within(banner).getByRole('link', { name: 'English' })).not.toHaveAttribute(
      'aria-current',
    );
  });
});
```

`src/design/tokens.test.ts` — lines 36–38 become:

```ts
it('breakpoints are the design breakpoints unscaled', () => {
  expect(tokens.breakpoint).toEqual({ xs: 461, sm: 561, md: 701, lg: 901, xl: 1101 });
});
it('the header row swaps at lg (W11, closes R46) and the social rail at xl', () => {
  expect(tokens.layout.headerRowFrom).toBe(tokens.breakpoint.lg);
  expect(tokens.layout.socialRailFrom).toBe(tokens.breakpoint.xl);
  // nav links: authored 13.5 → 12 between 901 and 1100 → the 11 px floor from 1101
  expect(tokens.type.nav).toEqual({ mobile: 13.5, tablet: 12, desktop: 11 });
});
```

(The existing "desktop type is the authored value × 0.75 with an 11px floor" case iterates `tokens.type` and keeps passing: `nav.desktop` is `max(11, 10.13) = 11`.)

`e2e/chrome.spec.ts` — append:

```ts
test('the desktop nav row appears from 901px, the hamburger below it, nothing overflows (W11)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 901, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menü' })).toBeHidden();

  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.getByRole('navigation', { name: 'Ana menü' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Menü' })).toBeVisible();

  // 1100 is the tight one: the row is on, the links are 12px and may wrap inside the nav
  for (const width of [901, 1000, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
  }
});

test('the header CTA follows the page (W17)', async ({ page }) => {
  await page.goto('/');
  // accessible name is "Talep" below xl (the tail span is display:none) and "Talep Oluştur" from xl
  await expect(page.getByRole('banner').getByRole('link', { name: /^Talep/ })).toHaveAttribute(
    'href',
    '/#proposal',
  );
  await page.goto('/isci-talebi');
  await expect(page.getByRole('banner').getByRole('link', { name: /^Talep/ })).toHaveAttribute(
    'href',
    '/isci-talebi#request-form',
  );
});
```

`e2e/width-sweep.spec.ts` — line 9 becomes (901 added: the new header boundary is straddled like the D19 one):

```ts
  for (const width of [1440, 1280, 1101, 1100, 901, 900, 700, 560, 460, 390]) {
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/design/chrome/__tests__/ctas.test.ts src/design/chrome/__tests__/Header.test.tsx src/design/tokens.test.ts
```

Expected: `ctas.test.ts` fails to load (`Failed to resolve import "../ctas"`); `Header.test.tsx` — TypeScript is not checked by vitest, so it renders the old Header without `primaryCta` and throws `Cannot read properties of undefined (reading 'href')` in every case (the old component reads `primaryCta.href`); `tokens.test.ts` — the new case fails: `tokens.layout.headerRowFrom` is `undefined`.

- [ ] **Step 3: Implement**

`src/design/primitives/Button.tsx` — lines 16–50 become (everything else unchanged):

```tsx
const SIZE = {
  md: 'min-h-[44px] px-5 text-body-sm',
  lg: 'min-h-[52px] px-7 text-body',
} as const;

// 44 px minimum target and a visible focus ring on every branch (D20).
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-pill text-center font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe disabled:cursor-not-allowed disabled:opacity-60';

/** The exact class string `<Button>` renders, for the one caller that cannot go through it:
 *  a next-intl `Link` with an *object* href (`{ pathname, hash }`), which `Button`'s
 *  string-only `href` (R17) cannot carry. Same face, same focus ring, same hit target. */
export function buttonClassName(
  variant: ButtonVariant,
  size: 'md' | 'lg' = 'md',
  className?: string,
): string {
  return [BASE, VARIANT[variant], SIZE[size], className].filter(Boolean).join(' ');
}

export type ButtonProps = {
  variant: ButtonVariant;
  size?: 'md' | 'lg';
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** Chrome CTAs pass `false` so they do not add an eager `_rsc` request to the first load;
   *  hover prefetch is unaffected (R47c). Page CTAs keep Next's default. */
  prefetch?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Button({
  variant,
  size = 'md',
  href,
  external,
  type = 'button',
  disabled,
  prefetch,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = buttonClassName(variant, size, className);
```

`src/design/primitives/index.ts` — line 2 becomes (W39: Task 5 edits this barrel additively and keeps `buttonClassName`):

```ts
export { Button, buttonClassName, type ButtonProps, type ButtonVariant } from './Button';
```

`src/design/chrome/ctas.ts` (new):

```ts
import type { Href } from '@/i18n/navigation';
import type { pathnames } from '@/i18n/routing';

/** W17: pages cannot pass props to the group layouts, so the header's per-page CTAs come from
 *  this route-keyed table, read by `HeaderCtas` through next-intl's `usePathname()` (the
 *  internal key — SSR-consistent, so no hydration mismatch and no context store). Ids are the
 *  package's own per-page nav-CTA strings (R15/W23); the anchors are the design's own ids —
 *  THE PAGE TASK OWNING A KEY MUST RENDER THAT ELEMENT ID, or edit its entry here. */
export type CtaVariant = 'primary' | 'danger';
export type CtaLink = { labelId: string; tailId?: string; href: Href; variant?: CtaVariant };
/** `secondary` left out → the default secondary; `null` → no secondary on that page. */
export type PageCtas = { primary: CtaLink; secondary?: CtaLink | null };

const HIRE: CtaLink = { labelId: 'home.002', href: '/hire-workers' };

export const DEFAULT_CTAS: PageCtas = {
  // "Request" + "Workers" — the tail is `xl`-only, as the design hides `.ja-cta-long` ≤1100
  primary: {
    labelId: 'home.014',
    tailId: 'home.015',
    href: { pathname: '/hire-workers', hash: '#request-form' },
  },
  secondary: { labelId: 'home.008', href: '/partner-with-us' },
};

export const CTA_BY_PATHNAME: Partial<Record<keyof typeof pathnames, PageCtas>> = {
  '/': {
    primary: {
      labelId: 'home.014',
      tailId: 'home.015',
      href: { pathname: '/', hash: '#proposal' },
    },
  },
  '/hiring-cost-calculator': {
    primary: {
      labelId: 'calc.324',
      href: { pathname: '/hiring-cost-calculator', hash: '#calculator' },
    },
    secondary: HIRE,
  },
  '/partner-with-us': {
    primary: {
      labelId: 'partner.017',
      tailId: 'partner.018',
      href: { pathname: '/partner-with-us', hash: '#tracks' },
    },
    secondary: HIRE,
  },
  '/work-permit': {
    primary: {
      labelId: 'wp.016',
      tailId: 'wp.017',
      href: { pathname: '/work-permit', hash: '#permit-cta' },
    },
  },
  '/contact': {
    primary: {
      labelId: 'contact.015',
      tailId: 'contact.016',
      href: { pathname: '/contact', hash: '#message' },
    },
    secondary: HIRE,
  },
  '/verify': {
    // the design's red "Report an Impostor" — the only danger-face CTA in the chrome
    primary: {
      labelId: 'verify.015',
      tailId: 'verify.016',
      href: { pathname: '/verify', hash: '#report' },
      variant: 'danger',
    },
    secondary: HIRE,
  },
  '/available-workers': {
    // "See" + "Candidates": the tail is the canonical nav label (home.003), not a page copy
    primary: {
      labelId: 'availworkers.016',
      tailId: 'home.003',
      href: { pathname: '/available-workers', hash: '#pool' },
    },
  },
};

export type ResolvedCta = { label: string; tail?: string; href: Href; variant: CtaVariant };
export type ResolvedPageCtas = { primary: ResolvedCta; secondary?: ResolvedCta };
export type CtaTable = {
  defaults: ResolvedPageCtas;
  byPathname: Partial<Record<keyof typeof pathnames, ResolvedPageCtas>>;
};

/** Resolves every label once on the server (Header) so the client island receives strings. */
export function resolveCtas(t: (id: string) => string): CtaTable {
  const one = (c: CtaLink): ResolvedCta => ({
    label: t(c.labelId),
    ...(c.tailId ? { tail: t(c.tailId) } : {}),
    href: c.href,
    variant: c.variant ?? 'primary',
  });
  const defaultSecondary = DEFAULT_CTAS.secondary ? one(DEFAULT_CTAS.secondary) : undefined;
  const page = (p: PageCtas): ResolvedPageCtas => ({
    primary: one(p.primary),
    ...(p.secondary === undefined
      ? defaultSecondary
        ? { secondary: defaultSecondary }
        : {}
      : p.secondary === null
        ? {}
        : { secondary: one(p.secondary) }),
  });
  const byPathname: CtaTable['byPathname'] = {};
  for (const [key, value] of Object.entries(CTA_BY_PATHNAME) as [
    keyof typeof pathnames,
    PageCtas,
  ][]) {
    byPathname[key] = page(value);
  }
  return { defaults: page(DEFAULT_CTAS), byPathname };
}

/** Pure lookup: the internal pathname key (or `null` outside the router) → that page's CTAs. */
export function ctasFor(table: CtaTable, pathname: string | null): ResolvedPageCtas {
  if (pathname && Object.hasOwn(table.byPathname, pathname)) {
    return table.byPathname[pathname as keyof typeof pathnames]!;
  }
  return table.defaults;
}
```

`src/design/chrome/HeaderCtas.tsx` (new):

```tsx
'use client';
import { Link, usePathname } from '@/i18n/navigation';
import { buttonClassName } from '@/design/primitives';
import { ctasFor, type CtaTable, type ResolvedCta } from './ctas';

// The header's primary face is ink with a blue hover (the design's nav CTA), the danger face
// is the red "Report an Impostor"; both keep Button's base/size/focus classes.
const PRIMARY = buttonClassName('primary', 'md', 'whitespace-nowrap bg-ink hover:bg-blue-safe');
const DANGER = buttonClassName('danger', 'md', 'whitespace-nowrap');
// `xl`-only, like the design's `.ja-nav-cta-secondary` (hidden ≤1100) — the same
// `hidden … xl:inline-flex` pair the WP1 header used on <Button>, proven by the gate at 1100
const SECONDARY = buttonClassName('secondary', 'md', 'hidden whitespace-nowrap xl:inline-flex');

function Primary({ cta }: { cta: ResolvedCta }) {
  return (
    <Link href={cta.href} prefetch={false} className={cta.variant === 'danger' ? DANGER : PRIMARY}>
      {cta.label}
      {/* the long form only from xl, like the design's `.ja-cta-long` */}
      {cta.tail && (
        <>
          {' '}
          <span className="hidden xl:inline">{cta.tail}</span>
        </>
      )}
    </Link>
  );
}

/** W17: picks the page's CTAs by next-intl's internal pathname — the same value on the server
 *  and in the browser, so the SSR markup never differs from hydration. Outside the App Router
 *  (unit tests) the pathname is `null` and the defaults render. Every href in the table is an
 *  internal `Href`, so nothing here is a contact link (placement `header` stays reserved). */
export function HeaderCtas({ table }: { table: CtaTable }) {
  const { primary, secondary } = ctasFor(table, usePathname());
  return (
    <>
      {secondary && (
        <Link href={secondary.href} prefetch={false} className={SECONDARY}>
          {secondary.label}
        </Link>
      )}
      <Primary cta={primary} />
    </>
  );
}
```

`src/design/chrome/Header.tsx` — full file (the `ChromeCta` type and `primaryCta` prop are gone; `Button` is no longer imported):

```tsx
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { resolveCtas } from './ctas';
import { HeaderCtas } from './HeaderCtas';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { navGroup } from './nav';
import { NavLink } from './NavLink';

/** The design promotes these out of the desktop row — three into the slim bar and
 *  `/partner-with-us` into the secondary CTA. All four stay in the hamburger, which reads its
 *  own `hamburger` nav group (T0b: desktopNav + the portal login). */
const PROMOTED = new Set(['/blog', '/careers', '/verify', '/partner-with-us']);

// `text-nav` is `--fs-nav`: 12px between 901 and 1100, the 11px floor from 1101 (W11).
const NAV_LINK =
  'inline-flex min-h-[44px] items-center whitespace-nowrap text-nav font-semibold text-ink no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

export function Header({ locale, bundle }: { locale: Locale; bundle: Bundle }) {
  const t = makeT(bundle);
  // `useTranslations` resolves against the request config on the server and against the
  // provider in tests, so `sys.*` needs no prop drilling here.
  const sys = useTranslations('sys');
  const desktop = navGroup(bundle, 'desktopNav', t).filter((i) => !PROMOTED.has(i.href));
  const hamburger = navGroup(bundle, 'hamburger', t);
  const languageLabel = t('home.016');

  return (
    <header className="sticky top-0 z-40 border-b border-border-3 bg-white">
      <div className="container-site flex items-center justify-between gap-5 py-3">
        <Link href="/" prefetch={false} className="flex-none no-underline">
          {/* 34 × 29 — the asset's own 336 × 285 ratio (see the footer's copy). */}
          <Image src="/brand/ja-mark.png" alt="JobsAdmire" width={34} height={29} priority />
        </Link>
        {/* W11 (closes R46): the row appears from the design's own 901 px. Between 901 and
            1100 the links are 12 px and may wrap onto a second line inside the nav — the
            design's `.ja-nav { flex-wrap: wrap }` below 1100 does the same — while the
            secondary CTA and the primary's tail stay `xl`-only, exactly as the design hides
            `.ja-nav-cta-secondary` and `.ja-cta-long` at ≤1100. `min-w-0 flex-1` is what lets
            the nav shrink and wrap instead of pushing the actions off the viewport; the width
            sweep at 901/1100 is the proof. Below 901 the hamburger carries the same items. */}
        <nav
          aria-label={sys('nav.main')}
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-0 lg:flex xl:gap-x-4"
        >
          {desktop.map((item) => (
            <NavLink key={item.href} item={item} className={NAV_LINK} />
          ))}
        </nav>
        <div className="flex flex-none items-center gap-2">
          {/* the hamburger panel carries the same switcher below lg */}
          <div className="hidden lg:block">
            <LanguageSwitcher locale={locale} label={languageLabel} />
          </div>
          <HeaderCtas table={resolveCtas(t)} />
          <MobileNav
            items={hamburger}
            locale={locale}
            menuLabel={t('hire.239')}
            closeLabel={sys('nav.close')}
            languageLabel={languageLabel}
          />
        </div>
      </div>
    </header>
  );
}
```

`src/design/chrome/SiteChrome.tsx` — line 31 becomes:

```tsx
<Header locale={locale} bundle={bundle} />
```

`src/design/chrome/MobileNav.tsx` — line 29 becomes:

```tsx
    <div className="lg:hidden">
```

`src/app/[locale]/(site)/dev/gallery/page.tsx` — line 207 (after the move; the only `primaryCta` left in `src/`) becomes:

```tsx
<Header locale={locale} bundle={bundle} />
```

`src/app/globals.css` — the `@theme inline` block (lines 58–68) gains one line, the `:root` block (71–82) one, the `1101px` block (83–96) one, and a new `901px` block sits between them:

```css
@theme inline {
  --text-body: var(--fs-body);
  --text-body-lg: var(--fs-body-lg);
  --text-body-sm: var(--fs-body-sm);
  --text-card-title: var(--fs-card-title);
  --text-stat: var(--fs-stat);
  --text-eyebrow: var(--fs-eyebrow);
  --text-nav: var(--fs-nav);
  --text-h1: var(--fs-h1);
  --text-h2: var(--fs-h2);
  --text-h2-process: var(--fs-h2-process);
}

/* Responsive type scale: authored 1:1 up to 1100px, ×0.75 from 1101px (D19). */
:root {
  --fs-body: 16px;
  --fs-body-lg: 17.5px;
  --fs-body-sm: 13.5px;
  --fs-card-title: 18.5px;
  --fs-stat: 34px;
  --fs-eyebrow: 12px;
  --fs-nav: 13.5px;
  --fs-h1: clamp(40px, 4.6vw, 66px);
  --fs-h2: clamp(28px, 3.2vw, 42px);
  --fs-h2-process: clamp(30px, 3.4vw, 46px);
  --gutter: 20px;
}
/* W11: the header's desktop row is on from 901px (the design's own breakpoint); its links
   drop to 12px there so seven of them, the language pills and the primary CTA fit a 1100px
   viewport without the design's zoom hack — a named delta (docs/ARCHITECTURE.md § Quality
   gate). Nothing else changes at 901: this is not a D19 scale step. */
@media (min-width: 901px) {
  :root {
    --fs-nav: 12px;
  }
}
@media (min-width: 1101px) {
  :root {
    --fs-body: 12px;
    --fs-body-lg: 13.13px;
    --fs-body-sm: 11px;
    --fs-card-title: 13.88px;
    --fs-stat: 25.5px;
    --fs-eyebrow: 11px;
    --fs-nav: 11px;
    --fs-h1: clamp(30px, 3.45vw, 49.5px);
    --fs-h2: clamp(21px, 2.4vw, 31.5px);
    --fs-h2-process: clamp(22.5px, 2.55vw, 34.5px);
    --gutter: 48px;
  }
}
```

`src/design/tokens.ts` — `type` (lines 47–56) and `layout` (line 63) become:

```ts
  /** authored (mobile 1:1) and desktop (×0.75, floor 11) sizes — never scale breakpoints */
  type: {
    body: px(16),
    bodyLarge: px(17.5),
    bodySmall: px(13.5),
    cardTitle: px(18.5),
    stat: px(34),
    eyebrow: px(12),
    micro: px(12),
    /** header desktop-row links: authored 13.5, 12 between 901 and 1100 (W11), the 11 floor from 1101 */
    nav: { ...px(13.5), tablet: 12 },
  },
```

```ts
  layout: {
    maxWidth: 1280,
    gutterDesktop: 48,
    gutterMobile: 20,
    hitTarget: 44,
    navRow: 46,
    /** W11 (closes R46): the desktop nav row and hamburger swap at `lg`; the social rail
     *  (and the D19 scale) at `xl`. Must equal `breakpoint.lg` / `breakpoint.xl`. */
    headerRowFrom: 901,
    socialRailFrom: 1101,
  },
```

- [ ] **Step 4: Run the tests + `npm run verify`**

```bash
npx prettier --write src/design src/app/globals.css "src/app/[locale]/(site)/dev/gallery/page.tsx" e2e
npx vitest run
npm run verify
npm run build && (PORT=3000 npm run start &) && sleep 4 && npx playwright test
```

Expected: vitest all green (`ctas.test.ts` 3, `Header.test.tsx` 6, `tokens.test.ts` +1, everything from Cycles 2–3 unchanged; `Button.test.tsx` unchanged — `buttonClassName` is a pure extraction); `verify` green (`grep -rn primaryCta src` prints nothing); Playwright green under both projects including `chrome.spec.ts` (4 cases) and the width sweep at the new 901 column. If the sweep or the chrome case reports overflow at 1100 or 901, the fix is in the header (tighten `gap-x-3` → `gap-x-2.5` at `lg`, or let the language switcher wrap with `lg:flex-wrap` on the actions row) — never by removing 901 from the sweep or raising the threshold back to `xl` (D20 rule: fix the component, not the assertion).

- [ ] **Step 5: Commit**

```bash
git add src/design src/app/globals.css "src/app/[locale]/(site)/dev/gallery/page.tsx" e2e/chrome.spec.ts e2e/width-sweep.spec.ts
git commit -m "feat(chrome): per-page header CTAs from CTA_BY_PATHNAME and the 901px desktop row (W11, W17)

Header drops its primaryCta prop; HeaderCtas (client) resolves the page's primary/secondary
from a route-keyed table through next-intl's usePathname, labels resolved once on the server.
The desktop nav row + language switcher move from xl to lg with 12px links (--fs-nav) that may
wrap inside the nav; secondary CTA and the primary's tail stay xl-only as the design hides
them at ≤1100. tokens gain layout.headerRowFrom/socialRailFrom and type.nav; the width sweep
gains 901. Closes R46.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — Docs in the same change set (W45: sentence anchors on the text Tasks 1 and 2 left)

- [ ] **Step 1: Write the failing test** — none (docs only). The check is `grep`.

- [ ] **Step 2: Run test to verify it fails**

```bash
grep -n -e "(no route group)" -e "no \`(site)\` route group" -e "only appears above \*\*1101px\*\*" -e "is gated at Tailwind's \`xl\`" -e "appears only above 1101px" -e "per-route bundle nav groups beyond" -e "anchors with no click handler" -e "\`410\`/\`noindex\`" -e "16 static routes × 2 locales" CLAUDE.md docs/ARCHITECTURE.md docs/PRD.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/SEO.md
```

Expected: eight hits — CLAUDE.md § Architecture at a glance (Routing) and § Conventions (D20 bullet); ARCHITECTURE.md § Routing paragraph 2, § Chrome header paragraph and § Quality gate named-deltas bullet; PRD.md § 11 "Not yet built" sentence (as Task 2 left it); ANALYTICS.md § Event schema (as Task 2 left it); SEO.md § Sitemap. (The `` `410`/`noindex` `` pattern hits nothing: Task 1 already replaced that CONTENT-MODEL.md § Blog sentence.)

- [ ] **Step 3: Implement** — apply every edit under **Docs in this task** below.

- [ ] **Step 4: Run the tests + `npm run verify`**

```bash
npx prettier --write CLAUDE.md docs/*.md
npm run verify
grep -n -e "(no route group)" -e "no \`(site)\` route group" -e "only appears above \*\*1101px\*\*" -e "is gated at Tailwind's \`xl\`" -e "appears only above 1101px" -e "per-route bundle nav groups beyond" -e "anchors with no click handler" -e "\`410\`/\`noindex\`" -e "16 static routes × 2 locales" CLAUDE.md docs/ARCHITECTURE.md docs/PRD.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/SEO.md
```

Expected: `verify` green (prettier is part of it — the tables must stay aligned), the grep prints nothing.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md docs/ARCHITECTURE.md docs/CONTENT-MODEL.md docs/ANALYTICS.md docs/SEO.md docs/PRD.md
git commit -m "docs(chrome): route groups, nav groups, CTA table, 901px row, contact-click + W26 events (W4, W11, W12, W17, W19, W26)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:** (every anchor is a sentence or fragment as it reads AFTER Tasks 1 and 2 — W45; `grep -n` the anchor before editing, never trust a line number)

- `CLAUDE.md` § Architecture at a glance, **Routing** bullet: replace "`app/[locale]/…` (no route group)." with "`app/[locale]/(site)|(minimal)|(bare)/…` — three route groups whose layouts mount the chrome (`default` / `minimal` without rail + FAB / none) while the locale layout keeps html/body, fonts, providers, `ClientIslands`, the site-wide JSON-LD and `generateStaticParams` (W19)." § Conventions, D20 bullet: replace "the header's desktop row (nav + language switcher) only appears above **1101px** (Tailwind's `xl`, redefined in this repo's theme — **accepted for WP1 only, Ruling R46**: WP2's pixel-comparison pass restores the design's own 901px by matching its nav font-size/padding), the hamburger panel carrying both below it;" with "the header's desktop row (nav + language switcher) appears from the design's own **901px** (`lg`) with 12px links that may wrap inside the nav between 901 and 1100 (W11 — R46 is closed); the secondary CTA and the primary CTA's long form stay `xl`-only as the design hides them at ≤1100; the hamburger panel carries nav + switcher below 901;".
- `docs/ARCHITECTURE.md` § Routing, paragraph 2: replace "(calculator, forms, filters, marquee, and the two chrome islands under Chrome below — there is no `(site)` route group)" with "(calculator, forms, filters, marquee, and the chrome islands under Chrome below). **Three route groups (W19)** sit under `[locale]/`: `(site)/` mounts `<SiteChrome variant="default">` and holds the homepage, `hire-workers/`, `dev/gallery`, the `[...rest]` catch-all and the `not-found.tsx`/`error.tsx` boundaries (a boundary renders inside the layout of the segment it lives in, so they move with the pages — left at `[locale]/` they would replace the chrome on every 404); `(minimal)/` mounts `variant="minimal"` (no social rail, no FAB) and holds `thank-you/` plus, from T13, the four legal pages and the two newsletter one-shots, with its own thin `error.tsx`/`not-found.tsx` that reuse the `(site)` views; `(bare)/` mounts no chrome — only `<main id="main">` — for the portal entry (T13). The locale layout keeps `<html>`/`<body>`, Archivo, `GtmLoader`, the site-wide JSON-LD, `NextIntlClientProvider`, `ClientIslands` and `generateStaticParams`; group layouts call `getBundle(locale)` again, which is the same `cache()`d object. Route groups never appear in URLs." In the same paragraph change "`[locale]/page.tsx` (a placeholder homepage" → "`[locale]/(site)/page.tsx` (a placeholder homepage", "`[locale]/hire-workers` (same)" → "`[locale]/(site)/hire-workers` (same)", "`[locale]/thank-you` (real — the conversion page)" → "`[locale]/(minimal)/thank-you` (real — the conversion page)", "`[locale]/dev/gallery` (component gallery" → "`[locale]/(site)/dev/gallery` (component gallery", "`[locale]/[...rest]` (Ruling R6" → "`[locale]/(site)/[...rest]` (Ruling R6", and "`[locale]/error.tsx` + `[locale]/not-found.tsx` (chrome-preserving error/404 boundaries)" → "`[locale]/(site)/error.tsx` + `[locale]/(site)/not-found.tsx` (chrome-preserving error/404 boundaries, mirrored by thin re-exports in `(minimal)/`)".
- `docs/ARCHITECTURE.md` § Chrome: first sentence "`src/design/chrome/` is mounted once from `[locale]/layout.tsx`, identical on every page" → "`src/design/chrome/` is mounted once per route group from `[locale]/(site)/layout.tsx` and `[locale]/(minimal)/layout.tsx` (W19; `(bare)` mounts none), identical on every page". `SiteChrome` bullet: "`Header` (logo, desktop nav, language switcher, primary/secondary CTA, `MobileNav` hamburger)" → "`Header` (logo, desktop nav from the `desktopNav` group minus the four promoted routes, language switcher, `HeaderCtas`, `MobileNav` hamburger fed the `hamburger` group)". `ClientIslands` bullet: "a _sibling_ of `SiteChrome` mounted directly from the layout, not nested inside it" → "mounted directly from the locale layout after the group layout's children, never nested inside `SiteChrome`". Add after the paragraph that begins "**Every chrome nav row (desktop, hamburger, footer columns) renders through one `NavLink` component**" two new paragraphs: "**Nav lists come from the bundle's nav groups, never from a list in the chrome (W11).** `navGroup(bundle, group, t)` (`src/design/chrome/nav.ts`) reads `desktopNav`/`hamburger` (Header), `slimBarRight` (SlimBar) and `footerEmployers`/`footerCompany` (Footer) sorted by `order`, passes `external` through (the portal login is an `external` row in `hamburger`, `slimBarRight` and `footerEmployers` — W36: no chrome file hard-codes a portal anchor), and drops `/blog` and `/blog/[slug]` from every group while `blogNavVisible(bundle)` is false — fewer than `BLOG_NAV_THRESHOLD = 6` rows of the `blog` collection with `hasBody.tr` (W4). Both are re-exported from `src/content/collections.ts` (W35: one source); the importer already withholds the `/blog` rows below the threshold, so `navGroup`'s filter is the second door for an OPS bundle. The three settings-driven groups (`footerContact`, `mobileBottomBar`, `socialRail`) are ignored: phone, e-mail, WhatsApp and the socials render from `settings`. The one route list still declared in the chrome is the footer legal row's Privacy/Terms pair (`home.218`/`home.219` → `/privacy`, `/terms`, landmark `sys.nav.legal`) — the frozen contract has no `footerLegal` group." and "**Per-page header CTAs (W17).** Pages cannot pass props to a group layout, so `src/design/chrome/ctas.ts` keys the primary/secondary CTA by internal pathname (`CTA_BY_PATHNAME`, `DEFAULT_CTAS`); `Header` resolves the labels once through `resolveCtas(t)` and the `HeaderCtas` client island picks the page's pair through next-intl's `usePathname()` — the internal key, identical on the server and in the browser, so there is no hydration mismatch and no context store. Hrefs are object `Href`s with the design's own anchors (`#request-form`, `#proposal`, `#calculator`, `#tracks`, `#permit-cta`, `#message`, `#report`, `#pool`): the page task that owns a key must render that element id. `/verify` is the only `danger`-face CTA; `buttonClassName` (`src/design/primitives/Button.tsx`) gives these `Link`s the exact `Button` face." Replace the paragraph that begins "**The header's desktop nav row is gated at Tailwind's `xl` breakpoint" (through "…so the row fits below 1101px too.") with: "**The header's desktop nav row is gated at `lg` = 901px (W11, which closes R46).** Between 901 and 1100 the links render at 12px (`--fs-nav` → the `text-nav` utility; 11px from 1101, the floor) and may wrap onto a second line inside the nav (`min-w-0 flex-1 flex-wrap`) — the design's own `.ja-nav { flex-wrap: wrap }` below 1100 — while the secondary CTA and the primary CTA's long form stay `xl`-only, as the design hides `.ja-nav-cta-secondary`/`.ja-cta-long` at ≤1100. `tokens.layout.headerRowFrom` (901) and `socialRailFrom` (1101) record the two boundaries; the width sweep straddles both (901/900 and 1101/1100) and `e2e/chrome.spec.ts` asserts the row/hamburger swap." Add, after the `LanguageHint` paragraph (before the `StickyCtaBar` paragraph, which Task 5 rewrites): "**Contact clicks (W12).** Every `tel:`/`mailto:`/`wa.me` anchor in the slim bar, footer (contact column, WhatsApp button, social row), social rail, WhatsApp FAB and mobile bottom bar renders through `ContactLink` (`src/analytics/ContactLink.tsx`), which classifies the href with `contactKindOf` and fires `call_click`/`email_click`/`whatsapp_click` through `useContactClick(placement)` — `page` from `next/navigation` (R35), `locale` from the provider, `placement` from the closed `CONTACT_PLACEMENTS` tuple that `track()` itself enforces. Non-contact hrefs (Instagram, Telegram…) render as plain anchors. The `header` placement is reserved: every header CTA is an internal `Href`."
- `docs/ARCHITECTURE.md` § Quality gate: item 3's list "no horizontal overflow at 1440/1280/1101/1100/900/700/560/460/390 — 1101 and 1100 straddle the D19 boundary" → "no horizontal overflow at 1440/1280/1101/1100/901/900/700/560/460/390 — 1101/1100 straddle the D19 boundary and 901/900 the header-row boundary (W11)" (Task 7's later rewrite of this section keeps 901 — W45). Named-deltas list: replace the bullet "The **header's desktop row (nav + language switcher) appears only above 1101px**; below it the hamburger panel carries both. Below the D19 boundary the type scale is the authored 1:1 one, and the full row overflows the viewport (47 px at 1100, 125 px at 390) — the design package hides the same two at its own mobile breakpoint." with "The **header's desktop row appears from 901px with 12px links between 901 and 1100** (the design's are 13.5px there, relying on its zoom hack at 1101): seven links, the language pills and the primary CTA fit a 1100px viewport only at 12px, and the row may wrap inside the nav as the design's does. The secondary CTA and the CTA's long form are `xl`-only exactly as designed."
- `docs/CONTENT-MODEL.md` § Bundle shape, `nav` row (Task 1's text): after the sentence ending "`/blog` rows are emitted only when `blogNavVisible` (W4)." append " The chrome reads `desktopNav`, `hamburger`, `slimBarRight`, `footerEmployers` and `footerCompany` through `navGroup()` (`src/design/chrome/nav.ts`, T0c — sorted by `order`, `/blog` re-filtered below the threshold, the portal row rendered from the group, never hard-coded) and ignores the three settings-driven groups. No chrome list is hard-coded except the footer legal pair (`home.218`/`home.219`), for which the frozen schema has no group." § The `sys.*` range, **Chrome** bullet: "`nav.main`, `nav.close`," → "`nav.main`, `nav.close`, `nav.legal` (the footer's Privacy/Terms landmark),". § Chrome canonical ids table: add rows `| Footer legal row — Privacy | \`home.218\` | |`, `| Footer legal row — Terms | \`home.219\` | |`, `| Portal login (nav groups) | \`home.012\` | one row per group (`hamburger`, `slimBarRight`, `footerEmployers`), never a second anchor (W36) |`, `| Header secondary CTA, default | \`home.008\` | |`, `| Header secondary CTA on calculator/partner/contact/verify | \`home.002\` | |`, `| Header CTA per page | \`calc.324\` · \`partner.017\`/\`018\` · \`wp.016\`/\`017\` · \`contact.015\`/\`016\` · \`verify.015\`/\`016\` · \`availworkers.016\` + \`home.003\` | table: `src/design/chrome/ctas.ts` (W17) |`; change the existing "Primary CTA (two-part label)" row's `k`cell to "default →`/hire-workers#request-form`; `/`→`#proposal`". § Blog (Task 1's paragraph — Task 1 already replaced the old `410`/`noindex`sentence, so there is nothing to delete here): in Task 1's FINAL sentence replace "which the importer applies to the nav groups; the chrome (T0c) reads the same function, and the sitemap/robots layer keeps`/blog`unbuilt until the blog page lands (W20/W37)." → "which the importer applies to the nav groups,`navGroup()`(T0c) re-applies in the chrome, and`NOINDEX_PATHNAMES` (`/blog`, `/blog/[slug]`) applies to sitemap/robots — `noindex`, not `410`(R53); the sitemap/robots layer keeps`/blog` unbuilt until the blog page lands (W20/W37), and the flip back is a manual, reviewed edit of that set."
- `docs/ANALYTICS.md` § How that order is realised in code / The consent banner: "is mounted from the same root layout, after `SiteChrome`," → "is mounted from the same locale layout, after the route-group layout that mounts `SiteChrome` (W19),". § Event schema table: append five rows after `language_switch`: `| \`partner_track_select\` | Partner page — a track is chosen | \`page\`, \`locale\`, \`track\` (\`sourcing\` \| \`institute\`) |`, `| \`contact_topic\` | Contact page — a topic is chosen | \`page\`, \`locale\`, \`topic\` (\`hire\` \| \`partner\` \| \`permit\` \| \`job\` \| \`other\`) |`, `| \`eligibility_check_complete\` | Work Permit wizard — a result is shown | \`page\`, \`locale\`, \`result\` (\`eligible\` \| \`conditional\` \| \`ineligible\`) |`, `| \`career_apply_start\` | Careers detail — the application form is opened | \`page\`, \`locale\`, \`slug\` (the opening's public URL segment) |`, `| \`verify_lookup\` | Verify page — a lookup is submitted | \`page\`, \`locale\`, \`outcome\` (\`verified\` \| \`not_found\` \| \`register_unavailable\`) |`; and change the `call_click` row's "Fires on" cell to "Phone tap/click (slim bar, footer, mobile bottom bar, form fallback, page CTAs)". After the paragraph beginning "`page`is`usePathname()` from **`next/navigation`**" add: "**Enum-keyed params (W12/W26).** `placement`, `track`, `topic`, `result`and`outcome`accept only the values in`PARAM_ENUMS` (`src/analytics/track.ts`); `track()`drops anything else before the push, so a typed-in string can never ride under an enum key. The five page events above are declared once, here and in`track.ts`— **pages never extend the allowlist**; a new event or value is a ruling, an edit to`track.ts`and this table in the same change." In Task 2's paragraph beginning "**WP1 wired exactly one of these seven events:`conversion`**", replace the fragment "The others (`generate_lead`, `calculator_use`, `language_switch`, and the chrome placements of the three contact events) are defined in `track.ts`'s allowlist — the contract is frozen — but no chrome component or page calls `track()`for them yet; the header/footer/mobile-bar phone, WhatsApp and email links render as plain`tel:`/`wa.me`/`mailto:`anchors with no click handler. Wiring the remaining six, on all 14 pages once they exist, is a Gate A checklist item (below), not something WP1 shipped." with "The chrome wires the three contact events everywhere else (T0c): every`tel:`/`mailto:`/`wa.me`anchor in the slim bar, footer, social rail, WhatsApp FAB and mobile bottom bar renders through`ContactLink` (`src/analytics/ContactLink.tsx`) and fires `call_click`/`email_click`/`whatsapp_click`via`useContactClick(placement)`with`placement`∈`slimbar | footer | social_rail | whatsapp_fab | bottom_bar` (`form_fallback`is Task 2's panel;`page_cta`/`office_card`are the WP2b blocks;`header`is reserved — every header CTA is an internal link).`generate_lead`, `calculator_use`, `language_switch` and the five W26 page events are declared but still uncalled — they land with the forms kernel's page specs, the calculator page, the switcher work and the pages that own them in WP2b." Then in the next sentence "**Parameter allowlist rule (already enforced today, for every event including the six unwired ones):**" → "**Parameter allowlist rule (already enforced today, for every event, wired or not):**". § Conversion: "`src/app/[locale]/thank-you/page.tsx` whitelists" → "`src/app/[locale]/(minimal)/thank-you/page.tsx` whitelists".
- `docs/SEO.md` § Sitemap: "except the `EXCLUDED` set (`/thank-you`, `/portal-login`, `/newsletter/confirm`, `/newsletter/unsubscribe`) and the dynamic keys" → "except the `EXCLUDED` set (`NOINDEX_PATHNAMES`: `/thank-you`, `/portal-login`, `/newsletter/confirm`, `/newsletter/unsubscribe`, and — W4 — `/blog`, `/blog/[slug]`) and the dynamic keys"; "16 static routes × 2 locales = **32 URLs**" → "15 static routes × 2 locales = **30 URLs**"; "only 4 of those 32 (`/`, `/en`, `/isci-talebi`, `/en/hire-workers`) are real; the other 28 404" → "only 4 of those 30 (`/`, `/en`, `/isci-talebi`, `/en/hire-workers`) are real; the other 26 404" (Task 4's `UNBUILT_PATHNAMES` gating rewrites this paragraph next). § Robots: replace "In production: allow everything except `/api/`, `/portal-girisi`, `/en/portal-login`, `/tesekkurler`, `/en/thank-you`, plus a `sitemap:` pointer. **`/abone-onay`/`/abonelikten-cik`/`/en/newsletter/confirm`/`/en/newsletter/unsubscribe` are not yet in the disallow list** — only `sitemap.ts`'s `EXCLUDED` set keeps them out of the sitemap; those routes don't exist yet either, so there's nothing to crawl today, but robots.ts should gain them in the same WP2 change that ships the newsletter pages." with "In production: allow everything except `/api/` and `noindexExternalPaths(locale)` — `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik`, `/blog` and their `/en/…` forms (`NOINDEX_PATHNAMES`, one set for robots and the sitemap; `/blog/[slug]` is covered by the `/blog` prefix, since a dynamic key is never handed to `getPathname` — W37) — plus a `sitemap:` pointer. `/blog` leaves the set by hand once six Turkish bodies exist (W4); Task 4's `UNBUILT_PATHNAMES` additionally keeps unbuilt routes out of both."
- `docs/PRD.md` § 2, rows 12 and 13 (Blog index / Blog article), Forms column: "Newsletter signup (`NEWSLETTER`)" → "Newsletter signup (`NEWSLETTER`) — `noindex` + out of every chrome list below 6 Turkish bodies (W4)" on both rows. § 11 WP1 delivered, Design system bullet: "the 900px/1101px breakpoint scheme" → "the 901px (header row, W11) / 1101px (D19 scale, social rail) breakpoint scheme" (Task 5/6 later extend the same bullet — they anchor on the primitives count, not on this phrase). § 11 "Not yet built" sentence (as Task 2 left it): ", the synthetic-lead cron and daily digest, and per-route bundle nav groups beyond `desktopNav`." → ", and the synthetic-lead cron and daily digest (the nav groups shipped in WP2a: T0b fills all five route groups, T0c's chrome reads them)." (Task 4 appends its OG/Article/JobPosting clause to the same sentence — W45.)

**Produces — deviations:** (1) `(bare)/layout.tsx` renders `<main id="main">{children}</main>` rather than a bare fragment, so R31's one-`<main>` guarantee stays with the layouts and the portal page (T13) does not render its own; (2) `PageCtas.secondary` is `CtaLink | null | undefined` (undefined inherits the default secondary, null removes it) and `CtaLink` gains optional `tailId`/`variant` — the skeleton's `{ labelId; href }` shape is a subset; (3) additive extras not in the skeleton: `resolveCtas`/`ctasFor`/`CtaTable`, `HeaderCtas`, `nav.ts` (`navGroup` + the W35 re-exports), `ContactLink`, `contactKindOf`, `isNoindexPathname`/`noindexExternalPaths`/`StaticPathname` (robots consumes `noindexExternalPaths` instead of mapping `NOINDEX_PATHNAMES` directly, because `/blog/[slug]` is not a `getPathname` href), `buttonClassName`, `tokens.type.nav`/`tokens.layout.headerRowFrom`/`socialRailFrom`, `sys.nav.legal`, `PARAM_ENUMS`/`EnumParam` + the value guard in `track()` (W26 asked for the events; the guard is what makes "enum-only" true in code rather than by discipline), `ContactPlacements.test.tsx`; (4) `Header` loses its `primaryCta` prop and the `ChromeCta` type (the skeleton says "resolves via usePathname", which makes the prop dead); (5) the `header` placement is enumerated but unused — every header CTA is an internal `Href`; (6) W35: `BLOG_NAV_THRESHOLD`/`blogNavVisible` are re-exports of Task 1's, not definitions — `nav.test.ts` therefore feeds full T0b blog rows; (7) W36: `SlimBar`/`Footer` render no hard-coded portal anchor — the skeleton's "Footer/SlimBar/MobileNav read `bundle.nav` groups" holds for SlimBar/Footer/Header; `MobileNav` itself still receives `items` from `Header` (the `hamburger` group) rather than reading the bundle, because no bundle crosses into the client island (D6); (8) `NOINDEX_PATHNAMES` is typed `satisfies readonly (keyof typeof pathnames)[]`, no longer `readonly Href[]` — consumers go through `noindexExternalPaths` (W37); (9) the `e2e/seo.spec.ts` edit is the sitemap case only — no `Disallow: /blog` assertion (W37); (10) `CONTACT_PLACEMENTS` is `PARAM_ENUMS.placement` (one tuple, two names) so the chrome's type and `track()`'s guard can never drift.

---

