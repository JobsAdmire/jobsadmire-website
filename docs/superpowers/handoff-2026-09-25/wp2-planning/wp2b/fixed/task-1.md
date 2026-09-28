### Task 1: Homepage (`/` and `/en`) — the first designed page on the WP2a foundation (D27 pixel-harness page)

**Where this runs.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` (HEAD ≥ `7bacd7e`; never the shared `jobsadmire-website` checkout, never `main`, never push). Every command block below starts with `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 &&`. **Execution order (W99):** this task runs FIRST in WP2b (then T13 → T2 → …). **Memory rule (owner):** one heavy job at a time; the per-cycle check is the low-memory verify line `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1` (never `npm run verify` / `npm run test` / `npm run e2e`); the task ends with ONE build + ONE `npm run start` + ONE `npm run gate` (Cycle 7, W126). Never `git stash`; never rewrite a commit (W118).

**What it builds.** The WP1 spike at `src/app/[locale]/(site)/page.tsx` (a tagged `<h1 data-testid="page-h1" data-lcp-slot="h1">Ana sayfa|Home</h1>` plus a `<Link href="/hire-workers">hire</Link>`, metadata `fallbackTitle: 'JobsAdmire'`) is replaced by the designed page `design-package/design/JobsAdmire Homepage v4.dc.html`, section for section: cinematic hero (badge, three-line h1, sub, CTAs, full-bleed photo slot, the `#proposal` lead card, metric strip), live-case bar (data-gated), phone-only choice cards, the candidate pool slot (designed empty state), the calculator teaser (shared engine, lazy island), the process timeline, the season planner (lazy island), the agent-network map split, our-team (data-gated), portal + app, work with us, guides (blog-gated), FAQ, and the closing contact band. Every visible string is a package id read through `makeTf(bundle, locale)` (D17 `{metric}` placeholders filled) or a `sys.home.*` / `sys.seo.home.*` key read through next-intl (W9/W23); every number comes from the `metrics` / `rateConfig` / `calculatorRoles` / `sourceCountries` collections through the WP2a data layer and the calculator engine (W1/W2/D17/D18). Page-private modules live in the App Router private folder `src/app/[locale]/(site)/_home/` (the homepage's route folder is the `(site)` group itself, which every other page shares).

**Design deltas this task makes on purpose (record them in the pixel ledger, D20/D27):**
1. The hero card gains the door's required contact `name` and `email` (W3), keeps `city` (W16, catalog v1.1) and gains the site-wide consent **checkbox** linking `/privacy` (W79 — the design card has no consent line); every input gets a visible label — the package's own `home.032`–`043` (W115; `email` falls back to `sys.form.labels.email`) — with the kernel's example placeholders instead of the design's placeholder-only inputs; the submit is the kernel's `lg` button.
2. Both selects post stable keys — `sector` ∈ `factory | agriculture | tourism | construction | other` (a subset of `SECTOR_KEYS`) and `startWhen` ∈ the shared `START_WHEN_KEYS` `asap | month1 | months1to3 | planning` (W77/W78) — while the visible option labels stay the package's (`home.036`–`040`, `home.044`–`047`, W115).
3. "Ask us to call you" is a separate `callback` form (`name*`, `phone*`, the sector select posted as `topic`, `city`) instead of the design's same-fields toggle (W3); like the design it is reachable only at ≤ 460 px, where the card collapses behind the two mode buttons; opening a mode moves focus to the form's first field (the buttons disappear, D20).
4. The live case ticker, the hero "All cases are public →" proof cell, the candidate cards and the whole "Our team" section render nothing in Phase A: `stories`, `pool` and `representatives` are empty and fixture-only (D23) and the one `founder` row is unpublished (W86, §10 row 3); the pool slot shows a designed empty state (W6) under the neutral eyebrow `home.003` ("Candidates") instead of the design's live-pool claims (`home.062`–`067`).
5. The calculator teaser's General figure is the model's **₺40,214** with the minimum-wage support **off** (W58/W142(b)): the support row renders `home.082` verbatim beside `sys.home.calc.supportSeparate` ("Not included — shown on the full calculator") instead of the design's "−₺1,270"; `home.074` and `home.299` (legal-flagged, ₺38,944 = support applied) render verbatim and stay on the WP-C legal sheet (`COPY_DELTAS`).
6. The teaser's "Send this estimate on WhatsApp" anchor carries only `https://wa.me/<number>`; the prefilled estimate is composed at click time (W95/W76). The chips are native radios in a `fieldset` (page-local `TeaserChips`, accepted in the reconcile rulings) instead of the design's plain buttons.
7. The FAQ is the shared `FaqBlock` below the page's own eyebrow + h2 (no side column), `singleOpen={false}` keeping the design's independent toggles; its accordion face is the block's.
8. The process timeline is the shared `ProcessSteps` (`variant="plain"`): numbered gradient dots and `when` pills instead of the design's check dots and left-hand label column.
9. The full-bleed hero slot `v4-hero` is a named gradient placeholder until §10 row 4 ships, so the LCP element is the h1 (D26); the slot keeps its 16:9 box (W129 — `ImageSlot` owns its box), so at phone widths the hero below the slot is the plain `#0a1428` ground under the design's two overlays.
10. No App Store badge (W8) and the portal panel's platform line reads "Android" (`sys.home.portal.platforms`); the portal screens are the named placeholders `portal-shortlist` / `portal-mobile-app` (W55); the mock status/shortlist labels (`home.215`/`216`) are an `aria-hidden` illustration.
11. "Report fraud" is a link to the Verify page's fraud form (`/verify#report`, the anchor `CTA_BY_PATHNAME['/verify']` names) instead of a WhatsApp prefill; the partner "Talk to us" WhatsApp prefill is written in the visitor's voice (`sys.home.whatsapp.partner`).
12. The closing band is the shared `ClosingCtaBand` (`tone="navy"`): all four CTAs stay visible at ≤ 460 px (the design keeps two) and Telegram/call wear the band's `inverse` face.
13. No `StickyCtaBar` (the brief lists one; the design has none): the header is sticky and already carries this page's `#proposal` CTA (`CTA_BY_PATHNAME['/']`, W17); the bar's `hideNearId` cannot point at `#proposal` (`isBarVisible` hides the bar for good once its target scrolls above the viewport); and the route is projected ≈ 3–6 KB under the lazy line — a duplicate CTA is not worth ≈ 1.3 KB gz. Re-adding it is a two-line change once the owner wants it.
14. No client-logo marquee: the homepage design has none (`LogoMarquee` is mounted by Hire Workers / Partner).
15. Colour and type follow D19/D20: CTA faces are `blue-safe`/`nav`/`inverse`/`success` variants (never caller colour classes, W122/W127), small grey text on pale surfaces is `text-text-secondary` (the design's `#94a3b8`/`#64748b` there miss 4.5:1), desktop lengths are the package's × 0.75.

**Files:**

Create (all under `src/app/[locale]/(site)/_home/` unless the path says otherwise)
- `actions.ts` — `'use server'`: `submitHire`, `submitCallback` (thin wrappers around `createFormAction`)
- `lib/assets.ts` — `HERO_PHOTO` (the §10 row 4 switch, `null`)
- `lib/phase-a.ts` — `rawRows`, `hasRows`, `publishedFounder` (the render-by-data switches, W6/W86)
- `lib/forms.ts` — option keys + label ids, `hireSchema`/`hireToFields`/`hireSpec`, `callbackSchema`/`callbackToFields`/`callbackSpec`
- `lib/teaser-keys.ts` — the client-safe teaser shapes: `TeaserView`, `HEADCOUNT_PRESETS`, `DEFAULT_HEADCOUNT`, `stateKey`
- `lib/teaser.ts` — `teaserView`, `teaserViews` (server-side, over the engine)
- `lib/season.ts` — `SEASON_ROWS`, `monthNames`, `signByMonth`, `nowMarkerLeft`, `seasonRange`, `seasonHeadline`
- `lib/guides.ts` — `guidesPosts`
- `lib/__tests__/phase-a.test.ts`, `lib/__tests__/forms.test.ts`, `lib/__tests__/teaser.test.ts`, `lib/__tests__/season.test.ts`, `lib/__tests__/guides.test.ts`
- `__tests__/fixtures.ts` — `homeBundle(locale)`, `withCollections(bundle, rows)` (test helper, not a test)
- `__tests__/home-copy.test.ts` — the `sys.home.*` key set, the D17 rate-copy guards, W150
- `components/LiveDot.tsx`, `components/icons.tsx` (no directive)
- `components/HeroLeadForm.tsx` (`'use client'`, eager — above the fold)
- `components/WhatsAppComposeLink.tsx` (`'use client'`, W95)
- `components/TeaserChips.tsx`, `components/TeaserCard.tsx`, `components/TeaserLayout.tsx` (no directive — shared by the server fallback and the island)
- `components/CalculatorTeaser.tsx` (`'use client'` island) + `components/CalculatorTeaserIsland.tsx` (`'use client'` `LazyIsland` binder)
- `components/SeasonGrid.tsx` (no directive) + `components/SeasonPlanner.tsx` (`'use client'` island) + `components/SeasonPlannerIsland.tsx` (`'use client'` binder)
- `components/__tests__/HeroLeadForm.test.tsx`, `components/__tests__/WhatsAppComposeLink.test.tsx`, `components/__tests__/CalculatorTeaser.test.tsx`, `components/__tests__/SeasonPlanner.test.tsx`
- `sections/types.ts`, `sections/styles.ts`
- `sections/Hero.tsx`, `sections/HeroForm.tsx`, `sections/LiveCaseBar.tsx`, `sections/ChoiceCards.tsx`, `sections/PoolSection.tsx`, `sections/CalculatorStrip.tsx`, `sections/ProcessSection.tsx`, `sections/SeasonSection.tsx`, `sections/NetworkSection.tsx`, `sections/TeamSection.tsx`, `sections/PortalSection.tsx`, `sections/WorkWithUs.tsx`, `sections/GuidesSection.tsx`, `sections/FaqSection.tsx`, `sections/ContactStrip.tsx`
- `sections/__tests__/top.test.tsx`, `sections/__tests__/hero-form.test.tsx`, `sections/__tests__/calculator.test.tsx`, `sections/__tests__/process-season.test.tsx`, `sections/__tests__/lower.test.tsx`
- `e2e/pages/home.spec.ts` (repo root `e2e/`; the `pages/` folder is new)

Modify
- `src/app/[locale]/(site)/page.tsx` — whole file (the WP1 spike body and its `fallbackTitle: 'JobsAdmire'` / `home.188` metadata are replaced)
- `src/messages/tr.json`, `src/messages/en.json` — add `sys.seo.home` (inside the existing `seo` object) and the `sys.home` object (last member of `sys`, after `form`); identical key sets
- `docs/CONTENT-MODEL.md` — creates the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` (W98) with the Homepage bullet
- `docs/SEO.md` — creates the one `## Pages` table (W98 columns) before `## Redirects policy (summary)`, Homepage row
- `docs/ARCHITECTURE.md` — § Routing: one new paragraph (page-private folders); § Design system: the sentence "**WP1 ships two real pages** …" rewritten
- `docs/PRD.md` — §2: the `Homepage` row's "Forms carried" cell; §11: the "only the homepage and Hire Workers exist, both still spike-era placeholder content" parenthesis
- `docs/ANALYTICS.md` — creates `### Page instrumentation (WP2b)` (W98) before `## Conversion`, Homepage bullet
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — creates the `## Ledger` table (W98, T1's row format) and fills the T1 row

Verify only (no edit)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE` already carries `{ path: '/', indexable: true }` and `{ path: '/en', indexable: true }` (W21); never duplicate them
- `src/lib/seo/routes.ts` — `'/'` is not in `UNBUILT_PATHNAMES` (it never was); `src/lib/seo/unbuilt.test.ts` stays green because the page file keeps its path
- `src/design/chrome/ctas.ts` — `CTA_BY_PATHNAME['/']` = `{ primary: { labelId: 'home.014', tailId: 'home.015', href: { pathname: '/', hash: '#proposal' } } }`; this page renders `id="proposal"` (W17/W152/W158); no edit (W121)
- `src/i18n/client-messages.ts` — `CLIENT_SYS` unchanged: no client module of this task reads `sys.*` (W148)

Test
- Vitest: the 14 test files above (Cycles 1–5), under the low-memory verify line
- Playwright (Cycle 7, against `next start`): `e2e/pages/home.spec.ts` (new) plus the existing `routing`, `seo`, `a11y` (incl. the `region` sweep), `width-sweep`, `chrome`, `headers`, `smoke`, `thank-you`, `ops`, `redirects` specs, which already cover `/` and `/en`
- `npm run gate` (Lighthouse on the four indexable gate routes), `npm run js-size`, `npm run pixel -- --page=home` (tr, en; 390/900/1440; two-iteration cap)

**Interfaces:**

Consumes (exact names, read in the code at `7bacd7e`)
- Data layer: `getBundle` (`@/content/adapter`, page.tsx only); `makeTf`, `metricValues` (`@/content/pure` — sections import the pure module so the tests render them); `getCollection`, `blogNavVisible`, `type BlogPost`, `type CalculatorRole`, `type RateConfig`, `type Founder`, `type SectorKey` (`@/content/collections`); `bundle.pages.home` = `{ titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['organization','website','faq'] }`; `founder` = one row `{ name: 'Kurucunun Adı', titleId: 'about.047', photoSrc: null, published: false }`; `blog` = 22 rows, 0 with `hasBody.tr` (`blogNavVisible` → false); `stories`/`pool`/`representatives` absent (FIXTURE_ONLY, `src/content/config.ts`).
- SEO: `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` (`@/lib/seo/metadata`; `''` titleId → the fallback, W38; OG image `/og/{locale}/home.png`, whose title then reads `sys.seo.home.title`).
- Forms kernel: `createFormAction(spec)`, `type FormSpec` (`@/forms/action`; `consent` default `'checkbox'`; `toFields(parsed, data, ctx)` — two-argument mappers type-check); `type FormActionState` (`@/forms/types`); `type WireFields` (`@/forms/wire`); `START_WHEN_KEYS`, `type StartWhenKey` (`@/forms/options`); `FormShell` (`@/forms/client/FormShell` — `action, formKey, locale, turnstileSiteKey, whatsappNumber, contact?, submitLabel?, consent? ('checkbox' default), consentLinkHref? ('/privacy' only — omitted), testId?, idScope?, headingLevel?`; renders `data-form-key`, the honeypot, the consent row, the `lg` submit and, on `error`, `FallbackPanel` with `data-testid="form-fallback"` + `data-kind`, a bare `https://wa.me/<number>` href and a click-time `window.open(url, '_blank', 'noopener')`); `Field`, `type FieldOption` (`@/forms/client/Field` — `label` wins over `sys.form.labels.<name>`, `hint=""` suppresses the hint line, `className` lands on the control, the select branch ignores `placeholder` and prepends `sys.form.placeholders.select`). Door-less (no `OPS_API_URL` / write token) → `postForm` answers `{ kind: 'unauthorized' }` without a call.
- Analytics: `ContactLink` (`@/analytics/ContactLink`, props `Omit<AnchorHTMLAttributes, 'href'|'onClick'|'onAuxClick'> & { href, placement, children }`); `useContactClick(placement) → (kind) => void` (`@/analytics/useContactClick`, client modules only, W125); `track(event, params)` (`@/analytics/track`; `calculator_use` params `page, locale, role, headcount`).
- Blocks by module path (W156): `ImageSlot` (`slot, lcp?, src?, alt, width, height, sizes?, className?, priority?` — owns its box, W129), `MetricStrip` (`bundle, locale, metrics, tone?`), `EmptyState` (`title, body?, cta?, tone?, headingLevel?, testId?, className?`), `ProcessSteps` + `type ProcessStep` (`variant: 'plain'`, `headingLevel?: 3 | 4`), `FaqBlock` + `type FaqItem` (`items, singleOpen?, headingLevel?, footer?`; id `faq`; emits the FAQPage node), `ClosingCtaBand` (`titleId, bodyId?, primary, secondary?, extra?, tone?`), `ContactCta` (`placement, href, variant?, size?, external?, children`), `PostCard` (`post, variant?, headingLevel?`), `StoreBadges` (`android, ios?, tone?`) — each `@/design/blocks/<Name>`.
- Primitives by path: `Button`, `buttonClassName` (`@/design/primitives/Button`; variants `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`), `Section` (`@/design/primitives/Section`; tones `light|dark|pale|band`, `py-16`/`py-10`, no display or border classes of its own), `Eyebrow` (`@/design/primitives/Eyebrow`).
- Island by path: `LazyIsland` (`@/design/islands/LazyIsland` — `{ load, props, fallback, rootMargin? }`, default `'200px'`, no `ssr`, loads once and stays mounted, a rejected `load()` keeps the fallback, W132).
- Assets: `SourceMap`, `sourceMapLabels` (`@/design/assets/source-map`; `title, labels, turkiyeLabel, id?, className?`); `Flag` (`@/design/Flag`, `code, size?`); `isFlagCode` (`@/design/assets/flag-codes`); `CheckIcon`, `ClockIcon`, `PhoneIcon`, `TelegramIcon` (`@/design/chrome/icons`, `size?, className?`).
- Engine (`@/lib/calculator` barrel — pure TS, allowed): `estimate`, `formatEstimate`, `multiplierLabel`, `presets`, `isReviewDue`; tests also `effectiveYear`, `sgkRateLabel`; fixtures `RATE`, `ROLES`, `role` (`@/lib/calculator/__tests__/fixtures`, tests only); `COPY_DELTAS` (`@/lib/calculator/copy-deltas`, authoring data — imported by this task's TEST files only, never by a module under `src/`, W143/M18).
- Formatting: `formatTRY` (`@/lib/format/money`, tests); `waLink`, `telLink` (`@/lib/contact`).
- Routing: `routing`, `type Locale` (`@/i18n/routing`); `Link` (`@/i18n/navigation`, object hrefs `{ pathname, hash }`).
- Test helpers: `renderWithIntl` (`@/test/render`, full `tr`/`en` messages), `testBundle` (`@/test/bundle`), `BundleSchema`/`type Bundle` (`contract/website-bundle.v1`).
- Gate: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), `npm run gate` (Playwright both projects — `mobile` = Pixel 7, 412 px, i.e. the ≤ 460 layout; `desktop` = 1440 — then Lighthouse `lighthouserc.local.json`, DevTools throttling, median of 3, W145), `npm run js-size` (W136), `npm run pixel -- --page=home --locale=tr|en --widths=390,900,1440` (W138/W159).
- Operations catalog v1.0 + v1.1 (the four v1.1 fields as `A/produces-final.md` § Task 8 spells them): `hire` = `name*` ≤ 120, `company*` ≤ 200, `email*` ≤ 254, `phone*` ≤ 40 (≥ 8 digits), `sector` ≤ 120, `headcount` ≤ 10, `startWhen` ≤ 120, `city` ≤ 120 (v1.1); `callback` = `name*`, `phone*`, `email`, `preferredTime` ≤ 120, `topic` ≤ 200 (free text), `city` ≤ 120 (v1.1). This task sends `hire`: company, name, email, phone, headcount, sector, city, startWhen; `callback`: name, phone, topic, city.

Produces (what later tasks rely on)
- **The shared doc shapes (W98)** — later tasks append, never create a second: `docs/SEO.md` `## Pages` table with the columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`; `docs/ANALYTICS.md` `### Page instrumentation (WP2b)` (one bullet per page); `docs/CONTENT-MODEL.md` the per-page bullet list at the end of `### Adding copy (W9, W23, W54)`; the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md` whose first data row starts `| T1 Homepage |` (T9 greps it) and whose row format T2–T15 copy; the PRD §11 clause "Hire Workers is still the spike placeholder until T2" (T2 rewrites exactly that clause).
- `sys.home.*` as the homepage's object (W80; the Home crumb stays `sys.nav.home`).
- `id="proposal"` on `/` and `/en` (the `CTA_BY_PATHNAME['/']` anchor the launch sweep checks, W152/W158).
- Reusable page-local modules (plain imports across page folders are allowed; nothing depends on them): `WhatsAppComposeLink({ number, text, className?, children })` (`_home/components/WhatsAppComposeLink.tsx` — the W95 click-time composer, fires `whatsapp_click` with `placement: 'page_cta'`); `hasRows`/`publishedFounder` (`_home/lib/phase-a.ts`); the lazy-island pattern (a server fallback built from directive-less components + a `'use client'` binder that owns the `load` thunk).

**Rulings applied:**
- **W1** — hero stats through `MetricStrip` (`placed`, `countries`, `permitDays`); the network count and the season "no peak" days through `metricValues`; `{homepageReplyHours}`/`{countries}` package placeholders through `makeTf`.
- **W2 / W58 / W142 / W143** — one engine: every teaser figure is `estimate(…, supportOptIn: false)` → `formatEstimate`, exact floors (skilled ₺49,545); tests pin the General figure to `COPY_DELTAS` row `home.074 / home.082`'s model (₺40,214) and assert the design's ₺38,944 is not shown; `home.074`/`082`/`299` render verbatim; `sys.home.calc.supportSeparate` states the support is shown separately; sys templates carry no figures (they are filled from the engine).
- **W3 / W16 / W77 / W78 / W115** — hero → `hire` with required `name` + `email`, optional `city`; phone-only call-me-back → `callback`; keys on the wire, `START_WHEN_KEYS`, package labels as `label`.
- **W4** — the guides block renders nothing while `blogNavVisible(bundle)` is false (today: 0 TR bodies).
- **W6 / D2 / D23 / W86** — ticker, proof cell and team render by data (`hasRows`, `publishedFounder`); pool = designed empty state; nothing deleted.
- **W8** — `StoreBadges` with `ios: null` (no App Store badge); platforms line "Android".
- **W9 / W23 / W54 / W80** — 24 new keys under `sys.home.*` + `sys.seo.home.*`, both locales; `sys.nav.home` untouched.
- **W10** — ≤ 460 px hide/show with `max-xs:hidden` / `xs:hidden` classes (the design's 460 breakpoint is `xs` = 461), never conditional rendering; the phone-only mode buttons are the one state-driven exception (the design itself removes them once a mode is open).
- **W12 / W26** — only allow-listed events: `calculator_use` (`role` = preset key, `headcount` ∈ 1|5|15|30), `whatsapp_click`/`call_click` with `placement: 'page_cta'`.
- **W13 amended / W85 / W132 / W134 / W147 / W156** — the teaser and the season planner load through `LazyIsland` (`@/design/islands/LazyIsland`) from `'use client'` binders; the teaser's views are precomputed on the server, so neither the engine nor next-intl ships in its chunk; every primitive, block and island is imported by module path.
- **W14** — the build-time `SourceMap` and the `Flag` sprite; no runtime fetch.
- **W17 / W121 / W152 / W158** — `id="proposal"` on the hero card; `CTA_BY_PATHNAME` untouched.
- **W18** — not exercised: no `StickyCtaBar` on this page (delta 13).
- **W19 / W20 / W21** — `(site)` group; `/` and `/en` are already gate routes and were never unbuilt.
- **W55 / W61 / W129** — every placeholder named (`v4-hero`, `portal-shortlist`, `portal-mobile-app`, `rep-founder`, `blog-cover-<key>`); `ImageSlot` wrapped for size, never given box classes; `sizes` on every fluid slot; exactly one `data-lcp-slot` (the h1).
- **W71** — blocks resolve ids through `makeTf` (the page passes ids to `ClosingCtaBand`/`ProcessSteps`).
- **W74 / W76 / W92** — door-less targets answer `unauthorized`; the e2e asserts the fallback panel's bare href and the click-time prefill.
- **W79** — `consent: 'checkbox'` on both specs; `consentLinkHref` omitted (`/privacy`; it 404s until T13 lands next, W99).
- **W95** — the teaser estimate is composed on click (`WhatsAppComposeLink`); fixed prefills (hire, partner) may sit in hrefs.
- **W98** — T1 creates the four shared doc shapes and the ledger row format.
- **W109** — no breadcrumbs on the root page. **W111** — selects rely on `sys.form.placeholders.select`. **W113** — section test ids on inner `div`s of `Section`.
- **W118 / W126** — no history rewrite; one build + one start + one gate at the end.
- **W119 / W122 / W127 / W128 / W155** — no class string pairs `hidden` with an unprefixed display utility or sets one property twice at one variant; different faces are `Button` variants (`nav`, `inverse`, `success`); page-local anchors use a colourless base + colour classes; `class-collisions.test.ts` stays green.
- **W120 / W136 / W145 / W146** — the ledger records `npm run js-size`; LCP/perf asserted under DevTools throttling (median of 3); GTM stays dark on the gated face.
- **W125** — sections never import `@/analytics/useContactClick`; only the two client components do.
- **W130** — every new `'use client'` module is a client module on its first line; directive-less shared components use no client-only React API.
- **W144** — figures leave the engine unrounded and are formatted once through `formatEstimate`.
- **W148** — `CLIENT_SYS` unchanged: the islands and the hero form receive resolved strings as props.
- **W150** — `page.tsx` exports `revalidate = 86400` (the teaser's `home.079` "2026 rates" badge and `home.068` eyebrow switch at `rateConfig.reviewDueAt`).
- **W154** — no "we"/"biz" in the new `sys.*` copy; the prefills are in the visitor's first-person singular (`voice.test.ts` covers all of `sys.*`).
- **W157 / W160** — nothing to do (headers come from the middleware). **W159** — pixel harness as built.
- **Final-review P-1 (SourceMap document weight)** — resolved by the rule's "below-the-fold placement": the map sits in the eighth block, hidden ≤ 460 px by class; its HTML + flight weight is recorded in the ledger. **P8** — `CalculatorStrip` renders nothing when `rateConfig` or the preset rows are missing (D17: no rates → no numbers, and the homepage still renders). **One `FaqBlock` per page** — the FAQ section is the only one.
- **D13 / D17 / D18 / D19 / D20 / D26 / D27** — success navigates to `/tesekkurler?form=<key>`; dated labels from `RateConfig`; `formatTRY` at the edge; ×0.75 desktop lengths; contrast-safe faces; the named LCP slot; the pixel harness.

**Execution notes that bind every cycle.**
- Path quoting: every path containing `[locale]` or `(site)` is single-quoted in shell commands. Vitest filters by substring: `npx vitest run _home --maxWorkers=1` runs this task's tests.
- Sections are **synchronous** server components that read `sys.*` with `useTranslations('sys')` from `next-intl` (the pattern `src/design/chrome/Header.tsx` uses) and package ids with `makeTf` from `@/content/pure`; that is what lets the section tests render them with `renderWithIntl`. A section that returns early calls `useTranslations` **before** its first `return` (rules of hooks).
- `LazyIsland`'s `load` is a function and cannot cross the server → client boundary, so each island has a `'use client'` binder module that owns `load` and passes `props` + `fallback` through; `fallback` is server JSX built from the directive-less components, DOM-identical to the island's first render.
- The grid breakpoints are the foundation's: `xs` 461, `sm` 561, `md` 701, `lg` 901, `xl` 1101 (`src/app/globals.css`); `max-xs:` is the design's ≤ 460.

---

#### Cycle 1 — Copy, the render-by-data switches and the skeleton page (metadata, `revalidate`, hero shell with `#proposal`, ticker, choice cards, pool empty state)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_home/__tests__/fixtures.ts` (a helper, not a test — the guards skip `__tests__/`):

```ts
import { readFileSync } from 'node:fs';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

/** The committed LOCAL bundle, parsed: the page's real copy and collections. `readFileSync` is the
 *  sanctioned bypass of the D23 import rule (ESLint forbids importing `content/local/*`). */
export function homeBundle(locale: Locale): Bundle {
  return BundleSchema.parse(
    JSON.parse(readFileSync(`src/content/local/bundle.${locale}.json`, 'utf8')),
  );
}

/** A copy of `bundle` with extra collection rows — the FIXTURE_ONLY `stories`/`representatives`,
 *  a published founder, written blog bodies — for the render-by-data branches Phase A never shows.
 *  A new object, so `getCollection`'s per-bundle cache starts empty. */
export function withCollections(bundle: Bundle, collections: Bundle['collections']): Bundle {
  return { ...bundle, collections: { ...bundle.collections, ...collections } };
}
```

`src/app/[locale]/(site)/_home/__tests__/home-copy.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getRateConfig } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { effectiveYear, sgkRateLabel } from '@/lib/calculator';
// Authoring-time data (W143): a TEST may read it; no module under src/ does (M18 guard).
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { formatTRY } from '@/lib/format/money';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { homeBundle } from './fixtures';

/** Every `sys.*` key the homepage reads (W9/W23). A missing key throws at render in dev and
 *  renders the raw key in production, so the set is pinned here. */
const HOME_SYS_KEYS = [
  'seo.home.title',
  'seo.home.description',
  'home.form.callbackSubmit',
  'home.whatsapp.hire',
  'home.whatsapp.partner',
  'home.whatsapp.estimate',
  'home.pool.empty.title',
  'home.pool.empty.body',
  'home.pool.empty.cta',
  'home.calc.eyebrowUndated',
  'home.calc.grossFloor',
  'home.calc.supportSeparate',
  'home.calc.headcount',
  'home.calc.monthlyPayroll',
  'home.season.agricultureSub',
  'home.season.range',
  'home.season.also',
  'home.season.signBy',
  'home.season.noPeak',
  'home.season.gridLabel',
  'home.season.selectHint',
  'home.network.mapTitle',
  'home.network.turkiye',
  'home.portal.platforms',
] as const;

function get(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], obj);
}
const sysOf = (messages: unknown) => (messages as { sys: unknown }).sys;

describe('sys.home.* / sys.seo.home.* (W9/W23/W80)', () => {
  it.each(HOME_SYS_KEYS)('%s is a non-empty string in both message files', (key) => {
    for (const messages of [tr, en]) {
      const value = get(sysOf(messages), key);
      expect(typeof value, key).toBe('string');
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it('sys.home is the homepage object; the Home crumb stays at sys.nav.home (W80)', () => {
    for (const messages of [tr, en]) {
      const home = get(sysOf(messages), 'home');
      expect(typeof home).toBe('object');
      expect(home).not.toBeNull();
      expect(typeof get(sysOf(messages), 'nav.home')).toBe('string');
    }
  });

  it('the ICU arguments are in place in both locales', () => {
    for (const messages of [tr, en]) {
      const sys = sysOf(messages);
      expect(get(sys, 'home.calc.headcount')).toMatch(/\{n, plural,/);
      expect(get(sys, 'home.calc.grossFloor')).toContain('{multiplier}');
      for (const key of ['home.season.range', 'home.season.also'])
        for (const arg of ['{from}', '{to}']) expect(get(sys, key)).toContain(arg);
      for (const arg of ['{start}', '{signBy}']) expect(get(sys, 'home.season.signBy')).toContain(arg);
      expect(get(sys, 'home.season.noPeak')).toContain('{permitDays}');
      for (const arg of ['{role}', '{headcount}', '{monthly}', '{oneOff}'])
        expect(get(sys, 'home.whatsapp.estimate')).toContain(arg);
    }
  });

  it('no sys.home template carries a figure — the engine and the metrics fill them (D17/W142)', () => {
    for (const messages of [tr, en]) {
      const sys = sysOf(messages);
      expect(get(sys, 'seo.home.description')).not.toMatch(/\d/);
      for (const key of ['home.calc.supportSeparate', 'home.calc.grossFloor', 'home.season.noPeak'])
        expect(get(sys, key)).not.toMatch(/\d/);
    }
  });
});

describe('the rate-bearing package copy agrees with rateConfig (D17)', () => {
  it.each(['tr', 'en'] as const)('%s: the year, the SGK rate and the one-off fees', (locale) => {
    const bundle = homeBundle(locale);
    const rc = getRateConfig(bundle);
    const tf = makeTf(bundle, locale);
    const year = String(effectiveYear(rc));
    for (const id of ['home.068', 'home.079', 'home.090']) expect(tf(id), id).toContain(year);
    expect(tf('home.081')).toContain(sgkRateLabel(rc, 'other', locale));
    expect(tf('home.086')).toContain(formatTRY(rc.permitFeeTRY, locale));
    expect(tf('home.086')).toContain(formatTRY(rc.flightTRY, locale));
  });

  it.each(['tr', 'en'] as const)(
    '%s: home.299 renders verbatim with the design figure the WP-C sheet lists (W142(a))',
    (locale) => {
      const row = COPY_DELTAS.find((r) => r.id === 'home.299');
      expect(row?.legal).toBe(true);
      expect(row?.agrees).toBe(false);
      const tf = makeTf(homeBundle(locale), locale);
      expect(tf('home.299')).toContain(formatTRY(row!.design, locale));
    },
  );
});

describe('W150: the page re-renders daily for the dated teaser badge', () => {
  it('src/app/[locale]/(site)/page.tsx exports revalidate = 86400', () => {
    expect(readFileSync('src/app/[locale]/(site)/page.tsx', 'utf8')).toMatch(
      /^export const revalidate = 86400;$/m,
    );
  });
});
```

`src/app/[locale]/(site)/_home/lib/__tests__/phase-a.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { homeBundle } from '../../__tests__/fixtures';
import { hasRows, publishedFounder, rawRows } from '../phase-a';

describe('phase-a switches (W6/D23/W86: rendered by data, never deleted)', () => {
  it('an absent collection reads as empty', () => {
    const bundle = testBundle();
    expect(rawRows(bundle, 'stories')).toEqual([]);
    expect(hasRows(bundle, 'pool')).toBe(false);
    expect(hasRows(bundle, 'representatives')).toBe(false);
  });

  it('a populated collection flips the switch', () => {
    expect(hasRows(testBundle({ collections: { stories: [{ title: 'x' }] } }), 'stories')).toBe(
      true,
    );
  });

  it('W86: the committed founder row is unpublished, so no founder card renders', () => {
    expect(publishedFounder(homeBundle('tr'))).toBeNull();
    expect(publishedFounder(testBundle())).toBeNull();
  });

  it('W86: a published founder row is returned whole', () => {
    const row = { name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: true };
    expect(publishedFounder(testBundle({ collections: { founder: [row] } }))).toEqual(row);
  });
});
```

`src/app/[locale]/(site)/_home/sections/__tests__/top.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle, withCollections } from '../../__tests__/fixtures';
import { ChoiceCards } from '../ChoiceCards';
import { Hero } from '../Hero';
import { LiveCaseBar } from '../LiveCaseBar';
import { PoolSection } from '../PoolSection';

const TR = homeBundle('tr');
const EN = homeBundle('en');
const FORM = <div id="proposal" />;

describe('Hero (D26, W1, W6, W10, W17)', () => {
  it('names the h1 as the one LCP element while v4-hero is a placeholder', () => {
    const { container } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1).toHaveTextContent(
      `${TR.strings['home.018']}${TR.strings['home.019']}${TR.strings['home.020']}`,
    );
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(container.querySelector('[data-placeholder="v4-hero"]')).not.toBeNull();
    expect(container.querySelector('#proposal')).not.toBeNull();
  });

  it('reads the hero figures from the metrics collection and fills the reply-hours metric', () => {
    renderWithIntl(<Hero locale="en" bundle={EN} form={FORM} />, { locale: 'en' });
    expect(screen.getByText('workers placed')).toBeInTheDocument();
    expect(screen.getByText('Free proposal within 24 hours')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('hides the proof cell without stories and shows it once stories has rows (W6)', () => {
    const { unmount } = renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    expect(screen.queryByTestId('hero-proof')).toBeNull();
    unmount();
    renderWithIntl(
      <Hero locale="tr" bundle={withCollections(TR, { stories: [{ title: 'x' }] })} form={FORM} />,
    );
    expect(screen.getByTestId('hero-proof').querySelector('a')).toHaveAttribute(
      'href',
      '/basari-hikayeleri',
    );
  });

  it('hides the badge and the CTA row at ≤ 460 px by class, never by removal (W10)', () => {
    renderWithIntl(<Hero locale="tr" bundle={TR} form={FORM} />);
    const cta = screen.getByRole('link', { name: TR.strings['home.022'] });
    expect(cta).toHaveAttribute('href', '#proposal');
    expect(cta.parentElement).toHaveClass('max-xs:hidden');
    expect(screen.getByRole('link', { name: TR.strings['home.023'] })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});

describe('LiveCaseBar (W6/D23)', () => {
  it('renders nothing without signed stories', () => {
    const { container } = renderWithIntl(<LiveCaseBar locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the newest story title and the approvals link once stories has rows', () => {
    renderWithIntl(
      <LiveCaseBar
        locale="tr"
        bundle={withCollections(TR, { stories: [{ title: 'Çalışma izni onaylandı' }] })}
      />,
    );
    expect(screen.getByTestId('live-case-bar')).toHaveTextContent('Çalışma izni onaylandı');
    expect(screen.getByRole('link', { name: TR.strings['home.055'] })).toHaveAttribute(
      'href',
      '/basari-hikayeleri',
    );
  });
});

describe('ChoiceCards (≤ 460 px only, W10)', () => {
  it('renders the three doors, shown only below xs', () => {
    renderWithIntl(<ChoiceCards locale="tr" bundle={TR} />);
    expect(screen.getByTestId('choice-cards')).toHaveClass('xs:hidden');
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['#proposal', '/ortak-olun', '/temsilci-dogrulama']);
  });
});

describe('PoolSection (W6 empty state)', () => {
  it('stands in for the candidate cards with the request door', () => {
    renderWithIntl(<PoolSection locale="tr" bundle={TR} />);
    const empty = screen.getByTestId('pool-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Aday profilleri yakında burada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aday talep edin →' })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `home-copy.test.ts` — the 24 "non-empty string" cases fail (`expected 'undefined' to be 'string'`), the W80 case fails (`sys.home` is `undefined`), the ICU and no-figure cases fail, the W150 case fails (the spike page has no `revalidate`); the D17 rate-copy and `home.299` cases already pass (they guard data). `phase-a.test.ts` and `top.test.tsx` fail to resolve `../phase-a` / `../Hero` (module not found).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside the existing `"seo"` object add a `"home"` member after `"ogTagline"` (never a second `"seo"` key), and append the `"home"` object as the LAST member of `"sys"`, after the closing brace of `"form"` (add the comma). WP2a Task 3 removed the old leaf `"home": "Ana sayfa"` (W80 — it is `sys.nav.home` now); if a leaf `"home"` is still there, stop: the rename has not landed.

```json
    "seo": {
      "ogTagline": "Türkiye'deki işverenler için lisanslı iş gücü temini — yurt dışından tedarik, kontrol ve çalışma izinleri.",
      "home": {
        "title": "Yurt Dışından İşçi Temini ve Çalışma İzni | JobsAdmire",
        "description": "Türkiye'deki işverenler için yurt dışından nitelikli işçi temini: JobsAdmire'ın kendi temsilcileriyle aday seçimi, yasal çalışma izni ve ilk iş gününe kadar tek elden süreç. Ücretsiz teklif alın."
      }
    },
```

```json
    "home": {
      "form": {
        "callbackSubmit": "Beni arayın →"
      },
      "whatsapp": {
        "hire": "Merhaba JobsAdmire, işçi talebi oluşturmak istiyorum.",
        "partner": "Merhaba JobsAdmire, yurt dışında bir işe alım acentesini / eğitim kurumunu temsil ediyorum ve tedarik ortağı olmak istiyorum.",
        "estimate": "Merhaba JobsAdmire, bu hesabı benim için kontrol eder misiniz?\nPozisyon seviyesi: {role}\nİşçi sayısı: {headcount}\nAylık bordro: {monthly}\nİlk yıl tek seferlik maliyetler: {oneOff}"
      },
      "pool": {
        "empty": {
          "title": "Aday profilleri yakında burada",
          "body": "Adaylar kendi ülkelerinde JobsAdmire temsilcileri tarafından görüşülür ve belgeleri doğrulanır. Sektörünüzü ve ihtiyacınızı yazın; uygun profiller doğrudan size iletilir.",
          "cta": "Aday talep edin →"
        }
      },
      "calc": {
        "eyebrowUndated": "Gerçek maliyet",
        "grossFloor": "Brüt maaş ({multiplier} yasal taban)",
        "supportSeparate": "Dahil değil — tam hesaplamada ayrıca gösterilir",
        "headcount": "{n, plural, other {# işçi}}",
        "monthlyPayroll": "aylık bordro"
      },
      "season": {
        "agricultureSub": "Antalya, Mersin, Konya",
        "range": "Yoğun dönem {from}–{to}",
        "also": " · ayrıca {from}–{to}",
        "signBy": "{start} ayında başlamak için {signBy} ayına kadar imzalayın",
        "noPeak": "Yoğun sezon yok — ancak izinler yine {permitDays} gün sürer",
        "gridLabel": "Aylara göre sezonluk talep",
        "selectHint": "Bir sezonun planını görmek için satırını seçin"
      },
      "network": {
        "mapTitle": "Kaynak ülkelerden Türkiye'ye",
        "turkiye": "Türkiye"
      },
      "portal": {
        "platforms": "Android"
      }
    }
```

`src/messages/en.json` — the same two edits, identical key set:

```json
      "home": {
        "title": "Hire Skilled Workers from Abroad for Türkiye | JobsAdmire",
        "description": "Skilled workers sourced abroad for employers in Türkiye — candidates vetted by JobsAdmire's own representatives, legal work permits and arrival, managed end to end. Get a free proposal."
      }
```

```json
    "home": {
      "form": {
        "callbackSubmit": "Call me back →"
      },
      "whatsapp": {
        "hire": "Hello JobsAdmire, I want to hire workers.",
        "partner": "Hello JobsAdmire, I represent a recruitment agency / training institute abroad and would like to become a sourcing partner.",
        "estimate": "Hello JobsAdmire, please check this estimate for me.\nRole level: {role}\nHeadcount: {headcount}\nMonthly payroll: {monthly}\nFirst-year one-off costs: {oneOff}"
      },
      "pool": {
        "empty": {
          "title": "Candidate profiles are coming soon",
          "body": "Candidates are interviewed and document-checked in their own country by JobsAdmire representatives. Share your sector and headcount, and matching profiles come straight to you.",
          "cta": "Request candidates →"
        }
      },
      "calc": {
        "eyebrowUndated": "Real cost",
        "grossFloor": "Gross salary ({multiplier} legal floor)",
        "supportSeparate": "Not included — shown on the full calculator",
        "headcount": "{n, plural, one {# worker} other {# workers}}",
        "monthlyPayroll": "monthly payroll"
      },
      "season": {
        "agricultureSub": "Antalya, Mersin, Konya",
        "range": "Peak {from}–{to}",
        "also": " · also {from}–{to}",
        "signBy": "To start in {start}, sign by {signBy}",
        "noPeak": "No peak season — but permits still take {permitDays} days",
        "gridLabel": "Seasonal demand by month",
        "selectHint": "Select a row to see that season's plan"
      },
      "network": {
        "mapTitle": "From the source countries to Türkiye",
        "turkiye": "Türkiye"
      },
      "portal": {
        "platforms": "Android"
      }
    }
```

The WhatsApp prefills are the visitor's own words in the first-person **singular** ("I want…", "istiyorum"), like `sys.whatsapp.prefill`; nothing in `sys.home` speaks as the company in the first person (W154 — `src/messages/voice.test.ts` checks every `sys.*` string). `" · also …"` keeps its leading space on purpose (it is appended to the `range` text).

`src/app/[locale]/(site)/_home/lib/assets.ts`:

```ts
/**
 * §10 row 4 (D26): the licensed Homepage hero photograph. `null` until the stock pack lands — the
 * full-bleed slot `v4-hero` then renders as a named gradient placeholder and the h1 is the page's
 * LCP element (`data-lcp-slot="h1"`). When the file ships under `public/photos/`, set its path
 * here and nothing else: `ImageSlot` takes `lcp` (+ `preload`) and the h1 drops its attribute, so
 * the page still names exactly one LCP slot (docs/SEO.md § Pages).
 */
export const HERO_PHOTO: string | null = null;
```

`src/app/[locale]/(site)/_home/lib/phase-a.ts`:

```ts
import { getCollection, type Founder } from '@/content/collections';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * W6/D2/D23: the homepage sections that need live data render nothing until their collection has
 * rows — these are the switches the sections read (nothing is deleted). `stories`, `pool` and
 * `representatives` are FIXTURE_ONLY (`src/content/config.ts`: never served from LOCAL in
 * production), so under LOCAL they are always empty; in Phase B the OPS bundle fills them. They
 * have no schema in `collections.ts` (accepted as page-local), hence the raw rows here.
 */
export type PhaseAKey = 'stories' | 'pool' | 'representatives';

export function rawRows(bundle: Bundle, key: PhaseAKey): Record<string, unknown>[] {
  return bundle.collections[key] ?? [];
}

export function hasRows(bundle: Bundle, key: PhaseAKey): boolean {
  return rawRows(bundle, key).length > 0;
}

/** W86: the signing founder, only once the owner has published the row (§10 row 3). */
export function publishedFounder(bundle: Bundle): Founder | null {
  return getCollection(bundle, 'founder').find((row) => row.published) ?? null;
}
```

`src/app/[locale]/(site)/_home/components/LiveDot.tsx`:

```tsx
/** The design's green "live" dot (`.ja-live`). Decorative; the global reduced-motion rule
 *  (`src/app/globals.css`) stops the pulse. No directive: server and client trees both use it. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-block h-2 w-2 shrink-0 rounded-pill bg-success motion-safe:animate-pulse',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
```

`src/app/[locale]/(site)/_home/components/icons.tsx`:

```tsx
import type { ReactNode } from 'react';

/** The homepage's own inline glyphs, lifted from the design (the chrome's set is
 *  `@/design/chrome/icons`). Every one is decorative: the link, button or card around it carries
 *  the accessible name (D20). No directive — server sections and the islands both render them. */
type IconProps = { size?: number; className?: string };

function Glyph({ size = 18, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
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

export function ArrowRightIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Glyph>
  );
}

export function UserPlusIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 11h-6" />
      <path d="M19 8v6" />
    </Glyph>
  );
}

export function ArrowsIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M21 3l-7.5 7.5" />
      <path d="M3 21l7.5-7.5" />
    </Glyph>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2l7.5 3.2v5.3c0 4.7-3.1 9-7.5 10.5-4.4-1.5-7.5-5.8-7.5-10.5V5.2z" />
      <path d="m9 12 2 2 4-4" />
    </Glyph>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
    </Glyph>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </Glyph>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Glyph>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2l2.4 5.4L20 8l-4 4 1 5.6L12 15l-5 2.6L8 12 4 8l5.6-.6z" />
    </Glyph>
  );
}

export function FileCheckIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15l2 2 4-4" />
    </Glyph>
  );
}

export function MobileIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </Glyph>
  );
}
```

`src/app/[locale]/(site)/_home/sections/types.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** Every homepage section is a synchronous server component over the request's bundle: package
 *  ids through `makeTf(bundle, locale)`, `sys.*` through next-intl's `useTranslations('sys')` (the
 *  pattern `src/design/chrome/Header.tsx` uses), so `renderWithIntl` can render each one in a
 *  test. No section awaits anything; the page stays a thin composition. */
export type SectionProps = { locale: Locale; bundle: Bundle };
```

`src/app/[locale]/(site)/_home/sections/styles.ts`:

```ts
/** The design's section h2 (`clamp(28px, 3.2vw, 42px)`, -1.6px, line-height 1.05): the size comes
 *  from the `text-h2` token (D19-scaled from 1101 px), the letter-spacing is scaled here. Margins
 *  and colour are the caller's — neither is set, so a composition never repeats a property (W122). */
export const H2 = 'text-h2 leading-[1.05] tracking-[-1.6px] max-xs:tracking-[-1px] xl:tracking-[-1.2px]';

/** The design's section lead paragraph (16px/1.65, `#556377`). */
export const LEAD = 'text-body leading-[1.65] text-text-secondary';

/** The design's eyebrow-and-h2 row with a right-hand aside or CTA. */
export const SECTION_HEAD = 'mb-7 flex flex-wrap items-end justify-between gap-6';
```

`src/app/[locale]/(site)/_home/sections/Hero.tsx`:

```tsx
import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import { LiveDot } from '../components/LiveDot';
import { HERO_PHOTO } from '../lib/assets';
import { hasRows } from '../lib/phase-a';
import type { SectionProps } from './types';

/**
 * The cinematic hero (design lines 361–445): the full-bleed photo slot under the design's two
 * overlays, the badge, the three-line h1 (the package splits it into home.018–020 on purpose, the
 * `<br/>`s are authored), the sub, the CTAs and the metric strip. The right column is the
 * `#proposal` lead card, passed in as `form` so the page owns the server actions (Cycle 2).
 * D26: while `v4-hero` is a placeholder the h1 carries the page's one `data-lcp-slot`;
 * `HERO_PHOTO` moves it onto the image. W10: the badge and the CTA row are hidden at ≤ 460 px by
 * class, exactly as the design's `.ja-hero-1` / `.ja-hero-cta-primary` rules do.
 */
export function Hero({ locale, bundle, form }: SectionProps & { form: ReactNode }) {
  const tf = makeTf(bundle, locale);
  const photoIsLcp = HERO_PHOTO !== null;
  return (
    <section
      data-testid="hero"
      className="relative flex min-h-[660px] flex-col justify-end overflow-hidden bg-[#0a1428] text-white max-xs:min-h-0 xl:min-h-[495px]"
    >
      {/* W129: the slot owns its 16:9 box; this wrapper only pins it behind the hero. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <ImageSlot
          slot="v4-hero"
          lcp={photoIsLcp}
          src={HERO_PHOTO}
          alt=""
          width={1600}
          height={900}
          sizes="100vw"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,40,0.95)_0%,rgba(10,20,40,0.88)_50%,rgba(10,20,40,0.7)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.5)_0%,transparent_30%,rgba(10,20,40,0.75)_100%)]"
      />
      <div className="container-site relative grid w-full items-center gap-[34px] pb-8 pt-10 xs:pb-11 xs:pt-[72px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-[42px] xl:pb-[33px] xl:pt-[54px]">
        <div className="min-w-0">
          <p className="mb-[26px] inline-flex items-center gap-2.5 rounded-pill border border-white/30 px-[18px] py-2 text-[12.5px] font-bold uppercase tracking-[0.6px] max-xs:hidden xl:mb-5 xl:px-[13.5px] xl:py-1.5 xl:text-[11px]">
            <LiveDot />
            {tf('home.017')}
          </p>
          <h1
            data-testid="page-h1"
            data-lcp-slot={photoIsLcp ? undefined : 'h1'}
            className="m-0 mb-5 max-w-[620px] text-h1 leading-none tracking-[-2.4px] text-white text-pretty max-xs:leading-[1.06] max-xs:tracking-[-1.2px] xl:mb-[15px] xl:max-w-[465px] xl:tracking-[-1.8px]"
          >
            {tf('home.018')}
            <br />
            {tf('home.019')}
            <br />
            <span className="text-[#4fc1f0]">{tf('home.020')}</span>
          </h1>
          <p className="m-0 mb-7 max-w-[520px] text-body-lg text-white/78 max-xs:text-body xl:mb-[21px] xl:max-w-[390px]">
            {tf('home.021')}
          </p>
          <div className="flex flex-wrap items-center gap-3 max-xs:hidden">
            {/* R22: an in-page anchor stays a plain <a>, never the typed Link. */}
            <a href="#proposal" className={buttonClassName('primary', 'lg')}>
              {tf('home.022')}
            </a>
            <Button variant="inverse" size="lg" href="/available-workers">
              {tf('home.023')}
            </Button>
            <span className="ml-1.5 text-body-sm font-bold text-white/60">{tf('home.024')}</span>
          </div>
        </div>
        <div className="min-w-0">{form}</div>
      </div>
      <HeroStats locale={locale} bundle={bundle} />
    </section>
  );
}

/** The design's stats bar: W1 metrics through `MetricStrip` (dark tone; an unsigned metric is
 *  hidden, never 0). The fourth design cell ("All cases are public →") is a claim about the
 *  approvals wall, so it renders only once `stories` has rows (W6). */
function HeroStats({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  return (
    <div className="relative border-t border-white/15 bg-[rgba(10,20,40,0.35)] backdrop-blur-[6px]">
      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 xl:py-4">
        <div className="min-w-0 flex-1">
          <MetricStrip
            bundle={bundle}
            locale={locale}
            metrics={['placed', 'countries', 'permitDays']}
            tone="dark"
          />
        </div>
        {hasRows(bundle, 'stories') ? (
          <div data-testid="hero-proof" className="flex flex-col max-xs:hidden">
            <Link
              href="/success-stories"
              className="text-body-sm font-extrabold text-sky no-underline hover:underline"
            >
              {tf('home.053')}
            </Link>
            <span className="mt-1 text-[12.5px] font-semibold text-white/60">{tf('home.054')}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/sections/LiveCaseBar.tsx`:

```tsx
import { z } from 'zod';
import { makeTf } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import { LiveDot } from '../components/LiveDot';
import { rawRows } from '../lib/phase-a';
import type { SectionProps } from './types';

const StoryRow = z.object({ title: z.string().min(1) });

/**
 * The design's rotating "Approved" case bar (home.201 + six fabricated cases with synthetic refs
 * and "2h ago" recency). W6/D23: nothing renders until `stories` has signed rows; then Phase A
 * shows the newest title statically — the D9 v1 cards carry no recency, and a rotator needs a
 * pause control (D20); both belong to the Success Stories task. A row of another shape is skipped.
 */
export function LiveCaseBar({ locale, bundle }: SectionProps) {
  const first = StoryRow.safeParse(rawRows(bundle, 'stories')[0]);
  if (!first.success) return null;
  const tf = makeTf(bundle, locale);
  return (
    <div data-testid="live-case-bar" className="bg-ink text-white max-xs:bg-navy">
      <div className="container-site flex flex-wrap items-center gap-4 py-3.5 max-xs:flex-col max-xs:items-start max-xs:gap-1 max-xs:py-4">
        <span className="inline-flex shrink-0 items-center gap-2 text-[11px] font-extrabold uppercase tracking-[1.3px] text-[#5ddfb0]">
          <LiveDot />
          {tf('home.201')}
        </span>
        <span className="min-w-0 text-body-sm font-bold">{first.data.title}</span>
        <Link
          href="/success-stories"
          className="ml-auto whitespace-nowrap text-[13px] font-extrabold text-sky no-underline max-xs:ml-0"
        >
          {tf('home.055')}
        </Link>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/sections/ChoiceCards.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon, ArrowsIcon, ShieldIcon, UserPlusIcon } from '../components/icons';
import type { SectionProps } from './types';

// W155 pattern: a colourless base; each card adds its own surface, border and text colours.
const CARD =
  'flex items-center gap-3.5 rounded-lg p-5 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const ICON = 'flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-sm';
const TITLE = 'block font-display text-[18px] font-extrabold tracking-[-0.5px]';
const SUB = 'mt-[3px] block text-[13px] font-semibold leading-[1.45]';

/** The design's phone-only door cards (`.ja-choice`, ≤ 460 px): rendered always, shown only below
 *  `xs` (W10). "Check someone's ID" goes to the Verify page. */
export function ChoiceCards({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  return (
    <div data-testid="choice-cards" className="grid gap-3 bg-white px-5 pb-1 pt-[26px] xs:hidden">
      <a href="#proposal" className={`${CARD} bg-navy text-white active:bg-[#16294f]`}>
        <span aria-hidden="true" className={`${ICON} bg-blue/20 text-sky`}>
          <UserPlusIcon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={TITLE}>{tf('home.056')}</span>
          <span className={`${SUB} text-white/60`}>{tf('home.057')}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-sky" />
      </a>
      <Link
        href="/partner-with-us"
        className={`${CARD} border-[1.5px] border-border-1 bg-pale-1 text-ink active:bg-tint`}
      >
        <span aria-hidden="true" className={`${ICON} bg-tint text-blue-safe`}>
          <ArrowsIcon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={TITLE}>{tf('home.058')}</span>
          <span className={`${SUB} text-text-secondary`}>{tf('home.059')}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-blue-safe" />
      </Link>
      <Link
        href="/verify"
        className={`${CARD} border-[1.5px] border-[#bfe8cf] bg-[#eafaf1] text-ink active:bg-[#dcf5e7]`}
      >
        <span aria-hidden="true" className={`${ICON} bg-success-surface text-success-text`}>
          <ShieldIcon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={TITLE}>{tf('home.060')}</span>
          <span className={`${SUB} text-[#4b6a58]`}>{tf('home.061')}</span>
        </span>
        <ArrowRightIcon className="shrink-0 text-success-text" />
      </Link>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/sections/PoolSection.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { EmptyState } from '@/design/blocks/EmptyState';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { SectionProps } from './types';

/**
 * The "Live candidates" slot (design lines 487–527). D2 keeps per-profile cards off at launch and
 * the section's copy makes cadence/count claims nobody has signed ("updates weekly", "14+ live
 * profiles", home.063–067 — W6), so Phase A renders the designed empty state with the request
 * door under the neutral nav label home.003 ("Candidates"). When a `pool` feed exists (Phase B,
 * the Available Workers task owns its shape) this is where it mounts; the empty state stays the
 * fallback.
 */
export function PoolSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="candidates">
      <div data-testid="pool" className="container-site">
        <Eyebrow>{tf('home.003')}</Eyebrow>
        <EmptyState
          testId="pool-empty"
          tone="pale"
          headingLevel={2}
          className="mt-4"
          title={sys('home.pool.empty.title')}
          body={sys('home.pool.empty.body')}
          cta={{ label: sys('home.pool.empty.cta'), href: '/available-workers' }}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — replace the whole file:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { ChoiceCards } from './_home/sections/ChoiceCards';
import { Hero } from './_home/sections/Hero';
import { LiveCaseBar } from './_home/sections/LiveCaseBar';
import { PoolSection } from './_home/sections/PoolSection';

/** W150 (D17): the calculator teaser's dated badge and eyebrow switch off at
 *  `rateConfig.reviewDueAt`; the page is statically generated, so it re-renders daily. */
export const revalidate = 86400;

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
  // The page record `home` carries no package SEO string (titleId/descriptionId are ''), so the
  // sys.seo.home.* copy is the title/description and the OG image's title (W23/W38).
  return buildMetadata({
    locale,
    href: '/',
    bundle,
    pageKey: 'home',
    fallbackTitle: sys('seo.home.title'),
    fallbackDescription: sys('seo.home.description'),
  });
}

/** The homepage (design/JobsAdmire Homepage v4), section for section in the design's order. No
 *  <main> here — SiteChrome owns it (R31). Sections that need live data decide for themselves
 *  whether to render (W6). */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const section = { locale, bundle };
  return (
    <>
      {/* Cycle 2 mounts the lead card in this slot; the id exists from the first commit because
          the header CTA (CTA_BY_PATHNAME['/']) and the launch anchor sweep point at it. */}
      <Hero {...section} form={<div id="proposal" className="scroll-mt-[90px]" />} />
      <LiveCaseBar {...section} />
      <ChoiceCards {...section} />
      <PoolSection {...section} />
    </>
  );
}
```

`docs/CONTENT-MODEL.md` — in `### Adding copy (W9, W23, W54)`, directly after its paragraph (the one ending "…and documents it in the Blocks bullet of § The `sys.*` range.") and before the heading `### Deliberately-empty Turkish fragments`, insert (W98 — this task creates the list; later tasks append):

```markdown
**Per-page `sys.*` copy (WP2b, W98).** One bullet per page task, in execution order; a later task appends its bullet after the last one and never starts a second list.

- **Homepage (`sys.home.*` + `sys.seo.home.*`, WP2b T1):** `form.callbackSubmit` (the phone-only call-me-back form's submit), `whatsapp.{hire,partner,estimate}` (the page's WhatsApp prefills, in the visitor's first-person singular like `sys.whatsapp.prefill`; `estimate` is an ICU template over the teaser's figures and is composed into the URL only on click — W95), `pool.empty.{title,body,cta}` (the W6 empty state that stands in for the candidate cards), `calc.{eyebrowUndated,grossFloor,supportSeparate,headcount,monthlyPayroll}` (`eyebrowUndated` replaces `home.068` from `rateConfig.reviewDueAt`, D17; `grossFloor` takes the engine's `multiplierLabel`; `supportSeparate` is W58's statement that the minimum-wage support is not in the figure; `headcount` is an ICU plural), `season.{agricultureSub,range,also,signBy,noPeak,gridLabel,selectHint}` (the planner's composed copy — month names come from `Intl`, `noPeak` takes `{permitDays}` from the metric), `network.{mapTitle,turkiye}` (`SourceMap`'s `title` and `turkiyeLabel`), `portal.platforms` (W8: Android only); plus `seo.home.{title,description}` (the page record carries no package SEO string). No template carries a figure. Every other string on the page is a `home.*` id read through `makeTf`. No client module reads `sys.home` — the islands and the hero form receive resolved strings as props — so `CLIENT_SYS` is unchanged (W148).
```

`docs/SEO.md` — directly before the heading `## Redirects policy (summary)`, insert (W98 — this task creates the table; later tasks append rows):

```markdown
## Pages

One row per page task (WP2b, W98). The columns are fixed; a later task appends its row after the last one — never a second table.

| Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | `/` · `/en` | `sys.seo.home.{title,description}` — the page record `home` carries no package SEO string (`titleId: ''`, W23/W38); OG image `/og/{locale}/home.png` (title `sys.seo.home.title`, subline `sys.seo.ogTagline`) | `absoluteUrl(locale, '/')` | site-wide `Organization`/`EmploymentAgency` + `WebSite` (locale layout); `FAQPage` from `FaqBlock` (`home.294`–`305`, AEO only); no `BreadcrumbList` on the root (W109) | `h1` (`data-lcp-slot="h1"`) while the full-bleed hero slot `v4-hero` is a named placeholder (§10 row 4); `HERO_PHOTO` in `src/app/[locale]/(site)/_home/lib/assets.ts` moves the slot onto the image when the licensed photo ships (D26) | pixel page (D27); `revalidate = 86400` for the teaser's dated badge (W150); the sourcing map is inline SVG in the eighth block, below the fold (final-review P-1) |
```

`docs/ARCHITECTURE.md` — two edits:

1. § Routing: directly before the paragraph that begins "**The 404 response is Next's own `__next_error__` shell until hydration (W151).**", insert the paragraph:

```markdown
**Page-private modules live in App Router private folders** (`_`-prefixed, never routes). The homepage's route folder is the `(site)` group itself, which every other page shares, so its modules sit in `(site)/_home/` (`sections/` — synchronous server components that read package ids through `makeTf` and `sys.*` through `useTranslations('sys')`, so the section tests render them; `components/` — the islands, their `'use client'` `LazyIsland` binders and the directive-less pieces the server fallbacks share; `lib/` — pure models; `actions.ts` — the `'use server'` form wrappers); every other page keeps its `_lib/`, `_components/` and `_sections/` beside its own `page.tsx`.
```

2. § Design system: in the paragraph that begins "Pages: one server component per page", replace the sentence "**WP1 ships two real pages** (`/`, `/hire-workers`, both still spike-era placeholder content) plus the thank-you and dev-gallery routes; the rest land in WP2." with:

```markdown
**WP1 shipped two spike pages** (`/`, `/hire-workers`) plus the thank-you and dev-gallery routes; WP2b ports the fourteen designed pages one task at a time — `docs/SEO.md` § Pages has one row per designed page (the homepage first, T1).
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md docs/SEO.md docs/ARCHITECTURE.md 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `home-copy.test.ts` 24 + 5 + 2 + 2 + 1 cases green, `phase-a.test.ts` 4, `top.test.tsx` 8. Then the low-memory verify line:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected green, including the standing guards this cycle touches: `src/messages/messages.test.ts` (identical key sets), `src/messages/voice.test.ts` (no first-person plural in `sys.*`), `src/i18n/client-messages.test.ts` (no client module reads `sys.home`), `src/design/__tests__/class-collisions.test.ts` (the new class strings), `src/design/__tests__/client-imports.test.ts` and `src/design/blocks/__tests__/rsc-imports.test.ts` (by-path imports), `src/lib/seo/unbuilt.test.ts` (the page file keeps its path), `src/lib/seo/og.test.ts` / the OG route test (the OG title now reads `sys.seo.home.title` when the page record is empty). No build here (W126: one build, in Cycle 7).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md docs/SEO.md docs/ARCHITECTURE.md && git commit -m "feat(home): homepage skeleton — sys.home copy, hero shell with the #proposal anchor, render-by-data ticker, choice cards, pool empty state (T1 c1)

Metadata from sys.seo.home.* (the page record has no package SEO string, W38); the h1 is the one
LCP slot while v4-hero is a placeholder (D26); revalidate = 86400 for the dated teaser badge
(W150); ticker and proof cell render by data (W6/D23), the pool slot is a designed empty state.
Docs: CONTENT-MODEL per-page sys list and SEO § Pages created (W98), ARCHITECTURE private folders.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — The hero lead card: `hire` (proposal) and the phone-only `callback` (call me back) through the forms kernel

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_home/lib/__tests__/forms.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { START_WHEN_KEYS } from '@/forms/options';
import {
  callbackSchema,
  callbackSpec,
  callbackToFields,
  HERO_SECTOR_KEYS,
  HERO_SECTOR_LABEL_IDS,
  hireSchema,
  hireSpec,
  hireToFields,
  START_WHEN_LABEL_IDS,
} from '../forms';

const hire = {
  company: 'Akdeniz Tekstil A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 501 000 00 00',
  sector: 'factory',
  headcount: '15',
  city: 'Antalya',
  startWhen: 'month1',
};

const codes = (result: ReturnType<typeof hireSchema.safeParse>) =>
  result.success ? {} : fieldErrorsFromIssues(result.error.issues);

describe('the option sets (W77/W78/W115)', () => {
  it('sector keys are a subset of the sectors collection keys, labelled by home.036–040', () => {
    for (const key of HERO_SECTOR_KEYS) expect(SECTOR_KEYS).toContain(key);
    expect(HERO_SECTOR_LABEL_IDS).toEqual({
      factory: 'home.036',
      agriculture: 'home.037',
      tourism: 'home.038',
      construction: 'home.039',
      other: 'home.040',
    });
  });

  it('startWhen is the shared START_WHEN_KEYS set, labelled by the package’s home.044–047', () => {
    expect(Object.keys(START_WHEN_LABEL_IDS)).toEqual([...START_WHEN_KEYS]);
    expect(Object.values(START_WHEN_LABEL_IDS)).toEqual([
      'home.044',
      'home.045',
      'home.046',
      'home.047',
    ]);
  });
});

describe('hireSchema → hireToFields (catalog names — W3/W16)', () => {
  it('maps a full submission onto the exact `hire` catalog field names', () => {
    expect(hireToFields(hireSchema.parse(hire))).toEqual({
      company: 'Akdeniz Tekstil A.Ş.',
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 501 000 00 00',
      headcount: '15',
      sector: 'factory',
      city: 'Antalya',
      startWhen: 'month1',
    });
  });

  it('omits the optional fields the visitor left empty', () => {
    const fields = hireToFields(hireSchema.parse({ ...hire, sector: '', city: '', startWhen: '' }));
    expect(Object.keys(fields).sort()).toEqual(['company', 'email', 'headcount', 'name', 'phone']);
  });

  it('requires name and e-mail — the door does, the design did not (W3)', () => {
    expect(codes(hireSchema.safeParse({ ...hire, name: '', email: '' }))).toMatchObject({
      name: 'required',
      email: 'required',
    });
    expect(codes(hireSchema.safeParse({ ...hire, email: 'not-an-address' }))).toMatchObject({
      email: 'email',
    });
  });

  it('a phone needs eight digits (the door rule) and reports the phone code', () => {
    expect(codes(hireSchema.safeParse({ ...hire, phone: '+90 12' }))).toMatchObject({
      phone: 'phone',
    });
  });

  it('headcount is a positive integer of at most ten digits', () => {
    for (const headcount of ['0', 'fifteen', '12345678901'])
      expect(codes(hireSchema.safeParse({ ...hire, headcount }))).toMatchObject({
        headcount: 'invalid',
      });
  });

  it('only the stable keys pass — a localized label is never a wire value (W77)', () => {
    expect(hireSchema.safeParse({ ...hire, sector: 'Fabrika / Üretim' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, startWhen: 'Within 1 month' }).success).toBe(false);
    for (const sector of HERO_SECTOR_KEYS)
      expect(hireSchema.safeParse({ ...hire, sector }).success).toBe(true);
    for (const startWhen of START_WHEN_KEYS)
      expect(hireSchema.safeParse({ ...hire, startWhen }).success).toBe(true);
  });

  it('the spec posts to `hire` with the consent checkbox (W79)', () => {
    expect(hireSpec.key).toBe('hire');
    expect(hireSpec.consent).toBe('checkbox');
    expect(hireSpec.schema).toBe(hireSchema);
  });
});

describe('callbackSchema → callbackToFields (catalog `callback`)', () => {
  const base = { name: 'Mehmet Kaya', phone: '05320000000' };

  it('maps onto name, phone, topic (the sector key) and city', () => {
    expect(
      callbackToFields(callbackSchema.parse({ ...base, topic: 'tourism', city: 'Antalya' })),
    ).toEqual({ name: 'Mehmet Kaya', phone: '05320000000', topic: 'tourism', city: 'Antalya' });
    expect(
      Object.keys(callbackToFields(callbackSchema.parse({ ...base, topic: '', city: '' }))),
    ).toEqual(['name', 'phone']);
  });

  it('name and phone are required; topic takes only the sector keys', () => {
    expect(callbackSchema.safeParse({ name: '', phone: '' }).success).toBe(false);
    expect(callbackSchema.safeParse({ ...base, topic: 'Turizm' }).success).toBe(false);
  });

  it('the spec posts to `callback` with the consent checkbox (W79)', () => {
    expect(callbackSpec.key).toBe('callback');
    expect(callbackSpec.consent).toBe('checkbox');
  });
});
```

`src/app/[locale]/(site)/_home/components/__tests__/HeroLeadForm.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { HeroLeadForm, type HeroLeadFormProps } from '../HeroLeadForm';

const action = () => vi.fn(async (prev: FormActionState) => prev);

const props: HeroLeadFormProps = {
  locale: 'tr',
  actions: { hire: action(), callback: action() },
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  whatsappHref: 'https://wa.me/905011240340?text=Merhaba%20JobsAdmire',
  contact: {
    phone: '+905011240340',
    phoneDisplay: '+90 501 124 03 40',
    email: 'info@jobsadmire.com',
  },
  options: {
    sector: [
      { value: 'factory', label: 'Fabrika / Üretim' },
      { value: 'tourism', label: 'Turizm / Konaklama' },
    ],
    startWhen: [
      { value: 'asap', label: 'Hemen' },
      { value: 'month1', label: '1 ay içinde' },
    ],
  },
  copy: {
    title: 'İşçi talebi',
    titleMobile: 'İhtiyacınızı yazın',
    badge: '24 saat içinde yanıt',
    sub: 'Aday profilleri, gerçek aylık maliyet ve çalışma izni takvimi — ücretsiz.',
    openProposal: 'Ücretsiz teklif alın →',
    openCallback: 'Sizi arayalım',
    callbackNote: 'Numaranızı bırakın, Antalya ekibi sizi arasın.',
    labels: {
      company: 'Firma adı',
      name: 'İletişim kişisi',
      phone: 'Telefon / WhatsApp',
      sector: 'Sektör',
      headcount: 'İşçi sayısı',
      city: 'Şehir / bölge',
      startWhen: 'Zamanlama',
    },
    submitHire: 'Teklif isteyin →',
    submitCallback: 'Beni arayın →',
    whatsapp: "WhatsApp'tan yazın",
  },
};

beforeEach(() => {
  window.dataLayer = [];
});

describe('HeroLeadForm', () => {
  it('starts in proposal mode: the W3 fields, package labels (W115), key options (W78), the consent checkbox (W79)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const form = screen.getByTestId('hire-form');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    for (const name of ['company', 'name', 'email', 'phone', 'headcount', 'city'])
      expect(form.querySelector(`input[name="${name}"]`), name).not.toBeNull();
    expect(screen.getByRole('textbox', { name: 'Firma adı' })).toHaveAttribute('name', 'company');
    expect(screen.getByRole('textbox', { name: 'İletişim kişisi' })).toHaveAttribute(
      'name',
      'name',
    );
    // no package label for e-mail — Field falls back to sys.form.labels.email (W30/W115)
    expect(screen.getByRole('textbox', { name: 'E-posta' })).toHaveAttribute('name', 'email');
    const startWhen = [...form.querySelectorAll('select[name="startWhen"] option')].map((o) =>
      o.getAttribute('value'),
    );
    expect(startWhen).toEqual(['', 'asap', 'month1']);
    expect(form.querySelector('input[name="consent"][type="checkbox"]')).not.toBeNull();
    expect(screen.queryByTestId('callback-form')).toBeNull();
  });

  it('is the #proposal anchor; below xs the form waits behind the two mode buttons (W10/W17)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    expect(screen.getByTestId('hero-form')).toHaveAttribute('id', 'proposal');
    expect(document.getElementById('hero-form-body')).toHaveClass('max-xs:hidden');
    expect(screen.getByTestId('hero-mode-proposal').parentElement).toHaveClass('xs:hidden');
  });

  it('"Ask us to call you" swaps to the callback form, shows the note and focuses the first field', async () => {
    const user = userEvent.setup();
    renderWithIntl(<HeroLeadForm {...props} />);
    await user.click(screen.getByTestId('hero-mode-callback'));
    const form = screen.getByTestId('callback-form');
    expect(form).toHaveAttribute('data-form-key', 'callback');
    for (const selector of [
      'input[name="name"]',
      'input[name="phone"]',
      'select[name="topic"]',
      'input[name="city"]',
    ])
      expect(form.querySelector(selector), selector).not.toBeNull();
    expect(form.querySelector('input[name="email"]')).toBeNull();
    expect(screen.getByText(props.copy.callbackNote)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beni arayın →' })).toHaveAttribute('type', 'submit');
    expect(screen.queryByTestId('hero-mode-callback')).toBeNull();
    expect(document.getElementById('hero-form-body')).not.toHaveClass('max-xs:hidden');
    expect(document.activeElement).toBe(form.querySelector('input[name="name"]'));
  });

  it('the WhatsApp link carries only the fixed hire prefill and fires whatsapp_click (page_cta)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const link = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(link).toHaveAttribute('href', props.whatsappHref);
    expect(link).toHaveAttribute('target', '_blank');
    document.addEventListener('click', (e) => e.preventDefault(), { capture: true, once: true });
    fireEvent.click(link);
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'whatsapp_click',
      locale: 'tr',
      placement: 'page_cta',
    });
  });
});
```

`src/app/[locale]/(site)/_home/sections/__tests__/hero-form.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { HeroForm } from '../HeroForm';

const actions = {
  hire: vi.fn(async (prev: FormActionState) => prev),
  callback: vi.fn(async (prev: FormActionState) => prev),
};

describe('HeroForm — the section that resolves the lead card', () => {
  it.each(['tr', 'en'] as const)(
    '%s: package labels, key-valued options, the package submit, the fixed WhatsApp prefill',
    (locale) => {
      const bundle = homeBundle(locale);
      const s = bundle.strings;
      renderWithIntl(<HeroForm locale={locale} bundle={bundle} actions={actions} />, { locale });
      const form = screen.getByTestId('hire-form');
      expect(screen.getByRole('textbox', { name: s['home.032'] })).toHaveAttribute(
        'name',
        'company',
      );
      expect(screen.getByRole('textbox', { name: s['home.033'] })).toHaveAttribute('name', 'name');
      const sector = [...form.querySelectorAll('select[name="sector"] option')]
        .slice(1)
        .map((o) => [o.getAttribute('value'), o.textContent]);
      expect(sector).toEqual([
        ['factory', s['home.036']],
        ['agriculture', s['home.037']],
        ['tourism', s['home.038']],
        ['construction', s['home.039']],
        ['other', s['home.040']],
      ]);
      const startWhen = [...form.querySelectorAll('select[name="startWhen"] option')]
        .slice(1)
        .map((o) => [o.getAttribute('value'), o.textContent]);
      expect(startWhen).toEqual([
        ['asap', s['home.044']],
        ['month1', s['home.045']],
        ['months1to3', s['home.046']],
        ['planning', s['home.047']],
      ]);
      expect(screen.getByRole('button', { name: s['home.048'] })).toHaveAttribute('type', 'submit');
      const wa = screen.getByRole('link', { name: s['home.049'] });
      expect(wa.getAttribute('href')).toMatch(
        new RegExp(`^https://wa\\.me/${bundle.settings.whatsappNumber}\\?text=`),
      );
      expect(screen.getByText(s['home.027'].replace('{homepageReplyHours}', '24'))).toBeInTheDocument();
    },
  );
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: the three new files fail to resolve `../forms`, `../HeroLeadForm`, `../HeroForm` (module not found); Cycle 1's files stay green.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_home/lib/forms.ts`:

```ts
import { z } from 'zod';
import type { SectorKey } from '@/content/collections';
import type { FormSpec } from '@/forms/action';
import { START_WHEN_KEYS, type StartWhenKey } from '@/forms/options';
import type { WireFields } from '@/forms/wire';

/**
 * The hero card's sector options (design: Factory / Agriculture / Tourism / Construction / Other)
 * — stable keys from the `sectors` collection's `SECTOR_KEYS` (W77). VALUES travel on the wire;
 * the LABELS are the package's own ids, resolved by the section (W115).
 */
export const HERO_SECTOR_KEYS = [
  'factory',
  'agriculture',
  'tourism',
  'construction',
  'other',
] as const satisfies readonly SectorKey[];
export type HeroSectorKey = (typeof HERO_SECTOR_KEYS)[number];
export const HERO_SECTOR_LABEL_IDS: Record<HeroSectorKey, string> = {
  factory: 'home.036',
  agriculture: 'home.037',
  tourism: 'home.038',
  construction: 'home.039',
  other: 'home.040',
};

/** W78: the one `startWhen` vocabulary. The design's Immediately / Within 1 month / 1–3 months /
 *  Just planning map one-to-one onto it, so the hero shows the package's own labels (W115). */
export const START_WHEN_LABEL_IDS: Record<StartWhenKey, string> = {
  asap: 'home.044',
  month1: 'home.045',
  months1to3: 'home.046',
  planning: 'home.047',
};

// A select posts '' until the visitor picks; anything else must be one of the keys ('invalid').
const sectorKey = z.union([z.literal(''), z.enum(HERO_SECTOR_KEYS)]).optional();
const startWhenKey = z.union([z.literal(''), z.enum(START_WHEN_KEYS)]).optional();

// `.min(1)` first so an empty value reads `required`, not `email`/`phone` (src/forms/errors.ts).
const name = z.string().trim().min(1).max(120);
const phone = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .regex(/(\D*\d){8,}/, { message: 'phone' });
const city = z.string().trim().max(120).optional();

/** Catalog `hire` (v1.0 + v1.1 `city`): the lengths are the door's own caps. */
export const hireSchema = z.object({
  company: z.string().trim().min(1).max(200),
  name,
  email: z.string().trim().min(1).max(254).email(),
  phone,
  sector: sectorKey,
  headcount: z
    .string()
    .trim()
    .min(1)
    .regex(/^[1-9]\d{0,9}$/, { message: 'invalid' }),
  city,
  startWhen: startWhenKey,
});
export type HireInput = z.infer<typeof hireSchema>;

/** The exact wire names (docs/INTEGRATIONS.md I4) — an unknown key would be dropped by the door
 *  with a 200. Empty optionals are omitted (buildEnvelope drops '' anyway). */
export function hireToFields(p: HireInput): WireFields {
  const fields: WireFields = {
    company: p.company,
    name: p.name,
    email: p.email,
    phone: p.phone,
    headcount: p.headcount,
  };
  if (p.sector) fields.sector = p.sector;
  if (p.city) fields.city = p.city;
  if (p.startWhen) fields.startWhen = p.startWhen;
  return fields;
}

export const hireSpec: FormSpec<typeof hireSchema> = {
  key: 'hire',
  schema: hireSchema,
  toFields: hireToFields,
  consent: 'checkbox', // W79
};

/** Catalog `callback`: `name*`, `phone*`, `topic` (free text ≤ 200 at the door — the sector key
 *  travels there, W77), `city` (v1.1). No `preferredTime`: the design's call-me-back mode has no
 *  such control, and the Contact page's callback owns that field's vocabulary. */
export const callbackSchema = z.object({ name, phone, topic: sectorKey, city });
export type CallbackInput = z.infer<typeof callbackSchema>;

export function callbackToFields(p: CallbackInput): WireFields {
  const fields: WireFields = { name: p.name, phone: p.phone };
  if (p.topic) fields.topic = p.topic;
  if (p.city) fields.city = p.city;
  return fields;
}

export const callbackSpec: FormSpec<typeof callbackSchema> = {
  key: 'callback',
  schema: callbackSchema,
  toFields: callbackToFields,
  consent: 'checkbox', // W79
};
```

`src/app/[locale]/(site)/_home/actions.ts`:

```ts
'use server';
import { createFormAction } from '@/forms/action';
import type { FormActionState } from '@/forms/types';
import { callbackSpec, hireSpec } from './lib/forms';

// createFormAction is a factory in a `server-only` module; a 'use server' module may export only
// async functions, so the two runners stay module-private (docs/ARCHITECTURE.md § Forms flow).
const runHire = createFormAction(hireSpec);
const runCallback = createFormAction(callbackSpec);

/** The hero card's proposal form → `hire` (success: /tesekkurler?form=hire, D13). */
export async function submitHire(prev: FormActionState, data: FormData): Promise<FormActionState> {
  return runHire(prev, data);
}

/** The phone-only call-me-back form → `callback` (success: /tesekkurler?form=callback). */
export async function submitCallback(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return runCallback(prev, data);
}
```

`src/app/[locale]/(site)/_home/components/HeroLeadForm.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { ClockIcon, PhoneIcon } from '@/design/chrome/icons';
// By module path (W147/W156): a barrel import would drag every client primitive into this chunk.
import { Button, buttonClassName } from '@/design/primitives/Button';
import { Field, type FieldOption } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import { LiveDot } from './LiveDot';

type Action = (prev: FormActionState, data: FormData) => Promise<FormActionState>;
type Mode = 'proposal' | 'callback';

export type HeroLeadFormProps = {
  locale: Locale;
  /** the page's 'use server' wrappers (`_home/actions.ts`) */
  actions: { hire: Action; callback: Action };
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  /** home.049's link: the FIXED hire prefill (`sys.home.whatsapp.hire`) — no visitor data, so it
   *  may sit in the href (W95 scopes the click-time rule to visitor-chosen data). */
  whatsappHref: string;
  contact: { phone: string; phoneDisplay: string; email: string };
  options: { sector: FieldOption[]; startWhen: FieldOption[] };
  /** every string resolved on the server: no `sys.home` reaches the client (W148) */
  copy: {
    title: string;
    titleMobile: string;
    badge: string;
    sub: string;
    openProposal: string;
    openCallback: string;
    callbackNote: string;
    labels: {
      company: string;
      name: string;
      phone: string;
      sector: string;
      headcount: string;
      city: string;
      startWhen: string;
    };
    submitHire: string;
    submitCallback: string;
    whatsapp: string;
  };
};

/** The first control a revealed form can take focus on (the honeypot is `tabIndex=-1`). */
const FIRST_FIELD = 'input:not([type="hidden"]):not([tabindex="-1"]), select, textarea';

/**
 * The hero's lead card (design id `proposal`, lines 381–422). Above 460 px the proposal form is
 * open and the design shows no mode buttons; at ≤ 460 px the card collapses behind "Get free
 * proposal" / "Ask us to call you" and the chosen mode opens (`.ja-form-open`) — the one
 * state-driven show/hide on the page, because the design removes the buttons once a mode is open
 * (W10's class rule still hides the body below xs until then). Proposal → `hire` with the door's
 * required `name` + `email` (W3) and optional `city` (W16); call me back → `callback`. Both use
 * the kernel's consent checkbox (W79) and fallback panel (D11). The id is the anchor the header
 * CTA and the launch sweep point at (CTA_BY_PATHNAME['/'], W17/W152).
 */
export function HeroLeadForm({
  locale,
  actions,
  turnstileSiteKey,
  whatsappNumber,
  whatsappHref,
  contact,
  options,
  copy,
}: HeroLeadFormProps) {
  const [mode, setMode] = useState<Mode>('proposal');
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  // D20: the mode buttons disappear once a mode is open, so focus moves to the revealed form's
  // first field instead of falling to <body> — only after the visitor's choice, never on mount.
  useEffect(() => {
    if (open) body.current?.querySelector<HTMLElement>(FIRST_FIELD)?.focus();
  }, [open, mode]);
  const choose = (next: Mode) => {
    setMode(next);
    setOpen(true);
  };
  const shell = { locale, turnstileSiteKey, whatsappNumber, contact, headingLevel: 3 as const };
  return (
    <div
      id="proposal"
      data-testid="hero-form"
      className="scroll-mt-[90px] rounded-hero bg-white px-[30px] pb-6 pt-7 text-ink shadow-hero-form max-xs:mt-1.5 max-xs:rounded-lg max-xs:px-[18px] max-xs:py-5 xl:px-[22.5px] xl:pb-[18px] xl:pt-[21px]"
    >
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[23px] tracking-[-0.8px] xl:text-[17.25px]">
          <span className="max-xs:hidden">{copy.title}</span>
          <span className="xs:hidden">{copy.titleMobile}</span>
        </h2>
        <span className="inline-flex shrink-0 items-center gap-[7px] whitespace-nowrap rounded-pill border border-success-border bg-success-surface px-3 py-1 text-[11.5px] font-extrabold text-success-text">
          <LiveDot />
          {copy.badge}
        </span>
      </div>
      <p className="m-0 mb-4 text-body-sm text-text-tertiary max-xs:mb-3.5 max-xs:text-[14px]">
        {copy.sub}
      </p>
      {open ? null : (
        <div className="flex flex-col gap-[9px] xs:hidden">
          <Button
            variant="primary"
            size="lg"
            onClick={() => choose('proposal')}
            aria-expanded={false}
            aria-controls="hero-form-body"
            data-testid="hero-mode-proposal"
          >
            {copy.openProposal}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => choose('callback')}
            aria-expanded={false}
            aria-controls="hero-form-body"
            data-testid="hero-mode-callback"
          >
            <PhoneIcon size={16} />
            {copy.openCallback}
          </Button>
        </div>
      )}
      <div id="hero-form-body" ref={body} className={open ? undefined : 'max-xs:hidden'}>
        {mode === 'proposal' ? (
          <FormShell
            key="hire"
            {...shell}
            action={actions.hire}
            formKey="hire"
            idScope="hero-hire"
            testId="hire-form"
            submitLabel={copy.submitHire}
          >
            <div className="grid gap-[11px] xs:grid-cols-2">
              <div className="xs:col-span-2">
                <Field
                  name="company"
                  label={copy.labels.company}
                  required
                  autoComplete="organization"
                />
              </div>
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field name="email" type="email" required autoComplete="email" inputMode="email" />
              <Field
                name="phone"
                type="tel"
                label={copy.labels.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                hint=""
              />
              {/* The design hides its optional fields at ≤ 460 px (`.ja-f-opt`, W10). */}
              <div className="max-xs:hidden">
                <Field
                  name="sector"
                  as="select"
                  label={copy.labels.sector}
                  options={options.sector}
                  hint=""
                />
              </div>
              <Field
                name="headcount"
                type="number"
                label={copy.labels.headcount}
                required
                min={1}
                inputMode="numeric"
              />
              <div className="max-xs:hidden">
                <Field
                  name="city"
                  label={copy.labels.city}
                  autoComplete="address-level2"
                  hint=""
                />
              </div>
              <div className="max-xs:hidden xs:col-span-2">
                <Field
                  name="startWhen"
                  as="select"
                  label={copy.labels.startWhen}
                  options={options.startWhen}
                  hint=""
                />
              </div>
            </div>
          </FormShell>
        ) : (
          <FormShell
            key="callback"
            {...shell}
            action={actions.callback}
            formKey="callback"
            idScope="hero-callback"
            testId="callback-form"
            submitLabel={copy.submitCallback}
          >
            <p className="m-0 flex items-start gap-2.5 rounded-xs border border-tint-border bg-tint px-3.5 py-[11px] text-[13px] font-bold leading-normal text-blue-safe">
              <ClockIcon size={15} className="mt-0.5 shrink-0" />
              {copy.callbackNote}
            </p>
            <div className="grid gap-[11px] xs:grid-cols-2">
              <Field name="name" label={copy.labels.name} required autoComplete="name" />
              <Field
                name="phone"
                type="tel"
                label={copy.labels.phone}
                required
                autoComplete="tel"
                inputMode="tel"
                hint=""
              />
              <div className="max-xs:hidden">
                <Field
                  name="topic"
                  as="select"
                  label={copy.labels.sector}
                  options={options.sector}
                  hint=""
                />
              </div>
              <div className="max-xs:hidden">
                <Field
                  name="city"
                  label={copy.labels.city}
                  autoComplete="address-level2"
                  hint=""
                />
              </div>
            </div>
          </FormShell>
        )}
        {/* A column flex item stretches: the link is full-width without a width class on it. */}
        <div className="mt-3 flex flex-col">
          <ContactLink
            href={whatsappHref}
            placement="page_cta"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClassName('success', 'md')}
          >
            <LiveDot />
            {copy.whatsapp}
          </ContactLink>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/sections/HeroForm.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { START_WHEN_KEYS } from '@/forms/options';
import { waLink } from '@/lib/contact';
import { HeroLeadForm, type HeroLeadFormProps } from '../components/HeroLeadForm';
import { HERO_SECTOR_KEYS, HERO_SECTOR_LABEL_IDS, START_WHEN_LABEL_IDS } from '../lib/forms';
import type { SectionProps } from './types';

/** Resolves the lead card's copy and options on the server (package ids through `makeTf`,
 *  `sys.*` here) and hands the client component plain strings — so neither `sys.home` nor the
 *  bundle reaches the browser for it (W148). */
export function HeroForm({
  locale,
  bundle,
  actions,
}: SectionProps & { actions: HeroLeadFormProps['actions'] }) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  return (
    <HeroLeadForm
      locale={locale}
      actions={actions}
      turnstileSiteKey={s.turnstileSiteKey}
      whatsappNumber={s.whatsappNumber}
      whatsappHref={waLink(s.whatsappNumber, sys('home.whatsapp.hire'))}
      contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
      options={{
        sector: HERO_SECTOR_KEYS.map((value) => ({
          value,
          label: tf(HERO_SECTOR_LABEL_IDS[value]),
        })),
        startWhen: START_WHEN_KEYS.map((value) => ({
          value,
          label: tf(START_WHEN_LABEL_IDS[value]),
        })),
      }}
      copy={{
        title: tf('home.025'),
        titleMobile: tf('home.026'),
        badge: tf('home.027'),
        sub: tf('home.028'),
        openProposal: tf('home.029'),
        openCallback: tf('home.030'),
        callbackNote: tf('home.031'),
        labels: {
          company: tf('home.032'),
          name: tf('home.033'),
          phone: tf('home.034'),
          sector: tf('home.035'),
          headcount: tf('home.041'),
          city: tf('home.042'),
          startWhen: tf('home.043'),
        },
        submitHire: tf('home.048'),
        submitCallback: sys('home.form.callbackSubmit'),
        whatsapp: tf('home.049'),
      }}
    />
  );
}
```

`src/app/[locale]/(site)/page.tsx` — two edits to the Cycle 1 file: add the imports

```tsx
import { submitCallback, submitHire } from './_home/actions';
import { HeroForm } from './_home/sections/HeroForm';
```

(keep the imports sorted: `./_home/actions` before `./_home/sections/…`, `HeroForm` after `Hero`), and replace the Cycle 1 comment + `<Hero … form={<div id="proposal" … />} />` line with:

```tsx
      <Hero
        {...section}
        form={<HeroForm {...section} actions={{ hire: submitHire, callback: submitCallback }} />}
      />
```

`docs/PRD.md` — two in-place edits (W45: anchor on the text, never a line number):
1. §2 table, the row whose second cell is `Homepage`: replace its last cell `Hero lead form (\`INQUIRY\`)` with (one table line; Prettier re-aligns the table):

```markdown
Hero lead form (`INQUIRY` via `hire` — the door's required contact `name` + `email` added, optional `city`, W3/W16; consent checkbox, W79) and its phone-only "call me back" mode (`CALLBACK` via `callback`: `name`, `phone`, sector as `topic`, `city`); success → `/tesekkurler?form=<key>` (D13), failure → the D11 fallback panel
```

2. §11, in the sentence that begins "**Not yet built, by design (WP2 and later):**", replace the parenthesis "(only the homepage and Hire Workers exist, both still spike-era placeholder content)" with "(the homepage is the first designed page — WP2b T1; Hire Workers is still the spike placeholder until T2)". T2 rewrites exactly the clause "Hire Workers is still the spike placeholder until T2" — keep that wording verbatim.

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/PRD.md 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `forms.test.ts` 12 green, `HeroLeadForm.test.tsx` 4, `hero-form.test.tsx` 2, Cycle 1 unchanged. Then the low-memory verify line (`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) → green, including `client-messages.test.ts` (the new client module reads no `sys.*`), `client-imports.test.ts` (by-path imports only), `class-collisions.test.ts` (the card, `<Button>` callers pass no colour/width class) and `rsc-imports.test.ts`.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' docs/PRD.md && git commit -m "feat(home): hero lead card — proposal → hire (name/email required, city, stable keys), phone-only call-me-back → callback (T1 c2)

W3/W16: the door's required fields are a design delta on the card; sector and startWhen post keys
(START_WHEN_KEYS, W77/W78) under the package's own labels (W115); consent checkbox on both (W79);
the #proposal anchor is the card itself (W17/W152). PRD §2 row 1 and the §11 page-state clause.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — The calculator teaser: the shared engine on the server, a lazy state-switching island (three presets × four chips)

**Why the island carries no engine.** The server runs `estimate()` → `formatEstimate()` for all twelve states (3 preset rows × chips 1/5/15/30) and hands the island the resolved views; the island only switches between them and fires `calculator_use`. One engine still produces every figure (W2), the island's chunk carries neither the engine nor next-intl, `sys.home` never reaches the client (W148), and the fallback the server renders is built from the same view, so the swap is DOM-identical.

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_home/lib/__tests__/teaser.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { presets } from '@/lib/calculator';
import { RATE, ROLES, role } from '@/lib/calculator/__tests__/fixtures';
// W142/W143: the teaser's figures are authored from COPY_DELTAS' MODEL column, never the
// design's sample; a test may read the authoring table, no module under src/ does (M18).
import { COPY_DELTAS } from '@/lib/calculator/copy-deltas';
import { formatTRY } from '@/lib/format/money';
import { teaserView, teaserViews, type TeaserLabels } from '../teaser';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, stateKey } from '../teaser-keys';

const labels: TeaserLabels = {
  grossMin: 'Brüt maaş (asgari ücret)',
  grossFloor: (m) => `Brüt maaş (${m} yasal taban)`,
  headcount: (n) => `${n} işçi`,
  estimate: (a) => `${a.role}|${a.headcount}|${a.monthly}|${a.oneOff}`,
};
const TEASER_ROW = COPY_DELTAS.find((r) => r.id === 'home.074 / home.082');

describe('teaserView (W2/W58/W142: one engine, exact floors, support off)', () => {
  it('General × 15 shows the COPY_DELTAS model figure (₺40,214), never the design sample', () => {
    expect(TEASER_ROW?.agrees).toBe(false);
    const v = teaserView({
      role: role('generalPreset'),
      roleLabel: 'Genel işçi',
      headcount: 15,
      rateConfig: RATE,
      locale: 'tr',
      labels,
    });
    expect(v.perWorker).toBe(formatTRY(TEASER_ROW!.model, 'tr'));
    expect(v.perWorker).toBe('40.214 ₺');
    expect(v.perWorker).not.toBe(formatTRY(TEASER_ROW!.design, 'tr'));
    expect(v.gross).toBe('33.030 ₺');
    expect(v.sgk).toBe('7.184 ₺');
    expect(v.monthly).toBe('603.210 ₺');
    expect(v.oneOff).toBe('420.000 ₺');
    expect(v.grossLabel).toBe('Brüt maaş (asgari ücret)');
    expect(v.headcountLabel).toBe('15 işçi');
    expect(v.whatsappText).toBe('Genel işçi|15|603.210 ₺|420.000 ₺');
  });

  it('Skilled × 30: the exact 1.5× floor (₺49,545, never ₺50,000) and the multiplier label', () => {
    const v = teaserView({
      role: role('skilledPreset'),
      roleLabel: 'Skilled',
      headcount: 30,
      rateConfig: RATE,
      locale: 'en',
      labels,
    });
    expect(v.gross).toBe('₺49,545');
    expect(v.perWorker).toBe('₺60,321');
    expect(v.monthly).toBe('₺1,809,631');
    expect(v.grossLabel).toBe('Brüt maaş (1.5× yasal taban)');
  });

  it('the bar shares are unrounded percentages; the legend reads whole percents (D18)', () => {
    const v = teaserView({
      role: role('generalPreset'),
      roleLabel: 'x',
      headcount: 1,
      rateConfig: RATE,
      locale: 'tr',
      labels,
    });
    expect(v.salaryPct).toBeCloseTo(82.135, 2);
    expect(v.sgkPct).toBeCloseTo(17.865, 2);
    expect(v.salaryPctLabel).toBe('%82');
    expect(v.sgkPctLabel).toBe('%18');
  });

  it('the WhatsApp text is plain text, never a URL (W95: the link composes it on click)', () => {
    const v = teaserView({
      role: role('generalPreset'),
      roleLabel: 'x',
      headcount: 5,
      rateConfig: RATE,
      locale: 'tr',
      labels,
    });
    expect(v.whatsappText).not.toMatch(/wa\.me|https?:/);
  });
});

describe('teaserViews', () => {
  it('precomputes the 3 presets × 4 chips the island switches between', () => {
    const roles = presets(ROLES).map((row) => ({ row, label: row.key }));
    const views = teaserViews({ roles, rateConfig: RATE, locale: 'tr', labels });
    expect(HEADCOUNT_PRESETS).toEqual([1, 5, 15, 30]);
    expect(DEFAULT_HEADCOUNT).toBe(15);
    expect(Object.keys(views)).toHaveLength(12);
    expect(views[stateKey('generalPreset', DEFAULT_HEADCOUNT)].monthly).toBe('603.210 ₺');
    expect(views[stateKey('specialistPreset', 30)].monthly).toBe('2.412.842 ₺');
  });
});
```

`src/app/[locale]/(site)/_home/components/__tests__/WhatsAppComposeLink.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waLink } from '@/lib/contact';
import { renderWithIntl } from '@/test/render';
import { WhatsAppComposeLink } from '../WhatsAppComposeLink';

const TEXT = 'Aylık bordro: 603.210 ₺';

beforeEach(() => {
  window.dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('WhatsAppComposeLink (W95/W76)', () => {
  it('renders the bare chat href — the visitor-chosen text never sits in the DOM', () => {
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text={TEXT}>
        Gönder
      </WhatsAppComposeLink>,
    );
    const link = screen.getByRole('link', { name: 'Gönder' });
    expect(link).toHaveAttribute('href', 'https://wa.me/905011240340');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.outerHTML).not.toContain('603');
  });

  it('composes the prefilled URL on click, opens it noopener and fires whatsapp_click (page_cta)', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text={TEXT}>
        Gönder
      </WhatsAppComposeLink>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Gönder' }));
    expect(open).toHaveBeenCalledWith(waLink('905011240340', TEXT), '_blank', 'noopener');
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'whatsapp_click',
      locale: 'tr',
      placement: 'page_cta',
    });
  });

  it('a middle click reaches the bare chat and still counts', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderWithIntl(
      <WhatsAppComposeLink number="905011240340" text={TEXT}>
        Gönder
      </WhatsAppComposeLink>,
    );
    fireEvent(
      screen.getByRole('link', { name: 'Gönder' }),
      new MouseEvent('auxclick', { bubbles: true, button: 1 }),
    );
    expect(open).not.toHaveBeenCalled();
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'whatsapp_click',
      placement: 'page_cta',
    });
  });
});
```

`src/app/[locale]/(site)/_home/components/__tests__/CalculatorTeaser.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { presets } from '@/lib/calculator';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import { renderWithIntl } from '@/test/render';
import { teaserViews, type TeaserLabels } from '../../lib/teaser';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS } from '../../lib/teaser-keys';
import { CalculatorTeaser, type CalculatorTeaserProps } from '../CalculatorTeaser';
import type { TeaserCardCopy } from '../TeaserCard';

const ROLE_LABEL: Record<string, string> = {
  generalPreset: 'Genel işçi',
  skilledPreset: 'Nitelikli / belgeli',
  specialistPreset: 'Uzman',
};
const labels: TeaserLabels = {
  grossMin: 'Brüt maaş (asgari ücret)',
  grossFloor: (m) => `Brüt maaş (${m} yasal taban)`,
  headcount: (n) => `${n} işçi`,
  estimate: (a) =>
    `Pozisyon: ${a.role}\nİşçi: ${a.headcount}\nAylık: ${a.monthly}\nTek seferlik: ${a.oneOff}`,
};
const roles = presets(ROLES).map((row) => ({ row, label: ROLE_LABEL[row.key] }));
const copy: TeaserCardCopy = {
  per: 'İşçi başına aylık',
  rates: '2026 oranları',
  sgk: 'SGK işveren payı · %21,75',
  support: 'Asgari ücret desteği',
  supportValue: 'Dahil değil — tam hesaplamada ayrıca gösterilir',
  total: 'İşçi başına işveren maliyeti',
  salaryPct: 'Maaş',
  sgkPct: 'SGK ve primler',
  monthlyPayroll: 'aylık bordro',
  oneOff: 'İlk yıl tek seferlik maliyetler',
  whatsapp: "Bu hesabı WhatsApp'tan gönderin",
  more: 'Maliyet dökümünü görün',
  less: 'Dökümü gizleyin',
  disc: 'Hesaplama 2026 asgari ücreti esas alınarak yapılmıştır.',
};
const props: CalculatorTeaserProps = {
  locale: 'tr',
  views: teaserViews({ roles, rateConfig: RATE, locale: 'tr', labels }),
  roles: roles.map(({ row, label }) => ({ key: row.key, label })),
  headcounts: HEADCOUNT_PRESETS.map((value) => ({ value, label: labels.headcount(value) })),
  initialRole: 'generalPreset',
  initialHeadcount: DEFAULT_HEADCOUNT,
  whatsappNumber: '905011240340',
  legends: { roles: 'Pozisyon seviyesi', headcount: 'Kaç işçi?' },
  copy,
  leftTop: <h2>Karar vermeden önce gerçek maliyeti görün</h2>,
  leftBottom: null,
  ctas: null,
};

beforeEach(() => {
  window.dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('CalculatorTeaser (the island)', () => {
  it('starts at General × 15 with the model figure and marks itself ready', () => {
    renderWithIntl(<CalculatorTeaser {...props} />);
    expect(screen.getByTestId('calc-teaser')).toHaveAttribute('data-island', 'ready');
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('40.214 ₺');
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('603.210 ₺');
    expect(screen.getByRole('radio', { name: 'Genel işçi' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '15 işçi' })).toBeChecked();
    expect(screen.getByText(copy.supportValue)).toBeInTheDocument();
  });

  it('a headcount chip recomputes and pushes calculator_use with the preset key (W12)', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: '30 işçi' }));
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('1.206.421 ₺');
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'calculator_use',
      page: '/',
      locale: 'tr',
      role: 'generalPreset',
      headcount: 30,
    });
  });

  it('a role chip moves the floor and the gross label', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: 'Nitelikli / belgeli' }));
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('60.321 ₺');
    expect(screen.getByText('Brüt maaş (1,5× yasal taban)')).toBeInTheDocument();
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'calculator_use',
      role: 'skilledPreset',
      headcount: 15,
    });
  });

  it('the ≤ 460 px breakdown toggle is a real disclosure over the rows', async () => {
    const user = userEvent.setup();
    renderWithIntl(<CalculatorTeaser {...props} />);
    const toggle = screen.getByRole('button', { name: 'Maliyet dökümünü görün' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'calc-rows');
    expect(document.getElementById('calc-rows')).toHaveClass('max-xs:hidden');
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Dökümü gizleyin' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(document.getElementById('calc-rows')).not.toHaveClass('max-xs:hidden');
  });

  it('the estimate link stays the bare chat; the current figures are composed on click (W95)', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderWithIntl(<CalculatorTeaser {...props} />);
    await user.click(screen.getByRole('radio', { name: '30 işçi' }));
    const link = screen.getByRole('link', { name: "Bu hesabı WhatsApp'tan gönderin" });
    expect(link).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(link);
    expect(decodeURIComponent(String(open.mock.calls[0]?.[0]))).toContain('Aylık: 1.206.421 ₺');
  });
});
```

`src/app/[locale]/(site)/_home/sections/__tests__/calculator.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle, withCollections } from '../../__tests__/fixtures';
import { CalculatorStrip } from '../CalculatorStrip';

const TR = homeBundle('tr');
const EN = homeBundle('en');

afterEach(() => {
  vi.useRealTimers();
});

describe('CalculatorStrip — the server fallback the island takes over', () => {
  it('renders General × 15 from the engine with the support stated separately (W58/W142)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-01T09:00:00Z'));
    renderWithIntl(<CalculatorStrip locale="tr" bundle={TR} />);
    // jsdom has no IntersectionObserver, so LazyIsland keeps the server fallback (no data-island)
    expect(screen.getByTestId('calc-teaser')).not.toHaveAttribute('data-island');
    expect(screen.getByTestId('calc-per-worker')).toHaveTextContent('40.214 ₺');
    expect(screen.getByTestId('calc-monthly')).toHaveTextContent('603.210 ₺');
    expect(screen.getByTestId('calc-oneoff')).toHaveTextContent('420.000 ₺');
    expect(screen.getByText(TR.strings['home.082'])).toBeInTheDocument();
    expect(screen.getByText('Dahil değil — tam hesaplamada ayrıca gösterilir')).toBeInTheDocument();
    // legal-flagged, verbatim (W142(b)) — the WP-C sheet carries the model figure beside it
    expect(screen.getByText(TR.strings['home.074'])).toBeInTheDocument();
    expect(screen.getByTestId('calc-rates-badge')).toHaveTextContent(TR.strings['home.079']);
    expect(screen.getByText(TR.strings['home.068'])).toBeInTheDocument();
  });

  it('from reviewDueAt the dated badge hides and the eyebrow drops the year (D17/W150)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-12-21T09:00:00Z'));
    renderWithIntl(<CalculatorStrip locale="en" bundle={EN} />, { locale: 'en' });
    expect(screen.queryByTestId('calc-rates-badge')).toBeNull();
    expect(screen.getByText('Real cost')).toBeInTheDocument();
    expect(screen.queryByText(EN.strings['home.068'])).toBeNull();
  });

  it('the fallback’s estimate link is the bare chat (W95)', () => {
    renderWithIntl(<CalculatorStrip locale="tr" bundle={TR} />);
    const hrefs = [
      ...screen.getByTestId('calc-teaser').querySelectorAll('a[href^="https://wa.me/"]'),
    ].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([`https://wa.me/${TR.settings.whatsappNumber}`]);
  });

  it('renders nothing without rate or preset rows (D17, Task 9 P8)', () => {
    const noRoles = renderWithIntl(
      <CalculatorStrip locale="tr" bundle={withCollections(TR, { calculatorRoles: [] })} />,
    );
    expect(noRoles.container).toBeEmptyDOMElement();
    noRoles.unmount();
    const noRates = renderWithIntl(
      <CalculatorStrip locale="tr" bundle={withCollections(TR, { rateConfig: [] })} />,
    );
    expect(noRates.container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: the four new files fail to resolve `../teaser`, `../WhatsAppComposeLink`, `../CalculatorTeaser`, `../CalculatorStrip`; Cycles 1–2 stay green.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_home/lib/teaser-keys.ts`:

```ts
/**
 * The client-safe half of the teaser model: the view shape and the state key. It imports nothing
 * — the island reads it, and the engine (`./teaser.ts`, server-side) must stay out of the
 * island's chunk: the views arrive precomputed from the server.
 */
export type TeaserView = {
  roleKey: string;
  headcount: number;
  /** home.080 at 1×, else sys.home.calc.grossFloor with the engine's `multiplierLabel` */
  grossLabel: string;
  gross: string;
  sgk: string;
  perWorker: string;
  /** unrounded percentages for the bar widths (0–100) */
  salaryPct: number;
  sgkPct: number;
  /** the legend's whole percents through formatPercent (D18) */
  salaryPctLabel: string;
  sgkPctLabel: string;
  headcountLabel: string;
  monthly: string;
  oneOff: string;
  /** sys.home.whatsapp.estimate over this state's figures — text only; the link composes the
   *  URL on click (W95) */
  whatsappText: string;
};

/** The design's headcount chips and default (UI presets, not rates). */
export const HEADCOUNT_PRESETS = [1, 5, 15, 30] as const;
export const DEFAULT_HEADCOUNT = 15;

export function stateKey(roleKey: string, headcount: number): string {
  return `${roleKey}:${headcount}`;
}
```

`src/app/[locale]/(site)/_home/lib/teaser.ts`:

```ts
import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { estimate, formatEstimate, multiplierLabel } from '@/lib/calculator';
import { HEADCOUNT_PRESETS, stateKey, type TeaserView } from './teaser-keys';

/** The translated pieces a view needs — the section passes closures over `useTranslations`; the
 *  model itself never touches next-intl (R23). */
export type TeaserLabels = {
  grossMin: string;
  grossFloor: (multiplier: string) => string;
  headcount: (n: number) => string;
  estimate: (args: { role: string; headcount: number; monthly: string; oneOff: string }) => string;
};

/**
 * One teaser state through the shared engine (W2): the exact floor (`legalMinGross ×
 * multiplier`, never rounded up), the default SGK tier, the minimum-wage support OFF (W58 — the
 * General figure is ₺40,214, COPY_DELTAS' model; the design's ₺38,944 applied the support), and
 * every figure formatted once at the edge (D18/W144).
 */
export function teaserView(input: {
  role: CalculatorRole;
  roleLabel: string;
  headcount: number;
  rateConfig: RateConfig;
  locale: Locale;
  labels: TeaserLabels;
}): TeaserView {
  const { role, roleLabel, rateConfig, locale, labels } = input;
  const est = estimate({ role, headcount: input.headcount, supportOptIn: false }, rateConfig);
  const f = formatEstimate(est, locale);
  const headcount = est.input.headcount;
  return {
    roleKey: role.key,
    headcount,
    grossLabel:
      role.multiplier === 1
        ? labels.grossMin
        : labels.grossFloor(multiplierLabel(role.multiplier, locale)),
    gross: f.perWorker.monthly.gross,
    sgk: f.perWorker.monthly.sgk,
    perWorker: f.perWorker.monthly.total,
    salaryPct: est.shares.salaryPct,
    sgkPct: est.shares.sgkPct,
    salaryPctLabel: f.shares.salaryPct,
    sgkPctLabel: f.shares.sgkPct,
    headcountLabel: labels.headcount(headcount),
    monthly: f.monthly.total,
    oneOff: f.oneOff.total,
    whatsappText: labels.estimate({
      role: roleLabel,
      headcount,
      monthly: f.monthly.total,
      oneOff: f.oneOff.total,
    }),
  };
}

/** Every (preset row × chip) state, keyed by `stateKey` — what the island switches between. */
export function teaserViews(input: {
  roles: { row: CalculatorRole; label: string }[];
  rateConfig: RateConfig;
  locale: Locale;
  labels: TeaserLabels;
}): Record<string, TeaserView> {
  const views: Record<string, TeaserView> = {};
  for (const { row, label } of input.roles)
    for (const headcount of HEADCOUNT_PRESETS)
      views[stateKey(row.key, headcount)] = teaserView({
        role: row,
        roleLabel: label,
        headcount,
        rateConfig: input.rateConfig,
        locale: input.locale,
        labels: input.labels,
      });
  return views;
}
```

`src/app/[locale]/(site)/_home/components/WhatsAppComposeLink.tsx`:

```tsx
'use client';
import type { MouseEvent, ReactNode } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { waLink } from '@/lib/contact';

/**
 * W95/W76 (D13): a WhatsApp CTA whose prefill carries what the visitor chose (the teaser's role,
 * headcount and figures). The DOM href is the bare chat, so neither GA4's outbound-click
 * measurement nor a GTM Click-URL trigger can read the prefill; the prefilled URL is composed on
 * click and opened `noopener` — the same contract as the forms kernel's fallback panel. A middle
 * click (no `click` event) reaches the bare chat and is still counted. Fires `whatsapp_click`
 * with `placement: 'page_cta'` like every page contact CTA (W12).
 */
export function WhatsAppComposeLink({
  number,
  text,
  className,
  children,
}: {
  number: string;
  text: string;
  className?: string;
  children: ReactNode;
}) {
  const fire = useContactClick('page_cta');
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    fire('whatsapp');
    e.preventDefault();
    window.open(waLink(number, text), '_blank', 'noopener');
  };
  const onAuxClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button === 1) fire('whatsapp');
  };
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      onAuxClick={onAuxClick}
      className={className}
    >
      {children}
    </a>
  );
}
```

`src/app/[locale]/(site)/_home/components/TeaserChips.tsx`:

```tsx
export type ChipOption = { value: string; label: string };

// W155 pattern: a colourless base plus exactly one of the colour sets below.
const CHIP =
  'inline-flex min-h-[44px] cursor-pointer items-center justify-center whitespace-nowrap rounded-pill border-[1.5px] px-[22px] text-[14px] font-extrabold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe max-xs:whitespace-normal max-xs:px-3 max-xs:text-[13.5px] max-xs:leading-tight xl:px-[16.5px] xl:text-[11px]';
const ON = {
  blue: 'border-blue-safe bg-blue-safe text-white',
  ink: 'border-ink bg-ink text-white',
} as const;
const OFF = 'border-border-1 bg-white text-[#43536a] hover:bg-pale-1';

/**
 * The teaser's chip rows as native radios in a fieldset (arrow keys move within a row, the legend
 * names it) — the page-local stand-in for `RadioChips`, whose required `onChange` cannot render
 * the static server fallback (accepted as page-local in the reconcile rulings). Without
 * `onChange` the radios are read-only: the fallback's state until the island takes over. At
 * ≤ 460 px the row is the design's two-column grid (`.ja-calc-chips`), the last role chip
 * spanning both columns (`spanLast`). No directive: the server section and the island share it.
 */
export function TeaserChips({
  name,
  legend,
  options,
  value,
  onChange,
  emphasis = 'blue',
  spanLast = false,
}: {
  name: string;
  legend: string;
  options: ChipOption[];
  value: string;
  onChange?: (value: string) => void;
  emphasis?: keyof typeof ON;
  spanLast?: boolean;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2.5 p-0 text-[12px] font-extrabold uppercase tracking-[1.2px] text-text-secondary">
        {legend}
      </legend>
      <div className="grid grid-cols-2 gap-2 xs:flex xs:flex-wrap xs:gap-[9px]">
        {options.map((option, i) => {
          const selected = option.value === value;
          const id = `${name}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={[
                CHIP,
                selected ? ON[emphasis] : OFF,
                spanLast && i === options.length - 1 ? 'max-xs:col-span-2' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                readOnly={!onChange}
                onChange={onChange ? () => onChange(option.value) : undefined}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
```

`src/app/[locale]/(site)/_home/components/TeaserCard.tsx`:

```tsx
import type { ReactNode } from 'react';
import { buttonClassName } from '@/design/primitives/Button';
import type { TeaserView } from '../lib/teaser-keys';

/** The estimate link's face: the design's green WhatsApp outline is the `success` variant (W127). */
export const TEASER_WA_CLASS = buttonClassName('success', 'md');
/** The rows the ≤ 460 px disclosure controls. */
export const TEASER_ROWS_ID = 'calc-rows';

export type TeaserCardCopy = {
  per: string;
  /** home.079 while the rate config is in review; null from `reviewDueAt` (D17/W150) */
  rates: string | null;
  sgk: string;
  support: string;
  supportValue: string;
  total: string;
  salaryPct: string;
  sgkPct: string;
  monthlyPayroll: string;
  oneOff: string;
  whatsapp: string;
  more: string;
  less: string;
  disc: string;
};

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[7px]">
      <span className="text-body-sm text-text-secondary">{label}</span>
      <span
        className={
          muted
            ? 'text-right text-body-sm font-bold text-text-secondary'
            : 'whitespace-nowrap text-body-sm font-extrabold text-ink'
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * The design's cost card (lines 562–611). `expanded`/`onToggle` drive the ≤ 460 px "See cost
 * breakdown" disclosure; from `xs` up the rows always show (W10). `whatsapp` is the estimate link
 * — `ContactLink` with the bare href in the server fallback, `WhatsAppComposeLink` in the island
 * (both render the same anchor, W95). `ctas` = the phone-only calculator/permits pair. No
 * directive: the server fallback and the island share it.
 */
export function TeaserCard({
  view,
  copy,
  expanded,
  onToggle,
  ctas,
  whatsapp,
}: {
  view: TeaserView;
  copy: TeaserCardCopy;
  expanded: boolean;
  onToggle?: () => void;
  ctas: ReactNode;
  whatsapp: ReactNode;
}) {
  const rows = expanded ? undefined : 'max-xs:hidden';
  return (
    <div className="overflow-hidden rounded-hero border border-border-1 bg-white shadow-[0_22px_50px_rgba(22,60,90,0.10)] max-xs:rounded-xl">
      <div className="border-b border-dashed border-border-4 px-7 pb-[18px] pt-6 max-xs:px-5 max-xs:pb-4 max-xs:pt-[18px] xl:px-[21px] xl:pt-[18px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1.1px] text-text-tertiary">
            {copy.per}
          </span>
          {copy.rates ? (
            <span
              data-testid="calc-rates-badge"
              className="inline-flex items-center whitespace-nowrap rounded-pill border border-success-border bg-success-surface px-3 py-1 text-[11px] font-extrabold text-success-text"
            >
              {copy.rates}
            </span>
          ) : null}
        </div>
        <div id={TEASER_ROWS_ID} className={rows}>
          <Row label={view.grossLabel} value={view.gross} />
          <Row label={copy.sgk} value={view.sgk} />
          <Row label={copy.support} value={copy.supportValue} muted />
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-border-3 pb-0.5 pt-3">
          <span className="text-body-sm font-extrabold text-ink">{copy.total}</span>
          <span
            data-testid="calc-per-worker"
            className="whitespace-nowrap text-body font-extrabold text-blue-safe"
          >
            {view.perWorker}
          </span>
        </div>
        <div className={rows}>
          <div aria-hidden="true" className="mt-3.5 flex h-2.5 overflow-hidden rounded-pill bg-border-3">
            <span className="block h-full bg-blue" style={{ width: `${view.salaryPct}%` }} />
            <span className="block h-full bg-[#16294f]" style={{ width: `${view.sgkPct}%` }} />
          </div>
          <div className="mt-[9px] flex flex-wrap items-center gap-4 text-[11.5px] font-bold text-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rounded-[3px] bg-blue" />
              {copy.salaryPct} {view.salaryPctLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-[9px] w-[9px] rounded-[3px] bg-[#16294f]"
              />
              {copy.sgkPct} {view.sgkPctLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={TEASER_ROWS_ID}
          onClick={onToggle}
          className="mt-3 flex min-h-[44px] w-full items-center gap-2 text-left text-[13px] font-extrabold text-blue-safe xs:hidden"
        >
          {expanded ? copy.less : copy.more}
        </button>
      </div>
      <div className="bg-[#f7fbfd] px-7 pb-6 pt-5 max-xs:px-5 xl:px-[21px]">
        <div className="mb-3.5 flex items-baseline justify-between gap-3">
          <span className="text-body-sm font-extrabold text-text-secondary">
            {view.headcountLabel} · {copy.monthlyPayroll}
          </span>
          <span
            data-testid="calc-monthly"
            className="whitespace-nowrap font-display text-[clamp(24px,2.4vw,30px)] font-extrabold leading-none tracking-[-1.2px] text-ink max-xs:text-[30px] xl:text-[clamp(18px,1.8vw,22.5px)]"
          >
            {view.monthly}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border-4 pt-[13px] max-xs:flex-col max-xs:items-start max-xs:gap-[3px]">
          <span className="text-body-sm font-bold text-text-secondary">{copy.oneOff}</span>
          <span data-testid="calc-oneoff" className="whitespace-nowrap text-body font-extrabold text-ink">
            {view.oneOff}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-border-3 bg-white px-7 pb-5 pt-[13px] max-xs:px-5 xl:px-[21px]">
        {whatsapp}
        <div className="flex flex-col gap-2.5 xs:hidden">{ctas}</div>
        <p className="m-0 text-[12px] font-semibold leading-normal text-text-tertiary">{copy.disc}</p>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/components/TeaserLayout.tsx`:

```tsx
import type { ReactNode } from 'react';

/** The strip's two columns (design `.ja-grid2`: 1fr / 0.85fr from 901 px). `leftTop`/`leftBottom`
 *  are server-rendered copy passed through as nodes; `chips` and `card` come from whichever
 *  renderer owns the state (the server fallback or the island). `ready` marks the mounted
 *  island for the page e2e. */
export function TeaserLayout({
  leftTop,
  chips,
  leftBottom,
  card,
  ready = false,
}: {
  leftTop: ReactNode;
  chips: ReactNode;
  leftBottom: ReactNode;
  card: ReactNode;
  ready?: boolean;
}) {
  return (
    <div
      data-testid="calc-teaser"
      data-island={ready ? 'ready' : undefined}
      className="grid items-center gap-[34px] lg:grid-cols-[1fr_0.85fr] lg:gap-14 xl:gap-[42px]"
    >
      <div className="min-w-0">
        {leftTop}
        <div className="mb-6 flex flex-col gap-[22px]">{chips}</div>
        {leftBottom}
      </div>
      <div className="min-w-0">{card}</div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/components/CalculatorTeaser.tsx`:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import type { Locale } from '@/i18n/routing';
import { stateKey, type TeaserView } from '../lib/teaser-keys';
import { LiveDot } from './LiveDot';
import { TEASER_WA_CLASS, TeaserCard, type TeaserCardCopy } from './TeaserCard';
import { TeaserChips } from './TeaserChips';
import { TeaserLayout } from './TeaserLayout';
import { WhatsAppComposeLink } from './WhatsAppComposeLink';

export type CalculatorTeaserProps = {
  locale: Locale;
  /** every (preset × chip) state, computed on the server by the one engine (W2) */
  views: Record<string, TeaserView>;
  roles: { key: string; label: string }[];
  headcounts: { value: number; label: string }[];
  initialRole: string;
  initialHeadcount: number;
  whatsappNumber: string;
  legends: { roles: string; headcount: string };
  copy: TeaserCardCopy;
  leftTop: ReactNode;
  leftBottom: ReactNode;
  ctas: ReactNode;
};

/**
 * The interactive teaser: two chip rows switching between precomputed views, the ≤ 460 px
 * breakdown disclosure, the click-time estimate link. Its first render equals the server
 * fallback (same components, same default view), so the LazyIsland swap never shifts layout.
 */
export function CalculatorTeaser(props: CalculatorTeaserProps) {
  const { locale, views, roles, headcounts, whatsappNumber, legends, copy } = props;
  // R35: the real URL, not next-intl's internal key.
  const page = usePathname() ?? '/';
  const [role, setRole] = useState(props.initialRole);
  const [headcount, setHeadcount] = useState(props.initialHeadcount);
  const [expanded, setExpanded] = useState(false);
  const view =
    views[stateKey(role, headcount)] ?? views[stateKey(props.initialRole, props.initialHeadcount)];
  // W12: enum-like params only — the preset row key and the chip's number, never free text.
  const fire = (nextRole: string, nextHeadcount: number) =>
    track('calculator_use', { page, locale, role: nextRole, headcount: nextHeadcount });
  return (
    <TeaserLayout
      ready
      leftTop={props.leftTop}
      leftBottom={props.leftBottom}
      chips={
        <>
          <TeaserChips
            name="teaser-role"
            legend={legends.roles}
            options={roles.map((r) => ({ value: r.key, label: r.label }))}
            value={role}
            spanLast
            onChange={(next) => {
              setRole(next);
              fire(next, headcount);
            }}
          />
          <TeaserChips
            name="teaser-headcount"
            legend={legends.headcount}
            emphasis="ink"
            options={headcounts.map((h) => ({ value: String(h.value), label: h.label }))}
            value={String(headcount)}
            onChange={(next) => {
              const n = Number(next);
              setHeadcount(n);
              fire(role, n);
            }}
          />
        </>
      }
      card={
        <TeaserCard
          view={view}
          copy={copy}
          expanded={expanded}
          onToggle={() => setExpanded((open) => !open)}
          ctas={props.ctas}
          whatsapp={
            <WhatsAppComposeLink
              number={whatsappNumber}
              text={view.whatsappText}
              className={TEASER_WA_CLASS}
            >
              <LiveDot />
              {copy.whatsapp}
            </WhatsAppComposeLink>
          }
        />
      }
    />
  );
}
```

`src/app/[locale]/(site)/_home/components/CalculatorTeaserIsland.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { CalculatorTeaserProps } from './CalculatorTeaser';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives in this
// thin client module; the type-only import keeps the island itself out of this eager chunk.
const load = () => import('./CalculatorTeaser').then((m) => ({ default: m.CalculatorTeaser }));

/** W13 amended / W132: the teaser's chunk loads once its wrapper comes within 200 px of the
 *  viewport and stays mounted; until then (and for good if the chunk fails) the server fallback
 *  shows — DOM-identical to the island's first render. */
export function CalculatorTeaserIsland({
  fallback,
  ...props
}: CalculatorTeaserProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} />;
}
```

`src/app/[locale]/(site)/_home/sections/CalculatorStrip.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { CheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { isReviewDue, presets } from '@/lib/calculator';
import { CalculatorTeaserIsland } from '../components/CalculatorTeaserIsland';
import { LiveDot } from '../components/LiveDot';
import { TEASER_WA_CLASS, TeaserCard, type TeaserCardCopy } from '../components/TeaserCard';
import { TeaserChips } from '../components/TeaserChips';
import { TeaserLayout } from '../components/TeaserLayout';
import { teaserViews, type TeaserLabels } from '../lib/teaser';
import { DEFAULT_HEADCOUNT, HEADCOUNT_PRESETS, stateKey } from '../lib/teaser-keys';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

/**
 * "Real cost, 2026 rates" (design lines 529–613). Every figure is the shared engine's over the
 * bundle's `rateConfig` and the three `preset: true` role rows (W2), support off (W58);
 * `home.074`/`082` stay verbatim and the support row's value says the support is shown
 * separately (`sys.home.calc.supportSeparate`, W142(b)). The dated eyebrow/badge (home.068/079)
 * render while the config is in review and switch at `reviewDueAt` (D17) — the page revalidates
 * daily for it (W150). The server renders the default state as the LazyIsland fallback.
 */
export function CalculatorStrip({ locale, bundle }: SectionProps) {
  const sys = useTranslations('sys');
  const rateConfig = getCollection(bundle, 'rateConfig')[0];
  const roles = presets(getCollection(bundle, 'calculatorRoles'));
  // D17: no rates, no numbers — and Task 9 P8: no preset rows, no chips. The homepage keeps
  // rendering either way (`getRateConfig` would throw in every environment).
  if (!rateConfig || roles.length === 0) return null;
  const tf = makeTf(bundle, locale);
  const number = bundle.settings.whatsappNumber;
  const reviewDue = isReviewDue(rateConfig);
  const roleOptions = roles.map((row) => ({ row, label: tf(row.labelId) }));
  const labels: TeaserLabels = {
    grossMin: tf('home.080'),
    grossFloor: (multiplier) => sys('home.calc.grossFloor', { multiplier }),
    headcount: (n) => sys('home.calc.headcount', { n }),
    estimate: (args) => sys('home.whatsapp.estimate', args),
  };
  const views = teaserViews({ roles: roleOptions, rateConfig, locale, labels });
  const initialRole = roles[0].key;
  const chipRoles = roleOptions.map(({ row, label }) => ({ key: row.key, label }));
  const headcounts = HEADCOUNT_PRESETS.map((value) => ({ value, label: labels.headcount(value) }));
  const legends = { roles: tf('home.072'), headcount: tf('home.073') };
  const copy: TeaserCardCopy = {
    per: tf('home.078'),
    rates: reviewDue ? null : tf('home.079'),
    sgk: tf('home.081'),
    support: tf('home.082'),
    supportValue: sys('home.calc.supportSeparate'),
    total: tf('home.083'),
    salaryPct: tf('home.084'),
    sgkPct: tf('home.085'),
    monthlyPayroll: sys('home.calc.monthlyPayroll'),
    oneOff: tf('home.086'),
    whatsapp: tf('home.087'),
    more: tf('home.088'),
    less: tf('home.089'),
    disc: tf('home.090'),
  };
  const leftTop = (
    <>
      <Eyebrow>{reviewDue ? sys('home.calc.eyebrowUndated') : tf('home.068')}</Eyebrow>
      <h2 className={`${H2} mb-4 mt-3.5`}>{tf('home.069')}</h2>
      <p className={`${LEAD} mb-6 max-w-[520px] xl:max-w-[390px]`}>
        {tf('home.070')}
        <span className="max-xs:hidden"> {tf('home.071')}</span>
      </p>
    </>
  );
  const leftBottom = (
    <>
      <ul className="m-0 mb-[26px] flex list-none flex-col gap-[9px] p-0 max-xs:hidden">
        {(['home.074', 'home.075'] as const).map((id) => (
          <li
            key={id}
            className="flex items-start gap-[11px] text-body-sm font-bold leading-normal text-[#43536a]"
          >
            <CheckIcon size={14} className="mt-[3px] shrink-0 text-success-text" />
            {tf(id)}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 max-xs:hidden">
        <Button variant="nav" href="/hiring-cost-calculator">
          {tf('home.076')}
        </Button>
        <Button variant="secondary" href="/work-permit">
          {tf('home.077')}
        </Button>
      </div>
    </>
  );
  // The phone-only pair inside the card (`.ja-calc-cta-mobile`).
  const ctas = (
    <>
      <Button variant="nav" href="/hiring-cost-calculator">
        {tf('home.076')}
      </Button>
      <Button variant="secondary" href="/work-permit">
        {tf('home.077')}
      </Button>
    </>
  );
  const fallback = (
    <TeaserLayout
      leftTop={leftTop}
      leftBottom={leftBottom}
      chips={
        <>
          <TeaserChips
            name="teaser-role"
            legend={legends.roles}
            options={chipRoles.map((r) => ({ value: r.key, label: r.label }))}
            value={initialRole}
            spanLast
          />
          <TeaserChips
            name="teaser-headcount"
            legend={legends.headcount}
            emphasis="ink"
            options={headcounts.map((h) => ({ value: String(h.value), label: h.label }))}
            value={String(DEFAULT_HEADCOUNT)}
          />
        </>
      }
      card={
        <TeaserCard
          view={views[stateKey(initialRole, DEFAULT_HEADCOUNT)]}
          copy={copy}
          expanded={false}
          ctas={ctas}
          whatsapp={
            // The same bare anchor the island's WhatsAppComposeLink renders (W95).
            <ContactLink
              href={`https://wa.me/${number}`}
              placement="page_cta"
              target="_blank"
              rel="noopener noreferrer"
              className={TEASER_WA_CLASS}
            >
              <LiveDot />
              {copy.whatsapp}
            </ContactLink>
          }
        />
      }
    />
  );
  return (
    <Section tone="pale" id="cost" className="border-y border-border-2">
      <div className="container-site">
        <CalculatorTeaserIsland
          fallback={fallback}
          locale={locale}
          views={views}
          roles={chipRoles}
          headcounts={headcounts}
          initialRole={initialRole}
          initialHeadcount={DEFAULT_HEADCOUNT}
          whatsappNumber={number}
          legends={legends}
          copy={copy}
          leftTop={leftTop}
          leftBottom={leftBottom}
          ctas={ctas}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — add `import { CalculatorStrip } from './_home/sections/CalculatorStrip';` (sorted first among the section imports) and render `<CalculatorStrip {...section} />` directly after `<PoolSection {...section} />`.

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `teaser.test.ts` 5, `WhatsAppComposeLink.test.tsx` 3, `CalculatorTeaser.test.tsx` 5, `calculator.test.tsx` 4 green; earlier files unchanged. Then the low-memory verify line → green, including `src/lib/calculator/__tests__/purity.test.ts` (no module under `src/` imports `copy-deltas.ts` — only this task's test files do, which the guard excludes), `client-messages.test.ts` (`CalculatorTeaser`, `CalculatorTeaserIsland`, `WhatsAppComposeLink` read no `sys.*`), `rsc-imports.test.ts` (`LazyIsland` by path, W134), `class-collisions.test.ts` (the chip colour sets, `buttonClassName('success','md')`, `<Button variant="nav|secondary">` without classes).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && git commit -m "feat(home): calculator teaser — shared engine on the server, lazy state-switching island, click-time estimate link (T1 c3)

W2/W58/W142: twelve views (3 presets x 4 chips) from estimate/formatEstimate, support off (General
40,214 = COPY_DELTAS model), home.074/082 verbatim + sys.home.calc.supportSeparate; the dated
badge/eyebrow switch at reviewDueAt (D17/W150); LazyIsland by path through a client binder, no
engine or next-intl in the island chunk (W13/W132/W148); estimate prefill composed on click (W95);
calculator_use with the preset key (W12).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — The process timeline (`ProcessSteps`, plain) and the season planner (lazy island; the month is a browser fact)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_home/lib/__tests__/season.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  monthNames,
  nowMarkerLeft,
  SEASON_ROWS,
  seasonHeadline,
  seasonRange,
  signByMonth,
  type SeasonTx,
} from '../season';

const tx: SeasonTx = {
  range: ({ from, to }) => `Peak ${from}–${to}`,
  also: ({ from, to }) => ` · also ${from}–${to}`,
  signBy: ({ start, signBy }) => `To start in ${start}, sign by ${signBy}`,
  noPeak: () => 'No peak season — but permits still take 45 days',
};

describe("SEASON_ROWS — the design's four rows (months are data, copy is package ids)", () => {
  it("carries the design's ranges and ids", () => {
    expect(SEASON_ROWS.map((r) => r.key)).toEqual([
      'agriculture',
      'tourism',
      'construction',
      'factory',
    ]);
    expect(SEASON_ROWS[0]).toMatchObject({
      nameId: 'home.243',
      subId: null,
      noteId: 'home.250',
      peak: [8, 11],
      second: [2, 4],
      start: 8,
    });
    expect(SEASON_ROWS[1]).toMatchObject({
      nameId: 'home.247',
      subId: 'home.244',
      noteId: 'home.251',
      peak: [3, 9],
      second: [10, 11],
      start: 3,
    });
    expect(SEASON_ROWS[2]).toMatchObject({
      nameId: 'home.248',
      subId: 'home.245',
      noteId: 'home.252',
      peak: [2, 10],
      second: null,
      start: 2,
    });
    expect(SEASON_ROWS[3]).toMatchObject({
      nameId: 'home.249',
      subId: 'home.246',
      noteId: 'home.253',
      peak: [0, 11],
      second: null,
      start: null,
    });
  });
});

describe('month names come from Intl, never a hard-coded list', () => {
  it('TR short and long', () => {
    expect(monthNames('tr', 'short')).toEqual([
      'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
    ]);
    expect(monthNames('tr', 'long')[8]).toBe('Eylül');
  });

  it('EN short is the design\'s three letters ("Sep", not en-GB\'s "Sept")', () => {
    expect(monthNames('en', 'short')).toEqual([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]);
    expect(monthNames('en', 'long')[0]).toBe('January');
  });
});

describe('composition', () => {
  const short = monthNames('en', 'short');
  const long = monthNames('en', 'long');

  it("sign-by is two months before the start, wrapping the year (the design's backTwo)", () => {
    expect(signByMonth(8)).toBe(6);
    expect(signByMonth(0)).toBe(10);
    expect(signByMonth(1)).toBe(11);
  });

  it('the range text: the peak, plus the secondary season when there is one', () => {
    expect(seasonRange(SEASON_ROWS[0], short, tx)).toBe('Peak Sep–Dec · also Mar–May');
    expect(seasonRange(SEASON_ROWS[2], short, tx)).toBe('Peak Mar–Nov');
  });

  it('the headline: sign-by for a dated start, the no-peak line for the year-round row', () => {
    expect(seasonHeadline(SEASON_ROWS[0], long, tx)).toBe('To start in September, sign by July');
    expect(seasonHeadline(SEASON_ROWS[1], long, tx)).toBe('To start in April, sign by February');
    expect(seasonHeadline(SEASON_ROWS[3], long, tx)).toBe(
      'No peak season — but permits still take 45 days',
    );
  });

  it('the "this month" line sits mid-column', () => {
    expect(nowMarkerLeft(0)).toBe('4.17%');
    expect(nowMarkerLeft(11)).toBe('95.83%');
  });
});
```

`src/app/[locale]/(site)/_home/components/__tests__/SeasonPlanner.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { SeasonPlanner, type SeasonPlannerProps } from '../SeasonPlanner';

const props: SeasonPlannerProps = {
  heading: <h2>When to start</h2>,
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nowPrefix: 'Now:',
  rows: [
    {
      key: 'agriculture',
      name: 'Agriculture & greenhouse',
      sub: 'Antalya, Mersin, Konya',
      note: 'Greenhouse note',
      range: 'Peak Sep–Dec · also Mar–May',
      headline: 'To start in September, sign by July',
      peak: [8, 11],
      second: [2, 4],
    },
    {
      key: 'tourism',
      name: 'Tourism & hospitality',
      sub: 'Coastal hotels and resorts',
      note: 'Tourism note',
      range: 'Peak Apr–Oct · also Nov–Dec',
      headline: 'To start in April, sign by February',
      peak: [3, 9],
      second: [10, 11],
    },
  ],
  copy: {
    gridLabel: 'Seasonal demand by month',
    hint: 'Select a row',
    legend: { peak: 'Peak demand', second: 'Secondary season', now: 'This month' },
    cta: 'Start this group →',
  },
};

afterEach(() => {
  vi.useRealTimers();
});

describe('SeasonPlanner (the island)', () => {
  it('shows this month as a browser fact — the pill and one marker per row (R18)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 8, 15, 12));
    const { container } = renderWithIntl(<SeasonPlanner {...props} />, { locale: 'en' });
    expect(screen.getByTestId('season-planner')).toHaveAttribute('data-island', 'ready');
    expect(screen.getByText('Now: Sep 2026')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-now-marker]')).toHaveLength(2);
  });

  it('a row click selects it and answers with its headline and note', async () => {
    const user = userEvent.setup();
    renderWithIntl(<SeasonPlanner {...props} />, { locale: 'en' });
    expect(screen.getByTestId('season-row-agriculture')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('season-headline')).toHaveTextContent(
      'To start in September, sign by July',
    );
    await user.click(screen.getByTestId('season-row-tourism'));
    expect(screen.getByTestId('season-row-tourism')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('season-row-agriculture')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('season-headline')).toHaveTextContent(
      'To start in April, sign by February',
    );
    expect(screen.getByText('Tourism note')).toBeInTheDocument();
  });
});
```

`src/app/[locale]/(site)/_home/sections/__tests__/process-season.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { homeBundle } from '../../__tests__/fixtures';
import { ProcessSection } from '../ProcessSection';
import { SeasonSection } from '../SeasonSection';

const TR = homeBundle('tr');
const EN = homeBundle('en');

describe('ProcessSection', () => {
  it('renders the five plain steps (the reply-hours metric filled) and the four sector chips', () => {
    renderWithIntl(<ProcessSection locale="tr" bundle={TR} />);
    const process = screen.getByTestId('process');
    expect(process.querySelectorAll('ol > li')).toHaveLength(5);
    expect(within(process).getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(process).toHaveTextContent('24 saat');
    const chips = within(process)
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === '/isci-talebi');
    expect(chips).toHaveLength(4);
    expect(chips[0].parentElement).toHaveClass('max-xs:hidden');
  });
});

describe('SeasonSection — the server fallback', () => {
  it('renders the four rows, row 1 selected, with no "now" (a browser fact, R18)', () => {
    const { container } = renderWithIntl(<SeasonSection locale="tr" bundle={TR} />);
    expect(screen.getByTestId('season-planner')).not.toHaveAttribute('data-island');
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(1);
    expect(screen.getByTestId('season-row-agriculture')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('season-row-agriculture')).toHaveTextContent(
      'Antalya, Mersin, Konya',
    );
    expect(screen.getByTestId('season-headline')).toHaveTextContent(
      'Eylül ayında başlamak için Temmuz ayına kadar imzalayın',
    );
    expect(container.querySelector('[data-now-marker]')).toBeNull();
  });

  it('composes the ranges from Intl month names (EN)', () => {
    renderWithIntl(<SeasonSection locale="en" bundle={EN} />, { locale: 'en' });
    expect(screen.getByTestId('season-row-construction')).toHaveTextContent('Peak Mar–Nov');
    expect(screen.getByTestId('season-row-factory')).toHaveTextContent('Peak Jan–Dec');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: the three new files fail to resolve `../season`, `../SeasonPlanner`, `../ProcessSection` / `../SeasonSection`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_home/lib/season.ts`:

```ts
import type { Locale } from '@/i18n/routing';

export type SeasonKey = 'agriculture' | 'tourism' | 'construction' | 'factory';

export type SeasonRow = {
  key: SeasonKey;
  nameId: string;
  /** null = the agriculture row's place list, which has no package id (sys.home.season.agricultureSub) */
  subId: string | null;
  noteId: string;
  /** 0-based months, inclusive */
  peak: readonly [number, number];
  second: readonly [number, number] | null;
  /** 0-based start month; null for the year-round row (its headline is the no-peak line) */
  start: number | null;
};

/** The design's SEASONS table (JobsAdmire Homepage v4, renderVals). The month numbers are data;
 *  every visible string is a package id the section resolves. */
export const SEASON_ROWS: readonly SeasonRow[] = [
  { key: 'agriculture', nameId: 'home.243', subId: null, noteId: 'home.250', peak: [8, 11], second: [2, 4], start: 8 },
  { key: 'tourism', nameId: 'home.247', subId: 'home.244', noteId: 'home.251', peak: [3, 9], second: [10, 11], start: 3 },
  { key: 'construction', nameId: 'home.248', subId: 'home.245', noteId: 'home.252', peak: [2, 10], second: null, start: 2 },
  { key: 'factory', nameId: 'home.249', subId: 'home.246', noteId: 'home.253', peak: [0, 11], second: null, start: null },
];

/** The design's `backTwo`: sign two months before the start month, wrapping the year. */
export function signByMonth(start: number): number {
  return (start + 10) % 12;
}

// 'en' (en-US), not the repo's en-GB date locale: en-GB abbreviates September as "Sept" since
// ICU 72, while the design's column header says "Sep".
const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en' };

/** Twelve month names from Intl (W9: never a hard-coded list) — 'short' for the grid header and
 *  the ranges, 'long' for the headline; mid-month UTC dates so no zone can shift a month. The
 *  server computes them and hands them to the island, so client and server never disagree. */
export function monthNames(locale: Locale, style: 'short' | 'long'): string[] {
  const format = new Intl.DateTimeFormat(INTL[locale], { month: style, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, m) => format.format(new Date(Date.UTC(2026, m, 15))));
}

/** The green "this month" line, centred in its column of twelve. */
export function nowMarkerLeft(month: number): string {
  return `${((month + 0.5) * (100 / 12)).toFixed(2)}%`;
}

/** The translator surface (sys ICU strings) — the section passes closures; no next-intl here (R23). */
export type SeasonTx = {
  range: (args: { from: string; to: string }) => string;
  also: (args: { from: string; to: string }) => string;
  signBy: (args: { start: string; signBy: string }) => string;
  noPeak: () => string;
};

export function seasonRange(
  row: Pick<SeasonRow, 'peak' | 'second'>,
  short: string[],
  tx: SeasonTx,
): string {
  const peak = tx.range({ from: short[row.peak[0]], to: short[row.peak[1]] });
  return row.second ? peak + tx.also({ from: short[row.second[0]], to: short[row.second[1]] }) : peak;
}

export function seasonHeadline(row: Pick<SeasonRow, 'start'>, long: string[], tx: SeasonTx): string {
  if (row.start === null) return tx.noPeak();
  return tx.signBy({ start: long[row.start], signBy: long[signByMonth(row.start)] });
}
```

`src/app/[locale]/(site)/_home/components/SeasonGrid.tsx`:

```tsx
import type { ReactNode } from 'react';
import { buttonClassName } from '@/design/primitives/Button';
import { nowMarkerLeft, type SeasonKey } from '../lib/season';
import { LiveDot } from './LiveDot';

export type SeasonRowView = {
  key: SeasonKey;
  name: string;
  sub: string;
  note: string;
  /** "Peak Sep–Dec · also Mar–May" — under the name at ≤ 460 px only (W10) */
  range: string;
  headline: string;
  peak: readonly [number, number];
  second: readonly [number, number] | null;
};

export type SeasonGridCopy = {
  gridLabel: string;
  hint: string;
  legend: { peak: string; second: string; now: string };
  cta: string;
};

const band = (range: readonly [number, number]) => ({
  gridColumn: `${range[0] + 1} / ${range[1] + 2}`,
  gridRow: 1,
});

/**
 * The 12-column planner (design lines 705–760). Rows are `aria-pressed` buttons (the design's
 * clickable rows); without `onSelect` — the server fallback — they are inert until the island
 * mounts. `nowMonth === null` (server) renders no marker, no header highlight and no "Now:" pill:
 * the current month is a browser fact (R18); the pill's slot keeps its height. At ≤ 460 px the rows
 * stack (name, sub, range, then a 34 px bar) and the month header shows initials (W10). No
 * directive: the server section and the island share it.
 */
export function SeasonGrid({
  heading,
  monthsShort,
  rows,
  selected,
  nowMonth,
  nowLabel,
  copy,
  onSelect,
  ready = false,
}: {
  heading: ReactNode;
  monthsShort: string[];
  rows: SeasonRowView[];
  selected: number;
  nowMonth: number | null;
  nowLabel: string | null;
  copy: SeasonGridCopy;
  onSelect?: (index: number) => void;
  ready?: boolean;
}) {
  const active = rows[selected] ?? rows[0];
  return (
    <div data-testid="season-planner" data-island={ready ? 'ready' : undefined}>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-6">
        {heading}
        <span aria-live="polite" className="inline-flex min-h-[38px] items-center">
          {nowLabel ? (
            <span className="inline-flex items-center gap-[9px] whitespace-nowrap rounded-pill border border-tint-border bg-tint px-4 py-[9px] text-[13px] font-extrabold text-blue-safe">
              <LiveDot />
              {nowLabel}
            </span>
          ) : null}
        </span>
      </div>
      <p id="season-hint" className="sr-only">
        {copy.hint}
      </p>
      <div className="-mx-3 overflow-x-auto px-3 pb-1 max-xs:mx-0 max-xs:overflow-x-visible max-xs:px-0">
        <div
          role="group"
          aria-label={copy.gridLabel}
          aria-describedby="season-hint"
          className="min-w-[640px] max-xs:min-w-0"
        >
          <div
            aria-hidden="true"
            className="mb-2.5 grid grid-cols-1 items-center gap-4 xs:grid-cols-[180px_1fr]"
          >
            <span className="max-xs:hidden" />
            <span className="grid grid-cols-12 text-center text-[11.5px] font-extrabold tracking-[0.4px]">
              {monthsShort.map((month, i) => (
                <span key={month} className={i === nowMonth ? 'text-success-text' : 'text-text-tertiary'}>
                  <span className="max-xs:hidden">{month}</span>
                  <span className="xs:hidden">{month.charAt(0)}</span>
                </span>
              ))}
            </span>
          </div>
          {rows.map((row, i) => {
            const isActive = i === selected;
            return (
              <button
                key={row.key}
                type="button"
                data-testid={`season-row-${row.key}`}
                aria-pressed={isActive}
                onClick={onSelect ? () => onSelect(i) : undefined}
                className={[
                  'mb-1 grid w-full cursor-pointer grid-cols-1 items-center gap-[7px] rounded-base border border-border-4 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe xs:mb-0 xs:grid-cols-[180px_1fr] xs:gap-4 xs:border-transparent xs:py-[7px] xs:pl-3 xs:pr-2.5',
                  isActive ? 'bg-pale-1' : 'bg-transparent hover:bg-pale-2',
                ].join(' ')}
              >
                <span className="flex min-w-0 flex-col gap-[3px]">
                  <span className="text-[15px] font-extrabold tracking-[-0.3px] text-ink xl:text-[11.25px]">
                    {row.name}
                  </span>
                  <span className="text-[12px] font-bold text-text-secondary">{row.sub}</span>
                  <span className="text-[12px] font-extrabold text-blue-safe xs:hidden">{row.range}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative grid h-[46px] grid-cols-12 overflow-hidden rounded-[13px] border border-border-4 bg-[#f4f8fb] max-xs:h-[34px]"
                >
                  <span
                    className={`z-[2] mx-[3px] my-[5px] block rounded-[10px] ${isActive ? 'bg-blue' : 'bg-[#8fcbe8]'}`}
                    style={band(row.peak)}
                  />
                  {row.second ? (
                    <span
                      className={`z-[1] mx-[3px] my-[5px] block rounded-[10px] ${isActive ? 'bg-tint-border' : 'bg-border-1'}`}
                      style={band(row.second)}
                    />
                  ) : null}
                  {nowMonth !== null ? (
                    <span
                      data-now-marker=""
                      className="absolute inset-y-0 z-[3] block w-0.5 bg-success"
                      style={{ left: nowMarkerLeft(nowMonth) }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-[22px] mt-4 flex flex-wrap items-center gap-[18px] text-[12.5px] font-bold text-text-tertiary">
        <span className="inline-flex items-center gap-[7px]">
          <span aria-hidden="true" className="inline-block h-[9px] w-3.5 rounded-[3px] bg-blue" />
          {copy.legend.peak}
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <span aria-hidden="true" className="inline-block h-[9px] w-3.5 rounded-[3px] bg-tint-border" />
          {copy.legend.second}
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-success" />
          {copy.legend.now}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[22px] rounded-lg bg-navy px-7 py-6 text-white max-xs:px-5">
        <div className="min-w-0">
          <p className="m-0 mb-2 text-[11.5px] font-extrabold uppercase tracking-[1.1px] text-sky">
            {active.name}
          </p>
          <p
            data-testid="season-headline"
            className="m-0 mb-1.5 font-display text-[20px] font-extrabold leading-[1.3] tracking-[-0.6px] xl:text-[15px]"
          >
            {active.headline}
          </p>
          <p className="m-0 max-w-[640px] text-[14px] font-semibold leading-[1.55] text-white/65 xl:text-[11px]">
            {active.note}
          </p>
        </div>
        {/* A column flex item stretches: the CTA is full-width at ≤ 460 px without a width class. */}
        <div className="flex flex-col max-xs:w-full">
          <a href="#proposal" className={buttonClassName('primary', 'md')}>
            {copy.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/_home/components/SeasonPlanner.tsx`:

```tsx
'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { SeasonGrid, type SeasonGridCopy, type SeasonRowView } from './SeasonGrid';

export type SeasonPlannerProps = {
  heading: ReactNode;
  /** computed by the server with Intl, so client and server never disagree on a month name */
  monthsShort: string[];
  rows: SeasonRowView[];
  /** home.217 — "Now:" / "Şimdi:" */
  nowPrefix: string;
  copy: SeasonGridCopy;
};

// R18: the current month is a browser fact — read through useSyncExternalStore, `null` on the
// server. The snapshot is a primitive (year × 12 + month), stable for the whole month.
const subscribe = () => () => {};
const monthKey = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};
const serverMonthKey = (): number | null => null;

/** The interactive planner: row selection plus the visitor's own "this month" (pill, header
 *  highlight, marker). The headlines arrive precomputed — the year-round row's is the no-peak
 *  line, so no headline depends on the date. */
export function SeasonPlanner({ heading, monthsShort, rows, nowPrefix, copy }: SeasonPlannerProps) {
  const key = useSyncExternalStore<number | null>(subscribe, monthKey, serverMonthKey);
  const [selected, setSelected] = useState(0);
  const nowMonth = key === null ? null : key % 12;
  const nowLabel =
    key === null ? null : `${nowPrefix} ${monthsShort[key % 12]} ${Math.floor(key / 12)}`;
  return (
    <SeasonGrid
      ready
      heading={heading}
      monthsShort={monthsShort}
      rows={rows}
      selected={selected}
      nowMonth={nowMonth}
      nowLabel={nowLabel}
      copy={copy}
      onSelect={setSelected}
    />
  );
}
```

`src/app/[locale]/(site)/_home/components/SeasonPlannerIsland.tsx`:

```tsx
'use client';
import type { ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import type { SeasonPlannerProps } from './SeasonPlanner';

// The `load` thunk cannot cross the server → client boundary; the type-only import keeps the
// island out of this eager chunk.
const load = () => import('./SeasonPlanner').then((m) => ({ default: m.SeasonPlanner }));

/** W13 amended / W132: the planner sits well below the fold; the static grid stands in until its
 *  wrapper comes within 200 px of the viewport. */
export function SeasonPlannerIsland({
  fallback,
  ...props
}: SeasonPlannerProps & { fallback: ReactNode }) {
  return <LazyIsland load={load} props={props} fallback={fallback} />;
}
```

`src/app/[locale]/(site)/_home/sections/SeasonSection.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf, metricValues } from '@/content/pure';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { SeasonGrid, type SeasonGridCopy, type SeasonRowView } from '../components/SeasonGrid';
import { SeasonPlannerIsland } from '../components/SeasonPlannerIsland';
import { monthNames, SEASON_ROWS, seasonHeadline, seasonRange, type SeasonTx } from '../lib/season';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

/** "Season planner" (home.096–103, 217, 243–253). The rows' copy is the package's; the month
 *  ranges are data (`SEASON_ROWS`); the composed lines are `sys.home.season.*` (W9) with Intl
 *  month names; "45 days" in the no-peak line is the `permitDays` metric (W1). */
export function SeasonSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const permitDays = metricValues(bundle, locale).permitDays ?? '';
  const short = monthNames(locale, 'short');
  const long = monthNames(locale, 'long');
  const tx: SeasonTx = {
    range: (args) => sys('home.season.range', args),
    also: (args) => sys('home.season.also', args),
    signBy: (args) => sys('home.season.signBy', args),
    noPeak: () => sys('home.season.noPeak', { permitDays }),
  };
  const rows: SeasonRowView[] = SEASON_ROWS.map((row) => ({
    key: row.key,
    name: tf(row.nameId),
    sub: row.subId ? tf(row.subId) : sys('home.season.agricultureSub'),
    note: tf(row.noteId),
    range: seasonRange(row, short, tx),
    headline: seasonHeadline(row, long, tx),
    peak: row.peak,
    second: row.second,
  }));
  const copy: SeasonGridCopy = {
    gridLabel: sys('home.season.gridLabel'),
    hint: sys('home.season.selectHint'),
    legend: { peak: tf('home.100'), second: tf('home.101'), now: tf('home.102') },
    cta: tf('home.103'),
  };
  const heading = (
    <div className="min-w-0">
      <Eyebrow>{tf('home.096')}</Eyebrow>
      <h2 className={`${H2} mb-2.5 mt-3`}>{tf('home.097')}</h2>
      <p className={`${LEAD} m-0 max-w-[620px] xl:max-w-[465px]`}>
        {tf('home.098')}
        <span className="max-xs:hidden"> {tf('home.099')}</span>
      </p>
    </div>
  );
  return (
    <Section tone="light" id="season">
      <div className="container-site">
        <SeasonPlannerIsland
          fallback={
            <SeasonGrid
              heading={heading}
              monthsShort={short}
              rows={rows}
              selected={0}
              nowMonth={null}
              nowLabel={null}
              copy={copy}
            />
          }
          heading={heading}
          monthsShort={short}
          rows={rows}
          nowPrefix={tf('home.217')}
          copy={copy}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/ProcessSection.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { ProcessSteps, type ProcessStep } from '@/design/blocks/ProcessSteps';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { SectionProps } from './types';

const STEPS = [
  { n: 1, whenId: 'home.104', titleId: 'home.105', bodyId: 'home.106' },
  { n: 2, whenId: 'home.107', titleId: 'home.108', bodyId: 'home.109' },
  { n: 3, whenId: 'home.110', titleId: 'home.111', bodyId: 'home.112' },
  { n: 4, whenId: 'home.113', titleId: 'home.114', bodyId: 'home.115' },
  { n: 5, whenId: 'home.116', titleId: 'home.117', bodyId: 'home.118' },
] as const;
const SECTOR_CHIP_IDS = ['home.224', 'home.225', 'home.226', 'home.227'] as const;

/** "How it works" (design lines 616–703): the sticky intro + effort box + sector chips on the
 *  left, the five steps as the shared `ProcessSteps` (`plain`) on the right. `when` labels are
 *  resolved here (home.107 carries `{homepageReplyHours}` → `makeTf`). The chips are hidden at
 *  ≤ 460 px (`.ja-tl-chips`, W10). */
export function ProcessSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const steps: ProcessStep[] = STEPS.map((step) => ({
    n: step.n,
    titleId: step.titleId,
    bodyId: step.bodyId,
    when: tf(step.whenId),
  }));
  return (
    <Section tone="light" id="process">
      <div
        data-testid="process"
        className="container-site grid items-start gap-[34px] lg:grid-cols-[0.42fr_1fr] lg:gap-14 xl:gap-[42px]"
      >
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>{tf('home.091')}</Eyebrow>
          <h2 className="mb-4 mt-3.5 text-h2-process leading-[1.02] tracking-[-1.8px] max-xs:tracking-[-1px] xl:tracking-[-1.35px]">
            {tf('home.092')}
          </h2>
          <p className="m-0 mb-[18px] text-[15.5px] leading-[1.65] text-text-secondary xl:text-body">
            {tf('home.093')}
          </p>
          <div className="mb-5 rounded-base border border-tint-border bg-tint px-[18px] py-4">
            <p className="m-0 mb-1.5 text-[11px] font-extrabold uppercase tracking-[1.2px] text-blue-safe">
              {tf('home.094')}
            </p>
            <p className="m-0 text-body-sm font-bold leading-[1.55] text-ink">{tf('home.095')}</p>
          </div>
          <div className="flex flex-wrap gap-2 max-xs:hidden">
            {SECTOR_CHIP_IDS.map((id) => (
              <Link
                key={id}
                href="/hire-workers"
                className="rounded-pill border border-border-1 bg-pale-1 px-[15px] py-[7px] text-[13px] font-bold text-[#43536a] no-underline hover:border-blue"
              >
                {tf(id)}
              </Link>
            ))}
          </div>
        </div>
        <ProcessSteps
          bundle={bundle}
          locale={locale}
          steps={steps}
          variant="plain"
          headingLevel={3}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — add `import { ProcessSection } from './_home/sections/ProcessSection';` and `import { SeasonSection } from './_home/sections/SeasonSection';` (sorted) and render `<ProcessSection {...section} />` then `<SeasonSection {...section} />` directly after `<CalculatorStrip {...section} />`.

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `season.test.ts` 9, `SeasonPlanner.test.tsx` 2, `process-season.test.tsx` 3 green (Prettier re-wraps `SEASON_ROWS` and the month arrays; the assertions are unchanged). Then the low-memory verify line → green (`rsc-imports.test.ts`: `SeasonGrid` is directive-less and uses no client-only React API; `SeasonPlanner`/`SeasonPlannerIsland` carry `'use client'` on their first line; `class-collisions.test.ts`: the row base + one colour branch).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && git commit -m "feat(home): process timeline (ProcessSteps plain) and the season planner — Intl month names, lazy island, the month as a browser fact (T1 c4)

Rows are data (SEASON_ROWS) under the package's copy; composed lines in sys.home.season (W9) with
the permitDays metric (W1); the server fallback renders row 1 without a 'now' (R18), the island
adds the pill and marker once in view (W13/W132, LazyIsland by path).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — Network map, our team (render by data), portal + app, work with us, guides (blog-gated), FAQ, the closing band

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/_home/__tests__/fixtures.ts` — replace the Cycle 1 file with this version (adds `blogPost`; the two existing helpers are unchanged):

```ts
import { readFileSync } from 'node:fs';
import type { BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';

/** The committed LOCAL bundle, parsed: the page's real copy and collections. `readFileSync` is the
 *  sanctioned bypass of the D23 import rule (ESLint forbids importing `content/local/*`). */
export function homeBundle(locale: Locale): Bundle {
  return BundleSchema.parse(
    JSON.parse(readFileSync(`src/content/local/bundle.${locale}.json`, 'utf8')),
  );
}

/** A copy of `bundle` with extra collection rows — the FIXTURE_ONLY `stories`/`representatives`,
 *  a published founder, written blog bodies — for the render-by-data branches Phase A never shows.
 *  A new object, so `getCollection`'s per-bundle cache starts empty. */
export function withCollections(bundle: Bundle, collections: Bundle['collections']): Bundle {
  return { ...bundle, collections: { ...bundle.collections, ...collections } };
}

/** A `blog` row that satisfies `BlogPostSchema` (body present exactly when written); its
 *  category label is the package's own `home.265` ("Recruitment"), as the importer emits. */
export function blogPost(
  key: string,
  publishedAt: string,
  written: { tr: boolean; en: boolean },
): BlogPost {
  const perLocale = (tr: string, en: string) => ({
    tr: written.tr ? tr : null,
    en: written.en ? en : null,
  });
  return {
    key,
    slug: perLocale(`${key}-tr`, key),
    title: perLocale(`${key} TR`, `${key} EN`),
    excerpt: perLocale('Özet', 'Excerpt'),
    category: 'recruitment',
    categoryLabelId: 'home.265',
    author: 'JobsAdmire',
    publishedAt,
    readMinutes: 5,
    hasBody: written,
    body: perLocale('# tr', '# en'),
  };
}
```

`src/app/[locale]/(site)/_home/lib/__tests__/guides.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { blogPost } from '../../__tests__/fixtures';
import { guidesPosts } from '../guides';

describe('guidesPosts (W4/W33: written articles only, newest first, per locale)', () => {
  const bundle = testBundle({
    collections: {
      blog: [
        blogPost('old', '2026-01-10', { tr: false, en: true }),
        blogPost('new', '2026-03-01', { tr: false, en: true }),
        blogPost('tr-only', '2026-02-01', { tr: true, en: false }),
        blogPost('unwritten', '2026-04-01', { tr: false, en: false }),
      ],
    },
  });

  it('EN: the two written EN articles, newest first', () => {
    expect(guidesPosts(bundle, 'en').map((p) => p.key)).toEqual(['new', 'old']);
  });

  it('TR: only the article with a Turkish body', () => {
    expect(guidesPosts(bundle, 'tr').map((p) => p.key)).toEqual(['tr-only']);
  });

  it('no blog collection → no posts', () => {
    expect(guidesPosts(testBundle(), 'en')).toEqual([]);
  });
});
```

`src/app/[locale]/(site)/_home/sections/__tests__/lower.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { blogPost, homeBundle, withCollections } from '../../__tests__/fixtures';
import { ContactStrip } from '../ContactStrip';
import { FaqSection } from '../FaqSection';
import { GuidesSection } from '../GuidesSection';
import { NetworkSection } from '../NetworkSection';
import { PortalSection } from '../PortalSection';
import { TeamSection } from '../TeamSection';
import { WorkWithUs } from '../WorkWithUs';

const TR = homeBundle('tr');
const EN = homeBundle('en');

describe('NetworkSection (W1/W10/W14)', () => {
  it('draws the build-time map and lists the 13 source countries twice (desktop chips, phone card)', () => {
    renderWithIntl(<NetworkSection locale="tr" bundle={TR} />);
    const network = screen.getByTestId('network');
    expect(
      within(network).getByRole('img', { name: "Kaynak ülkelerden Türkiye'ye" }),
    ).toBeInTheDocument();
    expect(network.querySelectorAll('[data-country]')).toHaveLength(14); // 13 + the TR marker
    expect(network.querySelectorAll('li[data-chip="desktop"]')).toHaveLength(13);
    expect(network.querySelectorAll('li[data-chip="phone"]')).toHaveLength(13);
    expect(within(network).getByText('13')).toBeInTheDocument(); // the `countries` metric
  });

  it('"Report fraud" is the Verify page’s form; Telegram and the partner CTA are plain links', () => {
    renderWithIntl(<NetworkSection locale="tr" bundle={TR} />);
    expect(screen.getByRole('link', { name: TR.strings['home.126'] })).toHaveAttribute(
      'href',
      '/temsilci-dogrulama#report',
    );
    expect(screen.getByRole('link', { name: TR.strings['home.202'] })).toHaveAttribute(
      'href',
      TR.settings.telegramUrl,
    );
    expect(screen.getByRole('link', { name: TR.strings['home.125'] })).toHaveAttribute(
      'href',
      '/ortak-olun',
    );
  });
});

describe('TeamSection (W6/W86)', () => {
  it('renders nothing while the public register is empty', () => {
    const { container } = renderWithIntl(<TeamSection locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders once representatives has rows; the founder card only once the row is published', () => {
    const withReps = withCollections(TR, { representatives: [{ ref: 'JA-1001' }] });
    const first = renderWithIntl(<TeamSection locale="tr" bundle={withReps} />);
    expect(screen.getByTestId('team')).toBeInTheDocument();
    expect(screen.queryByTestId('team-founder')).toBeNull();
    first.unmount();
    renderWithIntl(
      <TeamSection
        locale="tr"
        bundle={withCollections(withReps, {
          founder: [{ name: 'Ad Soyad', titleId: 'about.047', photoSrc: null, published: true }],
        })}
      />,
    );
    const founder = screen.getByTestId('team-founder');
    expect(founder).toHaveTextContent('Ad Soyad');
    expect(founder.querySelector('[data-placeholder="rep-founder"]')).not.toBeNull();
  });
});

describe('PortalSection (W8/W55)', () => {
  it('Android badge only, the Android platform line, named screen placeholders, hidden ≤ 460 px', () => {
    renderWithIntl(<PortalSection locale="en" bundle={EN} />, { locale: 'en' });
    const portal = screen.getByTestId('portal');
    expect(within(portal).getByRole('link', { name: /Google Play/ })).toHaveAttribute(
      'href',
      EN.settings.storeLinks.android ?? '',
    );
    expect(within(portal).queryByRole('link', { name: /App Store/ })).toBeNull();
    expect(portal).toHaveTextContent('Android');
    expect(portal.querySelector('[data-placeholder="portal-shortlist"]')).not.toBeNull();
    expect(portal.querySelector('[data-placeholder="portal-mobile-app"]')).not.toBeNull();
    expect(portal.closest('section')).toHaveClass('max-xs:hidden');
  });
});

describe('WorkWithUs', () => {
  it('talks on WhatsApp with the visitor-voice partner prefill; the roles link to careers', () => {
    renderWithIntl(<WorkWithUs locale="tr" bundle={TR} />);
    const talk = screen.getByRole('link', { name: TR.strings['home.223'] });
    expect(decodeURIComponent(talk.getAttribute('href') ?? '')).toContain(
      'tedarik ortağı olmak istiyorum',
    );
    const careers = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === '/kariyer');
    expect(careers).toHaveLength(4); // three role rows + "See open roles"
    expect(screen.getByTestId('work-with-us').closest('section')).toHaveClass('max-xs:hidden');
  });
});

describe('GuidesSection (W4)', () => {
  it('renders nothing below the six-Turkish-bodies threshold', () => {
    const { container } = renderWithIntl(<GuidesSection locale="tr" bundle={TR} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('once the blog is visible, the newest written article is the featured card', () => {
    const blog = Array.from({ length: 6 }, (_, i) =>
      blogPost(`guide-${i}`, `2026-0${i + 1}-10`, { tr: true, en: false }),
    );
    renderWithIntl(<GuidesSection locale="tr" bundle={withCollections(TR, { blog })} />);
    const guides = screen.getByTestId('guides');
    expect(within(guides).getAllByRole('heading', { level: 3 })[0]).toHaveTextContent(
      'guide-5 TR',
    );
    expect(within(guides).getAllByRole('link', { name: TR.strings['home.176'] })[0]).toHaveAttribute(
      'href',
      '/blog',
    );
  });
});

describe('FaqSection', () => {
  it('six independent toggles, the FAQPage node, the legal answer verbatim, the WhatsApp ask link', () => {
    const { container } = renderWithIntl(<FaqSection locale="en" bundle={EN} />, {
      locale: 'en',
    });
    const faq = screen.getByTestId('faq');
    expect(within(faq).getAllByRole('heading', { level: 3 })).toHaveLength(6);
    const jsonLd = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent ?? '',
    );
    expect(jsonLd.some((text) => text.includes('"@type":"FAQPage"'))).toBe(true);
    expect(faq).toHaveTextContent(EN.strings['home.299']); // W142(a): verbatim
    expect(
      within(faq).getByRole('link', { name: EN.strings['home.183'] }).getAttribute('href'),
    ).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
  });
});

describe('ContactStrip (ClosingCtaBand)', () => {
  it('four doors: #proposal, WhatsApp and call (tracked page_cta), Telegram', () => {
    renderWithIntl(<ContactStrip locale="tr" bundle={TR} />);
    const band = screen.getByTestId('cta-band');
    expect(within(band).getByRole('heading', { level: 2 })).toHaveTextContent(
      TR.strings['home.184'],
    );
    const hrefs = within(band)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(hrefs[0]).toBe('#proposal');
    expect(hrefs[1]).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    expect(hrefs).toContain(TR.settings.telegramUrl);
    expect(hrefs).toContain(`tel:${TR.settings.phone}`);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `guides.test.ts` fails to resolve `../guides`; `lower.test.tsx` fails to resolve the seven section modules; earlier files green (the `fixtures.ts` rewrite only adds an export).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/_home/lib/guides.ts`:

```ts
import { getCollection, type BlogPost } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The written articles in this locale — a body, a slug and a title, the only rows a `PostCard`
 *  renders (W33) — newest first. The blog index applies the same rule. */
export function guidesPosts(bundle: Bundle, locale: Locale): BlogPost[] {
  return getCollection(bundle, 'blog')
    .filter(
      (post) => post.hasBody[locale] && post.slug[locale] !== null && post.title[locale] !== null,
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
```

`src/app/[locale]/(site)/_home/sections/NetworkSection.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { getCollection } from '@/content/collections';
import { makeTf, metricValues } from '@/content/pure';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { CheckIcon, TelegramIcon } from '@/design/chrome/icons';
import { Flag } from '@/design/Flag';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

// W155 pattern: a colourless pill base + the design's own colour pair per link. Neither link is a
// contact door (t.me is not tel:/wa.me/mailto:; /verify is internal), so they are plain links —
// not `Button` callers, and no caller class ever lands on a `Button` base (W122).
const PILL =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill border-[1.5px] px-6 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const TELEGRAM = 'border-[#b6e0f5] bg-[#e8f6fd] text-blue-safe hover:bg-[#d6eefb]';
const FRAUD = 'border-danger-border bg-white text-danger hover:bg-danger-surface';

/**
 * "Agent network" (design lines 762–800). From 461 px the build-time `SourceMap` (W14 — 13
 * sourcing countries + Türkiye, no runtime fetch) and the flag chips; at ≤ 460 px the dark country
 * card (`.ja-net-mobile`) — both in the DOM, CSS decides (W10). Countries come from the
 * `sourceCountries` collection and the count from the `countries` metric (W1). The map is inline
 * SVG in the eighth block of the page: below the fold, the placement the final review's P-1 rule
 * accepts for its document weight. "Report fraud" goes to the Verify page's fraud form (`#report`,
 * CTA_BY_PATHNAME['/verify']) instead of the design's WhatsApp prefill.
 */
export function NetworkSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const countries = getCollection(bundle, 'sourceCountries');
  const count = metricValues(bundle, locale).countries ?? String(countries.length);
  return (
    <Section tone="light" id="network">
      <div
        data-testid="network"
        className="container-site grid items-center gap-[34px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[60px] xl:gap-[45px]"
      >
        <div className="min-w-0 max-xs:hidden">
          <SourceMap
            title={sys('home.network.mapTitle')}
            labels={sourceMapLabels(countries)}
            turkiyeLabel={sys('home.network.turkiye')}
          />
        </div>
        <div className="min-w-0">
          <Eyebrow>{tf('home.119')}</Eyebrow>
          <h2 className={`${H2} mb-4 mt-3.5`}>{tf('home.120')}</h2>
          <p className={`${LEAD} m-0 mb-[22px]`}>{tf('home.121')}</p>
          <div className="relative mb-[22px] overflow-hidden rounded-xl bg-navy px-5 pb-5 pt-[22px] text-white xs:hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[90px] -top-[110px] h-[280px] w-[280px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.28),transparent_65%)]"
            />
            <p className="relative m-0 mb-4 flex items-baseline gap-2.5">
              <span className="font-display text-[34px] font-extrabold leading-none tracking-[-1.4px]">
                {count}
              </span>
              <span className="text-[13px] font-extrabold uppercase tracking-[0.6px] text-sky">
                {tf('home.122')}
              </span>
            </p>
            <ul className="relative m-0 mb-4 grid list-none grid-cols-2 gap-2 p-0">
              {countries.map((country) => (
                <li
                  key={country.code}
                  data-chip="phone"
                  className="flex min-w-0 items-center gap-[9px] overflow-hidden whitespace-nowrap rounded-xs border border-white/15 bg-white/7 px-[11px] py-[9px] text-[13px] font-bold"
                >
                  {isFlagCode(country.code) ? <Flag code={country.code} size={18} /> : null}
                  {country.name}
                </li>
              ))}
            </ul>
            <ul className="relative m-0 flex list-none flex-col gap-[9px] border-t border-white/15 p-0 pt-3.5">
              {(['home.123', 'home.124'] as const).map((id) => (
                <li
                  key={id}
                  className="flex items-start gap-[9px] text-[12.5px] font-bold leading-normal text-white/80"
                >
                  <CheckIcon size={15} className="mt-0.5 shrink-0 text-[#5ddfb0]" />
                  {tf(id)}
                </li>
              ))}
            </ul>
          </div>
          <ul className="m-0 mb-[26px] flex list-none flex-wrap gap-2 p-0 max-xs:hidden">
            {countries.map((country) => (
              <li
                key={country.code}
                data-chip="desktop"
                className="inline-flex items-center gap-2 rounded-pill border border-border-1 bg-pale-1 px-3.5 py-[7px] text-[13px] font-bold text-[#43536a]"
              >
                {isFlagCode(country.code) ? <Flag code={country.code} size={18} /> : null}
                {country.name}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button variant="nav" href="/partner-with-us">
              {tf('home.125')}
            </Button>
            <a
              href={bundle.settings.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${PILL} ${TELEGRAM}`}
            >
              <TelegramIcon size={17} />
              {tf('home.202')}
            </a>
            <Link href={{ pathname: '/verify', hash: '#report' }} className={`${PILL} ${FRAUD}`}>
              {tf('home.126')}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/TeamSection.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { LiveDot } from '../components/LiveDot';
import { BuildingIcon, GlobeIcon, MonitorIcon, ShieldIcon } from '../components/icons';
import { hasRows, publishedFounder } from '../lib/phase-a';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

const MINI = [
  { labelId: 'home.133', bodyId: 'home.131', Icon: BuildingIcon, tint: 'bg-tint text-blue-safe' },
  {
    labelId: 'home.132',
    bodyId: 'home.134',
    Icon: MonitorIcon,
    tint: 'bg-success-surface text-success-text',
  },
  { labelId: 'home.135', bodyId: 'home.136', Icon: GlobeIcon, tint: 'bg-[#eef2ff] text-[#4855b8]' },
] as const;

/**
 * "Our team" (design lines 802–851). Every line of it is a claim about the public register
 * ("everyone below is on our payroll with a JA- ID — check anyone on the public register"), which
 * Phase A cannot back: `representatives` is empty and fixture-only (D23), so the section renders
 * nothing until it has rows (W6). The founder card additionally waits for the owner to publish the
 * `founder` row (W86, §10 row 3) — its name and photo come from that row, never from the design's
 * hard-coded name. At ≤ 460 px the three minis hide (`.ja-team-mini`, W10).
 */
export function TeamSection({ locale, bundle }: SectionProps) {
  if (!hasRows(bundle, 'representatives')) return null;
  const founder = publishedFounder(bundle);
  const tf = makeTf(bundle, locale);
  return (
    <Section tone="pale" id="team" className="border-y border-border-2">
      <div data-testid="team" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.200')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.127')}</h2>
          </div>
          <p className="m-0 max-w-[360px] text-body-sm font-bold text-text-secondary lg:text-right">
            {tf('home.128')}
          </p>
        </div>
        <div className="grid items-stretch gap-4 lg:grid-cols-[1.05fr_0.65fr_0.65fr_0.65fr]">
          {founder ? (
            <article
              data-testid="team-founder"
              className="relative flex items-center gap-[22px] overflow-hidden rounded-hero bg-navy px-[30px] py-7 text-white max-xs:gap-4 max-xs:px-5 max-xs:py-[22px]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-[100px] -top-[120px] h-[320px] w-[320px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.25),transparent_65%)]"
              />
              {/* W129: the slot owns its box; this wrapper sizes it (104 px, 86 px at ≤ 460 px). */}
              <div className="relative w-[104px] shrink-0 overflow-hidden rounded-base border border-white/20 bg-white/10 max-xs:w-[86px]">
                <ImageSlot
                  slot="rep-founder"
                  src={founder.photoSrc}
                  alt={founder.name}
                  width={104}
                  height={130}
                  sizes="104px"
                />
              </div>
              <div className="relative min-w-0">
                <span className="mb-2.5 inline-block rounded-pill bg-blue-safe px-[13px] py-1 text-[10.5px] font-extrabold uppercase tracking-[1px]">
                  {tf('home.129')}
                </span>
                <h3 className="m-0 text-[22px] tracking-[-0.7px] text-white xl:text-[16.5px]">
                  {founder.name}
                </h3>
                <p className="m-0 mt-[5px] text-body-sm leading-normal text-white/65">
                  {tf('home.130')}
                </p>
              </div>
            </article>
          ) : null}
          {MINI.map(({ labelId, bodyId, Icon, tint }) => (
            <article
              key={labelId}
              className="flex flex-col gap-[9px] rounded-hero border border-border-2 bg-white px-[26px] py-6 max-xs:hidden"
            >
              <span
                aria-hidden="true"
                className={`mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-xs ${tint}`}
              >
                <Icon size={20} />
              </span>
              <h3 className="m-0 text-[17px] tracking-[-0.4px] xl:text-[12.75px]">{tf(labelId)}</h3>
              <p className="m-0 text-[13px] font-semibold leading-[1.55] text-text-tertiary">
                {tf(bodyId)}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 max-xs:flex-col">
          <Button variant="nav" href="/verify">
            <ShieldIcon size={15} />
            {tf('home.137')}
          </Button>
          <Button variant="secondary" href="/about">
            {tf('home.138')}
          </Button>
          <Button variant="success" href="/careers">
            <LiveDot />
            {tf('home.139')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/PortalSection.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { StoreBadges } from '@/design/blocks/StoreBadges';
import { ClockIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { LiveDot } from '../components/LiveDot';
import { FileCheckIcon, MobileIcon, SparkIcon } from '../components/icons';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

const TILES = [
  { titleId: 'home.207', bodyId: 'home.165', Icon: SparkIcon, tint: 'bg-tint text-blue-safe' },
  {
    titleId: 'home.209',
    bodyId: 'home.166',
    Icon: FileCheckIcon,
    tint: 'bg-success-surface text-success-text',
  },
  { titleId: 'home.167', bodyId: 'home.168', Icon: ClockIcon, tint: 'bg-[#eef2ff] text-[#4855b8]' },
  { titleId: 'home.213', bodyId: 'home.169', Icon: MobileIcon, tint: 'bg-[#fef3e2] text-warning-text' },
] as const;

/**
 * "Portal + app" (design lines 853–950), hidden at ≤ 460 px as the design hides `.ja-portal-sec`
 * (W10 — the section's phone-only lines never show, so home.170–172 are not rendered). The two
 * screens are the named placeholders `portal-shortlist` / `portal-mobile-app` until product shots
 * ship (W55); the mock's status and shortlist labels (home.215/216) are decorative, inside an
 * `aria-hidden` illustration. W8: `StoreBadges` gets `ios: null` (no App Store badge) and the
 * platform line reads "Android" (`sys.home.portal.platforms`); the host is `settings.portal.host`.
 */
export function PortalSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const host = new URL(s.portal.host).host;
  return (
    <Section tone="light" id="portal" className="max-xs:hidden">
      <div
        data-testid="portal"
        className="container-site grid items-center gap-[34px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-[42px]"
      >
        <div className="min-w-0">
          <Eyebrow>{tf('home.162')}</Eyebrow>
          <h2 className={`${H2} mb-4 mt-3.5`}>{tf('home.163')}</h2>
          <p className={`${LEAD} m-0 mb-[22px]`}>{tf('home.164')}</p>
          <ul className="m-0 mb-[26px] grid list-none gap-3 p-0 sm:grid-cols-2">
            {TILES.map(({ titleId, bodyId, Icon, tint }) => (
              <li
                key={titleId}
                className="flex items-start gap-[13px] rounded-base border border-border-2 bg-white px-[18px] py-4"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] ${tint}`}
                >
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-body-sm font-extrabold text-ink">{tf(titleId)}</span>
                  <span className="mt-0.5 block text-[12.5px] font-semibold leading-normal text-text-tertiary">
                    {tf(bodyId)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="nav" href="/hire-workers">
              {tf('home.173')}
            </Button>
            <StoreBadges
              bundle={bundle}
              locale={locale}
              android={s.storeLinks.android}
              ios={s.storeLinks.ios}
              tone="dark"
            />
          </div>
        </div>
        <div className="relative min-w-0 overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#16294f_0%,#0e1a37_60%,#0a1428_100%)] px-[30px] pb-[30px] pt-9 xl:rounded-[19.5px]">
          <div aria-hidden="true" className="relative h-[400px]">
            <div className="absolute left-0 top-0 w-[82%]">
              <div className="rounded-b-md rounded-t-[14px] bg-[#0f2438] px-[9px] pb-3 pt-[9px] shadow-[0_26px_56px_rgba(3,10,26,0.55)]">
                <div className="overflow-hidden rounded-lg bg-white">
                  <div className="flex items-center gap-[7px] border-b border-border-4 bg-[#f6f9fb] px-3 py-[9px]">
                    <span className="inline-block h-[9px] w-[9px] rounded-pill bg-[#e2e8ee]" />
                    <span className="inline-block h-[9px] w-[9px] rounded-pill bg-[#e2e8ee]" />
                    <span className="inline-block h-[9px] w-[9px] rounded-pill bg-[#e2e8ee]" />
                    <span className="ml-2 flex-1 rounded-md border border-border-4 bg-white px-2.5 py-[3px] text-[11px] text-text-tertiary">
                      {host}
                    </span>
                  </div>
                  <ImageSlot
                    slot="portal-shortlist"
                    src={null}
                    alt=""
                    width={640}
                    height={320}
                    sizes="(min-width: 901px) 40vw, 80vw"
                  />
                </div>
              </div>
              <div className="-mx-[6%] h-[15px] rounded-b-[14px] rounded-t-sm bg-[linear-gradient(180deg,#dbe4ec,#b9c7d2)]" />
            </div>
            <div className="absolute bottom-0 right-1.5 z-[2] w-[150px] rounded-[24px] border border-white/10 bg-[#0f2438] p-[7px] shadow-[0_30px_60px_rgba(3,10,26,0.6)]">
              <div className="overflow-hidden rounded-[18px]">
                <ImageSlot
                  slot="portal-mobile-app"
                  src={null}
                  alt=""
                  width={136}
                  height={278}
                  sizes="136px"
                />
              </div>
            </div>
            <div className="absolute -left-1.5 bottom-16 z-[3] max-w-[210px] rounded-sm bg-white px-4 py-3 shadow-[0_18px_44px_rgba(3,10,26,0.5)]">
              <p className="m-0 mb-1 flex items-center gap-[9px] text-[12.5px] font-extrabold text-ink">
                <LiveDot />
                {tf('home.215')}
              </p>
              <div className="h-1.5 overflow-hidden rounded-pill bg-border-3">
                <span className="block h-full w-4/5 rounded-pill bg-[linear-gradient(90deg,#1899d5,#12813c)]" />
              </div>
            </div>
            <div className="absolute -top-3.5 right-[22px] z-[3] rounded-xs bg-blue-safe px-[15px] py-[9px] text-[12px] font-extrabold text-white shadow-[0_14px_34px_rgba(24,153,213,0.45)]">
              {tf('home.216')}
            </div>
          </div>
          <p className="relative m-0 mt-[22px] flex flex-wrap items-center justify-center gap-x-[18px] gap-y-1 text-[12px] font-bold text-white/60">
            <span>{host}</span>
            <span aria-hidden="true">·</span>
            <span>{sys('home.portal.platforms')}</span>
            <span aria-hidden="true">·</span>
            <span>{tf('home.174')}</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/WorkWithUs.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { CheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import { LiveDot } from '../components/LiveDot';
import { ArrowsIcon, UserPlusIcon } from '../components/icons';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

const AGENCY_POINTS = ['home.146', 'home.147', 'home.148'] as const;
const ROLE_ROWS = [
  ['home.154', 'home.155'],
  ['home.156', 'home.157'],
  ['home.158', 'home.159'],
] as const;
const CARD_TITLE =
  'm-0 mb-3 text-[clamp(24px,2.4vw,30px)] leading-[1.1] tracking-[-1px] xl:text-[clamp(18px,1.8vw,22.5px)]';

/**
 * "Work with us" (design lines 952–1024), hidden at ≤ 460 px (`.ja-hide-mobile`, W10). The card
 * bodies are the package's home.145/home.153 — the design markup hard-codes an older "We handle…"
 * English body; the strings say "JobsAdmire handles…" (page note, formal register). The three role
 * rows are static role descriptions linking to the careers index; live openings are the careers
 * task's (D15). "Talk to us" is a tracked WhatsApp CTA with the fixed partner prefill (W12/W95).
 */
export function WorkWithUs({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="work-with-us" className="max-xs:hidden">
      <div data-testid="work-with-us" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.140')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.141')}</h2>
          </div>
          <p className="m-0 max-w-[340px] text-body-sm font-bold text-text-tertiary lg:text-right">
            {tf('home.142')}
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="relative flex flex-col overflow-hidden rounded-[26px] bg-navy px-[38px] py-9 text-white xl:rounded-[19.5px] xl:px-[28.5px] xl:py-[27px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[130px] -top-[150px] h-[420px] w-[420px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.24),transparent_65%)]"
            />
            <div className="relative">
              <p className="m-0 mb-[18px] flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-blue/20 text-sky"
                >
                  <ArrowsIcon size={22} />
                </span>
                <span className="text-[11.5px] font-extrabold uppercase tracking-[1.3px] text-sky">
                  {tf('home.143')}
                </span>
              </p>
              <h3 className={`${CARD_TITLE} text-white`}>{tf('home.144')}</h3>
              <p className="m-0 mb-[22px] text-[15px] font-semibold leading-[1.62] text-white/70 xl:text-body">
                {tf('home.145')}
              </p>
              <ul className="m-0 mb-[26px] flex list-none flex-col gap-[11px] p-0">
                {AGENCY_POINTS.map((id) => (
                  <li
                    key={id}
                    className="flex items-start gap-[11px] text-body-sm font-bold leading-normal text-white/85"
                  >
                    <CheckIcon size={14} className="mt-[3px] shrink-0 text-[#5ddfb0]" />
                    {tf(id)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-auto flex flex-wrap items-center gap-[11px]">
              <Button variant="primary" href="/partner-with-us">
                {tf('home.149')}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                external
                href={waLink(bundle.settings.whatsappNumber, sys('home.whatsapp.partner'))}
              >
                <LiveDot />
                {tf('home.223')}
              </ContactCta>
            </div>
            <p className="relative m-0 mt-[22px] border-t border-dashed border-white/20 pt-3.5 text-[12.5px] font-semibold leading-[1.55] text-white/55">
              {tf('home.150')}
            </p>
          </article>
          <article className="flex flex-col rounded-[26px] border border-border-2 bg-white px-[38px] py-9 xl:rounded-[19.5px] xl:px-[28.5px] xl:py-[27px]">
            <p className="m-0 mb-[18px] flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] bg-success-surface text-success-text"
              >
                <UserPlusIcon size={22} />
              </span>
              <span className="text-[11.5px] font-extrabold uppercase tracking-[1.3px] text-success-text">
                {tf('home.151')}
              </span>
            </p>
            <h3 className={`${CARD_TITLE} text-ink`}>{tf('home.152')}</h3>
            <p className="m-0 mb-[22px] text-[15px] font-semibold leading-[1.62] text-text-secondary xl:text-body">
              {tf('home.153')}
            </p>
            <ul className="m-0 mb-6 flex list-none flex-col gap-2.5 p-0">
              {ROLE_ROWS.map(([roleId, metaId]) => (
                <li key={roleId}>
                  <Link
                    href="/careers"
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-sm border border-[#e2edf5] bg-pale-1 px-4 py-[13px] no-underline transition-colors hover:border-tint-border hover:bg-tint"
                  >
                    <span className="text-[14.5px] font-extrabold text-ink xl:text-[11px]">
                      {tf(roleId)}
                    </span>
                    <span className="text-[12.5px] font-bold text-text-secondary">{tf(metaId)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-[11px]">
              <Button variant="nav" href="/careers">
                {tf('home.160')}
              </Button>
              <Button variant="secondary" href="/verify">
                {tf('home.161')}
              </Button>
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/GuidesSection.tsx`:

```tsx
import { blogNavVisible } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { PostCard } from '@/design/blocks/PostCard';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { guidesPosts } from '../lib/guides';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

/**
 * "Guides and market updates" (design lines 1026–1069). W4: `/blog` is noindex and out of every
 * chrome list until six Turkish bodies exist, and every related-article block — this one included
 * — renders nothing below that threshold (`blogNavVisible`). When visible, the design's hard-coded
 * featured card and four-item list (home.203–205, 262–273, 290–293) are replaced by the `blog`
 * collection through `PostCard` (the newest written article featured, the next four as rows; the
 * category pills are the rows' own `categoryLabelId`s, home.262–265). The side list and the top
 * CTA hide at ≤ 460 px, where the bottom CTA shows (W10).
 */
export function GuidesSection({ locale, bundle }: SectionProps) {
  if (!blogNavVisible(bundle)) return null;
  const posts = guidesPosts(bundle, locale);
  if (posts.length === 0) return null;
  const tf = makeTf(bundle, locale);
  const [featured, ...rest] = posts;
  return (
    <Section tone="light" id="guides">
      <div data-testid="guides" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.220')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.175')}</h2>
          </div>
          <div className="max-xs:hidden">
            <Button variant="nav" href="/blog">
              {tf('home.176')}
            </Button>
          </div>
        </div>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <PostCard bundle={bundle} locale={locale} post={featured} variant="featured" headingLevel={3} />
          {rest.length > 0 ? (
            <div className="flex flex-col gap-3 max-xs:hidden">
              {rest.slice(0, 4).map((post) => (
                <PostCard
                  key={post.key}
                  bundle={bundle}
                  locale={locale}
                  post={post}
                  variant="row"
                  headingLevel={3}
                />
              ))}
              <Link
                href="/blog"
                className="py-2 text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
              >
                {tf('home.179')}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col xs:hidden">
          <Button variant="nav" href="/blog">
            {tf('home.176')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/FaqSection.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import { LiveDot } from '../components/LiveDot';
import { H2 } from './styles';
import type { SectionProps } from './types';

const PAIRS = [
  ['home.294', 'home.295'],
  ['home.296', 'home.297'],
  ['home.298', 'home.299'],
  ['home.300', 'home.301'],
  ['home.302', 'home.303'],
  ['home.304', 'home.305'],
] as const;

/**
 * "Common questions" (design lines 1071–1089): the page's own eyebrow + h2 in the design's single
 * 880 px column, then `FaqBlock` without a side column — the accordion (`singleOpen={false}` keeps
 * the design's independent toggles) and the FAQPage node (AEO only, docs/SEO.md; the page's one
 * FaqBlock). The answers include the legal-flagged home.295/297/299/301/303, rendered as authored
 * (W1/W58/W142 — home.299's ₺38,944 is on the WP-C sheet beside the model's ₺40,214). The footer is
 * the design's own line + a tracked WhatsApp CTA with the fixed hire prefill.
 */
export function FaqSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const items: FaqItem[] = PAIRS.map(([q, a]) => ({ id: q, q: tf(q), a: tf(a) }));
  return (
    <Section tone="light">
      <div className="container-site">
        <div data-testid="faq" className="mx-auto max-w-[880px] xl:max-w-[660px]">
          <Eyebrow>{tf('home.180')}</Eyebrow>
          <h2 className={`${H2} mb-6 mt-3`}>{tf('home.181')}</h2>
          <FaqBlock
            bundle={bundle}
            locale={locale}
            items={items}
            singleOpen={false}
            headingLevel={3}
            footer={
              <div className="mt-[22px] flex flex-wrap items-center gap-3">
                <p className="m-0 text-body-sm font-bold text-text-tertiary">{tf('home.182')}</p>
                <ContactCta
                  placement="page_cta"
                  variant="success"
                  external
                  href={waLink(bundle.settings.whatsappNumber, sys('home.whatsapp.hire'))}
                >
                  <LiveDot />
                  {tf('home.183')}
                </ContactCta>
              </div>
            }
          />
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/_home/sections/ContactStrip.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { Section } from '@/design/primitives/Section';
import { telLink, waLink } from '@/lib/contact';
import type { SectionProps } from './types';

/**
 * The contact strip (design lines 1091–1106) as the shared `ClosingCtaBand` (`tone="navy"`): the
 * hero's "Request workers →" back to `#proposal` (the design reuses home.022), WhatsApp with the
 * fixed hire prefill, Telegram, and "Call the office". Every CTA renders through `ContactCta`, so
 * the WhatsApp and phone actions fire `whatsapp_click`/`call_click` with `placement: 'page_cta'`
 * (W12); Telegram is not a contact door. At ≤ 460 px all four stay (the design keeps two — a named
 * delta; the block has no per-CTA breakpoint).
 */
export function ContactStrip({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  return (
    <Section tone="band">
      <div data-testid="cta-band" className="container-site">
        <ClosingCtaBand
          bundle={bundle}
          locale={locale}
          titleId="home.184"
          bodyId="home.185"
          tone="navy"
          primary={{ label: tf('home.022'), href: '#proposal' }}
          secondary={{
            label: tf('home.221'),
            href: waLink(s.whatsappNumber, sys('home.whatsapp.hire')),
            external: true,
          }}
          extra={[
            { label: tf('home.202'), href: s.telegramUrl, external: true },
            { label: tf('home.187'), href: telLink(s.phone) },
          ]}
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/page.tsx` — the final file (replace it whole):

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle } from '@/content/adapter';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitCallback, submitHire } from './_home/actions';
import { CalculatorStrip } from './_home/sections/CalculatorStrip';
import { ChoiceCards } from './_home/sections/ChoiceCards';
import { ContactStrip } from './_home/sections/ContactStrip';
import { FaqSection } from './_home/sections/FaqSection';
import { GuidesSection } from './_home/sections/GuidesSection';
import { Hero } from './_home/sections/Hero';
import { HeroForm } from './_home/sections/HeroForm';
import { LiveCaseBar } from './_home/sections/LiveCaseBar';
import { NetworkSection } from './_home/sections/NetworkSection';
import { PoolSection } from './_home/sections/PoolSection';
import { PortalSection } from './_home/sections/PortalSection';
import { ProcessSection } from './_home/sections/ProcessSection';
import { SeasonSection } from './_home/sections/SeasonSection';
import { TeamSection } from './_home/sections/TeamSection';
import { WorkWithUs } from './_home/sections/WorkWithUs';

/** W150 (D17): the calculator teaser's dated badge and eyebrow switch off at
 *  `rateConfig.reviewDueAt`; the page is statically generated, so it re-renders daily. */
export const revalidate = 86400;

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
  // The page record `home` carries no package SEO string (titleId/descriptionId are ''), so the
  // sys.seo.home.* copy is the title/description and the OG image's title (W23/W38).
  return buildMetadata({
    locale,
    href: '/',
    bundle,
    pageKey: 'home',
    fallbackTitle: sys('seo.home.title'),
    fallbackDescription: sys('seo.home.description'),
  });
}

/** The homepage (design/JobsAdmire Homepage v4), section for section in the design's order. No
 *  <main> here — SiteChrome owns it (R31). Sections that need live data decide for themselves
 *  whether to render (W6); no StickyCtaBar (the sticky header carries this page's #proposal CTA). */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const section = { locale, bundle };
  return (
    <>
      <Hero
        {...section}
        form={<HeroForm {...section} actions={{ hire: submitHire, callback: submitCallback }} />}
      />
      <LiveCaseBar {...section} />
      <ChoiceCards {...section} />
      <PoolSection {...section} />
      <CalculatorStrip {...section} />
      <ProcessSection {...section} />
      <SeasonSection {...section} />
      <NetworkSection {...section} />
      <TeamSection {...section} />
      <PortalSection {...section} />
      <WorkWithUs {...section} />
      <GuidesSection {...section} />
      <FaqSection {...section} />
      <ContactStrip {...section} />
    </>
  );
}
```

`docs/ANALYTICS.md` — directly before the heading `## Conversion`, insert (W98 — this task creates the heading; later tasks append one bullet each):

```markdown
### Page instrumentation (WP2b)

One bullet per page task (W98), in execution order: the events a page fires, where, and with which enum values. A page never extends the allowlist above; every contact anchor goes through `ContactLink`/`ContactCta` (or, for a visitor-composed WhatsApp prefill, a click-time composer that fires the same event).

- **Homepage (`/`, `/en`, T1):** `whatsapp_click` with `placement: 'page_cta'` from the hero card's "Chat on WhatsApp instead" (fixed hire prefill), the calculator teaser's "Send this estimate on WhatsApp" (`WhatsAppComposeLink` — the DOM href is the bare `https://wa.me/<number>`, the estimate prefill is composed on click, W95), the FAQ's "Ask on WhatsApp", the work-with-us "Talk to us" (fixed partner prefill) and the closing band's WhatsApp; `call_click` (`page_cta`) from the band's "Call the office"; `calculator_use` from the teaser on every role or headcount chip change — `role` = the preset row key (`generalPreset` | `skilledPreset` | `specialistPreset`), `headcount` = the chip value (1 | 5 | 15 | 30), never a typed value; the two hero forms' fallback panels fire `whatsapp_click` / `call_click` / `email_click` with `placement: 'form_fallback'`. The page fires no lead event itself: `conversion` for `form_key: 'hire'` / `'callback'` comes from `ConversionPing` on `/tesekkurler`. The header CTA, the choice cards, the season planner's CTA and the band's primary are same-page `#proposal` links and fire nothing; Telegram links are not contact doors (`contactKindOf` → `null`).
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/ANALYTICS.md 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run _home --maxWorkers=1
```

Expected: `guides.test.ts` 3, `lower.test.tsx` 11 green; all earlier `_home` files green. Then the low-memory verify line → green, in particular `class-collisions.test.ts` (`PILL` + `TELEGRAM`/`FRAUD`, the `CARD_TITLE` compositions, `<Button variant="nav|secondary|success|primary">` without classes), `rsc-imports.test.ts` and `client-imports.test.ts` (every block/primitive by path; no islands barrel), `voice.test.ts` (the partner prefill is first-person singular).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add 'src/app/[locale]/(site)/page.tsx' 'src/app/[locale]/(site)/_home' docs/ANALYTICS.md && git commit -m "feat(home): network map + flags, team by data, portal, work with us, blog-gated guides, FAQ block, closing band (T1 c5)

W14 build-time SourceMap below the fold (P-1) with the 13 sourcing countries and the countries
metric; team renders by data (representatives) and the founder card only when published (W6/W86);
portal Android-only (W8); guides hidden below the blog threshold (W4); FaqBlock is the page's one
FAQPage node; ClosingCtaBand CTAs tracked as page_cta. Docs: ANALYTICS § Page instrumentation (W98).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — The page contract e2e and the WP2b ledger table

- [ ] **Step 1: Write the failing test**

`e2e/pages/home.spec.ts` (the `e2e/pages/` folder is new; `playwright.config.ts`'s `testDir: './e2e'` picks it up under both projects — `mobile` = Pixel 7, 412 px, i.e. the design's ≤ 460 layout; `desktop` = 1440):

```ts
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// W92: the door variables reach only production and the `staging` preview. Every other target —
// a local `next start`, a branch preview — has no write token, so a submission answers
// `unauthorized` without a network call and the kernel renders the D11 fallback panel:
// deterministic. On a door-on host the submitting cases skip (a real lead would land in
// Operations); the door-on path is T14's (staging, real Turnstile).
const DOOR_HOSTS = new Set(['jobsadmire.com', 'www.jobsadmire.com', 'staging.jobsadmire.com']);
const doorOn = (baseURL: string | undefined) =>
  DOOR_HOSTS.has(new URL(baseURL ?? 'http://localhost:3000').hostname);
type BundleJson = {
  settings: { whatsappNumber: string };
  collections: {
    rateConfig: { legalMinGross: number; sgkRates: { other: number } }[];
    blog?: { hasBody: { tr: boolean } }[];
  };
};
// The committed TR bundle is the data these assertions follow, read with `readFileSync` like the
// contract tests (D23's import rule covers `src/**`; the site loads bundles only via the adapter).
const bundle = JSON.parse(readFileSync('src/content/local/bundle.tr.json', 'utf8')) as BundleJson;
const WA = `https://wa.me/${bundle.settings.whatsappNumber}`;
const rate = bundle.collections.rateConfig[0];
/** W2/W58: the teaser's monthly payroll for the General preset (1×), support off, the `other`
 *  tier — the engine's sum (gross + SGK) × n, snapped to 4 dp and rounded once (W144(a)). */
const payrollTR = (n: number) => {
  const gross = rate.legalMinGross * n;
  const exact = Math.round((gross + gross * rate.sgkRates.other) * 1e4) / 1e4;
  return `${new Intl.NumberFormat('tr-TR').format(Math.round(exact))} ₺`;
};
/** W4: the guides block renders only from six Turkish bodies. */
const blogVisible = (bundle.collections.blog ?? []).filter((p) => p.hasBody.tr).length >= 6;

const LEAK = /\{[a-zA-Z]+\}|undefined|\[object /;
const ORDER = [
  'hero',
  'hero-form',
  'choice-cards',
  'pool',
  'calc-teaser',
  'process',
  'season-planner',
  'network',
  'portal',
  'work-with-us',
  'faq',
  'cta-band',
];
const HIDDEN_IN_PHASE_A = [
  'live-case-bar',
  'hero-proof',
  'team',
  ...(blogVisible ? [] : ['guides']),
];

const testIds = (page: Page) =>
  page
    .locator('[data-testid]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-testid') ?? ''));
const dataLayer = (page: Page, event: string) =>
  page.evaluate(
    (name) =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (entry) => entry.event === name,
      ),
    event,
  );
/** Below 461 px the lead card waits behind its mode buttons (W10); from 461 px it is open. */
async function openHeroForm(page: Page, mode: 'proposal' | 'callback') {
  const button = page.getByTestId(`hero-mode-${mode}`);
  if (await button.isVisible()) await button.click();
}
/** W76/W95: capture the click-time WhatsApp URL instead of opening a tab. */
const stubWindowOpen = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
const opened = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

for (const [route, lang] of [
  ['/', 'tr'],
  ['/en', 'en'],
] as const) {
  test(`homepage ${route}: the page contract, the design's section order, the Phase A switches`, async ({
    page,
  }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveCount(1);
    // D26: the hero photo is a named placeholder, so the h1 is the page's one LCP slot.
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('h1[data-testid="page-h1"][data-lcp-slot="h1"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="v4-hero"]')).toHaveCount(1);
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder')));
    for (const name of placeholders) expect(name).toBeTruthy(); // W55: never unnamed
    expect(await page.locator('body').innerText()).not.toMatch(LEAK);
    const ids = await testIds(page);
    const positions = ORDER.map((id) => ids.indexOf(id));
    positions.forEach((position, i) =>
      expect(position, `${ORDER[i]} is rendered`).toBeGreaterThanOrEqual(0),
    );
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    for (const id of HIDDEN_IN_PHASE_A) await expect(page.getByTestId(id)).toHaveCount(0);
    // W17/W152: CTA_BY_PATHNAME['/'] and every in-page CTA point here.
    await expect(page.locator('#proposal')).toHaveCount(1);
    await expect(page.getByTestId('hire-form')).toHaveAttribute('data-form-key', 'hire');
    // W95: the teaser's estimate link is the bare chat in the DOM.
    await expect(
      page.getByTestId('calc-teaser').locator('a[href^="https://wa.me/"]'),
    ).toHaveAttribute('href', WA);
    // The page's one FaqBlock → one FAQPage node (AEO only), beside the site-wide nodes.
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.filter((text) => text.includes('"@type":"FAQPage"'))).toHaveLength(1);
  });
}

test('the proposal form posts to hire: field errors first, then the fallback panel with a bare WhatsApp href (W3/W76/W79)', async ({
  page,
  baseURL,
}) => {
  test.skip(doorOn(baseURL), 'W92: never submit a test lead to a door-on target');
  await page.goto('/');
  await openHeroForm(page, 'proposal');
  const form = page.getByTestId('hire-form');
  // A missing required field or consent tick is a field error, never a door call.
  await form.locator('input[name="company"]').fill('Akdeniz Tekstil A.Ş.');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('input[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  await form.locator('input[name="name"]').fill('Ayşe Yılmaz');
  await form.locator('input[name="email"]').fill('ayse@example.com');
  await form.locator('input[name="phone"]').fill('+90 501 000 00 00');
  await form.locator('input[name="headcount"]').fill('15');
  const sector = form.locator('select[name="sector"]');
  if (await sector.isVisible()) {
    // from 461 px only — the design hides its optional fields on phones (W10)
    await sector.selectOption('factory');
    await form.locator('select[name="startWhen"]').selectOption('month1');
    await form.locator('input[name="city"]').fill('Antalya');
  }
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe('/');
  const wa = panel.locator('a[href^="https://wa.me/"]');
  await expect(wa).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await wa.click();
  const [url] = await opened(page);
  expect(decodeURIComponent(url ?? '')).toContain('Ayşe Yılmaz');
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    placement: 'form_fallback',
  });
});

test('call me back (phones only, as designed) posts to callback', async ({
  page,
  baseURL,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the mode buttons exist below 461 px only (W10)');
  test.skip(doorOn(baseURL), 'W92: never submit a test lead to a door-on target');
  await page.goto('/en');
  await page.getByTestId('hero-mode-callback').click();
  const form = page.getByTestId('callback-form');
  await expect(form).toHaveAttribute('data-form-key', 'callback');
  await expect(form.locator('input[name="name"]')).toBeFocused();
  await form.locator('input[name="name"]').fill('Mehmet Kaya');
  await form.locator('input[name="phone"]').fill('+90 532 000 00 00');
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(form.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe('/en');
});

test('the hero WhatsApp link carries only the fixed hire prefill and fires whatsapp_click (page_cta)', async ({
  page,
}) => {
  await page.goto('/');
  await openHeroForm(page, 'proposal');
  const link = page.getByTestId('hero-form').locator(`a[href^="${WA}?text="]`);
  await expect(link).toHaveCount(1);
  // Keep the tab here: a capture-phase preventDefault still lets React's handler run.
  await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true));
  await link.click();
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    placement: 'page_cta',
  });
});

test('the calculator teaser: server default, island on approach, engine figures, estimate composed on click (W2/W58/W95)', async ({
  page,
}) => {
  await page.goto('/');
  const teaser = page.getByTestId('calc-teaser');
  await expect(teaser.getByTestId('calc-monthly')).toHaveText(payrollTR(15));
  await teaser.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="calc-teaser"][data-island="ready"]')).toBeVisible();
  await page.locator('[data-testid="calc-teaser"] label', { hasText: '30 işçi' }).click();
  await expect(page.getByTestId('calc-monthly')).toHaveText(payrollTR(30));
  expect((await dataLayer(page, 'calculator_use')).at(-1)).toMatchObject({
    page: '/',
    locale: 'tr',
    role: 'generalPreset',
    headcount: 30,
  });
  const wa = page.getByTestId('calc-teaser').locator('a[href^="https://wa.me/"]');
  await expect(wa).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await wa.click();
  expect(decodeURIComponent((await opened(page))[0] ?? '')).toContain(payrollTR(30));
  expect((await dataLayer(page, 'whatsapp_click')).at(-1)).toMatchObject({
    placement: 'page_cta',
  });
});

test('the season planner hydrates on approach and answers a row selection', async ({ page }) => {
  await page.goto('/en');
  await page.getByTestId('season-planner').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="season-planner"][data-island="ready"]')).toBeVisible();
  await expect(page.locator('[data-now-marker]').first()).toBeAttached();
  const headline = page.getByTestId('season-headline');
  const before = await headline.innerText();
  await page.getByTestId('season-row-tourism').click();
  await expect(page.getByTestId('season-row-tourism')).toHaveAttribute('aria-pressed', 'true');
  await expect(headline).not.toHaveText(before);
});
```

- [ ] **Step 2: Run to verify it fails**

Not run here: Playwright needs a production server, and the task gets exactly one build + one start + one gate (W126, Cycle 7). Against the WP1 spike every case failed by construction (no `hero-form`, `calc-teaser`, `season-planner`, `#proposal`); Cycle 7 runs it green against the finished page. What this cycle proves locally is that the spec type-checks and lints (below).

- [ ] **Step 3: Implement — the WP2b ledger table**

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` is the WP2b plan the controller commits before T1 (the W57 pattern WP2a followed; W22 names it). Append this section at its end (W98 — this task creates the table and its row format; every later page task appends one row). If the file is not in the tree when this cycle runs, create it with the single line `# WP2b pages — ledger` followed by a blank line and the section; the controller folds the plan text in above it.

```markdown
## Ledger

One row per page task (W22/W98 — T1's format), from that task's proof session (W126: one build, one `next start`, one `npm run gate`): the per-route script size from `npm run js-size` (W136 — ceiling 204,800 B, lazy line 194,560 B), the Lighthouse median of three runs under DevTools throttling (W145), the D27 pixel scores for the four harness pages (`pixel <page> <locale>: 390 → … %, 900 → … %, 1440 → … %; run N of 2; deltas: (a) …; (b) …; (c) …; (d) accepted: …` — `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`), and the named deltas. The controller adds the binding preview figures to the same row after the push.

| Task | Routes (tr · en) | JS (`npm run js-size`, W136) | Lighthouse (median of 3, W145) | Pixel (D27) / named deltas | Date |
| --- | --- | --- | --- | --- | --- |
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write e2e/pages/home.spec.ts docs/superpowers/plans/2026-09-20-wp2b-pages.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green (tsc and ESLint cover `e2e/`; the spec's `readFileSync` of the bundle is outside `src/`, so the D23 import rule does not apply).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add e2e/pages/home.spec.ts docs/superpowers/plans/2026-09-20-wp2b-pages.md && git commit -m "test(home): page e2e — contract, section order, Phase A switches, both hero forms' fallbacks, lazy islands, contact events; WP2b ledger table (T1 c6)

Door-less targets answer unauthorized, so the fallback panel is deterministic (W92); the panel's
WhatsApp href is bare and the prefill is composed on click (W76/W95). The ledger table and its row
format are created here (W98).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 7 — The W126 proof session: one build, one start, one gate, js-size, the pixel harness, the ledger row

No new behaviour here: this cycle proves the page and records it. One heavy job at a time (owner's memory rule): the build, then the server with the gate, then the pixel runs, then the server is killed.

- [ ] **Step 1: Check for strays, then build once**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && (pgrep -fl 'next-server|next start|next build|chrome-headless|lighthouse' || echo "no strays") && NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

Expected: the build succeeds — this is the step that validates the RSC boundaries jsdom cannot see (W126): the sections are directive-less server components calling `useTranslations`, the three `'use client'` modules the page mounts directly (`HeroLeadForm`, `CalculatorTeaserIsland`, `SeasonPlannerIsland`) receive only serialisable props (strings, numbers, arrays, server-rendered nodes, the two server actions), and the islands' dynamic imports become their own chunks. The route table lists `/[locale]` as statically generated with a 1-day revalidate (W150). Any failure is a page defect: fix it, re-run the low-memory verify line, commit the fix (`fix(home): …`), and build again — still one build per attempt, never two at once.

- [ ] **Step 2: Start the server and run the gate once**

Precondition (W92): the shell exports no `OPS_API_URL` / `OPS_WEBSITE_WRITE_TOKEN` and the worktree has no `.env.local` carrying them, so both hero forms answer `unauthorized` and no test lead reaches Operations (`env | grep -c '^OPS_'` prints `0`; never print the values).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && (npm run start > "${TMPDIR:-/tmp}/t1-next-start.log" 2>&1 &) && until curl -sf -o /dev/null http://localhost:3000/; do sleep 1; done && E2E_BASE_URL=http://localhost:3000 npm run gate
```

Expected `gate: OK`:
- Playwright: every existing spec green on both projects — `routing` (the page contract on `/` and `/en`: one tagged h1 with real copy; the desktop nav's `/isci-talebi` link), `seo` (one h1, canonical `https://www.jobsadmire.com`, three hreflang links, the OG image, the Organization node), `a11y` (axe `wcag2a/aa/22aa` zero violations on both routes and projects, and the `region` sweep at 390/1000/1440 — every section sits inside `<main>`), `width-sweep` (no horizontal overflow at 1440…390; the season grid scrolls inside its own container between 461 and 640 px), `chrome` (the header CTA `href="/#proposal"`), `headers`, `smoke`, `thank-you`, `ops` (the refusal cases accept 401|503, W139), `redirects` — plus `e2e/pages/home.spec.ts`: 7 cases on `mobile`, 6 on `desktop` (the callback case skips there by design). `REVALIDATE_SECRET` unset → the two token cases in `ops.spec.ts` skip (expected).
- Lighthouse (`lighthouserc.local.json` = the production assertions, DevTools throttling, median of 3, W145) on `/`, `/en`, `/isci-talebi`, `/en/hire-workers`: performance ≥ 0.95, accessibility / best-practices / SEO = 1.0, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the LCP element on `/` is the hero h1), CLS ≤ 0.1 (the island swaps are DOM-identical; the season pill's slot keeps its height).
- A red Lighthouse assertion is never waived: read `lighthouse-report/` first (the LCP element, `bootup-time`, `mainthread-work-breakdown`), fix a page defect and re-run the gate; if the cause is outside the page (the forms kernel's first-load weight, the sourcing map's document weight — Foundation gaps (b)/(c)), stop and report the numbers for a controller ruling.

- [ ] **Step 3: Record the script size**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run js-size
```

Expected (W136, local figures from the gate's runs): `/` ≈ 186–190 KB and `/en` ≈ 183–187 KB — the 176,132 / 172,783 B baselines (6ef6989) plus the forms kernel's client set (`FormShell`, `Field`, `FormErrorsContext`, `Turnstile`, `FallbackPanel`, `guardAction`, `echo`, `errors` ≈ 7.5 KB gz — the hero card is above the fold, so it is eager), `HeroLeadForm` ≈ 1.2 KB, `Stat` (the hero `MetricStrip`) ≈ 0.7 KB, `LazyIsland` + `useInView` ≈ 1.2 KB, the two island binders ≈ 0.3 KB and ≈ 1 KB of per-chunk overhead. The teaser and planner chunks (≈ 2–3 KB each; no engine, no next-intl) load only when their section comes within 200 px of the viewport, which the audit's first viewport never reaches, so they are not counted. The binding preview figure runs ≈ 2.8 KB higher (178,968 B on `/` at `02ace58`): projected ≈ 189–193 KB, under the 194,560 B lazy line. `/isci-talebi` and `/en/hire-workers` do not move (nothing shared changed). If `/` or `/en` prints above 194,560 B, the lazy-loading pass comes before T13 starts (W13 amended): first replace the hero's `MetricStrip` count-up with a static figure list over `metricValues` (drops `Stat`, a named delta); if that is not enough, stop for a controller ruling (Foundation gaps (c)).

- [ ] **Step 4: Run the pixel harness (D27, at most two runs per locale)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run pixel -- --page=home --locale=tr --widths=390,900,1440 --base=http://localhost:3000 && npm run pixel -- --page=home --locale=en --widths=390,900,1440 --base=http://localhost:3000
```

Expected: both runs exit 0 (the design page and the build both answer 2xx; the W159 height check passes) and write `.pixel/report.json` + the `home-<locale>-<width>*.png` diffs (the harness needs network: the design runtime loads from unpkg). Read the six diffs and classify every visible delta (the rule in `docs/superpowers/plans/2026-09-20-wp2-pixel-harness.md`): (a) D20 faces — `blue-safe`/`nav`/`inverse`/`success` CTAs, secondary greys on pale surfaces, the white-on-`blue-safe` shortlist badge; (b) the ruled deltas at the top of this task — the W3/W79/W115 card (labels, name, e-mail, consent, `lg` submit), the W6 empty pool and the hidden ticker/team/proof cell, the W58 support row, the W8 Android-only portal line, the fraud link, `ProcessSteps`/`FaqBlock`/`ClosingCtaBand` faces, no sticky bar; (c) capture noise — the `v4-hero`/portal placeholders against the design's image-slot captions, the chips' radio focus ring, the FAB/bottom bar in a full-page shot, the height difference from the hidden sections; (d) a defect — fix it, re-run the verify line, commit, and run the harness a second (last) time (the build must be rebuilt first: one more `npm run build`, then `npm run start`). The cap counts from this first like-for-like run (W138).

- [ ] **Step 5: Stop the server and check for strays**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && (lsof -ti:3000 | xargs kill 2>/dev/null || true) && (pgrep -fl 'next-server|next start|chrome-headless|lighthouse' || echo "no strays")
```

Expected: `no strays`. (`.lighthouseci/` and `lighthouse-report/` from a local run hold no secret; after any PREVIEW run they must be deleted — W137 amended.)

- [ ] **Step 6: Write the ledger row and commit**

Append the T1 row to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the "**Ledger line**" template at the end of this task, every `<…>` filled from Steps 2–4 (`npm run js-size`'s table, `lighthouse-report/`, `.pixel/report.json` and your delta classification). Then:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md && npm run format && git add docs/superpowers/plans/2026-09-20-wp2b-pages.md && git commit -m "docs(home): T1 ledger row — js-size, Lighthouse medians, pixel scores and the named deltas (T1 c7)

Local proof session (W126): one build, one next start, npm run gate OK; js-size per route (W136);
LCP/perf medians under DevTools throttling (W145); pixel run N of 2 (D27/W138).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Never push (the controller pushes, then runs the binding preview gate and adds its figures to the row).

---

**Docs in this task:**
- `docs/CONTENT-MODEL.md` — the per-page `sys.*` bullet list created at the end of `### Adding copy (W9, W23, W54)` with the Homepage bullet (Cycle 1, W98).
- `docs/SEO.md` — the `## Pages` table created before `## Redirects policy (summary)` (columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`) with the Homepage row naming the LCP element (`h1`, `data-lcp-slot="h1"`, while `v4-hero` is a placeholder) (Cycle 1, W98).
- `docs/ARCHITECTURE.md` — § Routing: the page-private-folders paragraph; § Design system: "WP1 ships two real pages …" rewritten so it no longer calls the homepage a spike (Cycle 1).
- `docs/PRD.md` — §2: the Homepage row's "Forms carried" cell (`hire` + phone-only `callback`, W3/W16/W79, D13/D11); §11: the page-state parenthesis, leaving the clause "Hire Workers is still the spike placeholder until T2" for T2 (Cycle 2).
- `docs/ANALYTICS.md` — `### Page instrumentation (WP2b)` created before `## Conversion` with the Homepage bullet (Cycle 5, W98).
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the `## Ledger` table (Cycle 6, W98) and the T1 row (Cycle 7).
- No `docs/INTEGRATIONS.md` change: the `hire`/`callback` contracts are unchanged (T14 records the I4 instance map — on `/`: `hire` with company, name, email, phone, headcount, sector, city, startWhen; `callback` with name, phone, topic, city).

**Sys keys added (24, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `_home/__tests__/home-copy.test.ts`):** `sys.seo.home.title`, `sys.seo.home.description`, `sys.home.form.callbackSubmit`, `sys.home.whatsapp.hire`, `sys.home.whatsapp.partner`, `sys.home.whatsapp.estimate`, `sys.home.pool.empty.title`, `sys.home.pool.empty.body`, `sys.home.pool.empty.cta`, `sys.home.calc.eyebrowUndated`, `sys.home.calc.grossFloor`, `sys.home.calc.supportSeparate`, `sys.home.calc.headcount`, `sys.home.calc.monthlyPayroll`, `sys.home.season.agricultureSub`, `sys.home.season.range`, `sys.home.season.also`, `sys.home.season.signBy`, `sys.home.season.noPeak`, `sys.home.season.gridLabel`, `sys.home.season.selectHint`, `sys.home.network.mapTitle`, `sys.home.network.turkiye`, `sys.home.portal.platforms`. Consumed, not added: `sys.form.*` (labels `email`, the placeholders, `placeholders.select`, `consent.label`, `submit.sending`, `errors.*`, `fallback.*`), `sys.marquee.*` (none — no marquee on this page), `sys.nav.*` (chrome only).

**Package ids used:** 196 direct `home.*` ids, every one verified present in `src/content/local/catalogue.json` (first `home.003`, last `home.305`): hero `home.017`–`049`, `053`–`054` (proof cell, data-gated); ticker `055`, `201` (data-gated); choice cards `056`–`061`; pool eyebrow `003`; calculator `068`–`090`; process `091`–`095`, `104`–`118`, `224`–`227`; season `096`–`103`, `217`, `243`–`253`; network `119`–`126`, `202`; team `127`–`139`, `200` (data-gated); portal `162`–`169`, `173`, `174`, `207`, `209`, `213`, `215`, `216`; work with us `140`–`161`, `223`; guides `175`, `176`, `179`, `220` (blog-gated); FAQ `180`–`183`, `294`–`305`; band `184`, `185`, `187`, `221` (+ `022`, `202` above). Read through collection label ids: `home.050`/`051`/`052` + unit `home.206` (the `metrics` rows, by `MetricStrip`), `home.240`–`242` (the preset `calculatorRoles` rows), `home.262`–`265` (the `blog` rows' `categoryLabelId`, only while the guides block renders), `hire.240` (`StoreBadges`), `blog.034`/`077`/`081` (`PostCard`, blog-gated). Not read on purpose: `home.001`–`016`, `188`–`199`, `218`, `219`, `222`, `228` (chrome — R15 canonical ids, the layout renders them); `062`–`067` (the live-pool claims — the W6 empty state replaces them); `170`–`172` (the design's phone-only portal lines live inside a section it hides on phones, so they never show); `177`, `178`, `203`–`205` (the design's hard-coded featured card — `PostCard` over the `blog` collection replaces it); `186` (orphan); `208`, `210`–`212`, `214`, `254`–`261` (orphans / the unused `services` array); `229`–`239`, `266`–`293` (the design's data rows: pool cards, blog list, fabricated ticker cases).

**CLIENT_SYS additions:** none. No `'use client'` module of this task calls `useTranslations`; `HeroLeadForm`, `CalculatorTeaser` and `SeasonPlanner` receive every string resolved on the server, and the forms kernel reads only `sys.form`, already listed (W148).

**Foundation gaps:** none blocking. Notes: (a) the catalog v1.1 `city` on `hire` and `callback` is cited as `A/produces-final.md` § Task 8 spells it (optional, ≤ 120); Task 8 is being implemented now — the wire name is confirmed by the Task 8 report, and until Operations ships v1.1 the door drops `city` into `dropped` with a 200 (no error, no data loss beyond the city). (b) The final review's P-1 static per-locale `SourceMap` `<img>` has no build asset (`scripts/build-source-map.ts` emits only the TSX component); this task uses the rule's other branch, below-the-fold placement, and records the page weight — a static variant is a foundation change if the map's HTML + flight weight ever costs LCP/performance. (c) `LazyIsland` is viewport-only; there is no interaction-loaded wrapper, so the above-the-fold hero card keeps the forms kernel (≈ 7.5 KB gz) in the first-load graph — a problem only if the route crosses 194,560 B. (d) `StickyCtaBar`'s `hideNearId` cannot point at an above-the-fold anchor (`isBarVisible` hides the bar for good once the target is above the viewport) — one of the two reasons this page mounts no bar.

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>`):

```markdown
| T1 Homepage | `/` · `/en` | js-size (local): `/` <n> B · `/en` <n> B (ceiling 204,800; lazy line 194,560; projected ≈ 189–193 KB on the preview); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; `/en` perf <x.xx> · LCP <n> ms · CLS <n> | pixel home tr: 390 → <a> %, 900 → <b> %, 1440 → <c> %; pixel home en: 390 → <a> %, 900 → <b> %, 1440 → <c> %; run <1|2> of 2; deltas: (a) D20 faces (blue-safe/nav/inverse/success CTAs, secondary greys on pale, blue-safe shortlist badge); (b) W3/W79/W115 lead card (labels, name + e-mail, consent, lg submit), phone-only callback, W6 empty pool + hidden ticker/team/proof, W58 support row, W8 Android-only, fraud → /verify#report, ProcessSteps/FaqBlock/ClosingCtaBand faces, no sticky bar; (c) hero/portal placeholders, radio chips, FAB/bottom bar, hidden-section height; (d) accepted: <…> | <YYYY-MM-DD> |
```
