# Task 8 report — CAREERS_APPLY through the exported `CareersPublicService`; FRAUD_REPORT with the one evidence upload route and key-only, hardened read-back

Worktree: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`, base `aecda30` (Task 7's head). Not pushed.

| Commit | Subject |
|---|---|
| `86d0f0e` | feat(website): CAREERS_APPLY files through the exported CareersPublicService (WP3a, P4/P5) — Part A |
| `ff39d3a` | feat(website): FRAUD_REPORT with the one evidence upload route and key-only, hardened read-back (WP3a, P4, RC3) — Part B |

Trailer on both: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` (the task instruction; the brief's `Fable 5.1` trailer was superseded).

## What was implemented

### Part A — CAREERS_APPLY (commit `86d0f0e`)

- `apps/backend/src/modules/careers-public/careers-public.module.ts` — `exports: []` → `exports: [CareersPublicService]` with the brief's comment (P4, one-way edge). Nothing else in the file changed; careers-public still imports nothing from `website/` (pinned by the wiring spec).
- `apps/backend/src/modules/website/handlers/careers-apply.logic.ts` — `WEBSITE_CAREERS_SOURCE_DETAIL`, `WEBSITE_CV_KEY_PATTERN`, `DROPPABLE_APPLY_FIELDS`, `buildPublicApplyDto()` (`plainToInstance(PublicApplyDto, …)` so `@Trim()` / `@Type(() => Number)` run; currency uppercased; scheme-less LinkedIn URL gets `https://`; `source: CAREERS_PAGE`, `sourceDetail: jobsadmire.com`), `validatePublicApplyDto()` (class-validator with `whitelist: true`; droppable optional fields that fail are deleted and listed in `dropped`, a second pass yields the remaining `errors`).
- `apps/backend/src/modules/website/handlers/careers-apply.handler.ts` — `CareersApplyHandler` (`kinds = [CAREERS_APPLY]`, self-registers). Defensive `openingSlug`/`cvKey` re-check (FAILED, never a throw); `cvUrl` rebuilt with `UploadService.buildPublicUrl(cvKey)` (P5: the key from the EXISTING public `POST /api/careers/upload-cv`); dry run returns before validation/write (P2); DTO errors → `{ ok: false }` (hand-edited row only — the catalog requires every required field on a live submission); success → `createdEntityType: 'applicant'` + `trackingToken`/`statusUrl`/`dropped` + `skipNotification: true, skipAutoresponder: true` + `contactName`/`email` (RC25 — careers-public already mails candidate and hiring owner); `ConflictException` → `ok: true, alreadyReceived: true, existingTrackingToken` + the same skip flags (HANDLED, no entity, no second notice); any other `HttpException` with status < 500 → `{ ok: false, error: <apply()'s message>, detail: { visitorError: true, rejectedBy: 'careers-public', statusCode } }` (RC26); everything else propagates (infrastructure → FAILED + alarm).
- `apps/backend/src/modules/website/website.module.ts` — three imports; `imports:` gains `CareersPublicModule, UploadModule` with the brief's comment; `CareersApplyHandler` appended to `providers` after `WebsiteFormsInboxService`. `controllers`/`exports`/the `registry.register({` literal untouched.
- Specs: `careers-apply.logic.spec.ts` (5), `careers-apply.handler.spec.ts` (9) — verbatim from the brief.

### Part B — FRAUD_REPORT (commit `ff39d3a`)

- `apps/backend/src/modules/website/fraud-evidence-file.ts` — `MAX_FRAUD_EVIDENCE_BYTES` (8 MiB), `MAX_FRAUD_EVIDENCE_FILES` (3), `FRAUD_EVIDENCE_FOLDER`/`_KEY_PREFIX`/`_KEY_PATTERN`, `validateFraudEvidenceFile()` (magic-byte sniff for JPEG `FF D8 FF`, PNG 8-byte signature, WEBP `RIFF….WEBP`, PDF `%PDF-`; rejects missing/empty, oversize, and anything unsniffed BEFORE any store; the client `mimetype` is never read; 400 codes `FRAUD_EVIDENCE_MISSING | FRAUD_EVIDENCE_TOO_LARGE | FRAUD_EVIDENCE_TYPE`), `pickEvidenceKeys()` (never throws; prefix-locked by pattern AND `startsWith`, deduped, capped at 3, bare string tolerated), `mimeFromEvidenceKey()`.
- `apps/backend/src/modules/website/website-fraud-evidence.service.ts` — `WebsiteFraudEvidenceService(prisma, upload)`: `store(file, tokenClass)` (sniff → test class returns `{ key: null, …, dryRun: true }` without writing; otherwise `uploadFile(buffer, 'evidence<ext>', <sniffed mime>, 'website-fraud')` and returns `{ key, mimeType, sizeBytes, dryRun: false }` — `UploadResult.url` is never returned), `static evidenceKeysOf(payloadJson)` (reads `payloadJson.fields.evidenceKeys` through `pickEvidenceKeys`; Task 10's purge list), private `resolve()` (`findFirst({ where: { id, form: { kind: FRAUD_REPORT } }, select: { id, payloadJson } })` → 404 on unknown id / non-fraud row / index past the last key), `view()` (streams with `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store`, and for pdf/jpeg/png/webp `Content-Type: <from key extension>`, `CSP default-src 'none'`, `Content-Disposition: inline; filename*=UTF-8''<key basename>`; otherwise octet-stream + `CSP default-src 'none'; sandbox` + attachment — the `ApplicantDocumentsService.view` header set), `link()` (`presignedGetUrl(key)` with its 15-minute default → `{ data: { url, fileName } }`).
- `apps/backend/src/modules/website/handlers/fraud-report.handler.ts` — `FraudReportHandler` (`kinds = [FRAUD_REPORT]`, self-registers, constructor `(registry)`): no entity, the submission row is the record; `detail = { evidenceCount, evidenceKeys (prefix-locked KEYS only), hasReporterContact, contactName, email, skipNotification: false, skipAutoresponder: email === null }`; dry run `{ dryRun: true, wouldCreate: 'fraud-report', evidenceCount }`.
- `apps/backend/src/modules/website/website-public-uploads.controller.ts` — `WebsitePublicUploadsController` at `website/v1/uploads`, class-level `@Public()` + `@UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)` (that order), `POST fraud-evidence` with `FileInterceptor('file', { limits: { fileSize: 8 MiB, files: 1 } })` (multer 413 above the cap), `@Throttle` as on careers-public's upload routes, `@TokenClass()`, and **X6** `@Header('Cache-Control', 'private, no-store')` with a doc-comment paragraph saying why.
- `apps/backend/src/modules/website/website-forms-evidence.controller.ts` — `WebsiteFormsEvidenceController` at `website/forms` (so the full paths are `GET /api/website/forms/submissions/:id/evidence/:index/view` and `…/link`, in Task 7's inbox family — RC23), both `@RequirePermission('website.forms', 'VIEW')`, `ParseIntPipe` on `:index`, `@Res()` on `view`. `link` additionally carries `@Header('Cache-Control', 'private, no-store')` (see "differences").
- `website.module.ts` — four imports; `WebsitePublicUploadsController, WebsiteFormsEvidenceController` after `WebsiteFormsInboxController`; `FraudReportHandler, WebsiteFraudEvidenceService` after `CareersApplyHandler`. The final decorator is byte-for-byte the brief's Step 8.6 block.
- `apps/backend/test/permissions/website-conformance.spec.ts` (Task 1) — two imports; `CONTROLLERS` now `[…, WebsitePublicUploadsController, WebsiteFormsEvidenceController]` (RC15).
- `apps/backend/test/permissions/website-door-conformance.spec.ts` (Task 4) — X6 carry-over ordered by the task: import + `CONTROLLERS` gains `WebsitePublicUploadsController`; `report.public` 2 → 3 (`decorated` stays 5 — the evidence controller is NOT public and is not in this list); the X6 `seen` assertion pins `WebsitePublicUploadsController.uploadFraudEvidence`. A doc-comment line records why Task 8's controller sits in this list.
- Specs: `fraud-evidence-file.spec.ts` (5), `fraud-report.handler.spec.ts` (5), `website-fraud-evidence.service.spec.ts` (8), `careers-fraud-wiring.spec.ts` (5) — verbatim from the brief.

NOT modified (as the brief requires): `website-forms.service.ts` (handlers self-register through the registry), `website-inbox-conformance.spec.ts` (it scans only Task 7's inbox controller; the evidence controller's keys are pinned by the wiring spec instead), the `registry.register({` literal.

## Interface differences vs the brief and how they were resolved

1. **Commit trailer** — task instruction (`Claude Opus 5 (1M context)`) overrides the brief's `Claude Fable 5.1`. Used the task's.
2. **X6 (not in the brief's code)** — the task ordered `@Header('Cache-Control', 'private, no-store')` on every public route and the uploads controller appended to `website-door-conformance.spec.ts`. Done: header on `uploadFraudEvidence`, controller in both CONTROLLERS lists, `public` count 2 → 3, `seen` list extended. The evidence controller was NOT added to the door spec (not public; it would not change `decorated` either way but the file's contract is "public door + integrations screen").
3. **`Content-Disposition` filename on `view`** — the task's note illustrated `inline; filename="evidence-<index>"`; the brief's code (and its `link()` spec, which pins `fileName: 'a.png'` = the key basename) uses `filename*=UTF-8''<key basename>`. The key basename is `<uuid>.<sniffed ext>`, minted by `UploadService.uploadFile` from the server-chosen name `evidence<ext>` — nothing visitor-supplied ever reaches it. Followed the brief (verbatim code + a passing spec); the invariant "no visitor-supplied filename" holds.
4. **`@Header('Cache-Control', 'private, no-store')` on `link`** — a one-line addition beyond the brief's controller: the JSON body is a 15-minute presigned URL (a bearer credential) and must not sit in a shared cache; `view` sets the same header on the response inside the service. Documented in the controller's doc comment. Easy to drop if the reviewer prefers the brief verbatim.
5. **Boot check** — the brief's Step 9 docker boot + DI-log grep was not run (the task says no docker). The DI edge is pinned at source level by `careers-fraud-wiring.spec.ts`, and I verified by reading: `CareersPublicService` (exported by the imported `CareersPublicModule`), `UploadService` (exported by the imported `UploadModule`), `PrismaService` (global), `WebsiteFormHandlerRegistry` (local) resolve every new constructor; no module under careers-public / upload / notifications / IR / ai-interviewer / hrm imports `website/` (no cycle); `AppModule` imports `CareersPublicModule`, `UploadModule` and `WebsiteModule`, so Nest instantiates each once and duplicates no route; `FileInterceptor` without `storage` uses multer's default memory storage (the same way careers-public's `uploadCv` works in production). See Concerns.
6. **Anchors** — every quoted anchor in the brief matched the Task 7 tree verbatim (`imports: [ConfigModule, PrismaModule, PermissionsModule, SalesModule],`, `    WebsiteFormsInboxService,`, `    WebsiteFormsInboxController,`, `const CONTROLLERS = [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController, WebsiteFormsInboxController];`, `import { WebsiteFormsInboxController } from …`). No grep-and-report was needed.

## RED → GREEN

### Part A

RED (`cd apps/backend && npx jest src/modules/website/handlers/careers-apply --maxWorkers=2`):
```
FAIL src/modules/website/handlers/careers-apply.handler.spec.ts — TS2307: Cannot find module './careers-apply.handler' / './careers-apply.logic'
FAIL src/modules/website/handlers/careers-apply.logic.spec.ts — TS2307: Cannot find module './careers-apply.logic'
Test Suites: 2 failed, 2 total · Tests: 0 total
```
GREEN (same command, `--verbose`): `careers-apply.logic.spec.ts` 5 ✓, `careers-apply.handler.spec.ts` 9 ✓ — `Test Suites: 2 passed · Tests: 14 passed`.

Full Part A run (`npx jest src/modules/website src/modules/careers-public test/permissions/website-conformance.spec.ts test/permissions/website-door-conformance.spec.ts test/permissions/website-inbox-conformance.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2`): `Test Suites: 28 passed, 28 total · Tests: 239 passed, 239 total` (careers-public's `identity-card-upload`, `careers-retention.cron`, `candidate-identity`, `candidate-otp` unchanged and green).

Typecheck (`npx tsc --noEmit -p tsconfig.json`, alone): exit 0.

### Part B

RED (`npx jest src/modules/website/fraud-evidence-file.spec.ts src/modules/website/website-fraud-evidence.service.spec.ts src/modules/website/handlers/fraud-report src/modules/website/careers-fraud-wiring.spec.ts --maxWorkers=2`):
```
FAIL fraud-evidence-file.spec.ts — TS2307 './fraud-evidence-file'
FAIL website-fraud-evidence.service.spec.ts — TS2307 './website-fraud-evidence.service'
FAIL careers-fraud-wiring.spec.ts — TS2307 './website-forms-evidence.controller', './website-public-uploads.controller'
FAIL handlers/fraud-report.handler.spec.ts — TS2307 './fraud-report.handler'
Test Suites: 4 failed, 4 total · Tests: 0 total
```
GREEN (same command, `--verbose`): `fraud-report.handler` 5 ✓, `fraud-evidence-file` 5 ✓, `website-fraud-evidence.service` 8 ✓, `careers-fraud-wiring` 5 ✓ — `Test Suites: 4 passed · Tests: 23 passed`.

Full Part B run (same six-target command as Part A): `Test Suites: 32 passed, 32 total · Tests: 262 passed, 262 total` — website-conformance green with six controllers scanned (`errors: []`, `undecorated: []`); website-door-conformance green with `public: 3`, `decorated: 5`, X6 cell seeing `WebsitePublicUploadsController.uploadFraudEvidence`; website-inbox-conformance unchanged and green; repo-invariants green (route census: 0 undecorated, every verb accounted for once — the class-level `@Public()` on the uploads controller and the two `@RequirePermission` evidence routes counted correctly; catalog hash untouched, no new key).

Typecheck (alone): exit 0.

## Conformance / invariants summary

- Boot conformance stays at 0 undecorated: `uploadFraudEvidence` is public via class-level `@Public()` (`getAllAndOverride([handler, class])`); `view`/`link` are `website.forms:VIEW`, a registered key at a supported action.
- Both new controllers are in Task 1's `website-conformance.spec.ts` CONTROLLERS; the public one is also in Task 4's `website-door-conformance.spec.ts` (X6 coverage).
- Wiring pins (`careers-fraud-wiring.spec.ts`): the `exports` edge, the module `imports`/`providers`, no re-provision of `CareersPublicService`, one-way import direction, the guard chain order, no permission metadata on the upload route, VIEW on both read-back routes.

## Self-review

- **Completeness**: export edge ✓; careers handler with RC25 skip flags, RC26 `visitorError` mapping, 409 → `alreadyReceived` ✓; fraud upload route with sniff / size / one-file-per-call / `website-fraud/` prefix / test-class dry run ✓; fraud handler persists keys only (in `detail`, and the row's `payloadJson.fields.evidenceKeys` from the catalog) ✓; evidence read-back with nosniff + no-store + CSP + inline/attachment split + presigned `link` ✓; both module halves ✓; conformance lists in both specs ✓; six unit specs ✓.
- **Quality**: no raw object URL is ever returned to the website or the inbox (`store` returns the key; `link` returns a presigned URL; the only `buildPublicUrl` call feeds `apply()` internally, as the public careers form does). No PII in log lines (submission id, applicant id, slug, dropped field NAMES, mime/bytes/key only). Visitor-safe error text is echoed only on the `visitorError` path (apply()'s own visitor-facing messages); the DTO-validation `{ ok: false }` (hand-edited row only) has no `visitorError`, so the core alarms and returns `error: null`.
- **Discipline**: worktree only; no `git stash`; no push; no file outside the brief's list except the X6 change to `website-door-conformance.spec.ts` the task ordered; two commits split exactly as the brief (commit 1 contains no fraud file and compiles on its own — its module block was printed and matches Step 3.4; commit 2's matches Step 8.6).
- **Testing**: one jest invocation at a time with `--maxWorkers=2`; `tsc` alone; no docker, no Next build, no full suite. Tree clean after both commits.

## Concerns

1. **Boot-time DI proof deferred** (the brief's Step 9 docker check; the task said no docker). Reasoned through and source-pinned as described above, but the real proof that `Nest can't resolve dependencies of CareersApplyHandler` never appears is the container boot — Task 13's gate (or the reviewer's stack) should run `docker compose up -d --build backend` and grep the log for `can't resolve dependencies|registered twice` once.
2. **`@Header` on `link`** is one line beyond the brief's verbatim controller (rationale above); trivial to revert if the reviewer wants the brief exactly.
3. **`view` `Content-Disposition` filename** is the key basename (`<uuid>.<ext>`), not `evidence-<index>` as the task note illustrated; the brief's spec pins the basename shape for `link` and the invariant (no visitor-supplied name) holds. Task 11's detail panel can label the row `Evidence 1/2/3` itself.
4. **Multer 413 vs 400** — above 8 MiB multer's `LIMIT_FILE_SIZE` surfaces as Nest's 413 before `validateFraudEvidenceFile` runs; the service's `FRAUD_EVIDENCE_TOO_LARGE` 400 is belt-and-braces (only reachable if the interceptor limit is ever loosened). Task 12 should document the 413 (the brief already says "413 from multer above 8 MiB").

## Fix round 1 (review findings; commit `86e7320`)

`fix(website): careers tracking token never leaves the handler (X11); evidence 404 on missing object; multipart fields capped` — Opus trailer, not pushed. Six files, all inside Task 8's own set.

1. **Ruling X11 — `handlers/careers-apply.handler.ts`.** `trackingToken` and `statusUrl` removed from the success `detail`; `existingTrackingToken` removed from the 409 `alreadyReceived` `detail` (the 409 body is no longer read at all). Kept: `createdEntityType: 'applicant'`, `createdEntityId`, `dropped`, `alreadyReceived`, `skipNotification`, `skipAutoresponder`, `contactName`, `email`. A doc-comment paragraph records why (the token alone authorises `careers/status/:token/*`; `detail` becomes `handlerResultJson`, read by every `website.forms` VIEW holder). `careers-apply.handler.spec.ts`: the two `toEqual` assertions updated; negative assertions added — `JSON.stringify(result)` contains neither `tok_1` nor `/careers/status/` on success, nor `tok_old` on the 409 path.
2. **`website-fraud-evidence.service.ts` — missing object → 404.** New `isMissingObjectError(err)` (`code` or `name` in `{ NoSuchKey, NotFound }`) and a private `fromStorage(key, op)` wrapper used by `view` (`getFileBuffer`) and `link` (`presignedGetUrl`); a hit logs a warning with the key only and throws `NotFoundException('Evidence not found')`; any other storage error propagates unchanged. `statObject` is not used. Two spec cells: `view()` maps `code: 'NoSuchKey'` to 404 without calling `res.end`, and a `code: 'ECONNREFUSED'` error still propagates; `link()` maps both `name: 'NotFound'` and `code: 'NotFound'` to 404.
3. **`website-public-uploads.controller.ts` — `fields: 0`.** `FileInterceptor('file', { limits: { fileSize: MAX_FRAUD_EVIDENCE_BYTES, files: 1, fields: 0 } })` with a comment (any stray text part → multer `LIMIT_FIELD_COUNT` → 400 before parsing). The options live in the interceptor mixin's closure and are not reachable through metadata, so the assertion is the source-level pin (identity-card-upload idiom) added to `careers-fraud-wiring.spec.ts`: it extracts the `limits: { … }` literal of the `FileInterceptor('file', …)` call and asserts `fileSize: MAX_FRAUD_EVIDENCE_BYTES`, `files: 1`, `fields: 0`.

Verification (from `apps/backend`): `npx jest src/modules/website test/permissions/website-door-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2` → `Test Suites: 26 passed, 26 total · Tests: 187 passed, 187 total` (was 184 in that selection before the round: +2 evidence cells, +1 wiring cell). `npx tsc --noEmit -p tsconfig.json` → exit 0. Tree clean after the commit.

Note for Task 13: the first folder run of this command reported `careers-apply.handler.spec.ts` as "Test suite failed to run" with no diagnostic and zero test bodies; the suite is green alone (9/9) and the identical command re-run was fully green (26/187). This is the runner-level flake Task 6's report recorded ("green on re-run; watch in Task 13"), not a code failure.
