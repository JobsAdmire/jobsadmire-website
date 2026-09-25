### Task 7: The Sales-bound handler (INQUIRY, CALLBACK, VISIT, CALCULATOR_QUOTE), the forms inbox API (`website/forms/submissions` list / detail / export) and the idempotent re-run

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations). Runs after Task 6 (forms core) and before Task 8. Scope per RC1: this task owns the four Sales-bound handler kinds AND the admin inbox controller with ALL inbox routes — the list, the detail, the dedicated export and the re-run — under the one path family `website/forms/submissions/*` that Task 11's `lib/api/website.ts` targets. The draft's `website/forms/inbox/:id/rerun` on a `WebsiteFormsAdminController` is gone (check: "Inbox backend paths"); the draft's "list/detail/export land with the inbox UI task" deferral is gone (check: "missing_requirements — backend forms-inbox routes"; Task 11 is frontend-only). Every "Pre-flight … if not, stop / add EDIT if absent" branch is removed (RC1, check: "placeholders — Task 7 Interfaces pre-flights"): `CreateInquiryDto.contactName` exists after Task 5 and `website.forms` supports `VIEW, EDIT, EXPORT` after Task 1 (RC8) — this task states those interfaces and relies on them.

**Files:**
- Create `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts`
- Create `apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts`
- Create `apps/backend/src/modules/website/handlers/website-inquiry.handler.ts`
- Create `apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts`
- Create `apps/backend/src/modules/website/dto/query-website-submissions.dto.ts`
- Create `apps/backend/src/modules/website/website-forms-inbox.logic.ts`
- Create `apps/backend/src/modules/website/website-forms-inbox.logic.spec.ts`
- Create `apps/backend/src/modules/website/website-forms-inbox.service.ts`
- Create `apps/backend/src/modules/website/website-forms-inbox.service.spec.ts`
- Create `apps/backend/src/modules/website/website-forms-inbox.controller.ts`
- Create `apps/backend/src/modules/website/website-forms.rerun.spec.ts`
- Create `apps/backend/test/permissions/website-inbox-conformance.spec.ts`
- Modify `apps/backend/src/modules/website/website-forms.service.ts` (Task 6's file): the `@nestjs/common` import gains `ConflictException`; two import lines are added after the line `import { PrismaService } from '../../prisma/prisma.service';`; the `rerun` method is inserted immediately before the line `  protected async runHandler(` (Task 6's shared handler runner)
- Modify `apps/backend/src/modules/website/website.module.ts` (Task 1's file as Tasks 2, 4 and 6 left it): the import block and the `@Module({...})` decorator only — the constructor's `registry.register({...})` literal is never touched (`registry-from-source.ts` regex-reads it)
- Modify `apps/backend/test/permissions/website-conformance.spec.ts` (Task 1's spec as Task 4 left it): the import lines and the `const CONTROLLERS = […]` line (RC15)
- Test: the seven `*.spec.ts` files above, plus Task 1's `test/permissions/website-conformance.spec.ts`, Task 6's `src/modules/website/website-forms.service.spec.ts` (must stay green — this task adds a method, not a constructor argument), `test/permissions/repo-invariants.spec.ts` (route census) and `src/modules/sales/inquiry.walink.spec.ts` (untouched — no new `InquiryService` dependency)

**Interfaces:**
- Consumes (Task 6 — RC1/RC4/RC6, the forms core), all from `apps/backend/src/modules/website/`:
  - `website-form-handler.ts`: `WebsiteFormHandler { readonly kinds: readonly WebsiteFormKind[]; handle(input: WebsiteFormHandlerInput): Promise<WebsiteFormHandlerResult> }`; `WebsiteFormHandlerInput { submissionId: string; formKey: string; kind: WebsiteFormKind; locale: WebsiteLocale; dryRun: boolean; fields: Record<string, string | string[]>; consentVersion: string; captchaDegraded: boolean; visitorIp: string | null; userAgent: string | null }`; `WebsiteFormHandlerResult = { ok: true; createdEntityType?: 'inquiry' | 'applicant' | 'subscriber' | 'object'; createdEntityId?: string; detail?: Record<string, unknown> } | { ok: false; error: string; detail?: Record<string, unknown> }`; `WebsiteFormHandlerRegistry.register(handler): void` (throws on a kind registered twice) and `.get(kind): WebsiteFormHandler | null`. Handlers self-register in their constructor (RC4). `detail` may carry `inquiryNumber`, `assignedAgentId`, `contactName`, `email`, `alreadyReceived`, `skipNotification`, `skipAutoresponder` for the core (RC4) — this handler fills the first four.
  - `dto/website-form-submit.dto.ts`: `type WebsiteLocale = 'tr' | 'en'`.
  - `website-form-catalog.ts`: `normalizeWebsiteFields(formKey: string, raw: unknown): { ok: true; fields: Record<string, string | string[]>; dropped: string[] } | { ok: false; errors: string[] }` (per-form whitelist; the `array-of-key` type of RC5 is why `fields` values may be arrays).
  - `website-forms.service.ts`: `WebsiteFormsService` with the FINAL constructor `(prisma: PrismaService, config: ConfigService, captcha: WebsiteCaptchaService, registry: WebsiteFormHandlerRegistry, activity: ActivityLogger, notify: WebsiteNotifyService, abuse: WebsiteAbuseService, autoresponder: WebsiteAutoresponderService)` (RC6 — eight arguments; Task 10 implements the last three without touching the constructor); `protected async runHandler(row: WebsiteFormSubmission, form: Pick<WebsiteForm, 'kind'>, fields: Record<string, string | string[]>, ctx: { visitorIp: string | null; userAgent: string | null }, opts: { dryRun: boolean; rerun: boolean; actorId: string }): Promise<WebsiteFormSubmission>` — never throws; appends one `WebsiteAttemptRecord { at; ok; dryRun; rerun; actor; error?; createdEntityType?; createdEntityId?; detail? }` to `handlerResultJson.attempts`; on a successful non-dry-run calls `notify.formReceived({ submissionId, formKey, contactName, inquiryNumber, assignedAgentId })` once and `autoresponder.send({ formKey, locale, to, name, isTest })` once (email/name from `fields`/`detail`), on a failed non-dry-run calls `notify.formsUnavailable({ reason: 'handlerFailed', formKey, submissionId, detail })` unless `detail.visitorError === true` (RC26 — then no alarm, `handlerResultJson.visitorError = true`); logs `ActivityType.WEBSITE_SUBMISSION_HANDLED | WEBSITE_SUBMISSION_FAILED` with actor `{ id: opts.actorId, … }` when `opts.actorId !== 'system:website'`; a dry run never records `createdEntityType/Id`. `export const WEBSITE_SYSTEM_ACTOR: ActivitySystemActor = { id: 'system:website', name: 'Website form', role: 'system' }`. `submit()` is not touched here.
  - `website.module.ts` as Task 6 left it: `imports: [ConfigModule, PrismaModule, PermissionsModule]`; `providers: [WebsiteModuleEnabledGuard, WebsiteApiGuard, WebsiteIntegrationConfigService, WebsitePingService, WebsiteCaptchaService, WebsiteFormHandlerRegistry, WebsiteNotifyService, WebsiteAbuseService, WebsiteAutoresponderService, WebsiteFormsService]` (the three shells are the RC6 constructor dependencies, provided from Task 6 on so the app boots — Task 10 implements them in place, RC20); `exports: [WebsiteIntegrationConfigService]` (Task 6 exports nothing else — handlers live inside the module). `NotificationsModule` is NOT imported yet (Task 9 adds it for the newsletter mails).
- Consumes (Task 10 — mocked only, never imported by production code in this task): `WebsiteNotifyService.formReceived(input: { submissionId: string; formKey: string; contactName?: string | null; inquiryNumber?: string | null; assignedAgentId?: string | null }): Promise<void>` and `.formsUnavailable(input: { reason; formKey?; submissionId?; detail?; … }): Promise<boolean>` (`./website-notify.service`); `WebsiteAbuseService.isTripped(formKey)`, `.recordVerified(formKey, now?)`, `.trippedForms()` (`./website-abuse.service`); `WebsiteAutoresponderService.send(input: { formKey: string; locale?: string | null; to?: string | null; name?: string | null; isTest: boolean }): Promise<boolean>` (`./website-autoresponder.service`). The re-run spec below passes all three as jest mocks (RC6).
- Consumes (Task 5 — RC1): `CreateInquiryDto.contactName?: string` (`@IsOptional() @IsString() @MaxLength(200)`, `apps/backend/src/modules/sales/dto/create-inquiry.dto.ts`) and `InquiryService.create` writing `contactName: dto.contactName`.
- Consumes (Task 3 — RC1): Prisma `WebsiteFormSubmission` (`id, formId, formKey, requestHash, hourBucket, status: WebsiteSubmissionStatus, isTest, tokenClass: WebsiteTokenClass, locale, payloadJson: Json, consentVersion, ipAddressHash, userAgent, captchaPassed, captchaDegraded, handlerResultJson: Json?, createdEntityType, createdEntityId, error, handledAt, purgeAfter, createdAt, updatedAt`, relation `form: WebsiteForm`), `WebsiteForm { id, formKey, kind: WebsiteFormKind, label, isActive }`, enums `WebsiteFormKind { INQUIRY, CAREERS_APPLY, NEWSLETTER, FRAUD_REPORT, CALLBACK, VISIT, CALCULATOR_QUOTE }`, `WebsiteSubmissionStatus { RECEIVED, HANDLED, FAILED, SPAM }`; from `@jobsadmire/constants` (Task 3 owns the form-key constants, RC1): `WEBSITE_FORM_KEYS` (readonly tuple of the ten keys) — used by the query DTO's `@IsIn`.
- Consumes (Task 1 — RC1/RC8): the `website` descriptor with resource `website.forms` at `[PermissionAction.VIEW, PermissionAction.EDIT, PermissionAction.EXPORT]`; `test/permissions/website-conformance.spec.ts` whose CONTROLLERS line, after Task 4, reads `const CONTROLLERS = [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController];`.
- Consumes (Task 4 — RC1): the `@Module({...})` block it wrote (quoted in Step 3.9) and the `website-door-conformance.spec.ts` shape (`keyOf` / `auditOf` helpers over `PERMISSION_KEY` / `AUDIT_ENTITY_KEY`), copied for the inbox.
- Consumes (repo, verified 2026-09-19): `InquiryService.create(dto: CreateInquiryDto, currentUser: AuthenticatedUser): Promise<{ data: Inquiry & { assignedAgent: { id; fullName; email } | null }; meta: { assignmentMode: AssignmentMode } }>` (`src/modules/sales/inquiry.service.ts:51-93` — generates `inquiryNumber`, runs the assignment engine, WhatsApp re-match; never reads `currentUser`); `SalesModule` exports `InquiryService` (`sales.module.ts:54`) and imports only `CrmIntegrationModule` — importing it into `WebsiteModule` creates no cycle (CallCenterModule already imports it); `normalizeE164(raw: string, defaultCountry: 'TR' = 'TR'): string | null` (`src/modules/call-center/logic/phone-normalize.logic.ts:38`); the `I am a…` → `InquiryClassification` map (`src/modules/call-center/call-agent-tools.service.ts:85-90`); `AuthenticatedUser { userId; email; roleId; roleSlug; isImpersonating?; originalUserId? }` (`src/modules/auth/interfaces/authenticated-user.interface.ts`); the synthetic-actor rule — `roleSlug: 'system'` holds zero grants (`src/modules/permissions/effective-permissions.service.ts:94-101`); `RequirePermission(module, action)` / `PERMISSION_KEY` / `RequiredPermission` (`src/modules/permissions/decorators/require-permission.decorator.ts`); `AuditEntity(entityType)` / `AUDIT_ENTITY_KEY` (`src/common/decorators/audit-entity.decorator.ts`) — the interceptor audits any handler carrying it when a staff JWT is present and maps `GET` to `AuditAction.VIEW` (`src/common/interceptors/audit.interceptor.ts:44-68`); `CurrentUser()` (`src/common/decorators/current-user.decorator.ts`); `PermissionConformanceService.scanClasses(controllers, strict)` (`permission-conformance.service.ts:157-241`); `registryFromSource(path)` (`test/permissions/registry-from-source.ts`); `ActivityLogger.log(input)` never throws (`src/modules/activities/activity-logger.service.ts`); the global `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })` (`src/main.ts:58-66`) and prefix `api`; house paging shape `{ data, meta: { total, page, limit, totalPages } }` (`inquiry.service.ts:152-160`); frontend `ExportCsvButton.fetchPage: (page) => Promise<{ data: T[]; meta?: { totalPages?: number } }>` (`apps/frontend/src/components/command/export-csv-button.tsx:28`) — the export route answers that shape, not a CSV; Prisma 5.22 `JsonFilter` supports `path` + `string_contains` and has NO `mode` (`node_modules/.prisma/client/index.d.ts` `JsonFilterBase`), so JSON search is case-sensitive; `@IsIn(['true', 'false'])` query flags (`src/modules/sales-training/dto/assignment.dto.ts:73`).
- Produces (for Tasks 8–13):
  - `WebsiteInquiryHandler` (`handlers/website-inquiry.handler.ts`, `@Injectable()`, registers itself for `INQUIRY, CALLBACK, VISIT, CALCULATOR_QUOTE` — P4) and `WEBSITE_SYSTEM_USER: AuthenticatedUser = { userId: 'system:website', email: 'website@jobsadmire.local', roleId: 'system', roleSlug: 'system' }`; `handle()` returns `{ ok: true, createdEntityType: 'inquiry', createdEntityId, detail: { inquiryNumber, assignedAgentId, assignmentMode, classification, contactName, email } }` or, on a dry run, `{ ok: true, detail: { dryRun: true, wouldCreate: 'inquiry', classification, contactName, email } }`; infrastructure failures propagate as throws (the core records FAILED).
  - `buildWebsiteInquiryDto(input: WebsiteFormHandlerInput, now?: Date): CreateInquiryDto` (`handlers/website-inquiry.logic.ts`) — typed, cast-free: `source: WEBSITE_FORM`, `date`, `contactName`, `companyName`, `email`, `phoneNumber` (E.164 when normalisable, else as typed), `country` (ISO-2 from the catalog), `language` = page locale, `classification` (INQUIRY forms only), `messagePreview` tagged `[website:<formKey>]`, `notes`.
  - `QueryWebsiteSubmissionsDto` (`dto/query-website-submissions.dto.ts`): `page?: number` (≥1, default 1), `limit?: number` (1–100, default 20), `search?: string`, `formKey?: WebsiteFormKey`, `status?: WebsiteSubmissionStatus`, `needsAttention?: 'true'`, `isTest?: 'true' | 'false'`, `from?: string`, `to?: string` (ISO 8601; a date-only `to` is inclusive of that whole UTC day).
  - `website-forms-inbox.logic.ts`: `WebsiteInboxRow { id; formKey; formKind; status; isTest; locale; captchaPassed; captchaDegraded; createdEntityType; createdEntityId; error; handledAt; purgeAfter; consentVersion; payloadJson; createdAt }`, `WebsiteInboxDetail extends WebsiteInboxRow { tokenClass; handlerResultJson; userAgent; updatedAt }`, `buildSubmissionWhere(q: QueryWebsiteSubmissionsDto): Prisma.WebsiteFormSubmissionWhereInput`, `toInboxRow(row)`, `toInboxDetail(row)`, `INBOX_DEFAULT_LIMIT = 20`, `INBOX_MAX_LIMIT = 100`.
  - `WebsiteFormsInboxService(prisma).list(q): Promise<{ data: WebsiteInboxRow[]; meta: { total; page; limit; totalPages } }>` and `.get(id): Promise<{ data: WebsiteInboxDetail }>` (404 when unknown).
  - `WebsiteFormsService.rerun(id: string, actor: AuthenticatedUser): Promise<{ data: WebsiteInboxDetail }>` — 404 unknown id; 409 unless `status = FAILED && createdEntityId IS NULL` (P8) or when the stored payload no longer passes the catalog; a test row re-runs as a dry run (P2); attempt N+1 appended with `rerun: true` and the staff `userId` as actor.
  - `WebsiteFormsInboxController` (`@ApiBearerAuth() @Controller('website/forms/submissions')`), HTTP under the `api` prefix — exactly what Task 11's `websiteFormsApi` calls: `GET /api/website/forms/submissions?page&limit&search&formKey&status&needsAttention&isTest&from&to` (`website.forms` VIEW) → `{ data: WebsiteInboxRow[], meta }`; `GET /api/website/forms/submissions/export` (same query; `website.forms` EXPORT + `@AuditEntity('WebsiteFormSubmission')` — the dedicated export door, P3) → the same paged shape; `GET /api/website/forms/submissions/:id` (`website.forms` VIEW) → `{ data: WebsiteInboxDetail }`; `POST /api/website/forms/submissions/:id/rerun` (`website.forms` EDIT + `@AuditEntity('WebsiteFormSubmission')`, `@HttpCode(200)`) → `{ data: WebsiteInboxDetail }`.
  - `test/permissions/website-conformance.spec.ts` CONTROLLERS now lists `WebsiteFormsInboxController` (Tasks 8 and 9 append theirs after it, RC15).

- [ ] **Step 1: Write the failing tests**

`apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts`:

```ts
// apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts
/**
 * WP3a Task 7 (ruling P4) — the website → CreateInquiryDto mapping is pure and typed:
 * no `as any`, ISO country, E.164 phone, contactName, a formKey-tagged messagePreview,
 * and a classification only for INQUIRY forms (CALLBACK / VISIT / CALCULATOR_QUOTE
 * arrive unclassified — staff classify them).
 */
import { InquiryClassification, InquirySource, WebsiteFormKind } from '@prisma/client';
import { buildWebsiteInquiryDto } from './website-inquiry.logic';
import type { WebsiteFormHandlerInput } from '../website-form-handler';

const input = (over: Partial<WebsiteFormHandlerInput> = {}): WebsiteFormHandlerInput => ({
  submissionId: 'sub1',
  formKey: 'hire',
  kind: WebsiteFormKind.INQUIRY,
  locale: 'tr',
  dryRun: false,
  fields: {
    name: 'Ayşe Yılmaz', company: 'Acme', email: 'ayse@example.com', phone: '0532 123 45 67',
    country: 'TR', headcount: '20', roleNeeded: 'Welder', message: 'ASAP',
  },
  consentVersion: 'privacy-2026-09',
  captchaDegraded: false,
  visitorIp: '203.0.113.9',
  userAgent: 'Safari',
  ...over,
});

describe('buildWebsiteInquiryDto', () => {
  it('hire: WEBSITE_FORM source, contactName, ISO country, E.164 phone, language = locale, DIRECT_EMPLOYER by default', () => {
    const dto = buildWebsiteInquiryDto(input(), new Date('2026-09-19T10:00:00.000Z'));
    expect(dto).toMatchObject({
      source: InquirySource.WEBSITE_FORM,
      date: '2026-09-19T10:00:00.000Z',
      contactName: 'Ayşe Yılmaz',
      companyName: 'Acme',
      email: 'ayse@example.com',
      phoneNumber: '+905321234567',
      country: 'TR',
      language: 'tr',
      classification: InquiryClassification.DIRECT_EMPLOYER,
    });
    expect(dto.messagePreview).toMatch(/^\[website:hire\]\n/);
    expect(dto.messagePreview).toContain('roleNeeded: Welder');
    expect(dto.messagePreview).toContain('headcount: 20');
    expect(dto.messagePreview).not.toContain('ayse@example.com'); // identity fields live in their columns
    expect(dto.notes).toContain('sub1');
    expect(dto.notes).toContain('privacy-2026-09');
  });

  it('the "I am a…" selector wins over the form default; partner defaults to SOURCING_PARTNER; contact has no default', () => {
    expect(buildWebsiteInquiryDto(input({ fields: { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567', iAm: 'hr_agency' } })).classification).toBe(InquiryClassification.HR_AGENCY);
    expect(buildWebsiteInquiryDto(input({ formKey: 'partner', fields: { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567', country: 'PK' } })).classification).toBe(InquiryClassification.SOURCING_PARTNER);
    expect(buildWebsiteInquiryDto(input({ formKey: 'workers', fields: { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567' } })).classification).toBe(InquiryClassification.DIRECT_EMPLOYER);
    expect(buildWebsiteInquiryDto(input({ formKey: 'contact', fields: { name: 'A', email: 'a@b.co', message: 'hi' } })).classification).toBeUndefined();
    expect(buildWebsiteInquiryDto(input({ formKey: 'contact', fields: { name: 'A', email: 'a@b.co', message: 'hi', iAm: 'job_seeker' } })).classification).toBe(InquiryClassification.JOB_SEEKER);
  });

  it('CALLBACK, VISIT, CALCULATOR_QUOTE: classification unset (P4), formKey tag carried, phone normalised', () => {
    const cb = buildWebsiteInquiryDto(input({ formKey: 'callback', kind: WebsiteFormKind.CALLBACK, fields: { name: 'A', phone: '+44 20 7946 0958', preferredTime: 'morning', iAm: 'hr_agency' } }));
    expect(cb.classification).toBeUndefined();
    expect(cb.phoneNumber).toBe('+442079460958');
    expect(cb.messagePreview).toMatch(/^\[website:callback\]\n/);
    expect(cb.messagePreview).toContain('preferredTime: morning');
    expect(buildWebsiteInquiryDto(input({ formKey: 'visit', kind: WebsiteFormKind.VISIT })).classification).toBeUndefined();
    expect(buildWebsiteInquiryDto(input({ formKey: 'calculator', kind: WebsiteFormKind.CALCULATOR_QUOTE })).classification).toBeUndefined();
  });

  it('a phone that cannot be normalised is passed through as typed; a missing phone stays undefined', () => {
    expect(buildWebsiteInquiryDto(input({ fields: { name: 'A', phone: 'ext 4711 only' } })).phoneNumber).toBe('ext 4711 only');
    expect(buildWebsiteInquiryDto(input({ fields: { name: 'A' } })).phoneNumber).toBeUndefined();
  });

  it('an array-valued field (RC5 array-of-key / multi-select) is joined into the preview; an array identity field takes its first value', () => {
    const dto = buildWebsiteInquiryDto(input({ formKey: 'partner', fields: { name: ['A', 'B'], company: 'C', email: 'a@b.co', phone: '05321234567', trades: ['welder', 'fitter'] } }));
    expect(dto.contactName).toBe('A');
    expect(dto.messagePreview).toContain('trades: welder, fitter');
  });

  it('messagePreview is capped at 5000 characters and notes at 2000 (CreateInquiryDto caps are not enforced on a service call)', () => {
    const dto = buildWebsiteInquiryDto(input({ fields: { name: 'A', message: 'x'.repeat(6000) } }));
    expect(dto.messagePreview!.length).toBeLessThanOrEqual(5000);
    expect(dto.notes!.length).toBeLessThanOrEqual(2000);
  });
});
```

`apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts`:

```ts
// apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts
/**
 * WP3a Task 7 (rulings P2, P4, RC4) — the four Sales-bound kinds file THROUGH
 * InquiryService.create with the system:website actor (never prisma.inquiry.create), a
 * dry run writes nothing, and `detail` carries what the core needs for the bell and the
 * autoresponder (inquiryNumber, assignedAgentId, contactName, email).
 */
import { InquiryClassification, InquirySource, WebsiteFormKind } from '@prisma/client';
import { WebsiteInquiryHandler, WEBSITE_SYSTEM_USER } from './website-inquiry.handler';
import { WebsiteFormHandlerRegistry, WebsiteFormHandlerInput } from '../website-form-handler';

function make() {
  const inquiries = {
    create: jest.fn(async (_dto: unknown, _actor: unknown) => ({
      data: { id: 'inq1', inquiryNumber: 'INQ-2026-042', assignedAgentId: 'u9' },
      meta: { assignmentMode: 'RULE_BASED' },
    })),
  };
  const registry = new WebsiteFormHandlerRegistry();
  const handler = new WebsiteInquiryHandler(inquiries as never, registry);
  return { handler, inquiries, registry };
}

const input = (over: Partial<WebsiteFormHandlerInput> = {}): WebsiteFormHandlerInput => ({
  submissionId: 'sub1',
  formKey: 'hire',
  kind: WebsiteFormKind.INQUIRY,
  locale: 'en',
  dryRun: false,
  fields: { name: 'John Doe', company: 'Acme', email: 'john@acme.test', phone: '05321234567', country: 'TR', message: 'hi' },
  consentVersion: 'v1',
  captchaDegraded: false,
  visitorIp: null,
  userAgent: null,
  ...over,
});

describe('WebsiteInquiryHandler', () => {
  it('registers itself for INQUIRY, CALLBACK, VISIT and CALCULATOR_QUOTE and nothing else', () => {
    const { handler, registry } = make();
    for (const k of [WebsiteFormKind.INQUIRY, WebsiteFormKind.CALLBACK, WebsiteFormKind.VISIT, WebsiteFormKind.CALCULATOR_QUOTE]) {
      expect(registry.get(k)).toBe(handler);
    }
    expect(registry.get(WebsiteFormKind.CAREERS_APPLY)).toBeNull();
    expect(registry.get(WebsiteFormKind.NEWSLETTER)).toBeNull();
    expect(registry.get(WebsiteFormKind.FRAUD_REPORT)).toBeNull();
  });

  it('creates the inquiry through InquiryService with the system:website actor and reports the entity + the core facts', async () => {
    const { handler, inquiries } = make();
    const res = await handler.handle(input());
    expect(inquiries.create).toHaveBeenCalledTimes(1);
    const [dto, actor] = inquiries.create.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];
    expect(dto).toMatchObject({
      source: InquirySource.WEBSITE_FORM, contactName: 'John Doe', companyName: 'Acme', email: 'john@acme.test',
      phoneNumber: '+905321234567', country: 'TR', language: 'en', classification: InquiryClassification.DIRECT_EMPLOYER,
    });
    expect(actor).toBe(WEBSITE_SYSTEM_USER);
    expect(WEBSITE_SYSTEM_USER).toEqual({ userId: 'system:website', email: 'website@jobsadmire.local', roleId: 'system', roleSlug: 'system' });
    expect(res).toEqual({
      ok: true,
      createdEntityType: 'inquiry',
      createdEntityId: 'inq1',
      detail: {
        inquiryNumber: 'INQ-2026-042',
        assignedAgentId: 'u9',
        assignmentMode: 'RULE_BASED',
        classification: InquiryClassification.DIRECT_EMPLOYER,
        contactName: 'John Doe',
        email: 'john@acme.test',
      },
    });
  });

  it('dry run (test token, P2): builds the DTO, writes nothing, reports what it would have created', async () => {
    const { handler, inquiries } = make();
    const res = await handler.handle(input({ dryRun: true }));
    expect(inquiries.create).not.toHaveBeenCalled();
    expect(res).toEqual({
      ok: true,
      detail: { dryRun: true, wouldCreate: 'inquiry', classification: InquiryClassification.DIRECT_EMPLOYER, contactName: 'John Doe', email: 'john@acme.test' },
    });
  });

  it('a callback with no e-mail reports email null so the core skips the autoresponder', async () => {
    const { handler } = make();
    const res = await handler.handle(input({ formKey: 'callback', kind: WebsiteFormKind.CALLBACK, fields: { name: 'A', phone: '05321234567' } }));
    expect(res.ok).toBe(true);
    expect(res.detail).toMatchObject({ email: null, contactName: 'A', classification: null });
  });

  it('a Sales failure propagates as a throw — the forms core records it as FAILED and alarms', async () => {
    const { handler, inquiries } = make();
    inquiries.create.mockRejectedValueOnce(new Error('assignment engine down') as never);
    await expect(handler.handle(input())).rejects.toThrow('assignment engine down');
  });
});
```

`apps/backend/src/modules/website/website-forms.rerun.spec.ts`:

```ts
// apps/backend/src/modules/website/website-forms.rerun.spec.ts
/**
 * WP3a Task 7 (rulings P2, P8, RC6) — re-run from the inbox is idempotent: only
 * `status = FAILED && createdEntityId IS NULL` may run again; a re-run appends an attempt
 * with the staff actor, notifies (bell + second human, through WebsiteNotifyService only)
 * and autoresponds ONLY on success, re-alarms on a second failure, and a test row re-runs
 * as a dry run. Built against the FINAL eight-argument constructor (RC6).
 */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WebsiteFormKind, WebsiteSubmissionStatus, WebsiteTokenClass } from '@prisma/client';
import { WebsiteFormsService } from './website-forms.service';
import { WebsiteFormHandlerRegistry, WebsiteFormHandler } from './website-form-handler';

type Args = Record<string, unknown>;

const FORM = { id: 'form-hire', formKey: 'hire', kind: WebsiteFormKind.INQUIRY, label: 'Hire workers', isActive: true };

const FAILED_ROW = {
  id: 'sub1',
  formId: 'form-hire',
  formKey: 'hire',
  requestHash: 'a'.repeat(64),
  hourBucket: 497_000,
  status: WebsiteSubmissionStatus.FAILED,
  isTest: false,
  tokenClass: WebsiteTokenClass.WRITE,
  locale: 'tr',
  payloadJson: { fields: { name: 'Ayşe', company: 'Acme', email: 'a@b.co', phone: '05321234567' } },
  consentVersion: 'v1',
  ipAddressHash: 'b'.repeat(64),
  userAgent: 'Safari',
  captchaPassed: true,
  captchaDegraded: false,
  handlerResultJson: { attempts: [{ at: '2026-09-19T09:00:00.000Z', ok: false, dryRun: false, rerun: false, actor: 'system:website', error: 'down' }] },
  createdEntityType: null,
  createdEntityId: null,
  error: 'down',
  handledAt: null,
  purgeAfter: null,
  createdAt: new Date('2026-09-19T09:00:00.000Z'),
  updatedAt: new Date('2026-09-19T09:00:00.000Z'),
  form: FORM,
};

function make(row: Record<string, unknown> | null = FAILED_ROW, handlerOk = true) {
  const prisma = {
    websiteForm: { findUnique: jest.fn(async () => FORM), create: jest.fn() },
    websiteFormSubmission: {
      findUnique: jest.fn(async (_a: Args) => row),
      update: jest.fn(async (a: Args) => ({ ...(row ?? {}), ...(a.data as object) })),
      create: jest.fn(),
    },
  };
  const registry = new WebsiteFormHandlerRegistry();
  const handler: WebsiteFormHandler = {
    kinds: [WebsiteFormKind.INQUIRY],
    handle: jest.fn(async () =>
      handlerOk
        ? { ok: true as const, createdEntityType: 'inquiry' as const, createdEntityId: 'inq1', detail: { inquiryNumber: 'INQ-2026-042', assignedAgentId: null, contactName: 'Ayşe', email: 'a@b.co' } }
        : { ok: false as const, error: 'still down' },
    ),
  };
  registry.register(handler);
  const config = { get: jest.fn((_k: string, d?: string) => d ?? 'salt') };
  const captcha = { verify: jest.fn(), isConfigured: jest.fn() };
  const activity = { log: jest.fn(async () => undefined) };
  const notify = { formReceived: jest.fn(async () => undefined), formsUnavailable: jest.fn(async () => true) };
  const abuse = { isTripped: jest.fn(async () => false), recordVerified: jest.fn(), trippedForms: jest.fn(async () => []) };
  const autoresponder = { send: jest.fn(async () => true) };
  const svc = new WebsiteFormsService(
    prisma as never, config as never, captcha as never, registry, activity as never, notify as never, abuse as never, autoresponder as never,
  );
  return { svc, prisma, handler, activity, notify, abuse, autoresponder, captcha };
}

const STAFF = { userId: 'u1', email: 'a@b.c', roleId: 'r1', roleSlug: 'admin' };

describe('WebsiteFormsService.rerun', () => {
  it('re-runs a FAILED row with no entity, appends attempt #2 with rerun=true and the staff actor, notifies and autoresponds on success', async () => {
    const { svc, prisma, handler, notify, autoresponder, activity, abuse, captcha } = make();
    const res = await svc.rerun('sub1', STAFF);

    expect(prisma.websiteFormSubmission.findUnique).toHaveBeenCalledWith({ where: { id: 'sub1' }, include: { form: true } });
    const input = (handler.handle as jest.Mock).mock.calls[0][0];
    expect(input).toMatchObject({ submissionId: 'sub1', formKey: 'hire', kind: WebsiteFormKind.INQUIRY, dryRun: false, locale: 'tr', fields: { name: 'Ayşe', email: 'a@b.co' }, visitorIp: null, userAgent: 'Safari' });

    const data = prisma.websiteFormSubmission.update.mock.calls[0][0].data as Record<string, unknown>;
    expect(data.status).toBe(WebsiteSubmissionStatus.HANDLED);
    expect(data.createdEntityType).toBe('inquiry');
    expect(data.createdEntityId).toBe('inq1');
    const attempts = (data.handlerResultJson as { attempts: Record<string, unknown>[] }).attempts;
    expect(attempts).toHaveLength(2);
    expect(attempts[0]).toMatchObject({ ok: false, rerun: false, error: 'down' });
    expect(attempts[1]).toMatchObject({ ok: true, rerun: true, dryRun: false, actor: 'u1', createdEntityId: 'inq1' });

    expect(notify.formReceived).toHaveBeenCalledTimes(1);
    expect(notify.formReceived).toHaveBeenCalledWith(expect.objectContaining({ submissionId: 'sub1', formKey: 'hire', inquiryNumber: 'INQ-2026-042' }));
    expect(notify.formsUnavailable).not.toHaveBeenCalled();
    expect(autoresponder.send).toHaveBeenCalledTimes(1);
    expect(autoresponder.send).toHaveBeenCalledWith(expect.objectContaining({ formKey: 'hire', to: 'a@b.co', isTest: false }));
    expect(activity.log).toHaveBeenCalledWith(expect.objectContaining({ actor: expect.objectContaining({ id: 'u1' }) }));
    // A re-run is not a visit: no captcha, no abuse counting, no trip check.
    expect(captcha.verify).not.toHaveBeenCalled();
    expect(abuse.isTripped).not.toHaveBeenCalled();
    expect(abuse.recordVerified).not.toHaveBeenCalled();

    expect(res.data).toMatchObject({ id: 'sub1', formKey: 'hire', formKind: WebsiteFormKind.INQUIRY, status: WebsiteSubmissionStatus.HANDLED, createdEntityId: 'inq1' });
    expect(res.data.handlerResultJson).toEqual({ attempts });
  });

  it('a failing re-run stays FAILED, records attempt #2, re-alarms handlerFailed, and neither notifies nor autoresponds', async () => {
    const { svc, prisma, notify, autoresponder } = make(FAILED_ROW, false);
    const res = await svc.rerun('sub1', STAFF);
    const data = prisma.websiteFormSubmission.update.mock.calls[0][0].data as Record<string, unknown>;
    expect(data.status).toBe(WebsiteSubmissionStatus.FAILED);
    expect(data.createdEntityId).toBeNull();
    expect((data.handlerResultJson as { attempts: unknown[] }).attempts).toHaveLength(2);
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(notify.formsUnavailable).toHaveBeenCalledWith(expect.objectContaining({ reason: 'handlerFailed', formKey: 'hire' }));
    expect(autoresponder.send).not.toHaveBeenCalled();
    expect(res.data.status).toBe(WebsiteSubmissionStatus.FAILED);
  });

  it('refuses (409) a HANDLED row, a FAILED row that already created an entity, a SPAM row and a RECEIVED row; 404 for unknown ids; the handler never runs', async () => {
    await expect(make({ ...FAILED_ROW, status: WebsiteSubmissionStatus.HANDLED, createdEntityId: 'inq1' }).svc.rerun('sub1', STAFF)).rejects.toBeInstanceOf(ConflictException);
    await expect(make({ ...FAILED_ROW, createdEntityId: 'inq1', createdEntityType: 'inquiry' }).svc.rerun('sub1', STAFF)).rejects.toBeInstanceOf(ConflictException);
    await expect(make({ ...FAILED_ROW, status: WebsiteSubmissionStatus.SPAM }).svc.rerun('sub1', STAFF)).rejects.toBeInstanceOf(ConflictException);
    await expect(make({ ...FAILED_ROW, status: WebsiteSubmissionStatus.RECEIVED }).svc.rerun('sub1', STAFF)).rejects.toBeInstanceOf(ConflictException);
    await expect(make(null).svc.rerun('nope', STAFF)).rejects.toBeInstanceOf(NotFoundException);
    const untouched = make({ ...FAILED_ROW, createdEntityId: 'inq1' });
    await untouched.svc.rerun('sub1', STAFF).catch(() => undefined);
    expect(untouched.handler.handle).not.toHaveBeenCalled();
    expect(untouched.prisma.websiteFormSubmission.update).not.toHaveBeenCalled();
  });

  it('refuses (409) when the stored payload no longer passes the catalog, and lists the reasons', async () => {
    const broken = make({ ...FAILED_ROW, payloadJson: { fields: { email: 'not-an-email' } } });
    await expect(broken.svc.rerun('sub1', STAFF)).rejects.toMatchObject({
      response: expect.objectContaining({ errors: expect.arrayContaining(['name is required']) }),
    });
    expect(broken.handler.handle).not.toHaveBeenCalled();
  });

  it('a test row re-runs as a dry run (P2): the handler sees dryRun=true, nothing is notified or autoresponded, no entity is recorded', async () => {
    const { svc, prisma, handler, notify, autoresponder } = make({ ...FAILED_ROW, isTest: true, tokenClass: WebsiteTokenClass.TEST });
    const res = await svc.rerun('sub1', STAFF);
    expect((handler.handle as jest.Mock).mock.calls[0][0].dryRun).toBe(true);
    const data = prisma.websiteFormSubmission.update.mock.calls[0][0].data as Record<string, unknown>;
    expect(data.createdEntityId).toBeNull();
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(autoresponder.send).not.toHaveBeenCalled();
    expect(res.data.isTest).toBe(true);
  });
});
```

`apps/backend/src/modules/website/website-forms-inbox.logic.spec.ts`:

```ts
// apps/backend/src/modules/website/website-forms-inbox.logic.spec.ts
/**
 * WP3a Task 7 (rulings P3, P8) — the inbox filters and the wire rows. Needs-attention is
 * FAILED or captchaDegraded (P8); the list row never carries the hashes or the attempt
 * log, the detail adds the attempt log, the UA and the token class.
 */
import { WebsiteFormKind, WebsiteSubmissionStatus, WebsiteTokenClass } from '@prisma/client';
import { buildSubmissionWhere, toInboxDetail, toInboxRow } from './website-forms-inbox.logic';

const ROW = {
  id: 'sub1',
  formId: 'form-hire',
  formKey: 'hire',
  requestHash: 'a'.repeat(64),
  hourBucket: 497_000,
  status: WebsiteSubmissionStatus.HANDLED,
  isTest: false,
  tokenClass: WebsiteTokenClass.PREVIOUS_WRITE,
  locale: 'tr',
  payloadJson: { fields: { name: 'Ayşe' }, sourcePath: '/tr/isci-kirala' },
  consentVersion: 'v1',
  ipAddressHash: 'b'.repeat(64),
  userAgent: 'Safari',
  captchaPassed: true,
  captchaDegraded: false,
  handlerResultJson: { attempts: [] },
  createdEntityType: 'inquiry',
  createdEntityId: 'inq1',
  error: null,
  handledAt: new Date('2026-09-19T10:00:01.000Z'),
  purgeAfter: new Date('2026-12-18T10:00:01.000Z'),
  createdAt: new Date('2026-09-19T10:00:00.000Z'),
  updatedAt: new Date('2026-09-19T10:00:01.000Z'),
  form: { kind: WebsiteFormKind.INQUIRY },
};

describe('buildSubmissionWhere', () => {
  it('no filters → empty where', () => {
    expect(buildSubmissionWhere({})).toEqual({});
  });

  it('formKey, status and isTest are plain column filters', () => {
    expect(buildSubmissionWhere({ formKey: 'hire', status: WebsiteSubmissionStatus.FAILED, isTest: 'false' })).toEqual({
      formKey: 'hire', status: WebsiteSubmissionStatus.FAILED, isTest: false,
    });
    expect(buildSubmissionWhere({ isTest: 'true' })).toEqual({ isTest: true });
  });

  it('needsAttention = FAILED or captchaDegraded (P8)', () => {
    expect(buildSubmissionWhere({ needsAttention: 'true' })).toEqual({
      AND: [{ OR: [{ status: WebsiteSubmissionStatus.FAILED }, { captchaDegraded: true }] }],
    });
  });

  it('search matches the id, the created entity id, and the visitor identity fields inside payloadJson (e-mail lowercased)', () => {
    const where = buildSubmissionWhere({ search: ' Ayşe@Example.COM ' });
    expect(where.AND).toEqual([
      {
        OR: [
          { id: 'Ayşe@Example.COM' },
          { createdEntityId: 'Ayşe@Example.COM' },
          { payloadJson: { path: ['fields', 'name'], string_contains: 'Ayşe@Example.COM' } },
          { payloadJson: { path: ['fields', 'company'], string_contains: 'Ayşe@Example.COM' } },
          { payloadJson: { path: ['fields', 'email'], string_contains: 'ayşe@example.com' } },
          { payloadJson: { path: ['fields', 'phone'], string_contains: 'Ayşe@Example.COM' } },
          { payloadJson: { path: ['fields', 'reporterName'], string_contains: 'Ayşe@Example.COM' } },
          { payloadJson: { path: ['fields', 'reporterEmail'], string_contains: 'ayşe@example.com' } },
        ],
      },
    ]);
    expect(buildSubmissionWhere({ search: '   ' })).toEqual({});
  });

  it('from/to bound createdAt; a date-only `to` is inclusive of its whole UTC day', () => {
    expect(buildSubmissionWhere({ from: '2026-09-01T00:00:00.000Z', to: '2026-09-19T12:00:00.000Z' })).toEqual({
      createdAt: { gte: new Date('2026-09-01T00:00:00.000Z'), lte: new Date('2026-09-19T12:00:00.000Z') },
    });
    expect(buildSubmissionWhere({ to: '2026-09-19' })).toEqual({
      createdAt: { lt: new Date('2026-09-20T00:00:00.000Z') },
    });
    expect(buildSubmissionWhere({ from: '2026-09-19' })).toEqual({
      createdAt: { gte: new Date('2026-09-19T00:00:00.000Z') },
    });
  });

  it('everything at once composes with AND', () => {
    const where = buildSubmissionWhere({ formKey: 'contact', needsAttention: 'true', search: 'x', isTest: 'false' });
    expect(where.formKey).toBe('contact');
    expect(where.isTest).toBe(false);
    expect(where.AND).toHaveLength(2);
  });
});

describe('toInboxRow / toInboxDetail', () => {
  it('the list row carries formKind and the payload, never the hashes, the attempt log or the UA', () => {
    const row = toInboxRow(ROW);
    expect(row).toEqual({
      id: 'sub1',
      formKey: 'hire',
      formKind: WebsiteFormKind.INQUIRY,
      status: WebsiteSubmissionStatus.HANDLED,
      isTest: false,
      locale: 'tr',
      captchaPassed: true,
      captchaDegraded: false,
      createdEntityType: 'inquiry',
      createdEntityId: 'inq1',
      error: null,
      handledAt: ROW.handledAt,
      purgeAfter: ROW.purgeAfter,
      consentVersion: 'v1',
      payloadJson: ROW.payloadJson,
      createdAt: ROW.createdAt,
    });
    expect(JSON.stringify(row)).not.toContain('a'.repeat(64));
    expect(JSON.stringify(row)).not.toContain('b'.repeat(64));
    expect(row).not.toHaveProperty('handlerResultJson');
    expect(row).not.toHaveProperty('userAgent');
  });

  it('the detail adds the attempt log, the UA, the token class and updatedAt', () => {
    const detail = toInboxDetail(ROW);
    expect(detail).toMatchObject({ ...toInboxRow(ROW), handlerResultJson: { attempts: [] }, userAgent: 'Safari', tokenClass: WebsiteTokenClass.PREVIOUS_WRITE, updatedAt: ROW.updatedAt });
    expect(detail).not.toHaveProperty('ipAddressHash');
    expect(detail).not.toHaveProperty('requestHash');
  });
});
```

`apps/backend/src/modules/website/website-forms-inbox.service.spec.ts`:

```ts
// apps/backend/src/modules/website/website-forms-inbox.service.spec.ts
/**
 * WP3a Task 7 (ruling P3) — the inbox reads: house paging `{ data, meta }`, newest first,
 * `limit` capped at 100 (the frontend ExportCsvButton walks pages of 100), and a 404 for
 * an unknown id.
 */
import { NotFoundException } from '@nestjs/common';
import { WebsiteFormKind, WebsiteSubmissionStatus, WebsiteTokenClass } from '@prisma/client';
import { WebsiteFormsInboxService } from './website-forms-inbox.service';

type Args = Record<string, unknown>;

const row = (id: string) => ({
  id, formId: 'form-hire', formKey: 'hire', requestHash: 'a'.repeat(64), hourBucket: 1, status: WebsiteSubmissionStatus.HANDLED, isTest: false,
  tokenClass: WebsiteTokenClass.WRITE, locale: 'tr', payloadJson: { fields: { name: 'A' } }, consentVersion: 'v1', ipAddressHash: null, userAgent: 'UA',
  captchaPassed: true, captchaDegraded: false, handlerResultJson: { attempts: [] }, createdEntityType: 'inquiry', createdEntityId: 'inq1', error: null,
  handledAt: new Date('2026-09-19T10:00:01.000Z'), purgeAfter: null, createdAt: new Date('2026-09-19T10:00:00.000Z'), updatedAt: new Date('2026-09-19T10:00:01.000Z'),
  form: { kind: WebsiteFormKind.INQUIRY },
});

function make(rows = [row('s1'), row('s2')], total = 2) {
  const prisma = {
    websiteFormSubmission: {
      findMany: jest.fn(async (_a: Args) => rows),
      count: jest.fn(async (_a: Args) => total),
      findUnique: jest.fn(async (a: Args) => rows.find((r) => r.id === (a.where as { id: string }).id) ?? null),
    },
  };
  return { svc: new WebsiteFormsInboxService(prisma as never), prisma };
}

describe('WebsiteFormsInboxService', () => {
  it('list: defaults page 1 / limit 20, newest first, joins form.kind, answers { data, meta }', async () => {
    const { svc, prisma } = make();
    const res = await svc.list({});
    expect(prisma.websiteFormSubmission.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 20,
      include: { form: { select: { kind: true } } },
    });
    expect(prisma.websiteFormSubmission.count).toHaveBeenCalledWith({ where: {} });
    expect(res.meta).toEqual({ total: 2, page: 1, limit: 20, totalPages: 1 });
    expect(res.data.map((r) => r.id)).toEqual(['s1', 's2']);
    expect(res.data[0].formKind).toBe(WebsiteFormKind.INQUIRY);
    expect(res.data[0]).not.toHaveProperty('handlerResultJson');
  });

  it('list: pages and filters flow through, limit is capped at 100', async () => {
    const { svc, prisma } = make([], 250);
    const res = await svc.list({ page: 3, limit: 500, formKey: 'hire', needsAttention: 'true' });
    const args = prisma.websiteFormSubmission.findMany.mock.calls[0][0] as Args;
    expect(args.skip).toBe(200);
    expect(args.take).toBe(100);
    expect(args.where).toEqual({ formKey: 'hire', AND: [{ OR: [{ status: WebsiteSubmissionStatus.FAILED }, { captchaDegraded: true }] }] });
    expect(res.meta).toEqual({ total: 250, page: 3, limit: 100, totalPages: 3 });
  });

  it('get: the detail row with the attempt log; 404 when unknown', async () => {
    const { svc, prisma } = make();
    const res = await svc.get('s2');
    expect(prisma.websiteFormSubmission.findUnique).toHaveBeenCalledWith({ where: { id: 's2' }, include: { form: { select: { kind: true } } } });
    expect(res.data).toMatchObject({ id: 's2', formKind: WebsiteFormKind.INQUIRY, handlerResultJson: { attempts: [] }, userAgent: 'UA', tokenClass: WebsiteTokenClass.WRITE });
    await expect(svc.get('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});
```

`apps/backend/test/permissions/website-inbox-conformance.spec.ts`:

```ts
import { MetadataScanner, Reflector } from '@nestjs/core';
import { PermissionAction } from '@prisma/client';

import { PermissionConformanceService } from '../../src/modules/permissions/permission-conformance.service';
import {
  PERMISSION_KEY,
  type RequiredPermission,
} from '../../src/modules/permissions/decorators/require-permission.decorator';
import { AUDIT_ENTITY_KEY } from '../../src/common/decorators/audit-entity.decorator';
import { WebsiteFormsInboxController } from '../../src/modules/website/website-forms-inbox.controller';
import { registryFromSource } from './registry-from-source';

/**
 * WP3a Task 7 (ruling P3) — the forms inbox on `website.forms`: reads on VIEW, the
 * DEDICATED export route on EXPORT and audited, the re-run (a write that may file a
 * lead) on EDIT and audited. The real scanner over the real controller against the real
 * descriptor (Task 4's door-conformance shape); Task 1's website-conformance.spec.ts
 * scans this controller too (RC15) — this file pins what is specific to the inbox.
 */
function keyOf(
  controller: { prototype: object },
  method: string,
): RequiredPermission | RequiredPermission[] | undefined {
  const handler = (controller.prototype as Record<string, unknown>)[method];
  return Reflect.getMetadata(PERMISSION_KEY, handler as object);
}

function auditOf(controller: { prototype: object }, method: string): string | undefined {
  const handler = (controller.prototype as Record<string, unknown>)[method];
  return Reflect.getMetadata(AUDIT_ENTITY_KEY, handler as object);
}

describe('Website forms inbox route conformance', () => {
  const registry = registryFromSource('modules/website/website.module.ts');

  it('website.forms supports exactly VIEW, EDIT, EXPORT (RC8)', () => {
    expect(registry.getResource('website.forms')?.supportedActions).toEqual([
      PermissionAction.VIEW,
      PermissionAction.EDIT,
      PermissionAction.EXPORT,
    ]);
  });

  it('every inbox route names website.forms at a supported action; none is public or self-service', () => {
    const { report, errors } = new PermissionConformanceService(
      { getControllers: () => [] } as never,
      new MetadataScanner(),
      new Reflector(),
      registry,
      { get: () => undefined } as never,
    ).scanClasses([WebsiteFormsInboxController], true);

    expect(errors).toEqual([]);
    expect(report.undecorated).toEqual([]);
    expect(report.decorated).toBe(4);
    expect(report.public).toBe(0);
    expect(report.selfService).toBe(0);
  });

  it('reads on VIEW, the dedicated export on EXPORT + audit, the re-run on EDIT + audit', () => {
    expect(keyOf(WebsiteFormsInboxController, 'list')).toEqual({ module: 'website.forms', action: 'VIEW' });
    expect(keyOf(WebsiteFormsInboxController, 'get')).toEqual({ module: 'website.forms', action: 'VIEW' });
    expect(keyOf(WebsiteFormsInboxController, 'export')).toEqual({ module: 'website.forms', action: 'EXPORT' });
    expect(keyOf(WebsiteFormsInboxController, 'rerun')).toEqual({ module: 'website.forms', action: 'EDIT' });
    expect(auditOf(WebsiteFormsInboxController, 'list')).toBeUndefined();
    expect(auditOf(WebsiteFormsInboxController, 'get')).toBeUndefined();
    expect(auditOf(WebsiteFormsInboxController, 'export')).toBe('WebsiteFormSubmission');
    expect(auditOf(WebsiteFormsInboxController, 'rerun')).toBe('WebsiteFormSubmission');
  });
});
```

Modify `apps/backend/test/permissions/website-conformance.spec.ts` (Task 1's file, as Task 4 left it). Replace the three import lines

```ts
import { WebsiteStatusController } from '../../src/modules/website/website-status.controller';
import { WebsiteIntegrationsController } from '../../src/modules/website/website-integrations.controller';
import { WebsitePublicController } from '../../src/modules/website/website-public.controller';
```

with

```ts
import { WebsiteStatusController } from '../../src/modules/website/website-status.controller';
import { WebsiteIntegrationsController } from '../../src/modules/website/website-integrations.controller';
import { WebsitePublicController } from '../../src/modules/website/website-public.controller';
import { WebsiteFormsInboxController } from '../../src/modules/website/website-forms-inbox.controller';
```

and replace the four lines (exactly as Task 4 wrote them)

```ts
// Every task that adds a website controller appends it here (RC15): Task 4 the
// integrations screen + the public door; Task 7 the forms inbox; Tasks 8/9 their
// public controllers.
const CONTROLLERS = [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController];
```

with

```ts
// Every task that adds a website controller appends it here (RC15): Task 4 the
// integrations screen + the public door; Task 7 the forms inbox; Tasks 8/9 their
// public controllers.
const CONTROLLERS = [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController, WebsiteFormsInboxController];
```

Nothing else in that spec changes: `errors` stays `[]`, `undecorated` stays `[]`, `selfService >= 1` still holds. (Task 8 appends `WebsitePublicUploadsController, WebsiteFormsEvidenceController` and Task 9 `WebsitePublicNewsletterController` to this same single `const CONTROLLERS = […];` line.)

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/modules/website/handlers src/modules/website/website-forms.rerun.spec.ts src/modules/website/website-forms-inbox.logic.spec.ts src/modules/website/website-forms-inbox.service.spec.ts test/permissions/website-inbox-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2
```

Expected: six red suites, all at ts-jest compile time. The two handler suites: `TS2307: Cannot find module './website-inquiry.logic'` / `'./website-inquiry.handler'`; `website-forms.rerun.spec.ts`: `TS2339: Property 'rerun' does not exist on type 'WebsiteFormsService'` (the eight-argument constructor call itself compiles — Task 6 already has it); the two inbox suites: `TS2307: Cannot find module './website-forms-inbox.logic'` / `'./website-forms-inbox.service'`; `website-inbox-conformance.spec.ts` and Task 1's `website-conformance.spec.ts`: `TS2307: Cannot find module '../../src/modules/website/website-forms-inbox.controller'`. No new test body runs.

- [ ] **Step 3: Implement**

3.1 `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts`

```ts
import { InquiryClassification, InquirySource, WebsiteFormKind } from '@prisma/client';

import { CreateInquiryDto } from '../../sales/dto/create-inquiry.dto';
import { normalizeE164 } from '../../call-center/logic/phone-normalize.logic';
import type { WebsiteFormHandlerInput } from '../website-form-handler';

/** The website "I am a…" selector → InquiryClassification (the call-agent-tools.service.ts map). */
const I_AM_TO_CLASSIFICATION: Record<string, InquiryClassification> = {
  direct_employer: InquiryClassification.DIRECT_EMPLOYER,
  hr_agency: InquiryClassification.HR_AGENCY,
  sourcing_partner: InquiryClassification.SOURCING_PARTNER,
  job_seeker: InquiryClassification.JOB_SEEKER,
};

/** Per-form default when the selector is absent. `contact` deliberately has none. */
const FORM_DEFAULT_CLASSIFICATION: Record<string, InquiryClassification | undefined> = {
  hire: InquiryClassification.DIRECT_EMPLOYER,
  workers: InquiryClassification.DIRECT_EMPLOYER,
  partner: InquiryClassification.SOURCING_PARTNER,
};

/** Identity fields have their own Inquiry columns; everything else goes into the preview. */
const IDENTITY_FIELDS = new Set(['name', 'company', 'email', 'phone', 'country', 'iAm']);

/** CreateInquiryDto's own caps — not enforced on a service call, so enforced here. */
const MESSAGE_PREVIEW_MAX = 5000;
const NOTES_MAX = 2000;

type WebsiteFieldValue = string | string[] | undefined;

/** An identity column takes one value; an array (RC5 multi-value field) contributes its first. */
function one(v: WebsiteFieldValue): string | undefined {
  if (typeof v === 'string') return v || undefined;
  if (Array.isArray(v)) return v.find((x) => typeof x === 'string' && x.length > 0);
  return undefined;
}

/** A preview line shows every value; arrays are comma-joined. */
function all(v: WebsiteFieldValue): string {
  return Array.isArray(v) ? v.join(', ') : v ?? '';
}

function classificationFor(input: WebsiteFormHandlerInput): InquiryClassification | undefined {
  // P4: CALLBACK, VISIT and CALCULATOR_QUOTE arrive unclassified — staff classify them.
  if (input.kind !== WebsiteFormKind.INQUIRY) return undefined;
  const picked = one(input.fields.iAm);
  return (picked ? I_AM_TO_CLASSIFICATION[picked] : undefined) ?? FORM_DEFAULT_CLASSIFICATION[input.formKey];
}

/**
 * The typed, cast-free CreateInquiryDto (the wa-ai-tools.service.ts shape). Country is
 * already an ISO-2 code (the catalog uppercases it), the phone becomes E.164 for the
 * WhatsApp re-match in InquiryService.create (or stays as typed when it cannot be
 * normalised — the inbox keeps the visitor's own spelling either way), `language` is the
 * page locale, and the preview is tagged with the form key so the Sales list can tell a
 * callback request from a hiring request.
 */
export function buildWebsiteInquiryDto(input: WebsiteFormHandlerInput, now: Date = new Date()): CreateInquiryDto {
  const f = input.fields;
  const rawPhone = one(f.phone);
  const phone = rawPhone ? normalizeE164(rawPhone) ?? rawPhone : undefined;
  const lines = Object.entries(f)
    .filter(([k, v]) => !IDENTITY_FIELDS.has(k) && all(v).length > 0)
    .map(([k, v]) => `${k}: ${all(v)}`);
  const messagePreview = [`[website:${input.formKey}]`, ...lines].join('\n').slice(0, MESSAGE_PREVIEW_MAX);
  const notes = `Website intake submission ${input.submissionId} (${input.locale}), consent ${input.consentVersion}${
    input.captchaDegraded ? ', captcha degraded' : ''
  }.`.slice(0, NOTES_MAX);

  const dto: CreateInquiryDto = {
    source: InquirySource.WEBSITE_FORM,
    date: now.toISOString(),
    contactName: one(f.name),
    companyName: one(f.company),
    email: one(f.email),
    phoneNumber: phone,
    country: one(f.country),
    language: input.locale,
    classification: classificationFor(input),
    messagePreview,
    notes,
  };
  return dto;
}
```

3.2 `apps/backend/src/modules/website/handlers/website-inquiry.handler.ts`

```ts
import { Injectable, Logger } from '@nestjs/common';
import { WebsiteFormKind } from '@prisma/client';

import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { InquiryService } from '../../sales/inquiry.service';
import {
  WebsiteFormHandler,
  WebsiteFormHandlerInput,
  WebsiteFormHandlerRegistry,
  WebsiteFormHandlerResult,
} from '../website-form-handler';
import { buildWebsiteInquiryDto } from './website-inquiry.logic';

/**
 * The synthetic actor the website files inquiries as. Like `system:call-center` and
 * `system:whatsapp-ai` (effective-permissions.service.ts), `roleSlug: 'system'` matches no
 * Role row and therefore holds ZERO grants — which is fine, because `InquiryService.create`
 * never reads the actor, and this handler never calls anything that does.
 */
export const WEBSITE_SYSTEM_USER: AuthenticatedUser = {
  userId: 'system:website',
  email: 'website@jobsadmire.local',
  roleId: 'system',
  roleSlug: 'system',
};

/**
 * INQUIRY, CALLBACK, VISIT and CALCULATOR_QUOTE all become a Sales Inquiry (ruling P4),
 * filed THROUGH `InquiryService.create` — never `prisma.inquiry.create`: the inquiry
 * number, the assignment engine and the WhatsApp re-match live in that service (the
 * wa-ai-tools.service.ts rule). It creates an Inquiry, never a Lead — a lead is a
 * qualified thing a human decided.
 *
 * A dry run (test token, ruling P2) builds the DTO — so the mapping is exercised by every
 * heartbeat — and returns before the write. Anything thrown by Sales propagates: the
 * forms core records the row as FAILED, alarms once per window, and the row stays
 * re-runnable from the inbox (ruling P8). `detail` carries `contactName` and `email` so
 * the core can address the bell and the autoresponder (RC4).
 */
@Injectable()
export class WebsiteInquiryHandler implements WebsiteFormHandler {
  private readonly logger = new Logger(WebsiteInquiryHandler.name);

  readonly kinds: readonly WebsiteFormKind[] = [
    WebsiteFormKind.INQUIRY,
    WebsiteFormKind.CALLBACK,
    WebsiteFormKind.VISIT,
    WebsiteFormKind.CALCULATOR_QUOTE,
  ];

  constructor(
    private readonly inquiries: InquiryService,
    registry: WebsiteFormHandlerRegistry,
  ) {
    registry.register(this);
  }

  async handle(input: WebsiteFormHandlerInput): Promise<WebsiteFormHandlerResult> {
    const dto = buildWebsiteInquiryDto(input);
    const facts = {
      classification: dto.classification ?? null,
      contactName: dto.contactName ?? null,
      email: dto.email ?? null,
    };
    if (input.dryRun) {
      return { ok: true, detail: { dryRun: true, wouldCreate: 'inquiry', ...facts } };
    }
    const created = await this.inquiries.create(dto, WEBSITE_SYSTEM_USER);
    this.logger.log(`website ${input.formKey} submission ${input.submissionId} → inquiry ${created.data.inquiryNumber}`);
    return {
      ok: true,
      createdEntityType: 'inquiry',
      createdEntityId: created.data.id,
      detail: {
        inquiryNumber: created.data.inquiryNumber,
        assignedAgentId: created.data.assignedAgentId ?? null,
        assignmentMode: created.meta.assignmentMode,
        ...facts,
      },
    };
  }
}
```

3.3 `apps/backend/src/modules/website/dto/query-website-submissions.dto.ts`

```ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { WebsiteSubmissionStatus } from '@prisma/client';
import { WEBSITE_FORM_KEYS, WebsiteFormKey } from '@jobsadmire/constants';

/**
 * Query of the forms inbox list and export routes (WP3a, ruling P3/P8). The frontend's
 * `WebsiteSubmissionsQuery` (lib/api/website.ts) sends exactly these keys; the global
 * ValidationPipe forbids any other.
 */
export class QueryWebsiteSubmissionsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Matches the submission id, the created entity id, or the visitor name / company / e-mail / phone in the payload' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  // RC31: swagger's `enum` (and `IsIn`) want a mutable string[], so the `as const` tuple is spread.
  @ApiPropertyOptional({ enum: [...WEBSITE_FORM_KEYS] })
  @IsOptional()
  @IsIn([...WEBSITE_FORM_KEYS])
  formKey?: WebsiteFormKey;

  @ApiPropertyOptional({ enum: WebsiteSubmissionStatus })
  @IsOptional()
  @IsEnum(WebsiteSubmissionStatus)
  status?: WebsiteSubmissionStatus;

  @ApiPropertyOptional({ enum: ['true'], description: "'true' → FAILED or accepted with a degraded captcha (ruling P8)" })
  @IsOptional()
  @IsIn(['true'])
  needsAttention?: 'true';

  @ApiPropertyOptional({ enum: ['true', 'false'], description: "'true' → test-token rows only; 'false' → real only; omitted → both" })
  @IsOptional()
  @IsIn(['true', 'false'])
  isTest?: 'true' | 'false';

  @ApiPropertyOptional({ description: 'ISO 8601 lower bound on createdAt (inclusive)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 upper bound on createdAt (inclusive; a date-only value covers that whole UTC day)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
```

3.4 `apps/backend/src/modules/website/website-forms-inbox.logic.ts`

```ts
import { Prisma, WebsiteFormKind, WebsiteFormSubmission, WebsiteSubmissionStatus, WebsiteTokenClass } from '@prisma/client';

import { QueryWebsiteSubmissionsDto } from './dto/query-website-submissions.dto';

export const INBOX_DEFAULT_LIMIT = 20;
/** The frontend's ExportCsvButton walks pages of 100. */
export const INBOX_MAX_LIMIT = 100;

/** A submission with its form's kind joined — what every inbox read selects. */
export type WebsiteSubmissionWithKind = WebsiteFormSubmission & { form: { kind: WebsiteFormKind } };

/**
 * The list row (Task 11's `WebsiteFormSubmission` client type). Deliberately NOT the
 * Prisma row: the request hash, the hour bucket and the IP hash are the door's own
 * bookkeeping, and the attempt log is the detail's.
 */
export interface WebsiteInboxRow {
  id: string;
  formKey: string;
  formKind: WebsiteFormKind;
  status: WebsiteSubmissionStatus;
  isTest: boolean;
  locale: string | null;
  captchaPassed: boolean | null;
  captchaDegraded: boolean;
  createdEntityType: string | null;
  createdEntityId: string | null;
  error: string | null;
  handledAt: Date | null;
  purgeAfter: Date | null;
  consentVersion: string | null;
  payloadJson: Prisma.JsonValue;
  createdAt: Date;
}

export interface WebsiteInboxDetail extends WebsiteInboxRow {
  tokenClass: WebsiteTokenClass;
  handlerResultJson: Prisma.JsonValue | null;
  userAgent: string | null;
  updatedAt: Date;
}

export function toInboxRow(row: WebsiteSubmissionWithKind): WebsiteInboxRow {
  return {
    id: row.id,
    formKey: row.formKey,
    formKind: row.form.kind,
    status: row.status,
    isTest: row.isTest,
    locale: row.locale,
    captchaPassed: row.captchaPassed,
    captchaDegraded: row.captchaDegraded,
    createdEntityType: row.createdEntityType,
    createdEntityId: row.createdEntityId,
    error: row.error,
    handledAt: row.handledAt,
    purgeAfter: row.purgeAfter,
    consentVersion: row.consentVersion,
    payloadJson: row.payloadJson,
    createdAt: row.createdAt,
  };
}

export function toInboxDetail(row: WebsiteSubmissionWithKind): WebsiteInboxDetail {
  return {
    ...toInboxRow(row),
    tokenClass: row.tokenClass,
    handlerResultJson: row.handlerResultJson,
    userAgent: row.userAgent,
    updatedAt: row.updatedAt,
  };
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Inclusive upper bound: a date-only `to` means "through the end of that UTC day". */
function upperBound(to: string): Prisma.DateTimeFilter {
  if (DATE_ONLY.test(to)) {
    const next = new Date(`${to}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    return { lt: next };
  }
  return { lte: new Date(to) };
}

/**
 * Search is best-effort and MINIMAL by design: Prisma 5's JSON filter offers
 * `string_contains` on a path but no case-insensitive mode, so a name search is
 * case-sensitive while an e-mail search is lowercased (the catalog stores e-mails
 * lowercased). The two `reporter*` paths cover the fraud form (RC5).
 */
function searchClause(term: string): Prisma.WebsiteFormSubmissionWhereInput {
  const lower = term.toLowerCase();
  return {
    OR: [
      { id: term },
      { createdEntityId: term },
      { payloadJson: { path: ['fields', 'name'], string_contains: term } },
      { payloadJson: { path: ['fields', 'company'], string_contains: term } },
      { payloadJson: { path: ['fields', 'email'], string_contains: lower } },
      { payloadJson: { path: ['fields', 'phone'], string_contains: term } },
      { payloadJson: { path: ['fields', 'reporterName'], string_contains: term } },
      { payloadJson: { path: ['fields', 'reporterEmail'], string_contains: lower } },
    ],
  };
}

export function buildSubmissionWhere(q: QueryWebsiteSubmissionsDto): Prisma.WebsiteFormSubmissionWhereInput {
  const where: Prisma.WebsiteFormSubmissionWhereInput = {};
  if (q.formKey) where.formKey = q.formKey;
  if (q.status) where.status = q.status;
  if (q.isTest === 'true') where.isTest = true;
  else if (q.isTest === 'false') where.isTest = false;

  if (q.from || q.to) {
    where.createdAt = {
      ...(q.from ? { gte: new Date(q.from) } : {}),
      ...(q.to ? upperBound(q.to) : {}),
    };
  }

  const and: Prisma.WebsiteFormSubmissionWhereInput[] = [];
  // Needs-attention = FAILED or accepted while the captcha was degraded (ruling P8).
  if (q.needsAttention === 'true') {
    and.push({ OR: [{ status: WebsiteSubmissionStatus.FAILED }, { captchaDegraded: true }] });
  }
  const term = q.search?.trim();
  if (term) and.push(searchClause(term));
  if (and.length) where.AND = and;

  return where;
}
```

3.5 `apps/backend/src/modules/website/website-forms-inbox.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { QueryWebsiteSubmissionsDto } from './dto/query-website-submissions.dto';
import {
  buildSubmissionWhere,
  INBOX_DEFAULT_LIMIT,
  INBOX_MAX_LIMIT,
  toInboxDetail,
  toInboxRow,
  WebsiteInboxDetail,
  WebsiteInboxRow,
} from './website-forms-inbox.logic';

export interface WebsiteInboxPage {
  data: WebsiteInboxRow[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

/**
 * The staff side of the intake door: what the inbox screen lists and opens (ruling P3,
 * spec WP3a "minimal Form inbox"). Reads only — the one write, `rerun`, lives on
 * `WebsiteFormsService` because it shares the core's handler runner.
 */
@Injectable()
export class WebsiteFormsInboxService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: QueryWebsiteSubmissionsDto): Promise<WebsiteInboxPage> {
    const page = q.page ?? 1;
    const limit = Math.min(q.limit ?? INBOX_DEFAULT_LIMIT, INBOX_MAX_LIMIT);
    const where = buildSubmissionWhere(q);
    const [rows, total] = await Promise.all([
      this.prisma.websiteFormSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { form: { select: { kind: true } } },
      }),
      this.prisma.websiteFormSubmission.count({ where }),
    ]);
    return {
      data: rows.map(toInboxRow),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async get(id: string): Promise<{ data: WebsiteInboxDetail }> {
    const row = await this.prisma.websiteFormSubmission.findUnique({
      where: { id },
      include: { form: { select: { kind: true } } },
    });
    if (!row) throw new NotFoundException('Submission not found.');
    return { data: toInboxDetail(row) };
  }
}
```

3.6 Modify `apps/backend/src/modules/website/website-forms.service.ts` (Task 6's file). Three edits; `submit()`, `runHandler()` and the constructor are not touched.

(1) In the `@nestjs/common` import at the top of the file, add `ConflictException` to the imported names (keep the rest of that import as Task 6 wrote it).

(2) Immediately after the line

```ts
import { PrismaService } from '../../prisma/prisma.service';
```

add

```ts
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { toInboxDetail, WebsiteInboxDetail } from './website-forms-inbox.logic';
```

(3) Immediately before the line

```ts
  protected async runHandler(
```

insert the method (its doc-comment included):

```ts
  /**
   * Inbox re-run (ruling P8). Only a FAILED row that created nothing may run again — a
   * FAILED row WITH an entity means the handler wrote and then stumbled, and running it
   * again would file the lead twice. Test rows re-run as dry runs (ruling P2). The stored
   * payload is re-normalised through the catalog (a whitelist tightened since the row was
   * written is a 409 with the reasons, never a handler exception). Attempt N+1 is appended
   * to handlerResultJson with `rerun: true` and the staff user as actor; the core's
   * post-handler rules apply unchanged — notify + autorespond only on success, re-alarm on
   * failure — and no captcha, trip check or abuse count runs (this is not a visit).
   */
  async rerun(id: string, actor: AuthenticatedUser): Promise<{ data: WebsiteInboxDetail }> {
    const row = await this.prisma.websiteFormSubmission.findUnique({ where: { id }, include: { form: true } });
    if (!row) throw new NotFoundException('Submission not found.');
    if (row.status !== WebsiteSubmissionStatus.FAILED || row.createdEntityId !== null) {
      throw new ConflictException('Only failed submissions that created no record can be re-run.');
    }
    const stored = (row.payloadJson ?? {}) as { fields?: unknown };
    const normalized = normalizeWebsiteFields(row.formKey, stored.fields ?? {});
    if (!normalized.ok) {
      throw new ConflictException({ message: 'Stored payload no longer passes the catalog', errors: normalized.errors });
    }
    const { form, ...bare } = row;
    const updated = await this.runHandler(
      bare,
      form,
      normalized.fields,
      { visitorIp: null, userAgent: row.userAgent },
      { dryRun: row.isTest, rerun: true, actorId: actor.userId },
    );
    return { data: toInboxDetail({ ...updated, form: { kind: form.kind } }) };
  }

```

`NotFoundException`, `WebsiteSubmissionStatus` and `normalizeWebsiteFields` are already imported by Task 6's file (its `submit()` uses all three).

3.7 `apps/backend/src/modules/website/website-forms-inbox.controller.ts`

```ts
import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { RequirePermission } from '../permissions/decorators/require-permission.decorator';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { QueryWebsiteSubmissionsDto } from './dto/query-website-submissions.dto';
import { WebsiteFormsInboxService } from './website-forms-inbox.service';
import { WebsiteFormsService } from './website-forms.service';

/**
 * The forms inbox (WP3a, rulings P3, P8, RC1) — the ONE path family Task 11's
 * `websiteFormsApi` calls: `website/forms/submissions/*`.
 *
 * Reads are `website.forms` VIEW. The export is its own route on EXPORT and audited
 * (P3: "dedicated endpoint, @AuditEntity") — it answers the same paged `{ data, meta }`
 * as the list because the frontend's ExportCsvButton walks pages and writes the CSV
 * itself; what the EXPORT grant and the audit row record is WHO pulled the visitors'
 * contact data out in bulk. The re-run is a write that may file a lead, so it is EDIT and
 * audited. `export` is declared before `:id` so Nest never reads "export" as an id.
 *
 * Audited through the interceptor because a staff JWT is present
 * (audit.interceptor.ts:46); the public door, by contrast, only has ActivityLogger.
 */
@ApiTags('Website')
@ApiBearerAuth()
@Controller('website/forms/submissions')
export class WebsiteFormsInboxController {
  constructor(
    private readonly inbox: WebsiteFormsInboxService,
    private readonly forms: WebsiteFormsService,
  ) {}

  @RequirePermission('website.forms', 'VIEW')
  @Get()
  @ApiOperation({ summary: 'Website form submissions (paged; search, formKey, status, needsAttention, isTest, from/to)' })
  list(@Query() query: QueryWebsiteSubmissionsDto) {
    return this.inbox.list(query);
  }

  @RequirePermission('website.forms', 'EXPORT')
  @Get('export')
  @AuditEntity('WebsiteFormSubmission')
  @ApiOperation({ summary: 'Bulk read of submissions for the CSV export (same query and shape as the list; audited)' })
  export(@Query() query: QueryWebsiteSubmissionsDto) {
    return this.inbox.list(query);
  }

  @RequirePermission('website.forms', 'VIEW')
  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'One submission with its payload and per-attempt handler result' })
  get(@Param('id') id: string) {
    return this.inbox.get(id);
  }

  @RequirePermission('website.forms', 'EDIT')
  @Post(':id/rerun')
  @HttpCode(200)
  @AuditEntity('WebsiteFormSubmission')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Re-run the handler of a FAILED submission that created no record (409 otherwise; test rows dry-run)' })
  rerun(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.forms.rerun(id, user);
  }
}
```

3.8 Modify `apps/backend/src/modules/website/website.module.ts` — the import block. The file's last import line, as Task 6 left it, is `import { WebsiteFormsService } from './website-forms.service';`; directly after it (before the first non-import line) add these four lines:

```ts
import { SalesModule } from '../sales/sales.module';
import { WebsiteInquiryHandler } from './handlers/website-inquiry.handler';
import { WebsiteFormsInboxService } from './website-forms-inbox.service';
import { WebsiteFormsInboxController } from './website-forms-inbox.controller';
```

3.9 Modify `apps/backend/src/modules/website/website.module.ts` — the `@Module({...})` decorator. Task 6 left it as

```ts
@Module({
  imports: [ConfigModule, PrismaModule, PermissionsModule],
  controllers: [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController],
  // Both guards are providers of THIS module (the call-center.module.ts rule)
  // so DI can hand WebsiteApiGuard its config service; RedisModule, ConfigModule
  // and ActivitiesModule (ActivityLogger) are global, so no new imports. The
  // forms core's three collaborators (notify / abuse / autoresponder) are the
  // contract shells Task 10 fills in; handlers (Tasks 7–9) register themselves
  // in WebsiteFormHandlerRegistry from their constructors.
  providers: [
    WebsiteModuleEnabledGuard,
    WebsiteApiGuard,
    WebsiteIntegrationConfigService,
    WebsitePingService,
    WebsiteCaptchaService,
    WebsiteFormHandlerRegistry,
    WebsiteNotifyService,
    WebsiteAbuseService,
    WebsiteAutoresponderService,
    WebsiteFormsService,
  ],
  exports: [WebsiteIntegrationConfigService],
})
```

Replace the whole decorator block, from its `@Module({` line to its `})` line, with this final form — Task 6's block plus `SalesModule` in `imports`, `WebsiteFormsInboxController` in `controllers` and `WebsiteInquiryHandler, WebsiteFormsInboxService` at the end of `providers`; nothing is reordered and `exports` is unchanged (the constructor below it and its `registry.register({...})` literal stay byte-for-byte):

```ts
@Module({
  // SalesModule exports InquiryService (sales.module.ts:54) — the ONE-WAY edge the
  // website → Sales handler needs; Sales never imports website (the
  // call-center.module.ts precedent). RedisModule, ConfigModule and
  // ActivitiesModule are @Global().
  imports: [ConfigModule, PrismaModule, PermissionsModule, SalesModule],
  controllers: [
    WebsiteStatusController,
    WebsiteIntegrationsController,
    WebsitePublicController,
    WebsiteFormsInboxController,
  ],
  // Both guards are providers of THIS module (the call-center.module.ts rule)
  // so DI can hand WebsiteApiGuard its config service. The forms core's three
  // collaborators (notify / abuse / autoresponder) are the contract shells
  // Task 10 fills in (RC20). WebsiteInquiryHandler is never injected anywhere —
  // Nest still instantiates every listed provider at boot, and its constructor
  // registers it with WebsiteFormHandlerRegistry.
  providers: [
    WebsiteModuleEnabledGuard,
    WebsiteApiGuard,
    WebsiteIntegrationConfigService,
    WebsitePingService,
    WebsiteCaptchaService,
    WebsiteFormHandlerRegistry,
    WebsiteNotifyService,
    WebsiteAbuseService,
    WebsiteAutoresponderService,
    WebsiteFormsService,
    WebsiteInquiryHandler,
    WebsiteFormsInboxService,
  ],
  exports: [WebsiteIntegrationConfigService],
})
```

(Every identifier in that block is imported by Task 1, 2, 4 or 6's import lines or by Step 3.8; nothing else in the file changes. Task 8 appends `CareersPublicModule, UploadModule` / its two controllers / its three providers, Task 9 `NotificationsModule` / its controller / its two providers, and Task 10 its two crons — each printing the whole block, RC15.)

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/modules/website test/permissions/website-inbox-conformance.spec.ts test/permissions/website-conformance.spec.ts test/permissions/website-door-conformance.spec.ts --maxWorkers=2
```

Expected: green — `website-inquiry.logic` 6 tests, `website-inquiry.handler` 5, `website-forms.rerun` 5, `website-forms-inbox.logic` 8, `website-forms-inbox.service` 3, `website-inbox-conformance` 3 (`decorated: 4`, `public: 0`), Task 1's `website-conformance` unchanged and green with four controllers scanned, Task 4's `website-door-conformance` untouched (`decorated: 5` is that spec's own CONTROLLERS), and every Task 2/3/4/6 suite under `src/modules/website` still green (Task 6's `website-forms.service.spec.ts` constructs the service with the same eight arguments — this task adds a method, not a dependency).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest test/permissions/repo-invariants.spec.ts src/modules/sales/inquiry.walink.spec.ts --maxWorkers=2
```

Expected: green — the route census counts the four inbox routes as decorated (`website.forms` at VIEW/EXPORT/EDIT, all supported by Task 1's descriptor), and `inquiry.walink.spec.ts` is byte-identical and green (no new `InquiryService` constructor dependency).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/backend
```

Expected: clean (run alone — one build/typecheck job at a time on this machine). A `CreateInquiryDto` without `contactName` (Task 5 missing from the checkout) fails HERE on `website-inquiry.logic.ts`, loudly, not at runtime.

- [ ] **Step 5: Commit** (three commits; each leaves `tsc`, boot conformance and every website suite green — the module is edited once, in the third commit, so commits 1 and 2 add files and a method that nothing wires yet)

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git add apps/backend/src/modules/website/handlers/website-inquiry.logic.ts apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts \
  apps/backend/src/modules/website/handlers/website-inquiry.handler.ts apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts
git commit -m "feat(website): INQUIRY, CALLBACK, VISIT and CALCULATOR_QUOTE file a Sales inquiry as system:website (WP3a, P4)

Typed CreateInquiryDto (no casts): WEBSITE_FORM source, contactName, ISO country,
E.164 phone, locale as language, formKey-tagged messagePreview; the I-am selector
maps to InquiryClassification with per-form defaults and the last three kinds stay
unclassified. Writes only through InquiryService.create; dry run on the test token
(P2); detail carries inquiryNumber, assignedAgentId, contactName and email for the
core's bell and autoresponder (RC4). Wired into WebsiteModule two commits on.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"

git add apps/backend/src/modules/website/website-forms-inbox.logic.ts apps/backend/src/modules/website/website-forms-inbox.logic.spec.ts \
  apps/backend/src/modules/website/dto/query-website-submissions.dto.ts \
  apps/backend/src/modules/website/website-forms.service.ts apps/backend/src/modules/website/website-forms.rerun.spec.ts
git commit -m "feat(website): idempotent re-run of a failed submission (WP3a, P8)

WebsiteFormsService.rerun: only FAILED rows with no created entity run again (409
otherwise, 404 unknown), the stored payload is re-normalised through the catalog,
test rows re-run as dry runs, attempt N+1 is appended to handlerResultJson with the
staff actor, and the core's post-handler rules apply unchanged (notify + autorespond
on success only, handlerFailed re-alarm on failure). Inbox row/detail mappers and the
inbox query DTO land here for the re-run's answer shape.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"

git add apps/backend/src/modules/website/website-forms-inbox.service.ts apps/backend/src/modules/website/website-forms-inbox.service.spec.ts \
  apps/backend/src/modules/website/website-forms-inbox.controller.ts apps/backend/src/modules/website/website.module.ts \
  apps/backend/test/permissions/website-inbox-conformance.spec.ts apps/backend/test/permissions/website-conformance.spec.ts
git commit -m "feat(website): forms inbox API — list, detail, audited export and re-run on website.forms (WP3a, P3)

GET /website/forms/submissions (VIEW; search, formKey, status, needsAttention =
FAILED or captchaDegraded, isTest, from/to, paged { data, meta } with formKind),
GET …/submissions/export (EXPORT + @AuditEntity — the dedicated export door, same
paged shape for the frontend's ExportCsvButton), GET …/submissions/:id (VIEW; with
handlerResultJson, userAgent, tokenClass), POST …/submissions/:id/rerun (EDIT +
@AuditEntity). One path family, the one Task 11's client calls. WebsiteModule now
imports SalesModule (the one-way website → Sales edge) and provides
WebsiteInquiryHandler + WebsiteFormsInboxService. Controller appended to
website-conformance.spec.ts (RC15) and pinned by website-inbox-conformance.spec.ts.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Docs for this task (PRD §5.12 inbox routes + re-run rule, §4.4 nothing new — `website.forms` rows are Task 1's; CLAUDE.md nothing new) belong to Task 12's same-change-set docs commit (P13, RC10).

---

---

