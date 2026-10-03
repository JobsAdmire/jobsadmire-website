# Task 13-local report — WP3a gate, local half (X15): §A, §B, §C2/§C3

Run 2026-09-19 19:35–20:2x UTC (2026-09-20 00:35–01:2x PKT) from the worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`, base `d30984b`. Not pushed. VPS touched only with read commands. No flag flipped anywhere but the throwaway local env.

**Status: DONE.** Gate record committed as `d6eb08c` (amended once, before any push, to make the B5 dev-restart note precise; the first SHA was 3d9506f) — `docs(website): WP3a gate record — local verification and prod baselines (§A, §B, §C2–C3)`; ticked A1–A5, B1–B5, C2, C3 (12), unticked C0, C1, D1–D4, E1–E4, F1–F3, G1–G3, H1–H4, I1 (21); token-leak grep 0.

## Step 0 — record created + Step 2 checks

`sed -n '31,84p' task-13-brief.md > docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` (the brief's fence, verbatim, 54 lines). Checks: `33` unchecked / `0` checked / `0` token values — as expected.

## §A — serial local verification

### A1 — origin/main check, npm ci, prisma generate
```
$ git fetch origin                          # exit 0 (prints a cosmetic "cat: .git/.github-token: Not a directory" — a credential helper reading a path that is a file in a worktree; the helper falls through)
$ git ls-remote origin refs/heads/main      # 9139e1657ee7112333983af133ef8d3043e1ef68
$ git rev-parse origin/main                 # 9139e1657ee7112333983af133ef8d3043e1ef68
$ git log --oneline HEAD..origin/main | wc -l   # 0
$ git merge-base HEAD origin/main           # 9139e16
$ git log --oneline origin/main..HEAD | wc -l   # 34 (HEAD d30984b before this task's commit)
```
**`origin/main` has NOT moved since `9139e16`** → nothing to rebase onto, no rebase performed (as instructed). Then `npm ci` → `added 1398 packages, and audited 1405 packages in 19s`, exit 0; `npx prisma generate --schema=apps/backend/prisma/schema.prisma` → `Generated Prisma Client (v5.22.0)`, exit 0.

### A2 — type-check
`npm run type-check` → turbo `Tasks: 10 successful, 10 total` (`type-check` on backend, frontend, constants, permissions, shared-types, validators + the four package builds), 7.3 s, exit 0.

### A3 — narrowed backend jest
`npx jest src/modules/website src/modules/notifications src/modules/sales src/modules/careers-public src/modules/email test/permissions --maxWorkers=2 --forceExit` → `Test Suites: 101 passed, 101 total` / `Tests: 1136 passed, 1136 total`, exit 0.

### A4 — full backend jest (merge gate) + flake handling
`NODE_OPTIONS=--max-old-space-size=4096 npx jest --maxWorkers=2 --forceExit` from `apps/backend`:
```
Test Suites: 14 failed, 10 skipped, 362 passed, 376 of 386 total
Tests:       93 skipped, 6885 passed, 6978 total
Time:        179.037 s
```
All 14 "failed" suites are `Test suite failed to run — A jest worker process (pid=…) was terminated by another process: signal=SIGTERM` — worker kills, **0 failing tests** (the known runner flake). Suites: ai-invite.guards, applicant-transitions, ir-workflow-alignment, stage-notify.logic, stored-phone-repair.logic, board.service, wa-linked-facts.service, whatsapp-notify.service, whatsapp.module, applicant-hire-workflow.unit, careers-public.unit, wa-import.int, wa-link.int, wa-room-authorizer.int.

Re-run of ONLY those 14 (same flags): `Test Suites: 1 failed, 2 skipped, 11 passed` / `Tests: 19 skipped, 159 passed, 178 total`. The remaining "failed" was `test/whatsapp/wa-link.int.spec.ts`, again a SIGTERM'd worker. Re-run of that one alone: `Test Suites: 1 skipped` / `Tests: 9 skipped` — `wa-link`, `wa-import`, `wa-room-authorizer` are `describeDb(...)` specs gated on `WA_DB_SPECS=1` (unset on the host) → `describe.skip` by design.

Net across the three runs: **373 suites passed + 13 skipped = 386/386 accounted for; 7044 tests passed, 0 failed.** Both outcomes recorded under A4.

### A5 — frontend specs
Six suites (`route-permissions`, `website-nav`, `api/website`, `breadcrumbs-from-path`, `notifications/entity-path`, `not-authorized`) → `Test Suites: 6 passed` / `Tests: 141 passed, 141 total`, exit 0.

## §B — DEPLOYMENT.md D24 recipe, steps 0–8 verbatim

- **Step 0:** `docker compose -p jobsadmire-operations -f <main>/docker-compose.yml down` → `ok: no ops containers`; the dev stack's named volumes `jobsadmire-operations_{postgres,redis,minio}_data` survived. CRM `jobsadmire_portal_*` and `tender_shaw` untouched.
- **Step 1:** `.env.local-prod` written with the recipe's local values (fresh `openssl rand` secrets; git-ignored; deleted in step 8).
- **Step 2 (B1):** `build backend frontend` → `jobsadmire-operations-website-backend:latest` (2.93 GB) + `-frontend:latest` (277 MB), exit 0, 0 error lines, ~9 min.
- **Step 3 (B1):** infra `up -d --wait` all Healthy; `migrate deploy` → `168 migrations found … 20260925120000_website_intake_door` last → `All migrations have been successfully applied.`
- **Step 4 (B2):** `drift exit=2` (expected per Task 12's corrected recipe / X4). Printed lines:
```
[-] Removed enums
  - LanguagePreference
[*] Changed the `hrm_attendance_records` table
  [-] Removed index on columns (leaveRequestId)
[*] Changed the `hrm_attendance_sessions` table
  [*] Altered column `updatedAt` (default changed from `Some(Now)` to `None`)
[*] Changed the `hrm_employment_contracts` table
  [*] Altered column `workingDays` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `onsiteDays` (default changed from `Some(Value(List([])))` to `None`)
[*] Changed the `hrm_persons` table
  [*] Altered column `workingDays` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `onsiteDays` (default changed from `Some(Value(List([])))` to `None`)
[*] Changed the `internal_interviews` table
  [-] Removed index on columns (cancelledAt)
[*] Changed the `internal_job_openings` table
  [*] Altered column `requiredLanguages` (default changed from `Some(Value(List([])))` to `None`)
[*] Changed the `iskur_job_postings` table
  [*] Altered column `skills` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `socialBenefits` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `licenceClasses` (default changed from `Some(Value(List([])))` to `None`)
[*] Changed the `iskur_posting_attempts` table
  [*] Altered column `screenshotKeys` (default changed from `Some(Value(List([])))` to `None`)
[*] Changed the `offer_letter_templates` table
  [*] Renamed index `offer_letter_templates_documentType_arrangement_locale_idx` to `offer_letter_templates_documentType_employmentArrangement_l_idx`
[*] Changed the `offer_letters` table
  [*] Altered column `workingDays` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `onsiteDays` (default changed from `Some(Value(List([])))` to `None`)
[*] Changed the `post_comments` table
  [*] Altered column `updatedAt` (default changed from `Some(Now)` to `None`)
[*] Changed the `project_expenses` table
  [-] Removed index on columns (currency)
[*] Changed the `travel_records` table
  [-] Removed index on columns (currency)
[*] Changed the `wa_conversations` table
  [-] Removed index on columns (lastMessageAt, id)
  [-] Removed index on columns (slaBreachedAt)
[*] Changed the `wa_template_edits` table
  [*] Renamed index `wa_template_edits_account_edited_idx` to `wa_template_edits_accountId_editedAt_idx`
```
  Gate grep `grep -iE 'website_|contactName|WEBSITE_'` → **empty** (`ok: no website lines in the drift`). Additionally diffed against the production baseline drift captured in C3 (noise stripped): **`diff` exit 0 — byte-identical.**
- **Step 5 (B3, flag=false):** `Permission conformance: 878 decorated, 64 public, 74 self-service, 0 undecorated (PERMISSIONS_STRICT=true)`, `Nest application successfully started`, no `Error:` line (only the two expected WARNs: `SMTP_HOST is not set`, `MINIO_PUBLIC_ENDPOINT is not set`); `health 200` `{"status":"ok",…,"database":true,"redis":true}`; `restarts=0 running`; `printenv` → `false` / `https://www.jobsadmire.com`; `ping 404`, `uploads 404`, `newsletter 404`.
- **Step 6 (B4):** seed exit 0, no stack trace: `role defaults v3: 280 created`, `Module notification settings: 18 event(s) ensured`, `Website forms: 10 row(s) ensured`. psql probes:
```
=== website_forms ===
  formKey   |       kind       | isActive 
------------+------------------+----------
 calculator | CALCULATOR_QUOTE | t
 callback   | CALLBACK         | t
 careers    | CAREERS_APPLY    | t
 contact    | INQUIRY          | t
 fraud      | FRAUD_REPORT     | t
 hire       | INQUIRY          | t
 newsletter | NEWSLETTER       | f
 partner    | INQUIRY          | t
 visit      | VISIT            | t
 workers    | INQUIRY          | t
(10 rows)

=== website% grants ===
       slug        |       module        | action | scope 
-------------------+---------------------+--------+-------
 admin             | website             | VIEW   | ALL
 admin             | website             | CREATE | ALL
 admin             | website             | EDIT   | ALL
 admin             | website             | DELETE | ALL
 admin             | website             | EXPORT | ALL
 marketing-manager | website.blog        | VIEW   | ALL
 marketing-manager | website.blog        | CREATE | ALL
 marketing-manager | website.blog        | EDIT   | ALL
 marketing-manager | website.collections | VIEW   | ALL
 marketing-manager | website.collections | CREATE | ALL
 marketing-manager | website.collections | EDIT   | ALL
 marketing-manager | website.media       | VIEW   | ALL
 marketing-manager | website.media       | CREATE | ALL
 marketing-manager | website.media       | EDIT   | ALL
 marketing-manager | website.navigation  | VIEW   | ALL
 marketing-manager | website.navigation  | CREATE | ALL
 marketing-manager | website.navigation  | EDIT   | ALL
 marketing-manager | website.pages       | VIEW   | ALL
 marketing-manager | website.pages       | CREATE | ALL
 marketing-manager | website.pages       | EDIT   | ALL
 marketing-manager | website.strings     | VIEW   | ALL
 marketing-manager | website.strings     | CREATE | ALL
 marketing-manager | website.strings     | EDIT   | ALL
 sales-agent       | website.forms       | VIEW   | ALL
 sales-executive   | website.forms       | VIEW   | ALL
 sales-manager     | website.forms       | VIEW   | ALL
(26 rows)

=== roles ===
         slug         |  type  | defaultsVersion 
----------------------+--------+-----------------
 admin                | SYSTEM |               3
 field-agent          | SYSTEM |               3
 hrm-admin            | SYSTEM |               3
 internal-recruiter   | SYSTEM |               3
 marketing-manager    | SYSTEM |               3
 sales-agent          | SYSTEM |               3
 sales-executive      | SYSTEM |               3
 sales-manager        | SYSTEM |               3
 super-admin          | SYSTEM |               0
 team-member          | SYSTEM |               3
 training-coordinator | SYSTEM |               3
 viewer               | SYSTEM |               3
(12 rows)

=== module_notification_settings website ===
 module  |         eventType         | inApp | email 
---------+---------------------------+-------+-------
 website | WEBSITE_FORM_RECEIVED     | t     | f
 website | WEBSITE_FORMS_UNAVAILABLE | t     | t
(2 rows)
```
  10 forms with `newsletter` inactive; 26 grants = admin 5 / marketing-manager 18 / sales-manager, sales-executive, sales-agent 1 each (`website.forms VIEW ALL`); nothing on integrations/settings/APPROVE/MANAGE_KEYS; the two notification rows exact. `defaultsVersion = 3` on all 11 matrixed built-in roles; **`super-admin` = 0** on the fresh DB because it has no `ROLE_PERMISSION_MATRIX` entry (CASL bypass) so the seed loop never bumps it — by design (production's row carries `1`; E4 should expect it to stay `1`, and the three CUSTOM roles at `0`).
  Frontend `up -d` → `frontend 200`, restarts=0.
- **Step 7 (B5, flag=true):** sed flip → `18:WEBSITE_MODULE_ENABLED=true`; backend recreated; conformance line count `1` (same `0 undecorated` line); `printenv` → `true`; `health 200`; **`ping 401`, `uploads 401`, `newsletter 401`** (`{"message":"Website intake is not configured.","error":"Unauthorized","statusCode":401}`); `restarts=0`. (My first newsletter probe hit port 4000 by typo → 404 from the frontend; re-probed on 4001 → 401. Recorded correctly.)
- **Step 8 (B5):** `down` exit 0 (network `jobsadmire-operations-website_jobsadmire-ops-network` removed), `rm -rf docker-volumes` ok, `.env.local-prod` removed, `git status --short` → only `?? docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` (the artifact itself), no `jobsadmire_ops_*` containers left.

### Deviation: restarting the dev stack
The recipe's `docker compose -p jobsadmire-operations -f <main>/docker-compose.yml up -d` brought the dev backend up **unhealthy**: `Error: Cannot find module '@jobsadmire/permissions'` in the seed and 29 `TS2307` from the watcher. Cause (pre-existing, exposed by the recreate): the main checkout's DEV images date from 2026-09-15 02:13 PKT — before `packages/permissions` landed — and the container that had been "Up 4 days" carried a hand-patched writable layer that `down` discarded; the host's `packages/permissions/dist` does not exist either (the dev DB also applied 5 pending migrations on this boot, confirming the staleness). The dev Dockerfiles at `main` do carry the package, so the standard `npm run dev` path (`up -d --build`) was run once to restore the stack — local-only; the main checkout's branch (`main` @ 9139e16) and files untouched. First attempt failed on a transient `getaddrinfo EAI_AGAIN github.com` inside BuildKit (bcrypt prebuilt fetch → source-compile fallback with no Python in the frontend image); retried. Outcome: see the "Dev stack final state" line at the end of this file.

## §C2 / §C3 — production baselines (read-only over `ssh jobsadmire_portal`, 19:53 UTC)

Deviation from the brief's letter: `flock -n <lock> true` was **not** run (it momentarily takes the poller lock — the dispatch restricted me to pure reads); poller idleness was read from the process table + the log tail instead.
```
wa_campaigns RUNNING: 0                      (COMPLETED 3, CANCELLED 1)
ps -eo pid,etime,cmd | grep -E 'auto-deploy\.sh|deploy-vps\.sh'   → none  → CRM poller idle, Ops poller idle
crontab: */2 * * * * …/jobsadmire-crm/scripts/auto-deploy.sh ; */2 * * * * …/jobsadmire-operations/scripts/auto-deploy.sh
CRM deploy.log tail: 2026-09-15 13:20:15 Deploy finished for f6d8fb4e322cf45c5619c4f8ddb8906117cd766d
Ops deploy.log tail: 2026-09-18 14:04:33 Deploy finished for 9139e1657ee7112333983af133ef8d3043e1ef68
.last-deploy-fail-sha: absent (no latched failure)
```
```
deployed=9139e1657ee7112333983af133ef8d3043e1ef68
restarts=0 started=2026-09-18T14:04:13.486262835Z status=running health=healthy
--- last drift output ---

[-] Removed enums
  - LanguagePreference

[*] Changed the `hrm_attendance_records` table
  [-] Removed index on columns (leaveRequestId)

[*] Changed the `hrm_attendance_sessions` table
  [*] Altered column `updatedAt` (default changed from `Some(Now)` to `None`)

[*] Changed the `hrm_employment_contracts` table
  [*] Altered column `workingDays` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `onsiteDays` (default changed from `Some(Value(List([])))` to `None`)

[*] Changed the `hrm_persons` table
  [*] Altered column `workingDays` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `onsiteDays` (default changed from `Some(Value(List([])))` to `None`)

[*] Changed the `internal_interviews` table
  [-] Removed index on columns (cancelledAt)

[*] Changed the `internal_job_openings` table
  [*] Altered column `requiredLanguages` (default changed from `Some(Value(List([])))` to `None`)

[*] Changed the `iskur_job_postings` table
  [*] Altered column `skills` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `socialBenefits` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `licenceClasses` (default changed from `Some(Value(List([])))` to `None`)

[*] Changed the `iskur_posting_attempts` table
  [*] Altered column `screenshotKeys` (default changed from `Some(Value(List([])))` to `None`)

[*] Changed the `offer_letter_templates` table
  [*] Renamed index `offer_letter_templates_documentType_arrangement_locale_idx` to `offer_letter_templates_documentType_employmentArrangement_l_idx`

[*] Changed the `offer_letters` table
  [*] Altered column `workingDays` (default changed from `Some(Value(List([])))` to `None`)
  [*] Altered column `onsiteDays` (default changed from `Some(Value(List([])))` to `None`)

[*] Changed the `post_comments` table
  [*] Altered column `updatedAt` (default changed from `Some(Now)` to `None`)

[*] Changed the `project_expenses` table
  [-] Removed index on columns (currency)

[*] Changed the `travel_records` table
  [-] Removed index on columns (currency)

[*] Changed the `wa_conversations` table
  [-] Removed index on columns (lastMessageAt, id)
  [-] Removed index on columns (slaBreachedAt)

[*] Changed the `wa_template_edits` table
  [*] Renamed index `wa_template_edits_account_edited_idx` to `wa_template_edits_accountId_editedAt_idx`

```
`grep -ciE 'website|contactName'` over the prod drift → `0`. Extra reads: last `[5b/9]` in deploy.log = `⚠ SCHEMA DRIFT DETECTED` (warn-only); prod `.env` has `0` × `WEBSITE_MODULE_ENABLED=` and `0` × `WEBSITE_SITE_URL=` (`grep -c` only — never printed); newest applied prod migration `20260925110000_platform_post_override_index`; `website_%` tables on prod: `0`; prod local `/api/health` → `200`; prod roles table: SYSTEM roles at `defaultsVersion` 1/2 (admin 2, marketing-manager 2, others 1, super-admin 1) + 3 CUSTOM at 0. Baseline saved at `/tmp/wp3a-baseline.txt` for §D's drift diff.

## Concerns / observations for the controller
1. **Guard-level 401 carries no `Cache-Control: private, no-store`** on the public routes (X6 says every public `website/v1` route; the header is set by the handler path — a guard rejection short-circuits before it). Harmless for a 401 body, but a literal reading of X6/the door-conformance spec may want it on the guard path too. Not fixed here (not this task's remit).
2. **`super-admin.defaultsVersion` is never bumped by the seed** (no matrix entry). E4's "every built-in role `defaultsVersion` 3" should be read as "every matrixed built-in role"; prod super-admin will stay `1`.
3. **The main checkout's dev images were stale** (pre-permissions-package); a bare `down`/`up -d` of the dev stack does not survive without `--build`. DEPLOYMENT.md's recipe step 0/8 could say `up -d --build` — or at least warn.
4. A4's SIGTERM worker flake hit 14 suites on the first pass (Mac under memory pressure: ~30 GB used, ~1.6 GB free during the run); every one passed or is a by-design skip on re-run.

## Files
- Gate record: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` (commit `d6eb08c`)
- Logs (scratchpad): `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/e2186f84-5a31-4b85-9453-d5ee861c5873/scratchpad/a2-typecheck.log`, `a3-jest-narrow.log`, `a4-jest-full.log`, `a4-jest-rerun.log`, `a4-jest-rerun2.log`, `a5-jest-frontend.log`, `b2-build.log`, `b3-infra.log`, `b3-migrate.log`, `b6-seed.log`, `b4-psql.txt`, `c2-prod.txt`, `c2-pollers.txt`, `c3-extra.txt`, `wp3a-baseline.txt`, `dev-restart-build.log`, `dev-restart-build2.log`; `/tmp/website-local-prod-drift.txt`, `/tmp/wp3a-baseline.txt`.

## Dev stack final state (after the deviation above)
Second `up -d --build` succeeded (both dev images now 2026-09-20 01:09 PKT), but the backend still crashed at runtime with `Cannot find module '/app/node_modules/@jobsadmire/permissions/dist/index.js'`: the compose bind mount `./packages:/app/packages` overlays the image's built packages with the host's, and the host main checkout had no `packages/permissions/dist` (its `constants/dist` was stale from Aug 25). Ran the host-side step the dev Dockerfile's own comment names — `npx turbo run build --filter='./packages/*'` in the main checkout (4 tasks, 2.1 s; creates only git-ignored `dist/` folders) — then `restart backend` + `up -d`. Result: `jobsadmire_ops_backend` healthy (`Permission conformance: 867 decorated, 58 public, 73 self-service, 0 undecorated` — `main`'s census), `/api/health` 200, `jobsadmire_ops_frontend` 200 on `/en/auth/login`; the dev DB `jobsadmire_ops_dev` also caught up 5 pending migrations from `main` on this boot (the WP3a migration was NOT applied to it — §B used the throwaway `docker-volumes/postgres` under the worktree, per X3/X4). Main checkout: branch `main` @ 9139e16, `git status --short` empty. CRM `jobsadmire_portal_*` and `tender_shaw` never touched.

Final record counts: `21` unchecked / `12` checked / `0` token values. Worktree status clean; 35 commits ahead of `origin/main`, none pushed.
