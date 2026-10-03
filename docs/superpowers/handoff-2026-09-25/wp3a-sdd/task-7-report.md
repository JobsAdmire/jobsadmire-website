# Task 7 report — Sales-bound handler + forms inbox API + idempotent re-run

Branch `website/wp3a-intake`, worktree `jobsadmire-operations-website`, base 7af0be5 (Task 6 final). Three local commits, not pushed.

## Commits

| SHA | Subject |
|---|---|
| 72d11da | feat(website): INQUIRY, CALLBACK, VISIT and CALCULATOR_QUOTE file a Sales inquiry as system:website (WP3a, P4) |
| 9a7452e | feat(website): idempotent re-run of a failed submission (WP3a, P8) |
| 6521910 | feat(website): forms inbox API — list, detail, audited export and re-run on website.forms (WP3a, P3) |

Trailer on all three: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` (the parent instruction's trailer, overriding the brief's Fable line).

## What was implemented (all verbatim from the brief)

Commit 1 — `apps/backend/src/modules/website/handlers/`
- `website-inquiry.logic.ts` — `buildWebsiteInquiryDto(input, now?)`: typed `CreateInquiryDto` (no casts), `WEBSITE_FORM` source, `contactName` via the RC32 `one()` narrower (`Array.isArray` guard → first non-empty value), ISO-2 country as the catalog delivers it, E.164 phone through `normalizeE164` with as-typed fallback, `language = locale`, `[website:<formKey>]`-tagged `messagePreview` of the non-identity fields (arrays comma-joined), notes with submission id / locale / consent version / captcha-degraded flag; `messagePreview` capped 5000, `notes` 2000. Classification: `iAm` selector map → per-form default (`hire`/`workers` → DIRECT_EMPLOYER, `partner` → SOURCING_PARTNER, `contact` → none) for INQUIRY only; CALLBACK/VISIT/CALCULATOR_QUOTE unclassified (P4).
- `website-inquiry.handler.ts` — `WEBSITE_SYSTEM_USER` (`system:website`, `roleSlug: 'system'`, the `wa-ai-tools.service.ts` precedent) and `WebsiteInquiryHandler` (`@Injectable`, self-registers for the four kinds, files through `InquiryService.create` only, dry run returns before the write with `{ dryRun, wouldCreate: 'inquiry', classification, contactName, email }`, success returns `createdEntityType: 'inquiry'`, `createdEntityId`, and `detail { inquiryNumber, assignedAgentId, assignmentMode, classification, contactName, email }`). Sales throws propagate (core → FAILED + alarm). RC26 `visitorError` deliberately NOT used. Log line carries identifiers only.
- Both specs.

Commit 2
- `dto/query-website-submissions.dto.ts` — `page` (≥1, default 1), `limit` (1–100, default 20), `search` (≤200), `formKey` (`@IsIn([...WEBSITE_FORM_KEYS])`, RC31 spread), `status` (`@IsEnum(WebsiteSubmissionStatus)`), `needsAttention: 'true'`, `isTest: 'true'|'false'`, `from`/`to` (`@IsDateString`).
- `website-forms-inbox.logic.ts` — `WebsiteInboxRow` / `WebsiteInboxDetail` / `WebsiteSubmissionWithKind`, `toInboxRow`, `toInboxDetail` (never the hashes / hour bucket; detail adds `tokenClass`, `handlerResultJson`, `userAgent`, `updatedAt`), `buildSubmissionWhere` (column filters; `createdAt` bounds with date-only `to` = `lt` next UTC midnight; needs-attention `OR` and search `OR` both pushed under `where.AND`, never assigned to `where.OR`; RC24 e-mail paths lowercased, others case-sensitive; fraud `reporter*` paths included), `INBOX_DEFAULT_LIMIT = 20`, `INBOX_MAX_LIMIT = 100`.
- `website-forms.service.ts` — three anchored edits exactly as the brief: `ConflictException` added to the `@nestjs/common` import; two imports after the `PrismaService` line; `rerun(id, actor)` inserted immediately before `  protected async runHandler(`. 404 unknown; 409 unless `status === FAILED && createdEntityId === null`; 409 with `{ message, errors }` when the stored `payloadJson.fields` no longer passes `normalizeWebsiteFields`; then `this.runHandler(bare, form, fields, { visitorIp: null, userAgent }, { dryRun: row.isTest, rerun: true, actorId: actor.userId })` — the core appends attempt N+1 and applies notify/autoresponder/alarm rules unchanged; returns `{ data: toInboxDetail(...) }`. `submit()`, `runHandler()` and the constructor untouched.
- `website-forms.rerun.spec.ts`, `website-forms-inbox.logic.spec.ts`.

Commit 3
- `website-forms-inbox.service.ts` — `WebsiteFormsInboxService(prisma)`: `list(q)` (newest first, `include: { form: { select: { kind: true } } }`, limit capped at 100, `{ data, meta: { total, page, limit, totalPages } }`) and `get(id)` (404 unknown).
- `website-forms-inbox.controller.ts` — `@ApiBearerAuth() @Controller('website/forms/submissions')`: `GET` list (`website.forms` VIEW), `GET export` (`website.forms` EXPORT + `@AuditEntity('WebsiteFormSubmission')`, declared before `:id`, same query + paged shape as the list for the frontend's `ExportCsvButton`), `GET :id` (VIEW), `POST :id/rerun` (EDIT + `@AuditEntity`, `@HttpCode(200)`, `@CurrentUser()` → `forms.rerun`).
- `website.module.ts` — four import lines after `import { WebsiteFormsService } …`; the `@Module({...})` block replaced with the brief's final form (`SalesModule` in imports, `WebsiteFormsInboxController` in controllers, `WebsiteInquiryHandler, WebsiteFormsInboxService` appended to providers; exports unchanged). The `registry.register({...})` literal is byte-identical (verified: zero diff lines touch it).
- `test/permissions/website-conformance.spec.ts` — the import line and the single `const CONTROLLERS = […]` line extended with `WebsiteFormsInboxController` (both anchors matched byte-for-byte).
- `test/permissions/website-inbox-conformance.spec.ts` (new) — real scanner over the real controller: `decorated: 4`, `public: 0`, `selfService: 0`, `errors: []`; per-route key + audit pins.
- `website-forms-inbox.service.spec.ts`.

`website-door-conformance.spec.ts` (Task 4's) was NOT touched — the brief says "untouched"; its `decorated: 5` and X6 cell are about Task 4's two controllers / public controllers only, and the inbox controller is neither.

## Interface differences vs the brief

None that affect this task. Verified before writing a line:
- `website-form-handler.ts` exports `WebsiteFormHandler`, `WebsiteFormHandlerInput`, `WebsiteFormHandlerResult`, `WebsiteFormHandlerRegistry` exactly as the brief states; `fields` is `Record<string, WebsiteFieldValue>` with `WebsiteFieldValue = string | string[]` (from `website-form-catalog.ts`) — identical to the brief's `Record<string, string | string[]>`.
- `WebsiteFormsService` constructor is the 8-arg final; `runHandler` is `protected` with the exact signature the brief assumes (`ctx: Pick<WebsiteSubmitContext, 'visitorIp' | 'userAgent'>`, `opts: WebsiteRunHandlerOptions`); `NotFoundException`, `WebsiteSubmissionStatus`, `normalizeWebsiteFields` were already imported.
- Task 6's fix-round changes (activity-detail whitelist in `runHandler`; `WebsiteCaptchaDegradedReason.secretInvalid`) touch nothing this task consumes. The activity whitelist means `contactName`/`email` in my handler's `detail` are stored in `handlerResultJson` but never copied into the timeline — consistent with the brief's intent.
- `CreateInquiryDto.contactName` exists (Task 5); `InquiryService.create(dto, currentUser)` never dereferences `currentUser` and the assignment engine receives only `{ source, country, language, companyName, classification }` — the synthetic actor is safe.
- `SalesModule` exports `InquiryService` and imports only `CrmIntegrationModule` (a leaf); only `AppModule` imports `WebsiteModule` — no cycle.
- Both anchors in `website-conformance.spec.ts` and the `@Module` block in `website.module.ts` matched the brief verbatim.
- The brief's Step 2 says "six red suites"; the command's `src/modules/website/handlers` glob covers two suites, so seven failed — the brief's own list names seven. A counting slip, not a behaviour difference.

## RED

```
cd apps/backend && npx jest src/modules/website/handlers src/modules/website/website-forms.rerun.spec.ts src/modules/website/website-forms-inbox.logic.spec.ts src/modules/website/website-forms-inbox.service.spec.ts test/permissions/website-inbox-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2
```
All seven suites failed at ts-jest compile time, no test body ran, exactly the predicted errors:
- `website-forms.rerun.spec.ts`: `TS2339: Property 'rerun' does not exist on type 'WebsiteFormsService'` (×10; the 8-arg constructor compiled)
- `website-inquiry.logic.spec.ts` / `website-inquiry.handler.spec.ts`: `TS2307: Cannot find module './website-inquiry.logic'` / `'./website-inquiry.handler'`
- `website-forms-inbox.logic.spec.ts` / `website-forms-inbox.service.spec.ts`: `TS2307` on `'./website-forms-inbox.logic'` / `'./website-forms-inbox.service'`
- `website-inbox-conformance.spec.ts` / `website-conformance.spec.ts`: `TS2307: Cannot find module '../../src/modules/website/website-forms-inbox.controller'`
`Test Suites: 7 failed, 7 total · Tests: 0 total`

## GREEN

Incremental: handlers → `2 passed, 11 tests`; rerun + inbox-logic + Task 6's `website-forms.service.spec.ts` → `3 passed, 36 tests`.

Brief's Step 4 command #1:
```
npx jest src/modules/website test/permissions/website-inbox-conformance.spec.ts test/permissions/website-conformance.spec.ts test/permissions/website-door-conformance.spec.ts --maxWorkers=2
→ Test Suites: 21 passed, 21 total · Tests: 148 passed, 148 total
```
(website-inquiry.logic 6, website-inquiry.handler 5, website-forms.rerun 5, website-forms-inbox.logic 8, website-forms-inbox.service 3, website-inbox-conformance 3, website-conformance and website-door-conformance green, every Task 2/3/4/6 suite green.)

Brief's Step 4 command #2:
```
npx jest test/permissions/repo-invariants.spec.ts src/modules/sales/inquiry.walink.spec.ts --maxWorkers=2
→ Test Suites: 2 passed, 2 total · Tests: 23 passed, 23 total
```
Route census: no undecorated route; the four inbox routes counted at `website.forms` VIEW/EXPORT/EDIT (all supported by Task 1's descriptor). Boot conformance stays at 0.

Typecheck (run alone):
```
npm run type-check --workspace=apps/backend → tsc --noEmit, clean
```

Extra, not committed: a scratch spec ran `QueryWebsiteSubmissionsDto` through `new ValidationPipe({ whitelist, forbidNonWhitelisted, transform, transformOptions: { enableImplicitConversion: true } })` (main.ts's exact options, type `'query'`): full query converts (`page`/`limit` → numbers, string enums intact), `{}` → `{ page: 1, limit: 20 }`, and `limit=500`, unknown `formKey`, `isTest=yes`, `needsAttention=false`, bogus `status`, an extra key and a non-date `from` all reject. Scratch file deleted before committing.

Jest runs were one invocation at a time, `--maxWorkers=2`, from `apps/backend`. No docker, no Next build, no full suite.

## Self-review

- Completeness: four kinds on one handler; `WebsiteModule` imports `SalesModule`; inbox controller + service with list / detail / export / rerun; query DTO; CONTROLLERS extended in `website-conformance.spec.ts` and pinned in the new `website-inbox-conformance.spec.ts`; seven specs.
- Quality: handler log line = formKey + submission id + inquiry number only (no name/e-mail); inbox rows never carry `requestHash`/`ipAddressHash`/`hourBucket`; every `OR` under `where.AND`; JSON filters use `path` + `string_contains` with no `mode` (RC24); swagger enums spread (RC31); `Array.isArray` narrowing on every identity field (RC32); rerun idempotent per P8 and re-dispatches notify/autoresponder only via the core's `runHandler` on success (spec pins `formReceived` ×1 / `send` ×1 on success, none on failure or dry run, `handlerFailed` re-alarm on failure).
- Discipline: worktree only, no `cd` to the main checkout, no `git stash`, no push, three commits per the brief's plan, `registry.register` literal untouched, `website-door-conformance.spec.ts` untouched.
- Audit: the interceptor's `extractEntityId` on the export route's `{ data: [...] }` falls through to `'unknown'` (no `:id` param) — the audit row records WHO ran the bulk read, which is what P3 wants; the re-run row carries the submission id from `data.id`.

## Concerns

- None blocking. One inherited behaviour worth stating: if the core's post-handler `prisma.update` fails inside `runHandler` (it catches and warns, by Task 6's "nothing after the row may throw" rule), `rerun` answers with the in-memory merged row (e.g. HANDLED) while the DB row stays FAILED — the same trade-off `submit()` makes; a second re-run would then be allowed, and since the Inquiry already exists it would file twice. That window is the outcome-update failure itself (a DB write failing right after a DB write succeeded), not something this task can close without changing the core.
- Docs (PRD §5.12 inbox routes + re-run rule) are Task 12's per the brief (P13, RC10) — nothing written here.

---

# Fix round 1

Review verdict: compliant except one Important (X9) + two Minor (JSDoc order, X10). One fix commit, not pushed:

| SHA | Subject |
|---|---|
| aecda30 | fix(website): in-flight guard makes re-run safe under concurrent clicks (X9); alarm/activity use errorLabel (X10) |

## Item 1 — IMPORTANT, ruling X9: `rerun()` double-files under two concurrent clicks

- `apps/backend/src/modules/website/website-forms.service.ts:161-168` — `private readonly rerunInFlight = new Set<string>()` on `WebsiteFormsService`, with the required one-paragraph comment: the backend runs as ONE process (CLAUDE.md), so an in-process set closes the window; a cross-process DB claim (`updateMany` conditioned on the status) is the documented follow-up that Task 12 writes into PRD §5.12.
- `website-forms.service.ts:290-316` — `rerun()`: synchronously, BEFORE the first `await`: `if (this.rerunInFlight.has(id)) throw new ConflictException('Re-run already in progress.')`, then `add(id)`; the whole body (`findUnique` → state check → catalog re-normalise → `runHandler` → answer) sits in `try { … } finally { this.rerunInFlight.delete(id) }`, so a refused call (404/409) or a successful one both release the id.
- Covering test: `apps/backend/src/modules/website/website-forms.rerun.spec.ts:155` — `X9: two concurrent re-runs of one row — the second is refused (409) before any read, the handler runs exactly once, and the guard clears afterwards`. The handler's `handle` awaits a deferred gate; `rerun('sub1')` is fired twice without awaiting the first; the second rejects with `ConflictException` / `'Re-run already in progress.'` and `findUnique` has been called once (the second never read the row); the gate is released; the first resolves HANDLED with exactly one `handle` and one `update` call. Two further calls prove the guard is per in-flight call, not a latch: one refused by the row-state check (a different 409) once the row mock reads HANDLED, then — the `finally` having released the id — one that runs (`handle` ×2 total).

## Item 2 — MINOR: `runHandler`'s JSDoc had been orphaned

- `website-forms.service.ts:280-316` (rerun JSDoc + method) now precede `:319-327` (`runHandler`'s JSDoc + signature). The insertion had landed between `runHandler`'s doc block and its signature; the block is now attached to its method again. Pure move, no text change to either JSDoc.

## Item 3 — MINOR, ruling X10: what leaves the process on a thrown handler error

- `website-forms.service.ts:335-365` — in `runHandler`: a new `externalError` string alongside `result`. On a THROWN error the row's `error` (and the attempt record, both stored on the row) keep `err.message` sliced to **500** (was 2000), while `externalError = errorLabel(err)` (Task 6's class + code helper). For the no-handler case and for a handler that RETURNED `{ ok: false, error }`, `externalError = result.error` — those strings are authored by our code (or are the RC26 visitor-safe message), not an echoed exception dump. Reading of the ruling: it names `err`, i.e. the thrown path; the returned-`ok:false` path has no `err` and its string is ours, so it travels unchanged (Task 6's `'mailbox refused'` cell still pins `detail: 'mailbox refused'`).
- `website-forms.service.ts:434` — the WEBSITE_SUBMISSION_FAILED activity `summary` uses `externalError`.
- `website-forms.service.ts:446` — `notify.formsUnavailable({ reason: 'handlerFailed', …, detail: externalError })`.
- Covering tests in Task 6's `apps/backend/src/modules/website/website-forms.service.spec.ts`: the existing throwing-handler cell (`:163`) now asserts the alarm `detail: 'Error'` (`:170-171`); new cell `:179` — `X10: a THROWN error leaves the process as class + code only …`: the handler throws a `Prisma.PrismaClientKnownRequestError` whose message contains the marker `leak@example.com` and is 2000+ chars; asserts the row's `error` equals `message.slice(0, 500)` (length 500, contains the marker — staff-facing), the alarm detail is exactly `'PrismaClientKnownRequestError P2009'` and does NOT contain the marker, the FAILED activity summary contains the label and NOT the marker, and the door response `error` stays `null` (RC26 unchanged).

## Commands + output

```
cd apps/backend && npx jest src/modules/website/website-forms.rerun.spec.ts src/modules/website/website-forms.service.spec.ts --maxWorkers=2
→ Test Suites: 2 passed, 2 total · Tests: 30 passed, 30 total   (rerun 6, service 24)

npx jest src/modules/website test/permissions/website-conformance.spec.ts test/permissions/website-inbox-conformance.spec.ts --maxWorkers=2
→ Test Suites: 20 passed, 20 total · Tests: 145 passed, 145 total

npx jest test/permissions/repo-invariants.spec.ts --maxWorkers=2
→ Test Suites: 1 passed · Tests: 17 passed

npm run type-check --workspace=apps/backend
→ tsc --noEmit, clean
```

Output note: the two `WARN … formReceived failed for sub1: bull down / sync bull` lines in the service-spec run are Task 6's pre-existing "rejecting / synchronously-throwing collaborator" cells logging by design (unchanged by this round); every cell of mine is silent.

## Concerns after the round

- None. The earlier-reported inherited edge (the core swallowing a failed outcome `update` after a successful create) is unchanged in kind, but X9 removes the concurrent-click route to it; only the update-failure route remains, and that is Task 6's documented trade-off.
