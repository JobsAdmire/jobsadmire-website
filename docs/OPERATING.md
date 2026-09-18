# Operating — JobsAdmire Website

Full rationale: plan D25, D26, WP7a, WP6.5. This doc is the day-to-day operating reference once the site is live.

## Site-health checks

`GET /api/site-health` (see `docs/ARCHITECTURE.md`) reports, and is watched by an **external monitor to the owner's phone** — not an in-app bell, not anything that lives inside the system it's monitoring:

| Check                                                         | Reason code (illustrative — exact codes land in WP1) |
| ------------------------------------------------------------- | ---------------------------------------------------- |
| Bundle age vs. its time floor                                 | `BUNDLE_STALE`                                       |
| Last successful revalidate                                    | `REVALIDATE_STALE`                                   |
| Canary image HEAD request                                     | `MEDIA_UNREACHABLE`                                  |
| Operations `ping`                                             | `OPS_UNREACHABLE`                                    |
| Tripped forms (captcha degraded / abuse auto-trip)            | `FORMS_DEGRADED`                                     |
| Handler failures                                              | `HANDLER_FAILED`                                     |
| Lead-drought (no successful submission in an abnormal window) | `LEAD_DROUGHT`                                       |

## Synthetic lead

A Vercel Cron job submits a real form, through the real form path, **every 30 minutes**, using the `isTest` token class (so it never shows up as a real lead in Operations' inbox or in `generate_lead` conversion counts). It pings an external heartbeat service on success. **A missed ping is the page** — the alarm is the monitor noticing silence, not the site self-reporting a failure it may be unable to self-report during an actual outage.

## Daily digest

An email, sent **from Vercel** (not from Operations — deliberately a different failure domain), summarizing the prior day's leads, form health, and any tripped alarms. **Its absence is itself the alarm** — a missing digest means something broke badly enough to take the digest with it, which is exactly the scenario a digest exists to catch.

## External monitor and second human

The external monitor pages the **owner's phone**. A **second human** (pending §10 item 10 — name + phone/email required before Gate A, no default) is a fallback recipient for every website event class in `docs/INTEGRATIONS.md` I13 — a single point of failure on alerting is explicitly called out in the plan's risk register ("Owner is the single point of everything").

## Weekly five-minute owner check

A short, recurring check the owner performs (not delegated) — the plan does not further specify the exact checklist beyond its existence; treat this as: today's digest arrived, `/api/site-health` is green, and the APPROVE queue (Phase B) isn't backing up.

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
