### Task 14: Forms end-to-end on staging — every form instance through the real door, the failure paths, `generate_lead`, and the I4/I5/I12 + PRD §5.12 contract finalised

**What this task is.** T1–T13 port the thirteen page forms onto the WP2a forms kernel (`createFormAction` → `postForm` → `/tesekkurler?form=<key>` or the visitor fallback panel) and every page's e2e proves the *fallback* path deterministically (no door on any preview except `staging`, W92 → the `unauthorized`/`unconfigured` panel). Nothing yet proves the *success* path against the real Operations door with a real Turnstile token, a real inquiry/applicant in Operations, a real autoresponder, and exactly one `generate_lead` in the dataLayer — the Gate A sentence in the spec (§5: "forms create inquiries end to end on `staging.jobsadmire.com` with real Turnstile … all 13–15 forms produce exactly one `generate_lead` and one submission"). This task is that proof, in two halves that do not need the same prerequisite:

- **Automated, test-class, no Turnstile needed** (Cycles 5–6): 14 of the 17 form instances submitted through their real pages by a scripted browser — rows 15–17 (the fraud report with evidence files; the two careers applications, whose CV is a real PDF through the public `upload-cv`, which has no test class) skip themselves there and run only in Cycle 7 (W171) — against a deployment whose write-token slot holds `OPS_WEBSITE_TEST_TOKEN` and whose Turnstile site key is unset — the door treats the request as `isTest: true`, skips the captcha check (Ops X16: "a test-class call with no `captchaToken` skips the verify"), runs the handler as a `dryRun` (no Inquiry, no applicant, no mail, no abuse-trip count) and answers exactly like a real submission otherwise. This proves the wire contract, the redirect, the `generate_lead`/`conversion` pair and the browser failure-path mappings (replay, 404, 5xx/unreachable, honeypot — the 429/`tripped` mapping is proven by unit tests only, because a live trip would mean writing the production Operations Redis, W171) without an owner, without a real captcha, and without filing a single real lead — it can run **before the Turnstile site key arrives**.
- **Manual, owner-gated, real Turnstile** (Cycle 7): all 17 instances — the 14 automated ones once more, rows 15–17 for the first time — with a human solving a real Turnstile widget and the write token filing real Inquiries/Applicants in production Operations — the actual Gate A proof. This is the only half that needs the Turnstile site key + secret.

Plus the two docs that were left "once frozen" in WP1 and "joins this section in T14" in WP2a (`docs/INTEGRATIONS.md` I4 itself says so — see Interfaces): the per-form field table in the website's `docs/INTEGRATIONS.md` I4, the matching "Wire contract field table" in the Operations `docs/PRD.md` §5.12, and a form-instance inventory committed as data (not just prose) so the 17 rows are pinned by a test, not only by a Markdown table a human can silently let drift.

**Three code deltas, all small, all unit-tested — the rest is fixtures, scripts, protocol and docs.**

1. **`generate_lead` is fired by nobody today.** `src/analytics/track.ts`'s `ALLOWED_PARAMS.generate_lead` has existed since WP1, but `src/analytics/ConversionPing.tsx` pushes only `conversion` (verified in the code: its effect body calls `track('conversion', …)` once and nothing else) — a server action has no `dataLayer` and `redirect()` unmounts `FormShell` before either could push, so the WP2b page contract correctly forbids pages from firing it themselves. The one place that knows a submission succeeded *in the browser* is the thank-you page, so `ConversionPing` pushes `generate_lead` immediately before `conversion`, under the same R37 once-per-session-per-form+path dedupe. The GA4 key event and the Ads trigger therefore have the same count by construction — what `docs/ANALYTICS.md` § Weekly three-way reconciliation already assumes.
2. **`npm run door:smoke`** (`scripts/door-smoke.ts`): a headless, test-class probe of the door — ping, one valid body per form key, the deliberate replay, the deliberate 400, the unknown key, the inactive newsletter — printing a Markdown table for the ledger. Its pure half (`scripts/door-smoke.lib.ts`) is the I4 table in executable form — every required field per key, at the door's real caps — and is the seed of T15's synthetic-lead cron. It is a **headless HTTP probe** (Node `fetch` straight at the Operations door), distinct from the **browser** Playwright specs of Cycles 5–6, which drive the real pages; both use the TEST token, for different reasons (the script proves the wire contract fast, the browser specs prove the visitor path — Ops X16 warns a green smoke proves the door up to the handler and nothing about the visitor's captcha path).
3. **The fraud report's WhatsApp fallback lost who was reported** (W167). `FallbackPanel`'s `WHATSAPP_FIELDS` (`src/forms/client/FallbackPanel.tsx`) omits `suspectName` and `suspectContact`, so a fraud report that falls back to WhatsApp drops the one thing it exists for. Cycle 3b — one small foundation touch, placed before the staging cycles so `staging` carries it — appends `suspectName`, `suspectContact` and the sourcing partner's `licence`, pinned in `src/forms/__tests__/FallbackPanel.test.tsx`. Every other prefill omission is accepted for Phase A.

**Binding facts this task is written against** (read before starting; they decide the protocol below — each verified directly in the code or the docs during reconciliation, 2026-09-29):

- **The door is live and answers `401` without a token** (`GET /api/website/v1/ping` fails closed: `WebsiteModuleEnabledGuard` before `WebsiteApiGuard`, Operations `main` ≥ `47a2160`, flipped and proved 2026-09-24 per the Ops WP3a gate record). The flip is **done** — this task does not perform it, only verifies it (Cycle 4).
- **The owner has NOT supplied the Turnstile site key + secret yet.** This is the ONE hard prerequisite that gates Cycle 7 (the real-lead run) and nothing else — Cycles 1–6 need no Turnstile at all. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (website, Vercel Preview scoped to the `staging` branch) and the matching secret (Operations → Website → Integrations, DB-held on `WebsiteIntegrationConfig`) are named exactly in Cycle 4.
- **Test-class posts never count toward the abuse trip and never spend Turnstile — verified directly in `website-forms.service.ts`:** `const isTest = ctx.tokenClass === 'test'`; the captcha step is `isTest && !captchaToken ? { outcome: 'skipped' } : await this.captcha.verify(...)`; the abuse counter's `recordVerified` runs only in the `else if (!isTest)` branch. So a test-class request that already carries no token is never captcha-checked, and never increments `website:abuse:count:<form>` — but an *existing* trip still 429s it, because `isTripped(formKey)` is checked at step 1, before the `isTest` branch exists (order: form 404 → abuse trip 429 → whitelist 400 → honeypot → captcha → row). So a live 429 needs a trip marker written into the PRODUCTION Operations Redis (`website:abuse:tripped:<form>`), and no step of this task writes production Operations Redis or data (W171 — W100's Redis clause is withdrawn): the `tripped`/429 mapping is proven by `src/forms/__tests__/post.test.ts` (429 → `tripped`), `src/forms/__tests__/FallbackPanel.test.tsx` (the `tripped` panel, WhatsApp primary, bare href) and `scripts/door-smoke.test.ts`'s classifier; a live 429 proof is its own Operations follow-up (a test-class-only trip switch).
- **Token classes are `write` | `test` | `previous-write` — never "read" or "preview"** (Ops: `req.websiteTokenClass` is stamped from exactly these three; `previous-write` stays valid 24 h after a rotation). `docs/INTEGRATIONS.md` § Token threat model still enumerates "read, write, preview" — that sentence is stale against the real code and is corrected in Cycle 9 as a small, honest side-fix (not a rewrite of the whole section).
- **The retry rule is 9 s, one retry, connection-level failures only — already correct in the website docs, nothing to fix there.** Verified directly in `src/forms/post.ts`: `ATTEMPT_TIMEOUT_MS = 9000`, `MAX_ATTEMPTS = 2`, one shared `AbortSignal.timeout(9000)` for the whole call; the retry loop only continues when `!isTimeout(err) && attempt < MAX_ATTEMPTS` (a connection-level failure — DNS, refused, reset); a timeout or any HTTP answer (5xx included) is final. `docs/ARCHITECTURE.md` § Forms flow already states this correctly (confirmed by direct read, 2026-09-29) — earlier drafts of this task described an older "8 s / two full attempts" rule; that language does not appear anywhere in the current docs or code and must not be reintroduced.
- **Uploads are capped at 3 MiB per file, one file per server-action call, everywhere on the site** (`src/forms/uploads.ts`: `MAX_UPLOAD_BYTES = 3 * 1024 * 1024`, and `MAX_CV_BYTES`/`MAX_EVIDENCE_BYTES` both equal it — W73, lowered from 4 MiB by W116). The doors' own caps (careers CV 5 MB, fraud evidence 8 MB) are unreachable from this site and irrelevant to what this task uploads.
- **`Field`/`Button` primary face for a fallback panel is decided by kind, never a server-supplied string:** `FallbackPanel`'s `WHATSAPP_PRIMARY` set is exactly `{ tripped, unavailable, unauthorized, off }` (verified in the component); `captcha` and `failed` render the WhatsApp button `secondary`. The anchor's `href` is the bare `https://wa.me/<number>` — **no visitor data ever sits in the DOM** (W76/W95): the prefilled text is composed in the `onClick` handler and opened with `window.open(url, '_blank', 'noopener')`. Any instruction that says the href itself carries the prefill is wrong and must not appear in this task.
- **Real write-class submissions on `staging` (Cycle 7 only) file REAL inquiries/applicants in production Operations**, ring the bell of every `website.forms:VIEW` holder, e-mail the second human on every `WEBSITE_FORM_RECEIVED`, and autorespond to the e-mail address typed — the run uses a controller-owned mailbox, a `[T14-nn]` marker in every `name`, and a cleanup list. Cycles 5–6 (test-class) create only `isTest: true` dry-run rows: no Inquiry, no applicant, no mail, nothing to clean up beyond the rows themselves (90-day purge, X17). No automated cycle stores a file either: the evidence row (15) and the careers rows (16–17 — a real PDF through the public `upload-cv`, which has no test class) run only in Cycle 7, so automation never leaves an orphan `careers-cv/*.pdf` in production storage (W171).
- **`sessionStorage` dedupe (R37):** a second success of the same form key on the same thank-you path in one browser session fires NO second `generate_lead`/`conversion`. Every Playwright test that checks event counts uses a fresh browser context (Playwright's default per-test context already gives this; no extra step needed).
- **The worktree is `jobsadmire-website-wp2`, not `jobsadmire-website`.** All commands in this task run in `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2` on branch `wp2/foundation` (the "Paths" ruling in `B/reconcile-rulings.md`; earlier drafts named the plain `jobsadmire-website` checkout, which sits on `main` and is the wrong tree).
- **Door variables live on the `staging` branch only (W92) — never "all Preview".** `OPS_API_URL`, `OPS_WEBSITE_WRITE_TOKEN` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are Preview variables scoped to the git branch `staging` (plus Production); every other preview stays door-less so the other tasks' page e2e stays deterministic and no other task's gate run can file a real lead. `staging` tracks `wp2/foundation`, fast-forwarded by the controller when a door run is due.
- **The Vercel project is `jobsadmirewebsite`** (`prj_Ze3FSd1XbvNbIe2OF2UQjRZ2ZAD6`, team `tech-admire-apps`), **not** the spec's `jobsadmire-web-v2` — the owner connected the existing project on 2026-09-20. `main` is that project's Production Branch and never deploys by itself — two guards hold it until the Phase A cutover: `vercel.json`'s `"git": { "deploymentEnabled": { "main": false } }` and the project's Ignored Build Step (`docs/DEPLOYMENT.md` § Deploy discipline, `docs/WEBSITE-HANDOFF.md`); every other branch (`wp2/foundation`, `staging`, the throwaway `preview/*` branches) builds a Preview. The eventual cutover (WP7a) is the deliberate removal of both guards on this same project (W105: the `git.deploymentEnabled` flip), never a domain move to a second project — this task never changes the Production Branch or either guard. Any task text that still says `jobsadmire-web-v2` is wrong (T15's draft does; not this file's problem to fix, but this file must not repeat the mistake).
- **Operations is a separate repo and a shared VPS.** A push to Operations `main` is a production deploy within minutes, and this task's docs change (Cycle 8) would be one such push — so it is prepared as one docs-only commit on the branch `website/t14-forms-docs` in the Operations worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog` and pushed **only bundled with a peer session's next Operations push, announced first — never alone** (W171; workspace `CLAUDE.md` cross-app rule; the precedent is Task 8 itself, which held its push for the Inbox session's Release 1 and announced beforehand — `WORKSPACE-STATE.md`, 2026-09-28). **No step of this task writes to the production Operations Redis or database** beyond the door's own designed paths — the test-class dry-run rows of Cycles 2, 5 and 6 and the owner-gated real run of Cycle 7 (W171 withdrew W100's Redis clause: no trip marker, no SSH write to the shared VPS).

**Files:**

Create (worktree `WEB` = `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2`, branch `wp2/foundation`):
- `src/analytics/ConversionPing.test.tsx` — the two lead events, once, same dedupe
- `scripts/door-smoke.lib.ts` — pure: per-key smoke bodies (= the I4 required sets), outcome classification, the ledger table
- `scripts/door-smoke.test.ts` — the lib against the I4 table (required fields, caps, classification, table shape)
- `scripts/door-smoke.ts` — the headless runner (`npm run door:smoke`; test token only)
- `e2e/fixtures/form-instances.ts` — the 17-row form-instance inventory as typed data (page, URL, door key, `idScope`/`testId`, the fields to fill and their DOM names)
- `scripts/form-instances.test.ts` — Vitest, under `scripts/` like `scripts/face.test.ts` (Vitest's `include` never collects `e2e/**`, and Playwright's default `testMatch` would collect an `e2e/*.test.ts` and crash on the `vitest` import): the inventory pinned against `FORM_KEYS`, `door-smoke.lib.ts`'s `REQUIRED`/`CAPS` tables and the page specs it was extracted from
- `e2e/door-test-mode.spec.ts` — Playwright, test-class-only: the 17 happy-path instance tests (data-driven from the fixture; rows 15–17 skip themselves with the reason — Cycle 7 only, W171) + replay + 404 + 5xx/unavailable + honeypot, all gated on `E2E_DOOR_TEST_MODE=1` (skips itself otherwise, so it is harmless inside every other task's ordinary `npm run gate`)

Modify (`WEB`):
- `src/analytics/ConversionPing.tsx` (the effect body: the single `track('conversion', …)` call becomes the `generate_lead` + `conversion` pair)
- `src/forms/client/FallbackPanel.tsx` (`WHATSAPP_FIELDS` gains `suspectName`, `suspectContact`, `licence` after `message`, and its doc comment says why — W167, Cycle 3b; a WP2a foundation file, additive)
- `src/forms/__tests__/FallbackPanel.test.tsx` (two cases pinning the three appended fields — Cycle 3b)
- `docs/ARCHITECTURE.md` (§ Forms flow (D11), the fallback-panel bullet's prefill parenthetical names the three appended fields — Cycle 3b)
- `e2e/thank-you.spec.ts` (the `dataLayer`/`conversions` helpers gain a `leads` helper; the first test asserts `generate_lead` beside `conversion`; the "unknown form key" test gains one assertion that `generate_lead` also stayed silent)
- `package.json` (append `"door:smoke": "tsx scripts/door-smoke.ts"` as the LAST line of `"scripts"`, after `"assets:map"` — W42 additive-only; do not reorder or touch any other script line)
- `.env.example` (the `OPS_WEBSITE_TEST_TOKEN` comment currently ends "Not read by any code until T15" — it is read by `scripts/door-smoke.ts` and `e2e/door-test-mode.spec.ts` starting now; T15's cron is the second consumer, not the first)
- `docs/ANALYTICS.md` (the "WP1 wired exactly one of these seven events" paragraph's "declared but still uncalled" clause, restated ONCE from its post-T12 text — W168; § Weekly three-way reconciliation gains the two accepted skews)
- `docs/INTEGRATIONS.md` (I4: append the per-form field table + the 17-instance map + the verification record after the existing paragraph; I5 and I12: one "Verified on staging (T14)" sentence appended to each; § Token threat model: the stale "read, write, preview" class list corrected to the real three)
- `docs/DEPLOYMENT.md` (a new "## Staging alias and Deployment Protection" section; the `OPS_WEBSITE_TEST_TOKEN` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` env rows updated to say they are now consumed)
- `docs/OPERATING.md` (§ Synthetic lead: `npm run door:smoke` is the manual probe that exists today; the cron is still T15)
- `docs/PRD.md` (the "The forms kernel shipped in WP2a" paragraph gains one "Verified end to end on staging in T14" sentence)
- `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the T14 row of the `## Ledger` table T1 creates — W98, T1's six columns; appended in Cycle 10 after the proof; `## Task index` is the controller's assembly placeholder and is never edited by a task)

Create/Modify (Operations repo, in its existing worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog` — Task 8's, merged into `origin/main` and clean at this reconciliation — on a fresh branch `website/t14-forms-docs` off the current `origin/main`; **never** the shared checkout `jobsadmire-operations` or its `main`; one docs-only commit, pushed only bundled with a peer session's next Operations push, announced first, never alone — W171, Cycle 8; that push is a production deploy):
- `docs/PRD.md` §5.12: a new "**Wire contract field table (v1.1)**" after the existing catalog-v1.1 paragraph (which lists only the four *new* fields — this task adds the FULL per-key table, v1.0 + v1.1 together, that does not exist yet); the W110 upload-throttle follow-up paragraph gains the fraud-evidence throttle note (W170/W110); the newsletter "forwarded only on the visitor's click" gotcha is confirmed present (inserted only if a later push removed it); §12.2: the T14 entry, appended after whatever the current LAST dated entry is (grep at execution time — this doc gets same-day edits from concurrent sessions)
- `apps/backend/src/modules/website/website-docs-guard.spec.ts`: one new `it` appended after the LAST existing `it` block in the file (grep at execution time — Task 8 already added three; do not assume theirs is still the last one)

Test:
- `src/analytics/ConversionPing.test.tsx`, `src/forms/__tests__/FallbackPanel.test.tsx`, `scripts/door-smoke.test.ts`, `scripts/form-instances.test.ts` (Vitest); `e2e/thank-you.spec.ts`, `e2e/door-test-mode.spec.ts` (Playwright); Ops `website-docs-guard.spec.ts` (jest)

**Interfaces:**

Consumes (exact names, verified directly in `WEB/src/**` on 2026-09-29 — code over docs over drafts):
- `src/analytics/track.ts`: `track(event, params)`, `PARAM_ENUMS`, `ALLOWED_PARAMS.generate_lead = ['form_key','page','locale']` (identical shape to `conversion`'s).
- `src/analytics/forms.ts`: `FORM_KEYS = ['hire','contact','partner','careers','newsletter','callback','visit','calculator','fraud','workers'] as const`, `type FormKey`, `asFormKey`.
- `src/analytics/ConversionPing.tsx`: `ConversionPing({ formKey, locale })` — current effect body fires only `track('conversion', …)`, keyed by `` `ja_conv:${formKey}:${pathname}` `` in `sessionStorage`, wrapped in try/catch (fires rather than loses the lead when storage throws).
- `src/forms/consent.ts`: `CONSENT_VERSION = 'kvkk-2026-09' as const`.
- `src/forms/wire.ts`: `WireFields = Record<string, string | string[]>`, `WireEnvelope`, `buildEnvelope({ locale, fields, captchaToken?, honeypot?, sourcePath? })` — drops `''`/empty arrays; the smoke script and the fixture build their envelopes with it so the wire shape can never drift from the kernel's.
- `src/forms/options.ts`: `START_WHEN_KEYS = ['asap','month1','months1to3','planning'] as const`, `type StartWhenKey` — the ONE shared vocabulary (W78); T1, T2, T8 and this task's smoke/fixture all read it (the two-vocabulary drift check.md flagged against the original draft is already closed in `B/fixed/task-1.md`, which imports `START_WHEN_KEYS`).
- `src/forms/types.ts`: `PostFormOk`, `PostFormResult` (`kind`: `ok | invalid | captcha | off | tripped | unauthorized | unavailable`, the last with `cause: 'network' | 'timeout' | 'server'`), `FormFallbackKind`, `FORM_FALLBACK_KINDS`.
- `src/forms/post.ts`: `ATTEMPT_TIMEOUT_MS = 9000`, `MAX_ATTEMPTS = 2`, `postForm`'s status map (`mapResponse`): 200 + valid body → `ok`; 401 → `unauthorized`; 403 → `captcha`; 404 → `off`; 429 → `tripped`; ≥500 or a malformed 200 → `unavailable` (`cause: 'server'`); else → `invalid`. A connection failure retries once (`cause: 'network'` if it still fails); a timeout never retries (`cause: 'timeout'`).
- `src/forms/uploads.ts`: `MAX_UPLOAD_BYTES = 3 * 1024 * 1024`, `MAX_CV_BYTES`, `MAX_EVIDENCE_BYTES` (both equal `MAX_UPLOAD_BYTES`), `MAX_EVIDENCE_FILES = 3`, `uploadCv`, `uploadFraudEvidence`, `isFile`.
- `src/forms/client/FallbackPanel.tsx`: `data-testid="form-fallback"`, `data-kind={kind}`; `WHATSAPP_PRIMARY = new Set(['tripped','unavailable','unauthorized','off'])`; the anchor's `href` is the bare `https://wa.me/<number>` (no query string); the prefilled text is composed in `onClick` via `whatsappFallbackText` and opened with `window.open(...)`; `WHATSAPP_FIELDS` is module-private — an `as const` list of 20 names in reading order (`'name'` … `'description'`, `'message'`) that the exported `whatsappFallbackText(intro, values, label)` walks, skipping blanks, each line labelled `sys.form.labels.<name>` (`suspectName`, `suspectContact` and `licence` already exist in both locales).
- `src/forms/client/FormShell.tsx`: `data-form-key={formKey}` on the `<form>`; `data-testid={testId}` when passed; the consent checkbox's DOM `name` is `CONSENT_FIELD = 'consent'`; every field id is `` f-${idScope ?? formKey}-<name> ``.
- `src/forms/client/Turnstile.tsx`: `data-testid="turnstile"` on the widget host `<div>`; the script loads on the form's first `focusin`/`pointerdown` (never on page load).
- `src/app/api/site-health/ops.ts`: `OpsPing = { state: 'ok'|'off'|'unauthorized'|'unreachable'|'unconfigured', latencyMs, captcha: 'configured'|'missing'|null, trippedForms: string[] }`; `opsPingCheck` maps `ok → ok`, `unconfigured → skip`, everything else (**including `off`**, since the door went live — W75) `→ fail`.
- `src/app/api/site-health/route.ts` body: `{ ok, reasons, checks: { bundleTr, bundleEn, lastRevalidate, opsPing }, ops: OpsPing, formBeacons, contractVersion, source, commit, at }`.
- `e2e/helpers/face.ts`: `siteFace(baseUrl, env)` (preview: `*.vercel.app` or `staging.jobsadmire.com`, or `NEXT_PUBLIC_SITE_FACE` set to non-`production`; an UNSET face is production), `lighthouseConfigFor`.
- `e2e/helpers/bypass.ts`: `protectionBypassHeaders(env)` — `{ 'x-vercel-protection-bypass': secret }` only when `VERCEL_AUTOMATION_BYPASS_SECRET` is non-blank.
- `e2e/ops.spec.ts`'s pattern: `test.skip(!SECRET, reason)` for a token-gated case, and `expect([401, 503]).toContain(res.status())` for a refusal case door-less previews answer fail-closed (W139) — this task's new spec follows the identical shape for its own `E2E_DOOR_TEST_MODE` gate.
- Operations door as built (`P/operations-door-contract-as-built.md`, `A/produces-final.md` § Task 8, and direct reads of `jobsadmire-operations/apps/backend/src/modules/website/*` on 2026-09-29 — the code, since the local Operations checkout's own `docs/PRD.md` is ten commits behind `origin/main` on this exact material): `POST ${OPS_API_URL}/api/website/v1/forms/:formKey`, `GET …/ping`, `POST …/uploads/fraud-evidence`, `POST /api/careers/upload-cv` (public, pre-existing), `GET /api/careers/openings` (public, pre-existing, not a `website/v1` route); catalog v1.0 + v1.1 (`city`, `partner.track`, `contact.topic`, `careers.portfolioUrl`); dedupe `@@unique([formKey, requestHash, hourBucket])` where `requestHash = sha256(formKey, isTest, honeypot-was-filled, locale, sorted normalised fields)` (`sourcePath` is **not** hashed); `WEBSITE_ABUSE_TRIP_THRESHOLD = 25` over a `WEBSITE_ABUSE_WINDOW_SEC = 3600` rolling window; trip keys `website:abuse:{count,tripped,announced}:<form>` (`website-alarms.logic.ts`); order of evaluation `form (404) → abuse trip (429) → whitelist (400) → honeypot (SPAM) → captcha (403) → row`; token classes `write | test | previous-write` (`req.websiteTokenClass`); test class: `isTest = tokenClass === 'test'`, captcha `isTest && !captchaToken ? skipped : verify(...)`, `recordVerified` only in `else if (!isTest)`, handler runs `dryRun: isTest` (no Inquiry/applicant/subscriber/notification/autoresponder); inbox `/admin/website/inbox?row=<id>` (`website.forms:VIEW`, search case-insensitive e-mail only, `needsAttention` accepts only the literal `'true'`); Integrations `/admin/website/integrations` (`website.integrations:VIEW/EDIT`; secret rotate `POST /api/website/integrations/rotate/:name` → `{ name, secret, previousExpiresAt }`; Test button `POST /api/website/integrations/test` → `{ ok, error }`; second-human fields via `PATCH /api/website/integrations`; `website:MANAGE_KEYS` gates every secret write).
- Ops docs guard: `apps/backend/src/modules/website/website-docs-guard.spec.ts` — `readRoot('docs/PRD.md')` bound to `prd`; **as of `origin/main`, 21 `it` blocks exist (Task 8 already added 3 to the local 18)** — this task's new `it` is appended after whichever is last at execution time, never a hardcoded count.

Produces:
- `ConversionPing` fires `generate_lead` + `conversion` (T15's Gate A checklist reads "exactly one `generate_lead` per submission" against this).
- `scripts/door-smoke.lib.ts` exports `SMOKE_KEYS`, `smokeFields(formKey, stamp, extra?)`, `smokeEnvelope(formKey, locale, stamp, fields?)`, `classifySmoke(formKey, status, body)`, `expectedSmokeKind(formKey)`, `formatSmokeTable(rows)` — T15's synthetic-lead cron (`/api/cron/synthetic-lead`) builds its body with `smokeFields('hire', stamp)` and never re-encodes the catalog.
- `npm run door:smoke` — the manual door probe (`docs/OPERATING.md` § Synthetic lead).
- `e2e/fixtures/form-instances.ts` — `FORM_INSTANCES` (17 rows) and `NON_DOOR_INSTANCES` — the machine-checkable inventory any later task (T15's Gate A checklist, a regression tool) can iterate instead of re-deriving the list from the page tasks by hand.
- `e2e/door-test-mode.spec.ts` — the repeatable, no-owner-needed proof of 14 instances' wire shape (rows 15–17 skip themselves — Cycle 7 only, W171) and of the replay/404/unavailable/honeypot mappings (429 is unit-proven), gated by `E2E_DOOR_TEST_MODE=1` so it is inert everywhere else.
- `FallbackPanel`'s WhatsApp prefill carries `suspectName`, `suspectContact` and `licence` (W167, Cycle 3b) — T10's fraud report and T5's sourcing track fall back with who was reported and the licence number.
- `docs/INTEGRATIONS.md` I4 field table + instance map = the website-side contract of record; Ops `docs/PRD.md` §5.12 "Wire contract field table (v1.1)" = the Ops-side mirror (both pinned: the Ops one by the docs guard, the website one by `scripts/form-instances.test.ts` and `scripts/door-smoke.test.ts`'s required-set tables).

**Rulings applied:**
- **W73/W116** — every upload ≤ 3 MiB, one file per server-action call: the CV (`t14-cv.pdf`) and every evidence file in Cycles 6–7 are sized under that, never "5 MB"/"8 MB" as an earlier draft assumed.
- **W74/W117/W153** — the retry rule (one retry, connection-level only, one 9 s shared deadline, a timeout or a 5xx final); Cycle 6's unreachable/timeout steps state timings against this, not the older "8 s / two attempts" text.
- **W75** — `off`, `unauthorized` and `unreachable` are all a site-health `fail` now (only `unconfigured` is `skip`); Cycle 4's site-health checks and Cycle 6's `off`/`unavailable` steps read the body accordingly, never expecting `skip`.
- **W76/W95** — no visitor data in any DOM href; the fallback panel's WhatsApp anchor is bare, the prefill is click-time only.
- **W78** — `START_WHEN_KEYS` is the one shared vocabulary; the smoke lib and the fixture use it, never an invented key like `'m1'`.
- **W92** — door variables (`OPS_API_URL`, `OPS_WEBSITE_WRITE_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) are Preview variables scoped to the `staging` branch only, never all Preview branches.
- **W99** — this task runs after T1–T13 (T1 → T13 → T2 → … → T12 → T14 → T15); every field/anchor cited here is read from the *fixed* page tasks, not re-derived.
- **W100 (as amended by W171)** — this task's Operations docs commit rides only with a peer session's next Operations push, announced first, never alone; W100's Redis clause is withdrawn — there is no Redis write in this task.
- **W105 (the T14-specific corrections)** — applied throughout: the careers smoke body uses the *opening's own* `country`, never a hardcoded `'TR'`; `CAPS.city` follows the catalog per form (`careers.city` ≤ 100, every other form's `city` ≤ 120); the instance map matches the page specs exactly (T8's `workers` always sends `country: 'TR'` and requires `city`; T10's `fraud` requires both `reporterName` and `reporterEmail`); the project is `jobsadmirewebsite`, never `jobsadmire-web-v2`; `generate_lead` fires from `ConversionPing`, never "the kernel"; W74/W75 wording replaces the old retry/`off` text everywhere in this file.
- **W135/W139/W140** — the site-face helper, the 401|503 refusal pattern, and the preview Lighthouse config skipping `is-crawlable` + `robots-txt` are the model for how `e2e/door-test-mode.spec.ts` self-gates and how any preview-face assertion in this task is written.
- **W146** — GTM/GA4/Ads ids are Production-only; `staging` is a Preview face and stays dark, so every `generate_lead`/`conversion` proof in this task reads `window.dataLayer` directly (Playwright `page.evaluate`), never GA4 DebugView or Tag Assistant.
- **W137 (amended)** — the bypass header flag is `--settings.extraHeaders=<JSON>`, never `--extra-headers`; the report folders that carry the secret verbatim (`.lighthouseci/`, `lighthouse-report/`, `.pixel/`, `playwright-report/`, `test-results/`) are deleted after any run against a protected preview.
- **W167** — Cycle 3b appends `suspectName`, `suspectContact` and `licence` to `FallbackPanel`'s `WHATSAPP_FIELDS` (after `message`, in that order), pinned in `FallbackPanel.test.tsx`, its own commit, before the staging cycles; every other prefill omission and the raw option values stay accepted for Phase A (label mapping is Phase B).
- **W168** — `generate_lead` fires only from `ConversionPing` (Cycle 1), immediately before `conversion`, same params, same R37 key; `docs/ANALYTICS.md`'s "declared but still uncalled" clause is restated ONCE from its post-T12 text as "`language_switch` is declared but still uncalled; the five W26 page events are wired by their pages (T4, T5, T7, T10, T11)", and the per-page bullets read "`generate_lead` fires beside it — T14".
- **W171** — no step writes the production Operations Redis or database outside the door's test-class dry run and the owner-gated Cycle 7: Cycle 6 has no trip marker, and the `tripped`/429 mapping is proven by `post.test.ts`, `FallbackPanel.test.tsx` and `door-smoke.test.ts`; rows 15 (fraud + evidence) and 16–17 (careers, real PDFs) skip themselves in Cycle 5 with the reason and run only in Cycle 7 with the write token; the Operations docs-only commit (PRD §5.12: the I4 table, the newsletter click-only rule, the fraud-evidence throttle note) is prepared on `website/t14-forms-docs` in the `jobsadmire-operations-catalog` worktree and pushed only bundled with a peer session's next Operations push, announced first.
- **W172** — `scripts/door-smoke.lib.ts`'s `smokeFields` is the body T15's synthetic-lead cron (`src/app/api/cron/synthetic-lead/route.ts`) builds with; this task builds the lib and the manual probe, never the cron.
- **W178** — every committing cycle's Step 4 ends with the FULL low-memory verify line (`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) before its commit; a scoped vitest run may precede it, never replace it.
- **§6 of `wp2a-final-review.md` (drift list)** — the general corrections it names apply here where relevant: `toBe(401)` → `[401, 503]` (this task's own refusal-style assertions, and the pattern anything reusing `e2e/ops.spec.ts`'s style must follow); no barrel imports (`scripts/door-smoke.lib.ts`, the fixture and `scripts/form-instances.test.ts` import `src/analytics/forms`, `src/forms/wire`, `src/forms/options`, `src/forms/consent` by their own module paths, relative `../src/…` as every `scripts/*.ts` does — none of these are barrels); the GTM-dark-face correction (folded into W146 above).

---

#### Cycle 1 — `generate_lead` on the thank-you page (the foundation gap this task closes)

- [ ] **Step 1: Write the failing test**

`src/analytics/ConversionPing.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryStorage } from '@/test/storage';
import { ConversionPing } from './ConversionPing';

// R35: the `page` param is the real URL, so the component reads next/navigation's pathname.
vi.mock('next/navigation', () => ({ usePathname: () => '/tesekkurler' }));

type Entry = Record<string, unknown>;
const layer = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;
const events = (name: string) => layer().filter((e) => e.event === name);

describe('ConversionPing (D13 lead events on the thank-you page)', () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
    // Node ≥23 ships a stub `sessionStorage` without the Storage API (src/test/storage.ts).
    Object.defineProperty(window, 'sessionStorage', { value: memoryStorage(), configurable: true });
  });

  it('pushes exactly one generate_lead and one conversion, generate_lead first, same params', () => {
    render(<ConversionPing formKey="hire" locale="tr" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
    const expected = { form_key: 'hire', page: '/tesekkurler', locale: 'tr' };
    expect(events('generate_lead')[0]).toEqual({ event: 'generate_lead', ...expected });
    expect(events('conversion')[0]).toEqual({ event: 'conversion', ...expected });
    // GA4's key event before the Ads trigger — the GTM container's conversion tag fires on
    // `conversion`, and both must exist by the time it does.
    const names = layer().map((e) => e.event);
    expect(names.indexOf('generate_lead')).toBeLessThan(names.indexOf('conversion'));
  });

  it('dedupes both events per session per form+path (R37) — a remount fires neither again', () => {
    const first = render(<ConversionPing formKey="contact" locale="en" />);
    first.unmount();
    render(<ConversionPing formKey="contact" locale="en" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
    expect(window.sessionStorage.getItem('ja_conv:contact:/tesekkurler')).toBe('1');
  });

  it('a different form key in the same session still counts', () => {
    render(<ConversionPing formKey="hire" locale="tr" />);
    render(<ConversionPing formKey="workers" locale="tr" />);
    expect(events('generate_lead').map((e) => e.form_key)).toEqual(['hire', 'workers']);
    expect(events('conversion').map((e) => e.form_key)).toEqual(['hire', 'workers']);
  });

  it('fires (rather than loses the lead) when storage throws', () => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    render(<ConversionPing formKey="calculator" locale="en" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
  });
});
```

`e2e/thank-you.spec.ts` — Modify the file's helpers and first test. Find the current helpers with `grep -n "const conversions" e2e/thank-you.spec.ts` (they read `const dataLayer = ...` then `const conversions = async (page, formKey) => ...`); replace them and the first test with:

```ts
type DataLayerEntry = Record<string, unknown>;

const dataLayer = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? [],
  ) as Promise<DataLayerEntry[]>;

const eventsFor = async (page: import('@playwright/test').Page, event: string, formKey: string) =>
  (await dataLayer(page)).filter((e) => e.event === event && e.form_key === formKey);
const conversions = (page: import('@playwright/test').Page, formKey: string) =>
  eventsFor(page, 'conversion', formKey);
const leads = (page: import('@playwright/test').Page, formKey: string) =>
  eventsFor(page, 'generate_lead', formKey);

test('the Turkish conversion page is noindex and fires generate_lead + conversion once', async ({
  page,
}) => {
  const res = await page.goto('/tesekkurler?form=hire');
  expect(res?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveCount(1);

  await expect.poll(async () => conversions(page, 'hire')).toHaveLength(1);
  expect(await leads(page, 'hire')).toHaveLength(1);
  expect((await conversions(page, 'hire'))[0]).toMatchObject({
    page: '/tesekkurler',
    locale: 'tr',
  });
  expect((await leads(page, 'hire'))[0]).toMatchObject({ page: '/tesekkurler', locale: 'tr' });

  // R37: a reload (or a back-forward restore) must not re-count the same lead — the
  // per-session key survives the navigation, and the fresh dataLayer stays empty of both.
  await page.reload();
  await page.waitForTimeout(300);
  expect(await conversions(page, 'hire')).toHaveLength(0);
  expect(await leads(page, 'hire')).toHaveLength(0);
});
```

The second test ("the English conversion page answers under /en") is unchanged. The third test ("an unknown form key … without firing a conversion") gains one line right after its existing `expect((await dataLayer(page)).filter((e) => e.event === 'conversion')).toHaveLength(0);`:

```ts
  expect((await dataLayer(page)).filter((e) => e.event === 'generate_lead')).toHaveLength(0);
```

The fourth test (consent defaults) is unchanged.

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/analytics/ConversionPing.test.tsx --maxWorkers=1
```
Expected: 4 of 4 fail — every case expects one `generate_lead` and the component pushes only `conversion` today (verified in the current source): `expected [] to have a length of 1` on `events('generate_lead')`, and the "different form key" case on `['hire','workers']` vs `[]`.

- [ ] **Step 3: Implement**

`src/analytics/ConversionPing.tsx` — Modify the effect body. Find it with `grep -n "sessionStorage.setItem(k, '1')" src/analytics/ConversionPing.tsx`; the block from `const k = ...` through the first `sessionStorage.setItem(k, '1')` (inclusive) becomes:

```tsx
    const k = `ja_conv:${formKey}:${pathname}`;
    try {
      if (sessionStorage.getItem(k)) return;
    } catch {
      // storage blocked (private mode): no dedupe available — fire rather than lose the lead.
    }
    // Two events, one trigger, one dedupe (T14): `generate_lead` is GA4's key event for a lead
    // form and what docs/ANALYTICS.md's weekly three-way reconciliation counts; `conversion` is
    // the GTM trigger of the Ads conversion tag. Neither can be fired by the server action (no
    // dataLayer there) nor by the FormShell (redirect() unmounts it), so the thank-you page —
    // the only place the browser learns a submission succeeded — fires both, key event first.
    const params = { form_key: formKey, page: pathname, locale };
    track('generate_lead', params);
    track('conversion', params);
    try {
      sessionStorage.setItem(k, '1');
    } catch {
      /* private mode */
    }
```

Also update the component's doc comment (the block starting `/** The conversion, fired on arrival at ...`) first sentence to: `/** The two lead events, fired on arrival at \`/tesekkurler?form=<key>\` (D13) — the single navigation every form's success path lands on: \`generate_lead\` (GA4's key event) then \`conversion\` (the Ads trigger). Renders nothing; carries only the form key, the path and the locale, never anything the visitor typed.`

`docs/ANALYTICS.md`:

- Modify the paragraph beginning "**WP1 wired exactly one of these seven events: `conversion`**" (find it with `grep -n "WP1 wired exactly one"`). Its tail clause lists the events still "declared but still uncalled"; W168 has this task restate that clause ONCE, from its post-T12 text. At WP2a it read `` `generate_lead`, `calculator_use`, `language_switch` and the five W26 page events are declared but still uncalled — they land with the forms kernel's page specs, the calculator page, the switcher work and the pages that own them in WP2b. ``; T3 removed `calculator_use` from the list, T4 replaced "the five W26 page events are declared but still uncalled" with "four of the five W26 page events are declared but still uncalled (`eligibility_check_complete` fires from the Work Permit wizard since WP2b T4)", and no other task before this one edits the clause — so after T12 it reads exactly `` `generate_lead`, `language_switch` and four of the five W26 page events are declared but still uncalled (`eligibility_check_complete` fires from the Work Permit wizard since WP2b T4) — they land with the forms kernel's page specs, the calculator page, the switcher work and the pages that own them in WP2b. `` Re-read it first (`grep -n "declared but still uncalled" docs/ANALYTICS.md`); if the sentence differs from that text, stop and report (W176's stop-and-report guard) instead of merging by hand. Replace that whole sentence — from its leading `` `generate_lead`, `` through `in WP2b.` — with exactly these two sentences, which drop the stale "the calculator page" tail (T3 wired `calculator_use`) and state the W26 events as they now stand: `` `generate_lead` is wired since T14: `ConversionPing` pushes it beside `conversion` on the thank-you page (same R37 dedupe), so a GA4 lead and an Ads conversion can never disagree by construction. `language_switch` is declared but still uncalled; the five W26 page events are wired by their pages (T4, T5, T7, T10, T11). `` Everything else in the paragraph stays as it is.
- In the `### Page instrumentation (WP2b)` bullets, replace every occurrence of `` `generate_lead` has no caller yet — T14 wires it beside `conversion` there `` with `` `generate_lead` fires beside it — T14 `` (T2's Hire Workers, T5's Partner With Us, T8's Available Workers and T11's Careers bullets carry it — `grep -n 'has no caller yet' docs/ANALYTICS.md` lists 4 hits before the edit and none after); the other page bullets name only `conversion` from `ConversionPing` and stay as they are.
- Append to the end of "## Weekly three-way reconciliation" (after its existing paragraph): "Two known, accepted skews, closed out by T14: (1) `generate_lead` is deduped per browser session per form key (R37), so a visitor who sends two *different* requests through the same form in one session is one lead event and two submissions; (2) the door dedupes *identical* bodies within a clock hour (`replayed: true`), which the site treats as success, so a visitor who double-submits the same body is one submission and — in a fresh session — could be two lead events. Both are visitor-rare; neither is a wiring fault. Verified end to end on `staging` in T14 (`docs/INTEGRATIONS.md` I4 § Verification record)."

- [ ] **Step 4: Verify** — the scoped run first, then the FULL low-memory verify line before the commit (W178; a scoped run never gates a commit on its own):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/ANALYTICS.md src/analytics e2e/thank-you.spec.ts && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/analytics --maxWorkers=1
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the scoped run — `ConversionPing.test.tsx` 4 passed, `track.test.ts` unchanged; the full line — typecheck/lint/format green and every Vitest file green (nothing else imports `ConversionPing`). Never `npm run verify`/`test`/`e2e` (memory rule); the Playwright half of this cycle (`e2e/thank-you.spec.ts`) runs in Cycle 10's gate.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add src/analytics/ConversionPing.tsx src/analytics/ConversionPing.test.tsx e2e/thank-you.spec.ts docs/ANALYTICS.md
git commit -m "feat(analytics): generate_lead fires beside conversion on the thank-you page, same R37 dedupe (T14)

Nobody fired generate_lead: WP1's ConversionPing pushed only conversion, a
server action has no dataLayer and redirect() unmounts the FormShell. The
thank-you page is the one place the browser learns a submission succeeded,
so it pushes GA4's key event first and the Ads trigger second, once per
session per form+path. docs/ANALYTICS.md: the uncalled-events clause restated
once (W168), the per-page bullets, the two accepted reconciliation skews.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 2 — `npm run door:smoke`: the test-class door probe and the I4 table as code

- [ ] **Step 1: Write the failing test**

`scripts/door-smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { CONSENT_VERSION } from '../src/forms/consent';
import {
  classifySmoke,
  expectedSmokeKind,
  formatSmokeTable,
  SMOKE_KEYS,
  smokeEnvelope,
  smokeFields,
  type SmokeRow,
} from './door-smoke.lib';

/** docs/INTEGRATIONS.md I4 (v1.1) — the REQUIRED field per key. A key missing here or a
 *  field missing from `smokeFields` is a 400 at the door, and this table is what the doc
 *  table (Cycle 8) is copied from. Keep the two in step. */
const REQUIRED: Record<FormKey, readonly string[]> = {
  hire: ['name', 'company', 'email', 'phone'],
  contact: ['name', 'email', 'message'],
  partner: ['name', 'company', 'email', 'phone', 'country'],
  workers: ['name', 'company', 'email', 'phone'],
  callback: ['name', 'phone'],
  visit: ['name', 'email', 'phone'],
  calculator: ['name', 'email'],
  careers: ['openingSlug', 'cvKey', 'name', 'email', 'phone', 'country'],
  fraud: ['description'],
  newsletter: ['email'],
};

/** Length caps of every field the smoke bodies send (catalog v1.0 + v1.1, `docs/INTEGRATIONS.md`
 *  I4). The catalog's per-key differences ride in CAP_OVERRIDES: `careers.city` 100 (120 elsewhere),
 *  `careers.name` 200 (120 elsewhere), `callback.topic` 200 (free text; `contact.topic` is the
 *  ≤ 40 enum), `visit.preferredTime` 40 (120 on `callback`) — P/operations-door-contract-as-built.md. */
const CAPS: Record<string, number> = {
  name: 120, company: 200, email: 254, phone: 40, country: 2, iAm: 40, sector: 120, roleNeeded: 200,
  headcount: 10, startWhen: 120, message: 5000, city: 120, subject: 200, topic: 40, candidatesPerYear: 20,
  trades: 500, licence: 200, track: 40, trade: 200, preferredTime: 120, office: 120, preferredDate: 40,
  durationMonths: 10, estimateSummary: 2000, openingSlug: 200, cvKey: 300, language: 300,
  expectedSalary: 20, expectedSalaryCurrency: 3, coverLetter: 5000, portfolioUrl: 500,
  reporterName: 120, reporterEmail: 254, reporterPhone: 40, description: 5000, suspectName: 200, suspectContact: 300,
};
const CAP_OVERRIDES: Partial<Record<FormKey, Partial<Record<string, number>>>> = {
  careers: { city: 100, name: 200 },
  callback: { topic: 200 },
  visit: { preferredTime: 40 },
};
const capFor = (key: FormKey, field: string): number => CAP_OVERRIDES[key]?.[field] ?? CAPS[field];

describe('door-smoke.lib — the I4 table as code', () => {
  it('covers every FORM_KEY once, in FORM_KEYS order', () => {
    expect([...SMOKE_KEYS]).toEqual([...FORM_KEYS]);
  });

  it('every smoke body carries every required field of its key, non-empty, under its cap', () => {
    for (const key of FORM_KEYS) {
      const fields = smokeFields(key, '20260921T120000Z', { cvKey: 'careers-cv/smoke.pdf', openingSlug: 'some-opening', country: 'TR' });
      for (const req of REQUIRED[key]) {
        expect({ key, req, present: typeof fields[req] === 'string' && fields[req].length > 0 }).toEqual({ key, req, present: true });
      }
      for (const [name, value] of Object.entries(fields)) {
        const cap = capFor(key, name);
        expect({ key, name, capped: cap !== undefined }).toEqual({ key, name, capped: true });
        if (typeof value === 'string') expect(value.length).toBeLessThanOrEqual(cap);
      }
    }
  });

  it('careers.city stays under its own 100-char cap even though every other city is 120', () => {
    // door-smoke never sends a city long enough to matter today, but a future edit that does
    // must fail here first, not at the door.
    expect(capFor('careers', 'city')).toBe(100);
    expect(capFor('hire', 'city')).toBe(120);
  });

  it('stamps the body so two runs in one hour never replay (sourcePath is not hashed — a field must vary)', () => {
    const a = smokeFields('hire', 'A');
    const b = smokeFields('hire', 'B');
    expect(a).not.toEqual(b);
    expect(JSON.stringify(a)).toContain('A');
  });

  it('sends stable option keys (W77/W78), ISO-2 upper-case countries and ≥ 8-digit phones', () => {
    expect(smokeFields('hire', 's').iAm).toBe('direct_employer');
    expect(smokeFields('hire', 's').sector).toBe('factory');
    expect(smokeFields('hire', 's').startWhen).toBe('month1');
    expect(['asap', 'month1', 'months1to3', 'planning']).toContain(smokeFields('workers', 's').startWhen);
    expect(smokeFields('partner', 's').country).toMatch(/^[A-Z]{2}$/);
    expect(smokeFields('partner', 's').track).toBe('sourcing');
    expect(smokeFields('contact', 's').topic).toBe('hire');
    expect((smokeFields('hire', 's').phone as string).replace(/\D/g, '').length).toBeGreaterThanOrEqual(8);
    expect(smokeFields('fraud', 's').description).toHaveLength(60);
  });

  it('careers needs the caller to supply a real cvKey, openingSlug AND the opening’s own country', () => {
    expect(() => smokeFields('careers', 's')).toThrow(/cvKey/);
    expect(() => smokeFields('careers', 's', { cvKey: 'careers-cv/x.pdf', openingSlug: 'o' })).toThrow(/country/);
    const fields = smokeFields('careers', 's', { cvKey: 'careers-cv/x.pdf', openingSlug: 'o', country: 'PK' });
    expect(fields.cvKey).toBe('careers-cv/x.pdf');
    // W105: the residency rule checks `country === opening.country` — a hardcoded 'TR' would
    // answer 200 + FAILED for a non-TR opening, and a flat classifier would wrongly call that `ok`.
    expect(fields.country).toBe('PK');
  });

  it('the envelope is the kernel’s wire shape with the site-wide consent version', () => {
    const env = smokeEnvelope('callback', 'en', 'S1');
    expect(env).toEqual({
      locale: 'en',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/door-smoke/S1',
      fields: smokeFields('callback', 'S1'),
    });
    expect(Object.keys(env).sort()).toEqual(['consentVersion', 'fields', 'locale', 'sourcePath']);
  });

  it('classifies the door’s answers like postForm does', () => {
    const ok = { data: { id: 'sub_1', formKey: 'hire', status: 'HANDLED', isTest: true, replayed: false, captchaDegraded: false, error: null } };
    expect(classifySmoke('hire', 200, ok)).toMatchObject({ kind: 'ok', doorStatus: 'HANDLED', isTest: true, replayed: false, id: 'sub_1' });
    expect(classifySmoke('hire', 200, { ...ok, data: { ...ok.data, replayed: true } })).toMatchObject({ kind: 'ok', replayed: true });
    expect(classifySmoke('hire', 200, { data: { ...ok.data, status: 'FAILED', error: 'nope' } })).toMatchObject({ kind: 'ok', doorStatus: 'FAILED', message: 'nope' });
    expect(classifySmoke('hire', 400, { message: 'Invalid form fields', errors: ['country must be a two-letter ISO code'] })).toMatchObject({ kind: 'invalid', errors: ['country must be a two-letter ISO code'] });
    expect(classifySmoke('hire', 401, { message: 'Invalid website token.' })).toMatchObject({ kind: 'unauthorized' });
    expect(classifySmoke('hire', 403, { message: 'Captcha verification failed. Please retry.' })).toMatchObject({ kind: 'captcha' });
    expect(classifySmoke('newsletter', 404, { message: 'This form is not accepting submissions.' })).toMatchObject({ kind: 'off', message: 'This form is not accepting submissions.' });
    expect(classifySmoke('hire', 404, null)).toMatchObject({ kind: 'off' });
    expect(classifySmoke('visit', 429, { statusCode: 429, message: 'paused', reason: 'tripped', fallback: 'whatsapp' })).toMatchObject({ kind: 'tripped', fallback: 'whatsapp' });
    expect(classifySmoke('hire', 502, null)).toMatchObject({ kind: 'unavailable' });
    expect(classifySmoke('hire', 200, { html: true })).toMatchObject({ kind: 'unavailable' }); // R28: a 200 that is not the door
  });

  it('expects ok everywhere except the D14-inactive newsletter', () => {
    for (const key of FORM_KEYS) expect(expectedSmokeKind(key)).toBe(key === 'newsletter' ? 'off' : 'ok');
  });

  it('formats a Markdown table the ledger can paste, with a pass column', () => {
    const rows: SmokeRow[] = [
      { formKey: 'hire', http: 200, kind: 'ok', doorStatus: 'HANDLED', isTest: true, replayed: false, id: 'sub_1', message: null, errors: [], fallback: null, expected: 'ok', pass: true },
      { formKey: 'newsletter', http: 404, kind: 'off', doorStatus: null, isTest: null, replayed: null, id: null, message: 'This form is not accepting submissions.', errors: [], fallback: null, expected: 'off', pass: true },
    ];
    const table = formatSmokeTable(rows);
    expect(table.split('\n')[0]).toBe('| form | http | kind | door status | isTest | replayed | id | message | pass |');
    expect(table).toContain('| hire | 200 | ok | HANDLED | true | false | sub_1 |  | ✓ |');
    expect(table).toContain('| newsletter | 404 | off | — | — | — | — | This form is not accepting submissions. | ✓ |');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/door-smoke.test.ts --maxWorkers=1
```
Expected: the suite fails to load — `Cannot find module './door-smoke.lib'`.

- [ ] **Step 3: Implement**

`scripts/door-smoke.lib.ts`:

```ts
/**
 * The pure half of `npm run door:smoke` (T14) and the body builder T15's synthetic-lead cron
 * reuses. One valid body per form key = docs/INTEGRATIONS.md I4's REQUIRED sets, as code: a
 * 400 from the door means this table is wrong, not the door. Values are stable option KEYS
 * (W77), the shared `START_WHEN_KEYS` (W78), ISO-2 upper-case countries, ≥ 8-digit phones —
 * exactly what the pages send (verified per-page against `B/fixed/task-{1,2,3,5,7,8,10,13}.md`
 * and `task-11.md`, re-diffed at the recheck).
 *
 * No `server-only` here (unit-tested, like src/content/pure.ts — R2); the runner carries the
 * token and is never imported by src/**.
 */
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { CONSENT_VERSION } from '../src/forms/consent';
import { START_WHEN_KEYS } from '../src/forms/options';
import { buildEnvelope, type WireEnvelope, type WireFields } from '../src/forms/wire';
import type { Locale } from '../src/i18n/routing';

export const SMOKE_KEYS: readonly FormKey[] = FORM_KEYS;

export type SmokeKind = 'ok' | 'invalid' | 'captcha' | 'off' | 'tripped' | 'unauthorized' | 'unavailable';

export type SmokeRow = {
  formKey: string;
  http: number;
  kind: SmokeKind;
  doorStatus: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM' | null;
  isTest: boolean | null;
  replayed: boolean | null;
  id: string | null;
  message: string | null;
  errors: string[];
  fallback: string | null;
  expected: SmokeKind;
  pass: boolean;
};

export type SmokeExtra = { cvKey?: string; openingSlug?: string; country?: string };

const NAME = (stamp: string) => `[door-smoke ${stamp}]`;
const EMAIL = 'door-smoke@jobsadmire.com';
const PHONE = '+905000000000';
const MESSAGE = (stamp: string) => `Synthetic test-class submission ${stamp} — no action needed.`;
/** The middle of the shared W78 vocabulary — never the invented, non-existent `'m1'`. */
const START_WHEN: (typeof START_WHEN_KEYS)[number] = START_WHEN_KEYS[1];

/** One valid, catalog-conformant body per key. `stamp` rides in `name`/`message` so two runs
 *  inside one clock hour never dedupe onto the same row (`sourcePath` is NOT hashed). */
export function smokeFields(formKey: FormKey, stamp: string, extra: SmokeExtra = {}): WireFields {
  const name = NAME(stamp);
  switch (formKey) {
    case 'hire':
      return { name, company: 'Door Smoke Ltd', email: EMAIL, phone: PHONE, country: 'TR', iAm: 'direct_employer', sector: 'factory', roleNeeded: 'welder', headcount: '5', startWhen: START_WHEN, city: 'Antalya', message: MESSAGE(stamp) };
    case 'contact':
      return { name, email: EMAIL, phone: PHONE, company: 'Door Smoke Ltd', country: 'TR', iAm: 'direct_employer', topic: 'hire', subject: 'door smoke', city: 'Antalya', message: MESSAGE(stamp) };
    case 'partner':
      return { name, company: 'Door Smoke Sourcing', email: EMAIL, phone: PHONE, country: 'PK', track: 'sourcing', licence: 'LIC-SMOKE', candidatesPerYear: '50', trades: 'welder, cnc', city: 'Karachi', message: MESSAGE(stamp) };
    case 'workers':
      return { name, company: 'Door Smoke Ltd', email: EMAIL, phone: PHONE, country: 'TR', iAm: 'direct_employer', trade: 'welder', headcount: '3', startWhen: START_WHEN, city: 'Antalya', message: MESSAGE(stamp) };
    case 'callback':
      return { name, phone: PHONE, email: EMAIL, preferredTime: 'weekday am', topic: 'door smoke', city: 'Antalya' };
    case 'visit':
      return { name, company: 'Door Smoke Ltd', email: EMAIL, phone: PHONE, office: 'antalya', preferredDate: '2026-10-01', preferredTime: 'am', message: MESSAGE(stamp) };
    case 'calculator':
      return { name, email: EMAIL, phone: PHONE, company: 'Door Smoke Ltd', country: 'TR', headcount: '10', trade: 'welder', durationMonths: '12', estimateSummary: `door smoke ${stamp}`, message: MESSAGE(stamp) };
    case 'careers': {
      if (!extra.cvKey || !extra.openingSlug) throw new Error('careers smoke needs { cvKey, openingSlug, country } — read a real opening first');
      // W105: the residency rule checks `country === opening.country.toUpperCase()`; a
      // hardcoded value would 200+FAILED against any opening not in that country, and a naive
      // classifier would wrongly count that as `ok` (check.md's original finding against this
      // file). The caller (door-smoke.ts) always passes the opening's own country.
      // (A TEST-class body is a dry run that returns before that check — Ops `careers-apply.handler.ts`
      // — so the smoke cannot see it; the opening's own country keeps the body valid for a
      // write-class caller of the same builder.)
      if (!extra.country) throw new Error('careers smoke needs the opening’s own country (residency rule)');
      return { openingSlug: extra.openingSlug, cvKey: extra.cvKey, name, email: EMAIL, phone: PHONE, country: extra.country, city: 'Antalya', language: 'tr,en', coverLetter: MESSAGE(stamp) };
    }
    case 'fraud':
      // description: min 20 — a fixed 60-char sentence + the stamp in reporterName only.
      return { reporterName: name, reporterEmail: EMAIL, reporterPhone: PHONE, description: 'Synthetic test-class fraud report; no evidence; ignore me.'.padEnd(60, '.'), suspectName: 'nobody', suspectContact: 'none' };
    case 'newsletter':
      return { email: EMAIL, name };
  }
}

export function smokeEnvelope(formKey: FormKey, locale: Locale, stamp: string, fields?: WireFields): WireEnvelope {
  return buildEnvelope({ locale, fields: fields ?? smokeFields(formKey, stamp), sourcePath: `/door-smoke/${stamp}` });
}

/** What a healthy door answers a test-class body: `ok` everywhere, `off` for the inactive newsletter (D14). */
export function expectedSmokeKind(formKey: FormKey): SmokeKind {
  return formKey === 'newsletter' ? 'off' : 'ok';
}

const OK_STATUSES = new Set(['RECEIVED', 'HANDLED', 'FAILED', 'SPAM']);
const str = (v: unknown): string | null => (typeof v === 'string' ? v : null);

/** postForm's status map (src/forms/post.ts `mapResponse`), without the retry — this script
 *  makes ONE call per body; W74's retry rule is the website's own concern, not the door's. */
export function classifySmoke(formKey: string, http: number, body: unknown): Omit<SmokeRow, 'expected' | 'pass'> {
  const base = { formKey, http, doorStatus: null, isTest: null, replayed: null, id: null, message: null, errors: [] as string[], fallback: null };
  const obj = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const data = (typeof obj.data === 'object' && obj.data !== null ? obj.data : null) as Record<string, unknown> | null;
  if (http === 200) {
    if (data && typeof data.id === 'string' && typeof data.status === 'string' && OK_STATUSES.has(data.status)) {
      return { ...base, kind: 'ok', doorStatus: data.status as SmokeRow['doorStatus'], isTest: data.isTest === true, replayed: data.replayed === true, id: data.id, message: str(data.error) };
    }
    return { ...base, kind: 'unavailable', message: 'malformed 200 (not the door)' };
  }
  if (http === 401) return { ...base, kind: 'unauthorized', message: str(obj.message) };
  if (http === 403) return { ...base, kind: 'captcha', message: str(obj.message) };
  if (http === 404) return { ...base, kind: 'off', message: str(obj.message) };
  if (http === 429) return { ...base, kind: 'tripped', message: str(obj.message), fallback: str(obj.fallback) };
  if (http >= 500) return { ...base, kind: 'unavailable', message: str(obj.message) };
  const errors = Array.isArray(obj.errors) ? obj.errors.filter((e): e is string => typeof e === 'string') : [];
  return { ...base, kind: 'invalid', message: str(obj.message) ?? 'rejected', errors };
}

const cell = (v: unknown): string => (v === null || v === undefined || v === '' ? (v === '' ? '' : '—') : String(v)).replace(/\|/g, '\\|');

export function formatSmokeTable(rows: SmokeRow[]): string {
  const head = '| form | http | kind | door status | isTest | replayed | id | message | pass |';
  const sep = '|---|---|---|---|---|---|---|---|---|';
  const body = rows.map((r) =>
    `| ${r.formKey} | ${r.http} | ${r.kind} | ${cell(r.doorStatus)} | ${cell(r.isTest)} | ${cell(r.replayed)} | ${cell(r.id)} | ${r.message ?? ''}${r.errors.length ? ` (${r.errors.join('; ')})` : ''} | ${r.pass ? '✓' : '✗'} |`,
  );
  return [head, sep, ...body].join('\n');
}
```

`scripts/door-smoke.ts`:

```ts
/**
 * `npm run door:smoke` — the headless, TEST-CLASS probe of the Operations door (T14; the
 * manual form of T15's synthetic lead). Refuses to run with a write token: a smoke that files
 * real inquiries is the incident it exists to prevent.
 *
 *   OPS_API_URL=https://operations.jobsadmire.com OPS_WEBSITE_TEST_TOKEN=wst_… npm run door:smoke [-- --careers] [--json]
 *
 * What it does, in order: GET /ping → one POST per form key (test class: full validation,
 * dedupe, a row with isTest:true, dryRun handler, no captcha when no token — Ops X16) → the
 * deliberate replay (hire, same body twice → replayed:true) → the deliberate 400 (hire with
 * country 'Turkey') → the unknown key → prints the Markdown table for the ledger. `--careers`
 * also reads the first live opening and uploads a 1-page PDF to the public
 * `/api/careers/upload-cv`, then smokes `careers` with THAT opening's own `country` (W105 — a
 * hardcoded 'TR' would 200+FAILED the residency rule against a non-TR opening and this script
 * would wrongly call the row `ok`); it leaves one orphan object in `careers-cv/` per run (off by
 * default). Exit 1 when any row's `pass` is false.
 */
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { classifySmoke, expectedSmokeKind, formatSmokeTable, smokeEnvelope, smokeFields, type SmokeRow } from './door-smoke.lib';

const MIN_TOKEN = 20;
const TIMEOUT_MS = 8000;

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

async function main(): Promise<number> {
  const args = new Set(process.argv.slice(2));
  const base = env('OPS_API_URL')?.replace(/\/+$/, '');
  const token = env('OPS_WEBSITE_TEST_TOKEN');
  if (!base) throw new Error('OPS_API_URL is required');
  if (!token || token.length < MIN_TOKEN) throw new Error('OPS_WEBSITE_TEST_TOKEN (wst_…) is required — never the write token');
  if (token.startsWith('wsw_')) throw new Error('refusing to smoke with a write-class token (wsw_…): it would file real inquiries');
  if (env('OPS_WEBSITE_WRITE_TOKEN') === token) throw new Error('OPS_WEBSITE_TEST_TOKEN equals OPS_WEBSITE_WRITE_TOKEN — refusing');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const call = async (path: string, init?: RequestInit): Promise<{ status: number; body: unknown }> => {
    const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...(init?.headers ?? {}) }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body: unknown = await res.json().catch(() => null);
    return { status: res.status, body };
  };
  const post = (key: string, envelope: unknown) => call(`/api/website/v1/forms/${key}`, { method: 'POST', body: JSON.stringify(envelope) });

  // 1. ping — the door's own facts, printed verbatim (no secret in them).
  const ping = await call('/api/website/v1/ping');
  console.log(`ping ${ping.status} ${JSON.stringify(ping.body)}`);
  if (ping.status === 404) console.log('door is DARK (module flag off or unknown route) — every form row below will be `off`');

  const stamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
  const rows: SmokeRow[] = [];
  const record = (formKey: string, http: number, body: unknown, expected: SmokeRow['expected'], label = formKey) => {
    const c = classifySmoke(formKey, http, body);
    // `ok` + FAILED is a handler failure (RC26 visitor error, or an infra failure with error null);
    // the kernel shows the visitor the `failed` panel for it, so the smoke never counts it a pass.
    const pass = c.kind === expected && c.doorStatus !== 'FAILED';
    rows.push({ ...c, formKey: label, expected, pass });
  };

  // 2. one body per key.
  for (const key of FORM_KEYS) {
    if (key === 'careers' && !args.has('--careers')) continue;
    let extra: { cvKey?: string; openingSlug?: string; country?: string } = {};
    if (key === 'careers') {
      const openings = await call('/api/careers/openings');
      const list = Array.isArray((openings.body as { data?: unknown[] })?.data)
        ? (openings.body as { data: Array<{ slug?: string; country?: string }> }).data
        : [];
      const first = list[0] ?? null;
      if (!first?.slug || !first?.country) { console.log('careers: no public opening — skipped'); continue; }
      const pdf = new Blob([`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n`], { type: 'application/pdf' });
      const form = new FormData();
      form.append('file', pdf, 'door-smoke.pdf');
      const up = await fetch(`${base}/api/careers/upload-cv`, { method: 'POST', body: form, signal: AbortSignal.timeout(TIMEOUT_MS) });
      const upBody = (await up.json().catch(() => null)) as { data?: { key?: string } } | null;
      if (!upBody?.data?.key) { console.log(`careers: upload-cv answered ${up.status} — skipped`); continue; }
      extra = { cvKey: upBody.data.key, openingSlug: first.slug, country: first.country.toUpperCase() };
    }
    const r = await post(key, smokeEnvelope(key as FormKey, 'en', stamp, smokeFields(key as FormKey, stamp, extra)));
    record(key, r.status, r.body, expectedSmokeKind(key as FormKey));
  }

  // 3. replay: identical body twice inside one clock hour → the second answers replayed:true.
  const replayBody = smokeEnvelope('hire', 'tr', `${stamp}-replay`);
  const first = await post('hire', replayBody);
  const second = await post('hire', replayBody);
  record('hire', first.status, first.body, 'ok', 'hire (replay #1)');
  const c2 = classifySmoke('hire', second.status, second.body);
  rows.push({ ...c2, formKey: 'hire (replay #2)', expected: 'ok', pass: c2.kind === 'ok' && c2.doorStatus !== 'FAILED' && c2.replayed === true && c2.id === classifySmoke('hire', first.status, first.body).id });

  // 4. the deliberate 400 — the catalog's own message, proving the `invalid` mapping.
  const bad = await post('hire', smokeEnvelope('hire', 'en', `${stamp}-bad`, { ...smokeFields('hire', `${stamp}-bad`), country: 'Turkey' }));
  record('hire', bad.status, bad.body, 'invalid', 'hire (country: Turkey)');

  // 5. the unknown key → 404 'Unknown form.' (same `off` kind as a dark door).
  const unknown = await post('nope', smokeEnvelope('hire', 'en', `${stamp}-unknown`));
  record('nope', unknown.status, unknown.body, 'off', 'nope (unknown key)');

  const table = formatSmokeTable(rows);
  console.log(args.has('--json') ? JSON.stringify({ base, stamp, ping: ping.body, rows }, null, 2) : `\n${table}\n`);
  return rows.every((r) => r.pass) ? 0 : 1;
}

main().then((code) => process.exit(code)).catch((err) => { console.error(String(err?.message ?? err)); process.exit(2); });
```

`package.json` — Modify. Find the current last line of `"scripts"` with `grep -n '"assets:map"' package.json`; add `door:smoke` right after it, as the new last script (a comma moves onto the former-last line, W42 additive-only — do not touch or reorder any other script):

```json
    "assets:map": "tsx scripts/build-source-map.ts",
    "door:smoke": "tsx scripts/door-smoke.ts"
```

`.env.example` — Modify the `OPS_WEBSITE_TEST_TOKEN` comment. Find it with `grep -n "OPS_WEBSITE_TEST_TOKEN" .env.example` (a two-line comment ending `Not read by any code until T15.`); change the last sentence to: `Consumed by \`npm run door:smoke\` and \`e2e/door-test-mode.spec.ts\` since T14, and by the T15 synthetic-lead cron.`

`docs/OPERATING.md` — Modify § Synthetic lead. Find the paragraph with `grep -n "Not yet built" docs/OPERATING.md`; replace `**Not yet built** — no cron config exists in \`vercel.json\` yet; the form path it drives (\`src/forms/\`, \`docs/ARCHITECTURE.md\` § Forms flow) shipped in WP2a, and \`OPS_WEBSITE_TEST_TOKEN\` is reserved for it in \`.env.example\`.` with: `**The cron is not yet built** (T15 adds the \`vercel.json\` schedule); **the probe exists**: \`npm run door:smoke\` (\`scripts/door-smoke.ts\`, T14) posts one test-class body per form key to the real door — ping, ten keys, the deliberate replay, the deliberate 400, the unknown key — and prints the Markdown table the ledger keeps. It refuses a write-class token. Test-class rows appear in the Ops inbox under the *test* filter (\`isTest: true\`), run their handler as a dry run and skip Turnstile when they carry no token (Ops X16), so a green smoke proves the door up to the handler and nothing about the visitor's captcha path — \`e2e/door-test-mode.spec.ts\` and the owner-gated real run (T14) prove that.` Keep the rest of the paragraph (the design description for when WP3a/WP5 land the cron) unchanged.

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write scripts/door-smoke.lib.ts scripts/door-smoke.ts scripts/door-smoke.test.ts package.json .env.example docs/OPERATING.md && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/door-smoke.test.ts --maxWorkers=1
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the scoped run — 10 passed (the 9 original assertions + the new `careers.city` cap case); the full line (W178, before the commit) — every Vitest file green and typecheck/lint/format green (`scripts/**` is inside `tsconfig`'s `include` as today's `scripts/*.ts` are; the `no-restricted-imports` client-import guards do not fire — this file is never imported by `src/**` or any `'use client'` module).

Then, against the real door (does not need Turnstile — a test-class body carries none by design):

```bash
OPS_API_URL=https://operations.jobsadmire.com OPS_WEBSITE_TEST_TOKEN='<wst_… from Ops → Integrations>' npm run door:smoke
```
Expected: `ping 200 {"data":{"tokenClass":"test","moduleEnabled":true,"captcha":"configured"|"missing","secondHumanConfigured":true|false,"trippedForms":[],…}}` (the module is already flipped on — verified in Cycle 4), every row `ok`/`HANDLED`/`isTest true` except `newsletter` → `off` (`This form is not accepting submissions.`), `hire (replay #2)` → `replayed true` with the same id as replay #1, `hire (country: Turkey)` → `invalid (country must be a two-letter ISO code)`, `nope` → `off (Unknown form.)`; exit 0. Paste the table into the ledger (Cycle 9). Never pass `--careers` here or in any automated run: it uploads a real PDF through the public `upload-cv` (no test class) and leaves an orphan `careers-cv/*.pdf` in production storage — W171 keeps every real upload inside the owner-gated Cycle 7, where rows 16–17 prove the careers path.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add scripts/door-smoke.lib.ts scripts/door-smoke.ts scripts/door-smoke.test.ts package.json .env.example docs/OPERATING.md
git commit -m "feat(ops): npm run door:smoke — test-class probe of the Operations door, the I4 required sets as code (T14)

One catalog-conformant body per form key (careers uses the opening's own
country — a hardcoded TR would 200+FAILED the residency rule and read as
ok), the deliberate replay, the deliberate 400 and the unknown key,
classified like postForm and printed as the ledger's table. Refuses a
write-class token. The pure half is what T15's synthetic-lead cron will
build its body with.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3 — The form-instance inventory: a committed fixture, pinned by a test

**Why this cycle exists.** The earlier draft of this task only ever wrote the 17-row table as prose inside the task file itself — nobody could run it, and check.md's findings (careers' hardcoded country, the wrong CAPS.city, T8/T10's under-reported required fields, `#pool` vs `#pool-form`) are exactly the kind of drift that a Markdown table invites and a typed fixture, pinned by a test against the real catalog, catches on the next `npm run typecheck`/`vitest run` instead of on the next owner-gated run. Every field below was re-read from the *fixed* page tasks during this reconciliation (`B/fixed/task-{1,2,3,5,7,8,10,13}.md` — code blocks, not prose — and `B/fixed/task-11.md`, whose careers rows the recheck re-diffed against the final file; see **Foundation gaps** item 7).

- [ ] **Step 1: Write the failing test**

`scripts/form-instances.test.ts`:

```ts
/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { FORM_KEYS } from '../src/analytics/forms';
import { START_WHEN_KEYS } from '../src/forms/options';
import {
  FORM_INSTANCES,
  NON_DOOR_INSTANCES,
  requiredFieldNames,
} from '../e2e/fixtures/form-instances';

// Lives under scripts/ for the same reason as scripts/face.test.ts: Vitest never collects e2e/**
// (vitest.config.mts `include`), and Playwright would collect an e2e/*.test.ts.

describe('FORM_INSTANCES — the 17-instance inventory pinned against the pages it was read from', () => {
  it('has exactly 17 rows, ids 1..17 in order', () => {
    expect(FORM_INSTANCES).toHaveLength(17);
    expect(FORM_INSTANCES.map((r) => r.id)).toEqual(Array.from({ length: 17 }, (_, i) => i + 1));
  });

  it('every doorKey is a real FormKey, and every key except newsletter is used at least once', () => {
    for (const row of FORM_INSTANCES) expect(FORM_KEYS as readonly string[]).toContain(row.doorKey);
    const used = new Set(FORM_INSTANCES.map((r) => r.doorKey));
    for (const key of FORM_KEYS) {
      if (key === 'newsletter') expect(used.has(key)).toBe(false); // D14: inactive, no instance
      else expect(used.has(key)).toBe(true);
    }
  });

  it('hire runs on both locales (D13/R55 — the two-locale autoresponder proof)', () => {
    const hireLocales = new Set(FORM_INSTANCES.filter((r) => r.doorKey === 'hire').map((r) => r.locale));
    expect(hireLocales.has('tr')).toBe(true);
    expect(hireLocales.has('en')).toBe(true);
  });

  it('every row names a real FormShell testId and, where the page gives one, its idScope', () => {
    for (const row of FORM_INSTANCES) {
      expect(row.testId.length).toBeGreaterThan(0);
      expect(row.path.tr.startsWith('/')).toBe(true);
      expect(row.path.en.startsWith('/en')).toBe(true);
    }
  });

  it('every `startWhen` field the inventory fills is one of the shared W78 keys, never an invented one', () => {
    for (const row of FORM_INSTANCES) {
      const sw = row.fields.find((f) => f.name === 'startWhen');
      if (sw) expect(START_WHEN_KEYS as readonly string[]).toContain(sw.value);
    }
  });

  it('careers rows (16, 17) resolve their opening dynamically — no hardcoded slug baked into the fixture', () => {
    const careers = FORM_INSTANCES.filter((r) => r.doorKey === 'careers');
    expect(careers).toHaveLength(2);
    for (const row of careers) {
      expect(row.dynamicOpening).toBeDefined();
      expect(row.path.tr).toBe('/kariyer'); // resolved at run time; the fixture holds the INDEX path only
    }
    expect(careers.map((r) => r.dynamicOpening?.country).sort()).toEqual(['PK', 'TR']);
  });

  it('rows 3/4 (Hire Workers) and 13 (Available Workers) send the fixed values the pages hardcode, not a typed one', () => {
    const quick = FORM_INSTANCES.find((r) => r.id === 3)!;
    expect(quick.testId).toBe('hire-form-quick');
    expect(quick.consentMode).toBe('checkbox'); // corrected: the page sets consent="checkbox", not "notice"
    const workers = FORM_INSTANCES.find((r) => r.id === 13)!;
    expect(workers.fixedFields).toMatchObject({ country: 'TR' });
    expect(requiredFieldNames(workers)).toEqual(expect.arrayContaining(['city', 'trade']));
  });

  it('row 7 (sourcing partner) requires licence and sends no city/message; row 8 (institute) sends no licence/message', () => {
    const sourcing = FORM_INSTANCES.find((r) => r.id === 7)!;
    expect(requiredFieldNames(sourcing)).toEqual(expect.arrayContaining(['licence']));
    expect(sourcing.fields.some((f) => f.name === 'city')).toBe(false);
    expect(sourcing.fields.some((f) => f.name === 'message')).toBe(false);
    const institute = FORM_INSTANCES.find((r) => r.id === 8)!;
    expect(institute.fields.some((f) => f.name === 'licence')).toBe(false);
  });

  it('rows 14/15 (fraud) require both reporterName and reporterEmail (W105 — stricter than the door)', () => {
    for (const id of [14, 15]) {
      const row = FORM_INSTANCES.find((r) => r.id === id)!;
      expect(requiredFieldNames(row)).toEqual(expect.arrayContaining(['reporterName', 'reporterEmail']));
    }
  });

  it('row 13’s anchor is #pool-form (the hero card), never #pool (the empty-state section)', () => {
    const workers = FORM_INSTANCES.find((r) => r.id === 13)!;
    expect(workers.anchor).toBe('#pool-form');
  });

  it('NON_DOOR_INSTANCES names every rendered-but-not-submitted path, so the ledger cross-check has somewhere to record them', () => {
    const labels = NON_DOOR_INSTANCES.map((r) => r.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        expect.stringContaining('portfolio'),
        expect.stringContaining('speculative'),
        expect.stringContaining('lookup'),
        expect.stringContaining('newsletter'),
      ]),
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/form-instances.test.ts --maxWorkers=1
```
Expected: fails to load — `Cannot find module '../e2e/fixtures/form-instances'`.

- [ ] **Step 3: Implement**

`e2e/fixtures/form-instances.ts`:

```ts
/**
 * The 17 door-backed form instances across the 13 designed pages, as data — T14's own record
 * of what `B/fixed/task-{1,2,3,5,7,8,10,11,13}.md` build, re-read
 * directly from their code blocks during this reconciliation (2026-09-29), corrected against
 * `B/check.md` and ruling W105 (careers' own country, CAPS.city, the #pool/#pool-form anchor,
 * T8/T10's under-reported required fields). `e2e/door-test-mode.spec.ts` (Cycle 5) iterates
 * this; the Cycle 7 manual table is filled by hand from the same 17 rows so the two never
 * diverge. Not imported by `src/**` — a fixture, not runtime code.
 */
import type { FormKey } from '../../src/analytics/forms';

export type FieldKind = 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox' | 'textarea';

export type FieldFill = {
  /** the DOM control's `name` attribute — exactly what the page's schema/toFields names it,
   *  never the door's wire name where the two differ (e.g. row 11 fills `day`/`slot`, which
   *  the page's `toCallbackFields` composes into the wire's `preferredTime`). */
  name: string;
  kind: FieldKind;
  /** the value to fill/select; `{stamp}` is replaced with a per-run unique token at test time. */
  value: string;
  required: boolean;
};

export type DynamicOpening = { country: 'TR' | 'PK' };

export type FormInstance = {
  id: number;
  page: string;
  /** which locale this specific instance is exercised in (both hire keys together cover both). */
  locale: 'tr' | 'en';
  path: { tr: string; en: string };
  /** informational only — the section/card id the design anchors this instance to. */
  anchor?: string;
  /** a page-wide selector the spec clicks BEFORE filling, when this instance's form is not
   *  mounted on arrival: the hero's "call me back" mode (T1 renders one shell at a time), a
   *  Partner track card (T5 mounts one track's form at a time), a Contact topic card (T7's
   *  `topicPick` picker sits outside the form and drives its hidden `topic` input), the Contact
   *  call-back widget's toggle (T7 mounts that form only while the widget is expanded). */
  open?: string;
  mode: string;
  doorKey: FormKey;
  testId: string;
  idScope?: string;
  consentMode: 'checkbox' | 'notice';
  /** values the page sends but the visitor never types (e.g. `country: 'TR'` on the HR-agency
   *  track, `office: 'antalya'` on book-a-visit) — informational for the manual table (Cycle 7),
   *  not filled by the automated spec (nothing to fill). */
  fixedFields?: Record<string, string>;
  fields: readonly FieldFill[];
  /** careers only: the automated spec resolves the opening at run time from the live
   *  `GET /api/careers/openings` list — no slug is ever hardcoded here (it would go stale the
   *  day an opening closes). `path.tr`/`path.en` for these two rows are the INDEX route; the
   *  detail route is built once the slug is known. */
  dynamicOpening?: DynamicOpening;
  notes?: string;
};

export const requiredFieldNames = (row: FormInstance): string[] =>
  row.fields.filter((f) => f.required).map((f) => f.name);

/** Puts the run's `{stamp}` inside a value's `[T14-nn]` tag (`[T14-01] Ayşe` → `[T14-01 {stamp}] Ayşe`),
 *  so every run's body differs and never dedupes onto an earlier row in the same clock hour (the door
 *  hashes `fields`; `sourcePath` is not hashed). A value without a tag (an e-mail) is unchanged. */
const t = (s: string) => s.replace(']', ' {stamp}]');

export const FORM_INSTANCES: readonly FormInstance[] = [
  {
    id: 1, page: 'Homepage (T1)', locale: 'tr', path: { tr: '/', en: '/en' }, anchor: '#proposal',
    mode: 'hero lead form, proposal mode', doorKey: 'hire', testId: 'hire-form', idScope: 'hero-hire',
    consentMode: 'checkbox',
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-01] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-01] Ayşe Yılmaz'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-01@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000001', required: true },
      { name: 'headcount', kind: 'text', value: '5', required: true },
      { name: 'sector', kind: 'select', value: 'factory', required: false },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      { name: 'startWhen', kind: 'select', value: 'month1', required: false },
    ],
    notes: 'No roleNeeded, no message field on this instance — the hero schema does not carry them (verified in task-1.md’s hireSchema).',
  },
  {
    id: 2, page: 'Homepage (T1)', locale: 'en', path: { tr: '/', en: '/en' }, anchor: '#proposal',
    mode: 'hero lead form, "call me back" mode', doorKey: 'callback', testId: 'callback-form', idScope: 'hero-callback',
    open: '[data-testid="hero-mode-callback"]',
    consentMode: 'checkbox',
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-02] John Smith'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000002', required: true },
      { name: 'topic', kind: 'select', value: 'factory', required: false },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
    ],
    notes: 'This callback carries no preferredTime control (task-1.md’s callbackSchema has none) — different shape from rows 11/12 on Contact.',
  },
  {
    id: 3, page: 'Hire Workers (T2)', locale: 'tr', path: { tr: '/isci-talebi', en: '/en/hire-workers' }, anchor: '#request-form',
    mode: 'quick-quote (≥ 701 px)', doorKey: 'hire', testId: 'hire-form-quick', idScope: 'hire-quick',
    consentMode: 'checkbox',
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-03] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-03] Ayşe Yılmaz'), required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: true },
      { name: 'roleNeeded', kind: 'text', value: 'Welder', required: true },
      { name: 'headcount', kind: 'text', value: '5', required: true },
      { name: 'phone', kind: 'tel', value: '+905000000003', required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-03@jobsadmire.com'), required: true },
    ],
    notes: 'Corrected: the page sets consent="checkbox" (verified in the code, task-2.md line ~2539), not "notice" as an earlier draft of this task assumed. Every field here is required — quickSchema has no optional field.',
  },
  {
    id: 4, page: 'Hire Workers (T2)', locale: 'en', path: { tr: '/isci-talebi', en: '/en/hire-workers' }, anchor: '#request-form',
    mode: 'detailed request form', doorKey: 'hire', testId: 'hire-form-full', idScope: 'hire-full',
    consentMode: 'checkbox',
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-04] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-04] John Smith'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-04@jobsadmire.com'), required: true },
      { name: 'dial', kind: 'select', value: 'TR', required: true },
      { name: 'phone', kind: 'tel', value: '5000000004', required: true },
      { name: 'sector', kind: 'select', value: 'factory', required: true },
      { name: 'roleNeeded', kind: 'text', value: 'Welder', required: true },
      { name: 'headcount', kind: 'text', value: '3', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      { name: 'startWhen', kind: 'select', value: 'month1', required: false },
      { name: 'message', kind: 'textarea', value: 'T14 staging run {stamp} — please ignore.', required: false },
    ],
    notes: '`dial` + `phone` compose into the wire’s single `phone` (+90…); `sector` is REQUIRED on this instance (an enum, not optional — task-2.md’s fullSchema).',
  },
  {
    id: 5, page: 'Cost Calculator (T3)', locale: 'tr', path: { tr: '/maliyet-hesaplayici', en: '/en/hiring-cost-calculator' }, anchor: '#calculator',
    mode: 'written quote, opened from the calculator card after estimating (CNC operator, 8 workers, 12 months)',
    doorKey: 'calculator', testId: 'calc-quote-form', idScope: 'calc-quote', consentMode: 'checkbox',
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-05] Ayşe Yılmaz'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-05@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000005', required: false },
      { name: 'company', kind: 'text', value: t('[T14-05] Door Smoke Ltd'), required: false },
      { name: 'country', kind: 'select', value: 'TR', required: false },
    ],
    notes: 'Corrected: the card’s own anchor id is `#calculator` (W152/W158, `id="calculator"` on the page — not `#quote` as an earlier draft assumed); opened via `[data-testid="calc-quote-open"]`. `trade`/`headcount`/`durationMonths`/`estimateSummary` are recomputed server-side from the calculator’s own hidden `est_*` inputs, never typed directly — the automated spec runs the calculator (role, headcount, months) before opening the sheet.',
  },
  {
    id: 6, page: 'Partner With Us (T5)', locale: 'en', path: { tr: '/ortak-olun', en: '/en/partner-with-us' }, anchor: '#tracks',
    mode: 'HR-agency track', doorKey: 'hire', testId: 'partner-form-hr', idScope: 'partner-hr', consentMode: 'checkbox',
    fixedFields: { country: 'TR', iAm: 'hr_agency' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-06] Door Smoke Agency'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-06] John Smith'), required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-06@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000006', required: true },
      { name: 'message', kind: 'textarea', value: 'T14 staging run {stamp} — please ignore.', required: false },
    ],
    notes: 'Corrected: `city` is REQUIRED on this track (hrAgencySchema — an earlier draft marked it optional); `country`/`iAm` are fixed by the page (HR_COUNTRY/HR_I_AM constants), never a control.',
  },
  {
    id: 7, page: 'Partner With Us (T5)', locale: 'tr', path: { tr: '/ortak-olun', en: '/en/partner-with-us' }, anchor: '#tracks',
    mode: 'sourcing-partner track', doorKey: 'partner', testId: 'partner-form-sourcing', idScope: 'partner-sourcing', consentMode: 'checkbox',
    open: 'label[for="track-sourcing"]',
    fixedFields: { track: 'sourcing' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-07] Door Smoke Sourcing'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-07] Ayşe Yılmaz'), required: true },
      { name: 'country', kind: 'select', value: 'PK', required: true },
      { name: 'licence', kind: 'text', value: 'LIC-T14-07', required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-07@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000007', required: true },
      { name: 'candidatesPerYear', kind: 'text', value: '50', required: false },
      { name: 'trades', kind: 'text', value: 'welder, cnc operator', required: false },
      { name: 'licenceDeclaration', kind: 'checkbox', value: 'on', required: true },
    ],
    notes: 'Corrected (W105): `licence` is REQUIRED here (an earlier draft marked it optional), and this track sends NO `city` and NO `message` at all (sourcingSchema has neither field — an earlier draft listed both). `licenceDeclaration` (T5’s `DECLARATION_FIELD`) is a page-local tick, never sent on the wire.',
  },
  {
    id: 8, page: 'Partner With Us (T5)', locale: 'en', path: { tr: '/ortak-olun', en: '/en/partner-with-us' }, anchor: '#tracks',
    mode: 'training-institute track', doorKey: 'partner', testId: 'partner-form-institute', idScope: 'partner-institute', consentMode: 'checkbox',
    open: 'label[for="track-institute"]',
    fixedFields: { track: 'institute' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-08] Door Smoke Institute'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-08] John Smith'), required: true },
      { name: 'country', kind: 'select', value: 'NP', required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-08@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000008', required: true },
      { name: 'city', kind: 'text', value: 'Kathmandu', required: false },
      { name: 'candidatesPerYear', kind: 'text', value: '20', required: false },
      { name: 'trades', kind: 'text', value: 'welder', required: false },
    ],
    notes: 'This track has no `licence` field and no `message` field at all (instituteSchema).',
  },
  {
    id: 9, page: 'Contact (T7)', locale: 'tr', path: { tr: '/iletisim', en: '/en/contact' }, anchor: '#message',
    mode: 'enquiry, topic hire', doorKey: 'contact', testId: 'contact-enquiry-form', idScope: 'contact-enquiry', consentMode: 'checkbox',
    open: 'label:has(input[name="topicPick"][value="hire"])',
    fixedFields: { iAm: 'direct_employer' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-09] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-09] Ayşe Yılmaz'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-09@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000009', required: true },
      { name: 'subject', kind: 'text', value: 'Need 5 welders', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      { name: 'message', kind: 'textarea', value: 'T14 staging run {stamp} — please ignore.', required: false },
    ],
    notes: 'The topic is picked on T7’s `topicPick` card (outside the form; it sets the form’s hidden `topic` input — never a fillable control). Wire `iAm` = IAM_BY_TOPIC.hire = direct_employer (fixed by topic, never typed); wire `message` is always non-empty (composeContactMessage prepends `subject`).',
  },
  {
    id: 10, page: 'Contact (T7)', locale: 'en', path: { tr: '/iletisim', en: '/en/contact' }, anchor: '#message',
    mode: 'enquiry, topic permit (also proves the job topic renders no form)', doorKey: 'contact', testId: 'contact-enquiry-form', idScope: 'contact-enquiry', consentMode: 'checkbox',
    open: 'label:has(input[name="topicPick"][value="permit"])',
    fixedFields: { iAm: 'direct_employer' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-10] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-10] John Smith'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-10@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000010', required: true },
      { name: 'subject', kind: 'text', value: 'Work permit question', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
    ],
    notes: 'Corrected: `iAm` for the permit topic is direct_employer (IAM_BY_TOPIC.permit — confirmed in code, not "per T7’s map, record it" as an earlier draft left open). Cross-check (not filled): selecting the `job` topic hides the form entirely (W3) — record this as a separate pass/fail line, not a submission.',
  },
  {
    id: 11, page: 'Contact (T7)', locale: 'tr', path: { tr: '/iletisim', en: '/en/contact' }, anchor: '#message',
    mode: 'callback widget', doorKey: 'callback', testId: 'contact-callback-form', idScope: 'contact-callback', consentMode: 'checkbox',
    open: '[data-testid="contact-callback"] button[aria-expanded="false"]',
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-11] Ayşe Yılmaz'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000011', required: true },
      { name: 'day', kind: 'radio', value: 'tomorrow', required: false },
      { name: 'slot', kind: 'radio', value: '14-16', required: false },
    ],
    notes: 'DOM names `day`/`slot`; `toCallbackFields` composes wire `preferredTime` = "tomorrow 14-16". No `city`, no `topic` on THIS callback (unlike row 2’s homepage callback). The widget starts closed and T7 renders no form until its toggle is clicked — hence `open`.',
  },
  {
    id: 12, page: 'Contact (T7)', locale: 'en', path: { tr: '/iletisim', en: '/en/contact' }, anchor: '#message',
    mode: 'book a visit', doorKey: 'visit', testId: 'contact-visit-form', idScope: 'contact-visit', consentMode: 'checkbox',
    fixedFields: { office: 'antalya' },
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-12] John Smith'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-12@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000012', required: true },
      { name: 'preferredTime', kind: 'radio', value: '11:00', required: false },
    ],
    notes: 'T7 renders both visit controls as RadioChips: `preferredTime` = the five `VISIT_SLOTS`; `preferredDate` = the next five dates, computed at render — no fixed value can match, so the automated run leaves the date unset (optional at the door) and Cycle 7 picks one by hand.',
  },
  {
    id: 13, page: 'Available Workers (T8)', locale: 'tr', path: { tr: '/adaylar', en: '/en/available-workers' }, anchor: '#pool-form',
    mode: 'request form, in the hero card', doorKey: 'workers', testId: 'workers-form', consentMode: 'checkbox',
    fixedFields: { country: 'TR' },
    fields: [
      { name: 'iAm', kind: 'radio', value: 'direct_employer', required: true },
      { name: 'name', kind: 'text', value: t('[T14-13] Ayşe Yılmaz'), required: true },
      { name: 'company', kind: 'text', value: t('[T14-13] Door Smoke Ltd'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-13@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000013', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: true },
      { name: 'trade', kind: 'text', value: 'Welder, 3 needed', required: true },
      { name: 'headcount', kind: 'text', value: '3', required: false },
      { name: 'startWhen', kind: 'select', value: 'month1', required: false },
      { name: 'message', kind: 'textarea', value: 'T14 staging run {stamp} — please ignore.', required: false },
    ],
    notes: 'Corrected (check.md + W105): the form sits in `#pool-form` inside the hero card, NOT inside `#pool` (the header CTA’s target, which renders only the empty state — an earlier draft looked for the form in the wrong section). `city` and `trade` are REQUIRED on this page (an earlier draft listed both as optional); `country: \'TR\'` is sent silently, never a control. No `idScope` — the page mounts one `workers` shell, so every id is `f-workers-<name>`.',
  },
  {
    id: 14, page: 'Verify (T10)', locale: 'en', path: { tr: '/temsilci-dogrulama', en: '/en/verify' }, anchor: '#report',
    mode: 'fraud report, no evidence', doorKey: 'fraud', testId: 'fraud-form', consentMode: 'checkbox',
    fields: [
      { name: 'reporterName', kind: 'text', value: t('[T14-14] John Smith'), required: true },
      { name: 'reporterEmail', kind: 'email', value: t('door-smoke+t14-14@jobsadmire.com'), required: true },
      { name: 'reporterPhone', kind: 'tel', value: '+905000000014', required: false },
      { name: 'description', kind: 'textarea', value: 'T14 staging run {stamp} — synthetic fraud report, please ignore this row entirely.', required: true },
      { name: 'suspectName', kind: 'text', value: 'Nobody', required: false },
      { name: 'suspectContact', kind: 'text', value: 'none', required: false },
    ],
    notes: 'Corrected (W105): `reporterEmail` is REQUIRED on this page (an earlier draft marked it optional — the door itself allows it blank, but T10’s own schema does not). `description` must stay ≥ 20 characters (the door’s own minimum).',
  },
  {
    id: 15, page: 'Verify (T10)', locale: 'tr', path: { tr: '/temsilci-dogrulama', en: '/en/verify' }, anchor: '#report',
    mode: 'fraud report with three evidence files', doorKey: 'fraud', testId: 'fraud-form', consentMode: 'checkbox',
    fields: [
      { name: 'reporterName', kind: 'text', value: t('[T14-15] Ayşe Yılmaz'), required: true },
      { name: 'reporterEmail', kind: 'email', value: t('door-smoke+t14-15@jobsadmire.com'), required: true },
      { name: 'reporterPhone', kind: 'tel', value: '+905000000015', required: false },
      { name: 'description', kind: 'textarea', value: 'T14 staging run {stamp} — synthetic fraud report with evidence, please ignore this row entirely.', required: true },
      { name: 'suspectName', kind: 'text', value: 'Nobody', required: false },
      { name: 'suspectContact', kind: 'text', value: 'none', required: false },
    ],
    notes: 'As row 14, plus three evidence uploads (`t14-1.jpg`, `t14-2.png`, `t14-3.pdf`), each **≤ 3 MiB** (W73/W116 — not the 8 MB the door itself would accept; the site refuses anything larger before the door sees it). One island call per file (W101) — the fourth file the `MAX_EVIDENCE_FILES = 3` control refuses is a UI check, not a wire submission.',
  },
  {
    id: 16, page: 'Careers detail (T11)', locale: 'tr', path: { tr: '/kariyer', en: '/en/careers' }, anchor: '#apply',
    mode: 'standard apply, CV upload, residency lock (TR opening)', doorKey: 'careers', testId: 'careers-apply-form', consentMode: 'checkbox',
    dynamicOpening: { country: 'TR' },
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-16] Ayşe Yılmaz'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-16@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000016', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      { name: 'coverLetter', kind: 'textarea', value: 'T14 staging run {stamp} — please ignore.', required: false },
    ],
    notes: 'CV file (`t14-cv.pdf`, ≤ 3 MiB — W73/W116, not the door’s own 5 MB) on T11’s `input[name="cv"]`: it rides in the apply action call itself (one file per call) and `applyToFields` uploads it before the door call — `cvKey` is never a DOM field. `country` is pre-selected/locked to the opening’s own country by `CountryField` — never typed by the visitor; the site re-checks it server-side (`applyToFields`) regardless. As of 2026-09-20 the live TR opening is `satis-temsilcisi-plasiyer-tr` — re-read at run time from `GET /api/careers/openings`, never hardcoded (it may have closed by execution time).',
  },
  {
    id: 17, page: 'Careers detail (T11)', locale: 'en', path: { tr: '/kariyer', en: '/en/careers' }, anchor: '#apply',
    mode: 'standard apply, PK opening — the expectedSalary branch', doorKey: 'careers', testId: 'careers-apply-form', consentMode: 'checkbox',
    dynamicOpening: { country: 'PK' },
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-17] John Smith'), required: true },
      { name: 'email', kind: 'email', value: t('door-smoke+t14-17@jobsadmire.com'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000017', required: true },
      { name: 'expectedSalary', kind: 'text', value: '150000', required: true },
      { name: 'coverLetter', kind: 'textarea', value: 'T14 staging run {stamp} — please ignore.', required: false },
    ],
    notes: '`expectedSalary` becomes REQUIRED because the opening’s own country is PK (`applyToFields` throws a field error otherwise); `expectedSalaryCurrency` is set server-side from the opening’s `payCurrency`, never typed. As of 2026-09-20 the live PK opening is `operations-manager-international-recruitment` — re-read at run time, never hardcoded.',
  },
];

/** Rendered on a designed page but never a door submission — recorded in the Cycle 7/9 ledger,
 *  not run through `e2e/door-test-mode.spec.ts`. */
export const NON_DOOR_INSTANCES: readonly { label: string; note: string }[] = [
  { label: 'Careers detail — portfolio-required apply-by-e-mail branch', note: 'No live opening has portfolioRequired=true as of 2026-09-20; covered by T11’s unit/e2e only (W3/W56).' },
  { label: 'Join Our Team — speculative application', note: 'WhatsApp + mailto only, no door key (W3); click both, assert email_click/whatsapp_click with page_cta.' },
  { label: 'Verify — representative lookup', note: 'Client-only, neutral W6 result; verify_lookup outcome register_unavailable.' },
  { label: 'newsletter band', note: 'Hidden on every page in Phase A (W5) — assert no form[data-form-key="newsletter"] exists on /blog, /en/blog, /.' },
  { label: 'newsletter confirm/unsubscribe pages', note: 'I12 — forwarded only on click, never generate_lead/conversion (D13); exercised in Cycle 7 (the I12 step), not as a door instance.' },
];
```

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write e2e/fixtures/form-instances.ts scripts/form-instances.test.ts && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run scripts/form-instances.test.ts --maxWorkers=1
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the scoped run — 11 passed; the full line (W178, before the commit) — typecheck/lint/format green and every Vitest file green.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add e2e/fixtures/form-instances.ts scripts/form-instances.test.ts
git commit -m "test(e2e): commit the 17 form-instance inventory as data, pinned against the fixed page tasks (T14)

Replaces a Markdown table nobody could run with a typed fixture: door key,
idScope/testId, every field and its DOM name, corrected against
check.md/W105 (careers' own country, the #pool/#pool-form anchor, the
sourcing track's required licence, T8/T10's under-reported required
fields). e2e/door-test-mode.spec.ts (Cycle 5) iterates it; the manual
table (Cycle 7) is filled from the same 17 rows.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 3b — Foundation touch: the WhatsApp fallback prefill names who was reported (W167)

**Why this cycle exists (W167).** `FallbackPanel`'s module-private `WHATSAPP_FIELDS` (`src/forms/client/FallbackPanel.tsx` — the 20-name `as const` reading-order list that `whatsappFallbackText` walks) omits `suspectName` and `suspectContact`, so a fraud report that falls back to WhatsApp (rows 14–15's `fraud` form on a door outage) loses who was reported — the one thing the report exists for; it also omits the sourcing track's `licence` (row 7). W167 appends exactly these three, in this order, after `message`, and accepts every other omission for Phase A (`trades`, `candidatesPerYear`, `day`, `slot`, `reply`, `dial`, `portfolioUrl`; option values print as their raw keys — label mapping is a Phase B item). The three labels already exist in both locales (`sys.form.labels.suspectName` "Şüpheli kişi veya kurum" / "Person or company reported", `sys.form.labels.suspectContact`, `sys.form.labels.licence`), so no `sys.*` key and no `CLIENT_SYS` change. It is a WP2a foundation file, so the touch is one small additive commit of its own, placed before the staging cycles: `staging` (fast-forwarded from `wp2/foundation` in Cycle 4) then carries it, and Cycle 7's manual walkthrough sees the final prefill.

- [ ] **Step 1: Write the failing test**

`src/forms/__tests__/FallbackPanel.test.tsx` — two edits.

(a) Inside `describe('FallbackPanel', …)`, directly above the case `it('renders its heading at headingLevel (default 3)', …)` (find it with `grep -n "renders its heading at headingLevel" src/forms/__tests__/FallbackPanel.test.tsx`), insert:

```tsx
  it('W167: a fraud report falls back with who was reported, under the real sys.form.labels', () => {
    renderWithIntl(
      <FallbackPanel
        {...base}
        formKey="fraud"
        values={{
          reporterName: 'Ayşe Yılmaz',
          reporterEmail: 'ayse@example.com',
          description: 'They asked for a visa fee up front.',
          suspectName: 'Fake Agency Ltd',
          suspectContact: '+92 300 000 00 00',
        }}
        result={{ kind: 'unavailable', cause: 'network' }}
      />,
    );
    // W76 still holds: nothing typed sits in the DOM, the reported party included.
    expect(document.body.innerHTML).not.toContain('Fake Agency');
    const wa = screen.getByRole('link', { name: copy.whatsapp });
    wa.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(open).toHaveBeenCalledTimes(1);
    const [url] = open.mock.calls[0] as [string, string, string];
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain(`${tr.sys.form.labels.suspectName}: Fake Agency Ltd`);
    expect(text).toContain(`${tr.sys.form.labels.suspectContact}: +92 300 000 00 00`);
  });

```

(b) Replace the file's last block — from `describe('whatsappFallbackText', () => {` to the end of the file (find it with `grep -n "describe('whatsappFallbackText'" src/forms/__tests__/FallbackPanel.test.tsx`) — with:

```tsx
describe('whatsappFallbackText', () => {
  it('lists the known fields in a fixed order under the intro, skipping blanks', () => {
    const text = whatsappFallbackText(
      'Intro:',
      { message: 'Hi', name: 'Ali', phone: '', company: 'ACME', consent: 'on' },
      (k) => k.toUpperCase(),
    );
    expect(text).toBe('Intro:\nNAME: Ali\nCOMPANY: ACME\nMESSAGE: Hi');
  });

  it('W167: appends suspectName, suspectContact and licence after message, in that order', () => {
    const text = whatsappFallbackText(
      'Intro:',
      {
        licence: 'OEP-1234',
        suspectContact: '+92 300 000 00 00',
        suspectName: 'Fake Agency Ltd',
        description: 'They asked for a visa fee up front.',
        reporterName: 'Ayşe',
        message: 'Hi',
        // accepted Phase A omissions (W167) and never-carried keys stay out
        trades: 'welding',
        evidenceKeys: 'website-fraud/x.jpg',
      },
      (k) => k.toUpperCase(),
    );
    expect(text).toBe(
      [
        'Intro:',
        'REPORTERNAME: Ayşe',
        'DESCRIPTION: They asked for a visa fee up front.',
        'MESSAGE: Hi',
        'SUSPECTNAME: Fake Agency Ltd',
        'SUSPECTCONTACT: +92 300 000 00 00',
        'LICENCE: OEP-1234',
      ].join('\n'),
    );
  });
});
```

Everything else in the file (imports, `base`, the `beforeEach`/`afterEach` that spy on `window.open` and `navigator.sendBeacon`) stays as it is — both new cases use those module-level hooks.

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/forms/__tests__/FallbackPanel.test.tsx --maxWorkers=1
```
Expected: 2 failed, 13 passed — the pure case on `expected 'Intro:\nREPORTERNAME: Ayşe\nDESCRIPTION: …\nMESSAGE: Hi' to be 'Intro:\n…\nLICENCE: OEP-1234'`, the panel case on `expected '…' to contain 'Şüpheli kişi veya kurum: Fake Agency Ltd'` (the current list stops at `message`).

- [ ] **Step 3: Implement**

`src/forms/client/FallbackPanel.tsx` — replace the `WHATSAPP_FIELDS` block, from its doc comment `/** The fields worth carrying into the WhatsApp message, in reading order.` through `] as const;` (find it with `grep -n "const WHATSAPP_FIELDS" src/forms/client/FallbackPanel.tsx`), with:

```tsx
/** The fields worth carrying into the WhatsApp message, in reading order. Anything else the
 *  page posted (consent, chips, hidden refs, object keys) stays out — the visitor is about to
 *  send this by hand. W167 (WP2b T14) appends the fraud report's `suspectName` and
 *  `suspectContact` — without them a fallen-back report loses who was reported — and the
 *  sourcing partner's `licence`. Every other omission (`trades`, `candidatesPerYear`, `day`,
 *  `slot`, `reply`, `dial`, `portfolioUrl`) and printing option values as their raw keys are
 *  accepted for Phase A; label mapping is a Phase B item. */
const WHATSAPP_FIELDS = [
  'name',
  'reporterName',
  'company',
  'email',
  'reporterEmail',
  'phone',
  'reporterPhone',
  'city',
  'country',
  'sector',
  'trade',
  'roleNeeded',
  'headcount',
  'startWhen',
  'preferredDate',
  'preferredTime',
  'subject',
  'topic',
  'description',
  'message',
  'suspectName',
  'suspectContact',
  'licence',
] as const;
```

Nothing else in the component changes (`whatsappFallbackText` already walks the list and skips blanks; the label lookup `` sys(`form.labels.${k}`) `` resolves all three).

`docs/ARCHITECTURE.md` — in `## Forms flow (D11)`, the bullet that begins "**Failure — the visitor-side fallback panel**" names the prefill fields in a parenthetical; find it with `grep -n 'message — `whatsappFallbackText`' docs/ARCHITECTURE.md` (the hook blocks a whole-file read — grep, then edit that one line; if the parenthetical is not there verbatim, stop and report). Replace `` (name, company, e-mail, phone, city, …, message — `whatsappFallbackText`) `` with:

```markdown
(name, company, e-mail, phone, city, …, message, then the fraud report's `suspectName`/`suspectContact` and the partner `licence` — `whatsappFallbackText`; W167, WP2b T14: every other posted field stays out and option values print as their raw keys in Phase A)
```

- [ ] **Step 4: Verify** — the scoped run first, then the FULL low-memory verify line before the commit (W178):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write src/forms/client/FallbackPanel.tsx src/forms/__tests__/FallbackPanel.test.tsx docs/ARCHITECTURE.md && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run src/forms/__tests__/FallbackPanel.test.tsx --maxWorkers=1
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: the scoped run — 15 passed; the full line — typecheck/lint/format green and every Vitest file green (no page test asserts the exact prefill text; the three names append after `message`, so every existing `toContain` still holds).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add src/forms/client/FallbackPanel.tsx src/forms/__tests__/FallbackPanel.test.tsx docs/ARCHITECTURE.md
git commit -m "fix(forms): the WhatsApp fallback prefill carries the fraud report's suspect and the partner licence (W167, T14)

FallbackPanel's WHATSAPP_FIELDS omitted suspectName and suspectContact, so
a fraud report that fell back to WhatsApp lost who was reported. The list
now ends message, suspectName, suspectContact, licence; the labels exist in
both locales. Every other omission and the raw option values stay accepted
for Phase A (W167). Pinned in FallbackPanel.test.tsx; ARCHITECTURE § Forms
flow names the three fields.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 4 — Prerequisites: staging exists, the door is verified, two env configurations (owner + controller)

This cycle writes no code. Each item is a check with a recorded answer; the ledger (Cycle 9) keeps the answers. **Cycles 5–6 (test-class, automated) need only item 1, item 2's `staging` BRANCH and item 3 — neither the Turnstile site key nor the custom domain.** Until `staging.jobsadmire.com` resolves (the DNS half of item 2 — an owner step), they run against the branch's own preview URL `https://jobsadmirewebsite-git-staging-tech-admire-apps.vercel.app`: the same deployment and the same branch-scoped variables (W92), read as the preview face by `siteFace` (W135). The custom domain matters to Cycle 7 only, as the Turnstile widget's hostname. Cycle 7 (the real, manual run) additionally needs item 4. Nothing in Cycle 7 starts until items 2 (domain) and 4 are ✓; Cycles 5–6 can start as soon as item 3 is ✓.

- [ ] **Step 1 / Step 2:** none — this cycle has no test to fail; it is a checklist, verified by the site-health/ping bodies each item below asks for.

- [ ] **Step 3: The checklist**

  1. **The Vercel project and the production guard (owner + controller, 10 min).** In `vercel.com/tech-admire-apps/jobsadmirewebsite` → Settings → Git: record the **Production Branch** — expected `main` (`docs/DEPLOYMENT.md` § Deploy discipline: the live project is git-linked to this repo with `main` as its production branch) — and verify the two guards that keep `main` from replacing the frozen old site until the Phase A cutover (D24, W105): `vercel.json` on `wp2/foundation` (and so on `staging`) carries `"git": { "deploymentEnabled": { "main": false } }`, and Settings → Git → Ignored Build Step reads `[ "$VERCEL_GIT_COMMIT_REF" = "main" ] && exit 0 || exit 1`. **Never change the Production Branch or either guard in this task** — removing the guards IS the WP7a cutover; record both values. Deployment Protection (Settings → Deployment Protection): Vercel Authentication ON for previews — leave it on; use the existing **Protection Bypass for Automation** secret (same screen — the WP2a preview gate runs already send it, W137; create one only if none exists) and export it in the controller's shell as `VERCEL_AUTOMATION_BYPASS_SECRET` (never in the repo, never printed; `docs/DEPLOYMENT.md` gets its NAME only, in Cycle 9). Every `curl`/Playwright/`lhci` call against a protected preview in this task sends `-H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET"` (`e2e/helpers/bypass.ts`'s `protectionBypassHeaders`, already wired into `playwright.config.ts` and `scripts/gate.sh` — nothing new to build).
  2. **`staging.jobsadmire.com`** (W92; spec §5 WP0 item 7 for the DNS + Turnstile hostname): Settings → Domains → Add `staging.jobsadmire.com`, Git Branch = `staging` (a real branch, fast-forwarded from `wp2/foundation` — never `staging` pointed straight at `wp2/foundation`, so the controller controls exactly when a redeploy happens):
     ```bash
     cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git fetch origin && \
       git branch -f staging origin/wp2/foundation 2>/dev/null || git branch staging origin/wp2/foundation && \
       git push origin staging
     ```
     At the DNS provider add `staging CNAME cname.vercel-dns.com`; wait for the certificate. Check: `curl -sI https://staging.jobsadmire.com/ | head -1` → `HTTP/2 302` (the SSO redirect) and, with the bypass header, `HTTP/2 200`.
  3. **Preview environment variables scoped to the `staging` branch only (W92 — never "all Preview", which would make every OTHER task's page e2e non-deterministic and let a stray gate run file a real lead):** Settings → Environment Variables → add each with Environment = **Preview**, "Preview Branches" = `staging` only.
     - **Phase A (test-class, for Cycles 5–6 — set this first, needs no Turnstile):** `OPS_API_URL=https://operations.jobsadmire.com`; `OPS_WEBSITE_WRITE_TOKEN=<the wst_… TEST-class token value from Ops → Integrations>` (yes — the WRITE slot deliberately holds the test token here: `doorConfig()` only ever reads `OPS_WEBSITE_WRITE_TOKEN`, and Ops decides `isTest` from the token string itself, not from which env var carried it); leave `NEXT_PUBLIC_TURNSTILE_SITE_KEY` **unset** (`turnstileSiteKey` becomes `null`, `FormShell` renders no `Turnstile` widget, the envelope carries no `captchaToken`, and Ops's own rule — verified in the code — is `isTest && !captchaToken → skipped`: no widget to solve, no captcha checked, `isTest: true`, `dryRun: true`). `CONTENT_SOURCE=LOCAL`; `NEXT_PUBLIC_SITE_URL=https://www.jobsadmire.com` (the legacy value `https://jobsadmire.com` broke the routes tests once — `docs/DEPLOYMENT.md` § Deploy discipline). Do **not** set `NEXT_PUBLIC_GTM_ID`/`GA4_ID`/`ADS_ID`/`ADS_CONVERSION_LABEL` here — W146: Preview stays dark, on purpose, so this task's `generate_lead`/`conversion` proof reads `window.dataLayer` directly, never GA4. Redeploy `staging` (Deployments → ⋯ → Redeploy — `NEXT_PUBLIC_*` values are baked at build time). Also export `OPS_WEBSITE_TEST_TOKEN=<the same wst_… value>` in the **controller's own shell** (not a Vercel variable) for `npm run door:smoke` (Cycle 2) — the site itself never reads this name; only the standalone script and the Ops-side `Authorization` header the site happens to send in this phase share the same value.
     - **Two throwaway branches for the pure-network failure paths (Cycle 6), each with TWO branch-scoped Preview variables — `OPS_API_URL` and a DUMMY `OPS_WEBSITE_WRITE_TOKEN` (any non-secret string of ≥ 20 characters, e.g. `t14-dummy-not-a-door-token`; never a real credential).** Without the dummy, `doorConfig()` returns null and the form answers `unauthorized` with no network call at all (`src/forms/env.ts`, `WEBSITE_TOKEN_MIN_LENGTH = 20`); W92 keeps every real door variable off these branches. `preview/t14-off` with `OPS_API_URL=https://operations.jobsadmire.com/nope` (meant to answer 404 → `off` — **pre-check it before Cycle 6 relies on it**: `curl -s -o /dev/null -w '%{http_code}\n' -X POST https://operations.jobsadmire.com/nope/api/website/v1/forms/callback` must print `404`; any other code — a 405, or an HTML 200 from whatever Apache serves under `/nope` — maps to `invalid`/`unavailable`, not `off`: then record "`off` via the browser not reachable this way" and keep `npm run door:smoke`'s unknown-key row as the `off` evidence); `preview/t14-blackhole` with `OPS_API_URL=https://door.invalid` (`.invalid` never resolves → `unavailable`/`network`). Push them as new branch refs off the current `wp2/foundation` HEAD (a new ref alone triggers a build — no commit needed):
       ```bash
       cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git fetch origin && \
         git branch preview/t14-off origin/wp2/foundation && git branch preview/t14-blackhole origin/wp2/foundation && \
         git push origin preview/t14-off preview/t14-blackhole
       ```
       Record the two preview URLs (`jobsadmirewebsite-git-preview-t14-off-tech-admire-apps.vercel.app`, `…-t14-blackhole-…`). Delete both branches (and their deployments) at the end of Cycle 6.
     - **Ping proof for Phase A**, from the controller's machine:
       ```bash
       curl -s -H "Authorization: Bearer $OPS_WEBSITE_TEST_TOKEN" https://operations.jobsadmire.com/api/website/v1/ping
       ```
       Expected: `{"data":{"tokenClass":"test","moduleEnabled":true,"captcha":"configured"|"missing","secondHumanConfigured":true|false,"trippedForms":[]}}` — the module is already flipped on (verified below); this call alone proves nothing about `staging`'s own config, only that the token is real. Then `https://staging.jobsadmire.com/api/site-health` (bypass header) → `ok`; `checks.opsPing: "ok"` (W75 — the door being reachable is what this check reads; it says nothing about which token class staging holds); `ops.state: "ok"`.
  4. **Turnstile and the write-token switch (owner, blocks Cycle 7 only).** Cloudflare → Turnstile → the website widget: hostnames include `jobsadmire.com`, `www.jobsadmire.com` and **`staging.jobsadmire.com`**; widget mode *Managed*; the widget's **site key** becomes the Preview value of `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (scoped to `staging`, same screen as item 3) and its **secret** goes on Ops → Integrations (`WebsiteIntegrationConfig`, `website:MANAGE_KEYS`, `POST /api/website/integrations/test` → `{ ok, error }` proves it). **This is the one hard prerequisite this whole task cannot substitute for** — until the owner supplies both halves, Cycle 7 does not start; Cycles 1–6 are unaffected and can run (and should — there is no reason to wait). When it is ready: on Ops → Integrations, also confirm `secondHumanEmail`/`Name` are filled (the second human who receives `WEBSITE_FORM_RECEIVED` mail) and warn them by name that Cycle 7 will send ~15 such mails within the hour. Then flip `staging`'s Preview variables to the real values — `OPS_WEBSITE_WRITE_TOKEN=<wsw_… the real write token>`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<the real site key>` — and redeploy `staging` again (the second of the two builds this task needs; the first, Phase A build, already proved the wire contract end to end without spending it).
  5. **The Ops door state (verify only — the flip already happened on 2026-09-24, Operations `main` ≥ `47a2160`).** Signed in as super-admin on `operations.jobsadmire.com` → Website → Integrations (`/admin/website/integrations`): chips `hasWriteToken`, `hasTestToken` ✓ (from item 3); `hasTurnstileSecret` becomes ✓ only once item 4 lands; the "public intake is OFF" banner is **absent** (the module is on). `GET /api/website/v1/ping` with no token → `401` (fails closed, `WebsiteModuleEnabledGuard` before `WebsiteApiGuard` — confirms the flip, per the Ops WP3a gate record).
  6. **Identities and the cleanup contract — needed for Cycle 7 only** (Cycles 5–6 are `dryRun: true`, nothing to clean up beyond the rows themselves, X17's 90-day purge). Mailbox: `<owner-alias>+t14-<nn>@<owner domain>` (plus-addressing, one per instance — the door's e-mail check accepts it and an autoresponder to a stranger's address or `@example.com` would bounce). Name: every `name`/`reporterName` starts with `[T14-<nn>` (the automated runs put the run stamp inside the tag: `[T14-<nn> <stamp>]`); every free-text field starts with `T14 staging run — please ignore` (already baked into `e2e/fixtures/form-instances.ts`'s `{stamp}`-carrying values). Phone: the controller's own mobile. CV: `t14-cv.pdf`, any real PDF **≤ 3 MiB** (W73/W116 — not 5 MB, the door's own cap, which this site never lets a visitor reach). Evidence: `t14-1.jpg`, `t14-2.png`, `t14-3.pdf`, each **≤ 3 MiB** (same reason). Cleanup owner: the owner, within 24 h of Cycle 7 — the Sales inquiries created (delete or mark lost, reason "T14 test"), the two applicants (Internal Recruitment → the two openings → applicant `[T14-16]`/`[T14-17]` → delete). `website_form_submissions` rows are left (no UI delete; 90-day purge) and are the durable evidence.

- [ ] **Step 4: Verify** — every sub-item above has a recorded ✓ or an explicit "not yet, blocks Cycle 7 only" before Cycle 5 (items 1–3) or Cycle 7 (item 4) starts.

- [ ] **Step 5: Commit** — none; this cycle's record is the ledger (Cycle 9), not a git commit.

---

#### Cycle 5 — The automated staging run: happy path per instance, test-class, no Turnstile needed

This is the brief's item "the staging e2e spec(s) for the happy path per instance (test token; the assertion set)". It runs against `staging` while Cycle 4's Phase A variables are live (the write-token slot holds the TEST token, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset) — 14 of the 17 instances, submitted by a real browser through the real page, with no owner needed and no real lead filed. Rows 15–17 (the evidence upload; the two careers applications with a real CV PDF) are in the spec but skip themselves with the reason and run only in the owner-gated Cycle 7 (W171), so no automated run stores a real file in production.

- [ ] **Step 1: Write the failing test**

`e2e/door-test-mode.spec.ts` (new; the happy-path half — Cycle 6 appends the failure-path tests to the same file):

```ts
import { expect, test, type Page } from '@playwright/test';
import { FORM_INSTANCES, type FieldFill, type FormInstance } from './fixtures/form-instances';

/**
 * T14 Cycles 5–6: this whole file talks to a REAL door with a TEST-class credential — never
 * against a door-less preview and never against `staging` while it holds the real write token
 * (Cycle 4 item 4's switch). It is inert everywhere else: `npx playwright test` (inside every
 * other task's `npm run gate`) runs this file too, and every test in it skips itself unless the
 * runner explicitly opts in, exactly like `e2e/ops.spec.ts`'s REVALIDATE_SECRET-gated cases.
 */
const ENABLED = process.env.E2E_DOOR_TEST_MODE === '1';
// Desktop project only: rows 3 (the ≥ 701 px quick-quote) and 5 (`#calc-role`, `max-md:hidden`)
// have no phone-width control, and one door run per instance is the point — never two per run.
test.skip(({ isMobile }) => isMobile, 'T14 door runs use the desktop project only');
const REASON =
  'set E2E_DOOR_TEST_MODE=1 and run against a deployment whose OPS_WEBSITE_WRITE_TOKEN holds a TEST-class token (wst_…) and NEXT_PUBLIC_TURNSTILE_SITE_KEY is UNSET (T14 Cycle 4 item 3) — never against staging while it is configured for the Cycle 7 real run';

type DataLayerEntry = Record<string, unknown>;
const dataLayer = (page: Page) =>
  page.evaluate(() => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? []);
const eventsFor = async (page: Page, event: string, formKey: string) =>
  (await dataLayer(page)).filter((e) => e.event === event && e.form_key === formKey);

/** Fills one instance's fields inside its own `<form>`, scoped by `data-testid`, and returns the
 *  `<form>` locator (for the caller to tick consent and submit). `{stamp}` becomes a run-unique
 *  token so two runs in the same clock hour never dedupe onto the same row (the door hashes
 *  `fields`, and `sourcePath` — this file sends none — is not part of that hash). */
async function fillInstance(page: Page, row: FormInstance, stamp: string) {
  if (row.open) await page.locator(row.open).first().click();
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.scrollIntoViewIfNeeded();
  for (const f of row.fields as readonly FieldFill[]) {
    const value = f.value.replace('{stamp}', stamp);
    const control = form.locator(`[name="${f.name}"]`);
    if (f.kind === 'select') await control.selectOption(value);
    else if (f.kind === 'radio') await form.locator(`[name="${f.name}"][value="${value}"]`).check({ force: true });
    // A checkbox needs no `value` attribute in the DOM (it posts "on" by default) — match it by name.
    else if (f.kind === 'checkbox') await control.check({ force: true });
    else await control.fill(value);
  }
  if (row.consentMode === 'checkbox') await form.locator('input[name="consent"]').check();
  return form;
}

async function submitAndAssertLead(page: Page, row: FormInstance) {
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  const thankYou = row.locale === 'tr' ? '/tesekkurler' : '/en/thank-you';
  await expect(page).toHaveURL(new RegExp(`${thankYou.replace('/', '\\/')}\\?form=${row.doorKey}`));
  await expect.poll(async () => eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(1);
  await expect.poll(async () => eventsFor(page, 'conversion', row.doorKey)).toHaveLength(1);
}

// The 13 instances a generic fill-and-submit covers. Rows 5 (the calculator needs the engine run
// first), 15 (needs three file uploads before submit) and 16/17 (careers needs a live opening +
// a CV upload first) get their own tests below — `fillInstance` only fills text/select/radio/
// checkbox controls, never a file input. Rows 15–17 skip themselves here (W171): they store real
// files, so they run only in the owner-gated Cycle 7 with the write token.
const GENERIC_IDS = new Set([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

for (const row of FORM_INSTANCES.filter((r) => GENERIC_IDS.has(r.id))) {
  test(`instance ${row.id}: ${row.page} — ${row.mode} (${row.doorKey}, test class)`, async ({ page }) => {
    test.skip(!ENABLED, REASON);
    const stamp = `T14-${row.id}-${Date.now()}`;
    await page.goto(row.path[row.locale]);
    // The consent-sheet accept, if present, so nothing blocks a later click; harmless when the
    // sheet never rendered (R38: no container id in Phase A).
    const accept = page.getByTestId('consent-accept');
    if (await accept.isVisible().catch(() => false)) await accept.click();
    await fillInstance(page, row, stamp);
    await submitAndAssertLead(page, row);
  });
}

test('instance 5: Cost Calculator — written quote (calculator, test class)', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 5)!;
  const stamp = `T14-5-${Date.now()}`;
  // T3: the `#calculator` hash loads the calculator island without a touch (its own e2e proves it).
  await page.goto(`${row.path.tr}#calculator`);
  await expect(page.getByTestId('calc-island')).toBeVisible();
  // Run the engine once so `estimateSummary`/`trade`/`headcount`/`durationMonths` have a real
  // estimate to serialise server-side (T3's `toCalculatorFields` reads the `est_*` hidden inputs).
  // T3's real controls: the role `<select id="calc-role">` (desktop; `max-md:hidden` below 701 px)
  // and the `Stepper` input `#calc-headcount` (W131: it commits on blur/Enter); the contract
  // stays at its default 12 months.
  await page.locator('#calc-role').selectOption('cnc');
  await page.locator('#calc-headcount').fill('8');
  await page.locator('#calc-headcount').press('Enter');
  await page.getByTestId('calc-quote-open').click();
  await fillInstance(page, row, stamp);
  await submitAndAssertLead(page, row);
});

test('instance 15: Verify — fraud report with three evidence files (fraud, test class)', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  // The TEST token's evidence upload is a dry run (`{ key: null, dryRun: true }`, Ops X16), and
  // `uploadFraudEvidence` treats a null key as an outage BY DESIGN (src/forms/uploads.ts — the
  // visitor path never uses the test token), so no `evidenceKeys` input can appear in this phase.
  // Row 15 is proven in Cycle 7 (write token) only — W171.
  test.skip(true, 'evidence uploads need the write token (test-class upload is a dry run) — Cycle 7 proves row 15 (W171)');
  const row = FORM_INSTANCES.find((r) => r.id === 15)!;
  const stamp = `T14-15-${Date.now()}`;
  await page.goto(row.path[row.locale]);
  await fillInstance(page, row, stamp);
  // EvidenceUpload (`data-testid="fraud-evidence"`) is one `<input type="file" multiple>` — the
  // visitor picks up to three files in one dialog, and the ISLAND uploads them one server-action
  // call each (W101/W73/W116, never all three in one call, never inside the fraud action's own
  // toFields). Each buffer here is trivial and well under the 3 MiB per-file site cap.
  await page.locator(`form[data-testid="${row.testId}"] [data-testid="fraud-evidence"] input[type="file"]`).setInputFiles([
    { name: 't14-1.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('T14 synthetic evidence — not a real file.') },
    { name: 't14-2.png', mimeType: 'image/png', buffer: Buffer.from('T14 synthetic evidence — not a real file.') },
    { name: 't14-3.pdf', mimeType: 'application/pdf', buffer: Buffer.from('T14 synthetic evidence — not a real file.') },
  ]);
  // The three sequential uploads finish (each renders its own hidden evidenceKeys input); the
  // shell blocks submit while any is still in flight (a native listener cancels the form).
  await expect(page.locator(`form[data-testid="${row.testId}"] input[name="evidenceKeys"]`)).toHaveCount(3, { timeout: 15_000 });
  await submitAndAssertLead(page, row);
});

for (const id of [16, 17] as const) {
  test(`instance ${id}: Careers detail — apply (careers, test class, dynamic opening)`, async ({ page }) => {
    test.skip(!ENABLED, REASON);
    // W171: the CV is a REAL PDF through the public `/api/careers/upload-cv`, which has no test
    // class — the apply action uploads it before the door call, so even a test-class run would
    // leave an orphan `careers-cv/*.pdf` in production storage. Rows 16–17 run only in the
    // owner-gated Cycle 7 with the write token; the body below documents what that run does.
    test.skip(true, 'careers rows upload a real PDF through the public upload-cv (no test class) — Cycle 7 proves rows 16–17 (W171)');
    const row = FORM_INSTANCES.find((r) => r.id === id)!;
    const stamp = `T14-${id}-${Date.now()}`;
    // Resolve the live opening for this row's country — never a hardcoded slug (an opening can
    // close between reconciliation and execution).
    // The openings list is an OPERATIONS route (public, no token — the one scripts/gate-routes.mjs
    // reads), not a website route; Node's fetch keeps the bypass header off the request.
    const ops = (process.env.OPS_API_URL ?? 'https://operations.jobsadmire.com').replace(/\/+$/, '');
    const list = (await fetch(`${ops}/api/careers/openings`).then((r) => r.json())) as { data: unknown };
    const opening = (list.data as Array<{ slug: string; country: string }>).find(
      (o) => o.country.toUpperCase() === row.dynamicOpening!.country,
    );
    test.skip(!opening, `no live opening for country ${row.dynamicOpening!.country} — record "not reachable" in the ledger`);
    const detail = row.locale === 'tr' ? `/kariyer/${opening!.slug}` : `/en/careers/${opening!.slug}`;
    await page.goto(detail);
    await page.setInputFiles(
      page.locator(`form[data-testid="${row.testId}"] input[name="cv"]`),
      { name: 't14-cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF\n') },
    );
    await fillInstance(page, row, stamp);
    await submitAndAssertLead(page, row);
  });
}
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx playwright test e2e/door-test-mode.spec.ts --project=desktop
```
Expected: every test skips (`E2E_DOOR_TEST_MODE` unset) — 17 skipped (`--project=desktop`), 0 failed. This IS the "fails" proof for a checklist-shaped cycle: the file does not exist yet before Step 3, so this command errors `no tests found` until the file is written; once written but before `E2E_DOOR_TEST_MODE=1` is exported it skips cleanly (never fails, never a false green against a door-less run).

- [ ] **Step 3: Implement** — the file above IS the implementation (Cycles 5 and 6 build one file in two passes; nothing else changes). No page code changes here — every field name, `testId` and `idScope` already exists once T1–T13 land (W99); this task only drives them.

- [ ] **Step 4: Verify**

Locally, with no server at all (every test skips before it navigates — proves nothing runs by accident), then the FULL low-memory verify line before the commit (W178):
```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write e2e/door-test-mode.spec.ts && npx playwright test e2e/door-test-mode.spec.ts --project=desktop
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: 17 skipped (E2E_DOOR_TEST_MODE unset); typecheck/lint/format green and every Vitest file green (Vitest never collects `e2e/**`).

Then, once Cycle 4 items 1–3 are ✓ (staging's Phase A build is live; until the `staging.jobsadmire.com` alias resolves, use the branch URL `https://jobsadmirewebsite-git-staging-tech-admire-apps.vercel.app` as `E2E_BASE_URL` here and in Cycle 6):
```bash
E2E_BASE_URL=https://staging.jobsadmire.com E2E_DOOR_TEST_MODE=1 VERCEL_AUTOMATION_BYPASS_SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET" \
  npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "instance"
```
Expected: 14 passed + 3 skipped — row 15 (evidence needs the write token) and rows 16–17 (a real CV PDF through the public `upload-cv`) skip with their reasons and are proven in Cycle 7 (W171); the calculator row included. Any red row is fixed in the OWNING page task's files (a normal commit on `wp2/foundation`, re-run that one row afterwards — `npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "instance 7"`). Record the pass/fail per instance in the ledger (Cycle 9); this run is the automated half of the Ledger line's "per-form pass/fail".

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add e2e/door-test-mode.spec.ts
git commit -m "test(e2e): the automated staging happy path — 14 instances, test-class token, no Turnstile needed (T14)

Drives the real pages' real forms through a real door with the TEST
token in the write-token slot and no Turnstile site key configured, so
Ops skips the captcha check (isTest && !captchaToken) and runs every
handler as a dry run. Rows 15-17 (evidence files, real CV PDFs) skip
with their reason and run only in the owner-gated Cycle 7 (W171). Skips
itself everywhere E2E_DOOR_TEST_MODE is unset, so it is inert inside
every other task's ordinary gate run.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 6 — The automated failure paths: replay, 404, 5xx/unavailable, honeypot (still test-class, no Turnstile; 429 stays unit-proven — W171)

Every path here is already a unit test in the kernel (`src/forms/__tests__/post.test.ts` maps 404/429/5xx/network/timeout; `FallbackPanel.test.tsx` renders every kind with its WhatsApp variant; `action.test.ts` redirects on `replayed: true`) and Cycle 2's `door-smoke.test.ts` proves the wire-level classification. This cycle proves the same mappings **through the real browser against the real door**, which is the one thing neither of those can do (a unit test mocks the response; `door-smoke` never renders a panel).

**No 429 here (W171).** A test-class post never counts toward the abuse trip (`recordVerified` runs only for `!isTest`), so a live 429 would need the trip marker `website:abuse:tripped:<form>` written into the PRODUCTION Operations Redis — the only one, on the shared VPS — which would also pause that form for every real visitor. W171 withdrew W100's clause that allowed it; no step of this task writes production Operations Redis or data. The `tripped` mapping is proven by `src/forms/__tests__/post.test.ts` (429 → `tripped`), `src/forms/__tests__/FallbackPanel.test.tsx` (the `tripped` copy, WhatsApp **primary**, the bare `https://wa.me/<number>` href) and `scripts/door-smoke.test.ts`'s `classifySmoke`; a live 429 proof is its own Operations follow-up (a test-class-only trip switch — **Foundation gaps** item 2). The browser rendering of a 429 can be rehearsed without any production write against a local fixture door: a ~40-line `e2e/mocks/tripped-door.mjs` in T11's `e2e/mocks/careers-door.mjs` pattern (`node:http` on `127.0.0.1:8482`; `POST /api/website/v1/forms/:formKey` → `429 { "message": "…", "fallback": "whatsapp" }`, everything else 404), a production build started with `OPS_API_URL=http://127.0.0.1:8482` and a dummy ≥ 20-character `OPS_WEBSITE_WRITE_TOKEN` (the kernel reads both at request time — `src/forms/env.ts`), then row 12's visit form → `[data-testid="form-fallback"][data-kind="tripped"]`, the bare href, no `generate_lead`. That rehearsal is **not** part of this task: it needs a second `npm run start` beside Cycle 10's (W126 allows one per task), so it runs only if the controller schedules it as a separate item, and its code is written then.

- [ ] **Step 1: Write the failing test**

Append to `e2e/door-test-mode.spec.ts` (after the careers `for` loop from Cycle 5):

```ts
test('replay: submitting the identical body twice inside one clock hour still succeeds, once, and R37 keeps generate_lead at one', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!; // the Contact callback widget — cheap, no upload
  const stamp = `T14-R1-${Date.now()}`; // fixed for BOTH submits on purpose — replay needs an identical body
  await page.goto(row.path[row.locale]);
  await fillInstance(page, row, stamp);
  await submitAndAssertLead(page, row);
  // Second submit, identical fields: go back, the form still holds the same values (or refill
  // them identically), submit again inside the same hour.
  await page.goBack();
  await fillInstance(page, row, stamp);
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`\\/tesekkurler\\?form=${row.doorKey}`));
  // R37: same form key, same path, same browser context — the SECOND landing pushes no second
  // generate_lead/conversion, which is the accepted skew docs/ANALYTICS.md now records (Cycle 1).
  await page.waitForTimeout(300);
  expect(await eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(1);
  expect(await eventsFor(page, 'conversion', row.doorKey)).toHaveLength(1);
});

test('404 off: an unconfigured route answers the off panel (run with E2E_BASE_URL on preview/t14-off)', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!; // callback — cheap
  const stamp = `T14-404-${Date.now()}`;
  await page.goto(row.path[row.locale]);
  await fillInstance(page, row, stamp);
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  const panel = page.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'off');
  // W76/W95: `off` is a WhatsApp-primary kind — the anchor carries the bare chat only, no visitor data.
  await expect(panel.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+$/);
  expect(await eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(0);
  expect(page.url()).not.toContain('/tesekkurler');
});

test('unavailable: an unreachable door answers the panel within the W74/W117 budget (run with E2E_BASE_URL on preview/t14-blackhole)', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!;
  const stamp = `T14-5xx-${Date.now()}`;
  await page.goto(row.path[row.locale]);
  await fillInstance(page, row, stamp);
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  const started = Date.now();
  await form.locator('button[type="submit"]').click();
  await expect(page.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unavailable', { timeout: 12_000 });
  // W74/W117: one shared 9 s deadline for the whole call. `.invalid` fails DNS at once (a
  // connection-level failure), so the ONE immediate retry fails at once too and the panel lands
  // well under a second after the server action returns — the 9 s deadline bounds only a host
  // that never answers. The 12 s ceiling covers both; record the observed figure in the ledger
  // (Cycle 9), not asserted tightly here (CI timing varies).
  console.log(`unavailable panel after ${Date.now() - started} ms`);
});

test('honeypot: a filled honeypot answers success to the visitor and files no inquiry (SPAM row)', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!;
  const stamp = `T14-SPAM-${Date.now()}`;
  await page.goto(row.path[row.locale]);
  await fillInstance(page, row, stamp);
  // The honeypot is off-canvas, outside the tab order (`aria-hidden`, `tabIndex={-1}`) — a
  // visitor never reaches it; a bot's autofill (or this test) sets it directly.
  await page.locator(`form[data-testid="${row.testId}"] input[name="honeypot"]`).fill('x', { force: true });
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`\\/tesekkurler\\?form=${row.doorKey}`));
  // A bot's dataLayer is nobody's problem (D13 does not distinguish) — generate_lead still
  // fires; record this as the documented, accepted behaviour, not a defect.
  expect(await eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(1);
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "replay|off panel|unavailable|honeypot"
```
Expected: 4 skipped (E2E_DOOR_TEST_MODE unset) — the same "skip is the fail-state proof" shape as Cycle 5.

- [ ] **Step 3: Implement** — the appended tests above ARE the implementation; nothing else changes.

- [ ] **Step 4: Verify — first locally (with the FULL low-memory verify line, W178), then four separate invocations, each against the right target**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write e2e/door-test-mode.spec.ts && npx playwright test e2e/door-test-mode.spec.ts --project=desktop
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: 21 skipped (E2E_DOOR_TEST_MODE unset); typecheck/lint/format green and every Vitest file green.

1. **Replay** (staging, Phase A config):
   ```bash
   E2E_BASE_URL=https://staging.jobsadmire.com E2E_DOOR_TEST_MODE=1 VERCEL_AUTOMATION_BYPASS_SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET" \
     npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "replay"
   ```
   Expected: 1 passed.
2. **404 off** (the throwaway `preview/t14-off` branch — Cycle 4 item 3):
   ```bash
   E2E_BASE_URL=https://jobsadmirewebsite-git-preview-t14-off-tech-admire-apps.vercel.app E2E_DOOR_TEST_MODE=1 VERCEL_AUTOMATION_BYPASS_SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET" \
     npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "404 off"
   ```
   Expected: 1 passed.
3. **Unavailable** (the throwaway `preview/t14-blackhole` branch):
   ```bash
   E2E_BASE_URL=https://jobsadmirewebsite-git-preview-t14-blackhole-tech-admire-apps.vercel.app E2E_DOOR_TEST_MODE=1 VERCEL_AUTOMATION_BYPASS_SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET" \
     npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "unavailable"
   ```
   Expected: 1 passed; the console line prints the observed timing (expect well under 9 s: NXDOMAIN fails at once and W74/W117's one immediate retry fails at once too; the shared `ATTEMPT_TIMEOUT_MS` deadline only bounds a host that never answers — never the older "2 attempts × 4 s" shape).
4. **Honeypot** (staging, Phase A config):
   ```bash
   E2E_BASE_URL=https://staging.jobsadmire.com E2E_DOOR_TEST_MODE=1 VERCEL_AUTOMATION_BYPASS_SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET" \
     npx playwright test e2e/door-test-mode.spec.ts --project=desktop -g "honeypot"
   ```
   Expected: 1 passed.

Then tear down: delete the two throwaway branches and their deployments (`git push origin --delete preview/t14-off preview/t14-blackhole`). Record every timing and outcome in the ledger (Cycle 9); the 429 cell reads "unit-proven (W171)".

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add e2e/door-test-mode.spec.ts
git commit -m "test(e2e): the automated failure paths — replay, 404, unavailable, honeypot, still test-class (T14)

Each path already has a unit test (postForm's status map) and door-smoke
proves the wire-level classification; this proves the same mappings
through the real browser against the real door — the fallback panel's
kind, its WhatsApp variant, and that no visitor data ever sits in a DOM
href (W76/W95). 429 stays unit-proven: a live trip would write the
production Operations Redis (W171). Every test skips itself unless
E2E_DOOR_TEST_MODE=1.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 7 — The manual real-Turnstile walkthrough (owner-gated): the actual Gate A proof

This is the only cycle that needs Cycle 4 item 4 (Turnstile). It runs all 17 instances — the 14 Cycle 5 already proved automatically, once more for real, and rows 15–17 (the evidence upload; the two careers applications with a real CV PDF) for the first time, because W171 keeps every real stored file inside this owner-gated window — a human solving a real Turnstile widget, the write token filing real Inquiries/Applicants in production Operations, a real bell, a real e-mail, a real autoresponder. Nothing here is scripted; the "test" of this cycle is the instance table below, filled with evidence. A row without all six evidence cells is a failing row.

- [ ] **Step 1 / Step 2:** none — see Cycle 4's note on checklist-shaped cycles.

- [ ] **Step 3: The per-instance protocol (same for every row; `staging` must already carry Cycle 4 item 4's real values — the write token and the Turnstile site key, not the Phase A test-token config Cycles 5–6 used)**

  1. New **incognito window** (a fresh `sessionStorage` — R37 dedupes per session per form key, and four rows share the `hire` key). Sign in through Vercel SSO if prompted. Open the instance's URL from the table (or its anchor — `e2e/fixtures/form-instances.ts` `path`/`anchor` fields are the same ones this table is filled from; the two must never diverge). Accept the consent sheet (so GA4 tags fire — dark on this Preview face per W146, but the sheet itself still needs accepting to unblock GTM-adjacent UI, if any).
  2. Open DevTools → Console. Scroll to the form; **click into a field** — the Turnstile script loads on the first `focusin`/`pointerdown` inside the form (verified in `Turnstile.tsx`) and the widget appears in `[data-testid="turnstile"]` (Managed mode: normally a green tick within ~2 s; a challenge is fine).
  3. Fill the fields per `e2e/fixtures/form-instances.ts`'s row (rows 1–14: the same values `door-test-mode.spec.ts` used automatically in Cycle 5, so a mismatch between the two runs is itself a finding; rows 15–17 have no automated counterpart — W171). Tick consent where the form has a checkbox. Submit.
  4. Expected: navigation to `/tesekkurler?form=<key>` (TR) or `/en/thank-you?form=<key>` (EN) — the URL, the page's form-specific line (`sys.thankYou.forms.<key>`), and in the console `window.dataLayer.filter(e => e.event === 'generate_lead').length === 1` and `…'conversion'…length === 1`, both with `form_key: '<key>'`, `page`, `locale`. **W146: GTM is dark on this Preview face — do not look for these events in GA4 DebugView or Tag Assistant; they will not appear there. The `dataLayer` console line above is the whole proof.** Screenshot it (evidence cell E5).
  5. Operations → Website → Inbox: the newest row for that `formKey` — `isTest: false`, `status: HANDLED`, `captchaPassed: true`, `captchaDegraded: false`, `tokenClass: WRITE`, `payloadJson.fields` = exactly the row's *Fields sent* (cross-check the names — an unknown key would have been dropped silently, so a MISSING expected key here is the finding this whole task exists to catch), `createdEntityType/Id` set (`inquiry` for the INQUIRY/CALLBACK/VISIT/CALCULATOR keys, `applicant` for careers, none for fraud). Copy the submission id (E1) and the entity id (E2). For inquiry keys open Sales → Inquiries → the id: `contactName` = the typed name, `source: WEBSITE_FORM`, `messagePreview` first line `[website:<key>]` (or `[website:partner:<track>]`), classification per the row, and an assignee where an assignment rule matched (E3). Bell: a `WEBSITE_FORM_RECEIVED` notification in the signed-in super-admin's bell (E4). Mailbox: the autoresponder in the instance's locale (E6) — careers gets the careers-mailbox confirmation instead (RC25); fraud and callback/visit get their own templates.
  6. Fill the row. Any deviation (a field missing in `payloadJson`, a wrong classification, a panel instead of the thank-you, two events) is recorded in the *Notes* cell and fixed in the owning page task's files before this task closes (a page fix is a normal commit on `wp2/foundation`, re-run that row afterwards — both here and in Cycle 5's automated spec, so the two never disagree again).

- [ ] **Step 3 (continued): The instance table** (TR/EN already alternate in the fixture so both locales' autoresponders are seen — every key runs in at least one locale, `hire` in both; the *Fields sent* column is the exact wire names, drawn from `e2e/fixtures/form-instances.ts` + each row's `fixedFields`)

| # | Page | Instance / mode | Door key · fields sent | Expected in Operations | E1 sub id | E2 entity | E3 inquiry checks | E4 bell | E5 events | E6 mail |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Homepage (T1) `/` | hero, proposal mode | `hire` · name, company, email, phone, headcount, sector?, city?, startWhen? | Inquiry, classification `DIRECT_EMPLOYER` (or none if the page sends no `iAm` — record which; the fixture carries no `iAm` field for this row, so record whether Ops classifies it `null`/`DIRECT_EMPLOYER`), preview `[website:hire]` + `city: Antalya` | | | | | | |
| 2 | Homepage (T1) `/en` | hero, "call me back" mode | `callback` · name, phone, topic?, city? | Inquiry, classification none, preview `[website:callback]` | | | | | | |
| 3 | Hire Workers (T2) `/isci-talebi` | quick-quote (≥ 701 px, `hire-form-quick`) | `hire` · name, company, email, phone, city, roleNeeded, headcount (all required) | Inquiry, preview `[website:hire]`, `roleNeeded: Welder`, `city: Antalya` | | | | | | |
| 4 | Hire Workers (T2) `/en/hire-workers` | request form (`hire-form-full`) | `hire` · name, company, email, phone (dial+number composed), sector, roleNeeded, headcount, city?, startWhen?, message? | Inquiry; `phone` stored as `+90…`, `sector: factory`, `startWhen: month1` | | | | | | |
| 5 | Cost Calculator (T3) `/maliyet-hesaplayici` | written quote (`#calculator` card, after estimating CNC/8/12mo) | `calculator` · name, email, phone?, company?, country?, headcount, trade, durationMonths, estimateSummary, message? | Inquiry, classification none, preview `[website:calculator]`, `estimateSummary:` carries `formatTRY` figures (TR `… ₺`) ≤ 2000 chars | | | | | | |
| 6 | Partner (T5) `/en/partner-with-us` | HR-agency track | `hire` · name, company, email, phone, country `TR` (fixed), iAm `hr_agency` (fixed), city (required), message? | Inquiry, classification `HR_AGENCY`, preview `[website:hire]` | | | | | | |
| 7 | Partner (T5) `/ortak-olun` | sourcing-partner track | `partner` · name, company, email, phone, country (ISO-2 select), track `sourcing` (fixed), licence (required), candidatesPerYear?, trades? — **no city, no message** | Inquiry, classification `SOURCING_PARTNER`, preview `[website:partner:sourcing]`, `country` stored `PK` | | | | | | |
| 8 | Partner (T5) `/en/partner-with-us` | training-institute track | `partner` · name, company, email, phone, country, track `institute` (fixed), city?, candidatesPerYear?, trades? — **no licence, no message** | Inquiry, `SOURCING_PARTNER`, preview `[website:partner:institute]` | | | | | | |
| 9 | Contact (T7) `/iletisim` | enquiry, topic hire | `contact` · name, email, phone, company, topic `hire`, iAm `direct_employer` (fixed), subject, city?, message (always non-empty) | Inquiry, classification `DIRECT_EMPLOYER`, preview `[website:contact]` then `subject: [hire] Need 5 welders` | | | | | | |
| 10 | Contact (T7) `/en/contact` | enquiry, topic permit | `contact` · …, topic `permit`, iAm `direct_employer` (fixed — confirmed in code), subject, city? | Inquiry, preview `subject: [permit] …`, classification `DIRECT_EMPLOYER`. **Also check:** selecting the `job` topic renders no form at all (record pass/fail, not a submission). | | | | | | |
| 11 | Contact (T7) `/iletisim` | callback widget | `callback` · name, phone, preferredTime (`day slot`, composed) — **no city, no topic on this instance** | Inquiry, preview `[website:callback]` + `preferredTime: tomorrow 14-16` | | | | | | |
| 12 | Contact (T7) `/en/contact` | book a visit | `visit` · name, email, phone, office `antalya` (fixed), preferredDate?, preferredTime? | Inquiry, preview `[website:visit]` + `office: antalya` | | | | | | |
| 13 | Available Workers (T8) `/adaylar` | request form, **inside the `#pool-form` hero card** (not `#pool`, which is the empty state the header CTA targets) | `workers` · iAm, name, company, email, phone, city (required), trade (required), country `TR` (fixed), headcount?, startWhen?, message? | Inquiry, classification per `iAm`, preview `[website:workers]` | | | | | | |
| 14 | Verify (T10) `/en/verify` | fraud report, no evidence | `fraud` · reporterName (required), reporterEmail (required), reporterPhone?, description (≥ 20, required), suspectName?, suspectContact? | Row only (FRAUD_REPORT creates no entity), `evidenceKeys` absent/empty; bell + second-human mail still fire | | — | — | | | |
| 15 | Verify (T10) `/temsilci-dogrulama` | fraud report with three evidence files | `fraud` · … + evidenceKeys `["website-fraud/…", ×3]`, each file **≤ 3 MiB** | Row with three keys; inbox detail → **View** streams each (`…/evidence/:index/view`), **Copy link** gives a 15-min presign; a 4th file is refused by the page before the door (`MAX_EVIDENCE_FILES = 3`) | | — | — | | | |
| 16 | Careers detail (T11) `/kariyer/<live TR slug>` | standard apply (CV PDF ≤ 3 MiB, country TR — residency lock, pre-selected) | `careers` · openingSlug, cvKey (`careers-cv/<uuid>.pdf`), name, email, phone, country `TR` (locked), city?, coverLetter? | Applicant on the TR opening (`createdEntityType: applicant`), `skipNotification` (no `WEBSITE_FORM_RECEIVED`, no second-human mail — RC25), careers-mailbox confirmation to the applicant, `APPLICANT_RECEIVED` to the hiring owner | | | — | (none, by design) | | careers mail |
| 17 | Careers detail (T11) `/en/careers/<live PK slug>` | PK opening — the `expectedSalary` branch | `careers` · … + expectedSalary (required for PK), expectedSalaryCurrency (auto = the opening's `payCurrency`), country `PK` (locked) | Applicant on the PK opening with the salary fields on the applicant record | | | — | (none) | | careers mail |

Rows that are **not door instances** and are recorded, not run (matches `e2e/fixtures/form-instances.ts`'s `NON_DOOR_INSTANCES`): careers *portfolio* mode (no `portfolioRequired` opening is live as of the last check; the "apply by e-mail" mailto branch is T11's unit/e2e only — W3/W56); Join Our Team speculative application (WhatsApp + mailto only, no key — W3; click both, `email_click`/`whatsapp_click` with `page_cta`); Verify lookup (client-only, neutral W6 result; `verify_lookup` outcome `register_unavailable`); the newsletter band (hidden on every page, W5 — assert no `form[data-form-key="newsletter"]` exists on `/blog`, `/en/blog`, `/`); the newsletter confirm/unsubscribe pages (step 5 below). Total door instances: **17**, one per row above.

- [ ] **Step 3 (continued): Cross-checks after the seventeen rows**

  - Ops inbox, filter `isTest` off, `from` = the run's start: exactly 17 real rows (`status HANDLED`), plus whatever step 4 below adds; no `needsAttention`. CSV export (`website.forms:EXPORT`) → save `t14-inbox.csv` into `.superpowers/t14/` (git-ignored) — the durable artifact.
  - Sales → Inquiries filtered `source: WEBSITE_FORM`, created today: 13 (rows 1–13). Classifications: `DIRECT_EMPLOYER` × (rows sending `iAm: direct_employer`), `HR_AGENCY` × 1 (row 6), `SOURCING_PARTNER` × 2 (rows 7–8), none for callback/visit/calculator (rows 2, 5, 11, 12).
  - `window.dataLayer` totals across the 17 sessions: 17 `generate_lead`, 17 `conversion`, `form_key` distribution `hire` ×4, `callback` ×2, `calculator` ×1, `partner` ×2, `contact` ×2, `visit` ×1, `workers` ×1, `fraud` ×2, `careers` ×2.
  - Second human's mailbox: one `WEBSITE_FORM_RECEIVED` mail per row 1–15 (15; careers raises none).
  - `https://staging.jobsadmire.com/api/site-health` → `formBeacons` unchanged from Cycle 4 (no fallback panel was shown on a success path).
  - `ping.lastSubmissionAt` (via the write token) = the last row's time; `trippedForms: []`.

- [ ] **Step 3 (continued): The two manual-only edges this owner-gated window is also the only place to prove**

  - **403 captcha** (needs a real Turnstile secret + a genuinely missing token — the ONE case Cycle 6's test-class runs cannot reach: a test-class request with no token is `skipped`, not checked, so it can never answer 403; only a write-class request with the widget blocked can): DevTools → Network → Request blocking → block `challenges.cloudflare.com` → reload `/iletisim` → callback widget (no widget can load, no token) → submit → `[data-kind="captcha"]` panel with the WhatsApp button as the **secondary** face (`captcha` is not in `FallbackPanel`'s `WHATSAPP_PRIMARY` set) and the `sys.form.fallback.captcha` line (`sys.form.fallback.retry` was removed in the WP2a Task 2 fix round — never cite it); Ops writes **no row** (403 is before the row). Unblock, resubmit → thank-you.
  - **`ok` + `FAILED` + visitor `error`** (RC26): on the PK opening's URL (row 17), apply a second time with row 17's e-mail → careers-public answers 409 → the handler maps it to `alreadyReceived` (still `ok`, thank-you, no second applicant). For a **real** FAILED+error: apply on the TR opening with country `PK` — if T11's residency lock is a `<select>` restricted to the opening's own country the site refuses first (record "not reachable from the UI"); otherwise the door answers 200 + `status: FAILED` + `error` (the residency message) and the site shows the `failed` panel with that sentence and the WhatsApp button as secondary.

- [ ] **Step 3 (continued): I12 — newsletter confirm/unsubscribe (Website side, not a door instance, but the same owner-gated window)**

  - `/abone-onay?token=not-a-real-token-1234567890` — Network tab shows **no** call to Operations on load or on hover; click the confirm button → the server action forwards → 400 `NEWSLETTER_TOKEN_INVALID` → the page's error state with the `info@jobsadmire.com` fallback (never a silent no-op). Same on `/en/newsletter/unsubscribe?token=abc.def` (a bad HMAC → 400).
  - The RFC 8058 one-click route: `curl -s -o /dev/null -w '%{http_code}\n' -X POST -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" -H 'Content-Type: application/x-www-form-urlencoded' -d 'List-Unsubscribe=One-Click' 'https://staging.jobsadmire.com/api/newsletter/unsubscribe?token=abc.def'` → a non-2xx for a bad token (T13 defines the exact code; record it).
  - A real subscriber token cannot exist while `newsletter` is inactive (D14) — the `CONFIRMED`/`ALREADY_CONFIRMED`/`UNSUBSCRIBED` outcomes are recorded as "deferred to the D14 flip", not run here. **Never point a test-class token at a real subscriber token, and never run this against a real subscriber's actual link.**

- [ ] **Step 4: Verify** — every row of the instance table has all six evidence cells filled or an explicit "not reachable" with the reason (careers portfolio branch, the job topic, the RC26 residency-locked case); the cross-check numbers match; the two manual-only edges and I12 are recorded.

- [ ] **Step 5: Commit** — none for the run itself (the evidence lives in `.superpowers/t14/` and the ledger, Cycle 9); page fixes found by the run are committed on `wp2/foundation` under the owning page's scope (`fix(<page>): …`) before Cycle 9 closes. Once every row is ✓, revert `staging`'s environment variables back to Cycle 4's Phase A test-token config (or leave the real config live if the owner wants `staging` continuously door-real for future spot checks — a controller call, recorded in the ledger either way) and, if reverting, redeploy once more.

---

#### Cycle 8 — Operations docs: the wire-contract field table in PRD §5.12 (a separate repo, a coordinated production push)

**This is a production deploy the moment it is pushed** — Operations and the CRM share nothing at runtime with the website, but Operations and the CRM share one VPS, and a push to Operations `main` rebuilds its containers within minutes (workspace `CLAUDE.md`). The precedent for exactly this situation is Task 8 itself: it built its catalog v1.1 change on a side branch and held the push until the Inbox session's Release 1 was live, agreed beforehand with that session (`WORKSPACE-STATE.md`, 2026-09-28). **This task goes further (W171): the branch and commit below are prepared in the `jobsadmire-operations-catalog` worktree, and the commit is pushed only bundled with a peer session's next Operations push, announced first — never alone, never on this task's own schedule.** As of this reconciliation the Operations `main` history includes at least the WhatsApp flow-builder programme, an owner-ordered WhatsApp configuration reset, and "Programme 3 — AI inside flows" landing well after Task 8's catalog v1.1 commit — by the time this task actually executes, `main` will have moved further still; **fetch before doing anything, and grep for anchors at that moment rather than trusting any SHA or line number printed here.**

- [ ] **Step 1: Write the failing test**

Worktree: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog` — Task 8's dedicated worktree of the Operations repo (its branch `website/catalog-ext` is merged into `origin/main`; its tree was clean and its `node_modules` installed at this reconciliation). **Never** the shared checkout `jobsadmire-operations` (peer sessions push from it) and never its `main`. Check the worktree is free, then branch fresh off `origin/main`:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog && git fetch origin && git status --short && git merge-base --is-ancestor HEAD origin/main && echo "worktree free"
git switch -c website/t14-forms-docs origin/main
```
(Expected: no `status` output, then `worktree free`. If the tree is dirty or its HEAD carries commits `origin/main` lacks, another session is using it — stop and report instead of creating a second worktree. Its installed `node_modules` predate `origin/main`; the docs guard needs only jest + ts-jest, so if Step 2's jest fails to START on a module-resolution error, stop and report rather than running a full install — memory rule.)

Find the current last `it(...)` block in the docs guard (do not assume it is Task 8's three — later sessions may have appended more, e.g. the Inbox programme's own Task 16 event-table paragraph noted in `WORKSPACE-STATE.md`):
```bash
grep -n "^  it(" apps/backend/src/modules/website/website-docs-guard.spec.ts | tail -3
```
Append this new `it` immediately before the file's final `});` (the outer `describe`'s closing brace — find it with `tail -5` of the file):

```ts
  it('PRD §5.12 carries the per-form wire-contract field table (v1.1), the newsletter click-only rule and the fraud-evidence throttle note, and §12.2 records the T14 staging verification', () => {
    expect(prd).toContain('**Wire contract field table (v1.1');
    expect(prd).toContain("**Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).**");
    expect(prd).toContain('**Fraud-evidence throttle (website ruling W170, extends W110; no code now).**');
    expect(prd).toContain('| `hire` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 (≥ 8 digits)');
    expect(prd).toContain('| `newsletter` | NEWSLETTER | `email`* ≤254 · `name` ≤120 — **inactive (D14) → 404** |');
    expect(prd).toContain('Website forms verified end to end on staging (WP2 T14');
  });
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=1
```
Expected: the new `it` fails on the first `toContain` (`Wire contract field table`); every other `it` in the file (Task 8's three included) stays green.

- [ ] **Step 3: Implement**

`docs/PRD.md` — find the catalog v1.1 paragraph with `grep -n "Catalog v1.1"` (its heading reads `**Catalog v1.1 (2026-09-28, WP2a Task 8 / T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.**` and it ends with a four-row table whose last row is the `portfolioUrl` one). Insert a blank line after that table's last row (**before** whatever section heading currently follows — grep to confirm what that is at execution time, since the Inbox session's own Task 16 paragraph may already sit there) and:

```
**Wire contract field table (v1.1, verified end to end on staging 2026-09-<dd>, WP2 T14) — every field the website may send per key, in the catalog's order.** `*` = required; caps are characters of the normalised value; `enum` values must match exactly (lower-case keys, never a label); `iso2` is upper-cased then checked; `phone` needs ≥ 8 digits and is stored as typed; `email` is lowercased; `url` (`portfolioUrl` only) gets `https://` when the scheme is missing. Anything else inside `fields` is dropped silently, never an error. The website repo's `docs/INTEGRATIONS.md` I4 carries the same table plus the page → key instance map; `e2e/fixtures/form-instances.ts` there is the instance map as code, and `scripts/door-smoke.lib.ts` is the required sets as code.

| formKey | Handler | Fields (wire names) |
|---|---|---|
| `hire` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 (≥ 8 digits) · `country` iso2 · `iAm` enum `direct_employer`\|`hr_agency` · `sector` ≤120 · `roleNeeded` ≤200 · `headcount` ≤10 · `startWhen` ≤120 · `city` ≤120 (v1.1) · `message` ≤5000 |
| `contact` | INQUIRY | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `iAm` enum `direct_employer`\|`hr_agency`\|`sourcing_partner`\|`job_seeker` · `subject` ≤200 · `topic` enum `hire`\|`partner`\|`permit`\|`job`\|`other` (v1.1) · `city` ≤120 (v1.1) · `message`* ≤5000 |
| `partner` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 · `candidatesPerYear` ≤20 · `trades` ≤500 · `licence` ≤200 · `track` enum `sourcing`\|`institute` (v1.1) · `city` ≤120 (v1.1) · `message` ≤5000 |
| `workers` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country` iso2 · `iAm` enum `direct_employer`\|`hr_agency` · `trade` ≤200 · `headcount` ≤10 · `startWhen` ≤120 · `city` ≤120 (v1.1) · `message` ≤5000 |
| `callback` | CALLBACK | `name`* ≤120 · `phone`* ≤40 · `email` ≤254 · `preferredTime` ≤120 · `topic` ≤200 (free text — unrelated to `contact.topic`) · `city` ≤120 (v1.1) |
| `visit` | VISIT | `name`* ≤120 · `company` ≤200 · `email`* ≤254 · `phone`* ≤40 · `office` ≤120 · `preferredDate` ≤40 · `preferredTime` ≤40 · `message` ≤5000 |
| `calculator` | CALCULATOR_QUOTE | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `headcount` ≤10 · `trade` ≤200 · `durationMonths` ≤10 · `estimateSummary` ≤2000 · `message` ≤5000 |
| `careers` | CAREERS_APPLY | `openingSlug`* ≤200 `/^[a-z0-9-]+$/` · `cvKey`* ≤300 `/^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i` (from `POST /api/careers/upload-cv`) · `name`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 · `city` ≤100 · `language` ≤300 · `expectedSalary` ≤20 · `expectedSalaryCurrency` ≤3 · `currentSalary` ≤20 · `currentSalaryCurrency` ≤3 · `coverLetter` ≤5000 · `linkedinUrl` ≤500 · `portfolioUrl` url ≤500 (v1.1) — salaries/currencies outside `PublicApplyDto`'s rules are DROPPED, not rejected |
| `fraud` | FRAUD_REPORT | `reporterName` ≤120 · `reporterEmail` email ≤254 · `reporterPhone` phone ≤40 · `description`* ≤5000, min 20 · `suspectName` ≤200 · `suspectContact` ≤300 · `evidenceKeys` list ≤3 of `/^website-fraud\/[A-Za-z0-9._-]+$/` ≤300 each (from `POST /api/website/v1/uploads/fraud-evidence`, one file per call) |
| `newsletter` | NEWSLETTER | `email`* ≤254 · `name` ≤120 — **inactive (D14) → 404** |
```

Then the two §5.12 lines no task has written yet (W171 folds them into this commit):

- **The fraud-evidence throttle note (W170, extends W110).** Find the W110 paragraph with `grep -n 'is ever switched on (website ruling W110' docs/PRD.md` (it begins "CV upload for the careers form reuses the EXISTING public `POST /api/careers/upload-cv`" and ends "…so both sides change together."); append to that same paragraph, after its last sentence:

```
 **Fraud-evidence throttle (website ruling W170, extends W110; no code now).** `POST /api/website/v1/uploads/fraud-evidence` carries no Turnstile of its own — the website's per-file upload action (`uploadEvidence`, WP2b T10) posts each file as the visitor picks it, before the report and its Turnstile token reach the door — so what bounds the route today is the 8 MB cap (the website sends ≤ 3 MiB per file), the magic-byte sniff and the 7-day orphan sweep of unreferenced `website-fraud/` objects (`WEBSITE_FRAUD_ORPHAN_AGE_MS`). The same follow-up adds a per-visitor throttle on that route, keyed on `X-Website-Visitor-Ip` whenever the caller holds the website write token (the website already sends that header on every upload call — `uploadFraudEvidence` with the kernel's exported `visitorOf`, W170), so one visitor's uploads can never exhaust the bucket that every other visitor behind the same Vercel egress IP shares.
```

- **The newsletter click-only rule (I12).** `grep -n "forwarded only on the visitor's click" docs/PRD.md`: at `origin/main` 78c3c8c (2026-09-30) §5.12's gotchas already carry it (Task 8 recorded it, W46). If it is there, leave it verbatim — the guard above pins it. If a later push removed it, insert this bullet directly after the gotcha that begins "**The test token never reaches a side effect (P2) — EXCEPT the newsletter routes.**":

```
- **Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).** The website's `/abone-onay` / `/abonelikten-cik` pages (`/en/newsletter/confirm`, `/en/newsletter/unsubscribe`) never call `GET /api/website/v1/newsletter/confirm` or `…/unsubscribe` on page load, prefetch or render — a mail-link scanner or a browser prefetch would otherwise confirm (or unsubscribe) on the subscriber's behalf, recording a double opt-in the human never clicked; the token is forwarded by a route handler when the visitor clicks, and the RFC 8058 one-click POST is forwarded as a POST. Recorded here so a future Ops change never assumes the GET runs at link-open time (website `docs/INTEGRATIONS.md` I12 carries the same rule).
```

Then find the LAST dated entry under §12.2 at execution time (`grep -n "^- \*\*20" docs/PRD.md | tail -1` — do not assume it is Task 8's "Website catalog v1.1" line; other sessions add entries here too) and append immediately after it, before whatever the next `###` heading is:

```
- **2026-09-<dd> — Website forms verified end to end on staging (WP2 T14).** All 17 form instances of the designed pages submitted through `staging.jobsadmire.com`: the automated half (Cycles 5–6, `e2e/door-test-mode.spec.ts`) with a TEST-class credential proved the wire shape, the redirect and the `generate_lead`+`conversion` pair for 14 of the 17 (the evidence and careers rows store real files and ran only in the manual half — website ruling W171), plus the replay/404/unavailable/honeypot mappings, with no real lead filed and no write to the Operations Redis (the 429 mapping is unit-proven; a live 429 proof is an Operations follow-up, a test-class-only trip switch); the manual half (Cycle 7) ran all 17 with a real Turnstile token and the real write token: 13 inquiries (classification per `iAm`/`partner`), 2 applicants (TR opening; PK opening with `expectedSalary`), 2 fraud rows (one with three evidence objects), every row `HANDLED` / `captchaPassed: true`, one `WEBSITE_FORM_RECEIVED` bell + second-human mail per non-careers row, one autoresponder per row in the visitor's locale. The per-form wire-contract field table above is the record; `docs/INTEGRATIONS.md` I4 in the website repo mirrors it, and `e2e/fixtures/form-instances.ts` there is the instance map as committed, tested data. The same commit added the fraud-evidence throttle note to the W110 follow-up (website ruling W170).
```

- [ ] **Step 4: Run the docs guard + the website module's docs-adjacent specs**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts src/modules/website/website-form-catalog.spec.ts --maxWorkers=1 && npm run type-check
```
Expected: all green (the new `it` included, Task 8's three unaffected); `apps/backend`'s own `type-check` (`tsc --noEmit`) unchanged — run it inside `apps/backend`; the root `type-check` is a turbo run over every workspace, too heavy for the memory rule (no code touched, docs and one test file only).

- [ ] **Step 5: Commit — prepared here, pushed only bundled with a peer session's next Operations push (W171)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog && git add docs/PRD.md apps/backend/src/modules/website/website-docs-guard.spec.ts
git commit -m "docs(website): PRD §5.12 wire-contract field table v1.1 + T14 staging verification record

The per-form field table every website form is written against (required
sets, caps, enums, the v1.1 additions), pinned by the docs guard; §12.2
records the end-to-end run on staging — the automated test-class half and
the manual real-Turnstile half. The W110 follow-up gains the fraud-evidence
throttle note (website ruling W170); the newsletter click-only gotcha is
pinned. Docs only — no code, no migration.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

**Never push this branch on its own (W171).** The commit rides only with a peer session's next Operations push: (a) **announce first** — tell the peer sessions working in Operations (and add a dated line to `WORKSPACE-STATE.md`) that `website/t14-forms-docs` — one docs-only commit: PRD §5.12 + §12.2 + one docs-guard `it`, no code, no migration — asks to ride with their next push, and wait for the session that owns that push to agree (check `git log --oneline -20 origin/main` for anything mid-flight first, per the workspace's cross-app rule and the Task 8 precedent); (b) **at that push** — the owning session (or the controller, on that session's word) re-runs Task 8's pre-checks (no Operations deploy in progress, no WhatsApp campaign `RUNNING`) and cherry-picks this commit onto the branch it is about to push, so both go out in ONE push and ONE deploy (every worktree shares the repo's refs, so the branch is visible from theirs):
```bash
# in the peer session's own checkout, on the branch it is about to push — never from jobsadmire-operations-catalog
git cherry-pick website/t14-forms-docs
```
If no peer push is scheduled when the rest of this task is done, the branch waits — the website side (Cycle 9) does not depend on it, and the ledger records "prepared, awaiting a peer push". After the bundled push deploys: verify by artifact (`tail -3 /var/www/html/jobsadmire-operations/deploy.log` through the workspace SSH relay, `.claude-ssh-relay.sh` → `.ssh-cmd`/`.ssh-result`, never a direct `ssh` from an agent shell → `Deploy finished for <sha>`), confirm the door survived the redeploy (`GET /api/website/v1/ping` with the test token → 200, `WEBSITE_MODULE_ENABLED` persists — it is `.env`-driven), confirm the commit landed (`git fetch origin && git cherry origin/main website/t14-forms-docs` prints a `-` line), then free the worktree (in `jobsadmire-operations-catalog`: `git switch --detach origin/main && git branch -D website/t14-forms-docs`).

---

#### Cycle 9 — Website docs: I4 (field table + instance map + verification record), I5, I12, DEPLOYMENT, PRD, Token threat model, ledger

- [ ] **Step 1 / Step 2:** none (docs); `npx prettier --check docs` is the mechanical check.

- [ ] **Step 3: Implement**

`docs/INTEGRATIONS.md` — I4: the current paragraph (verified verbatim on 2026-09-29, `WEB/docs/INTEGRATIONS.md`) ends `` …the visitor fallback panel on every non-success. `` — find it with `grep -n "visitor fallback panel on every non-success"`; append after it (before `## I5`):

```markdown

**Field table per key (catalog v1.1 — the contract of record; mirrored in Ops `docs/PRD.md` §5.12 "Wire contract field table", pinned there by `website-docs-guard.spec.ts` and here by `scripts/form-instances.test.ts` + `scripts/door-smoke.test.ts`'s required sets).** `*` = required; caps are characters of the normalised value; enum values are lower-case keys (never a label — W3); `iso2` upper-case (W40); phones ≥ 8 digits, stored as typed (the page composes `+<dial><number>`); e-mails lowercased by the door; `url` (`portfolioUrl` only) gets `https://` when missing. A wire name not in the row is DROPPED silently — every page's `toFields` is typed against this table, and the T14 inbox check reads `payloadJson.fields` back against it.

| Key | Handler | Fields (wire names) |
| --- | --- | --- |
| `hire` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country` iso2 · `iAm` `direct_employer`\|`hr_agency` · `sector` ≤120 (the `sectors` collection key) · `roleNeeded` ≤200 · `headcount` ≤10 · `startWhen` ≤120 (`START_WHEN_KEYS`) · `city` ≤120 (v1.1) · `message` ≤5000 |
| `contact` | INQUIRY | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `iAm` `direct_employer`\|`hr_agency`\|`sourcing_partner`\|`job_seeker` · `subject` ≤200 · `topic` `hire`\|`partner`\|`permit`\|`job`\|`other` (v1.1) · `city` ≤120 (v1.1) · `message`* ≤5000 |
| `partner` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 · `candidatesPerYear` ≤20 · `trades` ≤500 · `licence` ≤200 · `track` `sourcing`\|`institute` (v1.1) · `city` ≤120 (v1.1) · `message` ≤5000 |
| `workers` | INQUIRY | `name`* ≤120 · `company`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country` iso2 · `iAm` `direct_employer`\|`hr_agency` · `trade` ≤200 · `headcount` ≤10 · `startWhen` ≤120 · `city` ≤120 (v1.1) · `message` ≤5000 |
| `callback` | CALLBACK | `name`* ≤120 · `phone`* ≤40 · `email` ≤254 · `preferredTime` ≤120 · `topic` ≤200 (free text) · `city` ≤120 (v1.1) |
| `visit` | VISIT | `name`* ≤120 · `company` ≤200 · `email`* ≤254 · `phone`* ≤40 · `office` ≤120 (`antalya`) · `preferredDate` ≤40 · `preferredTime` ≤40 · `message` ≤5000 |
| `calculator` | CALCULATOR_QUOTE | `name`* ≤120 · `email`* ≤254 · `phone` ≤40 · `company` ≤200 · `country` iso2 · `headcount` ≤10 · `trade` ≤200 · `durationMonths` ≤10 · `estimateSummary` ≤2000 (serialised by the page's `toFields`, `formatTRY` figures) · `message` ≤5000 |
| `careers` | CAREERS_APPLY | `openingSlug`* ≤200 · `cvKey`* ≤300 `careers-cv/….pdf` (from `POST /api/careers/upload-cv`, filename must end in `.pdf`) · `name`* ≤200 · `email`* ≤254 · `phone`* ≤40 · `country`* iso2 (= the opening's country — residency) · `city` ≤100 · `language` ≤300 · `expectedSalary` ≤20 · `expectedSalaryCurrency` ≤3 · `currentSalary` ≤20 · `currentSalaryCurrency` ≤3 · `coverLetter` ≤5000 · `linkedinUrl` ≤500 · `portfolioUrl` url ≤500 (v1.1; does not satisfy `portfolioRequired` — W56) |
| `fraud` | FRAUD_REPORT | `reporterName` ≤120 · `reporterEmail` ≤254 · `reporterPhone` ≤40 · `description`* ≤5000 min 20 · `suspectName` ≤200 · `suspectContact` ≤300 · `evidenceKeys` ≤3 × `website-fraud/…` (one upload call per file, ≤ 3 MiB on this site — W73/W116; the door itself allows ≤ 8 MB, content-sniffed JPEG/PNG/WEBP/PDF) |
| `newsletter` | NEWSLETTER | `email`* ≤254 · `name` ≤120 — **inactive (D14) → 404 `off`**; the band is hidden on every page (W5) |

**Instance map (17 door instances across 13 pages — as committed and tested in `e2e/fixtures/form-instances.ts`, T14):** Homepage hero → `hire` (proposal mode) and `callback` ("call me back" mode); Hire Workers quick-quote (`hire-form-quick`, `consent: 'checkbox'`) and request form (`hire-form-full`) → `hire`; Cost Calculator written quote (`#calculator` card) → `calculator`; Partner With Us HR-agency track → `hire` + `iAm: 'hr_agency'` + fixed `country: 'TR'`, sourcing / institute tracks → `partner` + `track` (sourcing requires `licence`, no `city`/`message`; institute allows `city`, no `licence`/`message`); Contact enquiry → `contact` + `topic` + `iAm` (topic `job` renders no form), callback widget → `callback` (no `city`/`topic` on this instance), book-a-visit → `visit` (`office: 'antalya'`); Available Workers request, inside `#pool-form` (the hero card — `#pool` itself is the empty state) → `workers` + fixed `country: 'TR'`, required `city`/`trade`; Verify fraud report → `fraud` (`reporterName`/`reporterEmail` required on this site, stricter than the door; 0–3 evidence uploads first, ≤ 3 MiB each); Careers detail apply → `careers` (CV upload first, ≤ 3 MiB; the opening's own country locks the `country` field — residency; PK openings additionally require `expectedSalary`; portfolio-required openings show the "apply by e-mail" branch instead — W3/W56). Not door instances: Join Our Team speculative application (WhatsApp + mailto, W3), the Verify lookup (client-only, W6), the newsletter band (hidden, W5).

**Verification record (T14, staging, 2026-09-<dd>):** two halves. Automated (Cycles 5–6, `e2e/door-test-mode.spec.ts`, TEST-class credential, no Turnstile): 14 of the 17 instances (rows 15–17 — the evidence upload and the two careers applications with a real CV PDF — store real files and run only in the manual half, W171) → the redirect to `/tesekkurler?form=<key>`/`/en/thank-you?form=<key>` → exactly one `generate_lead` and one `conversion` each (read from `window.dataLayer` directly — W146: GTM is dark on every Preview face, staging included, so this is not visible in GA4); the replay (`replayed: true`, R37 keeps `generate_lead` at one on a same-session repeat), 404 (`preview/t14-off` — the `off` panel, WhatsApp primary, a bare `wa.me` href), unavailable (`preview/t14-blackhole`, the panel inside the W74/W117 9 s budget), and honeypot (`SPAM` row, thank-you, `generate_lead` still fires) all confirmed with no real lead filed and no write to the Operations Redis; the 429/`tripped` mapping is proven by the unit suites (`src/forms/__tests__/post.test.ts`, `src/forms/__tests__/FallbackPanel.test.tsx`, `scripts/door-smoke.test.ts`) — a live trip would mean writing the production Operations Redis, which no WP2b step does (W171); a live 429 proof is an Operations follow-up (a test-class-only trip switch). Manual (Cycle 7, real Turnstile + the real write token): all 17 instances (rows 15–17 for the first time) → real Turnstile (`captchaPassed: true`, `captchaDegraded: false`) → `HANDLED` row; 13 inquiries (`source: WEBSITE_FORM`, `contactName`, `[website:<key>[:<track>]]` preview tag, `[topic]` subject prefix, `city:` line), 2 applicants (TR; PK with `expectedSalary`), 2 fraud rows (one with three evidence objects read back through the inbox's `/evidence/:index/view`), 15 `WEBSITE_FORM_RECEIVED` bells + second-human mails (careers raises none — RC25), 17 autoresponders; plus the two manual-only edges (403 captcha via a blocked Turnstile script; RC26's `FAILED`+visitor `error`) and the I12 newsletter routes check. Evidence: the ledger in this task's own **Ledger line** (below) and `.superpowers/t14/` (git-ignored). The headless probe used across both halves is `npm run door:smoke` (`docs/OPERATING.md` § Synthetic lead).
```

I5 — the current paragraph (verified verbatim, 2026-09-29) ends `` `CareersPublicModule` exports `apply` (done in WP3a). ``; find it with `grep -n "CareersPublicModule.*exports.*apply"` and append (same paragraph, one more sentence — T11, earlier in W99, inserts its "**As built (WP2b T11):**" text BEFORE this sentence and keeps it last and verbatim, so the anchor holds; check with a fresh grep before editing):

```
 **Verified on staging (T14):** a real application on the TR opening (`careers-cv/<uuid>.pdf` from the public upload, `country: 'TR'`) and one on the PK opening with `expectedSalary` + `expectedSalaryCurrency: 'PKR'` each created an applicant (`createdEntityType: 'applicant'`), sent the careers-mailbox confirmation to the applicant and `APPLICANT_RECEIVED` to the hiring owner, and raised no `WEBSITE_FORM_RECEIVED` (RC25). A repeat application by the same e-mail on the same opening comes back `ok` + `alreadyReceived` (thank-you, no second applicant). The portfolio-required branch ("apply by e-mail", W3/W56) had no live opening to run against and is covered by T11's tests only.
```

I12 — find the CURRENT last sentence at execution time (T13, earlier in W99, appends its "**Website side as built (T13):**" paragraph after the base sentence ending "never point a test-class smoke at a real subscriber token.", so the last sentence of I12 is T13's, ending "…door-less it ends in `unavailable`/503, on `staging` the door refuses it (`invalid`/400)." — find it with `grep -n 'the door refuses it' docs/INTEGRATIONS.md` and anchor there) and append:

```
 **Verified on staging (T14):** `/abone-onay` and `/en/newsletter/unsubscribe` make no call to Operations on load, prefetch or hover (Network tab); the click forwards and a bad token renders the error state with the `info@jobsadmire.com` fallback (400 `NEWSLETTER_TOKEN_INVALID`); the RFC 8058 route handler answers a non-2xx for a bad token. The `CONFIRMED`/`ALREADY_CONFIRMED`/`UNSUBSCRIBED` outcomes cannot be exercised while `newsletter` is inactive (D14) — re-run this paragraph's check on the day the owner flips `WebsiteForm.isActive` (Ops PRD §5.12 gotcha).
```

§ Token threat model — the current text (verified verbatim, 2026-09-29) reads: `` Tokens exist in three classes — read, write, preview (signed, 30-min TTL) — each with a current and previous value live simultaneously… `` — this sentence is stale against the real code (verified directly in `jobsadmire-operations/apps/backend/src/modules/website/*`: `req.websiteTokenClass` is stamped from exactly `write | test | previous-write`; there is no `read` or `preview` class in the website module). Modify it to:

```
Tokens exist in three classes — **write, test, previous-write** (the write token's prior value, valid 24 h after a rotation) — each held server-side; the write token is what a real visitor's submission uses, the test token (`isTest: true`) runs every handler as a `dryRun` and is what `npm run door:smoke` and `e2e/door-test-mode.spec.ts` carry (T14).
```

`docs/DEPLOYMENT.md`:

- § Vercel project — ALREADY CORRECTED by the controller's W173 docs commit (2026-10-01): the section records the one project `jobsadmirewebsite` (`prj_Ze3FSd1XbvNbIe2OF2UQjRZ2ZAD6`, team "Tech Admire Apps"), the frozen production deployment `dpl_hRVuY1faCQe8fQ44sqmw4t82Rs7A`, the Production Branch `main` behind the two guards, previews behind Vercel Authentication, the `staging` branch as the only door-ful preview (W92) and the Hobby/Pro note. T14 adds NOTHING to that section and does not re-insert any "As connected" paragraph; verify with `grep -n 'jobsadmire-web-v2' docs/DEPLOYMENT.md` that the only remaining mention says the second project was never created, and STOP and report if the section does not read as described.

- New section, inserted immediately after § Deployment Protection — anchor: the paragraph that begins `Vercel Authentication is on for every preview deployment of `jobsadmirewebsite`` (the W173 wording; `grep -n '^## Deployment Protection' docs/DEPLOYMENT.md`, then insert after the end of that section's last paragraph and before the next `## ` heading, `## Retired secrets log`). The existing section is correct since W173 and is not rewritten:

```markdown
## Staging alias and Deployment Protection (T14)

`staging.jobsadmire.com` is the project's custom preview domain, assigned to a dedicated git branch `staging` (Settings → Domains; DNS `staging CNAME cname.vercel-dns.com`) — never `wp2/foundation` directly, so the controller decides exactly when a door test redeploys it (`git branch -f staging origin/wp2/foundation && git push origin staging`, T14 Cycle 4). It is the ONLY host the website's Turnstile widget lists besides production, so a real-captcha form run happens there, never on a `*.vercel.app` URL. Vercel Authentication stays on for previews; humans sign in, automation sends `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET` (Settings → Deployment Protection → Protection Bypass for Automation; the value lives in the controller's shell and the external monitor, never in this repo). `staging` runs in TWO env configurations at different times, never both at once: Phase A (`OPS_WEBSITE_WRITE_TOKEN` holds the TEST-class token, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset) for the automated, no-owner-needed proof; Phase B (the real write token + the real Turnstile site key) for the owner-gated real run — switching between them is a Vercel env-var edit plus one redeploy each way (T14 Cycles 4/5/7). Failure-path rehearsals that never touch a real door credential use throwaway branches with two branch-scoped Preview variables — `OPS_API_URL` (an unknown route → `off`, once a `curl` pre-check shows it answers 404; `https://door.invalid` → `unavailable`) and a dummy ≥ 20-character `OPS_WEBSITE_WRITE_TOKEN` (without one, `doorConfig()` answers `unauthorized` with no network call); delete the branches and the overrides afterwards.
```

- § Environment variables: the `OPS_WEBSITE_TEST_TOKEN` row currently ends `` Not consumed by any code yet `` — Modify to end `` Consumed by \`npm run door:smoke\` and \`e2e/door-test-mode.spec.ts\` (T14, from the developer's shell and CI respectively) and by the T15 synthetic-lead cron. `` The `NEXT_PUBLIC_TURNSTILE_SITE_KEY` row — append: `` . Set on \`staging\` only when Cycle 4 item 4 is ready (the widget listing \`staging.jobsadmire.com\`); UNSET during the Phase A test-class window (T14) so no widget renders and a test-class request carries no token. ``

`docs/PRD.md` — the paragraph beginning "**The forms kernel shipped in WP2a**" (verified verbatim, 2026-09-29) ends `` …firing the \`conversion\` analytics event once per session per form+path (\`docs/ANALYTICS.md\`). `` — find it with `grep -n "conversion.*analytics event once per session"` and append one sentence:

```
 **Verified end to end on staging in T14 (2026-09-<dd>):** all 17 form instances through the real door — 14 automated with the test token (no real lead; the evidence and careers rows store real files and run manually only, W171), all 17 manually with a real Turnstile token (real leads, cleaned up by the owner); one `generate_lead` + one `conversion` each; the per-form field table is `docs/INTEGRATIONS.md` I4.
```

`docs/superpowers/plans/2026-09-20-wp2b-pages.md` — nothing in this cycle. The T14 row goes into the `## Ledger` table (T1 creates it, W98; every earlier task has appended its row in T1's six columns) in Cycle 10 Step 5, once the proof session has filled its gate cell. `## Task index` holds the controller's assembly placeholder (`<!-- ASSEMBLY: filled after the reconcile rechecks -->`) and is never edited by a task.

- [ ] **Step 4: Verify**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/INTEGRATIONS.md docs/DEPLOYMENT.md docs/PRD.md
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1
```
Expected: green — the FULL low-memory verify line before the commit even for a docs-only cycle (W178; prettier reflows the tables; never `npm run verify`).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && git add docs/INTEGRATIONS.md docs/DEPLOYMENT.md docs/PRD.md
git commit -m "docs(forms): I4 field table v1.1 + instance map + staging verification record, I5/I12 verified, staging alias + project reality, Token threat model's real three classes

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Cycle 10 — The W126 proof (build, start, gate against the LOCAL build)

**W126 binds one capped build per TASK, not per cycle** — this is that one build. It proves the code this task actually wrote (`ConversionPing`, `door-smoke.lib.ts`/`door-smoke.ts`, the fixture, `e2e/door-test-mode.spec.ts`) compiles, lints and passes the local gate; it is **not** a re-run of Cycles 5–7's staging work, which already happened against the real door and is recorded in its own ledger entries. `npm run gate` here targets `http://localhost:3000` — door-less, so `e2e/door-test-mode.spec.ts`'s 21 tests all skip in both Playwright projects — 42 skipped (`E2E_DOOR_TEST_MODE` unset; the mobile half also skips by the file's desktop-only guard), exactly as Cycle 5 Step 4's first invocation already proved; that is the correct, green outcome for a local run, not a gap.

- [ ] **Step 1 / Step 2:** none — this cycle has no new failing test; it is the proof session every WP2b task ends with.

- [ ] **Step 3: Implement** — nothing to implement; the commands below ARE the cycle.

- [ ] **Step 4: The proof session (run in order, one at a time — memory rule: one heavy job at a time)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2

# 1. ONE capped build.
NEXT_BUILD_CPUS=2 NODE_OPTIONS=--max-old-space-size=4096 npm run build

# 2. ONE start, backgrounded, with its PID recorded so it can be killed afterwards.
npm run start &
SERVER_PID=$!
curl -sf --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:3000/   # wait for the server without `sleep` (blocked in the agent's shell)

# 3. ONE gate run against the local build (door-less: e2e/door-test-mode.spec.ts's 21 tests × 2 projects = 42 skipped).
E2E_BASE_URL=http://localhost:3000 npm run gate

# 4. js-size — this task adds no route, so every existing route's figure is UNCHANGED from the
#    last task's ledger entry; record that explicitly rather than re-pasting the same numbers.
npm run js-size

# 5. No pixel run — this task is not one of the four D27 pixel pages (T1, T2, T3, T12).

# 6. Kill the server; confirm nothing stray is left.
kill "$SERVER_PID" 2>/dev/null
pgrep -fl "next start" || echo "no stray next start process"
pgrep -fl "next-server" || echo "no stray next-server process"
```

Expected outcomes: the build succeeds with no new route in the table (this task ships no page); `npm run gate` — Playwright green on every existing route (unchanged from the last task's binding figures), `e2e/door-test-mode.spec.ts` 42 skipped (21 tests × the two projects; not failed — the skip message names `E2E_DOOR_TEST_MODE`), `e2e/thank-you.spec.ts`'s modified first test green (`generate_lead` beside `conversion`, both counted once, R37 holding on reload), the two token-dependent `ops.spec.ts` cases skip without `REVALIDATE_SECRET` (as at every prior task); `lhci assert` passes on every indexable gate route exactly as it did after the last task (no route's script size changed — this task touches no page-serving code, only `src/analytics/ConversionPing.tsx`, which only the thank-you route imports (`src/app/[locale]/(minimal)/thank-you/page.tsx`) — every other route's figure must be byte-identical, and `/tesekkurler` / `/en/thank-you` may move by a few bytes (one more `track()` call, within gzip's block granularity; Task 7 recorded 179,927 B on `/tesekkurler?form=hire`); a delta on ANY other route is a red flag — stop and account for it before declaring this cycle done).

- [ ] **Step 4 (continued): The staging run itself — a controller step, never run by the implementer without the controller's go**

Everything against the real door (Cycles 4–8) is **owner/controller-gated infrastructure work, not something the implementer runs unattended.** The exact commands are already written out in full in Cycles 4–8 above; this cycle does not repeat them, it only names the sequence and the go/no-go: (1) Cycle 4 items 1–3 (staging exists, Phase A env is live) — controller, no owner needed; (2) Cycle 5 — controller runs the automated happy path; (3) Cycle 6 — controller runs the automated failure paths (no Redis write, no VPS write — W171); (4) Cycle 4 item 4 (Turnstile) — **owner-gated, blocks Cycle 7 only**; (5) Cycle 7 — controller + owner run the manual walkthrough once item 4 lands; (6) Cycle 8 — controller prepares the Operations docs commit in `jobsadmire-operations-catalog`; it rides only with a peer session's next Operations push, announced first; (7) Cycle 9 — website docs, ordinary commit. The implementer's job ends at Cycle 3b (or, if also acting as controller under the owner's direction, continues through 4–9) — and no session ever pushes `website/t14-forms-docs` alone, or before the announcement (W171).

- [ ] **Step 5: Commit** — the ledger row only. If `js-size` or the gate surfaces a regression, fix it first as a normal commit under this task's own scope and re-run Steps 4 from the top. Then append the T14 row to the `## Ledger` table in `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (T1 creates it, W98 — T1's six columns; every earlier task has appended its own row; never touch `## Task index`, the controller's assembly placeholder) — the **Ledger line** template at the end of this task, every `<…>` filled from Cycles 2 and 5–7 (the staging records) and this session's Step 4 — and commit it alone:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-website-wp2 && npx prettier --write docs/superpowers/plans/2026-09-20-wp2b-pages.md && npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1 && git add docs/superpowers/plans/2026-09-20-wp2b-pages.md
git commit -m "docs(ledger): T14 forms end-to-end row (W98)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

**Docs in this task:** `docs/ANALYTICS.md` (the "declared but still uncalled" clause restated ONCE from its post-T12 text — `generate_lead` wired since T14, "`language_switch` is declared but still uncalled; the five W26 page events are wired by their pages (T4, T5, T7, T10, T11)" — W168; the four per-page "`generate_lead` has no caller yet" parentheses → "fires beside it — T14"; the two accepted reconciliation skews); `docs/ARCHITECTURE.md` (§ Forms flow (D11): the fallback prefill parenthetical names `suspectName`/`suspectContact`/`licence` — W167, Cycle 3b); `docs/INTEGRATIONS.md` (I4 field table v1.1 + the 17-instance map + the verification record; I5 and I12 "verified on staging" paragraphs; § Token threat model's class list corrected to the real three); `docs/DEPLOYMENT.md` (the `jobsadmirewebsite` project reality note; new § Staging alias and Deployment Protection; `OPS_WEBSITE_TEST_TOKEN` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` rows updated); `docs/OPERATING.md` (§ Synthetic lead: `npm run door:smoke` is the probe that exists now, the cron is still T15); `docs/PRD.md` (the forms-kernel paragraph: verified end to end); `.env.example` (`OPS_WEBSITE_TEST_TOKEN`'s comment: consumed now, not "until T15"); `docs/superpowers/plans/2026-09-20-wp2b-pages.md` (the T14 row of T1's `## Ledger` table, W98 — Cycle 10 Step 5); Operations `docs/PRD.md` §5.12 "Wire contract field table (v1.1)", the fraud-evidence throttle note on the W110 follow-up (W170) and the newsletter click-only gotcha (confirmed present, else inserted) + the §12.2 entry, pinned by `website-docs-guard.spec.ts` (one docs-only Ops commit on `website/t14-forms-docs` in the `jobsadmire-operations-catalog` worktree, pushed only bundled with a peer session's next Operations push, announced first — never alone, W171).

**Sys keys added:** none. Cycle 3b's three prefill labels (`sys.form.labels.suspectName`, `sys.form.labels.suspectContact`, `sys.form.labels.licence`) already exist in both locales. This task ships no page and reads no `sys.*` namespace that is not already covered by `CLIENT_SYS` (`form` is already listed — `FallbackPanel`/`Field`/`FormShell` read it, unchanged by this task) — the fallback panels and the thank-you page read the existing `sys.form.fallback.*` / `sys.thankYou.*` keys.

**Package ids used:** 0 (no page rendered by this task).

**CLIENT_SYS additions:** none.

**Foundation gaps:**
1. **`generate_lead` had no caller anywhere** — not WP1 (`ConversionPing` fired only `conversion`), not the WP2a kernel (a server action has no `dataLayer`; `redirect()` unmounts `FormShell`), and the WP2b page contract forbids pages from firing it — closed in Cycle 1 by editing WP1's `src/analytics/ConversionPing.tsx` (a WP1 file; no WP2a Produces changes).
2. **A live 429 cannot be produced without writing production Operations data** — verified directly in the code: test-class submissions never reach `recordVerified` (`else if (!isTest)` in `website-forms.service.ts`), so the brief's "26 test-class posts trip the form" is impossible, and the only other way to a 429 is a trip marker (`website:abuse:tripped:<form>`) in the PRODUCTION Operations Redis, which W171 forbids (W100's Redis clause withdrawn). The `tripped`/429 mapping is therefore proven by `src/forms/__tests__/post.test.ts`, `src/forms/__tests__/FallbackPanel.test.tsx` and `scripts/door-smoke.test.ts`; a live 429 proof is its own **Operations follow-up: a test-class-only trip switch** (W171). The optional local fixture-door rehearsal of the browser panel (T11's `e2e/mocks` pattern) is described in Cycle 6 and not scheduled here — it needs a second `npm run start` (W126).
3. **No `staging.jobsadmire.com` alias, no automation bypass secret and no Preview door variables exist yet, and the owner has not yet supplied the Turnstile site key + secret** — the FIRST is entirely within this task's own Cycle 4 to build; the SECOND is the one hard, owner-side prerequisite, and it blocks ONLY Cycle 7 (the real-lead manual run) — Cycles 1–6 need no Turnstile at all and can run as soon as Cycle 4 items 1–3 land. Also owner-side and recorded, not code: which Vercel Production Branch guard value the owner sets (Cycle 4 item 1).
4. **The door is not dark** — an earlier draft of this task recorded `GET /api/website/v1/ping → 404` as of 2026-09-20; verified directly in the code and the Ops WP3a gate record, the module has been flipped on since 2026-09-24 (Operations `main` ≥ `47a2160`) and `ping` now fails closed at `401` without a token. This task only verifies that state (Cycle 4 item 5); it performs no flip.
5. **The `off` result kind cannot distinguish "module dark", "unknown key" and "inactive newsletter" (all 404)** — the site's panel copy is one (`sys.form.fallback.off.*`); accepted for Phase A since the newsletter form is hidden (W5) — `B/reconcile-rulings.md`'s "Accepted as page-local" list already names this, no change needed here.
6. **`docs/INTEGRATIONS.md` § Token threat model's class list ("read, write, preview") is stale against the real code** (the Operations website module has exactly `write | test | previous-write`) — this task corrects that one sentence in Cycle 9 as a small, honest side-fix; a fuller rewrite of that section (rotation runbook wording, the negative-test list) is out of this task's scope.
7. **The careers rows (16–17) were first built from the `task-11.md` DRAFT; the recheck (2026-10-01) re-diffed them against the final `B/fixed/task-11.md`:** `form[data-form-key="careers"][data-testid="careers-apply-form"]` inside `#apply` (`careers-detail-apply`); the CV on `input[name="cv"]`, posted in the apply action itself and uploaded by `applyToFields` (`cvKey` is never a DOM field); `name`/`email`/`phone`/`city`/`language`/`coverLetter`/`expectedSalary`/`linkedinUrl`/`portfolioUrl` as named; the `country` select offers only the opening's own country (so Cycle 7's "apply with another country" RC26 case is "not reachable from the UI", as T11 states); the portfolio branch is `careers-email-apply` — all consistent with rows 16–17. The test-class dry run returns before the residency and PK-salary checks (Ops `careers-apply.handler.ts`: `if (input.dryRun) return { ok: true, … }` precedes `validatePublicApplyDto`/`apply()`), so in Cycle 5 those two rules are enforced only by the site's own `applyToFields`, and by the door only in Cycle 7.
8. **`FallbackPanel`'s `WHATSAPP_FIELDS` omitted the fraud report's `suspectName`/`suspectContact` and the partner `licence`** — ruled by W167 and closed in Cycle 3b, a WP2a foundation touch (the three appended after `message`, pinned in `FallbackPanel.test.tsx`, ARCHITECTURE § Forms flow updated, its own commit). Every other omission — `trades`, `candidatesPerYear`, the Contact callback's `day`/`slot` (row 11), `reply`, `dial`, `portfolioUrl` — and the raw option keys in the prefill (`Sektör: factory`) are accepted for Phase A; label mapping of option keys is a Phase B item (W167 names `docs/pending/README.md`, which carries no such line yet — this task does not add one). None of Cycles 5–7's assertions read the prefill text; Cycle 7 notes the prefill if a fallback panel is seen on rows 7, 11, 14 or 15.

Everything else consumed above is spelled exactly as the real code (`WEB/src/**`, and `jobsadmire-operations/apps/backend/src/modules/website/**` read directly) states it, verified during this reconciliation (2026-09-29) rather than trusted from an earlier draft or from `produces-final.md` alone.

**Ledger line:**

```
| T14 Forms end-to-end on staging | none — forms proof only, no route added | unchanged on every existing route (no page shipped; any delta is accounted for before DONE) | local gate green, `e2e/door-test-mode.spec.ts` 42 skipped (21 tests × 2 projects, door-less); LCP/perf unchanged (no route) | n/a (not a D27 page) — staging proof: door:smoke <table pasted, exit code>; automated (Cycles 5–6, desktop, test class) 17 instance tests <14 pass + rows 15–17 skipped by design (Cycle 7 only, W171) / fails>, replay <pass/fail, ids>, 429 unit-proven only (W171 — post.test.ts, FallbackPanel.test.tsx, door-smoke.test.ts; a live proof is an Ops follow-up), 404 <pass — or "not reachable this way">, unavailable <pass, observed ms>, honeypot <pass/fail>; manual (Cycle 7) 17 rows <pass/fail per key: hire ×4, contact ×2, partner ×2, workers ×1, callback ×2, visit ×1, calculator ×1, fraud ×2, careers ×2>, 403 captcha <pass/fail>, RC26 <pass — or "not reachable from the UI">, I12 <pass/fail>; prerequisites: staging alias <date>, bypass secret <name only>, Turnstile <date supplied — or "pending">, Ops flip <verified, pre-existing>; Cycle 3b WhatsApp prefill <commit sha>; Ops docs commit <sha on website/t14-forms-docs> rode with <peer session>'s push <sha, deployed timestamp> — or "prepared, awaiting a peer push" | <run date> |
```
