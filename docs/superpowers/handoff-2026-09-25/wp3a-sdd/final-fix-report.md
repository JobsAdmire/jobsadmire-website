# WP3a — final fix round (after the whole-branch review)

Worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`, base d6eb08c → **d504140** (code) → **5e5f439** (docs). Nothing pushed. Working tree clean after the two commits.

Input: `.superpowers/sdd/2026-09-19-wp3a-website-intake/final-review-report.md` (Important 1–3, Minors 4–7, 9, 10, 12, 14). Rulings X16/X17 appended to `docs/superpowers/plans/2026-09-19-wp3a-website-intake-rulings.md:74-76`.

## Commit 1 — d504140 `fix(website): …` (code + specs + frontend)

| # | Finding | Change (file:line) | Covering test |
|---|---|---|---|
| I1 / **X16** | Test class cannot pass Turnstile headless | `website-forms.service.ts:235-244` — `isTest && !captchaToken?.trim()` → verdict `{ outcome: 'skipped' }`, no `verify()`; `:252` `captchaPassed: verdict.outcome === 'passed' ? true : null` (so skipped → `null`, `captchaDegraded: false`); post-row branch unchanged (skipped is neither `degraded` nor counted). Header comment `:146`. | `website-forms.service.spec.ts:288` (test class, no token → 200 HANDLED dry run, `captchaPassed null`, `verify` not called, no alarm, no verified count; blank token = no token), `:306` (test class + invalid token → 403, no row), `:313` (write and previous-write without a token → 403, `verify` called); the existing test-class cell `:264` now asserts `verify` was called WITH the token |
| M4 / **X17** | PII retention gap | `website-forms.service.ts:249-256` — `purgeAfter: purgeAfterFor(now)` on the RECEIVED row at creation; `:428` HANDLED still resets to `handledAt + 90 d`, every other outcome keeps the birth stamp; `website-forms.logic.ts:37-43` doc. `website-purge.cron.ts:29` `WEBSITE_SUBSCRIBER_PENDING_GRACE_MS = 30 d`, `:98` third sweep, `:183-206` `purgePendingSubscribers` (PENDING ∧ `confirmExpiresAt < now − 30 d`, `findMany take 100` → `deleteMany by id`, ≤ 20 batches, counts-only log, own try/catch). | `website-forms.service.spec.ts:82-84` (created row carries a Date ≈ +90 d), `:103-105` (HANDLED resets ≥ creation stamp), `:174-177` (FAILED keeps the creation stamp, never null), X16 cell `:288` (dry-run row stamped too). `website-purge.cron.spec.ts:191-246` — 5 cells: exact query shape + 30 d constant + status filter on the READ; 250-row backlog walks 3 batches; nothing due = no delete; runs third and survives its own DB failure; still sweeps when the two earlier arms failed. Flag-off cell `:64` also asserts the subscriber read is skipped |
| M5 | Stuck RECEIVED rows invisible | `website-forms-inbox.logic.ts:14` `INBOX_STUCK_RECEIVED_MS = 10 min`, `:124` `buildSubmissionWhere(q, now = new Date())`, `:141-149` third OR arm `{ status: RECEIVED, createdAt: { lt: now − 10 min } }` (still appended under `where.AND`); `website-forms-inbox.service.ts:32` passes the request instant. Browser: `lib/api/website.ts:173-187` `WEBSITE_STUCK_RECEIVED_MS`, `websiteSubmissionIsStuck`, `websiteSubmissionNeedsAttention(row, now)`; `inbox/page.tsx:13-14` comment, `:337` filter label "Failed, captcha-degraded or stuck only", `:410-412` detail banner text for a stuck row; `messages/en.json` + `tr.json` `admin_website_inbox.description` / `tip1` name the third reason. | `website-forms-inbox.logic.spec.ts:52-70` (frozen `now`, exact cutoff, cutoff follows the clock handed in), `website-forms-inbox.service.spec.ts:55-62` (request instant − 10 min), `apps/frontend/src/lib/api/website.spec.ts` "websiteSubmissionNeedsAttention" block (stuck true past 10 min, false at exactly 10 min, only RECEIVED can be stuck) |
| M6 | Redis outage latency ≈ 10 s per call | New `website-redis-timeout.ts` — `WEBSITE_REDIS_TIMEOUT_MS = 1_000`, `WebsiteRedisTimeoutError`, `withRedisTimeout(op, run, ms)` = `Promise.race` + timer cleared on settle, sync throw → rejection. `website-abuse.service.ts:52` (`exists`), `:74-78` (`incr`, `expire`, `setNx`), `:88` (`set` announced); `:60-63` `trippedForms` now `Promise.all` in `WEBSITE_FORM_KEYS` order (one timeout, not ten). `website-notify.service.ts:105-107` alarm SETNX wrapped. A timeout lands in the same `catch` as a rejection: fail open / fire anyway. | `website-redis-timeout.spec.ts` (3 cells: pass-through incl. sync throw; hung call rejects at exactly 1 000 ms with the named error under fake timers; timer count 0 after settle). `website-abuse.service.spec.ts:93-122` (hung `exists` + `incr`: `isTripped` → false, `recordVerified` → `{0,false,false}`, `trippedForms` → `[]`, all settled at 1 000 ms not 999, no notify, 11 parallel `exists` calls). `website-notify.service.spec.ts:116-131` (hung SETNX → alarm fires at 1 000 ms, dispatch called) |
| M7 | Careers DTO failure alarms as infra | `handlers/careers-apply.handler.ts:88-96` — `detail: { visitorError: true, rejectedBy: 'PublicApplyDto', errors, dropped, …contact }`; doc `:42-44`. | `handlers/careers-apply.handler.spec.ts:155-164` (missing phone → `ok: false`, `visitorError: true`, `rejectedBy: 'PublicApplyDto'`, errors name the field, `apply()` untouched) |
| M9 | SPAM counts as a lead | `website-alarms.cron.ts:93` and `website-ping.service.ts:49` — `status: { not: WebsiteSubmissionStatus.SPAM }` beside `isTest: false`; cron doc `:26-28`. | `website-alarms.cron.spec.ts:58-67`, `website-ping.service.spec.ts:62-67` (exact `where`) |
| M12 | Templates pinned by name only | New `website-templates.spec.ts` — reads the `template: '…'` literals out of `newsletter/website-newsletter.service.ts` and `EVENT_REGISTRY.WEBSITE_FORMS_UNAVAILABLE.emailTemplate`, asserts `website-newsletter-confirm`, `website-newsletter-welcome`, `website-forms-unavailable` × (`.hbs`, `.tr.hbs`) exist and are non-empty under `src/modules/email/templates` (the dir `EmailService` reads in dev; the same folder is copied to the prod image), and that the pinned list equals the used list. | itself (5 cells) |

## Commit 2 — 5e5f439 `docs(website): …` (docs + the docs guard)

| # | Finding | Change (file:line) | Covering test |
|---|---|---|---|
| I2 | §7.10 wrong on two facts | `docs/PRD.md:4684` Body size row → "one file per call, ≤ 8 MB, magic-byte sniffed (`files: 1`, `fields: 0`; 3 per report is the fraud catalog's `evidenceKeys` cap, not a limit on the route)"; `:4671` → "a 401 before any handler runs — JSON bodies are bounded by the global 1 MB parser (Express middleware in `main.ts`, which runs before the guards); multipart is not read until the guards pass (multer is an interceptor, after the guard chain)". `:4685` Retention row states X17. | `website-docs-guard.spec.ts:147-158` — pins the §5.12 `files: 1` sentence AND the corrected §7.10 row, asserts "≤ 3 files" and "a 401 before any body is parsed" are gone, pins the "before any handler runs — JSON bodies…" sentence |
| I3 | Rollback path unwritten | `docs/DEPLOYMENT.md:233-243` `#### Rolling back the WP3a pushes` under "Flipping …", before "Booting …": flag-off first (no revert); `git revert <code sha>` on `main` → poller redeploys ~2 min, verify by artifact; migration additive and STAYS (no down-migration); the `since: 3` grant rows / two `module_notification_settings` rows / ten `website_forms` rows stay and are harmless — `packages/permissions/src/effective.ts` indexes rows by key with no unknown-key throw, conformance compares `PERMISSION_KEYS` with the registry (both reverted), never `role_permissions` (verified: `permission-conformance.service.ts` never reads that table); a later re-apply will NOT re-create them because every role is at `defaultsVersion = 3` and the seed is create-if-missing; order of preference. | `website-docs-guard.spec.ts:185-199` — heading present, positioned between the flip and the boot sections, and the five load-bearing facts (`git revert`, additive migration, `effective.ts`, `defaultsVersion = 3`, `WEBSITE_MODULE_ENABLED=false`) present in that section |
| X16 / M10 | Test-class captcha + heartbeat dedupe | `docs/PRD.md:4192` Test class paragraph: the X16 rule (no token → skip, `captchaPassed null`, `captchaDegraded false`, no alarm; with token → verified; write classes unchanged) + "the monitor must vary one field per post (e.g. a timestamp in `sourcePath`) because identical payloads replay within the hour"; P2 gotcha in §5.12 notes the deliberate hole. | (prose; the behaviour is covered by the forms spec cells above) |
| X17 | Retention wording | `docs/PRD.md:4228` Data paragraph: "PII purged 90 days after creation, or 90 days after HANDLED if later — `purgeAfter` set on every row at creation …; PENDING subscribers purged 30 days after token expiry"; `:4212` alarms/retention paragraph: three sweeps + the subscriber sweep + SPAM excluded from drought and `ping.lastSubmissionAt` + the Redis hot-path timeout; `:4208` needs-attention = FAILED ∨ captchaDegraded ∨ stuck RECEIVED; `:4202` careers row: DTO failure is a `visitorError`; §8 model line. `docs/DEPLOYMENT.md:46` crons row: three sweeps, X17 wording. | — |
| nit 14 | Stale anchors / wording | `docs/PRD.md:4181` intake row: form → trip check → whitelist (`website-forms.service.ts:185-203`) → honeypot → captcha → dedupe → submission row (`:226-256`) → handler — the ranges are the COMMITTED file's (form 185–188, trip 189–200, whitelist 201–203, honeypot 226–233, captcha 235–245, row 249–256); the finding's `187-200` / `226-241` predate the X16/X17 comments, so the accurate lines were used instead; gate record `2026-09-19-wp3a-gate-record.md:90` B2 → "drift gate exit 2 with ONLY the known baseline lines (zero website lines)"; `docs/DEPLOYMENT.md:117` flag row notes `website-purge` logs one "skipped — the website module is off" line per nightly tick while off (`website-alarms` is silent). | docs guard (unchanged cells still green) |
| — | Rulings | `2026-09-19-wp3a-website-intake-rulings.md:74-76` — X16, X17, and one bullet recording the same-round minors (5, 6, 7, 9, 12). | — |

Not changed (parked by the review, unchanged here): Minor 8 (`@Throttle` tracker on `X-Website-Visitor-Ip` — for the day `RATE_LIMITING_ENABLED` flips), Minor 11 (blob-URL evidence viewer), Minor 13 (owner to confirm 25/h/form), Minor 15 (two distinguishable 401 bodies).

## Verification

```
$ cd apps/backend && npx jest src/modules/website src/modules/notifications test/permissions --maxWorkers=2 --forceExit
Test Suites: 3 failed, 80 passed, 83 total
Tests:       922 passed, 922 total
  FAIL website-purge.cron.spec.ts — TS2352 on a spec-only cast (fixed: `as unknown as { where: { status: string } }`)
  FAIL test/permissions/website-inbox-conformance.spec.ts — "A jest worker process … was terminated … signal=SIGTERM" (0 failing tests, known runner flake)
  FAIL test/permissions/website-conformance.spec.ts        — same SIGTERM flake, 0 failing tests

$ npx jest src/modules/website/website-purge.cron.spec.ts test/permissions/website-inbox-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2 --forceExit
Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total

$ npx jest src/modules/website/website-docs-guard.spec.ts src/modules/website/website-templates.spec.ts --maxWorkers=2 --forceExit   (after the last PRD touch)
Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total

$ npx jest src/modules/website/website-redis-timeout.spec.ts src/modules/website/website-abuse.service.spec.ts src/modules/website/website-notify.service.spec.ts --maxWorkers=2 --forceExit
Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total

$ cd apps/backend && npx tsc --noEmit;  echo exit=$?     → exit=0
$ cd apps/frontend && npx tsc --noEmit; echo exit=$?     → exit=0
$ cd apps/frontend && npx jest src/lib/api/website.spec.ts
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

Net across the narrowed backend set after the cast fix: 83/83 suites, 922 + the purge/conformance re-run cells green (the SIGTERM flake re-ran clean with 0 failing tests, per the instruction). No docker, no Next build, no full suite — Task 13-prod re-runs the narrowed set.

## Concerns / notes for Task 13-prod

1. **X16 widens nothing but does change the gate's §H step.** With the real Turnstile secret stored, a test-class POST WITHOUT `captchaToken` now answers 200 `HANDLED` (dry run, `captchaPassed: null`) — the gate no longer needs Cloudflare's always-pass secret to prove the door; a test-class POST WITH a dummy token is still the 403 the gate record currently shows. The gate record §H text (`RC14`: "the test-class POST with a dummy captcha token is performed AFTER the Turnstile secret is switched…") was left as history; the monitor contract in §5.12 is the live rule.
2. **X17 changes existing rows' fate only prospectively.** Rows already in production (none — the door is off) would keep `purgeAfter: null` until HANDLED; no backfill was written because there is nothing to backfill on the VPS yet. If any RECEIVED/FAILED rows exist before the flip on a dev DB, they are not purged until re-created.
3. **The stuck-RECEIVED arm reads the clock in the browser helper** (`websiteSubmissionNeedsAttention(row, now = Date.now())`). The rows only ever arrive from a client-side `useQuery` (no `initialData`), so there is no server-rendered branch to mismatch; documented in the helper's comment. If the inbox ever gains SSR prefetch, pass a stable `now`.
4. `trippedForms()` now issues its ten `exists` calls in parallel (was sequential). Same order, same answers; on a healthy Redis this is ten pipelined round-trips instead of ten serial ones.
5. `website-templates.spec.ts` reads the newsletter service SOURCE for its `template:` literals (the `careers-fraud-wiring.spec.ts` precedent) rather than exporting new constants — no production file changed for M12.
6. The PRD §5.12 intake-order anchor quotes the committed file's real ranges (`185-203`, `226-256`) rather than the finding's `187-200` / `226-241`, which the X16/X17 comments shifted; the docs guard does not pin line numbers, so a later re-anchor is a one-line edit.
