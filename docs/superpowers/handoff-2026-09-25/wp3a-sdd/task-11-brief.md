### Task 11: Frontend — `website` module nav, route manifest, messages, Forms inbox, Integrations screen, `lib/api/website.ts`

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations), `apps/frontend`, on the WP3a branch/worktree after Tasks 1–10 have landed. Frontend only — no backend file is touched here. Rulings applied: P1 (the screens read `GET /api/website/status` at runtime and show a banner while the door is off; nothing here depends on `WEBSITE_MODULE_ENABLED`), P3 (page gates: inbox = `website.forms` VIEW, export button = `website.forms` EXPORT through the DEDICATED export route, re-run = `website.forms` EDIT, integrations PAGE = `website.integrations` VIEW, second-human save = `website.integrations` EDIT, every secret control = `website` MANAGE_KEYS gated inside the page), P7 (has* chips, write-only inputs, rotate shown once, 24 h previous-token note), P8 (needs-attention = FAILED or captchaDegraded; re-run only when `status = FAILED && createdEntityId IS NULL`), P9 (second-human fields), P14 (nav entry, `inbox` path segment — the `forms` crumb already means the Market Research Form Builder — PageShell + FilterBar + DataTable + SidePanel + ExportCsvButton), RC1 (real producers: Task 1 = keys, labels, `GET /website/status`; Task 3 = `@jobsadmire/constants` enums + form-key constants — the single source, this file re-declares none of them; Task 4 = integrations routes; Task 7 = ALL inbox routes; Task 10 = the notification deep-link `/website/inbox?row=<id>` this page honours), RC2 (`tokenClass` on the row type), RC5 (fraud/careers field names the payload summary reads), RC9 (`POST /website/integrations/test` → `{ ok, error }`, `POST /website/integrations/rotate/:name` → `{ name, secret, previousExpiresAt }`, nullable settings body), RC23/RC27 (a fraud row's evidence is listed in the detail panel — `view` bearer-fetches Task 8's streamed `…/submissions/:id/evidence/:index/view` route into a new tab, `link` copies the presigned URL from `…/link`), RC24 (search is case-insensitive for e-mail only), RC26 (`handlerResultJson.visitorError` is worded as the visitor's own mistake in the panel), RC15 (every file printed in final form; every anchor quoted by its line text — the line numbers in the consistency check had already drifted).

**Files:**
- Create `apps/frontend/src/lib/api/website.ts`
- Create `apps/frontend/src/lib/api/website.spec.ts`
- Create `apps/frontend/src/config/website-nav.spec.ts`
- Create `apps/frontend/src/app/[locale]/admin/website/page.tsx` (module root → redirect to the inbox)
- Create `apps/frontend/src/app/[locale]/admin/website/_flag-banner.tsx`
- Create `apps/frontend/src/app/[locale]/admin/website/inbox/page.tsx`
- Create `apps/frontend/src/app/[locale]/admin/website/integrations/page.tsx`
- Modify `apps/frontend/src/config/modules.ts` — the lucide import list (one line `  Globe,` inserted after the line `  FolderOpen,`), and one new `ModuleEntry` inserted after the `marketing` entry's closing `  },` (the line right after `    ],` that closes `subRail`, whose last leaf is `label: 'Tools'`) and before the `  {` whose first inner line is `    // "My HR" — the EMPLOYEE self-service surface (check in / check out,`
- Modify `apps/frontend/src/config/route-permissions.ts` — three lines after `  { pattern: '/admin/sales/expenses', key: 'travel-expenses' },` and before the blank line that precedes `  // ── HRM — screen-level keys (W3) ─────────────────────────────────────────`
- Modify `apps/frontend/src/config/route-permissions.spec.ts` — one `it(...)` inside `describe('resolveRoutePermission', () => {`, inserted after the closing `  });` of `it('prefers a literal segment over a [param] one', () => {` and before `  it('treats a trailing /** as covering the bare path too', () => {`
- Modify `apps/frontend/src/lib/breadcrumbs-from-path.ts` — two `SEGMENT_LABELS` entries after the line `  lessons: 'Lessons',` (the last entry before `};`)
- Modify `apps/frontend/src/lib/breadcrumbs-from-path.spec.ts` — two sample paths after `      '/en/admin/settings/countries',` inside the `paths` array
- Modify `apps/frontend/src/messages/en.json` — `nav.breadcrumbs` (after `      "lessons": "Lessons",`, before `      "root": {`), `sidebar.admin` (after `      "marketingDashboard": "Marketing Dashboard",`), `guide` (before `    "admin_sales_inquiries": {`)
- Modify `apps/frontend/src/messages/tr.json` — the same three anchors: `      "lessons": "Dersler",` / `      "root": {`, `      "marketingDashboard": "Pazarlama Paneli",`, `    "admin_sales_inquiries": {`
- Test: `apps/frontend/src/lib/api/website.spec.ts`, `apps/frontend/src/config/website-nav.spec.ts`, `apps/frontend/src/config/route-permissions.spec.ts`, `apps/frontend/src/lib/breadcrumbs-from-path.spec.ts`, `apps/frontend/src/components/auth/not-authorized.spec.tsx` (re-run only — proves Task 1's labels and this task's keys meet), `npx tsc --noEmit` in `apps/frontend`

**Interfaces:**
- Consumes (Task 1 — permission skeleton, RC1): `PermissionKey` from `@jobsadmire/permissions` includes `'website'`, `'website.forms'`, `'website.integrations'` (P3), so `permission: { module: 'website.forms', action: 'VIEW' }` and `<Can module="website" action="MANAGE_KEYS">` type-check; `permissions.keys.website`, `permissions.keys.website__forms`, `permissions.keys.website__integrations` (and the other seven) exist in BOTH `en.json` and `tr.json` — Task 1 owns those labels; this task adds none. `GET /api/website/status` (`@SelfService()`, `WebsiteStatusController`) → `{ data: { enabled: boolean } }` (P1).
- Consumes (Task 3 — `@jobsadmire/constants`, RC1): `export enum WebsiteFormKind { INQUIRY, CAREERS_APPLY, NEWSLETTER, FRAUD_REPORT, CALLBACK, VISIT, CALCULATOR_QUOTE }`, `export enum WebsiteSubmissionStatus { RECEIVED, HANDLED, FAILED, SPAM }`, `export enum WebsiteTokenClass { WRITE, TEST, PREVIOUS_WRITE }` (string enums, value = name), `export const WEBSITE_FORM_KEYS = ['hire','contact','partner','workers','callback','visit','calculator','careers','fraud','newsletter'] as const`, `export type WebsiteFormKey`. (`WEBSITE_FORM_KIND_BY_KEY` and `isWebsiteFormKey` also exist there; the UI does not need them because every inbox row carries `formKind`.) The frontend resolves `@jobsadmire/constants` to `../../packages/constants/src` through `tsconfig.json` `paths`, which `next/jest`'s SWC transform honours (the `not-authorized.spec.tsx` → `@jobsadmire/permissions` precedent), so neither `tsc` nor Jest depends on `packages/constants/dist`.
- Consumes (Task 4 — integrations, RC9), all under `@Controller('website/integrations')`, bodies wrapped `{ data }`:
  - `GET /api/website/integrations` — `@RequirePermission('website.integrations', 'VIEW')` → `WebsiteIntegrationPublicShape` (`has*` booleans, never a secret; dates arrive as ISO strings — the `WebsiteIntegrationConfig` client type below mirrors it field for field).
  - `PATCH /api/website/integrations` — `('website.integrations', 'EDIT')`, body `{ secondHumanEmail?: string | null; secondHumanName?: string | null }` (`undefined` keeps, `null`/`''` clears; P9).
  - `PATCH /api/website/integrations/keys` — `('website', 'MANAGE_KEYS')`, body `{ turnstileSecret?: string; revalidateSecret?: string }` (`undefined` keeps, `''` clears; P7).
  - `POST /api/website/integrations/rotate/:name` — `('website', 'MANAGE_KEYS')`, `:name ∈ 'writeToken' | 'testToken'`, no body → `{ name, secret, previousExpiresAt: string | null }` (server-generated, returned ONCE; the previous write token stays valid 24 h — P7).
  - `POST /api/website/integrations/test` — `('website', 'MANAGE_KEYS')`, no body → `{ ok: boolean; error: string | null }`; persists `lastTestedAt/lastTestOk/lastTestError`.
- Consumes (Task 7 — the admin inbox controller `WebsiteFormsInboxController`, `@Controller('website/forms/submissions')`, RC1), all `{ data, meta }` / `{ data }`:
  - `GET /api/website/forms/submissions` — `('website.forms', 'VIEW')`. Query (this is the wire contract Task 7's `QueryWebsiteSubmissionsDto` accepts — strings, because they travel as a query string): `page?: number`, `limit?: number`, `search?: string` (the submission id, the created entity id, and `name` / `company` / `email` / `phone` / `reporterName` / `reporterEmail` inside `payloadJson.fields`; RC24 — Prisma JSON filters have no `mode`, so e-mail is matched lowercased and the rest are CASE-SENSITIVE in WP3a; the search placeholder says so), `formKey?: string`, `status?: 'RECEIVED' | 'HANDLED' | 'FAILED' | 'SPAM'`, `needsAttention?: 'true'` (→ `status = FAILED OR captchaDegraded = true`, P8), `isTest?: 'true' | 'false'` (omitted → both), `from?: string`, `to?: string` (ISO dates, inclusive bounds on `createdAt`). Response `{ data: WebsiteFormSubmission[], meta: { total, page, limit, totalPages } }`, newest first, every row being Task 7's `WebsiteInboxRow` — `id, formKey, formKind` (the joined `form.kind`), `status, isTest, locale, captchaPassed, captchaDegraded, createdEntityType, createdEntityId, error, handledAt, purgeAfter, consentVersion, payloadJson` (the `{ fields, sourcePath? }` object Task 6 stores), `createdAt` — and NOTHING else: no `formId`, no hashes, no `tokenClass`, `handlerResultJson`, `userAgent` or `updatedAt` (those four are the detail's, `WebsiteInboxDetail`).
  - `GET /api/website/forms/submissions/export` (same query, no paging cap below 100) — `('website.forms', 'EXPORT')`, `@AuditEntity('WebsiteFormSubmission')` — the DEDICATED export route (P3); same `{ data, meta }` shape so `ExportCsvButton.fetchPage` walks it. Task 7 declares this route BEFORE `submissions/:id` in the controller (Nest matches in declaration order).
  - `GET /api/website/forms/submissions/:id` — `('website.forms', 'VIEW')` → `WebsiteInboxDetail` = the list row plus `tokenClass`, `handlerResultJson` (`{ attempts: WebsiteAttemptRecord[]; visitorError?: true } | null` — RC26), `userAgent`, `updatedAt`.
  - `GET /api/website/forms/submissions/:id/evidence/:index/view` (streams the object inline with `nosniff` + a strict CSP; bearer-fetched into a blob like `DocumentViewerDialog`) and `GET /api/website/forms/submissions/:id/evidence/:index/link` → `{ data: { url, fileName } }` (15-minute presign) — both `('website.forms', 'VIEW')`, Task 8's `WebsiteFormsEvidenceController` (RC23); `:index` is the position in `payloadJson.fields.evidenceKeys` of a `FRAUD_REPORT` row; 404 for any other row.
  - `POST /api/website/forms/submissions/:id/rerun` — `('website.forms', 'EDIT')`, `@AuditEntity('WebsiteFormSubmission')` → `{ data: WebsiteFormSubmission }` (the updated row); 404 unknown id; 409 unless `status = FAILED && createdEntityId IS NULL` (P8).
  - Only `lib/api/website.ts` names these paths — no screen imports a path literal (the evidence view URL is built by `websiteEvidenceViewUrl()` there, the `applicantDocumentViewUrl` precedent).
- Consumes (Task 10 — notifications, RC1): `getEntityPath(locale, 'website-submission', id)` → `/<locale>/admin/website/inbox?row=<id>`, `TYPE_FALLBACKS` `['WEBSITE_', '/website/inbox']`, backend `emailLinkPath` → `/admin/website/inbox?row=<submissionId>`. The inbox page reads `?row=<id>` and opens that submission's side panel (Task 10's draft called the page "Task 12's" — it is this task).
- Produces:
  - `apps/frontend/src/lib/api/website.ts`: types `WebsiteFormKindValue = `${WebsiteFormKind}``, `WebsiteSubmissionStatusValue = `${WebsiteSubmissionStatus}``, `WebsiteTokenClassValue = `${WebsiteTokenClass}``, `WebsiteStoredPayload { fields: Record<string, string | string[]>; sourcePath?: string }`, `WebsiteAttemptRecord`, `WebsiteHandlerResult { attempts: WebsiteAttemptRecord[]; visitorError?: true }`, `WebsiteFormSubmission` (Task 7's list row; `tokenClass`, `handlerResultJson`, `userAgent`, `updatedAt` optional — present on the detail), `WebsiteSubmissionsQuery`, `WebsitePayloadSummary { name; email; phone }`, `WebsiteEvidenceLink { url; fileName }`, `websiteEvidenceKeysOf(payload): string[]`, `websiteEvidenceViewUrl(id, index): string`, `WebsiteIntegrationConfig`, `UpdateWebsiteIntegrationSettingsInput`, `UpdateWebsiteIntegrationKeysInput`, `WebsiteRotatableSecret = 'writeToken' | 'testToken'`, `WebsiteRotatedSecret`, `WebsiteConnectionTestResult { ok: boolean; error: string | null }`; constants `WEBSITE_FORM_KEY_LABELS: Record<WebsiteFormKey, string>`, `WEBSITE_FORM_KIND_LABELS: Record<WebsiteFormKindValue, string>`, `WEBSITE_SUBMISSION_STATUSES: WebsiteSubmissionStatusValue[]` (derived from the enum at runtime), `WEBSITE_SUBMISSION_STATUS_LABELS`, `WEBSITE_SUBMISSION_STATUS_TONES`; functions `websiteSubmissionNeedsAttention(row): boolean`, `websiteSubmissionCanRerun(row): boolean`, `websitePayloadSummary(payload: WebsiteStoredPayload | null | undefined): WebsitePayloadSummary`; clients `websiteStatusApi.get()`, `websiteFormsApi.list(query)`, `.get(id)`, `.export(query)`, `.rerun(id)`, `.evidenceLink(id, index)` (RC23/RC27), `websiteIntegrationsApi.get()`, `.update(body)`, `.updateKeys(body)`, `.rotateSecret(name)`, `.testConnection()`.
  - `MODULES` entry `slug: 'website'` (between `marketing` and `my-hr`; `permission: { module: 'website', action: 'VIEW' }`; leaves `/inbox` on `website.forms` VIEW and `/integrations` on `website.integrations` VIEW; `labelKey`s `websiteInbox`, `websiteIntegrations`).
  - `ROUTE_PERMISSIONS` lines `/admin/website` → `website.forms`, `/admin/website/inbox` → `website.forms`, `/admin/website/integrations` → `website.integrations` (all VIEW).
  - `SEGMENT_LABELS.website = 'Website'`, `SEGMENT_LABELS.inbox = 'Inbox'`; messages `nav.breadcrumbs.website|inbox`, `sidebar.admin.website|websiteInbox|websiteIntegrations`, `guide.admin_website_inbox`, `guide.admin_website_integrations` in en + tr.
  - Pages `/[locale]/admin/website` (redirect), `/[locale]/admin/website/inbox` (reads `?row=<id>`; a `FRAUD_REPORT` row's panel lists its evidence with **View** — bearer blob-fetch of the streamed route, opened in a new tab — and **Copy link** — the presigned URL to the clipboard — RC27), `/[locale]/admin/website/integrations`; `WebsiteModuleFlagBanner` (`_flag-banner.tsx`).

- [ ] **Step 1: Write the failing tests**

`apps/frontend/src/lib/api/website.spec.ts`:

```ts
/**
 * The website client's pure halves (WP3a): the presentation maps must cover
 * every value the shared enums can produce (the ten form keys, the seven
 * handler kinds, the four statuses — all from `@jobsadmire/constants`, RC1),
 * the needs-attention and re-run predicates (P8), and the payload summariser
 * the inbox's Contact column and CSV export flatten with (RC5 field names).
 *
 * `whatsapp-campaigns.spec.ts` precedent: pure functions only, no network.
 */
import { describe, expect, it } from '@jest/globals';
import { WEBSITE_FORM_KEYS, WebsiteFormKind, WebsiteSubmissionStatus } from '@jobsadmire/constants';

import {
  WEBSITE_FORM_KEY_LABELS,
  WEBSITE_FORM_KIND_LABELS,
  WEBSITE_SUBMISSION_STATUSES,
  WEBSITE_SUBMISSION_STATUS_LABELS,
  WEBSITE_SUBMISSION_STATUS_TONES,
  websiteEvidenceKeysOf,
  websiteEvidenceViewUrl,
  websitePayloadSummary,
  websiteSubmissionCanRerun,
  websiteSubmissionNeedsAttention,
  type WebsiteFormSubmission,
} from './website';

function row(over: Partial<WebsiteFormSubmission> = {}): WebsiteFormSubmission {
  return {
    id: 'cmwebsite000000000000001',
    formKey: 'hire',
    formKind: 'INQUIRY',
    status: 'HANDLED',
    isTest: false,
    tokenClass: 'WRITE',
    locale: 'tr',
    consentVersion: 'privacy-2026-09',
    captchaPassed: true,
    captchaDegraded: false,
    createdEntityType: 'inquiry',
    createdEntityId: 'cminq0000000000000000001',
    error: null,
    handledAt: '2026-09-19T08:00:00.000Z',
    purgeAfter: '2026-12-18T08:00:00.000Z',
    payloadJson: {
      fields: { name: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '+905551112233' },
      sourcePath: '/tr/isci-bul',
    },
    createdAt: '2026-09-19T08:00:00.000Z',
    updatedAt: '2026-09-19T08:00:00.000Z',
    ...over,
  };
}

describe('the presentation maps cover the shared vocabulary (RC1: @jobsadmire/constants is the source)', () => {
  it('labels every one of the ten website form keys', () => {
    expect(Object.keys(WEBSITE_FORM_KEY_LABELS).sort()).toEqual([...WEBSITE_FORM_KEYS].sort());
  });

  it('labels every handler kind', () => {
    expect(Object.keys(WEBSITE_FORM_KIND_LABELS).sort()).toEqual(Object.values(WebsiteFormKind).sort());
  });

  it('lists, labels and tones every submission status — a missing tone renders an untoned chip', () => {
    const fromEnum = Object.values(WebsiteSubmissionStatus).sort();
    expect([...WEBSITE_SUBMISSION_STATUSES].sort()).toEqual(fromEnum);
    expect(Object.keys(WEBSITE_SUBMISSION_STATUS_LABELS).sort()).toEqual(fromEnum);
    expect(Object.keys(WEBSITE_SUBMISSION_STATUS_TONES).sort()).toEqual(fromEnum);
    for (const s of WEBSITE_SUBMISSION_STATUSES) {
      expect(typeof WEBSITE_SUBMISSION_STATUS_TONES[s]).toBe('string');
    }
  });
});

describe('websiteSubmissionNeedsAttention (P8: FAILED or captchaDegraded)', () => {
  it('is true for FAILED', () => {
    expect(websiteSubmissionNeedsAttention(row({ status: 'FAILED' }))).toBe(true);
  });
  it('is true for a handled row that was accepted with a degraded captcha', () => {
    expect(websiteSubmissionNeedsAttention(row({ captchaDegraded: true, captchaPassed: null }))).toBe(true);
  });
  it('is false for a clean HANDLED / RECEIVED / SPAM row', () => {
    expect(websiteSubmissionNeedsAttention(row())).toBe(false);
    expect(websiteSubmissionNeedsAttention(row({ status: 'RECEIVED' }))).toBe(false);
    expect(websiteSubmissionNeedsAttention(row({ status: 'SPAM' }))).toBe(false);
  });
});

describe('websiteSubmissionCanRerun (P8: FAILED && createdEntityId IS NULL)', () => {
  it('offers re-run only when the handler failed before creating anything', () => {
    expect(
      websiteSubmissionCanRerun(row({ status: 'FAILED', createdEntityId: null, createdEntityType: null })),
    ).toBe(true);
  });
  it('refuses a FAILED row that already created an entity — a re-run would file it twice', () => {
    expect(websiteSubmissionCanRerun(row({ status: 'FAILED' }))).toBe(false);
  });
  it('refuses every non-FAILED status', () => {
    for (const status of ['RECEIVED', 'HANDLED', 'SPAM'] as const) {
      expect(websiteSubmissionCanRerun(row({ status, createdEntityId: null }))).toBe(false);
    }
  });
});

describe('websitePayloadSummary', () => {
  it('reads name / email / phone under the common field names', () => {
    expect(websitePayloadSummary(row().payloadJson)).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+905551112233',
    });
  });
  it('composes a name from firstName + lastName and accepts phoneNumber / contactName', () => {
    expect(
      websitePayloadSummary({
        fields: { firstName: 'Ali', lastName: 'Veli', phoneNumber: '+90 555', contactName: 'ignored' },
      }),
    ).toEqual({ name: 'Ali Veli', email: null, phone: '+90 555' });
    expect(websitePayloadSummary({ fields: { contactName: 'Mehmet' } }).name).toBe('Mehmet');
  });
  it('reads the fraud report\'s reporter* fields (RC5)', () => {
    expect(
      websitePayloadSummary({
        fields: {
          reporterName: 'Zeynep',
          reporterEmail: 'z@example.com',
          reporterPhone: '+905550000000',
          evidenceKeys: ['website-fraud/a.pdf'],
        },
      }),
    ).toEqual({ name: 'Zeynep', email: 'z@example.com', phone: '+905550000000' });
  });
  it('websiteEvidenceKeysOf reads a fraud row\'s evidenceKeys, prefix-locked, and is empty otherwise (RC27)', () => {
    expect(
      websiteEvidenceKeysOf({ fields: { description: 'x', evidenceKeys: ['website-fraud/a.pdf', 'careers-cv/x.pdf', 'website-fraud/b.png'] } }),
    ).toEqual(['website-fraud/a.pdf', 'website-fraud/b.png']);
    expect(websiteEvidenceKeysOf({ fields: { evidenceKeys: 'website-fraud/one.pdf' } })).toEqual([]);
    expect(websiteEvidenceKeysOf({ fields: { name: 'A' } })).toEqual([]);
    expect(websiteEvidenceKeysOf(null)).toEqual([]);
  });

  it('websiteEvidenceViewUrl targets the inbox evidence family (RC23)', () => {
    expect(websiteEvidenceViewUrl('sub1', 0)).toMatch(/\/website\/forms\/submissions\/sub1\/evidence\/0\/view$/);
  });

  it('ignores array-valued and blank fields, and never throws on a missing payload', () => {
    expect(websitePayloadSummary({ fields: { name: ['a', 'b'], email: '   ' } })).toEqual({
      name: null,
      email: null,
      phone: null,
    });
    expect(websitePayloadSummary(null)).toEqual({ name: null, email: null, phone: null });
    expect(websitePayloadSummary(undefined)).toEqual({ name: null, email: null, phone: null });
    expect(websitePayloadSummary({} as WebsiteFormSubmission['payloadJson'])).toEqual({
      name: null,
      email: null,
      phone: null,
    });
  });
});
```

`apps/frontend/src/config/website-nav.spec.ts`:

```ts
/**
 * The `website` nav entry and the route manifest cannot drift (WP3a, P14).
 *
 * The sub-rail gate is STRICT `can()` and the page gate is the manifest line:
 * a leaf whose permission differs from its page's line is either an invisible
 * link to a reachable page or a visible link that lands on NotAuthorized
 * (`SubRailItem.permission` docstring in modules.ts vs `PageGuard`). This pins
 * the two together for the one module whose screens ship behind a backend
 * flag, where nobody will click through for a while.
 */
import { describe, expect, it } from '@jest/globals';

import { MODULES, getSubRailGroups } from './modules';
import { ROUTE_PERMISSIONS, resolveRoutePermission } from './route-permissions';

describe('the website module entry', () => {
  const entry = MODULES.find((m) => m.slug === 'website');

  it('exists, is gated on the module key at VIEW, and sits between marketing and my-hr', () => {
    expect(entry).toBeDefined();
    expect(entry?.permission).toEqual({ module: 'website', action: 'VIEW' });
    expect(entry?.footer).toBeUndefined();
    const slugs = MODULES.map((m) => m.slug);
    expect(slugs.indexOf('website')).toBe(slugs.indexOf('marketing') + 1);
    expect(slugs.indexOf('my-hr')).toBe(slugs.indexOf('website') + 1);
  });

  it('offers exactly the two WP3a leaves, on the `inbox` segment (never `forms`)', () => {
    const items = getSubRailGroups('website', 'en').flatMap((g) => g.items);
    expect(items.map((i) => i.href)).toEqual([
      '/en/admin/website/inbox',
      '/en/admin/website/integrations',
    ]);
    expect(items.map((i) => i.labelKey)).toEqual(['websiteInbox', 'websiteIntegrations']);
  });

  it('every leaf carries the SAME key and action as its manifest line', () => {
    const items = getSubRailGroups('website', 'en').flatMap((g) => g.items);
    for (const item of items) {
      const resolved = resolveRoutePermission(item.href);
      expect(resolved).not.toBeNull();
      expect(resolved).not.toBe('self-service');
      if (resolved && resolved !== 'self-service') {
        expect(item.permission).toEqual({ module: resolved.key, action: resolved.action ?? 'VIEW' });
      }
    }
  });

  it('the module root redirects to the inbox and declares the inbox key', () => {
    // The Marketing redirect precedent (route-permissions.ts, "A REDIRECT page
    // declares its TARGET's key"): the visitor is refused here, not there.
    expect(ROUTE_PERMISSIONS.find((r) => r.pattern === '/admin/website')).toEqual({
      pattern: '/admin/website',
      key: 'website.forms',
    });
  });

  it('the integrations page is the SCREEN key at VIEW — secrets are gated inside it (P3)', () => {
    expect(resolveRoutePermission('/tr/admin/website/integrations')).toEqual({
      pattern: '/admin/website/integrations',
      key: 'website.integrations',
    });
  });
});
```

`apps/frontend/src/config/route-permissions.spec.ts` — inside `describe('resolveRoutePermission', () => {`, after the closing `  });` of the `it('prefers a literal segment over a [param] one', () => {` case and before `  it('treats a trailing /** as covering the bare path too', () => {`, insert:

```ts
  it('maps the website inbox to website.forms and its root redirect to the same key (WP3a)', () => {
    expect(resolveRoutePermission('/en/admin/website/inbox')).toEqual({
      pattern: '/admin/website/inbox',
      key: 'website.forms',
    });
    expect(resolveRoutePermission('/en/admin/website')).toEqual({
      pattern: '/admin/website',
      key: 'website.forms',
    });
  });

```

`apps/frontend/src/lib/breadcrumbs-from-path.spec.ts` — inside the `paths` array, after `      '/en/admin/settings/countries',`, insert:

```ts
      '/en/admin/website/inbox',
      '/en/admin/website/integrations',
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/frontend
npx jest src/lib/api/website.spec.ts src/config/website-nav.spec.ts src/config/route-permissions.spec.ts src/lib/breadcrumbs-from-path.spec.ts --maxWorkers=2
```

Expected: `website.spec.ts` fails with `Cannot find module './website'`; `website-nav.spec.ts` fails on `expect(entry).toBeDefined()` (received `undefined`); `route-permissions.spec.ts` fails only on the new case (`Expected: {pattern: '/admin/website/inbox', …}  Received: null`); `breadcrumbs-from-path.spec.ts` fails `every emitted key has a message in BOTH languages` with `missing: { en: ['website', 'inbox'], tr: ['website', 'inbox'] }`.

- [ ] **Step 3: Implement**

**3a — `apps/frontend/src/lib/api/website.ts`** (new):

```ts
import {
  WEBSITE_FORM_KEYS,
  WebsiteFormKind,
  WebsiteSubmissionStatus,
  WebsiteTokenClass,
  type WebsiteFormKey,
} from '@jobsadmire/constants';

import { apiClient } from './client';

/**
 * Website module client (WP3a, 2026-09-19): the Forms inbox and the
 * Integrations screen. Everything else in the module (pages, strings, media,
 * navigation, publishing) is Phase B and has no client yet.
 *
 * The vocabulary — form keys, handler kinds, statuses, token classes — is
 * IMPORTED from `@jobsadmire/constants` (RC1: one source for the backend, the
 * seed and this file); nothing below re-declares a list the schema owns. What
 * lives here is presentation (labels, pill tones) and the two inbox predicates.
 *
 * Secrets never cross this boundary: the config shape carries `has<Name>`
 * booleans (P7), the only route that returns a token is `rotateSecret`, which
 * returns the NEW value exactly once, and there is no reveal route.
 */

// ─── Vocabulary (string enums are opaque to TS: `E.A` is not comparable to
// `'A'`, and wire JSON carries plain strings — so the UI works in the
// template-literal unions and derives its lists from the enums at runtime) ──

export type WebsiteFormKindValue = `${WebsiteFormKind}`;
export type WebsiteSubmissionStatusValue = `${WebsiteSubmissionStatus}`;
export type WebsiteTokenClassValue = `${WebsiteTokenClass}`;

export const WEBSITE_SUBMISSION_STATUSES: WebsiteSubmissionStatusValue[] = Object.values(
  WebsiteSubmissionStatus,
).map((s) => s as string as WebsiteSubmissionStatusValue);

// ─── Presentation ────────────────────────────────────────────────────────────

/** Keyed by the website's `FORM_KEYS` (Task 3 mirrors them in @jobsadmire/constants). */
export const WEBSITE_FORM_KEY_LABELS: Record<WebsiteFormKey, string> = {
  hire: 'Hire workers',
  contact: 'Contact',
  partner: 'Partner with us',
  workers: 'Available workers',
  callback: 'Callback request',
  visit: 'Office visit',
  calculator: 'Cost calculator quote',
  careers: 'Careers application',
  fraud: 'Fraud report',
  newsletter: 'Newsletter',
};

export const WEBSITE_FORM_KIND_LABELS: Record<WebsiteFormKindValue, string> = {
  INQUIRY: 'Inquiry',
  CAREERS_APPLY: 'Careers application',
  NEWSLETTER: 'Newsletter',
  FRAUD_REPORT: 'Fraud report',
  CALLBACK: 'Callback',
  VISIT: 'Visit',
  CALCULATOR_QUOTE: 'Calculator quote',
};

export const WEBSITE_SUBMISSION_STATUS_LABELS: Record<WebsiteSubmissionStatusValue, string> = {
  RECEIVED: 'Received',
  HANDLED: 'Handled',
  FAILED: 'Failed',
  SPAM: 'Spam',
};

/** `StatusTone` values from `components/ui/status-pill` — spelled out so this
 *  file stays free of component imports (`whatsapp-campaigns.ts` precedent). */
export const WEBSITE_SUBMISSION_STATUS_TONES: Record<
  WebsiteSubmissionStatusValue,
  'success' | 'warning' | 'destructive' | 'info' | 'neutral' | 'in-progress'
> = {
  RECEIVED: 'in-progress',
  HANDLED: 'success',
  FAILED: 'destructive',
  SPAM: 'neutral',
};

/** Re-exported for the inbox filter so the page imports one module for the vocabulary. */
export { WEBSITE_FORM_KEYS };
export type { WebsiteFormKey };

// ─── Submissions ─────────────────────────────────────────────────────────────

/** What Task 6 stores in `payloadJson`: the catalog-whitelisted fields as the
 *  visitor sent them (strings, or a key array for fraud `evidenceKeys` — RC5). */
export interface WebsiteStoredPayload {
  fields: Record<string, string | string[]>;
  sourcePath?: string;
}

/** One element of `handlerResultJson.attempts` (P8: per attempt). */
export interface WebsiteAttemptRecord {
  at: string;
  ok: boolean;
  dryRun: boolean;
  rerun: boolean;
  actor: string;
  error?: string;
  createdEntityType?: string;
  createdEntityId?: string;
  detail?: Record<string, unknown>;
}

export interface WebsiteHandlerResult {
  attempts: WebsiteAttemptRecord[];
  /** RC26: present while the LAST attempt was the visitor's own mistake (no alarm rang). */
  visitorError?: true;
}

/**
 * Task 7's `WebsiteInboxRow` (the list) — the detail (`WebsiteInboxDetail`) adds
 * the four optional fields at the bottom. Never the Prisma row: no `formId`, no
 * request/IP hashes.
 */
export interface WebsiteFormSubmission {
  id: string;
  formKey: string;
  /** The joined `WebsiteForm.kind` (Task 7 adds it to every row). */
  formKind: WebsiteFormKindValue;
  status: WebsiteSubmissionStatusValue;
  /** Filed with the test token class — handler ran DRY (P2). */
  isTest: boolean;
  locale: string | null;
  consentVersion: string | null;
  /** null = Turnstile not checked (secret missing / unreachable), else the verdict. */
  captchaPassed: boolean | null;
  /** Accepted while captcha was degraded (D11) — part of "needs attention" (P8). */
  captchaDegraded: boolean;
  /** 'inquiry' | 'applicant' | 'subscriber' | 'fraud-object' … + id, FK-less. */
  createdEntityType: string | null;
  createdEntityId: string | null;
  error: string | null;
  handledAt: string | null;
  purgeAfter: string | null;
  payloadJson: WebsiteStoredPayload | null;
  createdAt: string;
  /** Which Bearer class the door matched (RC2). Detail route only. */
  tokenClass?: WebsiteTokenClassValue;
  /** Detail route only. */
  handlerResultJson?: WebsiteHandlerResult | null;
  /** Detail route only. */
  userAgent?: string | null;
  /** Detail route only. */
  updatedAt?: string;
}

export interface WebsiteSubmissionsQuery {
  page?: number;
  limit?: number;
  /** Submission id, created entity id, or name / company / email / phone / reporter* inside
   *  `payloadJson.fields` (RC24: e-mail case-insensitive, the rest case-sensitive in WP3a). */
  search?: string;
  formKey?: string;
  status?: WebsiteSubmissionStatusValue;
  /** 'true' → FAILED or captchaDegraded only (P8). */
  needsAttention?: 'true';
  /** 'true' → test-token rows only; 'false' → real only; omitted → both. */
  isTest?: 'true' | 'false';
  /** ISO date (inclusive) bounds on createdAt. */
  from?: string;
  to?: string;
}

/** P8: needs-attention = FAILED or accepted with a degraded captcha. */
export function websiteSubmissionNeedsAttention(row: WebsiteFormSubmission): boolean {
  return row.status === 'FAILED' || row.captchaDegraded === true;
}

/** P8: re-run only when the handler failed BEFORE creating anything. */
export function websiteSubmissionCanRerun(row: WebsiteFormSubmission): boolean {
  return row.status === 'FAILED' && row.createdEntityId == null;
}

export interface WebsitePayloadSummary {
  name: string | null;
  email: string | null;
  phone: string | null;
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);

/**
 * Best-effort contact triple from a stored payload. Field names are per form
 * (the catalog in Task 6 / RC5 fixes them), so this reads the spellings the
 * ten forms use and returns null rather than guessing further. Array-valued
 * fields (fraud `evidenceKeys`) are never a name.
 */
export function websitePayloadSummary(
  payload: WebsiteStoredPayload | null | undefined,
): WebsitePayloadSummary {
  const f = payload && typeof payload === 'object' ? payload.fields : undefined;
  if (!f || typeof f !== 'object') return { name: null, email: null, phone: null };
  const composed = [str(f.firstName), str(f.lastName)].filter(Boolean).join(' ');
  const name =
    str(f.name) ?? str(f.fullName) ?? (composed || null) ?? str(f.contactName) ?? str(f.reporterName);
  const email = str(f.email) ?? str(f.reporterEmail);
  const phone = str(f.phone) ?? str(f.phoneNumber) ?? str(f.reporterPhone) ?? str(f.whatsapp);
  return { name, email, phone };
}

// ─── Fraud evidence (RC23 / RC27) ────────────────────────────────────────────

const EVIDENCE_KEY_RE = /^website-fraud\/[A-Za-z0-9._-]+$/;

/** The `website-fraud/` keys a FRAUD_REPORT row names, in order (the `:index` the routes take). */
export function websiteEvidenceKeysOf(payload: WebsiteStoredPayload | null | undefined): string[] {
  const raw = payload && typeof payload === 'object' ? payload.fields?.evidenceKeys : undefined;
  if (!Array.isArray(raw)) return [];
  return raw.filter((k): k is string => typeof k === 'string' && EVIDENCE_KEY_RE.test(k));
}

/** Bearer-fetched inline stream (the `applicantDocumentViewUrl` precedent — a raw link would 401). */
export function websiteEvidenceViewUrl(submissionId: string, index: number): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';
  return `${apiBase}/website/forms/submissions/${encodeURIComponent(submissionId)}/evidence/${index}/view`;
}

export interface WebsiteEvidenceLink {
  /** 15-minute presigned URL — the only link that works against the private prod bucket. */
  url: string;
  fileName: string;
}

// ─── Integrations config ─────────────────────────────────────────────────────

/** `GET /website/integrations` — Task 4's `WebsiteIntegrationPublicShape`,
 *  every secret reduced to a `has*` flag (P7); dates arrive as ISO strings. */
export interface WebsiteIntegrationConfig {
  id: string;
  hasWriteToken: boolean;
  hasPreviousWriteToken: boolean;
  /** When the previous write token stops being accepted (24 h after rotate). */
  previousWriteTokenExpiresAt: string | null;
  hasTestToken: boolean;
  hasTurnstileSecret: boolean;
  hasRevalidateSecret: boolean;
  /** Fallback recipient for every website event (P9). */
  secondHumanEmail: string | null;
  secondHumanName: string | null;
  lastTestedAt: string | null;
  lastTestOk: boolean | null;
  lastTestError: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
}

/** `undefined` = leave stored, `null` / `''` = clear (RC9). */
export interface UpdateWebsiteIntegrationSettingsInput {
  secondHumanEmail?: string | null;
  secondHumanName?: string | null;
}

/** Write-only: `undefined` = leave stored, `''` = clear (P7). */
export interface UpdateWebsiteIntegrationKeysInput {
  turnstileSecret?: string;
  revalidateSecret?: string;
}

export type WebsiteRotatableSecret = 'writeToken' | 'testToken';

export interface WebsiteRotatedSecret {
  name: WebsiteRotatableSecret;
  /** Returned ONCE. */
  secret: string;
  /** For `writeToken`: when the previous token stops working; null for testToken. */
  previousExpiresAt: string | null;
}

/** RC9: `{ ok, error }` — `error` is null when the probe passed. */
export interface WebsiteConnectionTestResult {
  ok: boolean;
  error: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toQuery = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

// ─── Clients ─────────────────────────────────────────────────────────────────

export const websiteStatusApi = {
  /** `@SelfService` (Task 1) — `{ enabled }` mirrors WEBSITE_MODULE_ENABLED (P1). */
  get: () => apiClient.get<{ enabled: boolean }>('/website/status'),
};

export const websiteFormsApi = {
  // website.forms VIEW
  list: (query: WebsiteSubmissionsQuery = {}) =>
    apiClient.get<WebsiteFormSubmission[]>(
      `/website/forms/submissions?${toQuery(query as Record<string, unknown>)}`,
    ),
  // website.forms VIEW
  get: (id: string) => apiClient.get<WebsiteFormSubmission>(`/website/forms/submissions/${id}`),
  // website.forms EXPORT — the DEDICATED, audited export route (P3). Same
  // paged `{ data, meta }` shape so `ExportCsvButton.fetchPage` can walk it.
  export: (query: WebsiteSubmissionsQuery = {}) =>
    apiClient.get<WebsiteFormSubmission[]>(
      `/website/forms/submissions/export?${toQuery(query as Record<string, unknown>)}`,
    ),
  // website.forms EDIT — 409 unless FAILED && createdEntityId IS NULL (P8).
  rerun: (id: string) =>
    apiClient.post<WebsiteFormSubmission>(`/website/forms/submissions/${id}/rerun`),
  // website.forms VIEW — presigned download link for one fraud-evidence object (RC23).
  evidenceLink: (id: string, index: number) =>
    apiClient.get<WebsiteEvidenceLink>(`/website/forms/submissions/${id}/evidence/${index}/link`),
};

export const websiteIntegrationsApi = {
  // website.integrations VIEW
  get: () => apiClient.get<WebsiteIntegrationConfig>('/website/integrations'),
  // website.integrations EDIT — non-secret fields only
  update: (body: UpdateWebsiteIntegrationSettingsInput) =>
    apiClient.patch<WebsiteIntegrationConfig>('/website/integrations', body),
  // website MANAGE_KEYS
  updateKeys: (body: UpdateWebsiteIntegrationKeysInput) =>
    apiClient.patch<WebsiteIntegrationConfig>('/website/integrations/keys', body),
  // website MANAGE_KEYS — server-generated, returned once (RC9 path)
  rotateSecret: (name: WebsiteRotatableSecret) =>
    apiClient.post<WebsiteRotatedSecret>(`/website/integrations/rotate/${name}`),
  // website MANAGE_KEYS — probes the stored Turnstile secret, persists lastTested* (RC9 path)
  testConnection: () =>
    apiClient.post<WebsiteConnectionTestResult>('/website/integrations/test'),
};
```

**3b — `apps/frontend/src/config/modules.ts`**

Import: after the line `  FolderOpen,` insert `  Globe,` (alphabetical, before `  GraduationCap,`). `Inbox` and `KeyRound` are already imported.

Insert the entry below between the `  },` that closes the `marketing` entry (the line following `    ],` — the `subRail` array whose last leaf is `label: 'Tools'`) and the `  {` whose first inner line is `    // "My HR" — the EMPLOYEE self-service surface (check in / check out,`:

```ts
  {
    // Public website (WP3a, 2026-09-19 — PRD §5.12). The permission descriptor
    // registers whether or not WEBSITE_MODULE_ENABLED is on (P1), so the nav
    // follows GRANTS only — the two screens read `GET /website/status` and
    // show a banner while the public door is off. Only the WP3a leaves exist;
    // the CMS leaves (pages, strings, media, navigation, …) arrive with Phase B,
    // as does a module dashboard — until then the module ROOT redirects to the
    // inbox and declares the inbox's key (route-permissions.ts), so a holder of
    // a CMS-only key who clicks the rail icon is refused in words there.
    slug: 'website',
    labelKey: 'website',
    icon: Globe,
    permission: { module: 'website', action: 'VIEW' },
    railTitle: 'Website',
    railSubtitle: 'jobsadmire.com intake & setup',
    subRail: (base) => [
      {
        heading: 'Inbox',
        items: [
          // The path segment is `inbox`, not `forms`: the `forms` crumb already
          // means Market Research's Form Builder (P14).
          {
            label: 'Forms',
            labelKey: 'websiteInbox',
            href: `${base}/inbox`,
            icon: Inbox,
            permission: { module: 'website.forms', action: 'VIEW' },
          },
        ],
      },
      {
        heading: 'Setup',
        items: [
          // The PAGE is `website.integrations:VIEW` (P3); every secret write,
          // rotate and test inside it is `website:MANAGE_KEYS`, which the page
          // gates itself. This leaf must stay identical to the manifest line
          // (`website-nav.spec.ts` pins it).
          {
            label: 'Integrations',
            labelKey: 'websiteIntegrations',
            href: `${base}/integrations`,
            icon: KeyRound,
            permission: { module: 'website.integrations', action: 'VIEW' },
          },
        ],
      },
    ],
  },
```

**3c — `apps/frontend/src/config/route-permissions.ts`**

After the line `  { pattern: '/admin/sales/expenses', key: 'travel-expenses' },` and before the blank line that precedes `  // ── HRM — screen-level keys (W3) ─────────────────────────────────────────`, insert:

```ts

  // ── Website (WP3a, 2026-09-19) — screen-level keys from day one ──────────
  // The module root redirects to the inbox and declares the inbox's key (the
  // Marketing redirect precedent above). The Integrations PAGE is
  // `website.integrations:VIEW` (P3); the secret writes, rotate and test it
  // contains are `website:MANAGE_KEYS` and the page gates those controls
  // itself, so a `website.integrations` holder can still set the second-human
  // recipient without being shown a token box that would 403.
  { pattern: '/admin/website', key: 'website.forms' },
  { pattern: '/admin/website/inbox', key: 'website.forms' },
  { pattern: '/admin/website/integrations', key: 'website.integrations' },
```

**3d — `apps/frontend/src/lib/breadcrumbs-from-path.ts`**

After the line `  lessons: 'Lessons',` (the last `SEGMENT_LABELS` entry, before `};`) insert:

```ts
  // Website module (WP3a). `inbox` rather than `forms` — `forms` above is the
  // Market Research Form Builder.
  website: 'Website',
  inbox: 'Inbox',
```

**3e — messages**

`apps/frontend/src/messages/en.json`:
- `nav.breadcrumbs`: after `      "lessons": "Lessons",` and before `      "root": {` insert
  ```json
      "website": "Website",
      "inbox": "Inbox",
  ```
- `sidebar.admin`: after `      "marketingDashboard": "Marketing Dashboard",` insert
  ```json
      "website": "Website",
      "websiteInbox": "Forms inbox",
      "websiteIntegrations": "Integrations",
  ```
- `guide`: before `    "admin_sales_inquiries": {` insert
  ```json
    "admin_website_inbox": {
      "title": "Website forms inbox",
      "description": "Every submission from jobsadmire.com lands here first, then a handler files it (an Inquiry, a careers application, a subscriber, a fraud report). Rows that failed or arrived while captcha was degraded need attention.",
      "tip1": "Use the Needs attention filter for failed handlers and captcha-degraded rows — those are the leads nobody else will see",
      "tip2": "Re-run is offered only for a failed submission that created nothing yet; a re-run never files the same lead twice",
      "tip3": "Test-token submissions (the website's synthetic lead) are marked Test and hidden by the Real only filter",
      "tip4": "Export CSV walks the current filters through the audited export route"
    },
    "admin_website_integrations": {
      "title": "Website integrations",
      "description": "Tokens the website presents to Operations, the Turnstile secret it is verified with, the revalidate secret, and the second human who receives every website alert.",
      "tip1": "Rotating the write token keeps the previous one valid for 24 hours — update Vercel inside that window",
      "tip2": "Secrets are write-only: a stored value is never shown back; a new one is shown once at rotate time",
      "tip3": "The banner at the top means WEBSITE_MODULE_ENABLED is off on the server — tokens can be prepared now and the door flipped on later"
    },
  ```

`apps/frontend/src/messages/tr.json`:
- `nav.breadcrumbs`: after `      "lessons": "Dersler",` and before `      "root": {` insert
  ```json
      "website": "Web Sitesi",
      "inbox": "Gelen Kutusu",
  ```
- `sidebar.admin`: after `      "marketingDashboard": "Pazarlama Paneli",` insert
  ```json
      "website": "Web Sitesi",
      "websiteInbox": "Form gelen kutusu",
      "websiteIntegrations": "Entegrasyonlar",
  ```
- `guide`: before `    "admin_sales_inquiries": {` insert
  ```json
    "admin_website_inbox": {
      "title": "Web sitesi form gelen kutusu",
      "description": "jobsadmire.com üzerinden gelen her gönderim önce buraya düşer, ardından bir işleyici onu kaydeder (Sorgu, kariyer başvurusu, abone, dolandırıcılık bildirimi). Başarısız olan veya captcha devre dışıyken gelen satırlar ilgi ister.",
      "tip1": "Başarısız işleyiciler ve captcha'sız satırlar için İlgi gerekiyor filtresini kullanın — bu adayları başka kimse görmez",
      "tip2": "Yeniden çalıştır yalnızca henüz hiçbir kayıt oluşturmamış başarısız gönderimler için sunulur; aynı aday iki kez kaydedilmez",
      "tip3": "Test belirteciyle gelen gönderimler (web sitesinin yapay adayı) Test olarak işaretlenir ve Yalnızca gerçek filtresiyle gizlenir",
      "tip4": "CSV dışa aktarma mevcut filtreleri denetlenen dışa aktarma rotası üzerinden yürütür"
    },
    "admin_website_integrations": {
      "title": "Web sitesi entegrasyonları",
      "description": "Web sitesinin Operations'a sunduğu belirteçler, doğrulandığı Turnstile gizli anahtarı, yeniden doğrulama anahtarı ve her web sitesi uyarısını alan ikinci kişi.",
      "tip1": "Yazma belirtecini döndürmek öncekini 24 saat geçerli tutar — Vercel'i bu süre içinde güncelleyin",
      "tip2": "Gizli değerler yalnızca yazılır: saklanan bir değer asla geri gösterilmez; yeni değer döndürme anında bir kez gösterilir",
      "tip3": "Üstteki uyarı sunucuda WEBSITE_MODULE_ENABLED kapalı demektir — belirteçler şimdi hazırlanabilir, kapı daha sonra açılır"
    },
  ```

**3f — `apps/frontend/src/app/[locale]/admin/website/page.tsx`** (new):

```tsx
import { redirect } from 'next/navigation';

/**
 * The `website` module root (WP3a). The icon rail navigates to the module
 * root (`moduleHref`), and the module has no dashboard until Phase B — so the
 * root is the inbox. The permission gate lives on the destination; this file
 * decides nothing, and its manifest line declares the inbox's key
 * (route-permissions.ts, the Marketing redirect precedent —
 * `marketing/tools/page.tsx`).
 */
export default function WebsiteRootRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/admin/website/inbox`);
}
```

**3g — `apps/frontend/src/app/[locale]/admin/website/_flag-banner.tsx`** (new):

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { PowerOff } from 'lucide-react';

import { websiteStatusApi } from '@/lib/api/website';

/**
 * "Public intake is OFF" banner (P14). The frontend has no build-time flag —
 * NEXT_PUBLIC_* is inlined at image build — so the screens read
 * `GET /website/status` (Task 1, @SelfService) at runtime (P1). Hidden while
 * loading and on ANY failure: the banner is advice, never something worth
 * breaking a screen over.
 */
export function WebsiteModuleFlagBanner() {
  const status = useQuery({
    queryKey: ['website', 'status'],
    queryFn: () => websiteStatusApi.get(),
    staleTime: 60_000,
    retry: false,
  });
  if (!status.data || status.data.data.enabled) return null;
  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-200"
    >
      <PowerOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        The public intake door is <strong>off</strong> (<code>WEBSITE_MODULE_ENABLED=false</code> on
        the server). jobsadmire.com forms get a 404 until it is flipped on; tokens and secrets set
        here are kept and used the moment it is.
      </p>
    </div>
  );
}
```

**3h — `apps/frontend/src/app/[locale]/admin/website/inbox/page.tsx`** (new):

```tsx
'use client';

/**
 * Website → Forms inbox (WP3a, P14).
 *
 * The Sales Inquiries list skeleton: useQuery keyed by page + search + filters,
 * PageShell + FilterBar + DataTable + TablePagination, `<Can>`-gated actions.
 * The row detail is a read-only SidePanel (payload, handler attempts, re-run),
 * deep-linkable through `?row=<id>` so a WEBSITE_FORM_RECEIVED notification
 * (Task 10's `getEntityPath` → `/website/inbox?row=<id>`) lands on the exact
 * submission.
 *
 * Needs attention = FAILED or captchaDegraded (P8). Re-run is offered only for
 * a FAILED row whose handler created nothing (P8) — the button is hidden
 * otherwise rather than disabled, because "why can't I re-run a handled row"
 * has an answer ("it already filed the lead") and the footer says it.
 *
 * Export goes through the DEDICATED, audited export route on `website.forms
 * EXPORT` (P3), not the list route — `ExportCsvButton.fetchPage` walks it.
 */

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Copy, ExternalLink, RefreshCw, RotateCcw } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/ui/page-shell';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar, type FilterDef, type FilterValue } from '@/components/ui/filter-bar';
import { SidePanel, SidePanelFooter } from '@/components/ui/side-panel';
import { StatusPill } from '@/components/ui/status-pill';
import { StateEmpty } from '@/components/ui/state-empty';
import { StateError } from '@/components/ui/state-error';
import { StateLoading } from '@/components/ui/state-loading';
import { PinButton } from '@/components/ui/pin-button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useCommandRegistry } from '@/components/ui/command-palette';
import { ExportCsvButton } from '@/components/command';
import { PageGuide } from '@/components/shared/PageGuide';
import { TablePagination } from '@/components/shared/TablePagination';
import { Can } from '@/components/auth/can';
import { formatDateTime } from '@/lib/utils';
import type { CsvColumn } from '@/lib/csv';
import { getAccessTokenFromCookie } from '@/stores/auth.store';
import {
  WEBSITE_FORM_KEYS,
  WEBSITE_FORM_KEY_LABELS,
  WEBSITE_FORM_KIND_LABELS,
  WEBSITE_SUBMISSION_STATUSES,
  WEBSITE_SUBMISSION_STATUS_LABELS,
  WEBSITE_SUBMISSION_STATUS_TONES,
  websiteEvidenceKeysOf,
  websiteEvidenceViewUrl,
  websiteFormsApi,
  websitePayloadSummary,
  websiteSubmissionCanRerun,
  websiteSubmissionNeedsAttention,
  type WebsiteFormSubmission,
  type WebsiteSubmissionStatusValue,
  type WebsiteSubmissionsQuery,
} from '@/lib/api/website';

import { WebsiteModuleFlagBanner } from '../_flag-banner';

const PAGE_SIZE = 20;

function formKeyLabel(key: string): string {
  return (WEBSITE_FORM_KEY_LABELS as Record<string, string>)[key] ?? key;
}

function captchaLabel(row: WebsiteFormSubmission): string {
  if (row.captchaDegraded) return 'degraded';
  if (row.captchaPassed === null) return '';
  return row.captchaPassed ? 'passed' : 'failed';
}

/** Everything the CSV carries — flattened, never the raw payload blob. */
const CSV_COLUMNS: CsvColumn<WebsiteFormSubmission>[] = [
  { header: 'Received at', value: (r) => r.createdAt },
  { header: 'Form', value: (r) => r.formKey },
  { header: 'Kind', value: (r) => r.formKind },
  { header: 'Status', value: (r) => r.status },
  { header: 'Needs attention', value: (r) => (websiteSubmissionNeedsAttention(r) ? 'yes' : 'no') },
  { header: 'Test', value: (r) => (r.isTest ? 'yes' : 'no') },
  { header: 'Name', value: (r) => websitePayloadSummary(r.payloadJson).name },
  { header: 'Email', value: (r) => websitePayloadSummary(r.payloadJson).email },
  { header: 'Phone', value: (r) => websitePayloadSummary(r.payloadJson).phone },
  { header: 'Locale', value: (r) => r.locale },
  { header: 'Captcha', value: (r) => captchaLabel(r) },
  { header: 'Filed as', value: (r) => r.createdEntityType },
  { header: 'Filed id', value: (r) => r.createdEntityId },
  { header: 'Error', value: (r) => r.error },
  { header: 'Handled at', value: (r) => r.handledAt },
  { header: 'Submission id', value: (r) => r.id },
];

function fieldText(v: string | string[]): string {
  return Array.isArray(v) ? v.join(', ') : v;
}

/**
 * RC27 — open one fraud-evidence object inline. The view route is auth-gated
 * (a raw `<a href>` would 401), so the bytes are bearer-fetched into a blob and
 * opened in a new tab (the DocumentViewerDialog lifecycle: object URL revoked
 * after the tab has taken it).
 */
async function openEvidence(submissionId: string, index: number): Promise<void> {
  const token = getAccessTokenFromCookie();
  const res = await fetch(websiteEvidenceViewUrl(submissionId, index), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Could not load the evidence (${res.status}).`);
  const objectUrl = URL.createObjectURL(await res.blob());
  const tab = window.open(objectUrl, '_blank', 'noopener');
  if (!tab) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('The browser blocked the evidence tab — allow pop-ups for this site.');
  }
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export default function WebsiteInboxPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useParams() as { locale: string };
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>({});

  const search = searchValue.trim() || undefined;
  const statusFilter = (filterValues.status as string | undefined) || undefined;
  const formKeyFilter = (filterValues.formKey as string | undefined) || undefined;
  const attentionFilter = (filterValues.needsAttention as string | undefined) || undefined;
  const testFilter = (filterValues.isTest as string | undefined) || undefined;
  const dateFilter = (filterValues.date as { from?: string; to?: string } | undefined) ?? undefined;

  const query: WebsiteSubmissionsQuery = {
    search,
    status: statusFilter as WebsiteSubmissionStatusValue | undefined,
    formKey: formKeyFilter,
    needsAttention: attentionFilter === 'true' ? 'true' : undefined,
    isTest: testFilter === 'true' || testFilter === 'false' ? testFilter : undefined,
    from: dateFilter?.from,
    to: dateFilter?.to,
  };

  const listQuery = useQuery({
    queryKey: ['website', 'forms', 'list', page, query],
    queryFn: () => websiteFormsApi.list({ ...query, page, limit: PAGE_SIZE }),
  });
  const rows: WebsiteFormSubmission[] = listQuery.data?.data ?? [];
  const meta = {
    total: listQuery.data?.meta?.total ?? 0,
    totalPages: listQuery.data?.meta?.totalPages ?? 1,
  };

  // ── Detail panel, deep-linked through ?row=<id> ─────────────────────────────
  const rowId = searchParams.get('row');
  const setRowId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set('row', id);
      else params.delete('row');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const detailQuery = useQuery({
    queryKey: ['website', 'forms', 'submission', rowId],
    queryFn: () => websiteFormsApi.get(rowId as string),
    enabled: Boolean(rowId),
  });
  const detail = detailQuery.data?.data;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['website', 'forms'] });

  const rerunMutation = useMutation({
    mutationFn: (id: string) => websiteFormsApi.rerun(id),
    onSuccess: (res) => {
      invalidate();
      toast.success(
        res.data.status === 'HANDLED'
          ? 'Handler re-run succeeded — the submission is filed.'
          : `Handler re-run finished with status ${res.data.status}.`,
      );
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Re-run failed'),
  });

  const onRerun = async (row: WebsiteFormSubmission) => {
    const ok = await confirm({
      title: 'Re-run the handler for this submission?',
      description:
        'The submission is filed again exactly as the visitor sent it. Offered only because the first attempt created nothing, so nothing can be duplicated.',
      confirmLabel: 'Re-run',
    });
    if (ok) rerunMutation.mutate(row.id);
  };

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<WebsiteFormSubmission, unknown>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Received',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
        size: 140,
      },
      {
        accessorKey: 'formKey',
        header: 'Form',
        cell: ({ row }) => (
          <span className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {formKeyLabel(row.original.formKey)}
            </Badge>
            {row.original.isTest && (
              <Badge variant="outline" className="text-[10px]">
                Test
              </Badge>
            )}
          </span>
        ),
      },
      {
        id: 'contact',
        header: 'Contact',
        enableSorting: false,
        cell: ({ row }) => {
          const s = websitePayloadSummary(row.original.payloadJson);
          return (
            <div className="min-w-0">
              <div className="truncate text-sm">{s.name ?? '—'}</div>
              <div className="truncate text-xs text-muted-foreground">
                {[s.email, s.phone].filter(Boolean).join(' · ') || '—'}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusPill
              tone={WEBSITE_SUBMISSION_STATUS_TONES[row.original.status]}
              label={WEBSITE_SUBMISSION_STATUS_LABELS[row.original.status]}
              size="xs"
            />
            {websiteSubmissionNeedsAttention(row.original) && (
              <StatusPill tone="warning" icon={AlertTriangle} label="Needs attention" size="xs" />
            )}
          </span>
        ),
      },
      {
        id: 'filedAs',
        header: 'Filed as',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.createdEntityType ? (
            <span className="text-xs">
              {row.original.createdEntityType}
              <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                {row.original.createdEntityId}
              </span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
    ],
    [],
  );

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filterDefs: FilterDef[] = useMemo(
    () => [
      {
        id: 'status',
        label: 'Status',
        type: 'status',
        pinned: true,
        options: WEBSITE_SUBMISSION_STATUSES.map((s) => ({
          value: s,
          label: WEBSITE_SUBMISSION_STATUS_LABELS[s],
        })),
      },
      {
        id: 'needsAttention',
        label: 'Needs attention',
        type: 'select',
        pinned: true,
        options: [{ value: 'true', label: 'Failed or captcha-degraded only' }],
      },
      {
        id: 'formKey',
        label: 'Form',
        type: 'select',
        options: WEBSITE_FORM_KEYS.map((k) => ({ value: k, label: WEBSITE_FORM_KEY_LABELS[k] })),
      },
      {
        id: 'isTest',
        label: 'Test rows',
        type: 'select',
        options: [
          { value: 'false', label: 'Real only' },
          { value: 'true', label: 'Test only' },
        ],
      },
      { id: 'date', label: 'Received', type: 'date-range' },
    ],
    [],
  );

  useCommandRegistry([
    {
      id: 'website-forms.refresh',
      section: 'actions',
      label: 'Refresh website inbox',
      icon: RefreshCw,
      onSelect: invalidate,
    },
  ]);

  const selected = detail ?? rows.find((r) => r.id === rowId);
  const attempts = selected?.handlerResultJson?.attempts ?? null;
  const evidenceKeys = selected?.formKind === 'FRAUD_REPORT' ? websiteEvidenceKeysOf(selected.payloadJson) : [];

  // RC27: view = bearer blob-fetch of the streamed route; link = the presigned URL to the clipboard.
  const onViewEvidence = async (index: number) => {
    if (!selected) return;
    try {
      await openEvidence(selected.id, index);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not open the evidence');
    }
  };
  const onCopyEvidenceLink = async (index: number) => {
    if (!selected) return;
    try {
      const { data } = await websiteFormsApi.evidenceLink(selected.id, index);
      await navigator.clipboard.writeText(data.url);
      toast.success(`Link for ${data.fileName} copied — valid for 15 minutes.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create the link');
    }
  };

  return (
    <>
      <PageGuide guideKey="admin_website_inbox" />
      <div className="mb-3">
        <WebsiteModuleFlagBanner />
      </div>

      <PageShell
        title="Forms inbox"
        subtitle="Every jobsadmire.com submission, and what the handler did with it."
        actions={
          <>
            <PinButton
              id="website.inbox"
              label="Website — Forms inbox"
              href={`/${locale}/admin/website/inbox`}
              module="website"
            />
            <Can module="website.forms" action="EXPORT">
              <ExportCsvButton
                filename="website-form-submissions"
                columns={CSV_COLUMNS}
                fetchPage={(p) => websiteFormsApi.export({ ...query, page: p, limit: 100 })}
              />
            </Can>
          </>
        }
        filters={
          <FilterBar
            filters={filterDefs}
            values={filterValues}
            onChange={(id, v) => {
              setFilterValues((s) => ({ ...s, [id]: v }));
              setPage(1);
            }}
            onReset={() => {
              setFilterValues({});
              setSearchValue('');
              setPage(1);
            }}
            showSearch
            searchValue={searchValue}
            onSearchChange={(v) => {
              setSearchValue(v);
              setPage(1);
            }}
            searchPlaceholder="Name, company, email, phone… (e-mail case-insensitive; the rest exact case)"
          />
        }
      >
        {listQuery.isError ? (
          <StateError
            error={listQuery.error instanceof Error ? listQuery.error : 'Could not load the inbox.'}
            title="Couldn’t load the inbox"
            onRetry={() => void listQuery.refetch()}
          />
        ) : (
          <div className="space-y-2">
            <DataTable
              columns={columns}
              data={rows}
              rowKey={(row) => row.id}
              loading={listQuery.isLoading}
              onRowClick={(row) => setRowId(row.id)}
              emptyState={
                <StateEmpty
                  title="No submissions match your filters"
                  description="Website forms land here the moment the public intake door receives them."
                />
              }
            />
            {rows.length > 0 && (
              <TablePagination
                page={page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </PageShell>

      <SidePanel
        open={Boolean(rowId)}
        onOpenChange={(open) => {
          if (!open) setRowId(null);
        }}
        title={selected ? formKeyLabel(selected.formKey) : 'Submission'}
        subtitle={
          selected
            ? `${WEBSITE_FORM_KIND_LABELS[selected.formKind]} · ${formatDateTime(selected.createdAt)}`
            : undefined
        }
        width="wide"
        ariaDescription="Website form submission detail"
        headerActions={
          selected && (
            <span className="flex flex-wrap items-center gap-1.5">
              <StatusPill
                tone={WEBSITE_SUBMISSION_STATUS_TONES[selected.status]}
                label={WEBSITE_SUBMISSION_STATUS_LABELS[selected.status]}
                size="xs"
              />
              {selected.isTest && (
                <Badge variant="outline" className="text-[10px]">
                  Test
                </Badge>
              )}
            </span>
          )
        }
        footer={
          selected && (
            <SidePanelFooter
              left={
                websiteSubmissionCanRerun(selected)
                  ? 'The handler failed before creating anything — safe to re-run.'
                  : selected.status === 'FAILED'
                    ? 'Failed after filing an entity — fix it there; a re-run would duplicate it.'
                    : `Submission ${selected.id}`
              }
            >
              <Button type="button" variant="ghost" size="sm" onClick={() => setRowId(null)}>
                Close
              </Button>
              {websiteSubmissionCanRerun(selected) && (
                <Can module="website.forms" action="EDIT">
                  <Button
                    size="sm"
                    disabled={rerunMutation.isPending}
                    onClick={() => void onRerun(selected)}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    {rerunMutation.isPending ? 'Re-running…' : 'Re-run handler'}
                  </Button>
                </Can>
              )}
            </SidePanelFooter>
          )
        }
      >
        {detailQuery.isLoading && !selected ? (
          <StateLoading />
        ) : detailQuery.isError && !selected ? (
          <StateError
            error={
              detailQuery.error instanceof Error ? detailQuery.error : 'Could not load the submission.'
            }
            title="Couldn’t load the submission"
            onRetry={() => void detailQuery.refetch()}
            size="compact"
          />
        ) : selected ? (
          <div className="space-y-5">
            {websiteSubmissionNeedsAttention(selected) && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>
                  {selected.status === 'FAILED'
                    ? `${selected.handlerResultJson?.visitorError ? "Refused by the handler for the visitor's own input" : 'Handler failed'}: ${selected.error ?? 'no error message recorded'}`
                    : 'Accepted while captcha was degraded — verify the contact before acting on it.'}
                </p>
              </div>
            )}

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Form key</dt>
              <dd className="font-mono text-xs">{selected.formKey}</dd>
              <dt className="text-muted-foreground">Locale</dt>
              <dd>{selected.locale ?? '—'}</dd>
              <dt className="text-muted-foreground">Token class</dt>
              <dd className="font-mono text-xs">{selected.tokenClass ?? '—'}</dd>
              <dt className="text-muted-foreground">Captcha</dt>
              <dd>
                {selected.captchaDegraded
                  ? 'Degraded (not verified)'
                  : selected.captchaPassed === null
                    ? '—'
                    : selected.captchaPassed
                      ? 'Passed'
                      : 'Failed'}
              </dd>
              <dt className="text-muted-foreground">Consent version</dt>
              <dd>{selected.consentVersion ?? '—'}</dd>
              <dt className="text-muted-foreground">Source path</dt>
              <dd className="truncate font-mono text-xs">{selected.payloadJson?.sourcePath ?? '—'}</dd>
              <dt className="text-muted-foreground">Filed as</dt>
              <dd>
                {selected.createdEntityType ? (
                  <>
                    {selected.createdEntityType}{' '}
                    <span className="font-mono text-xs text-muted-foreground">
                      {selected.createdEntityId}
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </dd>
              <dt className="text-muted-foreground">Handled at</dt>
              <dd>{formatDateTime(selected.handledAt)}</dd>
              <dt className="text-muted-foreground">Purge after</dt>
              <dd>{formatDateTime(selected.purgeAfter)}</dd>
              {selected.userAgent !== undefined && (
                <>
                  <dt className="text-muted-foreground">User agent</dt>
                  <dd className="truncate text-xs" title={selected.userAgent ?? ''}>
                    {selected.userAgent ?? '—'}
                  </dd>
                </>
              )}
            </dl>

            <section>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Payload
              </h3>
              {selected.payloadJson?.fields && Object.keys(selected.payloadJson.fields).length > 0 ? (
                <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-4 gap-y-1 rounded-md border bg-muted/40 p-3 text-xs">
                  {Object.entries(selected.payloadJson.fields).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="truncate font-mono text-muted-foreground">{k}</dt>
                      <dd className="whitespace-pre-wrap break-words">{fieldText(v)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs text-muted-foreground">No fields stored.</p>
              )}
            </section>

            {selected.formKind === 'FRAUD_REPORT' && (
              <section>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Evidence
                </h3>
                {evidenceKeys.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No evidence files were attached.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {evidenceKeys.map((key, i) => (
                      <li key={key} className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs">
                        <span className="min-w-0 flex-1 truncate font-mono" title={key}>
                          {key.slice('website-fraud/'.length)}
                        </span>
                        {/* RC27: `view` streams inline (nosniff + CSP), `link` copies the 15-min presigned URL. */}
                        <Button type="button" size="sm" variant="outline" onClick={() => void onViewEvidence(i)}>
                          <ExternalLink className="mr-1 h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => void onCopyEvidenceLink(i)}>
                          <Copy className="mr-1 h-3.5 w-3.5" />
                          Copy link
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            <section>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Handler attempts
              </h3>
              {selected.handlerResultJson === undefined ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : !attempts || attempts.length === 0 ? (
                <p className="text-xs text-muted-foreground">No handler attempt recorded.</p>
              ) : (
                <ol className="space-y-2">
                  {attempts.map((a, i) => (
                    <li key={`${a.at}-${i}`} className="rounded-md border p-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusPill
                          tone={a.ok ? 'success' : 'destructive'}
                          label={a.ok ? 'OK' : 'Failed'}
                          size="xs"
                        />
                        <span className="text-muted-foreground">{formatDateTime(a.at)}</span>
                        <span className="text-muted-foreground">· {a.actor}</span>
                        {a.rerun && (
                          <Badge variant="outline" className="text-[10px]">
                            re-run
                          </Badge>
                        )}
                        {a.dryRun && (
                          <Badge variant="outline" className="text-[10px]">
                            dry run
                          </Badge>
                        )}
                      </div>
                      {a.error && <p className="mt-1 text-destructive">{a.error}</p>}
                      {a.createdEntityType && (
                        <p className="mt-1">
                          Created {a.createdEntityType}{' '}
                          <span className="font-mono text-muted-foreground">{a.createdEntityId}</span>
                        </p>
                      )}
                      {a.detail && Object.keys(a.detail).length > 0 && (
                        <pre className="mt-1 max-h-40 overflow-auto rounded bg-muted/40 p-2">
                          {JSON.stringify(a.detail, null, 2)}
                        </pre>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        ) : null}
      </SidePanel>
    </>
  );
}
```

**3i — `apps/frontend/src/app/[locale]/admin/website/integrations/page.tsx`** (new):

```tsx
'use client';

/**
 * Website → Integrations (WP3a, P14 / D12 minimal cut).
 *
 * PAGE gate: `website.integrations:VIEW` (the manifest line). Inside it:
 *   · second-human recipient  — `website.integrations:EDIT` (P9);
 *   · tokens / Turnstile / revalidate secret / test — `website:MANAGE_KEYS`,
 *     seeded to NO role, super-admin via the CASL bypass (P3; marketing and
 *     call-center precedent). The MANAGE_KEYS block renders its own friendly
 *     refusal rather than a blank, for anyone who holds VIEW only.
 *
 * Secrets are write-only (P7): the server returns `has*` booleans, never a
 * value; inputs are never pre-filled; an empty box means "leave stored";
 * clearing is an explicit `''` after `useConfirm`. Rotate is server-generated
 * and shown ONCE with a Copy button (call-center config precedent); the
 * previous write token stays valid for 24 h so Vercel can be updated inside
 * that window. The D12 live-proof rotation gate is WP3c's (P7). Routes and
 * shapes are Task 4's as fixed by RC9.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Copy, KeyRound, PlugZap, RefreshCw, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageShell } from '@/components/ui/page-shell';
import { PinButton } from '@/components/ui/pin-button';
import { StatusPill } from '@/components/ui/status-pill';
import { StateError } from '@/components/ui/state-error';
import { StateLoading } from '@/components/ui/state-loading';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { Can } from '@/components/auth/can';
import { CommandCard } from '@/components/command';
import { PageGuide } from '@/components/shared/PageGuide';
import { formatDateTime } from '@/lib/utils';
import {
  websiteIntegrationsApi,
  type UpdateWebsiteIntegrationKeysInput,
  type WebsiteConnectionTestResult,
  type WebsiteRotatableSecret,
  type WebsiteRotatedSecret,
} from '@/lib/api/website';

import { WebsiteModuleFlagBanner } from '../_flag-banner';

/** One stored-secret chip, self-labelling so every card reads the same. */
function KeyChip({ name, has, note }: { name: string; has: boolean; note?: string }) {
  return (
    <StatusPill
      tone={has ? 'success' : 'warning'}
      size="xs"
      label={`${name} · ${has ? (note ?? 'Stored') : 'Not set'}`}
    />
  );
}

const ROTATE_COPY: Record<WebsiteRotatableSecret, { title: string; description: string; label: string }> = {
  writeToken: {
    title: 'Rotate the write token?',
    description:
      'A new token is generated and shown once. The current token keeps working for 24 hours so Vercel can be updated inside that window; after that only the new one is accepted.',
    label: 'Write token',
  },
  testToken: {
    title: 'Rotate the test token?',
    description:
      'A new token is generated and shown once. The old test token stops working immediately — the synthetic-lead cron on Vercel must be updated.',
    label: 'Test token',
  },
};

export default function WebsiteIntegrationsPage() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const { locale } = useParams() as { locale: string };

  const configQuery = useQuery({
    queryKey: ['website', 'integrations'],
    queryFn: () => websiteIntegrationsApi.get(),
  });
  const config = configQuery.data?.data;
  const invalidate = () => qc.invalidateQueries({ queryKey: ['website', 'integrations'] });

  // ── Second human (non-secret, website.integrations EDIT) ───────────────────
  const [secondHumanName, setSecondHumanName] = useState('');
  const [secondHumanEmail, setSecondHumanEmail] = useState('');
  useEffect(() => {
    if (config) {
      setSecondHumanName(config.secondHumanName ?? '');
      setSecondHumanEmail(config.secondHumanEmail ?? '');
    }
  }, [config]);

  const saveSettings = useMutation({
    mutationFn: () =>
      websiteIntegrationsApi.update({
        secondHumanName: secondHumanName.trim() || null,
        secondHumanEmail: secondHumanEmail.trim() || null,
      }),
    onSuccess: () => {
      invalidate();
      toast.success('Second-human recipient saved.');
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not save.'),
  });

  // ── Secrets (website MANAGE_KEYS) ──────────────────────────────────────────
  const [turnstileSecret, setTurnstileSecret] = useState('');
  const [revalidateSecret, setRevalidateSecret] = useState('');
  const [revealed, setRevealed] = useState<WebsiteRotatedSecret | null>(null);
  const [test, setTest] = useState<WebsiteConnectionTestResult | null>(null);

  const saveKeys = useMutation({
    mutationFn: (input: UpdateWebsiteIntegrationKeysInput) => websiteIntegrationsApi.updateKeys(input),
    onSuccess: () => {
      invalidate();
      setTurnstileSecret('');
      setRevalidateSecret('');
      toast.success('Saved.');
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not save the secret.'),
  });

  const rotate = useMutation({
    mutationFn: (name: WebsiteRotatableSecret) => websiteIntegrationsApi.rotateSecret(name),
    onSuccess: (r) => {
      invalidate();
      setRevealed(r.data);
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Could not rotate.'),
  });

  const testConnection = useMutation({
    mutationFn: () => websiteIntegrationsApi.testConnection(),
    onSuccess: (r) => {
      invalidate();
      setTest(r.data);
      if (r.data.ok) toast.success('Turnstile secret accepted by Cloudflare.');
      else toast.error(r.data.error ?? 'Turnstile test failed.');
    },
    onError: (e: unknown) => {
      const error = e instanceof Error ? e.message : 'Turnstile test failed';
      setTest({ ok: false, error });
      toast.error(error);
    },
  });

  const onRotate = async (name: WebsiteRotatableSecret) => {
    const copy = ROTATE_COPY[name];
    const ok = await confirm({ title: copy.title, description: copy.description, confirmLabel: 'Rotate' });
    if (ok) rotate.mutate(name);
  };

  const clearSecret = async (
    field: keyof UpdateWebsiteIntegrationKeysInput,
    name: string,
    consequence: string,
  ) => {
    const ok = await confirm({
      title: `Remove the stored ${name}?`,
      description: consequence,
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (!ok) return;
    // '' is the documented "clear it" signal; `undefined` would mean "leave it".
    saveKeys.mutate({ [field]: '' } as UpdateWebsiteIntegrationKeysInput);
  };

  const copyRevealed = () => {
    if (!revealed) return;
    void navigator.clipboard?.writeText(revealed.secret);
    toast.success('Copied.');
  };

  return (
    <>
      <PageGuide guideKey="admin_website_integrations" />
      <div className="mb-3">
        <WebsiteModuleFlagBanner />
      </div>

      <PageShell
        title="Integrations"
        subtitle="What jobsadmire.com presents to Operations, and who is told when it goes quiet."
        actions={
          <PinButton
            id="website.integrations"
            label="Website — Integrations"
            href={`/${locale}/admin/website/integrations`}
            module="website"
          />
        }
      >
        {configQuery.isLoading ? (
          <StateLoading />
        ) : configQuery.isError ? (
          <StateError
            error={
              configQuery.error instanceof Error
                ? configQuery.error
                : 'Could not load the website configuration.'
            }
            title="Couldn’t load the configuration"
            onRetry={() => void configQuery.refetch()}
          />
        ) : (
          <div className="space-y-4">
            {/* ── Status ────────────────────────────────────────────────── */}
            <CommandCard title="Public door credentials" icon={<KeyRound />}>
              <div className="flex flex-wrap items-center gap-1.5">
                <KeyChip name="Write token" has={!!config?.hasWriteToken} />
                <KeyChip
                  name="Previous write token"
                  has={!!config?.hasPreviousWriteToken}
                  note={
                    config?.previousWriteTokenExpiresAt
                      ? `valid until ${formatDateTime(config.previousWriteTokenExpiresAt)}`
                      : undefined
                  }
                />
                <KeyChip name="Test token" has={!!config?.hasTestToken} />
                <KeyChip name="Turnstile secret" has={!!config?.hasTurnstileSecret} />
                <KeyChip name="Revalidate secret" has={!!config?.hasRevalidateSecret} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Last Turnstile test:{' '}
                {config?.lastTestedAt
                  ? `${formatDateTime(config.lastTestedAt)} — ${
                      config.lastTestOk
                        ? 'OK'
                        : `failed${config.lastTestError ? `: ${config.lastTestError}` : ''}`
                    }`
                  : 'never'}
              </p>
            </CommandCard>

            {/* ── Second human (P9) ─────────────────────────────────────── */}
            <CommandCard title="Second human" icon={<UserRound />}>
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  A fallback recipient mailed directly on every website event — form received, forms
                  unavailable — even when nobody in Operations holds the grant. Required before the
                  door is flipped on (ping reports it as <code>secondHumanConfigured</code>).
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="secondHumanName">Name</Label>
                    <Input
                      id="secondHumanName"
                      value={secondHumanName}
                      onChange={(e) => setSecondHumanName(e.target.value)}
                      placeholder="e.g. Faraz"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="secondHumanEmail">Email</Label>
                    <Input
                      id="secondHumanEmail"
                      type="email"
                      value={secondHumanEmail}
                      onChange={(e) => setSecondHumanEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <Can module="website.integrations" action="EDIT">
                  <Button size="sm" disabled={saveSettings.isPending} onClick={() => saveSettings.mutate()}>
                    {saveSettings.isPending ? 'Saving…' : 'Save recipient'}
                  </Button>
                </Can>
              </div>
            </CommandCard>

            {/* ── MANAGE_KEYS block ─────────────────────────────────────── */}
            <Can
              module="website"
              action="MANAGE_KEYS"
              fallback={
                <CommandCard title="Super-admin only" icon={<KeyRound />}>
                  <p className="text-sm text-muted-foreground">
                    Website tokens and secrets are managed by super-admins. Ask Faraz if a token
                    needs rotating or the Turnstile secret needs replacing.
                  </p>
                </CommandCard>
              }
            >
              {/* Tokens */}
              <CommandCard title="Bearer tokens" icon={<RefreshCw />}>
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Server-generated; shown once at rotate time and never again. The website sends
                    the write token on every form post; the synthetic-lead cron sends the test token
                    (filed as Test, handler dry-run).
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm">
                      Write token: <KeyChip name="Write" has={!!config?.hasWriteToken} />
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={rotate.isPending}
                      onClick={() => void onRotate('writeToken')}
                    >
                      {config?.hasWriteToken ? 'Rotate' : 'Generate'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm">
                      Test token: <KeyChip name="Test" has={!!config?.hasTestToken} />
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={rotate.isPending}
                      onClick={() => void onRotate('testToken')}
                    >
                      {config?.hasTestToken ? 'Rotate' : 'Generate'}
                    </Button>
                  </div>
                  {revealed && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:bg-amber-950/20">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        New {ROTATE_COPY[revealed.name].label} — copy it now, it is shown only once:
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="flex-1 break-all rounded bg-background px-2 py-1 text-xs">
                          {revealed.secret}
                        </code>
                        <Button size="sm" variant="ghost" onClick={copyRevealed} aria-label="Copy token">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setRevealed(null)}>
                          I’ve saved it
                        </Button>
                      </div>
                      {revealed.previousExpiresAt && (
                        <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">
                          The previous write token keeps working until{' '}
                          {formatDateTime(revealed.previousExpiresAt)}.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CommandCard>

              {/* Turnstile */}
              <CommandCard
                title="Cloudflare Turnstile"
                icon={<PlugZap />}
                headerRight={<KeyChip name="Secret" has={!!config?.hasTurnstileSecret} />}
              >
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    One widget lists both jobsadmire.com and staging.jobsadmire.com, so one secret
                    serves both (P6). The site key is public and lives on Vercel.
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="turnstileSecret">Secret key</Label>
                    <Input
                      id="turnstileSecret"
                      type="password"
                      autoComplete="new-password"
                      value={turnstileSecret}
                      onChange={(e) => setTurnstileSecret(e.target.value)}
                      placeholder="Paste a new secret to replace"
                    />
                    <p className="text-xs text-muted-foreground">
                      Write-only — a stored secret is never displayed.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      disabled={saveKeys.isPending || !turnstileSecret.trim()}
                      onClick={() => saveKeys.mutate({ turnstileSecret: turnstileSecret.trim() })}
                    >
                      Save secret
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={testConnection.isPending || !config?.hasTurnstileSecret}
                      onClick={() => testConnection.mutate()}
                    >
                      {testConnection.isPending ? 'Testing…' : 'Test'}
                    </Button>
                    {test && (
                      <span className="flex items-center gap-2">
                        <StatusPill
                          tone={test.ok ? 'success' : 'destructive'}
                          size="xs"
                          label={test.ok ? 'OK' : 'Failed'}
                        />
                        <span className="text-xs text-muted-foreground">
                          {test.ok ? 'Cloudflare accepted the stored secret.' : test.error ?? 'Unknown error'}
                        </span>
                      </span>
                    )}
                    {config?.hasTurnstileSecret && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={saveKeys.isPending}
                        onClick={() =>
                          void clearSecret(
                            'turnstileSecret',
                            'Turnstile secret',
                            'Every website form is then accepted in DEGRADED mode (honeypot + dedupe only) and each hour raises a WEBSITE_FORMS_UNAVAILABLE alert until a secret is stored again.',
                          )
                        }
                      >
                        Remove stored secret
                      </Button>
                    )}
                  </div>
                </div>
              </CommandCard>

              {/* Revalidate secret */}
              <CommandCard
                title="Revalidate secret"
                icon={<KeyRound />}
                headerRight={<KeyChip name="Secret" has={!!config?.hasRevalidateSecret} />}
              >
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Presented by Operations to the website’s revalidate endpoint (Phase B). Stored now
                    so the flip needs no second visit; nothing in WP3a calls it yet.
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="revalidateSecret">Secret</Label>
                    <Input
                      id="revalidateSecret"
                      type="password"
                      autoComplete="new-password"
                      value={revalidateSecret}
                      onChange={(e) => setRevalidateSecret(e.target.value)}
                      placeholder="Paste a new secret to replace"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      disabled={saveKeys.isPending || !revalidateSecret.trim()}
                      onClick={() => saveKeys.mutate({ revalidateSecret: revalidateSecret.trim() })}
                    >
                      Save secret
                    </Button>
                    {config?.hasRevalidateSecret && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={saveKeys.isPending}
                        onClick={() =>
                          void clearSecret(
                            'revalidateSecret',
                            'revalidate secret',
                            'Phase B revalidation calls will be refused by the website until a new secret is stored on both sides.',
                          )
                        }
                      >
                        Remove stored secret
                      </Button>
                    )}
                  </div>
                </div>
              </CommandCard>
            </Can>
          </div>
        )}
      </PageShell>
    </>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/frontend
npx jest src/lib/api/website.spec.ts src/config/website-nav.spec.ts src/config/route-permissions.spec.ts src/lib/breadcrumbs-from-path.spec.ts src/components/auth/not-authorized.spec.tsx --maxWorkers=2
```

Expected: 5 suites pass. `route-permissions.spec.ts` "accounts for every page exactly once" and "every pinned entry still names a real page" pass because the three new `page.tsx` files and the three manifest lines land together (`_flag-banner.tsx` is not a `page.tsx`, so the walk ignores it); `breadcrumbs-from-path.spec.ts` "the English fallback map still covers every message key" passes because `SEGMENT_LABELS.website` / `.inbox` equal the new `en` messages; `not-authorized.spec.tsx` "has a label for EVERY permission key" passes only if Task 1's `permissions.keys.website*` labels are in both files — a failure naming `website*` means Task 1 is incomplete on this branch; do not add the labels here. Then, one job at a time (Mac Studio memory rule):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/frontend && npx tsc --noEmit
```

Expected: no output (exit 0). A `PermissionKey` error on `'website.forms'` / `'website.integrations'` means Task 1's `keys.catalog.ts` has not landed on this branch; a `Module '"@jobsadmire/constants"' has no exported member 'WEBSITE_FORM_KEYS'` (or `WebsiteTokenClass`) means Task 3's `website.enums.ts` has not.

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git add apps/frontend/src/lib/api/website.ts apps/frontend/src/lib/api/website.spec.ts \
  apps/frontend/src/config/modules.ts apps/frontend/src/config/route-permissions.ts \
  apps/frontend/src/config/route-permissions.spec.ts apps/frontend/src/config/website-nav.spec.ts \
  apps/frontend/src/lib/breadcrumbs-from-path.ts apps/frontend/src/lib/breadcrumbs-from-path.spec.ts \
  apps/frontend/src/messages/en.json apps/frontend/src/messages/tr.json \
  "apps/frontend/src/app/[locale]/admin/website"
git commit -m "feat(website): frontend module — nav entry, route manifest, forms inbox and integrations screens (WP3a)

- website ModuleEntry (Globe) after marketing: Inbox → /admin/website/inbox
  (website.forms VIEW), Setup → /admin/website/integrations
  (website.integrations VIEW); root redirects to the inbox (P14)
- ROUTE_PERMISSIONS lines for the three pages; website-nav.spec pins leaf
  permission === manifest line
- en+tr sidebar/breadcrumb/guide messages; 'inbox' segment avoids the
  'forms' = Form Builder crumb collision
- lib/api/website.ts: status/forms/integrations clients over the vocabulary
  imported from @jobsadmire/constants (RC1), needs-attention + can-rerun
  predicates (P8), payload summariser (RC5 field names)
- Forms inbox: PageShell + FilterBar + DataTable, ?row= SidePanel with
  payload fields / handler attempts / fraud evidence view + copy-link
  (RC23/RC27), gated re-run, ExportCsvButton on website.forms EXPORT
  through the dedicated export route (P3)
- Integrations: has* chips, write-only secret inputs, rotate/:name
  display-once + copy with the 24 h previous-token note (P7), Turnstile
  /test, second-human fields (P9), flag-off banner from GET /website/status (P1)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

---

