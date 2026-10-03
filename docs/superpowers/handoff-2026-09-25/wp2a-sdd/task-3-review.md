# Task 3 review — Chrome foundation (T0c), `ef15ba2..fe4f8c0` + the W86/W87 commits `3fcd449`, `bf8ceb7`

**Spec compliance:** ✅ compliant. Every code block in the brief is on disk verbatim, or differs only where W80/W88/W90 require it or by a recorded deviation with a sound reason. Cycle 0 (W80, W86, W87, W88, W90) is complete.
**Code quality:** ❌ changes required: 0 Critical, 1 Important, 4 Minor

Reviewer: read-only on the repo. Scratch: `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/b66860be-3e05-4c03-954a-f55becea5a18/scratchpad/review-task3/` (`$S` below). Worktree `jobsadmire-website-wp2` at `fe4f8c0` stayed clean throughout; no stash, checkout or commit was made.

## Spec compliance evidence

### Method and runs
- **Verbatim check.** `$S/extract.mjs` pulled the brief's 63 fenced blocks into `$S/blocks/`.
  - `$S/compare.sh` ran `diff -u` for the 26 full-file blocks, plus `e2e/chrome.spec.ts` as blocks 01 + 44 joined.
  - `$S/contain.mjs` checked the 18 partial blocks (line ranges, appends, one-liners) for contiguous containment in the target file, ignoring whitespace.
  - Results: `$S/full-compare.txt`.
- **Runs at HEAD `fe4f8c0`:**
  - `npm run verify` is green: tsc, eslint and prettier pass; vitest runs **48 files / 321 tests**; the log has no warnings.
  - `npm run content:import` exits 0 ("44 replacements … wrote 3505 strings, 35 nav items, 22 page records, 9 collections per locale"). `git status --short` is empty afterwards, so the committed bundles and catalogue equal the importer's output.
  - `npm run build` is green. The route list matches the report: `/[locale]`, `/[locale]/[...rest]`, `/[locale]/dev/gallery`, `/[locale]/hire-workers`, `/[locale]/thank-you`, the APIs and `ƒ Proxy (Middleware)`.
  - Playwright against `next start:3000`, both projects: `smoke + chrome + width-sweep` **110 passed**; `a11y + seo + routing + thank-you` **44 passed**. The server was killed afterwards.

### Cycle 0 — additions
- **W80 — done.**
  - `sys.nav.home` ("Ana sayfa"/"Home") is in both `src/messages/{tr,en}.json`, and the `sys.home` leaf is gone.
  - The only reader is `(site)/not-found.tsx:19` (`sys('nav.home')`). The call-pattern grep `\(\s*['"]home['"]\s*\)|sys\.home\b` over `src/ e2e/ scripts/` hits only `messages.test.ts`, and the property-read grep finds no `sys.home` read. `pages.home` hits are bundle page records, not `sys`. `sys.thankYou.home` is untouched.
  - `messages.test.ts:152-159` asserts `sys.nav.home` is present and `sys.home` is not a leaf, in both files. `leaves()` really emits leaf paths, so the assertion bites.
- **W86 — done** (`3fcd449`).
  - `FounderSchema` `{ name, titleId, photoSrc: string|null, published }` is in `CollectionSchemas` and is not in `FIXTURE_ONLY_COLLECTIONS` (tested in `collections.test.ts`).
  - The importer emits one row (`name` = about.144 per locale, `titleId: 'about.047'`, `photoSrc: null`, `published: false`). The importer test, `local-bundle.test.ts` and CONTENT-MODEL (the `collections` row and § Collections line 107) carry it.
- **W87 — done in `bf8ceb7`; the report is right that nothing was missing.**
  - `scripts/metric-placeholders.json` carries both `partner.077: [{key:'countries'}]` and the `partner.059` entry with pinned `[one business day]`/`[bir iş günü]` and `as: {en:'{replySlaHours} working hours', tr:'{replySlaHours} iş saati'}`. Its literals gain `[12+] countries`, `[12’den fazla] ülke`, `[one business day]` and `[bir iş günü]`.
  - `PlaceholdersSchema` is exported with the `as` refine (a pinned literal and exactly one `{key}`), and `reauthor()` swaps the span for `as`.
  - Probe over the emitted bundles: `/12\+|one business day|twelve/i` (EN) and `/12\+|12.den fazla|bir iş günü|on iki/i` (TR) both return `[]`.
  - The only `iş günü` hits are "ilk iş günü" timelines, `wp.268` ("10 iş günü") and `contact.190`. None is a W87 spelling and none is an SLA value.
  - The two ids render `Shortlists from {countries} countries` and `{countries} ülkeden aday listeleri` (→ "13 countries"/"13 ülkeden" through `makeTf`, per `local-bundle.test.ts`, which is green), and `…within {replySlaHours} working hours.` and `…{replySlaHours} iş saati içinde…`.
  - The importer test pins 41 ids / 44 replacements. `docs/CONTENT-MODEL.md:95` ("41 non-legal ids") and `docs/PRD.md:111` ("41 metric strings … partner.077/059 added by W87") agree.
  - W118 anticipated a follow-up commit "if needed"; none was needed.
- **W88 — done** (`fe803c5`).
  - The bundle probe prints groups `desktopNav, hamburger, slimBarRight, footerEmployers, footerCompany`, **0** external rows and 22 blog rows.
  - The portal rows are `{group:'hamburger'|'slimBarRight'|'footerEmployers', labelId:'home.012', href:'/portal-login', external:false}` in both locales. The bundles were regenerated in the same commit.
  - Grep over `src/`: `portal.jobsadmire.com` appears only in `Button.test.tsx` (a WP1 primitive test) and `scripts/import-design-package.ts:120` (settings).
  - `portal-login`/`portal-girisi` appear only in comments, tests, `routing.ts`, `routes.ts` (NOINDEX), `collections.ts` (PAGE_KEYS) and `SlimBar.tsx:13`'s `PORTAL` route set, which styles a row only (see Deviation 1).
  - No chrome file renders a portal anchor or URL. The gallery's `bundle.settings.portal.host` is dev-only and pre-existing.
- **W90 — done** (`1dd58ca`).
  - `src/i18n/client-messages.ts` excludes `SERVER_ONLY_SYS = ['legal','seo']` by name and keeps every other `sys.*` namespace.
  - The locale layout passes `messages={pickClientMessages(await getMessages())}`.
  - `client-messages.test.ts` covers a fixture carrying both namespaces and the real catalogues.
  - In the built 404 payload the provider's `messages.sys` holds exactly `skipToContent … nav{main,close,home,legal} … form{…}`. Neither namespace exists yet.
  - Server readers go through the request config (`getTranslations('sys')` / RSC `useTranslations`), which the picker does not touch.
  - No client component reads `legal`/`seo`. CONTENT-MODEL documents that a client component needing server-only copy gets it as a prop.

### Cycle 1 — route groups (W19)
- **Verbatim.** `(site)/layout.tsx`, `(minimal)/layout.tsx`, `(minimal)/error.tsx`, `(minimal)/not-found.tsx`, `(bare)/layout.tsx` and `e2e/chrome.spec.ts` are IDENTICAL to the brief.
- **Locale layout.** `[locale]/layout.tsx` differs only by W90: the `getMessages` import and call, the `pickClientMessages` import, the `messages` prop and one comment (Deviation 3). It keeps html/body, Archivo, `GtmLoader`, both JSON-LD nodes, the provider, `ClientIslands` and `generateStaticParams`.
- **Moves.** `git show -M --name-status 9373830` shows all seven moves as **R100**.
  - `(site)/not-found.tsx` is R097 overall only because of the W80 edit made earlier in `f8fbad0`.
  - `(site)/dev/gallery/page.tsx` is R098 overall only because of the line-207 edit in `2b264d9`. It imports no contract file today.
  - `path.resolve('src/app/[locale]/(site)/dev/gallery', '../../../../../../contract/website-bundle.v1.ts')` resolves to the real file, so the six-level Produces path is correct.
- **Runtime (browser probe, `$S/probe-browser.mjs`).** Exactly **one** `<main>` on `/`, `/en`, `/isci-talebi`, `/en/hire-workers`, `/tesekkurler?form=hire`, `/boyle-bir-sayfa-yok`, `/iletisim` and `/en/contact`.
  - `(bare)` owns its own `<main id="main">`; `SiteChrome:38` owns it everywhere else.
  - 404s render inside the chrome with the right `lang` and h1 after hydration (R6). See Parked 1 for the server-HTML side, which is pre-existing.
  - `(minimal)` has its own thin `error.tsx`/`not-found.tsx`. `setRequestLocale` is called in both group layouts.
  - No hydration or console errors on the 200 routes.

### Cycle 2 — contact clicks and the W26 allowlist
- **Verbatim.** `track.ts`, `useContactClick.ts`, `ContactLink.tsx` and `useContactClick.test.tsx` are IDENTICAL. The two `track.test.ts` cases are contained at line 41. Import line 2 is `{ ALLOWED_PARAMS, PARAM_ENUMS, track }`.
- **`PARAM_ENUMS` and the five events.** They match Produces exactly, and the seven WP1 events are unchanged and in order (test-pinned).
- **`track()` probe** (`$S/probe-track.mts`, run with Node's type stripping):
  - `placement:'hero-banner'` → pushed without `placement`.
  - `topic:'Ahmet Yılmaz, +90 5…'`, `topic:['hire']`, `topic:{v:'hire'}`, `track:'sourcing '` and `outcome:0` → each value dropped before the push.
  - A `placement:'toString'` value is dropped; an unknown event `'constructor'` throws.
  - `slug` stays free text by design.
- **Real browser** (`$S/probe-click.mjs`):
  - Slim-bar tel and footer wa.me clicks push `{event:'call_click', page:'/isci-talebi', locale:'tr', placement:'slimbar'}`, `…'/en/hire-workers'…'en'…`, `…page:'/tesekkurler'…` (the real path without the query; R35) and `…'/boyle-bir-sayfa-yok'…`.
  - `event.defaultPrevented` stays `false` for a plain click and for a Meta-click, so `ContactLink` never blocks navigation.
  - tel: stays same-tab (R22; tested in `ContactPlacements`).
  - `contactKindOf` covers tel:, mailto:, `https://wa.me/`, `https://api.whatsapp.com/` → else `null` (tested).

### Cycle 3 — nav groups, legal pair, noindex/robots, wiring
- **Verbatim.** `nav.ts`, `MobileBottomBar.tsx`, `WhatsAppFab.tsx`, `routes.ts`, `robots.ts` and `ContactPlacements.test.tsx` are IDENTICAL. Both `SocialRail` blocks, the eslint list (3 files), the `routes.test.ts` append and line 2, and the `seo.spec.ts` sitemap case are contained.
- **W80/W88 differences only.**
  - The messages blocks differ only by W80's `home`.
  - `SlimBar.tsx` differs only by the W88 `PORTAL` set and comments (Deviation 1). `Footer.tsx` differs only by one comment.
  - `nav.test`, `SlimBar.test` and `Footer.test` differ only by the W88 adaptations. Each still asserts one portal anchor per list, no portal-host anchor, and that the `external` pass-through is covered by a store row.
- **Nav rules.** `nav.ts` re-exports `BLOG_NAV_THRESHOLD`/`blogNavVisible` from `@/content/collections`, and `nav.test` asserts identity with `toBe`. `navGroup` sorts by `order`, resolves labels through `t()` and drops `/blog` and `/blog/[slug]` below the threshold.
- **Robots and SEO.** `/robots.txt` at runtime disallows `/api/`, `/tesekkurler`, `/portal-girisi`, `/abone-onay`, `/abonelikten-cik`, `/blog` and their five `/en/…` forms (localized, deduped).
  - The robots e2e case is untouched and nothing asserts `Disallow: /blog`.
  - `sitemap.ts` is unchanged and compiles.
  - `NOINDEX_PATHNAMES` is typed `as const satisfies readonly (keyof typeof pathnames)[]`.
- **Legal pair.** The footer legal `<nav aria-label={sys('nav.legal')}>` appears exactly once per page, on `(site)` and `(minimal)` alike.

### Cycle 4 — header CTAs and the 901 px row
- **Verbatim.** `ctas.ts`, `HeaderCtas.tsx`, `Header.tsx` and `ctas.test.ts` are IDENTICAL. `Button.tsx`, `primitives/index.ts` line 2, `SiteChrome:31`, `MobileNav:29`, gallery line 207, `globals.css`, `tokens.ts`, `tokens.test.ts` and `width-sweep:9` are contained.
- **Header test.** `Header.test.tsx` differs by the W88 external-row adaptation and the scoped `home.002` query (Deviation 4).
- **Button parity.** `buttonClassName` is a pure extraction and `<Button>` now calls it, so the two return the same class string by construction.
- **Removals.** `grep primaryCta|ChromeCta` over `src e2e docs CLAUDE.md` finds nothing.
- **CTA table.** It equals Produces: 7 keys, hashes, the `danger` variant only on `/verify`, and `undefined` = default secondary vs `null` = none. `ctasFor(null|unknown|'toString')` falls back to the defaults.
- **Server HTML equals the hydrated DOM** (curl of the `next start` HTML):
  - `/` → `/#proposal` with `/ortak-olun`.
  - `/en` → `/en#proposal`.
  - `/isci-talebi` → `/isci-talebi#request-form`.
  - `/tesekkurler?form=hire` → defaults.
  - The same hrefs show after hydration, with no console errors.
- **Tokens and CSS.** `tokens.type.nav = {mobile:13.5, tablet:12, desktop:11}`; `headerRowFrom 901`; `socialRailFrom 1101`. `--fs-nav` and `@theme inline { --text-nav }` are present, and the 901 px block sits between `:root` and the 1101 px block. No `zoom` rule exists anywhere.
- **Computed nav font** (`$S/probe-browser2.mjs`): 13.5px at 900 (row hidden), 12px at 901 and 1100, 11px from 1101. The row and hamburger swap at 901/900, with no overflow at 901, 1000 or 1100.

### Cycle 5 — docs (W45)
- **Anchor grep.** The brief's grep over the six files prints nothing (exit 1).
- **ARCHITECTURE.** § Routing (three groups plus the W90 clause), § Chrome's first sentence, the `SiteChrome` and `ClientIslands` bullets, the nav-groups, per-page CTA, 901 px and contact-click paragraphs, Quality gate item 3 and the named-deltas bullet are all present, as are the moved-path edits in entry points and the env table.
- **CONTENT-MODEL.** The nav row sentence, the `nav.legal`/`nav.home` Chrome bullet, the W90 client-subset paragraph, the six canonical-id rows, the Primary CTA `k` cell and the § Blog sentence are present.
- **ANALYTICS.** The consent-banner sentence, the five rows, the `call_click` "Fires on" cell, the enum paragraph, the T0c fragment, the "wired or not" wording and the § Conversion path are present.
- **SEO.** § Sitemap (30 URLs / 26 404) and § Robots are present.
- **PRD.** The rows 12–13 suffix, the 901/1101 breakpoint phrase and the "Not yet built" ending are present.
- **CLAUDE.md** (the short version).
  - The two missing anchors are replaced by a W19 Conventions bullet and a rewritten D20 bullet. Both carry the rules.
  - The new bullet omits "site-wide JSON-LD and `generateStaticParams`" but points to ARCHITECTURE § Routing, which has them. Accepted.
- **INTEGRATIONS.** I15 was updated for W88 (extra, correct).
- **Untouched.** `git diff --stat ef15ba2 fe4f8c0 -- docs/superpowers/` is empty, and neither `3fcd449` nor `bf8ceb7` touches `docs/superpowers/`.

### Produces
- **Intact.** Every frozen name and signature is on disk as written.
- **Additions, accepted.**
  - `SERVER_ONLY_SYS` and `pickClientMessages` (W90).
  - `sys.nav.home` (W80).
  - Portal rows `{href:'/portal-login', external:false}` (W88).
- **Stale planning text.** The Produces comment "the portal login is the groups' `external` row (W36)" and "W39: Task 5's sys.nav block is { main, close, legal, breadcrumbs }" are now stale in `produces-final.md` (see ⚠️ 2).

### Frozen and forbidden
- `contract/`, `design-package/` and `src/app/sitemap.ts` are unchanged (`git diff --stat` empty).
- `src/content/local/*` equals the importer's output.
- The only `src/**` imports of `@/content/local/*` are the three eslint-exempt tests (`Footer`, `Header`, `SlimBar`). `ctas.test.ts` reads the bundles with `readFileSync`.
- The changed source adds no `any` or `@ts-ignore`. The only casts in the diff are the brief's own (`StaticPathname`, `keyof typeof pathnames`) and the tests' `window as unknown as …`.

## Findings

**Critical** — none.

**Important**

1. **The header's secondary CTA is never hidden, and the slim bar's phone and e-mail show on phones, because `hidden` loses to the element's own base `inline-flex`.**
   - **Where.**
     - `src/design/chrome/HeaderCtas.tsx:12` builds `SECONDARY = buttonClassName('secondary', 'md', 'hidden whitespace-nowrap xl:inline-flex')`. `buttonClassName`'s `BASE` already carries `inline-flex`.
     - In the built stylesheet (`.next/static/chunks/04zpzm1etdkzm.css`) `.hidden{` sits at offset 12,942 and `.inline-flex{` at 13,021. At equal specificity the later rule wins, so below `xl` the element is displayed.
     - The same conflict sits at `src/design/chrome/SlimBar.tsx:38` and `:46`: `hidden lg:inline-flex ${LINK}`, where `LINK` (line 18–19) starts with `inline-flex`.
   - **Input → wrong output.**
     - Any page at 390, 460, 700, 900, 901, 1000 or 1100 px renders "İş Ortağı Olun" beside "Talep". Its computed `display` is `flex` (blockified in the flex row) and its width is above 0; see screenshots `$S/hdr-390.png`, `hdr-900.png`, `hdr-901.png`, `hdr-1100.png`.
     - The brief and W11 say it is `xl`-only "exactly as designed", as do `Header.tsx:42`, `HeaderCtas.tsx:10-11` ("proven by the gate at 1100" — the sweep measures overflow only) and `docs/ARCHITECTURE.md:259` and `:282`.
     - The slim bar's phone and e-mail render at 390 px and turn the slim bar into two lines, although both are classed `hidden lg:…`.
     - Layout cost on `/en` (`$S/probe-wrap.mjs`): as shipped, the desktop nav wraps to two lines at every width from 901 to 1100 (header 113 px). With the secondary hidden as designed it is one line from 1000 px (header 79 px).
     - A DOM scan (`$S/probe-hidden.mjs`) for elements carrying both `hidden` and an unprefixed display utility finds exactly these three anchors on `/` and `/tesekkurler`.
   - **Origin.** WP1's `<Button className="hidden … xl:inline-flex">` and the WP1 slim bar had the same conflict, so the bug is inherited. Task 3 re-implemented both elements (a new `HeaderCtas`, a full `SlimBar` rewrite) and wrote docs that assert the opposite.
   - **Why the tests miss it.** No unit or e2e test asserts visibility, and jsdom applies no CSS.
   - **Fix.**
     - Use `max-xl:hidden whitespace-nowrap` for the secondary CTA and `max-lg:hidden` for the two slim-bar links. Media-variant utilities sort after base utilities, so they win.
     - Alternatively, wrap the elements, or drop the base display from those class strings.
     - Add e2e visibility assertions: the secondary is hidden at 1100 and visible at 1101; the slim-bar phone is hidden at 900 and visible at 901.
     - Add a jsdom guard: no chrome element carries `hidden` together with an unprefixed display class.
     - Record the rule in `docs/ARCHITECTURE.md` § Design system or GOTCHAS: Task 5's `ContactCta` and `StickyCtaBar` also compose `buttonClassName` (produces-final l. 489).
   - **Confirmed by** browser probes against the built app on `next start`, the computed styles, the screenshots and the CSS offsets.

**Minor**

1. **W17's "SSR-consistent" holds only for static keys** (`src/design/chrome/ctas.ts:5-6, 121-126`; `HeaderCtas.tsx:34`).
   - next-intl's `getRoute` (probe `$S/getroute.mjs`) maps what a statically prerendered TR careers-detail page computes on the server (`/careers/x`) to `/careers/x`, and the browser's `/kariyer/x` to `/careers/[slug]`. EN and `/blog/[slug]` map identically on both sides.
   - Today no dynamic key has an entry, so both sides fall back to the defaults and nothing mismatches. The server HTML probe above confirms this for the static keys.
   - Produces invites page tasks to "edit its entry here". The first `CTA_BY_PATHNAME['/careers/[slug]']` would render the default CTAs in the SSG HTML and the entry after hydration: a hydration mismatch on TR only.
   - Fix: a `ctas.test.ts` case that no table key contains `[` (or a normalisation in `ctasFor`), and correct the comment. See ⚠️ 4.
2. **The move left a stale boundary path in the docs.** The last sentence of the § Sentry paragraph (`docs/ARCHITECTURE.md:305`) still reads "the two Next.js error boundaries (`[locale]/error.tsx`, `app/global-error.tsx`)". The boundary is now `(site)/error.tsx` plus the `(minimal)` re-use, three in all. The first mention in the same paragraph was updated.
3. **Stale comments in moved files** (Deviation 8, the brief's no-edit Move rule).
   - `src/app/[locale]/(site)/[...rest]/page.tsx:3-6` still says it "renders `[locale]/not-found.tsx`".
   - `(site)/error.tsx:5` still says "The locale segment's error boundary".
   - Fix on the next touch.
4. **Middle-click opens are not counted.** `ContactLink` (`src/analytics/ContactLink.tsx:18`) listens to `onClick` only. A middle-click (`auxclick`) opening WhatsApp in a background tab fires no `whatsapp_click`. This is a small, optional analytics gap: an `onAuxClick` that fires when `e.button === 1` would close it.

## ⚠️ Design items needing a controller ruling

1. **Scope and timing of the Important fix.**
   - The header secondary CTA is Task 3's own W11 code and docs. The two slim-bar links carry the same WP1 bug, in a file Task 3 rewrote.
   - **Recommendation:** a small Task 3 fix round now covering all three elements, plus the two e2e assertions and the jsdom guard. Deferring would let Task 5 compose `buttonClassName` into more `hidden …` strings first.
2. **The planning docs contradict the additions.**
   - `task-5-brief.md:350-380` prints the `sys.nav` block as `{ main, close, legal, breadcrumbs }`, which drops W80's `home`.
   - `produces-final.md` (Task 3 block) still says "the portal login is the groups' `external` row" and "Task 5's sys.nav block is { main, close, legal, breadcrumbs }".
   - W80's messages test turns red if Task 5 copies the block literally, so it cannot slip silently. It would still cost Task 5 a red cycle.
   - **Recommendation:** add one line to `task-5-additions.md`: "`sys.nav` is `{ main, close, home, legal, breadcrumbs }` — add `breadcrumbs` after `legal`, keep `home` (W80)". Annotate produces-final's Task 3 block with W80, W88 and W90.
3. **JS-budget measurement method for the ledger** (W13 amended says each page "records per-route script size").
   - The report's 206,445 B gz-9 includes `/_next/static/chunks/0cz1d0mv5g_q7.js`, loaded `<script noModule>`: Next's legacy polyfill, 39,373 B gz, which Chrome and Lighthouse never fetch.
   - Measured at HEAD, the module scripts come to **167,072 B gz-9 / 144,272 B br-11** on `/`, `/en`, `/isci-talebi` and `/en/hire-workers`, and 167,463 / 144,628 on `/tesekkurler?form=hire`. The report's HEAD figures are exactly these plus the polyfill (`$S/jsgraph2.mjs`).
   - **Recommendation:** the binding figure is Lighthouse `resource-summary:script:size` on the preview. The local proxy is gzip-9 over the `<script src>` set, excluding `noModule`. Correct the Task 3 ledger line to 167,072 B.
4. **Contract for dynamic keys in `CTA_BY_PATHNAME`** (Minor 1).
   - **Recommendation:** rule that localized dynamic keys (`/careers/[slug]`) get no entry unless `ctasFor` first normalises the prerender pathname, and pin it with a unit test now. Otherwise a WP2b detail-page task hits a TR-only hydration mismatch that no current test sees.

## The implementer's concerns and deviations — verdicts

**Concerns**
1. **Task 5 would drop `sys.nav.home` — accept.** The concern is real: the printed block omits `home`. The controller should act per ⚠️ 2. The W80 test is a backstop, not a fix.
2. **JS budget — reject the alarm; accept the delta.**
   - The 206,445 B figure counts a `noModule` script that modern browsers never download.
   - The modern first-load graph at HEAD is 167,072 B gz-9, which leaves **37.7 KB gz** of headroom under 204,800. At 144,272 B br-11 it also clears the old 184,320 still in `lighthouserc.json` (Task 7 moves it).
   - The report's HEAD numbers equal mine plus the polyfill. The polyfill chunk is framework code and identical at BASE, so its BASE→HEAD delta of **+740 B gz / +699 B br** stands.
   - A BASE build could not be made under the no-clone rule, so that delta rests on the report's `git archive` measurement. It is consistent in structure: the chunk contents match.
   - The shared (site) chunk (`0znimyflo72xj.js`, 12,057 B gz) carries Dialog, Tabs and PausableMarquee code through the primitives barrel. That is a Task 7 saving, not a Task 3 regression (Parked 3).
3. **Chrome links 404 until T13 — accept as transitional.** W11 and W88 require the links now, the branch deploys previews only, and T13 lands before cutover. The same class covers the CTA anchors (`#proposal`, `#request-form`), which the placeholder pages do not render, so the homepage's primary CTA is a no-op click on previews. BASE linked the real `/hire-workers` page. Parked 2.
4. **Pre-existing doc drift — both parts verified.**
   - (a) **Confirmed.** `docs/ARCHITECTURE.md:47` still says "There is no `src/forms/` directory yet", but `src/forms/` exists and line 200 of the same doc says it was built in WP2a.
   - (b) **The drift is in the doc, not the data.**
     - `docs/ARCHITECTURE.md:150` says `gone.json` holds "`/blog/*` … 20 entries today". `redirects/gone.json` has **19** entries and **no `/blog/`**. `rules.json` keeps `/blog` as a `keep` row, and `e2e/redirects.spec.ts:52` asserts `/blog/anything` is *not* gone (R53).
     - `src/proxy.ts` 410s only on a `GONE` prefix match, so `/blog/[slug]` passes to next-intl. Today it 404s through `[...rest]`; it will be **served** once the blog page exists, and it is never 410'd.
   - Also verified: the report's concern 4 (`ops.spec` 401 cases return 503 without `REVALIDATE_SECRET`, R43 fail-closed) and concern 6 (stale `.next/types` locally) — both accepted, both pre-existing and local-only.

**Deviations**
1. **W88 adaptations — accept.** The additions win.
   - SlimBar's `PORTAL = new Set(['/portal-login'])` only chooses a class for a row the group itself emits. There is no anchor, URL or label id, and if the group loses the row no pill renders.
   - It mirrors the brief's own `ACCENT` set. W36 holds.
2. **The `sys.nav` block carries `home` — accept** (W80).
3. **The locale layout is not byte-identical — accept.** The W90 picker is binding.
4. **The scoped `home.002` query in `Header.test` — accept.** The duplicate it scopes past is the design's own: the nav's "İşçi Talebi" and the page's secondary "İşçi Talebi" share a label and a destination, which is not a WCAG failure. It surfaces in jsdom because no CSS applies. Hiding the secondary below `xl` (Important 1) removes it from 901 to 1100.
5. **RED wording — accept.** Same causes.
6. **Missing CLAUDE.md anchors and substitutes — accept.** The substitutes carry the rules, and "four settings-driven groups" is the correct count.
7. **Doc extras — accept.** They are needed so no doc contradicts the moved paths or W88.
8. **Moved files keep their stale comments — accept per the Move rule.** Fix later (Minor 3).
9. **Full Playwright suite instead of a subset — accept.** The `ops` 503 is by design.

**Produces additions** — accept, as listed above.

## Parked (out of Task 3's scope, for the WP2a final review)

1. **404s are server-rendered as Next's empty error shell.** `curl /boyle-bir-sayfa-yok` (also `/xyz`, `/en/xyz`, `/blog/test` and the production `/dev/gallery`) returns `<html id="__next_error__">` with no header, `<main>` or `lang`. The client then renders the `(site)` not-found view from the inlined flight data, which is why the e2e 404 cases pass.
   - This is **not a Task 3 regression.** A minimal Next 16.3.5 app (`$S/nf-exp`) returns the same shell for a BASE-shaped tree (`[locale]/not-found.tsx`) and a HEAD-shaped tree (`(site)/not-found.tsx`).
   - R6 therefore holds only after hydration: no-JS clients and crawlers get a blank 404 body. Decide whether to accept this (404s are noindex anyway) or look for a server-rendered 404.
2. **Pre-cutover check for transitional dead targets.** The chrome links `/portal-girisi`, `/gizlilik` and `/kullanim-kosullari`, and the header CTAs point at anchors their pages do not render yet. Suggest a Task 7 or cutover gate step: every chrome href returns 200, and every `CTA_BY_PATHNAME` anchor id exists on its built page.
3. **JS saving candidate.** `(site)/error.tsx` and `HeaderCtas.tsx` import the `@/design/primitives` barrel, so the shared chrome chunk carries `'use client'` Dialog, Tabs and PausableMarquee code (`aria-modal`, `tablist` and `marquee` strings in `0znimyflo72xj.js`). Deep imports are a Task 7 JS-pass item.
4. **Doc drift outside Task 3.**
   - `ARCHITECTURE.md:47` (`src/forms/`).
   - `ARCHITECTURE.md:150` (`/blog/*`, "20 entries").
   - The script budget: `CLAUDE.md` ("Content-route JS budget is 180 KB") and `ARCHITECTURE.md` § Quality gate / `lighthouserc.json` (184,320 B) still predate W13 amended (204,800 B), which is Task 7's `lighthouserc` edit.
5. **`StaticPathname` is defined twice:** exported from `src/lib/seo/routes.ts:16` and redefined locally at `src/app/sitemap.ts:11` (the brief kept `sitemap.ts` unchanged). Task 4 can import the export.
6. **Header height between 901 and 1100.** Even with Important 1 fixed, the EN nav wraps to two lines between 901 and roughly 999 (113 px sticky header). The slim bar wraps to two rows between 901 and 1100. Leave both for the WP2 pixel-comparison pass.
