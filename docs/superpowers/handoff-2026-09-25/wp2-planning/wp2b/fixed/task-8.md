### Task 8: Available Workers — `/adaylar` · `/en/available-workers`

**Why this task exists.** The route is the site's candidate page (design-package page 10, `design-package/design/Available Workers.dc.html`, strings `design-package/strings/availworkers.json`, ids `availworkers.001`–`250`). No page exists yet: `/available-workers` is listed in `UNBUILT_PATHNAMES` and answers 404 through the `[...rest]` catch-all. The design is a live candidate pool — filters, a basket and cards fed by a 12-record inline JS fixture — around one request form. Phase A has no pool source: the CRM `website-feed` (cards v1.1, stats "may ship with Phase B", SPEC §3.3) is unbuilt and Operations has no pool service; `pool` is a `FIXTURE_ONLY_COLLECTIONS` entry (`src/content/config.ts` — `assertServableInProduction` throws on a LOCAL bundle carrying pool rows under `NODE_ENV=production`, which Vercel sets on previews too, D23); per-profile cards are off behind the D2 switch. So this task ships the **request form** (door key `workers`, `INQUIRY`), the **"what verified means" steps**, the **after-you-pick timeline**, the **FAQ**, the **sticky bar** and the **closing band**, and renders the `#pool` section as the designed **empty state** that points at the form. The aggregate stats strip is **not rendered**: no signed pool number exists ("200+" is no metric key, "Updated weekly" a cadence claim with no source — W1/W6/D17), and its future source is the CRM stats endpoint, not the fixture rows. Copy that presupposes visible cards (`availworkers.023`, `048`, `052`/`053`, `107`, `210`/`211`) is rendered by data, not deleted: it sits behind `poolSigned` / `cardsVisible` (`_lib/pool.ts`), false in Phase A, so the v1.1 cards task un-deletes nothing (W4/W5/W6). The pool fixture is never imported anywhere (D23; the ESLint `no-restricted-imports` rule forbids `design-package/**` and `content/local/*` under `src/**`). Every number is a metric through `makeTf`, every string a package id or a `sys.workers.*` key (W9/W23), every contact anchor fires its event with a placement (W12).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (HEAD ≥ `bc708a3`) — never the shared checkout `…/jobsadmire-website` (it is on `main`). Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → T2 → T3 → T4 → T5 → T6 → T7 → **T8** → T9 …: when this task starts, T1 has created the shared doc shapes (W98: the `## Pages` table in `docs/SEO.md`, `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` in `docs/CONTENT-MODEL.md`, the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 has shipped `/privacy` (the consent link); T2 `/hire-workers` with `id="request-form"` (this page's closing-band target); T4 `/work-permit`; T5 `/partner-with-us` (the form footer's link) and `html { scroll-padding-bottom: var(--sticky-cta-h, 0px) }` in `src/app/globals.css`. WP2a is fully built and reviewed, and the Operations catalog v1.1 is live (WP2a Task 8 as built, Operations `main` `47a2160`). Where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `bc708a3`.

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first). The task ends with ONE proof session (W126, Cycle 5): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size` and the launch anchor check, then the server is killed and no stray process is left. Playwright runs only inside that session (the page spec is written in Cycle 4 and executes there). This page is not a D27 pixel page (the four are T1, T2, T3, T12) — it gets the Fable side-by-side review, so no `npm run pixel`. Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified at `bc708a3` — read before touching anything).**
- Internal key `/available-workers` → TR `/adaylar`, EN `/en/available-workers` (`src/i18n/routing.ts` `pathnames`). Private folders (`_lib`, `_components`, `__tests__`) never become routes (`unbuilt.test.ts` skips `_`-prefixed folders).
- Page record (both bundles): `bundle.pages.workers = { titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` → `buildMetadata` uses `fallbackTitle`/`fallbackDescription` = the new `sys.seo.workers.*` (W23/W38; the design's helmet title/description are outside the catalogue and ~300 chars). OG image `/og/{locale}/workers.png` (`OG_PAGE_KEYS` holds `workers`; CDN-cached, W123). The locale layout's `metadata.title` is the plain string `'JobsAdmire'` (no template), so `<title>` is exactly the sys title.
- `CTA_BY_PATHNAME['/available-workers']` (`src/design/chrome/ctas.ts`) = primary `availworkers.016` + tail `home.003` ("See" + "Candidates") → `{ pathname: '/available-workers', hash: '#pool' }`; secondary = the default (`home.008` → `/partner-with-us`). **This page must render `id="pool"`** (W17/W152/W158: `gate:launch`'s anchor sweep reports `missing id="pool"` on both locales until it does). No edit to `ctas.ts` (W121).
- `src/lib/seo/routes.ts` `UNBUILT_PATHNAMES` contains `'/available-workers'` → this task deletes it in the commit that adds `page.tsx` (W20; `unbuilt.test.ts` fails in either direction otherwise). `e2e/routes.ts` `GATE_ROUTE_TABLE` has no row for this page → two appended (W21).
- Settings (LOCAL bundles): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` only where set — `staging`, W92).
- Metrics (`metricValues`): `homepageReplyHours '24'`, `replySlaHours '4'`, `firstDayWeeks '6–8'` (text), `firstDayWeeksInCountry '4–6'` (text), `countries '13'`. Re-authored ids this page renders: `availworkers.106` (`{homepageReplyHours}`), `142` (`{replySlaHours}`), `220` (`{firstDayWeeksInCountry}`, `{firstDayWeeks}`) and — only while cards are visible — `048`; `038`/`067`/`071` are not rendered. `availworkers.026` arrives W7-corrected (TR `Türkiye'de`, EN `in Türkiye`).
- Operations catalog `workers` (`INQUIRY`; `P/operations-door-contract-as-built.md` v1.0 + `A/produces-final.md` § Task 8 — **as built and live**): `name*` ≤ 120, `company*` ≤ 200, `email*` ≤ 254, `phone*` ≤ 40 (≥ 8 digits), `country` ISO-2, `iAm` ∈ `direct_employer | hr_agency`, `trade` ≤ 200, `headcount` ≤ 10, `startWhen` ≤ 120, `message` ≤ 5,000, **v1.1** `city` ≤ 120 (an optional string inside `fields`; the inbox preview prints `city: …` as its own line). **No `sector` field and no field for basket references** — an unknown key is dropped silently (listed in `dropped`, HTTP 200), so the mapper copies exactly these names. Classification `DIRECT_EMPLOYER` by default, `HR_AGENCY` through `iAm`.
- The design's breakpoints: its `≤ 900 px` collapses → `lg:` (901 px); `≤ 700 px` → `md:` (701 px) (D19 — breakpoints are never scaled). The header is `sticky top-0`, so the two in-page anchor targets (`#pool`, `#pool-form`) carry `scroll-mt-20`.
- `.container-site` is unlayered CSS (`max-width`, `margin-inline`, `padding-inline`): no `max-w-*`/`mx-*`/`px-*` utility on the same element — every narrower measure sits on an inner element.

**Design deltas this page carries on purpose (named, so the Fable side-by-side reviewer files them under (a) D20 / (b) design delta — D20/D27):**
1. D13: the inline "Request sent" panel (`availworkers.037`/`038`) → navigation to `/tesekkurler?form=workers`; every failure → the D11 fallback panel (its WhatsApp intro is the page's own prefill `availworkers.224`).
2. W79: the kernel's consent **checkbox** (`sys.form.consent.label`, link `/privacy`); the design's KVKK sentence `availworkers.039` + `040` is not rendered → WP-C legal sheet.
3. W115/D20: every input shows a visible label — the package's own field texts `143`/`150` (company), `044` (name), `045` (email), `046` (phone), `047` (city), `144`/`151` (roles-and-volume → `trade`); the design's placeholder-only inputs are gone.
4. W3/W16 + catalog: three optional catalog fields join the design's six — `headcount` (1–9,999), `startWhen` (the W78 keys), `message` (prompt `145`/`152`, the design's own unrendered message placeholders); `city` stays required and rides as the v1.1 `city`; `country: 'TR'` is sent silently (the form asks for a city in Türkiye).
5. The role tabs → `RadioChips` (native radios in a labelled radiogroup, legend `sys.form.labels.iAm` visually hidden); the submit reads `146` for both roles (`153` unused — `FormShell` takes one static label, accepted in the reconcile list).
6. No mobile-collapsed form (`.ja-form-cta`, `032`–`035` with the hard-typed "Reply in 4 h" chip) and no basket panel (cards off): the full form at every width.
7. W6/D2/D23: no popular chips (`031`), no stats strip (`055`–`058`, `225`), no sort/filters/cards/load-more, no "Can't see the profession" card (`070`/`071` presuppose the visible pool); the `#pool` section is the sys heading + intro + `EmptyState` whose CTA jumps to the form; "Live from our portal" (`023`) renders only while pool rows exist.
8. The hero is the navy gradient over the named `aw-hero` placeholder (§10 row 4: gradients by default outside Homepage/Hire Workers), so the **h1 is the LCP element**; the hero WhatsApp CTA wears the `success` face (W127) instead of the design's pale-green fill.
9. D20: the form head is `blue-safe` → `navy` with full-white copy (white on the design's `#1899D5` is 3.2:1 at body-small); the employer head is `sys.workers.form.titles.direct_employer` (`107` "Request these candidates" presupposes cards).
10. The sticky bar is the foundation's navy bar (≥ 901 px): Call (`secondary`), WhatsApp (`success`), "Request workers →" → `#pool-form` (the design's link went to the retired `/hire-workers-in-turkey`); its message is `sys.workers.sticky.message` (`048` "Found a profile that fits?" presupposes a visible profile); hidden near `#pool-cta` exactly as the design's scroll rule.
11. "What verified means": `ProcessSteps` `cards` on the vertical rail replaces the design's four-column grid with the scroll-drawn journey line (no IntersectionObserver, W13); step 4 keeps its "Goes live" pill (`081`).
12. "After you pick": `ProcessSteps` `plain` in a white card (numbered dots instead of icon dots); badges `091` / `sys.workers.timeline.days1to3` / `096` / `sys.workers.timeline.arrival` over `firstDayWeeks` — the design's "Weeks 4–8" becomes the signed "6–8" (W1/D17); the two CTAs go to the typed `/work-permit` and `/hire-workers` routes instead of the design's legacy URLs.
13. FAQ: `FaqBlock` (accordion, first pair open, `h3` triggers); the ask card has the design's WhatsApp + e-mail rows with the package labels `050` / `045` (the design shows the raw number and address); 7 pairs in Phase A (`210`/`211` — "live sample, refreshed weekly, 200+" — hidden, W6/D17); the two answers the design keeps only in JavaScript (`218`, `221`) render their package twins `wp.350` and `hire.302`.
14. The closing band is the foundation's dark `ClosingCtaBand` (tone `gradient`) instead of the design's light band: WhatsApp (`108`, `success` face) + "Send a hiring request" (`109`) → `/hire-workers#request-form` (W82); the mobile-only "Request these candidates" button (`107`) is not rendered; the licence line `110` + the tracked e-mail stay under the band.
15. W95: every `wa.me` link carries only `availworkers.224` — the design's seven hard-coded English prefills are not ported.

**Files:**

Create
- `src/app/[locale]/(site)/available-workers/page.tsx`
- `src/app/[locale]/(site)/available-workers/actions.ts` (`'use server'`)
- `src/app/[locale]/(site)/available-workers/_lib/options.ts` — `ROLE_KEYS`, `RoleKey`, `isRoleKey`, `FIELD_MAX`
- `src/app/[locale]/(site)/available-workers/_lib/message.ts` — `MESSAGE_MAX`, `PROFILE_REF_PATTERN`, `PROFILE_REFS_PREFIX`, `parseProfileRefs`, `composeWorkersMessage`
- `src/app/[locale]/(site)/available-workers/_lib/pool.ts` — `POOL_CARDS`, `poolRows`, `poolSigned`, `cardsVisible`
- `src/app/[locale]/(site)/available-workers/_lib/content.ts` — `verifiedSteps`, `afterSteps`, `WORKERS_FAQ`, `workersFaqItems`
- `src/app/[locale]/(site)/available-workers/_lib/spec.ts` — `workersSchema`, `WorkersInput`, `WORKERS_COUNTRY`, `toWorkersFields`, `WORKERS_SPEC`
- `src/app/[locale]/(site)/available-workers/_lib/assets.ts` — `HERO_SRC`, `HERO_SIZE`
- `src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx` (`'use client'`)
- `src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts`, `pool.test.ts`, `message.test.ts`, `content.test.ts`, `spec.test.ts`, `RequestFormFields.test.tsx`, `ids.test.ts`
- `e2e/pages/workers.spec.ts`
- only if Cycle 5's conditional lazy pass runs: `src/app/[locale]/(site)/available-workers/_components/LazyStickyBar.tsx` (`'use client'`)

Modify
- `src/messages/tr.json`, `src/messages/en.json` — a `workers` member inside the existing `sys.seo` object, and a new `sys.workers` object placed immediately before `sys.form` (identical key sets)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the line `'/available-workers',` (nothing else)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: append `{ path: '/adaylar', indexable: true }` and `{ path: '/en/available-workers', indexable: true }` as the literal's last two entries
- `docs/CONTENT-MODEL.md` — one bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (W98)
- `docs/SEO.md` — one row in T1's `## Pages` table (W98)
- `docs/ANALYTICS.md` — one bullet under `### Page instrumentation (WP2b)` (W98; no new event, parameter or enum value)
- `docs/PRD.md` — §2, the table row whose page cell is `Available Workers` (its last cell), and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**" (the page count), edited in place (W45)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T8 row of the `## Ledger` table (Cycle 5)

Test
- Vitest: the seven files under `available-workers/__tests__/` (matched by `vitest.config.mts`'s `src/**/*.test.{ts,tsx}`; `[locale]`/`(site)` are literal directory names the glob walks)
- Playwright (both projects, in the gate only): `e2e/pages/workers.spec.ts`
- Existing, must stay green untouched: `src/design/__tests__/class-collisions.test.ts` (W155 — it scans `src/app/**`, so every class string below is part of the gate), `src/design/__tests__/client-imports.test.ts` (W147/W156/W158 — barrels forbidden everywhere outside the dev gallery, type-only imports included), `src/i18n/client-messages.test.ts` (W148), `src/messages/{messages,voice}.test.ts` (W154), `src/forms/options.test.ts` (W78), `src/lib/seo/{unbuilt,routes}.test.ts` (W20), `scripts/gate-routes.test.ts` (W21 — EN/TR parity), `src/app/{sitemap,robots}.test.ts`, `e2e/{routing,seo,a11y,width-sweep,chrome,headers,thank-you}.spec.ts`

**Interfaces:**

Consumes (exact names, verified in the code at `bc708a3`; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeTf`, `metricValues` from `@/content/adapter` (`server-only`; `export * from './pure'`); `makeTf`, `assertServableInProduction(bundle, source, env)` (throws `collections … are never served from LOCAL in production (D23)`) from `@/content/pure`; `testBundle({ strings?, collections?, settings? })` from `@/test/bundle` (the golden fixture: 20 strings, empty collections); `type Bundle` from `contract/website-bundle.v1` (relative: five `..` from `available-workers/page.tsx`, six from `_lib/`, `_components/`, `__tests__/`).
- Forms kernel (`src/forms/**`): `createFormAction`, `type FormActionState`, `type FormSpec` from `@/forms/action` (`FormSpec = { key: FormKey; schema; toFields(parsed, data, ctx: FormActionContext): WireFields | Promise<WireFields>; consent?: 'checkbox' | 'notice' }`; the kernel trims every string before the schema runs, adds `errors.consent = 'consent'` when the tick is missing, answers `{ kind: 'unauthorized' }` without a network call when `OPS_API_URL`/the write token are absent, and redirects `{ pathname: '/thank-you', query: { form: key } }` on a non-`FAILED` 200 — `/tesekkurler?form=workers`, D13); `fieldErrorsFromIssues` from `@/forms/errors` (first issue per path; a `FormErrorCode` in `message` wins; `.min(1)` → `required`; `invalid_type` on `undefined` → `required`); `START_WHEN_KEYS` (`['asap', 'month1', 'months1to3', 'planning']`, labels `sys.form.options.startWhen.<key>`) from `@/forms/options`; `type WireFields` from `@/forms/wire` (`buildEnvelope` drops empty strings); `FormShell` from `@/forms/client/FormShell` — props used: `action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, consent, testId, className` (no `consentLinkHref` — `'/privacy'` is its only value and the default, W79; no `idScope` — one `workers` shell on the page, so every id is `f-workers-<name>`, `f-workers-consent`); `Field`, `type FieldOption` from `@/forms/client/Field` — props used: `name, label, placeholder, required, as, type, options, autoComplete, inputMode, rows, min, max, maxLength` (label `label ?? sys.form.labels.<name>`; placeholder `placeholder ?? sys.form.placeholders.<name>`, `''` suppresses it; hint `sys.form.hints.<name>` or `sys.form.hints.optional` on a non-required field; the select branch prepends `sys.form.placeholders.select` and ignores `placeholder`, W111); `useFieldValue`, `FormErrorsContext`, `type FormErrorsValue` from `@/forms/client/FormErrorsContext`; the D11 `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, focused on arrival, WhatsApp anchor href = bare `https://wa.me/<n>`, the prefill opened via `window.open` at click time — W76).
- Blocks (by path, `@/design/blocks/<Name>`): `Breadcrumbs` (`{ locale, items: Crumb[], tone?: 'light' | 'dark', className? }`, `Crumb = { name, href: Href }`, emits `BreadcrumbList`, nav named `sys.nav.breadcrumbs`); `ClosingCtaBand` (`{ bundle, locale, titleId, bodyId?, primary: Cta, secondary?: Cta, extra?, ticks?, tone?: 'navy' | 'gradient' | 'green', id? }`, `Cta = { label, href: string | Exclude<Href, string>, external?, variant? }` — the root `<div>` carries `id`); `ContactCta` (`{ placement: 'page_cta' | 'office_card', href: string | Exclude<Href, string>, variant?, size?: 'md' | 'lg', external?, className?, 'aria-label'?, children }`); `EmptyState` (`{ title, body?, cta?: EmptyStateCta, tone?: 'light' | 'pale' | 'dark', icon?, headingLevel?: 2 | 3, testId?, className? }`, `role="status"`, CTA through `ContactCta` `page_cta`); `FaqBlock` + `type FaqItem` (`{ bundle, locale, items: FaqItem[], id?, eyebrowId?, headingId?, bodyId?, askCard?: FaqAskCard, singleOpen?, openFirst?, headingLevel?, footer? }`, `FaqItem = { id, q, a }` resolved, emits `FAQPage`; `FaqAskCard = { titleId, bodyId, whatsappNumber, whatsappText, whatsappLabelId, phone?, callLabelId?, email?, emailLabelId?, subject? }`, W83 — the WhatsApp row wears `success`); `ImageSlot` (`{ slot, lcp?, src?, alt, width, height, sizes?, className?, priority? }` — owns its box, W129); `ProcessSteps` + `type ProcessStep` (`{ n, titleId, bodyId, when? }` — `when` resolved; props `{ bundle, locale, steps, variant?: 'cards' | 'plain', id?, headingLevel?: 3 | 4 }`, the `id` lands on the `<ol>`).
- Primitives (by path, `@/design/primitives/<Name>`): `Button` (`variant` ∈ `primary|secondary|ghost|danger|inverse|success|inverse-dark|nav`, `size?: 'md' | 'lg'`, `href?` string — `/…` → typed next-intl `Link`, `#…` → plain anchor, R22; `external?`); `Eyebrow`; `Section` (`{ tone: 'light'|'dark'|'pale'|'band', id?, className?, children }` — tones set the surface and `py-16`/`py-10`; no test-id prop, W113); `RadioChips` (`'use client'`; `{ name, options: { value, label }[], value, onChange, legend, legendHidden?, className? }`).
- Chrome/analytics: `StickyCtaBar`, `type StickyCta` (`{ label, href: string | Exclude<Href, string>, variant?, external? }`) from `@/design/chrome/StickyCtaBar` (props `message, ctas, showAfterPx? = 700, hideNearId?, live?`; renders `null` while hidden; wrapper `data-testid="sticky-cta"`, `hidden … lg:block`; publishes `--sticky-cta-h`; contact hrefs through `ContactCta` `page_cta`, W81); `WhatsAppIcon` (`{ size?, className? }`, `aria-hidden`) from `@/design/chrome/icons`; `ContactLink` from `@/analytics/ContactLink` (`'use client'`; anchor props minus `href | onClick | onAuxClick`, plus `href`, `placement`).
- i18n/SEO/contact: `routing` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `getTranslations`, `setRequestLocale` from `next-intl/server`; `hasLocale` from `next-intl`; `buildMetadata` from `@/lib/seo/metadata` (`{ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription }`); `waLink`, `telLink`, `mailLink(email, subject?)` from `@/lib/contact`; `renderWithIntl` from `@/test/render` (full real `sys.*` catalogues).
- Messages consumed, not added: `sys.form.labels.{iAm,headcount,startWhen,message}`, `sys.form.options.startWhen.*`, `sys.form.placeholders.*`, `sys.form.hints.{optional,phone}`, `sys.form.errors.*`, `sys.form.consent.label`, `sys.form.fallback.*`, `sys.nav.breadcrumbs`, `sys.thankYou.forms.workers` (the thank-you page's line).
- Gate tooling: `npm run gate` / `npm run gate:launch` (`scripts/gate.sh`; the launch profile's `scripts/launch/dead-targets.ts` names `missing id="pool"` while the anchor is absent), `npm run js-size` (`scripts/js-size.mjs`), Playwright projects `mobile` (Pixel 7) and `desktop` (1440×900); `/api/site-health` answers `ops.state: 'unconfigured'` on a door-less face.

Produces (for T14's instance map, T15's launch sweep and the v1.1 cards task — nothing imports these files across route folders):
- DOM: `section#pool` (the header CTA and the hero "Browse candidates" land there; in Phase A it holds the `EmptyState`, `data-testid="pool-empty"`); `#pool-form` (the hero request card — the sticky bar and the empty state jump there); `form[data-testid="workers-form"][data-form-key="workers"]` (ids `f-workers-<name>`); `ol#verified-steps`; `#faq`; `#pool-cta` (the closing band, the sticky bar's `hideNearId`); one `data-lcp-slot` (the h1); placeholder `aw-hero`; section test ids `workers-hero`, `workers-pool`, `workers-verified`, `workers-after`, `workers-faq`, `workers-closing`; `workers-form-head`.
- Wire (T14's I4 `workers` instance, W105): always `iAm` (`direct_employer` | `hr_agency`), `name`, `company`, `email`, `phone`, `country: 'TR'`, `city` (required on this page, catalog v1.1), `trade` (required on this page — the typed roles and volume, W77); `headcount` (1–9,999), `startWhen` (a W78 key) and `message` only when given. Basket references (v1.1) fold into `message` behind `Profiles: ` (no catalog field). Consent checkbox. The form lives in the hero card `#pool-form`, not inside `#pool` (check.md's T14 note).
- For the v1.1 cards task: `_lib/pool.ts` (`POOL_CARDS`, `poolRows`, `poolSigned`, `cardsVisible`), `_lib/message.ts` (`composeWorkersMessage`, `parseProfileRefs`, `PROFILE_REFS_PREFIX`) with the schema's `profileRefs` slot, `workersFaqItems(bundle, locale, showLiveSample)`, and the `#pool` section's `EmptyState` slot the grid replaces.

**Rulings applied:**
- W1/D17 — every `{metric}` string reads the `metrics` collection through `makeTf`; the arrival badge and the sticky bar render only while their metric is signed; no stats strip (no signed pool number).
- W3/W16 + WP2a Task 8 as built — one door key `workers`; exact catalog names; `city` rides as the live v1.1 field; `country: 'TR'`; the door's required set wins (`name`, `company`, `email`, `phone`).
- W4/W5/W6 — pool-derived and card-presupposing copy renders by data (`poolSigned`, `cardsVisible`), never deleted; the `#pool` section is the designed `EmptyState`.
- W7 — `availworkers.026` arrives corrected; read, never patched here.
- W9/W23/W54 — ten `sys.workers.*` keys + `sys.seo.workers.*` for id-less copy only; the two JS-only FAQ answers reuse their package twins; the only composed package sentences are the package's own splits (`024`/`025`/`026` h1, `042` + `043`, `083` + `084`).
- W12/W26/W67 — no page event; every `tel:`/`wa.me`/`mailto:` anchor is a `ContactCta`, a `ContactLink` or a block that renders one, with `placement: 'page_cta'`.
- W13 amended/W120/W136 — the form island is a plain client import (above the fold, the page's content); the ledger's JS figure is `js-size`'s; the only lazy candidate (conditional, Cycle 5) is the sticky bar.
- W14 — no hot-linked images (an inline icon, a named placeholder).
- W17/W121/W152/W158 — no `ctas.ts` edit; `id="pool"` rendered in both locales; Cycle 5 proves the launch anchor sweep no longer names it.
- W18/W81 — the page mounts `StickyCtaBar` with the design's Call / WhatsApp / Request workers, `hideNearId="pool-cta"` (the design's own rule), `live` only while pool rows exist; T5's `scroll-padding-bottom` keeps focused fields above it.
- W19/R31 — lives in the `(site)` group; no `<main>` (the layout owns it).
- W20/W21 — `'/available-workers'` leaves `UNBUILT_PATHNAMES` in the commit that adds `page.tsx`; the two locale paths join `GATE_ROUTE_TABLE` and nowhere else.
- W27/W55/D26 — `aw-hero` is a named placeholder; exactly one `data-lcp-slot` (the h1; `HERO_SRC` moves it onto a photo).
- W30/W115 — the package's field texts are passed as `label`; `sys.form.labels.*` only for `headcount`, `startWhen`, `message` and the `iAm` legend; the e2e selects inputs by the rendered label.
- W45/W98 — every doc edit anchors on T1's headings/sentences and appends a row/bullet; no line numbers.
- W73–W76/W116/W117 — the kernel as built (one shared 9 s deadline, one connection-level retry, bare fallback href + click-time prefill); no uploads on this page.
- W77/W78 — `iAm` posts keys; `startWhen` = `START_WHEN_KEYS` with `sys.form.options.startWhen.*`; `trade` travels as typed free text; no sector key rides anywhere (the catalog has no `sector` on `workers`).
- W79 — `consent: 'checkbox'` in the spec and the shell; no `consentLinkHref`; `availworkers.039`/`040` → WP-C sheet.
- W82 — the closing band's secondary is `{ pathname: '/hire-workers', hash: '#request-form' }`.
- W83 — the FAQ ask card's e-mail row (`email`, `emailLabelId: 'availworkers.045'`, `subject`); no `footer` workaround.
- W92 — the page e2e is deterministic door-less: the submitting case runs only where `/api/site-health` reports `ops.state: 'unconfigured'`; the empty-submit case never reaches the door.
- W95 — every `wa.me` link carries only `availworkers.224`; the fallback anchor is bare; nothing typed sits in any href.
- W99 — T8 runs after T1, T13, T2–T7. W105 — Produces records the instance exactly as the spec sends it. W109 — breadcrumbs `availworkers.021` → `/`, `022` → this page.
- W111 — the `startWhen` select starts on `sys.form.placeholders.select` (`''` → accepted as "not given"); no `placeholder` passed to it.
- W113 — section test ids sit on inner `<div>`s; `Section`'s props stay frozen.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — no `hidden` beside an unprefixed display utility; no class string sets one property twice at one variant; no colour/box class reaches `Button`/`ContactCta` (the WhatsApp faces are the `success` variant, W127) or `ImageSlot` (W129 — a cover wrapper sizes it); `class-collisions.test.ts` scans every file below.
- W123/W124 — OG image CDN-cached, never "ISR"; not a template record.
- W125/W130/W134/W147/W156 — primitives, blocks, chrome pieces and islands by module path everywhere, type-only imports included; no server file imports `@/analytics/useContactClick`.
- W126 — Cycle 5 is the one build + start + gate. W128/W131/W133 — not applicable.
- W132 — `LazyIsland` appears only in the conditional lazy pass, with its real props `{ load, props, fallback, rootMargin? }` (no `ssr`).
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json` = production: DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors); GTM stays dark.
- W137/W139/W140 — no preview run by the implementer (never push); the controller's binding preview run uses `--settings.extraHeaders`.
- W148 — no `CLIENT_SYS` change: the island receives every string resolved; `Field` reads `sys.form` (already listed).
- W150 — no D17 dated badge → no `revalidate` export (SSG like every static page).
- W154 — no `sys.workers.*`/`sys.seo.workers.*` string speaks as "we"/"biz" ("JobsAdmire" is the subject; `voice.test.ts` scans all of `sys.*`); the package's first-person lines wait for WP-C.
- W157/W160 — security headers come from the middleware; nothing for the page. W161 — no `url`-typed field is sent.
- Final-review page rule (§6) — exactly one `Breadcrumbs` and one `FaqBlock` (one `BreadcrumbList`, one `FAQPage`, one landmark label each); the design's client-injected `EmploymentAgency` block is not repeated (the site-wide node stands).
- D2/D11/D13/D19/D20/D23/D27 and R15/R22/R35/R56 — cards off; fallback panel; thank-you navigation; unscaled breakpoints; accessibility over pixels; no fixture import; Fable review (not a pixel page); the chrome renders its own canonical ids (this page reads `availworkers.021`/`022` only as its own crumbs); `wa.me` opens a new tab with `noopener`, `tel:`/`mailto:` stay same-tab; `page` from `next/navigation`; no `src/content/local/*` import from `src/**` (tests read the JSON with `readFileSync`).

---

#### Cycle 1 — the page's copy and pure libs: `sys.workers.*` + `sys.seo.workers.*`, role keys and caps, message folding, the pool gates, the step lists and FAQ pairing

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { START_WHEN_KEYS } from '@/forms/options';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** The page's whole `sys.workers.*` set (W6/W9/W23) — a key added to the page is added here and
 *  to BOTH message files (`src/messages/messages.test.ts` proves the two files agree; this proves
 *  the page and the files agree). The `startWhen` labels are the shared
 *  `sys.form.options.startWhen.*` (W78): consumed, not owned. */
const WORKERS_SYS_KEYS = [
  'pool.heading',
  'pool.intro',
  'empty.title',
  'empty.body',
  'empty.cta',
  'sticky.message',
  'form.titles.direct_employer',
  'timeline.days1to3',
  'timeline.arrival',
  'ask.emailSubject',
] as const;

/** sys keys the page reads but does not own. */
const CONSUMED_SYS_KEYS = [
  'form.labels.iAm',
  'form.labels.headcount',
  'form.labels.startWhen',
  'form.labels.message',
  'nav.breadcrumbs',
  'thankYou.forms.workers',
  ...START_WHEN_KEYS.map((k) => `form.options.startWhen.${k}`),
];

const flatten = (o: unknown, prefix = ''): string[] =>
  typeof o === 'object' && o !== null
    ? Object.entries(o).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

const get = (o: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, k) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined),
      o,
    );

describe('sys.workers.* and sys.seo.workers.* (W6/W9/W23)', () => {
  for (const [name, messages] of [
    ['tr', tr],
    ['en', en],
  ] as const) {
    it(`${name}: carries exactly the page's keys, none empty`, () => {
      const sys = messages.sys as Record<string, unknown>;
      expect(flatten(sys.workers).sort()).toEqual([...WORKERS_SYS_KEYS].sort());
      for (const key of WORKERS_SYS_KEYS) {
        const v = get(sys.workers, key);
        expect(typeof v, key).toBe('string');
        expect((v as string).trim().length, key).toBeGreaterThan(0);
      }
      const seo = get(sys, 'seo.workers') as { title: string; description: string };
      expect(seo.title.length).toBeGreaterThan(10);
      // A snippet-length description (docs/SEO.md): the design's own helmet text was ~300 chars.
      expect(seo.description.length).toBeGreaterThan(50);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });

    it(`${name}: every sys key the page reads but does not own exists`, () => {
      for (const key of CONSUMED_SYS_KEYS)
        expect(typeof get(messages.sys, key), key).toBe('string');
    });
  }

  it('the two ICU messages name their single argument — the metric the page fills (D17)', () => {
    for (const messages of [tr, en]) {
      const sys = messages.sys as Record<string, unknown>;
      expect(get(sys, 'workers.sticky.message')).toContain('{hours}');
      expect(get(sys, 'workers.timeline.arrival')).toContain('{weeks}');
    }
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/pool.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { assertServableInProduction } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import { cardsVisible, POOL_CARDS, poolRows, poolSigned } from '../_lib/pool';

// Test-only rows, built here: the design's 12-record JS fixture is never imported (D23).
const POOL_ROWS = [
  { publicRef: 'JA-1042', trade: 'Welder', country: 'PK', availability: 'now' },
  { publicRef: 'JA-1050', trade: 'Cook', country: 'NP', availability: '30d' },
];

describe('pool gates (D2 / D23 / W6)', () => {
  it('per-profile cards are off at launch — the D2 switch is code, not content', () => {
    expect(POOL_CARDS).toBe(false);
  });

  it('an absent or empty pool collection is unsigned: no badge, no card copy', () => {
    for (const b of [testBundle(), testBundle({ collections: { pool: [] } })]) {
      expect(poolRows(b)).toEqual([]);
      expect(poolSigned(b)).toBe(false);
      expect(cardsVisible(b)).toBe(false);
    }
  });

  it('rows alone never show card-presupposing copy while the D2 switch is off', () => {
    const b = testBundle({ collections: { pool: POOL_ROWS } });
    expect(poolRows(b)).toHaveLength(2);
    expect(poolSigned(b)).toBe(true);
    expect(cardsVisible(b)).toBe(false);
  });

  it('a LOCAL bundle carrying pool rows can never be served in production (previews included)', () => {
    const b = testBundle({ collections: { pool: POOL_ROWS } });
    // Vercel sets NODE_ENV=production on previews too, so this is the preview rule as well.
    expect(() => assertServableInProduction(b, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL in production/,
    );
    // The only lawful source of pool rows is the Operations bundle (Phase B / v1.1).
    expect(() => assertServableInProduction(b, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(b, 'LOCAL', 'development')).not.toThrow();
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/message.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  composeWorkersMessage,
  MESSAGE_MAX,
  parseProfileRefs,
  PROFILE_REFS_PREFIX,
} from '../_lib/message';

describe('composeWorkersMessage — basket refs folded into `message` (no catalog field)', () => {
  it('returns the trimmed message alone when there are no refs (Phase A: no basket)', () => {
    expect(composeWorkersMessage('  Two welders for Antalya.  ')).toBe('Two welders for Antalya.');
    expect(composeWorkersMessage('x', '')).toBe('x');
    expect(composeWorkersMessage('x', undefined)).toBe('x');
  });

  it('returns an empty string when there is neither a message nor a ref (the field is then omitted)', () => {
    expect(composeWorkersMessage(undefined)).toBe('');
    expect(composeWorkersMessage('   ', 'not-a-ref')).toBe('');
  });

  it('parses refs case-insensitively, de-duplicates, keeps order, drops junk', () => {
    expect(parseProfileRefs('ja-1042, JA-1050 ja-1042; JA-9; DROP TABLE; JA-1050')).toEqual([
      'JA-1042',
      'JA-1050',
    ]);
    expect(parseProfileRefs(undefined)).toEqual([]);
  });

  it('prepends the refs line and a blank line; the refs alone when the message is empty', () => {
    expect(composeWorkersMessage('Two welders.', 'ja-1042, JA-1050')).toBe(
      `${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`,
    );
    expect(composeWorkersMessage('', 'JA-1042')).toBe(`${PROFILE_REFS_PREFIX}JA-1042`);
  });

  it('never exceeds the door cap (message ≤ 5,000)', () => {
    expect(MESSAGE_MAX).toBe(5000);
    const out = composeWorkersMessage('a'.repeat(6000), 'JA-1042');
    expect(out.length).toBe(MESSAGE_MAX);
    expect(out.startsWith(`${PROFILE_REFS_PREFIX}JA-1042`)).toBe(true);
  });
});
```

`src/app/[locale]/(site)/available-workers/__tests__/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { afterSteps, verifiedSteps, WORKERS_FAQ, workersFaqItems } from '../_lib/content';

// Every id the FAQ builder reads, as plain strings (no `{metric}` tokens — this test is about
// pairing and gating; the golden fixture carries no metrics collection).
const STRINGS = Object.fromEntries(
  WORKERS_FAQ.flatMap((f) => [
    [f.q, `Q ${f.q}`],
    [f.a, `A ${f.a}`],
  ]),
);
const tf = (id: string) => `<${id}>`;

describe('Available Workers FAQ (W6/D17, W9)', () => {
  it('hides the live-sample pair while cards are not visible and answers the two JS-only questions with their package twins', () => {
    const items = workersFaqItems(testBundle({ strings: STRINGS }), 'en', false);
    expect(items.map((i) => i.id)).toEqual([
      'availworkers.212',
      'availworkers.214',
      'availworkers.216',
      'availworkers.218',
      'availworkers.219',
      'availworkers.221',
      'availworkers.222',
    ]);
    expect(items.find((i) => i.id === 'availworkers.218')?.a).toBe('A wp.350');
    expect(items.find((i) => i.id === 'availworkers.221')?.a).toBe('A hire.302');
    for (const item of items) {
      expect(item.q.startsWith('Q ')).toBe(true);
      expect(item.a.startsWith('A ')).toBe(true);
    }
  });

  it('shows all eight pairs, the live-sample pair first, once cards are visible (the v1.1 cards task)', () => {
    const items = workersFaqItems(testBundle({ strings: STRINGS }), 'en', true);
    expect(items).toHaveLength(8);
    expect(items[0].id).toBe('availworkers.210');
  });
});

describe('the two step lists', () => {
  it('"What verified means": four checks over 074–082, step 4 carrying the "Goes live" pill (081)', () => {
    expect(verifiedSteps(tf)).toEqual([
      { n: 1, titleId: 'availworkers.074', bodyId: 'availworkers.075' },
      { n: 2, titleId: 'availworkers.076', bodyId: 'availworkers.077' },
      { n: 3, titleId: 'availworkers.078', bodyId: 'availworkers.079' },
      { n: 4, titleId: 'availworkers.080', bodyId: 'availworkers.082', when: '<availworkers.081>' },
    ]);
  });

  it('"After you pick": four steps over 090–099 with their badges; the arrival badge is absent while firstDayWeeks is unsigned (D17)', () => {
    const signed = afterSteps(tf, { days1to3: 'Days 1–3', arrival: 'Weeks 6–8' });
    expect(signed.map((s) => [s.titleId, s.bodyId])).toEqual([
      ['availworkers.090', 'availworkers.092'],
      ['availworkers.093', 'availworkers.094'],
      ['availworkers.095', 'availworkers.097'],
      ['availworkers.098', 'availworkers.099'],
    ]);
    expect(signed.map((s) => s.when)).toEqual([
      '<availworkers.091>',
      'Days 1–3',
      '<availworkers.096>',
      'Weeks 6–8',
    ]);
    expect(afterSteps(tf, { days1to3: 'Days 1–3' })[3]).toEqual({
      n: 4,
      titleId: 'availworkers.098',
      bodyId: 'availworkers.099',
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 available-workers` → four files fail: `sys-keys` (`sys.workers` is undefined — `expected [ '' ] to deeply equal [ 'ask.emailSubject', … ]`), `pool`/`message`/`content` at import (`Failed to resolve import "../_lib/pool"` etc.).

- [ ] **Step 3: Implement**

`src/messages/tr.json` — (1) inside the existing `"seo"` object of `sys`, after its last member (add the comma the JSON needs after that member; T1/T13/T2–T7 may have added their page entries after `ogTagline` — leave them untouched):

```json
      "workers": {
        "title": "Başlamaya hazır doğrulanmış işçiler | JobsAdmire",
        "description": "Beceri testli, belgeleri kontrol edilmiş, izne hazır adaylar. Pozisyonlarınızı iletin; JobsAdmire her çalışma iznini İŞKUR lisansıyla sunar."
      }
```

(2) a new member of `sys`, placed immediately before the line `    "form": {` (four spaces — the `sys.form` object whose first child is `"labels": {`; the page objects earlier tasks placed above it stay untouched):

```json
    "workers": {
      "pool": {
        "heading": "JobsAdmire aday havuzu",
        "intro": "Havuzdaki her aday beceri testinden geçer, belgeleri kontrol edilir ve çalışma iznine hazırlanır. Profiller burada yayımlanana kadar ihtiyacınızı JobsAdmire’a iletin; eşleşen adaylar doğrudan size gönderilir."
      },
      "empty": {
        "title": "Herkese açık profiller henüz yayımlanmadı",
        "body": "Profiller, aday gizliliği (KVKK) ve iş ortaklarının onayı tamamlandığında bu sayfada görünecek. Talep formunu doldurun; JobsAdmire tam CV’leri, belgeleri ve video mülakatları doğrudan sizinle paylaşır.",
        "cta": "Talep formuna gidin"
      },
      "sticky": {
        "message": "İhtiyacınız olan pozisyonları JobsAdmire’a iletin — {hours} saat içinde tam CV ve video mülakat."
      },
      "form": {
        "titles": {
          "direct_employer": "Havuzdan aday talep edin"
        }
      },
      "timeline": {
        "days1to3": "1–3. gün",
        "arrival": "{weeks}. hafta"
      },
      "ask": {
        "emailSubject": "Mevcut adaylar hakkında soru"
      }
    },
```

`src/messages/en.json` — the same two places:

```json
      "workers": {
        "title": "Verified workers ready to start in Türkiye | JobsAdmire",
        "description": "Skill-tested, document-checked, permit-ready candidates for employers in Türkiye. Request the roles you need; JobsAdmire files every work permit."
      }
```

```json
    "workers": {
      "pool": {
        "heading": "The JobsAdmire candidate pool",
        "intro": "Every candidate in the pool is skill-tested, document-checked and permit-ready. Until profiles are published here, tell JobsAdmire what you need and matching candidates are sent to you directly."
      },
      "empty": {
        "title": "Public profiles are not published yet",
        "body": "Profiles appear on this page once candidate privacy (KVKK) and partner consent are in place. Fill in the request form and JobsAdmire shares full CVs, documents and video interviews with you directly.",
        "cta": "Go to the request form"
      },
      "sticky": {
        "message": "Tell JobsAdmire the roles you need — full CV and video interview within {hours} hours."
      },
      "form": {
        "titles": {
          "direct_employer": "Request candidates from the pool"
        }
      },
      "timeline": {
        "days1to3": "Days 1–3",
        "arrival": "Weeks {weeks}"
      },
      "ask": {
        "emailSubject": "Question about available candidates"
      }
    },
```

(`form.titles` has only the employer entry on purpose: the HR-agency head is the package's own `148`/`149`, and the employer head the design ships — `107` "Request these candidates" — presupposes visible cards, so it renders only once they are. The copy was checked against `voice.test.ts`'s rule — no "we/us/our", no "biz"/first-person plural verb; JobsAdmire is the subject — and the descriptions are 140/145 characters. `sys.seo.*` is server-only and never reaches the client payload, W90/W148.)

`src/app/[locale]/(site)/available-workers/_lib/options.ts`:

```ts
/** The `iAm` values the Operations `workers` catalog accepts (`direct_employer | hr_agency`) —
 *  the role chips post exactly these (W77: wire values are keys). `startWhen` keys are the shared
 *  W78 set in `@/forms/options`, never a page-local list. Client-safe — no zod, no message files:
 *  the `RequestFormFields` island imports this module. */
export const ROLE_KEYS = ['direct_employer', 'hr_agency'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const isRoleKey = (v: string | undefined): v is RoleKey =>
  (ROLE_KEYS as readonly string[]).includes(v ?? '');

/** The door's caps on the `workers` catalog entry (v1.0 + the v1.1 `city`, WP2a Task 8 as
 *  built) — one source for the schema and the inputs' `maxLength`. */
export const FIELD_MAX = {
  name: 120,
  company: 200,
  email: 254,
  phone: 40,
  city: 120,
  trade: 200,
  message: 5000,
} as const;
```

`src/app/[locale]/(site)/available-workers/_lib/message.ts`:

```ts
import { FIELD_MAX } from './options';

/** The door's `message` cap on the `workers` catalog entry. */
export const MESSAGE_MAX = FIELD_MAX.message;
/** A public candidate reference as the design prints it (`JA-1042`). */
export const PROFILE_REF_PATTERN = /^JA-\d{3,6}$/;
/** Not visitor copy: the line the sales team reads in the Operations inbox preview. */
export const PROFILE_REFS_PREFIX = 'Profiles: ';

/** Basket refs as one string (`ja-1042, JA-1050`) → upper-cased, de-duplicated, order kept;
 *  anything that is not a reference is dropped (the visitor's free text never rides here). */
export function parseProfileRefs(raw: string | undefined): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(/[,\s;]+/)) {
    const ref = part.trim().toUpperCase();
    if (PROFILE_REF_PATTERN.test(ref) && !out.includes(ref)) out.push(ref);
  }
  return out;
}

/** The `workers` catalog has no field for basket references (v1.0 + v1.1), so the v1.1 cards
 *  task's basket folds them into `message` as its first line. In Phase A there is no basket
 *  (cards off, D2) and `profileRefs` is never posted — the cards task adds a hidden
 *  `profileRefs` input and nothing else changes. Returns '' when there is neither text nor a
 *  ref (the caller then omits the field); never longer than the door's cap. */
export function composeWorkersMessage(message: string | undefined, profileRefs?: string): string {
  const body = (message ?? '').trim();
  const refs = parseProfileRefs(profileRefs);
  const head = refs.length ? `${PROFILE_REFS_PREFIX}${refs.join(', ')}` : '';
  const text = head && body ? `${head}\n\n${body}` : head || body;
  return text.length > MESSAGE_MAX ? text.slice(0, MESSAGE_MAX) : text;
}
```

`src/app/[locale]/(site)/available-workers/_lib/pool.ts`:

```ts
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** D2: per-profile cards are OFF at launch. Turning them on is the v1.1 cards task (partner
 *  notice + consent + DPIA), never a content edit — hence code, not a bundle setting. */
export const POOL_CARDS = false as const;

/** The raw `pool` rows. `CollectionSchemas` has no `pool` entry (accepted page-local for Phase A
 *  in the reconcile list: the collection is FIXTURE_ONLY and empty in production); the v1.1
 *  cards task adds the schema and this becomes `getCollection(bundle, 'pool')`. */
export function poolRows(bundle: Bundle): Record<string, unknown>[] {
  return bundle.collections.pool ?? [];
}

/** True only when the bundle carries pool rows — impossible under LOCAL in production
 *  (`assertServableInProduction`, D23, throws before any page renders; Vercel previews run
 *  with NODE_ENV=production too). Drives the hero's "Live from our portal" badge and the
 *  sticky bar's live dot (W6). */
export function poolSigned(bundle: Bundle): boolean {
  return poolRows(bundle).length > 0;
}

/** Copy that presupposes visible profile cards — the pool heading/intro (052/053), the employer
 *  form head (107), the sticky message (048), the FAQ's live-sample pair (210/211) — renders only
 *  when the cards themselves do: rows AND the D2 switch. Always false in this task. */
export function cardsVisible(bundle: Bundle): boolean {
  return POOL_CARDS && poolSigned(bundle);
}
```

`src/app/[locale]/(site)/available-workers/_lib/content.ts`:

```ts
import { makeTf } from '@/content/pure';
// Types by module path, never the blocks barrel — type-only imports included (W156).
import type { FaqItem } from '@/design/blocks/FaqBlock';
import type { ProcessStep } from '@/design/blocks/ProcessSteps';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

type Tf = (id: string) => string;

/** "What 'verified' means" (design `#ja-steps`): the four checks, `availworkers.074`–`082`.
 *  `ProcessSteps` resolves the title/body ids itself; step 4's "Goes live" pill (081) is its
 *  `when` — a resolved string, so it is passed in. */
const VERIFIED_STEP_IDS = [
  { n: 1, titleId: 'availworkers.074', bodyId: 'availworkers.075' },
  { n: 2, titleId: 'availworkers.076', bodyId: 'availworkers.077' },
  { n: 3, titleId: 'availworkers.078', bodyId: 'availworkers.079' },
  { n: 4, titleId: 'availworkers.080', bodyId: 'availworkers.082' },
] as const;

export function verifiedSteps(tf: Tf): ProcessStep[] {
  return VERIFIED_STEP_IDS.map((s) =>
    s.n === 4 ? { ...s, when: tf('availworkers.081') } : { ...s },
  );
}

/** "After you pick" (design `.ja-after-card`): four steps, `availworkers.090`–`099`. The badges
 *  are `091` ("Day 0"), `sys.workers.timeline.days1to3` (not in the package), `096` ("Week 1")
 *  and the arrival badge — `sys.workers.timeline.arrival` over the `firstDayWeeks` metric (W1:
 *  the design's hard-typed "Weeks 4–8" is not a signed figure) — absent while the metric is
 *  unsigned (D17). */
const AFTER_STEP_IDS = [
  { n: 1, titleId: 'availworkers.090', bodyId: 'availworkers.092' },
  { n: 2, titleId: 'availworkers.093', bodyId: 'availworkers.094' },
  { n: 3, titleId: 'availworkers.095', bodyId: 'availworkers.097' },
  { n: 4, titleId: 'availworkers.098', bodyId: 'availworkers.099' },
] as const;

export function afterSteps(tf: Tf, badges: { days1to3: string; arrival?: string }): ProcessStep[] {
  const when = [tf('availworkers.091'), badges.days1to3, tf('availworkers.096'), badges.arrival];
  return AFTER_STEP_IDS.map((s, i) => {
    const badge = when[i];
    return badge ? { ...s, when: badge } : { ...s };
  });
}

/**
 * The FAQ pairs (design `faqData`). Two answers exist only in the design's JavaScript: 218
 * ("Who files the work permit…") and 221 ("What if the worker leaves…"). The package carries the
 * same copy under `wp.350` and `hire.302` — both legal-flagged, so they sit behind the D8 APPROVE
 * gate the JS-only text would have bypassed, and W9 forbids minting an id for copy the package
 * already has; the WP-C legal review checks them in this page's context (wp.350's "track the
 * status live on your portal", hire.302's replacement guarantee). 210/211 promise a "live sample
 * of our portal, refreshed weekly" with a hard-typed "200+": shown only once cards are visible
 * (W6/D17).
 */
export const WORKERS_FAQ: readonly { q: string; a: string; liveSample?: true }[] = [
  { q: 'availworkers.210', a: 'availworkers.211', liveSample: true },
  { q: 'availworkers.212', a: 'availworkers.213' },
  { q: 'availworkers.214', a: 'availworkers.215' },
  { q: 'availworkers.216', a: 'availworkers.217' },
  { q: 'availworkers.218', a: 'wp.350' },
  { q: 'availworkers.219', a: 'availworkers.220' },
  { q: 'availworkers.221', a: 'hire.302' },
  { q: 'availworkers.222', a: 'availworkers.223' },
];

export function workersFaqItems(
  bundle: Bundle,
  locale: Locale,
  showLiveSample: boolean,
): FaqItem[] {
  const tf = makeTf(bundle, locale);
  return WORKERS_FAQ.filter((f) => showLiveSample || !f.liveSample).map((f) => ({
    id: f.q,
    q: tf(f.q),
    a: tf(f.a),
  }));
}
```

`docs/CONTENT-MODEL.md` — append this bullet at the end of the per-page `sys.*` list T1 created at the end of `### Adding copy (W9, W23, W54)` (after the last page bullet an earlier task added; W98):

```markdown
- **Available Workers (`sys.workers.*`, T8):** `pool.{heading,intro}` (the `#pool` section's head while no cards are visible — `availworkers.052`/`053` replace it once they are), `empty.{title,body,cta}` (the designed empty state standing in for the cards, W6), `sticky.message` (ICU `{hours}` = `homepageReplyHours`; `availworkers.048` replaces it once cards are visible), `form.titles.direct_employer` (the employer form head; `availworkers.107` once cards are visible), `timeline.{days1to3,arrival}` (the two after-you-pick badges the package lacks; `{weeks}` = `firstDayWeeks`), `ask.emailSubject` (the FAQ ask card's mailto subject); plus `sys.seo.workers.{title,description}` (the page record carries `''` ids). The `startWhen` labels are the shared `sys.form.options.startWhen.*` (W78); the form's field labels are the package's own texts (`availworkers.143`/`150`, `044`–`047`, `144`/`151`, W115). Not rendered in Phase A: the card-only copy (`031`–`040`, `054`–`071`, `138`–`140`, `153`–`209`, `225`–`250`; `023` only while pool rows exist; `048`/`052`/`053`/`107`/`210`/`211` only while cards are visible). The two FAQ answers the design keeps only in JavaScript (`218`, `221`) render their package twins `wp.350` and `hire.302` (legal-flagged — WP-C checks them in this context).
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/available-workers" docs/CONTENT-MODEL.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — the four new files (18 tests); `src/messages/messages.test.ts` (identical key sets in both files), `voice.test.ts` (no first-person string in the new keys), `options.test.ts` and `client-messages.test.ts` untouched and green; `client-imports.test.ts` accepts the by-path type imports in `content.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/messages/tr.json src/messages/en.json "src/app/[locale]/(site)/available-workers/_lib" "src/app/[locale]/(site)/available-workers/__tests__/sys-keys.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/pool.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/message.test.ts" "src/app/[locale]/(site)/available-workers/__tests__/content.test.ts" docs/CONTENT-MODEL.md
git commit -m "feat(workers): sys.workers/sys.seo.workers copy and the page libs — pool gates, role keys and caps, message folding, step lists, FAQ pairing (T8 c1)

W6/W23: card-presupposing copy renders by data (poolSigned, cardsVisible — false in Phase A,
D2/D23); W78: startWhen stays the shared key set; W9: the two JS-only FAQ answers reuse
wp.350 and hire.302; W154: JobsAdmire is the subject of every new string. Docs: the
CONTENT-MODEL per-page bullet (W98).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the `workers` form spec (Zod → the exact catalog field names) and the `'use server'` action

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { START_WHEN_KEYS } from '@/forms/options';
import { PROFILE_REFS_PREFIX } from '../_lib/message';
import { toWorkersFields, WORKERS_COUNTRY, WORKERS_SPEC, workersSchema } from '../_lib/spec';

/** The Operations `workers` catalog entry — v1.0 + the v1.1 `city` (WP2a Task 8 as built). A key
 *  outside this set is dropped by the door without an error, so the wire keys are asserted. */
const CATALOG_WORKERS_FIELDS = new Set([
  'name',
  'company',
  'email',
  'phone',
  'country',
  'iAm',
  'trade',
  'headcount',
  'startWhen',
  'message',
  'city',
]);

const valid = {
  iAm: 'direct_employer',
  company: 'Antalya Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 501 124 03 40',
  city: 'Antalya',
  trade: '4 housekeeping, 2 cooks',
  headcount: '6',
  startWhen: 'month1',
  message: 'Summer season, staff housing available.',
};

const ctx = { visitor: { ip: null, ua: null }, locale: 'tr' as const };

describe('workers form spec → Operations catalog `workers`', () => {
  it('sends exactly the catalog field names — the typed roles as `trade`, TR as the country, `city` (v1.1)', () => {
    const fields = toWorkersFields(workersSchema.parse(valid));
    expect(fields).toEqual({
      iAm: 'direct_employer',
      name: 'Ayşe Yılmaz',
      company: 'Antalya Otel A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 501 124 03 40',
      country: 'TR',
      city: 'Antalya',
      trade: '4 housekeeping, 2 cooks',
      headcount: '6',
      startWhen: 'month1',
      message: 'Summer season, staff housing available.',
    });
    expect(WORKERS_COUNTRY).toBe('TR');
    for (const k of Object.keys(fields)) expect(CATALOG_WORKERS_FIELDS.has(k), k).toBe(true);
    // W77/W78: no sector key rides anywhere — `workers` has no `sector` field at all.
    expect(fields).not.toHaveProperty('sector');
  });

  it('omits the optional fields the visitor left blank instead of sending empty strings', () => {
    const fields = toWorkersFields(
      workersSchema.parse({ ...valid, headcount: '', startWhen: '', message: '' }),
    );
    expect(fields).not.toHaveProperty('headcount');
    expect(fields).not.toHaveProperty('startWhen');
    expect(fields).not.toHaveProperty('message');
    expect(fields.city).toBe('Antalya');
    expect(fields.trade).toBe('4 housekeeping, 2 cooks');
  });

  it('`startWhen` accepts exactly the shared W78 keys — the retired page-local keys fail', () => {
    for (const k of START_WHEN_KEYS)
      expect(workersSchema.safeParse({ ...valid, startWhen: k }).success, k).toBe(true);
    for (const k of ['month3', 'flexible', 'tomorrow'])
      expect(workersSchema.safeParse({ ...valid, startWhen: k }).success, k).toBe(false);
  });

  it('folds basket refs into `message` — also when the visitor typed no message', () => {
    expect(
      toWorkersFields(
        workersSchema.parse({ ...valid, message: 'Two welders.', profileRefs: 'ja-1042, JA-1050' }),
      ).message,
    ).toBe(`${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`);
    expect(
      toWorkersFields(workersSchema.parse({ ...valid, message: '', profileRefs: 'JA-1042' }))
        .message,
    ).toBe(`${PROFILE_REFS_PREFIX}JA-1042`);
  });

  it('requires role, name, company, email, phone, city and trade — a blank one reads `required`', () => {
    for (const key of ['name', 'company', 'email', 'phone', 'city', 'trade'] as const) {
      const r = workersSchema.safeParse({ ...valid, [key]: '' });
      expect(r.success, key).toBe(false);
      if (!r.success) expect(fieldErrorsFromIssues(r.error.issues)[key], key).toBe('required');
    }
    const noRole = workersSchema.safeParse({ ...valid, iAm: undefined });
    expect(noRole.success).toBe(false);
    if (!noRole.success) expect(fieldErrorsFromIssues(noRole.error.issues).iAm).toBe('required');
    const badEmail = workersSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(badEmail.success).toBe(false);
    if (!badEmail.success) expect(fieldErrorsFromIssues(badEmail.error.issues).email).toBe('email');
    const badPhone = workersSchema.safeParse({ ...valid, phone: '12 34' });
    expect(badPhone.success).toBe(false);
    if (!badPhone.success) expect(fieldErrorsFromIssues(badPhone.error.issues).phone).toBe('phone');
    expect(workersSchema.safeParse({ ...valid, iAm: 'agency' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, iAm: 'sourcing_partner' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '0' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '10000' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, trade: 'x'.repeat(201) }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, city: 'x'.repeat(121) }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('is the `workers` key with a consent checkbox (R55 / W79) and takes the kernel context', async () => {
    expect(WORKERS_SPEC.key).toBe('workers');
    expect(WORKERS_SPEC.consent).toBe('checkbox');
    expect(WORKERS_SPEC.schema).toBe(workersSchema);
    await expect(
      Promise.resolve(WORKERS_SPEC.toFields(workersSchema.parse(valid), new FormData(), ctx)),
    ).resolves.toHaveProperty('country', 'TR');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 available-workers/__tests__/spec` → fails at import: `Failed to resolve import "../_lib/spec"`.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_lib/spec.ts` (pure — no `server-only`, so it is unit-testable; `FormSpec` is a type-only import and is erased; never imported by a client file — the island imports `options.ts` only):

```ts
import { z } from 'zod';
import type { FormSpec } from '@/forms/action';
import { START_WHEN_KEYS } from '@/forms/options';
import type { WireFields } from '@/forms/wire';
import { composeWorkersMessage } from './message';
import { FIELD_MAX, ROLE_KEYS } from './options';

/** The door needs 8 digits in a phone; the kernel's `phone` code names the problem. */
const PHONE = /(\D*\d){8,}/;

/** Field names are the catalog's (what each `Field name=…` posts). `.min(1)` comes first so an
 *  empty value reads `required`, not `email`/`phone` (`fieldErrorsFromIssues` takes the first
 *  issue per field). The kernel trims every string before this runs. */
export const workersSchema = z.object({
  iAm: z.enum(ROLE_KEYS),
  company: z.string().min(1).max(FIELD_MAX.company),
  name: z.string().min(1).max(FIELD_MAX.name),
  email: z.string().min(1).max(FIELD_MAX.email).email(),
  phone: z.string().min(1).max(FIELD_MAX.phone).regex(PHONE, { message: 'phone' }),
  city: z.string().min(1).max(FIELD_MAX.city),
  /** W77: the design's roles-and-volume input ("Which roles and how many workers?") is typed
   *  free text, so it travels as typed; `trade` is the only role slot `workers` has. */
  trade: z.string().min(1).max(FIELD_MAX.trade),
  // ≤ 10 characters at the door; the input bounds it to 1–9,999 (`Field min/max`), so does this.
  headcount: z
    .string()
    .regex(/^[1-9]\d{0,3}$/)
    .or(z.literal(''))
    .optional(),
  /** W78: the shared key set; a `<select>` left on its placeholder posts ''. */
  startWhen: z.enum(START_WHEN_KEYS).or(z.literal('')).optional(),
  message: z.string().max(FIELD_MAX.message).optional(),
  /** Basket references (the v1.1 cards task's hidden input); never posted in Phase A. */
  profileRefs: z.string().max(500).optional(),
});
export type WorkersInput = z.infer<typeof workersSchema>;

/** The form asks for a "City in Türkiye" (`availworkers.047`), so the catalog's optional
 *  `country` is sent and the inbox never has to guess (W105 records it for T14). */
export const WORKERS_COUNTRY = 'TR';

/** EXACT Operations `workers` catalog names (v1.0 + the v1.1 `city`); a blank optional is
 *  omitted, never sent as ''. */
export function toWorkersFields(p: WorkersInput): WireFields {
  const fields: WireFields = {
    iAm: p.iAm,
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
    country: WORKERS_COUNTRY,
    city: p.city,
    trade: p.trade,
  };
  if (p.headcount) fields.headcount = p.headcount;
  if (p.startWhen) fields.startWhen = p.startWhen;
  const message = composeWorkersMessage(p.message, p.profileRefs);
  if (message) fields.message = message;
  return fields;
}

export const WORKERS_SPEC: FormSpec<typeof workersSchema> = {
  key: 'workers',
  schema: workersSchema,
  toFields: (p) => toWorkersFields(p),
  consent: 'checkbox',
};
```

`src/app/[locale]/(site)/available-workers/actions.ts`:

```ts
'use server';
import { createFormAction, type FormActionState } from '@/forms/action';
import { WORKERS_SPEC } from './_lib/spec';

const run = createFormAction(WORKERS_SPEC);

/** The Available Workers request → Operations `POST /api/website/v1/forms/workers` (INQUIRY).
 *  Success redirects to `/tesekkurler?form=workers` (D13); every failure is the kernel's
 *  fallback panel (D11). A `'use server'` module may export only async functions, which is why
 *  the factory call sits outside (`src/forms/action.ts` is `server-only`, not `'use server'`). */
export async function submitWorkers(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return run(prev, data);
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/available-workers"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `spec.test.ts` (6 tests) beside Cycle 1's files; `actions.ts` compiles against `createFormAction` (the `'use server'` export shape is proven by Cycle 5's build).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/available-workers/_lib/spec.ts" "src/app/[locale]/(site)/available-workers/actions.ts" "src/app/[locale]/(site)/available-workers/__tests__/spec.test.ts"
git commit -m "feat(workers): the workers form spec — exact catalog fields, city v1.1, country TR, typed trade, shared startWhen keys — and the submitWorkers action (T8 c2)

W3/W16: the door's required set and names (Task 8 as built — city is live); W77: trade
travels as typed, no sector key; W78: START_WHEN_KEYS; W79: consent checkbox; basket refs
fold into message (no catalog field).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the client island: `RequestFormFields` (role chips → `iAm`, role-dependent head, labels and prompt)

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormErrorsContext } from '@/forms/client/FormErrorsContext';
import { renderWithIntl } from '@/test/render';
import { RequestFormFields, type RequestFormFieldsProps } from '../_components/RequestFormFields';

const props: RequestFormFieldsProps = {
  legend: 'I am',
  roles: {
    direct_employer: {
      tab: 'Employer',
      title: 'Request candidates from the pool',
      subtitle: 'Full CVs, documents and video interviews within 4 working hours.',
      companyLabel: 'Company name',
      tradeLabel: 'Which roles and how many workers?',
      messagePlaceholder: 'City, sector and target start date (optional)',
    },
    hr_agency: {
      tab: 'HR agency',
      title: 'Supply for your clients',
      subtitle: 'We supply the workers and file the permits — your client stays yours.',
      companyLabel: 'Agency name',
      tradeLabel: 'Which roles do your clients need, and what volume?',
      messagePlaceholder: 'Sectors you serve and cities (optional)',
    },
  },
  labels: {
    name: 'Contact person',
    email: 'Email',
    phone: 'Phone / WhatsApp',
    city: 'City in Türkiye',
  },
  startWhenOptions: [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'month1', label: 'Within 1 month' },
  ],
};

describe('RequestFormFields', () => {
  it('renders every catalog-backed field under its catalog name, with the package labels (W115)', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    for (const name of [
      'company',
      'name',
      'email',
      'phone',
      'city',
      'trade',
      'headcount',
      'startWhen',
      'message',
    ])
      expect(container.querySelector(`[name="${name}"]`), name).not.toBeNull();
    // W77/W78: no sector select on `workers`.
    expect(container.querySelector('[name="sector"]')).toBeNull();
    expect(screen.getByLabelText(/^Company name/)).toHaveAttribute('name', 'company');
    expect(screen.getByLabelText(/^Contact person/)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^Phone \/ WhatsApp/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/^City in Türkiye/)).toHaveAttribute('name', 'city');
    expect(screen.getByLabelText(/^Which roles and how many workers\?/)).toHaveAttribute(
      'name',
      'trade',
    );
    // Fields without a package label read `sys.form.labels.*` (W30).
    expect(screen.getByLabelText(/^Number of workers/)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/^When do you need them\?/).tagName).toBe('SELECT');
    // The kernel's placeholder option first, then the shared keys the page passes (W78/W111).
    expect(container.querySelectorAll('select[name="startWhen"] option')).toHaveLength(3);
    expect(container.querySelector('[name="trade"]')).toHaveAttribute('maxlength', '200');
    expect(container.querySelector('[name="city"]')).toHaveAttribute('maxlength', '120');
  });

  it('employer is the default; the head and the message prompt are the employer copy', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    expect(screen.getByRole('radio', { name: 'Employer' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'HR agency' })).not.toBeChecked();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Request candidates from the pool' }),
    ).toBeInTheDocument();
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'City, sector and target start date (optional)',
    );
  });

  it('switching the role swaps the head, the company and roles labels and the prompt; iAm is the radio pair', async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    await user.click(screen.getByRole('radio', { name: 'HR agency' }));
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Supply for your clients' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Agency name/)).toHaveAttribute('name', 'company');
    expect(screen.getByLabelText(/^Which roles do your clients need/)).toHaveAttribute(
      'name',
      'trade',
    );
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'Sectors you serve and cities (optional)',
    );
    // The radio group is what the form posts as `iAm` — no hidden input, no duplicate.
    expect(container.querySelectorAll('[name="iAm"]')).toHaveLength(2);
  });

  it('a failed submit echoes the chosen role back (useFieldValue seeds the state)', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: {}, values: { iAm: 'hr_agency' } }}>
        <RequestFormFields {...props} />
      </FormErrorsContext.Provider>,
      { locale: 'en' },
    );
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Supply for your clients' }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

`NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 available-workers/__tests__/RequestFormFields` → fails at import (`Failed to resolve import "../_components/RequestFormFields"`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx`:

```tsx
'use client';
import { useState } from 'react';
// By module path (W147/W156): the primitives barrel would ship every client primitive here.
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field, type FieldOption } from '@/forms/client/Field';
import { useFieldValue } from '@/forms/client/FormErrorsContext';
import { FIELD_MAX, isRoleKey, ROLE_KEYS, type RoleKey } from '../_lib/options';

export type RoleCopy = {
  /** the role chip — `availworkers.141` / `147` */
  tab: string;
  /** the form head — `sys.workers.form.titles.direct_employer` (107 once cards are visible) / `148` */
  title: string;
  /** `142` / `149` */
  subtitle: string;
  /** the company field's package text per role — `143` / `150`, passed as the label (W115) */
  companyLabel: string;
  /** the roles-and-volume field's package text per role — `144` / `151`: the `trade` label */
  tradeLabel: string;
  /** the design's message prompt per role — `145` / `152` */
  messagePlaceholder: string;
};

/** Every string arrives resolved (W9): the island reads no bundle and no `sys.workers` key, so
 *  `CLIENT_SYS` needs no new namespace (W148); `Field` reads its own `sys.form.*` fallbacks. */
export type RequestFormFieldsProps = {
  /** `sys.form.labels.iAm` — the radio group's (visually hidden) legend */
  legend: string;
  roles: Record<RoleKey, RoleCopy>;
  /** the package's texts for the role-independent fields — `044`–`047` (W115) */
  labels: { name: string; email: string; phone: string; city: string };
  /** `START_WHEN_KEYS` with their `sys.form.options.startWhen.*` labels (W78) */
  startWhenOptions: FieldOption[];
};

/**
 * The design's two role tabs (Employer | HR agency) swapping one form's head, labels and prompt.
 * A `RadioChips` group named `iAm` — the catalog field and its exact values (W77) — so the choice
 * is posted by the form itself, survives a failed submit (`useFieldValue` seeds the state) and
 * needs no hidden input. Rendered inside `FormShell` above the fold: a plain client import, not
 * `next/dynamic` (W13 amended).
 */
export function RequestFormFields({
  legend,
  roles,
  labels,
  startWhenOptions,
}: RequestFormFieldsProps) {
  const echoed = useFieldValue('iAm');
  const [role, setRole] = useState<RoleKey>(() => (isRoleKey(echoed) ? echoed : 'direct_employer'));
  const copy = roles[role];
  return (
    <>
      {/* D20: `blue-safe` → `navy` with full-white copy — white on the design's #1899D5 is 3.2:1
          and the subtitle is body-small. Negative margins undo the shell's `p-6` so the band
          bleeds to the card's edges. */}
      <div
        data-testid="workers-form-head"
        className="-mx-6 -mt-6 bg-gradient-to-br from-blue-safe to-navy px-6 py-4 text-white"
      >
        <h2 className="text-card-title m-0 mb-1">{copy.title}</h2>
        <p className="text-body-sm m-0">{copy.subtitle}</p>
      </div>
      <RadioChips
        name="iAm"
        legend={legend}
        legendHidden
        value={role}
        onChange={(value) => {
          if (isRoleKey(value)) setRole(value);
        }}
        options={ROLE_KEYS.map((key) => ({ value: key, label: roles[key].tab }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {/* placeholder="" — the package label already names the field; the sys placeholder
            ("Company name") would only repeat it */}
        <Field
          name="company"
          label={copy.companyLabel}
          placeholder=""
          required
          autoComplete="organization"
          maxLength={FIELD_MAX.company}
        />
        <Field
          name="name"
          label={labels.name}
          required
          autoComplete="name"
          maxLength={FIELD_MAX.name}
        />
        <Field
          name="email"
          label={labels.email}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={FIELD_MAX.email}
        />
        <Field
          name="phone"
          label={labels.phone}
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={FIELD_MAX.phone}
        />
        <Field
          name="city"
          label={labels.city}
          required
          autoComplete="address-level2"
          maxLength={FIELD_MAX.city}
        />
        <Field name="trade" label={copy.tradeLabel} required maxLength={FIELD_MAX.trade} />
        <Field name="headcount" type="number" inputMode="numeric" min={1} max={9999} />
        <Field name="startWhen" as="select" options={startWhenOptions} />
      </div>
      <Field
        name="message"
        as="textarea"
        rows={3}
        placeholder={copy.messagePlaceholder}
        maxLength={FIELD_MAX.message}
      />
    </>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/available-workers"
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — the island renders under the real `sys.form.*` catalogue through `renderWithIntl` (outside a shell `useFieldValue` reads the context's empty default and `useRegisterField` is a no-op); `eslint-config-next` 16's React Compiler rules pass (the role state is seeded by the `useState` initialiser — no state set in an effect, no ref read during render); `client-imports.test.ts` walks the island's graph (`RadioChips` by path, `Field`, `FormErrorsContext`, `options.ts` — no barrel, no message file); `class-collisions.test.ts` finds no same-property pair in the head, the grid or the chips.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/available-workers/_components/RequestFormFields.tsx" "src/app/[locale]/(site)/available-workers/__tests__/RequestFormFields.test.tsx"
git commit -m "feat(workers): the RequestFormFields island — role chips post iAm, role-dependent head, package labels and prompt (T8 c3)

W77: iAm keys; W115: the package's field texts as labels, sys.form.labels for headcount,
startWhen, message; W148: every string arrives resolved, no CLIENT_SYS change; W147/W156:
RadioChips by path; D20: blue-safe → navy head with full-white copy.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the page: hero + request card, sticky bar, `#pool` empty state, vetting steps, after-you-pick, FAQ, closing band; route registration (W20/W21); the page e2e; SEO/ANALYTICS/PRD docs

- [ ] **Step 1: Write the failing tests (and the two route-list edits the page contract depends on)**

`src/app/[locale]/(site)/available-workers/__tests__/ids.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const PAGE_DIR = join(ROOT, 'src/app/[locale]/(site)/available-workers');

/** The page's own modules (tests excluded). */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** Read, never imported: ESLint's D23 rule forbids importing `content/local/*` under `src/**`. */
const readJson = (path: string) =>
  JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as Record<string, unknown>;
const catalogue = readJson('src/content/local/catalogue.json');
const bundles = ['tr', 'en'].map(
  (locale) => readJson(`src/content/local/bundle.${locale}.json`).strings as Record<string, string>,
);

describe('package ids (W9 — an unknown id throws in dev and renders "" in production)', () => {
  const ids = new Set(
    sources(PAGE_DIR).flatMap(
      (file) => readFileSync(file, 'utf8').match(/\b(?:availworkers|hire|wp|home)\.\d{3}\b/g) ?? [],
    ),
  );

  it('the page source names the ids it renders — hero, form, closing band, the FAQ twins', () => {
    for (const id of [
      'availworkers.021',
      'availworkers.024',
      'availworkers.110',
      'availworkers.146',
      'availworkers.224',
      'wp.350',
      'hire.302',
    ])
      expect(ids.has(id), id).toBe(true);
  });

  it('every id the page source names exists in the catalogue and in both generated bundles', () => {
    for (const id of ids) {
      expect(catalogue[id], id).toBeDefined();
      for (const strings of bundles) expect(typeof strings[id], id).toBe('string');
    }
  });
});
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` literal, delete exactly this line (nothing else):

```ts
  '/available-workers',
```

`e2e/routes.ts` — append as the last two entries of the `GATE_ROUTE_TABLE` literal (after whatever row the previous page task left last — order is irrelevant to every consumer; W21):

```ts
  { path: '/adaylar', indexable: true },
  { path: '/en/available-workers', indexable: true },
```

`e2e/pages/workers.spec.ts` (runs under both Playwright projects inside the Cycle 5 gate; it needs no door and no `OPS_API_URL` — W92):

```ts
import { readFileSync } from 'node:fs';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/adaylar', en: '/en/available-workers' } as const;
type Loc = keyof typeof ROUTES;
/** Canonicals, hreflang and og:image are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';

type Json = Record<string, unknown>;
/** Read, never imported: the committed bundles and message catalogues — exactly what the build
 *  rendered (the gate runs from the repo root). */
const readJson = (path: string): Json => JSON.parse(readFileSync(path, 'utf8')) as Json;
const BUNDLE: Record<Loc, Json> = {
  tr: readJson('src/content/local/bundle.tr.json'),
  en: readJson('src/content/local/bundle.en.json'),
};
const S = {
  tr: BUNDLE.tr.strings as Record<string, string>,
  en: BUNDLE.en.strings as Record<string, string>,
};
const SYS: Record<Loc, Json> = {
  tr: readJson('src/messages/tr.json').sys as Json,
  en: readJson('src/messages/en.json').sys as Json,
};
/** `sys.<path>` in one locale — e.g. `sysText('en', 'workers.empty.title')`. */
const sysText = (locale: Loc, path: string): string =>
  path.split('.').reduce<unknown>((node, key) => (node as Json)[key], SYS[locale]) as string;

const SETTINGS = BUNDLE.tr.settings as { whatsappNumber: string; phone: string; email: string };
const WA = `https://wa.me/${SETTINGS.whatsappNumber}`;
const TEL = `tel:${SETTINGS.phone}`;
/** The one prefill every wa.me link on this page carries (availworkers.224, W95). */
const waHire = (locale: Loc) => `${WA}?text=${encodeURIComponent(S[locale]['availworkers.224'])}`;
const isMobile = () => test.info().project.name === 'mobile';
const escapeRe = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A label matcher anchored at the start — a required field's label reads "Label *". */
const label = (text: string) => new RegExp(`^${escapeRe(text)}`);

/** W92: only `staging` and production carry the Operations door. A door-less face (this task's
 *  localhost build, any other preview) reports `ops.state: 'unconfigured'`, and the kernel then
 *  answers `unauthorized` without a network call — deterministic, no lead filed. */
async function doorless(page: Page): Promise<boolean> {
  const res = await page.request.get('/api/site-health');
  const body = (await res.json()) as { ops?: { state?: string } };
  return body.ops?.state === 'unconfigured';
}

function pushed(page: Page, event: string): Promise<Json[]> {
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

type JsonLdNode = Json & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.flatMap((n) => (Array.isArray(n['@graph']) ? (n['@graph'] as JsonLdNode[]) : [n]));
  });
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only data-lcp-slot, the named aw-hero placeholder, no leaked id or token (D26/W55/W1)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1'); // aw-hero is a placeholder (§10 row 4)
    await expect(h1).toContainText(S[locale]['availworkers.025']);
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    const placeholders = await page
      .locator('[data-placeholder]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('data-placeholder') ?? ''));
    expect(placeholders).toEqual(['aw-hero']);
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/\{[a-zA-Z]+\}|undefined|\[object /);
    expect(text).not.toMatch(/\b(?:availworkers|hire|wp)\.\d{3}\b/); // a package id as text
  });

  test(`${locale}: the designed sections in order, #pool for the header CTA (W17/W152/W158), nothing pool-derived (W6/D2/D23)`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    const ids = [
      'workers-hero',
      'workers-pool',
      'workers-verified',
      'workers-after',
      'workers-faq',
      'workers-closing',
    ];
    const tops: number[] = [];
    for (const id of ids) {
      const el = page.getByTestId(id);
      await expect(el, id).toBeVisible();
      tops.push((await el.boundingBox())!.y);
    }
    expect(tops).toEqual([...tops].sort((a, b) => a - b));
    for (const id of ['pool', 'pool-form', 'verified-steps', 'faq', 'pool-cta'])
      await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
    // CTA_BY_PATHNAME['/available-workers'] (availworkers.016 + home.003) → this page's #pool.
    expect(await page.locator(`header a[href="${ROUTES[locale]}#pool"]`).count()).toBeGreaterThan(
      0,
    );
    const empty = page.getByTestId('pool-empty');
    await expect(empty).toBeVisible();
    await expect(empty).toContainText(sysText(locale, 'workers.empty.title'));
    await expect(empty.locator('a[href="#pool-form"]')).toHaveCount(1);
    await expect(page.getByTestId('pool-live')).toHaveCount(0);
    await expect(page.getByTestId('workers-pool')).not.toContainText(
      S[locale]['availworkers.052'],
    );
    await expect(page.getByTestId('workers-form-head')).toContainText(
      sysText(locale, 'workers.form.titles.direct_employer'),
    );
    await expect(page.locator('#verified-steps > li')).toHaveCount(4);
    await expect(page.getByTestId('workers-after').locator('ol > li')).toHaveCount(4);
    await expect(page.locator('#faq [data-accordion-trigger]')).toHaveCount(7);
    await expect(page.locator('#faq')).not.toContainText(S[locale]['availworkers.210']);
  });
}

test('en: metadata — the sys.seo.workers title and description, canonical, hreflang, OG image; one BreadcrumbList with the page own labels (W109), one FAQPage of seven', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await expect(page).toHaveTitle(sysText('en', 'seo.workers.title'));
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    sysText('en', 'seo.workers.description'),
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/available-workers`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/adaylar`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/adaylar`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${ORIGIN}/og/en/workers.png`,
  );
  const nodes = await jsonLdNodes(page);
  const crumbs = nodes.filter((n) => n['@type'] === 'BreadcrumbList');
  expect(crumbs).toHaveLength(1);
  expect((crumbs[0].itemListElement as { name: string }[]).map((i) => i.name)).toEqual([
    S.en['availworkers.021'],
    S.en['availworkers.022'],
  ]);
  const faqs = nodes.filter((n) => n['@type'] === 'FAQPage');
  expect(faqs).toHaveLength(1);
  expect(faqs[0].mainEntity as unknown[]).toHaveLength(7);
  // the site-wide Organization/EmploymentAgency node once — the design's per-page block is not repeated
  expect(
    nodes.filter((n) => Array.isArray(n['@type']) && n['@type'].includes('EmploymentAgency')),
  ).toHaveLength(1);
});

test('en: an empty submit answers field errors from the server action — nothing is posted, the page stays, the first invalid field takes focus (W79/D20)', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  const s = S.en;
  const form = page.getByTestId('workers-form');
  await form.getByRole('button', { name: label(s['availworkers.146']) }).click();
  const required = sysText('en', 'form.errors.required');
  for (const name of ['company', 'name', 'email', 'phone', 'city', 'trade'])
    await expect(form.locator(`#f-workers-${name}-error`), name).toHaveText(required);
  await expect(form.locator('#f-workers-consent-error')).toHaveText(
    sysText('en', 'form.errors.consent'),
  );
  await expect(form.getByLabel(label(s['availworkers.143']))).toBeFocused();
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe(ROUTES.en);
});

test('tr: a valid HR-agency request ends on the D11 panel without a door (W92) — role and values echoed, bare wa.me href, click-time prefill (W76/W95)', async ({
  page,
}) => {
  test.skip(!(await doorless(page)), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const s = S.tr;
  const form = page.getByTestId('workers-form');
  await form.getByText(s['availworkers.147'], { exact: true }).click();
  await expect(form.getByRole('radio', { name: s['availworkers.147'] })).toBeChecked();
  await expect(page.getByTestId('workers-form-head')).toContainText(s['availworkers.148']);
  await form.getByLabel(label(s['availworkers.150'])).fill('Akdeniz İK A.Ş.');
  await form.getByLabel(label(s['availworkers.044'])).fill('Gate Runner');
  await form.getByLabel(label(s['availworkers.045'])).fill('gate@example.com');
  await form.getByLabel(label(s['availworkers.046'])).fill('+90 501 124 03 40');
  await form.getByLabel(label(s['availworkers.047'])).fill('Antalya');
  await form.getByLabel(label(s['availworkers.151'])).fill('2 kaynakçı, 3 aşçı');
  await form.getByLabel(label(sysText('tr', 'form.labels.headcount'))).fill('5');
  await form.getByLabel(label(sysText('tr', 'form.labels.startWhen'))).selectOption('month1');
  await form.getByLabel(label(sysText('tr', 'form.labels.message'))).fill('Gate run — lütfen yok sayın.');
  await form.getByRole('checkbox').check(); // W79: the consent tick
  await form.getByRole('button', { name: label(s['availworkers.146']) }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toBeVisible({ timeout: 15_000 });
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  await expect(panel).toBeFocused();
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  // The echo: the role and the typed values survive the failed submit.
  await expect(form.getByRole('radio', { name: s['availworkers.147'] })).toBeChecked();
  await expect(form.getByLabel(label(s['availworkers.044']))).toHaveValue('Gate Runner');
  expect(await page.locator('a[href*="Gate"], a[href*="kaynak"]').count()).toBe(0);
  await expectBareWhatsAppFallback(page, panel, 'Akdeniz İK A.Ş.');
});

test('desktop: the sticky bar carries Call / WhatsApp / #pool-form, tracks the call (W81) and yields to the closing band', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar renders from 901 px; below it the mobile bottom bar owns the space');
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(bar).toBeVisible();
  await expect(bar).toContainText(
    sysText('tr', 'workers.sticky.message').split('{hours}')[0].trim(),
  );
  await expect(bar.locator(`a[href="${TEL}"]`)).toHaveCount(1);
  await expect(bar.locator(`a[href="${waHire('tr')}"]`)).toHaveCount(1); // the static prefill only (W95)
  await expect(bar.locator('a[href="#pool-form"]')).toHaveCount(1);
  await bar.locator(`a[href="${TEL}"]`).click();
  expect(await pushed(page, 'call_click')).toEqual([
    { event: 'call_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  await page.locator('#pool-cta').scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
});

test('tr: every wa.me link carries only the catalogued prefill (W95); the hero WhatsApp and the ask-card e-mail fire page_cta (W12/W83)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  const hrefs = await page
    .locator('main a[href^="https://wa.me/"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
  // the hero, the form footer, the FAQ ask card, the closing band (the sticky bar is not mounted at the top)
  expect(hrefs).toHaveLength(4);
  for (const href of hrefs) expect(href).toBe(waHire('tr'));
  await page
    .getByTestId('workers-hero')
    .getByRole('link', { name: S.tr['availworkers.029'] })
    .click();
  const subject = encodeURIComponent(sysText('tr', 'workers.ask.emailSubject'));
  const mail = page
    .getByTestId('workers-faq')
    .locator(`a[href="mailto:${SETTINGS.email}?subject=${subject}"]`);
  await expect(mail).toHaveCount(1);
  await mail.click();
  expect(await pushed(page, 'whatsapp_click')).toEqual([
    { event: 'whatsapp_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
  expect(await pushed(page, 'email_click')).toEqual([
    { event: 'email_click', page: ROUTES.tr, locale: 'tr', placement: 'page_cta' },
  ]);
});

test('the language links keep the visitor on this page (W17)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    `${ORIGIN}/en/available-workers`,
  );
  // The switcher anchor is in the DOM at every viewport (hidden by CSS below the header row).
  await expect(page.locator('a[hreflang="en"]').first()).toHaveAttribute(
    'href',
    /\/en\/available-workers$/,
  );
  await page.goto(ROUTES.en);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('a[hreflang="tr"]').first()).toHaveAttribute('href', /\/adaylar$/);
});
```

- [ ] **Step 2: Run to verify it fails**

`NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 src/lib/seo/unbuilt.test.ts available-workers/__tests__/ids scripts/gate-routes.test.ts` → two failures, one pass: `unbuilt.test.ts` (the set no longer holds `'/available-workers'` while no `page.tsx` exists, so the filesystem-derived expectation still lists it), `ids.test.ts` (`availworkers.021: expected false to be true` — no page source yet); `gate-routes.test.ts` green (the two new rows keep the EN/TR halves equal). The Playwright spec cannot run before the build (memory rule) — it runs in Cycle 5's gate.

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/available-workers/_lib/assets.ts`:

```ts
/** §10 row 4 ("remaining slots"): this page's hero photo is an owner input whose auto-default
 *  is the navy gradient — the `aw-hero` slot stays a named placeholder (D26/W55) and the h1 is
 *  the LCP element. A licensed photo lands here (16:9, ≥ 1,600 px wide); setting HERO_SRC moves
 *  `data-lcp-slot` onto the image and preloads it. */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1600, height: 900 } as const;
```

`src/app/[locale]/(site)/available-workers/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContactLink } from '@/analytics/ContactLink';
import { getBundle, makeTf, metricValues } from '@/content/adapter';
// Blocks, primitives and chrome pieces by module path — never a barrel (W134/W147/W156).
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ClosingCtaBand } from '@/design/blocks/ClosingCtaBand';
import { ContactCta } from '@/design/blocks/ContactCta';
import { EmptyState } from '@/design/blocks/EmptyState';
import { FaqBlock } from '@/design/blocks/FaqBlock';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { ProcessSteps } from '@/design/blocks/ProcessSteps';
import { WhatsAppIcon } from '@/design/chrome/icons';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { FormShell } from '@/forms/client/FormShell';
import { START_WHEN_KEYS } from '@/forms/options';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { mailLink, telLink, waLink } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';
import { RequestFormFields } from './_components/RequestFormFields';
import { HERO_SIZE, HERO_SRC } from './_lib/assets';
import { afterSteps, verifiedSteps, workersFaqItems } from './_lib/content';
import { cardsVisible, poolSigned } from './_lib/pool';
import { submitWorkers } from './actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const bundle = await getBundle(locale);
  const sys = await getTranslations({ locale, namespace: 'sys' });
  // The package has no SEO string for this page, so `pages.workers` carries '' ids and the
  // sys.seo.workers.* fallbacks stand (W23/W38).
  return buildMetadata({
    locale,
    href: '/available-workers',
    bundle,
    pageKey: 'workers',
    fallbackTitle: sys('seo.workers.title'),
    fallbackDescription: sys('seo.workers.description'),
  });
}

/**
 * Available Workers (`design-package/design/Available Workers.dc.html`). Phase A ships the
 * request form, the sticky bar, the vetting steps, the after-you-pick timeline, the FAQ and the
 * closing band; `#pool` is the designed empty state. Everything the design derives from the
 * candidate pool — the "live" badge, the card-presupposing copy (048, 052/053, 107, 210/211),
 * the cards/filters/basket — renders by data and is absent here: `pool` is a fixture-only
 * collection LOCAL can never serve in production (D23), per-profile cards are off (D2), and the
 * stats strip waits for a signed source (W6). No `<main>` — the `(site)` layout owns it (R31).
 */
export default async function AvailableWorkersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [bundle, sys] = await Promise.all([getBundle(locale), getTranslations('sys')]);
  const tf = makeTf(bundle, locale); // W1/D17: re-authored ids carry {metric} tokens
  const metrics = metricValues(bundle, locale);
  const s = bundle.settings;
  const live = poolSigned(bundle); // pool rows are served (never under LOCAL in production)
  const cardsOn = cardsVisible(bundle); // rows AND the D2 switch — false in this task
  const heroIsLcp = HERO_SRC !== null;
  // The page's one WhatsApp prefill (availworkers.224) on every hire-intent door; the design's
  // seven hard-coded English texts are not ported, and nothing typed ever rides here (W95).
  const waHire = waLink(s.whatsappNumber, tf('availworkers.224'));
  const startWhenOptions = START_WHEN_KEYS.map((key) => ({
    value: key,
    label: sys(`form.options.startWhen.${key}`),
  }));

  return (
    <>
      {/* 2–3 — the hero and the request card (design 474–578) */}
      <Section tone="dark" className="relative overflow-hidden">
        {/* D26/W129: the named hero slot. ImageSlot owns its 16:9 box, so the cover crop is this
            wrapper's job (height-led, at least full width, centred, clipped by the section).
            While HERO_SRC is null it is a decorative placeholder and the h1 is the LCP element. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 aspect-[16/9] h-full min-w-full -translate-x-1/2 -translate-y-1/2">
            <ImageSlot
              slot="aw-hero"
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70"
        />
        <div
          data-testid="workers-hero"
          className="container-site relative grid items-center gap-11 lg:grid-cols-[1fr_0.85fr]"
        >
          <div className="min-w-0">
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4"
              items={[
                { name: tf('availworkers.021'), href: '/' },
                { name: tf('availworkers.022'), href: '/available-workers' },
              ]}
            />
            {live ? (
              <p
                data-testid="pool-live"
                className="mb-4 inline-flex items-center gap-2 rounded-pill border border-success/35 bg-success/10 px-4 py-1.5 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-success-surface"
              >
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
                {tf('availworkers.023')}
              </p>
            ) : null}
            <h1
              data-testid="page-h1"
              data-lcp-slot={heroIsLcp ? undefined : 'h1'}
              className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em]"
            >
              {tf('availworkers.024')} <span className="text-sky">{tf('availworkers.025')}</span>{' '}
              {tf('availworkers.026')}
            </h1>
            <p className="text-body-lg m-0 mb-6 max-w-[520px] text-white/80">
              {tf('availworkers.027')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="#pool">
                {tf('availworkers.028')}
              </Button>
              <ContactCta placement="page_cta" variant="success" size="lg" external href={waHire}>
                <WhatsAppIcon size={16} />
                {tf('availworkers.029')}
              </ContactCta>
            </div>
            <p className="text-body-sm m-0 mt-5 max-w-[480px] text-white/70">
              {tf('availworkers.030')}
            </p>
          </div>

          <div
            id="pool-form"
            className="scroll-mt-20 overflow-hidden rounded-hero border border-white/10 bg-white text-ink shadow-hero-form"
          >
            {/* W79: checkbox consent, the site-wide /privacy link (no consentLinkHref). */}
            <FormShell
              action={submitWorkers}
              formKey="workers"
              locale={locale}
              turnstileSiteKey={s.turnstileSiteKey}
              whatsappNumber={s.whatsappNumber}
              whatsappIntro={tf('availworkers.224')}
              contact={{ phone: s.phone, phoneDisplay: s.phoneDisplay, email: s.email }}
              submitLabel={tf('availworkers.146')}
              consent="checkbox"
              testId="workers-form"
              className="p-6"
            >
              <RequestFormFields
                legend={sys('form.labels.iAm')}
                roles={{
                  direct_employer: {
                    tab: tf('availworkers.141'),
                    // 107 ("Request these candidates") presupposes visible cards (W6).
                    title: cardsOn
                      ? tf('availworkers.107')
                      : sys('workers.form.titles.direct_employer'),
                    subtitle: tf('availworkers.142'),
                    companyLabel: tf('availworkers.143'),
                    tradeLabel: tf('availworkers.144'),
                    messagePlaceholder: tf('availworkers.145'),
                  },
                  hr_agency: {
                    tab: tf('availworkers.147'),
                    title: tf('availworkers.148'),
                    subtitle: tf('availworkers.149'),
                    companyLabel: tf('availworkers.150'),
                    tradeLabel: tf('availworkers.151'),
                    messagePlaceholder: tf('availworkers.152'),
                  },
                }}
                labels={{
                  name: tf('availworkers.044'),
                  email: tf('availworkers.045'),
                  phone: tf('availworkers.046'),
                  city: tf('availworkers.047'),
                }}
                startWhenOptions={startWhenOptions}
              />
            </FormShell>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-3 px-6 py-3 text-body-sm text-text-tertiary">
              <ContactLink
                href={waHire}
                placement="page_cta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-extrabold text-success-text"
              >
                <WhatsAppIcon size={14} />
                {tf('availworkers.041')}
              </ContactLink>
              <span>
                {tf('availworkers.042')}{' '}
                <Link href="/partner-with-us" className="font-extrabold text-blue-safe underline">
                  {tf('availworkers.043')}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* 4 — the sticky desktop bar (design 583–597): the design's three buttons, the contact
          ones tracked by the bar itself (W81). Both messages carry the reply-time metric, so the
          bar is absent while it is unsigned (D17); 048 presupposes a visible profile. */}
      {metrics.homepageReplyHours ? (
        <StickyCtaBar
          live={live}
          message={
            cardsOn
              ? tf('availworkers.048')
              : sys('workers.sticky.message', { hours: metrics.homepageReplyHours })
          }
          ctas={[
            { label: tf('availworkers.049'), href: telLink(s.phone), variant: 'secondary' },
            { label: tf('availworkers.050'), href: waHire, variant: 'success', external: true },
            { label: tf('availworkers.051'), href: '#pool-form' },
          ]}
          hideNearId="pool-cta"
        />
      ) : null}

      {/* 5–8 — the pool (design 598–769): the header CTA and "Browse candidates" land on #pool
          (W17). Phase A renders the designed empty state; the v1.1 cards task renders the grid
          in its place. No stats strip until a signed source exists (W1/W6). */}
      <Section tone="light" id="pool" className="scroll-mt-20">
        <div data-testid="workers-pool" className="container-site">
          <div className="mb-6 max-w-[560px]">
            <h2 className="text-h2 m-0 mb-3">
              {cardsOn ? tf('availworkers.052') : sys('workers.pool.heading')}
            </h2>
            <p className="text-body m-0 text-text-secondary">
              {cardsOn ? tf('availworkers.053') : sys('workers.pool.intro')}
            </p>
          </div>
          {cardsOn ? null : (
            <EmptyState
              testId="pool-empty"
              tone="pale"
              title={sys('workers.empty.title')}
              body={sys('workers.empty.body')}
              cta={{ label: sys('workers.empty.cta'), href: '#pool-form' }}
            />
          )}
        </div>
      </Section>

      {/* 9 — what "verified" means (design 777–827) */}
      <Section tone="pale">
        <div data-testid="workers-verified" className="container-site">
          <h2 className="text-h2 m-0 mb-3 text-center">{tf('availworkers.072')}</h2>
          <p className="text-body mx-auto mt-0 mb-10 max-w-[580px] text-center text-text-secondary">
            {tf('availworkers.073')}
          </p>
          <div className="mx-auto max-w-[760px]">
            <ProcessSteps
              id="verified-steps"
              bundle={bundle}
              locale={locale}
              variant="cards"
              steps={verifiedSteps(tf)}
            />
          </div>
          <p className="text-body-sm mx-auto mt-7 mb-0 max-w-[640px] rounded-sm border border-border-2 bg-white px-5 py-3 text-center text-text-secondary">
            {tf('availworkers.083')} <strong className="text-ink">{tf('availworkers.084')}</strong>
          </p>
        </div>
      </Section>

      {/* 10 — after you pick (design 829–875) */}
      <Section tone="light">
        <div
          data-testid="workers-after"
          className="container-site grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
        >
          <div className="min-w-0">
            <Eyebrow>{tf('availworkers.085')}</Eyebrow>
            <h2 className="text-h2 mt-3 mb-3">{tf('availworkers.086')}</h2>
            <p className="text-body m-0 mb-6 text-text-secondary">{tf('availworkers.087')}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" href="/work-permit">
                {tf('availworkers.088')}
              </Button>
              <Button variant="primary" href="/hire-workers">
                {tf('availworkers.089')}
              </Button>
            </div>
          </div>
          <div className="min-w-0 rounded-lg border border-tint-border bg-white p-6 shadow-[0_20px_50px_rgba(22,60,90,0.10)] lg:p-8">
            <ProcessSteps
              bundle={bundle}
              locale={locale}
              variant="plain"
              steps={afterSteps(tf, {
                days1to3: sys('workers.timeline.days1to3'),
                arrival: metrics.firstDayWeeks
                  ? sys('workers.timeline.arrival', { weeks: metrics.firstDayWeeks })
                  : undefined,
              })}
            />
          </div>
        </div>
      </Section>

      {/* 11 — FAQ (design 877–912): side column + ask card (WhatsApp + e-mail, W83) + the
          accordion; the one FAQPage node is FaqBlock's */}
      <Section tone="pale">
        <div data-testid="workers-faq" className="container-site">
          <FaqBlock
            bundle={bundle}
            locale={locale}
            id="faq"
            eyebrowId="availworkers.100"
            headingId="availworkers.101"
            bodyId="availworkers.102"
            items={workersFaqItems(bundle, locale, cardsOn)}
            openFirst
            askCard={{
              titleId: 'availworkers.103',
              bodyId: 'availworkers.104',
              whatsappNumber: s.whatsappNumber,
              whatsappText: tf('availworkers.224'),
              whatsappLabelId: 'availworkers.050',
              email: s.email,
              emailLabelId: 'availworkers.045',
              subject: sys('workers.ask.emailSubject'),
            }}
          />
        </div>
      </Section>

      {/* 12 — the closing band (design 915–928) and the licence line with its tracked mailto */}
      <Section tone="band">
        <div data-testid="workers-closing" className="container-site">
          <ClosingCtaBand
            id="pool-cta"
            bundle={bundle}
            locale={locale}
            tone="gradient"
            titleId="availworkers.105"
            bodyId="availworkers.106"
            primary={{
              label: tf('availworkers.108'),
              href: waHire,
              external: true,
              variant: 'success',
            }}
            secondary={{
              label: tf('availworkers.109'),
              href: { pathname: '/hire-workers', hash: '#request-form' },
            }}
          />
          <p className="text-body-sm m-0 mt-6 text-center text-text-tertiary">
            {tf('availworkers.110')}{' '}
            <ContactLink
              href={mailLink(s.email)}
              placement="page_cta"
              className="font-bold text-blue-safe underline"
            >
              {s.email}
            </ContactLink>
          </p>
        </div>
      </Section>
    </>
  );
}
```

Notes for the implementer:
- Every package id goes through `tf` (`makeTf`), never `makeT`: `106`, `142`, `220` (and `048` once cards are visible) carry `{metric}` tokens, and `fill` throws in dev on an unfilled one — the desired failure.
- The h1's three fragments (`024`/`025`/`026`), `042` + `043` and `083` + `084` are the package's own splits; nothing else is composed from fragments (W23).
- `Button href="#pool"`, the sticky `#pool-form` CTA and the empty state's `#pool-form` render plain same-page anchors; `Button href="/work-permit"`/`"/hire-workers"` render the typed next-intl `Link`; the closing band's object href renders `/isci-talebi#request-form` under `tr` (W82).
- `hideNearId="pool-cta"`, not the form: the design hides its bar near `#pool-cta`, and `isBarVisible` hides a bar for good once its target nears or passes — naming the form (above the 700 px threshold) would never show the bar.
- In-text links (`043`, the licence e-mail) are underlined: a colour alone is not enough next to `text-text-tertiary` copy (axe `link-in-text-block`).
- No `revalidate` export: the page mounts no D17 dated badge (W150).

`docs/SEO.md` — in the `## Pages` table T1 created (columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`), append after its last row:

```markdown
| Available Workers | `/adaylar` · `/en/available-workers` | `sys.seo.workers.{title,description}` — the page record `workers` carries `''` ids (the package has no SEO string for this page; W23/W38); OG image `/og/{locale}/workers.png` (CDN-cached, W123) | `absoluteUrl(locale, '/available-workers')` | site-wide `Organization`/`EmploymentAgency` + `WebSite` (locale layout — the design's client-injected `EmploymentAgency` block is not repeated); `BreadcrumbList` from `Breadcrumbs` (`availworkers.021` → `022`, W109); `FAQPage` from `FaqBlock` (7 pairs in Phase A, 8 once cards are visible; AEO only) | `h1` (`data-lcp-slot="h1"`) while `aw-hero` is a placeholder (§10 row 4 gradient default); `HERO_SRC` (`_lib/assets.ts`) moves the slot onto a photo | placeholder `aw-hero`; filtered pool views (v1.1) canonicalise to this page (PRD §4); no `revalidate` (no dated badge, W150); not a D27 pixel page (Fable side-by-side review) |
```

`docs/ANALYTICS.md` — under `### Page instrumentation (WP2b)`, append after the last bullet:

```markdown
- **Available Workers (`/adaylar`, `/en/available-workers`, T8):** no page-specific event. `whatsapp_click` (`page_cta`) from the hero "Ask for profiles", the form footer "Prefer WhatsApp?", the sticky bar (≥ 901 px), the FAQ ask card and the closing band — every one `wa.me/<n>?text=` with the catalogued `availworkers.224` prefill only (W95); `call_click` (`page_cta`) from the sticky bar's Call; `email_click` (`page_cta`) from the ask card's e-mail row (W83) and the licence line. The request form's fallback panel fires the contact events with `placement: 'form_fallback'`; `generate_lead`/`conversion` for `form_key: 'workers'` come from `ConversionPing` on `/tesekkurler?form=workers`. The role chips fire nothing (no event exists for them). The design's `pool_filter` / `pool_sort` / `pool_load_more` / `pool_popular_pick` / `pool_form_role` / `pool_form_submit` / `profile_select` / `profile_unselect` are not ported: the cards are off (D2), and their `profiles` / `ref` / `trade` / `country` parameters are candidate identifiers or typed text the allowlist forbids (D13) — a new event is a ruling (W26).
```

`docs/PRD.md` — two in-place edits (W45):
1. §2, the table row whose second cell is `Available Workers`: replace its last cell (`Aggregate stats section (no per-profile cards at launch, D2) + request form (\`INQUIRY\`)`) with `Request form (\`INQUIRY\`, key \`workers\`: role chips → \`iAm\`; the typed roles-and-volume field → \`trade\` (W77); \`city\` required on the page (catalog v1.1); \`country: 'TR'\`; optional \`headcount\`, \`startWhen\` (shared keys, W78), \`message\` — basket references fold into it with the v1.1 cards) + sticky bar, vetting steps, after-you-pick timeline, FAQ. The \`#pool\` section is the designed empty state; the aggregate stats and per-profile cards stay hidden until a signed source exists (W6, D2); the pool fixture is never served in production (D23)`.
2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**" (`grep -n 'Not yet built' docs/PRD.md`): in whatever wording T1–T7 and T13 left it, count Available Workers as built — decrement the "N of the 14 core pages" figure by one and add "Available Workers (WP2b T8)" to the list of designed pages that sentence names — keeping the rest of the sentence as it stands (W45: edit in place, never re-add WP1 wording).

- [ ] **Step 4: Verify**

```bash
npx prettier --write "src/app/[locale]/(site)/available-workers" e2e/pages/workers.spec.ts e2e/routes.ts src/lib/seo/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

Expected: green — `unbuilt.test.ts` agrees again (key deleted ↔ `page.tsx` exists); `ids.test.ts` finds every id in the catalogue and both bundles; `gate-routes.test.ts` sees the two new rows (EN/TR parity); `sitemap.test.ts`/`robots.test.ts`/`routes.test.ts` derive from the set and stay green; `class-collisions.test.ts` scans `page.tsx` (no caller colour class on `Button`/`ContactCta`, no same-property pair); `client-imports.test.ts` check (a) sees by-path imports only; typecheck and lint cover `e2e/pages/workers.spec.ts`. The page itself has no unit test — it composes the tested pieces and is proven by Cycle 5's build and gate.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(site)/available-workers/page.tsx" "src/app/[locale]/(site)/available-workers/_lib/assets.ts" "src/app/[locale]/(site)/available-workers/__tests__/ids.test.ts" e2e/pages/workers.spec.ts e2e/routes.ts src/lib/seo/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md
git commit -m "feat(workers): the Available Workers page — hero and request card, sticky bar, #pool empty state, vetting steps, after-you-pick, FAQ, closing band; page e2e; docs (T8 c4)

/available-workers leaves UNBUILT_PATHNAMES (W20); both locale paths join GATE_ROUTE_TABLE
(W21); id=\"pool\" for the W17 header CTA (W152/W158); the h1 is the LCP element while
aw-hero is a placeholder (D26); pool-derived copy renders by data (W6/D2/D23); the bar keeps
the design's Call/WhatsApp (W81); the e2e is deterministic without a door (W92). Docs: SEO
page row, ANALYTICS bullet, PRD forms row + §11.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — the W126 proof session: one build, one start, the gate, js-size, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome.

- [ ] **Step 1: Pre-flight — no new test (Cycle 4's page spec and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
grep -n "adaylar\|/en/available-workers" e2e/routes.ts   # 2 hits, both `indexable: true` (W21)
grep -n "'/available-workers'" src/lib/seo/routes.ts      # no hit (the UNBUILT key is gone, W20)
grep -n "hash: '#pool'" src/design/chrome/ctas.ts         # the CTA_BY_PATHNAME['/available-workers'] primary — untouched (W17/W121)
ls -a | grep '^\.env'                                     # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'door-less, GTM-dark'
git status --short                                        # clean: Cycles 1–4 are committed
```
Expected: exactly as annotated. A door variable or an `.env.local` must be removed from this shell/worktree before building — the page spec must meet the door-less face (W92) and a GTM id would put third-party script into the measured budget (W146). If a route fact differs, WP2a or an earlier page task drifted: stop and report; never "fix" the route list or the CTA table from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
rm -rf .next .lighthouseci lighthouse-report test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/workers-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/adaylar && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds — the first time the RSC boundaries of `page.tsx` → `FormShell`/`RequestFormFields`/`RadioChips`/`Field`/`StickyCtaBar`/`ContactLink`/`Accordion` and the `submitWorkers` server action are compiled (jsdom could not see them); the route table lists `/[locale]/available-workers` as prerendered for both locales (no `headers()`/`cookies()` in the page — only the server action reads the request, at submit time); `up` is printed. A build error is fixed in the source, verified with the Step 4 line of the cycle that owns the file, committed, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, the launch anchor check**

```bash
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/workers-gate-launch.log" 2>&1 || true
grep -n 'missing id="pool"' "$TMPDIR/workers-gate-launch.log" || echo 'no missing #pool anchor'
grep -nE '^(/adaylar|/en/available-workers)(#[^ ]*)? → ' "$TMPDIR/workers-gate-launch.log" || echo 'the workers routes are no dead target'
```
Expected:
- **Gate** (localhost wears the production face → `lighthouserc.local.json`, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/workers.spec.ts` 19 passed + 1 skipped (the sticky-bar case skips on `mobile` by design; the door-less submit runs because `/api/site-health` reports `unconfigured`), and `routing` (the page contract on `/adaylar`, `/en/available-workers`), `seo` (canonical/hreflang, the sitemap lists both, every sitemap URL 200), `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on both routes under both projects; `region` clean at 390/1000/1440 — the sticky bar and every section sit inside `<main>`), `width-sweep` (no horizontal overflow from 1440 to 390 incl. 1101/1100 and 901/900 — the hero grid stacks below `lg`, the field grid below `sm`), `chrome` (every earlier page's header CTA still lands), `headers`, `thank-you` all green; the two token cases of `ops.spec.ts` skip without `REVALIDATE_SECRET` (as at WP2a). `lhci assert` passes on every indexable gate route; on `/adaylar` and `/en/available-workers` (median of 3 DevTools-throttled runs): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the h1), CLS ≤ 0.1.
- **js-size** (W136 — the ledger's figure): both routes below the 194,560 B lazy line. Projection: the WP2a close measured the shell at 176,132 B (TR) / 172,783 B (EN) locally; this page adds the forms kernel's client graph (`FormShell`, `Field`, `FormField`, `FormErrorsContext`, `FallbackPanel`, the `Turnstile` loader, `guardAction`, `echo`, `errors` — ≈ 7–8 KB), `RadioChips` + `RequestFormFields` (≈ 2 KB) and `StickyCtaBar` with `ContactCta` (≈ 1.5 KB; `ContactLink`, `Button`, `Accordion` already ship with the chrome) → ≈ 186–189 KB (TR) / 183–186 KB (EN) locally, ≈ 3 KB more on a preview. The LCP column should read the h1 at ≈ 1.5–2.0 s.
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (T9–T12's unbuilt routes and anchors), but the first grep prints `no missing #pool anchor` — `scripts/launch/dead-targets.ts` no longer reports `id="pool"` missing on either locale — and the second prints `the workers routes are no dead target` — the dead-href half (`<href> → <status>` lines) no longer lists `/adaylar` or `/en/available-workers`, which the chrome links from every gate route; this page's own outbound targets (`/`, `/ortak-olun`, `/calisma-izni`, `/isci-talebi`, `/gizlilik` and their EN twins) are built by earlier tasks, so none of them is listed either. (The D26 content-readiness table in the same log names `/adaylar` with its `aw-hero` placeholder — expected, not a failure of this page.)
- **Only if a route is above 194,560 B** (not expected — W13 amended): create `src/app/[locale]/(site)/available-workers/_components/LazyStickyBar.tsx` (below), render `<LazyStickyBar …same props… />` as the FIRST child of the `#pool` section's `container-site` div instead of `<StickyCtaBar … />` after the hero (its empty marker then sits about one viewport down; the bar only shows past 700 px of scroll anyway, and Lighthouse never scrolls, so the bar's module leaves the audited load), drop the `StickyCtaBar` import from `page.tsx`, run the verify line, commit (`perf(workers): the sticky bar loads on view — lazy pass (W13 amended, T8 c5)`), then repeat Steps 2–4 once; that second session is the task's proof. If a route is still above the line, stop and report the `js-size` table to the controller — the forms kernel is this page's content and cannot be deferred without a ruling.

```tsx
'use client';
import type { ComponentProps } from 'react';
import type { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { LazyIsland } from '@/design/islands/LazyIsland';

type StickyBarProps = ComponentProps<typeof StickyCtaBar>;

/** W13 amended — the conditional lazy pass: the sticky bar's module loads when this marker nears
 *  the viewport instead of in the first-load graph. `load` must live in a client module — a
 *  function prop cannot cross from the server page — and `LazyIsland` has no `ssr` prop (W132);
 *  islands are imported by path, never the barrel (W134). */
export function LazyStickyBar(props: StickyBarProps) {
  return (
    <LazyIsland<StickyBarProps>
      load={() =>
        import('@/design/chrome/StickyCtaBar').then((m) => ({ default: m.StickyCtaBar }))
      }
      props={props}
      fallback={null}
    />
  );
}
```

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID). `.lighthouseci/` and `lighthouse-report/` hold no secret on a localhost run, but are never committed.

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T8 row to the `## Ledger` table in T1's row format (W98), filled from this session (the "**Ledger line**" template at the end of this task — every `<…>` from Steps 3–4; none typed from memory):
- routes `/adaylar` · `/en/available-workers`; js-size per route; whether the lazy pass ran; the Lighthouse medians (perf / a11y / BP / SEO / LCP of the h1 / CLS) per route;
- pixel: not a D27 page — "Fable side-by-side review" and the named deltas 1–15 at the top of this task;
- WP-C sheet: `availworkers.039`/`040` (the KVKK sentence the kernel consent replaces, W79); `wp.350` and `hire.302` (legal-flagged answers reused in this page's context); `106`, `212`/`213`, `222` (presuppose visible profiles, rendered as authored); `145` (its "city … start date" prompt overlaps the dedicated fields); the TR h1 word order of the `024`/`025`/`026` split; the package's first-person lines (`027`, `077`, `084`, `087`, `097`, `104`, `108`, `149`, `213`, `215`, `217`, `wp.350`, `hire.302` — W154 note: package copy waits for WP-C); the reply-time pair `142` (`{replySlaHours}` working hours) vs `106` (`{homepageReplyHours}` hours) on one page (§10 row 2);
- launch anchor sweep: `#pool` present in both locales (W152/W158).

```bash
npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md
npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(workers): T8 ledger row — gate, js-size, Lighthouse medians, launch anchor sweep (T8 c5)

Localhost proof session (W126/W145): one build, one gate, both workers routes under the
194,560 B lazy line; #pool present for CTA_BY_PATHNAME['/available-workers'] in both locales
(W152/W158); not a D27 pixel page — named deltas for the Fable review.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/CONTENT-MODEL.md` — the Available Workers bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (Cycle 1, with the keys, the package labels and the unrendered card-only ids). `docs/SEO.md` — the Available Workers row of T1's `## Pages` table, naming the LCP element (the h1 while `aw-hero` is a placeholder) and the placeholder (Cycle 4). `docs/ANALYTICS.md` — the Available Workers bullet under `### Page instrumentation (WP2b)` (Cycle 4; no new event, parameter or enum value; the unported `pool_*`/`profile_*` events and why). `docs/PRD.md` — §2 row 10's "Forms carried" cell and the §11 "Not yet built" page count, edited in place (Cycle 4, W45). `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T8 `## Ledger` row (Cycle 5). No `docs/ARCHITECTURE.md` change (no new pattern — the forms flow, `StickyCtaBar` and the scroll padding are documented by WP2a/T5) and no `docs/INTEGRATIONS.md` change: every field sent is in the catalog v1.0 + v1.1 (`workers.city` live), and T14 writes the I4 instance map from **Interfaces → Produces**.

**Sys keys added:** 12 keys, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `__tests__/sys-keys.test.ts`:
`sys.seo.workers.title`, `sys.seo.workers.description`, `sys.workers.pool.heading`, `sys.workers.pool.intro`, `sys.workers.empty.title`, `sys.workers.empty.body`, `sys.workers.empty.cta`, `sys.workers.sticky.message` (ICU `{hours}`), `sys.workers.form.titles.direct_employer`, `sys.workers.timeline.days1to3`, `sys.workers.timeline.arrival` (ICU `{weeks}`), `sys.workers.ask.emailSubject`. Consumed, not added: `sys.form.labels.{iAm,headcount,startWhen,message}`, `sys.form.options.startWhen.{asap,month1,months1to3,planning}` (W78), `sys.form.placeholders.*`, `sys.form.hints.{optional,phone}`, `sys.form.errors.*`, `sys.form.consent.label`, `sys.form.fallback.*`, `sys.nav.breadcrumbs`, `sys.thankYou.forms.workers`.

**Package ids used:** 91 ids — 89 `availworkers.*` + `hire.302` + `wp.350` — every one verified present in `src/content/local/catalogue.json` and in both generated bundles at `bc708a3` (and pinned by `__tests__/ids.test.ts`); first `availworkers.021`, last `wp.350`: `availworkers.021`–`030` (hero; `023` only while pool rows exist), `041`–`053` (form footer and labels `041`–`047`, sticky bar `048`–`051` with `048` only while cards are visible, pool head `052`/`053` only while cards are visible), `072`–`084` (vetting steps; `081` as step 4's pill), `085`–`099` (after-you-pick; `091`/`096` as badges), `100`–`110` (FAQ side column and ask card `100`–`104`, closing band `105`–`110`; `107` only as the employer form head while cards are visible), `141`–`152` (role chips, heads, field texts and prompts), `210`–`224` (FAQ pairs — `210`/`211` only while cards are visible — and the one WhatsApp prefill `224`), `hire.302` (221's answer), `wp.350` (218's answer). Rendered in Phase A: 84. Read through blocks by id: `050`/`045` (the ask card's row labels), `100`–`106` (FaqBlock/ClosingCtaBand); the chrome reads `availworkers.016` + `home.003` for the header CTA (R15, not this page). Not read: `001`–`020` (chrome, R15), `031`–`040` (popular chips, trust chips, collapsed-form labels, inline success, the KVKK sentence — W6/D13/W79), `054`–`071` (sort, stats, filters, card-grid empty state, the "Can't see the profession" card — W6/D2), `111`–`140` (footer chrome and card fields), `153` (HR submit — one static label), `154`–`209`, `225`–`250` (cards, filters, basket).

**CLIENT_SYS additions:** none. The one `'use client'` module of this task (`RequestFormFields`, and `LazyStickyBar` if the conditional lazy pass runs) calls no `useTranslations`: every string arrives resolved from the server page, and `Field`/`FormShell` read `sys.form.*` through the kernel (the `form` namespace is already listed) — `src/i18n/client-messages.ts` stays `consent, languageHint, errorTitle, errorRetry, form` and `client-messages.test.ts` needs no change (W148).

**Foundation gaps:** none blocking; every name this task consumes exists at `bc708a3` and was checked in the code. Notes for the controller:
1. Catalog v1.1 `workers.city` — **confirmed** by WP2a Task 8 as built (Operations `main` `47a2160`, live 11:14 UTC; the DTO spec pins `city` as a string inside `fields`): no gap.
2. Basket references have **no `workers` catalog field** (v1.0 + v1.1): the v1.1 cards task's basket folds them into `message` as its first line (`Profiles: JA-1042, JA-1050`, `composeWorkersMessage`, capped at the door's 5,000) — a structured field would be an Operations catalog change (v1.2).
3. The brief's `sector` has **no `workers` catalog field** either: it is not sent (an unknown key is dropped silently); the employer's sector rides in the typed `message` (the design's own `availworkers.145` prompt), per W77/W78 ("`sector` separately where the catalog has it"). A catalog addition if the sales team wants it structured.
4. No signed source exists for the aggregate strip (no metric key for the pool total; the CRM `website-feed` stats endpoint is unbuilt, SPEC §3.3): the strip is not rendered; `availworkers.055`–`058`/`225` wait for the Phase B stats task.
5. `CollectionSchemas` has no `pool` entry (accepted page-local, reconcile list): `poolRows` reads raw rows for the W6 gates only; the v1.1 cards task adds the schema and switches to `getCollection(bundle, 'pool')`.
6. `FormShell.submitLabel` is one static string (accepted, reconcile list): `availworkers.146` for both roles, `153` unused.

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>` from Cycle 5):

```markdown
| T8 Available Workers | `/adaylar` · `/en/available-workers` | js-size (local): `/adaylar` <n> B · `/en/available-workers` <n> B (ceiling 204,800; lazy line 194,560; projected ≈ 186–189 KB TR / 183–186 KB EN); lazy pass: <no/yes>; binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/adaylar` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; `/en/available-workers` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n> | not a D27 pixel page — Fable side-by-side review; named deltas 1–15 (D13 thank-you navigation, W79 consent tick, W115 labels, W3/W16 headcount/startWhen/message + city v1.1 + country TR, RadioChips roles + one submit label, no collapsed form/basket, W6/D2 empty #pool + no chips/stats/cards, gradient hero with the h1 as LCP + success-face WhatsApp, D20 form head, navy sticky bar → #pool-form, ProcessSteps vetting rail, ProcessSteps after-you-pick card with the signed 6–8 badge, FaqBlock 7 pairs + ask card rows, dark ClosingCtaBand → /hire-workers#request-form, one catalogued WhatsApp prefill); WP-C: availworkers.039/040, wp.350 + hire.302 in context, 106/212/213/222 card-presupposing, 145 prompt overlap, TR h1 word order, package first-person lines, 142 vs 106 reply times; launch sweep: #pool present both locales | <YYYY-MM-DD> |
```
