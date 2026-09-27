# Task 6 review — Client islands + build-time assets (BASE 84aa6e3 → HEAD 2d87575, 8 commits)

**Spec compliance:** ✅ compliant. Every frozen Produces item and every Task 6 addition is present with the brief's names, paths and signatures. 34 of 38 full-file code blocks are byte-identical to the brief. The other 4 differ only by the W85 additions and one comment character. W14/W40/W41/W42/W45 hold, and the assets regenerate byte-identically. One behavioural gap in the W85 addition, LazyIsland un-mounting when it leaves the viewport, is counted under code quality because the addition does not spell out the leave-view case.
**Code quality:** ❌ changes required: 0 Critical, 3 Important, 9 Minor

Reviewer runs, one heavy job at a time, all at HEAD:
- **Gate:** typecheck ✓, lint ✓, format ✓, vitest **97 files / 513 tests** ✓, matching the report.
- **Build:** one `npm run build` exited 0 on Next 16.3.5 (Turbopack), 13/13 pages, TypeScript clean. The Turbopack persistent cache was warm (compile 0.5 s).
- **`next start`:** `/`, `/en`, `/isci-talebi` and `/en/hire-workers` all 200. `/dev/gallery` and `/en/dev/gallery` return 404, which R41 intends.
- **`next dev` (one session):** `e2e/chrome` + `width-sweep` + `smoke` **112/112 passed**. My gallery probes are listed below.
- **Scratch-only probes:** 10 jsdom probes (vitest, scratch config), Playwright probes, a QR grid decoder, and Next's own SWC RSC validator. Nothing in the repo was edited. The `nextjs-agent-rules` block `next dev` appended to `CLAUDE.md` was reverted. The tree is clean and no process of mine is left running.

## Spec compliance evidence

- **Brief versus disk (scratch extractor over `task-6-brief.md`):**
  - **Full-file blocks:** 38 extracted. 34 are byte-identical. Four differ, all for accepted reasons:
    - `src/design/islands/index.ts`: `+LazyIsland`, `+useInView` (W85, required by the additions).
    - `ScrollSpyToc.tsx`: `remainingSingular` / `remainingPlural` plus the `remainingText` selection (W85).
    - `__tests__/ScrollSpyToc.test.tsx`: three W85 cases (singular, plural, function prop wins).
    - `src/lib/qr.ts`: a comment `82–86 px` became `82-86 px`. Harmless; the report's "verbatim" is off by that one character.
  - **Partial edits (7):** `Dialog.tsx` head and containers, `Dialog.test.tsx` (+1 case), `icons.tsx` (`XIcon`/`LinkIcon` appended after `ClockIcon`), `globals.css` (print isolation, then source-map blocks appended at the end), `.prettierignore`, `eslint.config.mjs` `globalIgnores` entry, and the gallery `page.tsx` (6 imports, the `sourceCountries` line, two `Block`s after the Dialog/SkipLink block). All match the brief. Prettier only re-wrapped the Flag `.map` in `page.tsx`.
  - **Files outside the brief:** `useInView.ts`, `LazyIsland.tsx` and their two tests (W85), and one self-check case in `src/design/blocks/__tests__/rsc-imports.test.ts` (W125).
- **Produces intact:**
  - The islands barrel exports all nine islands, `useScrollProgress`, and W85's `useInView`/`LazyIsland`.
  - `Dialog` has `variant?: 'center' | 'sheet'`. `XIcon`/`LinkIcon` are present.
  - Asset modules: `source-map-codes.ts`, `flag-codes.ts`, the `source-map.ts` door re-exporting `source-map.generated.tsx`, `Flag.tsx`, `qr.ts` (no `server-only`), `QrCode.tsx` (`server-only`), and `brand.ts` (sizes match `file`: logo 742×146, iskur 320×320, ja-mark 336×285).
  - `public/brand/{flags.svg, google-play.svg, logo.png, iskur.png}` are present.
  - `.gitattributes` marks both generated files `linguist-generated`, confirmed with `git check-attr`.
- **W14 (build time only):**
  - I regenerated into scratch first (`buildFlagSprite()`/`buildSourceMap()` then `cmp`: identical), then ran `npm run assets:flags` and `npm run assets:map`. `git status` stayed clean both times, so the committed output equals the generated output and is deterministic.
  - QR: I rebuilt the module grid from `qrSvg`'s path runs and compared it with `QRCode.create(text, {M}).modules`. Zero mismatches across 3 inputs × margins 0/2/4, and output is deterministic.
  - **Runtime fetches:** the only `fetch(` in `src/**` is the pre-existing Ops adapter. The only third-party URLs in the islands and assets are ShareRow's intent `href`s, which are navigation, not fetches. The Playwright request log shows zero third-party requests on the gallery load.
  - **Server-only encoder:** `qrcode` is imported only by `src/lib/qr.ts`, which is used only by `QrCode.tsx` (`server-only`) and the server gallery page.
  - **Dev-only packages and design-package:** nothing in `src/**` imports `d3-geo`, `topojson-client`, `world-atlas` or `flag-icons`. `design-package` appears in `src/**` only inside comments.
- **W40 (upper-case codes):**
  - `bundle.tr.json` and `bundle.en.json` both carry `PK NP IN UZ KG TM PH ID RU ML SN CM LK`, with no empty names. The cross-check test passes in the gate.
  - `flags.svg` has 14 `<symbol id="flag-XX">`, `PK`…`TR`, with no `flag-icons-` ids and no lower-case ids.
  - In the rendered map: 14 `g[data-country]` (13 + `TR`) whose titles are the collection names, 13 arcs, 140 paths, and the `TR` text comes from the `turkiyeLabel` prop (W9/W23).
- **W41 gallery:** exactly one `dev/gallery/page.tsx`. `IslandsDemo.tsx` sits beside `Wp2Blocks.tsx`/`RadioChipsDemo.tsx`. The islands carry no copy; the demo passes every label.
- **W42 scripts:** `assets:brand`, `assets:flags` and `assets:map` were inserted after `redirects:build`, additively.
- **Dependencies:**
  - `package.json` root deps equal `package-lock.json`'s root.
  - `qrcode` 1.5.4 is the only new runtime dependency. `flag-icons` 7.5.0, `d3-geo`, `topojson-client`, `world-atlas` and the `@types/*` packages are dev-only.
  - `npm ls --depth=0` is clean apart from `@emnapi/*` "extraneous". That predates Task 6: installed 26 Sep, with 20 lock references at both BASE and HEAD.
- **W85:**
  - `useInView` has no window access at import or first render (`useState(false)`, observer created in an effect). `LazyIsland` is `'use client'`, and the tests use a mocked `IntersectionObserver`.
  - ScrollSpyToc's string props are tested.
  - Behavioural gaps are covered under Important 1 and Minor 1–2.
- **W125:** the guard's `modulesUnder(DESIGN)` already walked `islands/`. The implementer added an explicit self-check, which satisfies the addition's literal wording. What that guard cannot see is Important 2.
- **W10/W13/R18/R20:**
  - Browser facts go through `useSyncExternalStore`: Web Share support, the active heading, and scroll progress.
  - The gallery at 390/901/1440 in TR and EN shows 0 console errors and 0 hydration warnings.
  - Reduced motion: no animation runs (details under Minor 7).
- **W119/W122/W129:** no bare `hidden`; the only `hidden` tokens are `aria-hidden`, `overflow-hidden`, `print-hidden` and one `[&::-webkit-search-cancel-button]:hidden` arbitrary variant. No same-property caller overrides, and no `ImageSlot` in Task 6 files. Axe (wcag2a/aa/22aa) finds **0 violations** on the whole gallery and on the two Task 6 blocks, at 390/901/1440 in both locales.
- **Docs (W45):**
  - ARCHITECTURE § Design system: the islands paragraph (line 272) follows Task 5's paragraph, which still ends "always UTC calendar dates".
  - ARCHITECTURE "Pages:": the fragment was replaced with the § Assets pointer.
  - ARCHITECTURE: `### Assets — build time only…` sits between "Pages:" and `### Chrome`.
  - PRD § 11: both fragments are replaced, and the Task 3/5 wording survives.
  - **Untouched:** `docs/superpowers/**` (including the ruling log and handoff), `WEBSITE-HANDOFF.md`, CONTENT-MODEL, ANALYTICS, INTEGRATIONS, DEPLOYMENT, README, `CLAUDE.md`, `contract/`, `src/messages`, `src/content/local` (all empty diffs). The brief listed only ARCHITECTURE and PRD; the drift that leaves is Minor 8.
- **Keyboard operation (Playwright, `/en/dev/gallery`):**
  - **RangeSlider:** ←/→/Home/End/PageUp move the value and update `aria-valuetext` (₺33030 → ₺33500 → ₺78000 → ₺30000 → ₺35000), with a 2 px solid focus outline.
  - **Stepper:** ↑/↓ work. Typing and bounds fail (Important 3, Minor 3).
  - **TriState:** Space checks a radio and → moves and checks. The checked chip reads `blue-safe` on `tint` with a 2 px `blue-safe` focus ring (read after the 150 ms `transition-colors`; earlier reads catch the transition start).
  - **ProgressBar:** `aria-valuenow` follows at 1/5.
  - **SearchInput:** the clear button appears, the polite status reads "Filtering by “permit”", Escape clears, and focus stays in the field after both Escape and a clear click.
  - **BottomSheet at 390 and 1440:** opening focuses Close; Tab and Shift+Tab stay trapped (Close ↔ Welder); `body` overflow is `hidden`; Escape closes and returns focus to the opener, and overflow is restored. At 390 the sheet is docked at the bottom edge at full width; at 1440 it is 384 px wide, bottom-centred.
  - **ShareRow:** no Web Share button on desktop Chromium, which is correct. With the permission granted, Copy puts the URL on the clipboard and the status reads "Link copied". The intent links carry `target=_blank rel=noopener noreferrer`.
  - **PrintButton:** `print-isolating` is on `body` at `print()` time. Under print media the button is `display:none`, the header is `visibility:hidden`, and the region is visible and absolutely positioned. The class is removed on `afterprint`.
  - **ScrollSpyToc:** the remaining-time line drops from "≈ 3 min left" to "≈ 2 min left" after scrolling.
  - **Visual captures:** the 14 sprite flags are distinct and correct, the QR renders, the map shows land, 13 arcs, pulsing dots and the Türkiye label, and the sheet docks correctly.

## Findings

### Critical
None.

### Important

**1. `LazyIsland` does not latch: when the island scrolls out of view it unmounts and all its state is lost.**
- **Where:** `src/design/islands/LazyIsland.tsx:38-44` together with `src/design/islands/useInView.ts:23`.
- **What happens:** `useInView` mirrors every observer callback (`setInView(entries[0]?.isIntersecting ?? false)`), and `LazyIsland` renders the island only while `inView`.
- **Scenario:** a visitor fills the calculator (the W13 consumer this exists for), scrolls more than the 200 px `rootMargin` past it to read the results or FAQ, and scrolls back. The island was unmounted, the fallback came back, and the remounted island starts from its initial state, so every input is lost.
- **With `ssr={false}`:** the wrapper collapses to an empty `<div>`, which causes a layout shift and scroll jump while the visitor is scrolling.
- **Confirmed by:**
  - Probe P1: after leaving view, `island present = false | fallback shown = true`; after returning, `Count 0`, where it was 1 before leaving.
  - Probe P2: `ssr=false` gives wrapper `innerHTML ""` after leaving view.
  - The W85 tests never trigger `false` after `true`, and the mock ignores the observer options.
- **Why it matters:** W85's "renders `fallback` … until in view, then `React.lazy`-loads" is one-way.
- **Fix:** latch in `LazyIsland`: once in view, stay loaded and disconnect the observer. Either add a `once` option to `useInView` or keep a latched state in `LazyIsland`. Add a leave-view test and a test that `rootMargin` reaches the observer. Probe P4 shows the `rootMargin` value is already passed correctly.

**2. Two directive-less hook modules sit behind the islands barrel, so a server component that imports `ProgressBar` through the barrel breaks `next build`. The extended W125 guard cannot see this.**
- **Where:** `src/design/islands/index.ts:11-12` re-exports `./useInView` (`import { useEffect, useRef, useState } from 'react'`, no directive) and `./useScrollProgress` (`useSyncExternalStore`, no directive). The barrel itself has no directive.
- **Why it breaks:** the frozen Produces lists `ProgressBar` in that barrel as "no hooks, no directive: usable from server components too". A WP2b server page will naturally write `import { ProgressBar } from '@/design/islands'`. That pulls both hook modules into the RSC layer.
- **Confirmed by Next 16.3.5's own SWC validator:** `transform()` with `getLoaderSWCOptions({ serverComponents: true, bundleLayer: 'rsc' })` gives:
  - `useInView.ts` → "You're importing a module that depends on `useEffect` into a React Server Component module".
  - `useScrollProgress.ts` → "…depends on `useSyncExternalStore`…".
  - The control `src/analytics/useContactClick.ts` gives exactly W125's "…depends on `usePathname`…". This is the same class of build break W125 fixed.
  - `ProgressBar.tsx`, `index.ts` and `RangeSlider.tsx` pass on their own.
- **What is not proven:** that Turbopack compiles barrel re-exports into the RSC layer. The one-build rule kept me from building it. It follows from plain ESM re-export semantics: the app `package.json` has no `sideEffects: false`, so nothing lets the bundler prune unused re-exports. Today nothing on the server imports the barrel, so the current build is green.
- **The guard's gap:** the W125 guard (`rsc-imports.test.ts:18-19,49-58`) forbids only `@/analytics/useContactClick` and `next/navigation`. The new self-check (`:74-86`) proves the walk reaches `islands/`, but the rule set cannot flag this hazard.
- **Fix, a ⚠️ ruling below:** add `'use client'` to `useInView.ts` and `useScrollProgress.ts`. Their only callers are client components, and a server import then gets an inert client reference.
  - Extend the guard: no directive-less module under `src/design/` may import a client-only React API. That is the validator's list: `useState|useEffect|useLayoutEffect|useInsertionEffect|useRef|useReducer|useSyncExternalStore|useTransition|useDeferredValue|useImperativeHandle|useOptimistic|useActionState|createContext|Component|PureComponent`.
  - Have the gallery `page.tsx` (a server component) render `<ProgressBar>` imported from `@/design/islands`, so W126's build proves the fix.

**3. `Stepper` clamps on every keystroke and cannot be emptied, so ordinary Backspace-then-type editing produces a wrong number.**
- **Where:** `src/design/islands/Stepper.tsx:39-43`. `''` returns early, so React restores the controlled value; every other keystroke is clamped immediately.
- **Scenario:** the headcount field reads 15. The visitor places the caret at the end, presses Backspace twice and types 25.
  - Result: Backspace leaves "1", the second Backspace cannot empty the field (it is restored to "1"), and typing "25" yields **125**.
  - With `min > 1` it gets worse. For `min=10`, typing "2" snaps to "10" before the second digit arrives, so "25" becomes 105.
  - Select-all then type works ("7" → 7), but mobile visitors, the calculator's audience, edit with the caret.
- **Confirmed by:** Playwright on the gallery: `End,Backspace→"1", Backspace→"1", type "25"→"125" (wanted 25)`; select-all + "600" gives 500.
- **Origin:** this is the brief's own code, faithfully transcribed. The frozen note says "value clamped to [min,max] on every change", so the fix shape needs a ruling (⚠️ 2).
- **Suggested fix:** keep a draft string, set only in event handlers so it stays R27-safe with no setState in effects. Accept `''` and out-of-range text while focused, and commit plus clamp on blur or Enter. The −/+ buttons and arrow keys keep clamping immediately.

### Minor

**1. `useInView` observes only the element that exists at the first effect** (`useInView.ts:19-28`).
- The effect is keyed on the options, not the element. The docstring's "keyed on the element" is inaccurate.
- An element attached after mount is never observed. Probe P5: 0 observers after the element appears, so `inView` stays `false` forever.
- An element remounted with a new `key` is not re-observed; the observer keeps the detached node. Probe P6: `observes new node = false | observes old detached node = true`.
- `entries[0]` should be the latest entry when records are batched.
- Without `IntersectionObserver` the value stays `false`, so `LazyIsland` would never load. That is irrelevant for target browsers but worth one line.
- `LazyIsland`'s always-rendered wrapper `<div>` is unaffected. Fix alongside Important 1 with a callback ref or a state-held node.

**2. `LazyIsland` failure and swap paths** (`LazyIsland.tsx:34-44`).
- A rejected `load()`, such as a chunk-load error after a deploy, escapes to the nearest error boundary instead of keeping the DOM-identical fallback. Probe P3: the boundary caught "ChunkLoadError"; the route's `error.tsx` would replace the page. Wrapping it as `lazy(() => load().catch(() => ({ default: () => <>{fallback}</> })))` keeps the page.
- The plain fallback → `<Suspense fallback>` switch remounts the fallback DOM, so focus or typed input in the fallback is lost. With the 200 px margin that is rarely hit.
- ARCHITECTURE's new sentence documents neither the `ssr` semantics nor load-once.

**3. `Stepper` bound handling.**
- When a stepping button disables at the bound, **keyboard focus falls to `<body>`**. Probe: Fewer ×2 from 3 → 1, then `activeElement = body`.
- Decrement is disabled before the bound when the value is off-step (`value - step < min`, `Stepper.tsx:57,78`). Probe P10: value 3, step 5, min 0 → disabled although 0 is reachable.
- Fix: use `aria-disabled` plus a no-op, or move focus to the input, and compare against `min`/`max` directly.

**4. Escape in a BottomSheet also closes the sheet** (`src/design/primitives/Dialog.tsx:35-39`).
- A `SearchInput` inside a `BottomSheet`, the design's topic picker, clears on Escape and calls `preventDefault()` (`SearchInput.tsx:34-39`). Dialog's document-level handler ignores `e.defaultPrevented` and closes the sheet as well. Probe P7: `onChange('')` and `onClose` both fired.
- Fix, one line in Dialog: `if (e.defaultPrevented) return;`.

**5. `ShareRow` copy feedback.**
- A denied, insecure-context or missing clipboard is silent: no status and no fallback (`ShareRow.tsx:45-52`, probe P8: status `""`).
- The comment "clears itself 2 s after the latest copy" (`:36-43`) is wrong. It clears 2 s after the *first* copy of a streak, and a repeat copy is not re-announced (probe P9).
- A failure message needs an optional label, which is additive to the frozen `ShareLabels` (⚠️ 4).

**6. `ProgressBar` names its value twice and speaks a different value** (`ProgressBar.tsx:33-46`).
- With `valueText`, the visible label span and `aria-label` both read the label.
- `valueText` ("1 / 5") is not `aria-valuetext`, so screen readers hear "20%" while the screen shows "1 / 5".
- Fix: `aria-valuetext={valueText}`, plus `aria-labelledby` pointing at the visible label when one is shown.

**7. Reduced motion is not instant** (`globals.css:139-148` against `:215-233`). The global rule does not neutralise `animation-delay`.
- Under `reducedMotion: 'reduce'` the 13 arcs are all undrawn at 0.15 s (`strokeDashoffset 1px`) and pop in one by one until 1.54 s. The pulse rings rest at opacity 1.
- Nothing interpolates (`running = 0`), but that is not the "arcs end drawn" end state the CSS comment promises.
- Fix: `animation-delay: 0s !important` for `.source-map__*` under reduced motion.
- Default motion and print are correct: at 5 s everything is drawn and 15 animations run; under print media `dashoffset` is 0 and the pulse is `display:none`.

**8. Docs drift outside the brief's list.** The brief listed only ARCHITECTURE and PRD, but the repo's "docs match code" rule applies. Fix round or WP2a final review, at the controller's choice.
- `CLAUDE.md:58` still says "Two generation scripts". ARCHITECTURE's "Two content-generation scripts…" block (lines 102-107) and the repo tree (`:32` `scripts/`, `:37` `src/design/`) omit `assets:*`, the new scripts, `islands/` and `assets/`. `README.md:23-30` also lists two scripts.
- ARCHITECTURE:272's LazyIsland sentence ("via a mocked-in-tests IntersectionObserver") is loosely worded.
- ARCHITECTURE:272 also says "The dev gallery … renders every island and asset". `LazyIsland`/`useInView` are not demoed, and the demo ScrollSpyToc targets `#g-a`/`#g-b` (`IslandsDemo.tsx:75-76`), which do not exist on the page (probe), so the scroll-spy cannot be seen there.

**9. `QrCode` has no guard for empty or oversized text** (`QrCode.tsx:22` → `qr.ts:25`). `QRCode.create` throws "No input text" for `''`, and "The amount of data is too big" beyond version 40-M at about 2.3 KB (confirmed by probe). Either one throws during the server render and takes the page down. Current callers pass settings-derived URLs; a guard that renders nothing or a fallback is cheap.

## ⚠️ Design items needing a controller ruling

1. **Hook-module directive (Important 2).** Choose between:
   - (a) `'use client'` on `useInView.ts` and `useScrollProgress.ts`, plus the widened W125 guard and a server-side barrel import in the gallery. **Recommended.** It departs from the brief's "no directive — a hook file…" note for `useScrollProgress`.
   - (b) Take both hooks out of the barrel. This changes the frozen barrel listing.
   - (c) A documented "server code imports `@/design/islands/ProgressBar`, never the barrel" rule plus a guard.
2. **Stepper typing model (Important 3).** The frozen note "value clamped to [min,max] on every change" is what produces wrong values. Rule on "draft while focused, clamp on blur/Enter; buttons/arrows clamp immediately" and amend `produces-final.md`.
3. **`LazyIsland` `ssr` semantics** (the implementer's deviation 4 and concern 2).
   - The reading is coherent and JSDoc-documented: `true` renders the fallback on the server and at first paint; `false` renders nothing until first observed.
   - The name, though, implies next/dynamic's meaning, where `ssr: true` server-renders the real component. The JSDoc's "(default `true`, matching `next/dynamic`)" matches the default but not the meaning.
   - Rule on: keep with an explicit doc sentence, rename (for example `renderFallbackOnServer`), or drop the prop. Settle it together with the Important 1 latch.
4. **`ShareRow` copy failure (Minor 5).** Rule on an optional `copyFailed?: string` in `ShareLabels`, additive to the frozen type, or accept the silent failure.

## The implementer's deviations — verdicts

1. **Trailer `Claude Sonnet 5`:** accept. The session attribution rule applies, as in Task 5. Note that the report misquotes the brief's trailer as "Fable 5.1"; the brief says "Claude Opus 5 (1M context)".
2. **W125 extension as a coverage self-check:** accept as literal compliance, since the walk already covered `islands/`. It is not sufficient, though: see Important 2 and ⚠️ 1.
3. **`flag-icons` 7.5.0 against `^7.2.3`:** accept. npm saves `^<resolved>`, so `package.json` reads `^7.5.0`. The lockfile pins 7.5.0, all 14 flags are present, output regenerates byte-identically, and the licence is MIT.
4. **`LazyIsland` `ssr` semantics:** ⚠️ 3.
5. **`react-hooks/refs` fix via `useState(() => lazy(load))`:** accept. It runs once per mount. Probe P4 under StrictMode shows 2 observers created, 1 live, and 1 `load()` call.
6. **Generated sizes (map 75.9 KB against the 40-70 KB estimate; sprite 61 KB):** accept. They are deterministic outputs of the brief's own scripts. The map's page weight is parked (P-1).
7. **Nine devDependencies, not "eight":** accept. The cycles' install commands are authoritative.
8. **Gallery 404 under `next start`:** accept. That is R41, and both the implementer and I curled it at 200 under `next dev`. The W126 wording needs amending (P-7).
9. **No `npm run gate`:** accept, since it is outside an implementer's remit under the memory rule.

**Concern 4 (the gallery was only checked by curl) is now closed.** The Playwright probes and screenshots verify the flags, QR, map, sheet and every island's keyboard operation.

## JS budget

| Route | Scripts | gzip-9 (W120 proxy) | Δ vs Task 5 (168,361 B) |
|---|---|---|---|
| `/` | 10 (noModule skipped) | **169,346 B** | +985 B |
| `/en` | 10 | 169,346 B | +985 B |
| `/isci-talebi` | 10 | 169,346 B | +985 B |
| `/en/hire-workers` | 10 | 169,346 B | +985 B |

- **Method:** gzip-9 over each route's `<script src>` set from `next start`, excluding the `noModule` polyfill.
- **No leaks:** no island, map, flag or QR code reaches these routes. Marker search found no `print-isolate`, `source-map__`, `remainingSingular`, `qrcode` or `wa.me/?text`. The only `IntersectionObserver` hits are Next's Link prefetch and the existing `Stat` count-up.
- **Traceable delta:** about 220 B gz sits in the shared chrome chunk `0i1-dg_kz7jny.js`.
  - `XIcon`/`LinkIcon` add about 177 B. Turbopack keeps every export of `icons.tsx`, so island-only icons ship on every route.
  - The Dialog sheet branch adds about 43 B.
  - The remaining roughly 765 B cannot be attributed without a Task 5 build (chunk re-layout).
- **Headroom:** 35,454 B to the 204,800 B ceiling, and still below the 194,560 B lazy-pass threshold.

## Parked (out of Task 6's scope, for the WP2a final review)

- **P-1 SourceMap document weight.** It is a server component and ships no JS. But its `<svg>` is 74,333 B raw / 23,006 B gz, and it appears **twice** per page (SSR HTML plus the RSC flight payload). That is about 46 KB gz of document weight on Homepage and Hire Workers. The page tasks should decide: coarser paths, a tighter crop, a per-locale static SVG file, or below-the-fold deferral.
- **P-2 Dialog (WP1 primitive).**
  - The background is not `inert`; only `aria-modal` applies.
  - `FOCUSABLE` includes disabled `select`/`textarea`.
  - The `body{overflow:hidden}` scroll lock does not stop iOS Safari touch scrolling.
- **P-3 `icons.tsx` export cost.** Every export ships on every route (see JS budget), so island-only icons could live beside their island if the budget tightens.
- **P-4 `/brand/flags.svg` caching.** It is 61,599 B raw / 20,786 B gz and not content-hashed, so it is revalidated (`max-age=0`) on each navigation. A hashed name with an immutable header is a later option.
- **P-5 `ScrollSpyToc` templates.** The `{n}` token collides with ICU. A server caller must read them with `t.raw()`, or next-intl reports a FORMATTING_ERROR and returns the key. Tell the blog task.
- **P-6 Client-only function props.** `LazyIsland` (`load`) and `ScrollSpyToc.remainingLabel` take functions, so server pages need a thin `'use client'` wrapper. The calculator and blog tasks should plan for it.
- **P-7 W126 wording.** "`next start` curl of `/dev/gallery` … all 200" contradicts R41's production 404. Amend it to "gallery under `next dev`".
- **P-8 TOC scroll offset.** `scroll-margin-top` on TOC target headings under the sticky header is the page's job, matching `offsetPx = 96`.
