# Task 11 report — Frontend: `website` module, route manifest, messages, Forms inbox, Integrations, `lib/api/website.ts`

**Status:** DONE_WITH_CONCERNS (one deliberate deviation from the brief's verbatim code, documented below; two small hardening changes on the Integrations page)
**Branch / worktree:** `website/wp3a-intake` at `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`
**Commit:** `f065e62` — `feat(website): frontend module — nav entry, route manifest, forms inbox and integrations screens (WP3a)` (single commit per the brief's plan; trailer `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` as instructed — not the brief's Fable trailer). Not pushed.

## Files

Created
- `apps/frontend/src/lib/api/website.ts` (333 lines)
- `apps/frontend/src/lib/api/website.spec.ts`
- `apps/frontend/src/config/website-nav.spec.ts`
- `apps/frontend/src/app/[locale]/admin/website/page.tsx` (root → redirect to `/inbox`)
- `apps/frontend/src/app/[locale]/admin/website/_flag-banner.tsx`
- `apps/frontend/src/app/[locale]/admin/website/inbox/page.tsx`
- `apps/frontend/src/app/[locale]/admin/website/integrations/page.tsx`

Modified
- `apps/frontend/src/config/modules.ts` — `Globe` import after `FolderOpen`; `website` ModuleEntry between `marketing` and `my-hr` (Inbox → `/inbox` on `website.forms` VIEW, Setup → `/integrations` on `website.integrations` VIEW; `labelKey`s `websiteInbox`, `websiteIntegrations`)
- `apps/frontend/src/config/route-permissions.ts` — three lines after `/admin/sales/expenses`: `/admin/website` → `website.forms`, `/admin/website/inbox` → `website.forms`, `/admin/website/integrations` → `website.integrations`
- `apps/frontend/src/config/route-permissions.spec.ts` — the new `it(...)` after "prefers a literal segment over a [param] one"
- `apps/frontend/src/lib/breadcrumbs-from-path.ts` — `SEGMENT_LABELS.website = 'Website'`, `.inbox = 'Inbox'`
- `apps/frontend/src/lib/breadcrumbs-from-path.spec.ts` — the two sample paths
- `apps/frontend/src/messages/en.json`, `tr.json` — `nav.breadcrumbs.website|inbox`, `sidebar.admin.website|websiteInbox|websiteIntegrations`, `guide.admin_website_inbox`, `guide.admin_website_integrations` (verbatim from the brief; `permissions.keys.website*` already present from Task 1 — added none)
- `apps/frontend/src/components/auth/not-authorized.spec.tsx` — **X2**: `toHaveLength(13)` → `15` with a one-line comment (WITHDRAW + UNAPPROVE from 1aa470a)
- `apps/frontend/src/app/[locale]/admin/sales/inquiries/[id]/page.tsx` — **Task 7 carry**: `whitespace-pre-line` on the `messagePreview` paragraph (one class)

## What was implemented, per screen

### `lib/api/website.ts`
Exactly the brief's file: template-literal value types over the `@jobsadmire/constants` enums (`WebsiteFormKind`, `WebsiteSubmissionStatus`, `WebsiteTokenClass`, `WEBSITE_FORM_KEYS` — re-declares none); `WEBSITE_SUBMISSION_STATUSES` derived at runtime; label/tone maps; `WebsiteStoredPayload`, `WebsiteAttemptRecord`, `WebsiteHandlerResult { attempts; visitorError?: true }`, `WebsiteFormSubmission` (list row + the four optional detail fields), `WebsiteSubmissionsQuery` (`needsAttention?: 'true'`, `isTest?: 'true'|'false'`), `websiteSubmissionNeedsAttention`, `websiteSubmissionCanRerun`, `websitePayloadSummary`, `websiteEvidenceKeysOf` (prefix-locked `^website-fraud/…`), `websiteEvidenceViewUrl` (the `applicantDocumentViewUrl` precedent), `WebsiteIntegrationConfig` (mirrors Task 4's `WebsiteIntegrationPublicShape` field for field, dates as ISO strings), the two update inputs, `WebsiteRotatableSecret`, `WebsiteRotatedSecret { name, secret, previousExpiresAt }`, `WebsiteConnectionTestResult { ok, error }` (RC9). Clients: `websiteStatusApi.get`, `websiteFormsApi.list/get/export/rerun/evidenceLink`, `websiteIntegrationsApi.get/update/updateKeys/rotateSecret/testConnection`. Only this file names a path.

Verified against the backend on the branch before writing: `website-forms-inbox.controller.ts` (list/export/`:id`/`:id/rerun`, export declared before `:id`), `query-website-submissions.dto.ts` (`needsAttention` `@IsIn(['true'])`, `isTest` `@IsIn(['true','false'])`, `from/to` `@IsDateString()`), `website-forms-evidence.controller.ts` (`…/evidence/:index/view|link`), `website-integrations.controller.ts` + DTOs (nullable settings body; keys `''` clears; `rotate/:name`; `test`), `website-forms-inbox.logic.ts` (row/detail shapes — no `formId`/hashes on the row).

### Forms inbox (`/admin/website/inbox`)
- `PageGuide admin_website_inbox`, `WebsiteModuleFlagBanner`, `PageShell` (title/subtitle, `PinButton`, `ExportCsvButton` inside `<Can module="website.forms" action="EXPORT">` walking `websiteFormsApi.export` — the dedicated, audited route — with `limit: 100`).
- `FilterBar`: search (placeholder per RC24: "e-mail case-insensitive; the rest exact case"), pinned `status` (from `WEBSITE_SUBMISSION_STATUSES`), pinned `needsAttention` (single option `'true'`), `formKey` (all ten keys, labelled), `isTest` (`Real only`=`'false'`, `Test only`=`'true'`), `date` range.
- Wire encoding per the execution notes: `needsAttention` is OMITTED unless `'true'`; `isTest` travels as the strings `'true'|'false'`; `from`/`to` are the date picker's `YYYY-MM-DD` (ISO 8601 date — the DTO's `@IsDateString` accepts it and the backend's `upperBound` reads a date-only `to` as the whole UTC day); empty strings are dropped (`|| undefined` + `toQuery` filter).
- `DataTable` columns: Received, Form (+ `Test` badge), Contact (`websitePayloadSummary`), Status (`StatusPill` + `Needs attention` warning pill), Filed as. `TablePagination`. Command-palette `Refresh website inbox`.
- Detail `SidePanel` deep-linked through `?row=<id>` (Task 10's `/website/inbox?row=<id>` lands here; `router.replace` keeps the other params). Uses the list row as a placeholder while `GET …/:id` loads. Header: kind · received time, status pill, `Test` badge. Needs-attention banner (**RC26**): FAILED + visitor error → "Refused for the visitor's own input (no alarm was raised): <error>"; FAILED otherwise → "Handler failed — an infrastructure error, the alarm was raised: <error>"; captcha-degraded → "Accepted while captcha was degraded — verify the contact before acting on it." The visitor-error test reads `handlerResultJson.visitorError` (the core's top-level stamp for "the LAST attempt") and falls back to the last attempt's `detail.visitorError` — the backend writes both (`website-forms.service.ts:387-388`), so both spellings named in the brief and the task notes are honoured.
- Facts grid (form key, locale, token class, captcha verdict, consent version, source path, filed as, handled at, purge after, user agent when the detail has loaded), Payload fields (`fieldText` joins arrays), **Evidence** section for `FRAUD_REPORT` rows (RC27: `View` = bearer blob-fetch of the streamed route into a new tab; `Copy link` = presigned URL from `…/link` to the clipboard with a "valid for 15 minutes" toast), Handler attempts (per attempt: OK/Failed pill, time, actor, `re-run`/`dry run` badges, error, created entity, `detail` JSON).
- Footer: Close; `Re-run handler` only when `websiteSubmissionCanRerun` AND inside `<Can module="website.forms" action="EDIT">`, behind `useConfirm`; footer text explains why a FAILED-after-filing row cannot be re-run.

### Integrations (`/admin/website/integrations`)
- `PageGuide admin_website_integrations`, banner, `PinButton`.
- "Public door credentials" card: `KeyChip`s for write token, previous write token (with `valid until <previousWriteTokenExpiresAt>`), test token, Turnstile secret, revalidate secret; last Turnstile test line (`lastTestedAt/lastTestOk/lastTestError`).
- "Second human" (P9): name + email inputs, `Save recipient` inside `<Can module="website.integrations" action="EDIT">`, sends `trim() || null` (RC9 nullable body).
- `<Can module="website" action="MANAGE_KEYS" fallback=…>` wraps: Bearer tokens (Rotate/Generate write + test via `rotate/:name`, `useConfirm` copy per token explains the 24 h window vs immediate cut-over; display-once amber box with the secret in `<code>`, a Copy button, the `previousExpiresAt` note, and `I've saved it`), Cloudflare Turnstile (write-only `type="password" autoComplete="new-password"` input, `Save secret` disabled until non-empty, `Test` (`POST …/test` → OK/Failed pill + `error`), `Remove stored secret` → `useConfirm` destructive → `{ turnstileSecret: '' }`), Revalidate secret (same write/clear pattern).
- The MANAGE_KEYS fallback is a friendly "Super-admin only" card, so a `website.integrations` VIEW/EDIT holder sees the second-human form and never a token box that would 403.

### Root redirect, banner, nav, manifest, crumbs, messages — as the brief.

## UI-kit API differences vs the brief, and how resolved

I read every component the brief uses before writing: `PageShell`, `FilterBar` (`FilterDef`/`FilterValue`/`'status'`/`'select'`/`'date-range'`/`pinned`/`showSearch`…), `DataTable` (`rowKey`, `loading`, `onRowClick`, `emptyState`), `SidePanel`/`SidePanelFooter` (`width="wide"`, `ariaDescription`, `headerActions`, `footer`, `left`), `StatusPill` (`tone`, `label`, `icon`, `size="xs"`), `StateEmpty/StateError/StateLoading`, `PinButton`, `useConfirm` (`destructive`), `useCommandRegistry`, `ExportCsvButton` (`fetchPage` walks `{ data, meta }`), `CommandCard` (`title`, `icon`, `headerRight`), `PageGuide`, `TablePagination`, `<Can module action fallback>`, `formatDateTime`, `CsvColumn`, `getAccessTokenFromCookie`, `apiClient.get/post/patch`. **No UI-kit API differs from the brief**; everything type-checks unchanged.

**One deliberate deviation (browser API, not UI kit) — the evidence `View` opener.** The brief's `openEvidence` did `const tab = window.open(objectUrl, '_blank', 'noopener'); if (!tab) { revoke; throw 'The browser blocked the evidence tab' }`. Per the HTML spec (and as this repo's own `hrm/persons/[id]/page.tsx` documents: "`noopener` in the feature string makes `open` return null in Chrome, so the opener is severed on the handle instead"), that handle is `null` even when the tab opened — the brief's code would have revoked the blob and toasted "blocked" on **every** click, so RC27's View would never work. Replaced with the repo precedent: `openEvidenceTab()` opens `about:blank` synchronously inside the click (keeps the user gesture, so it is not a pop-up), sets `tab.opener = null`, then `loadEvidenceInto(tab, …)` bearer-fetches the stream and sets `tab.location.href = objectUrl`; a genuinely blocked (`null`) handle falls back to `window.open(objectUrl, '_blank', 'noopener')` without inspecting the return; the tab is closed on a fetch failure; the object URL is revoked after 60 s (the İŞKUR-CV lifecycle). Same behaviour the brief intended, now reachable.

**Two small hardenings on the Integrations page (beyond the brief, same intent):**
1. The second-human `useEffect` was keyed on `[config]`; React Query's structural sharing means every rotate/test refetch changes `updatedAt`/`lastTestedAt` → new object → the effect would wipe a name typed but not yet saved. Now keyed on `[loaded, storedName, storedEmail]` (no `eslint-disable`).
2. `I've saved it` also calls `rotate.reset()` so the rotated secret leaves the mutation cache, not only the screen.

## RED → GREEN

RED (`cd apps/frontend && npx jest src/lib/api/website.spec.ts src/config/website-nav.spec.ts src/config/route-permissions.spec.ts src/lib/breadcrumbs-from-path.spec.ts --maxWorkers=2`), exactly as the brief predicted:
- `website.spec.ts`: `Cannot find module './website'`
- `website-nav.spec.ts`: `expect(entry).toBeDefined()` received `undefined` (+ the three dependent cases)
- `route-permissions.spec.ts`: 11 passed, 1 failed — only the new case (`Received: null`)
- `breadcrumbs-from-path.spec.ts`: `every emitted key has a message in BOTH languages` → `missing: { en: ['website','inbox'], tr: ['website','inbox'] }`

GREEN (the brief's Step 4 list + `entity-path.spec.ts` per the execution notes):
```
PASS src/components/auth/not-authorized.spec.tsx
PASS src/config/route-permissions.spec.ts
PASS src/lib/notifications/entity-path.spec.ts
PASS src/config/website-nav.spec.ts
PASS src/lib/breadcrumbs-from-path.spec.ts
PASS src/lib/api/website.spec.ts
Test Suites: 6 passed, 6 total
Tests:       141 passed, 141 total
```
`route-permissions.spec.ts` "accounts for every page exactly once" / "no unmapped pages" pass with the three new `page.tsx` files (`_flag-banner.tsx` is not a page). `not-authorized.spec.tsx` "has a label for EVERY permission key" passes — Task 1's `permissions.keys.website*` labels are on the branch in both files. Full frontend lane, once, after the amendments: `npx jest --maxWorkers=2` → **91 suites, 1297 tests, all passing**.

## Typecheck / eslint
- `cd apps/frontend && npx tsc --noEmit` → exit 0, no output (run twice: after the first implementation and after the amendments).
- `npx eslint` on every touched file, once (plus the four website files again after the amendments) → all new/changed files clean. The only findings are **pre-existing** on `sales/inquiries/[id]/page.tsx` (`UserPlus` import line 7 and the local `Plus` SVG helper line 350, both `no-unused-vars`) — I proved they are present on HEAD's version of that file at the same lines; my change there is the single `whitespace-pre-line` class the carry note asked for, so I left the legacy debt alone (the repo's `next.config.js` documents skipping lint for exactly this legacy sales debt).
- No Next build run (Task 13's), no docker.

## Self-review checklist
- Completeness: module entry + sub-rail; three manifest lines; en+tr for every new key (crumbs, sidebar, two guides); inbox with all filters / detail / re-run / export / evidence / `?row=`; integrations with get, PATCH settings, PATCH keys, rotate/:name, test, second-human fields, flag-off banner; api client; X2; the inquiry-detail class. All done.
- Quality: no secret is rendered outside `{revealed && …}`; the config shape carries `has*` only; secret inputs are `password`/`new-password`, never pre-filled, cleared after save; export button gated on `website.forms EXPORT` and walks the dedicated export route; re-run gated on `website.forms EDIT` and `canRerun`; page guards are the three fail-closed manifest lines, pinned to the leaves by `website-nav.spec.ts`; secret controls inside `<Can module="website" action="MANAGE_KEYS">`.
- Discipline: worked only in the worktree; no `cd` to the main checkout; no `git stash`; one commit (amended before reporting, unpushed); nothing outside the brief's file list except the two execution-note edits (X2, inquiry class).
- Testing: pristine — 6/6 named suites green, full lane 91/91 green, tsc clean, eslint clean on new code.

## Concerns / notes for the reviewer
1. **Deviation from verbatim code:** the evidence `View` opener (above). I am confident the brief's version would not have worked in Chrome; the replacement is the repo's documented precedent. If the reviewer prefers the brief's literal code, it needs at minimum the `if (!tab)` branch removed.
2. `useSearchParams()` is called directly in the inbox page component (no `<Suspense>`), following the eleven existing admin pages that do the same (`sales/leads`, `hrm/advances`, …). Task 13's Next build is where a "missing Suspense boundary" error would surface; it has not on those precedents.
3. `Copy link` writes to the clipboard after an `await` of the `link` route; fine in Chrome (clipboard-write is granted to the active tab), Safari may require the write inside the gesture. Toasts the failure rather than failing silently.
4. The `formKey` filter lists all ten keys including `newsletter`, whose `WebsiteForm.isActive=false` until counsel clears (D14); it is a filter, not a door, so nothing is exposed.

## Fix round 1 (review, 2026-09-20)

**Commit:** `415a127` — `fix(website): integrations rotate/copy safety, read-only second-human for viewers, inbox detail error + gated re-run text` (Opus trailer; unpushed). Two files: `apps/frontend/src/app/[locale]/admin/website/integrations/page.tsx`, `apps/frontend/src/app/[locale]/admin/website/inbox/page.tsx`.

| # | Item | What changed |
|---|---|---|
| 1 | Rotate must not overwrite an uncopied secret | Both rotate buttons: `disabled={rotate.isPending \|\| revealed !== null}` — the display-once box has to be dismissed (`I've saved it`, which also `rotate.reset()`s) before either token can be rotated again. |
| 2 | `copyRevealed` truthfulness | Now `async`, `await navigator.clipboard.writeText(...)`, `toast.success('Copied.')` only after it resolves; any refusal (insecure origin, denied permission) toasts "Copy the token by hand — this browser refused clipboard access." (the en.json `copyFailed` wording precedent). Button calls `() => void copyRevealed()`. |
| 3 | No dead second-human form for VIEW-only holders | `usePermissions().can('website.integrations','EDIT')` → `mayEditSettings`; both inputs get `readOnly` + `aria-readonly` + `bg-muted text-muted-foreground` when false. The Save button keeps its `<Can>` gate. |
| 4 | Footer sentence gated like the button | The "safe to re-run" sentence is wrapped in `<Can module="website.forms" action="EDIT" fallback={<>Submission {id}</>}>`; the other two footer texts are unchanged. |
| 5 | Detail fetch failure in the attempts section | When the list row is standing in (`handlerResultJson === undefined`) and `detailQuery.isError`, the section renders "Couldn't load the handler attempts — <message>. Try again" (a `refetch()` link) instead of "Loading…". The whole-panel `StateError` still covers the case where no list row is available either. |
| 6 | Banner wording | Infrastructure branch now reads "Handler failed — an infrastructure error (alarmed once per window): <error>" (the `handlerFailed` alarm is SETNX-deduped per window). |

**Verification (one job at a time, `--maxWorkers=2`):** the six named suites → 6/6, 141 tests; full frontend lane → 91 suites / 1297 tests green; `npx tsc --noEmit` exit 0; `npx eslint` on the two touched pages exit 0.
