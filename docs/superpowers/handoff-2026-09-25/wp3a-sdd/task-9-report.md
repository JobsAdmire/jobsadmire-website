# Task 9 report — NEWSLETTER double opt-in, confirm/unsubscribe public routes, RFC 8058 headers through `queueEmail`, EN/TR templates, `WEBSITE_SITE_URL` end to end

Base `86e7320` → head `14f7e4e`, worktree `/Users/agentfaraz/projects/admiregroup/jobsadmire/jobsadmire-operations-website`, branch `website/wp3a-intake`. Not pushed.

## Commits

| SHA | Subject |
|---|---|
| `e48d6f4` | feat(email): optional custom headers from queueEmail through EmailService to SMTP and Gmail |
| `de5d5e4` | feat(website): NEWSLETTER double opt-in with confirm/unsubscribe routes, RFC 8058 headers and WEBSITE_SITE_URL |
| `14f7e4e` | test(email): prove custom headers reach the wire on all four transport paths |

Commit 1 is the brief's pipeline commit and compiles/tests on its own (18 suites / 294 green before any website file existed). Commit 2 is the brief's feature commit (+ the X6 door-conformance append the task ordered). Commit 3 is test-only: the task asked for proof the headers reach the *wire format* per transport; the brief's `email-headers.spec.ts` only proved they reached the `sendGmail`/`sendViaSmtp` calls, so I extended it after the two planned commits rather than rewriting history.

## What I implemented

**3a — e-mail pipeline (`headers?: Record<string, string>` end to end)**
- `notifications.service.ts`: `queueEmail` options + `queueBulkEmail` element type (both anchors matched verbatim).
- `processors/email.processor.ts`: `EmailJobData.headers?`; `handleSend` and `handleBulkSend` forward `...(headers ? { headers } : {})`. The resulting file is byte-identical to the brief's printed final file (checked by script).
- `email.service.ts`: six anchored edits — `SendEmailOptions.headers?`, the destructuring line, IR SMTP call, careers Gmail call, default-mailbox Gmail call, global SMTP `sendMail`.
- `google-workspace-config.service.ts`: `sendGmail` opts gain `headers?`; the `MailComposer` literal spreads `headers` beside `inReplyTo`/`references` (threading intact — proven by the wire-format spec).
- `ir-email-config.service.ts`: `SendPayload.headers?`; `sendViaSmtp` spreads it into `sendMail`.

**3b — `WEBSITE_SITE_URL` (RC11/RC18/RC28)**
- `src/modules/website/website-site-url.ts`: `WEBSITE_SITE_URL_ENV`, `WEBSITE_SITE_URL_FALLBACK`, `websiteSiteUrl(config)` (trim, strip trailing slashes, fallback), `websiteLocalePath(siteUrl, locale, path)` (TR root, EN `/en`) — signatures exactly as the brief's Produces block, so Task 10 imports them unchanged.
- `docker-compose.yml` (`${WEBSITE_SITE_URL:-http://localhost:3000}` after `APP_URL`), `docker-compose.vps.yml` (`${WEBSITE_SITE_URL:-https://www.jobsadmire.com}`), `.env.example` (`http://localhost:3000` + comment), `.env.production.example` (`https://www.jobsadmire.com` after `CORS_ORIGINS`, comment says to set it beside `WEBSITE_MODULE_ENABLED`), `docs/DEPLOYMENT.md` one row directly after Task 2's `| Flags |` row, beginning `| Website | \`WEBSITE_SITE_URL\`` (Task 12's guard prefix).

**3c — newsletter code**
- `newsletter/newsletter-token.ts`: `NEWSLETTER_CONFIRM_TTL_MS` (48 h), `NEWSLETTER_PATHS` (**locale-keyed — see difference 1**), `NEWSLETTER_CONTACT_EMAIL`, `newConfirmToken` (24 random bytes → 32 url-safe chars), `hashToken` (sha256 hex), `signUnsubscribeToken` / `verifyUnsubscribeToken` (`<id>.<hmac>`, HMAC-SHA256 under a domain-separated key derived from `ENCRYPTION_KEY`, constant-time compare, id charset-checked).
- `newsletter/website-newsletter.service.ts`: `subscribe` (normalises the address, 400 `NEWSLETTER_INVALID_EMAIL` on a non-address as a programming-error guard, CONFIRMED → `ALREADY_CONFIRMED` with no mail, PENDING/UNSUBSCRIBED → fresh token + PENDING + cleared `confirmedAt`/`unsubscribedAt`, hashed IP via `hashIpOrNull(IP_HASH_SALT)`, consent version, queues `website-newsletter-confirm` from the default mailbox with explicit locale and both RFC 8058 headers), `confirm` (400 invalid / unsubscribed, 410 expired, second click `ALREADY_CONFIRMED`, welcome mail is best-effort and never undoes the confirmation), `unsubscribe` (400 on a bad signature, `UNKNOWN` for a missing row, idempotent `ALREADY_UNSUBSCRIBED`), plus `confirmUrl`, `unsubscribeUrl`, `listUnsubscribeHeaders`, `siteUrl`. Logs carry subscriber ids and locales only — never a token, hash or address.
- `dto/newsletter-token.dto.ts`: `NewsletterTokenQueryDto { token }` `@IsString() @Length(16, 200)`.
- `newsletter/website-public-newsletter.controller.ts`: `@ApiTags('Website (public door)') @Public() @UseGuards(WebsiteModuleEnabledGuard, WebsiteApiGuard) @Controller('website/v1/newsletter')`; `GET confirm`, `GET unsubscribe`, `POST unsubscribe` (`@HttpCode(200)`, no `@Body()` — the body a mail client sends is never read), each `@Header('Cache-Control', 'private, no-store')` (X6) and `@Throttle`, all returning `{ data: { outcome } }`.
- `handlers/newsletter.handler.ts`: `kinds = [NEWSLETTER]`, self-registers, `dryRun` → `{ ok: true, detail: { skipNotification, skipAutoresponder, dryRun } }`, missing e-mail → `ok: false` (never a throw), otherwise `createdEntityType: 'subscriber'` + `detail { skipNotification, skipAutoresponder, alreadyReceived, outcome, email }`; infrastructure errors propagate (FAILED row, re-runnable).
- Templates: `website-newsletter-confirm.hbs` / `.tr.hbs` (`{ siteUrl, confirmUrl, unsubscribeUrl, expiresInHours }`), `website-newsletter-welcome.hbs` / `.tr.hbs` (`{ siteUrl, unsubscribeUrl }`) — exactly the brief's copy; `nest-cli.json` already copies `modules/email/templates/**/*.hbs` so they ship in the prod image.

**3d — wiring**
- `website.module.ts`: four imports after Task 8's last import; `NotificationsModule` appended to `imports` (not `@Global()`, exports `NotificationsService`; it imports only Jwt/Bull/Prisma — no cycle), `WebsitePublicNewsletterController` appended to `controllers`, `WebsiteNewsletterService, NewsletterHandler` appended to `providers`; `exports` and the `registry.register({...})` literal untouched. The cumulative `@Module` block is printed below.
- `test/permissions/website-conformance.spec.ts` (RC15): import + `CONTROLLERS` now seven, multi-line as the brief prints it.
- `test/permissions/website-door-conformance.spec.ts` (X6): import + `CONTROLLERS` gains the newsletter controller; `report.public` 3 → 6 (`decorated` stays 5 — public routes are not "decorated"); the X6 `seen` list pins `confirm`, `unsubscribe`, `unsubscribeOneClick`; header doc-comment line records why.

### Cumulative `@Module` block (real file, `apps/backend/src/modules/website/website.module.ts`)

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

## Interface differences vs the brief and how they were resolved

1. **TR link slugs (the important one).** The brief's `NEWSLETTER_PATHS = { confirm: '/newsletter/confirm', unsubscribe: '/newsletter/unsubscribe' }` + `websiteLocalePath` prints `https://www.jobsadmire.com/newsletter/confirm?token=…` for a TR mail. The website (`jobsadmire-website/src/i18n/routing.ts` `pathnames`, D16, its PRD route table, SEO.md, PRIVACY.md) serves TR at `/abone-onay` and `/abonelikten-cik`; the internal key at the TR root lands on the `[...rest]` 404 catch-all — the primary locale's confirm flow would be dead. The task message explicitly directed the website-documented slugs, so: `NEWSLETTER_PATHS` is locale-keyed (`{ confirm: { tr: '/abone-onay', en: '/newsletter/confirm' }, unsubscribe: { tr: '/abonelikten-cik', en: '/newsletter/unsubscribe' } }` — a verbatim mirror of the website's two `pathnames` entries, pinned by a new cell in `newsletter-token.spec.ts`), `confirmUrl`/`unsubscribeUrl` index it by locale, and `websiteLocalePath` keeps the brief's exact signature/behaviour (its JSDoc now says the path must already be the locale's slug). EN links are unchanged (`/en/newsletter/confirm`, `/en/newsletter/unsubscribe`). Spec deltas: the two TR regexes in `website-newsletter.service.spec.ts` and the TR example in `website-site-url.spec.ts`; the `email-headers.spec.ts` sample header uses the TR slug. The DEPLOYMENT.md row spells out both locales' URLs. **Task 12 must copy the TR slugs, not `[/en]/newsletter/confirm`, into §5.12/§7.10.**
2. **X6** (not in the brief's controller code): `@Header('Cache-Control', 'private, no-store')` on all three routes, and the door-conformance append with `public` 3 → 6. The controller's own spec also pins the exact route set (verb, path, header) so a fourth route or a dropped header fails by name.
3. **Wire-format proof** (task text, beyond the brief's spec): commit 3 extends `email-headers.spec.ts` with four cells — global SMTP `sendMail`, IR `sendViaSmtp` → `sendMail` (threading untouched, no `headers` key when none given), `sendGmail` with `googleapis` mocked and the base64url `raw` decoded (real `MailComposer`; `List-Unsubscribe:`, `List-Unsubscribe-Post:`, `In-Reply-To:` and the impersonated `From:` all present), and a bare `MailComposer` cell pinning the option NAME (`headers`) since a misspelt option is silently ignored and every forwarding cell would still pass.
4. **Commit trailer**: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` as the task orders, not the brief's Fable trailer.
5. Every other anchor (16 pipeline edits, module imports/block, both `CONTROLLERS` lines, all five env/doc anchors) matched the final Task 6–8 files verbatim on the first attempt; each was applied by an exact-match script that fails on 0 or >1 hits, so nothing was guessed. The seed file and its spec were not touched.

## RED → GREEN

RED (`npx jest src/modules/website/website-site-url.spec.ts src/modules/website/newsletter src/modules/website/handlers/newsletter.handler.spec.ts src/modules/email/email-headers.spec.ts src/modules/notifications/processors/email.processor.headers.spec.ts --maxWorkers=2`): `Test Suites: 7 failed, 7 total · Tests: 2 failed, 1 passed, 3 total` — five `TS2307 Cannot find module` (`./website-site-url`, `./newsletter-token` ×2, `./website-newsletter.service`, `./website-public-newsletter.controller`, `./newsletter.handler`), `email-headers.spec` `TS2353 … 'headers' does not exist in type 'SendEmailOptions'`, `email.processor.headers.spec` failing on `send` and `send-bulk` (headers not forwarded) with `send without headers passes none` passing — exactly the brief's prediction.

GREEN (same command, `--verbose`): `Test Suites: 7 passed · Tests: 39 passed` (site-url 9, token 3, service 11, handler 6, controller 3, email-headers 4, processor 3). After commit 3, `email-headers.spec.ts` is 8 cells (`Tests: 8 passed`).

## Conformance / invariants / e-mail specs / typecheck

`npx jest src/modules/email src/modules/notifications src/modules/website test/permissions/website-conformance.spec.ts test/permissions/website-door-conformance.spec.ts test/permissions/repo-invariants.spec.ts --maxWorkers=2` → final run **`Test Suites: 50 passed, 50 total · Tests: 534 passed, 534 total`**:
- `website-conformance.spec.ts`: seven controllers scanned, `errors: []`, `undecorated: []`.
- `website-door-conformance.spec.ts`: `public: 6`, `decorated: 5`, X6 cell sees all three newsletter routes.
- `repo-invariants.spec.ts`: route census 0 undecorated, every verb accounted for once (the three new routes counted as class-level `@Public()`); catalog hash untouched (no new key).
- `website-env.spec.ts` (Task 2): still exactly one production reader of `WEBSITE_MODULE_ENABLED` — nothing new names it in a `.ts` string.
- Existing `email.service.spec.ts`, `ir-email-config.service.spec.ts`, `event-dispatcher.spec.ts`, Task 6's `website-forms.service.spec.ts`, Task 7's `website-forms.rerun.spec.ts`, Task 8's wiring spec: unchanged and green.
- One earlier full run showed `FAIL` for `email.service.spec.ts` and `event-dispatcher.spec.ts` with **0 failing tests** (490 counted instead of 530 — the two suites did not report); both passed alone and the full set passed on re-run. This is the runner-level flake Tasks 6 and 8 recorded; Task 13's gate should run the folder twice or serially.

`npx tsc --noEmit -p tsconfig.json` (apps/backend, specs included via `src/**/*`): exit 0 — run after commit 2 and again after commit 3.

Not run (per the task): docker boot, Next build, the full backend suite, the brief's live curl check (needs the local stack — deferred to Task 13 like Task 8's boot check; DI is pinned by the module block and by `website-conformance.spec.ts` scanning the real controller).

## Self-review

- **Completeness**: subscriber service + handler; three public routes incl. the RFC 8058 `POST`; `headers` through all four transport paths with wire-format proof; four templates; site-url helper + spec; `WEBSITE_SITE_URL` in both compose files, both `.env` examples and the DEPLOYMENT row; module wiring; both conformance `CONTROLLERS` lists; X6 on every route.
- **Quality**: no token/hash/address in any log line (only subscriber ids + locales; the app has no request-URL logging — Apache's access log on the VPS records query strings for every tokenised public route, careers included, which is pre-existing and outside this task); confirm token hashed at rest with a 48 h expiry (410 after); unsubscribe stateless, constant-time, domain-separated from `ENCRYPTION_KEY` (never the write token), idempotent, keeps working for the life of the row; `ServiceUnavailableException` when `ENCRYPTION_KEY` is unset (the integrations precedent) — from the handler that is an infrastructure failure → FAILED row; no hard-coded site URL outside the helper's fallback constant; CONFIRMED addresses are never re-mailed (mail-bomb control); `dryRun` returns before any read or write; the `POST` reads no body.
- **Discipline**: worktree only; no `git stash`; no push; no edit to the seed file/spec or to any Task 6–8 service; the only file outside the brief's list is `website-door-conformance.spec.ts` (X6, ordered by the task). One extra commit (test-only) beyond the brief's two, explained above.
- **Testing**: pristine — 50/50 suites, 534/534 tests on the final run, typecheck 0, working tree clean at `14f7e4e`.

## Concerns / carry-forwards

1. **Task 12 (docs)**: the newsletter paragraph and the §7.10 runbook must print the website's localised links — TR `{WEBSITE_SITE_URL}/abone-onay?token=…` / `/abonelikten-cik?token=…`, EN `/en/newsletter/confirm` / `/en/newsletter/unsubscribe` — not the brief's `[/en]/newsletter/confirm`. The DEPLOYMENT.md row already says so.
2. **Task 10**: `websiteLocalePath` places only the locale prefix; the autoresponder CTAs must pass the slug for the locale being printed (the website's `pathnames` table), the way `NEWSLETTER_PATHS` does — an internal route key at the TR root 404s on the site.
3. **WP2 (website)**: the `/abone-onay` and `/abonelikten-cik` pages must forward `?token=` server-side to `GET /api/website/v1/newsletter/confirm|unsubscribe`, and the unsubscribe route must also accept the RFC 8058 `POST` (body `List-Unsubscribe=One-Click`) and forward it to `POST …/unsubscribe?token=…` with no body, answering 200. Both pages `noindex`; SEO.md notes robots.ts should gain them in the same change.
4. `NewsletterTokenQueryDto` sits behind the global `forbidNonWhitelisted` pipe: any extra query parameter on the Ops call is a 400. The website constructs that call itself, so it must forward only `token`.
5. The runner-level jest flake (a suite reporting `FAIL` with zero failing tests) recurred once here — third sighting in WP3a.
