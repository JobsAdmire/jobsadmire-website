### Task 10: Notifications, autoresponders, abuse trip, drought and purge for the website door

Repo: the WP3a worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations; branch `website/wp3a-intake` — RC17: every task executes from this worktree, never from the shared `main` checkout). Every relative path and every `cd apps/backend` below is inside that worktree.

**Files:**

Create
- `apps/backend/src/modules/notifications/event-registry-website.spec.ts`
- `apps/backend/src/modules/email/templates/website-forms-unavailable.hbs`, `website-forms-unavailable.tr.hbs`
- `apps/backend/src/modules/website/website-alarms.logic.ts`, `website-alarms.logic.spec.ts`
- `apps/backend/src/modules/website/website-notify.service.spec.ts`
- `apps/backend/src/modules/website/website-autoresponder.service.spec.ts`
- `apps/backend/src/modules/email/templates/website-<key>-autoresponder.hbs` + `.tr.hbs` for `<key>` ∈ hire, contact, partner, workers, callback, visit, calculator, fraud (16 files)
- `apps/backend/src/modules/website/website-abuse.service.spec.ts`
- `apps/backend/src/modules/website/website-alarms.cron.ts`, `website-alarms.cron.spec.ts`
- `apps/backend/src/modules/website/website-purge.cron.ts`, `website-purge.cron.spec.ts`

Modify (every anchor is the exact existing line text; every file below is printed in its FINAL form — RC15)
- `apps/backend/src/modules/website/website-notify.service.ts`, `website-abuse.service.ts`, `website-autoresponder.service.ts` — the three signature-complete shells Task 6 ships (RC6/RC20); each file's BODY is replaced in place here (the file is never deleted or re-created, the `WebsiteFormsService` constructor and its two specs are never touched), keeping every exported name Task 6's core and specs import; their constructors grow here and Task 10's own specs construct them with these constructors.
- `apps/backend/src/modules/notifications/event-registry.ts` — (1) the line `  getModuleViewers(module: string): Promise<string[]>;` inside `interface RecipientHelpers`; (2) the three lines starting `export const EVENT_REGISTRY: Record<string, EventDefinition> = Object.fromEntries(` (the `websiteEvents` block is inserted immediately above them); (3) the line `  | 'whatsapp.number.alert';` that ends `export type EventKey`.
- `apps/backend/src/modules/notifications/event-dispatcher.ts` — the helper starting `    getModuleViewers: async (module: string) => {` through its closing `    },` (the `AND: [holdsModuleGrant(module, PermissionAction.VIEW)],` line is inside it).
- `apps/backend/prisma/module-notification-seed.ts` — after the line `  { module: 'marketing', eventType: NotificationType.MARKETING_POST_RETURNED_TO_DRAFT, inApp: true, email: false },` (the last row before `];`).
- `apps/backend/src/modules/notifications/module-notification-seed.spec.ts` — replace everything from the line `describe('the seed table agrees with the event registry', () => {` to the end of the file.
- `apps/backend/src/modules/notifications/event-registry-coverage.spec.ts` — inside `describe('EVENT_REGISTRY coverage', …)`, after the test that ends with `      expect({ key, type: def.relatedEntityType }).toEqual({ key, type: 'whatsapp-campaign' });` + `    }` + `  });`.
- `apps/frontend/src/lib/notifications/entity-path.ts` — after the two lines `  if (type === 'whatsapp-number' || type === 'waphonenumber')` / `    return \`${base}/whatsapp/settings/numbers\`;` (before `  return null;`), and after the line `  ['WHATSAPP_', '/whatsapp'],` in `TYPE_FALLBACKS`.
- `apps/frontend/src/lib/notifications/entity-path.spec.ts` — after the line `    ['WHATSAPP_MESSAGE_RECEIVED', \`${ROOT}/whatsapp\`],` (inside `FALLBACKS`); after the line `    ['user', 'u1', \`${ROOT}/users/u1\`],` (inside the `getEntityPath` table); after the test `  it('honours the locale', () => {` … `  });` inside `describe('resolveNotificationHref — every marketing notification lands', …)`.
- `apps/backend/src/modules/website/website-ping.service.ts` (Task 4) — printed in full: `WebsiteAbuseService` becomes the third constructor argument and `trippedForms` reads it (RC1/RC6/RC13).
- `apps/backend/src/modules/website/website-ping.service.spec.ts` (Task 4) — `build()` gains the `abuse` mock (anchor: the line `    return { svc: new WebsitePingService(prisma as never, config as never), prisma, config };`) and one new test.
- `apps/backend/src/modules/website/website.module.ts` — printed in full (RC15): only the two crons are added to `providers` (+ their two import lines); the three services are Task 6's providers already (RC20); everything else is exactly what Tasks 1–9 left behind.

Test (run one job at a time, `--maxWorkers=2` — Mac Studio rule)
- `cd apps/backend && npx jest src/modules/notifications --maxWorkers=2`
- `cd apps/backend && npx jest src/modules/website --maxWorkers=2`
- `cd apps/backend && npx jest test/permissions --maxWorkers=2`
- `cd apps/frontend && npx jest src/lib/notifications/entity-path.spec.ts --maxWorkers=2`
- `cd apps/backend && npx tsc --noEmit -p tsconfig.json`

**Interfaces:**

Consumes
- Task 2 (RC1): `websiteModuleEnabled(config: ConfigService): boolean` and `WEBSITE_MODULE_ENABLED_ENV` from `apps/backend/src/modules/website/website-module-flag.ts` — the ONLY production reader of the variable; both crons begin their tick with `if (!websiteModuleEnabled(this.config)) return;` (P1). Never an inline `config.get('WEBSITE_MODULE_ENABLED')` (Task 2's `website-env.spec.ts` cell "exactly ONE production file names the variable" goes red).
- Task 3 (RC1): `NotificationType.WEBSITE_FORM_RECEIVED`, `NotificationType.WEBSITE_FORMS_UNAVAILABLE` (enum members shipped by migration `20260925120000_website_intake_door`); model `WebsiteFormSubmission` with `id`, `formKey: string`, `status: WebsiteSubmissionStatus`, `isTest: boolean`, `locale: string | null`, `payloadJson: Json`, `purgeAfter: DateTime?` (set to `handledAt + 90 d` by Task 6's `runHandler`, P10), `createdAt`; NO `attachmentKey` column — fraud keys live in `payloadJson.fields.evidenceKeys` (RC5). `WEBSITE_FORM_KEYS` (`['hire','contact','partner','workers','callback','visit','calculator','careers','fraud','newsletter'] as const`) and `type WebsiteFormKey` from `@jobsadmire/constants` (`packages/constants/src/enums/website.enums.ts`; jest maps `^@jobsadmire/constants$` to `packages/constants/src`).
- Task 4 (RC1): `WebsiteIntegrationConfigService.getOrCreate(): Promise<WebsiteIntegrationConfig>` (row carries `secondHumanEmail: string | null`, `secondHumanName: string | null`, P9) and `publicShape()`, `resolveSecrets()` (used by the ping service); `WebsitePingService(prisma: PrismaService, config: WebsiteIntegrationConfigService)` with `ping(tokenClass: WebsiteBearerClass): Promise<WebsitePingResult>` where `trippedForms` is the literal `[]` until this task; `type WebsiteBearerClass` from `./website.constants`.
- Task 6 (RC4/RC6): the core `WebsiteFormsService` with constructor `(prisma, config, captcha, registry, activity, notify: WebsiteNotifyService, abuse: WebsiteAbuseService, autoresponder: WebsiteAutoresponderService)` and its calls — `await this.abuse.isTripped(formKey)` → 429 `{ message, fallback: 'whatsapp' }` before the row; `await this.abuse.recordVerified(formKey)` after a NEW (not replayed) submission row with a PASSED (not degraded) captcha on a non-test submission (RC21); `await this.notify.formsUnavailable({ reason: 'captchaDegraded', formKey, submissionId, detail })` on a degraded verdict (`detail = verdict.reason`, RC7); after a non-dry-run handler: on `ok` and not `detail.skipNotification` → `await this.notify.formReceived({ submissionId, formKey, contactName, inquiryNumber, assignedAgentId })` (`contactName = detail.contactName ?? fields.name`, the other two from `detail`); on `ok` and not `detail.skipAutoresponder` → `await this.autoresponder.send({ formKey, locale: row.locale, to: detail.email ?? fields.email ?? null, name: contactName ?? null, isTest: row.isTest })`; on `!ok` → `await this.notify.formsUnavailable({ reason: 'handlerFailed', formKey, submissionId, detail: result.error })` unless `detail.visitorError === true` (RC26 — the visitor's own mistake never alarms). Task 6 ships the three service files as **signature-complete shells** (`@Injectable()` classes exporting exactly the names in "Produces" below with no-op bodies: `formReceived` resolves, `formsUnavailable`/`send`/`isTripped` resolve `false`, `recordVerified` resolves `{ count: 0, tripped: false, justTripped: false }`, `trippedForms` resolves `[]`), and `website-forms.service.spec.ts` / `website-forms.rerun.spec.ts` mock all three; this task replaces the bodies IN PLACE and touches neither the core nor its specs (RC6/RC20).
- Task 8 (RC5): `WebsiteFraudEvidenceService.evidenceKeysOf(payloadJson: unknown): string[]` (static) from `apps/backend/src/modules/website/website-fraud-evidence.service.ts` — accepts the core's `{ fields: { evidenceKeys } }` envelope, re-applies the `website-fraud/` prefix lock.
- Task 9 (RC11/RC18/RC28): env `WEBSITE_SITE_URL` (both compose files, both `.env` examples, the DEPLOYMENT row — all Task 9's) and the helper `websiteSiteUrl(config: ConfigService): string` from `apps/backend/src/modules/website/website-site-url.ts` (trailing slashes stripped, fallback `https://www.jobsadmire.com`) — `WebsiteAutoresponderService` imports it for the CTA links; `WebsiteNotifyService` never reads the variable (its links are staff-facing and go through `NotificationSettingsService.absoluteLink`, i.e. `APP_URL`).
- Existing (verified): `EventDispatcher.dispatch(key, ctx)` (`event-dispatcher.ts`); `NotificationsService.queueEmail({ to, subject, template, context, locale?, attachments?, userId?, notificationType?, mailbox? })` (`notifications.service.ts:58-77`; `EmailProcessor.shouldSendEmail` sends unconditionally when `userId` is absent); `NotificationSettingsService.absoluteLink(path: string | undefined): string | undefined` (`notification-settings.service.ts:304`); `defaultEmailBody(title, message, link?)` from `notifications/custom-template.logic.ts:247`; `RedisService` `set(key, value, ttlSeconds?)`, `get`, `del`, `exists(key): Promise<boolean>`, `incr(key): Promise<number>`, `expire(key, seconds)`, `setNx(key, value, ttlSeconds): Promise<boolean>` (`redis.service.ts:35-76`); `UploadService.deleteFileChecked(key): Promise<boolean>` (`upload.service.ts:200`, true on NoSuchKey); `holdsModuleGrant(module, action, opts?: { descendants?: string[]; now?: Date })` (`common/utils/role-helpers.ts:110`); `EventDefinition` / `TemplateExtras` (`event-registry.ts:69-160`); `asString(value, fallback = '')` (`event-registry.ts:164`); `eventsForModule(module)`; `EmailService.renderTemplate` picks `<template>.<locale>.hbs` first and injects `appUrl` (`email.service.ts:264-280`); `module-custom.hbs` renders `{{{customBody}}}`; `@Cron` with `{ name }` + `running` latch (`wa-campaign-runner.cron.ts:106-140`); `CareersRetentionCron` owns `EVERY_DAY_AT_3AM` (`careers-retention.cron.ts:81`); `PrismaModule`, `RedisModule` are `@Global()`; `NotificationsModule` exports `NotificationsService, EventDispatcher, NotificationSettingsService`; `UploadModule` exports `UploadService`; `test/permissions/repo-invariants.spec.ts` (c) accepts the identifier `module` as `holdsModuleGrant`'s first argument.

Produces
- Registry keys `'WEBSITE_FORM_RECEIVED'` (`['IN_APP']`) and `'WEBSITE_FORMS_UNAVAILABLE'` (`['IN_APP','EMAIL']`, `emailTemplate: 'website-forms-unavailable'`), both `module: 'website'`, `mailbox: 'default'`, `relatedEntityType: 'website-submission'`, `emailLinkPath` → `/admin/website/inbox?row=<submissionId>` / `/admin/website/inbox`; `RecipientHelpers.getModuleViewers(module: string, opts?: { descendants?: string[] }): Promise<string[]>`; two seed rows (`website`, received bell-only, unavailable email ON).
- `apps/backend/src/modules/website/website-alarms.logic.ts`: `WEBSITE_ABUSE_TRIP_THRESHOLD = 25`, `WEBSITE_ABUSE_WINDOW_SEC = 3600`, `WEBSITE_ABUSE_ANNOUNCED_TTL_SEC = 10800`, `WEBSITE_DROUGHT_HOURS = 48`, `type WebsiteUnavailableReason = 'captchaDegraded' | 'tripped' | 'untripped' | 'drought' | 'handlerFailed'`, `WEBSITE_BUSINESS_HOURS` (Europe/Istanbul, Mon–Fri 09:00–18:00), `wallClockInZone`, `isWithinWebsiteBusinessHours(now, hours?)`, `websiteDayKey(now, tz?)`, `websiteAbuseKeys(formKey) → { count: 'website:abuse:count:<f>', tripped: 'website:abuse:tripped:<f>', announced: 'website:abuse:announced:<f>' }` (RC6 — the one key set; no `WEBSITE_TRIP_KEY_PREFIX` anywhere), `shouldTrip(count, threshold?)`, `alarmOnceKey(reason, formKey, now)` (`website:alarm:<reason>:<form|*>`, drought `website:alarm:drought:<form|*>:<YYYY-MM-DD Istanbul>`), `alarmOnceTtlSec(reason)` (3600; drought 86400), `isLeadDrought(lastSubmissionAt, now, hours?)`. The thresholds live HERE and the docs say so (RC10).
- `WebsiteNotifyService(events: EventDispatcher, notifications: NotificationsService, settings: NotificationSettingsService, websiteConfig: WebsiteIntegrationConfigService, redis: RedisService)` with `formReceived(input: WebsiteFormReceivedInput): Promise<void>` and `formsUnavailable(input: WebsiteFormsUnavailableInput): Promise<boolean>` (once-per-window via SETNX, fails OPEN on Redis, returns whether it fired); exported `WebsiteFormReceivedInput { submissionId: string; formKey: string; contactName?: string | null; inquiryNumber?: string | null; assignedAgentId?: string | null }`, `WebsiteFormsUnavailableInput { reason: WebsiteUnavailableReason; formKey?: string | null; submissionId?: string | null; detail?: string | null; count?: number; hours?: number; lastSubmissionAt?: Date | null; now?: Date }`, re-exported `WebsiteUnavailableReason`. Both mail the second human directly via `queueEmail({ mailbox: 'default', template: 'module-custom' })` with no `userId`; neither ever throws.
- `WebsiteAbuseService(redis: RedisService, notify: WebsiteNotifyService)` with `isTripped(formKey): Promise<boolean>`, `recordVerified(formKey, now?): Promise<{ count: number; tripped: boolean; justTripped: boolean }>`, `trippedForms(): Promise<string[]>` (iterates `WEBSITE_FORM_KEYS`).
- `WebsiteAutoresponderService(notifications: NotificationsService, config: ConfigService)` with `send(input: { formKey: string; locale?: string | null; to?: string | null; name?: string | null; isTest: boolean }): Promise<boolean>`; exported `WEBSITE_AUTORESPONDER_FORM_KEYS` (the eight non-careers, non-newsletter keys), `websiteAutoresponderTemplate(formKey): string | null`, `websiteAutoresponderSubject(formKey, locale: 'en' | 'tr'): string`, `websiteLocale(locale): 'en' | 'tr'`. The site base comes from Task 9's `websiteSiteUrl` (RC28) — this file exports no URL helper of its own.
- `WebsiteAlarmsCron` (`@Cron('0 */5 * * * *', { name: 'website-alarms' })`, `runTick(now)`), `WebsitePurgeCron` (`@Cron('0 30 4 * * *', { name: 'website-purge' })`, `run(now)`).
- `WebsitePingService(prisma, config, abuse: WebsiteAbuseService)` — `trippedForms: await this.abuse.trippedForms()` (RC13 shape otherwise unchanged).
- Frontend: `getEntityPath(locale, 'website-submission' | 'WebsiteFormSubmission', id)` → `/<locale>/admin/website/inbox?row=<id>`; `TYPE_FALLBACKS` `['WEBSITE_', '/website/inbox']`. Task 11's inbox reads `?row=<id>` and opens that submission's SidePanel (P14).
- For Task 12 (docs, RC1/RC10): PRD §5.12 notification/alarm/purge paragraphs, §6.2 "marketing and website" catalogue sentence, §6.7 the `website-*` template family + the second-human direct send; DEPLOYMENT.md cron inventory (`website-alarms` every 5 min, `website-purge` 04:30 UTC, both flag-gated per tick) naming `modules/website/website-alarms.logic.ts` as where the numbers live.

Decisions applied: P1 (crons read the flag per tick through Task 2's helper), P2 (test submissions never notify or autorespond — the core passes `isTest`, and `send()` refuses it a second time), P9 (events, seed mirror, second human by direct `queueEmail`, autoresponders EN/TR `.hbs` from the default mailbox, careers excluded; newsletter also excluded because its double-opt-in confirm mail IS its answer), P10 (trip/untrip on Redis, 60-min window, SETNX once-per-window, 429 + WhatsApp hint, drought cron, purge 04:30 on `purgeAfter` with MinIO deletes), P11/RC13 (`trippedForms` through `WebsiteAbuseService` in `WebsitePingService`), P14 (inbox at `/admin/website/inbox`), RC1 (numbering; docs are Task 12's), RC4 (`detail` flags; `dryRun`), RC5 (`evidenceKeysOf`, keep the row if an object survives), RC6 (one alarm pair; Task 6's `WebsiteAlertsService` and `website-events.const.ts` do not exist), RC7 (captcha verdict shape), RC10 (thresholds in `website-alarms.logic.ts`), RC11/RC28 (`WEBSITE_SITE_URL` through Task 9's `websiteSiteUrl` in the autoresponder only; the notify service links through `APP_URL`), RC20 (the three shells are edited in place — never re-created; the core's constructor and specs untouched), RC21 (`recordVerified` is the core's call after a NEW, non-replayed, captcha-verified row; `WEBSITE_FORM_KEYS` from `@jobsadmire/constants`), RC12 (no `WebsiteForm.autoresponder*` columns — `.hbs` only), RC15 (no placeholders).

---

#### Part A — registry, dispatcher helper, seed, coverage, bell landing

- [ ] **Step 1: Write the failing tests (registry + seed + coverage + frontend landing)**

`apps/backend/src/modules/notifications/event-registry-website.spec.ts`:

```ts
// apps/backend/src/modules/notifications/event-registry-website.spec.ts
/**
 * The website intake door's two events (WP3a, rulings P9/P10).
 *
 * WHAT IS PINNED AND WHY: both events are STAFF mail (mailbox 'default' — the
 * registry default is the candidate chain), both land the bell on the forms
 * inbox, the received notice reaches the inbox's own audience through the
 * `website.forms` RESOURCE key (sales roles hold only that key, never the
 * module key — P3/RC8), and the outage notice branches its words on `reason` so
 * one enum value can carry five different alarms without five migrations.
 */
import { NotificationType } from '@prisma/client';
import { WEBSITE_FORM_KEYS } from '@jobsadmire/constants';
import { EVENT_REGISTRY, eventsForModule } from './event-registry';

const helpers = () => ({
  getSuperAdmins: jest.fn(async () => ['sa-1']),
  getActiveStaff: jest.fn(async () => []),
  getApprovers: jest.fn(async () => []),
  getOfferLetterOwnerSigners: jest.fn(async () => []),
  getWhatsappTemplateSubmitters: jest.fn(async () => []),
  getModuleViewers: jest.fn(async () => ['viewer-1', 'sa-1']),
});

const received = () => EVENT_REGISTRY.WEBSITE_FORM_RECEIVED;
const unavailable = () => EVENT_REGISTRY.WEBSITE_FORMS_UNAVAILABLE;

describe('WEBSITE_FORM_RECEIVED', () => {
  it('is a bell-only staff event filed under the website catalogue', () => {
    expect(received().type).toBe(NotificationType.WEBSITE_FORM_RECEIVED);
    expect(received().module).toBe('website');
    expect(received().channels).toEqual(['IN_APP']);
    expect(received().mailbox).toBe('default');
    expect(received().relatedEntityType).toBe('website-submission');
    expect(received().relatedEntityId?.({ submissionId: 's1' })).toBe('s1');
  });

  it('reaches the inbox audience through the website.forms RESOURCE key, plus the assignee', async () => {
    const h = helpers();
    const ids = await received().recipients({ assignedAgentId: 'agent-9' }, h);
    expect(h.getModuleViewers).toHaveBeenCalledWith('website', { descendants: ['website.forms'] });
    expect(ids).toEqual(['agent-9', 'viewer-1', 'sa-1']);
    expect(await received().recipients({}, helpers())).toEqual(['viewer-1', 'sa-1']);
  });

  it('names the form and the person, and the inquiry number when there is one', () => {
    const ctx = { formKey: 'hire', contactName: 'Ayşe Demir', inquiryNumber: 'INQ-2026-041', submissionId: 's1' };
    expect(received().title(ctx)).toBe('New website hire workers request from Ayşe Demir');
    expect(received().message(ctx)).toContain('INQ-2026-041');
    expect(received().title({ formKey: 'nope' })).toBe('New website nope form');
  });

  it.each([...WEBSITE_FORM_KEYS])('has a human label for the %s form — never the bare key', (key) => {
    expect(received().title({ formKey: key })).not.toContain(`${key} form`);
  });

  it('links the email to the submission row in the inbox', () => {
    expect(received().emailLinkPath!({ submissionId: 's1' })).toBe('/admin/website/inbox?row=s1');
    expect(received().emailLinkPath!({})).toBe('/admin/website/inbox');
  });

  it('exposes only documented, id-free placeholders to a custom body', () => {
    const tpl = received().templateContext!(
      { formKey: 'contact', contactName: 'Ali', inquiryNumber: 'INQ-2026-042', submissionId: 's1', email: 'a@b.c' },
      { recipient: { firstName: 'H', fullName: 'H A', email: 'h@j.com' }, link: 'L', title: 'T', message: 'M' },
    );
    expect(tpl).toEqual({
      form: { key: 'contact', label: 'Contact message' },
      submission: { contactName: 'Ali', inquiryNumber: 'INQ-2026-042' },
      recipient: { firstName: 'H', fullName: 'H A', email: 'h@j.com' },
      link: 'L',
    });
    expect(JSON.stringify(received().sampleContext)).not.toMatch(/token|secret/i);
  });
});

describe('WEBSITE_FORMS_UNAVAILABLE', () => {
  it('is IN_APP + EMAIL to super-admins on the default mailbox with a shipped template', async () => {
    expect(unavailable().channels).toEqual(['IN_APP', 'EMAIL']);
    expect(unavailable().mailbox).toBe('default');
    expect(unavailable().emailTemplate).toBe('website-forms-unavailable');
    expect(await unavailable().recipients({}, helpers())).toEqual(['sa-1']);
  });

  it.each([
    ['captchaDegraded', /captcha/i],
    ['tripped', /paused/i],
    ['untripped', /accepting again/i],
    ['drought', /no website leads/i],
    ['handlerFailed', /could not be filed/i],
  ])('branches its title on reason=%s', (reason, re) => {
    expect(unavailable().title({ reason, formKey: 'hire', count: 30, hours: 48 })).toMatch(re);
    expect(unavailable().emailSubject!({ reason, formKey: 'hire' })).toMatch(/^\[Website\] /);
  });

  it('prints the burst count as a number', () => {
    expect(unavailable().message({ reason: 'tripped', formKey: 'hire', count: 30 })).toContain('30 ');
  });

  it('lands on the inbox even without a submission', () => {
    expect(unavailable().emailLinkPath!({})).toBe('/admin/website/inbox');
  });
});

describe('the website catalogue', () => {
  it('lists exactly the two WP3a events, each with the full catalogue fields', () => {
    const defs = eventsForModule('website');
    expect(defs.map((d) => d.key).sort()).toEqual(['WEBSITE_FORMS_UNAVAILABLE', 'WEBSITE_FORM_RECEIVED']);
    for (const d of defs) {
      expect(d.label).toBeTruthy();
      expect(d.trigger).toBeTruthy();
      expect(d.recipientsDescription).toBeTruthy();
      expect(d.recipientsShort).toBeTruthy();
      expect(d.placeholders).toEqual(expect.arrayContaining(['recipient.firstName', 'recipient.fullName', 'link']));
      expect(d.sampleContext).toBeDefined();
      expect(d.templateContext).toBeDefined();
    }
  });
});
```

In `apps/backend/src/modules/notifications/module-notification-seed.spec.ts`, replace everything from the line `describe('the seed table agrees with the event registry', () => {` to the end of the file with:

```ts
describe('the seed table agrees with the event registry', () => {
  /**
   * One block per module with a settings catalogue. `EMAIL_BY_DEFAULT` is the
   * owner's decision per module: marketing (2026-09-12) emails only a failed
   * publish; website (WP3a, P9) emails only the outage notice — the one thing
   * the door can say when it is failing. Everything else is bell-only until the
   * owner switches email on per event.
   */
  const MODULES = ['marketing', 'website'] as const;
  const EMAIL_BY_DEFAULT: Record<(typeof MODULES)[number], NotificationType[]> = {
    marketing: [NotificationType.MARKETING_POST_FAILED],
    website: [NotificationType.WEBSITE_FORMS_UNAVAILABLE],
  };
  const rowsFor = (module: string) => MODULE_NOTIFICATION_SEED.filter((r) => r.module === module);

  it('files every row under a module that has a settings catalogue', () => {
    expect(new Set(MODULE_NOTIFICATION_SEED.map((r) => r.module))).toEqual(new Set(MODULES));
  });

  describe.each(MODULES)('%s', (module) => {
    const defs = eventsForModule(module);
    const rows = rowsFor(module);

    it('seeds exactly the events the registry declares', () => {
      expect(rows.map((r) => r.eventType).sort()).toEqual(defs.map((d) => d.type).sort());
    });

    it('seeds every row with the channels its definition ships', () => {
      for (const row of rows) {
        const def = defs.find((d) => d.type === row.eventType)!;
        expect({ eventType: row.eventType, inApp: row.inApp, email: row.email }).toEqual({
          eventType: row.eventType,
          inApp: def.channels.includes('IN_APP'),
          email: def.channels.includes('EMAIL'),
        });
      }
    });

    it('emails by default exactly the events the owner decided', () => {
      expect(rows.filter((r) => r.email).map((r) => r.eventType).sort()).toEqual(
        [...EMAIL_BY_DEFAULT[module]].sort(),
      );
    });

    it('leaves the bell ON everywhere — in-app is always available', () => {
      expect(rows.every((r) => r.inApp)).toBe(true);
    });
  });
});
```

In `apps/backend/src/modules/notifications/event-registry-coverage.spec.ts`, inside `describe('EVENT_REGISTRY coverage', …)`, directly after the test whose last three lines are

```ts
      expect({ key, type: def.relatedEntityType }).toEqual({ key, type: 'whatsapp-campaign' });
    }
  });
```

insert (before the `describe`'s closing `});`):

```ts

  /**
   * WP3a — the website door's two enum members join the same rule: a declared
   * type with no definition is a notification nobody receives, silently.
   */
  it('every WEBSITE_* NotificationType has at least one event definition', () => {
    const uncovered = Object.values(NotificationType).filter((t) => t.startsWith('WEBSITE_') && !used.has(t));
    expect(uncovered).toEqual([]);
  });

  it('every WEBSITE_* event is staff mail that lands on the forms inbox', () => {
    const keys = Object.keys(EVENT_REGISTRY).filter((k) => k.startsWith('WEBSITE_'));
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const def = EVENT_REGISTRY[key];
      expect({ key, mailbox: def.mailbox, entity: def.relatedEntityType }).toEqual({
        key,
        mailbox: 'default',
        entity: 'website-submission',
      });
    }
  });
```

Frontend — `apps/frontend/src/lib/notifications/entity-path.spec.ts`: after the line `    ['WHATSAPP_MESSAGE_RECEIVED', \`${ROOT}/whatsapp\`],` (inside `FALLBACKS`) insert:

```ts
    // Website intake door (WP3a) — both events land on the forms inbox.
    ['WEBSITE_FORM_RECEIVED', `${ROOT}/website/inbox`],
    ['WEBSITE_FORMS_UNAVAILABLE', `${ROOT}/website/inbox`],
```

after the line `    ['user', 'u1', \`${ROOT}/users/u1\`],` (inside the `getEntityPath` `it.each` table) insert:

```ts
    ['website-submission', 'sub1', `${ROOT}/website/inbox?row=sub1`],
    ['WebsiteFormSubmission', 'sub1', `${ROOT}/website/inbox?row=sub1`],
```

and inside `describe('resolveNotificationHref — every marketing notification lands', …)`, directly after the test `  it('honours the locale', () => {` … `  });`, insert:

```ts

  it('opens the website inbox on the submission row — the inbox has no detail route in WP3a', () => {
    expect(
      resolveNotificationHref('tr', {
        type: 'WEBSITE_FORM_RECEIVED',
        relatedEntityType: 'website-submission',
        relatedEntityId: 'sub1',
      }),
    ).toBe('/tr/admin/website/inbox?row=sub1');
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

```
cd apps/backend && npx jest src/modules/notifications --maxWorkers=2
```
Expected: `event-registry-website.spec.ts` fails with `TypeError: Cannot read properties of undefined (reading 'type')` (no `WEBSITE_FORM_RECEIVED` definition); `module-notification-seed.spec.ts` › `files every row under a module that has a settings catalogue` fails (`Set {"marketing"}` ≠ `Set {"marketing","website"}`); `event-registry-coverage.spec.ts` › `every WEBSITE_* NotificationType has at least one event definition` fails with `["WEBSITE_FORMS_UNAVAILABLE","WEBSITE_FORM_RECEIVED"]` uncovered and `every WEBSITE_* event is staff mail…` fails on `keys.length` = 0.

```
cd apps/frontend && npx jest src/lib/notifications/entity-path.spec.ts --maxWorkers=2
```
Expected: `WEBSITE_FORM_RECEIVED falls back to …` and `WEBSITE_FORMS_UNAVAILABLE falls back to …` receive `null`; `website-submission#sub1` and `WebsiteFormSubmission#sub1` receive `null`; the new `opens the website inbox…` test receives `null`.

- [ ] **Step 3: Implement**

`apps/backend/src/modules/notifications/event-registry.ts` — replace the line

```ts
  getModuleViewers(module: string): Promise<string[]>;
```

with

```ts
  /**
   * WP3a — `opts.descendants` widens the audience to holders of the named
   * RESOURCE keys (the `holdsModuleGrant` option). Sales roles hold
   * `website.forms:VIEW` and never the module key, so without it the forms
   * inbox's own audience would resolve to super-admins alone — silently.
   */
  getModuleViewers(module: string, opts?: { descendants?: string[] }): Promise<string[]>;
```

Insert immediately before the line `export const EVENT_REGISTRY: Record<string, EventDefinition> = Object.fromEntries(`:

```ts
// ── Website intake door (WP3a, 2026-09-19; rulings P9/P10) ─────────────────
//
// Two events, one module. WEBSITE_FORM_RECEIVED is the bell for a stored
// submission; WEBSITE_FORMS_UNAVAILABLE is the ONE outage type, branched on
// `ctx.reason`, because Postgres cannot drop an enum member and five alarms do
// not deserve five permanent members. The EMITTER owns "once" (Redis SETNX in
// `website-notify.service.ts`), exactly like `whatsapp.ai.budget_exhausted`;
// nothing here throttles. The second human (WebsiteIntegrationConfig) is
// mailed by the emitter directly — the dispatcher reaches User rows only.
//
// NO SUBMITTER PII IN THE BELL: a received notice fans out to every inbox
// viewer, so it carries a name and a form label, never a phone or an e-mail.
const WEBSITE_MODULE = 'website';
const WEBSITE_COMMON_PLACEHOLDERS = ['recipient.firstName', 'recipient.fullName', 'link'];
/** Must agree with the frontend resolver (`entity-path.ts`, P14: the inbox lives at /website/inbox). */
const WEBSITE_INBOX_PATH = '/admin/website/inbox';

/**
 * Human label per public form key — the ten `WEBSITE_FORM_KEYS` of
 * `@jobsadmire/constants` (pinned key-for-key by event-registry-website.spec.ts).
 */
const WEBSITE_FORM_LABELS: Record<string, string> = {
  hire: 'Hire workers request',
  contact: 'Contact message',
  partner: 'Partner application',
  workers: 'Available workers request',
  careers: 'Careers application',
  newsletter: 'Newsletter sign-up',
  callback: 'Callback request',
  visit: 'Office visit request',
  calculator: 'Cost calculator quote',
  fraud: 'Fraud report',
};

function websiteFormLabel(ctx: EventContext): string {
  const key = asString(ctx.formKey);
  return WEBSITE_FORM_LABELS[key] ?? (key ? `${key} form` : 'website form');
}

function websiteSubmissionPath(ctx: EventContext): string {
  const id = asString(ctx.submissionId);
  return id ? `${WEBSITE_INBOX_PATH}?row=${id}` : WEBSITE_INBOX_PATH;
}

function websiteUnavailableTitle(ctx: EventContext): string {
  const label = websiteFormLabel(ctx).toLowerCase();
  switch (asString(ctx.reason)) {
    case 'captchaDegraded':
      return 'Website forms are running without captcha';
    case 'tripped':
      return `Website ${label} paused after a burst`;
    case 'untripped':
      return `Website ${label} is accepting again`;
    case 'drought':
      return `No website leads in ${Number(ctx.hours ?? 0)} hours`;
    case 'handlerFailed':
      return `Website ${label} could not be filed`;
    default:
      return 'Website forms need attention';
  }
}

function websiteUnavailableMessage(ctx: EventContext): string {
  const label = websiteFormLabel(ctx).toLowerCase();
  const detail = asString(ctx.detail, 'no detail');
  switch (asString(ctx.reason)) {
    case 'captchaDegraded':
      return `Turnstile could not verify submissions (${detail}). Forms are accepted behind the honeypot and dedupe only — check the Turnstile secret on Website → Integrations.`;
    case 'tripped':
      return `${Number(ctx.count ?? 0)} captcha-verified submissions to the ${label} inside one hour. It answers 429 with the WhatsApp fallback until the 60-minute window resets; review the burst in the inbox.`;
    case 'untripped':
      return `The abuse window on the ${label} expired and it is open again. Mark the burst as spam in the inbox if it was one.`;
    case 'drought':
      return `The last real submission arrived ${asString(ctx.lastSubmissionAt, 'never')}. Check the website, the write token and Turnstile on Website → Integrations — silence is the failure this alarm exists for.`;
    case 'handlerFailed':
      return `The submission is stored but its handler failed: ${detail}. Open the inbox and re-run it.`;
    default:
      return detail;
  }
}

const SAMPLE_WEBSITE_RECIPIENT = { firstName: 'Haris', fullName: 'Haris Ali', email: 'you@jobsadmire.com' };
const SAMPLE_WEBSITE_LINK = 'https://operations.jobsadmire.com/en/admin/website/inbox?row=sample';

const websiteEvents: EventDefinition[] = [
  {
    key: 'WEBSITE_FORM_RECEIVED',
    type: NotificationType.WEBSITE_FORM_RECEIVED,
    module: WEBSITE_MODULE,
    channels: ['IN_APP'],
    mailbox: 'default',
    // The inbox's own audience (`website.forms:VIEW` through the resource key —
    // RC8 gives the three sales roles only that key), super-admins by the slug
    // arm, and the salesperson the assignment engine put on the inquiry, who
    // has to ring back.
    recipients: async (ctx, helpers) => {
      const viewers = await helpers.getModuleViewers(WEBSITE_MODULE, { descendants: ['website.forms'] });
      const assignee = asString(ctx.assignedAgentId);
      return assignee ? [assignee, ...viewers] : viewers;
    },
    title: (ctx) =>
      `New website ${websiteFormLabel(ctx).toLowerCase()}${
        ctx.contactName ? ` from ${asString(ctx.contactName)}` : ''
      }`,
    message: (ctx) =>
      `${websiteFormLabel(ctx)} received from the website${
        ctx.inquiryNumber ? ` and filed as ${asString(ctx.inquiryNumber)}` : ''
      }. Open the inbox to read the submission.`,
    relatedEntityType: 'website-submission',
    relatedEntityId: (ctx) => asString(ctx.submissionId) || undefined,
    label: 'Form received',
    trigger: 'A visitor submits any form on jobsadmire.com and the door files it.',
    recipientsDescription:
      'Everyone who can view the website forms inbox, the assigned salesperson when the form became an inquiry, plus super-admins.',
    recipientsShort: 'Inbox viewers',
    placeholders: [
      ...WEBSITE_COMMON_PLACEHOLDERS,
      'form.key',
      'form.label',
      'submission.contactName',
      'submission.inquiryNumber',
    ],
    sampleContext: {
      form: { key: 'hire', label: 'Hire workers request' },
      submission: { contactName: 'Ayşe Demir', inquiryNumber: 'INQ-2026-041' },
      recipient: SAMPLE_WEBSITE_RECIPIENT,
      link: SAMPLE_WEBSITE_LINK,
    },
    templateContext: (ctx, extra) => ({
      form: { key: asString(ctx.formKey), label: websiteFormLabel(ctx) },
      submission: {
        contactName: asString(ctx.contactName, '(no name)'),
        inquiryNumber: asString(ctx.inquiryNumber),
      },
      recipient: extra.recipient,
      link: extra.link,
    }),
    emailLinkPath: websiteSubmissionPath,
  },
  {
    key: 'WEBSITE_FORMS_UNAVAILABLE',
    type: NotificationType.WEBSITE_FORMS_UNAVAILABLE,
    module: WEBSITE_MODULE,
    channels: ['IN_APP', 'EMAIL'],
    mailbox: 'default',
    // Super-admins, for the marketing/whatsapp reason: no `website:MANAGE_KEYS`
    // grant is seeded to any role, so a grant query would address nobody.
    recipients: async (_ctx, helpers) => helpers.getSuperAdmins(),
    title: websiteUnavailableTitle,
    message: websiteUnavailableMessage,
    emailTemplate: 'website-forms-unavailable',
    emailSubject: (ctx) => `[Website] ${websiteUnavailableTitle(ctx)}`,
    relatedEntityType: 'website-submission',
    relatedEntityId: (ctx) => asString(ctx.submissionId) || undefined,
    label: 'Forms unavailable or degraded',
    trigger:
      'Captcha degrades, a form trips the abuse cap (and later recovers), no real lead arrives for two business days, or a stored submission cannot be filed.',
    recipientsDescription:
      'Super-admins, plus the second human named on Website → Integrations by direct e-mail.',
    recipientsShort: 'Super-admins',
    placeholders: [...WEBSITE_COMMON_PLACEHOLDERS, 'reason', 'form.key', 'form.label', 'detail'],
    sampleContext: {
      reason: 'tripped',
      form: { key: 'hire', label: 'Hire workers request' },
      detail: '30 captcha-verified submissions in one hour',
      recipient: SAMPLE_WEBSITE_RECIPIENT,
      link: 'https://operations.jobsadmire.com/en/admin/website/inbox',
    },
    templateContext: (ctx, extra) => ({
      reason: asString(ctx.reason),
      form: { key: asString(ctx.formKey), label: websiteFormLabel(ctx) },
      detail: asString(ctx.detail),
      recipient: extra.recipient,
      link: extra.link,
    }),
    emailLinkPath: () => WEBSITE_INBOX_PATH,
  },
];

```

Then replace the three lines

```ts
export const EVENT_REGISTRY: Record<string, EventDefinition> = Object.fromEntries(
  [...recruitmentEvents, ...projectEvents, ...marketingEvents, ...whatsappEvents].map((e) => [e.key, e]),
);
```

with

```ts
export const EVENT_REGISTRY: Record<string, EventDefinition> = Object.fromEntries(
  [...recruitmentEvents, ...projectEvents, ...marketingEvents, ...whatsappEvents, ...websiteEvents].map((e) => [
    e.key,
    e,
  ]),
);
```

and the line `  | 'whatsapp.number.alert';` (the end of `export type EventKey`) with:

```ts
  | 'whatsapp.number.alert'
  // Website intake door (WP3a). Both NotificationType members arrived with the
  // 20260925120000_website_intake_door migration — never `as any`.
  | 'WEBSITE_FORM_RECEIVED'
  | 'WEBSITE_FORMS_UNAVAILABLE';
```

`apps/backend/src/modules/notifications/event-dispatcher.ts` — replace the helper that begins `    getModuleViewers: async (module: string) => {` and ends at its `    },` (twelve lines, containing `AND: [holdsModuleGrant(module, PermissionAction.VIEW)],`) with:

```ts
    getModuleViewers: async (module: string, opts?: { descendants?: string[] }) => {
      const users = await this.prisma.user.findMany({
        // `AND`, not a spread: the fragment owns an `OR` key, and assigning
        // `where.OR` beside one is the 2026-08-10 collision (CLAUDE.md).
        // `descendants` (WP3a): resource-key holders — the forms inbox's own
        // audience holds `website.forms:VIEW`, never the module key.
        where: {
          isActive: true,
          deletedAt: null,
          AND: [holdsModuleGrant(module, PermissionAction.VIEW, { descendants: opts?.descendants })],
        },
        select: { id: true },
      });
      return users.map((u) => u.id);
    },
```

`apps/backend/prisma/module-notification-seed.ts` — after the line `  { module: 'marketing', eventType: NotificationType.MARKETING_POST_RETURNED_TO_DRAFT, inApp: true, email: false },` insert:

```ts
  // Website intake door (WP3a, 2026-09-19; ruling P9). The received notice is
  // bell-only like every marketing event; the outage/degradation notice EMAILS
  // by default — it is the one thing the door can say when it is failing, and a
  // bell nobody is looking at is exactly the silence D11 warns about.
  { module: 'website', eventType: NotificationType.WEBSITE_FORM_RECEIVED, inApp: true, email: false },
  { module: 'website', eventType: NotificationType.WEBSITE_FORMS_UNAVAILABLE, inApp: true, email: true },
```

`apps/backend/src/modules/email/templates/website-forms-unavailable.hbs` (the dispatcher passes `{ ...ctx, title, message }`, so `reason`, `formKey` and `detail` are the dispatch context's own fields; `appUrl` is injected by `EmailService.renderTemplate`):

```hbs
<h2>{{title}}</h2>
<p>Hi,</p>
<p>{{message}}</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="warning-box" style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:6px;margin:16px 0;">
  <tr>
    <td style="padding:16px;font-size:14px;color:#111827;">
      <strong>Reason:</strong> {{reason}}{{#if formKey}} &middot; <strong>Form:</strong> {{formKey}}{{/if}}{{#if detail}}<br/><span style="color:#6b7280;">{{detail}}</span>{{/if}}
    </td>
  </tr>
</table>

<a href="{{appUrl}}/admin/website/inbox" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Open the forms inbox</a>
```

`apps/backend/src/modules/email/templates/website-forms-unavailable.tr.hbs`:

```hbs
<h2>{{title}}</h2>
<p>Merhaba,</p>
<p>{{message}}</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="warning-box" style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:6px;margin:16px 0;">
  <tr>
    <td style="padding:16px;font-size:14px;color:#111827;">
      <strong>Sebep:</strong> {{reason}}{{#if formKey}} &middot; <strong>Form:</strong> {{formKey}}{{/if}}{{#if detail}}<br/><span style="color:#6b7280;">{{detail}}</span>{{/if}}
    </td>
  </tr>
</table>

<a href="{{appUrl}}/admin/website/inbox" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Form gelen kutusunu aç</a>
```

Frontend `apps/frontend/src/lib/notifications/entity-path.ts` — after the two lines

```ts
  if (type === 'whatsapp-number' || type === 'waphonenumber')
    return `${base}/whatsapp/settings/numbers`;
```

and before `  return null;` insert:

```ts

  // ── Website ──────────────────────────────────────────────────────────────
  // The forms inbox has no detail route in WP3a; `?row=` opens the submission's
  // side panel. Mirrors `emailLinkPath` on the WEBSITE_* definitions.
  if (type === 'website-submission' || type === 'websiteformsubmission')
    return entityId ? `${base}/website/inbox?row=${entityId}` : `${base}/website/inbox`;
```

and after the line `  ['WHATSAPP_', '/whatsapp'],` (the last `TYPE_FALLBACKS` row) insert:

```ts
  // Website intake door (WP3a) — every website event belongs in the inbox.
  ['WEBSITE_', '/website/inbox'],
```

- [ ] **Step 4: Run tests**

```
cd apps/backend && npx jest src/modules/notifications --maxWorkers=2
cd apps/backend && npx jest test/permissions/repo-invariants.spec.ts --maxWorkers=2
cd apps/frontend && npx jest src/lib/notifications/entity-path.spec.ts --maxWorkers=2
```
Expected: all green. The existing fakes `getModuleViewers: jest.fn(async () => [])` in `event-registry.spec.ts:371` and `test/internal-recruitment/event-registry.unit.spec.ts:73` still satisfy the widened signature; repo-invariants (c) still passes because the dispatcher call site passes the identifier `module` first.

- [ ] **Step 5: Commit**

```
git add apps/backend/src/modules/notifications/event-registry.ts apps/backend/src/modules/notifications/event-dispatcher.ts apps/backend/prisma/module-notification-seed.ts apps/backend/src/modules/notifications/module-notification-seed.spec.ts apps/backend/src/modules/notifications/event-registry-coverage.spec.ts apps/backend/src/modules/notifications/event-registry-website.spec.ts apps/backend/src/modules/email/templates/website-forms-unavailable.hbs apps/backend/src/modules/email/templates/website-forms-unavailable.tr.hbs apps/frontend/src/lib/notifications/entity-path.ts apps/frontend/src/lib/notifications/entity-path.spec.ts
git commit -m "feat(website): WEBSITE_FORM_RECEIVED and WEBSITE_FORMS_UNAVAILABLE in the registry, seed and bell landing

Two catalogue events for the intake door (P9): the received notice reaches
the forms inbox's own audience through the website.forms resource key, the
outage notice emails super-admins by default and branches its words on
reason. Seed rows mirrored, seed spec regrouped per module, coverage spec
extended to WEBSITE_*, frontend landing on /website/inbox?row=<id>.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Part B — alarm arithmetic and `WebsiteNotifyService`

- [ ] **Step 6: Write the failing tests**

`apps/backend/src/modules/website/website-alarms.logic.spec.ts`:

```ts
// apps/backend/src/modules/website/website-alarms.logic.spec.ts
import {
  alarmOnceKey,
  alarmOnceTtlSec,
  isLeadDrought,
  isWithinWebsiteBusinessHours,
  shouldTrip,
  WEBSITE_ABUSE_TRIP_THRESHOLD,
  websiteAbuseKeys,
} from './website-alarms.logic';

describe('website abuse trip rule', () => {
  it('trips at the threshold, not one before it', () => {
    expect(shouldTrip(WEBSITE_ABUSE_TRIP_THRESHOLD - 1)).toBe(false);
    expect(shouldTrip(WEBSITE_ABUSE_TRIP_THRESHOLD)).toBe(true);
    expect(shouldTrip(WEBSITE_ABUSE_TRIP_THRESHOLD + 10)).toBe(true);
  });

  it('keys every form separately under the one RC6 key set', () => {
    expect(websiteAbuseKeys('hire')).toEqual({
      count: 'website:abuse:count:hire',
      tripped: 'website:abuse:tripped:hire',
      announced: 'website:abuse:announced:hire',
    });
  });
});

describe('website business hours (Europe/Istanbul, Mon–Fri 09:00–18:00)', () => {
  it.each([
    ['Mon 10:00 Istanbul (07:00Z)', '2026-09-21T07:00:00.000Z', true],
    ['Mon 08:59 Istanbul (05:59Z)', '2026-09-21T05:59:00.000Z', false],
    ['Mon 18:00 Istanbul (15:00Z) — exclusive end', '2026-09-21T15:00:00.000Z', false],
    ['Sat 11:00 Istanbul', '2026-09-19T08:00:00.000Z', false],
    ['Sun 22:30Z = Mon 01:30 Istanbul — day rolls with the zone', '2026-09-20T22:30:00.000Z', false],
  ])('%s → %s', (_label, iso, expected) => {
    expect(isWithinWebsiteBusinessHours(new Date(iso))).toBe(expected);
  });
});

describe('lead drought', () => {
  const now = new Date('2026-09-21T07:00:00.000Z');
  it('is 48 hours of silence by default, and "never" counts as silence', () => {
    expect(isLeadDrought(new Date('2026-09-19T07:00:00.001Z'), now)).toBe(false);
    expect(isLeadDrought(new Date('2026-09-19T07:00:00.000Z'), now)).toBe(true);
    expect(isLeadDrought(null, now)).toBe(true);
  });
});

describe('once-per-window keys', () => {
  const now = new Date('2026-09-21T22:30:00.000Z'); // Tue 01:30 Istanbul
  it('cuts the drought key on the COMPANY day and gives it a day of life', () => {
    expect(alarmOnceKey('drought', null, now)).toBe('website:alarm:drought:*:2026-09-22');
    expect(alarmOnceTtlSec('drought')).toBe(86400);
  });
  it('keys the other reasons per form per rolling hour', () => {
    expect(alarmOnceKey('tripped', 'hire', now)).toBe('website:alarm:tripped:hire');
    expect(alarmOnceKey('captchaDegraded', undefined, now)).toBe('website:alarm:captchaDegraded:*');
    expect(alarmOnceTtlSec('tripped')).toBe(3600);
  });
});
```

`apps/backend/src/modules/website/website-notify.service.spec.ts`:

```ts
// apps/backend/src/modules/website/website-notify.service.spec.ts
/**
 * The one door between the website module and the notifications registry
 * (the `WaNotifyService` shape; RC6: the ONLY emitter of website events).
 * Three things are pinned: the second human is mailed DIRECTLY with the
 * registry's own words (the dispatcher reaches User rows only — P9), an alarm
 * fires once per window and the SETNX is the whole guarantee (P10), and
 * nothing here ever throws into the public POST.
 */
import { WebsiteNotifyService } from './website-notify.service';

function make(opts: { secondHuman?: { email: string; name: string } | null; setNx?: boolean | 'throw' } = {}) {
  const events = { dispatch: jest.fn(async (_key: string, _ctx: Record<string, unknown>) => undefined) };
  const notifications = { queueEmail: jest.fn(async (_o: Record<string, unknown>) => ({ queued: true })) };
  const settings = { absoluteLink: jest.fn((p?: string) => (p ? `https://ops.test${p}` : undefined)) };
  const websiteConfig = {
    getOrCreate: jest.fn(async () => ({
      secondHumanEmail: opts.secondHuman === null ? null : (opts.secondHuman?.email ?? 'second@jobsadmire.com'),
      secondHumanName: opts.secondHuman === null ? null : (opts.secondHuman?.name ?? 'Second Human'),
    })),
  };
  const redis = {
    setNx: jest.fn(async (_k: string, _v: string, _ttl: number) => {
      if (opts.setNx === 'throw') throw new Error('redis down');
      return opts.setNx ?? true;
    }),
  };
  const svc = new WebsiteNotifyService(events as never, notifications as never, settings as never, websiteConfig as never, redis as never);
  return { svc, events, notifications, settings, websiteConfig, redis };
}

describe('WebsiteNotifyService.formReceived', () => {
  it('dispatches the registry event and mails the second human the same words', async () => {
    const { svc, events, notifications } = make();
    await svc.formReceived({ submissionId: 's1', formKey: 'hire', contactName: 'Ayşe', inquiryNumber: 'INQ-2026-041', assignedAgentId: 'u1' });
    expect(events.dispatch).toHaveBeenCalledWith('WEBSITE_FORM_RECEIVED', expect.objectContaining({ submissionId: 's1', formKey: 'hire', assignedAgentId: 'u1' }));
    expect(notifications.queueEmail).toHaveBeenCalledTimes(1);
    const job = notifications.queueEmail.mock.calls[0][0] as Record<string, unknown>;
    expect(job.to).toBe('second@jobsadmire.com');
    expect(job.mailbox).toBe('default');
    expect(job.template).toBe('module-custom');
    expect(job.subject).toBe('New website hire workers request from Ayşe');
    expect(String((job.context as Record<string, unknown>).customBody)).toContain('https://ops.test/admin/website/inbox?row=s1');
    expect(job.userId).toBeUndefined();
  });

  it('sends nothing to a second human that is not configured', async () => {
    const { svc, notifications } = make({ secondHuman: null });
    await svc.formReceived({ submissionId: 's1', formKey: 'contact' });
    expect(notifications.queueEmail).not.toHaveBeenCalled();
  });

  it('never throws — a dead dispatcher is a warning, not a 500 on the public POST', async () => {
    const { svc, events } = make();
    events.dispatch.mockRejectedValueOnce(new Error('boom'));
    await expect(svc.formReceived({ submissionId: 's1', formKey: 'contact' })).resolves.toBeUndefined();
  });
});

describe('WebsiteNotifyService.formsUnavailable', () => {
  it('fires once per window — the SETNX loser says nothing', async () => {
    const { svc, events, redis, notifications } = make({ setNx: false });
    expect(await svc.formsUnavailable({ reason: 'captchaDegraded', formKey: 'hire', detail: 'timeout' })).toBe(false);
    expect(redis.setNx).toHaveBeenCalledWith('website:alarm:captchaDegraded:hire', expect.any(String), 3600);
    expect(events.dispatch).not.toHaveBeenCalled();
    expect(notifications.queueEmail).not.toHaveBeenCalled();
  });

  it('fires, dispatches and mails the second human when it wins the window', async () => {
    const { svc, events, notifications } = make();
    expect(await svc.formsUnavailable({ reason: 'tripped', formKey: 'hire', count: 30 })).toBe(true);
    expect(events.dispatch).toHaveBeenCalledWith('WEBSITE_FORMS_UNAVAILABLE', expect.objectContaining({ reason: 'tripped', formKey: 'hire', count: 30 }));
    const job = notifications.queueEmail.mock.calls[0][0] as Record<string, unknown>;
    expect(job.subject).toBe('[Website] Website hire workers request paused after a burst');
  });

  it('keys the drought alarm by company day, not by the hour', async () => {
    const { svc, redis } = make();
    await svc.formsUnavailable({ reason: 'drought', hours: 48, lastSubmissionAt: null, now: new Date('2026-09-21T07:00:00.000Z') });
    expect(redis.setNx).toHaveBeenCalledWith('website:alarm:drought:*:2026-09-21', expect.any(String), 86400);
  });

  it('fails OPEN when Redis is down — an alarm that cannot dedupe still alarms', async () => {
    const { svc, events } = make({ setNx: 'throw' });
    expect(await svc.formsUnavailable({ reason: 'handlerFailed', formKey: 'visit', submissionId: 's9', detail: 'x' })).toBe(true);
    expect(events.dispatch).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 7: Run the tests to verify they fail**

```
cd apps/backend && npx jest src/modules/website/website-alarms.logic.spec.ts src/modules/website/website-notify.service.spec.ts --maxWorkers=2
```
Expected: the logic spec fails with `Cannot find module './website-alarms.logic'`; the notify spec compiles against Task 6's shell and fails on the first assertion of every test (`events.dispatch` never called; `formsUnavailable` returns `false` where `true` is expected; the SETNX expectation receives no call).

- [ ] **Step 8: Implement**

`apps/backend/src/modules/website/website-alarms.logic.ts` (pure — no Nest, no I/O):

```ts
// apps/backend/src/modules/website/website-alarms.logic.ts
/**
 * The website door's alarm arithmetic (WP3a, rulings P10/P11; RC10: the
 * thresholds live HERE, not in website.constants.ts) — pure, so the trip rule,
 * the once-per-window keys and the business-hours clock can be pinned by a
 * spec without Redis or a container clock.
 *
 * Every function takes `now`: containers run UTC and every answer here is
 * zone-sensitive. `wallClockInZone` is COPIED from
 * `whatsapp/logic/wa-business-hours.logic.ts` rather than imported — module
 * isolation, the same reason that file copied it from call-center.
 */

/** Captcha-verified submissions per form inside one rolling hour before the form trips (P10). */
export const WEBSITE_ABUSE_TRIP_THRESHOLD = 25;
/** The counting window AND the trip duration — "resets after 60 min" (D11). */
export const WEBSITE_ABUSE_WINDOW_SEC = 60 * 60;
/** How long the "we announced a trip" marker outlives the trip, so the cron can announce the untrip. */
export const WEBSITE_ABUSE_ANNOUNCED_TTL_SEC = 3 * 60 * 60;
/** No real submission for this many wall-clock hours, checked during business hours, is a drought. */
export const WEBSITE_DROUGHT_HOURS = 48;

export type WebsiteUnavailableReason = 'captchaDegraded' | 'tripped' | 'untripped' | 'drought' | 'handlerFailed';

export interface WebsiteBusinessHours {
  tz: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekdays: number[];
  /** Inclusive, minutes from midnight in `tz`. */
  startMin: number;
  /** Exclusive, minutes from midnight in `tz`. */
  endMin: number;
}

/** JobsAdmire is Istanbul-based; the drought alarm speaks only while someone is at a desk. */
export const WEBSITE_BUSINESS_HOURS: WebsiteBusinessHours = Object.freeze({
  tz: 'Europe/Istanbul',
  weekdays: [1, 2, 3, 4, 5],
  startMin: 9 * 60,
  endMin: 18 * 60,
});

const WEEKDAY_INDEX: Readonly<Record<string, number>> = Object.freeze({
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
});

export function wallClockInZone(now: Date, tz: string): { minutesOfDay: number; weekday: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const hour = parseInt(get('hour'), 10) || 0;
  const minute = parseInt(get('minute'), 10) || 0;
  return { minutesOfDay: hour * 60 + minute, weekday: WEEKDAY_INDEX[get('weekday')] ?? 0 };
}

export function isWithinWebsiteBusinessHours(now: Date, hours: WebsiteBusinessHours = WEBSITE_BUSINESS_HOURS): boolean {
  const { minutesOfDay, weekday } = wallClockInZone(now, hours.tz);
  if (!hours.weekdays.includes(weekday)) return false;
  return minutesOfDay >= hours.startMin && minutesOfDay < hours.endMin;
}

/** `YYYY-MM-DD` in the company zone — the drought alarm's once-per-day key. */
export function websiteDayKey(now: Date, tz: string = WEBSITE_BUSINESS_HOURS.tz): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Redis keys for one form's abuse state (RC6 — the ONE key set; ping and the door read these). */
export function websiteAbuseKeys(formKey: string) {
  return {
    count: `website:abuse:count:${formKey}`,
    tripped: `website:abuse:tripped:${formKey}`,
    announced: `website:abuse:announced:${formKey}`,
  };
}

export function shouldTrip(count: number, threshold: number = WEBSITE_ABUSE_TRIP_THRESHOLD): boolean {
  return count >= threshold;
}

/**
 * The once-per-window key for an alarm. Drought is per COMPANY DAY (one bell a
 * day while the silence lasts); everything else is per rolling hour per form.
 * `*` stands in for "no particular form".
 */
export function alarmOnceKey(reason: WebsiteUnavailableReason, formKey: string | null | undefined, now: Date): string {
  const form = formKey || '*';
  return reason === 'drought'
    ? `website:alarm:drought:${form}:${websiteDayKey(now)}`
    : `website:alarm:${reason}:${form}`;
}

export function alarmOnceTtlSec(reason: WebsiteUnavailableReason): number {
  return reason === 'drought' ? 24 * 60 * 60 : 60 * 60;
}

/**
 * No real submission in `hours` wall-clock hours. `null` (never) IS a drought:
 * a door that is on and has never heard a lead is the silence D11 describes.
 */
export function isLeadDrought(lastSubmissionAt: Date | null, now: Date, hours: number = WEBSITE_DROUGHT_HOURS): boolean {
  if (!lastSubmissionAt) return true;
  return now.getTime() - lastSubmissionAt.getTime() >= hours * 60 * 60 * 1000;
}
```

`apps/backend/src/modules/website/website-notify.service.ts` — Task 6's shell, body replaced in place (RC20; same file, same exported names and signatures; the constructor grows here):

```ts
// apps/backend/src/modules/website/website-notify.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EventDispatcher } from '../notifications/event-dispatcher';
import { EVENT_REGISTRY } from '../notifications/event-registry';
import { NotificationSettingsService } from '../notifications/notification-settings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { defaultEmailBody } from '../notifications/custom-template.logic';
import { RedisService } from '../redis/redis.service';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { alarmOnceKey, alarmOnceTtlSec, WebsiteUnavailableReason } from './website-alarms.logic';

export type { WebsiteUnavailableReason } from './website-alarms.logic';

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
  /** Injected by specs and the crons; the clock the once-per-day key is cut on. */
  now?: Date;
}

/**
 * The one door between the website module and the notifications registry
 * (WP3a; the `WaNotifyService` shape; RC6: nothing else in the module calls
 * `EventDispatcher`). Dispatch, warn, never throw — every call here runs AFTER
 * the submission row is committed, and nothing after the created row may
 * throw (P8).
 *
 * THE SECOND HUMAN (P9, D25). `WebsiteIntegrationConfig.secondHumanEmail` is a
 * fallback recipient for every website event, and is NOT a User: the
 * dispatcher's EMAIL branch looks recipients up in `prisma.user`, so the only
 * way to reach them is a direct `queueEmail` with no `userId` (the processor
 * then skips the preference check and always sends). The words are the
 * registry's own — `title(ctx)` / `message(ctx)` — laid out with
 * `defaultEmailBody` in the `module-custom` layout, so the second human reads
 * exactly what the bell says.
 *
 * ONCE PER WINDOW (P10). The registry is throttle-free; the EMITTER owns
 * "once" with `SET NX EX` — `whatsapp.ai.budget_exhausted`'s rule. A Redis
 * outage fails OPEN here: an alarm that cannot dedupe is still an alarm.
 */
@Injectable()
export class WebsiteNotifyService {
  private readonly logger = new Logger(WebsiteNotifyService.name);

  constructor(
    private readonly events: EventDispatcher,
    private readonly notifications: NotificationsService,
    private readonly settings: NotificationSettingsService,
    private readonly websiteConfig: WebsiteIntegrationConfigService,
    private readonly redis: RedisService,
  ) {}

  async formReceived(input: WebsiteFormReceivedInput): Promise<void> {
    const ctx: Record<string, unknown> = {
      submissionId: input.submissionId,
      formKey: input.formKey,
      contactName: input.contactName ?? undefined,
      inquiryNumber: input.inquiryNumber ?? undefined,
      assignedAgentId: input.assignedAgentId ?? undefined,
    };
    try {
      await this.events.dispatch('WEBSITE_FORM_RECEIVED', ctx);
    } catch (err) {
      this.logger.warn(`WEBSITE_FORM_RECEIVED dispatch failed for ${input.submissionId}: ${(err as Error)?.message}`);
    }
    await this.secondHuman('WEBSITE_FORM_RECEIVED', ctx);
  }

  /** Returns whether the alarm fired (false = another emitter already spoke this window). */
  async formsUnavailable(input: WebsiteFormsUnavailableInput): Promise<boolean> {
    const now = input.now ?? new Date();
    const ctx: Record<string, unknown> = {
      reason: input.reason,
      formKey: input.formKey ?? undefined,
      submissionId: input.submissionId ?? undefined,
      detail: input.detail ?? undefined,
      count: input.count,
      hours: input.hours,
      lastSubmissionAt: input.lastSubmissionAt ? input.lastSubmissionAt.toISOString() : undefined,
    };
    let won = true;
    try {
      won = await this.redis.setNx(alarmOnceKey(input.reason, input.formKey, now), now.toISOString(), alarmOnceTtlSec(input.reason));
    } catch (err) {
      this.logger.warn(`website alarm dedupe unavailable (${(err as Error)?.message}); firing ${input.reason} anyway`);
    }
    if (!won) return false;
    try {
      await this.events.dispatch('WEBSITE_FORMS_UNAVAILABLE', ctx);
    } catch (err) {
      this.logger.warn(`WEBSITE_FORMS_UNAVAILABLE(${input.reason}) dispatch failed: ${(err as Error)?.message}`);
    }
    await this.secondHuman('WEBSITE_FORMS_UNAVAILABLE', ctx);
    return true;
  }

  private async secondHuman(key: 'WEBSITE_FORM_RECEIVED' | 'WEBSITE_FORMS_UNAVAILABLE', ctx: Record<string, unknown>): Promise<void> {
    try {
      const row = await this.websiteConfig.getOrCreate();
      const to = row.secondHumanEmail?.trim();
      if (!to) return;
      const def = EVENT_REGISTRY[key];
      const title = def.title(ctx);
      const message = def.message(ctx);
      const link = this.settings.absoluteLink(def.emailLinkPath?.(ctx));
      await this.notifications.queueEmail({
        to,
        subject: def.emailSubject ? def.emailSubject(ctx) : title,
        template: 'module-custom',
        context: { title, message, customBody: defaultEmailBody(title, message, link), locale: 'en' },
        mailbox: 'default',
      });
    } catch (err) {
      this.logger.warn(`second-human mail for ${key} failed: ${(err as Error)?.message}`);
    }
  }
}
```

- [ ] **Step 9: Run tests**

```
cd apps/backend && npx jest src/modules/website --maxWorkers=2
```
Expected: `website-alarms.logic.spec.ts` 7 passed, `website-notify.service.spec.ts` 8 passed; Task 6's `website-forms.service.spec.ts` and Task 7's `website-forms.rerun.spec.ts` unchanged and green (they mock the service).

- [ ] **Step 10: Commit**

```
git add apps/backend/src/modules/website/website-alarms.logic.ts apps/backend/src/modules/website/website-alarms.logic.spec.ts apps/backend/src/modules/website/website-notify.service.ts apps/backend/src/modules/website/website-notify.service.spec.ts
git commit -m "feat(website): notify service with once-per-window alarms and the second-human fan-out

WebsiteNotifyService is the module's one door to the registry: dispatch,
warn, never throw. Alarms dedupe with SET NX EX (per hour per form; per
company day for drought) and fail open on Redis. The second human named on
Website -> Integrations is mailed directly with the registry's own words,
because the dispatcher reaches User rows only (P9, D25). The alarm
thresholds and the one Redis key set live in website-alarms.logic.ts (RC6/RC10).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Part C — autoresponders EN/TR per non-careers form

- [ ] **Step 11: Write the failing test**

`apps/backend/src/modules/website/website-autoresponder.service.spec.ts`:

```ts
// apps/backend/src/modules/website/website-autoresponder.service.spec.ts
/**
 * Autoresponders for the public forms (WP3a, P9; RC12: .hbs only, no per-form
 * columns). Pinned: the eight non-careers, non-newsletter forms each SHIP an EN
 * and a TR template on disk (a missing .hbs does not throw — `renderTemplate`
 * warns and sends `<p>{{message}}</p>`, which looks like success), the locale
 * is passed EXPLICITLY (careers-public's own autoresponder never passes one,
 * so its .tr.hbs is dead), the mailbox is 'default', the CTA base comes from
 * WEBSITE_SITE_URL through Task 9's `websiteSiteUrl` (RC11/RC28 — pinned in
 * website-site-url.spec.ts, not here), and a test-token submission is never
 * answered (P2).
 */
import { existsSync } from 'fs';
import { join } from 'path';
import {
  WEBSITE_AUTORESPONDER_FORM_KEYS,
  WebsiteAutoresponderService,
  websiteAutoresponderSubject,
  websiteAutoresponderTemplate,
} from './website-autoresponder.service';

const TEMPLATES_DIR = join(__dirname, '..', 'email', 'templates');

function make(siteUrl: string | undefined = 'https://www.jobsadmire.com/') {
  const notifications = { queueEmail: jest.fn(async (_o: Record<string, unknown>) => ({ queued: true })) };
  const config = { get: jest.fn((k: string) => (k === 'WEBSITE_SITE_URL' ? siteUrl : undefined)) };
  return { svc: new WebsiteAutoresponderService(notifications as never, config as never), notifications, config };
}

describe('website autoresponder templates', () => {
  it('covers the eight non-careers, non-newsletter forms and nothing else', () => {
    expect([...WEBSITE_AUTORESPONDER_FORM_KEYS].sort()).toEqual(
      ['calculator', 'callback', 'contact', 'fraud', 'hire', 'partner', 'visit', 'workers'],
    );
    expect(websiteAutoresponderTemplate('careers')).toBeNull();
    expect(websiteAutoresponderTemplate('newsletter')).toBeNull();
    expect(websiteAutoresponderTemplate('hire')).toBe('website-hire-autoresponder');
  });

  it.each([...WEBSITE_AUTORESPONDER_FORM_KEYS])('%s ships an EN and a TR .hbs', (key) => {
    const name = websiteAutoresponderTemplate(key)!;
    expect(existsSync(join(TEMPLATES_DIR, `${name}.hbs`))).toBe(true);
    expect(existsSync(join(TEMPLATES_DIR, `${name}.tr.hbs`))).toBe(true);
  });

  it.each([...WEBSITE_AUTORESPONDER_FORM_KEYS])('%s has a localised subject in both languages', (key) => {
    expect(websiteAutoresponderSubject(key, 'en')).toBeTruthy();
    expect(websiteAutoresponderSubject(key, 'tr')).toBeTruthy();
    expect(websiteAutoresponderSubject(key, 'tr')).not.toBe(websiteAutoresponderSubject(key, 'en'));
  });
});

describe('WebsiteAutoresponderService.send', () => {
  it('queues a TR mail on the default mailbox with an explicit locale and the site URL', async () => {
    const { svc, notifications } = make();
    expect(await svc.send({ formKey: 'hire', locale: 'tr', to: 'ayse@example.com', name: 'Ayşe', isTest: false })).toBe(true);
    expect(notifications.queueEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ayse@example.com',
        template: 'website-hire-autoresponder',
        locale: 'tr',
        mailbox: 'default',
        subject: websiteAutoresponderSubject('hire', 'tr'),
        context: expect.objectContaining({ name: 'Ayşe', locale: 'tr', siteUrl: 'https://www.jobsadmire.com' }),
      }),
    );
    expect((notifications.queueEmail.mock.calls[0][0] as Record<string, unknown>).userId).toBeUndefined();
  });

  it('treats anything but tr as English, and falls back to the production site when WEBSITE_SITE_URL is unset', async () => {
    const { svc, notifications } = make(undefined);
    await svc.send({ formKey: 'contact', locale: 'de', to: 'a@b.c', name: null, isTest: false });
    expect(notifications.queueEmail).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'en', context: expect.objectContaining({ siteUrl: 'https://www.jobsadmire.com' }) }),
    );
  });

  it.each([
    ['a test-token submission', { formKey: 'hire', to: 'a@b.c', isTest: true }],
    ['a submission with no e-mail', { formKey: 'hire', to: null, isTest: false }],
    ['a careers application (careers-public answers it)', { formKey: 'careers', to: 'a@b.c', isTest: false }],
    ['a newsletter sign-up (the confirm mail is the answer)', { formKey: 'newsletter', to: 'a@b.c', isTest: false }],
  ])('skips %s', async (_label, input) => {
    const { svc, notifications } = make();
    expect(await svc.send({ locale: 'en', name: null, ...input })).toBe(false);
    expect(notifications.queueEmail).not.toHaveBeenCalled();
  });

  it('never throws — the row is already stored', async () => {
    const { svc, notifications } = make();
    notifications.queueEmail.mockRejectedValueOnce(new Error('queue down'));
    expect(await svc.send({ formKey: 'visit', locale: 'en', to: 'a@b.c', name: 'A', isTest: false })).toBe(false);
  });
});
```

- [ ] **Step 12: Run the test to verify it fails**

```
cd apps/backend && npx jest src/modules/website/website-autoresponder.service.spec.ts --maxWorkers=2
```
Expected: compile error against Task 6's shell — `Module './website-autoresponder.service' has no exported member 'WEBSITE_AUTORESPONDER_FORM_KEYS'` (and the two helpers).

- [ ] **Step 13: Implement**

`apps/backend/src/modules/website/website-autoresponder.service.ts` — Task 6's shell, body replaced in place (RC20; same file, same class name, same `send` signature). The CTA base is Task 9's `websiteSiteUrl` (RC28):

```ts
// apps/backend/src/modules/website/website-autoresponder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { websiteSiteUrl } from './website-site-url';

/**
 * The forms that get a "we received it" mail from JobsAdmire (WP3a, P9).
 *
 * `careers` is answered by `CareersPublicService.apply` on the careers mailbox
 * (P4) and `newsletter` by its own double-opt-in confirm mail — a second mail
 * on either would be two answers to one click.
 */
export const WEBSITE_AUTORESPONDER_FORM_KEYS = [
  'hire', 'contact', 'partner', 'workers', 'callback', 'visit', 'calculator', 'fraud',
] as const;
export type WebsiteAutoresponderFormKey = (typeof WEBSITE_AUTORESPONDER_FORM_KEYS)[number];

/** Subjects are plain strings (`queueEmail` does not template them), so the caller localises. */
const SUBJECTS: Record<WebsiteAutoresponderFormKey, { en: string; tr: string }> = {
  hire: { en: 'We received your hiring request', tr: 'İşe alım talebinizi aldık' },
  contact: { en: 'Thanks for contacting JobsAdmire', tr: 'JobsAdmire ile iletişime geçtiğiniz için teşekkürler' },
  partner: { en: 'Your partnership application has arrived', tr: 'Ortaklık başvurunuz bize ulaştı' },
  workers: { en: 'We received your request for available workers', tr: 'Mevcut çalışan talebinizi aldık' },
  callback: { en: 'We will call you back', tr: 'Sizi geri arayacağız' },
  visit: { en: 'Your office visit request', tr: 'Ofis ziyareti talebiniz' },
  calculator: { en: 'Your cost estimate request', tr: 'Maliyet tahmini talebiniz' },
  fraud: { en: 'We received your report', tr: 'Bildiriminizi aldık' },
};

function isAutoresponderKey(formKey: string): formKey is WebsiteAutoresponderFormKey {
  return (WEBSITE_AUTORESPONDER_FORM_KEYS as readonly string[]).includes(formKey);
}

/** `website-<formKey>-autoresponder` (EN) with a `.tr.hbs` twin; null for forms answered elsewhere. */
export function websiteAutoresponderTemplate(formKey: string): string | null {
  return isAutoresponderKey(formKey) ? `website-${formKey}-autoresponder` : null;
}

export function websiteAutoresponderSubject(formKey: string, locale: 'en' | 'tr'): string {
  if (!isAutoresponderKey(formKey)) return '';
  return SUBJECTS[formKey][locale];
}

export function websiteLocale(locale: string | null | undefined): 'en' | 'tr' {
  return locale === 'tr' ? 'tr' : 'en';
}

/**
 * Public submitters have no User row, so this goes through `queueEmail`
 * directly (never the dispatcher, which resolves User ids) with NO `userId`
 * — the processor then always sends. Locale is passed EXPLICITLY: the site is
 * TR at the root and EN under /en, and careers-public's own autoresponder is
 * EN-only precisely because it forgot to.
 */
@Injectable()
export class WebsiteAutoresponderService {
  private readonly logger = new Logger(WebsiteAutoresponderService.name);

  constructor(
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  /** Returns whether a mail was queued. Never throws — the submission row is already committed. */
  async send(input: {
    formKey: string;
    locale?: string | null;
    to?: string | null;
    name?: string | null;
    isTest: boolean;
  }): Promise<boolean> {
    if (input.isTest) return false; // P2: the test token class is a dry run.
    const to = input.to?.trim();
    if (!to) return false;
    const template = websiteAutoresponderTemplate(input.formKey);
    if (!template) return false;
    const locale = websiteLocale(input.locale);
    try {
      await this.notifications.queueEmail({
        to,
        subject: websiteAutoresponderSubject(input.formKey, locale),
        template,
        context: { name: input.name?.trim() || '', siteUrl: websiteSiteUrl(this.config), locale },
        locale,
        mailbox: 'default',
      });
      return true;
    } catch (err) {
      this.logger.warn(`website autoresponder (${input.formKey}) failed: ${(err as Error)?.message}`);
      return false;
    }
  }
}
```

Sixteen templates in `apps/backend/src/modules/email/templates/` (`nest-cli.json` ships `modules/email/templates/**/*.hbs` to `dist`; inline styles like `applicant-confirmation.hbs`; `{{#if name}}` because a name may arrive empty; `{{siteUrl}}` + the website's real slugs from `jobsadmire-website/src/i18n/routing.ts` — TR at the root, EN under `/en`; no enum values in copy):

`website-hire-autoresponder.hbs`
```hbs
<h2>We received your hiring request</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Thank you for telling us about the workers you need. A JobsAdmire consultant will review your request and contact you within one business day to confirm the roles, numbers and timing.</p>
<p>In the meantime you can read how the sourcing and work-permit process works on our website.</p>
<a href="{{siteUrl}}/en/hire-workers" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">How hiring works</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send this request, you can ignore this e-mail.</p>
```
`website-hire-autoresponder.tr.hbs`
```hbs
<h2>İşe alım talebinizi aldık</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>İhtiyaç duyduğunuz çalışanlar hakkında bize bilgi verdiğiniz için teşekkürler. Bir JobsAdmire danışmanı talebinizi inceleyecek ve pozisyonları, sayıları ve zamanlamayı teyit etmek için bir iş günü içinde sizinle iletişime geçecektir.</p>
<p>Bu sırada tedarik ve çalışma izni sürecinin nasıl işlediğini web sitemizden okuyabilirsiniz.</p>
<a href="{{siteUrl}}/isci-talebi" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Süreç nasıl işler</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bu talebi siz göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-contact-autoresponder.hbs`
```hbs
<h2>Thanks for contacting JobsAdmire</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Your message has reached our team. We answer every message within one business day; if it is urgent, our WhatsApp line on the website is the fastest way to reach us.</p>
<a href="{{siteUrl}}/en" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Visit jobsadmire.com</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send this message, you can ignore this e-mail.</p>
```
`website-contact-autoresponder.tr.hbs`
```hbs
<h2>JobsAdmire ile iletişime geçtiğiniz için teşekkürler</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>Mesajınız ekibimize ulaştı. Her mesaja bir iş günü içinde yanıt veriyoruz; acilse web sitemizdeki WhatsApp hattı bize ulaşmanın en hızlı yoludur.</p>
<a href="{{siteUrl}}" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">jobsadmire.com'u ziyaret edin</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bu mesajı siz göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-partner-autoresponder.hbs`
```hbs
<h2>Your partnership application has arrived</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Thank you for applying to work with JobsAdmire as a sourcing or placement partner. Our partnerships team reviews every application personally and will get back to you within three business days with the next step.</p>
<a href="{{siteUrl}}/en/partner-with-us" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">About the partner programme</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send this application, you can ignore this e-mail.</p>
```
`website-partner-autoresponder.tr.hbs`
```hbs
<h2>Ortaklık başvurunuz bize ulaştı</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>JobsAdmire ile tedarik veya yerleştirme ortağı olarak çalışmak için başvurduğunuz için teşekkürler. Ortaklık ekibimiz her başvuruyu bizzat inceler ve bir sonraki adım için üç iş günü içinde size dönüş yapar.</p>
<a href="{{siteUrl}}/ortak-olun" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Ortaklık programı hakkında</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bu başvuruyu siz göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-workers-autoresponder.hbs`
```hbs
<h2>We received your request for available workers</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Thank you for your interest in our available candidates. A consultant will check the current pool against the roles you described and contact you within one business day.</p>
<a href="{{siteUrl}}/en/available-workers" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Available workers</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send this request, you can ignore this e-mail.</p>
```
`website-workers-autoresponder.tr.hbs`
```hbs
<h2>Mevcut çalışan talebinizi aldık</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>Mevcut adaylarımıza gösterdiğiniz ilgi için teşekkürler. Bir danışmanımız güncel aday havuzunu tarif ettiğiniz pozisyonlarla karşılaştıracak ve bir iş günü içinde sizinle iletişime geçecektir.</p>
<a href="{{siteUrl}}/adaylar" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Mevcut adaylar</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bu talebi siz göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-callback-autoresponder.hbs`
```hbs
<h2>We will call you back</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>We have your callback request. A consultant will call the number you gave us during business hours (09:00–18:00 Türkiye time, Monday to Friday). If you prefer a specific time, reply to this e-mail and tell us.</p>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not ask for a call, you can ignore this e-mail.</p>
```
`website-callback-autoresponder.tr.hbs`
```hbs
<h2>Sizi geri arayacağız</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>Geri arama talebiniz bize ulaştı. Bir danışmanımız çalışma saatleri içinde (Pazartesi–Cuma 09:00–18:00, Türkiye saati) verdiğiniz numarayı arayacaktır. Belirli bir saat tercih ediyorsanız bu e-postayı yanıtlayarak bize bildirin.</p>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Aranmayı siz talep etmediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-visit-autoresponder.hbs`
```hbs
<h2>Your office visit request</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Thank you for asking to visit us. We will confirm a date and time by e-mail or phone within one business day. Our offices and directions are on the website.</p>
<a href="{{siteUrl}}/en/contact" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Our offices</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send this request, you can ignore this e-mail.</p>
```
`website-visit-autoresponder.tr.hbs`
```hbs
<h2>Ofis ziyareti talebiniz</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>Bizi ziyaret etmek istediğiniz için teşekkürler. Tarih ve saati bir iş günü içinde e-posta veya telefonla teyit edeceğiz. Ofislerimiz ve ulaşım bilgileri web sitemizde.</p>
<a href="{{siteUrl}}/iletisim" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Ofislerimiz</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bu talebi siz göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-calculator-autoresponder.hbs`
```hbs
<h2>Your cost estimate request</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Thank you for using the cost calculator. The figures on the website are indicative; a consultant will send you a written estimate for your exact roles, numbers and countries within one business day.</p>
<a href="{{siteUrl}}/en/hiring-cost-calculator" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Back to the calculator</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send this request, you can ignore this e-mail.</p>
```
`website-calculator-autoresponder.tr.hbs`
```hbs
<h2>Maliyet tahmini talebiniz</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>Maliyet hesaplayıcıyı kullandığınız için teşekkürler. Web sitesindeki rakamlar yol göstericidir; bir danışmanımız tam pozisyon, sayı ve ülkeleriniz için yazılı bir tahmini bir iş günü içinde size gönderecektir.</p>
<a href="{{siteUrl}}/maliyet-hesaplayici" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Hesaplayıcıya dön</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bu talebi siz göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```
`website-fraud-autoresponder.hbs`
```hbs
<h2>We received your report</h2>
<p>Hi{{#if name}} {{name}}{{/if}},</p>
<p>Thank you for reporting this to us. JobsAdmire never asks candidates for money, and we take every report of someone using our name seriously. Our compliance team will review what you sent and may contact you for details. Please do not share this e-mail with the person you reported.</p>
<a href="{{siteUrl}}/en/verify" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">How to verify a JobsAdmire representative</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not send a report, you can ignore this e-mail.</p>
```
`website-fraud-autoresponder.tr.hbs`
```hbs
<h2>Bildiriminizi aldık</h2>
<p>Merhaba{{#if name}} {{name}}{{/if}},</p>
<p>Bunu bize bildirdiğiniz için teşekkürler. JobsAdmire adaylardan asla para talep etmez ve adımızı kullanan herkesle ilgili her bildirimi ciddiye alırız. Uyum ekibimiz gönderdiklerinizi inceleyecek ve ayrıntılar için sizinle iletişime geçebilir. Lütfen bu e-postayı bildirdiğiniz kişiyle paylaşmayın.</p>
<a href="{{siteUrl}}/temsilci-dogrulama" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Bir JobsAdmire temsilcisi nasıl doğrulanır</a>
<p style="margin-top:24px;color:#6b7280;font-size:13px;">Bir bildirim göndermediyseniz bu e-postayı dikkate almayabilirsiniz.</p>
```

- [ ] **Step 14: Run tests and commit**

```
cd apps/backend && npx jest src/modules/website/website-autoresponder.service.spec.ts --maxWorkers=2
```
Expected: all green, including the 16 on-disk template checks (the `websiteSiteUrl` helper itself is pinned by Task 9's `website-site-url.spec.ts`).

```
git add apps/backend/src/modules/website/website-autoresponder.service.ts apps/backend/src/modules/website/website-autoresponder.service.spec.ts apps/backend/src/modules/email/templates/website-hire-autoresponder.hbs apps/backend/src/modules/email/templates/website-hire-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-contact-autoresponder.hbs apps/backend/src/modules/email/templates/website-contact-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-partner-autoresponder.hbs apps/backend/src/modules/email/templates/website-partner-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-workers-autoresponder.hbs apps/backend/src/modules/email/templates/website-workers-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-callback-autoresponder.hbs apps/backend/src/modules/email/templates/website-callback-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-visit-autoresponder.hbs apps/backend/src/modules/email/templates/website-visit-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-calculator-autoresponder.hbs apps/backend/src/modules/email/templates/website-calculator-autoresponder.tr.hbs apps/backend/src/modules/email/templates/website-fraud-autoresponder.hbs apps/backend/src/modules/email/templates/website-fraud-autoresponder.tr.hbs
git commit -m "feat(website): EN/TR autoresponders for the eight non-careers forms

One .hbs pair per form key from the default mailbox, explicit locale on the
queued job (careers-public's own path never passes one), subject localised by
the caller, CTA base from WEBSITE_SITE_URL (RC11), no userId so the processor
always sends. careers stays on the careers mailbox (P4/P9) and newsletter is
answered by its confirm mail.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

#### Part D — abuse auto-trip, lead-drought cron, purge cron, ping wiring, module

- [ ] **Step 15: Write the failing tests**

`apps/backend/src/modules/website/website-abuse.service.spec.ts`:

```ts
// apps/backend/src/modules/website/website-abuse.service.spec.ts
/**
 * The abuse auto-trip (P10; RC6: the ONE trip writer — ping and the door read
 * its keys): captcha-verified counts per form in Redis, a 60-minute window,
 * one SETNX that both trips the form and claims the trip notice. Redis down =
 * fail OPEN (the door must never 429 because a cache died; the token, captcha
 * and dedupe are the real gates).
 */
import { WebsiteAbuseService } from './website-abuse.service';
import { WEBSITE_ABUSE_TRIP_THRESHOLD, WEBSITE_ABUSE_WINDOW_SEC } from './website-alarms.logic';

function make(opts: { count?: number; setNx?: boolean; exists?: boolean; down?: boolean } = {}) {
  const fail = async () => { throw new Error('redis down'); };
  const redis = {
    incr: jest.fn(opts.down ? fail : async (_k: string) => opts.count ?? 1),
    expire: jest.fn(async (_k: string, _s: number) => undefined),
    setNx: jest.fn(opts.down ? fail : async (_k: string, _v: string, _t: number) => opts.setNx ?? true),
    set: jest.fn(async (_k: string, _v: string, _t?: number) => undefined),
    exists: jest.fn(opts.down ? fail : async (_k: string) => opts.exists ?? false),
    del: jest.fn(async (_k: string) => undefined),
  };
  const notify = { formsUnavailable: jest.fn(async (_i: Record<string, unknown>) => true) };
  return { svc: new WebsiteAbuseService(redis as never, notify as never), redis, notify };
}

describe('WebsiteAbuseService.recordVerified', () => {
  it('starts the 60-minute window on the first count', async () => {
    const { svc, redis } = make({ count: 1 });
    expect(await svc.recordVerified('hire')).toEqual({ count: 1, tripped: false, justTripped: false });
    expect(redis.expire).toHaveBeenCalledWith('website:abuse:count:hire', WEBSITE_ABUSE_WINDOW_SEC);
  });

  it('does not restart the window on later counts', async () => {
    const { svc, redis } = make({ count: 2 });
    await svc.recordVerified('hire');
    expect(redis.expire).not.toHaveBeenCalled();
  });

  it('trips at the threshold, announces it once, and notifies with the count', async () => {
    const { svc, redis, notify } = make({ count: WEBSITE_ABUSE_TRIP_THRESHOLD });
    expect(await svc.recordVerified('hire')).toEqual({ count: WEBSITE_ABUSE_TRIP_THRESHOLD, tripped: true, justTripped: true });
    expect(redis.setNx).toHaveBeenCalledWith('website:abuse:tripped:hire', expect.any(String), WEBSITE_ABUSE_WINDOW_SEC);
    expect(redis.set).toHaveBeenCalledWith('website:abuse:announced:hire', expect.any(String), expect.any(Number));
    expect(notify.formsUnavailable).toHaveBeenCalledWith(expect.objectContaining({ reason: 'tripped', formKey: 'hire', count: WEBSITE_ABUSE_TRIP_THRESHOLD }));
  });

  it('says nothing when the form is already tripped', async () => {
    const { svc, notify } = make({ count: WEBSITE_ABUSE_TRIP_THRESHOLD + 3, setNx: false });
    expect(await svc.recordVerified('hire')).toEqual({ count: WEBSITE_ABUSE_TRIP_THRESHOLD + 3, tripped: true, justTripped: false });
    expect(notify.formsUnavailable).not.toHaveBeenCalled();
  });

  it('fails open when Redis is down', async () => {
    const { svc } = make({ down: true });
    expect(await svc.recordVerified('hire')).toEqual({ count: 0, tripped: false, justTripped: false });
  });
});

describe('WebsiteAbuseService.isTripped / trippedForms', () => {
  it('reads the trip marker', async () => {
    const { svc, redis } = make({ exists: true });
    expect(await svc.isTripped('hire')).toBe(true);
    expect(redis.exists).toHaveBeenCalledWith('website:abuse:tripped:hire');
  });

  it('never 429s because Redis is down', async () => {
    const { svc } = make({ down: true });
    expect(await svc.isTripped('hire')).toBe(false);
    expect(await svc.trippedForms()).toEqual([]);
  });

  it('lists every tripped form for ping (P11) in WEBSITE_FORM_KEYS order', async () => {
    const { svc, redis } = make();
    redis.exists.mockImplementation(async (k: string) => k.endsWith(':hire') || k.endsWith(':fraud'));
    expect(await svc.trippedForms()).toEqual(['hire', 'fraud']);
  });
});
```

`apps/backend/src/modules/website/website-alarms.cron.spec.ts`:

```ts
// apps/backend/src/modules/website/website-alarms.cron.spec.ts
/**
 * The five-minute alarm tick (P10): announces an UNTRIP once when a form's
 * trip marker has expired but its "announced" marker is still there, and
 * raises the lead-drought alarm during business hours. Reads the module flag
 * per tick through Task 2's helper (P1, the `wa-campaign-runner` precedent).
 */
import { WebsiteAlarmsCron } from './website-alarms.cron';
import { WEBSITE_MODULE_ENABLED_ENV } from './website-module-flag';

function make(opts: { enabled?: boolean; tripped?: string[]; announced?: string[]; last?: Date | null } = {}) {
  const tripped = new Set(opts.tripped ?? []);
  const announced = new Set(opts.announced ?? []);
  const redis = {
    exists: jest.fn(async (k: string) => {
      const form = k.split(':').pop()!;
      return k.includes(':tripped:') ? tripped.has(form) : announced.has(form);
    }),
    del: jest.fn(async (k: string) => { announced.delete(k.split(':').pop()!); }),
  };
  const prisma = {
    websiteFormSubmission: {
      findFirst: jest.fn(async (_a: unknown) => (opts.last === undefined ? { createdAt: new Date() } : opts.last && { createdAt: opts.last })),
    },
  };
  const notify = { formsUnavailable: jest.fn(async (_i: Record<string, unknown>) => true) };
  const config = { get: jest.fn((k: string) => (k === WEBSITE_MODULE_ENABLED_ENV ? String(opts.enabled ?? true) : undefined)) };
  return { cron: new WebsiteAlarmsCron(prisma as never, redis as never, notify as never, config as never), prisma, redis, notify, config };
}

const MON_10_IST = new Date('2026-09-21T07:00:00.000Z');
const SAT_11_IST = new Date('2026-09-19T08:00:00.000Z');

describe('WebsiteAlarmsCron', () => {
  it('does nothing while the module flag is off', async () => {
    const { cron, redis, prisma } = make({ enabled: false, announced: ['hire'] });
    await cron.runTick(MON_10_IST);
    expect(redis.exists).not.toHaveBeenCalled();
    expect(prisma.websiteFormSubmission.findFirst).not.toHaveBeenCalled();
  });

  it('announces an untrip once — the trip marker is gone, the announced marker is not', async () => {
    const { cron, notify, redis } = make({ announced: ['hire'] });
    await cron.runTick(MON_10_IST);
    expect(notify.formsUnavailable).toHaveBeenCalledWith(expect.objectContaining({ reason: 'untripped', formKey: 'hire' }));
    expect(redis.del).toHaveBeenCalledWith('website:abuse:announced:hire');
    notify.formsUnavailable.mockClear();
    await cron.runTick(MON_10_IST);
    expect(notify.formsUnavailable).not.toHaveBeenCalledWith(expect.objectContaining({ reason: 'untripped' }));
  });

  it('stays quiet about a form that is still tripped', async () => {
    const { cron, notify } = make({ tripped: ['hire'], announced: ['hire'] });
    await cron.runTick(MON_10_IST);
    expect(notify.formsUnavailable).not.toHaveBeenCalledWith(expect.objectContaining({ reason: 'untripped' }));
  });

  it('raises the drought alarm in business hours when no real lead arrived for 48 h', async () => {
    const { cron, notify, prisma } = make({ last: new Date('2026-09-18T07:00:00.000Z') });
    await cron.runTick(MON_10_IST);
    expect(prisma.websiteFormSubmission.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isTest: false }, orderBy: { createdAt: 'desc' } }),
    );
    expect(notify.formsUnavailable).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'drought', hours: 48, lastSubmissionAt: new Date('2026-09-18T07:00:00.000Z'), now: MON_10_IST }),
    );
  });

  it('does not evaluate drought outside business hours', async () => {
    const { cron, notify, prisma } = make({ last: null });
    await cron.runTick(SAT_11_IST);
    expect(prisma.websiteFormSubmission.findFirst).not.toHaveBeenCalled();
    expect(notify.formsUnavailable).not.toHaveBeenCalled();
  });

  it('is not a drought when a lead arrived recently', async () => {
    const { cron, notify } = make({ last: new Date('2026-09-21T06:00:00.000Z') });
    await cron.runTick(MON_10_IST);
    expect(notify.formsUnavailable).not.toHaveBeenCalled();
  });

  it('never lets Redis take the tick down', async () => {
    const { cron, redis, notify } = make({ last: null });
    redis.exists.mockRejectedValue(new Error('redis down'));
    await expect(cron.runTick(MON_10_IST)).resolves.toBeUndefined();
    expect(notify.formsUnavailable).toHaveBeenCalledWith(expect.objectContaining({ reason: 'drought' }));
  });
});
```

`apps/backend/src/modules/website/website-purge.cron.spec.ts`:

```ts
// apps/backend/src/modules/website/website-purge.cron.spec.ts
/**
 * The 90-day purge (P10; RC5): rows whose `purgeAfter` has passed are deleted
 * in batches; a FRAUD_REPORT row's private objects (payloadJson.fields.
 * evidenceKeys, read through WebsiteFraudEvidenceService.evidenceKeysOf) go
 * FIRST, and a row with ANY object that could not be removed is kept for the
 * next night — a deleted pointer to a surviving object is an orphan nobody
 * will ever sweep.
 */
import { WebsitePurgeCron } from './website-purge.cron';
import { WEBSITE_MODULE_ENABLED_ENV } from './website-module-flag';

type Row = { id: string; payloadJson: unknown };

function make(opts: { enabled?: boolean; rows?: Row[]; gone?: (key: string) => boolean } = {}) {
  const rows = [...(opts.rows ?? [])];
  const prisma = {
    websiteFormSubmission: {
      findMany: jest.fn(async (_a: unknown) => rows.splice(0, 100)),
      deleteMany: jest.fn(async (_a: unknown) => ({ count: 0 })),
    },
  };
  const upload = { deleteFileChecked: jest.fn(async (key: string) => (opts.gone ? opts.gone(key) : true)) };
  const config = { get: jest.fn((k: string) => (k === WEBSITE_MODULE_ENABLED_ENV ? String(opts.enabled ?? true) : undefined)) };
  return { cron: new WebsitePurgeCron(prisma as never, upload as never, config as never), prisma, upload };
}

const NOW = new Date('2026-12-20T04:30:00.000Z');
const plain = (id: string): Row => ({ id, payloadJson: { fields: { name: 'A', email: 'a@b.c' } } });
const fraud = (id: string, keys: string[]): Row => ({ id, payloadJson: { fields: { description: 'x', evidenceKeys: keys } } });

describe('WebsitePurgeCron', () => {
  it('skips the sweep while the module flag is off', async () => {
    const { cron, prisma } = make({ enabled: false, rows: [plain('s1')] });
    await cron.run(NOW);
    expect(prisma.websiteFormSubmission.findMany).not.toHaveBeenCalled();
  });

  it('selects only rows whose purgeAfter has passed, oldest first, in batches of 100, reading the payload', async () => {
    const { cron, prisma } = make({ rows: [plain('s1')] });
    await cron.run(NOW);
    expect(prisma.websiteFormSubmission.findMany).toHaveBeenCalledWith({
      where: { purgeAfter: { lte: NOW } },
      select: { id: true, payloadJson: true },
      orderBy: { purgeAfter: 'asc' },
      take: 100,
    });
    expect(prisma.websiteFormSubmission.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['s1'] } } });
  });

  it('deletes every private object before the row that points at them', async () => {
    const { cron, prisma, upload } = make({ rows: [fraud('s2', ['website-fraud/abc.jpg', 'website-fraud/def.pdf'])] });
    await cron.run(NOW);
    expect(upload.deleteFileChecked).toHaveBeenCalledWith('website-fraud/abc.jpg');
    expect(upload.deleteFileChecked).toHaveBeenCalledWith('website-fraud/def.pdf');
    expect(upload.deleteFileChecked.mock.invocationCallOrder[1]).toBeLessThan(prisma.websiteFormSubmission.deleteMany.mock.invocationCallOrder[0]);
    expect(prisma.websiteFormSubmission.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['s2'] } } });
  });

  it('keeps a row with any object that could not be removed, so tomorrow retries it', async () => {
    const { cron, prisma } = make({
      rows: [fraud('s3', ['website-fraud/ok.jpg', 'website-fraud/stuck.jpg']), plain('s4')],
      gone: (key) => !key.includes('stuck'),
    });
    await cron.run(NOW);
    expect(prisma.websiteFormSubmission.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['s4'] } } });
  });

  it('ignores keys outside the website-fraud/ prefix — a hand-edited row cannot aim the purge at another bucket path', async () => {
    const { cron, upload } = make({ rows: [fraud('s5', ['careers-cv/x.pdf'])] });
    await cron.run(NOW);
    expect(upload.deleteFileChecked).not.toHaveBeenCalled();
  });

  it('does nothing, quietly, when nothing is due', async () => {
    const { cron, prisma } = make({ rows: [] });
    await cron.run(NOW);
    expect(prisma.websiteFormSubmission.deleteMany).not.toHaveBeenCalled();
  });

  it('never throws out of the tick', async () => {
    const { cron, prisma } = make();
    prisma.websiteFormSubmission.findMany.mockRejectedValueOnce(new Error('db down'));
    await expect(cron.run(NOW)).resolves.toBeUndefined();
  });
});
```

`apps/backend/src/modules/website/website-ping.service.spec.ts` (Task 4 file) — two edits. (1) Replace the line

```ts
    return { svc: new WebsitePingService(prisma as never, config as never), prisma, config };
```

with

```ts
    // RC6/RC13: WebsiteAbuseService is the one trip writer; ping reads it.
    const abuse = { trippedForms: jest.fn(async () => over.tripped ?? []) };
    return { svc: new WebsitePingService(prisma as never, config as never, abuse as never), prisma, config, abuse };
```

and widen `build()`'s parameter type from `over: { turnstile?: boolean; secondHuman?: boolean; last?: Date | null } = {}` to `over: { turnstile?: boolean; secondHuman?: boolean; last?: Date | null; tripped?: string[] } = {}`. (2) Append inside `describe('WebsitePingService', …)`, after its last test:

```ts

  it('lists the forms the abuse service says are tripped (P11)', async () => {
    const { svc, abuse } = build({ tripped: ['hire', 'fraud'] });
    await expect(svc.ping('write')).resolves.toMatchObject({ trippedForms: ['hire', 'fraud'] });
    expect(abuse.trippedForms).toHaveBeenCalledTimes(1);
  });
```

Also replace the sentence in the file's header comment ` * \`trippedForms\` is \`[]\` until Task 10 injects WebsiteAbuseService (RC6); the` / ` * \`build()\` helper below is where that task adds its mock.` with ` * \`trippedForms\` comes from WebsiteAbuseService (RC6), mocked in \`build()\`.`

- [ ] **Step 16: Run tests to verify they fail**

```
cd apps/backend && npx jest src/modules/website --maxWorkers=2
```
Expected: `website-abuse.service.spec.ts` compiles against Task 6's shell and fails on `expire`/`setNx` expectations and on `trippedForms` (returns `[]`); `website-alarms.cron.spec.ts` and `website-purge.cron.spec.ts` fail with `Cannot find module './website-alarms.cron'` / `'./website-purge.cron'`; `website-ping.service.spec.ts` › `lists the forms the abuse service says are tripped` fails (`trippedForms: []`). Everything else stays green.

- [ ] **Step 17: Implement**

`apps/backend/src/modules/website/website-abuse.service.ts` — Task 6's shell, body replaced in place (RC20; same file, same class name and method signatures; the constructor grows here):

```ts
// apps/backend/src/modules/website/website-abuse.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { WEBSITE_FORM_KEYS } from '@jobsadmire/constants';
import { RedisService } from '../redis/redis.service';
import {
  shouldTrip,
  websiteAbuseKeys,
  WEBSITE_ABUSE_ANNOUNCED_TTL_SEC,
  WEBSITE_ABUSE_WINDOW_SEC,
} from './website-alarms.logic';
import { WebsiteNotifyService } from './website-notify.service';

/**
 * Abuse auto-trip for the public forms (WP3a, P10; D11: "counts
 * captcha-verified submissions only, resets after 60 min, notifies on
 * trip/untrip"). RC6: this is the ONE trip writer — the door's 429 check and
 * ping's `trippedForms` both read `websiteAbuseKeys().tripped`.
 *
 * THREE KEYS PER FORM, all in Redis because the counter is on the hot path of
 * a public POST and a column write there would be the cost the rule exists to
 * avoid (the `wa-ai.engine.ts` budget-notice argument):
 *   count     — INCR, EXPIRE on the first hit → a rolling 60-minute window;
 *   tripped   — SET NX EX 3600 when the count reaches the threshold. Winning
 *               the SETNX IS the trip transition and IS the once-per-window
 *               claim for the trip notice; its expiry IS the untrip;
 *   announced — set beside the trip so `WebsiteAlarmsCron` can tell "this
 *               form untripped and nobody said so" from "never tripped".
 *
 * FAIL OPEN. `RedisService` swallows its connect failure and rejects at call
 * time; a door that 429s every visitor because a cache died is the outage D11
 * is about. The token, captcha and dedupe are the gates; this is a cap.
 */
@Injectable()
export class WebsiteAbuseService {
  private readonly logger = new Logger(WebsiteAbuseService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly notify: WebsiteNotifyService,
  ) {}

  /** Is this form answering 429 right now? */
  async isTripped(formKey: string): Promise<boolean> {
    try {
      return await this.redis.exists(websiteAbuseKeys(formKey).tripped);
    } catch (err) {
      this.logger.warn(`abuse marker unreadable for ${formKey} (${(err as Error)?.message}); treating as open`);
      return false;
    }
  }

  /** Every tripped form, for `ping` (P11), in WEBSITE_FORM_KEYS order. */
  async trippedForms(): Promise<string[]> {
    const out: string[] = [];
    for (const key of WEBSITE_FORM_KEYS) {
      if (await this.isTripped(key)) out.push(key);
    }
    return out;
  }

  /**
   * Count one captcha-VERIFIED, non-test submission. Called by the door after
   * captcha passed (not degraded) and after the row is written.
   */
  async recordVerified(formKey: string, now: Date = new Date()): Promise<{ count: number; tripped: boolean; justTripped: boolean }> {
    const keys = websiteAbuseKeys(formKey);
    try {
      const count = await this.redis.incr(keys.count);
      if (count === 1) await this.redis.expire(keys.count, WEBSITE_ABUSE_WINDOW_SEC);
      if (!shouldTrip(count)) return { count, tripped: false, justTripped: false };

      const justTripped = await this.redis.setNx(keys.tripped, now.toISOString(), WEBSITE_ABUSE_WINDOW_SEC);
      if (justTripped) {
        await this.redis.set(keys.announced, now.toISOString(), WEBSITE_ABUSE_ANNOUNCED_TTL_SEC);
        await this.notify.formsUnavailable({ reason: 'tripped', formKey, count, now });
        this.logger.warn(`website form ${formKey} tripped after ${count} verified submissions in one hour`);
      }
      return { count, tripped: true, justTripped };
    } catch (err) {
      this.logger.warn(`abuse counter unavailable for ${formKey} (${(err as Error)?.message}); not counting`);
      return { count: 0, tripped: false, justTripped: false };
    }
  }
}
```

`apps/backend/src/modules/website/website-alarms.cron.ts`:

```ts
// apps/backend/src/modules/website/website-alarms.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { WEBSITE_FORM_KEYS } from '@jobsadmire/constants';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { websiteModuleEnabled } from './website-module-flag';
import {
  isLeadDrought,
  isWithinWebsiteBusinessHours,
  websiteAbuseKeys,
  WEBSITE_DROUGHT_HOURS,
} from './website-alarms.logic';
import { WebsiteNotifyService } from './website-notify.service';

/**
 * Five-minute alarm tick for the website door (WP3a, P10).
 *
 * UNTRIP. A form's trip marker expires on its own (60 minutes); nothing fires
 * on an expiry, so this tick is what turns "the marker is gone and the
 * announced marker is not" into ONE `untripped` notice, deleting the announced
 * marker as the claim. `WebsiteNotifyService` adds its own per-hour SETNX on
 * top, so two containers racing a tick still say it once.
 *
 * DROUGHT. During business hours only: no real (`isTest: false`) submission
 * for `WEBSITE_DROUGHT_HOURS` → `drought`, once per company day (the notify
 * service cuts that key). "Never" counts as silence — a door that is on and
 * has never heard a lead is exactly the failure D11 names.
 *
 * FLAG PER TICK (P1). `websiteModuleEnabled()` is a live `ConfigService.get`
 * (Task 2's one reader of the variable), like the campaign runner's
 * allowlist, so flipping `WEBSITE_MODULE_ENABLED` needs a container recreate
 * and nothing else. Never throws; one bad arm must not stop the other.
 */
@Injectable()
export class WebsiteAlarmsCron {
  private readonly logger = new Logger(WebsiteAlarmsCron.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly notify: WebsiteNotifyService,
    private readonly config: ConfigService,
  ) {}

  @Cron('0 */5 * * * *', { name: 'website-alarms' })
  async tick(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      await this.runTick(new Date());
    } catch (err) {
      this.logger.warn(`website alarms tick failed: ${(err as Error)?.message}`);
    } finally {
      this.running = false;
    }
  }

  async runTick(now: Date): Promise<void> {
    if (!websiteModuleEnabled(this.config)) return;
    await this.announceUntrips(now);
    await this.checkDrought(now);
  }

  private async announceUntrips(now: Date): Promise<void> {
    for (const formKey of WEBSITE_FORM_KEYS) {
      try {
        const keys = websiteAbuseKeys(formKey);
        const tripped = await this.redis.exists(keys.tripped);
        if (tripped) continue;
        const announced = await this.redis.exists(keys.announced);
        if (!announced) continue;
        await this.redis.del(keys.announced);
        await this.notify.formsUnavailable({ reason: 'untripped', formKey, now });
        this.logger.log(`website form ${formKey} is accepting again`);
      } catch (err) {
        this.logger.warn(`untrip check failed for ${formKey}: ${(err as Error)?.message}`);
      }
    }
  }

  private async checkDrought(now: Date): Promise<void> {
    if (!isWithinWebsiteBusinessHours(now)) return;
    try {
      const last = await this.prisma.websiteFormSubmission.findFirst({
        where: { isTest: false },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });
      const lastSubmissionAt = last?.createdAt ?? null;
      if (!isLeadDrought(lastSubmissionAt, now)) return;
      await this.notify.formsUnavailable({ reason: 'drought', hours: WEBSITE_DROUGHT_HOURS, lastSubmissionAt, now });
    } catch (err) {
      this.logger.warn(`drought check failed: ${(err as Error)?.message}`);
    }
  }
}
```

`apps/backend/src/modules/website/website-purge.cron.ts`:

```ts
// apps/backend/src/modules/website/website-purge.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { WebsiteFraudEvidenceService } from './website-fraud-evidence.service';
import { websiteModuleEnabled } from './website-module-flag';

const BATCH_SIZE = 100;
/** Ceiling per night, so a backlog is a few nights of work rather than one long transaction. */
const MAX_BATCHES = 20;

/**
 * The website door's 90-day purge (WP3a, P10; D11: `purgeAfter` = 90 days
 * after HANDLED, set by the core's `runHandler`). Daily at 04:30 UTC —
 * deliberately not 03:00, which is `CareersRetentionCron`'s slot
 * (`EVERY_DAY_AT_3AM`), so the two sweeps never share a minute of MinIO and
 * Postgres.
 *
 * HARD DELETE of the submission row: `payloadJson` IS the personal data
 * (names, phones, e-mails, a fraud report's evidence), and everything the
 * business keeps — the Inquiry, the applicant, the subscriber — is its own
 * row with its own retention. A FRAUD_REPORT row names up to three private
 * objects under `website-fraud/` in `payloadJson.fields.evidenceKeys` (RC5;
 * read through `WebsiteFraudEvidenceService.evidenceKeysOf`, which re-applies
 * the prefix lock) that nothing else references, so the objects go FIRST with
 * `deleteFileChecked`, and a row with ANY object that could not be removed is
 * KEPT for the next night: deleting the pointer would leave an orphan no
 * sweep can find.
 *
 * `WebsiteSubscriber` is not purged here: an UNSUBSCRIBED row is the proof we
 * honoured the request, and a CONFIRMED one is live consent.
 *
 * Reads the module flag per tick (P1). Never throws.
 */
@Injectable()
export class WebsitePurgeCron {
  private readonly logger = new Logger(WebsitePurgeCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
    private readonly config: ConfigService,
  ) {}

  @Cron('0 30 4 * * *', { name: 'website-purge' })
  async tick(): Promise<void> {
    await this.run(new Date());
  }

  async run(now: Date): Promise<void> {
    if (!websiteModuleEnabled(this.config)) {
      this.logger.log('website purge skipped — the website module is off');
      return;
    }
    let deleted = 0;
    let kept = 0;
    let objects = 0;
    try {
      for (let batch = 0; batch < MAX_BATCHES; batch += 1) {
        const rows = await this.prisma.websiteFormSubmission.findMany({
          where: { purgeAfter: { lte: now } },
          select: { id: true, payloadJson: true },
          orderBy: { purgeAfter: 'asc' },
          take: BATCH_SIZE,
        });
        if (rows.length === 0) break;

        const deletable: string[] = [];
        for (const row of rows) {
          const keys = WebsiteFraudEvidenceService.evidenceKeysOf(row.payloadJson);
          let allGone = true;
          for (const key of keys) {
            const gone = await this.upload.deleteFileChecked(key);
            if (gone) objects += 1;
            else allGone = false;
          }
          if (allGone) deletable.push(row.id);
          else kept += 1;
        }
        if (deletable.length) {
          await this.prisma.websiteFormSubmission.deleteMany({ where: { id: { in: deletable } } });
          deleted += deletable.length;
        }
        // Every row in this batch was kept: the next read returns the same rows.
        if (deletable.length === 0 || rows.length < BATCH_SIZE) break;
      }
      if (deleted || kept) {
        this.logger.log(`website purge — deleted ${deleted} submission(s) past purgeAfter, removed ${objects} object(s), kept ${kept} whose object could not be removed`);
      }
    } catch (err) {
      this.logger.error(`website purge failed: ${(err as Error)?.message}`);
    }
  }
}
```

`apps/backend/src/modules/website/website-ping.service.ts` (Task 4 file) — final form:

```ts
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { WebsiteAbuseService } from './website-abuse.service';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { WebsiteBearerClass } from './website.constants';

/**
 * Ruling P11 as amended by RC13 — the WP3a shape. Phase-B facts are present and
 * null so the website's reader never branches on absence.
 */
export interface WebsitePingResult {
  tokenClass: WebsiteBearerClass;
  moduleEnabled: true;
  captcha: 'configured' | 'missing';
  /** Whether a second-human fallback recipient is stored (D25); the WP3a gate reads this before the flip. */
  secondHumanConfigured: boolean;
  trippedForms: string[];
  lastSubmissionAt: string | null;
  bucketPolicy: null;
  lastCrmFeedAt: null;
}

/**
 * Readiness facts for `GET /website/v1/ping` (D25: the website's /api/site-health
 * and the synthetic-lead heartbeat both read this). It answers only behind
 * WebsiteModuleEnabledGuard, so `moduleEnabled` is a literal true.
 *
 * `trippedForms` comes from `WebsiteAbuseService` (RC6: the one trip writer),
 * which fails open — a Redis outage reads as "nothing tripped", never as a
 * failed ping.
 */
@Injectable()
export class WebsitePingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: WebsiteIntegrationConfigService,
    private readonly abuse: WebsiteAbuseService,
  ) {}

  async ping(tokenClass: WebsiteBearerClass): Promise<WebsitePingResult> {
    const [secrets, shape, last, trippedForms] = await Promise.all([
      // Readiness = the secret DECRYPTS, not merely that a ciphertext is stored.
      this.config.resolveSecrets(),
      this.config.publicShape(),
      // Real leads only — the heartbeat's isTest rows must not mask a drought.
      this.prisma.websiteFormSubmission.findFirst({
        where: { isTest: false },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.abuse.trippedForms(),
    ]);
    return {
      tokenClass,
      moduleEnabled: true,
      captcha: secrets.turnstileSecret ? 'configured' : 'missing',
      secondHumanConfigured: Boolean(shape.secondHumanEmail),
      trippedForms,
      lastSubmissionAt: last ? last.createdAt.toISOString() : null,
      bucketPolicy: null,
      lastCrmFeedAt: null,
    };
  }
}
```

`apps/backend/src/modules/website/website.module.ts` — final form (RC15). It is the file as Task 9 left it plus exactly two import lines (`WebsiteAlarmsCron`, `WebsitePurgeCron`) and the two cron providers appended at the end of `providers`; `WebsiteNotifyService`, `WebsiteAbuseService` and `WebsiteAutoresponderService` are ALREADY providers (Task 6's shells, RC20) — nothing is added for them and nothing is reordered. Before writing it, `cat` the file as Task 9 left it and confirm every other import path and class name below already appears there — Tasks 1–9 print the whole decorator they leave behind, so a name that differs is a reconciliation defect in that task's text to report, not something to paper over here. The doc comment and the constructor's `registry.register({...})` literal are Task 1/2's verbatim and are never edited (P1; `registry-from-source.ts` regex-reads the literal — no constants, no spreads, no `]` inside a comment within an array):

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PermissionAction, PermissionScope } from '@prisma/client';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionRegistry } from '../permissions/registry/permission-registry';
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
import { SalesModule } from '../sales/sales.module';
import { WebsiteInquiryHandler } from './handlers/website-inquiry.handler';
import { WebsiteFormsInboxService } from './website-forms-inbox.service';
import { WebsiteFormsInboxController } from './website-forms-inbox.controller';
import { CareersPublicModule } from '../careers-public/careers-public.module';
import { UploadModule } from '../upload/upload.module';
import { CareersApplyHandler } from './handlers/careers-apply.handler';
import { FraudReportHandler } from './handlers/fraud-report.handler';
import { WebsiteFraudEvidenceService } from './website-fraud-evidence.service';
import { WebsitePublicUploadsController } from './website-public-uploads.controller';
import { WebsiteFormsEvidenceController } from './website-forms-evidence.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { NewsletterHandler } from './handlers/newsletter.handler';
import { WebsiteNewsletterService } from './newsletter/website-newsletter.service';
import { WebsitePublicNewsletterController } from './newsletter/website-public-newsletter.controller';
import { WebsiteAlarmsCron } from './website-alarms.cron';
import { WebsitePurgeCron } from './website-purge.cron';

/**
 * The Website module (WP3a, 2026-09-19 — PRD §5.12, §7.10).
 *
 * Serves jobsadmire.com: in WP3a the public INTAKE door (`/website/v1/*`, a
 * Bearer-token machine surface the website calls server-side), the forms
 * inbox and the integrations/token settings; in Phase B the CMS the site reads
 * its content from (pages, strings, collections, blog, media, navigation).
 *
 * ALWAYS IMPORTED, WHATEVER `WEBSITE_MODULE_ENABLED` SAYS (ruling P1). The
 * descriptor below has to register on every boot: `PermissionConformanceService`
 * diffs `registry.keys()` against `PERMISSION_KEYS` in BOTH directions and
 * fails the container on a catalog key no module registers — so gating this
 * module's import behind the flag would take production down in the OFF
 * state, and dropping the keys from the catalog would take it down in the ON
 * state. The flag is read at REQUEST time instead: `WebsiteModuleEnabledGuard`
 * (Task 2) 404s every `website/v1` route while it is off, every website cron
 * checks it per tick, and `GET /website/status` reports it. Nothing about the
 * module's SHAPE depends on the environment.
 *
 * `ConfigModule` (global via `forRoot({ isGlobal: true })`), `PrismaModule`
 * and `PermissionsModule` (both `@Global()`) are listed anyway — the way
 * `market-research.module.ts` lists the latter two and
 * `recruitment-platforms.module.ts` lists `ConfigModule` — so the
 * dependency reads on the page: the status probe, the flag guard (Task 2),
 * the token guard and the crons all read `ConfigService`. Later WP3a tasks add
 * controllers and providers to the arrays below; the `registry.register`
 * literal is never edited after this commit.
 */
@Module({
  // SalesModule exports InquiryService (sales.module.ts:54) — the ONE-WAY edge the
  // website → Sales handler needs; Sales never imports website (the
  // call-center.module.ts precedent). RedisModule, ConfigModule and
  // ActivitiesModule are @Global().
  // WP3a Task 8: one-way edges. CareersPublicModule now exports
  // CareersPublicService; its controllers are already registered by
  // AppModule, so importing it here duplicates no route. UploadModule
  // exports UploadService (fraud evidence, CV URL rebuild).
  // WP3a Task 9: NotificationsModule (not global) exports NotificationsService,
  // which the newsletter service queues its confirm/welcome mails through;
  // Task 10's notify/autoresponder services inject from the same import.
  imports: [ConfigModule, PrismaModule, PermissionsModule, SalesModule, CareersPublicModule, UploadModule, NotificationsModule],
  controllers: [
    WebsiteStatusController,
    WebsiteIntegrationsController,
    WebsitePublicController,
    WebsiteFormsInboxController,
    WebsitePublicUploadsController,
    WebsiteFormsEvidenceController,
    // Task 9: the third public controller (RC3) — @Public() + [flag, token] guards at class level.
    WebsitePublicNewsletterController,
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
    CareersApplyHandler,
    FraudReportHandler,
    WebsiteFraudEvidenceService,
    // Task 9
    WebsiteNewsletterService,
    NewsletterHandler,
    // Task 10: the two flag-gated crons (P1/P10). The notify / abuse /
    // autoresponder providers above are Task 6's names with this task's bodies.
    WebsiteAlarmsCron,
    WebsitePurgeCron,
  ],
  exports: [WebsiteIntegrationConfigService],
})
export class WebsiteModule {
  constructor(registry: PermissionRegistry) {
    registry.register({
      name: 'website',
      label: 'Website',
      description:
        'The public website (jobsadmire.com): the forms it submits into Operations, the tokens and ' +
        'captcha it authenticates with, and — from Phase B — the pages, strings, collections, blog, ' +
        'media and navigation it renders from.',
      category: 'OPERATIONS',
      caslSubject: 'Website',
      supportedActions: [
        PermissionAction.VIEW,
        PermissionAction.CREATE,
        PermissionAction.EDIT,
        PermissionAction.DELETE,
        PermissionAction.EXPORT,
        PermissionAction.APPROVE,
        PermissionAction.MANAGE_KEYS,
      ],
      // One website, one inbox: there is no per-person slice of it (ALL only).
      supportedScopes: [PermissionScope.ALL],
      scopeBindings: {},

      /**
       * ALL TEN KEYS FROM DAY ONE (ruling P3). WP3a builds two of these screens
       * (Forms inbox, Integrations); Phase B builds the other seven. They are
       * registered now so the Roles matrix never grows a column mid-programme
       * and a role prepared today keeps meaning the same thing in Phase B.
       *
       * MANAGE_KEYS IS NOT A RESOURCE ACTION. Every secret door — write/test
       * token rotate, Turnstile secret, revalidate secret, "test connection" —
       * is gated on the MODULE key at MANAGE_KEYS (seeded to NO role, so
       * super-admin only via the CASL bypass — the marketing/whatsapp
       * precedent). `website.integrations` VIEW/EDIT covers the page and its
       * NON-secret fields (second-human recipient, has-chips).
       */
      resources: [
        {
          key: 'website.pages',
          label: 'Pages',
          description: 'Page-level content and SEO for each designed page (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.strings',
          label: 'Strings',
          description: 'The TR/EN UI strings the site renders (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.collections',
          label: 'Collections',
          description: 'Structured lists the site draws on — sectors, countries, FAQs, testimonials (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.blog',
          label: 'Blog',
          description: 'Blog posts and their translations (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.media',
          label: 'Media',
          description: 'Images and documents the site references (Phase B). APPROVE makes an asset publicly readable.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.navigation',
          label: 'Navigation',
          description: 'Header, footer and in-page navigation trees (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.forms',
          label: 'Forms inbox',
          description:
            'Every submission the website delivered: payload, handler result, needs-attention filter. EDIT is the re-run of a FAILED submission; EXPORT is the CSV that leaves the building (audited, its own route).',
          kind: 'screen',
          supportedActions: [PermissionAction.VIEW, PermissionAction.EDIT, PermissionAction.EXPORT],
        },
        {
          key: 'website.settings',
          label: 'Settings',
          description: 'Per-form switches (active, autoresponder) and the module notification toggles. No routes in WP3a — the newsletter form is flipped by SQL until the screen lands.',
          kind: 'screen',
          supportedActions: [PermissionAction.VIEW, PermissionAction.EDIT],
        },
        {
          key: 'website.integrations',
          label: 'Integrations',
          description:
            'The page and its NON-secret fields: which secrets are set (has-chips), the second-human recipient, last test results. Writing, rotating or testing a secret is `website` MANAGE_KEYS, never this resource.',
          kind: 'screen',
          supportedActions: [PermissionAction.VIEW, PermissionAction.EDIT],
        },
      ],

      policies: [
        {
          key: 'website.secrets-are-manage-keys',
          label: 'Every secret write, rotate or test is MANAGE_KEYS on the module key',
          description:
            'Write token, test token, Turnstile secret and revalidate secret are written, rotated and tested only through routes gated on `website:MANAGE_KEYS`, which is seeded to no role. `website.integrations` EDIT reaches the non-secret fields of the same page and nothing else (ruling P3).',
        },
        {
          key: 'website.public-door-is-flag-gated',
          label: 'The public intake door answers 404 while WEBSITE_MODULE_ENABLED is off',
          description:
            'Every `website/v1` route sits behind `WebsiteModuleEnabledGuard`, which reads the flag from the environment on each request; the admin screens stay reachable so tokens can be provisioned before the flip (ruling P1).',
        },
      ],

      // The decorator on the controller is the authority; this list is what the
      // Roles screen shows so "why can everyone reach that?" has an answer.
      selfServiceRoutes: ['GET /website/status'],

      // Every route that exists carries its key from this commit on (P3), so
      // the flag is honest from day one — there is no un-keyed website route to
      // let an operator untick a resource and see nothing happen.
      resourcesEnforced: true,
    });
  }
}
```

- [ ] **Step 18: Run tests**

```
cd apps/backend && npx jest src/modules/website src/modules/notifications --maxWorkers=2
cd apps/backend && npx jest test/permissions --maxWorkers=2
cd apps/backend && npx tsc --noEmit -p tsconfig.json
```
Expected: all green; `repo-invariants.spec.ts` route census unchanged (no new controllers, no new routes); Task 1's `website-conformance.spec.ts` and Task 4's `website-door-conformance.spec.ts` unchanged; Task 2's `website-env.spec.ts` still reports `['modules/website/website-module-flag.ts']` as the one reader (both crons import the helper); Task 6's `website-forms.service.spec.ts` and Task 7's `website-forms.rerun.spec.ts` untouched and green; typecheck clean (the three replaced services keep every name Task 6's core imports).

- [ ] **Step 19: Commit**

```
git add apps/backend/src/modules/website/website-abuse.service.ts apps/backend/src/modules/website/website-abuse.service.spec.ts apps/backend/src/modules/website/website-alarms.cron.ts apps/backend/src/modules/website/website-alarms.cron.spec.ts apps/backend/src/modules/website/website-purge.cron.ts apps/backend/src/modules/website/website-purge.cron.spec.ts apps/backend/src/modules/website/website-ping.service.ts apps/backend/src/modules/website/website-ping.service.spec.ts apps/backend/src/modules/website/website.module.ts
git commit -m "feat(website): abuse auto-trip, lead-drought and 04:30 purge crons, ping reads the trip keys

Captcha-verified counts per form in Redis with a 60-minute window; the
tripping SETNX is both the 429 switch and the once-per-window trip notice,
and the five-minute cron announces the untrip. Drought fires once per
company day during Istanbul business hours after 48 h without a real lead.
The purge deletes submissions past purgeAfter in batches, removing a fraud
report's private objects first and keeping any row whose object survived.
WebsitePingService now lists tripped forms through WebsiteAbuseService (RC6).
All three crons read WEBSITE_MODULE_ENABLED per tick through
websiteModuleEnabled() and never throw (P1, P10).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Docs for this task are Task 12's (RC1/RC10/P13), in the same change set: PRD §5.12 notification/alarm/purge paragraphs; §6.2 catalogue sentence "Today only `marketing` declares…" → "marketing and website"; §6.7 the `website-*` template family and the second-human direct send; DEPLOYMENT.md cron inventory — `website-alarms` every 5 min, `website-purge` 04:30 UTC, both gated on `WEBSITE_MODULE_ENABLED` per tick — naming `modules/website/website-alarms.logic.ts` as where the alarm numbers live (not `website.constants.ts`).

---

---

