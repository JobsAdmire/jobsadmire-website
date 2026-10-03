# Task 5 — fix round 1 re-review (`4944f40..c7b4a6f`: 2c6c719, 8c1af15, 9f737af, 99cfbf3, cae6bbc, df935e3, c8c2b41, c7b4a6f)

**Fix round 1 verdict:** ✅ all findings addressed — C1 (W125), I1 (W127), I2+M4 and M3 (W129), I3/I4 (W128) and M1, M2, M5 are fixed, pinned by tests, and verified in the built app plus one `next dev` render of both galleries. Two new Minor items remain, neither a gate failure: the green band's tick glyphs stay `text-success` (1.51:1 on #12813c), and `ImageSlot`'s caller rule omits the two other properties its box sets.
**Regressions:** none.
- Gate green at HEAD: 81 files / 468 tests.
- Build green: 13/13 pages; the gallery module graph that failed at BASE now compiles.
- Playwright chrome + width-sweep + smoke: 112/112 on `next dev`.
- Zero console or hydration messages on `/`, `/en`, `/isci-talebi` and `/en/hire-workers` (dev and prod), and on both galleries (dev; 390/901/1000/1440).
- The fix round touches only the 19 files the brief names.
- JS is 168,361 B gz-9, +510 B over Task 4. That is Task 5 as a whole, not this round.

Reviewer: read-only on the repo. Worktree `jobsadmire-website-wp2` at `c7b4a6f` on `wp2/foundation`; `git status --porcelain` was empty before and after.
- `next dev` appended its `nextjs-agent-rules` block to `CLAUDE.md` once. The diff was exactly that block (10 added lines, 0 removed), and it was discarded with `git checkout -- CLAUDE.md`. The build appended nothing.
- The saved `review-4944f40..c7b4a6f.fixround1.diff` is byte-identical to a live `git diff 4944f40..c7b4a6f` (86,845 B, `cmp` clean).
- Scratch: `$RR` = `/private/tmp/claude-501/-Users-agentfaraz-projects-admiregroup-jobsadmire/b66860be-3e05-4c03-954a-f55becea5a18/scratchpad/rereview-task5/`.
- Heavy jobs ran one at a time: gate (`$RR/gate.log`) → two single-file Vitest runs in a scratch copy → build (`$RR/build.log`) → `next start` for the JS and prod console probes (then killed) → one `next dev` for Playwright and the gallery probes (then killed).
- The final `ps` shows only the unrelated system `ChromeRemoteDesktopHost`, and port 3000 is free.

## Per item (1–9)

### 1. W125 / C1 — `contactKindOf` in a pure module — ✅
- **Code.**
  - `src/analytics/contact-kind.ts` exports `CONTACT_PLACEMENTS` (:11), `ContactPlacement` (:12), `ContactKind` (:14) and `contactKindOf` (:18). Its only import is `PARAM_ENUMS` from `./track` (:1).
  - `track.ts` has **no imports at all** and touches `window` only inside `track()` (:73), so it is RSC-safe.
  - `useContactClick.ts` keeps `usePathname` (:3), re-exports all four names (:10–15) and keeps `useContactClick`. Its export set is identical to BASE, and `useContactClick.test.tsx` still imports `CONTACT_PLACEMENTS`/`contactKindOf` from it, so Task 3's API is unchanged.
  - `ContactCta.tsx:3` imports `@/analytics/contact-kind`.
  - A repo-wide grep finds one other importer of the hook module, `ContactLink.tsx`, which is `'use client'`. No server module under `src/` imports it.
- **The guard goes RED on the bad import (scratch copy, not the repo).**
  - Setup: `git archive HEAD src contract vitest.config.mts vitest.setup.ts tsconfig.json package.json` into scratch, with `node_modules` symlinked. `ContactCta.tsx:3` was reverted to `@/analytics/useContactClick`, then `vitest run rsc-imports.test.ts`.
  - Result: `AssertionError: expected [ Array(1) ] to deeply equal []`, with the single entry `"src/design/blocks/ContactCta.tsx → @/analytics/useContactClick"` (`$RR/guard-red.log`).
- **Robustness probe** (`$RR/guard-variants.log`). Four imports were planted at once:
  - a type-only **relative** import of the hook module in `PostCard.tsx`;
  - `export * from '@/analytics/useContactClick'` in `blocks/index.ts`;
  - `notFound` from `next/navigation` in the server `SlimBar.tsx`;
  - `usePathname` in the `'use client'` `MobileNav.tsx`.
  The guard reported exactly the first three and correctly ignored the client module. The scratch copy was removed, symlink first.
- **The real proof.**
  - `npm run build` exit 0: "✓ Compiled successfully", and the 13/13 static pages include `● /tr/dev/gallery` and `● /en/dev/gallery`, whose graph (`Wp2Blocks → FaqBlock/ClosingCtaBand/EmptyState → ContactCta`) is the one that failed at BASE.
  - Turbopack's content-keyed persistent cache was warm from the implementer's build of the same HEAD, hence the 467 ms compile.
  - In `next dev` both galleries return 200. `/`, `/en`, `/isci-talebi` and `/en/hire-workers` stay 200 **after** the galleries compiled, so the C1 "every route 500s" cascade is gone. The dev log has no error or warning lines.
- **Docs.** ARCHITECTURE § Chrome "Contact clicks (W12)" (~:293) gains the W125 sentence naming `src/analytics/contact-kind.ts` and the guard.

### 2. W127 / I1 — `success` variant, no caller colour classes — ✅
- **Code.**
  - `Button.tsx:20` `success: 'border border-success-border bg-white text-success-text hover:bg-success-surface'` is byte-exact against W127.
  - The union (:4–5) is additive; the diff has additions only, so every existing variant string is byte-identical.
  - `FaqBlock.tsx:85` is `variant="success"`, and `:94`/`:103` are `variant="secondary"`. No ask-card `ContactCta` passes a `className`, and no other block or chrome caller passes a colour class. The one remaining WP1 case, `HeaderCtas` `PRIMARY`, is W122's parked final-review item.
- **Test.** `FaqBlock.test.tsx` asserts each anchor's `className` **`toBe(buttonClassName(variant))`**. That exact equality proves nothing is appended, which is stronger than the brief's token list (see deviation 3). `Button.test.tsx` covers the variant.
- **Browser** (`next dev`, both locales, 390/901/1000/1440; `$RR/gallery-probe.jsonl`, `ask`/`hover`).
  - **WhatsApp row.** Its colour classes are exactly the `success` variant's. Rest state: color `rgb(18,129,60)`, border `rgb(187,247,208)`, bg white. On hover the bg becomes `rgb(220,252,231)` and the **border stays `rgb(187,247,208)`**; the first review saw it flip to tint `rgb(191,223,240)`.
  - **Call row.** Ink `rgb(22,32,46)`, border `rgb(219,232,242)`. On hover it becomes pale-1 `rgb(244,249,252)` with tint-border, which is exactly the `secondary` face with no collision.
  - The gallery's ask card has no e-mail row; the mail row is covered by the jsdom exact-equality test.
  - Screenshot: `$RR/shots/_dev_gallery-1440-askcard.png`.

### 3. W129 / I2 + M4 — `ImageSlot` owns its box; the row cover is a wrapper — ✅
- **Code.**
  - `ImageSlot.tsx:25` `BOX = 'w-full h-auto object-cover'` sits on both branches, and the inline `aspect-ratio: w / h` is at :47, :57 and :71.
  - `PostCard.tsx:71` renders `<div className="w-[104px] shrink-0">{cover}</div>` for the row, and `:72` gives the text column `flex min-w-0 flex-1 flex-col`.
  - `COVER` lost its `className`, so `ImageSlot` receives only `rounded-xs`. The old `object-cover` append is gone because `BOX` owns it.
- **Inline `aspect-ratio` instead of an `aspect-[w/h]` class: sound.**
  - Tailwind 4 emits only class strings it finds whole in the source, so an `aspect-[${w}/${h}]` built from props would reach the DOM with no rule behind it.
  - BASE's placeholder already used the inline style, and the frozen Produces line describes it as a "gradient box with aspect-ratio width/height".
  - An inline style also outranks every class, so no caller class can override the ratio.
- **Browser** (both galleries, 390/901/1000/1440).
  - **No page scroll.** `document.documentElement.scrollWidth <= innerWidth` holds everywhere (390→390 … 1440→1440), and no element in the Wp2Blocks region overflows.
  - **Row card.**
    - The wrapper is **104 px** and the slot **104×78** (1.333 = 104/78).
    - The **text column is 196 px** at 390, 230 px at 901/1000 and 146 px at 1440.
    - The article's client/scroll widths are 348/348, 382/382 and 286/286, and no descendant crosses the card's edge.
    - At BASE the text column was 0 px, the article overflowed by 75 px, and the page scrolled at 390.
  - **Card variant.** The placeholder ratio is 2.676 (380/142).
  - **Featured image branch** (the gallery passes `coverSrc="/brand/ja-mark.png"`, a 1:1 asset). The `<img>` measures 348×109.8 → **3.169 = 640/202**, with `object-fit: cover` and `style.aspectRatio = "640 / 202"`. The screenshot taken after scroll-in shows the loaded mark cropped into the wide box; at BASE it rendered as a square.
  - **Gallery slots.** The 4:3 placeholder is 256×192 and the 88:88 photo 96×96.
  - Screenshots: `$RR/shots/*-postcards.png` and `*-postcard-row.png`.
- **Tests.**
  - `ImageSlot.test.tsx`: both branches carry `BOX` and `640 / 202`, and the `<img>` keeps `width`/`height` 640/202.
  - `PostCard.test.tsx`: the row wrapper has `w-[104px] shrink-0`, the slot has `w-full` but neither `w-[104px]` nor `shrink-0`, and the text column has `min-w-0 flex-1`.
  - An `it.each` over card/row/featured checks placeholder and photo: no `w-*`/`min-w-*`/`max-w-*`/`size-*`/`aspect-*` class other than `w-full`. N2 notes the rule stops short of `h-*`/`object-*`.

### 4. M3 — `preload` instead of the deprecated `priority` — ✅
- `ImageSlot.tsx:56` passes `preload={priority ?? lcp}`. `ImageSlotProps` is unchanged, so the frozen `lcp?`/`priority?` props are still accepted with the frozen `priority ?? lcp` semantics.
- **Checked in next 16.3.5.**
  - `get-img-props.d.ts:23` declares `preload?: boolean`, and `:24–28` marks `priority` `@deprecated Use preload`.
  - `get-img-props.js:271` is `isLazy = !priority && !preload && …`, and `:587` is `preload: preload || priority`.
  - `fetchPriority` is emitted only when the caller passes it (:572). So the swap changes nothing at runtime; it only drops the deprecated prop.
- **Test.** A pass-through `vi.mock('next/image')` spy records `{preload:true, priority:undefined}` ×2 and `{preload:false}`. The behavioural checks: no `loading` attribute plus a hoisted `<link rel="preload" as="image" imagesrcset>` for lcp and priority, while the lazy control has `loading="lazy"` and no link.

### 5. W128(a) / I3 — PostCard byline — ✅
- `PostCard.tsx:92` byline is `text-text-tertiary`. Computed `rgb(100,116,139)` on white is **4.76:1** in every variant, both locales and all four widths.
- axe `color-contrast` over the Wp2Blocks region reports **0 violations**; the first review had 2–3 nodes per run.
- The test asserts `text-text-tertiary` and not `text-muted`.

### 6. W128(b) / I4 — green band — ✅ (tick glyph: see N1)
- **Code.**
  - `Button.tsx:23` `'inverse-dark': 'border border-white/40 bg-black/15 text-white hover:bg-black/25'` is byte-exact.
  - `ClosingCtaBand.tsx` `TONE` (:22–39) sets green to `text-white` body and ticks with the `inverse-dark` face. Navy and gradient keep `text-white/70` / `text-white/75` / `inverse`, unchanged. Body is at :97, ticks at :100, and the face at :113–114.
  - The `tone` union is unchanged.
- **Tests.** The green case asserts `text-white` body and list, and `buttonClassName('inverse-dark')` for secondary and extra. An `it.each` covers navy/gradient `inverse` and the softened copy.
- **Gallery.** `Wp2Blocks.tsx:272–285`: the green band now has `bodyId="home.185"`, a WhatsApp secondary and two ticks.
- **Browser** (band `rgb(18,129,60)`).
  - Body: white, **4.96:1**.
  - Tick text: white, **4.96:1**. Visible at 390; `display:none` from md, as designed.
  - Secondary CTA: classes exactly `border border-white/40 bg-black/15 text-white hover:bg-black/25`, bg `rgba(0,0,0,0.149)`. White on the composited face is **6.38:1**; W128's ≈5.6:1 was conservative.
  - Primary (`blue-safe`): 5.2:1.
- **axe WCAG 2.1 A/AA over the whole Wp2Blocks region: 0 violations** in TR and EN at 390/901/1000/1440.
  - The `color-contrast` incompletes listed (the first 8 per run) are pre-existing ProcessSteps "pseudo element" nodes plus the accordion icon.
  - The only best-practice hit is `landmark-unique` (the gallery's two Breadcrumbs, dev-only, parked by the first review).
- **Tick glyph (the implementer's Concern 1): confirmed.** `ClosingCtaBand.tsx:104` `<CheckIcon className="mt-0.5 shrink-0 text-success" />` computes stroke `rgb(22,163,74)` on `rgb(18,129,60)`, which is **1.51:1**.
  - It is effectively invisible; see `$RR/shots/_dev_gallery-390-green-band.png`.
  - axe is silent because the SVG is `aria-hidden`.
  - W128 says "body and ticks are full `text-white`". → **N1**.

### 7. W78 docs (M1) — ✅
- `docs/CONTENT-MODEL.md:49` (§ `sys.*` range, Forms bullet) now lists `form.options.<field>.<key>`, "today `startWhen.{asap,month1,months1to3,planning}` — the keys are `START_WHEN_KEYS` in `src/forms/options.ts`, W78".
- `docs/ARCHITECTURE.md:205` (§ Forms flow, :203–222) gains one sentence: `START_WHEN_KEYS` in `src/forms/options.ts` is "the one `startWhen` vocabulary every form shares".

### 8. Docs lag (M2) — ✅
- `docs/ANALYTICS.md:58–60` lists `StickyCtaBar` in the `page_cta` sources of `call_click`/`whatsapp_click`/`email_click`, and `:73` does too. This is accurate: `StickyCtaBar.tsx` renders every CTA through `ContactCta placement="page_cta"`, mailto included. Prettier re-padded the table.
- `docs/ARCHITECTURE.md:285`: `visibility.test.tsx` "guards the chrome and the blocks".
- The D20 named-deltas list (§ Quality gate, ~:257–266) gains the "Block colours (W128)" bullet (byline; green body/ticks white; `inverse-dark`; navy and gradient keep `inverse`) and the "`FaqBlock`'s ask card (W127)" bullet, and the intro notes the source.
- The W126 gotcha is at `docs/ARCHITECTURE.md:102`, inside § Run locally (:94–108).
  - `docs/OPERATING.md` has no `next dev` sentence to anchor on; its only local reference, :64, is about the `next start` gate run. So "whichever" is honoured.
- § Design system's variant list (:270) now reads `primary|secondary|ghost|danger|inverse|inverse-dark|success`.

### 9. M5 — sweep coverage — ✅
`visibility.test.tsx` now renders, in the sweep:
- `StickyCtaBar` scrolled, with `window.scrollY` set to 800 before render and reset to 0;
- the gradient band with body, extra and ticks;
- a pale `EmptyState` with a CTA;
- `ImageSlot` with a `src`;
- the green band with a secondary CTA.

It then asserts each is present, so a green run cannot be vacuous. The assertions are `[data-testid="sticky-cta"]`, a `from-ink` class (used only by the gradient surface), `[role="status"].bg-pale-1` (only the pale tone's box), `img[alt="Foto"]` and `bg-black/15`. The previous round's display list (`inline-table`…`table-cell`, :41–45) is unchanged: the diff removes 0 lines.

### Regression checks (a)
- **Gate at HEAD.** `typecheck` ✓, `lint` ✓, `prettier --check` ✓, `vitest --maxWorkers=1` **81 files / 468 tests** ✓. The only stderr line is Node 25's pre-existing `--localstorage-file` warning (`$RR/gate.log`).
- **Build.** Green (above). The production CSS has rules for every class the round introduced, e.g. `.bg-black\/15{background-color:#00000026}`, `.hover\:bg-black\/25`, `.border-white\/40`, `.border-success-border`, `.hover\:bg-success-surface`, `.text-text-tertiary`, `.w-\[104px\]`, `.h-auto`, `.object-cover`, `.min-w-0`, `.flex-1` (`$RR/css-check.cjs`).
- **`next start`.** `/`, `/en`, `/isci-talebi` and `/en/hire-workers` return 200, with **zero console messages** at 390 and 1440 and no horizontal scroll. Both galleries 404 there, which is R41 (`page.tsx:59`) (`$RR/prod-console.jsonl`).
- **`next dev`.** Playwright `chrome.spec` 10/10, `width-sweep.spec` 100/100, `smoke.spec` 2/2 = **112/112** (`$RR/pw.log`). Zero console, hydration or page errors on the four site routes (390/1440) and both galleries (four widths).
- **Scope.**
  - `git diff --stat 4944f40..HEAD` lists 19 files, each mapping to a brief item.
  - Nothing under `docs/superpowers/handoff-2026-09-25/`, the ruling log, `docs/WEBSITE-HANDOFF.md`, `produces-final.md`, `contract/` or `src/messages/` changed.
  - W13 holds: no `'use client'` first statement under `src/design/blocks/`.
  - The Produces blocks are intact apart from the additive `success`/`inverse-dark` and the new `contact-kind.ts`.
- **Not independently verified:** that each intermediate commit's verify was green. The owner's rule allows one gate run, so only HEAD was checked; the report's per-commit table is the implementer's claim.

## The implementer's deviations and concerns — verdicts

**Deviations**
1. **Gallery 404 under `next start` (R41), so the four 200s came from a `next dev` pass: accept.** I reproduced both: 404 under `start` (`page.tsx:59` `if (process.env.NODE_ENV === 'production') notFound();`) and 200 under `dev`. The brief's check was impossible as written, and the substitute is the faithful one.
2. **Inline `aspect-ratio` instead of an `aspect-[w/h]` class: accept.** This is sound for the reasons in item 3, and it was verified in the browser for all five boxes.
3. **FaqBlock test wording: accept.** The brief's sentence contradicts itself for the WhatsApp anchor, which must carry `border-success-border`. Exact equality with `buttonClassName(variant)` is strictly stronger than a token blacklist.
4. **M3 RED from a prop spy: accept.** `preload` and `priority` are provably identical in 16.3.5 (item 4), so only the props can go red. The spy is pass-through (the real `next/image` renders), and the behavioural assertions are there too.
5. **Extra ARCHITECTURE edits (variant list, W127 in the D20 list, intro): accept.** Without them the list would be false, and W127 itself calls the ink rows a "D20 accepted delta". All are in a named file.
6. **Moved anchors: accept.** `contrast-safe blue` occurs in no live doc; it appears only in `Button.tsx`/`Eyebrow.tsx` comments and the plans/handoff. `OPERATING.md` has no local-dev sentence (item 8).
7. **`rsc-imports.test.ts` scope (skips tests, walks `.ts`, counts type-only imports): accept.** Test files are in no app graph and some mock `next/navigation`. Counting type-only imports is conservative, but costs nothing, since the pure module exports the same types.
8. **Sweep additions beyond the brief (green secondary, coverage asserts): accept.** They are additive and remove the vacuous-green risk the first review described.
9. **`Co-Authored-By: Claude Opus 5.5` instead of the brief's `Claude Fable 5.1`: accept.** The session's harness attribution rule names the model that did the work and outranks an agent-written brief template. The branch history attributes each implementer to its own model. Recording "Fable 5.1" would have misattributed.

**Concerns**
1. **Tick icons nearly invisible: confirmed and measured** (1.51:1) → **N1**.
2. **The guard checks direct imports only: confirmed, and accepted as W125 scoped it.** The W126 build is the backstop, and it is green. A transitive check is parked.
3. **W129's "width sweep at 390 on the gallery" was not run: now done by this re-review.** No page scroll at 390/901/1000/1440 in either locale, and the row text column is 196 px at 390. It is still not an automated gate, though (parked).
4. **Future briefs should curl the galleries under `next dev`: agree** (parked, process).

## New findings (Critical / Important / Minor)

Critical: none. Important: none.

**N1 (Minor) — the green band's tick glyphs are green on green (1.51:1), against W128(b)'s "ticks are full `text-white`".**
- **Where.** `src/design/blocks/ClosingCtaBand.tsx:104`: `<CheckIcon className="mt-0.5 shrink-0 text-success" />`. The icon strokes `currentColor` (`icons.tsx:15`), and its own `text-success` overrides the list's `text-white`.
- **Measured.** Stroke `rgb(22,163,74)` (#16a34a) on the band `rgb(18,129,60)` (#12813c) is **1.51:1** at 390 in TR and EN; the ticks are `md:hidden`. Screenshots: `$RR/shots/_dev_gallery-390-green-band.png`, `_en_dev_gallery-390-green-band.png`.
- **Why nothing caught it.**
  - The SVG is `aria-hidden` and decorative (the text carries the meaning), so axe is silent and it is not a WCAG 1.4.11 failure.
  - `ClosingCtaBand.test.tsx:85–86` checks only the `<ul>`'s class.
  - On navy (#0e1a37) the same green is ≈5.2:1, so only the green tone is affected.
- **Reach today.** Only the gallery. No WP2b draft passes `ticks` to a `ClosingCtaBand`: About's green band (`wp2b/fixed/task-6.md:1840`) has none. So this is latent.
- **Fix (one line + one assertion).** Make the glyph tone-aware: add `icon: 'text-success' | 'text-white'` to `TONE` (navy/gradient `text-success`, green `text-white`) and render `<CheckIcon className={`mt-0.5 shrink-0 ${look.icon}`} />`. Alternatively, drop `text-success` on green so the glyph inherits the list's `currentColor`.
- **Test.** The green case asserts the tick `svg` has `text-white` and not `text-success`; navy keeps `text-success`.

**N2 (Minor) — `ImageSlot`'s caller rule names `w-*`/`aspect-*` but not the other two properties `BOX` sets (`height`, `object-fit`).**
- **Where.**
  - `ImageSlot.tsx:14–16`: "never a width or aspect class (`w-*`, `aspect-*`)".
  - `PostCard.test.tsx:115`: the `callerBoxClasses` regex covers only `(min-|max-)?w|size|aspect`.
- **Why it matters.** `BOX` also sets `h-auto` and `object-cover`, so a caller's `h-*`/`object-{contain,fill,none,scale-down}` is a W122 same-property collision whose winner is rule order. In the built CSS:
  - `.h-\[` (offset 14,497) precedes `.h-auto` (14,595);
  - `.object-contain` (25,202) precedes `.object-cover` (25,237);
  - `.w-\[104px\]` (15,368) precedes `.w-full` (15,462). That last pair is exactly I2's mechanism.
  So a WP2b hero passing `h-[420px]` or `object-contain` would silently lose.
- **Reach.** No current caller does this; W122 already forbids it in general.
- **Fix.** Widen the docblock to "never a class for a property the slot's box sets — `w-*`, `h-*`, `aspect-*`, `object-{fit}`; size it with `width`/`height` and a wrapper". Extend the test regex to `h-` and object-fit (`object-top`-style positions stay allowed).

Both are cheap enough to fold into one commit now, or into the WP2a final-review fix round. That is the controller's call; neither blocks WP2b.

## JS budget

W120 method: gzip-9 (and brotli-11) over each route's `<script src>` set, the one `noModule` polyfill excluded, on `next start` at HEAD (`$RR/js-budget.mjs` → `$RR/js-budget.jsonl`).

| Route | Scripts | Raw | gz-9 | br-11 | vs Task 4 (167,851 gz-9 / 144,995 br-11 / 556,637 raw) |
|---|---|---|---|---|---|
| `/`, `/en`, `/isci-talebi`, `/en/hire-workers` (identical) | 10 | 558,540 | **168,361** | 145,423 | **+510 B gz-9** (+0.30%), +428 br-11, +1,903 raw |

Headroom is 36,439 B to the W13-amended 204,800 B ceiling and 26,199 B to the 194,560 B lazy-loading trigger.

**Did the barrels grow the shared chunk?**
- **Primitives barrel: yes, by RadioChips.**
  - `22xj8b8al36_u.js` (37,048 B raw / 12,894 B gz-9) is loaded on all four routes. I split it by evaluating its `TURBOPACK.push` array without running a factory (`$RR/chunk-split.cjs`).
  - Besides the `next/image` client, it holds every `'use client'` member of `@/design/primitives`, with standalone gz-9 sizes: Accordion 753, Tabs 715, Dialog 703, **RadioChips 643** (1,188 raw, new in Task 5), PausableMarquee 641, Chip 333, and the Button module 835, which carries the variant map including `success`/`inverse-dark`.
  - Client modules `HeaderCtas`, `ConsentBanner`, `error.tsx` and `forms/client/*` import the barrel, and it is not tree-shaken.
  - **Tabs, Dialog, Chip and RadioChips have no use outside the dev gallery.**
  - The +510 B delta matches RadioChips plus the two variant strings. Had Tabs, Dialog and Chip been new, the delta would exceed 1.7 KB, so they already rode along at Task 4.
  - This fix round's own client-JS change is only the two variant strings; every other file it touched is server-only.
- **Blocks barrel: no leak.** No client script on these routes contains a block marker (`data-placeholder`, `readMinutes`, `sticky-cta`, `data-live-dot`, `Sayfa yolu`).

## Parked for the WP2a final review
- **Primitives-barrel dead weight** (≈2.4 KB gz-9 standalone for Tabs + Dialog + Chip + RadioChips on every route). Client modules should import primitives by file (`@/design/primitives/Button`) or get an ESLint `no-restricted-imports` on the barrel in `'use client'` files. This pairs with the first review's `@/design/blocks`/`@/lib/format/date` client-import rule.
- **W129's "pinned by the width sweep at 390 on the gallery" is not automated.** The gallery 404s under `next start` (R41), and `GATE_ROUTES` excludes it. The real pin arrives when the first WP2b page mounting `PostCard variant="row"` (Blog) joins `GATE_ROUTES`; until then, the jsdom class tests plus this probe.
- **The `rsc-imports` guard is direct-import-only and `src/design/**`-only.** A server module elsewhere (`src/app/**`, `src/lib/**`), or a transitive import, relies on the W126 build. It also forbids the RSC-safe `notFound`/`redirect` from `next/navigation` in server design modules: fine for blocks, worth knowing.
- **`ImageSlot`'s photo is now `w-full`,** so a slot rendered wider than its `width` prop upscales unless the page passes `sizes`. The WP2b image policy should always pass `sizes` for fluid slots, so that `next/image` emits `w` descriptors.
- **Process: task briefs should curl the galleries under `next dev`,** since they 404 under `next start` by R41.
- **`produces-final.md` "Task 5 — as built"** should record:
  - `ButtonVariant` `success`/`inverse-dark`;
  - `src/analytics/contact-kind.ts` with the re-exports;
  - `ClosingCtaBand`'s tone-default face (`inverse-dark` on green);
  - `ImageSlot`'s `BOX` + inline ratio + `preload` mapping and its caller-class rule (after N2's wording).
  `docs/WEBSITE-HANDOFF.md`'s variant list and "13 primitives" belong to the controller.
- **Still open from the first review's parked list:**
  - one `FaqBlock`/`Breadcrumbs` per page;
  - a client-import lint for `@/lib/format/date`;
  - the `ContactCta` folder coupling;
  - the `OfficeCard` hours-row hover, `Tabs.onChange` on re-click, and `sys.blocks.*` in the client payload nits.
