### Task 2: `WEBSITE_MODULE_ENABLED` — compose/env rows, request-time 404 guard, per-tick flag helper, deploy docs

Rulings applied: P1 (one always-imported module; flag read per request by a guard → 404, per tick by crons, reported by `GET /website/status`; compose defaults dev `true` / VPS `false`), P12 (the full prod-compose boot rehearsal belongs to Task 13), P13 (DEPLOYMENT.md env row + flip recipe in the same change set), RC1 (guard lives at `src/modules/website/guards/website-module-enabled.guard.ts`; the helper `websiteModuleEnabled(config)` in `src/modules/website/website-module-flag.ts` is the ONLY production file that names the variable; every cron imports the helper), RC10 (Task 2 owns the DEPLOYMENT `| Flags |` env row and the `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS` section; Task 12's docs guard pins these exact strings), RC13 (ping's `moduleEnabled: true` is a literal because this guard runs first; the flip recipe reads the second-human recipient back BEFORE the flip, since `ping` — and its `secondHumanConfigured` — is a 404 until the door is on), RC15 (every file printed in final form; anchors quoted by line text).

All paths are relative to the WP3a worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (branch `website/wp3a-intake` — RC17: every WP3a task executes from this worktree, never from the shared `main` checkout). The repo state this task starts from is Task 1's commit: `apps/backend/src/modules/website/` holds `website.module.ts`, `website-status.controller.ts` and its spec, nothing else.

**Files:**
- Create `apps/backend/src/modules/website/website-module-flag.ts`
- Create `apps/backend/src/modules/website/guards/website-module-enabled.guard.ts`
- Create `apps/backend/src/modules/website/guards/website-module-enabled.guard.spec.ts`
- Create `apps/backend/src/modules/website/website-env.spec.ts`
- Modify `apps/backend/src/modules/website/website-status.controller.ts` (Task 1 file; printed in full below — the inline `this.config.get<string>('WEBSITE_MODULE_ENABLED') === 'true'` becomes `websiteModuleEnabled(this.config)`)
- Modify `apps/backend/src/modules/website/website.module.ts` (Task 1 file; printed in full below — `providers: [],` becomes `providers: [WebsiteModuleEnabledGuard],` plus one import)
- Modify `docker-compose.vps.yml` — insert after the line `      PERMISSIONS_STRICT: ${PERMISSIONS_STRICT:-true}` (the last entry of the backend `environment:` list, before `    depends_on:`)
- Modify `docker-compose.yml` — insert after the line `      PERMISSIONS_STRICT: 'true'` (before `    ports:`)
- Modify `.env.example` — insert after the line `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` and its following blank line, before the line `# --- Permission scope enforcement ---`
- Modify `.env.production.example` — insert after the line `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` and its following blank line, before the line beginning `# ─── Permission scope enforcement`
- Modify `docs/DEPLOYMENT.md` — (a) one env-table row inserted directly after the row beginning `| Flags | \`PERMISSIONS_STRICT\` — **defaults \`true\`** (W4, 2026-09-15) |`; (b) one `###` section inserted directly before the line `### Verifying a deploy landed` (i.e. after the paragraph beginning `**Rehearsing the scripts without a VPS.**`)
- Test: `apps/backend/src/modules/website/guards/website-module-enabled.guard.spec.ts`, `apps/backend/src/modules/website/website-env.spec.ts`; Task 1's `apps/backend/src/modules/website/website-status.controller.spec.ts`, `apps/backend/test/permissions/website-conformance.spec.ts` and the existing `apps/backend/test/permissions/repo-invariants.spec.ts` must still pass unchanged

**Interfaces:**
- Consumes (Task 1): `WebsiteStatusController` (`apps/backend/src/modules/website/website-status.controller.ts`, `@Controller('website')`, `@SelfService() @Get('status')` returning `{ data: { enabled: boolean } }`, constructor `(private readonly config: ConfigService)`) and `WebsiteModule` (`apps/backend/src/modules/website/website.module.ts`, `@Module({ imports: [ConfigModule, PrismaModule, PermissionsModule], controllers: [WebsiteStatusController], providers: [] })` with the descriptor registered in the constructor); Task 1's `website-status.controller.spec.ts` (asserts `config.get` is called with `'WEBSITE_MODULE_ENABLED'` once per `status()` call — still true through the helper).
- Consumes (existing): `ConfigService` from `@nestjs/config` (global — `ConfigModule.forRoot({ isGlobal: true })` in `app.module.ts`); `CanActivate`, `ExecutionContext`, `Injectable`, `NotFoundException` from `@nestjs/common` (`new NotFoundException().getResponse()` is `{ message: 'Not Found', statusCode: 404 }` on the pinned `@nestjs/common ^10.3.0`); the `CanActivate` + `ConfigService` shape of `apps/backend/src/modules/iskur-bot/iskur-agent.guard.ts`; the per-tick `this.config.get<string>(WA_CAMPAIGN_ALLOWLIST_ENV)` shape of `apps/backend/src/modules/whatsapp/wa-campaign-runner.cron.ts` (`allowlist()`); the text-reading compose-pin shape of `apps/backend/src/modules/notifications/push/push-guards.spec.ts` (`readRoot`, the `both compose files map …` cell); jest `roots: ['<rootDir>/src', '<rootDir>/test']`, `testRegex: '.*\\.spec\\.ts$'` (`apps/backend/jest.config.js`); eslint `@typescript-eslint/no-unused-vars` with `argsIgnorePattern: '^_'` (root `.eslintrc.js`).
- Produces:
  - `export const WEBSITE_MODULE_ENABLED_ENV = 'WEBSITE_MODULE_ENABLED'` and `export function websiteModuleEnabled(config: ConfigService): boolean` in `apps/backend/src/modules/website/website-module-flag.ts`. THE one production file naming the variable (`website-env.spec.ts` fails on a second). Consumers: `website-status.controller.ts` (this task); Task 10's `website-alarms.cron.ts` and `website-purge.cron.ts` (both in `apps/backend/src/modules/website/`) begin every tick with `if (!websiteModuleEnabled(this.config)) return;` importing `{ websiteModuleEnabled } from './website-module-flag'` — never an inline `config.get('WEBSITE_MODULE_ENABLED')`.
  - `@Injectable() export class WebsiteModuleEnabledGuard implements CanActivate` in `apps/backend/src/modules/website/guards/website-module-enabled.guard.ts`, `canActivate(_context: ExecutionContext): boolean` — throws a bare `NotFoundException()` (body `{ message: 'Not Found', statusCode: 404 }`, nothing naming the module) unless the flag is the literal `'true'`; registered in `WebsiteModule.providers`. Public controllers use it FIRST in the guard list — `@Controller('website/v1') @Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)`: Task 4's `website-public.controller.ts` (import `./guards/website-module-enabled.guard`) and its `test/permissions/website-door-conformance.spec.ts` (import `../../src/modules/website/guards/website-module-enabled.guard`, asserts `GUARDS_METADATA` order `[WebsiteModuleEnabledGuard, WebsiteApiGuard]`), Task 8's `website-public-uploads.controller.ts` (`./guards/website-module-enabled.guard`), Task 9's `newsletter/website-public-newsletter.controller.ts` (`../guards/website-module-enabled.guard`). Because it runs before the token guard, an OFF door is indistinguishable from an unknown path and never reveals whether a token was valid; and because a request that reaches `ping` has passed it, Task 4's `WebsitePingService` reports `moduleEnabled: true` as a literal (RC13).
  - Compose contract (P1): `docker-compose.yml` → `WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-true}`; `docker-compose.vps.yml` → `WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-false}`; `.env.example` line `WEBSITE_MODULE_ENABLED=`; `.env.production.example` line `WEBSITE_MODULE_ENABLED=false`. Flipping on the VPS = edit `.env` + `docker compose -f docker-compose.vps.yml up -d backend` (container recreate; no rebuild). Task 13 §G runs the DEPLOYMENT.md recipe verbatim.
  - `docs/DEPLOYMENT.md` strings that Task 12's docs guard pins (RC10): the env-table row starting `| Flags | \`WEBSITE_MODULE_ENABLED\``, the heading `### Flipping \`WEBSITE_MODULE_ENABLED\` on the VPS`, and the command `docker compose -f docker-compose.vps.yml up -d backend` inside it. Task 12 adds its `### Booting the production compose file locally …` section AFTER this one and does not write a second env row. Task 13 §G runs the `### Flipping …` block verbatim (its pre-flip readout of `GET /api/website/integrations` and the `wa_campaigns` RUNNING count are part of the block).
  - The `website.module.ts` Task 4 starts from (RC15 — Task 4 replaces exactly these lines): the two consecutive import lines `import { WebsiteStatusController } from './website-status.controller';` / `import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';` and the block `@Module({ imports: [ConfigModule, PrismaModule, PermissionsModule], controllers: [WebsiteStatusController], providers: [WebsiteModuleEnabledGuard] })` (printed one property per line in 3d).

- [ ] **Step 1: Write the failing tests**

`apps/backend/src/modules/website/guards/website-module-enabled.guard.spec.ts`:

```ts
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { WebsiteModuleEnabledGuard } from './website-module-enabled.guard';
import { WEBSITE_MODULE_ENABLED_ENV, websiteModuleEnabled } from '../website-module-flag';

/**
 * The per-environment kill switch for the public website door (ruling P1).
 *
 * Two readers, one function: the guard on every `website/v1` route and the
 * per-tick check at the top of every website cron. Both go through
 * `websiteModuleEnabled(config)` so the door and the crons cannot disagree,
 * and both read the container's environment on EVERY call — never a value
 * captured at boot — so the flip is `up -d backend`, not a rebuild.
 *
 * 404, not 403 or 503: an OFF door must look exactly like a path that does
 * not exist, so a probe learns nothing (not even that a token was checked).
 */
describe('websiteModuleEnabled()', () => {
  const configOf = (value: string | undefined) => ({ get: jest.fn(() => value) });

  it("is true for the literal 'true' only", () => {
    expect(websiteModuleEnabled(configOf('true') as never)).toBe(true);
    for (const v of ['false', 'TRUE', '1', 'yes', '', undefined]) {
      expect({ v, enabled: websiteModuleEnabled(configOf(v) as never) }).toEqual({ v, enabled: false });
    }
  });

  it('reads WEBSITE_MODULE_ENABLED through ConfigService on every call (a per-tick read, never cached)', () => {
    const config = configOf('true');
    websiteModuleEnabled(config as never);
    websiteModuleEnabled(config as never);
    expect(config.get).toHaveBeenCalledTimes(2);
    expect(config.get).toHaveBeenCalledWith(WEBSITE_MODULE_ENABLED_ENV);
    expect(WEBSITE_MODULE_ENABLED_ENV).toBe('WEBSITE_MODULE_ENABLED');
  });
});

describe('WebsiteModuleEnabledGuard', () => {
  function build(value: string | undefined) {
    const config = { get: jest.fn(() => value) };
    return { guard: new WebsiteModuleEnabledGuard(config as never), config };
  }
  // The guard never touches the request: the flag is environment, not input.
  const ctx = {} as ExecutionContext;

  it('passes when the flag is on', () => {
    expect(build('true').guard.canActivate(ctx)).toBe(true);
  });

  it('404s when the flag is off or unset — a generic Not Found that names nothing', () => {
    for (const v of ['false', undefined, '']) {
      const { guard } = build(v);
      expect(() => guard.canActivate(ctx)).toThrow(NotFoundException);
      let body: { message?: string; statusCode?: number } = {};
      try {
        guard.canActivate(ctx);
      } catch (e) {
        body = (e as NotFoundException).getResponse() as { message?: string; statusCode?: number };
      }
      expect({ v, body }).toEqual({ v, body: { message: 'Not Found', statusCode: 404 } });
    }
  });

  it('consults the environment per request, not per construction', () => {
    const { guard, config } = build('true');
    expect(guard.canActivate(ctx)).toBe(true);
    config.get.mockReturnValue('false');
    expect(() => guard.canActivate(ctx)).toThrow(NotFoundException);
    expect(config.get).toHaveBeenCalledTimes(2);
  });
});
```

`apps/backend/src/modules/website/website-env.spec.ts` (text-reading pin, the `push-guards.spec.ts` / `wa-guards.spec.ts` compose-mapping shape):

```ts
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Source-reading guards for the website kill switch (WP3a, ruling P1).
 *
 * docker-compose.vps.yml passes env by an EXPLICIT `environment:` list, not an
 * env_file — a WEBSITE_MODULE_ENABLED line written to the production .env
 * reaches the backend ONLY if it is mapped there (and in docker-compose.yml
 * for local dev). WA_CAMPAIGN_ALLOWLIST (2026-09-11) and the VAPID trio both
 * relearned this; the website door must not. The DEFAULTS are the decision:
 * dev boots with the door open, the VPS boots with it shut until the WP3a
 * gate flips it (P1).
 */
const here = __dirname;
const repoRoot = join(here, '../../../../..');
const backendSrc = join(here, '../..');
const readRoot = (p: string) => readFileSync(join(repoRoot, p), 'utf8');

const KEY = 'WEBSITE_MODULE_ENABLED';
// The variable NAMED as a string literal — a `config.get('…')` read. Backticks
// are deliberately not matched: prose in a JSDoc may mention the flag; code
// may not read it anywhere but the helper.
const NAMES_KEY = new RegExp(`['"]${KEY}['"]`);

describe('WEBSITE_MODULE_ENABLED — env plumbing', () => {
  it('the dev compose maps it with default TRUE, the VPS compose with default FALSE', () => {
    expect(readRoot('docker-compose.yml')).toContain(`${KEY}: \${${KEY}:-true}`);
    expect(readRoot('docker-compose.vps.yml')).toContain(`${KEY}: \${${KEY}:-false}`);
  });

  it('both env examples document it', () => {
    for (const file of ['.env.example', '.env.production.example']) {
      const line = readRoot(file).split('\n').find((l) => l.startsWith(`${KEY}=`));
      expect({ file, documented: line !== undefined }).toEqual({ file, documented: true });
    }
    // The production template says the OFF value out loud rather than leaving
    // it blank: blank would read as "unset = compose default = false" only to
    // someone who has read the compose file.
    expect(readRoot('.env.production.example')).toContain(`${KEY}=false`);
  });

  it('exactly ONE production file names the variable: website-module-flag.ts', () => {
    // A second reader is a second place the flip can be got wrong. The guard,
    // the status route and every cron go through websiteModuleEnabled().
    const files: string[] = [];
    (function walk(dir: string) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts')) files.push(full);
      }
    })(backendSrc);
    const readers = files
      .filter((f) => NAMES_KEY.test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(backendSrc.length + 1))
      .sort();
    expect(readers).toEqual(['modules/website/website-module-flag.ts']);
  });

  it('DEPLOYMENT.md carries the env-table row and the flip recipe', () => {
    const doc = readRoot('docs/DEPLOYMENT.md');
    expect(doc).toContain(`| Flags | \`${KEY}\``);
    expect(doc).toContain(`### Flipping \`${KEY}\` on the VPS`);
    expect(doc).toContain('docker compose -f docker-compose.vps.yml up -d backend');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website --maxWorkers=2
```

Expected: `guards/website-module-enabled.guard.spec.ts` fails to compile (`Cannot find module './website-module-enabled.guard'` and `'../website-module-flag'`); `website-env.spec.ts` fails all four cells — the compose strings are absent, `.env.example` has no `WEBSITE_MODULE_ENABLED=` line, `readers` equals `['modules/website/website-status.controller.ts']` (Task 1's inline read), the DEPLOYMENT row and heading are absent. Task 1's `website-status.controller.spec.ts` still passes (2 cells).

- [ ] **Step 3: Implement**

**3a. `apps/backend/src/modules/website/website-module-flag.ts`** (new):

```ts
import { ConfigService } from '@nestjs/config';

/**
 * The website module's per-environment kill switch (WP3a, ruling P1).
 *
 * ONE reader of the variable name, by design (`website-env.spec.ts` fails on a
 * second): the request-time guard on every `website/v1` route, the
 * `GET /website/status` probe and the first line of every website cron tick
 * all call this. It reads the CONTAINER'S environment on every call — the
 * `WA_CAMPAIGN_ALLOWLIST` precedent (`wa-campaign-runner.cron.ts`) — so the
 * flip on the VPS is `.env` + `docker compose up -d backend`, no rebuild, and
 * during a deploy the old and new containers may hold different answers for
 * a minute, which is why nothing here is cached.
 *
 * Strictly the literal `true`: an unset value is OFF, the same posture as
 * `PERMISSIONS_STRICT` (`=== 'true'`), which is why both compose files carry
 * an explicit default (`true` in dev, `false` on the VPS).
 */
export const WEBSITE_MODULE_ENABLED_ENV = 'WEBSITE_MODULE_ENABLED';

export function websiteModuleEnabled(config: ConfigService): boolean {
  return config.get<string>(WEBSITE_MODULE_ENABLED_ENV) === 'true';
}
```

**3b. `apps/backend/src/modules/website/guards/website-module-enabled.guard.ts`** (new):

```ts
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { websiteModuleEnabled } from '../website-module-flag';

/**
 * 404s every route it guards while `WEBSITE_MODULE_ENABLED` is not `true`
 * (WP3a, ruling P1).
 *
 * Applied at CLASS level, FIRST in the `@UseGuards(...)` list of every public
 * `website/v1` controller — before the token guard — so an OFF door is
 * indistinguishable from a path that does not exist: no 401 to say "there is
 * a token check here", no 503 to say "there is a module here". The exception
 * is the bare `NotFoundException()` on purpose; a message naming the module
 * would undo that.
 *
 * The admin screens (`/website/*`, JWT + grant) are NOT behind this guard:
 * tokens, the Turnstile secret and the second-human recipient are provisioned
 * on the Integrations page BEFORE the flip, and the page reads
 * `GET /website/status` to draw its "public intake is OFF" banner.
 *
 * Reads the environment per request (the İŞKUR agent guard's ConfigService
 * shape), never at construction. The request itself is never inspected — the
 * flag is environment, not input — hence the unused context parameter.
 */
@Injectable()
export class WebsiteModuleEnabledGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(_context: ExecutionContext): boolean {
    if (!websiteModuleEnabled(this.config)) {
      throw new NotFoundException();
    }
    return true;
  }
}
```

**3c. `apps/backend/src/modules/website/website-status.controller.ts`** — final file (replaces Task 1's; the only changes are the added import, the `status()` body and the last sentence of the doc comment, so the controller no longer names the variable):

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SelfService } from '../permissions/decorators/self-service.decorator';
import { websiteModuleEnabled } from './website-module-flag';

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
 * `docker compose up -d backend` is the whole recipe (DEPLOYMENT.md). The read
 * goes through the shared `websiteModuleEnabled(config)` helper — the same one
 * `WebsiteModuleEnabledGuard` and the website crons call — so the guard on the
 * public door, the crons and this probe can never disagree for longer than one
 * request.
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
    return { data: { enabled: websiteModuleEnabled(this.config) } };
  }
}
```

(Task 1's `website-status.controller.spec.ts` is unchanged and still passes: the helper calls `config.get('WEBSITE_MODULE_ENABLED')` exactly once per `status()` call, so `toHaveBeenCalledTimes(2)` / `toHaveBeenCalledWith('WEBSITE_MODULE_ENABLED')` hold.)

**3d. `apps/backend/src/modules/website/website.module.ts`** — final file (replaces Task 1's; the only changes are the added import line `import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';` directly after the `WebsiteStatusController` import, and `providers: [],` → `providers: [WebsiteModuleEnabledGuard],`). The guard is a provider of THIS module (the `call-center.module.ts` rule for `CallAgentToolGuard` / `HipcallWebhookGuard`) so DI resolves its `ConfigService` for every later public controller that lists it in `@UseGuards(...)`. Everything else — the doc comment and the constructor's `registry.register({...})` literal — stays byte-for-byte as Task 1 wrote it (fixed Task 4 replaces exactly the two import lines and the `@Module({...})` block below, and never the literal). Literal style is load-bearing, as in Task 1: `registry-from-source.ts` and `repo-invariants.spec.ts` regex-read `name: '…'`, the FIRST `supportedActions: [PermissionAction.X, …]`, each `resources: [{ key: '…', kind: '…', supportedActions: […] }]` block, `policies: [{ key: '…' }]` and `resourcesEnforced: true` from the SOURCE, and Task 1's `website-conformance.spec.ts` pins the literal `selfServiceRoutes: ['GET /website/status']`.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PermissionAction, PermissionScope } from '@prisma/client';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionRegistry } from '../permissions/registry/permission-registry';
import { WebsiteStatusController } from './website-status.controller';
import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';

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
  providers: [WebsiteModuleEnabledGuard],
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

**3e. `docker-compose.vps.yml`** — directly after the line `      PERMISSIONS_STRICT: ${PERMISSIONS_STRICT:-true}` (the last entry of the backend service's `environment:` list; the next line is `    depends_on:`) insert:

```yaml
      # Website module kill switch (WP3a, 2026-09-19 — DEPLOYMENT.md "Flags"
      # row + "Flipping WEBSITE_MODULE_ENABLED on the VPS"). Default OFF here:
      # the public intake door (`/api/website/v1/*`) answers 404 and the
      # website crons skip their tick until the owner sets
      # WEBSITE_MODULE_ENABLED=true in .env and recreates the backend
      # (`docker compose -f docker-compose.vps.yml up -d backend`). The admin
      # screens stay reachable either way, so tokens are provisioned BEFORE the
      # flip. Read per request / per tick — no rebuild, nothing else restarts.
      # Mapped here because this compose passes env by an explicit list.
      WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-false}
```

**3f. `docker-compose.yml`** — directly after the line `      PERMISSIONS_STRICT: 'true'` (the next line is `    ports:`) insert:

```yaml
      # Website module kill switch (WP3a). Default ON locally so the intake door
      # and its crons work out of the box; the VPS compose defaults it OFF.
      # `apps/backend/.env` is not read by this container, so the value must
      # be listed here to reach the backend at all.
      WEBSITE_MODULE_ENABLED: ${WEBSITE_MODULE_ENABLED:-true}
```

**3g. `.env.example`** — after the line `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` and the blank line that follows it, directly before the line `# --- Permission scope enforcement ---`, insert (the block ends with its own blank line so the following section keeps one):

```dotenv
# --- Website module (public intake door for jobsadmire.com) ---
# Kill switch for /api/website/v1/* and the website crons (WP3a). Only the
# literal "true" enables it; anything else (or blank) is OFF and the door
# answers 404. Local dev: docker-compose.yml defaults it to true, so leave
# blank unless you want the door shut. Tokens/secrets are NOT env — they live
# encrypted in the Integrations settings row (Website → Integrations).
WEBSITE_MODULE_ENABLED=

```

**3h. `.env.production.example`** — after the line `NEXT_PUBLIC_TURNSTILE_SITE_KEY=` and the blank line that follows it, directly before the line beginning `# ─── Permission scope enforcement`, insert:

```dotenv
# ─── Website module (public intake door for jobsadmire.com) ──────────────────
# Kill switch for /api/website/v1/* and the website crons (WP3a). OFF until the
# WP3a gate passes: set to true, then `docker compose -f docker-compose.vps.yml
# up -d backend` — the flag is read per request, so a recreate is the whole
# flip (no rebuild). Only the literal "true" enables it. Provision the write/
# test tokens, the Turnstile secret and the second-human recipient on
# Website → Integrations BEFORE flipping; the admin screens work either way.
WEBSITE_MODULE_ENABLED=false

```

**3i. `docs/DEPLOYMENT.md`** — two insertions.

(a) In the environment-variable table, directly after the row that begins `| Flags | \`PERMISSIONS_STRICT\` — **defaults \`true\`** (W4, 2026-09-15) |` (and before the row beginning `| Frontend | \`NEXT_PUBLIC_API_URL\``) insert this single row:

```markdown
| Flags | `WEBSITE_MODULE_ENABLED` — **defaults `false`** on the VPS (WP3a, 2026-09-19) | The per-module kill switch for the public website intake door (PRD §5.12/§7.10). Mapped in `docker-compose.vps.yml` as `${WEBSITE_MODULE_ENABLED:-false}` and in `docker-compose.yml` as `${WEBSITE_MODULE_ENABLED:-true}` (pinned by `website-env.spec.ts`, which also fails if a second production file ever names the variable — `website-module-flag.ts` is the one reader). Only the literal `true` enables it. OFF = every `/api/website/v1/*` route answers a generic **404** (`WebsiteModuleEnabledGuard`, read per request, first in the guard chain so a probe cannot tell a shut door from an unknown path) and every website cron returns at the top of its tick; the admin screens (`/admin/website/**`), `GET /api/website/status` (`{ data: { enabled } }`) and the permission catalog are unaffected, so tokens and secrets are provisioned BEFORE the flip. `WebsiteModule` is ALWAYS imported — its permission descriptor must register on every boot or catalog conformance fails the container — which is why this is a request-time guard and not a module-shape switch. Flip recipe: "Flipping `WEBSITE_MODULE_ENABLED` on the VPS" below |
```

(b) Directly before the line `### Verifying a deploy landed` (i.e. after the paragraph that begins `**Rehearsing the scripts without a VPS.**` and its trailing blank line) insert this section, followed by one blank line (Task 12 inserts its `### Booting the production compose file locally …` section directly after it, still before `### Verifying a deploy landed`):

````markdown
### Flipping `WEBSITE_MODULE_ENABLED` on the VPS

The flag is evaluated inside the container from its environment on every request and every cron tick, and the VPS compose passes env by an explicit `environment:` list — so a `.env` edit changes nothing until the backend container is RECREATED. The recreate is the whole flip: no rebuild, no deploy, nothing else restarts. It does restart the backend (30–60 s of 502 on `/api/*`; an in-flight Bull batch is killed), so it is done under the same rules as a deploy.

**Before the first flip (the WP3a gate, in this order):**

1. The WP3a code is deployed and healthy — verify by artifact, not `git rev-parse` ("Verifying a deploy landed" below).
2. The write token, the test token, the website's Turnstile secret and the second-human recipient are saved on **Website → Integrations** (`/admin/website/integrations`; the page needs `website.integrations` VIEW/EDIT, every secret route needs `website:MANAGE_KEYS`, which is seeded to no role — super-admin only). Read them back before flipping, because `ping` is a 404 until the door is on: signed in, `GET /api/website/integrations` must show `hasWriteToken: true`, `hasTestToken: true`, `hasTurnstileSecret: true` and a non-null `secondHumanEmail` — the second human is the recipient of every website alarm and has no default. The Integrations page shows the same facts as chips plus the "public intake is OFF" banner (`GET /api/website/status` → `{ data: { enabled: false } }`).
3. No WhatsApp campaign is `RUNNING` and neither poller is mid-deploy (the recreate kills in-flight Bull batches):

```bash
ssh jobsadmire_portal "docker exec jobsadmire_ops_postgres psql -U jobsadmire_ops -d jobsadmire_operations -tAc \"select count(*) from wa_campaigns where status = 'RUNNING'\"; tail -3 /var/www/html/jobsadmire-operations/deploy.log"
```

Expected: `0`, and the last deploy.log line is a finished deploy (`Deploy finished for <sha>`), not one in progress.

**The flip:**

```bash
ssh jobsadmire_portal "cd /var/www/html/jobsadmire-operations && \
  (grep -q '^WEBSITE_MODULE_ENABLED=' .env \
     && sed -i 's/^WEBSITE_MODULE_ENABLED=.*/WEBSITE_MODULE_ENABLED=true/' .env \
     || printf '\n# Website intake door (PRD §5.12) — flipped after the WP3a gate\nWEBSITE_MODULE_ENABLED=true\n' >> .env) && \
  grep -n '^WEBSITE_MODULE_ENABLED=' .env && \
  docker compose -f docker-compose.vps.yml up -d backend && \
  sleep 20 && docker exec jobsadmire_ops_backend printenv WEBSITE_MODULE_ENABLED && \
  curl -s -o /dev/null -w 'health %{http_code}\n' http://localhost:4001/api/health && \
  curl -s -o /dev/null -w 'ping-no-token %{http_code}\n' http://localhost:4001/api/website/v1/ping"
```

Expected: the `.env` line, `true` from `printenv`, `health 200`, `ping-no-token 401` — the door is on and fails closed without a token (`WebsiteApiGuard`); while the flag is `false` the same call is `404`. `GET /api/website/status` (signed in) now answers `{ data: { enabled: true } }` and the Integrations banner disappears. Then prove the door: `GET /api/website/v1/ping` with each token class answers `{ tokenClass, moduleEnabled: true, captcha: 'configured', secondHumanConfigured: true, trippedForms: [], … }` (`secondHumanConfigured` must be `true` — step 2 above is what makes it so), and one live autoresponder is received — the WP3a gate record holds the evidence.

**Shutting the door** (an incident, or a rollback of the website's WP2 wiring): set `false` and run the same `up -d backend` — every `/api/website/v1/*` route answers 404 again, the website crons go quiet at the top of their next tick, the admin inbox and the Integrations page keep working, and nothing already stored is touched. If the line is missing from `.env` the compose default (`false`) applies; every deploy does `docker compose up -d`, which re-reads `.env`, so the value persists across deploys — it does not survive `.env` being recreated from `.env.production.example`, which ships the line as `false`.
````

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website test/permissions/website-conformance.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2
```

Expected: `guards/website-module-enabled.guard.spec.ts` (5 cells), `website-env.spec.ts` (4 cells), `website-status.controller.spec.ts` (2 cells), `website-conformance.spec.ts` and `repo-invariants.spec.ts` all pass; the `exactly ONE production file names the variable` cell lists only `modules/website/website-module-flag.ts`.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && docker compose -f docker-compose.vps.yml config 2>/dev/null | grep -n 'WEBSITE_MODULE_ENABLED' ; docker compose config 2>/dev/null | grep -n 'WEBSITE_MODULE_ENABLED'
```

Expected: `WEBSITE_MODULE_ENABLED: "false"` from the VPS file and `WEBSITE_MODULE_ENABLED: "true"` from the dev file (interpolated defaults; `config` renders without starting anything — if `.env` at the repo root sets the variable, that value shows instead, which is fine). The full P12 boot rehearsal (`docker-compose.vps.yml` up with the flag `false` AND `true`, `/api/health` 200 both ways) is Task 13's job, not this commit's.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/backend && npx eslint apps/backend/src/modules/website
```

Expected: both clean (the `_context` parameter satisfies `argsIgnorePattern: '^_'`).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git add apps/backend/src/modules/website/website-module-flag.ts apps/backend/src/modules/website/guards/website-module-enabled.guard.ts apps/backend/src/modules/website/guards/website-module-enabled.guard.spec.ts apps/backend/src/modules/website/website-env.spec.ts apps/backend/src/modules/website/website-status.controller.ts apps/backend/src/modules/website/website.module.ts docker-compose.vps.yml docker-compose.yml .env.example .env.production.example docs/DEPLOYMENT.md && git commit -m "feat(website): WEBSITE_MODULE_ENABLED kill switch — compose rows, request-time 404 guard, per-tick helper

One reader of the variable (website-module-flag.ts, pinned by spec):
WebsiteModuleEnabledGuard (guards/) 404s every website/v1 route while
the flag is not 'true', GET /website/status reports it through the same
helper, and the website crons will call it at the top of each tick (P1).
docker-compose.yml defaults it true, docker-compose.vps.yml false; both
.env examples document it; DEPLOYMENT.md gains the Flags env-table row
and the 'Flipping WEBSITE_MODULE_ENABLED on the VPS' recipe (up -d
backend, no rebuild). No module-shape gating: WebsiteModule stays
always-imported so catalog conformance holds in both flag states.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

---

