### Task 4: WebsiteIntegrationConfigService, WebsiteApiGuard, the public door skeleton (`GET /website/v1/ping`) and the `website/integrations` admin controller

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations), on the WP3a branch/worktree after Tasks 1–3 have landed. Rulings applied: P1 (the public door sits behind `WebsiteModuleEnabledGuard` first), P2 (the `test` class is a dry run — the guard stamps it, the handler task honours it), P3 (page = `website.integrations` VIEW/EDIT; every secret door = `website` MANAGE_KEYS; `@AuditEntity` on every write), P7 (DB-only `*Enc` singleton, `has*` public shape, per-secret try/catch decrypt, 60 s cache, rotate keeps the previous WRITE token for 24 h, guard order write → test → previous-write with `timingSafeEqual`, `req.websiteTokenClass`), P9 (second-human recipient lives on the row), P11 as amended by RC13 (ping shape gains `secondHumanConfigured`), RC1 (this task's real consumers/producers: Task 2 = flag guard at `guards/website-module-enabled.guard.ts`, Task 3 = Prisma + `@jobsadmire/constants` form keys, Task 6 = the forms route on the public controller and the captcha reader, Task 10 = edits `WebsitePingService` to inject `WebsiteAbuseService`, Task 11 = the frontend client, Task 13 = the gate), RC2 (three Bearer classes, local type `WebsiteBearerClass`, Prisma enum `WebsiteTokenClass` untouched), RC6 (no trip-key prefix here; `trippedForms` is `[]` until Task 10), RC9 (`POST /website/integrations/rotate/:name` → `{ name, secret, previousExpiresAt }`, `POST …/test` → `{ ok, error }`, settings body nullable), RC15 (every file printed in final form; anchors quoted by line text; Task 1's conformance `CONTROLLERS` extended here).

**Files:**
- Create `apps/backend/src/modules/website/website.constants.ts`
- Create `apps/backend/src/modules/website/website-integration-config.service.ts`
- Create `apps/backend/src/modules/website/website-integration-config.service.spec.ts`
- Create `apps/backend/src/modules/website/dto/website-integrations.dto.ts`
- Create `apps/backend/src/modules/website/guards/website-api.guard.ts`
- Create `apps/backend/src/modules/website/guards/website-api.guard.spec.ts`
- Create `apps/backend/src/modules/website/decorators/token-class.decorator.ts`
- Create `apps/backend/src/modules/website/website-ping.service.ts`
- Create `apps/backend/src/modules/website/website-ping.service.spec.ts`
- Create `apps/backend/src/modules/website/website-public.controller.ts`
- Create `apps/backend/src/modules/website/website-integrations.controller.ts`
- Create `apps/backend/test/permissions/website-door-conformance.spec.ts`
- Modify `apps/backend/src/modules/website/website.module.ts` (Task 1's file, as Task 2 left it): five import lines inserted after the line `import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';` and the two decorator lines `  controllers: [WebsiteStatusController],` / `  providers: [WebsiteModuleEnabledGuard],` replaced (Step 3 prints the whole `@Module({...})` block this task leaves behind); the `imports:` line and the constructor's `registry.register({...})` literal are not touched (`registry-from-source.ts` regex-reads the latter)
- Modify `apps/backend/test/permissions/website-conformance.spec.ts` (Task 1's spec): the import line `import { WebsiteStatusController } from '../../src/modules/website/website-status.controller';` and the line `const CONTROLLERS = [WebsiteStatusController];` (RC15 — every task that adds a controller extends this array)
- Test: the three `*.spec.ts` under `src/modules/website/` created here, `test/permissions/website-door-conformance.spec.ts`, Task 1's `test/permissions/website-conformance.spec.ts`, Task 2's `src/modules/website/website-env.spec.ts` (its "exactly ONE production file names the variable" cell must stay green — nothing in this task writes the quoted literal) and `test/permissions/repo-invariants.spec.ts` (route census + catalog hash)

**Interfaces:**
- Consumes (Task 1): `WebsiteModule` at `src/modules/website/website.module.ts` whose constructor registers `name: 'website'` with `PermissionAction.MANAGE_KEYS` in `supportedActions` and the resource `website.integrations` supporting `VIEW` + `EDIT` (P3, RC8); `'Website'` in `AppSubject`; the ten keys in `PERMISSION_KEYS`; `test/permissions/website-conformance.spec.ts` with `const CONTROLLERS = [WebsiteStatusController];`.
- Consumes (Task 2, RC1): `WebsiteModuleEnabledGuard` exported from `src/modules/website/guards/website-module-enabled.guard.ts` (ConfigService per request → generic 404 when the flag is not `'true'`, P1), already in `WebsiteModule.providers`.
- Consumes (Task 3, RC1): Prisma model `WebsiteIntegrationConfig` (`@@map("website_integration_config")`) with exactly these columns: `id`, `writeTokenEnc String?`, `previousWriteTokenEnc String?`, `previousWriteTokenExpiresAt DateTime?`, `testTokenEnc String?`, `turnstileSecretEnc String?`, `revalidateSecretEnc String?`, `secondHumanEmail String?`, `secondHumanName String?`, `lastTestedAt DateTime?`, `lastTestOk Boolean?`, `lastTestError String? @db.Text`, `updatedById String?`, `createdAt`, `updatedAt` (P7, P9); model `WebsiteFormSubmission` with `isTest Boolean @default(false)` and `createdAt DateTime`; Prisma enum `WebsiteTokenClass { WRITE, TEST, PREVIOUS_WRITE }` (RC2 — the enum keeps that name; this task's local union is `WebsiteBearerClass`).
- Consumes (repo, verified): `PrismaService` (`src/prisma/prisma.service.ts`), `encrypt(plaintext, key)` / `decrypt(encrypted, key)` (`src/common/utils/encryption.util.ts` — `decrypt` throws `Error('Invalid encrypted data format')` on a non-ciphertext), `Public` / `IS_PUBLIC_KEY` (`src/common/decorators/public.decorator.ts`), `RequirePermission` / `PERMISSION_KEY` / `RequiredPermission` (`src/modules/permissions/decorators/require-permission.decorator.ts`), `AuditEntity` (`src/common/decorators/audit-entity.decorator.ts`), `CurrentUser` (`src/common/decorators/current-user.decorator.ts`), `AuthenticatedUser { userId; email; roleId; roleSlug }` (`src/modules/auth/interfaces/authenticated-user.interface.ts`), `PermissionConformanceService(discovery, MetadataScanner, Reflector, registry, config).scanClasses(classes, strict) → { report: { decorated, public, selfService, undecorated }, errors }` (`src/modules/permissions/permission-conformance.service.ts:157-241`; class-level `@Public()` is read through `getAllAndOverride([handler, controller])` at :186), `registryFromSource(path)` (`test/permissions/registry-from-source.ts:59` → `PermissionRegistry` with `get`, `getResource`, `descendantsOf`, `keys`), `GUARDS_METADATA = '__guards__'` (`@nestjs/common/constants`, Nest 10.4.22), the global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` (`src/main.ts:58-66`), global prefix `api` (`src/main.ts:55`). Precedents copied: `CallAgentToolGuard` (`src/modules/call-center/guards/call-agent-tool.guard.ts` — Bearer regex, `safeEqual`, fail-closed under 20 chars), `CallCenterConfigService` (`src/modules/call-center/call-center-config.service.ts` — `getOrCreate`, `publicShape` destructure, 60 s cache, `rotateSecret` prefix + `randomBytes(24)`), `WaConfigService.resolveWebhookSecrets` (`src/modules/whatsapp/wa-config.service.ts:253-275` — per-secret try/catch decrypt, WARN by name only), `GoogleWorkspaceConfigService.testConnection` (`src/modules/integrations/google-workspace-config.service.ts:279-301` — never throws, persists `lastTestedAt/lastTestOk/lastTestError/updatedById`), `CaptchaService` (`src/modules/careers-public/captcha.service.ts:40-48` — `fetch` + `AbortSignal.timeout(10_000)` against Turnstile siteverify; Node 20 per `Dockerfile`).
- Produces (for Tasks 6–13):
  - `website.constants.ts`: `type WebsiteBearerClass = 'write' | 'test' | 'previous-write'` (RC2), `WEBSITE_BEARER_CLASSES` (readonly tuple), `PRISMA_TOKEN_CLASS_BY_BEARER: Record<WebsiteBearerClass, WebsiteTokenClass>` (`write → WRITE`, `test → TEST`, `previous-write → PREVIOUS_WRITE` — Task 6's core maps the stamped class to `WebsiteFormSubmission.tokenClass` with it, RC2), `WEBSITE_TOKEN_MIN_LENGTH = 20`, `PREVIOUS_WRITE_TOKEN_WINDOW_MS = 86_400_000`, `WEBSITE_ROTATABLE_SECRETS = ['writeToken', 'testToken'] as const`, `type WebsiteRotatableSecret`, `isWebsiteRotatableSecret(v: string): v is WebsiteRotatableSecret`. NO form-key list and NO trip-key prefix here: `WEBSITE_FORM_KEYS` / `WebsiteFormKey` / `WEBSITE_FORM_KIND_BY_KEY` / `isWebsiteFormKey` come from `@jobsadmire/constants` (Task 3, RC1) and the abuse keys belong to Task 10's `WebsiteAbuseService` (RC6).
  - `WebsiteIntegrationConfigService` (exported from `WebsiteModule`): `getOrCreate(): Promise<WebsiteIntegrationConfig>`, `publicShape(): Promise<WebsiteIntegrationPublicShape>`, `resolveSecrets(): Promise<WebsiteResolvedSecrets>` (60 s in-process cache, per-secret try/catch decrypt), `invalidateCache(): void`, `updateSettings(dto: UpdateWebsiteIntegrationSettingsDto, user: AuthenticatedUser): Promise<WebsiteIntegrationPublicShape>`, `updateKeys(dto: UpdateWebsiteIntegrationKeysDto, user): Promise<WebsiteIntegrationPublicShape>`, `rotateSecret(name: string, user): Promise<WebsiteRotatedSecret>` (400 on an unknown name), `testConnection(user): Promise<WebsiteConnectionTestResult>`.
  - `WebsiteResolvedSecrets = { writeToken: string | null; previousWriteToken: string | null; previousWriteTokenExpiresAt: Date | null; testToken: string | null; turnstileSecret: string | null; revalidateSecret: string | null }` — Task 6's `WebsiteCaptchaService` reads `(await this.config.resolveSecrets()).turnstileSecret` (P6).
  - `WebsiteIntegrationPublicShape = { id; hasWriteToken; hasPreviousWriteToken; previousWriteTokenExpiresAt: Date | null; hasTestToken; hasTurnstileSecret; hasRevalidateSecret; secondHumanEmail: string | null; secondHumanName: string | null; lastTestedAt: Date | null; lastTestOk: boolean | null; lastTestError: string | null; updatedById: string | null; createdAt: Date; updatedAt: Date }` — Task 11's `WebsiteIntegrationConfig` client type field for field (dates arrive as ISO strings).
  - `WebsiteRotatedSecret = { name: WebsiteRotatableSecret; secret: string; previousExpiresAt: string | null }` and `WebsiteConnectionTestResult = { ok: boolean; error: string | null }` (RC9).
  - `WebsiteApiGuard` (sets `req.websiteTokenClass: WebsiteBearerClass`, order write → test → previous-write, stamped verbatim — RC2/P7), `WebsiteRequest extends express.Request { websiteTokenClass?: WebsiteBearerClass }`, `@TokenClass()` param decorator (throws 401 if the guard did not run — never defaults to `'write'`).
  - `WebsitePublicController` (`@Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard) @Controller('website/v1')`, constructor `(pingService: WebsitePingService)`) — Task 6 adds `POST forms/:formKey` to THIS class (RC1/RC3), adding `private readonly forms: WebsiteFormsService` as the second constructor argument and reading the class through `@TokenClass() tokenClass: WebsiteBearerClass` (never `req.websiteTokenClass ?? 'write'` — the decorator throws when the guard did not run) and the raw request through `@Req() req: WebsiteRequest`; the core maps the class to the row with `PRISMA_TOKEN_CLASS_BY_BEARER[tokenClass]` (RC2). Task 8's `WebsitePublicUploadsController` (`website/v1/uploads`) and Task 9's `WebsitePublicNewsletterController` (`website/v1/newsletter`) are sibling public controllers carrying the same three class-level decorators (RC3).
  - `WebsitePingService(prisma: PrismaService, config: WebsiteIntegrationConfigService).ping(tokenClass: WebsiteBearerClass): Promise<WebsitePingResult>` where `WebsitePingResult = { tokenClass; moduleEnabled: true; captcha: 'configured' | 'missing'; secondHumanConfigured: boolean; trippedForms: string[]; lastSubmissionAt: string | null; bucketPolicy: null; lastCrmFeedAt: null }` (P11 as amended by RC13). In THIS commit `trippedForms` is the literal `[]`; Task 10 (RC1/RC6) adds `private readonly abuse: WebsiteAbuseService` as the third constructor argument and replaces that literal with `await this.abuse.trippedForms()` — the ping spec below is written so Task 10 only has to add one mock.
  - HTTP (all under the `api` prefix, bodies wrapped `{ data }`): `GET /api/website/v1/ping` (Bearer write | test | previous-write) → `{ data: WebsitePingResult }`; `GET /api/website/integrations` (`website.integrations` VIEW); `PATCH /api/website/integrations` (`website.integrations` EDIT, body `{ secondHumanEmail?: string | null; secondHumanName?: string | null }` — `undefined` keeps, `null`/`''` clears); `PATCH /api/website/integrations/keys` (`website` MANAGE_KEYS, body `{ turnstileSecret?: string; revalidateSecret?: string }` — `undefined` keeps, `''` clears); `POST /api/website/integrations/rotate/:name` (`website` MANAGE_KEYS, `:name` ∈ `writeToken | testToken`) → `{ data: WebsiteRotatedSecret }`; `POST /api/website/integrations/test` (`website` MANAGE_KEYS) → `{ data: WebsiteConnectionTestResult }` (RC9 — Task 11's `lib/api/website.ts` targets exactly these paths and shapes; Task 13's gate reads `data.secondHumanConfigured === true` from ping before the flip).

- [ ] **Step 1: Write the failing tests**

`apps/backend/src/modules/website/website-integration-config.service.spec.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { PREVIOUS_WRITE_TOKEN_WINDOW_MS } from './website.constants';
import { encrypt } from '../../common/utils/encryption.util';

const KEY = 'test-encryption-key-0123456789';
const USER = { userId: 'u1', email: 'a@b.c', roleId: 'r1', roleSlug: 'super-admin' };

/**
 * WP3a Task 4 (rulings P7, P9, RC9). The website's Bearer tokens and the
 * Turnstile secret are the marketing site's only key to this API. Pinned:
 *  - no *Enc column ever leaves the public shape;
 *  - rotate returns the value ONCE, prefixed by class, keeps the previous WRITE
 *    token for a 24 h window (the Vercel redeploy gap) and reports when that
 *    window closes; an unknown name is a 400, not a silent no-op;
 *  - the hot path reads the row once per 60 s, and every write invalidates;
 *  - an undecryptable secret is null + one WARN, never a throw (a rotated
 *    ENCRYPTION_KEY must not 500 every public POST);
 *  - updateKeys: undefined leaves, '' clears, a value encrypts;
 *  - updateSettings: undefined leaves, null and '' clear, a value trims;
 *  - testConnection never throws and persists lastTested*.
 */
describe('WebsiteIntegrationConfigService', () => {
  function build(stored: Record<string, unknown> = {}) {
    const row: Record<string, unknown> = {
      id: 'cfg1',
      writeTokenEnc: null,
      previousWriteTokenEnc: null,
      previousWriteTokenExpiresAt: null,
      testTokenEnc: null,
      turnstileSecretEnc: null,
      revalidateSecretEnc: null,
      secondHumanEmail: null,
      secondHumanName: null,
      lastTestedAt: null,
      lastTestOk: null,
      lastTestError: null,
      updatedById: null,
      createdAt: new Date('2026-09-19'),
      updatedAt: new Date('2026-09-19'),
      ...stored,
    };
    const prisma = {
      websiteIntegrationConfig: {
        findFirst: jest.fn(async () => row),
        create: jest.fn(async () => row),
        update: jest.fn(async (args: { data: Record<string, unknown> }) => {
          Object.assign(row, args.data);
          return row;
        }),
      },
    };
    const config = { get: (k: string) => (k === 'ENCRYPTION_KEY' ? KEY : undefined) };
    const svc = new WebsiteIntegrationConfigService(prisma as never, config as never);
    return { svc, row, prisma };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('never leaks *Enc columns from the public shape', async () => {
    const { svc } = build({
      writeTokenEnc: encrypt('wsw_' + 'a'.repeat(48), KEY),
      testTokenEnc: encrypt('wst_' + 'b'.repeat(48), KEY),
      turnstileSecretEnc: encrypt('0x4AAA-secret', KEY),
      secondHumanEmail: 'owner@jobsadmire.com',
    });
    const shape = await svc.publicShape();
    const serialized = JSON.stringify(shape);
    expect(serialized).not.toContain('Enc');
    expect(serialized).not.toContain('wsw_');
    expect(serialized).not.toContain('0x4AAA');
    expect(shape).toEqual({
      id: 'cfg1',
      hasWriteToken: true,
      hasPreviousWriteToken: false,
      previousWriteTokenExpiresAt: null,
      hasTestToken: true,
      hasTurnstileSecret: true,
      hasRevalidateSecret: false,
      secondHumanEmail: 'owner@jobsadmire.com',
      secondHumanName: null,
      lastTestedAt: null,
      lastTestOk: null,
      lastTestError: null,
      updatedById: null,
      createdAt: new Date('2026-09-19'),
      updatedAt: new Date('2026-09-19'),
    });
  });

  it('rotateSecret(writeToken) returns the value once, wsw_-prefixed, keeps the previous for one 24 h window and says when it closes', async () => {
    const { svc, row } = build();
    const first = await svc.rotateSecret('writeToken', USER);
    expect(first).toEqual({ name: 'writeToken', secret: expect.stringMatching(/^wsw_[0-9a-f]{48}$/), previousExpiresAt: null });
    expect(row.previousWriteTokenEnc).toBeNull();

    const now = 1_800_000_000_000;
    jest.spyOn(Date, 'now').mockReturnValue(now);
    const second = await svc.rotateSecret('writeToken', USER);
    expect(second.secret).not.toBe(first.secret);
    expect(second.previousExpiresAt).toBe(new Date(now + PREVIOUS_WRITE_TOKEN_WINDOW_MS).toISOString());
    expect(row.previousWriteTokenEnc).toBeTruthy();
    expect((row.previousWriteTokenExpiresAt as Date).getTime()).toBe(now + PREVIOUS_WRITE_TOKEN_WINDOW_MS);
    expect(row.updatedById).toBe('u1');

    const secrets = await svc.resolveSecrets();
    expect(secrets.writeToken).toBe(second.secret);
    expect(secrets.previousWriteToken).toBe(first.secret);
    expect(secrets.previousWriteTokenExpiresAt).toEqual(new Date(now + PREVIOUS_WRITE_TOKEN_WINDOW_MS));
    // The row stores ciphertext only, and the public shape only says "has".
    expect(row.writeTokenEnc).not.toContain(second.secret);
    const shape = await svc.publicShape();
    expect(JSON.stringify(shape)).not.toContain(second.secret);
    expect(shape.hasPreviousWriteToken).toBe(true);
  });

  it('rotateSecret(testToken) is wst_-prefixed, has no previous window and reports previousExpiresAt null', async () => {
    const { svc, row } = build();
    const a = await svc.rotateSecret('testToken', USER);
    const b = await svc.rotateSecret('testToken', USER);
    expect(a.secret).toMatch(/^wst_[0-9a-f]{48}$/);
    expect(b.previousExpiresAt).toBeNull();
    expect(row.previousWriteTokenEnc).toBeNull();
    expect((await svc.resolveSecrets()).testToken).toBe(b.secret);
  });

  it('rotateSecret refuses a name that is not a Bearer token — the Turnstile secret is pasted, never generated', async () => {
    const { svc, prisma } = build();
    await expect(svc.rotateSecret('turnstileSecret', USER)).rejects.toThrow(BadRequestException);
    expect(prisma.websiteIntegrationConfig.update).not.toHaveBeenCalled();
  });

  it('caches resolveSecrets for 60 s and invalidates on every write', async () => {
    const { svc, prisma } = build({ writeTokenEnc: encrypt('wsw_' + 'c'.repeat(48), KEY) });
    const t0 = 1_800_000_000_000;
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(t0);
    await svc.resolveSecrets();
    await svc.resolveSecrets();
    expect(prisma.websiteIntegrationConfig.findFirst).toHaveBeenCalledTimes(1);

    nowSpy.mockReturnValue(t0 + 60_001);
    await svc.resolveSecrets();
    expect(prisma.websiteIntegrationConfig.findFirst).toHaveBeenCalledTimes(2);

    // updateKeys reads the row twice (getOrCreate, then publicShape) → 3rd + 4th
    await svc.updateKeys({ turnstileSecret: 'new-secret' }, USER);
    expect(prisma.websiteIntegrationConfig.findFirst).toHaveBeenCalledTimes(4);
    // …and invalidated the cache, so the next resolve is a 5th read.
    await svc.resolveSecrets();
    expect(prisma.websiteIntegrationConfig.findFirst).toHaveBeenCalledTimes(5);
    await svc.resolveSecrets();
    expect(prisma.websiteIntegrationConfig.findFirst).toHaveBeenCalledTimes(5);
  });

  it('an undecryptable secret resolves to null with one warning naming it, and the others still resolve', async () => {
    const { svc } = build({
      writeTokenEnc: 'not-a-ciphertext',
      testTokenEnc: encrypt('wst_' + 'd'.repeat(48), KEY),
    });
    const warn = jest.spyOn(svc['logger'], 'warn').mockImplementation(() => undefined);
    const secrets = await svc.resolveSecrets();
    expect(secrets.writeToken).toBeNull();
    expect(secrets.testToken).toBe('wst_' + 'd'.repeat(48));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('writeToken');
    expect(String(warn.mock.calls[0][0])).not.toContain('not-a-ciphertext');
  });

  it('updateKeys: undefined leaves a column alone, empty string clears it, a value is encrypted', async () => {
    const { svc, row } = build({ turnstileSecretEnc: encrypt('old', KEY), revalidateSecretEnc: encrypt('rv', KEY) });
    await svc.updateKeys({ turnstileSecret: 'fresh-turnstile' }, USER);
    expect(row.turnstileSecretEnc).not.toContain('fresh-turnstile');
    expect((await svc.resolveSecrets()).turnstileSecret).toBe('fresh-turnstile');
    expect((await svc.resolveSecrets()).revalidateSecret).toBe('rv');
    expect(row.updatedById).toBe('u1');

    const shape = await svc.updateKeys({ revalidateSecret: '' }, USER);
    expect(row.revalidateSecretEnc).toBeNull();
    expect(shape.hasRevalidateSecret).toBe(false);
    expect(shape.hasTurnstileSecret).toBe(true);
  });

  it('updateSettings: stores the second human trimmed, stamps updatedById, and null or "" clears', async () => {
    const { svc, row } = build();
    const shape = await svc.updateSettings({ secondHumanEmail: ' owner@jobsadmire.com ', secondHumanName: 'Faraz' }, USER);
    expect(shape.secondHumanEmail).toBe('owner@jobsadmire.com');
    expect(row.secondHumanName).toBe('Faraz');
    expect(row.updatedById).toBe('u1');

    await svc.updateSettings({ secondHumanName: null }, USER);
    expect(row.secondHumanName).toBeNull();
    expect(row.secondHumanEmail).toBe('owner@jobsadmire.com'); // undefined = untouched

    await svc.updateSettings({ secondHumanEmail: '' }, USER);
    expect(row.secondHumanEmail).toBeNull();
  });

  describe('testConnection', () => {
    it('reports ok=false without calling Cloudflare when no Turnstile secret is stored', async () => {
      const { svc, row } = build();
      const fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockImplementation(() => Promise.reject(new Error('must not be called')));
      const res = await svc.testConnection(USER);
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(res).toEqual({ ok: false, error: 'No Turnstile secret is stored yet.' });
      expect(row.lastTestOk).toBe(false);
      expect(row.lastTestError).toBe('No Turnstile secret is stored yet.');
      expect(row.lastTestedAt).toBeInstanceOf(Date);
    });

    it('treats invalid-input-response as a VALID secret (the probe token is fake by design)', async () => {
      const { svc, row } = build({ turnstileSecretEnc: encrypt('0x4AAA-secret', KEY) });
      const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
      } as unknown as Response);
      const res = await svc.testConnection(USER);
      expect(res).toEqual({ ok: true, error: null });
      expect(row.lastTestOk).toBe(true);
      expect(row.lastTestError).toBeNull();
      // The secret travels in the form body, never in the URL or a log line.
      const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
      expect(String(init.body)).toContain('secret=0x4AAA-secret');
    });

    it('reports a wrong secret and persists the error', async () => {
      const { svc, row } = build({ turnstileSecretEnc: encrypt('wrong', KEY) });
      jest.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: false, 'error-codes': ['invalid-input-secret'] }),
      } as unknown as Response);
      const res = await svc.testConnection(USER);
      expect(res.ok).toBe(false);
      expect(res.error).toContain('invalid-input-secret');
      expect(row.lastTestOk).toBe(false);
      expect(row.lastTestError).toContain('invalid-input-secret');
    });

    it('never throws when Cloudflare is unreachable', async () => {
      const { svc, row } = build({ turnstileSecretEnc: encrypt('0x4AAA-secret', KEY) });
      jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNRESET'));
      await expect(svc.testConnection(USER)).resolves.toEqual({ ok: false, error: 'ECONNRESET' });
      expect(row.lastTestOk).toBe(false);
      expect(row.updatedById).toBe('u1');
    });
  });
});
```

`apps/backend/src/modules/website/guards/website-api.guard.spec.ts`:

```ts
import { UnauthorizedException } from '@nestjs/common';
import { WebsiteApiGuard, type WebsiteRequest } from './website-api.guard';
import type { WebsiteResolvedSecrets } from '../website-integration-config.service';

/**
 * WP3a Task 4 (rulings P7, RC2). The public door's only authentication. Order
 * is write → test → previous-write; every comparison is constant-time on equal
 * lengths; the class that matched is stamped VERBATIM on the request — a live
 * previous write token is 'previous-write', not 'write', so ping can report it
 * and the submission row can record it (P2: a 'test' match is a dry run).
 */
const WRITE = 'wsw_' + 'a'.repeat(48);
const TEST = 'wst_' + 'b'.repeat(48);
const PREVIOUS = 'wsw_' + 'c'.repeat(48);

function secrets(over: Partial<WebsiteResolvedSecrets> = {}): WebsiteResolvedSecrets {
  return {
    writeToken: WRITE,
    previousWriteToken: null,
    previousWriteTokenExpiresAt: null,
    testToken: TEST,
    turnstileSecret: null,
    revalidateSecret: null,
    ...over,
  };
}

function make(s: WebsiteResolvedSecrets) {
  const config = { resolveSecrets: jest.fn(async () => s) };
  const guard = new WebsiteApiGuard(config as never);
  return { guard, config };
}

function ctx(authorization?: string) {
  const req = { headers: authorization === undefined ? {} : { authorization } } as unknown as WebsiteRequest;
  return { req, ctx: { switchToHttp: () => ({ getRequest: () => req }) } as never };
}

describe('WebsiteApiGuard', () => {
  it('fails closed when no token of any class is configured', async () => {
    const { guard } = make(secrets({ writeToken: null, testToken: null }));
    const { ctx: c } = ctx(`Bearer ${WRITE}`);
    await expect(guard.canActivate(c)).rejects.toThrow('Website intake is not configured.');
  });

  it('ignores a configured token shorter than 20 characters (never a usable candidate)', async () => {
    const { guard } = make(secrets({ writeToken: 'short', testToken: null }));
    const { ctx: c } = ctx('Bearer short');
    await expect(guard.canActivate(c)).rejects.toThrow('Website intake is not configured.');
  });

  it('accepts the write token and stamps class "write"', async () => {
    const { guard } = make(secrets());
    const { req, ctx: c } = ctx(`Bearer ${WRITE}`);
    await expect(guard.canActivate(c)).resolves.toBe(true);
    expect(req.websiteTokenClass).toBe('write');
  });

  it('accepts the test token and stamps class "test" (scheme is case-insensitive)', async () => {
    const { guard } = make(secrets());
    const { req, ctx: c } = ctx(`bearer ${TEST}`);
    await expect(guard.canActivate(c)).resolves.toBe(true);
    expect(req.websiteTokenClass).toBe('test');
  });

  it('accepts the previous write token while its window is open, as class "previous-write"', async () => {
    const { guard } = make(
      secrets({ previousWriteToken: PREVIOUS, previousWriteTokenExpiresAt: new Date(Date.now() + 60_000) }),
    );
    const { req, ctx: c } = ctx(`Bearer ${PREVIOUS}`);
    await expect(guard.canActivate(c)).resolves.toBe(true);
    expect(req.websiteTokenClass).toBe('previous-write');
  });

  it('refuses the previous write token once its window has closed, or when it has no expiry at all', async () => {
    const closed = make(secrets({ previousWriteToken: PREVIOUS, previousWriteTokenExpiresAt: new Date(Date.now() - 1) }));
    await expect(closed.guard.canActivate(ctx(`Bearer ${PREVIOUS}`).ctx)).rejects.toThrow('Invalid website token.');
    const undated = make(secrets({ previousWriteToken: PREVIOUS, previousWriteTokenExpiresAt: null }));
    await expect(undated.guard.canActivate(ctx(`Bearer ${PREVIOUS}`).ctx)).rejects.toThrow('Invalid website token.');
  });

  it('the current write token still wins when it equals nothing else — order is write, test, previous-write', async () => {
    const { guard } = make(
      secrets({ previousWriteToken: PREVIOUS, previousWriteTokenExpiresAt: new Date(Date.now() + 60_000) }),
    );
    const { req, ctx: c } = ctx(`Bearer ${WRITE}`);
    await guard.canActivate(c);
    expect(req.websiteTokenClass).toBe('write');
  });

  it('refuses a wrong token, a missing header and a non-Bearer scheme', async () => {
    const { guard } = make(secrets());
    await expect(guard.canActivate(ctx(`Bearer ${'x'.repeat(52)}`).ctx)).rejects.toThrow(UnauthorizedException);
    await expect(guard.canActivate(ctx().ctx)).rejects.toThrow(UnauthorizedException);
    await expect(guard.canActivate(ctx(`Basic ${WRITE}`).ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('a length mismatch is a clean 401, never a timingSafeEqual TypeError', async () => {
    const { guard } = make(secrets());
    const { ctx: c } = ctx(`Bearer ${WRITE}extra`);
    await expect(guard.canActivate(c)).rejects.toThrow(UnauthorizedException);
  });

  it('reads the secrets through the cached resolver, once per request', async () => {
    const { guard, config } = make(secrets());
    await guard.canActivate(ctx(`Bearer ${WRITE}`).ctx);
    expect(config.resolveSecrets).toHaveBeenCalledTimes(1);
  });
});
```

`apps/backend/src/modules/website/website-ping.service.spec.ts`:

```ts
import { WebsitePingService } from './website-ping.service';

/**
 * WP3a Task 4 (ruling P11 as amended by RC13) — the readiness facts the
 * website's /api/site-health and the synthetic-lead heartbeat read, and what
 * the WP3a gate checks before the flag flip (secondHumanConfigured).
 *
 * `trippedForms` is `[]` until Task 10 injects WebsiteAbuseService (RC6); the
 * `build()` helper below is where that task adds its mock.
 */
describe('WebsitePingService', () => {
  function build(over: { turnstile?: boolean; secondHuman?: boolean; last?: Date | null } = {}) {
    const config = {
      resolveSecrets: jest.fn(async () => ({
        writeToken: 'w',
        previousWriteToken: null,
        previousWriteTokenExpiresAt: null,
        testToken: 't',
        turnstileSecret: over.turnstile ? 'secret' : null,
        revalidateSecret: null,
      })),
      publicShape: jest.fn(async () => ({
        id: 'cfg1',
        hasWriteToken: true,
        hasPreviousWriteToken: false,
        previousWriteTokenExpiresAt: null,
        hasTestToken: true,
        hasTurnstileSecret: Boolean(over.turnstile),
        hasRevalidateSecret: false,
        secondHumanEmail: over.secondHuman ? 'owner@jobsadmire.com' : null,
        secondHumanName: over.secondHuman ? 'Faraz' : null,
        lastTestedAt: null,
        lastTestOk: null,
        lastTestError: null,
        updatedById: null,
        createdAt: new Date('2026-09-19'),
        updatedAt: new Date('2026-09-19'),
      })),
    };
    const prisma = {
      websiteFormSubmission: {
        findFirst: jest.fn(async () => (over.last ? { createdAt: over.last } : null)),
      },
    };
    return { svc: new WebsitePingService(prisma as never, config as never), prisma, config };
  }

  it('returns the RC13 shape with the Phase-B facts null', async () => {
    const last = new Date('2026-09-19T08:00:00.000Z');
    const { svc, prisma } = build({ turnstile: true, secondHuman: true, last });
    await expect(svc.ping('previous-write')).resolves.toEqual({
      tokenClass: 'previous-write',
      moduleEnabled: true,
      captcha: 'configured',
      secondHumanConfigured: true,
      trippedForms: [],
      lastSubmissionAt: '2026-09-19T08:00:00.000Z',
      bucketPolicy: null,
      lastCrmFeedAt: null,
    });
    // Heartbeat rows (isTest) never count as "a lead arrived".
    expect(prisma.websiteFormSubmission.findFirst).toHaveBeenCalledWith({
      where: { isTest: false },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
  });

  it('reports captcha "missing", secondHumanConfigured false and lastSubmissionAt null on a fresh install', async () => {
    const { svc } = build();
    const res = await svc.ping('write');
    expect(res.tokenClass).toBe('write');
    expect(res.captcha).toBe('missing');
    expect(res.secondHumanConfigured).toBe(false);
    expect(res.lastSubmissionAt).toBeNull();
    expect(res.trippedForms).toEqual([]);
  });

  it('captcha readiness is the DECRYPTED secret, not the has* flag — a ciphertext ENCRYPTION_KEY cannot read is "missing"', async () => {
    const { svc, config } = build({ turnstile: true });
    config.resolveSecrets.mockResolvedValueOnce({
      writeToken: 'w',
      previousWriteToken: null,
      previousWriteTokenExpiresAt: null,
      testToken: 't',
      turnstileSecret: null,
      revalidateSecret: null,
    });
    expect((await svc.ping('test')).captcha).toBe('missing');
  });
});
```

`apps/backend/test/permissions/website-door-conformance.spec.ts`:

```ts
import { MetadataScanner, Reflector } from '@nestjs/core';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { PermissionAction } from '@prisma/client';

import { PermissionConformanceService } from '../../src/modules/permissions/permission-conformance.service';
import {
  PERMISSION_KEY,
  type RequiredPermission,
} from '../../src/modules/permissions/decorators/require-permission.decorator';
import { IS_PUBLIC_KEY } from '../../src/common/decorators/public.decorator';
import { AUDIT_ENTITY_KEY } from '../../src/common/decorators/audit-entity.decorator';
import { WebsiteIntegrationsController } from '../../src/modules/website/website-integrations.controller';
import { WebsitePublicController } from '../../src/modules/website/website-public.controller';
import { WebsiteModuleEnabledGuard } from '../../src/modules/website/guards/website-module-enabled.guard';
import { WebsiteApiGuard } from '../../src/modules/website/guards/website-api.guard';
import { registryFromSource } from './registry-from-source';

/**
 * WP3a Task 4 — the two controllers this task adds, scanned by the REAL scanner
 * against the REAL descriptor (market-research-conformance shape). Task 1's
 * `website-conformance.spec.ts` lists them in its CONTROLLERS too (RC15); this
 * file pins what is specific to the door and the secret screen: the public
 * door is a class-level @Public() controller whose guard chain is exactly
 * [flag, token] in that order (rulings P1, P7), and every secret route on the
 * admin controller sits on `website:MANAGE_KEYS` while the page itself is
 * `website.integrations` VIEW/EDIT (ruling P3), every write audited.
 */
const CONTROLLERS = [WebsiteIntegrationsController, WebsitePublicController];

function keyOf(
  controller: { prototype: object },
  method: string,
): RequiredPermission | RequiredPermission[] | undefined {
  const handler = (controller.prototype as Record<string, unknown>)[method];
  return Reflect.getMetadata(PERMISSION_KEY, handler as object);
}

function auditOf(controller: { prototype: object }, method: string): string | undefined {
  const handler = (controller.prototype as Record<string, unknown>)[method];
  return Reflect.getMetadata(AUDIT_ENTITY_KEY, handler as object);
}

describe('Website door + integrations route conformance', () => {
  const registry = registryFromSource('modules/website/website.module.ts');

  it('reads the live descriptor (the parse itself still works)', () => {
    expect(registry.descendantsOf('website')).toContain('website.integrations');
    expect(registry.get('website')?.supportedActions).toContain(PermissionAction.MANAGE_KEYS);
    expect(registry.getResource('website.integrations')?.supportedActions).toEqual([
      PermissionAction.VIEW,
      PermissionAction.EDIT,
    ]);
  });

  it('every route names a registered key at a supported action, or is public', () => {
    const { report, errors } = new PermissionConformanceService(
      { getControllers: () => [] } as never,
      new MetadataScanner(),
      new Reflector(),
      registry,
      { get: () => undefined } as never,
    ).scanClasses(CONTROLLERS, true);

    expect(errors).toEqual([]);
    expect(report.undecorated).toEqual([]);
    expect(report.decorated).toBe(5);
    expect(report.public).toBe(1);
  });

  it('the page is website.integrations VIEW/EDIT; every secret door is website:MANAGE_KEYS; every write is audited', () => {
    expect(keyOf(WebsiteIntegrationsController, 'getConfig')).toEqual({ module: 'website.integrations', action: 'VIEW' });
    expect(keyOf(WebsiteIntegrationsController, 'updateSettings')).toEqual({ module: 'website.integrations', action: 'EDIT' });
    for (const method of ['updateKeys', 'rotateSecret', 'testConnection']) {
      expect({ method, key: keyOf(WebsiteIntegrationsController, method) }).toEqual({
        method,
        key: { module: 'website', action: 'MANAGE_KEYS' },
      });
    }
    expect(auditOf(WebsiteIntegrationsController, 'getConfig')).toBeUndefined();
    for (const method of ['updateSettings', 'updateKeys', 'rotateSecret', 'testConnection']) {
      expect({ method, audit: auditOf(WebsiteIntegrationsController, method) }).toEqual({
        method,
        audit: 'WebsiteIntegrationConfig',
      });
    }
  });

  it('the public door is class-level @Public() behind [WebsiteModuleEnabledGuard, WebsiteApiGuard] in that order', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, WebsitePublicController)).toBe(true);
    expect(Reflect.getMetadata(GUARDS_METADATA, WebsitePublicController)).toEqual([
      WebsiteModuleEnabledGuard,
      WebsiteApiGuard,
    ]);
    expect(keyOf(WebsitePublicController, 'ping')).toBeUndefined();
  });
});
```

Modify `apps/backend/test/permissions/website-conformance.spec.ts` (Task 1's file). Replace the line

```ts
import { WebsiteStatusController } from '../../src/modules/website/website-status.controller';
```

with

```ts
import { WebsiteStatusController } from '../../src/modules/website/website-status.controller';
import { WebsiteIntegrationsController } from '../../src/modules/website/website-integrations.controller';
import { WebsitePublicController } from '../../src/modules/website/website-public.controller';
```

and replace the line

```ts
const CONTROLLERS = [WebsiteStatusController];
```

with

```ts
// Every task that adds a website controller appends it here (RC15): Task 4 the
// integrations screen + the public door; Task 7 the forms inbox; Tasks 8/9 their
// public controllers.
const CONTROLLERS = [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController];
```

Nothing else in that spec changes: `errors` stays `[]` (the door's `ping` is public and counted as such by the scanner, permission-conformance.service.ts:186-188), `undecorated` stays `[]`, and `selfService >= 1` still holds. Task 7 replaces exactly those four lines (three comment lines + the `const CONTROLLERS = […]` line) with its own, appending `WebsiteFormsInboxController`; Task 8 then appends `WebsitePublicUploadsController, WebsiteFormsEvidenceController` and Task 9 `WebsitePublicNewsletterController` to the same single line.

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website test/permissions/website-door-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2
```

Expected: the three new `src/modules/website` suites and `website-door-conformance.spec.ts` fail at import time — `Cannot find module './website-integration-config.service' from 'src/modules/website/website-integration-config.service.spec.ts'` (and the same for `./website.constants`, `./website-api.guard`, `./website-ping.service`, `../../src/modules/website/website-integrations.controller`); `website-conformance.spec.ts` fails with `Cannot find module '../../src/modules/website/website-integrations.controller'`. Task 2's `website-module-enabled.guard.spec.ts` / `website-env.spec.ts` and Task 3's `website-schema.spec.ts` still pass. No new test body runs.

- [ ] **Step 3: Implement**

`apps/backend/src/modules/website/website.constants.ts`:

```ts
import { WebsiteTokenClass } from '@prisma/client';

/**
 * WP3a — the public door's authentication vocabulary (rulings P7, RC2).
 *
 * The form-key list and the form → handler map are NOT here: they live in
 * `@jobsadmire/constants` (`WEBSITE_FORM_KEYS`, `WEBSITE_FORM_KIND_BY_KEY`,
 * `isWebsiteFormKey`) so the website, the door and the admin UI read one
 * source. The abuse-trip keys belong to `WebsiteAbuseService`.
 */

/**
 * Which Bearer the marketing site presented, in the guard's own words. Named
 * `WebsiteBearerClass` on purpose: `WebsiteTokenClass` is the Prisma enum
 * (`WRITE | TEST | PREVIOUS_WRITE`) stored on `WebsiteFormSubmission.tokenClass`,
 * and both names are imported side by side in the forms core.
 */
export const WEBSITE_BEARER_CLASSES = ['write', 'test', 'previous-write'] as const;
export type WebsiteBearerClass = (typeof WEBSITE_BEARER_CLASSES)[number];

/** The stamped class → the row's enum (RC2). `test` submissions are `isTest`; a previous-write match is a real lead. */
export const PRISMA_TOKEN_CLASS_BY_BEARER: Record<WebsiteBearerClass, WebsiteTokenClass> = {
  write: WebsiteTokenClass.WRITE,
  test: WebsiteTokenClass.TEST,
  'previous-write': WebsiteTokenClass.PREVIOUS_WRITE,
};

/** Below this a stored token is treated as unset — the CallAgentToolGuard rule. */
export const WEBSITE_TOKEN_MIN_LENGTH = 20;

/** How long a demoted write token keeps working after a rotation (ruling P7: 24 h, the Vercel redeploy gap). */
export const PREVIOUS_WRITE_TOKEN_WINDOW_MS = 24 * 60 * 60 * 1000;

/** The two server-generated Bearer tokens. The Turnstile and revalidate secrets are pasted, never generated. */
export const WEBSITE_ROTATABLE_SECRETS = ['writeToken', 'testToken'] as const;
export type WebsiteRotatableSecret = (typeof WEBSITE_ROTATABLE_SECRETS)[number];

export function isWebsiteRotatableSecret(value: string): value is WebsiteRotatableSecret {
  return (WEBSITE_ROTATABLE_SECRETS as readonly string[]).includes(value);
}
```

`apps/backend/src/modules/website/dto/website-integrations.dto.ts`:

```ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

/**
 * EDIT-gated (`website.integrations`): the non-secret half of the screen.
 * `undefined` leaves a field alone; `null` or `''` clears it (RC9 — the
 * frontend sends `trim() || null`).
 */
export class UpdateWebsiteIntegrationSettingsDto {
  @ApiPropertyOptional({
    nullable: true,
    description: 'Fallback recipient for every website event (ruling P9). null or empty string clears.',
  })
  @IsOptional()
  @ValidateIf((o: UpdateWebsiteIntegrationSettingsDto) => o.secondHumanEmail !== '')
  @IsEmail()
  @MaxLength(200)
  secondHumanEmail?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  secondHumanName?: string | null;
}

/** MANAGE_KEYS-gated (`website`): write-only pasted secrets. `undefined` keeps, `''` clears (P7). */
export class UpdateWebsiteIntegrationKeysDto {
  @ApiPropertyOptional({ description: 'Cloudflare Turnstile secret — one secret for both hostnames (ruling P6). Empty string clears.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  turnstileSecret?: string;

  @ApiPropertyOptional({ description: 'Shared secret Operations presents to the website revalidate route (Phase B consumer). Empty string clears.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  revalidateSecret?: string;
}
```

`apps/backend/src/modules/website/website-integration-config.service.ts`:

```ts
import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { WebsiteIntegrationConfig } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { encrypt, decrypt } from '../../common/utils/encryption.util';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { isWebsiteRotatableSecret, PREVIOUS_WRITE_TOKEN_WINDOW_MS, WebsiteRotatableSecret } from './website.constants';
import { UpdateWebsiteIntegrationKeysDto, UpdateWebsiteIntegrationSettingsDto } from './dto/website-integrations.dto';

/** Every secret the door and the captcha need, decrypted. Never logged, never returned by a route. */
export interface WebsiteResolvedSecrets {
  writeToken: string | null;
  /** Usable only while `previousWriteTokenExpiresAt` is in the future — the guard checks the clock, not this service. */
  previousWriteToken: string | null;
  previousWriteTokenExpiresAt: Date | null;
  testToken: string | null;
  turnstileSecret: string | null;
  revalidateSecret: string | null;
}

/** What GET /website/integrations returns: the row minus every *Enc column, plus has* flags. */
export interface WebsiteIntegrationPublicShape {
  id: string;
  hasWriteToken: boolean;
  hasPreviousWriteToken: boolean;
  previousWriteTokenExpiresAt: Date | null;
  hasTestToken: boolean;
  hasTurnstileSecret: boolean;
  hasRevalidateSecret: boolean;
  secondHumanEmail: string | null;
  secondHumanName: string | null;
  lastTestedAt: Date | null;
  lastTestOk: boolean | null;
  lastTestError: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** A rotate answer: the new value ONCE, and for `writeToken` when the demoted one stops working (RC9). */
export interface WebsiteRotatedSecret {
  name: WebsiteRotatableSecret;
  secret: string;
  previousExpiresAt: string | null;
}

export interface WebsiteConnectionTestResult {
  ok: boolean;
  error: string | null;
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Singleton configuration for the Website module (WP3a, rulings P7/P9).
 *
 * DB-ONLY, the CallCenterConfig posture: the website's Bearer tokens, the
 * Turnstile secret and the revalidate secret live AES-256-GCM encrypted in one
 * row and are managed from Website → Integrations. The only env dependency is
 * ENCRYPTION_KEY. Tokens are server-generated, shown ONCE on rotate, and the
 * previous WRITE token stays valid for one 24 h window so a rotation cannot
 * break the marketing site for the length of a Vercel redeploy.
 *
 * `resolveSecrets()` is the public door's hot path: one DB read per 60 s, every
 * secret decrypted inside its own try/catch (the WaConfigService lesson — a
 * rotated ENCRYPTION_KEY or a restored dump must yield a 401 + one WARN, never
 * a 500 on every public POST).
 */
@Injectable()
export class WebsiteIntegrationConfigService {
  private readonly logger = new Logger(WebsiteIntegrationConfigService.name);
  private secretCache: { value: WebsiteResolvedSecrets; expiresAt: number } | null = null;
  private readonly secretCacheTtlMs = 60_000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private encryptionKey(): string {
    const key = this.config.get<string>('ENCRYPTION_KEY');
    if (!key) throw new ServiceUnavailableException('ENCRYPTION_KEY is not configured.');
    return key;
  }

  async getOrCreate(): Promise<WebsiteIntegrationConfig> {
    const existing = await this.prisma.websiteIntegrationConfig.findFirst();
    if (existing) return existing;
    return this.prisma.websiteIntegrationConfig.create({ data: {} });
  }

  private previousLive(
    row: Pick<WebsiteIntegrationConfig, 'previousWriteTokenEnc' | 'previousWriteTokenExpiresAt'>,
  ): boolean {
    return (
      Boolean(row.previousWriteTokenEnc)
      && row.previousWriteTokenExpiresAt !== null
      && row.previousWriteTokenExpiresAt.getTime() > Date.now()
    );
  }

  /** Public shape — never includes key/secret material. */
  async publicShape(): Promise<WebsiteIntegrationPublicShape> {
    const c = await this.getOrCreate();
    return {
      id: c.id,
      hasWriteToken: Boolean(c.writeTokenEnc),
      hasPreviousWriteToken: this.previousLive(c),
      previousWriteTokenExpiresAt: c.previousWriteTokenExpiresAt,
      hasTestToken: Boolean(c.testTokenEnc),
      hasTurnstileSecret: Boolean(c.turnstileSecretEnc),
      hasRevalidateSecret: Boolean(c.revalidateSecretEnc),
      secondHumanEmail: c.secondHumanEmail,
      secondHumanName: c.secondHumanName,
      lastTestedAt: c.lastTestedAt,
      lastTestOk: c.lastTestOk,
      lastTestError: c.lastTestError,
      updatedById: c.updatedById,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  /**
   * Every secret, decrypted, cached ~60 s. PER SECRET: one that cannot be
   * decrypted is null and logged by NAME (never the ciphertext, never the
   * decrypt error, which quotes what it was handed). The guard fails closed
   * on nulls; the captcha degrades on a null Turnstile secret (ruling P6).
   */
  async resolveSecrets(): Promise<WebsiteResolvedSecrets> {
    if (this.secretCache && this.secretCache.expiresAt > Date.now()) return this.secretCache.value;
    const key = this.encryptionKey();
    const c = await this.getOrCreate();
    const take = (name: string, enc: string | null): string | null => {
      if (!enc) return null;
      try {
        return decrypt(enc, key);
      } catch {
        this.logger.warn(`Website secret ${name} could not be decrypted and was skipped (check ENCRYPTION_KEY).`);
        return null;
      }
    };
    const value: WebsiteResolvedSecrets = {
      writeToken: take('writeToken', c.writeTokenEnc),
      previousWriteToken: take('previousWriteToken', c.previousWriteTokenEnc),
      previousWriteTokenExpiresAt: c.previousWriteTokenExpiresAt,
      testToken: take('testToken', c.testTokenEnc),
      turnstileSecret: take('turnstileSecret', c.turnstileSecretEnc),
      revalidateSecret: take('revalidateSecret', c.revalidateSecretEnc),
    };
    this.secretCache = { value, expiresAt: Date.now() + this.secretCacheTtlMs };
    return value;
  }

  invalidateCache(): void {
    this.secretCache = null;
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  /** EDIT-gated (website.integrations): the non-secret fields. undefined = untouched, null or '' = clear, value = trimmed. */
  async updateSettings(
    dto: UpdateWebsiteIntegrationSettingsDto,
    user: AuthenticatedUser,
  ): Promise<WebsiteIntegrationPublicShape> {
    const c = await this.getOrCreate();
    const text = (v: string | null | undefined): string | null | undefined => {
      if (v === undefined) return undefined;
      const trimmed = v === null ? '' : v.trim();
      return trimmed ? trimmed : null;
    };
    await this.prisma.websiteIntegrationConfig.update({
      where: { id: c.id },
      data: {
        ...(dto.secondHumanEmail !== undefined && { secondHumanEmail: text(dto.secondHumanEmail) }),
        ...(dto.secondHumanName !== undefined && { secondHumanName: text(dto.secondHumanName) }),
        updatedById: user.userId,
      },
    });
    this.invalidateCache();
    return this.publicShape();
  }

  /** MANAGE_KEYS-gated: write-only pasted secrets. undefined = untouched, '' = clear, value = encrypt. */
  async updateKeys(dto: UpdateWebsiteIntegrationKeysDto, user: AuthenticatedUser): Promise<WebsiteIntegrationPublicShape> {
    const c = await this.getOrCreate();
    const key = this.encryptionKey();
    const enc = (v?: string) => (v === undefined ? undefined : v ? encrypt(v, key) : null);
    await this.prisma.websiteIntegrationConfig.update({
      where: { id: c.id },
      data: {
        ...(dto.turnstileSecret !== undefined && { turnstileSecretEnc: enc(dto.turnstileSecret) }),
        ...(dto.revalidateSecret !== undefined && { revalidateSecretEnc: enc(dto.revalidateSecret) }),
        updatedById: user.userId,
      },
    });
    this.invalidateCache();
    this.logger.log(`Website integration keys updated (${Object.keys(dto).join(', ')})`);
    return this.publicShape();
  }

  /**
   * MANAGE_KEYS-gated: (re)generate a Bearer token and return it ONCE. The UI
   * shows it in a display-once block and never sees it again.
   *
   * `writeToken`: the outgoing value is demoted to `previousWriteTokenEnc` with
   * a 24 h expiry (ruling P7) so the site keeps working until Vercel redeploys
   * with the new value; `previousExpiresAt` tells the operator when that is.
   * `testToken`: no window — the heartbeat is ours. The D12 live-proof gate
   * (new credential must pass /api/site-health before the current is demoted)
   * is deferred to WP3c.
   */
  async rotateSecret(name: string, user: AuthenticatedUser): Promise<WebsiteRotatedSecret> {
    if (!isWebsiteRotatableSecret(name)) {
      throw new BadRequestException(`Unknown rotatable secret "${name}" — expected writeToken or testToken.`);
    }
    const c = await this.getOrCreate();
    const key = this.encryptionKey();
    const secret = `${name === 'writeToken' ? 'wsw' : 'wst'}_${randomBytes(24).toString('hex')}`;
    let previousExpiresAt: Date | null = null;
    let data: {
      writeTokenEnc?: string;
      previousWriteTokenEnc?: string | null;
      previousWriteTokenExpiresAt?: Date | null;
      testTokenEnc?: string;
    };
    if (name === 'writeToken') {
      previousExpiresAt = c.writeTokenEnc ? new Date(Date.now() + PREVIOUS_WRITE_TOKEN_WINDOW_MS) : null;
      data = {
        writeTokenEnc: encrypt(secret, key),
        previousWriteTokenEnc: c.writeTokenEnc ?? null,
        previousWriteTokenExpiresAt: previousExpiresAt,
      };
    } else {
      data = { testTokenEnc: encrypt(secret, key) };
    }
    await this.prisma.websiteIntegrationConfig.update({
      where: { id: c.id },
      data: { ...data, updatedById: user.userId },
    });
    this.invalidateCache();
    this.logger.log(`Website secret rotated: ${name}`);
    return { name, secret, previousExpiresAt: previousExpiresAt ? previousExpiresAt.toISOString() : null };
  }

  /**
   * MANAGE_KEYS-gated "test" button: a real round-trip to Cloudflare with the
   * stored Turnstile secret and a deliberately fake widget token. A VALID secret
   * answers `invalid-input-response`; a wrong one answers `invalid-input-secret`.
   * Never throws; persists lastTested* (GoogleWorkspaceConfigService precedent).
   */
  async testConnection(user: AuthenticatedUser): Promise<WebsiteConnectionTestResult> {
    const c = await this.getOrCreate();
    let ok = false;
    let error: string | null = null;
    try {
      const secrets = await this.resolveSecrets();
      if (!secrets.turnstileSecret) throw new Error('No Turnstile secret is stored yet.');
      const params = new URLSearchParams();
      params.set('secret', secrets.turnstileSecret);
      params.set('response', 'website-integrations-probe');
      const res = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Turnstile verify HTTP ${res.status}`);
      const body = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
      const codes = body['error-codes'] ?? [];
      const secretRejected = codes.includes('invalid-input-secret') || codes.includes('missing-input-secret');
      if (secretRejected) throw new Error(`Turnstile rejected the stored secret: ${codes.join(', ')}`);
      ok = true;
    } catch (e) {
      error = ((e as Error)?.message ?? 'Unknown error').slice(0, 500);
      this.logger.warn(`Website Turnstile test failed: ${error}`);
    }
    await this.prisma.websiteIntegrationConfig.update({
      where: { id: c.id },
      data: { lastTestedAt: new Date(), lastTestOk: ok, lastTestError: error, updatedById: user.userId },
    });
    return { ok, error };
  }
}
```

`apps/backend/src/modules/website/guards/website-api.guard.ts`:

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

import { WebsiteIntegrationConfigService } from '../website-integration-config.service';
import { WEBSITE_TOKEN_MIN_LENGTH, WebsiteBearerClass } from '../website.constants';

/** The express request after WebsiteApiGuard: which Bearer class was presented. */
export interface WebsiteRequest extends Request {
  websiteTokenClass?: WebsiteBearerClass;
}

/**
 * M2M guard for the public website door (`/website/v1/*`), which the marketing
 * site calls SERVER-SIDE (D6: never from a browser; CORS untouched). Modelled on
 * CallAgentToolGuard: the shared secrets live in the DB (WebsiteIntegrationConfig),
 * are read through a 60 s cache, and the guard fails closed when nothing usable
 * is configured.
 *
 *   Authorization: Bearer <write token | test token | previous write token>
 *
 * Order write → test → previous-write (ruling P7). The class that matched is
 * stamped VERBATIM on `req.websiteTokenClass` (RC2): 'test' makes a submission
 * a dry run (ruling P2); 'previous-write' is a real lead that ping and the
 * submission row record as such, so the operator can see the old token is
 * still in use before its window closes. Every comparison is constant-time on
 * equal lengths.
 */
@Injectable()
export class WebsiteApiGuard implements CanActivate {
  constructor(private readonly config: WebsiteIntegrationConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const s = await this.config.resolveSecrets();
    const previousLive =
      Boolean(s.previousWriteToken)
      && s.previousWriteTokenExpiresAt !== null
      && s.previousWriteTokenExpiresAt.getTime() > Date.now();
    const candidates: Array<{ cls: WebsiteBearerClass; value: string | null }> = [
      { cls: 'write', value: s.writeToken },
      { cls: 'test', value: s.testToken },
      { cls: 'previous-write', value: previousLive ? s.previousWriteToken : null },
    ];
    const usable = candidates.filter(
      (c): c is { cls: WebsiteBearerClass; value: string } => !!c.value && c.value.length >= WEBSITE_TOKEN_MIN_LENGTH,
    );
    if (usable.length === 0) {
      throw new UnauthorizedException('Website intake is not configured.');
    }

    const req = ctx.switchToHttp().getRequest<WebsiteRequest>();
    const header = (req.headers['authorization'] as string) || '';
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    const token = match ? match[1] : '';
    if (!token) throw new UnauthorizedException('Invalid website token.');

    for (const c of usable) {
      if (safeEqual(token, c.value)) {
        req.websiteTokenClass = c.cls;
        return true;
      }
    }
    throw new UnauthorizedException('Invalid website token.');
  }
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
```

`apps/backend/src/modules/website/decorators/token-class.decorator.ts`:

```ts
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { WebsiteRequest } from '../guards/website-api.guard';
import { WebsiteBearerClass } from '../website.constants';

/**
 * `@TokenClass()` — the Bearer class WebsiteApiGuard stamped on the request.
 * Throws rather than defaulting: a route that reaches a handler without the
 * guard having run is a wiring bug, and defaulting to 'write' would turn a
 * heartbeat into a real lead.
 */
export const TokenClass = createParamDecorator((_data: unknown, ctx: ExecutionContext): WebsiteBearerClass => {
  const req = ctx.switchToHttp().getRequest<WebsiteRequest>();
  if (!req.websiteTokenClass) {
    throw new UnauthorizedException('Website token class missing — WebsiteApiGuard did not run.');
  }
  return req.websiteTokenClass;
});
```

`apps/backend/src/modules/website/website-ping.service.ts`:

```ts
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { WebsiteBearerClass } from './website.constants';

/**
 * Ruling P11 as amended by RC13 — the WP3a shape. Phase-B facts are present and
 * null so the website's reader never branches on absence.
 */
export interface WebsitePingResult {
  tokenClass: WebsiteBearerClass;
  moduleEnabled: true;
  captcha: 'configured' | 'missing';
  /** Whether a second-human fallback recipient is stored (D25); the WP3a gate reads this before the flip. */
  secondHumanConfigured: boolean;
  trippedForms: string[];
  lastSubmissionAt: string | null;
  bucketPolicy: null;
  lastCrmFeedAt: null;
}

/**
 * Readiness facts for `GET /website/v1/ping` (D25: the website's /api/site-health
 * and the synthetic-lead heartbeat both read this). It answers only behind
 * WebsiteModuleEnabledGuard, so `moduleEnabled` is a literal true.
 *
 * `trippedForms` is `[]` in this commit: the abuse trip and its Redis keys are
 * Task 10's `WebsiteAbuseService` (RC6), which that task injects here as the
 * third constructor argument and reads through `abuse.trippedForms()`.
 */
@Injectable()
export class WebsitePingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: WebsiteIntegrationConfigService,
  ) {}

  async ping(tokenClass: WebsiteBearerClass): Promise<WebsitePingResult> {
    const [secrets, shape, last] = await Promise.all([
      // Readiness = the secret DECRYPTS, not merely that a ciphertext is stored.
      this.config.resolveSecrets(),
      this.config.publicShape(),
      // Real leads only — the heartbeat's isTest rows must not mask a drought.
      this.prisma.websiteFormSubmission.findFirst({
        where: { isTest: false },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);
    return {
      tokenClass,
      moduleEnabled: true,
      captcha: secrets.turnstileSecret ? 'configured' : 'missing',
      secondHumanConfigured: Boolean(shape.secondHumanEmail),
      trippedForms: [],
      lastSubmissionAt: last ? last.createdAt.toISOString() : null,
      bucketPolicy: null,
      lastCrmFeedAt: null,
    };
  }
}
```

`apps/backend/src/modules/website/website-public.controller.ts`:

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';
import { WebsiteApiGuard } from './guards/website-api.guard';
import { TokenClass } from './decorators/token-class.decorator';
import { WebsitePingService } from './website-ping.service';
import { WebsiteBearerClass } from './website.constants';

/**
 * The public website intake door — the THIRD sanctioned public surface after
 * careers-public and the call-center/WhatsApp webhooks, argued in PRD §7.10.
 *
 * @Public() skips the user JWT (the global JwtAuthGuard and PermissionsGuard
 * both read it at class level); the class-level guard chain then runs IN ORDER:
 * WebsiteModuleEnabledGuard (the module flag, per request → generic 404,
 * ruling P1) and WebsiteApiGuard (Bearer write / test / previous-write from the
 * DB, ruling P7). Every route added to this class inherits both. Task 6 adds
 * `POST forms/:formKey` here; the fraud-evidence upload (Task 8) and the
 * newsletter confirm/unsubscribe routes (Task 9) are sibling controllers with
 * the same three class-level decorators (RC3).
 */
@ApiTags('Website (public door)')
@Public()
@UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)
@Controller('website/v1')
export class WebsitePublicController {
  constructor(private readonly pingService: WebsitePingService) {}

  @Get('ping')
  @ApiOperation({ summary: '[website] Readiness facts per token class (site-health + heartbeat)' })
  async ping(@TokenClass() tokenClass: WebsiteBearerClass) {
    return { data: await this.pingService.ping(tokenClass) };
  }
}
```

`apps/backend/src/modules/website/website-integrations.controller.ts`:

```ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { RequirePermission } from '../permissions/decorators/require-permission.decorator';
import { AuditEntity } from '../../common/decorators/audit-entity.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { WEBSITE_ROTATABLE_SECRETS } from './website.constants';
import { UpdateWebsiteIntegrationKeysDto, UpdateWebsiteIntegrationSettingsDto } from './dto/website-integrations.dto';

/**
 * Website → Integrations (rulings P3, P7, RC9).
 *
 * The PAGE and its non-secret fields (second human) are `website.integrations`
 * VIEW/EDIT. Every secret door — pasting a secret, rotating a token, probing
 * Cloudflare — is `website:MANAGE_KEYS`, seeded to NO role (super-admin via
 * the CASL bypass), exactly as call-center/marketing/whatsapp do. Nothing here
 * ever returns a stored secret; a rotate returns the new value once.
 */
@ApiTags('Website')
@ApiBearerAuth()
@Controller('website/integrations')
export class WebsiteIntegrationsController {
  constructor(private readonly config: WebsiteIntegrationConfigService) {}

  @RequirePermission('website.integrations', 'VIEW')
  @Get()
  @ApiOperation({ summary: 'Website integration config (secrets stripped — has* flags only)' })
  async getConfig() {
    return { data: await this.config.publicShape() };
  }

  @RequirePermission('website.integrations', 'EDIT')
  @Patch()
  @AuditEntity('WebsiteIntegrationConfig')
  @ApiOperation({ summary: 'Update the non-secret settings (second-human fallback recipient)' })
  async updateSettings(@Body() dto: UpdateWebsiteIntegrationSettingsDto, @CurrentUser() user: AuthenticatedUser) {
    return { data: await this.config.updateSettings(dto, user) };
  }

  @RequirePermission('website', 'MANAGE_KEYS')
  @Patch('keys')
  @AuditEntity('WebsiteIntegrationConfig')
  @ApiOperation({ summary: '[super-admin] Store/clear the Turnstile + revalidate secrets (write-only)' })
  async updateKeys(@Body() dto: UpdateWebsiteIntegrationKeysDto, @CurrentUser() user: AuthenticatedUser) {
    return { data: await this.config.updateKeys(dto, user) };
  }

  @RequirePermission('website', 'MANAGE_KEYS')
  @Post('rotate/:name')
  @AuditEntity('WebsiteIntegrationConfig')
  // RC31: swagger's `enum` wants a mutable string[], so the `as const` tuple is spread.
  @ApiParam({ name: 'name', enum: [...WEBSITE_ROTATABLE_SECRETS] })
  @ApiOperation({ summary: '[super-admin] Generate/rotate the write or test Bearer token (returned ONCE)' })
  async rotateSecret(@Param('name') name: string, @CurrentUser() user: AuthenticatedUser) {
    return { data: await this.config.rotateSecret(name, user) };
  }

  @RequirePermission('website', 'MANAGE_KEYS')
  @Post('test')
  @AuditEntity('WebsiteIntegrationConfig')
  @ApiOperation({ summary: '[super-admin] Probe the stored Turnstile secret against Cloudflare (persists lastTested*)' })
  async testConnection(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.config.testConnection(user) };
  }
}
```

Modify `apps/backend/src/modules/website/website.module.ts` (Task 1's file, as Task 2 left it — Task 2 printed the whole file). Two edits, both anchored on line text; the `imports:` line, the class comment and the constructor with its `registry.register({...})` literal stay byte-for-byte as Tasks 1/2 wrote them.

(1) After the line

```ts
import { WebsiteModuleEnabledGuard } from './guards/website-module-enabled.guard';
```

insert

```ts
import { WebsiteApiGuard } from './guards/website-api.guard';
import { WebsiteIntegrationConfigService } from './website-integration-config.service';
import { WebsiteIntegrationsController } from './website-integrations.controller';
import { WebsitePingService } from './website-ping.service';
import { WebsitePublicController } from './website-public.controller';
```

(2) Replace the two lines

```ts
  controllers: [WebsiteStatusController],
  providers: [WebsiteModuleEnabledGuard],
```

with

```ts
  controllers: [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController],
  // Both guards are providers of THIS module (the call-center.module.ts rule)
  // so DI can hand WebsiteApiGuard its config service; PrismaModule,
  // ConfigModule and PermissionsModule are already listed, nothing else is
  // needed (RedisModule is global and not used here).
  providers: [WebsiteModuleEnabledGuard, WebsiteApiGuard, WebsiteIntegrationConfigService, WebsitePingService],
  exports: [WebsiteIntegrationConfigService],
```

The decorator this task leaves behind (RC15 — the `imports:` line is Task 2's, untouched):

```ts
@Module({
  imports: [ConfigModule, PrismaModule, PermissionsModule],
  controllers: [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController],
  // Both guards are providers of THIS module (the call-center.module.ts rule)
  // so DI can hand WebsiteApiGuard its config service; PrismaModule,
  // ConfigModule and PermissionsModule are already listed, nothing else is
  // needed (RedisModule is global and not used here).
  providers: [WebsiteModuleEnabledGuard, WebsiteApiGuard, WebsiteIntegrationConfigService, WebsitePingService],
  exports: [WebsiteIntegrationConfigService],
})
export class WebsiteModule {
```

`exports` matters: Task 6's `WebsiteCaptchaService` and Task 10's `WebsiteNotifyService` are providers of the same module and resolve the config service directly, but the export is what lets a later module (Phase B's revalidate caller) inject it without re-providing it.

- [ ] **Step 4: Run the tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest src/modules/website test/permissions/website-door-conformance.spec.ts test/permissions/website-conformance.spec.ts --maxWorkers=2
```

Expected: all green — `WebsiteIntegrationConfigService` 12 tests, `WebsiteApiGuard` 10, `WebsitePingService` 3, `website-door-conformance` 4, `website-conformance` (Task 1, now scanning three controllers) unchanged and green, and Task 2's `website-env.spec.ts` cell "exactly ONE production file names the variable" still reporting `['modules/website/website-module-flag.ts']` (no file in this task writes the quoted literal).

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend && npx jest test/permissions/repo-invariants.spec.ts --maxWorkers=2
```

Expected: green — the source census counts `ping` under the class-level `@Public()` and the five admin verbs as decorated; `@RequirePermission('website.integrations', …)` / `('website', 'MANAGE_KEYS')` resolve against the Task 1 descriptor; the catalog hash is untouched.

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && npm run type-check --workspace=apps/backend
```

Expected: clean (run alone — one build/typecheck job at a time on this machine).

- [ ] **Step 5: Commit**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website && git add apps/backend/src/modules/website/website.constants.ts apps/backend/src/modules/website/website-integration-config.service.ts apps/backend/src/modules/website/website-integration-config.service.spec.ts apps/backend/src/modules/website/dto/website-integrations.dto.ts apps/backend/src/modules/website/guards/website-api.guard.ts apps/backend/src/modules/website/guards/website-api.guard.spec.ts apps/backend/src/modules/website/decorators/token-class.decorator.ts apps/backend/src/modules/website/website-ping.service.ts apps/backend/src/modules/website/website-ping.service.spec.ts apps/backend/src/modules/website/website-public.controller.ts apps/backend/src/modules/website/website-integrations.controller.ts apps/backend/src/modules/website/website.module.ts apps/backend/test/permissions/website-door-conformance.spec.ts apps/backend/test/permissions/website-conformance.spec.ts && git commit -m "feat(website): integrations config with rotating tokens, the Bearer guard and the door's ping

WebsiteIntegrationConfig singleton (DB-only, AES-GCM *Enc, has* public shape,
60 s cache, per-secret try/catch decrypt), rotate/:name with a 24 h
previous-write window + previousExpiresAt, Turnstile probe persisting
lastTested*; WebsiteApiGuard (write -> test -> previous-write, timingSafeEqual,
req.websiteTokenClass stamped verbatim); the public website/v1 controller
behind [WebsiteModuleEnabledGuard, WebsiteApiGuard] with GET ping
(captcha, secondHumanConfigured, lastSubmissionAt; trippedForms wired by the
abuse task); website/integrations on website.integrations VIEW/EDIT + website
MANAGE_KEYS, every write audited. Rulings P2, P3, P7, P11, RC2, RC9, RC13.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

---

