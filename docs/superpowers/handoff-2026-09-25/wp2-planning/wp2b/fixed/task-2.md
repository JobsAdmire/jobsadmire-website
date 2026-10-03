### Task 2: Hire Workers — `/isci-talebi` · `/en/hire-workers` (pixel-harness page, D27)

**Why this task exists.** The route is the site's main employer conversion page (design-package page 2, `design-package/design/Hire Workers.dc.html`, strings `design-package/strings/hireworkers.json`, ids `hire.001`–`hire.302`). WP1 shipped it as a spike (`src/app/[locale]/(site)/hire-workers/page.tsx` renders `<h1 data-testid="page-h1" data-lcp-slot="h1">{locale}</h1>`; its comment "No `pages.hire` record in the Phase A bundle yet" is stale — both bundles now carry the record). This task **replaces that spike** with the designed page on the built WP2a foundation: two `hire` forms through the forms kernel, the `sectors` / `sourceCountries` / `countries` / `metrics` collections, the build-time `SourceMap` + sprite `Flag`s, the shared blocks, the page-mounted `StickyCtaBar`, and the D26 LCP/placeholder markup contract. Every number is a metric (W1/D17), every string a package id through `makeTf` or a `sys.hire.*` key (W9/W23), every option value a stable key (W3/W77/W78), every contact anchor fires its click event with a placement (W12).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (HEAD ≥ `7bacd7e`). Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → **T2** → T3 → …: when this task starts, T1 has created the shared doc shapes (W98: the `docs/SEO.md` per-page table, `docs/ANALYTICS.md` `### Page instrumentation (WP2b)`, the per-page list under `docs/CONTENT-MODEL.md` `### Adding copy`, the `## Ledger` table of `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 has shipped `/privacy` (the consent link target). WP2a is fully built and reviewed; where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `7bacd7e`.

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first). The task ends with ONE proof session (W126, Cycle 7): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size`, the pixel harness, then the server is killed and no stray process is left. Playwright runs only inside that session (the page spec is written in Cycle 6 and executes there) — and inside Cycle 8's re-proof, the one conditional second build (a D27 pixel run 2 or the W13 lazy pass). Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified — read before touching anything).**
- Internal key `/hire-workers` → TR `/isci-talebi`, EN `/en/hire-workers` (`src/i18n/routing.ts` `pathnames`). Private folders (`_lib`, `_components`, `_sections`, `__tests__`) never become routes.
- Page record (both bundles): `bundle.pages.hire = { titleId: 'hire.264', descriptionId: 'hire.265', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` → `buildMetadata` uses the package's own SEO strings; **no `sys.seo.hire.*`** (W23). OG image `/og/{locale}/hire.png` (`OG_PAGE_KEYS` holds every page key; CDN-cached, W123).
- `CTA_BY_PATHNAME` (`src/design/chrome/ctas.ts`) has **no** `/hire-workers` key (W121: this task adds none), so the header renders `DEFAULT_CTAS`: primary `home.014`+`home.015` → `{ pathname: '/hire-workers', hash: '#request-form' }` in the `nav` Button variant (W155 — ink at rest, blue-safe on hover). **This page must render `id="request-form"`** (W152/W158: `gate:launch`'s anchor sweep walks `DEFAULT_CTAS` and lists `#request-form` on `/isci-talebi` and `/en/hire-workers` as missing until this task lands). The StickyCtaBar, the jump nav and every "Request workers" anchor target it too.
- `e2e/routes.ts` `GATE_ROUTE_TABLE` already lists `{ path: '/isci-talebi', indexable: true }` and `{ path: '/en/hire-workers', indexable: true }`; `UNBUILT_PATHNAMES` (`src/lib/seo/routes.ts`) never contained `/hire-workers`. This task **adds no gate row and deletes no UNBUILT key** (W20/W21).
- Settings used (LOCAL bundles): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` only where set), `storeLinks { android: <Play URL>, ios: null }`, `portal.host 'https://portal.jobsadmire.com'`. Metrics: `placed '470+'`, `employers '22+'`, `countries '13'` (value 13, no suffix). No `hire.*` string carries a `{metric}` placeholder today; the page still reads every id through `makeTf` (D17).
- The Hire Workers design hides **nothing** at ≤ 460 px (its ≤ 460 rules are the shared homepage classes `.ja-portal-panel`/`.ja-map-visual`, absent from this page); its ≤ 700 px rules are the ones this task ports (W10), at this repo's `md` = 701 px (`--breakpoint-md`, D19 — breakpoints are never scaled).

**Design deltas this page carries on purpose (named, so the pixel reviewer files them under (a)/(b) — D20/D27):**
1. D13: success navigates to `/tesekkurler?form=hire` instead of the inline "Request sent" panel (`hire.045`/`046` unused); both submits read `hire.063` (the request form's `hire.216` "Send Request on WhatsApp →" is unused). `hire.201`/`203`/`215` ("continues on WhatsApp") render as authored — `hire.201` is legal-flagged → WP-C sheet with the note that the form now posts to the team first.
2. W79: both forms carry the kernel's consent **checkbox** (`sys.form.consent.label`, link `/privacy`), rendered above the submit; the package KVKK lines (`hire.064`+`065` under the quick-quote, `hire.217`+`065`+`218` under the request form) are not rendered → WP-C sheet.
3. W3/W115: the quick-quote gains a required **Contact person** (`hire.053`); every input shows the package's own label (`hire.047`–`058`) above it, with the kernel's `sys.form.placeholders.*` examples.
4. The request form gains an optional **Message** textarea (`sys.form.labels.message`); its dial select posts an ISO-2 code over all 64 `countries` rows (the design's 13 emoji options are valued `+90`… and `+1`/`+7` are not unique).
5. W78: the "When do you need them?" options are the shared keys with the shared labels (`sys.form.options.startWhen.{asap,month1,months1to3,planning}`) — `hire.059`–`062` unused → WP-C sheet.
6. Industries: the foundation `Accordion` (string trigger "`01 · <sector>`") — the sector subtitle, the visible role chips and the "More roles" chips all sit in the panel; no row arrow (an interactive arrow nested in a clickable row fails axe `nested-interactive`); the design's arrival-note colour `#dff3a6` is white.
7. W14: the sourcing map is the build-time SVG (its arcs and pulses are CSS animations, drawn at once under reduced motion) without the design's hover tooltip; the flag chips wrap statically from 701 px and scroll in a pausable marquee at ≤ 700 px.
8. W6: the client-logo band (and the `employers` stat beside it) renders nothing until consented logos exist (§10 #11).
9. D26: the hero photo slot `hw-hero` is a named placeholder until the licensed stock pack lands (§10 #4) — the **h1 is the LCP element** until then.
10. D20 contrast: white-on-brand surfaces are `blue-safe` (quick-quote and request-card heads, the "More roles" panel, step numbers, the primary CTAs — including the design's green "Request workers →" and submit faces, since white on `#16a34a` is 3.3:1); every `#94a3b8` grey is `text-text-tertiary` on white, and `text-text-secondary` wherever the ground is `pale-1` (tertiary on `#f4f9fc` is 4.49:1 — the process sub-heading, the contact-tile labels); the hero's green metric (`#4ade80`, not a token) is `text-success-border`; ✓/× marks are SVG, never text glyphs.
11. W7/W155/WP2a Task 5: `hire.043` renders as corrected by the importer's override table; the sticky bar is the foundation's navy bar (the design's is white); the header CTA is the `nav` variant.
12. W1: the hero pills read the `metrics` collection — "470+" and "13" (the design hard-codes "13+"); the source-countries heading composes `hire.141` + metric + `hire.142` + `sys.hire.sc.titleTail` → TR "13+ ülkeden belgeli işçiler", EN "Vetted talent from 13+ countries" (`hire.142`'s leading "+" renders as authored → WP-C sheet).
13. FaqBlock shows the ask card's call row at every width (the design hides it ≤ 700 px; the block has no per-row breakpoint prop) and renders the foundation `Accordion` with `h3`-wrapped triggers (the design's questions are bare `<span>`s in `<button>`s).
14. FormShell's one submit face is `primary` (the design's quick-quote button is green).
15. The request section's DOM order is heading → form card → steps/trust/direct, so from 701 to 900 px the card follows the heading too (the design moves it up only at ≤ 700 px, with CSS `order`) — visual order equals focus order (D20). The portal block keeps the design's order at every width (its visual half holds no focusable element from 701 px).

Brief deviation (accepted as page-local by the WP2b reconcile): the process rail is `ProcessSteps variant="cards"` (the block built for this design), not a horizontal timeline.

**Files:**

Create
- `src/app/[locale]/(site)/hire-workers/actions.ts`
- `src/app/[locale]/(site)/hire-workers/__tests__/actions.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/tables.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/fragments.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/phone.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/countries.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/assets.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/tables.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/fragments.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/phone.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/countries.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/hire-spec.test.ts`
- `src/app/[locale]/(site)/hire-workers/_lib/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/hire-workers/_components/SectorPrefillLink.tsx` (`'use client'`)
- `src/app/[locale]/(site)/hire-workers/_components/icons.tsx` (server, no directive)
- `src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/JumpNav.tsx`, `ClientLogos.tsx`, `Industries.tsx`, `SourceCountries.tsx`, `Comparison.tsx`, `Process.tsx`, `PortalPreview.tsx`, `Faq.tsx`, `Hero.tsx`, `QuickQuote.tsx`, `RequestForm.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/__tests__/sections.test.tsx`
- `src/app/[locale]/(site)/hire-workers/_sections/__tests__/forms.test.tsx`
- `e2e/pages/hire.spec.ts`
- only if Cycle 8's lazy pass is triggered: `src/app/[locale]/(site)/hire-workers/_components/LazyStickyBar.tsx` and `src/app/[locale]/(site)/hire-workers/_components/__tests__/LazyStickyBar.test.tsx`

Modify
- `src/app/[locale]/(site)/hire-workers/page.tsx` — replace the whole WP1 spike (the default export `HireWorkers` rendering `<h1 …>{locale}</h1>` and its `generateMetadata` with `fallbackTitle: 'JobsAdmire'`)
- `src/messages/tr.json`, `src/messages/en.json` — add the `sys.hire` object (5 leaves) as a sibling of `sys.form`
- `docs/CONTENT-MODEL.md` — one bullet appended after the LAST bullet of the per-page `sys.*` list under `### Adding copy (W9, W23, W54)` (T13's Newsletter bullet at T2's turn, W98)
- `docs/SEO.md` — one row appended after the LAST row of the `## Pages` table T1 created (T13's `Newsletter unsubscribe` row at T2's turn, W98)
- `docs/ANALYTICS.md` — one bullet appended after the LAST bullet under `### Page instrumentation (WP2b)` (T13's Newsletter confirm/unsubscribe bullet at T2's turn, W98)
- `docs/PRD.md` — §2 row 2 (the table row whose page cell is `Hire Workers`) and, in the §11 sentence beginning "**Not yet built, by design (WP2 and later):**", the clause "Hire Workers is still the spike placeholder until T2" that T1 leaves for this task
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T2 row of the `## Ledger` table

Test
- Vitest: the six `_lib/__tests__/*.test.ts`, `__tests__/actions.test.ts`, `_components/__tests__/SectorPrefillLink.test.tsx`, `_sections/__tests__/{sections,forms}.test.tsx` (+ `_components/__tests__/LazyStickyBar.test.tsx` only if Cycle 8(b) runs)
- Playwright (both projects, in the gate only): `e2e/pages/hire.spec.ts`
- Existing, must stay green untouched: `src/design/__tests__/class-collisions.test.ts` (W155 — scans `src/app/**`, so every class string below is part of the gate), `src/design/__tests__/client-imports.test.ts` (W147/W156), `src/i18n/client-messages.test.ts` (W148), `src/messages/{messages,voice}.test.ts` (W154), `src/lib/seo/unbuilt.test.ts`, `e2e/{routing,seo,a11y,width-sweep,chrome,headers,thank-you}.spec.ts`

**Interfaces:**

Consumes (exact names, verified in the code at `7bacd7e`; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeT`, `makeTf`, `metricValues` from `@/content/adapter` (server-only; `export * from './pure'`); `makeTf`, `metricValues` from `@/content/pure` (tests); `getCollection`, `SECTOR_KEYS`, `type SectorKey`, `type Sector` from `@/content/collections` (collections `'sectors' | 'sourceCountries' | 'countries'`); `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: five levels up from `hire-workers/page.tsx`, six from `_lib/`/`_sections/`, seven from their `__tests__/`).
- Forms kernel (`src/forms/**`): `createFormAction`, `type FormActionState` from `@/forms/action` (`FormSpec = { key, schema, toFields(parsed, data, ctx: { visitor, locale }), consent?: 'checkbox' | 'notice' }`); `FormActionError` (`new FormActionError(visitorMessage, field?: { name, code })`) and `IDLE_FORM_STATE` from `@/forms/types`; `fieldErrorsFromIssues` from `@/forms/errors` (a named code in `message` wins; `invalid_enum_value` with `received: ''` → `required`); `type WireFields` from `@/forms/wire`; `CONSENT_VERSION` from `@/forms/consent`; `START_WHEN_KEYS` (`['asap','month1','months1to3','planning']`) from `@/forms/options`; `FormShell` from `@/forms/client/FormShell` — props used: `action, formKey, idScope, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, consent, headingLevel, testId` (no `consentLinkHref` — its only value `'/privacy'` is the default, W79); every id derives from `idScope ?? formKey` (`f-<scope>-<name>`, `f-<scope>-consent`, `f-<scope>-honeypot`); `Field`, `type FieldOption` from `@/forms/client/Field` — props used: `name, label, hint, placeholder, required, as, type, options, autoComplete, inputMode, min, rows, maxLength, defaultValue` (the select branch ignores `placeholder`, W111; `hint=""` renders no hint); the D11 `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, bare `https://wa.me/<n>` anchor, prefill via `window.open` on click — W76).
- Chrome/analytics: `StickyCtaBar`, `type StickyCta` (`{ label, href, variant?, external? }`) from `@/design/chrome/StickyCtaBar` (props `message, ctas, showAfterPx?, hideNearId?, live?`; renders `null` while hidden; wrapper `data-testid="sticky-cta"`; `--sticky-cta-h`; contact hrefs through `ContactCta` `page_cta`, W81); `ContactLink` from `@/analytics/ContactLink` (`'use client'`; `{ href, placement, …anchor props }`).
- Blocks (by path): `Breadcrumbs` (`{ locale, items: { name, href }[], tone?: 'light'|'dark', className? }`, emits `BreadcrumbList`), `FaqBlock` + `type FaqItem` (`{ bundle, locale, items, id?, eyebrowId?, headingId?, bodyId?, askCard?, singleOpen?, openFirst?, headingLevel? }`, emits `FAQPage`, renders `id` on its root), `ProcessSteps` + `type ProcessStep` (`{ n, titleId, bodyId, when? }`; `variant: 'cards'|'plain'`, `headingLevel: 3|4`), `ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }` — owns its box `w-full h-auto object-cover` + inline aspect ratio; `className` only for a radius/border, W129), `StoreBadges` (`{ bundle, locale, android, ios?, tone? }`), `LogoMarquee` + `type Logo`, `ContactCta` (`{ placement: 'page_cta'|'office_card', href, variant?, size?, external?, className?, children }`) — each from `@/design/blocks/<Name>`.
- Primitives (by path): `Button` (`variant` ∈ `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`, `size`, `href`, `external`, `className`) from `@/design/primitives/Button`; `Accordion` + `type AccordionItem` (`{ id, title: string, body }`; `singleOpen`, `defaultOpenId`, `headingLevel`); `Eyebrow`; `PausableMarquee` (`{ children, durationSec, labelPause, labelPlay }`); `Section` (`{ tone: 'light'|'dark'|'pale'|'band', id?, className?, children }` — tones set `py-16` and the background colour).
- Assets: `SourceMap`, `sourceMapLabels` from `@/design/assets/source-map` (`{ title, labels, turkiyeLabel, id?, className? }`; markers `<g data-country="<CODE>"><title>`; the `<svg>` has no `id` — `id` names `<title id="<id>-title">`); `Flag` from `@/design/Flag` (`{ code: FlagCode, size?, label?, className? }`, `<use href="/brand/flags.svg#flag-<CODE>">`); `isFlagCode` from `@/design/assets/flag-codes`; `LazyIsland` from `@/design/islands/LazyIsland` (`{ load, props, fallback, rootMargin? }` — no `ssr`, W132; Cycle 8 only).
- i18n/SEO/contact: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata` from `@/lib/seo/metadata` (`{ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription }`); `waLink`, `telLink`, `mailLink` from `@/lib/contact`; `renderWithIntl` from `@/test/render`.
- Messages consumed, not added: `sys.form.labels.message`, `sys.form.options.startWhen.*`, `sys.form.consent.label`, `sys.form.placeholders.*`, `sys.form.hints.optional`, `sys.form.fallback.*`, `sys.marquee.{pause,play}`, `sys.nav.breadcrumbs`.
- Operations catalog `hire` (INQUIRY): v1.0 — `name*` ≤120, `company*` ≤200, `email*` ≤254, `phone*` ≤40 (≥ 8 digits), `country` iso2, `iAm` enum, `sector` ≤120, `roleNeeded` ≤200, `headcount` ≤10, `startWhen` ≤120, `message` ≤5000 (`P/operations-door-contract-as-built.md`); v1.1 (WP2a Task 8, `A/produces-final.md` § Task 8; CONFIRMED live by § "Task 8 — as built", Operations `main` 47a2160) — `city?: string` ≤120 on `hire` (the other three v1.1 fields — `partner.track`, `contact.topic`, `careers.portfolioUrl` — are not `hire` fields and never appear here). Sent here: `name, company, email, phone, city, sector, roleNeeded, headcount, startWhen, message`. Not sent: `country`, `iAm` (optional; the design never asks).
- Gate tooling: `npm run gate` / `gate:launch` (`scripts/gate.sh`), `npm run js-size` (`scripts/js-size.mjs`), `npm run pixel -- --page=hire --locale=tr|en --base=<url> --widths=390,900,1440` (`scripts/pixel-compare.ts`), Playwright projects `mobile` (Pixel 7, 412 px) and `desktop` (1440×900).

Produces (for T14's instance map and the launch sweep — nothing imports these files; later page tasks copy patterns, never import across route folders):
- DOM: `section#request-form` (header `DEFAULT_CTAS`, sticky bar, jump nav and every "Request workers" anchor); `form[data-testid="hire-form-quick"]` (`idScope` `hire-quick`, in a `max-md:hidden` wrapper) and `form[data-testid="hire-form-full"]` (`idScope` `hire-full`), both `data-form-key="hire"`, consent ids `#f-hire-quick-consent` / `#f-hire-full-consent`; section anchors `#industries`, `#compare`, `#process`, `#faq`; one `data-lcp-slot` (the h1); placeholders `hw-hero`, `portal-shortlist`, `portal-mobile-app`.
- Wire (`hire`): quick-quote → `name, company, email, phone` (a TR national number normalised to `+90…`), `city, roleNeeded, headcount`; request form → `name, company, email, phone` (dial + national number → `+<dial><digits>`), `sector` (sector key), `roleNeeded, headcount`, and when filled `city`, `startWhen` (W78 key), `message`.

**Rulings applied:**
- W1 — hero pills, the source-countries heading and the (hidden) employers stat read `metricValues`; an unsigned metric hides its figure (the heading falls back to `hire.140`).
- W3/W16 — the quick-quote gains the door-required `name`; `city` rides as the catalog v1.1 field; option values are stable keys.
- W6 — the logo band renders nothing without consented logos. W7 — `hire.043` via the importer override; store-badge micro-copy stays English. W8 — no App Store badge (`ios` is `null`).
- W9/W23 — five `sys.hire.*` keys for id-less copy; no `sys.seo.hire.*`; package fragments composed only where the package splits them (`sp()`).
- W10 — the design's ≤ 700 px hides/shows are CSS classes on server-rendered markup, never conditional rendering; this design has no ≤ 460 px rule.
- W12/W32 — every `tel:`/`wa.me`/`mailto:` anchor is a `ContactCta`/`ContactLink` with `placement="page_cta"`; same-page anchors fire nothing.
- W13 amended/W120/W136 — the ledger's JS figure is `js-size`'s; ceiling 204,800 B, lazy line 194,560 B on the controller's binding preview.
- W162 — the stop rule is local-adjusted: the preview's `npm run js-size` runs ≈ 2,836 B above the local build (176,132 → 178,968 B at 02ace58), so this task stops and reports when a LOCAL route figure is ≥ **191,724 B** (194,560 − 2,836); the controller's binding preview decides at 194,560 B. Projection here ≈ 183–190 KB (local), so Cycle 8(b) stays a conditional cycle with the page's one lever, the sticky bar (≈ 1 KB): on a crossing the proof stops and reports, and Cycle 8(b) (the lazy pass already written below) runs on the controller's go-ahead before T3 starts. The request form is the `#request-form` CTA target and is never the lazy lever (W163).
- W14 — build-time `SourceMap`, local sprite `Flag`s; no runtime d3/flagcdn/store-badge images.
- W17/W121 — no `CTA_BY_PATHNAME` edit; the page renders the `DEFAULT_CTAS` anchor.
- W18/W81 — the page mounts `StickyCtaBar` (`showAfterPx 700`, `hideNearId "request-form"`, `live`); the bar tracks its own contact CTAs and carries `data-testid="sticky-cta"`.
- W19/R31 — lives in the `(site)` group; no `<main>` (the layout owns it).
- W20/W21 — no gate-route or `UNBUILT_PATHNAMES` edit (both rows already exist).
- W45/W98 — every doc edit anchors on T1's headings/sentences and appends a row/bullet; no line numbers.
- W55/D26 — every placeholder named; exactly one `data-lcp-slot` (the h1 until the hero photo ships).
- W73/W74/W76/W116/W117 — kernel as built (9 s shared deadline, one connection-level retry, bare fallback href, click-time prefill); no uploads on this page.
- W77/W78 — `sector` is the sector key; `startWhen` is a `START_WHEN_KEYS` member labelled by `sys.form.options.startWhen.*`.
- W79 — `consent: 'checkbox'` in both `createFormAction` specs and both shells; no `consentLinkHref` (default `/privacy`).
- W82 — the page's hash CTAs are plain strings. W83 — no e-mail row in the FAQ ask card (the design has WhatsApp + call only).
- W92 — the page e2e is deterministic without `OPS_API_URL`: a valid submit ends on the `unauthorized` fallback panel; the submitting cases skip on a door face (`staging`, production).
- W95 — no visitor data in any DOM href: the page's own `wa.me` links carry package prefills (`hire.249`–`252`), the e-mail links carry only the subject `hire.253`, the fallback anchors are bare.
- W99 — T2 runs after T1 and T13. W109 — breadcrumbs use this page's own ids: `hire.020` → `/`, `hire.002` → this page.
- W111 — `Field as="select"` ignores `placeholder`; `defaultValue="TR"` pre-selects the dial. W113 — section test ids sit on inner `<div>`s; `Section`'s props stay frozen.
- W115 — the package field labels `hire.047`–`058` are passed as `label`; `sys.form.labels.message` is the only fallback label.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — hide ≤ 700 px with `max-md:hidden` beside a base display utility, show ≤ 700 px with `md:hidden`; never `hidden` + an unprefixed display utility; no class string sets one property twice at one variant; a different CTA look is a Button variant, never a caller colour class — `class-collisions.test.ts` scans every file below.
- W123 — the docs call the OG image CDN-cached, never ISR. W124/W125/W131/W133/W139/W140/W142–W144/W151 — not applicable (no template record, no `contactKindOf` in page code, no Stepper/ShareRow, no refusal route, no calculator figure, no catch-all).
- W126 — one build + one start + one gate as the proof (Cycle 7); a second build happens only in the conditional Cycle 8.
- W127 — WhatsApp CTAs wear the `success` variant (the design's green outline). W128 — not applicable (no green band, no PostCard).
- W129 — `ImageSlot` is never given width/height/aspect/object classes: the hero slot sits in a cover wrapper, the phone-mock slot in its frame; only `rounded-[19px]` is passed.
- W130/W134/W147/W156 — primitives, blocks, islands and assets are imported by module path everywhere, type-only imports included; `client-imports.test.ts` stays green.
- W132 — `LazyIsland({ load, props, fallback, rootMargin? })` (no `ssr`) is used only by Cycle 8's conditional lazy pass.
- W165 — the conditional `LazyStickyBar` (Cycle 8(b)) passes `rootMargin: '100000px 0px 200px 0px'` (T3's pattern, the top-extended margin): the jump nav's section links, a reload at a hash and scroll restoration can all jump past the bar's wrapper (it sits right after the jump nav), and a plain 200 px margin would then never load the bar. A Cycle 8 test pins the margin through a recording `IntersectionObserver`.
- W178 — this page mounts no `Stat`/count-up (the hero pills and the source-countries heading are `metricValues`-filled static text, the employers stat a plain `<p>`; `MetricStrip`, the only `Stat` consumer, is not used), so its one metric-text assertion in the page spec (`470+` in the hero pills) needs no `emulateMedia`; a spec case that ever asserts the text of a `Stat` metric sets `page.emulateMedia({ reducedMotion: 'reduce' })` before `goto` or reads the sr-only final figure (the count-up flake).
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json`, identical to production): DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors; GTM stays dark (no `NEXT_PUBLIC_GTM_ID` locally).
- W137 — no preview run by the implementer (never push); the controller's binding preview run uses `--settings.extraHeaders`.
- W138/W159 — the pixel harness compares like for like (document-scroll-height check); at most two runs (D27).
- W148 — no `CLIENT_SYS` change: no client module reads `sys.hire`; the page resolves every string on the server.
- W150 — the page mounts no D17 dated badge → no `revalidate` export (it stays SSG like the spike).
- W152/W158 — `id="request-form"` is rendered in both locales; Cycle 7 proves the launch anchor sweep no longer lists it.
- W154 — no `sys.hire.*` string speaks as "we"/"biz"; the one sentence among them (the map title) names "JobsAdmire" as the subject (`voice.test.ts` scans all of `sys.*`).
- W157/W160 — security headers come from the middleware; nothing for the page to do.
- D11/D13/D17/D19/D20/D23/D26/D27 and R15 — fallback panel, thank-you navigation, metrics, unscaled breakpoints, accessibility over pixels, no fixtures in production, named LCP slot, pixel harness, chrome renders the canonical `home.*` ids.

---

#### Cycle 1 — page-local tables, fragment joiner, phone and country helpers, form schemas, `sys.hire` copy (pure code)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/tables.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { COMPARE_ROWS, FAQ_PAIRS, INDUSTRIES, PROCESS_STEPS } from '../tables';

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `hire.${String(from + i).padStart(3, '0')}`);

describe('INDUSTRIES (design rows 01–06 → sectors collection keys)', () => {
  it('lists the six placeable sectors in design order, never `other`', () => {
    expect(INDUSTRIES.map((r) => r.key)).toEqual([
      'factory',
      'construction',
      'tourism',
      'agriculture',
      'textile',
      'logistics',
    ]);
    for (const row of INDUSTRIES) expect(SECTOR_KEYS).toContain(row.key);
  });

  it('uses every one of the 41 role ids hire.089–hire.129 exactly once', () => {
    const used = INDUSTRIES.flatMap((r) => [...r.visibleRoleIds, ...r.moreRoleIds]);
    expect(new Set(used).size).toBe(used.length);
    expect([...used].sort()).toEqual(range(89, 129));
  });

  it('carries the six per-sector CTA ids hire.130–135 in order', () => {
    expect(INDUSTRIES.map((r) => r.ctaId)).toEqual(range(130, 135));
  });
});

describe('COMPARE_ROWS', () => {
  it('is 5 + 5 title/body pairs over hire.150–169 in order', () => {
    expect(COMPARE_ROWS.own.map((r) => r.titleId)).toEqual(
      [150, 152, 154, 156, 158].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.own.map((r) => r.bodyId)).toEqual(
      [151, 153, 155, 157, 159].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.with.map((r) => r.titleId)).toEqual(
      [160, 162, 164, 166, 168].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.with.map((r) => r.bodyId)).toEqual(
      [161, 163, 165, 167, 169].map((n) => `hire.${n}`),
    );
  });
});

describe('PROCESS_STEPS', () => {
  it('is six numbered steps over hire.271–288 (when, title, body per step)', () => {
    expect(PROCESS_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PROCESS_STEPS.flatMap((s) => [s.whenId, s.titleId, s.bodyId])).toEqual(
      range(271, 288),
    );
  });
});

describe('FAQ_PAIRS', () => {
  it('is seven q/a pairs over hire.289–302 with unique ids', () => {
    expect(FAQ_PAIRS).toHaveLength(7);
    expect(FAQ_PAIRS.flatMap((p) => [p.qId, p.aId])).toEqual(range(289, 302));
    expect(new Set(FAQ_PAIRS.map((p) => p.id)).size).toBe(7);
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/fragments.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { sp } from '../fragments';

describe('sp — the joiner between two package fragments the design glues with {{ }}', () => {
  it('inserts one space between two words', () => {
    expect(sp('Hire verified overseas', 'workers')).toBe(' ');
    expect(sp("Türkiye'de", 'belgeli yabancı işçi')).toBe(' ');
  });
  it('inserts nothing before closing punctuation or after trailing whitespace', () => {
    expect(sp('470+ yerleştirme', ", Türkiye'deki işverenler")).toBe(''); // hire.191 + hire.192 (TR)
    expect(sp('hiring cost calculator', '.')).toBe(''); // hire.178 + hire.179 (EN)
    expect(sp('Vetted talent from ', '13')).toBe('');
  });
  it('inserts nothing when either side is empty (hire.141 TR is deliberately empty)', () => {
    expect(sp('', '13')).toBe('');
    expect(sp('13', '')).toBe('');
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/phone.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { composePhone, normalisePhone } from '../phone';

describe('composePhone (request form: dial select + national number)', () => {
  it('concatenates dial + digits, dropping a trunk 0 and formatting noise', () => {
    expect(composePhone('+90', '0532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '(532) 000-00-00')).toBe('+905320000000');
    expect(composePhone('+92', '300 1234567')).toBe('+923001234567');
  });
  it('trusts a full international number the visitor typed (never doubles or swaps the dial)', () => {
    expect(composePhone('+90', '+90 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '0090 532 000 00 00')).toBe('+905320000000');
    expect(composePhone('+90', '+49 151 2345678')).toBe('+491512345678');
  });
  it('keeps a bare digit string when the dial is empty, and returns "" for no digits', () => {
    expect(composePhone('', '5320000000')).toBe('5320000000');
    expect(composePhone('+90', 'abc')).toBe('');
  });
});

describe('normalisePhone (quick-quote: one free-text field, no dial)', () => {
  it('keeps an international number, strips noise', () => {
    expect(normalisePhone('+90 532 000 00 00')).toBe('+905320000000');
    expect(normalisePhone('0090 532 000 00 00')).toBe('+905320000000');
  });
  it('treats an 11-digit 0-led number as Turkish national (the card serves employers in Türkiye)', () => {
    expect(normalisePhone('0532 000 00 00')).toBe('+905320000000');
  });
  it('leaves anything else as digits only, so the door decides (≥ 8 digits rule)', () => {
    expect(normalisePhone('532 000 00 00')).toBe('5320000000');
    expect(normalisePhone('abc')).toBe('');
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/countries.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { countryName, dialForCode, dialOptions } from '../countries';

const rows = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'DE', name: 'Almanya', dial: '+49' },
  { code: 'US', name: 'Amerika Birleşik Devletleri', dial: '+1' },
];

describe('dialForCode', () => {
  it('returns the dial for a known ISO-2 code and null otherwise', () => {
    expect(dialForCode(rows, 'PK')).toBe('+92');
    expect(dialForCode(rows, 'tr')).toBe('+90'); // case-insensitive at the edge
    expect(dialForCode(rows, 'XX')).toBeNull();
    expect(dialForCode(rows, '')).toBeNull();
  });
});

describe('countryName', () => {
  it('returns the row name — the SourceMap Türkiye label is the TR row (W25/W60)', () => {
    expect(countryName(rows, 'TR')).toBe('Türkiye');
  });
  it('throws outside production for a code the collection lacks (never a silent blank label)', () => {
    expect(() => countryName(rows, 'XX')).toThrow(/XX/);
  });
});

describe('dialOptions', () => {
  it('is ISO-2 valued, "<name> <dial>" labelled and sorted by the locale collation (W3)', () => {
    expect(dialOptions(rows, 'tr')).toEqual([
      { value: 'DE', label: 'Almanya +49' },
      { value: 'US', label: 'Amerika Birleşik Devletleri +1' },
      { value: 'PK', label: 'Pakistan +92' },
      { value: 'TR', label: 'Türkiye +90' },
    ]);
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/hire-spec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { FormActionError } from '@/forms/types';
import { fullSchema, fullToFields, quickSchema, quickToFields } from '../hire-spec';

const countries = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'DE', name: 'Almanya', dial: '+49' },
];

describe('quickSchema / quickToFields (hero quick-quote → `hire`)', () => {
  const ok = {
    company: 'Acme Tekstil A.Ş.',
    name: 'Ayşe Yılmaz',
    city: 'Bursa',
    roleNeeded: 'kaynakçı, paketleme',
    headcount: '12',
    phone: '0532 000 00 00',
    email: 'AYSE@ACME.COM.TR',
  };

  it('accepts the designed fields plus the W3 contact name', () => {
    expect(quickSchema.safeParse(ok).success).toBe(true);
  });

  it('reads empty values as `required` before any format rule (email, phone, headcount)', () => {
    const r = quickSchema.safeParse({ ...ok, name: '', email: '', phone: '', headcount: '' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({
        name: 'required',
        email: 'required',
        phone: 'required',
        headcount: 'required',
      });
  });

  it('flags a bad email as `email`, a short phone as `phone`, a non-integer headcount as `invalid`', () => {
    const r = quickSchema.safeParse({ ...ok, email: 'nope', phone: '12 34', headcount: '10-15' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({
        email: 'email',
        phone: 'phone',
        headcount: 'invalid',
      });
  });

  it('maps onto the exact catalog names and normalises the phone', () => {
    expect(quickToFields(quickSchema.parse(ok))).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Acme Tekstil A.Ş.',
      email: 'AYSE@ACME.COM.TR', // the door lower-cases; the website sends what was typed
      phone: '+905320000000',
      city: 'Bursa',
      roleNeeded: 'kaynakçı, paketleme',
      headcount: '12',
    });
  });
});

describe('fullSchema / fullToFields (request form → `hire`)', () => {
  const ok = {
    company: 'Acme',
    name: 'Mehmet Kaya',
    email: 'mehmet@acme.com',
    dial: 'TR',
    phone: '532 000 00 00',
    sector: 'factory',
    roleNeeded: 'welder',
    headcount: '5',
    city: '',
    startWhen: '',
    message: '',
  };

  it('accepts a minimal valid submission (city, startWhen, message optional)', () => {
    expect(fullSchema.safeParse(ok).success).toBe(true);
  });

  it('accepts the shared W78 startWhen keys and refuses a retired page-local one', () => {
    for (const key of ['asap', 'month1', 'months1to3', 'planning'])
      expect(fullSchema.safeParse({ ...ok, startWhen: key }).success).toBe(true);
    const r = fullSchema.safeParse({ ...ok, startWhen: '1-2m' });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFromIssues(r.error.issues).startWhen).toBe('invalid');
  });

  it('refuses a sector label or a malformed dial (W3/W77: stable keys only)', () => {
    const r = fullSchema.safeParse({ ...ok, sector: 'Fabrika / Üretim', dial: 'ZZZ' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('invalid');
      expect(errors.dial).toBe('invalid');
    }
  });

  it('reads an empty sector select as `required` and a 33-character phone as `max`', () => {
    const r = fullSchema.safeParse({ ...ok, sector: '', phone: '5'.repeat(33) });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('required');
      expect(errors.phone).toBe('max');
    }
  });

  it('composes dial + phone into one value and omits empty optionals', () => {
    expect(fullToFields(fullSchema.parse(ok), countries)).toEqual({
      name: 'Mehmet Kaya',
      company: 'Acme',
      email: 'mehmet@acme.com',
      phone: '+905320000000',
      sector: 'factory',
      roleNeeded: 'welder',
      headcount: '5',
    });
  });

  it('sends city (catalog v1.1), startWhen and message when present', () => {
    const fields = fullToFields(
      fullSchema.parse({ ...ok, city: 'Antalya', startWhen: 'month1', message: 'Night shift.' }),
      countries,
    );
    expect(fields).toMatchObject({ city: 'Antalya', startWhen: 'month1', message: 'Night shift.' });
  });

  it('throws a field-scoped FormActionError when the dial code is not in the countries list', () => {
    const parsed = fullSchema.parse({ ...ok, dial: 'XX' });
    expect(() => fullToFields(parsed, countries)).toThrow(FormActionError);
    try {
      fullToFields(parsed, countries);
    } catch (e) {
      expect((e as FormActionError).field).toEqual({ name: 'dial', code: 'invalid' });
    }
  });
});
```

`src/app/[locale]/(site)/hire-workers/_lib/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { START_WHEN_KEYS } from '@/forms/options';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's id-less copy (W9/W23) — the frozen key set both message files carry. */
const SYS_HIRE_KEYS = ['whatsapp', 'jump.label', 'sc.titleTail', 'sc.mapTitle', 'form.dial'];

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const sysOf = (file: unknown) => (file as { sys: Tree }).sys;

describe('sys.hire.*', () => {
  it('exists with the same five keys in both locales', () => {
    const trKeys = flatten(sysOf(tr).hire as Tree).sort();
    const enKeys = flatten(sysOf(en).hire as Tree).sort();
    expect(trKeys).toEqual([...SYS_HIRE_KEYS].sort());
    expect(enKeys).toEqual(trKeys);
  });

  it('keeps the source-countries tail Turkish-only (EN is the empty string on purpose)', () => {
    const tail = (file: unknown) =>
      ((sysOf(file).hire as Tree).sc as Record<string, string>).titleTail;
    expect(tail(tr)).toBe(' belgeli işçiler');
    expect(tail(en)).toBe('');
  });

  it('can label every shared startWhen key (W78) in both locales', () => {
    for (const file of [tr, en]) {
      const labels = ((sysOf(file).form as Tree).options as Tree).startWhen as Record<
        string,
        string
      >;
      for (const key of START_WHEN_KEYS) expect(labels[key]?.trim().length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hire-workers
```
Expected: FAIL — `tables`, `fragments`, `phone`, `countries` and `hire-spec` tests cannot resolve `../tables`, `../fragments`, `../phone`, `../countries`, `../hire-spec`; `sys-keys.test.ts` fails its first two cases on `sys.hire` being `undefined` (its third passes — WP2a Task 5 shipped the option labels).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_lib/tables.ts`:

```ts
import type { SectorKey } from '@/content/collections';

/**
 * The page's markup-only structures as id tables (docs/CONTENT-MODEL.md § Collections: the
 * grouping of role chips, the comparison pairs, the process steps and the FAQ pairs exist in
 * the design only as markup, so Phase A carries them as page-local constants over package
 * ids — never as copy). Every id here is a real `hire.*` id (asserted by tables.test.ts).
 */
export type IndustryRow = {
  key: Exclude<SectorKey, 'other'>;
  /** the chips the design shows in the row at rest */
  visibleRoleIds: readonly string[];
  /** the chips inside the design's expanded panel under hire.136 */
  moreRoleIds: readonly string[];
  ctaId: string;
};

export const INDUSTRIES: readonly IndustryRow[] = [
  {
    key: 'factory',
    visibleRoleIds: ['hire.089', 'hire.090', 'hire.091', 'hire.092'],
    moreRoleIds: ['hire.093', 'hire.094', 'hire.095', 'hire.096'],
    ctaId: 'hire.130',
  },
  {
    key: 'construction',
    visibleRoleIds: ['hire.097', 'hire.098', 'hire.099', 'hire.100'],
    moreRoleIds: ['hire.101', 'hire.102', 'hire.103', 'hire.104'],
    ctaId: 'hire.131',
  },
  {
    // The design repeats rRecept (hire.108) in the row and the panel; it is listed once.
    key: 'tourism',
    visibleRoleIds: ['hire.105', 'hire.106', 'hire.107', 'hire.108'],
    moreRoleIds: ['hire.109', 'hire.110', 'hire.111'],
    ctaId: 'hire.132',
  },
  {
    key: 'agriculture',
    visibleRoleIds: ['hire.112', 'hire.113', 'hire.114'],
    moreRoleIds: ['hire.115', 'hire.116', 'hire.117'],
    ctaId: 'hire.133',
  },
  {
    key: 'textile',
    visibleRoleIds: ['hire.118', 'hire.119', 'hire.120'],
    moreRoleIds: ['hire.121', 'hire.122', 'hire.123'],
    ctaId: 'hire.134',
  },
  {
    key: 'logistics',
    visibleRoleIds: ['hire.124', 'hire.125', 'hire.126'],
    moreRoleIds: ['hire.127', 'hire.128', 'hire.129'],
    ctaId: 'hire.135',
  },
];

export type CompareRow = { titleId: string; bodyId: string };
export const COMPARE_ROWS: { own: readonly CompareRow[]; with: readonly CompareRow[] } = {
  own: [
    { titleId: 'hire.150', bodyId: 'hire.151' },
    { titleId: 'hire.152', bodyId: 'hire.153' },
    { titleId: 'hire.154', bodyId: 'hire.155' },
    { titleId: 'hire.156', bodyId: 'hire.157' },
    { titleId: 'hire.158', bodyId: 'hire.159' },
  ],
  with: [
    { titleId: 'hire.160', bodyId: 'hire.161' },
    { titleId: 'hire.162', bodyId: 'hire.163' },
    { titleId: 'hire.164', bodyId: 'hire.165' },
    { titleId: 'hire.166', bodyId: 'hire.167' },
    { titleId: 'hire.168', bodyId: 'hire.169' },
  ],
};

export type ProcessStepIds = { n: number; whenId: string; titleId: string; bodyId: string };
export const PROCESS_STEPS: readonly ProcessStepIds[] = [1, 2, 3, 4, 5, 6].map((n) => {
  const base = 271 + (n - 1) * 3;
  return { n, whenId: `hire.${base}`, titleId: `hire.${base + 1}`, bodyId: `hire.${base + 2}` };
});

export type FaqPairIds = { id: string; qId: string; aId: string };
export const FAQ_PAIRS: readonly FaqPairIds[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  id: `q${n}`,
  qId: `hire.${289 + (n - 1) * 2}`,
  aId: `hire.${290 + (n - 1) * 2}`,
}));
```

`src/app/[locale]/(site)/hire-workers/_lib/fragments.ts`:

```ts
/**
 * The design glues split package fragments with bare `{{ a }}{{ b }}` and lets ja-i18n.js
 * space them. W23 allows composing exactly those fragments; this is the one joiner the page
 * uses, so "Hire verified overseas" + "workers" gets its space and "470+ yerleştirme" +
 * ", Türkiye'deki…" (hire.191 + hire.192 TR) does not.
 */
export function sp(prev: string, next: string): ' ' | '' {
  if (!prev || !next) return '';
  if (/\s$/.test(prev) || /^\s/.test(next)) return '';
  if (/^[,.;:!?)\]…]/.test(next)) return '';
  return ' ';
}
```

`src/app/[locale]/(site)/hire-workers/_lib/phone.ts`:

```ts
/** Phone composition for the two `hire` forms. The catalog keeps `phone` as typed (≥ 8 digits,
 *  ≤ 40 chars; E.164 is the Ops handler's job), but the page sends one clean value so the door's
 *  digit rule and the inbox read the same number. Pure — no copy, no collection access. */
const digitsOnly = (s: string) => s.replace(/\D/g, '');

/** Request form: the dial of the country picked in the dial select (`+90`) + the national
 *  number as typed. A number typed in full international form (`+…` or `00…`) is trusted as
 *  is — never doubled, never swapped to the selected dial. */
export function composePhone(dial: string, national: string): string {
  let n = national.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  const dialDigits = digitsOnly(dial);
  if (!dialDigits) return digits;
  return `+${dialDigits}${digits.replace(/^0+/, '')}`;
}

/** Quick-quote: one free-text field on a card for employers in Türkiye — an 11-digit 0-led
 *  number is national; anything else is sent as digits and the door decides. */
export function normalisePhone(raw: string): string {
  let n = raw.trim();
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  const digits = digitsOnly(n);
  if (!digits) return '';
  if (n.startsWith('+')) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+90${digits.slice(1)}`;
  return digits;
}
```

`src/app/[locale]/(site)/hire-workers/_lib/countries.ts`:

```ts
import type { FieldOption } from '@/forms/client/Field';

/** The `countries` collection's row shape this page reads (`getCollection(bundle, 'countries')`
 *  — W25: data, not copy; `name` is locale-resolved). Structural, so tests pass plain rows. */
export type CountryRow = { code: string; name: string; dial: string };

export function dialForCode(
  countries: readonly Pick<CountryRow, 'code' | 'dial'>[],
  code: string,
): string | null {
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return null;
  return countries.find((c) => c.code === upper)?.dial ?? null;
}

/** A country's locale-resolved name by ISO-2 code. The SourceMap's `turkiyeLabel` (W60) is the
 *  `TR` row — the same name the request form's dial select shows. A missing row throws outside
 *  production and degrades to the code in production (makeT's own rule). */
export function countryName(
  countries: readonly Pick<CountryRow, 'code' | 'name'>[],
  code: string,
): string {
  const name = countries.find((c) => c.code === code)?.name;
  if (name) return name;
  const message = `countries collection has no row for ${code}`;
  if (process.env.NODE_ENV !== 'production') throw new Error(message);
  console.error(message);
  return code;
}

/** The request form's dial select: ISO-2 values (W3 — `+1`/`+7` are shared by several
 *  countries, so the dial alone is not a key), "<name> <dial>" labels, sorted by the locale's
 *  collation (the collection's file order is code order). */
export function dialOptions(countries: readonly CountryRow[], locale: string): FieldOption[] {
  return [...countries]
    .sort((a, b) => a.name.localeCompare(b.name, locale))
    .map((c) => ({ value: c.code, label: `${c.name} ${c.dial}` }));
}
```

`src/app/[locale]/(site)/hire-workers/_lib/hire-spec.ts`:

```ts
import { z } from 'zod';
import { SECTOR_KEYS } from '@/content/collections';
import { START_WHEN_KEYS } from '@/forms/options';
import { FormActionError } from '@/forms/types';
import type { WireFields } from '@/forms/wire';
import { dialForCode, type CountryRow } from './countries';
import { composePhone, normalisePhone } from './phone';

/** `.min(1)` before every format rule so an empty value reads `required` (kernel convention,
 *  src/forms/errors.ts). Caps mirror the Operations catalog (`hire`, v1.0 + v1.1's `city`). */
const required = (max: number) => z.string().trim().min(1).max(max);
const email = z.string().trim().min(1).max(254).email();
const phoneOf = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .regex(/(\D*\d){8,}/, { message: 'phone' });
const headcount = z
  .string()
  .trim()
  .min(1)
  .max(10)
  .regex(/^[1-9]\d{0,9}$/, { message: 'invalid' });

/** Hero quick-quote: the design's six fields + the door-required contact `name` (W3). */
export const quickSchema = z.object({
  company: required(200),
  name: required(120),
  city: required(120),
  roleNeeded: required(200),
  headcount,
  phone: phoneOf(40),
  email,
});
export type QuickInput = z.infer<typeof quickSchema>;

export function quickToFields(p: QuickInput): WireFields {
  return {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: normalisePhone(p.phone),
    city: p.city,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
}

/** Request form: dial (ISO-2) + national number (≤ 32 chars, so dial + digits stay under the
 *  door's 40), the sector KEY (W77 — an untouched select posts '' → `required`, a label →
 *  `invalid`), the shared startWhen KEY (W78), optional city (catalog v1.1, W16) and message.
 *  A localized label never travels on the wire. */
export const fullSchema = z.object({
  company: required(200),
  name: required(120),
  email,
  dial: z
    .string()
    .trim()
    .min(1)
    .regex(/^[A-Za-z]{2}$/, { message: 'invalid' }),
  phone: phoneOf(32),
  sector: z.enum(SECTOR_KEYS),
  roleNeeded: required(200),
  headcount,
  city: z.string().trim().max(120).optional(),
  startWhen: z.union([z.literal(''), z.enum(START_WHEN_KEYS)]).optional(),
  message: z.string().trim().max(5000).optional(),
});
export type FullInput = z.infer<typeof fullSchema>;

export function fullToFields(
  p: FullInput,
  countries: readonly Pick<CountryRow, 'code' | 'dial'>[],
): WireFields {
  const dial = dialForCode(countries, p.dial);
  // With `field` set the action answers a field error on the dial select; the empty
  // visitorMessage is never shown (src/forms/types.ts).
  if (!dial) throw new FormActionError('', { name: 'dial', code: 'invalid' });
  const fields: WireFields = {
    name: p.name,
    company: p.company,
    email: p.email,
    phone: composePhone(dial, p.phone),
    sector: p.sector,
    roleNeeded: p.roleNeeded,
    headcount: p.headcount,
  };
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  if (p.message) fields.message = p.message;
  return fields;
}
```

`FormActionError` comes from `@/forms/types` (its home; `@/forms/action` re-exports it but is `server-only` and pulls `next/headers` into this pure module).

`src/app/[locale]/(site)/hire-workers/_lib/assets.ts`:

```ts
import type { Logo } from '@/design/blocks/LogoMarquee';

/** §10 #4: the licensed stock hero lands here as `/hero/hire-workers.jpg` (2880×1280 source,
 *  rendered through `ImageSlot` at 1440×640 — keep the ratio equal to the Hero's cover wrapper
 *  `aspect-[9/4]`). Until then the slot is a named placeholder and the h1 is the LCP element
 *  (D26); setting this constant moves `data-lcp-slot` onto the image. */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1440, height: 640 } as const;

/** §10 #11: client logos with consent are v1.1 — the band stays empty (W6) until rows exist. */
export const CLIENT_LOGOS: readonly Logo[] = [];
```

`src/messages/tr.json` — add `hire` as a key of `sys`, a sibling of `form`, placed immediately before the line `    "form": {` (four spaces — the `sys.form` object whose first child is `"labels": {`; T1/T13 may have added other `sys.*` objects above it — leave them untouched):

```json
    "hire": {
      "whatsapp": "WhatsApp",
      "jump": {
        "label": "Sayfa içi bölümler"
      },
      "sc": {
        "titleTail": " belgeli işçiler",
        "mapTitle": "Kaynak ülkeler haritası — JobsAdmire'ın Türkiye'deki işverenler için işçi temin ettiği ülkeler"
      },
      "form": {
        "dial": "Ülke kodu"
      }
    },
```

`src/messages/en.json` — the same position:

```json
    "hire": {
      "whatsapp": "WhatsApp",
      "jump": {
        "label": "On this page"
      },
      "sc": {
        "titleTail": "",
        "mapTitle": "Source countries map — the countries JobsAdmire sources workers from for employers in Türkiye"
      },
      "form": {
        "dial": "Country code"
      }
    },
```

Why these five and nothing else: `whatsapp` is the design's literal "WhatsApp" CTA label (hero and sticky bar); `jump.label` is the ≤ 700 px jump nav's `aria-label`; `sc.titleTail` is the runtime dictionary's `scTitleC`, which has no package id (TR ` belgeli işçiler`, EN `''` — read with `sys.raw`, an ICU-free read that returns `''` untouched); `sc.mapTitle` is the SVG map's accessible name (W154: "JobsAdmire", never "we"/"biz" — `voice.test.ts` scans every `sys.*` string); `form.dial` labels the dial select (the design's select is unlabelled and the package has no id for it). The map's Türkiye marker label is **not** a key: it is the `countries` collection's `TR` row (`countryName`, data per W25). Every field label with a package id is that id (W115); both submits reuse `hire.063`. The TR apostrophes (`JobsAdmire'ın`, `Türkiye'deki`) are literal in ICU (an apostrophe quotes only before `{`, `}`, `#`, `|` or `'`).

`docs/CONTENT-MODEL.md` — in the per-page `sys.*` bullet list T1 created at the end of `### Adding copy (W9, W23, W54)` (W98; `grep -n '^### Adding copy' docs/CONTENT-MODEL.md`), append after the list's LAST bullet (W98: one bullet per task in execution order — at T2's turn that is T13's "- **Newsletter (T13):** …" bullet, after T1's Homepage and T13's Portal/Legal bullets) and before the heading `### Deliberately-empty Turkish fragments`:

```markdown
- **Hire Workers (`sys.hire.*`, WP2b T2):** `whatsapp` (the design's literal "WhatsApp" CTA label — hero and sticky bar), `jump.label` (the ≤ 700 px jump nav's `aria-label`), `sc.titleTail` (the source-countries heading's Turkish noun — the runtime dictionary's `scTitleC`, which has no package id; EN is `''` on purpose and is read with `sys.raw`), `sc.mapTitle` (the SVG map's accessible name, "JobsAdmire" as the subject, W154), `form.dial` (the request form's dial-select label). The map's Türkiye label is the `countries` collection's `TR` row (data, W25/W60), not a key. Every other string on the page is a `hire.*` id through `makeTf`: the field labels are `hire.047`–`058` (W115), both submits `hire.063`, and the "When do you need them?" options read the shared `sys.form.options.startWhen.*` (W78). No `sys.seo.hire.*` — the page record carries `hire.264`/`hire.265`. No client module reads `sys.hire`, so `CLIENT_SYS` is unchanged (W148).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the six `_lib` test files pass; `src/messages/messages.test.ts` (identical TR/EN key sets; no empty `sys.form` leaf — the empty EN `sys.hire.sc.titleTail` is outside `sys.form`), `voice.test.ts` (W154) and `client-messages.test.ts` (W148) stay green; typecheck/lint/prettier clean.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
git commit -m "feat(hire): page-local id tables, phone and country helpers, hire form schemas, sys.hire copy

Stable keys on the wire: sector keys (W77) and the shared START_WHEN_KEYS (W78);
field caps mirror the Operations catalog hire v1.0 + v1.1 city (W16); the dial
select is ISO-2 over the countries collection (W3/W25); five sys.hire keys in the
formal register with JobsAdmire as the subject (W9/W23/W154); CONTENT-MODEL bullet.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the two server actions and the `hire` wire contract (Vitest, door stubbed)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hire-workers/__tests__/actions.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitHireFull, submitHireQuick } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92)
// unless a case says otherwise; `getBundle` reads the real LOCAL bundle from disk, so the dial
// lookup runs against the real `countries` collection.
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
vi.mock('@/content/adapter', async () => {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { BundleSchema } = await import('../../../../../../contract/website-bundle.v1');
  return {
    getBundle: async (locale: string) =>
      BundleSchema.parse(
        JSON.parse(
          readFileSync(
            join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`),
            'utf8',
          ),
        ),
      ),
  };
});

/** The Operations catalog's `hire` field names — v1.0 (`website-form-catalog.ts`) + v1.1's
 *  `city` (WP2a Task 8, W16). The door silently DROPS any other name inside `fields`. */
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

const full = {
  company: 'Acme A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@acme.example',
  dial: 'TR',
  phone: '0532 000 00 00',
  sector: 'factory',
  roleNeeded: 'kaynakçı',
  headcount: '5',
  city: 'Antalya',
  startWhen: 'month1',
  message: '',
  consent: 'on',
  honeypot: '',
  $ACTION_ID_hire: '',
};
const quick = {
  company: 'Acme',
  city: 'Bursa',
  name: 'Ali Veli',
  roleNeeded: 'kaynakçı',
  headcount: '3',
  phone: '0532 000 00 00',
  email: 'ali@acme.example',
  consent: 'on',
  honeypot: '',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/isci-talebi');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitHireFull — the request form → hire', () => {
  it('sends catalog names only: dial + phone composed, the sector and startWhen keys, city', async () => {
    const state = await submitHireFull(IDLE_FORM_STATE, formData(full));
    const { key, envelope } = sent();
    expect(key).toBe('hire');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/isci-talebi',
    });
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Acme A.Ş.',
      email: 'ayse@acme.example',
      phone: '+905320000000',
      sector: 'factory',
      roleNeeded: 'kaynakçı',
      headcount: '5',
      city: 'Antalya',
      startWhen: 'month1',
    });
    for (const name of Object.keys(envelope.fields)) expect(HIRE_CATALOG).toContain(name);
    // D11/W92: no door → the fallback panel state, the typed values echoed for its WhatsApp prefill
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { company: 'Acme A.Ş.', phone: '0532 000 00 00' },
    });
  });

  it('refuses a submit without the consent tick (W79) and posts nothing', async () => {
    const state = await submitHireFull(IDLE_FORM_STATE, formData({ ...full, consent: '' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('lands an unknown dial code on the dial select and posts nothing', async () => {
    const state = await submitHireFull(IDLE_FORM_STATE, formData({ ...full, dial: 'XX' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { dial: 'invalid' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('navigates to /thank-you?form=hire when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue({
      kind: 'ok',
      id: 'sub_1',
      status: 'RECEIVED',
      isTest: false,
      replayed: false,
      captchaDegraded: false,
      error: null,
    });
    await expect(submitHireFull(IDLE_FORM_STATE, formData(full))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'hire' } },
      locale: 'tr',
    });
  });
});

describe('submitHireQuick — the hero quick-quote → hire', () => {
  it('sends name (W3), company, email, the normalised phone, city (W16), roleNeeded, headcount', async () => {
    const state = await submitHireQuick(IDLE_FORM_STATE, formData(quick));
    const { key, envelope } = sent();
    expect(key).toBe('hire');
    expect(envelope.fields).toEqual({
      name: 'Ali Veli',
      company: 'Acme',
      email: 'ali@acme.example',
      phone: '+905320000000',
      city: 'Bursa',
      roleNeeded: 'kaynakçı',
      headcount: '3',
    });
    for (const name of Object.keys(envelope.fields)) expect(HIRE_CATALOG).toContain(name);
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' } });
  });

  it('refuses a submit without the contact name', async () => {
    const state = await submitHireQuick(IDLE_FORM_STATE, formData({ ...quick, name: '' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { name: 'required' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hire-workers/__tests__
```
Expected: FAIL — `Failed to resolve import "../actions"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/actions.ts`:

```ts
'use server';
import { getBundle } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { createFormAction, type FormActionState } from '@/forms/action';
import { fullSchema, fullToFields, quickSchema, quickToFields } from './_lib/hire-spec';

/** Hero quick-quote → `hire` (W3: + contact `name`; W16: `city`). W79: a consent checkbox like
 *  every door form — the kernel's `notice` mode is not used in Phase A. */
const runQuick = createFormAction({
  key: 'hire',
  schema: quickSchema,
  consent: 'checkbox',
  toFields: (p) => quickToFields(p),
});

/** Request form → `hire`. The dial → country lookup reads the request locale's `countries`
 *  collection (the rows differ per locale only in `name`). */
const runFull = createFormAction({
  key: 'hire',
  schema: fullSchema,
  consent: 'checkbox',
  toFields: async (p, _data, { locale }) =>
    fullToFields(p, getCollection(await getBundle(locale), 'countries')),
});

export async function submitHireQuick(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runQuick(prev, data);
}

export async function submitHireFull(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runFull(prev, data);
}
```

A `'use server'` module may export only async functions: the two factories stay module-private constants.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/actions.ts" "src/app/[locale]/(site)/hire-workers/__tests__"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `actions.test.ts` 6/6 green; everything else unchanged.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/actions.ts" "src/app/[locale]/(site)/hire-workers/__tests__"
git commit -m "feat(hire): quick-quote and request-form server actions on the forms kernel

Both hire, consent checkbox (W79), catalog names only on the wire incl. v1.1
city (W16), sector/startWhen keys (W77/W78), dial + phone composed; the unit test
pins the envelope, the door-less unauthorized fallback (W92) and the /thank-you
navigation (D13).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the sector prefill island

The request form's dial select needs no island: `Field` takes `defaultValue` (`defaultValue="TR"`, Cycle 5). The industries "Request <sector> workers →" CTA is the page's one client island.

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hire-workers/_components/__tests__/SectorPrefillLink.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SectorPrefillLink } from '../SectorPrefillLink';

const requestForm = (options: string[]) => (
  <section id="request-form">
    <form>
      <select name="sector" defaultValue="">
        <option value=""></option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </form>
  </section>
);

describe('SectorPrefillLink', () => {
  it('is a plain same-page anchor to #request-form', () => {
    render(<SectorPrefillLink sector="factory">Fabrika işçisi talep edin →</SectorPrefillLink>);
    expect(screen.getByRole('link', { name: 'Fabrika işçisi talep edin →' })).toHaveAttribute(
      'href',
      '#request-form',
    );
  });

  it('prefills the request form’s sector select on click and leaves the anchor navigation alone', async () => {
    render(
      <>
        {requestForm(['factory', 'textile'])}
        <SectorPrefillLink sector="textile">Tekstil</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Tekstil' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe(
      'textile',
    );
  });

  it('does nothing when the option does not exist (never throws in front of a visitor)', async () => {
    render(
      <>
        {requestForm([])}
        <SectorPrefillLink sector="factory">x</SectorPrefillLink>
      </>,
    );
    await userEvent.click(screen.getByRole('link', { name: 'x' }));
    expect((document.querySelector('select[name="sector"]') as HTMLSelectElement).value).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hire-workers/_components
```
Expected: FAIL — `../SectorPrefillLink` cannot be resolved.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_components/SectorPrefillLink.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import type { SectorKey } from '@/content/collections';

/**
 * The industries panel's "Request <sector> workers →" CTA. The design (`requestInd1..6`)
 * pre-selects the request form's sector and scrolls to it; here it is a real anchor to
 * `#request-form` (works without JS, keyboard-reachable, fires no analytics event — it is not a
 * contact door, W12) whose click also sets the form's `sector` select before the hash navigation
 * runs. The select is the kernel's uncontrolled `Field`, so setting `.value` and dispatching
 * `change` is the whole hand-off: no cross-island state, nothing in the URL (W95). The value is
 * the sector KEY (W77). Reads no `sys.*` copy — the label arrives as children (W148).
 */
export function SectorPrefillLink({
  sector,
  className,
  children,
}: {
  sector: SectorKey;
  className?: string;
  children: ReactNode;
}) {
  const prefill = () => {
    const select = document.querySelector<HTMLSelectElement>(
      '#request-form select[name="sector"]',
    );
    if (!select) return;
    if (!Array.from(select.options).some((o) => o.value === sector)) return;
    select.value = sector;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };
  return (
    <a href="#request-form" onClick={prefill} className={className}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/_components"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the island's three cases green; `client-imports.test.ts` green (the island imports only a type from `@/content/collections`, erased at compile time).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_components"
git commit -m "feat(hire): SectorPrefillLink — the industries CTA prefills the request form's sector key

A same-page anchor (no analytics door, W12), sector key on the select (W77), no
visitor data in the URL (W95), no client sys namespace (W148).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the presentational sections (jump nav, logos, industries, source countries, comparison, process, portal, FAQ)

Every section is a server component that receives resolved strings (`tf`, sys values) as props, so it renders under jsdom with the real LOCAL bundle; the page (Cycle 6) does the async work. Every import is by module path; every class string obeys W119/W122/W155 (the static scan `class-collisions.test.ts` walks these files in Step 4); no `ImageSlot` gets a width/height/aspect/object class (W129).

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hire-workers/_sections/__tests__/sections.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { makeTf, metricValues } from '@/content/pure';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { CLIENT_LOGOS } from '../../_lib/assets';
import { INDUSTRIES } from '../../_lib/tables';
import { ClientLogos } from '../ClientLogos';
import { Comparison } from '../Comparison';
import { Faq } from '../Faq';
import { Industries } from '../Industries';
import { JumpNav } from '../JumpNav';
import { PortalPreview } from '../PortalPreview';
import { Process } from '../Process';
import { SourceCountries } from '../SourceCountries';

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
const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
const scSys = (m: typeof tr) => ({
  titleTail: m.sys.hire.sc.titleTail,
  mapTitle: m.sys.hire.sc.mapTitle,
  pause: m.sys.marquee.pause,
  play: m.sys.marquee.play,
});

describe('JumpNav', () => {
  it('is a labelled ≤ 700 px nav of the five designed anchors (W10: CSS, not conditional)', () => {
    renderWithIntl(<JumpNav tf={tfTr} label={tr.sys.hire.jump.label} />);
    const nav = screen.getByRole('navigation', { name: tr.sys.hire.jump.label });
    expect(tokens(nav)).toContain('md:hidden');
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['#industries', '#compare', '#process', '#faq', '#request-form']);
  });
});

describe('ClientLogos', () => {
  it('renders nothing while no consented logo exists (W6, §10 #11)', () => {
    const { container } = renderWithIntl(
      <ClientLogos tf={tfTr} employers="22+" logos={CLIENT_LOGOS} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Industries', () => {
  it('six sector rows in design order, one open at a time, each CTA a #request-form anchor', async () => {
    const { container } = renderWithIntl(<Industries bundle={TR} tf={tfTr} />);
    expect(container.querySelector('section#industries')).not.toBeNull();
    const region = screen.getByTestId('hire-industries');
    const names = [
      '01 · Fabrika / Üretim',
      '02 · İnşaat',
      '03 · Turizm / Konaklama',
      '04 · Tarım',
      '05 · Tekstil',
      '06 · Lojistik / Depo',
    ];
    for (const name of names)
      expect(within(region).getByRole('button', { name })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    await userEvent.click(within(region).getByRole('button', { name: '05 · Tekstil' }));
    expect(within(region).getByRole('button', { name: '05 · Tekstil' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(within(region).getByRole('link', { name: tfTr('hire.134') })).toHaveAttribute(
      'href',
      '#request-form',
    );
    await userEvent.click(within(region).getByRole('button', { name: '01 · Fabrika / Üretim' }));
    expect(within(region).getByRole('button', { name: '05 · Tekstil' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    // every one of the 41 role chips is server-rendered (closed panels are `hidden`, still in the DOM)
    for (const row of INDUSTRIES)
      for (const id of [...row.visibleRoleIds, ...row.moreRoleIds])
        expect(region.textContent).toContain(tfTr(id));
  });
});

describe('SourceCountries', () => {
  it('TR: the metric heading, the map with 13 sources + Türkiye, sprite flags, the static list and the ≤ 700 px marquee', () => {
    renderWithIntl(
      <SourceCountries
        bundle={TR}
        tf={tfTr}
        countries={metricValues(TR, 'tr').countries}
        sys={scSys(tr)}
      />,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      '13+ ülkeden belgeli işçiler',
    );
    expect(screen.getByRole('img', { name: tr.sys.hire.sc.mapTitle })).toBeInTheDocument();
    const map = screen.getByTestId('hire-map');
    expect(map.querySelectorAll('g[data-country]')).toHaveLength(14);
    expect(map.querySelector('g[data-country="TR"] > title')?.textContent).toBe('Türkiye');
    expect(map.querySelector('g[data-country="LK"] > title')?.textContent).toBe('Sri Lanka');
    const flags = screen.getByTestId('hire-flags');
    const list = flags.querySelector('ul')!;
    expect(list.querySelectorAll('li')).toHaveLength(13);
    expect(tokens(list)).toContain('max-md:hidden');
    expect(flags.querySelector('use[href="/brand/flags.svg#flag-PK"]')).not.toBeNull();
    expect(within(flags).getByRole('button', { name: tr.sys.marquee.pause })).toBeInTheDocument();
  });

  it('EN: "Vetted talent from 13+ countries" — the Turkish-only tail is empty', () => {
    renderWithIntl(
      <SourceCountries
        bundle={EN}
        tf={tfEn}
        countries={metricValues(EN, 'en').countries}
        sys={scSys(en)}
      />,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      'Vetted talent from 13+ countries',
    );
  });
});

describe('Comparison', () => {
  it('two cards of five rows; the ✓/× marks are SVG, never text (axe color-contrast, D20)', () => {
    const { container } = renderWithIntl(<Comparison tf={tfTr} />);
    expect(container.querySelector('section#compare')).not.toBeNull();
    const region = screen.getByTestId('hire-compare');
    expect(
      within(region)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([tfTr('hire.148'), tfTr('hire.149')]);
    expect(within(region).getAllByRole('listitem')).toHaveLength(10);
    expect(region.textContent).not.toMatch(/[✓×]/);
  });
});

describe('Process', () => {
  it('six numbered steps, the composed heading and the locale-aware cross-links', () => {
    const { container } = renderWithIntl(<Process bundle={TR} locale="tr" tf={tfTr} />);
    expect(container.querySelector('section#process')).not.toBeNull();
    const region = screen.getByTestId('hire-process');
    expect(within(region).getByRole('heading', { level: 2 }).textContent).toBe(
      `${tfTr('hire.170')} ${tfTr('hire.171')}`,
    );
    expect(within(region).getAllByRole('heading', { level: 3 })).toHaveLength(6);
    expect(within(region).getByRole('link', { name: tfTr('hire.175') })).toHaveAttribute(
      'href',
      '/calisma-izni',
    );
    expect(within(region).getByRole('link', { name: tfTr('hire.178') })).toHaveAttribute(
      'href',
      '/maliyet-hesaplayici',
    );
  });
});

describe('PortalPreview', () => {
  it('shows at every width (the design hides nothing at ≤ 460 px), with the host, named slots, the demo CTA and Android-only badges', () => {
    renderWithIntl(<PortalPreview bundle={TR} locale="tr" tf={tfTr} />);
    const region = screen.getByTestId('hire-portal');
    expect(region.closest('[class*="hidden"]')).toBeNull();
    expect(region.textContent).toContain('portal.jobsadmire.com');
    expect(region.querySelector('[data-placeholder="portal-shortlist"]')).not.toBeNull();
    const phone = region.querySelector('[data-placeholder="portal-mobile-app"]')!;
    expect(phone.closest('[class~="max-md:hidden"]')).not.toBeNull(); // ≤ 700 px: no phone mock
    expect(within(region).getByRole('link', { name: tfTr('hire.193') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tfTr('hire.251'))}`,
    );
    expect(within(region).getByRole('link', { name: /Google Play/ })).toBeInTheDocument();
    expect(within(region).queryByRole('link', { name: /App Store/ })).toBeNull(); // W8
    expect(region.textContent).not.toMatch(/✓/);
  });
});

describe('Faq', () => {
  it('seven single-open pairs (first open), the WhatsApp + call ask card, one FAQPage node, #faq on the section', () => {
    const { container } = renderWithIntl(<Faq bundle={TR} locale="tr" tf={tfTr} />);
    expect(container.querySelector('section#faq')).not.toBeNull();
    const region = screen.getByTestId('hire-faq');
    const triggers = within(region).getAllByRole('button');
    expect(triggers).toHaveLength(7);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
    expect(within(region).getByRole('link', { name: tfTr('hire.041') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tfTr('hire.252'))}`,
    );
    expect(within(region).getByRole('link', { name: tfTr('hire.032') })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    const nodes = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
      (s) => JSON.parse(s.textContent ?? '{}') as { '@type'?: string; mainEntity?: unknown[] },
    );
    const faqNodes = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faqNodes).toHaveLength(1);
    expect(faqNodes[0].mainEntity).toHaveLength(7);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hire-workers/_sections
```
Expected: FAIL — `../ClientLogos`, `../Comparison`, … cannot be resolved (and `../../_components/icons` once they exist).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_components/icons.tsx`:

```tsx
import type { ReactNode } from 'react';

/** Decorative marks drawn as SVG (the design's own strokes), always `aria-hidden`. Never a
 *  "✓"/"×" text glyph: axe's `color-contrast` rule scores a glyph as text — white on the success
 *  green is 3.3:1, grey on its pale disc 4.3:1 — while an SVG stroke is a graphic (D20). */
type IconProps = { size?: number; className?: string };

function Svg({ size, className, children }: { size: number; className?: string; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function CrossIcon({ size = 14, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  );
}

export function PinIcon({ size = 17, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </Svg>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/JumpNav.tsx`:

```tsx
const CHIPS = [
  ['#industries', 'hire.067'],
  ['#compare', 'hire.068'],
  ['#process', 'hire.069'],
  ['#faq', 'hire.070'],
] as const;

const CHIP =
  'inline-block whitespace-nowrap rounded-pill border px-4 py-2 text-body-sm font-extrabold no-underline';

/** The design's `.ja-jump` (≤ 700 px only): anchor chips to the page's sections, the last one
 *  dark. W10: server-rendered at every width, hidden from 701 px by CSS (`md:hidden`). */
export function JumpNav({ tf, label }: { tf: (id: string) => string; label: string }) {
  return (
    <nav
      aria-label={label}
      data-testid="hire-jump"
      className="border-b border-border-4 bg-white md:hidden"
    >
      <ul className="m-0 flex list-none gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none]">
        {CHIPS.map(([href, id]) => (
          <li key={href} className="flex-none">
            <a href={href} className={`${CHIP} border-tint-border bg-pale-1 text-blue-safe`}>
              {tf(id)}
            </a>
          </li>
        ))}
        <li className="flex-none">
          <a href="#request-form" className={`${CHIP} border-ink bg-ink text-white`}>
            {tf('hire.071')}
          </a>
        </li>
      </ul>
    </nav>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/ClientLogos.tsx`:

```tsx
import { LogoMarquee, type Logo } from '@/design/blocks/LogoMarquee';

/** The design's `.ja-hw-logos` band (hidden ≤ 700 px). Renders nothing until consented logos
 *  exist (W6, §10 #11); the `employers` stat rides with the band, never alone. */
export function ClientLogos({
  tf,
  employers,
  logos,
}: {
  tf: (id: string) => string;
  /** metricValues(...).employers — '' when unsigned (W1) */
  employers: string;
  logos: readonly Logo[];
}) {
  if (logos.length === 0) return null;
  return (
    <div data-testid="hire-logos" className="border-b border-border-3 py-9 max-md:hidden">
      <div className="container-site grid items-center gap-12 md:grid-cols-[auto_1fr]">
        {employers ? (
          <div className="border-r border-border-2 pr-11">
            <p className="m-0 text-stat font-extrabold leading-none text-ink">{employers}</p>
            <p className="m-0 mt-1.5 max-w-[150px] text-body-sm font-bold text-text-tertiary">
              {tf('hire.073')}
            </p>
          </div>
        ) : null}
        <LogoMarquee logos={[...logos]} durationSec={38} />
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Industries.tsx`:

```tsx
import { getCollection, type Sector } from '@/content/collections';
import { Accordion, type AccordionItem } from '@/design/primitives/Accordion';
import { Section } from '@/design/primitives/Section';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { SectorPrefillLink } from '../_components/SectorPrefillLink';
import { INDUSTRIES } from '../_lib/tables';

const CHIP = 'inline-block rounded-pill border px-3 py-1 text-body-sm font-bold';

/** Design `#industries`: six sector rows (single-open, none open at rest — the design's
 *  `openInd: -1`). Delta 6: the foundation Accordion takes a string trigger, so the subtitle and
 *  every chip sit in the panel; the per-sector CTA is `SectorPrefillLink` (W77). */
export function Industries({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const byKey = new Map<string, Sector>(getCollection(bundle, 'sectors').map((s) => [s.key, s]));
  const items: AccordionItem[] = INDUSTRIES.flatMap((row, i) => {
    const sector = byKey.get(row.key);
    if (!sector) return []; // rendered by data: a sector missing from the collection is no row
    const n = String(i + 1).padStart(2, '0');
    return [
      {
        id: row.key,
        title: `${n} · ${tf(sector.labelId)}`,
        body: (
          <div className="flex flex-col gap-4">
            {sector.subtitleId ? (
              <p className="m-0 text-body-sm font-bold text-blue-safe">{tf(sector.subtitleId)}</p>
            ) : null}
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {row.visibleRoleIds.map((id) => (
                <li key={id} className={`${CHIP} border-border-2 bg-pale-1 text-text-secondary`}>
                  {tf(id)}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-end justify-between gap-6 rounded-sm bg-blue-safe p-5 text-white shadow-card-hover max-md:p-4">
              <div className="min-w-0">
                <p className="m-0 mb-2 text-eyebrow font-extrabold uppercase tracking-[1px] text-white">
                  {tf('hire.136')}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {row.moreRoleIds.map((id) => (
                    <li key={id} className={`${CHIP} border-white/60 text-white`}>
                      {tf(id)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-end gap-2 max-md:w-full max-md:items-stretch">
                <p className="m-0 text-body-sm font-bold text-white">{tf('hire.137')}</p>
                <SectorPrefillLink
                  sector={row.key}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-input bg-white px-5 text-body-sm font-extrabold text-blue-safe no-underline hover:bg-tint"
                >
                  {tf(row.ctaId)}
                </SectorPrefillLink>
              </div>
            </div>
          </div>
        ),
      },
    ];
  });
  return (
    <Section tone="light" id="industries" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-industries">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.074')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-6">
          {tf('hire.075')}
        </p>
        <div className="rounded-lg border border-tint-border bg-white px-5 max-md:px-3.5">
          <Accordion items={items} singleOpen headingLevel={3} />
        </div>
        <p className="m-0 mt-7 text-center text-body text-text-tertiary">
          {tf('hire.138')}{' '}
          <a href="#request-form" className="font-extrabold text-blue-safe no-underline">
            {tf('hire.139')}
          </a>
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/SourceCountries.tsx`:

```tsx
import { getCollection } from '@/content/collections';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { Flag } from '@/design/Flag';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { PausableMarquee } from '@/design/primitives/PausableMarquee';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PinIcon } from '../_components/icons';
import { countryName } from '../_lib/countries';
import { sp } from '../_lib/fragments';

function FlagChip({ code, name }: { code: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-tint-border bg-white px-3.5 py-1.5 text-body-sm font-bold text-text-secondary">
      {isFlagCode(code) ? <Flag code={code} size={16} /> : null}
      {name}
    </span>
  );
}

/** Design `.ja-sc`: copy + the build-time map (W14) + flag chips. ≤ 700 px (W10): the copy
 *  column dissolves (`max-md:contents`) so the note moves under the map, and the chips become
 *  the design's 34 s pausable marquee; from 701 px they wrap statically. */
export function SourceCountries({
  bundle,
  tf,
  countries,
  sys,
}: {
  bundle: Bundle;
  tf: (id: string) => string;
  /** metricValues(...).countries — '' when unsigned (W1: the heading falls back to hire.140) */
  countries: string;
  /** sys.hire.sc.* + sys.marquee.*, resolved by the page */
  sys: { titleTail: string; mapTitle: string; pause: string; play: string };
}) {
  const rows = getCollection(bundle, 'sourceCountries');
  const a = tf('hire.141'); // TR: deliberately '' (never the EN fallback — PRD §3)
  const b = tf('hire.142');
  return (
    <div className="bg-white pb-16 pt-6 lg:pt-12">
      <div className="container-site" data-testid="hire-source-countries">
        <div className="flex flex-col gap-10 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 max-md:gap-0 max-md:rounded-lg max-md:px-4 max-md:py-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-14 lg:py-12">
          <div className="max-md:contents">
            <Eyebrow>{tf('hire.140')}</Eyebrow>
            <h2 className="m-0 mb-4 mt-3 text-h2">
              {countries ? (
                <>
                  {a}
                  {sp(a, countries)}
                  <span className="text-blue-safe">
                    {countries}
                    {b}
                  </span>
                  {sys.titleTail}
                </>
              ) : (
                tf('hire.140')
              )}
            </h2>
            <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.143')}</p>
            <div className="flex items-start gap-3 rounded-sm border border-tint-border bg-white px-5 py-4 max-md:order-1 max-md:mt-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-input bg-success-surface text-success"
              >
                <PinIcon />
              </span>
              <div>
                <p className="m-0 text-body font-extrabold text-ink">{tf('hire.144')}</p>
                <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf('hire.145')}</p>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <div data-testid="hire-map">
              <SourceMap
                id="hire-map"
                title={sys.mapTitle}
                labels={sourceMapLabels(rows)}
                turkiyeLabel={countryName(getCollection(bundle, 'countries'), 'TR')}
              />
            </div>
            <div data-testid="hire-flags" className="mt-4">
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0 max-md:hidden">
                {rows.map((c) => (
                  <li key={c.code}>
                    <FlagChip code={c.code} name={c.name} />
                  </li>
                ))}
              </ul>
              <div className="md:hidden">
                <PausableMarquee durationSec={34} labelPause={sys.pause} labelPlay={sys.play}>
                  {rows.map((c) => (
                    <FlagChip key={c.code} code={c.code} name={c.name} />
                  ))}
                </PausableMarquee>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

The marquee's children are `<span>` chips, never `<li>` (the marquee wraps them in `<span>` tracks; an orphan `<li>` fails axe `listitem`). The card sits **inside** `container-site`, never on it: `.container-site` is unlayered CSS and would beat the card's `px-*` utilities.

`src/app/[locale]/(site)/hire-workers/_sections/Comparison.tsx`:

```tsx
import { Section } from '@/design/primitives/Section';
import { CheckIcon, CrossIcon } from '../_components/icons';
import { COMPARE_ROWS } from '../_lib/tables';

const HEAD = 'm-0 mb-4 text-body-sm font-extrabold uppercase tracking-[1.5px]';
const MARK = 'flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill';

/** Design `#compare`: "On your own" vs "With JobsAdmire" (legal-flagged rows render verbatim). */
export function Comparison({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="light" id="compare" className="scroll-mt-20 pt-0">
      <div className="container-site" data-testid="hire-compare">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.146')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-6">
          {tf('hire.147')}
        </p>
        <div className="grid gap-6 max-md:gap-3.5 lg:grid-cols-2">
          <div className="rounded-lg border border-border-2 bg-white p-8 max-md:px-4 max-md:py-5">
            <h3 className={`${HEAD} text-text-tertiary`}>{tf('hire.148')}</h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.own.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`${MARK} bg-border-3 text-text-tertiary`}>
                    <CrossIcon size={12} />
                  </span>
                  <div>
                    <p className="m-0 text-body font-bold text-text-secondary">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-tertiary">{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border-[1.5px] border-tint-border bg-gradient-to-b from-pale-1 to-tint p-8 shadow-card-hover max-md:px-4 max-md:py-5">
            <h3 className={`${HEAD} text-blue-safe`}>{tf('hire.149')}</h3>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {COMPARE_ROWS.with.map((r) => (
                <li key={r.titleId} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`${MARK} bg-success text-white`}>
                    <CheckIcon size={13} />
                  </span>
                  <div>
                    <p className="m-0 text-body font-extrabold text-ink">{tf(r.titleId)}</p>
                    <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf(r.bodyId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Process.tsx` (the design's numbered rail is `ProcessSteps variant="cards"` — the block WP2a Task 5 built for this design; the brief's "horizontal timeline" is an accepted page-local deviation):

```tsx
import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';
import { PROCESS_STEPS } from '../_lib/tables';

const CROSS_LINK = 'font-extrabold text-blue-safe no-underline';

export function Process({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const steps: ProcessStep[] = PROCESS_STEPS.map((s) => ({
    n: s.n,
    titleId: s.titleId,
    bodyId: s.bodyId,
    when: tf(s.whenId),
  }));
  const [ta, tb] = [tf('hire.170'), tf('hire.171')];
  const [l1a, l1b, l1c] = [tf('hire.174'), tf('hire.175'), tf('hire.176')];
  const [l2a, l2b, l2c] = [tf('hire.177'), tf('hire.178'), tf('hire.179')];
  return (
    <Section tone="pale" id="process" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-process">
        <h2 className="m-0 mb-4 text-center text-h2-process">
          {ta}
          {sp(ta, tb)}
          <span className="text-blue-safe">{tb}</span>
        </h2>
        {/* D20: #64748b on the pale #f4f9fc is 4.49:1 — the pale sections use text-secondary */}
        <p className="mx-auto mb-4 mt-0 max-w-[540px] text-center text-body-lg text-text-secondary">
          {tf('hire.172')}
        </p>
        <div className="mb-11 text-center max-md:mb-7">
          <p className="m-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-5 py-2 text-body-sm font-extrabold text-success-text">
            {tf('hire.173')}
          </p>
          {/* The design's two cross-links are absolute www.jobsadmire.com URLs — locale-aware
              here. prefetch={false}: /work-permit and /hiring-cost-calculator stay in
              UNBUILT_PATHNAMES until T4/T3 (W99), so a viewport prefetch would 404. */}
          <p className="m-0 mt-3.5 text-body-sm text-text-secondary max-md:text-left">
            {l1a}
            {sp(l1a, l1b)}
            <Link href="/work-permit" prefetch={false} className={CROSS_LINK}>
              {l1b}
            </Link>
            {sp(l1b, l1c)}
            {l1c}
          </p>
          <p className="m-0 mt-2 text-body-sm text-text-secondary max-md:text-left">
            {l2a}
            {sp(l2a, l2b)}
            <Link href="/hiring-cost-calculator" prefetch={false} className={CROSS_LINK}>
              {l2b}
            </Link>
            {sp(l2b, l2c)}
            {l2c}
          </p>
        </div>
        <div className="mx-auto max-w-[760px]">
          <ProcessSteps
            bundle={bundle}
            locale={locale}
            steps={steps}
            variant="cards"
            headingLevel={3}
          />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/PortalPreview.tsx` — the design's `.ja-pd` renders at **every** width (the ≤ 460 px portal hide W10 names is the Homepage's `.ja-portal-panel`). DOM order is copy → visual so the ≤ 700 px reading and focus order (copy and its CTA first, then the mock and the store badges) is the visual order; from 701 px `md:order-first` puts the visual first again — it holds no focusable element there (the badges are `md:hidden`), so focus order never disagrees with what is seen. At ≤ 700 px the browser mock and badge go static, the phone mock hides, the progress bar and store badges show:

```tsx
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';

const DOT = 'inline-block h-2.5 w-2.5 rounded-pill bg-border-2';

export function PortalPreview({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const host = new URL(s.portal.host).host; // "portal.jobsadmire.com" — the mock's address bar
  const proofA = tf('hire.191');
  const proofB = tf('hire.192');
  return (
    <div className="bg-white pb-16">
      <div className="container-site">
        <div
          data-testid="hire-portal"
          className="flex flex-col gap-12 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 max-md:gap-6 max-md:rounded-lg max-md:px-4 max-md:py-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14 lg:py-14"
        >
          <div>
            <Eyebrow>{tf('hire.182')}</Eyebrow>
            <h2 className="m-0 mb-4 mt-3 text-h2">{tf('hire.183')}</h2>
            <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.184')}</p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {(['hire.185', 'hire.186'] as const).map((id) => (
                <li key={id} className="flex items-center gap-3 text-body text-ink">
                  <span
                    aria-hidden="true"
                    className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill bg-success text-white"
                  >
                    <CheckIcon size={13} />
                  </span>
                  {tf(id)}
                </li>
              ))}
            </ul>
            <div className="mb-7 grid gap-3.5 sm:grid-cols-2">
              {(
                [
                  ['hire.187', 'hire.188'],
                  ['hire.189', 'hire.190'],
                ] as const
              ).map(([title, body]) => (
                <div key={title} className="rounded-sm border border-tint-border bg-pale-1 px-5 py-4">
                  <p className="m-0 mb-2 text-body font-extrabold text-ink">{tf(title)}</p>
                  <p className="m-0 text-body-sm text-text-secondary">{tf(body)}</p>
                </div>
              ))}
            </div>
            <p className="m-0 mb-6 flex items-start gap-2.5 text-body text-text-secondary">
              <CheckIcon size={17} className="mt-0.5 flex-none text-blue-safe" />
              <span>
                <strong className="text-ink">{proofA}</strong>
                {sp(proofA, proofB)}
                {proofB}
              </span>
            </p>
            <ContactCta
              placement="page_cta"
              href={waLink(s.whatsappNumber, tf('hire.251'))}
              external
              size="lg"
            >
              {tf('hire.193')}
            </ContactCta>
          </div>
          <div className="relative md:order-first md:min-h-[440px]">
            <div className="overflow-hidden rounded-sm border border-tint-border bg-white shadow-card-hover md:absolute md:left-0 md:top-0 md:w-[80%]">
              <div className="flex items-center gap-1.5 border-b border-border-4 bg-pale-2 px-3.5 py-2.5">
                <span aria-hidden="true" className={DOT} />
                <span aria-hidden="true" className={DOT} />
                <span aria-hidden="true" className={DOT} />
                <span className="ml-2 flex-1 rounded-[6px] border border-border-4 bg-white px-2.5 py-1 text-eyebrow text-text-tertiary">
                  {host}
                </span>
              </div>
              {/* W129: the slot owns its box — the mock's full width at 800:310 */}
              <ImageSlot
                slot="portal-shortlist"
                src={null}
                alt={tf('hire.243')}
                width={800}
                height={310}
              />
            </div>
            {/* the phone frame sizes the slot (156×312 inside an 8 px bezel); ≤ 700 px it hides */}
            <div className="absolute bottom-0 right-6 z-[2] h-[328px] w-[172px] rounded-[26px] bg-navy p-2 shadow-card-hover max-md:hidden">
              <ImageSlot
                slot="portal-mobile-app"
                src={null}
                alt={tf('hire.244')}
                width={156}
                height={312}
                className="rounded-[19px]"
              />
            </div>
            <div className="mt-2.5 rounded-base border border-tint-border bg-white px-4 py-3.5 shadow-card-hover md:absolute md:bottom-6 md:left-0 md:z-[3] md:mt-0 md:max-w-[230px]">
              <p className="m-0 mb-1.5 flex items-center gap-2 text-body-sm font-extrabold text-ink">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
                {tf('hire.180')}
              </p>
              <p className="m-0 text-body-sm text-text-tertiary">{tf('hire.181')}</p>
              {/* ≤ 700 px: the design's decorative 12-of-15 progress bar */}
              <span
                aria-hidden="true"
                className="mt-2.5 block h-[7px] overflow-hidden rounded-pill bg-tint md:hidden"
              >
                <span className="block h-full w-4/5 rounded-pill bg-success" />
              </span>
            </div>
            <div className="mt-2.5 md:hidden">
              <StoreBadges
                bundle={bundle}
                locale={locale}
                android={s.storeLinks.android}
                ios={s.storeLinks.ios}
                tone="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Faq.tsx` (the section carries `#faq` + the scroll margin; `FaqBlock`'s own root id becomes `faq-list`, so the page has one `#faq`):

```tsx
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { FAQ_PAIRS } from '../_lib/tables';

export function Faq({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const items: FaqItem[] = FAQ_PAIRS.map((p) => ({ id: p.id, q: tf(p.qId), a: tf(p.aId) }));
  return (
    <Section tone="pale" id="faq" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-faq">
        {/* the design's ask card has WhatsApp + call only — no W83 e-mail row */}
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq-list"
          items={items}
          eyebrowId="hire.194"
          headingId="hire.195"
          bodyId="hire.196"
          askCard={{
            titleId: 'hire.197',
            bodyId: 'hire.198',
            whatsappNumber: s.whatsappNumber,
            whatsappText: tf('hire.252'),
            whatsappLabelId: 'hire.041',
            phone: s.phone,
            callLabelId: 'hire.032',
          }}
          singleOpen
          openFirst
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/_components" "src/app/[locale]/(site)/hire-workers/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `sections.test.tsx` 9/9 green; `src/design/__tests__/class-collisions.test.ts` green over the new files (every string was built so that no property is set twice at one variant — `m-0 mb-4` and `py-16 pt-0` are shorthand/longhand, which the scan accepts by design); `client-imports.test.ts` green (no barrel, not even type-only). A collision reported here is fixed in the class string, never by an allowlist entry.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_components/icons.tsx" "src/app/[locale]/(site)/hire-workers/_sections"
git commit -m "feat(hire): jump nav, logos, industries, source countries, comparison, process, portal and FAQ sections

By-path imports (W147/W156), ≤700 px rules as max-md:/md: classes (W10/W119), no
same-property pairs (W155), ImageSlot sized by its wrappers (W129), SVG marks
instead of text glyphs (D20), sprite flags and the build-time map (W14), metrics
from the collection (W1), portal shown at every width as the design does.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
#### Cycle 5 — the hero, the quick-quote card and the request form (the two `hire` shells)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/hire-workers/_sections/__tests__/forms.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { SECTOR_KEYS } from '@/content/collections';
import { makeTf, metricValues } from '@/content/pure';
import { START_WHEN_KEYS } from '@/forms/options';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { Hero } from '../Hero';
import { QuickQuote } from '../QuickQuote';
import { RequestForm } from '../RequestForm';

// The 'use server' module is replaced: jsdom renders the shells and never posts — Cycle 2 pins
// the actions, the Cycle 7 gate runs the real round trip.
vi.mock('../../actions', () => ({
  submitHireQuick: vi.fn(async () => ({ status: 'idle' })),
  submitHireFull: vi.fn(async () => ({ status: 'idle' })),
}));

const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
const TR = load('tr');
const tf = makeTf(TR, 'tr');
const WA = 'https://wa.me/905011240340';
const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
/** The visible label of the control with this id, without the required asterisk. */
const labelOf = (id: string) =>
  document.querySelector(`label[for="${id}"]`)?.textContent?.replace(/\s*\*$/, '');
const startWhenOptions = START_WHEN_KEYS.map((key) => ({
  value: key,
  label: tr.sys.form.options.startWhen[key],
}));
const requestForm = (
  <RequestForm
    bundle={TR}
    locale="tr"
    tf={tf}
    dialLabel={tr.sys.hire.form.dial}
    startWhenOptions={startWhenOptions}
  />
);
const hero = (
  <Hero
    bundle={TR}
    locale="tr"
    tf={tf}
    metrics={metricValues(TR, 'tr')}
    whatsappLabel={tr.sys.hire.whatsapp}
  />
);

describe('QuickQuote', () => {
  it('is a hire form with its own id scope and the package labels (W115), hidden ≤ 700 px by max-md:hidden (W10/W119)', () => {
    renderWithIntl(<QuickQuote bundle={TR} locale="tr" tf={tf} />);
    const form = screen.getByTestId('hire-form-quick');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    const expected: [string, string][] = [
      ['company', 'hire.047'],
      ['city', 'hire.048'],
      ['name', 'hire.053'],
      ['roleNeeded', 'hire.049'],
      ['headcount', 'hire.050'],
      ['phone', 'hire.051'],
      ['email', 'hire.052'],
    ];
    for (const [name, id] of expected) {
      expect(form.querySelector(`[name="${name}"]`)).toHaveAttribute('id', `f-hire-quick-${name}`);
      expect(labelOf(`f-hire-quick-${name}`)).toBe(tf(id));
    }
    expect(form.querySelector('#f-hire-quick-consent')).toHaveAttribute('type', 'checkbox'); // W79
    expect(within(form).getByRole('button', { name: tf('hire.063') })).toHaveAttribute(
      'type',
      'submit',
    );
    const desktop = screen.getByTestId('hire-quick-desktop');
    expect(tokens(desktop)).toContain('max-md:hidden');
    expect(tokens(desktop)).not.toContain('hidden');
    expect(desktop).toContainElement(form);
  });

  it('≤ 700 px: the CTA pair and the trust trio stand in for the form (md:hidden from 701 px)', () => {
    renderWithIntl(<QuickQuote bundle={TR} locale="tr" tf={tf} />);
    const mobile = screen.getByTestId('hire-quick-mobile');
    expect(tokens(mobile)).toContain('md:hidden');
    expect(within(mobile).getByRole('link', { name: tf('hire.040') })).toHaveAttribute(
      'href',
      '#request-form',
    );
    expect(within(mobile).getByRole('link', { name: tf('hire.041') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tf('hire.250'))}`,
    );
  });
});

describe('RequestForm', () => {
  it('is #request-form: a hire form with its own id scope, the package labels, keys as option values, TR preselected', () => {
    const { container } = renderWithIntl(requestForm);
    expect(container.querySelector('section#request-form')).not.toBeNull(); // W152/W158
    const form = screen.getByTestId('hire-form-full');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    const expected: [string, string][] = [
      ['company', tf('hire.047')],
      ['name', tf('hire.053')],
      ['email', tf('hire.052')],
      ['dial', tr.sys.hire.form.dial],
      ['phone', tf('hire.051')],
      ['sector', tf('hire.054')],
      ['roleNeeded', tf('hire.055')],
      ['headcount', tf('hire.056')],
      ['city', tf('hire.057')],
      ['startWhen', tf('hire.058')],
      ['message', tr.sys.form.labels.message],
    ];
    for (const [name, label] of expected) {
      expect(form.querySelector(`[name="${name}"]`)).toHaveAttribute('id', `f-hire-full-${name}`);
      expect(labelOf(`f-hire-full-${name}`)).toBe(label);
    }
    const values = (name: string) =>
      Array.from(
        form.querySelectorAll<HTMLOptionElement>(`select[name="${name}"] option`),
        (o) => o.value,
      );
    expect(values('sector')).toEqual(['', ...SECTOR_KEYS]); // W77
    expect(values('startWhen')).toEqual(['', ...START_WHEN_KEYS]); // W78
    expect(values('dial')).toHaveLength(65); // the placeholder + the 64 countries rows (W3)
    expect((form.querySelector('select[name="dial"]') as HTMLSelectElement).value).toBe('TR');
    expect(form.querySelector('#f-hire-full-consent')).toHaveAttribute('type', 'checkbox'); // W79
  });

  it('mails with the subject only (W95); the steps and the phone tile hide ≤ 700 px (W10/W119)', () => {
    renderWithIntl(requestForm);
    const region = screen.getByTestId('hire-request');
    const mailto = `mailto:info@jobsadmire.com?subject=${encodeURIComponent(tf('hire.253'))}`;
    expect(within(region).getByRole('link', { name: tf('hire.222') })).toHaveAttribute(
      'href',
      mailto,
    );
    expect(tokens(region.querySelector('ol')!)).toContain('max-md:hidden');
    const tel = region.querySelector('a[href="tel:+905011240340"]')!;
    expect(tokens(tel)).toContain('max-md:hidden');
    expect(tokens(tel)).not.toContain('hidden');
  });
});

describe('Hero', () => {
  it('names the h1 the LCP slot while hw-hero is a placeholder (D26); own crumbs (W109); metric pills (W1)', () => {
    const { container } = renderWithIntl(hero);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1.textContent).toBe(`${tf('hire.021')} ${tf('hire.022')} ${tf('hire.023')}`);
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(container.querySelector('[data-placeholder="hw-hero"]')).not.toHaveAttribute(
      'data-lcp-slot',
    );
    const crumbs = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(crumbs).getByRole('link', { name: tf('hire.020') })).toHaveAttribute(
      'href',
      '/',
    );
    expect(within(crumbs).getByText(tf('hire.002'))).toHaveAttribute('aria-current', 'page');
    const pills = screen.getByTestId('hire-hero-pills');
    expect(pills.textContent).toContain('470+');
    expect(pills.textContent).toContain(tf('hire.036'));
    const ctas = screen.getByTestId('hire-hero-ctas');
    expect(tokens(ctas)).toContain('max-md:hidden');
    expect(tokens(ctas)).not.toContain('hidden');
    expect(within(ctas).getByRole('link', { name: tf('hire.032') })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(within(ctas).getByRole('link', { name: tr.sys.hire.whatsapp })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tf('hire.249'))}`,
    );
  });
});

describe('the two hire shells on one page', () => {
  it('never share a DOM id (idScope hire-quick / hire-full — axe duplicate-id)', () => {
    const { container } = renderWithIntl(
      <>
        {hero}
        {requestForm}
      </>,
    );
    const ids = Array.from(container.querySelectorAll('[id]'), (el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['f-hire-quick-consent', 'f-hire-full-consent']));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hire-workers/_sections/__tests__/forms
```
Expected: FAIL — `../Hero`, `../QuickQuote`, `../RequestForm` cannot be resolved.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/_sections/QuickQuote.tsx` (server component — the card in the hero's right column):

```tsx
import { ContactCta } from '@/design/blocks/ContactCta';
import { Button } from '@/design/primitives/Button';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { submitHireQuick } from '../actions';

/** Design `.ja-quote-card`. ≤ 700 px the design swaps the form for "Request workers →" +
 *  "Ask on WhatsApp" + the trust trio; both halves are server-rendered and CSS decides (W10):
 *  the form half hides with `max-md:hidden`, the CTA half with `md:hidden` (W119 — never
 *  `hidden` beside a base display utility). */
export function QuickQuote({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const s = bundle.settings;
  const trust = (
    <p className="m-0 flex flex-wrap items-center justify-center gap-x-2 text-body-sm text-text-tertiary">
      <span>{tf('hire.042')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.043')}</span>
      <span aria-hidden="true">·</span>
      <span>{tf('hire.044')}</span>
    </p>
  );
  return (
    <div
      data-testid="hire-quick-card"
      className="overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form max-md:rounded-lg"
    >
      <div className="bg-blue-safe px-7 py-5 text-white max-md:px-5 max-md:py-4">
        <h2 className="m-0 mb-1 text-card-title">{tf('hire.037')}</h2>
        <p className="m-0 text-body-sm text-white">
          <span className="max-md:hidden">{tf('hire.038')}</span>
          <span className="md:hidden">{tf('hire.039')}</span>
        </p>
      </div>
      <div className="px-7 py-6 max-md:px-5 max-md:py-5">
        <div data-testid="hire-quick-mobile" className="flex flex-col gap-2.5 md:hidden">
          {/* D20: the design's green face is white on #16a34a (3.3:1) — the primary face instead */}
          <Button variant="primary" size="lg" href="#request-form" className="w-full">
            {tf('hire.040')}
          </Button>
          <ContactCta
            placement="page_cta"
            href={waLink(s.whatsappNumber, tf('hire.250'))}
            variant="success"
            external
            className="w-full"
          >
            {tf('hire.041')}
          </ContactCta>
          {trust}
        </div>
        <div data-testid="hire-quick-desktop" className="max-md:hidden">
          <FormShell
            action={submitHireQuick}
            formKey="hire"
            idScope="hire-quick"
            locale={locale}
            turnstileSiteKey={s.turnstileSiteKey}
            whatsappNumber={s.whatsappNumber}
            whatsappIntro={tf('hire.250')}
            contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
            submitLabel={tf('hire.063')}
            consent="checkbox"
            testId="hire-form-quick"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="company"
                label={tf('hire.047')}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <Field
                name="city"
                label={tf('hire.048')}
                required
                autoComplete="address-level2"
                maxLength={120}
              />
            </div>
            <Field
              name="name"
              label={tf('hire.053')}
              required
              autoComplete="name"
              maxLength={120}
            />
            <Field name="roleNeeded" label={tf('hire.049')} required maxLength={200} />
            <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
              <Field
                name="headcount"
                label={tf('hire.050')}
                type="number"
                min={1}
                required
                inputMode="numeric"
              />
              {/* hint="" drops the kernel's "include the country code" hint: a Turkish national
                  number is normalised to +90 (phone.ts) */}
              <Field
                name="phone"
                label={tf('hire.051')}
                type="tel"
                required
                hint=""
                autoComplete="tel"
                inputMode="tel"
                maxLength={40}
              />
            </div>
            <Field
              name="email"
              label={tf('hire.052')}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              maxLength={254}
            />
          </FormShell>
          <div className="mt-3">{trust}</div>
          <a
            href="#request-form"
            className="mt-4 block border-t border-border-3 pt-4 text-center text-body-sm font-bold text-blue-safe no-underline hover:text-ink"
          >
            {tf('hire.066')}
          </a>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/Hero.tsx`:

```tsx
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon } from '../_components/icons';
import { HERO_SIZE, HERO_SRC } from '../_lib/assets';
import { sp } from '../_lib/fragments';
import { QuickQuote } from './QuickQuote';

const PILL = 'inline-flex gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2';

export function Hero({
  bundle,
  locale,
  tf,
  metrics,
  whatsappLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** metricValues(bundle, locale) — '' for an unsigned metric (W1: its pill is hidden) */
  metrics: Record<string, string>;
  /** sys.hire.whatsapp */
  whatsappLabel: string;
}) {
  const s = bundle.settings;
  const heroIsLcp = HERO_SRC !== null;
  const [h1a, h1b, h1c] = [tf('hire.021'), tf('hire.022'), tf('hire.023')];
  const lead = (a: string, b: string) => {
    const x = tf(a);
    const y = tf(b);
    return (
      <>
        {x}
        {sp(x, y)}
        <strong className="text-white">{y}</strong>
      </>
    );
  };
  return (
    <section data-testid="hire-hero" className="relative overflow-hidden bg-navy text-white">
      {/* D26 + W129: the named hero slot. ImageSlot owns its box (full width at 9:4 —
          HERO_SIZE), so the cover crop is this wrapper's job: height-led, at least full width,
          centred, clipped by the section. With a photo (HERO_SRC) the image is the LCP element
          (`data-lcp-slot="hw-hero"` + preload); without one it is a decorative named placeholder
          and the h1 carries the LCP slot. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 aspect-[9/4] h-full min-w-full -translate-x-1/2 -translate-y-1/2">
          <ImageSlot
            slot="hw-hero"
            lcp={heroIsLcp}
            src={HERO_SRC}
            alt=""
            width={HERO_SIZE.width}
            height={HERO_SIZE.height}
            sizes="100vw"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70"
      />
      <div className="container-site relative grid items-center gap-10 py-14 max-md:gap-6 max-md:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-16">
        <div>
          {/* W109: this page's own labels — hire.020 (crumbHome), hire.002 (navHire) */}
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: tf('hire.020'), href: '/' },
              { name: tf('hire.002'), href: '/hire-workers' },
            ]}
          />
          <h1
            data-testid="page-h1"
            data-lcp-slot={heroIsLcp ? undefined : 'h1'}
            className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] max-md:text-[31px] max-md:leading-[1.08]"
          >
            {h1a}
            {sp(h1a, h1b)}
            <span className="text-sky">{h1b}</span>
            {sp(h1b, h1c)}
            {h1c}
          </h1>
          <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80 max-md:mb-5">
            <span className="max-md:hidden">{lead('hire.024', 'hire.025')}</span>
            <span className="md:hidden">{lead('hire.026', 'hire.027')}</span>
          </p>
          <ul className="m-0 mb-7 flex max-w-[560px] list-none flex-wrap gap-x-8 gap-y-3 p-0 max-md:mb-5 max-md:flex-col max-md:gap-y-2">
            {(
              [
                ['hire.028', 'hire.029'],
                ['hire.030', 'hire.031'],
              ] as const
            ).map(([strong, tail]) => (
              <li key={strong} className="flex items-start gap-2.5 text-body text-white/75">
                <CheckIcon className="mt-1 flex-none text-success-border" />
                <span>
                  <strong className="text-white">{tf(strong)}</strong>
                  {sp(tf(strong), tf(tail))}
                  {tf(tail)}
                </span>
              </li>
            ))}
          </ul>
          {/* ≤ 700 px the design hides this row — the mobile bottom bar carries both doors */}
          <div data-testid="hire-hero-ctas" className="mb-6 flex flex-wrap gap-3 max-md:hidden">
            <ContactCta placement="page_cta" href={telLink(s.phone)} variant="inverse">
              {tf('hire.032')}
            </ContactCta>
            <ContactCta
              placement="page_cta"
              href={waLink(s.whatsappNumber, tf('hire.249'))}
              variant="success"
              external
            >
              {whatsappLabel}
            </ContactCta>
          </div>
          <ul
            data-testid="hire-hero-pills"
            className="m-0 flex list-none flex-wrap gap-3 p-0 text-body-sm"
          >
            <li className={`${PILL} items-center font-bold text-white/80`}>
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
              {tf('hire.034')}
            </li>
            {metrics.placed ? (
              <li className={`${PILL} items-baseline text-white/75`}>
                <span className="text-body font-extrabold text-sky">{metrics.placed}</span>
                {tf('hire.035')}
              </li>
            ) : null}
            {metrics.countries ? (
              <li className={`${PILL} items-baseline text-white/75`}>
                <span className="text-body font-extrabold text-success-border">
                  {metrics.countries}
                </span>
                {tf('hire.036')}
              </li>
            ) : null}
          </ul>
        </div>
        <QuickQuote bundle={bundle} locale={locale} tf={tf} />
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/hire-workers/_sections/RequestForm.tsx` (server component — `section#request-form`, the target of the header's `DEFAULT_CTAS`, the sticky bar, the jump nav and every "Request workers" anchor). DOM order is head → card → the rest, so the ≤ 900 px single column reads badge, heading, sub, **form**, steps/trust/direct in both visual and focus order (delta 15: the design moves the card up only at ≤ 700 px); from 901 px a two-row grid (`auto` + `1fr`) puts the card in column 2 beside both rows:

```tsx
import { ContactLink } from '@/analytics/ContactLink';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives/Section';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { Locale } from '@/i18n/routing';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon } from '../_components/icons';
import { dialOptions } from '../_lib/countries';
import { submitHireFull } from '../actions';

const STEPS = [
  ['hire.202', 'hire.203'],
  ['hire.204', 'hire.205'],
  ['hire.206', 'hire.207'],
] as const;

const TILE =
  'min-w-0 items-center gap-3 rounded-xs border border-border-2 bg-pale-1 px-3.5 py-3 no-underline hover:bg-tint';
// D20: the tiles are bg-pale-1, where text-tertiary is 4.49:1 — the labels use text-secondary
const TILE_LABEL = 'block text-body-sm font-bold uppercase tracking-[0.5px] text-text-secondary';
const TILE_VALUE = 'block truncate text-body font-extrabold text-ink';

export function RequestForm({
  bundle,
  locale,
  tf,
  dialLabel,
  startWhenOptions,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** sys.hire.form.dial — resolved by the page */
  dialLabel: string;
  /** START_WHEN_KEYS (W78) with their sys.form.options.startWhen.* labels — resolved by the page */
  startWhenOptions: FieldOption[];
}) {
  const s = bundle.settings;
  const sectors: FieldOption[] = getCollection(bundle, 'sectors').map((row) => ({
    value: row.key,
    label: tf(row.labelId),
  }));
  const dials = dialOptions(getCollection(bundle, 'countries'), locale);
  // W95: the subject only — the design's sendByEmail body (hire.254–263 + the typed fields)
  // would put visitor data into a DOM href.
  const mailto = mailLink(s.email, tf('hire.253'));
  return (
    <Section
      tone="light"
      id="request-form"
      className="scroll-mt-20 bg-gradient-to-b from-pale-1 to-white to-55%"
    >
      <div
        data-testid="hire-request"
        className="container-site grid lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16"
      >
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="m-0 mb-4 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-4 py-1.5 text-body-sm font-extrabold text-success-text">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
            {tf('hire.199')}
          </p>
          <h2 className="m-0 mb-4 text-h2">{tf('hire.200')}</h2>
          <p className="m-0 mb-7 text-body-lg text-text-secondary">{tf('hire.201')}</p>
        </div>
        <div className="mb-8 overflow-hidden rounded-lg border border-border-1 bg-white shadow-card-hover lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:self-start">
          <div className="bg-blue-safe px-8 py-6 text-white max-md:px-5 max-md:py-4">
            <h3 className="m-0 mb-1 text-card-title">{tf('hire.214')}</h3>
            <p className="m-0 text-body-sm text-white">{tf('hire.215')}</p>
          </div>
          <div className="px-8 pb-6 pt-7 max-md:px-4 max-md:pb-5 max-md:pt-5">
            <FormShell
              action={submitHireFull}
              formKey="hire"
              idScope="hire-full"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('hire.249')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={tf('hire.063')}
              consent="checkbox"
              headingLevel={4}
              testId="hire-form-full"
            >
              <Field
                name="company"
                label={tf('hire.047')}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="name"
                  label={tf('hire.053')}
                  required
                  autoComplete="name"
                  maxLength={120}
                />
                <Field
                  name="email"
                  label={tf('hire.052')}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                />
              </div>
              <div className="grid gap-2.5 sm:grid-cols-[minmax(120px,0.45fr)_1fr]">
                {/* ISO-2 values (W3): +1/+7 are shared by several countries; W111: the select
                    ignores placeholder, defaultValue pre-selects Türkiye */}
                <Field
                  name="dial"
                  label={dialLabel}
                  as="select"
                  options={dials}
                  defaultValue="TR"
                  required
                  autoComplete="tel-country-code"
                />
                {/* the dial select carries the country code: no "+90 …" placeholder or hint */}
                <Field
                  name="phone"
                  label={tf('hire.051')}
                  type="tel"
                  required
                  hint=""
                  placeholder=""
                  autoComplete="tel-national"
                  inputMode="tel"
                  maxLength={32}
                />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="sector"
                  label={tf('hire.054')}
                  as="select"
                  required
                  options={sectors}
                />
                <Field name="roleNeeded" label={tf('hire.055')} required maxLength={200} />
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field
                  name="headcount"
                  label={tf('hire.056')}
                  type="number"
                  min={1}
                  required
                  inputMode="numeric"
                />
                <Field
                  name="city"
                  label={tf('hire.057')}
                  autoComplete="address-level2"
                  maxLength={120}
                />
              </div>
              <Field
                name="startWhen"
                label={tf('hire.058')}
                as="select"
                options={startWhenOptions}
              />
              <Field name="message" as="textarea" rows={3} maxLength={5000} />
            </FormShell>
            <p className="m-0 mt-2 text-center text-body-sm text-text-tertiary">
              {tf('hire.219')}
            </p>
            <p className="m-0 mt-1 text-center text-body-sm leading-snug text-text-tertiary">
              {tf('hire.220')}
            </p>
            <p className="m-0 mt-3 text-center text-body-sm text-text-tertiary">
              {tf('hire.221')}{' '}
              <ContactLink
                href={mailto}
                placement="page_cta"
                className="font-extrabold text-blue-safe underline"
              >
                {tf('hire.222')}
              </ContactLink>
            </p>
          </div>
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <ol className="m-0 flex list-none flex-col gap-4 p-0 max-md:hidden">
            {STEPS.map(([lead, tail], i) => (
              <li key={lead} className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-pill bg-blue-safe text-body-sm font-extrabold text-white"
                >
                  {i + 1}
                </span>
                <span className="text-body text-text-secondary">
                  <strong className="text-ink">{tf(lead)}</strong> {tf(tail)}
                </span>
              </li>
            ))}
          </ol>
          <ul className="m-0 mt-7 flex list-none flex-col gap-3 border-t border-border-1 p-0 pt-6 text-body text-text-secondary max-md:mt-0 max-md:border-t-0 max-md:pt-0">
            {(['hire.208', 'hire.209', 'hire.210'] as const).map((id) => (
              <li key={id} className="flex items-start gap-2.5">
                <CheckIcon size={15} className="mt-1 flex-none text-success" />
                <span>{tf(id)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 border-t border-border-1 pt-6">
            {/* on the section's pale → white gradient: text-secondary, never tertiary (D20) */}
            <p className="m-0 mb-3 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-secondary">
              {tf('hire.211')}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* ≤ 700 px the phone tile hides — the mobile bottom bar carries the call */}
              <ContactLink
                href={telLink(s.phone)}
                placement="page_cta"
                className={`flex ${TILE} max-md:hidden`}
              >
                <span className="block min-w-0">
                  <span className={TILE_LABEL}>{tf('hire.212')}</span>
                  <span className={TILE_VALUE}>{s.phoneDisplay}</span>
                </span>
              </ContactLink>
              <ContactLink href={mailto} placement="page_cta" className={`flex ${TILE}`}>
                <span className="block min-w-0">
                  <span className={TILE_LABEL}>{tf('hire.213')}</span>
                  <span className={TILE_VALUE}>{s.email}</span>
                </span>
              </ContactLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

Notes for the implementer:
- Both shells carry `formKey="hire"` (D13: one conversion key) and a distinct `idScope`, so every kernel id — fields `f-hire-quick-company`/`f-hire-full-company`, honeypot, Turnstile, consent — is unique on the page (axe `duplicate-id*`). No `Field` passes an explicit `id`.
- No `consentLinkHref` (W79): the shell's default `/privacy` is its only allowed value, and T13 shipped that page.
- The fallback heading follows the outline: the quick card's title is an `h2` → the panel's `h3` (the shell default); the request card's title is an `h3` → `headingLevel={4}`.
- `ContactCta`/`Button` receive only `variant`/`size`/a width class — never a colour or display class (W122/W127); the static scan expands `<ContactCta>`/`<Button>` against the real `buttonClassName`, so `className="w-full"` is checked against every base it lands on.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `forms.test.tsx` 6/6 green; the whole suite green incl. `class-collisions.test.ts` and `client-imports.test.ts`. Nothing renders the sections yet — the page wires them in Cycle 6, and only the Cycle 7 build proves the server/client boundaries (W126: jsdom cannot see RSC boundaries).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/_sections"
git commit -m "feat(hire): hero with the quick-quote card and the #request-form section — the two hire shells

Distinct idScopes (hire-quick / hire-full), consent checkbox on both (W79), package
field labels (W115), keys as option values (W77/W78), ISO-2 dial preselected (W3/W111),
quick-quote hidden ≤700 px by max-md:hidden (W10/W119), hero slot in a cover wrapper
with the h1 as the named LCP slot (W129/D26), subject-only mailto (W95), DOM order =
visual order in the request section (D20); renders id=request-form (W152/W158).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
#### Cycle 6 — the page (replaces the WP1 spike), the page e2e contract, the SEO/analytics/PRD docs

- [ ] **Step 1: Write the failing test**

`e2e/pages/hire.spec.ts` (runs under both Playwright projects inside the Cycle 7 gate; it needs no door and no `OPS_API_URL` — W92):

```ts
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/isci-talebi', en: '/en/hire-workers' } as const;
/** `bundle.settings.whatsappNumber` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
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

async function fillFull(form: Locator) {
  await form.getByLabel(/Firma adı|Company name/).fill('Acme A.Ş.');
  await form.getByLabel(/İletişim kişisi|Contact person/).fill('Ayşe Yılmaz');
  await form.getByLabel(/Kurumsal e-posta|Work email/).fill('ayse@acme.example');
  await form.getByLabel(/Ülke kodu|Country code/).selectOption('TR');
  await form.getByLabel(/Telefon \/ WhatsApp|Phone \/ WhatsApp/).fill('0532 000 00 00');
  await form.getByLabel(/Sektör|Industry/).selectOption('factory');
  await form.getByLabel(/İhtiyaç duyulan pozisyonlar|Roles needed/).fill('kaynakçı');
  await form.getByLabel(/İşçi sayısı|Number of workers/).fill('5');
  await form.getByRole('checkbox').check(); // W79: the consent tick
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

type JsonLdNode = Record<string, unknown> & { '@type'?: string };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: the request form validates on the server and falls back to the D11 panel without a door (W92)`, async ({
    page,
  }) => {
    test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
    await page.goto(ROUTES[locale]);
    const form = page.getByTestId('hire-form-full');
    await expect(form).toBeVisible();
    await expect(form).toHaveAttribute('data-form-key', 'hire');
    const submit = form.getByRole('button', { name: /İşçi talep edin|Request Workers/ });
    // 1. Empty submit → field errors (incl. the consent tick), no navigation.
    await submit.click();
    await expect(form.getByRole('alert').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 2. Valid submit → no door → the fallback panel (D11), still no navigation.
    await fillFull(form);
    await submit.click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    expect(new URL(page.url()).pathname).toBe(ROUTES[locale]);
    // 3. The typed values survive the failed submit and reach WhatsApp only on click.
    await expect(form.getByLabel(/Firma adı|Company name/)).toHaveValue('Acme A.Ş.');
    await expectBareWhatsAppFallback(page, panel, 'Acme A.Ş.');
  });

  test(`${locale}: one page-h1 holding the only data-lcp-slot, named placeholders, no leaked ids or tokens, metric pills (D26/W55/W1)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).not.toBeEmpty();
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // the hero photo is still a placeholder
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    for (const slot of ['hw-hero', 'portal-shortlist', 'portal-mobile-app'])
      await expect(page.locator(`[data-placeholder="${slot}"]`)).toHaveCount(1);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bhire\.\d{3}\b/); // a package id leaking as text
    // static `metricValues` text — this page mounts no Stat count-up, so no emulateMedia (W178)
    await expect(page.getByTestId('hire-hero-pills')).toContainText('470+');
  });

  test(`${locale}: the designed sections in order, one of each anchor, no logo band, the header CTA's #request-form (W6/W152/W158)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'hire-hero',
      'hire-industries',
      'hire-source-countries',
      'hire-compare',
      'hire-process',
      'hire-portal',
      'hire-faq',
      'hire-request',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toBeVisible();
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    await expect(page.getByTestId('hire-logos')).toHaveCount(0); // W6
    for (const anchor of ['request-form', 'industries', 'compare', 'process', 'faq'])
      await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
    // DEFAULT_CTAS (no CTA_BY_PATHNAME entry, W121) → the header CTA targets this page's form
    const cta = page.getByRole('banner').getByRole('link', { name: /^(Talep|Request)/ });
    await expect(cta).toHaveAttribute('href', `${ROUTES[locale]}#request-form`);
  });
}

test('tr: two hire shells with their own id scopes; the quick-quote is a form from 701 px and a CTA pair at ≤ 700 px (W10/W119)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await expect(page.locator('#f-hire-quick-consent')).toHaveCount(1);
  await expect(page.locator('#f-hire-full-consent')).toHaveCount(1);
  const quick = page.getByTestId('hire-form-quick');
  const mobile = page.getByTestId('hire-quick-mobile');
  if (isMobile()) {
    await expect(quick).toBeHidden();
    await expect(mobile.getByRole('link', { name: /İşçi talep edin/ })).toHaveAttribute(
      'href',
      '#request-form',
    );
    return;
  }
  await expect(mobile).toBeHidden();
  await expect(quick).toBeVisible();
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await quick.getByLabel(/Firma adı/).fill('Acme');
  await quick.getByLabel(/Hangi şehirde/).fill('Bursa');
  await quick.getByLabel(/İletişim kişisi/).fill('Ali Veli');
  await quick.getByLabel(/İhtiyaç duyulan pozisyonlar/).fill('kaynakçı');
  await quick.getByLabel(/Kaç kişi/).fill('3');
  await quick.getByLabel(/Telefon \/ WhatsApp/).fill('0532 000 00 00');
  await quick.getByLabel(/Kurumsal e-posta/).fill('ali@acme.example');
  await quick.getByRole('checkbox').check(); // W79: a checkbox here too, never the notice mode
  await quick.getByRole('button', { name: /İşçi talep edin/ }).click();
  const panel = quick.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expectBareWhatsAppFallback(page, panel, 'Ali Veli');
});

test('the ≤ 700 px rules are CSS classes on server-rendered markup (W10/W119)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const mobileOnly = [page.getByTestId('hire-jump'), page.getByTestId('hire-quick-mobile')];
  const desktopOnly = [
    page.getByTestId('hire-hero-ctas'),
    page.getByTestId('hire-form-quick'),
    page.getByTestId('hire-request').locator('ol').first(),
    page.locator('[data-placeholder="portal-mobile-app"]'),
  ];
  for (const l of isMobile() ? mobileOnly : desktopOnly) await expect(l).toBeVisible();
  for (const l of isMobile() ? desktopOnly : mobileOnly) await expect(l).toBeHidden();
  // the design hides nothing of this page at ≤ 460 px: the portal block shows at every width
  await expect(page.getByTestId('hire-portal')).toBeVisible();
});

test('tr: the source map carries every source country and the flag chips are sprite flags (W14)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const map = page.getByTestId('hire-map');
  await expect(map.locator('g[data-country]')).toHaveCount(14); // 13 sources + Türkiye
  await expect(map.locator('g[data-country="LK"] > title')).toHaveText(/Sri Lanka/);
  await expect(map.locator('g[data-country="TR"] > title')).toHaveText('Türkiye');
  const flags = page.getByTestId('hire-flags');
  expect(await flags.locator('svg use[href$="#flag-PK"]').count()).toBeGreaterThan(0);
  await expect(flags).toContainText('Pakistan');
});

test('tr: the industries accordion opens one sector at a time and its CTA prefills the request form (W77)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const region = page.getByTestId('hire-industries');
  await expect(region.getByRole('button', { expanded: false })).toHaveCount(6);
  await region.getByRole('button', { name: /Tekstil/ }).click();
  await expect(region.getByRole('button', { name: /Tekstil/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await region.getByRole('link', { name: /Tekstil işçisi talep edin/ }).click();
  await expect(page.getByTestId('hire-form-full').getByLabel(/Sektör/)).toHaveValue('textile');
  expect(new URL(page.url()).hash).toBe('#request-form');
});

test('tr: one BreadcrumbList on this page’s own labels and one FAQPage with seven pairs (W109)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const nodes = await jsonLdNodes(page);
  const faq = nodes.filter((n) => n['@type'] === 'FAQPage');
  expect(faq).toHaveLength(1);
  expect(faq[0].mainEntity).toHaveLength(7);
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList') as unknown as {
    itemListElement: { name: string; item: string }[];
  }[];
  expect(crumbs).toHaveLength(1);
  // W109: hire.020 → '/', hire.002 → this page
  expect(crumbs[0].itemListElement.map((i) => i.name)).toEqual(['Ana Sayfa', 'İşçi Talebi']);
  expect(crumbs[0].itemListElement[1].item.endsWith('/isci-talebi')).toBe(true);
});

test('the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(isMobile(), 'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts');
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/hire-workers$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('desktop: the sticky bar appears after 700 px, hides near #request-form, publishes its height and tracks its contact CTAs (W18/W81)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries the offer below lg');
  await page.goto(ROUTES.tr);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toBeVisible();
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sticky-cta-h').trim(),
    ),
  ).not.toBe('0px');
  // W81/W12: the bar's tel: CTA renders through ContactLink — its click pushes call_click page_cta
  const call = bar.getByRole('link', { name: /Arayın/ });
  await call.evaluate((a) =>
    a.addEventListener('click', (e) => e.preventDefault(), { once: true }),
  );
  await call.click();
  const pushed = await page.evaluate(
    () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [],
  );
  expect(pushed.some((e) => e.event === 'call_click' && e.placement === 'page_cta')).toBe(true);
  await page.locator('#request-form').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});
```

`track()` pushes to `window.dataLayer` whether or not GTM is configured (`src/analytics/track.ts`; the thank-you spec relies on the same), so the `call_click` assertion needs no consent.

- [ ] **Step 2: Run to verify it fails**

No server may start before Cycle 7 (W126). Prove the spec compiles and is collected, and confirm the red state by reading the committed spike:

```bash
npx playwright test e2e/pages/hire.spec.ts --list
grep -n 'data-lcp-slot="h1"' "src/app/[locale]/(site)/hire-workers/page.tsx"
```
Expected: `Total: 26 tests in 1 file` (13 cases × the `mobile` and `desktop` projects); the grep shows the spike's only markup, `<h1 data-testid="page-h1" data-lcp-slot="h1">{locale}</h1>` — against it every case fails on its first `hire-*` locator. The spec executes exactly once, green, in Cycle 7's gate.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/hire-workers/page.tsx` — replace the whole file:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT, makeTf, metricValues } from '@/content/adapter';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import type { FieldOption } from '@/forms/client/Field';
import { START_WHEN_KEYS } from '@/forms/options';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { CLIENT_LOGOS } from './_lib/assets';
import { ClientLogos } from './_sections/ClientLogos';
import { Comparison } from './_sections/Comparison';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Industries } from './_sections/Industries';
import { JumpNav } from './_sections/JumpNav';
import { PortalPreview } from './_sections/PortalPreview';
import { Process } from './_sections/Process';
import { RequestForm } from './_sections/RequestForm';
import { SourceCountries } from './_sections/SourceCountries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  // The page record (both bundles) carries hire.264/hire.265, which win; the fallbacks are the
  // same ids, so a record without them still renders the package's own SEO copy (W23: there is
  // no sys.seo.hire.*). OG image: /og/{locale}/hire.png, CDN-cached (W123).
  return buildMetadata({
    locale,
    href: '/hire-workers',
    bundle,
    pageKey: 'hire',
    fallbackTitle: t('hire.264'),
    fallbackDescription: t('hire.265'),
  });
}

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // D17/W1: every package id goes through makeTf, so a re-authored `{metric}` placeholder
  // renders its value; the figures shown outside a string come from metricValues.
  const tf = makeTf(bundle, locale);
  const metrics = metricValues(bundle, locale);
  const s = bundle.settings;
  const whatsapp = sys('hire.whatsapp');
  // W78: one startWhen vocabulary site-wide, labelled by the shared sys copy.
  const startWhenOptions: FieldOption[] = START_WHEN_KEYS.map((key) => ({
    value: key,
    label: sys(`form.options.startWhen.${key}`),
  }));
  // W81: the bar renders its tel:/wa.me CTAs through ContactCta → ContactLink (page_cta); the
  // request CTA is a same-page anchor. Faces are variants (W122/W127), never caller classes.
  const stickyCtas: StickyCta[] = [
    { label: tf('hire.033'), href: telLink(s.phone), variant: 'secondary' },
    {
      label: whatsapp,
      href: waLink(s.whatsappNumber, tf('hire.249')),
      variant: 'success',
      external: true,
    },
    { label: tf('hire.040'), href: '#request-form', variant: 'primary' },
  ];
  return (
    <>
      <Hero bundle={bundle} locale={locale} tf={tf} metrics={metrics} whatsappLabel={whatsapp} />
      <JumpNav tf={tf} label={sys('hire.jump.label')} />
      {/* design .ja-sticky: after 700 px of scroll, hidden while #request-form is near (W18) */}
      <StickyCtaBar
        message={tf('hire.072')}
        ctas={stickyCtas}
        showAfterPx={700}
        hideNearId="request-form"
        live
      />
      <ClientLogos tf={tf} employers={metrics.employers ?? ''} logos={CLIENT_LOGOS} />
      <Industries bundle={bundle} tf={tf} />
      <SourceCountries
        bundle={bundle}
        tf={tf}
        countries={metrics.countries ?? ''}
        sys={{
          titleTail: sys.raw('hire.sc.titleTail') as string,
          mapTitle: sys('hire.sc.mapTitle'),
          pause: sys('marquee.pause'),
          play: sys('marquee.play'),
        }}
      />
      <Comparison tf={tf} />
      <Process bundle={bundle} locale={locale} tf={tf} />
      <PortalPreview bundle={bundle} locale={locale} tf={tf} />
      <Faq bundle={bundle} locale={locale} tf={tf} />
      <RequestForm
        bundle={bundle}
        locale={locale}
        tf={tf}
        dialLabel={sys('hire.form.dial')}
        startWhenOptions={startWhenOptions}
      />
    </>
  );
}
```

Notes for the implementer:
- No `<main>` (R31 — the `(site)` layout's `SiteChrome` owns it); no `generateStaticParams` (the locale layout has it); no `revalidate` export (no D17 dated badge on this page, W150) — the route stays SSG like the spike.
- One `Breadcrumbs` (in `Hero`) and one `FaqBlock` (in `Faq`) on the page: exactly one `BreadcrumbList` and one `FAQPage` node (the WP2a final review's page rule).
- `sys.raw('hire.sc.titleTail')`: next-intl's `raw` returns the message untouched; the EN value is `''` on purpose and renders as nothing.
- `metricValues`/`makeTf` come from `@/content/adapter` (`export * from './pure'`); never import `design-package/**` or `content/local/*` (ESLint `no-restricted-imports`, D23).
- Every `tel:`/`wa.me`/`mailto:` anchor on the page is a `ContactCta`/`ContactLink` with `placement="page_cta"` (W12/W32), the sticky bar's through the bar itself (W81). No `wa.me` href carries visitor data (W95): the page's own links carry package prefills (`hire.249`–`252`); the forms' fallback anchors are bare (W76).
- No client module reads `sys.hire`: `CLIENT_SYS` (`src/i18n/client-messages.ts`) stays `consent, languageHint, errorTitle, errorRetry, form` (W148).

`docs/SEO.md` — append one row to the per-page table T1 created (W98; `grep -n '^## Pages' docs/SEO.md` finds it — columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`), after the table's LAST row (W98: rows in execution order — at T2's turn that is T13's `| Newsletter unsubscribe | …` row, after T1's Homepage row and T13's portal/legal/newsletter rows):

```markdown
| Hire Workers (T2) | `/isci-talebi` · `/en/hire-workers` | page record `hire` → `hire.264` / `hire.265` (the package's own SEO strings; no `sys.seo.hire.*`, W23); OG `/og/{locale}/hire.png`, CDN-cached (W123) | `absoluteUrl(locale, '/hire-workers')`; hreflang tr / en / x-default | layout `Organization` + `WebSite`; `BreadcrumbList` (2: `hire.020` → `/`, `hire.002` → this page, W109); `FAQPage` (7 pairs `hire.289`–`302`, AEO only) — one `Breadcrumbs` and one `FaqBlock` on the page | **the h1** (`data-lcp-slot="h1"`) while the hero photo slot `hw-hero` is a named placeholder (§10 #4); setting `HERO_SRC` in `_lib/assets.ts` moves `data-lcp-slot="hw-hero"` + `preload` onto the image and off the h1 (D26) | two `hire` forms — the quick-quote (≥ 701 px) and `#request-form`, the header `DEFAULT_CTAS` target (W152/W158); consent checkbox on both (W79); pixel page (D27) |
```

`docs/ANALYTICS.md` — under `### Page instrumentation (WP2b)` (T1's heading, W98), append after the list's LAST bullet (W98: execution order — at T2's turn that is T13's "- **Newsletter confirm/unsubscribe (T13):** …" bullet, after T1's Homepage and T13's Portal entry/Legal pages bullets) and before the heading `## Conversion`:

```markdown
- **Hire Workers (`/isci-talebi`, `/en/hire-workers`, T2):** `call_click` / `whatsapp_click` / `email_click` with `placement: 'page_cta'` from the hero Call (`inverse`) and WhatsApp (`success`) buttons, the quick-quote's ≤ 700 px "Ask on WhatsApp", the request section's phone and e-mail tiles and its "Send this request by email" link (subject only, W95), the FAQ ask card's WhatsApp and Call rows (`FaqBlock`), the portal block's "Book a demo" and the sticky bar's Call/WhatsApp (rendered through `ContactCta` by the bar itself, W81); `placement: 'form_fallback'` from the two `hire` forms' D11 panels (kernel); `conversion` for `form_key: 'hire'` from `ConversionPing` on `/tesekkurler` (`generate_lead` has no caller yet — T14 wires it beside `conversion` there) — the page fires none of them itself. Same-page anchors fire nothing: the industries "Request <sector> workers →" links (which pre-select the request form's sector key), the ≤ 700 px jump nav and "Request workers →", "Full request form ↓". No page event, no new parameter (W12/W26).
```

`docs/PRD.md` — §2, the table row whose second cell is `Hire Workers`: replace its last cell (`Detailed employer request form (\`INQUIRY\`)`) with:

```markdown
Hero quick-quote (≥ 701 px) + detailed request form (`#request-form`), both `INQUIRY` via `hire`: the quick-quote adds the door's required contact `name` (W3); both carry the consent checkbox (W79) and send `city` (catalog v1.1, W16 — required on the quick-quote, optional on the request form); `sector` is the sector key and `startWhen` the shared key set (W77/W78); success → `/tesekkurler?form=hire` (D13), failure → the D11 fallback panel; the industries CTAs pre-select the request form's sector
```

and in the §11 sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`), replace exactly the clause "Hire Workers is still the spike placeholder until T2" — the wording T1 left inside its parenthesis "(the homepage is the first designed page — WP2b T1; Hire Workers is still the spike placeholder until T2)", which T1 hands to this task verbatim (T13 then decremented the count to "11 of the 14 core pages" for the portal entry and inserted "; the portal entry is built (WP2b T13)" after this clause) — with "Hire Workers is the second — WP2b T2". The sentence's count ("11 of the 14 core pages" after T13) stays as it is: the homepage and Hire Workers were already the two pages that existed (W45: edit in place, never re-add WP1 wording). If `grep -n 'still the spike placeholder until T2' docs/PRD.md` finds nothing, T1 drifted: stop and report rather than rewrite the sentence from scratch.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers/page.tsx" e2e/pages/hire.spec.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: clean — typecheck covers `e2e/pages/hire.spec.ts`; the whole Vitest suite green (the page file has no unit test of its own: it only composes the tested sections and is proven by the Cycle 7 build + gate).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/hire-workers/page.tsx" e2e/pages/hire.spec.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
git commit -m "feat(hire): the Hire Workers page replaces the WP1 spike; page e2e contract; SEO, analytics and PRD docs

Hero + quick-quote, jump nav, sticky bar (W18/W81), industries, source map (W14),
comparison, process, portal, FAQ and #request-form (W152/W158) on the WP2a
foundation; h1 is the named LCP slot while hw-hero is a placeholder (D26); the e2e
is deterministic without a door (W92) and skips its submits on a door face.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---
#### Cycle 7 — the W126 proof session: one build, one start, the gate, js-size, pixel run 1, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome.

- [ ] **Step 1: Pre-flight — no new test (the Cycle 6 page spec and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
grep -n "isci-talebi\|/en/hire-workers" e2e/routes.ts        # 2 hits, both `indexable: true` (W20/W21)
grep -n "'/hire-workers'" src/lib/seo/routes.ts               # no hit inside UNBUILT_PATHNAMES
grep -n "hire-workers" src/design/chrome/ctas.ts               # only HIRE (no hash) and DEFAULT_CTAS' `hash: '#request-form'` — no CTA_BY_PATHNAME key (W121)
ls -a | grep '^\.env'                                          # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'door-less, GTM-dark'
git status --short                                             # clean: Cycles 1–6 are committed
```
Expected: exactly as annotated. A door variable or an `.env.local` must be removed from this shell/worktree before building — the gate's page spec must meet the door-less face (W92) and a GTM id would put third-party script into the measured budget (W146). If a route fact differs, WP2a drifted: stop and report; never "fix" the route list from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
rm -rf .next .lighthouseci lighthouse-report .pixel test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/hire-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/isci-talebi && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds (it is the first time the RSC boundaries of `page.tsx` → sections → the `'use client'` `FormShell`/`Field`/`Accordion`/`PausableMarquee`/`StickyCtaBar`/`SectorPrefillLink`/`ContactLink` are compiled — jsdom could not see them); the build's route table lists `/[locale]/hire-workers` as prerendered for both locales, as the spike was (no `headers()`/`cookies()` in the page — only the server actions read the request, at submit time); `up` is printed. A build error is fixed in the source, committed after the verify line, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, pixel run 1, the launch anchor check**

```bash
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
npm run pixel -- --page=hire --locale=tr --base=http://localhost:3000 --widths=390,900,1440
npm run pixel -- --page=hire --locale=en --base=http://localhost:3000 --widths=390,900,1440
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/hire-gate-launch.log" 2>&1 || true
grep -n 'missing id="request-form"' "$TMPDIR/hire-gate-launch.log" || echo 'no missing #request-form anchor'
```
Expected:
- **Gate** (localhost wears the production face → `lighthouserc.local.json`, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/hire.spec.ts` 24 passed + 2 skipped (the language-switch and sticky-bar cases skip on `mobile` by design), and `routing`, `seo`, `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on `/isci-talebi` and `/en/hire-workers` under both projects; `region` clean at 390/1000/1440), `width-sweep` (no horizontal overflow at 1440…390 incl. 1101/1100 and 901/900), `chrome` (the header CTA → `/isci-talebi#request-form`), `headers`, `thank-you` all green; the two token cases of `ops.spec.ts` skip without `REVALIDATE_SECRET` (as at WP2a). `lhci assert` passes on every indexable gate route; on `/isci-talebi` and `/en/hire-workers` (median of 3 DevTools-throttled runs): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms, CLS ≤ 0.1.
- **js-size** (W136 — the ledger's figure): both hire routes' LOCAL figures below the stop-and-report trigger **191,724 B** (W162: the controller's binding preview line is 194,560 B, and the preview's `npm run js-size` runs ≈ 2,836 B above this local build, 176,132 → 178,968 B at 02ace58). Projection ≈ 183–190 KB (local): the WP2a close measured these routes at 176,132 B / 172,783 B as spikes; this page adds the forms kernel's client graph (`FormShell`, `Field`, `FallbackPanel`, `Turnstile` loader, `guardAction` — shared with T1's homepage form), `StickyCtaBar`, `PausableMarquee` and `SectorPrefillLink`; `Accordion` already ships on every route through the footer. The LCP column should read the h1 at ≈ 1.5–2.0 s. **Stop rule:** a LOCAL figure ≥ 191,724 B on either route → finish Steps 4–5 (the server killed, the ledger row committed with its `LazyStickyBar:` cell reading `pending`), then STOP: report both figures and the route's client-manifest breakdown to the controller, and run Cycle 8(b) only on the controller's go-ahead, before T3 starts (W13 amended, W162).
- **Pixel run 1** (W138/W159 — like for like, document-scroll-height check; `.pixel/report.json` keys `hire-tr`, `hire-en`): three match percentages per locale (the spike scored 82.15 / 84.04 / 85.03 % at 390 / 900 / 1440). There is no numeric pass mark: read the diff PNGs and file every visible delta as (a) a named D20 delta, (b) a design delta this task names (deltas 1–15, the brief deviation), (c) capture noise (marquee position, fixed bottom bar/FAB, height differences from the hidden logo band), or (d) a defect. Any (d) → Cycle 8(a).
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (unbuilt routes, other pages' anchors), but the grep prints `no missing #request-form anchor` — the anchor half's lines (`DEFAULT_CTAS.primary (/hire-workers#request-form): <locale> <path> → missing id="request-form" …`, `scripts/launch/dead-targets.ts`) no longer name `/isci-talebi` or `/en/hire-workers`.

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID).

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T2 row to the `## Ledger` table in T1's row format (W98), filled from this session:
- route: `/isci-talebi` · `/en/hire-workers`
- js-size (localhost, W136): `/isci-talebi` <n> B · `/en/hire-workers` <n> B (ceiling 204,800; local trigger 191,724, W162; binding preview line 194,560; LazyStickyBar: <no/pending>; binding preview: <added by the controller>)
- Lighthouse (mobile, DevTools throttling, median of 3, localhost — W145): perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (the h1) · CLS <n>, per route
- pixel (run 1 of 2 or 2 of 2): `pixel hire tr: 390 → NN.NN %, 900 → NN.NN %, 1440 → NN.NN %; run N of 2; deltas: (a) …; (b) …; (c) …; (d) accepted: …` and the same line for `en`
- named deltas: the list at the top of this task (1–15) + the brief deviation (ProcessSteps `cards`)
- WP-C sheet: `hire.142` "+" after the `13` metric; `hire.201`/`203`/`215` "continues on WhatsApp"; unused `hire.059`–`062`, `064`/`065`, `216`–`218`; FAQ `hire.032` "Bizi arayın"/"Call us" (package first person, W154 note)
- open follow-ups: `/work-permit` and `/hiring-cost-calculator` cross-links 404 until T4/T3 (prefetch off); the binding preview gate is the controller's run on the pushed branch (W137 `--settings.extraHeaders`)
- launch anchor sweep: `#request-form` present in both locales (W152/W158)

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(hire): T2 ledger row — gate, js-size, Lighthouse medians, pixel run 1, launch anchor sweep

Localhost proof session (W126/W145): one build, one gate, both hire routes under the
191,724 B local lazy trigger (W162); #request-form present for DEFAULT_CTAS in both locales (W152/W158).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 8 — conditional: pixel run 2 (D27) and/or the lazy pass (W13 amended)

Run this cycle only if Cycle 7 found (d) pixel defects (step (a) below) or a hire route's LOCAL `js-size` at or above **191,724 B** (step (b); W162: the local trigger — the preview's figure runs ≈ 2,836 B higher and the controller decides at 194,560 B there) — for (b) AND the controller, told of the crossing by Cycle 7's stop-and-report, has said to run it; otherwise the task ends with Cycle 7 ("run 1 of 2" stands in the ledger, `LazyStickyBar: no`). It is the task's only second build (W164). The lazy candidate is the sticky bar: it renders nothing until the visitor has scrolled 700 px, so `null` is its DOM-identical fallback (W132). Its observer uses the top-extended margin `'100000px 0px 200px 0px'` (W165, T3's pattern): the jump nav's section links, a reload at a hash and scroll restoration can jump past the wrapper, and the bar must load whenever the visitor is at or below the marker. The request form stays SSR'd and eager (W163).

- [ ] **Step 1: Write the failing test**

(a) Pixel defects: where a fix is structural (an element, an order, a class that hides or shows), pin it first with a failing assertion in `_sections/__tests__/sections.test.tsx` or `forms.test.tsx` (same helpers: `tokens(el)`, the real bundle); a pure spacing/size tweak needs no new test.

(b) Lazy pass (only if a hire route's LOCAL js-size is ≥ 191,724 B and the controller said to run it — W162) — `src/app/[locale]/(site)/hire-workers/_components/__tests__/LazyStickyBar.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LazyStickyBar } from '../LazyStickyBar';

/** jsdom has no IntersectionObserver: this one only records the `rootMargin` it was built with
 *  and never reports an intersection, so the bar stays at its null fallback. */
const rootMargins: Array<string | undefined> = [];
class RecordingObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  constructor(...args: ConstructorParameters<typeof IntersectionObserver>) {
    rootMargins.push(args[1]?.rootMargin);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  rootMargins.length = 0;
});

describe('LazyStickyBar', () => {
  it('renders the DOM-identical fallback (nothing) until its wrapper nears the viewport (W132)', () => {
    const { container } = render(
      <LazyStickyBar
        message="m"
        ctas={[{ label: 'x', href: '#request-form' }]}
        hideNearId="request-form"
        live
      />,
    );
    expect(container.firstElementChild?.tagName).toBe('DIV'); // LazyIsland's wrapper
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  it('reaches the bar only through the dynamic import (no static runtime edge)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/hire-workers/_components/LazyStickyBar.tsx'),
      'utf8',
    );
    expect(src).not.toMatch(
      /^import \{[^}]*StickyCtaBar[^}]*\} from '@\/design\/chrome\/StickyCtaBar'/m,
    );
    expect(src).toContain("import('@/design/chrome/StickyCtaBar')");
  });

  it('observes with the top-extended margin, so a jump past the wrapper still loads the bar (W165)', () => {
    vi.stubGlobal('IntersectionObserver', RecordingObserver);
    render(
      <LazyStickyBar
        message="m"
        ctas={[{ label: 'x', href: '#request-form' }]}
        hideNearId="request-form"
        live
      />,
    );
    expect(rootMargins).toEqual(['100000px 0px 200px 0px']);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 hire-workers
```
Expected: the new assertions fail (for (b): `../LazyStickyBar` cannot be resolved; once the wrapper exists without the margin, the margin case reads `['200px']` — `LazyIsland`'s default).

- [ ] **Step 3: Implement**

(a) Fix each (d) item in the section that owns it — markup/classes only, never a foundation prop or a caller colour class (W122), every new class string W119/W155-clean.

(b) `src/app/[locale]/(site)/hire-workers/_components/LazyStickyBar.tsx`:

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

/** The margin reaches 100,000 px ABOVE the viewport (W165, T3's pattern): the jump nav's section
 *  links, a reload at a hash and scroll restoration can all jump past the wrapper, so it never
 *  crosses the viewport and a plain 200 px margin would then never load the bar. With the top
 *  margin "at or below this point" is what counts. */
const STICKY_MARGIN = '100000px 0px 200px 0px';

/** W13 amended lazy pass: the bar renders `null` until the visitor has scrolled past
 *  `showAfterPx`, so `null` is its DOM-identical fallback (W132 — `{ load, props, fallback,
 *  rootMargin? }`, no `ssr`). The page mounts this right after the jump nav, so the module
 *  leaves the route's first-load graph and loads once the visitor is at or below the wrapper,
 *  well before the 700 px threshold is reached. A server page cannot pass `load` (a function)
 *  to a client component, hence this one-line client wrapper. */
export function LazyStickyBar(props: Props) {
  // The explicit <Props>: inferring P through `.then` on a named export widens to `never`.
  return (
    <LazyIsland<Props>
      load={() =>
        import('@/design/chrome/StickyCtaBar').then((m) => ({ default: m.StickyCtaBar }))
      }
      props={props}
      fallback={null}
      rootMargin={STICKY_MARGIN}
    />
  );
}
```

and in `page.tsx` replace the import `import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';` with `import type { StickyCta } from '@/design/chrome/StickyCtaBar';` + `import { LazyStickyBar } from './_components/LazyStickyBar';`, and the JSX element `<StickyCtaBar … />` with `<LazyStickyBar … />` (same props, same position — directly after `<JumpNav … />`).

- [ ] **Step 4: Verify, then the re-proof session**

```bash
npx prettier --write "src/app/[locale]/(site)/hire-workers"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add "src/app/[locale]/(site)/hire-workers"
git commit -m "fix(hire): pixel run 1 defects / lazy sticky bar — <one line each>

<(a): the (d) items fixed; (b): StickyCtaBar behind LazyIsland under the 191,724 B local trigger, top-extended rootMargin (W13 amended, W132, W162, W165)>

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
rm -rf .next .lighthouseci-extra .pixel
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/hire-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/isci-talebi && echo up
E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/hire.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts
E2E_BASE_URL=http://localhost:3000 npm run js-size -- --routes=/isci-talebi,/en/hire-workers
npm run pixel -- --page=hire --locale=tr --base=http://localhost:3000 --widths=390,900,1440
npm run pixel -- --page=hire --locale=en --base=http://localhost:3000 --widths=390,900,1440
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: the three specs green (the scoped re-run of the page contract, axe and the width sweep on the changed markup — the full gate already ran once, W126); both routes below 191,724 B on the local build in the W94 spot-check (W162; the sticky-bar case still passes — the wrapper sits after the jump nav and the top-extended margin (W165) loads the bar whenever the viewport is at or below it; if the lazy pass still leaves a route at or above 191,724 B, stop and report the route's client-manifest breakdown to the controller — no further change without a ruling; the binding preview decides at 194,560 B); pixel run 2 of 2 is the ledger's number, and any remaining (d) item is listed "accepted" with a one-line reason (a third run needs a controller ruling); `no stray processes`.

- [ ] **Step 5: Commit**

Update the T2 row of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (run 2 of 2, the re-measured js-size, `LazyStickyBar: yes` if (b) ran), then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(hire): T2 ledger — pixel run 2 of 2<, lazy sticky bar>

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` — the Hire Workers bullet in the per-page `sys.*` list under `### Adding copy (W9, W23, W54)` (Cycle 1, with the keys). `docs/SEO.md` — the Hire Workers row of T1's per-page table, naming the LCP element (the h1 while `hw-hero` is a placeholder) (Cycle 6). `docs/ANALYTICS.md` — the Hire Workers bullet under `### Page instrumentation (WP2b)` (Cycle 6; no new event or parameter). `docs/PRD.md` — §2 row 2's last cell and, in the §11 "Not yet built" sentence, T1's clause "Hire Workers is still the spike placeholder until T2" → "Hire Workers is the second — WP2b T2", edited in place (Cycle 6, W45). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T2 `## Ledger` row (Cycle 7, updated in Cycle 8 if it runs). No `docs/ARCHITECTURE.md` or `docs/INTEGRATIONS.md` change: the forms flow and the I4 `hire` contract are unchanged (T14 records the instance map; the `city` field is WP2a Task 8's).

**Sys keys added:** 5 keys, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `_lib/__tests__/sys-keys.test.ts`:
- `sys.hire.whatsapp` — TR "WhatsApp" · EN "WhatsApp"
- `sys.hire.jump.label` — TR "Sayfa içi bölümler" · EN "On this page"
- `sys.hire.sc.titleTail` — TR " belgeli işçiler" · EN "" (empty on purpose; read with `sys.raw`)
- `sys.hire.sc.mapTitle` — TR "Kaynak ülkeler haritası — JobsAdmire'ın Türkiye'deki işverenler için işçi temin ettiği ülkeler" · EN "Source countries map — the countries JobsAdmire sources workers from for employers in Türkiye"
- `sys.hire.form.dial` — TR "Ülke kodu" · EN "Country code"

No `sys.seo.hire.*` (the page record carries `hire.264`/`hire.265`); no `sys.hire.sc.turkiye` (the map's Türkiye label is the `countries` collection's `TR` row). Consumed, not added: `sys.form.options.startWhen.*`, `sys.form.labels.message`, `sys.form.consent.label`, `sys.form.placeholders.*`, `sys.form.hints.optional`, `sys.form.fallback.*`, `sys.marquee.{pause,play}`, `sys.nav.breadcrumbs`.

**Package ids used:** 235 of the page's 302, all present in `src/content/local/catalogue.json` (verified: 302/302 `hire.*` ids exist) — first `hire.002`, last `hire.302`: `hire.002`, `hire.020`–`044`, `hire.047`–`058` (field labels, W115), `hire.063`, `hire.066`–`075` (`073` renders only once consented logos exist), `hire.076`–`082` (sector labels through the `sectors` collection's `labelId`; `082` "Other" only as a request-form option), `hire.083`–`088` (subtitles via `subtitleId`), `hire.089`–`139`, `hire.140`–`145`, `hire.146`–`169`, `hire.170`–`193`, `hire.194`–`198`, `hire.199`–`215`, `hire.219`–`222`, `hire.240` (through `StoreBadges`), `hire.243`, `hire.244`, `hire.249`–`253`, `hire.264`–`265` (metadata), `hire.271`–`302`. Not rendered (67): `hire.001`, `hire.003`–`019`, `hire.223`–`239`, `hire.245`–`248` (chrome — the layout renders the canonical `home.*` ids, R15; `245` is the hidden logo-slot caption); `hire.045`/`046` (inline success panel — D13); `hire.059`–`062` (the shared W78 labels replace them); `hire.064`/`065`/`217`/`218` (KVKK lines — W79, WP-C sheet); `hire.216` (WhatsApp submit wording — D13); `hire.241` (App Store badge — `ios` is `null`, W8); `hire.242` (the hero placeholder's caption — the slot is decorative, `alt=""`); `hire.254`–`263` (the mock's `sendByEmail` body labels — W95); `hire.266`–`270` (OG/schema strings — the OG route reads the page record; no Service node, §3.1).

**CLIENT_SYS additions:** none — no client module reads `sys.hire` (the page resolves every string on the server and passes it as a prop; `SectorPrefillLink` reads no copy), so `src/i18n/client-messages.ts` stays `consent, languageHint, errorTitle, errorRetry, form` and `client-messages.test.ts` needs no change (W148).

**Foundation gaps:** none — every name this task consumes exists at `7bacd7e` and was checked in the code (not only in `A/produces-final.md`). The `city` wire name on `hire` is WP2a Task 8's catalog v1.1 field (`city?: string` ≤ 120), CONFIRMED by `A/produces-final.md` § "Task 8 — as built" (Operations `main` 47a2160, live since 2026-09-28): it rides inside `fields` as a string and the door stores it as its own line of the inquiry; the gate is door-less (W92) either way. Every field this task sends (`name, company, email, phone, city, sector, roleNeeded, headcount, startWhen, message`) is in the catalog v1.0 + v1.1; the page-local `dial` select never reaches the wire. Accepted page-local items (no foundation change): `ProcessSteps variant="cards"` instead of a horizontal timeline; `FaqBlock` shows the ask card's call row at every width (the design hides it ≤ 700 px); `FormShell`'s single `primary` submit face and consent-row position; `Field as="select"` ignoring `placeholder` (W111); the conditional `LazyStickyBar` wrapper (a server page cannot pass `LazyIsland`'s `load` function, so a one-line client wrapper is the pattern; it passes W165's top-extended `rootMargin`).

**Ledger line** (T1's row format, W98 — the six columns `Task | Routes (tr · en) | JS (npm run js-size, W136) | Lighthouse (median of 3, W145) | Pixel (D27) / named deltas | Date`; the launch sweep, WP-C and follow-up notes ride in the pixel/deltas cell; fill from Cycle 7/8):

```markdown
| T2 Hire Workers | `/isci-talebi` · `/en/hire-workers` | js-size (W136, localhost): `/isci-talebi` <n> B · `/en/hire-workers` <n> B — ceiling 204,800 · local trigger 191,724 (W162) · binding preview line 194,560 · LazyStickyBar: <no/pending/yes — top-extended rootMargin, W165> · binding preview: <added by the controller> | LH mobile, DevTools throttling, median of 3 (W145): perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n> (both routes) | pixel hire tr: 390 → <NN.NN> %, 900 → <NN.NN> %, 1440 → <NN.NN> %; en: 390 → <NN.NN> %, 900 → <NN.NN> %, 1440 → <NN.NN> %; run <N> of 2; deltas: (a) <…>; (b) deltas 1–15 + ProcessSteps cards; (c) <…>; (d) accepted: <… or none>; launch sweep: #request-form present tr+en (W152/W158); WP-C: hire.142 "+", hire.201/203/215, unused hire.059–062/064/065/216–218; follow-ups: /work-permit + /hiring-cost-calculator cross-links 404 until T4/T3; binding preview gate = controller run | <date> |
```
