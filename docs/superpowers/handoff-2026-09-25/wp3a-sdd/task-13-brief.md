### Task 13: Gate + push sequence — serial local verification, migration-alone push (cherry-picked), code push, flag flip, ping per token class, live autoresponder proof, captchaDegraded drill, artifact record — P12

Rulings applied: P12 (migration commit pushed and verified ALONE before the code commits; local `docker-compose.vps.yml` boot with the flag `false` AND `true` before every push; peers announced; never push while a poller is deploying; `jest --maxWorkers=2`, one Docker stack at a time), P1 (flag flipped on the VPS AFTER this gate), P2 (the test class is a dry run — its POST is the door's own proof), P6 (invalid captcha → 403, missing secret → degraded + alarm), P7/RC2 (three Bearer classes `write | test | previous-write`, stamped verbatim, reported by ping), P8 (same-payload replay within the hour returns the prior row), P9 (second human mailed on every website event), P11 as amended by RC13 (ping carries `secondHumanConfigured`; the gate reads it `true` before trusting the door), RC1 (real producers named below; no conditional pre-flights), RC3 (three public controllers — the gate proves all three sit behind both guards), RC8 (`website.forms VIEW` on sales-manager, sales-executive AND sales-agent — the psql assertions say so), RC10 (migration folder `20260925120000_website_intake_door`; DEPLOYMENT recipes: Task 2's `### Flipping …`, Task 12's `### Booting the production compose file locally …`), RC11 (`WEBSITE_SITE_URL=https://www.jobsadmire.com` written to the VPS `.env` with the flip), RC14 as amended by RC26 (wire contract = Task 6's: `WebsiteFormSubmitDto` at `dto/website-form-submit.dto.ts`, header `X-Website-Visitor-Ip`, HTTP 200, `{ data: { id, formKey, status, isTest, replayed, captchaDegraded, error } }` — `error` is `null` on every gate POST below, since none of them is a handler-reported visitor error; the dummy-captcha test POST runs AFTER the Turnstile secret is switched to Cloudflare's always-pass secret — it lives in §H, not §G; the cherry-pick of the migration onto `origin/main` is the EXPECTED path, since Task 1's commit precedes Task 3's in branch history), RC17 (every local command runs in the `jobsadmire-operations-website` worktree), RC18 (`WEBSITE_SITE_URL` — Task 9's compose default is already `https://www.jobsadmire.com`; the `.env` line is written with the flip so the value is explicit), RC30 (the owner is asked for the second alert human's name + e-mail at the START of the gate — item C0 — so the flip in §G is never blocked on the day; §G still refuses to run while `secondHumanConfigured` is not `true`), RC15 (no placeholders: the gate record is printed once in full).

**Files:**
- Create: `docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` (the artifact; committed and pushed AFTER the gate as its own docs commit — the third and last backend restart)
- Modify (append one line): `/Users/agentfaraz/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md` — appended after Task 12's line, which begins `**WP3a docs (2026-09-19):**` (that line itself follows the one beginning `**WP3a (2026-09-19 05:20):**`)
- Test: the gate record itself — `grep -c '^- \[ \]' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` is the failing test (unchecked items `33` before, `0` after) plus the token-leak grep (`0` both times).

All local commands run in the WP3a worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (branch `website/wp3a-intake`; the shared checkout `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations` stays on `main` and is never switched — parallel-sessions rule), one job at a time — never a jest run beside a Docker build (the Mac has hung twice). VPS commands go through `ssh jobsadmire_portal` directly (the `.ssh-cmd` relay is Cowork-only). Nothing in this task is written to the repo except the gate record.

**Interfaces:**
- Consumes (Task 3, RC1/RC10): the migration commit — folder `apps/backend/prisma/migrations/20260925120000_website_intake_door/` (its own commit; every statement `IF NOT EXISTS`-guarded; `ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'WEBSITE_FORM_RECEIVED' | 'WEBSITE_FORMS_UNAVAILABLE'`, `ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "contactName" TEXT`, tables `website_integration_config`, `website_forms`, `website_form_submissions`, `website_subscribers`); Prisma enum `WebsiteTokenClass { WRITE, TEST, PREVIOUS_WRITE }` on `WebsiteFormSubmission.tokenClass` (RC2).
- Consumes (Task 2, RC1/RC10): `WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-false}` in `docker-compose.vps.yml` (dev compose defaults `true`); `WebsiteModuleEnabledGuard` at `src/modules/website/guards/website-module-enabled.guard.ts` → generic 404 while the flag is not `'true'` (P1); `docs/DEPLOYMENT.md` section `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` (its pre-flip readout of `GET /api/website/integrations`, its `wa_campaigns` RUNNING count, and the flip one-liner that appends the `.env` line when missing).
- Consumes (Task 4): `WebsiteApiGuard` (401 with no/invalid/short token; stamps `req.websiteTokenClass: 'write' | 'test' | 'previous-write'`, order write → test → previous-write, `timingSafeEqual` — P7/RC2); `GET /api/website/v1/ping` → `{ data: { tokenClass, moduleEnabled: true, captcha: 'configured' | 'missing', secondHumanConfigured: boolean, trippedForms: string[], lastSubmissionAt: string | null, bucketPolicy: null, lastCrmFeedAt: null } }` (RC13); `GET /api/website/integrations` (`website.integrations` VIEW) → `{ data: { id, hasWriteToken, hasPreviousWriteToken, previousWriteTokenExpiresAt, hasTestToken, hasTurnstileSecret, hasRevalidateSecret, secondHumanEmail, secondHumanName, lastTestedAt, lastTestOk, lastTestError, updatedById, createdAt, updatedAt } }`; `PATCH /api/website/integrations` body `{ secondHumanEmail?: string | null; secondHumanName?: string | null }`; `PATCH /api/website/integrations/keys` body `{ turnstileSecret?: string; revalidateSecret?: string }` (`''` clears); `POST /api/website/integrations/rotate/:name` (`writeToken | testToken`) → `{ data: { name, secret, previousExpiresAt } }` — `wsw_` + 48 hex for the write token, `wst_` + 48 hex for the test token, shown ONCE, the previous WRITE token honoured for 24 h (RC9); `POST /api/website/integrations/test` → `{ data: { ok, error } }`; `GET /api/website/status` (`@SelfService`) → `{ data: { enabled } }`.
- Consumes (Task 6, RC14): `POST /api/website/v1/forms/:formKey` with `WebsiteFormSubmitDto` (`apps/backend/src/modules/website/dto/website-form-submit.dto.ts`): body `{ locale: 'tr' | 'en', consentVersion: string (≤ 40), captchaToken?: string (≤ 2048), honeypot?: string, sourcePath?: string, fields: Record<string, unknown> }`, optional headers `X-Website-Visitor-Ip`, `X-Website-Visitor-Ua`; `@HttpCode(200)` → `{ data: { id, formKey, status: 'HANDLED' | 'FAILED' | 'SPAM', isTest, replayed, captchaDegraded, error: string | null } }` (RC26 — `error` is the visitor-safe message only when the handler reported `detail.visitorError`; every gate POST here answers `error: null`); 400 invalid fields, 403 captcha failed (no row written), 404 unknown/inactive form or module off, 429 tripped (`{ message, fallback: 'whatsapp' }`). `contact` form fields: `name` (required), `email` (required), `phone`, `company`, `country`, `iAm`, `subject`, `message` (required, ≤ 5000). Dedupe: `requestHash` = formKey + isTest + locale + fields (not the IP), hour bucket — an identical body inside the hour returns the prior row with `replayed: true` (P8). Test class: full validation + captcha + row with `isTest = true`, handler dry-run → `status = 'HANDLED'`, `createdEntityType`/`createdEntityId` null, no Inquiry, no notification, no autoresponder (P2). `WebsiteCaptchaService.verify()` → `{ outcome: 'passed' | 'failed' | 'degraded', reason?: 'secretMissing' | 'unreachable' | 'httpError' }` (RC7). Seed `apps/backend/prisma/website-form-seed.ts` (`WEBSITE_FORM_SEED`, ten rows, `newsletter.isActive = false`), called from `seed.ts` (RC1) — hence the ten-row assertions in B4/E4.
- Consumes (Task 7, RC1): inbox routes on `WebsiteFormsInboxController`, `@Controller('website/forms/submissions')` — `GET /api/website/forms/submissions` (`website.forms` VIEW; `{ data, meta }`, each row with `formKind`), `GET …/submissions/:id`, `POST …/submissions/:id/rerun` (`website.forms` EDIT), `GET …/submissions/export` (`website.forms` EXPORT, `@AuditEntity('WebsiteFormSubmission')`); `Inquiry` rows created with `InquirySource.WEBSITE_FORM`, `contactName`, `inquiryNumber` `INQ-<year>-NNN` (Task 5's column, rendered in the inquiry detail header).
- Consumes (Tasks 8/9, RC3): sibling public controllers `@Controller('website/v1/uploads')` (`POST uploads/fraud-evidence`) and `@Controller('website/v1/newsletter')` (`GET newsletter/confirm`, `GET newsletter/unsubscribe`, `POST newsletter/unsubscribe`) carrying the same `@Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)` — the gate proves each answers 404 while the flag is off and 401 without a token once it is on; Task 8's evidence read-back `GET /api/website/forms/submissions/:id/evidence/:index/view|link` (RC23). `WEBSITE_SITE_URL: ${WEBSITE_SITE_URL:-https://www.jobsadmire.com}` in `docker-compose.vps.yml` and `WEBSITE_SITE_URL=https://www.jobsadmire.com` in `.env.production.example` (Task 9, RC18); the `.env` line is still written explicitly with the flip.
- Consumes (Task 10, RC6): `WebsiteNotifyService.formReceived()` (bell `WEBSITE_FORM_RECEIVED` to `website.forms` viewers + super-admins, second human mailed directly) and `formsUnavailable({ reason: 'captchaDegraded', formKey, detail })` (SETNX key `website:alarm:captchaDegraded:<form>`, TTL 3600 — fires ONCE per form per hour; bell + email to super-admins, email to the second human); `WebsiteAutoresponderService.send()` — `.hbs` EN/TR per form from the default mailbox for hire, contact, partner, workers, callback, visit, calculator, fraud (careers and newsletter excluded); `WebsitePingService.trippedForms` from `WebsiteAbuseService`; `module-notification-seed.ts` rows `{ website, WEBSITE_FORM_RECEIVED, inApp: true, email: false }` and `{ website, WEBSITE_FORMS_UNAVAILABLE, inApp: true, email: true }`.
- Consumes (Task 1, RC8): `ROLE_DEFAULTS_VERSION = 3`; `since: 3` rows — `role-admin` → `website` VIEW/CREATE/EDIT/DELETE/EXPORT (5 rows); `role-marketing-manager` → `website.pages|strings|collections|blog|media|navigation` × VIEW/CREATE/EDIT (18 rows); `role-sales-manager`, `role-sales-executive`, `role-sales-agent` → `website.forms` VIEW (3 rows) — 26 `website%` rows after the seed; `PERMISSION_KEYS` = 85.
- Consumes (Task 11, P14): `/admin/website/integrations` (has* chips, Rotate with display-once + copy, Test, second-human fields, the "public intake door is off" banner from `GET /website/status`), `/admin/website/inbox` (needs-attention filter, `?row=<id>` SidePanel with payload + handler result + Re-run, `ExportCsvButton` on EXPORT).
- Consumes (Task 12, RC10): `docs/DEPLOYMENT.md` section `### Booting the production compose file locally (plan D24 — before every website-programme push)` (steps 0–8; run verbatim in §B) and its runbook row naming the Vercel variable `OPS_WEBSITE_WRITE_TOKEN`.
- Consumes (repo, verified): `scripts/auto-deploy.sh` (cron every 2 min; `flock -n` on `/var/www/html/jobsadmire-operations/.auto-deploy.lock`; logs `New commits detected (<old> → <new>), starting deploy`, `Deploy finished for <sha>` or `ABORT: deploy-vps.sh failed for <sha> …`; latches `.last-deploy-fail-sha`); `scripts/deploy-vps.sh` (steps `[1/9]` pull … `[2/9] Building Docker images`, `[4/9] Pre-migration database backup`, `[5/9] Running database migrations (before app start)`, `[5b/9] Checking for schema drift` → `✓ schema.prisma matches the database` or `⚠ SCHEMA DRIFT DETECTED` + `/tmp/ops-schema-drift.txt` (warn-only, `DRIFT_IS_FATAL=0`), `[6/9] Starting application services`, `[6b/9] Running prisma db seed (idempotent)`, `[8/9] Running health checks` → `Backend health:  OK (HTTP 200)` / `Frontend health: OK (HTTP 200)`, `[9/9]` writes `.deployed-sha`; a `[2/9]` or `[5/9]` failure leaves the OLD containers serving; `--rollback` rebuilds `.last-good-deploy`); CRM poller lock `/var/www/html/jobsadmire-crm/.auto-deploy.lock`; containers `jobsadmire_ops_postgres` (`-U jobsadmire_ops -d jobsadmire_operations`), `jobsadmire_ops_backend`, `jobsadmire_ops_frontend`; boot log line `Permission conformance: N decorated, N public, N self-service, N undecorated (PERMISSIONS_STRICT=true)` (`permission-conformance.service.ts`); `GET /api/health` (`HealthController`, `@Public()`, 200 when healthy); tables `roles(slug, type, defaultsVersion)`, `role_permissions(roleId, module, action, scope)`, `module_notification_settings(module, eventType, inApp, email)`, `notifications(type, title, createdAt)`, `wa_campaigns(status)`, `inquiries(inquiryNumber, contactName, createdAt)`; the CLAUDE.md session trick (a super-admin session can be minted by injecting `access_token`/`refresh_token` cookies) and its rule "grep for `Deploy finished for <sha>`, never the bare hash".
- Produces: `docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` with every artifact (SHAs, deploy.log excerpts, `StartedAt`/`RestartCount`, health histograms, the conformance line, ping JSON per token class, psql outputs, autoresponder `Message-ID`s, the alarm notification row); the live write token (W2) and test token (T1) in the owner's password manager (never in the repo, the record or chat — token NAMES and lengths only); `WEBSITE_MODULE_ENABLED=true` and `WEBSITE_SITE_URL=https://www.jobsadmire.com` in the VPS `.env`; one memory status line. Website WP2 consumes `OPS_WEBSITE_WRITE_TOKEN` (= W2) from the vault; the external monitor's synthetic-lead job consumes T1.

- [ ] **Step 1: Write the failing test**

Create `docs/superpowers/plans/2026-09-19-wp3a-gate-record.md` with every item unchecked. An item is ticked only when its artifact is pasted beneath it. Final file as created (the artifacts are appended under the items during Step 3):

````markdown
# WP3a gate record — website intake door (Operations)

Branch `website/wp3a-intake` → `main`. Rulings P1–P14 (2026-09-19 05:10 PKT) + RC1–RC15 (06:00 PKT). Every item below is ticked only with its artifact pasted under it. Secrets never appear here — token NAMES (W1, W2, T1) and lengths only; a `wsw_`/`wst_` value in this file fails the record's own test.

## A. Local, serial (one job at a time, `--maxWorkers=2`)
- [ ] A1 rebased on `origin/main` clean; `npm ci` + `npx prisma generate` re-run after the rebase
- [ ] A2 `npm run type-check` green (four workspaces)
- [ ] A3 narrowed backend jest green (website + notifications + sales + careers-public + email + test/permissions)
- [ ] A4 full backend jest green (`--maxWorkers=2`, `NODE_OPTIONS=--max-old-space-size=4096`)
- [ ] A5 frontend website/permission/notification specs green

## B. Local production-compose boot (DEPLOYMENT.md "Booting the production compose file locally", both flag states)
- [ ] B1 images built; `migrate deploy` applied `20260925120000_website_intake_door` last
- [ ] B2 drift gate `exit=0` on the fresh database
- [ ] B3 flag=false: conformance line with `0 undecorated`; health 200; `restarts=0`; ping 404; uploads 404; newsletter confirm (GET) 404
- [ ] B4 seed ran: `website_forms` 10 rows (`newsletter` inactive); 26 `website%` grants (admin 5, marketing-manager 18, sales-manager/executive/agent 1 each); built-in roles `defaultsVersion` 3; 2 `module_notification_settings` rows for `website`
- [ ] B5 frontend 200; flag=true → ping 401, uploads 401, newsletter confirm (GET) 401; `restarts=0`; torn down; `git status` clean

## C. Coordination
- [ ] C0 the owner named the second alert human (name + e-mail) — asked at the START of the gate (RC30), before §A runs, so F.5 and the flip are never blocked on the day; recorded here as "named: yes" only (no address in this file)
- [ ] C1 peer sessions told (ListAgents → SendMessage), 5 min waited, no objection
- [ ] C2 no `wa_campaigns` RUNNING; CRM poller idle; Ops poller idle; last deploy.log line is a finished deploy
- [ ] C3 prod baselines captured (deployed SHA, `StartedAt`, `RestartCount`, last drift output)

## D. Migration-alone push (cherry-picked onto origin/main — the expected path, RC14)
- [ ] D1 pushed exactly the migration commit to `main` (SHA: )
- [ ] D2 deploy.log: `[5/9]` applied `20260925120000_website_intake_door`; `[5b/9]` drift output differs from the baseline by NOTHING mentioning `website`, `WEBSITE` or `contactName`; `Deploy finished for <sha>`
- [ ] D3 health watch: 200s with one ≤ 60 s 502/000 window; `RestartCount` 0; `StartedAt` new; `.deployed-sha` = migration SHA
- [ ] D4 prod schema: 4 `website_*` tables, 2 `WEBSITE_*` NotificationType labels, 3 `WEBSITE_SUBMISSION_*` ActivityType labels, `inquiries.contactName`

## E. Code push
- [ ] E1 rebased onto `main` (migration commit dropped as already applied — no `prisma/migrations` change left), invariants re-run green, peers told again, pollers idle; pushed (SHA: )
- [ ] E2 deploy.log: `[5/9]` `No pending migrations to apply`; `[5b/9]` unchanged from D2; `[6b/9]` seed finished without a stack trace; `Backend health:  OK`; `Frontend health: OK`; `Deploy finished for <sha>`
- [ ] E3 conformance line from the prod container (`0 undecorated`); health watch; `RestartCount` 0 after 10 min; ping 404 (flag still false); `.deployed-sha` = code SHA
- [ ] E4 prod seed effects: 26 `website%` grants; built-in roles `defaultsVersion` 3 (CUSTOM roles untouched at their prior value); 2 notification-setting rows; 10 `website_forms`; no pre-existing grant changed

## F. Integrations screen (super-admin, live UI, door still OFF)
- [ ] F1 banner "public intake door is off" visible; write token rotated → W1 (`wsw_` + 48 hex, `previousExpiresAt: null`); rotated again → W2 (`previousExpiresAt` = now + 24 h); test token rotated → T1 (`wst_` + 48 hex); W2 + T1 saved in the owner's vault
- [ ] F2 website Turnstile secret saved (`hasTurnstileSecret: true`); second human saved (name + e-mail from the owner); Test → `lastTestOk: true`
- [ ] F3 read-back before the flip: `GET /api/website/integrations` shows `hasWriteToken`, `hasPreviousWriteToken`, `hasTestToken`, `hasTurnstileSecret` all `true`, `secondHumanEmail` non-null (RC13)

## G. Flag flip + ping per token class
- [ ] G1 VPS `.env`: `WEBSITE_MODULE_ENABLED=true` + `WEBSITE_SITE_URL=https://www.jobsadmire.com`; `up -d backend`; `printenv` → `true`; health 200; `ping-no-token 401`; `GET /api/website/status` → `enabled: true`; banner gone
- [ ] G2 ping: W2 → `tokenClass: "write"`, `captcha: "configured"`, `secondHumanConfigured: true`, `trippedForms: []`; W1 → `"previous-write"`; T1 → `"test"`; garbage `wsw_…` → 401; 19-char token → 401
- [ ] G3 sibling public controllers on and fail-closed: `POST /api/website/v1/uploads/fraud-evidence` no token → 401; `GET /api/website/v1/newsletter/confirm?token=…` no token → 401

## H. Live door proof (WP3a gate: "ping per token class; live autoresponder send"; nothing here is assumed working)
- [ ] H1 Turnstile secret switched to Cloudflare's always-pass test secret; test-class POST to `contact` → 200 `status: "HANDLED"`, `isTest: true`, row `tokenClass = TEST`, `captchaPassed = t`, `createdEntityType` null, no Inquiry, no mail; same body again → same `id`, `replayed: true`
- [ ] H2 write-class EN + TR POSTs → two 200s with distinct ids; EN then TR autoresponder received in the owner's mailbox (two `Message-ID`s pasted); `WEBSITE_FORM_RECEIVED` ×2 in a `website.forms` viewer's bell; second human's mailbox has both copies; inbox rows `HANDLED` with `createdEntityType = inquiry`; `?row=<id>` panel opens; export CSV downloads; both inquiries show `contactName` in the header and are CLOSED with note "WP3a gate proof"
- [ ] H3 real Turnstile secret restored, Test ok; dummy token with the write class → 403 and no new row
- [ ] H4 captchaDegraded drill: secret cleared (`hasTurnstileSecret: false`, ping `captcha: "missing"`); test-class POST → 200 with `captchaDegraded: true`, row `captchaPassed` null; `WEBSITE_FORMS_UNAVAILABLE` (reason `captchaDegraded`, form `contact`) in a super-admin's bell + email and in the second human's mailbox; secret restored; Test ok; ping `captcha: "configured"`

## I. Record
- [ ] I1 every artifact above pasted; memory line appended; W2 + T1 in the owner's vault (`OPS_WEBSITE_WRITE_TOKEN` to Vercel once `jobsadmire-web-v2` exists, T1 to the external monitor); peers told before the docs push — the docs commit's own deploy proof (`Deploy finished for <sha>`, health 200, `RestartCount` 0) is recorded in the memory line, since it cannot be inside the commit it proves
````

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && grep -c '^- \[ \]' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md; grep -c '^- \[x\]' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md; grep -cE 'ws[wt]_[0-9a-f]{48}' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md
```

Expected: `33`, `0`, `0` — every item unchecked (the gate is not passed), nothing ticked, no token value present.

- [ ] **Step 3: Implement** — execute the gate in this order, pasting each artifact under its item and flipping `[ ]` → `[x]`. Nothing later is started while an earlier item is red.

**C0 first (RC30).** Before §A: ask Faraz for the second alert human's name and e-mail (owner action "name the second alert human" — required, no default; P9/D25/RC13). Keep the answer in the vault note beside the tokens; the record gets `C0 named: yes`. If the owner has not answered by the time §F is reached, the gate parks at F.5 — §G must never run with `secondHumanConfigured: false`.

**A. Serial local verification (P12; Mac Studio memory rule)**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git fetch origin && git status --short && git rebase origin/main
npm ci && npx prisma generate --schema=apps/backend/prisma/schema.prisma      # A1 — always after a rebase (stale node_modules shows up as "Cannot find module" storms, not as code failures)

npm run type-check                                                            # A2: turbo, four workspaces, all green

cd apps/backend
npx jest src/modules/website src/modules/notifications src/modules/sales src/modules/careers-public src/modules/email test/permissions --maxWorkers=2 --forceExit   # A3
NODE_OPTIONS=--max-old-space-size=4096 npx jest --maxWorkers=2 --forceExit   # A4 — the merge gate; nothing else running on the machine
cd ../frontend
npx jest src/config/route-permissions.spec.ts src/config/website-nav.spec.ts src/lib/api/website.spec.ts src/lib/breadcrumbs-from-path.spec.ts src/lib/notifications/entity-path.spec.ts src/components/auth/not-authorized.spec.tsx --maxWorkers=2   # A5
cd ../..
```

Expected: every suite `PASS`; A4 ends `Tests: … passed, 0 failed`. Paste the `Tests:` summary lines under A2–A5.

**B. Local production-compose boot** — run `docs/DEPLOYMENT.md` → `### Booting the production compose file locally (plan D24 — before every website-programme push)` verbatim, steps 0–8 (Task 12 wrote it; it is the D24 gate and the only place `schema.prisma` and the migration are proven to agree on a fresh database). Paste under B1–B5: the last two lines of `migrate deploy` (the newest applied name must be `20260925120000_website_intake_door`), `drift exit=0`, the `Permission conformance: …` line, `restarts=0`, the frontend `200`, and the flag-state codes. Between the recipe's step 6 (seed) and step 7 (flag states) take these probes:

```bash
docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c "select \"formKey\", kind, \"isActive\" from website_forms order by 1"
docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c "select r.slug, p.module, p.action, p.scope from role_permissions p join roles r on r.id = p.\"roleId\" where p.module like 'website%' order by 1,2,3"
docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c "select slug, type, \"defaultsVersion\" from roles order by 1"
docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c "select module, \"eventType\", \"inApp\", email from module_notification_settings where module = 'website' order by 2"
```

Expected (B4): 10 form rows, `newsletter | NEWSLETTER | f`, the other nine `t`; 26 grant rows — `admin` × `website` {VIEW, CREATE, EDIT, DELETE, EXPORT}, `marketing-manager` × six content keys × {VIEW, CREATE, EDIT}, `sales-manager` / `sales-executive` / `sales-agent` × `website.forms VIEW` (scope `ALL`) — and nothing on `website.integrations`, `website.settings`, APPROVE or MANAGE_KEYS (RC8); every built-in role `defaultsVersion = 3`; exactly two notification rows — `WEBSITE_FORM_RECEIVED | t | f` and `WEBSITE_FORMS_UNAVAILABLE | t | t`. In the recipe's step 7 add the two sibling public routes next to the ping probe, both flag states:

```bash
curl -s -o /dev/null -w 'uploads %{http_code}\n' -X POST http://localhost:4001/api/website/v1/uploads/fraud-evidence      # 404 (flag=false) → 401 (flag=true)
curl -s -o /dev/null -w 'newsletter %{http_code}\n' 'http://localhost:4001/api/website/v1/newsletter/confirm?token=xxxxxxxxxxxxxxxx'   # 404 → 401 (GET — Task 9's route)
```

B5 is ticked only after the recipe's step 8 (`down`, data dirs removed, `git status --short` empty) — then restart the dev stack only if no push is being verified.

**C. Coordination (parallel-sessions rule; spec §11)**

1. `ListAgents`, then `SendMessage` to every other session on this machine: `Pushing WP3a (website intake door) to jobsadmire-operations main in ~10 min: first the migration commit alone, then the code commits, later a docs-record commit — three backend restarts of ~60 s each. Reply now if a campaign, a batch job or your own push is in flight.` Wait 5 minutes; any objection = wait.
2. Campaigns and pollers:

```bash
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select count(*) from wa_campaigns where status = 'RUNNING'\""     # 0
ssh jobsadmire_portal "flock -n /var/www/html/jobsadmire-crm/.auto-deploy.lock true && echo 'CRM poller idle' || echo 'CRM DEPLOYING - wait'"
ssh jobsadmire_portal "flock -n /var/www/html/jobsadmire-operations/.auto-deploy.lock true && echo 'Ops poller idle' || echo 'Ops DEPLOYING - wait'"
ssh jobsadmire_portal "tail -3 /var/www/html/jobsadmire-crm/deploy.log; echo ---; tail -3 /var/www/html/jobsadmire-operations/deploy.log"
```

Expected: `0`, both `idle`, and the last Ops line is `Deploy finished for <sha>` (or an older finished deploy), never `starting deploy` without its `finished`.

3. Baselines:

```bash
ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && echo deployed=\$(cat .deployed-sha) && docker inspect -f 'restarts={{.RestartCount}} started={{.State.StartedAt}}' jobsadmire_ops_backend && echo '--- last drift output ---' && cat /tmp/ops-schema-drift.txt" > /tmp/wp3a-baseline.txt; cat /tmp/wp3a-baseline.txt
```

Paste under C3. The drift output is the pre-existing production drift (the incident snapshot tables, the orphan `LanguagePreference` type, index/default differences); it contains nothing with `website` or `contactName` in it.

**D. Migration-alone push (P12; cherry-pick path, RC14)**

Task 1's commit precedes Task 3's in branch history, so the migration commit is never the first commit after `origin/main`; it is pushed alone from a temporary branch built on `origin/main`:

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git log --oneline origin/main..HEAD
MIG=$(git log --format=%H origin/main..HEAD -- apps/backend/prisma/migrations/20260925120000_website_intake_door | tail -1)
git show --stat "$MIG"                                                      # files: prisma/migrations/20260925120000_website_intake_door/migration.sql, schema.prisma, packages/constants/src/enums/website.enums.ts + index.ts, website-schema.spec.ts, the PRD §8 lines — nothing under src/modules/website
git branch -f wp3a-migration-only origin/main && git checkout wp3a-migration-only && git cherry-pick "$MIG"
git push origin HEAD:main && git rev-parse origin/main                     # → the migration SHA on main (paste under D1)
git checkout website/wp3a-intake && git branch -D wp3a-migration-only

# health watch for the whole deploy, in the background (15 min)
( for i in $(seq 1 90); do printf '%s %s\n' "$(date -u +%H:%M:%S)" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 https://operations.jobsadmire.com/api/health)"; sleep 10; done ) > /tmp/wp3a-health-migration.log 2>&1 &

ssh jobsadmire_portal "timeout 900 tail -n0 -f /var/www/html/jobsadmire-operations/deploy.log" | tee /tmp/wp3a-deploy-migration.log
```

Expected in deploy.log, in order: `New commits detected (<old> → <sha>), starting deploy`, `[2/9] Building Docker images`, `[4/9] Pre-migration database backup`, `[5/9] Running database migrations (before app start)`, `1 migration found` … `Applying migration \`20260925120000_website_intake_door\``, `[5b/9]` either `✓ schema.prisma matches the database` or `⚠ SCHEMA DRIFT DETECTED` followed by the SAME drift as the baseline, `[6b/9] Running prisma db seed` (the OLD seed — no website rows yet), `Backend health:  OK (HTTP 200)`, `Frontend health: OK (HTTP 200)`, `Deploy finished for <sha>`. Stop the tail with Ctrl-C after that line. If `ABORT: deploy-vps.sh failed` appears instead: read the failing step — a `[2/9]` or `[5/9]` failure leaves the OLD containers serving and latches the SHA; fix forward with a new commit, never `rm .last-deploy-fail-sha` blind.

```bash
ssh jobsadmire_portal "cat /tmp/ops-schema-drift.txt" | diff <(sed -n '/last drift output/,$p' /tmp/wp3a-baseline.txt | tail -n +2) - ; echo "drift-diff exit=$?"   # empty diff (exit 0) or a diff with no line mentioning website|WEBSITE|contactName
ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && echo deployed=\$(cat .deployed-sha) && docker inspect -f 'restarts={{.RestartCount}} started={{.State.StartedAt}}' jobsadmire_ops_backend"
curl -s -o /dev/null -w 'health %{http_code}\n' https://operations.jobsadmire.com/api/health
sort -k2 /tmp/wp3a-health-migration.log | awk '{print $2}' | sort | uniq -c | sort -rn      # mostly 200; a handful of 502/000 inside one ≤ 60 s window
grep -vE ' 200$' /tmp/wp3a-health-migration.log                                            # the non-200 timestamps must be contiguous
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select table_name from information_schema.tables where table_name like 'website_%' order by 1\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select enumlabel from pg_enum e join pg_type t on t.oid = e.enumtypid where t.typname = 'NotificationType' and enumlabel like 'WEBSITE_%' order by 1\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select enumlabel from pg_enum e join pg_type t on t.oid = e.enumtypid where t.typname = 'ActivityType' and enumlabel like 'WEBSITE_%' order by 1\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select column_name from information_schema.columns where table_name = 'inquiries' and column_name = 'contactName'\""
```

Expected: `.deployed-sha` = the migration SHA; `restarts=0` and a new `started=`; health `200`; four tables (`website_form_submissions`, `website_forms`, `website_integration_config`, `website_subscribers`); `WEBSITE_FORMS_UNAVAILABLE`, `WEBSITE_FORM_RECEIVED`; `WEBSITE_SUBMISSION_FAILED`, `WEBSITE_SUBMISSION_HANDLED`, `WEBSITE_SUBMISSION_RECEIVED`; `contactName`. The old code now runs against a superset schema — correct by construction (additive only) and the point of pushing it alone. Paste everything under D1–D4.

**E. Code push**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git fetch origin && git rebase origin/main                                  # the cherry-picked migration commit drops out as already applied
git log --oneline origin/main..HEAD                                         # the code + docs commits only
git diff --stat origin/main..HEAD -- apps/backend/prisma/migrations         # must print nothing
cd apps/backend && npx jest test/permissions/repo-invariants.spec.ts test/permissions/role-defaults.unit.spec.ts test/permissions/website-conformance.spec.ts test/permissions/website-door-conformance.spec.ts src/modules/website/website-env.spec.ts src/modules/website/website-docs-guard.spec.ts --maxWorkers=2 --forceExit && cd ../..   # E1 re-run after the rebase
# repeat C.1 (message + 5 min) and C.2 (campaigns + pollers) — then:
git push origin HEAD:main && git rev-parse origin/main                      # paste the SHA under E1
( for i in $(seq 1 90); do printf '%s %s\n' "$(date -u +%H:%M:%S)" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 https://operations.jobsadmire.com/api/health)"; sleep 10; done ) > /tmp/wp3a-health-code.log 2>&1 &
ssh jobsadmire_portal "timeout 900 tail -n0 -f /var/www/html/jobsadmire-operations/deploy.log" | tee /tmp/wp3a-deploy-code.log
```

Expected: `[5/9] … No pending migrations to apply`, `[5b/9]` identical to D2, `[6/9] Starting application services`, `[6b/9] Running prisma db seed (idempotent)` finishing without a stack trace, `Backend health:  OK (HTTP 200)`, `Frontend health: OK (HTTP 200)`, `Deploy finished for <sha>`. A `Permission conformance failed` at boot would surface as `Backend health:  FAILED (HTTP 000)` with the poller latching the SHA and production DOWN until a fix commit — §B exists so this never happens; if it does, push a fix commit within minutes, and if no fix is obvious inside 10 minutes run `ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && ./scripts/deploy-vps.sh --rollback"` (rebuilds the pre-website code, which boots on the superset schema).

```bash
ssh jobsadmire_portal "docker logs jobsadmire_ops_backend 2>&1 | grep -E 'Permission conformance' | tail -1"          # … 0 undecorated (PERMISSIONS_STRICT=true)
ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && echo deployed=\$(cat .deployed-sha) && docker inspect -f 'restarts={{.RestartCount}} started={{.State.StartedAt}}' jobsadmire_ops_backend"
sleep 600; ssh jobsadmire_portal "docker inspect -f 'restarts={{.RestartCount}}' jobsadmire_ops_backend"            # still 0 after 10 min
awk '{print $2}' /tmp/wp3a-health-code.log | sort | uniq -c | sort -rn
curl -s -o /dev/null -w 'ping %{http_code}\n' https://operations.jobsadmire.com/api/website/v1/ping                 # 404 — flag still false on the VPS
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select r.slug, p.module, p.action, p.scope from role_permissions p join roles r on r.id = p.\\\"roleId\\\" where p.module like 'website%' order by 1,2,3\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select slug, type, \\\"defaultsVersion\\\" from roles order by 1\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select module, \\\"eventType\\\", \\\"inApp\\\", email from module_notification_settings where module = 'website' order by 2\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select \\\"formKey\\\", kind, \\\"isActive\\\" from website_forms order by 1\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select count(*) from role_permissions where module not like 'website%' and \\\"updatedAt\\\" > now() - interval '30 minutes'\""   # 0 — the seed never rewrites an existing grant
```

Paste under E2–E4. Expected as in B4, this time against the real roles: 26 `website%` rows, `defaultsVersion = 3` on every built-in role (CUSTOM roles keep their previous value — the seed has no matrix for them), the two notification rows, ten forms, and `0` touched non-website grants.

**F. Integrations screen (live UI, as super-admin; door still OFF)** — mint a session by injecting `access_token`/`refresh_token` cookies (CLAUDE.md) or log in as the owner account. Open `https://operations.jobsadmire.com/en/admin/website/integrations`:

1. Confirm the banner "public intake door is off" (from `GET /api/website/status` → `{ data: { enabled: false } }`).
2. Click **Rotate** on the write token → the display-once value **W1** (`wsw_` + 48 hex; the response's `previousExpiresAt` is `null`); save it in the owner's password manager as `ops-website-write-token (W1, superseded)`. Click **Rotate** again → **W2**; save as `ops-website-write-token (LIVE)`; note the `previousExpiresAt` (now + 24 h). Two rotations on purpose: W1 is the `previous-write` proof in G2 for 24 h.
3. Click **Rotate** on the test token → **T1** (`wst_` + 48 hex); save as `ops-website-test-token`.
4. Paste the website's Turnstile secret (Cloudflare → Turnstile → the widget whose hostnames are `jobsadmire.com` + `staging.jobsadmire.com`, created by the owner in WP0 — NOT `TURNSTILE_SECRET_KEY`, which is the careers widget) and Save → the `hasTurnstileSecret` chip turns on.
5. Second human: enter the name + e-mail the owner gave in C0 (RC30) and Save. **If the owner has not named one, the gate STOPS here** — §G must not run with `secondHumanConfigured: false` (RC13).
6. Click **Test** → `lastTestOk: true`, timestamp shown.
7. Read back (F3, RC13 — `ping` is still a 404 so this is the only readout available before the flip):

```bash
# $COOKIE = the minted super-admin session's Cookie header value; never echoed into the record
curl -s -H "Cookie: $COOKIE" https://operations.jobsadmire.com/api/website/integrations | sed -E 's/"secondHumanEmail":"[^"]*"/"secondHumanEmail":"<set>"/'
```

Expected: `hasWriteToken: true`, `hasPreviousWriteToken: true`, `previousWriteTokenExpiresAt` ≈ now + 24 h, `hasTestToken: true`, `hasTurnstileSecret: true`, `secondHumanEmail` set, `lastTestOk: true`. Paste the chip states and that JSON (e-mail redacted) under F1–F3 — never a token value.

**G. Flag flip + ping per token class**

Run `docs/DEPLOYMENT.md` → `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` verbatim (its pre-flip steps 1–3 are E3, F3 and C.2 — repeat C.2 now), with one addition BEFORE its `up -d backend`: the RC11 site URL, appended in the same `.env` edit so the single recreate picks up both:

```bash
ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && (grep -q '^WEBSITE_SITE_URL=' .env && sed -i 's#^WEBSITE_SITE_URL=.*#WEBSITE_SITE_URL=https://www.jobsadmire.com#' .env || printf '\n# Public site base URL for website-module links (RC11)\nWEBSITE_SITE_URL=https://www.jobsadmire.com\n' >> .env) && grep -n '^WEBSITE_SITE_URL=' .env"
# now the DEPLOYMENT.md flip block, unchanged:
ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && \
  (grep -q '^WEBSITE_MODULE_ENABLED=' .env \
     && sed -i 's/^WEBSITE_MODULE_ENABLED=.*/WEBSITE_MODULE_ENABLED=true/' .env \
     || printf '\n# Website intake door (PRD §5.12) — flipped after the WP3a gate\nWEBSITE_MODULE_ENABLED=true\n' >> .env) && \
  grep -n '^WEBSITE_MODULE_ENABLED=' .env && \
  docker compose -f docker-compose.vps.yml up -d backend && \
  sleep 20 && docker exec jobsadmire_ops_backend printenv WEBSITE_MODULE_ENABLED WEBSITE_SITE_URL && \
  curl -s -o /dev/null -w 'health %{http_code}\n' http://localhost:4001/api/health && \
  curl -s -o /dev/null -w 'ping-no-token %{http_code}\n' http://localhost:4001/api/website/v1/ping"
ssh jobsadmire_portal "docker inspect -f 'restarts={{.RestartCount}} started={{.State.StartedAt}}' jobsadmire_ops_backend"   # restarts=0, new started=
curl -s -H "Cookie: $COOKIE" https://operations.jobsadmire.com/api/website/status; echo                                      # {"data":{"enabled":true}}
```

Expected: the two `.env` lines, `true` and `https://www.jobsadmire.com` from `printenv`, `health 200`, `ping-no-token 401`, `enabled: true`, and the Integrations banner gone on reload. Paste under G1.

Then, with `W1`, `W2`, `T1` exported in the local shell for this step only (`export W2=…` etc. typed by hand from the vault, `unset` afterwards; never echo them):

```bash
P=https://operations.jobsadmire.com/api/website/v1/ping
curl -s -H "Authorization: Bearer $W2" $P; echo    # {"data":{"tokenClass":"write","moduleEnabled":true,"captcha":"configured","secondHumanConfigured":true,"trippedForms":[],"lastSubmissionAt":null,"bucketPolicy":null,"lastCrmFeedAt":null}}
curl -s -H "Authorization: Bearer $W1" $P; echo    # "tokenClass":"previous-write" (inside the 24 h window opened in F.2)
curl -s -H "Authorization: Bearer $T1" $P; echo    # "tokenClass":"test"
curl -s -o /dev/null -w 'garbage %{http_code}\n' -H "Authorization: Bearer wsw_$(openssl rand -hex 24)" $P   # 401
curl -s -o /dev/null -w 'short %{http_code}\n' -H "Authorization: Bearer wsw_0123456789abcde" $P            # 401 (below WEBSITE_TOKEN_MIN_LENGTH, fail-closed)
# G3 — the sibling public controllers are on and fail closed too (RC3)
curl -s -o /dev/null -w 'uploads %{http_code}\n' -X POST https://operations.jobsadmire.com/api/website/v1/uploads/fraud-evidence
curl -s -o /dev/null -w 'newsletter %{http_code}\n' 'https://operations.jobsadmire.com/api/website/v1/newsletter/confirm?token=xxxxxxxxxxxxxxxx'   # GET — Task 9's route
```

Expected: the three JSONs with `secondHumanConfigured: true` (if it is `false`, F.5 was not saved — stop and fix before H), the two 401s, and `uploads 401` / `newsletter 401`. Paste under G2–G3.

**H. Live door proof (WP3a gate: "ping per token class; live autoresponder send"; nothing is assumed working)**

The dummy `captchaToken` below is INVALID under the real Turnstile secret — the door correctly answers 403 and writes no row (P6). So the proof runs under Cloudflare's documented always-pass test secret, and the real secret is restored and re-proven in H3. Two conventions for every POST: `X-Website-Visitor-Ip` is the header Task 6 reads (RC14); the answer is HTTP 200 with `{ data: … }`.

1. On the Integrations screen replace the Turnstile secret with `1x0000000000000000000000000000000AA` (Cloudflare's "always passes" secret), Save. Then the test class (P2 — the door's own dry run, formerly G3 — RC14):

```bash
F=https://operations.jobsadmire.com/api/website/v1/forms/contact
BODY_T='{"locale":"en","consentVersion":"privacy-2026-09","captchaToken":"XXXX.DUMMY.TOKEN.XXXX","fields":{"name":"WP3a synthetic","email":"synthetic@example.invalid","phone":"+905000000000","message":"WP3a gate - test class dry run"}}'
curl -s -X POST $F -H "Authorization: Bearer $T1" -H 'Content-Type: application/json' -H 'X-Website-Visitor-Ip: 203.0.113.10' -d "$BODY_T"; echo
#   → {"data":{"id":"<id1>","formKey":"contact","status":"HANDLED","isTest":true,"replayed":false,"captchaDegraded":false,"error":null}}
curl -s -X POST $F -H "Authorization: Bearer $T1" -H 'Content-Type: application/json' -H 'X-Website-Visitor-Ip: 203.0.113.10' -d "$BODY_T"; echo
#   → the SAME id, "replayed":true (P8: same formKey + isTest + locale + fields inside the hour)
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select \\\"formKey\\\", status, \\\"isTest\\\", \\\"tokenClass\\\", \\\"captchaPassed\\\", \\\"captchaDegraded\\\", \\\"createdEntityType\\\", \\\"createdEntityId\\\" from website_form_submissions order by \\\"createdAt\\\" desc limit 3\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select count(*) from inquiries where \\\"createdAt\\\" > now() - interval '5 minutes'\""    # 0
ssh jobsadmire_portal "docker logs jobsadmire_ops_backend --since 5m 2>&1 | grep -ciE 'autoresponder|website.*queueEmail'"   # 0 — a dry run mails nobody
```

Expected: one row `contact | HANDLED | t | TEST | t | f | (null) | (null)`, no inquiry, no mail. Paste under H1.

2. The live send (H2) — ONE real contact form per language with the WRITE token, to the owner's own mailbox (`<owner mailbox>` typed by hand, not stored here):

```bash
curl -s -X POST $F -H "Authorization: Bearer $W2" -H 'Content-Type: application/json' -H 'X-Website-Visitor-Ip: 203.0.113.11' \
  -d '{"locale":"en","consentVersion":"privacy-2026-09","captchaToken":"XXXX.DUMMY.TOKEN.XXXX","fields":{"name":"WP3a Gate EN","email":"<owner mailbox>","phone":"+905538676431","message":"WP3a live autoresponder proof - close this inquiry"}}'; echo
curl -s -X POST $F -H "Authorization: Bearer $W2" -H 'Content-Type: application/json' -H 'X-Website-Visitor-Ip: 203.0.113.12' \
  -d '{"locale":"tr","consentVersion":"privacy-2026-09","captchaToken":"XXXX.DUMMY.TOKEN.XXXX","fields":{"name":"WP3a Gate TR","email":"<owner mailbox>","phone":"+905538676431","message":"WP3a canlı otomatik yanıt kanıtı - bu talebi kapatın"}}'; echo
ssh jobsadmire_portal "docker logs jobsadmire_ops_backend --since 5m 2>&1 | grep -iE 'autoresponder|WEBSITE_FORM_RECEIVED|website' | tail -20"
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select s.\\\"formKey\\\", s.status, s.\\\"isTest\\\", s.\\\"tokenClass\\\", s.\\\"createdEntityType\\\", i.\\\"inquiryNumber\\\", i.\\\"contactName\\\", i.source from website_form_submissions s left join inquiries i on i.id = s.\\\"createdEntityId\\\" where s.\\\"isTest\\\" = false order by s.\\\"createdAt\\\" desc limit 2\""
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select type, title, \\\"createdAt\\\" from notifications where type = 'WEBSITE_FORM_RECEIVED' order by \\\"createdAt\\\" desc limit 4\""
```

Expected: two 200s with distinct ids, `status: "HANDLED"`, `isTest: false`, `replayed: false`, `error: null`; two rows `contact | HANDLED | f | WRITE | inquiry | INQ-2026-… | WP3a Gate EN/TR | WEBSITE_FORM`; the owner's mailbox receives the EN then the TR autoresponder (paste the two `Message-ID` headers); `WEBSITE_FORM_RECEIVED` rows for every `website.forms` viewer (the notification query shows ≥ 2 rows titled `New website contact message from WP3a Gate …` (Task 10's registry renders `New website ${label.toLowerCase()} from …` with `WEBSITE_FORM_LABELS.contact = 'Contact message'`)); the second human's mailbox has the two copies (ask them to confirm; paste their reply time). In the UI: `/en/admin/website/inbox` shows both rows `HANDLED` with the inquiry link; `/en/admin/website/inbox?row=<id>` opens the SidePanel with payload + handler result; the `ExportCsvButton` downloads a CSV containing both ids (`GET /api/website/forms/submissions/export`, `website.forms` EXPORT). Open each inquiry in `/en/admin/sales/inquiries/<id>`, confirm `contactName` renders in the header (Task 5), set it CLOSED with the note "WP3a gate proof". Paste under H2.

3. Restore the REAL Turnstile secret on the screen, Save, **Test** → ok. Then the fail-closed proof (H3):

```bash
curl -s -o /dev/null -w 'dummy-token-under-real-secret %{http_code}\n' -X POST $F -H "Authorization: Bearer $W2" -H 'Content-Type: application/json' -H 'X-Website-Visitor-Ip: 203.0.113.13' \
  -d '{"locale":"en","consentVersion":"privacy-2026-09","captchaToken":"XXXX.DUMMY.TOKEN.XXXX","fields":{"name":"WP3a 403 probe","email":"probe@example.invalid","message":"must be refused"}}'   # 403
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select count(*) from website_form_submissions where \\\"createdAt\\\" > now() - interval '2 minutes'\""   # 0 — a failed captcha writes no row
```

4. Degrade drill (H4; D11/D25 — the alarm must be seen to ring). On the screen clear the Turnstile secret (the `hasTurnstileSecret` chip goes off), Save. The alarm is raised by the captcha step, which runs for every token class (P2 dry-runs only the handler), and it is once-per-form-per-hour (`website:alarm:captchaDegraded:contact`, TTL 3600) — run the drill ONCE:

```bash
curl -s -H "Authorization: Bearer $T1" $P; echo     # "captcha":"missing"
curl -s -X POST $F -H "Authorization: Bearer $T1" -H 'Content-Type: application/json' -H 'X-Website-Visitor-Ip: 203.0.113.14' \
  -d '{"locale":"en","consentVersion":"privacy-2026-09","captchaToken":"XXXX.DUMMY.TOKEN.XXXX","fields":{"name":"WP3a degrade drill","email":"drill@example.invalid","message":"captchaDegraded drill"}}'; echo
#   → 200 {"data":{…,"status":"HANDLED","isTest":true,"replayed":false,"captchaDegraded":true,"error":null}}
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select \\\"captchaPassed\\\", \\\"captchaDegraded\\\", \\\"isTest\\\" from website_form_submissions order by \\\"createdAt\\\" desc limit 1\""    # (null) | t | t
sleep 60; ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -c \"select type, title, channel, status, \\\"createdAt\\\" from notifications where type = 'WEBSITE_FORMS_UNAVAILABLE' order by \\\"createdAt\\\" desc limit 4\""
```

Expected: `captcha: "missing"`; the 200 with `captchaDegraded: true`; the row `(null) | t | t`; `WEBSITE_FORMS_UNAVAILABLE` rows (bell + email channels) for the super-admins, the email received in a super-admin mailbox AND in the second human's mailbox (subject names the reason `captchaDegraded` and the form `contact`). Then restore the real secret, Save, **Test** → ok, and `curl -s -H "Authorization: Bearer $T1" $P` → `"captcha":"configured"`. Paste under H4.

5. `unset W1 W2 T1 COOKIE`.

**I. Record** — fill every artifact into the gate record (SHAs, the deploy.log excerpts from `/tmp/wp3a-deploy-*.log`, the health histograms, `StartedAt`/`RestartCount` lines, the conformance line, the ping JSONs, the psql outputs, the two `Message-ID`s, the alarm rows), tick every box, then Step 4 and Step 5.

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && grep -c '^- \[ \]' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md; grep -c '^- \[x\]' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md; grep -cE 'ws[wt]_[0-9a-f]{48}' docs/superpowers/plans/2026-09-19-wp3a-gate-record.md
curl -s -o /dev/null -w 'health %{http_code}\n' https://operations.jobsadmire.com/api/health; ssh jobsadmire_portal "docker inspect -f 'restarts={{.RestartCount}}' jobsadmire_ops_backend"
```

Expected: `0`, `33`, `0` (no unchecked item, all thirty-three ticked, no token value leaked into the record); `health 200`; `restarts=0`.

- [ ] **Step 5: Commit**

Append to `/Users/agentfaraz/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md`, after the line beginning `**WP3a docs (2026-09-19):**`:

```
**WP3a DEPLOYED <date> <time> PKT:** migration `20260925120000_website_intake_door` pushed alone as `<migration sha>` (cherry-picked onto main; drift gate unchanged vs baseline), code `<code sha>` after; both deploys health 200, RestartCount 0, conformance `0 undecorated`; VPS `.env` now carries `WEBSITE_MODULE_ENABLED=true` + `WEBSITE_SITE_URL=https://www.jobsadmire.com` (flip recipe in DEPLOYMENT.md); ping proven per token class (write / previous-write / test / 401) with `secondHumanConfigured: true`; test-class dry run + same-payload replay proven; EN+TR autoresponders received live, `WEBSITE_FORM_RECEIVED` in the bell + second human mailed, dummy captcha 403 under the real secret, captchaDegraded alarm rang (bell + email + second human) and the secret was restored; tokens W2 (write) + T1 (test) in the owner's vault — `OPS_WEBSITE_WRITE_TOKEN` to Vercel once `jobsadmire-web-v2` exists, T1 to the external monitor's synthetic-lead job; gate record `docs/superpowers/plans/2026-09-19-wp3a-gate-record.md`. Next lane: website WP2 (form wiring against the live door).
```

Then (after C.1 and C.2 once more — this docs push is the third ~60 s backend restart):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git add docs/superpowers/plans/2026-09-19-wp3a-gate-record.md && git commit -m "docs(website): WP3a gate record — migration pushed alone, code deploy, flag flipped, ping per token class, live autoresponders, captchaDegraded drill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git push origin HEAD:main
ssh jobsadmire_portal "timeout 900 tail -n0 -f /var/www/html/jobsadmire-operations/deploy.log" | grep -m1 -E 'Deploy finished for|ABORT'
curl -s -o /dev/null -w 'health %{http_code}\n' https://operations.jobsadmire.com/api/health; ssh jobsadmire_portal "docker inspect -f 'restarts={{.RestartCount}}' jobsadmire_ops_backend"
```

Expected: `Deploy finished for <docs sha>`, `health 200`, `restarts=0`. I1 is ticked BEFORE the commit (its artifacts — the memory line, the vault entries, the peer messages — exist by then; the `git status` gate in Step 4 needs the record complete); the docs commit's own deploy proof (`Deploy finished`, health, restarts) is appended to the memory line, not to the committed record. Then tell the peer sessions the lane is closed.

---

## Self-review (controller)

- **Spec coverage:** WP3a paragraph (spec §5) → Task 1 (module skeleton + descriptor + keys/hash/AppSubject/role defaults + conformance spec), Task 3 (WP3a Prisma subset in its own commit), Task 4 (`WebsiteApiGuard` write/test/previous classes, Integrations config + minimal screen backend, ping), Task 6 (degrading captcha service, forms core), Task 7 (INQUIRY/CALLBACK/VISIT/CALCULATOR_QUOTE + inbox routes incl. re-run/export), Task 8 (CAREERS_APPLY export edge + FRAUD_REPORT), Task 9 (NEWSLETTER double opt-in, inactive until counsel), Task 5 (`Inquiry.contactName` + DTO + list/detail), Task 10 (events `WEBSITE_FORM_RECEIVED`/`WEBSITE_FORMS_UNAVAILABLE` + seed rows + second-human recipient, autoresponders EN/TR, abuse trip, drought, purge), Task 2 (env/compose rows + flag guard), Task 11 (Integrations screen + Forms inbox), Task 12 (PRD §5.12 initial + §7.10 + DEPLOYMENT), Task 13 (gate: boot conformance 0, specs green, local production-compose boot, deploy verified by artifact with continuous health, ping per token class, live autoresponder, flag flipped after the gate).
- **Deviations from the spec's letter, each ruled:** one always-imported module with request-time gating (P1); test token = dry run (P2); one fraud-evidence upload route on the public door (RC3 amends P5); `WEBSITE_SITE_URL` in WP3a (RC11); rotate-with-previous-window now, live-proof rotation in WP3c (P7); role defaults `since: 3` (spec said 2 — the constant is already 2).
- **Placeholders:** three consistency passes (draft check → reconciliation → integration recheck) report none; the six residual spec/anchor mismatches from the last recheck were fixed by hand-verified edits.
- **Type consistency:** producer-wins rule applied across Produces/Consumes; the `@Module` block is printed cumulatively in Tasks 1, 2, 4, 6, 7, 8 (two halves), 9, 10 and each later block is a superset of the previous.
- **Boot safety:** the recheck's verdict — every commit compiles and boots; the migration commit is boot-neutral alone; the only non-compiling intermediate commit (Task 8's first) was removed by splitting the module edit.

## Execution notes

- Execute with `superpowers:subagent-driven-development` from the worktree `jobsadmire-operations-website` (branch `website/wp3a-intake`), one task at a time, `jest --maxWorkers=2`, one docker stack up at a time.
- Fable reviews Tasks 3, 4, 6, 7, 10, 13 (money/privacy/production paths) and the final whole-branch review; Opus implements Tasks 1, 4, 6, 7, 8, 9, 10, 13; Sonnet implements Tasks 2, 3, 5, 11, 12 and reviews the small diffs.
- Pushes to `main` follow Task 13's sequence only (migration alone → verified → code); announce to peer sessions first.
