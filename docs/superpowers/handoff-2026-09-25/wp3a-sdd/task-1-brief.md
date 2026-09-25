### Task 1: Permission skeleton — `WebsiteModule` descriptor (ten keys), catalog + hash, role defaults v3, i18n labels, `GET /website/status`

Repo: the WP3a worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations; branch `website/wp3a-intake` — RC17: every task executes from this worktree, never from the shared `main` checkout at `jobsadmire-operations`). Run `npm ci` in the worktree before this task starts. First task of WP3a; nothing website-related exists on `main` yet (verified at `9139e16`: no `apps/backend/src/modules/website/`, no `website` key anywhere under `packages/permissions`).

Rulings applied: P1 (one always-imported `WebsiteModule`; `GET /api/website/status` is `@SelfService()` and reports `{ enabled }` from the environment per call), P3 (all ten keys registered now, `resourcesEnforced: true`, `caslSubject: 'Website'`, MANAGE_KEYS module-only and seeded to no role, explicit `since: 3` rows, `ROLE_DEFAULTS_VERSION = 3`, never `MODULE_OPS`), P13 (Operations `CLAUDE.md` + `docs/PRD.md` counts in the same change set; the workspace-root `CLAUDE.md` is untouched), P14 (en + tr `permissions.keys.*` for all ten keys), RC1 (Task 1 is first — it consumes repo primitives only; the Task numbers it names for its consumers are the final ones), RC8 (`website.forms` = VIEW/EDIT/EXPORT, `website.media` = V/C/E/D/APPROVE, and `website.forms VIEW (since: 3)` to `sales-manager`, `sales-executive` AND `sales-agent`), RC10 (Task 1 owns every count line and role row in CLAUDE.md/PRD; Task 12 anchors on the strings written here and adds prose only), RC14 (this commit sits before the migration commit; Task 13 cherry-picks the migration onto `origin/main` first — the expected path), RC15 (every file printed in final form; the conformance spec's `CONTROLLERS` array is extended by Tasks 4, 7, 8 and 9 in their own text; anchors quoted by line text).

**Files:**
- Create `apps/backend/src/modules/website/website.module.ts`
- Create `apps/backend/src/modules/website/website-status.controller.ts`
- Create `apps/backend/src/modules/website/website-status.controller.spec.ts`
- Create `apps/backend/test/permissions/website-conformance.spec.ts`
- Create `apps/backend/test/permissions/website-inheritance.unit.spec.ts`
- Modify `apps/backend/src/app.module.ts` — import after the line `import { TrainingLockGuard } from './modules/sales-training/training-lock.guard';`; array entry after the line `    SalesTrainingModule,` (the last entry of `imports: [`)
- Modify `apps/backend/src/modules/permissions/casl-ability.factory.ts` — `AppSubject` union, after the line `  | 'WhatsappAutomation';`
- Modify `packages/permissions/src/keys.catalog.ts` — between the lines `  'users',` and `  'whatsapp',`; and the line `export const PERMISSION_KEYS_HASH = 'f03cde11c29d49b07d9210646d400898cbce89d0';`
- Modify `packages/permissions/src/role-defaults.ts` — the line `export const ROLE_DEFAULTS_VERSION = 2;`; `'role-admin'` after its `users` entry; `'role-sales-manager'`, `'role-marketing-manager'`, `'role-sales-agent'`, `'role-sales-executive'` each before their closing `  ],`
- Modify `apps/frontend/src/messages/en.json` and `apps/frontend/src/messages/tr.json` — inside `permissions.keys`, between `"users": …` and `"whatsapp": "WhatsApp",`
- Modify `CLAUDE.md` (Operations repo root — the line beginning `- **Permissions** — database-driven:` and the line beginning `- **A permission KEY is \`module\` or \`module.resource\`**`) and `docs/PRD.md` (the count bullets beginning `- **A permission is a KEY, not just a module.**`, `**22 permission modules + 53 screen-level resources`, `- **OPERATIONS (17):**`, `**Typed keys — one vocabulary, asserted at boot (W2).**` and `- **Catalog labels for FUTURE keys.**`; the §4.4 rows `| \`admin\` |`, `| \`sales-manager\` |`, `| \`marketing-manager\` |`, `| \`sales-agent\` |`, `| \`sales-executive\` |`; the bullet beginning `- **Built-in role DEFAULTS are versioned; the Roles UI is the truth`) — every edit in Step 3h quotes the exact text it replaces or appends to; the line numbers given there are as of `main` `9139e16`, for orientation only
- Test: the three new specs above; existing gates `apps/backend/test/permissions/repo-invariants.spec.ts`, `apps/backend/test/permissions/role-defaults.unit.spec.ts`, `apps/backend/test/permissions/conformance.unit.spec.ts`, `apps/frontend/src/components/auth/not-authorized.spec.tsx`, `apps/frontend/src/config/route-permissions.spec.ts`

**Interfaces:**
- Consumes (repo primitives only — Task 1 is first in the sequence, RC1):
  - `PermissionRegistry.register(descriptor: PermissionModuleDescriptor): void` (`apps/backend/src/modules/permissions/registry/permission-registry.ts`); descriptor fields per `registry/permission-registry.types.ts`: `name, label, description, category: 'OPERATIONS' | 'INFRASTRUCTURE' | 'ADMINISTRATION', caslSubject: AppSubject, supportedActions: PermissionAction[], supportedScopes: PermissionScope[], scopeBindings?, resources?: { key, label, description?, kind: 'screen' | 'submodule' | 'feature', supportedActions }[], policies?: { key, label, description }[], selfServiceRoutes?: string[], resourcesEnforced?: boolean, parentKey?: string`.
  - `SelfService = () => SetMetadata(SELF_SERVICE_KEY, true)` and `SELF_SERVICE_KEY = 'self_service'` (`apps/backend/src/modules/permissions/decorators/self-service.decorator.ts`).
  - `ConfigService` from `@nestjs/config` (global: `ConfigModule.forRoot({ isGlobal: true })` in `app.module.ts`); `PermissionsModule` and `PrismaModule` are both `@Global()`.
  - Test helpers: `registryFromSource(...modulePaths)` and `registeredActionsFromSource()` (`apps/backend/test/permissions/registry-from-source.ts`); `PermissionConformanceService.scanClasses(controllers, strict): { report: { decorated, public, selfService, undecorated, strict }, errors }` (`permission-conformance.service.ts`); `ROLE_PERMISSION_MATRIX`, `resolveEffective`, `resourceKeysOf`, `GrantRow`, `PermissionActionKey` from `@jobsadmire/permissions`.
- Produces (later tasks rely on these exact names):
  - `export class WebsiteModule` at `apps/backend/src/modules/website/website.module.ts`, imported unconditionally by `AppModule` (P1), `@Module({ imports: [ConfigModule, PrismaModule, PermissionsModule], controllers: [WebsiteStatusController], providers: [] })` — Tasks 2 and 4 print the whole block again from exactly this starting point. Task 2 sets `providers: [WebsiteModuleEnabledGuard]`; Task 4 (`WebsiteIntegrationsController`, `WebsitePublicController`, `WebsiteIntegrationConfigService`, `WebsitePingService`, `WebsiteApiGuard`, `exports`), Task 6 (the forms core and the three contract shells), Task 7 (`WebsiteFormsInboxController`, `WebsiteFormsInboxService`, `WebsiteInquiryHandler`, `SalesModule`), Task 8 (`WebsitePublicUploadsController`, `WebsiteFormsEvidenceController`, `CareersPublicModule`, `UploadModule`), Task 9 (`WebsitePublicNewsletterController`, `NotificationsModule`) and Task 10 (the two crons) each print the whole `@Module({...})` block they leave behind (RC15) — every later block is the previous one plus that task's names, in the same order. The constructor's `registry.register({...})` literal is never edited by a later task.
  - Permission keys (string literals, P3): `'website'`, `'website.blog'`, `'website.collections'`, `'website.forms'`, `'website.integrations'`, `'website.media'`, `'website.navigation'`, `'website.pages'`, `'website.settings'`, `'website.strings'`. Module actions `VIEW, CREATE, EDIT, DELETE, EXPORT, APPROVE, MANAGE_KEYS`; scope `ALL` only. Resource actions (RC8 — this descriptor is the source; docs copy it): `website.pages`, `website.strings`, `website.collections`, `website.blog`, `website.media`, `website.navigation` = `VIEW, CREATE, EDIT, DELETE, APPROVE`; `website.forms` = `VIEW, EDIT, EXPORT`; `website.settings` = `VIEW, EDIT`; `website.integrations` = `VIEW, EDIT`. Every secret write/rotate/test route (Task 4) uses `@RequirePermission('website', 'MANAGE_KEYS')`; the non-secret integrations routes use `@RequirePermission('website.integrations', 'VIEW' | 'EDIT')`; the inbox (Task 7) uses `@RequirePermission('website.forms', 'VIEW')`, re-run `'EDIT'`, export `'EXPORT'`; evidence read-back (Task 8) `('website.forms', 'VIEW')`.
  - `AppSubject` gains `'Website'` (`caslSubject: 'Website'`).
  - `PERMISSION_KEYS` = 85 keys (23 modules + 62 resources); `PERMISSION_KEYS_HASH = 'ba5427d7b0688c2b783cd58f3a21d384878363a4'` (sha1 of `PERMISSION_KEYS.join(',')`, recomputed against the real list); `ROLE_DEFAULTS_VERSION = 3`.
  - Seeded rows, all `since: 3` (P3, RC8): `role-admin` → `{ module: 'website', actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'] }`; `role-marketing-manager` → six rows `website.pages|strings|collections|blog|media|navigation` at `['VIEW', 'CREATE', 'EDIT']`; `role-sales-manager`, `role-sales-executive`, `role-sales-agent` → `{ module: 'website.forms', actions: ['VIEW'] }` (scope ALL — the resource supports only ALL). APPROVE and MANAGE_KEYS to no role. `website` is NOT added to `MODULE_OPS`.
  - `export class WebsiteStatusController` at `apps/backend/src/modules/website/website-status.controller.ts`: `@Controller('website')`, `@SelfService() @Get('status') status(): { data: { enabled: boolean } }` → `GET /api/website/status` (P1). This task reads `this.config.get<string>('WEBSITE_MODULE_ENABLED') === 'true'` inline; Task 2 replaces that one expression with `websiteModuleEnabled(this.config)` from `./website-module-flag` (the response shape and `website-status.controller.spec.ts` are fixed here and stay green under Task 2's helper, which calls `config.get('WEBSITE_MODULE_ENABLED')` once per call).
  - `apps/backend/test/permissions/website-conformance.spec.ts` with `const CONTROLLERS = [WebsiteStatusController];` — Tasks 4, 7, 8 and 9 append their controller classes to this array in their own text (RC15) so the class-level `@Public()` + guard chain and every `@RequirePermission` key in the module are scanned by the real scanner.
  - i18n: `permissions.keys.website` and `permissions.keys.website__<resource>` for all nine resources in both `en.json` and `tr.json` (Task 11 does NOT add labels).
  - Doc count lines (RC10 — Task 1 owns them; Task 12 re-anchors on the exact strings below and adds prose only): CLAUDE.md `**85 grantable keys** (23 modules + 62 screen-level resources, all enforced)` and `All 23 modules declare resources and all are`; PRD `all 23 modules now declare them and all are \`resourcesEnforced: true\`** — 85 keys in total`, `**23 permission modules + 62 screen-level resources = 85 grantable keys**`, `Marketing 9, Website 9, Projects 8,`, `**OPERATIONS (18):**`, `23 modules + 62 resources = **85** since the website module (WP3a, 2026-09-19)`, `All 85 current keys have en + tr`.

- [ ] **Step 1: Write the failing tests**

`apps/backend/test/permissions/website-conformance.spec.ts` (the `market-research-conformance.spec.ts` shape, swapped to the website module; `registry-from-source.ts` does not parse `selfServiceRoutes`, so that cell reads the module SOURCE the same way the helper does):

```ts
import { readFileSync } from 'fs';
import { join } from 'path';
import { MetadataScanner, Reflector } from '@nestjs/core';
import { PermissionAction } from '@prisma/client';
import { PERMISSION_KEYS } from '@jobsadmire/permissions';

import { PermissionConformanceService } from '../../src/modules/permissions/permission-conformance.service';
import { SELF_SERVICE_KEY } from '../../src/modules/permissions/decorators/self-service.decorator';
import { WebsiteStatusController } from '../../src/modules/website/website-status.controller';
import { registryFromSource } from './registry-from-source';

/**
 * The website module (WP3a, 2026-09-19) registers its whole key set on day one
 * — the CMS screens Phase B will fill in as well as the two WP3a screens — so
 * the Roles matrix never has to grow a column mid-programme (ruling P3).
 *
 * THE REAL SCANNER over the REAL controllers, market-research's shape. Every
 * later WP3a task that adds a controller appends its class to CONTROLLERS
 * (RC15): the public door is `@Public()` + the flag guard + the token guard at
 * class level, the inbox is `website.forms`, the integrations screen is
 * `website.integrations` for the non-secret half and `website` MANAGE_KEYS for
 * every secret door.
 */

const CONTROLLERS = [WebsiteStatusController];

const MODULE_SOURCE = readFileSync(
  join(__dirname, '../../src/modules/website/website.module.ts'),
  'utf8',
);

const WEBSITE_RESOURCE_KEYS = [
  'website.blog',
  'website.collections',
  'website.forms',
  'website.integrations',
  'website.media',
  'website.navigation',
  'website.pages',
  'website.settings',
  'website.strings',
];

describe('Website route conformance', () => {
  const registry = registryFromSource('modules/website/website.module.ts');

  it('reads the live descriptor (the parse itself still works)', () => {
    expect(registry.descendantsOf('website').sort()).toEqual(WEBSITE_RESOURCE_KEYS);
    expect(registry.get('website')?.supportedActions).toEqual([
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.DELETE,
      PermissionAction.EXPORT,
      PermissionAction.APPROVE,
      PermissionAction.MANAGE_KEYS,
    ]);
  });

  it('every website route names a registered key at a supported action, or says what it is', () => {
    const { report, errors } = new PermissionConformanceService(
      { getControllers: () => [] } as never,
      new MetadataScanner(),
      new Reflector(),
      registry,
      { get: () => undefined } as never,
    ).scanClasses(CONTROLLERS, true);

    expect(errors).toEqual([]);
    expect(report.undecorated).toEqual([]);
    // The status probe is the one self-service route in the module (P1).
    expect(report.selfService).toBeGreaterThanOrEqual(1);
  });

  it('declares its resources as ENFORCED and stands on its own in the nav (no parentKey)', () => {
    expect(registry.get('website')?.resourcesEnforced).toBe(true);
    expect(registry.get('website')?.parentKey).toBeUndefined();
  });

  it('keeps the secret door on the MODULE key and the inbox export on EXPORT', () => {
    // MANAGE_KEYS is a module-wide trust boundary (the marketing/whatsapp
    // precedent): no resource may offer it, so the Roles screen cannot even
    // draw a cell for it under `website.integrations`.
    for (const key of WEBSITE_RESOURCE_KEYS) {
      expect({ key, actions: registry.getResource(key)?.supportedActions }).not.toEqual({
        key,
        actions: expect.arrayContaining([PermissionAction.MANAGE_KEYS]),
      });
    }
    expect(registry.getResource('website.forms')?.supportedActions).toEqual([
      PermissionAction.VIEW,
      PermissionAction.EDIT,
      PermissionAction.EXPORT,
    ]);
    expect(registry.getResource('website.integrations')?.supportedActions).toEqual([
      PermissionAction.VIEW,
      PermissionAction.EDIT,
    ]);
    expect(registry.getResource('website.settings')?.supportedActions).toEqual([
      PermissionAction.VIEW,
      PermissionAction.EDIT,
    ]);
  });

  it('GET /website/status is self-service, and the descriptor SAYS so', () => {
    const handler = (WebsiteStatusController.prototype as Record<string, unknown>).status;
    expect(Reflect.getMetadata(SELF_SERVICE_KEY, handler as object)).toBe(true);
    // `registryFromSource` does not parse `selfServiceRoutes`; the literal is
    // what the Roles screen shows, so pin it in the source the same way.
    expect(MODULE_SOURCE).toContain("selfServiceRoutes: ['GET /website/status']");
  });

  it('every registered website key is in the shared PERMISSION_KEYS list, and nothing else is', () => {
    const catalog = new Set<string>(PERMISSION_KEYS);
    expect([...registry.keys()].filter((key) => !catalog.has(key))).toEqual([]);
    expect(PERMISSION_KEYS.filter((k) => k === 'website' || k.startsWith('website.'))).toEqual([
      'website',
      ...WEBSITE_RESOURCE_KEYS,
    ]);
  });
});
```

`apps/backend/test/permissions/website-inheritance.unit.spec.ts` (the `market-research-inheritance.unit.spec.ts` shape, extended for resource-key rows):

```ts
import {
  ROLE_PERMISSION_MATRIX,
  resolveEffective,
  resourceKeysOf,
  type GrantRow,
  type PermissionActionKey,
} from '@jobsadmire/permissions';

/**
 * THE MIGRATION SAFETY PROOF for the website module's seeded defaults (WP3a,
 * rulings P3 + RC8). Three holder SHAPES: `admin` holds a MODULE row
 * (everything but APPROVE and MANAGE_KEYS), `marketing-manager` holds six
 * RESOURCE rows (the CMS screens, V/C/E) and the three sales roles each hold
 * one resource row (`website.forms` VIEW). The first is the first module row
 * with EXPORT that inherits into nine screens; the others are the first
 * resource-key rows the matrix has ever carried, which is exactly why they are
 * worth proving rather than asserting.
 */

const NOW = new Date('2026-09-19T12:00:00.000Z');
const WEBSITE_RESOURCE_KEYS = resourceKeysOf('website');
const CMS_KEYS = [
  'website.pages',
  'website.strings',
  'website.collections',
  'website.blog',
  'website.media',
  'website.navigation',
];
const SALES_ROLES: Array<[roleId: string, roleSlug: string]> = [
  ['role-sales-manager', 'sales-manager'],
  ['role-sales-executive', 'sales-executive'],
  ['role-sales-agent', 'sales-agent'],
];

/** Every seeded row whose key is `website` or `website.<x>`, as the seed writes it. */
function seededRows(roleId: string): GrantRow[] {
  const grants = ROLE_PERMISSION_MATRIX[roleId] ?? [];
  return grants
    .filter((g) => g.module === 'website' || g.module.startsWith('website.'))
    .flatMap((g) =>
      g.actions.map((action) => ({
        key: g.module,
        action: action as PermissionActionKey,
        scope: (g.scope ?? 'ALL') as GrantRow['scope'],
        allowed: true,
      })),
    );
}

function resolve(roleId: string, roleSlug: string, rows: GrantRow[]) {
  return resolveEffective({ roles: [{ roleId, roleSlug, rows }], overrides: [], now: NOW });
}

describe('the seeded website holders really differ (fixture guard)', () => {
  it('the catalog carries the nine resources', () => {
    expect(WEBSITE_RESOURCE_KEYS).toEqual([
      'website.blog',
      'website.collections',
      'website.forms',
      'website.integrations',
      'website.media',
      'website.navigation',
      'website.pages',
      'website.settings',
      'website.strings',
    ]);
  });

  it('admin: one module row, no APPROVE, no MANAGE_KEYS', () => {
    const rows = seededRows('role-admin');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.key === 'website')).toBe(true);
    expect(rows.map((r) => r.action).sort()).toEqual(['CREATE', 'DELETE', 'EDIT', 'EXPORT', 'VIEW']);
  });

  it('marketing-manager: six CMS resource rows at V/C/E, nothing on forms/settings/integrations', () => {
    const rows = seededRows('role-marketing-manager');
    expect([...new Set(rows.map((r) => r.key))].sort()).toEqual([...CMS_KEYS].sort());
    for (const key of CMS_KEYS) {
      expect(rows.filter((r) => r.key === key).map((r) => r.action).sort()).toEqual(['CREATE', 'EDIT', 'VIEW']);
    }
  });

  it.each(SALES_ROLES)('%s: website.forms VIEW only, at ALL (RC8)', (roleId) => {
    expect(seededRows(roleId)).toEqual([
      { key: 'website.forms', action: 'VIEW', scope: 'ALL', allowed: true },
    ]);
  });
});

describe('a module grant still reaches every website screen', () => {
  it.each(WEBSITE_RESOURCE_KEYS)('%s inherits the admin row, marked inherited', (key) => {
    const rows = seededRows('role-admin');
    const effective = resolve('role-admin', 'admin', rows);
    for (const action of ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT', 'APPROVE', 'MANAGE_KEYS'] as PermissionActionKey[]) {
      const held = rows.some((r) => r.action === action);
      const result = effective.check(key, action);
      expect({ key, action, allowed: result.allowed }).toEqual({ key, action, allowed: held });
      if (held) {
        expect(result.reason).toEqual({
          source: 'role-grant',
          roleId: 'role-admin',
          roleSlug: 'admin',
          key: 'website',
          inherited: true,
        });
      }
    }
  });

  it('admin cannot APPROVE or MANAGE_KEYS anywhere in the module', () => {
    const effective = resolve('role-admin', 'admin', seededRows('role-admin'));
    for (const key of ['website', ...WEBSITE_RESOURCE_KEYS]) {
      expect({ key, approve: effective.check(key, 'APPROVE').allowed }).toEqual({ key, approve: false });
      expect({ key, keys: effective.check(key, 'MANAGE_KEYS').allowed }).toEqual({ key, keys: false });
    }
  });
});

describe('resource-ONLY holders (the first resource-key rows in the matrix)', () => {
  it('marketing-manager reaches the CMS screens, sees the module in the nav, and nothing else', () => {
    const effective = resolve('role-marketing-manager', 'marketing-manager', seededRows('role-marketing-manager'));
    for (const key of CMS_KEYS) {
      expect({ key, view: effective.check(key, 'VIEW').allowed }).toEqual({ key, view: true });
      expect({ key, edit: effective.check(key, 'EDIT').allowed }).toEqual({ key, edit: true });
      expect({ key, del: effective.check(key, 'DELETE').allowed }).toEqual({ key, del: false });
      expect({ key, approve: effective.check(key, 'APPROVE').allowed }).toEqual({ key, approve: false });
    }
    expect(effective.check('website', 'VIEW').allowed).toBe(false);
    expect(effective.checkAny('website', 'VIEW').allowed).toBe(true);
    expect(effective.check('website.forms', 'VIEW').allowed).toBe(false);
    expect(effective.check('website.integrations', 'VIEW').allowed).toBe(false);
    expect(effective.check('website.settings', 'VIEW').allowed).toBe(false);
  });

  it.each(SALES_ROLES)('%s reaches the forms inbox and only the forms inbox', (roleId, roleSlug) => {
    const effective = resolve(roleId, roleSlug, seededRows(roleId));
    expect(effective.check('website.forms', 'VIEW').allowed).toBe(true);
    expect(effective.check('website.forms', 'EDIT').allowed).toBe(false);
    expect(effective.check('website.forms', 'EXPORT').allowed).toBe(false);
    expect(effective.check('website', 'VIEW').allowed).toBe(false);
    expect(effective.checkAny('website', 'VIEW').allowed).toBe(true);
    expect(effective.check('website.integrations', 'VIEW').allowed).toBe(false);
    expect(effective.check('website.pages', 'VIEW').allowed).toBe(false);
  });
});

describe('the cases that are supposed to differ', () => {
  it('a per-user DENY override on the module blocks every screen', () => {
    const effective = resolveEffective({
      roles: [{ roleId: 'role-admin', roleSlug: 'admin', rows: seededRows('role-admin') }],
      overrides: [
        { id: 'ovr1', key: 'website', action: 'VIEW', scope: 'ALL', allowed: false, expiresAt: '2026-09-30T00:00:00.000Z' },
      ],
      now: NOW,
    });
    for (const key of ['website', ...WEBSITE_RESOURCE_KEYS]) {
      expect({ key, allowed: effective.check(key, 'VIEW').allowed }).toEqual({ key, allowed: false });
    }
  });

  it('a marketing grant does not reach the website CMS', () => {
    // Sibling MODULES in the data; the resolver never walks between them.
    const effective = resolve('role-custom', 'custom', [
      { key: 'marketing', action: 'APPROVE', scope: 'ALL', allowed: true },
    ]);
    expect(effective.check('website', 'VIEW').allowed).toBe(false);
    expect(effective.check('website.pages', 'APPROVE').allowed).toBe(false);
    expect(effective.checkAny('website', 'VIEW').allowed).toBe(false);
  });
});
```

`apps/backend/src/modules/website/website-status.controller.spec.ts`:

```ts
import { WebsiteStatusController } from './website-status.controller';

/**
 * The status probe is what the admin screens read to draw the "public intake is
 * OFF" banner (P14) and what the WP3a gate reads before flipping the VPS flag
 * (P1). It answers from the container's environment on EVERY call — never a
 * cached boot-time value — so a `docker compose up -d backend` after an .env
 * edit is the whole flip recipe. Task 2 routes the read through the shared
 * `websiteModuleEnabled(config)` helper; this spec is written so it stays green
 * under both readers (one `config.get('WEBSITE_MODULE_ENABLED')` per call).
 */
describe('WebsiteStatusController', () => {
  function build(value: string | undefined) {
    const config = { get: jest.fn(() => value) };
    return { controller: new WebsiteStatusController(config as never), config };
  }

  it("reports enabled only for the literal 'true'", () => {
    expect(build('true').controller.status()).toEqual({ data: { enabled: true } });
    expect(build('false').controller.status()).toEqual({ data: { enabled: false } });
    expect(build('TRUE').controller.status()).toEqual({ data: { enabled: false } });
    expect(build('1').controller.status()).toEqual({ data: { enabled: false } });
    expect(build(undefined).controller.status()).toEqual({ data: { enabled: false } });
  });

  it('reads WEBSITE_MODULE_ENABLED through ConfigService, per call', () => {
    const { controller, config } = build('true');
    controller.status();
    controller.status();
    expect(config.get).toHaveBeenCalledTimes(2);
    expect(config.get).toHaveBeenCalledWith('WEBSITE_MODULE_ENABLED');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest test/permissions/website-conformance.spec.ts test/permissions/website-inheritance.unit.spec.ts src/modules/website/website-status.controller.spec.ts --maxWorkers=2
```

Expected: three red suites. `website-conformance.spec.ts` and `website-status.controller.spec.ts` fail to run — `Cannot find module '../../src/modules/website/website-status.controller'` / `'./website-status.controller'` (and `ENOENT … website.module.ts` for the source read). `website-inheritance.unit.spec.ts` fails before the catalog edit because `resourceKeysOf('website')` is `[]` (Jest refuses `it.each([])` — "`.each` called with an empty Array of table data" — and the fixture-guard cells would fail anyway: `seededRows('role-admin')` is `[]`, `ROLE_PERMISSION_MATRIX` has no `website*` rows).

- [ ] **Step 3: Implement**

**3a. `apps/backend/src/modules/permissions/casl-ability.factory.ts`** — in the `AppSubject` union, replace the line `  | 'WhatsappAutomation';` with:

```ts
  | 'WhatsappAutomation'
  // Website module (WP3a, 2026-09-19): the CMS screens, the forms inbox and
  // the integrations settings. One subject for the whole module, like
  // `MarketingCampaign` covers Marketing Studio.
  | 'Website';
```

**3b. `apps/backend/src/modules/website/website-status.controller.ts`** (new — full file):

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SelfService } from '../permissions/decorators/self-service.decorator';

/**
 * `GET /website/status` — is the public intake door switched on in THIS
 * environment? (WP3a, ruling P1.)
 *
 * Authenticated rather than public — the repo's boundary is "no public
 * endpoints outside careers-public" and the website/v1 doors are the only
 * sanctioned exceptions (PRD §7.10) — and self-service rather than
 * grant-gated: the admin screens draw a "public intake is OFF" banner from this
 * answer, and every holder of ANY website key may see that banner (the
 * `GET /notifications/push/vapid-public-key` precedent). Nothing here reaches
 * another person's data; there is no `@AuditEntity`.
 *
 * Read from the container's environment on every call, never cached at boot:
 * flipping `WEBSITE_MODULE_ENABLED` in the VPS `.env` followed by
 * `docker compose up -d backend` is the whole recipe (DEPLOYMENT.md). Task 2
 * moves this read behind the shared `websiteModuleEnabled(config)` helper so
 * the guard on the public door, the crons and this probe can never disagree
 * for longer than one request.
 */
@ApiTags('Website')
@ApiBearerAuth()
@Controller('website')
export class WebsiteStatusController {
  constructor(private readonly config: ConfigService) {}

  @SelfService()
  @Get('status')
  @ApiOperation({ summary: 'Whether the public website intake door is enabled in this environment' })
  @ApiResponse({ status: 200, description: '{ enabled } — false unless WEBSITE_MODULE_ENABLED is the literal "true"' })
  status() {
    return { data: { enabled: this.config.get<string>('WEBSITE_MODULE_ENABLED') === 'true' } };
  }
}
```

**3c. `apps/backend/src/modules/website/website.module.ts`** (new — full file). Literal style is load-bearing: `registry-from-source.ts` and `repo-invariants.spec.ts` regex-read `name: '…'`, the FIRST `supportedActions: [PermissionAction.X, …]`, each `resources: [{ key: '…', kind: '…', supportedActions: […] }]` block, `policies: [{ key: '…' }]` and `resourcesEnforced: true` from the SOURCE, delimiting the descriptor by brace balance. No constants, no spreads, no `{`/`}`/`]` inside a comment or string within the descriptor, no `key:`/`kind:`/`supportedActions:` text inside a description string.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PermissionAction, PermissionScope } from '@prisma/client';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionRegistry } from '../permissions/registry/permission-registry';
import { WebsiteStatusController } from './website-status.controller';

/**
 * The Website module (WP3a, 2026-09-19 — PRD §5.12, §7.10).
 *
 * Serves jobsadmire.com: in WP3a the public INTAKE door (`/website/v1/*`, a
 * Bearer-token machine surface the website calls server-side), the forms
 * inbox and the integrations/token settings; in Phase B the CMS the site reads
 * its content from (pages, strings, collections, blog, media, navigation).
 *
 * ALWAYS IMPORTED, WHATEVER `WEBSITE_MODULE_ENABLED` SAYS (ruling P1). The
 * descriptor below has to register on every boot: `PermissionConformanceService`
 * diffs `registry.keys()` against `PERMISSION_KEYS` in BOTH directions and
 * fails the container on a catalog key no module registers — so gating this
 * module's import behind the flag would take production down in the OFF
 * state, and dropping the keys from the catalog would take it down in the ON
 * state. The flag is read at REQUEST time instead: `WebsiteModuleEnabledGuard`
 * (Task 2) 404s every `website/v1` route while it is off, every website cron
 * checks it per tick, and `GET /website/status` reports it. Nothing about the
 * module's SHAPE depends on the environment.
 *
 * `ConfigModule` (global via `forRoot({ isGlobal: true })`), `PrismaModule`
 * and `PermissionsModule` (both `@Global()`) are listed anyway — the way
 * `market-research.module.ts` lists the latter two and
 * `recruitment-platforms.module.ts` lists `ConfigModule` — so the
 * dependency reads on the page: the status probe, the flag guard (Task 2),
 * the token guard and the crons all read `ConfigService`. Later WP3a tasks add
 * controllers and providers to the arrays below; the `registry.register`
 * literal is never edited after this commit.
 */
@Module({
  imports: [ConfigModule, PrismaModule, PermissionsModule],
  controllers: [WebsiteStatusController],
  providers: [],
})
export class WebsiteModule {
  constructor(registry: PermissionRegistry) {
    registry.register({
      name: 'website',
      label: 'Website',
      description:
        'The public website (jobsadmire.com): the forms it submits into Operations, the tokens and ' +
        'captcha it authenticates with, and — from Phase B — the pages, strings, collections, blog, ' +
        'media and navigation it renders from.',
      category: 'OPERATIONS',
      caslSubject: 'Website',
      supportedActions: [
        PermissionAction.VIEW,
        PermissionAction.CREATE,
        PermissionAction.EDIT,
        PermissionAction.DELETE,
        PermissionAction.EXPORT,
        PermissionAction.APPROVE,
        PermissionAction.MANAGE_KEYS,
      ],
      // One website, one inbox: there is no per-person slice of it (ALL only).
      supportedScopes: [PermissionScope.ALL],
      scopeBindings: {},

      /**
       * ALL TEN KEYS FROM DAY ONE (ruling P3). WP3a builds two of these screens
       * (Forms inbox, Integrations); Phase B builds the other seven. They are
       * registered now so the Roles matrix never grows a column mid-programme
       * and a role prepared today keeps meaning the same thing in Phase B.
       *
       * MANAGE_KEYS IS NOT A RESOURCE ACTION. Every secret door — write/test
       * token rotate, Turnstile secret, revalidate secret, "test connection" —
       * is gated on the MODULE key at MANAGE_KEYS (seeded to NO role, so
       * super-admin only via the CASL bypass — the marketing/whatsapp
       * precedent). `website.integrations` VIEW/EDIT covers the page and its
       * NON-secret fields (second-human recipient, has-chips).
       */
      resources: [
        {
          key: 'website.pages',
          label: 'Pages',
          description: 'Page-level content and SEO for each designed page (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.strings',
          label: 'Strings',
          description: 'The TR/EN UI strings the site renders (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.collections',
          label: 'Collections',
          description: 'Structured lists the site draws on — sectors, countries, FAQs, testimonials (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.blog',
          label: 'Blog',
          description: 'Blog posts and their translations (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.media',
          label: 'Media',
          description: 'Images and documents the site references (Phase B). APPROVE makes an asset publicly readable.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.navigation',
          label: 'Navigation',
          description: 'Header, footer and in-page navigation trees (Phase B). APPROVE publishes.',
          kind: 'screen',
          supportedActions: [
            PermissionAction.VIEW,
            PermissionAction.CREATE,
            PermissionAction.EDIT,
            PermissionAction.DELETE,
            PermissionAction.APPROVE,
          ],
        },
        {
          key: 'website.forms',
          label: 'Forms inbox',
          description:
            'Every submission the website delivered: payload, handler result, needs-attention filter. EDIT is the re-run of a FAILED submission; EXPORT is the CSV that leaves the building (audited, its own route).',
          kind: 'screen',
          supportedActions: [PermissionAction.VIEW, PermissionAction.EDIT, PermissionAction.EXPORT],
        },
        {
          key: 'website.settings',
          label: 'Settings',
          description: 'Per-form switches (active, autoresponder) and the module notification toggles. No routes in WP3a — the newsletter form is flipped by SQL until the screen lands.',
          kind: 'screen',
          supportedActions: [PermissionAction.VIEW, PermissionAction.EDIT],
        },
        {
          key: 'website.integrations',
          label: 'Integrations',
          description:
            'The page and its NON-secret fields: which secrets are set (has-chips), the second-human recipient, last test results. Writing, rotating or testing a secret is `website` MANAGE_KEYS, never this resource.',
          kind: 'screen',
          supportedActions: [PermissionAction.VIEW, PermissionAction.EDIT],
        },
      ],

      policies: [
        {
          key: 'website.secrets-are-manage-keys',
          label: 'Every secret write, rotate or test is MANAGE_KEYS on the module key',
          description:
            'Write token, test token, Turnstile secret and revalidate secret are written, rotated and tested only through routes gated on `website:MANAGE_KEYS`, which is seeded to no role. `website.integrations` EDIT reaches the non-secret fields of the same page and nothing else (ruling P3).',
        },
        {
          key: 'website.public-door-is-flag-gated',
          label: 'The public intake door answers 404 while WEBSITE_MODULE_ENABLED is off',
          description:
            'Every `website/v1` route sits behind `WebsiteModuleEnabledGuard`, which reads the flag from the environment on each request; the admin screens stay reachable so tokens can be provisioned before the flip (ruling P1).',
        },
      ],

      // The decorator on the controller is the authority; this list is what the
      // Roles screen shows so "why can everyone reach that?" has an answer.
      selfServiceRoutes: ['GET /website/status'],

      // Every route that exists carries its key from this commit on (P3), so
      // the flag is honest from day one — there is no un-keyed website route to
      // let an operator untick a resource and see nothing happen.
      resourcesEnforced: true,
    });
  }
}
```

**3d. `apps/backend/src/app.module.ts`** — after the line `import { TrainingLockGuard } from './modules/sales-training/training-lock.guard';` add:

```ts
import { WebsiteModule } from './modules/website/website.module';
```

and after the line `    SalesTrainingModule,` (the last entry of the `imports: [` array, immediately before `  ],`) add:

```ts
    // ALWAYS imported, whatever WEBSITE_MODULE_ENABLED says: the descriptor
    // must register on every boot or catalog conformance fails the container
    // (ruling P1). The flag is a request-time guard + a per-tick cron check.
    WebsiteModule,
```

**3e. `packages/permissions/src/keys.catalog.ts`** — replace the two adjacent lines `  'users',` and `  'whatsapp',` with:

```ts
  'users',
  // Website module (WP3a, 2026-09-19 — PRD §5.12). All ten keys registered on
  // day one, ruling P3: two screens ship in WP3a (forms inbox, integrations),
  // seven arrive with the Phase B CMS. `website` sorts after `users` and before
  // `whatsapp` ('e' < 'h'); the resources follow it directly, no hyphenated
  // sibling module to trip the '-' before '.' rule.
  'website',
  'website.blog',
  'website.collections',
  'website.forms',
  'website.integrations',
  'website.media',
  'website.navigation',
  'website.pages',
  'website.settings',
  'website.strings',
  'whatsapp',
```

and replace the line `export const PERMISSION_KEYS_HASH = 'f03cde11c29d49b07d9210646d400898cbce89d0';` with:

```ts
export const PERMISSION_KEYS_HASH = 'ba5427d7b0688c2b783cd58f3a21d384878363a4';
```

(sha1 of the 85 keys joined by `,` — recomputed against the real file; `repo-invariants.spec.ts` → `PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` takes the same digest. If that cell disagrees, the list order is wrong, not the hash.)

**3f. `packages/permissions/src/role-defaults.ts`**

Replace the line `export const ROLE_DEFAULTS_VERSION = 2;` with:

```ts
export const ROLE_DEFAULTS_VERSION = 3;
```

`'role-admin'` — after the block that ends with `      module: 'users',` / `      actions: ['VIEW', 'EDIT'],` / `    },` and before that array's closing `  ],` insert:

```ts
    // Website (WP3a, 2026-09-19, `since: 3`, ruling P3). Everything the module
    // registers EXCEPT APPROVE and MANAGE_KEYS: publishing a page and holding
    // the website's tokens/secrets are super-admin-only through the CASL bypass
    // (the marketing / whatsapp precedent). A MODULE row, so it reaches all
    // nine screens by inheritance (website-inheritance.unit.spec.ts).
    {
      module: 'website',
      actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'],
      since: 3,
    },
```

`'role-sales-manager'` — after the line `    { module: 'whatsapp-automations', actions: ['VIEW', 'EDIT'] },` inside that role's array and before its `  ],` insert:

```ts
    // Website forms inbox (WP3a, `since: 3`, rulings P3 + RC8): every sales
    // role that views inquiries sees what the website delivered. A
    // RESOURCE-key row — the first in this matrix — on purpose: the CMS and
    // the token screen are not sales work. The inbox has no row scope (ALL
    // only), so `sales-executive` and `sales-agent` — which carry the same row
    // below — see every submission, not "their own"; that is the ruling, and
    // the Roles UI can untick it per role.
    { module: 'website.forms', actions: ['VIEW'], since: 3 },
```

`'role-marketing-manager'` — after the line `    { module: 'whatsapp-automations', actions: ['VIEW', 'EDIT'] },` inside that role's array and before its `  ],` insert:

```ts
    // Website CMS (WP3a, `since: 3`, ruling P3): the six content screens at
    // VIEW/CREATE/EDIT — no DELETE, and no APPROVE, for the same reason as
    // `marketing` above: publishing is a super-admin act. Six RESOURCE rows
    // rather than one module row, because the module row would also hand over
    // the forms inbox (visitor PII) and the integrations page.
    { module: 'website.pages', actions: ['VIEW', 'CREATE', 'EDIT'], since: 3 },
    { module: 'website.strings', actions: ['VIEW', 'CREATE', 'EDIT'], since: 3 },
    { module: 'website.collections', actions: ['VIEW', 'CREATE', 'EDIT'], since: 3 },
    { module: 'website.blog', actions: ['VIEW', 'CREATE', 'EDIT'], since: 3 },
    { module: 'website.media', actions: ['VIEW', 'CREATE', 'EDIT'], since: 3 },
    { module: 'website.navigation', actions: ['VIEW', 'CREATE', 'EDIT'], since: 3 },
```

`'role-sales-agent'` — after the line `    { module: 'whatsapp-templates', actions: ['VIEW'] },` inside that role's array (the one that follows the `scope: 'ASSIGNED_TO_ME'` whatsapp block with `actions: ['VIEW', 'CREATE']`) and before its `  ],` insert:

```ts
    // Website forms inbox (WP3a, `since: 3`, RC8) — see role-sales-manager.
    // ALL scope: the resource supports no other, so an agent reads the whole
    // inbox; the lead itself stays ASSIGNED_TO_ME through `sales`.
    { module: 'website.forms', actions: ['VIEW'], since: 3 },
```

`'role-sales-executive'` — after the line `    { module: 'whatsapp-templates', actions: ['VIEW'] },` inside that role's array (the one that follows the whatsapp block with `actions: ['VIEW', 'CREATE', 'EDIT']` at `scope: 'ASSIGNED_TO_ME'`) and before its `  ],` insert:

```ts
    // Website forms inbox (WP3a, `since: 3`, RC8) — see role-sales-manager.
    { module: 'website.forms', actions: ['VIEW'], since: 3 },
```

Do NOT touch `MODULE_OPS` — `website` is never mapped through an `ACTIONS_*` constant (P3; CLAUDE.md "Never map an `ACTIONS_*` constant over a list of modules").

**3g. i18n** — `apps/frontend/src/messages/en.json`, inside `permissions.keys`, between `      "users": "Users",` and `      "whatsapp": "WhatsApp",` insert:

```json
      "website": "Website",
      "website__blog": "Website → Blog",
      "website__collections": "Website → Collections",
      "website__forms": "Website → Forms Inbox",
      "website__integrations": "Website → Integrations",
      "website__media": "Website → Media",
      "website__navigation": "Website → Navigation",
      "website__pages": "Website → Pages",
      "website__settings": "Website → Settings",
      "website__strings": "Website → Strings",
```

`apps/frontend/src/messages/tr.json`, same position (between `      "users": "Kullanıcılar",` and `      "whatsapp": "WhatsApp",`):

```json
      "website": "Web Sitesi",
      "website__blog": "Web Sitesi → Blog",
      "website__collections": "Web Sitesi → Koleksiyonlar",
      "website__forms": "Web Sitesi → Form Gelen Kutusu",
      "website__integrations": "Web Sitesi → Entegrasyonlar",
      "website__media": "Web Sitesi → Medya",
      "website__navigation": "Web Sitesi → Navigasyon",
      "website__pages": "Web Sitesi → Sayfalar",
      "website__settings": "Web Sitesi → Ayarlar",
      "website__strings": "Web Sitesi → Metinler",
```

(`labels.ts` maps a key to its message id with `replace(/\./g, '__')`; `not-authorized.spec.tsx` → `has a label for EVERY permission key, in both languages` diffs `PERMISSION_KEYS` against both files.)

**3h. Docs (same change set, P13; RC10 — Task 1 owns every count line and the role rows; Task 12 anchors on the exact strings written here and adds §5.12/§7.10/§4.4 prose only)**

- `CLAUDE.md`, line beginning `- **Permissions** — database-driven:` — replace `**75 grantable keys** (22 modules + 53 screen-level resources, all enforced)` with `**85 grantable keys** (23 modules + 62 screen-level resources, all enforced)`.
- `CLAUDE.md`, line beginning `- **A permission KEY is \`module\` or \`module.resource\`**` — replace `All 22 modules declare resources and all are` with `All 23 modules declare resources and all are`.
- `docs/PRD.md:265` (bullet beginning `- **A permission is a KEY, not just a module.**`): replace `**all 22 modules now declare them and all are \`resourcesEnforced: true\`** — 75 keys in total` with `**all 23 modules now declare them and all are \`resourcesEnforced: true\`** — 85 keys in total`.
- `docs/PRD.md:299`: replace `**22 permission modules + 53 screen-level resources = 75 grantable keys**` with `**23 permission modules + 62 screen-level resources = 85 grantable keys**`, and `Resources per module: Marketing 9, Projects 8,` with `Resources per module: Marketing 9, Website 9, Projects 8,`.
- `docs/PRD.md:301`: replace `- **OPERATIONS (17):** \`sales\`,` with `- **OPERATIONS (18):** \`sales\`,` and, after `` `call-center` (§5.10), `` (before `plus the three registered by \`whatsapp.module.ts\``), insert: `` `website` (§5.12, WP3a 2026-09-19 — VIEW, CREATE, EDIT, DELETE, EXPORT, APPROVE, MANAGE_KEYS; scope ALL; nine screen resources registered from day one with `resourcesEnforced: true`, two of them routed in WP3a — `website.forms`, `website.integrations` — and seven reserved for the Phase B CMS; MANAGE_KEYS is module-only and seeded to no role), ``.
- `docs/PRD.md:339` (`| \`admin\` |` row): before `` `users` **VIEW+EDIT only** `` insert `` `website` V/C/E/D/EXPORT (no APPROVE/`MANAGE_KEYS` — publishing and the website's tokens/secrets are super-admin-only; `since: 3`, WP3a — a MODULE row, so it reaches all nine `website.*` screens by inheritance); ``.
- `docs/PRD.md:340` (`| \`sales-manager\` |` row): before the trailing ` |` append ``; `website.forms` VIEW (`since: 3`, WP3a — the first RESOURCE-key row in the matrix: the forms inbox and nothing else of the website module; ALL scope, the resource supports no other)``.
- `docs/PRD.md:342` (`| \`marketing-manager\` |` row): before the trailing ` |` append ``; `website.pages`/`.strings`/`.collections`/`.blog`/`.media`/`.navigation` V/C/E (`since: 3`, WP3a — six resource-key rows; no DELETE, no APPROVE, and nothing on `website.forms`/`.settings`/`.integrations`)``.
- `docs/PRD.md:347` (`| \`sales-agent\` |` row): before the trailing ` |` append `` Plus `website.forms` VIEW (`since: 3`, WP3a, RC8 — the whole inbox at ALL scope, because the resource has no row scope; the lead itself stays ASSIGNED_TO_ME through `sales`).``
- `docs/PRD.md:348` (`| \`sales-executive\` |` row): before the trailing ` |` append `` Plus `website.forms` VIEW (`since: 3`, WP3a, RC8 — same shape as `sales-agent`: the whole inbox at ALL scope).``
- `docs/PRD.md:367` (bullet beginning `- **Built-in role DEFAULTS are versioned; the Roles UI is the truth`): after the sentence ending `the four mistakes that would otherwise only surface on a production deploy.` append: `` **Version 3 (WP3a, 2026-09-19)** added the website module's rows — `admin` `website` V/C/E/D/EXPORT, `marketing-manager` six CMS resource rows, `sales-manager`/`sales-executive`/`sales-agent` `website.forms` VIEW — the first resource-key rows the matrix carries (`website-inheritance.unit.spec.ts`).``
- `docs/PRD.md:484`: replace `22 modules + 53 resources = **75** at the end of W3 — Marketing 9, Projects 8,` with `23 modules + 62 resources = **85** since the website module (WP3a, 2026-09-19; 75 at the end of W3) — Marketing 9, Website 9, Projects 8,`.
- `docs/PRD.md:4911` (§12.3 bullet `- **Catalog labels for FUTURE keys.**`): replace `All 75 current keys have en + tr` with `All 85 current keys have en + tr`.
- Leave `docs/PRD.md:480` (the route census `decorated 841 · public 58 · self-service 73`) alone: Task 12 appends its "read the live numbers from the boot log" sentence there after every WP3a controller has landed.

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest test/permissions/website-conformance.spec.ts test/permissions/website-inheritance.unit.spec.ts src/modules/website/website-status.controller.spec.ts test/permissions/repo-invariants.spec.ts test/permissions/role-defaults.unit.spec.ts test/permissions/conformance.unit.spec.ts --maxWorkers=2
```

Expected: 6 suites pass. In particular `repo-invariants.spec.ts` → `PERMISSION_KEYS matches the registry` (`lists exactly the registered module and resource keys` — 85 — and `PERMISSION_KEYS_HASH is the sha1 the catalog endpoint serves` — `ba5427d7…`), `every @RequirePermission key is registered` (no new decorators yet) and `route annotation census` (`GET /website/status` counted under self-service, `undecorated === []`, every verb accounted for once); `role-defaults.unit.spec.ts` → `ROLE_DEFAULTS_VERSION equals the highest \`since\` in the matrix` (3), `declares no (role, module, action) cell twice`, `grants NO boundary cell to any built-in role` (`website` is not `roles`/`users`), and `names no (module, action) pair the module does not support` (resource keys `website.forms`, `website.pages`, … resolve through `registeredActionsFromSource`, which parses resource blocks).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/frontend && npx jest src/components/auth/not-authorized.spec.tsx src/config/route-permissions.spec.ts --maxWorkers=2
```

Expected: pass — every one of the ten new keys has an `en` and a `tr` `permissions.keys` label; `route-permissions.spec.ts` is unchanged (no website page exists yet — Task 11 adds the pages and their manifest lines together).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/backend
```

then, only after it finishes (one tsc at a time — the Mac hangs under parallel builds):

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/frontend
```

Expected: both clean. (`caslSubject: 'Website'` compiles only because 3a landed; a `PermissionKey` error on `'website.forms'` anywhere means 3e did not.)

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git add apps/backend/src/modules/website/website.module.ts apps/backend/src/modules/website/website-status.controller.ts apps/backend/src/modules/website/website-status.controller.spec.ts apps/backend/src/app.module.ts apps/backend/src/modules/permissions/casl-ability.factory.ts apps/backend/test/permissions/website-conformance.spec.ts apps/backend/test/permissions/website-inheritance.unit.spec.ts packages/permissions/src/keys.catalog.ts packages/permissions/src/role-defaults.ts apps/frontend/src/messages/en.json apps/frontend/src/messages/tr.json CLAUDE.md docs/PRD.md && git commit -m "feat(website): register the website permission module — ten keys, role defaults v3, GET /website/status

WebsiteModule is always imported (P1) and registers 'website' plus nine
screen resources with resourcesEnforced: true (P3); MANAGE_KEYS stays on
the module key and is seeded to no role. PERMISSION_KEYS grows to 85
(hash recomputed), ROLE_DEFAULTS_VERSION 2 -> 3 with explicit since: 3
rows for admin (module row, no APPROVE/MANAGE_KEYS), marketing-manager
(six CMS resource rows V/C/E) and sales-manager, sales-executive and
sales-agent (website.forms VIEW at ALL — RC8). AppSubject gains
'Website'; en/tr permissions.keys labels for all ten keys;
GET /website/status is @SelfService and reads WEBSITE_MODULE_ENABLED
per call (Task 2 moves the read behind the shared helper). Conformance
+ inheritance specs in the market-research shape; CLAUDE.md/PRD counts
and the §4.4 role rows synced (RC10).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

This commit lands before the Task 3 migration commit in branch history; P12's "migration pushed alone" is satisfied by Task 13 cherry-picking the migration commit onto `origin/main` first (RC14) — expected path, not a fallback.

---

---

