# Task 6 report — Forms core (catalog, captcha, dedupe + replay, `POST /website/v1/forms/:formKey`, handler contract + registry, `WebsiteForm` seed, three collaborator shells, dry-run path, X6 headers)

Worktree: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`. Nothing pushed.

## Status: DONE

## Commits (on top of `f2912e9` Task 5)

| SHA | Subject |
|---|---|
| `435f367` | feat(website): form catalog, intake DTO, WebsiteForm seed and the lifted IP-hash helper (WP3a) |
| `4e86980` | feat(website): degrading Turnstile verifier, the handler contract and the notify/abuse/autoresponder contracts (WP3a, P6/RC4/RC6) |
| `14d4cba` | feat(website): POST /website/v1/forms/:formKey — row first, handler second, nothing after may throw (WP3a, P8) — includes X6 |

Trailer on all three: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` (the task instruction; the brief's printed messages carried a Fable trailer — replaced as instructed).

## What was implemented (file by file)

Created:
- `apps/backend/src/common/utils/ip-hash.util.ts` — `hashIp`, `hashIpOrNull`, `IP_HASH_DEV_SALT` (`sha256(\`${salt}:${ip}\`)`, byte-identical to the three private copies, which are untouched).
- `apps/backend/src/modules/website/website-form-catalog.ts` — `WEBSITE_FORM_CATALOG` for all ten keys, `websiteFormSpec`, `normalizeWebsiteFields` (trim / control-char strip / e-mail lowercase / ISO2 uppercase / phone kept as typed / enum / pattern / min / max), the `array-of-key` normaliser (fraud `evidenceKeys`: de-duplicated, ≤ 3, `^website-fraud/…`), `I_AM_VALUES`, `EMPLOYER_I_AM_VALUES`, careers `cvKey`/`openingSlug` patterns (RC5/P5).
- `apps/backend/src/modules/website/website-forms.logic.ts` — `requestHashFor` (key-sorted sha256), `hourBucketFor`, `purgeAfterFor` (+90 d), `WEBSITE_PURGE_DAYS`, `isUniqueViolation` (P2002 only), `visitorIpFromHeaders` (X-Website-Visitor-Ip validated with `net.isIP` → XFF first hop → socket), `visitorUserAgentFromHeaders` (sliced to 500).
- `apps/backend/src/modules/website/dto/website-form-submit.dto.ts` — `WebsiteFormSubmitDto`, `WEBSITE_LOCALES`, `WebsiteLocale`; `fields` handed through with `@Transform(({ obj }) => obj.fields)` (wa-campaign precedent).
- `apps/backend/prisma/website-form-seed.ts` — `WEBSITE_FORM_SEED` (ten rows, `newsletter.isActive = false`), `WebsiteFormSeedRow`, `WebsiteFormSeedClient`, `seedWebsiteForms` (upsert, `update: {}`). Imports only `@prisma/client`.
- `apps/backend/src/modules/website/website-captcha.service.ts` — `WebsiteCaptchaService.verify()` → `passed | failed{codes} | degraded{secretMissing|httpError|unreachable}`; secret via `resolveSecrets()` inside try/catch (a throwing resolver degrades as `secretMissing`); 6 s `AbortSignal.timeout`.
- `apps/backend/src/modules/website/website-form-handler.ts` — `WebsiteFormHandlerInput`, `WebsiteFormHandlerResult`, `WebsiteCreatedEntityType`, `WebsiteFormHandler`, `@Injectable() WebsiteFormHandlerRegistry { register, get }` (refuses a kind registered twice).
- `apps/backend/src/modules/website/website-notify.service.ts` — shell: `WebsiteUnavailableReason`, `WebsiteFormReceivedInput`, `WebsiteFormsUnavailableInput`, `WebsiteNotifyService { formReceived(): Promise<void>; formsUnavailable(): Promise<boolean> }` — WARN + inert, never throws.
- `apps/backend/src/modules/website/website-abuse.service.ts` — shell: `WebsiteAbuseService { isTripped; recordVerified(formKey, now?); trippedForms }` — fail-open ("not tripped, not counted").
- `apps/backend/src/modules/website/website-autoresponder.service.ts` — shell: `WebsiteAutoresponderService.send({ formKey, locale?, to?, name?, isTest })` — returns false, WARN when it would have sent.
- `apps/backend/src/modules/website/website-forms.service.ts` — `WebsiteFormsService` with the FINAL 8-arg constructor `(prisma, config, captcha, registry, activity, notify, abuse, autoresponder)`; `submit()` in the P8 order (form 404 → trip 429 → whitelist 400 → honeypot SPAM row → captcha 403/degraded → ROW FIRST with P2002 replay → post-steps); `protected runHandler()` (Task 7's re-run door) recording per-attempt `handlerResultJson.attempts[]`, `visitorError` (RC26), dry-run never pointing at an entity; `WEBSITE_SYSTEM_ACTOR`, `WebsiteSubmitContext`, `WebsiteSubmitResponse` (incl. `error`), `WebsiteStoredPayload`, `WebsiteAttemptRecord`, `WebsiteHandlerResultJson`, `WebsiteRunHandlerOptions`; `abuse.recordVerified` only after a NEW non-replayed captcha-verified non-test row (RC21); every post-row call `.catch`-wrapped; `ensureFormRow` lazily creates a missing form row from the catalog (race-safe).
- Specs: `ip-hash.util.spec.ts`, `website-form-catalog.spec.ts`, `website-forms.logic.spec.ts`, `dto/website-form-submit.dto.spec.ts` (pipe-level), `website-form-seed.spec.ts`, `website-captcha.service.spec.ts`, `website-forms.service.spec.ts` — the brief's text verbatim except one fixture typing fix (below).

Modified:
- `apps/backend/prisma/seed.ts` — the two quoted anchors: import `seedWebsiteForms`; call it after the module-notification pass and log `✓ Website forms: N row(s) ensured (existing rows untouched)`.
- `apps/backend/src/modules/website/website-public.controller.ts` — replaced in full per the brief (constructor gains `forms: WebsiteFormsService`; `POST forms/:formKey` with `@HttpCode(200)`, `@ApiParam({ enum: [...WEBSITE_FORM_KEYS] })` (RC31), `@TokenClass()`, `@Req()`), plus X6: `@Header('Cache-Control', 'private, no-store')` on BOTH `ping` and `submitForm`, and a doc-comment paragraph saying why.
- `apps/backend/src/modules/website/website.module.ts` — the two quoted blocks only (import block + `@Module` decorator); providers gain `WebsiteCaptchaService, WebsiteFormHandlerRegistry, WebsiteNotifyService, WebsiteAbuseService, WebsiteAutoresponderService, WebsiteFormsService`; `exports` unchanged; the `registry.register({...})` literal untouched.
- `apps/backend/test/permissions/website-door-conformance.spec.ts` — the brief's two line replacements (`report.public` → 2; `keyOf(…, 'submitForm')` undefined) plus the X6 cell (below). `CONTROLLERS` unchanged (`[WebsiteIntegrationsController, WebsitePublicController]`).

## The X6 change

- Controller: `@Header('Cache-Control', 'private, no-store')` on `ping` and `submitForm` (repo precedent `careers-public.controller.ts:284`).
- Spec cell `X6: every route on every public website controller answers Cache-Control: no-store` in `website-door-conformance.spec.ts`: filters `CONTROLLERS` to those with class-level `IS_PUBLIC_KEY === true`, walks `MetadataScanner.getAllMethodNames(prototype)`, skips members without `METHOD_METADATA` (not routes), and asserts `HEADERS_METADATA` (`@nestjs/common/constants`, shape `[{ name, value }]`) contains a `cache-control` (case-insensitive) header whose value contains `no-store`; also asserts `WebsitePublicController` is among the public controllers and that `ping` + `submitForm` were both seen. **Tasks 8 and 9 inherit the check only if they append their public controllers to THIS spec's `CONTROLLERS` list** (RC15 speaks of Task 1's `website-conformance.spec.ts`; this spec is a second list — relay to Tasks 8/9).
- Imports added: `HEADERS_METADATA, METHOD_METADATA` next to `GUARDS_METADATA`.

## Anchors that differed and how they were resolved

- All brief anchors (`website-public.controller.ts` full text, both `website.module.ts` blocks, both `seed.ts` lines, both `website-door-conformance.spec.ts` lines) matched Task 4/5's final text verbatim. No divergence.
- Pre-flight greps: Prisma client is hoisted to the workspace root (`node_modules/.prisma/client/index.d.ts`, not `apps/backend/node_modules/…` as the brief's path says) — all three members hit there; the constants exports hit as printed.
- One brief-fixture defect, not an anchor: `website-captcha.service.spec.ts` did not compile under this repo's `@types/jest@29.5.14` — `jest.fn(async () => …)` infers `[]` parameters, which is not assignable to the brief's `FetchMock` (`[string, RequestInit]`) (TS2322/TS2345 on lines 16, 51, 56, 58). Minimal fix in `make()` only: `fetchImpl?: jest.Mock` and `(fetchImpl ?? jest.fn(…)) as FetchMock`, with a two-line comment. Every assertion and every fixture body is unchanged.
- The brief's controller replacement drops Task 4's doc-comment sentence "Task 6 adds `POST forms/:formKey` here;" — followed the brief's printed final text.
- Commit trailer: task instruction (Opus) over the brief's printed Fable trailer.

## RED / GREEN

RED (`cd apps/backend && npx jest src/common/utils/ip-hash.util.spec.ts src/modules/website test/permissions/website-door-conformance.spec.ts --maxWorkers=2`):
- 7 new `src` suites failed at import: `Cannot find module './ip-hash.util' | './website-form-catalog' | './website-forms.logic' | './website-form-submit.dto' | '../../../prisma/website-form-seed' | './website-captcha.service' | './website-forms.service' / './website-form-handler'`.
- `website-door-conformance.spec.ts`: `expect(report.public).toBe(2)` → Expected 2, Received 1; the `submitForm` keyOf cell and the X6 cell failed (no route / no header yet). (One intermediate RED run failed instead on a TS2352 cast in my X6 cell — fixed to `as unknown as Record<string, unknown>` before the real RED was observed.)
- Task 2/3/4's seven website suites: PASS (51 tests).

GREEN (same command, `--verbose`): `Test Suites: 15 passed, 15 total · Tests: 107 passed, 107 total`. Per new suite: ip-hash 3, catalog 10, logic 5, dto 6, seed 3, captcha 6, forms service 18; door-conformance 5 (`public` = 2, `decorated` = 5, plus X6).

`npx jest test/permissions --maxWorkers=2`: `Test Suites: 29 passed, 29 total · Tests: 331 passed, 331 total` — `website-conformance.spec` still `errors: []`, `undecorated: []`; `repo-invariants.spec` green (the source census counts `submitForm` under the class-level `@Public()`); `website-door-conformance` green. Note: the FIRST folder run reported 4 suites (`whatsapp-conformance`, `effective-permissions.unit`, `internal-recruitment-conformance`, `marketing-conformance`) as failed-to-run with `Tests: 298 passed, 298 total` (zero failing tests — runner-level, most likely ts-jest first-compile under 2 workers); each passed in isolation and the immediate re-run of the whole folder was fully green. I did not capture the first run's error text.

Typecheck: `npm run type-check --workspace=apps/backend` → clean (exit 0). The backend tsconfig `include`s `prisma/**/*`, so `website-form-seed.ts` and the edited `seed.ts` were typechecked. Additionally loaded `prisma/website-form-seed.ts` through the exact `ts-node.register` options `prisma/seed-runner.js` uses: `rows 10 newsletter.isActive false kinds 7`.

No docker, no Next build, no full suite (per instruction).

## Self-review

- Completeness: catalog covers the ten keys incl. RC5 fraud/careers fields and the `array-of-key` normaliser; captcha service with the three outcomes; dedupe + P2002 replay; row-first ordering (spec pins `create` before `handle`); RC26 `error` in the response (visitor error only, also on replay via `handlerResultJson.visitorError`); dry-run path (row `isTest=true/TEST`, handler `dryRun`, no activity/notify/autoresponder/verified count, no entity pointer); registry + handler contract types exactly as the Produces block; the three shells with the exact exported names/signatures; seed with ten rows and `newsletter.isActive=false`; `abuse.recordVerified` placed after a NEW non-replayed verified non-test row; X6 headers + spec cell; module wiring; conformance `CONTROLLERS` untouched.
- Quality: nothing after the created row may throw — verified by reading every post-row call (`.catch` on notify/abuse/activity/autoresponder; try/catch on the handler and on the row update; `respond()` pure). No PII in logs: new log lines carry formKey, submission id, dropped field NAMES, and error messages only — never a payload value, an IP or the captcha token (the spec asserts the token is not in the created row). No `any`.
- Discipline: worktree only, no `git stash`, no push, no changes outside the brief's file list except the X6 additions the task ordered.
- Testing: pristine GREEN output on the named set, `test/permissions`, and the typecheck.

## Concerns

1. **X6 inheritance for Tasks 8/9**: the X6 cell reads `CONTROLLERS` in `website-door-conformance.spec.ts`. Tasks 8 and 9 add their public controllers to Task 1's `website-conformance.spec.ts` (RC15) — they must ALSO append them to this spec's `CONTROLLERS` (and add `@Header('Cache-Control', 'private, no-store')` to every route) or the check does not cover them. Please relay.
2. **Captcha spec fixture typing** deviates from the brief's printed text in `make()` (two lines + comment) — a compile fix under this repo's `@types/jest`; assertions unchanged.
3. **Transient first-run runner failure** in `test/permissions` (4 suites, 0 failing tests) that did not reproduce; consistent with the machine-memory note. Nothing in this task touches those suites.

---

# Fix round 1 (coordinator review of Task 6)

Commit: `7af0be5` fix(website): forms core hardening — escaped spec bytes, operator captcha codes degrade (X7), honeypot-safe dedupe (X8), fail-open trip check, log hygiene (Opus trailer). Not pushed. Working tree clean.

Verification commands (from `apps/backend`):
- `npx jest src/modules/website test/permissions/website-door-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2` → `Test Suites: 15 passed, 15 total · Tests: 118 passed, 118 total` (was 107 on the same set minus ip-hash plus website-conformance; +8 new cells: catalog 11, captcha 8, forms service 23, logic 5 with two extended cells).
- `npx jest src/common/utils/ip-hash.util.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2` → `2 passed · 20 tests`.
- `npm run type-check --workspace=apps/backend` → exit 0.

Per item:

1. **MUST — raw bytes in the catalog spec.** `apps/backend/src/modules/website/website-form-catalog.spec.ts:68`. Root cause: the harness's Write tool decodes backslash-u escapes into the actual code points, so the two escapes I typed landed as bytes 0x00 and 0x07 (offsets 3720–3721) and git classified the file as binary; the same decoding bit the fix-round commit message on the first attempt ("a NUL byte in commit log message not allowed") and was worked around the same way. Fixed by rewriting the two bytes as the backslash-u escape sequences via a Python edit (no Write tool). Proof: committed blob NUL count = 0; `git ls-files --eol` → `i/lf w/lf`; `git diff --stat f2912e9 HEAD -- <file>` → `130 +++` (text), not `Bin`. (`git diff --stat HEAD~1 HEAD` still prints `Bin` because the PARENT side is binary — unavoidable.) All 22 files of the Task 6 diff were scanned for control bytes; only this one had any. Covering test: the existing `strips control characters but keeps newlines in a message` cell still passes.
2. **Dropped-fields debug line.** `website-forms.service.ts:191` via `droppedForLog()` (~line 121): first 10 names, each `slice(0, 40)`, `(+N more)` suffix. Covering test: `website-forms.service.spec.ts:385` `log hygiene: …` (14 junk keys of 66 chars → exactly 10 names ≤ 40 chars + `(+4 more)`; spied through `Logger.prototype.debug`).
3. **Failed update log.** `website-forms.service.ts:360` via `errorLabel()` (~line 127): `constructor.name` + `code` (string/number) only, never `message`. Covering test: same cell — a rejected update whose message carries `SECRET-DETAIL` and `a@b.co` with `code: 'P2009'` → the warn line contains `Error P2009` and neither string.
4. **UA header raw.** `website-forms.logic.ts:71-80`: new `raw()` takes the header as sent (first element of an array header, trimmed, no comma split), then `slice(0, 500)`. Covering test: `website-forms.logic.spec.ts` "visitor UA" cell extended (line 55) with a Chrome UA containing `(KHTML, like Gecko)` intact, padded whitespace trimmed, array header, and a whitespace-only forwarded header falling through to `user-agent`.
5. **Fail-open trip check.** `website-forms.service.ts:177` calls a private `isTripped()` (line 427) = `try { return await this.abuse.isTripped(formKey) } catch { warn; return false }`. Deviation from the literal `.catch(() => false)`: same semantics, plus containment of a synchronous throw (item 9's rationale) and a WARN so an operator can see the check is blind. The abuse shell's contract comment is untouched. Covering test: `website-forms.service.spec.ts:350` `the trip check fails OPEN …` (rejecting `isTripped` → HANDLED, one row).
6. **X8 honeypot-safe dedupe.** `website-forms.logic.ts:13` `RequestHashInput.honeypot: boolean` hashed in `requestHashFor`; `website-forms.service.ts:196,203` compute `honeypot` once and pass it into the hash (the SPAM branch reuses the same boolean). Covering tests: `website-forms.logic.spec.ts:19` (honeypot flips the hash); `website-forms.service.spec.ts:313` `X8: …` — a stateful `create`/`findUnique`/`update` double enforcing the unique triple: honeypot submission → `sub1` SPAM; identical honest submission → `sub2` HANDLED (two creates, different `requestHash`, handler once); the honest text a third time → replay of `sub2`, not of the SPAM row.
7. **X7 captcha codes.** `website-captcha.service.ts:5` exports `WebsiteCaptchaDegradedReason = 'secretMissing' | 'secretInvalid' | 'httpError' | 'unreachable'` (the verdict's `reason` now uses it); lines 23-24 `SECRET_CODES` / `SERVICE_CODES`; lines 85-94 classify `success: false` by `error-codes` before calling it `failed`; doc comment rewritten (a mis-pasted secret must raise the alarm, never silently 403 every lead). Covering tests: `website-captcha.service.spec.ts:57` (`invalid-input-secret`, and `missing-input-secret` mixed with a visitor code → `secretInvalid`) and `:64` (`internal-error` / `bad-request` → `httpError`; `invalid-input-response`, `timeout-or-duplicate`, `missing-input-response`, an unknown code, and no codes at all → `failed`). Note for Task 10: `detail` receives `secretInvalid` as a fourth reason string.
8. **Activity details whitelist.** `website-forms.service.ts:105` `ACTIVITY_DETAIL_KEYS` (inquiryNumber, assignedAgentId, alreadyReceived, skipNotification, skipAutoresponder, visitorError, createdEntityType, createdEntityId) + `activityDetailOf()`; used at line 377. Covering test: `website-forms.service.spec.ts:368` — a handler detail carrying `contactName`, `email`, `note` → the HANDLED event's `details` equals exactly `{ formKey, kind, rerun, inquiryNumber, assignedAgentId, alreadyReceived }` and matches none of the PII strings, while `notify.formReceived` still receives the name.
9. **try/catch everywhere after the row.** `website-forms.service.ts` — no `.catch(` left in the file (grep); `submit()` post-row block (lines ~233-262) and `runHandler()` post-steps (lines ~365-415) are all `try { await … } catch (err) { warn }`. Covering test: `website-forms.service.spec.ts:358` `a collaborator that throws SYNCHRONOUSLY …` (non-async `mockImplementation` throwing on recordVerified, activity.log, formReceived, autoresponder.send → still HANDLED); the original rejected-promise cell still passes.
10. **`Object.hasOwn`.** `website-form-catalog.ts:240`. Covering test: `website-form-catalog.spec.ts:72` (`constructor` / `toString` as payload keys are reported in `dropped`, not matched through the prototype chain).

Self-review of the round: no new log line carries a payload value, an IP or a token; `Object.hasOwn` is in the ES2022 lib the backend targets (typecheck clean, Node 20 at runtime); the forms-service constructor and every exported name/signature Task 7/10 depend on are unchanged; `RequestHashInput` gained a required `honeypot` field — Task 7's re-run must not recompute the hash (it reads the stored row), so nothing downstream is affected.
