### Task 8: Operations catalog extension — catalog v1.1 (`city`, `partner.track`, `contact.topic`, `careers.portfolioUrl`) + the §5.12 doc sync (W46)

> **Repo: OPERATIONS, not the website — and a THIRD Ops worktree (W47).** Every path below is under `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog`, a worktree Step 0 creates from the Ops main checkout (`/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations`) on the new branch `website/catalog-ext` off `origin/main` (`7ea2a93`). The shared worktree `jobsadmire-operations-website` stays on `website/wp3a-intake @ 6de20cb` and is never switched (the "never switch the shared branch" rule). NestJS 10 backend at `apps/backend`. Rulings in force: W3 (the retry rule the PRD must now state), W16 (the field list; "shipped behind the still-off flag; no migration"), W22 (this task belongs to the WP2a plan), **W46** (sync PRD §5.12: the W3 retry sentence, the `sourcePath`-is-not-hashed heartbeat note, the I12 click-only rule), **W47** (third worktree), **W48** (callback test base), **W56** (`Opening.portfolioRequired` stays as it is). Operations' own rules: `CLAUDE.md` "Task completion workflow" (type-check + jest, PRD in the same change set, push = deploy, verify by artifact), PRD §5.12 (catalog = the forms contract, visitor validation lives in the catalog before the row, handlers never throw for visitor errors), planning ruling P13 (docs land in the same change set — pinned by `website-docs-guard.spec.ts`), the Mac memory rule (one jest/tsc/Docker job at a time, `--maxWorkers=2`). It runs LAST in WP2a (plan header task order) because its push is a production deploy.
>
> **What this task is.** The website's designed forms collect four things the WP3a door has no field for (as-built note "traps": `city` is silently dropped by five inquiry forms; the Partner page's sourcing/institute tracks and the Contact page's topic chips have nowhere to go; a portfolio link cannot be sent). Catalog v1.1 adds them as OPTIONAL fields — an older website build that never sends them is unaffected — threads them into what staff see (the inquiry `messagePreview` tag / subject line / a preview line; the applicant's cover letter), keeps every classification rule as it is, adds no column, no migration, no permission key. `PERMISSION_KEYS_HASH` (`packages/permissions/src/keys.catalog.ts:188`, `ba5427d7b0688c2b783cd58f3a21d384878363a4`) must be byte-identical at the end — asserted in Cycle 7. Cycle 6 also lands the three §5.12 corrections Task 2 handed over (W46), so the two repos' docs agree on the retry contract after WP2a.
>
> **What this task deliberately does NOT do (W56).** It does not relax the `Opening.portfolioRequired` gate in `CareersPublicService.apply()` (`apps/backend/src/modules/careers-public/careers-public.service.ts:618-619`, `if (opening.portfolioRequired && portfolio.length === 0) throw new BadRequestException('This position requires at least one portfolio document')`) — that gate wants an uploaded `careers-portfolio/` document (PRD §5.4/§6.5 owner rule) and W56 keeps it as it is (owner decision pending). `portfolioUrl` is validated, stored and shown; a portfolio-required opening still answers `status: 'FAILED'` + `error` through the door (HTTP 200, RC26), so the website (T11 Careers) keeps W3's "apply by e-mail" branch for those openings and sends `portfolioUrl` on the others. W16's "so portfolio openings can be applied to" is read accordingly.

**Files** (all under `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog`):
- Create: none (no migration, no new module file, no new spec file).
- Modify:
  - `apps/backend/src/modules/website/website-form-catalog.ts` (whole file replaced; 242 lines on `origin/main`)
  - `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts` (whole file replaced; 84 lines)
  - `apps/backend/src/modules/website/handlers/careers-apply.logic.ts` (whole file replaced; 107 lines)
  - `docs/PRD.md` §5.12 (three handler-table rows amended; a v1.1 field table after the handler table; the heartbeat sentence, the Idempotency retry sentence and the "Every deploy" gotcha rewritten per W46; an I12 gotcha and a v1.1 gotcha added) and §12.2 (one changelog entry) — all anchored on sentences (W45)
- Test (append only; the closing `});` of each file is its last line):
  - `apps/backend/src/modules/website/website-form-catalog.spec.ts` (130 lines, 11 tests → one new `describe` with 5 tests)
  - `apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts` (66 lines, 6 tests → +1)
  - `apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts` (85 lines, 6 tests → +4)
  - `apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts` (97 lines, 5 tests → +1)
  - `apps/backend/src/modules/website/handlers/careers-apply.logic.spec.ts` (90 lines, 5 tests → +1)
  - `apps/backend/src/modules/website/website-docs-guard.spec.ts` (242 lines, 18 tests → +2)
  - `apps/backend/test/permissions/repo-invariants.spec.ts` (run only — the `PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` assertion at lines 549–555)
- Not touched (asserted in Cycle 7 with `git diff --stat origin/main -- <paths>` → empty): `packages/permissions/**`, `packages/constants/**` (`WEBSITE_FORM_KEYS` stays the same ten keys), `apps/backend/prisma/**`, `CLAUDE.md` (no count changes: still 23 modules + 62 resources = 85 keys, ten form keys, six public routes), `docs/DEPLOYMENT.md` (no env/cron/compose/flip change), `apps/backend/src/modules/careers-public/**` (W56), `apps/backend/src/modules/website/dto/website-form-submit.dto.ts` (the envelope DTO is unchanged — `fields` passes through and the catalog whitelists inside it), `apps/backend/src/modules/website/handlers/careers-apply.handler.ts` and `website-inquiry.handler.ts` (they already hand the whole `fields` map to the logic functions).

**Interfaces:**
- Consumes (WP3a as built on `origin/main` 7ea2a93 — verified, used unchanged):
  - `WEBSITE_FORM_CATALOG: Record<WebsiteFormKey, WebsiteFormSpec>`, `WebsiteFieldSpec { max: number; min?: number; required?: boolean; type?: WebsiteFieldType; values?: readonly string[]; pattern?: RegExp; maxItems?: number }`, `websiteFormSpec(formKey: string): WebsiteFormSpec | null`, `normalizeWebsiteFields(formKey: string, raw: unknown): NormalizedFields` where `NormalizedFields = { ok: true; fields: Record<string, WebsiteFieldValue>; dropped: string[] } | { ok: false; errors: string[] }` — `apps/backend/src/modules/website/website-form-catalog.ts` (whitelist + normalise inside `fields`; unknown keys dropped, errors collected, all reasons at once → the door's 400 `{ message: 'Invalid form fields', errors }`).
  - `WebsiteFormHandlerInput { submissionId: string; formKey: string; kind: WebsiteFormKind; locale: WebsiteLocale; dryRun: boolean; fields: Record<string, WebsiteFieldValue>; consentVersion: string; captchaDegraded: boolean; visitorIp: string | null; userAgent: string | null }` — `apps/backend/src/modules/website/website-form-handler.ts:12-26`.
  - `buildWebsiteInquiryDto(input: WebsiteFormHandlerInput, now?: Date): CreateInquiryDto` — `handlers/website-inquiry.logic.ts:58` (`CreateInquiryDto` has NO `city`/`subject`/`topic` column: `sales/dto/create-inquiry.dto.ts` = source, date, phoneNumber, email, companyName, contactName, country, language, messagePreview, classification, assignedTeam, notes).
  - `buildPublicApplyDto(fields: Record<string, string | string[]>, cvUrl: string): PublicApplyDto`, `validatePublicApplyDto(dto: PublicApplyDto): Promise<{ dropped: string[]; errors: string[] }>`, `DROPPABLE_APPLY_FIELDS`, `WEBSITE_CAREERS_SOURCE_DETAIL`, `WEBSITE_CV_KEY_PATTERN` — `handlers/careers-apply.logic.ts` (`PublicApplyDto.coverLetter` is `@IsOptional() @IsString()` with NO `MaxLength` — `careers-public/dto/careers-public.dto.ts:130`; `InternalApplicant.coverLetter String? @db.Text` — `prisma/schema.prisma:3198`; there is no `portfolioUrl` on either).
  - `requestHashFor({ formKey, isTest, honeypot, locale, fields })` — `website-forms.logic.ts:26-31`: sha256 over those five, `fields` = the catalog's NORMALISED output, key-sorted; `sourcePath` is not an input (the fact W46 records).
  - `WebsiteFormSubmitDto` (`dto/website-form-submit.dto.ts`) — unchanged; `website-form-seed.spec.ts` compares only `kind`/`label`/`activeByDefault` per key.
  - From the website side (context only — nothing here imports it): Task 2's `postForm` sends `{ locale, consentVersion, captchaToken?, honeypot?, sourcePath?, fields }` and its `sys.form.labels` covers `track`, `topic`, `portfolioUrl`, `city` (W30); Task 1's `countries`/`sourceCountries` (W25) feed the `country` selects that reach the catalog's `iso2` fields as upper-case codes (W40).
- Produces (the T0f skeleton from `interfaces.md`, completed — this is the wire contract WP2b's forms (T3 Hire, T5 Partner, T7 Contact, T8 Available Workers, T11 Careers) and T14's `docs/INTEGRATIONS.md` I4 table rely on; the real catalog path is `apps/backend/src/modules/website/website-form-catalog.ts` — interfaces.md's `forms/` segment does not exist):
  - `apps/backend/src/modules/website/website-form-catalog.ts`:
    - `export type WebsiteFieldType = 'text' | 'email' | 'phone' | 'iso2' | 'enum' | 'url' | 'key' | 'array-of-key';` (adds `'url'`: http(s) only, a parseable host containing a dot, no embedded credentials; `https://` is prepended when the scheme is missing; the length cap applies to the value as typed, before the scheme is added).
    - `export const PARTNER_TRACK_VALUES = ['sourcing', 'institute'] as const;`
    - `export const CONTACT_TOPIC_VALUES = ['hire', 'partner', 'permit', 'job', 'other'] as const;`
    - New OPTIONAL fields inside `fields` (exact wire names): `city?: string` (≤120) on `hire`, `workers`, `partner`, `callback`, `contact` (`careers` keeps its own older `city` ≤100); `track?: 'sourcing' | 'institute'` on `partner`; `topic?: 'hire' | 'partner' | 'permit' | 'job' | 'other'` on `contact` (exact match, lower-case; `callback.topic` stays free text ≤200); `portfolioUrl?: string` (≤500 as typed) on `careers`.
    - Rejection reasons (in the 400's `errors[]`): `city is too long (max 120)`; `track must be one of sourcing, institute`; `track is too long (max 40)`; `topic must be one of hire, partner, permit, job, other`; `topic is too long (max 40)`; `portfolioUrl must be a web address`; `portfolioUrl is too long (max 500)`. A stray `city`/`track`/`topic`/`portfolioUrl` on a form that does not list it is dropped (reported in `dropped`), never an error.
  - `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts` (`buildWebsiteInquiryDto` output): `messagePreview` first line = `[website:<formKey>]`, or `[website:<formKey>:<track>]` when `fields.track` is present (partner); next line = `subject: [<topic>] <subject>` when the form is `contact` and a topic and/or a subject is present (`subject: [job]` alone when the visitor typed no subject; the plain `subject: <subject>` when there is no topic); then one `<key>: <value>` line per remaining non-identity field in the catalog's field order, `city` included (`city: Antalya`). `classification` unchanged: partner → `SOURCING_PARTNER` for both tracks and without one; contact → `iAm` or none; callback/visit/calculator → none. `callback.topic` stays a plain `topic: …` line.
  - `apps/backend/src/modules/website/handlers/careers-apply.logic.ts`: `export const PORTFOLIO_LINE_PREFIX = 'Portfolio: ' as const;` and `buildPublicApplyDto` sets `coverLetter = [coverLetter, 'Portfolio: <url>'].join('\n\n')` (the URL as the LAST paragraph; the letter alone when no URL; the line alone when no letter; scheme added if missing; nothing else on the DTO changes; `DROPPABLE_APPLY_FIELDS` unchanged; `PublicApplyDto` has no `portfolioUrl` property).
  - Door behaviour that does NOT change (W56): `Opening.portfolioRequired` openings still answer `{ status: 'FAILED', error: 'This position requires at least one portfolio document' }` (HTTP 200) through `POST /api/website/v1/forms/careers`.
  - Docs (Ops `docs/PRD.md`, pinned by `website-docs-guard.spec.ts`): §5.12 "**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.**" paragraph + four-row table; the gotcha "**Catalog v1.1 fields are additive and column-less (W16, 2026-09-20).**"; §12.2 "**2026-09-20 — Website catalog v1.1 (WP2 T0f, W16).**"; and per W46: the Idempotency sentence now reads "the website retries at most ONCE, immediately, and only after a network error, a per-attempt timeout or a 5xx — never after a 4xx — inside an 8 s total budget, then shows the visitor its fallback panel", the heartbeat note says "`sourcePath` is NOT part of `requestHash`", and the gotcha "**Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).**" exists. T14 mirrors the field table into the website's `docs/INTEGRATIONS.md` I4.
  - Unchanged and asserted: `PERMISSION_KEYS_HASH`, `WEBSITE_FORM_KEYS`, `schema.prisma`, `WebsiteFormSubmitDto`, `CreateInquiryDto`, `PublicApplyDto`, the `portfolioRequired` gate, `DROPPABLE_APPLY_FIELDS`.

---

#### Step 0 — the third Ops worktree (W47; run once, before Cycle 1)

```bash
# 1. Never touch the shared worktree's branch: confirm it is untouched and leave it.
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website branch --show-current   # website/wp3a-intake
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website status --short           # nothing

# 2. Create the catalog worktree from the Ops MAIN checkout, on a new branch off origin/main.
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations
git fetch origin
git worktree add -b website/catalog-ext ../jobsadmire-operations-catalog origin/main
git worktree list
# expected three rows: jobsadmire-operations [main], jobsadmire-operations-website [website/wp3a-intake], jobsadmire-operations-catalog [website/catalog-ext]

# 3. Install + generate the Prisma client there (a fresh worktree has no node_modules; the website specs import WebsiteFormKind from @prisma/client).
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git log --oneline -1                      # 7ea2a93 fix(website): subscriber purge repeats the read predicate on the delete (final re-review nit)
npm ci
cd apps/backend && npx prisma generate && cd ../..

# 4. Baseline: the website suite is green on origin/main before you change anything (one jest job at a time — the Mac memory rule).
cd apps/backend && npx jest src/modules/website --maxWorkers=2
```
  Expected baseline: every `src/modules/website/**` spec green (the catalog spec `11 passed`, the DTO pipe spec `6 passed`, the inquiry logic spec `6 passed`, the inquiry handler spec `5 passed`, the careers logic spec `5 passed`, the docs guard `18 passed`). These specs mock Prisma and read files; no `.env`, Postgres or Redis is needed (`CLAUDE.md`'s "needs docker infra" is about the whole backend suite). Cherry-pick nothing: `6de20cb` (the WP3a gate record) belongs to `website/wp3a-intake` and is pushed by its own session. The Ops repo has no `npm run verify`; the equivalent used in every Step 4 is `npm run type-check` (`tsc --noEmit` in `apps/backend`) + the narrowed jest run (deviation 5).

---

#### Cycle 1 — `city` (≤120) on hire, workers, partner, callback, contact

- [ ] **Step 1: Write the failing test** — append this `describe` to `apps/backend/src/modules/website/website-form-catalog.spec.ts` immediately before the file's final `});` (its last line, 130). No new imports are needed (`normalizeWebsiteFields`, `websiteFormSpec` are already imported at line 8). Cycles 2 and 3 add more `it`s to this same `describe`. Per W48 the `callback` case uses its own base body — the callback catalog has no `company`, so spreading the inquiry base would make the door report `dropped: ['company']`.

```ts
  // ── Catalog v1.1 (WP2 T0f, website ruling W16): additive OPTIONAL fields ─────────────
  describe('catalog v1.1 (W16) — city, track, topic, portfolioUrl', () => {
    const inquiry = { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567' };
    /** W48: callback lists no `company` — a callback body must not carry one, or `dropped` reports it. */
    const callback = { name: 'A', phone: '05321234567' };

    it('city (≤120) is accepted on hire, workers, partner, callback and contact; still dropped on visit, calculator, newsletter and fraud', () => {
      const cases: Array<[key: string, body: Record<string, string>]> = [
        ['hire', { ...inquiry }],
        ['workers', { ...inquiry }],
        ['partner', { ...inquiry, country: 'PK' }],
        ['callback', { ...callback }],
        ['contact', { ...inquiry, message: 'hi' }],
      ];
      for (const [key, body] of cases) {
        const r = normalizeWebsiteFields(key, { ...body, city: ' Antalya ' });
        expect({ key, ok: r.ok, city: r.ok ? r.fields.city : null, dropped: r.ok ? r.dropped : null })
          .toEqual({ key, ok: true, city: 'Antalya', dropped: [] });
      }
      for (const key of ['visit', 'calculator']) {
        const r = normalizeWebsiteFields(key, { ...inquiry, city: 'Antalya' });
        expect({ key, dropped: r.ok ? r.dropped : null }).toEqual({ key, dropped: ['city'] });
      }
      expect(normalizeWebsiteFields('newsletter', { email: 'a@b.co', city: 'Antalya' })).toEqual({ ok: true, dropped: ['city'], fields: { email: 'a@b.co' } });
      expect(normalizeWebsiteFields('fraud', { description: 'x'.repeat(40), city: 'Antalya' })).toEqual({ ok: true, dropped: ['city'], fields: { description: 'x'.repeat(40) } });
      // careers keeps its own, older `city` (≤ 100 — PublicApplyDto's cap), unchanged.
      expect(websiteFormSpec('careers')!.fields.city).toEqual({ max: 100 });
    });

    it('city over 120 characters is a 400 reason; an empty city is simply absent', () => {
      expect(normalizeWebsiteFields('hire', { ...inquiry, city: 'x'.repeat(121) })).toEqual({ ok: false, errors: ['city is too long (max 120)'] });
      expect(normalizeWebsiteFields('callback', { ...callback, city: 'x'.repeat(121) })).toEqual({ ok: false, errors: ['city is too long (max 120)'] });
      expect(normalizeWebsiteFields('contact', { name: 'A', email: 'a@b.co', message: 'hi', city: '' })).toEqual({ ok: true, dropped: [], fields: { name: 'A', email: 'a@b.co', message: 'hi' } });
    });
  });
```

  Run line: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-form-catalog.spec.ts --maxWorkers=2`
  Expected failure: the first new `it` fails on its first case (`hire`) with `dropped: ["city"]` / `city: null` instead of `city: "Antalya"` / `dropped: []`; the second fails on its first line because the over-long city is `{ ok: true, dropped: ['city'], fields: {…} }` rather than the error. The 11 existing tests stay green.

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-form-catalog.spec.ts --maxWorkers=2
```
  Expected: `Tests: 2 failed, 11 passed, 13 total` — the failing names are `catalog v1.1 (W16) — city, track, topic, portfolioUrl › city (≤120) is accepted …` and `… › city over 120 characters is a 400 reason …`.

- [ ] **Step 3: Implement** — replace `apps/backend/src/modules/website/website-form-catalog.ts` (whole file) with the file below. This is the FINAL v1.1 file — it already contains Cycle 2's `track`/`topic` and Cycle 3's `url` type / `portfolioUrl`, so the file is written once; Cycles 2 and 3 only add their specs and re-run. Diff against `origin/main`: the `WebsiteFieldType` union gains `'url'`; two exported value tuples; four new spec constants `city`, `url`, `partnerTrack`, `contactTopic`; `city` inserted in five entries; `track`/`topic`/`portfolioUrl` inserted; `SCHEME_RE` + `isHttpUrl` helpers; a `case 'url'` arm in the switch; a header-comment paragraph; the careers comment extended. Nothing else moves (`CONTROL_RE`, `clean`, `normalizeKeyList`, the iso2 branch, the `Object.hasOwn` drop rule are byte-identical).

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
 *
 * Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16): four OPTIONAL additions for the
 * designed pages — `city` on the five inquiry-style forms, `partner.track`, `contact.topic`
 * and `careers.portfolioUrl` (the new `url` type). Additive only: a website build that never
 * sends them is unaffected, no column or migration backs them (they land in the inquiry
 * preview / the cover letter), and no classification rule changed.
 */
export type WebsiteFieldType = 'text' | 'email' | 'phone' | 'iso2' | 'enum' | 'url' | 'key' | 'array-of-key';

export interface WebsiteFieldSpec {
  /** Maximum length of the value — of each item for `array-of-key`; for `url`, of the value as typed (before `https://` is added). */
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
/**
 * v1.1 (W16): which Partner-page track the visitor chose. Both classify SOURCING_PARTNER
 * (the HR-agency track posts to `hire` with `iAm: 'hr_agency'` instead); the track rides in
 * the inquiry preview tag so the Sales list can tell an institute from a sourcing agent.
 */
export const PARTNER_TRACK_VALUES = ['sourcing', 'institute'] as const;
/**
 * v1.1 (W16): the Contact-page topic chip; it becomes the `[topic]` prefix of the inquiry's
 * subject line. Unrelated to `callback.topic`, which is the older free-text field.
 */
export const CONTACT_TOPIC_VALUES = ['hire', 'partner', 'permit', 'job', 'other'] as const;

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
/** v1.1: free text — the inquiry has no city column; it becomes a `city:` preview line. `careers.city` is the older ≤ 100 (PublicApplyDto's cap). */
const city: WebsiteFieldSpec = { max: 120 };
/** v1.1: a web address ≤ 500 as typed; see `isHttpUrl`. */
const url: WebsiteFieldSpec = { max: 500, type: 'url' };
const partnerTrack: WebsiteFieldSpec = { max: 40, type: 'enum', values: PARTNER_TRACK_VALUES };
const contactTopic: WebsiteFieldSpec = { max: 40, type: 'enum', values: CONTACT_TOPIC_VALUES };

export const WEBSITE_FORM_CATALOG: Record<WebsiteFormKey, WebsiteFormSpec> = {
  hire: {
    kind: WebsiteFormKind.INQUIRY, label: 'Hire workers', activeByDefault: true,
    fields: { name, company: { ...company, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country, city, iAm: employerIAm, sector: { max: 120 }, roleNeeded: { max: 200 }, headcount, startWhen: { max: 120 }, message },
  },
  contact: {
    kind: WebsiteFormKind.INQUIRY, label: 'Contact', activeByDefault: true,
    fields: { name, email: { ...email, required: true }, phone, company, country, city, iAm, topic: contactTopic, subject: { max: 200 }, message: { ...message, required: true } },
  },
  partner: {
    kind: WebsiteFormKind.INQUIRY, label: 'Partner with us', activeByDefault: true,
    fields: { name, company: { ...company, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country: { ...country, required: true }, city, track: partnerTrack, candidatesPerYear: { max: 20 }, trades: { max: 500 }, licence: { max: 200 }, message },
  },
  workers: {
    kind: WebsiteFormKind.INQUIRY, label: 'Request available workers', activeByDefault: true,
    fields: { name, company: { ...company, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country, city, iAm: employerIAm, trade: { max: 200 }, headcount, startWhen: { max: 120 }, message },
  },
  callback: {
    kind: WebsiteFormKind.CALLBACK, label: 'Request a callback', activeByDefault: true,
    fields: { name, phone: { ...phone, required: true }, email, city, preferredTime: { max: 120 }, topic: { max: 200 } },
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
  // careers-public's PublicApplyDto (careers-public.dto.ts:95-146). `portfolioUrl` (v1.1)
  // has no DTO/column counterpart — the handler folds it into `coverLetter` (@db.Text).
  // `linkedinUrl` is deliberately NOT retyped `url`: a junk LinkedIn value is dropped by the
  // handler (DROPPABLE_APPLY_FIELDS), and turning that into a 400 would lose applications.
  careers: {
    kind: WebsiteFormKind.CAREERS_APPLY, label: 'Careers application', activeByDefault: true,
    fields: {
      openingSlug: { max: 200, required: true, pattern: /^[a-z0-9-]+$/ },
      cvKey: { max: 300, required: true, type: 'key', pattern: /^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i },
      name: { max: 200, required: true }, email: { ...email, required: true }, phone: { ...phone, required: true }, country: { ...country, required: true },
      city: { max: 100 }, language: { max: 300 },
      expectedSalary: salary, expectedSalaryCurrency: currency, currentSalary: salary, currentSalaryCurrency: currency,
      coverLetter: { max: 5000 }, linkedinUrl: { max: 500 }, portfolioUrl: url,
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
/** `behance.net/x` has no scheme, `HTTP://x` has one — the careers-apply.logic.ts `withScheme` rule, applied at the door for `url` fields. */
const SCHEME_RE = /^[a-z][a-z0-9+.-]*:\/\//i;

function clean(v: string): string {
  return v.replace(/\r\n?/g, '\n').replace(CONTROL_RE, '').trim();
}

/**
 * `url` (v1.1): http(s) only, a parseable host that contains a dot, no embedded
 * credentials — enough to keep "see attached", a chat handle or a localhost link out of a
 * field staff will click. Everything else about the address is the visitor's business.
 */
function isHttpUrl(s: string): boolean {
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return false;
  }
  return (u.protocol === 'http:' || u.protocol === 'https:') && u.username === '' && u.password === '' && /^[^\s]+\.[a-z0-9-]{2,}$/i.test(u.hostname);
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
      case 'url':
        // The length cap above applied to the value as typed; the added scheme may push the stored value past it.
        s = SCHEME_RE.test(s) ? s : `https://${s}`;
        if (!isHttpUrl(s)) errors.push(`${key} must be a web address`);
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
  // Own keys only: `in` would also see `constructor` / `toString` up the prototype chain.
  const dropped = Object.keys(input).filter((k) => !Object.hasOwn(spec.fields, k));
  return { ok: true, fields, dropped };
}
```

- [ ] **Step 4: Run the tests + the Operations verify equivalent** (the Operations repo has no `npm run verify`; its `CLAUDE.md` step 1 is type-check + jest):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npx jest src/modules/website/website-form-catalog.spec.ts src/modules/website/website-form-seed.spec.ts --maxWorkers=2
npm run type-check
```
  Expected: catalog spec `Tests: 13 passed, 13 total`; seed spec green (it compares kind/label/activeByDefault only); `tsc --noEmit` exits 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git add apps/backend/src/modules/website/website-form-catalog.ts apps/backend/src/modules/website/website-form-catalog.spec.ts
git commit -m "feat(website): catalog v1.1 — optional city on hire/workers/partner/callback/contact (W16)

Additive only: a website build that never sends city is unaffected; the door
drops it everywhere else (careers keeps its own city ≤100). The file already
carries the v1.1 track/topic/portfolioUrl entries and the url field type; their
specs land in the next two commits. No migration, no permission change.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `partner.track` and `contact.topic` enums

- [ ] **Step 1: Write the failing test** — add these two `it`s inside the `describe('catalog v1.1 (W16) …')` block from Cycle 1 (after the `'city over 120 characters …'` test):

```ts
    it('partner.track is an enum sourcing|institute — anything else (including a case variant) is a 400 reason; other forms drop a stray track', () => {
      const base = { ...inquiry, country: 'PK' };
      expect(normalizeWebsiteFields('partner', { ...base, track: 'institute' })).toMatchObject({ ok: true, dropped: [], fields: { track: 'institute' } });
      expect(normalizeWebsiteFields('partner', { ...base, track: 'sourcing' })).toMatchObject({ ok: true, dropped: [], fields: { track: 'sourcing' } });
      expect(normalizeWebsiteFields('partner', { ...base })).toMatchObject({ ok: true, dropped: [] }); // optional
      expect(normalizeWebsiteFields('partner', { ...base, track: 'hr' })).toEqual({ ok: false, errors: ['track must be one of sourcing, institute'] });
      expect(normalizeWebsiteFields('partner', { ...base, track: 'Institute' })).toEqual({ ok: false, errors: ['track must be one of sourcing, institute'] });
      expect(normalizeWebsiteFields('partner', { ...base, track: 'x'.repeat(41) })).toEqual({ ok: false, errors: ['track is too long (max 40)'] });
      expect(normalizeWebsiteFields('hire', { ...inquiry, track: 'institute' })).toMatchObject({ ok: true, dropped: ['track'] });
    });

    it('contact.topic is an enum hire|partner|permit|job|other; callback.topic stays free text (≤200)', () => {
      const base = { name: 'A', email: 'a@b.co', message: 'hi' };
      for (const topic of ['hire', 'partner', 'permit', 'job', 'other']) {
        expect({ topic, r: normalizeWebsiteFields('contact', { ...base, topic }) }).toMatchObject({ topic, r: { ok: true, dropped: [], fields: { topic } } });
      }
      expect(normalizeWebsiteFields('contact', { ...base, topic: 'visa' })).toEqual({ ok: false, errors: ['topic must be one of hire, partner, permit, job, other'] });
      expect(normalizeWebsiteFields('contact', { ...base, topic: 'x'.repeat(41) })).toEqual({ ok: false, errors: ['topic is too long (max 40)'] });
      expect(normalizeWebsiteFields('callback', { ...callback, topic: 'Need 20 welders in Antalya' }))
        .toEqual({ ok: true, dropped: [], fields: { name: 'A', phone: '05321234567', topic: 'Need 20 welders in Antalya' } });
      expect(normalizeWebsiteFields('hire', { ...inquiry, topic: 'permit' })).toMatchObject({ ok: true, dropped: ['topic'] });
    });
```

  Run line: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-form-catalog.spec.ts --maxWorkers=2`
  Expected: because Cycle 1 already wrote the final catalog file, these two tests PASS on first run — they are the pin for `track`/`topic`. Prove the pin bites with a mutation: temporarily change `PARTNER_TRACK_VALUES` to `['sourcing'] as const` in the catalog, re-run (expected: `1 failed` — the `track: 'institute'` line), and revert with `git checkout -- apps/backend/src/modules/website/website-form-catalog.ts`.

- [ ] **Step 2: Run test to verify it fails** — the mutation check above: with `['sourcing']` the run prints `Tests: 1 failed, 14 passed, 15 total`; after reverting, `Tests: 15 passed, 15 total`.

- [ ] **Step 3: Implement** — nothing further (the catalog file from Cycle 1 is complete). Confirm the two constants are exported: `grep -n "PARTNER_TRACK_VALUES\|CONTACT_TOPIC_VALUES" apps/backend/src/modules/website/website-form-catalog.ts` → the two `export const` lines plus their two uses.

- [ ] **Step 4: Run the tests + type-check**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npx jest src/modules/website/website-form-catalog.spec.ts --maxWorkers=2
npm run type-check
```
  Expected: `Tests: 15 passed, 15 total`; `tsc` exit 0 (the working tree is byte-identical to the Cycle 1 commit plus the spec).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git add apps/backend/src/modules/website/website-form-catalog.spec.ts
git commit -m "test(website): catalog v1.1 — pin partner.track and contact.topic enums (W16)

track ∈ sourcing|institute on partner, topic ∈ hire|partner|permit|job|other on
contact, exact match, both optional; callback.topic stays the older free-text
field. A stray track/topic on any other form is dropped, never a 400.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — the `url` field type and `careers.portfolioUrl`; the envelope pin

- [ ] **Step 1: Write the failing test** — (a) add this `it` inside the v1.1 `describe` in `website-form-catalog.spec.ts` (after the `contact.topic` test); (b) append the envelope pin to `apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts` before its final `});` (its last line, 66; `through` and `GOOD` are the file-level helpers at lines 17 and 25).

  (a)
```ts
    it('careers.portfolioUrl is a web address ≤ 500 as typed: a scheme-less host gets https://, junk is a 400 reason, absent is fine; linkedinUrl is NOT retyped', () => {
      const base = { openingSlug: 'ui-designer-lahore', cvKey: 'careers-cv/a.pdf', name: 'A', email: 'a@b.co', phone: '05321234567', country: 'pk' };
      expect(normalizeWebsiteFields('careers', { ...base, portfolioUrl: ' behance.net/ayse ' })).toMatchObject({ ok: true, dropped: [], fields: { portfolioUrl: 'https://behance.net/ayse' } });
      expect(normalizeWebsiteFields('careers', { ...base, portfolioUrl: 'HTTP://Ayse.Design/work?x=1' })).toMatchObject({ ok: true, fields: { portfolioUrl: 'HTTP://Ayse.Design/work?x=1' } });
      expect(normalizeWebsiteFields('careers', { ...base, portfolioUrl: 'https://xn--ayse-3ra.com/portfolio' })).toMatchObject({ ok: true, fields: { portfolioUrl: 'https://xn--ayse-3ra.com/portfolio' } });
      expect(normalizeWebsiteFields('careers', { ...base })).toMatchObject({ ok: true, dropped: [] });
      for (const junk of ['see attached', 'ftp://files.example.com/p', 'https://user:pw@behance.net/x', 'https://localhost/x', '@ayse_designs', 'mailto:ayse@example.com']) {
        expect({ junk, r: normalizeWebsiteFields('careers', { ...base, portfolioUrl: junk }) }).toEqual({ junk, r: { ok: false, errors: ['portfolioUrl must be a web address'] } });
      }
      expect(normalizeWebsiteFields('careers', { ...base, portfolioUrl: `https://a.io/${'x'.repeat(500)}` })).toEqual({ ok: false, errors: ['portfolioUrl is too long (max 500)'] });
      // linkedinUrl keeps its length-only rule: a junk LinkedIn value is still DROPPED by the handler
      // (careers-apply.logic.ts DROPPABLE_APPLY_FIELDS), never a 400 at the door.
      expect(normalizeWebsiteFields('careers', { ...base, linkedinUrl: 'not a url at all' })).toMatchObject({ ok: true, fields: { linkedinUrl: 'not a url at all' } });
      expect(normalizeWebsiteFields('hire', { ...inquiry, portfolioUrl: 'https://a.io' })).toMatchObject({ ok: true, dropped: ['portfolioUrl'] });
    });
```

  (b)
```ts
  it('catalog v1.1 (W16): city / track / topic / portfolioUrl inside `fields` reach the catalog untouched — the envelope DTO whitelists only its own five keys', async () => {
    const fields = { name: 'A', email: 'a@b.co', city: 'Antalya', track: 'institute', topic: 'permit', portfolioUrl: 'behance.net/ayse' };
    const dto = await through({ ...GOOD, fields });
    expect(dto.fields).toEqual(fields);
    // …and the same names at the TOP level are still refused (forbidNonWhitelisted), so a
    // website bug that lifts a field out of `fields` is a 400, not a silent drop.
    await expect(through({ ...GOOD, city: 'Antalya' })).rejects.toThrow(/city/);
  });
```

  Run line: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-form-catalog.spec.ts src/modules/website/dto/website-form-submit.dto.spec.ts --maxWorkers=2`
  Expected: both pass on first run (the catalog file from Cycle 1 already carries the `url` type; the envelope DTO is unchanged by design). Mutation check for the `url` type: temporarily change `portfolioUrl: url` to `portfolioUrl: { max: 500 }` in the catalog → the `junk` loop fails on `'see attached'` (`ok: true`); revert with `git checkout -- apps/backend/src/modules/website/website-form-catalog.ts`.

- [ ] **Step 2: Run test to verify it fails** — the mutation check above prints `Tests: 1 failed, 15 passed, 16 total` for the catalog spec; after reverting, `16 passed`. The DTO pipe spec prints `Tests: 7 passed, 7 total`.

- [ ] **Step 3: Implement** — nothing further in code (Cycle 1's file). Confirm the switch arm exists: `grep -n "case 'url'" apps/backend/src/modules/website/website-form-catalog.ts` → one line.

- [ ] **Step 4: Run the tests + type-check + the lint baseline**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npx jest src/modules/website/website-form-catalog.spec.ts src/modules/website/dto/website-form-submit.dto.spec.ts --maxWorkers=2
npm run type-check
npx eslint src/modules/website/website-form-catalog.ts src/modules/website/website-form-catalog.spec.ts src/modules/website/dto/website-form-submit.dto.spec.ts --ext .ts
```
  Expected: `Tests: 23 passed, 23 total` across the two files (16 + 7); `tsc` exit 0. ESLint is NOT part of Operations' verify (`CLAUDE.md` step 1 is type-check + jest) and `origin/main` already carries lint errors in this module — the baseline you must not add to is exactly ONE finding on these three files: `website-form-catalog.ts` `no-control-regex` at the pre-existing `CONTROL_RE` line (verified on 7ea2a93; the root `.eslintrc.js` is `eslint:recommended` + `@typescript-eslint/recommended` with `no-unused-vars` erroring on any unused binding, `argsIgnorePattern: '^_'` for arguments only). The optional `catch {}` binding and `Object.hasOwn` are fine under the backend's `ES2022` target.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git add apps/backend/src/modules/website/website-form-catalog.spec.ts apps/backend/src/modules/website/dto/website-form-submit.dto.spec.ts
git commit -m "test(website): catalog v1.1 — pin the url field type on careers.portfolioUrl and the envelope pass-through (W16)

url = http(s) only, host with a dot, no credentials, https:// added when the
scheme is missing; 'portfolioUrl must be a web address' otherwise. linkedinUrl
is deliberately not retyped. The envelope DTO is unchanged: the new names live
inside \`fields\` and are still refused at the top level.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — inquiry preview: `track` in the tag, `topic` on the subject line, `city` as a line; classification unchanged

- [ ] **Step 1: Write the failing test** — append this `describe` to `apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts` before its final `});` (its last line, 85). `InquiryClassification` and `WebsiteFormKind` are already imported (line 8); `input()` is the file-level factory (line 12).

```ts
  describe('catalog v1.1 (W16): city, track, topic', () => {
    it('city is a preview line, never a column (CreateInquiryDto has no city)', () => {
      const dto = buildWebsiteInquiryDto(input({ fields: { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567', country: 'TR', city: 'Antalya', headcount: '20' } }));
      expect(dto.messagePreview).toBe('[website:hire]\ncity: Antalya\nheadcount: 20');
      expect(dto).not.toHaveProperty('city');
    });

    it('partner.track rides in the tag; classification stays SOURCING_PARTNER for both tracks and without one', () => {
      const base = { name: 'A', company: 'B', email: 'a@b.co', phone: '05321234567', country: 'PK', trades: 'welders' };
      const inst = buildWebsiteInquiryDto(input({ formKey: 'partner', fields: { ...base, track: 'institute' } }));
      expect(inst.messagePreview).toBe('[website:partner:institute]\ntrades: welders');
      expect(inst.classification).toBe(InquiryClassification.SOURCING_PARTNER);
      const src = buildWebsiteInquiryDto(input({ formKey: 'partner', fields: { ...base, track: 'sourcing' } }));
      expect(src.messagePreview).toBe('[website:partner:sourcing]\ntrades: welders');
      expect(src.classification).toBe(InquiryClassification.SOURCING_PARTNER);
      const none = buildWebsiteInquiryDto(input({ formKey: 'partner', fields: base }));
      expect(none.messagePreview).toBe('[website:partner]\ntrades: welders');
      expect(none.classification).toBe(InquiryClassification.SOURCING_PARTNER);
    });

    it('contact.topic prefixes the subject line (first after the tag); the topic alone when no subject was typed; no topic → the old plain line', () => {
      const c = buildWebsiteInquiryDto(input({ formKey: 'contact', fields: { name: 'A', email: 'a@b.co', city: 'Bursa', topic: 'permit', subject: 'Renewal timing', message: 'hi' } }));
      expect(c.messagePreview).toBe('[website:contact]\nsubject: [permit] Renewal timing\ncity: Bursa\nmessage: hi');
      expect(c.classification).toBeUndefined(); // contact still has no default; iAm still wins when sent
      expect(buildWebsiteInquiryDto(input({ formKey: 'contact', fields: { name: 'A', email: 'a@b.co', topic: 'job', message: 'hi', iAm: 'job_seeker' } })).classification).toBe(InquiryClassification.JOB_SEEKER);
      const bare = buildWebsiteInquiryDto(input({ formKey: 'contact', fields: { name: 'A', email: 'a@b.co', topic: 'job', message: 'hi' } }));
      expect(bare.messagePreview).toBe('[website:contact]\nsubject: [job]\nmessage: hi');
      const noTopic = buildWebsiteInquiryDto(input({ formKey: 'contact', fields: { name: 'A', email: 'a@b.co', subject: 'Hello', message: 'hi' } }));
      expect(noTopic.messagePreview).toBe('[website:contact]\nsubject: Hello\nmessage: hi');
    });

    it('callback.topic is the older free-text field: a plain line, no subject prefix; its city is a line too', () => {
      const cb = buildWebsiteInquiryDto(input({ formKey: 'callback', kind: WebsiteFormKind.CALLBACK, fields: { name: 'A', phone: '05321234567', city: 'Bursa', topic: 'Need 20 welders' } }));
      expect(cb.messagePreview).toBe('[website:callback]\ncity: Bursa\ntopic: Need 20 welders');
      expect(cb.classification).toBeUndefined();
    });
  });
```

  Also append this `it` to `apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts` before its final `});` (its last line, 97; `make()` and `input()` are the file-level helpers at lines 12 and 24; `InquiryClassification` is imported at line 8) — the handler-level pin that the DTO reaching `InquiryService.create` carries the v1.1 shape:

```ts
  it('catalog v1.1 (W16): a partner institute submission files as SOURCING_PARTNER with the track in the tag and the city in the preview', async () => {
    const { handler, inquiries } = make();
    const res = await handler.handle(input({
      formKey: 'partner',
      fields: { name: 'Ali Raza', company: 'Skill Institute', email: 'ali@inst.pk', phone: '+923001234567', country: 'PK', city: 'Lahore', track: 'institute' },
    }));
    const [dto] = inquiries.create.mock.calls[0] as [Record<string, unknown>];
    expect(dto).toMatchObject({ classification: InquiryClassification.SOURCING_PARTNER, country: 'PK', contactName: 'Ali Raza', messagePreview: '[website:partner:institute]\ncity: Lahore' });
    expect(res).toMatchObject({ ok: true, createdEntityType: 'inquiry', detail: { classification: InquiryClassification.SOURCING_PARTNER, contactName: 'Ali Raza', email: 'ali@inst.pk' } });
  });
```

  Run line: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/handlers/website-inquiry.logic.spec.ts src/modules/website/handlers/website-inquiry.handler.spec.ts --maxWorkers=2`
  Expected failure (the current logic renders every non-identity field as a line in the order given): `partner.track rides in the tag …` fails with `[website:partner]\ntrades: welders\ntrack: institute`; `contact.topic prefixes …` fails with `[website:contact]\ncity: Bursa\ntopic: permit\nsubject: Renewal timing\nmessage: hi`; the handler pin fails with `[website:partner]\ncity: Lahore\ntrack: institute`. The `city` test and the `callback` test pass already (generic lines) — they are pins.

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/handlers/website-inquiry.logic.spec.ts src/modules/website/handlers/website-inquiry.handler.spec.ts --maxWorkers=2
```
  Expected: `Tests: 3 failed, 13 passed, 16 total`.

- [ ] **Step 3: Implement** — replace `apps/backend/src/modules/website/handlers/website-inquiry.logic.ts` (whole file) with:

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
/**
 * Catalog v1.1 (W16): fields that shape the preview's tag or subject line instead of a line
 * of their own — `track` (partner) rides in the tag, `subject` is composed with the contact
 * topic. `city` is NOT here: it has no column and is simply a `city:` line.
 */
const HEADER_FIELDS = new Set(['track', 'subject']);

/** CreateInquiryDto's own caps — not enforced on a service call, so enforced here. */
const MESSAGE_PREVIEW_MAX = 5000;
const NOTES_MAX = 2000;

type WebsiteFieldValue = string | string[] | undefined;

/** An identity column takes one value; an array (RC5 multi-value field) contributes its first (RC32). */
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
 * `[website:partner]`, or `[website:partner:institute]` when the Partner page's track is
 * known (v1.1, W16). The Sales list shows the first line of the preview, so the track is
 * readable without opening the row; classification is untouched by it.
 */
function tagFor(input: WebsiteFormHandlerInput): string {
  const track = one(input.fields.track);
  return track ? `[website:${input.formKey}:${track}]` : `[website:${input.formKey}]`;
}

/** The Contact page's topic chip is the enum `contact.topic`; `callback.topic` is the older free-text field and stays a line of its own. */
function contactTopic(input: WebsiteFormHandlerInput): string | undefined {
  return input.formKey === 'contact' ? one(input.fields.topic) : undefined;
}

/**
 * `subject: [permit] Renewal timing` — the contact topic as a bracketed prefix (v1.1, W16),
 * `subject: [job]` alone when the visitor typed no subject, the plain `subject: …` line when
 * there is no topic, and no line at all when there is neither.
 */
function subjectLine(input: WebsiteFormHandlerInput, topic: string | undefined): string | null {
  const text = [topic ? `[${topic}]` : '', all(input.fields.subject)].filter(Boolean).join(' ');
  return text ? `subject: ${text}` : null;
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
  const topic = contactTopic(input);
  const skip = (k: string) => IDENTITY_FIELDS.has(k) || HEADER_FIELDS.has(k) || (k === 'topic' && topic !== undefined);
  const subject = subjectLine(input, topic);
  const lines = Object.entries(f)
    .filter(([k, v]) => !skip(k) && all(v).length > 0)
    .map(([k, v]) => `${k}: ${all(v)}`);
  const messagePreview = [tagFor(input), ...(subject ? [subject] : []), ...lines].join('\n').slice(0, MESSAGE_PREVIEW_MAX);
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

  Notes for the executor: `topic` is skipped from the generic lines ONLY when it was consumed as the contact topic (`topic !== undefined`), so a callback row keeps the old output byte-for-byte, and a WP3a-era contact payload (whose catalog order put `subject` first among the non-identity fields anyway) also keeps it; the existing assertions `^\[website:hire\]\n`, `^\[website:callback\]\n`, `trades: welder, fitter`, `preferredTime: morning` (logic spec lines 43, 63, 77, 64) still hold. On a live submission the field order is the catalog's iteration order (`normalizeWebsiteFields` builds `fields` in catalog order), so `city` shows right after the tag/subject line on every form — the specs pass fields literally and pin the composition rule, not the catalog order.

- [ ] **Step 4: Run the tests + the whole website handler suite + type-check**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npx jest src/modules/website/handlers --maxWorkers=2
npm run type-check
```
  Expected: every spec under `handlers/` green (`website-inquiry.logic.spec.ts` 10 passed, `website-inquiry.handler.spec.ts` 6 passed, the careers/fraud/newsletter specs unchanged); `tsc` exit 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git add apps/backend/src/modules/website/handlers/website-inquiry.logic.ts apps/backend/src/modules/website/handlers/website-inquiry.logic.spec.ts apps/backend/src/modules/website/handlers/website-inquiry.handler.spec.ts
git commit -m "feat(website): inquiry preview carries partner.track in the tag, contact.topic on the subject line, city as a line (W16)

[website:partner:institute] as the first line so the Sales list tells an
institute from a sourcing agent without opening the row; 'subject: [permit] …'
for the Contact page's topic chip; city has no column and is a plain line.
Classification is untouched: partner is SOURCING_PARTNER for both tracks,
contact still has no default and iAm still wins.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — `careers.portfolioUrl` → the cover letter's last paragraph (the `portfolioRequired` gate untouched, W56)

- [ ] **Step 1: Write the failing test** — append this `it` to `apps/backend/src/modules/website/handlers/careers-apply.logic.spec.ts` before its final `});` (its last line, 90). Add `PORTFOLIO_LINE_PREFIX` to the existing import list at lines 3–8 so it reads `buildPublicApplyDto, PORTFOLIO_LINE_PREFIX, validatePublicApplyDto, WEBSITE_CAREERS_SOURCE_DETAIL, WEBSITE_CV_KEY_PATTERN`. (`fields()` and `CV_URL` are the file-level helpers at lines 16–31. The "no letter" case passes `coverLetter: ''` rather than destructuring a `_` binding away — an unused destructured binding is an `@typescript-eslint/no-unused-vars` error in this repo.)

```ts
  it('catalog v1.1 (W16): portfolioUrl becomes the LAST paragraph of the cover letter — no applicant column, no migration, nothing dropped', async () => {
    expect(PORTFOLIO_LINE_PREFIX).toBe('Portfolio: ');
    const dto = buildPublicApplyDto(fields({ portfolioUrl: 'https://behance.net/ayse' }), CV_URL);
    expect(dto.coverLetter).toBe('Hello\n\nPortfolio: https://behance.net/ayse');
    expect(dto).not.toHaveProperty('portfolioUrl');
    await expect(validatePublicApplyDto(dto)).resolves.toEqual({ dropped: [], errors: [] });

    // No cover letter typed → the portfolio line is the whole letter; a scheme-less URL (a hand-edited row — the door adds https:// on a live submission) still gets one.
    expect(buildPublicApplyDto(fields({ coverLetter: '', portfolioUrl: 'behance.net/ayse' }), CV_URL).coverLetter).toBe('Portfolio: https://behance.net/ayse');

    // No portfolio → the letter is exactly what the visitor typed (byte-for-byte the WP3a output).
    expect(buildPublicApplyDto(fields(), CV_URL).coverLetter).toBe('Hello');
    expect(buildPublicApplyDto(fields({ coverLetter: '' }), CV_URL).coverLetter).toBeUndefined();

    // A very long letter is not truncated: PublicApplyDto.coverLetter has no MaxLength and the column is @db.Text.
    const long = buildPublicApplyDto(fields({ coverLetter: 'x'.repeat(5000), portfolioUrl: 'https://behance.net/ayse' }), CV_URL);
    expect(long.coverLetter).toHaveLength(5000 + 2 + 'Portfolio: https://behance.net/ayse'.length);
    await expect(validatePublicApplyDto(long)).resolves.toEqual({ dropped: [], errors: [] });
  });
```

  Run line: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/handlers/careers-apply.logic.spec.ts --maxWorkers=2`
  Expected failure: a TypeScript compile error in the spec — `PORTFOLIO_LINE_PREFIX` is not exported from `./careers-apply.logic` (ts-jest reports `TS2305: Module './careers-apply.logic' has no exported member 'PORTFOLIO_LINE_PREFIX'`), so the file fails before any test runs.

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/handlers/careers-apply.logic.spec.ts --maxWorkers=2
```
  Expected: `Test suite failed to run … TS2305 … 'PORTFOLIO_LINE_PREFIX'`.

- [ ] **Step 3: Implement** — replace `apps/backend/src/modules/website/handlers/careers-apply.logic.ts` (whole file) with:

```ts
import { InternalApplicantSource } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { PublicApplyDto } from '../../careers-public/dto/careers-public.dto';

/** `sourceDetail` stamped on every applicant that came through jobsadmire.com. */
export const WEBSITE_CAREERS_SOURCE_DETAIL = 'jobsadmire.com';

/**
 * The key the EXISTING public `POST /api/careers/upload-cv` returns (P5, RC3):
 * that route is PDF-only and stores under careers-cv/, so the key must be a PDF
 * under that prefix. The Task 6 catalog carries the same pattern (RC5); this
 * copy is the handler's defence for a hand-edited row on a re-run.
 */
export const WEBSITE_CV_KEY_PATTERN = /^careers-cv\/[A-Za-z0-9._-]+\.pdf$/i;

/**
 * Catalog v1.1 (W16): `portfolioUrl` has no PublicApplyDto field and no applicant
 * column, and no migration ships with it, so the link rides as the LAST paragraph of
 * the cover letter under this prefix. `coverLetter` is `@db.Text` with no DTO cap,
 * so nothing is truncated or dropped. NOTE (website ruling W56): this does not satisfy
 * an opening's `portfolioRequired` — that gate in `CareersPublicService.apply()` wants an
 * uploaded `careers-portfolio/` document and is deliberately unchanged (owner decision
 * pending); the website keeps its "apply by e-mail" branch for those openings.
 */
export const PORTFOLIO_LINE_PREFIX = 'Portfolio: ' as const;

/**
 * Optional PublicApplyDto fields that are DROPPED (with a note in `detail`)
 * when they fail the DTO's own rules, instead of failing the application.
 * The website catalog only checks length on these; the DTO adds `@IsNumber`,
 * `@IsIn(CURRENCY_CODES)` and `@IsUrl({ require_protocol: true })`, and a
 * lead must never be lost to a LinkedIn URL without a scheme.
 */
export const DROPPABLE_APPLY_FIELDS = [
  'city',
  'language',
  'expectedSalary',
  'expectedSalaryCurrency',
  'currentSalary',
  'currentSalaryCurrency',
  'coverLetter',
  'linkedinUrl',
] as const;

type WebsiteFields = Record<string, string | string[]>;

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === 'string' && v !== '' ? v : undefined;
}

function upper(v: string | undefined): string | undefined {
  return v === undefined ? undefined : v.toUpperCase();
}

/** `linkedin.com/in/x` → `https://linkedin.com/in/x`; anything that already has a scheme is left alone. */
function withScheme(v: string | undefined): string | undefined {
  if (v === undefined) return undefined;
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
}

/**
 * The cover letter as typed, plus `Portfolio: <url>` as a final paragraph when the
 * visitor gave one (v1.1). The door already added the scheme on a live submission;
 * `withScheme` here is the re-run defence for a hand-edited row.
 */
function withPortfolio(coverLetter: string | undefined, portfolioUrl: string | undefined): string | undefined {
  const url = withScheme(portfolioUrl);
  if (url === undefined) return coverLetter;
  return [coverLetter, `${PORTFOLIO_LINE_PREFIX}${url}`].filter((p): p is string => p !== undefined && p !== '').join('\n\n');
}

function flattenErrors(errors: ValidationError[], prefix = ''): string[] {
  const out: string[] = [];
  for (const e of errors) {
    const name = prefix ? `${prefix}.${e.property}` : e.property;
    for (const msg of Object.values(e.constraints ?? {})) out.push(`${name}: ${msg}`);
    if (e.children?.length) out.push(...flattenErrors(e.children, name));
  }
  return out;
}

/**
 * The website careers payload (already whitelisted, trimmed, e-mail lowercased
 * and ISO country uppercased by the Task 6 catalog) → a real PublicApplyDto
 * instance, so `@Trim()` and `@Type(() => Number)` run exactly as they do on
 * the public careers form. `cvUrl` is rebuilt by the caller from `cvKey`
 * because apply() mints the CV ApplicantDocument row via `keyFromUrl(cvUrl)`.
 */
export function buildPublicApplyDto(fields: WebsiteFields, cvUrl: string): PublicApplyDto {
  return plainToInstance(PublicApplyDto, {
    name: str(fields.name),
    email: str(fields.email),
    phone: str(fields.phone),
    country: str(fields.country),
    city: str(fields.city),
    language: str(fields.language),
    expectedSalary: str(fields.expectedSalary),
    expectedSalaryCurrency: upper(str(fields.expectedSalaryCurrency)),
    currentSalary: str(fields.currentSalary),
    currentSalaryCurrency: upper(str(fields.currentSalaryCurrency)),
    coverLetter: withPortfolio(str(fields.coverLetter), str(fields.portfolioUrl)),
    linkedinUrl: withScheme(str(fields.linkedinUrl)),
    cvUrl,
    source: InternalApplicantSource.CAREERS_PAGE,
    sourceDetail: WEBSITE_CAREERS_SOURCE_DETAIL,
  });
}

/**
 * Run PublicApplyDto's class-validator rules (the global ValidationPipe never
 * sees this object). Droppable optional fields that fail are deleted from the
 * instance and listed in `dropped`; whatever still fails afterwards (a required
 * field) is returned in `errors`. Mutates `dto`.
 */
export async function validatePublicApplyDto(dto: PublicApplyDto): Promise<{ dropped: string[]; errors: string[] }> {
  const droppable: readonly string[] = DROPPABLE_APPLY_FIELDS;
  const dropped: string[] = [];
  let errors = await validate(dto, { whitelist: true });
  for (const e of errors) {
    if (droppable.includes(e.property)) {
      delete (dto as unknown as Record<string, unknown>)[e.property];
      dropped.push(e.property);
    }
  }
  if (dropped.length) errors = await validate(dto, { whitelist: true });
  return { dropped, errors: flattenErrors(errors) };
}
```

  The handler (`careers-apply.handler.ts:70-79`) is unchanged: it already hands the whole `fields` map to `buildPublicApplyDto(f, this.upload.buildPublicUrl(cvKey))`, and `portfolioUrl` never reaches `PublicApplyDto` as a property (so `validate(dto, { whitelist: true })` has nothing to strip). `careers-public/**` is untouched (W56).

- [ ] **Step 4: Run the tests + type-check**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npx jest src/modules/website/handlers/careers-apply --maxWorkers=2
npm run type-check
```
  Expected: `careers-apply.logic.spec.ts` 6 passed, `careers-apply.handler.spec.ts` unchanged and green; `tsc` exit 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git add apps/backend/src/modules/website/handlers/careers-apply.logic.ts apps/backend/src/modules/website/handlers/careers-apply.logic.spec.ts
git commit -m "feat(website): careers.portfolioUrl rides as the cover letter's last paragraph (W16, W56)

No PublicApplyDto field, no applicant column, no migration: 'Portfolio: <url>'
is appended to coverLetter (@db.Text, no DTO cap — nothing truncated or
dropped). The portfolioRequired gate in CareersPublicService.apply() is
deliberately unchanged (W56); a URL does not stand in for an uploaded document
until the owner says so.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — PRD §5.12 (catalog v1.1 + the W46 sync) and §12.2, pinned by the docs guard

- [ ] **Step 1: Write the failing test** — append these two `it`s to `apps/backend/src/modules/website/website-docs-guard.spec.ts` before its final `});` (its last line, 242; `prd` is the `describe`-level constant at line 72):

```ts
  it('PRD §5.12 carries the catalog v1.1 field table and its gotcha, and §12.2 records the change (WP2 T0f, W16)', () => {
    expect(prd).toContain('**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16)');
    expect(prd).toContain('| `partner` | `track` | enum `sourcing` \\| `institute`, exact match, optional |');
    expect(prd).toContain('| `contact` | `topic` | enum `hire` \\| `partner` \\| `permit` \\| `job` \\| `other`, exact match, optional |');
    expect(prd).toContain('| `careers` | `portfolioUrl` | `url` ≤ 500 as typed');
    expect(prd).toContain('- **Catalog v1.1 fields are additive and column-less (W16, 2026-09-20).**');
    expect(prd).toContain('- **2026-09-20 — Website catalog v1.1 (WP2 T0f, W16).**');
  });

  it('PRD §5.12 states the website retry contract as W3 rules it, says sourcePath is not hashed, and records the I12 click-only rule (W46)', () => {
    // The retry contract the website implements (postForm, W3): one retry, network/timeout/5xx only, 8 s, then the fallback panel.
    expect(prd).toContain('the website retries at most ONCE, immediately, and only after a network error, a per-attempt timeout or a 5xx — never after a 4xx — inside an 8 s total budget, then shows the visitor its fallback panel');
    expect(prd).not.toContain('WP2 must retry on any non-2xx');
    // The heartbeat must vary a catalog field: sourcePath is not an input of requestHashFor (website-forms.logic.ts).
    expect(prd).toContain('`sourcePath` is NOT part of `requestHash`');
    expect(prd).not.toContain('a timestamp in `sourcePath`');
    // I12: the website forwards confirm/unsubscribe tokens only on the visitor's click.
    expect(prd).toContain('- **Newsletter confirm/unsubscribe tokens are forwarded only on the visitor\'s click (I12, WP2a).**');
  });
```

  Run line: `cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=2`
  Expected failure: both new `it`s fail on their first `toContain` (the PRD has no "Catalog v1.1" text and still says "WP2 must retry on any non-2xx"); the 18 existing docs-guard tests stay green.

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend && npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=2
```
  Expected: `Tests: 2 failed, 18 passed, 20 total`, the first with `Expected substring: "**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16)"`.

- [ ] **Step 3: Implement** — nine edits to `docs/PRD.md`, every one anchored on a SENTENCE (W45); locate each with the `grep -n` given (each prints exactly one line on `origin/main` 7ea2a93 — if it prints two or none, stop and re-read the section). Edit with the Edit tool on the exact text.

  **(a) The `INQUIRY` handler-table row.** `grep -n '^| \`hire\`, \`contact\`, \`partner\`, \`workers\` | \`INQUIRY\`' docs/PRD.md` → one row. Replace its last cell's ending `; classification only where the form implies one |` with:

```
; classification only where the form implies one. **v1.1 (2026-09-20):** `city` is a `city:` preview line; `partner.track` rides in the tag (`[website:partner:institute]`, classification still `SOURCING_PARTNER`); `contact.topic` prefixes the subject line (`subject: [permit] …`, the first line after the tag) |
```

  **(b) The `callback` row.** `grep -n '^| \`callback\` | \`CALLBACK\` | an Inquiry, classification unset |$' docs/PRD.md` → one row. Replace the whole row with:

```
| `callback` | `CALLBACK` | an Inquiry, classification unset; `city` (v1.1) is a preview line, `topic` stays the older free-text field (a plain line, no subject prefix) |
```

  **(c) The `careers` row.** `grep -n 'the applicant id is the only pointer stored |' docs/PRD.md` → one row (it starts `| \`careers\` | \`CAREERS_APPLY\` |`). Replace its ending `the applicant id is the only pointer stored |` with:

```
the applicant id is the only pointer stored; **v1.1 (2026-09-20):** `portfolioUrl` (the new `url` type — http(s) URL ≤ 500 as typed, `https://` added at the door) is folded into `coverLetter` as a last `Portfolio: <url>` paragraph — no DTO field, no column, no migration; the `portfolioRequired` gate (≥ 1 uploaded `careers-portfolio/` document, §6.5) is unchanged (website ruling W56), so a portfolio-required opening still answers `FAILED` + `error` through the door and the website keeps its "apply by e-mail" branch for those openings |
```

  **(d) The v1.1 field table, after the handler table.** `grep -n 'Operations answers 404 for an inactive key |' docs/PRD.md` → the `newsletter` row, the table's last row. Insert after it a blank line and this block (the next existing line is the blank line before `**Captcha (\`WebsiteCaptchaService\`, P6 / D11, RC7)`):

```
**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.** Additive only: a website build that never sends them is unaffected, none of them has a column (`Inquiry` has no city/subject/topic; `InternalApplicant` has no portfolio URL), no migration ships, no permission key changes (`PERMISSION_KEYS_HASH` unchanged), and no classification rule moves. The catalog gained one field type, `url` (http(s) only, a host containing a dot, no embedded credentials; `https://` is prepended when the scheme is missing; the length cap applies to the value as typed; the rejection reason is `<field> must be a web address`). The website repo's `docs/INTEGRATIONS.md` I4 table mirrors this table (WP2 T14).

| formKey | Field | Rule | Where it lands |
|---|---|---|---|
| `hire`, `workers`, `partner`, `callback`, `contact` | `city` | text ≤ 120, optional | a `city:` line in `messagePreview` (`careers` keeps its own older `city` ≤ 100 — `PublicApplyDto`'s cap — which reaches the applicant's `city` column as before) |
| `partner` | `track` | enum `sourcing` \| `institute`, exact match, optional | the preview tag `[website:partner:<track>]`; classification unchanged (`SOURCING_PARTNER` for both) — the HR-agency track of the Partner page posts to `hire` with `iAm: 'hr_agency'` instead |
| `contact` | `topic` | enum `hire` \| `partner` \| `permit` \| `job` \| `other`, exact match, optional | `subject: [<topic>] <subject>` as the first preview line after the tag (`subject: [job]` alone when the visitor typed no subject); `callback.topic` is the older free-text ≤ 200 field and is unrelated |
| `careers` | `portfolioUrl` | `url` ≤ 500 as typed, optional | the last paragraph of `coverLetter`, `Portfolio: <url>`; does NOT satisfy `Opening.portfolioRequired` (W56) |
```

  **(e) The heartbeat note (W46).** `grep -n 'a timestamp in `sourcePath`' docs/PRD.md` → one line (the `**Test class = the door, not the side effects (P2).**` paragraph). Replace the fragment

```
the monitor must vary one field per post (e.g. a timestamp in `sourcePath`) because identical payloads replay within the hour
```
  with
```
the monitor must vary one CATALOG field's value per post (e.g. a timestamp inside `fields.message`) — `sourcePath` is NOT part of `requestHash` (`requestHashFor` in `website-forms.logic.ts` hashes formKey, isTest, honeypot, locale and the sorted NORMALISED `fields`, so neither `sourcePath` nor a dropped unknown key changes it; corrected 2026-09-20, WP2a T0f) — because identical payloads replay within the hour
```

  **(f) The Idempotency retry sentence (W46 / W3).** `grep -n 'contract: WP2 must retry on any non-2xx' docs/PRD.md` → one line (the `**Idempotency (P8).**` paragraph). Replace the parenthesis

```
(**contract: WP2 must retry on any non-2xx** — every deploy is a 30–60 s 502 window on `/api/website/*`, and a retried submission must land on the same row, not a second one)
```
  with
```
(**contract, website ruling W3 (2026-09-20): the website retries at most ONCE, immediately, and only after a network error, a per-attempt timeout or a 5xx — never after a 4xx — inside an 8 s total budget, then shows the visitor its fallback panel** — every deploy is a 30–60 s 502 window on `/api/website/*`, and that one retried submission must land on the same row, not a second one)
```

  **(g) The "Every deploy" gotcha (W46).** `grep -n 'WP2 must retry on any non-2xx (contract, see the wire contract above)' docs/PRD.md` → one bullet (the last bullet of §5.12's Decisions & gotchas). Replace the whole bullet with:

```
- **Every deploy is a 30–60 s 502 on `/api/website/*`.** The website retries once — after a network error, a timeout or a 5xx only, never a 4xx, inside an 8 s budget — and then shows its fallback panel (website ruling W3; the sentence under Idempotency above is the contract); `WEBSITE_FORMS_UNAVAILABLE` must not fire on a deploy blip (the drought window is hours, the captcha-degraded alarm is once per window).
```

  **(h) The I12 gotcha and the v1.1 gotcha.** Insert the I12 bullet immediately after the bullet that ends `A test-class smoke run must never carry a real subscriber's confirm or unsubscribe token.` (`grep -n "never carry a real subscriber's confirm or unsubscribe token." docs/PRD.md` → one line, the `**The test token never reaches a side effect (P2) — EXCEPT the newsletter routes.**` bullet):

```
- **Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).** The website's `/abone-onay` / `/abonelikten-cik` (`/en/newsletter/*`) pages never call `GET /api/website/v1/newsletter/confirm` or `…/unsubscribe` on page load, prefetch or render — a mail-link scanner would otherwise consume the one-shot confirm token before the subscriber ever sees the page; the token is forwarded by a route handler when the visitor clicks, and the RFC 8058 one-click POST is forwarded as a POST. Recorded here so a future Ops change never assumes the GET is consumed at link-open time (website `docs/INTEGRATIONS.md` I12 carries the same rule).
```

  Then insert the v1.1 bullet immediately after the rewritten "Every deploy" bullet from (g), so it is the new last bullet of the list:

```
- **Catalog v1.1 fields are additive and column-less (W16, 2026-09-20).** `city`, `partner.track`, `contact.topic` and `careers.portfolioUrl` change the preview tag, the subject line, a preview line and the cover letter — never a column, never the classification, never `PERMISSION_KEYS_HASH`. The new `url` field type applies to `portfolioUrl` only: `linkedinUrl` keeps its length-only rule, because retyping it would turn a junk LinkedIn value from a dropped optional (`DROPPABLE_APPLY_FIELDS`, handler) into a 400 at the door and lose the application. `portfolioUrl` does NOT satisfy `Opening.portfolioRequired` — that gate in `CareersPublicService.apply()` wants an uploaded document (§6.5) and website ruling W56 keeps it as it is (letting a link stand in for a document is an owner decision, not a catalog change); until it is taken, the website keeps its "apply by e-mail" branch for portfolio-required openings and sends `portfolioUrl` on the others.
```

  **(i) §12.2 changelog.** `grep -n 'The CMS half is Phase B (§5.12).' docs/PRD.md` → one line (the `- **2026-09-19 — Website module, WP3a (intake door).**` entry, the last entry before `### 12.3`). Insert after it:

```
- **2026-09-20 — Website catalog v1.1 (WP2 T0f, W16).** Additive OPTIONAL fields on the intake catalog — `city` on hire/workers/partner/callback/contact, `partner.track`, `contact.topic`, `careers.portfolioUrl` with the new `url` field type — threaded into the inquiry preview tag / subject line / a preview line and the applicant's cover letter. No migration, no permission change, no classification change; safe whichever state `WEBSITE_MODULE_ENABLED` is in (§5.12). §5.12 also now states the website's W3 retry contract (one retry, 8 s), that `sourcePath` is not hashed, and the I12 click-only rule (W46).
```

  `CLAUDE.md` is NOT edited: no count it states changes (23 modules + 62 resources = 85 keys; ten form keys; six public routes; the door description). `docs/DEPLOYMENT.md` is NOT edited: no env, cron, compose or flip change. The WP3a gate record (`docs/superpowers/plans/2026-09-19-wp3a-gate-record.md`) is not on this branch and is not edited.

- [ ] **Step 4: Run the docs guard + the whole website module suite + the permission-hash invariant + type-check**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=2
npx jest src/modules/website test/permissions/repo-invariants.spec.ts --maxWorkers=2
npm run type-check
```
  Expected: docs guard `Tests: 20 passed, 20 total`; every `src/modules/website/**` spec green (catalog 16, DTO pipe 7, inquiry logic 10, inquiry handler 6, careers logic 6, the rest unchanged); `repo-invariants.spec.ts › PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` green; `tsc` exit 0. None of these needs Postgres/Redis (mocked Prisma, file reads); do not start the dev stack for them.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git add docs/PRD.md apps/backend/src/modules/website/website-docs-guard.spec.ts
git commit -m "docs(website): PRD §5.12 catalog v1.1 field table + gotcha, the W3 retry contract, sourcePath-not-hashed, the I12 click-only rule; §12.2 entry — pinned by the docs guard (W16, W46)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 7 — invariants, full verify, the pre-push boot, push (= production deploy)

- [ ] **Step 1: The "nothing else moved" assertions** (no new test file — shell assertions recorded in the ledger):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git diff --stat origin/main -- packages/ apps/backend/prisma/ CLAUDE.md docs/DEPLOYMENT.md apps/backend/src/modules/careers-public/ apps/backend/src/modules/website/dto/website-form-submit.dto.ts apps/backend/src/modules/website/handlers/careers-apply.handler.ts apps/backend/src/modules/website/handlers/website-inquiry.handler.ts
# expected: NO output (empty diff)
grep -n "PERMISSION_KEYS_HASH = " packages/permissions/src/keys.catalog.ts
# expected: 188:export const PERMISSION_KEYS_HASH = 'ba5427d7b0688c2b783cd58f3a21d384878363a4';
git diff --stat origin/main
# expected: exactly these 10 files —
#   apps/backend/src/modules/website/website-form-catalog.ts, website-form-catalog.spec.ts,
#   dto/website-form-submit.dto.spec.ts, handlers/website-inquiry.logic.ts, handlers/website-inquiry.logic.spec.ts,
#   handlers/website-inquiry.handler.spec.ts, handlers/careers-apply.logic.ts, handlers/careers-apply.logic.spec.ts,
#   website-docs-guard.spec.ts, docs/PRD.md
git log --oneline origin/main..HEAD
# expected: 6 commits (Cycles 1–6), nothing cherry-picked from website/wp3a-intake
git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website branch --show-current
# expected: website/wp3a-intake (the shared worktree was never switched — W47)
```

- [ ] **Step 2: Full verify** (one job at a time — the Mac memory rule):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog/apps/backend
npm run type-check
npx jest src/modules/website test/permissions --maxWorkers=2
npx eslint src/modules/website --ext .ts; echo "eslint exit=$?"
```
  Expected: `tsc` exit 0; every website spec and every `test/permissions` spec green. ESLint is not a gate in this repo (`CLAUDE.md` step 1 is type-check + jest) and `origin/main` 7ea2a93 already reports exactly **5 errors** under `src/modules/website` (verified: `no-control-regex` at `website-form-catalog.ts` `CONTROL_RE`; unused `_drop` at `careers-apply.logic.spec.ts:76` and `careers-apply.handler.spec.ts:157`; unused `_none` at `website-forms.service.spec.ts:290` and `:315`). Expected here: the same `✖ 5 problems (5 errors, 0 warnings)`, the same five locations (line numbers shift only inside files this task grew) — a sixth finding is a regression you introduced. Those five are not this task's to fix (out of scope on a production push).

- [ ] **Step 3: The pre-push production-compose boot** — required by `docs/DEPLOYMENT.md` § "Booting the production compose file locally (plan D24 — before every website-programme push)": run it FROM THIS WORKTREE ("Run it from the checkout you are about to push"), stop the dev stack first, boot `docker-compose.vps.yml` with the throwaway `.env.local-prod` from that recipe, and confirm every line the recipe marks `→` (the conformance line with `0 undecorated`, health 200, the `404 → 401` flip with `restarts=0`, the seed step's `website-form-seed` agreeing with the catalog). A catalog-only change cannot drift the permission catalog or the schema, but the recipe is the programme's rule for every Operations push. Paste the `→` lines into the WP2a ledger (`docs/superpowers/plans/2026-09-20-wp2a-foundation.md` in the website repo, W22/W57) under T0f. Then restart the dev stack as the recipe says. Nothing else builds while the images build.

- [ ] **Step 4: Push** — this is a PRODUCTION DEPLOY of Operations (the VPS cron poller builds and restarts within ~2 min; every deploy is a 30–60 s 502 window on `/api/website/*`, PRD §5.12 gotcha). Check the door's live state first — the owner has now provided the Turnstile secret and the second alert recipient, so the WP3a flip may already have happened:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://operations.jobsadmire.com/api/website/v1/ping
# 404 → WEBSITE_MODULE_ENABLED is still off: the change deploys dark, nothing visitor-facing changes.
# 200 → the flag is on: the change is still additive/backwards-compatible (the WP1 site posts no forms until
#        WP2b lands), so the only visible effect is the usual 30–60 s 502 window on /api/website/*.
```
  Rollback, should the deploy misbehave, is the code half of `docs/DEPLOYMENT.md` § "Rolling back the WP3a pushes": `git revert <sha>` on `main`, never a force-push — there is no migration half here.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-catalog
git fetch origin
git rebase origin/main                      # no-op unless main moved while you worked; if it did, re-run Step 2
git push -u origin website/catalog-ext
git push origin website/catalog-ext:main    # fast-forward = the deploy
```

  Verify by artifact, never by prod `git rev-parse` (`docs/DEPLOYMENT.md` § "Verifying a deploy landed"; `CLAUDE.md` step 5):

```bash
ssh jobsadmire_portal "tail -n 3 /var/www/html/jobsadmire-operations/deploy.log"        # → 'Deploy finished for <your sha>' (allow ~10 min)
curl -s -o /dev/null -w '%{http_code}\n' https://operations.jobsadmire.com/api/health    # 200
curl -s -o /dev/null -w '%{http_code}\n' https://operations.jobsadmire.com/api/website/v1/ping   # the same code as before the push (404 dark / 200 on)
```

  The shared worktree needs nothing: it is still on `website/wp3a-intake @ 6de20cb`. Keep the catalog worktree until the ledger entry is written; remove it afterwards with `git -C /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations worktree remove ../jobsadmire-operations-catalog` (the branch stays on origin).

- [ ] **Step 5: Ledger + hand-off** — record in the WP2a ledger under T0f: the six commit SHAs, the deploy SHA and the `Deploy finished` line, the ping code before and after the push, the `→` lines of Step 3, and the sentence "`portfolioRequired` gate unchanged per W56 — owner decision pending (see deviations)". Hand the **Produces** block above to the WP2b page writers (T3 Hire, T5 Partner, T7 Contact, T8 Available Workers, T11 Careers) and to T14 (INTEGRATIONS.md I4 per-form table). No further commit.

---

**Docs in this task** (all in the Operations repo's `docs/PRD.md`, edited on sentence anchors per W45; every string below is pinned by `website-docs-guard.spec.ts`, P13):
- §5.12 "Forms and handlers" table — three rows amended: the `INQUIRY` row gains the sentence beginning `**v1.1 (2026-09-20):** \`city\` is a \`city:\` preview line`; the `callback` row becomes `an Inquiry, classification unset; \`city\` (v1.1) is a preview line, \`topic\` stays the older free-text field …`; the `careers` row gains `**v1.1 (2026-09-20):** \`portfolioUrl\` (the new \`url\` type …` ending with the W56 sentence (Cycle 6 Step 3 (a)–(c), verbatim there).
- §5.12 — the new paragraph + four-row table `**Catalog v1.1 (2026-09-20, WP2 T0f, website ruling W16) — the OPTIONAL fields added for the designed pages.**` inserted after the handler table's `newsletter` row (Cycle 6 Step 3 (d)).
- §5.12 "Test class = the door" paragraph — the heartbeat clause now reads `the monitor must vary one CATALOG field's value per post … \`sourcePath\` is NOT part of \`requestHash\` …` (W46; Cycle 6 Step 3 (e)).
- §5.12 "Idempotency (P8)" paragraph — the retry contract now reads `**contract, website ruling W3 (2026-09-20): the website retries at most ONCE, immediately, and only after a network error, a per-attempt timeout or a 5xx — never after a 4xx — inside an 8 s total budget, then shows the visitor its fallback panel**` (W46; Cycle 6 Step 3 (f)).
- §5.12 Decisions & gotchas — the "Every deploy is a 30–60 s 502" bullet rewritten to the W3 rule (Cycle 6 Step 3 (g)); the new bullet `**Newsletter confirm/unsubscribe tokens are forwarded only on the visitor's click (I12, WP2a).**` after the test-token bullet; the new last bullet `**Catalog v1.1 fields are additive and column-less (W16, 2026-09-20).**` (Cycle 6 Step 3 (h)).
- §12.2 — the entry `**2026-09-20 — Website catalog v1.1 (WP2 T0f, W16).**` after the WP3a entry (Cycle 6 Step 3 (i)).
- `apps/backend/src/modules/website/website-docs-guard.spec.ts` — two new `it`s pin the strings above and assert the two superseded sentences (`WP2 must retry on any non-2xx`, `a timestamp in \`sourcePath\``) are gone.
- NOT in this task (other tasks own them): the website repo's `docs/INTEGRATIONS.md` I4 per-form wire-contract table (T14, per interfaces.md T0f; Task 2 already wrote I4/I5/I12 as built, including the same retry and click-only rules, so the two repos agree after Cycle 6), `docs/ARCHITECTURE.md` § Forms flow in the website repo (Task 2), Operations `CLAUDE.md` (no count changes), Operations `docs/DEPLOYMENT.md` (no env/cron/compose change), the WP3a gate record (its own branch).

**Produces — deviations:**
1. `portfolioUrl` is realised as a NEW catalog field type `url` (`WebsiteFieldType` gains `'url'`; http(s) only, host with a dot, no credentials, `https://` prepended when missing, cap on the value as typed) rather than a `text` + `pattern` — interfaces.md said "url ≤500" without fixing the mechanism. `linkedinUrl` is deliberately NOT retyped (a junk LinkedIn value stays a dropped optional, never a 400).
2. `portfolioUrl` is stored as the LAST paragraph of `coverLetter` (`Portfolio: <url>`) — there is no applicant column and no migration is allowed; `PublicApplyDto` is untouched. **The `Opening.portfolioRequired` gate in `CareersPublicService.apply()` is NOT relaxed — settled by W56** (owner decision pending), so a portfolio-required opening still returns `status: 'FAILED'` + `error: 'This position requires at least one portfolio document'` (HTTP 200) through the door and W16's "so portfolio openings can be applied to" is read accordingly. If the owner later says yes, the recipe is a ~6-line follow-up in careers-public, not this task: `PublicApplyDto.portfolioUrl?: string` (`@IsOptional() @Trim() @IsUrl({ require_protocol: true }) @MaxLength(500)`), `apply()` line 618 → `if (opening.portfolioRequired && portfolio.length === 0 && !dto.portfolioUrl)`, `apply()` folding the line into `coverLetter` itself instead of the website handler, PRD §5.4/§6.5 amended. Until then the website (T11 Careers) keeps W3's "apply by e-mail" branch for `portfolioRequired` openings and sends `portfolioUrl` on the others.
3. "`topic` maps to `subject` prefix" is realised inside `messagePreview` as `subject: [<topic>] <subject>` (first line after the tag) — `Inquiry` has no `subject` column; `callback.topic` (older, free text) is untouched. "`track` prefixed in `messagePreview`" is realised as the tag `[website:partner:<track>]`.
4. The enum fields `track`/`topic` carry `max: 40` like `iAm` (a 41-char value reports `too long`, a wrong value reports the enum message) — two extra rejection reasons beyond the skeleton's list.
5. The Operations repo has no `npm run verify`; every Step 4 uses its `CLAUDE.md` equivalents (`npm run type-check` + `npx jest <paths> --maxWorkers=2`). ESLint is not a gate there and `origin/main` already carries five errors under `src/modules/website` (`no-control-regex` on the catalog's `CONTROL_RE`; unused `_drop`/`_none` bindings in `careers-apply.logic.spec.ts`, `careers-apply.handler.spec.ts`, `website-forms.service.spec.ts`); this task adds no finding (its new spec code avoids unused destructured bindings) and does not fix those five (out of scope, would widen the diff on a production push).
6. Per W46 this task also carries three §5.12 corrections that are not catalog work (the W3 retry sentence, the `sourcePath`-is-not-hashed heartbeat note — `requestHashFor` hashes the NORMALISED `fields`, so the note also says a dropped unknown key changes nothing — and the I12 click-only rule), each pinned by the docs guard.
7. Per W47 the task runs in a third Ops worktree (`jobsadmire-operations-catalog`, branch `website/catalog-ext` off `origin/main` 7ea2a93) instead of switching `jobsadmire-operations-website`; Step 0 therefore includes `npm ci` + `prisma generate` there.
8. interfaces.md T0f names `apps/backend/src/modules/website/forms/website-form-catalog.ts`; the real file is `apps/backend/src/modules/website/website-form-catalog.ts` (no `forms/` directory exists) — interfaces.md is the one to correct.
