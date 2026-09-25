# Task 4 report — WebsiteIntegrationConfigService, WebsiteApiGuard, public door skeleton (`GET /website/v1/ping`), admin Integrations controller

**Status:** DONE
**Commit:** `6efdbe0` — `feat(website): integrations config with rotating tokens, the Bearer guard and the door's ping` (branch `website/wp3a-intake`, worktree `jobsadmire-operations-website`, not pushed)

## What was implemented

Every file in the brief, in the brief's final form, plus controller ruling X5:

| File | Role |
|---|---|
| `apps/backend/src/modules/website/website.constants.ts` | `WebsiteBearerClass` / `WEBSITE_BEARER_CLASSES`, `PRISMA_TOKEN_CLASS_BY_BEARER` (RC2), `WEBSITE_TOKEN_MIN_LENGTH = 20`, `PREVIOUS_WRITE_TOKEN_WINDOW_MS`, `WEBSITE_ROTATABLE_SECRETS` + guard. No form keys, no trip-key prefix (RC1/RC6). |
| `apps/backend/src/modules/website/dto/website-integrations.dto.ts` | `UpdateWebsiteIntegrationSettingsDto` (nullable `secondHumanEmail`/`secondHumanName`, `ValidateIf` lets `''` through to clear), `UpdateWebsiteIntegrationKeysDto` (`turnstileSecret?`, `revalidateSecret?`). |
| `apps/backend/src/modules/website/website-integration-config.service.ts` | Singleton service: `getOrCreate` (X5), `publicShape` (has* only, no `*Enc`), `resolveSecrets` (60 s cache, per-secret try/catch, WARN by name), `invalidateCache`, `updateSettings`, `updateKeys`, `rotateSecret` (wsw_/wst_ + 48 hex, 24 h previous-write window, 400 on unknown name), `testConnection` (Turnstile siteverify probe, never throws, persists `lastTested*`). Exports `WebsiteResolvedSecrets`, `WebsiteIntegrationPublicShape`, `WebsiteRotatedSecret`, `WebsiteConnectionTestResult`. |
| `apps/backend/src/modules/website/guards/website-api.guard.ts` | `WebsiteApiGuard` + `WebsiteRequest`: order write → test → previous-write, `timingSafeEqual` on equal lengths, < 20-char stored tokens unusable, fail-closed 401 `Website intake is not configured.` when nothing usable, 401 `Invalid website token.` otherwise, stamps `req.websiteTokenClass` verbatim. |
| `apps/backend/src/modules/website/decorators/token-class.decorator.ts` | `@TokenClass()` — throws 401 if the guard did not stamp; never defaults to `'write'`. |
| `apps/backend/src/modules/website/website-ping.service.ts` | `WebsitePingService.ping(tokenClass)` → RC13 shape; captcha readiness = decrypted secret; `lastSubmissionAt` from `isTest: false` rows only; `trippedForms: []` literal (Task 10 wires the abuse service). |
| `apps/backend/src/modules/website/website-public.controller.ts` | `@ApiTags @Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard) @Controller('website/v1')` with `GET ping`. |
| `apps/backend/src/modules/website/website-integrations.controller.ts` | `GET /website/integrations` (`website.integrations` VIEW), `PATCH` (`website.integrations` EDIT), `PATCH keys` / `POST rotate/:name` / `POST test` (`website` MANAGE_KEYS); `@AuditEntity('WebsiteIntegrationConfig')` on all four writes; `@ApiParam` enum spread from the `as const` tuple (RC31). |
| `apps/backend/src/modules/website/website.module.ts` | Five imports inserted after the `WebsiteModuleEnabledGuard` import; the two decorator lines replaced with the brief's block (controllers ×3, providers ×4, `exports: [WebsiteIntegrationConfigService]`). `imports:` line and `registry.register({...})` untouched. |
| `apps/backend/test/permissions/website-conformance.spec.ts` | Task 1's spec: two import lines added; `CONTROLLERS` now `[WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController]` with the RC15 comment. |
| `apps/backend/test/permissions/website-door-conformance.spec.ts` | New: real scanner over the two new controllers against the real descriptor; pins the key/action per method, `@AuditEntity` per write, class-level `@Public()` and the guard chain `[WebsiteModuleEnabledGuard, WebsiteApiGuard]` in that order. |
| Three `*.spec.ts` under `src/modules/website/` | Config service (13 cells incl. X5), guard (10), ping (3). |

Both anchors matched verbatim (`import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';`, `  controllers: [WebsiteStatusController],` / `  providers: [WebsiteModuleEnabledGuard],`, and in the spec `import { WebsiteStatusController } from ...` / `const CONTROLLERS = [WebsiteStatusController];`).

## The X5 change (singleton race)

`getOrCreate()` (the brief's name for the controller's `ensureRow()`) now does:

```ts
const existing = await this.prisma.websiteIntegrationConfig.findFirst();
if (existing) return existing;
try {
  return await this.prisma.websiteIntegrationConfig.create({ data: { id: SINGLETON_ID } });
} catch (e) {
  if ((e as { code?: string })?.code !== 'P2002') throw e;
  const winner = await this.prisma.websiteIntegrationConfig.findFirst();
  if (!winner) throw e;
  return winner;
}
```

with `const SINGLETON_ID = 'website-integration-config'` (file-local, documented). Reads keep `findFirst()`. P2002 is duck-typed on `code`, the repo's precedent (`employment-contract.service.ts`, `sales-training-certificate.service.ts`). One new spec cell: `findFirst` → null then row, `create` rejects `{ code: 'P2002' }` → resolves the winner, `create` called once with `{ data: { id: 'website-integration-config' } }`, `findFirst` called twice, no throw; the same cell also pins that a non-P2002 create failure still propagates. The brief's other call-count expectations (the 60 s cache cell: 1 → 2 → 4 → 5 → 5 `findFirst` calls) are unchanged because that cell's `findFirst` always returns a row, so `create` is never reached.

## One test-only addition beyond the brief

`website-integration-config.service.spec.ts` gained a `beforeEach` stubbing `Logger.prototype.log` and `Logger.prototype.warn` (the `wa-linked-facts.service.spec.ts` precedent) so the suite's output is pristine — without it the service's by-name log lines (`Website secret rotated: writeToken`, `Website integration keys updated (turnstileSecret)`, `Website Turnstile test failed: …`) print to stdout. The "undecryptable secret" cell spies the INSTANCE's `warn`, which shadows the prototype stub, so its `toHaveBeenCalledTimes(1)` and message assertions are unaffected. No production code changed for this.

## RED → GREEN

RED (`npx jest src/modules/website test/permissions/website-door-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2`, from `apps/backend`), before Step 3:

```
FAIL src/modules/website/guards/website-api.guard.spec.ts          TS2307 Cannot find module './website-api.guard' / '../website-integration-config.service'
FAIL src/modules/website/website-integration-config.service.spec.ts TS2307 Cannot find module './website-integration-config.service' / './website.constants'
FAIL src/modules/website/website-ping.service.spec.ts               TS2307 Cannot find module './website-ping.service'
FAIL test/permissions/website-door-conformance.spec.ts              TS2307 Cannot find module '.../website-integrations.controller' / '.../website-public.controller' / '.../guards/website-api.guard'
FAIL test/permissions/website-conformance.spec.ts                   TS2307 Cannot find module '.../website-integrations.controller' / '.../website-public.controller'
PASS src/modules/website/website-schema.spec.ts
PASS src/modules/website/website-env.spec.ts
PASS src/modules/website/guards/website-module-enabled.guard.spec.ts
PASS src/modules/website/website-status.controller.spec.ts
Test Suites: 5 failed, 4 passed, 9 total
Tests:       25 passed, 25 total
```

GREEN (same command, after Step 3):

```
PASS src/modules/website/website-status.controller.spec.ts         (2)
PASS test/permissions/website-door-conformance.spec.ts             (4)
PASS src/modules/website/guards/website-api.guard.spec.ts          (10)
PASS test/permissions/website-conformance.spec.ts                  (6)
PASS src/modules/website/website-ping.service.spec.ts              (3)
PASS src/modules/website/website-env.spec.ts                       (4)  — "exactly ONE production file names the variable" still green
PASS src/modules/website/guards/website-module-enabled.guard.spec.ts (5)
PASS src/modules/website/website-schema.spec.ts                    (14)
PASS src/modules/website/website-integration-config.service.spec.ts (13 = the brief's 12 + X5)
Test Suites: 9 passed, 9 total
Tests:       61 passed, 61 total
Nest log lines in output: 0 · console.* lines: 0
```

Before the logger stub was added, the output was checked for secret-looking strings (`wsw_…`, `wst_…`, `0x4AAA`, `fresh-turnstile`, `new-secret`, `not-a-ciphertext`): 0 hits — the log lines only ever carried names.

## Conformance / invariants

`npx jest test/permissions/repo-invariants.spec.ts --maxWorkers=2`: **17/17 green** — route census still has zero undecorated routes and "accounts for every route exactly once" (the class-level `@Public()` covers `ping`, the five admin verbs are `RequirePermission`), every `@RequirePermission` key/action resolves against the Task 1 descriptor, `PERMISSION_KEYS_HASH` untouched.

`website-door-conformance.spec.ts`: `errors: []`, `undecorated: []`, `decorated: 5`, `public: 1`; guard chain metadata equals `[WebsiteModuleEnabledGuard, WebsiteApiGuard]`.

`website-conformance.spec.ts` (Task 1, now scanning three controllers): unchanged assertions all green (`errors: []`, `selfService >= 1`).

## Typecheck

`npm run type-check --workspace=apps/backend` (run alone): exit 0, no diagnostics.

## Files changed (14, all committed)

- `apps/backend/src/modules/website/website.constants.ts` (new)
- `apps/backend/src/modules/website/website-integration-config.service.ts` (new)
- `apps/backend/src/modules/website/website-integration-config.service.spec.ts` (new)
- `apps/backend/src/modules/website/dto/website-integrations.dto.ts` (new)
- `apps/backend/src/modules/website/guards/website-api.guard.ts` (new)
- `apps/backend/src/modules/website/guards/website-api.guard.spec.ts` (new)
- `apps/backend/src/modules/website/decorators/token-class.decorator.ts` (new)
- `apps/backend/src/modules/website/website-ping.service.ts` (new)
- `apps/backend/src/modules/website/website-ping.service.spec.ts` (new)
- `apps/backend/src/modules/website/website-public.controller.ts` (new)
- `apps/backend/src/modules/website/website-integrations.controller.ts` (new)
- `apps/backend/src/modules/website/website.module.ts` (two anchored edits)
- `apps/backend/test/permissions/website-door-conformance.spec.ts` (new)
- `apps/backend/test/permissions/website-conformance.spec.ts` (imports + `CONTROLLERS`)

No docker, no Next build, no full suite, no push. `git status` clean after the commit.

## Self-review

- **Completeness.** Config service has cache/rotate/test/has*/X5; guard has the three classes, `timingSafeEqual` on equal lengths, 401 on a wrong token, missing header, non-Bearer scheme and length mismatch, and the fail-closed "not configured" 401 when nothing usable is stored; public controller carries the three class-level decorators and `GET ping` in the RC13 shape; admin controller has exactly the RC9 routes/shapes with the P3 permissions and `@AuditEntity` on every write; module wired and exporting the config service; Task 1's `CONTROLLERS` extended; all specs present.
- **Fail closed.** Verified the whole global chain honours a class-level `@Public()`: `JwtAuthGuard`, `PermissionsGuard` and `TrainingLockGuard` all read `IS_PUBLIC_KEY` via `getAllAndOverride([handler, class])`. `@TokenClass()` throws rather than defaulting. A missing `ENCRYPTION_KEY` surfaces as a 503 from `resolveSecrets()` (the CallCenter posture — a loud misconfiguration, not a silent 401).
- **No secret in logs/audit.** Every log line is by NAME (`Website secret rotated: writeToken`, `keys updated (turnstileSecret)`, decrypt WARN names the column); `testConnection` logs only the error message, whose three possible shapes (`No Turnstile secret…`, `Turnstile verify HTTP n`, `Turnstile rejected the stored secret: <codes>`) plus fetch/abort errors never quote the secret. `AuditInterceptor` (the only global interceptor) records `entityType/entityId/action/performedById/ip/ua` — never the request body or the response — so the rotate's display-once `secret` cannot enter `audit_logs`. The rotate response is the single place the value leaves the service.
- **Decrypt failures don't 500 the door.** Per-secret try/catch → `null` + one WARN; the guard then treats the null as unusable and answers 401 (or "not configured" when nothing is left).
- **Discipline.** Worked only in the worktree; no `cd` to the main checkout; no stash; only the brief's 14 files touched; the `registry.register({...})` literal and the `imports:` line are byte-for-byte as Tasks 1/2 left them; one jest at a time with `--maxWorkers=2`; typecheck run once, alone.

## Concerns (minor, no action taken)

1. **Audit `entityId` for rotate/test is `'unknown'`.** `AuditInterceptor.extractEntityId` reads `response.data.id` then `params.id`; the RC9 shapes for `rotate/:name` (`{ name, secret, previousExpiresAt }`) and `test` (`{ ok, error }`) carry neither, so those two audit rows will say `WebsiteIntegrationConfig / unknown` while `PATCH` and `PATCH keys` say the row id. The shapes are fixed by RC9 and Task 11 targets them, so I left it; if the reviewer wants the row id on every audit line, the least invasive fix is adding `id` to those two response objects (a Task 11 client-type touch).
2. **Logger stub in the config-service spec** is the one deviation from the brief's printed spec text (test-only, see above).
