# Task 5 review: primitive extensions, shared blocks, `formatDate` (T0d + W27, additions W78/W81–W84), `6a9689c..18cf4c9`

**Spec compliance:** ❌ non-compliant. The code faithfully transcribes the brief plus W78/W81–W84: 34 of the 45 whole-file blocks are byte-identical, the other 11 differ only by those additions, and Produces is intact. But HEAD **does not build**: the brief's own Cycle 9 `npm run dev` check was skipped. FaqBlock's ask card also breaks the binding W122 addition, and W78 shipped without its docs.
**Code quality:** ❌ changes required: 1 Critical, 4 Important, 5 Minor

The reviewer stayed read-only on the repo. The worktree stayed at `18cf4c9`, and `git status --porcelain` was empty before and after. `next dev` twice appended its `nextjs-agent-rules` block to `CLAUDE.md`, and both times it was discarded with `git checkout -- CLAUDE.md`. Scratch (`$R` below) is `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/b66860be-3e05-4c03-954a-f55becea5a18/scratchpad/review-task5/`.

## Spec compliance evidence

### Method and runs
- **Verbatim check.** `$R/extract.py` pulled every path-tagged fenced block of the brief into `$R/brief-blocks/`, and each whole-file block was `diff`ed against disk.
- **Gate, run once at HEAD.** `typecheck` ✓, `lint` ✓, `prettier --check` ✓, `vitest --maxWorkers=1` **80 files / 454 tests ✓**, with no stderr warnings (`$R/gate.log`).
- **Build, run once.** `NODE_OPTIONS=--max-old-space-size=4096 npm run build` **failed** at Turbopack compile, so no `next start` was possible (Critical C1). The owner's one-build rule was kept: no second build was run anywhere.
- **e2e against `next dev` at HEAD.** `E2E_BASE_URL=http://localhost:3000 npx playwright test e2e/chrome.spec.ts e2e/width-sweep.spec.ts e2e/smoke.spec.ts` gave **112/112 passed** (chrome 5, smoke 1, width-sweep 50, × mobile/desktop). The gallery was deliberately not requested in this session.
  - The first dev session was void. Requesting `/dev/gallery` compiled the broken module, and from then on **every** route 500'd in that session (chrome/smoke 12 failures, `/`, `/en` and `/isci-talebi` 500 by curl). See C1.
- **Gallery probes.** The gallery 404s under `next start` by design (R41 `notFound()` in production), and at HEAD it 500s under `next dev`. To inspect the blocks at all, I ran `next dev` in a scratch copy (`git archive HEAD` + an APFS clone of `node_modules`) with a **one-file probe patch**: `contactKindOf` moved into a pure `src/analytics/contact-kind.ts`, plus one import line in `ContactCta.tsx`.
  - With that patch, `/dev/gallery` and `/en/dev/gallery` return 200, and `/` and `/en` stay 200.
  - Every gallery observation below is on "HEAD + that patch". Scripts are `$R/gallery-probe.mjs`, `$R/behaviour-probe.mjs`, `$R/probe3.mjs` and `$R/sticky-debug.mjs`. Screenshots are in `$R/shots/` (full page) and `$R/shots/el/` (per section, 390 and 1440).
- **CSS probe.** `$R/css-probe.mjs` ran over the dev-served stylesheet, since no production CSS exists.
  - It found no utility used by the new or changed files that lacks a rule.
  - The W18 `calc()` values compile with operator spacing, e.g. `bottom: calc(18px + var(--sticky-cta-h, 0px))`.
- **Process check.** It was run after every heavy step. The last check shows no `vitest`/`next`/`playwright`/`chromium` process of mine.

### Verbatim
- **Whole-file blocks: 45.** 34 are byte-identical. The 11 that differ each differ only by an addition:
  - `Timeline.tsx` and its test: W84.
  - `ContactCta.tsx`, `ClosingCtaBand.tsx`, `EmptyState.tsx` and the `ContactCta`/`EmptyState` tests: W82.
  - `FaqBlock.tsx` and its test: W83.
  - `StickyCtaBar.tsx` and its test: W81 + W82.
  - Every addition test case is present, including W82's `{ pathname: '/hire-workers', hash: '#request-form' }` → `/isci-talebi#request-form` under `tr`, which appears in `ContactCta.test`, `EmptyState.test` and `StickyCtaBar.test`.
- **Partial edits are all exact:**
  - `en.json`/`tr.json`: `nav.breadcrumbs` after `legal`, **`home` kept** (W80, addition 1); `blocks` after `whatsapp`.
  - `Button.tsx`: only the `ButtonVariant` line and the `VARIANT` map.
  - `primitives/index.ts`: two additive line edits; `buttonClassName` untouched (W39).
  - `icons.tsx`: `CheckIcon`/`ClockIcon` appended after `LinkedInIcon`.
  - `WhatsAppFab.tsx`: token plus docblock.
  - `LanguageHint.test.tsx`: one `describe` appended (5 → 6 cases).
  - `LanguageHint.tsx`: **purely additive**, 4 lines against `git show 6a9689c:` (the className string plus two comment lines). Every Task 4 line stays: `NextLink`, `useAlternatePath`, `alternatePath`, `getPathname`, one element type in both branches. Task 4's no-remount test (`toBe(before)`) is still present and green.
- **Gallery.** `Wp2Blocks.tsx` and `RadioChipsDemo.tsx` are byte-identical to the brief. `page.tsx` has exactly the three sentence-anchored edits, plus the `tf('home.024')` fix (Task 1 review minor).
  - `page.tsx` now reads no re-authored `{metric}` id through `makeT`; checked against `scripts/metric-placeholders.json`.
  - The gallery was edited in place under `(site)/` (W41).

### Produces (frozen): intact, additions only
- Every frozen export exists with its name and signature: `date.ts` ×3, `SectionTone`/`Section`, `Stat`, `TimelineStep`/`Timeline`, `Tabs.onChange`, `RadioChips`, `ButtonVariant` + `inverse`, `StickyCta`/`STICKY_CTA_HEIGHT_VAR`/`isBarVisible`/`StickyCtaBar`, the 13 blocks and their prop types, the barrel (re-exporting T0b's row types), and `testBundle`/`BLOCK_STRINGS`.
- **Additions** (for `produces-final.md` "Task 5 — as built"):
  - `ContactCtaProps.href`, `Cta.href`, `EmptyStateCta.href` and `StickyCta.href` are `string | Exclude<Href, string>`, with **`Href` from `@/i18n/navigation`** (W82).
  - `FaqAskCard` gains `email?`, `emailLabelId?` and `subject?` (W83).
  - `TimelineStep.body?` (W84).
  - The `StickyCtaBar` wrapper carries `data-testid="sticky-cta"`, and its CTAs go through `ContactCta` `page_cta` (W81).
  - `src/forms/options.ts`: `START_WHEN_KEYS` and `StartWhenKey` (W78).
  - `CheckIcon`/`ClockIcon` in `src/design/chrome/icons.tsx`.

### Rulings, one by one
- **W13.** No file under `src/design/blocks/` starts with a directive. The only `'use client'` string is a comment in `ContactCta.tsx:31`. The blocks are server components by intent. The one import that breaks that intent is C1.
- **D17/W1/W55.**
  - All 8 bundle-taking blocks take `locale` and call `makeTf(bundle, locale)`; none calls `makeT` (grep).
  - The patched gallery resolves `hire.198`'s `{metric}` to "4 iş saati".
  - `MetricStrip` skips unsigned metrics (test, plus the gallery hiding `employers`).
  - `Stat`: `text` wins, with no `aria-hidden` twin.
  - Every placeholder is named: the gallery run found `blog-cover-turkey-work-permit-process-employer-guide` ×2 and `gallery-placeholder`, and no empty `data-placeholder`.
- **W12/W32/W81/W82.**
  - `ContactCta` wraps `ContactLink` in `buttonClassName(variant, size, className)` and passes no `onAuxClick` (addition 3).
  - An object href renders through next-intl `Link`.
  - `StickyCtaBar` routes every CTA through `ContactCta` `page_cta`; the tel CTA → `call_click`/`page_cta` test is green.
  - **The `Href` source is accepted.** In next-intl 4.14.5, `getPathname`'s href object branch is `HrefOrHrefWithParams` = `{ pathname; params?; query? }`, with no `hash` (`node_modules/next-intl/dist/types/navigation/shared/utils.d.ts:21`). `Link`'s is `Omit<UrlObject,'pathname'>`, which carries `hash`. So W82's own example is an excess-property error against `@/lib/seo/routes`' `Href`.
  - `src/design/chrome/ctas.ts:1` already types the same object form with the navigation `Href`.
  - `Crumb.href` correctly keeps the routes `Href`, because it feeds `absoluteUrl`.
- **W18.**
  - The bar publishes its height and the consumers add it. On clean HEAD dev, with `--sticky-cta-h: 64px` set on `<html>`, the hint moved 16→80 px and the FAB 18→82 px at 1000 px, and the hint 12→76 px at 1440 px.
  - In the patched gallery, real scrolling gave var `69px` (1000) / `63px` (1440), FAB 18→87 and hint 16→85.
  - With `hideNearId`, the bar hides once `#gallery-end` reaches 50% of the viewport and stays hidden after it; below `lg` it is `display:none`. The fallback `var(--sticky-cta-h,0px)` covers "no bar".
- **W119/W122.**
  - No bare `hidden` sits beside an unprefixed display utility anywhere in the blocks or gallery. The only `hidden` tokens are the prefixed `md:hidden`, and the StickyCtaBar's `hidden … lg:block`.
  - `DISPLAY_UTILITIES` gained `inline-table|flow-root|list-item|table-row|table-cell`.
  - **Same-property collisions: not compliant.** See I1 and I2.
- **W54/W9/W23/W78/W80.**
  - Both locale files now have `sys.nav` = `{ main, close, home, legal, breadcrumbs }`, `sys.blocks.readMinutes`, and `sys.form.options.startWhen.{asap,month1,months1to3,planning}`, carrying exactly the W78 strings (en dash U+2013 verified). Parity tests are green.
  - No invented ids: the patched gallery rendered in dev, where `makeT`/`makeTf` throw on an unknown id, in both locales. Every id the blocks read (`home.192/221`, `hire.240/241`, `blog.034/036/037/038/077/081`) plus the gallery's ids exists in both bundles.
- **W33/W34.** Rows are parsed through `getCollection`/`getOffice` in the tests, so they meet the schemas. `OfficeCard` renders the row's own ids (identical to the brief). `PostCard` returns `null` for an unwritten locale (test). `hours.days` is `[1..5]`.
- **W27/W6/W5/W8.** Verified by the gallery and unit tests:
  - `EmptyState` has `role="status"`.
  - `ImageSlot` renders the gradient placeholder, or `next/image`.
  - `NewsletterBand` is `null` while inactive.
  - `StoreBadges` shows Android only.
  - `LogoMarquee` is `null` for `[]`.
- **Breadcrumbs / FaqBlock.**
  - Breadcrumbs is `<nav aria-label="Sayfa yolu"|"Breadcrumb"><ol>`, and the last item is a `span[aria-current=page]`.
  - The `BreadcrumbList` URLs are absolute (`https://www.jobsadmire.com/`, `/blog`, `/isci-talebi`; EN `/en`, `/en/blog`, `/en/hire-workers`).
  - FaqBlock emits one `FAQPage` with 6 `mainEntity` entries.
  - W109 (a WP2b rule) is satisfied by the API shape: crumbs are resolved names, so a page passes its own ids and nothing forces `sys.nav.home`.
- **`formatDate` family.** TR `12 Ocak 2026`, EN `12 January 2026`, UTC calendar dates (tests). The gallery shows `12 Haziran 2026 · 8 dk okuma`. The module is imported only by `PostCard`, a server component.
- **Keyboard and motion (patched gallery):**
  - RadioChips: ArrowRight moves the check (`general`→`skilled`), focus stays on the checked radio, and the chip shows a `2px solid rgb(16,115,168)` ring through `peer-focus-visible`.
  - Tabs: click/ArrowLeft/End each fire `onChange` (`t2`/`t1`/`t2`), and focus follows.
  - LogoMarquee: the duplicate track is `aria-hidden` + `inert`, and under `prefers-reduced-motion` the track is `paused`. The Pause button is present.
  - Timeline `horizontal` is a stacked `row` flow at 390 and a `column` flow with `minmax(0,1fr)` from 701 (md).
  - There were no console errors or hydration warnings at 390/901/1440 in either locale.

### Docs (W45) and ownership
- The brief's "Docs in this task" edits are all present:
  - `ARCHITECTURE.md` § Design system: the paragraph was replaced. The BASE paragraph held no Task 3/4 sentence; the W119 `buttonClassName` sentence lives in § Chrome "Per-page header CTAs (W17)" and survives.
  - `ARCHITECTURE.md` § Chrome: the StickyCtaBar paragraph now describes W18/W81.
  - `CONTENT-MODEL.md`: `nav.breadcrumbs`, the Blocks bullet, the seven canonical-id rows plus one sentence, and the § Adding copy sentence.
  - `SEO.md`: the JSON-LD clause.
  - `ANALYTICS.md`: three cells plus one clause.
  - `PRD.md` §11: "14 … and the shared page blocks".
  - The "13 → 14" count is also fixed in ARCHITECTURE's Repository layout bullet.
- `docs/superpowers/handoff-2026-09-25/**`, the ruling log, `docs/WEBSITE-HANDOFF.md` and `CLAUDE.md` are untouched (`git diff --stat` empty).
- **Gaps:** W78 is undocumented, and ANALYTICS does not name `StickyCtaBar` (M1, M2).

### JS budget (W120)
- **Not measurable.** HEAD has no production build (C1). The Task 4 baseline is 167,851 B gz-9 at `f14f635`.
- Static trace for `/` and `/en`:
  - No block and no `StickyCtaBar` is mounted there.
  - Changed code reachable from the site chrome is limited to `LanguageHint`'s class string and `Button`'s `VARIANT` map (+1 entry).
  - However, `HeaderCtas` and `ConsentBanner` (client chrome on every page) import the **primitives barrel**, which gained a `'use client'` re-export (`RadioChips`) and a changed `Stat`/`Tabs`. Whether Turbopack drops those from the shared chunk must be measured.
- `StickyCtaBar` imports `@/design/blocks/ContactCta` directly, not the blocks barrel, so `PostCard` → `date.ts` → both message JSONs stays out of that graph.

## Findings

### Critical

**C1: HEAD does not build: a server component imports a module that imports `usePathname`.**
- **Where.** `src/design/blocks/ContactCta.tsx:3` has `import { contactKindOf } from '@/analytics/useContactClick'`, and `src/analytics/useContactClick.ts:3` has `import { usePathname } from 'next/navigation'`. `ContactCta` is a server component (no directive, by W13 design), reached as `Wp2Blocks` → `FaqBlock` / `ClosingCtaBand` / `EmptyState` → `ContactCta`.
- **Error.** `npm run build` fails with `Error: You're importing a module that depends on \`usePathname\` into a React Server Component module … ./src/analytics/useContactClick.ts:3:10` (trace in `$R/build.log`).
- **Scenario.** The break arrives with `d5a4eea`, the first commit whose app graph reaches `ContactCta` from a server component. So `d5a4eea`, `5d437c5`, `a996170` and `18cf4c9` are all red Vercel previews, against the global constraint "a red commit is a red preview".
  - Every WP2b page that mounts `FaqBlock`, `ClosingCtaBand` or `EmptyState` inherits the failure.
  - In `next dev`, `/dev/gallery` returns 500. After that first request, **every** route in the session 500s (`/`, `/en`, `/isci-talebi`, the 404 page) until restart, because the error is cached on a module the whole chrome shares.
  - jsdom unit tests cannot see RSC boundaries.
- **Origin.** The import is the brief's own. The brief's Cycle 9 Step 4 check (`npm run dev` → open `/dev/gallery`) would have shown it, but was skipped (see the verdict on deviation 6).
- **Fix, verified in the scratch copy.** Move `contactKindOf` and `ContactKind` (optionally `CONTACT_PLACEMENTS`/`ContactPlacement`; `track.ts` is RSC-safe) into a pure module, e.g. `src/analytics/contact-kind.ts`, that imports nothing client-only.
  - `useContactClick.ts` re-exports them, so Task 3's public API is unchanged, and `ContactCta.tsx` imports the pure module.
  - With exactly that change, both galleries render (200), the other routes stay 200, and there are zero console errors.
  - Add a guard so the fix cannot regress: a static test that no file under `src/design/blocks/` (and no non-`'use client'` module) imports `@/analytics/useContactClick`, and/or require `npm run build` in the fix round (⚠️ 4).
  - Docs: ARCHITECTURE § Chrome "Contact clicks (W12)" names where `contactKindOf` lives.

### Important

**I1: W122 same-property collisions in FaqBlock's ask card. This violates binding addition (4).**
- **Where.** `src/design/blocks/FaqBlock.tsx:86` passes `className="border-success-border text-success-text hover:bg-success-surface"`, and `:95` (call) and `:105` (W83 e-mail) pass `className="text-blue-safe"`, all onto `ContactCta variant="secondary"`. `secondary` already sets `border-border-1 text-ink hover:border-tint-border hover:bg-pale-1` (`Button.tsx:11`).
- **Scenario.** Tailwind 4 orders the rules alphabetically within a property, not by class-string position:
  - The call and e-mail rows render **ink** (rgb 22,32,46), not the intended blue-safe.
  - The green WhatsApp button's border flips to **tint-blue** (rgb 191,223,240) on hover, because the variant's `hover:border-tint-border` beats the caller's `border-success-border`.
  - Green text and border only win by accident of alphabetical order.
- **How confirmed.**
  - Computed styles in the patched gallery at 1000 and 1440 (`$R/behaviour.jsonl`, `w122-askcard-*`).
  - Rule order in the served CSS: `text-ink`@35702 after `text-blue-safe`@35588, and `hover:border-tint-border`@47095 after `border-success-border`@25305.
  - The screenshot `$R/shots/el/1440-11-…FaqBlock.png` shows "Bizi arayın" in ink.
- The report's self-review claims no same-property collision "and the sweep is green over all of them". That is incorrect: the sweep checks only `hidden`+display.
- **Fix.** Per W122's own remedy, either a dedicated variant or no caller override. See ⚠️ 1; it touches the frozen `ButtonVariant`.

**I2: PostCard `row` is broken while its cover is a placeholder (all of Phase A). This is a W122-class width collision.**
- **Where.** `ImageSlot`'s placeholder base string starts `w-full …` (`src/design/blocks/ImageSlot.tsx:58`). PostCard's row cover appends `w-[104px] shrink-0` (`src/design/blocks/PostCard.tsx:17`, joined at `:67`), and `w-full` wins.
- **Scenario.** The cover takes the whole card (316 px at 390, 350 px at 701/901) with `shrink-0`, the text column is **0 px**, and the title, category and byline spill past the card.
  - Article `scrollWidth` vs `clientWidth` is 423 vs 348 at 390, 457 vs 382 at 701/901, and 352 vs 286 at 1440.
  - At 390 the **page** scrolls horizontally (`scrollWidth` 444 TR / 472 EN), so any page mounting `variant="row"` fails the width-sweep gate. The WP2b draft `wp2b/task-1.md:3116` mounts it.
- **How confirmed.** `$R/probe3.mjs` (`timeline+row`), the overflow offenders in `$R/gallery-probe.jsonl`, and the screenshots `$R/shots/el/{390,1440}-16-PostCard_*.png`: the row card is a tall gradient, and at 1440 the text fragments show outside it.
- **Fix.** Size the row cover with a wrapper (`<div className="w-[104px] shrink-0">`) instead of a class on `ImageSlot`, or make `ImageSlot`'s width caller-owned (⚠️ 3).

**I3: PostCard byline fails contrast (2.56:1).**
- **Where.** `src/design/blocks/PostCard.tsx:89` uses `text-muted`, which is `--color-muted: #94a3b8` on white. The text is 12 px bold (11 px from 1101), so it needs 4.5:1.
- **Scenario.** axe `color-contrast` (serious) fires on every PostCard variant, in both locales, at 390/901/1440 (2–3 nodes per run).
  - Every WP2b route with a PostCard (Blog, Article related, Homepage teaser, Work Permit "keep reading") fails the zero-axe gate.
  - The brief specified the class, and the implementer transcribed it.
- **How confirmed.** `@axe-core/playwright` scoped to the Wp2Blocks region (`$R/gallery-probe.jsonl`).
- **Fix.** `text-text-tertiary` (#64748b, 4.76:1, already used by the excerpt) or `text-text-secondary`. This is a D20 named delta (⚠️ 2).

**I4: `ClosingCtaBand tone="green"` fails contrast for its body, ticks and `inverse` CTAs.**
- **Where.** `src/design/blocks/ClosingCtaBand.tsx:21` (`green: 'bg-success-text'` = #12813c) with `:78` body `text-white/70`, `:80` ticks `text-white/75`, and the default `inverse` face for secondary/extra CTAs (`Button.tsx:16`, white on `bg-white/10`).
- **Scenario.** axe gives body **3.25:1** and each inverse button **4.13:1**; the ticks compute to about 3.5:1 below md. The navy and gradient tones pass.
  - WP2b Task 6 (About, `wp2b/fixed/task-6.md:1840`) mounts exactly `tone="green"` + `bodyId` + a WhatsApp secondary with the default `inverse` face, so About's gate fails.
- **How confirmed.** The gallery's full navy band was recoloured to `bg-success-text` (a class already in the stylesheet), then axe `color-contrast` was run on it (`$R/probe3.mjs`, `green-band-simulation`). The gallery's own green band has no body or secondary, so it hides the defect.
- **Fix.** Make the body/ticks tone-aware (full `text-white` on green) and give the CTA face a green-safe inverse, or darken the band surface (⚠️ 2).

### Minor

**M1: W78 shipped without docs.**
- `docs/CONTENT-MODEL.md:49` (§ `sys.*` range, **Forms** bullet) enumerates `form.labels`/`placeholders`/`hints`/`errors`/… but not `form.options.<field>.<key>` (`startWhen.{asap,month1,months1to3,planning}`).
- No doc names `src/forms/options.ts`/`START_WHEN_KEYS`; ARCHITECTURE § Forms flow is the natural place.
- Commit `5d437c5` touched no doc. CLAUDE.md says "a task is not done until the docs match the code".

**M2: ANALYTICS and ARCHITECTURE lag W81/W122.**
- `docs/ANALYTICS.md:58–60` ("Fires on" cells) and `:73` list the `page_cta` sources as `ClosingCtaBand`, `FaqBlock`'s ask card and `EmptyState`. Since `a996170`, `StickyCtaBar` fires `page_cta` too; only ARCHITECTURE § Chrome says so.
- `docs/ARCHITECTURE.md:283` still says `visibility.test.tsx` "guards the chrome". It now also sweeps the blocks.

**M3: `ImageSlot` passes the deprecated `priority` to `next/image`.**
- `src/design/blocks/ImageSlot.tsx:43` has `priority={priority ?? lcp}`. In Next 16.3.5, `priority` is `@deprecated Use preload` (`node_modules/next/dist/shared/lib/get-img-props.d.ts:24–28`). It still works today (`preload: preload || priority`, `get-img-props.js:587`).
- Keep the frozen `priority`/`lcp` props and map them to `preload` internally. No Produces change is needed.

**M4: `ImageSlot`'s image branch doesn't keep the slot's box.**
- The placeholder is `w-full` + `aspect-ratio: w/h`. The `<Image>` gets neither, so `height:auto` (preflight) takes the **asset's** natural ratio and `object-cover` (PostCard) crops nothing.
- In the gallery, the featured PostCard's 640×202 slot renders the 1:1 asset as a square (`$R/shots/el/1440-16-*.png`).
- The docblock's claim that the placeholder "reserves the same box as the image" holds only for exact-ratio assets.
- Phase A has no photos, but WP2b LCP heroes will. Give the image branch the same `aspect-ratio` (and width policy, see I2) as the placeholder.

**M5: W122 render-sweep coverage gaps.**
- `src/design/chrome/__tests__/visibility.test.tsx:158` does not render:
  - `StickyCtaBar`: it renders `null` until scrolled, and the addition names it; mock `scrollY` as its own test does.
  - `ClosingCtaBand` `gradient`.
  - `EmptyState` `pale`.
  - `ImageSlot`'s `src` branch.
- None carries a bare `hidden` today, so there is no live defect.
- By construction the guard cannot see same-property collisions. That is how I1 and I2 slipped through; the ruling's "static class-literal scan" alternative would not have caught them either.

## ⚠️ Design items needing a controller ruling

1. **I1 remedy: `ButtonVariant` is frozen.** Options:
   - (a) Add dedicated variants, e.g. `whatsapp` = `border border-success-border bg-white text-success-text hover:bg-success-surface` (and a blue-text outline if the call/e-mail rows must stay blue). This is additive to the frozen union; update `produces-final.md`.
   - (b) Drop the caller overrides. The rows become plain `secondary`, and the WhatsApp button loses the design's green outline.
   - (c) Add a `tone` prop on `ContactCta` that picks a full class set.
   - W122 names (a) or "drop the base class" as the sanctioned remedies.
2. **Colours for I3/I4, as D20 named deltas.** Options:
   - PostCard byline `text-muted` → `text-text-tertiary`.
   - Green band: `text-white` body/ticks plus a green-safe inverse face (e.g. `bg-black/15`), or a darker band surface, instead of `/70` and `/75` on #12813c.
   - Both are design-visible, and About (WP2b T6) is the first consumer of the green band.
3. **Who owns `ImageSlot`'s width (I2/M4).** Options:
   - (a) PostCard wraps the row cover in a sized div. This is local, and `ImageSlot` is unchanged.
   - (b) `ImageSlot`'s base drops `w-full` (callers pass it) and both branches carry the aspect ratio.
   - Also pick a rule for pages: "never put width/aspect classes on `ImageSlot`, wrap it".
4. **Process: this task's "no build, no dev" reading of the memory rule let C1 through.**
   - The rule limits **concurrency**. The brief's Cycle 9 still asked for one sequential `npm run dev` render of the gallery.
   - Proposed ruling: any task that adds or edits a server component ends with one `npm run build` (or at least a `next dev` render of the gallery, killed immediately) before DONE, and the fix round for C1 runs the build.
   - Worth a gotcha line: one compile error in a shared module 500s every route for the rest of a `next dev` session.

## The implementer's deviations: verdicts

1. **`Href` from `@/i18n/navigation` for the four W82 hrefs: accept.** Verified against the installed next-intl 4.14.5 declarations (see W12/W82 above). `Crumb.href` rightly keeps the routes `Href`. Record it in `produces-final.md`.
2. **"13 → 14" also in ARCHITECTURE § Repository layout: accept.** It keeps the doc self-consistent. `docs/WEBSITE-HANDOFF.md:111` still says "13 primitives" and is the controller's file (parked).
3. **W84/W82/W83 folded into the cycles that first author those files; W78, W81 and the W122 guard as their own commits: accept.** Each addition has its own red→green test inside a verify-green commit.
4. **W78 JSON position (after `labels`, before `placeholders`): accept.** Key order is not load-bearing, and the parity test plus `messages.test.ts` are green.
5. **W122 guard as a DOM render sweep instead of a static scan: accept with a note.**
   - It is the addition's own offered option, it reuses the trusted checker, and the report shows it failing on a planted `hidden flex`.
   - Its coverage gaps are M5.
   - The self-review's claim that it also clears same-property collisions is wrong (I1, I2).
6. **No build, no dev server, no e2e: reject.**
   - The brief's Cycle 9 Step 4 requires `npm run dev` and a visit to `/dev/gallery` and `/en/dev/gallery`. The memory rule forbids parallel heavy jobs, not a single sequential check.
   - That one run would have shown C1 (500), and the report's Concern 1 anticipated the risk.
   - The id-by-script check was a good extra, but it cannot see module-graph errors.

Report concerns:
- (1) "Gallery unverified by a running dev server": **confirmed**. It does not compile (C1).
- (2) `npm run gate` not run: accepted, since it is a WP-level step.
- (3) W78 anchor: accepted (deviation 4).

## Parked (out of Task 5's scope, for the WP2a final review)

- **Measure JS (W120) after the C1 fix.** Watch the primitives barrel in the `HeaderCtas`/`ConsentBanner` client graphs: `RadioChips` is a new `'use client'` re-export. The Task 4 baseline is 167,851 B gz-9.
- **`produces-final.md` "Task 5 — as built"** needs the Produces additions listed above, plus the pure contact-kind module once C1 is fixed.
- **`docs/WEBSITE-HANDOFF.md:111` still says "13 primitives".** It is controller-owned.
- **One `FaqBlock` and one `Breadcrumbs` per page.**
  - Two of either emit two `FAQPage`/`BreadcrumbList` nodes and a duplicate landmark label.
  - The gallery shows axe best-practice `landmark-unique` because it renders Breadcrumbs twice, which is dev-only.
  - This is a WP2b page rule.
- **`src/lib/format/date.ts` imports both message files, and nothing enforces server-only.** `wp2b/fixed/task-9.md:781` already tells islands to import blocks by file, never through the barrel. An ESLint `no-restricted-imports` for client files (`@/design/blocks` barrel, `@/lib/format/date`) would make that mechanical.
- **Folder coupling.** `StickyCtaBar` (chrome) now imports `@/design/blocks/ContactCta`, and blocks import `@/design/chrome/icons`. There is no module cycle, but `ContactCta` may belong in a neutral place.
- **Nits (brief-faithful):**
  - `OfficeCard`'s hours row reuses `ROW`, so a non-interactive span turns blue on hover.
  - `Tabs.onChange` also fires when the already-selected tab is clicked. The contract says "selection change"; this is harmless for mirror state.
  - `sys.blocks.*` and `sys.form.options.*` ride in the client messages payload, because the W90 picker strips only `legal`/`seo`. This costs bytes only.
