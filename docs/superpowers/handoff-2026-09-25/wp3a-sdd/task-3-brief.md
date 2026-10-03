### Task 3: Prisma WP3a subset — its own migration commit, plus the `@jobsadmire/constants` website enums and form-key constants

Rulings applied: P12 (migration in its own commit, folder name sorting after the newest applied migration, every statement guarded, `ADD VALUE IF NOT EXISTS` never consumed in the same file, verified in-container with `prisma migrate diff --exit-code`, pushed and verified ALONE), P7 (`WebsiteIntegrationConfig` `*Enc` columns + `previousWriteTokenExpiresAt`), P8 (`@@unique([formKey, requestHash, hourBucket])`, `handlerResultJson`), P9 (two `NotificationType` members, `secondHumanEmail/Name`), P4 (`WebsiteSubscriber` double opt-in, `WebsiteForm.isActive`), P10 (`purgeAfter`), P13 (`packages/constants` mirror in the same change set; PRD §8 counts), RC1 (this task is the single source of `WEBSITE_FORM_KEYS`, `WebsiteFormKey`, `WEBSITE_FORM_KIND_BY_KEY`, `isWebsiteFormKey` — Task 4's `website.constants.ts`, Task 6's catalog and seed, Task 7's inbox, Task 10's crons, Task 11's frontend and Task 12's docs guard all import them from `@jobsadmire/constants`; Task 12 does NOT create or edit `website.enums.ts`), RC2 (`WebsiteFormSubmission.tokenClass WebsiteTokenClass @default(WRITE)`; the Prisma enum keeps the name `WebsiteTokenClass`, Task 4's lower-case union is `WebsiteBearerClass`), RC10 (folder `20260925120000_website_intake_door` everywhere; PRD §8 = 193 models / 168 enums — this task writes the §8 count lines, Task 12 adds prose only, Task 1 owns the permission-count lines), RC12 (NO `WebsiteForm.autoresponderSubjectEn/Tr/BodyEn/Tr` — autoresponders are `.hbs` per form and language, P9; NO `WebsiteSubscriber.unsubscribeTokenHash` — the RFC 8058 one-click unsubscribe is a stateless HMAC in Task 9; `WebsiteForm.isActive` is flipped by SQL only in WP3a), RC14 (this commit lands after Task 1's and Task 2's commits in branch history; Task 13 cherry-picks it onto `origin/main` first — the expected path, not a fallback), RC15 (every file printed in final form; anchors quoted by line text).

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` on the WP3a branch/worktree (never the shared `main` checkout). `main` is at `9139e16`; the schema is 8,963 lines / 189 models / 164 enums; the newest migration folder is `20260925110000_platform_post_override_index` (verified 2026-09-19).

**Files:**
- Create: `apps/backend/prisma/migrations/20260925120000_website_intake_door/migration.sql`
- Create: `packages/constants/src/enums/website.enums.ts`
- Create: `apps/backend/src/modules/website/website-schema.spec.ts` (the directory `apps/backend/src/modules/website/` exists since Task 1's `website.module.ts`; jest `roots` cover all of `src/`)
- Modify: `apps/backend/prisma/schema.prisma` — five edits, each anchored by exact line text in Step 3: (a) insert the website enum block immediately BEFORE the line `// === Sales Pipeline enums ===` (currently line 488); (b) `enum NotificationType`: append two members after the line `  WHATSAPP_INQUIRY_CAPTURED` (currently line 284, the last member before the closing `}`); (c) `enum ActivityType`: append three members after the line `  CALL_CAMPAIGN_COMPLETED` (currently line 445, the last member before the closing `}`); (d) `model Inquiry`: insert `contactName` after the line `  companyName     String?` that is followed by `  country         String?` (currently line 1727 — the only `companyName` line inside `model Inquiry {`); (e) append four models at the very end of the file, after the closing `}` of `model WaCampaignRecipient` (the file's last line, currently 8963; the file ends with `}\n`)
- Modify: `packages/constants/src/index.ts` — insert one line after the line `export * from './enums/projects.enums';` (line 7)
- Modify: `docs/PRD.md` §8 — the lines quoted in Step 3 (i): the counts sentence, the four comment tails in the re-derive code block (RC29 — `# models`, `# enums`, `# migration dirs`, `# backend modules` → 32), the "Latest as of this revision" sentence, the "Re-derived from …" sentence, the "Auth / users / permissions" bullet, one new "Website" bullet after the "Sales Training Academy" bullet, and one new bullet under `### Enum notes`
- Test: `apps/backend/src/modules/website/website-schema.spec.ts`; the neighbouring guards `apps/backend/src/modules/whatsapp/wa-schema.spec.ts`, `apps/backend/src/modules/notifications/event-registry-coverage.spec.ts`, `apps/backend/src/modules/notifications/module-notification-seed.spec.ts` and `apps/backend/test/permissions/repo-invariants.spec.ts` must stay green

**Interfaces:**
- Consumes (Tasks 1–2): nothing at compile or run time. The only touchpoint is the directory `apps/backend/src/modules/website/` that Task 1 created for `website.module.ts`; no source file in the repo references the new models, columns or enum members after this commit, so the commit is boot-neutral and can run under the pre-website code (that is the point of pushing it alone — P12).
- Consumes (repo, verified): `apps/backend/prisma/schema.prisma` header rule `// ENUMS — mirrored in packages/constants/src/enums/` (line 12); the HRM lesson comment inside `enum ActivityType` ("Real enum members, never casts: two HRM crons spent months throwing at INSERT … the throw was swallowed", lines 386–390) and `ActivityLogger.log()` (`src/modules/activities/activity-logger.service.ts:94-98`, `catch (e) { // Intentionally swallow … this.logger.warn(…) }`); the repo idiom for guarded DDL — `ALTER TYPE … ADD VALUE IF NOT EXISTS` (`20260925100000_marketing_withdraw_unapprove/migration.sql`), `DO $$ … IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '…')` (`20260918100000_task_links_and_marketing_settings/migration.sql:58-68`), `pg_type`/`pg_enum` checks (`20260921103000_remove_legacy_training/migration.sql:151-155`), `CREATE INDEX IF NOT EXISTS` (`20260925110000_platform_post_override_index/migration.sql`); the source-reading spec shape of `src/modules/whatsapp/wa-schema.spec.ts` (`readdirSync` on the migrations folder, `find((f) => f.includes(fragment))`); `packages/constants` (`"main": "./dist/index.js"`, `"types": "./src/index.ts"`; mapped in `apps/backend/jest.config.js` `moduleNameMapper['^@jobsadmire/constants$']`, `apps/backend/tsconfig.json` and `apps/frontend/tsconfig.json` `paths`, and already imported by `apps/backend/prisma/seed.ts:33`, so a seed file may import it too); the mirror-file style of `packages/constants/src/enums/projects.enums.ts`; `apps/backend/package.json` scripts `type-check` (`tsc --noEmit`) and `prisma:generate`; the dev stack `docker-compose.yml` services `postgres` (`POSTGRES_USER: jobsadmire`, `POSTGRES_DB: jobsadmire_ops_dev`), `redis`, `backend` (Dockerfile `WORKDIR /app/apps/backend`; bind mount `./apps/backend/prisma:/app/apps/backend/prisma`, so a migration folder written on the host is already inside the container); the website repo's canonical key list `FORM_KEYS` in `jobsadmire-website/src/analytics/forms.ts` (`hire, contact, partner, careers, newsletter, callback, visit, calculator, fraud, workers` — that exact order is mirrored below).
- Produces (Prisma client after `prisma generate` — Tasks 4–12 compile against it):
  - `enum WebsiteFormKind { INQUIRY CAREERS_APPLY NEWSLETTER FRAUD_REPORT CALLBACK VISIT CALCULATOR_QUOTE }`, `enum WebsiteSubmissionStatus { RECEIVED HANDLED FAILED SPAM }`, `enum WebsiteSubscriberStatus { PENDING CONFIRMED UNSUBSCRIBED }`, `enum WebsiteTokenClass { WRITE TEST PREVIOUS_WRITE }` (RC2 — Task 6's core writes `PRISMA_TOKEN_CLASS_BY_BEARER[req.websiteTokenClass]` from Task 4's `website.constants.ts` into `tokenClass`).
  - `NotificationType.WEBSITE_FORM_RECEIVED`, `NotificationType.WEBSITE_FORMS_UNAVAILABLE` (P9; Task 10 registers them in `EVENT_REGISTRY` and the module-notification seed).
  - `ActivityType.WEBSITE_SUBMISSION_RECEIVED | WEBSITE_SUBMISSION_HANDLED | WEBSITE_SUBMISSION_FAILED` — real members for Task 6's `ActivityLogger.log()` rows, never cast.
  - `model WebsiteIntegrationConfig` (`@@map("website_integration_config")`), `prisma.websiteIntegrationConfig`: `id String @id @default(cuid())`, `writeTokenEnc String?`, `previousWriteTokenEnc String?`, `previousWriteTokenExpiresAt DateTime?`, `testTokenEnc String?`, `turnstileSecretEnc String?`, `revalidateSecretEnc String?`, `secondHumanEmail String?`, `secondHumanName String?`, `lastTestedAt DateTime?`, `lastTestOk Boolean?`, `lastTestError String? @db.Text`, `updatedById String?`, `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt` — exactly the column list Task 4's `WebsiteIntegrationConfigService` consumes (P7/P9; singleton via `findFirst` → `create({ data: {} })`).
  - `model WebsiteForm` (`@@map("website_forms")`), `prisma.websiteForm`: `id`, `formKey String @unique`, `kind WebsiteFormKind`, `label String`, `isActive Boolean @default(true)`, `createdAt`, `updatedAt`, relation `submissions WebsiteFormSubmission[]`. No autoresponder columns (RC12). The ten rows are seeded by Task 6's `apps/backend/prisma/website-form-seed.ts` (`WEBSITE_FORM_SEED`, `newsletter.isActive = false`, upsert with `update: {}`), which may build them from `WEBSITE_FORM_KEYS` × `WEBSITE_FORM_KIND_BY_KEY` below.
  - `model WebsiteFormSubmission` (`@@map("website_form_submissions")`), `prisma.websiteFormSubmission`: `id`, `formId String` + `form WebsiteForm @relation(fields: [formId], references: [id], onDelete: Restrict)`, `formKey String`, `requestHash String @db.VarChar(64)`, `hourBucket Int`, `status WebsiteSubmissionStatus @default(RECEIVED)`, `isTest Boolean @default(false)`, `tokenClass WebsiteTokenClass @default(WRITE)`, `locale String?`, `payloadJson Json`, `consentVersion String?`, `ipAddressHash String? @db.VarChar(64)`, `userAgent String?`, `captchaPassed Boolean?`, `captchaDegraded Boolean @default(false)`, `handlerResultJson Json?`, `createdEntityType String?`, `createdEntityId String?`, `error String? @db.Text`, `handledAt DateTime?`, `purgeAfter DateTime?`, `createdAt`, `updatedAt`; `@@unique([formKey, requestHash, hourBucket])` (Prisma compound-input name `formKey_requestHash_hourBucket`, P8 — Task 6 catches `P2002` on it and replays), `@@index([formId, createdAt])`, `@@index([status, createdAt])`, `@@index([isTest, createdAt])` (Task 4's ping and Task 10's drought cron read the newest non-test row), `@@index([purgeAfter])` (Task 10's purge cron).
  - `model WebsiteSubscriber` (`@@map("website_subscribers")`), `prisma.websiteSubscriber`: `id`, `email String @unique`, `locale String?`, `status WebsiteSubscriberStatus @default(PENDING)`, `confirmTokenHash String? @db.VarChar(64)`, `confirmExpiresAt DateTime?`, `confirmedAt DateTime?`, `unsubscribedAt DateTime?`, `consentVersion String?`, `ipAddressHash String? @db.VarChar(64)`, `createdAt`, `updatedAt`; `@@index([status])`, `@@index([confirmTokenHash])`. No `unsubscribeTokenHash` (RC12) — Task 9 verifies the one-click unsubscribe with a stateless HMAC over the subscriber id.
  - `Inquiry.contactName String?` (nullable; Task 5 wires DTOs, service, search, `Lead.contactPerson` and the frontend; Task 7's INQUIRY handler sets it).
  - `@jobsadmire/constants` (from `packages/constants/src/enums/website.enums.ts`, re-exported by `packages/constants/src/index.ts`): `export enum WebsiteFormKind`, `export enum WebsiteSubmissionStatus`, `export enum WebsiteSubscriberStatus`, `export enum WebsiteTokenClass` (string enums, key === value, member-for-member mirrors of the Prisma enums), `export const WEBSITE_FORM_KEYS = ['hire', 'contact', 'partner', 'careers', 'newsletter', 'callback', 'visit', 'calculator', 'fraud', 'workers'] as const`, `export type WebsiteFormKey = (typeof WEBSITE_FORM_KEYS)[number]`, `export const WEBSITE_FORM_KIND_BY_KEY: Record<WebsiteFormKey, WebsiteFormKind>` (`hire`/`contact`/`partner`/`workers` → `INQUIRY`, `callback` → `CALLBACK`, `visit` → `VISIT`, `calculator` → `CALCULATOR_QUOTE`, `careers` → `CAREERS_APPLY`, `fraud` → `FRAUD_REPORT`, `newsletter` → `NEWSLETTER`), `export function isWebsiteFormKey(v: string | undefined): v is WebsiteFormKey`. `NotificationType` / `ActivityType` are deliberately NOT mirrored (no module mirrors them; the backend reads them from `@prisma/client`).
  - Migration folder name `20260925120000_website_intake_door` — Task 12's docs guard reads the newest folder name (never pins a suffix), Task 13's gate record and the PRD §8 "Latest as of this revision" line name it verbatim (RC10).
  - PRD §8 count lines: `**9,173 lines, 193 models, 168 enums as of 2026-09-19**` and the per-domain sum ending `= 193` (RC10 — Task 12 re-anchors on these strings and adds prose only).

- [ ] **Step 1: Write the failing test**

A source-reading schema guard in the house style of `apps/backend/src/modules/whatsapp/wa-schema.spec.ts` (reads `schema.prisma` and the migration SQL; pins guards, additivity, ordering), plus the constants mirror imported for real through jest's `@jobsadmire/constants` mapping.

`apps/backend/src/modules/website/website-schema.spec.ts`:

```ts
/**
 * Source-reading schema guard for the WP3a website intake-door migration.
 *
 * Three things only a spec notices: (1) an enum value the runtime casts but
 * the database does not carry throws at INSERT — and ActivityLogger swallows
 * it; (2) a migration that is not guarded fails a prod deploy that already
 * saw a `db push`-ed column; (3) a folder named with today's date sorts BEFORE
 * migrations already applied in production (the calendar is behind the folder
 * names). The migration is shipped and pushed ALONE (rulings P12), so this
 * file is also the only test that runs against that commit.
 *
 * The constants are imported, not grepped: the four enums must mirror the
 * schema member for member (P13) and the form-key map is the ONE source every
 * later task and the frontend read (RC1).
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import {
  isWebsiteFormKey,
  WEBSITE_FORM_KEYS,
  WEBSITE_FORM_KIND_BY_KEY,
  WebsiteFormKind,
  WebsiteSubmissionStatus,
  WebsiteSubscriberStatus,
  WebsiteTokenClass,
} from '@jobsadmire/constants';

const PRISMA_DIR = join(__dirname, '../../../prisma');
const CONSTANTS_INDEX = join(__dirname, '../../../../../packages/constants/src/index.ts');
const MIGRATION = '20260925120000_website_intake_door';
const NEWEST_BEFORE = '20260925110000_platform_post_override_index';

const schema = readFileSync(join(PRISMA_DIR, 'schema.prisma'), 'utf8');

function migrationDir(): string {
  const dir = readdirSync(join(PRISMA_DIR, 'migrations')).find((f) => f.includes('website_intake_door'));
  if (!dir) throw new Error('migration containing "website_intake_door" not found');
  return dir;
}
const sql = () => readFileSync(join(PRISMA_DIR, 'migrations', migrationDir(), 'migration.sql'), 'utf8');

/** Members of `enum <name> { … }` in schema.prisma, comments stripped. */
function schemaEnumMembers(name: string): string[] {
  const start = schema.indexOf(`enum ${name} {`);
  if (start < 0) throw new Error(`enum ${name} not in schema.prisma`);
  const body = schema.slice(start, schema.indexOf('\n}', start));
  return body
    .split('\n')
    .slice(1)
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .filter(Boolean);
}

/** The block of `model <name> { … }` in schema.prisma. */
function modelBlock(name: string): string {
  const start = schema.indexOf(`model ${name} {`);
  if (start < 0) throw new Error(`model ${name} not in schema.prisma`);
  return schema.slice(start, schema.indexOf('\n}', start));
}

const hasColumn = (block: string, col: string) => new RegExp(`^\\s{2}${col}\\s`, 'm').test(block);

/** The four mirrored enums: the constants object IS the expected member list. */
const MIRRORED: Record<string, Record<string, string>> = {
  WebsiteFormKind,
  WebsiteSubmissionStatus,
  WebsiteSubscriberStatus,
  WebsiteTokenClass,
};

const SUBMISSION_COLUMNS = [
  'formId', 'formKey', 'requestHash', 'hourBucket', 'status', 'isTest', 'tokenClass', 'locale',
  'payloadJson', 'consentVersion', 'ipAddressHash', 'userAgent', 'captchaPassed', 'captchaDegraded',
  'handlerResultJson', 'createdEntityType', 'createdEntityId', 'error', 'handledAt', 'purgeAfter',
  'createdAt', 'updatedAt',
];

const CONFIG_SECRETS = ['writeTokenEnc', 'previousWriteTokenEnc', 'testTokenEnc', 'turnstileSecretEnc', 'revalidateSecretEnc'];

describe('WP3a website intake-door schema', () => {
  it('is named 20260925120000_website_intake_door and sorts after the newest migration that preceded it', () => {
    expect(migrationDir()).toBe(MIGRATION);
    expect(MIGRATION.slice(0, 14) > NEWEST_BEFORE.slice(0, 14)).toBe(true);
    expect(readdirSync(join(PRISMA_DIR, 'migrations'))).toContain(NEWEST_BEFORE);
  });

  it('declares the four website models with their snake_case table maps', () => {
    for (const [model, table] of [
      ['WebsiteIntegrationConfig', 'website_integration_config'],
      ['WebsiteForm', 'website_forms'],
      ['WebsiteFormSubmission', 'website_form_submissions'],
      ['WebsiteSubscriber', 'website_subscribers'],
    ] as const) {
      expect(modelBlock(model)).toContain(`@@map("${table}")`);
      expect(sql()).toContain(`CREATE TABLE IF NOT EXISTS "${table}"`);
    }
  });

  it('declares the four website enums, mirrored member for member in @jobsadmire/constants and guarded in the SQL', () => {
    for (const [name, mirror] of Object.entries(MIRRORED)) {
      const members = Object.values(mirror);
      for (const [key, value] of Object.entries(mirror)) expect({ name, key }).toEqual({ name, key: value });
      expect({ name, members: schemaEnumMembers(name) }).toEqual({ name, members });
      expect(sql()).toContain(`IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${name}')`);
      expect(sql()).toContain(`CREATE TYPE "${name}" AS ENUM (${members.map((m) => `'${m}'`).join(', ')})`);
    }
  });

  it('adds the two WEBSITE_* NotificationType members — declared, never cast', () => {
    for (const member of ['WEBSITE_FORM_RECEIVED', 'WEBSITE_FORMS_UNAVAILABLE']) {
      expect(schemaEnumMembers('NotificationType')).toContain(member);
      expect(sql()).toContain(`ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS '${member}';`);
    }
  });

  it('adds the three WEBSITE_SUBMISSION_* ActivityType members — ActivityLogger swallows an INSERT throw', () => {
    for (const member of ['WEBSITE_SUBMISSION_RECEIVED', 'WEBSITE_SUBMISSION_HANDLED', 'WEBSITE_SUBMISSION_FAILED']) {
      expect(schemaEnumMembers('ActivityType')).toContain(member);
      expect(sql()).toContain(`ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS '${member}';`);
    }
  });

  it('never consumes a freshly added enum value in the same migration (Postgres refuses it in one transaction)', () => {
    expect(sql()).not.toMatch(/\bINSERT\b/i);
    expect(sql()).not.toMatch(/\bUPDATE\s+"/i);
  });

  it('gives Inquiry a nullable contactName, guarded', () => {
    expect(modelBlock('Inquiry')).toMatch(/^\s{2}contactName\s+String\?/m);
    expect(sql()).toContain('ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "contactName" TEXT;');
  });

  it('keys submission dedupe on (formKey, requestHash, hourBucket) — one row per payload per hour', () => {
    expect(modelBlock('WebsiteFormSubmission')).toContain('@@unique([formKey, requestHash, hourBucket])');
    expect(sql()).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "website_form_submissions_formKey_requestHash_hourBucket_key" ON "website_form_submissions"("formKey", "requestHash", "hourBucket");',
    );
  });

  it('carries every submission column the rulings name, with tokenClass defaulting to WRITE', () => {
    const block = modelBlock('WebsiteFormSubmission');
    for (const col of SUBMISSION_COLUMNS) expect({ col, present: hasColumn(block, col) }).toEqual({ col, present: true });
    expect(block).toMatch(/^\s{2}requestHash\s+String\s+@db\.VarChar\(64\)/m);
    expect(block).toMatch(/^\s{2}ipAddressHash\s+String\?\s+@db\.VarChar\(64\)/m);
    expect(block).toMatch(/^\s{2}captchaDegraded\s+Boolean\s+@default\(false\)/m);
    expect(block).toMatch(/^\s{2}isTest\s+Boolean\s+@default\(false\)/m);
    expect(block).toMatch(/^\s{2}tokenClass\s+WebsiteTokenClass\s+@default\(WRITE\)/m);
    expect(sql()).toContain(`"tokenClass" "WebsiteTokenClass" NOT NULL DEFAULT 'WRITE'`);
    expect(block).toMatch(/form\s+WebsiteForm\s+@relation\(fields: \[formId\], references: \[id\], onDelete: Restrict\)/);
    expect(block).toContain('@@index([purgeAfter])');
    expect(block).toContain('@@index([isTest, createdAt])');
  });

  it('keeps WebsiteForm to key/kind/label/isActive — autoresponders are .hbs templates, not columns', () => {
    const block = modelBlock('WebsiteForm');
    expect(block).toMatch(/^\s{2}formKey\s+String\s+@unique/m);
    expect(block).toMatch(/^\s{2}kind\s+WebsiteFormKind\s*$/m);
    expect(block).toMatch(/^\s{2}isActive\s+Boolean\s+@default\(true\)/m);
    expect(block).not.toMatch(/autoresponder/i);
    expect(sql()).not.toMatch(/autoresponder/i);
  });

  it('stores every integration secret encrypted, nullable and write-only, with the previous-token window', () => {
    const block = modelBlock('WebsiteIntegrationConfig');
    for (const col of CONFIG_SECRETS) expect(block).toMatch(new RegExp(`^\\s{2}${col}\\s+String\\?\\s*$`, 'm'));
    expect(block).toMatch(/^\s{2}previousWriteTokenExpiresAt\s+DateTime\?/m);
    for (const col of ['secondHumanEmail', 'secondHumanName', 'lastTestedAt', 'lastTestOk', 'lastTestError', 'updatedById']) {
      expect({ col, present: hasColumn(block, col) }).toEqual({ col, present: true });
    }
    // No plaintext token column, ever.
    expect(block).not.toMatch(/^\s{2}(writeToken|testToken|turnstileSecret|revalidateSecret)\s/m);
  });

  it('gives WebsiteSubscriber a hashed double-opt-in token with expiry, the two consent timestamps and NO unsubscribe-token column', () => {
    const block = modelBlock('WebsiteSubscriber');
    expect(block).toMatch(/^\s{2}email\s+String\s+@unique/m);
    expect(block).toMatch(/^\s{2}confirmTokenHash\s+String\?\s+@db\.VarChar\(64\)/m);
    for (const col of ['confirmExpiresAt', 'confirmedAt', 'unsubscribedAt', 'consentVersion', 'ipAddressHash']) {
      expect({ col, present: hasColumn(block, col) }).toEqual({ col, present: true });
    }
    expect(block).not.toMatch(/^\s{2}confirmToken\s/m);
    // RC12: the one-click unsubscribe is a stateless HMAC — nothing to store.
    expect(block).not.toMatch(/unsubscribeTokenHash/);
    expect(sql()).not.toMatch(/unsubscribeTokenHash/);
  });

  it('is additive only and every DDL statement is guarded, so a db-pushed dev database replays it as a no-op', () => {
    const src = sql();
    expect(src).not.toMatch(/\bDROP\s+(TABLE|COLUMN|CONSTRAINT|TYPE|INDEX)\b/i);
    for (const m of src.matchAll(/CREATE (UNIQUE )?INDEX (?!IF NOT EXISTS)/g)) expect(m[0]).toBe('guarded');
    for (const m of src.matchAll(/CREATE TABLE (?!IF NOT EXISTS)/g)) expect(m[0]).toBe('guarded');
    for (const m of src.matchAll(/ADD COLUMN (?!IF NOT EXISTS)/g)) expect(m[0]).toBe('guarded');
    for (const m of src.matchAll(/ADD VALUE (?!IF NOT EXISTS)/g)) expect(m[0]).toBe('guarded');
    expect(src).toContain(`WHERE conname = 'website_form_submissions_formId_fkey'`);
  });

  it('exports the ten website form keys, in the website repo order, mapped onto the seven handler kinds', () => {
    expect([...WEBSITE_FORM_KEYS]).toEqual([
      'hire', 'contact', 'partner', 'careers', 'newsletter', 'callback', 'visit', 'calculator', 'fraud', 'workers',
    ]);
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
    // Every handler kind has at least one key; no key points at a kind the schema lacks.
    expect(new Set(Object.values(WEBSITE_FORM_KIND_BY_KEY))).toEqual(new Set(Object.values(WebsiteFormKind)));
    expect(isWebsiteFormKey('hire')).toBe(true);
    expect(isWebsiteFormKey('HIRE')).toBe(false);
    expect(isWebsiteFormKey('nope')).toBe(false);
    expect(isWebsiteFormKey(undefined)).toBe(false);
    expect(readFileSync(CONSTANTS_INDEX, 'utf8')).toContain(`export * from './enums/website.enums';`);
  });
});
```

Run: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website/website-schema.spec.ts --maxWorkers=2`

Expected failure: the suite does not run — ts-jest reports `TS2305: Module '"@jobsadmire/constants"' has no exported member 'isWebsiteFormKey'` (and the same for `WEBSITE_FORM_KEYS`, `WEBSITE_FORM_KIND_BY_KEY`, `WebsiteFormKind`, `WebsiteSubmissionStatus`, `WebsiteSubscriberStatus`, `WebsiteTokenClass`), `Test Suites: 1 failed, 1 total`. The schema/SQL cells are exercised only once the import compiles; after Step 3(g)+(h) alone they would fail with `Error: model WebsiteIntegrationConfig not in schema.prisma` / `migration containing "website_intake_door" not found`.

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/modules/website/website-schema.spec.ts --maxWorkers=2
```
Expected: `Test Suites: 1 failed, 1 total` with `error TS2305: Module '"@jobsadmire/constants"' has no exported member 'isWebsiteFormKey'.` as the first diagnostic.

- [ ] **Step 3: Implement**

**(a) `apps/backend/prisma/schema.prisma` — new enums.** Insert this block (46 lines, ending with one blank line) immediately BEFORE the line `// === Sales Pipeline enums ===`:

```prisma
// === Website (public intake door, WP3a 2026-09-19) enums ===
// Mirrored in packages/constants/src/enums/website.enums.ts — the inbox filters,
// the Integrations screen and the form catalog type against the mirror.
// Postgres cannot drop an enum member in place (PRD §8), so every member below
// is permanent.

/// What a public form's handler DOES with a submission. One kind per form row;
/// the ten website form keys collapse onto seven kinds (hire/contact/partner/
/// workers → INQUIRY). The key → kind map is WEBSITE_FORM_KIND_BY_KEY in
/// packages/constants.
enum WebsiteFormKind {
  INQUIRY
  CAREERS_APPLY
  NEWSLETTER
  FRAUD_REPORT
  CALLBACK
  VISIT
  CALCULATOR_QUOTE
}

/// RECEIVED = row written, handler not yet run (or running); HANDLED = handler
/// filed its entity (or dry-ran for a test token); FAILED = handler threw and
/// the inbox may re-run it while `createdEntityId` is still null; SPAM = a
/// human marked it.
enum WebsiteSubmissionStatus {
  RECEIVED
  HANDLED
  FAILED
  SPAM
}

enum WebsiteSubscriberStatus {
  PENDING
  CONFIRMED
  UNSUBSCRIBED
}

/// Which Bearer the marketing site presented (guard order write → test →
/// previous-write; the guard stamps the lower-case class, the forms core maps
/// it here on create). TEST submissions are `isTest` and dry-run the handler.
enum WebsiteTokenClass {
  WRITE
  TEST
  PREVIOUS_WRITE
}

```

**(b) `enum NotificationType`** — directly after the line `  WHATSAPP_INQUIRY_CAPTURED` (before the closing `}`) append:

```prisma
  // Website intake door (WP3a, 2026-09-19). Declared with the tables they
  // belong to: a value the runtime casts but the database does not carry
  // throws at INSERT. FORM_RECEIVED goes to the sales viewers of
  // `website.forms` (super-admins when nobody holds it); FORMS_UNAVAILABLE
  // carries a `reason` (captchaDegraded | tripped | untripped | drought |
  // handlerFailed). Both are mirrored to the second human on the config row.
  WEBSITE_FORM_RECEIVED
  WEBSITE_FORMS_UNAVAILABLE
```

**(c) `enum ActivityType`** — directly after the line `  CALL_CAMPAIGN_COMPLETED` (before the closing `}`) append:

```prisma
  // ── Website intake door (WP3a) ──
  /// Real members, never casts (the HRM lesson above): ActivityLogger.log()
  /// swallows the INSERT throw and the timeline silently goes empty.
  WEBSITE_SUBMISSION_RECEIVED
  WEBSITE_SUBMISSION_HANDLED
  WEBSITE_SUBMISSION_FAILED
```

**(d) `model Inquiry`** — directly after the line `  companyName     String?` (the one followed by `  country         String?`) insert:

```prisma
  /// Person's name as typed on the public website form (WP3a, 2026-09-19).
  /// Nullable so every existing door (WhatsApp AI, call centre, manual entry)
  /// is untouched; conversion copies it to `Lead.contactPerson`.
  contactName     String?
```

**(e) Append at the very end of `schema.prisma`** (after the closing `}` of `model WaCampaignRecipient`; the block starts with one blank line):

```prisma

// ============================================================
// WEBSITE — public intake door (WP3a, 2026-09-19). PRD §5.12 / §7.10.
// Phase B (CMS) models arrive in WP3c; nothing here depends on them.
// ============================================================

/// Singleton (the CallCenterConfig precedent: `findFirst` → `create({ data: {} })`,
/// DB-only, ENCRYPTION_KEY the only env dependency). `*Enc` = AES-256-GCM
/// iv:authTag:ciphertext hex via common/utils/encryption.util.ts; write-only,
/// stripped from every GET — the service's `publicShape()` returns has* flags.
model WebsiteIntegrationConfig {
  id                          String    @id @default(cuid())
  /// Bearer the marketing site presents on POST /website/v1/forms/:formKey.
  writeTokenEnc               String?
  /// Kept for one rotation window so a Vercel deploy still carrying the old
  /// token keeps writing; the guard drops it once `previousWriteTokenExpiresAt`
  /// has passed (the WaBusinessAccount previousAppSecret precedent).
  previousWriteTokenEnc       String?
  previousWriteTokenExpiresAt DateTime?
  /// Second token class: a submission carrying it is `isTest` — validated,
  /// captcha-checked, deduped and filed, but the handler DRY-RUNS.
  testTokenEnc                String?
  /// One Cloudflare Turnstile secret for both hostnames.
  turnstileSecretEnc          String?
  /// Presented by Operations to the website's revalidate route (Phase B); the
  /// column ships now so the rotate/has* shape is complete from day one.
  revalidateSecretEnc         String?
  /// Fallback human mailed directly (default mailbox) on EVERY website event —
  /// required by D25, no default, set on the Integrations screen.
  secondHumanEmail            String?
  secondHumanName             String?
  /// Result of the last "test" button run (GoogleWorkspaceConfig precedent).
  lastTestedAt                DateTime?
  lastTestOk                  Boolean?
  lastTestError               String?   @db.Text
  /// Soft reference (no FK) — who last saved; survives user deletion.
  updatedById                 String?
  createdAt                   DateTime  @default(now())
  updatedAt                   DateTime  @updatedAt

  @@map("website_integration_config")
}

/// One row per public form key (`hire`, `contact`, `partner`, `careers`,
/// `newsletter`, `callback`, `visit`, `calculator`, `fraud`, `workers`). The
/// handler is chosen by `kind`; `isActive=false` makes the door answer 404 for
/// that key (the newsletter ships inactive until counsel clears it — D14; in
/// WP3a the flag is flipped by SQL only, there is no route for it). No
/// autoresponder columns: the autoresponders are `.hbs` templates per form
/// and language (P9), not rows.
model WebsiteForm {
  id        String          @id @default(cuid())
  /// URL segment on the public door: POST /website/v1/forms/:formKey.
  formKey   String          @unique
  kind      WebsiteFormKind
  label     String
  isActive  Boolean         @default(true)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  submissions WebsiteFormSubmission[]

  @@map("website_forms")
}

/// The record of ONE public submission. Written FIRST (before the handler), so
/// a retry hits the dedupe key and replays the prior result instead of filing
/// twice; after the handler nothing may throw. Holds PII (`payloadJson`) —
/// the purge cron deletes rows past `purgeAfter` (90 days after HANDLED).
model WebsiteFormSubmission {
  id                String                  @id @default(cuid())
  formId            String
  form              WebsiteForm             @relation(fields: [formId], references: [id], onDelete: Restrict)
  /// Denormalised so the dedupe key stays stable if the form row is ever re-keyed.
  formKey           String
  /// sha256 of the canonical payload; with `hourBucket`, the same payload inside
  /// one hour is ONE row (the WaAiToolCall `requestHash` precedent).
  requestHash       String                  @db.VarChar(64)
  /// floor(receivedAt / 1h) in epoch hours.
  hourBucket        Int
  status            WebsiteSubmissionStatus @default(RECEIVED)
  /// True when the TEST token class was presented: filed, never handled for real.
  isTest            Boolean                 @default(false)
  /// The Bearer class the guard matched, mapped from its lower-case stamp
  /// (`write` → WRITE, `test` → TEST, `previous-write` → PREVIOUS_WRITE).
  tokenClass        WebsiteTokenClass       @default(WRITE)
  /// Website locale of the page that posted (`tr` | `en`).
  locale            String?
  payloadJson       Json
  /// The privacy/consent text version the visitor accepted (D11).
  consentVersion    String?
  /// sha256(IP_HASH_SALT + ':' + ip) — never the address itself.
  ipAddressHash     String?                 @db.VarChar(64)
  userAgent         String?
  /// null = Turnstile not checked (secret missing / unreachable); true/false = verdict.
  captchaPassed     Boolean?
  /// Accepted WITHOUT a captcha verdict because the captcha infrastructure was
  /// down (D11). Needs-attention in the inbox; counted by no abuse trip.
  captchaDegraded   Boolean                 @default(false)
  /// The handler's result per attempt (`{ attempts: [...] }`; re-runs append).
  handlerResultJson Json?
  /// Where the handler filed it — 'inquiry' | 'applicant' | 'subscriber' |
  /// 'object' + id (FK-less, resolved at read time).
  createdEntityType String?
  createdEntityId   String?
  error             String?                 @db.Text
  handledAt         DateTime?
  /// Set when HANDLED (+90 days); the 04:30 purge cron deletes the row and any
  /// `website-fraud/` object its payload names.
  purgeAfter        DateTime?
  createdAt         DateTime                @default(now())
  updatedAt         DateTime                @updatedAt

  @@unique([formKey, requestHash, hourBucket])
  @@index([formId, createdAt])
  @@index([status, createdAt])
  @@index([isTest, createdAt])
  @@index([purgeAfter])
  @@map("website_form_submissions")
}

/// Newsletter double opt-in (P4). Only the sha256 of the confirm token is
/// stored (the OTP-hash precedent); the plain token travels once, in the
/// confirm mail. The one-click unsubscribe link (RFC 8058) is a stateless
/// HMAC over the subscriber id, so there is NO unsubscribe-token column.
model WebsiteSubscriber {
  id               String                  @id @default(cuid())
  email            String                  @unique
  locale           String?
  status           WebsiteSubscriberStatus @default(PENDING)
  /// sha256 of the confirm token — never the token itself.
  confirmTokenHash String?                 @db.VarChar(64)
  confirmExpiresAt DateTime?
  confirmedAt      DateTime?
  unsubscribedAt   DateTime?
  /// The consent text version accepted at sign-up.
  consentVersion   String?
  /// sha256(IP_HASH_SALT + ':' + ip) at sign-up — consent evidence, never the address.
  ipAddressHash    String?                 @db.VarChar(64)
  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt

  @@index([status])
  @@index([confirmTokenHash])
  @@map("website_subscribers")
}
```

The five blocks are already in `prisma format` layout (verified against `npx prisma format` on a scratch copy, 2026-09-19) — do not re-run `prisma format` on the file, it would realign unrelated models the repo has never formatted. After the five edits: `wc -l apps/backend/prisma/schema.prisma` prints `9173`, `grep -c '^model ' …` prints `193`, `grep -c '^enum ' …` prints `168`; `DATABASE_URL=postgresql://u:p@localhost:5432/d npx prisma validate --schema prisma/schema.prisma` (from `apps/backend`) prints `The schema at prisma/schema.prisma is valid`.

**(f) Migration** `apps/backend/prisma/migrations/20260925120000_website_intake_door/migration.sql` (the folder prefix `20260925120000` sorts after `20260925110000_platform_post_override_index` — P12/RC10; a calendar-dated `20260919…` name would sort BEFORE migrations production has already applied). Every statement below is byte-compatible with what `prisma migrate diff --from-empty --to-schema-datamodel` generates for these models (types, defaults, index and constraint names), with the repo's guards added:

```sql
-- Website programme WP3a — the public intake door's tables (written 2026-09-19).
--
-- Sorts after 20260925110000_platform_post_override_index, which is what a
-- fresh database replays in folder order (the folder names run ahead of the
-- calendar; a 20260919… name would land BEFORE migrations production has
-- already applied).
--
-- FULLY ADDITIVE, and shipped in its OWN commit, pushed and verified alone
-- before any code that selects these columns (rulings P12 / spec D24). Four
-- new enums, two NotificationType values, three ActivityType values, one
-- nullable column on `inquiries`, four new tables with their indexes and one
-- foreign key. Nothing is dropped, nothing is rewritten, nothing is inserted.
--
-- Every statement is guarded (`IF NOT EXISTS`, pg_type / pg_constraint
-- checks) so a database that already carries part of this from a local
-- `prisma db push` replays it as a no-op instead of failing the deploy.
-- `ADD VALUE IF NOT EXISTS` is not consumed anywhere in this file: Postgres
-- refuses to USE a freshly added enum value inside the transaction that
-- added it.
--
-- Ordering is the house order: ADD VALUE IF NOT EXISTS -> CREATE TYPE ->
-- ALTER TABLE ADD COLUMN -> CREATE TABLE -> CREATE INDEX -> ADD CONSTRAINT.

-- ---------------------------------------------------------------------------
-- 1. Enum values on existing types (never cast in code — declared here first)
-- ---------------------------------------------------------------------------

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'WEBSITE_FORM_RECEIVED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'WEBSITE_FORMS_UNAVAILABLE';

-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'WEBSITE_SUBMISSION_RECEIVED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'WEBSITE_SUBMISSION_HANDLED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'WEBSITE_SUBMISSION_FAILED';

-- ---------------------------------------------------------------------------
-- 2. New enum types
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WebsiteFormKind') THEN
    CREATE TYPE "WebsiteFormKind" AS ENUM ('INQUIRY', 'CAREERS_APPLY', 'NEWSLETTER', 'FRAUD_REPORT', 'CALLBACK', 'VISIT', 'CALCULATOR_QUOTE');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WebsiteSubmissionStatus') THEN
    CREATE TYPE "WebsiteSubmissionStatus" AS ENUM ('RECEIVED', 'HANDLED', 'FAILED', 'SPAM');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WebsiteSubscriberStatus') THEN
    CREATE TYPE "WebsiteSubscriberStatus" AS ENUM ('PENDING', 'CONFIRMED', 'UNSUBSCRIBED');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WebsiteTokenClass') THEN
    CREATE TYPE "WebsiteTokenClass" AS ENUM ('WRITE', 'TEST', 'PREVIOUS_WRITE');
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 3. inquiries.contactName — the person's name as typed on the website form
-- ---------------------------------------------------------------------------
--
-- Nullable: every existing door (WhatsApp AI, call centre, manual entry) keeps
-- writing exactly what it wrote yesterday.

ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "contactName" TEXT;

-- ---------------------------------------------------------------------------
-- 4. website_integration_config — the singleton, secrets encrypted
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "website_integration_config" (
    "id" TEXT NOT NULL,
    "writeTokenEnc" TEXT,
    "previousWriteTokenEnc" TEXT,
    "previousWriteTokenExpiresAt" TIMESTAMP(3),
    "testTokenEnc" TEXT,
    "turnstileSecretEnc" TEXT,
    "revalidateSecretEnc" TEXT,
    "secondHumanEmail" TEXT,
    "secondHumanName" TEXT,
    "lastTestedAt" TIMESTAMP(3),
    "lastTestOk" BOOLEAN,
    "lastTestError" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_integration_config_pkey" PRIMARY KEY ("id")
);

-- ---------------------------------------------------------------------------
-- 5. website_forms — one row per public form key (seeded by prisma/seed.ts;
--    `isActive` is flipped by SQL only in WP3a)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "website_forms" (
    "id" TEXT NOT NULL,
    "formKey" TEXT NOT NULL,
    "kind" "WebsiteFormKind" NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_forms_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "website_forms_formKey_key" ON "website_forms"("formKey");

-- ---------------------------------------------------------------------------
-- 6. website_form_submissions — one row per submission, written before the
--    handler; (formKey, requestHash, hourBucket) is the dedupe key
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "website_form_submissions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "formKey" TEXT NOT NULL,
    "requestHash" VARCHAR(64) NOT NULL,
    "hourBucket" INTEGER NOT NULL,
    "status" "WebsiteSubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
    "isTest" BOOLEAN NOT NULL DEFAULT false,
    "tokenClass" "WebsiteTokenClass" NOT NULL DEFAULT 'WRITE',
    "locale" TEXT,
    "payloadJson" JSONB NOT NULL,
    "consentVersion" TEXT,
    "ipAddressHash" VARCHAR(64),
    "userAgent" TEXT,
    "captchaPassed" BOOLEAN,
    "captchaDegraded" BOOLEAN NOT NULL DEFAULT false,
    "handlerResultJson" JSONB,
    "createdEntityType" TEXT,
    "createdEntityId" TEXT,
    "error" TEXT,
    "handledAt" TIMESTAMP(3),
    "purgeAfter" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_form_submissions_pkey" PRIMARY KEY ("id")
);

-- The dedupe key: the same canonical payload on the same form inside one hour
-- is ONE row; a retry gets the prior result replayed (P2002 -> replay).
CREATE UNIQUE INDEX IF NOT EXISTS "website_form_submissions_formKey_requestHash_hourBucket_key" ON "website_form_submissions"("formKey", "requestHash", "hourBucket");

CREATE INDEX IF NOT EXISTS "website_form_submissions_formId_createdAt_idx" ON "website_form_submissions"("formId", "createdAt");

CREATE INDEX IF NOT EXISTS "website_form_submissions_status_createdAt_idx" ON "website_form_submissions"("status", "createdAt");

-- `ping.lastSubmissionAt` and the lead-drought cron read the newest NON-test
-- row; without this the synthetic lead every 30 minutes would mask a drought.
CREATE INDEX IF NOT EXISTS "website_form_submissions_isTest_createdAt_idx" ON "website_form_submissions"("isTest", "createdAt");

-- The 04:30 purge cron's only predicate.
CREATE INDEX IF NOT EXISTS "website_form_submissions_purgeAfter_idx" ON "website_form_submissions"("purgeAfter");

-- RESTRICT, never CASCADE: a form row cannot be deleted while it has history.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'website_form_submissions_formId_fkey'
  ) THEN
    ALTER TABLE "website_form_submissions"
      ADD CONSTRAINT "website_form_submissions_formId_fkey"
      FOREIGN KEY ("formId") REFERENCES "website_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 7. website_subscribers — newsletter double opt-in, confirm-token HASH only
--    (the one-click unsubscribe is a stateless HMAC; no column for it)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "website_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT,
    "status" "WebsiteSubscriberStatus" NOT NULL DEFAULT 'PENDING',
    "confirmTokenHash" VARCHAR(64),
    "confirmExpiresAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "consentVersion" TEXT,
    "ipAddressHash" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_subscribers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "website_subscribers_email_key" ON "website_subscribers"("email");

CREATE INDEX IF NOT EXISTS "website_subscribers_status_idx" ON "website_subscribers"("status");

CREATE INDEX IF NOT EXISTS "website_subscribers_confirmTokenHash_idx" ON "website_subscribers"("confirmTokenHash");
```

**(g) `packages/constants/src/enums/website.enums.ts`** (new — the mirror rule at `schema.prisma:12` and the RC1 single source of the form keys; `NotificationType`/`ActivityType` are deliberately NOT mirrored, same as every other module):

```ts
/**
 * Website module (public intake door, PRD §5.12) — mirrors of the four
 * `Website*` enums in `apps/backend/prisma/schema.prisma` plus the form-key →
 * handler map that the intake service, the `WebsiteForm` seed, the inbox
 * filter and the website's contract all share (WP3a, 2026-09-19).
 *
 * House rule: the DATABASE is the source of truth; this file is the copy the
 * browser can read. `apps/backend/src/modules/website/website-schema.spec.ts`
 * pins the enums member for member and the key list against the schema.
 */

/** Which handler a public form key dispatches to (P4). */
export enum WebsiteFormKind {
  INQUIRY = 'INQUIRY',
  CAREERS_APPLY = 'CAREERS_APPLY',
  NEWSLETTER = 'NEWSLETTER',
  FRAUD_REPORT = 'FRAUD_REPORT',
  CALLBACK = 'CALLBACK',
  VISIT = 'VISIT',
  CALCULATOR_QUOTE = 'CALCULATOR_QUOTE',
}

/** Lifecycle of one `WebsiteFormSubmission` row (P8): written FIRST, then handled. */
export enum WebsiteSubmissionStatus {
  RECEIVED = 'RECEIVED',
  HANDLED = 'HANDLED',
  FAILED = 'FAILED',
  SPAM = 'SPAM',
}

/** Double opt-in state of a newsletter subscriber (P4, D14). */
export enum WebsiteSubscriberStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

/**
 * The Bearer class a submission was accepted under (P7). The guard stamps the
 * lower-case wire form (`write` | `test` | `previous-write`); the forms core
 * maps it to this enum when it writes the row.
 */
export enum WebsiteTokenClass {
  WRITE = 'WRITE',
  TEST = 'TEST',
  PREVIOUS_WRITE = 'PREVIOUS_WRITE',
}

/**
 * The ten public form keys — the URL segment of `POST /api/website/v1/forms/:formKey`.
 * Mirrors `FORM_KEYS` in jobsadmire-website `src/analytics/forms.ts`, in that
 * order (the repos share no package; a key added on either side without the
 * other is a 404 at the door, which is the failure the schema spec pins).
 */
export const WEBSITE_FORM_KEYS = [
  'hire',
  'contact',
  'partner',
  'careers',
  'newsletter',
  'callback',
  'visit',
  'calculator',
  'fraud',
  'workers',
] as const;
export type WebsiteFormKey = (typeof WEBSITE_FORM_KEYS)[number];

/** Form key → handler kind. Four keys share the INQUIRY handler (each tags `messagePreview` with its own key). */
export const WEBSITE_FORM_KIND_BY_KEY: Record<WebsiteFormKey, WebsiteFormKind> = {
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
};

/** Type guard for a path/query value; case-sensitive, like the door. */
export function isWebsiteFormKey(v: string | undefined): v is WebsiteFormKey {
  return v !== undefined && (WEBSITE_FORM_KEYS as readonly string[]).includes(v);
}
```

**(h) `packages/constants/src/index.ts`** — directly after the line `export * from './enums/projects.enums';` add:

```ts
export * from './enums/website.enums';
```

No Dockerfile change: `packages/constants` is already built in all four Dockerfiles (its `dist/` is what the production image resolves; the source `types` path is what `tsc` and jest resolve).

**(i) `docs/PRD.md` §8** (seven small edits; P13/RC10/RC29 — this task owns the §8 count lines and the code-block comment tails, Task 12 adds §5.12/§7.10 prose and does not touch these strings; Task 1 owns the permission-count lines elsewhere in the PRD; §12.3's historical W4 sentence stays as history):

1. Replace the sentence fragment `**8,870 lines, 188 models, 164 enums as of 2026-09-15**` (in the line beginning `The full schema lives in`) with `**9,173 lines, 193 models, 168 enums as of 2026-09-19**`.
2. In the bash block directly below it, replace the four comment tails (RC29): `# models (188)` → `# models (193)`; `# enums  (164)` → `# enums  (168)`; `# migration dirs (162 + migration_lock.toml)` → `# migration dirs (168 + migration_lock.toml)` (167 folders before this task, 168 after); `# backend modules (31)` → `# backend modules (32)` (Task 1's `apps/backend/src/modules/website/` is the 32nd directory — `ls apps/backend/src/modules/ | wc -l` prints `32` on this branch).
3. Replace `Latest as of this revision: \`20260921103000_remove_legacy_training\`.` with `Latest as of this revision: \`20260925120000_website_intake_door\` (folder names run ahead of the calendar — a new migration must sort AFTER this one, not after today's date).`
4. Replace the sentence `Re-derived from \`grep '^model ' apps/backend/prisma/schema.prisma\` (2026-09-15) and grouped by domain. Every one of the 188 models is accounted for below (5+6+9+17+22+16+5+6+3+27+16+35+7+14 = 188).` with `Re-derived from \`grep '^model ' apps/backend/prisma/schema.prisma\` (2026-09-19) and grouped by domain. Every one of the 193 models is accounted for below (6+6+9+17+22+16+5+6+3+27+16+35+7+14+4 = 193).`
5. In the bullet beginning `- **Auth / users / permissions** (5): \`User\`, \`Role\`, \`RolePermission\`, \`UserAdditionalRole\` (multi-role, shipped 2026-08-20 — §4.4), \`GoogleOAuthConnection\`.` change `(5)` to `(6)` and insert `` `UserPermissionOverride` (per-user allow/block overrides, §4.4), `` directly before `` `GoogleOAuthConnection`. `` — it was the one model missing from the list (the W3 override table shipped without a §8 row; 188 listed vs 189 in the schema).
6. Directly after the bullet beginning `- **Sales Training Academy** (14, §5.6a):` add this bullet:
   ```
   - **Website — public intake door** (4, §5.12/§7.10, WP3a 2026-09-19): `WebsiteIntegrationConfig` (singleton; write/previous-write/test/Turnstile/revalidate secrets as `*Enc` write-only columns surfaced as `has*` flags, `previousWriteTokenExpiresAt` rotation window, second-human fallback recipient, `lastTested*` triple), `WebsiteForm` (one row per public form key, seeded from `WEBSITE_FORM_KEYS`; `kind` picks the handler; `isActive=false` = 404 for that key, flipped by SQL only in WP3a; no autoresponder columns — autoresponders are `.hbs` per form and language), `WebsiteFormSubmission` (written BEFORE the handler; dedupe `@@unique([formKey, requestHash, hourBucket])`; `isTest` + `tokenClass @default(WRITE)`, `captchaPassed`/`captchaDegraded`, `handlerResultJson` per attempt, FK-less `createdEntityType/Id`, `purgeAfter` — PII, purged 90 days after HANDLED; FK to `WebsiteForm` is RESTRICT), `WebsiteSubscriber` (double opt-in; confirm token stored as a sha256 HASH only; the RFC 8058 one-click unsubscribe is a stateless HMAC, so no unsubscribe-token column). `Inquiry.contactName` was added with them. Phase B CMS models follow in WP3c.
   ```
7. Under `### Enum notes`, directly after the bullet beginning `- **\`InternalApplicantStage\`'s legacy training-track debt is PAID (2026-09-14).**`, add:
   ```
   - **`WEBSITE_*` values** (2026-09-19, migration `20260925120000_website_intake_door`): `NotificationType.WEBSITE_FORM_RECEIVED` / `WEBSITE_FORMS_UNAVAILABLE` and `ActivityType.WEBSITE_SUBMISSION_RECEIVED` / `_HANDLED` / `_FAILED` were added via `ADD VALUE IF NOT EXISTS` in the migration commit that ships alone, one deploy before any code reads them; the four `Website*` enums (`WebsiteFormKind`, `WebsiteSubmissionStatus`, `WebsiteSubscriberStatus`, `WebsiteTokenClass`) are mirrored in `packages/constants/src/enums/website.enums.ts` next to `WEBSITE_FORM_KEYS` / `WEBSITE_FORM_KIND_BY_KEY`, the one source of the ten form keys.
   ```

- [ ] **Step 4: Run tests**

Spec (host):
```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/modules/website/website-schema.spec.ts --maxWorkers=2
```
Expected: `Tests: 14 passed, 14 total`.

In-container verification (P12 — the dev stack only; one Docker stack at a time; NEVER `prisma migrate dev`, NEVER `db push`; the dev container's WORKDIR is `/app/apps/backend` and `./apps/backend/prisma` is bind-mounted, so the new folder is already inside):
```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
docker compose up -d postgres redis backend          # skip if the dev stack is already up
docker compose exec -T backend npx prisma migrate deploy --schema=prisma/schema.prisma
```
Expected: `Applying migration \`20260925120000_website_intake_door\`` … `All migrations have been successfully applied.`
```bash
docker compose exec -T backend npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma --exit-code; echo "exit=$?"
```
Expected: `No difference detected.` and `exit=0` (exit 2 = the SQL and the schema disagree — fix the SQL, never the drift). If the output lists pre-existing drift only (the orphan `LanguagePreference` type or array-column defaults from `ops_init`), that is the known baseline, not this migration — but any line naming a `website_*` table, `inquiries.contactName` or a `WEBSITE_*` value must be fixed before committing.
```bash
# Replay proves every guard: a second run must be a no-op, not an error.
docker compose exec -T postgres psql -U jobsadmire -d jobsadmire_ops_dev -v ON_ERROR_STOP=1 \
  < apps/backend/prisma/migrations/20260925120000_website_intake_door/migration.sql
```
Expected: exit 0; `NOTICE:  relation "website_forms" already exists, skipping` lines and `ALTER TYPE` / `DO` / `CREATE TABLE` / `CREATE INDEX` echoes, no `ERROR`.
```bash
docker compose exec -T backend npx prisma generate --schema=prisma/schema.prisma
cd apps/backend && npx prisma generate && cd ../..
npm run type-check --workspace=packages/constants
npm run type-check --workspace=apps/backend
```
Expected: `Generated Prisma Client` twice; both `tsc --noEmit` runs exit 0 (no source references the new models yet; the constants file compiles on its own). Run them one after the other, never in parallel (Mac Studio memory rule). Then the neighbouring guard suites, which read `Object.values(NotificationType)`, the seed ↔ registry pairing and the migrations folder, and must stay green with the new members present:
```bash
cd apps/backend
npx jest src/modules/notifications/event-registry-coverage.spec.ts src/modules/whatsapp/wa-schema.spec.ts src/modules/notifications/module-notification-seed.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2
```
Expected: all passed (the coverage spec only guards `WHATSAPP_*`; the `WEBSITE_*` clause and the registry entries are Task 10's; the seed spec compares `MODULE_NOTIFICATION_SEED` to `eventsForModule`, which this commit does not change).

- [ ] **Step 5: Commit** (the migration is its OWN commit — P12; exactly these six files, nothing from any other task)

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git add apps/backend/prisma/schema.prisma \
        apps/backend/prisma/migrations/20260925120000_website_intake_door/migration.sql \
        apps/backend/src/modules/website/website-schema.spec.ts \
        packages/constants/src/enums/website.enums.ts packages/constants/src/index.ts \
        docs/PRD.md
git commit -m "feat(website): WP3a Prisma subset — intake-door tables, Inquiry.contactName, WEBSITE_* events, constants mirror

Migration 20260925120000_website_intake_door, additive and fully guarded,
shipped alone one deploy ahead of the code that reads it (rulings P12):
WebsiteIntegrationConfig (secrets *Enc, previous-token window, second human),
WebsiteForm, WebsiteFormSubmission (@@unique formKey+requestHash+hourBucket,
isTest/tokenClass default WRITE, captchaDegraded, handlerResultJson,
purgeAfter), WebsiteSubscriber (confirm-token hash; unsubscribe is a
stateless HMAC), Inquiry.contactName, NotificationType
WEBSITE_FORM_RECEIVED/WEBSITE_FORMS_UNAVAILABLE and three ActivityType
WEBSITE_SUBMISSION_* members. The four Website enums plus WEBSITE_FORM_KEYS /
WEBSITE_FORM_KIND_BY_KEY / isWebsiteFormKey live in packages/constants (the
one source for the door, the seed, the inbox and the frontend);
website-schema.spec pins guards, ordering and the mirror; PRD §8 counts +
latest-migration line.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git show --stat HEAD   # exactly 6 files
```

Branch order (RC14): this commit sits after Task 1's and Task 2's commits in the WP3a branch history. P12's "pushed and verified alone" is satisfied by Task 13 §D, which cherry-picks THIS commit onto a branch from `origin/main` and pushes that first (`git branch -f wp3a-migration-only origin/main && git cherry-pick <this sha> && git push origin HEAD:main`), watches `deploy.log` for `Applying migration \`20260925120000_website_intake_door\`` and an unchanged drift gate, then rebases the code commits on top — the expected path, not a fallback. Nothing in this commit is read by the code running in production at that moment, which is what makes the old containers safe on the new schema.

---

---

