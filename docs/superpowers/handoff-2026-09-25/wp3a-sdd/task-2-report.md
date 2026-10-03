# Task 2 report — `WEBSITE_MODULE_ENABLED` env + flag

## What was implemented

Per the brief, verbatim:

1. **`apps/backend/src/modules/website/website-module-flag.ts`** (new) — `WEBSITE_MODULE_ENABLED_ENV` constant + `websiteModuleEnabled(config: ConfigService): boolean`, the ONE production reader of the variable name.
2. **`apps/backend/src/modules/website/guards/website-module-enabled.guard.ts`** (new) — `WebsiteModuleEnabledGuard implements CanActivate`, throws bare `NotFoundException()` unless `websiteModuleEnabled(this.config)` is true. Reads per request via injected `ConfigService`.
3. **`apps/backend/src/modules/website/guards/website-module-enabled.guard.spec.ts`** (new) — 5 test cells covering `websiteModuleEnabled()` (literal-true-only, per-call read) and `WebsiteModuleEnabledGuard` (passes on true, 404s with generic body on false/undefined/empty, consults env per request not per construction).
4. **`apps/backend/src/modules/website/website-env.spec.ts`** (new) — 4 test cells: compose defaults (dev `true`/VPS `false`), both env examples document the key (production says `false` explicitly), exactly one production `.ts` file names the variable, DEPLOYMENT.md carries the row + heading + command.
5. **`website-status.controller.ts`** (modified) — swapped the inline `this.config.get<string>('WEBSITE_MODULE_ENABLED') === 'true'` for `websiteModuleEnabled(this.config)`; `status()` now has explicit return type `{ data: { enabled: boolean } }` (Task 1 review fold-in); doc comment's last sentence updated to describe the shared helper.
6. **`website.module.ts`** (modified) — added import `WebsiteModuleEnabledGuard` from `./guards/website-module-enabled.guard` directly after the `WebsiteStatusController` import; `providers: [],` → `providers: [WebsiteModuleEnabledGuard],`. Nothing else touched (verified via `git show` diff — 2-line diff only).
7. **`docker-compose.vps.yml`** — inserted `WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-false}` + comment block directly after `PERMISSIONS_STRICT: ${PERMISSIONS_STRICT:-true}`, before `depends_on:`.
8. **`docker-compose.yml`** — inserted `WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-true}` + comment block directly after `PERMISSIONS_STRICT: 'true'`, before `ports:`.
9. **`.env.example`** — inserted the website module block (`WEBSITE_MODULE_ENABLED=`) after `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` + its blank line, before `# --- Permission scope enforcement ---`.
10. **`.env.production.example`** — inserted the website module block (`WEBSITE_MODULE_ENABLED=false`) after `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` + its blank line, before `# ─── Permission scope enforcement`.
11. **`docs/DEPLOYMENT.md`** — (a) one `| Flags | \`WEBSITE_MODULE_ENABLED\` ... |` row directly after the `PERMISSIONS_STRICT` row, before the `Frontend` row; (b) the `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` section inserted directly before `### Verifying a deploy landed` (after the "Rehearsing the scripts without a VPS" paragraph).

All anchors were verified verbatim by grep before editing; every one matched the brief's quoted text exactly — no re-anchoring was needed.

## RED (Step 2)

```
cd apps/backend && npx jest src/modules/website --maxWorkers=2
```

Result: as predicted.
- `guards/website-module-enabled.guard.spec.ts` — suite failed to compile: `Cannot find module './website-module-enabled.guard'` and `'../website-module-flag'` (TS2307).
- `website-env.spec.ts` — 4/4 cells failed (compose strings absent; `.env.example` had no `WEBSITE_MODULE_ENABLED=` line; `readers` equalled `['modules/website/website-status.controller.ts']`; DEPLOYMENT row/heading absent).
- `website-status.controller.spec.ts` — PASSED (2 cells), unchanged, as expected.

Totals: `Test Suites: 2 failed, 1 passed, 3 total` / `Tests: 4 failed, 2 passed, 6 total`.

## GREEN (Step 4)

```
cd apps/backend && npx jest src/modules/website test/permissions/website-conformance.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2
```

```
PASS src/modules/website/website-env.spec.ts (5.232 s)
PASS test/permissions/repo-invariants.spec.ts
PASS src/modules/website/website-status.controller.spec.ts
PASS src/modules/website/guards/website-module-enabled.guard.spec.ts
PASS test/permissions/website-conformance.spec.ts (12.327 s)

Test Suites: 5 passed, 5 total
Tests:       34 passed, 34 total
```

The "exactly ONE production file names the variable" cell resolved to `['modules/website/website-module-flag.ts']` only.

## Compose config check

```
cd .. && docker compose -f docker-compose.vps.yml config 2>/dev/null | grep -n 'WEBSITE_MODULE_ENABLED'
docker compose config 2>/dev/null | grep -n 'WEBSITE_MODULE_ENABLED'
```

The dev compose (`docker-compose.yml`) rendered `WEBSITE_MODULE_ENABLED: "true"` directly (no `.env` required — all its other vars carry compose-level defaults). The VPS compose (`docker-compose.vps.yml`) failed to render at all in this worktree because there is no root `.env` file and several unrelated variables are declared *required* with no default (`ENCRYPTION_KEY`, `IP_HASH_SALT`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `OTP_SALT`, `MINIO_SECRET_KEY`, `POSTGRES_PASSWORD`, `REDIS_PASSWORD`) — a pre-existing repo requirement unrelated to this task, not something WP3a Task 2 introduced. Re-ran with those eight stubbed inline (`VAR=x ... docker compose -f docker-compose.vps.yml config`) to isolate the check: `WEBSITE_MODULE_ENABLED: "false"` — matches the brief.

## Typecheck / eslint

```
npm run type-check --workspace=apps/backend   # clean, no output beyond the tsc invocation
npx eslint apps/backend/src/modules/website   # clean, no output
```

## Files changed

- `apps/backend/src/modules/website/website-module-flag.ts` (new)
- `apps/backend/src/modules/website/guards/website-module-enabled.guard.ts` (new)
- `apps/backend/src/modules/website/guards/website-module-enabled.guard.spec.ts` (new)
- `apps/backend/src/modules/website/website-env.spec.ts` (new)
- `apps/backend/src/modules/website/website-status.controller.ts` (modified)
- `apps/backend/src/modules/website/website.module.ts` (modified)
- `docker-compose.vps.yml` (modified)
- `docker-compose.yml` (modified)
- `.env.example` (modified)
- `.env.production.example` (modified)
- `docs/DEPLOYMENT.md` (modified)

Commit: `b3c3f3b` — "feat(website): WEBSITE_MODULE_ENABLED kill switch — compose rows, request-time 404 guard, per-tick helper"

## Self-review

**Completeness** — both compose files carry the mapping with correct per-file defaults; both env examples document the key (production states `false` explicitly, dev leaves it blank per the brief); the guard and helper exist at the exact paths RC1 names; the controller swap is in place with the explicit return type from the Task 1 review fold-in; both new specs exist and pass; DEPLOYMENT.md carries both the exact `| Flags | \`WEBSITE_MODULE_ENABLED\`` row text and the exact `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` heading, plus the `docker compose -f docker-compose.vps.yml up -d backend` command — all three strings are literally what `website-env.spec.ts` (Task 12's docs guard precedent) asserts.

**Quality** — `website.module.ts`'s diff is exactly the two lines the brief specifies (import + providers array), confirmed via `git show`. The guard and helper doc comments are the brief's text verbatim; no additional commentary invented. Guard uses `_context: ExecutionContext` (unused-arg convention, satisfies `argsIgnorePattern: '^_'`, confirmed clean by eslint).

**Discipline** — no files touched beyond the 11 the brief lists (`git status --short` before staging showed exactly those 10 paths, one of which is a new directory holding 2 files). Did not touch Task 1's `website-status.controller.spec.ts`, `website-conformance.spec.ts`, or `repo-invariants.spec.ts` — all three still pass unchanged. Did not run docker, a Next build, or the full suite, per instructions. Never used bare `git stash`; no stash was needed.

**Testing** — RED run matched the brief's predicted failure shape exactly (compile error on the guard spec, 4/4 failing cells on the env spec, Task 1 spec still green). GREEN run is pristine: 5 suites / 34 tests, zero failures, zero warnings. Typecheck and eslint both silent-clean.

## Concerns

None. One note for the record: `docker compose -f docker-compose.vps.yml config` cannot render standalone in this worktree without a root `.env` (or inline stubs) because of pre-existing required variables unconnected to this task — this is expected per the brief's own caveat ("if `.env` at the repo root sets the variable, that value shows instead") and does not affect the interpolated default, which was verified correct (`false`) once the unrelated required vars were stubbed.
