### Task 11: Careers index + detail — `/kariyer` · `/en/careers` and `/kariyer/[slug]` · `/en/careers/[slug]`

**Why this task exists.** Design-package page 8, "Join Our Team" (`design-package/design/Join Our Team.dc.html`, strings `design-package/strings/jointeam.json`, ids `jt.001`–`jt.321`), is recruiting for JobsAdmire itself. The design hard-codes nine marketing roles, links every "Apply" out to operations.jobsadmire.com, carries a speculative-application form that only opens WhatsApp, and puts nine dated `JobPosting` nodes on the index. This task ports it onto the WP1 + WP2a foundation the way Phase A demands: the index lists the **live** openings of the Operations public careers API (read server-side only, ISR tag `openings`, 300 s floor — spec §3.1, D8, D15), shows the designed empty state when nothing is open (W6), keeps the speculative application to WhatsApp + e-mail (W3), and links nowhere on Operations (W8/W89); a new detail page per opening renders the role, its `JobPosting` JSON-LD (D15) and the apply form → form key `careers` (the PDF CV uploaded first through the public `POST /api/careers/upload-cv`, the residency lock, the Pakistan expected-salary rule, the portfolio "apply by e-mail" branch — W3/W56). The nine fixture roles are never rendered (D23).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` — never the shared checkout `…/jobsadmire-website`. Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → T2 → … → T10 → **T11** → T12: when this task starts T1 has created the shared doc shapes (W98: `## Pages` in `docs/SEO.md` with the columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`; `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`; the per-page bullet list at the end of `### Adding copy (W9, W23, W54)` in `docs/CONTENT-MODEL.md`; the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 has shipped `/privacy` (`/gizlilik` — the consent link); T2 has shipped `/hire-workers` with `id="request-form"` (the target of `DEFAULT_CTAS`, the header CTA on both careers routes); T5 has shipped `/partner-with-us` (the worker notice's and the ways note's link). Where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `77da5eb` and re-verified at the 2026-10-01 recheck (`36d6bd9` — no `src/`, `e2e/`, `scripts/` or docs change since).

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first). The task ends with ONE proof session (W126, Cycle 6): the fixture door, one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `npm run gate`, `npm run js-size`, then both processes are killed and no stray process is left. Playwright runs only inside that session. This page is not a D27 pixel page — no `npm run pixel` (side-by-side review against the named deltas below). Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route and contract facts (verified — read before touching anything).**
- `pathnames` (`src/i18n/routing.ts`): `'/careers'` → TR `/kariyer`, EN `/careers`; `'/careers/[slug]'` → TR `/kariyer/[slug]`, EN `/careers/[slug]`. The Operations slug is the same in both locales (openings are single-language Operations content). Private folders (`_lib`, `_components`, `_sections`, `__tests__`) never become routes (`src/lib/seo/unbuilt.test.ts` skips `_`-prefixed folders).
- `src/lib/seo/routes.ts` `UNBUILT_PATHNAMES` contains the two lines `'/careers',` and `'/careers/[slug]',` — each is deleted in the commit that adds its `page.tsx` (W20; `unbuilt.test.ts` fails in either direction otherwise). `e2e/routes.ts` `GATE_ROUTE_TABLE` gets the two index paths; the detail rows are NEVER hand-written — `scripts/gate-routes.mjs` (W93) appends `/kariyer/<slug>` + `/en/careers/<slug>` for the first opening `${OPS_API_URL}/api/careers/openings` returns once `src/app/[locale]/(site)/careers/[slug]/page.tsx` exists, else prints `detail rows skipped (…)`.
- Page records (both bundles): `careers = { titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }`, `careersDetail = { …same…, jsonLd: ['breadcrumb', 'jobPosting'] }`. W124: the `careersDetail` template record carries no per-page SEO field, so the detail page's own title/description/href win in `buildMetadata`. The OG route (`/og/{locale}/{pageKey}.png`, CDN-cached — W123) titles an image from `sys.seo.<pageKey>.title` **called without arguments** (`src/lib/seo/og.ts` `ogTitle`) — a `{title}` template there would print raw on the image. So this task follows T12's blog-article pattern (W169, recheck ruling 2026-10-01): the per-opening `<title>` template lives under `sys.careers.detail.metaTitle`, NO `sys.seo.careersDetail.*` key exists (pinned absent by `copy.test.ts`), and the detail page passes the index's image `pageOgImageUrl(locale, 'careers')` (`/og/{locale}/careers.png`) through `buildMetadata`'s `openGraph.images`.
- Neither careers route has a `CTA_BY_PATHNAME` entry, and none may be added (`src/design/chrome/ctas.ts`; W121 forbids a dynamic key): both render `DEFAULT_CTAS` — primary `home.014`+`home.015` → `{ pathname: '/hire-workers', hash: '#request-form' }` (rendered `/isci-talebi#request-form` · `/en/hire-workers#request-form`), secondary `home.008` → `/partner-with-us`. The anchor `id="request-form"` lives on T2's page, so the careers pages render no header anchor of their own; `gate:launch`'s W152/W158 sweep checks `#request-form` on `/isci-talebi`, and every internal `href` these pages render must answer 200 there.
- Operations public careers API (read-only, `jobsadmire-operations/apps/backend/src/modules/careers-public/careers-public.controller.ts`, controller prefix `careers`, all `@Public()`): `GET /api/careers/openings?page&limit` (`QueryPublicOpeningsDto`: `page` ≥ 1 default 1, `limit` 1–50 default 20) → `{ data: PublicOpening[], meta: { total, page, limit, totalPages } }`, only `OPEN` + `isPubliclyListed` + slugged openings, newest first; `GET /api/careers/openings/:slug` → `{ data: PublicOpening }` or 404 `Opening not found` (a closed opening too); `POST /api/careers/upload-cv` (multipart `file`, client-declared `application/pdf`, ≤ 5 MB, `@Throttle` 10/min — W110) → 201 `{ data: { url, key, fileName } }`. `PublicOpening` (`shapePublicOpening`, careers-public.service.ts) = `{ slug, title, country (Country.code), city, cities[], category (FULL_TIME | FREELANCER | PROJECT_BASED | COUNTRY_REPRESENTATIVE), employmentArrangement, employmentArrangements[] (admin-managed EmploymentType codes: PERMANENT, CONTRACT, FREELANCER, PART_TIME, INTERNSHIP, HOURLY, …), workMode, workModes[] (REMOTE | HYBRID | ON_SITE), description (one text; `jobDescription ?? roleDescription`), salaryMin/salaryMax (decimal strings), salaryCurrency, salaryPayType (RANGE | STARTING | MAXIMUM | EXACT), salaryPeriod (HOUR | DAY | WEEK | MONTH | YEAR) — all five null when salaryVisible is false —, salaryVisible, payCurrency (the opening's currency even when the salary is hidden), portfolioRequired, requiredLanguage, requiredLanguages[], postedAt (the opening's createdAt, ISO) }`.
- The `careers` door (catalog v1.0 + v1.1, `P/operations-door-contract-as-built.md`, `A/produces-final.md` § Task 8 — as built; catalog source read at Operations `47a2160`): `openingSlug` ≤200 REQUIRED `/^[a-z0-9-]+$/`, `cvKey` ≤300 REQUIRED `/^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i`, `name` ≤200 REQUIRED, `email` REQUIRED, `phone` REQUIRED (≥ 8 digits), `country` iso2 REQUIRED, `city` ≤100, `language` ≤300, `expectedSalary` ≤20, `expectedSalaryCurrency` ≤3, `currentSalary` ≤20, `currentSalaryCurrency` ≤3, `coverLetter` ≤5000, `linkedinUrl` ≤500 (length only; the handler adds `https://` and drops junk), v1.1 `portfolioUrl` (type `url`, ≤500, W161: whitespace and digits/phone-only values are refused, a scheme-less value gets `https://` BEFORE the ≤500 check, then http(s) only, no credentials, a dotted host or an IPv4/IPv6 literal — it rides as the last paragraph of the cover letter, `Portfolio: <url>`). An unknown key inside `fields` is dropped silently. Behind the door `CareersPublicService.apply` enforces: the residency rule (`country` must equal the opening's country), an expected salary for `PK` openings, ≥ 1 uploaded portfolio document when `portfolioRequired` (W56 — `portfolioUrl` does NOT satisfy it; the door answers 200 + `status: 'FAILED'` + `error: 'This position requires at least one portfolio document'`), a 409 duplicate (same e-mail + opening) that the handler maps to `alreadyReceived` (a normal 200 → thank-you).
- The forms kernel as built: `createFormAction({ key, schema, toFields(parsed, data, ctx: { visitor, locale }), consent })` (`src/forms/action.ts`, `server-only`) checks the consent tick, trims every string, passes `File` entries through to the schema (repeated keys become arrays), turns the first Zod issue per field into a `sys.form.errors.*` code (`src/forms/errors.ts`: `required email phone min max url file consent captcha invalid`; a schema message naming a code wins), catches `FormActionError` (with `field` → a field error; without → the `failed` panel with its visitor message) and `FormDoorError` from `toFields`, and on a non-`FAILED` 200 redirects `{ pathname: '/thank-you', query: { form: key } }` → `/tesekkurler?form=careers` (D13). `uploadCv(file, { field })` (`src/forms/uploads.ts`, `server-only`) refuses an empty file, a non-`application/pdf` type, a name not ending `.pdf` or a file over `MAX_CV_BYTES` = 3 MiB with `FormActionError` (field `cv`, code `file`), throws `FormDoorError({ kind: 'unauthorized' })` without `OPS_API_URL`, maps a door 400 to the same `file` refusal and other non-2xx to the panel kinds, and returns `{ cvKey }`. `next.config.ts` caps a server-action body at 4 MB (W73/W116). `FormShell` renders children → honeypot → Turnstile (only with a site key) → consent row (`/privacy` only, W79) → form-level alert (errors on names no control shows, e.g. the hidden `openingSlug`) → submit → `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, bare `https://wa.me/<n>` href composed into a prefill only on click — W76); every id is `f-<idScope ?? formKey>-<name>`. `Field` passes `defaultValue`, `minLength`, `maxLength`, `disabled` through (W108) and its select branch always prepends the `sys.form.placeholders.select` option.
- Existing copy this task reuses (both locales): `sys.form.labels.{name,email,phone,country,city,language,expectedSalary,cv,linkedinUrl,portfolioUrl,coverLetter,openingSlug}`, `sys.form.placeholders.*`, `sys.form.hints.{cv,linkedinUrl,portfolioUrl,optional,phone}` (`portfolioUrl` is rewritten here, W178 — the WP1 value demands an `https://` the door does not), `sys.nav.breadcrumbs`, `sys.thankYou.forms.careers` (rewritten here — its "when a suitable role opens" does not fit a per-opening application). `CLIENT_SYS` (`src/i18n/client-messages.ts`) = `consent, languageHint, errorTitle, errorRetry, form, calc` (T3 appended `calc`; no other earlier task adds one): this task's islands call no `useTranslations`, so it is unchanged (W148).
- Settings (LOCAL bundles): `careersEmail 'careers@jobsadmire.com'`, `whatsappNumber '905011240340'`, `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` where set). Collections: `countries` (64 rows `{ code, name, dial }`, names locale-resolved, sorted by code) and `sourceCountries` (13 rows, the ONE source-country list, D17).
- CSS facts: the design's `≤ 900 px` rules → this repo's `max-lg:`/`lg:` (901 px); `xs` 461, `sm` 561, `md` 701. `.container-site` is unlayered CSS (`max-width`, `margin-inline`, `padding-inline`) — never put a `max-w-*`/`mx-*`/`px-*` utility on the same element (it silently loses); wrap instead. The header is sticky, so `#roles` and `#apply` carry `scroll-mt-24`. `text-muted` (#94a3b8, 2.56:1) is never used for text (W128a) — `text-text-tertiary`. White text on `#1899d5` (3.2:1) or `#16a34a` (3.3:1) fails at body sizes — `bg-blue-safe`/`bg-success-text` faces. An inline link inside a sentence is underlined (axe `link-in-text-block`, wcag2a).

**Design deltas this page carries on purpose** (for the side-by-side review — (a) D20, (b) design delta, (c) Phase A data):
1. (c) The roles list is the live Operations list, never the nine fixture roles `jt.144`–`244` (D23). A card links to its detail page — the design's expand panel (duties `jt.050` / wants `jt.051`, "View role"/"Close" `jt.309`/`310`) does not exist because the API has one description; the title is the link.
2. (b) "See N open positions" and the count pill are ICU counts over the live list (`sys.careers.hero.*`; `jt.025` hard-types "dört", `jt.287`/`288` compose a plural-less count — W1); the CTA scrolls to `#roles` without pre-selecting "Overseas".
3. (a) The hero role card's header is solid `blue-safe` with full-white text and a darkened "Live" pill (white/85 on the design's `#1899d5` gradient fails 4.5:1); the dark hero's small grey labels are `#a9b5d8` (the design's `#8b98c4` is 4.4:1 on `#253063`).
4. (c) The country chips are the `sourceCountries` collection (13 — the D17 list; the design's `jt.289`–`301` differ) and wrap on phones instead of scrolling sideways (no focusable scroll region needed).
5. (b) The three "ways" cards are static on every width (W10) — no ≤ 900 px accordion.
6. (a) The process badges use `blue-safe` / `#253063` / `success-text` faces; the decorative connector sits outside the `<ol>` (axe `list`); no staggered reveal (W13). (b) "Check your application status" (`jt.085`) is not rendered (W89).
7. (b) W3/W89: the open application is WhatsApp (`jt.286` prefill) + e-mail (`jt.104`) only — the design's form, its chips, KVKK checkbox, success copy and WhatsApp body (`jt.097`–`102`, `108`–`110`, `284`, `285`, `313`–`321`), the "Open application portal" button (`jt.047`) and the portal note (`jt.105`–`107`) are not rendered.
8. (b) The FAQ is `FaqBlock` (eyebrow/heading in a side column — two columns from `lg`, the design centres one); its footer shows `settings.careersEmail` instead of the literal `jt.114` (W102); `FAQPage` JSON-LD is built from the same eight on-page pairs (never the design's seven hand-written ones).
9. (a) "New" badges are `success-surface`/`success-text` (white on `#16a34a` fails) and derive from `postedAt` (≤ 14 days — the API has no `isNew`).
10. (b) `JobPosting` is on the detail page only, generated from the opening (D15; no `validThrough`, no invented identifier — D17); the index carries none.
11. (b) The detail page is new (the design links out to Operations): the dark hero with the opening's title, a description + at-a-glance column, the apply section (form → `careers`, or the e-mail panel for portfolio openings), the compact process.
12. (a) Inline links in running text are underlined (axe `link-in-text-block`).

**Files:**

Create
- `src/lib/careers-pure.ts` — client-safe contract + helpers: `PublicOpeningSchema`, `OpeningsPageSchema`, `OpeningDetailSchema`, `parseOpenings`, the constants, `placeOf`, `ENGAGEMENT_OF`, `employmentTypeOf`, `isNewOpening`, `summaryOf`, `descriptionBlocks`, `countryNameOf`, `citiesOf`, `locationOf`, `workModesOf`, `languagesOf`, `salaryPartsOf`, `formatMoney`, `baseSalaryOf`, `salaryCurrencyOf`, `detailHref`
- `src/lib/careers.ts` — `server-only`: `listOpenings`, `getOpening` (React `cache`), `listOpeningsUncached`, `getOpeningUncached`, `OpeningsUnavailableError`
- `src/lib/careers-sitemap.ts` — `server-only`: `careersSitemapSource` (W31)
- `src/test/careers.ts` — the test fixture (`OPENING_WIRE`, `OPENING`, `opening()`)
- `src/app/[locale]/(site)/careers/page.tsx` — the index
- `src/app/[locale]/(site)/careers/_lib/roles.ts` — the index view model (`roleCards`, `heroRoles`, `askHrefOf`, types `RoleCard`, `RoleCopy`, `Tf`)
- `src/app/[locale]/(site)/careers/_sections/Hero.tsx` — `CareersHero`, `WorkerNotice`
- `src/app/[locale]/(site)/careers/_sections/Roles.tsx` — `RolesSection`
- `src/app/[locale]/(site)/careers/_sections/Ways.tsx` — `WaysSection`
- `src/app/[locale]/(site)/careers/_sections/HiringSteps.tsx` — `HiringSteps` (shared by both routes)
- `src/app/[locale]/(site)/careers/_sections/OpenApplication.tsx` — `OpenApplication` (`#apply`, W3)
- `src/app/[locale]/(site)/careers/_components/HeroRoleCard.tsx` — server
- `src/app/[locale]/(site)/careers/_components/RolesList.tsx` — `'use client'`, the one index island
- `src/app/[locale]/(site)/careers/[slug]/page.tsx` — the detail
- `src/app/[locale]/(site)/careers/[slug]/actions.ts` — `'use server'`: `submitCareersApplication`
- `src/app/[locale]/(site)/careers/[slug]/_lib/apply.ts` — pure: `applySchema`, `portfolioUrlProblem`, `normaliseSalary`, `applyToFields`
- `src/app/[locale]/(site)/careers/[slug]/_lib/view.ts` — pure: `salaryLine`, `openingView`
- `src/app/[locale]/(site)/careers/[slug]/_components/ApplyStartPing.tsx` — `'use client'`
- `src/app/[locale]/(site)/careers/[slug]/_sections/DetailHero.tsx`, `AboutRole.tsx`, `ApplySection.tsx` — server
- `e2e/mocks/careers-door.mjs` — the fixture door (five openings, the three public routes)
- `e2e/pages/careers.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — new `sys.careers` block; `sys.seo.careers` inside the existing `sys.seo` object (never a `sys.seo.careersDetail` — the OG route would draw its template raw, W169); `sys.thankYou.forms.careers` rewritten; `sys.form.hints.portfolioUrl` rewritten in both locales to accept a scheme-less link (W178)
- `src/lib/seo/routes.ts` — the `UNBUILT_PATHNAMES` initialiser: delete `'/careers',` (Cycle 3) and `'/careers/[slug]',` (Cycle 4)
- `src/lib/seo/sitemap-sources.ts` — the `DETAIL_SITEMAP_SOURCES` literal gains `careersSitemapSource` + its import (W70)
- `src/lib/seo/sitemap-sources.test.ts` — the case titled `is empty and frozen in the foundation — the careers page task edits the literal to add the first source (W70)` is rewritten
- `src/app/sitemap.test.ts` — the case title `is exactly (static keys − excluded) × locales while no detail source is registered` (wording only)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: two rows
- `package.json` — `"careers:door"` and `"e2e:careers"` beside `"e2e"`
- `docs/ARCHITECTURE.md` (§ Freshness; § Quality gate item 2), `docs/INTEGRATIONS.md` (I5, I6), `docs/CONTENT-MODEL.md` (per-page bullet), `docs/SEO.md` (`## Pages` rows, `## Sitemap`, `## JSON-LD`), `docs/ANALYTICS.md` (`### Page instrumentation (WP2b)` bullet), `docs/PRD.md` (§2 rows 8 and "Careers detail", §11 sentence — "3 of the 14 core pages" becomes "2 of the 14 core pages", anchored on T10's post-edit text with a stop-and-report guard, W176), `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (`## Ledger` row)

Test
- Vitest: `src/lib/careers-pure.test.ts`, `src/lib/careers.test.ts`, `src/lib/careers-sitemap.test.ts`, `src/app/[locale]/(site)/careers/__tests__/{copy.test.ts,roles.test.ts,sections.test.tsx,ids.test.ts}`, `src/app/[locale]/(site)/careers/[slug]/__tests__/{apply.test.ts,detail.test.tsx}`; the existing `src/lib/seo/unbuilt.test.ts`, `src/lib/seo/sitemap-sources.test.ts`, `src/app/sitemap.test.ts`, `src/messages/{messages,voice}.test.ts`, `src/i18n/client-messages.test.ts`, `src/design/__tests__/{class-collisions,client-imports}.test.ts`, `src/design/blocks/__tests__/rsc-imports.test.ts` (all matched by `src/**/*.test.{ts,tsx}`)
- Playwright: `e2e/pages/careers.spec.ts` (both projects — its fixture-door half runs when `E2E_CAREERS_MOCK=1`), plus the existing loops in `e2e/routing.spec.ts`, `e2e/seo.spec.ts`, `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts` that pick the two index routes up from `e2e/routes.ts`

**Interfaces:**

Consumes (exact names, checked in the code):
- `@/content/adapter` — `getBundle(locale)`, `makeTf(bundle, locale)` (pages); `@/content/pure` — `makeTf` (sections' tests); `@/content/collections` — `getCollection(bundle, 'countries' | 'sourceCountries')`, types `SourceCountry`, `Country`
- `@/forms/action` — `createFormAction`, type `FormActionState`; `@/forms/types` — `FormActionError`, type `FormActionState`; `@/forms/wire` — type `WireFields`; `@/forms/errors` — `fieldErrorsFromIssues` (the apply tests); `@/forms/uploads` — `uploadCv(file, { field })`; `@/forms/env` — `doorBase(env?)`; `@/forms/client/FormShell` — `FormShell`; `@/forms/client/Field` — `Field`
- `@/design/primitives/Section` — `Section({ tone, id?, className? })`; `@/design/primitives/Eyebrow`; `@/design/primitives/Button` — `buttonClassName(variant, size?, className?)`; `@/design/primitives/RadioChips` — `RadioChips({ name, options, value, onChange, legend, legendHidden?, className? })`
- `@/design/blocks/Breadcrumbs` — `Breadcrumbs({ locale, items: Crumb[], tone? })` (emits the `BreadcrumbList`); `@/design/blocks/FaqBlock` — `FaqBlock({ bundle, locale, items, id?, eyebrowId?, headingId?, openFirst?, footer? })` (emits the `FAQPage`); `@/design/blocks/EmptyState` — `EmptyState({ title, body?, cta?, tone?, headingLevel?, testId? })`; `@/design/blocks/ContactCta` — `ContactCta({ placement, href, variant?, size?, external?, className?, children })`
- `@/design/Flag` — `Flag({ code, size?, label? })`; `@/design/assets/flag-codes` — `isFlagCode(code)`
- `@/analytics/ContactLink` — `ContactLink` (client); `@/analytics/track` — `track('career_apply_start', { page, locale, slug })` (`ALLOWED_PARAMS.career_apply_start = ['page','locale','slug']`, W26/W67)
- `@/i18n/navigation` — `Link`; `@/i18n/routing` — `routing`, type `Locale`
- `@/lib/contact` — `waLink(number, text)`, `mailLink(email, subject?)`; `@/lib/format/money` — `formatTRY`; `@/lib/format/date/formatDate` — `formatDate(iso, locale)` (by path, W156)
- `@/lib/seo/metadata` — `buildMetadata({ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription, alternates?, openGraph? })` (`openGraph.images` wins over the generated image); `@/lib/seo/routes` — `absoluteUrl`, `localeAlternates`, `pageOgImageUrl(locale, pageKey)`; `@/lib/seo/jsonld` — `jobPostingJsonLd`, type `JobPostingJsonLdInput`; `@/lib/seo/JsonLdScript` — `JsonLd`; `@/lib/seo/sitemap-sources` — `DETAIL_SITEMAP_SOURCES`, type `SitemapSource`
- `@/test/bundle` — `testBundle`; `@/test/render` — `renderWithIntl`
- `scripts/gate-routes.mjs` (W93), `e2e/routes.ts` `GATE_ROUTE_TABLE`

Produces (later tasks rely on these):
- `src/lib/careers.ts` — `listOpenings()`, `getOpening(slug)`, `OpeningsUnavailableError`; `src/lib/careers-pure.ts` — `PublicOpeningSchema`, `PORTFOLIO_GATE_RELAXED` (the one-line W56 flip); `src/lib/careers-sitemap.ts` — `careersSitemapSource` (registered in `DETAIL_SITEMAP_SOURCES`)
- For T14 (forms on `staging`): the apply form is `form[data-form-key="careers"]` with `data-testid="careers-apply-form"` inside `#apply` (`data-testid="careers-detail-apply"`); the portfolio branch is `data-testid="careers-email-apply"`; the country select offers only the opening's country, so T14's "apply with another country" case is "not reachable from the UI".
- For T15 (Gate A): `npm run careers:door` (the fixture door on `127.0.0.1:8481`) and `npm run e2e:careers` (the careers spec's fixture half against a server built and started with `OPS_API_URL=http://127.0.0.1:8481`) — the W93/W112 detail evidence when a gate face has no live opening.

**Rulings applied:**
- **W1** — no count typed into copy: the pill and "See N" are ICU over the live list; the chips are `sourceCountries` (D17).
- **W3** — the speculative application is WhatsApp + e-mail only (no form, no key); the per-opening apply is `careers` with a PDF CV, the PK salary rule and the portfolio branch.
- **W6** — no door / no opening → `EmptyState` (`sys.careers.empty.*`); the count pill and the hero card render nothing.
- **W8/W89** — no link to operations.jobsadmire.com anywhere; `jt.047`, `jt.085`, `jt.105`–`107` omitted (unit + e2e assert no such href).
- **W9/W23** — every id-less string under `sys.careers.*` / `sys.seo.careers*`; package ids by exact id through `makeTf`.
- **W10** — ways cards static; the hero card's third and fourth roles hidden ≤ 900 px by `max-lg:hidden` (CSS, not conditional rendering).
- **W12/W26/W67** — `career_apply_start { page, locale, slug }` once per page view; contact clicks through `ContactLink`/`ContactCta` (`page_cta`, `form_fallback` in the panel); no other event.
- **W13 amended / W120 / W136 / W162** — one small SSR'd island on the index (`RolesList`), the forms kernel on the detail; the ledger records `npm run js-size`; a LOCAL route figure ≥ 191,724 B (the binding 194,560 B minus the ≈ 2,836 B the preview's `npm run js-size` runs above the local build) stops the task and reports, and no lazy cycle is written in advance (below).
- **W16 / W161** — `portfolioUrl` (catalog v1.1) sent when typed; the site's check is the door's `url` rule verbatim (scheme-less accepted, length on the normalised value) — never stricter, never looser.
- **W17 / D16** — the detail passes `alternates: { tr, en }` (the same Operations slug) to `buildMetadata`; `LanguageSwitcher`/`LanguageHint` read those hreflang tags; no CTA table edit.
- **W19** — both routes in `(site)`; `notFound()` lands in `(site)/not-found.tsx`.
- **W20** — `'/careers'` leaves `UNBUILT_PATHNAMES` with the index (Cycle 3), `'/careers/[slug]'` with the detail (Cycle 4).
- **W21 / W93 / W112** — two index rows in `GATE_ROUTE_TABLE`; detail rows only from `gate-routes.mjs`; the fixture door is the local detail evidence.
- **W31 / W70** — `careersSitemapSource` joins the frozen `DETAIL_SITEMAP_SOURCES` literal (no runtime push).
- **W40** — `country` is upper-case ISO-2 end to end (schema, select value, wire).
- **W56** — `portfolioRequired` openings render the apply-by-e-mail panel (`PORTFOLIO_GATE_RELAXED = false`); the action refuses them too.
- **W73 / W116** — CV ≤ 3 MB (`uploadCv`), the form's one file, uploaded inside its own action call.
- **W76 / W95** — no visitor data in any DOM href: the per-role and hero "Ask a question first" prefills carry only the opening's title and location (page data); the fallback panel composes its prefill on click.
- **W77** — wire values are keys/codes (`country` ISO-2, `openingSlug`, `expectedSalaryCurrency` ISO).
- **W79 / W102** — `consent: 'checkbox'`, no `consentLinkHref` (default `/privacy`); the FAQ footer shows `settings.careersEmail`, never `jt.114`.
- **W92** — previews are door-less; the index spec asserts the W6 contract either way and never submits to a real door.
- **W98** — the shared doc shapes: one `## Pages` row each, one ANALYTICS bullet, one CONTENT-MODEL bullet, the ledger row in T1's format.
- **W99** — runs after T10, before T12.
- **W108** — the locked country select is a `Field` (`defaultValue` + one option); nothing registers by hand.
- **W109** — breadcrumbs use this page's own ids: `jt.021` (Home), `jt.005` (Join Our Team).
- **W110** — the upload door's per-IP throttle is an Operations follow-up (recorded by Task 8); nothing to do here.
- **W113** — section test ids sit on inner `<div>`s; `Section`'s props are untouched.
- **W115** — the package ships no label for the apply form's fields (the design has no per-opening form), so every `Field` uses its `sys.form.labels.*` default.
- **W118** — no history rewrite.
- **W119 / W122 / W155** — no `hidden` beside an unprefixed display utility, no property set twice at one variant (`py-5 pr-6 pl-7`, not `px-6 pl-7`); a different face is a `Button` variant.
- **W121 / W152 / W158** — no `CTA_BY_PATHNAME` entry; `DEFAULT_CTAS` points at T2's `#request-form`; the e2e asserts the header CTA href.
- **W123 / W124 / W169** — the index's OG image is `/og/{locale}/careers.png` (CDN-cached); the detail passes that same image through `openGraph.images` and no `sys.seo.careersDetail.*` key exists (the OG route renders `sys.seo.<pageKey>.title` without arguments, so the per-opening title template lives at `sys.careers.detail.metaTitle`, never under `sys.seo.*`; a test pins `sys.seo.careersDetail` absent — W169, T12's blog-article pattern); the detail's own title/description win.
- **W125 / W130 / W134 / W147 / W156** — primitives, blocks and `formatDate` by module path in every module; no server module imports `@/analytics/useContactClick`; client modules import only types from `@/lib/careers-pure`.
- **W126** — one build, one start, one gate as the proof (Cycle 6).
- **W128a** — `text-text-tertiary`, never `text-muted`, for text.
- **W145** — LCP/performance are the medians of three DevTools-throttled runs; the named LCP element is confirmed from the Lighthouse report (Cycle 6).
- **W148** — `CLIENT_SYS` unchanged: `RolesList` receives resolved strings and two plain `{token}` templates read with `sys.raw`.
- **W150** — no D17 dated badge on either route; `revalidate = 300` is the openings floor.
- **W151** — an unknown slug answers 404 with Next's shell; the chrome appears after hydration (the e2e waits for it).
- **W154** — every new `sys.*` string names "JobsAdmire", never "we"/"biz" (`src/messages/voice.test.ts`); the visitor-voice WhatsApp prefills are first-person singular.
- **W176** — the PRD §11 "Not yet built" sentence decrements "3 of the 14 core pages" → "2 of the 14 core pages", anchored on T10's exact post-edit text with a stop-and-report guard (Cycle 4); T12 decrements from the "2" this task leaves.
- **W178** — `sys.form.hints.portfolioUrl` is rewritten in both locales to accept a scheme-less link (EN "A web address, e.g. behance.net/yourname." / TR "Bir web adresi, ör. behance.net/adiniz."), pinned by `copy.test.ts` (Cycle 2); `portfolioUrlProblem` already mirrors the door's scheme-less acceptance (W161).
- **R15** — the page's own copies of chrome strings (`jt.001`–`020`, `116`, `118`–`142`) are never rendered; **R28** — one failure class for the Operations feed (`OpeningsUnavailableError`, like `BundleUnavailableError`); **R35** — the analytics `page` is `next/navigation`'s pathname.
- **D13** (success → `/tesekkurler?form=careers`), **D15** (JobPosting on the detail only; token-bearing candidate pages stay on Operations and are not linked), **D17** (no invented date or number), **D23** (no fixture served), **D26** (one named LCP slot per page, never a placeholder — this page has no image slot).

---

#### Cycle 1 — the openings data layer: the contract schema and pure helpers, the server read under the `openings` tag (one failure class, R28), the test fixture; ARCHITECTURE § Freshness, INTEGRATIONS I6

- [ ] **Step 1: Write the failing tests**

`src/test/careers.ts` (a test helper, not a test file — the Vitest include is `*.test.{ts,tsx}`):

```ts
import { PublicOpeningSchema, type PublicOpening } from '@/lib/careers-pure';

/** One opening exactly as `GET /api/careers/openings[/:slug]` sends it (`shapePublicOpening`,
 *  Operations apps/backend/src/modules/careers-public/careers-public.service.ts): the
 *  Uzbekistan representative role, salary shown, posted 15 September 2026. */
export const OPENING_WIRE = {
  slug: 'country-representative-uzbekistan',
  title: 'Country Representative — Uzbekistan',
  country: 'UZ',
  city: 'Tashkent',
  cities: ['Tashkent'],
  category: 'COUNTRY_REPRESENTATIVE',
  employmentArrangement: 'PERMANENT',
  employmentArrangements: ['PERMANENT'],
  workMode: 'REMOTE',
  workModes: ['REMOTE'],
  description:
    'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.\n\nThe work:\n- Find and manage licensed partner agencies\n- Run first interviews\n\nThe profile:\n- A working network among agencies',
  salaryMin: '800',
  salaryMax: '1200',
  salaryCurrency: 'USD',
  salaryPayType: 'RANGE',
  salaryPeriod: 'MONTH',
  salaryVisible: true,
  payCurrency: 'USD',
  portfolioRequired: false,
  requiredLanguage: 'Uzbek',
  requiredLanguages: ['Uzbek', 'Russian', 'English'],
  postedAt: '2026-09-15T08:00:00.000Z',
};

export const OPENING: PublicOpening = PublicOpeningSchema.parse(OPENING_WIRE);

export const opening = (over: Partial<PublicOpening> = {}): PublicOpening => ({ ...OPENING, ...over });
```

`src/lib/careers-pure.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { OPENING, OPENING_WIRE, opening } from '@/test/careers';
import {
  baseSalaryOf,
  citiesOf,
  countryNameOf,
  descriptionBlocks,
  detailHref,
  employmentTypeOf,
  ENGAGEMENT_OF,
  formatMoney,
  isNewOpening,
  languagesOf,
  locationOf,
  OpeningDetailSchema,
  OpeningsPageSchema,
  parseOpenings,
  placeOf,
  PublicOpeningSchema,
  salaryCurrencyOf,
  salaryPartsOf,
  summaryOf,
  workModesOf,
} from './careers-pure';

describe('PublicOpeningSchema — the shapePublicOpening contract', () => {
  it('parses the wire shape unchanged', () => {
    expect(PublicOpeningSchema.parse(OPENING_WIRE)).toEqual(OPENING_WIRE);
  });

  it('upper-cases the country (W40) and defaults the arrays an older reader omits', () => {
    const legacy: Record<string, unknown> = { ...OPENING_WIRE, country: 'uz' };
    for (const key of ['cities', 'employmentArrangements', 'workModes', 'requiredLanguages'])
      delete legacy[key];
    const parsed = PublicOpeningSchema.parse(legacy);
    expect(parsed.country).toBe('UZ');
    expect([
      parsed.cities,
      parsed.employmentArrangements,
      parsed.workModes,
      parsed.requiredLanguages,
    ]).toEqual([[], [], [], []]);
  });

  it('accepts a hidden salary (Operations strips the numbers) and a null city, description and work mode', () => {
    const parsed = PublicOpeningSchema.parse({
      ...OPENING_WIRE,
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: null,
      salaryPayType: null,
      salaryPeriod: null,
      salaryVisible: false,
      city: null,
      description: null,
      workMode: null,
    });
    expect(parsed.salaryVisible).toBe(false);
    expect([parsed.salaryMin, parsed.city, parsed.description, parsed.workMode]).toEqual([
      null,
      null,
      null,
      null,
    ]);
  });

  it('refuses what the door would refuse or the page cannot render', () => {
    for (const bad of [
      { slug: 'Bad Slug' },
      { slug: '' },
      { category: 'INTERN' },
      { country: 'Turkey' },
      { postedAt: 'yesterday' },
      { workModes: ['OFFICE'] },
      { salaryMin: '1,200' },
    ]) {
      expect(
        PublicOpeningSchema.safeParse({ ...OPENING_WIRE, ...bad }).success,
        JSON.stringify(bad),
      ).toBe(false);
    }
  });
});

describe('the envelopes and parseOpenings', () => {
  it('a list page needs its data array and its meta block; a detail needs its data', () => {
    const meta = { total: 1, page: 1, limit: 50, totalPages: 1 };
    expect(OpeningsPageSchema.safeParse({ data: [OPENING_WIRE], meta }).success).toBe(true);
    expect(OpeningsPageSchema.safeParse({ data: [OPENING_WIRE] }).success).toBe(false);
    expect(OpeningsPageSchema.safeParse([OPENING_WIRE]).success).toBe(false);
    expect(OpeningDetailSchema.safeParse({ data: OPENING_WIRE }).success).toBe(true);
  });

  it('keeps the valid rows and reports each broken one — one bad opening never hides the others', () => {
    const reported: string[] = [];
    const rows = parseOpenings(
      [OPENING_WIRE, { ...OPENING_WIRE, slug: 'Bad Slug' }, { ...OPENING_WIRE, slug: 'second-role' }],
      (index, issue) => reported.push(`${index} ${issue}`),
    );
    expect(rows.map((r) => r.slug)).toEqual([OPENING.slug, 'second-role']);
    expect(reported).toHaveLength(1);
    expect(reported[0]).toMatch(/^1 slug/);
  });
});

describe('the design axes', () => {
  it('placeOf: Türkiye is the Antalya office, anywhere else is overseas', () => {
    expect(placeOf(opening({ country: 'TR' }))).toBe('office');
    expect(placeOf(OPENING)).toBe('overseas');
  });

  it('ENGAGEMENT_OF maps the four hiring categories onto the three design filters', () => {
    expect(ENGAGEMENT_OF).toEqual({
      FULL_TIME: 'fullTime',
      COUNTRY_REPRESENTATIVE: 'fullTime',
      FREELANCER: 'partTime',
      PROJECT_BASED: 'project',
    });
  });

  it('employmentTypeOf: the first İŞKUR arrangement it knows, else the hiring category', () => {
    expect(employmentTypeOf(OPENING)).toBe('FULL_TIME');
    expect(employmentTypeOf(opening({ employmentArrangements: ['HOURLY', 'PART_TIME'] }))).toBe(
      'PART_TIME',
    );
    expect(
      employmentTypeOf(opening({ employmentArrangements: [], employmentArrangement: 'contract' })),
    ).toBe('CONTRACTOR');
    expect(
      employmentTypeOf(
        opening({
          employmentArrangements: [],
          employmentArrangement: null,
          category: 'PROJECT_BASED',
        }),
      ),
    ).toBe('TEMPORARY');
    expect(
      employmentTypeOf(opening({ employmentArrangements: ['SEASONAL'], category: 'FREELANCER' })),
    ).toBe('CONTRACTOR');
  });

  it('isNewOpening: posted within 14 days of now', () => {
    const now = new Date('2026-09-20T00:00:00Z');
    expect(isNewOpening('2026-09-15T08:00:00.000Z', now)).toBe(true);
    expect(isNewOpening('2026-09-06T00:00:00.000Z', now)).toBe(true);
    expect(isNewOpening('2026-09-05T23:59:59.000Z', now)).toBe(false);
    expect(isNewOpening('not a date', now)).toBe(false);
  });

  it('detailHref is the typed next-intl href of one opening — the same slug in both locales', () => {
    expect(detailHref('x-role')).toEqual({ pathname: '/careers/[slug]', params: { slug: 'x-role' } });
  });
});

describe('the description', () => {
  it('summaryOf: the first paragraph, cut at a word with an ellipsis', () => {
    expect(summaryOf(OPENING.description)).toBe(
      'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.',
    );
    const cut = summaryOf('word '.repeat(60).trim(), 40);
    expect(cut.endsWith('…')).toBe(true);
    expect(cut.length).toBeLessThanOrEqual(41);
    expect(summaryOf(null)).toBe('');
  });

  it('descriptionBlocks: paragraphs, and consecutive "- " / "* " / "• " lines as one list — text, never HTML', () => {
    expect(descriptionBlocks(OPENING.description)).toEqual([
      {
        type: 'p',
        text: 'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.',
      },
      { type: 'p', text: 'The work:' },
      { type: 'ul', items: ['Find and manage licensed partner agencies', 'Run first interviews'] },
      { type: 'p', text: 'The profile:' },
      { type: 'ul', items: ['A working network among agencies'] },
    ]);
    expect(descriptionBlocks('• a\n* b\r\n- c')).toEqual([{ type: 'ul', items: ['a', 'b', 'c'] }]);
    expect(descriptionBlocks('<b>bold</b>')).toEqual([{ type: 'p', text: '<b>bold</b>' }]);
    expect(descriptionBlocks(null)).toEqual([]);
  });
});

describe('place, languages and pay', () => {
  const rows = [{ code: 'UZ', name: 'Özbekistan' }];

  it('countryNameOf: the countries collection, then Intl, then the code itself', () => {
    expect(countryNameOf('uz', rows, 'tr')).toBe('Özbekistan');
    expect(countryNameOf('PK', rows, 'en')).toBe('Pakistan');
    expect(countryNameOf('IN', rows, 'tr')).toBe('Hindistan');
    expect(countryNameOf('XY', rows, 'en')).toBe('XY');
  });

  it('citiesOf, locationOf, workModesOf and languagesOf read the arrays first, the legacy singles second', () => {
    expect(citiesOf(OPENING)).toBe('Tashkent');
    expect(locationOf(OPENING, 'Uzbekistan')).toBe('Tashkent · Uzbekistan');
    expect(locationOf(opening({ cities: ['Karachi', 'Lahore'] }), 'Pakistan')).toBe(
      'Karachi, Lahore · Pakistan',
    );
    expect(locationOf(opening({ cities: [], city: null }), 'India')).toBe('India');
    expect(workModesOf(opening({ workModes: [], workMode: 'HYBRID' }))).toEqual(['HYBRID']);
    expect(workModesOf(opening({ workModes: [], workMode: null }))).toEqual([]);
    expect(languagesOf(OPENING)).toEqual(['Uzbek', 'Russian', 'English']);
    expect(languagesOf(opening({ requiredLanguages: [], requiredLanguage: 'Urdu' }))).toEqual([
      'Urdu',
    ]);
  });

  it('salaryPartsOf: nothing when hidden, else the pay-type shape (Operations storage rule)', () => {
    expect(salaryPartsOf(opening({ salaryVisible: false }))).toBeNull();
    expect(salaryPartsOf(opening({ salaryCurrency: null }))).toBeNull();
    expect(salaryPartsOf(opening({ salaryMin: null, salaryMax: null }))).toBeNull();
    expect(salaryPartsOf(OPENING)).toEqual({
      kind: 'range',
      min: 800,
      max: 1200,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(salaryPartsOf(opening({ salaryPayType: 'STARTING', salaryMax: null }))).toEqual({
      kind: 'from',
      min: 800,
      max: null,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(salaryPartsOf(opening({ salaryPayType: 'MAXIMUM', salaryMin: null }))).toEqual({
      kind: 'upTo',
      min: null,
      max: 1200,
      currency: 'USD',
      period: 'MONTH',
    });
    expect(
      salaryPartsOf(
        opening({
          salaryPayType: 'EXACT',
          salaryMin: '45000',
          salaryMax: '45000',
          salaryCurrency: 'TRY',
        }),
      ),
    ).toEqual({ kind: 'exact', min: 45000, max: 45000, currency: 'TRY', period: 'MONTH' });
    expect(salaryPartsOf(opening({ salaryPayType: null, salaryMax: null }))?.kind).toBe('from');
    expect(salaryPartsOf(opening({ salaryPayType: null, salaryMin: null }))?.kind).toBe('upTo');
  });

  it('formatMoney: lira through formatTRY (D18), any other ISO code through Intl, whole units', () => {
    expect(formatMoney(38944, 'TRY', 'tr')).toBe('38.944 ₺');
    expect(formatMoney(38944, 'try', 'en')).toBe('₺38,944');
    expect(formatMoney(1200, 'USD', 'en')).toBe('$1,200');
    expect(formatMoney(1200, 'USD', 'tr')).toBe('$1.200');
    expect(formatMoney(150000, 'PKR', 'en').replace(/\s/g, ' ')).toBe('PKR 150,000');
    expect(formatMoney(5, 'USDX', 'en')).toBe('5 USDX');
  });

  it('baseSalaryOf: a MonetaryAmount for HOUR, MONTH and YEAR only — never a guessed figure (D17)', () => {
    expect(baseSalaryOf(OPENING)).toEqual({
      currency: 'USD',
      value: { min: 800, max: 1200 },
      unitText: 'MONTH',
    });
    expect(
      baseSalaryOf(opening({ salaryPayType: 'EXACT', salaryMin: '1000', salaryMax: '1000' })),
    ).toEqual({ currency: 'USD', value: 1000, unitText: 'MONTH' });
    expect(baseSalaryOf(opening({ salaryPeriod: 'WEEK' }))).toBeUndefined();
    expect(baseSalaryOf(opening({ salaryPeriod: null }))).toBeUndefined();
    expect(baseSalaryOf(opening({ salaryVisible: false }))).toBeUndefined();
  });

  it('salaryCurrencyOf: the opening pay currency, PKR for a Pakistan opening without one, else none', () => {
    expect(salaryCurrencyOf(OPENING)).toBe('USD');
    expect(salaryCurrencyOf(opening({ country: 'PK', payCurrency: null }))).toBe('PKR');
    expect(salaryCurrencyOf(opening({ payCurrency: null }))).toBeNull();
  });
});
```

`src/lib/careers.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OPENING_WIRE } from '@/test/careers';
import { getOpeningUncached, listOpeningsUncached, OpeningsUnavailableError } from './careers';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com/',
} as NodeJS.ProcessEnv;
const noDoor = { NODE_ENV: 'test', OPS_API_URL: '' } as NodeJS.ProcessEnv;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const listPage = (data: unknown[], page: number, totalPages: number) =>
  json({ data, meta: { total: data.length, page, limit: 50, totalPages } });

let fetchMock: ReturnType<typeof vi.fn>;
let deps: { fetch: typeof fetch; env: NodeJS.ProcessEnv };

beforeEach(() => {
  fetchMock = vi.fn();
  deps = { fetch: fetchMock as unknown as typeof fetch, env };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('listOpeningsUncached', () => {
  it('is an empty list, without a call, when no door is configured (a door-less preview)', async () => {
    expect(await listOpeningsUncached({ fetch: deps.fetch, env: noDoor })).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reads every page under the `openings` tag with the 300 s floor', async () => {
    fetchMock
      .mockResolvedValueOnce(listPage([OPENING_WIRE], 1, 2))
      .mockResolvedValueOnce(listPage([{ ...OPENING_WIRE, slug: 'second-role' }], 2, 2));
    const rows = await listOpeningsUncached(deps);
    expect(rows.map((r) => r.slug)).toEqual([OPENING_WIRE.slug, 'second-role']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://operations.example.com/api/careers/openings?page=1&limit=50',
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://operations.example.com/api/careers/openings?page=2&limit=50',
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      next: { tags: ['openings'], revalidate: 300 },
    });
  });

  it('stops after five pages even when the door claims more', async () => {
    for (let i = 1; i <= 6; i++)
      fetchMock.mockResolvedValueOnce(listPage([{ ...OPENING_WIRE, slug: `role-${i}` }], i, 99));
    expect(await listOpeningsUncached(deps)).toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('drops a row that breaks the contract, logs it, and keeps the rest', async () => {
    fetchMock.mockResolvedValueOnce(
      listPage([{ ...OPENING_WIRE, category: 'INTERN' }, { ...OPENING_WIRE, slug: 'kept' }], 1, 1),
    );
    expect((await listOpeningsUncached(deps)).map((r) => r.slug)).toEqual(['kept']);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('throws OpeningsUnavailableError — never an empty list — on a 5xx, a network error, a non-JSON body or a broken envelope (R28)', async () => {
    fetchMock.mockResolvedValueOnce(new Response('bad gateway', { status: 502 }));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockResolvedValueOnce(new Response('<html>login</html>', { status: 200 }));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockResolvedValueOnce(json([OPENING_WIRE]));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
  });
});

describe('getOpeningUncached', () => {
  it('reads one opening by its slug under the same tag and floor', async () => {
    fetchMock.mockResolvedValueOnce(json({ data: OPENING_WIRE }));
    const row = await getOpeningUncached(OPENING_WIRE.slug, deps);
    expect(row?.title).toBe(OPENING_WIRE.title);
    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://operations.example.com/api/careers/openings/${OPENING_WIRE.slug}`,
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      next: { tags: ['openings'], revalidate: 300 },
    });
  });

  it('is null for a 404 (unknown or closed), and without a call for a malformed slug or no door', async () => {
    fetchMock.mockResolvedValueOnce(json({ statusCode: 404, message: 'Opening not found' }, 404));
    expect(await getOpeningUncached('gone-role', deps)).toBeNull();
    expect(await getOpeningUncached('Not A Slug', deps)).toBeNull();
    expect(await getOpeningUncached('x', { fetch: deps.fetch, env: noDoor })).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws OpeningsUnavailableError on a 5xx, a network error or a contract violation — never a false 404', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 503 }));
    await expect(getOpeningUncached('x', deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(getOpeningUncached('x', deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockResolvedValueOnce(json({ data: { ...OPENING_WIRE, slug: 'Bad Slug' } }));
    await expect(getOpeningUncached('x', deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/lib/careers-pure.test.ts src/lib/careers.test.ts
```

Expected: both files FAIL to import — `Cannot find module '@/lib/careers-pure'` (through `@/test/careers`) and `'./careers'`.

- [ ] **Step 3: Implement**

`src/lib/careers-pure.ts`:

```ts
// Client-safe — no `server-only`, no fetch, no message catalogue: the public-opening contract
// exactly as the Operations careers-public module emits it (`shapePublicOpening`,
// apps/backend/src/modules/careers-public/careers-public.service.ts) and the pure helpers both
// careers routes share. The server read lives in `./careers.ts`. A client module imports TYPES
// from here only (erased at compile time), so zod never reaches a careers island.
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import { formatTRY } from '@/lib/format/money';
import type { JobPostingJsonLdInput } from '@/lib/seo/jsonld';

/** Spec §3.1's reserved ISR tag and the openings time floor (docs/ARCHITECTURE.md § Freshness). */
export const OPENINGS_TAG = 'openings';
export const OPENINGS_REVALIDATE_SECONDS = 300;
/** `QueryPublicOpeningsDto` caps `limit` at 50; five pages bound a runaway `totalPages`. */
export const OPENINGS_PAGE_LIMIT = 50;
export const OPENINGS_MAX_PAGES = 5;
/** The API has no `isNew`: a role posted within this many days wears the design's "New" badge. */
export const NEW_WITHIN_DAYS = 14;
/** W56: an opening with `portfolioRequired` still needs an uploaded portfolio DOCUMENT the
 *  website door cannot carry — the door answers 200 + FAILED "This position requires at least
 *  one portfolio document" — so the detail page renders the apply-by-e-mail panel for it and
 *  the action refuses it. Flip to `true` once Operations lets `portfolioUrl` (catalog v1.1,
 *  already sent) satisfy the gate; nothing else changes. */
export const PORTFOLIO_GATE_RELAXED = false;
/** The door's `openingSlug` rule (catalog `careers`: ≤ 200, `/^[a-z0-9-]+$/`). */
export const OPENING_SLUG_RE = /^[a-z0-9-]{1,200}$/;

export const OPENING_CATEGORIES = [
  'FULL_TIME',
  'FREELANCER',
  'PROJECT_BASED',
  'COUNTRY_REPRESENTATIVE',
] as const;
export type OpeningCategory = (typeof OPENING_CATEGORIES)[number];
export const WORK_MODES = ['REMOTE', 'HYBRID', 'ON_SITE'] as const;
export type WorkMode = (typeof WORK_MODES)[number];
export const SALARY_PAY_TYPES = ['RANGE', 'STARTING', 'MAXIMUM', 'EXACT'] as const;
export const SALARY_PERIODS = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] as const;
export type SalaryPeriod = (typeof SALARY_PERIODS)[number];

/** Prisma returns `null`, and an older reader may omit a key: both read as `null`. */
const nullableString = z
  .string()
  .nullish()
  .transform((v) => v ?? null);
/** Prisma decimals arrive as strings (`salaryMin?.toString()`). */
const decimalString = z
  .string()
  .regex(/^\d+(\.\d+)?$/)
  .nullish()
  .transform((v) => v ?? null);

export const PublicOpeningSchema = z.object({
  slug: z.string().regex(OPENING_SLUG_RE),
  title: z.string().trim().min(1),
  // `Country.code` — upper-case ISO-2 (W40); a legacy free-text country fails the row.
  country: z
    .string()
    .regex(/^[A-Za-z]{2}$/)
    .transform((v) => v.toUpperCase()),
  city: nullableString,
  cities: z.array(z.string()).default([]),
  category: z.enum(OPENING_CATEGORIES),
  employmentArrangement: nullableString,
  employmentArrangements: z.array(z.string()).default([]),
  workMode: z
    .enum(WORK_MODES)
    .nullish()
    .transform((v) => v ?? null),
  workModes: z.array(z.enum(WORK_MODES)).default([]),
  description: nullableString,
  salaryMin: decimalString,
  salaryMax: decimalString,
  salaryCurrency: nullableString,
  salaryPayType: z
    .enum(SALARY_PAY_TYPES)
    .nullish()
    .transform((v) => v ?? null),
  salaryPeriod: z
    .enum(SALARY_PERIODS)
    .nullish()
    .transform((v) => v ?? null),
  salaryVisible: z.boolean(),
  payCurrency: nullableString,
  portfolioRequired: z.boolean(),
  requiredLanguage: nullableString,
  requiredLanguages: z.array(z.string()).default([]),
  postedAt: z.string().datetime({ offset: true }),
});
export type PublicOpening = z.infer<typeof PublicOpeningSchema>;

/** `GET /api/careers/openings`: the envelope; its rows are checked one by one (`parseOpenings`). */
export const OpeningsPageSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});
/** `GET /api/careers/openings/:slug`. */
export const OpeningDetailSchema = z.object({ data: z.unknown() });

/** The rows that honour the contract. A malformed row is reported and left out — one broken
 *  opening must never take the whole list down (the spirit of R28's `getCollection` rule). */
export function parseOpenings(
  rows: readonly unknown[],
  onInvalid: (index: number, issue: string) => void = () => {},
): PublicOpening[] {
  const out: PublicOpening[] = [];
  rows.forEach((row, index) => {
    const parsed = PublicOpeningSchema.safeParse(row);
    if (parsed.success) out.push(parsed.data);
    else {
      const issue = parsed.error.issues[0];
      onInvalid(index, `${issue?.path.join('.')}: ${issue?.message}`);
    }
  });
  return out;
}

/** The typed next-intl href of one opening's detail page — the same slug in both locales. */
export const detailHref = (slug: string) => ({
  pathname: '/careers/[slug]' as const,
  params: { slug },
});

/** The design's "Where" axis: Türkiye = the Antalya office, anywhere else = overseas. */
export type Place = 'office' | 'overseas';
export const placeOf = (o: Pick<PublicOpening, 'country'>): Place =>
  o.country === 'TR' ? 'office' : 'overseas';

/** The design's "Engagement" axis over Operations' four hiring categories. */
export type Engagement = 'fullTime' | 'partTime' | 'project';
export const ENGAGEMENT_OF: Record<OpeningCategory, Engagement> = {
  FULL_TIME: 'fullTime',
  COUNTRY_REPRESENTATIVE: 'fullTime',
  FREELANCER: 'partTime',
  PROJECT_BASED: 'project',
};

type EmploymentType = JobPostingJsonLdInput['employmentType'];
/** İŞKUR arrangement codes (Operations' admin-managed `EmploymentType.code`) → Google's enum. */
const ARRANGEMENT_EMPLOYMENT: Record<string, EmploymentType> = {
  PERMANENT: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACTOR',
  FREELANCER: 'CONTRACTOR',
  INTERNSHIP: 'INTERN',
};
const CATEGORY_EMPLOYMENT: Record<OpeningCategory, EmploymentType> = {
  FULL_TIME: 'FULL_TIME',
  COUNTRY_REPRESENTATIVE: 'FULL_TIME',
  FREELANCER: 'CONTRACTOR',
  PROJECT_BASED: 'TEMPORARY',
};

/** schema.org `JobPosting.employmentType`: the first arrangement code this map knows (codes are
 *  admin-managed, so an unknown one falls through), else the hiring category. */
export function employmentTypeOf(
  o: Pick<PublicOpening, 'employmentArrangements' | 'employmentArrangement' | 'category'>,
): EmploymentType {
  const codes = o.employmentArrangements.length
    ? o.employmentArrangements
    : o.employmentArrangement
      ? [o.employmentArrangement]
      : [];
  for (const code of codes) {
    const type = ARRANGEMENT_EMPLOYMENT[code.toUpperCase()];
    if (type) return type;
  }
  return CATEGORY_EMPLOYMENT[o.category];
}

export function isNewOpening(postedAt: string, now: Date, days = NEW_WITHIN_DAYS): boolean {
  const t = Date.parse(postedAt);
  return !Number.isNaN(t) && now.getTime() - t <= days * 86_400_000;
}

const BULLET = /^\s*[-*•]\s+/;
const unixLines = (text: string) => text.replace(/\r\n?/g, '\n');

/** The first paragraph of the description, cut at a word boundary to `max` characters. */
export function summaryOf(description: string | null, max = 160): string {
  if (!description) return '';
  const first =
    unixLines(description)
      .split(/\n\s*\n/)
      .map((p) => p.replace(BULLET, '').replace(/\s+/g, ' ').trim())
      .find((p) => p.length > 0) ?? '';
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${(at > max / 2 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

export type DescriptionBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

/** The opening's one description (Operations folded the requirements into it) as paragraphs and
 *  bullet lists — plain text rendered by React, never HTML. */
export function descriptionBlocks(text: string | null): DescriptionBlock[] {
  if (!text) return [];
  const out: DescriptionBlock[] = [];
  for (const line of unixLines(text).split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, '').trim();
      const last = out[out.length - 1];
      if (last?.type === 'ul') last.items.push(item);
      else out.push({ type: 'ul', items: [item] });
    } else {
      out.push({ type: 'p', text: trimmed });
    }
  }
  return out;
}

/** The `countries` collection's localized name first, Intl's region name second, the code last. */
export function countryNameOf(
  code: string,
  countries: ReadonlyArray<{ code: string; name: string }>,
  locale: Locale,
): string {
  const upper = code.toUpperCase();
  const row = countries.find((c) => c.code === upper);
  if (row) return row.name;
  try {
    const name = new Intl.DisplayNames([locale], { type: 'region' }).of(upper);
    if (name) return name;
  } catch {
    // not a region code Intl knows — fall through to the code itself
  }
  return upper;
}

export const citiesOf = (o: Pick<PublicOpening, 'city' | 'cities'>): string =>
  o.cities.length ? o.cities.join(', ') : (o.city ?? '');

export const locationOf = (o: Pick<PublicOpening, 'city' | 'cities'>, countryName: string) =>
  [citiesOf(o), countryName].filter((part) => part.length > 0).join(' · ');

export const workModesOf = (o: Pick<PublicOpening, 'workMode' | 'workModes'>): WorkMode[] =>
  o.workModes.length ? o.workModes : o.workMode ? [o.workMode] : [];

export const languagesOf = (
  o: Pick<PublicOpening, 'requiredLanguage' | 'requiredLanguages'>,
): string[] =>
  o.requiredLanguages.length ? o.requiredLanguages : o.requiredLanguage ? [o.requiredLanguage] : [];

type SalaryFields = Pick<
  PublicOpening,
  'salaryVisible' | 'salaryMin' | 'salaryMax' | 'salaryCurrency' | 'salaryPayType' | 'salaryPeriod'
>;

export type SalaryParts = {
  kind: 'range' | 'from' | 'upTo' | 'exact';
  min: number | null;
  max: number | null;
  currency: string;
  period: SalaryPeriod | null;
};

/** Null unless the opening shows its pay (Operations strips the numbers when it does not).
 *  Storage rule (schema.prisma `SalaryPayType`): EXACT writes both bounds, STARTING the minimum,
 *  MAXIMUM the maximum; a row without a pay type is read from the bounds it has. */
export function salaryPartsOf(o: SalaryFields): SalaryParts | null {
  if (!o.salaryVisible || !o.salaryCurrency) return null;
  const min = o.salaryMin === null ? null : Number(o.salaryMin);
  const max = o.salaryMax === null ? null : Number(o.salaryMax);
  if (min === null && max === null) return null;
  const base = { currency: o.salaryCurrency.toUpperCase(), period: o.salaryPeriod };
  if (o.salaryPayType === 'EXACT' || (min !== null && min === max)) {
    const value = min ?? max;
    return { ...base, kind: 'exact', min: value, max: value };
  }
  if (
    min !== null &&
    max !== null &&
    o.salaryPayType !== 'STARTING' &&
    o.salaryPayType !== 'MAXIMUM'
  )
    return { ...base, kind: 'range', min, max };
  if (max !== null && (o.salaryPayType === 'MAXIMUM' || min === null))
    return { ...base, kind: 'upTo', min: null, max };
  return { ...base, kind: 'from', min, max: null };
}

const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

/** D18 for lira (`formatTRY`); Intl's currency style for every other ISO code; whole units. */
export function formatMoney(amount: number, currency: string, locale: Locale): string {
  const code = currency.toUpperCase();
  if (code === 'TRY') return formatTRY(amount, locale);
  const whole = Math.round(amount);
  try {
    return new Intl.NumberFormat(INTL[locale], {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(whole);
  } catch {
    // Not an ISO currency Intl accepts: the number and the code as stored, never a guessed symbol.
    return `${new Intl.NumberFormat(INTL[locale], { maximumFractionDigits: 0 }).format(whole)} ${code}`;
  }
}

const UNIT_TEXT: Partial<Record<SalaryPeriod, 'HOUR' | 'MONTH' | 'YEAR'>> = {
  HOUR: 'HOUR',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

/** `JobPosting.baseSalary` — only for the periods schema.org's `unitText` names that Google
 *  reads here; DAY/WEEK, no period or a hidden salary → no node (never a guessed figure, D17). */
export function baseSalaryOf(o: SalaryFields): JobPostingJsonLdInput['baseSalary'] {
  const parts = salaryPartsOf(o);
  const unitText = parts?.period ? UNIT_TEXT[parts.period] : undefined;
  if (!parts || !unitText) return undefined;
  if (parts.kind === 'range' && parts.min !== null && parts.max !== null)
    return { currency: parts.currency, value: { min: parts.min, max: parts.max }, unitText };
  const single = parts.min ?? parts.max;
  return single === null ? undefined : { currency: parts.currency, value: single, unitText };
}

/** The currency an expected salary is quoted in: the opening's pay currency (Operations resolves
 *  it the same way); PKR for a Pakistan opening without one (the salary is compulsory there —
 *  owner rule 2026-07-23); otherwise none. */
export function salaryCurrencyOf(o: Pick<PublicOpening, 'payCurrency' | 'country'>): string | null {
  if (o.payCurrency) return o.payCurrency.toUpperCase();
  return o.country === 'PK' ? 'PKR' : null;
}
```

`src/lib/careers.ts`:

```ts
import 'server-only';
import { cache } from 'react';
import { doorBase } from '@/forms/env';
import {
  OPENING_SLUG_RE,
  OpeningDetailSchema,
  OPENINGS_MAX_PAGES,
  OPENINGS_PAGE_LIMIT,
  OPENINGS_REVALIDATE_SECONDS,
  OPENINGS_TAG,
  OpeningsPageSchema,
  parseOpenings,
  PublicOpeningSchema,
  type PublicOpening,
} from './careers-pure';

/**
 * The public careers API answered with something other than openings or a 404: an HTTP error, a
 * network failure, a body that is not JSON, a broken envelope (R28 — one class, one path, like
 * `BundleUnavailableError`). Thrown, never swallowed: during an ISR revalidation Next keeps
 * serving the last good page and retries on the next request, so an Operations outage never
 * replaces live openings with the empty state or drops them from the sitemap. A
 * door-configured BUILD (staging, production) fails loudly instead — docs/ARCHITECTURE.md
 * § Freshness.
 */
export class OpeningsUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpeningsUnavailableError';
  }
}

/** Tests inject both; production reads the real `fetch` and `process.env`. */
export type CareersDeps = { fetch?: typeof fetch; env?: NodeJS.ProcessEnv };

// Spec §3.1's reserved tag and the 300 s floor (D8) on every openings read. A publish/close
// reaches the site early only if Operations sends the tag to `/api/revalidate` (I2); the floor
// bounds the staleness either way.
const NEXT = { tags: [OPENINGS_TAG], revalidate: OPENINGS_REVALIDATE_SECONDS };
const HEADERS = { accept: 'application/json' };

const reason = (err: unknown) => (err instanceof Error ? err.message : String(err));

async function get(f: typeof fetch, url: string, what: string): Promise<Response> {
  try {
    return await f(url, { headers: HEADERS, next: NEXT });
  } catch (err) {
    throw new OpeningsUnavailableError(`${what}: ${reason(err)}`);
  }
}

async function body(res: Response, what: string): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    // An HTML error or login page served with a 200 is the same outage as a 500 (R28).
    throw new OpeningsUnavailableError(`${what}: the body is not JSON`);
  }
}

export async function listOpeningsUncached(deps: CareersDeps = {}): Promise<PublicOpening[]> {
  const base = doorBase(deps.env);
  // No door here (a door-less preview, a local build, the unit suite): no openings is the truth.
  if (!base) return [];
  const f = deps.fetch ?? fetch;
  const out: PublicOpening[] = [];
  for (let page = 1; page <= OPENINGS_MAX_PAGES; page++) {
    const what = `openings page ${page}`;
    const res = await get(
      f,
      `${base}/api/careers/openings?page=${page}&limit=${OPENINGS_PAGE_LIMIT}`,
      what,
    );
    if (!res.ok) throw new OpeningsUnavailableError(`${what}: HTTP ${res.status}`);
    const envelope = OpeningsPageSchema.safeParse(await body(res, what));
    if (!envelope.success)
      throw new OpeningsUnavailableError(
        `${what}: contract violation at ${envelope.error.issues[0]?.path.join('.')}`,
      );
    out.push(
      ...parseOpenings(envelope.data.data, (index, issue) =>
        console.error('[careers] an opening broke the contract and was left out', {
          page,
          index,
          issue,
        }),
      ),
    );
    if (page >= envelope.data.meta.totalPages) break;
  }
  return out;
}

export async function getOpeningUncached(
  slug: string,
  deps: CareersDeps = {},
): Promise<PublicOpening | null> {
  // A slug the door would refuse is not an opening — no call, a 404 page.
  if (!OPENING_SLUG_RE.test(slug)) return null;
  const base = doorBase(deps.env);
  if (!base) return null;
  const f = deps.fetch ?? fetch;
  const what = `opening ${slug}`;
  const res = await get(f, `${base}/api/careers/openings/${slug}`, what);
  // Unknown, closed or unlisted: the one answer that is a real 404.
  if (res.status === 404) return null;
  if (!res.ok) throw new OpeningsUnavailableError(`${what}: HTTP ${res.status}`);
  const envelope = OpeningDetailSchema.safeParse(await body(res, what));
  const row = envelope.success ? PublicOpeningSchema.safeParse(envelope.data.data) : null;
  if (!row?.success) throw new OpeningsUnavailableError(`${what}: contract violation`);
  return row.data;
}

/** One read per request (React `cache`) — the page, its metadata, `generateStaticParams`, the
 *  sitemap source and the apply action share it; across requests Next's data cache answers
 *  under the `openings` tag. */
export const listOpenings = cache((): Promise<PublicOpening[]> => listOpeningsUncached());
export const getOpening = cache(
  (slug: string): Promise<PublicOpening | null> => getOpeningUncached(slug),
);
```

`docs/ARCHITECTURE.md` — in `## Freshness: ISR tags and time floors (D8)`, directly after the paragraph that begins "The representatives single-record view is the one exception…" (the last paragraph before `## Forms flow (D11)`), insert:

```markdown
**Careers openings (WP2b T11, I6).** `src/lib/careers.ts` (`server-only`) reads `GET ${OPS_API_URL}/api/careers/openings?page=<n>&limit=50` (at most five pages) and `GET …/api/careers/openings/<slug>` with `next: { tags: ['openings'], revalidate: 300 }` and React-`cache`s both per request; every row is checked against `PublicOpeningSchema` (`src/lib/careers-pure.ts`, the exact `shapePublicOpening` shape) and a malformed row is logged and left out, never the whole list. Without `OPS_API_URL` — every door-less preview (W92), a local build, the unit suite — the list is `[]` and a detail `null`, without a call: the index shows its W6 empty state, the detail route 404s, the sitemap lists no opening. A detail's 404 is `notFound()`. Every other failure — an HTTP error, a network error, a body that is not JSON, a broken envelope — throws `OpeningsUnavailableError` (R28's one-class rule, like `BundleUnavailableError`): during an ISR revalidation Next keeps serving the last good page and retries on the next request, so an Operations outage never swaps live openings for the empty state or drops them from the sitemap; a cold on-demand render shows the `(site)` error boundary; a door-configured **build** (staging, production) fails loudly instead, exactly like `CONTENT_SOURCE=OPS` with an unreachable bundle. `/careers/[slug]` prerenders the current slugs (`generateStaticParams` — the slug is the same in both locales), renders a later one on demand (`dynamicParams`), and both careers routes `revalidate = 300`. `POST /api/careers/upload-cv` is called only from the apply server action (`uploadCv`), never from the browser.
```

`docs/INTEGRATIONS.md` — replace the body paragraph under `## I6 — Openings list/detail` (the one beginning "**Direction:** Ops → Website (proxy).") with:

```markdown
**Direction:** Ops → Website, read server-side only (never from the browser, D6). **Auth:** none (public data). **Shape (as built, WP2b T11 — `careers-public.controller.ts`/`.service.ts`):** `GET /api/careers/openings?page&limit` (`limit` ≤ 50, default 20) → `{ data: PublicOpening[], meta: { total, page, limit, totalPages } }` — only `OPEN` + `isPubliclyListed` + slugged openings, newest first; `GET /api/careers/openings/:slug` → `{ data: PublicOpening }` or 404 `Opening not found` (a closed opening too). `PublicOpening` = `{ slug, title, country (ISO-2 Country.code), city, cities[], category (FULL_TIME | FREELANCER | PROJECT_BASED | COUNTRY_REPRESENTATIVE), employmentArrangement, employmentArrangements[] (EmploymentType codes), workMode, workModes[] (REMOTE | HYBRID | ON_SITE), description (one text), salaryMin/salaryMax (decimal strings), salaryCurrency, salaryPayType, salaryPeriod — all five null when salaryVisible is false —, salaryVisible, payCurrency (shown even when the salary is hidden), portfolioRequired, requiredLanguage, requiredLanguages[], postedAt }`, pinned by `PublicOpeningSchema` (`src/lib/careers-pure.ts`). **Freshness:** ISR tag `openings`, 300 s floor (`docs/ARCHITECTURE.md` § Freshness). **Failure/degraded:** a malformed row is dropped and logged; any other failure throws `OpeningsUnavailableError` and ISR keeps the last good page (a door-configured build fails instead); no `OPS_API_URL` = no openings (the W6 empty state, no detail page, no sitemap entry). The gate derives its careers detail rows from the same list (W93, `scripts/gate-routes.mjs`).
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write src/lib/careers-pure.ts src/lib/careers.ts src/lib/careers-pure.test.ts src/lib/careers.test.ts src/test/careers.ts docs/ARCHITECTURE.md docs/INTEGRATIONS.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — the two new files (19 + 8 cases) and the whole existing suite; `careers.ts`'s `server-only` resolves to the Vitest alias (`src/test/server-only.ts`), and React's `cache` is a pass-through outside a server render.

- [ ] **Step 5: Commit**

```bash
git add src/lib/careers-pure.ts src/lib/careers.ts src/lib/careers-pure.test.ts src/lib/careers.test.ts src/test/careers.ts docs/ARCHITECTURE.md docs/INTEGRATIONS.md
git commit -m "feat(careers): openings data layer — the shapePublicOpening contract, pure helpers, the server read under the openings tag (T11 c1)

Server-only read of the Operations public careers API with next.tags ['openings'] and the
300 s floor (spec §3.1, D8); no OPS_API_URL = no openings, without a call (W92); any other
failure throws OpeningsUnavailableError so ISR keeps the last good page (R28); a malformed row
is dropped, never the list. Docs: ARCHITECTURE § Freshness, INTEGRATIONS I6 as built.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the copy and the index view model: `sys.careers.*`, `sys.seo.careers*`, the careers thank-you line; `roleCards`/`heroRoles`; CONTENT-MODEL

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/careers/__tests__/copy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

const leaves = (o: unknown, prefix = ''): [string, string][] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
        leaves(v, prefix ? `${prefix}.${k}` : k),
      )
    : [[prefix, String(o)]];

/** Every `sys.*` key this task adds (W9/W23): the careers namespace and the SEO fallbacks. */
const EXPECTED = [
  'seo.careers.title',
  'seo.careers.description',
  'careers.hero.hiringCount',
  'careers.hero.seeOpenings',
  'careers.filters.all',
  'careers.roles.resultAll',
  'careers.roles.resultFiltered',
  'careers.roles.showMore',
  'careers.roles.posted',
  'careers.workMode.REMOTE',
  'careers.workMode.HYBRID',
  'careers.workMode.ON_SITE',
  'careers.salary.range',
  'careers.salary.from',
  'careers.salary.upTo',
  'careers.salary.per.HOUR',
  'careers.salary.per.DAY',
  'careers.salary.per.WEEK',
  'careers.salary.per.MONTH',
  'careers.salary.per.YEAR',
  'careers.empty.title',
  'careers.empty.body',
  'careers.apply.whatsapp',
  'careers.apply.emailSubject',
  'careers.detail.metaTitle',
  'careers.detail.metaDescription',
  'careers.detail.about',
  'careers.detail.back',
  'careers.detail.applyLead',
  'careers.detail.whatsappIntro',
  'careers.detail.facts.title',
  'careers.detail.facts.location',
  'careers.detail.facts.workMode',
  'careers.detail.facts.languages',
  'careers.detail.facts.salary',
  'careers.detail.facts.posted',
  'careers.form.residency',
  'careers.form.expectedSalaryHint',
  'careers.form.closed',
  'careers.form.portfolioGate',
  'careers.emailPanel.title',
  'careers.emailPanel.body',
  'careers.emailPanel.subject',
  'careers.emailPanel.email',
];

const LOCALES = { en: en.sys, tr: tr.sys };
const careersKeys = (sys: unknown) =>
  new Map(
    leaves(sys).filter(([key]) => key.startsWith('careers.') || key.startsWith('seo.careers')),
  );

describe('sys.careers.* and sys.seo.careers* (W9/W23)', () => {
  it('both locales carry exactly this key set, and no value is empty', () => {
    expect(EXPECTED).toHaveLength(44);
    for (const [locale, sys] of Object.entries(LOCALES)) {
      const keys = careersKeys(sys);
      expect([...keys.keys()].sort(), locale).toEqual([...EXPECTED].sort());
      for (const [key, value] of keys) expect(value, `${locale} ${key}`).toMatch(/\S/);
    }
  });

  it('every template carries its arguments in both locales', () => {
    const ARGS: Record<string, string[]> = {
      'careers.hero.hiringCount': ['{count'],
      'careers.hero.seeOpenings': ['{count, plural,'],
      'careers.roles.resultAll': ['{count, plural,'],
      'careers.roles.resultFiltered': ['{shown}', '{total}'],
      'careers.roles.showMore': ['{count}'],
      'careers.roles.posted': ['{date}'],
      'careers.salary.range': ['{min}', '{max}'],
      'careers.salary.from': ['{amount}'],
      'careers.salary.upTo': ['{amount}'],
      'careers.detail.metaTitle': ['{title}'],
      'careers.detail.metaDescription': ['{title}', '{location}'],
      'careers.detail.whatsappIntro': ['{title}'],
      'careers.form.residency': ['{country}'],
      'careers.form.expectedSalaryHint': ['{currency}'],
      'careers.emailPanel.body': ['{email}'],
      'careers.emailPanel.subject': ['{title}'],
    };
    for (const [locale, sys] of Object.entries(LOCALES)) {
      const keys = careersKeys(sys);
      for (const [key, args] of Object.entries(ARGS))
        for (const arg of args) expect(keys.get(key), `${locale} ${key}`).toContain(arg);
    }
  });

  it('the two island templates are plain {token} strings — RolesList fills them itself (W148)', () => {
    for (const sys of Object.values(LOCALES)) {
      expect(sys.careers.roles.resultFiltered).not.toContain('plural');
      expect(sys.careers.roles.showMore).not.toContain('plural');
    }
  });

  it('the OG route reads sys.seo.<pageKey>.title without values: the index title is argument-free and the template page has no sys.seo key at all (W169, T12 pattern)', () => {
    for (const sys of Object.values(LOCALES)) {
      expect(sys.seo.careers.title).not.toContain('{');
      // W169: the detail's OG image is the index's /og/<locale>/careers.png (openGraph.images) and
      // its title template is sys.careers.detail.metaTitle; a `sys.seo.careersDetail.title` would
      // be drawn raw — `{title}` — on /og/<locale>/careersDetail.png.
      expect('careersDetail' in sys.seo).toBe(false);
    }
  });

  it('the careers thank-you line fits a per-opening application (D13)', () => {
    expect(en.sys.thankYou.forms.careers).not.toMatch(/suitable role opens/);
    expect(tr.sys.thankYou.forms.careers).not.toMatch(/pozisyon açıldığında/);
  });

  it('the portfolio hint accepts a scheme-less link — the door adds https:// itself (W178, W161)', () => {
    expect(en.sys.form.hints.portfolioUrl).toBe('A web address, e.g. behance.net/yourname.');
    expect(tr.sys.form.hints.portfolioUrl).toBe('Bir web adresi, ör. behance.net/adiniz.');
    for (const sys of Object.values(LOCALES)) {
      expect(sys.form.hints.portfolioUrl).not.toContain('https://');
    }
  });
});
```

`src/app/[locale]/(site)/careers/__tests__/roles.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { OPENING, opening } from '@/test/careers';
import { heroRoles, roleCards, type RoleCopy } from '../_lib/roles';

const copy: RoleCopy = {
  engagement: { fullTime: 'Full-time', partTime: 'Part-time', project: 'Project-based' },
  workMode: { REMOTE: 'Remote', HYBRID: 'Hybrid', ON_SITE: 'On site' },
  posted: (date) => `Posted ${date}`,
  askIntro: 'Hello JobsAdmire, I have a question about the',
  askTail: 'role (',
};
const countries = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'TR', name: 'Türkiye' },
];
const ctx = {
  locale: 'en' as const,
  countries,
  copy,
  whatsappNumber: '905011240340',
  now: new Date('2026-09-20T00:00:00Z'),
};

describe('roleCards', () => {
  it('maps an opening onto plain, serialisable strings and typed hrefs — nothing else crosses to the island', () => {
    const [card] = roleCards([OPENING], ctx);
    const href = { pathname: '/careers/[slug]', params: { slug: OPENING.slug } };
    expect(card).toEqual({
      slug: OPENING.slug,
      title: 'Country Representative — Uzbekistan',
      summary: 'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.',
      location: 'Tashkent · Uzbekistan',
      workModes: 'Remote',
      place: 'overseas',
      engagement: 'fullTime',
      engagementLabel: 'Full-time',
      isNew: true,
      posted: 'Posted 15 September 2026',
      href,
      applyHref: { ...href, hash: '#apply' },
      askHref: `https://wa.me/905011240340?text=${encodeURIComponent(
        'Hello JobsAdmire, I have a question about the Country Representative — Uzbekistan role (Tashkent · Uzbekistan)',
      )}`,
    });
    expect(JSON.parse(JSON.stringify(card))).toEqual(card);
  });

  it('an Antalya freelance role posted in July is office, part-time, not new, with a Turkish date', () => {
    const [card] = roleCards(
      [
        opening({
          country: 'TR',
          city: 'Antalya',
          cities: ['Antalya'],
          category: 'FREELANCER',
          postedAt: '2026-07-01T00:00:00.000Z',
          workModes: ['HYBRID', 'REMOTE'],
        }),
      ],
      { ...ctx, locale: 'tr' },
    );
    expect(card).toMatchObject({
      place: 'office',
      engagement: 'partTime',
      engagementLabel: 'Part-time',
      isNew: false,
      location: 'Antalya · Türkiye',
      workModes: 'Hybrid · Remote',
      posted: 'Posted 1 Temmuz 2026',
    });
  });
});

describe('heroRoles', () => {
  it('is the first four overseas roles in the API order (newest first), and nothing without one', () => {
    const cards = roleCards(
      [
        opening({ slug: 'office-1', country: 'TR' }),
        ...['a', 'b', 'c', 'd', 'e'].map((s) => opening({ slug: `overseas-${s}` })),
      ],
      ctx,
    );
    expect(heroRoles(cards).map((c) => c.slug)).toEqual([
      'overseas-a',
      'overseas-b',
      'overseas-c',
      'overseas-d',
    ]);
    expect(heroRoles(cards.filter((c) => c.place === 'office'))).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/careers/__tests__"
```

Expected: `roles.test.ts` FAILS to import (`Cannot find module '../_lib/roles'`); `copy.test.ts` FAILS its key-set, argument and OG cases (no `careers` keys yet), the thank-you case (the WP1 line still says "when a suitable role opens") and the portfolio-hint case (the WP1 hint still demands `https://`, W178).

- [ ] **Step 3: Implement**

`src/messages/en.json` — four edits inside `"sys"`:

1. Inside the existing `"seo"` object (beside `"ogTagline"` and the page keys earlier tasks added), add:

```json
"careers": {
  "title": "Careers at JobsAdmire — roles in Antalya and in the source countries",
  "description": "Work for JobsAdmire: overseas representatives in the source countries and the Antalya office team. Full-time, part-time or per project; every application gets an answer."
}
```

(No `"careersDetail"` entry, W169: the OG route reads `sys.seo.<pageKey>.title` without values, so the per-opening title template lives at `sys.careers.detail.metaTitle`, never under `sys.seo.*`, and the detail reuses the index's OG image.)

2. In `"thankYou"` → `"forms"`, replace the value of `"careers"` with:

```json
"careers": "Your application has been received; JobsAdmire confirms it by e-mail and answers every application."
```

3. Add a new `"careers"` object to `"sys"` (after the last page namespace an earlier task added — the position does not matter to next-intl or the tests):

```json
"careers": {
  "hero": {
    "hiringCount": "{count, plural, one {# open role} other {# open roles}} · Antalya & overseas",
    "seeOpenings": "{count, plural, =0 {See open roles} one {See # open role} other {See # open roles}}"
  },
  "filters": {
    "all": "All"
  },
  "roles": {
    "resultAll": "{count, plural, one {Showing the only open role} other {Showing all # open roles}}",
    "resultFiltered": "Showing {shown} of {total} matching roles",
    "showMore": "Show more roles ({count})",
    "posted": "Posted {date}"
  },
  "workMode": {
    "REMOTE": "Remote",
    "HYBRID": "Hybrid",
    "ON_SITE": "On site"
  },
  "salary": {
    "range": "{min} – {max}",
    "from": "from {amount}",
    "upTo": "up to {amount}",
    "per": {
      "HOUR": "per hour",
      "DAY": "per day",
      "WEEK": "per week",
      "MONTH": "per month",
      "YEAR": "per year"
    }
  },
  "empty": {
    "title": "No open roles right now",
    "body": "Every role is published here first. Send an open application by WhatsApp or e-mail below — JobsAdmire keeps good people on file and writes to you when a market opens."
  },
  "apply": {
    "whatsapp": "Apply on WhatsApp",
    "emailSubject": "Open application"
  },
  "detail": {
    "metaTitle": "{title} — careers at JobsAdmire",
    "metaDescription": "{title} ({location}). Read the role and apply online with your PDF CV — JobsAdmire answers every application.",
    "about": "About the role",
    "back": "All open roles",
    "applyLead": "A few minutes and a PDF CV. JobsAdmire answers every application.",
    "whatsappIntro": "Hello JobsAdmire, I would like to apply for the {title} role.",
    "facts": {
      "title": "At a glance",
      "location": "Location",
      "workMode": "Work mode",
      "languages": "Languages",
      "salary": "Pay",
      "posted": "Posted"
    }
  },
  "form": {
    "residency": "This role is open to residents of {country} only.",
    "expectedSalaryHint": "Monthly, in {currency}, whole numbers. Required for roles in Pakistan.",
    "closed": "This role is no longer accepting applications. The open roles are listed on the careers page.",
    "portfolioGate": "This role asks for a portfolio document, which the online form cannot carry yet. Please apply by e-mail."
  },
  "emailPanel": {
    "title": "Apply by e-mail",
    "body": "This role asks for a portfolio. Send your PDF CV and your portfolio — a file or a link — to {email} with the subject below, or ask a question on WhatsApp first.",
    "subject": "Application: {title}",
    "email": "Write the e-mail"
  }
}
```

4. In `"form"` → `"hints"`, replace the value on the line `"portfolioUrl": "A link starting with https://."` (W178: the door adds `https://` to a scheme-less link before its checks — W161 — so the hint must not demand one; the placeholder `sys.form.placeholders.portfolioUrl` stays as the foundation has it):

```json
"portfolioUrl": "A web address, e.g. behance.net/yourname."
```

`src/messages/tr.json` — the same four edits (formal "siz" register; "JobsAdmire" is the subject, never "biz" — W154):

1. In `"seo"`:

```json
"careers": {
  "title": "JobsAdmire'da kariyer — Antalya'da ve kaynak ülkelerde pozisyonlar",
  "description": "JobsAdmire'da çalışın: kaynak ülkelerde yurt dışı temsilcileri ve Antalya ofis ekibi. Tam zamanlı, yarı zamanlı ya da proje bazlı; her başvuru yanıt alır."
}
```

2. `"thankYou"` → `"forms"` → `"careers"`:

```json
"careers": "Başvurunuz alındı; JobsAdmire başvurunuzu e-postayla onaylar ve her başvuruya yanıt verir."
```

3. The new `"careers"` object:

```json
"careers": {
  "hero": {
    "hiringCount": "{count} açık pozisyon · Antalya ve yurt dışı",
    "seeOpenings": "{count, plural, =0 {Açık pozisyonlara bakın} other {# açık pozisyonu görün}}"
  },
  "filters": {
    "all": "Tümü"
  },
  "roles": {
    "resultAll": "{count, plural, one {Tek açık pozisyon gösteriliyor} other {# açık pozisyonun tümü gösteriliyor}}",
    "resultFiltered": "{total} eşleşen pozisyondan {shown} tanesi gösteriliyor",
    "showMore": "Daha fazla pozisyon göster ({count})",
    "posted": "Yayın tarihi: {date}"
  },
  "workMode": {
    "REMOTE": "Uzaktan",
    "HYBRID": "Hibrit",
    "ON_SITE": "Yerinde"
  },
  "salary": {
    "range": "{min} – {max}",
    "from": "en az {amount}",
    "upTo": "en fazla {amount}",
    "per": {
      "HOUR": "saatlik",
      "DAY": "günlük",
      "WEEK": "haftalık",
      "MONTH": "aylık",
      "YEAR": "yıllık"
    }
  },
  "empty": {
    "title": "Şu anda açık pozisyon yok",
    "body": "Her pozisyon önce burada yayınlanır. Aşağıdan WhatsApp ya da e-posta ile açık başvuru gönderin; JobsAdmire iyi adayları kayıtta tutar ve bir pazar açıldığında size yazar."
  },
  "apply": {
    "whatsapp": "WhatsApp'tan başvurun",
    "emailSubject": "Açık başvuru"
  },
  "detail": {
    "metaTitle": "{title} — JobsAdmire'da kariyer",
    "metaDescription": "{title} ({location}). Pozisyonun ayrıntılarını okuyun ve PDF CV'nizle çevrimiçi başvurun; JobsAdmire her başvuruya yanıt verir.",
    "about": "Pozisyon hakkında",
    "back": "Tüm açık pozisyonlar",
    "applyLead": "Birkaç dakika sürer; PDF CV'niz yeterli. JobsAdmire her başvuruya yanıt verir.",
    "whatsappIntro": "Merhaba JobsAdmire, {title} pozisyonuna başvurmak istiyorum.",
    "facts": {
      "title": "Bir bakışta",
      "location": "Konum",
      "workMode": "Çalışma düzeni",
      "languages": "Diller",
      "salary": "Ücret",
      "posted": "Yayın tarihi"
    }
  },
  "form": {
    "residency": "Bu pozisyon yalnızca {country} sakinlerine açıktır.",
    "expectedSalaryHint": "Aylık, {currency} cinsinden, tam sayı olarak yazın. Pakistan'daki pozisyonlar için zorunludur.",
    "closed": "Bu pozisyon artık başvuru kabul etmiyor. Açık pozisyonları kariyer sayfasında görebilirsiniz.",
    "portfolioGate": "Bu pozisyon bir portföy belgesi istiyor; çevrimiçi form bunu henüz taşıyamıyor. Lütfen e-postayla başvurun."
  },
  "emailPanel": {
    "title": "E-postayla başvurun",
    "body": "Bu pozisyon portföy istiyor. PDF CV'nizi ve portföyünüzü (dosya ya da bağlantı) aşağıdaki konu satırıyla {email} adresine gönderin ya da önce WhatsApp'tan bir soru sorun.",
    "subject": "Başvuru: {title}",
    "email": "E-postayı yazın"
  }
}
```

4. In `"form"` → `"hints"`, replace the value on the line `"portfolioUrl": "https:// ile başlayan bir bağlantı."` (W178, as in English):

```json
"portfolioUrl": "Bir web adresi, ör. behance.net/adiniz."
```

(Every apostrophe above sits before a letter, which ICU MessageFormat reads as a literal; none precedes `{`, `}` or `#`.)

`src/app/[locale]/(site)/careers/_lib/roles.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import {
  countryNameOf,
  detailHref,
  ENGAGEMENT_OF,
  isNewOpening,
  locationOf,
  placeOf,
  summaryOf,
  workModesOf,
  type Engagement,
  type Place,
  type PublicOpening,
  type WorkMode,
} from '@/lib/careers-pure';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date/formatDate';

/** A package-id accessor: `makeTf(bundle, locale)` (D17 placeholders filled). */
export type Tf = (id: string) => string;

/** One role as the `RolesList` island and the hero card receive it: plain strings and typed
 *  hrefs, already resolved — no bundle, no `Date`, no function crosses to the client. */
export type RoleCard = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  workModes: string;
  place: Place;
  engagement: Engagement;
  engagementLabel: string;
  isNew: boolean;
  posted: string;
  href: ReturnType<typeof detailHref>;
  applyHref: ReturnType<typeof detailHref> & { hash: '#apply' };
  askHref: string;
};

export type RoleCopy = {
  /** `jt.099` Full-time · `jt.100` Part-time · `jt.073` Project-based */
  engagement: Record<Engagement, string>;
  /** `sys.careers.workMode.*` */
  workMode: Record<WorkMode, string>;
  /** `sys.careers.roles.posted` around the formatted date */
  posted: (date: string) => string;
  /** `jt.311` */
  askIntro: string;
  /** `jt.312` */
  askTail: string;
};

/** "Ask a question first" on WhatsApp: `jt.311` + title + `jt.312` + location + ")" — the
 *  package's own split sentence (W23). It carries page data only, never anything a visitor
 *  typed (W76/W95), so it may sit in a DOM href. */
export const askHrefOf = (
  whatsappNumber: string,
  copy: Pick<RoleCopy, 'askIntro' | 'askTail'>,
  title: string,
  location: string,
) => waLink(whatsappNumber, `${copy.askIntro} ${title} ${copy.askTail}${location})`);

export function roleCards(
  openings: readonly PublicOpening[],
  ctx: {
    locale: Locale;
    countries: ReadonlyArray<{ code: string; name: string }>;
    copy: RoleCopy;
    whatsappNumber: string;
    now: Date;
  },
): RoleCard[] {
  return openings.map((o) => {
    const location = locationOf(o, countryNameOf(o.country, ctx.countries, ctx.locale));
    const engagement = ENGAGEMENT_OF[o.category];
    return {
      slug: o.slug,
      title: o.title,
      summary: summaryOf(o.description),
      location,
      workModes: workModesOf(o)
        .map((mode) => ctx.copy.workMode[mode])
        .join(' · '),
      place: placeOf(o),
      engagement,
      engagementLabel: ctx.copy.engagement[engagement],
      isNew: isNewOpening(o.postedAt, ctx.now),
      posted: ctx.copy.posted(formatDate(o.postedAt, ctx.locale)),
      href: detailHref(o.slug),
      applyHref: { ...detailHref(o.slug), hash: '#apply' },
      askHref: askHrefOf(ctx.whatsappNumber, ctx.copy, o.title, location),
    };
  });
}

/** The hero card (design `heroRoles`): the first four overseas roles, in the API's order. */
export const heroRoles = (cards: readonly RoleCard[]): RoleCard[] =>
  cards.filter((c) => c.place === 'overseas').slice(0, 4);
```

`docs/CONTENT-MODEL.md` — append one bullet to the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` (after the last bullet an earlier task added, before the heading `### Deliberately-empty Turkish fragments`):

```markdown
- **Careers index + detail (`sys.careers.*`, `sys.seo.careers.{title,description}`, WP2b T11):** `hero.{hiringCount,seeOpenings}` (ICU counts over the live openings — they replace `jt.287`/`jt.288` and `jt.025`, whose Turkish hard-types "dört", W1), `filters.all`, `roles.{resultAll,posted}` (ICU / `{date}`), `roles.{resultFiltered,showMore}` (plain `{shown}`/`{total}`/`{count}` templates the `RolesList` island fills itself — the page reads them with `sys.raw`, so `careers` stays out of `CLIENT_SYS`, W148), `workMode.{REMOTE,HYBRID,ON_SITE}`, `salary.{range,from,upTo}` + `salary.per.{HOUR,DAY,WEEK,MONTH,YEAR}` (the detail's pay line; the money itself goes through `formatTRY` or Intl), `empty.{title,body}` (W6), `apply.{whatsapp,emailSubject}` (the W3 open application), `detail.{metaTitle,metaDescription,about,back,applyLead,whatsappIntro}` + `detail.facts.{title,location,workMode,languages,salary,posted}`, `form.{residency,expectedSalaryHint,closed,portfolioGate}`, `emailPanel.{title,body,subject,email}` (the W56 portfolio branch). No `seo.careersDetail.*` key exists, on purpose (W169): the OG image route reads `sys.seo.<pageKey>.title` without values, so the per-opening `<title>` template is `careers.detail.metaTitle` and the detail page reuses the index's OG image `/og/{locale}/careers.png` (the blog article's pattern). `sys.thankYou.forms.careers` was rewritten for the per-opening application, and `sys.form.hints.portfolioUrl` was rewritten in both locales to accept a scheme-less link (W178). Package ids never rendered: `jt.144`–`244` (the nine fixture roles, D23), `jt.289`–`301` (the country chips → `sourceCountries`, D17), `jt.025`, `287`, `288`, `302`–`305`, `307`, `308` (composed counts → ICU), `jt.047`, `085`, `105`–`107` (Operations links, W89), `jt.097`–`102`, `108`–`110`, `284`, `285`, `313`–`321` (the speculative form, W3), `jt.050`, `051`, `309`, `310` (the expand panel — the API has one description), `jt.114` (the literal mailbox — `settings.careersEmail`, W102), `jt.143`, and the chrome copies `jt.001`–`020`, `116`, `118`–`142` (R15).
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write src/messages/en.json src/messages/tr.json "src/app/[locale]/(site)/careers" docs/CONTENT-MODEL.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `copy.test.ts` (6) and `roles.test.ts` (3); `src/messages/messages.test.ts` (identical TR/EN key sets), `src/messages/voice.test.ts` (no first-person plural in any `sys.*` value — W154) and `src/i18n/client-messages.test.ts` (no client module reads `sys.careers`, so `CLIENT_SYS` is unchanged — W148) stay green.

- [ ] **Step 5: Commit**

```bash
git add src/messages/en.json src/messages/tr.json "src/app/[locale]/(site)/careers/_lib/roles.ts" "src/app/[locale]/(site)/careers/__tests__/copy.test.ts" "src/app/[locale]/(site)/careers/__tests__/roles.test.ts" docs/CONTENT-MODEL.md
git commit -m "feat(careers): sys.careers copy, the careers SEO fallbacks and the index view model (T11 c2)

sys.careers.* and sys.seo.careers in both locales (W9/W23, W154 voice); the OG-read index title
is argument-free and no sys.seo.careersDetail exists (W169, T12's template-page pattern); the two island templates are plain {token} strings (W148); the careers thank-you
line fits a per-opening application (D13); sys.form.hints.portfolioUrl accepts a scheme-less
link in both locales (W178, the door adds https://). roleCards/heroRoles resolve every string on the
server — the island gets data only. CONTENT-MODEL: the careers bullet.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the index: hero + worker notice, the live roles (the `RolesList` island, the W6 empty state), the three ways, the process, the WhatsApp/e-mail open application, the FAQ; `'/careers'` leaves `UNBUILT_PATHNAMES`, two gate rows, the SEO row

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/careers/__tests__/sections.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SourceCountry } from '@/content/collections';
import { makeTf } from '@/content/pure';
import en from '@/messages/en.json';
import { testBundle } from '@/test/bundle';
import { OPENING, opening } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import { heroRoles, roleCards, type RoleCopy } from '../_lib/roles';
import { CareersHero, WorkerNotice } from '../_sections/Hero';
import { HiringSteps } from '../_sections/HiringSteps';
import { OpenApplication } from '../_sections/OpenApplication';
import { RolesSection } from '../_sections/Roles';
import { WaysSection } from '../_sections/Ways';

/** The committed EN bundle's `jt.*` strings — read with readFileSync, the sanctioned way past
 *  the D23 import rule. */
const JT = Object.fromEntries(
  Object.entries(
    (
      JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8'),
      ) as { strings: Record<string, string> }
    ).strings,
  ).filter(([id]) => id.startsWith('jt.')),
);
const t = makeTf(testBundle({ strings: JT }), 'en');
const SYS = en.sys.careers;
const COUNTRIES = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'IN', name: 'India' },
  { code: 'TR', name: 'Türkiye' },
];
const SOURCE: SourceCountry[] = [
  { code: 'PK', nameId: null, name: 'Pakistan', dial: '+92', lon: 69.3, lat: 30.4, flag: 'pk' },
  { code: 'UZ', nameId: null, name: 'Uzbekistan', dial: '+998', lon: 64.6, lat: 41.4, flag: 'uz' },
];
/** The fixture door's five openings (e2e/mocks/careers-door.mjs), newest first. */
const OPENINGS = [
  opening({
    slug: 'work-permit-officer-antalya',
    title: 'Work Permit & Documentation Officer',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    postedAt: '2026-09-19T08:00:00.000Z',
  }),
  OPENING,
  opening({
    slug: 'sourcing-coordinator-pakistan',
    title: 'Sourcing Coordinator — Pakistan',
    country: 'PK',
    city: 'Karachi',
    cities: ['Karachi', 'Lahore'],
    category: 'FREELANCER',
    postedAt: '2026-09-10T08:00:00.000Z',
  }),
  opening({
    slug: 'content-seo-specialist-antalya',
    title: 'Content & SEO Specialist',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    portfolioRequired: true,
    postedAt: '2026-08-31T08:00:00.000Z',
  }),
  opening({
    slug: 'trade-test-assessor-india',
    title: 'Trade Test & Skills Assessor',
    country: 'IN',
    city: null,
    cities: [],
    category: 'PROJECT_BASED',
    postedAt: '2026-08-11T08:00:00.000Z',
  }),
];
const COPY: RoleCopy = {
  engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
  workMode: SYS.workMode,
  posted: (date) => SYS.roles.posted.replace('{date}', date),
  askIntro: t('jt.311'),
  askTail: t('jt.312'),
};
const CARDS = roleCards(OPENINGS, {
  locale: 'en',
  countries: COUNTRIES,
  copy: COPY,
  whatsappNumber: '905011240340',
  now: new Date('2026-09-20T00:00:00Z'),
});
const SETTINGS = { whatsappNumber: '905011240340', careersEmail: 'careers@jobsadmire.com' };

beforeEach(() => {
  window.dataLayer = [];
});

describe('CareersHero (W1, W6, D26)', () => {
  it('with nothing open: no count pill, no role card; one tagged h1, the only LCP slot', () => {
    const { container } = renderWithIntl(
      <CareersHero t={t} locale="en" openingsCount={0} heroCards={[]} sourceCountries={SOURCE} />,
      { locale: 'en' },
    );
    expect(screen.queryByTestId('careers-hiring-count')).toBeNull();
    expect(screen.queryByTestId('careers-hero-roles')).toBeNull();
    const h1 = screen.getByTestId('page-h1');
    expect(h1.tagName).toBe('H1');
    expect(h1).toHaveTextContent(t('jt.022'));
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'See open roles' })).toHaveAttribute('href', '#roles');
    expect(screen.getByRole('link', { name: t('jt.026') })).toHaveAttribute('href', '#apply');
    // The one source-country list (D17), never the design's jt.289–301.
    expect(screen.getByRole('list', { name: t('jt.036') })).toHaveTextContent('Pakistan');
  });

  it('with openings: the ICU count pill and the overseas roles, the third hidden up to 900 px (W10)', () => {
    renderWithIntl(
      <CareersHero
        t={t}
        locale="en"
        openingsCount={CARDS.length}
        heroCards={heroRoles(CARDS)}
        sourceCountries={SOURCE}
      />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('careers-hiring-count')).toHaveTextContent(
      '5 open roles · Antalya & overseas',
    );
    expect(screen.getByRole('link', { name: 'See 5 open roles' })).toHaveAttribute('href', '#roles');
    const items = screen.getAllByTestId('careers-hero-role');
    expect(items.map((li) => li.getAttribute('data-slug'))).toEqual([
      'country-representative-uzbekistan',
      'sourcing-coordinator-pakistan',
      'trade-test-assessor-india',
    ]);
    expect(items[0]).not.toHaveClass('max-lg:hidden');
    expect(items[2]).toHaveClass('max-lg:hidden');
    expect(within(items[0]).getByRole('link')).toHaveAttribute(
      'href',
      '/en/careers/country-representative-uzbekistan',
    );
  });
});

describe('WorkerNotice', () => {
  it('links the partner page inside the sentence, underlined (axe link-in-text-block)', () => {
    renderWithIntl(<WorkerNotice t={t} />, { locale: 'en' });
    const link = screen.getByRole('link', { name: t('jt.042') });
    expect(link).toHaveAttribute('href', '/en/partner-with-us');
    expect(link).toHaveClass('underline');
    expect(screen.getByTestId('careers-notice')).toHaveTextContent(t('jt.043').trim());
  });
});

describe('RolesSection (W6, W13 amended)', () => {
  it('without openings: the designed empty state, pointing at the open application', () => {
    renderWithIntl(<RolesSection t={t} cards={[]} />, { locale: 'en' });
    const empty = screen.getByTestId('careers-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent(SYS.empty.title);
    expect(within(empty).getByRole('link', { name: t('jt.026') })).toHaveAttribute('href', '#apply');
    expect(screen.queryByTestId('careers-roles-list')).toBeNull();
  });

  it('with openings: four cards, the result line and the show-more toggle', () => {
    renderWithIntl(<RolesSection t={t} cards={CARDS} />, { locale: 'en' });
    const list = screen.getByTestId('careers-roles-list');
    expect(within(list).getAllByTestId('careers-role')).toHaveLength(4);
    expect(within(list).getByText('Showing all 5 open roles')).toBeInTheDocument();
    expect(within(list).getByRole('button', { name: 'Show more roles (1)' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('filters by place and engagement, shows the no-match state, clears, expands and collapses', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} cards={CARDS} />, { locale: 'en' });
    const list = screen.getByTestId('careers-roles-list');
    const shown = () =>
      within(list)
        .queryAllByTestId('careers-role')
        .map((role) => role.getAttribute('data-slug'));
    await user.click(within(list).getByRole('radio', { name: t('jt.262') }));
    expect(shown()).toEqual([
      'country-representative-uzbekistan',
      'sourcing-coordinator-pakistan',
      'trade-test-assessor-india',
    ]);
    expect(within(list).getByText('Showing 3 of 3 matching roles')).toBeInTheDocument();
    await user.click(within(list).getByRole('radio', { name: t('jt.073') }));
    expect(shown()).toEqual(['trade-test-assessor-india']);
    await user.click(within(list).getByRole('radio', { name: t('jt.261') }));
    expect(within(list).getByTestId('careers-no-match')).toHaveTextContent(t('jt.054'));
    await user.click(within(list).getByRole('button', { name: t('jt.056') }));
    expect(shown()).toHaveLength(4);
    await user.click(within(list).getByRole('button', { name: 'Show more roles (1)' }));
    expect(shown()).toHaveLength(5);
    await user.click(within(list).getByRole('button', { name: t('jt.306') }));
    expect(shown()).toHaveLength(4);
  });

  it('"Ask a question first" carries only the role (W95) and fires whatsapp_click page_cta (W12); "Apply" goes to the detail', async () => {
    const user = userEvent.setup();
    renderWithIntl(<RolesSection t={t} cards={CARDS} />, { locale: 'en' });
    const card = within(screen.getByTestId('careers-roles-list')).getAllByTestId('careers-role')[1];
    const ask = within(card).getByRole('link', { name: new RegExp(`^${t('jt.053')}`) });
    expect(ask.getAttribute('href')).toBe(CARDS[1].askHref);
    expect(ask).toHaveAttribute('target', '_blank');
    await user.click(ask);
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({ event: 'whatsapp_click', placement: 'page_cta' }),
    );
    expect(within(card).getByRole('link', { name: new RegExp(`^${t('jt.052')}`) })).toHaveAttribute(
      'href',
      '/en/careers/country-representative-uzbekistan#apply',
    );
  });
});

describe('OpenApplication (W3)', () => {
  it('is WhatsApp + e-mail only — no form', () => {
    const { container } = renderWithIntl(<OpenApplication t={t} settings={SETTINGS} />, {
      locale: 'en',
    });
    expect(container.querySelector('form')).toBeNull();
    expect(screen.getByRole('link', { name: SYS.apply.whatsapp }).getAttribute('href')).toBe(
      `https://wa.me/905011240340?text=${encodeURIComponent(t('jt.286'))}`,
    );
    expect(screen.getByRole('link', { name: t('jt.104') })).toHaveAttribute(
      'href',
      `mailto:careers@jobsadmire.com?subject=${encodeURIComponent(SYS.apply.emailSubject)}`,
    );
  });
});

describe('HiringSteps', () => {
  it('seven steps in a list of list items only, the Admira AI badge on steps 3 and 4', () => {
    const { container } = renderWithIntl(<HiringSteps t={t} />, { locale: 'en' });
    const ol = container.querySelector('ol')!;
    expect([...ol.children].map((c) => c.tagName)).toEqual(Array(7).fill('LI'));
    expect([...ol.children].map((li) => li.textContent?.includes(t('jt.083')))).toEqual([
      false,
      false,
      true,
      true,
      false,
      false,
      false,
    ]);
    expect(screen.getByTestId('careers-process')).toHaveTextContent(t('jt.084'));
  });

  it('the compact variant (the detail page) keeps its heading and drops the section header', () => {
    renderWithIntl(<HiringSteps t={t} variant="compact" />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 2, name: t('jt.081') })).toBeInTheDocument();
    expect(screen.queryByText(t('jt.082'))).toBeNull();
  });
});

describe('the index as a whole (W8/W89, one h1)', () => {
  it('links nowhere on Operations, keeps one h1, and underlines the ways note link', () => {
    const { container } = renderWithIntl(
      <>
        <CareersHero
          t={t}
          locale="en"
          openingsCount={CARDS.length}
          heroCards={heroRoles(CARDS)}
          sourceCountries={SOURCE}
        />
        <WorkerNotice t={t} />
        <RolesSection t={t} cards={CARDS} />
        <WaysSection t={t} />
        <HiringSteps t={t} />
        <OpenApplication t={t} settings={SETTINGS} />
      </>,
      { locale: 'en' },
    );
    expect(container.querySelector('a[href*="operations.jobsadmire.com"]')).toBeNull();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('link', { name: t('jt.079') })).toHaveClass('underline');
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/careers/__tests__/sections.test.tsx"
```

Expected: FAILS to import `../_sections/Hero` (and the other section modules).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/careers/_components/HeroRoleCard.tsx`:

```tsx
import { Link } from '@/i18n/navigation';
import type { RoleCard } from '../_lib/roles';

export type HeroRoleCardLabels = {
  title: string; // jt.030
  lead: string; // jt.031
  live: string; // jt.032
  newBadge: string; // jt.033
  footer: string; // jt.034
  all: string; // jt.035
};

/** The design's "Overseas roles open now" card (`.ja-jt-rolecard`): up to four overseas roles,
 *  each a link to its detail page (the design's scroll-and-expand needs the duties/wants split
 *  the API does not have). Nothing when no overseas role is open (W6). The header is solid
 *  `blue-safe` with full-white text and a darkened "Live" pill (D20 — white/85 on the design's
 *  #1899d5 gradient is under 4.5:1). Up to 900 px the design shows two roles: the third and
 *  fourth are hidden by CSS, never by conditional rendering (W10, W119). */
export function HeroRoleCard({ cards, labels }: { cards: RoleCard[]; labels: HeroRoleCardLabels }) {
  if (cards.length === 0) return null;
  return (
    <section
      data-testid="careers-hero-roles"
      aria-labelledby="careers-hero-roles-title"
      className="overflow-hidden rounded-lg border border-[#d3e6f2] bg-white text-ink shadow-[0_30px_70px_rgba(6,12,36,0.42)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-safe px-6 py-5 text-white">
        <div>
          <h2 id="careers-hero-roles-title" className="text-card-title text-white">
            {labels.title}
          </h2>
          <p className="mt-1 text-body-sm text-white">{labels.lead}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/40 bg-black/15 px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-white">
          <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-[#86efac]" />
          {labels.live}
        </span>
      </div>
      <ul className="grid gap-2 p-4">
        {cards.map((c, i) => (
          <li
            key={c.slug}
            data-testid="careers-hero-role"
            data-slug={c.slug}
            className={i >= 2 ? 'max-lg:hidden' : undefined}
          >
            <Link
              href={c.href}
              className="flex items-center gap-4 rounded-base border border-[#e6f0f7] bg-[#f6fafc] px-5 py-4 text-ink no-underline hover:bg-tint"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-extrabold">{c.title}</span>
                  {c.isNew && (
                    <span className="rounded-pill bg-success-surface px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-success-text">
                      {labels.newBadge}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2 text-body-sm font-bold text-text-tertiary">
                  <span className="truncate">{c.location}</span>
                  <span aria-hidden="true" className="h-1 w-1 flex-none rounded-pill bg-[#cbd5e1]" />
                  <span className="flex-none whitespace-nowrap">{c.engagementLabel}</span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-[11px] bg-tint text-blue-safe"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 px-6 pb-5">
        <span className="text-body-sm font-bold text-text-tertiary">{labels.footer}</span>
        <a href="#roles" className="text-body-sm font-extrabold text-blue-safe underline">
          {labels.all}
        </a>
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/careers/_components/RolesList.tsx`:

```tsx
'use client';
import { useId, useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives/Button';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Link } from '@/i18n/navigation';
import type { Engagement, Place } from '@/lib/careers-pure';
import type { RoleCard } from '../_lib/roles';

/** The design shows four roles, then "Show N more roles". */
export const INITIAL_SHOWN = 4;

export type RolesListCopy = {
  where: string; // jt.048
  engagement: string; // jt.049
  all: string; // sys.careers.filters.all
  office: string; // jt.261
  overseas: string; // jt.262
  fullTime: string; // jt.099
  partTime: string; // jt.100
  project: string; // jt.073
  apply: string; // jt.052
  ask: string; // jt.053
  newBadge: string; // jt.033
  /** sys.careers.roles.resultAll, resolved on the server (the total never changes here) */
  resultAll: string;
  /** sys.careers.roles.resultFiltered — a plain `{shown}` / `{total}` template */
  resultFiltered: string;
  /** sys.careers.roles.showMore — a plain `{count}` template */
  showMore: string;
  showFewer: string; // jt.306
  noMatchTitle: string; // jt.054
  noMatchBody: string; // jt.055
  showAll: string; // jt.056
};

type PlaceFilter = 'all' | Place;
type EngagementFilter = 'all' | Engagement;

/** `{name}` → value. The island fills its two plain templates itself and never calls
 *  `useTranslations`, so `sys.careers.*` stays out of every page's client payload (W148). */
const fillTemplate = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  );

/**
 * The live roles list (design `#roles`): Where × Engagement filters, the result line, four
 * cards then show-more / show-fewer, the no-match state. Server-rendered and hydrated — never
 * `ssr: false`: it is the page's main content and SEO-bearing (W13 amended). Every string and
 * href arrives resolved from the server; each card's "Ask a question first" link carries only
 * the role's title and location (W95).
 */
export function RolesList({ cards, copy }: { cards: RoleCard[]; copy: RolesListCopy }) {
  const listId = useId();
  const [place, setPlace] = useState<PlaceFilter>('all');
  const [engagement, setEngagement] = useState<EngagementFilter>('all');
  const [expanded, setExpanded] = useState(false);

  const matching = cards.filter(
    (c) =>
      (place === 'all' || c.place === place) &&
      (engagement === 'all' || c.engagement === engagement),
  );
  const filtered = place !== 'all' || engagement !== 'all';
  const shown = expanded ? matching : matching.slice(0, INITIAL_SHOWN);
  const more = matching.length - Math.min(matching.length, INITIAL_SHOWN);
  const result = filtered
    ? fillTemplate(copy.resultFiltered, { shown: shown.length, total: matching.length })
    : copy.resultAll;
  const clear = () => {
    setPlace('all');
    setEngagement('all');
  };

  return (
    <div data-testid="careers-roles-list">
      <div className="mb-5 flex flex-wrap items-start gap-6 rounded-[18px] border border-border-2 bg-white px-5 py-4 shadow-card">
        <RadioChips
          name="careers-place"
          legend={copy.where}
          value={place}
          onChange={(value) => setPlace(value as PlaceFilter)}
          options={[
            { value: 'all', label: copy.all },
            { value: 'office', label: copy.office },
            { value: 'overseas', label: copy.overseas },
          ]}
        />
        <RadioChips
          name="careers-engagement"
          legend={copy.engagement}
          value={engagement}
          onChange={(value) => setEngagement(value as EngagementFilter)}
          options={[
            { value: 'all', label: copy.all },
            { value: 'fullTime', label: copy.fullTime },
            { value: 'partTime', label: copy.partTime },
            { value: 'project', label: copy.project },
          ]}
        />
      </div>

      <p role="status" aria-live="polite" className="mb-4 text-body-sm font-extrabold text-text-tertiary">
        {result}
      </p>

      {matching.length === 0 ? (
        <div
          data-testid="careers-no-match"
          className="rounded-[18px] border-[1.5px] border-dashed border-tint-border bg-white p-8 text-center"
        >
          <p className="text-body-lg font-extrabold text-ink">{copy.noMatchTitle}</p>
          <p className="mx-auto mt-2 mb-4 max-w-[560px] text-body-sm text-text-secondary">
            {copy.noMatchBody}
          </p>
          <button type="button" onClick={clear} className={buttonClassName('primary')}>
            {copy.showAll}
          </button>
        </div>
      ) : (
        <ul id={listId} className="flex flex-col gap-3">
          {shown.map((c) => (
            <li key={c.slug}>
              <article
                data-testid="careers-role"
                data-slug={c.slug}
                data-place={c.place}
                data-engagement={c.engagement}
                className="relative overflow-hidden rounded-[18px] border border-border-2 bg-white shadow-card"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1.5 ${c.place === 'overseas' ? 'bg-[#253063]' : 'bg-blue-safe'}`}
                />
                <div className="flex flex-col gap-4 py-5 pr-6 pl-7 md:flex-row md:items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="flex flex-wrap items-center gap-2 text-card-title text-ink">
                      <Link href={c.href} className="text-ink no-underline hover:underline">
                        {c.title}
                      </Link>
                      {c.isNew && (
                        <span className="rounded-pill bg-success-surface px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-success-text">
                          {copy.newBadge}
                        </span>
                      )}
                    </h3>
                    {c.summary && <p className="mt-1 text-body-sm text-text-tertiary">{c.summary}</p>}
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-sm font-bold text-text-secondary">
                      <span>{c.location}</span>
                      {c.workModes && <span>{c.workModes}</span>}
                      <span className="text-text-tertiary">{c.posted}</span>
                    </p>
                  </div>
                  <div className="flex flex-none flex-col items-start gap-3 md:items-end">
                    <span className="rounded-pill bg-tint px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.06em] text-blue-safe">
                      {c.engagementLabel}
                    </span>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link
                        href={c.applyHref}
                        aria-label={`${copy.apply}: ${c.title}`}
                        className={buttonClassName('primary')}
                      >
                        {copy.apply}
                      </Link>
                      <ContactLink
                        href={c.askHref}
                        placement="page_cta"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${copy.ask}: ${c.title}`}
                        className={buttonClassName('secondary')}
                      >
                        {copy.ask}
                      </ContactLink>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {matching.length > INITIAL_SHOWN && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((open) => !open)}
            className={buttonClassName('secondary', 'lg')}
          >
            {expanded ? copy.showFewer : fillTemplate(copy.showMore, { count: more })}
          </button>
        </div>
      )}
    </div>
  );
}
```

`src/app/[locale]/(site)/careers/_sections/Hero.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import type { SourceCountry } from '@/content/collections';
import { isFlagCode } from '@/design/assets/flag-codes';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { Flag } from '@/design/Flag';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { HeroRoleCard } from '../_components/HeroRoleCard';
import type { RoleCard, Tf } from '../_lib/roles';

/** The design's navy gradient (`.ja-jt-hero`); its glows and dot grid are decoration left out. */
const HERO_BG = 'bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)]';
const TRUST = ['jt.027', 'jt.028', 'jt.029'] as const;

function Tick() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-[#4ade80]">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * The dark text-only hero: the breadcrumb (this page's own ids, W109), the live-count pill
 * (W1 — counted from the list; absent when nothing is open, W6), the h1 (the named LCP element,
 * D26 — no image slot on this page), "See N open positions" + "Send an open application", the
 * trust chips, the overseas role card and the source-country strip (the ONE list, D17). Small
 * greys are #a9b5d8 (the design's #8b98c4 is 4.4:1 on #253063 — D20).
 */
export function CareersHero({
  t,
  locale,
  openingsCount,
  heroCards,
  sourceCountries,
}: {
  t: Tf;
  locale: Locale;
  openingsCount: number;
  heroCards: RoleCard[];
  sourceCountries: SourceCountry[];
}) {
  const sys = useTranslations('sys');
  return (
    <Section tone="dark" className={`pt-8 pb-0 ${HERO_BG}`}>
      <div className="container-site">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('jt.021'), href: '/' },
            { name: t('jt.005'), href: '/careers' },
          ]}
        />
        <div className="grid items-center gap-8 pt-6 pb-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
          <div className="min-w-0">
            {openingsCount > 0 && (
              <p
                data-testid="careers-hiring-count"
                className="mb-5 inline-flex items-center gap-2 rounded-pill border border-[#4ade80]/40 bg-[#16a34a]/15 px-4 py-1.5 text-body-sm font-extrabold text-[#86efac]"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-[#4ade80]" />
                {sys('careers.hero.hiringCount', { count: openingsCount })}
              </p>
            )}
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="text-h1 leading-[1.02] tracking-[-0.03em] text-white"
            >
              {t('jt.022')}
              <br />
              <span className="text-sky">{t('jt.023')}</span>
            </h1>
            <p data-testid="careers-hero-lead" className="mt-5 max-w-[520px] text-body-lg text-[#c1cbe6]">
              {t('jt.024')}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#roles" className={buttonClassName('primary', 'lg')}>
                {sys('careers.hero.seeOpenings', { count: openingsCount })}
              </a>
              <a href="#apply" className={buttonClassName('inverse', 'lg')}>
                {t('jt.026')}
              </a>
            </div>
            <ul className="mt-7 flex flex-col gap-2 text-body-sm font-bold text-[#a9b5d8] sm:flex-row sm:flex-wrap sm:gap-x-6">
              {TRUST.map((id) => (
                <li key={id} className="inline-flex items-center gap-2">
                  <Tick />
                  {t(id)}
                </li>
              ))}
            </ul>
          </div>
          <HeroRoleCard
            cards={heroCards}
            labels={{
              title: t('jt.030'),
              lead: t('jt.031'),
              live: t('jt.032'),
              newBadge: t('jt.033'),
              footer: t('jt.034'),
              all: t('jt.035'),
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 py-6">
          <p
            id="careers-countries-label"
            className="text-eyebrow font-extrabold uppercase tracking-[0.11em] text-[#a9b5d8]"
          >
            {t('jt.036')}
          </p>
          <ul aria-labelledby="careers-countries-label" className="flex flex-1 flex-wrap gap-2">
            {sourceCountries.map((c) => (
              <li
                key={c.code}
                className="inline-flex items-center gap-2 rounded-[9px] border border-white/20 bg-white/10 px-3 py-1.5 text-body-sm font-extrabold text-[#dbe3f5]"
              >
                {isFlagCode(c.code) && <Flag code={c.code} size={16} />}
                {c.name}
              </li>
            ))}
          </ul>
          <p className="text-body-sm font-bold text-[#a9b5d8]">{t('jt.037')}</p>
        </div>
      </div>
    </Section>
  );
}

/** The worker notice band (design `.ja-jt-notice`): the package's own split sentence (W23) —
 *  `jt.043` is legal-flagged and renders verbatim. The inline link is underlined (axe
 *  `link-in-text-block`). */
export function WorkerNotice({ t }: { t: Tf }) {
  return (
    <div className="border-b border-warning-border bg-warning-surface py-4">
      <div data-testid="careers-notice" className="container-site flex flex-wrap items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] bg-[#fef3c7] text-warning-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 text-body-sm text-text-secondary">
          <strong className="text-ink">{t('jt.038')}</strong> {t('jt.039')} <em>{t('jt.040')}</em>{' '}
          {t('jt.041')}{' '}
          <Link href="/partner-with-us" className="font-extrabold text-blue-safe underline">
            {t('jt.042')}
          </Link>
          {t('jt.043')}
        </p>
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/careers/_sections/Roles.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { EmptyState } from '@/design/blocks/EmptyState';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { RolesList } from '../_components/RolesList';
import type { RoleCard, Tf } from '../_lib/roles';

/** `#roles` (design `.ja-jt-roles`): the header, then the live list — or, with nothing open,
 *  the designed empty state pointing at the open application (W6). The design's "Open
 *  application portal" (`jt.047`) links to Operations and is not rendered (W89). */
export function RolesSection({ t, cards }: { t: Tf; cards: RoleCard[] }) {
  const sys = useTranslations('sys');
  return (
    <Section tone="pale" id="roles" className="scroll-mt-24 border-t border-border-3">
      <div data-testid="careers-roles" className="container-site">
        <div className="mb-6 max-w-[620px]">
          <Eyebrow>{t('jt.044')}</Eyebrow>
          <h2 className="mt-3 mb-2 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.045')}</h2>
          <p className="text-body text-text-secondary">{t('jt.046')}</p>
        </div>
        {cards.length === 0 ? (
          <EmptyState
            testId="careers-empty"
            tone="light"
            headingLevel={3}
            title={sys('careers.empty.title')}
            body={sys('careers.empty.body')}
            cta={{ label: t('jt.026'), href: '#apply' }}
          />
        ) : (
          <RolesList
            cards={cards}
            copy={{
              where: t('jt.048'),
              engagement: t('jt.049'),
              all: sys('careers.filters.all'),
              office: t('jt.261'),
              overseas: t('jt.262'),
              fullTime: t('jt.099'),
              partTime: t('jt.100'),
              project: t('jt.073'),
              apply: t('jt.052'),
              ask: t('jt.053'),
              newBadge: t('jt.033'),
              resultAll: sys('careers.roles.resultAll', { count: cards.length }),
              resultFiltered: String(sys.raw('careers.roles.resultFiltered')),
              showMore: String(sys.raw('careers.roles.showMore')),
              showFewer: t('jt.306'),
              noMatchTitle: t('jt.054'),
              noMatchBody: t('jt.055'),
              showAll: t('jt.056'),
            }}
          />
        )}
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/_sections/Ways.tsx`:

```tsx
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Tf } from '../_lib/roles';

const WAYS = [
  { badge: 'jt.060', title: 'jt.061', body: 'jt.062', bullets: ['jt.063', 'jt.064', 'jt.065'], dark: true },
  { badge: 'jt.066', title: 'jt.067', body: 'jt.068', bullets: ['jt.069', 'jt.070', 'jt.071'], dark: false },
  { badge: 'jt.072', title: 'jt.073', body: 'jt.074', bullets: ['jt.075', 'jt.076', 'jt.077'], dark: false },
] as const;

const CARD = {
  dark: 'rounded-lg bg-[linear-gradient(135deg,#253063_0%,#16204a_100%)] p-7 text-white',
  light: 'rounded-lg border-[1.5px] border-tint-border bg-white p-7 text-ink',
} as const;
const BADGE = {
  dark: 'mb-4 inline-flex rounded-pill border border-white/20 bg-white/15 px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-white',
  light: 'mb-4 inline-flex rounded-pill bg-tint px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-blue-safe',
} as const;

/** "Three ways to work with us" (design `.ja-jt-types`): static cards on every width — the
 *  design's ≤ 900 px accordions are not ported (W10). `jt.078` is legal-flagged (verbatim);
 *  `jt.079` is the package's own link fragment, underlined inside the sentence. */
export function WaysSection({ t }: { t: Tf }) {
  return (
    <Section tone="light" className="border-t border-border-3">
      <div data-testid="careers-ways" className="container-site">
        <div className="mb-8 max-w-[680px]">
          <Eyebrow>{t('jt.057')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.058')}</h2>
          <p className="text-body text-text-secondary">{t('jt.059')}</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {WAYS.map((w) => {
            const tone = w.dark ? 'dark' : 'light';
            return (
              <li key={w.title} className={CARD[tone]}>
                <p className={BADGE[tone]}>{t(w.badge)}</p>
                <h3 className="text-card-title tracking-[-0.02em]">{t(w.title)}</h3>
                <p
                  className={
                    w.dark
                      ? 'mt-2 mb-4 text-body-sm text-[#c9d6ec]'
                      : 'mt-2 mb-4 text-body-sm text-text-secondary'
                  }
                >
                  {t(w.body)}
                </p>
                <ul className="flex flex-col gap-2 text-body-sm">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className={w.dark ? 'font-extrabold text-[#7de2a5]' : 'font-extrabold text-blue-safe'}
                      >
                        •
                      </span>
                      {t(b)}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 rounded-base border border-border-2 bg-pale-1 px-5 py-4 text-body-sm text-text-secondary">
          {t('jt.078')}{' '}
          <Link href="/partner-with-us" className="font-extrabold text-blue-safe underline">
            {t('jt.079')}
          </Link>
        </p>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/_sections/HiringSteps.tsx`:

```tsx
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import type { Tf } from '../_lib/roles';

/** The seven steps (design `steps[]`): title / body / when, the "Admira AI" badge on steps 3–4.
 *  Badge faces clear 4.5:1 under white text (D20): `blue-safe` for the design's #1899D5,
 *  `success-text` for its #16a34a. The "when" labels are package copy rendered as authored
 *  (parity-baselined; listed for the WP-C copy review). */
const STEPS = [
  { title: 'jt.263', body: 'jt.264', when: 'jt.265', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.266', body: 'jt.267', when: 'jt.268', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.269', body: 'jt.270', when: 'jt.271', ai: true, badge: 'bg-[#253063]' },
  { title: 'jt.272', body: 'jt.273', when: 'jt.274', ai: true, badge: 'bg-[#253063]' },
  { title: 'jt.275', body: 'jt.276', when: 'jt.277', ai: false, badge: 'bg-[#253063]' },
  { title: 'jt.278', body: 'jt.279', when: 'jt.280', ai: false, badge: 'bg-blue-safe' },
  { title: 'jt.281', body: 'jt.282', when: 'jt.283', ai: false, badge: 'bg-success-text' },
] as const;

function StepList({ t }: { t: Tf }) {
  return (
    // The connector line sits beside the <ol>, never inside it: an <ol> holds <li>s only (axe `list`).
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute top-7 bottom-11 left-[25px] w-[3px] rounded-pill bg-[linear-gradient(180deg,#1899d5_0%,#253063_55%,#16a34a_100%)] opacity-25"
      />
      <ol className="relative flex flex-col">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[54px_1fr] gap-5 pb-6">
            <span
              aria-hidden="true"
              className={`flex h-[54px] w-[54px] items-center justify-center rounded-[17px] text-body-lg font-extrabold text-white ${s.badge}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="text-body-lg tracking-[-0.01em]">{t(s.title)}</h3>
                {s.ai && (
                  <span className="rounded-pill border border-[#ccd5ea] bg-[#edf1f9] px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#253063]">
                    {t('jt.083')}
                  </span>
                )}
                <span className="text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-text-tertiary">
                  {t(s.when)}
                </span>
              </div>
              <p className="max-w-[640px] text-body-sm text-text-secondary">{t(s.body)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The hiring process (design `.ja-jt-process`) — `full` on the index; `compact` on the detail
 *  page (the steps under their own h2, no section header). "Check your application status"
 *  (`jt.085`) links to Operations and is not rendered (W89): the status link travels in the
 *  applicant's confirmation e-mail. */
export function HiringSteps({ t, variant = 'full' }: { t: Tf; variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div data-testid="careers-process" className="rounded-lg border border-border-2 bg-white p-6 md:p-8">
        <h2 className="mb-6 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.081')}</h2>
        <StepList t={t} />
      </div>
    );
  }
  return (
    <Section tone="pale" className="border-t border-border-3">
      <div data-testid="careers-process" className="container-site">
        <div className="mb-8 max-w-[660px]">
          <Eyebrow>{t('jt.080')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.081')}</h2>
          <p className="text-body text-text-secondary">{t('jt.082')}</p>
        </div>
        <div className="rounded-lg border border-border-2 bg-white p-6 shadow-[0_10px_30px_rgba(22,60,90,0.06)] md:p-8">
          <StepList t={t} />
          <p className="mt-2 flex items-center gap-3 border-t border-border-3 pt-5 text-body-sm font-bold text-text-secondary">
            <span aria-hidden="true" className="h-2 w-2 flex-none rounded-pill bg-success" />
            {t('jt.084')}
          </p>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/_sections/OpenApplication.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { mailLink, waLink } from '@/lib/contact';
import type { Tf } from '../_lib/roles';

const WANTS = [
  ['jt.089', 'jt.090', 'bg-tint text-blue-safe'],
  ['jt.091', 'jt.092', 'bg-success-surface text-success-text'],
  ['jt.093', 'jt.094', 'bg-[#edf1f9] text-[#253063]'],
] as const;

/**
 * "No matching role?" (`#apply`, design `.ja-jt-apply`) — W3: WhatsApp + e-mail only in Phase A,
 * no form and no form key. The WhatsApp prefill is the package's own (`jt.286`) and the e-mail
 * goes to `settings.careersEmail`; both fire their contact event with `page_cta` (W12). The
 * design's form, its KVKK line, its success copy and the portal note (`jt.097`–`110`) are not
 * rendered (W3, W89).
 */
export function OpenApplication({
  t,
  settings,
}: {
  t: Tf;
  settings: { whatsappNumber: string; careersEmail: string };
}) {
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="apply" className="scroll-mt-24 border-t border-border-3">
      <div
        data-testid="careers-apply"
        className="container-site grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div>
          <Eyebrow>{t('jt.086')}</Eyebrow>
          <h2 className="mt-3 mb-3 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.087')}</h2>
          <p className="mb-6 text-body text-text-secondary">{t('jt.088')}</p>
          <ul className="flex flex-col gap-3">
            {WANTS.map(([title, body, tone]) => (
              <li key={title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-[10px] ${tone}`}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>
                  <strong className="block text-body font-extrabold text-ink">{t(title)}</strong>
                  <span className="text-body-sm text-text-tertiary">{t(body)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-lg border-[1.5px] border-tint-border bg-white shadow-[0_18px_44px_rgba(22,60,90,0.1)]">
          <div className="border-b border-border-2 bg-pale-1 px-6 py-4">
            <h3 className="text-body-lg text-ink">{t('jt.095')}</h3>
            <p className="mt-0.5 text-body-sm text-text-tertiary">{t('jt.096')}</p>
          </div>
          <div className="flex flex-wrap gap-3 p-6">
            <ContactCta
              placement="page_cta"
              href={waLink(settings.whatsappNumber, t('jt.286'))}
              external
              size="lg"
            >
              {sys('careers.apply.whatsapp')}
            </ContactCta>
            <ContactCta
              placement="page_cta"
              href={mailLink(settings.careersEmail, sys('careers.apply.emailSubject'))}
              variant="secondary"
              size="lg"
            >
              {t('jt.104')}
            </ContactCta>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import { routing } from '@/i18n/routing';
import { listOpenings } from '@/lib/careers';
import { mailLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { heroRoles, roleCards } from './_lib/roles';
import { CareersHero, WorkerNotice } from './_sections/Hero';
import { HiringSteps } from './_sections/HiringSteps';
import { OpenApplication } from './_sections/OpenApplication';
import { RolesSection } from './_sections/Roles';
import { WaysSection } from './_sections/Ways';

// The openings floor (docs/ARCHITECTURE.md § Freshness). A literal: Next reads segment config
// statically. No D17 dated badge here, so no 86,400 s rule (W150).
export const revalidate = 300;

/** The eight on-page pairs (design `faqList()`): the DOM and the FAQPage node from one source —
 *  never the design's seven hand-written JSON-LD answers. */
const FAQ = [
  ['jt.245', 'jt.246'],
  ['jt.247', 'jt.248'],
  ['jt.249', 'jt.250'],
  ['jt.251', 'jt.252'],
  ['jt.253', 'jt.254'],
  ['jt.255', 'jt.256'],
  ['jt.257', 'jt.258'],
  ['jt.259', 'jt.260'],
] as const;

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
  // The `careers` record has titleId/descriptionId '' — the page's own sys.seo copy (W23/W38).
  return buildMetadata({
    locale,
    href: '/careers',
    bundle,
    pageKey: 'careers',
    fallbackTitle: sys('seo.careers.title'),
    fallbackDescription: sys('seo.careers.description'),
  });
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys, openings] = await Promise.all([
    getBundle(locale),
    getTranslations('sys'),
    listOpenings(),
  ]);
  const t = makeTf(bundle, locale);
  const settings = bundle.settings;
  const cards = roleCards(openings, {
    locale,
    countries: getCollection(bundle, 'countries'),
    whatsappNumber: settings.whatsappNumber,
    now: new Date(),
    copy: {
      engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
      workMode: {
        REMOTE: sys('careers.workMode.REMOTE'),
        HYBRID: sys('careers.workMode.HYBRID'),
        ON_SITE: sys('careers.workMode.ON_SITE'),
      },
      posted: (date) => sys('careers.roles.posted', { date }),
      askIntro: t('jt.311'),
      askTail: t('jt.312'),
    },
  });

  return (
    <>
      <CareersHero
        t={t}
        locale={locale}
        openingsCount={cards.length}
        heroCards={heroRoles(cards)}
        sourceCountries={getCollection(bundle, 'sourceCountries')}
      />
      <WorkerNotice t={t} />
      <RolesSection t={t} cards={cards} />
      <WaysSection t={t} />
      <HiringSteps t={t} />
      <OpenApplication t={t} settings={settings} />
      <Section tone="pale" className="border-t border-border-3">
        <div data-testid="careers-faq" className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId="jt.111"
            headingId="jt.112"
            openFirst
            items={FAQ.map(([q, a]) => ({ id: q, q: t(q), a: t(a) }))}
            footer={
              // W102: the careers mailbox from settings, never the literal jt.114.
              <p className="mt-6 text-body-sm text-text-secondary">
                {t('jt.113')}{' '}
                <ContactLink
                  href={mailLink(settings.careersEmail)}
                  placement="page_cta"
                  className="font-extrabold text-blue-safe underline"
                >
                  {settings.careersEmail}
                </ContactLink>{' '}
                {t('jt.115')}
              </p>
            }
          />
        </div>
      </Section>
    </>
  );
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` initialiser delete the line `'/careers',` (only that one; `'/careers/[slug]',` leaves in Cycle 4 with the detail page, so `unbuilt.test.ts` is green at every commit).

`e2e/routes.ts` — inside `GATE_ROUTE_TABLE`, immediately before the comment line `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.` (after T7's and T10's rows, which sit there; T13, T3–T6, T8 and T9 appended theirs after the conversion row — order is irrelevant to every consumer, W21), add:

```ts
  { path: '/kariyer', indexable: true },
  { path: '/en/careers', indexable: true },
```

(No detail row, ever: `scripts/gate-routes.mjs` derives it from the live list — W93.)

`docs/SEO.md` — append one row to the `## Pages` table (after its last row):

```markdown
| Careers index | `/kariyer` · `/en/careers` | `sys.seo.careers.{title,description}` (record `careers`: `titleId`/`descriptionId` `''`, W23/W38); OG `/og/{locale}/careers.png` | `absoluteUrl(locale, '/careers')`; both hreflangs + `x-default` = TR | `BreadcrumbList` (Home → Join Our Team: `jt.021`, `jt.005`) from `Breadcrumbs`; `FAQPage` (`jt.245`–`260`, AEO only) from `FaqBlock`; **no `JobPosting`** (D15) | `h1` (`data-lcp-slot="h1"`; text-only dark hero — no image slot on this page) | live openings, ISR tag `openings`, `revalidate = 300`; the W6 empty state without a door; no Operations link (W89) |
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/careers" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `sections.test.tsx` (11 cases); `src/lib/seo/unbuilt.test.ts` (`'/careers'` now built, `'/careers/[slug]'` still listed); `src/app/sitemap.test.ts` (two more static URLs, still exactly static keys × locales); `src/design/__tests__/class-collisions.test.ts` (every class string above sets each property once per variant), `client-imports.test.ts` (by-path imports; `RolesList` imports only types from `@/lib/careers-pure` and `../_lib/roles`), `src/i18n/client-messages.test.ts` (`RolesList` calls no `useTranslations`), `src/messages/voice.test.ts`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/careers" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md
git commit -m "feat(careers): the careers index — live roles, W6 empty state, WhatsApp/e-mail open application (T11 c3)

Hero with the ICU count pill and the overseas role card (W1/W6/W10), the worker notice, the
RolesList island (SSR'd, resolved strings only — W13 amended/W148), the three ways (static,
W10), the process with the Admira AI badge (no Operations link — W89), the open application
as WhatsApp + e-mail only (W3), the FAQ from the eight on-page pairs. '/careers' leaves
UNBUILT_PATHNAMES (W20); /kariyer and /en/careers join GATE_ROUTE_TABLE (W21). SEO row.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the detail: `generateStaticParams` over the live slugs, the page's own metadata and alternates, `JobPosting`, the apply form → `careers` (CV first, residency lock, PK salary, W161 portfolio link, W56 e-mail branch), `career_apply_start`; `'/careers/[slug]'` leaves `UNBUILT_PATHNAMES`; SEO/ANALYTICS/INTEGRATIONS/PRD

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/careers/[slug]/__tests__/apply.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { FormActionError } from '@/forms/types';
import { OPENING, opening } from '@/test/careers';
import {
  applySchema,
  applyToFields,
  normaliseSalary,
  portfolioUrlProblem,
  type ApplyContext,
} from '../_lib/apply';
import { openingView, salaryLine, type OpeningViewCopy, type SalaryCopy } from '../_lib/view';

const pdf = () => new File(['%PDF-1.4\n%fixture\n'], 'cv.pdf', { type: 'application/pdf' });
const VALID = {
  openingSlug: OPENING.slug,
  name: 'Aziz Karimov',
  email: 'aziz@example.com',
  phone: '+998 90 123 45 67',
  country: 'UZ',
  city: '',
  language: '',
  expectedSalary: '',
  linkedinUrl: '',
  portfolioUrl: '',
  coverLetter: '',
  cv: pdf(),
};
const parse = (over: Record<string, unknown> = {}) => applySchema.parse({ ...VALID, ...over });
/** The codes the kernel would answer (src/forms/errors.ts), by field. */
const errorsOf = (over: Record<string, unknown>) => {
  const result = applySchema.safeParse({ ...VALID, ...over });
  return result.success ? {} : fieldErrorsFromIssues(result.error.issues);
};
const ctx = (over: Partial<ApplyContext> = {}): ApplyContext => ({
  opening: OPENING,
  upload: vi.fn(async () => ({ cvKey: 'careers-cv/abc-123.pdf' })),
  messages: { closed: 'closed-msg', portfolioGate: 'portfolio-msg' },
  ...over,
});

describe('applySchema — the careers catalog names, validated like the door', () => {
  it('parses a valid application, upper-cases the ISO-2 country and keeps the CV file', () => {
    const p = parse({ country: 'uz' });
    expect(p.country).toBe('UZ');
    expect(p.cv).toBeInstanceOf(File);
    expect(p.expectedSalary).toBeUndefined();
  });

  it('required before format: an empty name, e-mail, phone, country or CV reads `required`', () => {
    expect(errorsOf({ name: '', email: '', phone: '', country: '', cv: undefined })).toEqual({
      name: 'required',
      email: 'required',
      phone: 'required',
      country: 'required',
      cv: 'required',
    });
    expect(errorsOf({ cv: new File([], 'cv.pdf', { type: 'application/pdf' }) })).toEqual({
      cv: 'required',
    });
  });

  it('then the format: a bad e-mail, a short phone, a free-text country, a non-numeric salary', () => {
    expect(
      errorsOf({ email: 'nope', phone: '12 34', country: 'Uzbekistan', expectedSalary: 'a lot' }),
    ).toEqual({ email: 'email', phone: 'phone', country: 'invalid', expectedSalary: 'invalid' });
  });

  it('the catalog caps — city 100, language 300, cover letter 5000, LinkedIn 500 (length only at the door)', () => {
    expect(
      errorsOf({
        city: 'x'.repeat(101),
        language: 'x'.repeat(301),
        coverLetter: 'x'.repeat(5001),
        linkedinUrl: 'x'.repeat(501),
      }),
    ).toEqual({ city: 'max', language: 'max', coverLetter: 'max', linkedinUrl: 'max' });
    expect(errorsOf({ linkedinUrl: 'linkedin.com/in/aziz karimov' })).toEqual({});
  });

  it('a tampered slug the door would refuse', () => {
    expect(errorsOf({ openingSlug: 'Bad Slug' })).toEqual({ openingSlug: 'invalid' });
  });

  it('the expected salary: separators dropped, a whole number up to 100,000,000 (PublicApplyDto)', () => {
    expect(parse({ expectedSalary: '150.000' }).expectedSalary).toBe('150000');
    expect(parse({ expectedSalary: '1 500' }).expectedSalary).toBe('1500');
    expect(errorsOf({ expectedSalary: '100000001' })).toEqual({ expectedSalary: 'invalid' });
    expect(normaliseSalary("45'000")).toBe('45000');
  });
});

describe('portfolioUrlProblem — the door\'s v1.1 url rule (W161): never stricter, never looser', () => {
  it('accepts what the door accepts — a scheme-less link included', () => {
    for (const ok of [
      'behance.net/aziz',
      'https://aziz.example/work',
      'www.dribbble.com/aziz?tab=shots',
      'http://10.0.0.10/cv',
      '10.0.0.10',
      'http://[::1]/x',
    ])
      expect(portfolioUrlProblem(ok), ok).toBeNull();
  });

  it('refuses what the door refuses', () => {
    for (const bad of [
      '12345',
      '0555-123-4567',
      '+90 555 123 45 67',
      'see attached',
      'localhost:3000',
      'user:pw@site.com',
      'ftp://site.com/x',
      'mailto:a@b.com',
      'javascript:alert(1)',
    ])
      expect(portfolioUrlProblem(bad), bad).toBe('url');
  });

  it('measures the length after the door adds https:// (≤ 500)', () => {
    const long = `${'a'.repeat(488)}.com`; // 492 as typed, 500 once https:// is added
    expect(portfolioUrlProblem(long)).toBeNull();
    expect(portfolioUrlProblem(`a${long}`)).toBe('max'); // 493 as typed → 501
    expect(portfolioUrlProblem('x'.repeat(501))).toBe('max');
  });

  it('lands on the portfolioUrl field through the schema', () => {
    expect(errorsOf({ portfolioUrl: 'localhost' })).toEqual({ portfolioUrl: 'url' });
    expect(errorsOf({ portfolioUrl: 'behance.net/aziz' })).toEqual({});
  });
});

describe("applyToFields — the door's own rules, checked before the CV is uploaded", () => {
  it('uploads the CV and sends exactly the required catalog names — no empty field', async () => {
    const c = ctx();
    expect(await applyToFields(parse(), c)).toEqual({
      openingSlug: OPENING.slug,
      cvKey: 'careers-cv/abc-123.pdf',
      name: 'Aziz Karimov',
      email: 'aziz@example.com',
      phone: '+998 90 123 45 67',
      country: 'UZ',
    });
    expect(c.upload).toHaveBeenCalledTimes(1);
  });

  it('sends the optional fields when typed — the salary in the opening currency, never currentSalary', async () => {
    const fields = await applyToFields(
      parse({
        city: 'Tashkent',
        language: 'Uzbek, Russian',
        expectedSalary: '1000',
        linkedinUrl: 'linkedin.com/in/aziz',
        portfolioUrl: 'behance.net/aziz',
        coverLetter: 'Three institutes, one network.',
      }),
      ctx(),
    );
    expect(fields).toEqual({
      openingSlug: OPENING.slug,
      cvKey: 'careers-cv/abc-123.pdf',
      name: 'Aziz Karimov',
      email: 'aziz@example.com',
      phone: '+998 90 123 45 67',
      country: 'UZ',
      city: 'Tashkent',
      language: 'Uzbek, Russian',
      expectedSalary: '1000',
      expectedSalaryCurrency: 'USD',
      linkedinUrl: 'linkedin.com/in/aziz',
      portfolioUrl: 'behance.net/aziz',
      coverLetter: 'Three institutes, one network.',
    });
  });

  it("residency: a country other than the opening's lands on `country`, before any upload", async () => {
    const c = ctx();
    await expect(applyToFields(parse({ country: 'TR' }), c)).rejects.toMatchObject({
      field: { name: 'country', code: 'invalid' },
    });
    expect(c.upload).not.toHaveBeenCalled();
  });

  it('Pakistan: no expected salary lands on `expectedSalary`; with one it rides in PKR by default', async () => {
    const pk = opening({ country: 'PK', payCurrency: null });
    await expect(
      applyToFields(parse({ country: 'PK' }), ctx({ opening: pk })),
    ).rejects.toMatchObject({ field: { name: 'expectedSalary', code: 'required' } });
    expect(
      await applyToFields(parse({ country: 'PK', expectedSalary: '150.000' }), ctx({ opening: pk })),
    ).toMatchObject({ expectedSalary: '150000', expectedSalaryCurrency: 'PKR' });
  });

  it('W56: a portfolio opening is refused with the visitor message, before any upload', async () => {
    const c = ctx({ opening: opening({ portfolioRequired: true }) });
    const err = await applyToFields(parse(), c).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FormActionError);
    expect((err as FormActionError).visitorMessage).toBe('portfolio-msg');
    expect((err as FormActionError).field).toBeUndefined();
    expect(c.upload).not.toHaveBeenCalled();
  });

  it('a closed opening (null) or another slug is the closed message', async () => {
    await expect(applyToFields(parse(), ctx({ opening: null }))).rejects.toMatchObject({
      visitorMessage: 'closed-msg',
    });
    await expect(applyToFields(parse({ openingSlug: 'other-role' }), ctx())).rejects.toMatchObject({
      visitorMessage: 'closed-msg',
    });
  });

  it("the uploader's own refusal propagates untouched (a `file` field error or a door failure)", async () => {
    const refusal = new FormActionError('not a PDF', { name: 'cv', code: 'file' });
    await expect(
      applyToFields(parse(), ctx({ upload: vi.fn(async () => Promise.reject(refusal)) })),
    ).rejects.toBe(refusal);
  });
});

const SALARY: SalaryCopy = {
  range: (min, max) => `${min} – ${max}`,
  from: (amount) => `from ${amount}`,
  upTo: (amount) => `up to ${amount}`,
  per: (period) => `per ${period.toLowerCase()}`,
};

describe('salaryLine and openingView', () => {
  it('the pay line: range, from, up to, exact, hidden', () => {
    expect(salaryLine(OPENING, 'en', SALARY)).toBe('$800 – $1,200 · per month');
    expect(salaryLine(opening({ salaryPayType: 'STARTING', salaryMax: null }), 'en', SALARY)).toBe(
      'from $800 · per month',
    );
    expect(salaryLine(opening({ salaryPayType: 'MAXIMUM', salaryMin: null }), 'en', SALARY)).toBe(
      'up to $1,200 · per month',
    );
    expect(
      salaryLine(
        opening({
          salaryPayType: 'EXACT',
          salaryMin: '45000',
          salaryMax: '45000',
          salaryCurrency: 'TRY',
          salaryPeriod: null,
        }),
        'tr',
        SALARY,
      ),
    ).toBe('45.000 ₺');
    expect(salaryLine(opening({ salaryVisible: false }), 'en', SALARY)).toBeNull();
  });

  it('openingView resolves every string the detail sections render', () => {
    const copy: OpeningViewCopy = {
      engagement: { fullTime: 'Full-time', partTime: 'Part-time', project: 'Project-based' },
      workMode: { REMOTE: 'Remote', HYBRID: 'Hybrid', ON_SITE: 'On site' },
      posted: (date) => `Posted ${date}`,
      salary: SALARY,
      askIntro: 'Hello JobsAdmire, I have a question about the',
      askTail: 'role (',
    };
    expect(
      openingView(OPENING, {
        locale: 'en',
        countries: [{ code: 'UZ', name: 'Uzbekistan' }],
        copy,
        whatsappNumber: '905011240340',
        now: new Date('2026-09-20T00:00:00Z'),
      }),
    ).toEqual({
      countryName: 'Uzbekistan',
      location: 'Tashkent · Uzbekistan',
      workModes: 'Remote',
      languages: 'Uzbek, Russian, English',
      engagement: 'Full-time',
      posted: '15 September 2026',
      postedLine: 'Posted 15 September 2026',
      pay: '$800 – $1,200 · per month',
      isNew: true,
      salaryCurrency: 'USD',
      askHref: `https://wa.me/905011240340?text=${encodeURIComponent(
        'Hello JobsAdmire, I have a question about the Country Representative — Uzbekistan role (Tashkent · Uzbekistan)',
      )}`,
    });
  });
});
```

`src/app/[locale]/(site)/careers/[slug]/__tests__/detail.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeTf } from '@/content/pure';
import type { FormActionState } from '@/forms/types';
import en from '@/messages/en.json';
import { testBundle } from '@/test/bundle';
import { OPENING, opening } from '@/test/careers';
import { renderWithIntl } from '@/test/render';
import type { PublicOpening } from '@/lib/careers-pure';
import { openingView, type OpeningViewCopy } from '../_lib/view';
import { AboutRole } from '../_sections/AboutRole';
import { ApplySection } from '../_sections/ApplySection';
import { DetailHero } from '../_sections/DetailHero';

const JT = Object.fromEntries(
  Object.entries(
    (
      JSON.parse(
        readFileSync(join(process.cwd(), 'src/content/local/bundle.en.json'), 'utf8'),
      ) as { strings: Record<string, string> }
    ).strings,
  ).filter(([id]) => id.startsWith('jt.')),
);
const t = makeTf(testBundle({ strings: JT }), 'en');
const SYS = en.sys.careers;
const COPY: OpeningViewCopy = {
  engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
  workMode: SYS.workMode,
  posted: (date) => SYS.roles.posted.replace('{date}', date),
  salary: {
    range: (min, max) => SYS.salary.range.replace('{min}', min).replace('{max}', max),
    from: (amount) => SYS.salary.from.replace('{amount}', amount),
    upTo: (amount) => SYS.salary.upTo.replace('{amount}', amount),
    per: (period) => SYS.salary.per[period],
  },
  askIntro: t('jt.311'),
  askTail: t('jt.312'),
};
const view = (o: PublicOpening = OPENING) =>
  openingView(o, {
    locale: 'en',
    countries: [
      { code: 'UZ', name: 'Uzbekistan' },
      { code: 'PK', name: 'Pakistan' },
      { code: 'TR', name: 'Türkiye' },
    ],
    copy: COPY,
    whatsappNumber: '905011240340',
    now: new Date('2026-09-20T00:00:00Z'),
  });
const SETTINGS = {
  whatsappNumber: '905011240340',
  careersEmail: 'careers@jobsadmire.com',
  phone: '+905011240340',
  phoneDisplay: '+90 501 124 03 40',
  turnstileSiteKey: null,
};
const action = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const renderApply = (o: PublicOpening = OPENING) =>
  renderWithIntl(
    <ApplySection t={t} locale="en" opening={o} view={view(o)} settings={SETTINGS} action={action} />,
    { locale: 'en' },
  );

describe('ApplySection', () => {
  it('an ordinary opening: the careers form — hidden slug, locked country, CV, the v1.1 portfolio link, no salary field', () => {
    const { container } = renderApply();
    const form = screen.getByTestId('careers-apply-form');
    expect(form).toHaveAttribute('data-form-key', 'careers');
    expect(form.querySelector<HTMLInputElement>('input[name="openingSlug"]')?.value).toBe(
      OPENING.slug,
    );
    const country = form.querySelector<HTMLSelectElement>('select[name="country"]')!;
    expect([...country.options].map((o) => o.value)).toEqual(['', 'UZ']);
    expect(country.value).toBe('UZ');
    expect(
      screen.getByText(SYS.form.residency.replace('{country}', 'Uzbekistan')),
    ).toBeInTheDocument();
    expect(form.querySelector('input[name="expectedSalary"]')).toBeNull();
    expect(form.querySelector('input[name="cv"]')).toHaveAttribute('accept', 'application/pdf,.pdf');
    expect(form.querySelector('input[name="portfolioUrl"]')).not.toBeNull();
    expect(form.querySelector('input[name="linkedinUrl"]')).not.toBeNull();
    expect(within(form).getByRole('checkbox')).toHaveAttribute('name', 'consent');
    expect(within(form).getByRole('button', { name: t('jt.103') })).toHaveAttribute('type', 'submit');
    expect(screen.queryByTestId('careers-email-apply')).toBeNull();
    expect(container.querySelector('a[href*="operations.jobsadmire.com"]')).toBeNull();
  });

  it('a Pakistan opening asks for the expected salary, quoted in the opening currency', () => {
    renderApply(opening({ slug: 'sourcing-coordinator-pakistan', country: 'PK', payCurrency: 'PKR' }));
    const salary = screen
      .getByTestId('careers-apply-form')
      .querySelector('input[name="expectedSalary"]');
    expect(salary).toHaveAttribute('aria-required', 'true');
    expect(salary).toHaveAttribute('inputmode', 'numeric');
    expect(
      screen.getByText(SYS.form.expectedSalaryHint.replace('{currency}', 'PKR')),
    ).toBeInTheDocument();
  });

  it('a portfolio opening applies by e-mail — no form (W56)', () => {
    renderApply(
      opening({
        slug: 'content-seo-specialist-antalya',
        title: 'Content & SEO Specialist',
        country: 'TR',
        portfolioRequired: true,
      }),
    );
    expect(screen.queryByTestId('careers-apply-form')).toBeNull();
    const panel = screen.getByTestId('careers-email-apply');
    const subject = SYS.emailPanel.subject.replace('{title}', 'Content & SEO Specialist');
    expect(within(panel).getByRole('link', { name: SYS.emailPanel.email })).toHaveAttribute(
      'href',
      `mailto:careers@jobsadmire.com?subject=${encodeURIComponent(subject)}`,
    );
    expect(
      within(panel).getByRole('link', { name: t('jt.117') }).getAttribute('href'),
    ).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    expect(panel).toHaveTextContent('careers@jobsadmire.com');
  });
});

describe('DetailHero and AboutRole', () => {
  it('the hero: the title as the tagged h1 and only LCP slot, a three-item trail, the pay line, the two CTAs', () => {
    const { container } = renderWithIntl(
      <DetailHero t={t} locale="en" opening={OPENING} view={view()} />,
      { locale: 'en' },
    );
    expect(screen.getByTestId('page-h1')).toHaveTextContent('Country Representative — Uzbekistan');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    const trail = screen.getByRole('navigation', { name: en.sys.nav.breadcrumbs });
    expect(within(trail).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByTestId('careers-pay')).toHaveTextContent('$800 – $1,200 · per month');
    expect(screen.getByRole('link', { name: t('jt.053') }).getAttribute('href')).toBe(
      view().askHref,
    );
    expect(screen.getByRole('link', { name: t('jt.052') })).toHaveAttribute('href', '#apply');
  });

  it('about the role: the description as text blocks, the facts, the way back', () => {
    renderWithIntl(<AboutRole opening={OPENING} view={view()} engagementLabel={t('jt.049')} />, {
      locale: 'en',
    });
    expect(within(screen.getByTestId('careers-description')).getAllByRole('listitem')).toHaveLength(3);
    const facts = screen.getByTestId('careers-facts');
    expect(facts).toHaveTextContent('Tashkent · Uzbekistan');
    expect(facts).toHaveTextContent('Uzbek, Russian, English');
    expect(facts).toHaveTextContent('$800 – $1,200 · per month');
    expect(screen.getByRole('link', { name: SYS.detail.back })).toHaveAttribute('href', '/en/careers');
  });
});
```

`src/app/[locale]/(site)/careers/__tests__/ids.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROUTE = join(process.cwd(), 'src/app/[locale]/(site)/careers');

/** Every non-test module of both careers routes. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}
/** Comments may name an id the page does not render; only code counts. */
const code = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const READ = new Set(
  sources(ROUTE).flatMap((file) => code(readFileSync(file, 'utf8')).match(/\bjt\.\d{3}\b/g) ?? []),
);
const bundleStrings = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `jt.${String(from + i).padStart(3, '0')}`);
/** Never rendered: the chrome copies (R15), the TR-hard-typed count, the Operations links (W89),
 *  the duties/wants split and expand panel, the speculative form (W3), the literal mailbox
 *  (W102), the category label, the nine fixture roles (D23), the country chips (D17), the
 *  composed counts and the removed form's WhatsApp body. */
const NEVER = new Set([
  ...range(1, 4),
  ...range(6, 20),
  'jt.025',
  'jt.047',
  'jt.050',
  'jt.051',
  'jt.085',
  'jt.097',
  'jt.098',
  'jt.101',
  'jt.102',
  ...range(105, 110),
  'jt.114',
  'jt.116',
  ...range(118, 244),
  'jt.284',
  'jt.285',
  'jt.287',
  'jt.288',
  ...range(289, 305),
  ...range(307, 310),
  ...range(313, 321),
]);

describe('the package ids both careers routes read (W9/W23)', () => {
  it('reads 124 ids, every one present in both committed bundles', () => {
    expect(READ.size).toBe(124);
    for (const locale of ['tr', 'en'] as const) {
      const strings = bundleStrings(locale);
      expect(
        [...READ].filter((id) => strings[id] === undefined),
        locale,
      ).toEqual([]);
    }
  });

  it('never reads the fixture roles, the speculative form, the Operations links, the composed counts or the chrome copies', () => {
    expect([...READ].filter((id) => NEVER.has(id)).sort()).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/careers"
```

Expected: `apply.test.ts` and `detail.test.tsx` FAIL to import (`Cannot find module '../_lib/apply'`, `'../_lib/view'`, `'../_sections/ApplySection'`); `ids.test.ts` FAILS its count (`expected 122 to be 124` — the index reads 122 ids; `jt.103` and `jt.117` arrive with the detail); the Cycle 2–3 files stay green.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/careers/[slug]/_lib/apply.ts`:

```ts
import { z } from 'zod';
import { FormActionError } from '@/forms/types';
import type { WireFields } from '@/forms/wire';
import {
  OPENING_SLUG_RE,
  PORTFOLIO_GATE_RELAXED,
  salaryCurrencyOf,
  type PublicOpening,
} from '@/lib/careers-pure';

// Catalog v1.1 `careers.portfolioUrl` — the door's `url` type (website ruling W161; source read at
// Operations 47a2160, apps/backend/src/modules/website/website-form-catalog.ts), mirrored exactly:
// a value the door would 400 never leaves the site (a 400 is the visitor's `invalid` panel), and
// the site never refuses what the door accepts — a scheme-less link is fine, the door adds
// https:// BEFORE its ≤ 500 check.
const SCHEME_RE = /^[a-z][a-z0-9+.-]*:\/\//i;
const DIGITS_OR_PHONE_RE = /^[+\s()\d-]+$/;
const IPV6_LITERAL_RE = /^\[[0-9a-f:]+\]$/i;
export const PORTFOLIO_URL_MAX = 500;

/** Why the door would refuse this portfolio link — `max` or `url` (a `sys.form.errors.*`
 *  code) — or null when it would take it. */
export function portfolioUrlProblem(value: string): 'url' | 'max' | null {
  if (value.length > PORTFOLIO_URL_MAX) return 'max';
  // Whitespace, or only digits/phone punctuation (WHATWG would read `123` as an IPv4 host).
  if (/\s/.test(value) || DIGITS_OR_PHONE_RE.test(value.replace(SCHEME_RE, ''))) return 'url';
  const normalised = SCHEME_RE.test(value) ? value : `https://${value}`;
  if (normalised.length > PORTFOLIO_URL_MAX) return 'max';
  let url: URL;
  try {
    url = new URL(normalised);
  } catch {
    return 'url';
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'url';
  if (url.username !== '' || url.password !== '') return 'url';
  if (IPV6_LITERAL_RE.test(url.hostname)) return null;
  return /^[^\s]+\.[a-z0-9-]{2,}$/i.test(url.hostname) ? null : 'url';
}

/** "150.000", "150 000", "150,000" → "150000": the separators people type are not the number. */
export const normaliseSalary = (value: string) => value.replace(/[\s.,'’_]/g, '');

const optionalText = (max: number) => z.string().max(max).optional();

/**
 * The apply form in the door's `careers` catalog names (v1.0 + the v1.1 `portfolioUrl`) plus the
 * CV file. `.min(1)` comes before `.email()` so an empty field reads `required`, not `email`
 * (src/forms/errors.ts). The kernel trims every string first. The residency lock, Pakistan's
 * salary and the portfolio gate need the opening, so they live in `applyToFields`.
 */
export const applySchema = z.object({
  openingSlug: z.string().regex(OPENING_SLUG_RE),
  name: z.string().min(1).max(200),
  email: z.string().min(1).max(254).email(),
  phone: z
    .string()
    .min(1)
    .max(40)
    .refine((v) => v.replace(/\D/g, '').length >= 8, { message: 'phone' }),
  country: z
    .string()
    .min(1)
    .regex(/^[A-Za-z]{2}$/)
    .transform((v) => v.toUpperCase()),
  city: optionalText(100),
  language: optionalText(300),
  expectedSalary: z
    .string()
    .optional()
    .transform((v) => (v ? normaliseSalary(v) : undefined))
    .refine((v) => v === undefined || (/^\d{1,9}$/.test(v) && Number(v) <= 100_000_000), {
      message: 'invalid',
    }),
  // Length only — the door does not retype LinkedIn (its handler adds https:// and drops junk).
  linkedinUrl: optionalText(500),
  portfolioUrl: z
    .string()
    .optional()
    .superRefine((v, issue) => {
      const problem = v ? portfolioUrlProblem(v) : null;
      if (problem) issue.addIssue({ code: z.ZodIssueCode.custom, message: problem });
    }),
  coverLetter: optionalText(5000),
  // The browser posts an empty File when nothing was picked: a missing and an empty file both
  // read `required` (one predicate, so nothing ever inspects a missing value).
  cv: z.custom<File>(
    (value) => typeof File !== 'undefined' && value instanceof File && value.size > 0,
    { message: 'required' },
  ),
});
export type ApplyInput = z.infer<typeof applySchema>;

export type ApplyContext = {
  /** The opening as Operations serves it now (`getOpening`) — null when it closed or never existed. */
  opening: PublicOpening | null;
  /** `uploadCv` in production: the form's one file, in this action call (W73/W116). */
  upload: (file: File) => Promise<{ cvKey: string }>;
  messages: { closed: string; portfolioGate: string };
};

/**
 * Parsed input → the exact wire fields of the `careers` catalog. Every rule the door would
 * enforce after the upload is enforced here first, so a visitor never lands on the fallback
 * panel for a mistake the page can name: a closed opening, W56's portfolio gate, the residency
 * rule (owner rule 2026-07-24 — the page offers only the opening's country, so only a crafted
 * request trips it), Pakistan's expected salary (owner rule 2026-07-23). Then the CV goes to
 * the public upload door; its refusal (`file`) or failure (the panel) propagates untouched.
 * Never `currentSalary*`: the design has no such field.
 */
export async function applyToFields(p: ApplyInput, ctx: ApplyContext): Promise<WireFields> {
  const { opening } = ctx;
  if (!opening || opening.slug !== p.openingSlug) throw new FormActionError(ctx.messages.closed);
  if (opening.portfolioRequired && !PORTFOLIO_GATE_RELAXED)
    throw new FormActionError(ctx.messages.portfolioGate);
  if (p.country !== opening.country)
    throw new FormActionError('', { name: 'country', code: 'invalid' });
  if (opening.country === 'PK' && !p.expectedSalary)
    throw new FormActionError('', { name: 'expectedSalary', code: 'required' });
  const { cvKey } = await ctx.upload(p.cv);

  const fields: WireFields = {
    openingSlug: opening.slug,
    cvKey,
    name: p.name,
    email: p.email,
    phone: p.phone,
    country: p.country,
  };
  if (p.city) fields.city = p.city;
  if (p.language) fields.language = p.language;
  if (p.expectedSalary) {
    fields.expectedSalary = p.expectedSalary;
    const currency = salaryCurrencyOf(opening);
    if (currency) fields.expectedSalaryCurrency = currency;
  }
  if (p.linkedinUrl) fields.linkedinUrl = p.linkedinUrl;
  if (p.portfolioUrl) fields.portfolioUrl = p.portfolioUrl;
  if (p.coverLetter) fields.coverLetter = p.coverLetter;
  return fields;
}
```

`src/app/[locale]/(site)/careers/[slug]/_lib/view.ts`:

```ts
import type { Locale } from '@/i18n/routing';
import {
  countryNameOf,
  ENGAGEMENT_OF,
  formatMoney,
  isNewOpening,
  languagesOf,
  locationOf,
  salaryCurrencyOf,
  salaryPartsOf,
  workModesOf,
  type Engagement,
  type PublicOpening,
  type SalaryPeriod,
  type WorkMode,
} from '@/lib/careers-pure';
import { formatDate } from '@/lib/format/date/formatDate';
import { askHrefOf } from '../../_lib/roles';

/** `sys.careers.salary.*` as closures (the page binds next-intl; the tests plain templates). */
export type SalaryCopy = {
  range: (min: string, max: string) => string;
  from: (amount: string) => string;
  upTo: (amount: string) => string;
  per: (period: SalaryPeriod) => string;
};

/** The pay line — null when the opening hides its pay; the money through `formatTRY` or Intl. */
export function salaryLine(o: PublicOpening, locale: Locale, copy: SalaryCopy): string | null {
  const parts = salaryPartsOf(o);
  if (!parts) return null;
  const money = (n: number) => formatMoney(n, parts.currency, locale);
  const amount =
    parts.kind === 'range' && parts.min !== null && parts.max !== null
      ? copy.range(money(parts.min), money(parts.max))
      : parts.kind === 'from' && parts.min !== null
        ? copy.from(money(parts.min))
        : parts.kind === 'upTo' && parts.max !== null
          ? copy.upTo(money(parts.max))
          : money(parts.min ?? parts.max ?? 0);
  return parts.period ? `${amount} · ${copy.per(parts.period)}` : amount;
}

export type OpeningViewCopy = {
  engagement: Record<Engagement, string>;
  workMode: Record<WorkMode, string>;
  posted: (date: string) => string;
  salary: SalaryCopy;
  askIntro: string;
  askTail: string;
};

/** Every string the detail sections render, resolved once on the server. */
export type OpeningView = {
  countryName: string;
  location: string;
  workModes: string;
  languages: string;
  engagement: string;
  posted: string;
  postedLine: string;
  pay: string | null;
  isNew: boolean;
  salaryCurrency: string | null;
  askHref: string;
};

export function openingView(
  o: PublicOpening,
  ctx: {
    locale: Locale;
    countries: ReadonlyArray<{ code: string; name: string }>;
    copy: OpeningViewCopy;
    whatsappNumber: string;
    now: Date;
  },
): OpeningView {
  const countryName = countryNameOf(o.country, ctx.countries, ctx.locale);
  const location = locationOf(o, countryName);
  const posted = formatDate(o.postedAt, ctx.locale);
  return {
    countryName,
    location,
    workModes: workModesOf(o)
      .map((mode) => ctx.copy.workMode[mode])
      .join(' · '),
    languages: languagesOf(o).join(', '),
    engagement: ctx.copy.engagement[ENGAGEMENT_OF[o.category]],
    posted,
    postedLine: ctx.copy.posted(posted),
    pay: salaryLine(o, ctx.locale, ctx.copy.salary),
    isNew: isNewOpening(o.postedAt, ctx.now),
    salaryCurrency: salaryCurrencyOf(o),
    askHref: askHrefOf(ctx.whatsappNumber, ctx.copy, o.title, location),
  };
}
```

`src/app/[locale]/(site)/careers/[slug]/actions.ts`:

```ts
'use server';
import { getTranslations } from 'next-intl/server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { uploadCv } from '@/forms/uploads';
import { getOpening } from '@/lib/careers';
import { applySchema, applyToFields } from './_lib/apply';

/**
 * The per-opening application → form key `careers` (CAREERS_APPLY, I5). The opening is read
 * again here — the rules are checked against what Operations serves now, never against what
 * the page sent — and the CV goes to the public upload door first, inside this one action call
 * (W73/W116). An Operations outage while reading the opening throws out of `toFields`, which the
 * kernel answers with the `unavailable` panel (D11). Success is `/tesekkurler?form=careers` (D13).
 */
const submit = createFormAction({
  key: 'careers',
  schema: applySchema,
  consent: 'checkbox',
  toFields: async (parsed, _data, { locale }) => {
    const sys = await getTranslations({ locale, namespace: 'sys' });
    return applyToFields(parsed, {
      opening: await getOpening(parsed.openingSlug),
      upload: (file) => uploadCv(file, { field: 'cv' }),
      messages: {
        closed: sys('careers.form.closed'),
        portfolioGate: sys('careers.form.portfolioGate'),
      },
    });
  },
});

export async function submitCareersApplication(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return submit(prev, data);
}
```

`src/app/[locale]/(site)/careers/[slug]/_components/ApplyStartPing.tsx`:

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { track } from '@/analytics/track';

/** W12/W26/W67: `career_apply_start` once per page view, on the visitor's first focus inside the
 *  apply form. `slug` is the opening's public URL segment (≤ 80 characters), never anything a
 *  visitor typed; `page` is the real URL from `next/navigation` (R35), not next-intl's internal
 *  key. An inert marker finds its form, so `FormShell` needs no ref. */
export function ApplyStartPing({ slug }: { slug: string }) {
  const marker = useRef<HTMLSpanElement>(null);
  const page = usePathname() ?? '/';
  const locale = useLocale();
  useEffect(() => {
    const form = marker.current?.closest('form');
    if (!form) return;
    const onFirstFocus = () => {
      track('career_apply_start', { page, locale, slug: slug.slice(0, 80) });
      form.removeEventListener('focusin', onFirstFocus);
    };
    form.addEventListener('focusin', onFirstFocus);
    return () => form.removeEventListener('focusin', onFirstFocus);
  }, [page, locale, slug]);
  return <span ref={marker} hidden />;
}
```

`src/app/[locale]/(site)/careers/[slug]/_sections/DetailHero.tsx`:

```tsx
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { buttonClassName } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { detailHref, type PublicOpening } from '@/lib/careers-pure';
import type { Tf } from '../../_lib/roles';
import type { OpeningView } from '../_lib/view';

const HERO_BG = 'bg-[linear-gradient(158deg,#253063_0%,#1c2652_50%,#131c40_100%)]';

/** The detail hero: the trail (Home → Join Our Team → the role — this page's own ids, W109), the
 *  engagement and "New", the title as the h1 (the named LCP element, D26), place / work mode /
 *  posted, the pay line when the opening shows it, "Apply for this role" (#apply) and "Ask a
 *  question first" on WhatsApp (page data only in the prefill, W95). */
export function DetailHero({
  t,
  locale,
  opening,
  view,
}: {
  t: Tf;
  locale: Locale;
  opening: PublicOpening;
  view: OpeningView;
}) {
  return (
    <Section tone="dark" className={`pt-8 ${HERO_BG}`}>
      <div className="container-site">
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('jt.021'), href: '/' },
            { name: t('jt.005'), href: '/careers' },
            { name: opening.title, href: detailHref(opening.slug) },
          ]}
        />
        <div className="mt-6 max-w-[820px]">
          <p className="flex flex-wrap items-center gap-2 text-eyebrow font-extrabold uppercase tracking-[0.1em] text-sky">
            <span>{view.engagement}</span>
            {view.isNew && (
              <span className="rounded-pill bg-success-surface px-2 py-0.5 text-success-text">
                {t('jt.033')}
              </span>
            )}
          </p>
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="mt-3 text-h1 leading-[1.05] tracking-[-0.03em] text-white"
          >
            {opening.title}
          </h1>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-body font-bold text-[#c1cbe6]">
            <span>{view.location}</span>
            {view.workModes && <span>{view.workModes}</span>}
            <span>{view.postedLine}</span>
          </p>
          {view.pay && (
            <p data-testid="careers-pay" className="mt-2 text-body-lg font-extrabold text-white">
              {view.pay}
            </p>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#apply" className={buttonClassName('primary', 'lg')}>
              {t('jt.052')}
            </a>
            <ContactCta placement="page_cta" href={view.askHref} external variant="inverse" size="lg">
              {t('jt.053')}
            </ContactCta>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/[slug]/_sections/AboutRole.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { descriptionBlocks, type PublicOpening } from '@/lib/careers-pure';
import type { OpeningView } from '../_lib/view';

/** The opening's one description as paragraphs and lists (text only, never HTML) and the "At a
 *  glance" facts — rows with no value are left out. */
export function AboutRole({
  opening,
  view,
  engagementLabel,
}: {
  opening: PublicOpening;
  view: OpeningView;
  /** `jt.049` */
  engagementLabel: string;
}) {
  const sys = useTranslations('sys');
  const blocks = descriptionBlocks(opening.description);
  const facts: [string, string][] = [
    [sys('careers.detail.facts.location'), view.location],
    [sys('careers.detail.facts.workMode'), view.workModes],
    [engagementLabel, view.engagement],
    [sys('careers.detail.facts.languages'), view.languages],
    [sys('careers.detail.facts.salary'), view.pay ?? ''],
    [sys('careers.detail.facts.posted'), view.posted],
  ];
  return (
    <Section tone="light">
      <div className="container-site grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <h2 className="mb-4 text-h2 leading-[1.05] tracking-[-0.04em]">
            {sys('careers.detail.about')}
          </h2>
          {blocks.length > 0 && (
            <div data-testid="careers-description" className="flex flex-col gap-4 text-body text-text-secondary">
              {blocks.map((block, i) =>
                block.type === 'p' ? (
                  <p key={i}>{block.text}</p>
                ) : (
                  <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          )}
          <p className="mt-8">
            <Link href="/careers" className="font-extrabold text-blue-safe underline">
              <span aria-hidden="true">← </span>
              {sys('careers.detail.back')}
            </Link>
          </p>
        </div>
        <div data-testid="careers-facts" className="rounded-lg border border-border-2 bg-pale-1 p-6">
          <h2 className="mb-3 text-card-title">{sys('careers.detail.facts.title')}</h2>
          <dl>
            {facts
              .filter(([, value]) => value.length > 0)
              .map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 border-b border-border-3 py-2 last:border-b-0">
                  <dt className="text-eyebrow font-extrabold uppercase tracking-[0.08em] text-text-tertiary">
                    {label}
                  </dt>
                  <dd className="text-body-sm font-bold text-ink">{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/[slug]/_sections/ApplySection.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import { PORTFOLIO_GATE_RELAXED, type PublicOpening } from '@/lib/careers-pure';
import { mailLink, waLink } from '@/lib/contact';
import type { Tf } from '../../_lib/roles';
import { ApplyStartPing } from '../_components/ApplyStartPing';
import type { OpeningView } from '../_lib/view';

type ApplySettings = {
  whatsappNumber: string;
  careersEmail: string;
  phone: string;
  phoneDisplay: string;
  turnstileSiteKey: string | null;
};

/** W56: the apply-by-e-mail panel for an opening that needs a portfolio document. */
function EmailApply({
  t,
  settings,
  title,
  whatsappText,
}: {
  t: Tf;
  settings: ApplySettings;
  title: string;
  whatsappText: string;
}) {
  const sys = useTranslations('sys');
  const subject = sys('careers.emailPanel.subject', { title });
  return (
    <div
      data-testid="careers-email-apply"
      className="rounded-lg border-[1.5px] border-dashed border-tint-border bg-white p-6 md:p-8"
    >
      <h3 className="text-card-title text-ink">{sys('careers.emailPanel.title')}</h3>
      <p className="mt-2 mb-3 text-body-sm text-text-secondary">
        {sys('careers.emailPanel.body', { email: settings.careersEmail })}
      </p>
      <p className="mb-5 rounded-sm bg-pale-1 px-3 py-2 font-mono text-body-sm text-ink">{subject}</p>
      <div className="flex flex-wrap gap-3">
        <ContactCta placement="page_cta" href={mailLink(settings.careersEmail, subject)} size="lg">
          {sys('careers.emailPanel.email')}
        </ContactCta>
        <ContactCta
          placement="page_cta"
          href={waLink(settings.whatsappNumber, whatsappText)}
          external
          variant="secondary"
          size="lg"
        >
          {t('jt.117')}
        </ContactCta>
      </div>
    </div>
  );
}

/**
 * `#apply` on the detail page: the form → `careers` (W3), or — for a `portfolioRequired` opening —
 * the e-mail panel (W56). The country select offers ONLY the opening's country (the residency
 * lock — a `Field` with its `defaultValue`, W108); the expected salary is rendered and required
 * for Pakistan openings only; `portfolioUrl` is the v1.1 field; the consent tick links `/privacy`
 * (the kernel's default, W79/W102). Labels are `sys.form.labels.*` (W115: the package has none
 * for this form). The fallback panel's WhatsApp prefill starts with the role (page data) and
 * adds what the visitor typed only at click time (W76).
 */
export function ApplySection({
  t,
  locale,
  opening,
  view,
  settings,
  action,
}: {
  t: Tf;
  locale: Locale;
  opening: PublicOpening;
  view: OpeningView;
  settings: ApplySettings;
  action: (prev: FormActionState, data: FormData) => Promise<FormActionState>;
}) {
  const sys = useTranslations('sys');
  const whatsappIntro = sys('careers.detail.whatsappIntro', { title: opening.title });
  const byEmail = opening.portfolioRequired && !PORTFOLIO_GATE_RELAXED;
  return (
    <Section tone="pale" id="apply" className="scroll-mt-24 border-t border-border-3">
      <div className="container-site">
        <div data-testid="careers-detail-apply" className="max-w-[860px]">
          <h2 className="mb-2 text-h2 leading-[1.05] tracking-[-0.04em]">{t('jt.052')}</h2>
          <p className="mb-6 text-body text-text-secondary">{sys('careers.detail.applyLead')}</p>
          {byEmail ? (
            <EmailApply t={t} settings={settings} title={opening.title} whatsappText={whatsappIntro} />
          ) : (
            <div className="rounded-lg border-[1.5px] border-tint-border bg-white p-6 shadow-[0_18px_44px_rgba(22,60,90,0.1)] md:p-8">
              <FormShell
                action={action}
                formKey="careers"
                locale={locale}
                turnstileSiteKey={settings.turnstileSiteKey}
                whatsappNumber={settings.whatsappNumber}
                whatsappIntro={whatsappIntro}
                contact={{
                  phone: settings.phone,
                  phoneDisplay: settings.phoneDisplay,
                  email: settings.careersEmail,
                }}
                submitLabel={t('jt.103')}
                consent="checkbox"
                testId="careers-apply-form"
              >
                <ApplyStartPing slug={opening.slug} />
                <input type="hidden" name="openingSlug" defaultValue={opening.slug} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="name" required autoComplete="name" maxLength={200} />
                  <Field name="email" type="email" required autoComplete="email" inputMode="email" maxLength={254} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="phone" type="tel" required autoComplete="tel" inputMode="tel" maxLength={40} />
                  <Field
                    name="country"
                    as="select"
                    required
                    defaultValue={opening.country}
                    options={[{ value: opening.country, label: view.countryName }]}
                    hint={sys('careers.form.residency', { country: view.countryName })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="city" autoComplete="address-level2" maxLength={100} />
                  <Field name="language" maxLength={300} />
                </div>
                {opening.country === 'PK' && (
                  <Field
                    name="expectedSalary"
                    required
                    inputMode="numeric"
                    maxLength={15}
                    hint={sys('careers.form.expectedSalaryHint', {
                      currency: view.salaryCurrency ?? 'PKR',
                    })}
                  />
                )}
                <Field name="cv" type="file" accept="application/pdf,.pdf" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="linkedinUrl" type="url" inputMode="url" maxLength={500} />
                  <Field name="portfolioUrl" type="url" inputMode="url" maxLength={500} />
                </div>
                <Field name="coverLetter" as="textarea" rows={5} maxLength={5000} />
              </FormShell>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/careers/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeTf } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { Section } from '@/design/primitives/Section';
import { routing } from '@/i18n/routing';
import { getOpening, listOpenings } from '@/lib/careers';
import {
  baseSalaryOf,
  countryNameOf,
  detailHref,
  employmentTypeOf,
  locationOf,
  summaryOf,
} from '@/lib/careers-pure';
import { JsonLd } from '@/lib/seo/JsonLdScript';
import { jobPostingJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl, pageOgImageUrl } from '@/lib/seo/routes';
import { HiringSteps } from '../_sections/HiringSteps';
import { submitCareersApplication } from './actions';
import { openingView } from './_lib/view';
import { AboutRole } from './_sections/AboutRole';
import { ApplySection } from './_sections/ApplySection';
import { DetailHero } from './_sections/DetailHero';

// The openings floor (docs/ARCHITECTURE.md § Freshness) — a literal, read statically by Next.
export const revalidate = 300;

/** Every current opening, prerendered in both locales (the Operations slug is the same in both);
 *  a later one renders on demand (`dynamicParams`), an unknown one 404s. Without a door: `[]`. */
export async function generateStaticParams() {
  return (await listOpenings()).map((o) => ({ slug: o.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const opening = await getOpening(slug);
  if (!opening) notFound();
  const [bundle, sys] = await Promise.all([
    getBundle(locale),
    getTranslations({ locale, namespace: 'sys' }),
  ]);
  const location = locationOf(
    opening,
    countryNameOf(opening.country, getCollection(bundle, 'countries'), locale),
  );
  const href = detailHref(opening.slug);
  return buildMetadata({
    locale,
    href,
    bundle,
    // W124: the `careersDetail` template record carries no per-page SEO field — these win.
    pageKey: 'careersDetail',
    fallbackTitle: sys('careers.detail.metaTitle', { title: opening.title }),
    fallbackDescription:
      summaryOf(opening.description, 155) ||
      sys('careers.detail.metaDescription', { title: opening.title, location }),
    // W17/D16: the Operations slug is the same in both locales — both alternates named.
    alternates: { tr: href, en: href },
    // W169: the OG route draws `sys.seo.<pageKey>.title` without values, so a template page cannot
    // carry a per-opening OG title: every opening shares the index's image (T12's pattern) and
    // its title template is `sys.careers.detail.metaTitle`, never a `sys.seo.*` key.
    openGraph: { images: [pageOgImageUrl(locale, 'careers')] },
  });
}

export default async function CareerDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const opening = await getOpening(slug);
  if (!opening) notFound();
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const t = makeTf(bundle, locale);
  const settings = bundle.settings;
  const view = openingView(opening, {
    locale,
    countries: getCollection(bundle, 'countries'),
    whatsappNumber: settings.whatsappNumber,
    now: new Date(),
    copy: {
      engagement: { fullTime: t('jt.099'), partTime: t('jt.100'), project: t('jt.073') },
      workMode: {
        REMOTE: sys('careers.workMode.REMOTE'),
        HYBRID: sys('careers.workMode.HYBRID'),
        ON_SITE: sys('careers.workMode.ON_SITE'),
      },
      posted: (date) => sys('careers.roles.posted', { date }),
      salary: {
        range: (min, max) => sys('careers.salary.range', { min, max }),
        from: (amount) => sys('careers.salary.from', { amount }),
        upTo: (amount) => sys('careers.salary.upTo', { amount }),
        per: (period) => sys(`careers.salary.per.${period}`),
      },
      askIntro: t('jt.311'),
      askTail: t('jt.312'),
    },
  });
  const href = detailHref(opening.slug);

  return (
    <>
      {/* D15: JobPosting on the detail page only, from the live opening — datePosted is the API's
          postedAt; no validThrough, the API has none (D17). */}
      <JsonLd
        data={jobPostingJsonLd({
          title: opening.title,
          description: opening.description ?? opening.title,
          url: absoluteUrl(locale, href),
          datePosted: opening.postedAt,
          employmentType: employmentTypeOf(opening),
          hiringOrganization: settings,
          jobLocation: {
            city: opening.cities[0] ?? opening.city ?? view.countryName,
            country: opening.country,
          },
          baseSalary: baseSalaryOf(opening),
          identifier: opening.slug,
        })}
      />
      <DetailHero t={t} locale={locale} opening={opening} view={view} />
      <AboutRole opening={opening} view={view} engagementLabel={t('jt.049')} />
      <ApplySection
        t={t}
        locale={locale}
        opening={opening}
        view={view}
        settings={settings}
        action={submitCareersApplication}
      />
      <Section tone="light">
        <div className="container-site">
          <div className="max-w-[860px]">
            <HiringSteps t={t} variant="compact" />
          </div>
        </div>
      </Section>
    </>
  );
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` initialiser delete the line `'/careers/[slug]',`. (`scripts/gate-routes.test.ts`'s "agrees with UNBUILT_PATHNAMES" case and its stderr case follow on their own: `careersDetailPageBuilt()` turns true in the same commit, and with no `OPS_API_URL` the script now prints `detail rows skipped (door not configured)`.)

`docs/SEO.md` — two edits:

1. Append one row to the `## Pages` table (after the careers index row):

```markdown
| Careers detail | `/kariyer/<slug>` · `/en/careers/<slug>` | `sys.careers.detail.metaTitle` (`{title}`) / the opening's first paragraph (≤ 155 characters), else `sys.careers.detail.metaDescription` — W124: the `careersDetail` template record carries no per-page SEO field; OG = the index's `/og/{locale}/careers.png` through `openGraph.images` (no `sys.seo.careersDetail.*`, W169 — the OG route would draw a `{title}` template raw) | `absoluteUrl(locale, { pathname: '/careers/[slug]', params: { slug } })`; `alternates: { tr, en }` = the same Operations slug (W17/D16) | `BreadcrumbList` (Home → Join Our Team → the role); `JobPosting` from `jobPostingJsonLd` (see § JSON-LD) | `h1` (`data-lcp-slot="h1"` — the opening's title) | prerendered for the live slugs (`generateStaticParams`), later ones on demand, `revalidate = 300`; an unknown slug → 404 (W151); the apply form → `careers` |
```

2. In `## JSON-LD`, directly after the target-set table (before `## OG images`), add:

```markdown
**As built (WP2b T11):** the careers detail page renders `jobPostingJsonLd` from the live opening — `title`, the full `description`, the canonical `url`, `datePosted` = the API's `postedAt`, `employmentType` from the first İŞKUR arrangement code it knows (`PERMANENT` → `FULL_TIME`, `PART_TIME` → `PART_TIME`, `CONTRACT`/`FREELANCER` → `CONTRACTOR`, `INTERNSHIP` → `INTERN`) else the hiring category (`FULL_TIME`/`COUNTRY_REPRESENTATIVE` → `FULL_TIME`, `FREELANCER` → `CONTRACTOR`, `PROJECT_BASED` → `TEMPORARY`), `jobLocation` = the first city (else the country's name) + the ISO-2 country, `baseSalary` only for a visible salary paid per hour, month or year, `identifier` = the public slug; never `validThrough` (the API has none — D17). The careers index carries no `JobPosting`.
```

`docs/ANALYTICS.md` — append one bullet to `### Page instrumentation (WP2b)` (after the last page bullet):

```markdown
- **Careers (`/kariyer`, `/en/careers`; `/kariyer/<slug>`, `/en/careers/<slug>`; T11):** index — `whatsapp_click` (`page_cta`) from each role's "Ask a question first" (a prefill carrying only the role's title and location — page data, W95) and from the open application's "Apply on WhatsApp"; `email_click` (`page_cta`) from "Email CV instead" and the FAQ footer's careers mailbox. Detail — `career_apply_start` `{ page, locale, slug }` once per page view on the first focus inside the apply form (`ApplyStartPing`; `slug` = the opening's public URL segment, ≤ 80 characters, W67); `whatsapp_click` (`page_cta`) from the hero's "Ask a question first" and the portfolio panel's WhatsApp; `email_click` (`page_cta`) from the portfolio panel's e-mail; the fallback panel's `whatsapp_click` / `call_click` / `email_click` with `form_fallback`; `conversion` for `form_key: 'careers'` from `ConversionPing` on `/tesekkurler?form=careers` (D13; `generate_lead` has no caller yet — T14 wires it beside `conversion` there) — the page fires neither itself. The filters, show-more, the role links and the hero role card fire nothing. No new event or parameter.
```

`docs/INTEGRATIONS.md` — under `## I5 — Staff application + CV proxy`, insert this paragraph text directly BEFORE the paragraph's final sentence "`CareersPublicModule` exports `apply` (done in WP3a)." (keep that sentence last and verbatim — T14 anchors on it):

```markdown
**As built (WP2b T11):** the detail page's server action (`src/app/[locale]/(site)/careers/[slug]/actions.ts`) re-reads the opening, enforces the door's own rules first — a closed opening, W56's portfolio gate (a `portfolioRequired` opening renders an apply-by-e-mail panel and no form), the residency rule (the country select offers only the opening's ISO-2 country), an expected salary for `PK` openings (sent with `expectedSalaryCurrency` = the opening's pay currency, PKR when a PK opening has none) — then uploads the PDF CV (≤ 3 MB, the form's one file, in the same action call) and posts `fields` = `openingSlug`, `cvKey`, `name`, `email`, `phone`, `country`, plus, when typed, `city`, `language`, `expectedSalary` (+ `expectedSalaryCurrency`), `linkedinUrl`, `portfolioUrl` (catalog v1.1 — checked with the door's own W161 `url` rule, a scheme-less link accepted) and `coverLetter`; never `currentSalary*`. A duplicate (same e-mail, same opening) is a 409 the door maps to `alreadyReceived` — the visitor lands on `/tesekkurler?form=careers` like any success.
```

`docs/PRD.md` — two in-place edits (W45; `grep -n 'Join Our Team (careers index)\|Careers detail\|Not yet built' docs/PRD.md`):

1. §2 table: the last cell of the row whose page cell is `Join Our Team (careers index)` becomes `Live openings from the Operations public careers API (W6 empty state when none); staff application via careers detail (`CAREERS_APPLY`); the speculative "No matching role?" application is WhatsApp + e-mail only in Phase A (W3); nothing links to Operations (W8)`; the last cell of the row whose page cell is `Careers detail` becomes `Staff application (`CAREERS_APPLY`): PDF CV (≤ 3 MB), the opening's residency lock, an expected salary for Pakistan openings, apply-by-e-mail for portfolio openings (W3/W56); `JobPosting` JSON-LD (D15)`.
2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**": T10 left it opening "3 of the 14 core pages (…)" and naming "Verify Representative (WP2b T10)" directly after T9's "Success Stories (WP2b T9)" (W176's chain: T13 12 → 11, T2 keeps 11, T3 10, T4 9, T5 8, T6 7, T7 6, T8 5, T9 4, T10 3). Count the careers index + detail as built — it is one of the 14 core pages (§2 row 8; the detail is its template page) — replace "3 of the 14 core pages" with "2 of the 14 core pages" and add "Careers index + detail (WP2b T11)" to the list of designed pages that sentence names, directly after T10's "Verify Representative (WP2b T10)" clause — keeping the rest of the sentence as it stands (never re-add WP1 wording). **Stop-and-report guard (W176):** if the sentence does not open with "3 of the 14 core pages" and name "Verify Representative (WP2b T10)", an earlier task deviated — do not decrement from whatever figure it carries; stop and report the sentence's exact text to the controller. T12 decrements from the "2" this task leaves (its two pages, 2 → 0).

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/careers" src/lib/seo/routes.ts docs/SEO.md docs/ANALYTICS.md docs/INTEGRATIONS.md docs/PRD.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `apply.test.ts` (19), `detail.test.tsx` (5), `ids.test.ts` (2 — 124 ids, none of the never-read set); `src/lib/seo/unbuilt.test.ts` (both careers keys built); `scripts/gate-routes.test.ts` (the built check and the stderr reason follow the page); the class-collision, client-import, client-messages, RSC-import and voice guards. `ApplyStartPing` is the detail's only new client module (it imports `track` and `next-intl`/`next/navigation` only); `ApplySection` is a server component rendering the client `FormShell`/`Field` — the `action` prop is the server action reference.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/careers" src/lib/seo/routes.ts docs/SEO.md docs/ANALYTICS.md docs/INTEGRATIONS.md docs/PRD.md
git commit -m "feat(careers): the careers detail — JobPosting, the apply form to careers with the CV proxy, residency lock, PK salary, W161 portfolio link, W56 e-mail branch (T11 c4)

generateStaticParams over the live slugs (both locales), on-demand for later ones, notFound for
an unknown slug (W151); the page's own title/description win over the careersDetail template
record (W124), name both alternates (W17) and reuse the index's OG image (W169: the OG route
takes no title argument); JobPosting from the live opening, no validThrough
(D15/D17). The action re-reads the opening, enforces closed/portfolio/residency/PK before the
CV upload (W56, owner rules), sends catalog v1.0 + v1.1 names only (W16/W161), consent checkbox
to /privacy (W79/W102). career_apply_start once per view (W67). '/careers/[slug]' leaves
UNBUILT_PATHNAMES (W20). Docs: SEO rows + JSON-LD note, ANALYTICS, INTEGRATIONS I5, PRD §2/§11.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — the openings sitemap source (W31/W70), the fixture door and its two npm scripts (W93/W112), the page e2e spec; SEO § Sitemap, ARCHITECTURE § Quality gate

- [ ] **Step 1: Write the failing tests**

`src/lib/careers-sitemap.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPENING, opening } from '@/test/careers';
import { listOpenings } from './careers';
import { careersSitemapSource } from './careers-sitemap';

vi.mock('./careers', () => ({ listOpenings: vi.fn() }));

beforeEach(() => vi.mocked(listOpenings).mockReset());

describe('careersSitemapSource (W31)', () => {
  it('one entry per opening in the requested locale, with both hreflang alternates', async () => {
    vi.mocked(listOpenings).mockResolvedValue([OPENING, opening({ slug: 'second-role' })]);
    const tr = await careersSitemapSource('tr');
    expect(tr.map((entry) => entry.url)).toEqual([
      'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
      'https://www.jobsadmire.com/kariyer/second-role',
    ]);
    expect(tr[0]).toEqual({
      url: 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
      alternates: {
        languages: {
          tr: 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
          en: 'https://www.jobsadmire.com/en/careers/country-representative-uzbekistan',
          'x-default': 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
        },
      },
      changeFrequency: 'weekly',
      priority: 0.6,
    });
    expect((await careersSitemapSource('en'))[0].url).toBe(
      'https://www.jobsadmire.com/en/careers/country-representative-uzbekistan',
    );
  });

  it('is empty when nothing is open — a door-less build lists no detail page', async () => {
    vi.mocked(listOpenings).mockResolvedValue([]);
    expect(await careersSitemapSource('tr')).toEqual([]);
  });
});
```

`src/lib/seo/sitemap-sources.test.ts` — replace the case titled `is empty and frozen in the foundation — the careers page task edits the literal to add the first source (W70)` with the case below, and add the import beside the file's existing ones:

```ts
import { careersSitemapSource } from '@/lib/careers-sitemap';
```

```ts
  it('is the frozen one-source literal — the careers openings source the careers page task registered (W31/W70)', () => {
    expect(DETAIL_SITEMAP_SOURCES).toEqual([careersSitemapSource]);
    expect(Object.isFrozen(DETAIL_SITEMAP_SOURCES)).toBe(true);
  });
```

`e2e/pages/careers.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import en from '../../src/messages/en.json';
import tr from '../../src/messages/tr.json';

// Canonicals, hreflang and og:image are built from SITE_URL — the production origin, whatever
// host the run hits.
const ORIGIN = 'https://www.jobsadmire.com';
/**
 * `E2E_CAREERS_MOCK=1` means the server under test was BUILT and STARTED with
 * `OPS_API_URL=http://127.0.0.1:8481` while the fixture door ran (`npm run careers:door`,
 * e2e/mocks/careers-door.mjs): the task's W126 proof session, or `npm run e2e:careers` against
 * such a server (W112). Without it every case below holds on any face — a door-less preview (W92)
 * and a door-configured `staging` alike — and nothing here ever submits to a real door.
 */
const MOCK = process.env.E2E_CAREERS_MOCK === '1';
const FIX = {
  office: 'work-permit-officer-antalya',
  uz: 'country-representative-uzbekistan',
  pk: 'sourcing-coordinator-pakistan',
  portfolio: 'content-seo-specialist-antalya',
} as const;
const INDEX = [
  { path: '/kariyer', locale: 'tr', sys: tr.sys, cta: '/isci-talebi#request-form' },
  { path: '/en/careers', locale: 'en', sys: en.sys, cta: '/en/hire-workers#request-form' },
] as const;
const SECTIONS = [
  'careers-notice',
  'careers-roles',
  'careers-ways',
  'careers-process',
  'careers-apply',
  'careers-faq',
];
const PDF = {
  name: 'cv.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n%fixture\n'),
};

const jsonLd = async (page: Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');

async function expectNoLeaks(page: Page) {
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(text).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
}

for (const r of INDEX) {
  test.describe(`careers index ${r.path}`, () => {
    test('answers 200: one tagged h1, one LCP slot, the sections in design order, no leaked token', async ({
      page,
    }) => {
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', r.locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByTestId('page-h1')).toHaveCount(1);
      await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
      for (const id of SECTIONS) await expect(page.getByTestId(id)).toBeVisible();
      const order = await page
        .locator(SECTIONS.map((id) => `[data-testid="${id}"]`).join(', '))
        .evaluateAll((els) => els.map((el) => el.getAttribute('data-testid')));
      expect(order).toEqual(SECTIONS);
      await expectNoLeaks(page);
    });

    test('W6: the live list or the designed empty state — never both, never a blank section', async ({
      page,
    }) => {
      await page.goto(r.path);
      const roles = await page.getByTestId('careers-role').count();
      if (roles === 0) {
        await expect(page.getByTestId('careers-empty')).toBeVisible();
        await expect(page.getByTestId('careers-hiring-count')).toHaveCount(0);
        await expect(page.getByTestId('careers-hero-roles')).toHaveCount(0);
      } else {
        await expect(page.getByTestId('careers-empty')).toHaveCount(0);
        await expect(page.getByTestId('careers-hiring-count')).toBeVisible();
      }
      if (MOCK) {
        expect(roles).toBe(4); // five fixtures, four shown
        await expect(page.getByTestId('careers-hiring-count')).toContainText('5');
        await expect(page.getByTestId('careers-hero-role')).toHaveCount(3); // UZ, PK, IN
      }
    });

    test('W3/W89: the open application is WhatsApp + e-mail only, and nothing links to Operations', async ({
      page,
    }) => {
      await page.goto(r.path);
      const apply = page.getByTestId('careers-apply');
      await expect(apply.locator('form')).toHaveCount(0);
      await expect(apply.locator('a[href^="https://wa.me/905011240340?text="]')).toHaveCount(1);
      await expect(apply.locator('a[href^="mailto:careers@jobsadmire.com"]')).toHaveCount(1);
      await expect(page.locator('a[href*="operations.jobsadmire.com"]')).toHaveCount(0);
    });

    test('JSON-LD: FAQPage over the 8 on-page pairs, a two-item BreadcrumbList, no JobPosting (D15)', async ({
      page,
    }) => {
      await page.goto(r.path);
      const ld = await jsonLd(page);
      expect(ld).toContain('"@type":"FAQPage"');
      expect(ld.match(/"@type":"Question"/g)).toHaveLength(8);
      expect(ld).toContain('"@type":"BreadcrumbList"');
      expect(ld.match(/"@type":"ListItem"/g)).toHaveLength(2);
      expect(ld).not.toContain('"@type":"JobPosting"');
    });

    test('metadata: canonical, both hreflangs, title, og:image; the header keeps the default CTA (W121/W158)', async ({
      page,
    }) => {
      await page.goto(r.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${ORIGIN}${r.path}`);
      await expect(page.locator('link[hreflang="tr"]')).toHaveAttribute('href', `${ORIGIN}/kariyer`);
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `${ORIGIN}/en/careers`);
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/kariyer`,
      );
      await expect(page).toHaveTitle(r.sys.seo.careers.title);
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        'content',
        `${ORIGIN}/og/${r.locale}/careers.png`,
      );
      // DEFAULT_CTAS → T2's #request-form (W158 sweeps that anchor on /isci-talebi at launch).
      expect(await page.locator(`header a[href="${r.cta}"]`).count()).toBeGreaterThan(0);
    });
  });
}

test('an unknown opening answers 404 inside the chrome, in both locales (W151)', async ({ page }) => {
  for (const path of ['/kariyer/no-such-role-xyz', '/en/careers/no-such-role-xyz']) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
    // Next's __next_error__ shell first; the chrome-wrapped view after hydration (W151).
    await expect(page.locator('header').first()).toBeVisible();
  }
});

test.describe('careers — the fixture door (E2E_CAREERS_MOCK=1)', () => {
  test.skip(!MOCK, 'needs a server built and started against e2e/mocks/careers-door.mjs');

  test('filters, the no-match state, show more and show fewer', async ({ page }) => {
    await page.goto('/en/careers');
    const list = page.getByTestId('careers-roles-list');
    const roles = list.getByTestId('careers-role');
    // jt.048 "Where", jt.049 "Engagement" name the two radio groups; the chip labels are the
    // package's own (jt.262, jt.073, jt.261, jt.056, jt.306).
    const where = list.getByRole('radiogroup', { name: 'Where' });
    const engagement = list.getByRole('radiogroup', { name: 'Engagement' });
    await expect(roles).toHaveCount(4);
    await where.getByText('Overseas', { exact: true }).click();
    await expect(roles).toHaveCount(3);
    await engagement.getByText('Project-based', { exact: true }).click();
    await expect(roles).toHaveCount(1);
    await where.getByText('Antalya office', { exact: true }).click();
    await expect(list.getByTestId('careers-no-match')).toBeVisible();
    await list.getByRole('button', { name: 'Show all roles' }).click();
    await expect(roles).toHaveCount(4);
    await list.getByRole('button', { name: 'Show more roles (1)' }).click();
    await expect(roles).toHaveCount(5);
    await list.getByRole('button', { name: 'Show fewer roles' }).click();
    await expect(roles).toHaveCount(4);
  });

  test('a detail page: JobPosting from the opening, a three-item trail, both alternates, its own title, axe clean', async ({
    page,
  }) => {
    const res = await page.goto(`/kariyer/${FIX.uz}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId('page-h1')).toHaveText('Country Representative — Uzbekistan');
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const ld = await jsonLd(page);
    expect(ld).toContain('"@type":"JobPosting"');
    expect(ld).toContain(
      `"identifier":{"@type":"PropertyValue","name":"JobsAdmire","value":"${FIX.uz}"}`,
    );
    expect(ld).toContain('"addressCountry":"UZ"');
    expect(ld).toContain('"employmentType":"FULL_TIME"');
    expect(ld).toContain('"minValue":800');
    expect(ld).not.toContain('validThrough');
    expect(ld.match(/"@type":"ListItem"/g)).toHaveLength(3);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/kariyer/${FIX.uz}`,
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/en/careers/${FIX.uz}`,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/kariyer/${FIX.uz}`,
    );
    await expect(page).toHaveTitle(
      tr.sys.careers.detail.metaTitle.replace('{title}', 'Country Representative — Uzbekistan'),
    );
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      'content',
      `${ORIGIN}/og/tr/careers.png`,
    );
    await expectNoLeaks(page);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
  });

  test('apply: career_apply_start once; server-side errors keep the page; the CV uploads and the door-less post ends on the fallback panel', async ({
    page,
  }) => {
    await page.goto(`/en/careers/${FIX.uz}`);
    const form = page.getByTestId('careers-apply-form');
    await expect(form.locator('select[name="country"]')).toHaveValue('UZ');
    await expect(form.locator('select[name="country"] option:not([value=""])')).toHaveCount(1);
    await expect(form.locator('input[name="expectedSalary"]')).toHaveCount(0);

    // W67: the first focus inside the form fires career_apply_start once, with the slug only.
    // The listener attaches after hydration, so re-focus until it has fired; it never fires twice.
    const starts = () =>
      page.evaluate(() =>
        (window.dataLayer ?? []).filter((event) => event.event === 'career_apply_start'),
      );
    await expect
      .poll(async () => {
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await form.locator('input[name="name"]').focus();
        return (await starts()).length;
      })
      .toBe(1);
    await form.locator('input[name="email"]').focus();
    expect(await starts()).toEqual([
      expect.objectContaining({ slug: FIX.uz, locale: 'en', page: `/en/careers/${FIX.uz}` }),
    ]);

    // An empty submit: the server answers field errors and the page stays.
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[aria-invalid="true"]').first()).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(`/en/careers/${FIX.uz}`);

    // A valid one: the CV goes to the fixture door; there is no write token, so the post never
    // leaves the site and the D11 panel answers — never a fake success (W92).
    await form.locator('input[name="name"]').fill('Aziz Karimov');
    await form.locator('input[name="email"]').fill('aziz@example.com');
    await form.locator('input[name="phone"]').fill('+998 90 123 45 67');
    await form.locator('input[name="portfolioUrl"]').fill('behance.net/aziz');
    await form.locator('input[name="cv"]').setInputFiles(PDF);
    await form.getByRole('checkbox').check();
    await form.locator('button[type="submit"]').click();
    const panel = form.getByTestId('form-fallback');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
    // W76: the panel's WhatsApp href is the bare chat; the typed data is composed only on click.
    await expect(panel.locator('a[href^="https://wa.me/"]').first()).toHaveAttribute(
      'href',
      'https://wa.me/905011240340',
    );
    expect(new URL(page.url()).pathname).toBe(`/en/careers/${FIX.uz}`);
    await expect(form.locator('input[name="name"]')).toHaveValue('Aziz Karimov');
  });

  test('a Pakistan opening requires the expected salary — the server says so before any upload', async ({
    page,
  }) => {
    await page.goto(`/en/careers/${FIX.pk}`);
    const form = page.getByTestId('careers-apply-form');
    const salary = form.locator('input[name="expectedSalary"]');
    await expect(salary).toBeVisible();
    await expect(salary).toHaveAttribute('aria-required', 'true');
    await expect(form).toContainText(en.sys.careers.form.expectedSalaryHint.replace('{currency}', 'PKR'));
    await form.locator('input[name="name"]').fill('Bilal Ahmed');
    await form.locator('input[name="email"]').fill('bilal@example.com');
    await form.locator('input[name="phone"]').fill('+92 300 123 4567');
    await form.locator('input[name="cv"]').setInputFiles(PDF);
    await form.getByRole('checkbox').check();
    await form.locator('button[type="submit"]').click();
    await expect(salary).toHaveAttribute('aria-invalid', 'true');
    await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  });

  test('a portfolio opening applies by e-mail — no form (W56)', async ({ page }) => {
    await page.goto(`/kariyer/${FIX.portfolio}`);
    const panel = page.getByTestId('careers-email-apply');
    await expect(panel).toBeVisible();
    await expect(page.locator('form[data-form-key="careers"]')).toHaveCount(0);
    await expect(panel.locator('a[href^="mailto:careers@jobsadmire.com?subject="]')).toHaveCount(1);
  });

  test('the sitemap lists the fixture openings in both locales (W31)', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const slug of Object.values(FIX)) {
      expect(xml).toContain(`<loc>${ORIGIN}/kariyer/${slug}</loc>`);
      expect(xml).toContain(`<loc>${ORIGIN}/en/careers/${slug}</loc>`);
    }
    expect(xml).not.toContain('[slug]');
  });
});

test.describe('careers — a configured door, read only', () => {
  test.skip(MOCK, 'the fixture-door cases cover the detail page');

  test('the first listed opening renders its detail page — nothing is submitted', async ({ page }) => {
    await page.goto('/kariyer');
    const cards = page.getByTestId('careers-role');
    test.skip((await cards.count()) === 0, 'no opening is listed on this face (a door-less build, W92)');
    const href = await cards.first().getByRole('heading').getByRole('link').getAttribute('href');
    const res = await page.goto(href ?? '/kariyer');
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId('page-h1')).toHaveCount(1);
    expect(await jsonLd(page)).toContain('"@type":"JobPosting"');
    await expect(
      page.locator('[data-testid="careers-apply-form"], [data-testid="careers-email-apply"]'),
    ).toHaveCount(1);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/lib/careers-sitemap.test.ts src/lib/seo/sitemap-sources.test.ts
```

Expected: `careers-sitemap.test.ts` FAILS to import (`Cannot find module './careers-sitemap'`) and so does `sitemap-sources.test.ts` (`@/lib/careers-sitemap`). The Playwright spec is not run here (memory rule) — it runs once, inside Cycle 6's gate.

- [ ] **Step 3: Implement**

`src/lib/careers-sitemap.ts`:

```ts
import 'server-only';
import type { MetadataRoute } from 'next';
import type { Locale } from '@/i18n/routing';
import { absoluteUrl, localeAlternates } from '@/lib/seo/routes';
import { listOpenings } from './careers';
import { detailHref } from './careers-pure';

/**
 * W31/W70 — the careers detail entries for one locale: every current opening (read under the
 * `openings` tag), with both locale alternates (the Operations slug is the same in both). Empty
 * without a door; a feed failure throws and the sitemap route keeps its last good version (ISR,
 * `revalidate = 900`). No `lastModified`: the API exposes the posting date, not an edit date.
 */
export async function careersSitemapSource(locale: Locale): Promise<MetadataRoute.Sitemap> {
  return (await listOpenings()).map((o) => {
    const href = detailHref(o.slug);
    return {
      url: absoluteUrl(locale, href),
      alternates: localeAlternates(href),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });
}
```

`src/lib/seo/sitemap-sources.ts` — add the import beside the file's existing ones, and change the initialiser of `DETAIL_SITEMAP_SOURCES` (it reads `Object.freeze([])`) to:

```ts
import { careersSitemapSource } from '@/lib/careers-sitemap';
```

```ts
export const DETAIL_SITEMAP_SOURCES: readonly SitemapSource[] = Object.freeze([careersSitemapSource]);
```

and, in the JSDoc just above it, replace the sentence beginning "Empty in the foundation: the careers page task edits this literal…" with "The careers openings source (`src/lib/careers-sitemap.ts`, WP2b T11) is the one entry — added by editing this literal, never by a runtime push (W70);".

`src/app/sitemap.test.ts` — rename the case titled `is exactly (static keys − excluded) × locales while no detail source is registered` to `is exactly (static keys − excluded) × locales while the detail sources yield nothing (no door in the unit suite)` (body unchanged: with `OPS_API_URL` pinned to `''` by `vitest.config.mts`, `careersSitemapSource` returns `[]` without a call).

`e2e/mocks/careers-door.mjs`:

```js
// The Operations careers-public door, faked for WP2b T11's e2e and W126 proof session (W93/W112):
// the three public routes the careers pages call — GET /api/careers/openings (paginated, newest
// first), GET /api/careers/openings/:slug (200 | 404) and POST /api/careers/upload-cv (201 with a
// careers-cv/<uuid>.pdf key) — in the exact `shapePublicOpening` shape. Everything else answers
// 404, the website door included: without OPS_WEBSITE_WRITE_TOKEN the site never calls it, so
// every submission ends on the D11 fallback panel, never a fake success. Never part of the gate
// or the build; nothing in production reads it.
//   npm run careers:door   → http://127.0.0.1:8481 (CAREERS_DOOR_PORT moves it)
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

const PORT = Number(process.env.CAREERS_DOOR_PORT ?? 8481);
const HOST = '127.0.0.1';
const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString();

const BASE = {
  city: null,
  cities: [],
  employmentArrangement: null,
  employmentArrangements: [],
  workMode: null,
  workModes: [],
  description: null,
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: null,
  salaryPayType: null,
  salaryPeriod: null,
  salaryVisible: false,
  payCurrency: null,
  portfolioRequired: false,
  requiredLanguage: null,
  requiredLanguages: [],
};

/** Five openings, newest first like Operations: two Antalya office roles (one needs a portfolio
 *  — W56), three overseas (Uzbekistan with a visible USD range, Pakistan with PKR and a hidden
 *  salary, India project-based and old). The first is what W93's gate rows audit. */
const OPENINGS = [
  {
    ...BASE,
    slug: 'work-permit-officer-antalya',
    title: 'Work Permit & Documentation Officer',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    employmentArrangement: 'PERMANENT',
    employmentArrangements: ['PERMANENT'],
    workMode: 'ON_SITE',
    workModes: ['ON_SITE'],
    description:
      'Own the paperwork that decides whether a worker legally starts.\n\nThe work:\n- Prepare and file work-permit applications\n- Track every file until the permit is issued',
    salaryMin: '45000',
    salaryMax: '45000',
    salaryCurrency: 'TRY',
    salaryPayType: 'EXACT',
    salaryPeriod: 'MONTH',
    salaryVisible: true,
    payCurrency: 'TRY',
    requiredLanguage: 'Turkish',
    requiredLanguages: ['Turkish'],
    postedAt: daysAgo(1),
  },
  {
    ...BASE,
    slug: 'country-representative-uzbekistan',
    title: 'Country Representative — Uzbekistan',
    country: 'UZ',
    city: 'Tashkent',
    cities: ['Tashkent'],
    category: 'COUNTRY_REPRESENTATIVE',
    employmentArrangement: 'PERMANENT',
    employmentArrangements: ['PERMANENT'],
    workMode: 'REMOTE',
    workModes: ['REMOTE'],
    description:
      'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.\n\nThe work:\n- Find and manage licensed partner agencies\n- Run first interviews\n\nThe profile:\n- A working network among agencies',
    salaryMin: '800',
    salaryMax: '1200',
    salaryCurrency: 'USD',
    salaryPayType: 'RANGE',
    salaryPeriod: 'MONTH',
    salaryVisible: true,
    payCurrency: 'USD',
    requiredLanguage: 'Uzbek',
    requiredLanguages: ['Uzbek', 'Russian', 'English'],
    postedAt: daysAgo(3),
  },
  {
    ...BASE,
    slug: 'sourcing-coordinator-pakistan',
    title: 'Sourcing Coordinator — Pakistan',
    country: 'PK',
    city: 'Karachi',
    cities: ['Karachi', 'Lahore'],
    category: 'FREELANCER',
    employmentArrangement: 'FREELANCER',
    employmentArrangements: ['FREELANCER'],
    workMode: 'HYBRID',
    workModes: ['HYBRID'],
    description:
      'A few agreed hours a week beside your agency or training centre.\n- Shortlist candidates against a live job order\n- Check documents before a file opens',
    payCurrency: 'PKR',
    requiredLanguages: ['Urdu', 'English'],
    postedAt: daysAgo(10),
  },
  {
    ...BASE,
    slug: 'content-seo-specialist-antalya',
    title: 'Content & SEO Specialist',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    workMode: 'HYBRID',
    workModes: ['HYBRID', 'REMOTE'],
    description:
      'Turn permit and hiring knowledge into pages employers find.\n- Write and translate guides in Turkish and English\n- Improve on-page SEO',
    payCurrency: 'TRY',
    portfolioRequired: true,
    requiredLanguages: ['Turkish', 'English'],
    postedAt: daysAgo(20),
  },
  {
    ...BASE,
    slug: 'trade-test-assessor-india',
    title: 'Trade Test & Skills Assessor',
    country: 'IN',
    category: 'PROJECT_BASED',
    workMode: 'ON_SITE',
    workModes: ['ON_SITE'],
    description: 'Test the trade before the ticket — welders, machine operators, cooks.',
    requiredLanguages: ['Hindi', 'English'],
    postedAt: daysAgo(40),
  },
];

const send = (res, status, body) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`);
  if (req.method === 'GET' && url.pathname === '/api/careers/openings') {
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 20, 1), 50);
    const page = Math.max(Number(url.searchParams.get('page')) || 1, 1);
    return send(res, 200, {
      data: OPENINGS.slice((page - 1) * limit, page * limit),
      meta: { total: OPENINGS.length, page, limit, totalPages: Math.ceil(OPENINGS.length / limit) },
    });
  }
  const detail = url.pathname.match(/^\/api\/careers\/openings\/([^/]+)$/);
  if (req.method === 'GET' && detail) {
    const opening = OPENINGS.find((o) => o.slug === decodeURIComponent(detail[1]));
    return opening
      ? send(res, 200, { data: opening })
      : send(res, 404, { statusCode: 404, message: 'Opening not found', error: 'Not Found' });
  }
  if (req.method === 'POST' && url.pathname === '/api/careers/upload-cv') {
    const multipart = (req.headers['content-type'] ?? '').startsWith('multipart/form-data');
    req.resume();
    req.on('end', () => {
      if (!multipart) return send(res, 400, { statusCode: 400, message: 'Missing "file" field' });
      const key = `careers-cv/${randomUUID()}.pdf`;
      return send(res, 201, {
        data: { url: `http://${HOST}:${PORT}/uploads/${key}`, key, fileName: 'cv.pdf' },
      });
    });
    return undefined;
  }
  return send(res, 404, { statusCode: 404, message: 'Not Found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[careers-door] ${OPENINGS.length} fixture openings on http://${HOST}:${PORT}`);
});
```

`package.json` — in `"scripts"`, directly after `"e2e": "playwright test",`, add:

```json
"careers:door": "node e2e/mocks/careers-door.mjs",
"e2e:careers": "E2E_CAREERS_MOCK=1 playwright test e2e/pages/careers.spec.ts",
```

(`e2e:careers` builds nothing and starts nothing: it runs the careers spec's fixture half against the server at `E2E_BASE_URL`, which must have been built and started with `OPS_API_URL=http://127.0.0.1:8481` while `npm run careers:door` ran — W112's evidence for a face without a live opening. This task's own run of it happens inside Cycle 6's gate.)

`docs/SEO.md` — at the end of the `## Sitemap` paragraph (after its last sentence "`revalidate = 900`."), append:

```markdown
The careers page task (WP2b T11) registered the one source so far: `careersSitemapSource` (`src/lib/careers-sitemap.ts`) — one `/kariyer/<slug>` or `/en/careers/<slug>` entry per current opening, with both locale alternates (the Operations slug is shared), `changeFrequency: 'weekly'`, `priority: 0.6` and no `lastModified` (the API exposes no edit date), read under the `openings` tag; without a door it lists nothing, and a feed failure keeps the last good sitemap (ISR).
```

`docs/ARCHITECTURE.md` — in `## Quality gate (D27)`, item 2, directly after the sentence that ends "…else it prints `detail rows skipped (door not configured)` and the static table is unchanged.", add:

```markdown
**The careers fixture door (WP2b T11, W112).** `npm run careers:door` serves `e2e/mocks/careers-door.mjs` on `127.0.0.1:8481`: five openings in the exact `shapePublicOpening` shape (one needs a portfolio, one is in Pakistan), the detail route and a `upload-cv` that returns a `careers-cv/<uuid>.pdf` key; everything else 404s, so with no write token every apply ends on the D11 panel. Build and start with `OPS_API_URL=http://127.0.0.1:8481`, then run the gate with the same `OPS_API_URL` and `E2E_CAREERS_MOCK=1` exported: `gate-routes.mjs` adds the first fixture's two detail routes to Lighthouse and `e2e/pages/careers.spec.ts` runs its detail half; `npm run e2e:careers` re-runs just that spec against such a server. It is the detail evidence on a face with no live opening (W93).
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write src/lib/careers-sitemap.ts src/lib/careers-sitemap.test.ts src/lib/seo/sitemap-sources.ts src/lib/seo/sitemap-sources.test.ts src/app/sitemap.test.ts e2e/mocks/careers-door.mjs e2e/pages/careers.spec.ts package.json docs/SEO.md docs/ARCHITECTURE.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `careers-sitemap.test.ts` (2), `sitemap-sources.test.ts` (the one-source literal), `src/app/sitemap.test.ts` (unchanged count: no door in the unit suite); `npm run typecheck` covers `e2e/pages/careers.spec.ts` (the `window.dataLayer` type comes from `src/analytics/track.ts`'s global declaration); ESLint lints the `.mjs` door like `scripts/gate-routes.mjs`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/careers-sitemap.ts src/lib/careers-sitemap.test.ts src/lib/seo/sitemap-sources.ts src/lib/seo/sitemap-sources.test.ts src/app/sitemap.test.ts e2e/mocks/careers-door.mjs e2e/pages/careers.spec.ts package.json docs/SEO.md docs/ARCHITECTURE.md
git commit -m "feat(careers): the openings sitemap source, the fixture door and the careers e2e (T11 c5)

careersSitemapSource joins the frozen DETAIL_SITEMAP_SOURCES literal (W31/W70). e2e/mocks/
careers-door.mjs (npm run careers:door) serves five shapePublicOpening fixtures, the detail
route and upload-cv; npm run e2e:careers runs the spec's fixture half against a server built
on it (W93/W112). The spec asserts the W6/W3/W89 contracts on any face and never submits to a
real door (W92). Docs: SEO § Sitemap, ARCHITECTURE § Quality gate.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — the W126 proof session against the fixture door (one build, one start, one gate, js-size, the named LCP element, kill) and the ledger row

This cycle adds no test and changes no behaviour: its checks are the proof run and the ledger row. The ONE build of this task is built against the fixture door so that the one gate run proves both halves — every existing route and the careers index with live-shaped data, plus the detail route under Lighthouse (W93 picks the first fixture) and `e2e/pages/careers.spec.ts`'s fixture half (W112). Only `scripts/gate-routes.mjs` among the gate's tools reads `OPS_API_URL`; with no `OPS_WEBSITE_WRITE_TOKEN` every other page's form still answers `unauthorized` without a call and `/api/site-health` reports the door `unconfigured` (skip) — exactly the door-less behaviour their specs assert.

- [ ] **Step 1: Confirm the ledger anchor before the run**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && grep -n '^## Ledger' docs/superpowers/plans/2026-09-20-wp2b-pages.md && grep -n '^| T1 Homepage |' docs/superpowers/plans/2026-09-20-wp2b-pages.md
```

Both lines must print (T1 created the table, W98). If either is missing an earlier task deviated — stop and ask the controller rather than invent a location.

- [ ] **Step 2: Run the proof (W126 — one heavy job at a time; never `sleep`: wait with `curl --retry`)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
# 1. The fixture door, in the background; wait until it answers.
npm run careers:door > .superpowers/careers-door.log 2>&1 &
DOOR_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://127.0.0.1:8481/api/careers/openings
# 2. ONE build against it: generateStaticParams prerenders the five fixtures in both locales.
OPS_API_URL=http://127.0.0.1:8481 NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
# 3. ONE start, same door.
OPS_API_URL=http://127.0.0.1:8481 npm run start > .superpowers/next-start.log 2>&1 &
NEXT_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/
# 4. ONE gate: every spec on both projects (the careers fixture half included), axe, the width
#    sweep, Lighthouse on every indexable route + the two fixture detail routes (W93), js-size.
OPS_API_URL=http://127.0.0.1:8481 E2E_CAREERS_MOCK=1 E2E_BASE_URL=http://localhost:3000 npm run gate
# 5. The ledger figures (the gate already printed them once; this re-reads .lighthouseci/).
npm run js-size
# 6. The element Lighthouse picked as LCP on every careers route (D26: it must carry data-lcp-slot).
node -e 'const fs=require("fs"),path=require("path");const m=JSON.parse(fs.readFileSync("lighthouse-report/manifest.json","utf8"));for(const e of m.filter((x)=>x.isRepresentativeRun&&/\/(kariyer|careers)/.test(x.url))){const f=path.isAbsolute(e.jsonPath)?e.jsonPath:path.join("lighthouse-report",path.basename(e.jsonPath));const lhr=JSON.parse(fs.readFileSync(f,"utf8"));const s=JSON.stringify(lhr.audits["largest-contentful-paint-element"]?.details??{}).match(/"snippet":"((?:[^"\\]|\\.)*)"/);console.log(e.url,"->",s?s[1]:"(no element)");}'
# 7. Stop both and prove nothing stray survived.
kill $NEXT_PID $DOOR_PID
ps aux | grep -E 'next-server|next start|careers-door' | grep -v grep || echo 'no strays'
```

If step 7 prints a `next-server` line (npm's child can outlive its parent), `kill` that PID and run the `ps` line again until it prints `no strays`.

Expected:
- `npm run gate` → `gate: OK`. Playwright green on both projects: every existing spec; `e2e/pages/careers.spec.ts` — the five index cases per locale, the unknown-slug case (404, then the chrome), the seven fixture-door cases (filters, the detail page with its `JobPosting` and axe, the apply flow ending on the `unauthorized` panel with `career_apply_start` fired once, the Pakistan salary rule, the portfolio e-mail panel, the sitemap); the "configured door, read only" case skipped (fixture run). axe: zero violations over every `GATE_ROUTES` path at both projects and the `region` rule at 390/1000/1440. Width sweep clean at every width (the role cards stack below `md`, the country chips wrap). `e2e/seo.spec.ts`: `/kariyer` and `/en/careers` canonical/hreflang, both in the sitemap, and every sitemap `<loc>` — the ten fixture detail URLs included — answers 200.
- `gate-routes` printed no "detail rows skipped" line: Lighthouse audited `/kariyer/work-permit-officer-antalya` and `/en/careers/work-permit-officer-antalya` besides the indexable table (W93). Every audited route: performance ≥ 0.95, accessibility / best practices / SEO = 1.00, script ≤ 204,800 B, LCP ≤ 2,500 ms, CLS ≤ 0.1 (medians of three DevTools-throttled runs, W145).
- `npm run js-size`, projected: `/kariyer` ≈ 179–183 KB and `/en/careers` ≈ 176–180 KB (the shell plus `RolesList`, `RadioChips` and `ContactLink`, ≈ 3–5 KB); the two detail routes ≈ 184–189 KB (the shell plus the forms kernel, ≈ 7.5 KB, and `ApplyStartPing`). **A LOCAL route figure ≥ 191,724 B stops the task and reports (W162 — the binding line is 194,560 B on the preview's `npm run js-size`, which runs ≈ 2,836 B above the local build, so the local trigger is 194,560 − 2,836 = 191,724 B; the controller's binding preview decides at 194,560 B):** record the figure in the ledger row and raise it with the controller before T12 starts (W13 amended) — this task writes no lazy cycle in advance (the projection is ≤ 189 KB); the controller schedules the reviewed lazy pass (the detail's form sits below the fold, a `LazyIsland` candidate), never a quiet edit inside this proof.
- Step 6 prints, per careers route, the snippet of the element Lighthouse named. Expected on both detail routes: the `<h1 data-testid="page-h1" data-lcp-slot="h1" …>`. On the index the hero's lead paragraph can outgrow a two-line h1 on a narrow viewport: if a snippet there is the `<p data-testid="careers-hero-lead" …>`, move the attribute in `src/app/[locale]/(site)/careers/_sections/Hero.tsx` — drop `data-lcp-slot="h1"` from the `<h1>` and add `data-lcp-slot="hero-lead"` to that `<p>` (the page still carries exactly one slot, so `sections.test.tsx`, the e2e and `scripts/placeholder-count.ts` stay green) — and change the careers index row's LCP cell in `docs/SEO.md` to name `p.careers-hero-lead` (`data-lcp-slot="hero-lead"`). If a detail route names a description paragraph instead, keep the attribute on the h1 (the description is per-opening content, not a slot) and say so in the ledger row. Any such edit is committed in Step 4 with the ledger, after the verify line.

- [ ] **Step 3: Implement — the ledger row**

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T11 row to the `## Ledger` table (T1's row format), every `<…>` filled from Step 2 (`npm run js-size`'s table, `lighthouse-report/`, the Step 6 output):

```markdown
| T11 Careers index + detail | `/kariyer` · `/en/careers`; W93 fixture detail `/kariyer/work-permit-officer-antalya` · `/en/careers/work-permit-officer-antalya` (fixture door, W112) | js-size (local, fixture-door build): `/kariyer` <n> B · `/en/careers` <n> B · detail TR <n> B · detail EN <n> B (ceiling 204,800; binding lazy line 194,560, local trigger 191,724 — W162); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/kariyer` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (<element from Step 6>) · CLS <n>; `/en/careers` perf <x.xx> · LCP <n> ms · CLS <n>; detail TR perf <x.xx> · LCP <n> ms (<element>) · CLS <n>; detail EN perf <x.xx> · LCP <n> ms · CLS <n> | pixel: n/a — not a D27 page (side-by-side review against named deltas 1–12); deltas: (a) D20 faces — the blue-safe hero-card header, success-text badges and step 7, #a9b5d8 greys, underlined inline links; (b) the live list linking to a new detail page (no expand panel), ICU counts, static ways, the two-column FaqBlock, the WhatsApp/e-mail open application, no Operations link; (c) the W6 empty state on a door-less face | <YYYY-MM-DD> |
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md docs/SEO.md "src/app/[locale]/(site)/careers/_sections/Hero.tsx" && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green (a prose-only change, or the one-attribute LCP move from Step 2). `.lighthouseci/` and `lighthouse-report/` from this LOCAL run hold no secret; delete them only after a preview run (W137 amended). `.superpowers/*.log` is git-ignored scratch.

- [ ] **Step 5: Commit (never push — the controller pushes after the review, then runs the binding preview gate)**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git add docs/SEO.md "src/app/[locale]/(site)/careers/_sections/Hero.tsx" 2>/dev/null; git status --short
git commit -m "docs(careers): T11 ledger row — js-size per route, Lighthouse medians, the named LCP elements (T11 c6)

Local W126 proof against the fixture door (npm run careers:door): one build, one next start,
npm run gate OK on every route and both locales, the two W93 detail routes audited, the careers
spec's fixture half green (W112); js-size per route (W136); LCP/perf medians under DevTools
throttling (W145); the LCP element read from each Lighthouse report (D26). Not a pixel page.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

(`git status --short` before the commit must show only the ledger file, plus `docs/SEO.md` and `Hero.tsx` when Step 2 moved the LCP slot — nothing else.)

---

**Docs in this task:**
- `docs/ARCHITECTURE.md` — § Freshness: the careers openings paragraph (the read, the tag and floor, the failure policy — Cycle 1); § Quality gate item 2: the careers fixture door (Cycle 5).
- `docs/INTEGRATIONS.md` — I6 rewritten as built (Cycle 1); I5 gains the as-built paragraph before its final sentence "`CareersPublicModule` exports `apply` (done in WP3a).", which stays last and verbatim for T14 (Cycle 4).
- `docs/CONTENT-MODEL.md` — the careers bullet at the end of `### Adding copy (W9, W23, W54)`: the `sys.careers.*`/`sys.seo.careers*` keys, the rewritten `sys.form.hints.portfolioUrl` (W178) and the never-rendered package ids (Cycle 2).
- `docs/SEO.md` — two `## Pages` rows (index in Cycle 3, detail in Cycle 4 — each names its LCP element, confirmed in Cycle 6), the `## JSON-LD` as-built `JobPosting` note (Cycle 4), the `## Sitemap` careers-source sentence (Cycle 5).
- `docs/ANALYTICS.md` — the Careers bullet in `### Page instrumentation (WP2b)` (Cycle 4; `career_apply_start` is already in the event table since WP2a; no new event or parameter).
- `docs/PRD.md` — §2 rows "Join Our Team (careers index)" and "Careers detail" (their last cells) and the §11 "Not yet built" sentence ("3 of the 14 core pages" → "2 of the 14 core pages", anchored on T10's post-edit text with the W176 guard; Cycle 4).
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T11 `## Ledger` row (Cycle 6).
- No Operations doc change: the `careers` contract (v1.0 + v1.1) and PRD §5.12 are unchanged by this task; the website only consumes them.

**Sys keys added (44, identical key sets in `src/messages/tr.json` and `src/messages/en.json`, pinned by `careers/__tests__/copy.test.ts`):** `sys.seo.careers.title`, `sys.seo.careers.description`, `sys.careers.hero.hiringCount`, `sys.careers.hero.seeOpenings`, `sys.careers.filters.all`, `sys.careers.roles.resultAll`, `sys.careers.roles.resultFiltered`, `sys.careers.roles.showMore`, `sys.careers.roles.posted`, `sys.careers.workMode.REMOTE`, `sys.careers.workMode.HYBRID`, `sys.careers.workMode.ON_SITE`, `sys.careers.salary.range`, `sys.careers.salary.from`, `sys.careers.salary.upTo`, `sys.careers.salary.per.HOUR`, `sys.careers.salary.per.DAY`, `sys.careers.salary.per.WEEK`, `sys.careers.salary.per.MONTH`, `sys.careers.salary.per.YEAR`, `sys.careers.empty.title`, `sys.careers.empty.body`, `sys.careers.apply.whatsapp`, `sys.careers.apply.emailSubject`, `sys.careers.detail.metaTitle`, `sys.careers.detail.metaDescription`, `sys.careers.detail.about`, `sys.careers.detail.back`, `sys.careers.detail.applyLead`, `sys.careers.detail.whatsappIntro`, `sys.careers.detail.facts.title`, `sys.careers.detail.facts.location`, `sys.careers.detail.facts.workMode`, `sys.careers.detail.facts.languages`, `sys.careers.detail.facts.salary`, `sys.careers.detail.facts.posted`, `sys.careers.form.residency`, `sys.careers.form.expectedSalaryHint`, `sys.careers.form.closed`, `sys.careers.form.portfolioGate`, `sys.careers.emailPanel.title`, `sys.careers.emailPanel.body`, `sys.careers.emailPanel.subject`, `sys.careers.emailPanel.email`. Changed (both locales): `sys.thankYou.forms.careers` (rewritten for the per-opening application) and `sys.form.hints.portfolioUrl` (rewritten, not added — it accepts a scheme-less link: EN "A web address, e.g. behance.net/yourname.", TR "Bir web adresi, ör. behance.net/adiniz.", W178; pinned by `copy.test.ts`). Consumed, not added: `sys.form.labels.{name,email,phone,country,city,language,expectedSalary,cv,linkedinUrl,portfolioUrl,coverLetter}`, `sys.form.placeholders.*`, `sys.form.hints.{cv,linkedinUrl,optional,phone}`, `sys.form.errors.*`, `sys.nav.breadcrumbs`. Deliberately NOT added: `sys.seo.careersDetail.*` (pinned absent by `copy.test.ts` — W169: the OG route renders `sys.seo.<pageKey>.title` without arguments; the detail reuses `/og/{locale}/careers.png`, T12's pattern).

**Package ids used:** 124, every one present in `src/content/local/catalogue.json` and in both committed bundles (pinned by `careers/__tests__/ids.test.ts`) — first `jt.005`, last `jt.312`: `jt.005`, `021`–`024`, `026`–`046`, `048`, `049`, `052`–`056`, `057`–`079`, `080`–`084`, `086`–`096`, `099`, `100`, `103`, `104`, `111`–`113`, `115`, `117`, `245`–`260`, `261`, `262`, `263`–`283`, `286`, `306`, `311`, `312`. Never rendered (asserted): `jt.001`–`004`, `006`–`020`, `116`, `118`–`142` (the chrome copies, R15); `jt.025`, `287`, `288`, `302`–`305`, `307`, `308` (composed counts → ICU, W1); `jt.047`, `085`, `105`–`107` (Operations links, W89); `jt.050`, `051`, `309`, `310` (the expand panel); `jt.097`, `098`, `101`, `102`, `108`–`110`, `284`, `285`, `313`–`321` (the speculative form, W3); `jt.114` (→ `settings.careersEmail`, W102); `jt.143`; `jt.144`–`244` (the fixture roles, D23); `jt.289`–`301` (→ `sourceCountries`, D17). Rendered as authored though flagged for the WP-C copy review: `jt.043`, `078` (legal-flagged, verbatim), `jt.046` and `264` ("you get a reference number" — the status link arrives in Operations' confirmation e-mail, not from the website door, X11), `jt.096` ("we reply within a week", parity-baselined, beside the `replySlaHours` metric), `jt.082`/`256` ("two to three weeks"), the seven step `when` labels `jt.265`, `268`, `271`, `274`, `277`, `280`, `283`.

**CLIENT_SYS additions:** none. The page's two client modules call no `useTranslations`: `RolesList` receives every string resolved plus two plain `{token}` templates read on the server with `sys.raw` (W148), and `ApplyStartPing` reads only the locale and the pathname; `FormShell`/`Field`/`FallbackPanel` read `sys.form`, already listed.

**Foundation gaps:** none blocking. Notes: (1) catalog v1.1 `portfolioUrl` is sent under the wire name `A/produces-final.md` § Task 8 — as built spells it, confirmed by the Task 8 report and read in the v1.1 catalog source at Operations `47a2160` (re-read at the 2026-10-01 recheck: the Operations main checkout's `main` now contains that commit, so `apps/backend/src/modules/website/website-form-catalog.ts` on `main` is the source; the `careers` field list is unchanged); the site's check mirrors the door's W161 rule exactly. (2) `jobPostingJsonLd` has no `jobLocationType: 'TELECOMMUTE'` / `applicantLocationRequirements`, so a remote opening is described by its city and country only (Google's remote-job guidance wants both) — an additive builder field for a later task. (3) `jobPostingJsonLd`'s `jobLocation.city` is a required string: an opening without a city passes its country's name. (4) `Field as="select"` always prepends the `sys.form.placeholders.select` option, so the residency-locked select shows an empty choice beside the opening's country (the server refuses anything else). (5) One OG image per locale for every opening (W169) — the index's `/og/{locale}/careers.png`, passed through `openGraph.images`: the OG route renders `sys.seo.<pageKey>.title` with no ICU arguments (`ogTitle`, `src/lib/seo/og.ts`), so a template page cannot draw a per-opening title (T12's blog article does the same with `/og/{locale}/blog.png`); a per-opening image needs an OG route that takes a title (Phase B). (6) How fast a publish or close reaches the site depends on Operations sending the `openings` tag to `/api/revalidate` (I2) — not verified here; the 300 s floor bounds it either way. (7) The WP1 hint `sys.form.hints.portfolioUrl` ("A link starting with https://.") contradicted the door's scheme-less acceptance (W161); Cycle 2 rewrites it in both locales (W178). `sys.form.placeholders.portfolioUrl` ("https://") is left as the foundation has it — the ruling names the hint only.

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>`):

```markdown
| T11 Careers index + detail | `/kariyer` · `/en/careers`; W93 fixture detail `/kariyer/work-permit-officer-antalya` · `/en/careers/work-permit-officer-antalya` (fixture door, W112) | js-size (local, fixture-door build): `/kariyer` <n> B · `/en/careers` <n> B · detail TR <n> B · detail EN <n> B (ceiling 204,800; binding lazy line 194,560, local trigger 191,724 — W162; projected ≈ 179–183 / 176–180 / 184–189 KB); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/kariyer` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (<element>) · CLS <n>; `/en/careers` perf <x.xx> · LCP <n> ms · CLS <n>; detail TR perf <x.xx> · LCP <n> ms (<element>) · CLS <n>; detail EN perf <x.xx> · LCP <n> ms · CLS <n> | pixel: n/a — not a D27 page (side-by-side review against named deltas 1–12) | <YYYY-MM-DD> |
```
