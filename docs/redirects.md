# Redirects — JobsAdmire Website

Full rationale: plan D21. Rules are decided as data, not written by hand into `next.config.ts`:

1. `redirects/rules.json` — hand-maintained. One row per old route: the old path, an _internal_
   pathname key from `src/i18n/routing.ts`'s `pathnames` table, and a `keep` / `301` / `410`
   disposition.
2. `scripts/build-redirects.ts` (`npm run redirects:build`) — expands each row over every locale
   prefix the old site served, joins in `redirects/gsc-clicks.csv` (WP0's GSC export; header-only
   until that lands) to promote a clicked `410` to a `301` via its `RESCUE` map, and writes two
   generated files.
3. `redirects/legacy.json` — the expanded 308 redirects, consumed by `next.config.ts`'s
   `redirects()`. `redirects/gone.json` — the 410 prefixes, consumed by `src/proxy.ts` before it
   hands off to next-intl.

`redirects/redirects.test.ts` proves the generated table never chains, never redirects a route
the new site already serves live (a next.config redirect applies to all traffic, so this would
clobber it — e.g. the shared `/` and `/blog` keep rows), and never sends a redirect's destination
into a `410` prefix. This doc is the policy record and the forecast.

## Rules

- **Disposition is GSC-joined, not guessed.** The 517 legacy URL rules identified from the old site are joined against the WP0 GSC export (16 months of clicks/impressions per URL, exported in WP0 item 0 — before the redirect map is decided, not after).
- **Any URL with a click in that 16-month window gets a 301 to the nearest relevant live page.** "Nearest relevant" is a human judgment call per URL — there's no mechanical mapping from old URL structure to new.
- **Zero-click URLs get `410` (Gone)**, not a redirect to the homepage or any other catch-all. A 410 tells crawlers the page is intentionally removed, which de-indexes faster and cleaner than a soft redirect to an unrelated page.
- **Unbounded legacy spaces are `410` outright, not individually mapped:** `/blog/*`, `/job-detail/*`, `/profile/*`. These are old-site patterns with unbounded cardinality (every old blog post, every old job listing, every old candidate profile) — mapping them one-by-one isn't tractable and most have no meaningful "nearest" equivalent on the new 14-page site.
- **Dropped locales → `/en/...` equivalents.** The old site served 11 locales; this build serves 2 (D1, D22). Locale prefixes being dropped: `fr`, `de`, `ar`, `ru`, `fa`, `id`, `fil`, `tk`, `tg` — every URL under one of these prefixes redirects to its `/en/...` equivalent (English is the fallback for a dropped locale, not Turkish, since a visitor who explicitly chose e.g. `/de/...` was not choosing Turkish).
- **Old `/tr/...` → root Turkish slugs.** The old site prefixed Turkish; this site puts it at the root (D1), so every `/tr/...` URL redirects to the unprefixed equivalent.
- **Old unprefixed = English.** The old site's default locale was unprefixed English, and several `keep`-disposition new-site slugs differ between TR and EN (e.g. `/about` is now `/hakkimizda` in Turkish) — so the bare old path redirects to its `/en/...` equivalent instead of colliding with the new Turkish-rooted route or 404ing.
- **Never redirect a route the new site already serves live.** `/` and `/blog` are shared verbatim between the old and new site; a `next.config` redirect fires for all traffic regardless of locale, so redirecting either would clobber the live route. The generator computes the new site's full set of live external paths from `pathnames` and skips the unprefixed-English add whenever an old path matches one.
- **Single hop, permanent, no chains, never into a 410.** Every rule in the generated `redirects/legacy.json` is checked by `redirects/redirects.test.ts`, which resolves the full rule table and fails if any URL requires more than one hop, targets a live route, or lands on a `410` prefix.
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
