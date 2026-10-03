### Task 6: Forms core — catalog, intake DTO, degrading captcha, handler contract + registry, `POST /website/v1/forms/:formKey` (row first, replay on repeat), `WebsiteForm` seed

Repo: the WP3a worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations; branch `website/wp3a-intake` — RC17: every task executes from this worktree, never from the shared `main` checkout). Every relative path and every `cd apps/backend` below is inside that worktree.

**Files:**
- Create: `apps/backend/src/common/utils/ip-hash.util.ts`, `apps/backend/src/common/utils/ip-hash.util.spec.ts`
- Create: `apps/backend/src/modules/website/website-form-catalog.ts`, `apps/backend/src/modules/website/website-form-catalog.spec.ts`
- Create: `apps/backend/src/modules/website/website-forms.logic.ts`, `apps/backend/src/modules/website/website-forms.logic.spec.ts`
- Create: `apps/backend/src/modules/website/dto/website-form-submit.dto.ts`, `apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts`
- Create: `apps/backend/prisma/website-form-seed.ts`, `apps/backend/src/modules/website/website-form-seed.spec.ts` (RC1: the seed file is Task 6's; ten rows, `newsletter.isActive = false`)
- Create: `apps/backend/src/modules/website/website-captcha.service.ts`, `apps/backend/src/modules/website/website-captcha.service.spec.ts`
- Create: `apps/backend/src/modules/website/website-form-handler.ts`
- Create: `apps/backend/src/modules/website/website-notify.service.ts`, `apps/backend/src/modules/website/website-abuse.service.ts`, `apps/backend/src/modules/website/website-autoresponder.service.ts` — the three contract shells the forms core injects (RC6 fixes the FINAL constructor `(prisma, config, captcha, registry, activity, notify, abuse, autoresponder)` in THIS task; Task 10 implements the bodies without touching the constructor — see "Produces")
- Create: `apps/backend/src/modules/website/website-forms.service.ts`, `apps/backend/src/modules/website/website-forms.service.spec.ts`
- Modify: `apps/backend/prisma/seed.ts` — two anchors: the import line `import { seedModuleNotificationSettings } from './module-notification-seed';` and the line `  console.log(\`  ✓ Module notification settings: ${notificationRows} event(s) ensured (existing rows untouched)\`);`
- Modify: `apps/backend/src/modules/website/website-public.controller.ts` (Task 4's file; printed in full below — one route added after `ping`)
- Modify: `apps/backend/src/modules/website/website.module.ts` (as Task 4 left it; the import block and the `@Module({...})` decorator only — anchors quoted; the constructor's `registry.register({...})` literal is never touched)
- Modify: `apps/backend/test/permissions/website-door-conformance.spec.ts` (Task 4's spec: the door now has TWO public routes — two lines change, quoted)
- Test: the eight `*.spec.ts` files created above + the edited `website-door-conformance.spec.ts`; `test/permissions/repo-invariants.spec.ts` (route census); Task 2's `website-env.spec.ts` (nothing here writes the literal `'WEBSITE_MODULE_ENABLED'`)

**Interfaces:**
- Consumes (Task 3, RC1): Prisma `WebsiteForm { id, formKey @unique, kind: WebsiteFormKind, label, isActive @default(true), createdAt, updatedAt }`; `WebsiteFormSubmission { id, formId, formKey, requestHash, hourBucket, status: WebsiteSubmissionStatus @default(RECEIVED), isTest @default(false), tokenClass: WebsiteTokenClass @default(WRITE) (RC2), locale String?, payloadJson Json, consentVersion String?, ipAddressHash String?, userAgent String?, captchaPassed Boolean?, captchaDegraded Boolean @default(false), handlerResultJson Json?, createdEntityType String?, createdEntityId String?, error String?, handledAt DateTime?, purgeAfter DateTime?, createdAt, updatedAt }` with `@@unique([formKey, requestHash, hourBucket])` (Prisma compound-input name `formKey_requestHash_hourBucket`); enums `WebsiteFormKind { INQUIRY, CAREERS_APPLY, NEWSLETTER, FRAUD_REPORT, CALLBACK, VISIT, CALCULATOR_QUOTE }`, `WebsiteSubmissionStatus { RECEIVED, HANDLED, FAILED, SPAM }`, `WebsiteTokenClass { WRITE, TEST, PREVIOUS_WRITE }`; `ActivityType.WEBSITE_SUBMISSION_RECEIVED | WEBSITE_SUBMISSION_HANDLED | WEBSITE_SUBMISSION_FAILED` (real members, shipped by migration `20260925120000_website_intake_door` — never cast); from `@jobsadmire/constants` (Task 3 owns them, RC1): `WEBSITE_FORM_KEYS` (readonly tuple of the ten keys `hire, contact, partner, workers, callback, visit, calculator, careers, fraud, newsletter`), `type WebsiteFormKey`, `WEBSITE_FORM_KIND_BY_KEY: Record<WebsiteFormKey, WebsiteFormKind>` (the constants-package enum, string values identical to Prisma's), `isWebsiteFormKey(v: string | undefined): v is WebsiteFormKey`. Pre-flight (a check, not a branch): `grep -n "WEBSITE_SUBMISSION_RECEIVED\|formKey_requestHash_hourBucket\|WebsiteTokenClass" apps/backend/node_modules/.prisma/client/index.d.ts | head -3` and `grep -n "isWebsiteFormKey\|WEBSITE_FORM_KIND_BY_KEY" packages/constants/src/enums/website.enums.ts` must both hit — if either is silent, Task 3 has not landed; stop, do not add anything here.
- Consumes (Task 4, RC1/RC2): `website.constants.ts` → `type WebsiteBearerClass = 'write' | 'test' | 'previous-write'`, `PRISMA_TOKEN_CLASS_BY_BEARER: Record<WebsiteBearerClass, WebsiteTokenClass>`; `WebsiteIntegrationConfigService.resolveSecrets(): Promise<WebsiteResolvedSecrets>` (`turnstileSecret: string | null`; 60 s cache, per-secret try/catch decrypt — P7); `guards/website-api.guard.ts` → `WebsiteApiGuard` (stamps `req.websiteTokenClass`) and `interface WebsiteRequest extends express.Request { websiteTokenClass?: WebsiteBearerClass }`; `decorators/token-class.decorator.ts` → `@TokenClass()` (401 if the guard did not run); `website-public.controller.ts` declared `@ApiTags('Website (public door)') @Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard) @Controller('website/v1')` with constructor `(pingService: WebsitePingService)` and the `ping` route; `website.module.ts` with `imports: [ConfigModule, PrismaModule, PermissionsModule]`, `controllers: [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController]`, `providers: [WebsiteModuleEnabledGuard, WebsiteApiGuard, WebsiteIntegrationConfigService, WebsitePingService]`, `exports: [WebsiteIntegrationConfigService]`; `test/permissions/website-door-conformance.spec.ts` asserting `report.public` is `1`.
- Consumes (Task 2, RC1): `guards/website-module-enabled.guard.ts` → `WebsiteModuleEnabledGuard` (already a provider; the new route inherits it from the class).
- Consumes (repo, verified): `PrismaService` (`src/prisma/prisma.service.ts`); `ActivityLogger.log(input: LogActivityInput)` with `actor: AuthenticatedUser | ActivitySystemActor | null`, `subject: { type: ActivitySubjectType; id }`, `context?: { type: ActivityContextType; id }`, `summary`, `details?`, `ipAddress?` — both type unions carry a `| string` catch-all, and `log()` never throws (`src/modules/activities/activity-logger.service.ts:11-99`; `ActivitiesModule` is `@Global()`); `ConfigService` (global); `Public` (`src/common/decorators/public.decorator.ts`); the global `ValidationPipe({ whitelist, forbidNonWhitelisted, transform, transformOptions: { enableImplicitConversion: true } })` (`src/main.ts:58-66`) and its pipe-level spec precedent `src/modules/whatsapp/dto/wa-config.dto.spec.ts`; the nested-object passthrough precedent `@Transform(({ obj }) => (obj as { audience?: unknown }).audience)` (`src/modules/whatsapp/dto/wa-campaign.dto.ts:56`); the JSON-column cast style `x as Prisma.InputJsonValue` / `as unknown as Prisma.InputJsonValue` (`src/modules/ai-interviewer/ai-interview.service.ts:356-363`); the "NOTHING PAST THIS POINT MAY THROW" rule (`src/modules/whatsapp/wa-ai-tools.service.ts:673`); the three private IP-hash copies, all `sha256(\`${salt}:${ip}\`)` with `config.get('IP_HASH_SALT', 'dev-default-salt')` (`src/modules/careers-public/careers-public.service.ts:1391-1394`, `src/modules/hrm/hrm-contract-signing.service.ts:694-697`, `src/modules/internal-recruitment/offer-letter/offer-letter.service.ts:2727-2729`); the proxy-IP pick `pickRemoteIp` (`src/modules/careers-public/careers-public.controller.ts:426-436`); `RateLimitGuard` inert unless `RATE_LIMITING_ENABLED=true` (`src/common/guards/rate-limit.guard.ts:30-36`), so no `@Throttle` here; `seed.ts` must never import from `apps/backend/src/` (its own comment, and `prisma/module-notification-seed.ts:1-21`) and seeds are create-only (`update: {}`); `AbortSignal.timeout` on Node 20 (`Dockerfile`).
- Produces (Tasks 7, 8, 9, 10, 11, 13 rely on these):
  - `website-form-handler.ts`: `interface WebsiteFormHandler { readonly kinds: readonly WebsiteFormKind[]; handle(input: WebsiteFormHandlerInput): Promise<WebsiteFormHandlerResult> }`; `interface WebsiteFormHandlerInput { submissionId: string; formKey: string; kind: WebsiteFormKind; locale: 'tr' | 'en'; dryRun: boolean; fields: Record<string, string | string[]>; consentVersion: string; captchaDegraded: boolean; visitorIp: string | null; userAgent: string | null }`; `type WebsiteFormHandlerResult = { ok: true; createdEntityType?: 'inquiry' | 'applicant' | 'subscriber' | 'object'; createdEntityId?: string; detail?: Record<string, unknown> } | { ok: false; error: string; detail?: Record<string, unknown> }`; `@Injectable() class WebsiteFormHandlerRegistry { register(handler): void; get(kind): WebsiteFormHandler | null }` — handlers self-register in their constructor with `registry.register(this)` (RC4). Handlers never throw for visitor errors (the catalog refuses those BEFORE the row); an infrastructure throw becomes a FAILED row and HTTP 200 (P8). `detail` keys the core reads (RC4): `alreadyReceived: boolean`, `skipNotification: boolean`, `skipAutoresponder: boolean`, `inquiryNumber: string`, `assignedAgentId: string | null`, `contactName: string`, `email: string`, and on an `{ ok: false }` result `visitorError: true` (RC26 — a visitor mistake surfaced by a downstream service, e.g. careers `apply()` 4xx: the row is FAILED with `error`, `handlerResultJson.visitorError = true`, the `handlerFailed` alarm is SKIPPED, and the door response carries the visitor-safe `error`; without the flag an `{ ok: false }` is an infrastructure failure — alarm fires, response `error` is `null`).
  - `website-form-catalog.ts`: `WEBSITE_FORM_CATALOG: Record<WebsiteFormKey, WebsiteFormSpec>`, `websiteFormSpec(formKey: string): WebsiteFormSpec | null`, `normalizeWebsiteFields(formKey: string, raw: unknown): NormalizedFields` where `NormalizedFields = { ok: true; fields: Record<string, string | string[]>; dropped: string[] } | { ok: false; errors: string[] }`, `WebsiteFieldSpec { max; min?; required?; type?: 'text'|'email'|'phone'|'iso2'|'enum'|'key'|'array-of-key'; values?; pattern?; maxItems? }`, `WebsiteFormSpec { kind: WebsiteFormKind; label; activeByDefault; fields }`, `I_AM_VALUES`, `EMPLOYER_I_AM_VALUES`. Per-form whitelist (RC5): **hire/workers** `name, company*, email*, phone*, country, iAm ∈ {direct_employer, hr_agency}, sector|trade, roleNeeded, headcount, startWhen, message`; **contact** `name*, email*, phone, company, country, iAm, subject, message*`; **partner** `name*, company*, email*, phone*, country*, candidatesPerYear, trades, licence, message`; **callback** `name*, phone*, email, preferredTime, topic`; **visit** `name*, company, email*, phone*, office, preferredDate, preferredTime, message`; **calculator** `name*, email*, phone, company, country, headcount, trade, durationMonths, estimateSummary, message`; **careers** `openingSlug* (^[a-z0-9-]+$), cvKey* (^careers-cv/[A-Za-z0-9._-]+\.pdf$, case-insensitive), name*, email*, phone*, country* (iso2), city, language, expectedSalary, expectedSalaryCurrency, currentSalary, currentSalaryCurrency, coverLetter, linkedinUrl`; **fraud** `reporterName, reporterEmail, reporterPhone, description* (20–5000), suspectName, suspectContact, evidenceKeys (array-of-key, ≤ 3, each ^website-fraud/[A-Za-z0-9._-]+$, de-duplicated)`; **newsletter** `email*, name` (`*` = required). Values are strings (trimmed, control characters stripped, e-mail lowercased, ISO code uppercased, phone kept as typed) except `evidenceKeys: string[]`.
  - `website-forms.logic.ts`: `requestHashFor({ formKey, isTest, locale, fields }): string` (sha256 hex of the key-sorted payload), `hourBucketFor(now): number`, `purgeAfterFor(from): Date` (+90 days), `WEBSITE_PURGE_DAYS = 90`, `isUniqueViolation(err): boolean` (P2002), `visitorIpFromHeaders(headers, socketAddress): string | null`, `visitorUserAgentFromHeaders(headers): string | null`.
  - `dto/website-form-submit.dto.ts`: `class WebsiteFormSubmitDto { locale: 'tr' | 'en'; consentVersion: string (≤ 40); captchaToken?: string (≤ 2048); honeypot?: string; sourcePath?: string; fields: Record<string, unknown> }`, `WEBSITE_LOCALES`, `type WebsiteLocale` (RC14: this is the DTO Task 13 reads).
  - `website-captcha.service.ts`: `WebsiteCaptchaService.verify(token: string | undefined, remoteIp: string | null): Promise<WebsiteCaptchaVerdict>` with `type WebsiteCaptchaVerdict = { outcome: 'passed' } | { outcome: 'failed'; codes: string[] } | { outcome: 'degraded'; reason: 'secretMissing' | 'httpError' | 'unreachable' }` (RC7 — Task 10 reads `verdict.outcome === 'degraded' ? verdict.reason : null`).
  - `website-forms.service.ts`: `WebsiteFormsService` constructor `(prisma: PrismaService, config: ConfigService, captcha: WebsiteCaptchaService, registry: WebsiteFormHandlerRegistry, activity: ActivityLogger, notify: WebsiteNotifyService, abuse: WebsiteAbuseService, autoresponder: WebsiteAutoresponderService)` (RC6 — FINAL; Task 7's `website-forms.rerun.spec.ts` constructs it exactly so, Task 10 never touches it); `submit(formKey: string, dto: WebsiteFormSubmitDto, ctx: WebsiteSubmitContext): Promise<WebsiteSubmitResponse>`; `protected runHandler(row: WebsiteFormSubmission, form: Pick<WebsiteForm, 'kind'>, fields: Record<string, string | string[]>, ctx: Pick<WebsiteSubmitContext, 'visitorIp' | 'userAgent'>, opts: { dryRun: boolean; rerun: boolean; actorId: string }): Promise<WebsiteFormSubmission>` (Task 7's `rerun` calls it; never throws); `WEBSITE_SYSTEM_ACTOR: ActivitySystemActor = { id: 'system:website', name: 'Website form', role: 'system' }`; `interface WebsiteSubmitContext { tokenClass: WebsiteBearerClass; visitorIp: string | null; userAgent: string | null }`; `interface WebsiteSubmitResponse { data: { id; formKey; status: WebsiteSubmissionStatus; isTest; replayed; captchaDegraded; error: string | null } }` (RC26: `error` is the visitor-safe message when the row's `handlerResultJson.visitorError` is true, `null` otherwise — also on a replay of such a row); `type WebsiteStoredPayload = { fields: Record<string, string | string[]>; sourcePath?: string }` (the `payloadJson` shape — Task 7's rerun and Task 8's `evidenceKeysOf` read `payloadJson.fields`); `type WebsiteAttemptRecord = { at; ok; dryRun; rerun; actor; error?; createdEntityType?; createdEntityId?; detail? }` and `handlerResultJson = { attempts: WebsiteAttemptRecord[]; visitorError?: true }` (P8 "per attempt"; the inbox shows the last one; `visitorError` is present only while the LAST attempt was a visitor error — RC26). Post-row calls (RC6): `abuse.isTripped(formKey)` before anything is persisted → 429; `abuse.recordVerified(formKey)` after a NEW (not replayed) captcha-verified non-test row; `notify.formsUnavailable({ reason: 'captchaDegraded', formKey, submissionId, detail })` on a degraded verdict; after a successful non-dry-run handler `notify.formReceived({ submissionId, formKey, contactName, inquiryNumber, assignedAgentId })` once (skipped when `detail.skipNotification` or `detail.alreadyReceived`) and `autoresponder.send({ formKey, locale, to, name, isTest: false })` (skipped when `detail.skipAutoresponder` or `detail.alreadyReceived`; `to` = `detail.email` else `fields.email`, `name` = `detail.contactName` else `fields.name`); after a FAILED handler `notify.formsUnavailable({ reason: 'handlerFailed', formKey, submissionId, detail: error })` — unless `detail.visitorError === true` (RC26). The core never calls `EventDispatcher` (RC6).
  - The three contract shells — exact exported names and signatures Task 10 keeps while replacing the bodies (Task 10's "Create" of these three files is a "Modify" of the whole file; their constructors grow there, and Task 10's own specs construct them with Task 10's constructor):
    - `website-notify.service.ts`: `type WebsiteUnavailableReason = 'captchaDegraded' | 'tripped' | 'untripped' | 'drought' | 'handlerFailed'` (Task 10 moves this type to `website-alarms.logic.ts` and imports it here; nothing in Task 6 imports it), `interface WebsiteFormReceivedInput { submissionId: string; formKey: string; contactName?: string | null; inquiryNumber?: string | null; assignedAgentId?: string | null }`, `interface WebsiteFormsUnavailableInput { reason: WebsiteUnavailableReason; formKey?: string | null; submissionId?: string | null; detail?: string | null; count?: number; hours?: number; lastSubmissionAt?: Date | null; now?: Date }`, `@Injectable() class WebsiteNotifyService { formReceived(input): Promise<void>; formsUnavailable(input): Promise<boolean> }`.
    - `website-abuse.service.ts`: `@Injectable() class WebsiteAbuseService { isTripped(formKey: string): Promise<boolean>; recordVerified(formKey: string, now?: Date): Promise<{ count: number; tripped: boolean; justTripped: boolean }>; trippedForms(): Promise<string[]> }` (Task 10 also injects it into Task 4's `WebsitePingService`, RC6).
    - `website-autoresponder.service.ts`: `@Injectable() class WebsiteAutoresponderService { send(input: { formKey: string; locale?: string | null; to?: string | null; name?: string | null; isTest: boolean }): Promise<boolean> }`.
  - `prisma/website-form-seed.ts`: `WEBSITE_FORM_SEED: WebsiteFormSeedRow[]` (ten rows `{ formKey, kind, label, isActive }`, `newsletter.isActive = false` — P4/D14), `seedWebsiteForms(prisma: WebsiteFormSeedClient): Promise<number>` (upsert, `update: {}`), called from `seed.ts` (Task 13 B4/E4 count 10 `website_forms` rows). Task 9 makes no seed edit — the newsletter row is already inactive here; `website-form-seed.spec.ts` is created HERE (Task 9 must not create a second file at that path).
  - `common/utils/ip-hash.util.ts`: `hashIp(ip, salt): string`, `hashIpOrNull(ip, salt): string | null`, `IP_HASH_DEV_SALT = 'dev-default-salt'`.
  - `website.module.ts` after this task: `providers` gain `WebsiteCaptchaService, WebsiteFormHandlerRegistry, WebsiteNotifyService, WebsiteAbuseService, WebsiteAutoresponderService, WebsiteFormsService` (Task 10 registers only its crons and `WebsiteAlarmsCron`/`WebsitePurgeCron` dependencies on top; the three service names are ALREADY providers). `exports` unchanged (`[WebsiteIntegrationConfigService]`) — handlers live inside the module.
  - Wire contract (WP2 wires to this; RC14 — Task 13 uses exactly this): `POST /api/website/v1/forms/:formKey`, `Authorization: Bearer <write | test | previous-write token>`, optional headers `X-Website-Visitor-Ip`, `X-Website-Visitor-Ua`; body `{ locale: 'tr' | 'en', consentVersion: string, captchaToken?: string, honeypot?: string, sourcePath?: string, fields: {...} }`; `200 { data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }` (a `status: 'FAILED'` is still 200 — the row is durable and re-runnable from the inbox; `error` is `null` unless the handler reported a VISITOR error (RC26), in which case it is the visitor-safe message WP2 shows — e.g. a closed opening or a residency rule from careers `apply()`); `400 { message: 'Invalid form fields', errors: string[] }`; `403` captcha failed (no row); `404` unknown/inactive form (and the module flag off, from the guard); `429 { statusCode: 429, message, reason: 'tripped', fallback: 'whatsapp' }`.

- [ ] **Step 1: Write the failing tests**

`apps/backend/src/common/utils/ip-hash.util.spec.ts`:
```ts
// apps/backend/src/common/utils/ip-hash.util.spec.ts
/** WP3a — the lifted IP-hash helper must stay byte-identical to the three private copies
 *  (careers-public.service.ts:1391, hrm-contract-signing.service.ts:694,
 *  internal-recruitment/offer-letter/offer-letter.service.ts:2727), so hashes written by
 *  either side remain comparable. */
import { createHash } from 'crypto';
import { hashIp, hashIpOrNull, IP_HASH_DEV_SALT } from './ip-hash.util';

describe('hashIp', () => {
  it('is sha256(`${salt}:${ip}`) hex — the formula the private copies use', () => {
    const expected = createHash('sha256').update('s3cret:203.0.113.9').digest('hex');
    expect(hashIp('203.0.113.9', 's3cret')).toBe(expected);
    expect(hashIp('203.0.113.9', 's3cret')).toHaveLength(64);
  });

  it('never returns the address itself and differs per salt', () => {
    expect(hashIp('203.0.113.9', 'a')).not.toContain('203.0.113.9');
    expect(hashIp('203.0.113.9', 'a')).not.toBe(hashIp('203.0.113.9', 'b'));
  });

  it('hashIpOrNull: null/empty/whitespace → null, otherwise trimmed and hashed', () => {
    expect(hashIpOrNull(null, IP_HASH_DEV_SALT)).toBeNull();
    expect(hashIpOrNull('   ', IP_HASH_DEV_SALT)).toBeNull();
    expect(hashIpOrNull(' 10.0.0.1 ', IP_HASH_DEV_SALT)).toBe(hashIp('10.0.0.1', IP_HASH_DEV_SALT));
    expect(IP_HASH_DEV_SALT).toBe('dev-default-salt');
  });
});
```

`apps/backend/src/modules/website/website-form-catalog.spec.ts`:
```ts
// apps/backend/src/modules/website/website-form-catalog.spec.ts
/** WP3a — the ten website form keys (from @jobsadmire/constants), their handler kinds and
 *  the per-form field whitelist (RC5). The catalog is the contract the website (WP2) wires
 *  to; a key or field not listed here never reaches a handler, and every visitor-facing
 *  validation lives HERE, before the row (RC4/P8). */
import { WebsiteFormKind } from '@prisma/client';
import { WEBSITE_FORM_KEYS, WEBSITE_FORM_KIND_BY_KEY } from '@jobsadmire/constants';
import { normalizeWebsiteFields, WEBSITE_FORM_CATALOG, websiteFormSpec } from './website-form-catalog';

describe('website form catalog', () => {
  it('covers exactly the ten keys of @jobsadmire/constants and agrees with WEBSITE_FORM_KIND_BY_KEY', () => {
    expect(Object.keys(WEBSITE_FORM_CATALOG).sort()).toEqual([...WEBSITE_FORM_KEYS].sort());
    for (const key of WEBSITE_FORM_KEYS) {
      expect({ key, kind: String(websiteFormSpec(key)!.kind) }).toEqual({ key, kind: String(WEBSITE_FORM_KIND_BY_KEY[key]) });
    }
    expect(websiteFormSpec('hire')!.kind).toBe(WebsiteFormKind.INQUIRY);
    expect(websiteFormSpec('fraud')!.kind).toBe(WebsiteFormKind.FRAUD_REPORT);
    expect(websiteFormSpec('nope')).toBeNull();
    expect(websiteFormSpec('')).toBeNull();
  });

  it('newsletter is inactive by default until counsel clears it (P4 / D14); every other form is active', () => {
    expect(websiteFormSpec('newsletter')!.activeByDefault).toBe(false);
    for (const k of WEBSITE_FORM_KEYS.filter((x) => x !== 'newsletter')) {
      expect({ k, active: websiteFormSpec(k)!.activeByDefault }).toEqual({ k, active: true });
    }
  });

  it('strips unknown keys, trims, lowercases e-mail, uppercases ISO country, keeps the typed phone', () => {
    const r = normalizeWebsiteFields('hire', {
      name: '  Ayşe Yılmaz ', company: 'Acme', email: 'AYSE@Example.COM', phone: '0532 123 45 67',
      country: 'tr', message: 'Need 20 welders', evil: '<script>',
    });
    expect(r).toEqual({
      ok: true,
      dropped: ['evil'],
      fields: { name: 'Ayşe Yılmaz', company: 'Acme', email: 'ayse@example.com', phone: '0532 123 45 67', country: 'TR', message: 'Need 20 welders' },
    });
  });

  it('refuses missing required fields, over-long values, bad e-mail, bad ISO code, bad enum — all at once', () => {
    const r = normalizeWebsiteFields('contact', {
      email: 'not-an-email', country: 'Turkey', iAm: 'alien', message: 'x'.repeat(5001),
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toEqual(expect.arrayContaining([
      'name is required', 'email must be an e-mail address', 'country must be a two-letter ISO code',
      'iAm must be one of direct_employer, hr_agency, sourcing_partner, job_seeker', 'message is too long (max 5000)',
    ]));
  });

  it('hire and workers only accept the employer-side "I am" values', () => {
    const r = normalizeWebsiteFields('workers', { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567', iAm: 'job_seeker' });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toEqual(['iAm must be one of direct_employer, hr_agency']);
  });

  it('refuses non-string values and a phone with fewer than 8 digits', () => {
    const r = normalizeWebsiteFields('callback', { name: { a: 1 }, phone: '12-34' });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toEqual(expect.arrayContaining(['name must be a string', 'phone must contain at least 8 digits']));
  });

  it('strips control characters but keeps newlines in a message', () => {
    const r = normalizeWebsiteFields('contact', { name: 'A', email: 'a@b.co', message: 'line1\r\nline2\u0000\u0007 ' });
    expect(r.ok && r.fields.message).toBe('line1\nline2');
  });

  it('refuses a payload that is not a plain object', () => {
    expect(normalizeWebsiteFields('contact', ['a'])).toEqual({ ok: false, errors: ['fields must be an object'] });
    expect(normalizeWebsiteFields('contact', null)).toEqual({ ok: false, errors: ['fields must be an object'] });
    expect(normalizeWebsiteFields('nope', {})).toEqual({ ok: false, errors: ['unknown form'] });
  });

  it('careers (RC5/P5): cvKey must be the careers-cv/ PDF key the existing upload route returned; openingSlug is a slug', () => {
    const base = { openingSlug: 'sales-executive-istanbul', name: 'John Doe', email: 'john@acme.test', phone: '05321234567', country: 'tr' };
    const ok = normalizeWebsiteFields('careers', { ...base, cvKey: 'careers-cv/3f2b5c1e-1111-4222-8333-444455556666.PDF', expectedSalary: '45000', expectedSalaryCurrency: 'TRY' });
    expect(ok.ok).toBe(true);
    if (!ok.ok) return;
    expect(ok.fields).toMatchObject({ cvKey: 'careers-cv/3f2b5c1e-1111-4222-8333-444455556666.PDF', country: 'TR', expectedSalary: '45000' });

    const bad = normalizeWebsiteFields('careers', { ...base, openingSlug: 'Not A Slug', cvKey: 'website-fraud/x.pdf' });
    expect(bad.ok).toBe(false);
    if (bad.ok) return;
    expect(bad.errors).toEqual(expect.arrayContaining(['openingSlug has an unexpected format', 'cvKey has an unexpected format']));

    const missing = normalizeWebsiteFields('careers', { ...base });
    expect(missing.ok).toBe(false);
    if (missing.ok) return;
    expect(missing.errors).toEqual(['cvKey is required']);
  });

  it('fraud (RC5): description is 20–5000 chars; evidenceKeys is a de-duplicated list of ≤ 3 website-fraud/ keys', () => {
    const good = normalizeWebsiteFields('fraud', {
      description: 'They asked for 2,000 EUR up front for a visa that never came.',
      reporterEmail: 'R@Example.com',
      evidenceKeys: ['website-fraud/a.png', 'website-fraud/a.png', ' website-fraud/b.pdf '],
    });
    expect(good).toEqual({
      ok: true,
      dropped: [],
      fields: {
        description: 'They asked for 2,000 EUR up front for a visa that never came.',
        reporterEmail: 'r@example.com',
        evidenceKeys: ['website-fraud/a.png', 'website-fraud/b.pdf'],
      },
    });

    const short = normalizeWebsiteFields('fraud', { description: 'too short' });
    expect(short.ok).toBe(false);
    if (short.ok) return;
    expect(short.errors).toEqual(['description is too short (min 20)']);

    const d = 'x'.repeat(40);
    expect(normalizeWebsiteFields('fraud', { description: d, evidenceKeys: 'website-fraud/a.png' })).toEqual({ ok: false, errors: ['evidenceKeys must be a list'] });
    expect(normalizeWebsiteFields('fraud', { description: d, evidenceKeys: [1] })).toEqual({ ok: false, errors: ['evidenceKeys must be a list of strings'] });
    expect(normalizeWebsiteFields('fraud', { description: d, evidenceKeys: ['careers-identity/id-card-front.jpg'] })).toEqual({ ok: false, errors: ['evidenceKeys has an unexpected format'] });
    expect(normalizeWebsiteFields('fraud', { description: d, evidenceKeys: ['website-fraud/a', 'website-fraud/b', 'website-fraud/c', 'website-fraud/d'] })).toEqual({ ok: false, errors: ['evidenceKeys has too many items (max 3)'] });
    // An empty list is "no evidence", not an error, and is not stored.
    expect(normalizeWebsiteFields('fraud', { description: d, evidenceKeys: [] })).toEqual({ ok: true, dropped: [], fields: { description: d } });
  });
});
```

`apps/backend/src/modules/website/website-forms.logic.spec.ts`:
```ts
// apps/backend/src/modules/website/website-forms.logic.spec.ts
/** WP3a — pure pieces of the intake door: the dedupe key, the hour bucket, the purge date and
 *  the trusted-visitor-IP pick. */
import { Prisma } from '@prisma/client';
import {
  hourBucketFor, isUniqueViolation, purgeAfterFor, requestHashFor, visitorIpFromHeaders, visitorUserAgentFromHeaders,
} from './website-forms.logic';

describe('website-forms.logic', () => {
  it('requestHashFor is key-order independent, and changes with formKey, locale, isTest or any field', () => {
    const a = requestHashFor({ formKey: 'hire', isTest: false, locale: 'tr', fields: { name: 'A', email: 'a@b.co' } });
    const b = requestHashFor({ formKey: 'hire', isTest: false, locale: 'tr', fields: { email: 'a@b.co', name: 'A' } });
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(requestHashFor({ formKey: 'contact', isTest: false, locale: 'tr', fields: { name: 'A', email: 'a@b.co' } })).not.toBe(a);
    expect(requestHashFor({ formKey: 'hire', isTest: true, locale: 'tr', fields: { name: 'A', email: 'a@b.co' } })).not.toBe(a);
    expect(requestHashFor({ formKey: 'hire', isTest: false, locale: 'en', fields: { name: 'A', email: 'a@b.co' } })).not.toBe(a);
    expect(requestHashFor({ formKey: 'hire', isTest: false, locale: 'tr', fields: { name: 'A', email: 'a@b.co', phone: '1' } })).not.toBe(a);
    // A list value participates in order (evidence keys are already de-duplicated by the catalog).
    const withList = requestHashFor({ formKey: 'fraud', isTest: false, locale: 'tr', fields: { description: 'x', evidenceKeys: ['website-fraud/a', 'website-fraud/b'] } });
    expect(requestHashFor({ formKey: 'fraud', isTest: false, locale: 'tr', fields: { description: 'x', evidenceKeys: ['website-fraud/b', 'website-fraud/a'] } })).not.toBe(withList);
  });

  it('hourBucketFor floors to epoch hours; purgeAfterFor is 90 days later', () => {
    const t = new Date('2026-09-19T10:59:59.000Z');
    expect(hourBucketFor(t)).toBe(Math.floor(t.getTime() / 3_600_000));
    expect(hourBucketFor(new Date('2026-09-19T11:00:00.000Z'))).toBe(hourBucketFor(t) + 1);
    expect(purgeAfterFor(t).toISOString()).toBe('2026-12-18T10:59:59.000Z');
  });

  it('isUniqueViolation recognises P2002 and nothing else', () => {
    const p2002 = new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: 'test' });
    const p2003 = new Prisma.PrismaClientKnownRequestError('fk', { code: 'P2003', clientVersion: 'test' });
    expect(isUniqueViolation(p2002)).toBe(true);
    expect(isUniqueViolation(p2003)).toBe(false);
    expect(isUniqueViolation(new Error('P2002'))).toBe(false);
  });

  it('visitor IP: the website-forwarded header wins when it is a real IP; else XFF first hop; else the socket', () => {
    expect(visitorIpFromHeaders({ 'x-website-visitor-ip': '203.0.113.9', 'x-forwarded-for': '198.51.100.1, 10.0.0.1' }, '127.0.0.1')).toBe('203.0.113.9');
    expect(visitorIpFromHeaders({ 'x-website-visitor-ip': '2001:db8::1' }, null)).toBe('2001:db8::1');
    expect(visitorIpFromHeaders({ 'x-website-visitor-ip': 'not-an-ip', 'x-forwarded-for': '198.51.100.1, 10.0.0.1' }, '127.0.0.1')).toBe('198.51.100.1');
    expect(visitorIpFromHeaders({ 'x-forwarded-for': ['198.51.100.2'] }, '127.0.0.1')).toBe('198.51.100.2');
    expect(visitorIpFromHeaders({}, '127.0.0.1')).toBe('127.0.0.1');
    expect(visitorIpFromHeaders({}, null)).toBeNull();
  });

  it('visitor UA: the forwarded header wins, else the request UA, sliced to 500', () => {
    expect(visitorUserAgentFromHeaders({ 'x-website-visitor-ua': 'Safari', 'user-agent': 'node-fetch' })).toBe('Safari');
    expect(visitorUserAgentFromHeaders({ 'user-agent': 'node-fetch' })).toBe('node-fetch');
    expect(visitorUserAgentFromHeaders({ 'user-agent': 'x'.repeat(600) })).toHaveLength(500);
    expect(visitorUserAgentFromHeaders({})).toBeNull();
  });
});
```

`apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts`:
```ts
// apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts
//
// WP3a — the intake body through the global ValidationPipe exactly as main.ts configures it
// (`whitelist`, `forbidNonWhitelisted`, `transform`, `enableImplicitConversion`).
// `wa-config.dto.spec.ts` is the precedent: every service spec bypasses the pipe, and the
// nested `fields` object is exactly the kind of value implicit conversion mangles.
import { ValidationPipe } from '@nestjs/common';
import { WebsiteFormSubmitDto } from './website-form-submit.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});

async function through(body: unknown): Promise<WebsiteFormSubmitDto> {
  try {
    return (await pipe.transform(body, { type: 'body', metatype: WebsiteFormSubmitDto })) as WebsiteFormSubmitDto;
  } catch (e) {
    throw new Error(JSON.stringify((e as { getResponse?: () => unknown }).getResponse?.() ?? String(e)));
  }
}

const GOOD = { locale: 'tr', consentVersion: 'privacy-2026-09', captchaToken: 'tok', fields: { name: 'A', email: 'a@b.co' } };

describe('WebsiteFormSubmitDto through the global ValidationPipe (WP3a)', () => {
  it('a complete body arrives intact and `fields` is still the plain object the website sent', async () => {
    const dto = await through({ ...GOOD, honeypot: '', sourcePath: '/tr/isci-kirala' });
    expect(dto.fields).toEqual({ name: 'A', email: 'a@b.co' });
    expect(dto.locale).toBe('tr');
    expect(dto.consentVersion).toBe('privacy-2026-09');
    expect(dto.captchaToken).toBe('tok');
    expect(dto.honeypot).toBe('');
    expect(dto.sourcePath).toBe('/tr/isci-kirala');
  });

  it('a list inside fields survives too (fraud evidenceKeys)', async () => {
    const dto = await through({ ...GOOD, fields: { description: 'x'.repeat(30), evidenceKeys: ['website-fraud/a.png'] } });
    expect(dto.fields).toEqual({ description: 'x'.repeat(30), evidenceKeys: ['website-fraud/a.png'] });
  });

  it('refuses an unknown top-level key at the boundary', async () => {
    await expect(through({ ...GOOD, formKey: 'hire' })).rejects.toThrow(/formKey/);
  });

  it('refuses a locale outside tr|en, a missing consentVersion, and a non-object fields', async () => {
    await expect(through({ ...GOOD, locale: 'de' })).rejects.toThrow(/locale/);
    await expect(through({ locale: 'tr', fields: {} })).rejects.toThrow(/consentVersion/);
    await expect(through({ ...GOOD, fields: ['a'] })).rejects.toThrow(/fields/);
    await expect(through({ ...GOOD, fields: 'name=A' })).rejects.toThrow(/fields/);
    await expect(through({ locale: 'tr', consentVersion: 'v' })).rejects.toThrow(/fields/);
  });

  it('caps captchaToken at 2048 and consentVersion at 40', async () => {
    await expect(through({ ...GOOD, captchaToken: 'x'.repeat(2049) })).rejects.toThrow(/captchaToken/);
    await expect(through({ ...GOOD, consentVersion: 'x'.repeat(41) })).rejects.toThrow(/consentVersion/);
  });

  it('captchaToken, honeypot and sourcePath are optional', async () => {
    const dto = await through({ locale: 'en', consentVersion: 'v1', fields: { email: 'a@b.co' } });
    expect(dto.captchaToken).toBeUndefined();
    expect(dto.honeypot).toBeUndefined();
    expect(dto.sourcePath).toBeUndefined();
  });
});
```

`apps/backend/src/modules/website/website-form-seed.spec.ts`:
```ts
// apps/backend/src/modules/website/website-form-seed.spec.ts
/** WP3a — the `website_forms` seed (Task 13 B4/E4 count ten rows after `prisma db seed`).
 *  seed.ts may not import backend source, so the seed carries its own copy of the ten
 *  rows; this spec is what keeps that copy honest against the catalog (the
 *  module-notification-seed.spec.ts rule). D14/P4: the newsletter door ships built but
 *  CLOSED until counsel clears it. */
import { WebsiteFormKind } from '@prisma/client';
import { WEBSITE_FORM_KEYS } from '@jobsadmire/constants';
import { seedWebsiteForms, WEBSITE_FORM_SEED } from '../../../prisma/website-form-seed';
import { websiteFormSpec } from './website-form-catalog';

describe('website form seed', () => {
  it('has one row per catalog key, agreeing on kind, label and default activity', () => {
    expect(WEBSITE_FORM_SEED.map((r) => r.formKey).sort()).toEqual([...WEBSITE_FORM_KEYS].sort());
    for (const row of WEBSITE_FORM_SEED) {
      const spec = websiteFormSpec(row.formKey)!;
      expect({ key: row.formKey, kind: row.kind, label: row.label, isActive: row.isActive }).toEqual({
        key: row.formKey, kind: spec.kind, label: spec.label, isActive: spec.activeByDefault,
      });
    }
  });

  it('seeds the newsletter form inactive and every other form active', () => {
    const newsletter = WEBSITE_FORM_SEED.find((r) => r.formKey === 'newsletter')!;
    expect(newsletter.kind).toBe(WebsiteFormKind.NEWSLETTER);
    expect(newsletter.isActive).toBe(false);
    for (const row of WEBSITE_FORM_SEED.filter((r) => r.formKey !== 'newsletter')) {
      expect({ key: row.formKey, isActive: row.isActive }).toEqual({ key: row.formKey, isActive: true });
    }
  });

  it('upserts create-only (`update: {}`) so an operator flipping isActive by SQL survives every deploy', async () => {
    const upsert = jest.fn(async () => ({}));
    const n = await seedWebsiteForms({ websiteForm: { upsert } });
    expect(n).toBe(10);
    expect(upsert).toHaveBeenCalledTimes(10);
    for (const [args] of upsert.mock.calls as unknown as Array<[{ where: unknown; create: unknown; update: unknown }]>) {
      expect(args.update).toEqual({});
    }
    expect(upsert).toHaveBeenCalledWith({
      where: { formKey: 'newsletter' },
      create: { formKey: 'newsletter', kind: WebsiteFormKind.NEWSLETTER, label: 'Newsletter sign-up', isActive: false },
      update: {},
    });
  });
});
```

`apps/backend/src/modules/website/website-captcha.service.spec.ts`:
```ts
// apps/backend/src/modules/website/website-captcha.service.spec.ts
/** WP3a P6 — the website's own Turnstile verifier. Auth failures fail closed; captcha
 *  INFRASTRUCTURE failures degrade (D11): an invalid token is a 403 upstream, a missing secret
 *  or an unreachable Cloudflare is `degraded`, never a silent `true`. The secret comes from
 *  Task 4's `resolveSecrets()` (RC7 / check). */
import { WebsiteCaptchaService } from './website-captcha.service';

type FetchMock = jest.Mock<Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>, [string, RequestInit]>;

function secrets(turnstileSecret: string | null) {
  return { writeToken: 'w', previousWriteToken: null, previousWriteTokenExpiresAt: null, testToken: 't', turnstileSecret, revalidateSecret: null };
}

function make(secret: string | null, fetchImpl?: FetchMock) {
  const config = { resolveSecrets: jest.fn(async () => secrets(secret)) };
  const fetchMock: FetchMock =
    fetchImpl ?? jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ success: true }) }));
  (global as unknown as { fetch: unknown }).fetch = fetchMock;
  return { svc: new WebsiteCaptchaService(config as never), config, fetchMock };
}

const realFetch = (global as unknown as { fetch: unknown }).fetch;
afterEach(() => {
  (global as unknown as { fetch: unknown }).fetch = realFetch;
});

describe('WebsiteCaptchaService', () => {
  it('no secret configured → degraded(secretMissing) and Cloudflare is never called', async () => {
    const { svc, fetchMock } = make(null);
    await expect(svc.verify('tok', '203.0.113.9')).resolves.toEqual({ outcome: 'degraded', reason: 'secretMissing' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('secret configured but no token → failed (the widget is missing on the page, not Cloudflare)', async () => {
    const { svc, fetchMock } = make('turnstile-secret');
    await expect(svc.verify(undefined, null)).resolves.toEqual({ outcome: 'failed', codes: ['missing-input-response'] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts secret/response/remoteip form-encoded to siteverify and passes on success:true', async () => {
    const { svc, fetchMock, config } = make('turnstile-secret');
    await expect(svc.verify('tok', '203.0.113.9')).resolves.toEqual({ outcome: 'passed' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(init.method).toBe('POST');
    expect(String(init.body)).toBe('secret=turnstile-secret&response=tok&remoteip=203.0.113.9');
    expect(config.resolveSecrets).toHaveBeenCalledTimes(1);
  });

  it('success:false → failed with Cloudflare error codes', async () => {
    const { svc } = make('s', jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ success: false, 'error-codes': ['timeout-or-duplicate'] }) })));
    await expect(svc.verify('tok', null)).resolves.toEqual({ outcome: 'failed', codes: ['timeout-or-duplicate'] });
  });

  it('HTTP 5xx → degraded(httpError); a thrown fetch (timeout, DNS) → degraded(unreachable)', async () => {
    const a = make('s', jest.fn(async () => ({ ok: false, status: 503, json: async () => ({}) })));
    await expect(a.svc.verify('tok', null)).resolves.toEqual({ outcome: 'degraded', reason: 'httpError' });
    const b = make('s', jest.fn(async () => { throw new Error('fetch failed'); }));
    await expect(b.svc.verify('tok', null)).resolves.toEqual({ outcome: 'degraded', reason: 'unreachable' });
  });

  it('a secret resolver that throws (ENCRYPTION_KEY unset → 503 inside resolveSecrets) degrades instead of 500-ing the door', async () => {
    const config = { resolveSecrets: jest.fn(async () => { throw new Error('ENCRYPTION_KEY is not configured.'); }) };
    const svc = new WebsiteCaptchaService(config as never);
    await expect(svc.verify('tok', null)).resolves.toEqual({ outcome: 'degraded', reason: 'secretMissing' });
  });
});
```

`apps/backend/src/modules/website/website-forms.service.spec.ts`:
```ts
// apps/backend/src/modules/website/website-forms.service.spec.ts
/**
 * WP3a P8 — the intake door's ordering is the whole point: form → trip → whitelist →
 * honeypot → captcha → the submission ROW (dedupe by unique key, P2002 replays the prior
 * answer) → the handler → post-steps that may warn but never throw. A row written before
 * the handler is what makes a website retry safe; a throw after it is what would file a
 * lead twice. RC6: every alarm/notification goes through WebsiteNotifyService,
 * WebsiteAbuseService owns the trip, WebsiteAutoresponderService the visitor mail.
 */
import { BadRequestException, ForbiddenException, HttpException, NotFoundException } from '@nestjs/common';
import { ActivityType, Prisma, WebsiteFormKind, WebsiteSubmissionStatus, WebsiteTokenClass } from '@prisma/client';
import { WebsiteFormsService, WEBSITE_SYSTEM_ACTOR } from './website-forms.service';
import { WebsiteFormHandlerRegistry, WebsiteFormHandler, WebsiteFormHandlerInput } from './website-form-handler';

type Args = Record<string, unknown>;

interface MakeOver {
  verdict?: { outcome: 'passed' } | { outcome: 'failed'; codes: string[] } | { outcome: 'degraded'; reason: 'secretMissing' | 'httpError' | 'unreachable' };
  formRow?: { id: string; formKey: string; kind: WebsiteFormKind; isActive: boolean } | null;
  tripped?: boolean;
  handler?: WebsiteFormHandler | null;
}

function make(over: MakeOver = {}) {
  const formRow = over.formRow === undefined
    ? { id: 'form-hire', formKey: 'hire', kind: WebsiteFormKind.INQUIRY, isActive: true }
    : over.formRow;
  let createdRow: Record<string, unknown> = { id: 'sub1' };
  const prisma = {
    websiteForm: {
      findUnique: jest.fn(async (_a: Args) => formRow),
      create: jest.fn(async (a: Args) => ({ id: 'form-new', ...(a.data as object) })),
    },
    websiteFormSubmission: {
      create: jest.fn(async (a: Args) => {
        createdRow = { id: 'sub1', handlerResultJson: null, createdEntityType: null, createdEntityId: null, purgeAfter: null, ...(a.data as object) };
        return createdRow;
      }),
      findUnique: jest.fn(async (_a: Args): Promise<Record<string, unknown> | null> => null),
      // Task 7's rerun spec convention: `update` answers the full row with the patch applied.
      update: jest.fn(async (a: Args) => ({ ...createdRow, ...(a.data as object) })),
    },
  };
  const captcha = { verify: jest.fn(async () => over.verdict ?? { outcome: 'passed' }) };
  const registry = new WebsiteFormHandlerRegistry();
  const handler: WebsiteFormHandler = over.handler === undefined
    ? {
        kinds: [WebsiteFormKind.INQUIRY],
        handle: jest.fn(async (_i: WebsiteFormHandlerInput) => ({ ok: true as const, createdEntityType: 'inquiry' as const, createdEntityId: 'inq1', detail: { inquiryNumber: 'INQ-2026-001', assignedAgentId: 'u9' } })),
      }
    : (over.handler as WebsiteFormHandler);
  if (handler) registry.register(handler);
  const activity = { log: jest.fn(async () => undefined) };
  const notify = { formReceived: jest.fn(async () => undefined), formsUnavailable: jest.fn(async () => true) };
  const abuse = {
    isTripped: jest.fn(async () => over.tripped ?? false),
    recordVerified: jest.fn(async () => ({ count: 1, tripped: false, justTripped: false })),
    trippedForms: jest.fn(async () => [] as string[]),
  };
  const autoresponder = { send: jest.fn(async () => true) };
  const config = { get: jest.fn((_k: string, d?: string) => d ?? 'salt') };
  const svc = new WebsiteFormsService(
    prisma as never, config as never, captcha as never, registry, activity as never, notify as never, abuse as never, autoresponder as never,
  );
  return { svc, prisma, captcha, handler, activity, notify, abuse, autoresponder };
}

const CAPTCHA_TOKEN = '0.turnstile-response-9f3a7c1d';
const DTO = { locale: 'tr' as const, consentVersion: 'privacy-2026-09', captchaToken: CAPTCHA_TOKEN, fields: { name: 'Ayşe', company: 'Acme', email: 'a@b.co', phone: '05321234567', message: 'hi' } };
const CTX = { tokenClass: 'write' as const, visitorIp: '203.0.113.9', userAgent: 'Safari' };

describe('WebsiteFormsService.submit', () => {
  it('happy path: row first (RECEIVED, WRITE, hashed IP, hour bucket), then the handler, then HANDLED + activity + notify + autoresponder', async () => {
    const { svc, prisma, handler, activity, notify, abuse, autoresponder } = make();
    const res = await svc.submit('hire', DTO, CTX);

    const created = prisma.websiteFormSubmission.create.mock.calls[0][0].data as Record<string, unknown>;
    expect(created).toMatchObject({
      formId: 'form-hire', formKey: 'hire', status: WebsiteSubmissionStatus.RECEIVED, isTest: false, tokenClass: WebsiteTokenClass.WRITE,
      locale: 'tr', consentVersion: 'privacy-2026-09', captchaPassed: true, captchaDegraded: false, userAgent: 'Safari', purgeAfter: null,
    });
    expect(created.ipAddressHash).toMatch(/^[0-9a-f]{64}$/);
    expect(created.ipAddressHash).not.toContain('203.0.113.9');
    expect(typeof created.hourBucket).toBe('number');
    expect(created.requestHash).toMatch(/^[0-9a-f]{64}$/);
    expect((created.payloadJson as { fields: Record<string, string> }).fields.email).toBe('a@b.co');
    expect(JSON.stringify(created)).not.toContain(CAPTCHA_TOKEN); // the captcha token is never persisted ('tok' would false-match `tokenClass`)

    // The handler ran AFTER the row existed and got the normalised fields.
    expect(handler.handle).toHaveBeenCalledTimes(1);
    const input = (handler.handle as jest.Mock).mock.calls[0][0] as WebsiteFormHandlerInput;
    expect(input).toMatchObject({ submissionId: 'sub1', formKey: 'hire', kind: WebsiteFormKind.INQUIRY, dryRun: false, locale: 'tr', consentVersion: 'privacy-2026-09', captchaDegraded: false, visitorIp: '203.0.113.9', userAgent: 'Safari' });
    expect(input.fields).toEqual({ name: 'Ayşe', company: 'Acme', email: 'a@b.co', phone: '05321234567', message: 'hi' });
    expect(prisma.websiteFormSubmission.create.mock.invocationCallOrder[0]).toBeLessThan((handler.handle as jest.Mock).mock.invocationCallOrder[0]);

    const upd = prisma.websiteFormSubmission.update.mock.calls[0][0] as { where: { id: string }; data: Record<string, unknown> };
    expect(upd.where).toEqual({ id: 'sub1' });
    expect(upd.data).toMatchObject({ status: WebsiteSubmissionStatus.HANDLED, createdEntityType: 'inquiry', createdEntityId: 'inq1', error: null });
    expect(upd.data.handledAt).toBeInstanceOf(Date);
    expect(upd.data.purgeAfter).toBeInstanceOf(Date);
    const attempts = (upd.data.handlerResultJson as { attempts: Record<string, unknown>[] }).attempts;
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({ ok: true, dryRun: false, rerun: false, actor: 'system:website', createdEntityType: 'inquiry', createdEntityId: 'inq1', detail: { inquiryNumber: 'INQ-2026-001' } });

    expect(abuse.isTripped).toHaveBeenCalledWith('hire');
    expect(abuse.recordVerified).toHaveBeenCalledWith('hire');
    expect(activity.log).toHaveBeenCalledWith(expect.objectContaining({ type: ActivityType.WEBSITE_SUBMISSION_RECEIVED, actor: WEBSITE_SYSTEM_ACTOR, subject: { type: 'website-submission', id: 'sub1' }, ipAddress: null }));
    expect(activity.log).toHaveBeenCalledWith(expect.objectContaining({ type: ActivityType.WEBSITE_SUBMISSION_HANDLED, context: { type: 'inquiry', id: 'inq1' } }));
    expect(notify.formReceived).toHaveBeenCalledTimes(1);
    expect(notify.formReceived).toHaveBeenCalledWith({ submissionId: 'sub1', formKey: 'hire', contactName: 'Ayşe', inquiryNumber: 'INQ-2026-001', assignedAgentId: 'u9' });
    expect(notify.formsUnavailable).not.toHaveBeenCalled();
    expect(autoresponder.send).toHaveBeenCalledWith({ formKey: 'hire', locale: 'tr', to: 'a@b.co', name: 'Ayşe', isTest: false });
    expect(res).toEqual({ data: { id: 'sub1', formKey: 'hire', status: 'HANDLED', isTest: false, replayed: false, captchaDegraded: false, error: null } });
  });

  it('a filled honeypot writes a SPAM row with a purge date, calls neither captcha nor handler nor notify, and answers like a success', async () => {
    const { svc, prisma, captcha, handler, notify, abuse, autoresponder } = make();
    const res = await svc.submit('hire', { ...DTO, honeypot: 'http://spam' }, CTX);
    expect(captcha.verify).not.toHaveBeenCalled();
    expect(handler.handle).not.toHaveBeenCalled();
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(abuse.recordVerified).not.toHaveBeenCalled();
    expect(autoresponder.send).not.toHaveBeenCalled();
    const created = prisma.websiteFormSubmission.create.mock.calls[0][0].data as Record<string, unknown>;
    expect(created).toMatchObject({ status: WebsiteSubmissionStatus.SPAM, captchaPassed: null, captchaDegraded: false });
    expect(created.purgeAfter).toBeInstanceOf(Date);
    expect(res.data.status).toBe('SPAM');
  });

  it('captcha failed → 403 and NO row', async () => {
    const { svc, prisma } = make({ verdict: { outcome: 'failed', codes: ['invalid-input-response'] } });
    await expect(svc.submit('hire', DTO, CTX)).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.websiteFormSubmission.create).not.toHaveBeenCalled();
  });

  it('captcha degraded → accepted, row flagged captchaDegraded/captchaPassed null, handler runs, once-per-window alarm via notify, not counted as verified', async () => {
    const { svc, prisma, handler, notify, abuse } = make({ verdict: { outcome: 'degraded', reason: 'unreachable' } });
    const res = await svc.submit('hire', DTO, CTX);
    const created = prisma.websiteFormSubmission.create.mock.calls[0][0].data as Record<string, unknown>;
    expect(created).toMatchObject({ captchaDegraded: true, captchaPassed: null });
    expect(handler.handle).toHaveBeenCalled();
    expect((handler.handle as jest.Mock).mock.calls[0][0]).toMatchObject({ captchaDegraded: true });
    expect(notify.formsUnavailable).toHaveBeenCalledWith({ reason: 'captchaDegraded', formKey: 'hire', submissionId: 'sub1', detail: 'unreachable' });
    expect(abuse.recordVerified).not.toHaveBeenCalled();
    expect(res.data.captchaDegraded).toBe(true);
  });

  it('P2002 on the unique (formKey, requestHash, hourBucket) replays the prior row and runs nothing', async () => {
    const { svc, prisma, handler, notify, abuse } = make();
    prisma.websiteFormSubmission.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: 'test' }) as never,
    );
    prisma.websiteFormSubmission.findUnique.mockResolvedValueOnce({ id: 'sub0', formKey: 'hire', status: 'HANDLED', isTest: false, captchaDegraded: false });
    const res = await svc.submit('hire', DTO, CTX);
    const where = prisma.websiteFormSubmission.findUnique.mock.calls[0][0].where as Record<string, unknown>;
    expect(where.formKey_requestHash_hourBucket).toMatchObject({ formKey: 'hire' });
    expect(handler.handle).not.toHaveBeenCalled();
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(abuse.recordVerified).not.toHaveBeenCalled(); // a retry is not a second verified lead
    expect(res).toEqual({ data: { id: 'sub0', formKey: 'hire', status: 'HANDLED', isTest: false, replayed: true, captchaDegraded: false, error: null } });
  });

  it('a throwing handler → row FAILED with the error, attempt recorded, handlerFailed alarm, NO formReceived, NO autoresponder, HTTP 200', async () => {
    const boom: WebsiteFormHandler = { kinds: [WebsiteFormKind.INQUIRY], handle: jest.fn(async () => { throw new Error('assignment engine down'); }) };
    const { svc, prisma, notify, autoresponder, activity } = make({ handler: boom });
    const res = await svc.submit('hire', DTO, CTX);
    const upd = prisma.websiteFormSubmission.update.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(upd.data).toMatchObject({ status: WebsiteSubmissionStatus.FAILED, error: 'assignment engine down', handledAt: null, purgeAfter: null, createdEntityType: null, createdEntityId: null });
    expect((upd.data.handlerResultJson as { attempts: Record<string, unknown>[] }).attempts[0]).toMatchObject({ ok: false, error: 'assignment engine down' });
    expect(notify.formsUnavailable).toHaveBeenCalledWith({ reason: 'handlerFailed', formKey: 'hire', submissionId: 'sub1', detail: 'assignment engine down' });
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(autoresponder.send).not.toHaveBeenCalled();
    expect(activity.log).toHaveBeenCalledWith(expect.objectContaining({ type: ActivityType.WEBSITE_SUBMISSION_FAILED }));
    expect(res.data.status).toBe('FAILED');
    expect(res.data.error).toBeNull(); // RC26: an infrastructure failure is never shown to the visitor
  });

  it('a handler answering { ok: false } is recorded the same way as a throw', async () => {
    const soft: WebsiteFormHandler = { kinds: [WebsiteFormKind.INQUIRY], handle: jest.fn(async () => ({ ok: false as const, error: 'mailbox refused', detail: { code: 550 } })) };
    const { svc, prisma, notify } = make({ handler: soft });
    const res = await svc.submit('hire', DTO, CTX);
    const upd = prisma.websiteFormSubmission.update.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(upd.data).toMatchObject({ status: WebsiteSubmissionStatus.FAILED, error: 'mailbox refused' });
    expect((upd.data.handlerResultJson as { attempts: Record<string, unknown>[] }).attempts[0]).toMatchObject({ ok: false, error: 'mailbox refused', detail: { code: 550 } });
    expect(notify.formsUnavailable).toHaveBeenCalledWith(expect.objectContaining({ reason: 'handlerFailed', detail: 'mailbox refused' }));
    expect(res.data.status).toBe('FAILED');
    expect(res.data.error).toBeNull();
  });

  it('RC26: a handler reporting a VISITOR error ({ ok: false, detail: { visitorError: true } }) is FAILED without the handlerFailed alarm, and the door answers 200 with the visitor-safe message', async () => {
    const visitor: WebsiteFormHandler = {
      kinds: [WebsiteFormKind.INQUIRY],
      handle: jest.fn(async () => ({ ok: false as const, error: 'Opening not found or no longer accepting applications', detail: { visitorError: true, rejectedBy: 'careers-public', statusCode: 404 } })),
    };
    const { svc, prisma, notify, autoresponder, activity } = make({ handler: visitor });
    const res = await svc.submit('hire', DTO, CTX);
    const upd = prisma.websiteFormSubmission.update.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(upd.data).toMatchObject({ status: WebsiteSubmissionStatus.FAILED, error: 'Opening not found or no longer accepting applications', createdEntityId: null });
    const stored = upd.data.handlerResultJson as { attempts: Record<string, unknown>[]; visitorError?: boolean };
    expect(stored.visitorError).toBe(true);
    expect(stored.attempts[0]).toMatchObject({ ok: false, error: 'Opening not found or no longer accepting applications', detail: { visitorError: true } });
    expect(notify.formsUnavailable).not.toHaveBeenCalled(); // the visitor's mistake is not an outage
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(autoresponder.send).not.toHaveBeenCalled();
    expect(activity.log).toHaveBeenCalledWith(expect.objectContaining({ type: ActivityType.WEBSITE_SUBMISSION_FAILED }));
    expect(res).toEqual({ data: { id: 'sub1', formKey: 'hire', status: 'FAILED', isTest: false, replayed: false, captchaDegraded: false, error: 'Opening not found or no longer accepting applications' } });
  });

  it('no handler registered for the kind → FAILED (never a 500), so the lead is still in the inbox', async () => {
    const { svc, prisma } = make({ handler: null });
    const res = await svc.submit('hire', DTO, CTX);
    expect(res.data.status).toBe('FAILED');
    const upd = prisma.websiteFormSubmission.update.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(upd.data.error).toMatch(/No handler registered for INQUIRY/);
  });

  it('a failing row UPDATE after the handler is swallowed and the answer still reports the handler outcome', async () => {
    const { svc, prisma } = make();
    prisma.websiteFormSubmission.update.mockRejectedValueOnce(new Error('db gone') as never);
    const res = await svc.submit('hire', DTO, CTX);
    expect(res.data.status).toBe('HANDLED');
  });

  it('a rejecting notify / abuse / autoresponder after the row is swallowed too — nothing past the created row may throw', async () => {
    const { svc, notify, abuse, autoresponder, activity } = make();
    abuse.recordVerified.mockRejectedValueOnce(new Error('redis down') as never);
    notify.formReceived.mockRejectedValueOnce(new Error('bull down') as never);
    autoresponder.send.mockRejectedValueOnce(new Error('smtp down') as never);
    activity.log.mockRejectedValueOnce(new Error('activity down') as never);
    const res = await svc.submit('hire', DTO, CTX);
    expect(res.data.status).toBe('HANDLED');
  });

  it('test token class (P2/RC2): full validation + captcha + dedupe + row isTest=true/TEST, handler dry-run, no activity, no notify, no autoresponder, no verified count', async () => {
    const { svc, prisma, captcha, handler, activity, notify, abuse, autoresponder } = make();
    const res = await svc.submit('hire', DTO, { ...CTX, tokenClass: 'test' });
    expect(captcha.verify).toHaveBeenCalled();
    const created = prisma.websiteFormSubmission.create.mock.calls[0][0].data as Record<string, unknown>;
    expect(created).toMatchObject({ isTest: true, tokenClass: WebsiteTokenClass.TEST });
    const input = (handler.handle as jest.Mock).mock.calls[0][0] as WebsiteFormHandlerInput;
    expect(input.dryRun).toBe(true);
    expect(activity.log).not.toHaveBeenCalled();
    expect(notify.formReceived).not.toHaveBeenCalled();
    expect(autoresponder.send).not.toHaveBeenCalled();
    expect(abuse.recordVerified).not.toHaveBeenCalled();
    expect(res.data.isTest).toBe(true);
  });

  it('a dry-run handler that still reports a created entity is recorded WITHOUT the entity (a test must never point at a real row)', async () => {
    const { svc, prisma } = make();
    await svc.submit('hire', DTO, { ...CTX, tokenClass: 'test' });
    const upd = prisma.websiteFormSubmission.update.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(upd.data.createdEntityId).toBeNull();
    expect(upd.data.createdEntityType).toBeNull();
    expect((upd.data.handlerResultJson as { attempts: Record<string, unknown>[] }).attempts[0]).toMatchObject({ dryRun: true });
  });

  it('previous-write token class (RC2): a real lead recorded as PREVIOUS_WRITE, isTest=false, counted as verified', async () => {
    const { svc, prisma, abuse, notify } = make();
    await svc.submit('hire', DTO, { ...CTX, tokenClass: 'previous-write' });
    const created = prisma.websiteFormSubmission.create.mock.calls[0][0].data as Record<string, unknown>;
    expect(created).toMatchObject({ isTest: false, tokenClass: WebsiteTokenClass.PREVIOUS_WRITE });
    expect(abuse.recordVerified).toHaveBeenCalledWith('hire');
    expect(notify.formReceived).toHaveBeenCalledTimes(1);
  });

  it('detail flags (RC4): skipNotification / skipAutoresponder / alreadyReceived are honoured; detail.contactName and detail.email win over the fields', async () => {
    const quiet: WebsiteFormHandler = { kinds: [WebsiteFormKind.INQUIRY], handle: jest.fn(async () => ({ ok: true as const, detail: { skipNotification: true, skipAutoresponder: true } })) };
    const a = make({ handler: quiet });
    await a.svc.submit('hire', DTO, CTX);
    expect(a.notify.formReceived).not.toHaveBeenCalled();
    expect(a.autoresponder.send).not.toHaveBeenCalled();
    expect((a.prisma.websiteFormSubmission.update.mock.calls[0][0] as { data: Record<string, unknown> }).data.status).toBe(WebsiteSubmissionStatus.HANDLED);

    const dup: WebsiteFormHandler = { kinds: [WebsiteFormKind.INQUIRY], handle: jest.fn(async () => ({ ok: true as const, detail: { alreadyReceived: true } })) };
    const b = make({ handler: dup });
    await b.svc.submit('hire', DTO, CTX);
    expect(b.notify.formReceived).not.toHaveBeenCalled();
    expect(b.autoresponder.send).not.toHaveBeenCalled();

    const named: WebsiteFormHandler = { kinds: [WebsiteFormKind.INQUIRY], handle: jest.fn(async () => ({ ok: true as const, detail: { contactName: 'Reporter R', email: 'r@example.com' } })) };
    const c = make({ handler: named });
    await c.svc.submit('hire', DTO, CTX);
    expect(c.notify.formReceived).toHaveBeenCalledWith({ submissionId: 'sub1', formKey: 'hire', contactName: 'Reporter R', inquiryNumber: null, assignedAgentId: null });
    expect(c.autoresponder.send).toHaveBeenCalledWith({ formKey: 'hire', locale: 'tr', to: 'r@example.com', name: 'Reporter R', isTest: false });
  });

  it('unknown formKey → 404; inactive form → 404; tripped form → 429 with the WhatsApp hint and no row; bad fields → 400 with the reasons', async () => {
    await expect(make().svc.submit('nope', DTO, CTX)).rejects.toBeInstanceOf(NotFoundException);
    await expect(make({ formRow: { id: 'f', formKey: 'hire', kind: WebsiteFormKind.INQUIRY, isActive: false } }).svc.submit('hire', DTO, CTX)).rejects.toBeInstanceOf(NotFoundException);

    const tripped = make({ tripped: true });
    const err = await tripped.svc.submit('hire', DTO, CTX).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(HttpException);
    expect((err as HttpException).getStatus()).toBe(429);
    expect((err as HttpException).getResponse()).toMatchObject({ statusCode: 429, reason: 'tripped', fallback: 'whatsapp' });
    expect(tripped.prisma.websiteFormSubmission.create).not.toHaveBeenCalled();
    expect(tripped.captcha.verify).not.toHaveBeenCalled();

    const bad = make();
    const badErr = await bad.svc.submit('hire', { ...DTO, fields: { email: 'x' } }, CTX).catch((e: unknown) => e);
    expect(badErr).toBeInstanceOf(BadRequestException);
    expect((badErr as BadRequestException).getResponse()).toMatchObject({ message: 'Invalid form fields', errors: expect.arrayContaining(['name is required', 'email must be an e-mail address']) });
    expect(bad.prisma.websiteFormSubmission.create).not.toHaveBeenCalled();
  });

  it('a form row missing from the DB is created from the catalog (newsletter inactive by default) — the seed is a convenience, not a dependency', async () => {
    const { svc, prisma } = make({ formRow: null });
    await expect(svc.submit('newsletter', { ...DTO, fields: { email: 'a@b.co' } }, CTX)).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.websiteForm.create).toHaveBeenCalledWith({ data: { formKey: 'newsletter', kind: WebsiteFormKind.NEWSLETTER, label: 'Newsletter sign-up', isActive: false } });
  });

  it('the registry refuses two handlers for one kind', () => {
    const r = new WebsiteFormHandlerRegistry();
    const h: WebsiteFormHandler = { kinds: [WebsiteFormKind.VISIT], handle: async () => ({ ok: true }) };
    r.register(h);
    expect(() => r.register(h)).toThrow(/VISIT/);
    expect(r.get(WebsiteFormKind.VISIT)).toBe(h);
    expect(r.get(WebsiteFormKind.FRAUD_REPORT)).toBeNull();
  });
});
```

Modify `apps/backend/test/permissions/website-door-conformance.spec.ts` (Task 4's spec). Replace the line

```ts
    expect(report.public).toBe(1);
```

with

```ts
    // ping + forms/:formKey — both public, both behind the class-level guard chain.
    expect(report.public).toBe(2);
```

and replace the line

```ts
    expect(keyOf(WebsitePublicController, 'ping')).toBeUndefined();
```

with

```ts
    expect(keyOf(WebsitePublicController, 'ping')).toBeUndefined();
    expect(keyOf(WebsitePublicController, 'submitForm')).toBeUndefined();
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/common/utils/ip-hash.util.spec.ts src/modules/website test/permissions/website-door-conformance.spec.ts --maxWorkers=2
```
Expected: the seven new `src` suites fail at import time — `Cannot find module './ip-hash.util'` / `'./website-form-catalog'` / `'./website-forms.logic'` / `'./website-form-submit.dto'` / `'../../../prisma/website-form-seed'` / `'./website-captcha.service'` / `'./website-forms.service'`; `website-door-conformance.spec.ts` fails on `expect(report.public).toBe(2)` (received 1). Task 2/3/4's website suites still pass.

- [ ] **Step 3: Implement**

3.1 `apps/backend/src/common/utils/ip-hash.util.ts`
```ts
import { createHash } from 'crypto';

/** The fallback the three private copies use; a missing IP_HASH_SALT silently weakens the hash. */
export const IP_HASH_DEV_SALT = 'dev-default-salt';

/**
 * sha256(`${salt}:${ip}`) hex — the app-wide "never the address itself" rule
 * (schema.prisma `ipAddressHash` doc-comments). Lifted for the website intake door
 * (WP3a); the private copies in careers-public.service.ts:1391,
 * hrm-contract-signing.service.ts:694 and
 * internal-recruitment/offer-letter/offer-letter.service.ts:2727 are left in place on
 * purpose (same formula, no behaviour change outside this work package).
 */
export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export function hashIpOrNull(ip: string | null | undefined, salt: string): string | null {
  const trimmed = ip?.trim();
  return trimmed ? hashIp(trimmed, salt) : null;
}
```

3.2 `apps/backend/src/modules/website/website-form-catalog.ts`
```ts
import { WebsiteFormKind } from '@prisma/client';
import { isWebsiteFormKey, WebsiteFormKey } from '@jobsadmire/constants';

/**
 * The ten `?form=` keys the website uses (`WEBSITE_FORM_KEYS` in @jobsadmire/constants —
 * the one list the website, this door and the admin UI share) mapped onto the seven
 * handler kinds, plus the per-form field whitelist. This file IS the forms contract v1
 * the website's server actions send to (RC5): anything not listed here is dropped at
 * the door, every visitor-facing validation happens HERE before the submission row
 * (RC4/P8 — handlers never throw for visitor errors), and the global ValidationPipe
 * cannot do this job because the whitelist depends on the `:formKey` path param.
 *
 * Values are strings (trimmed, control characters stripped). Phones are kept as typed
 * (E.164 is the handler's concern — the inbox shows what the visitor wrote); e-mails
 * are lowercased; ISO codes uppercased. `array-of-key` (fraud evidence) is the one
 * list-valued type.
 */
export type WebsiteFieldType = 'text' | 'email' | 'phone' | 'iso2' | 'enum' | 'key' | 'array-of-key';

export interface WebsiteFieldSpec {
  /** Maximum length of the value — of each item for `array-of-key`. */
  max: number;
  min?: number;
  required?: boolean;
  type?: WebsiteFieldType;
  values?: readonly string[];
  pattern?: RegExp;
  /** `array-of-key` only: maximum number of items after de-duplication. */
  maxItems?: number;
}

export interface WebsiteFormSpec {
  kind: WebsiteFormKind;
  label: string;
  /** `WebsiteForm.isActive` when the row is first created (P4: newsletter stays off until counsel clears — D14). */
  activeByDefault: boolean;
  fields: Record<string, WebsiteFieldSpec>;
}

export const I_AM_VALUES = ['direct_employer', 'hr_agency', 'sourcing_partner', 'job_seeker'] as const;
export const EMPLOYER_I_AM_VALUES = ['direct_employer', 'hr_agency'] as const;

const name: WebsiteFieldSpec = { max: 120, required: true };
const email: WebsiteFieldSpec = { max: 254, type: 'email' };
const phone: WebsiteFieldSpec = { max: 40, type: 'phone' };
const company: WebsiteFieldSpec = { max: 200 };
const country: WebsiteFieldSpec = { max: 2, type: 'iso2' };
const message: WebsiteFieldSpec = { max: 5000 };
const iAm: WebsiteFieldSpec = { max: 40, type: 'enum', values: I_AM_VALUES };
const employerIAm: WebsiteFieldSpec = { max: 40, type: 'enum', values: EMPLOYER_I_AM_VALUES };
const headcount: WebsiteFieldSpec = { max: 10 };
const currency: WebsiteFieldSpec = { max: 3 };
const salary: WebsiteFieldSpec = { max: 20 };

export const WEBSITE_FORM_CATALOG: Record<WebsiteFormKey, WebsiteFormSpec> = {
  hire: {
    kind: WebsiteFormKind.INQUIRY, label: 'Hire workers', activeByDefault: true,
    fields: { name, company: { ...company, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country, iAm: employerIAm, sector: { max: 120 }, roleNeeded: { max: 200 }, headcount, startWhen: { max: 120 }, message },
  },
  contact: {
    kind: WebsiteFormKind.INQUIRY, label: 'Contact', activeByDefault: true,
    fields: { name, email: { ...email, required: true }, phone, company, country, iAm, subject: { max: 200 }, message: { ...message, required: true } },
  },
  partner: {
    kind: WebsiteFormKind.INQUIRY, label: 'Partner with us', activeByDefault: true,
    fields: { name, company: { ...company, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country: { ...country, required: true }, candidatesPerYear: { max: 20 }, trades: { max: 500 }, licence: { max: 200 }, message },
  },
  workers: {
    kind: WebsiteFormKind.INQUIRY, label: 'Request available workers', activeByDefault: true,
    fields: { name, company: { ...company, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country, iAm: employerIAm, trade: { max: 200 }, headcount, startWhen: { max: 120 }, message },
  },
  callback: {
    kind: WebsiteFormKind.CALLBACK, label: 'Request a callback', activeByDefault: true,
    fields: { name, phone: { ...phone, required: true }, email, preferredTime: { max: 120 }, topic: { max: 200 } },
  },
  visit: {
    kind: WebsiteFormKind.VISIT, label: 'Book an office visit', activeByDefault: true,
    fields: { name, company, email: { ...email, required: true }, phone: { ...phone, required: true }, office: { max: 120 }, preferredDate: { max: 40 }, preferredTime: { max: 40 }, message },
  },
  calculator: {
    kind: WebsiteFormKind.CALCULATOR_QUOTE, label: 'Cost calculator quote', activeByDefault: true,
    fields: { name, email: { ...email, required: true }, phone, company, country, headcount, trade: { max: 200 }, durationMonths: { max: 10 }, estimateSummary: { max: 2000 }, message },
  },
  // P5: the CV is uploaded through the EXISTING public POST /api/careers/upload-cv; the
  // website sends back that route's `data.key` as `cvKey` (RC5). Field caps mirror
  // careers-public's PublicApplyDto (careers-public.dto.ts:95-146).
  careers: {
    kind: WebsiteFormKind.CAREERS_APPLY, label: 'Careers application', activeByDefault: true,
    fields: {
      openingSlug: { max: 200, required: true, pattern: /^[a-z0-9-]+$/ },
      cvKey: { max: 300, required: true, type: 'key', pattern: /^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i },
      name: { max: 200, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country: { ...country, required: true },
      city: { max: 100 }, language: { max: 300 },
      expectedSalary: salary, expectedSalaryCurrency: currency, currentSalary: salary, currentSalaryCurrency: currency,
      coverLetter: { max: 5000 }, linkedinUrl: { max: 500 },
    },
  },
  // RC3/RC5: evidence objects arrive through POST /website/v1/uploads/fraud-evidence
  // (Task 8) as `website-fraud/…` keys; the report carries the keys only (P4).
  fraud: {
    kind: WebsiteFormKind.FRAUD_REPORT, label: 'Fraud report', activeByDefault: true,
    fields: {
      reporterName: { max: 120 }, reporterEmail: email, reporterPhone: phone,
      description: { max: 5000, min: 20, required: true },
      suspectName: { max: 200 }, suspectContact: { max: 300 },
      evidenceKeys: { max: 300, type: 'array-of-key', maxItems: 3, pattern: /^website-fraud\/[A-Za-z0-9._-]+$/ },
    },
  },
  newsletter: {
    kind: WebsiteFormKind.NEWSLETTER, label: 'Newsletter sign-up', activeByDefault: false,
    fields: { email: { ...email, required: true }, name: { max: 120 } },
  },
};

export function websiteFormSpec(formKey: string): WebsiteFormSpec | null {
  return isWebsiteFormKey(formKey) ? WEBSITE_FORM_CATALOG[formKey] : null;
}

export type WebsiteFieldValue = string | string[];

export type NormalizedFields =
  | { ok: true; fields: Record<string, WebsiteFieldValue>; dropped: string[] }
  | { ok: false; errors: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Everything in C0/DEL except \t and \n (\r is folded into \n first). */
const CONTROL_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;

function clean(v: string): string {
  return v.replace(/\r\n?/g, '\n').replace(CONTROL_RE, '').trim();
}

/** `array-of-key`: returns the de-duplicated list, `[]` when absent, `null` after pushing an error. */
function normalizeKeyList(key: string, f: WebsiteFieldSpec, v: unknown, errors: string[]): string[] | null {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) {
    errors.push(`${key} must be a list`);
    return null;
  }
  if (v.some((item) => typeof item !== 'string')) {
    errors.push(`${key} must be a list of strings`);
    return null;
  }
  const items = Array.from(new Set((v as string[]).map((s) => clean(s)).filter((s) => s !== '')));
  if (f.maxItems !== undefined && items.length > f.maxItems) {
    errors.push(`${key} has too many items (max ${f.maxItems})`);
    return null;
  }
  for (const item of items) {
    if (item.length > f.max || (f.pattern && !f.pattern.test(item))) {
      errors.push(`${key} has an unexpected format`);
      return null;
    }
  }
  return items;
}

/**
 * Whitelist + shape the website payload for one form. Errors are collected, not
 * thrown, so the 400 lists every problem at once. Unknown keys are dropped (and
 * reported in `dropped` for a debug line), never errors — a website deploy that adds a
 * field ahead of the door must not break the door.
 */
export function normalizeWebsiteFields(formKey: string, raw: unknown): NormalizedFields {
  const spec = websiteFormSpec(formKey);
  if (!spec) return { ok: false, errors: ['unknown form'] };
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, errors: ['fields must be an object'] };
  const input = raw as Record<string, unknown>;
  const errors: string[] = [];
  const fields: Record<string, WebsiteFieldValue> = {};

  for (const [key, f] of Object.entries(spec.fields)) {
    const v = input[key];

    if (f.type === 'array-of-key') {
      const list = normalizeKeyList(key, f, v, errors);
      if (list === null) continue;
      if (list.length === 0) {
        if (f.required) errors.push(`${key} is required`);
        continue;
      }
      fields[key] = list;
      continue;
    }

    if (v === undefined || v === null || v === '') {
      if (f.required) errors.push(`${key} is required`);
      continue;
    }
    if (typeof v !== 'string' && typeof v !== 'number' && typeof v !== 'boolean') {
      errors.push(`${key} must be a string`);
      continue;
    }
    let s = clean(String(v));
    if (s === '') {
      if (f.required) errors.push(`${key} is required`);
      continue;
    }
    if (f.type === 'iso2') {
      // An ISO field's only error is the ISO message — 'Turkey' is not "too long", it is
      // not a code — so this runs before the generic length check.
      s = s.toUpperCase();
      if (!/^[A-Z]{2}$/.test(s)) {
        errors.push(`${key} must be a two-letter ISO code`);
        continue;
      }
      fields[key] = s;
      continue;
    }
    if (s.length > f.max) {
      errors.push(`${key} is too long (max ${f.max})`);
      continue;
    }
    if (f.min !== undefined && s.length < f.min) {
      errors.push(`${key} is too short (min ${f.min})`);
      continue;
    }
    switch (f.type) {
      case 'email':
        s = s.toLowerCase();
        if (!EMAIL_RE.test(s)) errors.push(`${key} must be an e-mail address`);
        break;
      case 'phone':
        if (s.replace(/\D/g, '').length < 8) errors.push(`${key} must contain at least 8 digits`);
        break;
      case 'enum':
        if (!f.values?.includes(s)) errors.push(`${key} must be one of ${(f.values ?? []).join(', ')}`);
        break;
      case 'key':
      case 'text':
      default:
        if (f.pattern && !f.pattern.test(s)) errors.push(`${key} has an unexpected format`);
        break;
    }
    fields[key] = s;
  }

  if (errors.length) return { ok: false, errors };
  const dropped = Object.keys(input).filter((k) => !(k in spec.fields));
  return { ok: true, fields, dropped };
}
```

3.3 `apps/backend/src/modules/website/website-forms.logic.ts`
```ts
import { createHash } from 'crypto';
import { isIP } from 'net';
import { Prisma } from '@prisma/client';
import type { WebsiteFieldValue } from './website-form-catalog';

export const WEBSITE_PURGE_DAYS = 90;
const HOUR_MS = 3_600_000;

export interface RequestHashInput {
  formKey: string;
  isTest: boolean;
  locale: string;
  fields: Record<string, WebsiteFieldValue>;
}

/**
 * sha256 of the canonical (key-sorted) payload. With `hourBucket` it is the row's unique
 * key (P8, D11): the same payload inside one hour is ONE row and a replay of the first
 * answer. `isTest` is part of the hash so a heartbeat can never mask a real lead with
 * the same text.
 */
export function requestHashFor(input: RequestHashInput): string {
  const fields = Object.fromEntries(Object.entries(input.fields).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  return createHash('sha256')
    .update(JSON.stringify({ formKey: input.formKey, isTest: input.isTest, locale: input.locale, fields }))
    .digest('hex');
}

export function hourBucketFor(now: Date): number {
  return Math.floor(now.getTime() / HOUR_MS);
}

/** P10: 90 days after HANDLED (also stamped on SPAM rows at creation). */
export function purgeAfterFor(from: Date): Date {
  return new Date(from.getTime() + WEBSITE_PURGE_DAYS * 24 * HOUR_MS);
}

/** Unique-constraint violation — the door's idempotency signal, never an error. */
export function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}

type HeaderBag = Record<string, string | string[] | undefined>;

function first(h: string | string[] | undefined): string | null {
  if (Array.isArray(h)) return h.length ? h[0].split(',')[0].trim() : null;
  if (typeof h === 'string' && h.length) return h.split(',')[0].trim();
  return null;
}

/**
 * The website's server calls this door, so the first X-Forwarded-For hop is the website's
 * egress, not the visitor. The website forwards the visitor's address in
 * `X-Website-Visitor-Ip`; it is trusted only because the route is bearer-token guarded
 * (the website server is the only caller) and validated as an IP before use. Fallbacks
 * mirror careers-public.controller.ts:426-436.
 */
export function visitorIpFromHeaders(headers: HeaderBag, socketAddress: string | null | undefined): string | null {
  const forwarded = first(headers['x-website-visitor-ip']);
  if (forwarded && isIP(forwarded) !== 0) return forwarded;
  const xff = first(headers['x-forwarded-for']);
  if (xff) return xff;
  return socketAddress ?? null;
}

export function visitorUserAgentFromHeaders(headers: HeaderBag): string | null {
  const ua = first(headers['x-website-visitor-ua']) ?? first(headers['user-agent']);
  return ua ? ua.slice(0, 500) : null;
}
```

3.4 `apps/backend/src/modules/website/dto/website-form-submit.dto.ts`
```ts
import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const WEBSITE_LOCALES = ['tr', 'en'] as const;
export type WebsiteLocale = (typeof WEBSITE_LOCALES)[number];

/**
 * Body of `POST /website/v1/forms/:formKey` (RC14 — the DTO the gate reads). The
 * per-form field whitelist lives in `website-form-catalog.ts` because it depends on the
 * path param; this DTO only shapes the envelope. `fields` is handed through with
 * `@Transform(({ obj }) => obj.fields)` (wa-campaign.dto.ts:56 precedent) — under
 * `enableImplicitConversion` a nested value can be rebuilt from the reflected type, and
 * the pipe-level spec pins that the object arrives intact.
 */
export class WebsiteFormSubmitDto {
  // Spread: swagger's `enum` and older class-validator typings want a mutable string[], not the readonly tuple.
  @ApiProperty({ enum: [...WEBSITE_LOCALES] })
  @IsIn([...WEBSITE_LOCALES])
  locale: WebsiteLocale;

  @ApiProperty({ description: 'Version id of the privacy text the visitor accepted (D11 consent evidence)' })
  @IsString()
  @MaxLength(40)
  consentVersion: string;

  @ApiPropertyOptional({ description: 'Turnstile token from the widget; absent when the site has no site key' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  captchaToken?: string;

  @ApiPropertyOptional({ description: 'Honeypot input; humans leave it empty' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  honeypot?: string;

  @ApiPropertyOptional({ description: 'Path of the page the form was on' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  sourcePath?: string;

  @ApiProperty({ type: 'object', additionalProperties: true, description: 'Form fields; whitelisted per formKey by the catalog' })
  @Transform(({ obj }) => (obj as { fields?: unknown }).fields)
  @IsObject()
  fields: Record<string, unknown>;
}
```

3.5 `apps/backend/prisma/website-form-seed.ts`
```ts
/**
 * Seeded `website_forms` rows (WP3a, rulings P4/RC1).
 *
 * Same rules as `module-notification-seed.ts`: seed.ts must never import from
 * `apps/backend/src/` (the production image ships no `src/`), so the ten rows are
 * duplicated here from `src/modules/website/website-form-catalog.ts` and
 * `website-form-seed.spec.ts` asserts, row for row, that the copy agrees with the
 * catalog. Create-only (`update: {}`): the seed runs on every container boot and
 * `isActive` is flipped by SQL (RC12 — the newsletter door opens only when counsel
 * clears it, D14), so an upsert that wrote on update would re-close it on every deploy.
 * The door also lazily creates a missing row from the catalog (`ensureFormRow`), so this
 * pass is what makes the ten rows VISIBLE before the first submission, not a dependency.
 */

import { WebsiteFormKind } from '@prisma/client';

export interface WebsiteFormSeedRow {
  formKey: string;
  kind: WebsiteFormKind;
  label: string;
  isActive: boolean;
}

/** The minimum of a Prisma client this pass needs — so a spec can hand it a fake. */
export interface WebsiteFormSeedClient {
  websiteForm: {
    upsert(args: { where: { formKey: string }; create: WebsiteFormSeedRow; update: Record<string, never> }): Promise<unknown>;
  };
}

export const WEBSITE_FORM_SEED: WebsiteFormSeedRow[] = [
  { formKey: 'hire', kind: WebsiteFormKind.INQUIRY, label: 'Hire workers', isActive: true },
  { formKey: 'contact', kind: WebsiteFormKind.INQUIRY, label: 'Contact', isActive: true },
  { formKey: 'partner', kind: WebsiteFormKind.INQUIRY, label: 'Partner with us', isActive: true },
  { formKey: 'workers', kind: WebsiteFormKind.INQUIRY, label: 'Request available workers', isActive: true },
  { formKey: 'callback', kind: WebsiteFormKind.CALLBACK, label: 'Request a callback', isActive: true },
  { formKey: 'visit', kind: WebsiteFormKind.VISIT, label: 'Book an office visit', isActive: true },
  { formKey: 'calculator', kind: WebsiteFormKind.CALCULATOR_QUOTE, label: 'Cost calculator quote', isActive: true },
  { formKey: 'careers', kind: WebsiteFormKind.CAREERS_APPLY, label: 'Careers application', isActive: true },
  { formKey: 'fraud', kind: WebsiteFormKind.FRAUD_REPORT, label: 'Fraud report', isActive: true },
  // D14 / P4: built but closed until counsel clears the newsletter; opened by SQL (RC12).
  { formKey: 'newsletter', kind: WebsiteFormKind.NEWSLETTER, label: 'Newsletter sign-up', isActive: false },
];

/** Ensures the ten rows exist; never touches an existing row. Returns how many were ensured. */
export async function seedWebsiteForms(prisma: WebsiteFormSeedClient): Promise<number> {
  for (const row of WEBSITE_FORM_SEED) {
    await prisma.websiteForm.upsert({ where: { formKey: row.formKey }, create: row, update: {} });
  }
  return WEBSITE_FORM_SEED.length;
}
```

3.6 Modify `apps/backend/prisma/seed.ts`. Replace the line

```ts
import { seedModuleNotificationSettings } from './module-notification-seed';
```

with

```ts
import { seedModuleNotificationSettings } from './module-notification-seed';
import { seedWebsiteForms } from './website-form-seed';
```

and replace the line

```ts
  console.log(`  ✓ Module notification settings: ${notificationRows} event(s) ensured (existing rows untouched)`);
```

with

```ts
  console.log(`  ✓ Module notification settings: ${notificationRows} event(s) ensured (existing rows untouched)`);
  // WP3a — the ten public form rows. Create-only: `isActive` is an operator's SQL flip (D14).
  const websiteFormRows = await seedWebsiteForms(prisma);
  console.log(`  ✓ Website forms: ${websiteFormRows} row(s) ensured (existing rows untouched)`);
```

3.7 `apps/backend/src/modules/website/website-captcha.service.ts`
```ts
import { Injectable, Logger } from '@nestjs/common';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';

export type WebsiteCaptchaVerdict =
  | { outcome: 'passed' }
  | { outcome: 'failed'; codes: string[] }
  | { outcome: 'degraded'; reason: 'secretMissing' | 'httpError' | 'unreachable' };

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
/** Under the website server action's own budget; careers-public uses 10 s. */
const VERIFY_TIMEOUT_MS = 6_000;

/**
 * Turnstile for the marketing site (P6) — a SIBLING of careers-public's CaptchaService,
 * not a change to it: that one reads an env secret and fails CLOSED on a Cloudflare
 * outage, which is right for a job application and wrong for a lead door (D11: auth
 * failures fail closed, captcha INFRASTRUCTURE failures degrade). The secret is the one
 * on WebsiteIntegrationConfig, read through Task 4's cached, per-secret-try/catch
 * `resolveSecrets()` (one Cloudflare widget lists both hostnames — P6).
 *
 *   passed   → the visitor solved the widget
 *   failed   → Cloudflare said no, or a secret is set and no token came → 403 upstream
 *   degraded → no usable secret, HTTP error, timeout → accepted upstream with
 *              captchaDegraded=true and a once-per-window WEBSITE_FORMS_UNAVAILABLE
 *
 * Never returns a bare `true`; the caller must look at the verdict (RC7).
 */
@Injectable()
export class WebsiteCaptchaService {
  private readonly logger = new Logger(WebsiteCaptchaService.name);

  constructor(private readonly config: WebsiteIntegrationConfigService) {}

  private async secret(): Promise<string | null> {
    try {
      return (await this.config.resolveSecrets()).turnstileSecret;
    } catch (err) {
      // ENCRYPTION_KEY unset (resolveSecrets throws 503) or a DB blip: degrade, never 500 the public door.
      this.logger.warn(`Turnstile secret unreadable: ${(err as Error).message}`);
      return null;
    }
  }

  async verify(token: string | undefined, remoteIp: string | null): Promise<WebsiteCaptchaVerdict> {
    const secret = await this.secret();
    if (!secret) return { outcome: 'degraded', reason: 'secretMissing' };
    if (!token) return { outcome: 'failed', codes: ['missing-input-response'] };

    const params = new URLSearchParams();
    params.set('secret', secret);
    params.set('response', token);
    if (remoteIp) params.set('remoteip', remoteIp);

    try {
      const res = await fetch(SITEVERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
      });
      if (!res.ok) {
        this.logger.warn(`Turnstile siteverify HTTP ${res.status} — degrading`);
        return { outcome: 'degraded', reason: 'httpError' };
      }
      const body = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
      if (body.success === true) return { outcome: 'passed' };
      return { outcome: 'failed', codes: body['error-codes'] ?? [] };
    } catch (err) {
      this.logger.warn(`Turnstile siteverify unreachable — degrading: ${(err as Error).message}`);
      return { outcome: 'degraded', reason: 'unreachable' };
    }
  }
}
```

3.8 `apps/backend/src/modules/website/website-form-handler.ts`
```ts
import { Injectable } from '@nestjs/common';
import { WebsiteFormKind } from '@prisma/client';
import type { WebsiteLocale } from './dto/website-form-submit.dto';
import type { WebsiteFieldValue } from './website-form-catalog';

/**
 * The handler contract (RC4). Visitor-facing validation is the catalog's job and has
 * already happened when a handler runs; a handler throws (or answers `ok: false`) only
 * for INFRASTRUCTURE failures, which the core records as a FAILED row — still HTTP 200,
 * re-runnable from the inbox (P8).
 */
export interface WebsiteFormHandlerInput {
  submissionId: string;
  formKey: string;
  kind: WebsiteFormKind;
  locale: WebsiteLocale;
  /** P2: the `test` token class. A handler MUST return before any write when this is true. */
  dryRun: boolean;
  /** Whitelisted by the catalog; strings, except list-valued fields such as fraud `evidenceKeys`. */
  fields: Record<string, WebsiteFieldValue>;
  consentVersion: string;
  captchaDegraded: boolean;
  /** Null on a re-run (only the hash is stored). */
  visitorIp: string | null;
  userAgent: string | null;
}

export type WebsiteCreatedEntityType = 'inquiry' | 'applicant' | 'subscriber' | 'object';

/**
 * `detail` is free-form and stored per attempt, but the core READS these keys (RC4):
 *   alreadyReceived   — a duplicate the handler recognised (e.g. an applicant who already
 *                       applied): recorded HANDLED, no notification, no autoresponder
 *   skipNotification  — do not raise WEBSITE_FORM_RECEIVED for this one
 *   skipAutoresponder — do not mail the visitor (careers and newsletter mail their own)
 *   inquiryNumber, assignedAgentId — shown in the staff notification
 *   contactName, email — who the visitor is, when the form's fields are not `name`/`email`
 *   visitorError      — on `{ ok: false }` only (RC26): the failure is the VISITOR's mistake
 *                       surfaced by a downstream service (a closed opening, a residency
 *                       rule); the core files FAILED + `error`, skips the handlerFailed
 *                       alarm and returns the message in the door response's `error`
 */
export type WebsiteFormHandlerResult =
  | { ok: true; createdEntityType?: WebsiteCreatedEntityType; createdEntityId?: string; detail?: Record<string, unknown> }
  | { ok: false; error: string; detail?: Record<string, unknown> };

export interface WebsiteFormHandler {
  readonly kinds: readonly WebsiteFormKind[];
  handle(input: WebsiteFormHandlerInput): Promise<WebsiteFormHandlerResult>;
}

/**
 * Handlers register themselves in their constructor (Nest has no multi-provider). A kind
 * with no handler is a FAILED row, never a 500 — the lead is in the inbox either way.
 */
@Injectable()
export class WebsiteFormHandlerRegistry {
  private readonly handlers = new Map<WebsiteFormKind, WebsiteFormHandler>();

  register(handler: WebsiteFormHandler): void {
    for (const kind of handler.kinds) {
      if (this.handlers.has(kind)) throw new Error(`Website form handler for ${kind} registered twice`);
      this.handlers.set(kind, handler);
    }
  }

  get(kind: WebsiteFormKind): WebsiteFormHandler | null {
    return this.handlers.get(kind) ?? null;
  }
}
```

3.9 `apps/backend/src/modules/website/website-notify.service.ts` (contract shell — Task 10 replaces the whole file, keeping every exported name and signature; its constructor grows there)
```ts
import { Injectable, Logger } from '@nestjs/common';

/** P9/P10 alarm reasons. Task 10 moves this type to `website-alarms.logic.ts` and imports it here. */
export type WebsiteUnavailableReason = 'captchaDegraded' | 'tripped' | 'untripped' | 'drought' | 'handlerFailed';

export interface WebsiteFormReceivedInput {
  submissionId: string;
  formKey: string;
  contactName?: string | null;
  inquiryNumber?: string | null;
  assignedAgentId?: string | null;
}

export interface WebsiteFormsUnavailableInput {
  reason: WebsiteUnavailableReason;
  formKey?: string | null;
  submissionId?: string | null;
  detail?: string | null;
  count?: number;
  hours?: number;
  lastSubmissionAt?: Date | null;
  /** Injected by specs; the clock the once-per-day key is cut on. */
  now?: Date;
}

/**
 * The website module's ONE door to the notifications registry and to the second human
 * (P9, RC6). THIS COMMIT SHIPS THE CONTRACT ONLY: the forms core (Task 6) is written and
 * tested against these two methods, and Task 10 implements them (registry dispatch,
 * SET NX EX once-per-window, the second-human `queueEmail`) in this same file with its
 * own spec. Until then every call logs a WARN and does nothing — the row is already
 * committed, so the lead is never lost, only unannounced. Both methods never throw.
 */
@Injectable()
export class WebsiteNotifyService {
  private readonly logger = new Logger(WebsiteNotifyService.name);

  async formReceived(input: WebsiteFormReceivedInput): Promise<void> {
    this.logger.warn(`WEBSITE_FORM_RECEIVED for ${input.formKey}/${input.submissionId} not delivered: notify service not wired yet (Task 10)`);
  }

  /** Returns whether the alarm fired (false = another emitter already spoke this window). */
  async formsUnavailable(input: WebsiteFormsUnavailableInput): Promise<boolean> {
    this.logger.warn(`WEBSITE_FORMS_UNAVAILABLE(${input.reason}) for ${input.formKey ?? '*'} not delivered: notify service not wired yet (Task 10)`);
    return false;
  }
}
```

3.10 `apps/backend/src/modules/website/website-abuse.service.ts` (contract shell — Task 10 replaces the whole file; RC6 keys `website:abuse:count|tripped|announced:<form>` live there)
```ts
import { Injectable } from '@nestjs/common';

/**
 * Abuse auto-trip for the public forms (P10, RC6). THIS COMMIT SHIPS THE CONTRACT ONLY:
 * the door calls `isTripped` before persisting anything (→ 429 with the WhatsApp hint)
 * and `recordVerified` after a new captcha-verified real row; Task 10 implements the
 * Redis counters, the trip/untrip transitions and `trippedForms` for ping in this same
 * file with its own spec, and injects this class into Task 4's WebsitePingService.
 * Fail OPEN (a door that 429s because a cache died is the outage D11 is about): the
 * shell answers "not tripped, not counted".
 */
@Injectable()
export class WebsiteAbuseService {
  /** Is this form answering 429 right now? */
  async isTripped(_formKey: string): Promise<boolean> {
    return false;
  }

  /** Count one captcha-VERIFIED, non-test submission. */
  async recordVerified(_formKey: string, _now: Date = new Date()): Promise<{ count: number; tripped: boolean; justTripped: boolean }> {
    return { count: 0, tripped: false, justTripped: false };
  }

  /** Every tripped form, for `ping` (P11). */
  async trippedForms(): Promise<string[]> {
    return [];
  }
}
```

3.11 `apps/backend/src/modules/website/website-autoresponder.service.ts` (contract shell — Task 10 replaces the whole file with the `.hbs` EN/TR senders)
```ts
import { Injectable, Logger } from '@nestjs/common';

/**
 * Autoresponders for the public forms (P9). THIS COMMIT SHIPS THE CONTRACT ONLY: the
 * forms core calls `send` after a successful non-dry-run handler unless the handler
 * said `skipAutoresponder`; Task 10 implements the per-form EN/TR `.hbs` mail from the
 * default mailbox in this same file with its own spec (careers and newsletter excluded —
 * they mail their own). Never throws; returns whether a mail was queued.
 */
@Injectable()
export class WebsiteAutoresponderService {
  private readonly logger = new Logger(WebsiteAutoresponderService.name);

  async send(input: { formKey: string; locale?: string | null; to?: string | null; name?: string | null; isTest: boolean }): Promise<boolean> {
    if (input.isTest || !input.to) return false;
    this.logger.warn(`autoresponder for ${input.formKey} not sent: autoresponder service not wired yet (Task 10)`);
    return false;
  }
}
```

3.12 `apps/backend/src/modules/website/website-forms.service.ts`
```ts
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActivityType, Prisma, WebsiteForm, WebsiteFormSubmission, WebsiteSubmissionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogger, ActivitySystemActor } from '../activities/activity-logger.service';
import { hashIpOrNull, IP_HASH_DEV_SALT } from '../../common/utils/ip-hash.util';
import { WebsiteFormSubmitDto } from './dto/website-form-submit.dto';
import { normalizeWebsiteFields, websiteFormSpec, WebsiteFieldValue, WebsiteFormSpec } from './website-form-catalog';
import { hourBucketFor, isUniqueViolation, purgeAfterFor, requestHashFor } from './website-forms.logic';
import { PRISMA_TOKEN_CLASS_BY_BEARER, WebsiteBearerClass } from './website.constants';
import { WebsiteCaptchaService } from './website-captcha.service';
import { WebsiteFormHandlerRegistry, WebsiteFormHandlerResult } from './website-form-handler';
import { WebsiteNotifyService } from './website-notify.service';
import { WebsiteAbuseService } from './website-abuse.service';
import { WebsiteAutoresponderService } from './website-autoresponder.service';

export const WEBSITE_SYSTEM_ACTOR: ActivitySystemActor = { id: 'system:website', name: 'Website form', role: 'system' };

export interface WebsiteSubmitContext {
  /** Stamped verbatim by WebsiteApiGuard (RC2); mapped to the row's enum on create. */
  tokenClass: WebsiteBearerClass;
  visitorIp: string | null;
  userAgent: string | null;
}

export interface WebsiteSubmitResponse {
  data: {
    id: string;
    formKey: string;
    status: WebsiteSubmissionStatus;
    isTest: boolean;
    replayed: boolean;
    captchaDegraded: boolean;
    /** RC26: the visitor-safe message when the last attempt was a visitor error, else null. */
    error: string | null;
  };
}

/** One element of `handlerResultJson.attempts` (P8: per attempt). A type, not an interface, so it is JSON-assignable. */
export type WebsiteAttemptRecord = {
  at: string;
  ok: boolean;
  dryRun: boolean;
  rerun: boolean;
  actor: string;
  error?: string;
  createdEntityType?: string;
  createdEntityId?: string;
  detail?: Record<string, unknown>;
};

/** The `handlerResultJson` shape: every attempt, plus `visitorError` while the LAST attempt was a visitor error (RC26). */
export type WebsiteHandlerResultJson = {
  attempts: WebsiteAttemptRecord[];
  visitorError?: true;
};

/** The `payloadJson` shape. Task 7's rerun and Task 8's `evidenceKeysOf` read `.fields`. */
export type WebsiteStoredPayload = {
  fields: Record<string, WebsiteFieldValue>;
  sourcePath?: string;
};

export interface WebsiteRunHandlerOptions {
  dryRun: boolean;
  rerun: boolean;
  actorId: string;
}

function attemptsOf(json: Prisma.JsonValue | null): WebsiteAttemptRecord[] {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return [];
  const attempts = (json as Prisma.JsonObject).attempts;
  return Array.isArray(attempts) ? (attempts as unknown as WebsiteAttemptRecord[]) : [];
}

/** RC26: was the row's LAST attempt a visitor error (so `error` may be shown to the visitor)? */
function visitorErrorOf(json: Prisma.JsonValue | null): boolean {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return false;
  return (json as Prisma.JsonObject).visitorError === true;
}

function detailString(detail: Record<string, unknown> | undefined, key: string): string | null {
  const v = detail?.[key];
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function fieldString(fields: Record<string, WebsiteFieldValue>, key: string): string | null {
  const v = fields[key];
  return typeof v === 'string' && v ? v : null;
}

/**
 * The intake door (P8, D11). Order is the contract:
 *
 *   1. form (404) → abuse trip (429, P10) → field whitelist (400) — nothing persisted
 *   2. honeypot → SPAM row, answer like a success, stop
 *   3. captcha (P6): failed → 403 (no row); degraded → carry on flagged
 *   4. the SUBMISSION ROW, first. Unique (formKey, requestHash, hourBucket); P2002
 *      replays the prior row's answer and runs nothing else.
 *   5. the handler, then the row update with the attempt, then activity, notify (RC6),
 *      the autoresponder.
 *
 * ── NOTHING AFTER STEP 4 MAY THROW ── (wa-ai-tools.service.ts:673). The row is the
 * lead; every later step warns and carries on, so a website retry replays instead of
 * filing twice. A FAILED handler is still HTTP 200: the row is durable and re-runnable
 * from the inbox (Task 7), and the handlerFailed alarm has already gone out — unless the
 * handler marked the failure `detail.visitorError` (RC26): then the row is FAILED with
 * the message, no alarm fires, and the message is echoed in the response's `error`.
 */
@Injectable()
export class WebsiteFormsService {
  private readonly logger = new Logger(WebsiteFormsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly captcha: WebsiteCaptchaService,
    private readonly registry: WebsiteFormHandlerRegistry,
    private readonly activity: ActivityLogger,
    private readonly notify: WebsiteNotifyService,
    private readonly abuse: WebsiteAbuseService,
    private readonly autoresponder: WebsiteAutoresponderService,
  ) {}

  async submit(formKey: string, dto: WebsiteFormSubmitDto, ctx: WebsiteSubmitContext): Promise<WebsiteSubmitResponse> {
    // 1. Nothing persisted in this block.
    const spec = websiteFormSpec(formKey);
    if (!spec) throw new NotFoundException('Unknown form.');
    const form = await this.ensureFormRow(formKey, spec);
    if (!form.isActive) throw new NotFoundException('This form is not accepting submissions.');
    if (await this.abuse.isTripped(formKey)) {
      // I20: the website's visitor panel reads `fallback` and shows the WhatsApp line.
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'This form is paused for a short while. Please reach us on WhatsApp.',
          reason: 'tripped',
          fallback: 'whatsapp',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const normalized = normalizeWebsiteFields(formKey, dto.fields);
    if (!normalized.ok) throw new BadRequestException({ message: 'Invalid form fields', errors: normalized.errors });
    if (normalized.dropped.length) this.logger.debug(`${formKey}: dropped unknown fields ${normalized.dropped.join(', ')}`);

    const isTest = ctx.tokenClass === 'test';
    const now = new Date();
    const salt = this.config.get<string>('IP_HASH_SALT', IP_HASH_DEV_SALT);
    const payload: WebsiteStoredPayload = { fields: normalized.fields, ...(dto.sourcePath ? { sourcePath: dto.sourcePath } : {}) };
    const base = {
      formId: form.id,
      formKey,
      requestHash: requestHashFor({ formKey, isTest, locale: dto.locale, fields: normalized.fields }),
      hourBucket: hourBucketFor(now),
      isTest,
      tokenClass: PRISMA_TOKEN_CLASS_BY_BEARER[ctx.tokenClass],
      locale: dto.locale,
      consentVersion: dto.consentVersion,
      payloadJson: payload as Prisma.InputJsonValue,
      ipAddressHash: hashIpOrNull(ctx.visitorIp, salt),
      userAgent: ctx.userAgent?.slice(0, 500) ?? null,
    };

    // 2. Honeypot: a bot filled the hidden input. Filed as SPAM (the inbox filter can see
    //    it), no Cloudflare call, no handler, no alarm, and the same answer shape.
    if (dto.honeypot && dto.honeypot.trim().length > 0) {
      const spam = await this.createOrReplay({
        ...base, status: WebsiteSubmissionStatus.SPAM, captchaPassed: null, captchaDegraded: false, purgeAfter: purgeAfterFor(now),
      });
      return this.respond(spam.row, spam.replayed);
    }

    // 3. Captcha (P6): failed is the visitor's problem; degraded is ours.
    const verdict = await this.captcha.verify(dto.captchaToken, ctx.visitorIp);
    if (verdict.outcome === 'failed') throw new ForbiddenException('Captcha verification failed. Please retry.');
    const captchaDegraded = verdict.outcome === 'degraded';

    // 4. The row, first.
    const { row, replayed } = await this.createOrReplay({
      ...base, status: WebsiteSubmissionStatus.RECEIVED, captchaPassed: captchaDegraded ? null : true, captchaDegraded, purgeAfter: null,
    });
    if (replayed) return this.respond(row, true);

    // ── NOTHING PAST THIS POINT MAY THROW ──────────────────────────────────────────
    if (verdict.outcome === 'degraded') {
      await this.notify
        .formsUnavailable({ reason: 'captchaDegraded', formKey, submissionId: row.id, detail: verdict.reason })
        .catch((err: Error) => this.logger.warn(`captchaDegraded alarm failed for ${row.id}: ${err.message}`));
    } else if (!isTest) {
      // P10: only captcha-VERIFIED real leads count toward the trip; a replay never counts twice.
      await this.abuse
        .recordVerified(formKey)
        .catch((err: Error) => this.logger.warn(`verified counter failed for ${formKey}: ${err.message}`));
    }
    if (!isTest) {
      await this.activity
        .log({
          type: ActivityType.WEBSITE_SUBMISSION_RECEIVED,
          actor: WEBSITE_SYSTEM_ACTOR,
          subject: { type: 'website-submission', id: row.id },
          summary: `received a ${spec.label} form from the website (${dto.locale})${captchaDegraded ? ' — captcha degraded' : ''}`,
          details: { formKey, kind: form.kind, captchaDegraded, tokenClass: ctx.tokenClass },
          ipAddress: null, // ActivityEvent stores raw addresses; the hash is on the row.
        })
        .catch((err: Error) => this.logger.warn(`activity RECEIVED failed for ${row.id}: ${err.message}`));
    }

    const handled = await this.runHandler(row, form, normalized.fields, ctx, { dryRun: isTest, rerun: false, actorId: WEBSITE_SYSTEM_ACTOR.id });
    return this.respond(handled, false);
  }

  /**
   * Run the handler for a row and record the attempt. Shared by `submit` and the inbox
   * re-run (Task 7). Never throws. Post-steps (RC6): activity; on success
   * `notify.formReceived` once (unless the handler said skipNotification/alreadyReceived)
   * and the autoresponder (unless skipAutoresponder/alreadyReceived); on failure
   * `notify.formsUnavailable(handlerFailed)`. A dry run (test token) records the attempt
   * and nothing else (P2).
   */
  protected async runHandler(
    row: WebsiteFormSubmission,
    form: Pick<WebsiteForm, 'kind'>,
    fields: Record<string, WebsiteFieldValue>,
    ctx: Pick<WebsiteSubmitContext, 'visitorIp' | 'userAgent'>,
    opts: WebsiteRunHandlerOptions,
  ): Promise<WebsiteFormSubmission> {
    const handler = this.registry.get(form.kind);
    let result: WebsiteFormHandlerResult;
    if (!handler) {
      result = { ok: false, error: `No handler registered for ${form.kind}` };
    } else {
      try {
        result = await handler.handle({
          submissionId: row.id,
          formKey: row.formKey,
          kind: form.kind,
          locale: row.locale === 'en' ? 'en' : 'tr',
          dryRun: opts.dryRun,
          fields,
          consentVersion: row.consentVersion ?? '',
          captchaDegraded: row.captchaDegraded,
          visitorIp: ctx.visitorIp,
          userAgent: ctx.userAgent,
        });
      } catch (err) {
        result = { ok: false, error: (err as Error)?.message?.slice(0, 2000) || 'handler threw' };
      }
    }

    const now = new Date();
    const detail = result.detail;
    // A dry run never points at a real record, whatever the handler said.
    const createdEntityType = result.ok && !opts.dryRun ? result.createdEntityType ?? null : null;
    const createdEntityId = result.ok && !opts.dryRun ? result.createdEntityId ?? null : null;
    const attempt: WebsiteAttemptRecord = {
      at: now.toISOString(),
      ok: result.ok,
      dryRun: opts.dryRun,
      rerun: opts.rerun,
      actor: opts.actorId,
      ...(result.ok ? {} : { error: result.error }),
      ...(createdEntityType ? { createdEntityType } : {}),
      ...(createdEntityId ? { createdEntityId } : {}),
      ...(detail ? { detail } : {}),
    };
    const prior = attemptsOf(row.handlerResultJson);
    const status = result.ok ? WebsiteSubmissionStatus.HANDLED : WebsiteSubmissionStatus.FAILED;
    // RC26: the handler says this failure is the VISITOR's (a downstream 4xx) — filed as
    // FAILED so the inbox sees it, but no alarm, and the message goes back to the site.
    const visitorError = !result.ok && detail?.visitorError === true;
    const resultJson: WebsiteHandlerResultJson = { attempts: [...prior, attempt], ...(visitorError ? { visitorError: true } : {}) };

    let updated: WebsiteFormSubmission = {
      ...row,
      status,
      error: result.ok ? null : result.error,
      handlerResultJson: resultJson as unknown as Prisma.JsonValue,
      createdEntityType: createdEntityType ?? row.createdEntityType,
      createdEntityId: createdEntityId ?? row.createdEntityId,
    };
    try {
      // Merged over the row we already hold: `respond()` reads formKey / isTest /
      // captchaDegraded from what comes back, and a partial `update` answer (a narrow
      // `select`, a test double) must never blank them.
      updated = {
        ...updated,
        ...(await this.prisma.websiteFormSubmission.update({
          where: { id: row.id },
          data: {
            status,
            handledAt: result.ok ? now : null,
            createdEntityType: createdEntityType ?? row.createdEntityType,
            createdEntityId: createdEntityId ?? row.createdEntityId,
            error: result.ok ? null : result.error,
            handlerResultJson: resultJson as unknown as Prisma.InputJsonValue,
            purgeAfter: result.ok ? purgeAfterFor(now) : row.purgeAfter,
          },
        })),
      };
    } catch (err) {
      this.logger.warn(`submission ${row.id}: outcome update failed (${status}): ${(err as Error).message}`);
    }

    if (opts.dryRun) return updated;

    await this.activity
      .log({
        type: result.ok ? ActivityType.WEBSITE_SUBMISSION_HANDLED : ActivityType.WEBSITE_SUBMISSION_FAILED,
        actor: opts.actorId === WEBSITE_SYSTEM_ACTOR.id ? WEBSITE_SYSTEM_ACTOR : { id: opts.actorId, name: 'Inbox re-run', role: 'staff' },
        subject: { type: 'website-submission', id: row.id },
        ...(createdEntityType && createdEntityId ? { context: { type: createdEntityType, id: createdEntityId } } : {}),
        summary: result.ok
          ? `${opts.rerun ? 're-ran and ' : ''}filed the ${row.formKey} form${createdEntityType ? ` as ${createdEntityType} ${createdEntityId}` : ''}`
          : `${opts.rerun ? 're-run of ' : ''}the ${row.formKey} form handler failed: ${result.error}`,
        details: { formKey: row.formKey, kind: form.kind, rerun: opts.rerun, ...(detail ?? {}) },
        ipAddress: null,
      })
      .catch((err: Error) => this.logger.warn(`activity ${status} failed for ${row.id}: ${err.message}`));

    if (!result.ok) {
      if (visitorError) return updated; // RC26: the visitor's mistake is not an outage — no handlerFailed alarm.
      await this.notify
        .formsUnavailable({ reason: 'handlerFailed', formKey: row.formKey, submissionId: row.id, detail: result.error })
        .catch((err: Error) => this.logger.warn(`handlerFailed alarm failed for ${row.id}: ${err.message}`));
      return updated;
    }

    // RC6: staff learn about the lead through WebsiteNotifyService only, once, on success
    // (a FAILED row has just raised handlerFailed, which reaches the same people).
    const alreadyReceived = detail?.alreadyReceived === true;
    const contactName = detailString(detail, 'contactName') ?? fieldString(fields, 'name');
    const email = detailString(detail, 'email') ?? fieldString(fields, 'email');
    if (!alreadyReceived && detail?.skipNotification !== true) {
      await this.notify
        .formReceived({
          submissionId: row.id,
          formKey: row.formKey,
          contactName,
          inquiryNumber: detailString(detail, 'inquiryNumber'),
          assignedAgentId: detailString(detail, 'assignedAgentId'),
        })
        .catch((err: Error) => this.logger.warn(`formReceived failed for ${row.id}: ${err.message}`));
    }
    if (!alreadyReceived && detail?.skipAutoresponder !== true) {
      await this.autoresponder
        .send({ formKey: row.formKey, locale: row.locale, to: email, name: contactName, isTest: false })
        .catch((err: Error) => this.logger.warn(`autoresponder failed for ${row.id}: ${err.message}`));
    }
    return updated;
  }

  private async createOrReplay(data: Prisma.WebsiteFormSubmissionUncheckedCreateInput): Promise<{ row: WebsiteFormSubmission; replayed: boolean }> {
    try {
      return { row: await this.prisma.websiteFormSubmission.create({ data }), replayed: false };
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      const prior = await this.prisma.websiteFormSubmission.findUnique({
        where: { formKey_requestHash_hourBucket: { formKey: data.formKey, requestHash: data.requestHash, hourBucket: data.hourBucket } },
      });
      if (!prior) throw err;
      return { row: prior, replayed: true };
    }
  }

  /** The catalog is the source of truth; the row carries `isActive` and the FK. The seed makes rows visible early, the door never depends on it. */
  private async ensureFormRow(formKey: string, spec: WebsiteFormSpec): Promise<WebsiteForm> {
    const existing = await this.prisma.websiteForm.findUnique({ where: { formKey } });
    if (existing) return existing;
    try {
      return await this.prisma.websiteForm.create({ data: { formKey, kind: spec.kind, label: spec.label, isActive: spec.activeByDefault } });
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      const raced = await this.prisma.websiteForm.findUnique({ where: { formKey } });
      if (!raced) throw err;
      return raced;
    }
  }

  private respond(row: WebsiteFormSubmission, replayed: boolean): WebsiteSubmitResponse {
    return {
      data: {
        id: row.id,
        formKey: row.formKey,
        status: row.status,
        isTest: row.isTest,
        replayed,
        captchaDegraded: row.captchaDegraded,
        // RC26: only a VISITOR error is ever echoed to the site; an infrastructure error stays inside.
        error: visitorErrorOf(row.handlerResultJson) ? row.error : null,
      },
    };
  }
}
```

3.13 `apps/backend/src/modules/website/website-public.controller.ts` — Task 4's file, replaced in full (the three class-level decorators, the constructor's first argument and `ping` are byte-for-byte Task 4's; one constructor argument and one route are added):
```ts
import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { WEBSITE_FORM_KEYS } from '@jobsadmire/constants';

import { Public } from '../../common/decorators/public.decorator';
import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';
import { WebsiteApiGuard, WebsiteRequest } from './guards/website-api.guard';
import { TokenClass } from './decorators/token-class.decorator';
import { WebsitePingService } from './website-ping.service';
import { WebsiteBearerClass } from './website.constants';
import { WebsiteFormSubmitDto } from './dto/website-form-submit.dto';
import { WebsiteFormsService } from './website-forms.service';
import { visitorIpFromHeaders, visitorUserAgentFromHeaders } from './website-forms.logic';

/**
 * The public website intake door — the THIRD sanctioned public surface after
 * careers-public and the call-center/WhatsApp webhooks, argued in PRD §7.10.
 *
 * @Public() skips the user JWT (the global JwtAuthGuard and PermissionsGuard
 * both read it at class level); the class-level guard chain then runs IN ORDER:
 * WebsiteModuleEnabledGuard (the module flag, per request → generic 404,
 * ruling P1) and WebsiteApiGuard (Bearer write / test / previous-write from the
 * DB, ruling P7). Every route added to this class inherits both. The fraud-evidence
 * upload (Task 8) and the newsletter confirm/unsubscribe routes (Task 9) are sibling
 * controllers with the same three class-level decorators (RC3).
 */
@ApiTags('Website (public door)')
@Public()
@UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)
@Controller('website/v1')
export class WebsitePublicController {
  constructor(
    private readonly pingService: WebsitePingService,
    private readonly forms: WebsiteFormsService,
  ) {}

  @Get('ping')
  @ApiOperation({ summary: '[website] Readiness facts per token class (site-health + heartbeat)' })
  async ping(@TokenClass() tokenClass: WebsiteBearerClass) {
    return { data: await this.pingService.ping(tokenClass) };
  }

  /**
   * The forms door (I4, P8). The class-level guards already ran: the module flag (404
   * when off) and the bearer token, whose class `@TokenClass()` hands over verbatim
   * (RC2 — 'test' is a dry run, P2). @Throttle is deliberately absent: RateLimitGuard is
   * inert in production (rate-limit.guard.ts:30-36); dedupe, honeypot, captcha and the
   * abuse trip are the controls. 200 even for a FAILED handler — the row is durable.
   */
  @Post('forms/:formKey')
  @HttpCode(200)
  @ApiParam({ name: 'formKey', enum: [...WEBSITE_FORM_KEYS] })
  @ApiOperation({ summary: '[website] Form intake (write/test token). Row first, handler second, replay on repeat.' })
  async submitForm(
    @Param('formKey') formKey: string,
    @Body() dto: WebsiteFormSubmitDto,
    @TokenClass() tokenClass: WebsiteBearerClass,
    @Req() req: WebsiteRequest,
  ) {
    return this.forms.submit(formKey, dto, {
      tokenClass,
      visitorIp: visitorIpFromHeaders(req.headers, req.socket?.remoteAddress ?? null),
      userAgent: visitorUserAgentFromHeaders(req.headers),
    });
  }
}
```

3.14 Modify `apps/backend/src/modules/website/website.module.ts` (as Task 4 left it). Two edits; the constructor and its `registry.register({...})` literal stay byte-for-byte as Task 1 wrote them.

(1) Replace the import lines

```ts
import { WebsiteStatusController } from './website-status.controller';
import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';
import { WebsiteApiGuard } from './guards/website-api.guard';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { WebsiteIntegrationsController } from './website-integrations.controller';
import { WebsitePingService } from './website-ping.service';
import { WebsitePublicController } from './website-public.controller';
```

with

```ts
import { WebsiteStatusController } from './website-status.controller';
import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';
import { WebsiteApiGuard } from './guards/website-api.guard';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { WebsiteIntegrationsController } from './website-integrations.controller';
import { WebsitePingService } from './website-ping.service';
import { WebsitePublicController } from './website-public.controller';
import { WebsiteCaptchaService } from './website-captcha.service';
import { WebsiteFormHandlerRegistry } from './website-form-handler';
import { WebsiteNotifyService } from './website-notify.service';
import { WebsiteAbuseService } from './website-abuse.service';
import { WebsiteAutoresponderService } from './website-autoresponder.service';
import { WebsiteFormsService } from './website-forms.service';
```

(2) Replace the decorator block

```ts
@Module({
  imports: [ConfigModule, PrismaModule, PermissionsModule],
  controllers: [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController],
  // Both guards are providers of THIS module (the call-center.module.ts rule)
  // so DI can hand WebsiteApiGuard its config service; PrismaModule,
  // ConfigModule and PermissionsModule are already listed, nothing else is
  // needed (RedisModule is global and not used here).
  providers: [WebsiteModuleEnabledGuard, WebsiteApiGuard, WebsiteIntegrationConfigService, WebsitePingService],
  exports: [WebsiteIntegrationConfigService],
})
```

with

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

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/common/utils/ip-hash.util.spec.ts src/modules/website test/permissions/website-door-conformance.spec.ts --maxWorkers=2
```
Expected: green — ip-hash 3, catalog 10, logic 5, dto 6, seed 3, captcha 6, forms service 18 tests; `website-door-conformance` 4 (`public` = 2, `decorated` = 5); Task 2/3/4's website suites unchanged.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest test/permissions --maxWorkers=2
```
Expected: green — `repo-invariants.spec` counts `submitForm` under the class-level `@Public()` (source census, repo-invariants.spec.ts:596-640); the catalog hash is untouched (no new key); Task 1's `website-conformance.spec` still `errors: []`, `undecorated: []`.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/backend
```
Expected: clean (run alone — one build/typecheck job at a time on this machine). This is where a missing Prisma member (`WebsiteTokenClass`, `ActivityType.WEBSITE_SUBMISSION_*`, the `formKey_requestHash_hourBucket` compound input) or a missing `@jobsadmire/constants` export fails loudly, not at runtime.

- [ ] **Step 5: Commit** (three commits; the migration stays in its own earlier commit per P12)

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git add apps/backend/src/common/utils/ip-hash.util.ts apps/backend/src/common/utils/ip-hash.util.spec.ts \
  apps/backend/src/modules/website/website-form-catalog.ts apps/backend/src/modules/website/website-form-catalog.spec.ts \
  apps/backend/src/modules/website/website-forms.logic.ts apps/backend/src/modules/website/website-forms.logic.spec.ts \
  apps/backend/src/modules/website/dto/website-form-submit.dto.ts apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts \
  apps/backend/prisma/website-form-seed.ts apps/backend/src/modules/website/website-form-seed.spec.ts apps/backend/prisma/seed.ts
git commit -m "feat(website): form catalog, intake DTO, WebsiteForm seed and the lifted IP-hash helper (WP3a)

The ten website form keys (from @jobsadmire/constants) mapped onto the seven
handler kinds with a per-form field whitelist — the forms contract v1, incl.
careers cvKey (P5) and fraud evidenceKeys (RC5) — the envelope DTO with a
pipe-level spec, the dedupe hash / hour bucket / purge-date logic, the ten
website_forms seed rows (newsletter inactive, D14) and sha256 IP hashing lifted
into common/utils (three private copies left untouched, same formula).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"

git add apps/backend/src/modules/website/website-captcha.service.ts apps/backend/src/modules/website/website-captcha.service.spec.ts \
  apps/backend/src/modules/website/website-form-handler.ts \
  apps/backend/src/modules/website/website-notify.service.ts apps/backend/src/modules/website/website-abuse.service.ts \
  apps/backend/src/modules/website/website-autoresponder.service.ts
git commit -m "feat(website): degrading Turnstile verifier, the handler contract and the notify/abuse/autoresponder contracts (WP3a, P6/RC4/RC6)

WebsiteCaptchaService is a sibling of careers-public's verifier reading the
Integrations secret: invalid token fails closed, a missing secret or an
unreachable Cloudflare degrades. WebsiteFormHandler/Registry fix the contract
every handler self-registers against. WebsiteNotifyService, WebsiteAbuseService
and WebsiteAutoresponderService ship as signature-complete shells the forms core
injects; their bodies land with the notifications task.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"

git add apps/backend/src/modules/website/website-forms.service.ts apps/backend/src/modules/website/website-forms.service.spec.ts \
  apps/backend/src/modules/website/website-public.controller.ts apps/backend/src/modules/website/website.module.ts \
  apps/backend/test/permissions/website-door-conformance.spec.ts
git commit -m "feat(website): POST /website/v1/forms/:formKey — row first, handler second, nothing after may throw (WP3a, P8)

Form → abuse trip (429 + WhatsApp hint) → whitelist → honeypot (SPAM row) →
captcha (403 with no row; degraded = flagged + once-per-window alarm) → the
submission row on the (formKey, requestHash, hourBucket) unique key, where a
P2002 replays the prior answer → the handler, recorded per attempt in
handlerResultJson → activity, WebsiteNotifyService.formReceived once on success,
the autoresponder, handlerFailed on failure. Token class stamped verbatim
(write/test/previous-write) and mapped to the row's enum; test = dry run (P2).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

---

