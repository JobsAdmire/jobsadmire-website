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

## Quality gate (D27)

`npm run gate` (`scripts/gate.sh`) runs **outside** the Vercel build — there is no Chrome there — against a URL: a preview deployment, or a local `next start`. Once per work package.

```bash
E2E_BASE_URL=https://<preview> REVALIDATE_SECRET=<the server's own secret> npm run gate
```

It runs, in order and never concurrently:

1. **Playwright**, both projects (`mobile` = Pixel 7, `desktop` = 1440×900), no filter — routing, redirects, SEO, thank-you/conversion, ops, smoke, plus the two gate sweeps below. `REVALIDATE_SECRET` is optional: without it the two token-dependent cases in `e2e/ops.spec.ts` skip themselves (R43) and `gate.sh` says so.
2. **axe** (`e2e/a11y.spec.ts`) over `GATE_ROUTES` (`e2e/routes.ts` — the public routes per locale; WP2 appends each page as it lands), tags `wcag2a wcag2aa wcag22aa`, zero violations. It runs under **both** projects on purpose: the hamburger, the mobile bottom bar and the footer accordions only exist at the mobile viewport.
3. **The width sweep** (`e2e/width-sweep.spec.ts`): no horizontal overflow at 1440/1280/1101/1100/900/700/560/460/390 — 1101 and 1100 straddle the D19 boundary.
4. **Lighthouse CI** (`lighthouserc.json`), mobile preset, 2 runs per path, on the four indexable gate paths (the list in `gate.sh` mirrors `e2e/routes.ts` minus the noindex `/tesekkurler`): performance ≥ 0.95, accessibility / best-practices / SEO = 1.0, LCP ≤ 2500 ms, CLS ≤ 0.1, TBT warn at 200 ms. Each `lhci collect` is `--additive`, otherwise it wipes the previous path's result and `lhci assert` would only ever see the last one.

**A failure is fixed in the component, never by lowering the assertion (D20).** The WP1 gate forced these, and they are the named deltas from the package's own pixels:

- The **CTA face is `blue-safe` (#1073a8)**, not the raw brand blue: white on #1899d5 is 3.2:1, which is AA for large text only — a 15 px button label is not large text. `blue` survives behind icons and as a hover/decorative surface.
- The **WhatsApp action is `success-text` (#12813c)**, not `success` (#16a34a, 3.3:1 under white) — one colour for the action in the mobile bar and the FAB.
- Footer **office hours are `white/55`** (5.9:1 on navy), not `white/40` (3.8:1); the language hint's dismiss button is `text-secondary`, not `text-tertiary` (4.25:1 on the tint strip).
- The **header's desktop row (nav + language switcher) appears only above 1101px**; below it the hamburger panel carries both. Below the D19 boundary the type scale is the authored 1:1 one, and the full row overflows the viewport (47 px at 1100, 125 px at 390) — the design package hides the same two at its own mobile breakpoint.

## Design system

`src/design/` — tokens (colour, type, radius, shadow per `design-package/README.md`'s Design Tokens section, scaled per D19), `Archivo` via `next/font/google` (`latin` + `latin-ext` subsets, self-hosted), primitives (`FormField` with label/error/`aria-live`, `Dialog`, `PausableMarquee`, `SkipLink`), shared chrome (`SlimBar`, `Header`/`Nav`, `SocialRail`, `WhatsAppFab`, `MobileBottomBar`, `Footer`, `LanguageHint`, `StickyCtaBar`, `ConsentBanner`) — identical on every page per the package's own warning against chrome drift.

Pages: one server component per page, client islands only where interactive; inline SVG icon sprite (no icon font/library, per the package); local flag assets; the sourcing map pre-rendered from `design-package/design/source-map.js`'s country list; local QR generation (replacing the package's `qr.js`); a per-slot image policy with the LCP element named explicitly per page (the content-readiness gate refuses to launch a page whose named LCP slot is still a placeholder — D26).

## Calculator engine

`src/lib/calculator/` — pure functions over the published `RateConfig` (versioned, `effectiveFrom`/`reviewDueAt`, D17). Output formatted through `formatTRY` (D18). Tested against the design package's worked figures. The homepage teaser and the full Cost Calculator page share this engine — no duplicated math. Dated labels ("2026 rates", "Updated January 2026") render from `RateConfig.effectiveFrom`, never hard-typed (D17's numbers-out-of-copy lint blocks publishing a string that hard-types a rate or metric value).

## Operations surface

- `GET /api/site-health` — `force-dynamic`, `Cache-Control: no-store`, watched by an external monitor to the owner's phone (D25). Shipped in WP1 (`src/app/api/site-health/`): both bundles loaded through the adapter, plus `lastRevalidate` and `opsPing`; answers `{ ok, reasons, checks, contractVersion, source, commit, at }` with **200 when ok, 503 otherwise**. Reason codes and the `skip` rule are in `docs/OPERATING.md`. Canary image HEAD, tripped-forms state, handler failures and lead-drought join it in WP3a/WP5/WP6.
- `POST /api/revalidate` — Operations-triggered, secret-authenticated tag revalidation (`src/app/api/revalidate/`). `Authorization: Bearer $REVALIDATE_SECRET`, body `{ tags: string[] }` (1–50, each `/^[a-z0-9:_-]+$/`); **503 when no usable secret is configured** (never open), 401 on a missing/wrong token (timing-safe, equal-length compare only), 400 on a malformed body — validated in full before the first `revalidateTag(tag, 'max')`, so there is no partial purge. A success records the timestamp `site-health` reads; that store is module-level and best-effort until WP5. Read-back verification is WP5.
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
