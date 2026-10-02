# Operating — JobsAdmire Website

Full rationale: plan D25, D26, WP7a, WP6.5. This doc is the day-to-day operating reference once the site is live.

## Site-health checks

`GET /api/site-health` (see `docs/ARCHITECTURE.md`) reports, and is watched by an **external monitor to the owner's phone** — not an in-app bell, not anything that lives inside the system it's monitoring.

Every check reports `ok`, `fail` or **`skip`** — `skip` means the check cannot run in this
mode and is counted as neither pass nor failure. Nothing reports `ok` for a check that never
ran: a health endpoint that flatters itself is worse than none (D25). `ok` at the top level
is "no check reported `fail`", and the response is **200** when true, **503** when not.

The external monitor alerts on **2 consecutive failures at a 5-minute interval**: that
threshold absorbs the ~60 s Ops deploy window, during which `opsPing` briefly fails and the
endpoint answers `503` (W75).

Shipped in WP1 (`src/app/api/site-health/checks.ts`):

| Check            | Reason code        | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bundleTr`       | `BUNDLE_TR`        | `getBundle('tr')` resolves                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `bundleEn`       | `BUNDLE_EN`        | `getBundle('en')` resolves                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `lastRevalidate` | `REVALIDATE_STALE` | `skip` in LOCAL (the bundle ships with the deploy); in OPS, `fail` when never recorded or older than 24 h                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `opsPing`        | `OPS_PING`         | `GET /api/website/v1/ping` with the write token, 3 s timeout (`src/app/api/site-health/ops.ts`); `ok` on a 200 that is the ping JSON; `fail` on 404 (`off` — the door is live in production since 2026-09-24, so a dark door is an outage, W75), 401 (`unauthorized`) or 5xx/network/timeout/non-JSON 200 (`unreachable`, a non-200 body read and discarded); `skip` only when no `OPS_API_URL`/write token is configured (`unconfigured`). The raw state, latency and the door's `captcha`/`trippedForms` facts are on the body as `ops` |

The response also carries `source` (`LOCAL`/`OPS`), `contractVersion`, `commit`
(`VERCEL_GIT_COMMIT_SHA`) and `at`. **Bundle age is deliberately not derived from the
bundle's own `generatedAt`** — in Phase A that is a fixed sentinel, so an age computed from
it would be fiction.

**`formBeacons`** (body field, not a check): the number of visitor fallback panels this instance has shown, from `POST /api/form-beacon` (D11 — each panel sends `{formKey, kind, page}` once). Best-effort per instance like `lastRevalidate`; each beacon is also a `[form-beacon]` line in the Vercel function log. A rising count with `ops.state: 'ok'` points at the client path (captcha, validation), a rising count with anything else at the door.

**`lastRevalidate` is not yet trustworthy under `OPS` — WP5 blocker.** The timestamp it reads (`src/app/api/revalidate/state.ts`) is a module-level in-memory variable: best-effort on Vercel's serverless runtime, where a cold instance starts with it unset and a redeploy forgets it entirely. Once `CONTENT_SOURCE=OPS` is live, this check can `fail` on a perfectly healthy instance that simply hasn't personally handled a revalidate call yet — a false `503` from this endpoint, not a real staleness signal. WP5 replaces the module-level variable with a real store before that flip. A related caveat for the same work: even with a real store, `bundleTr`/`bundleEn` read through the same `next: { revalidate: 900 }` Next.js Data Cache the pages themselves use, so a passing bundle check up to 900 s after a failed Operations publish can still be looking at the last-good cached bundle rather than the current one. Full detail: `docs/ARCHITECTURE.md` § Operations surface.

Still to land, with the work package that brings them:

| Check                                                         | Reason code         | Lands in |
| ------------------------------------------------------------- | ------------------- | -------- |
| Bundle age vs. its time floor                                 | `BUNDLE_STALE`      | WP5      |
| Canary image HEAD request                                     | `MEDIA_UNREACHABLE` | WP5      |
| Tripped forms (captcha degraded / abuse auto-trip)            | `FORMS_DEGRADED`    | WP3a     |
| Handler failures                                              | `HANDLER_FAILED`    | WP3a     |
| Lead-drought (no successful submission in an abnormal window) | `LEAD_DROUGHT`      | WP5      |

## Synthetic lead

**Built (T15, W172):** `GET /api/cron/synthetic-lead` (`src/app/api/cron/synthetic-lead/`) submits ONE test-class `hire` form through the real server-side form path: `postForm` (`src/forms/post.ts`) with the body `npm run door:smoke` uses (`smokeFields('hire', stamp)`, `scripts/door-smoke.lib.ts`). The stamp rides in `name`/`message`, so two runs never dedupe onto one row. It uses the `isTest` token class, so it never shows up as a real lead in Operations' inbox or in `generate_lead` conversion counts. Answers: **401** unless the request carries `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends exactly that; an unset or short secret keeps the route shut); **503**, without a call, when `OPS_API_URL` or a `wst_…` `OPS_WEBSITE_TEST_TOKEN` is missing (it never falls back to the write token); **502** with the `postForm` kind when the door does not accept the lead; **500** when the door answers `isTest: false`; **200** `{ data: { status, isTest: true } }` on success. The whole call is bounded by `postForm`'s one 9 s deadline, shared by the attempt and its single connection-level retry (W74), so it stays under the Hobby plan's 10 s function cap (W201).

**Schedule:** `vercel.json` `crons`, `0 6 * * *` (daily, 06:00 UTC) while the project is on Hobby, whose crons run at most once a day (a sub-daily expression fails the deployment there — W201; `run.test.ts` pins the daily expression). Change it to `*/30 * * * *` (the design's every 30 minutes), and that test with it, once Pro is on. Vercel runs crons only for the production deployment, so the schedule starts at the Phase A cutover; before it, the route is proven once by hand on `staging` (T15, controller step).

**Heartbeat (not wired yet).** The design pings an external heartbeat service on success, and **a missed ping is the page**: the alarm is the monitor noticing silence, not the site self-reporting a failure it may be unable to report during an actual outage. No heartbeat URL exists yet (the external monitor is an owner set-up item; `docs/INTEGRATIONS.md` I19). Today the route only logs `[synthetic-lead] ok` with the door's status to the Vercel function log, and a failed run shows as a non-200 invocation in the project's Cron Jobs log. Adding the ping is a follow-up once the monitor issues a heartbeat URL.

**Manual probe:** `npm run door:smoke` (`scripts/door-smoke.ts`, T14) posts one test-class body per form key to the real door (ping, ten keys, the deliberate replay, the deliberate 400, the unknown key) and prints the Markdown table the ledger keeps. It refuses a write-class token. Test-class rows appear in the Ops inbox under the _test_ filter (`isTest: true`), run their handler as a dry run and skip Turnstile when they carry no token (Ops X16). A green smoke or a green synthetic lead therefore proves the door up to the handler and nothing about the visitor's captcha path; `e2e/door-test-mode.spec.ts` and the owner-gated real run (T14) prove that.

## Daily digest

**Not yet built** — depends on the same not-yet-existing form/lead pipeline. Design: an email, sent **from Vercel** (not from Operations — deliberately a different failure domain), summarizing the prior day's leads, form health, and any tripped alarms. **Its absence is itself the alarm** — a missing digest means something broke badly enough to take the digest with it, which is exactly the scenario a digest exists to catch.

## External monitor and second human

The external monitor pages the **owner's phone**. A **second human** (pending §10 item 10 — name + phone/email required before Gate A, no default) is a fallback recipient for every website event class in `docs/INTEGRATIONS.md` I13 — a single point of failure on alerting is explicitly called out in the plan's risk register ("Owner is the single point of everything").

## Weekly five-minute owner check

A short, recurring check the owner performs (not delegated) — the plan does not further specify the exact checklist beyond its existence; treat this as: today's digest arrived, `/api/site-health` is green, and the APPROVE queue (Phase B) isn't backing up.

## Work-package sign-off

`npm run gate` against the **Vercel preview URL** for that work package is the binding run — D27, and `CLAUDE.md`'s task-completion checklist. A local `next start` run is for fast feedback only. **LCP method (W145):** every Lighthouse config measures LCP and performance under DevTools throttling, three runs per path, asserting the median run — so LCP ≤ 2.5 s, performance ≥ 0.95, accessibility, best-practices, SEO, the 200 KB script ceiling (W13 amended) and CLS are errors locally and on the preview alike. R50's localhost LCP waiver is retired: it excused Lighthouse's simulated throttling (Lantern), which charged the whole initial waterfall to a text LCP element and read ~3 s on a page that paints in ~1.5 s. Sign-off means a green preview run, not a green local one; `npm run js-size` prints the per-route LCP and performance the ledger records, with a method line that must read `devtools throttling, median of 3`.

## Checkpoint cadence

Week 1, 2, 4, 8, 12 post-cutover (WP7a) — see `docs/SEO.md` for the three tracked numbers (GSC clicks, GSC Crawl Stats 429s, Vercel Web Analytics vs. forecast) and `docs/ANALYTICS.md` for the weekly three-way reconciliation that runs alongside.

## Kill switches

| Switch                   | Where                        | Effect                                                                                                                                                                                                             |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `publicReadEnabled`      | Operations, Website settings | Site-wide public-read off — a 503 without a deploy                                                                                                                                                                 |
| Per-form disable         | Operations, Forms screen     | Takes one form handler offline while leaving the rest live                                                                                                                                                         |
| `pool.publish`           | Operations, Website settings | Hides the candidate-pool aggregate section                                                                                                                                                                         |
| `stories.proofImages`    | Operations, Website settings | Hides success-story proof images (v1.1)                                                                                                                                                                            |
| `WEBSITE_MODULE_ENABLED` | Operations env, VPS side     | Gates the entire Website module's controllers/boot hooks/crons — **default `false` until Phase B** (D24). Does not gate the permission descriptor, so role/permission setup can proceed before the module is live. |

**Time-to-dark is to be measured in WP6.5** — each switch above is exercised deliberately during the WP6.5 content gate and the elapsed time from flip to effect (page dark, form offline, section hidden) is recorded. The plan's target is ≤5 minutes but this is not yet a verified number as of this doc's writing — treat any specific minute figure elsewhere as aspirational until WP6.5 records the real one.
