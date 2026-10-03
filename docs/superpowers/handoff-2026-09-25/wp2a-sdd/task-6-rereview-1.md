# Task 6 — fix round 1 re-review (`bf2ad2c..bab7863`: 02379c9, 8887ee0, dca0f5e, eb4c366, a4111b9, 0aa0a46, cd9d0b7, 11436b1, bab7863)

**Fix round 1 verdict:** ✅ all findings addressed. I2 (W130), I3 + Minor 3 (W131), I1 + Minor 1/2 (W132), Minor 4, Minor 5 (W133) and Minors 6, 7, 8 and 9 are fixed, pinned by tests, and verified in the built app plus one `next dev` session in the browser. One new **Important item needs a controller ruling before WP2b; it is not a defect of this round**: a server component that imports one island through `@/design/islands` ships all 12 island modules in that route's entry JS, and WP2b Task 12's draft article page does exactly that. Two new Minor items remain.
**Regressions:** none.
- **Gate green at HEAD:** typecheck, lint and format are clean; vitest **99 files / 548 tests**. The fix-round test files alone, run verbosely: 11 files / 59 tests, all passing.
- **Build green:** exit 0 on Next 16.3.5 (Turbopack), 13/13 pages, TypeScript clean. It compiles the gallery's server-side barrel import.
- **Playwright** chrome + width-sweep + smoke on `next dev`: **112/112**.
- **Gallery:** TR and EN at 390/901/1440 show 0 console or hydration messages, 0 horizontal overflow and **0 axe violations** (full page, wcag2a/aa/22aa). Every changed island works by keyboard.
- **`next start`:** `/`, `/en`, `/isci-talebi` and `/en/hire-workers` return 200. Both galleries return 404 (R41).
- **JS:** 169,353 B gz-9 on all four routes, **+7 B** over the Task 6 review. The 7 B is Dialog's new guard.
- **Scope:** all 27 files in the diff fall under the brief's items: the named files, their tests, and the gallery-local `LazyCounter.tsx` (deviation 5). It changes nothing under `docs/superpowers/**` (ruling log, handoff, `produces-final.md`), `WEBSITE-HANDOFF.md`, `contract/`, `src/messages`, `src/content/local` or `package*.json`. `produces-final.md`, `task-7-additions.md` and the ledger all predate BASE.
- **Commits:** all 9 carry `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**How I worked:** read-only on the repo. Worktree `jobsadmire-website-wp2` at `bab7863` on `wp2/foundation`; `git status --porcelain` was empty before and after. One heavy job ran at a time: the gate, then the build, then `next start` (killed), then `next dev` for e2e and probes (killed). `next dev` appended its `nextjs-agent-rules` block to `CLAUDE.md`; I reverted it with `git checkout -- CLAUDE.md`, and the implementer's deliberate item-9 edit is intact. `.next/` is kept. Probes, logs and fixtures are under the session scratchpad `rereview-task6/`. The only link into the repo is a `node_modules` symlink, as the first reviewer used; I made no repo copy.

## Per item (1–9)

**1. I2, W130: directives + widened guard ✅**
- **Directives:** all 12 non-test modules under `src/design/islands/` start with `'use client'`: `BottomSheet`, `LazyIsland`, `PrintButton`, `ProgressBar`, `RangeSlider`, `ScrollSpyToc`, `SearchInput`, `ShareRow`, `Stepper`, `TriState`, `useInView`, `useScrollProgress`. The barrel `index.ts` has no directive and holds 12 `export … from` statements and nothing else, which the brief allows.
- **Guard at HEAD:** `rsc-imports.test.ts` passes 6/6.
- **Negative control of the guard itself.** I ran the repo's guard test file unmodified, with `cwd` set to two small synthetic fixture trees (scratch only, no repo copy):
  - **Fixture A, rule (a):** fails and lists exactly `islands/Commented.tsx` (the directive appears only in a comment) and `islands/useInView.ts` (directive removed).
  - **Fixture A, rule (b):** fails and lists `Commented.tsx → useState`, `useInView.ts → useEffect`, `useInView.ts → useState` and `primitives/NsRead.tsx → useState` (an `R.useState` namespace read). `Fine.tsx` (`useId` plus a type import) is correctly not flagged. `ClassComp.tsx` (`Component`) and `DomHook.tsx` (react-dom `useFormStatus`) are **not** flagged either; see N2.
  - **Fixture B:** every island is clean, but the barrel gains `export function helper()`. Rule (a) fails on the barrel's re-export-only check.
- **Negative control against Next's own SWC RSC validator** (`getLoaderSWCOptions({ serverComponents: true, bundleLayer: 'rsc' })`, the first reviewer's probe):
  - All 12 HEAD island modules compile to client references (`createProxy(...)`), and the barrel compiles as a server module.
  - `useInView.ts`, `useScrollProgress.ts` and `Stepper.tsx` with the directive stripped each fail with "You're importing a module that depends on `useEffect` / `useSyncExternalStore` / `useState` into a React Server Component module".
  - `ProgressBar.tsx` with the directive stripped passes, because `useId` is server-safe. Its directive therefore comes from W130's uniform rule, not from the validator.
- **The build is a real proof.** The gallery `page.tsx:42` imports `{ ProgressBar } from '@/design/islands'` and renders it at `:188-195`, and the build passed. The gallery's `page_client-reference-manifest.js` lists all 12 island modules as client references, including `useInView.ts` and `useScrollProgress.ts`. So the build's server graph walks every re-export of the barrel, and a directive-less hook module behind it would reach the validator. This closes the implementer's concern 1.
- **Docs:** the ARCHITECTURE:277 W130 sentence is accurate.

**2. I3 + Minor 3, W131: Stepper ✅**
- **Setup:** browser on the EN gallery; the Stepper starts at 15 with min 1, max 500, step 1. I read the committed `value` prop and the draft hook from the *current* React fiber.
  - My first helper read React's stale alternate buffer and showed two false "desyncs". The corrected helper shows none, and the stale reads were exactly the ones with `bufferWasCurrent: false`.
- **Backspace-then-type:** End then Backspace gives `"1"`. A second Backspace gives `""`, and the committed value stays 15. Typing "25" shows `"25"` with 15 still committed. Tab commits **25**, and focus moves to More.
- **No snapping while typing:** the gallery has no `min=10` demo; the unit test covers that case. From a committed 40, typing "2" shows `"2"` (still 40), then "5" shows `"25"` (still 40), and blur commits 25.
- **Clear + blur** restores 25, the previous value.
- **Select-all "600":** the field shows 600 while typing, the committed value stays 25, and More is `aria-disabled` while the draft is above max. Blur commits **500**.
- **Enter:** "7" then Enter commits 7, and focus stays in the field.
- **Arrow keys** commit and clamp at once:
  - ArrowUp takes 7 to 8. ArrowDown twice gives 6, with the draft `null`.
  - At 500, ArrowUp stays at 500. ArrowDown gives 499.
  - An uncommitted "900" followed by ArrowDown gives 499; it steps from the clamped draft.
- **Buttons at a bound:**
  - Fewer by keyboard from 3: Enter, Enter gives 1. The button then has `aria-disabled="true"` and no `disabled` attribute, **focus stays on Fewer**, opacity is 0.4 and the cursor is `not-allowed`.
  - Enter, Space and a mouse click at the bound do nothing, and focus stays. More at 500 behaves the same.
  - Axe on the Islands section at min and at max: **0 violations**.
- **Odd input:** "0" → 1, "2.6" → 3, "-5" → 1, "1e3" → 500, "015" → 15. The draft is `null` after every blur, and **the display equals the committed value** in all five cases.
- **Tab order:** Fewer, then the input, then More.
- **`onChange` fires on commit only:** the committed value never moved while typing.
- **Off-step bound** (value 3, step 5, min 0 → 0): unit test only, since the gallery uses step 1.
- **Unit tests:** Stepper 11/11.

**3. I1 + Minor 1/2, W132: LazyIsland / useInView ✅**
- **Before load:** at load the wrapper sits at 2,054 px, beyond the 900 px viewport plus the 200 px margin.
  - An `IntersectionObserver` wrapper (`addInitScript`) shows **one** observer on the wrapper with `rootMargin: "200px"` and a first callback of `[false]`.
  - Clicking the fallback button does nothing, so it stays "LazyIsland clicks: 0".
- **Loading:** after `scrollIntoView`, the only new script is the island's own chunk, `…dev_gallery_LazyCounter_tsx_….js`. Three clicks give 3.
  - The observer then shows callbacks `[false, true]`, is **disconnected** (the callback's disconnect plus the effect cleanup), and receives 0 callbacks after disconnecting.
- **Stays mounted:** after scrolling to the top (the wrapper is 1,154 px below the fold, beyond `rootMargin`), the island is **still mounted at "clicks: 3"**. Scrolling back shows "3", and keyboard Enter gives 4. No second observer is ever created.
- **Rejected `load()`:** with `page.route` aborting the LazyCounter chunk, the fallback stays ("clicks: 0" after two clicks) and the gallery `h1` is still rendered, so no error boundary took over.
  - There is no `pageerror`. The only console line is the browser's `net::ERR_FAILED` for the aborted request.
- **`ssr` is gone** from `LazyIslandProps` and from every doc. ARCHITECTURE:277 says "no `ssr` prop".
- **Unit tests:** LazyIsland 5/5 and useInView 7/7 (late mount, re-key, fold to the latest entry, `once` latch). `rootMargin` reaching the observer is tested and also seen in the browser.
- **Not in the brief:** Minor 2's remaining point, that the fallback-to-`Suspense` swap remounts the fallback DOM, was not in the brief and is still true. I parked it.

**4. Minor 4: Escape inside a BottomSheet ✅**
- **Behaviour now:** Escape in a SearchInput that has text only clears it. Escape in an empty SearchInput closes the sheet, because SearchInput calls `preventDefault()` only when it has a value. That is the right split.
- **Browser A:** a native handler that calls `preventDefault()` on the focused control keeps the sheet open. The next Escape closes it and returns focus to the opener.
- **Browser B, the real composition:** I moved the gallery's live `SearchInput` into the open sheet.
  - After typing "weld", Escape #1 clears it to `""`, the sheet stays open and focus stays in the field. Escape #2 (empty field) closes the sheet.
  - So in the App Router, React's root listener on `document`, registered at hydration, runs before Dialog's `document` listener. The fix therefore holds outside jsdom too.
- **Unit tests:** the Dialog and BottomSheet cases pass.

**5. Minor 5, W133: ShareRow ✅**
- **Rejected copy:** with `navigator.clipboard.writeText` rejecting `NotAllowedError` (`addInitScript`), Copy by keyboard shows "Could not copy the link".
  - The line uses `text-text-secondary`: rgb(85, 99, 119), **6.11:1** on white, in `aria-live="polite"`.
- **Timer restarts on the latest copy:** I copied again at +1.2 s. At 2.6 s after the first copy (1.4 s after the latest) the text was still shown. At 2.45 s after the latest it was empty.
- **Repeat copies re-announce:** a MutationObserver saw **one added node per copy** (2 of 2), so each repeat re-announces.
- **Missing Clipboard API** also announces `copyFailed`.
- **Success path** (permission granted): "Link copied", the clipboard holds the URL, and 2 additions for 2 copies.
- **Unit tests:** 7/7, including the silent case when no `copyFailed` label is given. No analytics event is added (W12).

**6. Minor 6: ProgressBar ✅**
- **Server-rendered bar (barrel import):** no `aria-label`. `aria-labelledby` points at the visible "Server-rendered progress (barrel import)" span, and `aria-valuetext="2 / 5"` equals the visible "2 / 5". The accessible name from `ariaSnapshot` is the label.
- **Demo bar:** "0 / 5" becomes "1 / 5" after "Yes", in both the visible text and `aria-valuetext` (`aria-valuenow` 1).
- **`useId`:** the two IDs differ, and there are 0 hydration warnings.
- **Axe:** 0 violations on the two progressbars (10 passes).

**7. Minor 7: reduced motion ✅**
- **Under `emulateMedia({ reducedMotion: 'reduce' })`**, sampled at load (t ≈ 0.29 s), +150 ms (t ≈ 0.45 s), +1 s and +2 s:
  - **13/13 arcs** have `strokeDashoffset: 0px` and a computed `animation-delay` of 0 s.
  - All 13 pulses are static at opacity 1 with `transform: none`.
  - 0 animations run. The 13 arc animations are finished (`forwards`); the pulses have no fill mode, so they drop out of `getAnimations()`.
- **Default motion is unchanged:** 0/13 arcs are drawn at load with the 0.22–1.54 s stagger and 26 animations running. At +2 s, 9/13 are drawn and the pulses are animating.
- **Static CSS test:** 4/4.

**8. Minor 9: QR guards ✅**
- **Unit tests (run):** `qrSvg('')` returns `''`. `qrSvg('x'.repeat(3000))` returns `''` and logs exactly one `console.error`. `QrCode` renders nothing for both, and the labelled SVG still renders. All 8 pass.
- **Code:** `if (!text) return ''`, a try/catch around `QRCode.create`, and `QrCode` returns `null` on `''`. The log gives the length, never the text.

**9. Minor 8: docs drift ✅ (N3 below is a leftover imprecision)**
- **`CLAUDE.md:58`:** lists exactly `package.json`'s five scripts, each with its true output: `build-source-map.ts` writes `src/design/assets/source-map.generated.tsx`, `build-flags.ts` writes `public/brand/flags.svg`, and `fetch-brand.sh` writes `logo.png` and `iskur.png`.
- **ARCHITECTURE:**
  - `:104-112` reads "Five generation scripts … none of them runs in the build", followed by the five-line block.
  - The tree row `:32` for `scripts/` matches the code files in `ls scripts/`.
  - Rows `:37-39` for `src/design/` name `blocks/`, `islands/`, `assets/`, `Flag.tsx` and `QrCode.tsx`.
- **README `:23-33`:** "Content, redirects and assets" lists all five.
- **ARCHITECTURE:277:** the LazyIsland/useInView sentence matches the code and the probes: load-once, fallback semantics, 200 px default, the failure path, and the callback ref with `once`.
- **Gallery:**
  - The LazyIsland demo is present and works.
  - `#g-a` and `#g-b` each occur exactly once, in both TR and EN.
  - The TOC marks "Primitives" at the top and at `#g-a`, and "Islands" at `#g-b`. Clicking "Primitives" lands on `#g-a`.

## Barrel / client-bundle analysis

**Verdict:** a server component that imports even one island through `@/design/islands` registers **all 12 island modules** as synchronous client references of its route. Their code, about **3,988 B gz-9** (12,723 B raw, concatenated), lands in that route's entry JS.

`/` and `/en` are unaffected: +7 B, no island code. Today the only server-side consumer is the dev gallery, which returns 404 in production. WP2b Task 12's draft is the first real consumer that would pay the cost.

**Evidence, from the one build (`.next/` kept):**
1. **The barrel is fully walked.** The gallery's `page_client-reference-manifest.js` has 47 client modules, including all 12 island modules.
   - `useInView.ts` and `useScrollProgress.ts` are imported by no server file. Their only other importers are `LazyIsland` and `ScrollSpyToc`, on the client side, and a client-side import never creates a client reference. So they are client references only because Turbopack walked every re-export of the directive-less barrel from `page.tsx`.
   - The primitives barrel shows the same thing: `Dialog.tsx` and `RadioChips.tsx` are client references of the gallery although `page.tsx` imports neither.
2. **Every island ships synchronously.** Each of the 12 island references maps to the page's 4 `entryJSFiles` (`3jt-jn-92rodg.js`, `14xmgymk1sega.js`, `12qh5ufsgsiqq.js`, `2r4ts4zxyz5oq.js`) with `async: false`. The HTML loads these as `<script>` tags; for `/`, all of its `entryJSFiles` appear among the 10 scripts `next start` serves.
3. **The same thing already happens on production routes.** `/` and `/en/hire-workers` carry all seven `'use client'` primitives (Accordion, Chip, Dialog, PausableMarquee, RadioChips, Stat, Tabs) as client references mapped to their entry chunks, and neither route renders them. This is because the server chrome imports the primitives barrel.
   - The Dialog sheet class `rounded-t-hero` ships in `/`'s `12qh5ufsgsiqq.js`.
   - The Task 5 re-review found `radiogroup`, `tabpanel` and `aria-modal` on `/`, and parked the client-side half of this.

**Island modules in the gallery's client chunks** (all in the page chunk `2r4ts4zxyz5oq.js`, standalone gz-9):

| Module | gz-9 | Module | gz-9 |
|---|---|---|---|
| ShareRow | 992 B | TriState | 534 B |
| Stepper | 987 B | BottomSheet | 453 B |
| ScrollSpyToc | 800 B | useInView | 319 B |
| SearchInput | 758 B | PrintButton | 303 B |
| RangeSlider | 565 B | LazyIsland | 292 B |
| ProgressBar | 540 B | useScrollProgress | 289 B |

- **Dead weight, concatenated:**
  - A page that renders only `ProgressBar` carries **3,737 B gz** of islands it never uses.
  - The Task 12 article page carries **2,551 B gz**: BottomSheet, LazyIsland, PrintButton, RangeSlider, SearchInput, Stepper, TriState and useInView.

**Why it matters now:**
- ARCHITECTURE:277 ("a server page may import through the `@/design/islands` barrel") and the `ProgressBar.tsx:26-28` docblock both invite the costly pattern.
- WP2b Task 12's draft `blog/[slug]/page.tsx` (`task-12.md` ≈2152) is a server page that does `import { ShareRow } from '@/design/islands'`.
- The client-side barrel imports in the drafts are T3's `CalculatorIsland`/`SalaryGuideIsland`, T4's `EligibilityWizard`, and T12's `PostFilter`, `ArticleToc` and `ArticleEnhancements`.
  - This build cannot show whether Turbopack prunes unused re-exports in the client graph, because every island is also referenced elsewhere in the gallery.
  - The Task 5 re-review's primitives observation points the same way, but the server-side path confounds it.

**Recommended ruling (a W134 draft for the controller):**
- **The rule:** pages, blocks, chrome and page-level client compositions import islands by file, for example `@/design/islands/ShareRow`, never through `@/design/islands`. The barrel stays for the dev gallery and tests.
  - The gallery keeps W130's server-side `ProgressBar` barrel import as the standing build proof.
- **Enforce it:** add one more case to `rsc-imports.test.ts`: no module under `src/` outside `src/app/[locale]/(site)/dev/gallery/` imports `@/design/islands`. Alternatively, an ESLint `no-restricted-imports` rule with a gallery override.
- **Amend** ARCHITECTURE:277, `ProgressBar.tsx:26-28`, and the T3/T4/T12 draft imports.
- **Pair it** with the Task 5 re-review's parked primitives-barrel rule, so one rule covers both barrels.
- **Alternatives considered:**
  - Per-module barrel entries (`exports` subpaths) do not apply to app-internal code.
  - A `sideEffects` field in `package.json` might let Turbopack prune the barrel, but that is unverified and would need a build to measure. Import-by-path is deterministic.

## The implementer's deviations and concerns — verdicts

**Deviations**
1. **Trailer `Claude Opus 5.5`, not "Fable 5.1":** accept. The session attribution rule names the running model, as at Tasks 5 and 6. All 9 commits carry it.
2. **`'use client'` on `ProgressBar.tsx`:** accept. W130 says "every non-test module under `src/design/islands/`" and brief item 1 says "check them all".
   - The validator probe shows ProgressBar did not strictly need it (`useId` is server-safe). A uniform rule is what keeps guard (a) free of exceptions.
   - **Consequence:** a server page that renders ProgressBar now ships it (540 B gz) and hydrates it, where before it was zero-JS markup. The frozen "no hooks, no directive" note is superseded by W130; `produces-final.md` should say so. Parked, with a note to WP2b.
3. **RED listed three files for rule (a):** accept; consistent with 2.
4. **An extra ARCHITECTURE sentence for W130 and the guard:** accept. The docs-match-code rule requires it and the sentence is accurate, but see N1 for its "may import through the barrel" wording.
5. **`LazyCounter.tsx` beside `IslandsDemo.tsx`, loaded by a real `import()`:** accept. It is a better proof: its own chunk loads only near the viewport, as the probe shows. It is gallery-local (W41).
6. **The failure line in `text-text-secondary`:** accept. It swaps the whole class string (W122-safe) and measures 6.11:1.
7. **The `src/design/` tree row also names `blocks/`, `Flag.tsx` and `QrCode.tsx`; the `src/lib/` row still omits `qr.ts`:** accept. The `src/lib/` row, which also omits `format/date.ts`, is parked.
8. **Two tests for item 4; items 8 and 9 committed separately:** accept.

**Concerns**
1. **Barrel proof had no negative control:** closed. The SWC probe shows three modules failing without the directive, the manifest shows the build walks all 12 barrel modules, and the guard fixture fails as it should.
2. **The barrel may pull every island into a page's bundle:** **confirmed** for server-side imports. This is N1, with a ruling recommended. It is not a regression, and nothing ships today.
3. **`useInView` returns `RefCallback<T>`, not `RefObject`:** acceptable. W132 explicitly allows "a callback ref / state-held node".
   - `ref={ref}` works unchanged. `LazyIsland` is the only consumer.
   - The WP2b T1 draft's page-local hook is to be replaced under W85, and its consumers only write `ref={ref}`.
   - `produces-final.md` should record `RefCallback<T>` and `once`.
4. **The Stepper's parent sees a value only on commit:** acceptable for the calculator (W24 engine consumer).
   - Results recompute on blur, Enter, −/+ and the arrow keys. Mobile keypads blur through Done/Next, and an estimate button's click sees the committed value, because the blur commits first.
   - That is W131's ruled behaviour. Live-per-keystroke results are deliberately not offered.
5. **`qrSvg` logs only outside production:** fine, and as briefed.
6. **Guard (b) omits `Component`/`PureComponent`:** the implementer followed W130's binding list verbatim, so it is compliant. The list is narrower than Next's validator, though. That is N2, parked for widening.

## New findings (Critical / Important / Minor)

**Critical:** none.

**N1 (Important, needs a ruling; not a fix-round defect).** A server-side import through the islands barrel ships all 12 islands in the route's entry JS: about 3.7 KB gz of dead weight for a page that uses only `ProgressBar`, and about 2.55 KB gz on WP2b T12's article page.
- The docs now point server pages at the barrel: ARCHITECTURE:277 and `ProgressBar.tsx:26-28`.
- The evidence and a draft W134 are in the barrel section above.
- Nothing in production is affected today.

**N2 (Minor).** Guard (b)'s API list is narrower than Next 16.3.5's RSC validator.
- **What the guard misses:** the SWC probe errors on `Component` (the class-component message), `PureComponent` and `createFactory` from `react`, and on `useFormStatus` and `flushSync` from `react-dom`. Fixture A's `ClassComp.tsx` and `DomHook.tsx` pass the guard.
- **Mitigation today:** the W126 build still catches these when a module is reachable from a server graph, but the guard exists to fail first.
- **Where the guard is stricter than Next,** correctly: `import * as R from 'react'; R.useState(…)` passes SWC but would crash at render, because the react-server build has no `useState`. The guard flags it.
- **Fix:** add the three `react` names and the four `react-dom` names (`useFormStatus`, `useFormState`, `flushSync`, `unstable_batchedUpdates`) to the list, with `react-dom` as a second specifier. W130's list is binding, so this is for the controller at the final review.

**N3 (Minor, docs precision).** ARCHITECTURE:277 still says "The dev gallery … renders every island and asset". The brand files in `BRAND` (`public/brand/logo.png`, `iskur.png`, `google-play.svg`) are rendered nowhere, the gallery included.
- The brief's two named actions (the LazyIsland demo and real `#g-a`/`#g-b`) are done, so item 9 is ✅. The claim is still not literally true.
- **Fix:** three `next/image` tiles in the gallery's Assets block, or reword to "every island and the flag/QR/map assets".

## JS budget

| Route | Scripts | gz-9 (W120 proxy) | Δ vs the Task 6 review (169,346 B) |
|---|---|---|---|
| `/` | 10 (1 noModule skipped) | **169,353 B** | +7 B |
| `/en` | 10 | 169,353 B | +7 B |
| `/isci-talebi` | 10 | 169,353 B | +7 B |
| `/en/hire-workers` | 10 | 169,353 B | +7 B |

- **Method:** identical to the Task 6 review's: gzip-9 over each route's `<script src>` set from `next start`, excluding the `noModule` polyfill.
- **Where the +7 B is:** Dialog's `if(e.defaultPrevented)return;` in the shared layout chunk `12qh5ufsgsiqq.js`. The primitives barrel carries Dialog onto every route (Task 5 re-review, parked).
- **No island reaches these routes:**
  - 0 hits for `print-isolating`, `source-map__`, `remainingSingular`, `wa.me/?text`, `webkit-search-cancel`, `aria-valuetext`, `qrcode`, `inputMode:"numeric"`, `"unsure"`, `type:"range"`, `copyFailed` and `LazyIsland`.
  - The one `rootMargin:"200px"` hit is Next's own link-prefetch observer in the framework chunk `3b3nw8wjhpb3_.js`.
  - `rounded-t-hero` is the pre-existing Dialog sheet class.
- **Headroom:** 35,447 B to the 204,800 B ceiling, and 25,207 B to the 194,560 B lazy-pass threshold. N1's cost is 10–15 % of that margin per affected route.

## Parked for the WP2a final review

- **N1:** the islands-barrel ruling, if the controller defers it past Task 6. It should be settled before WP2b Task 3, 4 or 12 starts. Pair it with the Task 5 re-review's primitives-barrel item.
- **N2:** widen guard (b)'s list. **N3:** the gallery's "every … asset" claim.
- **LazyIsland focus loss** (Minor 2 residual, not in the brief): the swap from the plain fallback to the `<Suspense fallback>` remounts the fallback DOM, so focus inside a focusable fallback is lost when the observer fires. It is rare with a 200 px margin.
  - A `startTransition` around the latch would at least keep the old fallback until the chunk resolves.
- **LazyIsland load errors are silent:** a rejected `load()` is swallowed. A `console.error` outside production, as `qrSvg` does, would help debugging.
- **`useInView` recreates the observer each render** when a caller passes a fresh `threshold: [...]` array literal. This predates the round, and the "read as primitives" comment does not cover arrays.
- **`ProgressBar` from a server page is now a hydrated client component** (W130). WP2b pages that want a zero-JS bar need a server-only variant, or must accept about 540 B.
- **Stepper cosmetic:** a button at its bound still takes `hover:bg-pale-1`.
- **ARCHITECTURE tree `src/lib/` row** omits `qr.ts` and `format/date.ts`; the `src/design/` row omits `contrast.ts`.
- **`produces-final.md` amendments** (controller), from the report's "Produces changes":
  - the W131 Stepper note;
  - `LazyIsland` props without `ssr`;
  - `useInView` gaining `once` and returning `RefCallback<T>`;
  - `ShareLabels.copyFailed?`;
  - `'use client'` on `ProgressBar`, `useScrollProgress` and `useInView`;
  - `ProgressBar`'s `aria-valuetext` and `aria-labelledby`;
  - Dialog's Escape ignoring an event that is already `defaultPrevented`;
  - QR rendering nothing for empty or oversized text.
- **The first review's P-1…P-8 stand unchanged.** P-6 still applies: `LazyIsland.load` is a function prop, so a server page needs a thin client wrapper. P-7 still applies: W126's "`next start` gallery 200" wording contradicts R41.
