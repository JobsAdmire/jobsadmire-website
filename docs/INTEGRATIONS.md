# Integrations — JobsAdmire Website

The catalogue below is plan §4, with phase tags: **[A]** Phase A, **[B]** Phase B, **[v1.1]** the deferred engagement. Full integration mechanics: `docs/ARCHITECTURE.md` (adapter, forms flow, ISR/floors). Token threat model and rotation: bottom of this doc.

## Catalogue

| #   | Integration                                                 | Phase                | Direction                                    | Auth                           |
| --- | ----------------------------------------------------------- | -------------------- | -------------------------------------------- | ------------------------------ |
| I1  | Bundle, pages, blog, nav, settings, redirects, sitemap data | B                    | Ops → Website                                | read token                     |
| I2  | Revalidate + read-back                                      | B                    | Ops → Website                                | secret                         |
| I3  | Draft preview                                               | B                    | Website → Ops                                | signed token                   |
| I4  | Forms (13–15)                                               | A                    | Website → Ops                                | write token + Turnstile        |
| I5  | Staff application + CV proxy                                | A                    | Website → Ops → `CareersPublicService.apply` | write token                    |
| I6  | Openings list/detail                                        | A                    | Ops → Website (proxy)                        | none                           |
| I7  | Candidate pool                                              | B stats / v1.1 cards | CRM → Ops → Website                          | CRM service token (Ops-held)   |
| I8  | Permit-approval stats                                       | v1.1                 | CRM → Ops → Website                          | same as I7                     |
| I9  | Representatives                                             | v1.1                 | Ops → Website                                | read token                     |
| I10 | Success stories (cards)                                     | B                    | Ops → Website                                | read token                     |
| I11 | Media                                                       | B                    | public bucket → Vercel                       | anonymous GET                  |
| I12 | Newsletter confirm/unsubscribe                              | A                    | Website → Ops                                | write token + subscriber token |
| I13 | Notifications                                               | A (B adds two more)  | Ops internal                                 | n/a                            |
| I14 | Autoresponders                                              | A                    | Ops `queueEmail`                             | n/a                            |
| I15 | Portal links                                                | A                    | Website → portal.jobsadmire.com              | none                           |
| I16 | Analytics/Ads/consent                                       | A                    | Website ↔ Google                             | n/a                            |
| I17 | Turnstile                                                   | A                    | Website widget + Ops verify                  | secret in Ops                  |
| I18 | Sentry                                                      | A                    | Website → Sentry                             | DSN                            |
| I19 | Site-health, synthetic lead, digest, uptime monitors        | A                    | Vercel ↔ external monitor                    | heartbeat URLs                 |
| I20 | WhatsApp deep links                                         | A                    | Website → wa.me                              | n/a                            |

## I1 — Bundle, pages, blog, nav, settings, redirects, sitemap data

**Direction:** Ops → Website. **Auth:** read token (current + previous class), timing-safe, fail closed. **Shape:** contract v1, see `contract/` once frozen in WP1 — `GET /api/website/v1/bundle?locale=<tr|en>`, validated against `contract/website-bundle.v1.ts` (a Zod schema — there is no JSON-Schema file). **Failure/degraded:** last-good ISR content served past its time floor; failure counted, Sentry-reported, surfaces on `/api/site-health`.

## I2 — Revalidate + read-back

**Direction:** Ops → Website. **Auth:** shared secret (`REVALIDATE_SECRET`). **Shape:** `POST /api/revalidate` with tag(s); response confirms the read-back fetch succeeded. **Failure/degraded:** `WEBSITE_REVALIDATE_FAILED` alert; content stays on its time floor until manually retried from the Operations dashboard (LIVE/NOT_LIVE indicator).

## I3 — Draft preview

**Direction:** Website → Ops. **Auth:** HMAC-signed, 30-minute preview token. **Shape:** contract v1, see `contract/` once frozen. **Failure/degraded:** expired/forged token → 401, no draft content leaks; negative-tested at WP5-gate.

## I4 — Forms (13–15)

**Direction:** Website → Ops. **Auth:** write token + Turnstile. **Shape (as built, WP3a door / WP2a client — `src/forms/post.ts`):** `POST ${OPS_API_URL}/api/website/v1/forms/:formKey`, `Authorization: Bearer <write|test|previous-write>`, `Content-Type: application/json`, optional `X-Website-Visitor-Ip` (first hop, must pass `isIP`) and `X-Website-Visitor-Ua` (≤500). Body, whitelist + `forbidNonWhitelisted` (an extra top-level key is a 400): `{ locale: 'tr'|'en', consentVersion: string ≤40 (required — `CONSENT_VERSION`), captchaToken?: ≤2048, honeypot?: ≤500 (literal key), sourcePath?: ≤300, fields: Record<string, string | string[]> }`; unknown keys **inside** `fields` are silently dropped. Keys: the ten `FORM_KEYS` (`WEBSITE_FORM_KEYS` on the Ops side, same order, case-sensitive). Responses: **200** `{ data: { id, formKey, status: 'RECEIVED'|'HANDLED'|'FAILED'|'SPAM', isTest, replayed, captchaDegraded, error: string|null } }` (FAILED is still 200 — row durable, `error` non-null only for a visitor-side cause); **400** `{ message: 'Invalid form fields', errors: string[] }`; **401** `Invalid website token.` / `Website intake is not configured.`; **403** `Captcha verification failed. Please retry.`; **404** bare (module off) / `Unknown form.` / `This form is not accepting submissions.` (newsletter until D14); **429** `{ statusCode: 429, message, reason: 'tripped', fallback: 'whatsapp' }`. Order of evaluation: form → trip → whitelist → honeypot → captcha → row; dedupe on `(formKey, requestHash = sha256(formKey, isTest, honeypot, locale, sorted fields), hourBucket)` — `sourcePath` is not hashed. Uploads (`src/forms/uploads.ts`, W29): careers CV `POST /api/careers/upload-cv` (public, multipart `file`, client-declared `application/pdf`, ≤5 MB, the sent filename must end in `.pdf` because the key inherits its extension) → 201 `{ data: { key } }` → `fields.cvKey`; fraud evidence `POST /api/website/v1/uploads/fraud-evidence` (write token, multipart `file` **only** — any other part is a 400 — ≤8 MB, content-sniffed JPEG/PNG/WEBP/PDF, one file per call) → 201 `{ data: { key | null (test-class dry run), mimeType, sizeBytes, dryRun } }` → ≤3 `fields.evidenceKeys`. Those are the doors' caps; the site itself refuses any file over **3 MB** before calling either door and uploads **one file per server-action call** (W73/W116 — a Vercel function body is capped at 4.5 MB and the server-action body at 4 MB, 1 MB of which is left for the other fields; `docs/ARCHITECTURE.md` § Forms flow). Field catalog per key: `apps/backend/src/modules/website/website-form-catalog.ts` in Operations. **Catalog v1.1 (Task 8, on Operations `main`; per-field rules in Ops PRD §5.12):** four optional fields, each sent as a string **inside `fields`** — the same names at the top level are a 400 from the envelope pipe. `city` on `hire`, `workers`, `partner`, `callback`, `contact` (trimmed, C0 controls stripped, blank = absent, ≤120 → `city is too long (max 120)`; `careers.city` stays ≤100); `track` on `partner` only (`'sourcing' | 'institute'`, exact lower-case → else `track must be one of sourcing, institute`; the Partner page's HR-agency track still posts `hire` with `iAm: 'hr_agency'`; both tracks classify as `SOURCING_PARTNER`); `topic` on `contact` only (`'hire' | 'partner' | 'permit' | 'job' | 'other'`, exact lower-case → else `topic must be one of hire, partner, permit, job, other`; `callback.topic` stays free text ≤200); `portfolioUrl` on `careers` only (W161: a missing scheme gets `https://` **before** the ≤500 cap is applied → `portfolioUrl is too long (max 500)`; rejected as `portfolioUrl must be a web address`: any control character or whitespace, a digits-only or phone-like value, `user:pass@` credentials, a non-http(s) scheme, or a host that is neither dotted with a 2+-character last label nor an IP literal — private IPs stay accepted by design because staff only ever see the value as plain text, never a link; stored as typed plus the scheme and shown to staff as the last cover-letter paragraph `Portfolio: <url>`; W56 still holds: an opening with `portfolioRequired` answers 200 `status: 'FAILED'` + `'This position requires at least one portfolio document'`, so those openings keep the apply-by-e-mail branch). An over-long enum value is `<field> is too long (max 40)`. A v1.1 name on a form that does not list it is dropped, never an error. The accepted values are part of the normalised `fields` and therefore of `requestHash`. The field 400 lists every reason at once and runs before the honeypot and the captcha, so it never spends the Turnstile token. The per-form table joins this section in T14. **Failure/degraded:** `docs/ARCHITECTURE.md` § Forms flow — the W3/W74 retry rule (one retry, only after a connection-level failure; a timeout or a 5xx is final; one 9 s deadline) — mirrored by Ops PRD §5.12 since Task 8, captcha asymmetry, the visitor fallback panel on every non-success.

## I5 — Staff application + CV proxy

**Direction:** Website → Ops → `CareersPublicService.apply`. **Auth:** write token. **Shape:** the `careers` key of I4 (`CAREERS_APPLY`; `openingSlug` + `cvKey` required); the CV is uploaded first through the public `POST /api/careers/upload-cv` from the page's async `toFields` (`uploadCv`, `src/forms/uploads.ts`), never from the browser to storage. **Failure/degraded:** same fallback panel as I4; a refused CV is a `file` error under the CV input; a closed opening or residency rule comes back as 200 + `status: 'FAILED'` + visitor-safe `error`. `CareersPublicModule` exports `apply` (done in WP3a).

## I6 — Openings list/detail

**Direction:** Ops → Website (proxy). **Auth:** none (public data). **Shape:** existing public careers API, proxied through the Website bundle for the careers pages. **Failure/degraded:** careers pages show last-good ISR content (300 s floor) or an empty state if never fetched.

## I7 — Candidate pool

**Direction:** CRM → Ops → Website. **Auth:** CRM service token, held by Ops (`CrmClient`), never reaches the website. **Phase:** stats-only aggregate in Phase B (`GET /candidates/stats` on the CRM side); per-profile cards deferred to v1.1 behind D2's consent gates. **Shape:** contract v1, see `contract/` once frozen; CRM-side shape lives in `jobsadmire-crm`'s `website-feed` module (not yet built — see `jobsadmire-crm/CLAUDE.md` / PRD §20). **Failure/degraded:** pool section shows a max-aged snapshot (`WebsiteCandidateSnapshot.maxAge`) or hides itself; small-cell floor of 10 enforced server-side, never client-side.

## I8 — Permit-approval stats

**Direction:** CRM → Ops → Website. **Auth:** same CRM service token as I7. **Phase:** v1.1. **Shape:** `GET /permit-approvals/stats` on the CRM side, filtered to `stageType = WORK_PERMIT_APPROVAL AND status = COMPLETED AND outcome = COMPLETED`. **Failure/degraded:** Success Stories ticker/counters fall back to static CMS metrics (the v1 default, since this integration doesn't exist until v1.1).

## I9 — Representatives

**Direction:** Ops → Website. **Auth:** read token. **Phase:** v1.1. **Shape:** contract v1 — see design-package `docs/crm-feed.md` for the field-level shape this replaces (`level`, `status`, `contact`, `canSign`), reimplemented as `WebsiteRepresentative` rows in Ops rather than a raw CRM feed. **Failure/degraded:** the single-record view is `no-store` — an unreachable Ops means the page shows an error state, never a stale "still authorised" result (see the no-cache exception in `docs/ARCHITECTURE.md`).

## I10 — Success stories (cards)

**Direction:** Ops → Website. **Auth:** read token. **Phase:** B (cards only — no proof images until v1.1). **Shape:** part of the I1 bundle; `WebsiteCollection` item type `successStory`. **Failure/degraded:** 900 s time floor, last-good content on failure.

## I11 — Media

**Direction:** public bucket (`website-public` on the files vhost) → Vercel via `next/image`. **Auth:** anonymous `GetObject` only — no `ListBucket`, so the bucket is never enumerable. **Shape:** `remotePatterns` scoped in `next.config.ts`; `minimumCacheTTL`; per-slot `sizes`; static fallback for a missing asset. **Failure/degraded:** broken image → static fallback, never a broken-image icon on a hero/LCP slot (content-readiness gate blocks launch on this).

## I12 — Newsletter confirm/unsubscribe

**Direction:** Website → Ops. **Auth:** write token + a per-subscriber token in the confirm/unsubscribe link. **Shape:** `NEWSLETTER` handler (double opt-in) plus RFC 8058 one-click unsubscribe headers on every marketing email. **Failure/degraded:** confirm/unsubscribe link failure shows an error with a manual `info@jobsadmire.com` fallback, never a silent no-op. **Rule (WP2a; Task 8 records it in Ops PRD §5.12 — W46):** the website's `/abone-onay` / `/abonelikten-cik` pages forward the token to the door **only on the visitor's click** — never on page load, prefetch or render — because a mail-link scanner fetching the link would otherwise confirm or unsubscribe on the human's behalf (the door keeps the token's hash and answers `ALREADY_CONFIRMED` / `ALREADY_UNSUBSCRIBED` on a repeat, so the token is not consumed — the first hit acting is the risk); the RFC 8058 one-click POST is forwarded as a POST by a route handler. Shape as built: `GET /api/website/v1/newsletter/confirm?token=` → 200 `{ data: { outcome: 'CONFIRMED'|'ALREADY_CONFIRMED' } }` / 400 `NEWSLETTER_TOKEN_INVALID` / 410 expired (48 h); `GET|POST …/newsletter/unsubscribe?token=` → 200 `{ data: { outcome: 'UNSUBSCRIBED'|'ALREADY_UNSUBSCRIBED'|'UNKNOWN' } }` / 400. These routes run for real under any token class — never point a test-class smoke at a real subscriber token.

**Website side as built (T13):** `/abone-onay` · `/en/newsletter/confirm` and `/abonelikten-cik` · `/en/newsletter/unsubscribe` (the `pathnames` entries Ops `NEWSLETTER_PATHS` mirrors verbatim — never change one side alone; `src/lib/newsletter/one-click.test.ts` pins this side) render a button; the visitor's click runs a server action that forwards the `?token=` with the write token (`forwardNewsletterToken`, W74/W117 retry rule) — nothing is forwarded on load, prefetch or render. The RFC 8058 `List-Unsubscribe=One-Click` POST to the unsubscribe page URL (urlencoded or multipart) is rewritten by `src/proxy.ts` to `POST /api/newsletter/unsubscribe` and forwarded as a body-less POST; it answers 200 `{ outcome }`, 400 (implausible token, not a one-click body, door 400/410), 503 (`unconfigured`/`off`/`unauthorized`), 502 (unreachable), always `Cache-Control: private, no-store`. 400/410/`UNKNOWN`/unreachable show the manual `info@jobsadmire.com` + WhatsApp fallback. The e2e suite uses a dummy token only (`e2e-dummy-token-0000000000`): door-less it ends in `unavailable`/503, on `staging` the door refuses it (`invalid`/400).

## I13 — Notifications

**Direction:** internal to Ops. **Events:** `WEBSITE_FORM_RECEIVED`, `WEBSITE_FORMS_UNAVAILABLE` (Phase A); `WEBSITE_PUBLISH_REQUESTED`, `WEBSITE_REVALIDATE_FAILED` (Phase B). **Auth:** n/a (internal). **Consumers:** sales/editors/owner, with a **second human as fallback recipient** for every website event class (D25, D26 — no default person, pending §10 item 10).

## I14 — Autoresponders

**Direction:** Ops `queueEmail`. **Auth:** n/a. **Shape:** `.hbs` templates, EN/TR, per form handler. **Failure/degraded:** send failure is logged and alerts; a live-tested send is part of the WP3a gate — this is not allowed to be assumed working.

## I15 — Portal links

**Direction:** Website → portal.jobsadmire.com. **Auth:** none — a plain link out from the `/portal-girisi` chooser page (T13); the hamburger, slim-bar and footer portal rows point at that page internally (`/portal-login`, W88), never at the portal host. No API traffic at all. **Failure/degraded:** n/a — it's a hyperlink.

## I16 — Analytics/Ads/consent

**Direction:** Website ↔ Google (GTM, GA4, Ads). **Auth:** n/a (public IDs). See `docs/ANALYTICS.md` for the full schema and Consent Mode v2 behaviour.

## I17 — Turnstile

**Direction:** Website widget (site key, public) + Ops verify (secret, held in Ops). **Auth:** secret in Ops only, never in the browser bundle beyond the public site key. **Failure/degraded:** see I4 — captcha degrades rather than blocking submissions outright.

## I18 — Sentry

**Direction:** Website → Sentry. **Auth:** DSN. See `docs/ARCHITECTURE.md` for scrubbing/sampling config (`sendDefaultPii: false`, no Replay, 10% trace sampling).

## I19 — Site-health, synthetic lead, digest, uptime monitors

**Direction:** Vercel ↔ external monitor. **Auth:** heartbeat URLs (unguessable, not secret-grade). See `docs/OPERATING.md` for the full alarm surface.

## I20 — WhatsApp deep links

**Direction:** Website → wa.me. **Auth:** none. **Shape:** `https://wa.me/<number>?text=<prefilled>` — the same mechanism the design package uses for every form's mock submission, kept as a co-primary/secondary CTA and the visitor fallback panel's escape hatch (I4).

## Token threat model + rotation runbook (D12, WP5-gate)

**Model:** every Website↔Operations token is server-held (never in a browser bundle except the Turnstile _site_ key, which is public by design). Tokens exist in three classes — read, write, preview (signed, 30-min TTL) — each with a **current and previous** value live simultaneously, so rotation never has a hard cutover moment. Outbound base URLs (`OPS_API_URL`, etc.) come from environment variables only, **never from a database row** — this closes the SSRF path where a compromised Operations admin account could repoint the site at an attacker-controlled URL by editing a settings row.

**Threats covered at WP5-gate (negative tests):** forged or expired preview token; a fuzzed bundle response asserted to carry no contact/partner field; revalidate target asserted un-redirectable; captcha-degraded path asserted to flag and alert (not silently accept); token rotation asserted unable to demote the current token without a live proof against `/api/site-health` passing on the new credential first.

**Rotation runbook (outline — full steps land in WP5-gate):**

1. Issue the new token value in Operations' Integrations screen (`website:MANAGE_KEYS` only, AES-GCM `*Enc` storage, no reveal after entry).
2. New token becomes the "next" value; current stays live.
3. **Gate:** the new credential must pass `/api/site-health` (or the relevant integration's own health check) before the current one is demoted — rotation cannot brick the site (D12).
4. Promote next → current; demote current → previous (grace window).
5. Previous is revoked only after the grace window with no traffic on it.
6. Every rotation is logged in `docs/DEPLOYMENT.md`'s environment-variable history (names only, never values) and in Operations' `ActivityLogger`.
