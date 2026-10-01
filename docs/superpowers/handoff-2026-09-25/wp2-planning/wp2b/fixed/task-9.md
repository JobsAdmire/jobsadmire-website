### Task 9: Success Stories — `/basari-hikayeleri` · `/en/success-stories` (the W6 empty approvals wall)

**Where this task runs.** Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation` (every foundation name below was read in the code at `bc708a3`). Execution order W99: T1 → T13 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → **T9** → T10 → … — so WP2a Tasks 1–9 and the page tasks T1, T13, T2–T8 are in the tree when this task starts: T1 created `docs/SEO.md`'s `## Pages` table, `docs/ANALYTICS.md`'s `### Page instrumentation (WP2b)` list, the per-page `sys.*` bullet list at the end of `docs/CONTENT-MODEL.md` § `### Adding copy (W9, W23, W54)`, the `## Ledger` table of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` and the `e2e/pages/` folder; T2 renders `id="request-form"` on `/isci-talebi`; T3, T4 and T7 built the calculator, work-permit and contact pages this page links to. Rules for the whole task: one heavy job at a time (memory rule); never push; never `git stash`; never rewrite a commit (W118); every commit verify-green with the low-memory line `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1` (never `npm run verify`, `npm test` or `npm run e2e`); run `npx prettier --write <the files the cycle touched>` before that line (the snippets below are not guaranteed prettier-formatted: `printWidth` 100, single quotes, trailing commas). Every command runs from the worktree root.

**What this page is in Phase A.** The design (`design-package/design/Success Stories.dc.html`, strings `success.001–151`) is a CRM-fed wall of redacted permit approvals with four hero figures (1,240+ / 68 / 41 days / 91 %), a "Numbers we do not hide" KPI box (7 % / +19 days / 4 % / 11), three employer quotes and two worker stories. None of it is signed or consented. W1 hides unsigned figures. D23 forbids the `stories` fixture on every Vercel build: `FIXTURE_ONLY_COLLECTIONS = ['pool', 'stories', 'representatives']` (`src/content/config.ts`) is enforced at runtime by `assertServableInProduction` (`src/content/pure.ts`, called by `getBundle` on every resolve — Vercel sets `NODE_ENV=production` on previews too) and at lint time by the ESLint `no-restricted-imports` rule over `**/content/local/*` and `**/design-package/**` (`eslint.config.mjs`, `src/**`). §10 row 11 keeps testimonials in their empty state until consent (v1.1). The design's own amber note (`success.033/034`) and disclaimer (`success.069`) call the figures and quotes placeholders. So the page ships the **designed empty wall (W6)**: the hero (the h1 is the named LCP element, no stat cards), the approvals wall with the site's sector chips and the "first approvals are on their way" state, and the closing CTA band. Every hidden section is a component that renders nothing on empty or unsigned data — nothing is deleted: the day Operations publishes a `stories` row (Phase B, I10) the cards, the live badge and the result line appear without a code change; the hero metric strip, the KPI box and the worker stories additionally wait for an owner sign-off pinned in `_lib/signoff.ts`.

**No form.** PRD §2 row 11: "none". The design has zero `<form>`; its lead exits are links (the WhatsApp job order, a call booking → Contact, the calculator). So there is **no `actions.ts`**, no form schema, no catalog mapping, no consent row (W79), no `START_WHEN_KEYS` (W78), no `Field` labels (W115), no fallback panel and no door dependency (W92 — the e2e is deterministic on any face). The page's conversions are `whatsapp_click` (`placement: 'page_cta'`) through `ContactCta` inside `EmptyState` and `ClosingCtaBand`, and internal navigations. Both wa.me hrefs carry only a **static** `sys.stories.*` prefill (W76/W95).

**Header CTA and anchors (W17/W121/W152/W158).** `/success-stories` has no `CTA_BY_PATHNAME` entry (`src/design/chrome/ctas.ts`), so the header renders `DEFAULT_CTAS`: primary `home.014` + `home.015` → `{ pathname: '/hire-workers', hash: '#request-form' }` (TR `/isci-talebi#request-form`, EN `/en/hire-workers#request-form`), secondary `home.008` → `/partner-with-us`. The launch sweep checks each anchor on the page its LINK points at (`anchorOf(href)` in `scripts/launch/dead-targets.ts`: "The page to check is the one the LINK points at (`href.pathname`), never the table key the entry sits under"), so `id="request-form"` is T2's to render on Hire Workers — this page does NOT render it, owns no header anchor and edits nothing in `ctas.ts`. It renders its own in-page targets: `#cases` (the wall) and `#talk` (the closing band — the hero's "Discuss your case" lands there).

**Design deltas (named for the Fable side-by-side review, D27 — this is not a pixel-harness page):**

1. Hero figures, live badge, "Numbers we do not hide" box, testimonials and worker stories render nothing in Phase A (W1/W6/§10 row 11/D23); without a signed hero metric the hero is one text column (the design's stat grid appears only when `STORIES_HERO_METRICS` is non-empty). The worker stories need a published approval AND `WORKER_STORIES_CONSENTED` — they narrate two identifiable people ("she reported it"), §10 row 11.
2. Sector chips use the site's one `sectors` taxonomy (keys `factory|construction|tourism|agriculture|textile|logistics|other`, labels `hire.076–082`) plus the design's "All sectors" (`success.124`), not the design's private `hotels|construction|factory|agriculture|logistics|food` enum — a story's `sector` is the key every form sends. `success.125–130` are not rendered.
3. The ≤700 px "Latest approvals" swipe slider, the `:nth-child` hiding, show-more and the proof frame (redact bars, watermark, "1 / N", view/hide proof) are v1.1 (D9, D22 scope ladder); v1 is one responsive card grid (1 → 2 → 3 columns). The chips are the `RadioChips` primitive (native radios, 44 px targets, D20).
4. The band's third action ("Or estimate the cost yourself →", `success.083`) is a button in `ClosingCtaBand`'s `extra` slot (the block has no text-link slot).
5. The design's absolute `www.jobsadmire.com/contact-us`, `/work-permit`, `/available-workers`, `/hiring-cost-calculator` links become typed `pathnames` hrefs, localized per locale.
6. Filter state is not URL-addressable (PRD §4: facet views canonicalise to the base page); no `approval_filter` event (not allow-listed, W12).
7. No false claim on an empty wall: `success.025` ("Below are the actual work permit approvals we obtained…") renders only while an approval is published; in Phase A the hero body is `sys.stories.hero.bodyEmpty`. `success.037` (legal-flagged: names and passport numbers "blacked out — the stamp, the date and the decision are not") describes the v1.1 redacted documents, so v1 never renders it; the wall intro is `sys.stories.wall.intro`.
8. The band's WhatsApp prefill ("Hello JobsAdmire, I saw your permit approvals. I need workers for: ", design line 1119, no id) becomes `sys.stories.whatsappPrefill` without the untrue "I saw your permit approvals" clause; the empty state's example request has its own `sys.stories.empty.prefill`.
9. The live badge drops "· live from CRM / sample data" (`success.138–140`, which presume a browser feed): one ICU count, `sys.stories.hero.liveBadge`.
10. Card headcount = `formatInt(headcount) + ' ' + success.041` because the package itself splits number and unit (W23); EN reads "1 work permits" for a one-person approval — accepted, noted for the marketing review.
11. The band surface: the design's blue gradient (#1899D5 → #1073a8 with white copy — 3.2:1, below AA for body text) maps onto `ClosingCtaBand tone="gradient"` (ink → navy). The WhatsApp primary wears the `success` face (W127 — the site's WhatsApp CTA face, like the design's white button); the secondary and the extra keep the gradient tone's own `inverse` face (W128(b): the navy and gradient tones keep `inverse`; `inverse-dark` belongs to `tone="green"`, which this band does not use). A D20 delta.
12. The hero photo slot `ss-hero` is a named gradient placeholder (§10 row 4: "gradients elsewhere") inside a positioning wrapper (W129 — the slot owns its 1440 : 620 box): below `md` it covers the top of the hero and the section's navy fills the rest, under the design's two overlays; the section surface is `bg-navy` (#0e1a37), not the design's #0a1428.
13. `#cases` and `#talk` land below the sticky header (`scroll-mt-24`; the design's 20 px assumed a non-sticky nav).
14. The empty state's WhatsApp CTA (the example job-order request) keeps `EmptyState`'s own `secondary` face (the block renders `variant={tone === 'dark' ? 'inverse' : 'secondary'}` through `ContactCta`, and this page uses `tone="pale"`), not the `success` face the closing band's WhatsApp primary wears (delta 11). Accepted by W178 as a named D20 delta.

**Files:**

Create
- `src/app/[locale]/(site)/success-stories/_lib/stories.ts` — `StorySchema`, `type Story`, `TestimonialSchema`, `type Testimonial`, `readStories`, `readTestimonials`, `type StoryCardData`, `storyCards` (the page-local `stories`/`testimonials` door — accepted page-local by the reconcile rulings; Phase B moves the schemas into `collections.ts`)
- `src/app/[locale]/(site)/success-stories/_lib/signoff.ts` — the owner sign-offs: `STORIES_HERO_METRICS`, `type NegativeKpi`, `NEGATIVE_KPIS`, `WORKER_STORIES_CONSENTED`
- `src/app/[locale]/(site)/success-stories/_lib/wall.ts` — `ALL_SECTORS`, `type WallResultCopy`, `wallResultLabels` (pure; imported by the page AND the island)
- `src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx` — one approval card (no directive, no hooks)
- `src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx` — `'use client'`: chips + result line + card grid + the per-sector empty state; the W6 empty state arrives as a server-rendered node
- `src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx` — hero pill, nothing without stories
- `src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx` — the dark KPI box, nothing while no listed KPI is signed
- `src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx` — nothing without consented rows
- `src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx` — nothing unless `visible`
- `src/app/[locale]/(site)/success-stories/page.tsx` — the server page (metadata, hero, wall, gated sections, closing band)
- `src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/signoff.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx`
- `src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx`
- `src/app/[locale]/(site)/success-stories/__tests__/ids.test.ts`
- `e2e/pages/success-stories.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — a `stories` member inside the existing `sys.seo` object, and a new `sys.stories` object placed immediately before `sys.form` (T8's convention for `sys.workers`); identical key sets (Cycle 2)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the line `'/success-stories',` (nothing else) (Cycle 5)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/basari-hikayeleri', indexable: true }` and `{ path: '/en/success-stories', indexable: true }` as the literal's last two entries (Cycle 5)
- `docs/CONTENT-MODEL.md` — one paragraph in `## Collections` (Cycle 1) and one bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (Cycle 2, W98)
- `docs/INTEGRATIONS.md` — one sentence in `## I10 — Success stories (cards)` (Cycle 1)
- `docs/SEO.md` — one row in T1's `## Pages` table (Cycle 5, W98)
- `docs/ANALYTICS.md` — one bullet under `### Page instrumentation (WP2b)` (Cycle 5, W98; no new event, parameter or enum value)
- `docs/PRD.md` — §2, the table row whose page cell is `Success Stories` (its last cell), and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**" (the page count), edited in place (Cycle 5, W45)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T9 row of the `## Ledger` table (Cycle 6)

Test
- Vitest: the six files under `success-stories/__tests__/` (matched by `vitest.config.mts`'s `src/**/*.test.{ts,tsx}`; `[locale]`/`(site)` are literal directory names the glob walks), plus the existing guards this task must keep green: `src/lib/seo/unbuilt.test.ts` (W20 — red while `page.tsx` and `UNBUILT_PATHNAMES` disagree), `src/messages/messages.test.ts` (TR/EN key parity), `src/messages/voice.test.ts` (W154 over all of `sys.*`), `src/i18n/client-messages.test.ts` (W148 — no client module of this task reads `sys`), `src/design/__tests__/client-imports.test.ts` (W147/W156 — by-path imports, type-only included), `src/design/__tests__/class-collisions.test.ts` (W122/W155 — walks `src/app/**`), `scripts/gate-routes.test.ts` (TR/EN halves of the gate table stay equal).
- Playwright: `e2e/pages/success-stories.spec.ts` (both projects, `mobile` Pixel 7 and `desktop` 1440×900), run inside Cycle 6's gate; `e2e/routing.spec.ts` (page contract), `e2e/seo.spec.ts` (canonical/hreflang/sitemap), `e2e/a11y.spec.ts` and `e2e/width-sweep.spec.ts` pick the two routes up from `GATE_ROUTES`/`INDEXABLE_GATE_ROUTES` automatically.

**Interfaces:**

Consumes (exact names, verified in the code at `bc708a3`; import paths exactly as written — never a barrel, type-only imports included, W134/W147/W156):
- Content: `getBundle(locale: Locale): Promise<Bundle>` (`server-only`, React `cache`; runs `assertServableInProduction(bundle, contentSource())`) and `makeTf` from `@/content/adapter` (`export * from './pure'`); `makeTf(bundle, locale): (id: string) => string` (D17 placeholder fill) and `assertServableInProduction(bundle, source: ContentSource, env = process.env.NODE_ENV)` (throws `collections <keys> are never served from LOCAL in production (D23)`; a no-op for `OPS` and outside production) from `@/content/pure`; `FIXTURE_ONLY_COLLECTIONS` from `@/content/config`; `getCollection(bundle, 'sectors' | 'countries' | 'metrics')`, `SECTOR_KEYS`, `type SectorKey`, `METRIC_KEYS`, `type MetricKey`, `type Metric` (`{ key; value: number | null; text: string | null; suffix: '+' | ''; labelId: string | null; unitId: string | null }`) from `@/content/collections` (`Sector` rows `{ key, labelId, subtitleId, icon }`; `Country` rows `{ code, name, dial }`, `name` locale-resolved); `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: five `..` from `page.tsx`, six from `_lib/`, `_components/`, `__tests__/`). The LOCAL bundles carry no `stories`/`testimonials` key; `pages.stories` = `{ titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb'] }`; `settings.whatsappNumber` = `905011240340`; seven `sectors` rows.
- Blocks (by path, `@/design/blocks/<Name>`): `Breadcrumbs` + `type Crumb` from `@/design/blocks/Breadcrumbs` (`{ locale, items: Crumb[], tone?: 'light' | 'dark', className? }`, `Crumb = { name: string; href: Href }`; renders `<nav aria-label={sys('nav.breadcrumbs')}>`, the last crumb as `aria-current="page"` text, and ONE `BreadcrumbList` JSON-LD node via `breadcrumbJsonLd` + `absoluteUrl`); `ClosingCtaBand` from `@/design/blocks/ClosingCtaBand` (`{ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, extra?: Cta[], ticks?, tone?: 'navy' | 'gradient' | 'green', id? }`, `Cta = { label; href: string | Exclude<Href, string>; external?; variant?: ButtonVariant }`; every CTA through `ContactCta` `page_cta`; secondary/extra default to the tone's face — `inverse` on navy/gradient, `inverse-dark` on green, W128); `EmptyState` from `@/design/blocks/EmptyState` (`{ title, body?, cta?: { label, href, external? }, tone?: 'light' | 'pale' | 'dark', icon?, headingLevel?: 2 | 3 (default 3), testId?, className? }`, `role="status"`, CTA through `ContactCta` `page_cta` in the `secondary` face); `ImageSlot` from `@/design/blocks/ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }`; no `src` → a gradient `<div data-placeholder={slot}>` with `aspect-ratio: width / height` and `w-full h-auto object-cover`; `alt=""` → `aria-hidden`; `data-lcp-slot` only with `lcp`; W129 — never pass `w-*`/`h-*`/`aspect-*`/`object-*`); `MetricStrip` from `@/design/blocks/MetricStrip` (`{ bundle, locale, metrics: MetricKey[], tone?, className? }`, `null` when no requested metric is signed).
- Primitives (by path, `@/design/primitives/<Name>`): `Button` from `@/design/primitives/Button` (`variant` ∈ `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`, `size?: 'md' | 'lg'`, `href?` string — `/…` → typed next-intl `Link` (localized), `#…` → a same-tab `<a>` (R22), no `href` → `<button type="button">`; `external?`; `…HTMLAttributes<HTMLElement>` incl. `onClick`); `Card` from `@/design/primitives/Card` (`{ hover?, as?: 'article' | 'div', className?, children }`); `Eyebrow` from `@/design/primitives/Eyebrow` (children only); `Section` from `@/design/primitives/Section` (`{ tone: 'light' | 'dark' | 'pale' | 'band', id?, className?, children }` — tones set the surface and `py-16`/`py-10`; a longhand `pt-*` override is fine, W122; no test-id prop, W113); `Stat` from `@/design/primitives/Stat` (`'use client'`; `{ value?, text?, prefix?, suffix?, label, locale, tone? }`); `RadioChips` + `type RadioChipOption` (`{ value: string; label: string }`) from `@/design/primitives/RadioChips` (`'use client'`; `{ name, options, value, onChange, legend, legendHidden?, className? }` — a `role="radiogroup"` fieldset of native sr-only radios under chip labels).
- i18n/SEO/contact/format: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `hasLocale`, `useTranslations`, `createTranslator` (tests) from `next-intl`; `getTranslations({ locale, namespace })`, `setRequestLocale` from `next-intl/server`; `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` from `@/lib/seo/metadata` (a `''` record id → the fallback, W38; `og:image` → `pageOgImageUrl(locale, 'stories')` = `https://www.jobsadmire.com/og/<locale>/stories.png`, `'stories'` ∈ `OG_PAGE_KEYS`; the OG route titles it from `sys.seo.stories.title`); `UNBUILT_PATHNAMES` (edited) from `@/lib/seo/routes`; `waLink(number, text)` from `@/lib/contact`; `formatMonth(iso, locale)` from `@/lib/format/date/formatMonth` (pure — TR `Haziran 2026`, EN `June 2026`; never the barrel `@/lib/format/date`, W156); `formatInt(n, locale)` from `@/lib/format/money`.
- Test helpers: `renderWithIntl(ui, { locale? })` from `@/test/render` (the real `sys.*` catalogues); `testBundle({ strings?, collections?, settings? })` from `@/test/bundle` (the golden fixture: 20 strings, empty collections; `makeT` throws on an unknown id outside production); `collisionsInTree(root)` from `@/test/class-collisions` (the W122 render-side guard).
- Chrome (read, not edited): `DEFAULT_CTAS`/`CTA_BY_PATHNAME` in `src/design/chrome/ctas.ts` (no `/success-stories` key); `ContactLink` (`'use client'`, fires `whatsapp_click` `{ page, locale, placement }` through `track()` into `window.dataLayer` on click and middle-click) reached only through `ContactCta`; `src/i18n/client-messages.ts` `CLIENT_SYS` = `consent, languageHint, errorTitle, errorRetry, form, calc` (T3 appended `calc`; unchanged by this task).
- Messages consumed, not added: `sys.nav.breadcrumbs` (the `Breadcrumbs` landmark name).
- Gate tooling: `GATE_ROUTE_TABLE` (`e2e/routes.ts`), `npm run gate` / `npm run gate:launch` (`scripts/gate.sh`; the launch profile's `scripts/launch/dead-targets.ts` and `scripts/placeholder-count.ts`), `npm run js-size` (`scripts/js-size.mjs`); the placeholder counter's contract: exactly one `data-lcp-slot` per page, never on a `data-placeholder` element.
- Ops catalog (`website-form-catalog.ts`, v1.0 + the four v1.1 fields confirmed live by the Task 8 as-built report): nothing — this page sends no form.

Produces (nothing later tasks import):
- DOM: `section#cases` (the wall; the island root `data-testid="stories-wall"`; in Phase A it holds `EmptyState` `data-testid="stories-empty"`); `section#talk` (the closing band; inner `data-testid="stories-closing"`); one `data-lcp-slot` (the h1, `data-testid="page-h1"`); one placeholder `ss-hero`; data-gated test ids `stories-live`, `stories-numbers`, `stories-testimonials`, `stories-workers`, `stories-result`, `stories-grid`, `stories-none-in-sector` (absent in Phase A).
- Data contract: `StorySchema`'s row — `{ id, sector: SectorKey, roles, headcount, approvedAt: 'YYYY-MM-DD', place (city only), countries: ISO-2[] }` — the D9 v1 `successStory` card Phase B's CMS emits under `collections.stories`; `TestimonialSchema` `{ id, quote, role, org, initials }` for `collections.testimonials`. Recorded in `docs/CONTENT-MODEL.md` § Collections and `docs/INTEGRATIONS.md` I10 (Cycle 1).

**Rulings applied:**
- W1/D17 — the design's four hero figures and four negative KPIs are unsigned: `STORIES_HERO_METRICS` and `NEGATIVE_KPIS` are empty and pinned; every figure that ever renders comes from the `metrics` collection (`MetricStrip`, `Stat`), never a literal; the month labels come from `approvedAt` through `formatMonth`.
- W6 — the designed empty wall: sector chips + "first approvals are on their way" (`sys.stories.empty.*`) + the closing band; metrics hero, live badge, KPI box, testimonials and worker stories render nothing on empty or unsigned data (components kept, nothing deleted).
- W7 — the new copy says Türkiye, never Turkey (the importer already normalised the package strings).
- W9/W23/W54 — 14 `sys.stories.*`/`sys.seo.stories.*` keys for id-less copy only; every other string is a `success.*` id by exact id through `makeTf`; the only composed package strings are the package's own splits (`023` + `024` h1, `041` after the headcount).
- W12/W26 — no page event (`approval_filter` is not allow-listed); the two wa.me doors are `ContactCta` → `ContactLink` with `placement: 'page_cta'`.
- W13 amended/W120/W136 — one light island (`ApprovalsWall`: `RadioChips` + `Button` + `Card`), a plain client import (it is the main content); the ledger's JS figure is `js-size`'s.
- W17/W121/W152/W158 — no `ctas.ts` edit; the header renders `DEFAULT_CTAS`, whose `#request-form` the launch sweep checks on `/hire-workers` (T2); this page renders its own `#cases`/`#talk`; Cycle 6 proves the sweep names neither route nor anchor of this page.
- W19/R31 — lives in the `(site)` group; no `<main>` (the layout owns `<main id="main">`).
- W20/W21 — `'/success-stories'` leaves `UNBUILT_PATHNAMES` in the commit that adds `page.tsx`; the two locale paths join `GATE_ROUTE_TABLE` and nowhere else.
- W22/W45/W98 — every doc edit appends to T1's shared shapes and anchors on headings/sentences, never line numbers; the ledger row is T1's format.
- W27/W55/D26 — `ss-hero` is a named placeholder; exactly one `data-lcp-slot` (the h1), never on the placeholder.
- W38 — `pages.stories` has `''` ids → `sys.seo.stories.{title,description}` are the fallbacks `buildMetadata` renders.
- W76/W95 — both wa.me hrefs carry a static `sys.stories.*` prefill; nothing a visitor chose ever sits in a DOM href.
- W82 — string hrefs only (`/contact`, `/hiring-cost-calculator`, `/work-permit`, `#talk`), localized by `Button`'s `Link` branch.
- W92 — no door dependency; the e2e is deterministic door-less.
- W97 (analogue) — a hidden section renders no empty `Section` wrapper: each gated component owns its `Section` and returns `null`.
- W99 — T9 runs after T1, T13, T2–T8. W106 — `page.tsx` lands in one commit with the components it imports (Cycles 1–4 first, the page in Cycle 5). W109 — breadcrumbs from the page's own ids: `success.022` → `/`, `success.013` → this page.
- W113 — test ids sit on inner `<div>`s (or the island root / `EmptyState`'s `testId`), never on `Section`.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — no `hidden` beside an unprefixed display utility; no class string sets one property twice at one variant (shorthand + longhand such as `py-16`/`pt-0` is fine); no colour/box class reaches `Button`/`ContactCta` (a different look is a variant); `class-collisions.test.ts` scans every file below and the render tests call `collisionsInTree`.
- W125/W130/W134/W147/W156 — primitives, blocks and the date function by module path everywhere, type-only imports included; no server file imports `@/analytics/useContactClick`; no island barrel.
- W126/W164 — Cycle 6 is the one build + start + gate (+ js-size and the launch dead-target check): one capped build per proof attempt, no interim build and no conditional re-proof build (T9 is not a D27 page, and a W162 crossing stops and reports instead of running a lazy pass); the page spec's red step in Cycle 5 is collect-only (`npx playwright test e2e/pages/success-stories.spec.ts --list`, no server, red by construction through the `(site)/[...rest]` 404) and the spec executes once, in Cycle 6's gate (the T1–T8 pattern).
- W127/W128 — the band's WhatsApp primary is the `success` variant; `tone="gradient"` keeps `inverse` for the secondary/extra; `inverse-dark` is the green tone's face and is not used; no caller colour classes.
- W129 — `ImageSlot` is placed by a wrapper `<div>`; it receives no box class (`w-*`/`h-*`/`aspect-*`/`object-*`) — only `opacity-60`, a property the slot's own box does not set.
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json` = production: DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors); GTM stays dark.
- W137/W139/W140 — no preview run by the implementer (never push); the controller's binding preview runs use `--settings.extraHeaders`.
- W148 — no `CLIENT_SYS` change: `ApprovalsWall` calls no `useTranslations`; the page resolves the result line (`wallResultLabels`) and every other string on the server, so `sys.stories.*` never enters every page's client payload.
- W150 — no D17 dated badge → no `revalidate` export (SSG like every static page).
- W154 — no `sys.stories.*`/`sys.seo.stories.*` string speaks as "we"/"biz" ("JobsAdmire" is the subject; the two prefills are the visitor's first-person singular); `voice.test.ts` scans all of `sys.*`; the package's first-person lines (`success.044`, `048`, `072`, `077`, `079`, `080`, `081`) render as authored and go on the WP-C sheet.
- W157/W160 — security headers come from the middleware; nothing for the page. W161 — no `url` field is sent.
- W162 — the lazy-line stop rule is local-adjusted: the binding JS figure is the controller's preview `npm run js-size` (lazy line 194,560 B, W136), which runs ≈ 2,836 B above the local build (176,132 → 178,968 B at 02ace58), so Cycle 6 stops and reports when a LOCAL route figure is ≥ **191,724 B** (194,560 − 2,836); this page writes no lazy cycle in advance and adds no second build.
- W178 — the `EmptyState` WhatsApp CTA keeps the block's `secondary` face: an accepted D20 delta (design delta 14, named in the Ledger line); the closing band's WhatsApp primary stays `success` (delta 11).
- Final-review page rule (§6) — exactly one `Breadcrumbs` (one `BreadcrumbList`, one breadcrumb landmark); no `FaqBlock` on this page.
- Reconcile check B-1 — the island imports `Button`/`RadioChips` by path and receives the W6 `EmptyState` as a server-rendered node, so no block reaches the client graph.
- Reconcile "accepted as page-local" — the `stories`/`testimonials` Zod schemas live in `_lib/stories.ts` until Phase B.
- §10 rows 2/4/11 — unsigned metrics hidden; gradient placeholder with the LCP rule enforced; testimonials and the worker stories wait for consent.
- D2/D9/D13/D18/D19/D20/D22/D23/D27 and R15/R22/R28/R35/R56 — v1 cards without scans; no identifiers in analytics; `formatInt`/`formatMonth` per locale; unscaled breakpoints (`md` 701, `lg` 901); accessibility over pixels; proof frames v1.1; no fixture import (lint + a page-folder guard); Fable review, not a pixel page; the chrome renders its own canonical ids; `#talk` is a same-tab anchor, wa.me opens a new tab with `noopener`; a bad row throws in dev and degrades in prod; `page` from `next/navigation`; no `src/content/local/*` or `design-package/**` import from `src/**` (tests read the JSON with `readFileSync`).

---

- [ ] **Cycle 1 — the data door: `stories`/`testimonials` readers and the W1/§10-row-11 sign-off pins**

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FIXTURE_ONLY_COLLECTIONS } from '@/content/config';
import { assertServableInProduction } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import {
  readStories,
  readTestimonials,
  storyCards,
  StorySchema,
  type Story,
} from '../_lib/stories';

// The v1 card shape (D9): sector, roles, headcount, approval month, city-only place, countries.
const ROW: Story = {
  id: 'AP-2026-118',
  sector: 'tourism',
  roles: 'Kat görevlileri, mutfak yardımcıları',
  headcount: 12,
  approvedAt: '2026-06-01',
  place: 'Antalya',
  countries: ['KG', 'PK'],
};

const SECTORS = [
  { key: 'tourism', labelId: 'hire.078', subtitleId: null, icon: 'tourism' },
  { key: 'factory', labelId: 'hire.076', subtitleId: null, icon: 'factory' },
];
const COUNTRIES = [
  { code: 'KG', name: 'Kırgızistan', dial: '+996' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
];
const STRINGS = {
  'hire.078': 'Turizm / Konaklama',
  'hire.076': 'Fabrika / Üretim',
  'success.041': 'çalışma izni',
};

describe('the stories collection can never be served from LOCAL in production (D23)', () => {
  it('is a fixture-only collection', () => {
    expect(FIXTURE_ONLY_COLLECTIONS).toContain('stories');
  });
  it('is refused by the adapter guard when it carries rows', () => {
    const bundle = testBundle({ collections: { stories: [ROW] } });
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).toThrow(
      /stories.*never served from LOCAL/,
    );
    // The same rows from Operations (Phase B) are fine — that is the whole point of the guard.
    expect(() => assertServableInProduction(bundle, 'OPS', 'production')).not.toThrow();
  });
  it('the committed LOCAL bundles carry no stories (or testimonial) rows, so a production build serves the W6 empty wall', () => {
    for (const locale of ['tr', 'en'] as const) {
      // readFileSync, never an import: `**/content/local/*` is import-banned in src/** (the D23
      // ESLint rule); `src/content/local-bundle.test.ts` reads the same files the same way.
      const raw = readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8');
      const bundle = BundleSchema.parse(JSON.parse(raw));
      expect(bundle.collections.stories ?? []).toEqual([]);
      expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).not.toThrow();
      expect(readStories(bundle)).toEqual([]);
      // §10 row 11: no consented testimonial exists in Phase A either (not a D23 fixture key,
      // so the adapter guard does not cover it — this pin does).
      expect(readTestimonials(bundle)).toEqual([]);
    }
  });
});

describe('readStories', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('is empty when the bundle has no stories key (Phase A)', () => {
    expect(readStories(testBundle())).toEqual([]);
  });
  it('parses well-formed rows', () => {
    expect(readStories(testBundle({ collections: { stories: [ROW] } }))).toEqual([ROW]);
  });
  it('throws outside production on a row that misses the schema', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const bad = { ...ROW, headcount: 'twelve' };
    expect(() => readStories(testBundle({ collections: { stories: [bad] } }))).toThrow(
      /stories.*schema/,
    );
  });
  it('degrades to an empty wall in production on a bad row', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = { ...ROW, sector: 'hotels' }; // the design's private enum, not the site's
    expect(readStories(testBundle({ collections: { stories: [bad] } }))).toEqual([]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('accepts only the site sector keys, upper-case ISO-2 countries and full dates', () => {
    expect(StorySchema.safeParse({ ...ROW, sector: 'hotels' }).success).toBe(false);
    expect(StorySchema.safeParse({ ...ROW, countries: ['kg'] }).success).toBe(false);
    expect(StorySchema.safeParse({ ...ROW, approvedAt: '2026-06' }).success).toBe(false);
  });
});

describe('storyCards', () => {
  it('resolves labels for the island: sector label, localized month, country names, headcount', () => {
    const bundle = testBundle({
      strings: STRINGS,
      collections: { stories: [ROW], sectors: SECTORS, countries: COUNTRIES },
    });
    const [card] = storyCards(bundle, 'tr', readStories(bundle));
    expect(card).toEqual({
      id: 'AP-2026-118',
      sector: 'tourism',
      sectorLabel: 'Turizm / Konaklama',
      roles: 'Kat görevlileri, mutfak yardımcıları',
      headcountLabel: '12 çalışma izni',
      monthLabel: 'Haziran 2026',
      place: 'Antalya',
      countries: ['Kırgızistan', 'Pakistan'],
    });
  });
  it('formats the headcount per locale (D18) and falls back to the code for an unknown country', () => {
    const bundle = testBundle({
      strings: { ...STRINGS, 'success.041': 'work permits' },
      collections: {
        stories: [{ ...ROW, headcount: 1240, countries: ['ZZ'] }],
        sectors: SECTORS,
        countries: COUNTRIES,
      },
    });
    const [card] = storyCards(bundle, 'en', readStories(bundle));
    expect(card.headcountLabel).toBe('1,240 work permits');
    expect(card.monthLabel).toBe('June 2026');
    expect(card.countries).toEqual(['ZZ']);
  });
  it('sorts newest approval first', () => {
    const older: Story = { ...ROW, id: 'AP-2025-063', approvedAt: '2025-08-01' };
    const bundle = testBundle({
      strings: STRINGS,
      collections: { stories: [older, ROW], sectors: SECTORS, countries: COUNTRIES },
    });
    expect(storyCards(bundle, 'tr', readStories(bundle)).map((c) => c.id)).toEqual([
      'AP-2026-118',
      'AP-2025-063',
    ]);
  });
});

describe('readTestimonials', () => {
  it('is empty in Phase A (§10 row 11) and parses a consented row', () => {
    expect(readTestimonials(testBundle())).toEqual([]);
    const row = {
      id: 't1',
      quote: '“…”',
      role: 'İK Müdürü',
      org: 'Otel grubu · Kemer',
      initials: 'HK',
    };
    expect(readTestimonials(testBundle({ collections: { testimonials: [row] } }))).toEqual([
      row,
    ]);
  });
});
```

`src/app/[locale]/(site)/success-stories/__tests__/signoff.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { METRIC_KEYS } from '@/content/collections';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS, WORKER_STORIES_CONSENTED } from '../_lib/signoff';

// W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
// 41 days to first shift / 91 % still employed at 12 months) and its four negative KPIs
// (7 % / +19 days / 4 % / 11) are not signed metrics — success.029 ("since 2019") also
// contradicts the licence date the About page carries. The hero strip and the KPI box
// therefore read empty lists and render nothing (W6). §10 row 11 additionally withholds the
// worker stories — they narrate two identifiable people — behind their own consent flag,
// separate from `published`. Signing a metric or consenting the worker stories is a data
// edit to this one file, in the same commit as the pin below.
describe('Success Stories owner sign-offs (W1, §10 row 11)', () => {
  it('lists no hero metric and no negative KPI until the owner signs them', () => {
    expect(STORIES_HERO_METRICS).toEqual([]);
    expect(NEGATIVE_KPIS).toEqual([]);
  });
  it('can only ever name real metric keys', () => {
    for (const k of STORIES_HERO_METRICS) expect(METRIC_KEYS).toContain(k);
    for (const k of NEGATIVE_KPIS) expect(METRIC_KEYS).toContain(k.key);
  });
  it('keeps the worker stories unconsented until the owner signs them off', () => {
    expect(WORKER_STORIES_CONSENTED).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories" --maxWorkers=1
```

Both files fail at import: `Failed to resolve import "../_lib/stories"` / `"../_lib/signoff"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_lib/stories.ts`:

```ts
import { z } from 'zod';
import { getCollection, SECTOR_KEYS, type SectorKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
// By module path, never the barrel `@/lib/format/date` (W156): the barrel's `formatDate.ts`
// and `formatReadMinutes.ts` import both message JSON files — dead weight this page-local
// module has no reason to carry, and a guard now fails a barrel import of this folder anyway.
import { formatMonth } from '@/lib/format/date/formatMonth';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * One published permit approval — the v1 card (D9): sector, roles, headcount, approval month,
 * city-only place, source countries. No scan, no document, no name (v1.1 adds the proof image).
 * `stories` is a FIXTURE_ONLY collection (D23): under LOCAL it is empty on every Vercel build,
 * so Phase A renders the W6 empty wall; Phase B's Ops bundle fills it (I10). The schema is
 * page-local by ruling (reconcile § Accepted as page-local); Phase B moves it to collections.ts.
 */
export const StorySchema = z.object({
  id: z.string().min(1),
  /** The site's one sector taxonomy (`sectors` collection), never the design's private enum. */
  sector: z.enum(SECTOR_KEYS),
  /** Free text, locale-resolved by the bundle ("Kat görevlileri, mutfak yardımcıları"). */
  roles: z.string().min(1),
  headcount: z.number().int().positive(),
  /** Calendar date of the approval; rendered as a month (D17 dated label) — never typed. */
  approvedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** City only (D9) — never a company name. */
  place: z.string().min(1),
  /** Upper-case ISO-2 (W40), resolved to names through the `countries` collection. */
  countries: z.array(z.string().regex(/^[A-Z]{2}$/)),
});
export type Story = z.infer<typeof StorySchema>;

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  role: z.string().min(1),
  org: z.string().min(1),
  initials: z.string().min(1).max(3),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

/** The same dev-throw / prod-degrade rule as `getCollection` (which types only the eight Phase A
 *  collections; `stories` and `testimonials` are Phase B rows read here, R28). */
function readRows<T>(bundle: Bundle, key: string, schema: z.ZodType<T>): T[] {
  const parsed = z.array(schema).safeParse(bundle.collections[key] ?? []);
  if (parsed.success) return parsed.data;
  const issue = parsed.error.issues[0];
  const message = `collection "${key}" does not match its schema at ${issue?.path.join('.')}: ${issue?.message}`;
  if (process.env.NODE_ENV !== 'production') throw new Error(message);
  console.error(`[content] ${message}`);
  return [];
}

export function readStories(bundle: Bundle): Story[] {
  return readRows(bundle, 'stories', StorySchema);
}

/** Consented employer quotes (§10 row 11, v1.1). Empty until then — the design's three quotes
 *  (success.060–068) are self-declared placeholders (success.069) and are never rendered. */
export function readTestimonials(bundle: Bundle): Testimonial[] {
  return readRows(bundle, 'testimonials', TestimonialSchema);
}

/** What the client island renders — every label resolved on the server, so the island imports
 *  no bundle, no date formatter and no message file (D6/W13). The island imports this TYPE only
 *  (`import type`, erased at compile time), never this module's runtime. */
export type StoryCardData = {
  id: string;
  sector: SectorKey;
  sectorLabel: string;
  roles: string;
  /** `formatInt(headcount) + ' ' + t('success.041')` — the package itself splits number and unit. */
  headcountLabel: string;
  /** `formatMonth(approvedAt)` — TR "Haziran 2026", EN "June 2026". */
  monthLabel: string;
  place: string;
  countries: string[];
};

export function storyCards(bundle: Bundle, locale: Locale, stories: Story[]): StoryCardData[] {
  const t = makeTf(bundle, locale);
  const sectorLabel = new Map(getCollection(bundle, 'sectors').map((s) => [s.key, t(s.labelId)]));
  const countryName = new Map(getCollection(bundle, 'countries').map((c) => [c.code, c.name]));
  const unit = t('success.041');
  return [...stories]
    .sort((a, b) => (a.approvedAt < b.approvedAt ? 1 : a.approvedAt > b.approvedAt ? -1 : 0))
    .map((s) => ({
      id: s.id,
      sector: s.sector,
      sectorLabel: sectorLabel.get(s.sector) ?? s.sector,
      roles: s.roles,
      headcountLabel: `${formatInt(s.headcount, locale)} ${unit}`,
      monthLabel: formatMonth(s.approvedAt, locale),
      place: s.place,
      countries: s.countries.map((code) => countryName.get(code) ?? code),
    }));
}
```

`src/app/[locale]/(site)/success-stories/_lib/signoff.ts`:

```ts
import type { MetricKey } from '@/content/collections';

/**
 * W1: the design's four hero figures (1,240+ workers placed / 68 employers since 2019 /
 * 41 days to first shift / 91 % still employed at 12 months) are not signed metrics — and
 * success.029 ("since 2019") contradicts the licence date the About page carries. The hero
 * strip therefore reads an EMPTY list and `MetricStrip` renders nothing (W6). When the owner
 * signs a page metric it is emitted under a `METRIC_KEYS` entry and listed here;
 * `__tests__/signoff.test.ts` pins the current state.
 */
export const STORIES_HERO_METRICS: MetricKey[] = [];

/** The "Numbers we do not hide" box (success.046–057): four negative KPIs with a body line each.
 *  Unsigned (W1) → empty → `NumbersBox` returns null. Shape kept so signing one is a data edit. */
export type NegativeKpi = { key: MetricKey; labelId: string; bodyId: string };
export const NEGATIVE_KPIS: NegativeKpi[] = [];

/** §10 row 11: the two worker stories (success.070–078) narrate two identifiable people — a
 *  name-shaped card title and "she reported it" — a different privacy question from a bare
 *  approval count. `WorkerStories` therefore gates on `published && WORKER_STORIES_CONSENTED`,
 *  never on `published` alone: an approval appearing on the wall does not by itself authorise
 *  naming the two workers. Flip to `true` only once the owner signs the consent off. */
export const WORKER_STORIES_CONSENTED = false;
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/success-stories/_lib" "src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts" "src/app/[locale]/(site)/success-stories/__tests__/signoff.test.ts"
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories" --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Both new files green (15 cases: 12 + 3 — `stories.test.ts`'s four `describe` blocks total 12, `signoff.test.ts` 3). The low-memory line is green (nothing imports the new modules yet, so tsc/lint/format see only additions).

`docs/CONTENT-MODEL.md` — § `## Collections`: after the paragraph whose last sentence ends "…become collections when an editor needs to reorder them.", add a new paragraph:

```markdown
**`stories` / `testimonials` (Phase B, I10; page-local schemas in Phase A by ruling).** The Success Stories page reads `collections.stories` through `StorySchema` in `src/app/[locale]/(site)/success-stories/_lib/stories.ts`: `{ id, sector: SectorKey, roles, headcount, approvedAt: 'YYYY-MM-DD', place (city only, D9), countries: ISO-2[] }` — the v1 `successStory` card (no proof image until v1.1). It is a `FIXTURE_ONLY` collection: empty under `LOCAL` on every Vercel build (D23 — `assertServableInProduction` refuses rows), so Phase A renders the W6 empty wall. `testimonials` (§10 row 11): `{ id, quote, role, org, initials }`, consented rows only. A bad row throws in development and degrades to an empty wall in production (R28). Phase B moves both schemas into `collections.ts`.
```

`docs/INTEGRATIONS.md` — § `## I10 — Success stories (cards)`: after the sentence ending "item type `successStory`." insert one sentence:

```markdown
Row shape = `StorySchema` in the Success Stories page's `_lib/stories.ts` (`docs/CONTENT-MODEL.md` § Collections); Phase A serves no rows (D23).
```

```bash
npx prettier --write docs/CONTENT-MODEL.md docs/INTEGRATIONS.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Green (`prettier --check .` covers the doc edits; `website-docs-guard`-style prose has no test of its own in this repo).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/_lib" "src/app/[locale]/(site)/success-stories/__tests__/stories.test.ts" "src/app/[locale]/(site)/success-stories/__tests__/signoff.test.ts" docs/CONTENT-MODEL.md docs/INTEGRATIONS.md
git commit -m "feat(stories): stories/testimonials collection readers and the W1/§10-row-11 sign-off pins (T9 c1)

The stories fixture is asserted refused from LOCAL in production and absent from both
committed LOCAL bundles (D23); the hero and KPI
metric lists are empty under W1 and the worker stories stay unconsented, all pinned by test.
Collection shape and the I10 row-shape pointer documented.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 2 — `sys.stories.*` + `sys.seo.stories.*` copy in both message files**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this page reads (W9/W23) — the page never reads a key outside this list,
 *  and both locale files carry every key (`messages.test.ts` asserts the two sets are
 *  identical; this pins that the page's own keys exist at all, with the right shape). */
export const STORIES_SYS_KEYS = [
  'seo.stories.title',
  'seo.stories.description',
  'stories.hero.bodyEmpty',
  'stories.hero.liveBadge',
  'stories.wall.intro',
  'stories.wall.legend',
  'stories.wall.showingAll',
  'stories.wall.showingFiltered',
  'stories.empty.title',
  'stories.empty.body',
  'stories.empty.cta',
  'stories.empty.prefill',
  'stories.whatsappPrefill',
  'stories.workers.card1Title',
] as const;

const get = (root: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      root,
    );

describe('sys.stories.* / sys.seo.stories.* (W9, W23)', () => {
  it.each(STORIES_SYS_KEYS)('%s exists in both locales as a non-empty string', (key) => {
    for (const messages of [tr, en]) {
      const v = get(messages.sys, key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
  it('the hero live-badge count is real ICU (LiveBadge is server-rendered, W148 n/a)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.liveBadge')).toMatch(/\{count, plural,/);
    }
  });
  it('the wall result lines are plain {token} strings, never ICU (the island does not call useTranslations, W148)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.wall.showingAll')).toContain('{count}');
      expect(get(messages.sys, 'stories.wall.showingAll')).not.toMatch(/\{count, plural,/);
      const filtered = get(messages.sys, 'stories.wall.showingFiltered') as string;
      expect(filtered).toContain('{shown}');
      expect(filtered).toContain('{total}');
    }
  });
  it('the SEO title ends with the brand and says Türkiye, not Turkey (W7)', () => {
    expect(get(en.sys, 'seo.stories.title')).toMatch(/Türkiye.*\| JobsAdmire$/);
    expect(get(tr.sys, 'seo.stories.title')).toMatch(/\| JobsAdmire$/);
    expect(get(en.sys, 'seo.stories.description')).not.toMatch(/\bTurkey\b/);
  });
  it('the empty-wall copy never claims that approvals are shown (delta 7)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.bodyEmpty')).not.toMatch(/Below|Aşağıda/);
      expect(get(messages.sys, 'stories.whatsappPrefill')).not.toMatch(/saw your|gördüm/);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts" --maxWorkers=1
```

Every `it.each` row fails (`expected 'undefined' to be 'string'`), and the ICU/token/SEO/claim cases fail on `undefined`.

- [ ] **Step 3: Implement**

`src/messages/tr.json` — inside the existing `"sys"` object: add a `"stories"` key inside the existing `"seo"` object (beside `"ogTagline"` and the page keys earlier tasks added — leave those untouched), and add a new `"stories"` object immediately before the existing `"form"` key of `"sys"` (T8's convention for `sys.workers`, so the whole file keeps one growing order rather than every task fighting over "last key"). Exact JSON to merge (keep the file's 2-space indent; Prettier checks it):

```json
"seo": {
  "…existing keys unchanged…": "…",
  "stories": {
    "title": "Başarı Hikâyeleri — Türkiye'deki İşverenler İçin Çalışma İzni Onayları | JobsAdmire",
    "description": "JobsAdmire'ın Türkiye'deki işverenler için aldığı çalışma izni onayları sektör, kişi sayısı ve ay bilgisiyle yayınlanır; kişisel bilgiler çıkarılır."
  }
},
"…thankYou unchanged…": "…",
"stories": {
  "hero": {
    "bodyEmpty": "JobsAdmire'ın Türkiye'deki işverenler için aldığı çalışma izni onayları burada yayınlanacak: sektör, kişi sayısı ve ay. Kişisel bilgiler çıkarılır.",
    "liveBadge": "{count, plural, one {# izin onaylandı} other {# izin onaylandı}}"
  },
  "wall": {
    "intro": "Yayınlanan her onay bir karttır: sektör, kişi sayısı, onay ayı ve şehir. Kişisel bilgiler ve belgeler gösterilmez.",
    "legend": "Sektöre göre filtreleyin",
    "showingAll": "Toplam {count} onay gösteriliyor",
    "showingFiltered": "{total} onaydan {shown} tanesi gösteriliyor"
  },
  "empty": {
    "title": "İlk onaylar yolda",
    "body": "Yayınlanan her çalışma izni onayı burada sektörü, kişi sayısı ve ayıyla yer alacak. Şimdiden bir örnek görmek için JobsAdmire'a yazın.",
    "cta": "WhatsApp'tan bir örnek isteyin",
    "prefill": "Merhaba JobsAdmire, aldığınız çalışma izni onaylarından bir örneğini görebilir miyim?"
  },
  "whatsappPrefill": "Merhaba JobsAdmire, şu pozisyonlar için işçiye ihtiyacım var: ",
  "workers": {
    "card1Title": "Kaynakçı · Özbekistan → Ankara"
  }
},
"form": { "…unchanged…": "…" }
```

`src/messages/en.json` — same positions:

```json
"seo": {
  "…existing keys unchanged…": "…",
  "stories": {
    "title": "Success Stories — Work Permit Approvals for Employers in Türkiye | JobsAdmire",
    "description": "Work permit approvals JobsAdmire obtains for employers in Türkiye, published by sector, headcount and month with personal details removed."
  }
},
"…thankYou unchanged…": "…",
"stories": {
  "hero": {
    "bodyEmpty": "The work permit approvals JobsAdmire obtains for employers in Türkiye will be published here — the sector, the headcount and the month. Personal details are removed.",
    "liveBadge": "{count, plural, one {# permit approved} other {# permits approved}}"
  },
  "wall": {
    "intro": "Each published approval is a card: sector, headcount, approval month and city. Personal details and documents are never shown.",
    "legend": "Filter by sector",
    "showingAll": "Showing all {count} approvals",
    "showingFiltered": "Showing {shown} of {total} approvals"
  },
  "empty": {
    "title": "The first approvals are on their way",
    "body": "Every published work permit approval will appear here — its sector, headcount and month. Ask for an example now, on WhatsApp.",
    "cta": "Ask for an example on WhatsApp",
    "prefill": "Hello JobsAdmire, could you show me an example of a work permit approval you obtained?"
  },
  "whatsappPrefill": "Hello JobsAdmire, I need workers for: ",
  "workers": {
    "card1Title": "Welder · Uzbekistan → Ankara"
  }
},
"form": { "…unchanged…": "…" }
```

(The `"…unchanged…"`/`"…existing keys unchanged…"` lines are markers for this plan, not JSON to paste — only the `"stories"` members are added; every other key of `sys`/`sys.seo` stays exactly where it is, and `"stories"` (the page namespace) is inserted as the object immediately before `"form"`, not appended at the very end — the two files already differ from the 2026-09-24 draft here, since T2–T8 will each have inserted their own page namespace the same way.)

Why these keys and not package ids (W9/W23): the live badge's "N permits approved · live from CRM / sample data" (`success.138–140`) presumes a browser feed and must never render "sample data" — replaced by one ICU count (`stories.hero.liveBadge`, resolved server-side by `LiveBadge`, a plain server component — W148 does not apply to it); the result line's "of" / "approvals" words have no ids (`success.141/142` are only the fragments "Showing all" / "Showing") and, because the island resolves them itself with live filter state and must never call `useTranslations` (W148 — the whole point of `_lib/wall.ts`), `showingAll`/`showingFiltered` are plain `{token}` strings the page reads with `sys.raw(...)` and hands the island as data, not real ICU (Cycle 4 does the substitution); the W6 empty state and the empty-wall hero body are new copy by ruling (delta 7); `success.037` describes the v1.1 redacted documents, so the v1 wall intro is sys copy (delta 7); the design's band prefill (page line 1119) has no id and its "I saw your permit approvals" clause is untrue on an empty wall (delta 8); worker card 1's title (page line 776) has no id; `sys.seo.stories.*` because the `stories` page record has `titleId: ''`/`descriptionId: ''` (the package carries no SEO strings for this page). `sys.stories.*` reaches every page's client provider under the current denylist rule (W90) but this task adds no client reader of it (W148 — see the Rulings applied section): `LiveBadge`, `NumbersBox`, `Testimonials` and `WorkerStories` are server components, and `ApprovalsWall` receives every string as a prop.

- [ ] **Step 4: Verify**

```bash
npx prettier --write src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts"
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts" src/messages --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

`sys-keys.test.ts` green (18 cases: 14 `it.each` rows + 4). `messages.test.ts` and `voice.test.ts` stay green (identical TR/EN key sets; no `sys.stories.*`/`sys.seo.stories.*` string uses "we"/"biz" — `JobsAdmire` is the subject of the two hero/empty bodies and the two prefills are the visitor's own first-person singular, outside the plural pattern `voice.test.ts` scans for). The low-memory line is green.

`docs/CONTENT-MODEL.md` — § `### Adding copy (W9, W23, W54)`: append one bullet at the end of the per-page list T1 started (after the last bullet an earlier task added):

```markdown
- **Success Stories (T9, W6/W9/W23):** `sys.stories.hero.{bodyEmpty,liveBadge}` (`bodyEmpty` replaces `success.025` — "Below are the actual approvals…" — while none is published; `liveBadge` is the ICU `{count}` a server component resolves, replacing the design's "N permits approved · live from CRM / sample data", which must never render), `sys.stories.wall.{intro,legend,showingAll,showingFiltered}` (`intro` replaces the legal-flagged `success.037`, which describes the v1.1 redacted documents; `showingAll`/`showingFiltered` are plain `{token}` strings — not ICU — because the client island resolves them itself from live filter state and must never call `useTranslations`, W148); `sys.stories.empty.{title,body,cta,prefill}` (the W6 "first approvals are on their way" wall); `sys.stories.whatsappPrefill` (the band's job-order prefill — the design's line-1119 text without its "I saw your approvals" clause); `sys.stories.workers.card1Title` (design line 776, no id); `sys.seo.stories.{title,description}`. `success.025`/`success.037` are listed for the WP-C legal sheet.
```

```bash
npx prettier --write docs/CONTENT-MODEL.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/success-stories/__tests__/sys-keys.test.ts" docs/CONTENT-MODEL.md
git commit -m "feat(stories): sys.stories.* and sys.seo.stories.* copy, TR + EN (T9 c2)

W6 empty-wall copy, the empty-wall hero body and wall intro (no claim that approvals are
shown), the server-resolved ICU live-badge count, the two plain-token wall result lines the
island interpolates itself (W148 — no useTranslations there), the two static WhatsApp
prefills and the id-less worker card title (W9); SEO fallbacks because the page record has
no SEO ids (W23/W38).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 3 — the data-gated sections: LiveBadge, NumbersBox, Testimonials, WorkerStories (each owns its `Section`, returns `null` on empty/unsigned/unconsented data)**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';
import { LiveBadge } from '../_components/LiveBadge';
import { NumbersBox } from '../_components/NumbersBox';
import { Testimonials } from '../_components/Testimonials';
import { WorkerStories } from '../_components/WorkerStories';
import type { Story } from '../_lib/stories';

const STORY: Story = {
  id: 'AP-2026-118',
  sector: 'tourism',
  roles: 'Kat görevlileri',
  headcount: 12,
  approvedAt: '2026-06-01',
  place: 'Antalya',
  countries: ['KG'],
};

const WORKER_STRINGS = {
  'success.070': 'Diğer taraf',
  'success.071': 'İşçi oraya gitmek için hiçbir şey ödemedi',
  'success.072': 'Bir yerleştirme, ancak iki taraf için de işe yaradıysa başarılıdır.',
  'success.073': 'Şimdi kimlerin müsait olduğunu görün →',
  'success.074': 'Partner bir enstitüde meslek sınavına girdi.',
  'success.075': '0 ödedi · 22 aydır işte',
  'success.076': 'Kat görevlisi · Nepal → Antalya',
  'success.077': 'Bizi bulmadan önce yerel bir aracı ondan “vize ücreti” istedi.',
  'success.078': '0 ödedi · aynı otelde ikinci sezon',
};
const KPI_STRINGS = {
  'success.046': 'Sakladığımız sayılar değil',
  'success.047': 'Kimse insanların %100’ünü zamanında yerleştiremez',
  'success.048': 'Bunlar bizimkiler.',
  'success.049': 'İlk seferde reddedilen izinler',
  'success.050': 'Tümü yeniden sunuldu ve onaylandı.',
};
const QUOTE_STRINGS = {
  'success.058': 'Kendi sözleriyle',
  'success.059': 'Sezon bittiğinde işverenler ne diyor',
};

describe('data-gated sections render nothing on empty/unsigned/unconsented data (W1, W6, §10 row 11)', () => {
  it('LiveBadge: null without stories, the ICU headcount total with them', () => {
    const { container, rerender } = renderWithIntl(<LiveBadge stories={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<LiveBadge stories={[STORY, { ...STORY, id: 'b', headcount: 30 }]} />);
    expect(screen.getByTestId('stories-live')).toHaveTextContent('42 izin onaylandı');
  });

  it('NumbersBox: null with no listed KPI, the box with a signed one', () => {
    const { container } = renderWithIntl(
      <NumbersBox bundle={testBundle()} locale="tr" kpis={[]} />,
    );
    expect(container).toBeEmptyDOMElement();

    // `placed` stands in for a future negative-KPI key: the test exercises the rendering path.
    const signed = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [
          { key: 'placed', value: 7, text: null, suffix: '', labelId: 'success.049', unitId: null },
        ],
      },
    });
    renderWithIntl(
      <NumbersBox
        bundle={signed}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    const box = screen.getByTestId('stories-numbers');
    expect(box).toHaveTextContent('Kimse insanların %100’ünü zamanında yerleştiremez');
    expect(box).toHaveTextContent('7');
    expect(box).toHaveTextContent('İlk seferde reddedilen izinler');
    expect(box).toHaveTextContent('Tümü yeniden sunuldu ve onaylandı.');
  });

  it('NumbersBox: a listed KPI whose metric is unsigned (value and text null) is skipped', () => {
    const b = testBundle({
      strings: KPI_STRINGS,
      collections: {
        metrics: [{ key: 'placed', value: null, text: null, suffix: '', labelId: null, unitId: null }],
      },
    });
    const { container } = renderWithIntl(
      <NumbersBox
        bundle={b}
        locale="tr"
        kpis={[{ key: 'placed', labelId: 'success.049', bodyId: 'success.050' }]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Testimonials: null on no rows, quote cards with rows — never the placeholder disclaimer', () => {
    const b = testBundle({ strings: QUOTE_STRINGS });
    const { container, rerender } = renderWithIntl(
      <Testimonials bundle={b} locale="tr" items={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <Testimonials
        bundle={b}
        locale="tr"
        items={[
          {
            id: 't1',
            quote: '“Evrak süreci kolay ilerledi.”',
            role: 'İK Müdürü',
            org: 'Otel grubu · Kemer',
            initials: 'HK',
          },
        ]}
      />,
    );
    const sec = screen.getByTestId('stories-testimonials');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Sezon bittiğinde işverenler ne diyor' }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('“Evrak süreci kolay ilerledi.”');
    expect(sec).toHaveTextContent('HK');
    expect(sec).toHaveTextContent('Otel grubu · Kemer');
    expect(sec).not.toHaveTextContent(/yer tutucu|placeholder/i);
  });

  it('WorkerStories: null while not visible (published but unconsented, or unpublished), the two cards when visible', () => {
    const b = testBundle({ strings: WORKER_STRINGS });
    const { container, rerender } = renderWithIntl(
      <WorkerStories bundle={b} locale="tr" visible={false} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<WorkerStories bundle={b} locale="tr" visible />);
    const sec = screen.getByTestId('stories-workers');
    expect(
      screen.getByRole('heading', { level: 2, name: WORKER_STRINGS['success.071'] }),
    ).toBeInTheDocument();
    expect(sec).toHaveTextContent('Kaynakçı · Özbekistan → Ankara'); // sys.stories.workers.card1Title
    expect(sec).toHaveTextContent('Kat görevlisi · Nepal → Antalya'); // success.076
    expect(screen.getByRole('link', { name: WORKER_STRINGS['success.073'] })).toHaveAttribute(
      'href',
      '/adaylar',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx" --maxWorkers=1
```

Fails at import: `Failed to resolve import "../_components/LiveBadge"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx` (server component; `useTranslations` is legal in a non-async RSC and stays server-only here — it is never imported by the client island, so `sys.stories.*` does not need `CLIENT_SYS`, W148):

```tsx
import { useTranslations } from 'next-intl';
import type { Story } from '../_lib/stories';

/** The hero's green live pill. The design summed headcounts and appended "live from CRM" /
 *  "sample data" (success.138–140) — wording that presumes a browser feed and must never
 *  render. Here: the ICU total only, and nothing at all while no approval is published. */
export function LiveBadge({ stories }: { stories: Story[] }) {
  const sys = useTranslations('sys');
  if (stories.length === 0) return null;
  const count = stories.reduce((n, s) => n + s.headcount, 0);
  return (
    <p
      data-testid="stories-live"
      className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-success/40 bg-success/10 px-4 py-1.5 text-body-sm font-extrabold text-success-surface"
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
      {sys('stories.hero.liveBadge', { count })}
    </p>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx`:

```tsx
import { getCollection, type Metric } from '@/content/collections';
import { makeTf } from '@/content/pure';
// By module path (W147): a barrel import of `@/design/primitives` from this server component
// would make every 'use client' primitive it re-exports (RadioChips, Stat…) a client reference
// of the whole route, even though this file itself has no directive.
import { Section } from '@/design/primitives/Section';
import { Stat } from '@/design/primitives/Stat';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { NegativeKpi } from '../_lib/signoff';

const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null));

/** "Numbers we do not hide" (success.046–057): the design's dark KPI box. Every figure comes
 *  from the `metrics` collection through the page's `NEGATIVE_KPIS` table — never typed (D17).
 *  Empty table, or no listed KPI signed (W1), or a listed KPI whose metric carries neither a
 *  `value` nor a `text` → null. This component owns its own `Section` (W97 analogue): when it
 *  returns null there is no empty pale band left behind. Test id on an inner div (W113). */
export function NumbersBox({
  bundle,
  locale,
  kpis,
}: {
  bundle: Bundle;
  locale: Locale;
  kpis: NegativeKpi[];
}) {
  if (kpis.length === 0) return null;
  const rows = getCollection(bundle, 'metrics');
  const shown = kpis
    .map((k) => ({ kpi: k, metric: rows.find((m) => m.key === k.key) }))
    .filter((x): x is { kpi: NegativeKpi; metric: Metric } => signed(x.metric));
  if (shown.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="band">
      <div className="container-site">
        <div
          data-testid="stories-numbers"
          className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#253063] via-[#1c2652] to-[#131c40] px-6 py-8 text-white lg:px-11 lg:py-10"
        >
          <div className="mb-8 max-w-[640px]">
            <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">
              {t('success.046')}
            </p>
            <h2 className="m-0 mb-3 text-h2 text-white">{t('success.047')}</h2>
            <p className="m-0 text-body text-white/75">{t('success.048')}</p>
          </div>
          <ul className="m-0 grid list-none gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map(({ kpi, metric }) => (
              <li key={kpi.key} className="bg-navy/60 px-6 py-6">
                <Stat
                  value={metric.value ?? undefined}
                  text={metric.text ?? undefined}
                  suffix={metric.unitId ? `${metric.suffix} ${t(metric.unitId)}` : metric.suffix}
                  label={t(kpi.labelId)}
                  locale={locale}
                  tone="dark"
                />
                <p className="m-0 mt-2 text-body-sm text-white/65">{t(kpi.bodyId)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx`:

```tsx
import { makeTf } from '@/content/pure';
import { Card } from '@/design/primitives/Card';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Testimonial } from '../_lib/stories';

/** "In their words" (success.058–068). Only consented rows render (§10 row 11 — the design's
 *  three quotes are self-declared placeholders, success.069, never shown); no rows → null.
 *  No Review JSON-LD in v1. Owns its own `Section` (W97 analogue). */
export function Testimonials({
  bundle,
  locale,
  items,
}: {
  bundle: Bundle;
  locale: Locale;
  items: Testimonial[];
}) {
  if (items.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="light" className="pt-0">
      <div className="container-site" data-testid="stories-testimonials">
        <Eyebrow>{t('success.058')}</Eyebrow>
        <h2 className="m-0 mb-6 text-h2">{t('success.059')}</h2>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {items.map((q) => (
            <li key={q.id} className="min-w-0">
              <Card as="article" className="flex h-full flex-col gap-5">
                <blockquote className="m-0 text-body font-bold text-ink">{q.quote}</blockquote>
                <div className="mt-auto flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-tint text-body-sm font-extrabold text-blue-safe"
                  >
                    {q.initials}
                  </span>
                  <div>
                    <p className="m-0 text-body-sm font-extrabold text-ink">{q.role}</p>
                    <p className="m-0 text-body-sm text-text-tertiary">{q.org}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { Card } from '@/design/primitives/Card';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** "The other side" (success.070–078): two worker stories framing the published approvals.
 *  The design gates it on a `showWorkerStories` prop defaulting to true; here `visible` is the
 *  page's `published && WORKER_STORIES_CONSENTED` (`_lib/signoff.ts`) — an approval on the wall
 *  is not by itself consent to name the two workers (§10 row 11), so this component takes the
 *  already-combined boolean rather than importing the flags itself. Card 1's title has no
 *  package id (design line 776) → `sys.stories.workers.card1Title` (W9). Owns its own `Section`
 *  (W97 analogue). */
export function WorkerStories({
  bundle,
  locale,
  visible,
}: {
  bundle: Bundle;
  locale: Locale;
  visible: boolean;
}) {
  const sys = useTranslations('sys');
  if (!visible) return null;
  const t = makeTf(bundle, locale);
  const cards = [
    { title: sys('stories.workers.card1Title'), bodyId: 'success.074', footId: 'success.075' },
    { title: t('success.076'), bodyId: 'success.077', footId: 'success.078' },
  ];
  return (
    <Section tone="light" className="pt-0">
      <div className="container-site" data-testid="stories-workers">
        <div className="rounded-hero border border-border-1 bg-gradient-to-b from-pale-1 to-tint px-6 py-8 lg:px-9 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Eyebrow>{t('success.070')}</Eyebrow>
              <h2 className="m-0 mb-3 text-h2">{t('success.071')}</h2>
              <p className="m-0 mb-4 text-body text-text-secondary">{t('success.072')}</p>
              <Link
                href="/available-workers"
                className="text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
              >
                {t('success.073')}
              </Link>
            </div>
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
              {cards.map((c) => (
                <li key={c.bodyId} className="min-w-0">
                  <Card as="article" className="flex h-full flex-col gap-2">
                    <h3 className="m-0 text-body-sm font-extrabold text-blue-safe">{c.title}</h3>
                    <p className="m-0 text-body-sm text-text-secondary">{t(c.bodyId)}</p>
                    <p className="m-0 mt-auto text-body-sm font-extrabold text-success-text">
                      {t(c.footId)}
                    </p>
                  </Card>
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

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx" "src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx" "src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx" "src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx" "src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx"
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories" --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

`hidden-sections.test.tsx`'s 5 cases green (LiveBadge, two NumbersBox cases, Testimonials, WorkerStories); the three earlier test files stay green, 38 cases total across the folder (12 + 3 + 18 + 5). `src/design/__tests__/client-imports.test.ts` stays green: none of these four files carries `'use client'`, and none is reached from `ApprovalsWall` (Cycle 4) or any other client module, so the by-path primitive imports here are simply correct hygiene, not yet load-bearing for that guard. The low-memory line is green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/_components/LiveBadge.tsx" "src/app/[locale]/(site)/success-stories/_components/NumbersBox.tsx" "src/app/[locale]/(site)/success-stories/_components/Testimonials.tsx" "src/app/[locale]/(site)/success-stories/_components/WorkerStories.tsx" "src/app/[locale]/(site)/success-stories/__tests__/hidden-sections.test.tsx"
git commit -m "feat(stories): data-gated sections — live badge, KPI box, testimonials, worker stories (T9 c3)

Each owns its own Section and returns null on empty/unsigned/unconsented data (W1, W6, §10
row 11, W97 analogue); WorkerStories takes the already-combined published && consented
boolean rather than reading _lib/signoff.ts itself. Primitives imported by module path
(W147).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 4 — the approvals wall island: `_lib/wall.ts`, `StoryCard`, `ApprovalsWall` (chips, cards, both empty states)**

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { collisionsInTree } from '@/test/class-collisions';
import { ApprovalsWall } from '../_components/ApprovalsWall';
import type { StoryCardData } from '../_lib/stories';
import type { WallResultCopy } from '../_lib/wall';

const SECTORS = [
  { value: 'all', label: 'Tüm sektörler' },
  { value: 'tourism', label: 'Turizm / Konaklama' },
  { value: 'factory', label: 'Fabrika / Üretim' },
];
// The page passes a server-rendered <EmptyState> here; the island only decides WHEN it shows.
const EMPTY = (
  <div role="status" data-testid="stories-empty">
    İlk onaylar yolda
  </div>
);
const NONE = {
  title: 'Bu sektörde henüz yayınlanmış onay yok',
  body: 'Bize sorun, size bir tanesini gösterelim.',
  reset: 'Tüm sektörleri göster',
};
// The exact tr.json / en.json templates from Cycle 2 (`sys.stories.wall.*`) — plain `{token}`
// strings, never ICU: this island calls no `useTranslations` (W148), so the test renders it
// with the bare `@testing-library/react` `render`, not `renderWithIntl` — a stray hook call
// would throw with no provider mounted, which is the point (a locked-in "no i18n here" proof).
const TR_TEMPLATES: WallResultCopy = {
  showingAll: 'Toplam {count} onay gösteriliyor',
  showingFiltered: '{total} onaydan {shown} tanesi gösteriliyor',
};
const EN_TEMPLATES: WallResultCopy = {
  showingAll: 'Showing all {count} approvals',
  showingFiltered: 'Showing {shown} of {total} approvals',
};
const CARDS: StoryCardData[] = [
  {
    id: 'AP-2026-118',
    sector: 'tourism',
    sectorLabel: 'Turizm / Konaklama',
    roles: 'Kat görevlileri',
    headcountLabel: '12 çalışma izni',
    monthLabel: 'Haziran 2026',
    place: 'Antalya',
    countries: ['Kırgızistan', 'Pakistan'],
  },
  {
    id: 'AP-2025-063',
    sector: 'factory',
    sectorLabel: 'Fabrika / Üretim',
    roles: 'Makine operatörleri',
    headcountLabel: '8 çalışma izni',
    monthLabel: 'Ağustos 2025',
    place: 'Gaziantep',
    countries: ['Hindistan'],
  },
];

const wall = (stories: StoryCardData[], locale: 'tr' | 'en' = 'tr') =>
  render(
    <ApprovalsWall
      sectors={SECTORS}
      stories={stories}
      locale={locale}
      legend="Sektöre göre filtreleyin"
      resultTemplates={locale === 'tr' ? TR_TEMPLATES : EN_TEMPLATES}
      emptyState={EMPTY}
      noneInSector={NONE}
      approvedLabel="Onaylandı"
    />,
  );

describe('ApprovalsWall (W6, W148)', () => {
  it('renders the chips and the server-rendered empty state when the collection is empty', () => {
    wall([]);
    const group = screen.getByRole('radiogroup', { name: 'Sektöre göre filtreleyin' });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(within(group).getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(screen.getByTestId('stories-empty')).toHaveTextContent('İlk onaylar yolda');
    // Nothing to count, nothing to show: no result label, no grid, no per-sector state.
    expect(screen.queryByTestId('stories-result')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stories-none-in-sector')).not.toBeInTheDocument();
  });

  it('keeps the same state whichever chip is picked while the collection is empty', async () => {
    wall([]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    expect(screen.getByRole('radio', { name: 'Fabrika / Üretim' })).toBeChecked();
    expect(screen.getByTestId('stories-empty')).toBeInTheDocument();
    expect(screen.queryByText(NONE.title)).not.toBeInTheDocument();
  });

  it('renders every card with its resolved labels and the "showing all" line', () => {
    const { container } = wall(CARDS);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Toplam 2 onay gösteriliyor');
    const cards = within(screen.getByTestId('stories-grid')).getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Onaylandı');
    expect(cards[0]).toHaveTextContent('12 çalışma izni');
    expect(cards[0]).toHaveTextContent('Kat görevlileri');
    expect(cards[0]).toHaveTextContent('Haziran 2026');
    expect(cards[0]).toHaveTextContent('Antalya');
    expect(cards[0]).toHaveTextContent('Kırgızistan · Pakistan');
    expect(screen.queryByTestId('stories-empty')).not.toBeInTheDocument();
    // W122 render-side guard: the chips, the result line and every card's composed class
    // strings resolve to at most one utility per CSS property at each variant.
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('filters by sector and shows the per-sector empty state with a reset', async () => {
    wall([CARDS[0]]);
    await userEvent.click(screen.getByRole('radio', { name: 'Fabrika / Üretim' }));
    const none = screen.getByRole('status');
    expect(none).toHaveAttribute('data-testid', 'stories-none-in-sector');
    expect(
      within(none).getByRole('heading', { level: 3, name: NONE.title }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('stories-grid')).not.toBeInTheDocument();
    await userEvent.click(within(none).getByRole('button', { name: NONE.reset }));
    expect(screen.getByRole('radio', { name: 'Tüm sektörler' })).toBeChecked();
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Toplam 1 onay gösteriliyor');
  });

  it('counts the filtered subset in the "showing X of N" line', async () => {
    wall(CARDS);
    await userEvent.click(screen.getByRole('radio', { name: 'Turizm / Konaklama' }));
    expect(screen.getByTestId('stories-result')).toHaveTextContent(
      '2 onaydan 1 tanesi gösteriliyor',
    );
    expect(within(screen.getByTestId('stories-grid')).getAllByRole('article')).toHaveLength(1);
  });

  it('substitutes the EN templates verbatim when passed, with no i18n provider mounted', () => {
    wall(CARDS, 'en');
    expect(screen.getByTestId('stories-result')).toHaveTextContent('Showing all 2 approvals');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx" --maxWorkers=1
```

Fails at import: `Failed to resolve import "../_components/ApprovalsWall"` (and `"../_lib/wall"`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/_lib/wall.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';

/** The synthetic "all sectors" filter value (`success.124` "All sectors") — shared by the page
 *  (building the first chip option) and the island (the default filter state and its
 *  comparison), so the sentinel string lives in one place rather than two. */
export const ALL_SECTORS = 'all';

/** The two RAW (un-interpolated) `{token}` templates — `sys.stories.wall.showingAll` /
 *  `showingFiltered` — the page resolves server-side with `sys.raw(...)` and hands the island
 *  as plain strings. Never functions: a Server Component cannot pass a closure to a Client
 *  Component, and `ApprovalsWall` calls no `useTranslations` of its own, so `sys.stories.*`
 *  never joins `CLIENT_SYS` (W148). The island's own `wallResultLabels()` call below does the
 *  substitution against its live (client-state) filter counts. */
export type WallResultCopy = { showingAll: string; showingFiltered: string };

/**
 * Pure `{token}` substitution — not ICU MessageFormat, because the templates travel as plain
 * strings rather than through next-intl's client runtime. Every count goes through `formatInt`
 * (D18). Turkish nouns do not inflect for plural, so `showingAll`'s "onay" never needs a second
 * form; the English "Showing all 1 approvals" reading at n = 1 is the page's own accepted
 * precedent (design delta 10 — the card headcount's "1 work permits").
 */
export function wallResultLabels(
  templates: WallResultCopy,
  shown: number,
  total: number,
  locale: Locale,
): string {
  return shown === total
    ? templates.showingAll.replace('{count}', formatInt(total, locale))
    : templates.showingFiltered
        .replace('{shown}', formatInt(shown, locale))
        .replace('{total}', formatInt(total, locale));
}
```

`src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx` (no directive — rendered from the client island, safe in both worlds):

```tsx
import { Card } from '@/design/primitives/Card';
import type { StoryCardData } from '../_lib/stories';

/** The v1 approval card (D9): approved pill + sector pill, headcount + unit, roles, month · place ·
 *  countries. No scan, no document track, no watermark (v1.1). Every string arrives resolved. */
export function StoryCard({ card, approvedLabel }: { card: StoryCardData; approvedLabel: string }) {
  return (
    <Card as="article" hover className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
          <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
          {approvedLabel}
        </span>
        <span className="rounded-pill border border-border-1 bg-pale-1 px-3 py-1 text-body-sm font-bold text-text-secondary">
          {card.sectorLabel}
        </span>
      </div>
      <p className="m-0 text-card-title font-extrabold text-ink">{card.headcountLabel}</p>
      <p className="m-0 text-body-sm text-text-secondary">{card.roles}</p>
      <p className="m-0 mt-auto text-body-sm font-bold text-text-tertiary">
        <span>{card.monthLabel}</span>
        <span aria-hidden="true"> · </span>
        <span>{card.place}</span>
        {card.countries.length > 0 && (
          <>
            <span aria-hidden="true"> · </span>
            <span>{card.countries.join(' · ')}</span>
          </>
        )}
      </p>
    </Card>
  );
}
```

`src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx`:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
// Direct file imports, never a barrel: `@/design/primitives` re-exports every primitive, and
// `@/design/blocks` (which this file never imports at all — see below) re-exports PostCard,
// which imports `@/lib/format/date`, which imports both message JSON files, plus FaqBlock,
// Breadcrumbs and OfficeCard — one barrel import from a client island would drag all of that
// into the client graph (W13/W147; WP2b check, finding B-1). The W6 empty state is rendered on
// the server by the page and handed in as a `ReactNode` for the same reason: this island's own
// client graph is exactly `RadioChips` + `Button` + `Card` (via `StoryCard`), nothing more.
import { Button } from '@/design/primitives/Button';
import { RadioChips, type RadioChipOption } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import type { StoryCardData } from '../_lib/stories';
import { ALL_SECTORS, wallResultLabels, type WallResultCopy } from '../_lib/wall';
import { StoryCard } from './StoryCard';

/**
 * The approvals wall (design #cases): single-select sector chips over the card grid. Two empty
 * states, both by data: the collection is empty → `emptyState` (the page's server-rendered
 * W6 "first approvals are on their way" card, `data-testid="stories-empty"`); a sector has no
 * card → the design's own "No approval published in that sector yet" (success.043–045) with a
 * reset. Filter state is component state only — facet views canonicalise to the base page
 * (PRD §4) and no filter event exists (W12: `approval_filter` is not allow-listed). Calls no
 * `useTranslations` (W148): `legend`, `resultTemplates`, `noneInSector` and `approvedLabel`
 * arrive resolved (or, for the result line, as raw `{token}` templates it interpolates itself
 * with `wallResultLabels`). A light island without `next/dynamic`: it is the page's main
 * content (W13 amended).
 */
export function ApprovalsWall({
  sectors,
  stories,
  locale,
  legend,
  resultTemplates,
  emptyState,
  noneInSector,
  approvedLabel,
}: {
  /** `all` first, then the site's sector keys with their resolved labels. */
  sectors: RadioChipOption[];
  stories: StoryCardData[];
  locale: Locale;
  legend: string;
  resultTemplates: WallResultCopy;
  emptyState: ReactNode;
  noneInSector: { title: string; body: string; reset: string };
  approvedLabel: string;
}) {
  const [sector, setSector] = useState<string>(ALL_SECTORS);
  const shown = sector === ALL_SECTORS ? stories : stories.filter((s) => s.sector === sector);

  return (
    <div data-testid="stories-wall">
      <RadioChips
        name="sector"
        options={sectors}
        value={sector}
        onChange={setSector}
        legend={legend}
        legendHidden
        className="mb-5"
      />

      {stories.length === 0 ? (
        emptyState
      ) : shown.length === 0 ? (
        <div
          role="status"
          data-testid="stories-none-in-sector"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-1 bg-white px-6 py-10 text-center"
        >
          <h3 className="m-0 text-card-title text-ink">{noneInSector.title}</h3>
          <p className="m-0 max-w-[520px] text-body-sm text-text-secondary">{noneInSector.body}</p>
          <Button variant="primary" className="mt-2" onClick={() => setSector(ALL_SECTORS)}>
            {noneInSector.reset}
          </Button>
        </div>
      ) : (
        <>
          <p
            data-testid="stories-result"
            className="m-0 mb-4 text-body-sm font-extrabold text-text-tertiary"
          >
            {wallResultLabels(resultTemplates, shown.length, stories.length, locale)}
          </p>
          <ul
            data-testid="stories-grid"
            className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((card) => (
              <li key={card.id} className="min-w-0">
                <StoryCard card={card} approvedLabel={approvedLabel} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/success-stories/_lib/wall.ts" "src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx" "src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx" "src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories" --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

`ApprovalsWall.test.tsx`'s 6 cases green; 44 cases total across the folder (38 + 6). `src/design/__tests__/client-imports.test.ts` stays green: `ApprovalsWall.tsx` (`'use client'`) imports only `@/design/primitives/Button` and `@/design/primitives/RadioChips` by path, plus the page-local `StoryCard`/`_lib/wall`/`_lib/stories` (type-only) — no barrel, no block, no date function, no message file. `src/i18n/client-messages.test.ts` stays green: the island calls no `sys(...)`/`useTranslations('sys')`, so `CLIENT_SYS` (`consent, languageHint, errorTitle, errorRetry, form`) is untouched. The low-memory line is green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/_lib/wall.ts" "src/app/[locale]/(site)/success-stories/_components/StoryCard.tsx" "src/app/[locale]/(site)/success-stories/_components/ApprovalsWall.tsx" "src/app/[locale]/(site)/success-stories/__tests__/ApprovalsWall.test.tsx"
git commit -m "feat(stories): approvals wall island — sector chips, card grid, per-sector empty state (T9 c4)

Direct primitive imports and a server-rendered W6 empty state keep the blocks barrel out of
the client graph (W13); the result line's two templates travel as plain {token} strings the
island interpolates itself, so the island calls no useTranslations and sys.stories.* never
joins CLIENT_SYS (W148).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 5 — the page: metadata, hero (LCP h1), wall, hidden sections, closing band; `UNBUILT_PATHNAMES` −1, gate rows +2; the page e2e spec (W106: the page and every component it imports are already in the tree from Cycles 1–4, so this commit leaves the low-memory verify line green; the e2e spec is written here and executes once, in Cycle 6's gate — W126)**

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/success-stories/__tests__/ids.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';

// `getTranslations`/`setRequestLocale` need a request scope next-intl only establishes inside
// a real Next.js request — proved by `src/app/og/[locale]/[pageKey]/route.test.ts`, which mocks
// the same module for the same reason. `getBundle` needs no mock: `@/content/adapter`'s
// `server-only` import resolves to an empty module under Vitest (R2, `vitest.config.mts`), so
// the real function loads the committed local bundle exactly as the page does, and every id it
// reads below is verified present in `src/content/local/catalogue.json`. The rendered tree DOES
// need `NextIntlClientProvider` (`renderWithIntl`, real messages): `Breadcrumbs` and the other
// shared blocks call plain `useTranslations('sys')`, which — unlike this page's own `getBundle`/
// `getTranslations` calls — has no server-only escape hatch and needs the real provider context
// once rendered through `@testing-library/react` rather than Next's own RSC pipeline.
vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: async () => {
    const { default: tr } = await import('@/messages/tr.json');
    const root = tr.sys as Record<string, unknown>;
    const get = (path: string): unknown =>
      path
        .split('.')
        .reduce<unknown>(
          (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
          root,
        );
    return Object.assign((key: string) => String(get(key) ?? key), {
      raw: (key: string) => String(get(key) ?? key),
      has: (key: string) => get(key) !== undefined,
    });
  },
}));

// A plain static import, not a dynamic one: Vitest hoists every `vi.mock` call above every
// `import` statement at compile time (the same ordering `route.test.ts` relies on), so the
// mock above is already registered by the time this module — and the real `@/content/adapter`
// it pulls in — first loads.
import SuccessStories from '../page';

describe('Success Stories — the page renders its own breadcrumb and anchor ids (W109)', () => {
  it('breadcrumbs: Home → Success Stories (success.022 → success.013), the second crumb current', async () => {
    const jsx = await SuccessStories({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    const current = container.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent('Başarı Hikâyeleri');
    const links = container.querySelectorAll('nav a');
    expect(Array.from(links).some((a) => a.textContent === 'Ana Sayfa')).toBe(true);
  });

  it('owns exactly one #cases and one #talk section', async () => {
    const jsx = await SuccessStories({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    expect(container.querySelectorAll('#cases')).toHaveLength(1);
    expect(container.querySelectorAll('#talk')).toHaveLength(1);
    expect(container.querySelector('[data-testid="stories-closing"]')).toBeInTheDocument();
  });

  it('tags exactly one h1 as page-h1 and the sole data-lcp-slot; the hero photo is a placeholder, never the LCP slot (D26/W55)', async () => {
    const jsx = await SuccessStories({ params: Promise.resolve({ locale: 'tr' }) });
    const { container } = renderWithIntl(jsx, { locale: 'tr' });
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveAttribute('data-testid', 'page-h1');
    expect(h1s[0]).toHaveAttribute('data-lcp-slot', 'h1');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const placeholder = container.querySelector('[data-placeholder="ss-hero"]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).not.toHaveAttribute('data-lcp-slot');
  });
});
```

`e2e/pages/success-stories.spec.ts` (Playwright; `e2e/pages/` exists since T1):

```ts
import { test, expect } from '@playwright/test';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// Canonicals, hreflang and og:image are built from SITE_URL (the production origin), not the run host.
const ORIGIN = 'https://www.jobsadmire.com';
const SYS = { tr: tr.sys, en: en.sys } as const;

const ROUTES = [
  { path: '/basari-hikayeleri', locale: 'tr', alternate: '/en/success-stories' },
  { path: '/en/success-stories', locale: 'en', alternate: '/basari-hikayeleri' },
] as const;

type DataLayerEvent = Record<string, unknown>;

// No form on this page (PRD §2 row 11: "none"): there is no fallback-panel case here on
// purpose — the page's only doors are WhatsApp / internal links.
for (const r of ROUTES) {
  test.describe(`Success Stories ${r.path}`, () => {
    test('answers 200 with one tagged h1 of real copy and no leaked tokens', async ({ page }) => {
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', r.locale);
      await expect(page.locator('h1')).toHaveCount(1);
      const h1 = page.locator('h1[data-testid="page-h1"]');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      expect(body.length).toBeGreaterThan(0);
      expect(body).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    });

    test('names the hero image slot as a placeholder, never as the LCP element (D26/W55)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const slot = page.locator('[data-placeholder="ss-hero"]');
      await expect(slot).toHaveCount(1);
      await expect(slot).not.toHaveAttribute('data-lcp-slot', /.+/);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    });

    test('canonical, hreflang, og:image and the language switch keep the page', async ({
      page,
    }, testInfo) => {
      await page.goto(r.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${ORIGIN}${r.path}`,
      );
      await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/en/success-stories`,
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/basari-hikayeleri`,
      );
      // 'stories' ∈ OG_PAGE_KEYS: the generated image, titled from sys.seo.stories.title.
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        'content',
        `${ORIGIN}/og/${r.locale}/stories.png`,
      );
      await expect(page).toHaveTitle(SYS[r.locale].seo.stories.title);
      // The header switcher is in the desktop row only (below the threshold it lives in the
      // hamburger) — click it on the desktop project, and prove the target on both.
      if (testInfo.project.name === 'desktop') {
        // `exact`: the LanguageHint's "Switch to English" link would otherwise match too.
        await page
          .getByRole('link', { name: r.locale === 'tr' ? 'English' : 'Türkçe', exact: true })
          .first()
          .click();
        await expect(page).toHaveURL(new RegExp(`${r.alternate}$`));
      } else {
        await page.goto(r.alternate);
      }
      await expect(page.locator('h1[data-testid="page-h1"]')).toBeVisible();
    });

    test('carries a BreadcrumbList ending at this page and the closing band with its doors', async ({
      page,
    }) => {
      await page.goto(r.path);
      const nodes = (await page.locator('script[type="application/ld+json"]').allTextContents())
        .map((n) => JSON.parse(n) as Record<string, unknown>)
        .filter((n) => n['@type'] === 'BreadcrumbList');
      expect(nodes).toHaveLength(1);
      const items = nodes[0].itemListElement as { position: number; item: string }[];
      expect(items).toHaveLength(2);
      expect(items[1].item).toBe(`${ORIGIN}${r.path}`);
      // Scoped to the breadcrumb nav: the header's own nav marks /success-stories current too.
      const trail = page.getByRole('navigation', { name: SYS[r.locale].nav.breadcrumbs });
      await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);

      const band = page.locator('#talk');
      await expect(band).toHaveCount(1);
      await expect(page.getByTestId('stories-closing')).toBeVisible();
      const wa = band.locator('a[href^="https://wa.me/"]');
      await expect(wa).toHaveCount(1);
      await expect(wa).toHaveAttribute('target', '_blank');
      await expect(wa).toHaveAttribute('rel', /noopener/);
      // W76/W95: the href carries only the static sys prefill — never a visitor-chosen value.
      const href = new URL((await wa.getAttribute('href')) ?? '');
      expect(href.searchParams.get('text')).toBe(SYS[r.locale].stories.whatsappPrefill);
      // The hero's "Discuss your case" is an in-page anchor to that band.
      await expect(page.locator('a[href="#talk"]')).toHaveCount(1);
    });

    test('the band WhatsApp door fires whatsapp_click with placement page_cta (W12)', async ({
      page,
      context,
    }) => {
      await context.route('https://wa.me/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: '' }),
      );
      await page.goto(r.path);
      const popup = page.waitForEvent('popup');
      await page.locator('#talk a[href^="https://wa.me/"]').click();
      await (await popup).close();
      const events = await page.evaluate(
        () =>
          (
            (window as unknown as { dataLayer?: DataLayerEvent[] }).dataLayer ?? []
          ).filter((e) => e.event === 'whatsapp_click'),
      );
      expect(events).toContainEqual(
        expect.objectContaining({ event: 'whatsapp_click', placement: 'page_cta', locale: r.locale }),
      );
    });

    test('shows the W6 empty wall with the site sector chips (no stories in Phase A)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const wall = page.getByTestId('stories-wall');
      await expect(wall).toBeVisible();
      // "All sectors" + the seven site sectors (`sectors` collection), never the design's own six.
      await expect(wall.getByRole('radio')).toHaveCount(8);
      const empty = page.getByTestId('stories-empty');
      await expect(empty).toBeVisible();
      await expect(empty).toHaveAttribute('role', 'status');
      await expect(empty).toContainText(SYS[r.locale].stories.empty.title);
      const cta = empty.locator('a[href^="https://wa.me/"]');
      await expect(cta).toHaveCount(1);
      await expect(cta).toHaveAttribute('target', '_blank');
      const ctaHref = new URL((await cta.getAttribute('href')) ?? '');
      expect(ctaHref.searchParams.get('text')).toBe(SYS[r.locale].stories.empty.prefill);
      await expect(page.getByTestId('stories-grid')).toHaveCount(0);
      // Picking a chip on an empty collection keeps the empty wall — no per-sector text.
      // The native radio is sr-only under its chip face, so click the chip (the <label>).
      await wall.locator('label').nth(2).click();
      await expect(wall.getByRole('radio').nth(2)).toBeChecked();
      await expect(empty).toBeVisible();
      await expect(page.getByTestId('stories-none-in-sector')).toHaveCount(0);
      await expect(page.getByTestId('stories-result')).toHaveCount(0);
      // The design's feed/sample wording never reaches the page body (the chrome's own
      // "CRM Login" label, home.012, lives outside <main>, so the check is scoped to it).
      const main = await page.locator('main').innerText();
      expect(main).not.toMatch(/sample data|örnek veri|live from CRM|CRM['’]den canlı/i);
    });

    test('hides the unsigned metrics, the KPI box, testimonials and worker stories by data (W1/W6/§10 row 11)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expect(page.getByTestId('stories-live')).toHaveCount(0);
      await expect(page.getByTestId('stories-numbers')).toHaveCount(0);
      await expect(page.getByTestId('stories-testimonials')).toHaveCount(0);
      await expect(page.getByTestId('stories-workers')).toHaveCount(0);
      const main = await page.locator('main').innerText();
      // The design's unsigned figures, its design-time notes and the v1.1 document claims never render.
      expect(main).not.toMatch(
        /1[.,]240|\b68\b|\b91\s?%|%\s?91|\+19|Still to replace|Hâlâ değiştirilecek|Placeholder quotes|Yer tutucu yorumlar|blacked out|karartılır/,
      );
      // Delta 7: on the empty wall the hero body is the sys copy, not "Below are the actual…".
      await expect(page.locator('main')).toContainText(SYS[r.locale].stories.hero.bodyEmpty);
    });

    test('renders no <main> of its own (R31 — the (site) chrome owns #main)', async ({ page }) => {
      await page.goto(r.path);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
    });
  });
}
```

- [ ] **Step 2: Run to verify they fail**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run "src/app/[locale]/(site)/success-stories/__tests__/ids.test.ts" --maxWorkers=1
npx playwright test e2e/pages/success-stories.spec.ts --list
```

`ids.test.ts` fails at import: `Failed to resolve import "../page"`. Once `page.tsx` exists (Step 3) and before the `UNBUILT_PATHNAMES` line is deleted, `NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/lib/seo/unbuilt.test.ts --maxWorkers=1` goes red the other way (W20: the set still lists `/success-stories` while the filesystem walk now finds `success-stories/page.tsx`) — that edit is part of this same Step 3, so it is never committed red.

The e2e spec is **not** run against a server in this cycle (W126/W164: the task gets exactly one capped build + one `npm run start` + one gate, all in Cycle 6 — no interim build, and the red step is collect-only). Its red state holds by construction: before `page.tsx` exists, `/basari-hikayeleri` and `/en/success-stories` answer 404 through the `(site)/[...rest]` catch-all, so `expect(res?.status()).toBe(200)` fails first and the rest would time out on the missing test ids. The spec executes once, against the finished page, inside Cycle 6's `npm run gate`. What this step proves is that the spec compiles and is collected: `--list` contacts no server and prints `Total: 32 tests in 1 file` (8 cases × 2 routes × the `mobile` and `desktop` projects).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/success-stories/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
// By module path everywhere (W125/W130/W134/W147/W156) — never the barrels `@/design/blocks`
// or `@/design/primitives`.
import { Breadcrumbs, type Crumb } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { RadioChipOption } from '@/design/primitives/RadioChips';
import { routing } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { ApprovalsWall } from './_components/ApprovalsWall';
import { LiveBadge } from './_components/LiveBadge';
import { NumbersBox } from './_components/NumbersBox';
import { Testimonials } from './_components/Testimonials';
import { WorkerStories } from './_components/WorkerStories';
import { NEGATIVE_KPIS, STORIES_HERO_METRICS, WORKER_STORIES_CONSENTED } from './_lib/signoff';
import { readStories, readTestimonials, storyCards } from './_lib/stories';
import { ALL_SECTORS, type WallResultCopy } from './_lib/wall';

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
  // The `stories` page record has titleId/descriptionId '' (the package has no SEO strings for
  // this page), so these sys fallbacks are what renders (W23/W38); the OG route reads the same key.
  return buildMetadata({
    locale,
    href: '/success-stories',
    bundle,
    pageKey: 'stories',
    fallbackTitle: sys('seo.stories.title'),
    fallbackDescription: sys('seo.stories.description'),
  });
}

export default async function SuccessStories({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const t = makeTf(bundle, locale);

  // Phase A: `stories` is a FIXTURE_ONLY collection — empty on every Vercel build (D23), so the
  // wall is the W6 empty state and every data-gated section below returns null. Phase B fills
  // it from Operations (I10) and the same components render the cards.
  const stories = readStories(bundle);
  const cards = storyCards(bundle, locale, stories);
  const testimonials = readTestimonials(bundle);
  const published = stories.length > 0;
  const whatsapp = bundle.settings.whatsappNumber;

  // W109: the page's own package nav label (success.013) and its own Home label (success.022).
  const crumbs: Crumb[] = [
    { name: t('success.022'), href: '/' },
    { name: t('success.013'), href: '/success-stories' },
  ];
  // Delta 2: the site's sector taxonomy (the keys every form sends) plus the design's
  // "All sectors" chip — not the design's private hotels/food enum.
  const sectorOptions: RadioChipOption[] = [
    { value: ALL_SECTORS, label: t('success.124') },
    ...getCollection(bundle, 'sectors').map((s) => ({ value: s.key, label: t(s.labelId) })),
  ];
  // W148: the raw `{token}` templates only — the island (Cycle 4) does the substitution itself
  // against its own live filter state, so it never calls `useTranslations` and `sys.stories.*`
  // never joins `CLIENT_SYS`.
  const resultTemplates: WallResultCopy = {
    showingAll: sys.raw('stories.wall.showingAll') as string,
    showingFiltered: sys.raw('stories.wall.showingFiltered') as string,
  };
  // W76/W95: both prefills are static page copy — no visitor-chosen value ever sits in an href.
  const jobOrderHref = waLink(whatsapp, sys('stories.whatsappPrefill'));
  const exampleHref = waLink(whatsapp, sys('stories.empty.prefill'));
  const heroStats = STORIES_HERO_METRICS.length > 0;

  return (
    <>
      {/* ---- Hero (design .ja-ss-hero: navy + gradient overlay over the ss-hero slot) ---- */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* §10 row 4 / delta 12: the hero photo is a named placeholder (W55) inside a
            positioning wrapper — `ImageSlot` owns its own box (W129), so the wrapper, not the
            slot, carries the full-bleed sizing; the h1 is the LCP element (D26). Decorative:
            alt "" → aria-hidden. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <ImageSlot slot="ss-hero" alt="" width={1440} height={620} className="opacity-60" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,26,55,0.96)_0%,rgba(14,26,55,0.9)_55%,rgba(14,26,55,0.78)_100%)]"
        />
        <div className="container-site relative">
          <Breadcrumbs locale={locale} items={crumbs} tone="dark" className="mb-6" />
          <div
            className={
              heroStats ? 'grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]' : 'max-w-[720px]'
            }
          >
            <div>
              <LiveBadge stories={stories} />
              <h1
                data-testid="page-h1"
                data-lcp-slot="h1"
                className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] text-white"
              >
                {t('success.023')} <span className="text-sky">{t('success.024')}</span>
              </h1>
              {/* Delta 7: success.025 says "Below are the actual approvals" — only true once one
                  is published. */}
              <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80">
                {published ? t('success.025') : sys('stories.hero.bodyEmpty')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg" href="#talk">
                  {t('success.026')}
                </Button>
                <Button variant="inverse" size="lg" href="/hiring-cost-calculator">
                  {t('success.027')}
                </Button>
              </div>
            </div>
            {/* W1: the design's four stat cards (success.028–032 captions) — unsigned, so the
                strip reads an empty list and renders nothing. */}
            <MetricStrip
              bundle={bundle}
              locale={locale}
              metrics={STORIES_HERO_METRICS}
              tone="dark"
            />
          </div>
          {/* success.033/034 (the amber "still to replace" note) is a design-time instruction
              with a string id — deliberately not rendered. */}
        </div>
      </Section>

      {/* ---- Approvals wall (#cases) ---- */}
      <Section tone="light" id="cases" className="scroll-mt-24">
        <div className="container-site">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <Eyebrow>{t('success.035')}</Eyebrow>
              <h2 className="m-0 mb-2 text-h2">{t('success.036')}</h2>
              {/* Delta 7: success.037 (legal-flagged) describes the v1.1 redacted documents. */}
              <p className="m-0 text-body text-text-secondary">{sys('stories.wall.intro')}</p>
            </div>
            <Button variant="primary" href="/work-permit">
              {t('success.038')}
            </Button>
          </div>
          <ApprovalsWall
            sectors={sectorOptions}
            stories={cards}
            locale={locale}
            legend={sys('stories.wall.legend')}
            resultTemplates={resultTemplates}
            emptyState={
              <EmptyState
                testId="stories-empty"
                tone="pale"
                title={sys('stories.empty.title')}
                body={sys('stories.empty.body')}
                cta={{ label: sys('stories.empty.cta'), href: exampleHref, external: true }}
              />
            }
            noneInSector={{
              title: t('success.043'),
              body: t('success.044'),
              reset: t('success.045'),
            }}
            approvedLabel={t('success.040')}
          />
        </div>
      </Section>

      {/* ---- "Numbers we do not hide" — hidden until a KPI is signed (W1) ---- */}
      <NumbersBox bundle={bundle} locale={locale} kpis={NEGATIVE_KPIS} />

      {/* ---- Employer testimonials — hidden until consented rows exist (§10 row 11) ---- */}
      <Testimonials bundle={bundle} locale={locale} items={testimonials} />

      {/* ---- "The other side" worker stories — an approval AND the owner's separate consent
          (§10 row 11, _lib/signoff.ts) ---- */}
      <WorkerStories bundle={bundle} locale={locale} visible={published && WORKER_STORIES_CONSENTED} />

      {/* ---- Closing CTA (#talk) ---- */}
      <Section tone="band" id="talk" className="scroll-mt-24">
        <div className="container-site" data-testid="stories-closing">
          <ClosingCtaBand
            bundle={bundle}
            locale={locale}
            tone="gradient"
            titleId="success.079"
            bodyId="success.080"
            primary={{ label: t('success.081'), href: jobOrderHref, external: true, variant: 'success' }}
            secondary={{ label: t('success.082'), href: '/contact' }}
            extra={[{ label: t('success.083'), href: '/hiring-cost-calculator' }]}
          />
        </div>
      </Section>
    </>
  );
}
```

Notes: `#talk` is neither `/`-rooted nor external, so `Button` renders a same-tab `<a href="#talk">` (R22); `/hiring-cost-calculator`, `/work-permit` and `/contact` are `pathnames` keys, so the next-intl `Link` branch localizes them (`/maliyet-hesaplayici`, `/calisma-izni`, `/iletisim` under TR). `ClosingCtaBand` routes every CTA through `ContactCta` `page_cta`, so the wa.me primary fires `whatsapp_click`; `EmptyState` does the same for its CTA — both carry `external: true` so `ContactCta` adds `target="_blank" rel="noopener noreferrer"` (a `wa.me` href is a contact door regardless of `external`, but the new-tab attributes are not). W127: the primary's `variant: 'success'` is explicit — `ClosingCtaBand`'s own fallback for the primary slot is `'primary'`, not `'success'`, so leaving it unset (as the 2026-09-24 draft did) would have rendered the site's ordinary blue CTA instead of the design's green WhatsApp outline; the secondary and extra CTAs take no `variant` and fall back correctly to `tone="gradient"`'s own face, `inverse` (W128b — `inverse-dark` belongs to `tone="green"`, which this band never uses). `ClosingCtaBand`'s own `id` prop is left unset here — the anchor lives on the wrapping `Section` (matching `#cases`), so there is exactly one `id="talk"` in the DOM; `scroll-mt-24` sits on both anchored `Section`s (delta 13 — the sticky header). The island receives `EmptyState` as an already-rendered server node and `resultTemplates` as two plain strings, so its own client graph stays `RadioChips` + `Button` + `Card` (W13/W148).

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` set literal, delete the one line `'/success-stories',`.

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, as the literal's last two entries (after whatever row is last — T13, T3–T6 and T8 appended theirs after the `{ path: '/tesekkurler?form=hire', indexable: false }` row, T7 inserted its two before the conversion-page comment; order is irrelevant to every consumer, W21), add:

```ts
  { path: '/basari-hikayeleri', indexable: true },
  { path: '/en/success-stories', indexable: true },
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/success-stories/page.tsx" "src/app/[locale]/(site)/success-stories/__tests__/ids.test.ts" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/success-stories.spec.ts
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/lib/seo/unbuilt.test.ts scripts/gate-routes.test.ts "src/app/[locale]/(site)/success-stories" --maxWorkers=1
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
npx playwright test e2e/pages/success-stories.spec.ts --list
```

`unbuilt.test.ts` green (set and filesystem agree again); `gate-routes.test.ts` green (the TR and EN halves of `INDEXABLE_GATE_ROUTES` stay equal); `ids.test.ts`'s 3 cases green; every earlier file in the folder stays green — 47 cases total (44 + 3). The low-memory line is green — `src/design/__tests__/client-imports.test.ts` and `src/i18n/client-messages.test.ts` stay green (the page is a server component; its only client descendant is the already-proven `ApprovalsWall`); `tsc` and ESLint cover `e2e/pages/success-stories.spec.ts` (the spec is outside Vitest's `include`). `--list` still collects 32 tests. No build, no server and no Playwright execution here (W126): the e2e spec's 8 cases × 2 routes × 2 projects, `routing.spec.ts`'s page-contract loop and `seo.spec.ts`'s canonical/sitemap loop (which pick the two new `GATE_ROUTE_TABLE` rows up automatically — the sitemap lists `/basari-hikayeleri` and `/en/success-stories` because the key left `UNBUILT_PATHNAMES`) all run once, in Cycle 6's gate.

`docs/SEO.md` — append one row at the end of the `## Pages` table (T1 created it with the W98 columns Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes; append after the last row an earlier task added):

```markdown
| Success Stories | `/basari-hikayeleri` · `/en/success-stories` | `sys.seo.stories.{title,description}` — the `stories` record's ids are `''` (W23/W38); OG image `/og/{locale}/stories.png` | self per locale (`absoluteUrl(locale, '/success-stories')`); the sector chips are component state, never a URL (PRD §4 facets) | `BreadcrumbList` (Home → Success Stories, `Breadcrumbs`); no ItemList/Review in v1 | `h1` (`data-lcp-slot="h1"`); `ss-hero` is a named placeholder (§10 row 4, D26) | W6 empty wall; hero stats, live badge, KPI box, testimonials and worker stories hidden by data (W1, §10 row 11) |
```

`docs/ANALYTICS.md` — append one bullet at the end of the `### Page instrumentation (WP2b)` list (after the last bullet an earlier task added):

```markdown
- **Success Stories (`/basari-hikayeleri`, `/en/success-stories`, T9):** `whatsapp_click` with `placement: 'page_cta'` from the closing band's "Send us the job order" and from the empty wall's "Ask for an example on WhatsApp" (both `ContactCta`); both hrefs carry only a static `sys.stories.*` prefill, never a visitor-chosen value (W76/W95). The design's `approval_filter` event is **not** fired — it is not allow-listed (W12) and the sector chips are component state only. No form, so no `generate_lead`/`conversion` originates here; the hero, wall and band's other CTAs are internal links and fire nothing.
```

`docs/PRD.md` — in the page table, row `| 11  | Success Stories …`, replace the Forms-cell text `none — CMS cards, no proof scans at launch (D9 v1)` with:

```
none — CMS cards, no proof scans at launch (D9 v1); Phase A ships the W6 empty wall (sector chips + "first approvals are on their way"), with hero metrics / KPI box / testimonials / worker stories hidden by data (W1, §10 row 11) until the `stories` collection is fed from Operations (I10)
```

`docs/PRD.md` — §11, the sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`): in whatever wording T1–T8 and T13 left it, count Success Stories as built — decrement the "N of the 14 core pages" figure by one and add "Success Stories (WP2b T9)" to the list of designed pages that sentence names — keeping the rest of the sentence as it stands (W45: edit in place, never re-add WP1 wording). For orientation only: T1 replaced the WP2a parenthesis "(only the homepage and Hire Workers exist, both still spike-era placeholder content)" with "(the homepage is the first designed page — WP2b T1; Hire Workers is still the spike placeholder until T2)", T13 decremented the count to "11 of the 14" for the portal entry (§2 row 14), T2 rewrote that Hire-Workers clause (count unchanged), T3–T8 each decremented the figure by one and added their own page — so it should open "5 of the 14 core pages (…)" when this step runs and "4 of the 14 core pages (…)" after it. If it carries another figure, an earlier task deviated: still decrement whatever figure it carries by one, and name the discrepancy in this task's report.

```bash
npx prettier --write docs/SEO.md docs/ANALYTICS.md docs/PRD.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/success-stories/page.tsx" "src/app/[locale]/(site)/success-stories/__tests__/ids.test.ts" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/success-stories.spec.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
git commit -m "feat(stories): Success Stories page — W6 empty wall, hero h1 LCP, hidden-by-data sections, closing band (T9 c5)

/basari-hikayeleri + /en/success-stories leave UNBUILT_PATHNAMES (W20) and join the gate
route table (W21). sys.seo.stories fallbacks (W23/W38); BreadcrumbList via Breadcrumbs with
the page's own nav label (W109); the hero photo slot sits in a positioning wrapper so ImageSlot
itself carries no sizing class (W129); static WhatsApp prefills only (W95); worker stories
gate on published && WORKER_STORIES_CONSENTED (§10 row 11). Docs: SEO page row, analytics
placements, PRD Phase A behaviour and not-yet-built count.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

- [ ] **Cycle 6 — the W126 proof (one build, one start, the gate, js-size, the launch dead-target check, kill) and the T9 `## Ledger` row**

- [ ] **Step 1: No new test — pre-flight: check the facts this task relies on and the ledger anchor**

This cycle changes no source and adds no test; its checks are the W126 proof run (which executes the Cycle 5 page spec for the first time) and the ledger edit below, which is prose (Prettier-checked by the low-memory line). Every other doc this task touches (`docs/SEO.md`, `docs/ANALYTICS.md`, `docs/CONTENT-MODEL.md`, `docs/PRD.md`, `docs/INTEGRATIONS.md`) was already edited in Cycles 1, 2 and 5.

```bash
grep -n "basari-hikayeleri\|/en/success-stories" e2e/routes.ts      # 2 hits, both `indexable: true` (W21)
grep -n "'/success-stories'" src/lib/seo/routes.ts                # no hit (the UNBUILT key is gone, W20)
grep -n "success-stories" src/design/chrome/ctas.ts               # no hit — the header renders DEFAULT_CTAS (W17/W121)
grep -n "^## Ledger" docs/superpowers/plans/2026-09-20-wp2b-pages.md   # 1 hit — T1's table (W98)
env | grep -E '^(NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'GTM-dark'
git status --short                                                  # clean: Cycles 1–5 are committed
```

Expected: exactly as annotated. A GTM/GA4/Ads id in this shell would put third-party script into the measured budget (W146) — unset it before building. A missing `## Ledger` heading means T1 deviated: stop and ask the controller rather than invent a location (never write into the controller's `## Task index` / `<!-- ASSEMBLY -->` placeholder above it).

- [ ] **Step 2: Run the proof (W126 — one heavy job at a time; no preview run by the implementer, never push — W137/W139/W140, the controller's binding preview run is separate)**

```bash
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start &
NEXT_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/basari-hikayeleri   # wait for the server without `sleep` (blocked in the agent's shell)
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/stories-gate-launch.log" 2>&1 || true
grep -nE '^/(basari-hikayeleri|en/success-stories)[^ ]* → ' "$TMPDIR/stories-gate-launch.log" || echo 'success-stories routes not listed as dead'
kill $NEXT_PID
ps aux | grep -E 'next-server|next start' | grep -v grep   # confirm nothing stray survived the kill
```

(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for the `kill` either way, and wait with `curl --retry`, never a bare `sleep`. A build error is fixed in the source, committed after the low-memory verify line, and the build re-run — that re-run is still "the" build of this task.)

Expected:
- **Build:** succeeds — the first time the RSC boundaries of `page.tsx` → the server sections → the `'use client'` `ApprovalsWall`/`RadioChips`/`Stat`/`ContactLink` are compiled (jsdom could not see them); both locales of the route are prerendered (no `headers()`/`cookies()` in the page).
- **Gate:** `npm run gate` green on both Playwright projects — every spec, including this page's 8 cases on both `/basari-hikayeleri` and `/en/success-stories` (32 executions; the spec runs here for the first time, W126), `routing.spec.ts`'s page contract and `seo.spec.ts`'s canonical/hreflang/sitemap loop on the two new rows; axe zero violations over `GATE_ROUTES` (the chips are native radios with a visually hidden legend, the empty state is `role="status"`, the decorative hero slot and its gradient overlay are `aria-hidden`); the width sweep clean at 1440…390 (the hero is one column, the card grid is `md:grid-cols-2 lg:grid-cols-3` — empty in Phase A, so this is the chip row's own wrap behaviour); Lighthouse on both routes (localhost wears the production face, `lighthouserc.local.json`, W135/W145): performance ≥ 0.95, a11y/best-practices/SEO = 1.0, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the h1 over the gradient, DevTools-throttled median of 3 runs, W145).
- **js-size** (W136 — the ledger's figure): both routes below the **191,724 B local trigger** (W162: the binding figure is the controller's preview `npm run js-size` against the 194,560 B lazy line, W136; the preview runs ≈ 2,836 B above the local build — 176,132 → 178,968 B at 02ace58 — so the local trigger is 194,560 − 2,836). Projection: the WP2a close measured the shell at 176,132 B (TR) / 172,783 B (EN) locally; this page adds only `ApprovalsWall` + `StoryCard` + `RadioChips` + `Stat` (the latter imported by the gated `NumbersBox`/`MetricStrip`) and the page-local `_lib/wall.ts` (`ContactLink`, `Button`, `Card` and `track` already ship with the chrome) — a few KB. If either route nevertheless measures ≥ 191,724 B locally: STOP and report — do NOT start T10, do NOT write a lazy cycle in advance and do NOT add a second build here (W164) — record the `js-size` table and the route's client chunk list and report to the controller; the controller's binding preview decides at 194,560 B and schedules the lazy pass before the next page starts (W13 amended; the wall is the page's main content and the `#cases` target, so moving it behind an interaction needs a ruling).
- **Launch dead-target check** (W152/W158): the launch profile stays RED by design while other routes are still unbuilt (it prints the W20 unbuilt list, the dead-target sweep and the D26 content-readiness table, then fails), but the grep prints `success-stories routes not listed as dead` — the chrome's links to `/basari-hikayeleri` and `/en/success-stories` answered 404 before this task and answer 200 now. The pattern matches only the dead-href lines (`<href> → <status>`), never the D26 table further down the same log, which lists both routes by design. Every internal href this page renders (`/maliyet-hesaplayici`, `/calisma-izni`, `/iletisim`, the in-page `#talk`, and `/adaylar` behind the hidden worker stories) is a route T3/T4/T7/T8 already built; the page owns no `CTA_BY_PATHNAME` entry, and the `DEFAULT_CTAS` `#request-form` its header links to is checked on Hire Workers (T2's anchor).

Record the actual numbers for the ledger row below.

- [ ] **Step 3: Implement (the T9 ledger row)**

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T9 row to the `## Ledger` table in T1's row format (W98 — six columns: Task · Routes (tr · en) · JS (`npm run js-size`, W136) · Lighthouse (median of 3, W145) · Pixel (D27) / named deltas · Date), filled from this session — the "**Ledger line**" template at the end of this task, every `<…>` from Step 2; none typed from memory. Never touch the controller's `## Task index` / `<!-- ASSEMBLY -->` placeholder.

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Green (`prettier --check .` covers the re-aligned table; nothing in this cycle changes source, so the whole suite is unchanged from Cycle 5 — 47 cases in this page's own folder, plus the repo's existing suite).

- [ ] **Step 5: Commit (never push — W118, the owner decision on push cadence is the controller's, not this task's)**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(stories): T9 ledger row — gate, js-size, Lighthouse medians, launch dead-target check (T9 c6)

Local W126 proof (one build + start + gate + js-size against localhost, never a pushed preview —
W137/W139/W140): the page spec ran once, green on both routes and both projects; both routes
measured against the 191,724 B local trigger (W162; binding lazy line 194,560 B, W136); the launch sweep no longer lists either route
as dead (W152/W158). No source change.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` (Cycle 1: one paragraph in `## Collections`, after the sentence ending "…become collections when an editor needs to reorder them.", for the page-local `stories`/`testimonials` schemas; Cycle 2: one bullet appended to `### Adding copy (W9, W23, W54)`'s per-page list, the `sys.stories.*`/`sys.seo.stories.*` keys and why). `docs/INTEGRATIONS.md` (Cycle 1: one sentence in `## I10 — Success stories (cards)`, after "item type `successStory`.", pointing at the row shape and Phase A's zero rows). `docs/SEO.md` (Cycle 5: one row appended to the `## Pages` table — title source `sys.seo.stories.*`, self canonical, `BreadcrumbList`, LCP `h1`, `ss-hero` placeholder). `docs/ANALYTICS.md` (Cycle 5: one bullet appended to `### Page instrumentation (WP2b)` — `whatsapp_click` `page_cta` from the band and the empty-wall CTA, static prefills (W95), no `approval_filter`). `docs/PRD.md` (Cycle 5: the page-table row 11 Forms cell, anchored on "none — CMS cards, no proof scans at launch (D9 v1)"; the §11 not-yet-built sentence, decremented by one with "Success Stories (WP2b T9)" added to the pages it names — the T6/T7/T8 convention). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (Cycle 6: the T9 row of T1's `## Ledger` table — never the controller's `## Task index`).

**Sys keys added (14, both locales):** `sys.seo.stories.title`, `sys.seo.stories.description`, `sys.stories.hero.bodyEmpty`, `sys.stories.hero.liveBadge`, `sys.stories.wall.intro`, `sys.stories.wall.legend`, `sys.stories.wall.showingAll`, `sys.stories.wall.showingFiltered`, `sys.stories.empty.title`, `sys.stories.empty.body`, `sys.stories.empty.cta`, `sys.stories.empty.prefill`, `sys.stories.whatsappPrefill`, `sys.stories.workers.card1Title` — pinned by `__tests__/sys-keys.test.ts`.

**Package ids used:** 35 `success.*` ids (first `success.013`, last `success.124`), every one present in `src/content/local/catalogue.json` (verified 2026-09-29): `success.013, 022, 023, 024, 025, 026, 027, 035, 036, 038, 040, 041, 043, 044, 045, 046, 047, 048, 058, 059, 070, 071, 072, 073, 074, 075, 076, 077, 078, 079, 080, 081, 082, 083, 124`. Read conditionally: `025` only while an approval is published (`success.025` vs the empty-wall `sys.stories.hero.bodyEmpty`); `040`/`041`/`043`–`045` only when the island has cards or a per-sector miss (`storyCards`/`ApprovalsWall`); `046`–`048`, `058`–`059` and `070`–`078` sit behind `NumbersBox`/`Testimonials`/`WorkerStories`'s own early-return guards, so none is actually read in Phase A even though the `t('success.…')` calls exist in source. `success.049`–`057` are named only by rows of the empty `NEGATIVE_KPIS` table (no literal id in source), so none is read or even referenced by string in Phase A. The sector chips read `hire.076`–`082` through the `sectors` collection's `labelId`s (not a literal id) — 7 more ids, not counted in the 35. Deliberately never read: `success.001`–`021` and `084`–`111` (chrome — the shared chrome reads the canonical `home.*` ids, R15), `028`–`034` (unsigned captions + the amber note), `037` (legal-flagged, v1.1 document claim — delta 7), `039`, `042`, `060`–`069` (placeholder quotes + disclaimer), `112`–`123` (sample-data role/country strings), `125`–`136` (the design's private sector enum, feed status, show-more), `137` (generic hire prefill), `138`–`151` (feed-status / slider / proof-frame wording that presumes a browser CRM fetch). For the WP-C legal sheet: `025`, `037`. All fields in catalog — this page sends no form.

**CLIENT_SYS additions:** none. `ApprovalsWall` (the page's only client island) calls no `useTranslations`/`sys(...)` — every string it needs arrives as a prop, either already resolved (`legend`, `noneInSector`, `approvedLabel`) or as the two raw `{token}` templates in `resultTemplates` (`_lib/wall.ts`'s `WallResultCopy`), which it interpolates itself with `wallResultLabels`. `sys.stories.*` therefore stays out of `src/i18n/client-messages.ts`'s `CLIENT_SYS` allowlist and out of every page's RSC-to-client payload.

**Foundation gaps:** none. Accepted page-local by the reconcile rulings: the `stories`/`testimonials` Zod schemas in `_lib/stories.ts` (Phase B moves them into `src/content/collections.ts` once the Operations `successStory`/`testimonial` item types exist, I10).

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`, T1's six columns, W22/W98; local gate, never a pushed preview — W137/W139/W140; fill every `<…>` from Cycle 6):

```markdown
| T9 Success Stories | `/basari-hikayeleri` · `/en/success-stories` | js-size (local, W136 — Lighthouse `resource-summary:script:size` transfer bytes): `/basari-hikayeleri` <n> B · `/en/success-stories` <n> B (ceiling 204,800; local trigger 191,724, W162; binding lazy line 194,560 on the preview); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/basari-hikayeleri` perf <x.xx> · a11y <x.xx> · BP <x.xx> · SEO <x.xx> · LCP <n> ms (h1) · CLS <n>; `/en/success-stories` perf <x.xx> · a11y <x.xx> · BP <x.xx> · SEO <x.xx> · LCP <n> ms (h1) · CLS <n> | not a D27 pixel page — Fable side-by-side review; named deltas 1–14 (this task's header): W6 empty wall (hero stats, live badge, KPI box, testimonials and worker stories hidden by data — W1, §10 row 11), the site's sector chips, v1 card grid without proof frames, the band's third action as a button, typed localized hrefs, no filter URL or event, sys hero body and wall intro (no "below are the approvals" claim), static WhatsApp prefills, the ICU live badge, the package's headcount split, the gradient band with the success-face WhatsApp CTA, the `ss-hero` placeholder, `scroll-mt-24` anchors, the `EmptyState` WhatsApp CTA keeping the block's `secondary` face (accepted D20 delta, W178); WP-C sheet: `success.025`, `success.037` (legal), the package's first-person lines (`044`, `048`, `072`, `077`, `079`, `080`, `081` — W154: package copy waits for WP-C); `UNBUILT_PATHNAMES` −1, `GATE_ROUTE_TABLE` +2, sys keys +14; launch sweep: neither route listed as dead | <YYYY-MM-DD> |
```
