# Task 6 report — Client islands + build-time assets (T0d, W85)

**Status: DONE.** 8 commits on `wp2/foundation` (BASE `84aa6e3` → HEAD `2d87575`), `VERIFY_LOW` (`typecheck && lint && format && vitest --maxWorkers=1`) green before every commit. Final suite: **97 files / 513 tests** (BASE 81/469: +16 files, +44 tests). The one W126 `npm run build` **succeeded**; `next start` served `/` and `/en` at 200 (the gallery 404s under `next start` by design, R41 — see Deviations); one `next dev` pass served `/dev/gallery`, `/en/dev/gallery`, `/` and `/en` all at 200 with zero errors in the dev log, and the `nextjs-agent-rules` block it appended to `CLAUDE.md` was reverted. Nothing pushed, no stash used, no `main` touched, no BASE commit rewritten. No process of mine is left running (`ps` check at the end).

## Commits

| SHA | Subject |
|---|---|
| `0695824` | feat(islands): RangeSlider, Stepper, TriState, ProgressBar — real inputs, labelled, clamped |
| `00032a4` | feat(islands): BottomSheet (Dialog sheet variant) and SearchInput |
| `557aafa` | feat(islands): ScrollSpyToc, ShareRow, PrintButton (+print isolation CSS), useScrollProgress |
| `0f23dbb` | feat(islands): useInView + LazyIsland (W85) |
| `0c10272` | feat(assets): upper-case source-country codes pinned to T0b (W40), local flag sprite (13 + TR) from flag-icons, Flag component |
| `d189326` | feat(assets): sourcing map pre-rendered at build time (d3-geo/world-atlas devDeps, 13 countries + LK, upper-case codes, no runtime fetch) |
| `5fc58b0` | feat(assets): local server-side QR (qrcode → SVG string), QrCode server component |
| `2d87575` | feat(assets): brand files (logo, İŞKUR mark, Play glyph), BRAND sizes, gallery islands demo; docs § Assets |

`0f23dbb` is the W85 addition (`useInView`/`LazyIsland`), landed as its own commit between the brief's Cycle 3 and Cycle 4; the other 7 commits map one-to-one onto the brief's 7 cycles.

## What was implemented

- **Cycle 1 (`0695824`).** `src/design/islands/{RangeSlider,Stepper,TriState,ProgressBar}.tsx` + tests, `index.ts` (first version). Landed verbatim from the brief. Extended `src/design/blocks/__tests__/rsc-imports.test.ts` (W125 addition) with a self-check naming `ProgressBar.tsx` (plain, swept) vs `RangeSlider.tsx` (`'use client'`, not swept) — the sweep logic itself already recurses all of `src/design/`, so no logic change was needed, only the explicit assertion (see Deviations).
- **Cycle 2 (`00032a4`).** `Dialog` gains `variant?: 'center' | 'sheet'` (additive). `BottomSheet` (Dialog sheet wrapper with a labelled close button), `SearchInput` (real `<input type="search">`, clear button, polite `role="status"` result line). Landed verbatim from the brief.
- **Cycle 3 (`557aafa`).** `useScrollProgress` (`useSyncExternalStore`, 0 on server). `ScrollSpyToc` — landed from the brief, plus the W85 addition's `remainingSingular`/`remainingPlural` optional string props beside `remainingLabel` (ICU-free `{n}`-template path for a server caller that cannot pass a function prop; `remainingLabel` wins when given, else the singular template is used for exactly one minute left, the plural template otherwise). `ShareRow`, `PrintButton` + print-isolation CSS. `icons.tsx` gains `XIcon`/`LinkIcon`.
- **W85 addition (`0f23dbb`).** `useInView<T extends Element>(options?): [ref, inView]` (one `IntersectionObserver` per element, created/disconnected by an effect, SSR-safe: `inView` starts `false` on server and on the first hydrating client render) and `LazyIsland` (`'use client'`; gates when `load()` first runs behind `useInView`, since `React.lazy` only calls its loader on the wrapped component's first render; `ssr` toggles whether `fallback` renders eagerly, taking part in the very first paint, or only once the element has actually been observed — see Deviations for why this reading was chosen). Both added to `src/design/islands/index.ts`.
- **Cycle 4 (`0c10272`).** `src/design/assets/source-map-codes.ts` (`SOURCE_MAP_CODES`, `SOURCE_MAP_POINTS`, `TURKIYE_POINT`, `sourceMapLabels`, `isSourceMapCode`), `flag-codes.ts` (`FLAG_CODES`, `isFlagCode`), `scripts/build-flags.ts` (`buildFlagSprite`), `src/design/Flag.tsx`. Installed `flag-icons@^7.2.3` (resolved to `7.5.0`, the latest satisfying that range — see Deviations). Generated `public/brand/flags.svg` (61 KB, 14 symbols) via the new `assets:flags` script. `.gitattributes` created. Landed verbatim from the brief.
- **Cycle 5 (`d189326`).** `scripts/build-source-map.ts` (`buildSourceMap`, `VIEWBOX`) runs d3-geo's Mercator `fitExtent` once over `world-atlas`'s `countries-110m.json`, emits `src/design/assets/source-map.generated.tsx` (75.9 KB — brief estimated 40-70 KB; see Deviations) and `src/design/assets/source-map.ts` (the import door). Installed `d3-geo`, `@types/d3-geo`, `topojson-client`, `@types/topojson-client`, `@types/topojson-specification`, `@types/geojson`, `world-atlas` as devDependencies. `globals.css` gains `.source-map__arc`/`.source-map__pulse`. `.prettierignore` and `eslint.config.mjs`'s `globalIgnores` gain the `*.generated.tsx` glob.
- **Cycle 6 (`5fc58b0`).** `src/lib/qr.ts` (`qrSvg`), `src/design/QrCode.tsx`. Installed `qrcode@^1.5.4` (dependency) and `@types/qrcode@^1.5.5` (devDependency). Landed verbatim from the brief.
- **Cycle 7 (`2d87575`).** `scripts/fetch-brand.sh` fetched `public/brand/logo.png` (742×146) and `iskur.png` (320×320) from the live site once (confirmed by `file`); `public/brand/google-play.svg` (design's inline glyph); `src/design/assets/brand.ts` (`BRAND`). Gallery: `IslandsDemo.tsx` (new), `page.tsx` edited (6 new imports, `sourceCountries`, two new `Block`s). `docs/ARCHITECTURE.md` (new islands paragraph, `Pages:` fragment replaced, new § Assets section) and `docs/PRD.md` § 11 (two fragment replacements) updated, sentence-anchored per W45.

## TDD evidence per cycle

`VERIFY_LOW` = `npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`.

1. **Cycle 1.** RED: `npx vitest run` on the 5 touched files → 4 "Failed to resolve import" (RangeSlider/Stepper/TriState/ProgressBar) + 1 assertion failure in the new rsc-imports self-check (`serverSide` didn't yet contain the not-yet-created `ProgressBar.tsx`). GREEN: 5 files / 12 tests. VERIFY_LOW: 85 files / 479 tests (BASE 81/469), typecheck/lint/format clean.
2. **Cycle 2.** RED: Dialog's new sheet case failed (`expected 'max-h-[90vh] …' to contain 'rounded-t-hero'`); BottomSheet/SearchInput failed to resolve their imports. GREEN: 7 files / 16 tests. VERIFY_LOW: 87 files / 484 tests, typecheck/lint/format clean.
3. **Cycle 3.** RED: 3 files failed to resolve imports (ScrollSpyToc/ShareRow/PrintButton) — this run included the brief's 2 ScrollSpyToc cases plus the 3 W85 remainingSingular/remainingPlural cases written alongside them. GREEN: 9 files / 21 tests. VERIFY_LOW: 90 files / 492 tests, typecheck/lint/format clean.
4. **W85 addition.** RED: `useInView.test.tsx`/`LazyIsland.test.tsx` failed to resolve imports. GREEN (first pass): 11 files / 27 tests. `npm run lint` then failed on `LazyIsland.tsx`: `react-hooks/refs` — "Cannot access ref value during render" on the `if (!lazyRef.current) lazyRef.current = lazy(load)` lazy-init idiom. Fixed by switching to `useState<ComponentType<P>>(() => lazy(load))`; re-ran lint (clean), typecheck (clean), and the islands suite (still 11/27 green — the fix does not change behaviour). VERIFY_LOW: 92 files / 498 tests, typecheck/lint/format clean.
5. **Cycle 4.** RED: all 3 files failed to resolve imports (`../flag-codes`, `../source-map-codes`, `./build-flags`, `../Flag`). GREEN: 3 files / 9 tests (4 + 3 + 2, matching the brief). Sanity: `grep -c '<symbol id="flag-'` → 14, `grep -c 'id="flag-PK"'` → 1, `grep -c 'id="flag-pk"'` → 0. VERIFY_LOW: 95 files / 507 tests, typecheck/lint/format clean.
6. **Cycle 5.** RED: `Failed to resolve import "./build-source-map"`. GREEN (first pass, no follow-up needed): 3/3. Sanity: `grep -c data-country` → 14, `grep -c 'data-country="pk"'` → 0. `npm run typecheck` accepted the generated file's inline `style={{ animationDelay: '…' }}` objects with no cast, as the brief predicted. VERIFY_LOW: 96 files / 510 tests, typecheck/lint/format clean.
7. **Cycle 6.** RED: `Failed to resolve import "./qr"` (the `qrcode` import itself resolved fine — only the door module was missing). GREEN (first pass): 1 file / 3 tests. VERIFY_LOW: 97 files / 513 tests, typecheck/lint/format clean.
8. **Cycle 7.** No unit test (dev-only route, static files). Static checks: `test -s public/brand/logo.png && test -s public/brand/iskur.png && test -s public/brand/google-play.svg` → `ok`; `git ls-files | grep 'dev/gallery/page.tsx'` → exactly one path. RED reproduced by moving `IslandsDemo.tsx` out of the gallery folder and running `npm run typecheck`: `error TS2307: Cannot find module './IslandsDemo'` at `page.tsx(36,29)`, matching the brief's predicted red step exactly; restored the file and typecheck passed (GREEN). VERIFY_LOW: 97 files / 513 tests (unchanged — no new tests this cycle), typecheck/lint/format clean.

## Build (W126)

- **Build.** `NODE_OPTIONS=--max-old-space-size=4096 npm run build` exited 0: "✓ Compiled successfully", TypeScript finished, 13/13 pages generated including `/tr/dev/gallery` and `/en/dev/gallery`. The build appended nothing to `CLAUDE.md` (only `next dev` does that).
- **`npm run start`** (backgrounded, then killed): `/` → **200**, `/en` → **200**. Per the MEMORY RULE, the gallery was not curled under `next start` — it 404s there by design (R41's production guard), a gotcha Task 5's report already recorded as a deviation/concern (`next start` always runs as production).
- **One `next dev` pass** (backgrounded, curled, then killed immediately): `/dev/gallery` → **200**, `/en/dev/gallery` → **200**, `/` → **200**, `/en` → **200**; zero error/warning lines in the dev log (only the expected `GET … 200` request lines and the one-time "Generated CLAUDE.md for AI agents" notice). That pass appended the `<!-- BEGIN:nextjs-agent-rules -->` block to `CLAUDE.md`; reverted with `git checkout -- CLAUDE.md` (confirmed clean by `git diff --stat CLAUDE.md` afterwards).
- Both servers were stopped one at a time (never run together) and port 3000 was confirmed free after each. No Playwright was run (the brief does not ask for one for this task).

## Files changed

`git diff --shortstat 84aa6e3..HEAD` → **58 files changed, 3092 insertions(+), 40 deletions(-)**. Every file the brief's Files list names was created or modified; the only files outside that list are the ones `task-6-additions.md` (W85, W125) required and `package-lock.json` (an unavoidable side effect of every `npm install`, and explicitly `git add`-ed in the brief's own Cycle 4/5/6 commit commands).

- **Created (44):** the 9 island source files + `index.ts` (`RangeSlider`, `Stepper`, `TriState`, `ProgressBar`, `BottomSheet`, `SearchInput`, `ScrollSpyToc`, `ShareRow`, `PrintButton`, `useScrollProgress`) + their 9 tests; **+ W85 additions** `useInView.ts`, `LazyIsland.tsx` + 2 tests (11 island source files + 11 tests, 22 total under `src/design/islands/`); `src/design/assets/{source-map-codes,flag-codes,brand,source-map,source-map.generated}.ts(x)` + `__tests__/source-map-codes.test.ts` (6); `src/design/Flag.tsx` + test, `src/design/QrCode.tsx` (3); `src/lib/qr.ts` + test (2); `scripts/{build-flags,build-source-map}.ts` + tests, `scripts/fetch-brand.sh` (5); `public/brand/{flags.svg,google-play.svg,logo.png,iskur.png}` (4); `.gitattributes` (1); `src/app/[locale]/(site)/dev/gallery/IslandsDemo.tsx` (1).
- **Modified (14):** `src/design/primitives/Dialog.tsx` + its test; `src/design/chrome/icons.tsx`; `src/app/globals.css`; `.prettierignore`; `eslint.config.mjs`; `package.json`, `package-lock.json`; `src/app/[locale]/(site)/dev/gallery/page.tsx`; `docs/ARCHITECTURE.md`, `docs/PRD.md`; `src/design/blocks/__tests__/rsc-imports.test.ts` (W125 addition, not in the brief's original Modify list).
- Nothing from `docs/superpowers/handoff-2026-09-25/**`, `docs/superpowers/plans/2026-09-20-wp2-rulings.md`, `WEBSITE-HANDOFF.md`, or `produces-final.md` was touched (confirmed by an empty `git diff --stat` against each). `src/messages/{tr,en}.json` were **not** touched — no real page consumes an island with real copy yet in this task; every label the gallery demo uses is hard-coded English, matching the brief's own `IslandsDemo.tsx` and R41 (dev-only route).

## Deviations

1. **Commit trailer is `Claude Sonnet 5`, not the brief's `Claude Fable 5.1`.** The session's system-reminder attribution rule names the running model and states it replaces the brief's own convention; Task 5's report recorded the identical deviation (its trailer was `Claude Opus 5.5`, not `Claude Fable 5.1`) for the same reason.
2. **W125 rsc-imports guard extension is a self-check, not a sweep-logic change.** `modulesUnder(DESIGN)` in `src/design/blocks/__tests__/rsc-imports.test.ts` already recurses every subdirectory of `src/design/` (not just `blocks/`), so a non-client module under `src/design/islands/` was already included in `serverSide` before this task touched the file. The addition is read as "make that coverage explicit," so Cycle 1 added one more assertion (mirroring the existing `ContactCta`/`StickyCtaBar` self-check) naming an island file instead of changing the walk itself.
3. **`flag-icons` resolved to `7.5.0`, not the brief's pinned `7.2.3`.** `npm install -D flag-icons@^7.2.3` installs the latest version satisfying that caret range at install time; `7.5.0` does. This is the expected behaviour of the brief's own install command (a range, not an exact pin), not a departure from it. All 14 flag files it ships resolved and rendered correctly.
4. **`LazyIsland`'s `ssr` prop semantics are an interpretation, not a literal spec.** `task-6-additions.md` gives only the prop's shape (`ssr?: boolean`) with no behavioural detail. Chosen reading: `ssr` (default `true`, matching `next/dynamic`'s own default) controls whether `fallback` renders eagerly — i.e. takes part in the very first paint / would appear in server-rendered HTML — or only once the wrapping element has actually been observed by `IntersectionObserver` (`ssr={false}`). A literal "server-only" gate (render `null` until the client has mounted) was considered and rejected: React Testing Library's `render()` performs a full client render, not a hydration pass, so `getServerSnapshot`/a mount-effect flag would already read as "mounted" before any assertion runs, making that behaviour untestable in this suite and indistinguishable from always-true. The chosen reading is fully testable (see `LazyIsland.test.tsx`'s third case) and defensible against the addition's own wording ("renders fallback … until in view").
5. **`react-hooks/refs` fix in `LazyIsland.tsx`.** The natural "memoize `lazy(load)` once" idiom (`if (!ref.current) ref.current = lazy(load)`) is flagged by this repo's `eslint-plugin-react-hooks` as "Cannot access ref value during render." Fixed with `useState(() => lazy(load))`'s lazy initializer, which computes once without ever reading a ref during render — behaviourally identical, lint-clean.
6. **Generated file sizes are outside the brief's estimated ranges, on the high side.** `public/brand/flags.svg` is 61 KB (brief: "expect ~60-110 KB" — within range). `src/design/assets/source-map.generated.tsx` is 75.9 KB (brief: "expect 40-70 KB" — 6 KB over). Both are deterministic outputs of the brief's own scripts run against the pinned package versions available today; no manual editing of either file was done, and every test the brief specifies for both (including the "is deterministic" cases) passes. Not treated as a defect.
7. **Package.json devDependency count.** The brief's Files section says "eight `devDependencies` entries"; the cycles' own `npm install` commands add nine (`flag-icons`, `d3-geo`, `@types/d3-geo`, `topojson-client`, `@types/topojson-client`, `@types/topojson-specification`, `@types/geojson`, `world-atlas`, `@types/qrcode`) plus one `dependencies` entry (`qrcode`). Followed the cycles' explicit install commands (which are unambiguous) over the summary count in the Files header.
8. **Gallery `next start` curls are 404 by design (R41), not 200**, matching Task 5's own recorded deviation for the identical gotcha; see Build (W126) above for what was actually curled and why.

## Produces additions

Beyond the brief's frozen "Produces" block (all present and unchanged — see Self-review) and its own "Produces — deviations" section (all already accounted for by the brief itself, not new deviations of mine):

- **W85 (`task-6-additions.md`):** `src/design/islands/useInView.ts` — `useInView<T extends Element>(options?: IntersectionObserverInit): [RefObject<T | null>, boolean]`. `src/design/islands/LazyIsland.tsx` — `LazyIsland<P extends object>({ load, props, fallback, rootMargin = '200px', ssr = true })`, `'use client'`. Both exported from `src/design/islands/index.ts`.
- **W85:** `ScrollSpyToc` gains optional `remainingSingular?: string` / `remainingPlural?: string` props beside `remainingLabel`; each carries the literal token `{n}`; `remainingLabel` takes precedence when given.
- The W125 rsc-imports guard (`src/design/blocks/__tests__/rsc-imports.test.ts`) now carries an explicit self-check naming an island file, in addition to its existing `ContactCta`/`StickyCtaBar` one.

## Self-review

Re-read the brief's frozen "Produces" block and the `task-6-additions.md` additions against the committed files:

- [x] `RangeSlider`, `Stepper`, `TriState`, `ProgressBar` (no directive/hooks — server-usable), `BottomSheet`, `SearchInput`, `ScrollSpyToc` (+ W85 props), `ShareRow`, `PrintButton`, `useScrollProgress` — every name, signature and behavioural note (aria-valuetext, clamping, focus trap via `Dialog`, Web Share as a post-hydration fact, print isolation) matches.
- [x] `Dialog` — `variant?: 'center' | 'sheet'`, additive, `'center'` unchanged (the gallery's pre-existing `DialogDemo` still renders with no `variant` passed).
- [x] `icons.tsx` — `XIcon`, `LinkIcon` appended after Task 5's `ClockIcon`, using the file-local `IconProps`/`base`/`stroke` exactly as given.
- [x] `source-map-codes.ts` — `SOURCE_MAP_CODES` (13, upper-case, source-map.js's 12 + LK order), `SourceMapCode`, `isSourceMapCode`, `SOURCE_MAP_POINTS`, `TURKIYE_POINT`, `sourceMapLabels` (throws outside production on a missing code, falls back to the code in production) — all present, pinned to the real `bundle.tr.json` by the cross-check test.
- [x] `source-map.ts` — re-exports `SourceMap`/`SOURCE_MAP_MARKERS`/`SOURCE_MAP_VIEWBOX`/`SourceMapProps` from the generated file and the codes module; pages import from here, never from `.generated.tsx` directly.
- [x] `flag-codes.ts` — `FLAG_CODES` (= source countries + `'TR'`, 14), `FlagCode`, `isFlagCode`.
- [x] `Flag.tsx` — `<svg><use href="/brand/flags.svg#flag-<CODE>"/></svg>`, 4:3, decorative unless `label`.
- [x] `src/lib/qr.ts` — `QrOptions`, `qrSvg(text, options?)`, no `server-only` import (unit-testable, like `content/pure.ts`).
- [x] `QrCode.tsx` — `'server-only'`, `{ text, label, size = 86, className? }`.
- [x] `brand.ts` — `BRAND.{mark,logo,iskur,googlePlay,flags}` with the exact paths/sizes given.
- [x] `package.json` scripts — `assets:brand`, `assets:flags`, `assets:map`, all additive, alphabetically grouped as the brief's own cycles left them.
- [x] CSS — `.source-map__arc`/`.source-map__pulse` + print end-states; `body.print-isolating`/`.print-isolate`/`.print-hidden`.
- [x] Sprite ids — `<symbol id="flag-<CODE>" viewBox="0 0 640 480">`, one per `FLAG_CODES` entry, upper-case only (confirmed by `grep`).
- [x] W85 — `useInView`, `LazyIsland`, `ScrollSpyToc.remainingSingular/remainingPlural` — present, tested, exported.
- [x] Rules: every new island/asset file's label props are supplied by the caller, never hard-coded inside the component (W9/W23) — the only hard-coded English is in the dev-only `IslandsDemo.tsx` (R41, matching the brief's own given code). No `src/**` file imports `design-package/**` or `src/content/local/*` (confirmed by `grep`; the only "design-package" text in `src/**` is inside comments). `contract/website-bundle.v1.ts` untouched. No `src/content/local/*.json` hand-edited. `src/messages/{tr,en}.json` untouched (no real page consumes these islands yet). W119/W122 — no new file pairs a bare `hidden` utility with an unprefixed display utility on the same class string (checked by `grep`; the only `hidden`-containing strings are `print-hidden`, `overflow-hidden`, `aria-hidden`, and one `[&::…]:hidden` arbitrary-variant selector, none of which is the guarded anti-pattern). W40 — every code upper-case ISO2 everywhere, pinned by test. Controller-owned docs untouched (confirmed by empty `git diff --stat`).

## Concerns

1. **`source-map.generated.tsx` (75.9 KB) is larger than the brief's 40-70 KB estimate.** The land-path density from `world-atlas@2.0.2`'s `countries-110m.json` at the pinned `digits(1)` precision produced a file about 6 KB over the high end of the brief's range. All of the cycle's own tests (including the "is deterministic" and path-count assertions) pass against it; flagged here only because the brief named a specific range.
2. **`LazyIsland`'s `ssr` behaviour is my interpretation of an underspecified addition** (see Deviations #4). If a later task expected a literal "skip SSR entirely / render null pre-hydration" semantic (`next/dynamic(..., { ssr: false })`'s actual meaning), this component's `ssr={false}` path does something adjacent but not identical: it still lets the observed wrapper appear once the client has confirmed intersection, rather than depending on any server/hydration distinction. No current consumer of `LazyIsland` exists yet in this task, so nothing downstream depends on the exact semantic today.
3. **`npm run gate`** (Playwright + axe + Lighthouse against a preview URL) is out of scope for an implementer per the MEMORY RULE and was not run.
4. **The gallery's real-copy wiring is unverified beyond the `next dev` curl.** The `next dev` pass confirmed both gallery routes render at 200 with no console/server errors, and the QR/Flag/SourceMap block reads live `sourceCountries` rows (visually unverified beyond the curl — no screenshot was taken, consistent with the MEMORY RULE's "no Playwright unless required" instruction).

## Process check

```
ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium' | grep -v grep
```

returned only the unrelated, pre-existing `ChromeRemoteDesktopHost` system process — no `vitest`/`next`/`playwright`/`chromium` process of mine, and port 3000 was confirmed free after both the `next start` and `next dev` passes were stopped.

## Fix round 1

**Status: DONE_WITH_CONCERNS.** 9 commits on `wp2/foundation` (BASE `bf2ad2c` → HEAD `bab7863`), one per numbered brief item. The low-memory verify (`npm run typecheck && npm run lint && npm run format && NODE_OPTIONS=--max-old-space-size=4096 npx vitest run --maxWorkers=1`) was green before every commit. Final suite: **99 files / 548 tests** (BASE 97/513: +2 files, +35 tests). The one W126 build **succeeded**. `next start`: `/` **200**, `/en` **200**. `next dev`: `/dev/gallery` **200**, `/en/dev/gallery` **200**, and the dev log had no errors. The `nextjs-agent-rules` block was reverted. Nothing was pushed, no stash was used, `main` was not touched and no BASE commit was rewritten. No process of mine is running.

`git diff --shortstat bf2ad2c..HEAD` → 27 files changed, 921 insertions(+), 120 deletions(-).

| # | SHA | Subject | Verify (vitest) |
|---|---|---|---|
| 1 | `02379c9` | fix(islands): every islands module is a client module; RSC guard widened (W130, review I2) | 97 files / 516 tests |
| 2 | `8887ee0` | fix(islands): Stepper types through a draft and commits on blur/Enter (W131, review I3 + Minor 3) | 97 / 524 |
| 3 | `dca0f5e` | fix(islands): LazyIsland loads once and stays mounted; useInView tracks its element (W132, review I1 + Minor 1/2) | 97 / 530 |
| 4 | `eb4c366` | fix(primitives): Dialog leaves an already-handled Escape to the control inside (review Minor 4) | 97 / 532 |
| 5 | `a4111b9` | fix(islands): ShareRow announces a failed copy and re-announces a repeat copy (W133, review Minor 5) | 97 / 537 |
| 6 | `0aa0a46` | fix(islands): ProgressBar speaks its visible value and is named by its visible label (review Minor 6) | 97 / 539 |
| 7 | `cd9d0b7` | fix(assets): SourceMap arcs render drawn at once under reduced motion (review Minor 7) | 98 / 543 |
| 8 | `11436b1` | fix(assets): QrCode renders nothing for empty or oversized text instead of throwing (review Minor 9) | 99 / 548 |
| 9 | `bab7863` | docs: generation-script set, repo tree and gallery claims match the code (review Minor 8) | 99 / 548 |

At every commit typecheck, lint and format were clean ("TLF_OK"), and every vitest run had 0 failures.

### Per item

**1. I2, W130: directives and the widened guard (`02379c9`).**
- **Change:**
  - `'use client'` is now line 1 of `src/design/islands/useInView.ts`, `useScrollProgress.ts` and `ProgressBar.tsx`. These were the only three non-test island modules without it; `ProgressBar.tsx:26-28` gained a docblock.
  - The barrel `index.ts` stays directive-less: it is a pure re-export file.
  - `src/design/blocks/__tests__/rsc-imports.test.ts`:
    - `ISLANDS`/`BARREL`/`CLIENT_ONLY_REACT` at `:25-42`.
    - `clientOnlyReactApis()` at `:88`. It parses named, aliased and type-only imports and re-exports from `react`, `X.useY` member reads through a default or namespace import, and `export *`; comments are ignored.
    - The islands self-check `:148` now names the barrel as the swept plain module.
    - (a) `:167`: every island module except the barrel starts with `'use client'`, and every statement in the barrel is an `export … from` re-export.
    - Parser self-check `:185`.
    - (b) `:200`: no directive-less module under `src/design/` imports W130's list.
  - Gallery `page.tsx:42` imports `ProgressBar` from `@/design/islands` and renders it in the Islands block (`:189`).
  - ARCHITECTURE:277 islands paragraph: one W130 sentence.
- **RED** (`rsc-imports.test.ts`, 2 failed / 4 passed):
  - (a) got `["src/design/islands/ProgressBar.tsx","src/design/islands/useInView.ts","src/design/islands/useScrollProgress.ts"]`.
  - (b) got `["src/design/islands/useInView.ts → useEffect", "… → useRef", "… → useState", "src/design/islands/useScrollProgress.ts → useSyncExternalStore"]`.
- **GREEN:** 6/6, and the islands suite 12 files / 33 tests.
- **Build proof:** the W126 build compiled and prerendered both gallery routes with the barrel import. The dev HTML carries the server-rendered bar: "Server-rendered progress (barrel import)", `aria-valuetext="2 / 5"`.

**2. I3 + Minor 3, W131: Stepper (`8887ee0`).**
- **Change** (`src/design/islands/Stepper.tsx`):
  - `draft` state (`:43`), set only in `onChange`/`onBlur`/`onKeyDown` handlers.
  - `parse` rounds and clamps. `current` (`:51`) = the typed number, else `value`.
  - `commit` (`:58`): an empty or unparsable field reverts to the last committed value; otherwise it clamps and calls `onChange` only when the value changed. It runs on blur (`:104`) and on Enter.
  - ArrowUp/ArrowDown call `preventDefault` and step with an immediate clamp (`:65-70`).
  - The buttons use `aria-disabled={atMin || undefined}` / `atMax` (`:86`, `:111`) with a no-op guard. The bounds are `current <= min` / `>= max`. `BTN` uses `aria-disabled:` styling instead of `disabled:` (`:21`).
- **Tests** (`__tests__/Stepper.test.tsx`, 11 cases): the three originals adapted to aria-disabled and commit-on-blur, plus these scenarios:
  - 15 → End, Backspace ×2, "25", blur → 25.
  - `min=10`: "2", "5" → 25.
  - clear + blur → the previous value.
  - select-all "600" with max 500 → 500 on blur.
  - Enter commits and keeps focus.
  - ArrowUp at max stays max; ArrowDown → 499.
  - focus stays on a button at its bound, and the button is a no-op.
  - value 3 / step 5 / min 0 → 0.
- **RED:** 11/11 failed on the old code, including "Backspace ×2" → received `1` (expected empty), select-all "600" → received `500` while typing, ArrowDown → stayed 500, and value 3 → `onChange` never called with 0.
- **GREEN:** 11/11.

**3. I1 + Minor 1 + Minor 2, W132: LazyIsland and useInView (`dca0f5e`).**
- **Change, `useInView.ts`:**
  - `useInView<T>(options?: IntersectionObserverInit & { once?: boolean }): [RefCallback<T>, boolean]` (`:13-15`).
  - The node is held in state and the state setter is the callback ref (`:16`, `:45`).
  - The effect is keyed on `[node, latched, once, root, rootMargin, threshold]` (`:42`).
  - Entries fold to the latest record (`:29`).
  - `once` latches and disconnects (`:33`). After the latch there is no re-observe (`latched` short-circuits at `:26`).
- **Change, `LazyIsland.tsx`:**
  - Props are `{ load, props, fallback, rootMargin? }` (`:5-13`); `ssr` is removed.
  - `useInView({ rootMargin, once: true })` (`:38`).
  - `lazy(() => load().catch(() => fallbackModule(fallback)))` (`:43`, helper `:17`).
  - The fallback renders until the latch, then `<Suspense fallback={fallback}>`.
- **Change, gallery:** `IslandsDemo.tsx:106-110` renders a `LazyIsland` that loads the new `LazyCounter.tsx` through a real `import()`, with a DOM-identical fallback.
- **Change, docs:** ARCHITECTURE:277 LazyIsland/useInView sentence reworded (load-once, fallback semantics, no `ssr`).
- **Test mocks:** both test files' mocked `IntersectionObserver` now records options and delivers only while observing.
- **Tests:**
  - `LazyIsland.test.tsx`: leave-view keeps a counter island at "Count 1" and the observer is disconnected; `rootMargin` reaches the observer (`200px` default, `480px`); a rejected `load()` keeps the fallback, the boundary's `componentDidCatch` is never called and "error boundary" never renders.
  - `useInView.test.tsx`: late mount; re-key (only the new node is observed); batch folding (`true,false` → false, `false,true` → true); `once` latch and disconnect, with no new observer after the latch.
- **RED** (6 failed / 6 passed):
  - leave-view: "Count 1" gone at `LazyIsland.test.tsx:102`.
  - rejected load: the boundary caught `Error: ChunkLoadError`.
  - late mount: no observer was ever created.
  - re-key: the new node was not observed.
  - fold: `entries[0]` was used.
  - once: still observing (1 element).
  - The `rootMargin` test passed on the old code too, since the value was already forwarded (review probe P4), so it is coverage only.
- **GREEN:** 12/12.

**4. Minor 4: Dialog Escape (`eb4c366`).**
- **Change:** `src/design/primitives/Dialog.tsx:39`: `if (e.defaultPrevented) return;` inside the Escape branch only; Tab trapping is unchanged.
- **Tests:**
  - `Dialog.test.tsx`: an input that `preventDefault`s Escape → `onClose` is not called.
  - `BottomSheet.test.tsx`: the review's scenario. A SearchInput inside a BottomSheet: the first Escape clears the field and the sheet stays open; the second Escape closes it.
- **RED:** 2 failed, `onClose` called once (`BottomSheet.test.tsx:44`, `Dialog.test.tsx:68`).
- **GREEN:** 9/9 across Dialog, BottomSheet and SearchInput.

**5. Minor 5, W133: ShareRow (`a4111b9`).**
- **Change** (`src/design/islands/ShareRow.tsx`):
  - `ShareLabels.copyFailed?: string` (`:15`).
  - The status state is `{ text, failed, seq } | null` (`:38`). The effect is keyed on the status object, so every copy restarts the 2 s timer (`:45`).
  - `announce()` (`:53`): the catch path announces `labels.copyFailed` (`:60`). Without the label it clears the line (silent).
  - The text renders in `<span key={status.seq}>` (`:116`), so a repeat copy mounts a fresh node.
  - The failure line uses `text-text-secondary`, not the success green (`:113`).
  - The comment is corrected.
  - The gallery ShareRow passes `copyFailed` (`IslandsDemo.tsx:95`).
- **Tests** (`ShareRow.test.tsx`, 7 cases):
  - announced when the clipboard refuses and when it is missing;
  - silent without the label;
  - with fake timers (`setTimeout`/`clearTimeout` only), the status survives 2.5 s after the first copy (1 s after the latest) and is empty 2 s after the latest;
  - a repeat copy puts a new node in the live region.
- **RED** (4 failed): "Unable to find an element with the text: Could not copy the link" ×2; the status was empty at `ShareRow.test.tsx:113` (cleared 2 s after the first copy); "expected Text{…} not to be Text{…}" (the same text node was reused). The silent case passed on the old code (coverage only).
- **GREEN:** 7/7.

**6. Minor 6: ProgressBar (`0aa0a46`).**
- **Change** (`src/design/islands/ProgressBar.tsx`):
  - `useId()` (`:37`) on the visible label span.
  - With `valueText`, the bar gets `aria-labelledby` pointing at the visible label and no `aria-label`; without it, `aria-label={label}` as before (`:50-51`).
  - `aria-valuetext={valueText}` (`:55`).
  - The prop docs are updated.
- **Tests:** labelled by the visible text, with `aria-valuetext="1 / 5"` and no `aria-label`; without `valueText`, `aria-label` and no labelledby/valuetext.
- **RED:** 1 failed (no `aria-valuetext`). The no-valueText case passed on the old code (coverage only).
- **GREEN:** 4/4.

**7. Minor 7: reduced motion for the map (`cd9d0b7`).**
- **Change:** `src/app/globals.css:238-246`, a new reduced-motion block at the end of the SourceMap section:
  - `.source-map__arc, .source-map__pulse { animation-delay: 0s !important }`, which beats the generated inline `animationDelay`;
  - `.source-map__arc { stroke-dashoffset: 0 }`, the drawn end state.
  - The section's header comment is updated.
- **Test:** the new static test `src/design/assets/__tests__/source-map-motion.test.ts`. jsdom runs with `css: false`, so the test reads `globals.css`, strips comments, extracts every balanced `@media (prefers-reduced-motion: reduce)` block and checks the rules per selector. A sanity case checks the global `*` rule.
- **RED:** 3 failed (`expected '' to match /animation-delay:\s*0s\s*!important/` for both classes, and the `stroke-dashoffset` check); the sanity case passed.
- **GREEN:** 4/4.

**8. Minor 9: QR guards (`11436b1`).**
- **Change:**
  - `src/lib/qr.ts:27`: `if (!text) return ''`.
  - `:30-36`: `QRCode.create` in try/catch → `console.error` outside production, then `''`.
  - `src/design/QrCode.tsx:20`: `if (!svg) return null`.
  - The docblocks are updated.
- **Tests:** `qr.test.ts` gains 2 cases (empty → `''`; `'x'.repeat(3000)` → `''` with one `console.error`). The new `src/design/__tests__/QrCode.test.tsx` has 3 cases (a labelled SVG, empty text renders nothing, oversized text renders nothing and logs).
- **RED:** 4 failed (`Error: No input text`, `Error: The amount of data is too big to be stored in a QR Code`, in both `qrSvg` and `QrCode`).
- **GREEN:** 8/8.

**9. Minor 8: docs drift and gallery claims (`bab7863`).**
- **Change:**
  - `CLAUDE.md:58`: the sentence that began "Two generation scripts" now lists `content:import`, `redirects:build`, `assets:map`, `assets:flags` and the one-time `assets:brand`.
  - `docs/ARCHITECTURE.md:104-112`: the block that began "Two content-generation scripts" now reads "Five generation scripts …; none of them runs in the build (§ Assets)" and lists all five.
  - Repo tree: the `scripts/` row (`:32`) names the asset scripts; the `src/design/` row (`:37-39`) names `blocks/`, `islands/`, `assets/`, `Flag.tsx` and `QrCode.tsx`.
  - `README.md:23-33`: the section "Content, redirects and assets" lists all five; nothing links to the old heading.
  - Gallery `page.tsx`: `Block` takes an optional `id` (`:60`), and the Button and Islands headings are `#g-a` / `#g-b` (`:99`, `:185`). ScrollSpyToc now spies on real headings, and with the LazyIsland demo from item 3, ARCHITECTURE:277's "renders every island and asset" holds.
- **Test:** none; these are docs plus the dev-only route. The `next dev` HTML contains `id="g-a"` and `id="g-b"` once each in both locales.

### Build (W126), once, after the last commit
- **`NODE_OPTIONS=--max-old-space-size=4096 npm run build`: exit 0.**
  - Next 16.3.5 (Turbopack). "✓ Compiled successfully in 863ms"; the persistent cache was warm.
  - TypeScript finished.
  - 13/13 pages were generated, including `/tr/dev/gallery` and `/en/dev/gallery`, which now compile the barrel import.
  - No warning or error lines.
- **`npm run start`** (backgrounded, then killed): `/` → **200**, `/en` → **200**.
- **One `NODE_OPTIONS=--max-old-space-size=4096 npm run dev`** (backgrounded, curled, then killed immediately): `/dev/gallery` → **200**, `/en/dev/gallery` → **200**.
  - The dev log has no error, warning or `⨯` lines. It contains only Ready, the next.config timing, the "Generated CLAUDE.md for AI agents" notice and the two `GET … 200` lines.
  - Both locales' HTML carry the barrel `ProgressBar`, the LazyIsland fallback "LazyIsland clicks: 0", `#g-a` and `#g-b`.
  - The appended `<!-- BEGIN:nextjs-agent-rules -->` block was reverted with `git checkout -- CLAUDE.md`. HEAD already carries item 9's deliberate edit; the tree is clean, `BEGIN:nextjs-agent-rules` count is 0 and the `assets:map` mention is present.
- Port 3000 was confirmed free after each server. No Playwright was run.

### Deviations
1. **Commit trailer.** It is `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, not `Claude Fable 5.1`, because the session's system attribution rule names the running model. This is the same accepted deviation as Task 5 and Task 6.
2. **`ProgressBar.tsx` got `'use client'` as well** (W130; the brief says "any other non-test module … that lacks it"). The frozen note "no hooks, no directive: usable from server components too" becomes: `'use client'`, still usable from server components as a client reference with plain props. The barrel stays directive-less (the brief allows either). Guard (a) exempts exactly `index.ts` and asserts that it holds only re-exports.
3. **Item 1's RED listed three files** for rule (a), the two hooks plus `ProgressBar.tsx`. Rule (b) listed exactly the two hook files, as predicted.
4. **Item 1 added one ARCHITECTURE sentence** (the W130 rule and the widened guard) that the brief's item 1 does not name. The repo's docs-match-code rule applies to both.
5. **The item 3 gallery demo loads a new gallery-local module `LazyCounter.tsx`** through a real `import()` chunk, beside `IslandsDemo.tsx`, rather than an inline component.
6. **ShareRow's failure line uses `text-text-secondary`** (a whole-string switch, W122-safe), not the success green. The gallery demo passes `copyFailed`.
7. **The item 9 tree row for `src/design/` also names `blocks/`** (missing since Task 5), `Flag.tsx` and `QrCode.tsx`, because the row was rewritten anyway. The `src/lib/` row still omits `qr.ts`; it is outside the brief's list and left for the controller.
8. **Item 4 has two tests**, a Dialog unit case and the BottomSheet + SearchInput scenario. Items 8 and 9 were committed separately (grouping was optional).

### Concerns
1. **The barrel proof has no negative control.** It rests on one warm-cache Turbopack build that recompiled and prerendered the gallery with the barrel import. No counterfactual build (with a directive removed) was run, per the one-build rule. If the controller wants the negative proof: remove `'use client'` from `useInView.ts`, and one build should fail with Next's "…depends on `useEffect`…" error.
2. **Importing one island through the barrel may pull every island into a page's client bundle.** Every island is now its own client module, but the app has no `sideEffects: false`, so a server page that imports one island through the barrel may bring all of them in. This is not measured (JS budget is the re-reviewer's). Importing `@/design/islands/<Island>` directly avoids the question.
3. **`useInView`'s return type changed** from `RefObject<T | null>` to `RefCallback<T>` (W132's callback ref). `ref={ref}` works the same; `ref.current` no longer exists. `LazyIsland` is the only consumer.
4. **W131 by design: the Stepper's parent sees a typed value only on blur or Enter.** Calculator results will update on commit, not per keystroke.
5. **`qrSvg` logs only outside production**, per the brief. In production an unencodable input renders nothing, silently.
6. **Guard (b) uses W130's list verbatim.** `Component`/`PureComponent`, which appear in the review's validator list, are not included.

### Produces changes
- **`Stepper` note (W131):** a draft while focused; commit and clamp on blur or Enter; an empty field reverts to the last committed value; −/+ and ArrowUp/ArrowDown clamp immediately; bounds compare against `min`/`max`; at a bound a button is `aria-disabled` and a no-op, never `disabled`.
- **`LazyIsland` props (W132):** `{ load, props, fallback, rootMargin? }`, without `ssr`. It loads once, stays mounted, and a rejected `load()` keeps the fallback.
- **`useInView` (W132):** `useInView<T>(options?: IntersectionObserverInit & { once?: boolean }): [RefCallback<T>, boolean]`, so `once` is new.
- **`ShareLabels.copyFailed?: string` (W133).**
- **`'use client'` (W130):** `ProgressBar`, `useScrollProgress` and `useInView` now carry the directive, which amends the "no directive" notes.
- **`ProgressBar` a11y:** `aria-valuetext={valueText}`, and `aria-labelledby` pointing at the visible label when `valueText` is shown.
- **`Dialog`:** Escape ignores an event that is already `defaultPrevented`.
- **QR:** `qrSvg` returns `''` and `QrCode` renders nothing for empty or unencodable text.

### Process check
`ps -Ao pid,rss,command | grep -E 'vitest|next|playwright|chromium' | grep -v grep` shows only the unrelated, pre-existing `ChromeRemoteDesktopHost`. No `vitest`/`next`/`playwright`/`chromium` process of mine is running, and port 3000 is free.
