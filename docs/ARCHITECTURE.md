# Architecture — JobsAdmire Website

Expands plan §3.1. Full rationale: `docs/superpowers/specs/2026-09-18-website-programme-design.md`.

## Routing

`app/[locale]/(site)/…` — App Router, RSC by default, client islands only where interactive (calculator, forms, filters, marquee). Covers the 14 pages, careers detail (`/kariyer/[slug]`), legal pages, `/tesekkurler`, and the two newsletter routes. `generateStaticParams` for locale × static slugs.

`proxy.ts` runs in this order, with an explicit matcher (never the default catch-all):

1. CMS-driven redirects (Operations-sourced in Phase B; a static table from `docs/redirects.md` in Phase A) — single-hop, permanent, no chains (D21).
2. next-intl locale resolution (`as-needed` mode, `defaultLocale: 'tr'`, `localeDetection: false`, cookie `ja_locale`).

A tagged revalidate route (`/api/revalidate`) sits **outside** the proxy matcher — it must never be redirected or locale-rewritten.

**Spike rule (D5):** `proxy.ts` + `as-needed` + localized `pathnames` at the TR root + a tagged revalidate route outside the matcher must be green by end of WP1 day 1. If red, the stack drops to Next 15 + next-intl 3 without further debate — see the stack trip-wire in plan §12.

## Content adapter (D7, D23)

`src/content/` exposes `getBundle(locale)` behind two adapters, switchable **per route**:

- `LOCAL` — reads `design-package/strings/*.json` and page data directly. Phase A default for every route.
- `OPS` — fetches the Operations bundle (`GET /api/website/v1/bundle?locale=…`, read token). Phase B default, flipped per route in WP5/WP7b.

Every bundle — from either adapter — validates against `contract/website-bundle.v1.schema.json`. This directory is **frozen** at the end of WP1 (schema + a golden fixture), hash-pinned by a spec in both this repo and `jobsadmire-operations`; a hash mismatch fails the build in whichever repo is stale. A failed or schema-invalid fetch is counted, reported to Sentry, and feeds `/api/site-health`.

`t(id)` — the string accessor — honours the six deliberately-empty Turkish fragments (`docs/CONTENT-MODEL.md`) and must not substitute English for an intentionally empty `tr` value.

**Fixtures for pool, stories, and representatives can never be served in production.** A spec (e.g. `src/content/adapter.spec.ts`) pins which adapter and which data source is legal per environment — this is the enforcement mechanism behind the `CLAUDE.md` hard rule, not a convention.

## Freshness: ISR tags and time floors (D8)

Tags: `site:${locale}`, `page:${slug}`, `blog`, `pool`, `openings`, `stories`, `sitemap`. Publishing in Operations triggers serial tag revalidation with a **read-back** — the site is re-fetched after revalidation and shown LIVE/NOT_LIVE in the Operations dashboard; NOT_LIVE is red with a Retry action and raises `WEBSITE_REVALIDATE_FAILED`.

Every ISR route **also** carries a time floor independent of tag revalidation — belt-and-braces against a missed or failed webhook:

| Content class                                 | Time floor                                 |
| --------------------------------------------- | ------------------------------------------ |
| Pages, strings, collections (general content) | 900 s                                      |
| Candidate pool stats, careers openings        | 300 s                                      |
| Representatives (list view)                   | 60 s                                       |
| Representatives single-record view            | **`no-store`** — no floor, no cache at all |

The representatives single-record view is the one exception to "everything is ISR": a revoked representative's `status` must take effect immediately, with zero cache window, because the page exists specifically so an employer can check whether someone is still authorised (design-package `docs/crm-feed.md`).

## Forms flow (D11)

`postForm` server action → Operations `POST /api/website/v1/forms/:formKey` with the write token.

- **Captcha (Turnstile) behavior is asymmetric by design:** an **auth failure** (bad/expired write token) fails closed — the submission is rejected. A **captcha infrastructure failure** (secret missing, Cloudflare unreachable) **degrades**: the submission is accepted behind a honeypot + dedupe + rate cap, flagged `captchaDegraded`, and raises `WEBSITE_FORMS_UNAVAILABLE`; WhatsApp is promoted from secondary to co-primary CTA on the affected form until the degraded state clears.
- **Dedupe:** `(formKey, requestHash, hourBucket)` — a repeat submission within the same hour bucket returns the prior result rather than creating a duplicate `Inquiry`/submission row.
- **Success:** navigate to `/tesekkurler?form=<key>` (never an inline panel — D13's accepted design delta; this is where the Ads conversion fires).
- **Failure — the visitor-side fallback panel, not a spinner or fake success:** a WhatsApp deep link prefilled with whatever the visitor already typed (name, phone, email, message), a Sentry error report, and a client-side beacon so the failure is visible in `/api/site-health` even if Sentry is also down. Leads are explicitly **not** buffered on Vercel — if Operations is unreachable, the visitor gets the fallback panel immediately, not a retry queue.
- Handler types: `INQUIRY` (with the new `Inquiry.contactName` column), `CAREERS_APPLY`, `NEWSLETTER` (double opt-in, RFC 8058 confirm/unsubscribe), `FRAUD_REPORT`, `CALLBACK`, `VISIT`, `CALCULATOR_QUOTE`.

## D19 — desktop-scale port checklist

The design package is authored at 1.333× and relies on `html { zoom: 0.75 }` above 1101px (see `design-package/README.md`, "Read this before measuring anything"). This repo **normalises instead of scaling**: every desktop value is multiplied by 0.75 once, at the token source, and the zoom rule is dropped entirely.

When porting any desktop value from the package, check off:

- [ ] Scale **lengths** (font sizes, paddings, margins, radii, fixed widths/heights) that apply above the 1101px breakpoint.
- [ ] Scale **every term inside every `clamp()`**, including the `vw` coefficient — e.g. `clamp(40px, 4.6vw, 66px)` → `clamp(30px, 3.45vw, 49.5px)`. Scaling only the min/max and leaving the `vw` term unscaled is the most common way to get this subtly wrong (the package README calls this out explicitly).
- [ ] **Never** scale breakpoint values themselves (1101px, 1100px, 900px, 700px, 560px, 460px stay exactly as authored).
- [ ] **Never** scale any value that already applies at ≤1100px — mobile/tablet in the package is authored 1:1, not at 1.333×.
- [ ] Desktop body-small is raised to **11px** post-scale (owner may keep the scaled 9.75px instead — pending §10 item 8).
- [ ] After porting a page, run the token snapshot + width sweep (part of `npm run gate`) to catch any value that drifted from its scaled source.

## Design system

`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19), `Archivo` via `next/font/google` (`latin` + `latin-ext` subsets, self-hosted), primitives (`FormField` with label/error/`aria-live`, `Dialog`, `PausableMarquee`, `SkipLink`), shared chrome (`SlimBar`, `Header`/`Nav`, `SocialRail`, `WhatsAppFab`, `MobileBottomBar`, `Footer`, `LanguageHint`, `StickyCtaBar`, `ConsentBanner`) — identical on every page per the package's own warning against chrome drift.

Pages: one server component per page, client islands only where interactive; inline SVG icon sprite (no icon font/library, per the package); local flag assets; the sourcing map pre-rendered from `design-package/design/source-map.js`'s country list; local QR generation (replacing the package's `qr.js`); a per-slot image policy with the LCP element named explicitly per page (the content-readiness gate refuses to launch a page whose named LCP slot is still a placeholder — D26).

## Calculator engine

`src/lib/calculator/` — pure functions over the published `RateConfig` (versioned, `effectiveFrom`/`reviewDueAt`, D17). Output formatted through `formatTRY` (D18). Tested against the design package's worked figures. The homepage teaser and the full Cost Calculator page share this engine — no duplicated math. Dated labels ("2026 rates", "Updated January 2026") render from `RateConfig.effectiveFrom`, never hard-typed (D17's numbers-out-of-copy lint blocks publishing a string that hard-types a rate or metric value).

## Operations surface

- `GET /api/site-health` — bundle age, last revalidate timestamp, canary image HEAD check, Operations `ping`, tripped-forms state, handler failures, lead-drought flag. Watched by an external monitor to the owner's phone (D25).
- `POST /api/revalidate` — Operations-triggered, secret-authenticated, serial tag revalidation with read-back.
- Vercel Cron: **synthetic-lead** every 30 min through the real form path (test token class), pinging an external heartbeat — a missed ping pages the owner. **Daily digest** email sent from Vercel — its _absence_ is the alarm, not its content.
- Client submit-failure beacon feeding `/api/site-health`'s "handler failures" signal (belt-and-braces alongside Sentry).

## Sentry

`sendDefaultPii: false`; `beforeSend` scrubs server-action arguments and auth/cookie headers; `tracePropagationTargets` restricted to this site's own origin; tunnel is validated and rate-limited; traces sampled at 10%; **no Session Replay**.

## Environments

| Environment | Branch/trigger                | Domain                                   | Tokens                                     | Indexing                            |
| ----------- | ----------------------------- | ---------------------------------------- | ------------------------------------------ | ----------------------------------- |
| Production  | `main`, after Phase A cutover | jobsadmire.com                           | read + write (current class)               | indexed                             |
| Preview     | every PR/branch               | `*.vercel.app`, `staging.jobsadmire.com` | preview/test classes only                  | `noindex`, Deployment Protection on |
| Local       | `npm run dev`                 | localhost:3000                           | dev tokens against Operations on port 4001 | n/a                                 |

`staging.jobsadmire.com` is a **stable preview alias** — Turnstile is configured with a real widget for it (not the test-key pair used for local dev), so form testing on staging exercises the real captcha path.
