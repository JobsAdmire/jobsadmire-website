# Task 5 report — `Inquiry.contactName` end to end

## What was implemented

- **Backend DTOs** — `apps/backend/src/modules/sales/dto/create-inquiry.dto.ts` and `update-inquiry.dto.ts`: one `contactName?: string` property each (`@ApiPropertyOptional`, `@IsOptional`, `@IsString`, `@MaxLength(200)`), inserted immediately after `companyName?: string`, exactly as the brief's full-final-file text.
- **Backend service** — `apps/backend/src/modules/sales/inquiry.service.ts`, five edits:
  1. `create()`'s `prisma.inquiry.create` data: `contactName: dto.contactName,` after `companyName: dto.companyName,`.
  2. `findAll()`'s search `where.OR`: added `{ contactName: { contains: search, mode: 'insensitive' } }` plus the CLAUDE.md `where.OR`/scope-fragment comment (this list carries no scope fragment today).
  3. `update()`'s field mapping: `if (dto.contactName !== undefined) data.contactName = dto.contactName;`.
  4. `convertToLeadInternal`'s input type: added `contactName: string | null;`.
  5. Its `prisma.lead.create` data: `contactPerson: inquiry.contactName ?? null,` plus the extended comment explaining the WP3a rationale.
- **New spec** — `apps/backend/src/modules/sales/inquiry.contact-name.spec.ts` (4 tests: create writes it, update maps/ignores it correctly, search includes it in `OR`, conversion carries it to `Lead.contactPerson`).
- **Frontend types** — `apps/frontend/src/lib/api/sales.ts`: `contactName: string | null` on `Inquiry`; `contactName?: string` on `CreateInquiryPayload` and `UpdateInquiryPayload` (not on the unrelated `UpdateLeadPayload`, which also has a `companyName?` line — verified by anchoring on interface context, not just the grep hit).
- **Frontend list page** — `apps/frontend/src/app/[locale]/admin/sales/inquiries/page.tsx`: zod `contactName` field, form `defaultValues`, `onSubmit` payload mapping, a "Contact" table column after "Company", search placeholder now names Contact first, and a full-width "Contact name" `FormField` above the Company/Country grid in the create form.
- **Frontend detail page** — `apps/frontend/src/app/[locale]/admin/sales/inquiries/[id]/page.tsx`: header now renders `[contactName, companyName].filter(Boolean).join(' · ')` with `'Unknown Company'` fallback when both are empty (RC19: person · company), plus a new editable "Contact" row in the detail grid, right after "Company", writing into the same `editData`/`updateMutation` flow.

## RED → GREEN

Failing test first (spec written, then the exact three backend files were temporarily reverted to `HEAD` via `git checkout --` on `inquiry.service.ts` only — a single recoverable file, patch saved beforehand — to prove genuine RED, not just "the field doesn't exist yet"):

```
cd apps/backend && npx jest src/modules/sales/inquiry.contact-name.spec.ts --maxWorkers=2 --forceExit
```

RED result — 4/4 failing, matching the brief's predicted failure modes exactly:
- `writes contactName on create` — `data.contactName` was `undefined`.
- `maps contactName on update...` — update `data` was `{}` instead of `{ contactName: 'Mehmet Kaya' }`.
- `search finds people, not only companies` — `where.OR` had 4 entries, none `contactName`.
- `carries contactName to Lead.contactPerson...` — `data.contactPerson` was `undefined`.

Implementation patch re-applied (`git apply`), then GREEN:

```
cd apps/backend && npx jest src/modules/sales/inquiry.contact-name.spec.ts --maxWorkers=2 --forceExit
```

```
PASS src/modules/sales/inquiry.contact-name.spec.ts
  InquiryService → contactName
    ✓ writes contactName on create
    ✓ maps contactName on update, and leaves it alone when absent
    ✓ search finds people, not only companies
    ✓ carries contactName to Lead.contactPerson on conversion
Tests: 4 passed, 4 total
```

### One deviation from the brief's literal spec text (documented, not silent)

The brief's exact spec text — used verbatim at first — fails to **compile** under this repo's strict `ts-jest` (no `isolatedModules`): two of the stub mocks (`prisma.inquiry.findMany: jest.fn(async () => [])` and `prisma.lead.create: jest.fn(async () => (...))`) have no explicitly-typed parameter, so TypeScript infers them as zero-arity functions. `.mock.calls[0][0]` on a zero-arity mock is a compile error (`TS2493: Tuple type '[]' of length '0' has no element at index '0'`). I confirmed this is independent of the service implementation by reproducing the identical two errors against both the reverted (pre-`contactName`) and the implemented service — it is a pre-existing typing gap in the brief's literal mock declarations, not a consequence of my changes.

Fix applied (spec-only, no assertion or behavior changed): gave those two mocks an explicit `(_args?: unknown)` parameter, e.g. `findMany: jest.fn(async (_args?: unknown) => [])`. This is the minimal change that makes `.mock.calls[0][0]` typecheck (via the `unknown` cast already present in the assertions) while leaving every assertion, every stub's runtime behavior, and the test's semantics identical to the brief.

## Full sales-module suite

```
cd apps/backend && npx jest src/modules/sales --maxWorkers=2 --forceExit
```

```
PASS src/modules/sales/inquiry.contact-name.spec.ts
PASS src/modules/sales-training/sales-training-grading.logic.spec.ts
PASS src/modules/sales/lead-scope.spec.ts
PASS src/modules/sales/inquiry.walink.spec.ts
PASS src/modules/sales-training/sales-roleplay-prompt.spec.ts
PASS src/modules/sales/lead.walink.spec.ts
PASS src/modules/sales-training/sales-training-deadline.logic.spec.ts
PASS src/modules/sales-training/sales-trainer-prompt.spec.ts
PASS src/modules/sales-training/sales-training-progression.logic.spec.ts
PASS src/modules/sales/assignment-condition.spec.ts
PASS src/modules/sales-training/sales-training-gate.logic.spec.ts
PASS src/modules/sales/sales-number.logic.spec.ts

Test Suites: 12 passed, 12 total
Tests:       97 passed, 97 total
```

`inquiry.walink.spec.ts` confirmed byte-identical: `git diff --stat apps/backend/src/modules/sales/inquiry.walink.spec.ts` printed nothing, both before and after the run. Its 6 tests are part of the 97 above, all green with no edit and no new `InquiryService` constructor dependency.

## Typechecks (one at a time)

```
cd apps/backend && npx tsc --noEmit
```
Result: clean, no output, no errors.

```
cd apps/frontend && npx tsc --noEmit
```
Result: clean, no output, no errors (run after the backend check finished).

## Diff scope verification

```
git diff --numstat -- apps/backend/src/modules/sales apps/frontend/src/lib/api/sales.ts "apps/frontend/src/app/[locale]/admin/sales/inquiries"
```

| File | +/- | Brief expected |
|---|---|---|
| `create-inquiry.dto.ts` | 6/0 | 6/0 ✓ |
| `update-inquiry.dto.ts` | 6/0 | 6/0 ✓ |
| `inquiry.service.ts` | 11/1 | 11/1 ✓ |
| `sales.ts` | 3/0 | 3/0 ✓ |
| `inquiries/page.tsx` | 13/1 | 13/1 ✓ |
| `inquiries/[id]/page.tsx` | 3/1 | 3/1 ✓ |

`git status --short` after commit showed only these 6 modified files plus the new spec — nothing outside this task's file list was touched.

## Files changed

- `apps/backend/src/modules/sales/dto/create-inquiry.dto.ts`
- `apps/backend/src/modules/sales/dto/update-inquiry.dto.ts`
- `apps/backend/src/modules/sales/inquiry.service.ts`
- `apps/backend/src/modules/sales/inquiry.contact-name.spec.ts` (new)
- `apps/frontend/src/lib/api/sales.ts`
- `apps/frontend/src/app/[locale]/admin/sales/inquiries/page.tsx`
- `apps/frontend/src/app/[locale]/admin/sales/inquiries/[id]/page.tsx`

Commit: `f2912e9` — "feat(sales): Inquiry.contactName — the person's name survives from the form to the lead" (local only, not pushed).

## Self-review

**Completeness** — Both DTOs carry `contactName?`. `create`, `update`, and `findAll` (search) all wired in the service. `convertToLeadInternal` input type and its `lead.create` write both carry `contactName`/`contactPerson`. Frontend: `Inquiry`/`CreateInquiryPayload`/`UpdateInquiryPayload` types, list column, list search placeholder, create-form field, detail header (RC19 person · company), detail editable Contact row — all present. New spec covers all four behaviors the brief specified.

**Quality** — Every edit anchored on verbatim-verified quoted lines before editing (grepped each anchor first: all matched exactly, no drift from the brief's assumed baseline). Comments carried over exactly as the brief's full-final-file text specified (CLAUDE.md `where.OR` gotcha reference, the WP3a rationale on `contactPerson`, the RC19 header comment). No `any` introduced anywhere, including the one spec-only typing fix (used `unknown`, per CLAUDE.md's "never add `any`" rule).

**Discipline** — Nothing beyond the brief: no PRD/CLAUDE.md/docs edits (Task 12's territory), no seed changes, no guard/config/website files touched, no unrelated refactors. `git status` after commit confirms exactly the 7 intended files.

**Testing** — Genuine RED established by reverting only `inquiry.service.ts` (recoverable single-file `git checkout --`, patch pre-saved, never a bare `git stash`) with the spec already in place; 4/4 failures matched the brief's predicted messages. GREEN after reapplying. Full `sales` module suite green (97/97, 12 suites), `inquiry.walink.spec.ts` byte-identical and green within it. Both typechecks clean, run sequentially per the Mac Studio one-job-at-a-time rule.

## Concerns

- One documented, minimal deviation from the brief's literal spec text: two jest mocks needed an explicit `(_args?: unknown)` parameter to satisfy this repo's strict (non-`isolatedModules`) `ts-jest` type-checking on `.mock.calls[0][0]` indexing. Verified independent of the service implementation (reproduced identically against both reverted and implemented `inquiry.service.ts`). No assertion, stub behavior, or test semantics changed — see "One deviation" section above for the full reasoning.
- Not pushed, per instructions.
