# Task 1 report — Permission skeleton: `WebsiteModule` (ten keys), catalog + hash, role defaults v3, i18n labels, `GET /website/status`

**Status: DONE_WITH_CONCERNS** — everything in the brief is implemented and committed in one commit; two findings need a controller ruling (§7).

Worktree: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`, base `cf78a10` (= `main` 9139e16 + the two plan/ignore commits).
Commit: **`0de353f`** `feat(website): register the website permission module — ten keys, role defaults v3, GET /website/status` (13 files, +667/−16; trailer `Co-Authored-By: Claude Opus 5 (1M context)`). Not pushed.

## 1. What was implemented (brief steps 3a–3h)

| Step | File | Result |
|---|---|---|
| 3a | `apps/backend/src/modules/permissions/casl-ability.factory.ts` | `AppSubject` gains `'Website'` after `'WhatsappAutomation'` (comment verbatim). |
| 3b | `apps/backend/src/modules/website/website-status.controller.ts` (new) | Byte-identical to the brief. `@Controller('website')`, `@SelfService() @Get('status')`, inline `config.get<string>('WEBSITE_MODULE_ENABLED') === 'true'`. |
| 3c | `apps/backend/src/modules/website/website.module.ts` (new) | Byte-identical to the brief. `@Module({ imports: [ConfigModule, PrismaModule, PermissionsModule], controllers: [WebsiteStatusController], providers: [] })`; descriptor: `website` (V/C/E/D/EXPORT/APPROVE/MANAGE_KEYS, scope ALL), nine `kind: 'screen'` resources (six CMS at V/C/E/D/APPROVE; `forms` V/E/EXPORT; `settings` V/E; `integrations` V/E), two policies, `selfServiceRoutes: ['GET /website/status']`, `resourcesEnforced: true`, no `parentKey`. |
| 3d | `apps/backend/src/app.module.ts` | Import after `TrainingLockGuard`; `WebsiteModule,` as the last `imports` entry with the P1 comment. |
| 3e | `packages/permissions/src/keys.catalog.ts` | Ten keys inserted between `'users',` and `'whatsapp',` with the brief's comment; `PERMISSION_KEYS_HASH` → `ba5427d7b0688c2b783cd58f3a21d384878363a4`. 85 keys, still sorted. |
| 3f | `packages/permissions/src/role-defaults.ts` | `ROLE_DEFAULTS_VERSION = 3`; `role-admin` `{ module: 'website', actions: [V,C,E,D,EXPORT], since: 3 }`; `role-sales-manager`, `role-sales-agent`, `role-sales-executive` each `{ module: 'website.forms', actions: ['VIEW'], since: 3 }` (RC8); `role-marketing-manager` six `website.pages|strings|collections|blog|media|navigation` rows at `['VIEW','CREATE','EDIT'], since: 3`. Each row is the last entry of its role array, comments verbatim. `MODULE_OPS` untouched. |
| 3g | `apps/frontend/src/messages/en.json`, `tr.json` | `permissions.keys.website` + nine `website__<resource>` labels in both files, between `"users"` and `"whatsapp"` (the only adjacent pair — the one inside `permissions.keys`). Both files re-parsed as JSON. |
| 3h | `CLAUDE.md` (2 edits), `docs/PRD.md` (13 edits) | All count lines + the five §4.4 role rows + the version-3 sentence in the defaults bullet, each on its quoted anchor. `docs/PRD.md:480` census line left alone as instructed. |
| Step 1 | `apps/backend/test/permissions/website-conformance.spec.ts`, `website-inheritance.unit.spec.ts`, `apps/backend/src/modules/website/website-status.controller.spec.ts` (new) | Inheritance + controller specs byte-identical to the brief; conformance spec differs by ONE line (see §6.1). |

Every quoted anchor was found verbatim (verified by `grep`/assert before each replacement; each replacement asserted `count == 1`). No anchor differences to report.

## 2. RED (Step 2)

```
cd apps/backend && npx jest test/permissions/website-conformance.spec.ts test/permissions/website-inheritance.unit.spec.ts src/modules/website/website-status.controller.spec.ts --maxWorkers=2
```
Result: 3 failed suites, exactly as the brief predicts —
- `website-conformance.spec.ts`: `TS2307: Cannot find module '../../src/modules/website/website-status.controller'` (+ `TS2367` because `'website'` was not yet in the `PermissionKey` union).
- `website-status.controller.spec.ts`: `TS2307: Cannot find module './website-status.controller'`.
- `website-inheritance.unit.spec.ts`: `the catalog carries the nine resources` → received `[]`; `admin: one module row` → `rows.length` 0; `it.each(WEBSITE_RESOURCE_KEYS)` → `.each called with an empty Array of table data`; the three sales-role cells → `[]`.

Environment note: the first RED run also showed `TS2305: '@prisma/client' has no exported member 'PermissionAction'` on the NEW spec **and on the existing `market-research-conformance.spec.ts`** — `npm ci` had installed the package but `prisma generate` had never run in this worktree (`node_modules/.prisma/client` held only stubs). I ran `cd apps/backend && npx prisma generate` (schema read only; writes to `node_modules`; `git status` unchanged). After that the baseline market-research spec passes and the RED failures are exactly the predicted ones above.

## 3. GREEN (Step 4)

### 3.1 Backend — one jest invocation, `--maxWorkers=2`
```
cd apps/backend && npx jest test/permissions/website-conformance.spec.ts test/permissions/website-inheritance.unit.spec.ts src/modules/website/website-status.controller.spec.ts test/permissions/repo-invariants.spec.ts test/permissions/role-defaults.unit.spec.ts test/permissions/conformance.unit.spec.ts --maxWorkers=2 --verbose
```
```
PASS test/permissions/website-inheritance.unit.spec.ts
PASS test/permissions/repo-invariants.spec.ts
PASS test/permissions/role-defaults.unit.spec.ts
PASS src/modules/website/website-status.controller.spec.ts
PASS test/permissions/conformance.unit.spec.ts
PASS test/permissions/website-conformance.spec.ts
Test Suites: 6 passed, 6 total
Tests:       65 passed, 65 total   (0 skipped)
```
Named cells the brief calls out, all ✓: `lists exactly the registered module and resource keys`, `is sorted and free of duplicates`, `PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves`, `has no undecorated route left`, `accounts for every route exactly once`, `ROLE_DEFAULTS_VERSION equals the highest \`since\` in the matrix`, `declares no (role, module, action) cell twice`, `grants NO boundary cell to any built-in role`, `names no (module, action) pair the module does not support`, all six website-conformance cells, all inheritance cells (admin / marketing-manager / three sales roles), both controller cells.

(First GREEN attempt had `website-conformance.spec.ts` fail to COMPILE on the brief's own line 106 — see §6.1; after the one-token fix the run above is the result.)

### 3.2 Frontend — separate invocation from `apps/frontend`
```
cd apps/frontend && npx jest src/components/auth/not-authorized.spec.tsx src/config/route-permissions.spec.ts --maxWorkers=2 --verbose
```
```
PASS src/config/route-permissions.spec.ts
FAIL src/components/auth/not-authorized.spec.tsx
    ✓ has a label for EVERY permission key, in both languages      <- the cell this task is about
    ✕ has a label for every ACTION, in both languages               <- PRE-EXISTING, see §7.1
Tests: 1 failed, 16 passed, 17 total
```

### 3.3 Adjacent insurance runs (narrow, not the full suite)
- `test/permissions/catalog-actions.unit.spec.ts` ✓; the six sibling `*-inheritance.unit.spec.ts` (marketing, sales, projects, hrm, internal-recruitment, market-research) ✓ 71/71.
- `test/roles/reset-defaults.unit.spec.ts` ✗ 8/8 — NEW failure caused by this task's resource-key rows; test-fixture only; see §7.2.

## 4. Hash

Computed independently of the spec, from the real source file, before and after the edit, with `sha1(PERMISSION_KEYS.join(','))` over the keys regex-read from `keys.catalog.ts` (scratch script `hash.ts`, run via `npx tsx`; a plain `node -e` one-liner cross-checked it):
- before: 75 keys, sorted, `f03cde11c29d49b07d9210646d400898cbce89d0` (matches the old constant — proves the oracle).
- after: 85 keys, sorted, **`ba5427d7b0688c2b783cd58f3a21d384878363a4`** — identical to the brief's value. `repo-invariants.spec.ts → PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` agrees.

## 5. Type-check (one tsc at a time)
- `npm run type-check --workspace=apps/backend` → exit 0, no output.
- `npm run type-check --workspace=apps/frontend` → exit 0, no output.

## 6. Self-review

### 6.1 Deviations from the brief text (both deliberate, both minimal)
1. **`website-conformance.spec.ts` line 106** — the brief's `(WebsiteStatusController.prototype as Record<string, unknown>).status` does not compile (`TS2352`: a concrete class prototype has no index signature). Changed to `as unknown as Record<string, unknown>`, which is the repo's own precedent for a concrete class (`test/permissions/ai-interviewer-conformance.spec.ts:30`; the other conformance specs avoid the issue by typing the parameter `{ prototype: object }`). Every other brief-printed file is byte-identical (verified by diffing each code block extracted from the brief against the committed file); every inserted snippet (3a, 3d–3g) occurs exactly once in its target.
2. **PRD §4.4 `sales-manager` and `marketing-manager` rows** — the brief says to *append* `; \`website.forms\` …` / `; \`website.pages\`…` before the trailing ` |`, but both rows ended in a full stop (`V/E. |`, `only. |`); a literal append yields `.;`. I replaced the period with the semicolon (`… V/E; \`website.forms\` VIEW (…) |`). The distinctive substrings Task 12 would anchor on (`\`website.forms\` VIEW (\`since: 3\`, WP3a — the first RESOURCE-key row…`, `six resource-key rows…`) are present verbatim. The `admin`, `sales-agent`, `sales-executive` rows were literal inserts/appends as printed.

### 6.2 Completeness checklist
- 5 new files + 8 modified = the brief's 13-file `git add` list, nothing else staged; `git status` clean after commit.
- Ten keys in catalog (85 total) ✓; hash ✓; `ROLE_DEFAULTS_VERSION = 3` ✓; 10 `since: 3` grant entries across 5 roles incl. all three sales roles (RC8) ✓; `'Website'` `AppSubject` ✓; 10 en + 10 tr labels ✓; `@SelfService` status route + descriptor `selfServiceRoutes` ✓; three specs ✓; CLAUDE.md 2 count edits ✓; PRD 13 edits incl. the five §4.4 rows and the version-3 sentence ✓; all seven Task-12 anchor strings from brief line 36 present (grep count 1 each; `Marketing 9, Website 9, Projects 8,` count 2 = §4.2 + §4.8) ✓; PRD:480 census line untouched ✓; `MODULE_OPS` untouched ✓; no `prisma` schema/migration touched ✓; root workspace `CLAUDE.md` untouched ✓.

### 6.3 Production-safety reasoning checked (this commit later deploys)
- Boot conformance: registry keys == catalog keys in both directions (repo-invariants ✓ mirrors the boot check); the one new route is `@SelfService`, census undecorated == [] ✓; `WebsiteModule` is imported unconditionally ✓ (P1).
- The resource-key matrix rows: production `RolesService.resetDefaults` validates against `registry.keys()` (module + resource keys, W1) so `website.forms` etc. are valid; the seed writes `module: grant.module` as a plain key string with no dot check — both fine. Only a test fixture assumes depth-0 rows (§7.2).

## 7. Concerns — need a controller ruling

### 7.1 PRE-EXISTING red cell in a brief-named gate spec (not caused by this task, not fixed)
`apps/frontend/src/components/auth/not-authorized.spec.tsx` → `has a label for every ACTION, in both languages` asserts `Object.keys(en.permissions.actions)` has length **13**, but `HEAD`'s `en.json` already has **15** (`WITHDRAW`, `UNAPPROVE` added by `1aa470a` on 2026-09-16; `permissions.actions` is untouched by my commit — verified via `git show HEAD:apps/frontend/src/messages/en.json`). Deterministic on `main`. Left alone (out of scope); Task 13's full-suite gate will hit it. Fix is a one-number edit (`13` → `15`) in that spec, owner's call where it belongs.

### 7.2 NEW red spec caused by the first resource-key rows in the matrix (test fixture only; fix verified but NOT committed)
`apps/backend/test/roles/reset-defaults.unit.spec.ts` (8/8 cells) — its `realisticRegistry()` fixture registers every `grant.module` in `ROLE_PERMISSION_MATRIX` as a MODULE descriptor; `PermissionRegistry.register` throws on a dotted name (`Permission module "website.forms" is not a valid module key`). The fixture predates resource-key rows; production code paths are unaffected (§6.3). The brief did not anticipate it and the spec is not in its list, so per "stop and escalate rather than guess" I did not widen the commit. I DID verify a fix: group dotted keys under their module as resources (module actions = union of everything seeded on it or its resources) — with it the spec passes 8/8. Patch saved at `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/e2186f84-5a31-4b85-9453-d5ee861c5873/scratchpad/reset-defaults-fixture.patch` and reproduced here; say the word and I will commit it (as part of Task 1 or as its own commit — your call):

```diff
diff --git a/apps/backend/test/roles/reset-defaults.unit.spec.ts b/apps/backend/test/roles/reset-defaults.unit.spec.ts
index e2d6503..37ef371 100644
--- a/apps/backend/test/roles/reset-defaults.unit.spec.ts
+++ b/apps/backend/test/roles/reset-defaults.unit.spec.ts
@@ -30,32 +30,57 @@ const ACTOR: AuthenticatedUser = {
   roleSlug: 'super-admin',
 };
 
-/** A registry carrying every module the real matrix mentions. */
+/**
+ * A registry carrying every KEY the real matrix mentions.
+ *
+ * A matrix row's `module` is a key, not always a module: `website.forms`
+ * (WP3a, `since: 3`) is the first RESOURCE-key row the matrix carries, and
+ * `PermissionRegistry.register` refuses a dotted `name` — so a dotted key is
+ * registered as a resource under its module, the way the real module file
+ * declares it, and the module's own action list is the union of everything
+ * seeded on it or on its resources.
+ */
 function realisticRegistry(): PermissionRegistry {
   const reg = new PermissionRegistry();
-  const modules = new Set<string>();
-  const actionsByModule = new Map<string, Set<PermissionAction>>();
+  const actionsByKey = new Map<string, Set<PermissionAction>>();
   for (const grants of Object.values(ROLE_PERMISSION_MATRIX)) {
     for (const grant of grants) {
-      modules.add(grant.module);
-      const bucket = actionsByModule.get(grant.module) ?? new Set<PermissionAction>();
+      const bucket = actionsByKey.get(grant.module) ?? new Set<PermissionAction>();
       for (const action of grant.actions) bucket.add(action as PermissionAction);
-      actionsByModule.set(grant.module, bucket);
+      actionsByKey.set(grant.module, bucket);
     }
   }
-  for (const name of modules) {
+  const modules = new Map<
+    string,
+    { actions: Set<PermissionAction>; resources: Map<string, Set<PermissionAction>> }
+  >();
+  for (const [key, actions] of actionsByKey) {
+    const [moduleName, resource] = key.split('.');
+    const entry = modules.get(moduleName) ?? { actions: new Set<PermissionAction>(), resources: new Map() };
+    for (const action of actions) entry.actions.add(action);
+    if (resource) entry.resources.set(key, actions);
+    modules.set(moduleName, entry);
+  }
+  for (const [name, { actions, resources }] of modules) {
     reg.register({
       name,
       label: name,
       description: '',
       category: 'OPERATIONS',
       caslSubject: 'Settings',
-      supportedActions: [...(actionsByModule.get(name) ?? [])],
+      supportedActions: [...actions],
       supportedScopes: [
         PermissionScope.ALL,
         PermissionScope.ASSIGNED_TO_ME,
         PermissionScope.IN_MY_DEPARTMENT,
       ],
+      resources: [...resources].map(([key, resourceActions]) => ({
+        key,
+        label: key,
+        kind: 'screen' as const,
+        supportedActions: [...resourceActions],
+        supportedScopes: [PermissionScope.ALL],
+      })),
     });
   }
   return reg;
```

### 7.3 Minor / informational
- `prisma generate` had to be run in the worktree (§2) — the brief's "npm ci already done" was true but insufficient for any spec importing `PermissionAction`; later tasks in this worktree are now fine.
- Blast radius of the resource-key rows was swept: every other consumer of `ROLE_PERMISSION_MATRIX` (seed, `RolesService`, six inheritance specs, `role-defaults.unit.spec.ts`) handles or ignores them; only the §7.2 fixture breaks.

---

## Fix round 0 — ruling X1 (controller, 2026-09-19)

**Ruling:** commit the `test/roles/reset-defaults.unit.spec.ts` fixture fix (§7.2) as its own commit on top of `0de353f`; the pre-existing `has a label for every ACTION` cell (§7.1, 13 vs 15) stays untouched — ledgered for the frontend task.

**Done:** the patch saved in §7.2 was applied unchanged (`git apply --check` clean) and committed as
**`27a0e8d`** `test(roles): reset-defaults fixture registers resource keys under their module (first resource-key role rows)` (1 file, +33/−8; trailer `Co-Authored-By: Claude Opus 5 (1M context)`). Branch is now `cf78a10 → 0de353f → 27a0e8d`; not pushed; tree clean.

**Re-run (one jest invocation):**
```
cd apps/backend && npx jest test/roles/reset-defaults.unit.spec.ts test/permissions/role-defaults.unit.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2
```
```
PASS test/permissions/repo-invariants.spec.ts (5.646 s)
PASS test/permissions/role-defaults.unit.spec.ts
PASS test/roles/reset-defaults.unit.spec.ts (5.853 s)
Test Suites: 3 passed, 3 total
Tests:       36 passed, 36 total
Snapshots:   0 total
Time:        6.44 s, estimated 12 s
```

§7.2 is resolved; §7.1 remains as ledgered; nothing else changed.
