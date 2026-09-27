# Task 5 report — Primitive extensions + shared blocks + `formatDate` (T0d, W27) + additions W78/W81–W84

**Status: DONE.** 12 commits on `wp2/foundation` (BASE `6a9689c` → HEAD `18cf4c9`), VERIFY_LOW (`typecheck && lint && format && vitest --maxWorkers=1`) green before every commit. Final suite: **80 files / 454 tests** (BASE 58 / 380: +22 files, +74 tests). No build/e2e run — the brief's Cycle 9 check is a manual `npm run dev` browse, not a Playwright run, and no later cycle asks for one; the MEMORY RULE says run none when the brief needs none, so the reviewer runs the build. Nothing pushed; working tree clean; no process of mine left running (`ps` check at the end).

## Commits

| SHA | Subject |
|---|---|
| `fe41add` | feat(format): formatDate/formatMonth/formatReadMinutes + sys.nav.breadcrumbs, sys.blocks.readMinutes (W54) |
| `6851886` | feat(primitives): Section pale/band tones, Stat text/prefix/tone (text wins, no count-up), Timeline horizontal variant + optional body (W84) |
| `5be4619` | feat(primitives): Tabs onChange, RadioChips radiogroup, Button inverse variant |
| `56e1f27` | feat(chrome): StickyCtaBar hideNearId + --sticky-cta-h publication; LanguageHint/WhatsAppFab stack above it (W18); testBundle helper |
| `695a6b0` | feat(blocks): ContactCta over ContactLink (W12/W32), FaqBlock (+FAQPage), Breadcrumbs (+BreadcrumbList), ClosingCtaBand |
| `847c84f` | feat(blocks): ProcessSteps, MetricStrip (metrics collection, unsigned hidden, unitId), OfficeCard (offices collection, own ids, ContactLink rows) |
| `27e4398` | feat(blocks): ImageSlot (named placeholders, D26/W55), EmptyState (W6), PostCard over T0b's blog rows (W33) |
| `0c9487c` | feat(blocks): NewsletterBand (hidden in Phase A), StoreBadges (Android only), LogoMarquee, barrel |
| `d5a4eea` | docs(design): gallery shows every WP2a block and variant; architecture/content-model/seo/analytics/prd updated for blocks, sticky stacking (W18), sys.blocks (W54) |
| `5d437c5` | feat(forms): START_WHEN_KEYS + sys.form.options.startWhen.* (W78) |
| `a996170` | feat(chrome): StickyCtaBar CTAs route through ContactCta (W81), object hrefs (W82), data-testid="sticky-cta" |
| `18cf4c9` | test(design): extend visibility.test.tsx to cover the blocks folder (W122 addition) |

Cycles 1–9 are the brief's own numbering (one commit each). The four `task-5-additions.md` rulings that could not be folded cleanly into an existing cycle's first draft got their own commits: W78 (`5d437c5`, independent), W81+the `StickyCta` half of W82 (`a996170`, depends on `695a6b0`'s `ContactCta`), and the W119/W122 visibility-test extension (`18cf4c9`, depends on every block existing). W84 (`Timeline.body` optional) and the `ContactCta`/`Cta`/`EmptyStateCta` halves of W82, plus W83 (`FaqBlock.askCard` email row), were folded directly into the cycle that authors that file for the first time (Cycles 2, 5, 7) rather than given their own follow-up edit — see "What was implemented" and "Deviations".

## What was implemented

- **Cycle 1 (`fe41add`).** `src/lib/format/date.ts` (`formatDate`, `formatMonth`, `formatReadMinutes` — UTC calendar dates, `en-GB` day-first, ICU plural through `createTranslator`). `sys.nav.breadcrumbs` added **after** `legal`, keeping the Task 3 `home` leaf (`sys.nav` is now `{ main, close, home, legal, breadcrumbs }`, W80); new top-level `sys.blocks.readMinutes` inserted after `whatsapp`, before `languageHint` — both message files.
- **Cycle 2 (`6851886`).** `Section` (tones `light|dark|pale|band`), `Stat` (`text` wins over `value`, no count-up when `text`, `tone` swaps label colour, `null` when neither), `Timeline` (`horizontal` variant, **W84**: `body` now optional, no `<p>` when absent — folded in here since this file is authored fresh in this cycle). `index.ts`: `Section` line gains `type SectionTone`.
- **Cycle 3 (`5be4619`).** `Tabs.onChange` (fired on click and on every arrow/Home/End reselection). New `RadioChips` (`role="radiogroup"` of native radios, `legendHidden`). `Button`: `ButtonVariant` gains `'inverse'` (translucent white outline for navy/gradient bands) — only the type + `VARIANT` map touched, Task 3's `SIZE`/`BASE`/`buttonClassName`/`Button` region below it untouched. `index.ts`: `RadioChips` line inserted alphabetically between `PausableMarquee` and `Section`.
- **Cycle 4 (`56e1f27`).** `StickyCtaBar` whole file: `STICKY_CTA_HEIGHT_VAR`, `isBarVisible(scrollY, showAfterPx, targetTop, viewportHeight)`, `hideNearId`, `live`; publishes its rendered height on `<html>` while visible via `useSyncExternalStore` + a `ResizeObserver`, `'0px'` otherwise/on unmount. `LanguageHint.tsx`: additive edit to the sheet's `className` only (`+var(--sticky-cta-h,0px)` on both the mobile and `lg:` bottom offsets) — landed on the Task 4 as-built file (hreflang/`use-alternate-path` logic, the `role="region"` element itself, and `LanguageHint.test.tsx`'s existing describes all untouched). `WhatsAppFab.tsx`: `bottom-[18px]` → `bottom-[calc(18px+var(--sticky-cta-h,0px))]` plus the docblock sentence — this is Task 3's `ContactLink` version of the file, as the brief expected. New `src/test/bundle.ts` (`testBundle`, `BLOCK_STRINGS`).
- **Cycle 5 (`695a6b0`).** `icons.tsx`: `CheckIcon`/`ClockIcon` appended after `LinkedInIcon`. New `src/design/blocks/`: `ContactCta` (contact href → `ContactLink` in the `Button` face via `buttonClassName`; other string href → `Button`; **W82** folded in from the start — an object href renders through next-intl's typed `Link` instead, since I was authoring this file for the first time), `FaqBlock` (+`FAQPage` JSON-LD; **W83** folded in — `askCard` already ships `email`/`emailLabelId`/`subject` for a third mailto row), `Breadcrumbs` (+`BreadcrumbList` JSON-LD, last crumb text-only with `aria-current="page"`), `ClosingCtaBand` (`Cta.href` also **W82**-typed from the start).
- **Cycle 6 (`847c84f`).** `ProcessSteps` (numbered gradient-dot rail, `cards`/`plain`, last step green), `MetricStrip` (over the `metrics` collection, unsigned skipped per W1, `unitId` joins the suffix), `OfficeCard` (over the `offices` collection, every text field the row's own package id per W34, three `ContactLink` rows placement `office_card`).
- **Cycle 7 (`27e4398`).** `ImageSlot` (`next/image` with `src`; else a named `data-placeholder`/`data-lcp-slot` gradient box, decorative when `alt=''`). `EmptyState` (`role="status"`, `ContactCta` for the optional door; **W82** folded in — `EmptyStateCta.href` is `string | Exclude<Href, string>` from the start). `PostCard` (over Task 1's `BlogPost`, `null` for an unwritten locale per W33, alt-language pill, `ImageSlot` cover `blog-cover-<key>`).
- **Cycle 8 (`0c9487c`).** `NewsletterBand` (`null` while `active=false`, W5), `StoreBadges` (Android only today, W8), `LogoMarquee` (`null` when `logos=[]`, W6), and the blocks barrel `index.ts` re-exporting Task 1's row types.
- **Cycle 9 (`d5a4eea`).** New `dev/gallery/RadioChipsDemo.tsx` and `Wp2Blocks.tsx` (every new primitive tone/variant and every shared block, fed from the real bundle via `makeTf`); `page.tsx`: one import, `<Wp2Blocks bundle={bundle} locale={locale} />` inserted immediately before the Chrome block, `hideNearId="gallery-end"` + `live` added to the page's `<StickyCtaBar>`, and the pre-existing `t('home.024')` (a re-authored `{metric}` string) fixed to `tf('home.024')` through a new `makeTf` call (Task 1 review minor, named in the additions). Docs: `ARCHITECTURE.md` § Design system paragraph replaced (14 primitives, the blocks catalogue) and § Chrome's `StickyCtaBar` paragraph replaced (W18 resolution); `CONTENT-MODEL.md` § `sys.*` range (`nav.breadcrumbs`, new Blocks bullet), § Chrome canonical ids (+7 rows, +1 sentence), § Adding copy (+1 sentence); `SEO.md` § JSON-LD (`breadcrumbJsonLd`/`faqJsonLd` now "called by"); `ANALYTICS.md` event-schema "Fires on" cells + the "WP1 wired" paragraph's `page_cta`/`office_card` clause; `PRD.md` § 11 Design system bullet ("13" → "14 … and the shared page blocks").
- **W78 (`5d437c5`).** New `src/forms/options.ts` (`START_WHEN_KEYS`, `StartWhenKey`). `sys.form.options.startWhen.{asap,month1,months1to3,planning}` added to both message files, inserted after `labels` (anchored on `estimateSummary`, the last `labels` field) and before `placeholders` — no anchor sentence was specified beyond "in both message files", so I picked the position next to the field (`labels.startWhen`) the option set serves.
- **W81 + the `StickyCta` half of W82 (`a996170`).** `StickyCtaBar`'s per-cta render now goes through `ContactCta` (placement `page_cta`) instead of a raw `Button` — a `tel:`/`wa.me`/`mailto:` href fires its event through `ContactLink` exactly like every other block CTA, any other href (including an object `Href`) stays the `Button` face; the wrapper carries `data-testid="sticky-cta"`. `StickyCta.href` is now `string | Exclude<Href, string>`. `docs/ARCHITECTURE.md`'s `StickyCtaBar` paragraph (already rewritten in Cycle 9) gained one more sentence for this.
- **W122 visibility-test extension (`18cf4c9`).** `visibility.test.tsx`'s `DISPLAY_UTILITIES` gained `inline-table|flow-root|list-item|table-row|table-cell`; a new describe renders every shared block (every tone/variant branch) and sweeps the combined DOM with the same `hasUnguardedHidden` checker the `SiteChrome` sweep already uses. See "Deviations" for why this is a render sweep, not the static class-literal scan the addition offered as the alternative.

## TDD evidence per cycle

Every cycle below: failing test written → run → red for the stated reason → implement → run → green → `VERIFY_LOW` → commit. VERIFY_LOW = `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`.

1. **`date.test.ts`.** RED: `Error: Failed to resolve import "./date"` (module didn't exist). GREEN: `date.test.ts` 8/8, `messages.test.ts`/`voice.test.ts` unaffected. VERIFY_LOW: 59 files / 388 tests, green.
2. **`Section`/`Stat`/`Timeline` tests.** RED: 9 failures (`pale`/`band` still rendered `bg-white`/`py-16`; `text`/`prefix`/`tone` unknown props, container not empty, no `text-white/55`; no `data-variant` attribute on either variant; a body-less step still rendered a `<p>`). GREEN: `src/design/primitives` 8 files / 22 tests. VERIFY_LOW: 62 / 400.
3. **`Tabs`/`RadioChips` tests.** RED: `onChange` never called (1 failure); `Failed to resolve import "../RadioChips"`. GREEN: `src/design/primitives` 10 files / 28 tests. VERIFY_LOW: 64 / 406.
4. **`StickyCtaBar`/`WhatsAppFab`/`LanguageHint` tests.** RED: `isBarVisible`/`STICKY_CTA_HEIGHT_VAR` undefined (5 failures inside that suite); `WhatsAppFab`/`LanguageHint`'s new stacking assertions failed against the pre-W18 class strings (`bottom-[18px]` / `bottom-4` had no `var(--sticky-cta-h,0px)`). 7 failed / 5 passed across the three files. GREEN: `src/design/chrome src/analytics` 17 files / 81 tests. VERIFY_LOW: 66 / 413.
5. **`ContactCta`/`FaqBlock`/`Breadcrumbs`/`ClosingCtaBand` tests.** RED: all four failed to resolve their imports (`src/design/blocks/` didn't exist yet). GREEN (first pass, no follow-up needed): `src/design/blocks src/design/chrome src/analytics` 21 files / 92 tests. One typecheck-only failure surfaced and was fixed **before** the green run: `ContactCta.test.tsx`'s W82 case (`{ pathname: '/hire-workers', hash: '#request-form' }`) didn't type-check against `@/lib/seo/routes`'s `Href` (`hash` isn't part of `getPathname`'s narrower object type in next-intl 4.14.5 — only `Link`'s own prop type widens the object branch to `Omit<UrlObject,'pathname'>`, which does carry `hash`); switched `ContactCta`/`ClosingCtaBand`'s `Href` import to `@/i18n/navigation` (see Deviations). VERIFY_LOW: 70 / 424.
6. **`ProcessSteps`/`MetricStrip`/`OfficeCard` tests.** RED: three import-resolution failures. GREEN (first pass): `src/design/blocks` 7 files / 18 tests. VERIFY_LOW: 73 / 431.
7. **`ImageSlot`/`EmptyState`/`PostCard` tests.** RED: three import-resolution failures. GREEN (first pass): `src/design/blocks` 10 files / 28 tests; one Prettier line-length fix (`EmptyState.tsx`'s type line) applied with `--write` before the format gate passed. VERIFY_LOW: 76 / 441.
8. **`NewsletterBand`/`StoreBadges`/`LogoMarquee` tests.** RED: three import-resolution failures. GREEN (first pass): `src/design/blocks` 13 files / 34 tests. VERIFY_LOW: 79 / 447.
9. **Gallery + docs.** RED (genuinely reproduced, not just asserted): temporarily renamed `Wp2Blocks.tsx` away and re-ran `npm run typecheck` → `error TS2307: Cannot find module './Wp2Blocks'` at `page.tsx(35,27)`, exactly the brief's predicted red step; restored the file and typecheck passed. No unit test (dev-only route, per the brief). VERIFY_LOW: 79 / 447 (unchanged — the gallery carries no unit test).
10. **`options.test.ts` (W78).** RED: `Failed to resolve import "./options"`. GREEN: `src/forms/options.test.ts` + `messages.test.ts` + `voice.test.ts` → 3 files / 10 tests (the voice test confirms none of the four new EN/TR labels trips the first-person-plural checker). VERIFY_LOW: 80 / 449.
11. **`StickyCtaBar` W81/W82 cases.** RED: 3 failures — `data-testid="sticky-cta"` not found; the `tel:` CTA pushed nothing to `dataLayer`; the object-href case threw `TypeError: href.startsWith is not a function` inside `Button` (a plain `Button` cannot take an object href). GREEN: `StickyCtaBar.test.tsx` 9/9. VERIFY_LOW: 80 / 453.
12. **`visibility.test.tsx` extension.** First attempt (a static regex scan of every quoted/backtick string literal under `src/design/`) produced a real false positive — `Footer.tsx`'s prose comment "the asset's own" (bare apostrophe) desynchronised the naive quote-pairing and merged ~30 unrelated lines of source into one fake "literal" that happened to contain both `hidden` and a display-utility word. Abandoned in favour of the addition's other offered option (render the blocks). RED/GREEN for the real approach: wrote the render sweep, ran it once and it was already green (the codebase had no latent violation), so I planted a deliberate one (`<span className="hidden flex">`) to prove the guard actually fails on a real violation — confirmed 1 failure with the expected `['hidden flex']` diff — then reverted and reran to confirm green again. GREEN: `visibility.test.tsx` 5/5. VERIFY_LOW: 80 / 454.

## Files changed

`git diff --shortstat 6a9689c..HEAD` → **62 files changed, 3246 insertions(+), 97 deletions(-)**. Every file the brief's Files list names was created or modified; nothing outside it, plus the files the `task-5-additions.md` rulings and the W82 `Href`-source deviation required (`src/forms/options.ts`/`.test.ts`, no other additions files were new).

- **Created (34):** `src/lib/format/date.ts`/`.test.ts`; `src/design/primitives/RadioChips.tsx` + 5 new `__tests__/*.test.tsx` (`Section`, `Stat`, `Timeline`, `Tabs`, `RadioChips`); `src/design/chrome/__tests__/StickyCtaBar.test.tsx`, `WhatsAppFab.test.tsx`; `src/test/bundle.ts`; `src/design/blocks/` — 13 component files + `index.ts` + 13 test files (27 files); `src/app/[locale]/(site)/dev/gallery/Wp2Blocks.tsx`, `RadioChipsDemo.tsx`; `src/forms/options.ts`/`.test.ts` (addition, not in the brief's original Files list).
- **Modified (28):** `src/messages/en.json`/`tr.json`; `src/design/primitives/Section.tsx`, `Stat.tsx`, `Timeline.tsx`, `Tabs.tsx`, `Button.tsx`, `index.ts`; `src/design/chrome/StickyCtaBar.tsx`, `LanguageHint.tsx`, `WhatsAppFab.tsx`, `icons.tsx`, `__tests__/LanguageHint.test.tsx`, `__tests__/visibility.test.tsx` (addition); `src/app/[locale]/(site)/dev/gallery/page.tsx`; `docs/ARCHITECTURE.md`, `CONTENT-MODEL.md`, `SEO.md`, `ANALYTICS.md`, `PRD.md`.
- Nothing from `docs/superpowers/handoff-2026-09-25/**`, the rulings file, or `WEBSITE-HANDOFF.md` was touched.

## Deviations

1. **`ContactCta.href` / `Cta.href` / `EmptyStateCta.href` / `StickyCta.href` import `Href` from `@/i18n/navigation`, not `@/lib/seo/routes`.** W82's own worked example (`{ pathname: '/hire-workers', hash: '#request-form' }`) doesn't type-check against `@/lib/seo/routes`'s `Href = Parameters<typeof getPathname>[0]['href']`: in next-intl 4.14.5, with `pathnames` configured, `getPathname`'s href param's object branch is typed `{ pathname; params? } & { query?: QueryParams }` — no `hash`. `Link`'s own prop type (what `@/i18n/navigation`'s `Href = React.ComponentProps<typeof Link>['href']` extracts) widens the *same* object branch to `Omit<import('url').UrlObject, 'pathname'>`, which does carry `hash` — confirmed against the installed `.d.ts` and against the pre-existing precedent `src/design/chrome/ctas.ts` (`CTA_BY_PATHNAME`'s `href: { pathname: '/hire-workers', hash: '#request-form' }`, typed `Href` from `@/i18n/navigation`, already on `main`). Since none of these four props ever calls `absoluteUrl`/`getPathname` on the href themselves — only `Breadcrumbs.Crumb.href` does that, and it correctly keeps the `@/lib/seo/routes` `Href` per the brief's own reasoning — importing the `Link`-shaped `Href` is the correct, working choice, not a workaround.
2. **`docs/ARCHITECTURE.md`'s "Repository layout" bullet** ("13 design-system primitives") was also updated to "14 … and `src/design/blocks/*`", though the brief's "Docs in this task" list only names the § Design system and § Chrome paragraphs. Left uncorrected it would immediately contradict the § Design system paragraph two sections below it (which the brief does require updating to "14"); the fix is a one-clause, low-risk factual correction, not a new decision.
3. **Additions folded into a cycle's first draft vs. given a standalone commit.** W84 (`Timeline.body` optional) and the `Cta`/`ContactCta`/`EmptyStateCta` thirds of W82, plus W83 (`FaqBlock.askCard` email row), were written directly into Cycles 2, 5 and 7 rather than added as separate follow-up commits, because those files were being authored from nothing in that same cycle — writing them once correctly, with the addition's test case included in the same red/green step, avoids editing a file twice for no TDD benefit. W78 and W81+the `StickyCta` third of W82 got their own commits because neither touches a file introduced in a numbered cycle without also needing something from a *later* one (`ContactCta`, built in Cycle 5) or nothing else in the brief at all (`options.ts`). The additions doc's "each is a small extra cycle" is satisfied by cycle *count and shape* (a self-contained red→green→commit unit each), not by a rule that every addition must be its own commit regardless of where its file already lives.
4. **W78's `sys.form.options.startWhen.*` anchor position.** The addition names the key path and the two locales' six label strings but not a sentence to anchor the insertion on. I placed the new `"options": { "startWhen": {...} }` object immediately after `"labels"` (anchored on `estimateSummary`, `labels`' last field) and before `"placeholders"`, since `startWhen` is itself a `labels` field name — the most natural adjacency, not a guess against a specified anchor.
5. **W122's guard is a render sweep, not the static class-literal scan.** The addition offers either "(render them, or add a static class-literal scan over `src/design/`)". A naive quote-matching regex scan was tried first and produced a genuine false positive: this codebase's JSDoc/line comments use bare apostrophes freely for possessives/contractions ("the asset's own", similarly elsewhere), which desynchronises a regex with no concept of comments vs. string literals, merging unrelated source spans into one fake "literal". A correct version would need a real TS/JS tokenizer (out of proportion for a lint-style guard test). The render sweep has no such failure mode, reuses the exact `hasUnguardedHidden` checker the existing `SiteChrome` sweep already trusts, and was verified to actually catch a planted violation (see TDD evidence, Cycle 12).
6. **No e2e/Playwright run.** The brief's Cycle 9 verification step is `npm run typecheck` plus a manual `npm run dev` browser check (scrolling the gallery, resizing around 901/1100px) — not a Playwright spec, and no cycle in this task asks for one. Per the owner's MEMORY RULE ("If the brief needs no e2e, run none — the reviewer runs the build"), no build/dev server/Playwright was started. Every package id `Wp2Blocks.tsx` reads (`home.024/050/052/104–118/180/181/184/185/187/192/202/221/294–305`, `hire.019/032/041/197/198/240/241/249/252`) and every collection used (`offices`, `blog`, `metrics`) were instead checked against the real generated `src/content/local/bundle.tr.json` by script (all present, none missing) — see Concerns.

No other deviation from the brief's own "Produces — deviations" section was needed beyond what it already predicted (item confirmed against the code in Self-review below).

## Produces additions

None beyond what `task-5-additions.md` itself specifies (W78/W81–W84) and what the brief's own "Produces — deviations" section already predicted (makeTf everywhere, `ContactCta`'s shape, `OfficeCard`'s own-id rendering, `PostCard`'s `coverSrc`, `sys.blocks.readMinutes`, `Stat.tone`, `StickyCtaBar`'s `live`/`isBarVisible`/`STICKY_CTA_HEIGHT_VAR`, `Button.inverse`, `RadioChips.legendHidden`/`className`, the blocks barrel's re-exported row types, `src/test/bundle.ts`). Every export in the frozen "Produces" block is present with the brief's name and signature; the only signature widening beyond the brief's own text is the `href` type on `ContactCta`/`Cta`/`EmptyStateCta`/`StickyCta` per W82 (Deviation 1 above), which is additive (every existing string-href caller still compiles unchanged).

## Self-review

Re-read the "Produces" block and the additions against the committed files:

- [x] `formatDate`/`formatMonth`/`formatReadMinutes` — signatures and locale strings match; UTC-anchored; `formatReadMinutes` never renders 0.
- [x] `sys.nav.breadcrumbs`, `sys.blocks.readMinutes` — both files, key parity green (`messages.test.ts`); `sys.nav` keeps `home` (W80).
- [x] `Section` (tones), `Stat` (`text`/`prefix`/`tone`), `Timeline` (`horizontal`, **+ W84 optional `body`**), `Tabs.onChange`, `RadioChips`, `Button.inverse` — all present; barrel keeps `buttonClassName` (Task 3's `HeaderCtas` import untouched, confirmed by `npm run typecheck`).
- [x] `StickyCtaBar`: `STICKY_CTA_HEIGHT_VAR`, `isBarVisible`, `hideNearId`, `live`; **+ W81** CTAs through `ContactCta`; **+ W82** `StickyCta.href` object-capable; `data-testid="sticky-cta"`.
- [x] `ContactCta`/`PageContactPlacement` — contact-href → `ContactLink`, other → `Button`, **+ W82** object → `Link`.
- [x] `FaqBlock`/`FaqItem`/`FaqAskCard` — two-column + `Accordion` + `FAQPage` JSON-LD; **+ W83** optional `email`/`emailLabelId`/`subject` row.
- [x] `Breadcrumbs`/`Crumb` — last crumb text + `aria-current`, `BreadcrumbList` JSON-LD, uses the `@/lib/seo/routes` `Href` (unlike the other four — see Deviation 1).
- [x] `ClosingCtaBand`/`Cta` — dark card, `ContactCta` for every button, `ticks` `md:hidden`.
- [x] `ProcessSteps`/`ProcessStep` — `cards`/`plain`, last-step `data-last`, decorative numbered dots.
- [x] `MetricStrip` — unsigned skipped (W1), `unitId` joins suffix, `null` when nothing signed.
- [x] `OfficeCard` — row's own `labelId`/`addressLine2Id`/`hoursId` (W34), three `ContactLink` rows, directions link.
- [x] `ImageSlot`/`ImageSlotProps` — named placeholder always (W55), `data-lcp-slot` on both branches.
- [x] `EmptyState`/`EmptyStateCta` — `role="status"`, tone-aware CTA face, **+ W82** object href.
- [x] `PostCard` — `null` for an unwritten locale (W33), alt-language pill, `ImageSlot` cover.
- [x] `NewsletterBand` — `null` while inactive (W5).
- [x] `StoreBadges` — Android only today (W8), `null` with neither link.
- [x] `LogoMarquee`/`Logo` — `null` when empty (W6).
- [x] Blocks barrel re-exports `BlogPost`/`Metric`/`MetricKey`/`Office` from `@/content/collections`, not redefined.
- [x] `src/test/bundle.ts` — `testBundle`/`BLOCK_STRINGS` as specified.
- [x] W78 — `START_WHEN_KEYS`/`StartWhenKey`, `sys.form.options.startWhen.*` both files, parity test.
- [x] Rules: every block/`ContactCta`/`StickyCtaBar` composes `buttonClassName(variant, size, className)` with no caller class colliding on `hidden`+display or on a same-property base-class token (W119/W122) — the extended `visibility.test.tsx` sweep is green over all of them. No `design-package/**`/`src/content/local/*` import from `src/**` (`npm run lint`'s `no-restricted-imports` rule stayed green throughout). No block carries `'use client'` (W13) — confirmed by `grep -rL "'use client'" src/design/blocks/*.tsx` returning every file. Every id-taking block resolves through `makeTf(bundle, locale)`, never `makeT`. No controller-owned file touched. No push, no stash, no rewrite of a BASE commit.

## Concerns

1. **The gallery's package-id wiring (Cycle 9) is unverified by a running dev server.** Per the MEMORY RULE, I did not start `npm run dev`/a browser. I instead checked every id and collection `Wp2Blocks.tsx` reads against the real `src/content/local/bundle.tr.json` with a script (all present; `home.024`/`home.107` confirmed to carry the `{homepageReplyHours}` placeholder the `makeTf` fix targets) and relied on `npm run typecheck` for structural correctness. The reviewer's own `npm run dev` pass (already part of the repo's "before declaring a task done" checklist) is the first actual render of this page.
2. **`npm run gate`** (Playwright + axe + Lighthouse against a preview URL) is out of scope for an implementer per the MEMORY RULE and was not run; the website `CLAUDE.md` checklist assigns it to a later, once-per-work-package step, not to this task.
3. **W78's exact JSON anchor** (Deviation 4) is a reasonable placement, not a specified one — if a later task expected `sys.form.options.startWhen` at a different position in the file, the key still resolves correctly either way (JSON object order is not semantically load-bearing here), but the diff will look different from whatever that task's brief assumed.

## Process check

```
ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium' | grep -v grep
```

returned only an unrelated pre-existing system process (`ChromeRemoteDesktopHost`), no `vitest`/`next`/`playwright`/`chromium` process of mine.

## Fix round 1

**Status: DONE_WITH_CONCERNS.** 8 commits on `wp2/foundation` (BASE `4944f40` → HEAD `c7b4a6f`), one per item, with 7+8 sharing the docs commit. The low-memory verify (`typecheck && lint && format && vitest --maxWorkers=1`) was green before every commit. Final suite: **81 files / 468 tests** (BASE 80 / 454). The one W126 `npm run build` **succeeded**. Nothing pushed, no stash, no BASE commit rewritten, and the working tree is clean. No process of mine is left running.

| # | SHA | Subject | Verify (files / tests) |
|---|---|---|---|
| 1 | `2c6c719` | fix(analytics): contactKindOf lives in the pure contact-kind.ts; ContactCta imports it (W125, C1) | 81 / 456 |
| 2 | `8c1af15` | fix(blocks): Button gains the success variant; FaqBlock's ask card passes no colour classes (W127, I1) | 81 / 458 |
| 3 | `9f737af` | fix(blocks): ImageSlot owns its box on both branches; PostCard's row cover is a 104 px wrapper (W129, I2 + M4) | 81 / 463 |
| 4 | `99cfbf3` | fix(blocks): ImageSlot maps its frozen priority/lcp props to next/image `preload` (W129, M3) | 81 / 464 |
| 5 | `cae6bbc` | fix(blocks): PostCard byline is text-tertiary, not muted (W128a, I3) | 81 / 464 |
| 6 | `df935e3` | fix(blocks): ClosingCtaBand green tone uses full-white copy and the new inverse-dark face (W128b, I4) | 81 / 468 |
| 7+8 | `c8c2b41` | docs: W78 option vocabulary, StickyCtaBar page_cta, blocks sweep, W127/W128 D20 deltas, W126 gotcha (M1, M2) | 81 / 468 |
| 9 | `c7b4a6f` | test(design): the W122 render sweep also covers the scrolled StickyCtaBar, gradient band, pale EmptyState and ImageSlot's photo (M5) | 81 / 468 |

Each verify line was `Test Files 81 passed (81)` / `Tests N passed (N)`, exit 0. The only stderr line is Node 25's pre-existing `--localstorage-file` warning.

### Per item

**1 — C1 / W125 (`2c6c719`).**
- **Change.**
  - New `src/analytics/contact-kind.ts`: `CONTACT_PLACEMENTS` :11, `ContactPlacement`, `ContactKind`, `contactKindOf` :18. Its only import is `PARAM_ENUMS` from `./track` :1. `track.ts` has no imports at all and touches `window` only inside `track()`, so it is RSC-safe.
  - `src/analytics/useContactClick.ts` re-exports all four (:10–15), keeps `useContactClick`, and imports the two types for its own use (:4). Task 3's API is unchanged; its test still imports `CONTACT_PLACEMENTS`/`contactKindOf` from `./useContactClick`.
  - `src/design/blocks/ContactCta.tsx:3` imports from `@/analytics/contact-kind`, and its docblock says why (:32–34).
  - A final grep shows no other server module under `src/` imports the hook module; the only importer is `ContactLink.tsx` (`'use client'`).
- **Test.** New `src/design/blocks/__tests__/rsc-imports.test.ts`, which parses with the TypeScript compiler API rather than matching text.
  - `ContactCta.tsx`'s own docblock contains the words `'use client'` and `next/navigation`, so a substring check would misclassify it. A real directive is detected as the first statement, and specifiers come from `ts.preProcessFile`, which is comment-aware and covers static, dynamic, re-export and type-only imports.
  - The walked set is every non-test module under `src/design/blocks/` plus every non-`'use client'` module under `src/design/`.
  - A machinery self-check asserts that `ContactCta` is in the set and is not a client module, that `StickyCtaBar` is one, and that the `@/`-aliased and relative spellings of the hook module are both caught.
  - **RED:** `AssertionError: expected [ Array(1) ] to deeply equal []`, the one entry being `"src/design/blocks/ContactCta.tsx → @/analytics/useContactClick"`; the self-check passed. **GREEN:** 2/2, and `src/analytics` + `ContactCta.test.tsx` gave 5 files / 27 tests.
- **Docs.** ARCHITECTURE § Chrome "Contact clicks (W12)" (:293) gains one sentence naming `src/analytics/contact-kind.ts` as the pure classifier that server components import (W125) and pointing at the guard.

**2 — I1 / W127 (`8c1af15`).**
- **Change.**
  - `src/design/primitives/Button.tsx`: `ButtonVariant` gains `'success'`, and `VARIANT.success` (:20) = `border border-success-border bg-white text-success-text hover:bg-success-surface`. Every existing variant string is byte-identical.
  - `src/design/blocks/FaqBlock.tsx`: the WhatsApp row is `variant="success"` (:85); the call (:94) and e-mail (:103) rows are plain `secondary`. None of them passes a `className`, and the `FaqAskCard` docblock records the rule.
- **Tests.**
  - `Button.test.tsx:36` checks the `success` classes and that the class string equals `buttonClassName('success')`.
  - `FaqBlock.test.tsx:104` checks that each ask-card anchor's class string equals `buttonClassName(<its variant>)` exactly (nothing appended), that no anchor has `text-blue-safe`, that call/e-mail have neither success class, and that the WhatsApp row carries them.
  - **RED:** Button said "Expected the element to have class" (the variant was undefined). FaqBlock said the WhatsApp row was `… border border-border-1 bg-white text-ink hover:border-tint-border hover:bg-pale-1 min-h-[44px] px-5 text-body-sm border-success-border text-success-text hover:bg-success-surface`, i.e. `secondary` plus the appended collision. **GREEN:** 2 files / 8 tests.

**3 — I2 + M4 / W129 (`9f737af`).**
- **Change in `src/design/blocks/ImageSlot.tsx`.**
  - Both branches carry `BOX = 'w-full h-auto object-cover'` (:25) and `style={{ aspectRatio: 'w / h' }}` (:47, :57, :71). The `<Image>` branch keeps `width`/`height` from the props and `sizes` as before.
  - `ImageSlotProps.className` (frozen) is documented as never carrying `w-*`/`aspect-*`: a caller wraps the slot instead.
- **Change in `src/design/blocks/PostCard.tsx`.**
  - The row cover is `<div className="w-[104px] shrink-0">{cover}</div>` (:71), and the text column keeps `flex min-w-0 flex-1 flex-col` (:72).
  - `COVER` lost its `className`, and ImageSlot gets only `rounded-xs` (:61), because `object-cover` is now the slot's own class and repeating it would be a same-property append.
- **Tests.**
  - `ImageSlot.test.tsx:58`: the placeholder and the photo both carry `w-full h-auto object-cover rounded-xs` and `aspect-ratio: 640 / 202`, and the `<img>` has width 640 / height 202.
  - `PostCard.test.tsx:117`: the row wrapper has `w-[104px] shrink-0`, the ImageSlot inside has `w-full` and neither `w-[104px]` nor `shrink-0`, and the heading's column has `min-w-0 flex-1`.
  - `PostCard.test.tsx:133` (`it.each` card/row/featured, placeholder and photo): no `w-*`/`min-w-*`/`max-w-*`/`size-*`/`aspect-*` class other than `w-full` reaches ImageSlot.
  - **RED:** ImageSlot said "Expected the element to have class" (box missing on the image, `h-auto object-cover` missing on the placeholder); the PostCard row wrapper assert failed; and `expected [ 'w-[104px]' ] to deeply equal []`. **GREEN:** 2 files / 12 tests.

**4 — M3 / W129 (`99cfbf3`).**
- **Change.** `ImageSlot.tsx:56` passes `preload={priority ?? lcp}` instead of `priority`. The frozen props are kept, and the `lcp`/`priority` docblocks were updated. `preload?: boolean` exists in 16.3.5 (`get-img-props.d.ts:23`; `priority` is `@deprecated Use preload` at :24–28).
- **What jsdom shows.** I probed it once and deleted the probe. In 16.3.5, `preload` and `priority` render identically: the `<img>` has no `loading` attribute and React hoists `<link rel="preload" as="image" imagesrcset=…>` into `<head>`. A plain image gets `loading="lazy"` and no link. `fetchpriority` is emitted only when the caller passes `fetchPriority`.
- **Test (`ImageSlot.test.tsx:83`).**
  - The behavioural assertions check exactly that output for the lcp and priority slots, against a lazy control.
  - Because the behaviour is identical, a behavioural test cannot go red. RED therefore comes from a pass-through `vi.mock('next/image')` spy: the real component still renders, and the spy records the props it received.
  - **RED:** `expected [ { preload: undefined, …(1) }, …(2) ] to deeply equal [ { preload: true, …(1) }, …(2) ]`. **GREEN:** 2 files / 13 tests.

**5 — I3 / W128(a) (`cae6bbc`).**
- **Change.** `PostCard.tsx:92`: the byline is `text-text-tertiary` (was `text-muted`).
- **Test.** The first PostCard test gained two assertions: the byline row has `text-text-tertiary` and not `text-muted`. **RED:** "Expected the element to have class: text-text-tertiary". **GREEN:** 8/8.

**6 — I4 / W128(b) (`df935e3`).**
- **Change.**
  - `Button.tsx`: `'inverse-dark'` is added to the union, and `VARIANT['inverse-dark']` (:23) = `border border-white/40 bg-black/15 text-white hover:bg-black/25`.
  - `ClosingCtaBand.tsx`: `TONE` (:22) now carries `surface`/`body`/`ticks`/`face` per tone. Green uses `text-white` for the body and ticks and `inverse-dark` as the face; navy and gradient keep `text-white/70`, `text-white/75` and `inverse`. The body is at :97, the ticks at :100, and the secondary/extra fallback face at :113–114. `tone?: keyof typeof TONE` is unchanged.
  - Gallery `Wp2Blocks.tsx`: the green band gains `bodyId="home.185"`, a WhatsApp secondary and two ticks (:276–284).
- **Tests.**
  - `ClosingCtaBand.test.tsx:80` (green): the body and ticks are `text-white` and not `/70` or `/75`, secondary and extra equal `buttonClassName('inverse-dark')`, and primary equals `buttonClassName('primary')`.
  - `:99` `it.each` navy/gradient: `inverse` and the softened copy.
  - `Button.test.tsx:53` checks the `inverse-dark` classes.
  - **RED:** green failed at the body's `toHaveClass('text-white')`, because it had `text-white/70`; Button had no inverse-dark classes. Navy/gradient passed at RED, as a characterisation of unchanged behaviour. **GREEN:** 2 files / 10 tests.
- **Docs.** In commits 2 and 6, ARCHITECTURE § Design system's variant list (:270) became `primary|secondary|ghost|danger|inverse|inverse-dark|success`. See deviations.

**7 — M1 / W78 docs (`c8c2b41`).**
- `docs/CONTENT-MODEL.md:49` (§ `sys.*` range, Forms bullet) gains `form.options.<field>.<key>` for a field's closed option set: today `startWhen.{asap,month1,months1to3,planning}`, whose keys are `START_WHEN_KEYS` in `src/forms/options.ts`.
- `docs/ARCHITECTURE.md` § Forms flow (:205) gains one sentence: `START_WHEN_KEYS` is the one `startWhen` vocabulary every form shares (W78).

**8 — M2 docs (`c8c2b41`).**
- `docs/ANALYTICS.md`: the "Fires on" cells for `call_click`/`whatsapp_click`/`email_click` (:58–60) and the "WP1 wired" paragraph (:73) add `StickyCtaBar` as a `page_cta` source (W81). Prettier re-padded the table.
- `docs/ARCHITECTURE.md:285`: `visibility.test.tsx` "guards the chrome and the blocks".
- The D20 named-deltas list (§ Quality gate, :257ff) gains two bullets:
  - "Block colours (W128)" (:265): the byline is `text-tertiary`; the green band has full-white copy and `inverse-dark`, while navy and gradient keep `inverse`.
  - "`FaqBlock`'s ask card (W127)" (:266).
- The list's intro sentence notes that the last two came from the Task 5 review.
- The W126 gotcha sentence ("one compile error in a shared module … 500s every route of a `next dev` session … until the dev server is restarted", plus why every task ends with a build) is in ARCHITECTURE § Run locally (:102), anchored after "…`CONTENT_SOURCE=LOCAL` needs nothing else running."

**9 — M5 (`c7b4a6f`).**
- **Change.** `src/design/chrome/__tests__/visibility.test.tsx`'s blocks sweep now also renders:
  - `StickyCtaBar` with `window.scrollY` set to 800 before render (a fresh client render reads it immediately) and reset afterwards; it has a `Button` CTA, a `tel:` CTA through `ContactLink`, and `live`.
  - `ClosingCtaBand tone="gradient"` with body, extra and ticks.
  - `EmptyState tone="pale"` with a CTA.
  - `ImageSlot` with a `src`.
  - The green band gains body, tick and secondary, so `inverse-dark` is swept too.
- **Coverage asserts.** The test now asserts those branches are in the swept DOM: `[data-testid="sticky-cta"]`, a `from-ink` element, `[role="status"].bg-pale-1`, `img[alt="Foto"]`, and a `bg-black/15` element. The display list is unchanged.
- **RED** (the coverage asserts written first): `AssertionError: expected null not to be null`, because there was no sticky bar. **GREEN:** 5/5.

### Build (W126) and the four curls

- **Build.** `NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0: "✓ Compiled successfully", TypeScript finished, and 13/13 static pages were generated, including `/tr/dev/gallery` and `/en/dev/gallery`, whose module graph is the one that failed at BASE. The build appended nothing to `CLAUDE.md`.
- **`npm run start`** (killed right after): `/dev/gallery` **404**, `/en/dev/gallery` **404**, `/` **200**, `/en` **200**, with no errors in the log.
  - The two 404s are the gallery's own production guard (R41, `src/app/[locale]/(site)/dev/gallery/page.tsx:59`: `if (process.env.NODE_ENV === 'production') notFound();`), and `next start` always runs as production.
  - So "200 under `start`" cannot be met by design. The reviewer's "both galleries render (200)" was a `next dev` check.
- **One sequential `next dev` pass**, as the closest faithful check (killed right after): `/dev/gallery` **200**, `/en/dev/gallery` **200**, `/` **200**, `/en` **200**, and zero error/warn lines in the dev log. That pass appended the `nextjs-agent-rules` block to `CLAUDE.md`; the diff was exactly that block, and I reverted it with `git restore CLAUDE.md`, so the tree is clean. No Playwright was run.

### Deviations

1. **The gallery curls under `next start` return 404 by design (R41), not 200.** The four 200s come from one `next dev` pass instead (see above). This was one heavy job at a time: the start server was stopped before dev started.
2. **The aspect ratio is an inline `aspect-ratio: w / h` style, not an `aspect-[w/h]` class**, on both ImageSlot branches. Tailwind 4 generates only the classes it finds whole in the source, so an `aspect-[${w}/${h}]` string built from props would reach the DOM with no CSS rule behind it, and M4 would stay broken in the browser while jsdom passed. The placeholder already used this mechanism, and an inline style also means no caller class can override the ratio. The tests assert `style.aspectRatio` on both branches.
3. **The FaqBlock test is read as "no caller-appended colour classes".** The brief's literal wording ("no `border-success-border`/`hover:bg-success-surface` in any ask-card anchor's className … and the WhatsApp row carries the `success` classes") contradicts itself for the WhatsApp anchor. The test instead asserts that each anchor's class string equals `buttonClassName(its variant)` exactly, that no anchor has `text-blue-safe`, and that call/e-mail carry neither success class.
4. **The M3 RED comes from a prop spy, not from behaviour.** `priority` and `preload` render identically in 16.3.5, so a pass-through `vi.mock('next/image')` spy provides the RED. The behavioural assertions the brief asked for are in the same test.
5. **Docs beyond the brief's named anchors, all in named files:**
   - ARCHITECTURE § Design system's `Button` variant list gained `success`/`inverse-dark`. Otherwise the list would be false; this is the same kind of self-consistency fix the reviewer accepted as Task 5 deviation 2.
   - The W127 ask-card delta joined the W128 deltas in the D20 list, since W127 itself calls it a "D20 accepted delta".
   - The list's intro sentence was adjusted accordingly.
6. **Anchors the brief pointed at that don't exist in the docs:**
   - `grep -n 'contrast-safe blue'` matches no doc; the phrase is in `Button.tsx`'s comment. I used the D20 named-deltas list in ARCHITECTURE § Quality gate, which starts with the `blue-safe` CTA face.
   - `docs/OPERATING.md` covers production operations only and has no local-dev sentence, so the W126 gotcha went to ARCHITECTURE § Run locally.
7. **`rsc-imports.test.ts` scope details:**
   - It skips test files (`__tests__/`, `*.test.*`): they are in no app graph, and some mock `next/navigation`.
   - It also walks `.ts` modules under `blocks/`, i.e. `index.ts`.
   - It counts type-only imports.
8. **Item 9 sweeps the green band with a secondary CTA** (`inverse-dark`), beyond the brief's list, and adds coverage asserts.
9. **Commit trailer.** It is `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, not the brief's `Claude Fable 5.1`. This session runs on Opus 5.5, the harness's attribution rule names that model, and the branch history shows each implementer attributing its own model (Task 5 used `Claude Sonnet 5`).

### Concerns

1. **The green band's tick icons are hard to see.** They are `CheckIcon … text-success` (#16a34a) on the #12813c surface. They are decorative (`aria-hidden`), so axe stays silent, but they are nearly invisible. This is a design-visible nit left as is: it is not in scope and not a contrast failure.
2. **`rsc-imports.test.ts` checks direct imports only.** A block importing a non-`'use client'` module outside `src/design/` that itself uses a client hook would pass it. The W126 build is the backstop.
3. **W129's "width sweep at 390 on the gallery" (Playwright) was not run** in this round, because the brief said no Playwright. The jsdom tests pin the class structure, not the layout.
4. **Future briefs should curl the galleries under `next dev`, or expect 404 under `next start`** (R41).

### Produces additions

- `ButtonVariant` gains `'success'` (W127) and `'inverse-dark'` (W128b); both are additive and `buttonClassName` handles them.
- New `src/analytics/contact-kind.ts` exports `contactKindOf`, `ContactKind`, `CONTACT_PLACEMENTS` and `ContactPlacement` (W125). `useContactClick.ts` re-exports all four unchanged.
- Behavioural notes:
  - `ClosingCtaBand`'s secondary/extra default face is `inverse-dark` on `tone="green"` (navy/gradient keep `inverse`).
  - `ImageSlot`'s two branches share `w-full h-auto object-cover` plus the inline ratio, and `priority`/`lcp` map to next/image `preload`.
  - `ImageSlotProps.className` must never carry `w-*`/`aspect-*`.
- No existing signature changed.

### Process check

`ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium' | grep -v grep` shows only the unrelated system `ChromeRemoteDesktopHost`. The `next start` and `next dev` servers were stopped, and port 3000 is free.
