# WP1 "foundation" — final whole-branch review

**Branch:** `wp1/foundation` · **Range:** `e8a7952..539e4db` (25 commits, 153 files, +43,335 / −1,046) · **Reviewed:** 2026-09-19 · **Reviewer:** Fable (read-only; tree clean at `539e4db` before and after)

**Method.** Read in passes by file group (i18n/proxy/config → content/contract/lints → primitives/chrome → SEO/redirects → analytics/thank-you → API routes/error pages → e2e/gate/configs → all eleven docs), then cross-task checks by script: every `t('…')`/`labelId` id used in `src/` resolved against both bundles (35/35 present), every `sys.*` key used resolved against both message files (30 keys, identical sets), `shasum -a 256 contract/website-bundle.v1.ts` = `b407d92f…19dcf` (matches the pin byte-for-byte), the fixture and both generated bundles parse under `BundleSchema`, the prerendered `.next/server/app/tr.html` head carries exactly one `rel="canonical"` and three `hreflang` links (`tr`, `en`, `x-default`), `grep` for `as any|: any|as never` (only the four deliberate `as never` in `track.test.ts`), for `fetch(` (one, in the `server-only` adapter), for `track(` (one call site, `ConversionPing`), for secrets (none; `.env*` ignored, `.env.example` only), and dependency delta base→head (six additions, all named in the plan: `@next/third-parties`, `next-intl`, `zod`, `@lhci/cli`, `@testing-library/user-event`, `tsx`). `npm run verify` run once: green (tsc, eslint, prettier, 25 files / 112 tests). Last local gate artefacts: Playwright `passed`, Lighthouse 0.96 / 1.0 / 1.0 / 1.0 on all four paths. `design-package/` untouched in the range.

---

### Strengths

- **The spike is real, and `pathnames` is one table feeding three consumers.** `src/i18n/routing.ts` drives next-intl, the redirect generator's `LIVE` set (`scripts/build-redirects.ts:32-36`) and the SEO builders (`src/lib/seo/routes.ts`). Adding a route in one place propagates to canonicals, hreflang, sitemap and the live-route guard. `alternateLinks: false` with the rationale in-line (`routing.ts:38-43`) is the right call and is unit-pinned (`routing.test.ts:10-14`).
- **The contract is genuinely frozen.** Hash pin verified on disk; `contract.test.ts` hashes the real file, validates the golden fixture *and* both generated bundles (`contract.test.ts:25-32`), so an importer regression cannot ship a bundle the schema rejects.
- **Fail-closed operations surface.** `src/app/api/revalidate/auth.ts` is a pure status matrix (disabled / unauthorized / ok), 503 when the secret is absent or short, timing-safe with an explicit length guard, all-or-nothing tag validation before the first `revalidateTag`, `Cache-Control: no-store` on every branch. The secret is only ever read in `route.ts:13` and never logged or echoed. Its test (`auth.test.ts`) covers same-length, longer, shorter, wrong-scheme and no-scheme tokens — a real negative suite.
- **Privacy is enforced at a choke point, not by discipline.** `track()` (`src/analytics/track.ts:21-33`) allow-lists per event, `Object.hasOwn` against inherited keys, drops non-scalars; `track.test.ts` proves candidate refs and raw form objects never reach the dataLayer. Exactly one call site exists. Consent defaults carry `wait_for_update`, `url_passthrough`, `ads_data_redaction`; withdrawal re-denies via `gtag` in the same page view (R39) and is tested.
- **RSC boundary hygiene.** `ClientIslands` takes `{ consent: boolean; locale }` only; `MobileNav`, `CookiePreferencesButton`, `DialogDemo` receive strings; no bundle or function crosses to the client. `adapter.ts` is `server-only`; `pure.ts` (R2) keeps tests honest without a mock.
- **Accessibility is built into the primitives rather than patched on.** Roving-tabindex `Tabs`, `Accordion` with Home/End and a correct `headingLevel`, `Dialog` with trap + Escape + focus restore keyed on `open` (and a test for the inline-`onClose` identity trap), `inert` on the marquee's duplicate track, a single `<main id="main">` guaranteed by `SiteChrome` (R31), a reduced-motion baseline in `globals.css`, and contrast pairs asserted numerically (`tokens.test.ts`) including the CTA face and WhatsApp green that the axe sweep forced.
- **The tests verify behaviour, not existence.** Header/Footer tests render against the real TR bundle and assert hrefs, `aria-expanded`, new-tab attributes, accordion multi-open; e2e runs under both Pixel 7 and 1440×900 so the hamburger/footer accordions are actually exercised; `thank-you.spec.ts` asserts the dataLayer ordering and the per-session dedupe across a reload.
- **The docs are unusually honest.** `docs/SEO.md`, `docs/OPERATING.md`, `docs/ARCHITECTURE.md` state plainly what is not built (Sentry, synthetic lead, OG image, sitemap 404s, the WP5 `lastRevalidate` blocker) instead of describing the target as shipped. Ten claims spot-checked against code (below) — nine hold; one is stale.

---

### Issues

#### Critical (Must Fix)

None. Nothing in the WP1 shell ships broken, insecure or data-corrupting behaviour. The items below are Important because WP2 builds on them or because Phase A cannot launch without them.

#### Important (Should Fix)

**I-1. `gone.json`'s `/blog/` prefix will 410 every Turkish blog article the moment WP2 ships `/blog/[slug]` — and only the Turkish ones.**
`redirects/rules.json` row `/blog/*` → `410` becomes `gone.json[0] = "/blog/"`; `src/proxy.ts:11` returns 410 for any pathname starting `/blog/`. `src/i18n/routing.ts:21` declares `/blog/[slug]` as a live route at the TR root, so `/blog/<new-slug>` is dead on arrival while `/en/blog/<new-slug>` (not matched by the prefix) works. The test suite cannot see this: `redirects.test.ts:56-63` checks redirect *destinations* against gone prefixes and `:25-31` checks redirect *sources* against `LIVE`, but nothing checks a `pathnames` pattern against `gone`. *This is a plan-level conflict* (the plan prescribes both: `pathnames` line 116 and rules line 2318; the spec's D21 "unbounded `/blog/*` 410" cannot coexist with D16's "blog slugs per locale" at the TR root).
Fix: enumerate the old blog slugs as exact 410 entries (the old site is a finite 1,262-file artifact on `main-backup`; `design-package/design/blog-posts.js` has the 26 index cards), or have the proxy exempt slugs present in the bundle's blog list; either way add a test `for (pattern of pathnames) expect(isGone(pattern.replace('[slug]','x'))).toBe(false)` so the conflict is red today. Record the decision as a ruling and amend `docs/redirects.md`/`docs/SEO.md` ("`/blog/*` is 410 outright").

**I-2. Phase A analytics is dark by configuration — D13/D23 say Phase A ships "analytics + conversion", and nothing in `LOCAL` can turn it on.**
`scripts/import-design-package.ts:74` hard-codes `analytics: { ga4Id: null, gtmId: null, adsId: null, … }`; `src/app/[locale]/layout.tsx:49,69` and `src/design/chrome/Footer.tsx:194` gate the container, the consent sheet and the withdrawal door on `gtmId`. Under `LOCAL` (all of Phase A) there is no env override and no settings overlay, so GTM never loads, the banner never mounts, and `ConversionPing`'s `conversion` push has no tag to reach. `docs/ANALYTICS.md` lists the real ids (`GTM-N2CLWJWJ`, `AW-17096273578`, `G-77Y5KBV97L`) and promises "Phase A's env/constants wiring" — which does not exist. D27's "one consent-granted `gate` run per work package" is impossible while the banner cannot appear; Gate A's "13–15 forms produce exactly one `generate_lead` and one Ads conversion" cannot be rehearsed on a preview. *Plan issue:* the plan itself wrote `gtmId: null` (line 933).
Fix (small): let `SETTINGS.analytics` in the importer read `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_ADS_ID` (public identifiers — not secrets — so `NEXT_PUBLIC_*` is legitimate) or overlay them in `loadLocal`; document in `.env.example` and `docs/DEPLOYMENT.md`. Do it before WP2 instruments pages, so the WP2 preview gate exercises consent → GTM → conversion end to end.

**I-3. `FORM_KEYS` allow-lists 5 keys; the PRD lists 7 handler types across 13–15 forms; an unlisted key silently loses its Ads conversion.**
`src/analytics/forms.ts:4` = `hire | contact | partner | careers | newsletter`. `docs/PRD.md` §2 also carries `CALCULATOR_QUOTE`, `FRAUD_REPORT`, `VISIT`, `CALLBACK` and the available-workers request. `thank-you/page.tsx:52,76` treats any other `?form=` as "not a lead" and fires nothing — correct for a stale link, but a WP2 form that redirects with a key nobody added here gets no conversion, no test failure, no log. *Plan issue:* Task 12 (plan line 133) prescribed the five.
Fix: extend `FORM_KEYS` and `sys.thankYou.forms.*` to the full PRD set now (cheap, copy-only), and require WP2's server actions to type their redirect key as `FormKey` so an unlisted key is a compile error at the form, not a silent zero in Ads.

**I-4. The D23 guard has an unlocked side door: `design-package/**` is not import-restricted, and the runtime assertion is a no-op today.**
`eslint.config.mjs:11-22` restricts `**/content/local/*` only. `assertServableInProduction` (`src/content/pure.ts:8-21`) only fires when `collections.pool|stories|representatives` are non-empty, and both generated bundles ship `collections: {}` — so the CLAUDE.md hard rule "`design-package/data/*.sample.json` … never wire them to a production code path" is enforced by nothing. `design-package/data/` contains `approvals.sample.json` and `representatives.sample.json`; a WP2 Verify or Success Stories page can `import` either and bypass both guards. Today no `src/` file imports from `design-package` (verified).
Fix: add `'**/design-package/**'` to the same `no-restricted-imports` `patterns` for `src/**` (the importer lives in `scripts/`, unaffected). Note in `docs/ARCHITECTURE.md` that `readFileSync` is the remaining path around the import rule, covered by review.

**I-5. The D21 GSC join has not happened, and the `RESCUE` map cannot honour it for 14 of the 20 `410` routes.**
`redirects/gsc-clicks.csv` is header-only (1 line). `scripts/build-redirects.ts:9-16` maps only six routes to a rescue target; a clicked `/services/resume-service`, `/immigration/immigrate-to-uk`, `/services/career-counselling`, etc. would stay `410` after the join because the promotion branch (`:50-53`) requires `RESCUE[rule.from]`. R34 already records the disposition/forecast tables as placeholders; the incomplete `RESCUE` is new. Not a merge blocker; a Gate A blocker (expected-loss forecast is signed there).
Fix: give every `410` row a rescue target (nearest page, else `/`), and make the WP0 GSC export an owned, dated item — the WP1 deliverable "redirect map from the WP0 GSC join" is currently the map without the join.

**I-6. `LanguageSwitcher` and `LanguageHint` assume the same internal pathname exists in both locales — false for the two dynamic routes WP2 adds.**
`src/design/chrome/LanguageSwitcher.tsx:41,49` and `LanguageHint.tsx:43,81` take next-intl's `usePathname()` and emit `<Link href={pathname} locale={other}>`. For `/blog/[slug]` (per-locale slugs from the CMS, D16) and `/careers/[slug]` the other-locale target is a different slug, so the switch lands on a 404. This is a chrome API the pages will fight.
Fix before WP2's detail pages: accept an optional `alternates?: Record<Locale, Href>` prop (populated from the bundle's page record) and fall back to the current behaviour; or hide the switcher on detail pages without an alternate.

#### Minor (Nice to Have)

- **M-1. Doc drift: "301".** `CLAUDE.md` (Architecture at a glance) and `docs/ARCHITECTURE.md` (Redirects §1) say single-hop 301; `next.config.ts:12-14` uses `permanent: true`, which Next emits as **308**, and `e2e/redirects.spec.ts` asserts 308. Gate A's checklist already says "308/410". Fix the two docs.
- **M-2. Doc claims a feature that does not exist.** `docs/PRD.md` §3: "`?lang=` query param still overrides" — no code reads a `lang` query parameter (`src/proxy.ts`, `routing.ts`; grep negative). Either implement it in the proxy (redirect `?lang=en` → `/en/…`, useful for old inbound links) or delete the sentence.
- **M-3. `robots.ts` hard-codes external slugs; `sitemap.ts` derives them from `pathnames`.** `src/app/robots.ts:14-20` vs `sitemap.ts:9-14`. The TR slug table is still under owner review (§10 item 8); a slug change would silently leave robots pointing at the old path. Derive both lists from one `NOINDEX` set of internal pathnames via `getPathname`.
- **M-4. 410 rules are not expanded over the old locale prefixes.** `build-redirects.ts:54-57` `continue`s before the locale loop, so `/tr/job-detail/123` → next-intl strips the prefix (307) → `/job-detail/123` → 410 (two hops), and `/fr/job-detail/123` → 404 rather than 410. Expand the gone prefixes over `/tr` and the nine dropped locales too (cheap; `proxy.ts` already handles prefixes).
- **M-5. Two origins in one page.** JSON-LD `url`/`logo` use `settings.siteUrl` (`jsonld.ts:10-11,50`) while canonical/hreflang/sitemap use env `SITE_URL` (`routes.ts:5`). They agree today; they will not the first time a preview overrides `NEXT_PUBLIC_SITE_URL`. Use `SITE_URL` in the JSON-LD builders. Separately, `organizationJsonLd` hard-codes both postal addresses in code (`jsonld.ts:30-43`) — D7/D12 say editors own content and outbound values come from settings; add an `offices` field to `Settings` at the 1.1 bump.
- **M-6. `PausableMarquee` toggle double-announces state.** `PausableMarquee.tsx:60-64` swaps the label ("Pause"/"Play") *and* sets `aria-pressed`, so a screen reader hears "Play, pressed". Use one pattern (label swap without `aria-pressed`, per the WAI-ARIA play/pause guidance).
- **M-7. The spec's "error/404/offline" deliverable shipped error + 404 only.** No offline/no-JS fallback exists and no ruling records dropping "offline". Record it (R-next) or add a minimal `app/offline` later; nothing in WP1 needs it.
- **M-8. The numbers-out-of-copy lint is not wired to real data.** `lint.test.ts:45-52` exercises `findHardTypedMetrics` on a toy input only; the ratchet baseline has no `hardTypedMetrics` key because no metrics collection exists yet. Spec §7 lists it among the `verify` lints — it will matter the moment WP2 adds `metric`/`RateConfig` rows. Add the baseline key and the catalogue-wide call in the same change that adds the collection.
- **M-9. `contentSource()`'s OPS→LOCAL fallback is silent and `site-health` does not make it a `fail`.** `config.ts:4-9` returns `LOCAL` when `CONTENT_SOURCE=OPS` but the token is missing/short; `site-health/route.ts` echoes `source` but reports `ok: true`. A Phase B misconfiguration would serve stale package content with a green health check. Add a `SOURCE_FALLBACK` check (`process.env.CONTENT_SOURCE === 'OPS' && source === 'LOCAL'` → `fail`) with the WP5 store work.
- **M-10. `sys.languageName` is defined in both message files and used nowhere** (`LanguageSwitcher.tsx:6` explains why it cannot be used). Remove it or keep it with a comment in `docs/CONTENT-MODEL.md`; today the "entire namespace as of WP1" list documents a dead key.
- **M-11. Header and slim bar link to `/blog` while D22 keeps blog out of nav below six Turkish bodies, and `/blog` 404s today.** `Header.tsx` (`bundle.nav` includes `home.010` → `/blog`), `SlimBar.tsx:10`. WP2's nav-threshold work; flagging so the importer's `NAV` constant is not treated as final.
- **M-12. Inline consent defaults are not literally "inline in `<head>`".** In the App Router, `next/script` `beforeInteractive` with inline children renders as a `self.__next_s.push(...)` in the body (`tr.html`: the script sits at byte 3,494; `</head>` closes at 3,014) and is executed by the Next runtime before hydration. Ordering holds for `@next/third-parties`' `afterInteractive` GTM (and `thank-you.spec.ts:55-64` proves `dataLayer[0]` is the default), but a raw GTM snippet pasted anywhere else would race it. One sentence in `docs/ANALYTICS.md` avoids a future "why isn't it in the head" hunt.
- **M-13. Test polish.** `e2e/thank-you.spec.ts:28` uses `waitForTimeout(300)` after reload — assert on a stable condition (e.g. `h1` visible, then read the dataLayer) to remove the timing dependency. `src/lib/sanity.test.ts` and `e2e/smoke.spec.ts` are scaffold-era and can go.
- **M-14. Housekeeping.** `.gitignore` carries duplicated blocks (`.env*` twice, `.DS_Store` and `coverage` twice — lines 14/50, 24/54). `@types/node ^20` against `engines.node 22.x`. `docs/ARCHITECTURE.md` describes the footer grid as `hidden lg:grid`; the code is a per-column `hidden lg:block` inside an always-`grid` container (`Footer.tsx:144,174`). `docs/INTEGRATIONS.md` I1/I3/I4 still say `website-bundle.v1.schema.json` (known).
- **M-15. `MobileNav` has no Escape/outside-click close** (`MobileNav.tsx`). Acceptable for a disclosure pattern; note for WP2's pixel pass since the design's panel likely closes on backdrop tap.

---

### Plan alignment

**WP1 paragraph, item by item.** Stack spike ✓ (passed, no fallback; `ARCHITECTURE.md` cites `3fd5c22`/`17f7501`). Tokens/primitives/chrome ✓ (13 primitives; D19 ×0.75 with the 11 px floor asserted in `tokens.test.ts`; `StickyCtaBar` deliberately unmounted). Routing + `pathnames` + cookie ✓ (`ja_locale`, `localeDetection: false`, `as-needed`). Package import ✓ (3,505 ids, 380 legal, six empty TR fragments preserved, entities decoded). Adapter LOCAL/OPS + frozen contract ✓ (hash verified; per-route switch correctly deferred to WP5). Metadata/sitemap/robots/JSON-LD ✓ (Organization/WebSite rendered; Breadcrumb/FAQ builders present but uncalled; Article/JobPosting are WP2). Redirects + no-chain + 410 ✓ mechanically, **narrowed**: the GSC join is absent (I-5). Consent Mode v2 + GTM ✓ in code, **narrowed by configuration** (I-2). `/tesekkurler` ✓. Error/404 ✓, **offline silently dropped** (M-7). `formatTRY` ✓ (D18 worked examples), contrast ✓, numeric-parity ✓ with ratchet, numbers-out-of-copy **helper only** (M-8). `/api/site-health` skeleton ✓ (honest `skip`). Test wiring ✓. **WP1 gate:** ≥95/100/100/100 met on the local run (0.96/1/1/1, Playwright passed); the binding preview run is pending the owner linking `jobsadmire-web-v2` (`docs/PRD.md` §11 says so).

**§3.1 architecture.** Routing, content access, design system, SEO and operations surface match; the `(site)` route group was dropped in favour of `app/[locale]/…` (documented, harmless). Calculator engine, forms flow, OG images, `llms.txt`, Sentry, Vercel Analytics/Speed Insights are WP2+ and documented as such.

**Rulings spot-checked (15 of 51), all reflected in code:** R6 (`[...rest]/page.tsx`), R11 (`home.011`, importer line 87 + test), R12 (hash over the Prettier-formatted file), R17 (`Href` in `navigation.ts:9`, the one cast in `Button.tsx:70`), R22 (`NavLink.tsx:41-45`), R27 (`'hydrating'` snapshot, `ConsentBanner.tsx:11-24`), R33 (`LIVE`, `build-redirects.ts:32-36,60`), R35 (`next/navigation` in `ConversionPing.tsx:3`), R37 (session key + `key={formKey}`), R41 (`dev/gallery`, `notFound()` first), R42 (`revalidateTag(tag,'max')`), R43 (`test.skip(!SECRET)`), R45 (fixed sheet, `LanguageHint.tsx:71-74`), R47 (`ClientIslands`), R49/R50 (both `lighthouserc*.json`). R29's note that the code moved past it is accurate.

**Issues with the plan itself:** I-1 (D21 vs D16 at the TR root), I-2 (`gtmId: null` contradicts D13/D23/D27), I-3 (five keys vs seven handlers). None is an implementer error; all three should be closed by ruling before WP2 starts.

---

### Cross-task integration (what the task gates could not see)

- **Request path composition** (`next.config` redirects → `proxy.ts` 410 → next-intl → `[...rest]`): verified by reasoning and by the e2e matrix. `/api/*` excluded by the matcher; `/en/<gone>` is not matched by any prefix (root of I-1's asymmetry); `/tr/<live>` is stripped by next-intl (one 307) — fine; `/tr/<gone>` is two hops (M-4). No `legacy.json` source contains path-to-regexp metacharacters or dots, no duplicates, no source collides with `LIVE`.
- **Chrome string ids:** 35/35 present in both bundles. **`sys.*`:** 30 keys, identical in both files; all keys used in code exist; one defined-but-unused (M-10).
- **Fixture/contract:** valid; hash matches on disk; `Footer.test`/`Header.test` build a parsed bundle from fixture + real strings (R13) rather than casting.
- **Metadata:** one canonical + three hreflangs per page (prerendered HTML), `x-default` = TR, `robots` meta present, OG `url` = canonical. `openGraph.locale` omits `alternateLocale` (trivial).
- **D23 guard:** runtime + lint present; the `design-package` door is open (I-4).
- **RSC boundary:** clean. **`track()`:** one call site, allow-list intact. **`REVALIDATE_SECRET`:** never logged. **Client→Operations:** none.

### Security and privacy

No findings beyond I-4/M-9. Timing-safe compare with a length guard; `no-store` on both routes; JSON-LD `<` escaped (`JsonLdScript.tsx:11`); consent denied before any tag (proved in e2e); no candidate identifiers can reach the dataLayer; no secrets in the tree or history for this range; `poweredByHeader: false`; `/api/site-health` is public by design (D25) and discloses only `source`, `contractVersion` and the commit SHA.

### Accessibility and SEO

Landmarks: `banner`, two `navigation` (desktop `sys.nav.main`, hamburger panel `hire.239`), `main#main`, `contentinfo` — one each, verified in the prerender. Heading order: page `h1`, footer `h2` columns (desktop copies are `display:none`, so out of the tree), `Accordion headingLevel={2}` on mobile. Focus: skip link first in DOM, dialog trap/restore, focus-visible rings everywhere. Targets: 44 px on every primary control; the slim bar's 26 px utility links are a documented exemption (`SlimBar.tsx:15-17`) — keep an eye on it at the preview gate. Reduced motion: global baseline + marquee paused + toggle hidden. SEO coherence: canonical/hreflang/sitemap/robots agree today; M-3 is the drift risk; sitemap 404s and the missing OG image are known.

### Tests

Real, not vacuous. `verify` green (112 tests). e2e runs both projects. Redirect tests pin exact counts (328/20) plus no-chain, live-route and gone-prefix invariants — the one missing invariant is I-1's. Minor flake risk in `thank-you.spec.ts:28` (M-13).

### Production readiness for Phase A (with WP2 pages on top of this shell)

Would block launch, in order: I-2 (analytics dark), I-3 (conversion keys incomplete), I-5 (no GSC join / no expected-loss forecast), I-1 (if the blog ships in Phase A), plus the already-known: sitemap must be gated to real routes before WP7a, `/opengraph-image.png` absent, Sentry absent, preview gate not yet run, second human and Turnstile/Vercel owner actions pending. One cutover check not in the docs: `NEXT_PUBLIC_SITE_URL`/`settings.siteUrl` are `https://www.jobsadmire.com`; WP7a moves both `jobsadmire.com` and `www` — the Vercel primary-domain redirect direction must match the canonical host or every canonical points through a 308.

**Docs spot-check (ten claims):** ARCHITECTURE "OPS→LOCAL fallback visible only in site-health `source`" ✓; ARCHITECTURE "`content/local/*` importable only from `adapter.ts` via ESLint" ✓ (two named test exemptions); SEO "16 × 2 = 32 sitemap URLs, 4 real" ✓; ANALYTICS "180-day `Secure; SameSite=Lax` cookie" ✓; ANALYTICS "deduped twice (ref + sessionStorage)" ✓; PRD §11 "13 primitives" ✓; redirects.md "24/20/6 rules → 328/20" ✓; DEPLOYMENT "`.env*` blocked except `.env.example`" ✓; CONTENT-MODEL "Footer/MobileBottomBar hard-code route lists" ✓; CLAUDE.md/ARCHITECTURE "single-hop 301" ✗ (308, M-1); PRD §3 "`?lang=` overrides" ✗ (not implemented, M-2).

---

### Recommendations

1. Before WP2 starts, issue three rulings closing the plan conflicts: the blog 410 policy (I-1), Phase A analytics ids via `NEXT_PUBLIC_*` (I-2), and the full `FORM_KEYS` set with `FormKey`-typed redirects (I-3). Each is under an hour of work; all three change what WP2's page tasks are told to do.
2. Land I-4 (one ESLint pattern) and the I-1 test in the merge fix-up — they are guardrails, not features, and they make two whole classes of WP2 mistakes impossible.
3. Give `LanguageSwitcher`/`LanguageHint` an alternates prop (I-6) in the same fix-up or as WP2's first chrome task, before the careers/blog detail pages exist.
4. Treat the GSC export as a WP0 debt with a named owner and a date; complete `RESCUE` now so the join is a data drop, not a code change.
5. Fold M-1/M-2/M-5/M-10/M-14 into the docs commit of the fix-up; they are all under five lines each.
6. Keep the plan's honesty pattern: every narrowing above that survives to merge should be a row in the rulings table, not only a paragraph in a doc.

---

### Assessment

**Ready to merge?** With fixes

**Reasoning:** The foundation is sound — routing, contract, fail-closed operations routes, the analytics allow-list, the RSC boundary and the accessibility primitives are all correctly built and genuinely tested, with no critical defects and no security or privacy findings. Merge after the small guardrail fixes (I-4, the I-1 test, doc corrections M-1/M-2) and with I-1/I-2/I-3/I-6 recorded as rulings that WP2's first tasks resolve, because each is a plan-level conflict that would otherwise be rediscovered page by page.
