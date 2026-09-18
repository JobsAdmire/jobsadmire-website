# Privacy — JobsAdmire Website

Full rationale: plan D2, D14, WP5-gate, plan §10 item 6 (counsel engagement). This doc is the operational privacy reference; the counsel-drafted legal pages themselves (`/gizlilik`, `/kvkk`, `/cerez-politikasi`) are content, not this doc.

## Retention

**Form payloads are purged 90 days after being marked `HANDLED`.** This is `WebsiteFormSubmission.purgeAfter`, set at handling time, enforced by a purge cron (04:30 daily, Operations side — deliberately not 03:00, to avoid a collision with other Operations nightly jobs). `isTest`-class submissions (synthetic-lead cron, staging Turnstile tests) are excluded from real-lead retention counts but still purged on the same schedule.

## DSAR / erasure runbook

A data-subject access or erasure request touches every place a visitor's data can land:

1. **`WebsiteFormSubmission`** (Operations) — the submitted form payload, keyed by `(formKey, requestHash, hourBucket)`.
2. **`WebsiteSubscriber`** (Operations) — newsletter subscription record, including double-opt-in state.
3. **Candidate snapshot** — only relevant if the request concerns the aggregate pool data (`WebsiteCandidateSnapshot`); this is aggregate/derived data from the CRM, not a per-person record, at launch (D2) — a DSAR naming a specific candidate routes to the **CRM's** process, not this site's, until v1.1 per-profile cards exist with their own consent trail.
4. **Public bucket** (`website-public`) — any uploaded asset tied to the request (e.g. a fraud-report attachment).
5. **Edge/ISR caches** — a request satisfied from cache after an erasure must not continue serving the erased data; erasure triggers a targeted revalidation of any tag that could carry the affected record.

_Runbook steps (locate → confirm identity → export or delete across all five surfaces → confirm cache purge → log closure) are finalized at WP5-gate alongside the KVKK incident runbook below — this section is the inventory of where to look, not yet the timed step-by-step._

## KVKK 72-hour incident runbook (outline)

Turkey's KVKK (data protection law) sets breach-notification expectations. Outline, to be completed as counsel-drafted content per plan §10 item 6:

1. **Detect** — via `/api/site-health`, Sentry, or a direct report.
2. **Contain** — kill switch the affected surface (`publicReadEnabled`, per-form disable, `pool.publish`, `stories.proofImages` — see `docs/OPERATING.md`) within the measured time-to-dark.
3. **Assess** — scope of affected records, across the same five surfaces as the DSAR runbook above.
4. **Notify** — within the 72-hour KVKK window where the assessment confirms a reportable breach; counsel-led.
5. **Record** — incident log entry, root cause, remediation, whether a candidate/partner notice is owed (relevant once v1.1's pool/consent features exist).

_Full runbook is a WP5-gate deliverable, commissioned from counsel per plan §10 item 6. This section is a placeholder skeleton, not the finished procedure — do not treat it as complete._

## Candidate-pool staging and consent (D2)

- **Launch (Phase B):** live **aggregate** counts and facets only, from the Portal (CRM), with a small-cell floor of **10** (a code constant; settings may only raise it, never lower it — this is deliberate so an operator can't accidentally shrink the floor to something re-identifying).
- **Per-profile cards:** off at launch, behind a `pool.cards` switch. Enabled no earlier than **30 days after Phase B**, and only once all four of:
  (a) every active sourcing partner has received a notice + contract addendum with a 14-day objection window;
  (b) the CRM consent flag is set **by the partner**, never by an admin on the partner's behalf;
  (c) a per-partner switch and a "N of your candidates are public" indicator exist in the Portal;
  (d) a DPIA, countersigned by counsel, names partners as affected parties.
- Public copy on the site states what is actually true at any given time — no "coming soon" language implying a feature exists before its consent gates are met.

## Newsletter double opt-in

`NEWSLETTER` form handler creates a pending `WebsiteSubscriber` row; confirmation via `/abone-onay` (a per-subscriber signed token) activates it. Unsubscribe (`/abonelikten-cik`) is one-click per RFC 8058 — no login, no "are you sure," a single unambiguous action. Newsletter is one of the features gated off if the counsel trip-wire fires (no legal-document engagement by WP0 end — plan §12).
