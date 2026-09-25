### Task 9: NEWSLETTER double opt-in — confirm/unsubscribe on the public door, RFC 8058 headers through the e-mail pipeline, `WEBSITE_SITE_URL`

Repo: `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website` (Operations), on the WP3a branch/worktree after Task 8's commit. Rulings applied: P4 (NEWSLETTER → `WebsiteSubscriber` double opt-in, token routes on the public door, RFC 8058 headers threaded through `queueEmail`'s new optional `headers`, `WebsiteForm.isActive=false` for `newsletter` until counsel clears — D14), P2 (`dryRun` → no subscriber row, no mail), P8 (nothing the handler does may reach the visitor as an error — infrastructure failures become a FAILED row), P9 (double opt-in confirm mail is the newsletter's only autoresponder; default mailbox; explicit locale), RC1 (Task 6 owns `website-form-handler.ts` and the `WebsiteForm` seed file with `newsletter.isActive=false`; Task 9 edits neither), RC3 (the newsletter routes are `GET newsletter/confirm`, `GET newsletter/unsubscribe`, `POST newsletter/unsubscribe` on their own public controller, third of three), RC4 (handler contract = Task 6's: `kinds`, `dryRun`, `WebsiteFormHandlerInput`/`Result`, self-registration, `detail` flags, no visitor-facing throws), RC11/RC18/RC28 (`WEBSITE_SITE_URL` is a WP3a variable OWNED end to end by this task: both compose files, `.env.example`, `.env.production.example` (`WEBSITE_SITE_URL=https://www.jobsadmire.com`) and the DEPLOYMENT.md `| Website | \`WEBSITE_SITE_URL\` |` env row — Task 12 adds PRD prose only; read through `ConfigService` by this service and by Task 10's `WebsiteAutoresponderService` via the helper below (Task 10's `WebsiteNotifyService` links to the Operations inbox through the existing `absoluteLink`/`APP_URL` helper, never through this variable) — no hard-coded `WEBSITE_PUBLIC_URL`), RC12 (`WebsiteSubscriber` has no `unsubscribeTokenHash`; the unsubscribe token is a stateless HMAC), RC15 (final files, quoted anchors, `CONTROLLERS` extended here).

**Files:**
- Create `apps/backend/src/modules/website/website-site-url.ts`
- Create `apps/backend/src/modules/website/website-site-url.spec.ts`
- Create `apps/backend/src/modules/website/newsletter/newsletter-token.ts`
- Create `apps/backend/src/modules/website/newsletter/newsletter-token.spec.ts`
- Create `apps/backend/src/modules/website/newsletter/website-newsletter.service.ts`
- Create `apps/backend/src/modules/website/newsletter/website-newsletter.service.spec.ts`
- Create `apps/backend/src/modules/website/newsletter/website-public-newsletter.controller.ts`
- Create `apps/backend/src/modules/website/newsletter/website-public-newsletter.controller.spec.ts`
- Create `apps/backend/src/modules/website/dto/newsletter-token.dto.ts`
- Create `apps/backend/src/modules/website/handlers/newsletter.handler.ts`
- Create `apps/backend/src/modules/website/handlers/newsletter.handler.spec.ts`
- Create `apps/backend/src/modules/email/templates/website-newsletter-confirm.hbs`, `website-newsletter-confirm.tr.hbs`, `website-newsletter-welcome.hbs`, `website-newsletter-welcome.tr.hbs`
- Create `apps/backend/src/modules/email/email-headers.spec.ts`
- Create `apps/backend/src/modules/notifications/processors/email.processor.headers.spec.ts`
- Modify `apps/backend/src/modules/notifications/notifications.service.ts` — the `queueEmail` options type (anchor: the line `    /** 'careers' → send as careers@ via Gmail (Internal Recruitment). See EmailService. */`) and the `queueBulkEmail` element type (anchor: the three lines `    notificationType?: string;` / `    mailbox?: 'careers' | 'default';` / `  }>) {`)
- Modify `apps/backend/src/modules/notifications/processors/email.processor.ts` — printed in full below
- Modify `apps/backend/src/modules/email/email.service.ts` — six anchored edits (`SendEmailOptions`, the destructuring line, the four transport calls)
- Modify `apps/backend/src/modules/integrations/google-workspace-config.service.ts` — `sendGmail` opts (anchor: `    references?: string;` followed by `  }): Promise<{ messageId: string; threadId: string | null }> {`) and the `MailComposer` literal (anchor: `      attachments: opts.attachments,` followed by `    })` / `      .compile()`)
- Modify `apps/backend/src/modules/email/ir-email-config.service.ts` — `SendPayload` (anchor: `  attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>;` followed by `}`) and `sendViaSmtp` (anchor: `      attachments: payload.attachments,` followed by `    });` / `    return { messageId: result.messageId };`)
- Modify `docker-compose.yml` (after the line `      APP_URL: ${APP_URL:-http://localhost:4000}`), `docker-compose.vps.yml` (after the line `      APP_URL: ${APP_URL:-https://operations.jobsadmire.com}`), `.env.example` (after the line `APP_URL=http://localhost:4000`), `.env.production.example` (after the line `CORS_ORIGINS=https://operations.jobsadmire.com`), `docs/DEPLOYMENT.md` (one env-table row directly after Task 2's row beginning `| Flags | \`WEBSITE_MODULE_ENABLED\` — **defaults \`false\`** on the VPS (WP3a, 2026-09-19) |`) — RC18
- Modify `apps/backend/src/modules/website/website.module.ts` — import block (`NotificationsModule` + the three newsletter names) + the whole `@Module({...})` decorator (printed below); the constructor's `registry.register({...})` literal is not touched
- Modify `apps/backend/test/permissions/website-conformance.spec.ts` (Task 1's spec, as Task 8 left it) — one import line and the `const CONTROLLERS = [` line (RC15)
- Test: the eight new `*.spec.ts` above; existing `apps/backend/src/modules/email/email.service.spec.ts`, `ir-email-config.service.spec.ts`, `notifications/event-dispatcher.spec.ts`, Task 6's `website-forms.service.spec.ts`, Task 7's `website-forms.rerun.spec.ts`, Task 1's `test/permissions/website-conformance.spec.ts` (now scanning the newsletter controller), Task 4's `test/permissions/website-door-conformance.spec.ts`, `test/permissions/repo-invariants.spec.ts` (route census — three new routes, all class-level `@Public()`), Task 2's `website-env.spec.ts` (nothing here names `WEBSITE_MODULE_ENABLED`)

**Interfaces:**
- Consumes (Task 2, RC1): `WebsiteModuleEnabledGuard` from `src/modules/website/guards/website-module-enabled.guard.ts` (already a provider of `WebsiteModule`).
- Consumes (Task 3, RC1/RC12): Prisma `model WebsiteSubscriber { id String @id @default(cuid()); email String @unique; locale String?; status WebsiteSubscriberStatus @default(PENDING); confirmTokenHash String? @db.VarChar(64); confirmExpiresAt DateTime?; confirmedAt DateTime?; unsubscribedAt DateTime?; consentVersion String?; ipAddressHash String? @db.VarChar(64); createdAt DateTime @default(now()); updatedAt DateTime @updatedAt }` (no `unsubscribeTokenHash` — RC12), `enum WebsiteSubscriberStatus { PENDING CONFIRMED UNSUBSCRIBED }`, `enum WebsiteFormKind` (member `NEWSLETTER`).
- Consumes (Task 4, RC1): `WebsiteApiGuard` from `src/modules/website/guards/website-api.guard.ts` (stamps `req.websiteTokenClass`; this controller does not read it — the per-subscriber token is the second factor, I12).
- Consumes (Task 6, RC1/RC4): from `src/modules/website/website-form-handler.ts` — `interface WebsiteFormHandler { readonly kinds: readonly WebsiteFormKind[]; handle(input: WebsiteFormHandlerInput): Promise<WebsiteFormHandlerResult> }`, `interface WebsiteFormHandlerInput { submissionId: string; formKey: string; kind: WebsiteFormKind; locale: WebsiteLocale; dryRun: boolean; fields: Record<string, string | string[]>; consentVersion: string; captchaDegraded: boolean; visitorIp: string | null; userAgent: string | null }`, `type WebsiteFormHandlerResult = { ok: true; createdEntityType?: 'inquiry' | 'applicant' | 'subscriber' | 'object'; createdEntityId?: string; detail?: Record<string, unknown> } | { ok: false; error: string; detail?: Record<string, unknown> }`, `@Injectable() class WebsiteFormHandlerRegistry { register(handler: WebsiteFormHandler): void; get(kind: WebsiteFormKind): WebsiteFormHandler | null }`; `type WebsiteLocale = 'tr' | 'en'` from `src/modules/website/dto/website-form-submit.dto.ts`; `hashIpOrNull(ip: string | null | undefined, salt: string): string | null` and `IP_HASH_DEV_SALT` from `src/common/utils/ip-hash.util.ts`. Core guarantees relied on: the catalog validated `fields.email` (`type: 'email', required`) BEFORE the row, so the handler never sees an invalid address; the core reads `detail.skipNotification` / `detail.skipAutoresponder` / `detail.alreadyReceived`; the core refuses a submission to a `WebsiteForm` whose `isActive` is false (404) — and Task 6's seed file `apps/backend/prisma/website-form-seed.ts` ships `newsletter` with `isActive: false` (D14; flipped by SQL only in WP3a, RC12), so this door is built, tested and dark.
- Consumes (existing, verified): `NotificationsService.queueEmail(options)` (`src/modules/notifications/notifications.service.ts`), `EmailService.sendEmail(options: SendEmailOptions)` (`src/modules/email/email.service.ts`), `GoogleWorkspaceConfigService.sendGmail(opts)` (`src/modules/integrations/google-workspace-config.service.ts`), `IrEmailConfigService.sendViaSmtp(cfg, payload, opts?)` (`src/modules/email/ir-email-config.service.ts`), `EmailProcessor` (`src/modules/notifications/processors/email.processor.ts`), `ENCRYPTION_KEY` (both compose files + `.env.example`), `IP_HASH_SALT` (both compose files), `Public` (`src/common/decorators/public.decorator.ts`), `ConfigModule.forRoot({ isGlobal: true })`, `NotificationsModule` exporting `NotificationsService` (`notifications.module.ts:34`; NOT `@Global()` — this task adds it to `WebsiteModule.imports`, the first website task that needs it), templates resolved as `<name>.<locale>.hbs` then `<name>.hbs` and wrapped in `base.hbs` (`renderTemplate`, email.service.ts).
- Produces:
  - E-mail pipeline: `queueEmail({ …, headers?: Record<string, string> })` and `queueBulkEmail([{ …, headers? }])`; `EmailJobData.headers?`; `SendEmailOptions.headers?`; `sendGmail({ …, headers? })` (MailComposer emits them verbatim); IR `SendPayload.headers?` (nodemailer `headers`); the global SMTP transport too. First consumer: RFC 8058 on newsletter mail; usable by every later marketing send.
  - `websiteSiteUrl(config: ConfigService): string` (env `WEBSITE_SITE_URL`, trailing slashes stripped, fallback `https://www.jobsadmire.com`), `websiteLocalePath(siteUrl: string, locale: WebsiteLocale, path: string): string` (TR at the root, EN under `/en`), `WEBSITE_SITE_URL_ENV = 'WEBSITE_SITE_URL'`, `WEBSITE_SITE_URL_FALLBACK` — in `src/modules/website/website-site-url.ts`. Task 10's `WebsiteAutoresponderService` imports `websiteSiteUrl` from here for its CTA links (RC28); Task 10's `WebsiteNotifyService` does NOT — its links point at the Operations inbox through `NotificationSettingsService.absoluteLink` (`APP_URL`).
  - Env `WEBSITE_SITE_URL` (RC18 — this task owns it end to end): `docker-compose.yml` default `http://localhost:3000`, `docker-compose.vps.yml` default `https://www.jobsadmire.com`, `.env.example` line `WEBSITE_SITE_URL=http://localhost:3000`, `.env.production.example` line `WEBSITE_SITE_URL=https://www.jobsadmire.com`, and the DEPLOYMENT.md env-table row beginning `| Website | \`WEBSITE_SITE_URL\`` (Task 12's docs guard pins that row; Task 12 adds PRD §5.12 prose only and writes no second row).
  - `newsletter-token.ts`: `NEWSLETTER_CONFIRM_TTL_MS = 172_800_000`, `NEWSLETTER_PATHS = { confirm: '/newsletter/confirm', unsubscribe: '/newsletter/unsubscribe' }`, `NEWSLETTER_CONTACT_EMAIL = 'info@jobsadmire.com'`, `newConfirmToken(): string` (32 url-safe chars), `hashToken(token): string` (sha256 hex), `signUnsubscribeToken(subscriberId, secret): string` (`<id>.<hmac>`), `verifyUnsubscribeToken(token, secret): string | null`.
  - `WebsiteNewsletterService(prisma: PrismaService, config: ConfigService, notifications: NotificationsService)`: `subscribe({ email, locale, visitorIp, consentVersion }): Promise<{ subscriberId: string; outcome: 'CONFIRMATION_SENT' | 'ALREADY_CONFIRMED' }>`; `confirm(token): Promise<{ outcome: 'CONFIRMED' | 'ALREADY_CONFIRMED' }>` (400 `NEWSLETTER_TOKEN_INVALID`, 410 `NEWSLETTER_TOKEN_EXPIRED`); `unsubscribe(token): Promise<{ outcome: 'UNSUBSCRIBED' | 'ALREADY_UNSUBSCRIBED' | 'UNKNOWN' }>` (400 `NEWSLETTER_TOKEN_INVALID` on a bad signature); `confirmUrl(locale, token)`, `unsubscribeUrl(locale, subscriberId)`, `listUnsubscribeHeaders(unsubscribeUrl): Record<string, string>`.
  - `NewsletterHandler` (`kinds = [WebsiteFormKind.NEWSLETTER]`, self-registers): `dryRun` → `{ ok: true, detail: { skipNotification: true, skipAutoresponder: true, dryRun: true } }`; otherwise `{ ok: true, createdEntityType: 'subscriber', createdEntityId, detail: { skipNotification: true, skipAutoresponder: true, alreadyReceived, outcome, email } }`; never throws for visitor input.
  - `WebsitePublicNewsletterController` — `@ApiTags('Website (public door)') @Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard) @Controller('website/v1/newsletter')`: `GET /api/website/v1/newsletter/confirm?token=…` → `{ data: { outcome } }`; `GET /api/website/v1/newsletter/unsubscribe?token=…` → `{ data: { outcome } }`; `POST /api/website/v1/newsletter/unsubscribe?token=…` (HTTP 200, no body read — the RFC 8058 one-click path) → `{ data: { outcome } }`. Bearer write | test | previous-write on all three (RC3 — these are three of the six public routes Task 12's §7.10/runbook list; Task 12 replaces its `POST …/newsletter/confirm` row with these).
  - `NewsletterTokenQueryDto { token: string }` (`@IsString() @Length(16, 200)`), `dto/newsletter-token.dto.ts`.
  - Website-side contract (WP2 implements; every mail link points at the SITE, never at Operations): `GET {WEBSITE_SITE_URL}[/en]/newsletter/confirm?token=<confirm token>` — the page forwards the token server-side to `GET /api/website/v1/newsletter/confirm?token=…` with the write token and renders the outcome (`noindex`); `GET|POST {WEBSITE_SITE_URL}[/en]/newsletter/unsubscribe?token=<signed token>` — the GET page forwards to `GET …/unsubscribe`, the POST route (what a mail client sends for RFC 8058 with form body `List-Unsubscribe=One-Click`) forwards to `POST …/unsubscribe?token=…` and answers 200 with no page. `List-Unsubscribe: <{unsubscribeUrl}>, <mailto:info@jobsadmire.com?subject=unsubscribe>`, `List-Unsubscribe-Post: List-Unsubscribe=One-Click` on every newsletter mail.
  - Templates `website-newsletter-confirm` / `website-newsletter-welcome` (EN + `.tr`), context `{ siteUrl, confirmUrl, unsubscribeUrl, expiresInHours }` / `{ siteUrl, unsubscribeUrl }`.
  - `apps/backend/test/permissions/website-conformance.spec.ts` `CONTROLLERS` now includes `WebsitePublicNewsletterController`.

- [ ] **Step 1: Write the failing tests**

`apps/backend/src/modules/website/website-site-url.spec.ts`:
```ts
import * as fs from 'fs';
import * as path from 'path';

import { WEBSITE_SITE_URL_ENV, WEBSITE_SITE_URL_FALLBACK, websiteLocalePath, websiteSiteUrl } from './website-site-url';

/**
 * WEBSITE_SITE_URL (WP3a, RC11) is the base of every link Operations prints
 * for the marketing site: newsletter confirm/unsubscribe (this task), the
 * autoresponder CTAs and the second-human mails (Task 10). Both compose files
 * pass env by an explicit `environment:` map (no env_file), so a name missing
 * there never reaches the container — the RATE_LIMITING_ENABLED lesson.
 */
describe('websiteSiteUrl', () => {
  const cfg = (v: string | undefined) => ({ get: (k: string) => (k === WEBSITE_SITE_URL_ENV ? v : undefined) }) as never;

  it('reads WEBSITE_SITE_URL, strips trailing slashes, falls back to the production host', () => {
    expect(websiteSiteUrl(cfg('https://www.jobsadmire.com/'))).toBe('https://www.jobsadmire.com');
    expect(websiteSiteUrl(cfg('http://localhost:3000'))).toBe('http://localhost:3000');
    expect(websiteSiteUrl(cfg('   '))).toBe(WEBSITE_SITE_URL_FALLBACK);
    expect(websiteSiteUrl(cfg(undefined))).toBe('https://www.jobsadmire.com');
  });

  it('TR lives at the root, EN under /en', () => {
    expect(websiteLocalePath('https://www.jobsadmire.com', 'tr', '/newsletter/confirm')).toBe('https://www.jobsadmire.com/newsletter/confirm');
    expect(websiteLocalePath('https://www.jobsadmire.com', 'en', '/newsletter/confirm')).toBe('https://www.jobsadmire.com/en/newsletter/confirm');
    expect(websiteLocalePath('https://www.jobsadmire.com', 'en', '')).toBe('https://www.jobsadmire.com/en');
  });
});

describe('WEBSITE_SITE_URL reaches the container', () => {
  const root = path.resolve(__dirname, '../../../../..');
  it.each(['docker-compose.yml', 'docker-compose.vps.yml', '.env.example', '.env.production.example'])('%s names WEBSITE_SITE_URL', (file) => {
    expect(fs.readFileSync(path.join(root, file), 'utf8')).toMatch(/WEBSITE_SITE_URL/);
  });
  it('the production template carries the www value and DEPLOYMENT.md has the env row (RC18)', () => {
    expect(fs.readFileSync(path.join(root, '.env.production.example'), 'utf8')).toContain('WEBSITE_SITE_URL=https://www.jobsadmire.com');
    expect(fs.readFileSync(path.join(root, 'docs/DEPLOYMENT.md'), 'utf8')).toContain('| Website | `WEBSITE_SITE_URL`');
  });
  it('the VPS default is the production site (www)', () => {
    expect(fs.readFileSync(path.join(root, 'docker-compose.vps.yml'), 'utf8')).toMatch(
      /WEBSITE_SITE_URL: \$\{WEBSITE_SITE_URL:-https:\/\/www\.jobsadmire\.com\}/,
    );
  });
  it('the dev default is the local website', () => {
    expect(fs.readFileSync(path.join(root, 'docker-compose.yml'), 'utf8')).toMatch(
      /WEBSITE_SITE_URL: \$\{WEBSITE_SITE_URL:-http:\/\/localhost:3000\}/,
    );
  });
});
```

`apps/backend/src/modules/website/newsletter/newsletter-token.spec.ts`:
```ts
import {
  NEWSLETTER_CONFIRM_TTL_MS,
  hashToken,
  newConfirmToken,
  signUnsubscribeToken,
  verifyUnsubscribeToken,
} from './newsletter-token';

/**
 * Newsletter tokens (WP3a, P4). Confirm token: random, only its sha256 is
 * stored (the OTP-hash precedent). Unsubscribe token: stateless HMAC over the
 * subscriber id (RC12: no stored hash) — an unsubscribe link in a mail from
 * six months ago must still work, so it cannot depend on an expiring row value.
 */
describe('newsletter tokens', () => {
  it('confirm tokens are random, url-safe and hashed with sha256', () => {
    const a = newConfirmToken();
    const b = newConfirmToken();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9_-]{32}$/);
    expect(hashToken(a)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken(a)).toBe(hashToken(a));
    expect(NEWSLETTER_CONFIRM_TTL_MS).toBe(48 * 60 * 60 * 1000);
  });

  it('unsubscribe tokens round-trip and fail on tampering or another secret', () => {
    const token = signUnsubscribeToken('clx1abc2def', 'secret-one');
    expect(token.startsWith('clx1abc2def.')).toBe(true);
    expect(verifyUnsubscribeToken(token, 'secret-one')).toBe('clx1abc2def');
    expect(verifyUnsubscribeToken(token, 'secret-two')).toBeNull();
    expect(verifyUnsubscribeToken(token.slice(0, -1) + 'x', 'secret-one')).toBeNull();
    expect(verifyUnsubscribeToken('clx1abc2def', 'secret-one')).toBeNull();
    expect(verifyUnsubscribeToken('other.' + token.split('.')[1], 'secret-one')).toBeNull();
    expect(verifyUnsubscribeToken('', 'secret-one')).toBeNull();
    expect(verifyUnsubscribeToken('.', 'secret-one')).toBeNull();
  });
});
```

`apps/backend/src/modules/website/newsletter/website-newsletter.service.spec.ts`:
```ts
import { BadRequestException, GoneException } from '@nestjs/common';
import { WebsiteSubscriberStatus } from '@prisma/client';

import { hashToken, signUnsubscribeToken } from './newsletter-token';
import { WebsiteNewsletterService } from './website-newsletter.service';

type Row = {
  id: string;
  email: string;
  locale: string | null;
  status: WebsiteSubscriberStatus;
  confirmTokenHash: string | null;
  confirmExpiresAt: Date | null;
  consentVersion?: string | null;
  ipAddressHash?: string | null;
};

function makeService(rows: Row[] = []) {
  const store = [...rows];
  const prisma = {
    websiteSubscriber: {
      findUnique: jest.fn(async ({ where }: { where: { email?: string; id?: string } }) =>
        store.find((r) => (where.email ? r.email === where.email : r.id === where.id)) ?? null,
      ),
      findFirst: jest.fn(async ({ where }: { where: { confirmTokenHash: string } }) =>
        store.find((r) => r.confirmTokenHash === where.confirmTokenHash) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Omit<Row, 'id'> }) => {
        const row = { id: `sub_${store.length + 1}`, ...data } as Row;
        store.push(row);
        return row;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Row> }) => {
        const row = store.find((r) => r.id === where.id)!;
        Object.assign(row, data);
        return row;
      }),
    },
  };
  const notifications = { queueEmail: jest.fn().mockResolvedValue({ queued: true }) };
  const env: Record<string, string> = {
    ENCRYPTION_KEY: 'unit-test-key',
    WEBSITE_SITE_URL: 'https://www.jobsadmire.com/',
    IP_HASH_SALT: 'unit-salt',
  };
  const config = { get: (k: string, d?: string) => env[k] ?? d };
  const svc = new WebsiteNewsletterService(prisma as never, config as never, notifications as never);
  return { svc, prisma, notifications, store };
}

const SUB = { locale: 'tr' as const, visitorIp: '203.0.113.9', consentVersion: 'privacy-2026-09' };

describe('WebsiteNewsletterService.subscribe', () => {
  it('creates a PENDING row (hashed token, hashed IP, consent) and queues the TR confirm mail with RFC 8058 headers', async () => {
    const { svc, notifications, store } = makeService();
    const out = await svc.subscribe({ ...SUB, email: ' Ali@Example.com ' });
    expect(out).toEqual({ subscriberId: 'sub_1', outcome: 'CONFIRMATION_SENT' });
    const row = store[0];
    expect(row.email).toBe('ali@example.com');
    expect(row.status).toBe(WebsiteSubscriberStatus.PENDING);
    expect(row.locale).toBe('tr');
    expect(row.consentVersion).toBe('privacy-2026-09');
    expect(row.confirmTokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.confirmExpiresAt!.getTime()).toBeGreaterThan(Date.now() + 47 * 3600 * 1000);
    expect(row.ipAddressHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain('203.0.113.9');

    expect(notifications.queueEmail).toHaveBeenCalledTimes(1);
    const call = notifications.queueEmail.mock.calls[0][0];
    expect(call).toMatchObject({ to: 'ali@example.com', template: 'website-newsletter-confirm', locale: 'tr', mailbox: 'default' });
    expect(call.subject).toMatch(/onaylay/i);
    // The link goes to the WEBSITE (TR root, no /en), which forwards the token to Ops server-side.
    expect(call.context.confirmUrl).toMatch(/^https:\/\/www\.jobsadmire\.com\/newsletter\/confirm\?token=[A-Za-z0-9_-]{32}$/);
    expect(hashToken(new URL(call.context.confirmUrl).searchParams.get('token')!)).toBe(row.confirmTokenHash);
    expect(call.context.siteUrl).toBe('https://www.jobsadmire.com');
    expect(call.context.expiresInHours).toBe(48);
    expect(call.headers['List-Unsubscribe']).toMatch(
      /^<https:\/\/www\.jobsadmire\.com\/newsletter\/unsubscribe\?token=sub_1\.[A-Za-z0-9_-]+>, <mailto:info@jobsadmire\.com\?subject=unsubscribe>$/,
    );
    expect(call.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
    // Never the hash in the mail.
    expect(JSON.stringify(call)).not.toContain(row.confirmTokenHash);
  });

  it('EN locale links under /en and gets the EN subject', async () => {
    const { svc, notifications } = makeService();
    await svc.subscribe({ ...SUB, email: 'a@b.io', locale: 'en', visitorIp: null });
    const call = notifications.queueEmail.mock.calls[0][0];
    expect(call.context.confirmUrl).toMatch(/^https:\/\/www\.jobsadmire\.com\/en\/newsletter\/confirm\?/);
    expect(call.context.unsubscribeUrl).toMatch(/^https:\/\/www\.jobsadmire\.com\/en\/newsletter\/unsubscribe\?token=/);
    expect(call.subject).toMatch(/confirm/i);
  });

  it('an already CONFIRMED address gets no mail (no mail-bomb vector) and ALREADY_CONFIRMED', async () => {
    const { svc, notifications } = makeService([
      { id: 'sub_9', email: 'a@b.io', locale: 'en', status: WebsiteSubscriberStatus.CONFIRMED, confirmTokenHash: null, confirmExpiresAt: null },
    ]);
    await expect(svc.subscribe({ ...SUB, email: 'a@b.io', locale: 'en' })).resolves.toEqual({
      subscriberId: 'sub_9',
      outcome: 'ALREADY_CONFIRMED',
    });
    expect(notifications.queueEmail).not.toHaveBeenCalled();
  });

  it('an UNSUBSCRIBED address may re-subscribe (new token, back to PENDING, unsubscribedAt cleared)', async () => {
    const { svc, store } = makeService([
      { id: 'sub_9', email: 'a@b.io', locale: 'en', status: WebsiteSubscriberStatus.UNSUBSCRIBED, confirmTokenHash: null, confirmExpiresAt: null },
    ]);
    await svc.subscribe({ ...SUB, email: 'a@b.io' });
    expect(store[0]).toMatchObject({ status: WebsiteSubscriberStatus.PENDING, locale: 'tr', unsubscribedAt: null, confirmedAt: null });
    expect(store[0].confirmTokenHash).not.toBeNull();
  });

  it('a PENDING address that asks again gets a fresh token and a fresh mail (the first one may be lost)', async () => {
    const { svc, store, notifications } = makeService([
      { id: 'sub_9', email: 'a@b.io', locale: 'en', status: WebsiteSubscriberStatus.PENDING, confirmTokenHash: 'old', confirmExpiresAt: new Date(Date.now() + 1000) },
    ]);
    await expect(svc.subscribe({ ...SUB, email: 'a@b.io' })).resolves.toEqual({ subscriberId: 'sub_9', outcome: 'CONFIRMATION_SENT' });
    expect(store[0].confirmTokenHash).not.toBe('old');
    expect(notifications.queueEmail).toHaveBeenCalledTimes(1);
  });

  it('a non-address is a 400 (a programming error — the catalog refuses it before the row)', async () => {
    const { svc } = makeService();
    await expect(svc.subscribe({ ...SUB, email: 'not-an-email' })).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('WebsiteNewsletterService.confirm / unsubscribe', () => {
  const TOKEN = 'tok-tok-tok-tok-tok-tok-tok-tok-';
  const pending = (over: Partial<Row> = {}): Row => ({
    id: 'sub_1',
    email: 'a@b.io',
    locale: 'tr',
    status: WebsiteSubscriberStatus.PENDING,
    confirmTokenHash: hashToken(TOKEN),
    confirmExpiresAt: new Date(Date.now() + 3600_000),
    ...over,
  });

  it('confirm: valid token → CONFIRMED + welcome mail carrying List-Unsubscribe', async () => {
    const { svc, notifications, store } = makeService([pending()]);
    await expect(svc.confirm(TOKEN)).resolves.toEqual({ outcome: 'CONFIRMED' });
    expect(store[0].status).toBe(WebsiteSubscriberStatus.CONFIRMED);
    expect(store[0].confirmExpiresAt).toBeNull();
    const call = notifications.queueEmail.mock.calls[0][0];
    expect(call).toMatchObject({ to: 'a@b.io', template: 'website-newsletter-welcome', locale: 'tr', mailbox: 'default' });
    expect(call.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
    expect(call.context.unsubscribeUrl).toMatch(/^https:\/\/www\.jobsadmire\.com\/newsletter\/unsubscribe\?token=sub_1\./);
  });

  it('confirm: a second click is ALREADY_CONFIRMED, no second welcome mail', async () => {
    const { svc, notifications } = makeService([pending({ status: WebsiteSubscriberStatus.CONFIRMED, confirmExpiresAt: null })]);
    await expect(svc.confirm(TOKEN)).resolves.toEqual({ outcome: 'ALREADY_CONFIRMED' });
    expect(notifications.queueEmail).not.toHaveBeenCalled();
  });

  it('confirm: a failed welcome queue does not undo the confirmation', async () => {
    const { svc, notifications, store } = makeService([pending()]);
    notifications.queueEmail.mockRejectedValueOnce(new Error('redis down'));
    await expect(svc.confirm(TOKEN)).resolves.toEqual({ outcome: 'CONFIRMED' });
    expect(store[0].status).toBe(WebsiteSubscriberStatus.CONFIRMED);
  });

  it('confirm: unknown → 400, expired → 410, unsubscribed → 400', async () => {
    await expect(makeService([pending()]).svc.confirm('nope')).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      makeService([pending({ confirmExpiresAt: new Date(Date.now() - 1000) })]).svc.confirm(TOKEN),
    ).rejects.toBeInstanceOf(GoneException);
    await expect(
      makeService([pending({ status: WebsiteSubscriberStatus.UNSUBSCRIBED })]).svc.confirm(TOKEN),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('unsubscribe: signed token → UNSUBSCRIBED, idempotent, unknown id → UNKNOWN, bad signature → 400', async () => {
    const { svc, store } = makeService([pending({ status: WebsiteSubscriberStatus.CONFIRMED })]);
    const token = signUnsubscribeToken('sub_1', 'unit-test-key');
    await expect(svc.unsubscribe(token)).resolves.toEqual({ outcome: 'UNSUBSCRIBED' });
    expect(store[0].status).toBe(WebsiteSubscriberStatus.UNSUBSCRIBED);
    await expect(svc.unsubscribe(token)).resolves.toEqual({ outcome: 'ALREADY_UNSUBSCRIBED' });
    await expect(svc.unsubscribe(signUnsubscribeToken('sub_404', 'unit-test-key'))).resolves.toEqual({ outcome: 'UNKNOWN' });
    await expect(svc.unsubscribe('sub_1.forged')).rejects.toBeInstanceOf(BadRequestException);
  });
});
```

`apps/backend/src/modules/website/handlers/newsletter.handler.spec.ts`:
```ts
import { WebsiteFormKind } from '@prisma/client';

import { WebsiteFormHandlerRegistry, WebsiteFormHandlerInput } from '../website-form-handler';
import { NewsletterHandler } from './newsletter.handler';

/**
 * The NEWSLETTER handler under Task 6's contract (RC4): self-registers, dry-runs
 * on the test token (P2), never throws for visitor input (P8), and tells the
 * core to skip the generic bell and autoresponder — the confirm mail IS the
 * answer (P9).
 */
function make() {
  const registry = new WebsiteFormHandlerRegistry();
  const newsletter = { subscribe: jest.fn().mockResolvedValue({ subscriberId: 'sub_1', outcome: 'CONFIRMATION_SENT' }) };
  const handler = new NewsletterHandler(registry, newsletter as never);
  return { registry, newsletter, handler };
}

const input = (over: Partial<WebsiteFormHandlerInput> = {}): WebsiteFormHandlerInput => ({
  submissionId: 'sub-row-1',
  formKey: 'newsletter',
  kind: WebsiteFormKind.NEWSLETTER,
  locale: 'tr',
  dryRun: false,
  fields: { email: 'a@b.io', name: 'Ayşe' },
  consentVersion: 'privacy-2026-09',
  captchaDegraded: false,
  visitorIp: '203.0.113.9',
  userAgent: 'Safari',
  ...over,
});

describe('NewsletterHandler', () => {
  it('registers itself for NEWSLETTER only', () => {
    const { registry, handler } = make();
    expect(registry.get(WebsiteFormKind.NEWSLETTER)).toBe(handler);
    expect(registry.get(WebsiteFormKind.INQUIRY)).toBeNull();
  });

  it('subscribes with the whitelisted e-mail, locale, visitor IP and consent, and skips notification + autoresponder', async () => {
    const { handler, newsletter } = make();
    const out = await handler.handle(input());
    expect(newsletter.subscribe).toHaveBeenCalledWith({ email: 'a@b.io', locale: 'tr', visitorIp: '203.0.113.9', consentVersion: 'privacy-2026-09' });
    expect(out).toEqual({
      ok: true,
      createdEntityType: 'subscriber',
      createdEntityId: 'sub_1',
      detail: { skipNotification: true, skipAutoresponder: true, alreadyReceived: false, outcome: 'CONFIRMATION_SENT', email: 'a@b.io' },
    });
  });

  it('an already-confirmed address is reported as alreadyReceived, still ok', async () => {
    const { handler, newsletter } = make();
    newsletter.subscribe.mockResolvedValueOnce({ subscriberId: 'sub_9', outcome: 'ALREADY_CONFIRMED' });
    const out = await handler.handle(input());
    expect(out).toMatchObject({ ok: true, createdEntityId: 'sub_9', detail: { alreadyReceived: true, outcome: 'ALREADY_CONFIRMED' } });
  });

  it('dryRun (test token, P2): no subscribe call, no entity, skip flags set', async () => {
    const { handler, newsletter } = make();
    const out = await handler.handle(input({ dryRun: true }));
    expect(newsletter.subscribe).not.toHaveBeenCalled();
    expect(out).toEqual({ ok: true, detail: { skipNotification: true, skipAutoresponder: true, dryRun: true } });
  });

  it('a missing e-mail (cannot happen after the catalog) is ok:false, never a throw', async () => {
    const { handler, newsletter } = make();
    const out = await handler.handle(input({ fields: { name: 'x' } }));
    expect(newsletter.subscribe).not.toHaveBeenCalled();
    expect(out).toMatchObject({ ok: false, error: expect.stringMatching(/email/) });
  });

  it('an infrastructure failure inside subscribe propagates (the core files a FAILED row and re-runs it)', async () => {
    const { handler, newsletter } = make();
    newsletter.subscribe.mockRejectedValueOnce(new Error('db gone'));
    await expect(handler.handle(input())).rejects.toThrow('db gone');
  });
});
```

`apps/backend/src/modules/website/newsletter/website-public-newsletter.controller.spec.ts`:
```ts
import { GUARDS_METADATA, PATH_METADATA } from '@nestjs/common/constants';

import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { WebsiteApiGuard } from '../guards/website-api.guard';
import { WebsiteModuleEnabledGuard } from '../guards/website-module-enabled.guard';
import { WebsitePublicNewsletterController } from './website-public-newsletter.controller';

/**
 * The third public controller of the door (RC3). Pinned: class-level
 * @Public() and the guard chain [flag, token] in that order (P1, P7) — the
 * same shape Task 4's door-conformance spec pins for WebsitePublicController —
 * and the three routes delegate to the service and wrap in { data }.
 */
describe('WebsitePublicNewsletterController', () => {
  it('is @Public() under website/v1/newsletter with the guard chain [WebsiteModuleEnabledGuard, WebsiteApiGuard]', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, WebsitePublicNewsletterController)).toBe(true);
    expect(Reflect.getMetadata(PATH_METADATA, WebsitePublicNewsletterController)).toBe('website/v1/newsletter');
    expect(Reflect.getMetadata(GUARDS_METADATA, WebsitePublicNewsletterController)).toEqual([WebsiteModuleEnabledGuard, WebsiteApiGuard]);
  });

  it('confirm / unsubscribe (GET and POST) forward the query token and wrap the outcome', async () => {
    const newsletter = {
      confirm: jest.fn().mockResolvedValue({ outcome: 'CONFIRMED' }),
      unsubscribe: jest.fn().mockResolvedValue({ outcome: 'UNSUBSCRIBED' }),
    };
    const ctrl = new WebsitePublicNewsletterController(newsletter as never);
    await expect(ctrl.confirm({ token: 'confirm-token-0123456789' })).resolves.toEqual({ data: { outcome: 'CONFIRMED' } });
    expect(newsletter.confirm).toHaveBeenCalledWith('confirm-token-0123456789');
    await expect(ctrl.unsubscribe({ token: 'sub_1.signature-signature' })).resolves.toEqual({ data: { outcome: 'UNSUBSCRIBED' } });
    await expect(ctrl.unsubscribeOneClick({ token: 'sub_1.signature-signature' })).resolves.toEqual({ data: { outcome: 'UNSUBSCRIBED' } });
    expect(newsletter.unsubscribe).toHaveBeenCalledTimes(2);
    expect(newsletter.unsubscribe).toHaveBeenLastCalledWith('sub_1.signature-signature');
  });
});
```

`apps/backend/src/modules/email/email-headers.spec.ts`:
```ts
import { EmailService } from './email.service';

/**
 * Custom RFC-822 headers (WP3a Task 9): `headers` must reach BOTH transports —
 * the Gmail raw-MIME builder and nodemailer — or RFC 8058 one-click
 * unsubscribe silently vanishes on one path. Same harness as email.service.spec.ts.
 */
function makeEmailService(opts: { resolved: unknown; gmailEnabled?: boolean; sendGmail?: jest.Mock; sendViaSmtp?: jest.Mock }) {
  const config = { get: (_k: string, d: unknown) => d } as never;
  const sendGmail = opts.sendGmail ?? jest.fn().mockResolvedValue({ messageId: 'gmail' });
  const googleConfig = {
    sendGmail,
    getConfigRow: jest.fn().mockResolvedValue({ gmailEnabled: opts.gmailEnabled ?? true }),
  } as never;
  const sendViaSmtp = opts.sendViaSmtp ?? jest.fn().mockResolvedValue({ messageId: 'smtp' });
  const irEmailConfig = {
    getResolvedSafe: jest.fn().mockResolvedValue(opts.resolved),
    from: (c: { senderName: string; senderEmail: string }) => `${c.senderName} <${c.senderEmail}>`,
    sendViaSmtp,
  } as never;
  return { svc: new EmailService(config, googleConfig, irEmailConfig), sendGmail, sendViaSmtp };
}

const headers = {
  'List-Unsubscribe': '<https://www.jobsadmire.com/newsletter/unsubscribe?token=x.y>, <mailto:info@jobsadmire.com?subject=unsubscribe>',
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
};

describe('EmailService custom headers', () => {
  it('default mailbox (prod: SMTP_HOST unset → Gmail impersonated) forwards headers to sendGmail', async () => {
    const { svc, sendGmail } = makeEmailService({ resolved: null });
    await svc.sendEmail({ to: 'a@b.io', subject: 's', template: 't', context: {}, mailbox: 'default', headers });
    expect(sendGmail).toHaveBeenCalledWith(expect.objectContaining({ fromImpersonated: true, headers }));
  });

  it('careers mailbox on the IR SMTP transport forwards headers to sendViaSmtp', async () => {
    const { svc, sendViaSmtp } = makeEmailService({
      resolved: { isActive: true, transport: 'SMTP', senderName: 'C', senderEmail: 'careers@jobsadmire.com' },
    });
    await svc.sendEmail({ to: 'a@b.io', subject: 's', template: 't', context: {}, mailbox: 'careers', headers });
    expect(sendViaSmtp).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ headers }));
  });

  it('careers mailbox on Gmail forwards headers to sendGmail', async () => {
    const { svc, sendGmail } = makeEmailService({
      resolved: { isActive: true, transport: 'GMAIL', senderName: 'C', senderEmail: 'careers@jobsadmire.com' },
    });
    await svc.sendEmail({ to: 'a@b.io', subject: 's', template: 't', context: {}, mailbox: 'careers', headers });
    expect(sendGmail).toHaveBeenCalledWith(expect.objectContaining({ headers }));
  });

  it('no headers → nothing is added to the transport call', async () => {
    const { svc, sendGmail } = makeEmailService({ resolved: null });
    await svc.sendEmail({ to: 'a@b.io', subject: 's', template: 't', context: {} });
    expect(sendGmail.mock.calls[0][0]).not.toHaveProperty('headers');
  });
});
```

`apps/backend/src/modules/notifications/processors/email.processor.headers.spec.ts`:
```ts
import { EmailProcessor } from './email.processor';

/** WP3a Task 9: the queue must carry `headers` from queueEmail/queueBulkEmail to EmailService untouched. */
describe('EmailProcessor forwards custom headers', () => {
  const headers = { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' };
  const make = () => {
    const emailService = { sendEmail: jest.fn().mockResolvedValue({ messageId: 'm1' }) };
    const prisma = { user: { findUnique: jest.fn() } };
    return { proc: new EmailProcessor(emailService as never, prisma as never), emailService };
  };

  it('send', async () => {
    const { proc, emailService } = make();
    await proc.handleSend({ id: 1, progress: jest.fn(), data: { to: 'a@b.io', subject: 's', template: 't', context: {}, headers } } as never);
    expect(emailService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ headers }));
  });

  it('send without headers passes none', async () => {
    const { proc, emailService } = make();
    await proc.handleSend({ id: 1, progress: jest.fn(), data: { to: 'a@b.io', subject: 's', template: 't', context: {} } } as never);
    expect(emailService.sendEmail.mock.calls[0][0]).not.toHaveProperty('headers');
  });

  it('send-bulk', async () => {
    const { proc, emailService } = make();
    await proc.handleBulkSend({ id: 2, progress: jest.fn(), data: { emails: [{ to: 'a@b.io', subject: 's', template: 't', context: {}, headers }] } } as never);
    expect(emailService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ headers }));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/modules/website/website-site-url.spec.ts src/modules/website/newsletter src/modules/website/handlers/newsletter.handler.spec.ts src/modules/email/email-headers.spec.ts src/modules/notifications/processors/email.processor.headers.spec.ts --maxWorkers=2
```
Expected: `website-site-url.spec` fails with `Cannot find module './website-site-url'` (its env cells would fail on the missing compose / `.env` / DEPLOYMENT lines once it compiles); `newsletter-token.spec`, `website-newsletter.service.spec`, `website-public-newsletter.controller.spec` and `newsletter.handler.spec` fail with `Cannot find module './newsletter-token'` / `'./website-newsletter.service'` / `'./website-public-newsletter.controller'` / `'./newsletter.handler'`; `email-headers.spec` fails at compile (ts-jest: `Object literal may only specify known properties, and 'headers' does not exist in type 'SendEmailOptions'`); `email.processor.headers.spec` fails on `expect(emailService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ headers }))` (headers not forwarded).

- [ ] **Step 3: Implement**

**3a — e-mail pipeline: optional `headers` end to end.**

`apps/backend/src/modules/notifications/notifications.service.ts` — in `queueEmail`, replace the two lines

```ts
    /** 'careers' → send as careers@ via Gmail (Internal Recruitment). See EmailService. */
    mailbox?: 'careers' | 'default';
  }) {
```

with

```ts
    /** 'careers' → send as careers@ via Gmail (Internal Recruitment). See EmailService. */
    mailbox?: 'careers' | 'default';
    /**
     * Extra RFC-822 headers (WP3a): e.g. RFC 8058 `List-Unsubscribe` +
     * `List-Unsubscribe-Post` on newsletter mail. Forwarded verbatim through
     * the queue to EmailService and on to both transports.
     */
    headers?: Record<string, string>;
  }) {
```

and in `queueBulkEmail`, replace the three lines

```ts
    notificationType?: string;
    mailbox?: 'careers' | 'default';
  }>) {
```

with

```ts
    notificationType?: string;
    mailbox?: 'careers' | 'default';
    headers?: Record<string, string>;
  }>) {
```

`apps/backend/src/modules/notifications/processors/email.processor.ts` — final file:

```ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from '../../email/email.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { isNotificationEnabled } from '../notification-preferences.config';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  /** Template name (e.g., 'welcome', 'job-approved') */
  template: string;
  /** Template context variables */
  context: Record<string, unknown>;
  /** Optional locale for template selection (defaults to 'en') */
  locale?: string;
  attachments?: Array<{ filename: string; content: string; contentType?: string }>;
  /** Recipient user ID — used to look up notification preferences */
  userId?: string;
  /** Notification type (e.g., 'JOB_APPROVED') — maps to preference config */
  notificationType?: string;
  /** 'careers' → send as careers@ via Gmail (Internal Recruitment). */
  mailbox?: 'careers' | 'default';
  /** Extra RFC-822 headers (e.g. List-Unsubscribe, WP3a). Forwarded verbatim to EmailService. */
  headers?: Record<string, string>;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Check if an email should be sent based on user's notification preferences.
   * Returns true if the email should proceed, false if it should be skipped.
   */
  private async shouldSendEmail(userId?: string, notificationType?: string): Promise<boolean> {
    // No userId or notificationType means we can't check preferences — send by default
    if (!userId || !notificationType) return true;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true },
    });

    const prefs = user?.notificationPreferences as Record<string, Record<string, boolean>> | null;
    return isNotificationEnabled(prefs, notificationType, 'email');
  }

  @Process('send')
  async handleSend(job: Job<EmailJobData>) {
    const { to, subject, template, context, locale, attachments, userId, notificationType, mailbox, headers } = job.data;
    const recipients = Array.isArray(to) ? to.join(', ') : to;

    this.logger.log(`Processing email job ${job.id}: "${subject}" (${template}) → ${recipients}`);

    try {
      // Check user notification preferences before sending
      const shouldSend = await this.shouldSendEmail(userId, notificationType);
      if (!shouldSend) {
        this.logger.log(`Email skipped for user ${userId} — disabled by preference (type: ${notificationType})`);
        await job.progress(100);
        return { sent: false, skipped: true, reason: 'disabled_by_preference', recipients, subject };
      }

      // Deserialize Buffer attachments (they arrive as base64 strings from the queue)
      const parsedAttachments = attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content, 'base64'),
        contentType: a.contentType,
      }));

      const result = await this.emailService.sendEmail({
        to,
        subject,
        template,
        context,
        locale,
        attachments: parsedAttachments,
        mailbox,
        ...(headers ? { headers } : {}),
      });

      await job.progress(100);
      return { sent: true, recipients, subject, messageId: result.messageId };
    } catch (error) {
      this.logger.error(`Failed to send email job ${job.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('send-bulk')
  async handleBulkSend(job: Job<{ emails: EmailJobData[] }>) {
    const { emails } = job.data;
    this.logger.log(`Processing bulk email job ${job.id}: ${emails.length} emails`);

    const results: Array<{ to: string | string[]; success: boolean; skipped?: boolean; error?: string }> = [];
    for (let i = 0; i < emails.length; i++) {
      try {
        const email = emails[i];

        // Check preferences for each recipient
        const shouldSend = await this.shouldSendEmail(email.userId, email.notificationType);
        if (!shouldSend) {
          this.logger.log(`Bulk email skipped for user ${email.userId} — disabled by preference`);
          results.push({ to: email.to, success: true, skipped: true });
          continue;
        }

        await this.emailService.sendEmail({
          to: email.to,
          subject: email.subject,
          template: email.template,
          context: email.context,
          locale: email.locale,
          mailbox: email.mailbox,
          ...(email.headers ? { headers: email.headers } : {}),
        });
        results.push({ to: email.to, success: true });
      } catch (error) {
        results.push({ to: emails[i].to, success: false, error: error.message });
      }
      await job.progress(Math.round(((i + 1) / emails.length) * 100));
    }

    const skipped = results.filter((r) => r.skipped).length;
    return { total: emails.length, sent: results.filter((r) => r.success && !r.skipped).length, skipped, failed: results.filter((r) => !r.success).length };
  }
}
```

`apps/backend/src/modules/email/email.service.ts` — six edits, each anchored on exact existing text:

(1) In `SendEmailOptions`, replace

```ts
  mailbox?: 'careers' | 'default';
}

@Injectable()
export class EmailService {
```

with

```ts
  mailbox?: 'careers' | 'default';
  /**
   * Extra RFC-822 headers, passed to nodemailer (`headers`) and to the Gmail
   * MailComposer alike, on every transport of the fallback chain. First user:
   * RFC 8058 one-click unsubscribe on website newsletter mail (WP3a). Never
   * put addresses or secrets here that the template does not already carry.
   */
  headers?: Record<string, string>;
}

@Injectable()
export class EmailService {
```

(2) Replace the line

```ts
    const { to, subject, template, context, attachments, locale = 'en', mailbox } = options;
```

with

```ts
    const { to, subject, template, context, attachments, locale = 'en', mailbox, headers } = options;
```

(3) IR SMTP call — replace

```ts
          const res = await this.irEmailConfig.sendViaSmtp(resolved, {
            to,
            subject,
            html,
            attachments: bufferAttachments,
          });
```

with

```ts
          const res = await this.irEmailConfig.sendViaSmtp(resolved, {
            to,
            subject,
            html,
            attachments: bufferAttachments,
            ...(headers ? { headers } : {}),
          });
```

(4) Careers Gmail call — replace

```ts
        const res = await this.googleConfig.sendGmail({
          to,
          subject,
          html,
          attachments: bufferAttachments,
          from: resolved?.isActive ? irFrom : undefined,
        });
```

with

```ts
        const res = await this.googleConfig.sendGmail({
          to,
          subject,
          html,
          attachments: bufferAttachments,
          from: resolved?.isActive ? irFrom : undefined,
          ...(headers ? { headers } : {}),
        });
```

(5) Default-mailbox Gmail call — replace

```ts
          fromImpersonated: true,
          attachments: attachments?.map((a) => ({
            filename: a.filename,
            content: typeof a.content === 'string' ? Buffer.from(a.content) : a.content,
            contentType: a.contentType,
          })),
        });
```

with

```ts
          fromImpersonated: true,
          attachments: attachments?.map((a) => ({
            filename: a.filename,
            content: typeof a.content === 'string' ? Buffer.from(a.content) : a.content,
            contentType: a.contentType,
          })),
          ...(headers ? { headers } : {}),
        });
```

(6) Global SMTP `sendMail` — replace

```ts
        attachments: attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      });

      this.logger.log(`Email sent: ${template} → ${recipients} (messageId: ${result.messageId})`);
```

with

```ts
        attachments: attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
        ...(headers ? { headers } : {}),
      });

      this.logger.log(`Email sent: ${template} → ${recipients} (messageId: ${result.messageId})`);
```

`apps/backend/src/modules/integrations/google-workspace-config.service.ts` — in `sendGmail`'s opts type, replace

```ts
    references?: string;
  }): Promise<{ messageId: string; threadId: string | null }> {
```

with

```ts
    references?: string;
    /** Extra RFC-822 headers (e.g. List-Unsubscribe, WP3a) — MailComposer emits them verbatim. */
    headers?: Record<string, string>;
  }): Promise<{ messageId: string; threadId: string | null }> {
```

and in the `MailComposer` literal, replace

```ts
      attachments: opts.attachments,
    })
      .compile()
```

with

```ts
      attachments: opts.attachments,
      ...(opts.headers ? { headers: opts.headers } : {}),
    })
      .compile()
```

`apps/backend/src/modules/email/ir-email-config.service.ts` — in `SendPayload`, replace

```ts
  attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>;
}
```

with

```ts
  attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>;
  /** Extra RFC-822 headers (e.g. List-Unsubscribe, WP3a). */
  headers?: Record<string, string>;
}
```

and in `sendViaSmtp`, replace

```ts
      attachments: payload.attachments,
    });
    return { messageId: result.messageId };
```

with

```ts
      attachments: payload.attachments,
      ...(payload.headers ? { headers: payload.headers } : {}),
    });
    return { messageId: result.messageId };
```

**3b — `WEBSITE_SITE_URL` (RC11).**

`apps/backend/src/modules/website/website-site-url.ts`:
```ts
import { ConfigService } from '@nestjs/config';

import type { WebsiteLocale } from './dto/website-form-submit.dto';

/**
 * Public base of the marketing site (jobsadmire.com), read per call from env
 * (WP3a, RC11/RC28). Every link Operations prints for a website VISITOR starts
 * here: newsletter confirm/unsubscribe (Task 9), the autoresponder CTAs
 * (Task 10) and WP3c's revalidate call. Staff-facing links (the notify
 * service, the second-human mails) point at the Operations inbox through
 * `APP_URL` instead. Both compose files map it; both `.env` examples and
 * DEPLOYMENT.md document it; nothing hard-codes the host.
 */
export const WEBSITE_SITE_URL_ENV = 'WEBSITE_SITE_URL';
export const WEBSITE_SITE_URL_FALLBACK = 'https://www.jobsadmire.com';

export function websiteSiteUrl(config: ConfigService): string {
  const raw = config.get<string>(WEBSITE_SITE_URL_ENV)?.trim();
  return (raw || WEBSITE_SITE_URL_FALLBACK).replace(/\/+$/, '');
}

/** TR is the root locale of the site, EN lives under `/en` (next-intl, website repo). */
export function websiteLocalePath(siteUrl: string, locale: WebsiteLocale, path: string): string {
  return `${siteUrl}${locale === 'en' ? '/en' : ''}${path}`;
}
```

`docker-compose.yml` — insert after the line `      APP_URL: ${APP_URL:-http://localhost:4000}`:
```yaml
      # Base of the links Operations prints for website visitors (newsletter
      # confirm/unsubscribe pages, autoresponder CTAs live on the marketing site).
      WEBSITE_SITE_URL: ${WEBSITE_SITE_URL:-http://localhost:3000}
```

`docker-compose.vps.yml` — insert after the line `      APP_URL: ${APP_URL:-https://operations.jobsadmire.com}`:
```yaml
      WEBSITE_SITE_URL: ${WEBSITE_SITE_URL:-https://www.jobsadmire.com}
```

`.env.example` — insert after the line `APP_URL=http://localhost:4000`:
```
# Public base of the marketing site (www.jobsadmire.com in prod). Newsletter
# confirm/unsubscribe links and website autoresponder CTAs point here; WP3c's
# revalidate call reuses it. Both compose files map it — a value only in .env
# never reaches the container.
WEBSITE_SITE_URL=http://localhost:3000
```

`.env.production.example` — insert after the line `CORS_ORIGINS=https://operations.jobsadmire.com` (RC18):
```
# Public base of the marketing site — every link Operations writes into a visitor
# mail (newsletter confirm/unsubscribe, autoresponder CTA) starts here. Mapped in
# docker-compose.vps.yml with this same default; set it beside WEBSITE_MODULE_ENABLED.
WEBSITE_SITE_URL=https://www.jobsadmire.com
```

`docs/DEPLOYMENT.md` — in the environment-variable table, directly after Task 2's row that begins `| Flags | \`WEBSITE_MODULE_ENABLED\` — **defaults \`false\`** on the VPS (WP3a, 2026-09-19) |` insert this single row (RC18 — Task 12's docs guard pins the `| Website | \`WEBSITE_SITE_URL\`` prefix and writes no second row):

```markdown
| Website | `WEBSITE_SITE_URL` — VPS `.env` value `https://www.jobsadmire.com` (WP3a, 2026-09-19) | The public site's base URL for every link Operations writes into a visitor mail: newsletter confirm/unsubscribe (`GET {WEBSITE_SITE_URL}[/en]/newsletter/confirm?token=…`, RFC 8058 `List-Unsubscribe`) and the autoresponder CTAs; WP3c's revalidate service reads the same variable. Read through `websiteSiteUrl(config)` (`modules/website/website-site-url.ts`, fallback `https://www.jobsadmire.com`, trailing slash stripped) by `WebsiteNewsletterService` and `WebsiteAutoresponderService` — the notify service links to the Operations inbox through `APP_URL` instead. Mapped in `docker-compose.vps.yml` as `${WEBSITE_SITE_URL:-https://www.jobsadmire.com}` and in `docker-compose.yml` as `${WEBSITE_SITE_URL:-http://localhost:3000}` (pinned by `website-site-url.spec.ts`), so the code push needs no `.env` line — set it in `.env` together with the flag (same `up -d backend`). Not a secret; never a token. Tokens, the website's Turnstile secret and the second-human recipient are NOT env: they live encrypted in `website_integration_config` via Website → Integrations |
```

**3c — newsletter module code.**

`apps/backend/src/modules/website/newsletter/newsletter-token.ts`:
```ts
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

/** Double opt-in window. */
export const NEWSLETTER_CONFIRM_TTL_MS = 48 * 60 * 60 * 1000;

/** Website paths the mail links point at (TR root, `/en` prefix for EN). WP2 implements them. */
export const NEWSLETTER_PATHS = { confirm: '/newsletter/confirm', unsubscribe: '/newsletter/unsubscribe' } as const;

/** Manual fallback in the mailto: half of List-Unsubscribe (I12: never a silent no-op). */
export const NEWSLETTER_CONTACT_EMAIL = 'info@jobsadmire.com';

/** 24 random bytes → 32 url-safe chars. Only its hash is stored. */
export function newConfirmToken(): string {
  return randomBytes(24).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Domain-separated HMAC key derived from ENCRYPTION_KEY — never the raw key. */
function unsubscribeKey(secret: string): Buffer {
  return createHash('sha256').update(`website-newsletter-unsubscribe:${secret}`).digest();
}

/**
 * Stateless unsubscribe token `<subscriberId>.<hmac>`: valid for the life of
 * the row, so a link in an old newsletter keeps working (RFC 8058 needs that;
 * RC12: nothing about it is stored on the row).
 */
export function signUnsubscribeToken(subscriberId: string, secret: string): string {
  const sig = createHmac('sha256', unsubscribeKey(secret)).update(subscriberId).digest('base64url');
  return `${subscriberId}.${sig}`;
}

/** Returns the subscriber id when the signature verifies, null otherwise. */
export function verifyUnsubscribeToken(token: string, secret: string): string | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0 || dot === token.length - 1) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  const expected = createHmac('sha256', unsubscribeKey(secret)).update(id).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? id : null;
}
```

`apps/backend/src/modules/website/newsletter/website-newsletter.service.ts`:
```ts
import {
  BadRequestException,
  GoneException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebsiteSubscriberStatus } from '@prisma/client';
import { isEmail } from 'class-validator';

import { PrismaService } from '../../../prisma/prisma.service';
import { hashIpOrNull, IP_HASH_DEV_SALT } from '../../../common/utils/ip-hash.util';
import { NotificationsService } from '../../notifications/notifications.service';
import type { WebsiteLocale } from '../dto/website-form-submit.dto';
import { websiteLocalePath, websiteSiteUrl } from '../website-site-url';
import {
  NEWSLETTER_CONFIRM_TTL_MS,
  NEWSLETTER_CONTACT_EMAIL,
  NEWSLETTER_PATHS,
  hashToken,
  newConfirmToken,
  signUnsubscribeToken,
  verifyUnsubscribeToken,
} from './newsletter-token';

const SUBJECTS = {
  confirm: {
    en: 'Please confirm your JobsAdmire newsletter subscription',
    tr: 'JobsAdmire bülten aboneliğinizi onaylayın',
  },
  welcome: {
    en: 'Welcome to the JobsAdmire newsletter',
    tr: 'JobsAdmire bültenine hoş geldiniz',
  },
} as const;

export interface NewsletterSubscribeInput {
  email: string;
  locale: WebsiteLocale;
  /** Hashed with IP_HASH_SALT before it touches the row (never the address itself). */
  visitorIp: string | null;
  /** The privacy text version the visitor accepted (D11 consent evidence). */
  consentVersion: string | null;
}

export type NewsletterSubscribeOutcome = 'CONFIRMATION_SENT' | 'ALREADY_CONFIRMED';
export type NewsletterConfirmOutcome = 'CONFIRMED' | 'ALREADY_CONFIRMED';
export type NewsletterUnsubscribeOutcome = 'UNSUBSCRIBED' | 'ALREADY_UNSUBSCRIBED' | 'UNKNOWN';

/**
 * Newsletter double opt-in (WP3a, P4 / D14). Public submitters have no User
 * row, so every mail goes through `queueEmail` directly (never the
 * dispatcher) from the DEFAULT mailbox, with an explicit locale (the
 * careers-public autoresponder forgot it and ships EN only). Every mail
 * carries RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post`, and every
 * link points at the WEBSITE (`WEBSITE_SITE_URL`), which forwards the token
 * to this API server-side with the write token (I12).
 *
 * Controls against abuse of the confirm mail: a CONFIRMED address is never
 * mailed again; identical payloads inside an hour collapse into one
 * submission (core dedupe, P8); the per-form abuse trip (P10) caps the rest.
 */
@Injectable()
export class WebsiteNewsletterService {
  private readonly logger = new Logger(WebsiteNewsletterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── links + headers ──────────────────────────────────────────────────

  private secret(): string {
    const key = this.config.get<string>('ENCRYPTION_KEY');
    if (!key) throw new ServiceUnavailableException('ENCRYPTION_KEY is not configured.');
    return key;
  }

  siteUrl(): string {
    return websiteSiteUrl(this.config);
  }

  confirmUrl(locale: WebsiteLocale, token: string): string {
    return `${websiteLocalePath(this.siteUrl(), locale, NEWSLETTER_PATHS.confirm)}?token=${encodeURIComponent(token)}`;
  }

  unsubscribeUrl(locale: WebsiteLocale, subscriberId: string): string {
    const token = signUnsubscribeToken(subscriberId, this.secret());
    return `${websiteLocalePath(this.siteUrl(), locale, NEWSLETTER_PATHS.unsubscribe)}?token=${encodeURIComponent(token)}`;
  }

  /** RFC 8058 one-click + RFC 2369 mailto fallback. */
  listUnsubscribeHeaders(unsubscribeUrl: string): Record<string, string> {
    return {
      'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:${NEWSLETTER_CONTACT_EMAIL}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    };
  }

  private asLocale(value: string | null | undefined): WebsiteLocale {
    return value === 'en' ? 'en' : 'tr';
  }

  // ─── subscribe (called by the NEWSLETTER handler) ─────────────────────

  async subscribe(args: NewsletterSubscribeInput): Promise<{ subscriberId: string; outcome: NewsletterSubscribeOutcome }> {
    const email = (args.email ?? '').trim().toLowerCase();
    if (!email || email.length > 254 || !isEmail(email)) {
      // The catalog refuses this before the submission row exists (RC4); reaching
      // here is a programming error, not a visitor error.
      throw new BadRequestException({ code: 'NEWSLETTER_INVALID_EMAIL', message: 'Please enter a valid e-mail address.' });
    }

    const existing = await this.prisma.websiteSubscriber.findUnique({ where: { email } });
    if (existing?.status === WebsiteSubscriberStatus.CONFIRMED) {
      return { subscriberId: existing.id, outcome: 'ALREADY_CONFIRMED' };
    }

    const token = newConfirmToken();
    const salt = this.config.get<string>('IP_HASH_SALT', IP_HASH_DEV_SALT);
    const data = {
      status: WebsiteSubscriberStatus.PENDING,
      locale: args.locale,
      confirmTokenHash: hashToken(token),
      confirmExpiresAt: new Date(Date.now() + NEWSLETTER_CONFIRM_TTL_MS),
      confirmedAt: null,
      unsubscribedAt: null,
      consentVersion: args.consentVersion,
      ipAddressHash: hashIpOrNull(args.visitorIp, salt),
    };
    const row = existing
      ? await this.prisma.websiteSubscriber.update({ where: { id: existing.id }, data })
      : await this.prisma.websiteSubscriber.create({ data: { email, ...data } });

    // The confirm mail IS the outcome: if it cannot be queued the handler
    // fails, the submission row goes FAILED and the inbox can re-run it
    // (a re-run reissues a token — nothing here depends on the first one).
    const unsubscribeUrl = this.unsubscribeUrl(args.locale, row.id);
    await this.notifications.queueEmail({
      to: email,
      subject: SUBJECTS.confirm[args.locale],
      template: 'website-newsletter-confirm',
      context: {
        siteUrl: this.siteUrl(),
        confirmUrl: this.confirmUrl(args.locale, token),
        unsubscribeUrl,
        expiresInHours: NEWSLETTER_CONFIRM_TTL_MS / 3_600_000,
      },
      locale: args.locale,
      mailbox: 'default',
      headers: this.listUnsubscribeHeaders(unsubscribeUrl),
    });
    this.logger.log(`Newsletter confirmation queued for subscriber ${row.id} (${args.locale})`);
    return { subscriberId: row.id, outcome: 'CONFIRMATION_SENT' };
  }

  // ─── confirm / unsubscribe (public door routes: write token + subscriber token) ─

  async confirm(token: string): Promise<{ outcome: NewsletterConfirmOutcome }> {
    const row = await this.prisma.websiteSubscriber.findFirst({ where: { confirmTokenHash: hashToken(token ?? '') } });
    if (!row || row.status === WebsiteSubscriberStatus.UNSUBSCRIBED) {
      throw new BadRequestException({
        code: 'NEWSLETTER_TOKEN_INVALID',
        message: 'This confirmation link is not valid. Please subscribe again.',
      });
    }
    if (row.status === WebsiteSubscriberStatus.CONFIRMED) return { outcome: 'ALREADY_CONFIRMED' };
    if (!row.confirmExpiresAt || row.confirmExpiresAt.getTime() < Date.now()) {
      throw new GoneException({
        code: 'NEWSLETTER_TOKEN_EXPIRED',
        message: 'This confirmation link has expired. Please subscribe again.',
      });
    }

    // The hash is kept so a second click is ALREADY_CONFIRMED, not "invalid".
    await this.prisma.websiteSubscriber.update({
      where: { id: row.id },
      data: { status: WebsiteSubscriberStatus.CONFIRMED, confirmedAt: new Date(), confirmExpiresAt: null },
    });

    const locale = this.asLocale(row.locale);
    const unsubscribeUrl = this.unsubscribeUrl(locale, row.id);
    try {
      await this.notifications.queueEmail({
        to: row.email,
        subject: SUBJECTS.welcome[locale],
        template: 'website-newsletter-welcome',
        context: { siteUrl: this.siteUrl(), unsubscribeUrl },
        locale,
        mailbox: 'default',
        headers: this.listUnsubscribeHeaders(unsubscribeUrl),
      });
    } catch (e) {
      // The subscription is confirmed regardless; the welcome mail is a courtesy.
      this.logger.warn(`Failed to queue newsletter welcome for ${row.id}: ${(e as Error).message}`);
    }
    return { outcome: 'CONFIRMED' };
  }

  async unsubscribe(token: string): Promise<{ outcome: NewsletterUnsubscribeOutcome }> {
    const id = verifyUnsubscribeToken(token ?? '', this.secret());
    if (!id) {
      throw new BadRequestException({ code: 'NEWSLETTER_TOKEN_INVALID', message: 'This unsubscribe link is not valid.' });
    }
    const row = await this.prisma.websiteSubscriber.findUnique({ where: { id } });
    if (!row) return { outcome: 'UNKNOWN' };
    if (row.status === WebsiteSubscriberStatus.UNSUBSCRIBED) return { outcome: 'ALREADY_UNSUBSCRIBED' };
    await this.prisma.websiteSubscriber.update({
      where: { id: row.id },
      data: { status: WebsiteSubscriberStatus.UNSUBSCRIBED, unsubscribedAt: new Date(), confirmExpiresAt: null },
    });
    this.logger.log(`Newsletter subscriber ${row.id} unsubscribed`);
    return { outcome: 'UNSUBSCRIBED' };
  }
}
```

`apps/backend/src/modules/website/dto/newsletter-token.dto.ts`:
```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/** `?token=` on the three newsletter routes: the confirm token from the mail link, or the signed unsubscribe token. */
export class NewsletterTokenQueryDto {
  @ApiProperty({ description: 'Confirm token from the mail link, or the signed unsubscribe token (<subscriberId>.<hmac>).' })
  @IsString()
  @Length(16, 200)
  token: string;
}
```

`apps/backend/src/modules/website/newsletter/website-public-newsletter.controller.ts`:
```ts
import { Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '../../../common/decorators/public.decorator';
import { NewsletterTokenQueryDto } from '../dto/newsletter-token.dto';
import { WebsiteApiGuard } from '../guards/website-api.guard';
import { WebsiteModuleEnabledGuard } from '../guards/website-module-enabled.guard';
import { WebsiteNewsletterService } from './website-newsletter.service';

/**
 * Newsletter confirm / unsubscribe (I12, RC3) — the third public controller of
 * the door. The WEBSITE calls these server-side with the write token after the
 * visitor (or their mail client, for RFC 8058 one-click) opens the link; the
 * per-subscriber token is the second factor. `@Public()` + the two guards at
 * class level, in that order, exactly like the forms door (P1, P7).
 *
 * `@Throttle` numbers are inert until RATE_LIMITING_ENABLED (rate-limit.guard.ts)
 * and documented here as the intended per-IP cap.
 */
@ApiTags('Website (public door)')
@Public()
@UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard)
@Controller('website/v1/newsletter')
export class WebsitePublicNewsletterController {
  constructor(private readonly newsletter: WebsiteNewsletterService) {}

  @Get('confirm')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: '[website] Confirm a double opt-in token → { outcome: CONFIRMED | ALREADY_CONFIRMED }; 400 invalid, 410 expired' })
  async confirm(@Query() query: NewsletterTokenQueryDto) {
    return { data: await this.newsletter.confirm(query.token) };
  }

  @Get('unsubscribe')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: '[website] Unsubscribe by signed token (idempotent) → { outcome: UNSUBSCRIBED | ALREADY_UNSUBSCRIBED | UNKNOWN }' })
  async unsubscribe(@Query() query: NewsletterTokenQueryDto) {
    return { data: await this.newsletter.unsubscribe(query.token) };
  }

  /**
   * RFC 8058: a mail client POSTs `List-Unsubscribe=One-Click` to the website's
   * unsubscribe URL; the website forwards it here as a POST with the token in
   * the query and no body. 200, same outcome shape as the GET.
   */
  @Post('unsubscribe')
  @HttpCode(200)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: '[website] One-click unsubscribe (RFC 8058 forward) → { outcome }' })
  async unsubscribeOneClick(@Query() query: NewsletterTokenQueryDto) {
    return { data: await this.newsletter.unsubscribe(query.token) };
  }
}
```

`apps/backend/src/modules/website/handlers/newsletter.handler.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { WebsiteFormKind } from '@prisma/client';

import { WebsiteNewsletterService } from '../newsletter/website-newsletter.service';
import {
  WebsiteFormHandler,
  WebsiteFormHandlerInput,
  WebsiteFormHandlerRegistry,
  WebsiteFormHandlerResult,
} from '../website-form-handler';

const NEWSLETTER_DETAIL = { skipNotification: true, skipAutoresponder: true } as const;

/**
 * NEWSLETTER (P4, RC4). A sign-up is not a lead: no WEBSITE_FORM_RECEIVED, no
 * generic autoresponder — the double opt-in confirmation IS the mail, so the
 * core is told to skip both. The `newsletter` WebsiteForm row is seeded
 * inactive (D14, Task 6's seed), so the core refuses the door before this runs
 * until counsel clears it. Visitor input never throws here (the catalog
 * validated `email` before the row); only infrastructure failures propagate,
 * which the core records as a FAILED row and the inbox can re-run.
 */
@Injectable()
export class NewsletterHandler implements WebsiteFormHandler {
  readonly kinds: readonly WebsiteFormKind[] = [WebsiteFormKind.NEWSLETTER];

  constructor(
    registry: WebsiteFormHandlerRegistry,
    private readonly newsletter: WebsiteNewsletterService,
  ) {
    registry.register(this);
  }

  async handle(input: WebsiteFormHandlerInput): Promise<WebsiteFormHandlerResult> {
    if (input.dryRun) {
      return { ok: true, detail: { ...NEWSLETTER_DETAIL, dryRun: true } };
    }
    const email = typeof input.fields.email === 'string' ? input.fields.email.trim() : '';
    if (!email) {
      return { ok: false, error: 'newsletter: fields.email is missing after catalog validation', detail: { ...NEWSLETTER_DETAIL } };
    }
    const res = await this.newsletter.subscribe({
      email,
      locale: input.locale,
      visitorIp: input.visitorIp,
      consentVersion: input.consentVersion,
    });
    return {
      ok: true,
      createdEntityType: 'subscriber',
      createdEntityId: res.subscriberId,
      detail: {
        ...NEWSLETTER_DETAIL,
        alreadyReceived: res.outcome === 'ALREADY_CONFIRMED',
        outcome: res.outcome,
        email,
      },
    };
  }
}
```

Templates (inline styles like `applicant-confirmation.hbs`; `{{appUrl}}` logo comes from `base.hbs`; no enum values in copy):

`apps/backend/src/modules/email/templates/website-newsletter-confirm.hbs`:
```hbs
<h2>One more step</h2>
<p>Thanks for signing up to the JobsAdmire newsletter. Please confirm your e-mail address so we know it is really you:</p>
<a href="{{confirmUrl}}" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Confirm my subscription</a>
<p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
  This link is valid for {{expiresInHours}} hours. If you did not sign up, you can ignore this
  e-mail — nothing will be sent to you — or <a href="{{unsubscribeUrl}}" style="color:#6b7280;">remove your address</a> right away.
</p>
<p style="color: #6b7280; font-size: 13px;">JobsAdmire · <a href="{{siteUrl}}" style="color:#6b7280;">{{siteUrl}}</a></p>
```

`apps/backend/src/modules/email/templates/website-newsletter-confirm.tr.hbs`:
```hbs
<h2>Son bir adım</h2>
<p>JobsAdmire bültenine kaydolduğunuz için teşekkürler. Gerçekten siz olduğunuzdan emin olmak için e-posta adresinizi onaylayın:</p>
<a href="{{confirmUrl}}" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Aboneliğimi onayla</a>
<p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
  Bu bağlantı {{expiresInHours}} saat geçerlidir. Kaydolmadıysanız bu e-postayı yok sayabilirsiniz — size hiçbir şey
  gönderilmeyecek — ya da adresinizi hemen <a href="{{unsubscribeUrl}}" style="color:#6b7280;">kaldırabilirsiniz</a>.
</p>
<p style="color: #6b7280; font-size: 13px;">JobsAdmire · <a href="{{siteUrl}}" style="color:#6b7280;">{{siteUrl}}</a></p>
```

`apps/backend/src/modules/email/templates/website-newsletter-welcome.hbs`:
```hbs
<h2>You're in</h2>
<p>Your subscription to the JobsAdmire newsletter is confirmed. You will hear from us about hiring seasons, work-permit changes and new source countries — a few times a year, never more than monthly.</p>
<a href="{{siteUrl}}" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">Visit jobsadmire.com</a>
<p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
  Changed your mind? <a href="{{unsubscribeUrl}}" style="color:#6b7280;">Unsubscribe with one click</a> — the same link is in every newsletter.
</p>
```

`apps/backend/src/modules/email/templates/website-newsletter-welcome.tr.hbs`:
```hbs
<h2>Aramıza hoş geldiniz</h2>
<p>JobsAdmire bülten aboneliğiniz onaylandı. İşe alım sezonları, çalışma izni değişiklikleri ve yeni kaynak ülkeler hakkında yılda birkaç kez — asla ayda birden fazla olmamak üzere — sizden haberdar edeceğiz.</p>
<a href="{{siteUrl}}" class="btn" style="display:inline-block;padding:12px 28px;margin:16px 0;background-color:#23285a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">jobsadmire.com'u ziyaret edin</a>
<p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
  Fikriniz mi değişti? <a href="{{unsubscribeUrl}}" style="color:#6b7280;">Tek tıkla abonelikten çıkın</a> — aynı bağlantı her bültende yer alır.
</p>
```

**3d — wiring.**

`apps/backend/src/modules/website/website.module.ts` — add these four import lines directly after the line `import { WebsiteFormsEvidenceController } from './website-forms-evidence.controller';` (Task 8's last import):

```ts
import { NotificationsModule } from '../notifications/notifications.module';
import { NewsletterHandler } from './handlers/newsletter.handler';
import { WebsiteNewsletterService } from './newsletter/website-newsletter.service';
import { WebsitePublicNewsletterController } from './newsletter/website-public-newsletter.controller';
```

and replace the whole `@Module({...})` decorator as Task 8 left it with the block below. It is Task 8's block with `NotificationsModule` appended to `imports` (this task is the first that injects `NotificationsService`; the module is not `@Global()`), `WebsitePublicNewsletterController` appended to `controllers` and `WebsiteNewsletterService, NewsletterHandler` appended to `providers` — nothing is reordered, `exports` is unchanged; the constructor and its `registry.register({...})` literal stay byte-for-byte as Task 1 wrote them.

```ts
@Module({
  // SalesModule exports InquiryService (sales.module.ts:54) — the ONE-WAY edge the
  // website → Sales handler needs; Sales never imports website (the
  // call-center.module.ts precedent). RedisModule, ConfigModule and
  // ActivitiesModule are @Global().
  // WP3a Task 8: one-way edges. CareersPublicModule now exports
  // CareersPublicService; its controllers are already registered by
  // AppModule, so importing it here duplicates no route. UploadModule
  // exports UploadService (fraud evidence, CV URL rebuild).
  // WP3a Task 9: NotificationsModule (not global) exports NotificationsService,
  // which the newsletter service queues its confirm/welcome mails through;
  // Task 10's notify/autoresponder services inject from the same import.
  imports: [ConfigModule, PrismaModule, PermissionsModule, SalesModule, CareersPublicModule, UploadModule, NotificationsModule],
  controllers: [
    WebsiteStatusController,
    WebsiteIntegrationsController,
    WebsitePublicController,
    WebsiteFormsInboxController,
    WebsitePublicUploadsController,
    WebsiteFormsEvidenceController,
    // Task 9: the third public controller (RC3) — @Public() + [flag, token] guards at class level.
    WebsitePublicNewsletterController,
  ],
  // Both guards are providers of THIS module (the call-center.module.ts rule)
  // so DI can hand WebsiteApiGuard its config service. The forms core's three
  // collaborators (notify / abuse / autoresponder) are the contract shells
  // Task 10 fills in (RC20). WebsiteInquiryHandler is never injected anywhere —
  // Nest still instantiates every listed provider at boot, and its constructor
  // registers it with WebsiteFormHandlerRegistry.
  providers: [
    WebsiteModuleEnabledGuard,
    WebsiteApiGuard,
    WebsiteIntegrationConfigService,
    WebsitePingService,
    WebsiteCaptchaService,
    WebsiteFormHandlerRegistry,
    WebsiteNotifyService,
    WebsiteAbuseService,
    WebsiteAutoresponderService,
    WebsiteFormsService,
    WebsiteInquiryHandler,
    WebsiteFormsInboxService,
    CareersApplyHandler,
    FraudReportHandler,
    WebsiteFraudEvidenceService,
    // Task 9
    WebsiteNewsletterService,
    NewsletterHandler,
  ],
  exports: [WebsiteIntegrationConfigService],
})
```

(`WebsiteNotifyService`, `WebsiteAbuseService`, `WebsiteAutoresponderService` are the three providers Task 6 registers for `WebsiteFormsService`'s final constructor — RC6/RC20; Task 10 fills in their bodies without touching this list and appends only its two crons. `PrismaService`, `ConfigService` and `NotificationsService` — everything `WebsiteNewsletterService` needs — resolve from the global `PrismaModule`, the global `ConfigModule` and the `NotificationsModule` import added here.)

`apps/backend/test/permissions/website-conformance.spec.ts` (Task 1's spec, as Task 8 left it) — add, directly after the line `import { WebsiteFormsEvidenceController } from '../../src/modules/website/website-forms-evidence.controller';` (Task 8's last import):

```ts
import { WebsitePublicNewsletterController } from '../../src/modules/website/newsletter/website-public-newsletter.controller';
```

and replace the `const CONTROLLERS = [` line as Task 8 left it,

```ts
const CONTROLLERS = [WebsiteStatusController, WebsiteIntegrationsController, WebsitePublicController, WebsiteFormsInboxController, WebsitePublicUploadsController, WebsiteFormsEvidenceController];
```

with

```ts
const CONTROLLERS = [
  WebsiteStatusController,
  WebsiteIntegrationsController,
  WebsitePublicController,
  WebsiteFormsInboxController,
  WebsitePublicUploadsController,
  WebsiteFormsEvidenceController,
  WebsitePublicNewsletterController,
];
```

Nothing else in that spec changes: the three newsletter routes are class-level `@Public()` (counted as `public` by the scanner, `permission-conformance.service.ts:182-187`), so `errors` stays `[]` and `undecorated` stays `[]`.

- [ ] **Step 4: Run tests**

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website/apps/backend
npx jest src/modules/email src/modules/notifications src/modules/website test/permissions/website-conformance.spec.ts test/permissions/website-door-conformance.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2
npx tsc --noEmit -p tsconfig.json
```
Expected: all green — the existing `email.service.spec.ts`, `ir-email-config.service.spec.ts`, `event-dispatcher.spec.ts` and the Task 6/7/8 website specs unchanged; the eight new specs pass (site-url 9, token 2, service 11, handler 6, controller 2, email-headers 4, processor 3 = 37 tests); `website-conformance.spec.ts` scans seven controllers with `errors: []`; `repo-invariants.spec.ts` route census sees three more public routes; `tsc` clean (the `headers` option is typed on all five layers).

Then one live check in local dev (one docker stack at a time — P12): `docker compose up -d backend`, then `curl -i -X POST http://localhost:4001/api/website/v1/forms/newsletter -H "Authorization: Bearer <write token>" -H 'Content-Type: application/json' -d '{"locale":"tr","consentVersion":"privacy-2026-09","captchaToken":"x","fields":{"email":"test@example.com"}}'` — expect **404** (`This form is not accepting submissions.` — the seed row is inactive, D14). Flip it once for the check only: `docker compose exec postgres psql -U jobsadmire -d jobsadmire_ops_dev -c "UPDATE website_forms SET \"isActive\" = true WHERE \"formKey\" = 'newsletter';"`, repeat the POST — expect 200 with `status: "HANDLED"`, and the backend log shows `[SMTP disabled] Would send "website-newsletter-confirm" → test@example.com (subject: JobsAdmire bülten aboneliğinizi onaylayın …)`; then `curl -i "http://localhost:4001/api/website/v1/newsletter/confirm?token=nope-nope-nope-nope" -H "Authorization: Bearer <write token>"` → 400 `NEWSLETTER_TOKEN_INVALID`; revert with `UPDATE website_forms SET "isActive" = false WHERE "formKey" = 'newsletter';`.

- [ ] **Step 5: Commit** (two commits: the pipeline change is cross-module and reviewable alone)

```bash
cd /Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website
git add apps/backend/src/modules/notifications/notifications.service.ts \
  apps/backend/src/modules/notifications/processors/email.processor.ts \
  apps/backend/src/modules/notifications/processors/email.processor.headers.spec.ts \
  apps/backend/src/modules/email/email.service.ts \
  apps/backend/src/modules/email/email-headers.spec.ts \
  apps/backend/src/modules/email/ir-email-config.service.ts \
  apps/backend/src/modules/integrations/google-workspace-config.service.ts
git commit -m "feat(email): optional custom headers from queueEmail through EmailService to SMTP and Gmail

Adds headers?: Record<string,string> to queueEmail/queueBulkEmail,
EmailJobData, SendEmailOptions, IR SendPayload and sendGmail, emitted by
nodemailer and MailComposer alike on every transport of the fallback
chain. First consumer: RFC 8058 List-Unsubscribe headers on website
newsletter mail (WP3a).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"

git add apps/backend/src/modules/website/website-site-url.ts \
  apps/backend/src/modules/website/website-site-url.spec.ts \
  apps/backend/src/modules/website/newsletter \
  apps/backend/src/modules/website/dto/newsletter-token.dto.ts \
  apps/backend/src/modules/website/handlers/newsletter.handler.ts \
  apps/backend/src/modules/website/handlers/newsletter.handler.spec.ts \
  apps/backend/src/modules/website/website.module.ts \
  apps/backend/test/permissions/website-conformance.spec.ts \
  apps/backend/src/modules/email/templates/website-newsletter-confirm.hbs \
  apps/backend/src/modules/email/templates/website-newsletter-confirm.tr.hbs \
  apps/backend/src/modules/email/templates/website-newsletter-welcome.hbs \
  apps/backend/src/modules/email/templates/website-newsletter-welcome.tr.hbs \
  docker-compose.yml docker-compose.vps.yml .env.example .env.production.example docs/DEPLOYMENT.md
git commit -m "feat(website): NEWSLETTER double opt-in with confirm/unsubscribe routes, RFC 8058 headers and WEBSITE_SITE_URL

WebsiteSubscriber double opt-in behind Task 6's handler contract: hashed
48 h confirm token, stateless HMAC unsubscribe token, GET/GET/POST
website/v1/newsletter/{confirm,unsubscribe} on their own public controller
(write token + subscriber token), EN/TR confirm + welcome templates from
the default mailbox with explicit locale, List-Unsubscribe +
List-Unsubscribe-Post on every send, dry-run on the test token. Links point
at the marketing site via WEBSITE_SITE_URL (both compose files, both .env
examples, the DEPLOYMENT.md env row; VPS default https://www.jobsadmire.com). The newsletter
WebsiteForm stays seeded inactive until counsel clears it (D14).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Docs for this task (PRD §5.12: the newsletter paragraph with the three routes, the `WEBSITE_SITE_URL` prose and the `headers` pipeline note; §7.10 / runbook: six public routes across three controllers per RC3) belong to Task 12's same-change-set docs commit (P13, RC10/RC11) — Task 12 copies the route list and env defaults from the Interfaces block above. The DEPLOYMENT.md `WEBSITE_SITE_URL` env row is THIS task's (RC18), written in 3b.

---

---

