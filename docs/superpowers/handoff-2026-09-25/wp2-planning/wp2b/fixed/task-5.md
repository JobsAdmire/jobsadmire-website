### Task 5: Partner With Us — `/ortak-olun` · `/en/partner-with-us`

**Why this task exists.** The route is the site's partner-acquisition page (design-package page 4, `design-package/design/Partner With Us.dc.html`, strings `design-package/strings/partner.json`, ids `partner.001`–`partner.223`). No page exists yet: `/partner-with-us` is listed in `UNBUILT_PATHNAMES` and answers 404 through the `[...rest]` catch-all. This task builds it on the WP2a foundation: three track forms on two door keys through the forms kernel (the HR-agency track → `hire` with `iAm: 'hr_agency'`, the sourcing-partner and training-institute tracks → `partner` with `track`, W3/W16), the track-chooser island (native radio cards, `partner_track_select`, W26/W96), the ISO-2 country select over the `sourceCountries` + `countries` collections (W25), the shared blocks (`Breadcrumbs`, `ProcessSteps`, `StoreBadges`, `FaqBlock`, `ClosingCtaBand`, `LogoMarquee`, `ImageSlot`), the page-mounted `StickyCtaBar` (W81) and the D26 LCP/placeholder contract. Every number is a metric (W1/D17), every string a package id through `makeTf` or a `sys.partner.*` key (W9/W23), every contact anchor fires its click event with a placement (W12).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (HEAD ≥ `7bacd7e`) — never the shared checkout `…/jobsadmire-website` (it is on `main`). Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → T2 → T3 → T4 → **T5** → T6 …: when this task starts, T1 has created the shared doc shapes (W98: the `## Pages` table in `docs/SEO.md`, `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` in `docs/CONTENT-MODEL.md`, the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 has shipped `/privacy` (the consent link target); T2 has shipped `/hire-workers` (the chain section's link target). WP2a is fully built and reviewed; where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `7bacd7e`.

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first). The task ends with ONE proof session (W126, Cycle 7): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size`, the island size check and the launch anchor check, then the server is killed and no stray process is left. Playwright runs only inside that session (the page spec is written in Cycle 6 and executes there). This page is not a D27 pixel page (the four are T1, T2, T3, T12) — it gets the Fable side-by-side review, so no `npm run pixel`. Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified — read before touching anything).**
- Internal key `/partner-with-us` → TR `/ortak-olun`, EN `/en/partner-with-us` (`src/i18n/routing.ts` `pathnames`). Private folders (`_lib`, `_components`, `_sections`, `__tests__`) never become routes.
- Page record (both bundles): `bundle.pages.partner = { titleId: 'partner.222', descriptionId: 'partner.223', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` → `buildMetadata` uses the package's own SEO strings; **no `sys.seo.partner.*`** (W23). OG image `/og/{locale}/partner.png` (CDN-cached, W123).
- `CTA_BY_PATHNAME['/partner-with-us']` (`src/design/chrome/ctas.ts`) = primary `partner.017` + tail `partner.018` → `{ pathname: '/partner-with-us', hash: '#tracks' }`, secondary `HIRE` (`home.002` → `/hire-workers`). **This page must render `id="tracks"`** (W17/W152/W158: `gate:launch`'s anchor sweep lists `CTA_BY_PATHNAME['/partner-with-us'].primary … missing id="tracks"` on both locales until this task lands). No edit to `ctas.ts` (W121).
- `src/lib/seo/routes.ts` `UNBUILT_PATHNAMES` contains `'/partner-with-us'` (between `'/hiring-cost-calculator'` and `'/work-permit'` at WP2a close) — this task deletes it in the commit that adds `page.tsx` (W20; `unbuilt.test.ts` fails in either direction otherwise). `e2e/routes.ts` `GATE_ROUTE_TABLE` has no partner row — this task appends the two locale paths (W21) and nowhere else.
- Settings used (LOCAL bundles): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` only where set), `storeLinks { android: <Play URL>, ios: null }`. (`settings.partnershipsPhone` `+905533832549` exists — the Contact page's partner line — but this page's design uses the main line everywhere; owner note in the ledger, not a code choice here.)
- Metrics (`getCollection(bundle, 'metrics')` / `metricValues`): `countries '13'`, `placed '470+'`, `replySlaHours '4'`, `homepageReplyHours '24'`. W87 already re-authored `partner.059` (`… {replySlaHours} working hours`) and `partner.077` (`Shortlists from {countries} countries`); `partner.078/087/140/159/186` carry `{homepageReplyHours}` / `{replySlaHours}` / `{placed}`. Every visible package string goes through `makeTf` (D17). No metric exists for the design's "5+ HR agencies", "20+ sourcing partners", "25+ partner companies" → not rendered (W1).
- Collections: `sourceCountries` — 13 rows, collection order `PK, NP, IN, UZ, KG, TM, PH, ID, RU, ML, SN, CM, LK`, locale-resolved `name`; `countries` — 64 rows (all 13 source countries and `TR` included), upper-case ISO-2 `code`, locale-resolved `name` (W25: data, not copy — no `sys.form.countries` list exists or is written).
- Operations catalog (`P/operations-door-contract-as-built.md` v1.0 + `A/produces-final.md` § Task 8 v1.1): `hire` — `name*` ≤120, `company*` ≤200, `email*` ≤254, `phone*` ≤40 (≥ 8 digits), `country` iso2, `iAm` ∈ `direct_employer|hr_agency`, `sector`, `roleNeeded`, `headcount`, `startWhen`, `message` ≤5000, **v1.1** `city` ≤120; `partner` — `name*`, `company*`, `email*`, `phone*`, `country*` iso2, `candidatesPerYear` ≤20, `trades` ≤500, `licence` ≤200, `message` ≤5000, **v1.1** `city` ≤120 and `track` ∈ `sourcing|institute` (inbox tag `[website:partner:<track>]`; classification `SOURCING_PARTNER` for both). An unknown key is dropped silently, so the mappers copy these names exactly.
- The design's breakpoints: its generic `≤ 900 px` rule collapses every inline grid to one column → this repo's `lg:` (901 px); its `≤ 700 px` rules → `max-md:` / `md:` (701 px, `--breakpoint-md`, D19 — breakpoints are never scaled). The header is `sticky top-0`, so every in-page anchor target carries a `scroll-mt-*`.
- `.container-site` is unlayered CSS (`max-width`, `margin-inline`, `padding-inline`): a `max-w-*`/`mx-*`/`px-*` utility on the same element never applies (T13 finding) — every narrower measure below sits on an inner element.

**Design deltas this page carries on purpose (named, so the Fable side-by-side reviewer files them under (a) D20 / (b) design delta — D20/D27):**
1. D13: the inline success banners (`partner.088`/`089`) → navigation to `/tesekkurler?form=hire` (HR-agency track — the visitor reads the `hire` thank-you line, `sys.thankYou.forms.hire`) or `?form=partner` (sourcing / institute).
2. W79: every form carries the kernel's consent **checkbox** (`sys.form.consent.label`, link `/privacy`); the package's KVKK sentence `partner.090` + `091` is not rendered → WP-C legal sheet.
3. The sourcing form's licence/no-fee declaration (`partner.114`, legal) is its own **required** checkbox beside the consent tick (the design had only the declaration there).
4. W115/D20: every input shows its package label above it (`partner.093`–`098`, `115`–`118`, `134`, `136`); the design's placeholder-only inputs are gone; fields without a package label use `sys.form.labels.*` (`candidatesPerYear`, the institute's `city`); placeholders are the kernel's `sys.form.placeholders.*` examples, blank where a Turkish example would mislead a foreign partner (sourcing/institute phone, institute city and name).
5. W3/W16: the HR form sends `country: 'TR'` and `iAm: 'hr_agency'` to `hire`; the design's free-text country becomes an ISO-2 `<select>` over all 64 `countries` rows with the 13 source countries first; the institute's single "City, country" box (`partner.135`) splits into an optional `city` + the country select; `candidatesPerYear` (optional) joins the sourcing and institute forms beside `trades`.
6. W1/W6: the network card renders only the two signed rows (countries 13, placed 470+) without the count-up animation; the "5+"/"20+" rows and the "25+ partner companies" caption are not rendered; the partner logo marquee renders nothing (no consented logos, §10 #11).
7. §10 #4: the hero is a gradient — no `pw-hero` photo slot — so the **h1 is the LCP element**; the h1 is one colour (`partner.023` is one string; the design's two-tone span cannot be cut out of it, W23).
8. The track cards are native radios in a labelled radiogroup (`partner.064` "Who are you?" is its legend — visible as the ≤ 700 px wayfinder, `sr-only` above) styled as the design's cards; a choice writes `#track-<key>` into the URL and a `#track-<key>` deep link preselects its card; choosing does not auto-scroll to the panel (the arrow keys move a radio group, and a scroll on every arrow press would carry the focused radio out of view — D20).
9. D20 colours: the form-card heads are `blue-safe` / `success-text` with full-white copy (white on the design's `#1899D5` / `#16a34a` is 3.2 / 3.3:1); the chain's highlighted node is `blue-safe` → darker blue with full-white copy; the network card's "placed" figure is `warning-text` (the design's `#f59e0b` is 2.2:1); the design's `#94a3b8` greys are `text-text-tertiary` on white and `text-text-secondary` on pale grounds; in-text links are underlined; the three submit buttons are the kernel's one `primary` face (the design's green / indigo submits).
10. `ProcessSteps` (`cards`, the vertical rail at every width, step 4's "Full access" `partner.146` as its `when` pill) replaces the design's four-column card grid with the animated connector line.
11. The closing band is the foundation's dark `ClosingCtaBand` (tone `gradient`) instead of the design's light band; the "We reply within 4 working hours" badge (`partner.186`) renders as the band's ≤ 700 px tick line (the design shows it on phones only, too).
12. The sticky bar is the foundation's navy bar (≥ 901 px only, like the design's ≤ 700 px hide plus the mobile bottom bar): Call (`secondary` face), WhatsApp (`success`), "Choose your partnership →" (`primary`). The design hides it only while `#tracks` sits in the 35–75 % viewport band; the foundation's `isBarVisible` hides a bar for good once its target nears or passes, and `#tracks` is ~1,000 px down, so `hideNearId="tracks"` would never show it — the bar keys on the closing band (`hideNearId="closing"`, which repeats the Apply/Call pair). It therefore rides over the forms as it does in the design, and `html` gains `scroll-padding-bottom: var(--sticky-cta-h, 0px)` so keyboard focus and scrolled-to fields always land above it (D20, WCAG 2.4.11).
13. The FAQ ask card shows at every width (the design hides it ≤ 700 px — the block has no per-width prop) with WhatsApp / Call / E-mail rows (W83; the e-mail row's label is `partner.117`, the page's own "E-posta"/"Email" — the design's ask-card label has no id and W83's row takes one); the accordion is the foundation `Accordion` (`h3` triggers, first pair open).
14. The chain's ≤ 700 px vertical rail with dots → stacked cards, the `→` arrows from 901 px; the chain sentence's old-site link (`/hire-workers-in-turkey`) → the typed `/hire-workers` route (`partner.048` + `partner.002` + `partner.049`, the one split the package makes around its link, W23).
15. Chrome: the header CTA is the W17 table's (`partner.017`/`018` → `#tracks`, secondary Hire Workers); the portal block shows the Android badge only (W8) through `StoreBadges` (`hire.240` — never `partner.162`/`163`, W7); the two portal screenshots are named placeholders; the hero WhatsApp CTA wears the `success` face at every width (the design turns it solid green ≤ 700 px — a face is a variant, never caller colour classes, W122/W127).

**Files:**

Create
- `src/app/[locale]/(site)/partner-with-us/page.tsx`
- `src/app/[locale]/(site)/partner-with-us/actions.ts` (`'use server'`)
- `src/app/[locale]/(site)/partner-with-us/__tests__/actions.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/tracks.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/content.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/forms.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/logos.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/tracks.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/content.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/forms.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_lib/__tests__/country-options.test.ts`
- `src/app/[locale]/(site)/partner-with-us/_components/icons.tsx` (server-safe, no directive)
- `src/app/[locale]/(site)/partner-with-us/_components/DeclarationCheckbox.tsx` (`'use client'`)
- `src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx` (`'use client'`)
- `src/app/[locale]/(site)/partner-with-us/_components/__tests__/DeclarationCheckbox.test.tsx`
- `src/app/[locale]/(site)/partner-with-us/_components/__tests__/TrackChooser.test.tsx`
- `src/app/[locale]/(site)/partner-with-us/_sections/Hero.tsx`, `NetworkCard.tsx`, `Logos.tsx`, `Chain.tsx`, `Process.tsx`, `Portal.tsx`, `Faq.tsx`, `Closing.tsx`, `Tracks.tsx`, `TrackPanel.tsx`, `PartnerForms.tsx`
- `src/app/[locale]/(site)/partner-with-us/_sections/__tests__/sections.test.tsx`
- `src/app/[locale]/(site)/partner-with-us/_sections/__tests__/tracks.test.tsx`
- `e2e/pages/partner.spec.ts`
- only if Cycle 8's lazy pass is triggered: `src/app/[locale]/(site)/partner-with-us/_components/LazyStickyBar.tsx` (`'use client'`) and `_components/__tests__/LazyStickyBar.test.tsx`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — add the `sys.partner` object (3 leaves) as a sibling of `sys.form` (identical key set)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the line `'/partner-with-us',` (nothing else)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/ortak-olun', indexable: true }` and `{ path: '/en/partner-with-us', indexable: true }` as the literal's last two entries
- `src/app/globals.css` — the `html { … }` rule (the one that begins `scroll-behavior: smooth;`) gains `scroll-padding-bottom: var(--sticky-cta-h, 0px);`
- `docs/CONTENT-MODEL.md` — one bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (W98)
- `docs/SEO.md` — one row in T1's `## Pages` table (W98)
- `docs/ANALYTICS.md` — the `partner_track_select` row's "Fires on" cell in `## Event schema`, and one bullet under `### Page instrumentation (WP2b)` (W98)
- `docs/PRD.md` — §2, the table row whose page cell is `Partner With Us` (its last cell), and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**" (the page count), edited in place (W45)
- `docs/ARCHITECTURE.md` — the paragraph beginning "**`StickyCtaBar` is page-mounted**" gains one sentence (the scroll padding)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T5 row of the `## Ledger` table (Cycle 7)

Test
- Vitest: `_lib/__tests__/{tracks,content,forms,country-options}.test.ts`, `__tests__/actions.test.ts`, `_components/__tests__/{DeclarationCheckbox,TrackChooser}.test.tsx`, `_sections/__tests__/{sections,tracks}.test.tsx`
- Playwright (both projects, in the gate only): `e2e/pages/partner.spec.ts`
- Existing, must stay green untouched: `src/design/__tests__/class-collisions.test.ts` (W155 — scans `src/app/**`, so every class string below is part of the gate), `src/design/__tests__/client-imports.test.ts` (W147/W156/W158), `src/design/blocks/__tests__/rsc-imports.test.ts` (W125/W130/W134), `src/i18n/client-messages.test.ts` (W148), `src/messages/{messages,voice}.test.ts` (W154), `src/lib/seo/unbuilt.test.ts` (W20), `scripts/gate-routes.test.ts` (W21), `e2e/{routing,seo,a11y,width-sweep,chrome,headers,thank-you}.spec.ts`

**Interfaces:**

Consumes (exact names, verified in the code at `7bacd7e`; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeT`, `makeTf`, `metricValues` from `@/content/adapter` (`server-only`; `export * from './pure'`); `makeTf`, `metricValues` from `@/content/pure` (tests); `getCollection` (`'sourceCountries' | 'countries'`), `type MetricKey` from `@/content/collections`; `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: five levels up from `partner-with-us/page.tsx`, six from `_lib/`, `_sections/`, `__tests__/`, seven from `_lib/__tests__/` and `_sections/__tests__/`).
- Forms kernel (`src/forms/**`): `createFormAction`, `type FormActionState` from `@/forms/action` (`FormSpec = { key: FormKey, schema, toFields(parsed, data, ctx: { visitor, locale }), consent?: 'checkbox' | 'notice' }`; the kernel adds `errors.consent = 'consent'` itself when the tick is missing and redirects to `{ pathname: '/thank-you', query: { form: key } }` on a non-`FAILED` 200); `IDLE_FORM_STATE` from `@/forms/types`; `fieldErrorsFromIssues` from `@/forms/errors` (a `FormErrorCode` in an issue's `message` wins; `invalid_type` on `undefined` → `required`); `type WireFields` from `@/forms/wire` (empty strings are dropped by `buildEnvelope`); `CONSENT_VERSION` from `@/forms/consent`; `FormShell` from `@/forms/client/FormShell` — props used: `action, formKey, idScope, locale, turnstileSiteKey, whatsappNumber, contact, submitLabel, consent, headingLevel, testId` (no `consentLinkHref` — its only value `'/privacy'` is the default, W79; no `id` — the design's anchors sit on the form cards); every id derives from `idScope ?? formKey` (`f-<scope>-<name>`, `f-<scope>-consent`, `f-<scope>-honeypot`); `Field`, `type FieldOption` from `@/forms/client/Field` — props used: `name, label, placeholder, required, as, type, options, autoComplete, inputMode, rows, maxLength` (the select branch ignores `placeholder` and prepends `sys.form.placeholders.select`, W111); `useFieldError`, `useFieldId`, `useFieldValue`, `useRegisterField`, `FormErrorsContext`, `type FormErrorsValue` from `@/forms/client/FormErrorsContext`; the D11 `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, bare `https://wa.me/<n>` anchor, prefill via `window.open` on click — W76).
- Chrome/analytics: `StickyCtaBar`, `type StickyCta` (`{ label, href: string | Exclude<Href, string>, variant?, external? }`) from `@/design/chrome/StickyCtaBar` (props `message, ctas, showAfterPx?, hideNearId?, live?`; renders `null` while hidden; wrapper `data-testid="sticky-cta"`, `hidden … lg:block`; publishes `--sticky-cta-h` on `<html>`; contact hrefs through `ContactCta` `page_cta`, W81); `CheckIcon`, `WhatsAppIcon` (`{ size?, className? }`) from `@/design/chrome/icons`; `ContactLink` from `@/analytics/ContactLink` (`'use client'`; `{ href, placement, …anchor props }` minus `onClick`/`onAuxClick`); `track`, `PARAM_ENUMS` from `@/analytics/track` (`PARAM_ENUMS.track = ['sourcing', 'institute']`, `ALLOWED_PARAMS.partner_track_select = ['page', 'locale', 'track']`).
- Blocks (by path, `@/design/blocks/<Name>`): `Breadcrumbs` (`{ locale, items: { name, href }[], tone?: 'light' | 'dark', className? }`, emits `BreadcrumbList`, nav named `sys.nav.breadcrumbs`); `FaqBlock` + `type FaqItem` (`{ bundle, locale, items, id?, eyebrowId?, headingId?, bodyId?, askCard?, singleOpen?, openFirst?, headingLevel? }`, emits `FAQPage`; `FaqAskCard = { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, phone?, callLabelId?, email?, emailLabelId?, subject? }`, W83); `ProcessSteps` + `type ProcessStep` (`{ n, titleId, bodyId, when? }`; props `bundle, locale, steps, variant?: 'cards' | 'plain', id?, headingLevel?: 3 | 4`); `ClosingCtaBand` (`{ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, extra?, ticks?, tone?: 'navy' | 'gradient' | 'green', id? }` — `ticks` render `md:hidden`; the root carries `id`); `ContactCta` (`{ placement: 'page_cta' | 'office_card', href, variant?, size?, external?, className?, children }`); `ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }` — owns its box, `className` only for a radius/border, W129); `StoreBadges` (`{ bundle, locale, android, ios?, tone? }`); `LogoMarquee` + `type Logo` (`{ logos: Logo[], durationSec?, className? }` → `null` for `[]`).
- Primitives (by path): `Button` (`variant` ∈ `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`, `size`, `href`, `external`) from `@/design/primitives/Button`; `type ButtonVariant` from the same module; `Eyebrow` from `@/design/primitives/Eyebrow`; `Section` (`{ tone: 'light'|'dark'|'pale'|'band', id?, className?, children }` — tones set `py-16` / `py-10` and the background colour) from `@/design/primitives/Section`.
- i18n/SEO/contact: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata` from `@/lib/seo/metadata` (`{ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription }`); `waLink`, `telLink`, `mailLink` from `@/lib/contact`; `renderWithIntl` from `@/test/render`.
- Messages consumed, not added: `sys.form.labels.{city,candidatesPerYear}`, `sys.form.placeholders.*`, `sys.form.hints.{optional,phone}`, `sys.form.errors.{required,consent}`, `sys.form.consent.label`, `sys.form.fallback.*`, `sys.nav.breadcrumbs`, `sys.thankYou.forms.{hire,partner}` (the thank-you page's).
- Gate tooling: `npm run gate` / `gate:launch` (`scripts/gate.sh`; the launch profile's `scripts/launch/dead-targets.ts` prints `… (/partner-with-us#tracks): <locale> <path> → missing id="tracks" …` while the anchor is absent), `npm run js-size` (`scripts/js-size.mjs`), Playwright projects `mobile` (Pixel 7, 412 px) and `desktop` (1440×900).

Produces (for T14's instance map, T15's launch sweep and later page tasks that copy patterns — nothing imports these files across route folders):
- DOM: `section#tracks` (the header CTA, the hero, the sticky bar and the closing band land there); `#track-detail`; the radios `#track-hr`, `#track-sourcing`, `#track-institute` (a `#track-<key>` deep link preselects that card — for per-track campaigns); the form cards `#apply-hr`, `#apply-agent`, `#apply-inst` (the design's ids); `form[data-testid="partner-form-hr"]` (`data-form-key="hire"`, `idScope` `partner-hr`), `form[data-testid="partner-form-sourcing"]` (`partner`, `partner-sourcing`), `form[data-testid="partner-form-institute"]` (`partner`, `partner-institute`) — one mounted at a time; `#closing` (the band); one `data-lcp-slot` (the h1); placeholders `partner-portal-screen`, `partner-portal-mobile`.
- Wire (T14's I4 rows 6–8): HR agency → `hire` · `name, company, email, phone, country: 'TR', iAm: 'hr_agency', city` (required on this page), `message?`; sourcing partner → `partner` · `name, company, email, phone, country` (ISO-2), `track: 'sourcing', licence` (required on this page), `candidatesPerYear?, trades?`; training institute → `partner` · `name, company, email, phone, country, track: 'institute', city?, candidatesPerYear?, trades?`. Consent is a checkbox on all three (W79); the sourcing form also requires the declaration tick, which is never sent (not a catalog field).
- Analytics: `partner_track_select` wired (the chooser, `sourcing | institute` only).
- `html { scroll-padding-bottom: var(--sticky-cta-h, 0px) }` — every later page that mounts a `StickyCtaBar` inherits it.

**Rulings applied:**
- W1/D17 — the network card's two rows and every `{metric}` string read the `metrics` collection (`metricValues`/`makeTf`); the unsigned "5+/20+/25+" figures render nothing.
- W3/W16 — HR track → `hire` + `iAm: 'hr_agency'` + `country: 'TR'`; sourcing/institute → `partner` + `track`; ISO-2 country select; `city` rides as the catalog v1.1 field; the door's required fields win over the design (`country` on every form, `licence` on sourcing).
- W6 — the logo band (and its "25+" caption) renders nothing without consented logos; the wrapping section is not rendered either (W97's rule).
- W7/W8 — Android badge only through `StoreBadges` (`hire.240`); `partner.162`/`163` never read.
- W9/W23/W54 — three `sys.partner.*` keys for id-less copy (the two WhatsApp prefills, the mail subject); no `sys.seo.partner.*`; the only composed package sentence is `partner.048` + `partner.002` + `partner.049`, the split the package makes around its link.
- W10 — the design's ≤ 700 px show/hide pairs (`partner.024`/`025`, `062`/`063`, `041`/`042`, `043`/`044`, the wayfinders, the jump links, the phone mock) are CSS on server-rendered markup (`max-md:hidden` / `md:hidden`), never conditional rendering.
- W12/W26/W67/W68 — `partner_track_select { page, locale, track }` fires for `sourcing | institute` only (the HR default and a deep link fire nothing; `track()` drops anything else); every `tel:`/`wa.me`/`mailto:` anchor is a `ContactCta`/`ContactLink` with `placement: 'page_cta'`.
- W13 amended/W96/W120/W136 — `TrackChooser` stays a plain client component (not `next/dynamic`, not `LazyIsland`) with its own gzipped chunk ≤ 6,144 B, measured in Cycle 7; the ledger's JS figure is `js-size`'s (ceiling 204,800 B, lazy line 194,560 B).
- W14 — no hot-linked images: icons are inline SVG, the store badge is `StoreBadges`, the portal shots are `ImageSlot` placeholders.
- W17/W121/W152/W158 — no `ctas.ts` edit; the page renders `id="tracks"` in both locales; Cycle 7 proves the launch anchor sweep no longer lists it.
- W18/W81 — the page mounts `StickyCtaBar` with the design's Call / WhatsApp / `#tracks` CTAs (contact hrefs tracked by the bar itself), `hideNearId="closing"` (delta 12), `live`.
- W19/R31 — lives in the `(site)` group; no `<main>` (the layout owns it).
- W20/W21 — `'/partner-with-us'` leaves `UNBUILT_PATHNAMES` in the commit that adds `page.tsx`; the two locale paths join `GATE_ROUTE_TABLE` and nowhere else.
- W25 — the country select reads `sourceCountries` + `countries`; no `sys.form.countries`.
- W27/W55/D26 — the two portal screenshots are named placeholders; exactly one `data-lcp-slot`, the h1 (no hero photo, §10 #4).
- W45/W98 — every doc edit anchors on T1's headings/sentences and appends a row/bullet; no line numbers.
- W73–W76/W116/W117 — kernel as built (9 s shared deadline, one connection-level retry, bare fallback href, click-time prefill); no uploads on this page.
- W77/W78 — option values are keys (`TR`, `hr_agency`, `sourcing`, `institute`, ISO-2 codes); no `startWhen` field exists on this page (the design asks none).
- W79 — `consent: 'checkbox'` in all three specs and shells; no `consentLinkHref`; `partner.090`/`091` → WP-C sheet; the declaration is an EXTRA required checkbox.
- W82 — the page's hash CTAs (`#tracks`, `#apply-*`) are plain strings (same-page anchors).
- W83 — the FAQ ask card's e-mail row comes from `FaqAskCard.email/emailLabelId/subject`; no `footer` workaround.
- W87 — `partner.059`/`077` arrive re-authored and render through `makeTf` (pinned by `content.test.ts`).
- W92 — the page e2e is deterministic without `OPS_API_URL`: a valid submit ends on the `unauthorized` fallback panel; the submitting cases skip on a door face (`staging`, production).
- W95 — no visitor data in any DOM href: the page's own `wa.me` links carry only the static `sys.partner.*` prefills, the mailto only the static subject; the fallback anchors are bare.
- W99 — T5 runs after T1, T13, T2, T3, T4. W109 — breadcrumbs use this page's own ids: `partner.016` → `/`, `partner.008` → this page.
- W111 — `Field as="select"` ignores `placeholder` (the country select starts on `sys.form.placeholders.select`, value `''` → `required`).
- W113 — section test ids sit on inner `<div>`s; `Section`'s props stay frozen.
- W115 — package field labels are passed as `label`; `sys.form.labels.*` only for `candidatesPerYear` and the institute's `city`; e2e selects inputs by the rendered label.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — hide ≤ 700 px with `max-md:hidden`, show ≤ 700 px with `md:hidden`, hide ≤ 900 px with `max-lg:hidden`; never `hidden` beside an unprefixed display utility; no class string sets one property twice at one variant; no colour/display/width class reaches `Button`/`ContactCta`/`ImageSlot` (a different face is a variant: `success` for WhatsApp, W127) — `class-collisions.test.ts` scans every file below.
- W123 — the docs call the OG image CDN-cached, never ISR. W124 — not a template record.
- W125/W130/W134/W147/W156 — primitives, blocks, chrome pieces and islands by module path everywhere, type-only imports included; server files never import `@/analytics/useContactClick`; `client-imports.test.ts` and `rsc-imports.test.ts` stay green.
- W126 — one build + one start + one gate as the proof (Cycle 7).
- W128 — not applicable (no green band, no `PostCard`). W129 — `ImageSlot` gets no width/height/aspect/object class: the laptop shot sits in its frame, the phone shot in a sized wrapper, only `rounded-[17px]` is passed. W131/W133 — not applicable.
- W132 — `LazyIsland` is not used: the one island is W96's exception, and viewport loading would not cut the forms kernel (≈ 7.5 KB gz) from the first-load graph of a page whose forms ARE the content (projection in Cycle 7).
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json` = production: DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors); GTM stays dark (no `NEXT_PUBLIC_GTM_ID` locally).
- W137/W139/W140 — no preview run by the implementer (never push); the controller's binding preview run uses `--settings.extraHeaders`.
- W148 — no `CLIENT_SYS` change: no client module reads `sys.partner` (the island and the forms receive resolved strings; `DeclarationCheckbox` reads `sys.form` through the kernel's hooks, already listed).
- W150 — no D17 dated badge on this page → no `revalidate` export (SSG like every static page).
- W154 — no `sys.partner.*` string speaks as "we"/"biz" (the two prefills are the visitor's first-person singular, the subject is a noun phrase; `voice.test.ts` scans all of `sys.*`).
- W157/W160 — security headers come from the middleware; nothing for the page to do. W161 — no `url`-typed field is sent.
- Final-review page rule (§6) — exactly one `Breadcrumbs` and one `FaqBlock` per page (one `BreadcrumbList`, one `FAQPage`, one landmark label each); the site-wide `Organization`/`EmploymentAgency` node is not repeated (the design's per-page `EmploymentAgency` block is dropped).
- D11/D13/D19/D20/D23/D26/D27 and R15/R22/R35/R56 — fallback panel, thank-you navigation, unscaled breakpoints, accessibility over pixels, no fixtures, named LCP slot, Fable review (not a pixel page), the chrome renders its own canonical ids (this page reads `partner.002`, `008`, `016` only as its own link/crumb labels), same-tab contact anchors except `wa.me` (`target="_blank"` + `noopener`), `page` from `next/navigation`, no `src/content/local/*` import from `src/**` (tests read the bundles with `readFileSync`).

---

#### Cycle 1 — track keys, the package-id table, the form schemas and catalog mappers, the ISO-2 country options, `sys.partner` copy (pure code)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/tracks.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { PARAM_ENUMS } from '@/analytics/track';
import {
  DEFAULT_TRACK,
  FORM_ANCHOR,
  FORM_ID_SCOPE,
  FORM_KEY_BY_TRACK,
  PARTNER_TRACKS,
  TRACK_KEYS,
  isPartnerTrack,
  trackFromHash,
  trackHash,
} from '../tracks';

describe('tracks', () => {
  it('are the three design cards, HR first and default; the partner tracks equal the W16/W26 enum', () => {
    expect(TRACK_KEYS).toEqual(['hr', 'sourcing', 'institute']);
    expect(DEFAULT_TRACK).toBe('hr');
    expect([...PARTNER_TRACKS]).toEqual([...PARAM_ENUMS.track]);
    expect(TRACK_KEYS.filter(isPartnerTrack)).toEqual(['sourcing', 'institute']);
  });

  it('post to hire (the HR agency, W3) or partner (sourcing, institute, W16)', () => {
    expect(FORM_KEY_BY_TRACK).toEqual({ hr: 'hire', sourcing: 'partner', institute: 'partner' });
  });

  it('keep the design form anchors and give every shell its own id scope (W79)', () => {
    expect(FORM_ANCHOR).toEqual({ hr: 'apply-hr', sourcing: 'apply-agent', institute: 'apply-inst' });
    expect(FORM_ID_SCOPE).toEqual({
      hr: 'partner-hr',
      sourcing: 'partner-sourcing',
      institute: 'partner-institute',
    });
    expect(new Set(Object.values(FORM_ID_SCOPE)).size).toBe(3);
  });

  it('write and read #track-<key> and nothing else', () => {
    for (const key of TRACK_KEYS) {
      expect(trackHash(key)).toBe(`#track-${key}`);
      expect(trackFromHash(trackHash(key))).toBe(key);
    }
    for (const hash of ['', '#', '#tracks', '#track-', '#track-admin', '#track-HR', '#apply-hr', 'track-hr'])
      expect(trackFromHash(hash), hash).toBeNull();
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/content.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { PARTNER_PACKAGE_IDS, PARTNER_SYS_KEYS } from '../content';

// D23/R56: src/** never imports src/content/local/*; a test reads the generated bundles from disk.
const stringsOf = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;
const TR = stringsOf('tr');
const EN = stringsOf('en');

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const leaf = (o: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>((acc, k) => (acc && typeof acc === 'object' ? (acc as Tree)[k] : undefined), o);
const partnerOf = (file: unknown) => (file as { sys: Tree }).sys.partner as Tree;
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `partner.${String(from + i).padStart(3, '0')}`);

describe('PARTNER_PACKAGE_IDS', () => {
  it('lists 162 distinct partner ids, first partner.002, last partner.223', () => {
    expect(new Set(PARTNER_PACKAGE_IDS).size).toBe(PARTNER_PACKAGE_IDS.length);
    expect(PARTNER_PACKAGE_IDS).toHaveLength(162);
    for (const id of PARTNER_PACKAGE_IDS) expect(id).toMatch(/^partner\.\d{3}$/);
    expect(PARTNER_PACKAGE_IDS[0]).toBe('partner.002');
    expect(PARTNER_PACKAGE_IDS[PARTNER_PACKAGE_IDS.length - 1]).toBe('partner.223');
  });

  it('exists with a non-empty value in both generated bundles (an unknown id throws in dev)', () => {
    for (const id of PARTNER_PACKAGE_IDS) {
      expect(TR[id], `${id} (tr)`).toBeTruthy();
      expect(EN[id], `${id} (en)`).toBeTruthy();
    }
  });

  it('never reads the chrome ids (R15), the header CTA pair (W17) or the ids the deltas retire', () => {
    const notRead = [
      'partner.001',
      ...range(3, 7),
      ...range(9, 15),
      ...range(17, 22), // chrome labels + the CTA_BY_PATHNAME pair 017/018 (R15/W17)
      'partner.034', // hero photo alt — gradient hero (§10 #4)
      'partner.037',
      'partner.039',
      'partner.045', // captions of the unsigned 5+/20+/25+ figures (W1)
      'partner.088',
      'partner.089', // inline success banner → /tesekkurler (D13)
      'partner.090',
      'partner.091', // the KVKK sentence → the kernel consent (W79)
      'partner.135', // "City, country" → city + the ISO-2 select
      'partner.162',
      'partner.163', // store micro-copy → StoreBadges reads hire.240 (W7)
      ...range(191, 221), // footer chrome (R15)
    ];
    expect(notRead).toHaveLength(61);
    for (const id of notRead) expect(PARTNER_PACKAGE_IDS, id).not.toContain(id);
    // 223 − 61 = 162: every other partner id is read by this page.
    expect([...notRead, ...PARTNER_PACKAGE_IDS].sort()).toEqual(range(1, 223));
  });

  it('carries the W87 re-authored metric spellings in both locales', () => {
    for (const s of [TR, EN]) {
      expect(s['partner.059']).toContain('{replySlaHours}');
      expect(s['partner.077']).toContain('{countries}');
      expect(s['partner.077']).not.toMatch(/12/);
    }
  });
});

describe('sys.partner', () => {
  it('has exactly the page keys, identical in both locales, never empty and never English in TR', () => {
    const trKeys = flatten(partnerOf(tr)).sort();
    expect(trKeys).toEqual([...PARTNER_SYS_KEYS].sort());
    expect(flatten(partnerOf(en)).sort()).toEqual(trKeys);
    for (const key of PARTNER_SYS_KEYS) {
      const t = leaf(partnerOf(tr), key);
      const e = leaf(partnerOf(en), key);
      expect(typeof t === 'string' && t.trim().length > 0, `${key} (tr)`).toBe(true);
      expect(typeof e === 'string' && e.trim().length > 0, `${key} (en)`).toBe(true);
      expect(t, key).not.toBe(e);
    }
  });

  it('writes both WhatsApp prefills in the visitor voice, addressed to JobsAdmire (static text, W95)', () => {
    for (const [file, hello] of [
      [tr, 'Merhaba JobsAdmire'],
      [en, 'Hello JobsAdmire'],
    ] as const) {
      expect(String(leaf(partnerOf(file), 'whatsapp.prefill')).startsWith(hello)).toBe(true);
      expect(String(leaf(partnerOf(file), 'faq.whatsappText')).startsWith(hello)).toBe(true);
    }
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/forms.test.ts`:

```ts
import type { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import {
  CAPS,
  DECLARATION_FIELD,
  HR_COUNTRY,
  HR_I_AM,
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from '../forms';

/** The Operations catalog field names — v1.0 (`website-form-catalog.ts`) + the v1.1 additions of
 *  WP2a Task 8 (W16). The door silently DROPS any other name inside `fields`, so a typo loses
 *  data with a 200. */
const HIRE_CATALOG = [
  'name',
  'company',
  'email',
  'phone',
  'country',
  'iAm',
  'sector',
  'roleNeeded',
  'headcount',
  'startWhen',
  'message',
  'city',
];
const PARTNER_CATALOG = [
  'name',
  'company',
  'email',
  'phone',
  'country',
  'candidatesPerYear',
  'trades',
  'licence',
  'message',
  'city',
  'track',
];

/** The kernel's field-error codes for one input (`{}` when it parses). */
const codesOf = <S extends z.ZodTypeAny>(schema: S, input: unknown) => {
  const r = schema.safeParse(input);
  return r.success ? {} : fieldErrorsFromIssues(r.error.issues);
};

const hr = {
  company: 'Akdeniz İK A.Ş.',
  name: 'Ayşe Yılmaz',
  city: 'Antalya',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  message: 'Kaynakçı ve CNC operatörü',
};

describe('HR-agency track → hire (W3)', () => {
  it('maps onto hire catalog names only, forcing country TR and iAm hr_agency', () => {
    const fields = hrAgencyToFields(hrAgencySchema.parse(hr));
    expect(fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Akdeniz İK A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      country: 'TR',
      iAm: 'hr_agency',
      city: 'Antalya',
      message: 'Kaynakçı ve CNC operatörü',
    });
    expect(HR_COUNTRY).toBe('TR');
    expect(HR_I_AM).toBe('hr_agency');
    for (const key of Object.keys(fields)) expect(HIRE_CATALOG, key).toContain(key);
  });

  it('reads empty required fields as required before any format rule', () => {
    expect(
      codesOf(hrAgencySchema, { company: '', name: '', city: '', email: '', phone: '' }),
    ).toEqual({
      company: 'required',
      name: 'required',
      city: 'required',
      email: 'required',
      phone: 'required',
    });
  });

  it('flags a bad e-mail as email and a short phone as phone (the door needs 8 digits)', () => {
    expect(codesOf(hrAgencySchema, { ...hr, email: 'nope', phone: '12 34' })).toEqual({
      email: 'email',
      phone: 'phone',
    });
  });

  it('caps fields at the catalog lengths', () => {
    expect(
      codesOf(hrAgencySchema, {
        ...hr,
        company: 'x'.repeat(CAPS.company + 1),
        city: 'x'.repeat(CAPS.city + 1),
      }),
    ).toEqual({ company: 'max', city: 'max' });
  });

  it('sends an empty message when the textarea is blank or absent (buildEnvelope drops it)', () => {
    expect(hrAgencyToFields(hrAgencySchema.parse({ ...hr, message: '' })).message).toBe('');
    expect(hrAgencyToFields(hrAgencySchema.parse({ ...hr, message: undefined })).message).toBe('');
  });
});

const sourcing = {
  company: 'Karachi Manpower Ltd',
  name: 'Bilal Khan',
  country: 'pk',
  licence: 'OEP-1234',
  email: 'bilal@example.com',
  phone: '+92 300 1234567',
  candidatesPerYear: '250',
  trades: 'Welders, electricians — 20 a month',
  [DECLARATION_FIELD]: 'on',
};

describe('sourcing-partner track → partner + track sourcing (W3/W16)', () => {
  it('maps onto partner catalog names only, upper-cases the ISO-2 country, never sends the declaration', () => {
    const fields = sourcingToFields(sourcingSchema.parse(sourcing));
    expect(fields).toEqual({
      name: 'Bilal Khan',
      company: 'Karachi Manpower Ltd',
      email: 'bilal@example.com',
      phone: '+92 300 1234567',
      country: 'PK',
      track: 'sourcing',
      licence: 'OEP-1234',
      candidatesPerYear: '250',
      trades: 'Welders, electricians — 20 a month',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
    expect(DECLARATION_FIELD).toBe('licenceDeclaration');
    expect(PARTNER_CATALOG).not.toContain(DECLARATION_FIELD);
  });

  it('requires the licence declaration tick as its own field (W79: beside the consent, not instead)', () => {
    const unticked: Record<string, string> = { ...sourcing };
    delete unticked[DECLARATION_FIELD];
    expect(codesOf(sourcingSchema, unticked)).toEqual({ [DECLARATION_FIELD]: 'required' });
    expect(codesOf(sourcingSchema, { ...sourcing, [DECLARATION_FIELD]: 'yes' })).toEqual({
      [DECLARATION_FIELD]: 'invalid',
    });
  });

  it('rejects a free-text country (the door would 400) and reads the empty select as required', () => {
    expect(codesOf(sourcingSchema, { ...sourcing, country: 'Pakistan' })).toEqual({
      country: 'invalid',
    });
    expect(codesOf(sourcingSchema, { ...sourcing, country: '' })).toEqual({ country: 'required' });
  });

  it('requires the licence number and caps trades (500) and candidatesPerYear (20)', () => {
    expect(
      codesOf(sourcingSchema, {
        ...sourcing,
        licence: '',
        trades: 'x'.repeat(CAPS.trades + 1),
        candidatesPerYear: '1'.repeat(CAPS.candidatesPerYear + 1),
      }),
    ).toEqual({ licence: 'required', trades: 'max', candidatesPerYear: 'max' });
  });

  it('turns blank optionals into empty strings (buildEnvelope sends nothing for them)', () => {
    const fields = sourcingToFields(
      sourcingSchema.parse({ ...sourcing, candidatesPerYear: '', trades: '' }),
    );
    expect(fields.candidatesPerYear).toBe('');
    expect(fields.trades).toBe('');
  });
});

const institute = {
  company: 'Lahore Technical Institute',
  name: 'Sara Ahmed',
  city: 'Lahore',
  country: 'PK',
  email: 'sara@example.com',
  phone: '+92 42 1234567',
  candidatesPerYear: '',
  trades: 'Plumbing, HVAC — 60 graduates per batch',
};

describe('institute track → partner + track institute (W3/W16)', () => {
  it('maps city and country separately and sends track institute, no licence and no message', () => {
    const fields = instituteToFields(instituteSchema.parse(institute));
    expect(fields).toEqual({
      name: 'Sara Ahmed',
      company: 'Lahore Technical Institute',
      email: 'sara@example.com',
      phone: '+92 42 1234567',
      country: 'PK',
      track: 'institute',
      city: 'Lahore',
      candidatesPerYear: '',
      trades: 'Plumbing, HVAC — 60 graduates per batch',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
  });

  it('keeps city optional and country required (the design asked "City, country" in one box)', () => {
    expect(instituteSchema.safeParse({ ...institute, city: '' }).success).toBe(true);
    expect(codesOf(instituteSchema, { ...institute, country: '' })).toEqual({ country: 'required' });
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_lib/__tests__/country-options.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../../../../contract/website-bundle.v1';
import { getCollection } from '@/content/collections';
import { countryOptions } from '../country-options';

const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

describe('countryOptions (W3/W25)', () => {
  it('lists the source countries first in their own order, then the rest by locale name, each code once', () => {
    const source = [
      { code: 'PK', name: 'Pakistan' },
      { code: 'NP', name: 'Nepal' },
    ];
    const general = [
      { code: 'TR', name: 'Türkiye' },
      { code: 'PK', name: 'Pakistan' }, // also a source country — listed once, in the head
      { code: 'DK', name: 'Danimarka' },
      { code: 'CN', name: 'Çin' },
      { code: 'DZ', name: 'Cezayir' },
    ];
    expect(countryOptions(source, general, 'tr')).toEqual([
      { value: 'PK', label: 'Pakistan' },
      { value: 'NP', label: 'Nepal' },
      { value: 'DZ', label: 'Cezayir' },
      { value: 'CN', label: 'Çin' },
      { value: 'DK', label: 'Danimarka' },
      { value: 'TR', label: 'Türkiye' },
    ]);
  });

  it('sorts with the Turkish collation on TR (I before İ) and the English one on EN', () => {
    const rows = [
      { code: 'GB', name: 'İngiltere' },
      { code: 'IQ', name: 'Irak' },
      { code: 'IR', name: 'İran' },
    ];
    expect(countryOptions([], rows, 'tr').map((o) => o.label)).toEqual(['Irak', 'İngiltere', 'İran']);
    expect(countryOptions([], rows, 'en').map((o) => o.label)).toEqual(['İngiltere', 'Irak', 'İran']);
  });

  it('covers the 64 countries of the real bundles, the 13 source countries first, ISO-2 values', () => {
    for (const locale of ['tr', 'en'] as const) {
      const bundle = load(locale);
      const source = getCollection(bundle, 'sourceCountries');
      const options = countryOptions(source, getCollection(bundle, 'countries'), locale);
      expect(options).toHaveLength(64);
      expect(options.slice(0, 13).map((o) => o.value)).toEqual(source.map((c) => c.code));
      expect(options[0]).toEqual({ value: 'PK', label: 'Pakistan' });
      expect(new Set(options.map((o) => o.value)).size).toBe(64);
      for (const o of options) expect(o.value).toMatch(/^[A-Z]{2}$/);
      expect(options.some((o) => o.value === 'TR')).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 partner-with-us/_lib
```
Expected: FAIL — `tracks`, `forms` and `country-options` cannot resolve `../tracks`, `../forms`, `../country-options`; `content.test.ts` cannot resolve `../content`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_lib/tracks.ts` — client-safe (no Zod, no React): the chooser island imports THIS file, never `forms.ts`, so no schema reaches the client bundle (W96):

```ts
import type { FormKey } from '@/analytics/forms';

/** The three partnership tracks, in the design's card order. */
export const TRACK_KEYS = ['hr', 'sourcing', 'institute'] as const;
export type TrackKey = (typeof TRACK_KEYS)[number];

/** Catalog v1.1 `partner.track` (W16) — the same pair `PARAM_ENUMS.track` allows on
 *  `partner_track_select` (W26/W67); `tracks.test.ts` pins the two lists together. */
export const PARTNER_TRACKS = ['sourcing', 'institute'] as const;
export type PartnerTrack = (typeof PARTNER_TRACKS)[number];

export const isPartnerTrack = (key: TrackKey): key is PartnerTrack =>
  (PARTNER_TRACKS as readonly string[]).includes(key);

/** The design's default panel (`track: 'hr'`). Showing it is not a visitor signal (W67). */
export const DEFAULT_TRACK: TrackKey = 'hr';

/** W3: the HR agency is an employer-side client for the Turkey sales team (`hire`, `iAm:
 *  'hr_agency'`); the other two are supply-side partners (`partner`, `track`). */
export const FORM_KEY_BY_TRACK: Record<TrackKey, FormKey> = {
  hr: 'hire',
  sourcing: 'partner',
  institute: 'partner',
};

/** The form cards' anchors — the design's own ids, the mobile jump links' targets. */
export const FORM_ANCHOR: Record<TrackKey, string> = {
  hr: 'apply-hr',
  sourcing: 'apply-agent',
  institute: 'apply-inst',
};

/** `FormShell idScope` per shell: sourcing and institute share the `partner` key, so each shell
 *  scopes its own ids (`f-partner-sourcing-consent` …) even though one mounts at a time (W79). */
export const FORM_ID_SCOPE: Record<TrackKey, string> = {
  hr: 'partner-hr',
  sourcing: 'partner-sourcing',
  institute: 'partner-institute',
};

/** The URL fragment for a track — also the card radio's own id, so a campaign deep link
 *  (`/ortak-olun#track-sourcing`) lands on the card it preselects. */
export const trackHash = (key: TrackKey) => `#track-${key}`;

/** `#track-<key>` → the key; any other fragment → null. */
export function trackFromHash(hash: string): TrackKey | null {
  const key = /^#track-([a-z]+)$/.exec(hash)?.[1];
  return key && (TRACK_KEYS as readonly string[]).includes(key) ? (key as TrackKey) : null;
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/content.ts` — the page's id table (one place; the sections read from it, `content.test.ts` pins it to both bundles):

```ts
import type { TrackKey } from './tracks';

/**
 * Every package id the Partner With Us page reads, by section — read through `makeTf` (D17:
 * partner.059, 077, 078, 087, 140, 159 and 186 carry `{metric}` placeholders). NOT here, on
 * purpose: the chrome's own ids (partner.001, 003–007, 009–015, 019–022, 191–221 — the layout
 * renders the canonical `home.*` ids, R15), the header CTA pair partner.017/018
 * (`CTA_BY_PATHNAME`, W17), the hero photo alt partner.034 (gradient hero, §10 #4), the captions
 * of the unsigned 5+/20+/25+ figures partner.037/039/045 (W1), the inline success banner
 * partner.088/089 (D13), the KVKK sentence partner.090/091 (W79), the "City, country" box
 * partner.135 (split into `city` + the ISO-2 select) and the store micro-copy partner.162/163
 * (`StoreBadges` reads hire.240, W7). partner.002/008/016 ARE read: the Hire Workers link inside
 * the chain sentence the package splits around it (W23) and this page's own crumbs (W109).
 */

/** A package-string reader: `makeTf(bundle, locale)`. */
export type Tf = (id: string) => string;
type Pair = readonly [string, string];

export const HERO_IDS = {
  crumbHome: 'partner.016',
  crumbSelf: 'partner.008',
  h1: 'partner.023',
  leadDesk: 'partner.024',
  leadMob: 'partner.025',
  ticks: [
    ['partner.026', 'partner.027'],
    ['partner.028', 'partner.029'],
  ],
  ctaTracks: 'partner.030',
  ctaWhatsApp: 'partner.031',
  speakLead: 'partner.032',
  speakTail: 'partner.033',
} as const;

/** "Our network today": only the rows whose number is a signed metric render (W1). */
export const NETWORK_IDS = {
  heading: 'partner.035',
  live: 'partner.036',
  footnote: 'partner.046',
  rows: [
    { metric: 'countries', deskId: 'partner.041', mobId: 'partner.042' },
    { metric: 'placed', deskId: 'partner.043', mobId: 'partner.044' },
  ],
} as const;

export const CHAIN_IDS = {
  heading: 'partner.047',
  introLead: 'partner.048',
  introLink: 'partner.002', // the package splits the sentence around its Hire Workers link (W23)
  introTail: 'partner.049',
  nodes: [
    { tone: 'supply', eyebrow: 'partner.050', title: 'partner.051', body: 'partner.052' },
    { tone: 'core', eyebrow: 'partner.053', title: 'partner.054', body: 'partner.055' },
    { tone: 'demand', eyebrow: 'partner.056', title: 'partner.057', body: 'partner.058' },
  ],
} as const;

/** The sticky bar: partner.059 is re-authored to `{replySlaHours}` (W87). */
export const STICKY_IDS = {
  message: 'partner.059',
  call: 'partner.060',
  whatsapp: 'partner.031',
  tracks: 'partner.030',
} as const;

export const TRACKS_IDS = {
  heading: 'partner.061',
  introDesk: 'partner.062',
  introMob: 'partner.063',
  choose: 'partner.064', // the radiogroup's legend — "1 Who are you?" on phones
  apply: 'partner.070', // "2 Your application" on phones
  cardCta: 'partner.066',
  cards: {
    hr: { title: 'partner.038', body: 'partner.065' },
    sourcing: { title: 'partner.040', body: 'partner.067' },
    institute: { title: 'partner.068', body: 'partner.069' },
  },
} as const;

/** What every panel shares. partner.087 carries `{replySlaHours}`. */
export const PANEL_SHARED = {
  jump: 'partner.074',
  asksHeading: 'partner.082',
  sla: 'partner.087',
  submit: 'partner.092',
} as const;

export type PanelCopy = {
  eyebrow: string;
  heading: string;
  lead: string;
  benefits: readonly Pair[];
  asks: readonly string[];
  formTitle: string;
};

/** One panel per track (partner.077 → `{countries}`, 078 → `{homepageReplyHours}`, W87). */
export const PANEL_COPY: Record<TrackKey, PanelCopy> = {
  hr: {
    eyebrow: 'partner.071',
    heading: 'partner.072',
    lead: 'partner.073',
    benefits: [
      ['partner.075', 'partner.076'],
      ['partner.077', 'partner.078'],
      ['partner.079', 'partner.080'],
      ['partner.028', 'partner.081'],
    ],
    asks: ['partner.083', 'partner.084', 'partner.085'],
    formTitle: 'partner.086',
  },
  sourcing: {
    eyebrow: 'partner.099',
    heading: 'partner.100',
    lead: 'partner.101',
    benefits: [
      ['partner.102', 'partner.103'],
      ['partner.104', 'partner.105'],
      ['partner.106', 'partner.107'],
      ['partner.108', 'partner.109'],
    ],
    asks: ['partner.110', 'partner.111', 'partner.112'],
    formTitle: 'partner.113',
  },
  institute: {
    eyebrow: 'partner.119',
    heading: 'partner.120',
    lead: 'partner.121',
    benefits: [
      ['partner.122', 'partner.123'],
      ['partner.124', 'partner.125'],
      ['partner.126', 'partner.127'],
      ['partner.128', 'partner.129'],
    ],
    asks: ['partner.130', 'partner.131', 'partner.132'],
    formTitle: 'partner.133',
  },
};

/** The package's field labels, passed to `Field` as `label` (W115). Fields not listed here
 *  (`candidatesPerYear`, the institute's `city`) take `sys.form.labels.<name>`. */
export const FIELD_LABELS = {
  hr: {
    company: 'partner.093',
    name: 'partner.094',
    city: 'partner.095',
    email: 'partner.096',
    phone: 'partner.097',
    message: 'partner.098',
  },
  sourcing: {
    company: 'partner.093',
    name: 'partner.094',
    country: 'partner.115',
    licence: 'partner.116',
    email: 'partner.117',
    phone: 'partner.097',
    trades: 'partner.118',
  },
  institute: {
    company: 'partner.134',
    name: 'partner.094',
    country: 'partner.115',
    email: 'partner.117',
    phone: 'partner.097',
    trades: 'partner.136',
  },
} as const;

/** The sourcing form's licence/no-fee declaration (legal — rendered verbatim). */
export const DECLARATION_ID = 'partner.114';

/** partner.140 carries `{replySlaHours}`; step 4's "Full access" pill is its `when`. */
export const PROCESS_IDS = {
  heading: 'partner.137',
  intro: 'partner.138',
  steps: [
    { n: 1, titleId: 'partner.139', bodyId: 'partner.140', whenId: null },
    { n: 2, titleId: 'partner.141', bodyId: 'partner.142', whenId: null },
    { n: 3, titleId: 'partner.143', bodyId: 'partner.144', whenId: null },
    { n: 4, titleId: 'partner.145', bodyId: 'partner.147', whenId: 'partner.146' },
  ],
} as const;

/** partner.159 is `{placed} placements` (W1). */
export const PORTAL_IDS = {
  eyebrow: 'partner.148',
  heading: 'partner.149',
  lead: 'partner.150',
  features: [
    ['partner.151', 'partner.152'],
    ['partner.153', 'partner.154'],
    ['partner.155', 'partner.156'],
    ['partner.157', 'partner.158'],
  ],
  claimLead: 'partner.159',
  claimTail: 'partner.160',
  mobileLine: 'partner.161',
  addressBar: 'partner.164',
  screenAlt: 'partner.165',
  mobileAlt: 'partner.166',
} as const;

export const FAQ_IDS = {
  eyebrow: 'partner.167',
  heading: 'partner.168',
  lead: 'partner.169',
  pairs: [
    ['partner.170', 'partner.171'],
    ['partner.172', 'partner.173'],
    ['partner.174', 'partner.175'],
    ['partner.176', 'partner.177'],
    ['partner.178', 'partner.179'],
    ['partner.180', 'partner.181'],
  ],
  askTitle: 'partner.182',
  askBody: 'partner.183',
  askWhatsApp: 'partner.184',
  askCall: 'partner.185',
  /** The ask card's e-mail row (W83 takes an id): the page's own "E-posta"/"Email" (delta 13). */
  askEmail: 'partner.117',
} as const;

/** partner.186 carries `{replySlaHours}`. */
export const CLOSING_IDS = {
  badge: 'partner.186',
  heading: 'partner.187',
  body: 'partner.188',
  primary: 'partner.189',
  legal: 'partner.190',
} as const;

/** The page record `pages.partner` names these; `generateMetadata` repeats them as fallbacks. */
export const SEO_IDS = { title: 'partner.222', description: 'partner.223' } as const;

const collect = (value: unknown, out: string[]): string[] => {
  if (typeof value === 'string') {
    if (/^partner\.\d{3}$/.test(value)) out.push(value);
  } else if (Array.isArray(value)) value.forEach((v) => collect(v, out));
  else if (value && typeof value === 'object')
    Object.values(value as Record<string, unknown>).forEach((v) => collect(v, out));
  return out;
};

/** Every package id the page resolves at render time, sorted and de-duplicated. */
export const PARTNER_PACKAGE_IDS: readonly string[] = [
  ...new Set(
    collect(
      [
        HERO_IDS,
        NETWORK_IDS,
        CHAIN_IDS,
        STICKY_IDS,
        TRACKS_IDS,
        PANEL_SHARED,
        PANEL_COPY,
        FIELD_LABELS,
        DECLARATION_ID,
        PROCESS_IDS,
        PORTAL_IDS,
        FAQ_IDS,
        CLOSING_IDS,
        SEO_IDS,
      ],
      [],
    ),
  ),
].sort();

/** `sys.partner.*` (W9/W23) — read on the server through `getTranslations('sys')`, never `t()`. */
export const PARTNER_SYS_KEYS = ['whatsapp.prefill', 'faq.whatsappText', 'faq.emailSubject'] as const;
```

`src/app/[locale]/(site)/partner-with-us/_lib/forms.ts` — pure (no `server-only`, no React): the Zod schemas and the catalog mappers, so the server actions stay one-liners and the wire is unit-tested. Server-side only by use (`actions.ts`, the server sections and tests import it; no client module does):

```ts
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';
import type { PartnerTrack } from './tracks';

/** The sourcing form's licence/no-fee declaration tick (partner.114): its own required
 *  checkbox beside the kernel's consent checkbox (W79). Not a catalog name — never sent. */
export const DECLARATION_FIELD = 'licenceDeclaration';

/** W3: the HR-agency track is a registered company in Türkiye (partner.083); `hire` takes an
 *  ISO-2 country, the design asks only for a city in Türkiye. */
export const HR_COUNTRY = 'TR';
export const HR_I_AM = 'hr_agency';

/** The Operations catalog caps (v1.0 + v1.1), so the door never answers 400 for a length; the
 *  inputs carry the same `maxLength`. */
export const CAPS = {
  name: 120,
  company: 200,
  email: 254,
  phone: 40,
  city: 120,
  licence: 200,
  candidatesPerYear: 20,
  trades: 500,
  message: 5000,
} as const;

// The kernel's vocabulary (src/forms/errors.ts): `.min(1)` first, so an empty value reads
// `required`, never `email`/`phone`/`invalid`; a FormErrorCode passed as `message` wins.
const PHONE = /(\D*\d){8,}/;
const ISO2 = /^[A-Z]{2}$/;
const required = (max: number) => z.string().trim().min(1).max(max);
const optional = (max: number) => z.string().trim().max(max).optional();
const email = z.string().trim().min(1).max(CAPS.email).email();
const phone = z.string().trim().min(1).max(CAPS.phone).regex(PHONE, { message: 'phone' });
/** The `<select>` posts an ISO-2 code (W3/W25); free text would be a door 400. */
const country = z.string().trim().toUpperCase().min(1).regex(ISO2, { message: 'invalid' });

export const hrAgencySchema = z.object({
  company: required(CAPS.company),
  name: required(CAPS.name),
  city: required(CAPS.city),
  email,
  phone,
  message: optional(CAPS.message),
});
export type HrAgencyInput = z.infer<typeof hrAgencySchema>;

export const sourcingSchema = z.object({
  company: required(CAPS.company),
  name: required(CAPS.name),
  country,
  licence: required(CAPS.licence),
  email,
  phone,
  candidatesPerYear: optional(CAPS.candidatesPerYear),
  trades: optional(CAPS.trades),
  // An unticked checkbox posts nothing → `undefined` → the literal's `required` message.
  [DECLARATION_FIELD]: z.literal('on', { message: 'required' }),
});
export type SourcingInput = z.infer<typeof sourcingSchema>;

export const instituteSchema = z.object({
  company: required(CAPS.company),
  name: required(CAPS.name),
  city: optional(CAPS.city),
  country,
  email,
  phone,
  candidatesPerYear: optional(CAPS.candidatesPerYear),
  trades: optional(CAPS.trades),
});
export type InstituteInput = z.infer<typeof instituteSchema>;

// Wire names = the catalog's, exactly (docs/INTEGRATIONS.md I4). Blank optionals map to '',
// which `buildEnvelope` drops.

/** → `hire` (W3): lands with the Turkey sales team as HR_AGENCY — the `partner` key would
 *  classify it SOURCING_PARTNER and route it to the Pakistan team. */
export function hrAgencyToFields(p: HrAgencyInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: HR_COUNTRY,
    iAm: HR_I_AM,
    city: p.city,
    message: p.message ?? '',
  };
}

const partnerTrack = (track: PartnerTrack) => track;

/** → `partner` + `track: 'sourcing'` (W16; inbox tag `[website:partner:sourcing]`). */
export function sourcingToFields(p: SourcingInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: partnerTrack('sourcing'),
    licence: p.licence,
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}

/** → `partner` + `track: 'institute'` (W16; classification stays SOURCING_PARTNER, the track
 *  rides in the inbox tag `[website:partner:institute]`). */
export function instituteToFields(p: InstituteInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: p.country,
    track: partnerTrack('institute'),
    city: p.city ?? '',
    candidatesPerYear: p.candidatesPerYear ?? '',
    trades: p.trades ?? '',
  };
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/country-options.ts`:

```ts
import type { FieldOption } from '@/forms/client/Field';
import type { Locale } from '@/i18n/routing';

type CountryRow = { code: string; name: string };

/** The ISO-2 `<select>` options (W3/W25): the source countries first, in the collection's
 *  order (the partners this page courts), then every other row of the general list sorted by
 *  its locale name with that locale's collation (Turkish: C < Ç, I < İ). Values are the
 *  upper-case codes the door validates; labels are the collection's locale-resolved names —
 *  data, not copy. A type-only import from the client `Field` module: nothing reaches the
 *  client from here. */
export function countryOptions(
  source: readonly CountryRow[],
  general: readonly CountryRow[],
  locale: Locale,
): FieldOption[] {
  const seen = new Set<string>();
  const take = (rows: readonly CountryRow[]): FieldOption[] => {
    const out: FieldOption[] = [];
    for (const row of rows) {
      if (seen.has(row.code)) continue; // a source country in the general list appears once
      seen.add(row.code);
      out.push({ value: row.code, label: row.name });
    }
    return out;
  };
  const head = take(source);
  const collator = new Intl.Collator(locale);
  const tail = take(general).sort((a, b) => collator.compare(a.label, b.label));
  return [...head, ...tail];
}
```

`src/app/[locale]/(site)/partner-with-us/_lib/logos.ts`:

```ts
import type { Logo } from '@/design/blocks/LogoMarquee';

/** §10 #11: partner logos arrive in v1.1 with written consent. Empty in Phase A, so the logo
 *  band — and its "25+ partner companies" caption, an unsigned figure (W1) — renders nothing
 *  (W6). Add consented files under `public/brand/logos/` here, never hot-linked (W14). */
export const PARTNER_LOGOS: readonly Logo[] = [];
```

`src/messages/tr.json` — inside `"sys"`, add `"partner"` as the last key of the object (after whatever sibling T1–T4 left last — object order is not significant; `messages.test.ts` checks key-set parity; put a comma after the preceding sibling's closing brace):

```json
    "partner": {
      "whatsapp": {
        "prefill": "Merhaba JobsAdmire, bir iş ortaklığı hakkında görüşmek istiyorum."
      },
      "faq": {
        "whatsappText": "Merhaba JobsAdmire, iş ortaklığıyla ilgili bir sorum var.",
        "emailSubject": "İş ortaklığı sorusu"
      }
    }
```

`src/messages/en.json` — the same position:

```json
    "partner": {
      "whatsapp": {
        "prefill": "Hello JobsAdmire, I would like to discuss a partnership."
      },
      "faq": {
        "whatsappText": "Hello JobsAdmire, I have a partnership question.",
        "emailSubject": "Partnership question"
      }
    }
```

(The prefills are the visitor's first-person singular — the design's own EN wording — addressed to "JobsAdmire"; nothing speaks for the company as "we"/"biz", so `voice.test.ts`, which scans all of `sys.*`, stays green without an exception entry — W154.)

`docs/CONTENT-MODEL.md` — in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (the list T1 created, whose lead sentence begins "**Per-page `sys.*` copy (WP2b, W98).**"), append after its last bullet:

```markdown
- **Partner With Us (`sys.partner.*`, WP2b T5):** `whatsapp.prefill` (the hero's and the sticky bar's WhatsApp prefill), `faq.whatsappText` (the FAQ ask card's WhatsApp prefill) — both in the visitor's first-person singular like `sys.whatsapp.prefill`, static text, never visitor data (W95) — and `faq.emailSubject` (the ask card's `mailto:` subject). No `sys.seo.partner.*` (the page record carries `partner.222`/`223`); no country list (the ISO-2 select reads the `sourceCountries` + `countries` collections, W25); the track radiogroup's name is `partner.064` and the ask card's e-mail label `partner.117` (W83 takes an id); the consent sentence is the kernel's `sys.form.consent.*`, never `partner.090`/`091` (W79). Every other string is a `partner.*` id through `makeTf` (`partner.059`/`077` re-authored by W87). No client module reads `sys.partner` — the chooser island and the forms receive resolved strings — so `CLIENT_SYS` is unchanged (W148).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the four new files green (`tracks` 4, `content` 6, `forms` 12, `country-options` 3); `src/messages/messages.test.ts` (key-set parity) and `voice.test.ts` green; everything else unchanged.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
git commit -m "feat(partner): track keys, package-id table, track schemas → hire/partner catalog fields, ISO-2 country options, sys.partner copy (T5 c1)

HR-agency track → hire + iAm hr_agency + country TR (W3); sourcing/institute → partner + track
(W16) with the licence declaration as its own required tick (W79); countries from the W25
collections, source countries first; W87 spellings and the 162-id table pinned to both bundles.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the three server actions and the `hire`/`partner` wire contract (Vitest, door stubbed)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/partner-with-us/__tests__/actions.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitHrAgency, submitInstitute, submitSourcingPartner } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92)
// unless a case says otherwise.
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
}));

vi.mock('next-intl/server', () => ({ getLocale: mocks.getLocale }));
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));

/** The Operations catalog names (v1.0 + v1.1 `city`/`track`, W16) — anything else is dropped. */
const HIRE_CATALOG = [
  'name',
  'company',
  'email',
  'phone',
  'country',
  'iAm',
  'sector',
  'roleNeeded',
  'headcount',
  'startWhen',
  'message',
  'city',
];
const PARTNER_CATALOG = [
  'name',
  'company',
  'email',
  'phone',
  'country',
  'candidatesPerYear',
  'trades',
  'licence',
  'message',
  'city',
  'track',
];

type Envelope = {
  locale: string;
  consentVersion: string;
  sourcePath?: string;
  fields: Record<string, string>;
};
function sent(): { key: string; envelope: Envelope } {
  expect(mocks.postForm).toHaveBeenCalledTimes(1);
  const [key, envelope] = mocks.postForm.mock.calls[0] as [string, Envelope];
  return { key, envelope };
}

function formData(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

const ok = {
  kind: 'ok',
  id: 'sub_1',
  status: 'RECEIVED',
  isTest: false,
  replayed: false,
  captchaDegraded: false,
  error: null,
};

const hr = {
  company: 'Akdeniz İK A.Ş.',
  name: 'Ayşe Yılmaz',
  city: 'Antalya',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  message: '',
  consent: 'on',
  honeypot: '',
};
const sourcing = {
  company: 'Karachi Manpower Ltd',
  name: 'Bilal Khan',
  country: 'PK',
  licence: 'OEP-1234',
  email: 'bilal@example.com',
  phone: '+92 300 1234567',
  candidatesPerYear: '250',
  trades: 'Welders, electricians',
  licenceDeclaration: 'on',
  consent: 'on',
  honeypot: '',
};
const institute = {
  company: 'Lahore Technical Institute',
  name: 'Sara Ahmed',
  city: 'Lahore',
  country: 'PK',
  email: 'sara@example.com',
  phone: '+92 42 1234567',
  candidatesPerYear: '',
  trades: 'Plumbing, HVAC',
  consent: 'on',
  honeypot: '',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/ortak-olun');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitHrAgency — the HR-agency track → hire (W3)', () => {
  it('sends hire catalog names only: country TR, iAm hr_agency, city (W16); no door → the D11 state', async () => {
    const state = await submitHrAgency(IDLE_FORM_STATE, formData(hr));
    const { key, envelope } = sent();
    expect(key).toBe('hire');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/ortak-olun',
    });
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Akdeniz İK A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      country: 'TR',
      iAm: 'hr_agency',
      city: 'Antalya',
    });
    for (const name of Object.keys(envelope.fields)) expect(HIRE_CATALOG).toContain(name);
    // D11/W92: no door → the fallback panel state, the typed values echoed for its prefill.
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { company: 'Akdeniz İK A.Ş.', city: 'Antalya' },
    });
  });

  it('refuses a submit without the consent tick (W79) and posts nothing', async () => {
    const state = await submitHrAgency(IDLE_FORM_STATE, formData({ ...hr, consent: '' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('navigates to /thank-you?form=hire when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitHrAgency(IDLE_FORM_STATE, formData(hr))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'hire' } },
      locale: 'tr',
    });
  });
});

describe('submitSourcingPartner — the sourcing track → partner + track sourcing (W16)', () => {
  it('sends partner catalog names only, the ISO-2 country and track sourcing; never the declaration', async () => {
    await submitSourcingPartner(IDLE_FORM_STATE, formData(sourcing));
    const { key, envelope } = sent();
    expect(key).toBe('partner');
    expect(envelope.fields).toEqual({
      name: 'Bilal Khan',
      company: 'Karachi Manpower Ltd',
      email: 'bilal@example.com',
      phone: '+92 300 1234567',
      country: 'PK',
      track: 'sourcing',
      licence: 'OEP-1234',
      candidatesPerYear: '250',
      trades: 'Welders, electricians',
    });
    for (const name of Object.keys(envelope.fields)) expect(PARTNER_CATALOG).toContain(name);
  });

  it('refuses a submit without the declaration and the consent — two field errors, nothing posted', async () => {
    const state = await submitSourcingPartner(
      IDLE_FORM_STATE,
      formData({ ...sourcing, licenceDeclaration: '', consent: '' }),
    );
    expect(state).toMatchObject({
      status: 'fieldErrors',
      errors: { consent: 'consent', licenceDeclaration: 'invalid' },
    });
    const bare = { ...sourcing } as Record<string, string>;
    delete bare.licenceDeclaration;
    delete bare.consent;
    const state2 = await submitSourcingPartner(IDLE_FORM_STATE, formData(bare));
    expect(state2).toMatchObject({
      status: 'fieldErrors',
      errors: { consent: 'consent', licenceDeclaration: 'required' },
    });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });
});

describe('submitInstitute — the institute track → partner + track institute (W16)', () => {
  it('sends city and the ISO-2 country separately, track institute, in the request locale', async () => {
    mocks.getLocale.mockResolvedValue('en');
    mocks.headersStore.set('referer', 'https://www.jobsadmire.com/en/partner-with-us');
    await submitInstitute(IDLE_FORM_STATE, formData(institute));
    const { key, envelope } = sent();
    expect(key).toBe('partner');
    expect(envelope).toMatchObject({ locale: 'en', sourcePath: '/en/partner-with-us' });
    expect(envelope.fields).toEqual({
      name: 'Sara Ahmed',
      company: 'Lahore Technical Institute',
      email: 'sara@example.com',
      phone: '+92 42 1234567',
      country: 'PK',
      track: 'institute',
      city: 'Lahore',
      trades: 'Plumbing, HVAC',
    });
    for (const name of Object.keys(envelope.fields)) expect(PARTNER_CATALOG).toContain(name);
  });

  it('navigates to /thank-you?form=partner when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitInstitute(IDLE_FORM_STATE, formData(institute))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'partner' } },
      locale: 'tr',
    });
  });
});
```

(An unticked checkbox posts nothing — `bare` above — so the schema sees `undefined` → `required`; a present-but-empty value `''` is not the literal `'on'` → `invalid`. The kernel's own consent check answers `consent` either way. The page's checkbox never posts `''`; the first half of that case only proves the literal refuses anything but `'on'`.)

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 partner-with-us/__tests__
```
Expected: FAIL — `Failed to resolve import "../actions"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/actions.ts`:

```ts
'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import {
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from './_lib/forms';

/** HR-agency track → `hire` + `iAm: 'hr_agency'` (W3): the Turkey sales team's inquiry. W79: a
 *  consent checkbox like every door form. Success → `/thank-you?form=hire` (D13). */
const runHrAgency = createFormAction({
  key: 'hire',
  schema: hrAgencySchema,
  consent: 'checkbox',
  toFields: (p) => hrAgencyToFields(p),
});

/** Sourcing-partner track → `partner` + `track: 'sourcing'` (W16); the declaration tick is the
 *  schema's, the consent tick the kernel's. */
const runSourcing = createFormAction({
  key: 'partner',
  schema: sourcingSchema,
  consent: 'checkbox',
  toFields: (p) => sourcingToFields(p),
});

/** Institute track → `partner` + `track: 'institute'` (W16). */
const runInstitute = createFormAction({
  key: 'partner',
  schema: instituteSchema,
  consent: 'checkbox',
  toFields: (p) => instituteToFields(p),
});

export async function submitHrAgency(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runHrAgency(prev, data);
}

export async function submitSourcingPartner(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runSourcing(prev, data);
}

export async function submitInstitute(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runInstitute(prev, data);
}
```

A `'use server'` module may export only async functions: the three factories stay module-private constants.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us/actions.ts" "src/app/[locale]/(site)/partner-with-us/__tests__"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `actions.test.ts` 7/7 green; everything else unchanged.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/actions.ts" "src/app/[locale]/(site)/partner-with-us/__tests__"
git commit -m "feat(partner): HR-agency (hire), sourcing and institute (partner) server actions on the forms kernel (T5 c2)

Consent checkbox on all three (W79); catalog names only on the wire incl. v1.1 city/track (W16);
the unit test pins the envelopes, the declaration + consent refusals, the door-less unauthorized
fallback (W92) and the /thank-you?form=hire|partner navigation (D13).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the client pieces: the licence declaration checkbox and the track-chooser island (W96)

The page's only `'use client'` modules. Both render real platform controls (a checkbox; native radios in a `fieldset role="radiogroup"`, the pattern `RadioChips` ships — `RadioChipOption = { value, label }` cannot carry the design's icon/body/CTA card, and the reconcile ruled the page-local native-radio cards acceptable), receive every string resolved from the server (no `useTranslations('sys')` of their own → no `CLIENT_SYS` change, W148), and import nothing but by-path modules (W147/W156).

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/partner-with-us/_components/__tests__/DeclarationCheckbox.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormErrorsContext, type FormErrorsValue } from '@/forms/client/FormErrorsContext';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { DeclarationCheckbox } from '../DeclarationCheckbox';

const LABEL =
  'Geçerli bir lisansa sahip olduğumuzu ve adaylardan asla ücret almadığımızı beyan ederiz.';
/** What `FormShell` provides: the action's codes and echoed values, `register`, the id scope. */
const inShell = (value: Partial<FormErrorsValue>) => (
  <FormErrorsContext.Provider
    value={{ errors: {}, values: {}, idScope: 'partner-sourcing', ...value }}
  >
    <DeclarationCheckbox name="licenceDeclaration" label={LABEL} />
  </FormErrorsContext.Provider>
);

describe('DeclarationCheckbox', () => {
  it('is an unticked required checkbox named after the schema field, scoped like the kernel fields', () => {
    renderWithIntl(inShell({}));
    const box = screen.getByRole('checkbox', { name: LABEL });
    expect(box).toHaveAttribute('name', 'licenceDeclaration');
    expect(box).toHaveAttribute('id', 'f-partner-sourcing-licenceDeclaration');
    expect(box).toBeRequired();
    expect(box).not.toBeChecked();
    expect(box).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders the action error code as the copy of the locale and marks the box invalid', () => {
    renderWithIntl(inShell({ errors: { licenceDeclaration: 'required' } }));
    const box = screen.getByRole('checkbox', { name: LABEL });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAttribute('aria-describedby', 'f-partner-sourcing-licenceDeclaration-error');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(tr.sys.form.errors.required);
    expect(alert).toHaveAttribute('id', 'f-partner-sourcing-licenceDeclaration-error');
  });

  it('stays ticked after a failed submit on another field (the echoed value)', () => {
    renderWithIntl(inShell({ errors: { email: 'email' }, values: { licenceDeclaration: 'on' } }));
    expect(screen.getByRole('checkbox', { name: LABEL })).toBeChecked();
  });

  it('registers its name with the shell, so the form-level alert never repeats its error', () => {
    const unregister = vi.fn();
    const register = vi.fn(() => unregister);
    const { unmount } = renderWithIntl(inShell({ register }));
    expect(register).toHaveBeenCalledWith('licenceDeclaration');
    unmount();
    expect(unregister).toHaveBeenCalled();
  });
});
```

`src/app/[locale]/(site)/partner-with-us/_components/__tests__/TrackChooser.test.tsx`:

```tsx
import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { TrackChooser, type TrackCard } from '../TrackChooser';

// R35: the event's `page` is next/navigation's real pathname — steered here, the rest of the
// module kept (next-intl's own `useLocale` reads next/navigation too; vitest inlines next-intl).
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/ortak-olun',
}));

type Entry = Record<string, unknown>;
const layer = () => (window as unknown as { dataLayer?: Entry[] }).dataLayer ?? [];

const cards: TrackCard[] = [
  {
    key: 'hr',
    title: 'Türkiye’deki İK ajansları',
    body: 'Müşteriniz sizde kalır.',
    cta: 'Nasıl işlediğini görün →',
  },
  {
    key: 'sourcing',
    title: 'Yurt dışındaki tedarik ortakları',
    body: 'Adaylarınızı bize gönderin.',
    cta: 'Nasıl işlediğini görün →',
  },
  {
    key: 'institute',
    title: 'Eğitim kurumları',
    body: 'Mezunlarınız yerleşsin.',
    cta: 'Nasıl işlediğini görün →',
  },
];
const panels = {
  hr: <div data-testid="panel-hr" />,
  sourcing: <div data-testid="panel-sourcing" />,
  institute: <div data-testid="panel-institute" />,
};
const props = { legend: 'Hangisi sizi tanımlıyor?', applyLabel: 'Başvurunuz', cards, panels };
const radio = (name: string) => screen.getByRole('radio', { name });

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
  window.history.replaceState(null, '', '/ortak-olun');
});

describe('TrackChooser (W26/W96)', () => {
  it('is one labelled radiogroup of three native radios named by the card titles, HR by default', () => {
    renderWithIntl(<TrackChooser {...props} />);
    const group = screen.getByRole('radiogroup', { name: 'Hangisi sizi tanımlıyor?' });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('id'))).toEqual([
      'track-hr',
      'track-sourcing',
      'track-institute',
    ]);
    expect(radio('Türkiye’deki İK ajansları')).toBeChecked();
    expect(radio('Türkiye’deki İK ajansları')).toHaveAccessibleDescription('Müşteriniz sizde kalır.');
    expect(screen.getByTestId('panel-hr')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-sourcing')).toBeNull();
    const detail = screen.getByTestId('partner-track-detail');
    expect(detail).toHaveAttribute('id', 'track-detail');
    expect(detail).toHaveAttribute('data-track', 'hr');
    expect(layer()).toEqual([]);
  });

  it('choosing sourcing shows only its panel, fires partner_track_select once and writes the hash', async () => {
    renderWithIntl(<TrackChooser {...props} />);
    await userEvent.click(radio('Yurt dışındaki tedarik ortakları'));
    expect(radio('Yurt dışındaki tedarik ortakları')).toBeChecked();
    expect(screen.getByTestId('panel-sourcing')).toBeInTheDocument();
    expect(screen.queryByTestId('panel-hr')).toBeNull();
    expect(layer()).toEqual([
      { event: 'partner_track_select', page: '/ortak-olun', locale: 'tr', track: 'sourcing' },
    ]);
    expect(window.location.hash).toBe('#track-sourcing');
  });

  it('choosing the HR card fires nothing — the default panel is not a signal (W67)', async () => {
    renderWithIntl(<TrackChooser {...props} />);
    await userEvent.click(radio('Eğitim kurumları'));
    await userEvent.click(radio('Türkiye’deki İK ajansları'));
    expect(layer().map((e) => e.track)).toEqual(['institute']);
    expect(screen.getByTestId('panel-hr')).toBeInTheDocument();
    expect(window.location.hash).toBe('#track-hr');
  });

  it('remounts the panel on a switch — a typed value never leaks into another track form', async () => {
    renderWithIntl(
      <TrackChooser
        {...props}
        panels={{
          hr: <input aria-label="company" />,
          sourcing: <input aria-label="company" />,
          institute: <div />,
        }}
      />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'company' }), 'Akdeniz');
    await userEvent.click(radio('Yurt dışındaki tedarik ortakları'));
    expect(screen.getByRole('textbox', { name: 'company' })).toHaveValue('');
  });

  it('a #track-institute deep link preselects the institute on mount, without an event', () => {
    window.history.replaceState(null, '', '/ortak-olun#track-institute');
    renderWithIntl(<TrackChooser {...props} />);
    expect(radio('Eğitim kurumları')).toBeChecked();
    expect(screen.getByTestId('panel-institute')).toBeInTheDocument();
    expect(layer()).toEqual([]);
  });

  it('follows a later hash change until the visitor chooses; then the choice wins', async () => {
    renderWithIntl(<TrackChooser {...props} />);
    act(() => {
      window.history.replaceState(null, '', '/ortak-olun#track-sourcing');
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(radio('Yurt dışındaki tedarik ortakları')).toBeChecked();
    await userEvent.click(radio('Eğitim kurumları'));
    act(() => {
      window.history.replaceState(null, '', '/ortak-olun#tracks'); // e.g. the header CTA
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(radio('Eğitim kurumları')).toBeChecked();
    expect(screen.getByTestId('panel-institute')).toBeInTheDocument();
  });

  it('shows the two step wayfinders on phones only (W10: CSS, not conditional rendering)', () => {
    const { container } = renderWithIntl(<TrackChooser {...props} />);
    const legend = container.querySelector('legend');
    expect(legend).toHaveTextContent('Hangisi sizi tanımlıyor?');
    expect(legend?.className.split(/\s+/)).toContain('md:sr-only');
    expect(screen.getByText('Başvurunuz').className.split(/\s+/)).toContain('md:hidden');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 partner-with-us/_components
```
Expected: FAIL — `Failed to resolve import "../DeclarationCheckbox"` and `"../TrackChooser"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_components/icons.tsx` — no directive (inline SVG, no hooks; the island and the server hero both import it):

```tsx
import type { TrackKey } from '../_lib/tracks';

// W14: inline glyphs lifted from the design, never hot-linked images. Decorative: the control
// or text beside each one carries the accessible name (D20).
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** The track cards' icons: a building (HR agencies), a globe (sourcing), a cap (institutes). */
export function TrackIcon({ track }: { track: TrackKey }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...STROKE}>
      {track === 'hr' && (
        <>
          <path d="M3 21V8l6-4 6 4v13" />
          <path d="M15 21V11l6 4v6" />
          <path d="M7 12h2" />
          <path d="M7 16h2" />
        </>
      )}
      {track === 'sourcing' && (
        <>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M2.5 12h19" />
          <path d="M12 2.5a15 15 0 0 1 0 19a15 15 0 0 1 0-19z" />
        </>
      )}
      {track === 'institute' && (
        <>
          <path d="M12 3L2 8l10 5 10-5-10-5z" />
          <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
        </>
      )}
    </svg>
  );
}

/** The hero's languages line. */
export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...STROKE}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/DeclarationCheckbox.tsx`:

```tsx
'use client';
import {
  useFieldError,
  useFieldId,
  useFieldValue,
  useRegisterField,
} from '@/forms/client/FormErrorsContext';

/**
 * The sourcing form's licence/no-fee declaration (partner.114, legal — rendered verbatim): a
 * second required checkbox beside the kernel's consent (W79), marked up exactly like the
 * kernel's consent row. Validated by the page schema (`z.literal('on')` → `required`), its id
 * scoped by the shell (`f-<idScope>-licenceDeclaration`), echoed after a failed submit, its
 * error text the locale's `sys.form.errors.*` copy through `useFieldError`; it registers with
 * the shell so the form-level alert does not list its error a second time.
 */
export function DeclarationCheckbox({ name, label }: { name: string; label: string }) {
  const id = useFieldId(name);
  const error = useFieldError(name);
  const ticked = useFieldValue(name) === 'on';
  useRegisterField(name);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-body-sm">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          defaultChecked={ticked}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-blue-safe"
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 text-body-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx`:

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Fragment, useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { track } from '@/analytics/track';
import {
  DEFAULT_TRACK,
  isPartnerTrack,
  trackFromHash,
  trackHash,
  type TrackKey,
} from '../_lib/tracks';
import { TrackIcon } from './icons';

export type TrackCard = { key: TrackKey; title: string; body: string; cta: string };

/** Per track: the selected border + 4 px halo (+ the pale ground the design gives the chosen
 *  row on phones), the icon tile and the CTA line — the design's #1899D5 / #16a34a / #35468a
 *  accents; every text colour on white is AA (D20). */
const ACCENT: Record<TrackKey, { on: string; icon: string; cta: string }> = {
  hr: {
    on: 'border-blue ring-4 ring-tint max-md:bg-pale-1',
    icon: 'bg-tint text-blue',
    cta: 'text-blue-safe',
  },
  sourcing: {
    on: 'border-success ring-4 ring-success-surface max-md:bg-pale-1',
    icon: 'bg-success-surface text-success',
    cta: 'text-success-text',
  },
  institute: {
    on: 'border-[#35468a] ring-4 ring-[#edf1f9] max-md:bg-pale-1',
    icon: 'bg-[#edf1f9] text-[#35468a]',
    cta: 'text-[#35468a]',
  },
};
const OFF = 'border-border-2 hover:border-tint-border';
const CARD =
  'flex h-full cursor-pointer flex-col rounded-lg border-[1.5px] bg-white p-7 shadow-[0_8px_24px_rgba(22,60,90,0.06)] transition-[border-color,box-shadow] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe max-md:p-4';
const ICON_BOX =
  'mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-sm max-md:mb-3 max-md:h-10 max-md:w-10';
const WAYFINDER =
  'm-0 mb-3 flex items-center gap-2 text-body-sm font-extrabold uppercase tracking-[1.1px] text-text-tertiary';

function subscribeHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
const hashTrack = () => trackFromHash(window.location.hash);
const noHashOnServer = () => null;

/** The design's phone-only step bubble ("1 Who are you?", "2 Your application"). */
function Step({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-pill bg-ink text-[11.5px] tracking-normal text-white"
    >
      {n}
    </span>
  );
}

/**
 * "Three ways to partner" (W96: a plain client component — above the fold, server-renders the
 * HR panel; its own gzipped chunk ≤ 6 KB): a radiogroup of card radios and, under
 * `#track-detail`, exactly ONE of the three server-rendered panels (the design's `sc-if`). The
 * panel is keyed by track, so switching remounts the form — no typed value and no fallback
 * state crosses from one track's form to another's. State: the visitor's choice → a
 * `#track-<key>` deep link → the HR default. The fragment is read through
 * `useSyncExternalStore` with a `null` server snapshot (R18), so the server and the hydrating
 * client both render the HR panel and no state is set in an effect. `partner_track_select`
 * fires for the two `partner` tracks only (W67: the enum is `sourcing | institute`); a choice
 * is mirrored into the URL with `replaceState` (no history entry, no scroll), and the page is
 * never scrolled on a choice — the arrow keys move a radio group (D20).
 */
export function TrackChooser({
  legend,
  applyLabel,
  cards,
  panels,
}: {
  /** partner.064 — the radiogroup's name, shown as step 1 on phones */
  legend: string;
  /** partner.070 — step 2 on phones */
  applyLabel: string;
  cards: TrackCard[];
  panels: Record<TrackKey, ReactNode>;
}) {
  const legendId = useId();
  const locale = useLocale();
  const page = usePathname() ?? '/'; // next/navigation: the real URL (R35)
  const fromHash = useSyncExternalStore(subscribeHash, hashTrack, noHashOnServer);
  const [chosen, setChosen] = useState<TrackKey | null>(null);
  const current = chosen ?? fromHash ?? DEFAULT_TRACK;

  const choose = (key: TrackKey) => {
    setChosen(key);
    // Next keeps its router state in `history.state`; handing it back unchanged keeps
    // back/forward intact while only the fragment changes.
    window.history.replaceState(window.history.state, '', trackHash(key));
    if (isPartnerTrack(key)) track('partner_track_select', { page, locale, track: key });
  };

  return (
    <div>
      <fieldset
        role="radiogroup"
        aria-labelledby={legendId}
        data-testid="partner-track-chooser"
        className="m-0 min-w-0 border-0 p-0"
      >
        <legend id={legendId} className={`${WAYFINDER} p-0 md:sr-only`}>
          <Step n={1} />
          {legend}
        </legend>
        <div className="grid gap-3 md:gap-6 lg:grid-cols-3">
          {cards.map((card) => {
            const on = card.key === current;
            const accent = ACCENT[card.key];
            const id = `track-${card.key}`;
            return (
              <div key={card.key} className="relative">
                <input
                  type="radio"
                  id={id}
                  name="partner-track"
                  value={card.key}
                  checked={on}
                  onChange={() => choose(card.key)}
                  aria-labelledby={`${id}-title`}
                  aria-describedby={`${id}-body`}
                  className="peer sr-only scroll-mt-28"
                />
                <label htmlFor={id} className={`${CARD} ${on ? accent.on : OFF}`}>
                  <span aria-hidden="true" className={`${ICON_BOX} ${accent.icon}`}>
                    <TrackIcon track={card.key} />
                  </span>
                  <span id={`${id}-title`} className="block text-card-title font-extrabold text-ink">
                    {card.title}
                  </span>
                  <span
                    id={`${id}-body`}
                    className="mt-2 block flex-1 text-body-sm text-text-secondary max-md:line-clamp-2"
                  >
                    {card.body}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-4 block text-body-sm font-extrabold max-md:hidden ${accent.cta}`}
                  >
                    {card.cta}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <div
        id="track-detail"
        data-testid="partner-track-detail"
        data-track={current}
        className="mt-8 scroll-mt-24 md:mt-10"
      >
        <p className={`${WAYFINDER} md:hidden`}>
          <Step n={2} />
          {applyLabel}
        </p>
        <Fragment key={current}>{panels[current]}</Fragment>
      </div>
    </div>
  );
}
```

Notes for the implementer:
- The radio's accessible name is its card title (`aria-labelledby`) and its description the card body (`aria-describedby`); the whole card is its `<label>`, so a click anywhere selects it; the "See how it works →" line is `aria-hidden` (it repeats the radio's action). No heading inside the label (a heading is not phrasing content) — the card title is a `span` with the card-title face.
- `sr-only` keeps the radio focusable and in the tab order; the focus ring is drawn on the card through `peer-focus-visible:*`, exactly as `RadioChips` does. The `relative` wrapper keeps the absolutely positioned radio inside its card, and `scroll-mt-28` lands a `#track-<key>` deep link below the sticky header.
- `ring-4 ring-<colour>` is the design's `box-shadow: 0 0 0 4px` halo; the class scan maps no ring utility, and none collides with the card's own `shadow-[…]` (a separate CSS variable in Tailwind 4).

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us/_components"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `DeclarationCheckbox.test.tsx` 4/4 and `TrackChooser.test.tsx` 7/7 green; `class-collisions.test.ts` (it walks `src/app/**`: `ACCENT`/`CARD`/`ICON_BOX`/`WAYFINDER` compositions), `client-imports.test.ts` (the two client modules reach no barrel and no message file) and `client-messages.test.ts` (no `sys(…)` read in either module) stay green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/_components"
git commit -m "feat(partner): track-chooser island (native radio cards, partner_track_select, #track-<key> deep links) and the licence declaration checkbox (T5 c3)

W96: a plain client component with one keyed panel; W26/W67: only sourcing|institute fire the
event, the HR default and deep links never do; W79: the declaration is a second required tick
wired to the kernel's field context; W148: both receive resolved strings (no CLIENT_SYS change).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the presentational sections: hero + network card, logos, chain, process, portal, FAQ, closing

Every section is a server component (no directive, no async) that receives the page's `tf` (`makeTf(bundle, locale)`), the metric values or the settings it needs as props, so it renders under jsdom with the real LOCAL bundle; the page (Cycle 6) does the async work. Every import is by module path; every class string obeys W119/W122/W155 (the static scan `class-collisions.test.ts` walks these files in Step 4); `ImageSlot` gets no width/height/aspect/object class (W129); no colour/display/width class reaches `Button`/`ContactCta` (W122) — the hero's phone-width CTA stack is the wrapper's `max-md:grid`, not a class on the buttons.

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/partner-with-us/_sections/__tests__/sections.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { makeTf, metricValues } from '@/content/pure';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { PARTNER_LOGOS } from '../../_lib/logos';
import { Chain } from '../Chain';
import { Closing } from '../Closing';
import { Faq } from '../Faq';
import { Hero } from '../Hero';
import { Logos } from '../Logos';
import { NetworkCard } from '../NetworkCard';
import { Portal } from '../Portal';
import { Process } from '../Process';

// The real LOCAL bundles read from disk (the sanctioned test bypass: D23 governs how the running
// site loads a bundle, never a test fixture read) — the sections render the package's own copy.
const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
const TR = load('tr');
const EN = load('en');
const tfTr = makeTf(TR, 'tr');
const tfEn = makeTf(EN, 'en');
const WA = 'https://wa.me/905011240340';
const tokens = (el: Element | null) => (el?.getAttribute('class') ?? '').split(/\s+/);
const heroWhatsApp = `${WA}?text=${encodeURIComponent(tr.sys.partner.whatsapp.prefill)}`;
const hero = (
  <Hero locale="tr" tf={tfTr} metrics={metricValues(TR, 'tr')} whatsappHref={heroWhatsApp} />
);

describe('Hero', () => {
  it('holds the one page-h1 as the LCP slot, this page own crumbs (W109) and no photo slot (§10 #4)', () => {
    const { container } = renderWithIntl(hero);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1).toHaveTextContent(tfTr('partner.023'));
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    const crumbs = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(crumbs).getByRole('link', { name: 'Ana Sayfa' })).toHaveAttribute('href', '/');
    expect(within(crumbs).getByText('İş Ortağı Olun')).toHaveAttribute('aria-current', 'page');
  });

  it('renders both lead variants with CSS visibility (W10/W119) and the two ticks', () => {
    renderWithIntl(hero);
    expect(tokens(screen.getByText(tfTr('partner.024')))).toContain('max-md:hidden');
    expect(tokens(screen.getByText(tfTr('partner.025')))).toContain('md:hidden');
    for (const id of ['partner.026', 'partner.028'])
      expect(screen.getByText(tfTr(id)).tagName).toBe('STRONG');
  });

  it('links to #tracks and to WhatsApp with the static partnership prefill only (W95)', () => {
    renderWithIntl(hero);
    expect(screen.getByRole('link', { name: tfTr('partner.030') })).toHaveAttribute(
      'href',
      '#tracks',
    );
    const wa = screen.getByRole('link', { name: tfTr('partner.031') });
    expect(wa).toHaveAttribute('href', heroWhatsApp);
    expect(wa).toHaveAttribute('target', '_blank');
  });
});

describe('NetworkCard (W1)', () => {
  it('renders only the two signed rows — 13 source countries, 470+ placed — with desk/phone labels', () => {
    renderWithIntl(<NetworkCard tf={tfTr} metrics={metricValues(TR, 'tr')} />);
    const card = screen.getByTestId('partner-network');
    const rows = within(card).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('13');
    expect(rows[1]).toHaveTextContent('470+');
    expect(tokens(within(card).getByText(tfTr('partner.041')))).toContain('max-md:hidden');
    expect(tokens(within(card).getByText(tfTr('partner.042')))).toContain('md:hidden');
    expect(card).not.toHaveTextContent(tfTr('partner.037'));
    expect(card).not.toHaveTextContent(tfTr('partner.039'));
  });

  it('drops a row whose metric is unsigned (empty) — never a hard-typed number', () => {
    renderWithIntl(<NetworkCard tf={tfTr} metrics={{ countries: '13', placed: '' }} />);
    expect(within(screen.getByTestId('partner-network')).getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('Logos (W6)', () => {
  it('renders nothing, not even its band, while no consented logo exists', () => {
    expect(PARTNER_LOGOS).toEqual([]);
    const { container } = renderWithIntl(<Logos logos={PARTNER_LOGOS} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Chain', () => {
  it('composes the split sentence around the typed Hire Workers link (W23) and renders three nodes', () => {
    renderWithIntl(<Chain tf={tfTr} />);
    const chain = screen.getByTestId('partner-chain');
    const link = within(chain).getByRole('link', { name: 'İşçi Talebi' });
    expect(link).toHaveAttribute('href', '/isci-talebi');
    expect(tokens(link)).toContain('underline');
    expect(link.closest('p')).toHaveTextContent(
      `${tfTr('partner.048')} İşçi Talebi ${tfTr('partner.049')}`,
    );
    for (const id of ['partner.051', 'partner.054', 'partner.057'])
      expect(within(chain).getByText(tfTr(id))).toBeInTheDocument();
    const arrows = within(chain).getAllByText('→');
    expect(arrows).toHaveLength(2);
    for (const arrow of arrows) {
      expect(arrow).toHaveAttribute('aria-hidden', 'true');
      expect(tokens(arrow)).toContain('max-lg:hidden');
    }
  });

  it('links the English route under /en', () => {
    renderWithIntl(<Chain tf={tfEn} />, { locale: 'en' });
    expect(screen.getByRole('link', { name: 'Hire Workers' })).toHaveAttribute(
      'href',
      '/en/hire-workers',
    );
  });
});

describe('Process', () => {
  it('is the four steps in order, step 4 with the Full access pill, the reply SLA filled (D17)', () => {
    renderWithIntl(<Process bundle={TR} locale="tr" tf={tfTr} />);
    const list = screen.getByTestId('partner-process').querySelector('ol#how-it-starts');
    expect(list).not.toBeNull();
    const steps = within(list as HTMLElement).getAllByRole('listitem');
    expect(steps.map((s) => within(s).getByRole('heading', { level: 3 }).textContent)).toEqual(
      ['partner.139', 'partner.141', 'partner.143', 'partner.145'].map(tfTr),
    );
    expect(steps[3]).toHaveTextContent(tfTr('partner.146'));
    expect(steps[0]).toHaveTextContent('4 iş saati');
  });
});

describe('Portal', () => {
  it('shows the Android badge only (W8), the {placed} claim (W1) and two named screenshot placeholders (W55)', () => {
    const { container } = renderWithIntl(
      <Portal bundle={TR} locale="tr" tf={tfTr} androidUrl={TR.settings.storeLinks.android} />,
    );
    const portal = screen.getByTestId('partner-portal');
    expect(within(portal).getByRole('link', { name: /Google Play/ })).toHaveAttribute(
      'href',
      TR.settings.storeLinks.android ?? '',
    );
    expect(within(portal).queryByRole('link', { name: /App Store/ })).toBeNull();
    expect(portal).toHaveTextContent('470+ yerleştirme');
    expect(
      [...container.querySelectorAll('[data-placeholder]')].map((el) =>
        el.getAttribute('data-placeholder'),
      ),
    ).toEqual(['partner-portal-screen', 'partner-portal-mobile']);
    expect(container.querySelector('[data-lcp-slot]')).toBeNull();
    const phone = container.querySelector('[data-placeholder="partner-portal-mobile"]');
    expect(tokens(phone?.parentElement ?? null)).toContain('max-md:hidden');
  });
});

describe('Faq', () => {
  it('six pairs with the first open, one FAQPage node, and WhatsApp / call / e-mail ask rows (W83)', () => {
    const { container } = renderWithIntl(
      <Faq
        bundle={TR}
        locale="tr"
        tf={tfTr}
        whatsappNumber="905011240340"
        whatsappText={tr.sys.partner.faq.whatsappText}
        phone="+905011240340"
        email="info@jobsadmire.com"
        emailSubject={tr.sys.partner.faq.emailSubject}
      />,
    );
    const faq = screen.getByTestId('partner-faq');
    const triggers = within(faq).getAllByRole('button');
    expect(triggers).toHaveLength(6);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false');
    const nodes = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? '{}') as { '@type'?: string; mainEntity?: unknown[] },
    );
    const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faqNodes).toHaveLength(1);
    expect(faqNodes[0].mainEntity).toHaveLength(6);
    expect(within(faq).getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tr.sys.partner.faq.whatsappText)}`,
    );
    expect(within(faq).getByRole('link', { name: 'Bizi arayın' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(within(faq).getByRole('link', { name: 'E-posta' })).toHaveAttribute(
      'href',
      `mailto:info@jobsadmire.com?subject=${encodeURIComponent(tr.sys.partner.faq.emailSubject)}`,
    );
  });
});

describe('Closing', () => {
  it('is the dark band #closing with #tracks and phone CTAs, the reply badge on phones only, the legal e-mail', () => {
    const { container } = renderWithIntl(
      <Closing
        bundle={TR}
        locale="tr"
        tf={tfTr}
        phone="+905011240340"
        phoneDisplay="+90 501 124 03 40"
        email="info@jobsadmire.com"
      />,
    );
    const closing = screen.getByTestId('partner-closing');
    expect(container.querySelector('#closing')).not.toBeNull();
    expect(within(closing).getByRole('heading', { level: 2 })).toHaveTextContent(
      tfTr('partner.187'),
    );
    expect(within(closing).getByRole('link', { name: tfTr('partner.189') })).toHaveAttribute(
      'href',
      '#tracks',
    );
    expect(within(closing).getByRole('link', { name: '+90 501 124 03 40' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(tokens(within(closing).getByText(tfTr('partner.186')).closest('ul'))).toContain(
      'md:hidden',
    );
    expect(within(closing).getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 partner-with-us/_sections
```
Expected: FAIL — `Failed to resolve import "../Chain"` (and the other section modules).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_sections/NetworkCard.tsx`:

```tsx
import { NETWORK_IDS, type Tf } from '../_lib/content';

type RowMetric = (typeof NETWORK_IDS.rows)[number]['metric'];

/** The figure colours of the design's rows, AA on white (D20: `warning-text`, not #f59e0b). */
const FIGURE: Record<RowMetric, string> = {
  countries: 'text-[#35468a]',
  placed: 'text-warning-text',
};

/**
 * "Our network today" (the hero's right column): one row per SIGNED metric (W1) — the design's
 * "5+ HR agencies", "20+ sourcing partners" rows have no metric and are not rendered; a row
 * whose metric value is empty is dropped rather than shown with a typed number. The design's
 * desktop/phone label pairs both render, switched by CSS (W10); no count-up animation.
 */
export function NetworkCard({ tf, metrics }: { tf: Tf; metrics: Record<string, string> }) {
  const rows = NETWORK_IDS.rows.filter((row) => (metrics[row.metric] ?? '') !== '');
  return (
    <div
      data-testid="partner-network"
      className="min-w-0 rounded-hero bg-white p-5 text-ink shadow-hero-form md:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-card-title font-extrabold">{tf(NETWORK_IDS.heading)}</h2>
        <span className="inline-flex items-center gap-2 text-eyebrow font-extrabold uppercase tracking-[0.8px] text-success-text">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
          {tf(NETWORK_IDS.live)}
        </span>
      </div>
      {rows.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-1 md:gap-0">
          {rows.map((row) => (
            <li
              key={row.metric}
              className="flex flex-col gap-0.5 rounded-xs border border-border-4 bg-pale-3 px-3 py-3 md:flex-row md:items-baseline md:gap-4 md:rounded-none md:border-0 md:border-t md:bg-transparent md:px-0 md:py-4 md:last:border-b"
            >
              <span
                className={`min-w-0 text-[23px] font-extrabold tracking-[-0.5px] md:min-w-[74px] md:text-stat ${FIGURE[row.metric]}`}
              >
                {metrics[row.metric]}
              </span>
              <span className="text-body-sm text-text-secondary">
                <span className="max-md:hidden">{tf(row.deskId)}</span>
                <span className="md:hidden">{tf(row.mobId)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-4 text-body-sm text-text-tertiary">{tf(NETWORK_IDS.footnote)}</p>
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Hero.tsx`:

```tsx
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { CheckIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { GlobeIcon } from '../_components/icons';
import { HERO_IDS, type Tf } from '../_lib/content';
import { NetworkCard } from './NetworkCard';

/**
 * The dark hero. A gradient, not the design's full-bleed `pw-hero` photo (§10 #4: photography
 * on the Homepage and Hire Workers only), so the h1 is the LCP element (D26) and the page has no
 * hero placeholder. Crumbs are this page's own ids (W109); `whatsappHref` carries only the static
 * `sys.partner.whatsapp.prefill` (W95) and fires `whatsapp_click` `page_cta` (W12).
 */
export function Hero({
  locale,
  tf,
  metrics,
  whatsappHref,
}: {
  locale: Locale;
  tf: Tf;
  metrics: Record<string, string>;
  whatsappHref: string;
}) {
  return (
    <Section
      tone="dark"
      className="relative overflow-hidden bg-gradient-to-br from-navy to-[#0a1428]"
    >
      <div className="container-site" data-testid="partner-hero">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="min-w-0">
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4"
              items={[
                { name: tf(HERO_IDS.crumbHome), href: '/' },
                { name: tf(HERO_IDS.crumbSelf), href: '/partner-with-us' },
              ]}
            />
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em] text-white"
            >
              {tf(HERO_IDS.h1)}
            </h1>
            <p className="text-body-lg m-0 mb-7 max-w-[560px] text-white/80">
              <span className="max-md:hidden">{tf(HERO_IDS.leadDesk)}</span>
              <span className="md:hidden">{tf(HERO_IDS.leadMob)}</span>
            </p>
            <ul className="m-0 mb-7 flex max-w-[580px] list-none flex-wrap gap-x-8 gap-y-3 p-0 max-md:flex-col max-md:gap-2.5 max-md:rounded-sm max-md:border max-md:border-white/20 max-md:bg-white/5 max-md:p-3.5">
              {HERO_IDS.ticks.map(([lead, tail]) => (
                <li key={lead} className="flex items-start gap-2 text-body-sm text-white/80">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-[#4ade80]" />
                  <span>
                    <strong className="font-extrabold text-white">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            {/* ≤ 700 px the design stretches both CTAs full width: the wrapper turns into a
                one-column grid, the buttons keep their own classes (W122). */}
            <div className="mb-6 flex flex-wrap gap-3 max-md:grid">
              <Button variant="primary" size="lg" href="#tracks">
                {tf(HERO_IDS.ctaTracks)}
              </Button>
              <ContactCta placement="page_cta" variant="success" size="lg" external href={whatsappHref}>
                <WhatsAppIcon size={16} />
                {tf(HERO_IDS.ctaWhatsApp)}
              </ContactCta>
            </div>
            <p className="m-0 flex items-start gap-2 text-body-sm text-white/75">
              <GlobeIcon className="mt-0.5 shrink-0 text-sky" />
              <span>
                {tf(HERO_IDS.speakLead)}{' '}
                <strong className="font-bold text-white">{tf(HERO_IDS.speakTail)}</strong>
              </span>
            </p>
          </div>
          <NetworkCard tf={tf} metrics={metrics} />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Logos.tsx`:

```tsx
import { LogoMarquee, type Logo } from '@/design/blocks/LogoMarquee';
import { Section } from '@/design/primitives/Section';

/** The partner logo marquee: nothing — not even its band — until consented logos exist (W6,
 *  §10 #11); the design's "25+ partner companies" caption is an unsigned figure (W1). */
export function Logos({ logos }: { logos: readonly Logo[] }) {
  if (logos.length === 0) return null;
  return (
    <Section tone="band" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-logos">
        <LogoMarquee logos={[...logos]} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Chain.tsx`:

```tsx
import { Fragment } from 'react';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { CHAIN_IDS, type Tf } from '../_lib/content';

/** Supply → Recruitment → Demand. The highlighted node's white copy sits on blue-safe →
 *  darker blue (D20: white on the design's #1899D5 is 3.2:1). */
const NODE = {
  supply: {
    box: 'border border-tint-border bg-pale-1',
    eyebrow: 'text-blue-safe',
    title: 'text-ink',
    body: 'text-text-secondary',
  },
  core: {
    box: 'bg-gradient-to-br from-blue-safe to-[#0b5c88] shadow-[0_18px_40px_rgba(24,153,213,0.28)]',
    eyebrow: 'text-white',
    title: 'text-white',
    body: 'text-white',
  },
  demand: {
    box: 'border border-tint-border bg-pale-1',
    eyebrow: 'text-success-text',
    title: 'text-ink',
    body: 'text-text-secondary',
  },
} as const;

/** "Where you fit in the chain". The intro is the one sentence the package splits around its
 *  Hire Workers link (partner.048 + partner.002 + partner.049), so composing it is allowed
 *  (W23); the design's old-site href becomes the typed route; the in-text link is underlined
 *  (D20: colour alone does not mark it). Arrows from 901 px only; below that the nodes stack. */
export function Chain({ tf }: { tf: Tf }) {
  return (
    <Section tone="light" className="border-b border-border-3">
      <div className="container-site" data-testid="partner-chain">
        <h2 className="text-h2 m-0 mb-3 md:text-center">{tf(CHAIN_IDS.heading)}</h2>
        <p className="m-0 mb-8 text-body text-text-tertiary md:mx-auto md:mb-11 md:max-w-[560px] md:text-center">
          {tf(CHAIN_IDS.introLead)}{' '}
          <Link href="/hire-workers" className="font-bold text-blue-safe underline">
            {tf(CHAIN_IDS.introLink)}
          </Link>{' '}
          {tf(CHAIN_IDS.introTail)}
        </p>
        <div className="grid gap-3 lg:mx-auto lg:max-w-[1080px] lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-5">
          {CHAIN_IDS.nodes.map((node, i) => {
            const c = NODE[node.tone];
            return (
              <Fragment key={node.eyebrow}>
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-center text-[24px] font-extrabold text-tint-border max-lg:hidden"
                  >
                    →
                  </span>
                )}
                <div className={`rounded-md px-6 py-6 lg:text-center ${c.box}`}>
                  <p
                    className={`m-0 mb-2 text-eyebrow font-extrabold uppercase tracking-[1.2px] ${c.eyebrow}`}
                  >
                    {tf(node.eyebrow)}
                  </p>
                  <p className={`m-0 mb-1 text-card-title font-extrabold ${c.title}`}>
                    {tf(node.title)}
                  </p>
                  <p className={`m-0 text-body-sm ${c.body}`}>{tf(node.body)}</p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Process.tsx`:

```tsx
import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PROCESS_IDS, type Tf } from '../_lib/content';

/** "How a partnership starts": the foundation's `ProcessSteps` rail (delta 10); step 4's
 *  "Full access" pill is its `when`. The intro sits on the pale ground in `text-secondary`
 *  (tertiary on pale-1 is 4.49:1, D20). */
export function Process({ bundle, locale, tf }: { bundle: Bundle; locale: Locale; tf: Tf }) {
  const steps: ProcessStep[] = PROCESS_IDS.steps.map((s) => ({
    n: s.n,
    titleId: s.titleId,
    bodyId: s.bodyId,
    ...(s.whenId ? { when: tf(s.whenId) } : {}),
  }));
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="partner-process">
        <h2 className="text-h2 m-0 mb-3 md:text-center">{tf(PROCESS_IDS.heading)}</h2>
        <p className="m-0 mb-8 text-body text-text-secondary md:mx-auto md:mb-11 md:max-w-[560px] md:text-center">
          {tf(PROCESS_IDS.intro)}
        </p>
        <div className="mx-auto max-w-[880px]">
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            steps={steps}
            variant="cards"
            id="how-it-starts"
            headingLevel={3}
          />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Portal.tsx`:

```tsx
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { CheckIcon } from '@/design/chrome/icons';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PORTAL_IDS, type Tf } from '../_lib/content';

/**
 * The partner-portal showcase. partner.159 is `{placed} placements` (W1); the store row is
 * `StoreBadges` with the Android link only (W8 — `ios` stays null; its micro-copy is hire.240,
 * never partner.162/163, W7). The laptop and phone shots are named placeholders until the owner
 * supplies them (W55) — never the LCP element; `ImageSlot` owns its box (W129), so the frames
 * size it: the laptop through its column, the phone through a 150 px wrapper hidden ≤ 700 px
 * by CSS (W10).
 */
export function Portal({
  bundle,
  locale,
  tf,
  androidUrl,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: Tf;
  androidUrl: string | null;
}) {
  return (
    <Section tone="light" className="pb-0">
      <div className="container-site">
        <div
          data-testid="partner-portal"
          className="grid items-center gap-8 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-[#e8f3f9] p-5 md:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-12"
        >
          <div className="min-w-0">
            <Eyebrow>{tf(PORTAL_IDS.eyebrow)}</Eyebrow>
            <h2 className="text-h2 m-0 mt-3 mb-3">{tf(PORTAL_IDS.heading)}</h2>
            <p className="m-0 mb-6 text-body text-text-secondary">{tf(PORTAL_IDS.lead)}</p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {PORTAL_IDS.features.map(([lead, tail]) => (
                <li key={lead} className="flex items-start gap-3 text-body-sm text-text-secondary">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-success" />
                  <span>
                    <strong className="font-extrabold text-ink">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="m-0 mb-6 flex items-start gap-2 text-body-sm text-text-secondary">
              <CheckIcon size={16} className="mt-0.5 shrink-0 text-blue-safe" />
              <span>
                <strong className="font-extrabold text-ink">{tf(PORTAL_IDS.claimLead)}</strong>{' '}
                {tf(PORTAL_IDS.claimTail)}
              </span>
            </p>
            <p className="m-0 mb-2.5 text-body-sm font-bold text-text-secondary">
              {tf(PORTAL_IDS.mobileLine)}
            </p>
            <StoreBadges bundle={bundle} locale={locale} android={androidUrl} />
          </div>
          <div className="relative min-w-0 pb-6">
            <div className="overflow-hidden rounded-base border border-tint-border bg-white shadow-[0_26px_60px_rgba(22,60,90,0.16)] md:mr-[70px]">
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 border-b border-border-4 bg-[#f0f6fa] px-3.5 py-2.5"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="inline-block h-2.5 w-2.5 rounded-pill bg-[#e2e8ee]" />
                <span className="ml-2 min-w-0 flex-1 truncate rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-[11.5px] text-text-tertiary">
                  {tf(PORTAL_IDS.addressBar)}
                </span>
              </div>
              <ImageSlot
                slot="partner-portal-screen"
                alt={tf(PORTAL_IDS.screenAlt)}
                width={720}
                height={340}
              />
            </div>
            <div className="absolute right-0 bottom-0 w-[150px] rounded-[24px] bg-[#0f2438] p-[7px] shadow-[0_26px_56px_rgba(15,36,56,0.35)] max-md:hidden">
              <ImageSlot
                slot="partner-portal-mobile"
                alt={tf(PORTAL_IDS.mobileAlt)}
                width={136}
                height={274}
                className="rounded-[17px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Faq.tsx`:

```tsx
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FAQ_IDS, type Tf } from '../_lib/content';

/** The page's one FaqBlock (one FAQPage node — final-review page rule): six pairs, the first
 *  open; the ask card's three rows are WhatsApp (the page's static prefill, W95), call and
 *  e-mail (W83: `email`/`emailLabelId`/`subject`, all `page_cta`). */
export function Faq({
  bundle,
  locale,
  tf,
  whatsappNumber,
  whatsappText,
  phone,
  email,
  emailSubject,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: Tf;
  whatsappNumber: string;
  /** `sys.partner.faq.whatsappText` */
  whatsappText: string;
  phone: string;
  email: string;
  /** `sys.partner.faq.emailSubject` */
  emailSubject: string;
}) {
  const items: FaqItem[] = FAQ_IDS.pairs.map(([q, a], i) => ({
    id: `partner-faq-${i + 1}`,
    q: tf(q),
    a: tf(a),
  }));
  return (
    <Section tone="light">
      <div className="container-site" data-testid="partner-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq"
          items={items}
          eyebrowId={FAQ_IDS.eyebrow}
          headingId={FAQ_IDS.heading}
          bodyId={FAQ_IDS.lead}
          openFirst
          askCard={{
            titleId: FAQ_IDS.askTitle,
            bodyId: FAQ_IDS.askBody,
            whatsappNumber,
            whatsappText,
            whatsappLabelId: FAQ_IDS.askWhatsApp,
            phone,
            callLabelId: FAQ_IDS.askCall,
            email,
            emailLabelId: FAQ_IDS.askEmail,
            subject: emailSubject,
          }}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Closing.tsx`:

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CLOSING_IDS, type Tf } from '../_lib/content';

/** The band's id — also the sticky bar's `hideNearId` (delta 12). */
export const CLOSING_ID = 'closing';

/**
 * The closing band: the foundation's dark `ClosingCtaBand` (tone `gradient`, delta 11) with
 * "Apply as a partner →" (#tracks) and the phone (tracked `call_click` `page_cta`, W12); the
 * reply badge (partner.186, `{replySlaHours}`) is the band's ≤ 700 px tick line, as the design
 * shows it on phones only. The legal line's e-mail is a tracked, underlined `ContactLink`.
 */
export function Closing({
  bundle,
  locale,
  tf,
  phone,
  phoneDisplay,
  email,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: Tf;
  phone: string;
  phoneDisplay: string;
  email: string;
}) {
  return (
    <Section tone="band">
      <div className="container-site" data-testid="partner-closing">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          id={CLOSING_ID}
          tone="gradient"
          titleId={CLOSING_IDS.heading}
          bodyId={CLOSING_IDS.body}
          primary={{ label: tf(CLOSING_IDS.primary), href: '#tracks' }}
          secondary={{ label: phoneDisplay, href: telLink(phone) }}
          ticks={[tf(CLOSING_IDS.badge)]}
        />
        <p className="m-0 mt-6 text-center text-body-sm text-text-tertiary">
          {tf(CLOSING_IDS.legal)}{' '}
          <ContactLink
            href={mailLink(email)}
            placement="page_cta"
            className="font-bold text-blue-safe underline"
          >
            {email}
          </ContactLink>
        </p>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `sections.test.tsx` 12/12 green; `class-collisions.test.ts` green over the new files (the `NODE`/`FIGURE` compositions, the `<Button>`/`<ContactCta>` props checked against the real `buttonClassName`), `client-imports.test.ts` (every primitive/block by path — no barrel, type-only imports included) and `rsc-imports.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/_sections"
git commit -m "feat(partner): hero + network card, logos, chain, process, portal, FAQ and closing sections (T5 c4)

Gradient hero with the h1 as the LCP element (§10 #4, D26); signed metrics only (W1); logos
hidden by data (W6); ProcessSteps rail; Android-only StoreBadges (W7/W8); named portal
placeholders (W55/W129); one FaqBlock with the W83 e-mail row; dark ClosingCtaBand #closing;
every contact anchor page_cta (W12); by-path imports (W156).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — `#tracks`: the section, the three track panels and the three form shells

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/partner-with-us/_sections/__tests__/tracks.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { countryOptions } from '../../_lib/country-options';
import { HrAgencyForm, InstituteForm, SourcingPartnerForm, type FormDoor } from '../PartnerForms';
import { TrackPanel } from '../TrackPanel';
import { Tracks } from '../Tracks';

// The 'use server' module is replaced: jsdom renders the shells and never posts — Cycle 2 pins
// the actions, the Cycle 7 gate runs the real round trip.
vi.mock('../../actions', () => ({
  submitHrAgency: vi.fn(async () => ({ status: 'idle' })),
  submitSourcingPartner: vi.fn(async () => ({ status: 'idle' })),
  submitInstitute: vi.fn(async () => ({ status: 'idle' })),
}));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/ortak-olun',
}));

const TR: Bundle = BundleSchema.parse(
  JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'content', 'local', 'bundle.tr.json'), 'utf8'),
  ),
);
const tf = makeTf(TR, 'tr');
const door: FormDoor = {
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  contact: { phone: '+905011240340', phoneDisplay: '+90 501 124 03 40', email: 'info@jobsadmire.com' },
};
const countries = countryOptions(
  getCollection(TR, 'sourceCountries'),
  getCollection(TR, 'countries'),
  'tr',
);
const tokens = (el: Element | null) => (el?.getAttribute('class') ?? '').split(/\s+/);
/** The visible label of the control with this id, without the required asterisk. */
const labelOf = (id: string) =>
  document.querySelector(`label[for="${id}"]`)?.textContent?.replace(/\s*\*$/, '');
function expectLabels(scope: string, expected: [string, string][]) {
  for (const [name, text] of expected) {
    expect(document.querySelector(`[name="${name}"]`)).toHaveAttribute('id', `f-${scope}-${name}`);
    expect(labelOf(`f-${scope}-${name}`), name).toBe(text);
  }
}

describe('Tracks', () => {
  it('is section#tracks (the W17 header-CTA target) with its heading, the chooser and the HR panel', () => {
    const { container } = renderWithIntl(
      <Tracks
        tf={tf}
        panels={{
          hr: (
            <TrackPanel track="hr" tf={tf}>
              <HrAgencyForm locale="tr" tf={tf} door={door} />
            </TrackPanel>
          ),
          sourcing: <div data-testid="panel-sourcing" />,
          institute: <div data-testid="panel-institute" />,
        }}
      />,
    );
    const section = container.querySelector('section#tracks');
    expect(section).not.toBeNull();
    expect(tokens(section)).toContain('scroll-mt-20');
    expect(screen.getByRole('heading', { level: 2, name: tf('partner.061') })).toBeInTheDocument();
    const group = screen.getByRole('radiogroup', { name: tf('partner.064') });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: tf('partner.038') })).toBeChecked();
    expect(screen.getByRole('radio', { name: tf('partner.040') })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: tf('partner.068') })).not.toBeChecked();
    expect(screen.getByTestId('partner-form-hr')).toHaveAttribute('data-form-key', 'hire');
    expect(screen.queryByTestId('panel-sourcing')).toBeNull();
  });
});

describe('TrackPanel', () => {
  it('lays out eyebrow, h2, lead, four benefits, three asks and a phone-only jump link to its form card', () => {
    renderWithIntl(
      <TrackPanel track="sourcing" tf={tf}>
        <div />
      </TrackPanel>,
    );
    const panel = screen.getByTestId('partner-panel-sourcing');
    expect(within(panel).getByRole('heading', { level: 2 })).toHaveTextContent(tf('partner.100'));
    expect(within(panel).getByText(tf('partner.099'))).toBeInTheDocument();
    const [benefits, asks] = within(panel).getAllByRole('list');
    expect(within(benefits).getAllByRole('listitem')).toHaveLength(4);
    expect(within(asks).getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      ['partner.110', 'partner.111', 'partner.112'].map(tf),
    );
    const jump = within(panel).getByRole('link', { name: tf('partner.074') });
    expect(jump).toHaveAttribute('href', '#apply-agent');
    expect(tokens(jump)).toContain('md:hidden');
  });

  it('fills the HR benefits from the metrics (W1/W87: {countries}, {homepageReplyHours})', () => {
    renderWithIntl(
      <TrackPanel track="hr" tf={tf}>
        <div />
      </TrackPanel>,
    );
    const panel = screen.getByTestId('partner-panel-hr');
    expect(panel).toHaveTextContent('13 ülkeden aday listeleri');
    expect(panel).toHaveTextContent('24 saat');
    expect(panel).not.toHaveTextContent(/\{[a-zA-Z]+\}/);
  });
});

describe('the three form shells (W3/W16/W79/W115)', () => {
  it('HR agency: the hire shell with its own id scope, the package labels, the consent tick, no country input', () => {
    renderWithIntl(<HrAgencyForm locale="tr" tf={tf} door={door} />);
    const form = screen.getByTestId('partner-form-hr');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    expectLabels('partner-hr', [
      ['company', tf('partner.093')],
      ['name', tf('partner.094')],
      ['city', tf('partner.095')],
      ['email', tf('partner.096')],
      ['phone', tf('partner.097')],
      ['message', tf('partner.098')],
    ]);
    expect(form.querySelector('#f-partner-hr-consent')).toHaveAttribute('type', 'checkbox');
    expect(form.querySelector('[name="licenceDeclaration"]')).toBeNull();
    expect(form.querySelector('[name="country"]')).toBeNull(); // TR comes from the mapper (W3)
    expect(within(form).getByRole('button', { name: tf('partner.092') })).toHaveAttribute(
      'type',
      'submit',
    );
    const card = document.getElementById('apply-hr');
    expect(card).toContainElement(form);
    expect(within(card as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent(
      tf('partner.086'),
    );
    expect(card).toHaveTextContent('4 iş saati');
  });

  it('sourcing partner: the ISO-2 select (64 rows, source countries first), licence, candidatesPerYear, the declaration beside the consent', () => {
    renderWithIntl(<SourcingPartnerForm locale="tr" tf={tf} door={door} countries={countries} />);
    const form = screen.getByTestId('partner-form-sourcing');
    expect(form).toHaveAttribute('data-form-key', 'partner');
    expectLabels('partner-sourcing', [
      ['company', tf('partner.093')],
      ['name', tf('partner.094')],
      ['country', tf('partner.115')],
      ['licence', tf('partner.116')],
      ['email', tf('partner.117')],
      ['phone', tf('partner.097')],
      ['candidatesPerYear', tr.sys.form.labels.candidatesPerYear],
      ['trades', tf('partner.118')],
    ]);
    const select = form.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(select.options).toHaveLength(65); // sys.form.placeholders.select + 64 rows (W111)
    expect(select.options[0].value).toBe('');
    expect(select.options[1].value).toBe('PK');
    expect(form.querySelector('#f-partner-sourcing-licenceDeclaration')).toHaveAttribute(
      'type',
      'checkbox',
    );
    expect(labelOf('f-partner-sourcing-licenceDeclaration')).toBe(tf('partner.114'));
    expect(form.querySelector('#f-partner-sourcing-consent')).toHaveAttribute('type', 'checkbox');
    expect(form.querySelector('[name="phone"]')).toHaveAttribute('placeholder', '');
    expect(document.getElementById('apply-agent')).toContainElement(form);
  });

  it('institute: its own name label, an optional city beside the country select, no licence and no declaration', () => {
    renderWithIntl(<InstituteForm locale="tr" tf={tf} door={door} countries={countries} />);
    const form = screen.getByTestId('partner-form-institute');
    expect(form).toHaveAttribute('data-form-key', 'partner');
    expectLabels('partner-institute', [
      ['company', tf('partner.134')],
      ['name', tf('partner.094')],
      ['city', tr.sys.form.labels.city],
      ['country', tf('partner.115')],
      ['email', tf('partner.117')],
      ['phone', tf('partner.097')],
      ['candidatesPerYear', tr.sys.form.labels.candidatesPerYear],
      ['trades', tf('partner.136')],
    ]);
    expect(form.querySelector('[name="city"]')).not.toBeRequired();
    expect(form.querySelector('[name="licence"]')).toBeNull();
    expect(form.querySelector('[name="licenceDeclaration"]')).toBeNull();
    expect(form.querySelector('#f-partner-institute-consent')).toHaveAttribute('type', 'checkbox');
    expect(document.getElementById('apply-inst')).toContainElement(form);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 partner-with-us/_sections/__tests__/tracks
```
Expected: FAIL — `Failed to resolve import "../PartnerForms"` (and `../TrackPanel`, `../Tracks`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_sections/TrackPanel.tsx`:

```tsx
import type { ReactNode } from 'react';
import { CheckIcon } from '@/design/chrome/icons';
import { PANEL_COPY, PANEL_SHARED, type Tf } from '../_lib/content';
import { FORM_ANCHOR, type TrackKey } from '../_lib/tracks';

/** Per track: the panel's pale gradient + edge, the eyebrow colour, the asks card edge and the
 *  phone-only jump link (the design's blue / green / indigo accents, AA on their grounds). */
const LOOK: Record<TrackKey, { panel: string; eyebrow: string; edge: string; jump: string }> = {
  hr: {
    panel: 'border-tint-border bg-gradient-to-b from-pale-1 to-[#e8f3f9]',
    eyebrow: 'text-blue-safe',
    edge: 'border-tint-border',
    jump: 'border-blue-safe text-blue-safe',
  },
  sourcing: {
    panel: 'border-[#c9e8d6] bg-gradient-to-b from-[#f4fbf6] to-[#e8f6ee]',
    eyebrow: 'text-success-text',
    edge: 'border-[#c9e8d6]',
    jump: 'border-success-text text-success-text',
  },
  institute: {
    panel: 'border-[#ccd6ea] bg-gradient-to-b from-[#f6f8fc] to-[#e9eef7]',
    eyebrow: 'text-[#35468a]',
    edge: 'border-[#ccd6ea]',
    jump: 'border-[#35468a] text-[#35468a]',
  },
};

/**
 * One track's panel (the design's `sc-if` body): eyebrow, h2, lead, the ≤ 700 px "Go to the
 * application form ↓" jump link (W10: CSS, not conditional), four benefit rows (SVG ticks, never
 * text glyphs), the "What we ask from you" card (the package's bullets carry their own "· "),
 * and the track's form card as `children`.
 */
export function TrackPanel({
  track,
  tf,
  children,
}: {
  track: TrackKey;
  tf: Tf;
  children: ReactNode;
}) {
  const copy = PANEL_COPY[track];
  const look = LOOK[track];
  return (
    <div
      data-testid={`partner-panel-${track}`}
      className={`grid gap-6 rounded-hero border p-5 md:gap-8 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14 lg:p-12 ${look.panel}`}
    >
      <div className="min-w-0">
        <p
          className={`m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.6px] ${look.eyebrow}`}
        >
          {tf(copy.eyebrow)}
        </p>
        <h2 className="text-h2 m-0 mb-3">{tf(copy.heading)}</h2>
        <p className="m-0 mb-6 text-body text-text-secondary">{tf(copy.lead)}</p>
        <a
          href={`#${FORM_ANCHOR[track]}`}
          className={`mb-5 flex min-h-[46px] items-center justify-center rounded-xs border-[1.5px] border-dashed text-body font-extrabold no-underline md:hidden ${look.jump}`}
        >
          {tf(PANEL_SHARED.jump)}
        </a>
        <ul className="m-0 mb-7 flex list-none flex-col gap-3.5 p-0">
          {copy.benefits.map(([titleId, bodyId]) => (
            <li key={titleId} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-success text-white"
              >
                <CheckIcon size={13} />
              </span>
              <div className="min-w-0">
                <p className="m-0 font-extrabold text-ink">{tf(titleId)}</p>
                <p className="m-0 text-body-sm text-text-secondary">{tf(bodyId)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={`rounded-base border bg-white px-6 py-5 ${look.edge}`}>
          <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">
            {tf(PANEL_SHARED.asksHeading)}
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-text-secondary">
            {copy.asks.map((id) => (
              <li key={id}>{tf(id)}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/PartnerForms.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { DeclarationCheckbox } from '../_components/DeclarationCheckbox';
import { DECLARATION_ID, FIELD_LABELS, PANEL_COPY, PANEL_SHARED, type Tf } from '../_lib/content';
import { CAPS, DECLARATION_FIELD } from '../_lib/forms';
import { FORM_ANCHOR, FORM_ID_SCOPE, FORM_KEY_BY_TRACK, type TrackKey } from '../_lib/tracks';
import { submitHrAgency, submitInstitute, submitSourcingPartner } from '../actions';

/** What every shell takes from `bundle.settings`: the Turnstile key (null → no widget) and the
 *  D11 fallback panel's WhatsApp number and contact rows. */
export type FormDoor = {
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  contact: { phone: string; phoneDisplay: string; email: string };
};

/** The card heads: white copy at full opacity on AA grounds (D20 — white on the design's
 *  #1899D5 / #16a34a is 3.2 / 3.3:1). */
const HEAD: Record<TrackKey, string> = {
  hr: 'bg-blue-safe',
  sourcing: 'bg-success-text',
  institute: 'bg-gradient-to-br from-[#35468a] to-[#253063]',
};
const EDGE: Record<TrackKey, string> = {
  hr: 'border-tint-border',
  sourcing: 'border-[#c9e8d6]',
  institute: 'border-[#ccd6ea]',
};

/** The design's form card; its id is the design's anchor (`#apply-hr` …), the phone-only jump
 *  links' target — the card, so the head lands in view with the form. */
function FormCard({ track, tf, children }: { track: TrackKey; tf: Tf; children: ReactNode }) {
  return (
    <div
      id={FORM_ANCHOR[track]}
      className={`scroll-mt-24 overflow-hidden rounded-lg border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)] ${EDGE[track]}`}
    >
      <div className={`px-5 py-5 lg:px-7 ${HEAD[track]}`}>
        <h3 className="m-0 text-card-title font-extrabold text-white">
          {tf(PANEL_COPY[track].formTitle)}
        </h3>
        <p className="m-0 mt-1 text-body-sm text-white">{tf(PANEL_SHARED.sla)}</p>
      </div>
      <div className="px-5 py-6 lg:px-7">{children}</div>
    </div>
  );
}

/** The shell props every track shares: its door key (W3), its own id scope (W79), the package's
 *  submit copy (partner.092), the consent checkbox (W79; `consentLinkHref` left at `/privacy`),
 *  the fallback panel's heading one level under the card's h3. */
function shellProps(track: TrackKey, locale: Locale, tf: Tf, door: FormDoor) {
  return {
    formKey: FORM_KEY_BY_TRACK[track],
    idScope: FORM_ID_SCOPE[track],
    locale,
    turnstileSiteKey: door.turnstileSiteKey,
    whatsappNumber: door.whatsappNumber,
    contact: door.contact,
    submitLabel: tf(PANEL_SHARED.submit),
    consent: 'checkbox' as const,
    headingLevel: 4 as const,
    testId: `partner-form-${track}`,
  };
}

/** HR agency → `hire` + `iAm: 'hr_agency'` + `country: 'TR'` (W3, in the mapper — the form asks
 *  for the city in Türkiye only). Labels are the package's (W115). */
export function HrAgencyForm({ locale, tf, door }: { locale: Locale; tf: Tf; door: FormDoor }) {
  const l = FIELD_LABELS.hr;
  return (
    <FormCard track="hr" tf={tf}>
      <FormShell action={submitHrAgency} {...shellProps('hr', locale, tf, door)}>
        <Field
          name="company"
          label={tf(l.company)}
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field name="name" label={tf(l.name)} required autoComplete="name" maxLength={CAPS.name} />
          <Field
            name="city"
            label={tf(l.city)}
            required
            autoComplete="address-level2"
            maxLength={CAPS.city}
          />
        </div>
        <Field
          name="email"
          type="email"
          label={tf(l.email)}
          required
          autoComplete="email"
          inputMode="email"
          maxLength={CAPS.email}
        />
        <Field
          name="phone"
          type="tel"
          label={tf(l.phone)}
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={CAPS.phone}
        />
        <Field name="message" as="textarea" rows={3} label={tf(l.message)} maxLength={CAPS.message} />
      </FormShell>
    </FormCard>
  );
}

/** Sourcing partner → `partner` + `track: 'sourcing'` (W16): the ISO-2 country select (W3/W25),
 *  the licence number (catalog `licence`, required here), `candidatesPerYear` (catalog, sys label)
 *  beside the free-text `trades`, and the licence/no-fee declaration as its own required tick
 *  before the kernel's consent row (W79). The phone placeholder is blank: the kernel's `+90`
 *  example would mislead an agent abroad (the phone hint asks for the country code). */
export function SourcingPartnerForm({
  locale,
  tf,
  door,
  countries,
}: {
  locale: Locale;
  tf: Tf;
  door: FormDoor;
  countries: FieldOption[];
}) {
  const l = FIELD_LABELS.sourcing;
  return (
    <FormCard track="sourcing" tf={tf}>
      <FormShell action={submitSourcingPartner} {...shellProps('sourcing', locale, tf, door)}>
        <Field
          name="company"
          label={tf(l.company)}
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field name="name" label={tf(l.name)} required autoComplete="name" maxLength={CAPS.name} />
          <Field
            name="country"
            as="select"
            label={tf(l.country)}
            required
            options={countries}
            autoComplete="country"
          />
        </div>
        <Field
          name="licence"
          label={tf(l.licence)}
          required
          autoComplete="off"
          maxLength={CAPS.licence}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            name="email"
            type="email"
            label={tf(l.email)}
            required
            autoComplete="email"
            inputMode="email"
            maxLength={CAPS.email}
          />
          <Field
            name="phone"
            type="tel"
            label={tf(l.phone)}
            placeholder=""
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={CAPS.phone}
          />
        </div>
        <Field name="candidatesPerYear" maxLength={CAPS.candidatesPerYear} />
        <Field name="trades" as="textarea" rows={3} label={tf(l.trades)} maxLength={CAPS.trades} />
        <DeclarationCheckbox name={DECLARATION_FIELD} label={tf(DECLARATION_ID)} />
      </FormShell>
    </FormCard>
  );
}

/** Training institute → `partner` + `track: 'institute'` (W16): the design's one "City, country"
 *  box becomes an optional `city` (catalog v1.1, sys label) + the required ISO-2 select;
 *  `candidatesPerYear` beside `trades`; no licence, no declaration. Blank placeholders where the
 *  kernel's Turkish examples would mislead an institute abroad (name, city, phone). */
export function InstituteForm({
  locale,
  tf,
  door,
  countries,
}: {
  locale: Locale;
  tf: Tf;
  door: FormDoor;
  countries: FieldOption[];
}) {
  const l = FIELD_LABELS.institute;
  return (
    <FormCard track="institute" tf={tf}>
      <FormShell action={submitInstitute} {...shellProps('institute', locale, tf, door)}>
        <Field
          name="company"
          label={tf(l.company)}
          placeholder=""
          required
          autoComplete="organization"
          maxLength={CAPS.company}
        />
        <Field name="name" label={tf(l.name)} required autoComplete="name" maxLength={CAPS.name} />
        <div className="grid gap-4 lg:grid-cols-2">
          <Field name="city" placeholder="" autoComplete="address-level2" maxLength={CAPS.city} />
          <Field
            name="country"
            as="select"
            label={tf(l.country)}
            required
            options={countries}
            autoComplete="country"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            name="email"
            type="email"
            label={tf(l.email)}
            required
            autoComplete="email"
            inputMode="email"
            maxLength={CAPS.email}
          />
          <Field
            name="phone"
            type="tel"
            label={tf(l.phone)}
            placeholder=""
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={CAPS.phone}
          />
        </div>
        <Field name="candidatesPerYear" maxLength={CAPS.candidatesPerYear} />
        <Field name="trades" as="textarea" rows={3} label={tf(l.trades)} maxLength={CAPS.trades} />
      </FormShell>
    </FormCard>
  );
}
```

`src/app/[locale]/(site)/partner-with-us/_sections/Tracks.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Section } from '@/design/primitives/Section';
import { TrackChooser } from '../_components/TrackChooser';
import { TRACKS_IDS, type Tf } from '../_lib/content';
import { TRACK_KEYS, type TrackKey } from '../_lib/tracks';

/**
 * `#tracks` — the W17/W152 anchor the header CTA (`CTA_BY_PATHNAME['/partner-with-us']`), the
 * hero, the sticky bar and the closing band land on (`scroll-mt-20` clears the sticky header).
 * The chooser island receives resolved strings and the three server-rendered panels; only the
 * chosen one is in the DOM (the other two ride in the RSC payload — the forms' server actions
 * cross as references).
 */
export function Tracks({ tf, panels }: { tf: Tf; panels: Record<TrackKey, ReactNode> }) {
  return (
    <Section tone="light" id="tracks" className="scroll-mt-20">
      <div className="container-site" data-testid="partner-tracks">
        <h2 className="text-h2 m-0 mb-3 md:text-center">{tf(TRACKS_IDS.heading)}</h2>
        <p className="m-0 mb-8 text-body text-text-tertiary md:mx-auto md:mb-11 md:max-w-[560px] md:text-center">
          <span className="max-md:hidden">{tf(TRACKS_IDS.introDesk)}</span>
          <span className="md:hidden">{tf(TRACKS_IDS.introMob)}</span>
        </p>
        <TrackChooser
          legend={tf(TRACKS_IDS.choose)}
          applyLabel={tf(TRACKS_IDS.apply)}
          cards={TRACK_KEYS.map((key) => ({
            key,
            title: tf(TRACKS_IDS.cards[key].title),
            body: tf(TRACKS_IDS.cards[key].body),
            cta: tf(TRACKS_IDS.cardCta),
          }))}
          panels={panels}
        />
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `tracks.test.tsx` 6/6 green; `class-collisions.test.ts` (the `LOOK`/`HEAD`/`EDGE` compositions), `client-imports.test.ts` (the server sections import `Field`/`FormShell`/`DeclarationCheckbox` by path; `forms.ts`'s Zod stays out of every client graph — no client module imports it) and `rsc-imports.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/_sections"
git commit -m "feat(partner): #tracks section, the three track panels and form shells — hire (HR agency), partner ×2 (T5 c5)

W3/W16: one FormShell per track with its own idScope (W79), door key and package labels (W115);
the ISO-2 country select over the W25 collections; the licence declaration tick beside the
consent; the design's #apply-hr/#apply-agent/#apply-inst cards; id=\"tracks\" for the W17 CTA.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — the page, the route wiring (W20/W21), the sticky bar and its scroll padding, the page e2e contract, the SEO/analytics/PRD/architecture docs

- [ ] **Step 1: Write the failing test**

`src/lib/seo/routes.ts` — in `UNBUILT_PATHNAMES` (the `new Set<keyof typeof pathnames>([…])` literal), delete the line `'/partner-with-us',`. Nothing else in the file changes. (`unbuilt.test.ts` now fails until `page.tsx` exists — the unit-level red for this cycle.)

`e2e/routes.ts` — append as the last two entries of the `GATE_ROUTE_TABLE` literal (after whatever row the previous page task left last):

```ts
  { path: '/ortak-olun', indexable: true },
  { path: '/en/partner-with-us', indexable: true },
```

(The route-driven page-contract loop in `e2e/routing.spec.ts`, the canonical/hreflang/sitemap cases in `e2e/seo.spec.ts`, axe in `e2e/a11y.spec.ts` and the width sweep in `e2e/width-sweep.spec.ts` pick the route up from there — no edit to those files.)

`e2e/pages/partner.spec.ts` (runs under both Playwright projects inside the Cycle 7 gate; it needs no door and no `OPS_API_URL` — W92):

```ts
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/ortak-olun', en: '/en/partner-with-us' } as const;
/** Canonicals, hreflang and og:image are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';
/** `bundle.settings` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const TEL = 'tel:+905011240340';
const isMobile = () => test.info().project.name === 'mobile';

/** W92: only `staging` and production carry the Operations door. Every other face — this task's
 *  localhost build (no door variables), any other Vercel preview — answers a valid submit with
 *  the D11 panel (`unauthorized`), deterministically and without filing a lead. On a door face
 *  the submitting cases skip: T14 owns real submissions. */
function onDoorFace(): boolean {
  const base =
    test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000';
  return /^(www\.|staging\.)?jobsadmire\.com$/.test(new URL(base).hostname);
}

/** partner.038 / 040 / 068 — the card radios' accessible names (`aria-labelledby`). */
const TRACK = {
  tr: {
    hr: 'Türkiye’deki İK ajansları',
    sourcing: 'Yurt dışındaki tedarik ortakları',
    institute: 'Eğitim kurumları',
  },
  en: {
    hr: 'HR agencies in Türkiye',
    sourcing: 'Sourcing partners abroad',
    institute: 'Training institutes',
  },
} as const;

type Pushed = Record<string, unknown>;
function pushed(page: Page, event: string): Promise<Pushed[]> {
  return page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (e) => e.event === name,
      ),
    event,
  );
}

/** Lets a test click a tel:/mailto:/wa.me anchor without leaving the page: a capture-phase
 *  listener cancels the navigation; React's own click handler (the analytics push) still runs. */
async function neutraliseContactLinks(page: Page) {
  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (e) => {
        const a = (e.target as Element | null)?.closest?.(
          'a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me/"]',
        );
        if (a) e.preventDefault();
      },
      true,
    );
  });
}

/** W76/W95: the fallback anchor's href is the bare chat; the prefilled URL (what the visitor
 *  typed) exists only in the window the click opens. */
async function expectBareWhatsAppFallback(page: Page, panel: Locator, typed: string) {
  const link = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(link).toHaveAttribute('href', WA);
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
  await link.click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  expect(opened[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(opened[0].split('?text=')[1])).toContain(typed);
}

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only data-lcp-slot, the two named placeholders, no leaked ids or tokens, signed metrics only (D26/W55/W1)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).not.toBeEmpty();
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // gradient hero — no photo slot (§10 #4)
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder') ?? '').sort());
    expect(placeholders).toEqual(['partner-portal-mobile', 'partner-portal-screen']);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bpartner\.\d{3}\b/); // a package id leaking as text
    const network = page.getByTestId('partner-network');
    await expect(network.locator('li')).toHaveCount(2);
    await expect(network).toContainText('13');
    await expect(network).toContainText('470+');
  });

  test(`${locale}: the designed sections in order, #tracks for the header CTA (W17/W152/W158), no logo band (W6)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'partner-hero',
      'partner-chain',
      'partner-tracks',
      'partner-track-detail',
      'partner-process',
      'partner-portal',
      'partner-faq',
      'partner-closing',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toBeVisible();
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    await expect(page.getByTestId('partner-logos')).toHaveCount(0);
    await expect(page.locator('[id="tracks"]')).toHaveCount(1);
    await expect(page.locator('[id="closing"]')).toHaveCount(1);
    // CTA_BY_PATHNAME['/partner-with-us'] → this page's #tracks (partner.017/018)
    const cta = page.getByRole('banner').getByRole('link', { name: /^(Başvurun|Apply)/ });
    await expect(cta).toHaveAttribute('href', `${ROUTES[locale]}#tracks`);
    await expect(page.getByTestId('partner-chain').getByRole('link')).toHaveAttribute(
      'href',
      locale === 'tr' ? '/isci-talebi' : '/en/hire-workers',
    );
  });

  test(`${locale}: the HR track is the default; choosing sourcing swaps the panel, fires partner_track_select once and writes the hash (W26/W67/W96)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const names = TRACK[locale];
    await expect(page.getByRole('radio', { name: names.hr })).toBeChecked();
    await expect(page.getByTestId('partner-form-hr')).toHaveAttribute('data-form-key', 'hire');
    await expect(page.getByTestId('partner-form-sourcing')).toHaveCount(0);
    await expect(page.getByTestId('partner-form-institute')).toHaveCount(0);
    await page.locator('label[for="track-sourcing"]').click();
    await expect(page.getByRole('radio', { name: names.sourcing })).toBeChecked();
    await expect(page.getByTestId('partner-form-sourcing')).toHaveAttribute(
      'data-form-key',
      'partner',
    );
    await expect(page.getByTestId('partner-form-hr')).toHaveCount(0);
    expect(new URL(page.url()).hash).toBe('#track-sourcing');
    expect(await pushed(page, 'partner_track_select')).toEqual([
      { event: 'partner_track_select', page: ROUTES[locale], locale, track: 'sourcing' },
    ]);
    // Back to the HR card: the default is not a signal (the W67 enum has no `hr`).
    await page.locator('label[for="track-hr"]').click();
    await expect(page.getByTestId('partner-form-hr')).toBeVisible();
    expect(await pushed(page, 'partner_track_select')).toHaveLength(1);
  });
}

test('en: a #track-institute deep link preselects the institute panel and fires nothing', async ({
  page,
}) => {
  await page.goto(`${ROUTES.en}#track-institute`);
  await expect(page.getByTestId('partner-form-institute')).toBeVisible();
  await expect(page.getByRole('radio', { name: TRACK.en.institute })).toBeChecked();
  await expect(page.getByTestId('partner-form-hr')).toHaveCount(0);
  expect(await pushed(page, 'partner_track_select')).toEqual([]);
});

test('tr: the arrow keys move the radio group, keep focus on the chosen card, and each partner track fires once', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await page.getByRole('radio', { name: TRACK.tr.hr }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: TRACK.tr.sourcing })).toBeChecked();
  await expect(page.getByRole('radio', { name: TRACK.tr.sourcing })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: TRACK.tr.institute })).toBeChecked();
  await expect(page.getByTestId('partner-form-institute')).toBeVisible();
  expect((await pushed(page, 'partner_track_select')).map((e) => e.track)).toEqual([
    'sourcing',
    'institute',
  ]);
});

test('the sourcing and institute panels pass axe (the route sweep only sees the HR default)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  for (const key of ['sourcing', 'institute'] as const) {
    await page.locator(`label[for="track-${key}"]`).click();
    await expect(page.getByTestId(`partner-form-${key}`)).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include('[data-testid="partner-tracks"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        null,
        1,
      ),
    ).toEqual([]);
  }
});

test('metadata: package SEO strings, canonical, hreflang, OG image; one BreadcrumbList with the page own labels (W109), one FAQPage', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await expect(page).toHaveTitle(/^Recruitment Agency Partnership in Türkiye/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/partner-with-us`,
  );
  await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/ortak-olun`);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/ortak-olun`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/en/partner.png`,
  );
  const nodes = await jsonLdNodes(page);
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList');
  expect(crumbs).toHaveLength(1);
  expect((crumbs[0].itemListElement as { name: string }[]).map((i) => i.name)).toEqual([
    'Home',
    'Partner With Us',
  ]);
  const faqs = nodes.filter((n) => n['@type'] === 'FAQPage');
  expect(faqs).toHaveLength(1);
  expect(faqs[0].mainEntity as unknown[]).toHaveLength(6);
  // the site-wide Organization node once — the design's per-page EmploymentAgency block is not repeated
  expect(
    nodes.filter((n) => Array.isArray(n['@type']) && n['@type'].includes('EmploymentAgency')),
  ).toHaveLength(1);
  await expect(
    page.getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]'),
  ).toHaveText('Partner With Us');
});

test('tr: the sourcing form requires the licence declaration AND the consent tick (W79), keeps what was typed, posts nothing', async ({
  page,
}) => {
  await page.goto(`${ROUTES.tr}#track-sourcing`);
  const form = page.getByTestId('partner-form-sourcing');
  await expect(form).toBeVisible();
  await form.getByLabel(/^Ajans adı/).fill('Karachi Manpower');
  await form.getByLabel(/^İletişim kişisi/).fill('Bilal Khan');
  await form.getByLabel(/^Ülke/).selectOption('PK');
  await form.getByLabel(/^İşe alım lisans numarası/).fill('OEP-1234');
  await form.getByLabel(/^E-posta/).fill('bilal@example.com');
  await form.getByLabel(/^Telefon \/ WhatsApp/).fill('+92 300 1234567');
  await form.getByRole('button', { name: /^Başvuruyu gönder/ }).click();
  await expect(form.locator('#f-partner-sourcing-licenceDeclaration-error')).toHaveText(
    'Bu alan zorunludur.',
  );
  await expect(form.locator('#f-partner-sourcing-consent-error')).toHaveText(
    'Devam etmek için aydınlatma metnini onaylamanız gerekir.',
  );
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByLabel(/^Ülke/)).toHaveValue('PK');
  await expect(form.getByLabel(/^Ajans adı/)).toHaveValue('Karachi Manpower');
});

test('tr: the HR-agency form (hire) ends on the D11 panel without a door (W92) — bare wa.me href, click-time prefill (W76/W95)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('partner-form-hr');
  await form.getByLabel(/^Ajans adı/).fill('Akdeniz İK A.Ş.');
  await form.getByLabel(/^İletişim kişisi/).fill('Ayşe Yılmaz');
  await form.getByLabel(/^Türkiye’deki şehir/).fill('Antalya');
  await form.getByLabel(/^Kurumsal e-posta/).fill('ayse@example.com');
  await form.getByLabel(/^Telefon \/ WhatsApp/).fill('+90 532 000 00 00');
  await form.getByRole('checkbox').check(); // W79: the consent tick
  await form.getByRole('button', { name: /^Başvuruyu gönder/ }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByLabel(/^Ajans adı/)).toHaveValue('Akdeniz İK A.Ş.');
  await expectBareWhatsAppFallback(page, panel, 'Akdeniz İK A.Ş.');
});

test('en: the institute form (partner) ends on the D11 panel without a door (W92)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(`${ROUTES.en}#track-institute`);
  const form = page.getByTestId('partner-form-institute');
  await expect(form).toBeVisible();
  await form.getByLabel(/^Institute name/).fill('Lahore Technical Institute');
  await form.getByLabel(/^Contact person/).fill('Sara Ahmed');
  await form.getByLabel(/^City/).fill('Lahore');
  await form.getByLabel(/^Country/).selectOption('PK');
  await form.getByLabel(/^Email/).fill('sara@example.com');
  await form.getByLabel(/^Phone \/ WhatsApp/).fill('+92 42 1234567');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: /^Send application/ }).click();
  await expect(form.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unauthorized');
  await expect(form.getByLabel(/^Country/)).toHaveValue('PK');
  expect(new URL(page.url()).pathname).toBe(ROUTES.en);
});

test('tr: the hero WhatsApp (static prefill, W95) and the FAQ ask card e-mail row (W83) fire their events with page_cta (W12)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const heroWa = page.getByTestId('partner-hero').locator(`a[href^="${WA}?text="]`);
  await expect(heroWa).toHaveCount(1);
  const href = (await heroWa.getAttribute('href')) ?? '';
  expect(decodeURIComponent(href.split('?text=')[1])).toBe(
    'Merhaba JobsAdmire, bir iş ortaklığı hakkında görüşmek istiyorum.',
  );
  await heroWa.click();
  const mail = page
    .getByTestId('partner-faq')
    .locator('a[href^="mailto:info@jobsadmire.com?subject="]');
  await expect(mail).toHaveCount(1);
  await mail.click();
  expect(await pushed(page, 'whatsapp_click')).toEqual([
    { event: 'whatsapp_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  expect(await pushed(page, 'email_click')).toEqual([
    { event: 'email_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
});

test('desktop: the sticky bar carries Call / WhatsApp / #tracks, tracks the call, pads the scroll by its height and yields to the closing band (W18/W81)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar renders from 901 px; below it the mobile bottom bar owns the space');
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(bar).toBeVisible();
  await expect(bar.locator(`a[href="${TEL}"]`)).toHaveCount(1);
  await expect(bar.locator(`a[href^="${WA}?text="]`)).toHaveCount(1); // the static prefill only (W95)
  await expect(bar.locator('a[href="#tracks"]')).toHaveCount(1);
  await bar.locator(`a[href="${TEL}"]`).click();
  expect(await pushed(page, 'call_click')).toEqual([
    { event: 'call_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  // delta 12 / D20: while the bar is up, a focused or scrolled-to control lands above it
  const height = await bar.evaluate((el) => (el as HTMLElement).offsetHeight);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom))
    .toBe(`${height}px`);
  await page.getByTestId('partner-closing').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom))
    .toBe('0px');
});
```

- [ ] **Step 2: Run to verify it fails**

No server may start before Cycle 7 (W126). The unit-level red, and proof that the spec compiles and is collected:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/lib/seo/unbuilt.test.ts
npx playwright test e2e/pages/partner.spec.ts --list
```
Expected: `unbuilt.test.ts` FAILS — `'/partner-with-us'` has no `page.tsx` yet but is no longer in the set (`expected [...] to deeply equal [..., '/partner-with-us', ...]`); the listing prints `Total: 30 tests in 1 file` (15 cases × the `mobile` and `desktop` projects). Against the current tree every page case would fail on its first `goto` (`/ortak-olun` answers 404 through the `[...rest]` catch-all); the spec executes exactly once, green, in Cycle 7's gate.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/page.tsx`:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { SEO_IDS, STICKY_IDS } from './_lib/content';
import { countryOptions } from './_lib/country-options';
import { PARTNER_LOGOS } from './_lib/logos';
import type { TrackKey } from './_lib/tracks';
import { Chain } from './_sections/Chain';
import { CLOSING_ID, Closing } from './_sections/Closing';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Logos } from './_sections/Logos';
import {
  HrAgencyForm,
  InstituteForm,
  SourcingPartnerForm,
  type FormDoor,
} from './_sections/PartnerForms';
import { Portal } from './_sections/Portal';
import { Process } from './_sections/Process';
import { TrackPanel } from './_sections/TrackPanel';
import { Tracks } from './_sections/Tracks';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The page record `partner` names the package's SEO pair (partner.222/223, W23 — no
  // sys.seo.partner.*); the fallbacks repeat the same ids so the call stays honest if the record
  // ever loses them. OG image: /og/{locale}/partner.png (CDN-cached, W123).
  return buildMetadata({
    locale,
    href: '/partner-with-us',
    bundle,
    pageKey: 'partner',
    fallbackTitle: t(SEO_IDS.title),
    fallbackDescription: t(SEO_IDS.description),
  });
}

/**
 * Partner With Us (WP2b T5). Server-rendered sections over the LOCAL/OPS bundle; one client
 * island (`TrackChooser`, W96) that shows one of three server-rendered track panels, each with
 * its own kernel form — HR agency → `hire` (W3), sourcing partner / training institute →
 * `partner` + `track` (W16). No `<main>` (the `(site)` layout owns it, R31); no `revalidate`
 * (no D17 dated badge, W150). The h1 is the LCP element (gradient hero, §10 #4).
 */
export default async function PartnerWithUs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  // W95: the page's own wa.me links (hero, sticky bar) carry only this static copy.
  const whatsappHref = waLink(settings.whatsappNumber, sys('partner.whatsapp.prefill'));
  const door: FormDoor = {
    turnstileSiteKey: settings.turnstileSiteKey,
    whatsappNumber: settings.whatsappNumber,
    contact: { phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email },
  };
  // W3/W25: the ISO-2 select — the 13 source countries first, the other rows by locale name.
  const countries = countryOptions(
    getCollection(bundle, 'sourceCountries'),
    getCollection(bundle, 'countries'),
    locale,
  );
  const panels: Record<TrackKey, ReactNode> = {
    hr: (
      <TrackPanel track="hr" tf={tf}>
        <HrAgencyForm locale={locale} tf={tf} door={door} />
      </TrackPanel>
    ),
    sourcing: (
      <TrackPanel track="sourcing" tf={tf}>
        <SourcingPartnerForm locale={locale} tf={tf} door={door} countries={countries} />
      </TrackPanel>
    ),
    institute: (
      <TrackPanel track="institute" tf={tf}>
        <InstituteForm locale={locale} tf={tf} door={door} countries={countries} />
      </TrackPanel>
    ),
  };

  return (
    <>
      <Hero
        locale={locale}
        tf={tf}
        metrics={metricValues(bundle, locale)}
        whatsappHref={whatsappHref}
      />
      <Logos logos={PARTNER_LOGOS} />
      <Chain tf={tf} />
      <Tracks tf={tf} panels={panels} />
      <Process bundle={bundle} locale={locale} tf={tf} />
      <Portal bundle={bundle} locale={locale} tf={tf} androidUrl={settings.storeLinks.android} />
      <Faq
        bundle={bundle}
        locale={locale}
        tf={tf}
        whatsappNumber={settings.whatsappNumber}
        whatsappText={sys('partner.faq.whatsappText')}
        phone={settings.phone}
        email={settings.email}
        emailSubject={sys('partner.faq.emailSubject')}
      />
      <Closing
        bundle={bundle}
        locale={locale}
        tf={tf}
        phone={settings.phone}
        phoneDisplay={settings.phoneDisplay}
        email={settings.email}
      />
      {/* W18/W81: the design's bar — Call / WhatsApp / "Choose your partnership" (contact hrefs
          tracked page_cta by the bar itself). It keys on the closing band, which repeats the
          Apply/Call pair: `#tracks` sits ~1,000 px down, and a bar keyed on it would never show
          (delta 12); html's scroll-padding-bottom keeps focused fields above it. */}
      <StickyCtaBar
        message={tf(STICKY_IDS.message)}
        ctas={[
          { label: tf(STICKY_IDS.call), href: telLink(settings.phone), variant: 'secondary' },
          { label: tf(STICKY_IDS.whatsapp), href: whatsappHref, variant: 'success', external: true },
          { label: tf(STICKY_IDS.tracks), href: '#tracks' },
        ]}
        hideNearId={CLOSING_ID}
        live
      />
    </>
  );
}
```

`src/app/globals.css` — in the `html { … }` rule (the one that begins `scroll-behavior: smooth;` and sets `color: var(--color-ink);`), add directly after `scroll-behavior: smooth;`:

```css
  /* D20 / WCAG 2.4.11 (T5): a page-mounted StickyCtaBar publishes its height as --sticky-cta-h
     (0px while hidden and below lg); the browser then keeps a focused or scrolled-to control
     above the bar instead of under it. Nothing moves on a page without a visible bar. */
  scroll-padding-bottom: var(--sticky-cta-h, 0px);
```

`docs/SEO.md` — in the `## Pages` table T1 created (columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`), append after its last row:

```markdown
| Partner With Us | `/ortak-olun` · `/en/partner-with-us` | the page record `partner` → `partner.222` / `partner.223` (package SEO strings; no `sys.seo.partner.*`, W23); OG image `/og/{locale}/partner.png` (CDN-cached, W123) | `absoluteUrl(locale, '/partner-with-us')` | site-wide `Organization`/`EmploymentAgency` + `WebSite` (locale layout — the design's per-page `EmploymentAgency` block is not repeated); `BreadcrumbList` from `Breadcrumbs` (`partner.016` → `partner.008`, W109); `FAQPage` from `FaqBlock` (`partner.170`–`181`, AEO only) | `h1` (`data-lcp-slot="h1"`, `partner.023`) — gradient hero, no photo slot (§10 #4) | placeholders `partner-portal-screen`, `partner-portal-mobile`; not a D27 pixel page (Fable side-by-side review); no `revalidate` (no dated badge, W150) |
```

`docs/ANALYTICS.md` — two edits:
1. § Event schema, the table row whose event cell is `` `partner_track_select` ``: replace its "Fires on" cell text `Partner page — a track is chosen` with `Partner page — the visitor picks the sourcing-partner or training-institute card in the track chooser (T5); the HR-agency card is the default panel and a #track-<key> deep link preselects silently, so neither fires (W67)`.
2. Under `### Page instrumentation (WP2b)`, append after the last bullet:

```markdown
- **Partner With Us (`/ortak-olun`, `/en/partner-with-us`, T5):** `partner_track_select` from the track chooser (`src/app/[locale]/(site)/partner-with-us/_components/TrackChooser.tsx`) when the visitor picks the sourcing-partner or institute card — `track` ∈ `sourcing | institute` (W26/W67), `page` = the real pathname (R35); the HR-agency card is the default and a `#track-<key>` deep link preselects silently, so neither fires, and the arrow keys move the radio group (one event per partner track reached). `whatsapp_click` (`page_cta`) from the hero's "WhatsApp us", the sticky bar and the FAQ ask card (static `sys.partner.*` prefills only, W95); `call_click` (`page_cta`) from the sticky bar, the ask card and the closing band's phone; `email_click` (`page_cta`) from the ask card's e-mail row (W83) and the closing legal line. The three forms' fallback panels fire the contact events with `placement: 'form_fallback'`. The page fires no lead event itself: `generate_lead`/`conversion` for `form_key: 'hire'` (the HR-agency track, W3) and `'partner'` (sourcing, institute) come from `ConversionPing` on `/tesekkurler`. The header CTA, the hero/sticky/closing `#tracks` CTAs and the jump links are same-page anchors and fire nothing.
```

`docs/PRD.md` — two in-place edits (W45):
1. §2, the table row whose second cell is `Partner With Us`: replace its last cell (`Partner inquiry form (\`INQUIRY\`)`) with `Three track forms on two keys (W3/W16): HR agency → \`hire\` + \`iAm: 'hr_agency'\` + \`country: 'TR'\` (\`INQUIRY\`, HR_AGENCY — the Turkey sales team); sourcing partner and training institute → \`partner\` + \`track\` + an ISO-2 \`country\` (\`INQUIRY\`, SOURCING_PARTNER); the sourcing form also requires a licence/no-fee declaration tick`.
2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`): in whatever wording T1–T4 and T13 left it, count Partner With Us as built — decrement the "N of the 14 core pages" figure by one and add "Partner With Us (WP2b T5)" to the list of designed pages that sentence names — keeping the rest of the sentence as it stands (W45: edit in place, never re-add WP1 wording).

`docs/ARCHITECTURE.md` — the paragraph that begins "**`StickyCtaBar` is page-mounted**": append after its last sentence (the one ending "…the bar's wrapper carries `data-testid="sticky-cta"`."):

```markdown
`html` carries `scroll-padding-bottom: var(--sticky-cta-h, 0px)` (`src/app/globals.css`, T5, D20): while a bar is visible the browser keeps a focused or scrolled-to control above it (WCAG 2.4.11) — which is what lets a page key its bar past its own forms (Partner With Us keys on its closing band, since `#tracks` sits too high for `isBarVisible` to ever show a bar keyed on it); `0px` otherwise, so nothing moves on a page without a bar.
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us/page.tsx" e2e/pages/partner.spec.ts e2e/routes.ts src/lib/seo/routes.ts src/app/globals.css docs/SEO.md docs/ANALYTICS.md docs/PRD.md docs/ARCHITECTURE.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: clean — `unbuilt.test.ts` agrees again (key deleted ↔ `page.tsx` exists), `scripts/gate-routes.test.ts` sees the two new rows (EN/TR parity), `sitemap.test.ts`/`robots.test.ts`/`routes.test.ts` derive from the set and stay green; typecheck covers `e2e/pages/partner.spec.ts`; the page file has no unit test of its own — it composes the tested sections and is proven by the Cycle 7 build + gate.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/partner-with-us/page.tsx" e2e/pages/partner.spec.ts e2e/routes.ts src/lib/seo/routes.ts src/app/globals.css docs/SEO.md docs/ANALYTICS.md docs/PRD.md docs/ARCHITECTURE.md
git commit -m "feat(partner): the Partner With Us page — hero, chain, #tracks chooser with three track forms, process, portal, FAQ, closing, sticky bar; page e2e; docs (T5 c6)

/partner-with-us leaves UNBUILT_PATHNAMES (W20); both locale paths join GATE_ROUTE_TABLE (W21);
id=\"tracks\" for the W17 header CTA (W152/W158); h1 is the LCP element (§10 #4, D26); the bar
keeps the design's Call/WhatsApp (W81) and html pads the scroll by its height (D20); the e2e is
deterministic without a door (W92). Docs: SEO page row, ANALYTICS wiring, PRD forms row + §11,
ARCHITECTURE scroll padding.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 7 — the W126 proof session: one build, one start, the gate, js-size, the W96 island size, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome.

- [ ] **Step 1: Pre-flight — no new test (the Cycle 6 page spec and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
grep -n "ortak-olun\|/en/partner-with-us" e2e/routes.ts   # 2 hits, both `indexable: true` (W21)
grep -n "'/partner-with-us'" src/lib/seo/routes.ts          # no hit (the UNBUILT key is gone, W20)
grep -n "hash: '#tracks'" src/design/chrome/ctas.ts         # the CTA_BY_PATHNAME['/partner-with-us'] primary — untouched (W17/W121)
ls -a | grep '^\.env'                                       # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'door-less, GTM-dark'
git status --short                                          # clean: Cycles 1–6 are committed
```
Expected: exactly as annotated. A door variable or an `.env.local` must be removed from this shell/worktree before building — the page spec must meet the door-less face (W92) and a GTM id would put third-party script into the measured budget (W146). If a route fact differs, WP2a or an earlier page task drifted: stop and report; never "fix" the route list or the CTA table from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
rm -rf .next .lighthouseci lighthouse-report test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/partner-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/ortak-olun && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds — it is the first time the RSC boundaries of `page.tsx` → sections → the `'use client'` `TrackChooser`/`DeclarationCheckbox`/`FormShell`/`Field`/`Accordion`/`StickyCtaBar`/`ContactLink` and the three server actions passed through the chooser's `panels` prop are compiled (jsdom could not see them); the build's route table lists `/[locale]/partner-with-us` as prerendered for both locales (no `headers()`/`cookies()` in the page — only the server actions read the request, at submit time); `up` is printed. A build error is fixed in the source, committed after the verify line, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, the island size, the launch anchor check**

```bash
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
for f in $(grep -rl --include='*.js' 'partner-track-chooser' .next/static/chunks); do printf '%s %s B gz\n' "$f" "$(gzip -9c "$f" | wc -c | tr -d ' ')"; done
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/partner-gate-launch.log" 2>&1 || true
grep -n 'missing id="tracks"' "$TMPDIR/partner-gate-launch.log" || echo 'no missing #tracks anchor'
```
Expected:
- **Gate** (localhost wears the production face → `lighthouserc.local.json`, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/partner.spec.ts` 29 passed + 1 skipped (the sticky-bar case skips on `mobile` by design), and `routing` (page contract on `/ortak-olun`, `/en/partner-with-us`), `seo` (canonical/hreflang, sitemap lists both, every sitemap URL 200), `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on both routes under both projects; `region` clean at 390/1000/1440), `width-sweep` (no horizontal overflow at 1440…390 incl. 1101/1100 and 901/900), `chrome` (every earlier page's header CTA still lands), `headers`, `thank-you` all green; the two token cases of `ops.spec.ts` skip without `REVALIDATE_SECRET` (as at WP2a). `lhci assert` passes on every indexable gate route; on `/ortak-olun` and `/en/partner-with-us` (median of 3 DevTools-throttled runs): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the h1), CLS ≤ 0.1.
- **js-size** (W136 — the ledger's figure): both partner routes below the 194,560 B lazy line. Projection: the WP2a close measured the shell at 176,132 B (TR) / 172,783 B (EN) locally; this page adds the forms kernel's client graph (`FormShell`, `Field`, `FormErrorsContext`, `FallbackPanel`, the `Turnstile` loader, `guardAction`, `echo`, `errors` — ≈ 7–8 KB gz, shared with T1/T2's forms but counted per route), `TrackChooser` + `DeclarationCheckbox` + the page icons (≈ 2–3 KB) and `StickyCtaBar` (≈ 1 KB; `ContactCta`/`ContactLink`/`Button`/`Accordion` already ship with the chrome) → ≈ 186–188 KB (TR) / 183–185 KB (EN) locally, ≈ 189–191 KB on a preview. `LazyIsland` would not lower it: it loads on viewport only, and the forms ARE this page's content (W132, T1's finding). The LCP column should read the h1 at ≈ 1.5–2.0 s. A route above 194,560 B → Cycle 8 before T6 starts (W13 amended).
- **Island size** (W96): one chunk carries `partner-track-chooser` (the island module, possibly bundled with `DeclarationCheckbox` and the page icons); its gzip-9 size ≈ 2–3 KB and ≤ 6,144 B. Above 6,144 B → report the chunk's module list to the controller (W96 is the exception's condition); never move the chooser behind `next/dynamic` without a ruling.
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (other pages' unbuilt routes and anchors), but the grep prints `no missing #tracks anchor` — the anchor half's lines (`CTA_BY_PATHNAME['/partner-with-us'].primary (/partner-with-us#tracks): <locale> <path> → missing id="tracks" …`, `scripts/launch/dead-targets.ts`) no longer name `/ortak-olun` or `/en/partner-with-us`, and the dead-href half no longer lists them either (the page answers 200).

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID). `.lighthouseci/` and `lighthouse-report/` hold no secret on a localhost run, but are never committed.

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T5 row to the `## Ledger` table in T1's row format (W98), filled from this session (the "**Ledger line**" template at the end of this task — every `<…>` from Steps 3–4; none typed from memory):
- routes `/ortak-olun` · `/en/partner-with-us`; js-size per route; the TrackChooser chunk size (W96); the Lighthouse medians (perf / a11y / BP / SEO / LCP of the h1 / CLS) per route;
- pixel: not a D27 page — "Fable side-by-side review" and the named deltas 1–15 at the top of this task;
- WP-C sheet: `partner.090`/`091` (the KVKK sentence the kernel consent replaces, W79), `partner.114` (the declaration, rendered verbatim), `partner.185` "Bizi arayın" and the package's first-person lines (`partner.024`, `025`, `048`, `073`, `101`, `121`, `171`, `173`, `177` — W154 note: package copy waits for WP-C), `partner.088`/`089`, `135`, `162`/`163` unused;
- owner note: `settings.partnershipsPhone` (+90 553 383 25 49) exists for the Contact page's partner topic; this page's design uses the main line everywhere — confirm or switch the Call/tel CTAs in a later content change;
- launch anchor sweep: `#tracks` present in both locales (W152/W158).

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(partner): T5 ledger row — gate, js-size, TrackChooser chunk, Lighthouse medians, launch anchor sweep (T5 c7)

Localhost proof session (W126/W145): one build, one gate, both partner routes under the
194,560 B lazy line; the W96 island chunk under 6 KB gz; #tracks present for
CTA_BY_PATHNAME['/partner-with-us'] in both locales (W152/W158).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 8 — conditional: the lazy pass (W13 amended)

Run this cycle only if Cycle 7's `js-size` reads above 194,560 B on `/ortak-olun` or `/en/partner-with-us`; otherwise the task ends with Cycle 7. It is the task's only second build. The only lever this page owns without a ruling is the sticky bar (≈ 1 KB; it renders `null` until the visitor has scrolled 700 px and never below 901 px): W96 keeps `TrackChooser` eager, and the forms kernel is the page's content and shared with T1/T2/T8.

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/partner-with-us/_components/__tests__/LazyStickyBar.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LazyStickyBar } from '../LazyStickyBar';

describe('LazyStickyBar', () => {
  it('renders the DOM-identical fallback (nothing) until its wrapper nears the viewport (W132)', () => {
    const { container } = render(
      <LazyStickyBar message="m" ctas={[{ label: 'x', href: '#tracks' }]} hideNearId="closing" />,
    );
    expect(container.firstElementChild?.tagName).toBe('DIV'); // LazyIsland's wrapper
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  it('reaches the bar only through the dynamic import (no static runtime edge)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/partner-with-us/_components/LazyStickyBar.tsx'),
      'utf8',
    );
    expect(src).not.toMatch(
      /^import \{[^}]*StickyCtaBar[^}]*\} from '@\/design\/chrome\/StickyCtaBar'/m,
    );
    expect(src).toContain("import('@/design/chrome/StickyCtaBar')");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 partner-with-us/_components/__tests__/LazyStickyBar
```
Expected: FAIL — `Failed to resolve import "../LazyStickyBar"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/partner-with-us/_components/LazyStickyBar.tsx`:

```tsx
'use client';
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { LazyIsland } from '@/design/islands/LazyIsland';

type Props = {
  message: string;
  ctas: StickyCta[];
  showAfterPx?: number;
  hideNearId?: string;
  live?: boolean;
};

/** W13 amended lazy pass: the bar renders `null` until the visitor has scrolled past
 *  `showAfterPx`, so `null` is its DOM-identical fallback (W132 — `{ load, props, fallback,
 *  rootMargin? }`, no `ssr`). The page mounts this right after the hero, so the module loads
 *  (200 px ahead) before the 700 px threshold is reached. A server page cannot pass `load` (a
 *  function) to a client component, hence this one-line client wrapper. */
export function LazyStickyBar(props: Props) {
  // The explicit <Props>: inferring P through `.then` on a named export widens to `never`.
  return (
    <LazyIsland<Props>
      load={() =>
        import('@/design/chrome/StickyCtaBar').then((m) => ({ default: m.StickyCtaBar }))
      }
      props={props}
      fallback={null}
    />
  );
}
```

and in `page.tsx`: replace the import `import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';` with `import { LazyStickyBar } from './_components/LazyStickyBar';`, delete the `<StickyCtaBar … />` element at the end of the fragment, and insert `<LazyStickyBar … />` (the same props) directly after `<Hero … />`.

- [ ] **Step 4: Verify, then the re-proof session**

```bash
npx prettier --write "src/app/[locale]/(site)/partner-with-us"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add "src/app/[locale]/(site)/partner-with-us"
git commit -m "perf(partner): the sticky bar behind LazyIsland — below the 194,560 B lazy line (W13 amended, W132)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
rm -rf .next .lighthouseci-extra
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/partner-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/ortak-olun && echo up
E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/partner.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts
E2E_BASE_URL=http://localhost:3000 npm run js-size -- --routes=/ortak-olun,/en/partner-with-us
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: the three specs green (the sticky case still passes: the wrapper sits after the hero, so the bar is loaded before 900 px of scroll); both routes below 194,560 B in the W94 spot-check — if a route is still above it, stop and report the route's client-manifest breakdown to the controller (no further change without a ruling); `no stray processes`.

- [ ] **Step 5: Commit**

Update the T5 row of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the re-measured js-size, `LazyStickyBar: yes`), then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(partner): T5 ledger — js-size after the lazy sticky bar (W13 amended)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` — the Partner With Us bullet in the per-page `sys.*` list under `### Adding copy (W9, W23, W54)` (Cycle 1, with the keys). `docs/SEO.md` — the Partner With Us row of T1's `## Pages` table, naming the LCP element (the h1 — gradient hero, no photo slot) and the two placeholders (Cycle 6). `docs/ANALYTICS.md` — the `partner_track_select` row's "Fires on" cell and the Partner With Us bullet under `### Page instrumentation (WP2b)` (Cycle 6; no new event or parameter). `docs/PRD.md` — §2 row 4's "Forms carried" cell (three track forms, two keys) and the §11 "Not yet built" page count, edited in place (Cycle 6, W45). `docs/ARCHITECTURE.md` — one sentence appended to the "**`StickyCtaBar` is page-mounted**" paragraph (the `html` scroll padding, Cycle 6). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T5 `## Ledger` row (Cycle 7; updated in Cycle 8 if it runs). No `docs/INTEGRATIONS.md` change: every field sent is in catalog v1.0 + v1.1 (`hire.city`, `partner.city`, `partner.track`), and T14 writes the I4 instance map (rows 6–8 match the wire listed under **Interfaces → Produces**).

**Sys keys added:** 3 keys, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `_lib/__tests__/content.test.ts`:
- `sys.partner.whatsapp.prefill` — TR "Merhaba JobsAdmire, bir iş ortaklığı hakkında görüşmek istiyorum." / EN "Hello JobsAdmire, I would like to discuss a partnership." (the hero's and the sticky bar's WhatsApp prefill; the design's own EN wording)
- `sys.partner.faq.whatsappText` — TR "Merhaba JobsAdmire, iş ortaklığıyla ilgili bir sorum var." / EN "Hello JobsAdmire, I have a partnership question." (the FAQ ask card's WhatsApp prefill)
- `sys.partner.faq.emailSubject` — TR "İş ortaklığı sorusu" / EN "Partnership question" (the ask card's `mailto:` subject)

No `sys.seo.partner.*` (the page record carries `partner.222`/`223`), no `sys.form.countries` (W25: the ISO-2 select reads the collections), no radiogroup legend key (`partner.064` is the package's own "Who are you?") and no e-mail-row label key (`partner.117`, W83 takes an id).

**Package ids used:** 162 `partner.*` ids, every one verified present in `src/content/local/catalogue.json` and in both generated bundles (all 223 `partner.*` ids exist) — first `partner.002`, last `partner.223`: `partner.002`, `008`, `016` (the chain link and this page's crumbs, W23/W109), `023`–`033` (hero), `035`, `036`, `038`, `040`–`044`, `046` (network card — `038`/`040` also as track-card titles), `047`–`058` (chain), `059`, `060` (sticky bar), `061`–`087` (tracks, panels, the HR form head), `092`–`134`, `136` (form labels, the sourcing and institute panels, the declaration), `137`–`161`, `164`–`166` (process, portal), `167`–`190` (FAQ, closing), `222`, `223` (SEO, through the page record). Read through a block: `hire.240` (`StoreBadges`' Google Play label, W7). Not read (61, pinned by the same test): `partner.001`, `003`–`007`, `009`–`015`, `017`–`022` (chrome and the `CTA_BY_PATHNAME` pair — R15/W17), `034` (hero photo alt — gradient hero), `037`, `039`, `045` (captions of the unsigned 5+/20+/25+ figures — W1), `088`, `089` (inline success banner — D13), `090`, `091` (KVKK sentence — W79, WP-C sheet), `135` ("City, country" — split into `city` + the ISO-2 select), `162`, `163` (store micro-copy — W7), `191`–`221` (footer chrome — R15).

**CLIENT_SYS additions:** none. The two `'use client'` modules of this task call no `useTranslations`: `TrackChooser` receives every string resolved on the server, and `DeclarationCheckbox` reads `sys.form.errors.*` only through the kernel's `useFieldError` (in `FormErrorsContext`, whose `form` namespace is already listed) — `src/i18n/client-messages.ts` stays `consent, languageHint, errorTitle, errorRetry, form` and `client-messages.test.ts` needs no change (W148).

**Foundation gaps:** none blocking; every name this task consumes exists at `7bacd7e` and was checked in the code. Notes:
1. Catalog v1.1 (WP2a Task 8, being implemented now): `hire.city`, `partner.city` and `partner.track` are cited as `A/produces-final.md` § Task 8 spells them (`city?: string` ≤ 120; `track?: 'sourcing' | 'institute'`, inbox tag `[website:partner:<track>]`) — the wire names are to be confirmed by the Task 8 report. Until Operations runs v1.1, a stray `city`/`track` is dropped into `dropped` with a 200 (no error; the institute/sourcing distinction then survives only in the inbox's absence of a tag), and the door-less gate is unaffected either way.
2. `StickyCtaBar` has no "hide while the target is in view" mode (the design hides its bar only while `#tracks` sits in the 35–75 % viewport band); `isBarVisible` hides a bar for good once its target nears or passes, so a bar keyed on this page's high `#tracks` would never show. The page keys the bar on its closing band (delta 12) and closes the resulting focus-obscuring risk site-wide with one additive declaration in `src/app/globals.css` (`html { scroll-padding-bottom: var(--sticky-cta-h, 0px) }`, documented in ARCHITECTURE) — a foundation-file edit made here because this is the first page whose bar rides over forms; the controller may prefer to fold it into a foundation task.
3. `RadioChips`' `RadioChipOption = { value, label }` cannot carry the design's icon/body/CTA card — ruled (reconcile, `check.md` foundation_gaps_to_rule): the page-local native-radio cards on the same pattern (`fieldset role="radiogroup"`, `peer sr-only` radios, `peer-focus-visible` ring).
4. The fallback panel's WhatsApp prefill (`WHATSAPP_FIELDS` in `src/forms/client/FallbackPanel.tsx`) carries name/company/email/phone/city/country/message but not `licence`, `trades` or `candidatesPerYear` — a sourcing partner who falls back to WhatsApp re-types those; a kernel list change if the owner wants them.
5. `LazyIsland` loads on viewport only (T1's finding): with no interaction-loaded wrapper, the forms kernel stays in this route's first-load graph — within budget per the Cycle 7 projection (≈ 186–191 KB), a concern only if a route crosses 194,560 B (Cycle 8).

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>` from Cycle 7):

```markdown
| T5 Partner With Us | `/ortak-olun` · `/en/partner-with-us` | js-size (local): `/ortak-olun` <n> B · `/en/partner-with-us` <n> B (ceiling 204,800; lazy line 194,560; projected ≈ 186–191 KB); TrackChooser chunk <n> B gz (≤ 6,144, W96); LazyStickyBar: <no/yes>; binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/ortak-olun` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; `/en/partner-with-us` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n> | not a D27 pixel page — Fable side-by-side review; named deltas 1–15 (D13 thank-you navigation, W79 consent + declaration ticks, W115 labels, W3/W16 ISO-2 select + city split + candidatesPerYear, W1/W6 signed rows only + no logo band, gradient hero with the h1 as LCP, native radio cards + #track-<key>, D20 faces, ProcessSteps rail, dark ClosingCtaBand, sticky bar keyed on #closing + html scroll padding, FAQ ask card at every width with the W83 e-mail row, stacked chain, chrome W17/W7/W8/W127); WP-C: partner.090/091, partner.114 verbatim, package first-person lines + partner.185 (W154 note); owner: settings.partnershipsPhone vs the main line; launch sweep: #tracks present both locales | <YYYY-MM-DD> |
```
