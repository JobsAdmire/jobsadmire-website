# Task 8 — Primitives (accessible building blocks) — report

**Branch:** `wp1/foundation` (worktree `jobsadmire-website-wp1`)
**Commit:** `1eee710` — `feat(design): accessible primitives (accordion, tabs, dialog, form field, pausable marquee, skip link, …)`
**Status:** DONE_WITH_CONCERNS (one sanctioned deviation from R18's mechanism — see §6; one pre-existing test-env limitation — see §7)

## 1. What was implemented

Thirteen primitives in `src/design/primitives/`, one per file, re-exported from `index.ts`;
four behaviour tests in `src/design/primitives/__tests__/`; the marquee keyframes in
`src/app/globals.css`; the R17 `Href` type in `src/i18n/navigation.ts`.
Dev dependency added: `@testing-library/user-event` (brief-sanctioned, lockfile committed). No other dependency.

Per component — the a11y mechanism (D20 unless noted):

| Component | Client? | A11y mechanism |
|---|---|---|
| `Button` | server-compatible | Three real elements, never a styled `div`: internal `Link`, external `<a target="_blank" rel="noopener noreferrer">`, else `<button type="button">` (caller's `type` honoured); `min-h-[44px]` (`lg`: 52 px), `focus-visible` 2 px outline in `blue-safe`, `disabled` styles. |
| `Card` | server-compatible | Semantic element choice (`article`/`div`) stays with the caller; hover is a shadow change only — no state hidden behind hover. |
| `Section` | server-compatible | `<section id>` so skip/anchor targets exist; `dark` = `bg-navy text-white` (the contrast-checked pair). |
| `Eyebrow` | server-compatible | Renders the contrast-safe `text-blue-safe` (#1073a8), never raw brand blue; uppercase is CSS, so the accessible text keeps its real casing. |
| `Stat` | `'use client'` | Final `formatInt(value, locale)` value is in the server HTML and is the accessible text (`sr-only` span); the count-up animates a sibling `aria-hidden` span. See §5. |
| `Chip` | `'use client'` | A real `<button type="button" aria-pressed>` toggle, `min-h-[44px]`, visible focus ring. |
| `Accordion` | `'use client'` | Header `<button>` inside `<h3>` with `aria-expanded` + `aria-controls`; panel is a `role="region"` labelled by its button and `hidden` when closed; Home/End move focus to the first/last header (WAI-ARIA accordion pattern); `min-h-[46px]`. |
| `Tabs` | `'use client'` | `role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, `aria-controls` + `aria-labelledby`, roving `tabIndex` (selected = 0, others = -1), Arrow Left/Right wrap + Home/End with focus following selection, panels `tabIndex={0}` so keyboard users can reach non-focusable panel content; 44 px tabs. |
| `Dialog` | `'use client'` | `<div role="dialog" aria-modal="true" aria-labelledby>` (not `<dialog>` — controller ruling: jsdom lacks `showModal`, and the top layer fights the sticky header), initial focus into the panel, manual Tab/Shift+Tab wrap, Escape closes, focus restored to the opener and `body` scroll lock released on unmount, backdrop mousedown closes. |
| `FormField` | server-compatible | Always a visible `<label for>`; `aria-describedby` lists hint then error; `aria-invalid` when in error; `aria-required` when required (the `*` is `aria-hidden`); the error is a `role="alert"` so it is announced. |
| `PausableMarquee` | `'use client'` | Visible, keyboard-reachable 44×44 px `<button aria-pressed>` pause/play (WCAG 2.2.2); the duplicated track is `aria-hidden`; the viewport is `aria-live="off"`; reduced motion is honoured in CSS *and* reflected in the button label. |
| `SkipLink` | server-compatible | `<a href="#main">`, `sr-only` until focused then `focus:not-sr-only` as a 44 px pill at top-left — the first focusable element on the page. |
| `Timeline` | server-compatible | A real `<ol>` of `<li>` steps (order is meaning), optional `when` eyebrow, `<h3>` titles. |

## 2. RED (before implementation)

```
$ npm run test -- src/design/primitives
 FAIL  src/design/primitives/__tests__/Accordion.test.tsx  [Failed to resolve import "../Accordion"]
 FAIL  src/design/primitives/__tests__/Dialog.test.tsx     [Failed to resolve import "../Dialog"]
 FAIL  src/design/primitives/__tests__/FormField.test.tsx  [Failed to resolve import "../FormField"]
 FAIL  src/design/primitives/__tests__/PausableMarquee.test.tsx [Failed to resolve import "../PausableMarquee"]

 Test Files  4 failed (4)
      Tests  no tests
```

## 3. GREEN (four tested primitives + marquee CSS)

```
$ npm run test -- src/design/primitives
 Test Files  4 passed (4)
      Tests  4 passed (4)
   Duration  663ms
```

No React `act()` warnings; output clean apart from the pre-existing Vitest `configLoader` warning.

## 4. `npm run verify` (once, after the remaining nine + index.ts)

```
typecheck  tsc --noEmit            → clean
lint       eslint .                → clean
format     prettier --check .      → All matched files use Prettier code style!
test       vitest run              → Test Files 12 passed (12) | Tests 46 passed (46)
```

(`npm run format:write` was run over the touched files first. `next build` and Playwright were
not run, per instruction — `npm run gate` remains the work-package-level gate.)

## 5. `Stat`: count-up vs accessible name

Chosen shape (the ruling allowed either): **the count-up animates a separate visual span; the
final value is rendered visually-hidden and is the accessible text.**

- `formatInt(value, locale)` (D18) is rendered twice: once in `<span aria-hidden="true">` (the
  visible, animating number) and once in `<span className="sr-only">` (the accessible name).
- Initial state is the **final** value, so the server HTML — and therefore crawlers and any
  no-JS visitor — carry `38.944+`, not `0`.
- The count-up runs only in an effect, and only when all three hold: `typeof window.matchMedia === 'function'`
  (R18 guard — jsdom has neither `matchMedia` nor `IntersectionObserver`), reduced motion is **not**
  requested, and an `IntersectionObserver` reports the element in view (threshold 0.4, fires once,
  then disconnects; `requestAnimationFrame` cancelled on unmount).
- The accessible name therefore never changes during the animation, and screen-reader users are
  never read a running counter.

## 6. Deviation from R18's mechanism in `PausableMarquee` (behaviour preserved)

R18 asked for `paused` to be initialised from `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
**inside a `useEffect`**. That exact code fails this repo's lint gate:

```
src/design/primitives/PausableMarquee.tsx
  21:72  error  Calling setState synchronously within an effect can trigger cascading renders
                react-hooks/set-state-in-effect
```

Per the instruction "if a test needs `act()` warnings silenced, fix the component, not the test" —
and rather than suppressing a React Compiler rule — the component now reads the same media query
through React's designed API for exactly this, `useSyncExternalStore`:

- `getServerSnapshot` returns `false`, so the server render and hydration agree (the state is still
  never read during the server render — R18's stated reason for the effect);
- the client snapshot is guarded with `typeof window.matchMedia === 'function'`, so jsdom returns `false`
  and the brief's test passes unchanged;
- a `change` subscription means the button also follows a live OS-setting change;
- `paused = override ?? reducedMotion` keeps R18's observable behaviour exactly: before the visitor
  touches the control the button reflects the real reduced-motion state (it offers "Play" when the
  CSS has already paused the marquee); after a click the visitor's choice wins.

`Stat` keeps the R18 guard verbatim (its `setState` calls are inside the IntersectionObserver/rAF
callbacks, so the lint rule does not apply).

## 7. Files changed

| File | Lines |
|---|---|
| `src/design/primitives/Accordion.tsx` | 73 |
| `src/design/primitives/Button.tsx` | 65 |
| `src/design/primitives/Card.tsx` | 23 |
| `src/design/primitives/Chip.tsx` | 28 |
| `src/design/primitives/Dialog.tsx` | 72 |
| `src/design/primitives/Eyebrow.tsx` | 10 |
| `src/design/primitives/FormField.tsx` | 52 |
| `src/design/primitives/PausableMarquee.tsx` | 65 |
| `src/design/primitives/Section.tsx` | 22 |
| `src/design/primitives/SkipLink.tsx` | 11 |
| `src/design/primitives/Stat.tsx` | 74 |
| `src/design/primitives/Tabs.tsx` | 67 |
| `src/design/primitives/Timeline.tsx` | 19 |
| `src/design/primitives/index.ts` | 13 |
| `src/design/primitives/__tests__/Accordion.test.tsx` | 23 |
| `src/design/primitives/__tests__/Dialog.test.tsx` | 22 |
| `src/design/primitives/__tests__/FormField.test.tsx` | 19 |
| `src/design/primitives/__tests__/PausableMarquee.test.tsx` | 18 |
| `src/i18n/navigation.ts` (+5: the R17 `Href` export) | 9 |
| `src/app/globals.css` (+19: marquee keyframes + reduced-motion stop) | 150 |
| `package.json` / `package-lock.json` (+`@testing-library/user-event`) | +1 / +15 |

No file is near the ~150-line ceiling.

## 8. Self-review findings

- **Completeness:** 13 components with the "Produces" props; `Tabs` roving tabindex + Arrow/Home/End;
  `Accordion` Home/End; `Chip` `aria-pressed`; `Timeline` `<ol>`; `SkipLink` → `#main`, visible on focus;
  every `<button>` is `type="button"` (or the caller's type on `Button`); 44 px minimum on every
  interactive target (`Accordion`'s header is the brief's 46 px).
- **Beyond the four brief tests, the nine untested primitives were exercised with throwaway tests that
  were run and then deleted** (not committed, per "nothing beyond the brief"): `Button`'s three branches
  (internal `Link` / external anchor with `rel="noopener noreferrer"` / `<button>`, `type`, `disabled`,
  pass-through `id`), `Tabs` roving tabindex + ArrowRight/Home, `Stat`'s `38.944+` in both the visible and
  `sr-only` spans (TR locale, D18), `Chip` toggle callback, `Timeline` `<ol>`, `SkipLink` `#main`,
  `Eyebrow` colour class, plus `Accordion` Home/End focus movement and `Dialog` initial focus, Tab wrap
  and `body` overflow restore. All passed.
- **R17 honoured:** `Href` is exported from `src/i18n/navigation.ts`; `Button.href` is a plain `string`;
  the single `href as Href` cast is the only cast in the module and is commented as the data boundary.
- **D18 honoured:** the only rendered number in this set is `Stat`'s, and it goes through `formatInt`.
- **Discipline:** no storybook, no extra variants, no demo page, no new CSS variables (only the marquee
  keyframes the brief specifies); existing theme utilities and Tailwind 4 arbitrary values only.

## 9. Concerns for the controller

1. **Vitest cannot import anything that pulls in `@/i18n/navigation`.** A test importing `Button` — or the
   `src/design/primitives/index.ts` barrel — fails at import time:
   `Cannot find module '…/node_modules/next/navigation' imported from next-intl/…/createNavigation.js —
   Did you mean to import "next/navigation.js"?`. This is a pre-existing Vitest/next-intl ESM-resolution
   gap (Next itself resolves it; typecheck, lint and the app build path are unaffected), not a defect in
   this task's code — but WP2+ component tests will hit it. It needs a one-line decision I did not take
   unasked: either a `resolve.alias` entry (`'next/navigation' → 'next/navigation.js'`) in `vitest.config.ts`,
   or `test.server.deps.inline` for `next-intl`, or tests mock `@/i18n/navigation` (which is how I
   verified `Button` here).
2. **`PausableMarquee` mechanism change** — see §6. Behaviour matches R18; the implementation does not.
   Flagging explicitly because it is a deviation from an explicit ruling.
3. **Reduced motion + a user "Play"** — if a visitor with `prefers-reduced-motion: reduce` presses Play,
   `animationPlayState: running` is set but the global `@media (prefers-reduced-motion: reduce)` rule
   (`animation-play-state: paused !important`) keeps the marquee still. That is inherited from the brief's
   CSS and is arguably the right outcome (the OS setting wins), but the control then claims a motion state
   the page will not deliver. Worth a ruling before the marquee ships on a real page.
4. **Visual styling is provisional.** Variant/padding/colour choices for `Button`, `Card`, `Section`,
   `Chip`, `Tabs` and `Timeline` are token-only guesses at the design package's look; the pixel-comparison
   harness in a later WP is where they get reconciled. No page consumes these primitives yet.

---

# Fix round 1 (review verdict: needs fixes)

**Commit:** `a285734` — `fix(design): dialog trap stability, accordion multi-open, inert marquee copy, button href fallback, stat under reduced motion`
**Scope:** 9 rulings/findings + the two test additions. No new dependency, no config change, no build/Playwright run, nothing pushed.

## Per finding

| # | File:line | What changed |
|---|---|---|
| 1 | `Dialog.tsx:22-26`, `:35`, `:58` | The latest `onClose` now lives in `onCloseRef` (updated by its own `useEffect([onClose])`); the trap effect is keyed on `[open]` alone and calls `onCloseRef.current()` on Escape. An inline `onClose={() => setOpen(false)}` no longer tears down and re-arms the trap on every parent render (no focus restore to the opener, no re-focus of the first control, no listener churn mid-interaction). The backdrop `onMouseDown` still calls the live `onClose` prop directly (it is a render-time handler, so identity churn is harmless there). |
| 2 | `Accordion.tsx:20-28` (R21) | `toggle` is now a real toggle: `if (prev.has(id)) next.delete(id); else next.add(id);` on top of the `singleOpen ? [] : prev` base. With `singleOpen={false}` an open panel closes; with `singleOpen` the others still close and re-clicking the open header collapses it. |
| 3 | `PausableMarquee.tsx:51-55` | The duplicated track span is now `aria-hidden="true" inert` (React 19 boolean prop → `inert=""`), so links/logos in the filler copy are unfocusable and their ids/labels are out of the a11y tree (axe `aria-hidden-focus`). |
| 4 | `Button.tsx:44-73` (R22) | Branch order is now: `disabled || !href` → `<button>`; `external` → `<a target="_blank" rel="noopener noreferrer">`; `/…` → `<Link href={href as Href}>` (the one sanctioned cast, unchanged); **anything else still a link** (`https://wa.me/…`, `tel:`, `mailto:`) → plain same-tab `<a href>` with the same classes. No href can produce a dead button any more. |
| 5 | `Stat.tsx:26-28`, `:41`, `:49`, `:65` | The count-up value is `useState<number \| null>(null)` (never seeded from the prop) and the visible span renders `formatInt(animated ?? value, locale)`. Under reduced motion, or with no `IntersectionObserver`, a changed `value` prop now updates the visible number immediately instead of going stale against the `sr-only` one. |
| R20 | `PausableMarquee.tsx:39`, `:47`, `:62` + `globals.css:148-154` | `paused = reducedMotion \|\| (override ?? false)` — a stale override can no longer claim a running state; the inline `animationPlayState` is omitted entirely when `reducedMotion`, leaving the stylesheet as the single source of truth. The toggle carries `.marquee-toggle`, and `@media (prefers-reduced-motion: reduce) .marquee-toggle { display: none }` sits next to the existing `.marquee` rule. SSR and hydration still agree (`getServerSnapshot → false`; the hiding is pure CSS). |
| 6 | `PausableMarquee.tsx:50` | The first copy of `children` is now wrapped in a span identical to the second (`<span className="flex gap-4">`), so the outer `gap-4` no longer shifts the `-50%` loop by half a gap. |
| 7 | `Accordion.tsx:56`, `PausableMarquee.tsx:62` | Both gained the Button/Chip/Tabs focus treatment: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe` (D20). |
| 8 | `Button.tsx:44-50` | `disabled` short-circuits every link branch: a disabled CTA renders `<button disabled>` whatever its href. |
| 9 | `Tabs.tsx:9-12` | State renamed to `selected`; the rendered `active` is `tabs.some((t) => t.id === selected) ? selected : (tabs[0]?.id ?? '')`, so an unknown `defaultId` can no longer leave every tab at `tabIndex -1` with no panel open. |

## Tests

Extended the two existing files only (no new test files; `Button`/barrel stay out of Vitest pending R19 in Task 9):

- `__tests__/Accordion.test.tsx` — `closes an open panel when singleOpen is false (R21)`: opens both panels, closes the second, asserts the first stays open.
- `__tests__/Dialog.test.tsx` — `keeps focus when an inline onClose changes identity on re-render`: focuses the second control inside the dialog, re-renders with a fresh arrow-function `onClose`, asserts `document.activeElement` is unchanged.
- Both files also gained `afterEach(cleanup)` (with `cleanup` imported from RTL): this repo's Vitest runs **without** `globals: true`, so RTL's automatic cleanup never registers and a second `render` in the same file collides with the first ("found multiple elements"). Local to the two files; `vitest.setup.ts` untouched.

**Both new assertions were proven to fail against the pre-fix components** (temporarily restored `}, [open, onClose])` and the old `if (!prev.has(id)) next.add(id)`):

```
 × keeps focus when an inline onClose changes identity on re-render
 × closes an open panel when singleOpen is false (R21)
      Tests  2 failed | 4 passed (6)
```

Findings 3–9 were additionally exercised with throwaway tests that were run and then deleted (not committed): Button `https://wa.me/…` and `tel:` render anchors without `target`, `disabled` + internal href renders a disabled `<button>` and no link; `Stat` rerendered 100 → 250 updates both the visible and `sr-only` spans; the marquee's duplicate span carries `inert`, both halves are identical `span.flex.gap-4`, and the toggle carries `marquee-toggle`; `Tabs` with `defaultId="nope"` selects the first tab at `tabIndex 0` with its panel shown. All passed.

## Commands

```
$ npx prettier --write src/design/primitives src/app/globals.css src/i18n/navigation.ts   # format:write on touched files

$ npm run test -- src/design/primitives
 Test Files  4 passed (4)
      Tests  6 passed (6)
   Duration  679ms

$ npm run verify
typecheck  tsc --noEmit        → clean
lint       eslint .            → clean
format     prettier --check .  → All matched files use Prettier code style!
test       vitest run          → Test Files 12 passed (12) | Tests 48 passed (48)
```

No React `act()` warnings; output clean apart from the pre-existing Vitest `configLoader` warning and Node EBADENGINE noise. No build, no Playwright, no push.

## Notes / remaining concerns

- Concern 3 from the first round (a reduced-motion visitor pressing Play gets nothing) is **resolved** by R20: the control is hidden under reduced motion and `paused` is forced true.
- Concern 1 (Vitest cannot resolve `next/navigation` through `@/i18n/navigation`, so `Button` and the `index.ts` barrel are untestable) stands — R19 in Task 9 per the controller.
- New, minor: RTL auto-cleanup is off repo-wide (no `globals: true`). Two files now opt in explicitly; if more component tests land, `afterEach(cleanup)` in `vitest.setup.ts` would be the one-line repo-level fix — deliberately not taken here as it is outside this task.
