### Task 4: Work Permit — `/calisma-izni` · `/en/work-permit` (side-by-side review, D27)

**Why this task exists.** The route is the site's explainer for the Turkish work permit (design-package page 5, `design-package/design/Work Permit.dc.html`, strings `design-package/strings/workpermit.json`, ids `wp.001`–`wp.398`, 63 legal-flagged). It is still unbuilt: `'/work-permit'` sits in `UNBUILT_PATHNAMES` and both locale paths 404 through `(site)/[...rest]`, while the header already points at it (`CTA_BY_PATHNAME['/work-permit']` → `{ pathname: '/work-permit', hash: '#permit-cta' }`). This task builds the designed page on the WP2a foundation: hero with the D17 dated badge and the **eligibility wizard** (a client island that stores nothing and posts to no door — its result opens WhatsApp with a click-time prefill, W76/W95, and pushes `eligibility_check_complete` with the result bucket only, W26/W67), the audience router, the permit-vs-exemption comparison and the timeline pair **stacked on mobile instead of the design's tab switchers** (D20/W10), the sample permit card, permit types, rules and penalties, the Article-48 exemptions, the process, costs, documents, renewal, FAQ, the related-articles block **hidden below the blog threshold** (W4) and the `#permit-cta` closing band. **There is no door form** (PRD §2 row 5: "none (explainer)"; the Operations catalog has no `permit` key — never invent one): no `actions.ts`, no `FormShell`, no consent row, no catalog field. Every number is a metric or a `rateConfig` value (W1/D17), every string a package id through `makeTf` or a `sys.wp.*` key (W9/W23), every contact anchor fires its click event with `placement: 'page_cta'` (W12).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (HEAD ≥ `7bacd7e`). Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → T2 → T3 → **T4**: when this task starts, T1 has created the shared doc shapes (W98: the `docs/SEO.md` `## Pages` table with the columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`, `docs/ANALYTICS.md` `### Page instrumentation (WP2b)`, the per-page `sys.*` bullet list at the end of `docs/CONTENT-MODEL.md` `### Adding copy (W9, W23, W54)`, the `## Ledger` table of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` in T1's six-column row format), the `e2e/pages/` folder and the ARCHITECTURE § Routing paragraph that puts page-private modules in `_lib/`, `_components/`, `_sections/` beside each `page.tsx`; T13 has shipped `/privacy`; T2 built `/hire-workers` (`#request-form`) and T3 built `/hiring-cost-calculator` — both are link targets of this page. WP2a is fully built and reviewed; where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `7bacd7e`.

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first — the snippets below are not guaranteed prettier-formatted: `printWidth` 100, single quotes, trailing commas). The task ends with ONE proof session (W126, Cycle 7): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size`, the launch anchor check, then the server is killed and no stray process is left. Playwright runs only inside that session (the page spec is written in Cycle 6 and executes there) — and inside Cycle 8's re-proof, the one conditional second build (the W13 lazy pass). No pixel run: T4 is not one of the four D27 harness pages (side-by-side review). Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified — read before touching anything).**
- Internal key `/work-permit` → TR `/calisma-izni`, EN `/en/work-permit` (`src/i18n/routing.ts` `pathnames`). Private folders (`_lib`, `_components`, `_sections`, `__tests__`) never become routes (`unbuilt.test.ts`'s walker skips `_`-folders too).
- Page record (both bundles): `bundle.pages.wp = { titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` — the package carries no SEO string for this page, so `buildMetadata` takes the **`sys.seo.wp.{title,description}`** fallbacks this task adds (W23/W38); the OG route `/og/{locale}/wp.png` (`'wp'` is in `OG_PAGE_KEYS`) then titles the card with `sys.seo.wp.title` and sublines it with `sys.seo.ogTagline` (`src/lib/seo/og.ts`), CDN-cached (W123).
- `CTA_BY_PATHNAME['/work-permit']` (`src/design/chrome/ctas.ts`) = primary `wp.016` + tail `wp.017` → `{ pathname: '/work-permit', hash: '#permit-cta' }` and the default secondary (`home.008` → `/partner-with-us`). **This page must render `id="permit-cta"`** (W17/W152/W158: `gate:launch`'s anchor sweep lists `#permit-cta` on `/calisma-izni` and `/en/work-permit` as missing until this task lands). No `ctas.ts` edit (W121).
- `UNBUILT_PATHNAMES` (`src/lib/seo/routes.ts`) contains `'/work-permit'` → this task deletes it **in the same commit as `page.tsx`** (`unbuilt.test.ts` fails whenever the set and the filesystem disagree); `e2e/routes.ts` `GATE_ROUTE_TABLE` has no work-permit row → this task appends two (W20/W21).
- Settings used (LOCAL bundles): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`. Metrics: `placed '470+'`, `firstDayWeeks '6–8'`, `firstDayWeeksInCountry '4–6'` — the three `wp.*` strings carrying placeholders are `wp.030` `{placed}`, `wp.264` `{firstDayWeeks}`, `wp.274` `{firstDayWeeksInCountry}` (read through `makeTf`, W1/D17). `rateConfig`: `updatedAt '2026-01-15'`, `reviewDueAt '2026-12-20'`, `quotaRatio 5`.
- Blog: 22 rows, **0 Turkish bodies** (1 English) → `blogNavVisible(bundle) === false` → the related-articles block renders nothing today (W4).
- The design's breakpoints: `≤ 700 px` (`.ja-t-desk`/`.ja-t-mob`, tabs, jump label, hero CTAs, sticky bar) = this repo's `md` boundary (701 px); `≤ 900 px` (every inline `grid-template-columns` collapses to one column, sticky side columns turn static) = `lg` (901 px); desktop paddings × 0.75 from 1101 px (D19). The design hides nothing of this page at ≤ 460 px beyond the ≤ 700 px switches.
- Header height (for the sticky jump nav and the anchor scroll margins, `src/design/chrome/Header.tsx`, `sticky top-0`): `py-3` + the 46 px hamburger + 1 px border = **71 px below 901 px**; from 901 px the tallest item is the language switcher (`p-1` + 1 px border around 44 px items = 54 px), so the row is **79 px** — the design's own `top:79px` — except that between 901 and 1100 px the desktop nav may wrap onto a second line (W11), so the height varies there. The only width range with a fixed header height above the fold is therefore **1101 px and up (79 px)**.

**Design deltas this page carries on purpose (named, so the side-by-side reviewer files them under (a) D20 / (b) design delta — D20/D27):**
1. D20/W10: the permit-vs-e-Muafiyet comparison and the abroad-vs-in-Türkiye timeline **stack** below 901 px instead of the design's ≤ 700 px two-tab switchers (which hid half the content); the design's CSS `::before` captions "Work permit" / "e-Muafiyet" become the real strings `wp.099`/`wp.100` (visible below `lg`, `lg:sr-only` above so screen readers always hear which column a cell belongs to); the tab labels `wp.261`/`wp.262` are not rendered.
2. The hero's 4th stat chip ("₺100,000+ fine without a permit") is **not rendered** — the figure has no package id and `RateConfig` has no fine (D17; accepted by the WP2b reconcile — a fine field is a later content task if the owner wants the chip back); `wp.052` is unread; the legal-flagged penalty line `wp.196` and FAQ answer `wp.342` carry the fine verbatim.
3. D17/W150: the dated badge `wp.022` ("Updated July 2026 · …") is replaced by `sys.wp.hero.updated` filled from `rateConfig.updatedAt` (`formatMonth`) and hidden from `rateConfig.reviewDueAt` on; the page exports `revalidate = 86400` so the switch happens without a deploy.
4. The process steps are a page-local four-column grid (accepted by the reconcile: `ProcessSteps` has no per-step badge for `wp.255` "SGK day one" and no horizontal variant); the connector rail is static and the IntersectionObserver reveal is dropped (no island, reduced-motion parity, W13).
5. Renewal banner: the mobile-only "60 / days" numeral is dropped ("60" has no id; `wp.325` "days" unread); `wp.326` renders as the ≤ 700 px window line.
6. FAQ: "What is e-Muafiyet and who can use it?" (`wp.340`) has **no answer id** in the package — the design's answer text lives in `sys.wp.faq.exemptionAnswer` (W9) and is on the WP-C legal sheet.
7. W76/W95: the wizard's "Get an exact answer on WhatsApp" keeps a prefilled message (now the four answers + the verdict, instead of the design's generic sentence), but the DOM href is the bare `https://wa.me/905011240340`; the prefilled URL is composed on click and opened `noopener`; a middle click reaches the bare chat and is still counted.
8. The closing band is a page-local section (the design's light, centred band — `ClosingCtaBand` is a dark card whose body cannot switch at ≤ 700 px); its mobile route cards (`wp.363`–`wp.365` + `wp.089`) and desktop buttons (`wp.366`, `wp.367`, the phone) switch by CSS (W10) exactly as the design does.
9. W4: the design's three static "Keep reading" cards (`wp.353`–`wp.358`, all linking to the blog index) are not used — when the blog passes the threshold the block reads the `blog` collection (category `workPermits`, bodies in this locale) through `PostCard`; today it renders nothing.
10. The sample permit card is rendered from markup with fictional data (README: deliberate reproduction; counsel sign-off item); its "ÖRNEK · SAMPLE" watermark is painted by a CSS pseudo-element from `wp.143` (decorative text at 9 % opacity would otherwise be an axe `color-contrast` failure); the card is one `role="img"` picture named by `sys.wp.sample.label`, and the caption `wp.160` always shows.
11. D20 contrast: every white-on-brand-blue surface is `blue-safe` (the wizard head, the comparison's "Route 1" head, the permit-types ask card, the rule and step numbers, the renewal banner — white on `#1899d5` is 3.2:1); every `#94a3b8` grey is `text-text-tertiary` on white and `text-text-secondary` on `pale-1` (tertiary on `#f4f9fc` is 4.49:1); the hero chips are solid white (the design's white/75 over navy puts `#556377` at 3.6:1); translucent pills on blue become outline-only; the calculator router colour `#d97706` is `warning-text`.
12. D20 outline and glyphs: the wizard heading is an `h2` (the design's `h3` sat directly under the page `h1`); the wizard's ✓/! verdict marks and every check are SVG, never text glyphs.
13. Rules: the penalty box stays under the intro at every width (the design moves it after the rule list at ≤ 700 px with CSS `order`) — visual order equals DOM order (D20).
14. FAQ: `FaqBlock`'s ask card shows at every width (the design hides it at ≤ 700 px; the block has no per-row breakpoint) and its e-mail row is the W83 `email`/`emailLabelId`/`subject` row; the answers sit in the foundation `Accordion` (single-open, first open).
15. The jump nav is sticky only from 1101 px, under the 79 px header (`xl:sticky xl:top-[79px]`), and static below (the design sticks it from 701 px, but this header is 71 px below 901 px and its desktop row may wrap between 901 and 1100, W11, so no fixed offset is safe there); its "On this page" label hides at ≤ 700 px (as designed); anchor targets carry `scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40` (header, wrapped header, header + jump nav); the router is two columns from 390 to 900 px (the design collapses it to one column between 701 and 900).
16. The sticky CTA bar is the foundation's navy bar (the design's is white); its Call/WhatsApp CTAs are tracked (W81).

**Files:**

Create
- `src/app/[locale]/(site)/work-permit/page.tsx`
- `src/app/[locale]/(site)/work-permit/_lib/tables.ts`
- `src/app/[locale]/(site)/work-permit/_lib/fragments.ts`
- `src/app/[locale]/(site)/work-permit/_lib/eligibility.ts`
- `src/app/[locale]/(site)/work-permit/_lib/wizard-props.ts`
- `src/app/[locale]/(site)/work-permit/_lib/prefill.ts`
- `src/app/[locale]/(site)/work-permit/_lib/badge.ts`
- `src/app/[locale]/(site)/work-permit/_lib/assets.ts`
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/helpers.ts` (shared test helpers — not a test file)
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/tables.test.ts`
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/fragments.test.ts`
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/eligibility.test.ts`
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/wizard-props.test.ts`
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/badge.test.ts`
- `src/app/[locale]/(site)/work-permit/_lib/__tests__/sys-keys.test.ts`
- `src/app/[locale]/(site)/work-permit/_components/icons.tsx` (no directive — server sections and the island both import it)
- `src/app/[locale]/(site)/work-permit/_components/Frags.tsx` (no directive)
- `src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.tsx` (`'use client'`)
- `src/app/[locale]/(site)/work-permit/_components/__tests__/EligibilityWizard.test.tsx`
- `src/app/[locale]/(site)/work-permit/_sections/Hero.tsx`, `JumpNav.tsx`, `AudienceRouter.tsx`, `RoutesComparison.tsx`, `SampleCard.tsx`, `PermitTypes.tsx`, `Rules.tsx`, `Exemptions.tsx`, `Process.tsx`, `Timeline.tsx`, `Costs.tsx`, `Documents.tsx`, `Renewal.tsx`, `Faq.tsx`, `RelatedArticles.tsx`, `PermitCta.tsx`
- `src/app/[locale]/(site)/work-permit/_sections/__tests__/top.test.tsx`, `middle.test.tsx`, `bottom.test.tsx`
- `e2e/pages/work-permit.spec.ts`
- only if Cycle 8's lazy pass is triggered: `src/app/[locale]/(site)/work-permit/_components/LazyStickyBar.tsx` + `_components/__tests__/LazyStickyBar.test.tsx`

Modify
- `src/lib/seo/routes.ts` — delete the one element `'/work-permit',` from the `UNBUILT_PATHNAMES` set literal (W20; find it by its text, never by line number)
- `e2e/routes.ts` — append two rows at the end of the `GATE_ROUTE_TABLE` array literal, after whatever rows T1/T13/T2/T3 left there (W21)
- `src/messages/tr.json`, `src/messages/en.json` — the member `wp` inside the existing `sys.seo` object (beside `ogTagline` and the earlier pages' `seo.<pageKey>` objects) and a new `sys.wp` object (25 leaves per locale)
- `docs/CONTENT-MODEL.md` — one bullet appended to the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (W98)
- `docs/SEO.md` — one row appended to the `## Pages` table (W98)
- `docs/ANALYTICS.md` — the `eligibility_check_complete` row's "Fires on" cell + one bullet under `### Page instrumentation (WP2b)` (W98) + the "declared but still uncalled" clause of the paragraph that begins "**WP1 wired exactly one of these seven events**"
- `docs/PRD.md` — §2 the table row whose page cell is `Work Permit` (its last cell) and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**" (W45: edit in place)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T4 row of the `## Ledger` table (T1's row format, W98)

Test
- Vitest: the six `_lib/__tests__/*.test.ts`, `_components/__tests__/EligibilityWizard.test.tsx`, `_sections/__tests__/{top,middle,bottom}.test.tsx`
- Playwright (both projects, in the gate only): `e2e/pages/work-permit.spec.ts`
- Existing, must stay green untouched: `src/lib/seo/unbuilt.test.ts` (W20), `src/messages/{messages,voice}.test.ts` (W154), `src/i18n/client-messages.test.ts` (W148 — no new client namespace), `src/design/__tests__/class-collisions.test.ts` (W155 — it scans `src/app/**`, so every class string below is part of the gate), `src/design/__tests__/client-imports.test.ts` (W147/W156/W158), `src/design/blocks/__tests__/rsc-imports.test.ts` (W125/W130/W134), `src/app/{sitemap,robots}.test.ts`, `src/lib/seo/routes.test.ts`; e2e `routing`, `seo`, `a11y`, `width-sweep`, `chrome`, `headers`, `thank-you`, `ops` (which pick the two new gate rows up automatically)

No `actions.ts`: the page sends nothing to the door. Every `tel:`/`wa.me`/`mailto:` anchor renders through `ContactCta` (server sections), `ContactLink` (the router's permit-only card, the closing band's route card and e-mail line), the blocks (`FaqBlock` ask card, `StickyCtaBar` — W81/W83) or, for the one link whose prefill carries visitor choices, the wizard's own click-time anchor that fires through `useContactClick('page_cta')` (W95). Every such click fires `whatsapp_click`/`call_click`/`email_click` with `placement: 'page_cta'`.

**Interfaces:**

Consumes (exact names, verified in the code at `7bacd7e`; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeTf` from `@/content/adapter` (server-only; `export * from './pure'`); `makeTf` from `@/content/pure` (tests); `getRateConfig`, `getCollection`, `blogNavVisible`, `type RateConfig`, `type BlogPost` from `@/content/collections` (`blogNavVisible` = ≥ `BLOG_NAV_THRESHOLD` (6) Turkish bodies); `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: five levels up from `work-permit/page.tsx`, six from `_lib/`/`_components/`/`_sections/`, seven from their `__tests__/`).
- Calculator engine: `isReviewDue(rateConfig, now?)` from `@/lib/calculator` (the engine barrel is allowed — pure TS); `RATE` from `@/lib/calculator/__tests__/fixtures` (tests only — `updatedAt '2026-01-15'`, `reviewDueAt '2026-12-20'`, `quotaRatio 5`). Date: `formatMonth(iso, locale)` from `@/lib/format/date/formatMonth` (server module `_lib/badge.ts` only — never the `@/lib/format/date` barrel, W156).
- Blocks (by path): `Breadcrumbs` (`{ locale, items: { name, href }[], tone?: 'light' | 'dark', className? }`, reads `sys.nav.breadcrumbs`, emits `BreadcrumbList`) from `@/design/blocks/Breadcrumbs`; `ContactCta` (`{ placement: 'page_cta' | 'office_card', href: string | Exclude<Href, string>, variant?, size?: 'md' | 'lg', external?, className?, 'aria-label'?, children }`) from `@/design/blocks/ContactCta`; `FaqBlock` + `type FaqItem` (`{ bundle, locale, items: { id, q, a }[], id?, eyebrowId?, headingId?, bodyId?, askCard?: { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, phone?, callLabelId?, email?, emailLabelId?, subject? }, singleOpen?, openFirst?, headingLevel? }`, renders `id` on its root, emits `FAQPage`) from `@/design/blocks/FaqBlock`; `ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }` — owns its box, W129) from `@/design/blocks/ImageSlot`; `PostCard` (`{ bundle, locale, post, variant?, categoryLabel?, coverSrc?, headingLevel? }`) from `@/design/blocks/PostCard`.
- Primitives (by path): `Button` (`variant` ∈ `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`, `size` `md|lg`, `href?`, `external?`, `prefetch?`, `className?`, `…HTMLAttributes<HTMLElement>` incl. `onClick`/`onAuxClick`) from `@/design/primitives/Button`; `Section` (`{ tone: 'light'|'dark'|'pale'|'band', id?, className?, children }` — tones set the background and `py-16`; a longhand `pt-*`/`pb-*` override is allowed, a second `py-*` is not, W122) from `@/design/primitives/Section`; `Eyebrow` from `@/design/primitives/Eyebrow`.
- Island: `ProgressBar` (`{ value, max?, label, valueText?, tone?: 'blue'|'green'|'amber'|'red', className? }`) from `@/design/islands/ProgressBar`; `LazyIsland` (`{ load, props, fallback, rootMargin? }` — no `ssr`, W132) from `@/design/islands/LazyIsland` (Cycle 8 only).
- Chrome/analytics: `StickyCtaBar` + `type StickyCta` (`{ label, href: string | Exclude<Href, string>, variant?, external? }`; props `message, ctas, showAfterPx? (700), hideNearId?, live?`; renders `null` while hidden; wrapper `data-testid="sticky-cta"`; contact hrefs through `ContactCta` `page_cta`, W81) from `@/design/chrome/StickyCtaBar`; `ContactLink` (`'use client'`; `Omit<AnchorHTMLAttributes, 'href'|'onClick'|'onAuxClick'> & { href, placement, children }`) from `@/analytics/ContactLink`; `useContactClick(placement): (kind: 'call'|'whatsapp'|'email') => void` from `@/analytics/useContactClick` (client module only); `track(event, params)` + `PARAM_ENUMS.result = ['eligible','conditional','ineligible']`, `ALLOWED_PARAMS.eligibility_check_complete = ['page','locale','result']` from `@/analytics/track`.
- i18n/SEO/contact: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation` (typed pathnames; `prefetch` passes through); `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription })` from `@/lib/seo/metadata`; `waLink(number, text)`, `telLink(phone)`, `mailLink(email, subject?)` from `@/lib/contact`; `useTranslations` from `next-intl` (synchronous server sections), `getTranslations`, `setRequestLocale` from `next-intl/server`, `createTranslator`, `type Messages` from `next-intl` (tests — the loose-key pattern of `formatReadMinutes.ts`).
- Test utilities: `renderWithIntl(ui, { locale? })` from `@/test/render`; `collisionsInTree(root)` from `@/test/class-collisions` (the W122/W155 render-side guard).
- Messages consumed, not added: `sys.whatsapp.prefill` ("Merhaba JobsAdmire, " / "Hello JobsAdmire, "), `sys.nav.breadcrumbs`, `sys.seo.ogTagline`, `sys.blocks.readMinutes` (through `PostCard`).
- Operations catalog: **none** — the page carries no door form and sends no field (v1.0 and the four v1.1 fields — `hire.city`, `partner.track`, `contact.topic`, `careers.portfolioUrl`, WP2a Task 8 — are not involved).
- Gate tooling: `npm run gate` / `gate:launch` (`scripts/gate.sh`; the launch profile's `scripts/launch/dead-targets.ts` prints `… → missing id="permit-cta" …` until this page lands), `npm run js-size` (`scripts/js-size.mjs`), Playwright projects `mobile` (Pixel 7, 412 px) and `desktop` (1440×900).

Produces (nothing imports these files; later page tasks copy patterns, never import across route folders):
- DOM: `section#permit-cta` (the header's `CTA_BY_PATHNAME` target, the sticky bar's `hideNearId`); section anchors `#eligibility` (the wizard card), `#routes`, `#rules`, `#muafiyet`, `#timeline`, `#costs`, `#documents`, `#faq` — each once; one `data-lcp-slot` (the h1); one named placeholder `data-placeholder="wp-hero"` (T15's content-readiness row); the wizard's `data-testid="wp-eligibility"` with `data-island="ready"` after hydration.
- Route registration: `'/work-permit'` out of `UNBUILT_PATHNAMES` (T15 asserts the set empty); `{ path: '/calisma-izni', indexable: true }` and `{ path: '/en/work-permit', indexable: true }` in `GATE_ROUTE_TABLE`.
- Analytics: the first live producer of `eligibility_check_complete` (`{ page, locale, result }`).

**Rulings applied:**
- W1 — `wp.030` (`{placed}`), `wp.264` (`{firstDayWeeks}`), `wp.274` (`{firstDayWeeksInCountry}`) render their metrics through `makeTf`; no figure is typed in page code or sys copy.
- W2 — the wizard's "fewer than N Turkish employees" point is `sys.wp.wizard.points.ratio` with no timing claim; `wp.066` ("only checked from the 7th month") is never read; `wp.050`/`wp.051`, `wp.201`, `wp.339` render as authored outside the wizard (legal-flagged — the timing is counsel's question).
- W4 — `RelatedArticles` returns `null` while `blogNavVisible(bundle)` is false (0 Turkish bodies today) and reads the `blog` collection (`workPermits`, body in this locale) once it is true; `wp.353`–`358` are unused.
- W5 — no employer-updates/newsletter block; `wp.398` stays an orphan.
- W9/W23 — 25 `sys.*` keys for id-less copy (`sys.seo.wp.*` because `pages.wp` carries `''` ids); package fragments are composed only where the package splits them (`sp()`).
- W10/W119 — every ≤ 700 px switch is `max-md:hidden` (desktop-only) / `md:hidden` (mobile-only) on server-rendered markup; `hidden` never meets an unprefixed display utility.
- W12/W32 — every `tel:`/`wa.me`/`mailto:` anchor goes through `ContactCta`/`ContactLink`/`useContactClick` with `placement: 'page_cta'`; same-page anchors fire nothing.
- W13 (amended)/W120/W136 — the ledger's JS figure is `js-size`'s (ceiling 204,800 B, lazy line 194,560 B on the controller's binding preview); the wizard is small and above the fold, so it is an SSR'd client component (not `next/dynamic`/`LazyIsland`).
- W162 — the stop rule is local-adjusted: the preview's `npm run js-size` runs ≈ 2,836 B above the local build, so this task stops and reports when a LOCAL route figure is ≥ **191,724 B** (194,560 − 2,836); the controller's binding preview decides at 194,560 B. Projection here ≈ 181–186 KB (below the 190,000 B mark), so Cycle 8 stays a conditional cycle: on a crossing the proof stops and reports, and Cycle 8 (the sticky bar, the lazy pass already written below) runs on the controller's go-ahead before T5 starts.
- W17/W121/W152/W158 — the page renders `id="permit-cta"` for the existing `CTA_BY_PATHNAME` entry; no `ctas.ts` edit; Cycle 7 proves the launch anchor sweep no longer names it.
- W18/W81 — the page mounts `StickyCtaBar` (`hideNearId="permit-cta"`, `live`, the design's Call / WhatsApp / Hire CTAs); the bar tracks its own contact CTAs and carries `data-testid="sticky-cta"`.
- W19/R31 — the page lives in the `(site)` group and renders no `<main>`.
- W20/W21 — `'/work-permit'` leaves `UNBUILT_PATHNAMES` in the commit that adds `page.tsx`; the two locale rows join `GATE_ROUTE_TABLE` there too.
- W26/W67 — `eligibility_check_complete` carries `page`, `locale` and `result ∈ eligible|conditional|ineligible` only, once per completed run — never an answer.
- W45/W98 — every doc edit anchors on T1's headings/sentences and appends a row/bullet; no line numbers.
- W55/D26 — `wp-hero` is a named placeholder; the h1 is the page's one `data-lcp-slot` (setting `HERO_SRC` moves it onto the photo).
- W76/W95 — the wizard's WhatsApp result anchor carries only `https://wa.me/<number>` in the DOM; the prefill with the answers and the verdict is composed on click and opened with `noopener`; the page's other WhatsApp links carry package/sys prefills only (no visitor data), so they may sit in hrefs.
- W3/W73/W77/W78/W79/W92/W115/W116 — hold vacuously: no door form, no upload, no consent row, no wire field, the e2e needs no door.
- W82 — internal CTAs pass pathname strings (`Button`/`StickyCta`) or use the typed `Link`; hash CTAs are plain strings.
- W83 — the FAQ ask card's e-mail row is `FaqAskCard.email`/`emailLabelId`/`subject` (the design's ask card is WhatsApp + e-mail, no call row).
- W99 — T4 runs after T1, T13, T2 and T3 (its `/hire-workers` and `/hiring-cost-calculator` links resolve; `/partner-with-us` is T5's, so that one link is `prefetch={false}` — a viewport prefetch of an unbuilt route would 404 into the console and cost best-practices 1.00).
- W109 — breadcrumbs use this page's own ids: `wp.021` → `/`, `wp.011` → this page.
- W113 — section test ids sit on inner `<div>`s; `Section`'s props stay frozen.
- W118 — no history rewrite, no `wip` commit, no stash.
- W122/W155 — no class string sets one property twice at one variant (`class-collisions.test.ts` scans every file below; the section tests add the render-side `collisionsInTree` guard for compositions the static scan cannot see, e.g. `Section`'s tone + a caller class); a different look is a Button variant, never a caller colour class.
- W125/W130/W134/W147/W156/W158 — primitives, blocks, islands and the date function are imported by module path everywhere, type-only imports included; the client wizard's graph reaches no barrel, no message JSON and no `formatReadMinutes`.
- W126 — one build + one start + one gate as the proof (Cycle 7); a second build happens only in the conditional Cycle 8.
- W127 — WhatsApp CTAs wear the `success` variant wherever the design paints them green (the hero, the wizard's solid green result button — white on `#16a34a` is 3.3:1 — the permit-only banner, the cost quote, the closing band, the sticky bar); the white-faced asks on blue/navy cards (permit types, exemptions, renewal) keep the design's white face as `secondary`. W128 — not applicable (no green band, no PostCard byline change).
- W129 — `ImageSlot` gets no width/height/aspect/object class: the hero slot sits in a height-led cover wrapper.
- W132 — `LazyIsland({ load, props, fallback, rootMargin })` with an explicit props generic is used only by Cycle 8's conditional lazy pass.
- W165 — the conditional `LazyStickyBar` passes `rootMargin: '100000px 0px 200px 0px'` (T3's pattern, the top-extended margin): the page's jump nav, the `#permit-cta` link, a reload at a hash and scroll restoration can all jump past the bar's wrapper, and a plain 200 px margin would then never load the bar. A Cycle 8 test pins the margin through a recording `IntersectionObserver`.
- W178 — this page mounts no `Stat`/count-up (every metric is `makeTf`-filled static text, W1), so its one metric-text assertion in the page spec (`470+`, wp.030) needs no `emulateMedia`; a spec case that ever asserts the text of a `Stat` metric sets `page.emulateMedia({ reducedMotion: 'reduce' })` before `goto` or reads the sr-only final figure (the count-up flake).
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json`, identical to production): DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors; GTM stays dark (no `NEXT_PUBLIC_GTM_ID` locally).
- W137/W139/W140 — not applicable to the implementer (no preview run; never push).
- W148 — `CLIENT_SYS` is unchanged: the wizard island reads no `sys.*` (every string, the ICU progress labels and the prefill lines included, is resolved on the server and passed as a prop).
- W150 — `page.tsx` exports `revalidate = 86400` for the D17 dated badge.
- W154 — no `sys.wp.*` string speaks as "we"/"biz" (`voice.test.ts` scans all of `sys.*`); the company is "JobsAdmire" / "JobsAdmire izin ekibi"; the WhatsApp tails are the visitor's first person singular, like `sys.whatsapp.prefill`.
- W157/W160 — security headers come from the middleware; nothing for the page to do.
- W159/D27 — not a pixel-harness page: no pixel run; the named deltas above are the side-by-side reviewer's list.
- D11/D13 — WhatsApp is the page's co-primary conversion path in Phase A; no form, so no `/tesekkurler` navigation and no `generate_lead`.
- D17 — the dated badge (`rateConfig.updatedAt`/`reviewDueAt`), the wizard's quota ratio (`rateConfig.quotaRatio` through ICU `{ratio}`) and the three metric strings render from data; the document counts are computed from the lists (never `wp.300`'s "6 docs").
- D20 — the stacked comparison/timeline, the real captions, the contrast faces, the heading outline and the SVG glyphs listed in deltas 1, 10–13.
- R15 — the chrome renders the canonical `home.*` ids; this page reads none of `wp.001`–`wp.020` (except `wp.011`, the crumb) or `wp.368`–`wp.394`.

---
#### Cycle 1 — page-local tables, the fragment joiner, the wizard rules and prop builder, the dated badge, the prefills, `sys.wp` copy (pure code)

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/work-permit/_lib/__tests__/helpers.ts` (shared by every Vitest file of this page — not itself a test file):

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createTranslator, type Messages } from 'next-intl';
import { makeTf } from '@/content/pure';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import type { SysT } from '../wizard-props';

/** The real LOCAL bundles read from disk — the sanctioned test bypass (D23 governs how the
 *  running site loads a bundle, never a test fixture read): the tests render the package's
 *  own copy, so an unknown id throws exactly as `makeTf` does in development. */
export function loadBundle(locale: Locale): Bundle {
  return BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
}
export const BUNDLES: Record<Locale, Bundle> = { tr: loadBundle('tr'), en: loadBundle('en') };
export const tfFor = (locale: Locale) => makeTf(BUNDLES[locale], locale);

// `Messages` (next-intl's un-augmented `Record<string, any>`) keeps the key typing loose,
// exactly as `formatReadMinutes.ts` does.
const MESSAGES: Record<Locale, Messages> = { tr, en };
/** The `sys` translator in the call shape the page hands to the `_lib` builders
 *  (`getTranslations('sys')`). */
export function sysFor(locale: Locale): SysT {
  const t = createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys' });
  return (key, values) => t(key, values);
}

/** An element's class list as tokens. */
export const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
```

`src/app/[locale]/(site)/work-permit/_lib/__tests__/tables.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { POINT_ID, QUESTIONS, VERDICT_TITLE_ID } from '../eligibility';
import * as tables from '../tables';

const stringsOf = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;
const TR = stringsOf('tr');
const EN = stringsOf('en');

/** Every `wp.nnn` id a value holds, however deep. */
function idsIn(value: unknown): string[] {
  if (typeof value === 'string') return /^wp\.\d{3}$/.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(idsIn);
  if (value && typeof value === 'object') return Object.values(value).flatMap(idsIn);
  return [];
}
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `wp.${String(from + i).padStart(3, '0')}`);

describe('the page-id tables (docs/CONTENT-MODEL.md § Collections, W23)', () => {
  const ids = [...new Set([...idsIn(tables), ...idsIn({ QUESTIONS, POINT_ID, VERDICT_TITLE_ID })])];

  it('reference only wp.* ids that exist in both bundles', () => {
    expect(ids.length).toBeGreaterThan(200);
    expect(ids.filter((id) => !(id in TR) || !(id in EN))).toEqual([]);
  });

  it('never reference the ids this page deliberately leaves unread', () => {
    const unread = [
      'wp.022', // dated badge → sys.wp.hero.updated (D17)
      'wp.052', // the dropped fine chip (delta 2)
      'wp.066', // W2 — the wizard makes no timing claim
      'wp.261', // tab labels — the timeline cards stack (D20)
      'wp.262',
      'wp.300', // typed "6 docs" — the count is computed
      'wp.325', // the "60 / days" numeral
      ...range(353, 358), // static blog cards (W4)
      'wp.398', // orphan newsletter string (W5)
    ];
    expect(ids.filter((id) => unread.includes(id))).toEqual([]);
  });

  it('keep the design counts and orders', () => {
    expect(tables.HERO_BENEFITS.flat()).toEqual(range(28, 33));
    expect(tables.HERO_CHIPS.flatMap((c) => [c.strongId, c.restId])).toEqual(range(46, 51));
    expect(tables.JUMP_LINKS.map((j) => j.hash)).toEqual([
      '#eligibility',
      '#routes',
      '#rules',
      '#muafiyet',
      '#timeline',
      '#costs',
      '#documents',
      '#faq',
    ]);
    expect(tables.JUMP_LINKS.map((j) => j.labelId)).toEqual(range(57, 64));
    expect(tables.ROUTER_CARDS.map((c) => c.href)).toEqual([
      '/hire-workers',
      null,
      '/partner-with-us',
      '/hiring-cost-calculator',
    ]);
    expect(tables.ROUTER_CARDS.flatMap((c) => [c.titleId, c.bodyId, c.ctaId])).toEqual(
      range(85, 96),
    );
    expect(tables.COMPARE_ROWS.map((r) => r.labelId)).toEqual([
      'wp.110',
      'wp.115',
      'wp.120',
      'wp.125',
      'wp.132',
    ]);
    expect(tables.FIXED_TERM_BULLETS).toHaveLength(3);
    expect(tables.OTHER_PERMIT_TYPES.flat()).toEqual(range(176, 183));
    expect(tables.PENALTY_IDS).toEqual(range(196, 199));
    expect(tables.RULES.flatMap((r) => [r.titleId, r.bodyId])).toEqual(range(200, 211));
    expect(tables.EXEMPTION_CARDS.map((c) => c.titleId)).toEqual([
      'wp.220',
      'wp.222',
      'wp.225',
      'wp.228',
      'wp.230',
    ]);
    expect(tables.EXEMPTION_FACTS.flatMap((f) => [f.labelId, f.strongId, f.restId])).toEqual(
      range(234, 245),
    );
    expect(tables.PROCESS_STEPS.map((s) => s.badgeId ?? null)).toEqual([null, null, null, 'wp.255']);
    expect(tables.TIMELINE_CARDS.map((c) => [c.key, c.rows.length, c.noteId])).toEqual([
      ['abroad', 4, null],
      ['here', 3, 'wp.280'],
    ]);
    expect(tables.COST_CARDS.map((c) => c.ours)).toEqual([false, false, true]);
    expect(tables.DOC_LISTS.map((l) => [l.key, l.items.length])).toEqual([
      ['employer', 6],
      ['worker', 6],
    ]);
  });

  it('the FAQ is nine pairs in design order; wp.340 has no answer id (its answer is sys copy)', () => {
    expect(tables.FAQ_PAIRS.map((p) => p.qId)).toEqual([
      'wp.334',
      'wp.336',
      'wp.338',
      'wp.340',
      'wp.341',
      'wp.343',
      'wp.345',
      'wp.347',
      'wp.349',
    ]);
    expect(tables.FAQ_PAIRS.map((p) => p.aId)).toEqual([
      'wp.335',
      'wp.337',
      'wp.339',
      null,
      'wp.342',
      'wp.344',
      'wp.346',
      'wp.348',
      'wp.350',
    ]);
    expect(new Set(tables.FAQ_PAIRS.map((p) => p.id)).size).toBe(9);
  });
});
```

`src/app/[locale]/(site)/work-permit/_lib/__tests__/fragments.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { sp } from '../fragments';

describe('sp — the joiner between two package fragments the design glues together (W23)', () => {
  it('puts one space between two words, before a dash and before an opening bracket', () => {
    expect(sp('Up to 1 year', 'first, then 2-year and 3-year extensions')).toBe(' ');
    expect(sp('İŞKUR-licensed', '— Permit No. 1730, Law No. 4904')).toBe(' ');
    expect(sp('A small fixed fee for printing the permit card', '(değerli kağıt bedeli)')).toBe(' ');
  });
  it('puts nothing before closing punctuation (wp.118 + wp.119, wp.291 + wp.292)', () => {
    expect(sp('The employer', ", on the Ministry's online system")).toBe('');
    expect(sp('(değerli kağıt bedeli)', '. If the worker is abroad, the consular visa fee is added.')).toBe(
      '',
    );
  });
  it('puts nothing next to an empty fragment or existing whitespace', () => {
    expect(sp('', 'x')).toBe('');
    expect(sp('x', '')).toBe('');
    expect(sp('a ', 'b')).toBe('');
  });
});
```

`src/app/[locale]/(site)/work-permit/_lib/__tests__/eligibility.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  evaluate,
  isComplete,
  POINT_ID,
  POINT_KEYS,
  prefillText,
  QUESTION_KEYS,
  QUESTIONS,
  VERDICT_TITLE_ID,
  type Answers,
  type WizardQuestion,
} from '../eligibility';

const base: Answers = { company: 'yes', staff: 'atLeast', location: 'abroad', debts: 'no' };

describe('QUESTIONS — the design order; stable option keys replace its indices', () => {
  it('asks company → staff → location → debts with the design option order', () => {
    expect(QUESTIONS.map((q) => q.key)).toEqual([...QUESTION_KEYS]);
    expect(QUESTIONS.map((q) => q.qId)).toEqual(['wp.075', 'wp.076', 'wp.077', 'wp.080']);
    expect(QUESTIONS.map((q) => q.options.map((o) => o.key))).toEqual([
      ['yes', 'no'],
      ['atLeast', 'below'],
      ['abroad', 'resident', 'noPermit'],
      ['no', 'yes'],
    ]);
  });
  it('labels an option by its package id where the package has one, else by a sys word', () => {
    expect(
      QUESTIONS.flatMap((q) => q.options.map((o) => ('id' in o ? o.id : `sys:${o.sys}`))),
    ).toEqual([
      'sys:yes',
      'wp.081',
      'sys:atLeast',
      'sys:below',
      'sys:abroad',
      'wp.078',
      'wp.079',
      'sys:no',
      'wp.082',
    ]);
  });
});

describe('evaluate — the design’s eligResult() over keys', () => {
  it('eligible: a company, enough Turkish staff, no debts', () => {
    expect(evaluate(base)).toEqual({ verdict: 'eligible', points: ['locationAbroad', 'thresholds'] });
  });
  it('conditional: fewer Turkish staff than the ratio asks for', () => {
    expect(evaluate({ ...base, staff: 'below', location: 'resident' })).toEqual({
      verdict: 'conditional',
      points: ['ratio', 'locationResident', 'thresholds'],
    });
  });
  it('ineligible: no company yet — the thresholds point is suppressed', () => {
    expect(evaluate({ ...base, company: 'no', location: 'noPermit' })).toEqual({
      verdict: 'ineligible',
      points: ['company', 'locationNoPermit'],
    });
  });
  it('ineligible: overdue debts win over the staff rule', () => {
    expect(evaluate({ ...base, staff: 'below', debts: 'yes' })).toEqual({
      verdict: 'ineligible',
      points: ['ratio', 'locationAbroad', 'debts'],
    });
  });
  it('titles the three W67 buckets with the package ids', () => {
    expect(VERDICT_TITLE_ID).toEqual({
      eligible: 'wp.074',
      conditional: 'wp.073',
      ineligible: 'wp.072',
    });
  });
});

describe('W2 — the wizard never reads wp.066', () => {
  it('the ratio point has no package id; every other point keeps its design id', () => {
    expect(POINT_ID).toEqual({
      company: 'wp.065',
      ratio: null,
      locationAbroad: 'wp.067',
      locationResident: 'wp.068',
      locationNoPermit: 'wp.069',
      debts: 'wp.070',
      thresholds: 'wp.071',
    });
    expect(POINT_KEYS).toHaveLength(7);
  });
});

describe('isComplete', () => {
  it('is true only once all four questions are answered', () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete({ company: 'yes', staff: 'atLeast', location: 'abroad' })).toBe(false);
    expect(isComplete(base)).toBe(true);
  });
});

describe('prefillText — the WhatsApp message composed at click time (W76/W95)', () => {
  const questions: WizardQuestion[] = [
    { key: 'company', question: 'Company?', options: [{ key: 'yes', label: 'Yes' }] },
    { key: 'staff', question: 'Staff?', options: [{ key: 'below', label: 'Fewer than 5' }] },
    { key: 'location', question: 'Where?', options: [{ key: 'abroad', label: 'Abroad' }] },
    { key: 'debts', question: 'Debts?', options: [{ key: 'no', label: 'No' }] },
  ];
  it('is the intro, one "• question answer" line per question in order, then the result line', () => {
    expect(
      prefillText(
        'Hello JobsAdmire, my answers:',
        questions,
        { ...base, staff: 'below' },
        'Result: Likely eligible',
      ),
    ).toBe(
      [
        'Hello JobsAdmire, my answers:',
        '• Company? Yes',
        '• Staff? Fewer than 5',
        '• Where? Abroad',
        '• Debts? No',
        'Result: Likely eligible',
      ].join('\n'),
    );
  });
});
```

`src/app/[locale]/(site)/work-permit/_lib/__tests__/wizard-props.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { RATE } from '@/lib/calculator/__tests__/fixtures';
import { POINT_KEYS } from '../eligibility';
import { buildWizardProps } from '../wizard-props';
import { BUNDLES, sysFor, tfFor } from './helpers';

const build = (locale: 'tr' | 'en', quotaRatio = RATE.quotaRatio) =>
  buildWizardProps({
    locale,
    whatsappNumber: BUNDLES[locale].settings.whatsappNumber,
    quotaRatio,
    tf: tfFor(locale),
    sys: sysFor(locale),
  });

describe('buildWizardProps — every string the island shows or sends, resolved on the server (W9/W148)', () => {
  it('TR: the package questions, the sys option words and the ratio from rateConfig (D17)', () => {
    const p = build('tr');
    const tf = tfFor('tr');
    expect(p.locale).toBe('tr');
    expect(p.whatsappNumber).toBe('905011240340');
    expect(p.questions.map((q) => q.question)).toEqual(
      ['wp.075', 'wp.076', 'wp.077', 'wp.080'].map((id) => tf(id)),
    );
    expect(p.questions.map((q) => q.options.map((o) => o.label))).toEqual([
      ['Evet', tf('wp.081')],
      ['5 veya daha fazla', '5 kişiden az'],
      ['Yurt dışında', tf('wp.078'), tf('wp.079')],
      ['Hayır', tf('wp.082')],
    ]);
    expect(p.copy.progress).toEqual(['1 / 4', '2 / 4', '3 / 4', '4 / 4']);
    expect(p.copy.prefillIntro).toMatch(/^Merhaba JobsAdmire, sitenizdeki uygunluk kontrolünü yaptım/);
    expect(p.copy.prefillResult.eligible).toBe(`Sonuç: ${tf('wp.074')}`);
  });

  it('EN: the verdict titles, the seven points (the ratio point from sys, W2) and the card copy', () => {
    const p = build('en');
    const tf = tfFor('en');
    expect(p.copy.titles).toEqual({
      eligible: tf('wp.074'),
      conditional: tf('wp.073'),
      ineligible: tf('wp.072'),
    });
    expect(Object.keys(p.copy.points).sort()).toEqual([...POINT_KEYS].sort());
    expect(p.copy.points.company).toBe(tf('wp.065'));
    expect(p.copy.points.ratio).toContain('1:5');
    expect(p.copy.points.ratio).not.toBe(tf('wp.066'));
    expect([
      p.copy.heading,
      p.copy.subtitle,
      p.copy.back,
      p.copy.whatsapp,
      p.copy.needWorkers,
      p.copy.seeHiring,
      p.copy.restart,
      p.copy.footer,
    ]).toEqual(['wp.038', 'wp.039', 'wp.040', 'wp.041', 'wp.042', 'wp.043', 'wp.044', 'wp.045'].map(
      (id) => tf(id),
    ));
    expect(p.copy.progressLabel).toBe('Eligibility check progress');
    expect(p.copy.prefillIntro).toMatch(/^Hello JobsAdmire, I did the eligibility check/);
  });

  it('follows rateConfig.quotaRatio instead of a typed 5', () => {
    const p = build('en', 10);
    expect(p.questions[1].options.map((o) => o.label)).toEqual(['10 or more', 'Fewer than 10']);
    expect(p.copy.points.ratio).toContain('1:10');
  });
});
```

`src/app/[locale]/(site)/work-permit/_lib/__tests__/badge.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { RATE } from '@/lib/calculator/__tests__/fixtures';
import { heroBadge } from '../badge';
import { sysFor } from './helpers';

describe('heroBadge — the D17 dated badge (W150)', () => {
  const before = new Date('2026-09-28T09:00:00Z');

  it('reads the month from rateConfig.updatedAt, never a typed date (wp.022 is unread)', () => {
    expect(heroBadge(RATE, 'tr', sysFor('tr'), before)).toBe(
      'Güncelleme: Ocak 2026 · JobsAdmire izin ekibi tarafından incelendi',
    );
    expect(heroBadge(RATE, 'en', sysFor('en'), before)).toBe(
      'Updated January 2026 · Reviewed by the JobsAdmire permit team',
    );
  });

  it('disappears from reviewDueAt 00:00 UTC on', () => {
    expect(heroBadge(RATE, 'tr', sysFor('tr'), new Date('2026-12-19T23:59:59Z'))).not.toBeNull();
    expect(heroBadge(RATE, 'tr', sysFor('tr'), new Date('2026-12-20T00:00:00Z'))).toBeNull();
  });
});
```

`src/app/[locale]/(site)/work-permit/_lib/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { WA_TAILS, waPrefill } from '../prefill';
import { sysFor } from './helpers';

/** The page's id-less copy (W9/W23) — the frozen key set both message files carry. */
const SYS_WP_KEYS = [
  'documents.count',
  'faq.emailSubject',
  'faq.exemptionAnswer',
  'hero.updated',
  'sample.foreignerId',
  'sample.label',
  'sample.validity',
  'whatsapp.exemption',
  'whatsapp.permitOnly',
  'whatsapp.permitType',
  'whatsapp.question',
  'whatsapp.quote',
  'whatsapp.renewal',
  'wizard.options.abroad',
  'wizard.options.atLeast',
  'wizard.options.below',
  'wizard.options.no',
  'wizard.options.yes',
  'wizard.points.ratio',
  'wizard.prefill.intro',
  'wizard.prefill.result',
  'wizard.progress',
  'wizard.progressLabel',
];

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const sysOf = (file: unknown) => (file as { sys: Tree }).sys;
const wp = (file: unknown) => sysOf(file).wp as Tree;
const leaf = (file: unknown, path: string) =>
  path.split('.').reduce<unknown>((o, k) => (o as Tree)[k], wp(file)) as string;

describe('sys.wp.* and sys.seo.wp.* (W9/W23)', () => {
  it('carry the pinned key sets, identical in both locales', () => {
    expect(flatten(wp(tr)).sort()).toEqual([...SYS_WP_KEYS].sort());
    expect(flatten(wp(en)).sort()).toEqual([...SYS_WP_KEYS].sort());
    for (const file of [tr, en])
      expect(flatten((sysOf(file).seo as Tree).wp as Tree).sort()).toEqual(['description', 'title']);
  });

  it('W2: the wizard ratio point makes no timing claim', () => {
    expect(leaf(en, 'wizard.points.ratio')).not.toMatch(/\b(month|months|7th|day|days|week|weeks)\b/i);
    expect(leaf(tr, 'wizard.points.ratio')).not.toMatch(/(\bay\b|ayından|gün|hafta|7\.)/iu);
  });

  it('D17: the ratio, the month and the counts arrive as ICU values — no typed figure', () => {
    for (const file of [tr, en]) {
      for (const key of ['wizard.options.atLeast', 'wizard.options.below', 'wizard.points.ratio'])
        expect(leaf(file, key)).toContain('{ratio}');
      expect(leaf(file, 'wizard.points.ratio').replace('1:{ratio}', '')).not.toMatch(/\d/);
      expect(leaf(file, 'hero.updated')).toContain('{month}');
      expect(leaf(file, 'hero.updated')).not.toMatch(/\d/);
      expect(leaf(file, 'documents.count')).toContain('{n');
    }
  });

  it('W154: the company is "JobsAdmire"; the WhatsApp tails continue the visitor-voice greeting', () => {
    for (const file of [tr, en]) expect(leaf(file, 'hero.updated')).toContain('JobsAdmire');
    expect(waPrefill(sysFor('tr'), 'permitOnly')).toBe(
      'Merhaba JobsAdmire, kendi işçim var — çalışma iznini siz yürütebilir misiniz?',
    );
    expect(waPrefill(sysFor('en'), 'question')).toBe('Hello JobsAdmire, I have a work permit question.');
    // after "Merhaba JobsAdmire, " the Turkish tail starts lower-case
    for (const tail of WA_TAILS) expect(leaf(tr, `whatsapp.${tail}`)).toMatch(/^\p{Ll}/u);
    expect(leaf(tr, 'wizard.prefill.intro')).toMatch(/^\p{Ll}/u);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 work-permit
```
Expected: FAIL — `tables`, `fragments`, `eligibility`, `wizard-props` and `badge` tests cannot resolve `../tables`, `../fragments`, `../eligibility`, `../wizard-props`, `../badge`; `sys-keys.test.ts` cannot resolve `../prefill` (and, once it can, fails on `sys.wp` being `undefined`). `helpers.ts` itself loads (its `SysT` import is type-only).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_lib/tables.ts`:

```ts
/**
 * The Work Permit page's markup-only structures as package-id tables (docs/CONTENT-MODEL.md
 * § Collections: Phase A reads these shapes from the page's own ids — the package ships no
 * per-page JSON for them). Pure data with no runtime import, so the sections and the tests
 * share one source; `__tests__/tables.test.ts` proves every id exists in both bundles before a
 * dev-mode `makeTf` throw — or a silent '' in production — can. A sentence is split into
 * fragments only where the package itself splits it (W23); `sp()` joins them.
 */

/** One package fragment: `strong` renders in bold ink, `muted` in the tertiary grey. */
export type Frag = { id: string; strong?: boolean; muted?: boolean };

/** Hero benefit rows — bold lead + rest. `wp.030` is "{placed} permits filed": the `placed`
 *  metric through `makeTf` (W1/D17), never a typed 470. */
export const HERO_BENEFITS: readonly (readonly [string, string])[] = [
  ['wp.028', 'wp.029'],
  ['wp.030', 'wp.031'],
  ['wp.032', 'wp.033'],
];

export type ChipIcon = 'clock' | 'doc' | 'users';
/** Hero stat chips. The design's fourth ("₺100,000+ fine without a permit") has no figure id
 *  and `RateConfig` carries no fine — dropped (named delta 2; `wp.052` is unread). The third
 *  (`wp.050` + `wp.051`, "1 : 5 ratio — checked from month 7") renders as authored: W2 makes
 *  the timing counsel's question and keeps the claim out of the wizard only. */
export const HERO_CHIPS: readonly { icon: ChipIcon; strongId: string; restId: string }[] = [
  { icon: 'clock', strongId: 'wp.046', restId: 'wp.047' },
  { icon: 'doc', strongId: 'wp.048', restId: 'wp.049' },
  { icon: 'users', strongId: 'wp.050', restId: 'wp.051' },
];

/** The jump nav — every hash is an id this page renders (the page e2e checks each once). */
export const JUMP_LINKS: readonly { hash: string; labelId: string }[] = [
  { hash: '#eligibility', labelId: 'wp.057' },
  { hash: '#routes', labelId: 'wp.058' },
  { hash: '#rules', labelId: 'wp.059' },
  { hash: '#muafiyet', labelId: 'wp.060' },
  { hash: '#timeline', labelId: 'wp.061' },
  { hash: '#costs', labelId: 'wp.062' },
  { hash: '#documents', labelId: 'wp.063' },
  { hash: '#faq', labelId: 'wp.064' },
];

export type RouterKey = 'hire' | 'permitOnly' | 'partner' | 'calculator';
/** "Which one are you?" — `href` is the internal pathname; `null` is the permit-only door, the
 *  design's prefilled WhatsApp chat. */
export const ROUTER_CARDS: readonly {
  key: RouterKey;
  href: '/hire-workers' | '/partner-with-us' | '/hiring-cost-calculator' | null;
  titleId: string;
  bodyId: string;
  ctaId: string;
}[] = [
  { key: 'hire', href: '/hire-workers', titleId: 'wp.085', bodyId: 'wp.086', ctaId: 'wp.087' },
  { key: 'permitOnly', href: null, titleId: 'wp.088', bodyId: 'wp.089', ctaId: 'wp.090' },
  { key: 'partner', href: '/partner-with-us', titleId: 'wp.091', bodyId: 'wp.092', ctaId: 'wp.093' },
  {
    key: 'calculator',
    href: '/hiring-cost-calculator',
    titleId: 'wp.094',
    bodyId: 'wp.095',
    ctaId: 'wp.096',
  },
];

/** Standard permit vs e-Muafiyet: the criterion label and each side's fragments. */
export type CompareRow = { labelId: string; permit: readonly Frag[]; exempt: readonly Frag[] };
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    labelId: 'wp.110',
    permit: [{ id: 'wp.108' }, { id: 'wp.109', strong: true }],
    exempt: [{ id: 'wp.111' }, { id: 'wp.112', strong: true }],
  },
  {
    labelId: 'wp.115',
    permit: [{ id: 'wp.113', strong: true }, { id: 'wp.114' }],
    exempt: [{ id: 'wp.116', strong: true }, { id: 'wp.117' }],
  },
  {
    labelId: 'wp.120',
    permit: [{ id: 'wp.118', strong: true }, { id: 'wp.119' }],
    exempt: [{ id: 'wp.121', strong: true }, { id: 'wp.122' }],
  },
  {
    labelId: 'wp.125',
    permit: [{ id: 'wp.123' }, { id: 'wp.124', strong: true }],
    exempt: [{ id: 'wp.126' }, { id: 'wp.127', strong: true }, { id: 'wp.128' }],
  },
  {
    labelId: 'wp.132',
    permit: [{ id: 'wp.129' }, { id: 'wp.130', strong: true }, { id: 'wp.131' }],
    exempt: [{ id: 'wp.133' }, { id: 'wp.130', strong: true }, { id: 'wp.134' }],
  },
];

/** The featured fixed-term ("Süreli") card's three bullets. */
export const FIXED_TERM_BULLETS: readonly (readonly Frag[])[] = [
  [{ id: 'wp.167' }, { id: 'wp.168', strong: true }, { id: 'wp.169' }],
  [{ id: 'wp.170' }, { id: 'wp.130', strong: true }, { id: 'wp.171' }],
  [{ id: 'wp.172' }, { id: 'wp.173', strong: true }, { id: 'wp.174' }],
];
/** "Other types — special cases only": name + rest. */
export const OTHER_PERMIT_TYPES: readonly (readonly [string, string])[] = [
  ['wp.176', 'wp.177'],
  ['wp.178', 'wp.179'],
  ['wp.180', 'wp.181'],
  ['wp.182', 'wp.183'],
];

/** "Working without a permit costs" — legal-flagged lines, rendered verbatim (WP-C). */
export const PENALTY_IDS: readonly string[] = ['wp.196', 'wp.197', 'wp.198', 'wp.199'];
/** "What the Ministry checks before approving" — six numbered rules (`wp.194` says "all six"). */
export const RULES: readonly { titleId: string; bodyId: string }[] = [
  { titleId: 'wp.200', bodyId: 'wp.201' },
  { titleId: 'wp.202', bodyId: 'wp.203' },
  { titleId: 'wp.204', bodyId: 'wp.205' },
  { titleId: 'wp.206', bodyId: 'wp.207' },
  { titleId: 'wp.208', bodyId: 'wp.209' },
  { titleId: 'wp.210', bodyId: 'wp.211' },
];

export type ExemptionIcon = 'wrench' | 'globe' | 'leaf' | 'award' | 'package';
/** Article-48 categories: duration badge, title, body. */
export const EXEMPTION_CARDS: readonly {
  icon: ExemptionIcon;
  badgeId: string;
  titleId: string;
  bodyId: string;
}[] = [
  { icon: 'wrench', badgeId: 'wp.219', titleId: 'wp.220', bodyId: 'wp.221' },
  { icon: 'globe', badgeId: 'wp.219', titleId: 'wp.222', bodyId: 'wp.223' },
  { icon: 'leaf', badgeId: 'wp.224', titleId: 'wp.225', bodyId: 'wp.226' },
  { icon: 'award', badgeId: 'wp.227', titleId: 'wp.228', bodyId: 'wp.229' },
  { icon: 'package', badgeId: 'wp.219', titleId: 'wp.230', bodyId: 'wp.231' },
];
/** Deadline / Fees / Rights / Cooldown. */
export const EXEMPTION_FACTS: readonly { labelId: string; strongId: string; restId: string }[] = [
  { labelId: 'wp.234', strongId: 'wp.235', restId: 'wp.236' },
  { labelId: 'wp.237', strongId: 'wp.238', restId: 'wp.239' },
  { labelId: 'wp.240', strongId: 'wp.241', restId: 'wp.242' },
  { labelId: 'wp.243', strongId: 'wp.244', restId: 'wp.245' },
];

export type StepIcon = 'doc' | 'globe' | 'file' | 'check';
/** "How we get a permit approved" — the last step carries the "SGK day one" badge. */
export const PROCESS_STEPS: readonly {
  icon: StepIcon;
  titleId: string;
  bodyId: string;
  badgeId?: string;
}[] = [
  { icon: 'doc', titleId: 'wp.248', bodyId: 'wp.249' },
  { icon: 'globe', titleId: 'wp.250', bodyId: 'wp.251' },
  { icon: 'file', titleId: 'wp.252', bodyId: 'wp.253' },
  { icon: 'check', titleId: 'wp.254', bodyId: 'wp.256', badgeId: 'wp.255' },
];

/** The two timing cards. `wp.264`/`wp.274` carry `{firstDayWeeks}`/`{firstDayWeeksInCountry}` —
 *  the metrics through `makeTf` (W1/D17). The design's tab labels (`wp.261`/`262`) are not
 *  rendered: both cards show at every width (D20). */
export type TimelineCard = {
  key: 'abroad' | 'here';
  titleId: string;
  durationId: string;
  rows: readonly (readonly [string, string])[];
  noteId: string | null;
};
export const TIMELINE_CARDS: readonly TimelineCard[] = [
  {
    key: 'abroad',
    titleId: 'wp.263',
    durationId: 'wp.264',
    rows: [
      ['wp.265', 'wp.266'],
      ['wp.267', 'wp.268'],
      ['wp.269', 'wp.270'],
      ['wp.271', 'wp.272'],
    ],
    noteId: null,
  },
  {
    key: 'here',
    titleId: 'wp.273',
    durationId: 'wp.274',
    rows: [
      ['wp.265', 'wp.275'],
      ['wp.276', 'wp.277'],
      ['wp.278', 'wp.279'],
    ],
    noteId: 'wp.280',
  },
];

/** Three cost lines and, by design, no amounts (`wp.282`/`wp.295` — quoted in writing). */
export const COST_CARDS: readonly {
  eyebrowId: string;
  titleId: string;
  body: readonly Frag[];
  ours: boolean;
}[] = [
  {
    eyebrowId: 'wp.283',
    titleId: 'wp.284',
    body: [{ id: 'wp.285' }, { id: 'wp.286', muted: true }, { id: 'wp.287' }],
    ours: false,
  },
  {
    eyebrowId: 'wp.288',
    titleId: 'wp.289',
    body: [{ id: 'wp.290' }, { id: 'wp.291', muted: true }, { id: 'wp.292' }],
    ours: false,
  },
  { eyebrowId: 'wp.293', titleId: 'wp.294', body: [{ id: 'wp.295' }], ours: true },
];

export type DocList = {
  key: 'employer' | 'worker';
  titleId: string;
  items: readonly { id: string; noteId?: string }[];
};
/** Each list's count badge is computed from `items.length` (`sys.wp.documents.count`), never
 *  `wp.300`'s typed "6 docs". */
export const DOC_LISTS: readonly DocList[] = [
  {
    key: 'employer',
    titleId: 'wp.299',
    items: [
      { id: 'wp.301', noteId: 'wp.302' },
      { id: 'wp.303', noteId: 'wp.304' },
      { id: 'wp.305' },
      { id: 'wp.306' },
      { id: 'wp.307', noteId: 'wp.308' },
      { id: 'wp.309', noteId: 'wp.310' },
    ],
  },
  {
    key: 'worker',
    titleId: 'wp.311',
    items: [
      { id: 'wp.312' },
      { id: 'wp.313' },
      { id: 'wp.314' },
      { id: 'wp.315' },
      { id: 'wp.316' },
      { id: 'wp.317' },
    ],
  },
];

/** FAQ pairs in design order. `aId: null` — the design's e-Muafiyet answer was never
 *  catalogued; it lives in `sys.wp.faq.exemptionAnswer` (W9; on the WP-C legal sheet). */
export const FAQ_PAIRS: readonly { id: string; qId: string; aId: string | null }[] = [
  { id: 'q1', qId: 'wp.334', aId: 'wp.335' },
  { id: 'q2', qId: 'wp.336', aId: 'wp.337' },
  { id: 'q3', qId: 'wp.338', aId: 'wp.339' },
  { id: 'q4', qId: 'wp.340', aId: null },
  { id: 'q5', qId: 'wp.341', aId: 'wp.342' },
  { id: 'q6', qId: 'wp.343', aId: 'wp.344' },
  { id: 'q7', qId: 'wp.345', aId: 'wp.346' },
  { id: 'q8', qId: 'wp.347', aId: 'wp.348' },
  { id: 'q9', qId: 'wp.349', aId: 'wp.350' },
];
```

`src/app/[locale]/(site)/work-permit/_lib/fragments.ts`:

```ts
/**
 * The design glues split package fragments with bare `{{ a }}{{ b }}` and lets its runtime
 * space them. W23 allows composing exactly those fragments; this is the one joiner the page
 * uses, so "Up to 1 year" + "first, then …" gets its space and "The employer" + ", on the
 * Ministry's online system …" (wp.118 + wp.119) does not.
 */
export function sp(prev: string, next: string): ' ' | '' {
  if (!prev || !next) return '';
  if (/\s$/.test(prev) || /^\s/.test(next)) return '';
  if (/^[,.;:!?)\]…]/.test(next)) return '';
  return ' ';
}
```

`src/app/[locale]/(site)/work-permit/_lib/eligibility.ts`:

```ts
import type { Locale } from '@/i18n/routing';

/**
 * The eligibility wizard's rules — the design's `eligResult()` with option INDICES replaced by
 * stable option keys, so a translated or reordered option list can never flip a verdict.
 * Pure (one type-only import), so the client island runs it in the browser and the tests in
 * Node. Nothing here is sent anywhere — the card promises "nothing is stored" (wp.045): the
 * island pushes only the verdict bucket (W26/W67) and opens WhatsApp with a message it composes
 * when the visitor clicks (W76/W95).
 */
export const QUESTION_KEYS = ['company', 'staff', 'location', 'debts'] as const;
export type QuestionKey = (typeof QUESTION_KEYS)[number];

/** Where an option's label comes from: a package id, or a `sys.wp.wizard.options.*` key for the
 *  design's script-only words ("Yes", "5 or more", …); `ratio` = the label takes the quota ratio
 *  from `rateConfig.quotaRatio` (D17). */
export type OptionSource = { key: string; id: string } | { key: string; sys: string; ratio?: true };

export const QUESTIONS: readonly {
  key: QuestionKey;
  qId: string;
  options: readonly OptionSource[];
}[] = [
  {
    key: 'company',
    qId: 'wp.075',
    options: [
      { key: 'yes', sys: 'yes' },
      { key: 'no', id: 'wp.081' },
    ],
  },
  {
    key: 'staff',
    qId: 'wp.076',
    options: [
      { key: 'atLeast', sys: 'atLeast', ratio: true },
      { key: 'below', sys: 'below', ratio: true },
    ],
  },
  {
    key: 'location',
    qId: 'wp.077',
    options: [
      { key: 'abroad', sys: 'abroad' },
      { key: 'resident', id: 'wp.078' },
      { key: 'noPermit', id: 'wp.079' },
    ],
  },
  {
    key: 'debts',
    qId: 'wp.080',
    options: [
      { key: 'no', sys: 'no' },
      { key: 'yes', id: 'wp.082' },
    ],
  },
];

export type Answers = Record<QuestionKey, string>;
export type PartialAnswers = Partial<Answers>;

/** W26/W67: the three buckets `eligibility_check_complete.result` accepts. */
export type Verdict = 'eligible' | 'conditional' | 'ineligible';
export const VERDICTS: readonly Verdict[] = ['eligible', 'conditional', 'ineligible'];
/** eligible "You look eligible" · conditional "Likely eligible, with planning" · ineligible
 *  "Fixable — but not yet". */
export const VERDICT_TITLE_ID: Record<Verdict, string> = {
  eligible: 'wp.074',
  conditional: 'wp.073',
  ineligible: 'wp.072',
};

export const POINT_KEYS = [
  'company',
  'ratio',
  'locationAbroad',
  'locationResident',
  'locationNoPermit',
  'debts',
  'thresholds',
] as const;
export type PointKey = (typeof POINT_KEYS)[number];
/** The package id per result point. `ratio` is `null` — W2: the wizard makes no claim about
 *  WHEN the ratio is checked, so `wp.066` ("only checked from the 7th month …") is never read
 *  here; its copy is `sys.wp.wizard.points.ratio`. */
export const POINT_ID: Record<PointKey, string | null> = {
  company: 'wp.065',
  ratio: null,
  locationAbroad: 'wp.067',
  locationResident: 'wp.068',
  locationNoPermit: 'wp.069',
  debts: 'wp.070',
  thresholds: 'wp.071',
};

export function evaluate(a: Answers): { verdict: Verdict; points: PointKey[] } {
  const points: PointKey[] = [];
  if (a.company === 'no') points.push('company');
  if (a.staff === 'below') points.push('ratio');
  if (a.location === 'abroad') points.push('locationAbroad');
  if (a.location === 'resident') points.push('locationResident');
  if (a.location === 'noPermit') points.push('locationNoPermit');
  if (a.debts === 'yes') points.push('debts');
  if (a.company === 'yes' && a.debts === 'no') points.push('thresholds');
  if (a.company === 'no' || a.debts === 'yes') return { verdict: 'ineligible', points };
  if (a.staff === 'below') return { verdict: 'conditional', points };
  return { verdict: 'eligible', points };
}

export function isComplete(a: PartialAnswers): a is Answers {
  return QUESTION_KEYS.every((k) => a[k] !== undefined);
}

/** Resolved on the server and handed to the island as props: the island reads no `sys.*`, so
 *  `CLIENT_SYS` stays unchanged (W148). */
export type WizardOption = { key: string; label: string };
export type WizardQuestion = { key: QuestionKey; question: string; options: WizardOption[] };
export type WizardCopy = {
  heading: string;
  subtitle: string;
  back: string;
  whatsapp: string;
  needWorkers: string;
  seeHiring: string;
  restart: string;
  footer: string;
  progressLabel: string;
  /** "1 / 4" … "4 / 4" — the step pill, one entry per question. */
  progress: string[];
  titles: Record<Verdict, string>;
  points: Record<PointKey, string>;
  /** `sys.whatsapp.prefill` + `sys.wp.wizard.prefill.intro` (the visitor's own voice). */
  prefillIntro: string;
  /** `sys.wp.wizard.prefill.result` filled with each verdict's title. */
  prefillResult: Record<Verdict, string>;
};
export type WizardProps = {
  locale: Locale;
  whatsappNumber: string;
  questions: WizardQuestion[];
  copy: WizardCopy;
};

/** The WhatsApp message the result button opens — composed when the visitor clicks (W76/W95),
 *  never placed in a DOM href: the intro, one line per answer, the verdict line. */
export function prefillText(
  intro: string,
  questions: readonly WizardQuestion[],
  answers: Answers,
  resultLine: string,
): string {
  const lines = questions.map((q) => {
    const answer = q.options.find((o) => o.key === answers[q.key])?.label ?? answers[q.key];
    return `• ${q.question} ${answer}`;
  });
  return [intro, ...lines, resultLine].join('\n');
}
```

`src/app/[locale]/(site)/work-permit/_lib/wizard-props.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import {
  POINT_ID,
  POINT_KEYS,
  QUESTIONS,
  VERDICT_TITLE_ID,
  VERDICTS,
  type PointKey,
  type Verdict,
  type WizardProps,
} from './eligibility';

/** The call shape of the `sys` translator the page hands over (`getTranslations('sys')`). */
export type SysT = (key: string, values?: Record<string, string | number>) => string;

/** Resolves every string the wizard island shows or sends, on the server (W9: labels are
 *  props): package ids through `tf` (`makeTf`, D17), the design's id-less option words, the W2
 *  ratio point, the step pills and the prefill lines through `sys.wp.wizard.*`, the quota ratio
 *  from `rateConfig.quotaRatio` (D17). */
export function buildWizardProps(args: {
  locale: Locale;
  whatsappNumber: string;
  quotaRatio: number;
  tf: (id: string) => string;
  sys: SysT;
}): WizardProps {
  const { locale, whatsappNumber, quotaRatio, tf, sys } = args;
  const ratio = { ratio: quotaRatio };
  const questions = QUESTIONS.map((q) => ({
    key: q.key,
    question: tf(q.qId),
    options: q.options.map((o) => ({
      key: o.key,
      label: 'id' in o ? tf(o.id) : sys(`wp.wizard.options.${o.sys}`, o.ratio ? ratio : undefined),
    })),
  }));
  const titles = Object.fromEntries(
    VERDICTS.map((v) => [v, tf(VERDICT_TITLE_ID[v])]),
  ) as Record<Verdict, string>;
  const points = Object.fromEntries(
    POINT_KEYS.map((k) => {
      const id = POINT_ID[k];
      return [k, id ? tf(id) : sys('wp.wizard.points.ratio', ratio)];
    }),
  ) as Record<PointKey, string>;
  return {
    locale,
    whatsappNumber,
    questions,
    copy: {
      heading: tf('wp.038'),
      subtitle: tf('wp.039'),
      back: tf('wp.040'),
      whatsapp: tf('wp.041'),
      needWorkers: tf('wp.042'),
      seeHiring: tf('wp.043'),
      restart: tf('wp.044'),
      footer: tf('wp.045'),
      progressLabel: sys('wp.wizard.progressLabel'),
      progress: questions.map((_, i) =>
        sys('wp.wizard.progress', { current: i + 1, total: questions.length }),
      ),
      titles,
      points,
      prefillIntro: `${sys('whatsapp.prefill')}${sys('wp.wizard.prefill.intro')}`,
      prefillResult: Object.fromEntries(
        VERDICTS.map((v) => [v, sys('wp.wizard.prefill.result', { title: titles[v] })]),
      ) as Record<Verdict, string>,
    },
  };
}
```

`src/app/[locale]/(site)/work-permit/_lib/prefill.ts`:

```ts
/** The page's six WhatsApp prefills: the site-wide greeting (`sys.whatsapp.prefill`, the
 *  visitor's voice) + one of this page's tails (`sys.wp.whatsapp.*`). Authored text only — no
 *  visitor data — so these may sit in a DOM href (W95 governs the wizard's answers alone). */
export const WA_TAILS = [
  'question',
  'permitOnly',
  'permitType',
  'exemption',
  'quote',
  'renewal',
] as const;
export type WaTail = (typeof WA_TAILS)[number];

export function waPrefill(sys: (key: string) => string, tail: WaTail): string {
  return `${sys('whatsapp.prefill')}${sys(`wp.whatsapp.${tail}`)}`;
}
```

`src/app/[locale]/(site)/work-permit/_lib/badge.ts` (server-only by use: it formats through `@/lib/format/date/formatMonth`, which no client module may import — W156):

```ts
import type { RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { isReviewDue } from '@/lib/calculator';
import { formatMonth } from '@/lib/format/date/formatMonth';
import type { SysT } from './wizard-props';

/** D17: the hero's "Updated … · Reviewed by …" badge. `wp.022`'s hard-typed "July 2026" gives
 *  way to `sys.wp.hero.updated` filled from `rateConfig.updatedAt`, and the badge disappears
 *  from `reviewDueAt` on — the page revalidates daily so that switch needs no deploy (W150). */
export function heroBadge(
  rateConfig: RateConfig,
  locale: Locale,
  sys: SysT,
  now: Date = new Date(),
): string | null {
  if (isReviewDue(rateConfig, now)) return null;
  return sys('wp.hero.updated', { month: formatMonth(rateConfig.updatedAt, locale) });
}
```

`src/app/[locale]/(site)/work-permit/_lib/assets.ts`:

```ts
/** §10 row 4 gives this page no hero photo at launch ("gradients elsewhere"): the `wp-hero`
 *  slot stays a named placeholder behind the navy gradients and the h1 is the LCP element
 *  (D26). A licensed photo lands here (keep the 16:9 ratio of the Hero's cover wrapper);
 *  setting this constant moves `data-lcp-slot` onto the image and adds its preload. */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1600, height: 900 } as const;
```

`src/messages/en.json` — (1) inside the existing `"seo"` object of `sys`, after its last member (add the comma the JSON needs after that member; T1/T13/T3 may have added `home`, `portal`, `privacy`, …, `calc` after `ogTagline` — leave them untouched):

```json
      "wp": {
        "title": "Work permit in Türkiye for foreign workers — rules, e-Muafiyet and process | JobsAdmire",
        "description": "Turkish work permits under Law No. 6735: the standard permit or the e-Muafiyet exemption, the employer criteria, timelines, costs and documents — filed by JobsAdmire under its İŞKUR licence."
      }
```

(2) a new member of `sys`, placed immediately before the line `    "form": {` (four spaces — the `sys.form` object whose first child is `"labels": {`). The true layout of `sys` when this task runs: T2's `hire` object (WP2b T2 placed it immediately before `form`) already sits just above that line, so `wp` goes between `hire` and `form`; T1's `home` and then T3's `calc` (T3 appends `sys.calc` as the LAST member of `sys`, after `form` — W166) sit BELOW `form`, not above it. Leave `hire`, `form`, `home` and `calc` untouched:

```json
    "wp": {
      "hero": {
        "updated": "Updated {month} · Reviewed by the JobsAdmire permit team"
      },
      "wizard": {
        "progress": "{current} / {total}",
        "progressLabel": "Eligibility check progress",
        "options": {
          "yes": "Yes",
          "no": "No",
          "atLeast": "{ratio} or more",
          "below": "Fewer than {ratio}",
          "abroad": "Abroad"
        },
        "points": {
          "ratio": "Fewer than {ratio} Turkish employees on SGK for each foreign worker: the standard permit's 1:{ratio} ratio applies to your workplace, and some sectors are exempt — JobsAdmire checks how it applies before anything is filed."
        },
        "prefill": {
          "intro": "I did the eligibility check on your website and would like to discuss a work permit. My answers:",
          "result": "Result: {title}"
        }
      },
      "sample": {
        "label": "Illustrative sample of a Turkish work permit card with fictional details",
        "foreignerId": "99•• ••• ••44",
        "validity": "15.08.2026 — 14.08.2027"
      },
      "documents": {
        "count": "{n, plural, one {# document} other {# documents}}"
      },
      "faq": {
        "exemptionAnswer": "e-Muafiyet is the Ministry's online work permit exemption system (emuafiyet.csgb.gov.tr). Foreigners whose work fits an Article 48 category — machinery installation and training, cross-border services, seasonal agriculture, scientific or sporting activities and others — can work without a full permit for a limited period, typically up to 3 months. Domestic applications must be filed within 30 days of entering Türkiye.",
        "emailSubject": "Work permit question"
      },
      "whatsapp": {
        "question": "I have a work permit question.",
        "permitOnly": "I have my own worker — can you handle the work permit?",
        "permitType": "which work permit type applies to my case?",
        "exemption": "does my case qualify for a work permit exemption?",
        "quote": "what would a work permit cost for my case?",
        "renewal": "I need help renewing a work permit."
      }
    },
```

`src/messages/tr.json` — the same two places:

```json
      "wp": {
        "title": "Yabancı işçiler için Türkiye çalışma izni — kurallar, e-Muafiyet ve süreç | JobsAdmire",
        "description": "6735 sayılı Kanun kapsamında çalışma izni: standart izin ya da e-Muafiyet, işveren kriterleri, süreler, maliyetler ve belgeler — dosyayı JobsAdmire, İŞKUR lisansıyla yürütür."
      }
```

```json
    "wp": {
      "hero": {
        "updated": "Güncelleme: {month} · JobsAdmire izin ekibi tarafından incelendi"
      },
      "wizard": {
        "progress": "{current} / {total}",
        "progressLabel": "Uygunluk kontrolünün ilerleyişi",
        "options": {
          "yes": "Evet",
          "no": "Hayır",
          "atLeast": "{ratio} veya daha fazla",
          "below": "{ratio} kişiden az",
          "abroad": "Yurt dışında"
        },
        "points": {
          "ratio": "Her yabancı işçi için SGK'da {ratio} kişiden az Türk çalışan: standart izinde 1:{ratio} oranı iş yerinize uygulanır ve bazı sektörler muaftır — JobsAdmire, dosyalamadan önce oranın nasıl uygulandığını kontrol eder."
        },
        "prefill": {
          "intro": "sitenizdeki uygunluk kontrolünü yaptım ve bir çalışma izni hakkında görüşmek istiyorum. Cevaplarım:",
          "result": "Sonuç: {title}"
        }
      },
      "sample": {
        "label": "Kurgusal bilgilerle hazırlanmış temsili Türkiye çalışma izni kartı",
        "foreignerId": "99•• ••• ••44",
        "validity": "15.08.2026 — 14.08.2027"
      },
      "documents": {
        "count": "{n} belge"
      },
      "faq": {
        "exemptionAnswer": "e-Muafiyet, Bakanlığın çevrim içi çalışma izni muafiyet sistemidir (emuafiyet.csgb.gov.tr). İşi 48. madde kategorilerinden birine giren yabancılar — makine montajı ve eğitimi, sınır ötesi hizmetler, mevsimlik tarım, bilimsel veya sportif faaliyetler ve diğerleri — tam izin olmadan sınırlı bir süre, genellikle 3 aya kadar çalışabilir. Yurt içi başvurular Türkiye'ye girişten sonraki 30 gün içinde yapılmalıdır.",
        "emailSubject": "Çalışma izni sorusu"
      },
      "whatsapp": {
        "question": "çalışma izniyle ilgili bir sorum var.",
        "permitOnly": "kendi işçim var — çalışma iznini siz yürütebilir misiniz?",
        "permitType": "benim durumumda hangi çalışma izni türü geçerli?",
        "exemption": "durumum çalışma izni muafiyetine giriyor mu?",
        "quote": "benim durumumda çalışma izni ne kadar tutar?",
        "renewal": "bir çalışma iznini yenilemek için yardıma ihtiyacım var."
      }
    },
```

Why these and nothing else: the SEO pair exists because `pages.wp` carries `''` ids (W23/W38 — the design's `<title>`/meta are outside the catalogue; the dated "(2026)" of the design title is left out, D17). `hero.updated` replaces `wp.022` (D17). The wizard's option words "Yes/No/5 or more/Fewer than 5/Abroad" and the "1 / 4" pill are hard-coded in the design's script with no id; `atLeast`/`below`/`points.ratio` take `{ratio}` so `rateConfig.quotaRatio` is the one source of the 5 (D17), and `points.ratio` is W2's timing-free replacement for `wp.066`. `prefill.*` is the visitor-voice message the result button composes on click (W95). `sample.*` names the mock card for assistive tech and carries its two id-less fictional values. `documents.count` replaces `wp.300`'s typed count. `faq.exemptionAnswer` is the design's `faqData[3].a` (Türkiye per W7), never catalogued — **WP-C legal item**; `faq.emailSubject` is the ask card's mailto subject (W83). `whatsapp.*` are the design's six prefill texts minus the greeting, which `sys.whatsapp.prefill` supplies (visitor voice — TR tails start lower-case because they follow "Merhaba JobsAdmire, "). W154: no key speaks as "we"/"biz" — the company is "JobsAdmire" / "JobsAdmire izin ekibi"; `voice.test.ts` checks all of `sys.*` (the tails' "I/my"/"sorum/işçim" are first person singular, which the rule allows). The TR apostrophes (`SGK'da`, `Türkiye'ye`, `Bakanlığın`) and the EN ones (`Ministry's`, `permit's`) are literal in ICU (an apostrophe quotes only before `{`, `}`, `#`, `|` or `'`).

`docs/CONTENT-MODEL.md` — in the per-page `sys.*` bullet list T1 created at the end of `### Adding copy (W9, W23, W54)` (W98; `grep -n '^### Adding copy' docs/CONTENT-MODEL.md`), append after the last bullet (T3's Cost Calculator bullet, or whichever is last):

```markdown
- **Work Permit (`sys.wp.*` + `sys.seo.wp.*`, WP2b T4):** `hero.updated` (ICU `{month}` from `rateConfig.updatedAt` — replaces `wp.022`'s typed date and hides from `reviewDueAt`, D17; the page revalidates daily, W150), `wizard.{progress,progressLabel}` (the `{current} / {total}` step pill and the progress bar's accessible name), `wizard.options.{yes,no,atLeast,below,abroad}` (the design's script-only option words; `atLeast`/`below` take `{ratio}` from `rateConfig.quotaRatio`), `wizard.points.ratio` (W2: the ratio point with no timing claim — replaces `wp.066` inside the wizard; takes `{ratio}`), `wizard.prefill.{intro,result}` (the visitor-voice WhatsApp message the result button composes on click, W95), `sample.{label,foreignerId,validity}` (the mock card's accessible name and its two id-less fictional values), `documents.count` (ICU — computed from the list, never `wp.300`), `faq.{exemptionAnswer,emailSubject}` (the design's never-catalogued e-Muafiyet answer — **WP-C legal item** — and the ask card's mailto subject, W83), `whatsapp.{question,permitOnly,permitType,exemption,quote,renewal}` (the six prefill tails after `sys.whatsapp.prefill`, the visitor's first person singular; TR lower-case); plus `seo.wp.{title,description}` (the page record `wp` carries `''` ids, W23/W38). Every other string on the page is a `wp.*` id through `makeTf` (`wp.030`/`264`/`274` carry metric placeholders, W1). Deliberately unread: `wp.022` (dated), `wp.052` (the dropped fine chip), `wp.066` (W2), `wp.261`/`262` (tab labels — the cards stack, D20), `wp.300` (typed count), `wp.325` (the "days" numeral), `wp.353`–`358` (static blog cards — the block reads the `blog` collection, W4), `wp.396`/`397` (schema text — the site-wide node is the layout's), `wp.398` (orphan newsletter string, W5) and the chrome ids `wp.001`–`010`, `wp.012`–`020`, `wp.368`–`394` (R15; `wp.016`/`017` are the header CTA, rendered by the chrome). No client module reads `sys.wp` — the wizard island receives resolved strings — so `CLIENT_SYS` is unchanged (W148).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the six `_lib/__tests__` files pass (tables 4, fragments 3, eligibility 10, wizard-props 3, badge 2, sys-keys 4); `src/messages/messages.test.ts` (identical TR/EN key sets), `voice.test.ts` (W154 over all of `sys.*`) and `client-messages.test.ts` (W148 — no client module reads `sys.wp`) stay green; typecheck/lint/prettier clean. `src/lib/seo/unbuilt.test.ts` stays green: no `page.tsx` exists yet and `'/work-permit'` is still in the set.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/_lib" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md
git commit -m "feat(work-permit): page-local id tables, wizard rules and prop builder, dated badge, prefills, sys.wp copy

Stable option keys replace the design's index-based eligResult (verdict buckets per
W67); the ratio point is sys copy with no timing claim and wp.066 is never read (W2);
the quota ratio and the badge month come from rateConfig (D17/W150); 25 sys keys in
both locales, JobsAdmire as the subject (W9/W23/W154); CONTENT-MODEL bullet (W98).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the eligibility wizard island (stores nothing, no door, result bucket only, click-time WhatsApp prefill) and the page's icon set

The wizard is small and sits in the hero, above the fold, so it is an SSR'd `'use client'` component (W13 amended: `next/dynamic`/`LazyIsland` are for heavy or below-the-fold islands). It reads no `sys.*` — every string arrives as a prop from `buildWizardProps` (Cycle 1), so `CLIENT_SYS` stays as it is (W148). Its graph is `@/analytics/track`, `@/analytics/useContactClick`, `@/design/islands/ProgressBar`, `@/design/primitives/Button`, `@/i18n/navigation`, `@/lib/contact`, `../_lib/eligibility` and `./icons` — no barrel, no message JSON, no `formatReadMinutes` (W147/W156/W158; `client-imports.test.ts` walks it).

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/work-permit/_components/__tests__/EligibilityWizard.test.tsx`:

```tsx
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waLink } from '@/lib/contact';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import type { WizardProps } from '../../_lib/eligibility';
import { EligibilityWizard } from '../EligibilityWizard';

const WA = 'https://wa.me/905011240340';
const props: WizardProps = {
  locale: 'tr',
  whatsappNumber: '905011240340',
  questions: [
    {
      key: 'company',
      question: 'Şirket?',
      options: [
        { key: 'yes', label: 'Evet' },
        { key: 'no', label: 'Hayır / henüz değil' },
      ],
    },
    {
      key: 'staff',
      question: 'Personel?',
      options: [
        { key: 'atLeast', label: '5 veya daha fazla' },
        { key: 'below', label: '5 kişiden az' },
      ],
    },
    {
      key: 'location',
      question: 'İşçi nerede?',
      options: [
        { key: 'abroad', label: 'Yurt dışında' },
        { key: 'resident', label: 'İkametli' },
        { key: 'noPermit', label: 'İkametsiz' },
      ],
    },
    {
      key: 'debts',
      question: 'Borç?',
      options: [
        { key: 'no', label: 'Hayır' },
        { key: 'yes', label: 'Evet / emin değilim' },
      ],
    },
  ],
  copy: {
    heading: 'Yabancı işçi çalıştırabilir misiniz?',
    subtitle: 'Ücretsiz 60 saniyelik kontrol',
    back: '← Geri',
    whatsapp: "WhatsApp'tan net cevap alın",
    needWorkers: 'İşçiye de mi ihtiyacınız var?',
    seeHiring: 'Bizimle işe alım nasıl işliyor →',
    restart: '↺ Yeniden başla',
    footer: 'hiçbir bilgi saklanmaz',
    progressLabel: 'Uygunluk kontrolünün ilerleyişi',
    progress: ['1 / 4', '2 / 4', '3 / 4', '4 / 4'],
    titles: { eligible: 'Uygun', conditional: 'Planlamayla', ineligible: 'Düzeltilebilir' },
    points: {
      company: 'P-company',
      ratio: 'P-ratio',
      locationAbroad: 'P-abroad',
      locationResident: 'P-resident',
      locationNoPermit: 'P-nopermit',
      debts: 'P-debts',
      thresholds: 'P-thresholds',
    },
    prefillIntro: 'Merhaba JobsAdmire, kontrolü yaptım. Cevaplarım:',
    prefillResult: {
      eligible: 'Sonuç: Uygun',
      conditional: 'Sonuç: Planlamayla',
      ineligible: 'Sonuç: Düzeltilebilir',
    },
  },
};

type Entry = Record<string, unknown>;
const pushed = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;

beforeEach(() => {
  (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

async function answer(...labels: string[]) {
  for (const name of labels) await userEvent.click(screen.getByRole('button', { name }));
}

describe('EligibilityWizard — the #eligibility card', () => {
  it('renders question 1 of 4 with an empty progress bar and no Back, and marks itself ready', () => {
    const { container } = renderWithIntl(<EligibilityWizard {...props} />);
    const card = screen.getByTestId('wp-eligibility');
    expect(card).toHaveAttribute('id', 'eligibility');
    expect(card).toHaveAttribute('data-island', 'ready');
    expect(screen.getByRole('heading', { level: 2, name: props.copy.heading })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Şirket?' })).toBeInTheDocument();
    expect(screen.getByTestId('wp-eligibility-step')).toHaveTextContent('1 / 4');
    const bar = screen.getByRole('progressbar', { name: props.copy.progressLabel });
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(screen.queryByRole('button', { name: props.copy.back })).toBeNull();
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('advances, goes back with the earlier answer marked, and moves focus to each new question (D20)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet');
    expect(screen.getByText('Personel?')).toHaveFocus();
    expect(screen.getByTestId('wp-eligibility-step')).toHaveTextContent('2 / 4');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    await userEvent.click(screen.getByRole('button', { name: props.copy.back }));
    expect(screen.getByText('Şirket?')).toHaveFocus();
    // the earlier answer carries the decorative SVG check (never a text glyph, D20)
    expect(screen.getByRole('button', { name: 'Evet' }).querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Hayır / henüz değil' }).querySelector('svg')).toBeNull();
  });

  it('fires eligibility_check_complete once with the verdict bucket only — never an answer (W26/W67)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Hayır / henüz değil', '5 veya daha fazla', 'Yurt dışında', 'Evet / emin değilim');
    // `page` is next/navigation's usePathname (R35) — null outside the App Router → '/'
    expect(pushed()).toEqual([
      { event: 'eligibility_check_complete', page: '/', locale: 'tr', result: 'ineligible' },
    ]);
    expect(screen.getByRole('heading', { level: 3, name: 'Düzeltilebilir' })).toHaveFocus();
    const result = screen.getByTestId('wp-eligibility-result');
    expect(within(result).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'P-company',
      'P-abroad',
      'P-debts',
    ]);
    expect(screen.queryByTestId('wp-eligibility-step')).toBeNull();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
  });

  it('keeps the WhatsApp href bare and opens the prefilled chat on click, noopener (W76/W95)', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 kişiden az', 'İkametli', 'Hayır');
    const link = screen.getByRole('link', { name: props.copy.whatsapp });
    expect(link).toHaveAttribute('href', WA);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(document.body.innerHTML).not.toContain('text=');
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    fireEvent.click(link);
    const text = [
      'Merhaba JobsAdmire, kontrolü yaptım. Cevaplarım:',
      '• Şirket? Evet',
      '• Personel? 5 kişiden az',
      '• İşçi nerede? İkametli',
      '• Borç? Hayır',
      'Sonuç: Planlamayla',
    ].join('\n');
    expect(open).toHaveBeenCalledWith(waLink('905011240340', text), '_blank', 'noopener');
    expect(pushed().at(-1)).toEqual({
      event: 'whatsapp_click',
      page: '/',
      locale: 'tr',
      placement: 'page_cta',
    });
  });

  it('counts a middle click, which reaches the bare chat', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 veya daha fazla', 'Yurt dışında', 'Hayır');
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    fireEvent(
      screen.getByRole('link', { name: props.copy.whatsapp }),
      new MouseEvent('auxclick', { bubbles: true, button: 1 }),
    );
    expect(open).not.toHaveBeenCalled();
    expect(pushed().at(-1)).toMatchObject({ event: 'whatsapp_click', placement: 'page_cta' });
  });

  it('Start again clears every answer and returns to question 1 with focus on it', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 veya daha fazla', 'Yurt dışında', 'Hayır');
    expect(screen.getByRole('heading', { level: 3, name: 'Uygun' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: props.copy.restart }));
    expect(screen.getByText('Şirket?')).toHaveFocus();
    expect(screen.getByTestId('wp-eligibility-step')).toHaveTextContent('1 / 4');
    expect(screen.getByRole('button', { name: 'Evet' }).querySelector('svg')).toBeNull();
  });

  it('links the hire cross-sell to the localized Hire Workers page', async () => {
    renderWithIntl(<EligibilityWizard {...props} />);
    await answer('Evet', '5 veya daha fazla', 'Yurt dışında', 'Hayır');
    expect(screen.getByRole('link', { name: props.copy.seeHiring })).toHaveAttribute(
      'href',
      '/isci-talebi',
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 work-permit/_components
```
Expected: FAIL — `../EligibilityWizard` cannot be resolved.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_components/icons.tsx` (no directive: the server sections and the client island both import it — it holds no hook):

```tsx
import type { ReactNode } from 'react';

/** The design's decorative strokes as SVG, always `aria-hidden`: the text beside an icon is the
 *  label (D20), and a ✓/! is never a text glyph — axe's `color-contrast` scores a glyph as text,
 *  an SVG stroke as a graphic. */
type IconProps = { size?: number; className?: string };

function Svg({
  size,
  className,
  strokeWidth = 2.2,
  children,
}: {
  size: number;
  className?: string;
  strokeWidth?: number;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
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
    <Svg size={size} className={className} strokeWidth={2.6}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function AlertIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
      <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" />
    </Svg>
  );
}

export function InfoIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </Svg>
  );
}

export function ClockIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Svg>
  );
}

export function DocIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </Svg>
  );
}

export function FileIcon({ size = 22, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={1.8}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M8 12h8" />
      <path d="M8 8h4" />
      <path d="M8 16h6" />
    </Svg>
  );
}

export function UsersIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function UserCheckIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M20 8l2 2-4.5 4.5L15 12" />
    </Svg>
  );
}

export function BuildingIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
    </Svg>
  );
}

export function CalculatorIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h4" />
      <path d="M8 18h8" />
    </Svg>
  );
}

export function ShieldIcon({ size = 14, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

export function WrenchIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  );
}

export function GlobeIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function LeafIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </Svg>
  );
}

export function AwardIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 13.9L17 22l-5-3-5 3 1.5-8.1" />
    </Svg>
  );
}

export function PackageIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M16.5 9.4L7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </Svg>
  );
}
```

`src/app/[locale]/(site)/work-permit/_components/EligibilityWizard.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { useContactClick } from '@/analytics/useContactClick';
import { ProgressBar } from '@/design/islands/ProgressBar';
import { Button } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import {
  evaluate,
  isComplete,
  prefillText,
  type PartialAnswers,
  type WizardProps,
} from '../_lib/eligibility';
import { AlertIcon, CheckIcon, ShieldIcon } from './icons';

// R18: "hydrated" is a browser fact, read through useSyncExternalStore — `false` on the server
// and while hydrating, `true` afterwards — so the page e2e can wait for a live island
// (`data-island="ready"`) without a setState in an effect.
const noSubscription = () => () => {};
const inBrowser = () => true;
const onServer = () => false;

const OPTION =
  'flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-4 py-3 text-left text-body font-bold text-ink transition-colors hover:border-blue-safe hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
// 44 px targets (the design's bare text buttons are ≈ 21 px tall — WCAG 2.2 target size, D20).
const QUIET =
  'inline-flex min-h-[44px] items-center justify-center text-body-sm font-bold text-text-tertiary hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * The design's #eligibility card: four single-choice questions, a progress bar, Back / Start
 * again, a verdict with its points, a WhatsApp CTA and the Hire Workers cross-link. Every
 * string arrives resolved as a prop (W9) — nothing here reads `sys.*` (W148). State lives in
 * React only: nothing is stored and nothing reaches the door (the card promises "nothing is
 * stored", wp.045). Two side effects, both allow-listed: `eligibility_check_complete` with
 * the verdict bucket once per completed run (W26/W67 — never an answer), and
 * `whatsapp_click` (`page_cta`) when the result CTA opens the chat, whose prefilled URL is
 * composed on click and never sits in the DOM (W76/W95).
 */
export function EligibilityWizard({ locale, whatsappNumber, questions, copy }: WizardProps) {
  // R35: the real URL pathname (`/calisma-izni`), never next-intl's internal key.
  const page = usePathname() ?? '/';
  const fire = useContactClick('page_cta');
  const ready = useSyncExternalStore(noSubscription, inBrowser, onServer);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [done, setDone] = useState(false);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  // D20: after a pick, Back or Start again, focus follows the content the click replaced —
  // never on the first render.
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (done ? resultRef.current : promptRef.current)?.focus();
  }, [step, done]);

  const total = questions.length;
  const current = questions[step];
  const complete = done && isComplete(answers) ? answers : null;
  const outcome = complete ? evaluate(complete) : null;

  const pick = (optionKey: string) => {
    const next: PartialAnswers = { ...answers, [current.key]: optionKey };
    setAnswers(next);
    moveFocus.current = true;
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    if (!isComplete(next)) return;
    setDone(true);
    track('eligibility_check_complete', { page, locale, result: evaluate(next).verdict });
  };
  const back = () => {
    moveFocus.current = true;
    setStep(step - 1);
  };
  const restart = () => {
    moveFocus.current = true;
    setAnswers({});
    setStep(0);
    setDone(false);
  };
  // W76/W95: the answers ride only in the URL opened here; a ctrl/cmd-click still lands in this
  // handler (the prefilled chat), only a genuine middle click reaches the bare DOM href.
  const openWhatsApp = (e: MouseEvent<HTMLElement>) => {
    fire('whatsapp');
    if (!complete || !outcome) return;
    e.preventDefault();
    const text = prefillText(
      copy.prefillIntro,
      questions,
      complete,
      copy.prefillResult[outcome.verdict],
    );
    window.open(waLink(whatsappNumber, text), '_blank', 'noopener');
  };
  const countMiddleClick = (e: MouseEvent<HTMLElement>) => {
    if (e.button === 1) fire('whatsapp');
  };

  return (
    <div
      id="eligibility"
      data-testid="wp-eligibility"
      data-island={ready ? 'ready' : undefined}
      className="w-full scroll-mt-24 overflow-hidden rounded-lg border border-tint-border bg-white text-ink shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-md lg:scroll-mt-32 xl:scroll-mt-40"
    >
      {/* D20: `blue-safe`, not the design's #1899d5 → #1073a8 gradient (white on #1899d5 is 3.2:1). */}
      <div className="bg-blue-safe px-8 pt-6 pb-5 text-white max-md:px-4 max-md:pt-4 max-md:pb-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          {/* D20: an h2 — the design's h3 sat directly under the page's h1. */}
          <h2 className="m-0 text-card-title text-white">{copy.heading}</h2>
          {done ? null : (
            <span
              data-testid="wp-eligibility-step"
              className="rounded-pill bg-white px-3 py-1 text-eyebrow font-extrabold whitespace-nowrap text-blue-safe"
            >
              {copy.progress[step]}
            </span>
          )}
        </div>
        <p className="m-0 mb-3.5 text-body-sm text-white">{copy.subtitle}</p>
        <ProgressBar value={done ? total : step} max={total} label={copy.progressLabel} tone="green" />
      </div>
      <div className="px-8 py-7 max-md:px-4 max-md:py-5">
        {complete && outcome ? (
          <div data-testid="wp-eligibility-result">
            <div className="mb-3.5 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-pill text-white ${outcome.verdict === 'eligible' ? 'bg-success-text' : 'bg-warning-text'}`}
              >
                {outcome.verdict === 'eligible' ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
              </span>
              <h3
                ref={resultRef}
                tabIndex={-1}
                className="m-0 text-body-lg font-extrabold focus:outline-none"
              >
                {copy.titles[outcome.verdict]}
              </h3>
            </div>
            <ul className="mb-5 flex flex-col gap-2.5">
              {outcome.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-pill bg-blue-safe"
                  />
                  <span>{copy.points[p]}</span>
                </li>
              ))}
            </ul>
            {/* W127: the WhatsApp face is `success` (the design's solid green — white on #16a34a
                is 3.3:1); the href is the bare chat (W76/W95). */}
            <Button
              variant="success"
              size="lg"
              href={`https://wa.me/${whatsappNumber}`}
              external
              className="w-full"
              onClick={openWhatsApp}
              onAuxClick={countMiddleClick}
            >
              {copy.whatsapp}
            </Button>
            <p className="m-0 mt-3 text-center text-body-sm text-text-tertiary">
              {copy.needWorkers}{' '}
              <Link
                href="/hire-workers"
                className="font-extrabold text-blue-safe no-underline hover:underline"
              >
                {copy.seeHiring}
              </Link>
            </p>
            <button type="button" onClick={restart} className={`mt-3 w-full ${QUIET}`}>
              {copy.restart}
            </button>
          </div>
        ) : (
          <>
            <div role="group" aria-labelledby="wp-elig-q">
              <p
                id="wp-elig-q"
                ref={promptRef}
                tabIndex={-1}
                className="m-0 mb-4 text-body-lg leading-snug font-extrabold focus:outline-none"
              >
                {current.question}
              </p>
              <ul className="flex flex-col gap-2.5">
                {current.options.map((o) => (
                  <li key={o.key}>
                    <button type="button" className={OPTION} onClick={() => pick(o.key)}>
                      <span>{o.label}</span>
                      {answers[current.key] === o.key ? (
                        <CheckIcon size={16} className="flex-none text-blue-safe" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {step > 0 ? (
              <button type="button" onClick={back} className={`mt-3.5 ${QUIET}`}>
                {copy.back}
              </button>
            ) : null}
          </>
        )}
      </div>
      <p className="m-0 flex items-center gap-2 border-t border-border-3 bg-pale-2 px-8 py-3.5 text-body-sm text-text-tertiary max-md:px-4">
        <ShieldIcon size={14} className="flex-none text-success-text" />
        <span>{copy.footer}</span>
      </p>
    </div>
  );
}
```

Notes for the implementer:
- `Button`'s `external` branch renders `<a {...rest} href target="_blank" rel="noopener noreferrer">`, so `onClick`/`onAuxClick` reach the anchor (`ButtonProps` extends `HTMLAttributes<HTMLElement>`); `ContactLink` cannot be used here — its props omit `onClick`/`onAuxClick` by design, which is why the result CTA fires `useContactClick('page_cta')` itself (the same contract as the forms kernel's `FallbackPanel` and T1's `WhatsAppComposeLink`).
- `tone="green"` puts the progress fill on the bar's light track (a `blue-safe` fill would vanish into the `blue-safe` head); the pill is white with `blue-safe` text (white on a translucent white pill over `blue-safe` is < 4.5:1).
- The verdict circle is `success-text` / `warning-text` behind a white SVG — never the design's ✓/! text glyph on `#16a34a`/`#d97706` (D20).

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit/_components"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `EligibilityWizard.test.tsx` 7/7 green; `client-imports.test.ts` green (the island's graph has no barrel, no message JSON, no `formatReadMinutes`); `client-messages.test.ts` green (the island calls no `useTranslations`); `class-collisions.test.ts` green over the two new files; `rsc-imports.test.ts` untouched (it guards `src/design/`); ESLint's React-hooks rules clean (refs are read and written in the effect and the handlers only, never during render).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/_components"
git commit -m "feat(work-permit): eligibility wizard island — nothing stored, no door, result bucket only, click-time WhatsApp

SSR'd client island (small, above the fold — W13): stable option keys, focus follows
each step (D20), eligibility_check_complete carries page/locale/result only (W26/W67);
the result CTA's DOM href is the bare chat and the answers ride only in the URL
composed on click, noopener, whatsapp_click page_cta (W76/W95/W127); reads no sys.*
(CLIENT_SYS unchanged, W148); ProgressBar and primitives by path (W134/W147).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the top sections: hero (crumbs, D17 badge, h1, wizard, chips), jump nav, audience router, routes comparison, sample card

Every section is a synchronous server component: it receives `tf` (the page's `makeTf`) and reads `sys.*` through `useTranslations('sys')` (the Breadcrumbs/Header pattern), so it renders under jsdom with the real LOCAL bundle; the page (Cycle 6) does the async work. Every import is by module path; every class string obeys W119/W122/W155 (the static scan walks these files in Step 4, and each test adds the render-side `collisionsInTree` check for compositions the scan cannot evaluate, such as `Section`'s tone + a caller class); `ImageSlot` gets no width/height/aspect/object class (W129); section test ids sit on inner `<div>`s (W113). Colours follow delta 11 (D20).

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/work-permit/_sections/__tests__/top.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { BUNDLES, sysFor, tfFor, tokens } from '../../_lib/__tests__/helpers';
import { JUMP_LINKS } from '../../_lib/tables';
import { buildWizardProps } from '../../_lib/wizard-props';
import { AudienceRouter } from '../AudienceRouter';
import { Hero } from '../Hero';
import { JumpNav } from '../JumpNav';
import { RoutesComparison } from '../RoutesComparison';

const tfTr = tfFor('tr');
const tfEn = tfFor('en');
const BADGE_TR = 'Güncelleme: Ocak 2026 · JobsAdmire izin ekibi tarafından incelendi';
const wizardFor = (locale: Locale) =>
  buildWizardProps({
    locale,
    whatsappNumber: BUNDLES[locale].settings.whatsappNumber,
    quotaRatio: getRateConfig(BUNDLES[locale]).quotaRatio,
    tf: tfFor(locale),
    sys: sysFor(locale),
  });
const renderHero = (locale: Locale, badge: string | null) =>
  renderWithIntl(
    <Hero
      bundle={BUNDLES[locale]}
      locale={locale}
      tf={tfFor(locale)}
      badge={badge}
      wizard={wizardFor(locale)}
    />,
    { locale },
  );

describe('Hero', () => {
  it('one page-h1 holding the only data-lcp-slot; wp-hero is a named, decorative placeholder (D26/W55)', () => {
    const { container } = renderHero('tr', BADGE_TR);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1.textContent).toBe(`${tfTr('wp.023')} ${tfTr('wp.024')}`);
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const slot = container.querySelector('[data-placeholder="wp-hero"]');
    expect(slot).not.toBeNull();
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot).not.toHaveAttribute('data-lcp-slot');
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('carries this page’s own crumbs (W109), the D17 badge, the metric benefit and three chips — no fine chip', () => {
    const { container } = renderHero('tr', BADGE_TR);
    const nav = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(nav).getByRole('link', { name: tfTr('wp.021') })).toHaveAttribute('href', '/');
    expect(within(nav).getByText(tfTr('wp.011'))).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('wp-updated')).toHaveTextContent(BADGE_TR);
    expect(screen.getByText('470+ izin dosyalandı')).toBeInTheDocument(); // wp.030 {placed} (W1)
    expect(screen.getByTestId('wp-chips').querySelectorAll('li')).toHaveLength(3);
    expect(container.textContent).not.toContain(tfTr('wp.052')); // delta 2
    expect(container.textContent).not.toContain(tfTr('wp.022')); // D17
  });

  it('renders no badge once the review is due (heroBadge → null)', () => {
    renderHero('tr', null);
    expect(screen.queryByTestId('wp-updated')).toBeNull();
  });

  it('W10: the ≤ 700 px copy variants and the CTA row are CSS switches on server-rendered markup', () => {
    renderHero('en', null);
    expect(tokens(screen.getByTestId('wp-intro-desk'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('wp-intro-mob'))).toContain('md:hidden');
    const ctas = screen.getByTestId('wp-hero-ctas');
    expect(tokens(ctas)).toContain('max-md:hidden');
    expect(tokens(ctas)).not.toContain('hidden');
    expect(within(ctas).getByRole('link', { name: tfEn('wp.034') })).toHaveAttribute(
      'href',
      '#eligibility',
    );
    const wa = within(ctas).getByRole('link', { name: tfEn('wp.035') });
    expect(wa).toHaveAttribute(
      'href',
      waLink('905011240340', 'Hello JobsAdmire, I have a work permit question.'),
    );
    expect(wa).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('wp-eligibility')).toHaveAttribute('id', 'eligibility');
  });
});

describe('JumpNav', () => {
  it('is a labelled nav of the eight in-page anchors, sticky only from 1101 px under the 79 px header', () => {
    const { container } = renderWithIntl(<JumpNav tf={tfTr} />);
    const nav = screen.getByRole('navigation', { name: tfTr('wp.056') });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(JUMP_LINKS.map((j) => j.hash));
    expect(tokens(nav)).toEqual(
      expect.arrayContaining(['xl:sticky', 'xl:top-[79px]']),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('AudienceRouter', () => {
  it('TR: three localized internal cards and the permit-only WhatsApp door, in design order', () => {
    const { container } = renderWithIntl(<AudienceRouter bundle={BUNDLES.tr} tf={tfTr} />);
    const links = within(screen.getByTestId('wp-router')).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/isci-talebi',
      waLink(
        '905011240340',
        'Merhaba JobsAdmire, kendi işçim var — çalışma iznini siz yürütebilir misiniz?',
      ),
      '/ortak-olun',
      '/maliyet-hesaplayici',
    ]);
    expect(links[1]).toHaveAttribute('target', '_blank');
    // ≤ 700 px the design drops each card's body line (W10)
    expect(tokens(screen.getByText(tfTr('wp.086')))).toContain('max-md:hidden');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('RoutesComparison + SampleCard', () => {
  it('stacks both routes with real captions instead of the design’s tabs (D20/W10)', () => {
    const { container } = renderWithIntl(<RoutesComparison tf={tfEn} />, { locale: 'en' });
    expect(container.querySelector('section#routes')).not.toBeNull();
    const region = screen.getByTestId('wp-routes');
    expect(within(region).queryAllByRole('tab')).toHaveLength(0);
    expect(within(region).getByTestId('wp-routes-permit')).toHaveTextContent(tfEn('wp.102'));
    expect(within(region).getByTestId('wp-routes-exempt')).toHaveTextContent(tfEn('wp.106'));
    const captions = [
      ...within(region).getAllByText(tfEn('wp.099')),
      ...within(region).getAllByText(tfEn('wp.100')),
    ];
    expect(captions).toHaveLength(10);
    for (const caption of captions) {
      expect(tokens(caption)).toContain('lg:sr-only');
      expect(tokens(caption)).not.toContain('hidden');
    }
    // fragments joined as the package splits them (W23): no space before wp.119's comma
    expect(region.textContent).toContain("The employer, on the Ministry's online system");
    expect(region.textContent).toContain(tfEn('wp.138'));
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('shows the sample card as one named picture with the always-on caption; the watermark is no text node', () => {
    const { container } = renderWithIntl(<RoutesComparison tf={tfTr} />);
    const card = screen.getByRole('img', { name: tr.sys.wp.sample.label });
    expect(card).toHaveTextContent(tr.sys.wp.sample.foreignerId);
    expect(card).toHaveTextContent(tfTr('wp.148'));
    const watermark = container.querySelector('[data-watermark]');
    expect(watermark).toHaveAttribute('data-watermark', tfTr('wp.143'));
    expect(watermark?.textContent).toBe('');
    expect(screen.getByText(tfTr('wp.160'))).toBeInTheDocument();
    expect(en.sys.wp.sample.validity).toBe(tr.sys.wp.sample.validity);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 work-permit/_sections
```
Expected: FAIL — `../AudienceRouter`, `../Hero`, `../JumpNav`, `../RoutesComparison` cannot be resolved.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_components/Frags.tsx`:

```tsx
import { Fragment } from 'react';
import { sp } from '../_lib/fragments';
import type { Frag } from '../_lib/tables';

/** A sentence the package itself splits into fragments (W23), joined by `sp()`: `strong`
 *  fragments in bold ink, `muted` ones in the tertiary grey (the design's #94a3b8 asides,
 *  D20-safe on white). */
export function Frags({ parts, tf }: { parts: readonly Frag[]; tf: (id: string) => string }) {
  const texts = parts.map((p) => tf(p.id));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={`${p.id}-${i}`}>
          {i > 0 ? sp(texts[i - 1], texts[i]) : ''}
          {p.strong ? (
            <strong className="font-extrabold text-ink">{texts[i]}</strong>
          ) : p.muted ? (
            <span className="text-text-tertiary">{texts[i]}</span>
          ) : (
            texts[i]
          )}
        </Fragment>
      ))}
    </>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Hero.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button } from '@/design/primitives/Button';
import type { Locale } from '@/i18n/routing';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { EligibilityWizard } from '../_components/EligibilityWizard';
import { CheckIcon, ClockIcon, DocIcon, UsersIcon } from '../_components/icons';
import { HERO_SIZE, HERO_SRC } from '../_lib/assets';
import type { WizardProps } from '../_lib/eligibility';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { HERO_BENEFITS, HERO_CHIPS, type ChipIcon } from '../_lib/tables';

const CHIP: Record<ChipIcon, { Icon: typeof ClockIcon; tone: string }> = {
  clock: { Icon: ClockIcon, tone: 'text-blue-safe' },
  doc: { Icon: DocIcon, tone: 'text-success-text' },
  users: { Icon: UsersIcon, tone: 'text-[#253063]' },
};

/** The navy hero: crumbs + the D17 badge, the h1 (the LCP element while `wp-hero` is a
 *  placeholder, D26), the W10 intro and legal variants, three benefits, the CTA row (hidden
 *  ≤ 700 px as designed — the chrome's mobile bottom bar carries Call/WhatsApp there), the
 *  eligibility wizard as the right column, and the stat chips (delta 2: three, not four). */
export function Hero({
  bundle,
  locale,
  tf,
  badge,
  wizard,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** `heroBadge(rateConfig, locale, sys)` — `null` from `reviewDueAt` on (D17/W150). */
  badge: string | null;
  wizard: WizardProps;
}) {
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const heroIsLcp = HERO_SRC !== null;
  const [h1a, h1b] = [tf('wp.023'), tf('wp.024')];
  const [mobA, mobB] = [tf('wp.026'), tf('wp.027')];
  return (
    <section data-testid="wp-hero" className="relative overflow-hidden bg-navy text-white">
      {/* D26 + W129: the named hero slot. ImageSlot owns its box (full width at 16:9 —
          HERO_SIZE), so the cover crop is this wrapper's job: height-led, at least full width,
          centred, clipped by the section. With a photo (HERO_SRC) the image becomes the LCP
          element (`data-lcp-slot="wp-hero"` + preload); without one it is a decorative named
          placeholder and the h1 carries the slot. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 aspect-[16/9] h-full min-w-full -translate-x-1/2 -translate-y-1/2">
          <ImageSlot
            slot="wp-hero"
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
      <div className="container-site relative py-16 max-md:pt-8 max-md:pb-10">
        <div className="grid items-center gap-10 max-md:gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-x-3.5 gap-y-2">
              {/* W109: this page's own labels — wp.021 (Home), wp.011 (Work Permits) */}
              <Breadcrumbs
                locale={locale}
                tone="dark"
                items={[
                  { name: tf('wp.021'), href: '/' },
                  { name: tf('wp.011'), href: '/work-permit' },
                ]}
              />
              {badge ? (
                <p
                  data-testid="wp-updated"
                  className="m-0 inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-white/10 px-3 py-1 text-eyebrow font-extrabold text-white/85"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-pill bg-success" />
                  {badge}
                </p>
              ) : null}
            </div>
            <h1
              data-testid="page-h1"
              data-lcp-slot={heroIsLcp ? undefined : 'h1'}
              className="m-0 mb-4 text-h1 leading-[1.03] tracking-[-0.03em] max-md:mb-3 max-md:text-[30px] max-md:leading-[1.08]"
            >
              {h1a}
              {sp(h1a, h1b)}
              <span className="text-sky">{h1b}</span>
            </h1>
            {/* W10: the design's ≤ 700 px copy variants — both server-rendered, CSS-switched. */}
            <p className="m-0 mb-5 max-w-[520px] text-body-lg text-white/75 max-md:mb-4">
              <span data-testid="wp-intro-desk" className="max-md:hidden">
                {tf('wp.025')}
              </span>
              <span data-testid="wp-intro-mob" className="md:hidden">
                {mobA}
                {sp(mobA, mobB)}
                <strong className="font-extrabold text-white">{mobB}</strong>.
              </span>
            </p>
            <ul className="mb-5 flex max-w-[540px] flex-col gap-2 max-md:mb-4 max-md:rounded-sm max-md:border max-md:border-white/20 max-md:bg-white/10 max-md:p-3.5">
              {HERO_BENEFITS.map(([strongId, restId]) => {
                const [a, b] = [tf(strongId), tf(restId)];
                return (
                  <li
                    key={strongId}
                    className="flex items-start gap-2.5 text-body text-white/75 max-md:text-body-sm"
                  >
                    <CheckIcon size={15} className="mt-1 flex-none text-success-border" />
                    <span>
                      <strong className="font-extrabold text-white">{a}</strong>
                      {sp(a, b)}
                      {b}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div data-testid="wp-hero-ctas" className="mb-5 flex flex-wrap gap-3 max-md:hidden">
              <Button variant="primary" size="lg" href="#eligibility">
                {tf('wp.034')}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="success"
                size="lg"
                external
                href={waLink(s.whatsappNumber, waPrefill(sys, 'question'))}
              >
                {tf('wp.035')}
              </ContactCta>
            </div>
            <p className="m-0 max-w-[480px] text-body-sm text-muted max-md:text-white/60">
              <span className="max-md:hidden">{tf('wp.036')}</span>
              <span className="md:hidden">{tf('wp.037')}</span>
            </p>
          </div>
          <div className="min-w-0">
            <EligibilityWizard {...wizard} />
          </div>
        </div>
        <ul
          data-testid="wp-chips"
          className="mt-9 grid grid-cols-2 gap-3.5 max-md:mt-5 max-md:gap-2 lg:grid-cols-3"
        >
          {HERO_CHIPS.map((c) => {
            const { Icon, tone } = CHIP[c.icon];
            const [a, b] = [tf(c.strongId), tf(c.restId)];
            return (
              <li
                key={c.strongId}
                className="flex items-center gap-3 rounded-sm border border-tint-border bg-white px-4 py-3 text-body-sm text-text-secondary max-md:gap-2.5 max-md:px-3 max-md:py-2.5"
              >
                <Icon size={18} className={`flex-none ${tone}`} />
                <span>
                  <strong className="font-extrabold text-ink">{a}</strong>
                  {sp(a, b)}
                  {b}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/JumpNav.tsx`:

```tsx
import { JUMP_LINKS } from '../_lib/tables';

const LINK =
  'inline-flex min-h-[44px] items-center rounded-pill px-3.5 text-body-sm font-bold whitespace-nowrap text-text-secondary no-underline hover:bg-tint hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:border max-md:border-border-2 max-md:bg-pale-1';

/** "On this page" — same-page anchors only (they fire nothing, W12). Sticky under the 79 px
 *  header from 1101 px only (delta 15: below 901 px the header is 71 px and between 901 and
 *  1100 px its desktop row may wrap, W11 — no fixed offset is safe there); static below. At
 *  ≤ 700 px the design also hides the visible label (the nav keeps it as its accessible name). */
export function JumpNav({ tf }: { tf: (id: string) => string }) {
  const label = tf('wp.056');
  return (
    <nav
      aria-label={label}
      data-testid="wp-jump"
      className="z-30 border-b border-border-4 bg-white/95 backdrop-blur xl:sticky xl:top-[79px]"
    >
      <div className="container-site">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 [scrollbar-width:none]">
          <span
            aria-hidden="true"
            className="mr-2 text-eyebrow font-extrabold tracking-[0.8px] whitespace-nowrap text-text-tertiary uppercase max-md:hidden"
          >
            {label}
          </span>
          <ul className="flex gap-1.5">
            {JUMP_LINKS.map((j) => (
              <li key={j.hash} className="flex-none">
                <a href={j.hash} className={LINK}>
                  {tf(j.labelId)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/AudienceRouter.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, CalculatorIcon, UserCheckIcon, UsersIcon } from '../_components/icons';
import { waPrefill } from '../_lib/prefill';
import { ROUTER_CARDS, type RouterKey } from '../_lib/tables';

const CARD =
  'block h-full rounded-base border border-border-2 bg-white p-5 no-underline transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:rounded-sm max-md:p-3.5';
// D20: the design's calculator orange (#d97706) is 3.2:1 on white — `warning-text` instead.
const LOOK: Record<RouterKey, { Icon: typeof BuildingIcon; badge: string; cta: string }> = {
  hire: { Icon: BuildingIcon, badge: 'bg-tint text-blue-safe', cta: 'text-blue-safe' },
  permitOnly: {
    Icon: UserCheckIcon,
    badge: 'bg-success-surface text-success-text',
    cta: 'text-success-text',
  },
  partner: { Icon: UsersIcon, badge: 'bg-[#edf1f9] text-[#253063]', cta: 'text-[#253063]' },
  calculator: {
    Icon: CalculatorIcon,
    badge: 'bg-warning-surface text-warning-text',
    cta: 'text-warning-text',
  },
};

/** "Which one are you?" — three internal routes and the permit-only WhatsApp door (the design's
 *  prefilled chat, `page_cta`). Two columns up to 900 px, four from 901 px (delta 15). */
export function AudienceRouter({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const permitOnly = waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'permitOnly'));
  return (
    <Section tone="light" className="border-b border-border-3 pt-14 pb-14 max-md:pt-8 max-md:pb-8">
      <div className="container-site" data-testid="wp-router">
        <h2 className="m-0 mb-2 text-center text-h2 tracking-[-0.02em] max-md:text-left">
          {tf('wp.083')}
        </h2>
        <p className="m-0 mb-7 text-center text-body text-text-tertiary max-md:mb-4 max-md:text-left">
          {tf('wp.084')}
        </p>
        <ul className="grid grid-cols-2 gap-4 max-md:gap-2.5 lg:grid-cols-4">
          {ROUTER_CARDS.map((c) => {
            const look = LOOK[c.key];
            const body = (
              <>
                <span
                  aria-hidden="true"
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xs max-md:mb-2 ${look.badge}`}
                >
                  <look.Icon size={18} />
                </span>
                <span className="mb-1 block text-body font-extrabold text-ink">{tf(c.titleId)}</span>
                <span className="block text-body-sm text-text-tertiary max-md:hidden">
                  {tf(c.bodyId)}
                </span>
                <span className={`mt-2.5 block text-body-sm font-extrabold ${look.cta}`}>
                  {tf(c.ctaId)}
                </span>
              </>
            );
            return (
              <li key={c.key}>
                {c.href === null ? (
                  <ContactLink
                    href={permitOnly}
                    placement="page_cta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CARD}
                  >
                    {body}
                  </ContactLink>
                ) : (
                  <Link
                    href={c.href}
                    // W99: /partner-with-us is T5's page — a viewport prefetch of an unbuilt
                    // route 404s into the console (best-practices 1.00). T5 may drop this.
                    prefetch={c.href === '/partner-with-us' ? false : undefined}
                    className={CARD}
                  >
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/RoutesComparison.tsx`:

```tsx
import { Section } from '@/design/primitives/Section';
import { Frags } from '../_components/Frags';
import { CheckIcon, InfoIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { COMPARE_ROWS } from '../_lib/tables';
import { SampleCard } from './SampleCard';

const HEAD = 'px-7 py-6 text-white max-lg:px-4 max-lg:py-4';
const HEAD_PILL =
  'mt-2 inline-block rounded-pill border border-white/60 px-2.5 py-0.5 text-eyebrow font-extrabold tracking-[0.6px] uppercase';
const CELL =
  'min-w-0 px-7 py-4.5 text-body-sm leading-relaxed text-text-secondary max-lg:px-4 max-lg:py-3';
const CAPTION = 'mb-1 block text-eyebrow font-extrabold tracking-[0.7px] uppercase lg:sr-only';

/** "Two legal routes" (#routes): the design's three-column table from 901 px; below it the two
 *  sides stack under each criterion. D20: the design's ≤ 700 px two-tab switcher hid one route,
 *  so it is not ported; each side carries the real strings `wp.099`/`wp.100` as its caption
 *  (the design's English-only CSS `::before` labels), `sr-only` from 901 px so screen readers
 *  always hear which route a cell belongs to. The sample permit card closes the section. */
export function RoutesComparison({ tf }: { tf: (id: string) => string }) {
  const [important, warning] = [tf('wp.137'), tf('wp.138')];
  return (
    <Section tone="light" id="routes" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-routes">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.097')}
        </h2>
        <p className="mx-auto mb-11 max-w-[620px] text-center text-body-lg text-text-tertiary max-md:mb-5 max-md:text-left">
          {tf('wp.098')}
        </p>
        <div className="mx-auto max-w-[1080px] overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_18px_48px_rgba(22,60,90,0.1)] max-md:rounded-base">
          <div className="grid lg:grid-cols-[1fr_150px_1fr]">
            {/* D20: blue-safe, not the design's #1899d5 → #1073a8 gradient */}
            <div data-testid="wp-routes-permit" className={`${HEAD} bg-blue-safe`}>
              <p className="m-0 mb-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase">
                {tf('wp.101')}
              </p>
              <p className="m-0 text-card-title font-extrabold">{tf('wp.102')}</p>
              <span className={HEAD_PILL}>{tf('wp.103')}</span>
            </div>
            <div aria-hidden="true" className="flex items-center justify-center bg-ink max-lg:hidden">
              <span className="flex h-13 w-13 items-center justify-center rounded-pill bg-white text-body-sm font-extrabold text-ink">
                {tf('wp.104')}
              </span>
            </div>
            <div
              data-testid="wp-routes-exempt"
              className={`${HEAD} bg-gradient-to-br from-[#253063] to-[#16204a] lg:text-right`}
            >
              <p className="m-0 mb-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase">
                {tf('wp.105')}
              </p>
              <p className="m-0 text-card-title font-extrabold">{tf('wp.106')}</p>
              <span className={HEAD_PILL}>{tf('wp.107')}</span>
            </div>
          </div>
          {COMPARE_ROWS.map((row) => (
            <div
              key={row.labelId}
              className="grid border-t border-border-3 lg:grid-cols-[1fr_150px_1fr]"
            >
              {/* DOM order label → permit → exempt reads right for screen readers; from 901 px
                  `order` puts the label in the middle column, as designed. */}
              <p className="m-0 flex items-center bg-pale-2 px-4 py-2 text-eyebrow font-extrabold tracking-[0.8px] text-text-secondary uppercase lg:order-2 lg:justify-center lg:border-x lg:border-border-3 lg:px-2.5 lg:py-0 lg:text-center">
                {tf(row.labelId)}
              </p>
              <div className={`${CELL} lg:order-1`}>
                <span className={`${CAPTION} text-blue-safe`}>{tf('wp.099')}</span>
                <Frags parts={row.permit} tf={tf} />
              </div>
              <div className={`${CELL} lg:order-3 lg:text-right`}>
                <span className={`${CAPTION} text-[#253063]`}>{tf('wp.100')}</span>
                <Frags parts={row.exempt} tf={tf} />
              </div>
            </div>
          ))}
          <div className="grid border-t border-border-3 lg:grid-cols-2">
            <p className="m-0 flex items-center gap-2.5 bg-[#f4fafd] px-7 py-4 text-body-sm font-bold text-blue-safe max-lg:px-4 max-lg:py-3">
              <CheckIcon size={15} className="flex-none" />
              {tf('wp.135')}
            </p>
            <p className="m-0 flex items-center gap-2.5 border-border-3 bg-[#f0f3fa] px-7 py-4 text-body-sm font-bold text-[#253063] max-lg:border-t max-lg:px-4 max-lg:py-3 lg:flex-row-reverse lg:border-l lg:text-right">
              <CheckIcon size={15} className="flex-none" />
              {tf('wp.136')}
            </p>
          </div>
        </div>
        <p className="mx-auto mt-6 mb-0 flex max-w-[1080px] items-start gap-3 rounded-sm border border-warning-border bg-warning-surface px-5.5 py-4 text-body-sm leading-relaxed text-warning-text max-md:mt-3.5 max-md:px-3.5 max-md:py-3">
          <InfoIcon size={18} className="mt-0.5 flex-none" />
          <span>
            <strong className="font-extrabold text-ink">{important}</strong>
            {sp(important, warning)}
            {warning}
          </span>
        </p>
        <SampleCard tf={tf} />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/SampleCard.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { CheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';

const FIELD = 'text-[8px] font-extrabold tracking-[0.5px] text-text-secondary uppercase';
const VALUE = 'text-[12px] font-extrabold break-words text-ink';
const BARS = [2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2] as const;

/** The design's mock ÇALIŞMA İZNİ card (README: a deliberate reproduction with fictional data —
 *  counsel sign-off item, WP-C). One `role="img"` picture named by `sys.wp.sample.label` (its
 *  fields are not a data table, D20); the "ÖRNEK · SAMPLE" watermark is a CSS pseudo-element
 *  painted from `wp.143`'s data attribute — decorative text at 9 % opacity would be an axe
 *  `color-contrast` failure; the caption `wp.160` always shows. ≤ 700 px the fields fold into
 *  two columns beside the photo, as designed. */
export function SampleCard({ tf }: { tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const field = (labelId: string, value: string) => (
    <div className="min-w-0">
      <div className={FIELD}>{tf(labelId)}</div>
      <div className={VALUE}>{value}</div>
    </div>
  );
  const [employer, company] = [tf('wp.157'), tf('wp.158')];
  return (
    <div
      data-testid="wp-sample"
      className="mx-auto mt-14 grid max-w-[1080px] items-center gap-12 max-md:mt-7 max-md:gap-5 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="min-w-0">
        <Eyebrow>{tf('wp.139')}</Eyebrow>
        <h3 className="m-0 mt-3.5 mb-3 text-[26px] leading-[1.2] tracking-[-0.02em] max-md:text-[20px] xl:text-[19.5px]">
          {tf('wp.140')}
        </h3>
        <p className="m-0 mb-4.5 text-body text-text-secondary">{tf('wp.141')}</p>
        <p className="m-0 flex items-start gap-2.5 text-body-sm text-text-secondary">
          <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
          <span>{tf('wp.142')}</span>
        </p>
      </div>
      <figure className="m-0 min-w-0">
        <div className="rounded-lg border border-tint-border bg-white p-6.5 shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-base max-md:p-3">
          <div
            role="img"
            aria-label={sys('wp.sample.label')}
            className="relative flex flex-col overflow-hidden rounded-sm border border-[#b9cfe3] bg-gradient-to-br from-[#eef4fa] via-[#dce9f5] to-[#cfe0f0] px-5.5 py-4.5 max-md:px-3.5 max-md:py-3"
          >
            <span
              aria-hidden="true"
              data-watermark={tf('wp.143')}
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] text-[44px] font-extrabold tracking-[6px] whitespace-nowrap text-[rgba(22,60,90,0.09)] before:content-[attr(data-watermark)] max-md:text-[25px] max-md:tracking-[3px]"
            />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  aria-hidden="true"
                  focusable="false"
                  className="flex-none"
                >
                  <circle cx="15" cy="15" r="14" fill="#E30A17" />
                  <circle cx="13" cy="15" r="6.5" fill="#ffffff" />
                  <circle cx="14.7" cy="15" r="5.3" fill="#E30A17" />
                  <path d="M23.2 15l-4.4 1.4 2.7-3.7v4.6l-2.7-3.7z" fill="#ffffff" />
                </svg>
                <div className="min-w-0 leading-tight">
                  <div className="text-[10px] font-extrabold tracking-[0.6px] text-ink">
                    {tf('wp.144')}
                  </div>
                  <div className="text-[8.5px] font-bold tracking-[0.4px] text-text-secondary">
                    {tf('wp.145')}
                  </div>
                </div>
              </div>
              <div className="flex-none rounded-[6px] border-[1.5px] border-blue-safe px-2.5 py-1 text-[12px] font-extrabold tracking-[1.5px] whitespace-nowrap text-blue-safe">
                {tf('wp.146')}
              </div>
            </div>
            <div className="relative mt-3 grid grid-cols-[62px_1fr] gap-2.5 md:grid-cols-[76px_1fr_1fr] md:gap-3">
              <div className="row-span-2 aspect-[0.8] self-start overflow-hidden rounded-[8px] border border-[#b9cfe3] bg-[#dfe9f2] md:row-span-1">
                <svg
                  viewBox="0 0 80 100"
                  aria-hidden="true"
                  focusable="false"
                  preserveAspectRatio="xMidYMax slice"
                  className="block h-full w-full"
                >
                  <rect width="80" height="100" fill="#dfe9f2" />
                  <path d="M12 100c0-16 12-25 28-25s28 9 28 25z" fill="#3c4a5d" />
                  <path d="M33 72h14v10c0 4-3.5 6-7 6s-7-2-7-6z" fill="#c99e7c" />
                  <ellipse cx="40" cy="46" rx="17" ry="21" fill="#d9af8b" />
                  <path d="M23 42c-1-14 8-22 17-22s18 8 17 22c-2-9-7-12-17-12s-15 3-17 12z" fill="#2e2620" />
                  <ellipse cx="33" cy="47" rx="2" ry="2.4" fill="#2e2620" />
                  <ellipse cx="47" cy="47" rx="2" ry="2.4" fill="#2e2620" />
                  <path d="M29 42.5c2-1.6 6-1.6 8 0" stroke="#2e2620" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  <path d="M43 42.5c2-1.6 6-1.6 8 0" stroke="#2e2620" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  <path d="M40 48v7l-2.5 1.5" stroke="#c08c66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M34.5 61c3 2.2 8 2.2 11 0" stroke="#a06a48" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  <path d="M28 56c1 6 5 12 12 12s11-6 12-12c-1 8-5 16-12 16s-11-8-12-16z" fill="#2e2620" opacity="0.85" />
                  <path d="M30 84h20v16H30z" fill="#ffffff" />
                  <path d="M36 84l4 5 4-5 3 3-7 8-7-8z" fill="#1f4d7a" />
                </svg>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                {field('wp.147', tf('wp.148'))}
                {field('wp.149', tf('wp.150'))}
                {field('wp.151', tf('wp.152'))}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                {field('wp.153', sys('wp.sample.foreignerId'))}
                {field('wp.154', tf('wp.155'))}
                {field('wp.156', sys('wp.sample.validity'))}
              </div>
            </div>
            <div className="relative mt-2.5 flex items-end justify-between gap-3">
              <div className="min-w-0 text-[9.5px] font-bold text-text-secondary">
                {employer}
                {sp(employer, company)}
                <span className="font-extrabold text-ink">{company}</span>
              </div>
              <div className="flex flex-none flex-col items-end gap-0.5">
                <div aria-hidden="true" className="flex gap-[1.5px]">
                  {BARS.map((w, i) => (
                    <span key={i} className="h-3.5 bg-ink" style={{ width: w }} />
                  ))}
                </div>
                <span className="text-[7px] font-bold tracking-[1px] text-text-secondary">
                  {tf('wp.159')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <figcaption className="mt-3 text-center text-body-sm text-text-tertiary">
          {tf('wp.160')}
        </figcaption>
      </figure>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit/_components" "src/app/[locale]/(site)/work-permit/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `top.test.tsx` 8/8 green; `class-collisions.test.ts` green over the new files (every composition was written so that no property is set twice at one variant — `m-0 mb-4`, `py-16 max-md:pt-8`, `Section`'s `py-16` + a caller's `pt-14 pb-14` are shorthand/longhand pairs, which the scan and `collisionsInTree` accept by design); `client-imports.test.ts` green (no barrel, not even type-only); `rsc-imports.test.ts` untouched.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/_components/Frags.tsx" "src/app/[locale]/(site)/work-permit/_sections"
git commit -m "feat(work-permit): hero with the wizard and dated badge, jump nav, audience router, stacked routes comparison, sample card

h1 is the LCP slot while wp-hero is a named placeholder in a cover wrapper (D26/W55/W129);
own crumbs (W109); W10 variants as max-md:/md: classes (W119); the comparison stacks with
wp.099/wp.100 captions instead of tabs (D20); the sample card is one named picture with a
pseudo-element watermark; blue-safe surfaces and D20 greys; by-path imports (W156).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the middle sections: permit types, rules + penalties, Article-48 exemptions, process, timeline pair, costs, documents, renewal

Same contract as Cycle 3 (synchronous server sections, `tf` in, `sys` through `useTranslations('sys')`, by-path imports, W119/W122/W155 class strings, D20 colours). Section backgrounds follow the design: pale (`#f4f9fc` → `Section tone="pale"`) for permit types, exemptions, timeline, documents + renewal (one continuous band); white for rules, process, costs.

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/work-permit/_sections/__tests__/middle.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { waLink } from '@/lib/contact';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { BUNDLES, tfFor, tokens } from '../../_lib/__tests__/helpers';
import { Costs } from '../Costs';
import { Documents } from '../Documents';
import { Exemptions } from '../Exemptions';
import { PermitTypes } from '../PermitTypes';
import { Process } from '../Process';
import { Renewal } from '../Renewal';
import { Rules } from '../Rules';
import { Timeline } from '../Timeline';

const tfTr = tfFor('tr');
const tfEn = tfFor('en');
const waTr = (tail: string) => waLink('905011240340', `Merhaba JobsAdmire, ${tail}`);
const waEn = (tail: string) => waLink('905011240340', `Hello JobsAdmire, ${tail}`);

describe('PermitTypes', () => {
  it('the featured fixed-term card (three bullets), four other types and the ask card’s WhatsApp door', () => {
    const { container } = renderWithIntl(<PermitTypes bundle={BUNDLES.en} tf={tfEn} />, {
      locale: 'en',
    });
    const region = screen.getByTestId('wp-types');
    expect(
      within(region).getByRole('heading', {
        level: 3,
        name: `${tfEn('wp.164')} ${tfEn('wp.165')}`,
      }),
    ).toBeInTheDocument();
    expect(within(screen.getByTestId('wp-types-featured')).getAllByRole('listitem')).toHaveLength(3);
    expect(within(screen.getByTestId('wp-types-other')).getAllByRole('listitem')).toHaveLength(4);
    expect(within(region).getByRole('link', { name: tfEn('wp.186') })).toHaveAttribute(
      'href',
      waEn('which work permit type applies to my case?'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Rules', () => {
  it('#rules: six numbered rules, the four legal-flagged penalty lines verbatim, the W10 intro variants', () => {
    const { container } = renderWithIntl(<Rules tf={tfEn} />, { locale: 'en' });
    expect(container.querySelector('section#rules')).not.toBeNull();
    expect(within(screen.getByTestId('wp-rules-list')).getAllByRole('listitem')).toHaveLength(6);
    expect(
      within(screen.getByTestId('wp-penalties'))
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['wp.196', 'wp.197', 'wp.198', 'wp.199'].map((id) => tfEn(id)));
    const desk = screen.getByTestId('wp-rules-desk');
    expect(tokens(desk)).toContain('max-md:hidden');
    expect(within(desk).getByRole('link', { name: tfEn('wp.190') })).toHaveAttribute(
      'href',
      '/en/hire-workers',
    );
    expect(desk.textContent).toContain(`${tfEn('wp.190')},`); // wp.191 opens with its comma (W23)
    expect(tokens(screen.getByTestId('wp-rules-mob'))).toContain('md:hidden');
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Exemptions', () => {
  it('#muafiyet: five Article-48 cards, the more-categories WhatsApp tile, four facts and the two in-page links', () => {
    const { container } = renderWithIntl(<Exemptions bundle={BUNDLES.tr} tf={tfTr} />);
    expect(container.querySelector('section#muafiyet')).not.toBeNull();
    const region = screen.getByTestId('wp-muafiyet');
    expect(within(region).getAllByRole('article')).toHaveLength(5);
    expect(within(region).getByRole('link', { name: tfTr('wp.215') })).toHaveAttribute(
      'href',
      '#rules',
    );
    expect(within(region).getByRole('link', { name: tfTr('wp.217') })).toHaveAttribute(
      'href',
      '#eligibility',
    );
    expect(within(region).getByRole('link', { name: tfTr('wp.186') })).toHaveAttribute(
      'href',
      waTr('durumum çalışma izni muafiyetine giriyor mu?'),
    );
    expect(region.querySelectorAll('dt')).toHaveLength(4);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Process', () => {
  it('four ordered steps, the last with the SGK day-one badge, and the permit-only banner', () => {
    const { container } = renderWithIntl(<Process bundle={BUNDLES.tr} tf={tfTr} />);
    const region = screen.getByTestId('wp-process');
    const steps = within(region).getAllByRole('listitem');
    expect(steps).toHaveLength(4);
    expect(steps[3]).toHaveTextContent(tfTr('wp.255'));
    expect(within(region).getByRole('link', { name: tfTr('wp.090') })).toHaveAttribute(
      'href',
      waTr('kendi işçim var — çalışma iznini siz yürütebilir misiniz?'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Timeline', () => {
  it('#timeline: both cards at every width — no tabs (D20) — with the metric durations (W1)', () => {
    const { container } = renderWithIntl(<Timeline tf={tfTr} />);
    expect(container.querySelector('section#timeline')).not.toBeNull();
    const abroad = screen.getByTestId('wp-timeline-abroad');
    const here = screen.getByTestId('wp-timeline-here');
    for (const card of [abroad, here]) expect(tokens(card).some((t) => t.endsWith('hidden'))).toBe(false);
    expect(abroad).toHaveTextContent('~6–8 hafta'); // wp.264 {firstDayWeeks}
    expect(here).toHaveTextContent('~4–6 hafta'); // wp.274 {firstDayWeeksInCountry}
    expect(abroad.querySelectorAll('dt')).toHaveLength(4);
    expect(here.querySelectorAll('dt')).toHaveLength(3);
    expect(here).toHaveTextContent(tfTr('wp.280'));
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Costs', () => {
  it('#costs: three cost lines, no amount anywhere, the quote CTA on the service-fee card', () => {
    const { container } = renderWithIntl(<Costs bundle={BUNDLES.en} tf={tfEn} />, {
      locale: 'en',
    });
    expect(container.querySelector('section#costs')).not.toBeNull();
    const region = screen.getByTestId('wp-costs');
    expect(within(region).getAllByRole('article')).toHaveLength(3);
    expect(region.textContent).not.toMatch(/₺|\bTRY\b/);
    expect(within(region).getByRole('link', { name: tfEn('wp.296') })).toHaveAttribute(
      'href',
      waEn('what would a work permit cost for my case?'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Documents', () => {
  it('#documents: two lists of six, each count computed from its list (D17)', () => {
    const { container } = renderWithIntl(<Documents tf={tfTr} />);
    expect(container.querySelector('section#documents')).not.toBeNull();
    for (const key of ['employer', 'worker']) {
      const list = screen.getByTestId(`wp-docs-${key}`);
      expect(within(list).getAllByRole('listitem')).toHaveLength(6);
      expect(list).toHaveTextContent('6 belge');
    }
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('EN pluralises the computed count — never wp.300’s typed "6 docs"', () => {
    renderWithIntl(<Documents tf={tfEn} />, { locale: 'en' });
    const worker = screen.getByTestId('wp-docs-worker');
    expect(worker).toHaveTextContent('6 documents');
    expect(worker.textContent).not.toContain(tfEn('wp.300'));
  });
});

describe('Renewal', () => {
  it('the W10 renewal variants, the ≤ 700 px window line and the renewal WhatsApp door', () => {
    const { container } = renderWithIntl(<Renewal bundle={BUNDLES.en} tf={tfEn} />, {
      locale: 'en',
    });
    const banner = screen.getByTestId('wp-renewal');
    expect(tokens(screen.getByTestId('wp-renewal-desk'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('wp-renewal-mob'))).toContain('md:hidden');
    expect(tokens(screen.getByText(tfEn('wp.326')))).toContain('md:hidden');
    expect(within(banner).getByRole('link', { name: tfEn('wp.327') })).toHaveAttribute(
      'href',
      waEn('I need help renewing a work permit.'),
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 work-permit/_sections
```
Expected: `top.test.tsx` passes; `middle.test.tsx` FAILS — `../Costs`, `../Documents`, `../Exemptions`, `../PermitTypes`, `../Process`, `../Renewal`, `../Rules`, `../Timeline` cannot be resolved.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_sections/PermitTypes.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { Frags } from '../_components/Frags';
import { CheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { FIXED_TERM_BULLETS, OTHER_PERMIT_TYPES } from '../_lib/tables';

/** "Which permit type will your workers get?" — the featured fixed-term card, the special
 *  cases and the ask card (D20: blue-safe, not the design's brand-blue gradient) with its
 *  WhatsApp door. */
export function PermitTypes({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [name, local] = [tf('wp.164'), tf('wp.165')];
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="wp-types">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.161')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-secondary max-md:mb-5 max-md:text-left">
          {tf('wp.162')}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-5 max-md:gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <article
            data-testid="wp-types-featured"
            className="min-w-0 rounded-lg border-[1.5px] border-tint-border bg-white px-8.5 py-8 shadow-[0_12px_32px_rgba(22,60,90,0.08)] max-md:rounded-base max-md:px-4 max-md:py-4"
          >
            <p className="m-0 mb-3.5">
              <span className="inline-block rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold tracking-[1px] text-blue-safe uppercase">
                {tf('wp.163')}
              </span>
            </p>
            <h3 className="m-0 mb-2.5 text-card-title">
              {name}
              {sp(name, local)}
              <span className="text-body font-bold text-text-tertiary">{local}</span>
            </h3>
            <p className="m-0 mb-4.5 text-body text-text-secondary">{tf('wp.166')}</p>
            <ul className="flex flex-col gap-2.5">
              {FIXED_TERM_BULLETS.map((parts) => (
                <li
                  key={parts[0].id}
                  className="flex items-start gap-2.5 text-body-sm text-text-secondary"
                >
                  <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
                  <span>
                    <Frags parts={parts} tf={tf} />
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <div className="flex min-w-0 flex-col gap-5 max-md:gap-3">
            <div
              data-testid="wp-types-other"
              className="rounded-lg border border-border-2 bg-white px-7 py-6.5 max-md:rounded-base max-md:px-4 max-md:py-4"
            >
              <h3 className="m-0 mb-3.5 text-eyebrow font-extrabold tracking-[1px] text-text-tertiary uppercase">
                {tf('wp.175')}
              </h3>
              <ul className="flex flex-col gap-2.5 text-body-sm text-text-secondary">
                {OTHER_PERMIT_TYPES.map(([nameId, restId]) => {
                  const [a, b] = [tf(nameId), tf(restId)];
                  return (
                    <li key={nameId}>
                      <strong className="font-extrabold text-ink">{a}</strong>
                      {sp(a, b)}
                      {b}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-1 flex-col justify-center rounded-lg bg-blue-safe px-7 py-6 text-white max-md:rounded-base max-md:px-4 max-md:py-4">
              <p className="m-0 mb-1.5 text-body font-extrabold">{tf('wp.184')}</p>
              <p className="m-0 mb-3.5 text-body-sm">{tf('wp.185')}</p>
              <ContactCta
                placement="page_cta"
                variant="secondary"
                external
                className="self-start"
                href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'permitType'))}
              >
                {tf('wp.186')}
              </ContactCta>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Rules.tsx`:

```tsx
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { AlertIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { PENALTY_IDS, RULES } from '../_lib/tables';

/** "What the Ministry checks before approving" (#rules): the side column (sticky from 901 px,
 *  as designed) with the W10 intro variants and the legal-flagged penalty box, and the six
 *  numbered rules. Below 901 px the penalty box stays under the intro (delta 13 — visual order
 *  equals DOM order, D20). */
export function Rules({ tf }: { tf: (id: string) => string }) {
  const [intro, link, tail] = [tf('wp.189'), tf('wp.190'), tf('wp.191')];
  const [mobA, mobB, mobC] = [tf('wp.192'), tf('wp.193'), tf('wp.194')];
  return (
    <Section tone="light" id="rules" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-rules">
        <div className="grid items-start gap-16 max-lg:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 lg:sticky lg:top-40">
            <Eyebrow>{tf('wp.187')}</Eyebrow>
            <h2 className="m-0 mt-3.5 mb-3.5 text-h2 leading-[1.05] tracking-[-0.03em]">
              {tf('wp.188')}
            </h2>
            <p className="m-0 mb-6.5 text-body text-text-secondary max-md:mb-4">
              <span data-testid="wp-rules-desk" className="max-md:hidden">
                {intro}
                {sp(intro, link)}
                <Link
                  href="/hire-workers"
                  className="font-extrabold text-blue-safe no-underline hover:underline"
                >
                  {link}
                </Link>
                {sp(link, tail)}
                {tail}
              </span>
              <span data-testid="wp-rules-mob" className="md:hidden">
                {mobA}
                {sp(mobA, mobB)}
                <strong className="font-extrabold text-ink">{mobB}</strong>
                {sp(mobB, mobC)}
                {mobC}
              </span>
            </p>
            <div
              data-testid="wp-penalties"
              className="rounded-base border border-danger-border bg-danger-surface px-6 py-5.5 max-md:px-4 max-md:py-3.5"
            >
              <p className="m-0 mb-3 flex items-center gap-2.5 text-body font-extrabold text-danger">
                <AlertIcon size={18} className="flex-none" />
                {tf('wp.195')}
              </p>
              <ul className="flex flex-col gap-2 text-body-sm text-[#7f1d1d]">
                {PENALTY_IDS.map((id) => (
                  <li key={id}>{tf(id)}</li>
                ))}
              </ul>
            </div>
          </div>
          <ol data-testid="wp-rules-list" className="flex min-w-0 flex-col gap-3.5 max-md:gap-2.5">
            {RULES.map((r, i) => (
              <li
                key={r.titleId}
                className="flex items-start gap-4 rounded-base border border-border-2 bg-white px-6.5 py-5.5 max-md:gap-3 max-md:rounded-sm max-md:px-3.5 max-md:py-3.5"
              >
                {/* D20: blue-safe — white on the design's #1899d5 is 3.2:1 */}
                <span
                  aria-hidden="true"
                  className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-pill bg-blue-safe text-body-sm font-extrabold text-white"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 mb-1 text-body-lg font-extrabold">{tf(r.titleId)}</h3>
                  <p className="m-0 text-body-sm text-text-secondary">{tf(r.bodyId)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Exemptions.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { AwardIcon, GlobeIcon, LeafIcon, PackageIcon, WrenchIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { EXEMPTION_CARDS, EXEMPTION_FACTS, type ExemptionIcon } from '../_lib/tables';

const ICON: Record<ExemptionIcon, typeof WrenchIcon> = {
  wrench: WrenchIcon,
  globe: GlobeIcon,
  leaf: LeafIcon,
  award: AwardIcon,
  package: PackageIcon,
};
const INLINE = 'font-extrabold text-blue-safe no-underline hover:underline';

/** "Who qualifies for the work permit exemption" (#muafiyet): five Article-48 categories, the
 *  more-categories tile with its WhatsApp door, and the four facts. `wp.214`–`218` are one
 *  sentence the package splits around two in-page links (W23). */
export function Exemptions({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [a, b, c, d, e] = ['wp.214', 'wp.215', 'wp.216', 'wp.217', 'wp.218'].map((id) => tf(id));
  return (
    <Section tone="pale" id="muafiyet" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-muafiyet">
        <div className="mx-auto mb-11 max-w-[720px] text-center max-md:mb-5 max-md:text-left">
          <p className="m-0 mb-4 inline-block rounded-pill border border-[#ccd6ea] bg-[#edf1f9] px-4 py-1.5 text-eyebrow font-extrabold tracking-[1.5px] text-[#253063] uppercase">
            {tf('wp.100')}
          </p>
          <h2 className="m-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.03em]">{tf('wp.212')}</h2>
          <p className="m-0 text-body-lg text-text-secondary">{tf('wp.213')}</p>
          <p className="m-0 mt-3 text-body-sm text-text-secondary">
            {a}
            {sp(a, b)}
            <a href="#rules" className={INLINE}>
              {b}
            </a>
            {sp(b, c)}
            {c}
            {sp(c, d)}
            <a href="#eligibility" className={INLINE}>
              {d}
            </a>
            {sp(d, e)}
            {e}
          </p>
        </div>
        <ul className="grid gap-4.5 max-md:gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {EXEMPTION_CARDS.map((card) => {
            const Icon = ICON[card.icon];
            return (
              <li key={card.titleId} className="min-w-0">
                <article className="h-full rounded-md border border-[#ccd6ea] bg-white px-6.5 py-6.5 max-md:rounded-sm max-md:px-3.5 max-md:py-3.5">
                  <div className="mb-3.5 flex items-center justify-between gap-2.5 max-md:mb-2">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-xs bg-[#edf1f9] text-[#253063]"
                    >
                      <Icon size={20} />
                    </span>
                    <span className="rounded-pill border border-[#ccd6ea] bg-[#edf1f9] px-2.5 py-1 text-eyebrow font-extrabold tracking-[0.6px] whitespace-nowrap text-[#253063] uppercase">
                      {tf(card.badgeId)}
                    </span>
                  </div>
                  <h3 className="m-0 mb-1.5 text-body-lg font-extrabold">{tf(card.titleId)}</h3>
                  <p className="m-0 text-body-sm text-text-secondary">{tf(card.bodyId)}</p>
                </article>
              </li>
            );
          })}
          <li className="min-w-0">
            <div className="flex h-full flex-col justify-center rounded-md bg-gradient-to-br from-[#253063] to-[#16204a] px-6.5 py-6.5 text-white max-md:rounded-sm max-md:px-4 max-md:py-4">
              <p className="m-0 mb-1.5 text-body font-extrabold">{tf('wp.232')}</p>
              <p className="m-0 mb-3.5 text-body-sm text-white/90">{tf('wp.233')}</p>
              <ContactCta
                placement="page_cta"
                variant="secondary"
                external
                className="self-start"
                href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'exemption'))}
              >
                {tf('wp.186')}
              </ContactCta>
            </div>
          </li>
        </ul>
        <dl className="mt-4.5 grid rounded-md border border-border-2 bg-white px-7 py-6 max-md:mt-2.5 max-md:px-4 max-md:py-3.5 lg:grid-cols-4">
          {EXEMPTION_FACTS.map((f) => {
            const [strong, rest] = [tf(f.strongId), tf(f.restId)];
            return (
              <div
                key={f.labelId}
                className="border-border-3 py-3 max-lg:border-t max-lg:first:border-t-0 max-lg:first:pt-0 lg:border-r lg:px-6 lg:py-1 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <dt className="mb-1.5 text-eyebrow font-extrabold tracking-[0.8px] text-[#253063] uppercase">
                  {tf(f.labelId)}
                </dt>
                <dd className="m-0 text-body-sm text-text-secondary">
                  <strong className="font-extrabold text-ink">{strong}</strong>
                  {sp(strong, rest)}
                  {rest}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Process.tsx` (page-local grid — accepted by the reconcile, delta 4):

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon, DocIcon, FileIcon, GlobeIcon, UserCheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { PROCESS_STEPS, type StepIcon } from '../_lib/tables';

const STEP_ICON: Record<StepIcon, typeof DocIcon> = {
  doc: DocIcon,
  globe: GlobeIcon,
  file: FileIcon,
  check: CheckIcon,
};

/** "How we get a permit approved": four steps (the last with the "SGK day one" badge) on a
 *  static connector rail from 901 px — the design's IntersectionObserver reveal is not ported
 *  (no island, reduced-motion parity, W13) — and the permit-only banner with its WhatsApp door.
 *  `ProcessSteps` has no badge slot and no horizontal variant, so this grid is page-local. */
export function Process({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const last = PROCESS_STEPS.length - 1;
  const [lead, rest] = [tf('wp.257'), tf('wp.258')];
  return (
    <Section tone="light">
      <div className="container-site" data-testid="wp-process">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.246')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-5 max-md:text-left">
          {tf('wp.247')}
        </p>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute top-[43px] right-10 left-10 h-[3px] rounded-pill bg-gradient-to-r from-blue via-blue-safe to-success max-lg:hidden"
          />
          <ol className="relative grid gap-6 max-md:gap-2.5 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = STEP_ICON[step.icon];
              const isLast = i === last;
              return (
                <li
                  key={step.titleId}
                  className={`min-w-0 rounded-md border bg-white px-6 py-6.5 max-md:px-3.5 max-md:py-3.5 ${isLast ? 'border-success-border' : 'border-border-2'}`}
                >
                  <div className="mb-4 flex items-center justify-between max-md:mb-2">
                    {/* D20: solid blue-safe / success-text dots — white on the design's
                        #1e9ee8 → #1073a8 and #22c55e → #15803d gradients falls below 4.5:1 */}
                    <span
                      aria-hidden="true"
                      className={`flex h-9.5 w-9.5 items-center justify-center rounded-pill text-body-sm font-extrabold text-white ${isLast ? 'bg-success-text' : 'bg-blue-safe'}`}
                    >
                      {i + 1}
                    </span>
                    <Icon size={22} className={isLast ? 'text-success' : 'text-[#8fb6cd]'} />
                  </div>
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-card-title">{tf(step.titleId)}</h3>
                    {step.badgeId ? (
                      <span className="rounded-pill border border-success-border bg-success-surface px-2.5 py-0.5 text-eyebrow font-extrabold tracking-[0.8px] text-success-text uppercase">
                        {tf(step.badgeId)}
                      </span>
                    ) : null}
                  </div>
                  <p className="m-0 text-body-sm text-text-secondary">{tf(step.bodyId)}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1080px] flex-wrap items-center justify-between gap-5 rounded-base border border-success-border bg-success-surface px-7 py-5.5 max-md:mt-5 max-md:flex-col max-md:items-stretch max-md:gap-3 max-md:px-4 max-md:py-4">
          <p className="m-0 flex min-w-0 flex-1 items-start gap-3.5 text-body text-[#14532d]">
            <UserCheckIcon size={20} className="mt-0.5 flex-none text-success-text" />
            <span>
              <strong className="font-extrabold text-ink">{lead}</strong>
              {sp(lead, rest)}
              {rest}
            </span>
          </p>
          <ContactCta
            placement="page_cta"
            variant="success"
            external
            href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'permitOnly'))}
          >
            {tf('wp.090')}
          </ContactCta>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Timeline.tsx`:

```tsx
import { Section } from '@/design/primitives/Section';
import { TIMELINE_CARDS, type TimelineCard } from '../_lib/tables';

const TONE: Record<TimelineCard['key'], { card: string; pill: string }> = {
  abroad: { card: 'border border-border-2', pill: 'border-tint-border bg-tint text-blue-safe' },
  here: {
    card: 'border-[1.5px] border-success-border',
    pill: 'border-success-border bg-success-surface text-success-text',
  },
};

/** "How long will your case take?" (#timeline): the abroad and in-Türkiye cards side by side
 *  from 901 px and stacked below — D20: the design's ≤ 700 px tab switcher (`wp.261`/`262`) hid
 *  one card, so it is not ported. The durations are the metrics (`wp.264`/`wp.274`, W1). */
export function Timeline({ tf }: { tf: (id: string) => string }) {
  return (
    <Section tone="pale" id="timeline" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-timeline">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.259')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-secondary max-md:mb-5 max-md:text-left">
          {tf('wp.260')}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-6 max-md:gap-3.5 lg:grid-cols-2">
          {TIMELINE_CARDS.map((card) => {
            const tone = TONE[card.key];
            const lastRow = card.rows.length - 1;
            return (
              <article
                key={card.key}
                data-testid={`wp-timeline-${card.key}`}
                className={`min-w-0 rounded-lg bg-white px-8 py-7.5 max-md:rounded-base max-md:px-4 max-md:py-4 ${tone.card}`}
              >
                <div className="mb-5 flex items-center justify-between gap-3 max-md:mb-3">
                  <h3 className="m-0 text-card-title">{tf(card.titleId)}</h3>
                  <span
                    className={`rounded-pill border px-3.5 py-1 text-body-sm font-extrabold whitespace-nowrap ${tone.pill}`}
                  >
                    {tf(card.durationId)}
                  </span>
                </div>
                <dl className="border-b border-border-4">
                  {card.rows.map(([whenId, whatId], i) => (
                    <div
                      key={`${whenId}-${whatId}`}
                      className="flex gap-3.5 border-t border-border-4 py-3 max-md:gap-3 max-md:py-2.5"
                    >
                      <dt
                        className={`min-w-[86px] flex-none text-body-sm font-extrabold max-md:min-w-[66px] ${card.key === 'here' || i === lastRow ? 'text-success-text' : 'text-blue-safe'}`}
                      >
                        {tf(whenId)}
                      </dt>
                      <dd className="m-0 min-w-0 text-body-sm text-text-secondary">{tf(whatId)}</dd>
                    </div>
                  ))}
                </dl>
                {card.noteId ? (
                  <p className="m-0 mt-4 text-body-sm text-text-tertiary">{tf(card.noteId)}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Costs.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { Frags } from '../_components/Frags';
import { waPrefill } from '../_lib/prefill';
import { COST_CARDS } from '../_lib/tables';

/** "What a work permit costs" (#costs): three cost lines and, by design, no amounts — the state
 *  fees change every January and the service fee is quoted in writing (`wp.282`/`wp.295`), so
 *  there is nothing here for D17 to render. */
export function Costs({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="costs" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-costs">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.281')}
        </h2>
        <p className="mx-auto mb-11 max-w-[600px] text-center text-body-lg text-text-tertiary max-md:mb-5 max-md:text-left">
          {tf('wp.282')}
        </p>
        <ul className="mx-auto grid max-w-[1080px] gap-5 max-md:gap-3 lg:grid-cols-3">
          {COST_CARDS.map((c) => (
            <li key={c.titleId} className="min-w-0">
              <article
                className={`flex h-full flex-col rounded-md bg-white px-6 py-6.5 max-md:px-4 max-md:py-4 ${c.ours ? 'border-[1.5px] border-tint-border shadow-[0_10px_26px_rgba(22,60,90,0.07)]' : 'border border-border-2'}`}
              >
                <p
                  className={`m-0 mb-2.5 text-eyebrow font-extrabold tracking-[1.2px] uppercase ${c.ours ? 'text-success-text' : 'text-blue-safe'}`}
                >
                  {tf(c.eyebrowId)}
                </p>
                <h3 className="m-0 mb-1.5 text-card-title">{tf(c.titleId)}</h3>
                <p className="m-0 text-body-sm text-text-secondary">
                  <Frags parts={c.body} tf={tf} />
                </p>
                {c.ours ? (
                  <ContactCta
                    placement="page_cta"
                    variant="success"
                    external
                    className="mt-4 self-start"
                    href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'quote'))}
                  >
                    {tf('wp.296')}
                  </ContactCta>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Documents.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Section } from '@/design/primitives/Section';
import { BuildingIcon, CheckIcon, UsersIcon } from '../_components/icons';
import { DOC_LISTS, type DocList } from '../_lib/tables';

const LOOK: Record<DocList['key'], { Icon: typeof BuildingIcon; badge: string; count: string }> = {
  employer: {
    Icon: BuildingIcon,
    badge: 'bg-tint text-blue-safe',
    count: 'border-tint-border bg-tint text-blue-safe',
  },
  worker: {
    Icon: UsersIcon,
    badge: 'bg-success-surface text-success-text',
    count: 'border-success-border bg-success-surface text-success-text',
  },
};

/** "Documents you'll need" (#documents): the employer and worker checklists; each count badge is
 *  computed from its list (`sys.wp.documents.count`, ICU) — never `wp.300`'s typed "6 docs"
 *  (D17). The renewal banner continues this pale band. */
export function Documents({ tf }: { tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  return (
    <Section tone="pale" id="documents" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-documents">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.297')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-secondary max-md:mb-5 max-md:text-left">
          {tf('wp.298')}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-6 max-md:gap-2.5 lg:grid-cols-2">
          {DOC_LISTS.map((list) => {
            const look = LOOK[list.key];
            return (
              <article
                key={list.key}
                data-testid={`wp-docs-${list.key}`}
                className="min-w-0 rounded-lg border border-border-2 bg-white px-8 py-7.5 max-md:rounded-base max-md:px-4 max-md:py-3.5"
              >
                <div className="mb-4.5 flex items-center gap-3 max-md:mb-3 max-md:border-b max-md:border-border-3 max-md:pb-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-10.5 w-10.5 flex-none items-center justify-center rounded-xs ${look.badge}`}
                  >
                    <look.Icon size={20} />
                  </span>
                  <h3 className="m-0 text-card-title">{tf(list.titleId)}</h3>
                  <span
                    className={`ml-auto rounded-pill border px-2.5 py-1 text-eyebrow font-extrabold whitespace-nowrap ${look.count}`}
                  >
                    {sys('wp.documents.count', { n: list.items.length })}
                  </span>
                </div>
                <ul className="flex flex-col gap-2.5 text-body-sm text-text-secondary">
                  {list.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <CheckIcon size={15} className="mt-0.5 flex-none text-success" />
                      <span>
                        {tf(item.id)}
                        {item.noteId ? (
                          <>
                            {' '}
                            <span className="text-text-tertiary">{tf(item.noteId)}</span>
                          </>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-6 mb-0 max-w-[560px] text-center text-body-sm text-text-secondary max-md:mt-3.5 max-md:text-left">
          {tf('wp.318')}
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/Renewal.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';

/** The renewal banner — it continues the documents' pale band (no top padding), as designed.
 *  D20: a blue-safe surface and outline-only pills (a translucent white pill on blue drops white
 *  text below 4.5:1). W10: the desktop/mobile sentences switch by CSS; the design's ≤ 700 px
 *  "60 / days" numeral has no id (`wp.325` unread, delta 5), so `wp.326` is the ≤ 700 px line. */
export function Renewal({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [a, b, c] = [tf('wp.321'), tf('wp.322'), tf('wp.323')];
  return (
    <Section tone="pale" className="pt-0 max-md:pb-10">
      <div className="container-site">
        <div
          data-testid="wp-renewal"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-8 rounded-hero bg-blue-safe px-12 py-11 text-white shadow-[0_24px_56px_rgba(16,115,168,0.28)] max-md:flex-col max-md:items-stretch max-md:gap-3.5 max-md:rounded-md max-md:px-4.5 max-md:py-5.5"
        >
          <div className="min-w-0 flex-1">
            <p className="m-0 mb-3.5 inline-flex items-center rounded-pill border border-white/50 px-3.5 py-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase max-md:mb-2.5">
              {tf('wp.319')}
            </p>
            <h2 className="m-0 mb-2.5 text-[26px] leading-[1.2] tracking-[-0.01em] text-white max-md:text-[21px] xl:text-[19.5px]">
              {tf('wp.320')}
            </h2>
            <p className="m-0 text-body text-white">
              <span data-testid="wp-renewal-desk" className="max-md:hidden">
                {a}
                {sp(a, b)}
                <strong className="font-extrabold">{b}</strong>
                {sp(b, c)}
                {c}
              </span>
              <span data-testid="wp-renewal-mob" className="md:hidden">
                {tf('wp.324')}
              </span>
            </p>
            <p className="m-0 mt-3 rounded-xs border border-white/40 px-3 py-2.5 text-body-sm font-bold md:hidden">
              {tf('wp.326')}
            </p>
          </div>
          <ContactCta
            placement="page_cta"
            variant="secondary"
            size="lg"
            external
            href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'renewal'))}
          >
            {tf('wp.327')}
          </ContactCta>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `middle.test.tsx` 9/9 green (and `top.test.tsx` still 8/8); `class-collisions.test.ts` green over the eight new files; `client-imports.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/_sections"
git commit -m "feat(work-permit): permit types, rules and penalties, Article-48 exemptions, process, timeline pair, costs, documents, renewal

Every section renders from the _lib id tables through makeTf; the timeline pair stacks
instead of hiding a card behind a tab (D20); durations are the metrics (W1); document
counts are computed (D17); W10 variants as max-md:/md: classes (W119); blue-safe and
success-text surfaces for white text (D20); WhatsApp doors tracked as page_cta (W12/W127).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — the bottom sections: FAQ (W83 ask card), related articles (hidden below the blog threshold, W4), the `#permit-cta` closing band

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/work-permit/_sections/__tests__/bottom.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { waLink } from '@/lib/contact';
import en from '@/messages/en.json';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import type { Bundle } from '../../../../../../../contract/website-bundle.v1';
import { BUNDLES, tfFor, tokens } from '../../_lib/__tests__/helpers';
import { Faq } from '../Faq';
import { PermitCta } from '../PermitCta';
import { RelatedArticles, RELATED_LIMIT } from '../RelatedArticles';

const tfTr = tfFor('tr');
const tfEn = tfFor('en');
const PERMIT_ONLY_TR = waLink(
  '905011240340',
  'Merhaba JobsAdmire, kendi işçim var — çalışma iznini siz yürütebilir misiniz?',
);

type Node = Record<string, unknown> & { '@type'?: string };

describe('Faq', () => {
  it('#faq: nine pairs, the first open, one FAQPage node whose fourth answer is the sys copy, and the W83 ask card', () => {
    const { container } = renderWithIntl(<Faq bundle={BUNDLES.en} locale="en" tf={tfEn} />, {
      locale: 'en',
    });
    expect(container.querySelector('section#faq')).not.toBeNull();
    expect(container.querySelectorAll('[id="faq"]')).toHaveLength(1); // FaqBlock's own root is #faq-list
    const region = screen.getByTestId('wp-faq');
    expect(within(region).getAllByRole('button', { expanded: true })).toHaveLength(1);
    expect(within(region).getAllByRole('button', { expanded: false })).toHaveLength(8);
    const nodes = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
      (s) => JSON.parse(s.textContent ?? '{}') as Node,
    );
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage') as unknown as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    }[];
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(9);
    expect(faq[0].mainEntity[3].name).toBe(tfEn('wp.340'));
    expect(faq[0].mainEntity[3].acceptedAnswer.text).toBe(en.sys.wp.faq.exemptionAnswer);
    expect(within(region).getByRole('link', { name: tfEn('wp.332') })).toHaveAttribute(
      'href',
      waLink('905011240340', 'Hello JobsAdmire, I have a work permit question.'),
    );
    expect(within(region).getByRole('link', { name: tfEn('wp.333') })).toHaveAttribute(
      'href',
      `mailto:info@jobsadmire.com?subject=${encodeURIComponent('Work permit question')}`,
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('RelatedArticles (W4)', () => {
  it('renders nothing below the blog threshold — the real bundle has 0 Turkish bodies', () => {
    const { container } = renderWithIntl(
      <RelatedArticles bundle={BUNDLES.tr} locale="tr" tf={tfTr} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('once the threshold is met, shows up to three work-permit posts with a body in this locale', () => {
    const posts = getCollection(BUNDLES.tr, 'blog').map((p, i) => ({
      ...p,
      slug: { ...p.slug, tr: p.slug.tr ?? `yazi-${i}` },
      title: { ...p.title, tr: p.title.tr ?? `Yazı ${i}` },
      hasBody: { ...p.hasBody, tr: true },
      body: { ...p.body, tr: '# Başlık' },
    }));
    const bundle: Bundle = {
      ...BUNDLES.tr,
      collections: { ...BUNDLES.tr.collections, blog: posts },
    };
    const { container } = renderWithIntl(<RelatedArticles bundle={bundle} locale="tr" tf={tfTr} />);
    const region = screen.getByTestId('wp-related');
    const cards = within(region).getAllByRole('article');
    expect(cards).toHaveLength(RELATED_LIMIT);
    const expected = posts.filter((p) => p.category === 'workPermits').slice(0, RELATED_LIMIT);
    expect(cards.map((c) => within(c).getByRole('link').getAttribute('href'))).toEqual(
      expected.map((p) => `/blog/${p.slug.tr}`),
    );
    expect(within(region).getByRole('link', { name: tfTr('wp.352') })).toHaveAttribute(
      'href',
      '/blog',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('PermitCta', () => {
  it('renders #permit-cta — the header CTA’s target (W152/W158) — with the W10 CTA sets and the licence line', () => {
    const { container } = renderWithIntl(<PermitCta bundle={BUNDLES.tr} tf={tfTr} />);
    const band = container.querySelector<HTMLElement>('section#permit-cta');
    expect(band).not.toBeNull();
    expect(tokens(screen.getByTestId('wp-cta-desk'))).toContain('max-md:hidden');
    expect(tokens(screen.getByTestId('wp-cta-mob'))).toContain('md:hidden');
    const buttons = screen.getByTestId('wp-cta-buttons');
    expect(tokens(buttons)).toContain('max-md:hidden');
    expect(
      within(buttons)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['/isci-talebi', PERMIT_ONLY_TR, 'tel:+905011240340']);
    const routes = screen.getByTestId('wp-cta-routes');
    expect(tokens(routes)).toContain('md:hidden');
    expect(
      within(routes)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['/isci-talebi', PERMIT_ONLY_TR]);
    expect(band).toHaveTextContent(tfTr('wp.395'));
    expect(within(band!).getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 work-permit/_sections
```
Expected: `top` and `middle` pass; `bottom.test.tsx` FAILS — `../Faq`, `../PermitCta`, `../RelatedArticles` cannot be resolved.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_sections/Faq.tsx` (the section carries `#faq` + the scroll margin; `FaqBlock`'s own root id becomes `faq-list`, so the page has one `#faq` — T2's pattern):

```tsx
import { useTranslations } from 'next-intl';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { waPrefill } from '../_lib/prefill';
import { FAQ_PAIRS } from '../_lib/tables';

/** "Work permit questions" (#faq): nine pairs, the first open, one open at a time (as designed),
 *  one FAQPage node (AEO only). The fourth answer is `sys.wp.faq.exemptionAnswer` — `wp.340`
 *  has no answer id (delta 6, WP-C). The ask card is the design's WhatsApp + e-mail pair (W83 —
 *  no call row); it shows at every width (delta 14). */
export function Faq({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const items: FaqItem[] = FAQ_PAIRS.map((p) => ({
    id: p.id,
    q: tf(p.qId),
    a: p.aId ? tf(p.aId) : sys('wp.faq.exemptionAnswer'),
  }));
  return (
    <Section tone="pale" id="faq" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          id="faq-list"
          items={items}
          eyebrowId="wp.064"
          headingId="wp.328"
          bodyId="wp.329"
          askCard={{
            titleId: 'wp.330',
            bodyId: 'wp.331',
            whatsappNumber: s.whatsappNumber,
            whatsappText: waPrefill(sys, 'question'),
            whatsappLabelId: 'wp.332',
            email: s.email,
            emailLabelId: 'wp.333',
            subject: sys('wp.faq.emailSubject'),
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

`src/app/[locale]/(site)/work-permit/_sections/RelatedArticles.tsx`:

```tsx
import { blogNavVisible, getCollection } from '@/content/collections';
import { PostCard } from '@/design/blocks/PostCard';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The design's three "Keep reading" cards. */
export const RELATED_LIMIT = 3;

/** "Keep reading on the blog" — rendered by data (W4): nothing while `/blog` is below
 *  `BLOG_NAV_THRESHOLD` Turkish bodies (it is noindex and out of every nav, so a block linking
 *  there would advertise a dead end), nothing when no work-permit article has a body in this
 *  locale; otherwise up to three `PostCard`s. The design's static cards (`wp.353`–`358`, all
 *  pointing at the index) are not used (delta 9). */
export function RelatedArticles({
  bundle,
  locale,
  tf,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
}) {
  if (!blogNavVisible(bundle)) return null;
  const posts = getCollection(bundle, 'blog')
    .filter((p) => p.category === 'workPermits' && p.hasBody[locale])
    .slice(0, RELATED_LIMIT);
  if (posts.length === 0) return null;
  return (
    <Section tone="light">
      <div className="container-site" data-testid="wp-related">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="m-0 text-h2 tracking-[-0.02em]">{tf('wp.351')}</h2>
          <Link
            href="/blog"
            className="text-body-sm font-extrabold whitespace-nowrap text-blue-safe no-underline hover:underline"
          >
            {tf('wp.352')}
          </Link>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.key} className="min-w-0">
              <PostCard bundle={bundle} locale={locale} post={post} headingLevel={3} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/work-permit/_sections/PermitCta.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Button } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { BuildingIcon, UserCheckIcon } from '../_components/icons';
import { waPrefill } from '../_lib/prefill';

const ROUTE =
  'grid grid-cols-[38px_1fr_20px] items-center gap-x-3 rounded-sm px-3.5 py-3.5 text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** The closing band (#permit-cta). The header's "Apply for a permit" CTA (`CTA_BY_PATHNAME`)
 *  and the sticky bar's `hideNearId` both point here, so this id must exist (W17/W152/W158).
 *  Page-local (delta 8): the design's light, centred band — `ClosingCtaBand` is a dark card
 *  whose body cannot switch at ≤ 700 px. W10: the paragraph and the CTA set switch by CSS — two
 *  route cards ≤ 700 px, three buttons from 701 px — both server-rendered. */
export function PermitCta({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const s = bundle.settings;
  const permitOnly = waLink(s.whatsappNumber, waPrefill(sys, 'permitOnly'));
  return (
    <section
      id="permit-cta"
      data-testid="wp-cta"
      className="scroll-mt-24 border-t border-tint-border bg-gradient-to-b from-pale-1 to-tint py-16 max-md:py-10 lg:scroll-mt-32 xl:scroll-mt-40"
    >
      <div className="container-site">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="m-0 mb-3.5 text-h2 leading-[1.05] tracking-[-0.03em]">{tf('wp.359')}</h2>
          <p className="mx-auto mb-7 max-w-[620px] text-body-lg text-text-secondary max-md:mb-4">
            <span data-testid="wp-cta-desk" className="max-md:hidden">
              {tf('wp.360')}
            </span>
            <span data-testid="wp-cta-mob" className="md:hidden">
              {tf('wp.361')} <strong className="font-extrabold text-ink">{tf('wp.362')}</strong>
            </span>
          </p>
          <ul data-testid="wp-cta-routes" className="mb-4 flex flex-col gap-2.5 text-left md:hidden">
            <li>
              <Link href="/hire-workers" className={`${ROUTE} bg-blue-safe text-white`}>
                <span
                  aria-hidden="true"
                  className="row-span-2 flex h-9.5 w-9.5 items-center justify-center rounded-xs bg-white/20"
                >
                  <BuildingIcon size={18} />
                </span>
                <span className="text-body font-extrabold">{tf('wp.363')}</span>
                <span aria-hidden="true" className="row-span-2 text-right text-body-lg font-extrabold">
                  →
                </span>
                <span className="col-start-2 text-body-sm">{tf('wp.364')}</span>
              </Link>
            </li>
            <li>
              <ContactLink
                href={permitOnly}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className={`${ROUTE} border-[1.5px] border-success-border bg-white text-ink`}
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 flex h-9.5 w-9.5 items-center justify-center rounded-xs bg-success-surface text-success-text"
                >
                  <UserCheckIcon size={18} />
                </span>
                <span className="text-body font-extrabold">{tf('wp.365')}</span>
                <span
                  aria-hidden="true"
                  className="row-span-2 text-right text-body-lg font-extrabold text-success-text"
                >
                  →
                </span>
                <span className="col-start-2 text-body-sm text-text-secondary">{tf('wp.089')}</span>
              </ContactLink>
            </li>
          </ul>
          <div
            data-testid="wp-cta-buttons"
            className="flex flex-wrap justify-center gap-3.5 max-md:hidden"
          >
            <Button variant="primary" size="lg" href="/hire-workers">
              {tf('wp.366')}
            </Button>
            <ContactCta placement="page_cta" variant="success" size="lg" external href={permitOnly}>
              {tf('wp.367')}
            </ContactCta>
            <ContactCta placement="page_cta" variant="secondary" size="lg" href={telLink(s.phone)}>
              {s.phoneDisplay}
            </ContactCta>
          </div>
          <p className="m-0 mt-6.5 text-body-sm text-text-secondary max-md:mt-4">
            {tf('wp.395')}{' '}
            <ContactLink
              href={mailLink(s.email)}
              placement="page_cta"
              className="font-bold text-blue-safe no-underline hover:underline"
            >
              {s.email}
            </ContactLink>
          </p>
        </div>
      </div>
    </section>
  );
}
```

Notes for the implementer:
- `ContactLink` is the client anchor every contact link goes through; rendering it from a server section with plain-string props is how the chrome uses it (it fires `whatsapp_click`/`email_click` with `page_cta`). Its props omit `onClick`, which these static links never need.
- Colours on the band's `pale-1 → tint` gradient: body copy is `text-text-secondary` (≈ 5.6:1 on `tint`; the tertiary grey would be ≈ 4.3:1) and the e-mail link `text-blue-safe` (≈ 4.7:1) — D20.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit/_sections"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: `bottom.test.tsx` 4/4 green (with `top` 8/8 and `middle` 9/9); `class-collisions.test.ts` and `client-imports.test.ts` green over the three new files.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/_sections"
git commit -m "feat(work-permit): FAQ with the W83 ask card, related articles hidden below the blog threshold, the #permit-cta band

One FaqBlock (nine pairs, the e-Muafiyet answer from sys, one FAQPage node) under a
#faq section; RelatedArticles renders by data and returns null while blogNavVisible is
false (W4); the light closing band renders id=permit-cta for the header CTA and the
sticky bar (W17/W152/W158) with its W10 CTA sets; every contact link tracked (W12).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — the page, the route registration (W20/W21), the page e2e contract, the SEO/analytics/PRD docs

The page file, the `UNBUILT_PATHNAMES` deletion and the two gate rows land in ONE commit: `unbuilt.test.ts` fails the moment a `page.tsx` exists for a key the set still lists (and the other way round).

- [ ] **Step 1: Write the failing test**

`e2e/pages/work-permit.spec.ts` (runs under both Playwright projects inside the Cycle 7 gate; it needs no door and no `OPS_API_URL` — the page has no form, so it is identical on every face, W92):

```ts
import { test, expect, type Page } from '@playwright/test';

const ROUTES = { tr: '/calisma-izni', en: '/en/work-permit' } as const;
/** `bundle.settings.whatsappNumber` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';
type Pushed = Record<string, unknown>[];

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}
const typesOf = (n: JsonLdNode) => ([] as string[]).concat(n['@type'] ?? []);

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only data-lcp-slot, the named wp-hero placeholder, no leaked ids or tokens (D26/W55/W1)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).not.toBeEmpty();
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // §10 row 4: no photo for this page
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder="wp-hero"]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder=""]')).toHaveCount(0);
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\{[a-zA-Z]+\}/);
    expect(body).not.toContain('undefined');
    expect(body).not.toMatch(/\bwp\.\d{3}\b/); // a package id leaking as text
    expect(body).toContain('470+'); // wp.030 {placed} (W1) — static text, no Stat count-up on this page (W178)
  });

  test(`${locale}: the designed sections in order, each anchor once, the header CTA's #permit-cta (W17/W152/W158)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'wp-hero',
      'wp-jump',
      'wp-router',
      'wp-routes',
      'wp-types',
      'wp-rules',
      'wp-muafiyet',
      'wp-process',
      'wp-timeline',
      'wp-costs',
      'wp-documents',
      'wp-renewal',
      'wp-faq',
      'wp-cta',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el).toHaveCount(1);
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    for (const anchor of [
      'eligibility',
      'routes',
      'rules',
      'muafiyet',
      'timeline',
      'costs',
      'documents',
      'faq',
      'permit-cta',
    ])
      await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
    const cta = page.getByRole('banner').getByRole('link', { name: /^(Başvurun|Apply)/ });
    await expect(cta).toHaveAttribute('href', `${ROUTES[locale]}#permit-cta`);
  });

  test(`${locale}: the wizard stores nothing, pushes one eligibility_check_complete (result only) and opens WhatsApp with a click-time prefill (W26/W67/W76/W95)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const card = page.getByTestId('wp-eligibility');
    await expect(card).toHaveAttribute('data-island', 'ready'); // hydrated — clicks now land
    const storage = await page.evaluate(() => [localStorage.length, sessionStorage.length]);
    const apiCalls: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).pathname.startsWith('/api/')) apiCalls.push(r.url());
    });
    // always the first option: a company, 5 or more, abroad, no debts → "eligible"
    for (let i = 0; i < 4; i++) await card.getByRole('group').getByRole('button').first().click();
    const result = page.getByTestId('wp-eligibility-result');
    await expect(result).toBeVisible();
    const events = await page.evaluate(() =>
      ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []).filter(
        (e) => e.event === 'eligibility_check_complete',
      ),
    );
    expect(events).toEqual([
      { event: 'eligibility_check_complete', page: ROUTES[locale], locale, result: 'eligible' },
    ]);
    const link = result.getByRole('link', { name: /WhatsApp/ });
    await expect(link).toHaveAttribute('href', WA); // W76/W95: the DOM href is the bare chat
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
    const text = decodeURIComponent(opened[0].split('?text=')[1]);
    expect(text).toMatch(
      locale === 'tr'
        ? /^Merhaba JobsAdmire, sitenizdeki uygunluk kontrolünü yaptım/
        : /^Hello JobsAdmire, I did the eligibility check/,
    );
    expect(text.split('\n')).toHaveLength(6); // intro, four answers, the verdict
    const pushed = await page.evaluate(
      () => (window as unknown as { dataLayer?: Pushed }).dataLayer ?? [],
    );
    expect(pushed.some((e) => e.event === 'whatsapp_click' && e.placement === 'page_cta')).toBe(true);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual(storage);
    expect(apiCalls).toEqual([]); // no door, no beacon — "nothing is stored" (wp.045)
    await result.getByRole('button').click(); // Start again
    await expect(card.getByRole('group')).toBeVisible();
  });

  test(`${locale}: both routes and both timeline cards show at every width — no tab switchers (D20/W10)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    await expect(page.getByRole('tab')).toHaveCount(0);
    for (const id of ['wp-routes-permit', 'wp-routes-exempt', 'wp-timeline-abroad', 'wp-timeline-here'])
      await expect(page.getByTestId(id)).toBeVisible();
  });

  test(`${locale}: one BreadcrumbList on this page's own labels (W109), one FAQPage with nine pairs, the site-wide EmploymentAgency node once`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const nodes = await jsonLdNodes(page);
    const crumbs = nodes.filter((n) => typesOf(n).includes('BreadcrumbList')) as unknown as {
      itemListElement: { name: string; item: string }[];
    }[];
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].itemListElement.map((i) => i.name)).toEqual(
      locale === 'tr' ? ['Ana Sayfa', 'Çalışma İzinleri'] : ['Home', 'Work Permits'],
    );
    expect(crumbs[0].itemListElement[1].item.endsWith(ROUTES[locale])).toBe(true);
    const faq = nodes.filter((n) => typesOf(n).includes('FAQPage'));
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(9);
    expect(nodes.filter((n) => typesOf(n).includes('EmploymentAgency'))).toHaveLength(1);
  });
}

test('W4: the related-articles block is absent below the blog threshold (0 Turkish bodies)', async ({
  page,
}) => {
  for (const path of Object.values(ROUTES)) {
    await page.goto(path);
    await expect(page.getByTestId('wp-hero')).toBeVisible();
    await expect(page.getByTestId('wp-related')).toHaveCount(0);
  }
});

test('W10: the ≤ 700 px variants are CSS switches on server-rendered markup', async ({ page }) => {
  await page.goto(ROUTES.en);
  const mobileOnly = [
    page.getByTestId('wp-intro-mob'),
    page.getByTestId('wp-cta-routes'),
    page.getByTestId('wp-renewal-mob'),
  ];
  const desktopOnly = [
    page.getByTestId('wp-intro-desk'),
    page.getByTestId('wp-hero-ctas'),
    page.getByTestId('wp-cta-buttons'),
    page.getByTestId('wp-renewal-desk'),
  ];
  for (const l of isMobile() ? mobileOnly : desktopOnly) await expect(l).toBeVisible();
  for (const l of isMobile() ? desktopOnly : mobileOnly) await expect(l).toBeHidden();
});

test('the language switch keeps the visitor on this page', async ({ page }) => {
  test.skip(isMobile(), 'the switcher lives in the hamburger below lg — covered by e2e/chrome.spec.ts');
  await page.goto(ROUTES.tr);
  await page.locator('a[hreflang="en"]:visible').first().click();
  await expect(page).toHaveURL(/\/en\/work-permit$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('desktop: the sticky bar appears after 700 px, hides near #permit-cta, publishes its height and tracks its contact CTAs (W18/W81)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar is lg+ only; the mobile bottom bar carries Call/WhatsApp below lg');
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
  await call.evaluate((a) => a.addEventListener('click', (e) => e.preventDefault(), { once: true }));
  await call.click();
  const pushed = await page.evaluate(
    () => (window as unknown as { dataLayer?: Pushed }).dataLayer ?? [],
  );
  expect(pushed.some((e) => e.event === 'call_click' && e.placement === 'page_cta')).toBe(true);
  await page.locator('#permit-cta').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});
```

`track()` pushes to `window.dataLayer` whether or not GTM is configured (`src/analytics/track.ts`), so no consent is needed for the dataLayer assertions; GTM stays dark on the gated face (W146).

- [ ] **Step 2: Run to verify it fails**

No server may start before Cycle 7 (W126). Prove the spec compiles and is collected, and confirm the red state from the tree:

```bash
npx playwright test e2e/pages/work-permit.spec.ts --list
grep -n "'/work-permit'" src/lib/seo/routes.ts
ls "src/app/[locale]/(site)/work-permit/page.tsx"
```
Expected: `Total: 28 tests in 1 file` (14 cases × the `mobile` and `desktop` projects); the grep shows `'/work-permit',` inside `UNBUILT_PATHNAMES`; `ls` reports no such file — today `/calisma-izni` answers 404 through `[...rest]`, so every case would fail on its first `goto`. The spec executes exactly once, green, in Cycle 7's gate.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getRateConfig } from '@/content/collections';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { heroBadge } from './_lib/badge';
import { waPrefill } from './_lib/prefill';
import { buildWizardProps } from './_lib/wizard-props';
import { AudienceRouter } from './_sections/AudienceRouter';
import { Costs } from './_sections/Costs';
import { Documents } from './_sections/Documents';
import { Exemptions } from './_sections/Exemptions';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { JumpNav } from './_sections/JumpNav';
import { PermitCta } from './_sections/PermitCta';
import { PermitTypes } from './_sections/PermitTypes';
import { Process } from './_sections/Process';
import { RelatedArticles } from './_sections/RelatedArticles';
import { Renewal } from './_sections/Renewal';
import { RoutesComparison } from './_sections/RoutesComparison';
import { Rules } from './_sections/Rules';
import { Timeline } from './_sections/Timeline';

/** W150: the hero's D17 dated badge switches off at `rateConfig.reviewDueAt`; a daily revalidate
 *  makes that happen without a deploy (the route stays statically generated). */
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
  // The package carries no SEO string for this page (the design's <title>/meta sit outside the
  // catalogue), so `pages.wp` has '' ids and these sys fallbacks win (W23/W38). OG image:
  // /og/{locale}/wp.png, titled by the same key, CDN-cached (W123).
  return buildMetadata({
    locale,
    href: '/work-permit',
    bundle,
    pageKey: 'wp',
    fallbackTitle: sys('seo.wp.title'),
    fallbackDescription: sys('seo.wp.description'),
  });
}

export default async function WorkPermit({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  // D17/W1: every package id goes through makeTf, so wp.030/264/274 render their metrics.
  const tf = makeTf(bundle, locale);
  const s = bundle.settings;
  const rateConfig = getRateConfig(bundle);
  const wizard = buildWizardProps({
    locale,
    whatsappNumber: s.whatsappNumber,
    quotaRatio: rateConfig.quotaRatio,
    tf,
    sys,
  });
  // W81: the bar renders its tel:/wa.me CTAs through ContactCta → ContactLink (page_cta); the
  // hire CTA is an internal link. Faces are variants (W122/W127), never caller classes.
  const stickyCtas: StickyCta[] = [
    { label: tf('wp.054'), href: telLink(s.phone), variant: 'secondary' },
    {
      label: tf('wp.035'),
      href: waLink(s.whatsappNumber, waPrefill(sys, 'question')),
      variant: 'success',
      external: true,
    },
    { label: tf('wp.055'), href: '/hire-workers', variant: 'primary' },
  ];
  // No <main>: the (site) layout's SiteChrome owns it (R31). Section order = the design's.
  return (
    <>
      <Hero
        bundle={bundle}
        locale={locale}
        tf={tf}
        badge={heroBadge(rateConfig, locale, sys)}
        wizard={wizard}
      />
      {/* design .ja-sticky: after 700 px of scroll, hidden while #permit-cta is near (W18) */}
      <StickyCtaBar message={tf('wp.053')} ctas={stickyCtas} hideNearId="permit-cta" live />
      <JumpNav tf={tf} />
      <AudienceRouter bundle={bundle} tf={tf} />
      <RoutesComparison tf={tf} />
      <PermitTypes bundle={bundle} tf={tf} />
      <Rules tf={tf} />
      <Exemptions bundle={bundle} tf={tf} />
      <Process bundle={bundle} tf={tf} />
      <Timeline tf={tf} />
      <Costs bundle={bundle} tf={tf} />
      <Documents tf={tf} />
      <Renewal bundle={bundle} tf={tf} />
      <Faq bundle={bundle} locale={locale} tf={tf} />
      <RelatedArticles bundle={bundle} locale={locale} tf={tf} />
      <PermitCta bundle={bundle} tf={tf} />
    </>
  );
}
```

Notes for the implementer:
- No `generateStaticParams` (the locale layout has it). `revalidate = 86400` makes the route ISR with a one-day window (W150); the page reads no `headers()`/`cookies()`, so it prerenders for both locales.
- `sys` (next-intl's translator from `getTranslations('sys')`) is passed where `_lib` expects `SysT` / `(key: string) => string`: without an `AppConfig` augmentation its keys are loose strings and its `values` accept `Record<string, string | number>` — the same call shape `formatReadMinutes.ts` relies on.
- One `Breadcrumbs` (in `Hero`) and one `FaqBlock` (in `Faq`): exactly one `BreadcrumbList` and one `FAQPage` node (the WP2a final review's page rule). The site-wide `Organization`/`EmploymentAgency` node comes from the locale layout; the design's client-side copy of it is not re-emitted.
- `getBundle`/`makeTf` come from `@/content/adapter` (`export * from './pure'`); never import `design-package/**` or `content/local/*` (ESLint `no-restricted-imports`, D23).

`src/lib/seo/routes.ts` — inside the `UNBUILT_PATHNAMES` set literal, delete the one line:

```ts
  '/work-permit',
```

(Nothing else in the file changes; W20.)

`e2e/routes.ts` — append at the end of the `GATE_ROUTE_TABLE` array literal, after its last row (whatever T1/T13/T2/T3 left there — order is irrelevant to every consumer; W21):

```ts
  { path: '/calisma-izni', indexable: true },
  { path: '/en/work-permit', indexable: true },
```

`docs/SEO.md` — append one row to the `## Pages` table T1 created (W98; `grep -n '^## Pages' docs/SEO.md`), after the last row:

```markdown
| Work Permit (T4) | `/calisma-izni` · `/en/work-permit` | `sys.seo.wp.{title,description}` — the page record `wp` carries `''` ids (the design's `<title>`/meta are outside the catalogue, W23/W38); OG image `/og/{locale}/wp.png` (title `sys.seo.wp.title`, subline `sys.seo.ogTagline`), CDN-cached (W123) | `absoluteUrl(locale, '/work-permit')`; hreflang tr / en / x-default | layout `Organization`/`EmploymentAgency` + `WebSite` (the design's client-side `EmploymentAgency` copy is not re-emitted); `BreadcrumbList` (2: `wp.021` → `/`, `wp.011` → this page, W109); `FAQPage` (9 pairs — `wp.334`–`350` plus the sys answer to `wp.340`, AEO only) — one `Breadcrumbs` and one `FaqBlock` on the page | **the h1** (`data-lcp-slot="h1"`) — §10 row 4 gives this page no photo, so `wp-hero` stays a named placeholder behind the navy gradients; setting `HERO_SRC` in `src/app/[locale]/(site)/work-permit/_lib/assets.ts` moves `data-lcp-slot="wp-hero"` + preload onto the image (D26) | no door form (explainer, PRD §2 row 5); `#permit-cta` is the header CTA's target (W152/W158); `revalidate = 86400` for the D17 badge (W150); the related-articles block renders only past the blog threshold (W4); side-by-side review, not a pixel page (D27) |
```

`docs/ANALYTICS.md` — three edits:

1. In the `## Event schema` table, the row whose first cell is `` `eligibility_check_complete` ``: replace its "Fires on" cell `Work Permit wizard — a result is shown` with `Work Permit wizard — the fourth answer shows the verdict (once per completed run; the answers themselves are never sent, W67)` (prettier re-pads the table).
2. Under `### Page instrumentation (WP2b)` (T1's heading, W98), append after the last bullet:

```markdown
- **Work Permit (`/calisma-izni`, `/en/work-permit`, T4):** `eligibility_check_complete` once per completed run of the eligibility wizard, with `result` ∈ `eligible` | `conditional` | `ineligible` (W67) — the four answers are never pushed (the card promises "nothing is stored", `wp.045`), and the wizard posts nothing to the door; `whatsapp_click` with `placement: 'page_cta'` from the hero's "WhatsApp us", the wizard's result button (its DOM href is the bare chat; the prefill with the answers and the verdict is composed on click and opened `noopener` — W95, fired through `useContactClick('page_cta')` in the island, a middle click counted too), the router's permit-only card, the permit-types, exemptions and permit-only asks, the cost quote, the renewal banner, the FAQ ask card's WhatsApp row (`FaqBlock`), the closing band's permit-only button and ≤ 700 px route card, and the sticky bar's WhatsApp (W81); `call_click` (`page_cta`) from the closing band's phone button and the sticky bar's Call; `email_click` (`page_cta`) from the FAQ ask card's e-mail row (W83) and the closing band's licence line. No form, so no `generate_lead`/`conversion`. Same-page anchors (the jump nav, "Check your eligibility →", the in-sentence `#rules`/`#eligibility` links) and the internal links fire nothing.
```

3. In the paragraph that begins "**WP1 wired exactly one of these seven events: `conversion`**" (`grep -n 'WP1 wired exactly one' docs/ANALYTICS.md`), the clause listing the events that are "declared but still uncalled" (at WP2a: "`generate_lead`, `calculator_use`, `language_switch` and the five W26 page events are declared but still uncalled — …"; T3 removes `calculator_use` from that list; T1, T13 and T2 leave the clause alone): replace "the five W26 page events are declared but still uncalled" with "four of the five W26 page events are declared but still uncalled (`eligibility_check_complete` fires from the Work Permit wizard since WP2b T4)" and leave the rest of the paragraph as it is. This page is the first live producer of a W26 page event, so the clause would be false after this commit otherwise.

`docs/PRD.md` — two in-place edits (W45):

1. §2, the table row whose second cell is `Work Permit`: replace its last cell `none (explainer)` with:

```markdown
none (explainer) — the eligibility wizard is client-only: it stores and posts nothing; its result opens WhatsApp with a prefill composed on click (W95) and pushes `eligibility_check_complete` with the result bucket only (W67)
```

2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`). When this task runs it opens "10 of the 14 core pages (the homepage is the first designed page — WP2b T1; Hire Workers is the second — WP2b T2; the portal entry is built (WP2b T13); the Cost Calculator is designed (WP2b T3))": T1 replaced the WP2a parenthesis "(only the homepage and Hire Workers exist, both still spike-era placeholder content)", T13 decremented "12 of the 14" to "11 of the 14" and inserted "; the portal entry is built (WP2b T13)", T2 rewrote T1's Hire-Workers clause to "Hire Workers is the second — WP2b T2" (count unchanged), T3 decremented "11 of the 14" to "10 of the 14" and appended "; the Cost Calculator is designed (WP2b T3)". Make Work Permit count as built: replace "10 of the 14 core pages" with "9 of the 14 core pages", and directly after "the Cost Calculator is designed (WP2b T3)" insert "; Work Permit is designed (WP2b T4)" (before the parenthesis closes). Leave the rest of the sentence as it is (W45: edit in place, never re-add WP1 wording). If `grep -n 'the Cost Calculator is designed (WP2b T3)' docs/PRD.md` finds nothing, an earlier task drifted: read the count the sentence carries now, decrement it by one, and append "; Work Permit is designed (WP2b T4)" as the parenthesis's last clause — never rewrite the sentence from scratch.

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit/page.tsx" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/work-permit.spec.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: clean — typecheck covers `e2e/pages/work-permit.spec.ts` and the page's RSC props (every prop the page hands the client wizard and the sticky bar is serialisable: strings, arrays, plain objects); `src/lib/seo/unbuilt.test.ts` green (the page exists and its key is gone); `src/app/sitemap.test.ts`, `src/app/robots.test.ts` and `src/lib/seo/routes.test.ts` green (they compute from `UNBUILT_PATHNAMES`); the whole suite green. The page file has no unit test of its own: it only composes the tested sections and is proven by the Cycle 7 build + gate.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/work-permit/page.tsx" src/lib/seo/routes.ts e2e/routes.ts e2e/pages/work-permit.spec.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
git commit -m "feat(work-permit): the Work Permit page — route registration, page e2e contract, SEO/analytics/PRD docs

Hero with the eligibility wizard and the D17 badge (revalidate 86400, W150), jump nav,
router, stacked comparison and timeline (D20), rules, exemptions, process, costs,
documents, renewal, FAQ, related articles hidden below the blog threshold (W4) and
#permit-cta (W152/W158); sticky bar (W18/W81); h1 is the named LCP slot (D26).
'/work-permit' leaves UNBUILT_PATHNAMES and both locale paths join the gate (W20/W21).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 7 — the W126 proof session: one build, one start, the gate, js-size, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome. No pixel run: T4 is not one of the four D27 harness pages (the named deltas at the top of this task are the side-by-side reviewer's list).

- [ ] **Step 1: Pre-flight — no new test (the Cycle 1–6 tests and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
grep -n "calisma-izni\|/en/work-permit" e2e/routes.ts           # 2 hits, both `indexable: true` (W21)
grep -n "'/work-permit'\|'/hiring-cost-calculator'" src/lib/seo/routes.ts   # no hit — T3 and this task deleted their keys (W20)
ls "src/app/[locale]/(site)/hire-workers/page.tsx" "src/app/[locale]/(site)/hiring-cost-calculator/page.tsx"   # both exist (T2, T3 — W99)
grep -n "'/work-permit'" src/design/chrome/ctas.ts                # the CTA_BY_PATHNAME key → hash '#permit-cta' (W121: untouched)
ls -a | grep '^\.env'                                             # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'door-less, GTM-dark'
git status --short                                                # clean: Cycles 1–6 are committed
```
Expected: exactly as annotated. A GTM id or an `.env.local` must be removed from this shell/worktree before building — a GTM id would put third-party script into the measured budget (W146). If `/hiring-cost-calculator` is still unbuilt, W99's order was not kept: stop and report (the router's calculator card would link a 404 and its viewport prefetch would cost best-practices 1.00) — never "fix" the route list from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
rm -rf .next .lighthouseci lighthouse-report test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/wp-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/calisma-izni && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds — this is the first time the RSC boundaries of `page.tsx` → the sections → the `'use client'` `EligibilityWizard`/`ProgressBar`/`StickyCtaBar`/`ContactLink`/`Accordion` are compiled (jsdom could not see them); the route table lists `/[locale]/work-permit` as statically generated with a one-day revalidate for both locales (W150); `up` is printed. A build error is fixed in the source, committed after the verify line, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, the launch anchor check**

```bash
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/wp-gate-launch.log" 2>&1 || true
grep -n 'missing id="permit-cta"' "$TMPDIR/wp-gate-launch.log" || echo 'no missing #permit-cta anchor'
grep -n 'calisma-izni\|/en/work-permit' "$TMPDIR/wp-gate-launch.log"
```
Expected:
- **Gate** (localhost wears the production face → `lighthouserc.local.json`, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/work-permit.spec.ts` 26 passed + 2 skipped (the language-switch and sticky-bar cases skip on `mobile` by design) — and `routing` (the page-contract loop now covers both routes), `seo` (canonical + hreflang on both; the sitemap lists them and they answer 200; the site-wide `EmploymentAgency` node), `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on `/calisma-izni` and `/en/work-permit` under both projects; `region` clean at 390/1000/1440), `width-sweep` (no horizontal overflow at 1440…390 incl. 1101/1100 and 901/900 — the comparison, the sample card and the jump nav's inner scroller are the candidates), `chrome`, `headers`, `thank-you`, `ops` (two token cases skip without `REVALIDATE_SECRET`) and the earlier page specs all green. `lhci assert` passes on every indexable gate route; on the two work-permit routes (median of 3 DevTools-throttled runs): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms, CLS ≤ 0.1.
- **js-size** (W136 — the ledger's figure): both routes below **191,724 B** on this LOCAL build (W162: the binding preview's `npm run js-size` runs ≈ 2,836 B above the local build, so 191,724 B local is the 194,560 B lazy line on the preview; the controller decides at 194,560 B). Projection ≈ 181–186 KB (local): the WP2a close measured the shell at 176,132 B (TR) / 172,783 B (EN); this page adds the wizard island, `ProgressBar`, `StickyCtaBar` + `ContactCta` (`ContactLink`, `useContactClick`, `Button` and `Accordion` already ship with the chrome). The observed LCP column should read the h1 at ≈ 1.5–2.0 s. **Stop rule:** a LOCAL figure ≥ 191,724 B on either route → finish Steps 4–5 (the server killed, the ledger row committed with its `LazyStickyBar:` cell reading `pending`), then STOP: report both figures and the route's client-manifest breakdown to the controller, and run Cycle 8 only on the controller's go-ahead, before T5 starts (W13 amended, W162).
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (W20: T5–T12 routes are still unbuilt, so it exits after its three checks — no second Playwright/Lighthouse run happens), but the first grep prints `no missing #permit-cta anchor`. The second grep may show only dead-target lines for this page's `/partner-with-us` links (`/ortak-olun`, `/en/partner-with-us` → 404 until T5) — expected; any other line naming the two work-permit routes is a defect. The D26 table lists both routes with one placeholder (`wp-hero`) and LCP slot `h1`, no problem.

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID).

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T4 row to the `## Ledger` table in T1's row format (W98 — six columns: Task | Routes (tr · en) | JS | Lighthouse | Pixel (D27) / named deltas | Date), every `<…>` filled from this session: the "**Ledger line**" template at the end of this task. Then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(work-permit): T4 ledger row — gate, js-size, Lighthouse medians, launch anchor sweep

Localhost proof session (W126/W145): one build, one gate, both work-permit routes under
the 191,724 B local lazy trigger (W162); #permit-cta present for CTA_BY_PATHNAME in both locales
(W152/W158); not a pixel page (D27 side-by-side review).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 8 — conditional: the lazy pass (W13 amended)

Run this cycle only if Cycle 7's LOCAL `js-size` put a work-permit route at or above **191,724 B** (W162: the local trigger — the preview's figure runs ≈ 2,836 B higher and the controller decides at 194,560 B there) AND the controller, told of the crossing by Cycle 7's stop-and-report, has said to run it; otherwise the task ends with Cycle 7 (the ledger says `LazyStickyBar: no`). It is the task's only second build. The first lazy candidate is the sticky bar: it renders nothing until the visitor has scrolled 700 px, so `null` is its DOM-identical fallback (W132). Its observer uses the top-extended margin `'100000px 0px 200px 0px'` (W165, T3's pattern): the jump nav, the `#permit-cta` link, a reload at a hash and scroll restoration can jump past the wrapper, and the bar must load whenever the visitor is at or below the marker. The wizard stays SSR'd — it is above the fold, where a lazy island would load at once and save nothing in the measure.

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/work-permit/_components/__tests__/LazyStickyBar.test.tsx`:

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
  readonly root = null;
  readonly rootMargin = '';
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
        ctas={[{ label: 'x', href: '/hire-workers' }]}
        hideNearId="permit-cta"
        live
      />,
    );
    expect(container.firstElementChild?.tagName).toBe('DIV'); // LazyIsland's wrapper
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  it('reaches the bar only through the dynamic import (no static runtime edge)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/app/[locale]/(site)/work-permit/_components/LazyStickyBar.tsx'),
      'utf8',
    );
    expect(src).not.toMatch(
      /^import \{[^}]*StickyCtaBar[^}]*\} from '@\/design\/chrome\/StickyCtaBar'/m,
    );
    expect(src).toContain("import('@/design/chrome/StickyCtaBar')");
  });

  it('observes with the top-extended margin, so an anchor jump past the wrapper still loads the bar (W165)', () => {
    vi.stubGlobal('IntersectionObserver', RecordingObserver);
    render(
      <LazyStickyBar
        message="m"
        ctas={[{ label: 'x', href: '/hire-workers' }]}
        hideNearId="permit-cta"
        live
      />,
    );
    expect(rootMargins).toEqual(['100000px 0px 200px 0px']);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 work-permit/_components
```
Expected: FAIL — `../LazyStickyBar` cannot be resolved (once it exists without the margin, the third case would read `['200px']` — `LazyIsland`'s default).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/work-permit/_components/LazyStickyBar.tsx`:

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

/** The margin reaches 100,000 px ABOVE the viewport (W165, T3's pattern): the jump nav, the
 *  `#permit-cta` link, a reload at a hash and scroll restoration can all jump past the wrapper,
 *  so it never crosses the viewport and a plain 200 px margin would then never load the bar.
 *  With the top margin "at or below this point" is what counts, while the first viewport (the
 *  wrapper sits below it on a phone) still loads nothing. */
const STICKY_MARGIN = '100000px 0px 200px 0px';

/** W13 amended lazy pass: the bar renders `null` until the visitor has scrolled past
 *  `showAfterPx`, so `null` is its DOM-identical fallback (W132 — `{ load, props, fallback,
 *  rootMargin? }`, no `ssr`). The page mounts this right below the hero: on a phone (the
 *  Lighthouse viewport) its wrapper is far below the fold, so the bar's chunk stays out of the
 *  first load; on a desktop it loads almost at once, well before the 700 px threshold. A server
 *  page cannot pass `load` (a function) to a client component, hence this one-line wrapper. */
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

`src/app/[locale]/(site)/work-permit/page.tsx` — replace the import line `import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';` with the two lines

```tsx
import type { StickyCta } from '@/design/chrome/StickyCtaBar';
import { LazyStickyBar } from './_components/LazyStickyBar';
```

(the second one sorted with the other `./_…` imports) and the JSX element `<StickyCtaBar message={tf('wp.053')} ctas={stickyCtas} hideNearId="permit-cta" live />` with `<LazyStickyBar message={tf('wp.053')} ctas={stickyCtas} hideNearId="permit-cta" live />` (same props, same position right below `<Hero … />`).

- [ ] **Step 4: Verify, then the re-proof session**

```bash
npx prettier --write "src/app/[locale]/(site)/work-permit"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add "src/app/[locale]/(site)/work-permit"
git commit -m "perf(work-permit): the sticky bar behind LazyIsland — under the 191,724 B local trigger (W13 amended, W132, W162, W165)

The bar renders null until 700 px of scroll, so null is its DOM-identical fallback;
its observer uses the top-extended rootMargin so an anchor jump past the wrapper still
loads it; the wizard stays SSR'd above the fold.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
rm -rf .next .lighthouseci
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/wp-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/calisma-izni && echo up
E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/pages/work-permit.spec.ts e2e/a11y.spec.ts e2e/width-sweep.spec.ts
E2E_BASE_URL=http://localhost:3000 npm run js-size -- --routes=/calisma-izni,/en/work-permit
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: the verify green (`LazyStickyBar.test.tsx` 3/3); the three specs green (the scoped re-run of the page contract — the sticky-bar case proves the lazy bar still appears after 700 px and hides near `#permit-cta` — axe and the width sweep; the full gate already ran once, W126); both routes below 191,724 B on the local build in the W94 spot-check (W162; if the lazy pass still leaves a route at or above it, stop and report the route's client-manifest breakdown to the controller — no further change without a ruling); `no stray processes`.

- [ ] **Step 5: Commit**

Update the T4 row of `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the re-measured js-size, `LazyStickyBar: yes`), then:

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(work-permit): T4 ledger — lazy sticky bar, re-measured js-size

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` — the Work Permit bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (Cycle 1, with the keys and the deliberately unread ids). `docs/SEO.md` — the Work Permit row of T1's `## Pages` table, naming the LCP element (the h1 — §10 row 4 gives this page no photo) (Cycle 6). `docs/ANALYTICS.md` — the `eligibility_check_complete` row's "Fires on" cell, the Work Permit bullet under `### Page instrumentation (WP2b)` and the "declared but still uncalled" clause of the "**WP1 wired exactly one of these seven events**" paragraph (`eligibility_check_complete` is wired from T4) (Cycle 6; no new event, no new parameter, no new enum value). `docs/PRD.md` — §2 row 5's last cell and the §11 "Not yet built" sentence, edited in place (Cycle 6, W45). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T4 `## Ledger` row (Cycle 7, updated in Cycle 8 if it runs). No `docs/ARCHITECTURE.md` or `docs/INTEGRATIONS.md` change: the page has no form and no new integration, and T1 already documented the page-private `_lib/`/`_components/`/`_sections/` layout in ARCHITECTURE § Routing.

**Sys keys added:** 25 keys, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `_lib/__tests__/sys-keys.test.ts` (and checked by `messages.test.ts` for parity and `voice.test.ts` for W154):
- `sys.seo.wp.title` — TR "Yabancı işçiler için Türkiye çalışma izni — kurallar, e-Muafiyet ve süreç | JobsAdmire" · EN "Work permit in Türkiye for foreign workers — rules, e-Muafiyet and process | JobsAdmire"
- `sys.seo.wp.description` — TR "6735 sayılı Kanun kapsamında çalışma izni: standart izin ya da e-Muafiyet, işveren kriterleri, süreler, maliyetler ve belgeler — dosyayı JobsAdmire, İŞKUR lisansıyla yürütür." · EN "Turkish work permits under Law No. 6735: the standard permit or the e-Muafiyet exemption, the employer criteria, timelines, costs and documents — filed by JobsAdmire under its İŞKUR licence."
- `sys.wp.hero.updated` — TR "Güncelleme: {month} · JobsAdmire izin ekibi tarafından incelendi" · EN "Updated {month} · Reviewed by the JobsAdmire permit team"
- `sys.wp.wizard.progress` — TR/EN "{current} / {total}"
- `sys.wp.wizard.progressLabel` — TR "Uygunluk kontrolünün ilerleyişi" · EN "Eligibility check progress"
- `sys.wp.wizard.options.yes` — TR "Evet" · EN "Yes"
- `sys.wp.wizard.options.no` — TR "Hayır" · EN "No"
- `sys.wp.wizard.options.atLeast` — TR "{ratio} veya daha fazla" · EN "{ratio} or more"
- `sys.wp.wizard.options.below` — TR "{ratio} kişiden az" · EN "Fewer than {ratio}"
- `sys.wp.wizard.options.abroad` — TR "Yurt dışında" · EN "Abroad"
- `sys.wp.wizard.points.ratio` — TR "Her yabancı işçi için SGK'da {ratio} kişiden az Türk çalışan: standart izinde 1:{ratio} oranı iş yerinize uygulanır ve bazı sektörler muaftır — JobsAdmire, dosyalamadan önce oranın nasıl uygulandığını kontrol eder." · EN "Fewer than {ratio} Turkish employees on SGK for each foreign worker: the standard permit's 1:{ratio} ratio applies to your workplace, and some sectors are exempt — JobsAdmire checks how it applies before anything is filed."
- `sys.wp.wizard.prefill.intro` — TR "sitenizdeki uygunluk kontrolünü yaptım ve bir çalışma izni hakkında görüşmek istiyorum. Cevaplarım:" · EN "I did the eligibility check on your website and would like to discuss a work permit. My answers:"
- `sys.wp.wizard.prefill.result` — TR "Sonuç: {title}" · EN "Result: {title}"
- `sys.wp.sample.label` — TR "Kurgusal bilgilerle hazırlanmış temsili Türkiye çalışma izni kartı" · EN "Illustrative sample of a Turkish work permit card with fictional details"
- `sys.wp.sample.foreignerId` — TR/EN "99•• ••• ••44"
- `sys.wp.sample.validity` — TR/EN "15.08.2026 — 14.08.2027"
- `sys.wp.documents.count` — TR "{n} belge" · EN "{n, plural, one {# document} other {# documents}}"
- `sys.wp.faq.exemptionAnswer` — TR "e-Muafiyet, Bakanlığın çevrim içi çalışma izni muafiyet sistemidir (emuafiyet.csgb.gov.tr). İşi 48. madde kategorilerinden birine giren yabancılar — makine montajı ve eğitimi, sınır ötesi hizmetler, mevsimlik tarım, bilimsel veya sportif faaliyetler ve diğerleri — tam izin olmadan sınırlı bir süre, genellikle 3 aya kadar çalışabilir. Yurt içi başvurular Türkiye'ye girişten sonraki 30 gün içinde yapılmalıdır." · EN "e-Muafiyet is the Ministry's online work permit exemption system (emuafiyet.csgb.gov.tr). Foreigners whose work fits an Article 48 category — machinery installation and training, cross-border services, seasonal agriculture, scientific or sporting activities and others — can work without a full permit for a limited period, typically up to 3 months. Domestic applications must be filed within 30 days of entering Türkiye." (**WP-C legal item**)
- `sys.wp.faq.emailSubject` — TR "Çalışma izni sorusu" · EN "Work permit question"
- `sys.wp.whatsapp.question` — TR "çalışma izniyle ilgili bir sorum var." · EN "I have a work permit question."
- `sys.wp.whatsapp.permitOnly` — TR "kendi işçim var — çalışma iznini siz yürütebilir misiniz?" · EN "I have my own worker — can you handle the work permit?"
- `sys.wp.whatsapp.permitType` — TR "benim durumumda hangi çalışma izni türü geçerli?" · EN "which work permit type applies to my case?"
- `sys.wp.whatsapp.exemption` — TR "durumum çalışma izni muafiyetine giriyor mu?" · EN "does my case qualify for a work permit exemption?"
- `sys.wp.whatsapp.quote` — TR "benim durumumda çalışma izni ne kadar tutar?" · EN "what would a work permit cost for my case?"
- `sys.wp.whatsapp.renewal` — TR "bir çalışma iznini yenilemek için yardıma ihtiyacım var." · EN "I need help renewing a work permit."

Consumed, not added: `sys.whatsapp.prefill` (the greeting every prefill starts with), `sys.nav.breadcrumbs` (through `Breadcrumbs`), `sys.seo.ogTagline` (the OG subline), `sys.blocks.readMinutes` (through `PostCard`, only once the related block shows).

**Package ids used:** 336 of the page's 398, all present in `src/content/local/catalogue.json` and in both bundles (verified: 398/398 `wp.*` ids exist; `_lib/__tests__/tables.test.ts` re-proves the table ids and the section tests render every other id in both locales) — first `wp.011`, last `wp.395`: `wp.011` + `wp.021` (crumbs, W109), `wp.023`–`051` (hero, wizard copy, chips), `wp.053`–`065` (sticky bar, jump nav, the first wizard point), `wp.067`–`260` (wizard points and questions, router, comparison, sample card, permit types, rules, exemptions, process, timeline heading), `wp.263`–`299` (timeline cards, costs, documents heading), `wp.301`–`324`, `wp.326`–`352` (documents, renewal, FAQ, related heading/link — the last two render only past the blog threshold), `wp.359`–`367` (closing band), `wp.395` (licence line); `wp.130` and `wp.089` are read twice by design (comparison + fixed-term bullet; router + closing route card). Not rendered (62): `wp.001`–`010`, `wp.012`–`020` (chrome — the layout renders the canonical `home.*` ids, R15; `wp.016`/`017` are the header CTA, which the chrome renders from `CTA_BY_PATHNAME`), `wp.022` (dated badge → `sys.wp.hero.updated`, D17), `wp.052` (the dropped fine chip), `wp.066` (W2), `wp.261`/`262` (tab labels — the cards stack, D20), `wp.300` (typed count), `wp.325` (the "days" numeral), `wp.353`–`358` (static blog cards, W4), `wp.368`–`394` (chrome), `wp.396`/`397` (schema text — the site-wide node is the layout's), `wp.398` (orphan newsletter string, W5).

**CLIENT_SYS additions:** none — the one client module this page adds (`EligibilityWizard`, plus the conditional `LazyStickyBar`) reads no `sys.*`: every wizard string, the ICU step pills and the prefill lines are resolved on the server by `buildWizardProps` and passed as props. `src/i18n/client-messages.ts` stays as T3 left it (`consent, languageHint, errorTitle, errorRetry, form, calc` — T3 appends `calc`; T1, T13 and T2 add none) and `client-messages.test.ts` needs no change (W148).

**Foundation gaps:** none — every name this task consumes exists at `7bacd7e` and was checked in the code (not only in `A/produces-final.md`); the page sends no catalog field, so WP2a Task 8's v1.1 fields (`hire.city`, `partner.track`, `contact.topic`, `careers.portfolioUrl`) are not involved and need no confirmation here. The draft's five gaps are closed or accepted: `StickyCtaBar` now tracks its contact CTAs (W81) and `FaqAskCard` has the e-mail row (W83) — both built; `ProcessSteps` has no badge/horizontal variant, `Section` has no gradient tone and `RateConfig` has no fine — all three accepted as page-local by the WP2b reconcile (the page-local process grid, the closing band's own `<section>`, the dropped chip). Accepted page-local items (no foundation change): the process grid; the light closing band (`ClosingCtaBand` is a dark card whose body cannot switch at ≤ 700 px); the wizard's click-time WhatsApp anchor (`ContactLink` omits `onClick` by design, so the result button is `Button` + `useContactClick('page_cta')` — the `FallbackPanel`/T1 `WhatsAppComposeLink` contract, copied rather than imported across route folders); `FaqBlock` showing the ask card at every width; the conditional `LazyStickyBar` wrapper (a server page cannot pass `LazyIsland`'s `load` function).

**Ledger line** (T1's six-column row format, W98 — fill every `<…>` from Cycle 7/8; the controller adds the binding preview figures after the push):

```markdown
| T4 Work Permit | `/calisma-izni` · `/en/work-permit` | js-size (W136, local): `/calisma-izni` <n> B · `/en/work-permit` <n> B (ceiling 204,800; lazy line 194,560 on the preview = local trigger 191,724, W162; LazyStickyBar: <no/yes>); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production, W145): `/calisma-izni` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; `/en/work-permit` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n> | pixel: n/a — not a D27 harness page (side-by-side review); named deltas 1–16 (tabs → stacked cards with real captions, fine chip dropped, dated badge from rateConfig, page-local process grid, renewal numeral, sys FAQ answer, click-time wizard prefill, light closing band, W4 related block, sample card + pseudo-element watermark, D20 faces/greys, h2 wizard heading + SVG marks, rules order, FAQ ask card at every width, jump-nav stickiness + router columns, navy sticky bar); launch sweep: #permit-cta present tr+en (W152/W158), `/ortak-olun` · `/en/partner-with-us` 404 until T5; WP-C: sample card `wp.139`–`160`, `sys.wp.faq.exemptionAnswer`, `sys.wp.wizard.points.ratio` (W2), `wp.050`/`051` timing (W2), `wp.095` "2026 rates", `wp.196`/`342` fine "in 2026", `wp.046`/`277`/`335` "~30 days" vs `permitDays` 45 (§10 row 2) | <YYYY-MM-DD> |
```
