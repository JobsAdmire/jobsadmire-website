# Task 12 report — Docs in the same change set (P13)

Branch `website/wp3a-intake`, worktree `jobsadmire-operations-website`, started at head `525c9c3`. Two commits: `1ddca58` (the full docs change set) and `9f21487` (a self-review correction). Working tree clean after both.

## Per-doc summary

### `apps/backend/src/modules/website/website-docs-guard.spec.ts` (new)
Written verbatim from the brief's Step 1 code block (202 lines). No deviation.

### `.gitignore`
Two lines (`docker-volumes/`, `.env.local-prod`) inserted directly after `apps/backend/.env`, exactly as specified in 3b.

### `CLAUDE.md` (repo root)
Six edits, all anchors matched verbatim on the first read (no drift from Tasks 1–11):
1. `Modules:` sentence — inserted "Website (the jobsadmire.com intake door…)" between "Call Center" and "; supporting infrastructure".
2. Doc-map row starting `| Public website (jobsadmire.com) + the future \`website\` CMS module` — replaced whole row. Note: this row already referenced "PRD §5.12 + §7.10 (added with the module)" *before* this task ran (pre-seeded by whoever wrote the doc-map originally, anticipating the sections Task 12 would add) — harmless, the anchor prefix still matched and the row was replaced as instructed.
3. "the only public surface is `/careers/*` + auth" → names the token-guarded machine doors + the website door + PRD §7.10.
4. Module-dependency numbered rule — appended the `CareersPublicModule` → `WebsiteModule` one-way export-edge sentence after "Don't create cycles."
5. "No public endpoints outside `careers-public`" bullet — replaced with the full sanctioned-surfaces bullet naming `website/v1` + PRD §7.10.
6. RC16 — appended the "module keyed from birth registers `resourcesEnforced: true` immediately" sentence to the "A permission KEY is…" bullet, after the existing text, without touching the two count lines (Task 1's, pinned).

### `docs/PRD.md`
Thirteen edits in file order (3d.1–3d.13):
- TOC: added `5.12` and `7.10` lines.
- §3 gotcha bullet replaced (names website/v1 + §7.10).
- §4.8 "Boot-time conformance" paragraph — appended the WP3a routes sentence after "…a FLOOR as well as a ceiling."
- §5.1 opening sentence replaced ("no public ingestion endpoint" → "Public ingestion arrives through ONE door…").
- §5.1 conversion sentence — inserted the `contactName → Lead.contactPerson` clause.
- §5.1 gotchas — inserted two new bullets after the `CommunicationsLog` bullet (website-inquiries-only-through-InquiryService.create; contactName search/scope note).
- §5.4.3 — replaced ONLY the closing sentence of the `##### The public careers site` paragraph (PRD :1341-area); left the `- **Don't add public endpoints outside \`careers-public\`**` gotcha bullet (:1396-area, no "unauthenticated") untouched as instructed — verified by grep that it still reads unmodified.
- §5.12 inserted whole, verbatim from the brief's Step 3c.8 block, between the `---` and `## 6. Supporting Infrastructure`.
- §6.2 — four edits: mailbox-per-event sentence, Website events line before "Re-derive the authoritative list…", the "marketing (14 events) and website (2 events, §5.12) declare them" replacement, and the dispatcher gotcha bullet rewrite.
- §6.5 — two edits: the sanctioned-exceptions parenthetical (adds Indeed, webhooks, website/§7.10) and the "Don't add public unauthenticated endpoints…" gotcha bullet full replacement.
- §7.10 inserted whole, verbatim from the brief's Step 3d.11 block, between `---` and `## 8. Data Model Overview`.
- §10 bullet replaced (adds webhooks + website door to the concentrated-public-traffic list).
- §12.2 — inserted the "2026-09-19 — Website module, WP3a (intake door)." bullet after the HRM-dashboard line.

**One correction made during self-review** (see below): the `WEBSITE_FORM_RECEIVED` recipients sentence in §5.12's Notifications paragraph, inserted verbatim from the brief, described an either/or fallback chain ("the assigned agent, else holders of `website.forms:VIEW`, else super-admins") that does not match `event-registry.ts`. Fixed in commit `9f21487` — see "Code/doc mismatches" below.

### `docs/DEPLOYMENT.md`
Three insertions, one explicit non-edit:
1. "Website crons" bullet inserted directly after the `careers-retention` bullet.
2. The env-variable table was NOT touched — Task 2's `| Flags | \`WEBSITE_MODULE_ENABLED\`` row and Task 9's `| Website | \`WEBSITE_SITE_URL\`` row were already present and correct; confirmed by grep before editing.
3. The full D24 "Booting the production compose file locally" section inserted verbatim from the brief, between Task 2's "Flipping `WEBSITE_MODULE_ENABLED` on the VPS" section and "### Verifying a deploy landed".
4. Runbook row "Website intake door (jobsadmire.com forms)" inserted directly after the "Cloudflare Turnstile" row.

### Memory
One line appended to `/Users/agentfaraz/.claude/projects/-Users-agentfaraz-projects-admiregroup-jobsadmire/memory/website-programme-2026-09.md` under the last existing entry, verbatim from the brief's 3f block.

## Anchors that differed

None required a guessed resolution. Every quoted anchor in the brief was found verbatim in the current file state via `grep` before editing (CLAUDE.md's six, PRD's thirteen, DEPLOYMENT.md's three). The only surprise was the doc-map row in CLAUDE.md already containing forward references to PRD §5.12/§7.10 before this task wrote those sections (see above) — not a mismatch, just pre-existing prose anticipating this task's output; replaced per instructions regardless.

## Code/doc mismatches found and resolved in favour of the code

1. **`WEBSITE_FORM_RECEIVED` recipients (PRD §5.12, Notifications paragraph).** The brief's prose (copied from the plan, written pre-execution) said recipients are "the assigned agent, else holders of `website.forms:VIEW`, else super-admins" — an either/or priority chain. Reading `apps/backend/src/modules/notifications/event-registry.ts:2360-2364`, the actual `recipients` function is:
   ```ts
   recipients: async (ctx, helpers) => {
     const viewers = await helpers.getModuleViewers(WEBSITE_MODULE, { descendants: ['website.forms'] });
     const assignee = asString(ctx.assignedAgentId);
     return assignee ? [assignee, ...viewers] : viewers;
   },
   ```
   `getModuleViewers` (event-dispatcher.ts:165-179) resolves `website.forms:VIEW` holders **plus super-admins by slug** (the CASL-bypass arm) in one query — not as a fallback, always. The assignee is *prepended*, additively, when present. The registry's own `recipientsDescription` field confirms this reading verbatim: `"Everyone who can view the website forms inbox, the assigned salesperson when the form became an inquiry, plus super-admins."` Also confirmed `channels: ['IN_APP']` on the definition and `{ inApp: true, email: false }` in `module-notification-seed.ts` — "bell only by seed" is accurate and now stated. Fixed in commit `9f21487`.

No other mismatches survived verification — every other fact in the "Facts the PRD must carry" list (public routes, token classes, captcha semantics, dedupe/replay, handler table, alarm thresholds, permission descriptor, migration name, evidence read-back routes, inbox search case rule, etc.) was checked against the actual source files listed in the brief's Context section (`website-public.controller.ts`, `website-public-uploads.controller.ts`, `website-public-newsletter.controller.ts`, `website-forms-inbox.controller.ts`, `website-forms-evidence.controller.ts`, `website-integrations.controller.ts`, `website-forms.service.ts`, `website-ping.service.ts`, `website-alarms.logic.ts`, `website-abuse.service.ts`, `website-notify.service.ts`, `website-autoresponder.service.ts`, `website.module.ts`, `packages/constants/src/enums/website.enums.ts`, `apps/backend/prisma/migrations/`) and matched the brief's prose exactly, so it was inserted as given.

## RED / GREEN

- **RED (Step 2):** `npx jest src/modules/website/website-docs-guard.spec.ts --maxWorkers=2` → `Tests: 10 failed, 5 passed, 15 total` — matches the brief's predicted failure set exactly (all 10 named cells failed; the 5 pins on Tasks 1/3 output already passed).
- **GREEN (Step 4):** after all doc edits, `website-docs-guard.spec.ts` → 15/15 passed. Re-ran after the self-review correction — still 15/15 (the fixed sentence isn't itself pinned by the guard, only its surrounding facts are).

## Other specs run

- `website-env.spec.ts` (Task 2) — 4/4 passed, untouched by this task's DEPLOYMENT.md additions (only appended sections, never rewrote the flag row/flip recipe it reads).
- `website-schema.spec.ts` (Task 3) — passed (this task never touched `packages/constants` or `prisma/`).
- `website-site-url.spec.ts` (Task 9) — 9/9 passed (DEPLOYMENT.md's `WEBSITE_SITE_URL` row was pinned, not rewritten).
- Combined run: `Test Suites: 4 passed, 4 total; Tests: 42 passed, 42 total`.
- `npm run type-check --workspace=apps/backend` — clean.
- `npx eslint apps/backend/src/modules/website/website-docs-guard.spec.ts` — no output, clean.
- `git diff --stat` — touches exactly `.gitignore`, `CLAUDE.md`, `docs/DEPLOYMENT.md`, `docs/PRD.md` + the new spec file; `git diff -- packages/ apps/backend/prisma/ | wc -l` → `0`, as expected.
- **Prettier:** checked for a repo convention before running `prettier --check` on the touched Markdown. Found no `.prettierignore`, no `format` script in `package.json`, and no `lint-staged`/CI hook targeting Markdown — `.prettierrc` exists but nothing wires it to `.md` files. Concluded the repo does not format docs with Prettier as a matter of convention and skipped the check, per the brief's own conditional ("only if the repo formats docs — check `.prettierignore`").

## Self-review

Re-read §5.12 and §7.10 as a newcomer, checking every concrete claim against the real files:
- Public route list, controller class names/paths, guard order, `@Public()` placement — matched `website-public.controller.ts`, `website-public-uploads.controller.ts`, `newsletter/website-public-newsletter.controller.ts` exactly, including the `Cache-Control: private, no-store` header (X6) present on every route.
- `WebsitePingResult` shape and `secondHumanConfigured`/`trippedForms`/`bucketPolicy`/`lastCrmFeedAt` fields — matched `website-ping.service.ts` exactly.
- Alarm thresholds (`WEBSITE_ABUSE_TRIP_THRESHOLD = 25`, `WEBSITE_ABUSE_WINDOW_SEC = 3600`, `WEBSITE_DROUGHT_HOURS = 48`, business hours Europe/Istanbul Mon–Fri 09:00–18:00) — matched `website-alarms.logic.ts` exactly.
- Permission descriptor (ten keys, actions per key, `resourcesEnforced: true`, scope ALL) — matched `website.module.ts`'s `registry.register(...)` call exactly.
- Four enum mirrors and the ten form keys / kind map — matched `packages/constants/src/enums/website.enums.ts` exactly (also pinned live by the guard spec and `website-schema.spec.ts`).
- Evidence read-back routes (`GET …/evidence/:index/view|link`) and inbox family routes (list/get/rerun/export) — matched `website-forms-evidence.controller.ts` and `website-forms-inbox.controller.ts` exactly, including the `website.forms` VIEW/EDIT/EXPORT gating.
- Integrations controller routes (`GET`, `PATCH`, `PATCH keys`, `POST rotate/:name`, `POST test`) — matched `website-integrations.controller.ts` exactly.
- `WebsiteAbuseService` method names (`isTripped`, `trippedForms`, `recordVerified`) and Redis key shapes — matched `website-abuse.service.ts` exactly.
- Found and fixed the one mismatch (recipients wording) documented above.
- `§7.10`'s hardening table, "why here not careers-public" argument, and the "what it must never become" closing paragraph read consistently with the guard chain and module wiring in `website.module.ts` and `careers-public.module.ts`'s one-way export.

No further mismatches found on this pass.

## Concerns

- None blocking. The one correction (recipients wording) was found and fixed before commit; both commits are green and the tree is clean.
- Two commits exist instead of one because the correction was found during the mandated self-review step, after the first commit. Neither commit is pushed; Task 13 can squash-read or leave as-is — nothing in the brief requires a single commit.
- Not run: `test/permissions/website-conformance.spec.ts` / `website-door-conformance.spec.ts` (referenced in §5.12's prose as scanning the door) — out of scope for this docs task per the brief's Step 4 (only docs-guard + Task 2/3/9's specs were specified), and this task changed no source files those specs would react to.

## Fix round 1 (coordinator review, 2026-09-20)

Commit `d30984b`. All six coordinator IMPORTANT findings plus the MINOR fold list addressed. Every claim re-verified against the actual code before editing (per file:line below), per the coordinator's instruction that the code is the source of truth.

1. **`docs/DEPLOYMENT.md` step 4 + push rule (drift gate).** Verified against `scripts/deploy-vps.sh:198-217` (the `[5b]` warn-only gate, `DRIFT_IS_FATAL=0`) and confirmed the `LanguagePreference` enum is created by five old migrations (`grep -rl LanguagePreference apps/backend/prisma/migrations/`) but declared nowhere in current `schema.prisma` — an orphan that reproduces on any freshly-migrated database, not only production. Rewrote the `# 4.` comment block and the `drift exit=$?` line to state exit 2 is expected, capture output to `/tmp/website-local-prod-drift.txt`, and added a `grep -iE 'website_|contactName|WEBSITE_'` check as the actual gate. Rewrote the "How to read the result" closing paragraph to match (gate = no website lines, not exit 0).
2. **`docs/PRD.md` §5.12 newsletter tokens.** Verified against `apps/backend/src/modules/website/newsletter/newsletter-token.ts`: `newConfirmToken()` = `randomBytes(24).toString('base64url')`, `hashToken()` = sha256, `NEWSLETTER_CONFIRM_TTL_MS = 48h`; `signUnsubscribeToken`/`verifyUnsubscribeToken` = stateless HMAC keyed via `unsubscribeKey(secret)` = `sha256('website-newsletter-unsubscribe:' + ENCRYPTION_KEY)`. Fixed the route-table confirm row (was wrongly labelled "stateless HMAC") and the `newsletter` row of the handler table to describe CONFIRM (random+hash+48h) and UNSUBSCRIBE (HMAC/ENCRYPTION_KEY) separately; the already-correct Data paragraph (confirm-token HASH, unsubscribe HMAC) was left untouched.
3. **Fraud-evidence upload, one file per call.** Verified against `website-public-uploads.controller.ts` (`FileInterceptor('file', { limits: { fileSize: MAX_FRAUD_EVIDENCE_BYTES, files: 1, fields: 0 } })`) and `fraud-evidence-file.ts` (`MAX_FRAUD_EVIDENCE_BYTES = 8 * 1024 * 1024`, `MAX_FRAUD_EVIDENCE_FILES = 3` used only by the catalog's `evidenceKeys` cap) and `website-fraud-evidence.service.ts:63-67` (`store()` returns `{ data: { key, mimeType, sizeBytes, dryRun } }`). Fixed the route-table row (was "≤ 3 files") and the §7.10 body-size row to say ONE file, ≤ 8 MB, `data.key`, with the 3-per-report cap attributed correctly to the catalog.
4. **Drought X14 + DEPLOYMENT ~:47.** Verified `isLeadDrought` in `website-alarms.logic.ts:114-117` (`if (!lastSubmissionAt) return false`) against the stale comment in `website-alarms.cron.ts:26-29` ("'Never' counts as silence... is exactly the failure D11 names") — the code and the comment directly contradicted each other. Fixed the comment (comment-only code edit, confirmed by rerunning `website-alarms.cron.spec.ts` unchanged/green) and rewrote both the PRD §5.12 Alarms paragraph and DEPLOYMENT's Website-crons bullet to state no alarm before the first real submission ever arrives, plus the "quiet Friday alarms Monday" business-hours nuance.
5. **Test-token exception for newsletter.** Verified `website-public-newsletter.controller.ts`'s three handlers never inject `@TokenClass()` (unlike `website-public.controller.ts`'s `submitForm`), so `WebsiteNewsletterService.confirm()`/`unsubscribe()` never see the token class — `WebsiteApiGuard` authenticates the caller but the business logic runs for real regardless of write/test/previous-write. Added the exception to both the "Test class" paragraph and the "test token never reaches a side effect" gotcha bullet in §5.12.
6. **Captcha X7.** Verified `website-captcha.service.ts`'s `SECRET_CODES`/`SERVICE_CODES` sets and the `verify()` branching (`invalid-input-secret`/`missing-input-secret` → `degraded: secretInvalid`; `internal-error`/`bad-request` → `degraded: httpError`; only unmatched/visitor codes → `failed`) and `website-alarms.logic.ts:82-96`'s `SITE_WIDE_REASONS = new Set(['captchaDegraded'])` (X13). Added the classification detail to the Captcha paragraph and a new D11-adjacent gotcha bullet.

**MINOR fold-ins**, each verified against source before writing: intake order (`website-forms.service.ts:187-200` — trip check precedes field whitelist, not after) fixed in the route table; Token column now lists `write, test or previous-write` everywhere (`website-api.guard.ts`'s class-level, route-agnostic guard); abuse counter description now states real/non-replayed/captcha-verified only (`website-forms.service.ts`'s `else if (!isTest)` block, reached only on `passed` outcome and never on a `replayed` early return); X5 singleton+P2002 (`website-integration-config.service.ts:61-108`) added to the Token classes paragraph; X9 in-flight re-run guard (`website-forms.service.ts:168,292-293`) and X10 500-char/class+code error hygiene (`errorLabel()`) added to the Idempotency paragraph; X11 careers `trackingToken`/`statusUrl` (`careers-apply.handler.ts:45,103`) added to the handler table's careers row; X12 15-min cooldown (`NEWSLETTER_RESEND_COOLDOWN_MS`) folded into the newsletter handler-table row; evidence-404 (`website-fraud-evidence.service.ts:87-100`) added to the fraud handler-table row; EXPORT-same-JSON + `entityId: 'unknown'` (`audit.interceptor.ts:93`) and `needsAttention` accepts only `'true'` (`query-website-submissions.dto.ts:48`, `website-forms-inbox.logic.ts:130`) added to the Screens paragraph; the purge cron's separate 7-day orphan sweep (`website-purge.cron.ts`'s `sweepOrphans`, `WEBSITE_FRAUD_ORPHAN_AGE_MS`) added to both the PRD Alarms paragraph and the DEPLOYMENT crons bullet; WP2/external-monitor behaviour reworded as contract ("WP2 must retry on any non-2xx", "the external monitor will post a synthetic lead every 30 min") in the Idempotency and Test-class paragraphs and the closing "Every deploy is a 30-60s 502" gotcha; a new docs-guard spec cell pins §7.10's actual sanction sentence ("This section is the argument that makes that legal under the rule stated in §3, §6.5, §10 and `CLAUDE.md`...") in addition to the existing heading-only pin.

**Tests:** `website-docs-guard.spec.ts` (16/16, +1 new cell), `website-env.spec.ts`, `website-schema.spec.ts`, `website-site-url.spec.ts`, `website-alarms.cron.spec.ts`, `website-alarms.logic.spec.ts` — combined `Test Suites: 6 passed, 6 total; Tests: 64 passed, 64 total`. `npm run type-check --workspace=apps/backend` clean. Diff scope: `apps/backend/src/modules/website/website-alarms.cron.ts` (comment only), `apps/backend/src/modules/website/website-docs-guard.spec.ts`, `docs/DEPLOYMENT.md`, `docs/PRD.md` — exactly the four files the coordinator's instruction implied, nothing else touched.

**Concerns:** none new. Three commits now exist on the branch for this task (the original two plus this fix), none pushed.
