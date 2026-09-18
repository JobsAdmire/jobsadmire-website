# Redirects — JobsAdmire Website

Full rationale: plan D21. Rules live in code at `next.config.ts` (Vitest-checked for no chains); this doc is the policy record and the forecast.

## Rules

- **Disposition is GSC-joined, not guessed.** The 517 legacy URL rules identified from the old site are joined against the WP0 GSC export (16 months of clicks/impressions per URL, exported in WP0 item 0 — before the redirect map is decided, not after).
- **Any URL with a click in that 16-month window gets a 301 to the nearest relevant live page.** "Nearest relevant" is a human judgment call per URL — there's no mechanical mapping from old URL structure to new.
- **Zero-click URLs get `410` (Gone)**, not a redirect to the homepage or any other catch-all. A 410 tells crawlers the page is intentionally removed, which de-indexes faster and cleaner than a soft redirect to an unrelated page.
- **Unbounded legacy spaces are `410` outright, not individually mapped:** `/blog/*`, `/job-detail/*`, `/profile/*`. These are old-site patterns with unbounded cardinality (every old blog post, every old job listing, every old candidate profile) — mapping them one-by-one isn't tractable and most have no meaningful "nearest" equivalent on the new 14-page site.
- **Dropped locales → `/en/...` equivalents.** The old site served 11 locales; this build serves 2 (D1, D22). Locale prefixes being dropped: `fr`, `de`, `ar`, `ru`, `fa`, `id`, `fil`, `tk`, `tg` — every URL under one of these prefixes redirects to its `/en/...` equivalent (English is the fallback for a dropped locale, not Turkish, since a visitor who explicitly chose e.g. `/de/...` was not choosing Turkish).
- **Old `/tr/...` → root Turkish slugs.** The old site prefixed Turkish; this site puts it at the root (D1), so every `/tr/...` URL redirects to the unprefixed equivalent.
- **Single hop, permanent, no chains.** Every rule in `next.config.ts` is checked by a Vitest test that resolves the full rule table and fails if any URL requires more than one hop to reach its final destination.
- **Named legacy-to-new mappings already decided:**
  - `/certifications` → `/hakkimizda#lisans` (the licence PDFs live there now, About Us page, D26 Minimum Launchable Content)
  - `/contact-us` → `/iletisim`
  - `/hire-workers-in-turkey` → `/isci-talebi` (TR) / `/en/hire-workers` (EN)

## Disposition table

_Placeholder — to be filled from the WP0 GSC export joined against the 517-rule legacy inventory. Each row: old URL → GSC clicks (16 mo) → disposition (301 target / 410) → rationale._

| Old URL                         | GSC clicks (16 mo) | Disposition | Target | Rationale |
| ------------------------------- | ------------------ | ----------- | ------ | --------- |
| _pending WP0 GSC export + join_ |                    |             |        |           |

## Expected-loss forecast

_Placeholder — signed at Gate A go/no-go (plan §5, Gate A checklist). Forecast retained clicks by intent bucket (e.g. "Turkish employer-intent queries," "candidate/worker queries," "brand queries") comparing pre-cutover GSC performance against the post-redirect-map projection. A correct redirect map is not automatically a traffic-preserving one (D21) — this forecast is the check that it is, before cutover, not after._

| Intent bucket    | Pre-cutover clicks (16 mo avg/mo) | Projected retained | Projected lost | Notes |
| ---------------- | --------------------------------- | ------------------ | -------------- | ----- |
| _pending Gate A_ |                                   |                    |                |       |
