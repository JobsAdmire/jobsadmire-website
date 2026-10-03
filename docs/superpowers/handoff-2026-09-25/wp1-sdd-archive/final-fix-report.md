# WP1 foundation — final-review fix round

**Branch:** `wp1/foundation` · **Worktree:** `jobsadmire-website-wp1` · **Date:** 2026-09-19
**Input:** `.superpowers/sdd/2026-09-18-wp1-foundation/final-review-report.md` (§ Issues, § Recommendations)
**Scope:** R53–R60 plus the ruled doc/config minors (M-1, M-2, M-3, M-10, M-14). One commit, no push, no new dependencies.

---

## R53 — I-1: the blog namespace freed from the 410 prefix

| What | Where |
| --- | --- |
| `/blog/*` → `410` row **deleted** (49 rules now: 24 `301`, 19 `410`, 6 `keep`) | `redirects/rules.json` (was line 9) |
| Regenerated (`npm run redirects:build`) | `redirects/gone.json` — `/blog/` gone; `redirects/legacy.json` unchanged |
| R4 count pin re-pinned: `gone.length` 20 → **19**; comment "50 rules / 20 `410` rows" → "49 / 19" | `redirects/redirects.test.ts:13-21` |
| "unbounded spaces" test now asserts `/job-detail/`, `/profile/` present and `/blog/` **absent** | `redirects/redirects.test.ts:64-71` |
| **New invariant test** — every key of `pathnames`, both locales' external forms, `[slug]` → `sample`, must not be inside a gone prefix (same prefix semantics as `src/proxy.ts:11`) | `redirects/redirects.test.ts:72-81`; `external()` exported for it at `scripts/build-redirects.ts:35` |
| e2e: `/blog/anything` must **not** be 410 or 308 (a new `/profile/xyz` case keeps a real 410 covered) | `e2e/redirects.spec.ts:47-63` |
| Docs | `docs/redirects.md` (pipeline para, "49-row" heading + counts, new `/blog/*` bullet, disposition-table note), `docs/SEO.md:42` |

Verified against the running build: `/blog/anything` → **404**, `/profile/xyz` → **410**, `/job-detail/1` → **410**.

## R54 — I-2: Phase A analytics can be turned on by configuration

| What | Where |
| --- | --- |
| `applyPublicSettings(bundle, env)` — pure, returns a new bundle; replaces `settings.analytics.{ga4Id,gtmId,adsId,adsConversionLabel}` and `settings.turnstileSiteKey` from `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_ADS_ID` / `NEXT_PUBLIC_ADS_CONVERSION_LABEL` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` when each is a non-empty string | `src/content/pure.ts:24-59` |
| `loadLocal` applies it after `BundleSchema.parse`; `loadOps` untouched (D12) | `src/content/adapter.ts:11-16` |
| Unit tests (imported from `./pure`): unset → unchanged; all five set → replaced (+ `consentMode` preserved, input not mutated); empty string → unchanged; overlay still `BundleSchema.parse`s | `src/content/adapter.test.ts:45-90` (4 tests) |
| Five variables added, commented as public identifiers, not secrets | `.env.example:9-17` |
| Env table rows + "How Phase A turns analytics on" section (incl. the M-12 `beforeInteractive` note) | `docs/DEPLOYMENT.md:38-42`, `docs/ANALYTICS.md:34-48` (and the `GtmLoader` paragraph at `:14`) |

## R55 — I-3: ten form keys

| What | Where |
| --- | --- |
| `FORM_KEYS` = `hire, contact, partner, careers, newsletter, callback, visit, calculator, fraud, workers` | `src/analytics/forms.ts:9-20` |
| `sys.thankYou.forms.{callback,visit,calculator,fraud,workers}` added, one natural sentence each | `src/messages/tr.json`, `src/messages/en.json` |
| Page comment corrected ("ten keys") | `src/app/[locale]/thank-you/page.tsx:50-52` |
| Docs: "WP2 server actions must type their redirect key as `FormKey`" + the ten-key list; PRD §2 and the `sys.*` catalogue | `docs/ANALYTICS.md` (Conversion §), `docs/PRD.md`, `docs/CONTENT-MODEL.md` |

## R56 — I-4: design-package import guard

`'**/design-package/**'` added to the `no-restricted-imports` patterns for `src/**`, message extended with "…; the design package is reference material, never imported" — `eslint.config.mjs:21-26`. Documented at `docs/ARCHITECTURE.md` (§ content adapter, incl. the note that `readFileSync` is the remaining way round the rule) and in `CLAUDE.md`'s architecture bullet.

## R57 — I-5: the rescue map, and wildcard promotion

| What | Where |
| --- | --- |
| Twelve `RESCUE` targets added: five `/services/*` → `/contact`; five `/immigration/*` → `/work-permit`; `/job-detail/*` and `/profile/*` → `/available-workers` | `scripts/build-redirects.ts:8-33` |
| Wildcard rows promote on clicks for **any** URL under the prefix (`hits`) | `scripts/build-redirects.ts:67-75` |
| A promoted wildcard is emitted as `${prefix}:rest*` — next.config's own syntax; a bare `*` is not a path-to-regexp token | `scripts/build-redirects.ts:81-87` |
| Unit test: one clicked leaf `/job-detail/8812` removes the gone prefix and yields `/job-detail/:rest*` → `/en/available-workers` and `/tr/job-detail/:rest*` → `/adaylar` | `redirects/redirects.test.ts:53-63` |

**Gap, reported not improvised:** `/services/resume-service` is the one `410` row the ruling's enumeration does not cover, so it is still the only row with no `RESCUE` target. Noted in `docs/redirects.md`'s disposition-table placeholder. Adding it (nearest page would be `/careers`, matching `/resume-generator`) is a one-line change whenever the controller rules on it.

## R58 — I-6: language links on dynamic routes

| What | Where |
| --- | --- |
| `alternatePath(internal)` — strips bracketed segments back to the parent index (`/blog/[slug]` → `/blog`, `/careers/[slug]` → `/careers`, `/[slug]` → `/`); never a guessed slug | `src/design/chrome/alternate-path.ts` (new) |
| Both language links route through it | `src/design/chrome/LanguageSwitcher.tsx:45,53`; `src/design/chrome/LanguageHint.tsx:44-46,84` |
| Unit tests (3): static untouched; dynamic → parent; output never contains `[` | `src/design/chrome/__tests__/alternate-path.test.ts` (new) |

Confirmed against next-intl 4.14: `usePathname()` runs `getRoute()` and returns the **internal template** (`/blog/[slug]`), so the `[` check is the right trigger.

## R60 — M-6: marquee toggle

`aria-pressed` removed; the label swap is the whole announcement — `src/design/primitives/PausableMarquee.tsx:58-65`. Test now asserts the swap **and** the attribute's absence in both states — `src/design/primitives/__tests__/PausableMarquee.test.tsx:7-21`.

## Docs / config minors

- **M-1** — 301 → 308: `CLAUDE.md:28` (`permanent: true` is 308), `docs/ARCHITECTURE.md:13`.
- **M-2** — the `?lang=` override claim removed from `docs/PRD.md` §3 D1 and replaced with a plain statement that no such override exists.
- **M-3** — one `NOINDEX_PATHNAMES` set (`src/lib/seo/routes.ts:21-33`, internal keys, `satisfies readonly Href[]`) consumed by `src/app/sitemap.ts:9` (exclusion) and `src/app/robots.ts:16-24` (disallow, derived via `getPathname` for both locales). `/api/` stays literal. Live `robots.txt` now disallows `/api/`, `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik` and their four `/en` counterparts; the robots e2e assertion (`Disallow: /tesekkurler`) is green.
- **M-10** — `sys.languageName` deleted from both message files; `LanguageSwitcher.tsx:5-7`'s comment and `docs/CONTENT-MODEL.md`'s chrome list updated to say why no such key exists.
- **M-14** — `.gitignore` duplicates removed (the second `coverage` and `.DS_Store` blocks); `docs/ARCHITECTURE.md` footer grid corrected to the per-column `hidden lg:block` inside an always-`grid` container; `docs/INTEGRATIONS.md` `website-bundle.v1.schema.json` → `contract/website-bundle.v1.ts` (Zod); `docs/DEPLOYMENT.md` § Phase A cutover gains the **canonical host is `www`** paragraph (Vercel primary domain must be `www`, apex redirecting to it, or every canonical points through a 308).
- Count drift fixed where it followed from R53: `docs/PRD.md` §11 ("328 redirects + 19 gone prefixes", and 301 → 308), `docs/ARCHITECTURE.md:13` ("49-row `rules.json`").

## Rulings table

`docs/superpowers/plans/2026-09-18-wp1-foundation-rulings.md` — title now R1–R60, an intro paragraph explains that R53–R60 are the post-review fix round, and eight rows appended in the existing ID/Decision/Why/Landed columns. **R59** records that the plan's "offline page" deliverable is dropped for v1: no service worker, nothing shipped, nothing removed (closes M-7).

---

## Numbers

| | Before | After |
| --- | --- | --- |
| `rules.json` rows | 50 (24 `301` / 20 `410` / 6 `keep`) | **49** (24 / **19** / 6) |
| `redirects/legacy.json` | 328 | **328** (unchanged) |
| `redirects/gone.json` | 20 | **19** |
| `410` rows with a `RESCUE` target | 6 of 20 | **18 of 19** (`/services/resume-service` outstanding) |
| Unit tests | 25 files / 112 tests | **26 files / 121 tests** |
| Playwright | 87 × 2 projects | **87 mobile + 87 desktop = 174** |

## Commands and output

```
$ npm run redirects:build
328 redirects, 19 gone prefixes

$ npm run test -- redirects src/content src/design src/lib/seo
Test Files  17 passed (17)
     Tests  81 passed (81)

$ npm run format:write        # run first; 2 docs reformatted (table widths)

$ npm run verify              # tsc → eslint → prettier --check → vitest
tsc --noEmit                  clean
eslint .                      clean
prettier --check .            All matched files use Prettier code style!
Test Files  26 passed (26)
     Tests  121 passed (121)

$ npm run build
✓ Compiled successfully in 724ms
✓ Generating static pages using 11 workers (13/13)
Route (app): /_not-found, /[locale] (tr,en), /[locale]/[...rest], /[locale]/dev/gallery,
/[locale]/hire-workers, /[locale]/thank-you, /api/revalidate, /api/site-health,
/icon.png, /robots.txt, /sitemap.xml (15m/1y) · ƒ Proxy (Middleware)

$ REVALIDATE_SECRET=wp1-local-secret-0123456789 npx next start -p 3100   # pid file in scratchpad
$ curl probes: /blog/anything=404  /profile/xyz=410  /job-detail/1=410

$ E2E_BASE_URL=http://localhost:3100 REVALIDATE_SECRET=… npx playwright test
174 passed (21.1s)      # mobile 87, desktop 87 — all specs, both projects

$ kill $(cat .../scratchpad/next.pid)   # server stopped, port 3100 free
```

Lighthouse was not run (out of scope for this round). One job at a time throughout. No dependency added or removed (`package.json` untouched). Nothing pushed.

## Concerns for the controller

1. **`/services/resume-service` has no `RESCUE` target.** R57's enumeration covers 12 of the 13 remaining unrescued `410` rows; this one was not listed, and improvising a target is outside the ruling. I-5 is therefore closed for 18 of 19 rows.
2. **A promoted wildcard's emitted source is `/job-detail/:rest*`.** The ruling said "promote the prefix row to a 301 to the fixed target" without fixing the source spelling; a literal `/job-detail/*` is not a valid Next redirect source, so the generator emits Next's own wildcard syntax. Exercised by unit test only — no wildcard is promoted today (the GSC CSV is still header-only), so nothing reaches `legacy.json`.
3. **`e2e/redirects.spec.ts`'s new blog case asserts "not 410, not 308"**, not a status, because `/blog/[slug]` has no page in this WP1 slice (it 404s today and will 200 once WP2 ships the blog) — the same reasoning the existing `/blog` keep-route test already uses.
