# Operating — JobsAdmire Website

Full rationale: plan D25, D26. This doc is the day-to-day operating reference for the live site.

## Site-health checks

`GET /api/site-health` (see `docs/ARCHITECTURE.md`) reports the checks below. It is designed to be watched by an **external monitor that pages the owner's phone** — not an in-app bell, not anything that lives inside the system it monitors. **No monitor is recorded as set up** (an owner item, `docs/pending/README.md`); until one is, a failing check pages nobody.

Every check reports `ok`, `fail` or **`skip`** — `skip` means the check cannot run in this
mode and is counted as neither pass nor failure. Nothing reports `ok` for a check that never
ran: a health endpoint that flatters itself is worse than none (D25). `ok` at the top level
is "no check reported `fail`", and the response is **200** when true, **503** when not.

The monitor is to alert on **2 consecutive failures at a 5-minute interval**: that
threshold absorbs the ~60 s Ops deploy window, during which `opsPing` briefly fails and the
endpoint answers `503` (W75).

The built checks (`src/app/api/site-health/checks.ts`):

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

**`lastRevalidate` is not trustworthy under `OPS` — it must be fixed before `CONTENT_SOURCE=OPS` is switched on (Phase B, not built).** The timestamp it reads (`src/app/api/revalidate/state.ts`) is a module-level in-memory variable: best-effort on Vercel's serverless runtime, where a cold instance starts with it unset and a redeploy forgets it entirely. Once `CONTENT_SOURCE=OPS` is live, this check can `fail` on a perfectly healthy instance that simply hasn't personally handled a revalidate call yet — a false `503` from this endpoint, not a real staleness signal. The module-level variable has to become a real store before that switch. A related caveat for the same work: even with a real store, `bundleTr`/`bundleEn` read through the same `next: { revalidate: 900 }` Next.js Data Cache the pages themselves use, so a passing bundle check up to 900 s after a failed Operations publish can still be looking at the last-good cached bundle rather than the current one. Full detail: `docs/ARCHITECTURE.md` § Operations surface.

Designed, not built — none of these is a check today (the door's `captcha` and `trippedForms` facts are on the body as `ops`, not as checks):

| Check                                                         | Reason code         |
| ------------------------------------------------------------- | ------------------- |
| Bundle age vs. its time floor                                 | `BUNDLE_STALE`      |
| Canary image HEAD request                                     | `MEDIA_UNREACHABLE` |
| Tripped forms (captcha degraded / abuse auto-trip)            | `FORMS_DEGRADED`    |
| Handler failures                                              | `HANDLER_FAILED`    |
| Lead-drought (no successful submission in an abnormal window) | `LEAD_DROUGHT`      |

## Synthetic lead

**Built (W172):** `GET /api/cron/synthetic-lead` (`src/app/api/cron/synthetic-lead/`) submits ONE test-class `hire` form through the real server-side form path: `postForm` (`src/forms/post.ts`) with the body `npm run door:smoke` uses (`smokeFields('hire', stamp)`, `scripts/door-smoke.lib.ts`). The stamp rides in `name`/`message`, so two runs never dedupe onto one row. It uses the `isTest` token class, so it never shows up as a real lead in Operations' inbox or in `generate_lead` conversion counts. Answers: **401** unless the request carries `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends exactly that; an unset or short secret keeps the route shut); **503**, without a call, when `OPS_API_URL` or a `wst_…` `OPS_WEBSITE_TEST_TOKEN` is missing (it never falls back to the write token); **502** with the `postForm` kind when the door does not accept the lead; **500** when the door answers `isTest: false`; **200** `{ data: { status, isTest: true } }` on success. The whole call is bounded by `postForm`'s one 9 s deadline, shared by the attempt and its single connection-level retry (W74), so it stays under the Hobby plan's 10 s default function limit (W201).

**Schedule:** `vercel.json` `crons`, `0 6 * * *` (daily, 06:00 UTC) while the project is on Hobby, whose crons run at most once a day (a sub-daily expression fails the deployment there — W201; `run.test.ts` pins the daily expression). Change it to `*/30 * * * *` (the design's every 30 minutes), and that test with it, once Pro is on. Vercel runs crons only for the production deployment.

**Scheduled, not armed.** The route needs `CRON_SECRET` and a `wst_…` `OPS_WEBSITE_TEST_TOKEN` on the Production scope. Neither was set at the cutover (W224) and no later record shows them set, so the daily run answers 401 (503 with the secret but no test token) and posts nothing (`docs/pending/README.md`). The one-off proof planned for `staging` was not run: W224 dropped the staging proofs.

**Heartbeat (designed, not built).** The design pings an external heartbeat service on success, and **a missed ping is the page**: the alarm is the monitor noticing silence, not the site self-reporting a failure it may be unable to report during an actual outage. No heartbeat URL exists yet (the external monitor is an owner set-up item; `docs/INTEGRATIONS.md` I19). Today the route only logs `[synthetic-lead] ok` with the door's status to the Vercel function log, and a failed run shows as a non-200 invocation in the project's Cron Jobs log. Adding the ping is a follow-up once the monitor issues a heartbeat URL.

**Manual probe:** `npm run door:smoke` (`scripts/door-smoke.ts`) posts one test-class body per form key to the real door (ping, ten keys, the deliberate replay, the deliberate 400, the unknown key) and prints the results as a Markdown table. It runs only on a test-class (`wst_…`) token and refuses anything else, a write token (`wsw_…`) included. Test-class rows appear in the Ops inbox under the _test_ filter (`isTest: true`), run their handler as a dry run and skip Turnstile when they carry no token (Ops X16). A green smoke or a green synthetic lead therefore proves the door up to the handler and nothing about the visitor's captcha path. The real-widget run that was to prove that path on staging was planned and not run (W224 dropped the staging proofs).

## Daily digest

**Designed, not built** (`docs/pending/README.md`). The form and lead pipeline it summarises is live; the digest is not. Design: an email, sent **from Vercel** (not from Operations — deliberately a different failure domain), summarizing the prior day's leads, form health, and any tripped alarms. **Its absence is itself the alarm** — a missing digest means something broke badly enough to take the digest with it, which is exactly the scenario a digest exists to catch.

## External monitor and second human

The external monitor is designed to page the **owner's phone**; no monitor is recorded as set up (§ Site-health checks). A **second human** (configured on the Operations Integrations screen — §10 item 10 closed; the recipient's contact details live only in the Operations notification seed, never in this repo or its docs) is a fallback recipient for every website event class in `docs/INTEGRATIONS.md` I13 — a single point of failure on alerting is explicitly called out in the plan's risk register ("Owner is the single point of everything").

## Site-health drill

Planned and not run: the site launched with the drill open (W224), because it needs the external
monitor. To be run once by the owner, with the monitor armed: (1) point the monitor at
a URL that fails — a preview with a misconfigured adapter, or the Operations door flipped off —
and confirm the phone rings within the monitor's interval; (2) on Operations, flip a form off in
the Integrations screen and confirm the second human also receives the
`WEBSITE_FORMS_UNAVAILABLE` notification;
(3) restore both and confirm the all-clear. Record the date, the interval and who was paged.
This section names the checks the drill rehearses; `/api/site-health`'s own
contract (what each field means) is documented above, in § Site-health checks.

## Weekly five-minute owner check

A short, recurring check the owner performs (not delegated) — the plan does not further specify the exact checklist beyond its existence; treat this as: `/api/site-health` is green, the daily digest arrived (once it is built) and the APPROVE queue (Phase B) is not backing up. One more check: `npm run sweep:legacy` against production is clean (a `FAIL` row is a redirect regression) — a one-minute run, worth doing after any change that touches `redirects/` or `next.config.ts`'s redirect list.

## Gate sign-off

`npm run gate` against the **Vercel preview URL** of the branch is the binding run — D27, and `CLAUDE.md`'s task-completion checklist. A local `next start` run is for fast feedback only. **LCP method (W145):** every Lighthouse config measures LCP and performance under DevTools throttling, three runs per path, asserting the median run — so LCP ≤ 2.5 s, performance ≥ 0.95, accessibility, best-practices, SEO, the 200 KB script ceiling (W13 amended) and CLS are errors locally and on the preview alike. R50's localhost LCP waiver is retired: it excused Lighthouse's simulated throttling (Lantern), which charged the whole initial waterfall to a text LCP element and read ~3 s on a page that paints in ~1.5 s. Sign-off means a green preview run, not a green local one; `npm run js-size` prints the per-route LCP and performance, with a method line that must read `devtools throttling, median of 3`.

## Checkpoint cadence

Week 1, 2, 4, 8, 12 after the cutover of 2026-10-03 — see `docs/SEO.md` for the three tracked numbers (GSC clicks, GSC Crawl Stats 429s, Vercel Web Analytics vs. forecast) and `docs/ANALYTICS.md` for the weekly three-way reconciliation that runs alongside. No record shows the watch started: the owner's Search Console step is open, and Vercel Web Analytics is not installed (`docs/pending/README.md`).

## Kill switches

| Switch                   | Where                                      | Effect                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WEBSITE_MODULE_ENABLED` | Operations env, VPS side                   | Gates the entire Website module's controllers/boot hooks/crons — **`true` in production since 2026-09-24** (the intake door; the variable's own default is `false`, D24). Every form on jobsadmire.com depends on it, so it is never switched off without a reason the owner signed. Does not gate the permission descriptor. |
| Per-form switch          | Operations, Website → Integrations → Forms | Takes one form offline while the rest stay live: the door answers 404 for that form and the visitor sees the fallback panel                                                                                                                                                                                                   |
| `BLOG_SOURCE`            | Vercel, Production scope                   | Delete it and redeploy: the blog falls back to the committed LOCAL rows (`docs/DEPLOYMENT.md` § Environment variables)                                                                                                                                                                                                        |
| `POOL_SOURCE`            | Vercel, Production scope                   | Delete it and redeploy: every real candidate card leaves at once and the sample returns                                                                                                                                                                                                                                       |
| `hideFromWebsite`        | The portal, per candidate                  | Hides one candidate: the card leaves the site within about six minutes (Operations' 5-minute sync plus the 60 s ISR; `docs/PRIVACY.md`)                                                                                                                                                                                       |

Three more switches are **designed for the CMS phase, not built** — none of these names exists in Operations:

| Switch                | Where                        | Designed effect                                    |
| --------------------- | ---------------------------- | -------------------------------------------------- |
| `publicReadEnabled`   | Operations, Website settings | Site-wide public-read off — a 503 without a deploy |
| `pool.publish`        | Operations, Website settings | Hides the candidate-pool aggregate section         |
| `stories.proofImages` | Operations, Website settings | Hides success-story proof images (v1.1)            |

**Time-to-dark is not measured.** The plan's target is ≤ 5 minutes from flip to effect (page dark, form offline, section hidden). No measured figure is recorded, so treat any specific minute figure elsewhere as a target, not a measured number.
