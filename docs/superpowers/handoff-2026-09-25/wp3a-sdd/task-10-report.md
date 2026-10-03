# Task 10 report — notifications, autoresponders, abuse trip, drought and purge

Worktree: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`. Base: `14f7e4e` (Task 9 head). Nothing pushed.

## Commits (in order)

| SHA | Subject |
|---|---|
| `76c87f4` | feat(website): WEBSITE_FORM_RECEIVED and WEBSITE_FORMS_UNAVAILABLE in the registry, seed and bell landing |
| `e4fc044` | feat(website): notify service with once-per-window alarms and the second-human fan-out |
| `30156f2` | feat(website): EN/TR autoresponders for the eight non-careers forms |
| `9d94cdf` | feat(website): abuse auto-trip, lead-drought and 04:30 purge crons, ping reads the trip keys |
| `9ca90f8` | fix(website): newsletter confirm mail is not re-sent inside a 15-minute cooldown (X12) |

45 files changed, +1933 / −80 against `14f7e4e`. Every commit carries the `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` trailer.

## What was implemented, per area

### Part A — registry, dispatcher helper, seed, coverage, bell landing (`76c87f4`)
- `notifications/event-registry.ts`: `RecipientHelpers.getModuleViewers(module, opts?: { descendants?: string[] })`; the `websiteEvents` block (labels for all ten `WEBSITE_FORM_KEYS`, `websiteUnavailableTitle/Message` branched on `reason`, `WEBSITE_FORM_RECEIVED` = IN_APP, viewers via `website.forms` descendant + assignee, `WEBSITE_FORMS_UNAVAILABLE` = IN_APP+EMAIL to super-admins, `emailTemplate: 'website-forms-unavailable'`, `[Website] …` subjects, both `mailbox: 'default'`, `relatedEntityType: 'website-submission'`, `emailLinkPath` → `/admin/website/inbox[?row=<id>]`, full settings-catalogue fields); `EVENT_REGISTRY` literal spreads `websiteEvents`; `EventKey` gains both keys. **X7:** `WEBSITE_CAPTCHA_DETAIL_WORDS` maps all four `WebsiteCaptchaDegradedReason` values (`secretMissing`, `secretInvalid`, `httpError`, `unreachable`) to words in the `captchaDegraded` message; an unknown detail prints verbatim.
- `event-dispatcher.ts`: `getModuleViewers` forwards `opts.descendants` into `holdsModuleGrant(module, VIEW, { descendants })` — first argument still the identifier `module` (repo-invariants (c) green).
- `prisma/module-notification-seed.ts`: two `website` rows (received bell-only, unavailable email ON) — mirrors the registry so the INSERT can never throw on a missing row.
- `module-notification-seed.spec.ts`: tail regrouped per module (`marketing`, `website`) with `EMAIL_BY_DEFAULT` per the brief. `event-registry-coverage.spec.ts`: the two `WEBSITE_*` clauses. New `event-registry-website.spec.ts` (the brief's cells + 5 X7 cells).
- `email/templates/website-forms-unavailable.hbs` + `.tr.hbs`.
- Frontend `entity-path.ts`: `website-submission` / `websiteformsubmission` → `/website/inbox?row=<id>`; `TYPE_FALLBACKS` `['WEBSITE_', '/website/inbox']`; the three spec edits.

### Part B — alarm arithmetic + `WebsiteNotifyService` (`e4fc044`)
- New `website-alarms.logic.ts` (pure): thresholds (25 / 3600 s / 10800 s / 48 h), `WebsiteUnavailableReason`, `WEBSITE_BUSINESS_HOURS` (Europe/Istanbul Mon–Fri 09:00–18:00), `wallClockInZone`, `isWithinWebsiteBusinessHours`, `websiteDayKey`, `websiteAbuseKeys` (the ONE key family `website:abuse:count|tripped|announced:<form>`), `shouldTrip`, `alarmOnceKey` (`website:alarm:<reason>:<form|*>`, drought `…:<form|*>:<YYYY-MM-DD Istanbul>`), `alarmOnceTtlSec`, `isLeadDrought`.
- `website-notify.service.ts` body replaced IN PLACE (same file, same exported names; constructor now `(events, notifications, settings, websiteConfig, redis)`): `formReceived` dispatches + second human; `formsUnavailable` SETNX once-per-window (fails OPEN on Redis), dispatches, second human, returns whether it fired. Second human: `websiteConfig.getOrCreate()` → `secondHumanEmail` (skip when empty) + `secondHumanName` greeting; `queueEmail({ mailbox: 'default', template: 'module-custom', no userId })` with the registry's own `title/message/emailSubject` and the Operations link through `settings.absoluteLink` (RC28 — this service never reads `WEBSITE_SITE_URL`). Never throws. Logs carry submission ids / form keys / reasons only.

### Part C — autoresponders (`30156f2`)
- `website-autoresponder.service.ts` body replaced IN PLACE: `WEBSITE_AUTORESPONDER_FORM_KEYS` (8 keys), `websiteAutoresponderTemplate`, `websiteAutoresponderSubject` (EN/TR), `websiteLocale`, plus **`WEBSITE_AUTORESPONDER_PATHS`** (locale-keyed slug table mirroring the website's `pathnames`, D16 — the `NEWSLETTER_PATHS` precedent) and **`websiteAutoresponderCtaUrl(siteUrl, formKey, locale)`** built through Task 9's `websiteLocalePath` (execution ruling: locale-slug helper for every website link). `send()` skips `isTest`, empty `to`, careers, newsletter; explicit `locale`; `mailbox: 'default'`; no `userId`; no List-Unsubscribe (transactional); context `{ name, siteUrl, ctaUrl, locale }`; never throws.
- 16 templates `website-<key>-autoresponder.hbs` + `.tr.hbs` (hire, contact, partner, workers, callback, visit, calculator, fraud): the brief's copy, CTA printed as `{{ctaUrl}}` (callback has no CTA). Rendered three through Handlebars to confirm they compile.

### Part D — abuse, crons, ping, module (`9d94cdf`)
- `website-abuse.service.ts` body replaced IN PLACE (constructor `(redis, notify)`): `isTripped` never rejects (fails open), `trippedForms` in `WEBSITE_FORM_KEYS` order, `recordVerified` = INCR + EXPIRE on first hit, SETNX trip = 429 switch + once claim, `announced` marker, trip notice with count.
- `website-alarms.cron.ts` (`0 */5 * * * *`, name `website-alarms`, `running` latch): flag per tick via `websiteModuleEnabled(config)`; untrip announce (trip marker gone + announced marker present → one `untripped`, marker deleted); drought during business hours only (`findFirst({ where: { isTest: false }, orderBy: createdAt desc })`, `isLeadDrought`, `drought` with `hours: 48`). Each arm try/caught.
- `website-purge.cron.ts` (`0 30 4 * * *`, name `website-purge`, `running` latch): flag per tick; rows past `purgeAfter` in batches of 100 (max 20/night), fraud keys via `WebsiteFraudEvidenceService.evidenceKeysOf()` deleted FIRST with `deleteFileChecked`, a row with any surviving object kept; then the **fraud-orphan sweep**: `upload.listObjects('website-fraud/')`, objects with `lastModified` older than 7 days (undated skipped, keys outside the prefix skipped), a JSON-path `count({ payloadJson: { path: ['fields','evidenceKeys'], array_contains: [key] } })` per candidate, unreferenced ones deleted; counts only in the log; each arm try/caught so one failing does not stop the other.
- `upload/upload.service.ts`: new `listObjects(prefix)` (recursive `listObjectsV2` → `{ key, lastModified, size }[]`) — the upload service had no list API, so the wrapper got one rather than the cron reaching into the private MinIO client.
- `website-ping.service.ts`: third constructor arg `WebsiteAbuseService`, `trippedForms: await this.abuse.trippedForms()` inside the existing `Promise.all`; docblock as the brief prints. Spec: `build()` gains the `abuse` mock + `tripped?` option, header sentence replaced, one new test.
- `website.module.ts`: ONLY the two cron imports and the two providers (+ the Task 10 comment) appended; everything Tasks 1–9 wired, incl. the `registry.register` literal, is byte-identical (`git diff` = 6 insertions).

### X12 (`9ca90f8`)
- `newsletter-token.ts`: `NEWSLETTER_RESEND_COOLDOWN_MS = 15 min`. `website-newsletter.service.ts`: when the existing row is PENDING and `confirmExpiresAt − NEWSLETTER_CONFIRM_TTL_MS` is < 15 min ago → `CONFIRMATION_SENT` with no update and no mail. One spec cell added; Task 9's existing "asks again gets a fresh token" cell (issued ~48 h ago) stays green.

## Anchors that differed from the brief, and how resolved

1. **Notify spec `customBody` link** — the brief asserts the raw substring `…inbox?row=s1`, but `defaultEmailBody` runs the href through Handlebars' `escapeExpression`, which encodes `=` as `&#x3D;` (every existing marketing digest ships this way; mail clients decode it). Kept `defaultEmailBody` as the brief requires and asserted the decoded href in the spec (`body.replace(/&#x3D;/g, '=')`) with a comment.
2. **RED shape for the shells** — the brief expected the notify/abuse/ping specs to compile against Task 6's shells and fail on assertions; ts-jest instead reports the wider constructors as `TS2554` compile errors. Same RED outcome, recorded here.
3. **Autoresponder CTAs** — the brief hard-codes `{{siteUrl}}/en/hire-workers` / `{{siteUrl}}/isci-talebi` in the templates; the execution ruling says to use Task 9's locale-slug helper. Templates print `{{ctaUrl}}`; the service owns the slug table (verified against `jobsadmire-website/src/i18n/routing.ts` — every slug in the brief matches). Two extra exports (`WEBSITE_AUTORESPONDER_PATHS`, `websiteAutoresponderCtaUrl`) and four extra spec cells pin it; the brief's `siteUrl` context key is kept.
4. **Abuse service notify placement** — the brief calls `notify.formsUnavailable` inside the Redis try/catch, so a rejecting notifier would report `{ count: 0, tripped: false }` after the 429 switch was already set. Moved the call outside with its own try/catch so the answer stays honest; one spec cell added ("still reports the trip when the notify call rejects").
5. **Purge cron** — the brief's version had no `running` latch; added one (harmless, symmetric with the alarms cron). The orphan sweep and `UploadService.listObjects` are additions per the execution ruling (no list API existed).
6. **Ping service docblock** — the current file's "is `[]` in this commit" paragraph was replaced with the brief's final wording; the rest of the file matched the brief's final form line-for-line.
7. **`website.module.ts`** — the real file already contained every import and provider the brief's "final form" lists (Tasks 1–9 reconciled cleanly); only the two cron lines and their comment were added.
8. All other anchors (`getModuleViewers` line, the three `EVENT_REGISTRY` lines, `| 'whatsapp.number.alert';`, the dispatcher helper, the seed row, the seed-spec `describe`, the coverage-spec tail, the six frontend anchors, the ping-spec `return` line and header sentence) matched byte-for-byte.

## RED → GREEN

Part A RED (`npx jest src/modules/notifications --maxWorkers=2`): `Test Suites: 3 failed, 12 passed; Tests: 33 failed, 248 passed` — every `event-registry-website` cell `TypeError: Cannot read properties of undefined`, seed spec `files every row under a module…` and `website › emails by default…`, coverage `every WEBSITE_* …` ×2. Frontend RED: `5 failed, 93 passed` (the two fallbacks, the two `getEntityPath` rows, the new href test all `null`).
Part A GREEN: notifications `15 passed / 281 passed`; frontend `98 passed`; `repo-invariants.spec.ts` `17 passed`.

Part B RED: `website-alarms.logic.spec.ts` `TS2307 Cannot find module './website-alarms.logic'`; `website-notify.service.spec.ts` `TS2554 Expected 0 arguments, but got 5`. GREEN: website folder `31 suites / 226 tests`.

Part C RED: `TS2305` no exported member `WEBSITE_AUTORESPONDER_FORM_KEYS` (+ the helpers), `TS2554`. GREEN: `34 passed` (incl. the 16 on-disk template checks and the CTA cells).

Part D RED: `website-alarms.cron` / `website-purge.cron` `TS2307`, abuse `TS2554 Expected 0 arguments, but got 2`, ping `TS2554 Expected 2 arguments, but got 3`. GREEN: website folder `35 suites / 290 tests`.

X12 RED: the new cooldown cell `✕`; GREEN: newsletter folder `3 suites / 18 tests`.

## Final verification (one jest invocation at a time, `--maxWorkers=2`, from `apps/backend`)

| Run | Result |
|---|---|
| `src/modules/website src/modules/notifications` | 50 suites, 572 tests passed |
| `test/permissions` (1st run) | 28 passed, **2 "failed to run"** (`marketing-conformance`, `internal-recruitment-conformance`) with 0 failing tests — the known runner flake |
| `test/permissions` (2nd run) | **30 suites, 334 tests passed** |
| the two flaked suites alone | 2 suites, 15 tests passed |
| `website-env.spec.ts`, `website-forms.service.spec.ts`, `website-forms.rerun.spec.ts`, `test/internal-recruitment/event-registry.unit.spec.ts`, `notifications/event-registry.spec.ts` | 5 suites, 138 tests passed (Task 6/7 specs untouched; env spec still reports `website-module-flag.ts` as the ONE reader; the two older `getModuleViewers` fakes satisfy the widened signature) |
| `test/permissions/website-conformance.spec.ts`, `website-door-conformance.spec.ts`, `repo-invariants.spec.ts` | all in the 30/30 run above; route census unchanged (no new controllers/routes) |
| frontend `src/lib/notifications/entity-path.spec.ts` | 98 passed |
| `npx tsc --noEmit -p tsconfig.json` (backend) | exit 0, no output |

No docker, no Next build, no full suite. Working tree clean after the last commit.

## Self-review

- **Completeness:** registry events + `EventKey` union + seed rows + seed spec regroup + coverage clauses + entity-path fallbacks ✔; notify service with second-human fan-out on every website event (received except careers per RC25 — enforced by the core's `skipNotification`; unavailable for trip/untrip/drought/captcha/handlerFailed) and once-per-window ✔; abuse service on the single `website:abuse:*` family ✔; alarms cron (untrip + drought) and purge cron (rows + fraud keys + orphan sweep), both flag-checked per tick through `websiteModuleEnabled` ✔; 16 EN/TR autoresponders for every non-careers, non-newsletter form ✔; ping injection ✔; X7 mapping ✔; X12 cooldown ✔; module wiring ✔.
- **Quality / hygiene:** no mail carries payload free text beyond the fields the registry names (name, form label, inquiry number, reason, form key, detail); every log line is a form key / submission id / reason / count / error message — no addresses, names, tokens or secrets; no `any`; `WEBSITE_MODULE_ENABLED` is quoted nowhere new (env spec green); `WEBSITE_SITE_URL` read only by the autoresponder and newsletter services (RC28); cron names unique, 04:30 slot unused by any other cron.
- **Discipline:** the three shells edited in place (files never re-created); `WebsiteFormsService` constructor and its two specs untouched; the `registry.register` literal untouched; no push.

## Concerns / notes for the reviewer

1. The captcha-degraded alarm is keyed **per form per hour** (`website:alarm:captchaDegraded:<form>`), exactly as the brief's spec pins — a Turnstile outage can therefore raise up to one alarm per form per hour (the doors are hit at different rates, so in practice a handful). If the owner wants one alarm per hour for the whole door, the key just drops the form segment; the registry needs no change.
2. The orphan sweep issues one `count` query per `website-fraud/` object older than 7 days each night; candidates are rare (an upload never followed by a submit) and are removed the same night, so the cost is bounded, but a MinIO listing of the prefix runs nightly regardless.
3. `UploadService.listObjects` is an additive method on a shared service (no spec of its own — the service has none; it is a thin stream-to-array over `listObjectsV2`). The purge spec mocks it.
4. Docs (PRD §5.12/§6.2/§6.7, DEPLOYMENT.md cron inventory naming `website-alarms.logic.ts`) are Task 12's per RC1/RC10 and were not touched here.

## Fix round 1 (review: one Important + three minors, all ruled)

Commit `09906dc` — `fix(website): site-wide captcha alarm window (X13), no drought before the first lead (X14), trip marker isolated, one-query orphan sweep` (Opus trailer; not pushed).

1. **X13 — site-wide captcha alarm window.** `website-alarms.logic.ts`: `SITE_WIDE_REASONS = {'captchaDegraded'}`; `alarmOnceKey` uses `*` for those regardless of `formKey` (`secretInvalid` is a *detail* of `captchaDegraded`, so it is covered by the same key); `tripped` / `untripped` / `handlerFailed` stay per form; drought unchanged. The notify service keeps `ctx.formKey` in the dispatch context, so the e-mail names the first form that saw it. Specs: the notify pin is now `website:alarm:captchaDegraded:*`; the logic spec has a per-form cell and a site-wide cell; a new notify cell proves two forms degrading in one window (fake SETNX with a claimed-key set) dispatch ONE alarm and one second-human mail, naming `hire`, while a per-form `handlerFailed` in the same window still fires.
2. **X14 — no drought before the first lead.** `isLeadDrought(null, now)` → `false`; doc comment: "the ping/heartbeat monitors the door; drought measures leads". Logic spec split into two cells; cron spec gains "is not a drought before the first lead ever arrives" (findFirst called once, no alarm) and the two never-throw cells now use a stale lead / no `last` override instead of `null`.
3. **Announced marker isolated.** `recordVerified` writes `website:abuse:announced:<form>` in its own try/catch after the winning `setNx(tripped)`; a rejection warns ("untrip may go unannounced") and the trip notice still fires; notify placement unchanged. New spec cell: `redis.set` rejects → `{ tripped: true, justTripped: true }` and `formsUnavailable(tripped)` called.
4. **One-query orphan sweep.** `website-purge.cron.ts`: candidates (prefix-locked, dated, > 7 days) are filtered first; if none, no database read at all; otherwise ONE `findMany({ where: { form: { kind: WebsiteFormKind.FRAUD_REPORT } }, select: { payloadJson: true } })` collected through `evidenceKeysOf` into a `Set<string>`, then unreferenced candidates deleted. I took the ruled fallback (`form.kind = FRAUD_REPORT`) rather than `payloadJson: { path, not: Prisma.DbNull }`: RC5 makes the kind filter the exact population (only the fraud catalog defines `evidenceKeys`, the 90-day purge bounds it), it typechecks against the generated client, and a JSON-path null filter's SQL on a *missing* path is not something I can prove without a database. The referenced-even-if-`isTest` guarantee holds (no `isTest` filter; a spec cell pins it). The "table is not scanned" comment is gone; the docblock says what the query is. `UploadService.listObjects` docblock: "Buffers the whole prefix in memory — for small prefixes only." Purge spec: `findMany` mock branches on `purgeAfter` vs the sweep query; cells for the one-query shape (called exactly once), the test-row guarantee, and "no database read when nothing is old enough".

Verification: `npx jest src/modules/website/website-notify src/modules/website/website-abuse src/modules/website/website-alarms src/modules/website/website-purge src/modules/website/website-forms src/modules/notifications --maxWorkers=2` → 25 suites, 381 tests passed (the repo has no `test/notifications` folder — the notification specs live in `src/modules/notifications`, run instead). Whole `src/modules/website` → 35 suites, 298 tests passed. Backend `npx tsc --noEmit -p tsconfig.json` → exit 0.
