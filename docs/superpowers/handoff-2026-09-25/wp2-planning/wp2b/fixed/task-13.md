### Task 13: Portal entry + legal pages + newsletter routes — `/portal-girisi` · `/gizlilik` · `/kullanim-kosullari` · `/kvkk` · `/cerez-politikasi` · `/abone-onay` · `/abonelikten-cik` (+ their `/en/…` forms)

**Where this task runs.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` (HEAD ≥ `7bacd7e`, plus T1). Execution order W99: T1 → **T13** → T2 → … — so WP2a Tasks 1–9 and T1 (Homepage) are in the tree when this task starts: T1 created `docs/SEO.md`'s `## Pages` table (W98 columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`), `docs/ANALYTICS.md`'s `### Page instrumentation (WP2b)` list, the per-page `sys.*` bullet list at the end of `docs/CONTENT-MODEL.md` § `### Adding copy (W9, W23, W54)`, the `## Ledger` table of `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, the `e2e/pages/` folder and its own `GATE_ROUTE_TABLE` rows. This task runs second because the chrome already links here: the slim bar, hamburger and footer portal rows are the internal `/portal-login` (W88, as built), the footer's legal pair is `/privacy` + `/terms`, the consent sheet links `/cookie-policy`, every form's consent row links `/privacy` (W79) — all of them 404 through `[...rest]` until this task lands. Rules for the whole task: one heavy job at a time (memory rule); never push; never `git stash`; never rewrite a commit (W118); every commit verify-green; the implementer runs `npx prettier --write <the files the cycle touched>` before the verify line (the snippets below are not guaranteed to be prettier-formatted: `printWidth` 100, single quotes, trailing commas).

**Preconditions (owner checks, W175).** `privacy@jobsadmire.com` exists. The Privacy policy's contact section (`sys.legal.privacy.sections.contact`) publishes it as an "Alternative e-mail" beside `{email}`, so the owner confirms the mailbox exists before this task executes, and the controller's execution brief for T13 states the answer. Confirmed: Cycle 4 ships the bullet exactly as written. Not confirmed, or no answer stated when Cycle 4 starts: Cycle 4 applies its **W175 fallback** (Step 3, after the two `legal` blocks) — the "Alternative e-mail" bullet is dropped in BOTH `src/messages/tr.json` and `src/messages/en.json`, only `{email}` stays, and the key-set test flips its one constant (Step 1). Nothing else in this task depends on the mailbox. The GA4 "redact the `token` query parameter" item is not a precondition of this task: it sits on T15's Gate A owner checklist (W175), because the newsletter mail links carry a per-subscriber secret in `page_location`.

**What ships — three route families, none of them a D27 pixel-harness page (Fable side-by-side review):**

1. **`/portal-girisi` · `/en/portal-login`** — the `(bare)` route group (W19: no chrome; `(bare)/layout.tsx` owns `<main id="main">`, the page renders none). A **link-only chooser** (W8, D22, I15): the design's dark brand panel (eyebrow, the page's one h1, sub, the partner check-list, the account-manager WhatsApp line, the mobile-app card with a local QR, the licence chip) beside a white chooser column (back link, language switcher, "Sign in" heading, ONE Partner Portal tile whose two same-tab links go to `settings.portal.host + loginPath` and `+ forgotPath`, the help card, the anti-phishing note and the licence foot). No credential form, no reset flow, no lockout, no session-reason banner, no e-mail-domain detection, no Operations tile, no ChatAdmire/desk tile (D22). `noindex` (page record + forced in `generateMetadata`), already in `NOINDEX_PATHNAMES`.
2. **`/gizlilik` · `/kullanim-kosullari` · `/kvkk` · `/cerez-politikasi`** (+ `/en/privacy|terms|kvkk|cookie-policy`) — the `(minimal)` group (`SiteChrome variant="minimal"`: header, footer, slim bar, mobile bar; no social rail, no FAB). Privacy and Terms are **seeded from the old site's JSON** on `origin/main-backup` — `public/locales/{en,tr}/privacy.json` (the `privacy.page` object, "Last Updated 27 September 2025", 16 numbered sections) and `public/locales/en/terms.json` (16 sections; `tr/terms.json` is byte-identical to the English — never translated) — re-authored into `sys.legal.privacy.*` / `sys.legal.terms.*` in the company-as-"JobsAdmire" voice (W154: `voice.test.ts` covers every `sys.*` string, so the seed's "we/our/us" and "biz/-iz" forms cannot ship), with every identifier read from settings (D17). The TR Terms route shows the English text, spelled out in `tr.json` (W107), marked `lang="en"`, under a Turkish notice that is a named placeholder (§10 row 6 auto-default). KVKK and Cookie Policy are **counsel placeholders** (D14, `data-placeholder`); the cookie page carries the minimal notice §10 row 6 names. Every "last updated" date is `sys.legal.<doc>.updatedAt` (an ISO date) through `formatDate` (D17). Indexable, one `Breadcrumbs` block each (BreadcrumbList JSON-LD).
3. **`/abone-onay` · `/abonelikten-cik`** (+ `/en/newsletter/confirm|unsubscribe`) — `(minimal)` group, `noindex`. The mail-link `?token=` is forwarded to Operations **only when the visitor presses the page's button** (a `'use server'` action called from a click handler — never on load, render or prefetch; a mail-link scanner would otherwise spend the one-shot confirm token, W5/I12). The mail client's **RFC 8058 one-click POST** to the unsubscribe *page* URL is rewritten by `src/proxy.ts` to `POST /api/newsletter/unsubscribe` and forwarded as a body-less POST. The door's answers render inline; 400/410/`UNKNOWN`/unreachable/unconfigured show the manual `info@jobsadmire.com` + WhatsApp fallback (I12: never a silent no-op). No `/tesekkurler`, no `generate_lead` (a token click is not a lead, D13).

**Design deltas (recorded for the side-by-side review, D20/D27):** (1) the design's sign-in/reset forms, lockout, remember-me, Caps-Lock detector, session banner, domain auto-detect and the Operations/desk tiles are not built (D22, W8, I15); the tile's CTA is `sys.portal.signIn` and the card sub is `sys.portal.intro` (`crmlogin.003` describes the removed multi-portal choice); (2) the h1 (`crmlogin.047`) stays visible on phones (D20 — one visible h1; the design hides the headline block ≤700 px) and the chooser's top bar (back link + language switcher) stays at every width (the design swaps it for a brand-panel top bar ≤700 px); (3) the app card is Android-only — `StoreBadges` (`hire.240`) plus a local QR of the Play Store URL (W8, W14); no App Store badge, no `crmlogin.063` ("iOS 15+" — no target), no `crmlogin.017/018` (the block owns its label); from 901 px it sits in the brand panel with the QR, below 901 px it folds into a native `<details>` without the QR (the design's ≤700 px accordion, used for the whole ≤900 px range so there is one mechanism; scanning the phone you are holding is pointless); (4) the help card is always open (the design folds it ≤700 px); (5) the trust line is `crmlogin.014` + a WhatsApp CTA (`crmlogin.012`) — `crmlogin.016` ("~10 min", no signed SLA, D17) and the catalogue-less hours text are dropped; (6) store badges on the dark surfaces use `StoreBadges tone="light"` (white) instead of the design's translucent ones, the eyebrow is the `sky` token (design #4fb4e4), desktop paddings are normalised ×0.75 from 1101 px (D19); (7) the legal and newsletter pages have no design — a `(minimal)`-chrome text layout (`Section tone="light"`, 760 px / 720 px measure).

**Ops door facts this task binds to** (read on `jobsadmire-operations` `apps/backend/src/modules/website/newsletter/`, 2026-09-28): `@Public()` + `WebsiteModuleEnabledGuard` + `WebsiteApiGuard` at class level (module off → bare 404; the write token is required as `Authorization: Bearer`). `GET /api/website/v1/newsletter/confirm?token=` → 200 `{ data: { outcome: 'CONFIRMED' | 'ALREADY_CONFIRMED' } }`, 400 `{ code: 'NEWSLETTER_TOKEN_INVALID' }` (unknown hash or an unsubscribed row), 410 `NEWSLETTER_TOKEN_EXPIRED` (48 h TTL). `GET` or `POST /api/website/v1/newsletter/unsubscribe?token=<subscriberId>.<hmac>` → 200 `{ data: { outcome: 'UNSUBSCRIBED' | 'ALREADY_UNSUBSCRIBED' | 'UNKNOWN' } }`, 400 on a bad signature, 503 when `ENCRYPTION_KEY` is missing; the POST is the RFC 8058 forward (`@HttpCode(200)`, body never read). `NewsletterTokenQueryDto.token`: string, length 16–200; confirm tokens are 32 base64url characters, unsubscribe tokens `<id>.<base64url hmac>`. Every route answers `Cache-Control: private, no-store`; `@Throttle` 30/min/IP (inert until `RATE_LIMITING_ENABLED`). The routes never read the token class — **a test-class smoke run must never carry a real subscriber's token**. The mail links are `${WEBSITE_SITE_URL}[/en]` + `NEWSLETTER_PATHS` (`/abone-onay`, `/newsletter/confirm`, `/abonelikten-cik`, `/newsletter/unsubscribe`) + `?token=<urlencoded>` — a verbatim mirror of this repo's `pathnames`; never change one side alone. `List-Unsubscribe: <unsubscribeUrl>, <mailto:info@jobsadmire.com?subject=unsubscribe>` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`.

**Files:**

Create
- `src/app/[locale]/(bare)/portal-login/page.tsx`
- `src/app/[locale]/(minimal)/_legal/LegalDocument.tsx`, `src/app/[locale]/(minimal)/_legal/load.ts`
- `src/app/[locale]/(minimal)/privacy/page.tsx`, `terms/page.tsx`, `kvkk/page.tsx`, `cookie-policy/page.tsx` (all under `src/app/[locale]/(minimal)/`)
- `src/app/[locale]/(minimal)/newsletter/_components/NewsletterPage.tsx`, `NewsletterAction.tsx`, `OutcomePanel.tsx`
- `src/app/[locale]/(minimal)/newsletter/confirm/page.tsx`, `src/app/[locale]/(minimal)/newsletter/confirm/actions.ts`
- `src/app/[locale]/(minimal)/newsletter/unsubscribe/page.tsx`, `src/app/[locale]/(minimal)/newsletter/unsubscribe/actions.ts`
- `src/app/api/newsletter/unsubscribe/route.ts`
- `src/lib/legal/body.ts`, `src/lib/legal/documents.ts`
- `src/lib/newsletter/types.ts`, `classify.ts`, `copy.ts`, `one-click.ts`, `forward.ts` (all under `src/lib/newsletter/`)
- `e2e/pages/portal.spec.ts`, `e2e/pages/legal.spec.ts`, `e2e/pages/newsletter.spec.ts`

Modify
- `src/messages/en.json`, `src/messages/tr.json` — seven members inside the existing `sys.seo` object; three new `sys` namespaces `portal`, `legal`, `newsletter` (138 leaves per locale)
- `src/lib/seo/routes.ts` — seven keys leave `UNBUILT_PATHNAMES` (`'/portal-login'`, `'/privacy'`, `'/terms'`, `'/kvkk'`, `'/cookie-policy'`, `'/newsletter/confirm'`, `'/newsletter/unsubscribe'`; 19 → 12)
- `src/proxy.ts` — the RFC 8058 one-click rewrite, first check inside `proxy()`
- `src/app/[locale]/(bare)/layout.tsx`, `src/design/chrome/Footer.tsx` — one stale comment each (no code change)
- `e2e/routes.ts` — 14 rows appended to `GATE_ROUTE_TABLE`
- `e2e/seo.spec.ts` — the production branch of the `robots.txt` test asserts the six new `Disallow` lines
- `docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md`, `docs/PRD.md`, `docs/PRIVACY.md`, `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (ledger)

Test
- `src/messages/task13-keys.test.ts` (grows over Cycles 1, 4, 6)
- `src/lib/legal/body.test.ts`, `src/lib/legal/documents.test.ts`
- `src/app/[locale]/(minimal)/_legal/__tests__/LegalDocument.test.tsx`
- `src/lib/newsletter/classify.test.ts`, `copy.test.ts`, `one-click.test.ts`, `forward.test.ts`
- `src/app/[locale]/(minimal)/newsletter/_components/__tests__/NewsletterAction.test.tsx`
- `src/app/api/newsletter/unsubscribe/route.test.ts`
- `src/proxy.test.ts` (one new `describe`)
- `e2e/pages/portal.spec.ts`, `e2e/pages/legal.spec.ts`, `e2e/pages/newsletter.spec.ts` (run in the Cycle 7 proof session — W126: one build per task)
- Existing guards that must stay green: `src/lib/seo/unbuilt.test.ts`, `src/app/robots.test.ts`, `src/app/sitemap.test.ts`, `src/messages/messages.test.ts` (parity), `src/messages/voice.test.ts` (W154), `src/i18n/client-messages.test.ts` (W148), `src/design/__tests__/class-collisions.test.ts` (W155), `src/design/__tests__/client-imports.test.ts` (W156)

**Interfaces:**

Consumes (exact names, read in the code at `7bacd7e`):
- `getBundle(locale)`, `makeT(bundle)`, `makeTf(bundle, locale)` from `@/content/adapter` (`server-only`; `makeTf` fills `crmlogin.055` `{placed}` and `crmlogin.057` `{replySlaHours}` from `metrics`, D17). `PAGE_KEYS`, `PAGE_PATHNAME` from `@/content/collections` (tests only). Page records (both bundles): `portal`, `newsletterConfirm`, `newsletterUnsubscribe` = `robots: 'noindex'`, `jsonLd: []`; `privacy`, `terms`, `kvkk`, `cookiePolicy` = `robots: 'index'`, `jsonLd: ['breadcrumb']`; all seven `titleId: ''`, `descriptionId: ''` → `buildMetadata` uses the page's `sys.seo.<pageKey>.*` fallbacks (W38).
- `settings` (contract `SettingsSchema`): `email`, `phoneDisplay`, `whatsappNumber`, `licence.{permitNo, lawRef, taxNo}`, `storeLinks.{android, ios}` (android = the Play Store URL, ios = `null`), `portal.{host, loginPath, forgotPath}` (`https://portal.jobsadmire.com`, `/auth/login`, `/auth/forgot-password`).
- `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (`@/lib/seo/metadata`); `type Href`, `UNBUILT_PATHNAMES`, `NOINDEX_PATHNAMES` (portal + both newsletter keys already listed), `robotsDisallowPaths` (`@/lib/seo/routes`).
- `routing`, `locales`, `pathnames`, `type Locale` (`@/i18n/routing`); `Link` (`@/i18n/navigation`).
- `Breadcrumbs({ locale, items: Crumb[], tone?, className? })` (`@/design/blocks/Breadcrumbs` — renders the labelled trail + the BreadcrumbList node; reads `sys.nav.breadcrumbs`); `ContactCta({ placement: 'page_cta', href, variant?, size?, external?, className?, 'aria-label'?, children })` (`@/design/blocks/ContactCta`); `StoreBadges({ bundle, locale, android, ios?, tone? })` (`@/design/blocks/StoreBadges`, tones `dark|light`, reads `hire.240`).
- `Button({ variant, size?, href?, external?, type?, disabled?, prefetch?, …HTMLAttributes })` and `buttonClassName(variant, size?, className?)` (`@/design/primitives/Button`; variants `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`); `Section({ tone: 'light'|'dark'|'pale'|'band', id?, className?, children })` (`@/design/primitives/Section`).
- `LanguageSwitcher({ locale, label, variant? })` (`@/design/chrome/LanguageSwitcher`, client). `QrCode({ text, label, size?, className? })` (`@/design/QrCode`, `server-only`). `BRAND.mark` (`@/design/assets/brand`, `/brand/ja-mark.png`, 336 × 285).
- `ContactLink` (`@/analytics/ContactLink`, client; `Omit<AnchorHTMLAttributes, 'href'|'onClick'|'onAuxClick'> & { href; placement; children }`).
- `formatDate(iso, locale)` (`@/lib/format/date/formatDate`). `waLink(number, text)`, `mailLink(email, subject?)` (`@/lib/contact`).
- `doorConfig(env?)` + `type DoorConfig` (`@/forms/env`, `server-only`); `ATTEMPT_TIMEOUT_MS` (9000) and `MAX_ATTEMPTS` (2) (`@/forms/post`, W74/W117); `isTimeout(err)` (`@/forms/visitor`).
- `src/proxy.ts`: default `proxy(request)`, `DOCUMENT_SECURITY_HEADERS`, the private `withDocumentHeaders(res)` (W160), the matcher `/((?!api|_next|_vercel|.*\..*).*)`.
- `CLIENT_SYS` (`@/i18n/client-messages`) — unchanged by this task.
- Test helpers `testBundle()` (`@/test/bundle`), `renderWithIntl(ui, { locale })` (`@/test/render`); `createTranslator` from `next-intl`.
- Gate tooling: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), `npm run gate`, `npm run js-size` (+ `--routes=<list>`, W94), `scripts/launch/dead-targets.launch-check.ts` (W152/W158), the page-markup contract (`h1[data-testid="page-h1"]`, exactly one `data-lcp-slot`, named `data-placeholder`).
- Package ids `crmlogin.*` + `home.016` (+ `hire.240` inside `StoreBadges`) + `about.021` (the legal pages' Home crumb — the package string every page's own crumb carries, "Ana Sayfa" / "Home", W109/W176; not `sys.nav.home`, which reads "Ana sayfa"); `sys.whatsapp.prefill`.

Produces (later tasks rely on):
- `src/lib/newsletter/*` — `forwardNewsletterToken(kind, token, deps?)`, `classifyNewsletterResponse`, `isPlausibleToken`, `isOneClickValue`, `ONE_CLICK_PATHS`, `isOneClickUnsubscribe`, `NEWSLETTER_STATES`, `stateCopyKey`, `resultState` and the types in `types.ts` — T14's staging smoke of these routes (a throw-away subscriber only, never a real token) and T15's launch sweep use them.
- `src/lib/legal/*` + `src/app/[locale]/(minimal)/_legal/*` — counsel copy lands by replacing `sys.legal.<doc>.*` values in both files and removing the page's `notice`; no other code change.
- `POST /api/newsletter/unsubscribe` + the proxy's method-aware rewrite (ARCHITECTURE § Routing).
- Seven built routes: `UNBUILT_PATHNAMES` 19 → 12; robots.txt names `/portal-girisi`, `/abone-onay`, `/abonelikten-cik` (+ `/en/…`) by itself (W20/W37); the sitemap gains the eight legal URLs; `gate:launch`'s dead-target sweep no longer lists the chrome's portal, privacy and terms links (W152).

**Rulings applied:**
- **W5** — confirm/unsubscribe pages built now, click-to-forward only, plus the RFC 8058 handler; the newsletter band stays hidden elsewhere.
- **W8 / D22 / I15** — one Partner Portal tile that links out (same tab); Android badge only; no Operations or ChatAdmire link, no credential UI.
- **W14** — the QR is the local server-rendered `QrCode`; the Play Store glyph is `StoreBadges`' inline SVG.
- **W19 / R31** — portal in `(bare)`, legal + newsletter in `(minimal)`; the group layouts own `<main>`, no page renders one.
- **W20 / W37** — each cycle deletes its own keys from `UNBUILT_PATHNAMES` in the commit that adds the page (`unbuilt.test.ts`); robots.txt then names the noindex paths by itself.
- **W21** — 14 rows appended to `GATE_ROUTE_TABLE` (portal and newsletter rows `indexable: false`).
- **W9 / W23 / W54** — composed copy in `sys.portal.*`, `sys.legal.*`, `sys.newsletter.*` and `sys.seo.<pageKey>.*`, both locales; package strings by exact id through `makeT`/`makeTf`.
- **W38** — every page's title/description falls back to its `sys.seo.<pageKey>.*` pair.
- **W55 / D26** — named placeholders `legal-terms-tr` (TR Terms), `legal-kvkk`, `legal-cookie-policy`; never on the LCP slot.
- **W74 / W117 / W105** — the newsletter forward uses the kernel's retry rule (one shared 9 s deadline, one retry only after a connection-level failure, a timeout or any answer final); the draft's "W3 8 s budget" wording is gone.
- **W76 / W95** — no token and no visitor data in any DOM href: the WhatsApp/mailto fallbacks carry static sys prefills; the language switch drops `?token=`.
- **W79** — the forms' consent link `/privacy` and the consent sheet's `/cookie-policy` resolve from this task on; no form links `/kvkk` (placeholder).
- **W80 / W176** — W80's `sys.nav.home` is NOT the legal pages' Home crumb: W176 replaces it with the package Home string every other page's own crumb uses (`about.021`, "Ana Sayfa" / "Home"), so the BreadcrumbList names match across the site; `sys.nav.home` ("Ana sayfa") stays the not-found page's link only.
- **W88** — the chrome's portal rows already point at the internal `/portal-login`; the draft's "portal rows go external" foundation gap is deleted.
- **W90 / W148** — `sys.legal.*` and `sys.seo.*` (and this task's `sys.portal.*`, `sys.newsletter.*`) are read by server components only; the newsletter island receives resolved strings as props (the `LogoMarquee` pattern), so `CLIENT_SYS` is unchanged and no page's RSC payload grows.
- **W92 (+ check.md #148)** — previews are door-less; the newsletter and one-click e2e accept both the door-less answer (`unavailable` / 503 `unconfigured`) and the `staging` answer for a dummy token (`invalid` / 400) — dummy token only.
- **W94** — the noindex routes' js-size comes from `npm run js-size -- --routes=…`.
- **W98** — docs append to T1's shared shapes (SEO pages table, ANALYTICS page-instrumentation list, CONTENT-MODEL per-page list, the ledger table); every doc edit anchors on a sentence (W45).
- **W99** — this task runs right after T1.
- **W104** — the robots e2e keeps the portal and newsletter `Disallow` lines.
- **W107** — the TR `sys.legal.terms.sections` are spelled out in full (the English text); a test pins TR = EN for the Terms body.
- **W109 / W176** — each legal page's own (last) crumb is its own title (`sys.legal.<doc>.title`); the first crumb is the package Home string, one id for all four pages (`LEGAL_HOME_CRUMB_ID = 'about.021'` in `src/lib/legal/documents.ts` — the legal pages have no package of their own, and every page's own Home id carries the same text); one `Breadcrumbs` per page (WP2a final review §6 page rule — one BreadcrumbList node).
- **W113** — test ids sit on inner `div`s, never on `Section`.
- **W119 / W122 / W155** — hiding uses media variants (`max-lg:hidden`, `max-md:hidden`, `lg:hidden`) beside a base display; no class string sets one property twice at one variant; a different look is a `Button` variant or a complete per-face class string.
- **W120 / W136** — the ledger's JS figure is `npm run js-size`'s.
- **W125** — no server module imports `@/analytics/useContactClick`; `ContactCta`/`ContactLink` classify hrefs.
- **W126** — one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `npm run gate` — Cycle 7.
- **W134 / W147 / W156** — primitives, blocks and the date function imported by module path; the drafts' barrel imports and `@/lib/format/date` are gone.
- **W145** — the eight legal routes carry the LCP ≤ 2,500 ms / performance ≥ 0.95 assertions (DevTools throttling, median of three).
- **W146** — GTM stays dark on the gated face; the GA4 `page_location` redaction of `token` is recorded as an owner item (and, W175, on T15's Gate A owner checklist).
- **W175** — the `privacy@jobsadmire.com` mailbox is an owner check before this task executes (Preconditions above); Cycle 4 ships the "Alternative e-mail" bullet only when it is confirmed, otherwise it drops it in both locales and keeps `{email}`.
- **W150** — no D17 dated badge on these pages → no `revalidate`.
- **W152 / W158** — after this task the dead-target sweep lists none of `/portal-girisi`, `/gizlilik`, `/kullanim-kosullari` and their `/en/…` forms.
- **W154** — every new `sys.*` string names "JobsAdmire" (TR: "JobsAdmire", "ekip"), never we/us/our/biz or a first-person-plural verb or possessive; the seeded legal copy is re-authored in the third person (`voice.test.ts`).
- **W157 / W160** — the one-click rewrite response gets the three document headers like every response `proxy()` returns.
- **D13** — no thank-you navigation and no `generate_lead` for a token click. **D14 / §10 row 6** — Privacy + Terms seeded, KVKK + cookie policy counsel placeholders, EN-only Terms on the TR route with a notice. **D17** — identifiers from settings, dates from `updatedAt` keys, metrics through `makeTf`. **D20** — h1 visible on phones; the a11y deltas above. **D27** — side-by-side review, no pixel harness. **R18** — hydration read through `useSyncExternalStore`. **R22** — the portal links open in the same tab.

---

#### Cycle 1 — Portal entry page (`(bare)/portal-login`)

- [ ] **Step 1: Write the failing tests**

`src/messages/task13-keys.test.ts` (new — Cycles 4 and 6 replace it with larger versions):

```ts
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import type { Locale } from '@/i18n/routing';
import en from './en.json';
import tr from './tr.json';

/**
 * T13's `sys.*` keys (W9/W23). Every one is read by a server component through
 * `getTranslations('sys')` — never by a client island (W90/W148) — so a missing key would render
 * a MISSING_MESSAGE string that no e2e text check reliably catches. Pinned per locale here, each
 * formatted through next-intl itself with an `onError` that throws.
 */
const MESSAGES: Record<Locale, Messages> = { tr, en };

const PORTAL_KEYS = ['seo.portal.title', 'seo.portal.description', 'portal.intro', 'portal.signIn'];

function translator(locale: Locale) {
  return createTranslator({
    locale,
    messages: MESSAGES[locale],
    namespace: 'sys',
    onError: (error) => {
      throw error;
    },
  });
}

describe('T13 sys keys — portal entry (W9/W23)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: every key is a non-empty, fully formatted string`, () => {
      const t = translator(locale);
      for (const key of PORTAL_KEYS) {
        const value = t(key);
        expect(value.trim().length, key).toBeGreaterThan(0);
        expect(value, key).not.toMatch(/[{}]/);
      }
    });
  }
});
```

`e2e/pages/portal.spec.ts` (new):

```ts
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
      await expect(page.getByTestId('portal-app-desktop').locator('svg[role="img"]')).toHaveCount(1);
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
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/messages/task13-keys.test.ts
```
Expected: FAIL — `sys.seo.portal.*` / `sys.portal.*` do not exist (the translator's `onError` throws `MISSING_MESSAGE`). The e2e spec needs a build; it runs in Cycle 7 (W126). `src/lib/seo/unbuilt.test.ts` is green today and would turn red the moment the page exists without its key leaving `UNBUILT_PATHNAMES` — both land in Step 3.

- [ ] **Step 3: Implement**

`src/messages/en.json` — merge these members into the existing `sys.seo` object (it holds `ogTagline` and whatever T1 added):

```json
{
  "portal": {
    "title": "Partner Portal sign-in | JobsAdmire",
    "description": "Sign in to the JobsAdmire Partner Portal: agreements, candidates and permit status in one place."
  }
}
```

and add this member to `sys` (a sibling of `form`, after the last existing key):

```json
{
  "portal": {
    "intro": "Partner accounts sign in on the JobsAdmire Partner Portal — the link below opens its login page.",
    "signIn": "Sign in to the Partner Portal"
  }
}
```

`src/messages/tr.json` — the same two additions:

```json
{
  "portal": {
    "title": "İş Ortağı Portalı girişi | JobsAdmire",
    "description": "JobsAdmire İş Ortağı Portalı'na giriş: sözleşmeler, adaylar ve izin durumu tek yerde."
  }
}
```

```json
{
  "portal": {
    "intro": "İş ortağı hesapları JobsAdmire İş Ortağı Portalı'nda oturum açar; aşağıdaki bağlantı portalın giriş sayfasını açar.",
    "signIn": "İş Ortağı Portalı'na giriş yapın"
  }
}
```

`src/app/[locale]/(bare)/portal-login/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf } from '@/content/adapter';
import { BRAND } from '@/design/assets/brand';
// By module path, never the barrels (W134/W147/W156).
import { ContactCta } from '@/design/blocks/ContactCta';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { LanguageSwitcher } from '@/design/chrome/LanguageSwitcher';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { QrCode } from '@/design/QrCode';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Bundle } from '../../../../../contract/website-bundle.v1';

/** The partner check-list (crmlogin.049–052) and the mobile-app points (crmlogin.060–062). */
const POINT_IDS = ['crmlogin.049', 'crmlogin.050', 'crmlogin.051', 'crmlogin.052'] as const;
const APP_POINT_IDS = ['crmlogin.060', 'crmlogin.061', 'crmlogin.062'] as const;

/** The app card's two faces — translucent on the navy brand panel, navy on the white chooser
 *  column (the design's ≤900 px card). One complete class string per face (W122). */
const APP_SURFACE = {
  panel: 'flex items-center gap-4 rounded-md border border-white/15 bg-white/[0.06] p-4 text-white',
  card: 'flex items-center gap-4 rounded-md bg-navy p-4 text-white',
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return {
    ...buildMetadata({
      locale,
      href: '/portal-login',
      bundle,
      pageKey: 'portal',
      fallbackTitle: sys('seo.portal.title'),
      fallbackDescription: sys('seo.portal.description'),
    }),
    // W8 / spec §3.1: the portal door is never indexed, whatever a later page record says —
    // robots.txt disallows it and the sitemap omits it (NOINDEX_PATHNAMES).
    robots: { index: false, follow: false },
  };
}

function CheckDot() {
  return (
    <span
      aria-hidden="true"
      className="mt-px flex h-[19px] w-[19px] flex-none items-center justify-center rounded-pill border border-sky/45 bg-blue/20 text-sky"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 flex-none"
    >
      <rect x="4" y="10" width="16" height="11" rx="2.4" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-auto flex-none text-text-tertiary transition-transform group-open:rotate-180"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** The design's "Get the mobile app" card (partner portal only): the Play Store badge — Android
 *  only, W8 — and, on the wide brand panel, a local QR of the same link (W14). */
function AppCard({
  bundle,
  locale,
  t,
  android,
  qr,
  surface,
}: {
  bundle: Bundle;
  locale: Locale;
  t: (id: string) => string;
  android: string;
  qr: boolean;
  surface: keyof typeof APP_SURFACE;
}) {
  return (
    <div className={APP_SURFACE[surface]}>
      {qr ? (
        <QrCode
          text={android}
          label={t('crmlogin.030')}
          size={82}
          className="flex-none overflow-hidden rounded-xs"
        />
      ) : null}
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[1.2px] text-sky">
          <span aria-hidden="true" className="block h-[7px] w-[7px] rounded-pill bg-success" />
          {t('crmlogin.011')}
        </p>
        <p className="mt-2 text-body-sm leading-snug font-extrabold">{t('crmlogin.059')}</p>
        <ul className="mt-2 flex list-none flex-col gap-1 p-0">
          {APP_POINT_IDS.map((id) => (
            <li key={id} className="flex items-start gap-2 text-body-sm text-white/70">
              <span
                aria-hidden="true"
                className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-pill bg-sky"
              />
              <span>{t(id)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          {/* W8/D22: Android only — no App Store badge and no crmlogin.063 ("iOS 15+"). */}
          <StoreBadges bundle={bundle} locale={locale} android={android} ios={null} tone="light" />
        </div>
      </div>
    </div>
  );
}

export default async function PortalLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeT(bundle);
  // D17: crmlogin.055 carries {placed}, crmlogin.057 {replySlaHours} — filled from `metrics`.
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  // W8/I15: the page only links out — the portal host's own login and forgot-password pages.
  const loginHref = `${settings.portal.host}${settings.portal.loginPath}`;
  const forgotHref = `${settings.portal.host}${settings.portal.forgotPath}`;
  const android = settings.storeLinks.android;
  // W76/W95: a static prefill — nothing a visitor typed ever sits in a DOM href.
  const whatsappHref = waLink(settings.whatsappNumber, sys('whatsapp.prefill'));

  return (
    <div
      data-testid="portal-shell"
      className="grid bg-white lg:min-h-screen lg:grid-cols-[1.02fr_1fr]"
    >
      {/* The brand panel (design .ja-cl-brand; its #0a1428 is the navy token). */}
      <div className="relative overflow-hidden bg-navy px-5 py-5 text-white md:px-8 md:py-7 lg:px-9 lg:py-9 xl:px-[42px] xl:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 -right-32 h-[440px] w-[440px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.32)_0%,rgba(24,153,213,0)_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-28 h-[400px] w-[400px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.14)_0%,rgba(24,153,213,0)_70%)]"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] bg-white">
            {/* Decorative: the wordmark beside it names the brand (the asset's 336 × 285 ratio). */}
            <Image src={BRAND.mark.src} alt="" width={28} height={24} />
          </span>
          <span className="font-display text-[16px] font-extrabold tracking-[-0.3px]">
            JobsAdmire
          </span>
          <span className="rounded-pill border border-white/15 bg-white/10 px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[1px] text-white/70">
            {t('crmlogin.045')}
          </span>
        </div>

        <div className="relative mt-8 xl:mt-10">
          <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">
            {t('crmlogin.046')}
          </p>
          {/* The page's one h1 and its named LCP element (text, no resource). D20: visible on
              phones too, where the design hides the whole headline block. */}
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-3 text-h2 leading-[1.08]">
            {t('crmlogin.047')}
          </h1>
          <p className="mt-3 max-w-[430px] text-body leading-relaxed text-white/70">
            {t('crmlogin.048')}
          </p>
          {/* W10: hidden ≤900 px as in the design — CSS, never conditional rendering; W119: the
              media-variant `max-lg:hidden` beside the base `flex`. */}
          <ul
            data-testid="portal-points"
            className="mt-7 flex list-none flex-col gap-3 p-0 max-lg:hidden"
          >
            {POINT_IDS.map((id) => (
              <li key={id} className="flex items-start gap-3">
                <CheckDot />
                <span className="text-body-sm leading-normal text-white/80">{t(id)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* crmlogin.016 ("~10 min") is not rendered — no signed reply SLA behind it (D17). */}
        <div
          data-testid="portal-trust"
          className="relative mt-8 flex items-center gap-3 max-lg:hidden"
        >
          <span className="min-w-0 text-body-sm font-bold text-white/60">{t('crmlogin.014')}</span>
          <ContactCta
            placement="page_cta"
            href={whatsappHref}
            external
            variant="inverse"
            className="ml-auto"
          >
            {t('crmlogin.012')}
          </ContactCta>
        </div>

        {android ? (
          <div data-testid="portal-app-desktop" className="relative mt-5 max-lg:hidden">
            <AppCard bundle={bundle} locale={locale} t={t} android={android} qr surface="panel" />
          </div>
        ) : null}

        {/* The licence chip (crmlogin.020, legal — verbatim) and the agency line; hidden ≤700 px
            as in the design. */}
        <div data-testid="portal-licence" className="relative mt-6 max-md:hidden">
          <p className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.07] px-3 py-1.5 text-body-sm font-extrabold tracking-[0.4px] text-white/80">
            {t('crmlogin.020')}
          </p>
          <p className="mt-3 text-body-sm text-white/55">{t('crmlogin.021')}</p>
        </div>
      </div>

      {/* The chooser column (design .ja-cl-form). */}
      <div className="flex flex-col bg-white px-5 py-6 md:px-8 md:py-8 lg:px-9 lg:py-9 xl:px-[42px] xl:py-8">
        <div className="mb-6 flex items-center justify-between gap-3 xl:mb-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex min-h-[44px] items-center gap-2 text-body-sm font-bold text-text-tertiary no-underline hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            {t('crmlogin.001')}
          </Link>
          <LanguageSwitcher locale={locale} label={t('home.016')} />
        </div>

        <div className="mx-auto w-full max-w-[436px]">
          <h2 className="text-h2 leading-[1.12] text-ink">{t('crmlogin.002')}</h2>
          {/* crmlogin.003 describes the multi-portal choice D22 removed — sys copy instead. */}
          <p className="mt-2 text-body text-text-tertiary">{sys('portal.intro')}</p>

          {/* The one tile (W8): Partner Portal → login and forgot-password, same tab (R22 — a
              plain anchor in the button face; `Button external` would open a new tab). No
              Operations tile, no ChatAdmire/desk tile, no credential form (D22). */}
          <div
            data-testid="portal-tile"
            className="mt-6 rounded-base border-[1.5px] border-tint-border bg-pale-1 p-4"
          >
            <p className="flex items-center gap-2 text-body font-extrabold text-ink">
              <span aria-hidden="true" className="block h-2 w-2 flex-none rounded-pill bg-blue" />
              {t('crmlogin.043')}
            </p>
            <p className="mt-1 text-body-sm text-text-secondary">{t('crmlogin.044')}</p>
            <a
              href={loginHref}
              data-testid="portal-login-link"
              className={buttonClassName('primary', 'lg', 'mt-4 w-full')}
            >
              {sys('portal.signIn')}
            </a>
            <a
              href={forgotHref}
              data-testid="portal-forgot-link"
              className="mt-2 inline-flex min-h-[44px] items-center text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
            >
              {t('crmlogin.005')}
            </a>
            <p className="mt-2 text-body-sm text-text-secondary">{t('crmlogin.054')}</p>
            <p className="mt-2 text-body-sm text-text-secondary">{tf('crmlogin.055')}</p>
          </div>

          {android ? (
            <details data-testid="portal-app-mobile" className="group mt-4 lg:hidden">
              <summary className="flex min-h-[50px] cursor-pointer list-none items-center gap-3 rounded-sm border-[1.5px] border-border-1 bg-pale-1 px-4 text-body-sm font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">{t('crmlogin.013')}</span>
                <ChevronIcon />
              </summary>
              <div className="mt-2">
                <AppCard
                  bundle={bundle}
                  locale={locale}
                  t={t}
                  android={android}
                  qr={false}
                  surface="card"
                />
              </div>
            </details>
          ) : null}

          <div
            data-testid="portal-help"
            className="mt-5 rounded-base border border-border-1 bg-pale-1 p-4"
          >
            <h3 className="text-body-sm font-extrabold text-ink">{t('crmlogin.056')}</h3>
            <p className="mt-1 text-body-sm text-text-secondary">{tf('crmlogin.057')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ContactCta placement="page_cta" href={whatsappHref} external variant="secondary">
                {t('crmlogin.058')}
              </ContactCta>
              <Button variant="ghost" href="/contact">
                {t('crmlogin.019')}
              </Button>
            </div>
          </div>

          {/* The anti-phishing note and the licence foot — legal-flagged package copy, verbatim
              (WP-C review). */}
          <p className="mt-4 flex items-start gap-2 text-body-sm font-bold text-text-secondary">
            <LockIcon />
            <span>{t('crmlogin.023')}</span>
          </p>
          <p className="mt-3 text-center text-body-sm font-bold text-text-secondary">
            {t('crmlogin.022')}
          </p>
        </div>
      </div>
    </div>
  );
}
```

Executor notes: `text-text-tertiary` is used on white only (4.76:1); on `bg-pale-1` the copy is `text-text-secondary` (#556377) — tertiary #64748b on #f4f9fc would be 4.49:1, below AA. The "Contact a branch" `Button` targets `/contact` (`/iletisim`), which T7 builds; the chrome already links it, so the dead-target sweep gains no new entry. `crmlogin.054`/`057` carry the package's own "we" — package copy waits for WP-C (W154 covers `sys.*` only).

`src/app/[locale]/(bare)/layout.tsx` — in the doc comment, replace "the group holds no page until T13 lands." with "it holds the portal entry page (T13, `portal-login/`)." (comment only).

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` initialiser, delete the line `'/portal-login',` (18 keys remain).

`e2e/routes.ts` — append after the last `GATE_ROUTE_TABLE` row:

```ts
  // T13 — the portal door: noindex (W8), swept by axe/width/placeholder/headers, never Lighthouse.
  { path: '/portal-girisi', indexable: false },
  { path: '/en/portal-login', indexable: false },
```

`e2e/seo.spec.ts` — in the test `robots.txt matches this run's face and points at the sitemap in production`, directly after `expect(body).toContain('Disallow: /tesekkurler');` add:

```ts
  // T13 (W20/W37, W104): a built noindex route is disallowed in both locales, by itself.
  for (const path of ['/portal-girisi', '/en/portal-login'])
    expect(body).toContain(`Disallow: ${path}`);
```

Docs (same commit):
- `docs/SEO.md` — append after the last row of the `## Pages` table T1 created (W98):

```markdown
| Portal entry | `/portal-girisi` · `/en/portal-login` | `sys.seo.portal.*` (the package ships no SEO strings, W38) | self, per locale | site-wide Organization + WebSite only (the record lists no `breadcrumb`) | `h1` — `crmlogin.047` in the brand panel (text; on phones Lighthouse may pick the sub `crmlogin.048`) | **noindex** — record + forced in `generateMetadata`; robots `Disallow`; not in the sitemap; `(bare)` group, no breadcrumbs; link-only chooser (W8) |
```

  In `## JSON-LD`, in the `BreadcrumbList` row of the table, replace the Where cell "Every non-homepage page" with "Every indexable non-homepage page (the noindex portal door and the newsletter one-shots carry none — their page records list no `breadcrumb`)".
  In `## Robots`, replace "Today that is `/tesekkurler` and `/en/thank-you` only; `/blog`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms appear by themselves when their page task deletes the key (W20)" with "Today that is `/tesekkurler`, `/portal-girisi` and their `/en/…` forms (T13 built the portal door); `/blog`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms appear by themselves when their page task deletes the key (W20)".
- `docs/ANALYTICS.md` — append to `### Page instrumentation (WP2b)`: "- **Portal entry (T13):** `whatsapp_click` with `placement: 'page_cta'` from the trust-line and help-card WhatsApp CTAs (`ContactCta` → `ContactLink`, static `sys.whatsapp.prefill`); the Partner Portal login/forgot-password anchors, the Play Store badge and the back link are plain navigations — no event, no new parameter (W12)."
- `docs/CONTENT-MODEL.md` — append to the per-page bullet list at the end of `### Adding copy (W9, W23, W54)`: "- **Portal (T13):** `sys.portal.intro`, `sys.portal.signIn` (the link-only chooser's two composed strings — `crmlogin.003` describes the multi-portal choice D22 removed) + `sys.seo.portal.{title,description}`; the page reads `crmlogin.*` and `home.016` through `makeT` and `crmlogin.055`/`057` through `makeTf` (`{placed}`, `{replySlaHours}`); server-only reads."
- `docs/PRD.md` — §2 table, row 14 ("Portal entry (CRM Login)"): replace the Forms cell "none — links out to portal.jobsadmire.com only" with "none — links out to portal.jobsadmire.com only (T13: `(bare)` group, one Partner Portal tile → login/forgot-password, Android badge + local QR, no credential form — W8)".
- `docs/PRD.md` — §11, the sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`): the portal entry is §2 row 14, one of the 14 core pages, so count it as built — replace "12 of the 14 core pages" with "11 of the 14 core pages", and directly after T1's clause "Hire Workers is still the spike placeholder until T2" insert "; the portal entry is built (WP2b T13)" (before the parenthesis closes). Leave the rest of the sentence as it is (W45: edit in place); T2 then replaces only its own clause and keeps the count, T3 decrements from 11. If `grep -n 'still the spike placeholder until T2' docs/PRD.md` finds nothing, T1 drifted: stop and report rather than rewrite the sentence.

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `task13-keys.test.ts` (portal), `unbuilt.test.ts` (18 keys = the pathnames without a page), `robots.test.ts`, `sitemap.test.ts`, `messages.test.ts` (parity), `voice.test.ts`, `client-messages.test.ts` (no client module reads `sys.portal`), `class-collisions.test.ts`, `client-imports.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add ':(literal)src/app/[locale]/(bare)' src/messages src/lib/seo/routes.ts e2e/routes.ts e2e/seo.spec.ts e2e/pages/portal.spec.ts docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md
git commit -F - <<'MSG'
feat(portal): link-only portal entry page in the bare route group (T13, W8, W19)

One Partner Portal tile linking out to settings.portal login/forgot-password
(same tab), Android badge + local QR (W14), help card; no credential form, no
Operations or ChatAdmire tile (D22, I15). noindex (record + forced); the key
leaves UNBUILT_PATHNAMES (W20) and robots.txt names the path by itself (W37).
sys.portal.* + sys.seo.portal.* in both locales (W23, W154); by-path imports
(W156). Gate rows +2 (W21); docs rows (W98).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 2 — Legal pure modules: the Markdown-lite body parser and the document tables

- [ ] **Step 1: Write the failing tests**

`src/lib/legal/body.test.ts` (new):

```ts
import { describe, expect, it } from 'vitest';
import { parseLegalBody, parseRuns } from './body';

describe('parseRuns', () => {
  it('splits a **bold** lead from plain text', () => {
    expect(parseRuns('**Address:** in the footer')).toEqual([
      { text: 'Address:', strong: true },
      { text: ' in the footer', strong: false },
    ]);
  });

  it('keeps bold runs in the middle and at the end', () => {
    expect(parseRuns('a **b** c **d**')).toEqual([
      { text: 'a ', strong: false },
      { text: 'b', strong: true },
      { text: ' c ', strong: false },
      { text: 'd', strong: true },
    ]);
  });

  it('returns one plain run without markers, and leaves an unpaired marker as text', () => {
    expect(parseRuns('plain')).toEqual([{ text: 'plain', strong: false }]);
    expect(parseRuns('a ** b')).toEqual([{ text: 'a ** b', strong: false }]);
  });
});

describe('parseLegalBody', () => {
  it('turns blank-line separated blocks into paragraphs and "- " blocks into lists', () => {
    expect(parseLegalBody('Intro line.\n\n- **A:** one\n- two\n\nOutro.')).toEqual([
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

  it('never produces markup — angle brackets stay text', () => {
    expect(parseLegalBody('<b>x</b>')).toEqual([
      { type: 'p', runs: [{ text: '<b>x</b>', strong: false }] },
    ]);
  });
});
```

`src/lib/legal/documents.test.ts` (new):

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAGE_KEYS, PAGE_PATHNAME } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { BundleSchema } from '../../../contract/website-bundle.v1';
import {
  LEGAL_DOCS,
  LEGAL_HOME_CRUMB_ID,
  LEGAL_HREF,
  LEGAL_SECTIONS,
  legalValues,
} from './documents';

/** The generated LOCAL bundle (the `src/content/local-bundle.test.ts` pattern): `testBundle()`
 *  carries only the golden fixture's 20 strings, and the Home crumb ids live in the package. */
const localBundle = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(readFileSync(join(__dirname, `../../content/local/bundle.${locale}.json`), 'utf8')),
  );

/** Every designed page's own Home crumb (W109): each page reads its own id for the same text. */
const OWN_HOME_CRUMB_IDS = [
  'hire.020',
  'calc.001',
  'partner.016',
  'wp.021',
  'about.021',
  'verify.021',
  'jt.021',
  'contact.023',
  'availworkers.021',
  'success.022',
  'blog.022',
  'blogarticle.022',
];

describe('legal document tables (T13)', () => {
  it('the four documents are page-record keys, routed exactly as PAGE_PATHNAME says', () => {
    expect(LEGAL_DOCS).toEqual(['privacy', 'terms', 'kvkk', 'cookiePolicy']);
    for (const doc of LEGAL_DOCS) {
      expect(PAGE_KEYS).toContain(doc);
      expect(LEGAL_HREF[doc]).toBe(PAGE_PATHNAME[doc]);
    }
  });

  it('section ids are unique and in document order: privacy 15, terms 16, KVKK none, cookie 3', () => {
    expect(LEGAL_SECTIONS.privacy).toHaveLength(15);
    expect(LEGAL_SECTIONS.terms).toHaveLength(16);
    expect(LEGAL_SECTIONS.kvkk).toEqual([]);
    expect(LEGAL_SECTIONS.cookiePolicy).toEqual(['essential', 'consent', 'manage']);
    for (const doc of LEGAL_DOCS)
      expect(new Set(LEGAL_SECTIONS[doc]).size).toBe(LEGAL_SECTIONS[doc].length);
  });

  it('the identifiers the copy cites come from settings, never literals (D17)', () => {
    const { settings } = testBundle();
    expect(legalValues(settings)).toEqual({
      email: settings.email,
      phoneDisplay: settings.phoneDisplay,
      permitNo: settings.licence.permitNo,
      lawRef: settings.licence.lawRef,
      taxNo: settings.licence.taxNo,
    });
  });

  it('the Home crumb is the package string every page carries ("Ana Sayfa" / "Home"), never sys.nav.home (W109/W176)', () => {
    for (const locale of ['tr', 'en'] as const) {
      const { strings } = localBundle(locale);
      const home = strings[LEGAL_HOME_CRUMB_ID];
      expect(home, locale).toBe(locale === 'tr' ? 'Ana Sayfa' : 'Home');
      for (const id of OWN_HOME_CRUMB_IDS) expect(strings[id], `${locale} ${id}`).toBe(home);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/lib/legal
```
Expected: FAIL — `./body` and `./documents` do not exist.

- [ ] **Step 3: Implement**

`src/lib/legal/body.ts` (new — pure, no directive, R23):

```ts
/**
 * Markdown-lite for the legal documents (D14, T13): blocks are separated by a blank line; a
 * block whose every line starts with `- ` is a bullet list, any other block one paragraph (its
 * lines joined by a space); `**text**` is a bold run. Nothing else — no links, no headings
 * (section titles are their own keys), no HTML — so a counsel edit can never inject markup.
 * The bodies arrive already formatted by next-intl (the ICU arguments filled, D17).
 */
export type LegalRun = { text: string; strong: boolean };
export type LegalBlock = { type: 'p'; runs: LegalRun[] } | { type: 'ul'; items: LegalRun[][] };

const BOLD = /\*\*(.+?)\*\*/g;

export function parseRuns(text: string): LegalRun[] {
  const runs: LegalRun[] = [];
  let last = 0;
  for (const match of text.matchAll(BOLD)) {
    const at = match.index ?? 0;
    if (at > last) runs.push({ text: text.slice(last, at), strong: false });
    runs.push({ text: match[1] ?? '', strong: true });
    last = at + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), strong: false });
  return runs.length > 0 ? runs : [{ text: '', strong: false }];
}

export function parseLegalBody(body: string): LegalBlock[] {
  return body
    .split(/\n[ \t]*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
    .map(
      (lines): LegalBlock =>
        lines.every((line) => line.startsWith('- '))
          ? { type: 'ul', items: lines.map((line) => parseRuns(line.slice(2).trim())) }
          : { type: 'p', runs: parseRuns(lines.join(' ')) },
    );
}
```

`src/lib/legal/documents.ts` (new):

```ts
import type { pathnames } from '@/i18n/routing';
import type { Settings } from '../../../contract/website-bundle.v1';

/** The four legal page records (`PAGE_KEYS`), in footer order. */
export const LEGAL_DOCS = ['privacy', 'terms', 'kvkk', 'cookiePolicy'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

/** Each document's internal pathname — equal to `PAGE_PATHNAME[doc]` (pinned by a test), typed
 *  as the literal keys `Breadcrumbs` and `buildMetadata` accept as an `Href`. */
export const LEGAL_HREF = {
  privacy: '/privacy',
  terms: '/terms',
  kvkk: '/kvkk',
  cookiePolicy: '/cookie-policy',
} as const satisfies Record<LegalDoc, keyof typeof pathnames>;

/**
 * W109/W176: the legal pages have no package of their own, so their Home crumb is the string
 * every other page's own crumb carries — "Ana Sayfa" / "Home" (`hire.020`, `about.021`,
 * `contact.023`, … hold the same text per locale; `documents.test.ts` pins it). Never
 * `sys.nav.home` ("Ana sayfa", a different capitalisation): the BreadcrumbList names would
 * differ by case across the site.
 */
export const LEGAL_HOME_CRUMB_ID = 'about.021';

/**
 * Section ids — the `sys.legal.<doc>.sections.<id>.{title,body}` keys, in document order.
 * Privacy: the old site's sections renumbered 1–15 (its headings skipped and repeated numbers —
 * 3, 5, 6→7, 10→12 — and its "special categories" note is folded into `dataCategories`).
 * Terms: the old site's sixteen, as they were. KVKK: none until counsel's text (a placeholder).
 * Cookie policy: the minimal notice spec §10 row 6 names.
 */
export const LEGAL_SECTIONS: Readonly<Record<LegalDoc, readonly string[]>> = {
  privacy: [
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
  ],
  terms: [
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
  ],
  kvkk: [],
  cookiePolicy: ['essential', 'consent', 'manage'],
};

/** D17: the identifiers the legal copy cites — the ICU arguments `{email}`, `{phoneDisplay}`,
 *  `{permitNo}`, `{lawRef}`, `{taxNo}` — always from settings, never typed into the copy. */
export type LegalValues = {
  email: string;
  phoneDisplay: string;
  permitNo: string;
  lawRef: string;
  taxNo: string;
};

export function legalValues(settings: Settings): LegalValues {
  return {
    email: settings.email,
    phoneDisplay: settings.phoneDisplay,
    permitNo: settings.licence.permitNo,
    lawRef: settings.licence.lawRef,
    taxNo: settings.licence.taxNo,
  };
}
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green (the two new files are not imported by any page yet).

- [ ] **Step 5: Commit**

```bash
git add src/lib/legal
git commit -F - <<'MSG'
feat(legal): Markdown-lite body parser and the legal document tables (T13, D14, D17)

parseLegalBody/parseRuns (paragraphs, "- " lists, **bold**, never markup);
LEGAL_DOCS/LEGAL_HREF/LEGAL_SECTIONS (privacy 15, terms 16, kvkk 0, cookie 3);
legalValues(settings) — the five identifiers the copy cites, from settings;
LEGAL_HOME_CRUMB_ID — the package Home crumb every page shares (W109/W176).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 3 — The legal page renderer (`(minimal)/_legal/`)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(minimal)/_legal/__tests__/LegalDocument.test.tsx` (new):

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { LegalDocument, type LegalDocumentProps } from '../LegalDocument';

const base: LegalDocumentProps = {
  locale: 'en',
  href: '/privacy',
  homeLabel: 'Home',
  title: 'Privacy Policy',
  intro: 'How JobsAdmire processes personal data.',
  updatedAt: '2026-09-29',
  updatedLabel: 'Last updated',
  contentsLabel: 'Contents',
  sections: [
    {
      id: 'scope',
      title: 'Scope',
      body: 'JobsAdmire processes data when you:\n\n- **browse** this website\n- apply for jobs',
    },
    { id: 'contact', title: 'Contact', body: 'E-mail info@jobsadmire.com.' },
  ],
};

describe('LegalDocument (T13)', () => {
  it('renders one h1 as the LCP slot, a dated line, and a contents list that matches the numbered sections', () => {
    const { container } = renderWithIntl(<LegalDocument {...base} />, { locale: 'en' });
    const h1 = screen.getByRole('heading', { level: 1, name: 'Privacy Policy' });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const time = screen.getByTestId('legal-updated').querySelector('time');
    expect(time).toHaveAttribute('datetime', '2026-09-29');
    expect(time).toHaveTextContent('29 September 2026');
    const toc = screen.getByRole('navigation', { name: 'Contents' });
    expect(within(toc).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '#scope',
      '#contact',
    ]);
    expect(screen.getByRole('heading', { level: 2, name: '1. Scope' })).toBeInTheDocument();
    expect(container.querySelector('#contact')).toHaveAttribute('data-legal-section');
    const list = container.querySelector('#scope ul');
    expect(list?.querySelectorAll('li')).toHaveLength(2);
    expect(list?.querySelector('strong')).toHaveTextContent('browse');
    // the page's one Breadcrumbs block → one BreadcrumbList node
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    // W109/W176: the trail is the Home label (the package string) then the page's own title
    const trail = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(trail).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(trail).getByText('Privacy Policy')).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('[data-placeholder]')).toBeNull();
  });

  it('a notice is a named placeholder; an English body on a Turkish page carries lang="en"', () => {
    const { container } = renderWithIntl(
      <LegalDocument
        {...base}
        locale="tr"
        homeLabel="Ana Sayfa"
        updatedLabel="Son güncelleme"
        contentsLabel="İçindekiler"
        bodyLang="en"
        notice={{
          testId: 'legal-notice',
          placeholder: 'legal-terms-tr',
          body: 'Metin şimdilik İngilizcedir.',
        }}
      />,
      { locale: 'tr' },
    );
    const notice = screen.getByTestId('legal-notice');
    expect(notice).toHaveAttribute('role', 'note');
    expect(notice).toHaveAttribute('data-placeholder', 'legal-terms-tr');
    expect(notice).not.toHaveAttribute('data-lcp-slot');
    expect(screen.getByTestId('legal-body')).toHaveAttribute('lang', 'en');
    expect(screen.getByTestId('legal-intro')).toHaveAttribute('lang', 'en');
    expect(screen.getByTestId('legal-updated').querySelector('time')).toHaveTextContent(
      '29 Eylül 2026',
    );
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    // W176: the Turkish Home crumb is the package's "Ana Sayfa" (capital S), as on every page
    const trail = screen.getByRole('navigation', { name: 'Sayfa yolu' });
    expect(within(trail).getByRole('link', { name: 'Ana Sayfa' })).toBeInTheDocument();
  });

  it('renders no contents list when there are no sections (the KVKK placeholder)', () => {
    const { container } = renderWithIntl(<LegalDocument {...base} sections={[]} />, {
      locale: 'en',
    });
    expect(screen.queryByRole('navigation', { name: 'Contents' })).toBeNull();
    expect(container.querySelectorAll('[data-legal-section]')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 LegalDocument
```
Expected: FAIL — `../LegalDocument` does not exist.

- [ ] **Step 3: Implement**

`src/app/[locale]/(minimal)/_legal/LegalDocument.tsx` (new — a server component; `_legal` is a private folder, never a route, and `unbuilt.test.ts` skips it):

```tsx
import type { ReactNode } from 'react';
// By module path, never the barrels (W134/W147/W156).
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date/formatDate';
import { parseLegalBody, type LegalRun } from '@/lib/legal/body';
import type { Href } from '@/lib/seo/routes';

export type LegalSection = { id: string; title: string; body: string };

/** A page-level note above the body: the Turkish Terms' English-only notice or a counsel
 *  placeholder (D26/W55 — always a named `data-placeholder`, never the LCP slot). */
export type LegalNotice = {
  testId: 'legal-notice' | 'legal-pending';
  placeholder: string;
  title?: string;
  body: string;
  action?: ReactNode;
};

export type LegalDocumentProps = {
  locale: Locale;
  href: Href;
  homeLabel: string;
  title: string;
  intro: string;
  /** ISO `YYYY-MM-DD` from `sys.legal.<doc>.updatedAt` (D17). */
  updatedAt: string;
  updatedLabel: string;
  contentsLabel: string;
  /** Already formatted by next-intl (ICU arguments filled). */
  sections: LegalSection[];
  /** The language of the intro, contents and sections when it is not the page's own — the
   *  Turkish Terms route renders the English text (WCAG 3.1.2). */
  bodyLang?: Locale;
  notice?: LegalNotice | null;
  children?: ReactNode;
};

function Runs({ runs }: { runs: LegalRun[] }) {
  return (
    <>
      {runs.map((run, i) =>
        run.strong ? (
          <strong key={i} className="font-extrabold text-ink">
            {run.text}
          </strong>
        ) : (
          <span key={i}>{run.text}</span>
        ),
      )}
    </>
  );
}

/** A Markdown-lite body (`src/lib/legal/body.ts`): paragraphs and bullet lists, nothing else. */
export function LegalBody({ body }: { body: string }) {
  return (
    <>
      {parseLegalBody(body).map((block, i) =>
        block.type === 'ul' ? (
          <ul key={i} className="my-3 list-disc space-y-1 pl-6 text-body text-text-secondary">
            {block.items.map((runs, j) => (
              <li key={j}>
                <Runs runs={runs} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="my-3 text-body text-text-secondary">
            <Runs runs={block.runs} />
          </p>
        ),
      )}
    </>
  );
}

/**
 * One layout for the four legal routes (D14): breadcrumbs (the page's one BreadcrumbList,
 * W109: the current crumb is the page's own title) → h1 (the named LCP slot) → dated line →
 * optional notice → intro → contents → numbered sections → `children`. `sections` may be empty
 * (the KVKK placeholder renders no contents list). No `<main>` — the `(minimal)` layout owns it.
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
  bodyLang,
  notice,
  children,
}: LegalDocumentProps) {
  return (
    <Section tone="light">
      {/* `.container-site` is unlayered CSS, so a `max-w-*` utility on the same element would
          lose to its 1280 px — the reading measure sits on an inner wrapper. */}
      <div className="container-site">
        <div className="max-w-[760px]">
          <Breadcrumbs
            locale={locale}
            items={[
              { name: homeLabel, href: '/' },
              { name: title, href },
            ]}
          />
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="mt-6 text-h2">
            {title}
          </h1>
          <p data-testid="legal-updated" className="mt-2 text-body-sm font-bold text-text-tertiary">
            {updatedLabel}: <time dateTime={updatedAt}>{formatDate(updatedAt, locale)}</time>
          </p>
          {notice ? (
            <div
              role="note"
              data-testid={notice.testId}
              data-placeholder={notice.placeholder}
              className="mt-6 rounded-base border border-warning-border bg-warning-surface p-4"
            >
              {notice.title ? (
                <p className="text-body font-extrabold text-warning-text">{notice.title}</p>
              ) : null}
              <p className="mt-1 text-body-sm font-semibold text-ink">{notice.body}</p>
              {notice.action ? <div className="mt-3">{notice.action}</div> : null}
            </div>
          ) : null}
          <p
            data-testid="legal-intro"
            lang={bodyLang}
            className="mt-5 text-body-lg text-text-secondary"
          >
            {intro}
          </p>
          {sections.length > 0 ? (
            <nav
              aria-label={contentsLabel}
              data-testid="legal-toc"
              className="mt-8 rounded-base border border-border-2 bg-pale-1 p-4"
            >
              <p className="text-body-sm font-extrabold uppercase tracking-[1px] text-text-secondary">
                {contentsLabel}
              </p>
              <ol lang={bodyLang} className="mt-2 list-decimal space-y-1 pl-5 text-body-sm font-bold">
                {sections.map((s) => (
                  <li key={s.id}>
                    {/* WCAG 2.5.8 (axe target-size, wcag22aa): the rows sit closer than 24 px
                        apart at the desktop type scale, so each link is a 24 px target. */}
                    <a
                      href={`#${s.id}`}
                      className="inline-flex min-h-[24px] items-center text-blue-safe no-underline hover:underline"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div data-testid="legal-body" lang={bodyLang}>
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} data-legal-section className="mt-10 scroll-mt-24">
                <h2 className="text-card-title text-ink">
                  {i + 1}. {s.title}
                </h2>
                <LegalBody body={s.body} />
              </section>
            ))}
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(minimal)/_legal/load.ts` (new):

```ts
import 'server-only';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import {
  LEGAL_HOME_CRUMB_ID,
  LEGAL_HREF,
  LEGAL_SECTIONS,
  legalValues,
  type LegalDoc,
} from '@/lib/legal/documents';
import { buildMetadata } from '@/lib/seo/metadata';
import type { LegalDocumentProps } from './LegalDocument';

export type LegalParams = Promise<{ locale: string }>;

/** `generateMetadata` for one legal page: robots (`index`) and the breadcrumb JSON-LD flag come
 *  from the page record; the title and description from `sys.seo.<doc>.*` (W38) — server-only
 *  copy (W90/W148). */
export async function legalMetadata(params: LegalParams, doc: LegalDoc): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return buildMetadata({
    locale,
    href: LEGAL_HREF[doc],
    bundle,
    pageKey: doc,
    fallbackTitle: sys(`seo.${doc}.title`),
    fallbackDescription: sys(`seo.${doc}.description`),
  });
}

/**
 * Everything one legal page renders, resolved on the server: every string from
 * `sys.legal.<doc>.*` (server-only — never a client island, W90/W148), every identifier the copy
 * cites passed as an ICU argument from settings (D17), the Home crumb from the package string
 * every page's own crumb carries (`LEGAL_HOME_CRUMB_ID` through `makeT`, W109/W176) — never
 * `sys.nav.home`.
 */
export async function loadLegal(params: LegalParams, doc: LegalDoc) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const values = legalValues(bundle.settings);
  const common = {
    locale,
    href: LEGAL_HREF[doc],
    homeLabel: makeT(bundle)(LEGAL_HOME_CRUMB_ID),
    title: sys(`legal.${doc}.title`),
    intro: sys(`legal.${doc}.intro`, values),
    updatedAt: sys(`legal.${doc}.updatedAt`),
    updatedLabel: sys('legal.updatedLabel'),
    contentsLabel: sys('legal.contents'),
    sections: LEGAL_SECTIONS[doc].map((id) => ({
      id,
      title: sys(`legal.${doc}.sections.${id}.title`),
      body: sys(`legal.${doc}.sections.${id}.body`, values),
    })),
  } satisfies Omit<LegalDocumentProps, 'bodyLang' | 'notice' | 'children'>;
  return { locale, sys, common };
}
```

Why ICU and not `sys.raw()` + `fill()`: CONTENT-MODEL § Adding copy — "plurals and live numbers in sys copy use ICU through next-intl"; the five arguments are plain `{name}` ICU arguments, every legal string gets all five (unused ones are ignored), and a missing argument is a next-intl error in development, the same guarantee `fill()` gives package strings. The copy carries no ICU-special characters (`{`/`}` only around the five arguments, no `<`, no `#`, no `'` before a brace — Cycle 4's test formats every string with a throwing `onError`).

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — the renderer test passes; `class-collisions.test.ts` scans the new class strings (none sets a property twice at one variant); `client-imports.test.ts` sees by-path imports only.

- [ ] **Step 5: Commit**

```bash
git add ':(literal)src/app/[locale]/(minimal)/_legal'
git commit -F - <<'MSG'
feat(legal): shared legal page renderer and server loader (T13, D14, W109)

LegalDocument: breadcrumbs (one BreadcrumbList, own-title crumb), h1 as the
named LCP slot, dated line via formatDate (D17), named placeholder notice
(D26/W55), contents list with 24 px targets, numbered Markdown-lite sections,
lang on an English body (WCAG 3.1.2). load.ts resolves sys.legal.* on the
server with the settings identifiers as ICU arguments (W90/W148, D17); the
Home crumb is the package string every page carries (W109/W176).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 4 — The four legal pages (`(minimal)/privacy|terms|kvkk|cookie-policy`)

- [ ] **Step 1: Write the failing tests**

`src/messages/task13-keys.test.ts` — replace the whole file (portal + legal):

```ts
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import type { Locale } from '@/i18n/routing';
import { LEGAL_DOCS, LEGAL_SECTIONS } from '@/lib/legal/documents';
import en from './en.json';
import tr from './tr.json';

/**
 * T13's `sys.*` keys (W9/W23). Every one is read by a server component through
 * `getTranslations('sys')` — never by a client island (W90/W148) — so a missing key would render
 * a MISSING_MESSAGE string that no e2e text check reliably catches. Pinned per locale here, each
 * formatted through next-intl itself with an `onError` that throws.
 */
const MESSAGES: Record<Locale, Messages> = { tr, en };

/** The five ICU arguments every legal string receives (`legalValues(settings)`, D17). */
const LEGAL_VALUES = {
  email: 'info@example.com',
  phoneDisplay: '+90 000 000 00 00',
  permitNo: '1730',
  lawRef: '4904',
  taxNo: '48422122',
};

/**
 * W175 (owner check, Preconditions): `privacy@jobsadmire.com` is published as the Privacy
 * policy's "Alternative e-mail" only while the owner has confirmed the mailbox exists. Leave
 * `true` when the controller's brief states that confirmation; set `false` when it does not —
 * Cycle 4 Step 3's W175 fallback then removes the bullet in both locales and the test below
 * expects it gone (only `{email}` stays). Cycle 6 replaces this file: keep Cycle 4's value.
 */
const PRIVACY_MAILBOX_CONFIRMED = true;

const PORTAL_KEYS = ['seo.portal.title', 'seo.portal.description', 'portal.intro', 'portal.signIn'];

const LEGAL_KEYS = [
  'legal.updatedLabel',
  'legal.contents',
  ...LEGAL_DOCS.flatMap((doc) => [
    `seo.${doc}.title`,
    `seo.${doc}.description`,
    `legal.${doc}.title`,
    `legal.${doc}.intro`,
    `legal.${doc}.updatedAt`,
    ...LEGAL_SECTIONS[doc].flatMap((id) => [
      `legal.${doc}.sections.${id}.title`,
      `legal.${doc}.sections.${id}.body`,
    ]),
  ]),
  'legal.terms.englishOnlyNotice',
  'legal.terms.finalNote',
  'legal.kvkk.pendingTitle',
  'legal.kvkk.pendingBody',
  'legal.kvkk.privacyLink',
  'legal.cookiePolicy.pendingTitle',
  'legal.cookiePolicy.pendingBody',
];

function translator(locale: Locale) {
  return createTranslator({
    locale,
    messages: MESSAGES[locale],
    namespace: 'sys',
    onError: (error) => {
      throw error;
    },
  });
}

/** `sys.legal.<doc>` as plain data, for the structural checks. */
const legalOf = (locale: Locale) =>
  (MESSAGES[locale] as { sys: { legal: Record<string, Record<string, unknown>> } }).sys.legal;

describe('T13 sys keys (W9/W23)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: every portal and legal key is a non-empty, fully formatted string`, () => {
      const t = translator(locale);
      for (const key of [...PORTAL_KEYS, ...LEGAL_KEYS]) {
        const value = t(key, LEGAL_VALUES);
        expect(value.trim().length, key).toBeGreaterThan(0);
        expect(value, key).not.toMatch(/[{}]/);
      }
    });

    it(`${locale}: every legal updatedAt is a real calendar date (D17)`, () => {
      for (const doc of LEGAL_DOCS) {
        const iso = String(legalOf(locale)[doc].updatedAt);
        expect(iso, doc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10), doc).toBe(iso);
      }
    });

    it(`${locale}: every legal body is Markdown-lite — a block is all "- " lines or none`, () => {
      const t = translator(locale);
      for (const key of LEGAL_KEYS.filter((k) => k.endsWith('.body'))) {
        for (const block of t(key, LEGAL_VALUES).split(/\n[ \t]*\n/)) {
          const lines = block
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          const listed = lines.filter((l) => l.startsWith('- ')).length;
          expect(listed === 0 || listed === lines.length, key).toBe(true);
        }
      }
    });

    it(`${locale}: the alternative privacy mailbox appears only in the privacy contact section, and only while the owner confirmed it (W175)`, () => {
      const t = translator(locale);
      const contact = t('legal.privacy.sections.contact.body', LEGAL_VALUES);
      expect(contact).toContain(LEGAL_VALUES.email);
      expect(/Alternative e-mail|Alternatif e-posta/.test(contact)).toBe(PRIVACY_MAILBOX_CONFIRMED);
      const mentions = LEGAL_KEYS.filter((key) =>
        t(key, LEGAL_VALUES).includes('privacy@jobsadmire.com'),
      );
      expect(mentions).toEqual(
        PRIVACY_MAILBOX_CONFIRMED ? ['legal.privacy.sections.contact.body'] : [],
      );
    });
  }

  it('the Turkish Terms carry the English text, spelled out in tr.json (§10 row 6, W107)', () => {
    const [trTerms, enTerms] = [legalOf('tr').terms, legalOf('en').terms];
    expect(trTerms.intro).toBe(enTerms.intro);
    expect(trTerms.finalNote).toBe(enTerms.finalNote);
    expect(trTerms.sections).toEqual(enTerms.sections);
    expect(trTerms.title).not.toBe(enTerms.title);
    expect(trTerms.englishOnlyNotice).not.toBe(enTerms.englishOnlyNotice);
  });
});
```

`e2e/pages/legal.spec.ts` (new):

```ts
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
    test.skip(testInfo.project.name !== 'desktop', 'the header switcher sits in the hamburger below 901 px');
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

test('the chrome legal and portal links resolve (W152)', async ({ page, request }) => {
  const HOMES = [
    ['/', ['/gizlilik', '/kullanim-kosullari', '/portal-girisi']],
    ['/en', ['/en/privacy', '/en/terms', '/en/portal-login']],
  ] as const;
  for (const [home, hrefs] of HOMES) {
    await page.goto(home);
    for (const href of hrefs) {
      expect(await page.locator(`a[href="${href}"]`).count(), href).toBeGreaterThan(0);
      expect((await request.get(href)).status(), href).toBe(200);
    }
  }
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/messages/task13-keys.test.ts
```
Expected: FAIL — `sys.legal.*` and `sys.seo.{privacy,terms,kvkk,cookiePolicy}.*` are missing. The e2e spec runs in Cycle 7.

- [ ] **Step 3: Implement**

`src/messages/en.json` — merge into `sys.seo`:

```json
{
  "privacy": {
    "title": "Privacy Policy | JobsAdmire",
    "description": "How JobsAdmire collects, uses, stores and protects personal data under the Turkish data protection law (KVKK)."
  },
  "terms": {
    "title": "Terms and Conditions | JobsAdmire",
    "description": "The terms that govern the use of jobsadmire.com and the services of JobsAdmire."
  },
  "kvkk": {
    "title": "KVKK Information Notice | JobsAdmire",
    "description": "The information notice under the Turkish Law on the Protection of Personal Data No. 6698 (KVKK)."
  },
  "cookiePolicy": {
    "title": "Cookie Policy | JobsAdmire",
    "description": "The cookies jobsadmire.com uses and how to manage your preferences."
  }
}
```

and add this member to `sys` (after `portal`):

```json
{
  "legal": {
    "updatedLabel": "Last updated",
    "contents": "Contents",
    "privacy": {
      "title": "Privacy Policy",
      "intro": "This Privacy Policy explains how JobsAdmire processes personal data on jobsadmire.com and its subdomains (including the Partner Portal at portal.jobsadmire.com) and through its communication channels (e-mail, WhatsApp, phone). JobsAdmire protects personal data in line with the Turkish Law on the Protection of Personal Data No. 6698 (KVKK) and the İŞKUR regulations.",
      "updatedAt": "2026-09-29",
      "sections": {
        "dataController": {
          "title": "Data controller",
          "body": "The data controller is Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi (\"JobsAdmire\").\n\n- **Address:** as listed in the footer of this website and on the Contact page\n- **E-mail:** {email}\n- **Phone:** {phoneDisplay}\n- **Tax No:** {taxNo}\n\nJobsAdmire operates as a private employment agency licensed by İŞKUR (Permit No. {permitNo}, dated 19.09.2024). Under Law No. {lawRef}, charging job seekers any fee is prohibited. Complaints: İstanbul İŞKUR Provincial Directorate, Kadıköy Service Centre (tel. 0216 418 34 55)."
        },
        "scope": {
          "title": "Scope",
          "body": "This Policy explains how JobsAdmire processes personal data when you:\n\n- browse this website\n- create a profile or upload a CV\n- apply for jobs\n- request services (recruitment, HR, immigration)\n- subscribe to job alerts or the newsletter\n- become a JobsAdmire partner\n- use the Partner Portal and the support channels"
        },
        "dataCategories": {
          "title": "Categories of personal data",
          "body": "- **Identification and contact:** name, e-mail, phone, address, nationality\n- **Candidate data:** CV, education, work history, skills, references, interview notes, profile photo, uploaded documents (qualifications, licences)\n- **Immigration and relocation data:** passport and ID details, civil status, travel history, residence and work-permit information (only where needed)\n- **Employer and partner data (B2B):** company name, job title, work contact details, role requirements, contracts\n- **Transaction data:** details of paid services and invoices (card data is never stored on JobsAdmire's servers)\n- **Usage and device data:** logs, IP address, browser details, pages viewed, cookies\n- **Communications:** e-mails, calls, WhatsApp and chat messages, support requests\n\n**Special categories:** JobsAdmire does not intentionally collect health or biometric data. If a role or a legal process requires such data, JobsAdmire processes it only where lawful and necessary, and with your explicit consent where KVKK requires it."
        },
        "purposes": {
          "title": "Purposes and legal bases (KVKK Arts. 5–6)",
          "body": "JobsAdmire processes personal data for the following purposes and on the following legal bases:\n\n- **Core services (candidates and employers):** creating accounts, matching and placing candidates, managing applications, interviews, offers, contracts and onboarding — performance of a contract, legitimate interests, legal obligation\n- **Immigration and relocation support:** residence and work permits, visa invitations, documentation — performance of a contract, legal obligation, explicit consent (for certain documents)\n- **Partner and recruiter management (B2B):** onboarding, compliance, invoicing — contract, legal obligation, legitimate interests\n- **Communications and alerts:** job alerts, consultation scheduling, service updates — explicit consent (marketing), contract or legitimate interests (service messages)\n- **Security and compliance:** audit logs, access controls, responses to authorities, İŞKUR requirements — legal obligation, legitimate interests\n- **Analytics and site performance:** aggregated usage, improving the website — legitimate interests, consent (for non-essential cookies)"
        },
        "cookies": {
          "title": "Cookies and online identifiers",
          "body": "JobsAdmire uses strictly necessary cookies and, only with your consent, analytics and advertising cookies. You can change or withdraw your consent at any time with the Cookie preferences button in the site footer.\n\nThe Cookie Policy lists the categories, purposes, providers and retention periods and explains how to withdraw consent, in line with the Personal Data Protection Board's cookie guidelines."
        },
        "disclosures": {
          "title": "Disclosures to third parties",
          "body": "JobsAdmire may disclose personal data to:\n\n- employers and clients seeking to hire (only the relevant candidate data)\n- authorised partners and recruiters assisting with placement\n- service providers and processors (hosting, the Partner Portal and applicant-tracking tools, communications, payment processing, background checks)\n- public authorities and courts where the law requires it (İŞKUR, immigration authorities)\n\nEvery processor acts under a contract that meets KVKK requirements."
        },
        "transfers": {
          "title": "Cross-border transfers (KVKK Art. 9)",
          "body": "Where data is transferred outside Türkiye (for example cloud hosting, international employers, global tools), JobsAdmire relies on the mechanisms permitted under the 2024 amendments:\n\n- an adequacy decision (where the Board recognises the destination)\n- standard contracts or written undertakings approved by or notified to the Authority\n- binding corporate rules\n- explicit consent (as a last resort, where no other mechanism applies)\n\nJobsAdmire keeps a record of its transfer assessments."
        },
        "retention": {
          "title": "Retention",
          "body": "JobsAdmire keeps personal data only as long as the purposes above and the statutory limitation periods require (for example labour, commercial and İŞKUR rules). When data is no longer needed, it is deleted or anonymised in line with KVKK."
        },
        "rights": {
          "title": "Your rights (KVKK Art. 11)",
          "body": "You can apply to JobsAdmire to:\n\n- learn whether your personal data is processed\n- request information about that processing\n- learn the purposes of the processing and its recipients\n- request rectification\n- request deletion or anonymisation where the legal grounds apply\n- object to a result produced exclusively by automated processing\n- object to processing based on legitimate interests\n- claim compensation for unlawful processing\n\n**How to apply:** e-mail privacy@jobsadmire.com or {email} with enough identity details to verify the request. JobsAdmire responds within 30 days, as the KVKK procedure requires. If you are not satisfied, you can complain to the Personal Data Protection Authority after first applying to the data controller."
        },
        "security": {
          "title": "Security measures",
          "body": "JobsAdmire applies administrative, technical and physical safeguards:\n\n- access control and least privilege\n- encryption in transit and at rest\n- network and application security\n- supplier due diligence\n- staff confidentiality\n- backups and business continuity\n- regular review of the data inventory"
        },
        "verbis": {
          "title": "VERBİS",
          "body": "Where JobsAdmire meets the legal thresholds, it registers with VERBİS (the Data Controllers' Registry) and keeps its records up to date. Public VERBİS entries can be checked on the Authority's portal."
        },
        "children": {
          "title": "Children's data",
          "body": "The services of JobsAdmire are aimed at adults and employers. JobsAdmire does not knowingly collect data from children; if it learns of such processing without an appropriate legal basis and consent, it deletes the data."
        },
        "thirdParty": {
          "title": "Third-party links and social channels",
          "body": "This website may link to external services (for example WhatsApp or map providers). Their privacy practices are governed by their own policies."
        },
        "changes": {
          "title": "Changes",
          "body": "JobsAdmire may update this Policy to reflect changes in its services or in the law (including future Board decisions or guidance). The new version is published on this page with an updated date."
        },
        "contact": {
          "title": "Contact",
          "body": "For any KVKK question or request:\n\n- **Data protection contact:** {email}\n- **Alternative e-mail:** privacy@jobsadmire.com\n- **Phone:** {phoneDisplay}\n- **Registered address:** see the footer of this website and the Contact page"
        }
      }
    },
    "terms": {
      "title": "Terms and Conditions",
      "intro": "These Terms and Conditions (\"Terms\") govern access to and use of jobsadmire.com, its subdomains (including the Partner Portal at portal.jobsadmire.com), its mobile interfaces and all related services operated by Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi (\"JobsAdmire\"). By using the website or the services, you (a \"User\", \"Candidate\", \"Employer\" or \"Partner\") agree to these Terms. If you do not agree, please stop using them.",
      "updatedAt": "2026-09-29",
      "englishOnlyNotice": "The Turkish text of these Terms is being prepared with legal counsel. Until it is published, the English text below applies.",
      "finalNote": "By accessing, browsing or using any service, communication channel or material JobsAdmire provides — including job search, recruitment, immigration services, career counselling and CV tools, whether through the website, the Partner Portal, e-mail, phone, WhatsApp or any other means — you acknowledge that you have read and understood these Terms and agree to be bound by them.",
      "sections": {
        "legalStatus": {
          "title": "Data controller and legal status",
          "body": "JobsAdmire operates as a private employment agency under İŞKUR Permit No. {permitNo} dated 19.09.2024, in accordance with Law No. {lawRef}. Under this law, no fee may be charged to job seekers for core recruitment services. Contact details and the complaints procedure are set out in the Privacy Policy."
        },
        "services": {
          "title": "Services",
          "body": "JobsAdmire provides job search, candidate placement and recruitment support for employers; immigration, work-permit and residence-permit facilitation where requested; career counselling, interview preparation and related advisory services; and online portal tools for candidates and employers. Some services are free (for example job applications); others (for example employer recruitment packages) may be fee-based."
        },
        "eligibility": {
          "title": "Eligibility",
          "body": "Candidates must be at least 18 years old or of legal working age in their jurisdiction. Employers and Partners must have the legal capacity to enter into binding contracts. By using the website you confirm that all the information you provide is accurate."
        },
        "accounts": {
          "title": "User accounts",
          "body": "You may be given an account to manage applications, candidates or job postings. You are responsible for keeping your login details secure. Any activity under your account is deemed to have been performed by you."
        },
        "candidateDuties": {
          "title": "Candidate responsibilities",
          "body": "Candidates provide true, current and complete information (CV, contact details, documents), do not submit false, misleading or defamatory material, and accept that hiring decisions rest solely with employers."
        },
        "employerDuties": {
          "title": "Employer and partner responsibilities",
          "body": "Employers and Partners use candidate data only for legitimate hiring purposes and in compliance with KVKK and all labour regulations, never charge candidates a recruitment fee, and sign a written service agreement with JobsAdmire where paid recruitment services are required."
        },
        "fees": {
          "title": "Fees and payments",
          "body": "Job seekers: no recruitment fee is ever charged for standard job placement. Employers and Partners: service packages are governed by separate commercial agreements or purchase orders that set out the scope, pricing and payment terms."
        },
        "ip": {
          "title": "Intellectual property",
          "body": "All content on the website (text, graphics, logos, trademarks, software) is owned by JobsAdmire or its licensors and protected by copyright and industrial property law. You may view or print content for personal use only; any reproduction or redistribution requires the prior written consent of JobsAdmire."
        },
        "acceptableUse": {
          "title": "Acceptable use",
          "body": "You agree not to break any applicable Turkish or international law; post or transmit harmful code, spam or abusive content; harvest, scrape or misuse other people's personal data; or interfere with or disrupt the security or functionality of the website. JobsAdmire may suspend or end access for a violation without prior notice."
        },
        "dataProtection": {
          "title": "Data protection",
          "body": "The Privacy Policy explains how personal data is processed. By using the services you acknowledge that your data may be processed and, where necessary, transferred in line with KVKK and the cross-border transfer rules."
        },
        "thirdParty": {
          "title": "Third-party links and services",
          "body": "The website may link to third-party websites or use third-party services (for example WhatsApp or map providers). JobsAdmire is not responsible for their content, policies or practices."
        },
        "availability": {
          "title": "Service availability",
          "body": "JobsAdmire aims for continuous service but does not guarantee uninterrupted or error-free operation, and may change or discontinue any service temporarily or permanently without liability."
        },
        "liability": {
          "title": "Limitation of liability",
          "body": "To the fullest extent permitted by law, JobsAdmire is not liable for employment outcomes, visa or permit decisions, or damage arising from the decisions of employers, nor for indirect, incidental or consequential damage arising from the use of the website. The total liability of JobsAdmire for any claim does not exceed the amount (if any) the user paid for the specific service that gave rise to the claim. Nothing in these Terms limits liability where Turkish law prohibits such a limitation (for example wilful misconduct or gross negligence)."
        },
        "indemnification": {
          "title": "Indemnification",
          "body": "You agree to indemnify JobsAdmire and hold it harmless against claims, damages or expenses arising from your breach of these Terms or from unlawful use of the services."
        },
        "law": {
          "title": "Governing law and jurisdiction",
          "body": "These Terms are governed by Turkish law. Disputes are resolved by the İstanbul (Anadolu) Courts and Enforcement Offices, unless consumer protection law requires a different forum."
        },
        "amendments": {
          "title": "Amendments",
          "body": "JobsAdmire may update these Terms to reflect legal or service changes. Updates are published with a revised last-updated date, and continued use after an update constitutes acceptance."
        }
      }
    },
    "kvkk": {
      "title": "KVKK Information Notice",
      "intro": "The information notice under the Turkish Law on the Protection of Personal Data No. 6698 (KVKK) on how JobsAdmire, as data controller, processes personal data.",
      "updatedAt": "2026-09-29",
      "pendingTitle": "The information notice is being prepared",
      "pendingBody": "The legal counsel of JobsAdmire is preparing the KVKK information notice. Until it is published, the Privacy Policy describes how JobsAdmire processes personal data and applies in full.",
      "privacyLink": "Read the Privacy Policy"
    },
    "cookiePolicy": {
      "title": "Cookie Policy",
      "intro": "This page explains which cookies jobsadmire.com uses and how you can manage your preferences.",
      "updatedAt": "2026-09-29",
      "pendingTitle": "The full cookie policy is being prepared",
      "pendingBody": "The legal counsel of JobsAdmire is preparing the detailed cookie policy. Until it is published, this summary and the Privacy Policy apply.",
      "sections": {
        "essential": {
          "title": "Strictly necessary cookies",
          "body": "- **ja_locale** — remembers your language choice for up to one year\n- **ja_consent_v1** — remembers your cookie choice for 180 days (also kept in the local storage of your browser)\n- **ja-lang-hint** (local storage) — remembers that you closed the language suggestion\n\nThese are needed for the website to work the way you set it and do not require consent."
        },
        "consent": {
          "title": "Cookies that need your consent",
          "body": "Analytics and advertising cookies (Google Tag Manager, Google Analytics 4, Google Ads) are set only after you choose Accept in the cookie notice. Until you choose, every measurement signal stays denied (Google Consent Mode v2)."
        },
        "manage": {
          "title": "Managing your preferences",
          "body": "When the website asks for your consent, you can change your choice at any time with the Cookie preferences button in the footer. You can also delete cookies in your browser settings."
        }
      }
    }
  }
}
```

`src/messages/tr.json` — merge into `sys.seo`:

```json
{
  "privacy": {
    "title": "Gizlilik Politikası | JobsAdmire",
    "description": "JobsAdmire'ın kişisel verileri KVKK kapsamında nasıl topladığını, kullandığını, sakladığını ve koruduğunu açıklayan politika."
  },
  "terms": {
    "title": "Kullanım Koşulları | JobsAdmire",
    "description": "jobsadmire.com ve JobsAdmire hizmetlerinin kullanımını düzenleyen koşullar (metin şimdilik İngilizcedir)."
  },
  "kvkk": {
    "title": "KVKK Aydınlatma Metni | JobsAdmire",
    "description": "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni."
  },
  "cookiePolicy": {
    "title": "Çerez Politikası | JobsAdmire",
    "description": "jobsadmire.com'un kullandığı çerezler ve tercihlerinizi nasıl yönetebileceğiniz."
  }
}
```

and add this member to `sys` (after `portal`). The Terms `intro`, `updatedAt`, `finalNote` and all sixteen `sections` are the English text **spelled out in full** (W107 — the old site never translated them; §10 row 6 accepts English-only Terms on the TR route under the Turkish notice); only `title` and `englishOnlyNotice` are Turkish:

```json
{
  "legal": {
    "updatedLabel": "Son güncelleme",
    "contents": "İçindekiler",
    "privacy": {
      "title": "Gizlilik Politikası",
      "intro": "Bu Gizlilik Politikası, JobsAdmire'ın jobsadmire.com ve alt alan adlarında (portal.jobsadmire.com adresindeki İş Ortağı Portalı dâhil) ve iletişim kanallarında (e-posta, WhatsApp, telefon) kişisel verileri nasıl işlediğini açıklar. JobsAdmire kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve İŞKUR düzenlemelerine uygun olarak korur.",
      "updatedAt": "2026-09-29",
      "sections": {
        "dataController": {
          "title": "Veri sorumlusu",
          "body": "Veri sorumlusu Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi'dir (\"JobsAdmire\").\n\n- **Adres:** bu web sitesinin alt bilgisinde ve İletişim sayfasında belirtildiği gibi\n- **E-posta:** {email}\n- **Telefon:** {phoneDisplay}\n- **Vergi No:** {taxNo}\n\nJobsAdmire, İŞKUR tarafından izin verilmiş bir özel istihdam bürosu olarak faaliyet gösterir (19.09.2024 tarihli ve {permitNo} sayılı İzin Belgesi). {lawRef} sayılı Kanun uyarınca iş arayanlardan herhangi bir ücret alınması yasaktır. Şikâyetler: İstanbul İŞKUR İl Müdürlüğü Kadıköy Hizmet Merkezi (tel. 0216 418 34 55)."
        },
        "scope": {
          "title": "Kapsam",
          "body": "Bu Politika, aşağıdaki durumlarda JobsAdmire'ın kişisel verileri nasıl işlediğini açıklar:\n\n- bu web sitesini ziyaret ettiğinizde\n- profil oluşturduğunuzda veya CV yüklediğinizde\n- iş başvurusu yaptığınızda\n- hizmet talep ettiğinizde (işe alım, İK, göç ve yerleşim)\n- iş duyurularına veya bültene abone olduğunuzda\n- JobsAdmire ile iş ortaklığı kurduğunuzda\n- İş Ortağı Portalı'nı ve destek kanallarını kullandığınızda"
        },
        "dataCategories": {
          "title": "Kişisel veri kategorileri",
          "body": "- **Kimlik ve iletişim:** ad soyad, e-posta, telefon, adres, uyruk\n- **Aday verileri:** özgeçmiş (CV), eğitim, iş geçmişi, beceriler, referanslar, mülakat notları, profil fotoğrafı, yüklenen belgeler (nitelik belgeleri, lisanslar)\n- **Göç ve yerleşim verileri:** pasaport ve kimlik bilgileri, medeni durum, seyahat geçmişi, ikamet ve çalışma izni bilgileri (yalnızca gerektiğinde)\n- **İşveren ve iş ortağı verileri (B2B):** şirket adı, unvan, iş iletişim bilgileri, pozisyon gereklilikleri, sözleşmeler\n- **İşlem verileri:** ücretli hizmet ayrıntıları ve faturalar (kart verileri JobsAdmire sunucularında hiçbir zaman saklanmaz)\n- **Kullanım ve cihaz verileri:** günlük kayıtları, IP adresi, tarayıcı bilgileri, görüntülenen sayfalar, çerezler\n- **Yazışmalar:** e-postalar, aramalar, WhatsApp ve sohbet mesajları, destek talepleri\n\n**Özel nitelikli kişisel veriler:** JobsAdmire sağlık veya biyometrik verileri kasıtlı olarak toplamaz. Bir pozisyon ya da hukuki süreç bu tür verileri gerektirirse JobsAdmire bunları yalnızca hukuka uygun ve gerekli olduğu ölçüde, KVKK'nın öngördüğü hâllerde açık rızanızla işler."
        },
        "purposes": {
          "title": "Amaçlar ve hukuki sebepler (KVKK md. 5–6)",
          "body": "JobsAdmire kişisel verileri aşağıdaki amaçlarla ve hukuki sebeplere dayanarak işler:\n\n- **Temel hizmetler (adaylar ve işverenler):** hesap oluşturma; adayların eşleştirilmesi ve yerleştirilmesi; başvuru, mülakat, teklif, sözleşme ve işe başlama süreçlerinin yönetimi — sözleşmenin ifası, meşru menfaat, hukuki yükümlülük\n- **Göç ve yerleşim desteği:** ikamet ve çalışma izinleri, vize davetiyeleri, belgeler — sözleşmenin ifası, hukuki yükümlülük, açık rıza (belirli belgeler için)\n- **İş ortağı ve işe alım uzmanı yönetimi (B2B):** kabul süreci, uyum, faturalama — sözleşme, hukuki yükümlülük, meşru menfaat\n- **İletişim ve bildirimler:** iş duyuruları, görüşme planlama, hizmet güncellemeleri — açık rıza (pazarlama), sözleşme veya meşru menfaat (hizmet mesajları)\n- **Güvenlik ve uyum:** denetim kayıtları, erişim kontrolleri, yetkili makamlara yanıt, İŞKUR gereklilikleri — hukuki yükümlülük, meşru menfaat\n- **Ölçüm ve site performansı:** toplu kullanım verileri, web sitesinin iyileştirilmesi — meşru menfaat, rıza (zorunlu olmayan çerezler için)"
        },
        "cookies": {
          "title": "Çerezler ve çevrimiçi tanımlayıcılar",
          "body": "JobsAdmire zorunlu çerezleri ve yalnızca izninizle ölçüm ve reklam çerezlerini kullanır. İzninizi istediğiniz zaman site alt bilgisindeki Çerez tercihleri düğmesiyle değiştirebilir veya geri çekebilirsiniz.\n\nÇerez Politikası; kategorileri, amaçları, sağlayıcıları ve saklama sürelerini listeler ve iznin nasıl geri çekileceğini Kişisel Verileri Koruma Kurulu'nun çerez rehberine uygun olarak açıklar."
        },
        "disclosures": {
          "title": "Üçüncü kişilere aktarım",
          "body": "JobsAdmire kişisel verileri aşağıdaki taraflara aktarabilir:\n\n- işe alım yapmak isteyen işverenler ve müşteriler (yalnızca ilgili aday verileri)\n- yerleştirmeye yardımcı olan yetkili iş ortakları ve işe alım uzmanları\n- hizmet sağlayıcılar ve veri işleyenler (barındırma, İş Ortağı Portalı ve başvuru takip araçları, iletişim, ödeme işlemleri, geçmiş kontrolleri)\n- mevzuatın gerektirdiği hâllerde kamu kurumları ve mahkemeler (İŞKUR, göç idaresi)\n\nTüm veri işleyenler KVKK gerekliliklerini karşılayan sözleşmeler kapsamında hareket eder."
        },
        "transfers": {
          "title": "Yurt dışına aktarım (KVKK md. 9)",
          "body": "Veriler Türkiye dışına aktarıldığında (örneğin bulut barındırma, uluslararası işverenler, küresel araçlar) JobsAdmire 2024 değişiklikleriyle izin verilen mekanizmalara dayanır:\n\n- yeterlilik kararı (varış ülkesi Kurul tarafından tanınmışsa)\n- Kuruma onaylatılan veya bildirilen standart sözleşmeler ya da yazılı taahhütler\n- bağlayıcı şirket kuralları\n- açık rıza (başka bir mekanizma uygulanamıyorsa, son çare olarak)\n\nJobsAdmire aktarım değerlendirmelerinin kaydını tutar."
        },
        "retention": {
          "title": "Saklama süresi",
          "body": "JobsAdmire kişisel verileri yalnızca yukarıdaki amaçların ve yasal zamanaşımı sürelerinin (örneğin iş, ticaret ve İŞKUR mevzuatı) gerektirdiği süre boyunca saklar. Artık gerekli olmayan veriler KVKK'ya uygun olarak silinir veya anonim hâle getirilir."
        },
        "rights": {
          "title": "Haklarınız (KVKK md. 11)",
          "body": "JobsAdmire'a başvurarak:\n\n- kişisel verilerinizin işlenip işlenmediğini öğrenebilir\n- işlenmişse buna ilişkin bilgi talep edebilir\n- işlenme amacını ve alıcıları öğrenebilir\n- düzeltilmesini isteyebilir\n- hukuki sebepleri ortadan kalktığında silinmesini veya anonim hâle getirilmesini isteyebilir\n- münhasıran otomatik sistemlerle işlenmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz edebilir\n- meşru menfaate dayalı işlemeye itiraz edebilir\n- hukuka aykırı işleme nedeniyle zararınızın giderilmesini talep edebilirsiniz.\n\n**Nasıl başvurulur:** Talebin doğrulanmasına yetecek kimlik bilgileriyle birlikte privacy@jobsadmire.com veya {email} adresine e-posta gönderin. JobsAdmire, KVKK'nın öngördüğü şekilde 30 gün içinde yanıt verir. Sonuçtan memnun kalmazsanız, önce veri sorumlusuna başvurduktan sonra Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz."
        },
        "security": {
          "title": "Güvenlik önlemleri",
          "body": "JobsAdmire idari, teknik ve fiziksel güvenlik tedbirleri uygular:\n\n- erişim kontrolü ve en az yetki ilkesi\n- aktarım sırasında ve depolamada şifreleme\n- ağ ve uygulama güvenliği\n- tedarikçi denetimi\n- personelin gizlilik yükümlülüğü\n- yedekleme ve iş sürekliliği\n- veri envanterinin düzenli olarak gözden geçirilmesi"
        },
        "verbis": {
          "title": "VERBİS",
          "body": "JobsAdmire, yasal eşikleri karşıladığı ölçüde VERBİS'e (Veri Sorumluları Sicil Bilgi Sistemi) kaydolur ve kayıtlarını güncel tutar. Kamuya açık VERBİS kayıtları Kurumun portalından sorgulanabilir."
        },
        "children": {
          "title": "Çocuklara ait veriler",
          "body": "JobsAdmire'ın hizmetleri yetişkinlere ve işverenlere yöneliktir. JobsAdmire çocuklardan bilerek veri toplamaz; uygun hukuki sebep ve rıza olmaksızın böyle bir işleme yapıldığını öğrenirse bu verileri siler."
        },
        "thirdParty": {
          "title": "Üçüncü taraf bağlantıları ve sosyal kanallar",
          "body": "Bu web sitesi harici hizmetlere (örneğin WhatsApp veya harita sağlayıcıları) bağlantı verebilir. Bu hizmetlerin gizlilik uygulamaları kendi politikalarına tabidir."
        },
        "changes": {
          "title": "Değişiklikler",
          "body": "JobsAdmire bu Politikayı hizmetlerindeki veya mevzuattaki değişiklikleri (gelecekteki Kurul kararları ve rehberleri dâhil) yansıtmak için güncelleyebilir. Yeni sürüm, güncellenmiş tarihiyle birlikte bu sayfada yayımlanır."
        },
        "contact": {
          "title": "İletişim",
          "body": "KVKK ile ilgili her türlü soru veya talep için:\n\n- **Veri koruma iletişim adresi:** {email}\n- **Alternatif e-posta:** privacy@jobsadmire.com\n- **Telefon:** {phoneDisplay}\n- **Kayıtlı adres:** bu web sitesinin alt bilgisi ve İletişim sayfası"
        }
      }
    },
    "terms": {
      "title": "Kullanım Koşulları",
      "intro": "These Terms and Conditions (\"Terms\") govern access to and use of jobsadmire.com, its subdomains (including the Partner Portal at portal.jobsadmire.com), its mobile interfaces and all related services operated by Jobs Admire Özel İstihdam Bürosu Sanayi ve Ticaret Limited Şirketi (\"JobsAdmire\"). By using the website or the services, you (a \"User\", \"Candidate\", \"Employer\" or \"Partner\") agree to these Terms. If you do not agree, please stop using them.",
      "updatedAt": "2026-09-29",
      "englishOnlyNotice": "Kullanım Koşulları'nın Türkçe metni hukuk danışmanlarıyla birlikte hazırlanmaktadır. Yayımlanana kadar aşağıdaki İngilizce metin geçerlidir.",
      "finalNote": "By accessing, browsing or using any service, communication channel or material JobsAdmire provides — including job search, recruitment, immigration services, career counselling and CV tools, whether through the website, the Partner Portal, e-mail, phone, WhatsApp or any other means — you acknowledge that you have read and understood these Terms and agree to be bound by them.",
      "sections": {
        "legalStatus": {
          "title": "Data controller and legal status",
          "body": "JobsAdmire operates as a private employment agency under İŞKUR Permit No. {permitNo} dated 19.09.2024, in accordance with Law No. {lawRef}. Under this law, no fee may be charged to job seekers for core recruitment services. Contact details and the complaints procedure are set out in the Privacy Policy."
        },
        "services": {
          "title": "Services",
          "body": "JobsAdmire provides job search, candidate placement and recruitment support for employers; immigration, work-permit and residence-permit facilitation where requested; career counselling, interview preparation and related advisory services; and online portal tools for candidates and employers. Some services are free (for example job applications); others (for example employer recruitment packages) may be fee-based."
        },
        "eligibility": {
          "title": "Eligibility",
          "body": "Candidates must be at least 18 years old or of legal working age in their jurisdiction. Employers and Partners must have the legal capacity to enter into binding contracts. By using the website you confirm that all the information you provide is accurate."
        },
        "accounts": {
          "title": "User accounts",
          "body": "You may be given an account to manage applications, candidates or job postings. You are responsible for keeping your login details secure. Any activity under your account is deemed to have been performed by you."
        },
        "candidateDuties": {
          "title": "Candidate responsibilities",
          "body": "Candidates provide true, current and complete information (CV, contact details, documents), do not submit false, misleading or defamatory material, and accept that hiring decisions rest solely with employers."
        },
        "employerDuties": {
          "title": "Employer and partner responsibilities",
          "body": "Employers and Partners use candidate data only for legitimate hiring purposes and in compliance with KVKK and all labour regulations, never charge candidates a recruitment fee, and sign a written service agreement with JobsAdmire where paid recruitment services are required."
        },
        "fees": {
          "title": "Fees and payments",
          "body": "Job seekers: no recruitment fee is ever charged for standard job placement. Employers and Partners: service packages are governed by separate commercial agreements or purchase orders that set out the scope, pricing and payment terms."
        },
        "ip": {
          "title": "Intellectual property",
          "body": "All content on the website (text, graphics, logos, trademarks, software) is owned by JobsAdmire or its licensors and protected by copyright and industrial property law. You may view or print content for personal use only; any reproduction or redistribution requires the prior written consent of JobsAdmire."
        },
        "acceptableUse": {
          "title": "Acceptable use",
          "body": "You agree not to break any applicable Turkish or international law; post or transmit harmful code, spam or abusive content; harvest, scrape or misuse other people's personal data; or interfere with or disrupt the security or functionality of the website. JobsAdmire may suspend or end access for a violation without prior notice."
        },
        "dataProtection": {
          "title": "Data protection",
          "body": "The Privacy Policy explains how personal data is processed. By using the services you acknowledge that your data may be processed and, where necessary, transferred in line with KVKK and the cross-border transfer rules."
        },
        "thirdParty": {
          "title": "Third-party links and services",
          "body": "The website may link to third-party websites or use third-party services (for example WhatsApp or map providers). JobsAdmire is not responsible for their content, policies or practices."
        },
        "availability": {
          "title": "Service availability",
          "body": "JobsAdmire aims for continuous service but does not guarantee uninterrupted or error-free operation, and may change or discontinue any service temporarily or permanently without liability."
        },
        "liability": {
          "title": "Limitation of liability",
          "body": "To the fullest extent permitted by law, JobsAdmire is not liable for employment outcomes, visa or permit decisions, or damage arising from the decisions of employers, nor for indirect, incidental or consequential damage arising from the use of the website. The total liability of JobsAdmire for any claim does not exceed the amount (if any) the user paid for the specific service that gave rise to the claim. Nothing in these Terms limits liability where Turkish law prohibits such a limitation (for example wilful misconduct or gross negligence)."
        },
        "indemnification": {
          "title": "Indemnification",
          "body": "You agree to indemnify JobsAdmire and hold it harmless against claims, damages or expenses arising from your breach of these Terms or from unlawful use of the services."
        },
        "law": {
          "title": "Governing law and jurisdiction",
          "body": "These Terms are governed by Turkish law. Disputes are resolved by the İstanbul (Anadolu) Courts and Enforcement Offices, unless consumer protection law requires a different forum."
        },
        "amendments": {
          "title": "Amendments",
          "body": "JobsAdmire may update these Terms to reflect legal or service changes. Updates are published with a revised last-updated date, and continued use after an update constitutes acceptance."
        }
      }
    },
    "kvkk": {
      "title": "KVKK Aydınlatma Metni",
      "intro": "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, veri sorumlusu sıfatıyla JobsAdmire'ın kişisel verileri nasıl işlediğine ilişkin aydınlatma metni.",
      "updatedAt": "2026-09-29",
      "pendingTitle": "Aydınlatma metni hazırlanıyor",
      "pendingBody": "KVKK aydınlatma metni JobsAdmire'ın hukuk danışmanları tarafından hazırlanmaktadır. Yayımlanana kadar JobsAdmire'ın kişisel verileri nasıl işlediği Gizlilik Politikası'nda açıklanmıştır ve bu politika tüm hükümleriyle geçerlidir.",
      "privacyLink": "Gizlilik Politikası'nı okuyun"
    },
    "cookiePolicy": {
      "title": "Çerez Politikası",
      "intro": "Bu sayfa, jobsadmire.com'un hangi çerezleri kullandığını ve tercihlerinizi nasıl yönetebileceğinizi açıklar.",
      "updatedAt": "2026-09-29",
      "pendingTitle": "Ayrıntılı çerez politikası hazırlanıyor",
      "pendingBody": "Ayrıntılı çerez politikası JobsAdmire'ın hukuk danışmanları tarafından hazırlanmaktadır. Yayımlanana kadar bu özet ve Gizlilik Politikası geçerlidir.",
      "sections": {
        "essential": {
          "title": "Zorunlu çerezler",
          "body": "- **ja_locale** — dil tercihinizi en fazla bir yıl boyunca hatırlar\n- **ja_consent_v1** — çerez tercihinizi 180 gün boyunca hatırlar (tarayıcınızın yerel depolamasında da tutulur)\n- **ja-lang-hint** (yerel depolama) — dil önerisini kapattığınızı hatırlar\n\nBu kayıtlar sitenin sizin ayarladığınız biçimde çalışması için gereklidir ve izin gerektirmez."
        },
        "consent": {
          "title": "İzninize bağlı çerezler",
          "body": "Ölçüm ve reklam çerezleri (Google Tag Manager, Google Analytics 4, Google Ads) yalnızca çerez bildiriminde Kabul et seçeneğini seçmenizden sonra kullanılır. Siz seçim yapana kadar tüm ölçüm sinyalleri reddedilmiş olarak kalır (Google Consent Mode v2)."
        },
        "manage": {
          "title": "Tercihlerinizi yönetme",
          "body": "Site izninizi istediğinde, seçiminizi istediğiniz zaman alt bilgideki Çerez tercihleri düğmesiyle değiştirebilirsiniz. Çerezleri tarayıcı ayarlarınızdan da silebilirsiniz."
        }
      }
    }
  }
}
```

**W175 fallback — apply ONLY when the owner has not confirmed that `privacy@jobsadmire.com` exists** (see Preconditions; skip this paragraph when the controller's brief states the confirmation). The address appears in exactly one string per locale, the `body` of `legal.privacy.sections.contact`. After pasting the two `legal` blocks, drop the "Alternative e-mail" bullet in BOTH files so only `{email}` stays — in `src/messages/en.json` the fragment `\n- **Alternative e-mail:** privacy@jobsadmire.com` and in `src/messages/tr.json` the fragment `\n- **Alternatif e-posta:** privacy@jobsadmire.com`, i.e. these two lines change as shown:

```diff
-          "body": "For any KVKK question or request:\n\n- **Data protection contact:** {email}\n- **Alternative e-mail:** privacy@jobsadmire.com\n- **Phone:** {phoneDisplay}\n- **Registered address:** see the footer of this website and the Contact page"
+          "body": "For any KVKK question or request:\n\n- **Data protection contact:** {email}\n- **Phone:** {phoneDisplay}\n- **Registered address:** see the footer of this website and the Contact page"
```

```diff
-          "body": "KVKK ile ilgili her türlü soru veya talep için:\n\n- **Veri koruma iletişim adresi:** {email}\n- **Alternatif e-posta:** privacy@jobsadmire.com\n- **Telefon:** {phoneDisplay}\n- **Kayıtlı adres:** bu web sitesinin alt bilgisi ve İletişim sayfası"
+          "body": "KVKK ile ilgili her türlü soru veya talep için:\n\n- **Veri koruma iletişim adresi:** {email}\n- **Telefon:** {phoneDisplay}\n- **Kayıtlı adres:** bu web sitesinin alt bilgisi ve İletişim sayfası"
```

Then set `PRIVACY_MAILBOX_CONFIRMED = false` in `src/messages/task13-keys.test.ts` (Step 1's one constant): the key-set test now expects no "Alternative e-mail" / "Alternatif e-posta" bullet and no `privacy@jobsadmire.com` in any legal string, with the `{email}` line still present. In `docs/PRIVACY.md`'s new item 7 (below) replace the clause "`privacy@jobsadmire.com` (W175: the owner confirmed the mailbox exists)," with "no alternative privacy mailbox is published (W175: the owner had not confirmed `privacy@jobsadmire.com`; add the bullet back when the mailbox exists),". Cycle 6 carries the same constant value into its replacement of the test file. Check with `grep -n 'privacy@jobsadmire.com' src/messages/en.json src/messages/tr.json` — it prints nothing once the fallback is applied and two lines (one per file) when it is not.

Copy rules the executor keeps if any string is touched (both files): the company is "JobsAdmire" (TR also "ekip"), never we/us/our or biz/bize/bizim, a first-person-plural verb (-ırız, -ıyoruz, -acağız, -malıyız, -dık) or a first-person possessive (sitemiz, hizmetlerimiz, danışmanımız) — `voice.test.ts` fails on the first three forms, review catches the last; Turkish "Analitik"/"istatistik" end in "-tik" and trip the verb check — the copy says "Ölçüm"; the only braces are the five ICU arguments; no `<`, no `#`, no apostrophe directly before a brace.

`src/app/[locale]/(minimal)/privacy/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'privacy');
}

/** /gizlilik · /en/privacy — the old site's 2025 policy, seeded and re-authored (D14, W154). */
export default async function PrivacyPage({ params }: { params: LegalParams }) {
  const { common } = await loadLegal(params, 'privacy');
  return <LegalDocument {...common} />;
}
```

`src/app/[locale]/(minimal)/terms/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'terms');
}

/** /kullanim-kosullari · /en/terms. §10 row 6: the Terms exist in English only until counsel's
 *  Turkish text lands — the TR route says so in a named placeholder (D26/W55) and marks the
 *  English text with `lang="en"` (WCAG 3.1.2); the EN route renders neither. */
export default async function TermsPage({ params }: { params: LegalParams }) {
  const { locale, sys, common } = await loadLegal(params, 'terms');
  const englishOnly = locale === 'tr';
  return (
    <LegalDocument
      {...common}
      bodyLang={englishOnly ? 'en' : undefined}
      notice={
        englishOnly
          ? {
              testId: 'legal-notice',
              placeholder: 'legal-terms-tr',
              body: sys('legal.terms.englishOnlyNotice'),
            }
          : null
      }
    >
      <p
        data-testid="legal-final-note"
        className="mt-10 border-t border-border-2 pt-6 text-body-sm font-semibold text-text-secondary"
      >
        {sys('legal.terms.finalNote')}
      </p>
    </LegalDocument>
  );
}
```

`src/app/[locale]/(minimal)/kvkk/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import { Button } from '@/design/primitives/Button';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'kvkk');
}

/** /kvkk · /en/kvkk — the KVKK aydınlatma metni is counsel's (D14); until it lands the page is a
 *  named placeholder pointing at the Privacy Policy (W79: no form links here meanwhile). */
export default async function KvkkPage({ params }: { params: LegalParams }) {
  const { sys, common } = await loadLegal(params, 'kvkk');
  return (
    <LegalDocument
      {...common}
      notice={{
        testId: 'legal-pending',
        placeholder: 'legal-kvkk',
        title: sys('legal.kvkk.pendingTitle'),
        body: sys('legal.kvkk.pendingBody'),
        action: (
          <Button variant="secondary" href="/privacy">
            {sys('legal.kvkk.privacyLink')}
          </Button>
        ),
      }}
    />
  );
}
```

`src/app/[locale]/(minimal)/cookie-policy/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import { LegalDocument } from '../_legal/LegalDocument';
import { legalMetadata, loadLegal, type LegalParams } from '../_legal/load';

export function generateMetadata({ params }: { params: LegalParams }): Promise<Metadata> {
  return legalMetadata(params, 'cookiePolicy');
}

/** /cerez-politikasi · /en/cookie-policy — the minimal cookie notice (§10 row 6) under a named
 *  counsel placeholder (D14/D26) until the full policy lands. The consent sheet's policy link
 *  (`sys.consent.policy`) lands here. */
export default async function CookiePolicyPage({ params }: { params: LegalParams }) {
  const { sys, common } = await loadLegal(params, 'cookiePolicy');
  return (
    <LegalDocument
      {...common}
      notice={{
        testId: 'legal-pending',
        placeholder: 'legal-cookie-policy',
        title: sys('legal.cookiePolicy.pendingTitle'),
        body: sys('legal.cookiePolicy.pendingBody'),
      }}
    />
  );
}
```

None of the four exports `revalidate` (no D17 dated badge, W150) or `generateStaticParams` (the locale layout owns it); all four are static.

`src/design/chrome/Footer.tsx` — comment only: replace the two-line JSX comment that begins `{/* W11: Privacy/Terms in the legal row. The pages land in T13; until then the` (and ends `` `[...rest]` catch-all answers 404 inside the chrome. */} ``) with:

```tsx
          {/* W11: Privacy/Terms in the legal row — both pages exist since T13
              (`(minimal)/privacy`, `(minimal)/terms`). */}
```

`src/lib/seo/routes.ts` — in `UNBUILT_PATHNAMES`, delete the four lines `'/privacy',`, `'/terms',`, `'/kvkk',`, `'/cookie-policy',` (14 keys remain).

`e2e/routes.ts` — append after the portal rows:

```ts
  // T13 — the four legal pages: indexable, so Lighthouse audits all eight (W145 budgets apply).
  { path: '/gizlilik', indexable: true },
  { path: '/en/privacy', indexable: true },
  { path: '/kullanim-kosullari', indexable: true },
  { path: '/en/terms', indexable: true },
  { path: '/kvkk', indexable: true },
  { path: '/en/kvkk', indexable: true },
  { path: '/cerez-politikasi', indexable: true },
  { path: '/en/cookie-policy', indexable: true },
```

Docs (same commit):
- `docs/SEO.md` — append four rows after the last row of the `## Pages` table:

```markdown
| Privacy | `/gizlilik` · `/en/privacy` | `sys.seo.privacy.*` | self, per locale | + BreadcrumbList (`Breadcrumbs`) | `h1` (text; on phones Lighthouse may pick the intro paragraph) | index; seeded from main-backup, re-authored in the "JobsAdmire" voice (docs/PRIVACY.md lists the changes) |
| Terms | `/kullanim-kosullari` · `/en/terms` | `sys.seo.terms.*` | self, per locale | + BreadcrumbList | `h1` | index; the TR route shows the English text (`lang="en"`) under the `legal-terms-tr` placeholder notice (§10 row 6) |
| KVKK notice | `/kvkk` · `/en/kvkk` | `sys.seo.kvkk.*` | self, per locale | + BreadcrumbList | `h1` | index; body = the `legal-kvkk` counsel placeholder, links to Privacy |
| Cookie policy | `/cerez-politikasi` · `/en/cookie-policy` | `sys.seo.cookiePolicy.*` | self, per locale | + BreadcrumbList | `h1` | index; the minimal notice (`ja_locale`, `ja_consent_v1`, `ja-lang-hint`, consent-gated GTM/GA4/Ads) + the `legal-cookie-policy` placeholder |
```

  In `## Sitemap`, directly after "(`/`, `/en`, `/isci-talebi`, `/en/hire-workers` — **4 URLs**)" insert "; T13 adds the eight legal URLs (`/gizlilik`, `/kullanim-kosullari`, `/kvkk`, `/cerez-politikasi` and their `/en/…` forms) — 12".
- `docs/ANALYTICS.md` — append to `### Page instrumentation (WP2b)`: "- **Legal pages (T13):** no page events — the minimal chrome's own contact events only."
- `docs/CONTENT-MODEL.md` — append to the per-page list at the end of `### Adding copy (W9, W23, W54)`: "- **Legal (T13):** `sys.legal.updatedLabel`, `sys.legal.contents`; `sys.legal.<doc>.{title,intro,updatedAt}` for `privacy | terms | kvkk | cookiePolicy`; `sys.legal.<doc>.sections.<id>.{title,body}` (ids in `LEGAL_SECTIONS`, `src/lib/legal/documents.ts` — privacy 15, terms 16, cookiePolicy 3); `sys.legal.terms.{englishOnlyNotice,finalNote}`, `sys.legal.kvkk.{pendingTitle,pendingBody,privacyLink}`, `sys.legal.cookiePolicy.{pendingTitle,pendingBody}`; + `sys.seo.{privacy,terms,kvkk,cookiePolicy}.{title,description}`. Bodies are Markdown-lite (blank-line paragraphs, `- ` lists, `**bold**` — `src/lib/legal/body.ts`) formatted through ICU with five settings arguments `{email}`, `{phoneDisplay}`, `{permitNo}`, `{lawRef}`, `{taxNo}` (D17); `updatedAt` is an ISO date rendered by `formatDate`; the TR Terms strings are the English text, spelled out (W107, §10 row 6); server-only (`SERVER_ONLY_SYS`)." — and in the "**Client subset (W90, an allowlist since W148).**" paragraph, replace "`thankYou`, `notFound*`, `skipToContent`, `nav`, `whatsapp`, `blocks` and `marquee` are server-only reads" with "`thankYou`, `notFound*`, `skipToContent`, `nav`, `whatsapp`, `blocks`, `marquee` and T13's `portal`, `legal` and `newsletter` are server-only reads".
- `docs/PRD.md` — `## 8. Legal pages`: append after the paragraph ending "newsletter and pool cards stay off)." the paragraph: "**Shipped in WP2 T13:** `/gizlilik` and `/kullanim-kosullari` carry the old site's 2025 Privacy and Terms text re-authored in the company-as-"JobsAdmire" voice (§3; every normalisation listed for counsel in `docs/PRIVACY.md`); the Turkish Terms route shows the English text under a named placeholder notice (§10 item 6 auto-default); `/kvkk` and `/cerez-politikasi` are counsel placeholders (`data-placeholder`, D14/D26), the cookie page with the minimal notice; every last-updated date is `sys.legal.<doc>.updatedAt`, rendered through `formatDate` (D17)."
- `docs/PRIVACY.md` — append a new section at the end of the file:

```markdown
## Seeded legal copy — counsel review (T13)

The four legal pages are content (`sys.legal.*` in `src/messages/{tr,en}.json`), not this doc; this list is what counsel must know about how they were seeded (D14).

1. **Source.** `origin/main-backup` — `public/locales/{en,tr}/privacy.json` (`privacy.page`, "Last Updated 27 September 2025") and `public/locales/en/terms.json` (`tr/terms.json` is byte-identical — the old site never translated the Terms).
2. **Voice.** Every "we / our / us" and "biz / -iz / -ımız" form is rewritten with "JobsAdmire" as the subject (`docs/PRD.md` §3; `src/messages/voice.test.ts` covers every `sys.*` string, W154); the Terms' own definition of "we", "our", "us" is dropped.
3. **Hosts and names.** `crm.jobsadmire.com` → the Partner Portal at `portal.jobsadmire.com`; "CRM" → "Partner Portal"; "Cookie Settings (site footer)" → the footer's "Cookie preferences" button (shown only when the site asks for consent).
4. **Turkish terminology.** "VERİ KONTROLÖRÜ" → "Veri sorumlusu"; "KURABİYELER" → "Çerezler"; "Analitik" → "Ölçüm" (the voice test reads the "-tik" ending as a first-person-plural past tense).
5. **Structure.** Privacy renumbered 1–15 (the seed's headings skipped and repeated 3, 5, 6→7, 10→12); its "special categories" note is folded into §3.
6. **Content changes to confirm.** "paid service details (premium/resume/interview coaching)" → "details of paid services"; Terms §2 "Resume Generator and online CRM tools" → "online portal tools" and the "premium CV/interview coaching" example dropped; "payment gateways / payment providers" examples → "map providers"; Privacy §5 "analytics/functional/advertising cookies" → "analytics and advertising cookies"; "Cookie Notice … (2022, updated 2025)" → the Board's "cookie guidelines" (no date). "Create a profile" and "CV tools" are kept from the seed — confirm they still describe a service.
7. **Identifiers from settings (D17).** E-mail, phone, İŞKUR permit no., law no. and tax no. are ICU arguments filled from `settings`. Kept literal as legal text: the permit date "19.09.2024", the complaints office (İstanbul İŞKUR Provincial Directorate, Kadıköy Service Centre, 0216 418 34 55), `privacy@jobsadmire.com` (W175: the owner confirmed the mailbox exists), "30 days", KVKK Law No. 6698, the İstanbul (Anadolu) courts.
8. **Dates.** Every page shows `sys.legal.<doc>.updatedAt` = 2026-09-29 — the republication of the normalised text; counsel re-dates on approval.
9. **Still counsel's.** The KVKK aydınlatma metni (`/kvkk`, placeholder `legal-kvkk`), the full cookie policy (`/cerez-politikasi`, placeholder `legal-cookie-policy`; the page carries the minimal notice: `ja_locale` 1 year, `ja_consent_v1` 180 days + local storage, `ja-lang-hint` local storage, GTM/GA4/Ads only after Accept) and the Turkish Terms (`/kullanim-kosullari`, placeholder `legal-terms-tr`).
10. **When counsel's text lands.** Replace the `sys.legal.<doc>.*` values in both files, drop the page's `notice`, and bump `CONSENT_VERSION` (`src/forms/consent.ts`) if the consent wording changes — no other code change.
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `task13-keys.test.ts` (portal + legal, both locales, every string formatted with a throwing `onError`), `voice.test.ts` over the new `sys.legal.*`, `messages.test.ts` parity (the TR Terms spelled out), `unbuilt.test.ts` (14 keys), `robots.test.ts`, `sitemap.test.ts` (the eight legal URLs now listed), `client-messages.test.ts` (no client module reads `legal`/`seo`), the class-collision and client-import guards.

- [ ] **Step 5: Commit**

```bash
git add ':(literal)src/app/[locale]/(minimal)/privacy' ':(literal)src/app/[locale]/(minimal)/terms' ':(literal)src/app/[locale]/(minimal)/kvkk' ':(literal)src/app/[locale]/(minimal)/cookie-policy' src/messages src/lib/seo/routes.ts src/design/chrome/Footer.tsx e2e/routes.ts e2e/pages/legal.spec.ts docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/PRD.md docs/PRIVACY.md
git commit -F - <<'MSG'
feat(legal): privacy and terms seeded from main-backup, KVKK and cookie counsel placeholders (T13, D14)

sys.legal.* in both locales, re-authored in the "JobsAdmire" voice (W154);
the TR Terms are the English text spelled out (W107) under a named
placeholder notice with lang="en" (§10 row 6); /kvkk and /cerez-politikasi
are named counsel placeholders (D26/W55); last-updated dates from
sys.legal.<doc>.updatedAt (D17); identifiers from settings as ICU arguments.
Four keys leave UNBUILT_PATHNAMES (W20); gate rows +8 (W21); docs (W98) and
the counsel review list in PRIVACY.md. The privacy contact section's
alternative mailbox follows the W175 owner check; the e2e pins the package
Home crumb (W176).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 5 — Newsletter pure modules: token checks, the door classifier, the state map, the RFC 8058 predicate, the forwarder

Why this is not `createFormAction`/`postForm` (CLAUDE.md: "every page form goes through the forms kernel"): the confirm/unsubscribe door is not `POST /forms/:formKey` — `postForm`'s URL is fixed to `/api/website/v1/forms/${formKey}`, and there is no catalog entry, envelope, honeypot, captcha, consent or thank-you redirect (a token click is not a lead, D13). The reconcile rulings accept "the newsletter forwarder outside FormShell (T13)" as page-local; it reuses the kernel's credential pair (`doorConfig()`), its deadline and retry rule (`ATTEMPT_TIMEOUT_MS`, `MAX_ATTEMPTS`, `isTimeout` — W74/W117), and is recorded as the named exception in ARCHITECTURE § Forms flow (Cycle 6).

- [ ] **Step 1: Write the failing tests**

`src/lib/newsletter/classify.test.ts` (new):

```ts
import { describe, expect, it } from 'vitest';
import { classifyNewsletterResponse, isOneClickValue, isPlausibleToken } from './classify';

describe('isPlausibleToken', () => {
  it('accepts the door DTO range (16–200 URL-safe characters) and nothing else', () => {
    expect(isPlausibleToken('abcdefghijklmnop')).toBe(true); // 16
    expect(isPlausibleToken('Xk3_9-aQ2bZ8rT0yUu5wVv7sPp1oNn4m')).toBe(true); // a confirm token
    expect(isPlausibleToken('cmfz1abc0000123456.QmFzZTY0dXJsX3NpZ25hdHVyZQ')).toBe(true); // <id>.<hmac>
    expect(isPlausibleToken('short')).toBe(false);
    expect(isPlausibleToken('a'.repeat(201))).toBe(false);
    expect(isPlausibleToken('has space in it 1234')).toBe(false);
    expect(isPlausibleToken('abc%2Fdef0123456789')).toBe(false);
    expect(isPlausibleToken(null)).toBe(false);
    expect(isPlausibleToken(undefined)).toBe(false);
    expect(isPlausibleToken(['a'.repeat(20)])).toBe(false);
  });
});

describe('classifyNewsletterResponse', () => {
  it('maps a 200 carrying an outcome of that route', () => {
    expect(classifyNewsletterResponse('confirm', 200, { data: { outcome: 'CONFIRMED' } })).toEqual({
      kind: 'ok',
      outcome: 'CONFIRMED',
    });
    expect(
      classifyNewsletterResponse('confirm', 200, { data: { outcome: 'ALREADY_CONFIRMED' } }),
    ).toEqual({ kind: 'ok', outcome: 'ALREADY_CONFIRMED' });
    expect(classifyNewsletterResponse('unsubscribe', 200, { data: { outcome: 'UNKNOWN' } })).toEqual(
      { kind: 'ok', outcome: 'UNKNOWN' },
    );
  });

  it("treats the other route's outcome or an unreadable 200 as an outage (R28)", () => {
    expect(
      classifyNewsletterResponse('confirm', 200, { data: { outcome: 'UNSUBSCRIBED' } }),
    ).toEqual({ kind: 'unavailable', cause: 'server' });
    expect(classifyNewsletterResponse('confirm', 200, null)).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(classifyNewsletterResponse('unsubscribe', 200, '<html>')).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
  });

  it('maps the door statuses', () => {
    expect(
      classifyNewsletterResponse('confirm', 400, { code: 'NEWSLETTER_TOKEN_INVALID' }),
    ).toEqual({ kind: 'invalid' });
    expect(
      classifyNewsletterResponse('confirm', 410, { code: 'NEWSLETTER_TOKEN_EXPIRED' }),
    ).toEqual({ kind: 'expired' });
    expect(classifyNewsletterResponse('unsubscribe', 401, {})).toEqual({ kind: 'unauthorized' });
    expect(classifyNewsletterResponse('unsubscribe', 404, null)).toEqual({ kind: 'off' });
    expect(classifyNewsletterResponse('unsubscribe', 429, {})).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
    expect(classifyNewsletterResponse('unsubscribe', 503, {})).toEqual({
      kind: 'unavailable',
      cause: 'server',
    });
  });
});

describe('isOneClickValue (RFC 8058 §3.1)', () => {
  it('is true only for the literal One-Click value', () => {
    expect(isOneClickValue('One-Click')).toBe(true);
    expect(isOneClickValue('one-click')).toBe(false);
    expect(isOneClickValue('')).toBe(false);
    expect(isOneClickValue(null)).toBe(false);
  });
});
```

`src/lib/newsletter/copy.test.ts` (new):

```ts
import { describe, expect, it } from 'vitest';
import { NEWSLETTER_STATES, resultState, stateCopyKey } from './copy';

const COMMON = [
  'noToken',
  { kind: 'invalid' },
  { kind: 'expired' },
  { kind: 'off' },
  { kind: 'unauthorized' },
  { kind: 'unconfigured' },
  { kind: 'unavailable', cause: 'network' },
] as const;
const OK = {
  confirm: [
    { kind: 'ok', outcome: 'CONFIRMED' },
    { kind: 'ok', outcome: 'ALREADY_CONFIRMED' },
  ],
  unsubscribe: [
    { kind: 'ok', outcome: 'UNSUBSCRIBED' },
    { kind: 'ok', outcome: 'ALREADY_UNSUBSCRIBED' },
    { kind: 'ok', outcome: 'UNKNOWN' },
  ],
} as const;

describe('resultState (I12: 400/410/UNKNOWN/unreachable add the manual fallback)', () => {
  it('maps every result to the state the page shows', () => {
    expect(resultState('confirm', 'noToken')).toEqual({ state: 'noToken', fallback: true });
    expect(resultState('confirm', { kind: 'ok', outcome: 'CONFIRMED' })).toEqual({
      state: 'CONFIRMED',
      fallback: false,
    });
    expect(resultState('unsubscribe', { kind: 'ok', outcome: 'UNSUBSCRIBED' })).toEqual({
      state: 'UNSUBSCRIBED',
      fallback: false,
    });
    expect(resultState('unsubscribe', { kind: 'ok', outcome: 'UNKNOWN' })).toEqual({
      state: 'UNKNOWN',
      fallback: true,
    });
    expect(resultState('confirm', { kind: 'invalid' })).toEqual({ state: 'invalid', fallback: true });
    expect(resultState('confirm', { kind: 'expired' })).toEqual({ state: 'expired', fallback: true });
    // Only the confirm door answers 410; a stray one on unsubscribe reads as a bad link.
    expect(resultState('unsubscribe', { kind: 'expired' })).toEqual({
      state: 'invalid',
      fallback: true,
    });
    for (const result of [
      { kind: 'off' },
      { kind: 'unauthorized' },
      { kind: 'unconfigured' },
      { kind: 'unavailable', cause: 'timeout' },
    ] as const)
      expect(resultState('unsubscribe', result)).toEqual({ state: 'unavailable', fallback: true });
  });

  it('every state a result can reach has copy on its page', () => {
    for (const kind of ['confirm', 'unsubscribe'] as const)
      for (const result of [...COMMON, ...OK[kind]])
        expect(NEWSLETTER_STATES[kind]).toContain(resultState(kind, result).state);
  });
});

describe('stateCopyKey', () => {
  it('names the sys.newsletter block of each state', () => {
    expect(stateCopyKey('confirm', 'noToken')).toBe('newsletter.noToken');
    expect(stateCopyKey('unsubscribe', 'unavailable')).toBe('newsletter.unavailable');
    expect(stateCopyKey('confirm', 'invalid')).toBe('newsletter.confirm.invalid');
    expect(stateCopyKey('unsubscribe', 'invalid')).toBe('newsletter.unsubscribe.invalid');
    expect(stateCopyKey('confirm', 'expired')).toBe('newsletter.confirm.expired');
    expect(stateCopyKey('confirm', 'CONFIRMED')).toBe('newsletter.confirm.outcome.CONFIRMED');
    expect(stateCopyKey('unsubscribe', 'UNKNOWN')).toBe('newsletter.unsubscribe.outcome.UNKNOWN');
  });
});
```

`src/lib/newsletter/one-click.test.ts` (new):

```ts
import { describe, expect, it } from 'vitest';
import { pathnames } from '@/i18n/routing';
import { isOneClickUnsubscribe, ONE_CLICK_PATHS } from './one-click';

describe('the newsletter paths mirror Ops NEWSLETTER_PATHS verbatim (never change one side alone)', () => {
  it('confirm and unsubscribe keep the slugs Operations prints into the mails', () => {
    expect(pathnames['/newsletter/confirm']).toEqual({ tr: '/abone-onay', en: '/newsletter/confirm' });
    expect(pathnames['/newsletter/unsubscribe']).toEqual({
      tr: '/abonelikten-cik',
      en: '/newsletter/unsubscribe',
    });
    expect([...ONE_CLICK_PATHS]).toEqual(['/abonelikten-cik', '/en/newsletter/unsubscribe']);
  });
});

describe('isOneClickUnsubscribe (the proxy predicate, RFC 8058)', () => {
  it('matches a POST without Next-Action to either unsubscribe page', () => {
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik', false)).toBe(true);
    expect(isOneClickUnsubscribe('POST', '/en/newsletter/unsubscribe', false)).toBe(true);
    expect(isOneClickUnsubscribe('post', '/abonelikten-cik', false)).toBe(true);
  });

  it('never matches a server action, a GET, the confirm page or another spelling', () => {
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik', true)).toBe(false);
    expect(isOneClickUnsubscribe('GET', '/abonelikten-cik', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/abone-onay', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/en/newsletter/confirm', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik/', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/tr/abonelikten-cik', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/newsletter/unsubscribe', false)).toBe(false);
  });
});
```

`src/lib/newsletter/forward.test.ts` (new):

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ATTEMPT_TIMEOUT_MS } from '@/forms/post';
import { forwardNewsletterToken, type ForwardDeps } from './forward';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com/',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;
const TOKEN = 'cmfz1abc0000123456.QmFzZTY0dXJsX3NpZ25hdHVyZQ';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
// A fetch that never answers on its own — it rejects only when its signal aborts (a hung door).
const hang = (_url: string, init: RequestInit) =>
  new Promise<Response>((_, reject) => {
    init.signal!.addEventListener('abort', () => reject(init.signal!.reason));
  });

function setup() {
  const fetchMock = vi.fn<(url: string, init: RequestInit) => Promise<Response>>();
  const deps: ForwardDeps = { fetch: fetchMock as unknown as typeof fetch, env };
  return { fetchMock, deps };
}

afterEach(() => vi.restoreAllMocks());

describe('forwardNewsletterToken (I12, W74/W117)', () => {
  it('never calls the door for an implausible token', async () => {
    const { fetchMock, deps } = setup();
    expect(await forwardNewsletterToken('confirm', 'x', deps)).toEqual({ kind: 'invalid' });
    expect(await forwardNewsletterToken('confirm', null, deps)).toEqual({ kind: 'invalid' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers unconfigured without a call when this deployment has no door (W92)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fetchMock } = setup();
    const res = await forwardNewsletterToken('unsubscribe', TOKEN, {
      fetch: fetchMock as unknown as typeof fetch,
      env: { NODE_ENV: 'test' } as NodeJS.ProcessEnv,
    });
    expect(res).toEqual({ kind: 'unconfigured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('confirm: GET …/newsletter/confirm with the write token and the encoded token, uncached', async () => {
    const { fetchMock, deps } = setup();
    fetchMock.mockResolvedValue(json(200, { data: { outcome: 'CONFIRMED' } }));
    expect(await forwardNewsletterToken('confirm', TOKEN, deps)).toEqual({
      kind: 'ok',
      outcome: 'CONFIRMED',
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://operations.example.com/api/website/v1/newsletter/confirm?token=${encodeURIComponent(TOKEN)}`,
    );
    expect(init.method).toBe('GET');
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
    );
    expect(init.cache).toBe('no-store');
    expect(init.body).toBeUndefined();
  });

  it('unsubscribe: a body-less POST — the RFC 8058 forward the door accepts', async () => {
    const { fetchMock, deps } = setup();
    fetchMock.mockResolvedValue(json(200, { data: { outcome: 'UNSUBSCRIBED' } }));
    expect(await forwardNewsletterToken('unsubscribe', TOKEN, deps)).toEqual({
      kind: 'ok',
      outcome: 'UNSUBSCRIBED',
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://operations.example.com/api/website/v1/newsletter/unsubscribe?token=${encodeURIComponent(TOKEN)}`,
    );
    expect(init.method).toBe('POST');
    expect(init.body).toBeUndefined();
  });

  it('maps the door answers without retrying any of them', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const cases = [
      [json(400, { code: 'NEWSLETTER_TOKEN_INVALID' }), { kind: 'invalid' }],
      [json(410, { code: 'NEWSLETTER_TOKEN_EXPIRED' }), { kind: 'expired' }],
      [json(401, {}), { kind: 'unauthorized' }],
      [new Response(null, { status: 404 }), { kind: 'off' }],
      [new Response(null, { status: 503 }), { kind: 'unavailable', cause: 'server' }],
      [new Response('<html>', { status: 200 }), { kind: 'unavailable', cause: 'server' }],
    ] as const;
    for (const [response, expected] of cases) {
      const { fetchMock, deps } = setup();
      fetchMock.mockResolvedValue(response);
      expect(await forwardNewsletterToken('confirm', TOKEN, deps)).toEqual(expected);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
    // never the token in a log line
    expect(JSON.stringify(errors.mock.calls)).not.toContain(TOKEN);
  });

  it('retries ONCE after a connection-level failure (W74)', async () => {
    const { fetchMock, deps } = setup();
    fetchMock
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(json(200, { data: { outcome: 'ALREADY_CONFIRMED' } }));
    expect(await forwardNewsletterToken('confirm', TOKEN, deps)).toEqual({
      kind: 'ok',
      outcome: 'ALREADY_CONFIRMED',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('two connection failures → unavailable/network', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fetchMock, deps } = setup();
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    expect(await forwardNewsletterToken('unsubscribe', TOKEN, deps)).toEqual({
      kind: 'unavailable',
      cause: 'network',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('a timeout is not retried, and both attempts share one deadline (W117)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { fetchMock, deps } = setup();
    fetchMock.mockImplementation(hang);
    expect(await forwardNewsletterToken('confirm', TOKEN, { ...deps, timeoutMs: 20 })).toEqual({
      kind: 'unavailable',
      cause: 'timeout',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const second = setup();
    second.fetchMock.mockRejectedValueOnce(new TypeError('fetch failed')).mockImplementationOnce(hang);
    expect(
      await forwardNewsletterToken('confirm', TOKEN, { ...second.deps, timeoutMs: 20 }),
    ).toEqual({ kind: 'unavailable', cause: 'timeout' });
    const [first, retry] = second.fetchMock.mock.calls.map(([, init]) => init.signal);
    expect(retry).toBe(first);
  });

  it('uses the forms kernel deadline (W117: 9 s)', () => {
    expect(ATTEMPT_TIMEOUT_MS).toBe(9000);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/lib/newsletter
```
Expected: FAIL — the five modules do not exist.

- [ ] **Step 3: Implement**

`src/lib/newsletter/types.ts` (new — client-safe, no directive):

```ts
/** Newsletter confirm/unsubscribe (docs/INTEGRATIONS.md I12) — types shared by the forwarder,
 *  the server actions, the one-click route and the page's island. */
export type NewsletterForwardKind = 'confirm' | 'unsubscribe';

/** The door's 200 outcomes per route (`website-newsletter.service.ts`). */
export const CONFIRM_OUTCOMES = ['CONFIRMED', 'ALREADY_CONFIRMED'] as const;
export const UNSUBSCRIBE_OUTCOMES = ['UNSUBSCRIBED', 'ALREADY_UNSUBSCRIBED', 'UNKNOWN'] as const;
export type NewsletterDoorOutcome =
  | (typeof CONFIRM_OUTCOMES)[number]
  | (typeof UNSUBSCRIBE_OUTCOMES)[number];

/** One forwarded token, classified. */
export type NewsletterForwardResult =
  | { kind: 'ok'; outcome: NewsletterDoorOutcome }
  | { kind: 'invalid' } // 400 NEWSLETTER_TOKEN_INVALID — or a token that never left the site
  | { kind: 'expired' } // 410 — confirm only (48 h on the Ops side)
  | { kind: 'off' } // bare 404 — the website module flag is off
  | { kind: 'unauthorized' } // 401 — the write token was refused
  | { kind: 'unconfigured' } // no OPS_API_URL / usable write token here — no call made (W92)
  | { kind: 'unavailable'; cause: 'network' | 'timeout' | 'server' };

/** What the island's `useActionState` holds. */
export type NewsletterActionState =
  | { status: 'idle' }
  | { status: 'done'; result: NewsletterForwardResult };

export const IDLE_NEWSLETTER_STATE: NewsletterActionState = { status: 'idle' };
```

`src/lib/newsletter/classify.ts` (new — pure, client-safe):

```ts
import {
  CONFIRM_OUTCOMES,
  UNSUBSCRIBE_OUTCOMES,
  type NewsletterDoorOutcome,
  type NewsletterForwardKind,
  type NewsletterForwardResult,
} from './types';

/** The door's `NewsletterTokenQueryDto` takes 16–200 characters. Confirm tokens are 32 base64url
 *  characters, unsubscribe tokens `<subscriberId>.<hmac>` — URL-safe characters only, so
 *  anything else is refused here and never leaves the site. */
const TOKEN_RE = /^[A-Za-z0-9._~-]{16,200}$/;

export function isPlausibleToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN_RE.test(value);
}

function isOutcomeOf(kind: NewsletterForwardKind, value: unknown): value is NewsletterDoorOutcome {
  const allowed: readonly string[] = kind === 'confirm' ? CONFIRM_OUTCOMES : UNSUBSCRIBE_OUTCOMES;
  return typeof value === 'string' && allowed.includes(value);
}

/** HTTP status + parsed body → result. A 200 that is not the door's JSON (a proxy page, a login
 *  wall) is an outage (R28); an answer is never retried (W74). */
export function classifyNewsletterResponse(
  kind: NewsletterForwardKind,
  status: number,
  body: unknown,
): NewsletterForwardResult {
  if (status === 200) {
    const outcome = (body as { data?: { outcome?: unknown } } | null)?.data?.outcome;
    return isOutcomeOf(kind, outcome)
      ? { kind: 'ok', outcome }
      : { kind: 'unavailable', cause: 'server' };
  }
  if (status === 400) return { kind: 'invalid' };
  if (status === 410) return { kind: 'expired' };
  if (status === 401) return { kind: 'unauthorized' };
  if (status === 404) return { kind: 'off' };
  return { kind: 'unavailable', cause: 'server' };
}

/** RFC 8058 §3.1: the one-click POST carries the key/value pair `List-Unsubscribe=One-Click`
 *  (as `multipart/form-data` or `application/x-www-form-urlencoded`). */
export function isOneClickValue(value: FormDataEntryValue | null): boolean {
  return value === 'One-Click';
}
```

`src/lib/newsletter/copy.ts` (new — pure, client-safe):

```ts
import type {
  NewsletterDoorOutcome,
  NewsletterForwardKind,
  NewsletterForwardResult,
} from './types';

/** Every state a newsletter page can show. */
export type NewsletterState = 'noToken' | 'invalid' | 'expired' | 'unavailable' | NewsletterDoorOutcome;

/** The states each page can reach — the server page resolves copy for exactly these. */
export const NEWSLETTER_STATES: Readonly<Record<NewsletterForwardKind, readonly NewsletterState[]>> =
  {
    confirm: ['noToken', 'invalid', 'expired', 'unavailable', 'CONFIRMED', 'ALREADY_CONFIRMED'],
    unsubscribe: [
      'noToken',
      'invalid',
      'unavailable',
      'UNSUBSCRIBED',
      'ALREADY_UNSUBSCRIBED',
      'UNKNOWN',
    ],
  };

/** The `sys.newsletter.*` block (`.title` + `.body`) of one state. */
export function stateCopyKey(kind: NewsletterForwardKind, state: NewsletterState): string {
  switch (state) {
    case 'noToken':
      return 'newsletter.noToken';
    case 'unavailable':
      return 'newsletter.unavailable';
    case 'invalid':
      return `newsletter.${kind}.invalid`;
    case 'expired':
      return 'newsletter.confirm.expired';
    default:
      return `newsletter.${kind}.outcome.${state}`;
  }
}

/** The state a result shows, and whether the manual `info@jobsadmire.com` + WhatsApp fallback
 *  joins it (I12: 400/410/UNKNOWN/unreachable — and a link without its token). */
export function resultState(
  kind: NewsletterForwardKind,
  result: NewsletterForwardResult | 'noToken',
): { state: NewsletterState; fallback: boolean } {
  if (result === 'noToken') return { state: 'noToken', fallback: true };
  switch (result.kind) {
    case 'ok':
      return { state: result.outcome, fallback: result.outcome === 'UNKNOWN' };
    case 'invalid':
      return { state: 'invalid', fallback: true };
    case 'expired':
      // Only the confirm door answers 410; a stray one on unsubscribe reads as a bad link.
      return { state: kind === 'confirm' ? 'expired' : 'invalid', fallback: true };
    default:
      return { state: 'unavailable', fallback: true };
  }
}
```

`src/lib/newsletter/one-click.ts` (new — edge-safe: imports only the routing table `src/proxy.ts` already loads):

```ts
import { locales, pathnames, routing } from '@/i18n/routing';

/** The external paths Operations prints in `List-Unsubscribe` — `NEWSLETTER_PATHS.unsubscribe`
 *  mirrors `pathnames['/newsletter/unsubscribe']` verbatim: TR at the root, EN under `/en`. */
export const ONE_CLICK_PATHS: readonly string[] = locales.map((locale) => {
  const external = pathnames['/newsletter/unsubscribe'][locale];
  return locale === routing.defaultLocale ? external : `/${locale}${external}`;
});

/**
 * RFC 8058: a mail client POSTs `List-Unsubscribe=One-Click` to the unsubscribe PAGE URL, and a
 * page cannot answer a POST — `src/proxy.ts` rewrites it to `/api/newsletter/unsubscribe`. A
 * server-action call carries the `Next-Action` header and passes through; the page's own button
 * never submits a native form (`NewsletterAction` dispatches from a click handler), so no browser
 * POST without that header ever reaches these paths.
 */
export function isOneClickUnsubscribe(
  method: string,
  pathname: string,
  hasNextAction: boolean,
): boolean {
  return method.toUpperCase() === 'POST' && !hasNextAction && ONE_CLICK_PATHS.includes(pathname);
}
```

`src/lib/newsletter/forward.ts` (new — `server-only`; Vitest resolves the marker to an empty module, R2):

```ts
import 'server-only';
import { doorConfig } from '@/forms/env';
import { ATTEMPT_TIMEOUT_MS, MAX_ATTEMPTS } from '@/forms/post';
import { isTimeout } from '@/forms/visitor';
import { classifyNewsletterResponse, isPlausibleToken } from './classify';
import type { NewsletterForwardKind, NewsletterForwardResult } from './types';

/** Test seams only — production callers pass nothing. */
export type ForwardDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; timeoutMs?: number };

/**
 * Forwards a mail-link token to Operations (docs/INTEGRATIONS.md I12): `GET …/newsletter/confirm`
 * or a body-less `POST …/newsletter/unsubscribe` (the RFC 8058 shape the door accepts), token in
 * the query, the write token as Bearer. Called ONLY from a visitor's click (the two server
 * actions) or the one-click route handler — never during a render, where a mail-link scanner
 * would spend the one-shot confirm token (W5, I12). The forms kernel's rule (W74/W117): one
 * shared `ATTEMPT_TIMEOUT_MS` deadline, one retry only after a connection-level failure, a
 * timeout or any answer final. Logs name the kind and the status only — never the token.
 */
export async function forwardNewsletterToken(
  kind: NewsletterForwardKind,
  token: unknown,
  deps: ForwardDeps = {},
): Promise<NewsletterForwardResult> {
  if (!isPlausibleToken(token)) return { kind: 'invalid' };
  const door = doorConfig(deps.env ?? process.env);
  if (!door) {
    console.error('[newsletter] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured', { kind });
    return { kind: 'unconfigured' };
  }
  const doFetch = deps.fetch ?? fetch;
  const url = `${door.base}/api/website/v1/newsletter/${kind}?token=${encodeURIComponent(token)}`;
  const method = kind === 'confirm' ? 'GET' : 'POST';
  const headers = { Authorization: `Bearer ${door.token}`, Accept: 'application/json' };
  // One deadline for the whole call — the retry gets what is left of it (W117).
  const signal = AbortSignal.timeout(deps.timeoutMs ?? ATTEMPT_TIMEOUT_MS);

  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await doFetch(url, { method, headers, cache: 'no-store', signal });
    } catch (err) {
      if (!isTimeout(err) && attempt < MAX_ATTEMPTS) continue; // connection-level: retry once
      const cause = isTimeout(err) ? 'timeout' : 'network';
      console.error('[newsletter] unavailable', { kind, cause, attempt });
      return { kind: 'unavailable', cause };
    }
    const body: unknown = await res.json().catch(() => null);
    const result = classifyNewsletterResponse(kind, res.status, body);
    if (result.kind === 'off' || result.kind === 'unauthorized' || result.kind === 'unavailable')
      console.error('[newsletter] the door refused', { kind, status: res.status });
    return result;
  }
}
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green (the modules are not imported by a page yet).

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter
git commit -F - <<'MSG'
feat(newsletter): token forwarder, door classifier, state map and RFC 8058 predicate (T13, I12)

forwardNewsletterToken: GET confirm / body-less POST unsubscribe with the
write token, the kernel's W74/W117 retry rule and deadline, never on render,
never the token in a log. classifyNewsletterResponse maps 200/400/410/401/404;
resultState/stateCopyKey decide the page state and the manual fallback;
isOneClickUnsubscribe is the proxy's predicate over the mirrored paths.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 6 — Newsletter pages, the click-to-forward island, the one-click route and the proxy rewrite

- [ ] **Step 1: Write the failing tests**

`src/messages/task13-keys.test.ts` — replace the whole file (portal + legal + newsletter):

```ts
import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import type { Locale } from '@/i18n/routing';
import { LEGAL_DOCS, LEGAL_SECTIONS } from '@/lib/legal/documents';
import { NEWSLETTER_STATES, stateCopyKey } from '@/lib/newsletter/copy';
import en from './en.json';
import tr from './tr.json';

/**
 * T13's `sys.*` keys (W9/W23). Every one is read by a server component through
 * `getTranslations('sys')` — never by a client island (W90/W148; the newsletter island receives
 * resolved strings as props) — so a missing key would render a MISSING_MESSAGE string that no e2e
 * text check reliably catches. Pinned per locale here, each formatted through next-intl itself
 * with an `onError` that throws.
 */
const MESSAGES: Record<Locale, Messages> = { tr, en };

/** The five ICU arguments every legal string receives (`legalValues(settings)`, D17). */
const LEGAL_VALUES = {
  email: 'info@example.com',
  phoneDisplay: '+90 000 000 00 00',
  permitNo: '1730',
  lawRef: '4904',
  taxNo: '48422122',
};

/**
 * W175 (owner check, Preconditions): `privacy@jobsadmire.com` is published as the Privacy
 * policy's "Alternative e-mail" only while the owner has confirmed the mailbox exists. Leave
 * `true` when the controller's brief states that confirmation; set `false` when it does not —
 * Cycle 4 Step 3's W175 fallback then removes the bullet in both locales and the test below
 * expects it gone (only `{email}` stays). Cycle 6 replaces this file: keep Cycle 4's value.
 */
const PRIVACY_MAILBOX_CONFIRMED = true;

const PORTAL_KEYS = ['seo.portal.title', 'seo.portal.description', 'portal.intro', 'portal.signIn'];

const LEGAL_KEYS = [
  'legal.updatedLabel',
  'legal.contents',
  ...LEGAL_DOCS.flatMap((doc) => [
    `seo.${doc}.title`,
    `seo.${doc}.description`,
    `legal.${doc}.title`,
    `legal.${doc}.intro`,
    `legal.${doc}.updatedAt`,
    ...LEGAL_SECTIONS[doc].flatMap((id) => [
      `legal.${doc}.sections.${id}.title`,
      `legal.${doc}.sections.${id}.body`,
    ]),
  ]),
  'legal.terms.englishOnlyNotice',
  'legal.terms.finalNote',
  'legal.kvkk.pendingTitle',
  'legal.kvkk.pendingBody',
  'legal.kvkk.privacyLink',
  'legal.cookiePolicy.pendingTitle',
  'legal.cookiePolicy.pendingBody',
];

const NEWSLETTER_KEYS = [
  'seo.newsletterConfirm.title',
  'seo.newsletterConfirm.description',
  'seo.newsletterUnsubscribe.title',
  'seo.newsletterUnsubscribe.description',
  'newsletter.backHome',
  'newsletter.fallback.lead',
  'newsletter.fallback.email',
  'newsletter.fallback.whatsapp',
  'newsletter.fallback.subject',
  ...(['confirm', 'unsubscribe'] as const).flatMap((kind) => [
    `newsletter.${kind}.title`,
    `newsletter.${kind}.body`,
    `newsletter.${kind}.button`,
    `newsletter.${kind}.pending`,
    ...NEWSLETTER_STATES[kind].flatMap((state) => [
      `${stateCopyKey(kind, state)}.title`,
      `${stateCopyKey(kind, state)}.body`,
    ]),
  ]),
];

function translator(locale: Locale) {
  return createTranslator({
    locale,
    messages: MESSAGES[locale],
    namespace: 'sys',
    onError: (error) => {
      throw error;
    },
  });
}

/** `sys.legal.<doc>` as plain data, for the structural checks. */
const legalOf = (locale: Locale) =>
  (MESSAGES[locale] as { sys: { legal: Record<string, Record<string, unknown>> } }).sys.legal;

describe('T13 sys keys (W9/W23)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: every portal, legal and newsletter key is a non-empty, fully formatted string`, () => {
      const t = translator(locale);
      for (const key of [...PORTAL_KEYS, ...LEGAL_KEYS, ...NEWSLETTER_KEYS]) {
        const value = t(key, LEGAL_VALUES);
        expect(value.trim().length, key).toBeGreaterThan(0);
        expect(value, key).not.toMatch(/[{}]/);
      }
    });

    it(`${locale}: every legal updatedAt is a real calendar date (D17)`, () => {
      for (const doc of LEGAL_DOCS) {
        const iso = String(legalOf(locale)[doc].updatedAt);
        expect(iso, doc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10), doc).toBe(iso);
      }
    });

    it(`${locale}: every legal body is Markdown-lite — a block is all "- " lines or none`, () => {
      const t = translator(locale);
      for (const key of LEGAL_KEYS.filter((k) => k.endsWith('.body'))) {
        for (const block of t(key, LEGAL_VALUES).split(/\n[ \t]*\n/)) {
          const lines = block
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          const listed = lines.filter((l) => l.startsWith('- ')).length;
          expect(listed === 0 || listed === lines.length, key).toBe(true);
        }
      }
    });

    it(`${locale}: the alternative privacy mailbox appears only in the privacy contact section, and only while the owner confirmed it (W175)`, () => {
      const t = translator(locale);
      const contact = t('legal.privacy.sections.contact.body', LEGAL_VALUES);
      expect(contact).toContain(LEGAL_VALUES.email);
      expect(/Alternative e-mail|Alternatif e-posta/.test(contact)).toBe(PRIVACY_MAILBOX_CONFIRMED);
      const mentions = LEGAL_KEYS.filter((key) =>
        t(key, LEGAL_VALUES).includes('privacy@jobsadmire.com'),
      );
      expect(mentions).toEqual(
        PRIVACY_MAILBOX_CONFIRMED ? ['legal.privacy.sections.contact.body'] : [],
      );
    });
  }

  it('the Turkish Terms carry the English text, spelled out in tr.json (§10 row 6, W107)', () => {
    const [trTerms, enTerms] = [legalOf('tr').terms, legalOf('en').terms];
    expect(trTerms.intro).toBe(enTerms.intro);
    expect(trTerms.finalNote).toBe(enTerms.finalNote);
    expect(trTerms.sections).toEqual(enTerms.sections);
    expect(trTerms.title).not.toBe(enTerms.title);
    expect(trTerms.englishOnlyNotice).not.toBe(enTerms.englishOnlyNotice);
  });
});
```

`src/app/[locale]/(minimal)/newsletter/_components/__tests__/NewsletterAction.test.tsx` (new):

```tsx
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NewsletterActionState, NewsletterForwardResult } from '@/lib/newsletter/types';
import { renderWithIntl } from '@/test/render';
import { NewsletterAction, type NewsletterActionFn } from '../NewsletterAction';

const TOKEN = 'confirm-token-0123456789abcdef';
const copy = (name: string) => ({ title: `${name} title`, body: `${name} body` });
const props = {
  token: TOKEN,
  labels: { button: 'Confirm subscription', pending: 'Confirming…' },
  outcomes: {
    noToken: copy('noToken'),
    invalid: copy('invalid'),
    expired: copy('expired'),
    unavailable: copy('unavailable'),
    CONFIRMED: copy('CONFIRMED'),
    ALREADY_CONFIRMED: copy('ALREADY_CONFIRMED'),
    UNSUBSCRIBED: copy('UNSUBSCRIBED'),
    ALREADY_UNSUBSCRIBED: copy('ALREADY_UNSUBSCRIBED'),
    UNKNOWN: copy('UNKNOWN'),
  },
  fallbackCopy: { lead: 'Contact JobsAdmire', email: 'E-mail JobsAdmire', whatsapp: 'Message on WhatsApp' },
  links: {
    emailHref: 'mailto:info@jobsadmire.com?subject=Newsletter%20subscription',
    whatsappHref: 'https://wa.me/905011240340?text=Hello%20JobsAdmire%2C%20',
  },
};
const done = (result: NewsletterForwardResult): NewsletterActionState => ({ status: 'done', result });

afterEach(() => vi.restoreAllMocks());

describe('NewsletterAction (T13, I12)', () => {
  it('forwards nothing until the click, then shows the outcome and moves focus to it', async () => {
    const action = vi.fn<NewsletterActionFn>(async () => done({ kind: 'ok', outcome: 'CONFIRMED' }));
    renderWithIntl(<NewsletterAction kind="confirm" action={action} {...props} />, { locale: 'en' });
    expect(action).not.toHaveBeenCalled();
    expect(screen.getByTestId('newsletter-action')).toHaveAttribute('data-ready', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    const outcome = await screen.findByTestId('newsletter-outcome');
    expect(outcome).toHaveAttribute('data-outcome', 'CONFIRMED');
    expect(outcome).toHaveTextContent('CONFIRMED title');
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][1]).toBe(TOKEN);
    await waitFor(() => expect(screen.getByTestId('newsletter-answer')).toHaveFocus());
    expect(screen.queryByRole('button', { name: 'Confirm subscription' })).toBeNull();
  });

  it('a refused link shows the manual fallback — static hrefs, never the token (W76)', async () => {
    const action = vi.fn<NewsletterActionFn>(async () => done({ kind: 'invalid' }));
    const { container } = renderWithIntl(
      <NewsletterAction kind="confirm" action={action} {...props} />,
      { locale: 'en' },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute('data-outcome', 'invalid');
    expect(screen.getByRole('link', { name: 'E-mail JobsAdmire' })).toHaveAttribute(
      'href',
      props.links.emailHref,
    );
    expect(screen.getByRole('link', { name: 'Message on WhatsApp' })).toHaveAttribute(
      'href',
      props.links.whatsappHref,
    );
    expect(container.innerHTML).not.toContain(TOKEN);
  });

  it('a rejected server action becomes the unavailable fallback, never the error boundary', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const action = vi.fn<NewsletterActionFn>(async () => {
      throw new Error('fetch failed');
    });
    renderWithIntl(<NewsletterAction kind="unsubscribe" action={action} {...props} />, {
      locale: 'en',
    });
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute(
      'data-outcome',
      'unavailable',
    );
  });

  it('unsubscribe: UNKNOWN keeps the fallback beside the outcome; a stray 410 reads as invalid', async () => {
    const unknown = vi.fn<NewsletterActionFn>(async () => done({ kind: 'ok', outcome: 'UNKNOWN' }));
    const first = renderWithIntl(
      <NewsletterAction kind="unsubscribe" action={unknown} {...props} />,
      { locale: 'en' },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute('data-outcome', 'UNKNOWN');
    first.unmount();
    const expired = vi.fn<NewsletterActionFn>(async () => done({ kind: 'expired' }));
    renderWithIntl(<NewsletterAction kind="unsubscribe" action={expired} {...props} />, {
      locale: 'en',
    });
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute('data-outcome', 'invalid');
  });
});
```

`src/app/api/newsletter/unsubscribe/route.test.ts` (new):

```ts
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewsletterForwardResult } from '@/lib/newsletter/types';
import { POST } from './route';

const { forward } = vi.hoisted(() => ({
  forward: vi.fn<(kind: string, token: unknown) => Promise<NewsletterForwardResult>>(),
}));
vi.mock('@/lib/newsletter/forward', () => ({ forwardNewsletterToken: forward }));

const TOKEN = 'cmfz1abc0000123456.QmFzZTY0dXJsX3NpZ25hdHVyZQ';
const url = (token = TOKEN) =>
  `https://www.jobsadmire.com/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
const oneClick = (token?: string) =>
  new Request(url(token), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'List-Unsubscribe=One-Click',
  });

beforeEach(() => forward.mockReset());

describe('POST /api/newsletter/unsubscribe (RFC 8058, I12)', () => {
  it('forwards a one-click POST and answers the outcome, never cached', async () => {
    forward.mockResolvedValue({ kind: 'ok', outcome: 'UNSUBSCRIBED' });
    const res = await POST(oneClick());
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('private, no-store');
    expect(await res.json()).toEqual({ outcome: 'UNSUBSCRIBED' });
    expect(forward).toHaveBeenCalledWith('unsubscribe', TOKEN);
  });

  it('accepts the multipart/form-data encoding RFC 8058 prefers', async () => {
    forward.mockResolvedValue({ kind: 'ok', outcome: 'ALREADY_UNSUBSCRIBED' });
    const body = new FormData();
    body.set('List-Unsubscribe', 'One-Click');
    const res = await POST(new Request(url(), { method: 'POST', body }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ outcome: 'ALREADY_UNSUBSCRIBED' });
  });

  it('refuses an implausible token and a body that is not the one-click pair, before any forward', async () => {
    expect((await POST(oneClick('short'))).status).toBe(400);
    const notOneClick = [
      new Request(url(), { method: 'POST', body: 'foo=bar', headers: { 'content-type': 'application/x-www-form-urlencoded' } }),
      new Request(url(), { method: 'POST', body: '{"List-Unsubscribe":"One-Click"}', headers: { 'content-type': 'application/json' } }),
      new Request(url(), { method: 'POST' }),
    ];
    for (const request of notOneClick) {
      const res = await POST(request);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: 'not-one-click' });
    }
    expect(forward).not.toHaveBeenCalled();
  });

  it('maps the forward results to the one-click answers', async () => {
    const cases: [NewsletterForwardResult, number, string][] = [
      [{ kind: 'invalid' }, 400, 'invalid'],
      [{ kind: 'expired' }, 400, 'invalid'],
      [{ kind: 'unconfigured' }, 503, 'unconfigured'],
      [{ kind: 'off' }, 503, 'off'],
      [{ kind: 'unauthorized' }, 503, 'unauthorized'],
      [{ kind: 'unavailable', cause: 'timeout' }, 502, 'unavailable'],
    ];
    for (const [result, status, error] of cases) {
      forward.mockResolvedValueOnce(result);
      const res = await POST(oneClick());
      expect(res.status, error).toBe(status);
      expect(res.headers.get('cache-control')).toBe('private, no-store');
      expect(await res.json()).toEqual({ error });
    }
  });
});
```

`src/proxy.test.ts` — append after the existing `describe` block (the file already imports `proxy`, `DOCUMENT_SECURITY_HEADERS`, `NextRequest` and defines `req`):

```ts
const post = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(new URL(path, 'https://www.jobsadmire.com'), { method: 'POST', headers });
const rewriteOf = (res: Response) => res.headers.get('x-middleware-rewrite') ?? '';

describe('proxy — RFC 8058 one-click rewrite (T13, I12)', () => {
  it('rewrites a plain POST to either unsubscribe page onto the route handler, query kept, headers set', () => {
    for (const path of ['/abonelikten-cik', '/en/newsletter/unsubscribe']) {
      const res = proxy(post(`${path}?token=abc.def`));
      expect(rewriteOf(res)).toContain('/api/newsletter/unsubscribe?token=abc.def');
      for (const [key, value] of Object.entries(DOCUMENT_SECURITY_HEADERS)) {
        expect(res.headers.get(key)).toBe(value);
      }
    }
  });

  it('leaves a server-action POST, a GET and the confirm page to next-intl', () => {
    expect(rewriteOf(proxy(post('/abonelikten-cik?token=abc', { 'next-action': '7f3a' })))).not.toContain('/api/');
    expect(rewriteOf(proxy(req('/abonelikten-cik?token=abc')))).not.toContain('/api/');
    expect(rewriteOf(proxy(post('/abone-onay?token=abc')))).not.toContain('/api/');
  });
});
```

`e2e/pages/newsletter.spec.ts` (new):

```ts
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
      await expect(page.getByTestId('newsletter-fallback')).toHaveAttribute('data-outcome', 'noToken');
    });
  }
}

test('the language switch keeps the page and drops the token (W76)', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the header switcher sits in the hamburger below 901 px');
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
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/messages/task13-keys.test.ts NewsletterAction src/app/api/newsletter src/proxy.test.ts
```
Expected: FAIL — `sys.newsletter.*`/`sys.seo.newsletter*` are missing, `NewsletterAction` and `./route` do not exist, and the proxy does not rewrite yet (`x-middleware-rewrite` names `/tr/newsletter/unsubscribe`). The e2e spec runs in Cycle 7.

- [ ] **Step 3: Implement**

`src/messages/en.json` — merge into `sys.seo`:

```json
{
  "newsletterConfirm": {
    "title": "Confirm your subscription | JobsAdmire",
    "description": "Confirm your subscription to the JobsAdmire newsletter."
  },
  "newsletterUnsubscribe": {
    "title": "Unsubscribe | JobsAdmire",
    "description": "Unsubscribe from the JobsAdmire newsletter."
  }
}
```

and add this member to `sys` (after `legal`):

```json
{
  "newsletter": {
    "backHome": "Back to home",
    "noToken": {
      "title": "This link is incomplete",
      "body": "This page works only with the link from the e-mail, and that link is missing its code. Open the link in the e-mail again, or contact JobsAdmire below."
    },
    "unavailable": {
      "title": "The request could not be completed right now",
      "body": "The subscription service did not answer. Please try again in a few minutes, or contact JobsAdmire below and the team handles it by hand."
    },
    "fallback": {
      "lead": "Contact JobsAdmire",
      "email": "E-mail JobsAdmire",
      "whatsapp": "Message on WhatsApp",
      "subject": "Newsletter subscription"
    },
    "confirm": {
      "title": "Confirm your newsletter subscription",
      "body": "Press the button below to confirm your subscription to the JobsAdmire newsletter. Until you confirm, JobsAdmire sends nothing to this address.",
      "button": "Confirm subscription",
      "pending": "Confirming…",
      "invalid": {
        "title": "This confirmation link is not valid",
        "body": "The link was not recognised. Please subscribe again to receive a new confirmation e-mail."
      },
      "expired": {
        "title": "This confirmation link has expired",
        "body": "Confirmation links are valid for a limited time. Please subscribe again to receive a new one."
      },
      "outcome": {
        "CONFIRMED": {
          "title": "Your subscription is confirmed",
          "body": "Thank you. Hiring updates from JobsAdmire will now reach your inbox, and every issue carries an unsubscribe link."
        },
        "ALREADY_CONFIRMED": {
          "title": "This subscription was already confirmed",
          "body": "This address was confirmed earlier — there is nothing more to do."
        }
      }
    },
    "unsubscribe": {
      "title": "Unsubscribe from the newsletter",
      "body": "Press the button below and JobsAdmire stops sending the newsletter to this address.",
      "button": "Unsubscribe",
      "pending": "Unsubscribing…",
      "invalid": {
        "title": "This unsubscribe link is not valid",
        "body": "The link was not recognised. E-mail JobsAdmire and the team removes the address from the list by hand."
      },
      "outcome": {
        "UNSUBSCRIBED": {
          "title": "You are unsubscribed",
          "body": "JobsAdmire will not send the newsletter to this address again. You can subscribe again at any time."
        },
        "ALREADY_UNSUBSCRIBED": {
          "title": "You were already unsubscribed",
          "body": "This address was removed from the list earlier — there is nothing more to do."
        },
        "UNKNOWN": {
          "title": "No subscription found for this link",
          "body": "The newsletter list has no subscription for this link, so nothing will be sent. If e-mails keep arriving, write to JobsAdmire and the team removes the address by hand."
        }
      }
    }
  }
}
```

`src/messages/tr.json` — merge into `sys.seo`:

```json
{
  "newsletterConfirm": {
    "title": "Abonelik onayı | JobsAdmire",
    "description": "JobsAdmire bülten aboneliğinizi onaylayın."
  },
  "newsletterUnsubscribe": {
    "title": "Abonelikten çıkış | JobsAdmire",
    "description": "JobsAdmire bülten aboneliğinizi sonlandırın."
  }
}
```

and add this member to `sys` (after `legal`):

```json
{
  "newsletter": {
    "backHome": "Ana sayfaya dön",
    "noToken": {
      "title": "Bağlantı eksik",
      "body": "Bu sayfa yalnızca e-postadaki bağlantıyla çalışır ve bağlantının kodu eksik görünüyor. E-postadaki bağlantıyı yeniden açın ya da aşağıdan JobsAdmire'a ulaşın."
    },
    "unavailable": {
      "title": "İsteğiniz şu anda tamamlanamadı",
      "body": "Abonelik hizmeti yanıt vermedi. Lütfen birkaç dakika sonra yeniden deneyin ya da aşağıdan JobsAdmire'a ulaşın; ekip talebinizi elle işler."
    },
    "fallback": {
      "lead": "JobsAdmire'a ulaşın",
      "email": "JobsAdmire'a e-posta gönderin",
      "whatsapp": "WhatsApp'tan yazın",
      "subject": "Bülten aboneliği"
    },
    "confirm": {
      "title": "Bülten aboneliğinizi onaylayın",
      "body": "JobsAdmire bülten aboneliğinizi onaylamak için aşağıdaki düğmeye basın. Onay verilene kadar JobsAdmire bu adrese hiçbir e-posta göndermez.",
      "button": "Aboneliği onayla",
      "pending": "Onaylanıyor…",
      "invalid": {
        "title": "Bu onay bağlantısı geçerli değil",
        "body": "Bağlantı tanınmadı. Yeni bir onay e-postası almak için lütfen bültene yeniden abone olun."
      },
      "expired": {
        "title": "Bu onay bağlantısının süresi dolmuş",
        "body": "Onay bağlantıları sınırlı bir süre için geçerlidir. Yeni bir bağlantı almak için lütfen bültene yeniden abone olun."
      },
      "outcome": {
        "CONFIRMED": {
          "title": "Aboneliğiniz onaylandı",
          "body": "Teşekkürler. JobsAdmire'ın işe alım güncellemeleri artık e-posta kutunuza gelecek; her e-postada abonelikten çıkma bağlantısı bulunur."
        },
        "ALREADY_CONFIRMED": {
          "title": "Bu abonelik zaten onaylanmış",
          "body": "Bu adres daha önce onaylandı; yapmanız gereken başka bir şey yok."
        }
      }
    },
    "unsubscribe": {
      "title": "Bülten aboneliğinden çıkın",
      "body": "Aşağıdaki düğmeye bastığınızda JobsAdmire bu adrese bülten göndermeyi durdurur.",
      "button": "Abonelikten çık",
      "pending": "İşleniyor…",
      "invalid": {
        "title": "Bu abonelikten çıkma bağlantısı geçerli değil",
        "body": "Bağlantı tanınmadı. JobsAdmire'a e-posta gönderin; ekip adresinizi listeden elle çıkarır."
      },
      "outcome": {
        "UNSUBSCRIBED": {
          "title": "Abonelikten çıktınız",
          "body": "JobsAdmire bu adrese artık bülten göndermez. Dilediğiniz zaman yeniden abone olabilirsiniz."
        },
        "ALREADY_UNSUBSCRIBED": {
          "title": "Zaten abonelikten çıkmıştınız",
          "body": "Bu adres listeden daha önce çıkarıldı; yapmanız gereken başka bir şey yok."
        },
        "UNKNOWN": {
          "title": "Bu bağlantıya ait abonelik bulunamadı",
          "body": "Bülten listesinde bu bağlantıya ait bir abonelik yok; bu nedenle hiçbir e-posta gönderilmeyecek. E-postalar gelmeye devam ederse JobsAdmire'a yazın, ekip adresi listeden elle çıkarır."
        }
      }
    }
  }
}
```

`src/app/[locale]/(minimal)/newsletter/_components/OutcomePanel.tsx` (new — no directive, no hooks):

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives/Button';
import type { NewsletterState } from '@/lib/newsletter/copy';

export type StateCopy = { title: string; body: string };
export type FallbackCopy = { lead: string; email: string; whatsapp: string };
/** Both hrefs are static — the settings' address and number with a sys subject and prefill;
 *  never the token, never anything a visitor typed (W76/W95). */
export type FallbackLinks = { emailHref: string; whatsappHref: string };

const PANEL = {
  fallback: 'rounded-base border border-warning-border bg-warning-surface p-5 text-ink',
  outcome: 'rounded-base border border-success-border bg-success-surface p-5 text-ink',
} as const;

/**
 * One answer of the newsletter door (I12) in the page's own words. `newsletter-fallback` whenever
 * the manual door joins it (400/410/`UNKNOWN`/unreachable/unconfigured, and the token-less
 * link), else `newsletter-outcome`; `data-outcome` names the state so tests never read copy. No
 * hooks and no directive: the server page renders it for the token-less link, the client island
 * for an answer — its `ContactLink`s are the client pieces (`email_click`/`whatsapp_click`,
 * `placement: 'page_cta'`).
 */
export function OutcomePanel({
  state,
  fallback,
  copy,
  fallbackCopy,
  links,
}: {
  state: NewsletterState;
  fallback: boolean;
  copy: StateCopy;
  fallbackCopy: FallbackCopy;
  links: FallbackLinks;
}) {
  return (
    <div
      role="status"
      data-testid={fallback ? 'newsletter-fallback' : 'newsletter-outcome'}
      data-outcome={state}
      className={fallback ? PANEL.fallback : PANEL.outcome}
    >
      <h2 className="text-card-title">{copy.title}</h2>
      <p className="mt-2 text-body text-text-secondary">{copy.body}</p>
      {fallback ? (
        <div className="mt-4">
          <p className="text-body-sm font-extrabold">{fallbackCopy.lead}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ContactLink
              href={links.emailHref}
              placement="page_cta"
              className={buttonClassName('secondary')}
            >
              {fallbackCopy.email}
            </ContactLink>
            <ContactLink
              href={links.whatsappHref}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('success')}
            >
              {fallbackCopy.whatsapp}
            </ContactLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}
```

`src/app/[locale]/(minimal)/newsletter/_components/NewsletterAction.tsx` (new — the page's one island):

```tsx
'use client';
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
// By module path (W147/W156).
import { Button } from '@/design/primitives/Button';
import { resultState, type NewsletterState } from '@/lib/newsletter/copy';
import {
  IDLE_NEWSLETTER_STATE,
  type NewsletterActionState,
  type NewsletterForwardKind,
} from '@/lib/newsletter/types';
import { OutcomePanel, type FallbackCopy, type FallbackLinks, type StateCopy } from './OutcomePanel';

/** The page's `'use server'` action — the visitor's click is the only way a token leaves the site. */
export type NewsletterActionFn = (
  prev: NewsletterActionState,
  token: string,
) => Promise<NewsletterActionState>;

// R18: hydration is a browser fact — false on the server and in the hydrating render, true after.
const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/** A server action that REJECTS in the browser (the browser→Vercel call failed, the function
 *  timed out) becomes the `unavailable` answer with the manual fallback — never the error
 *  boundary (the forms kernel's `guardAction` rule, D11). */
function guard(action: NewsletterActionFn): NewsletterActionFn {
  return async function guarded(prev, token) {
    try {
      return await action(prev, token);
    } catch (err) {
      console.error('[newsletter] the action rejected', err);
      return { status: 'done', result: { kind: 'unavailable', cause: 'network' } };
    }
  };
}

/**
 * Click-to-forward (W5, I12): a button whose click dispatches the server action — deliberately
 * NOT a `<form>`: a native pre-hydration submit would POST the page URL without `Next-Action`,
 * which `src/proxy.ts` treats as an RFC 8058 one-click request on the unsubscribe page. Before
 * hydration the button does nothing (`data-ready` tells the e2e when it acts). Every string
 * arrives resolved from the server (W148: `sys.newsletter` is not in `CLIENT_SYS`). After the
 * answer, focus moves to it (D20 — the button it replaces is gone).
 */
export function NewsletterAction({
  kind,
  token,
  action,
  labels,
  outcomes,
  fallbackCopy,
  links,
}: {
  kind: NewsletterForwardKind;
  token: string;
  action: NewsletterActionFn;
  labels: { button: string; pending: string };
  outcomes: Partial<Record<NewsletterState, StateCopy>>;
  fallbackCopy: FallbackCopy;
  links: FallbackLinks;
}) {
  const guarded = useMemo(() => guard(action), [action]);
  const [state, dispatch, pending] = useActionState(guarded, IDLE_NEWSLETTER_STATE);
  const ready = useSyncExternalStore(subscribe, onClient, onServer);
  const answerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === 'done') answerRef.current?.focus();
  }, [state.status]);

  if (state.status === 'done') {
    const shown = resultState(kind, state.result);
    const copy = outcomes[shown.state];
    return (
      <div
        ref={answerRef}
        tabIndex={-1}
        data-testid="newsletter-answer"
        className="mt-6 focus:outline-none"
      >
        {copy ? (
          <OutcomePanel
            state={shown.state}
            fallback={shown.fallback}
            copy={copy}
            fallbackCopy={fallbackCopy}
            links={links}
          />
        ) : null}
      </div>
    );
  }
  return (
    <div data-testid="newsletter-action" data-ready={ready ? 'true' : undefined} className="mt-6">
      {/* D20: never `disabled` while pending — `aria-disabled` keeps focus on the button. */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        aria-disabled={pending || undefined}
        className="aria-disabled:cursor-progress aria-disabled:opacity-60"
        onClick={() => {
          if (!pending) startTransition(() => dispatch(token));
        }}
      >
        {pending ? labels.pending : labels.button}
      </Button>
    </div>
  );
}
```

`src/app/[locale]/(minimal)/newsletter/_components/NewsletterPage.tsx` (new — server):

```tsx
import { getTranslations } from 'next-intl/server';
// By module path (W156).
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { mailLink, waLink } from '@/lib/contact';
import { isPlausibleToken } from '@/lib/newsletter/classify';
import { NEWSLETTER_STATES, stateCopyKey, type NewsletterState } from '@/lib/newsletter/copy';
import type { NewsletterForwardKind } from '@/lib/newsletter/types';
import { NewsletterAction, type NewsletterActionFn } from './NewsletterAction';
import { OutcomePanel, type StateCopy } from './OutcomePanel';

/**
 * One layout for both newsletter one-shots (W5, I12). The server resolves every string the page
 * can show and hands them to the island as props — `sys.newsletter` stays out of `CLIENT_SYS` and
 * out of every other page's RSC payload (W148). Nothing is forwarded here: the token leaves the
 * site only when the visitor presses the button.
 */
export async function NewsletterPage({
  kind,
  token,
  action,
  email,
  whatsappNumber,
}: {
  kind: NewsletterForwardKind;
  token: string | string[] | undefined;
  action: NewsletterActionFn;
  email: string;
  whatsappNumber: string;
}) {
  const sys = await getTranslations('sys');
  // `?token=a&token=b` is a malformed link — the first value decides (the thank-you page's rule).
  const first = Array.isArray(token) ? token[0] : token;
  const usable = isPlausibleToken(first) ? first : null;
  const outcomes: Partial<Record<NewsletterState, StateCopy>> = {};
  for (const state of NEWSLETTER_STATES[kind]) {
    const key = stateCopyKey(kind, state);
    outcomes[state] = { title: sys(`${key}.title`), body: sys(`${key}.body`) };
  }
  const noToken: StateCopy = {
    title: sys('newsletter.noToken.title'),
    body: sys('newsletter.noToken.body'),
  };
  const fallbackCopy = {
    lead: sys('newsletter.fallback.lead'),
    email: sys('newsletter.fallback.email'),
    whatsapp: sys('newsletter.fallback.whatsapp'),
  };
  // W76/W95: static hrefs only — the token (a per-subscriber secret) never reaches an href, a
  // prefill, a subject line or a log.
  const links = {
    emailHref: mailLink(email, sys('newsletter.fallback.subject')),
    whatsappHref: waLink(whatsappNumber, sys('whatsapp.prefill')),
  };
  return (
    <Section tone="light">
      {/* `.container-site` is unlayered CSS; the measure sits on an inner wrapper. */}
      <div className="container-site">
        <div className="max-w-[720px]">
          <h1 data-testid="page-h1" data-lcp-slot="h1" className="text-h2">
            {sys(`newsletter.${kind}.title`)}
          </h1>
          <p className="mt-3 text-body-lg text-text-secondary">{sys(`newsletter.${kind}.body`)}</p>
          {usable ? (
            <NewsletterAction
              kind={kind}
              token={usable}
              action={action}
              labels={{
                button: sys(`newsletter.${kind}.button`),
                pending: sys(`newsletter.${kind}.pending`),
              }}
              outcomes={outcomes}
              fallbackCopy={fallbackCopy}
              links={links}
            />
          ) : (
            <div className="mt-6">
              <OutcomePanel
                state="noToken"
                fallback
                copy={noToken}
                fallbackCopy={fallbackCopy}
                links={links}
              />
            </div>
          )}
          <div className="mt-8">
            <Button variant="ghost" href="/">
              {sys('newsletter.backHome')}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(minimal)/newsletter/confirm/actions.ts` (new):

```ts
'use server';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';
import type { NewsletterActionState } from '@/lib/newsletter/types';

/** The visitor's click on /abone-onay — the only place a confirm token leaves the site (W5, I12).
 *  `forwardNewsletterToken` re-checks the token's shape, so anything posted here that is not a
 *  plausible token answers `invalid` without a call to Operations. */
export async function confirmNewsletter(
  _prev: NewsletterActionState,
  token: string,
): Promise<NewsletterActionState> {
  return { status: 'done', result: await forwardNewsletterToken('confirm', token) };
}
```

`src/app/[locale]/(minimal)/newsletter/unsubscribe/actions.ts` (new):

```ts
'use server';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';
import type { NewsletterActionState } from '@/lib/newsletter/types';

/** The visitor's click on /abonelikten-cik (the browser path; a mail client's RFC 8058 POST
 *  reaches `/api/newsletter/unsubscribe` through the proxy instead). */
export async function unsubscribeNewsletter(
  _prev: NewsletterActionState,
  token: string,
): Promise<NewsletterActionState> {
  return { status: 'done', result: await forwardNewsletterToken('unsubscribe', token) };
}
```

`src/app/[locale]/(minimal)/newsletter/confirm/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { NewsletterPage } from '../_components/NewsletterPage';
import { confirmNewsletter } from './actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
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

export default async function NewsletterConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { settings } = await getBundle(locale);
  // Nothing is forwarded during the render — the token travels only on the visitor's click.
  return (
    <NewsletterPage
      kind="confirm"
      token={token}
      action={confirmNewsletter}
      email={settings.email}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
```

`src/app/[locale]/(minimal)/newsletter/unsubscribe/page.tsx` (new):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { NewsletterPage } from '../_components/NewsletterPage';
import { unsubscribeNewsletter } from './actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  return {
    ...buildMetadata({
      locale,
      href: '/newsletter/unsubscribe',
      bundle,
      pageKey: 'newsletterUnsubscribe',
      fallbackTitle: sys('seo.newsletterUnsubscribe.title'),
      fallbackDescription: sys('seo.newsletterUnsubscribe.description'),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterUnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { settings } = await getBundle(locale);
  return (
    <NewsletterPage
      kind="unsubscribe"
      token={token}
      action={unsubscribeNewsletter}
      email={settings.email}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
```

`src/app/api/newsletter/unsubscribe/route.ts` (new — plain `Request`/`Response`, like the form-beacon route; outside the proxy matcher, so never locale-rewritten):

```ts
import { isOneClickValue, isPlausibleToken } from '@/lib/newsletter/classify';
import { forwardNewsletterToken } from '@/lib/newsletter/forward';

/**
 * RFC 8058 one-click unsubscribe (I12). Reached directly, or through `src/proxy.ts`'s rewrite of
 * a POST without `Next-Action` to the unsubscribe PAGE URL Operations prints in
 * `List-Unsubscribe` (`/abonelikten-cik`, `/en/newsletter/unsubscribe`). The body must be the
 * `List-Unsubscribe=One-Click` pair (urlencoded or multipart) and is never forwarded; the token
 * travels in the query as a body-less POST (`forwardNewsletterToken`). Mail clients read only the
 * status; the JSON names the reason for humans and tests.
 */
const HEADERS = { 'Cache-Control': 'private, no-store', 'Content-Type': 'application/json' };
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: HEADERS });

async function isOneClick(request: Request): Promise<boolean> {
  try {
    return isOneClickValue((await request.formData()).get('List-Unsubscribe'));
  } catch {
    return false; // not a form body (JSON, text, empty) — not RFC 8058
  }
}

export async function POST(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token');
  if (!isPlausibleToken(token)) return json({ error: 'invalid' }, 400);
  if (!(await isOneClick(request))) return json({ error: 'not-one-click' }, 400);
  const result = await forwardNewsletterToken('unsubscribe', token);
  switch (result.kind) {
    case 'ok':
      return json({ outcome: result.outcome }, 200);
    case 'invalid':
    case 'expired':
      return json({ error: 'invalid' }, 400);
    case 'unconfigured':
    case 'off':
    case 'unauthorized':
      return json({ error: result.kind }, 503);
    default: // unavailable — no answer, a timeout or a 5xx
      return json({ error: 'unavailable' }, 502);
  }
}
```

`src/proxy.ts` — add the import directly after `import { routing } from './i18n/routing';`:

```ts
import { isOneClickUnsubscribe } from './lib/newsletter/one-click';
```

and make the one-click rewrite the first check inside `proxy()` — the function becomes:

```ts
export default function proxy(request: Parameters<typeof intl>[0]) {
  const { pathname } = request.nextUrl;
  // RFC 8058 (T13, I12): a mail client's one-click POST lands on the unsubscribe PAGE URL
  // Operations prints in List-Unsubscribe, and a page cannot answer a POST — rewrite it onto the
  // route handler, query (the token) kept. A server-action call to the same page carries
  // `Next-Action` and falls through to next-intl like every other request. W160: the rewrite
  // gets the document headers like every response this proxy returns.
  if (isOneClickUnsubscribe(request.method, pathname, request.headers.has('next-action'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/newsletter/unsubscribe';
    return withDocumentHeaders(NextResponse.rewrite(url));
  }
  if (GONE.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))) {
    return withDocumentHeaders(new NextResponse(null, { status: 410 }));
  }
  // `intl` is typed as `(request: NextRequest) => NextResponse<unknown>` (next-intl's own
  // `middleware.d.ts`) — always a `NextResponse`, never a bare `Response` — so no runtime type
  // guard is needed before handing it to `withDocumentHeaders`.
  return withDocumentHeaders(intl(request));
}
```

(`DOCUMENT_SECURITY_HEADERS`, `withDocumentHeaders`, `config.matcher` stay as they are.)

`src/lib/seo/routes.ts` — in `UNBUILT_PATHNAMES`, delete `'/newsletter/confirm',` and `'/newsletter/unsubscribe',` (12 keys remain).

`e2e/routes.ts` — append after the legal rows:

```ts
  // T13 — the newsletter one-shots: noindex, with a DUMMY token so the sweeps see the
  // click-to-forward state (never a real subscriber's token — the Ops routes ignore the class).
  { path: '/abone-onay?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/en/newsletter/confirm?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/abonelikten-cik?token=e2e-dummy-token-0000000000', indexable: false },
  { path: '/en/newsletter/unsubscribe?token=e2e-dummy-token-0000000000', indexable: false },
```

`e2e/seo.spec.ts` — widen the list Cycle 1 added to:

```ts
  // T13 (W20/W37, W104): a built noindex route is disallowed in both locales, by itself.
  for (const path of [
    '/portal-girisi',
    '/en/portal-login',
    '/abone-onay',
    '/en/newsletter/confirm',
    '/abonelikten-cik',
    '/en/newsletter/unsubscribe',
  ])
    expect(body).toContain(`Disallow: ${path}`);
```

Docs (same commit):
- `docs/SEO.md` — append two rows after the last row of the `## Pages` table:

```markdown
| Newsletter confirm | `/abone-onay` · `/en/newsletter/confirm` | `sys.seo.newsletterConfirm.*` | self, per locale — never the `?token=` | site-wide only | `h1` | **noindex** — record + forced; robots `Disallow`; not in the sitemap; the token is forwarded on the visitor's click only (I12) |
| Newsletter unsubscribe | `/abonelikten-cik` · `/en/newsletter/unsubscribe` | `sys.seo.newsletterUnsubscribe.*` | self, per locale — never the `?token=` | site-wide only | `h1` | **noindex** — as confirm; the mail client's RFC 8058 POST is rewritten to `/api/newsletter/unsubscribe` |
```

  In `## Robots`, replace the sentence Cycle 1 wrote, "Today that is `/tesekkurler`, `/portal-girisi` and their `/en/…` forms (T13 built the portal door); `/blog`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms appear by themselves when their page task deletes the key (W20)", with "Today that is `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik` and their `/en/…` forms (T13 built the portal door and the newsletter one-shots); `/blog` appears by itself when T12 deletes its key (W20)".
- `docs/ANALYTICS.md` — append to `### Page instrumentation (WP2b)`: "- **Newsletter confirm/unsubscribe (T13):** `email_click` / `whatsapp_click` (`placement: 'page_cta'`) on the manual-fallback links only; **no `generate_lead`, no `conversion`** — a token click is not a lead and never navigates to `/tesekkurler` (D13). The page URL carries the per-subscriber `?token=`; every event's `page` is `usePathname()` (no query), so the token never enters the dataLayer." — and in `## GTM container inventory (export in WP0)`, directly after the paragraph that begins "**Owner inventory item (W76):**", add: "**Owner inventory item (T13):** the newsletter pages' URLs carry a per-subscriber `?token=` (I12). GA4's automatic `page_view` sends the full URL as `page_location`, so before the container goes live on Production (W146) the GA4 web stream's **Redact data → URL query parameters** must list `token` (or the page-view tag must drop the query on `/abone-onay`, `/abonelikten-cik`, `/en/newsletter/*`)."
- `docs/CONTENT-MODEL.md` — append to the per-page list at the end of `### Adding copy (W9, W23, W54)`: "- **Newsletter (T13):** `sys.newsletter.{backHome, noToken.*, unavailable.*, fallback.{lead,email,whatsapp,subject}}`, `sys.newsletter.confirm.{title,body,button,pending,invalid.*,expired.*,outcome.{CONFIRMED,ALREADY_CONFIRMED}.*}`, `sys.newsletter.unsubscribe.{title,body,button,pending,invalid.*,outcome.{UNSUBSCRIBED,ALREADY_UNSUBSCRIBED,UNKNOWN}.*}` (each `*` = `{title,body}`; the state → key map is `stateCopyKey`, `src/lib/newsletter/copy.ts`) + `sys.seo.{newsletterConfirm,newsletterUnsubscribe}.{title,description}`; read by the server page and handed to the `NewsletterAction` island as resolved props, so `newsletter` is not in `CLIENT_SYS` (W148)."
- `docs/ARCHITECTURE.md`:
  - § Repository layout — in the code block's `lib/` entry, on its last continuation line, after "og, sitemap-sources), sanity.ts" append "; legal/ (body.ts, documents.ts), newsletter/ (types, classify, copy, one-click, forward — T13)"; on the `proxy.ts` line replace "# Locale routing / 410 / redirect middleware (Next 16's proxy.ts convention)" with "# Locale routing / 410 / RFC 8058 one-click rewrite / document headers (Next 16's proxy.ts convention)".
  - § Routing — in the list under "2. **`proxy.ts`**", insert as the first sub-bullet (before "- a `410` check against `redirects/gone.json`"): "- **the RFC 8058 one-click rewrite (T13, I12):** a `POST` to `/abonelikten-cik` or `/en/newsletter/unsubscribe` that carries no `Next-Action` header is rewritten to `/api/newsletter/unsubscribe` (query kept) — Operations prints the unsubscribe *page* URL in `List-Unsubscribe`, and a page cannot answer a POST. A server-action call carries `Next-Action` and passes through; the page's own button dispatches its action from a click handler (never a native form submit), so no browser POST without that header reaches the path (`src/lib/newsletter/one-click.ts`; the rewrite gets the W160 document headers like every proxy response);" — and after the sentence "A tagged revalidate route (`/api/revalidate`) sits **outside** the proxy matcher — it must never be redirected or locale-rewritten." add "So does `/api/newsletter/unsubscribe` (T13), reached directly or through the one-click rewrite above."
  - § Forms flow — after the bullet that begins "- Handler types on the Ops side:", add the paragraph: "**Newsletter tokens — the one named exception to "every page form goes through the kernel" (T13, I12, W5; reconcile ruling "the newsletter forwarder outside FormShell").** `/abone-onay` and `/abonelikten-cik` are not catalog forms: no `formKey`, envelope, honeypot, captcha, consent or thank-you. Their `NewsletterAction` island (`src/app/[locale]/(minimal)/newsletter/_components/`) dispatches a `'use server'` action from the button's click handler — never a native form, never during a render (a mail-link scanner would otherwise spend the one-shot confirm token) — and the action calls `forwardNewsletterToken` (`src/lib/newsletter/forward.ts`, `server-only`): `GET …/newsletter/confirm?token=` or a body-less `POST …/newsletter/unsubscribe?token=` with the write token from `doorConfig()`, under the kernel's rule (W74/W117: one shared 9 s deadline, one retry only after a connection-level failure). The door's enum renders inline; 400/410/`UNKNOWN`/unreachable/unconfigured add the manual `info@jobsadmire.com` + WhatsApp fallback (static hrefs, W76); a rejected action becomes the same `unavailable` fallback (the `guardAction` rule). No `generate_lead`, no `/tesekkurler`. A mail client's RFC 8058 POST reaches `src/app/api/newsletter/unsubscribe/route.ts` through the proxy rewrite (§ Routing) and is forwarded the same way — 200 `{ outcome }`, 400 (implausible token, not a one-click body, door 400/410), 503 (`unconfigured`/`off`/`unauthorized`), 502 (unreachable), always `Cache-Control: private, no-store`. The Ops routes run for real under every token class — never smoke-test them with a real subscriber's token."
- `docs/INTEGRATIONS.md` — `## I12 — Newsletter confirm/unsubscribe`: append after the sentence ending "never point a test-class smoke at a real subscriber token." the paragraph: "**Website side as built (T13):** `/abone-onay` · `/en/newsletter/confirm` and `/abonelikten-cik` · `/en/newsletter/unsubscribe` (the `pathnames` entries Ops `NEWSLETTER_PATHS` mirrors verbatim — never change one side alone; `src/lib/newsletter/one-click.test.ts` pins this side) render a button; the visitor's click runs a server action that forwards the `?token=` with the write token (`forwardNewsletterToken`, W74/W117 retry rule) — nothing is forwarded on load, prefetch or render. The RFC 8058 `List-Unsubscribe=One-Click` POST to the unsubscribe page URL (urlencoded or multipart) is rewritten by `src/proxy.ts` to `POST /api/newsletter/unsubscribe` and forwarded as a body-less POST; it answers 200 `{ outcome }`, 400 (implausible token, not a one-click body, door 400/410), 503 (`unconfigured`/`off`/`unauthorized`), 502 (unreachable), always `Cache-Control: private, no-store`. 400/410/`UNKNOWN`/unreachable show the manual `info@jobsadmire.com` + WhatsApp fallback. The e2e suite uses a dummy token only (`e2e-dummy-token-0000000000`): door-less it ends in `unavailable`/503, on `staging` the door refuses it (`invalid`/400)."
- `docs/PRD.md` — §2 table: in the "Newsletter confirm" row replace the Forms cell "RFC 8058" with "none — the mail-link token is forwarded on the visitor's click only, never on load (T13, I12)"; in the "Newsletter unsubscribe" row replace "RFC 8058 one-click" with "RFC 8058 one-click (the mail client's POST, rewritten to `/api/newsletter/unsubscribe`); in a browser the token is forwarded on the visitor's click only (T13, I12)".
- `docs/PRIVACY.md` — `## Newsletter double opt-in`: replace "Unsubscribe (`/abonelikten-cik`) is one-click per RFC 8058 — no login, no "are you sure," a single unambiguous action." with "Unsubscribe is one-click per RFC 8058: the mail client's `List-Unsubscribe-Post` reaches the site as a POST and unsubscribes directly; a visitor who opens the link in a browser presses one button on `/abonelikten-cik` — no login, no second confirmation — because a page load never changes state (a mail scanner opening the link must not unsubscribe anyone, I12)."

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — the full `task13-keys.test.ts`, the island test, the route test, both proxy `describe`s (the W160 cases untouched), `unbuilt.test.ts` (12 keys), `robots.test.ts`, `sitemap.test.ts`, `client-messages.test.ts` (the island reads no `sys` — its strings are props; `CLIENT_SYS` unchanged), `client-imports.test.ts` (the island's graph: `Button`, `copy`, `types`, `OutcomePanel`, `ContactLink` — no barrel, no message JSON), `class-collisions.test.ts`, `voice.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add ':(literal)src/app/[locale]/(minimal)/newsletter' src/app/api/newsletter src/proxy.ts src/proxy.test.ts src/messages src/lib/seo/routes.ts e2e/routes.ts e2e/seo.spec.ts e2e/pages/newsletter.spec.ts docs/SEO.md docs/ANALYTICS.md docs/CONTENT-MODEL.md docs/ARCHITECTURE.md docs/INTEGRATIONS.md docs/PRD.md docs/PRIVACY.md
git commit -F - <<'MSG'
feat(newsletter): confirm/unsubscribe pages, click-to-forward island, RFC 8058 route + proxy rewrite (T13, W5, I12)

The ?token= leaves the site only on the visitor's click (a server action
dispatched from a button, never a native form, never on render); the mail
client's List-Unsubscribe=One-Click POST to the page URL is rewritten by the
proxy to POST /api/newsletter/unsubscribe and forwarded body-less (W160
headers kept). Outcomes inline; 400/410/UNKNOWN/unreachable add the static
info@ + WhatsApp fallback (W76). Kernel retry rule (W74/W117). Copy passed as
props — CLIENT_SYS unchanged (W148). noindex; two keys leave UNBUILT (W20);
gate rows +4 with a dummy token; I12, ARCHITECTURE, PRIVACY, PRD docs.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

#### Cycle 7 — The W126 proof session: one build, one start, one gate; js-size; the dead-target check; the ledger row

- [ ] **Step 1: Write the failing test** — none new. The proof is the three page specs written in Cycles 1, 4 and 6 (`e2e/pages/portal.spec.ts`, `legal.spec.ts`, `newsletter.spec.ts`) plus every existing gate spec that now reads the 14 new `GATE_ROUTE_TABLE` rows (axe + region sweep, width sweep at 10 widths, headers, the routing page-contract loop and the SEO canonical/hreflang loop on the 8 indexable legal routes, the sitemap 200-sweep, the production robots test) and Lighthouse on the 8 legal routes.

- [ ] **Step 2: Run to verify the pre-state** — a clean tree and no stray process (one heavy job at a time):

```bash
git status --short
ps aux | grep -E 'next (dev|start|build)|playwright|lhci|chrome-headless' | grep -v grep
```
Expected: no tracked change pending; no process listed.

- [ ] **Step 3: Implement — the proof run** (sequential; never two of these at once)

```bash
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
```
Expected: green, no "importing a module that depends on … into a React Server Component" error (W125/W126 — the reason this build exists). The route table lists `/[locale]/portal-login`, `/[locale]/privacy`, `/[locale]/terms`, `/[locale]/kvkk`, `/[locale]/cookie-policy` as static (●, both locales), `/[locale]/newsletter/confirm` and `/[locale]/newsletter/unsubscribe` as dynamic (ƒ — they read `searchParams`), `/api/newsletter/unsubscribe` (ƒ) and `ƒ Proxy (Middleware)`.

Start the production server as a background job and wait for it with `curl --retry` (never `sleep` — the agent shell blocks a foreground `sleep`):

```bash
(npm run start > .superpowers/t13-start.log 2>&1 &) && curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/portal-girisi && echo up
```

Then:

```bash
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
E2E_BASE_URL=http://localhost:3000 npm run js-size -- '--routes=/portal-girisi,/en/portal-login,/abone-onay?token=e2e-dummy-token-0000000000,/en/newsletter/confirm?token=e2e-dummy-token-0000000000,/abonelikten-cik?token=e2e-dummy-token-0000000000,/en/newsletter/unsubscribe?token=e2e-dummy-token-0000000000'
E2E_BASE_URL=http://localhost:3000 NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --config vitest.launch.config.mts scripts/launch/dead-targets.launch-check.ts --maxWorkers=1 > .superpowers/t13-dead-targets.txt 2>&1 || true
grep -E '^/(portal-girisi|gizlilik|kullanim-kosullari|kvkk|cerez-politikasi|en/(portal-login|privacy|terms|kvkk|cookie-policy)) ' .superpowers/t13-dead-targets.txt
```
No `pixel` run: none of these pages is a D27 harness page (Homepage, Hire Workers, Cost Calculator, Blog Article) — they get the Fable side-by-side review against the named deltas.

- [ ] **Step 4: Verify — the expected outcomes, then stop the server**

- `npm run gate`: every Playwright spec green in both projects (`mobile` Pixel 7, `desktop` 1440) — the three new page specs (door-less run: the newsletter click ends in `data-outcome="unavailable"`, the one-click POSTs answer 503 `{ "error": "unconfigured" }`), axe 0 violations on the 14 new routes (the `wcag22aa` target-size rule included — the contents links are 24 px targets) and 0 `region` nodes at 390/1000/1440, no horizontal overflow at 1440…390, the four security headers on every new route (W160), the sitemap listing the eight legal URLs (12 in all) and answering 200 each, robots.txt carrying the six new `Disallow` lines (production face, W135). Lighthouse on the eight legal routes, median of three under DevTools throttling (W145): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, LCP ≤ 2,500 ms, CLS ≤ 0.1, `resource-summary:script:size` ≤ 204,800 B.
- `npm run js-size` (W136): the eight legal routes at the minimal-chrome shell (≈ the `/`·`/en` figures T1 recorded; 6ef6989 had 176,132 B TR / 172,783 B EN) — each below the 194,560 B lazy-loading line. `--routes` (W94): the portal pair at or below the legal figures (the `(bare)` page loads no header/footer/mobile-nav client code), the four newsletter rows ≤ the legal figure + ~4 KB (the `NewsletterAction` island; `useActionState` is already in react-dom). A route above 194,560 B gets a `next/dynamic` pass before T2 starts (W13 amended).
- The dead-target grep prints **nothing**: none of the chrome's portal, privacy and terms links (nor the cookie/KVKK pages) is dead any more (W152/W158). The sweep itself stays red for the pages later tasks build (`/iletisim`, `/hakkimizda`, …) and the two CTA anchors T1/T2 own — expected until Gate A.
- Stop the server (the background job, or `pkill -f 'next start'`) and re-run the `ps aux | grep …` line from Step 2 — nothing listed. `.lighthouseci/`, `lighthouse-report/` and `.superpowers/` are local artefacts, never committed.
- A red result is fixed in a NEW commit (never an amend, W118), then one more build + start + gate on the fixed tree.

- [ ] **Step 5: Commit — the ledger row**

Append the T13 row (template below, filled from `js-size` and the `lhci assert` output) to the `## Ledger` table of `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, in T1's column order, then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -F - <<'MSG'
docs(wp2b): T13 ledger row — portal, legal and newsletter routes gated (W126, W136, W152)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
```

---

**Docs in this task:** `docs/SEO.md` — seven rows in the `## Pages` table (W98) (portal, privacy, terms, KVKK, cookie policy, newsletter confirm, newsletter unsubscribe, each naming its LCP element `h1`), the JSON-LD table's BreadcrumbList row ("every indexable non-homepage page"), `## Sitemap` (+8 legal URLs → 12), `## Robots` (the portal and newsletter `Disallow` lines exist now); `docs/ANALYTICS.md` — three `### Page instrumentation (WP2b)` bullets (portal `whatsapp_click` `page_cta`; legal none; newsletter fallback `email_click`/`whatsapp_click` only, no `generate_lead`/`conversion`) and the owner inventory item on redacting `token` from GA4's `page_location`; `docs/CONTENT-MODEL.md` — three per-page bullets (`sys.portal.*`, `sys.legal.*`, `sys.newsletter.*` + their `sys.seo.*`) and the client-subset sentence (T13's namespaces are server-only reads); `docs/ARCHITECTURE.md` — § Repository layout (`src/lib/legal/`, `src/lib/newsletter/`, the proxy row), § Routing (the RFC 8058 one-click rewrite bullet, `/api/newsletter/unsubscribe` outside the matcher), § Forms flow (the newsletter-token exception paragraph); `docs/INTEGRATIONS.md` — I12 "Website side as built (T13)"; `docs/PRD.md` — §2 rows 14 / newsletter confirm / newsletter unsubscribe, §11 "Not yet built" count (12 → 11, the portal entry), §8 "Shipped in WP2 T13"; `docs/PRIVACY.md` — the newsletter one-click sentence and the new "Seeded legal copy — counsel review (T13)" section; `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the ledger row.

**Sys keys added:** 138 leaves in each of `src/messages/tr.json` and `src/messages/en.json` (276 values), all server-only reads:
- `sys.seo.*` (14): `portal`, `privacy`, `terms`, `kvkk`, `cookiePolicy`, `newsletterConfirm`, `newsletterUnsubscribe` — each `.title`, `.description`.
- `sys.portal.*` (2): `intro`, `signIn`.
- `sys.legal.*` (89): `updatedLabel`, `contents`; `privacy.{title,intro,updatedAt}` + `privacy.sections.{dataController,scope,dataCategories,purposes,cookies,disclosures,transfers,retention,rights,security,verbis,children,thirdParty,changes,contact}.{title,body}` (30); `terms.{title,intro,updatedAt,englishOnlyNotice,finalNote}` + `terms.sections.{legalStatus,services,eligibility,accounts,candidateDuties,employerDuties,fees,ip,acceptableUse,dataProtection,thirdParty,availability,liability,indemnification,law,amendments}.{title,body}` (32 — English in both files, W107); `kvkk.{title,intro,updatedAt,pendingTitle,pendingBody,privacyLink}`; `cookiePolicy.{title,intro,updatedAt,pendingTitle,pendingBody}` + `cookiePolicy.sections.{essential,consent,manage}.{title,body}` (6).
- `sys.newsletter.*` (33): `backHome`; `noToken.{title,body}`; `unavailable.{title,body}`; `fallback.{lead,email,whatsapp,subject}`; `confirm.{title,body,button,pending}`, `confirm.invalid.{title,body}`, `confirm.expired.{title,body}`, `confirm.outcome.{CONFIRMED,ALREADY_CONFIRMED}.{title,body}`; `unsubscribe.{title,body,button,pending}`, `unsubscribe.invalid.{title,body}`, `unsubscribe.outcome.{UNSUBSCRIBED,ALREADY_UNSUBSCRIBED,UNKNOWN}.{title,body}`.

**Package ids used:** 34, all present in `src/content/local/catalogue.json` and both bundles — first `about.021`, last `home.016`: `about.021` (the four legal pages' Home crumb, W109/W176 — "Ana Sayfa" / "Home", the text every page's own crumb carries), `crmlogin.001`, `002`, `005`, `011`, `012`, `013`, `014`, `019`, `020` (legal), `021`, `022` (legal), `023` (legal), `030`, `043`, `044`, `045`, `046`, `047`, `048`, `049`, `050`, `051`, `052`, `054`, `055` (`makeTf` `{placed}`), `056`, `057` (`makeTf` `{replySlaHours}`), `058`, `059`, `060`, `061`, `062`, and `home.016` (the switcher label, R15). `hire.240` is read by `StoreBadges`, not by the page. Deliberately not rendered (D22, W8, D17): `crmlogin.003` (the multi-portal choice), `.004`, `.006`–`.010`, `.024`–`.029`, `.031`–`.042` (credential, reset, lockout, domain-detect and session UI), `.015` ("IT desk"), `.016` ("~10 min" — no signed SLA), `.017`/`.018` (badge micro-copy — `StoreBadges` owns its label), `.053` (the e-mail field label), `.063` ("iOS 15+" — no target), `.064`–`.081` (the Operations tile), `.082`–`.099` (the ChatAdmire/desk tile, incl. legal `.091`) — all stay imported. For the WP-C legal sheet: `crmlogin.020`, `.022`, `.023` (verbatim here); `crmlogin.054`/`057` speak as "we" (package copy waits for WP-C, W154). The newsletter pages read no package id, and the legal pages read exactly one (`about.021`, the Home crumb); the package has no id for their text — `strings/terms.json` is an 8-term glossary, not the Terms page.

**CLIENT_SYS additions:** none — every `sys.*` read in this task is a server read; the `NewsletterAction` island receives its strings as props (the `LogoMarquee` pattern), so `CLIENT_SYS` stays `consent, languageHint, errorTitle, errorRetry, form` and `client-messages.test.ts` needs no edit.

**Foundation gaps:** none — every API consumed exists as cited (read in the code at `7bacd7e`). Notes, not gaps: (1) the RFC 8058 rewrite is this task's edit to the foundation file `src/proxy.ts` (reconcile ruling on check.md: "accept in T13, documented in ARCHITECTURE"); (2) the `(bare)` group has no `error.tsx`/`not-found.tsx` of its own ("ships with its layout only") — a throw on the portal page reaches `app/global-error.tsx`; (3) redacting `token` from GA4's `page_location` is an owner GTM/GA4 setting, recorded in ANALYTICS; (4) `.container-site` is unlayered CSS, so a `max-w-*` utility on the same element never applies — this task puts its measures on inner wrappers; the thank-you page's `container-site max-w-[720px]` has the same latent issue (not changed here). The draft's four gaps are closed: the nav portal rows are internal since W88; the client provider no longer carries `sys.legal` (W148); the proxy rewrite and the forwarder outside `FormShell` are accepted rulings. T13 sends no catalog form fields (the Task 8 v1.1 fields are not involved) — the newsletter door routes take only `?token=`.

**Ledger line** (one row in T1's `## Ledger` table, its six columns `Task | Routes (tr · en) | JS | Lighthouse | Pixel (D27) / named deltas | Date`; numbers from `npm run js-size` and the `lhci assert` output):

```
| T13 Portal entry + legal + newsletter | /portal-girisi · /en/portal-login (noindex) · /gizlilik · /en/privacy · /kullanim-kosullari · /en/terms · /kvkk · /en/kvkk · /cerez-politikasi · /en/cookie-policy · /abone-onay · /en/newsletter/confirm · /abonelikten-cik · /en/newsletter/unsubscribe (noindex) | js-size (W136, local): legal <min>–<max> B (lowest headroom <n> B) · portal <tr>/<en> B (--routes, W94) · newsletter <min>–<max> B (--routes) — all ≤ 194,560 | Lighthouse, 8 legal routes, median of 3 (W145): perf <min>–<max> · a11y 1 · BP 1 · SEO 1 · LCP <min>–<max> ms (element: h1 or the intro paragraph, text) · CLS <max> | pixel: n/a — not a D27 harness page (side-by-side review); deltas: the task header's (1)–(7); UNBUILT 19 → 12 · gate rows +14 · placeholders legal-terms-tr (TR), legal-kvkk ×2, legal-cookie-policy ×2 · dead-target sweep: 0 T13 paths | <YYYY-MM-DD> <short sha> |
```
