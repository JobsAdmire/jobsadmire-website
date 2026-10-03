### Task 12: Docs in the same change set — PRD §5.12 + §7.10 (+ §4.8, §5.1, §5.4.3, §6.2, §6.5, §10, §12.2 prose), CLAUDE.md public-surface amendment + careers-public export edge + the RC16 sentence, DEPLOYMENT.md crons / runbook row / local production-compose boot recipe, `.gitignore`, the docs guard spec, memory line — P13

Repo: the WP3a worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (branch `website/wp3a-intake`, the same checkout Task 13 pushes from; never the shared `main` checkout). Every path below is relative to it except the memory file. This task runs after Tasks 1–11 have committed on the branch: it consumes their exact strings and adds prose only.

Rulings applied: P13 (PRD §5.12 initial + §7.10 argument, CLAUDE.md public-surface amendment + the careers-public export edge, DEPLOYMENT.md recipes, in the same change set; the workspace-root `CLAUDE.md` is untouched — it already carries the website row), RC1 (Task 3 owns `packages/constants/src/enums/website.enums.ts` with all four enums AND the form-key constants — this task creates NO constants file and adds NO `index.ts` line; it only diffs the mirror against the schema), RC2 (three bearer classes `'write' | 'test' | 'previous-write'`, `WebsiteTokenClass` is the Prisma enum), RC3 (six public routes on three controllers; the fraud-evidence upload route is the ONE upload route; CV still via `POST /api/careers/upload-cv`), RC4 (Task 6's handler contract, `dryRun`, detail flags), RC5 (fraud/careers catalog fields), RC6 (one alarm pair — `WebsiteNotifyService` + `WebsiteAbuseService`, keys `website:abuse:*`, no `WebsiteAlertsService`), RC7 (captcha verdict `{ outcome }`), RC8 (`website.forms` = VIEW/EDIT/EXPORT, `website.media` = V/C/E/D/APPROVE, `website.forms VIEW` to `sales-manager` + `sales-executive` + `sales-agent`), RC9 (integrations API shapes), RC10 (migration `20260925120000_website_intake_door`; PRD §8 = 193 models / 168 enums and is Task 3's; every count line in CLAUDE.md/PRD is Task 1's — this task pins those strings and never rewrites them; the DEPLOYMENT `| Flags |` row and `### Flipping …` section are Task 2's — this task pins them and adds only the local production-compose boot section; alarm thresholds live in `website-alarms.logic.ts`), RC11/RC18 (`WEBSITE_SITE_URL` is a WP3a variable — Task 9 owns it end to end incl. the DEPLOYMENT.md `| Website | \`WEBSITE_SITE_URL\` |` env row; this task adds PRD §5.12 prose only and pins Task 9's row), RC16 (one CLAUDE.md sentence: a module whose routes are keyed from birth registers `resourcesEnforced: true` immediately), RC23 (evidence read-back lives under `GET /api/website/forms/submissions/:id/evidence/:index/view|link`), RC24 (inbox search is case-insensitive for e-mail only — documented, ILIKE follow-up), RC25 (careers submissions set `skipNotification: true`; the second-human fan-out covers every OTHER website event), RC26 (the door response carries `error: string | null` — the visitor-safe message for a handler-reported visitor error), RC28 (`WEBSITE_SITE_URL` is read by the autoresponder and newsletter services; the notify service links through `APP_URL`), RC12 (no autoresponder columns on `WebsiteForm`, no `unsubscribeTokenHash`; `WebsiteForm.isActive` is flipped by SQL only in WP3a — documented with the statement), RC13 (ping carries `secondHumanConfigured`), RC14 as amended by RC26 (wire contract = Task 6's: `WebsiteFormSubmitDto`, `X-Website-Visitor-Ip`, HTTP 200 `{ data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }`), RC15 (the spec is printed once, in final form; every anchor is quoted by its exact line text).

**Files:**
- Create: `apps/backend/src/modules/website/website-docs-guard.spec.ts`
- Modify: `.gitignore` — append three lines directly after the line `apps/backend/.env`
- Modify: `CLAUDE.md` (Operations repo root) — six anchors, each quoted in Step 3c (the sixth, RC16, appends one sentence to the `- **A permission KEY is …**` bullet AFTER Task 1's count edit on that line; the count text itself is not touched): the `Modules:` sentence (`, Call Center; supporting infrastructure`), the doc-map row beginning `| Public website (jobsadmire.com) + the future \`website\` CMS module`, the sentence `the only public surface is \`/careers/*\` + auth.`, the numbered rule ending `\`ProjectsModule\` imports \`SalesModule\`, never the reverse). Don't create cycles.`, and the bullet `- **No public endpoints outside \`careers-public\`** (auth is the one other sanctioned public surface). Don't sprinkle \`@Public()\` on feature modules.`. NOT the two count lines (`**85 grantable keys**…`, `All 23 modules declare resources…`) — Task 1 wrote them (RC10).
- Modify: `docs/PRD.md` — anchors quoted in Step 3d: TOC lines `  - 5.11 WhatsApp (native Meta Cloud API module)` and `  - 7.9 Meta WhatsApp Cloud API (native module)`; §3 bullet beginning `- **Don't add public unauthenticated endpoints outside \`careers-public\`**`; §4.8 paragraph beginning `**Boot-time conformance.**`; §5.1 sentence beginning `There is **no public ingestion endpoint**`, the conversion sentence containing `copies **only \`companyName\` ('Unknown' fallback), \`country\`, and \`classification\`** onto the new \`Lead\``, and the last Sales gotcha `- Contact/discussion history reuses the shared \`CommunicationsLog\` timeline`; §5.4.3 sentence `**Don't add public unauthenticated endpoints outside this module** (auth's password-reset routes are the only other sanctioned public surface).` (the tail of the one-line paragraph beginning `The only **unauthenticated** module in the platform:` under `##### The public careers site (\`careers-public\`)`, PRD :1341 — NOT the `- **Don't add public endpoints outside \`careers-public\`**` gotcha bullet at :1392, which stays); the `---` + `## 6. Supporting Infrastructure` boundary (insert §5.12); §6.2 sentence beginning `Every EMAIL-channel dispatcher event currently sends`, the sentence `Re-derive the authoritative list from \`event-registry.ts\`, not from this paragraph.`, the phrase `Today only \`marketing\` declares them (14 events); adding a module means`, and the gotcha `- The dispatcher's EMAIL channel sends everything \`mailbox: 'careers'\` today;`; §6.5 parenthetical `(the sanctioned exceptions outside it are the İŞKUR agent routes — \`@Public()\` + \`IskurAgentGuard\` constant-time token check — and the auth module's login/refresh/password-reset routes)` and the gotcha `- **Don't add public unauthenticated endpoints outside this module** (auth's login/refresh/password-reset routes are the other sanctioned public surface`; the `---` + `## 8. Data Model Overview` boundary (insert §7.10); §10 bullet beginning `- All public unauthenticated traffic is concentrated in \`careers-public\``; §12.2 bullet `  - HRM module root now renders the HRM dashboard (2026-09-15), same pattern as Sales.`. NOT §4.1/§4.2/§4.4/§12.3 count lines and role rows (Task 1) and NOT §8 (Task 3).
- Modify: `docs/DEPLOYMENT.md` — three anchors quoted in Step 3e: the bullet beginning `- **\`careers-retention\`** (daily 03:00 UTC)`; the heading `### Verifying a deploy landed` (the new section goes directly before it, i.e. after Task 2's `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` section); the runbook row beginning `| **Cloudflare Turnstile** |`. NOT the env table: Task 2's `| Flags | \`WEBSITE_MODULE_ENABLED\`` row and Task 9's `| Website | \`WEBSITE_SITE_URL\`` row (RC18) are pinned by the guard, never rewritten.
- Modify (append one line): `/Users/agentfaraz/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md`
- Test: `apps/backend/src/modules/website/website-docs-guard.spec.ts`; Task 2's `apps/backend/src/modules/website/website-env.spec.ts` and Task 3's `apps/backend/src/modules/website/website-schema.spec.ts` must stay green (this task touches nothing they read except `docs/DEPLOYMENT.md`, where it only adds).

**Interfaces:**
- Consumes (Task 1 — RC10, exact strings this task pins and never rewrites): CLAUDE.md `**85 grantable keys** (23 modules + 62 screen-level resources, all enforced)` and `All 23 modules declare resources and all are`; PRD `**23 permission modules + 62 screen-level resources = 85 grantable keys**`, `Marketing 9, Website 9, Projects 8,`, `**OPERATIONS (18):**`, `All 85 current keys have en + tr`, and the §4.4 rows `| \`admin\` |`, `| \`sales-manager\` |`, `| \`marketing-manager\` |`, `| \`sales-agent\` |`, `| \`sales-executive\` |` each already carrying their `website` / `website.forms` VIEW / six-CMS-keys text (RC8). Descriptor facts copied into §5.12: module actions `VIEW, CREATE, EDIT, DELETE, EXPORT, APPROVE, MANAGE_KEYS`, scope ALL; `website.pages/.strings/.collections/.blog/.media/.navigation` = `VIEW, CREATE, EDIT, DELETE, APPROVE`; `website.forms` = `VIEW, EDIT, EXPORT`; `website.settings` = `VIEW, EDIT`; `website.integrations` = `VIEW, EDIT`; `selfServiceRoutes: ['GET /website/status']`; `PERMISSION_KEYS_HASH = 'ba5427d7b0688c2b783cd58f3a21d384878363a4'`; `ROLE_DEFAULTS_VERSION = 3`.
- Consumes (Task 2 — RC10): the DEPLOYMENT.md strings `| Flags | \`WEBSITE_MODULE_ENABLED\``, `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` and `docker compose -f docker-compose.vps.yml up -d backend`; compose defaults `${WEBSITE_MODULE_ENABLED:-true}` (dev) / `${WEBSITE_MODULE_ENABLED:-false}` (VPS); `websiteModuleEnabled(config)` in `src/modules/website/website-module-flag.ts` (the one production reader); `WebsiteModuleEnabledGuard` at `src/modules/website/guards/website-module-enabled.guard.ts`.
- Consumes (Task 3 — RC1/RC10/RC12): Prisma enums `WebsiteFormKind { INQUIRY CAREERS_APPLY NEWSLETTER FRAUD_REPORT CALLBACK VISIT CALCULATOR_QUOTE }`, `WebsiteSubmissionStatus { RECEIVED HANDLED FAILED SPAM }`, `WebsiteSubscriberStatus { PENDING CONFIRMED UNSUBSCRIBED }`, `WebsiteTokenClass { WRITE TEST PREVIOUS_WRITE }` (with `@default(WRITE)` on `WebsiteFormSubmission.tokenClass`); models `WebsiteIntegrationConfig`, `WebsiteForm` (no autoresponder columns), `WebsiteFormSubmission` (`@@unique([formKey, requestHash, hourBucket])`, `@@index([purgeAfter])`), `WebsiteSubscriber` (no `unsubscribeTokenHash`); `Inquiry.contactName String?`; `NotificationType.WEBSITE_FORM_RECEIVED | WEBSITE_FORMS_UNAVAILABLE`; `ActivityType.WEBSITE_SUBMISSION_RECEIVED | _HANDLED | _FAILED`; migration folder `apps/backend/prisma/migrations/20260925120000_website_intake_door/`; from `@jobsadmire/constants`: `WebsiteFormKind`, `WebsiteSubmissionStatus`, `WebsiteSubscriberStatus`, `WebsiteTokenClass`, `WEBSITE_FORM_KEYS` (readonly tuple of the ten keys `hire, contact, partner, workers, callback, visit, calculator, careers, fraud, newsletter`), `WebsiteFormKey`, `WEBSITE_FORM_KIND_BY_KEY: Record<WebsiteFormKey, WebsiteFormKind>`, `isWebsiteFormKey(v: string | undefined): v is WebsiteFormKey`; PRD §8 already carries `Latest as of this revision: \`20260925120000_website_intake_door\``, the bullet beginning `- **Website — public intake door** (4, §5.12/§7.10`, and the 193 / 168 counts.
- Consumes (Task 4 — RC2/RC9/RC13): `WebsitePublicController` (`@Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard) @Controller('website/v1')`), `WebsiteApiGuard` (order write → test → previous-write, `timingSafeEqual`, fail-closed 401 while unconfigured, stamps `req.websiteTokenClass: WebsiteBearerClass`), `PRISMA_TOKEN_CLASS_BY_BEARER`, `PREVIOUS_WRITE_TOKEN_WINDOW_MS = 86_400_000`; `GET /api/website/v1/ping` → `{ data: { tokenClass, moduleEnabled: true, captcha: 'configured' | 'missing', secondHumanConfigured: boolean, trippedForms: string[], lastSubmissionAt: string | null, bucketPolicy: null, lastCrmFeedAt: null } }`; `GET /api/website/integrations` (`website.integrations` VIEW), `PATCH /api/website/integrations` (`website.integrations` EDIT; body `{ secondHumanEmail?: string | null; secondHumanName?: string | null }`), `PATCH /api/website/integrations/keys` (`website` MANAGE_KEYS; `{ turnstileSecret?: string; revalidateSecret?: string }`), `POST /api/website/integrations/rotate/:name` (`website` MANAGE_KEYS; `:name ∈ writeToken | testToken` → `{ data: { name, secret, previousExpiresAt } }`), `POST /api/website/integrations/test` (`website` MANAGE_KEYS → `{ data: { ok: boolean; error: string | null } }`); `WebsiteIntegrationConfigService.resolveSecrets()` (60 s cache, per-secret try/catch decrypt); tokens `wsw_` / `wst_` + 48 hex.
- Consumes (Task 5): `CreateInquiryDto.contactName?: string`, `InquiryService.findAll` searching `contactName` in `where.OR`, `convertToLeadInternal` writing `Lead.contactPerson = inquiry.contactName ?? null`.
- Consumes (Task 6 — RC4/RC5/RC7/RC14/RC26): `POST /api/website/v1/forms/:formKey` (`@HttpCode(200)`), DTO `WebsiteFormSubmitDto` at `dto/website-form-submit.dto.ts` (`{ locale: 'tr' | 'en', consentVersion, captchaToken?, honeypot?, sourcePath?, fields }`), headers `X-Website-Visitor-Ip` / `X-Website-Visitor-Ua`, response `{ data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }` (`error` = the visitor-safe message when the handler reported `detail.visitorError`, else `null`), 400 / 403 / 404 / 429 (`{ message, fallback: 'whatsapp' }`); `website-form-catalog.ts` (per-form whitelist BEFORE the row; fraud = `reporterName, reporterEmail, reporterPhone, description, suspectName, suspectContact, evidenceKeys` (array-of-key ≤ 3, `^website-fraud/[A-Za-z0-9._-]+$`); careers = `cvKey` (`^careers-cv/[A-Za-z0-9._-]+\.pdf$`, required), `expectedSalaryCurrency`, `currentSalary`, `currentSalaryCurrency` + the applicant fields); `WebsiteCaptchaService.verify()` → `{ outcome: 'passed' | 'failed' | 'degraded', reason?, codes? }`; `WebsiteFormHandler { kinds; handle(input) }` with input `{ submissionId, formKey, kind, locale, dryRun, fields, consentVersion, captchaDegraded, visitorIp, userAgent }` and result `{ ok: true; createdEntityType?; createdEntityId?; detail? } | { ok: false; error; detail? }`, `detail` flags `alreadyReceived`, `skipNotification`, `skipAutoresponder`, `inquiryNumber`, `assignedAgentId`, `contactName`, `email`, `visitorError` (RC26 — FAILED row, `handlerResultJson.visitorError = true`, no `handlerFailed` alarm); `WebsiteFormHandlerRegistry.register(this)`; `WebsiteFormsService` constructor `(prisma, config, captcha, registry, activity, notify, abuse, autoresponder)`; `ensureFormRow` (lazy create from the catalog) AND the seed file `apps/backend/prisma/website-form-seed.ts` (`WEBSITE_FORM_SEED`, ten rows, `newsletter.isActive = false`, called from `seed.ts`); `hashIp(ip, salt)` in `common/utils/ip-hash.util.ts`; `handlerResultJson = { attempts: AttemptRecord[]; visitorError?: true }`.
- Consumes (Task 7 — RC1): `WebsiteInquiryHandler` (kinds INQUIRY, CALLBACK, VISIT, CALCULATOR_QUOTE); the inbox controller routes `GET /api/website/forms/submissions` (`website.forms` VIEW; query `page, limit, search, formKey, status, needsAttention, isTest, from, to`; `{ data, meta }`, rows carry `formKind`), `GET /api/website/forms/submissions/:id` (VIEW; incl. `handlerResultJson`, `userAgent`), `POST /api/website/forms/submissions/:id/rerun` (`website.forms` EDIT, `@AuditEntity('WebsiteFormSubmission')`, 409 unless `status = FAILED && createdEntityId IS NULL`), `GET /api/website/forms/submissions/export` (`website.forms` EXPORT, `@AuditEntity('WebsiteFormSubmission')`).
- Consumes (Task 8 — RC3/RC5): `CareersPublicModule` `exports: [CareersPublicService]` (one-way edge); `CareersApplyHandler`, `FraudReportHandler`; `POST /api/website/v1/uploads/fraud-evidence` (`WebsitePublicUploadsController`, multipart, magic-byte sniff JPEG/PNG/WEBP/PDF, ≤ 3 files, keys `website-fraud/<uuid>.<ext>`, dry-run under the test class); `GET /api/website/forms/submissions/:id/evidence/:index/view` (streams, `nosniff`) and `GET /api/website/forms/submissions/:id/evidence/:index/link` (15-min presign) on `WebsiteFormsEvidenceController`, both `website.forms` VIEW (RC23); `WebsiteFraudEvidenceService.evidenceKeysOf(payloadJson)`; `CareersApplyHandler` sets `skipNotification: true` + `skipAutoresponder: true` (RC25 — careers-public already fires `APPLICANT_RECEIVED` and its own confirmation) and reports `apply()`'s 4xx as `{ ok: false, detail: { visitorError: true } }` (RC26).
- Consumes (Task 9 — RC3/RC11): `WebsitePublicNewsletterController` (`website/v1/newsletter`): `GET /api/website/v1/newsletter/confirm`, `GET /api/website/v1/newsletter/unsubscribe`, `POST /api/website/v1/newsletter/unsubscribe` (RFC 8058 one-click), stateless HMAC tokens; `queueEmail({ headers? })` reaching both transports; `WEBSITE_SITE_URL` (RC18 — Task 9 owns it end to end: both compose files, `.env.example`, `.env.production.example` = `https://www.jobsadmire.com`, the DEPLOYMENT.md `| Website | \`WEBSITE_SITE_URL\`` env row), read through `websiteSiteUrl(config)` (`website-site-url.ts`, fallback `https://www.jobsadmire.com`) by the newsletter service and Task 10's `WebsiteAutoresponderService` (RC28); VPS `.env` value `https://www.jobsadmire.com`; VPS compose default the same.
- Consumes (Task 10 — RC6/RC11): registry keys `WEBSITE_FORM_RECEIVED` / `WEBSITE_FORMS_UNAVAILABLE` (`module: 'website'`, `mailbox: 'default'`, `relatedEntityType: 'website-submission'`, `emailLinkPath` → `/admin/website/inbox?row=<submissionId>`); `WebsiteNotifyService.formReceived()` / `formsUnavailable(reason, …)` (once per window via `SETNX`, second-human fan-out on every event the core raises — careers never raises `formReceived`, RC25; links through `absoluteLink`/`APP_URL`, RC28); `WebsiteAbuseService` (`recordVerified`, `isTripped`, `trippedForms`; keys `website:abuse:count|tripped|announced:<form>`); `WebsiteAutoresponderService` (`.hbs` + `.tr.hbs` per form, careers + newsletter excluded); `website-alarms.logic.ts` constants `WEBSITE_ABUSE_TRIP_THRESHOLD = 25`, `WEBSITE_ABUSE_WINDOW_SEC = 3600`, `WEBSITE_DROUGHT_HOURS = 48`, `WEBSITE_BUSINESS_HOURS` (Europe/Istanbul, Mon–Fri 09:00–18:00); crons `website-alarms` (`0 */5 * * * *`: untrip announce + lead drought) and `website-purge` (`0 30 4 * * *`); both begin with `if (!websiteModuleEnabled(this.config)) return;`.
- Consumes (Task 11): pages `/admin/website/inbox` (`website.forms`) and `/admin/website/integrations` (`website.integrations`), module root redirecting to the inbox, the `?row=<id>` deep link, the fraud row's evidence **View** / **Copy link** in the detail panel (RC27), the flag-off banner from `GET /api/website/status`.
- Produces:
  - `docs/PRD.md` §5.12 and §7.10 — the sanction a reviewer reads before accepting `@Public()` in `modules/website/` (CLAUDE.md now points at §7.10 by name).
  - `docs/DEPLOYMENT.md` section `### Booting the production compose file locally (plan D24 — before every website-programme push)` — Task 13 §B runs it verbatim, pasting its artifacts; the `- **Website crons**` bullet; the runbook row `| **Website intake door (jobsadmire.com forms)** |` (the `| Website | \`WEBSITE_SITE_URL\`` env row is Task 9's, RC18 — pinned here).
  - `.gitignore` entries `docker-volumes/` and `.env.local-prod` (the local boot's throwaway files; Task 13 §B5 asserts `git status --short` is clean afterwards).
  - `apps/backend/src/modules/website/website-docs-guard.spec.ts` — fails when any of the sentences above is "cleaned up", when the RC16 sentence or the RC23 evidence routes vanish from the docs, when the constants mirror drifts from the schema, or when PRD §8 stops naming the newest migration folder.
  - One memory line in `website-programme-2026-09.md`.

- [ ] **Step 1: Write the failing test**

`apps/backend/src/modules/website/website-docs-guard.spec.ts` (house pattern: `notifications/push/push-guards.spec.ts` and Task 2's `website-env.spec.ts` — a source-reading guard; `repoRoot` is five levels up from `src/modules/website/`; `@jobsadmire/constants` resolves to `packages/constants/src` through `jest.config.js` `moduleNameMapper`, so no package build is needed):

```ts
// apps/backend/src/modules/website/website-docs-guard.spec.ts
/**
 * Source-reading guard for the website module's DOCS and the shared-constants
 * mirror (WP3a, planning ruling P13: docs land in the same change set).
 *
 * What this pins, and why a test rather than a checklist:
 *   1. `@Public()` outside careers-public is forbidden by CLAUDE.md, PRD §3, §6.5
 *      and §10 — the website door is legal ONLY because PRD §7.10 argues it and
 *      CLAUDE.md names it. If either sentence is ever "cleaned up", the next
 *      reviewer reads modules/website/ as a violation.
 *   2. PRD §5.1 used to say "There is no public ingestion endpoint". It is now false.
 *   3. DEPLOYMENT.md must carry the WEBSITE_MODULE_ENABLED env row + flip recipe
 *      (Task 2's strings, RC10), the WEBSITE_SITE_URL row (Task 9's, RC18), the
 *      website crons, the runbook row and the local production-compose boot
 *      recipe (plan D24) — the compose mappings themselves are pinned by
 *      website-env.spec.ts / website-site-url.spec.ts, not here.
 *   4. packages/constants mirrors the four Website enums (schema.prisma:12 rule:
 *      "mirrored in packages/constants when the frontend imports them") — the
 *      schema is the source of truth, so the mirror is DIFFED against it; and
 *      the ten form keys are the website repo's FORM_KEYS (src/analytics/forms.ts
 *      there — the repos share no package, so a copy is pinned here).
 *   5. PRD §8 names the newest migration folder — read from the directory, never
 *      a hard-coded name (RC10).
 *   6. .gitignore covers the two files the local production boot creates.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import {
  WEBSITE_FORM_KEYS,
  WEBSITE_FORM_KIND_BY_KEY,
  WebsiteFormKind,
  WebsiteSubmissionStatus,
  WebsiteSubscriberStatus,
  WebsiteTokenClass,
} from '@jobsadmire/constants';

const here = __dirname;
const repoRoot = join(here, '../../../../..');
const readRoot = (p: string) => readFileSync(join(repoRoot, p), 'utf8');

/** Members of `enum <name> { … }` in schema.prisma, comments stripped. */
function prismaEnumMembers(schema: string, name: string): string[] {
  const start = schema.indexOf(`enum ${name} {`);
  if (start < 0) return [];
  const body = schema.slice(start, schema.indexOf('\n}', start));
  return body
    .split('\n')
    .slice(1)
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .filter(Boolean);
}

/** The website repo's `FORM_KEYS` (jobsadmire-website/src/analytics/forms.ts), copied verbatim. */
const SITE_FORM_KEYS = ['hire', 'contact', 'partner', 'careers', 'newsletter', 'callback', 'visit', 'calculator', 'fraud', 'workers'];

const PUBLIC_ROUTES = [
  'GET /api/website/v1/ping',
  'POST /api/website/v1/forms/:formKey',
  'POST /api/website/v1/uploads/fraud-evidence',
  'GET /api/website/v1/newsletter/confirm',
  'GET /api/website/v1/newsletter/unsubscribe',
  'POST /api/website/v1/newsletter/unsubscribe',
];

const MIRRORS: Array<[name: string, mirror: Record<string, string>]> = [
  ['WebsiteFormKind', WebsiteFormKind],
  ['WebsiteSubmissionStatus', WebsiteSubmissionStatus],
  ['WebsiteSubscriberStatus', WebsiteSubscriberStatus],
  ['WebsiteTokenClass', WebsiteTokenClass],
];

describe('website module — docs and constants guard (P13)', () => {
  const prd = readRoot('docs/PRD.md');
  const prdLines = prd.split('\n');
  const claude = readRoot('CLAUDE.md');
  const claudeLines = claude.split('\n');
  const deployment = readRoot('docs/DEPLOYMENT.md');
  const schema = readRoot('apps/backend/prisma/schema.prisma');

  it('PRD carries §5.12 and §7.10, in the TOC and as headings', () => {
    expect(prd).toContain('  - 5.12 Website (public-site intake door; CMS from Phase B)');
    expect(prd).toContain('  - 7.10 The website intake door — the third sanctioned public surface');
    expect(prd).toContain('### 5.12 Website (public-site intake door; CMS from Phase B)');
    expect(prd).toContain('### 7.10 The website intake door — the third sanctioned public surface');
  });

  it('PRD §5.1 no longer claims there is no public ingestion endpoint — it names the door', () => {
    expect(prd).not.toContain('There is **no public ingestion endpoint**');
    expect(prd).toContain('**Public ingestion arrives through ONE door — the website intake module**');
  });

  it('every "public unauthenticated endpoints outside" sentence names the website door', () => {
    // PRD §3 gotcha (:248), §5.4.3 careers-public paragraph (:1341) and §6.5 gotcha
    // (:4321) — three lines; each used to say careers-public + auth were the ONLY
    // sanctioned surfaces. (§5.4.3's `Don't add public endpoints outside` bullet at
    // :1392 lacks the word "unauthenticated" and is deliberately not counted.)
    const sentences = prdLines.filter((l) => /public unauthenticated endpoints outside/.test(l));
    expect(sentences.length).toBeGreaterThanOrEqual(3);
    for (const s of sentences) expect({ line: s.slice(0, 80), names: s.includes('website/v1') }).toEqual({ line: s.slice(0, 80), names: true });
  });

  it('CLAUDE.md: the public-surface rule names website/v1 + PRD §7.10; the portal line no longer calls careers + auth the only surface; the export edge is named', () => {
    const rule = claudeLines.find((l) => l.startsWith('- **No public endpoints outside'));
    expect(rule).toBeDefined();
    expect(rule).toContain('website/v1');
    expect(rule).toContain('PRD §7.10');
    expect(claude).not.toContain('the only public surface is `/careers/*` + auth');
    expect(claude).toContain('`CareersPublicModule` exports `CareersPublicService` for exactly one consumer, `WebsiteModule`');
  });

  it('CLAUDE.md records that a module keyed from birth registers resourcesEnforced immediately (RC16)', () => {
    const keyRule = claudeLines.find((l) => l.startsWith('- **A permission KEY is')) ?? '';
    expect(keyRule).toContain('registers `resourcesEnforced: true` immediately');
  });

  it('PRD §5.12 names the evidence read-back routes under the inbox family (RC23) and the search case rule (RC24)', () => {
    expect(prd).toContain('GET /api/website/forms/submissions/:id/evidence/:index/view');
    expect(prd).toContain('GET /api/website/forms/submissions/:id/evidence/:index/link');
    expect(prd).toContain('case-insensitive for e-mail only');
  });

  it('the count lines Task 1 wrote still hold in CLAUDE.md and the PRD (RC10)', () => {
    expect(claude).toContain('**85 grantable keys** (23 modules + 62 screen-level resources, all enforced)');
    expect(claude).toContain('All 23 modules declare resources and all are');
    expect(prd).toContain('**23 permission modules + 62 screen-level resources = 85 grantable keys**');
    expect(prd).toContain('All 85 current keys have en + tr');
  });

  it('PRD §4.4: the three sales roles carry website.forms VIEW (RC8)', () => {
    for (const role of ['sales-manager', 'sales-executive', 'sales-agent']) {
      const row = prdLines.find((l) => l.startsWith(`| \`${role}\` |`)) ?? '';
      expect({ role, found: row.length > 0 }).toEqual({ role, found: true });
      expect({ role, mentions: /`website\.forms` VIEW/.test(row) }).toEqual({ role, mentions: true });
    }
  });

  it('PRD §5.12 lists every public route RC3 sanctions and the ping fact RC13 added', () => {
    for (const route of PUBLIC_ROUTES) expect({ route, documented: prd.includes(route) }).toEqual({ route, documented: true });
    expect(prd).toContain('secondHumanConfigured');
  });

  it('PRD §6.2 lists the two website events and §12.2 records WP3a', () => {
    expect(prd).toContain('Website (§5.12, 2026-09-19): `WEBSITE_FORM_RECEIVED`, `WEBSITE_FORMS_UNAVAILABLE`');
    expect(prd).toContain('- **2026-09-19 — Website module, WP3a (intake door).**');
  });

  it('DEPLOYMENT.md: the flag row + flip recipe (Task 2), the WEBSITE_SITE_URL row, the crons, the runbook row and the local production-compose boot', () => {
    expect(deployment).toContain('| Flags | `WEBSITE_MODULE_ENABLED`');
    expect(deployment).toContain('### Flipping `WEBSITE_MODULE_ENABLED` on the VPS');
    expect(deployment).toContain('docker compose -f docker-compose.vps.yml up -d backend');
    expect(deployment).toContain('| Website | `WEBSITE_SITE_URL`');
    expect(deployment).toContain('- **Website crons**');
    expect(deployment).toContain('| **Website intake door (jobsadmire.com forms)** |');
    expect(deployment).toContain('### Booting the production compose file locally (plan D24 — before every website-programme push)');
    expect(deployment).toContain('--env-file .env.local-prod -f docker-compose.vps.yml');
    // Task 2 owns the flip recipe; this task appends the boot recipe after it.
    expect(deployment.indexOf('### Flipping `WEBSITE_MODULE_ENABLED` on the VPS')).toBeLessThan(
      deployment.indexOf('### Booting the production compose file locally'),
    );
  });

  it('.gitignore covers the two files the local production boot creates', () => {
    const lines = readRoot('.gitignore').split('\n');
    expect(lines).toContain('docker-volumes/');
    expect(lines).toContain('.env.local-prod');
  });

  it('packages/constants mirrors the four Website enums exactly (schema.prisma is the truth)', () => {
    for (const [name, mirror] of MIRRORS) {
      const members = prismaEnumMembers(schema, name);
      expect({ name, declared: members.length > 0 }).toEqual({ name, declared: true });
      expect({ name, mirrored: Object.values(mirror).sort() }).toEqual({ name, mirrored: [...members].sort() });
    }
  });

  it('the ten website form keys are the site\'s FORM_KEYS and map onto the seven handler kinds, one each', () => {
    expect([...WEBSITE_FORM_KEYS].sort()).toEqual([...SITE_FORM_KEYS].sort());
    expect(Object.keys(WEBSITE_FORM_KIND_BY_KEY).sort()).toEqual([...SITE_FORM_KEYS].sort());
    expect(WEBSITE_FORM_KIND_BY_KEY).toEqual({
      hire: WebsiteFormKind.INQUIRY,
      contact: WebsiteFormKind.INQUIRY,
      partner: WebsiteFormKind.INQUIRY,
      workers: WebsiteFormKind.INQUIRY,
      callback: WebsiteFormKind.CALLBACK,
      visit: WebsiteFormKind.VISIT,
      calculator: WebsiteFormKind.CALCULATOR_QUOTE,
      careers: WebsiteFormKind.CAREERS_APPLY,
      fraud: WebsiteFormKind.FRAUD_REPORT,
      newsletter: WebsiteFormKind.NEWSLETTER,
    });
    expect(new Set(Object.values(WEBSITE_FORM_KIND_BY_KEY)).size).toBe(Object.values(WebsiteFormKind).length);
  });

  it('PRD §8 names the newest migration folder (read from the directory) and counts the four Website models', () => {
    const dirs = readdirSync(join(repoRoot, 'apps/backend/prisma/migrations'))
      .filter((d) => /^\d{14}_/.test(d))
      .sort();
    const latest = dirs[dirs.length - 1];
    expect(latest).toBeDefined();
    expect(prd).toContain(`Latest as of this revision: \`${latest}\``);
    expect(prd).toMatch(/^- \*\*Website[^\n]*\(4, §5\.12/m);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=2
```

Expected: the suite compiles (Task 3's constants exist) and **10 of 15 cells fail**: `PRD carries §5.12 and §7.10` (`expect(received).toContain(expected)` on the TOC line), `PRD §5.1 no longer claims…` (the old sentence is still there), `every "public unauthenticated endpoints outside" sentence…` (`names: false` on the §3 line), `CLAUDE.md: the public-surface rule…` (`rule` lacks `website/v1`), `CLAUDE.md records … resourcesEnforced immediately (RC16)`, `PRD §5.12 names the evidence read-back routes … (RC23)`, `PRD §5.12 lists every public route…`, `PRD §6.2 lists the two website events…`, `DEPLOYMENT.md: …` (fails at `- **Website crons**` — Task 2's flag row and Task 9's `| Website | \`WEBSITE_SITE_URL\`` row already pass), `.gitignore covers…`. The five that already pass — `the count lines Task 1 wrote…`, `PRD §4.4: the three sales roles…`, `packages/constants mirrors…`, `the ten website form keys…`, `PRD §8 names the newest migration…` — are pins on Tasks 1 and 3's output, kept here so the docs commit is the one that fails when they drift. (`Tests: 10 failed, 5 passed, 15 total`.)

- [ ] **Step 3: Implement**

**3a. No constants file.** Task 3 created `packages/constants/src/enums/website.enums.ts` with the four enums and the form-key constants and added the `index.ts` export line (RC1); `website-schema.spec.ts` pins the mirror member for member. This task touches neither file — the spec above imports what Task 3 exported.

**3b. `.gitignore`** — directly after the line `apps/backend/.env` insert:

```
# Local boot of docker-compose.vps.yml (docs/DEPLOYMENT.md "Booting the production compose file locally")
docker-volumes/
.env.local-prod
```

(`docker-volumes/` is also what the VPS compose bind-mounts for postgres/redis/minio, so the VPS checkout's `git status` gets quieter too.)

**3c. `CLAUDE.md`** (Operations repo root) — five edits, anchored by text:

1. In the `Modules:` sentence, replace `, Call Center; supporting infrastructure` with `, Call Center, Website (the jobsadmire.com intake door — public forms → inquiries/applicants/subscribers, a forms inbox and the integrations screen; the CMS half lands in Phase B); supporting infrastructure`.

2. Replace the whole doc-map row that begins `| Public website (jobsadmire.com) + the future \`website\` CMS module` with:

```markdown
| Public website (jobsadmire.com), the `website` module (intake door live since WP3a, 2026-09-19; CMS from Phase B) + the 2026-09-18 deploy-pipeline change | PRD §5.12 (the module) + §7.10 (why a third public surface is sanctioned); `docs/DEPLOYMENT.md` → "§DEPLOY-SAFETY-2026-09-18", the `WEBSITE_MODULE_ENABLED` and `WEBSITE_SITE_URL` env rows, "Flipping `WEBSITE_MODULE_ENABLED` on the VPS", "Booting the production compose file locally"; programme plan `~/.claude/plans/hi-we-have-to-structured-acorn.md` |
```

3. Replace `the only public surface is \`/careers/*\` + auth.` with `the public surfaces are \`/careers/*\`, auth, and the token-guarded machine doors — the İŞKUR/Indeed agent routes, the §7.8/§7.9 webhooks and, since WP3a, the website intake door \`/api/website/v1/*\` (PRD §7.10).`

4. In the numbered rule that ends `\`ProjectsModule\` imports \`SalesModule\`, never the reverse). Don't create cycles.` — append after `Don't create cycles.`: ` \`CareersPublicModule\` exports \`CareersPublicService\` for exactly one consumer, \`WebsiteModule\` (the website's careers form calls \`apply()\`); the edge is one-way — website → careers-public — and careers-public must never import website.`

5. Replace the whole bullet `- **No public endpoints outside \`careers-public\`** (auth is the one other sanctioned public surface). Don't sprinkle \`@Public()\` on feature modules.` with:

```markdown
- **No public endpoints outside `careers-public`, auth, and the argued machine doors** — the token-guarded agent routes (İŞKUR/Indeed), the signed webhooks (PRD §7.8, §7.9) and the website intake door `website/v1` (`@Public()` + `WebsiteModuleEnabledGuard` + `WebsiteApiGuard`, PRD §7.10). Each of those was sanctioned BY NAME in the PRD in the same change set that added it; a new one needs the same written argument, its own module, and the careers-public hardening set (fail-closed token, captcha, IP hashing, dedupe, audit visibility). Don't sprinkle `@Public()` on feature modules.
```

6. RC16 — in the bullet that begins `- **A permission KEY is \`module\` or \`module.resource\`**`, directly after the sentence ending `or an operator unticks a resource and nothing happens.` append: ` A module whose routes carry their keys from the first commit (the `website` module, WP3a 2026-09-19) registers `resourcesEnforced: true` immediately — there is never an un-keyed route for the flag to lie about, so the "stay `false` until the routes carry them" rule is satisfied on day one.`

The two count lines (`**85 grantable keys** …`, `All 23 modules declare resources …`) already carry Task 1's text; edit 6 appends to the second of them without touching the count.

**3d. `docs/PRD.md`** — edits in file order. Count lines, §4.4 role rows, §4.2's `website` sentence and §12.3's label count already carry Task 1's text; §8 already carries Task 3's; none of those is edited here.

1. TOC: after the line `  - 5.11 WhatsApp (native Meta Cloud API module)` add `  - 5.12 Website (public-site intake door; CMS from Phase B)`; after the line `  - 7.9 Meta WhatsApp Cloud API (native module)` add `  - 7.10 The website intake door — the third sanctioned public surface`.

2. §3 gotcha — replace the whole bullet that begins `- **Don't add public unauthenticated endpoints outside \`careers-public\`**` with:

```markdown
- **Don't add public unauthenticated endpoints outside `careers-public`, auth, and the argued machine doors** (the İŞKUR/Indeed agent routes, the §7.8/§7.9 webhooks, and the website intake door `website/v1` — §7.10). Public traffic is concentrated in those few places for token/captcha checks, IP hashing, dedupe and audit visibility; a new surface is sanctioned by name in the PRD in the same change set, never sprinkled.
```

3. §4.8 — at the end of the paragraph that begins `**Boot-time conformance.**` (after `and the census is now a FLOOR as well as a ceiling.`) append: ` **WP3a (2026-09-19) added the website module's routes** — the three public `website/v1` controllers count under `public` (class-level `@Public()` behind two guards), `GET /website/status` under `self-service`, the inbox, evidence and Integrations routes under `decorated`; read the live numbers from the boot log line `Permission conformance: …` or `GET /permissions/conformance`, not from this paragraph.`

4. §5.1 — replace the opening sentence `There is **no public ingestion endpoint** — inquiries are created by authenticated staff via \`POST /sales/inquiries\` (\`sales:CREATE\`);` with:

`**Public ingestion arrives through ONE door — the website intake module** (\`POST /api/website/v1/forms/:formKey\`, §5.12, WP3a 2026-09-19): its INQUIRY, CALLBACK, VISIT and CALCULATOR_QUOTE handlers call \`InquiryService.create\` with the synthetic \`system:website\` actor, \`InquirySource.WEBSITE_FORM\`, the \`contactName\` column (added with the module) and a \`messagePreview\` tagged with the form key (classification set only where the form implies one). Staff create inquiries via \`POST /sales/inquiries\` (\`sales:CREATE\`);`

5. §5.1 conversion paragraph — after `copies **only \`companyName\` ('Unknown' fallback), \`country\`, and \`classification\`** onto the new \`Lead\`` insert ` — plus, since WP3a (2026-09-19), \`contactName\` → \`Lead.contactPerson\``.

6. §5.1 gotchas — directly after the bullet `- Contact/discussion history reuses the shared \`CommunicationsLog\` timeline (threaded replies, \`parentId: null\` top-level filter) — not a sales-local model.` add:

```markdown
- **Website inquiries come through `InquiryService.create` only (WP3a, 2026-09-19).** The `system:website` actor holds no grants and would be refused by every `LeadService`/`MeetingService` write path, so the website handlers never call those; `InquiryService.create` consults no permission and is the whole contract. A retry from the website must never file a second inquiry — the intake service writes its submission row first and replays the prior result on the dedupe key (§5.12).
- **`Inquiry.contactName` is new and optional (WP3a).** The list/detail render it beside `companyName` with a header fallback and search ORs on it; conversion carries it to `Lead.contactPerson`. Keep the search terms in `where.OR` — the inquiry list spreads no scope fragment — but the moment `resolveEnforced` is wired into `findAll`, move them under `where.AND` (the 2026-08-10 lesson).
```

7. §5.4.3, sub-heading `##### The public careers site (\`careers-public\`)` — the one-line paragraph beginning `The only **unauthenticated** module in the platform:` (PRD :1341) ends with the sentence `**Don't add public unauthenticated endpoints outside this module** (auth's password-reset routes are the only other sanctioned public surface).` Replace that sentence (only it; the rest of the line stays) with `**Don't add public unauthenticated endpoints outside this module** except the surfaces the PRD sanctions by name — auth, the agent/webhook doors, and the website intake door \`website/v1\` (§7.10), which reaches this module only through its exported \`CareersPublicService.apply\` for the site's careers form.` Leave the §5.4.3 gotcha bullet `- **Don't add public endpoints outside \`careers-public\`** — any future public surface follows this module's hardening patterns or gets its own sibling module.` (PRD :1392) untouched: it does not contain the word `unauthenticated`, so the docs guard does not count it, and it stays true — the website door is exactly such a sibling module. After this step the guard's regex matches three PRD lines (§3 :248, §5.4.3 :1341, §6.5 :4321), every one naming `website/v1`.

8. Insert **§5.12** directly after the `---` line that precedes `## 6. Supporting Infrastructure` (i.e. between that `---` and the `## 6.` heading, so the new section ends with its own `---`):

````markdown
### 5.12 Website (public-site intake door; CMS from Phase B)

The `website` module is the Operations half of the jobsadmire.com rebuild (programme plan `~/.claude/plans/hi-we-have-to-structured-acorn.md`, approved 2026-09-18). **WP3a (this revision, 2026-09-19) ships the minimal intake door**: the marketing site — Next.js on Vercel, server-side only — posts every visitor form to Operations, which files it, notifies the right people, autoresponds, and keeps a forms inbox. The CMS half (pages, strings, collections, blog, media, navigation, settings, publish/revalidate) is Phase B (WP3c onward); its permission keys are registered now so the catalog, the hash and the role matrix change once.

**Boundaries.** The website talks ONLY to Operations, server-side, with Bearer tokens (no browser → Ops calls; CORS stays the single `FRONTEND_URL` origin with `credentials: true`; Apache untouched — `/api` already proxies to 4001). Nothing on the VPS depends on the website being up. Operations proxies the CRM (Phase B stats) through `CrmClient`; the website never sees the CRM.

**The flag — `WEBSITE_MODULE_ENABLED` (P1).** ONE always-imported `WebsiteModule`; its permission descriptor is registered unconditionally in the module constructor (a conditional import would leave `PERMISSION_KEYS` naming keys no module registers and fail the container at boot — the outage shape §DEPLOY-SAFETY-2026-09-18 exists to prevent). The flag is read PER REQUEST by `WebsiteModuleEnabledGuard` (`guards/website-module-enabled.guard.ts`, through the one helper `websiteModuleEnabled(config)` in `website-module-flag.ts` — the only production file that names the variable, pinned by `website-env.spec.ts`), applied FIRST on every public `website/v1` controller → a bare **404 when off**; the website crons call the same helper per tick; `GET /api/website/status` (`@SelfService()`) reports `{ data: { enabled } }` so the admin screens can show a "public intake disabled" banner while tokens are provisioned. Compose defaults: dev `true`, VPS `false`; the VPS value is flipped ON after the WP3a gate (before the website's WP2 wires its forms), not at Phase B. The admin screens, the descriptor and the nav entry exist regardless of the flag.

**The public door — three controllers, six routes, nothing else (P4, P5 as amended by RC3, P11).** Each carries class-level `@Public()` + `@UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)` under `website/v1`; `test/permissions/website-conformance.spec.ts` and `website-door-conformance.spec.ts` scan them with the real scanner.

| Route | Controller | Token | Purpose |
|---|---|---|---|
| `GET /api/website/v1/ping` | `WebsitePublicController` | any class | readiness facts for the website's `/api/site-health` and the external monitor: `{ tokenClass, moduleEnabled: true, captcha: 'configured'\|'missing', secondHumanConfigured: boolean, trippedForms: string[], lastSubmissionAt: string\|null, bucketPolicy: null, lastCrmFeedAt: null }` — the two Phase-B facts are `null` until they exist; `tokenClass` is the matched class verbatim (`write` / `test` / `previous-write`); the gate reads `secondHumanConfigured === true` before the flip |
| `POST /api/website/v1/forms/:formKey` | `WebsitePublicController` | write or test | the intake: whitelist → trip check → honeypot → captcha → dedupe → submission row → handler |
| `POST /api/website/v1/uploads/fraud-evidence` | `WebsitePublicUploadsController` | write or test | the ONE upload route on the door: multipart, magic-byte sniff (JPEG/PNG/WEBP/PDF), ≤ 3 files, private objects under `website-fraud/`, returns the keys the fraud form then submits as `evidenceKeys`; a test-class call sniffs and answers without storing |
| `GET /api/website/v1/newsletter/confirm` | `WebsitePublicNewsletterController` | write | double opt-in confirm (`?token=`, stateless HMAC) |
| `GET /api/website/v1/newsletter/unsubscribe`, `POST /api/website/v1/newsletter/unsubscribe` | `WebsitePublicNewsletterController` | write | unsubscribe by link, and the RFC 8058 one-click POST a mail client sends |

CV upload for the careers form reuses the EXISTING public `POST /api/careers/upload-cv` (PDF-only, ≤ 5 MB), called server-side by the website; the careers form then carries `fields.cvKey` (P5).

**Wire contract (WP2 wires to this).** `Authorization: Bearer <write|test token>`; optional `X-Website-Visitor-Ip` and `X-Website-Visitor-Ua` (trusted only because the route is token-guarded — the website is the only caller); body `WebsiteFormSubmitDto` = `{ locale: 'tr' | 'en', consentVersion: string, captchaToken?: string, honeypot?: string, sourcePath?: string, fields: Record<string, string | string[]> }` through the global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`), then the per-form catalog (`website-form-catalog.ts`) whitelists, normalises and validates `fields` BEFORE any row is written — unknown keys are dropped, a bad field is a 400 with the reasons. Answers: **200** `{ data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }` (a `status: 'FAILED'` is still 200 — the row is durable and re-runnable from the inbox; `error` is `null` unless the handler marked the failure as the VISITOR's own — RC26 — in which case it is the visitor-safe message the site shows, e.g. a closed opening or a residency rule from careers `apply()`); 400 invalid fields; 401 no/invalid token; 403 captcha failed; 404 unknown/inactive form or module off; 429 tripped form (`{ message, fallback: 'whatsapp' }`).

**Token classes (`WebsiteApiGuard`, P7, RC2).** Three classes, all server-held in `WebsiteIntegrationConfig` (AES-256-GCM `*Enc` columns under `ENCRYPTION_KEY`; write-only; `has*` flags in every API shape; per-secret `try/catch` decrypt so one undecryptable value can never 500 the whole door — the WhatsApp webhook-guard lesson; 60 s in-process cache): the **write** token (real submissions), the **test** token (synthetic traffic), and the **previous write** token (kept 24 h after a rotate so a Vercel redeploy never races the cutover — D6 "current + previous"). Guard order write → test → previous-write, `timingSafeEqual` on equal lengths, fail closed while nothing is configured (401), the matched class stamped verbatim on `req.websiteTokenClass` (`'write' | 'test' | 'previous-write'`, local type `WebsiteBearerClass`) and mapped onto the row's `tokenClass` enum (`WRITE | TEST | PREVIOUS_WRITE`) by the core. Tokens are server-generated on rotate (`wsw_`/`wst_` prefix + 48 hex), shown once, never revealed again. The D12 "rotate only after a live proof against the site's `/api/site-health`" gate is deferred to WP3c — WP3a ships rotate-with-previous-window.

**Test class = the door, not the side effects (P2).** A submission carrying the test token goes through full validation, captcha, dedupe and the submission row (`isTest = true`), and the handler runs with `dryRun: true`: no Inquiry, no applicant, no subscriber, no notification, no autoresponder. The external monitor's synthetic lead (every 30 min, D25) therefore measures the whole path up to the handler without filing 48 inquiries a day into Sales.

**Forms and handlers (P4, RC4).** The website's ten form keys (`FORM_KEYS` in its `src/analytics/forms.ts`; `WEBSITE_FORM_KEYS` / `WEBSITE_FORM_KIND_BY_KEY` in `@jobsadmire/constants` here — the ONE list the catalog, the seed, the inbox filter and the frontend import) map onto seven handler kinds. `WebsiteForm` rows: seeded by `prisma/website-form-seed.ts` (ten rows, called from `seed.ts`, `update: {}` so an operator's `isActive` survives deploys) AND lazily created from the catalog by the intake service when missing (`ensureFormRow`), so a fresh database never 404s a real form. One handler contract: `WebsiteFormHandler { kinds: readonly WebsiteFormKind[]; handle(input): Promise<WebsiteFormHandlerResult> }`, input `{ submissionId, formKey, kind, locale, dryRun, fields, consentVersion, captchaDegraded, visitorIp, userAgent }`, result `{ ok: true; createdEntityType?; createdEntityId?; detail? } | { ok: false; error; detail? }`; handlers self-register on a `WebsiteFormHandlerRegistry`; visitor-facing validation lives in the catalog, so a handler never throws for a visitor error — only an infrastructure failure, which becomes a FAILED row and is still HTTP 200. `detail` carries what the core needs afterwards: `alreadyReceived`, `skipNotification`, `skipAutoresponder`, `inquiryNumber`, `assignedAgentId`, `contactName`, `email`, and — on `{ ok: false }` — `visitorError: true` (RC26: a downstream service refused the visitor's own input; the row is FAILED with `error`, `handlerResultJson.visitorError = true`, no alarm rings, and the door echoes the message).

| formKey | Handler | What it files |
|---|---|---|
| `hire`, `contact`, `partner`, `workers` | `INQUIRY` | `InquiryService.create` (§5.1): `system:website` actor, `InquirySource.WEBSITE_FORM`, `contactName`, ISO country code, E.164 phone, `messagePreview` tagged with the form key; classification only where the form implies one |
| `callback` | `CALLBACK` | an Inquiry, classification unset |
| `visit` | `VISIT` | an Inquiry, classification unset |
| `calculator` | `CALCULATOR_QUOTE` | an Inquiry, classification unset, the quote inputs in `messagePreview` |
| `careers` | `CAREERS_APPLY` | the exported `CareersPublicService.apply` (§6.5 rules apply unchanged — residency, PK salary, PDF CV via `fields.cvKey`; a duplicate is reported as `alreadyReceived`, no second notice; `apply()`'s own 4xx comes back as a FAILED row with `visitorError` — RC26); `skipNotification: true` + `skipAutoresponder: true` (RC25 — careers-public already fires `APPLICANT_RECEIVED` to the hiring owner and the careers-mailbox confirmation to the candidate, so neither `WEBSITE_FORM_RECEIVED` nor the second-human mail is raised for a careers application) |
| `fraud` | `FRAUD_REPORT` | the submission row + up to three private objects under `website-fraud/` named in `fields.evidenceKeys` (key-only persistence in `payloadJson`; read back through `GET /api/website/forms/submissions/:id/evidence/:index/view` (streamed inline, `nosniff` + strict CSP) or `GET /api/website/forms/submissions/:id/evidence/:index/link` (15-min presign) on `website.forms` VIEW — the inbox family, RC23 — never a raw object URL, the five-times-hit private-bucket lesson) |
| `newsletter` | `NEWSLETTER` | `WebsiteSubscriber` double opt-in (stateless HMAC confirm/unsubscribe tokens, the routes above, RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post` headers threaded through `queueEmail`'s new optional `headers`); **`WebsiteForm.isActive = false` for `newsletter` until counsel clears it (D14)** — the website shows the form, Operations answers 404 for an inactive key |

**Captcha (`WebsiteCaptchaService`, P6 / D11, RC7) — a sibling of `CaptchaService`, not a change to it.** The Turnstile secret comes from the Integrations row (one widget lists both `jobsadmire.com` and `staging.jobsadmire.com`, so one secret), never from `TURNSTILE_SECRET_KEY` (that variable is paired with the careers widget key by the deploy preflight). `verify()` returns `{ outcome: 'passed' | 'failed' | 'degraded', reason?, codes? }`. **`failed`** is a 403. **`degraded`** — secret missing, Cloudflare unreachable/timeout — ACCEPTS the submission flagged `captchaDegraded = true` behind honeypot + dedupe + the abuse cap, and raises `WEBSITE_FORMS_UNAVAILABLE(reason: captchaDegraded)` once per window. Silence, not abuse, is the failure mode a lead door must fear.

**Idempotency (P8).** The submission row is written FIRST under `@@unique([formKey, requestHash, hourBucket])`; a P2002 replays the prior result with `replayed: true` (the website retries on any non-2xx, and every deploy is a 30–60 s 502 window). Then the handler; then — the `wa-ai-tools` rule — **nothing after the created row may throw**: notification, autoresponder and inbox update each sit in their own try/warn. `handlerResultJson = { attempts: [...] }` records every attempt; **re-run from the inbox is allowed only when `status = FAILED && createdEntityId IS NULL`** (409 otherwise), so a handler that filed an Inquiry and then failed to notify can never file a second one. "Needs attention" = `FAILED` or `captchaDegraded`.

**Notifications (P9, RC6).** Two events, `module: 'website'`, `mailbox: 'default'`, `relatedEntityType: 'website-submission'`, in the catalogue so Settings → Notifications lists them: `WEBSITE_FORM_RECEIVED` (recipients: the assigned agent, else holders of `website.forms:VIEW`, else super-admins; `emailLinkPath` → `/admin/website/inbox?row=<submissionId>`) and `WEBSITE_FORMS_UNAVAILABLE` (super-admins; ctx `reason ∈ captchaDegraded | tripped | untripped | drought | handlerFailed`). Every website event goes through ONE service, `WebsiteNotifyService` — the core never dispatches directly — which also mails the **second human** (`WebsiteIntegrationConfig.secondHumanEmail/Name`, owner input, no default) with `queueEmail({ mailbox: 'default' })` on EVERY website event the module raises — every `WEBSITE_FORMS_UNAVAILABLE` and every `WEBSITE_FORM_RECEIVED`; the one form that raises neither is `careers`, whose handler sets `skipNotification: true` because careers-public already announces the application (RC25) — because the dispatcher can only reach `User` rows and every alarm must leave the system that fails (D25); its links go to the Operations inbox through `absoluteLink` (`APP_URL`), never through `WEBSITE_SITE_URL` (RC28); `ping.secondHumanConfigured` says whether it is set. The emitter owns "once per window" via Redis `SETNX` (`website:alarm:<reason>:<form|*>` hourly, the drought key per company day); the registry is throttle-free. Autoresponders to the visitor are `.hbs` + `.tr.hbs` pairs per form (`WebsiteAutoresponderService`, `locale` passed explicitly, `mailbox: 'default'` — goes out as `JobsAdmire <info@jobsadmire.com>` by Gmail impersonation; any prettier alias must first be a Gmail "Send mail as" identity; the CTA links to `WEBSITE_SITE_URL`); CAREERS_APPLY keeps the careers-mailbox confirmation `apply()` already sends, and NEWSLETTER's confirm mail IS its response.

**Alarms and retention (P10, RC6).** `WebsiteAbuseService` counts CAPTCHA-VERIFIED submissions per form in a 60-minute Redis window (`website:abuse:count:<form>`) and trips at `WEBSITE_ABUSE_TRIP_THRESHOLD = 25` (`website:abuse:tripped:<form>`, announced once via `website:abuse:announced:<form>`); a tripped form answers 429 with the WhatsApp-fallback hint; `ping.trippedForms` reads the same keys. The `website-alarms` cron (every 5 min) announces untrips and raises `WEBSITE_FORMS_UNAVAILABLE(reason: drought)` when no real (non-test) submission arrived for `WEBSITE_DROUGHT_HOURS = 48`, checked only inside `WEBSITE_BUSINESS_HOURS` (Europe/Istanbul, Mon–Fri 09:00–18:00), once per company day. The `website-purge` cron at **04:30** (container clock; 03:00 is `careers-retention`'s slot) deletes rows past `purgeAfter` (90 days after HANDLED) including every `website-fraud/` object named in `payloadJson.fields.evidenceKeys` (`deleteFileChecked`; the row survives while any object does) — the two new PII tables are outside the hand-maintained careers retention sweep, so their purge ships with them. Every threshold is a constant in `website-alarms.logic.ts`, code not config. `IP_HASH_SALT` hashes every visitor IP before storage (`hashIp`, `common/utils/ip-hash.util.ts`); the raw address is never persisted.

**Screens (P14).** Module entry `website` with a sub-rail: **Inbox** (`/admin/website/inbox` — `website.forms:VIEW`; FilterBar + DataTable + detail SidePanel with payload, handler result, a fraud row's evidence — **View** bearer-fetches the streamed route into a new tab, **Copy link** copies the presigned URL (RC27) — and re-run (`website.forms:EDIT`); search matches the submission id, the created entity id and the visitor's name / company / e-mail / phone (+ the fraud `reporter*` fields) inside `payloadJson`, and is **case-insensitive for e-mail only** — Prisma's JSON filter has no `mode`, so name/company/phone match exact case in WP3a (RC24; an ILIKE follow-up is on the list); needs-attention / test filters; `?row=<id>` opens a submission from a bell link; CSV export on the dedicated `GET /api/website/forms/submissions/export` — `website.forms:EXPORT` + `@AuditEntity`) and **Integrations** (`/admin/website/integrations` — `website.integrations:VIEW/EDIT` for the page and the non-secret fields; every secret write/rotate/test route is `website:MANAGE_KEYS`, seeded to no role, rendered inside `<Can module="website" action="MANAGE_KEYS">`; `has*` chips, write-only inputs, rotate = display-once + copy (`POST /api/website/integrations/rotate/:name` → `{ name, secret, previousExpiresAt }`), a Test button (`POST /api/website/integrations/test` → `{ ok, error }`, persisting `lastTestedAt/lastTestOk/lastTestError`), the second-human fields (`PATCH /api/website/integrations`), and the flag-off banner from `/website/status`). The path segment is `inbox`, not `forms` — `forms` already breadcrumbs as "Form Builder". The backend inbox family is `GET /api/website/forms/submissions` (search, `formKey`, `status`, `needsAttention`, `isTest`, `from`/`to`, paging `{ data, meta }`), `GET …/submissions/:id`, `POST …/submissions/:id/rerun`, `GET …/submissions/export`.

**Permission keys (P3, RC8).** Ten keys, all registered in `website.module.ts`, `caslSubject: 'Website'` in `AppSubject`, `resourcesEnforced: true`, scope ALL; the descriptor literal is the source and this table copies it:

| Key | Kind | Actions | What it gates |
|---|---|---|---|
| `website` | module | VIEW, CREATE, EDIT, DELETE, EXPORT, APPROVE, MANAGE_KEYS | module nav; `MANAGE_KEYS` = every secret route on Integrations |
| `website.forms` | screen | VIEW, EDIT, EXPORT | the inbox (EDIT = re-run, EXPORT = the CSV route); evidence read-back is VIEW |
| `website.integrations` | screen | VIEW, EDIT | the Integrations page and its non-secret fields |
| `website.settings` | screen (Phase B) | VIEW, EDIT | per-form switches + notification toggles; no routes in WP3a |
| `website.pages`, `.strings`, `.collections`, `.blog`, `.media`, `.navigation` | screen (Phase B) | VIEW, CREATE, EDIT, DELETE, APPROVE | the CMS editors; no routes until WP3c |

Role defaults (`since: 3`, `ROLE_DEFAULTS_VERSION = 3`, explicit rows — `website` is NOT in `MODULE_OPS`): `admin` a module row with everything but APPROVE and MANAGE_KEYS; `marketing-manager` VIEW/CREATE/EDIT on the six content screens; `sales-manager`, `sales-executive` and `sales-agent` `website.forms` VIEW at ALL (the resource supports no other scope, so an executive or agent sees the whole inbox — the lead itself stays ASSIGNED_TO_ME through `sales`); APPROVE and MANAGE_KEYS to no role (super-admin via the bypass). Labels `permissions.keys.website__*` in en + tr for all ten. §4.4 carries the rows.

**Data (P12, RC12).** `WebsiteIntegrationConfig` (singleton), `WebsiteForm` (`formKey @unique`, `kind`, `label`, `isActive` — no autoresponder columns: the templates are `.hbs`), `WebsiteFormSubmission`, `WebsiteSubscriber` (confirm-token HASH + expiry; unsubscribe is a stateless HMAC, no column), `Inquiry.contactName`, `NotificationType.WEBSITE_FORM_RECEIVED/WEBSITE_FORMS_UNAVAILABLE`, `ActivityType.WEBSITE_SUBMISSION_RECEIVED/_HANDLED/_FAILED` — one purely additive migration, **`20260925120000_website_intake_door`** (`IF NOT EXISTS` guards, `ADD VALUE IF NOT EXISTS`, no row consumes a new enum value in the same migration; the seed writes those rows at deploy step [6b]), shipped in its own commit and pushed alone before the code (§11, `docs/DEPLOYMENT.md`). Four `Website*` enums mirrored in `packages/constants` (§8).

**Env (RC11).** Two variables, both mapped in both compose files (a `.env` line reaches nothing otherwise — the WA_CAMPAIGN_ALLOWLIST/VAPID lesson, each pinned by a text-reading spec): `WEBSITE_MODULE_ENABLED` (above) and `WEBSITE_SITE_URL` (the public site's base URL for every link Operations writes into a VISITOR mail — newsletter confirm/unsubscribe, autoresponder CTA — read through `websiteSiteUrl(config)`; VPS compose default and `.env` value `https://www.jobsadmire.com`, dev `http://localhost:3000`; the staff-facing notify links use `APP_URL` instead — RC28; WP3c's revalidate service reads the same variable; the variable, both `.env` examples and its DEPLOYMENT.md row arrived with the newsletter task, RC18). Tokens, the Turnstile secret and the second human live in the database via the Integrations screen. `WEBSITE_PUBLIC_BUCKET` and `WEBSITE_REDIS_DB` are Phase B.

**Decisions & gotchas**

- **The descriptor is registered unconditionally; only REQUESTS are flag-gated (P1, 2026-09-19).** A `WEBSITE_MODULE_ENABLED`-conditional import in `app.module.ts` throws `PERMISSION_KEYS lists 10 key(s) no module registers` at boot, AFTER deploy step [6] has replaced the containers — a production outage latched by the poller, not a rollback. Never gate the module import; gate the guard.
- **The test token never reaches a side effect (P2).** A synthetic lead that files a real Inquiry rings a salesperson 48 times a day and poisons the Sales dashboard. `dryRun` short-circuits inside the handler, never earlier — the door up to that point IS what the heartbeat measures.
- **The website's Turnstile secret is a DB column, never `TURNSTILE_SECRET_KEY` (P6).** That env name is paired with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` by `deploy-vps.sh`'s preflight; reusing it would make every deploy fail the moment the careers widget key is absent.
- **Invalid captcha is 403; missing captcha infrastructure is accept + flag + alarm (D11).** The careers `CaptchaService` does the opposite in both directions (silent pass on an unset secret, fail closed on a timeout) and is left untouched — two surfaces, two documented postures.
- **Submission row first, handler second, nothing may throw after the created row (P8).** Any exception after `inquiries.create` turns the website's retry into a second inquiry. Re-run only on `FAILED && createdEntityId IS NULL`. Visitor-facing validation belongs in the catalog BEFORE the row; a handler that throws a 4xx after the row exists is a bug.
- **One alarm pair (RC6).** `WebsiteNotifyService` is the only emitter of website events and the only path to the second human; `WebsiteAbuseService` is the only writer and reader of the trip keys (`website:abuse:*`). A second counter or a second key prefix means a tripped form that never 429s and never shows in `ping` — the exact drift the consistency check caught before this shipped.
- **Never add `website` to `MODULE_OPS` or map an `ACTIONS_*` constant over it** — the phantom-grant bug (`20260924100000`). Explicit rows, `since: 3`, version 3.
- **A public submitter has no `User` row** — autoresponders go through `queueEmail` directly with an explicit `locale`; routing them through `EventDispatcher` resolves zero recipients and silently skips. Never put tokens, secrets or ids into a dispatch `ctx` — a shipped `.hbs` receives the raw ctx.
- **`WebsiteForm.isActive = false` for `newsletter` until counsel clears it (D14).** Built, tested, dark. WP3a has no route or screen for the switch (`website.settings` registers no routes yet): flip it by SQL on the VPS — `docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c "update website_forms set \"isActive\" = true where \"formKey\" = 'newsletter'"` — and the seed's `update: {}` keeps the value across deploys (RC12).
- **The rotate-with-live-proof gate (D12) is WP3c's.** WP3a's rotate keeps the previous write token for 24 h — that window is the only thing between a token rotation and a dark form during a Vercel redeploy; don't shorten it.
- **Every deploy is a 30–60 s 502 on `/api/website/*`.** The website retries; `WEBSITE_FORMS_UNAVAILABLE` must not fire on a deploy blip (the drought window is hours, the captcha-degraded alarm is once per window).

---
````

9. §6.2 — four edits:
   - Replace `Every EMAIL-channel dispatcher event currently sends with a blanket \`mailbox: 'careers'\` (a code comment marks this for a per-event \`def.mailbox\` once non-IR modules adopt the EMAIL channel).` with `The mailbox is per event — \`def.mailbox ?? 'careers'\` — so every staff event outside IR declares \`mailbox: 'default'\` explicitly (marketing, whatsapp and website all do; a website event that forgot it would go out through the careers@ Gmail chain).`
   - Directly before `Re-derive the authoritative list from \`event-registry.ts\`, not from this paragraph.` insert `Website (§5.12, 2026-09-19): \`WEBSITE_FORM_RECEIVED\`, \`WEBSITE_FORMS_UNAVAILABLE\`. `
   - Replace `Today only \`marketing\` declares them (14 events); adding a module means` with `\`marketing\` (14 events) and \`website\` (2 events, §5.12) declare them; adding a module means`.
   - Replace the gotcha `- The dispatcher's EMAIL channel sends everything \`mailbox: 'careers'\` today; make it per-event \`def.mailbox\` before a non-IR module adopts EMAIL.` with `- The dispatcher's EMAIL channel is per-event \`def.mailbox ?? 'careers'\`; a non-IR event MUST declare \`mailbox: 'default'\` (pinned per module by \`event-registry-coverage.spec.ts\` — whatsapp and website included).`

10. §6.5 — two edits:
   - Replace `(the sanctioned exceptions outside it are the İŞKUR agent routes — \`@Public()\` + \`IskurAgentGuard\` constant-time token check — and the auth module's login/refresh/password-reset routes)` with `(the sanctioned exceptions outside it are the İŞKUR/Indeed agent routes — \`@Public()\` + a constant-time token guard — the auth module's login/refresh/password-reset routes, the §7.8/§7.9 webhooks, and since WP3a the website intake door \`website/v1\`, §7.10 — the "own sibling module with the same hardening" this paragraph asked for)`.
   - Replace the whole gotcha bullet that begins `- **Don't add public unauthenticated endpoints outside this module** (auth's login/refresh/password-reset routes are the other sanctioned public surface` with `- **Don't add public unauthenticated endpoints outside this module** without the §7.10 treatment: a named PRD argument, its own module, a fail-closed token guard, captcha, IP hashing, dedupe and audit visibility (the website door \`website/v1\` is the worked example; auth's login/refresh/password-reset routes remain the other sanctioned surface — someone who can't log in can't authenticate to ask for a reset).`

11. Insert **§7.10** directly after the `---` line that precedes `## 8. Data Model Overview` (between that `---` and the `## 8.` heading):

```markdown
### 7.10 The website intake door — the third sanctioned public surface

`apps/backend/src/modules/website/website-public.controller.ts`, `website-public-uploads.controller.ts` and `newsletter/website-public-newsletter.controller.ts` carry a class-level `@Public()`. This section is the argument that makes that legal under the rule stated in §3, §6.5, §10 and `CLAUDE.md` ("no public endpoints outside `careers-public`"), the same way §7.8 argued the call-center webhooks/tools and §7.9 the WhatsApp webhook.

**Why a door at all.** The marketing site (Vercel) has no database and buffers nothing (D11: leads are never held on Vercel). Every visitor form must land in Operations synchronously or be lost; the only alternative to a public route is a public queue, which is the same surface with a worse audit trail.

**Why here and not in `careers-public`.** The careers module's routes are UNAUTHENTICATED (a candidate has no credential); the website door is a MACHINE route — every caller presents a server-held Bearer token, and an unauthenticated call is a 401 before any body is parsed. Those are different threat models with different controls, and §6.5 already said a future public surface "gets its own sibling module with the same hardening". `careers-public` is touched in exactly one way: it EXPORTS `CareersPublicService` so the website's careers form reaches `apply()` (a one-way edge, website → careers-public).

**The hardening set, item by item (the §6.5 list, applied):**

| §6.5 control | Website door |
|---|---|
| Public surface small and explicit | six routes on three controllers, one module: `GET /api/website/v1/ping`, `POST /api/website/v1/forms/:formKey`, `POST /api/website/v1/uploads/fraud-evidence`, `GET /api/website/v1/newsletter/confirm`, `GET /api/website/v1/newsletter/unsubscribe`, `POST /api/website/v1/newsletter/unsubscribe`; CV upload reuses the existing public `careers/upload-cv` (P5) |
| Authentication | `WebsiteApiGuard` — write / test / previous-write classes, DB-held encrypted, `timingSafeEqual`, fail-closed while unconfigured (P7) — the `IskurAgentGuard`/`CallAgentToolGuard` shape |
| Kill switch | `WebsiteModuleEnabledGuard` first in the chain — bare 404 when `WEBSITE_MODULE_ENABLED` is not `'true'` (P1); the compose default on the VPS is `false` |
| Captcha | `WebsiteCaptchaService` (P6) — invalid token 403; infrastructure failure accepts flagged + alarmed (D11) |
| Rate limiting | `@Throttle` is inert platform-wide (§6.5); the REAL controls are the hour-bucket dedupe (`@@unique([formKey, requestHash, hourBucket])`), the honeypot, the token classes and the per-form abuse auto-trip on captcha-verified counts (P10) |
| IP hashing | `sha256(IP_HASH_SALT + ':' + ip)` on the submission row; the raw address is never stored |
| Audit visibility | every call writes a `WebsiteFormSubmission` row before any side effect; handlers log `ActivityLogger` entries with the `system:website` actor; the forms inbox (`website.forms`) is the operator's view, including the fraud evidence read-back under `GET /api/website/forms/submissions/:id/evidence/:index/view|link`; secret writes/rotates/tests on the Integrations screen carry `@AuditEntity` under `website:MANAGE_KEYS`; the CSV export is its own audited route |
| Body size | JSON forms sit under the global 1 MB parser; fraud evidence is multipart on its own route with a magic-byte sniff, ≤ 3 files, and lands under the private `website-fraud/` prefix (RC3) |
| Retention | `purgeAfter` (90 days post-HANDLED) + the 04:30 purge cron including MinIO objects (P10) |

**What it must never become.** No browser ever calls this door (CORS stays a single origin, `credentials: true`); no other feature module may mount a route under `website/v1`; no route here may populate `request.user` with the synthetic actor (`AuditLog.performedById` is a `Restrict` FK to `User`); and a new public surface anywhere else gets its own §7.x paragraph, not a footnote here.

**Decisions & gotchas**
- **Three sanctioned machine doors now exist — agents (§5.4.4/§5.4.5), webhooks (§7.8/§7.9), website (§7.10) — each argued by name.** The rule in §3/§6.5/§10 is unchanged in spirit: public traffic lives where it is hardened and written down.
- **The door is dark by default on the VPS** (`WEBSITE_MODULE_ENABLED=false` → 404); `docs/DEPLOYMENT.md` has the flip recipe and the reason it needs `up -d backend`, not a `.env` edit alone.
- **`ping` is the website's liveness fact, not a health endpoint** — it requires a token so it cannot be used to enumerate the module from outside; `/api/health` remains the deploy check.
- **The fraud-evidence upload is the one upload route the door will ever have (RC3).** Anything else the site must store goes through an existing public route (CV → `careers/upload-cv`) or waits for Phase B's media pipeline.

---
```

12. §10 — replace the whole bullet that begins `- All public unauthenticated traffic is concentrated in \`careers-public\`` with:

```markdown
- All public unauthenticated traffic is concentrated in `careers-public` (rate limits, Turnstile captcha, IP hashing, audit visibility) — plus the sanctioned `auth` reset routes, the token-guarded agent routes (`IskurAgentGuard`, constant-time, fail-closed), the signed webhooks (§7.8, §7.9) and the website intake door `website/v1` (token-guarded, flag-gated, captcha + dedupe + IP hashing — §7.10). Don't sprinkle `@Public()` across feature modules.
```

13. §12.2 — directly after the line `  - HRM module root now renders the HRM dashboard (2026-09-15), same pattern as Sales.` add:

```markdown
- **2026-09-19 — Website module, WP3a (intake door).** The 23rd permission module (`website`, ten keys, `ROLE_DEFAULTS_VERSION` 3), the token-guarded public door `website/v1` (§7.10 — six routes on three controllers), seven form handlers on one contract, `Inquiry.contactName`, two notification events + the second-human fallback, autoresponders EN/TR, abuse trip / lead drought / purge crons, the Forms inbox and the Integrations screen, `WEBSITE_MODULE_ENABLED` (VPS default `false`, flipped after the gate) and `WEBSITE_SITE_URL`. Migration `20260925120000_website_intake_door`, pushed alone first (§11). The CMS half is Phase B (§5.12).
```

**3e. `docs/DEPLOYMENT.md`** — three insertions (and one explicit non-edit):

1. Directly after the bullet that begins `- **\`careers-retention\`** (daily 03:00 UTC)` add:

```markdown
- **Website crons** (since WP3a, in the backend process; each one begins its tick with `websiteModuleEnabled(config)` and does nothing while `WEBSITE_MODULE_ENABLED` is not `true`): **`website-alarms`** (every 5 min) announces a form's untrip once its 60-minute abuse window has expired and raises `WEBSITE_FORMS_UNAVAILABLE(reason: drought)` — once per company day, only inside Europe/Istanbul business hours — when no real (non-test) submission arrived for 48 hours; **`website-purge`** (daily **04:30**, container clock — 03:00 is `careers-retention`'s slot) deletes `website_form_submissions` rows past `purgeAfter` (90 days after HANDLED) including the `website-fraud/` MinIO objects they name — the two new PII tables are outside `careers-retention`, so their purge lives here. No env var beyond the flag; the numbers (trip threshold 25, window 3600 s, drought 48 h, business hours) are constants in `modules/website/website-alarms.logic.ts`, code not config, and the once-per-window markers are Redis keys (`website:alarm:*`, `website:abuse:*`) that expire on their own.
```

2. The environment-variable table is NOT edited here: Task 2's `| Flags | \`WEBSITE_MODULE_ENABLED\`` row and Task 9's `| Website | \`WEBSITE_SITE_URL\`` row (RC18) are already in it and are pinned by the guard spec.

3. Directly before the line `### Verifying a deploy landed` — i.e. after Task 2's `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` section and its trailing blank line — insert this section, followed by one blank line:

````markdown
### Booting the production compose file locally (plan D24 — before every website-programme push)

`docker-compose.vps.yml` is booted on the Mac exactly as the VPS boots it, so a boot-time throw (a permission-catalog drift, an undecorated route, a DI edge that does not resolve, a config assertion, a migration that disagrees with `schema.prisma`) is found here and not at deploy step [6], where it takes production down and the poller latches the SHA. ONE Docker stack at a time and nothing else building (the Mac has hung twice under parallel builds): stop the dev stack first, and do not run jest while the images build. Run it from the checkout you are about to push; the WP3a gate record (Task 13 §B) pastes every line marked `→` below.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website   # the checkout you are about to push

# 0. the dev stack uses the SAME container names — take it down (its named volumes survive)
docker compose -p jobsadmire-operations -f /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations/docker-compose.yml down
docker ps --format '{{.Names}}' | grep jobsadmire_ops_ && echo 'STOP: dev containers still present' || echo 'ok: no ops containers'

# 1. throwaway production-shaped env (git-ignored; never reuse real secrets here).
#    Every `${VAR:?…}` the VPS compose requires is set; everything else takes the compose default.
cat > .env.local-prod <<EOF
NODE_ENV=production
APP_URL=http://localhost:4001
FRONTEND_URL=http://localhost:4000
POSTGRES_USER=jobsadmire_ops
POSTGRES_PASSWORD=localprod
POSTGRES_DB=jobsadmire_operations
REDIS_PASSWORD=localprod
JWT_ACCESS_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 16)
OTP_SALT=$(openssl rand -base64 32 | tr -d '/+=' | head -c 40)
IP_HASH_SALT=$(openssl rand -base64 32 | tr -d '/+=' | head -c 40)
MINIO_ACCESS_KEY=jobsadmire-ops-admin
MINIO_SECRET_KEY=localprod-minio-secret
MINIO_BUCKET_NAME=jobsadmire-ops
NEXT_PUBLIC_API_URL=http://localhost:4001/api
NEXT_PUBLIC_WS_URL=ws://localhost:4001
WEBSITE_MODULE_ENABLED=false
WEBSITE_SITE_URL=https://www.jobsadmire.com
EOF

# 2. build both production images (10–15 min; nothing else running)
docker compose --env-file .env.local-prod -f docker-compose.vps.yml build backend frontend

# 3. infra first, then the deploy's own migrate-before-start order (deploy-vps.sh steps [3] and [5])
docker compose --env-file .env.local-prod -f docker-compose.vps.yml up -d --wait postgres redis minio
docker compose --env-file .env.local-prod -f docker-compose.vps.yml run --rm --no-deps -T backend \
  npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma
#    → every migration applies on the empty database, 20260925120000_website_intake_door last

# 4. the drift gate (step [5b]) — on a FRESH database this must be exactly clean (exit 0, "No difference detected")
docker compose --env-file .env.local-prod -f docker-compose.vps.yml run --rm --no-deps -T backend npx prisma migrate diff \
  --from-schema-datasource apps/backend/prisma/schema.prisma \
  --to-schema-datamodel apps/backend/prisma/schema.prisma --exit-code; echo "drift exit=$?"
#    → drift exit=0

# 5. the app (step [6]), the conformance line, the health check
docker compose --env-file .env.local-prod -f docker-compose.vps.yml up -d backend
sleep 40
docker logs jobsadmire_ops_backend 2>&1 | grep -E 'Permission conformance|Nest application successfully started|Error:'
#    → "Permission conformance: N decorated, N public, N self-service, 0 undecorated (PERMISSIONS_STRICT=true)"
#      then "Nest application successfully started"; ANY "Permission conformance failed" or "Error:" line = do not push
curl -s -o /dev/null -w 'health %{http_code}\n' http://localhost:4001/api/health        # → health 200
curl -s http://localhost:4001/api/health; echo                                            # → {"status":"ok",...}
docker inspect -f 'restarts={{.RestartCount}} {{.State.Status}}' jobsadmire_ops_backend   # → restarts=0 running

# 6. the seed, exactly as deploy step [6b] runs it, then the frontend
docker compose --env-file .env.local-prod -f docker-compose.vps.yml exec -T -e FORCE_SEED_PROD=yes -w /app/apps/backend backend npx prisma db seed
#    → finishes without a stack trace (MODULE_NOT_FOUND here = a workspace package missing from Dockerfile.prod)
docker compose --env-file .env.local-prod -f docker-compose.vps.yml up -d frontend
sleep 30; curl -s -o /dev/null -w 'frontend %{http_code}\n' http://localhost:4000/en/auth/login   # → frontend 200

# 7. both flag states — the guard, not the import, is what changes
curl -s -o /dev/null -w 'ping flag=false %{http_code}\n' http://localhost:4001/api/website/v1/ping   # → 404
sed -i '' 's/^WEBSITE_MODULE_ENABLED=.*/WEBSITE_MODULE_ENABLED=true/' .env.local-prod
docker compose --env-file .env.local-prod -f docker-compose.vps.yml up -d backend
sleep 40
docker logs jobsadmire_ops_backend 2>&1 | grep -c 'Permission conformance:'              # → 1 (the recreated container's line)
curl -s -o /dev/null -w 'health %{http_code}\n' http://localhost:4001/api/health        # → health 200
curl -s -o /dev/null -w 'ping flag=true %{http_code}\n' http://localhost:4001/api/website/v1/ping    # → 401 (on, fails closed with no token)
docker inspect -f 'restarts={{.RestartCount}}' jobsadmire_ops_backend                    # → restarts=0

# 8. tear down; the bind-mounted data dirs are throwaway
docker compose --env-file .env.local-prod -f docker-compose.vps.yml down
rm -rf docker-volumes || docker run --rm -v "$PWD/docker-volumes:/v" alpine sh -c 'rm -rf /v/postgres /v/redis /v/minio'
rm -f .env.local-prod
git status --short          # → empty (docker-volumes/ and .env.local-prod are git-ignored anyway)
```

How to read the result: the push is allowed only when step 4 exits 0, step 5 prints the conformance line with `0 undecorated` and health is 200, step 6's seed finishes without a thrown error, and step 7 shows 404 → 401 with `restarts=0` in both states. A `Permission conformance failed (N problem(s))` line names every drifted key or undecorated route; a Nest `Error:` naming a provider is a DI edge a module forgot to import — fix, rebuild, repeat. The prod database ALSO carries a pre-existing, unrelated drift (the incident snapshot tables, the orphan `LanguagePreference` type); step 4 is clean here precisely because the database is fresh, which is why this local run — not the VPS gate — is the proof that `schema.prisma` and the migration agree. Restart the dev stack afterwards with `docker compose -p jobsadmire-operations -f /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations/docker-compose.yml up -d` — but not while a push is being verified.
````

4. In the third-party enablement runbook table, directly after the row that begins `| **Cloudflare Turnstile** |` insert:

```markdown
| **Website intake door (jobsadmire.com forms)** | Database: Website → Integrations (`/admin/website/integrations`; the page needs `website.integrations` VIEW/EDIT, every secret route needs `website:MANAGE_KEYS` — seeded to no role, super-admin only) | Write token + test token (server-generated on Rotate — `POST /api/website/integrations/rotate/:name` — shown ONCE, previous write token honoured for 24 h after a rotate so the Vercel redeploy never races it), the website's own Turnstile secret (one Cloudflare widget listing `jobsadmire.com` and `staging.jobsadmire.com`; NOT `TURNSTILE_SECRET_KEY`, which the deploy preflight pairs with the careers widget), the second-human alert recipient (required — `ping.secondHumanConfigured` must be `true` before the flip; no default). All AES-256-GCM under `ENCRYPTION_KEY`, no reveal route, no env fallback; the Test button probes the stored Turnstile secret. The door itself is dark until `WEBSITE_MODULE_ENABLED=true` (row above); `WEBSITE_SITE_URL` gives the mails their links. Hand the write token to the website's Vercel project as `OPS_WEBSITE_WRITE_TOKEN`, the test token to the external monitor's synthetic-lead job. |
```

**3f. Memory line** — append to `/Users/agentfaraz/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md`:

```
**WP3a docs (2026-09-19):** the website door is the THIRD sanctioned public surface, argued in Ops PRD §7.10 (six routes on three controllers incl. the one fraud-evidence upload, RC3); CLAUDE.md's "No public endpoints outside…" rule now names `website/v1` + §7.10 and the careers-public → website export edge; PRD §5.12 is the module spec (flag, token classes, handler contract, one alarm pair, `WEBSITE_SITE_URL`, newsletter dark until counsel — SQL flip only); the local production-compose boot recipe (D24, run before every Ops push) lives in Ops `docs/DEPLOYMENT.md` beside Task 2's flip recipe; `website-docs-guard.spec.ts` fails if any of those sentences is "cleaned up", if `packages/constants` drifts from the four `Website*` enums, or if PRD §8 stops naming the newest migration folder (`20260925120000_website_intake_door`).
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts src/modules/website/website-env.spec.ts src/modules/website/website-schema.spec.ts --maxWorkers=2
```

Expected: `PASS src/modules/website/website-docs-guard.spec.ts` (15 passed), `PASS src/modules/website/website-env.spec.ts` (Task 2's four cells — the DEPLOYMENT cell still finds `| Flags | \`WEBSITE_MODULE_ENABLED\`` and the flip heading; nothing in this task names the variable in a `.ts` file), `PASS src/modules/website/website-schema.spec.ts` (Task 3's mirror cell — this task did not touch `website.enums.ts`).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git diff --stat && git diff -- packages/ apps/backend/prisma/ | wc -l
```

Expected: the diff touches only `.gitignore`, `CLAUDE.md`, `docs/PRD.md`, `docs/DEPLOYMENT.md` and adds the one spec; the second command prints `0` (no change under `packages/` or `prisma/` — Tasks 1–3 own those).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/backend && npx eslint apps/backend/src/modules/website/website-docs-guard.spec.ts
```

Expected: both clean (one tsc at a time — nothing else building).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git add .gitignore CLAUDE.md docs/PRD.md docs/DEPLOYMENT.md apps/backend/src/modules/website/website-docs-guard.spec.ts && git commit -m "docs(website): PRD §5.12 + §7.10 sanction the intake door; CLAUDE.md public-surface rule + export edge + RC16; DEPLOYMENT crons, runbook row, local prod-compose boot recipe; docs guard spec (P13)

PRD §5.12 is the WP3a module spec as built (flag guard, three bearer
classes, six public routes on three controllers incl. the one
fraud-evidence upload, Task 6's handler contract and catalog, one alarm
pair, WEBSITE_SITE_URL, newsletter dark until counsel — SQL flip only);
§7.10 argues why a third public surface is legal and lists the §6.5
hardening set item by item; §3/§5.1/§5.4.3/§6.2/§6.5/§10/§12.2 prose
now names website/v1 wherever careers-public + auth used to be the only
sanctioned surfaces. CLAUDE.md's rule points at §7.10 and names the
careers-public -> website export edge. DEPLOYMENT.md gains the website
crons, the runbook row and the D24 local production-compose boot recipe
(Task 13 runs it verbatim); .gitignore covers its two throwaway files.
CLAUDE.md also records that a module keyed from birth registers
resourcesEnforced immediately (RC16). Count lines (Task 1), §8 (Task 3),
the flag row + flip recipe (Task 2) and the WEBSITE_SITE_URL row (Task 9)
are pinned, not rewritten.
website-docs-guard.spec.ts fails when any of it is cleaned up, when
packages/constants drifts from the four Website enums, or when §8 stops
naming the newest migration folder.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

(The memory file is outside the repo and is not committed.)

---

---

