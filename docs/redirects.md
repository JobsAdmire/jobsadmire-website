# Redirects — JobsAdmire Website

Full rationale: plan D21. Rules are decided as data, not written by hand into `next.config.ts`:

1. `redirects/rules.json` — hand-maintained. One row per old route: the old path, an _internal_
   pathname key from `src/i18n/routing.ts`'s `pathnames` table, and a `keep` / `301` / `410`
   disposition.
2. `scripts/build-redirects.ts` (`npm run redirects:build`) — expands each row over every locale
   prefix the old site served, joins in `redirects/gsc-clicks.csv` (WP0's GSC export; header-only
   until that lands) to promote a clicked `410` to a `301` via its `RESCUE` map, and writes two
   generated files. The `RESCUE` map carries a target for every `410` row, so landing the GSC
   export is a data drop, not a code change (R57); a wildcard row (`/profile/*`) is promoted when
   **any** URL under its prefix was clicked, and is then emitted in next.config's own wildcard
   source syntax (`/profile/:rest*`).
3. `redirects/legacy.json` — the expanded 308 redirects, consumed by `next.config.ts`'s
   `redirects()`. `redirects/gone.json` — the 410 prefixes, consumed by `src/proxy.ts` before it
   hands off to next-intl.

`redirects/redirects.test.ts` proves the generated table never chains, never redirects a route
the new site already serves live (a next.config redirect applies to all traffic, so this would
clobber it — e.g. the shared `/` and `/blog` keep rows), never sends a redirect's destination
into a `410` prefix, and — the invariant the old `/blog/*` row broke (R53) — never leaves any
`pathnames` route, dynamic ones included, **inside** a `410` prefix. This doc is the policy
record and the forecast.

## Two numbers, not one: 517 legacy URLs vs. the 49-row `rules.json`

The old site served **517 legacy URLs** — 47 distinct route patterns × up to 11 locale prefixes each — discovered from the old-site inventory. `redirects/rules.json` does **not** list 517 rows: it lists **49**, one row per distinct old route pattern regardless of locale (24 `301`, 19 `410`, 6 `keep`), because the locale expansion is mechanical and belongs in code, not in a hand-maintained file. `scripts/build-redirects.ts` re-expands each of those 49 rows across the applicable locale variants — the bare old path (→ `/en/...`, unless it collides with a live new-site route, R33), `/tr/...` (→ the new Turkish root slug), and the nine dropped locale prefixes (→ `/en/...`) — which is how 49 rows become the actual generated table: **328 redirects** in `redirects/legacy.json` plus **19 `410` prefixes** in `redirects/gone.json` (not 517, because `keep` rows skip the unprefixed-English add when the old path is already live, and every `410` row collapses to one prefix regardless of how many locales served it).

## Rules

- **Disposition is GSC-joined, not guessed.** The 49 canonical old-route rules (covering the 517-URL legacy inventory above) are joined against the WP0 GSC export (16 months of clicks/impressions per URL, exported in WP0 item 0 — before the redirect map is decided, not after).
- **Any URL with a click in that 16-month window gets a 301 to the nearest relevant live page.** "Nearest relevant" is a human judgment call per URL — there's no mechanical mapping from old URL structure to new.
- **Zero-click URLs get `410` (Gone)**, not a redirect to the homepage or any other catch-all. A 410 tells crawlers the page is intentionally removed, which de-indexes faster and cleaner than a soft redirect to an unrelated page.
- **Unbounded legacy spaces are `410` outright, not individually mapped:** `/job-detail/*` and `/profile/*`. These are old-site patterns with unbounded cardinality (every old job listing, every old candidate profile) — mapping them one-by-one isn't tractable and neither has a meaningful "nearest" equivalent on the new 14-page site.
- **`/blog/*` is _not_ one of them (R53).** It was, and it could not be: `pathnames` puts `/blog/[slug]` at the **Turkish root**, so a `/blog/` 410 prefix would have killed every new Turkish article the day WP2 shipped the blog, while leaving `/en/blog/<slug>` working — a half-dead namespace nothing in the suite could see. The row is deleted rather than narrowed: the old article slugs came from a dead blog API and cannot be enumerated, so there is nothing to list as exact `410`s. Old article URLs now 404 through the locale catch-all, which is the correct answer for a URL whose content no longer exists and whose path the new site owns. `redirects.test.ts` pins the invariant so the conflict can never come back.
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

_Placeholder — to be filled from the WP0 GSC export joined against the 517-rule legacy inventory. Each row: old URL → GSC clicks (16 mo) → disposition (301 target / 410) → rationale. The generator's side is ready: every `410` row (all 19) has a `RESCUE` target, so the join only needs the CSV._

| Old URL                         | GSC clicks (16 mo) | Disposition | Target | Rationale |
| ------------------------------- | ------------------ | ----------- | ------ | --------- |
| _pending WP0 GSC export + join_ |                    |             |        |           |

## Expected-loss forecast

_Placeholder — signed at Gate A go/no-go (plan §5, Gate A checklist). Forecast retained clicks by intent bucket (e.g. "Turkish employer-intent queries," "candidate/worker queries," "brand queries") comparing pre-cutover GSC performance against the post-redirect-map projection. A correct redirect map is not automatically a traffic-preserving one (D21) — this forecast is the check that it is, before cutover, not after._

| Intent bucket    | Pre-cutover clicks (16 mo avg/mo) | Projected retained | Projected lost | Notes |
| ---------------- | --------------------------------- | ------------------ | -------------- | ----- |
| _pending Gate A_ |                                   |                    |                |       |
