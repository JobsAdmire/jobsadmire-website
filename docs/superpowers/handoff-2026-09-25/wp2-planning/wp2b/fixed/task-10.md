### Task 10: Verify Representative — `/temsilci-dogrulama` · `/en/verify`

**Why this task exists.** The route is the site's representative check (design-package page 7, `design-package/design/Verify Representative.dc.html`, strings `design-package/strings/verify.json`, ids `verify.001`–`verify.271`). No page exists yet: `/verify` is listed in `UNBUILT_PATHNAMES` and answers 404 through the `[...rest]` catch-all, while the header's CTA on this route already points at `#report` (the design's red "Report an Impostor", W17). The design is a CRM-fed mock: a 19-person in-page register, a search that answers the red "Not on our authorised list" verdict for anything it cannot match, a founder strip with hard-coded claims, a record modal without `role="dialog"`, a `document.write` badge printer, flags from flagcdn.com, and a fraud "report" that is three WhatsApp links. This task ports it onto the WP2a foundation as Phase A demands (D9 v1, W6, §10 rows 3 and 11): the representatives register as a designed EMPTY STATE (no rows exist, and the `representatives` fixture is never served in production — D23, asserted), a client-only lookup island that stores nothing, calls nothing and always answers the NEUTRAL "register not published — verify with the office" result (never "not found = fraud"), the founder strip hidden until the W86 `founder` row is published, the five red flags, a real fraud-report form → form key `fraud` with the reporter fields and up to three evidence files uploaded one server-action call per file (W73/W101/W116), the record `Dialog` scaffold behind a v1.1 flag, and the FAQ with its `FAQPage` node. Every string is a package id through `makeT`/`makeTf` or a `sys.verify.*` / `sys.form.evidence.*` key; every contact anchor fires its click event with a placement (W12); nothing a visitor types ever reaches a DOM href or an analytics event (W76/W95, D13).

**Where and in what order.** Every path is in the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` — never the shared checkout `…/jobsadmire-website` (it is on `main`). Never push, never `git stash`, never amend/squash/rebase an existing commit (W118). Execution order (W99): T1 → T13 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → **T10** → T11 …: when this task starts, T1 has created the shared doc shapes (W98: the `## Pages` table in `docs/SEO.md`, `### Page instrumentation (WP2b)` in `docs/ANALYTICS.md`, the per-page `sys.*` bullet list at the end of `### Adding copy (W9, W23, W54)` in `docs/CONTENT-MODEL.md`, the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`) and `e2e/pages/`; T13 has shipped `/privacy` (`/gizlilik` — the consent link target); T5 has shipped `/partner-with-us` (the firewall note's link) and its site-wide `scroll-padding-bottom: var(--sticky-cta-h, 0px)`; T6 reads the same W86 `founder` row this page reads. WP2a is fully built and reviewed; where this text and the code disagree, **the code wins** — every import below was checked against `src/**` at `5562634` (HEAD ≥ `bc708a3`).

**Memory rule (owner, binding for every step).** One heavy job at a time. The per-commit verify is exactly
`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`
(never `npm run verify`, `npm test` or `npm run e2e`; `npm run format` is `prettier --check .`, so run `npx prettier --write <the files you touched>` first). The task ends with ONE proof session (W126, Cycle 6): one `NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build`, one `npm run start`, one `E2E_BASE_URL=http://localhost:3000 npm run gate`, `npm run js-size` and the launch anchor check, then the server is killed and no stray process is left. Playwright runs only inside that session (the page spec is written in Cycle 5 and executes there). This page is not a D27 pixel page (the four are T1, T2, T3, T12) — it gets the Fable side-by-side review, so no `npm run pixel`. Commits are conventional, cite their rulings and end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

**Route facts (verified in the code — read before touching anything).**
- Internal key `/verify` → TR `/temsilci-dogrulama`, EN `/en/verify` (`src/i18n/routing.ts` `pathnames`). Private folders (`_lib`, `_components`, `_sections`, `__tests__`) never become routes (`src/lib/seo/unbuilt.test.ts` skips `_`-prefixed folders).
- Page record (both bundles): `bundle.pages.verify = { titleId: '', descriptionId: '', ogImage: null, canonical: null, robots: 'index', jsonLd: ['breadcrumb', 'faq'] }` → `buildMetadata` takes the page's `sys.seo.verify.{title,description}` (W23/W38; this task adds them). OG image `/og/{locale}/verify.png` — `ogTitle` reads `sys.seo.verify.title`, the subline `sys.seo.ogTagline` (CDN-cached, W123).
- `CTA_BY_PATHNAME['/verify']` (`src/design/chrome/ctas.ts`) = primary `verify.015` + tail `verify.016` (`variant: 'danger'`) → `{ pathname: '/verify', hash: '#report' }` (rendered `href="/temsilci-dogrulama#report"` / `"/en/verify#report"`), secondary `HIRE`. **This page must render `id="report"`** (W17/W152/W158: `gate:launch`'s anchor sweep prints `… → missing id="report" …` until this task lands). No edit to `ctas.ts` (W121).
- `src/lib/seo/routes.ts` `UNBUILT_PATHNAMES` contains `'/verify',` — this task deletes that line in the commit that adds `page.tsx` (W20; `unbuilt.test.ts` fails in either direction otherwise). `e2e/routes.ts` `GATE_ROUTE_TABLE` has no verify row — this task inserts the two locale paths (W21) and nowhere else.
- Settings (LOCAL bundles): `phone '+905011240340'`, `phoneDisplay '+90 501 124 03 40'`, `email 'info@jobsadmire.com'`, `whatsappNumber '905011240340'`, `siteUrl 'https://www.jobsadmire.com'`, `turnstileSiteKey null` (overlaid from `NEXT_PUBLIC_TURNSTILE_SITE_KEY` only where set).
- Collections (LOCAL bundles): `metrics`, `rateConfig`, `calculatorRoles`, `sourceCountries`, `countries`, `offices`, `sectors`, `blog`, `founder` — **no `representatives` key** (`FIXTURE_ONLY_COLLECTIONS = ['pool', 'stories', 'representatives']` in `src/content/config.ts`; `getBundle` runs `assertServableInProduction(bundle, source)`, which throws under `LOCAL` in production — on Vercel previews too — when any of the three carries a row, D23). `founder` (W86) is one row per locale: `{ name: 'Kurucunun Adı' | 'Founder Name' (about.144, the placeholder), titleId: 'about.047', photoSrc: null, published: false }` — every reader renders nothing while it is unpublished.
- Founder claim strings (§10 row 3 auto-default "claim strings unpublished"): `verify.025` (hero lead, desktop), `verify.026` (hero lead, mobile) and `verify.104` (FAQ answer "Who can sign…?") embed the founder's name (legal-flagged). They render only once the `founder` row is published; until then the hero lead is `sys.verify.hero.lead` and the FAQ answer `sys.verify.faq.whoSigns` — both the package claim without the name (listed for the WP-C sheet beside the package strings).
- Operations catalog `fraud` (`P/operations-door-contract-as-built.md`, v1.0; catalog v1.1 adds nothing to `fraud`): `reporterName` ≤120, `reporterEmail` email ≤254, `reporterPhone` phone (≥ 8 digits, ≤40), `description` 20…5000 **REQUIRED**, `suspectName` ≤200, `suspectContact` ≤300, `evidenceKeys` array-of-key (each ≤300, `/^website-fraud\/[A-Za-z0-9._-]+$/`, de-duplicated, max 3 — a 4th is a 400). Every envelope carries `consentVersion`. An unknown key inside `fields` is dropped silently (a 200), so the mapper copies these names exactly. Upload door: `POST ${OPS_API_URL}/api/website/v1/uploads/fraud-evidence` (write token, multipart with ONLY the `file` part, ≤ 8 MB, magic-byte sniffed JPEG/PNG/WEBP/PDF, one file per call) → 201 `{ data: { key | null, mimeType, sizeBytes, dryRun } }`; orphan objects no report references are purged after 7 days.
- The forms kernel as built: `createFormAction({ key, schema, toFields(parsed, data, ctx: { visitor, locale }), consent })` (`src/forms/action.ts`, `server-only`) checks the consent tick itself (`errors.consent = 'consent'`), trims every string, turns repeated FormData keys into arrays, parses the schema (the first Zod issue per field becomes a `sys.form.errors.*` code), posts, redirects `{ pathname: '/thank-you', query: { form: key } }` on a non-`FAILED` 200, and otherwise answers the D11 `error` state with the typed values echoed. `uploadFraudEvidence(file, visitor, opts?)` (`src/forms/uploads.ts`, `server-only`) refuses an empty file or one over `MAX_EVIDENCE_BYTES` (= `MAX_UPLOAD_BYTES` = 3 MiB, W73/W116) with `FormActionError` (field `evidence`, code `file`), throws `FormDoorError({ kind: 'unauthorized' })` when `OPS_API_URL`/`OPS_WEBSITE_WRITE_TOKEN` are unset, maps a door 400 to a `file` refusal and every other non-2xx to the panel kinds, and treats a `null` key (the test token's dry run) as an outage. `visitorOf` (the `{ ip, ua }` reader `createFormAction` uses) is module-private today — this task exports it (one keyword, additive) because the per-file upload action is not a `createFormAction` and must hand the door the same visitor. `next.config.ts` sets `experimental.serverActions.bodySizeLimit: '4mb'`.
- `FormShell` renders `title` → children → honeypot → Turnstile (only with a site key) → consent row → form-level alert → submit → fallback panel; every id derives from `idScope ?? formKey` (`f-fraud-<name>` here); `consentLinkHref` accepts `'/privacy'` only (the default, W79). `FallbackPanel`'s WhatsApp prefill already carries `reporterName`, `reporterEmail`, `reporterPhone` and `description` (`WHATSAPP_FIELDS`), composed at click time (W76). `sys.form.labels.{reporterName,reporterEmail,reporterPhone,suspectName,suspectContact,description,evidence}`, `sys.form.hints.{description,evidence,optional}` and `sys.form.placeholders.{reporterName,reporterEmail,reporterPhone,suspectName,suspectContact,description}` exist in both locales; `sys.thankYou.forms.fraud` exists.
- `CLIENT_SYS` (`src/i18n/client-messages.ts`) = `consent, languageHint, errorTitle, errorRetry, form, calc` (T3 appended `calc`; no other earlier task adds one), pinned two-way by `client-messages.test.ts` (W148). This task's islands read only `sys.form.*` (the evidence island) or receive every string resolved as props — `CLIENT_SYS` is unchanged.
- The design's breakpoints: its `≤ 900 px` rules → this repo's `lg:` (901 px); its `≤ 700 px` rules → `max-md:` / `md:` (701 px, `--breakpoint-md`; D19 — breakpoints are never scaled). The header is `sticky top-0`, so `#check`, `#structure` and `#report` carry `scroll-mt-24`. `.container-site` is unlayered CSS (`max-width`, `margin-inline`, `padding-inline`): never put a `max-w-*`/`mx-*`/`px-*` utility on the same element. `text-muted` (#94a3b8, 2.56:1 on white) is never used for text (W128a) — `text-text-tertiary` instead.

**Design deltas this page carries on purpose (named, so the Fable side-by-side reviewer files them under (a) D20 / (b) design delta / (c) Phase A empty state — D20/D27):**
1. W6: any lookup of ≥ 3 characters answers the neutral "The public register is not published yet" card (`sys.verify.lookup.*`) with "Call the office" and "Ask on WhatsApp"; the red verdict (`verify.048`–`050`, `235`, `236`) and "Report this person" (`verify.052`) are never rendered; the WhatsApp prefill (`verify.228` + the query) is composed on click, the DOM href is the bare chat (W95).
2. W6/W86/§10 row 3: the founder strip is hidden while the `founder` row is unpublished; the founder-naming claims `verify.025`/`026`/`104` render only once it is published — until then `sys.verify.hero.lead` / `sys.verify.faq.whoSigns` (name-less).
3. W6/D23/§10 row 11: the register is the designed `EmptyState` (`sys.verify.empty.*`, "Call the office"); the stats strip, register list, "last updated" line, live pill and former strip render only from v1.1 `representatives` rows (none in Phase A; production refuses the fixture). The intro sub-line `verify.056` ("Anyone not on this page does not act for JobsAdmire…") renders only with rows — above an empty register it would call every genuine employee an impostor (W6: never "not found = fraud"). The design's sidebar filter, country groups with flags, head-of-desk cards and the CRM feed-status badge (`verify.219`–`222`, `266`) are v1.1 register UI, not ported.
4. W3/W101/W115/W79: the report box's three "send us" items become the form's first three fields (`verify.094`–`096` as labels); the form adds reporter name and e-mail (required on the site, stricter than the door — V-2), phone (optional) and up to three evidence files (one server action per file), a consent checkbox and the submit `sys.verify.report.submit`; success navigates to `/tesekkurler?form=fraud` (D13); "Report on WhatsApp" (company prefill `verify.229`) and "Call the office" stay below the form as co-primary doors (D11).
5. V-1: a record deep link is `?id=<JA-…>` on this route (`?rep=` and `#id=` accepted as the design's aliases); the island reads it after hydration and prefills the lookup; no `/verify/[id]` route; canonical stays bare.
6. V-3: the mobile "Show 2 more red flags" fold (`verify.230`/`231`) is not ported — the design's CSS hid one flag while promising two; all five render at every width.
7. V-4: the FAQ renders at every width (the design shows it ≤ 700 px only while always emitting its JSON-LD twin); one source for DOM and `FAQPage` (`verify.101`–`108`), never the design's differently-worded JSON-LD.
8. V-5: the design's sticky mini search bar (a second, unlabelled input after 620 px) becomes `StickyCtaBar` with "Check an ID" (`#check`) and "Report" (`#report`), from `lg` (the chrome's bottom bar owns phones).
9. V-6: "Print badge" (`verify.120`, a `document.write` popup with unescaped record fields) is not ported — badge printing belongs to Operations with the v1.1 stable id; the record dialog scaffold keeps "Copy record link" and "Something is wrong →".
10. D20: the steps' ≤ 700 px fold is a real disclosure button (`aria-expanded`/`aria-controls`) instead of a clickable `div`; step 2's number badge is `blue-safe` (white on `#1899d5` is 3.2:1); the design's `#94a3b8` greys are `text-text-tertiary`; the red eyebrow, flags and report button are the `danger` token (`#b91c1c`, design `#dc2626`).
11. D20: the lookup input is labelled (`verify.032` ↔ the input) and described by a hint (`sys.verify.lookup.hint`, "at least 3 characters"); no example-ID placeholder (the design's `JA-REP-014` could be a real person's ID); the result title is announced once through an sr-only status line, not on every keystroke.
12. D13/W12: the design's `rep_verify_deeplink`/`rep_verify_open`/`rep_badge_print`/`rep_record_link_copied` pushes (with `rep_id` and a stray `since`) are not ported; the page fires `verify_lookup { page, locale, outcome: 'register_unavailable' }` and the contact events only.
13. W13: the hero's moving dashed rule, the founder ring spin and the scroll reveals are dropped; the dashed rules are static gradients.
14. The report section drops the decorative "02" beside `verify.077` (not a string id) and the red-tinted page gradient (plain white); the flags card and the report box align to the top (`items-start`) because the box now holds the form.
15. The record dialog is a v1.1 scaffold behind `RECORD_DIALOG_ENABLED = false` (a lazy chunk, never fetched in Phase A): real `Dialog` (focus trap, Escape, restore), a status header that can never default to Authorised (enum, fail closed), no QR yet (v1.1: the record handler renders it with `qrSvg`).
16. W109: the crumbs are this page's own `verify.021` ("Home") → `/`, `verify.006` → this page.

**Files:**

Create
- `src/app/[locale]/(site)/verify/page.tsx` — the route (server component; metadata, the four sections, the sticky bar)
- `src/app/[locale]/(site)/verify/actions.ts` — `'use server'`: `submitFraud`, `uploadEvidence`
- `src/app/[locale]/(site)/verify/__tests__/actions.test.ts`
- `src/app/[locale]/(site)/verify/_lib/register.ts` — the v1.1 `representatives` row schema, `readRegister` (fail closed)
- `src/app/[locale]/(site)/verify/_lib/lookup.ts` — query normalisation, the deep-link reader, the `{query}` template split
- `src/app/[locale]/(site)/verify/_lib/fraud.ts` — the Zod schema and the catalog mapper
- `src/app/[locale]/(site)/verify/_lib/evidence.ts` — client-safe evidence constants, the pre-check, the upload result type
- `src/app/[locale]/(site)/verify/_lib/flags.ts` — `RECORD_DIALOG_ENABLED`
- `src/app/[locale]/(site)/verify/_lib/__tests__/bundles.ts` — test helper: the committed LOCAL bundles, parsed (not a test file)
- `src/app/[locale]/(site)/verify/_lib/__tests__/fixtures.ts` — test helper: v1.1 register rows and a published founder row (not a test file)
- `src/app/[locale]/(site)/verify/_lib/__tests__/register.test.ts`, `lookup.test.ts`, `fraud.test.ts`, `evidence.test.ts`, `copy.test.ts`, `ids.test.ts`
- `src/app/[locale]/(site)/verify/_components/icons.tsx` — two page glyphs (no directive)
- `src/app/[locale]/(site)/verify/_components/LookupCard.tsx` (`'use client'`)
- `src/app/[locale]/(site)/verify/_components/StepsDisclosure.tsx` (`'use client'`)
- `src/app/[locale]/(site)/verify/_components/EvidenceUpload.tsx` (`'use client'`)
- `src/app/[locale]/(site)/verify/_components/RecordDialog.tsx` (`'use client'`, default export — `next/dynamic` target)
- `src/app/[locale]/(site)/verify/_components/__tests__/LookupCard.test.tsx`, `EvidenceUpload.test.tsx`, `RecordDialog.test.tsx`, `StepsDisclosure.test.tsx`
- `src/app/[locale]/(site)/verify/_sections/Hero.tsx`, `Structure.tsx`, `Report.tsx`, `FraudForm.tsx`, `Faq.tsx` (server components, synchronous — testable in jsdom)
- `src/app/[locale]/(site)/verify/_sections/__tests__/sections.test.tsx`
- `e2e/pages/verify.spec.ts`

Modify
- `src/messages/tr.json`, `src/messages/en.json` — `sys.seo.verify` (2 leaves, inside the existing `sys.seo` object), a new `sys.verify` object (11 leaves) and a new `sys.form.evidence` object (9 leaves, inside the existing `sys.form` object) — identical key sets
- `src/forms/action.ts` — the declaration `function visitorOf(h: Awaited<ReturnType<typeof headers>>): PostFormVisitor {` gains `export` (nothing else changes)
- `src/lib/seo/routes.ts` — `UNBUILT_PATHNAMES`: delete the line `'/verify',` (nothing else)
- `e2e/routes.ts` — `GATE_ROUTE_TABLE`: two rows inserted immediately before the line `// The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`
- `docs/CONTENT-MODEL.md` — one bullet appended to the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (W98); one sentence appended to the `## Collections` paragraph that begins "**Phase A (T0b).**"
- `docs/SEO.md` — one row appended to T1's `## Pages` table (W98)
- `docs/ANALYTICS.md` — the `verify_lookup` row's "Fires on" cell in `## Event schema`, and one bullet appended under `### Page instrumentation (WP2b)` (W98)
- `docs/ARCHITECTURE.md` — § Routing: one paragraph (the V-1 record deep link) inserted directly before the paragraph that begins "**The 404 response is Next's own `__next_error__` shell until hydration (W151).**"; § Forms flow: one sentence appended to the bullet that begins "- **Uploads (W29, `src/forms/uploads.ts`):**"
- `docs/PRD.md` — §2, the table row whose page cell is `Verify Representative` (its last cell), and the §11 sentence beginning "**Not yet built, by design (WP2 and later):**", edited in place (W45) — its "4 of the 14 core pages" becomes "3 of the 14 core pages", anchored on T9's post-edit text with a stop-and-report guard (W176)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T10 row of the `## Ledger` table (Cycle 6)

Test
- the Vitest files listed under Create (`_lib/__tests__/*.test.ts`, `_components/__tests__/*.test.tsx`, `_sections/__tests__/sections.test.tsx`, `__tests__/actions.test.ts`)
- `e2e/pages/verify.spec.ts` (runs inside the Cycle 6 gate)
- existing guards this task must keep green: `src/lib/seo/unbuilt.test.ts`, `src/messages/messages.test.ts`, `src/messages/voice.test.ts`, `src/i18n/client-messages.test.ts`, `src/design/__tests__/class-collisions.test.ts`, `src/design/__tests__/client-imports.test.ts`, `src/design/blocks/__tests__/rsc-imports.test.ts`, `src/forms/__tests__/action.test.ts`, `scripts/gate-routes.test.ts`

**Interfaces:**

Consumes (exact names, verified in the code; import paths as written — never a barrel, W134/W147/W156, type-only imports included):
- Content: `getBundle`, `makeT` from `@/content/adapter` (`server-only`; `export * from './pure'`) in `page.tsx`; `makeT`, `makeTf` from `@/content/pure` (the sections — synchronous and testable); `getCollection`, `type Founder` from `@/content/collections` (`getCollection(bundle, 'founder')` → `{ name: string; titleId: string; photoSrc: string | null; published: boolean }[]`); `assertServableInProduction` from `@/content/pure` (tests — `(bundle, source: 'LOCAL' | 'OPS', env = process.env.NODE_ENV)`); `BundleSchema`, `type Bundle` from `contract/website-bundle.v1` (relative: six levels up from `_lib/`, `_sections/`, `_components/`; seven from their `__tests__/`) — `bundle.collections` is `Record<string, Record<string, unknown>[]>`, so `bundle.collections.representatives` is read raw and parsed page-locally (reconcile: "representatives schemas page-local (T10)" accepted for Phase A).
- Forms kernel: `createFormAction`, `visitorOf` (exported by this task), `FormActionError`, `FormDoorError`, `type FormActionState` from `@/forms/action` (`actions.ts`); `FormActionError`, `FormDoorError`, `IDLE_FORM_STATE`, `type FormActionState` from `@/forms/types` (the tests and `FraudForm` — the classes and the type are defined there and re-exported by `@/forms/action`, so `instanceof` holds across both paths); `isFile`, `uploadFraudEvidence`, `MAX_EVIDENCE_BYTES`, `MAX_EVIDENCE_FILES` from `@/forms/uploads` (`server-only` — the actions and tests only, never a client module); `type WireFields` from `@/forms/wire` (`buildEnvelope` drops `''` and empty arrays); `CONSENT_VERSION` from `@/forms/consent` (tests); `FormShell` from `@/forms/client/FormShell` — props used: `action, formKey, locale, turnstileSiteKey, whatsappNumber, whatsappIntro, contact, submitLabel, headingLevel, testId, className` (no `consent` — `'checkbox'` is the default, W79; no `consentLinkHref` — `'/privacy'` is the default; no `idScope` — one fraud form); `Field` from `@/forms/client/Field` — props used: `name, label, required, as, rows, type, autoComplete, inputMode, minLength, maxLength` (default id `f-fraud-<name>`; `label` falls back to `sys.form.labels.<name>`, `placeholder` to `sys.form.placeholders.<name>`, `hint` to `sys.form.hints.<name>` / `hints.optional` for a non-required field); `useFieldError`, `useFieldId`, `useRegisterField` from `@/forms/client/FormErrorsContext`; the D11 `FallbackPanel` (`data-testid="form-fallback"`, `data-kind`, bare `https://wa.me/<n>` anchor, click-time prefill — W76).
- Primitives/blocks/chrome by path: `Button`, `buttonClassName` from `@/design/primitives/Button` (variants `primary | secondary | ghost | danger | inverse | success | inverse-dark | nav`; a `#…` href renders a plain same-tab `<a>`); `Section` from `@/design/primitives/Section` (`{ tone: 'light' | 'dark' | 'pale' | 'band', id?, className?, children }`); `Eyebrow` from `@/design/primitives/Eyebrow`; `Dialog` from `@/design/primitives/Dialog` (`{ open, onClose, titleId, children, variant? }`); `FormField` from `@/design/primitives/FormField` (`{ id, label, hint?, error?, required?, children: (p) => ReactNode }`); `Breadcrumbs` from `@/design/blocks/Breadcrumbs` (`{ locale, items: { name, href }[], tone? }` — the `BreadcrumbList` node, nav named `sys.nav.breadcrumbs`); `ContactCta` from `@/design/blocks/ContactCta` (`{ placement: 'page_cta' | 'office_card', href, variant?, size?, external?, className?, children }`); `EmptyState` from `@/design/blocks/EmptyState` (`{ title, body?, cta?: { label, href, external? }, tone?, headingLevel?: 2 | 3, testId?, className? }` — `role="status"`, its CTA through `ContactCta` `page_cta`); `FaqBlock`, `type FaqItem` from `@/design/blocks/FaqBlock` (`{ bundle, locale, items: { id, q, a }[], id? = 'faq', eyebrowId?, headingId?, … }` — root carries `id`, emits `FAQPage`); `ImageSlot` from `@/design/blocks/ImageSlot` (owns its box, W129 — sized by a wrapper); `StickyCtaBar` from `@/design/chrome/StickyCtaBar` (`{ message, ctas: { label, href, variant?, external? }[], showAfterPx?, hideNearId?, live? }` — `data-testid="sticky-cta"`, from `lg` only); `CheckIcon` from `@/design/chrome/icons` (`{ size?, className? }`).
- Analytics: `ContactLink` from `@/analytics/ContactLink` (`'use client'`; `Omit<AnchorHTMLAttributes, 'href' | 'onClick' | 'onAuxClick'> & { href, placement, children }`); `useContactClick` from `@/analytics/useContactClick` (client modules only — `(placement) => (kind) => void`); `track` from `@/analytics/track` (`verify_lookup` with `ALLOWED_PARAMS = ['page', 'locale', 'outcome']`, `PARAM_ENUMS.outcome = ['verified', 'not_found', 'register_unavailable']`). No server module imports `@/analytics/useContactClick` (W125).
- i18n/SEO/format/contact: `routing`, `type Locale` from `@/i18n/routing`; `Link` from `@/i18n/navigation`; `buildMetadata` from `@/lib/seo/metadata` (`{ locale, href, bundle, pageKey, fallbackTitle, fallbackDescription }`); `formatDate` from `@/lib/format/date/formatDate` (server only here); `formatInt` from `@/lib/format/money`; `waLink`, `telLink` from `@/lib/contact`; `renderWithIntl` from `@/test/render` and `collisionsInTree` from `@/test/class-collisions` (tests).
- Messages consumed, not added: `sys.form.labels.*`, `sys.form.placeholders.*`, `sys.form.hints.{description,evidence,optional}`, `sys.form.errors.*`, `sys.form.consent.label`, `sys.form.submit.sending`, `sys.form.fallback.*`, `sys.nav.breadcrumbs`, `sys.seo.ogTagline` (via the OG route), `sys.thankYou.forms.fraud` (the thank-you page's).
- Gate tooling: `npm run gate` / `gate:launch` (`scripts/gate.sh`; `scripts/launch/dead-targets.ts` prints `<locale> <path> → missing id="report" (status …)` while the anchor is absent), `npm run js-size`, Playwright projects `mobile` (Pixel 7) and `desktop` (1440×900).

Produces (for T14's I4 instance map, T15's launch sweep and later pages that copy patterns — nothing imports these files across route folders):
- Routes `/temsilci-dogrulama`, `/en/verify` (key `/verify` gone from `UNBUILT_PATHNAMES`), both in `GATE_ROUTE_TABLE` as indexable.
- DOM: `#check` (the lookup card), `#structure` (the register section), `#report` (the fraud section — the header CTA target, W17), `#faq` (FaqBlock's root); section test ids `verify-hero`, `verify-check`, `verify-structure`, `verify-report`, `verify-faq` (on inner `<div>`s where the element is a `Section`, W113); `verify-empty` (the register empty state), `verify-lookup-result` (`data-outcome="register_unavailable"`); one `data-lcp-slot` (the h1); no `data-placeholder` in Phase A (`founder-photo` renders only with a published founder row).
- Form: `form[data-testid="fraud-form"][data-form-key="fraud"]` with inputs named `suspectName`, `suspectContact`, `description`, `reporterName`, `reporterEmail`, `reporterPhone`, the consent checkbox `f-fraud-consent`, an unnamed evidence file input (`f-fraud-evidence`) and one hidden `evidenceKeys` input per uploaded file.
- Wire (T14's I4 rows): `fraud` · `reporterName*`, `reporterEmail*` (required on the site), `reporterPhone?`, `suspectName?`, `suspectContact?`, `description*` (20–5000), `evidenceKeys?` (0–3 keys from `POST /api/website/v1/uploads/fraud-evidence`, one server-action call per file); consent checkbox (W79).
- Kernel: `visitorOf` exported from `src/forms/action.ts` (same signature and behaviour).
- Analytics: `verify_lookup` wired (outcome `register_unavailable` only in Phase A).

**Rulings applied:**
- W1/D17 — no figure is typed into a `sys.verify.*` string (pinned by `copy.test.ts`); the register's counts, live pill and "last updated" date come only from `representatives` rows and render nothing without them (never "today").
- W3/W16/W77 — fraud form → `fraud` with the reporter fields and up to three evidence keys; the site requires `reporterName` + `reporterEmail` (V-2, T14's I4 map agrees — W105); wire names are the catalog's exactly.
- W6 — the neutral lookup result, never the red verdict; the founder strip hidden; the empty-state register; `verify.056` only with rows (a W6 application: "never not-found = fraud").
- W9/W23/W54 — 22 `sys.*` keys for id-less copy (`sys.verify.*`, `sys.seo.verify.*`, `sys.form.evidence.*`); package fragments composed only where the package splits them (`verify.023`+`024`, `038`+`039`+`040`, `042`+`043`+`234`, `045`+`046`+`047`, `074`+`075`, the flags' lead+body pairs, `225` + a date, a count + `224`).
- W166 — the nine `sys.form.evidence.*` strings go through the existing `form` client namespace (≈ 0.6 KB per locale of flight data, accepted for Phase A); the measured figure is recorded in the CONTENT-MODEL sentence this task adds (Cycle 1).
- W10 — the desktop/mobile variants (`verify.001`/`022` badge, `verify.025`/`026` lead) are two spans toggled by CSS (`max-md:hidden` / `md:hidden`).
- W12/W26/W67 — `verify_lookup { page, locale, outcome: 'register_unavailable' }` once per query session; every `tel:`/`wa.me` anchor is a `ContactLink`/`ContactCta` with `page_cta`, or — where the prefill carries the visitor's query — a bare-href `Button` that fires `useContactClick('page_cta')` and composes the URL on click.
- W13 amended/W120/W136/W162 — no heavy island: the page adds the forms kernel (shared), three small islands and a lazy, never-fetched dialog chunk; the ledger's JS figure is `js-size`'s (ceiling 204,800 B; the controller's binding preview line is 194,560 B). The preview's `npm run js-size` runs ≈ 2,836 B above the local build, so this task's own stop-and-report trigger is the LOCAL figure **191,724 B** (W162): no lazy cycle is written in advance, and a crossing stops the proof and reports.
- W17/W121/W152/W158 — no `ctas.ts` edit; the page renders `id="report"` in both locales; Cycle 6 proves the launch anchor sweep no longer lists it.
- W19/R31 — lives in the `(site)` group; no `<main>` (the layout owns it).
- W20/W21 — `'/verify'` leaves `UNBUILT_PATHNAMES` in the commit that adds `page.tsx`; the two locale paths join `GATE_ROUTE_TABLE` and nowhere else.
- W27/W55/D26/W129 — exactly one `data-lcp-slot` (the h1 — the hero has no photograph); the founder photo slot `founder-photo` (W176 — the one slot name every page uses; only with a published row) is an `ImageSlot` sized by a wrapper, never by classes on the slot.
- W29/W73/W101/W116 — evidence: a per-file upload island calls the page's `'use server'` `uploadEvidence` once per file (≤ 3 MiB, checked in the browser before the call and again by `uploadFraudEvidence`), keeps each returned key in a hidden `evidenceKeys` input, holds the submit while an upload is in flight; nothing uploads inside the fraud action's `toFields`.
- W45/W98 — every doc edit anchors on T1's headings/sentences and appends a row/bullet; no line numbers.
- W74/W117 — kernel as built (one 9 s deadline, one connection-level retry for the form post); the upload is one attempt (no retry re-sends bytes).
- W76/W95 — no visitor data in any DOM href: the lookup's WhatsApp link and the dialog's "Something is wrong" link are bare `https://wa.me/<n>` anchors whose prefilled URL is opened on click; the report box's WhatsApp carries only the company-authored `verify.229`.
- W78 — not applicable (the fraud form has no `startWhen`).
- W79 — `consent: 'checkbox'` (the kernel default) in the spec and the shell; no `consentLinkHref`.
- W82 — every CTA href here is a string (`#check`, `#report`, `/partner-with-us`, `tel:`, `wa.me`).
- W86 — the founder strip (and the founder-naming claims) read `getCollection(bundle, 'founder')` and render nothing while it is unpublished.
- W92 — the page e2e is deterministic without `OPS_API_URL`: a valid report ends on the `unauthorized` panel and an evidence pick on "could not be uploaded right now"; the submitting cases skip on a door face (`staging`, production — T14 owns real submissions).
- W99 — T10 runs after T9 and before T11. W109 — the crumbs are `verify.021` → `/` and `verify.006` → this page.
- W105 — T14's I4 map reads `reporterName` and `reporterEmail` as required, as this page requires them.
- W111 — not applicable (no `Field as="select"`).
- W113 — section test ids sit on inner `<div>`s; `Section`'s props stay frozen.
- W115 — the package's field labels `verify.094`–`096` are passed as `label`; the reporter fields and the evidence input have no package label and use `sys.form.labels.*`; e2e selects inputs by the rendered label.
- W118 — no history rewrite, no `wip` commit, no stash.
- W119/W122/W155 — hide ≤ 700 px with `max-md:hidden`, show ≤ 700 px with `md:hidden`; never `hidden` beside an unprefixed display utility; no class string sets one property twice at one variant (checked statically by `class-collisions.test.ts` and on the rendered trees by `sections.test.tsx`); no colour/display/width class reaches `Button`/`ContactCta`/`ImageSlot` (a different face is a variant).
- W123 — the docs call the OG image CDN-cached, never ISR. W124 — not a template record.
- W125/W130/W134/W147/W156/W158 — primitives, blocks, chrome pieces and `formatDate` by module path everywhere (server modules too); `next/dynamic(…, { ssr: false })` appears only inside the `'use client'` `LookupCard` (§6); no client module reaches `@/forms/uploads` (`server-only`), a message catalogue or `formatReadMinutes`.
- W126 — one build + one start + one gate as the proof (Cycle 6).
- W127/W128 — `success` for the lookup's WhatsApp button, `danger` for the report WhatsApp, `inverse` on navy; no green band on this page.
- W131/W132/W133 — not applicable (no Stepper, no `LazyIsland`, no ShareRow).
- W135/W145/W146 — a localhost run wears the production face (`lighthouserc.local.json` = production: DevTools throttling, three runs, median — LCP ≤ 2,500 ms and performance ≥ 0.95 are errors); GTM stays dark.
- W137/W139/W140 — no preview run by the implementer (never push); the controller's binding preview run uses `--settings.extraHeaders`.
- W148 — no `CLIENT_SYS` change: `EvidenceUpload` reads only `sys.form.*` (listed); `LookupCard`, `StepsDisclosure` and `RecordDialog` call no `useTranslations` — every string arrives resolved (the result body as a raw `{query}` template the island splits).
- W150 — no D17 rate badge on this page → no `revalidate` export (SSG like every static page).
- W154 — no `sys.verify.*`/`sys.seo.verify.*`/`sys.form.evidence.*` string speaks as "we"/"biz": the company is "JobsAdmire" / "JobsAdmire ekibi" (`voice.test.ts` scans all of `sys.*`); the package's own first-person lines (`verify.022`, `053`, `075`, `079`, `090`, `092`, `093`, `106`, …) wait for WP-C.
- W157/W160 — security headers come from the middleware; nothing for the page to do. W161 — no `url`-typed field is sent.
- Final-review page rule (§6) — exactly one `Breadcrumbs` and one `FaqBlock` (one `BreadcrumbList`, one `FAQPage`, one landmark label each); the site-wide Organization node is not repeated.
- D6/D9/D11/D13/D19/D20/D23/D26/D27 and R15/R17/R18/R22/R35 — the browser never calls Operations (uploads and the report go through server actions), v1 empty state + v1.1 scaffold, fallback panel, thank-you navigation, unscaled breakpoints, accessibility over pixels, no fixtures in production, named LCP slot, Fable review (not a pixel page), the chrome renders its own canonical ids (`verify.002`–`005`, `007`–`014`, `016`–`019`, `121`–`147`, `233` are never read here), typed internal links, browser facts (the deep link) through `useSyncExternalStore` (`null` on the server), same-tab contact anchors except `wa.me` (`target="_blank"` + `noopener`), `page` from `next/navigation`, no `src/content/local/*` import from `src/**` (tests read the bundles with `readFileSync`).

---

#### Cycle 1 — the pure pieces and every `sys` key: the register schema (fail closed, D23 asserted), the lookup helpers, the fraud schema → catalog names, the evidence constants, the flag; `sys.verify.*`, `sys.seo.verify.*`, `sys.form.evidence.*`

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/_lib/__tests__/bundles.ts` (a helper, not a test file — Vitest collects only `*.test.*`):

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locale } from '@/i18n/routing';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';

const raw = new Map<Locale, Bundle>();

/** The committed LOCAL bundle of one locale, parsed through the contract (R13) — read from disk,
 *  never imported (`src/content/local/*` imports are a D23 lint error inside `src/**`).
 *  `collections` merges over the bundle's own: the v1.1 register rows Phase A does not carry. */
export function localBundle(locale: Locale, collections: Bundle['collections'] = {}): Bundle {
  let bundle = raw.get(locale);
  if (!bundle) {
    const path = join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`);
    bundle = JSON.parse(readFileSync(path, 'utf8')) as Bundle;
    raw.set(locale, bundle);
  }
  return BundleSchema.parse({ ...bundle, collections: { ...bundle.collections, ...collections } });
}
```

`src/app/[locale]/(site)/verify/_lib/__tests__/fixtures.ts` (a helper):

```ts
import type { Founder } from '@/content/collections';
import type { Representative } from '../register';

/** v1.1 register rows — fixture data, no real person (the design's staff-data strings are never
 *  a source: verify.148–197 / 240–258 are sample rows translated as copy). */
export const FOUNDER_REP: Representative = {
  id: 'JA-REP-001',
  name: 'Founder Example',
  role: 'Founder · sole signatory',
  level: 'founder',
  desk: null,
  city: 'Antalya',
  country: 'TR',
  languages: ['tr', 'en'],
  contact: '+905011240340',
  validUntil: null,
  reportsTo: null,
  since: '2022-01',
  status: 'active',
  canSign: true,
  photo: null,
  updatedAt: '2026-07-29T08:00:00.000Z',
};

export const OFFICE_REP: Representative = {
  ...FOUNDER_REP,
  id: 'JA-OPS-004',
  name: 'Office Example',
  role: 'Operations',
  level: 'office',
  desk: 'Operations',
  canSign: false,
  reportsTo: 'JA-REP-001',
  since: '2023-03',
  updatedAt: '2026-06-01T08:00:00.000Z',
};

export const FORMER_REP: Representative = {
  ...FOUNDER_REP,
  id: 'JA-REP-018',
  name: 'Former Example',
  role: 'Coordinator',
  level: 'coordinator',
  city: 'Lahore',
  country: 'PK',
  status: 'former',
  canSign: false,
  since: null,
  updatedAt: '2026-02-14T00:00:00.000Z',
};

/** The W86 `founder` row once §10 row 3 clears — fixture data (the committed row is unpublished). */
export const PUBLISHED_FOUNDER: Founder = {
  name: 'Founder Example',
  titleId: 'about.047',
  photoSrc: null,
  published: true,
};
```

`src/app/[locale]/(site)/verify/_lib/__tests__/register.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { assertServableInProduction } from '@/content/pure';
import { readRegister, RegisterError } from '../register';
import { localBundle } from './bundles';
import { FORMER_REP, FOUNDER_REP, OFFICE_REP } from './fixtures';

const EMPTY = { rows: [], active: [], former: [], founder: null, updatedAt: null };

describe('readRegister — Phase A is the designed empty state (W6, §10 row 11)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: the committed bundle has no representatives key, so the register is empty`, () => {
      const bundle = localBundle(locale);
      expect(bundle.collections).not.toHaveProperty('representatives');
      expect(readRegister(bundle)).toEqual(EMPTY);
    });
  }
});

describe('D23 — the representatives fixture is never served in production', () => {
  it('a LOCAL bundle carrying a row is refused in production; OPS and development serve it', () => {
    const bundle = localBundle('tr', { representatives: [FOUNDER_REP] });
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL/,
    );
    expect(() => assertServableInProduction(bundle, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'development')).not.toThrow();
  });

  it('both committed bundles pass the production guard as they are', () => {
    for (const locale of ['tr', 'en'] as const)
      expect(() =>
        assertServableInProduction(localBundle(locale), 'LOCAL', 'production'),
      ).not.toThrow();
  });
});

describe('readRegister — the v1.1 rows', () => {
  it('parses the rows, splits active/former, finds the signing founder and the latest update', () => {
    const r = readRegister(
      localBundle('en', { representatives: [FOUNDER_REP, OFFICE_REP, FORMER_REP] }),
    );
    expect(r.rows).toHaveLength(3);
    expect(r.active.map((x) => x.id)).toEqual(['JA-REP-001', 'JA-OPS-004']);
    expect(r.former.map((x) => x.id)).toEqual(['JA-REP-018']);
    expect(r.founder?.id).toBe('JA-REP-001');
    expect(r.updatedAt).toBe('2026-07-29T08:00:00.000Z');
  });

  it('fails closed: an unknown status is a schema miss — thrown outside production, dropped in it', () => {
    const bundle = localBundle('en', {
      representatives: [{ ...FOUNDER_REP, status: 'whatever' }],
    });
    expect(() => readRegister(bundle, 'test')).toThrow(RegisterError);
    expect(readRegister(bundle, 'production')).toEqual(EMPTY);
  });

  it('a suspended founder, or one who may not sign, is not the founder', () => {
    const suspended = { ...FOUNDER_REP, status: 'suspended' as const };
    const noSign = { ...FOUNDER_REP, canSign: false };
    expect(readRegister(localBundle('en', { representatives: [suspended] })).founder).toBeNull();
    expect(readRegister(localBundle('en', { representatives: [noSign] })).founder).toBeNull();
  });
});
```

`src/app/[locale]/(site)/verify/_lib/__tests__/lookup.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  DEEP_LINK_MAX,
  LOOKUP_MIN_CHARS,
  normaliseQuery,
  readDeepLinkId,
  splitAtQuery,
} from '../lookup';

describe('normaliseQuery', () => {
  it('trims and collapses whitespace, keeps case (ids are shown as typed)', () => {
    expect(normaliseQuery('  JA-REP-014 ')).toBe('JA-REP-014');
    expect(normaliseQuery('Ayşe   Yılmaz')).toBe('Ayşe Yılmaz');
    expect(normaliseQuery('')).toBe('');
  });

  it('a result needs three characters (the design’s `> 2`)', () => {
    expect(LOOKUP_MIN_CHARS).toBe(3);
  });
});

describe('readDeepLinkId (V-1: ?id= on this route; ?rep= and #id= are the design’s aliases)', () => {
  it('reads ?id=', () => {
    expect(readDeepLinkId('?id=JA-REP-001', '')).toBe('JA-REP-001');
  });

  it('reads ?rep= and #id=', () => {
    expect(readDeepLinkId('?rep=JA-REP-002', '')).toBe('JA-REP-002');
    expect(readDeepLinkId('', '#id=JA-REP-003')).toBe('JA-REP-003');
  });

  it('prefers ?id=, decodes, trims, caps the length and refuses an empty value', () => {
    expect(readDeepLinkId('?rep=B&id=A', '')).toBe('A');
    expect(readDeepLinkId('?id=JA%2DREP%2D004%20', '')).toBe('JA-REP-004');
    expect(readDeepLinkId('?id=', '#id=')).toBeNull();
    expect(readDeepLinkId(`?id=${'x'.repeat(200)}`, '')).toHaveLength(DEEP_LINK_MAX);
    expect(readDeepLinkId('', '')).toBeNull();
  });

  it('never throws on a malformed escape in the hash', () => {
    expect(readDeepLinkId('', '#id=%E0%A4%A')).toBe('%E0%A4%A');
  });
});

describe('splitAtQuery', () => {
  it('splits the raw result template around its one {query}', () => {
    expect(splitAtQuery('“{query}” cannot be checked.')).toEqual({
      before: '“',
      after: '” cannot be checked.',
      hasQuery: true,
    });
  });

  it('a template without the token echoes nothing (never prints the token)', () => {
    expect(splitAtQuery('No token here.')).toEqual({
      before: 'No token here.',
      after: '',
      hasQuery: false,
    });
  });
});
```

`src/app/[locale]/(site)/verify/_lib/__tests__/fraud.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { DESCRIPTION_MIN, fraudFields, fraudSchema } from '../fraud';

const OK = {
  suspectName: '',
  suspectContact: '',
  description: 'A man calling himself a JobsAdmire agent asked me for a 500 USD visa deposit.',
  reporterName: 'Ayşe Yılmaz',
  reporterEmail: 'Ayse@Example.com',
  reporterPhone: '',
};

const codes = (input: Record<string, unknown>) => {
  const r = fraudSchema.safeParse(input);
  return r.success ? {} : fieldErrorsFromIssues(r.error.issues);
};

describe('fraudSchema — the site is stricter than the door, never looser (W3, V-2)', () => {
  it('accepts the minimal report: name + e-mail + a ≥ 20-character description', () => {
    expect(fraudSchema.safeParse(OK).success).toBe(true);
    expect(DESCRIPTION_MIN).toBe(20);
  });

  it('description: empty → required, short → min, over the catalog cap → max', () => {
    expect(codes({ ...OK, description: '' })).toEqual({ description: 'required' });
    expect(codes({ ...OK, description: 'too short' })).toEqual({ description: 'min' });
    expect(codes({ ...OK, description: 'x'.repeat(5001) })).toEqual({ description: 'max' });
  });

  it('reporter name and e-mail are required; a malformed e-mail reads email', () => {
    expect(codes({ ...OK, reporterName: '' })).toEqual({ reporterName: 'required' });
    expect(codes({ ...OK, reporterEmail: '' })).toEqual({ reporterEmail: 'required' });
    expect(codes({ ...OK, reporterEmail: 'not-an-email' })).toEqual({ reporterEmail: 'email' });
  });

  it('reporter phone is optional but, when given, needs ≥ 8 digits (the door rule)', () => {
    expect(fraudSchema.safeParse({ ...OK, reporterPhone: '+90 501 124 03 40' }).success).toBe(true);
    expect(codes({ ...OK, reporterPhone: '123' })).toEqual({ reporterPhone: 'phone' });
  });

  it('the suspect fields are optional and capped at the catalog lengths', () => {
    expect(codes({ ...OK, suspectName: 'x'.repeat(201) })).toEqual({ suspectName: 'max' });
    expect(codes({ ...OK, suspectContact: 'x'.repeat(301) })).toEqual({ suspectContact: 'max' });
  });
});

describe('fraudSchema — evidenceKeys (W101: one hidden input per uploaded file)', () => {
  const KEY = 'website-fraud/5f0c.png';

  it('absent → [], one → [key], several → the array, empty values dropped', () => {
    expect(fraudSchema.parse(OK).evidenceKeys).toEqual([]);
    expect(fraudSchema.parse({ ...OK, evidenceKeys: KEY }).evidenceKeys).toEqual([KEY]);
    expect(
      fraudSchema.parse({ ...OK, evidenceKeys: [KEY, '', 'website-fraud/b.pdf'] }).evidenceKeys,
    ).toEqual([KEY, 'website-fraud/b.pdf']);
  });

  it('a fourth key is max; a key the door never issued is invalid', () => {
    const four = ['a', 'b', 'c', 'd'].map((x) => `website-fraud/${x}.png`);
    expect(codes({ ...OK, evidenceKeys: four })).toEqual({ evidenceKeys: 'max' });
    expect(codes({ ...OK, evidenceKeys: '../careers-cv/x.pdf' })).toEqual({
      evidenceKeys: 'invalid',
    });
  });
});

describe('fraudFields → the exact catalog names', () => {
  it('sends only the fraud catalog names, evidenceKeys as an array', () => {
    const fields = fraudFields(
      fraudSchema.parse({ ...OK, evidenceKeys: ['website-fraud/a.png', 'website-fraud/b.pdf'] }),
    );
    expect(Object.keys(fields)).toEqual([
      'reporterName',
      'reporterEmail',
      'reporterPhone',
      'suspectName',
      'suspectContact',
      'description',
      'evidenceKeys',
    ]);
    expect(fields.evidenceKeys).toEqual(['website-fraud/a.png', 'website-fraud/b.pdf']);
    // the door lower-cases e-mails; the site does not pre-empt it
    expect(fields.reporterEmail).toBe('Ayse@Example.com');
  });
});
```

`src/app/[locale]/(site)/verify/_lib/__tests__/evidence.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MAX_EVIDENCE_BYTES, MAX_EVIDENCE_FILES } from '@/forms/uploads';
import {
  checkEvidence,
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_BYTES,
  EVIDENCE_MAX_FILES,
  EVIDENCE_MAX_MB,
} from '../evidence';
import { EVIDENCE_KEYS_MAX } from '../fraud';

describe('the client mirror of the server-only caps (W73/W116)', () => {
  it('equals @/forms/uploads — 3 MiB per file, three files, three keys', () => {
    expect(EVIDENCE_MAX_BYTES).toBe(MAX_EVIDENCE_BYTES);
    expect(EVIDENCE_MAX_MB * 1024 * 1024).toBe(MAX_EVIDENCE_BYTES);
    expect(EVIDENCE_MAX_FILES).toBe(MAX_EVIDENCE_FILES);
    expect(EVIDENCE_KEYS_MAX).toBe(MAX_EVIDENCE_FILES);
  });

  it('offers exactly the types the door sniffs', () => {
    expect(EVIDENCE_ACCEPT).toBe('image/jpeg,image/png,image/webp,application/pdf');
  });
});

describe('checkEvidence', () => {
  it('refuses empty, over-cap and declared non-evidence files; lets an undeclared type through', () => {
    expect(checkEvidence({ size: 0, type: 'image/png' })).toBe('empty');
    expect(checkEvidence({ size: EVIDENCE_MAX_BYTES + 1, type: 'image/png' })).toBe('tooBig');
    expect(checkEvidence({ size: 10, type: 'text/plain' })).toBe('badType');
    expect(checkEvidence({ size: 10, type: 'image/heic' })).toBe('badType');
    expect(checkEvidence({ size: 10, type: '' })).toBe('ok'); // the door sniffs the bytes
    expect(checkEvidence({ size: EVIDENCE_MAX_BYTES, type: 'application/pdf' })).toBe('ok');
  });
});
```

`src/app/[locale]/(site)/verify/_lib/__tests__/copy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this task adds (W9/W23), relative to `sys`. */
export const VERIFY_SYS_KEYS = [
  'seo.verify.title',
  'seo.verify.description',
  'verify.hero.lead',
  'verify.lookup.hint',
  'verify.lookup.resultTitle',
  'verify.lookup.resultBody',
  'verify.lookup.whatsapp',
  'verify.empty.title',
  'verify.empty.body',
  'verify.faq.whoSigns',
  'verify.report.submit',
  'verify.record.close',
  'verify.record.former',
  'form.evidence.uploading',
  'form.evidence.attached',
  'form.evidence.remove',
  'form.evidence.tooBig',
  'form.evidence.badType',
  'form.evidence.refused',
  'form.evidence.failed',
  'form.evidence.tooMany',
  'form.evidence.wait',
] as const;

const read = (file: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, k) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
      file,
    );

const LOCALES = [
  ['tr', tr.sys],
  ['en', en.sys],
] as const;

describe('sys.verify / sys.seo.verify / sys.form.evidence (T10)', () => {
  for (const key of VERIFY_SYS_KEYS) {
    it(`${key}: a non-empty string in both locales, translated (not copied across)`, () => {
      const a = read(tr.sys, key);
      const b = read(en.sys, key);
      expect(typeof a, 'tr').toBe('string');
      expect(typeof b, 'en').toBe('string');
      expect((a as string).trim()).not.toBe('');
      expect((b as string).trim()).not.toBe('');
      expect(a).not.toBe(b);
    });
  }

  it('the ICU arguments the page passes are in both locales; {query} appears exactly once', () => {
    const tokens: Record<string, string[]> = {
      'verify.lookup.hint': ['{min}'],
      'verify.lookup.resultBody': ['{query}'],
      'form.evidence.uploading': ['{name}'],
      'form.evidence.attached': ['{name}'],
      'form.evidence.remove': ['{name}'],
      'form.evidence.tooBig': ['{name}', '{maxMb}'],
      'form.evidence.badType': ['{name}'],
      'form.evidence.refused': ['{name}'],
      'form.evidence.failed': ['{name}'],
      'form.evidence.tooMany': ['{max}'],
    };
    for (const [locale, sys] of LOCALES) {
      for (const [key, list] of Object.entries(tokens))
        for (const token of list) expect(read(sys, key), `${locale} ${key}`).toContain(token);
      expect((read(sys, 'verify.lookup.resultBody') as string).split('{query}')).toHaveLength(2);
    }
  });

  it('D17: no figure is typed into this copy — numbers arrive as arguments', () => {
    for (const [locale, sys] of LOCALES)
      for (const key of VERIFY_SYS_KEYS) expect(read(sys, key), `${locale} ${key}`).not.toMatch(/\d/);
  });

  it('§10 row 3: the name-less founder claims never carry the name the package strings embed', () => {
    for (const [, sys] of LOCALES)
      for (const key of ['verify.hero.lead', 'verify.faq.whoSigns'])
        expect(read(sys, key)).not.toMatch(/Haris|Jiva/);
  });

  it('W6: the lookup copy never gives the red verdict', () => {
    for (const [, sys] of LOCALES)
      expect(JSON.stringify(read(sys, 'verify.lookup'))).not.toMatch(
        /unauthori[sz]ed|authorised list|yetkisiz|yetkili listemizde/i,
      );
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/verify"
```
Expected: `register.test.ts`, `lookup.test.ts`, `fraud.test.ts` and `evidence.test.ts` fail to import (`Cannot find module '../register'`, `'../lookup'`, `'../fraud'`, `'../evidence'`); every `copy.test.ts` key case fails with `expected 'undefined' to be 'string'` (no `sys.verify`, `sys.seo.verify` or `sys.form.evidence` yet).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/_lib/register.ts` (no directive — pure, client-safe):

```ts
import { z } from 'zod';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/**
 * The page-local shape of one `representatives` row — what the v1.1 `WebsiteRepresentative`
 * record must emit (D9 v1.1: a consent record, a stable public id for the badge QR, company
 * contacts only). `representatives` is FIXTURE_ONLY (`src/content/config.ts`): absent from the
 * LOCAL bundles and refused under LOCAL in production by `getBundle` (D23), so Phase A never has
 * a row and every reader below renders its empty state. Parsed here rather than in
 * `collections.ts` (reconcile: page-local for Phase A), with `getCollection`'s rule — a schema
 * miss throws outside production and drops the row in production. Fail closed: `status` is an
 * enum; the design's "unknown status = Authorised" fallback is exactly what this forbids.
 */
export const REPRESENTATIVE_LEVELS = ['founder', 'office', 'rep', 'coordinator'] as const;
export const REPRESENTATIVE_STATUSES = ['active', 'suspended', 'former'] as const;
export type RepresentativeLevel = (typeof REPRESENTATIVE_LEVELS)[number];
export type RepresentativeStatus = (typeof REPRESENTATIVE_STATUSES)[number];

/** The public badge id: `JA-` + a 2–5 letter desk code + three digits (`JA-REP-014`). */
export const REPRESENTATIVE_ID = /^JA-[A-Z]{2,5}-\d{3}$/;

export const RepresentativeSchema = z.object({
  id: z.string().regex(REPRESENTATIVE_ID),
  name: z.string().min(1),
  /** Locale-resolved by the bundle (like `sourceCountries.name`), never a package id: the
   *  design's staff-data strings (verify.148–197, 240–258) are sample rows, not copy. */
  role: z.string().min(1),
  level: z.enum(REPRESENTATIVE_LEVELS),
  desk: z.string().min(1).nullable(),
  city: z.string().min(1),
  /** ISO-2, upper-case (W40). */
  country: z.string().regex(/^[A-Z]{2}$/),
  languages: z.array(z.string().min(1)),
  /** A company number or an @jobsadmire.com address (D9 v1.1) — or nothing. */
  contact: z.string().min(1).nullable(),
  /** `YYYY-MM-DD`; null = no expiry. */
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  /** Another public id. */
  reportsTo: z.string().regex(REPRESENTATIVE_ID).nullable(),
  /** `YYYY-MM`. */
  since: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  status: z.enum(REPRESENTATIVE_STATUSES),
  canSign: z.boolean(),
  photo: z.string().url().nullable(),
  updatedAt: z.string().datetime(),
});
export type Representative = z.infer<typeof RepresentativeSchema>;

export type Register = {
  rows: Representative[];
  active: Representative[];
  /** `suspended` and `former` rows — they stay visible on purpose (the package README's rule). */
  former: Representative[];
  /** The active founder row that may sign: the founder strip's public id and record link. */
  founder: Representative | null;
  /** The latest `updatedAt` across the rows — the "Register last updated" line; null hides it
   *  (D17: never "today"). */
  updatedAt: string | null;
};

export class RegisterError extends Error {}

export function readRegister(
  bundle: Bundle,
  env: string | undefined = process.env.NODE_ENV,
): Register {
  const rows: Representative[] = [];
  (bundle.collections.representatives ?? []).forEach((row, index) => {
    const parsed = RepresentativeSchema.safeParse(row);
    if (parsed.success) {
      rows.push(parsed.data);
      return;
    }
    const why = parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ');
    if (env !== 'production') throw new RegisterError(`representatives[${index}]: ${why}`);
    console.error('[verify] representatives row dropped (schema miss)', { index });
  });
  const active = rows.filter((r) => r.status === 'active');
  const former = rows.filter((r) => r.status !== 'active');
  const founder = active.find((r) => r.level === 'founder' && r.canSign) ?? null;
  const updatedAt = rows.reduce<string | null>(
    (latest, r) => (latest === null || r.updatedAt > latest ? r.updatedAt : latest),
    null,
  );
  return { rows, active, former, founder, updatedAt };
}
```

`src/app/[locale]/(site)/verify/_lib/lookup.ts` (no directive — pure; the lookup island imports it):

```ts
/** A result renders once the normalised query has this many characters (the design's `> 2`). */
export const LOOKUP_MIN_CHARS = 3;
/** The longest query a URL may prefill — a badge id is 10 characters; 80 covers a full name. */
export const DEEP_LINK_MAX = 80;
/** V-1: `?id=` is the canonical record deep link; `?rep=` and `#id=` are the design's aliases. */
export const DEEP_LINK_PARAMS = ['id', 'rep'] as const;
/** The token `sys.verify.lookup.resultBody` carries where the typed query is echoed. */
export const QUERY_TOKEN = '{query}';

export function normaliseQuery(q: string): string {
  return q.trim().replace(/\s+/g, ' ');
}

/** The prefilled query from `location.search` / `location.hash`, or null. Never throws: a
 *  malformed percent-escape in the hash falls back to the raw value (the query string is decoded
 *  by `URLSearchParams`, which never throws). */
export function readDeepLinkId(search: string, hash: string): string | null {
  const params = new URLSearchParams(search);
  const candidates: (string | null)[] = DEEP_LINK_PARAMS.map((k) => params.get(k));
  const match = /^#id=(.*)$/.exec(hash);
  if (match) {
    let value = match[1];
    try {
      value = decodeURIComponent(value);
    } catch {
      /* keep the raw value */
    }
    candidates.push(value);
  }
  for (const candidate of candidates) {
    if (candidate === null) continue;
    const value = normaliseQuery(candidate).slice(0, DEEP_LINK_MAX);
    if (value.length > 0) return value;
  }
  return null;
}

/** The raw result template split at its one `{query}`, so the island can bold the echo as React
 *  text (never HTML). A template without the token echoes nothing rather than printing it. */
export function splitAtQuery(template: string): { before: string; after: string; hasQuery: boolean } {
  const at = template.indexOf(QUERY_TOKEN);
  if (at === -1) return { before: template, after: '', hasQuery: false };
  return {
    before: template.slice(0, at),
    after: template.slice(at + QUERY_TOKEN.length),
    hasQuery: true,
  };
}
```

`src/app/[locale]/(site)/verify/_lib/fraud.ts` (no directive — pure; only `actions.ts` and the tests import it):

```ts
import { z } from 'zod';
import type { WireFields } from '@/forms/wire';

/** The Operations catalog's `fraud` rules (website-form-catalog.ts, v1.0 — v1.1 adds nothing). */
export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 5000;
export const EVIDENCE_KEYS_MAX = 3;
/** The catalog's `evidenceKeys` item pattern; each key ≤ 300 characters. */
export const EVIDENCE_KEY = /^website-fraud\/[A-Za-z0-9._-]+$/;
const EVIDENCE_KEY_LENGTH_MAX = 300;

/** The door's `phone` rule: at least eight digits anywhere in the value. */
const hasEightDigits = (v: string) => (v.match(/\d/g)?.length ?? 0) >= 8;

/** The kernel hands a repeated FormData key over as an array, a single one as a string and an
 *  absent one as undefined; an empty value is not a key. */
const toKeyList = (v: unknown): unknown =>
  (v === undefined ? [] : Array.isArray(v) ? v : [v]).filter((k) => k !== '');

export const fraudSchema = z.object({
  suspectName: z.string().max(200).optional(),
  suspectContact: z.string().max(300).optional(),
  // `.min(1)` first, so an empty value reads `required` and a short one `min` (errors.ts).
  description: z.string().min(1).min(DESCRIPTION_MIN).max(DESCRIPTION_MAX),
  // V-2: the door requires only `description`, but the copy promises an answer (verify.093), so
  // the site asks for a reply channel — stricter than the door, never looser (W3/W105).
  reporterName: z.string().min(1).max(120),
  reporterEmail: z.string().min(1).max(254).email(),
  reporterPhone: z
    .string()
    .max(40)
    .refine((v) => v === '' || hasEightDigits(v), { message: 'phone' })
    .optional(),
  // W101: the keys the evidence island got back — one hidden input per uploaded file.
  evidenceKeys: z.preprocess(
    toKeyList,
    z
      .array(z.string())
      .max(EVIDENCE_KEYS_MAX)
      .refine(
        (keys) => keys.every((k) => k.length <= EVIDENCE_KEY_LENGTH_MAX && EVIDENCE_KEY.test(k)),
        { message: 'invalid' },
      ),
  ),
});
export type FraudInput = z.infer<typeof fraudSchema>;

/** The catalog's exact `fraud` wire names — an unknown key would be dropped silently with a 200;
 *  `buildEnvelope` drops the empty strings and an empty key list. */
export function fraudFields(p: FraudInput): WireFields {
  return {
    reporterName: p.reporterName,
    reporterEmail: p.reporterEmail,
    reporterPhone: p.reporterPhone ?? '',
    suspectName: p.suspectName ?? '',
    suspectContact: p.suspectContact ?? '',
    description: p.description,
    evidenceKeys: [...new Set(p.evidenceKeys)],
  };
}
```

`src/app/[locale]/(site)/verify/_lib/evidence.ts` (no directive — pure; the evidence island imports it):

```ts
/**
 * The evidence island's client-side mirror of the server-only caps in `@/forms/uploads`
 * (`MAX_EVIDENCE_BYTES` = `MAX_UPLOAD_BYTES` = 3 MiB, W73/W116; `MAX_EVIDENCE_FILES` = 3). A
 * client module cannot import that file (`server-only`), so the values are repeated here and
 * pinned equal by `evidence.test.ts`. The browser refuses what the server would refuse anyway,
 * before a byte is sent; `uploadFraudEvidence` checks again — the browser is never trusted.
 */
export const EVIDENCE_MAX_BYTES = 3 * 1024 * 1024;
export const EVIDENCE_MAX_MB = 3;
export const EVIDENCE_MAX_FILES = 3;
/** What the door's sniffer accepts; HEIC is refused there, so it is not offered here. */
export const EVIDENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
export const EVIDENCE_ACCEPT = EVIDENCE_TYPES.join(',');

export type EvidenceCheck = 'ok' | 'empty' | 'tooBig' | 'badType';

/** The pre-upload check. A blank `type` (some browsers leave it empty) goes to the server, whose
 *  door sniffs the bytes — only a declared non-evidence type is refused here. */
export function checkEvidence(file: { size: number; type: string }): EvidenceCheck {
  if (file.size === 0) return 'empty';
  if (file.size > EVIDENCE_MAX_BYTES) return 'tooBig';
  if (file.type !== '' && !(EVIDENCE_TYPES as readonly string[]).includes(file.type))
    return 'badType';
  return 'ok';
}

/** What the page's `'use server'` `uploadEvidence` answers for one file: the storage key, or why
 *  not — `file` (refused: type, size or unreadable; the visitor can pick another) or `door`
 *  (unconfigured, paused or unreachable; the report can still go without it). */
export type EvidenceUploadResult = { ok: true; key: string } | { ok: false; reason: 'file' | 'door' };
export type UploadEvidenceAction = (data: FormData) => Promise<EvidenceUploadResult>;
```

`src/app/[locale]/(site)/verify/_lib/flags.ts`:

```ts
/**
 * D9 v1.1: the record dialog opens once `WebsiteRepresentative` rows ship with consent and the
 * website's `no-store` record handler exists (V-1: `src/app/api/verify/record/route.ts`, called
 * by the lookup island — the browser never calls Operations, D6). Typed `boolean`, not the
 * literal `false`, so the guarded branches type-check.
 */
export const RECORD_DIALOG_ENABLED: boolean = false;
```

`src/messages/en.json` — three key-anchored additions inside `"sys"` (key order inside an object is not significant; `src/messages/messages.test.ts` compares the two files' key sets):

(a) inside the existing `"seo"` object (it holds `ogTagline` and the `seo.<pageKey>` objects T1–T9 added — keep them), add:

```json
      "verify": {
        "title": "Verify a JobsAdmire Representative — Official Authority Check",
        "description": "Check whether someone really acts for JobsAdmire: only the founder signs, and nobody at JobsAdmire takes money from a worker. Check a JA- ID or report an impostor."
      }
```

(b) inside the existing `"form"` object, add (a new child object beside `labels`, `hints`, `errors`, …):

```json
      "evidence": {
        "uploading": "Uploading {name}…",
        "attached": "{name} attached",
        "remove": "Remove {name}",
        "tooBig": "{name} is larger than {maxMb} MB. Choose a smaller file.",
        "badType": "{name} is not a JPEG, PNG, WEBP or PDF file.",
        "refused": "{name} was not accepted. Check its type and size.",
        "failed": "{name} could not be uploaded right now. Send the report without it and share the file on WhatsApp.",
        "tooMany": "Up to {max} files can be attached.",
        "wait": "A file is still uploading. Send the report once it has finished."
      }
```

(c) a new `"verify"` object as a direct child of `"sys"` (after the page namespaces T1–T9 added):

```json
    "verify": {
      "hero": {
        "lead": "Only the founder signs for JobsAdmire. Everyone else on the team collects documents, checks skills and runs interviews — nobody else signs, and nobody at JobsAdmire takes money from a worker. This page helps you confirm who you are dealing with."
      },
      "lookup": {
        "hint": "Type at least {min} characters of the ID, name, city or number.",
        "resultTitle": "The public register is not published yet",
        "resultBody": "“{query}” cannot be checked online yet. Call the JobsAdmire office or write on WhatsApp — the team confirms whether this person works for JobsAdmire. Until then, do not hand over documents or money.",
        "whatsapp": "Ask on WhatsApp"
      },
      "empty": {
        "title": "The register is not public yet",
        "body": "Every JobsAdmire representative carries a JA- ID. The public register, with photos and records, is being prepared with each person's consent. Until it is published, confirm any name or ID with the JobsAdmire office by phone or WhatsApp."
      },
      "faq": {
        "whoSigns": "Only the founder. No representative, office employee or partner agency can sign a service agreement, an employer contract or a worker contract for JobsAdmire. Any document signed by anyone else is not valid."
      },
      "report": {
        "submit": "Send the report"
      },
      "record": {
        "close": "Close the record",
        "former": "No longer authorised"
      }
    }
```

`src/messages/tr.json` — the same three positions:

```json
      "verify": {
        "title": "JobsAdmire Temsilcisini Doğrulayın — Resmî Yetki Kontrolü",
        "description": "Karşınızdaki kişi gerçekten JobsAdmire adına mı çalışıyor? Yalnızca kurucu imza atar ve JobsAdmire'da hiç kimse işçiden para almaz. JA- kimliğini sorgulayın ya da sahtekârı bildirin."
      }
```

```json
      "evidence": {
        "uploading": "{name} yükleniyor…",
        "attached": "{name} eklendi",
        "remove": "{name} dosyasını kaldır",
        "tooBig": "{name}, {maxMb} MB'tan büyük. Daha küçük bir dosya seçin.",
        "badType": "{name} bir JPEG, PNG, WEBP veya PDF dosyası değil.",
        "refused": "{name} kabul edilmedi. Türünü ve boyutunu kontrol edin.",
        "failed": "{name} şu anda yüklenemedi. Bildirimi dosyasız gönderin ve dosyayı WhatsApp'tan iletin.",
        "tooMany": "En fazla {max} dosya eklenebilir.",
        "wait": "Bir dosya hâlâ yükleniyor. Yükleme bitince bildirimi gönderin."
      }
```

```json
    "verify": {
      "hero": {
        "lead": "JobsAdmire adına yalnızca kurucu imza atar. Ekipteki diğer herkes belge toplar, becerileri kontrol eder ve görüşme yapar — başka hiç kimse imza atmaz ve JobsAdmire'da hiç kimse bir işçiden para almaz. Bu sayfa, kiminle muhatap olduğunuzu doğrulamanıza yardımcı olur."
      },
      "lookup": {
        "hint": "Kimliğin, adın, şehrin veya numaranın en az {min} karakterini yazın.",
        "resultTitle": "Herkese açık kayıt defteri henüz yayımlanmadı",
        "resultBody": "“{query}” şu anda çevrim içi doğrulanamıyor. JobsAdmire ofisini arayın ya da WhatsApp'tan yazın — JobsAdmire ekibi, bu kişinin JobsAdmire için çalışıp çalışmadığını teyit eder. O zamana kadar belge ya da para vermeyin.",
        "whatsapp": "WhatsApp'tan sorun"
      },
      "empty": {
        "title": "Kayıt defteri henüz herkese açık değil",
        "body": "Her JobsAdmire temsilcisi bir JA- kimliği taşır. Fotoğrafların ve kayıtların yer aldığı herkese açık kayıt defteri, her kişinin onayıyla hazırlanıyor. Yayımlanana kadar bir adı ya da kimliği JobsAdmire ofisiyle telefonla veya WhatsApp üzerinden doğrulayın."
      },
      "faq": {
        "whoSigns": "Yalnızca kurucu. Hiçbir temsilci, ofis çalışanı ya da iş ortağı ajans JobsAdmire adına hizmet sözleşmesi, işveren sözleşmesi veya işçi sözleşmesi imzalayamaz. Başka biri tarafından imzalanan hiçbir belge geçerli değildir."
      },
      "report": {
        "submit": "Bildirimi gönder"
      },
      "record": {
        "close": "Kaydı kapat",
        "former": "Artık yetkili değil"
      }
    }
```

(The apostrophes in `MB'tan`, `WhatsApp'tan`, `JobsAdmire'da` and `person's` are literal under ICU's apostrophe rule — a single `'` quotes only before `{`, `}`, `#` or `|` — the spelling the existing `sys.*` copy already uses. `resultBody` is read raw (`sys.raw`) and split at `{query}` by the island; every other key goes through next-intl's ICU formatter.)

`docs/CONTENT-MODEL.md` — in `### Adding copy (W9, W23, W54)`, append after the last bullet of the per-page `sys.*` list (T1 created it; T2–T9 appended theirs):

```markdown
- **Verify Representative (`sys.verify.*` + `sys.seo.verify.*` + `sys.form.evidence.*`, WP2b T10):** `hero.lead` (the name-less hero lead while the W86 `founder` row is unpublished — `verify.025`/`026` name the founder and render only once it is published, §10 row 3), `lookup.{hint,resultTitle,resultBody,whatsapp}` (the Phase A neutral lookup answer, W6 — `hint` takes `{min}`; `resultBody` is read raw and split at its one `{query}` by the island, which bolds the echo as React text), `empty.{title,body}` (the unpublished-register empty state), `faq.whoSigns` (the name-less answer to `verify.103` while the founder is unpublished — `verify.104` names him), `report.submit` (the fraud form's submit), `record.{close,former}` (the v1.1 record dialog's close label and "former" status, resolved only while `RECORD_DIALOG_ENABLED`); `seo.verify.{title,description}` (the page record carries no package SEO string); and — shared form copy, kept in `sys.form` because the evidence input is a form control and `form` is already a client namespace — `form.evidence.{uploading,attached,remove,tooBig,badType,refused,failed,tooMany,wait}` (the per-file upload statuses; `{name}`, `{maxMb}`, `{max}`; they ride the existing `form` client namespace on every page's RSC payload, ≈ 0.6 KB per locale — accepted for Phase A, W166: `js-size` does not count flight data, so no route budget moves). No template carries a figure. The page never renders the design's red verdict (`verify.048`–`050`, `235`/`236`). `CLIENT_SYS` is unchanged: `EvidenceUpload` reads `sys.form` only and the other islands receive resolved strings (W148).
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/verify" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `register.test.ts` 7, `lookup.test.ts` 8, `fraud.test.ts` 8, `evidence.test.ts` 3, `copy.test.ts` 26 passed; `src/messages/messages.test.ts` (identical key sets), `src/messages/voice.test.ts` (no "we"/"biz" anywhere in `sys.*` — the new copy names JobsAdmire / "JobsAdmire ekibi"), `src/i18n/client-messages.test.ts` (no client module reads a new namespace yet) and `src/lib/seo/unbuilt.test.ts` (no `page.tsx` yet, `/verify` still unbuilt) green. `_lib/__tests__/bundles.ts` and `fixtures.ts` are type-checked but not collected.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/verify" src/messages/tr.json src/messages/en.json docs/CONTENT-MODEL.md && git commit -m "feat(verify): register schema (fail closed, D23 asserted), lookup helpers, fraud schema → catalog names, evidence caps; sys.verify, sys.seo.verify, sys.form.evidence (T10 c1)

W6/§10 row 11: the Phase A register is empty and the representatives fixture is refused in
production (asserted); W3/V-2: reporter name + e-mail required, fields are the fraud catalog's
names; W73/W116: the client evidence caps mirror @/forms/uploads (pinned); §10 row 3: name-less
fallbacks for the founder claims; W154 voice, D17 no typed figures.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — the two server actions: `submitFraud` (the `fraud` wire contract) and `uploadEvidence` (one file per call, W73/W101); `visitorOf` exported from the kernel

- [ ] **Step 1: Write the failing test**

`src/app/[locale]/(site)/verify/__tests__/actions.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { FormActionError, FormDoorError, IDLE_FORM_STATE } from '@/forms/types';
import { submitFraud, uploadEvidence } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92);
// `uploadFraudEvidence` is stubbed per case (its own behaviour is pinned by uploads.test.ts).
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
  upload: vi.fn(),
}));

vi.mock('next-intl/server', () => ({ getLocale: mocks.getLocale }));
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));
vi.mock('@/forms/uploads', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/forms/uploads')>()),
  uploadFraudEvidence: mocks.upload,
}));

/** The Operations catalog's `fraud` field names (v1.0; v1.1 adds nothing to `fraud`). Anything
 *  else inside `fields` would be dropped silently with a 200. */
const FRAUD_CATALOG = [
  'reporterName',
  'reporterEmail',
  'reporterPhone',
  'description',
  'suspectName',
  'suspectContact',
  'evidenceKeys',
];

type Envelope = {
  locale: string;
  consentVersion: string;
  sourcePath?: string;
  fields: Record<string, string | string[]>;
};
function sent(): { key: string; envelope: Envelope; visitor: unknown } {
  expect(mocks.postForm).toHaveBeenCalledTimes(1);
  const [key, envelope, visitor] = mocks.postForm.mock.calls[0] as [string, Envelope, unknown];
  return { key, envelope, visitor };
}

/** Entries, not an object: `evidenceKeys` repeats, one hidden input per uploaded file. */
function formData(entries: [string, string][]) {
  const fd = new FormData();
  for (const [k, v] of entries) fd.append(k, v);
  return fd;
}

const REPORT: [string, string][] = [
  ['suspectName', 'Ali Veli'],
  ['suspectContact', '+90 555 000 00 00'],
  ['description', 'Kendini JobsAdmire temsilcisi olarak tanıtan biri 500 USD vize depozitosu istedi.'],
  ['reporterName', 'Ayşe Yılmaz'],
  ['reporterEmail', 'ayse@example.com'],
  ['reporterPhone', ''],
  ['evidenceKeys', 'website-fraud/5f0c.png'],
  ['evidenceKeys', 'website-fraud/9a1b.pdf'],
  ['consent', 'on'],
  ['honeypot', ''],
];
const without = (name: string) => REPORT.filter(([k]) => k !== name);

const ok = {
  kind: 'ok',
  id: 'sub_1',
  status: 'RECEIVED',
  isTest: false,
  replayed: false,
  captchaDegraded: false,
  error: null,
} as const;

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/temsilci-dogrulama');
  mocks.headersStore.set('x-forwarded-for', '203.0.113.7, 10.0.0.1');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
  mocks.upload.mockReset();
});

describe('submitFraud — the report → fraud (W3/W79/W101)', () => {
  it('sends the fraud catalog names only, the uploaded keys as an array; no door → the D11 state', async () => {
    const state = await submitFraud(IDLE_FORM_STATE, formData(REPORT));
    const { key, envelope, visitor } = sent();
    expect(key).toBe('fraud');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/temsilci-dogrulama',
    });
    expect(envelope.fields).toEqual({
      reporterName: 'Ayşe Yılmaz',
      reporterEmail: 'ayse@example.com',
      suspectName: 'Ali Veli',
      suspectContact: '+90 555 000 00 00',
      description:
        'Kendini JobsAdmire temsilcisi olarak tanıtan biri 500 USD vize depozitosu istedi.',
      evidenceKeys: ['website-fraud/5f0c.png', 'website-fraud/9a1b.pdf'],
    });
    for (const name of Object.keys(envelope.fields)) expect(FRAUD_CATALOG).toContain(name);
    expect(visitor).toEqual({ ip: '203.0.113.7', ua: 'vitest' });
    expect(mocks.upload).not.toHaveBeenCalled(); // W101: nothing uploads inside toFields
    // D11/W92: no door → the fallback panel state, the typed values echoed for its prefill.
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { reporterName: 'Ayşe Yılmaz', suspectName: 'Ali Veli' },
    });
  });

  it('a report without evidence sends no evidenceKeys at all', async () => {
    await submitFraud(
      IDLE_FORM_STATE,
      formData(REPORT.filter(([k]) => k !== 'evidenceKeys')),
    );
    expect(sent().envelope.fields).not.toHaveProperty('evidenceKeys');
  });

  it('W79: no consent tick is a field error and never reaches the door', async () => {
    const state = await submitFraud(IDLE_FORM_STATE, formData(without('consent')));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('a short description and a missing reporter e-mail are field errors (catalog min 20; V-2)', async () => {
    const state = await submitFraud(
      IDLE_FORM_STATE,
      formData([
        ...without('description').filter(([k]) => k !== 'reporterEmail'),
        ['description', 'çok kısa'],
        ['reporterEmail', ''],
      ]),
    );
    expect(state).toMatchObject({
      status: 'fieldErrors',
      errors: { description: 'min', reporterEmail: 'required' },
    });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('a fourth key is max and a key the door never issued is invalid — neither reaches the door', async () => {
    const four = await submitFraud(
      IDLE_FORM_STATE,
      formData([
        ...REPORT,
        ['evidenceKeys', 'website-fraud/c.png'],
        ['evidenceKeys', 'website-fraud/d.png'],
      ]),
    );
    expect(four).toMatchObject({ status: 'fieldErrors', errors: { evidenceKeys: 'max' } });
    const forged = await submitFraud(
      IDLE_FORM_STATE,
      formData([...without('evidenceKeys'), ['evidenceKeys', 'careers-cv/x.pdf']]),
    );
    expect(forged).toMatchObject({ status: 'fieldErrors', errors: { evidenceKeys: 'invalid' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('D13: a RECEIVED report navigates to /tesekkurler?form=fraud', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitFraud(IDLE_FORM_STATE, formData(REPORT))).rejects.toThrow('NEXT_REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'fraud' } },
      locale: 'tr',
    });
  });
});

describe('uploadEvidence — one file per server-action call (W73/W101/W116)', () => {
  const file = () => new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'shot.png', {
    type: 'image/png',
  });
  const oneFile = (f: File) => {
    const fd = new FormData();
    fd.append('file', f, f.name);
    return fd;
  };

  it('answers the key only, and hands the door the visitor the kernel derives (visitorOf)', async () => {
    mocks.upload.mockResolvedValue({ key: 'website-fraud/5f0c.png' });
    const f = file();
    expect(await uploadEvidence(oneFile(f))).toEqual({ ok: true, key: 'website-fraud/5f0c.png' });
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    const [sentFile, visitor] = mocks.upload.mock.calls[0] as [File, unknown];
    expect(sentFile.name).toBe('shot.png');
    expect(visitor).toEqual({ ip: '203.0.113.7', ua: 'vitest' });
  });

  it('a visitor-side refusal (empty, over 3 MiB, door 400) is reason file', async () => {
    mocks.upload.mockRejectedValue(
      new FormActionError('over 3 MB', { name: 'evidence', code: 'file' }),
    );
    expect(await uploadEvidence(oneFile(file()))).toEqual({ ok: false, reason: 'file' });
  });

  it('a door failure (unconfigured, 401/404/429/5xx, timeout) is reason door', async () => {
    mocks.upload.mockRejectedValue(new FormDoorError({ kind: 'unauthorized' }));
    expect(await uploadEvidence(oneFile(file()))).toEqual({ ok: false, reason: 'door' });
  });

  it('an unexpected throw is logged and answered as door — never a rejection to the island', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.upload.mockRejectedValue(new Error('boom'));
    expect(await uploadEvidence(oneFile(file()))).toEqual({ ok: false, reason: 'door' });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it('no file part (or a string in its place) is reason file and calls nothing', async () => {
    expect(await uploadEvidence(new FormData())).toEqual({ ok: false, reason: 'file' });
    const text = new FormData();
    text.append('file', 'not a file');
    expect(await uploadEvidence(text)).toEqual({ ok: false, reason: 'file' });
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/verify/__tests__/actions.test.ts"
```
Expected: FAIL — `Cannot find module '../actions'`.

- [ ] **Step 3: Implement**

`src/forms/action.ts` — replace the doc comment and declaration of `visitorOf` (the block that begins `/** The visitor's own address: the first \`x-forwarded-for\` hop` and ends with the line `function visitorOf(h: Awaited<ReturnType<typeof headers>>): PostFormVisitor {`) with the block below; the function body and everything else in the file stay as they are:

```ts
/** The visitor's own address: the first `x-forwarded-for` hop when it is a bare IP (the door
 *  validates with `isIP` and would otherwise fall back to Vercel's egress), else `x-real-ip`,
 *  else nothing. Never logged here — the door hashes it and this module never persists it.
 *  Exported for the per-file upload actions (W101 — the Verify page's evidence island), which
 *  are not `createFormAction`s but must hand the door the same visitor. */
export function visitorOf(h: Awaited<ReturnType<typeof headers>>): PostFormVisitor {
```

`src/app/[locale]/(site)/verify/actions.ts`:

```ts
'use server';
import { headers } from 'next/headers';
import {
  createFormAction,
  FormActionError,
  FormDoorError,
  visitorOf,
  type FormActionState,
} from '@/forms/action';
import { isFile, uploadFraudEvidence } from '@/forms/uploads';
import type { EvidenceUploadResult } from './_lib/evidence';
import { fraudFields, fraudSchema } from './_lib/fraud';

/** The fraud report (W3/W79). The evidence is already uploaded by the island — its keys ride in
 *  `evidenceKeys` (W101) — so `toFields` only maps names; nothing uploads here. */
const fraud = createFormAction({
  key: 'fraud',
  schema: fraudSchema,
  toFields: (parsed) => fraudFields(parsed),
  consent: 'checkbox',
});

export async function submitFraud(
  prev: FormActionState,
  data: FormData,
): Promise<FormActionState> {
  return fraud(prev, data);
}

/**
 * W73/W101/W116: ONE evidence file per call — a Vercel function body is capped at 4.5 MB and the
 * server-action body at 4 MB, so three 3 MiB files could never share one. The island posts a
 * FormData with a single `file` part; `uploadFraudEvidence` refuses an empty or over-3 MiB file
 * (`FormActionError`), calls the door with the write token and the visitor's own IP/UA, and maps
 * a door failure to `FormDoorError`. The answer carries the key only — never the bytes, never an
 * object URL. One attempt: a retry would upload the bytes twice.
 */
export async function uploadEvidence(data: FormData): Promise<EvidenceUploadResult> {
  const file = data.get('file');
  if (!isFile(file)) return { ok: false, reason: 'file' };
  try {
    const { key } = await uploadFraudEvidence(file, visitorOf(await headers()));
    return { ok: true, key };
  } catch (err) {
    if (err instanceof FormActionError) return { ok: false, reason: 'file' };
    if (err instanceof FormDoorError) return { ok: false, reason: 'door' };
    console.error('[verify] evidence upload failed', err);
    return { ok: false, reason: 'door' };
  }
}
```

(A `'use server'` module may export only async functions: the `fraud` constant stays module-private and `EvidenceUploadResult` is a type-only import. `FormActionError`/`FormDoorError` are the classes `src/forms/action.ts` re-exports from `./types` — `instanceof` holds across both import paths because they are the same module instance.)

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/verify" src/forms/action.ts && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `actions.test.ts` 11 passed (6 `submitFraud`, 5 `uploadEvidence`); `src/forms/__tests__/action.test.ts` and `uploads.test.ts` unchanged and green (the export changes no behaviour); `tsc` proves `submitFraud` types as `(prev: FormActionState, data: FormData) => Promise<FormActionState>` (what `FormShell.action` takes) and that `'fraud'` is a `FormKey` (R55).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/verify/actions.ts" "src/app/[locale]/(site)/verify/__tests__/actions.test.ts" src/forms/action.ts && git commit -m "feat(verify): submitFraud → fraud door and uploadEvidence, one file per server-action call; export visitorOf (T10 c2)

W3/V-2: the fraud catalog names only, reporter name + e-mail required; W101/W73/W116: the island's
upload action carries one file, answers the key only and hands the door the kernel's visitor
(visitorOf, now exported — additive); nothing uploads inside toFields; D13 success →
/tesekkurler?form=fraud; W92: door-less → the D11 panel state.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — the client islands: the lookup card (neutral W6 answer, `?id=` deep link, `verify_lookup`, click-time WhatsApp), the steps disclosure, the per-file evidence upload, the record `Dialog` scaffold

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/_components/__tests__/LookupCard.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { LookupCard, type LookupLabels } from '../LookupCard';

// The record dialog is the v1.1 chunk behind RECORD_DIALOG_ENABLED; never loaded here.
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const labels: LookupLabels = {
  heading: 'Check the ID before the meeting',
  inputLabel: 'Representative ID, name, city or number',
  hint: 'Type at least 3 characters of the ID, name, city or number.',
  clear: 'Clear',
  callOffice: 'Call the office instead',
  note: 'The ID is printed on the badge every representative carries.',
  resultTitle: 'The public register is not published yet',
  resultBody: '“{query}” cannot be checked online yet. Call the JobsAdmire office.',
  resultCall: 'Call the office',
  resultWhatsapp: 'Ask on WhatsApp',
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

function renderCard(extra: Partial<Parameters<typeof LookupCard>[0]> = {}) {
  return renderWithIntl(
    <LookupCard
      labels={labels}
      phone="+905011240340"
      whatsappNumber="905011240340"
      livePill={null}
      updatedLabel={null}
      recordLabels={null}
      {...extra}
    />,
    { locale: 'en' },
  );
}

const events = (name: string) => (window.dataLayer ?? []).filter((e) => e.event === name);

describe('LookupCard — W6: the neutral answer, never the red verdict', () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => vi.restoreAllMocks());

  it('is a labelled, described input; no answer below three characters', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    expect(input).toHaveAttribute('aria-describedby');
    expect(document.getElementById(input.getAttribute('aria-describedby') ?? '')).toHaveTextContent(
      labels.hint,
    );
    fireEvent.change(input, { target: { value: 'JA' } });
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
    expect(events('verify_lookup')).toHaveLength(0);
  });

  it('answers any ≥ 3-character query neutrally, fires verify_lookup once per query session, clears', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    const result = screen.getByTestId('verify-lookup-result');
    expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
    expect(result).toHaveTextContent(labels.resultTitle);
    expect(result).toHaveTextContent('“JA-REP-014” cannot be checked online yet.');
    expect(result).not.toHaveTextContent(/authorised list|unauthori[sz]ed/i);
    // the title is announced once through the status line, not re-read on every keystroke
    expect(screen.getByRole('status')).toHaveTextContent(labels.resultTitle);
    expect(events('verify_lookup')).toEqual([
      { event: 'verify_lookup', page: '/', locale: 'en', outcome: 'register_unavailable' },
    ]);

    fireEvent.change(input, { target: { value: 'JA-REP-0145' } });
    expect(events('verify_lookup')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: labels.clear }));
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();

    fireEvent.change(input, { target: { value: 'Ali' } });
    expect(events('verify_lookup')).toHaveLength(2);
  });

  it('Escape clears the query', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
  });

  it('W95: no DOM href carries the query — the WhatsApp prefill is composed on click', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { container } = renderCard();
    fireEvent.change(screen.getByLabelText(labels.inputLabel), {
      target: { value: 'JA-REP-014' },
    });
    for (const a of container.querySelectorAll('a'))
      expect(a.getAttribute('href') ?? '').not.toContain('JA-REP');

    const call = screen.getByRole('link', { name: labels.resultCall });
    expect(call).toHaveAttribute('href', 'tel:+905011240340');
    call.addEventListener('click', (e) => e.preventDefault()); // jsdom cannot navigate to tel:
    fireEvent.click(call);
    expect(events('call_click')).toEqual([
      { event: 'call_click', page: '/', locale: 'en', placement: 'page_cta' },
    ]);

    const wa = screen.getByRole('link', { name: labels.resultWhatsapp });
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(wa);
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect(url.startsWith('https://wa.me/905011240340?text=')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(
      'Hello JobsAdmire, I want to check something about JA-REP-014',
    );
    expect([target, features]).toEqual(['_blank', 'noopener']);
    expect(events('whatsapp_click')).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'en', placement: 'page_cta' },
    ]);
  });

  it('V-1: a ?id= deep link prefills the query after hydration and answers at once', () => {
    window.history.replaceState(null, '', '/en/verify?id=JA-REP-001');
    renderCard();
    expect(screen.getByLabelText(labels.inputLabel)).toHaveValue('JA-REP-001');
    expect(screen.getByTestId('verify-lookup-result')).toHaveAttribute(
      'data-outcome',
      'register_unavailable',
    );
    expect(events('verify_lookup')).toHaveLength(1);
  });

  it('D17: the live pill and the updated line render only when the page passes them', () => {
    const { unmount } = renderCard();
    expect(screen.queryByTestId('verify-live-pill')).toBeNull();
    expect(screen.queryByTestId('verify-updated')).toBeNull();
    unmount();
    renderCard({
      livePill: '14 people authorised today',
      updatedLabel: 'Register last updated: 29 July 2026',
    });
    expect(screen.getByTestId('verify-live-pill')).toHaveTextContent('14 people authorised today');
    expect(screen.getByTestId('verify-updated')).toHaveTextContent('29 July 2026');
  });
});
```

`src/app/[locale]/(site)/verify/_components/__tests__/StepsDisclosure.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { StepsDisclosure } from '../StepsDisclosure';

describe('StepsDisclosure (D20: the design’s ≤ 700 px div-onClick fold, as a real button)', () => {
  it('is an h2 whose toggle is a button with aria-expanded/aria-controls over the panel', () => {
    renderWithIntl(
      <StepsDisclosure heading="Verify in one minute — 3 steps">
        <p>Ask for the badge</p>
      </StepsDisclosure>,
      { locale: 'en' },
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Verify in one minute — 3 steps',
    );
    const toggle = screen.getByRole('button', { name: 'Verify in one minute — 3 steps' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveTextContent('Ask for the badge');
    // closed: hidden below md; md:grid shows it from 701 px whatever the state
    expect(panel?.className).toMatch(/(^| )hidden( |$)/);
    expect(panel?.className).toContain('md:grid');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(panel?.className).toMatch(/(^| )grid( |$)/);
    expect(panel?.className).not.toMatch(/(^| )hidden( |$)/);
  });
});
```

`src/app/[locale]/(site)/verify/_components/__tests__/EvidenceUpload.test.tsx`:

```tsx
import { createEvent, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { EVIDENCE_MAX_BYTES, type EvidenceUploadResult } from '../../_lib/evidence';
import { EvidenceUpload } from '../EvidenceUpload';

const file = (name: string, type = 'image/png', size = 10) =>
  new File([new Uint8Array(size)], name, { type });

function deferred() {
  let resolve!: (r: EvidenceUploadResult) => void;
  const promise = new Promise<EvidenceUploadResult>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function setup(upload: (data: FormData) => Promise<EvidenceUploadResult>) {
  const spy = vi.fn(upload);
  renderWithIntl(
    <form data-testid="report">
      <EvidenceUpload upload={spy} />
    </form>,
    { locale: 'en' },
  );
  const input = screen.getByLabelText('Evidence files') as HTMLInputElement;
  const pick = (files: File[]) => fireEvent.change(input, { target: { files } });
  const keys = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="evidenceKeys"]'),
    ).map((i) => i.value);
  return { spy, input, pick, keys, form: screen.getByTestId('report') as HTMLFormElement };
}

describe('EvidenceUpload — one file per server-action call (W73/W101/W116)', () => {
  it('uploads each file alone, one after another, and keeps each key in a hidden evidenceKeys input', async () => {
    const first = deferred();
    const answers = [first.promise, Promise.resolve({ ok: true, key: 'website-fraud/b.pdf' } as const)];
    const { spy, input, pick, keys } = setup(() => answers.shift()!);
    expect(input).not.toHaveAttribute('name'); // the bytes never ride the report
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp,application/pdf');
    pick([file('a.png'), file('b.pdf', 'application/pdf')]);
    expect(await screen.findByText('Uploading a.png…')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1); // the second waits for the first
    first.resolve({ ok: true, key: 'website-fraud/a.png' });
    await waitFor(() => expect(keys()).toEqual(['website-fraud/a.png', 'website-fraud/b.pdf']));
    expect(spy).toHaveBeenCalledTimes(2);
    for (const [body] of spy.mock.calls) {
      const parts = Array.from((body as FormData).entries());
      expect(parts.map(([k]) => k)).toEqual(['file']);
    }
    expect(screen.getByText('a.png attached')).toBeInTheDocument();
  });

  it('refuses an over-cap file and a declared non-evidence type in the browser — no call', () => {
    const { spy, pick, keys } = setup(async () => ({ ok: true, key: 'website-fraud/x.png' }));
    pick([file('big.png', 'image/png', EVIDENCE_MAX_BYTES + 1), file('notes.txt', 'text/plain')]);
    expect(screen.getByText('big.png is larger than 3 MB. Choose a smaller file.')).toBeInTheDocument();
    expect(screen.getByText('notes.txt is not a JPEG, PNG, WEBP or PDF file.')).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
    expect(keys()).toEqual([]);
  });

  it('a door failure or a failed call reads failed, a door refusal reads refused; no key is kept', async () => {
    const answers: (() => Promise<EvidenceUploadResult>)[] = [
      async () => ({ ok: false, reason: 'door' }),
      async () => ({ ok: false, reason: 'file' }),
      async () => {
        throw new Error('network');
      },
    ];
    const { pick, keys } = setup(() => answers.shift()!());
    pick([file('a.png'), file('b.png'), file('c.png')]);
    expect(
      await screen.findByText(
        'a.png could not be uploaded right now. Send the report without it and share the file on WhatsApp.',
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText('b.png was not accepted. Check its type and size.')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'c.png could not be uploaded right now. Send the report without it and share the file on WhatsApp.',
      ),
    ).toBeInTheDocument();
    expect(keys()).toEqual([]);
  });

  it('three files at most: a fourth is not uploaded and the limit is announced', async () => {
    let n = 0;
    const { spy, pick, keys } = setup(async () => ({ ok: true, key: `website-fraud/k${++n}.png` }));
    pick([file('1.png'), file('2.png'), file('3.png'), file('4.png')]);
    expect(screen.getByText('Up to 3 files can be attached.')).toBeInTheDocument();
    await waitFor(() => expect(keys()).toHaveLength(3));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(screen.queryByText(/4\.png/)).toBeNull();
  });

  it('removing an attached file drops its key', async () => {
    const { pick, keys } = setup(async () => ({ ok: true, key: 'website-fraud/a.png' }));
    pick([file('a.png')]);
    await waitFor(() => expect(keys()).toEqual(['website-fraud/a.png']));
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    expect(keys()).toEqual([]);
    expect(screen.queryByText('a.png attached')).toBeNull();
  });

  it('holds the report while a file is uploading, then lets it through', async () => {
    const pending = deferred();
    const { pick, form, keys } = setup(() => pending.promise);
    pick([file('a.png')]);
    await screen.findByText('Uploading a.png…');
    const held = createEvent.submit(form);
    fireEvent(form, held);
    expect(held.defaultPrevented).toBe(true);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A file is still uploading. Send the report once it has finished.',
    );
    pending.resolve({ ok: true, key: 'website-fraud/a.png' });
    await waitFor(() => expect(keys()).toEqual(['website-fraud/a.png']));
    expect(screen.queryByRole('alert')).toBeNull();
    const released = createEvent.submit(form);
    fireEvent(form, released);
    expect(released.defaultPrevented).toBe(false);
  });
});
```

`src/app/[locale]/(site)/verify/_components/__tests__/RecordDialog.test.tsx`:

```tsx
import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { RECORD_DIALOG_ENABLED } from '../../_lib/flags';
import { FOUNDER_REP } from '../../_lib/__tests__/fixtures';
import RecordDialog, { type RecordLabels } from '../RecordDialog';

const labels: RecordLabels = {
  badgeQrHint: 'Scan the QR on their badge — it must open this same record.',
  authorisedUntil: 'Authorised until',
  noExpiry: 'No expiry',
  contact: 'Official contact',
  languages: 'Languages',
  reportsTo: 'Reports to',
  withJobsAdmire: 'With JobsAdmire',
  desk: 'Desk',
  soleSignatory: 'Sole signatory',
  copyLink: 'Copy record link',
  copied: 'Link copied ✓',
  wrong: 'Something is wrong →',
  close: 'Close the record',
  status: { active: 'Authorised', suspended: 'Suspended', former: 'No longer authorised' },
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

function renderDialog(record = FOUNDER_REP, onClose = vi.fn()) {
  renderWithIntl(
    <RecordDialog
      open
      record={record}
      labels={labels}
      recordUrl="/en/verify?id=JA-REP-001"
      whatsappNumber="905011240340"
      onClose={onClose}
    />,
    { locale: 'en' },
  );
  return onClose;
}

describe('RecordDialog (the v1.1 scaffold)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is off in Phase A', () => {
    expect(RECORD_DIALOG_ENABLED).toBe(false);
  });

  it('is a named dialog: status header, identity, meta, copy link, close', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onClose = renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Founder Example');
    expect(dialog).toHaveTextContent('JA-REP-001');
    expect(dialog).toHaveTextContent('Authorised');
    expect(dialog).toHaveTextContent('Sole signatory');
    expect(dialog).toHaveTextContent('No expiry');
    expect(dialog).toHaveTextContent('Antalya');
    fireEvent.click(screen.getByRole('button', { name: 'Copy record link' }));
    expect(writeText).toHaveBeenCalledWith('http://localhost:3000/en/verify?id=JA-REP-001');
    expect(await screen.findByText('Link copied ✓')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close the record' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('W95: "Something is wrong" is a bare wa.me href; the record id joins the chat on click', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderDialog();
    const wrong = screen.getByRole('link', { name: 'Something is wrong →' });
    expect(wrong).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(wrong);
    expect(decodeURIComponent((open.mock.calls[0] as [string])[0])).toContain(
      'Hello JobsAdmire, I want to check something about JA-REP-001',
    );
  });

  it('never fails open: a former record shows the former label and no signatory pill', () => {
    renderDialog({ ...FOUNDER_REP, status: 'former', canSign: false });
    expect(screen.getByRole('dialog')).toHaveTextContent('No longer authorised');
    expect(screen.queryByText('Sole signatory')).toBeNull();
  });
});
```

(`http://localhost:3000` is jsdom's default document URL under this repo's Vitest config; if `window.location.href` differs in your run, assert with `expect.stringMatching(/\/en\/verify\?id=JA-REP-001$/)` instead — the dialog resolves the relative record URL against the page it is on.)

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/verify/_components"
```
Expected: all four files FAIL to import (`Cannot find module '../LookupCard'`, `'../StepsDisclosure'`, `'../EvidenceUpload'`, `'../RecordDialog'`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/_components/icons.tsx` (no directive — plain SVG, imported by server sections and islands alike):

```tsx
/** Page glyphs (decorative: the text beside each carries the meaning, D20). The chrome's
 *  `XIcon` is the X/Twitter mark, so the cross and the warning sign live here. */
type IconProps = { size?: number; className?: string };

export function CrossIcon({ size = 13, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.4}
      strokeLinecap="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function WarningIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </svg>
  );
}

export function ChevronIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
```

`src/app/[locale]/(site)/verify/_components/RecordDialog.tsx`:

```tsx
'use client';
import { useState, type MouseEvent } from 'react';
import { useContactClick } from '@/analytics/useContactClick';
import { Dialog } from '@/design/primitives/Dialog';
import { waLink } from '@/lib/contact';
import type { Representative, RepresentativeStatus } from '../_lib/register';

/** Every label is a prop (W9/W148 — this island calls no `useTranslations`); the Hero section
 *  resolves them only while `RECORD_DIALOG_ENABLED`. */
export type RecordLabels = {
  badgeQrHint: string; // verify.110
  authorisedUntil: string; // verify.111
  noExpiry: string; // verify.241
  contact: string; // verify.112
  languages: string; // verify.113
  reportsTo: string; // verify.114
  withJobsAdmire: string; // verify.115
  desk: string; // verify.116
  soleSignatory: string; // verify.060
  copyLink: string; // verify.226
  copied: string; // verify.267
  wrong: string; // verify.239
  close: string; // sys.verify.record.close
  status: Record<RepresentativeStatus, string>; // verify.046 · verify.259 · sys.verify.record.former
  whatsappIntro: string; // verify.228
};

/** Fail closed (D9): the header comes from the status enum — there is no default face, and every
 *  face keeps white text at ≥ 4.5:1 (D20: the design's #16a34a / #d97706 heads were 3.3:1 / 2.9:1). */
const HEAD: Record<RepresentativeStatus, string> = {
  active: 'bg-success-text',
  suspended: 'bg-warning-text',
  former: 'bg-danger',
};

/**
 * D9 v1.1 — the record view behind `RECORD_DIALOG_ENABLED` (a lazy chunk `LookupCard` never
 * fetches in Phase A). The real `Dialog` primitive supplies what the design's modal lacked:
 * `role="dialog"`, `aria-modal`, the focus trap, Escape and focus restore. Not scaffolded: the
 * badge QR (v1.1: the record handler renders it with `qrSvg`), the level-keyed "May do / May
 * never" lists (verify.117/118, 198–218), and "Print badge" (V-6 — Operations prints badges).
 */
export default function RecordDialog({
  open,
  record,
  labels,
  recordUrl,
  whatsappNumber,
  onClose,
}: {
  open: boolean;
  record: Representative;
  labels: RecordLabels;
  /** V-1: the record's permanent `?id=` URL on this route (what the badge QR will encode). */
  recordUrl: string;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const fireContact = useContactClick('page_cta');
  const [copied, setCopied] = useState(false);
  const titleId = `record-${record.id}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(recordUrl, window.location.href).toString());
      setCopied(true);
    } catch {
      /* clipboard blocked: the address bar still holds the link */
    }
  };
  // W95: the id arrived through the visitor's lookup, so the chat is composed on click and the
  // DOM href stays the bare chat.
  const reportWrong = (e: MouseEvent<HTMLAnchorElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(
      waLink(whatsappNumber, `${labels.whatsappIntro} ${record.id}`),
      '_blank',
      'noopener',
    );
  };
  const meta: [string, string][] = [
    [labels.authorisedUntil, record.validUntil ?? labels.noExpiry],
    [labels.contact, record.contact ?? '—'],
    [labels.languages, record.languages.join(', ') || '—'],
    [labels.reportsTo, record.reportsTo ?? '—'],
    [labels.withJobsAdmire, record.since ?? '—'],
    [labels.desk, record.desk ?? '—'],
  ];
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId}>
      <div
        className={`-mx-6 -mt-6 mb-4 flex items-center justify-between px-6 py-3 text-white ${HEAD[record.status]}`}
      >
        <span className="text-body-sm font-extrabold uppercase tracking-[1.2px]">
          {labels.status[record.status]}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-body-sm font-extrabold">{record.id}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="flex size-11 items-center justify-center rounded-pill border border-white/40 bg-white/15 text-body font-extrabold hover:bg-white hover:text-ink"
          >
            ×
          </button>
        </span>
      </div>
      <h2 id={titleId} className="m-0 text-card-title">
        {record.name}
      </h2>
      <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">{record.role}</p>
      <p className="mt-0.5 mb-0 text-body-sm text-text-tertiary">
        {record.city}, {record.country}
      </p>
      {record.canSign && record.status === 'active' ? (
        <p className="mt-2 mb-0 inline-flex rounded-pill bg-navy px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[0.6px] text-white">
          {labels.soleSignatory}
        </p>
      ) : null}
      <p className="mt-3 mb-0 text-body-sm text-text-tertiary">{labels.badgeQrHint}</p>
      <dl className="mt-4 mb-0 grid grid-cols-2 gap-3 md:grid-cols-3">
        {meta.map(([term, value]) => (
          <div key={term} className="rounded-xs border border-border-1 bg-pale-1 p-3">
            <dt className="text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">
              {term}
            </dt>
            <dd className="m-0 mt-1 text-body-sm font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-1 pt-4">
        <button
          type="button"
          onClick={() => void copy()}
          className="min-h-[44px] text-body-sm font-extrabold text-blue-safe underline"
        >
          {labels.copyLink}
        </button>
        <span role="status" className="text-body-sm font-bold text-success-text">
          {copied ? labels.copied : ''}
        </span>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={reportWrong}
          className="ml-auto text-body-sm font-extrabold text-danger"
        >
          {labels.wrong}
        </a>
      </div>
    </Dialog>
  );
}
```

`src/app/[locale]/(site)/verify/_components/LookupCard.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { track } from '@/analytics/track';
import { useContactClick } from '@/analytics/useContactClick';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { telLink, waLink } from '@/lib/contact';
import { RECORD_DIALOG_ENABLED } from '../_lib/flags';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId, splitAtQuery } from '../_lib/lookup';
import type { Representative } from '../_lib/register';
import type { RecordLabels } from './RecordDialog';

// The v1.1 chunk. `ssr: false` is legal only because this module is 'use client' (§6); declared
// here so the flag flip is one line — never fetched while RECORD_DIALOG_ENABLED is false.
const RecordDialog = dynamic(() => import('./RecordDialog'), { ssr: false });

/** Every label arrives resolved (W9/W148): this island calls no `useTranslations`. */
export type LookupLabels = {
  heading: string; // verify.031
  inputLabel: string; // verify.032
  hint: string; // sys.verify.lookup.hint, {min} filled on the server
  clear: string; // verify.033
  callOffice: string; // verify.034
  note: string; // verify.035
  resultTitle: string; // sys.verify.lookup.resultTitle
  resultBody: string; // sys.verify.lookup.resultBody, RAW — split here at {query}
  resultCall: string; // verify.051
  resultWhatsapp: string; // sys.verify.lookup.whatsapp
  whatsappIntro: string; // verify.228 — the visitor's own opening line
};

export type LookupCardProps = {
  labels: LookupLabels;
  phone: string;
  whatsappNumber: string;
  /** `<n> people authorised today` from the register rows; null hides it (W6/D17). */
  livePill: string | null;
  /** `Register last updated: <date>` from the rows; null hides it (D17 — never "today"). */
  updatedLabel: string | null;
  /** Resolved only while RECORD_DIALOG_ENABLED (v1.1); null in Phase A. */
  recordLabels: RecordLabels | null;
};

/** The one outcome Phase A can have (W6/W67): there is no published register to match. */
const OUTCOME = 'register_unavailable' as const;

const subscribeNoop = () => () => {};
const readClientDeepLink = () => readDeepLinkId(window.location.search, window.location.hash);
const readServerDeepLink = () => null;

const INPUT =
  'min-h-[52px] w-full rounded-xs border border-border-1 bg-pale-3 px-4 text-body font-extrabold tracking-[0.02em] text-ink focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/**
 * The authority check (`#check`). Phase A (W6): no register is published, so every query of three
 * characters or more answers the NEUTRAL "not published yet — verify with the office" card with
 * the office's phone and WhatsApp; the design's red "Not on our authorised list" verdict
 * (verify.048–050) is a legal claim about a person and never renders. Client-only: nothing is
 * stored, nothing is fetched, Operations is never called (D6); the query leaves the page only
 * inside the WhatsApp message the visitor sends themselves (composed on click, W95).
 */
export function LookupCard({
  labels,
  phone,
  whatsappNumber,
  livePill,
  updatedLabel,
  recordLabels,
}: LookupCardProps) {
  const locale = useLocale();
  // R35: the real URL path, never next-intl's internal key.
  const page = usePathname() ?? '/';
  const fireContact = useContactClick('page_cta');
  const inputId = useId();
  const hintId = `${inputId}-hint`;

  // V-1: the deep link is a browser fact read after hydration (R18 — the server and the
  // hydrating client both see null: no mismatch, no setState in an effect). Once the visitor
  // types, `typed` wins; Clear sets '' (not null) so the URL's id does not come back.
  const deepLink = useSyncExternalStore(subscribeNoop, readClientDeepLink, readServerDeepLink);
  const [typed, setTyped] = useState<string | null>(null);
  const raw = typed ?? deepLink ?? '';
  const query = normaliseQuery(raw);
  const showResult = query.length >= LOOKUP_MIN_CHARS;
  const body = splitAtQuery(labels.resultBody);

  // v1.1: set by the record fetch (the website's own no-store handler, V-1); null in Phase A.
  const [record, setRecord] = useState<Representative | null>(null);

  // One event per query session: fires when the answer first appears, re-arms on clear.
  const fired = useRef(false);
  useEffect(() => {
    if (!showResult) {
      fired.current = false;
      return;
    }
    if (fired.current) return;
    fired.current = true;
    track('verify_lookup', { page, locale, outcome: OUTCOME });
  }, [showResult, page, locale]);

  const clear = () => setTyped('');

  // W95: the prefill carries what the visitor typed, so the DOM href is the bare chat and the
  // prefilled URL is composed on click (the FallbackPanel contract).
  const askOnWhatsApp = (e: MouseEvent<HTMLElement>) => {
    fireContact('whatsapp');
    e.preventDefault();
    window.open(waLink(whatsappNumber, `${labels.whatsappIntro} ${query}`), '_blank', 'noopener');
  };

  return (
    <div
      id="check"
      data-testid="verify-check"
      className="scroll-mt-24 overflow-hidden rounded-lg bg-white text-ink shadow-hero-form"
    >
      <div
        aria-hidden="true"
        className="h-1 bg-[linear-gradient(90deg,#1899d5_55%,#d8ecf7_45%)] bg-[length:18px_4px]"
      />
      <div className="px-7 pt-6 pb-1.5">
        <h2 className="m-0 text-card-title tracking-[-0.02em]">{labels.heading}</h2>
        {livePill ? (
          <p
            data-testid="verify-live-pill"
            className="mt-2 mb-0 inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-bold text-success-text"
          >
            <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
            {livePill}
          </p>
        ) : null}
      </div>
      <div className="px-7 pt-5 pb-7">
        <label
          htmlFor={inputId}
          className="mb-2 block text-eyebrow font-extrabold uppercase tracking-[1.2px] text-text-tertiary"
        >
          {labels.inputLabel}
        </label>
        <input
          id={inputId}
          type="text"
          value={raw}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') clear();
          }}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-describedby={hintId}
          className={INPUT}
        />
        <p id={hintId} className="mt-1.5 mb-0 text-body-sm text-text-tertiary">
          {labels.hint}
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button type="button" onClick={clear} className={buttonClassName('secondary')}>
            {labels.clear}
          </button>
          <ContactLink
            href={telLink(phone)}
            placement="page_cta"
            className={buttonClassName('secondary')}
          >
            {labels.callOffice}
          </ContactLink>
        </div>

        {/* Announced once when the answer appears — the echo below changes on every keystroke. */}
        <p role="status" className="sr-only">
          {showResult ? labels.resultTitle : ''}
        </p>
        {showResult ? (
          <div
            data-testid="verify-lookup-result"
            data-outcome={OUTCOME}
            className="mt-5 rounded-base border border-warning-border bg-warning-surface p-5"
          >
            <p className="m-0 text-body-lg font-extrabold">{labels.resultTitle}</p>
            <p className="mt-2 mb-0 text-body-sm text-text-secondary">
              {body.before}
              {body.hasQuery ? <strong className="text-ink">{query}</strong> : null}
              {body.after}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <ContactLink
                href={telLink(phone)}
                placement="page_cta"
                className={buttonClassName('primary')}
              >
                {labels.resultCall}
              </ContactLink>
              <Button
                variant="success"
                href={`https://wa.me/${whatsappNumber}`}
                external
                onClick={askOnWhatsApp}
              >
                {labels.resultWhatsapp}
              </Button>
            </div>
          </div>
        ) : null}

        <p className="mt-5 mb-0 border-t border-dashed border-border-1 pt-4 text-body-sm text-text-tertiary">
          {labels.note}
        </p>
        {updatedLabel ? (
          <p
            data-testid="verify-updated"
            className="mt-3 mb-0 text-body-sm font-extrabold text-text-tertiary"
          >
            {updatedLabel}
          </p>
        ) : null}
      </div>

      {RECORD_DIALOG_ENABLED && record && recordLabels ? (
        <RecordDialog
          open
          record={record}
          labels={recordLabels}
          recordUrl={`${page}?id=${encodeURIComponent(record.id)}`}
          whatsappNumber={whatsappNumber}
          onClose={() => setRecord(null)}
        />
      ) : null}
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/_components/StepsDisclosure.tsx`:

```tsx
'use client';
import { useId, useState, type ReactNode } from 'react';
import { ChevronIcon } from './icons';

/**
 * "Verify in one minute — 3 steps". The design folds the three cards behind a non-focusable
 * `div onClick` at ≤ 700 px; this is the same fold as a real disclosure button (D20). The cards
 * are server-rendered children, so their copy is in the HTML at every width; from 701 px the
 * panel always shows (`md:grid`) and the toggle is hidden (`md:hidden`).
 */
export function StepsDisclosure({ heading, children }: { heading: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="mt-11 border-t border-white/15 pt-8">
      <h2 className="m-0 flex items-center gap-2.5 text-eyebrow font-extrabold uppercase tracking-[1.4px] text-sky">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-blue" />
        <span className="max-md:hidden">{heading}</span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-[44px] items-center gap-2 text-left uppercase md:hidden"
        >
          {heading}
          <ChevronIcon className={open ? 'rotate-180' : undefined} />
        </button>
      </h2>
      <div id={panelId} className={`${open ? 'grid' : 'hidden'} mt-4 gap-4 md:grid md:grid-cols-3`}>
        {children}
      </div>
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/_components/EvidenceUpload.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { FormField } from '@/design/primitives/FormField';
import { useFieldError, useFieldId, useRegisterField } from '@/forms/client/FormErrorsContext';
import {
  checkEvidence,
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_FILES,
  EVIDENCE_MAX_MB,
  type EvidenceUploadResult,
  type UploadEvidenceAction,
} from '../_lib/evidence';

type ItemState = 'uploading' | 'attached' | 'tooBig' | 'badType' | 'refused' | 'failed';
type Item = { id: string; name: string; state: ItemState; key?: string };

/** The catalog wire name the hidden inputs carry; the file input itself has NO name (W101). */
const KEYS_FIELD = 'evidenceKeys';

const FILE_INPUT =
  'block w-full rounded-input border border-border-1 bg-white p-2 text-body-sm text-ink file:mr-3 file:min-h-[36px] file:cursor-pointer file:rounded-pill file:border-0 file:bg-tint file:px-4 file:font-bold file:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe aria-[invalid=true]:border-danger';

const TONE: Record<ItemState, string> = {
  uploading: 'text-text-secondary',
  attached: 'text-success-text',
  tooBig: 'text-danger',
  badType: 'text-danger',
  refused: 'text-danger',
  failed: 'text-danger',
};

/**
 * The fraud form's evidence (W29/W73/W101/W116): an UNNAMED file input — the bytes never ride
 * the report — whose picked files are checked in the browser (3 MiB, JPEG/PNG/WEBP/PDF, three at
 * most — `_lib/evidence.ts`, pinned to `@/forms/uploads`) and posted ONE PER SERVER-ACTION CALL,
 * one after another, to the page's `uploadEvidence`; each returned key becomes a hidden
 * `evidenceKeys` input the report then sends. While a file is in flight the report is held (a
 * native `submit` listener cancels it before React dispatches the action — the check FormShell's
 * double-submit guard relies on) and `sys.form.evidence.wait` says why. A kept key whose report
 * is never sent is an orphan the Operations purge removes after 7 days.
 */
export function EvidenceUpload({ upload }: { upload: UploadEvidenceAction }) {
  const sys = useTranslations('sys');
  const inputId = useFieldId('evidence');
  const error = useFieldError(KEYS_FIELD);
  useRegisterField(KEYS_FIELD);
  const inputRef = useRef<HTMLInputElement>(null);
  const seq = useRef(0);
  const [items, setItems] = useState<Item[]>([]);
  const [tooMany, setTooMany] = useState(false);
  const [held, setHeld] = useState(false);
  const uploading = items.some((i) => i.state === 'uploading');
  const taken = items.filter((i) => i.state === 'uploading' || i.state === 'attached').length;

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || !uploading) return;
    const hold = (e: SubmitEvent) => {
      e.preventDefault();
      setHeld(true);
    };
    form.addEventListener('submit', hold);
    return () => form.removeEventListener('submit', hold);
  }, [uploading]);

  const settle = (id: string, result: EvidenceUploadResult) =>
    setItems((prev) =>
      prev.map((i): Item => {
        if (i.id !== id) return i;
        if (result.ok) return { ...i, state: 'attached', key: result.key };
        return { ...i, state: result.reason === 'file' ? 'refused' : 'failed' };
      }),
    );

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const picked = Array.from(input.files ?? []);
    input.value = ''; // the same file can be picked again after a removal
    setHeld(false);
    const next = (name: string, state: ItemState): Item => {
      seq.current += 1;
      return { id: `evidence-${seq.current}`, name, state };
    };
    const checked = picked.map((file) => ({ file, check: checkEvidence(file) }));
    const fine = checked.filter((c) => c.check === 'ok').map((c) => c.file);
    const room = Math.max(0, EVIDENCE_MAX_FILES - taken);
    setTooMany(fine.length > room);
    const refused = checked.flatMap((c) =>
      c.check === 'tooBig' || c.check === 'badType' ? [next(c.file.name, c.check)] : [],
    );
    const queue = fine.slice(0, room).map((file) => ({ file, item: next(file.name, 'uploading') }));
    setItems((prev) => [...prev, ...refused, ...queue.map((q) => q.item)]);
    // Sequential on purpose: one file per server-action call (W73/W101).
    for (const { file, item } of queue) {
      const body = new FormData();
      body.append('file', file, file.name);
      let result: EvidenceUploadResult;
      try {
        result = await upload(body);
      } catch {
        // the browser → Vercel call itself failed (flaky data, a body over the limit)
        result = { ok: false, reason: 'door' };
      }
      settle(item.id, result);
    }
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const kept = items.filter((i): i is Item & { key: string } => i.state === 'attached' && !!i.key);

  return (
    <div className="flex flex-col gap-2" data-testid="fraud-evidence">
      <FormField
        id={inputId}
        label={sys('form.labels.evidence')}
        hint={sys('form.hints.evidence')}
        error={error}
      >
        {(p) => (
          <input
            {...p}
            ref={inputRef}
            type="file"
            multiple
            accept={EVIDENCE_ACCEPT}
            onChange={(e) => void onPick(e)}
            className={FILE_INPUT}
          />
        )}
      </FormField>
      <div role="status" className="flex flex-col gap-1.5">
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xs border border-border-1 bg-pale-1 px-3 py-1 text-body-sm"
            >
              <span className={`min-w-0 break-words ${TONE[item.state]}`}>
                {sys(`form.evidence.${item.state}`, { name: item.name, maxMb: EVIDENCE_MAX_MB })}
              </span>
              {item.state === 'uploading' ? null : (
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={sys('form.evidence.remove', { name: item.name })}
                  className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-pill text-body font-extrabold text-text-secondary hover:bg-white"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
        {tooMany ? (
          <p className="m-0 text-body-sm font-bold text-danger">
            {sys('form.evidence.tooMany', { max: EVIDENCE_MAX_FILES })}
          </p>
        ) : null}
      </div>
      {held && uploading ? (
        <p role="alert" className="m-0 text-body-sm font-bold text-danger">
          {sys('form.evidence.wait')}
        </p>
      ) : null}
      {kept.map((i) => (
        <input key={i.id} type="hidden" name={KEYS_FIELD} value={i.key} />
      ))}
    </div>
  );
}
```

`docs/ARCHITECTURE.md` — § Forms flow, the bullet that begins "- **Uploads (W29, `src/forms/uploads.ts`):**": append at its end, after its last sentence ("One attempt each — no retry re-uploads bytes."):

```markdown
 **As built on the Verify page (WP2b T10):** `EvidenceUpload` (`src/app/[locale]/(site)/verify/_components/EvidenceUpload.tsx`) is an unnamed file input — the bytes never ride the report — that checks each picked file in the browser (`_lib/evidence.ts` mirrors the 3 MiB / three-file caps and is pinned to `uploads.ts` by a test), posts it alone to the page's `'use server'` `uploadEvidence` — which calls `uploadFraudEvidence(file, visitorOf(await headers()))` (`visitorOf` is exported from `src/forms/action.ts` for exactly this — one keyword, additive, so the standalone per-file upload hands the door the same visitor as the kernel; the upload is deliberately not routed through `createFormAction`, which checks consent, posts an envelope and redirects — W170) and answers `{ ok: true, key }` or `{ ok: false, reason: 'file' | 'door' }` — and renders one hidden `evidenceKeys` input per kept key. While a file is in flight a native `submit` listener on the form cancels the report (`preventDefault()` before React dispatches the action — the same check `FormShell`'s double-submit guard relies on) and shows `sys.form.evidence.wait`. A key whose report is never sent is an orphan the Operations purge removes after 7 days; the upload action has no Turnstile of its own (the single-use token belongs to the report) — it is bounded by the 3 MiB cap, the door's sniffer and that purge.
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/verify" docs/ARCHITECTURE.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `LookupCard.test.tsx` 6, `StepsDisclosure.test.tsx` 1, `EvidenceUpload.test.tsx` 6, `RecordDialog.test.tsx` 4 passed. The guards stay green: `client-messages.test.ts` (the only new client `sys(...)` reads are `EvidenceUpload`'s `form.*` — the template key `form.evidence.${…}` resolves to `form`; `LookupCard`, `StepsDisclosure`, `RecordDialog` call no `useTranslations`), `client-imports.test.ts` (every import by module path; no client module reaches `@/forms/uploads`, a message catalogue or `formatReadMinutes`), `class-collisions.test.ts` (`INPUT`, `FILE_INPUT`, `TONE[…]`, `HEAD[…]`, the `hidden`/`grid` + `md:grid` toggle, `buttonClassName('primary' | 'secondary')` with no caller class, `max-md:hidden` / `md:hidden` on spans), `rsc-imports.test.ts`. ESLint is clean under the React Compiler rules: no `setState` in an effect body (the deep link goes through `useSyncExternalStore`; `setHeld` runs inside the native listener; the lookup event is `track()` with a ref guard), no ref read during render.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/verify/_components" docs/ARCHITECTURE.md && git commit -m "feat(verify): lookup island (neutral W6 answer, ?id= deep link, verify_lookup, click-time WhatsApp), steps disclosure, per-file evidence upload, record Dialog scaffold (T10 c3)

W6/W67: every lookup answers register_unavailable, never the red verdict; W95: no visitor data in
a DOM href; W101/W73: one evidence file per server-action call, keys in hidden inputs, the
report held while a file uploads; D9 v1.1: the record dialog is a lazy chunk behind
RECORD_DIALOG_ENABLED=false; W148: only sys.form is read client-side.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — the four sections, the page, the route wiring (W20/W21), the package-id check; the SEO / analytics / PRD / architecture / content-model docs

- [ ] **Step 1: Write the failing tests**

`src/app/[locale]/(site)/verify/_sections/__tests__/sections.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IDLE_FORM_STATE } from '@/forms/types';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { collisionsInTree } from '@/test/class-collisions';
import { renderWithIntl } from '@/test/render';
import { localBundle } from '../../_lib/__tests__/bundles';
import {
  FORMER_REP,
  FOUNDER_REP,
  OFFICE_REP,
  PUBLISHED_FOUNDER,
} from '../../_lib/__tests__/fixtures';
import { readRegister } from '../../_lib/register';
import { Faq } from '../Faq';
import { Hero } from '../Hero';
import { Report } from '../Report';
import { Structure } from '../Structure';

// LookupCard declares the v1.1 record dialog through next/dynamic; never loaded here.
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const SYS = { tr: tr.sys, en: en.sys } as const;
const LOCALES = ['tr', 'en'] as const;
const homeHref = (locale: 'tr' | 'en') => (locale === 'tr' ? '/' : '/en');

describe('Hero', () => {
  for (const locale of LOCALES) {
    it(`${locale}: one h1 holding the only LCP slot, this page’s crumbs (W109), the name-less lead (W86), three ticks, #check, three steps`, () => {
      const bundle = localBundle(locale);
      const s = bundle.strings;
      const { container } = renderWithIntl(
        <Hero
          bundle={bundle}
          locale={locale}
          register={readRegister(bundle)}
          founder={null}
          updatedLabel={null}
        />,
        { locale },
      );
      const h1 = screen.getByTestId('page-h1');
      expect(h1.tagName).toBe('H1');
      expect(h1).toHaveTextContent(`${s['verify.023']} ${s['verify.024']}`);
      expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
      expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
      const crumbs = screen.getByRole('navigation', { name: SYS[locale].nav.breadcrumbs });
      expect(within(crumbs).getByRole('link', { name: s['verify.021'] })).toHaveAttribute(
        'href',
        homeHref(locale),
      );
      expect(within(crumbs).getByText(s['verify.006'])).toHaveAttribute('aria-current', 'page');
      const lead = screen.getByTestId('verify-lead');
      expect(lead).toHaveTextContent(SYS[locale].verify.hero.lead);
      expect(lead).not.toHaveTextContent(s['verify.025']);
      for (const id of ['verify.027', 'verify.028', 'verify.029'])
        expect(screen.getByText(s[id])).toBeInTheDocument();
      expect(screen.getByRole('link', { name: s['verify.030'] })).toHaveAttribute(
        'href',
        '#structure',
      );
      expect(container.querySelectorAll('#check')).toHaveLength(1);
      expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
        s['verify.037'],
        s['verify.041'],
        s['verify.044'],
      ]);
      expect(container.querySelector('[data-placeholder]')).toBeNull();
      expect(collisionsInTree(container)).toEqual([]);
    });
  }

  it('§10 row 3: a published founder row switches the lead to verify.025 (desktop) / verify.026 (mobile)', () => {
    const bundle = localBundle('en');
    renderWithIntl(
      <Hero
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={PUBLISHED_FOUNDER}
        updatedLabel={null}
      />,
      { locale: 'en' },
    );
    const lead = screen.getByTestId('verify-lead');
    expect(lead).toHaveTextContent(bundle.strings['verify.025']);
    expect(lead).toHaveTextContent(bundle.strings['verify.026']);
    expect(lead).not.toHaveTextContent(en.sys.verify.hero.lead);
  });
});

describe('Structure', () => {
  it('Phase A: the designed empty state — no stats, founder, register, former strip or verify.056 (W6/W86)', () => {
    const bundle = localBundle('en');
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Structure
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={null}
        updatedLabel={null}
      />,
      { locale: 'en' },
    );
    expect(container.querySelector('section#structure')).not.toBeNull();
    const empty = screen.getByTestId('verify-empty');
    expect(empty).toHaveAttribute('role', 'status');
    expect(empty).toHaveTextContent(en.sys.verify.empty.title);
    expect(within(empty).getByRole('link', { name: s['verify.051'] })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    for (const id of ['verify-stats', 'verify-founder', 'verify-register', 'verify-former'])
      expect(screen.queryByTestId(id)).toBeNull();
    expect(container).not.toHaveTextContent(s['verify.056']);
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    expect(screen.getByRole('link', { name: s['verify.076'] })).toHaveAttribute(
      'href',
      '/en/partner-with-us',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('v1.1 rows + a published founder: stats, the founder id and record link, the list, the former strip, verify.056', () => {
    const bundle = localBundle('en', { representatives: [FOUNDER_REP, OFFICE_REP, FORMER_REP] });
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Structure
        bundle={bundle}
        locale="en"
        register={readRegister(bundle)}
        founder={PUBLISHED_FOUNDER}
        updatedLabel="Register last updated: 29 July 2026"
      />,
      { locale: 'en' },
    );
    expect(screen.queryByTestId('verify-empty')).toBeNull();
    expect(screen.getByTestId('verify-stats')).toHaveTextContent(
      'Register last updated: 29 July 2026',
    );
    const founder = screen.getByTestId('verify-founder');
    expect(founder).toHaveTextContent('Founder Example');
    expect(founder).toHaveTextContent(s['about.047']);
    expect(founder).toHaveTextContent('JA-REP-001');
    expect(within(founder).getByRole('link', { name: s['verify.062'] })).toHaveAttribute(
      'href',
      '/en/verify?id=JA-REP-001',
    );
    expect(founder.querySelector('[data-placeholder="founder-photo"]')).not.toBeNull();
    // the header row + the two active people
    expect(within(screen.getByTestId('verify-register')).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByTestId('verify-former')).toHaveTextContent('Former Example · JA-REP-018');
    expect(container).toHaveTextContent(s['verify.056']);
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Report', () => {
  it('tr: #report, five flags, the fraud form on the catalog names with the package labels (W115), the unnamed evidence input, the two doors', () => {
    const bundle = localBundle('tr');
    const s = bundle.strings;
    const { container } = renderWithIntl(
      <Report
        bundle={bundle}
        locale="tr"
        submitFraud={vi.fn(async () => IDLE_FORM_STATE)}
        uploadEvidence={vi.fn(async () => ({ ok: false, reason: 'door' }) as const)}
      />,
      { locale: 'tr' },
    );
    expect(container.querySelectorAll('#report')).toHaveLength(1);
    expect(container.querySelector('section#report')).not.toBeNull();
    const flagsCard = screen.getByRole('heading', { name: s['verify.080'] }).parentElement;
    expect(flagsCard?.querySelectorAll('li')).toHaveLength(5);

    const form = screen.getByTestId('fraud-form');
    expect(form).toHaveAttribute('data-form-key', 'fraud');
    const named = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]'),
    )
      .map((el) => el.name)
      .filter((n) => n !== 'honeypot' && n !== 'consent');
    expect(named).toEqual([
      'suspectName',
      'suspectContact',
      'description',
      'reporterName',
      'reporterEmail',
      'reporterPhone',
    ]);
    const labelOf = (name: string) =>
      form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.labels?.[0]?.textContent ?? '';
    expect(labelOf('suspectName')).toContain(s['verify.094']);
    expect(labelOf('suspectContact')).toContain(s['verify.095']);
    expect(labelOf('description')).toContain(s['verify.096']);
    expect(labelOf('reporterName')).toContain(tr.sys.form.labels.reporterName);
    expect(labelOf('reporterEmail')).toContain(tr.sys.form.labels.reporterEmail);
    const description = form.querySelector('textarea[name="description"]');
    expect(description).toHaveAttribute('minlength', '20');
    expect(description).toHaveAttribute('maxlength', '5000');
    const evidence = screen.getByLabelText(tr.sys.form.labels.evidence);
    expect(evidence).toHaveAttribute('type', 'file');
    expect(evidence).not.toHaveAttribute('name');
    expect(form.querySelector('#f-fraud-consent')).not.toBeNull();
    expect(screen.getByRole('button', { name: tr.sys.verify.report.submit })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.getByRole('link', { name: s['verify.097'] })).toHaveAttribute(
      'href',
      `https://wa.me/905011240340?text=${encodeURIComponent(s['verify.229'])}`,
    );
    expect(screen.getByRole('link', { name: s['verify.051'] })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(collisionsInTree(container)).toEqual([]);
  });
});

describe('Faq', () => {
  const faqNode = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
      .map(
        (el) =>
          JSON.parse(el.textContent ?? '{}') as {
            '@type'?: string;
            mainEntity?: { name: string; acceptedAnswer: { text: string } }[];
          },
      )
      .filter((n) => n['@type'] === 'FAQPage');

  it('four pairs in the DOM and one FAQPage node (V-4); the "who signs" answer is name-less while the founder is unpublished (§10 row 3)', () => {
    const bundle = localBundle('en');
    const s = bundle.strings;
    const { container } = renderWithIntl(<Faq bundle={bundle} locale="en" founder={null} />, {
      locale: 'en',
    });
    expect(container.querySelectorAll('#faq')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(s['verify.100']);
    for (const id of ['verify.101', 'verify.103', 'verify.105', 'verify.107'])
      expect(screen.getByRole('button', { name: s[id] })).toBeInTheDocument();
    const faq = faqNode(container);
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity?.map((q) => q.name)).toEqual([
      s['verify.101'],
      s['verify.103'],
      s['verify.105'],
      s['verify.107'],
    ]);
    expect(faq[0].mainEntity?.[1].acceptedAnswer.text).toBe(en.sys.verify.faq.whoSigns);
    expect(container).not.toHaveTextContent(s['verify.104']);
    expect(collisionsInTree(container)).toEqual([]);
  });

  it('a published founder row answers with verify.104', () => {
    const bundle = localBundle('en');
    const { container } = renderWithIntl(
      <Faq bundle={bundle} locale="en" founder={PUBLISHED_FOUNDER} />,
      { locale: 'en' },
    );
    expect(faqNode(container)[0].mainEntity?.[1].acceptedAnswer.text).toBe(
      bundle.strings['verify.104'],
    );
  });
});
```

`src/app/[locale]/(site)/verify/_lib/__tests__/ids.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { localBundle } from './bundles';

const ROUTE = join(process.cwd(), 'src', 'app', '[locale]', '(site)', 'verify');

/** Every non-test module of the route. */
function sources(dir = ROUTE): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** The package ids the route reads by exact id: every quoted `verify.NNN` literal. */
const READ = new Set(
  sources().flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/['"`](verify\.\d{3})['"`]/g)].map((m) => m[1]),
  ),
);

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);
const id = (n: number) => `verify.${String(n).padStart(3, '0')}`;

/** Never read here: the red verdict, its echo fragments and "Report this person" (W6); the
 *  mustache-token strings (`{{ queryEcho }}`, `{{ lastUpdatedLabel }}`); "Print badge" (V-6); the
 *  mobile red-flag fold (V-3); the CRM feed badges (the empty state replaces them); the staff-data
 *  sample rows (verify.148–197, 240, 242–258 — people, never copy). */
const NEVER = new Set(
  [48, 49, 50, 52, 119, 120, 219, 220, 221, 222, 230, 231, 235, 236, 266, 240]
    .concat(range(148, 197), range(242, 258))
    .map(id),
);

describe('the package ids this route reads (W9/R15)', () => {
  it('every id it reads exists in both committed bundles', () => {
    expect(READ.size).toBeGreaterThan(90);
    for (const locale of ['tr', 'en'] as const) {
      const strings = localBundle(locale).strings;
      expect(
        [...READ].filter((x) => strings[x] === undefined),
        locale,
      ).toEqual([]);
    }
  });

  it('never reads the red verdict, the mustache strings, print, the fold, the feed badges or the staff data', () => {
    expect([...READ].filter((x) => NEVER.has(x))).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 "src/app/[locale]/(site)/verify/_sections" "src/app/[locale]/(site)/verify/_lib/__tests__/ids.test.ts"
```
Expected: `sections.test.tsx` FAILS to import (`Cannot find module '../Faq'`, `'../Hero'`, `'../Report'`, `'../Structure'`); `ids.test.ts` fails its size assertion (only the islands exist yet — they read no package id; `expected 0 to be greater than 90`).

- [ ] **Step 3: Implement**

`src/app/[locale]/(site)/verify/_sections/Hero.tsx` (server component, synchronous — no directive):

```tsx
import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeT, makeTf } from '@/content/pure';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { CheckIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { LookupCard } from '../_components/LookupCard';
import type { RecordLabels } from '../_components/RecordDialog';
import { StepsDisclosure } from '../_components/StepsDisclosure';
import { RECORD_DIALOG_ENABLED } from '../_lib/flags';
import { LOOKUP_MIN_CHARS } from '../_lib/lookup';
import type { Register } from '../_lib/register';

const TICKS = ['verify.027', 'verify.028', 'verify.029'] as const;

/** The three "Verify in one minute" cards: the title and the body as the package's own fragments
 *  (plain lead, bold, plain tail — W23: composed only where the package splits the sentence).
 *  `glue` is '' where the tail brings its own punctuation (verify.234 starts with ". "). Step 2's
 *  badge is blue-safe, not the design's #1899d5 (white on it is 3.2:1 — D20). */
const STEPS = [
  {
    n: 1,
    titleId: 'verify.037',
    lead: 'verify.038',
    bold: 'verify.039',
    tail: 'verify.040',
    glue: ' ',
    badge: 'bg-[#253063]',
    strong: 'text-white',
  },
  {
    n: 2,
    titleId: 'verify.041',
    lead: 'verify.042',
    bold: 'verify.043',
    tail: 'verify.234',
    glue: '',
    badge: 'bg-blue-safe',
    strong: 'text-white',
  },
  {
    n: 3,
    titleId: 'verify.044',
    lead: 'verify.045',
    bold: 'verify.046',
    tail: 'verify.047',
    glue: ' ',
    badge: 'bg-success-text',
    strong: 'text-[#5ddfb0]',
  },
] as const;

/** The dark hero: crumbs, badge, h1 (the LCP element — no photograph), lead, ticks, the
 *  structure CTA, the lookup card (`#check`) and the three steps. */
export function Hero({
  bundle,
  locale,
  register,
  founder,
  updatedLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  register: Register;
  /** W86: the published founder row, or null — the lead switches on it (§10 row 3). */
  founder: Founder | null;
  updatedLabel: string | null;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  // W6/D17: the live pill exists only with register rows (a count + verify.224); null in Phase A.
  const livePill =
    register.active.length > 0
      ? `${formatInt(register.active.length, locale)} ${t('verify.224')}`
      : null;
  // D9 v1.1: resolved only while the dialog is enabled; null in Phase A.
  const recordLabels: RecordLabels | null = RECORD_DIALOG_ENABLED
    ? {
        badgeQrHint: t('verify.110'),
        authorisedUntil: t('verify.111'),
        noExpiry: t('verify.241'),
        contact: t('verify.112'),
        languages: t('verify.113'),
        reportsTo: t('verify.114'),
        withJobsAdmire: t('verify.115'),
        desk: t('verify.116'),
        soleSignatory: t('verify.060'),
        copyLink: t('verify.226'),
        copied: t('verify.267'),
        wrong: t('verify.239'),
        close: sys('verify.record.close'),
        status: {
          active: t('verify.046'),
          suspended: t('verify.259'),
          former: sys('verify.record.former'),
        },
        whatsappIntro: t('verify.228'),
      }
    : null;

  return (
    <section className="relative overflow-hidden bg-navy pb-14 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(24,153,213,0.2),transparent_60%)]"
      />
      <div className="container-site relative pt-7" data-testid="verify-hero">
        {/* W109: this package's own labels — verify.021 "Home", verify.006 the page's nav label. */}
        <Breadcrumbs
          locale={locale}
          tone="dark"
          items={[
            { name: t('verify.021'), href: '/' },
            { name: t('verify.006'), href: '/verify' },
          ]}
        />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <p className="mt-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/[0.07] px-4 py-2 text-body-sm font-bold text-white">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-success" />
              {/* W10: the desktop/mobile variants are CSS-gated, never conditionally rendered. */}
              <span className="max-md:hidden">{t('verify.001')}</span>
              <span className="md:hidden">{t('verify.022')}</span>
            </p>
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="m-0 text-h1 leading-[1.02] tracking-[-0.04em] text-white"
            >
              {t('verify.023')} <span className="text-sky">{t('verify.024')}</span>
            </h1>
            <p
              data-testid="verify-lead"
              className="mt-5 mb-0 max-w-[540px] text-body-lg text-white/75"
            >
              {founder ? (
                <>
                  <span className="max-md:hidden">{tf('verify.025')}</span>
                  <span className="md:hidden">{tf('verify.026')}</span>
                </>
              ) : (
                sys('verify.hero.lead')
              )}
            </p>
            <ul className="mt-6 mb-0 flex list-none flex-col gap-2.5 p-0">
              {TICKS.map((id) => (
                <li key={id} className="flex items-start gap-3 text-body-sm font-bold text-white/80">
                  <CheckIcon className="mt-[3px] shrink-0 text-[#5ddfb0]" />
                  <span>{t(id)}</span>
                </li>
              ))}
            </ul>
            <Button variant="inverse" size="lg" href="#structure" className="mt-6">
              {t('verify.030')}
            </Button>
          </div>
          <LookupCard
            labels={{
              heading: t('verify.031'),
              inputLabel: t('verify.032'),
              hint: sys('verify.lookup.hint', { min: LOOKUP_MIN_CHARS }),
              clear: t('verify.033'),
              callOffice: t('verify.034'),
              note: tf('verify.035'),
              resultTitle: sys('verify.lookup.resultTitle'),
              resultBody: sys.raw('verify.lookup.resultBody') as string,
              resultCall: t('verify.051'),
              resultWhatsapp: sys('verify.lookup.whatsapp'),
              whatsappIntro: t('verify.228'),
            }}
            phone={settings.phone}
            whatsappNumber={settings.whatsappNumber}
            livePill={livePill}
            updatedLabel={updatedLabel}
            recordLabels={recordLabels}
          />
        </div>
        <StepsDisclosure heading={t('verify.036')}>
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="flex flex-col gap-2.5 rounded-base border border-white/15 bg-white/[0.055] px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex size-[30px] shrink-0 items-center justify-center rounded-input text-body-sm font-extrabold text-white ${step.badge}`}
                >
                  {step.n}
                </span>
                <h3 className="m-0 text-card-title text-white">{t(step.titleId)}</h3>
              </div>
              <p className="m-0 text-body-sm text-white/70">
                {tf(step.lead)} <strong className={step.strong}>{t(step.bold)}</strong>
                {step.glue}
                {tf(step.tail)}
              </p>
            </div>
          ))}
        </StepsDisclosure>
      </div>
    </section>
  );
}
```

`src/app/[locale]/(site)/verify/_sections/Structure.tsx` (server component, synchronous):

```tsx
import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeT, makeTf } from '@/content/pure';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { telLink } from '@/lib/contact';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { Register, Representative } from '../_lib/register';

type T = (id: string) => string;

/**
 * `#structure` — "01 · Our people". Phase A (W6, §10 row 11, D23): no `representatives` rows exist,
 * so the section is the designed empty state with the office's phone; the stats, the register
 * list, the former strip and the sub-line verify.056 ("Anyone not on this page does not act for
 * JobsAdmire") render only from rows — above an empty register that sentence would brand every
 * genuine employee an impostor. The founder strip reads the W86 row and renders nothing while it
 * is unpublished (§10 row 3); its public id and record link need the v1.1 register row as well.
 * The design's sidebar filter, country groups (flagcdn flags) and head-of-desk cards are v1.1
 * register UI on top of the minimal list below.
 */
export function Structure({
  bundle,
  locale,
  register,
  founder,
  updatedLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  register: Register;
  founder: Founder | null;
  updatedLabel: string | null;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const hasRows = register.active.length > 0;
  return (
    <Section tone="pale" id="structure" className="scroll-mt-24">
      <div className="container-site" data-testid="verify-structure">
        <div className="mx-auto mb-10 max-w-[660px] text-center">
          <Eyebrow>{t('verify.053')}</Eyebrow>
          <h2 className="mt-3 mb-0 text-h2 leading-[1.05] tracking-[-0.04em]">
            {t('verify.054')}
            <br />
            {t('verify.055')}
          </h2>
          {hasRows ? (
            <p className="mt-3 mb-0 text-body-lg text-text-secondary">{tf('verify.056')}</p>
          ) : null}
        </div>

        {hasRows ? (
          <StatsStrip register={register} locale={locale} t={t} updatedLabel={updatedLabel} />
        ) : null}
        {founder ? <FounderStrip founder={founder} record={register.founder} t={t} /> : null}
        {hasRows ? (
          <RegisterList rows={register.active} t={t} />
        ) : (
          <EmptyState
            testId="verify-empty"
            tone="light"
            headingLevel={3}
            title={sys('verify.empty.title')}
            body={sys('verify.empty.body')}
            cta={{ label: t('verify.051'), href: telLink(bundle.settings.phone) }}
          />
        )}
        {register.former.length > 0 ? <FormerStrip former={register.former} t={t} /> : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-md border border-border-1 bg-gradient-to-b from-pale-1 to-tint p-6">
          <p className="m-0 max-w-[760px] text-body-sm font-bold text-text-secondary">
            <strong className="font-extrabold text-ink">{t('verify.074')}</strong> {tf('verify.075')}
          </p>
          <Button variant="secondary" href="/partner-with-us">
            {t('verify.076')}
          </Button>
        </div>
      </div>
    </Section>
  );
}

/** W1/D17: the three figures are register-derived (never typed); rendered only with rows. */
function StatsStrip({
  register,
  locale,
  t,
  updatedLabel,
}: {
  register: Register;
  locale: Locale;
  t: T;
  updatedLabel: string | null;
}) {
  const figures: [number, string][] = [
    [register.active.length, t('verify.057')],
    [register.active.filter((r) => r.level === 'office').length, t('verify.058')],
    [new Set(register.active.map((r) => r.country)).size, t('verify.059')],
  ];
  return (
    <div
      data-testid="verify-stats"
      className="mb-5 flex flex-wrap items-center gap-9 rounded-base border border-border-1 bg-white px-6 py-4 shadow-card"
    >
      {figures.map(([value, label]) => (
        <p key={label} className="m-0 flex items-baseline gap-2.5">
          <span className="text-card-title font-extrabold text-ink">{formatInt(value, locale)}</span>
          <span className="text-eyebrow font-bold uppercase tracking-[0.7px] text-text-tertiary">
            {label}
          </span>
        </p>
      ))}
      {updatedLabel ? (
        <p className="m-0 ml-auto text-body-sm font-bold text-text-tertiary">{updatedLabel}</p>
      ) : null}
    </div>
  );
}

/** §10 row 3 / W86: from the published founder row only (never the hero's hard-coded claims). */
function FounderStrip({
  founder,
  record,
  t,
}: {
  founder: Founder;
  record: Representative | null;
  t: T;
}) {
  return (
    <article
      data-testid="verify-founder"
      className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-border-1 bg-white p-6 shadow-card-hover"
    >
      {/* W129: the slot owns its box; the wrapper sizes and rounds it. */}
      <div className="w-[84px] shrink-0 overflow-hidden rounded-pill ring-4 ring-tint">
        <ImageSlot
          slot="founder-photo"
          src={founder.photoSrc}
          alt={founder.name}
          width={84}
          height={84}
          sizes="84px"
        />
      </div>
      <div className="min-w-[240px] flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="m-0 text-card-title">{founder.name}</h3>
          <span className="rounded-pill bg-navy px-3 py-1 text-eyebrow font-extrabold uppercase tracking-[1.1px] text-white">
            {t('verify.060')}
          </span>
        </div>
        <p className="mt-1 mb-0 text-body-sm font-bold text-text-secondary">
          {t(founder.titleId)}
        </p>
        {record ? (
          <p className="mt-2 mb-0 flex flex-wrap items-center gap-2.5">
            {record.validUntil === null ? (
              <span className="inline-flex items-center gap-2 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
                <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
                {t('verify.061')}
              </span>
            ) : null}
            <span className="text-body-sm font-extrabold text-text-tertiary">{record.id}</span>
          </p>
        ) : null}
      </div>
      <div className="flex max-w-[340px] flex-col items-end gap-2.5">
        {record ? (
          // V-1: a record's deep link is ?id= on this route.
          <Link
            href={{ pathname: '/verify', query: { id: record.id } }}
            className={buttonClassName('secondary')}
          >
            {t('verify.062')}
          </Link>
        ) : null}
        <p className="m-0 text-right text-body-sm font-bold text-danger">{t('verify.063')}</p>
      </div>
    </article>
  );
}

/** The v1.1 register, minimal: one accessible row per active person with the design's four
 *  columns; the id links the record deep link (V-1). */
function RegisterList({ rows, t }: { rows: Representative[]; t: T }) {
  return (
    <div
      data-testid="verify-register"
      className="overflow-x-auto rounded-md border border-border-1 bg-white shadow-card"
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-pale-2 text-eyebrow font-extrabold uppercase tracking-[1.1px] text-text-tertiary">
          <tr>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.068')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.069')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.070')}
            </th>
            <th scope="col" className="px-6 py-2.5">
              {t('verify.071')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border-3">
              <td className="px-6 py-3">
                <span className="block font-extrabold text-ink">{r.name}</span>
                <span className="block text-body-sm text-text-tertiary">
                  {r.desk ? `${r.desk} · ${r.role}` : r.role}
                </span>
              </td>
              <td className="px-6 py-3 text-body-sm font-bold text-text-secondary">{r.city}</td>
              <td className="px-6 py-3">
                <Link
                  href={{ pathname: '/verify', query: { id: r.id } }}
                  className="inline-flex min-h-[44px] items-center font-extrabold text-blue-safe underline"
                >
                  {r.id}
                </Link>
              </td>
              <td className="px-6 py-3 text-body-sm font-extrabold text-success-text">
                {t('verify.046')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Former and suspended people stay visible on purpose (the package README's rule) — only when
 *  there are any, and never as a link. */
function FormerStrip({ former, t }: { former: Representative[]; t: T }) {
  return (
    <div
      data-testid="verify-former"
      className="mt-4 flex flex-wrap items-center gap-3 rounded-sm border border-danger-border bg-danger-surface px-4 py-3"
    >
      <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.2px] text-danger">
        {t('verify.073')}
      </p>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {former.map((r) => (
          <li
            key={r.id}
            className="inline-flex items-center gap-2 rounded-pill border border-danger-border bg-white px-3.5 py-1.5 text-body-sm"
          >
            <span aria-hidden="true" className="size-[7px] rounded-pill bg-danger" />
            <span className="font-extrabold text-ink">
              {r.name} · {r.id}
            </span>
            <span className="font-semibold text-danger">
              {r.status === 'suspended' ? t('verify.259') : r.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`src/app/[locale]/(site)/verify/_sections/FraudForm.tsx` (server component, synchronous):

```tsx
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import type { FormActionState } from '@/forms/types';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { EvidenceUpload } from '../_components/EvidenceUpload';
import type { UploadEvidenceAction } from '../_lib/evidence';
import { DESCRIPTION_MAX, DESCRIPTION_MIN } from '../_lib/fraud';

export type FraudAction = (prev: FormActionState, data: FormData) => Promise<FormActionState>;

/**
 * The `fraud` door form (W3/W79/W101/W115). The report box's three "send us" items are its first
 * three fields (V-7: the package's own labels verify.094–096, passed as `label`); the reporter
 * fields and the evidence input have no package label and read `sys.form.labels.*` (W30). Consent
 * is the kernel's checkbox (the default, W79); success navigates to `/tesekkurler?form=fraud`
 * (D13); every other answer is the D11 panel, its WhatsApp prefill (verify.229 + what was typed)
 * composed on click (W76). The fallback heading is an h4 under the box's h3.
 */
export function FraudForm({
  bundle,
  locale,
  submitFraud,
  uploadEvidence,
}: {
  bundle: Bundle;
  locale: Locale;
  submitFraud: FraudAction;
  uploadEvidence: UploadEvidenceAction;
}) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  return (
    <FormShell
      action={submitFraud}
      formKey="fraud"
      locale={locale}
      turnstileSiteKey={settings.turnstileSiteKey}
      whatsappNumber={settings.whatsappNumber}
      whatsappIntro={t('verify.229')}
      contact={{ phone: settings.phone, phoneDisplay: settings.phoneDisplay, email: settings.email }}
      submitLabel={sys('verify.report.submit')}
      headingLevel={4}
      testId="fraud-form"
      className="rounded-base bg-white p-5 text-ink"
    >
      <Field name="suspectName" label={t('verify.094')} maxLength={200} autoComplete="off" />
      <Field name="suspectContact" label={t('verify.095')} maxLength={300} autoComplete="off" />
      <Field
        name="description"
        as="textarea"
        rows={5}
        required
        minLength={DESCRIPTION_MIN}
        maxLength={DESCRIPTION_MAX}
        label={t('verify.096')}
      />
      <Field name="reporterName" required maxLength={120} autoComplete="name" />
      <Field
        name="reporterEmail"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        inputMode="email"
      />
      <Field name="reporterPhone" type="tel" maxLength={40} autoComplete="tel" inputMode="tel" />
      <EvidenceUpload upload={uploadEvidence} />
    </FormShell>
  );
}
```

`src/app/[locale]/(site)/verify/_sections/Report.tsx` (server component, synchronous):

```tsx
import { makeT, makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CrossIcon, WarningIcon } from '../_components/icons';
import type { UploadEvidenceAction } from '../_lib/evidence';
import { FraudForm, type FraudAction } from './FraudForm';

/** The five red flags as [bold lead, body] id pairs — all five at every width (V-3). */
const RED_FLAGS = [
  ['verify.081', 'verify.082'],
  ['verify.083', 'verify.084'],
  ['verify.085', 'verify.086'],
  ['verify.087', 'verify.088'],
  ['verify.089', 'verify.090'],
] as const;

/** `#report` — the red flags and the report box (eyebrow, question, the fraud form, the WhatsApp
 *  and phone doors, the footnote). */
export function Report({
  bundle,
  locale,
  submitFraud,
  uploadEvidence,
}: {
  bundle: Bundle;
  locale: Locale;
  submitFraud: FraudAction;
  uploadEvidence: UploadEvidenceAction;
}) {
  const t = makeT(bundle);
  const tf = makeTf(bundle, locale);
  const { settings } = bundle;
  return (
    // `id="report"`: CTA_BY_PATHNAME['/verify'] (the header's red CTA) and the sticky bar land here.
    <Section tone="light" id="report" className="scroll-mt-24">
      <div className="container-site" data-testid="verify-report">
        <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-danger">
          {t('verify.077')}
        </p>
        <h2 className="mt-3 mb-0 text-h2 leading-[1.06] tracking-[-0.04em]">{t('verify.078')}</h2>
        <p className="mt-3 mb-0 max-w-[680px] text-body-lg text-text-secondary">
          {tf('verify.079')}
        </p>

        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-danger-border bg-white px-7 pt-6 pb-4 shadow-card-hover">
            <h3 className="m-0 flex items-center gap-2 pb-3.5 text-eyebrow font-extrabold uppercase tracking-[1.3px] text-danger">
              <WarningIcon className="shrink-0" />
              {t('verify.080')}
            </h3>
            <ul className="m-0 list-none p-0">
              {RED_FLAGS.map(([lead, body]) => (
                <li
                  key={lead}
                  className="flex items-start gap-3 border-t border-danger-surface py-3.5 text-body-sm text-text-secondary"
                >
                  <CrossIcon className="mt-[5px] shrink-0 text-danger" />
                  <p className="m-0">
                    <strong className="font-extrabold text-ink">{tf(lead)}</strong> {tf(body)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col overflow-hidden rounded-lg bg-navy p-7 text-white shadow-hero-form">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#dc2626_55%,transparent_45%)] bg-[length:22px_3px]"
            />
            <p className="m-0 text-eyebrow font-extrabold uppercase tracking-[1.3px] text-[#fca5a5]">
              {t('verify.091')}
            </p>
            <h3 className="mt-3 mb-2 text-card-title leading-[1.25] text-white">
              {t('verify.092')}
            </h3>
            <p className="mt-0 mb-5 text-body-sm text-white/70">{tf('verify.093')}</p>
            <FraudForm
              bundle={bundle}
              locale={locale}
              submitFraud={submitFraud}
              uploadEvidence={uploadEvidence}
            />
            {/* D11: the co-primary doors stay beside the form. The prefill is company copy
                (verify.229) — never anything the visitor typed (W95). */}
            <div className="mt-4 flex flex-col gap-2.5">
              <ContactCta
                placement="page_cta"
                variant="danger"
                external
                href={waLink(settings.whatsappNumber, t('verify.229'))}
              >
                {t('verify.097')}
              </ContactCta>
              <ContactCta placement="page_cta" variant="inverse" href={telLink(settings.phone)}>
                {t('verify.051')}
              </ContactCta>
            </div>
            <p className="mt-4 mb-0 border-t border-dashed border-white/20 pt-3.5 text-body-sm text-white/60">
              {tf('verify.098')}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/verify/_sections/Faq.tsx` (server component, synchronous):

```tsx
import { useTranslations } from 'next-intl';
import type { Founder } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { FaqBlock, type FaqItem } from '@/design/blocks/FaqBlock';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The FAQ at every width (V-4) — one source for the DOM and the FAQPage node, never the
 *  design's differently-worded JSON-LD twin. §10 row 3: verify.104 names the founder, so it
 *  answers "who can sign?" only once the W86 row is published; until then the name-less
 *  `sys.verify.faq.whoSigns`. */
export function Faq({
  bundle,
  locale,
  founder,
}: {
  bundle: Bundle;
  locale: Locale;
  founder: Founder | null;
}) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const items: FaqItem[] = [
    { id: 'q1', q: tf('verify.101'), a: tf('verify.102') },
    {
      id: 'q2',
      q: tf('verify.103'),
      a: founder ? tf('verify.104') : sys('verify.faq.whoSigns'),
    },
    { id: 'q3', q: tf('verify.105'), a: tf('verify.106') },
    { id: 'q4', q: tf('verify.107'), a: tf('verify.108') },
  ];
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="verify-faq">
        <FaqBlock
          bundle={bundle}
          locale={locale}
          items={items}
          eyebrowId="verify.099"
          headingId="verify.100"
        />
      </div>
    </Section>
  );
}
```

`src/app/[locale]/(site)/verify/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getBundle, makeT } from '@/content/adapter';
import { getCollection } from '@/content/collections';
import { StickyCtaBar } from '@/design/chrome/StickyCtaBar';
import { routing } from '@/i18n/routing';
import { formatDate } from '@/lib/format/date/formatDate';
import { buildMetadata } from '@/lib/seo/metadata';
import { submitFraud, uploadEvidence } from './actions';
import { readRegister } from './_lib/register';
import { Faq } from './_sections/Faq';
import { Hero } from './_sections/Hero';
import { Report } from './_sections/Report';
import { Structure } from './_sections/Structure';

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
  // The record `verify` carries no package SEO string (titleId '') → the sys fallbacks (W23/W38).
  return buildMetadata({
    locale,
    href: '/verify',
    bundle,
    pageKey: 'verify',
    fallbackTitle: sys('seo.verify.title'),
    fallbackDescription: sys('seo.verify.description'),
  });
}

/** /temsilci-dogrulama · /en/verify — SSG (no dated rate badge, W150). The page never reads
 *  `searchParams` (V-1: the `?id=` deep link is read by the lookup island after hydration, so
 *  the route stays static). Phase A: the register is empty (D23 keeps the fixture out of
 *  production) and the founder row unpublished (W86). */
export default async function VerifyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const bundle = await getBundle(locale);
  const t = makeT(bundle);
  const register = readRegister(bundle);
  const founder = getCollection(bundle, 'founder').find((row) => row.published) ?? null;
  // D17: the dated line exists only when the register has rows — never "today".
  const updatedLabel = register.updatedAt
    ? `${t('verify.225')} ${formatDate(register.updatedAt.slice(0, 10), locale)}`
    : null;
  return (
    <>
      <Hero
        bundle={bundle}
        locale={locale}
        register={register}
        founder={founder}
        updatedLabel={updatedLabel}
      />
      <Structure
        bundle={bundle}
        locale={locale}
        register={register}
        founder={founder}
        updatedLabel={updatedLabel}
      />
      <Report
        bundle={bundle}
        locale={locale}
        submitFraud={submitFraud}
        uploadEvidence={uploadEvidence}
      />
      <Faq bundle={bundle} locale={locale} founder={founder} />
      {/* V-5: the design's sticky mini search bar (a second, unlabelled input) → two in-page
          anchors, from lg; it steps aside once the report section is near. */}
      <StickyCtaBar
        message={t('verify.020')}
        showAfterPx={620}
        hideNearId="report"
        live
        ctas={[
          { label: t('verify.067'), href: '#check', variant: 'inverse' },
          { label: t('verify.015'), href: '#report', variant: 'danger' },
        ]}
      />
    </>
  );
}
```

`src/lib/seo/routes.ts` — in the `UNBUILT_PATHNAMES` set literal, delete the line `  '/verify',` (find it with `grep -n "'/verify'" src/lib/seo/routes.ts`). Nothing else in the file changes.

`e2e/routes.ts` — in `GATE_ROUTE_TABLE`, immediately before the line `  // The conversion page (D13): nobody lands on it cold, so Lighthouse never audits it.`, insert:

```ts
  { path: '/temsilci-dogrulama', indexable: true },
  { path: '/en/verify', indexable: true },
```

`docs/SEO.md` — append this row after the last row of the `## Pages` table (T1's columns `Page | Route (tr · en) | Title source | Canonical | JSON-LD | LCP slot | Notes`, W98):

```markdown
| Verify Representative | `/temsilci-dogrulama` · `/en/verify` | `sys.seo.verify.{title,description}` — the record `verify` carries no package SEO string (`titleId: ''`, W23/W38); OG image `/og/{locale}/verify.png` (title `sys.seo.verify.title`, subline `sys.seo.ogTagline`; CDN-cached, W123) | `absoluteUrl(locale, '/verify')` — the `?id=<JA-…>` record deep link (V-1) is never canonical: the lookup island reads it after hydration and the page never reads `searchParams` | `BreadcrumbList` (`Breadcrumbs`: `verify.021` → `/`, `verify.006` → this page, W109); `FAQPage` (`FaqBlock`, four pairs `verify.101`–`108` — while the W86 founder row is unpublished the "who can sign" answer is `sys.verify.faq.whoSigns`; the design's differently-worded JSON-LD twin is not used; AEO only); the site-wide Organization node is not repeated | `h1` (`data-lcp-slot="h1"`) — the dark hero has no photograph; on phones the lead paragraph may measure larger (server-rendered text either way) | not a pixel page (Fable review); SSG, no `revalidate` (no rate badge, W150); Phase A: empty-state register, neutral lookup (W6), founder strip hidden (W86) — no `data-placeholder` until the founder row is published (`founder-photo`, W176) |
```

`docs/ANALYTICS.md` — two edits:
1. `## Event schema`, the `verify_lookup` row: replace its "Fires on" cell `Verify page — a lookup is submitted` with:

```markdown
Verify page (`/temsilci-dogrulama`, `/en/verify`) — the lookup card's answer appears: once per query session when the normalised query first reaches 3 characters, or at mount for a `?id=`/`?rep=`/`#id=` deep link; Clear re-arms it. **Phase A always sends `register_unavailable`** (W6 — no register is published; `verified`/`not_found` arrive with the v1.1 record handler); the typed query is never a parameter
```

2. `### Page instrumentation (WP2b)`: append after the last bullet:

```markdown
- **Verify Representative (`/temsilci-dogrulama`, `/en/verify`, T10):** `verify_lookup { page, locale, outcome: 'register_unavailable' }` from the lookup card, once per query session (W6/W67). `call_click` / `whatsapp_click` with `placement: 'page_cta'` from the card's "Call the office instead" and the neutral answer's "Call the office" (`ContactLink`), the answer's "Ask on WhatsApp" (a bare `https://wa.me/<number>` `Button` that fires `useContactClick('page_cta')` and opens the chat prefilled with `verify.228` + the typed query on click — W95), the register empty state's "Call the office" (`EmptyState` → `ContactCta`) and the report box's "Report on WhatsApp" (company prefill `verify.229`) and "Call the office" (`ContactCta`); the sticky bar's two CTAs are in-page anchors and fire nothing; the v1.1 record dialog's "Something is wrong →" uses the same click-time pattern. The fraud form fires nothing itself: `conversion` for `form_key: 'fraud'` comes from `ConversionPing` on `/tesekkurler`, and its fallback panel fires the contact events with `form_fallback`; the evidence upload fires nothing. The design's `rep_verify_deeplink`, `rep_verify_open`, `rep_badge_print` and `rep_record_link_copied` pushes (with `rep_id`) are not ported (D13: no identifiers).
```

`docs/PRD.md` — two in-place edits (W45; `grep -n 'Verify Representative\|Not yet built' docs/PRD.md`):
1. §2, the table row whose page cell is `Verify Representative`: replace its last cell (`Fraud report (\`FRAUD_REPORT\`); empty-state register at launch (D9 v1)` at WP2a close) with:

```markdown
Fraud report → `fraud` (`FRAUD_REPORT`: `suspectName`/`suspectContact`/`description` ≥ 20 — the design's three "send us" items — plus `reporterName` + `reporterEmail` required on the site and `reporterPhone` optional (V-2), up to three evidence files uploaded one server-action call per file through `POST /api/website/v1/uploads/fraud-evidence` and sent as `evidenceKeys` (W73/W101); consent checkbox (W79)); empty-state register at launch (D9 v1, W6): the lookup is client-only and always answers "register not published — verify with the office" (never the red verdict); stats, register list and former strip render only from v1.1 `representatives` rows (never served from LOCAL in production, D23); the founder strip and the founder-naming claims wait for the W86 `founder` row (§10 row 3); record deep link `?id=<JA-…>` on the same route (V-1); the design's mobile red-flag fold, its second sticky search input and "Print badge" are not ported (V-3/V-5/V-6)
```

2. §11, the sentence that begins "**Not yet built, by design (WP2 and later):**": T9 left it opening "4 of the 14 core pages (…)" and naming "Success Stories (WP2b T9)" (W176's chain: T13 12 → 11, T2 keeps 11, T3 10, T4 9, T5 8, T6 7, T7 6, T8 5, T9 4). Count Verify Representative as built — replace "4 of the 14 core pages" with "3 of the 14 core pages" and add "Verify Representative (WP2b T10)" to the list of designed pages that sentence names, directly after T9's "Success Stories (WP2b T9)" clause — keeping the rest of the sentence as it stands (never re-add WP1 wording). **Stop-and-report guard (W176):** if the sentence does not open with "4 of the 14 core pages" and name "Success Stories (WP2b T9)", an earlier task deviated — do not decrement from whatever figure it carries; stop and report the sentence's exact text to the controller. T11 decrements from the "3" this task leaves.

`docs/ARCHITECTURE.md` — § Routing: directly before the paragraph that begins "**The 404 response is Next's own `__next_error__` shell until hydration (W151).**", insert:

```markdown
**Verify record deep link (V-1, WP2b T10).** A representative's record URL is the Verify page itself with a query — `/temsilci-dogrulama?id=JA-REP-001`, `/en/verify?id=…` (`?rep=` and `#id=` accepted as the design's aliases) — not a `/verify/[id]` route. The badge QR (D9 v1.1) will encode this URL for good; the query adds nothing to `pathnames`, the sitemap or hreflang; and the page stays static because the lookup island reads the query **after hydration** through `useSyncExternalStore` — never through the page's `searchParams`, which would make the whole route dynamic. The v1.1 record fetch is a website route handler (`src/app/api/verify/record/route.ts`, `Cache-Control: no-store` per spec §3.1) the island calls with the id; the browser never calls Operations (D6). Until that handler and consented rows exist, `RECORD_DIALOG_ENABLED` (`src/app/[locale]/(site)/verify/_lib/flags.ts`) keeps the record dialog an unfetched chunk and every lookup answers the neutral W6 result.
```

`docs/CONTENT-MODEL.md` — `## Collections`: append at the end of the paragraph that begins "**Phase A (T0b).**" (after its last sentence, "…become collections when an editor needs to reorder them."):

```markdown
 **`representatives` (v1.1, D9) stays absent:** it is FIXTURE_ONLY and refused under `LOCAL` in production (D23); the Verify page parses it page-locally with `RepresentativeSchema` (`src/app/[locale]/(site)/verify/_lib/register.ts` — `id` `JA-XXX-000`, a locale-resolved `role`, `level` founder | office | rep | coordinator, `desk`, `city`, ISO-2 `country`, `languages[]`, a company-only `contact`, `validUntil`, `reportsTo`, `since`, `status` active | suspended | former — an unknown status is a schema miss, never "active" — `canSign`, `photo`, `updatedAt`), the shape the v1.1 `WebsiteRepresentative` importer must emit; with no rows the page renders its empty state.
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write "src/app/[locale]/(site)/verify" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md docs/ARCHITECTURE.md docs/CONTENT-MODEL.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — `sections.test.tsx` 8 (Hero 3, Structure 2, Report 1, Faq 2), `ids.test.ts` 2; `src/lib/seo/unbuilt.test.ts` green (the page and the set agree: `/verify` is built and gone from the set — it goes red if either half is missed), `src/lib/seo/routes.test.ts`, `src/app/sitemap.test.ts`, `src/app/robots.test.ts`, `scripts/gate-routes.test.ts` green (the EN and TR indexable halves stay equal); the guards `class-collisions.test.ts` (every section literal and composition — `TONE`/`HEAD`/`STEPS` lookups, `max-md:hidden` / `md:hidden` spans, `Button … className="mt-6"`, `buttonClassName('secondary')` on the record link), `client-imports.test.ts` (by-path imports only; the sections are server modules that pass server actions to client islands), `rsc-imports.test.ts`, `client-messages.test.ts` (the sections' `sys(...)`/`sys.raw(...)` reads are server-side — not scanned) and `voice.test.ts` stay green.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add "src/app/[locale]/(site)/verify" src/lib/seo/routes.ts e2e/routes.ts docs/SEO.md docs/ANALYTICS.md docs/PRD.md docs/ARCHITECTURE.md docs/CONTENT-MODEL.md && git commit -m "feat(verify): /temsilci-dogrulama + /en/verify — hero with the neutral lookup, empty-state register, red flags + fraud form with evidence, FAQ, sticky bar (T10 c4)

W17/W152: the page renders id=\"report\" for the header CTA; W20/W21: /verify leaves
UNBUILT_PATHNAMES, both locale paths join GATE_ROUTE_TABLE; W6/W86/§10 rows 3 and 11: empty
register, founder strip and founder-naming claims wait for published data, verify.056 only with
rows; D26: the h1 is the only LCP slot; W109 own crumbs; W113 test ids on inner divs; W125/W156
by-path imports. Docs: SEO page row, ANALYTICS verify_lookup + page instrumentation, PRD row 7 +
§11, ARCHITECTURE V-1 record deep link, CONTENT-MODEL representatives shape.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 5 — the page e2e (written here, run inside Cycle 6's gate)

- [ ] **Step 1: Write the failing test**

`e2e/pages/verify.spec.ts` (runs under both Playwright projects inside the Cycle 6 gate; it needs no door and no `OPS_API_URL` — W92):

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Locator, type Page } from '@playwright/test';

const ROUTES = { tr: '/temsilci-dogrulama', en: '/en/verify' } as const;
/** Canonicals, hreflang and JSON-LD URLs are built from SITE_URL, never the host this run hits. */
const ORIGIN = 'https://www.jobsadmire.com';
/** `bundle.settings.whatsappNumber` in the Phase A LOCAL bundle. */
const WA = 'https://wa.me/905011240340';
const isMobile = () => test.info().project.name === 'mobile';

/** W92: only `staging` and production carry the Operations door. Every other face — this task's
 *  localhost build (no door variables), any other Vercel preview — answers a valid report with the
 *  D11 panel (`unauthorized`) and an evidence pick with "could not be uploaded right now",
 *  deterministically and without filing anything. On a door face those cases skip: T14 owns real
 *  submissions and uploads. */
function onDoorFace(): boolean {
  const base =
    test.info().project.use.baseURL ?? process.env.E2E_BASE_URL ?? 'http://localhost:3000';
  return /^(www\.|staging\.)?jobsadmire\.com$/.test(new URL(base).hostname);
}

/** The committed copy, read from disk (outside `src/`, so the D23 import rule does not apply). */
const json = (...parts: string[]) =>
  JSON.parse(readFileSync(join(process.cwd(), ...parts), 'utf8')) as unknown;
const S = {
  tr: (json('src', 'content', 'local', 'bundle.tr.json') as { strings: Record<string, string> })
    .strings,
  en: (json('src', 'content', 'local', 'bundle.en.json') as { strings: Record<string, string> })
    .strings,
};
type Sys = {
  verify: {
    lookup: { resultTitle: string; whatsapp: string };
    empty: { title: string };
    report: { submit: string };
  };
  form: { labels: Record<string, string>; evidence: Record<string, string> };
};
const SYS = {
  tr: (json('src', 'messages', 'tr.json') as { sys: Sys }).sys,
  en: (json('src', 'messages', 'en.json') as { sys: Sys }).sys,
};

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

/** Lets a test click a tel:/wa.me anchor without leaving the page: a capture-phase listener
 *  cancels the navigation; React's own click handler (the analytics push) still runs. */
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

/** Records what the page asks `window.open` to open (the click-time WhatsApp compositions). */
async function stubWindowOpen(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __opened: string[] };
    w.__opened = [];
    window.open = ((url?: string | URL) => {
      w.__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}
const opened = (page: Page) =>
  page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

/** W76/W95: the fallback anchor's href is the bare chat; the prefilled URL (what the visitor
 *  typed) exists only in the window the click opens. */
async function expectBareWhatsAppFallback(page: Page, panel: Locator, typed: string) {
  const link = panel.getByRole('link', { name: /WhatsApp/ });
  await expect(link).toHaveAttribute('href', WA);
  await stubWindowOpen(page);
  await link.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(`${WA}?text=`)).toBe(true);
  expect(decodeURIComponent(urls[0].split('?text=')[1])).toContain(typed);
}

type JsonLdNode = Record<string, unknown> & { '@type'?: string | string[] };
async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return texts.flatMap((t) => {
    const parsed = JSON.parse(t) as JsonLdNode | JsonLdNode[];
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}
const typesOf = (n: JsonLdNode): string[] =>
  Array.isArray(n['@type']) ? n['@type'] : n['@type'] ? [n['@type']] : [];

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: one page-h1 holding the only LCP slot, no placeholder, the four anchors once, the sections in design order, the Phase A empty state, no leaked tokens (W6/D26/W17)`, async ({
    page,
  }) => {
    const res = await page.goto(ROUTES[locale]);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toHaveCount(1);
    const h1 = page.getByTestId('page-h1');
    await expect(h1).toHaveText(`${S[locale]['verify.023']} ${S[locale]['verify.024']}`);
    await expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    await expect(page.locator('[data-lcp-slot]')).toHaveCount(1);
    await expect(page.locator('[data-placeholder]')).toHaveCount(0); // founder row unpublished (W86)
    for (const id of ['check', 'structure', 'report', 'faq'])
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    const tops = await page.evaluate(() =>
      ['verify-hero', 'verify-structure', 'verify-report', 'verify-faq'].map(
        (id) =>
          document.querySelector(`[data-testid="${id}"]`)?.getBoundingClientRect().top ?? Number.NaN,
      ),
    );
    expect(tops.every((y) => Number.isFinite(y))).toBe(true);
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    // Phase A (W6, §10 row 11, D23): the empty register — no rows, no founder, no verdict
    await expect(page.getByTestId('verify-empty')).toContainText(SYS[locale].verify.empty.title);
    for (const id of ['verify-stats', 'verify-founder', 'verify-register', 'verify-former'])
      await expect(page.getByTestId(id)).toHaveCount(0);
    await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
    expect(await page.locator('main').innerText()).not.toMatch(
      /\{[a-zA-Z]+\}|\{\{|undefined|\[object |verify\.\d{3}/,
    );
  });

  test(`${locale}: canonical, hreflang and JSON-LD — one BreadcrumbList of this page’s crumbs, one FAQPage of four pairs, the site-wide Organization only`, async ({
    page,
  }) => {
    await page.goto(ROUTES[locale]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES[locale]}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES.en}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${ORIGIN}${ROUTES.tr}`,
    );
    const nodes = await jsonLdNodes(page);
    const of = (type: string) => nodes.filter((n) => typesOf(n).includes(type));
    expect(of('BreadcrumbList')).toHaveLength(1);
    expect(of('FAQPage')).toHaveLength(1);
    expect(of('Organization')).toHaveLength(1); // the site-wide node only — never repeated here
    const crumbs = of('BreadcrumbList')[0] as { itemListElement: { item: string }[] };
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([
      locale === 'tr' ? `${ORIGIN}/` : `${ORIGIN}/en`,
      `${ORIGIN}${ROUTES[locale]}`,
    ]);
    expect((of('FAQPage')[0] as { mainEntity: unknown[] }).mainEntity).toHaveLength(4);
  });
}

test('tr: the header CTA lands on #report (W17/W152/W158)', async ({ page }) => {
  await page.goto(ROUTES.tr);
  const cta = page.getByRole('banner').locator(`a[href="${ROUTES.tr}#report"]`).first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/\/temsilci-dogrulama#report$/);
  await expect(page.locator('#report')).toBeInViewport();
});

test('tr: a lookup answers neutrally — never the red verdict — fires verify_lookup once, keeps the query out of every href, prefills WhatsApp on click (W6/W67/W95)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await stubWindowOpen(page);
  const card = page.getByTestId('verify-check');
  const input = card.getByRole('textbox', { name: S.tr['verify.032'] });
  await input.fill('JA');
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
  await input.fill('JA-REP-014');
  const result = page.getByTestId('verify-lookup-result');
  await expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
  await expect(result).toContainText(SYS.tr.verify.lookup.resultTitle);
  await expect(result).toContainText('JA-REP-014');
  for (const id of ['verify.048', 'verify.049'])
    await expect(page.locator('main')).not.toContainText(S.tr[id]);
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''));
  expect(hrefs.filter((h) => h.includes('JA-REP'))).toEqual([]);
  await expect.poll(async () => (await pushed(page, 'verify_lookup')).length).toBe(1);
  expect((await pushed(page, 'verify_lookup'))[0]).toEqual({
    event: 'verify_lookup',
    page: ROUTES.tr,
    locale: 'tr',
    outcome: 'register_unavailable',
  });
  await input.fill('JA-REP-0145');
  await expect(result).toContainText('JA-REP-0145');
  expect(await pushed(page, 'verify_lookup')).toHaveLength(1); // same query session
  const wa = result.getByRole('link', { name: SYS.tr.verify.lookup.whatsapp });
  await expect(wa).toHaveAttribute('href', WA);
  await wa.click();
  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(decodeURIComponent(urls[0].split('?text=')[1])).toBe(
    `${S.tr['verify.228']} JA-REP-0145`,
  );
  expect((await pushed(page, 'whatsapp_click')).map((e) => e.placement)).toEqual(['page_cta']);
  await card.getByRole('button', { name: S.tr['verify.033'] }).click();
  await expect(input).toHaveValue('');
  await expect(page.getByTestId('verify-lookup-result')).toHaveCount(0);
});

test('en: ?id= prefills the lookup and answers at once (V-1); the canonical ignores the query', async ({
  page,
}) => {
  await page.goto(`${ROUTES.en}?id=JA-REP-001`);
  await expect(page.getByTestId('verify-check').getByRole('textbox')).toHaveValue('JA-REP-001');
  await expect(page.getByTestId('verify-lookup-result')).toHaveAttribute(
    'data-outcome',
    'register_unavailable',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${ORIGIN}${ROUTES.en}`,
  );
  await expect.poll(async () => (await pushed(page, 'verify_lookup')).length).toBe(1);
});

test('tr: a short description is reported on its field — nothing navigates, no panel (catalog min 20)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('fraud-form');
  await expect(form).toHaveAttribute('data-form-key', 'fraud');
  const description = form.getByRole('textbox', { name: S.tr['verify.096'], exact: true });
  await description.fill('çok kısa');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterName, exact: true })
    .fill('Test Bildiren');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterEmail, exact: true })
    .fill('bildiren@example.com');
  await form.getByRole('checkbox').check(); // W79
  await form.getByRole('button', { name: SYS.tr.verify.report.submit }).click();
  await expect(description).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#f-fraud-description-error')).toBeVisible();
  await expect(form.getByTestId('form-fallback')).toHaveCount(0);
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
});

test('tr: a valid report ends on the D11 panel without a door (W92) — values kept, bare wa.me, click-time prefill (W76)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: this face carries the door — T14 owns real submissions');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('fraud-form');
  await form.getByRole('textbox', { name: S.tr['verify.094'], exact: true }).fill('Ali Veli');
  await form
    .getByRole('textbox', { name: S.tr['verify.096'], exact: true })
    .fill('Kendini JobsAdmire temsilcisi olarak tanıtan biri vize depozitosu istedi.');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterName, exact: true })
    .fill('Test Bildiren');
  await form
    .getByRole('textbox', { name: SYS.tr.form.labels.reporterEmail, exact: true })
    .fill('bildiren@example.com');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: SYS.tr.verify.report.submit }).click();
  const panel = form.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'unauthorized');
  expect(new URL(page.url()).pathname).toBe(ROUTES.tr);
  await expect(form.getByRole('textbox', { name: S.tr['verify.094'], exact: true })).toHaveValue(
    'Ali Veli',
  );
  await expectBareWhatsAppFallback(page, panel, 'Test Bildiren');
});

test('tr: evidence — a picked file goes to the upload action alone and, without a door, reads "could not be uploaded"; an oversize file is refused in the browser (W73/W101/W116)', async ({
  page,
}) => {
  test.skip(onDoorFace(), 'W92: a door face would store the file — T14 owns real uploads');
  await page.goto(ROUTES.tr);
  const form = page.getByTestId('fraud-form');
  const input = form.getByLabel(SYS.tr.form.labels.evidence, { exact: true });
  await expect(input).not.toHaveAttribute('name'); // the bytes never ride the report
  await input.setInputFiles({
    name: 'shot.png',
    mimeType: 'image/png',
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  });
  const evidence = form.getByTestId('fraud-evidence');
  await expect(evidence).toContainText(SYS.tr.form.evidence.failed.replace('{name}', 'shot.png'));
  await expect(form.locator('input[type="hidden"][name="evidenceKeys"]')).toHaveCount(0);
  await input.setInputFiles({
    name: 'big.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(3 * 1024 * 1024 + 1),
  });
  await expect(evidence).toContainText(
    SYS.tr.form.evidence.tooBig.replace('{name}', 'big.png').replace('{maxMb}', '3'),
  );
});

test('tr: contact clicks fire page_cta — the empty state’s call and the report box’s WhatsApp (company prefill only, W12/W95)', async ({
  page,
}) => {
  await page.goto(ROUTES.tr);
  await neutraliseContactLinks(page);
  await page.getByTestId('verify-empty').getByRole('link', { name: S.tr['verify.051'] }).click();
  const reportWa = page.getByTestId('verify-report').getByRole('link', { name: S.tr['verify.097'] });
  await expect(reportWa).toHaveAttribute(
    'href',
    `${WA}?text=${encodeURIComponent(S.tr['verify.229'])}`,
  );
  await reportWa.click();
  expect((await pushed(page, 'call_click')).map((e) => e.placement)).toEqual(['page_cta']);
  expect((await pushed(page, 'whatsapp_click')).map((e) => e.placement)).toEqual(['page_cta']);
});

test('en: the sticky bar appears after scrolling on desktop with its two in-page anchors (V-5)', async ({
  page,
}) => {
  test.skip(isMobile(), 'the bar shows from 901 px; the chrome’s bottom bar owns phones');
  await page.goto(ROUTES.en);
  await expect(page.getByTestId('sticky-cta')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 700));
  const bar = page.getByTestId('sticky-cta');
  await expect(bar).toBeVisible();
  await expect(bar.locator('a[href="#check"]')).toHaveCount(1);
  await expect(bar.locator('a[href="#report"]')).toHaveCount(1);
});

test('en: axe stays clean with the lookup answer and an evidence refusal shown (states the route sweep never opens)', async ({
  page,
}) => {
  await page.goto(ROUTES.en);
  await page.getByTestId('verify-check').getByRole('textbox').fill('JA-REP-014');
  await expect(page.getByTestId('verify-lookup-result')).toBeVisible();
  await page
    .getByTestId('fraud-form')
    .getByLabel(SYS.en.form.labels.evidence, { exact: true })
    .setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('x') });
  await expect(page.getByTestId('fraud-evidence')).toContainText('notes.txt');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id} ×${v.nodes.length}`)).toEqual([]);
});

test('tr: the language switch keeps the visitor on the verify page (W17)', async ({ page }) => {
  test.skip(isMobile(), 'the header switcher shows from 901 px; the hamburger carries it below');
  await page.goto(ROUTES.tr);
  await page.getByRole('banner').getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/verify$/);
  await expect(page.getByTestId('page-h1')).toHaveText(
    `${S.en['verify.023']} ${S.en['verify.024']}`,
  );
});
```

(The evidence case reads the rendered text from the message catalogue: `MB'tan` and `WhatsApp'tan` render with their literal apostrophe under ICU, so the plain `replace` of the tokens matches what the island shows.)

- [ ] **Step 2: Run to verify it fails**

Not run against a server here: Playwright needs a production build, and the task gets exactly one build + one start + one gate (W126, Cycle 6). Before this task every case failed by construction (`/temsilci-dogrulama` and `/en/verify` answered 404 through `[...rest]`); Cycle 6 runs it against the finished page. What this cycle proves locally is that the spec parses, type-checks and lints:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx playwright test e2e/pages/verify.spec.ts --list
```
Expected: 14 tests listed per project (28 in total) — no server is contacted by `--list`.

- [ ] **Step 3: Implement**

The spec above is the whole change (the page already exists since Cycle 4).

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write e2e/pages/verify.spec.ts && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green (the spec is outside Vitest's `include`; `tsc` and ESLint cover it; its `readFileSync` of the bundles and message files is outside `src/`, so the D23 import rule does not apply).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add e2e/pages/verify.spec.ts && git commit -m "test(verify): page e2e — contract, JSON-LD, #report CTA, neutral lookup + deep link, fraud form field error and door-less D11 panel, evidence refusals, placements, sticky bar, axe in opened states (T10 c5)

W6/W67: register_unavailable only, never the red verdict; W92: deterministic without
OPS_API_URL (the door cases skip on a door face); W76/W95: bare hrefs, click-time prefills;
W101/W116: one file per action, the 3 MiB refusal in the browser; W115: selectors use the
rendered package labels.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — the W126 proof session: one build, one start, the gate, js-size, the launch anchor check; the ledger row

One heavy job at a time, in this order, and the server is killed at the end whatever the outcome.

- [ ] **Step 1: Pre-flight — no new test (the Cycle 5 page spec and the existing gate are the tests); check the facts this task relies on and must not edit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
grep -n "temsilci-dogrulama\|/en/verify" e2e/routes.ts   # 2 hits, both `indexable: true` (W21)
grep -n "'/verify'" src/lib/seo/routes.ts                # no hit (the UNBUILT key is gone, W20)
grep -n "hash: '#report'" src/design/chrome/ctas.ts      # 1 hit — CTA_BY_PATHNAME['/verify'], untouched (W17/W121)
grep -n "^export function visitorOf" src/forms/action.ts # 1 hit (Cycle 2)
ls -a | grep '^\.env'                                    # only .env.example (Next never loads it)
env | grep -E '^(OPS_|NEXT_PUBLIC_TURNSTILE|NEXT_PUBLIC_GTM|NEXT_PUBLIC_GA4|NEXT_PUBLIC_ADS)' || echo 'door-less, GTM-dark'
git status --short                                       # clean: Cycles 1–5 are committed
```
Expected: exactly as annotated. A door variable or an `.env.local` must be removed from this shell/worktree before building — the page spec must meet the door-less face (W92: a valid report ends on the `unauthorized` panel, an evidence pick on "could not be uploaded right now") and a GTM id would put third-party script into the measured budget (W146). If a route fact differs, WP2a or an earlier page task drifted: stop and report; never "fix" the route list or the CTA table from this page task.

- [ ] **Step 2: Build and start (the one build, W126)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
rm -rf .next .lighthouseci lighthouse-report test-results playwright-report
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build
npm run start > "$TMPDIR/verify-start.log" 2>&1 &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/temsilci-dogrulama && echo up
```
(An agent shell may start the server with its own background-run facility instead of `&`; keep its PID for Step 4 either way, and wait with `curl --retry`, never a bare `sleep`.)

Expected: the build succeeds — it is the first time the RSC boundaries of `page.tsx` → the four server sections → the `'use client'` `LookupCard`/`StepsDisclosure`/`EvidenceUpload`/`FormShell`/`Field`/`Accordion`/`ContactLink`/`StickyCtaBar`, the two server actions passed through `Report` → `FraudForm` → `FormShell`/`EvidenceUpload` as props, and the `next/dynamic` record-dialog chunk inside a client module are compiled (jsdom could not see them); the route table lists `/[locale]/verify` as prerendered (`●`) for both locales — no `headers()`/`cookies()`/`searchParams` in the page (only the actions read the request, at call time); `up` is printed. A build error is fixed in the source, committed after the verify line, and the build re-run — that re-run is still "the" build of this session.

- [ ] **Step 3: The gate, js-size, the launch anchor check**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2
E2E_BASE_URL=http://localhost:3000 npm run gate
npm run js-size
E2E_BASE_URL=http://localhost:3000 npm run gate:launch > "$TMPDIR/verify-gate-launch.log" 2>&1 || true
grep -n 'missing id="report"' "$TMPDIR/verify-gate-launch.log" || echo 'no missing #report anchor'
grep -nE '^/(temsilci-dogrulama|en/verify)[^ ]* → ' "$TMPDIR/verify-gate-launch.log" || echo 'verify routes not listed as dead'
```
Expected:
- **Gate** (localhost wears the production face → `lighthouserc.local.json`, W135/W145): Playwright green under `mobile` and `desktop` — `e2e/pages/verify.spec.ts` 26 passed + 2 skipped (the sticky-bar and language-switch cases skip on `mobile` by design), and `routing` (page contract on `/temsilci-dogrulama`, `/en/verify`), `seo` (canonical/hreflang on both, the sitemap lists both, every sitemap URL 200), `a11y` (zero `wcag2a`/`wcag2aa`/`wcag22aa` violations on both routes under both projects; `region` clean at 390/1000/1440), `width-sweep` (no horizontal overflow at 1440…390 incl. 1101/1100 and 901/900 — the hero grid stacks below `lg`, the report grid too), `chrome` (every earlier page's header CTA still lands), `headers`, `thank-you` all green; the two token cases of `ops.spec.ts` skip without `REVALIDATE_SECRET` (as at WP2a). The server log shows one `[uploadFraudEvidence] OPS_API_URL / OPS_WEBSITE_WRITE_TOKEN not configured` line per door-less evidence pick — expected. `lhci assert` passes on every indexable gate route; on `/temsilci-dogrulama` and `/en/verify` (median of 3 DevTools-throttled runs): performance ≥ 0.95, accessibility 1, best-practices 1, SEO 1, `resource-summary:script:size` ≤ 204,800 B, LCP ≤ 2,500 ms (the h1), CLS ≤ 0.1.
- **js-size** (W136 — the ledger's figure): both verify routes' LOCAL figures below the stop-and-report trigger **191,724 B** (W162: the controller's binding preview line is 194,560 B, and the preview's `npm run js-size` runs ≈ 2,836 B above this local build, 176,132 → 178,968 B at 02ace58). Projection: the WP2a close measured the shell at 176,132 B (TR) / 172,783 B (EN) locally; this page adds the forms kernel's client graph (`FormShell`, `Field`, `FormField`, `FormErrorsContext`, `FallbackPanel`, the `Turnstile` loader, `guardAction`, `echo`, `errors` — ≈ 7–8 KB gz, counted per route), `Accordion` (FaqBlock, ≈ 1 KB), `StickyCtaBar` (≈ 1 KB) and the page's islands (`LookupCard` with its `next/dynamic` loader, `StepsDisclosure`, `EvidenceUpload`, the pure `_lib/lookup`/`_lib/evidence`/`_lib/flags` — ≈ 4 KB; `RecordDialog` + `Dialog` are a separate chunk never requested) → ≈ 189–191 KB (TR) / 186–188 KB (EN) locally, ≈ 192–194 KB on a preview. The LCP column should read the h1 at ≈ 1.5–2.0 s.
- **At or over the trigger** (either route's LOCAL figure ≥ **191,724 B**, W162 — the binding preview decides at 194,560 B): this page writes no lazy cycle in advance (W162), so the proof stops here. Do NOT start T11 and do NOT add a second build here — record the table and the route's client chunk list (`.next/server/app/[locale]/(site)/verify/page_client-reference-manifest.js`) and report to the controller (W13 amended/W162: the controller schedules the lazy pass before the next page starts). The page's own levers (W162 pre-approves the first two): `StepsDisclosure` → a native `<details>` pair (0 B of JS, the fold kept); `StickyCtaBar` dropped (V-5 is a named delta already); the fraud form itself is NEVER lazy-loaded — it is the `#report` CTA target (W163); if the two pre-approved levers are not enough, the controller rules on a kernel client-bundle trim in a foundation-touch cycle (W163), never a page-local interaction trigger on the form.
- **Launch anchor check** (W152/W158): the launch profile stays RED by design (other pages' unbuilt routes and anchors), but the first grep prints `no missing #report anchor` — the anchor half's lines for `CTA_BY_PATHNAME['/verify'].primary (/verify#report)` are gone for both locales — and the second prints `verify routes not listed as dead` (it matches only the dead-href lines, `<href> → <status>`; the D26 content-readiness table further down the same log lists both verify routes by design — `| /temsilci-dogrulama | 200 | 0 | … |` — and is not a dead target). The dead-href half still lists the routes T11 and T12 own until they land — by design (T13 ran second in W99 order, so its routes are already built).

- [ ] **Step 4: Stop the server, record the numbers**

```bash
kill "$SERVER_PID"
pgrep -fl 'next-server|next start|playwright|lhci|lighthouse|chrome-headless|Chrome for Testing' || echo 'no stray processes'
```
Expected: `no stray processes` (kill any survivor by PID). `.lighthouseci/` and `lighthouse-report/` hold no secret on a localhost run, but are never committed.

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — append the T10 row to the `## Ledger` table in T1's row format (W98), filled from this session (the "**Ledger line**" template at the end of this task — every `<…>` from Steps 3–4; none typed from memory).

- [ ] **Step 5: Verify and commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 && git add docs/superpowers/plans/2026-09-20-wp2b-pages.md && git commit -m "docs(verify): T10 ledger row — gate, js-size, Lighthouse medians, launch anchor sweep (T10 c6)

Localhost proof session (W126/W145): one build, one gate, both verify routes measured against
the 191,724 B local trigger (W162; the binding preview line is 194,560 B, W136); #report present for CTA_BY_PATHNAME['/verify'] in both locales
(W152/W158); named deltas and the WP-C sheet entries recorded.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:**
- `docs/CONTENT-MODEL.md` — the Verify bullet in the per-page `sys.*` list at the end of `### Adding copy (W9, W23, W54)` (Cycle 1, with the keys and the ≈ 0.6 KB-per-locale `form.evidence.*` client payload, W166); the `representatives` sentence at the end of the `## Collections` "**Phase A (T0b).**" paragraph (Cycle 4 — the v1.1 row shape the importer must emit).
- `docs/ARCHITECTURE.md` — § Forms flow, the "Uploads" bullet's as-built sentence (the evidence island, `uploadEvidence`, the exported `visitorOf` — additive, W170 —, the submit hold, the orphan purge; Cycle 3); § Routing, the "Verify record deep link (V-1)" paragraph (Cycle 4).
- `docs/SEO.md` — the Verify row of T1's `## Pages` table, naming the LCP element (the h1 — the hero has no photograph) and the two JSON-LD nodes (Cycle 4).
- `docs/ANALYTICS.md` — the `verify_lookup` row's "Fires on" cell and the Verify bullet under `### Page instrumentation (WP2b)` (Cycle 4; no new event, parameter or enum value).
- `docs/PRD.md` — §2's Verify Representative row, last cell (the fraud door mapping, the Phase A empty state, V-1/V-3/V-5/V-6), and the §11 "Not yet built" sentence (page count, Verify built), edited in place (Cycle 4, W45).
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` — the T10 `## Ledger` row (Cycle 6).
- No `docs/INTEGRATIONS.md` change: every field sent is in the catalog v1.0 `fraud` entry (v1.1 adds nothing to `fraud`), the upload route and the site's 3 MiB / one-file-per-call rule are already in I4, and T14 writes the I4 instance map (the wire listed under **Interfaces → Produces**).

**Sys keys added:** 22, identical key set in `src/messages/tr.json` and `src/messages/en.json`, pinned by `_lib/__tests__/copy.test.ts` (and `messages.test.ts`, `voice.test.ts`): `sys.seo.verify.title`, `sys.seo.verify.description`, `sys.verify.hero.lead`, `sys.verify.lookup.hint`, `sys.verify.lookup.resultTitle`, `sys.verify.lookup.resultBody`, `sys.verify.lookup.whatsapp`, `sys.verify.empty.title`, `sys.verify.empty.body`, `sys.verify.faq.whoSigns`, `sys.verify.report.submit`, `sys.verify.record.close`, `sys.verify.record.former`, `sys.form.evidence.uploading`, `sys.form.evidence.attached`, `sys.form.evidence.remove`, `sys.form.evidence.tooBig`, `sys.form.evidence.badType`, `sys.form.evidence.refused`, `sys.form.evidence.failed`, `sys.form.evidence.tooMany`, `sys.form.evidence.wait`. Consumed, not added: `sys.form.labels.{suspectName,suspectContact,description,reporterName,reporterEmail,reporterPhone,evidence}` (the three package labels override the first three), `sys.form.placeholders.*`, `sys.form.hints.{description,evidence,optional}`, `sys.form.errors.*`, `sys.form.consent.label`, `sys.form.submit.sending`, `sys.form.fallback.*`, `sys.nav.breadcrumbs` (Breadcrumbs), `sys.seo.ogTagline` (the OG route), `sys.thankYou.forms.fraud` (the thank-you page).

**Package ids used:** 101 `verify.*` ids read by exact id in the route's own source (counted by the same scan `ids.test.ts` runs), every one verified present in `src/content/local/catalogue.json` and in both generated bundles — first `verify.001`, last `verify.267`: `verify.001`, `006`, `015`, `020`–`047` (breadcrumb, badge variants, h1, lead variants, ticks, CTA, lookup card, the three steps), `051`, `053`–`063` (structure intro, stats labels, founder strip), `067`–`071`, `073`–`076` (sticky CTA, register columns, former strip, firewall note), `077`–`108` (report section, flags, report box, form labels, doors, footnote, FAQ), `110`–`116` (record labels), `224`–`226`, `228`, `229`, `234`, `239`, `241`, `259`, `267` (live pill, dated line, record link, prefills, step 2's tail, record labels, suspended). Read through data when published: `about.047` (the W86 founder row's `titleId`). Of these, `verify.025`/`026`/`104` render only with a published founder row, `verify.056`–`063`, `068`–`071`, `073`, `224`, `225`, `259` only with register rows, and `verify.060`, `110`–`116`, `226`, `239`, `241`, `267` (record dialog) only while `RECORD_DIALOG_ENABLED`. Never read (pinned by `ids.test.ts`): `verify.048`–`050`, `052`, `235`, `236` (the red verdict and its echo, W6), `119` (mustache token), `120` (Print badge, V-6), `219`–`222`, `266` (CRM feed badges — the empty state replaces them), `230`/`231` (the mobile flag fold, V-3), `148`–`197`, `240`, `242`–`258` (staff-data sample rows). Also unused: `verify.002`–`005`, `007`–`014`, `016`–`019`, `121`–`147`, `233` (chrome — R15; the header reads `verify.016` as its own CTA tail), `064`–`066`, `072`, `109`, `117`, `118`, `198`–`218`, `223`, `227`, `232`, `237`, `238`, `260`–`265`, `268`–`271` (v1.1 register panel/grouping, the badge-QR label, the level-keyed May-do lists, alternative prefills and labels).

**CLIENT_SYS additions:** none. The only new client `sys(...)` reads are `EvidenceUpload`'s `form.*` (`form.labels.evidence`, `form.hints.evidence`, `form.evidence.*` — `form` is already listed); `LookupCard`, `StepsDisclosure` and `RecordDialog` call no `useTranslations` — the sections resolve every string on the server (the lookup's result body as a raw `{query}` template the island splits); `src/i18n/client-messages.ts` stays as T1–T9 left it and `client-messages.test.ts` needs no change (W148).

**Foundation gaps:** none blocking; every name this task consumes exists at `5562634` and was checked in the code. Notes: (a) `visitorOf` was module-private in `src/forms/action.ts`; the per-file evidence action (W101) is not a `createFormAction`, so this task exports it (one keyword, additive, W170 — exported in Cycle 2, documented in ARCHITECTURE § Forms flow in Cycle 3), closing `check.md`'s "export it … the new per-file upload action should carry it anyway". (b) `uploadEvidence` is a public server action without a Turnstile check of its own (the single-use token belongs to the report); it is bounded by the 3 MiB cap, the door's content sniffer and the 7-day orphan purge — a per-visitor throttle on `POST /api/website/v1/uploads/fraud-evidence` keyed on `X-Website-Visitor-Ip` would be an Operations follow-up (like W110 for the careers CV route). (c) What the register needs later (Phase B CMS / v1.1, D9): an Operations `WebsiteRepresentative` model and CMS screen with a consent record per person, stable public `JA-` ids and company-only contacts; per-locale `role`/`desk`/`city` fields on the record (the package's staff-data strings are sample rows, never keys) and ISO-2 countries for the local `Flag` asset; a `representatives` schema in `src/content/collections.ts` (moving `RepresentativeSchema` out of `_lib/register.ts`) served under OPS; the website's `no-store` record handler `src/app/api/verify/record/route.ts` (the island's only data source, D6) with the badge QR from `qrSvg`; the level-keyed "May do / May never" lists (`verify.117`/`118`, `198`–`218`); `verify_lookup` `verified` / `not_found` wired then; the design's sidebar filter, country groups and head-of-desk cards on top of the minimal list. (d) `verify.025`/`026`/`104` embed the founder's name; the §10 row 3 sign-off publishes the W86 row and these strings together — if the published name differs, the strings need a WP-C rewrite (or a `{founder}` placeholder through the importer, like the D17 metric placeholders). (e) The `fraud` catalog has no representative-id field: a report about a looked-up id carries it only as typed text in `suspectContact`/`description`. (f) `LazyIsland` is viewport-only and a server page cannot pass it a `load` function — if a verify route's local figure reaches the 191,724 B stop-and-report trigger (W162; the binding preview line is 194,560 B), moving the fraud form behind an interaction needs a ruling (Cycle 6's branch). The catalog v1.1 fields (Task 8, confirmed as built on Operations `main` `47a2160`) are not involved: this page sends none of `city`, `track`, `topic`, `portfolioUrl`.

**Ledger line** (append to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md`; fill every `<…>` from Cycle 6):

```markdown
| T10 Verify Representative | `/temsilci-dogrulama` · `/en/verify` | js-size (local): `/temsilci-dogrulama` <n> B · `/en/verify` <n> B (ceiling 204,800; local stop-and-report trigger 191,724 (W162); binding preview line 194,560; projected ≈ 189–191 KB / 186–188 KB locally, ≈ 192–194 KB on a preview); binding preview: <added by the controller> | LH mobile, median of 3, DevTools throttling (local rc = production): `/temsilci-dogrulama` perf <x.xx> · a11y 1.00 · BP 1.00 · SEO 1.00 · LCP <n> ms (h1) · CLS <n>; `/en/verify` perf <x.xx> · LCP <n> ms · CLS <n> | not a D27 page — Fable side-by-side; named deltas 1–16 (this task's header): (a) D20 faces (blue-safe step badge, text-tertiary greys, danger token, the real steps disclosure, the labelled and described lookup input, the success/danger/inverse CTA faces); (b) W3/W101/W115/W79 fraud form (package labels, reporter name + e-mail, one-file-per-call evidence, consent), the neutral W6 lookup with click-time WhatsApp, V-1 deep link, V-3/V-4/V-5/V-6, no design dataLayer pushes; (c) Phase A empty register, hidden founder strip, name-less hero lead and FAQ answer, `verify.056` withheld; WP-C sheet: `sys.verify.hero.lead` and `sys.verify.faq.whoSigns` beside `verify.025`/`026`/`104` (legal, founder-naming), the legal-flagged package strings rendered verbatim (`verify.001`, `022`, `023`, `027`, `038`, `046`, `054`, `057`, `060`, `061`, `063`, `073`, `075`, `079`, `081`, `082`, `087`, `089`, `092`, `101`–`104`, `108`, `111`, `224`, `234`, `259`), the package's first-person lines (`verify.022`, `053`, `075`, `079`, `090`, `092`, `093`, `106`, … — W154: package copy waits for WP-C) and the v1.1-premised copy (`verify.041`–`047`, `084`, `106`, `108`); launch anchor sweep: `#report` present in both locales (W152/W158) | <YYYY-MM-DD> |
```
