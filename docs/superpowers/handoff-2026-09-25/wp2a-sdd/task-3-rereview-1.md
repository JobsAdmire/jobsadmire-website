# Task 3 — fix round 1 re-review (`f798495..6a22c01`, 2026-09-27)

**Fix round 1 verdict:** ✅ all findings addressed — Important 1 (W119), Minors 1–4 and the approved doc drift are fixed as briefed. The evidence is independent: the RED runs reproduced on pre-fix code, a mutation on the live DOM, a fresh build + e2e, and per-commit verify replays.
**Regressions:** none. Verify is green at every commit (49 files; 325 → 326 → 328 → 328 tests), `e2e/chrome.spec.ts` passes 10/10, and there are no console or hydration errors. Overflow is 0 at every probed width. The diff is confined to the 12 allowed files.

Method: all runs are on HEAD `6a22c01` (clean tree), Node 25.8.2, sequentially with one heavy job at a time. The machine lost power mid-review, so every probe was re-run after the reboot, and the numbers below come from the post-reboot runs. Pre-fix checks ran in `git archive` scratch copies (node_modules symlinked), never in the worktree. `npm run build` left `CLAUDE.md` byte-identical (no `nextjs-agent-rules` block). The server on :3000 was stopped afterwards. Scratch artefacts (session scratchpad, may be wiped): `rereview-task3/{verify-*.log, red-base.log, head-edge.log, w121-mutation.log, css-grep.out, e2e-chrome.log, probe.out, jsbudget.out, static-scan.out}`; the key numbers are inlined below.

## Per item (1–6)

### 1. W119 visibility — ✅

- **Code.**
  - `HeaderCtas.tsx:14` is `buttonClassName('secondary', 'md', 'max-xl:hidden whitespace-nowrap')`. There is no bare `hidden` and no `xl:inline-flex`; `BASE` supplies `inline-flex`.
  - `SlimBar.tsx:38,46` are `` `max-lg:hidden ${LINK}` `` (`LINK` opens with `inline-flex`).
- **Breakpoints.** `globals.css:56-57` `@theme` has `--breakpoint-lg: 901px; --breakpoint-xl: 1101px`, so `max-lg:` means `< 901` and `max-xl:` means `< 1101`.
- **Built CSS** (`.next/static/chunks/1je6340u9ff76.css`).
  - `.max-xl\:hidden{display:none}` sits at offset 30751, inside `@media not all and (min-width:1101px)`.
  - `.max-lg\:hidden{display:none}` sits at 30818, inside `@media not all and (min-width:901px)`.
  - Both are emitted and both sort after the top-level `.inline-flex` (13021), so they win.
  - `.lg\:inline-flex` is no longer emitted. `.xl\:inline-flex` (31759) survives only because Tailwind scans the literal in `visibility.test.tsx`; it is a dead rule and harmless.
- **Browser probe** (`next start`; Playwright `Desktop Chrome` and `Pixel 7` profiles; `/`, `/en`, `/tesekkurler?form=hire`):

  | width | header secondary | slim-bar phone / e-mail | header height (TR) |
  |---|---|---|---|
  | 390 | `display:none` | `none` / `none` | 71 |
  | 900 | `none` | `none` / `none` | 71 |
  | 901 | `none` | `flex` / `flex` | 113 |
  | 1000 | `none` | `flex` / `flex` | 79 |
  | 1100 | `none` | `flex` / `flex` | 79 |
  | 1101 | `flex` | `flex` / `flex` | 71 (EN 107) |

  - The results are identical on both profiles and all three pages. `scrollWidth − clientWidth` is 0 at every width, and there are no console errors or hydration warnings.
  - The review's prediction holds. The nav used to be 113 px at every width from 901 to 1100; it is now one line (79 px) from 1000.
- **e2e** (`e2e/chrome.spec.ts:73-96`): 10/10 pass (5 cases × 2 projects).
  - The secondary CTA is picked by `getByRole('banner').getByRole('link', { name })`.
  - The phone is picked by role and name inside the slim bar's root (`div.bg-navy`, `.first()`).
  - No label id is used.
  - The pair cannot pass vacuously. `getByRole` skips hidden nodes, so a mis-scoped locator would pass the `not.toBeVisible()` half but fail the `toBeVisible()` half.
  - Mutation check: I swapped the pre-fix class strings back into the live DOM. Both `not.toBeVisible()` assertions (1100 and 900) then fail on both profiles, so the case discriminates the bug.
- **jsdom guard** (`src/design/chrome/__tests__/visibility.test.tsx`).
  - **RED, reproduced independently.** HEAD's file dropped into a `f798495` copy fails 2 of 4: both variants report exactly the three pre-fix strings (slim-bar phone, slim-bar e-mail, header secondary). It is GREEN at HEAD.
  - **Walk.** `it.each(['default','minimal'])` renders `SiteChrome` through `renderWithIntl`, and `container.querySelectorAll('*')` covers 243 / 219 elements (168 / 160 of them with a class). Both `max-*:hidden` anchors are present in both variants. The rail and FAB appear in `default` only, so both variants really render.
  - **Checker edge cases** (18, scratch copy). Flagged: `hidden inline-flex`, `hidden\n inline-flex`, and `hidden` + `block|contents|inline|table|grid|inline-grid|inline-block`. Legal: `hidden md:flex`, `max-xl:hidden inline-flex`, `lg:hidden flex`, `hidden flex-wrap … lg:flex`, `sm:hidden hover:inline-flex`, `hidden-foo inline-flex`, `!hidden inline-flex` and `''`. This is exactly the brief's rule.
  - **Outside the render sweep.** A static scan of every class literal in the 103 non-test `src/**` files covers ClientIslands, StickyCtaBar, Dialog and forms. It finds 13 literals with a bare `hidden` and 0 offenders.
- **Docs.**
  - `ARCHITECTURE.md:281` carries the brief's sentence verbatim. It sits right after the only `buttonClassName` sentence, in § Design system › Chrome.
  - `:260` (the D20 deltas list) and `:283` now say `max-xl:hidden` for the secondary CTA and "`xl`-only" for the long form. Both match the code.

### 2. W121 — ✅

- `ctas.test.ts:79-83` asserts that no key of `CTA_BY_PATHNAME` contains `[`. On a mutated scratch table with `'/careers/[slug]'` added, it fails with "`/careers/[slug]`: expected true to be false".
- The pre-existing fallback case fails too, because it already pins the only two dynamic keys `pathnames` has today (`routing.ts:16,21`). The new case is the general guard for any future `[…]` key.
- The `ctas.ts:4-11` comment now limits "SSR-consistent" to static keys and says dynamic keys MUST NOT get an entry, citing W121.
- The `ctas.ts` diff is comment-only, and no `export` line changed anywhere in `src/`.

### 3. Minor 2 — ✅

`ARCHITECTURE.md:306` names `[locale]/(site)/error.tsx`, `[locale]/(minimal)/error.tsx` and `app/global-error.tsx`. All three files exist. No other `[locale]/error.tsx` or `[locale]/not-found.tsx` mention remains in `docs/` outside the archive and superpowers folders.

### 4. Minor 3 — ✅

- Both diffs are one-line, comment-only changes.
- `[...rest]/page.tsx:6` now says `(site)/not-found.tsx`, and `(site)/error.tsx:5` says "The (site) group's error boundary".
- The unchanged clause "errors thrown by the layout itself escape to `app/global-error.tsx`" is still true: there is no `[locale]/error.tsx` and no root `app/layout.tsx`.
- A pre-existing nit in the same comment block is parked (P6).

### 5. Minor 4 — ✅

- **Code.** `ContactLink.tsx:20-26` attaches `onAuxClick` only when `contactKindOf(href)` is non-null, and it fires on `e.button === 1` only. `onClick` is byte-identical.
- **Unit tests** (`useContactClick.test.tsx:88,101`). On the pre-fix `ContactLink` the button-1 case is RED (`expected [] to deeply equal [whatsapp_click]`). The button-2 case is a guard and passes on both. `toEqual([one entry])` pins "exactly once".
- **Real Chromium** (WhatsApp FAB at 1000 px, since it is `lg:flex xl:hidden`; wa.me requests aborted):
  - middle-click adds 1 `whatsapp_click`;
  - right-click adds 0;
  - left-click adds 1;
  - the payload is `{event:'whatsapp_click', page:'/', locale:'tr', placement:'whatsapp_fab'}`, with no double count.
- **Type.** The `Omit` also gained `'onAuxClick'` (see concern 2).

### 6. Doc drift — ✅

- `ARCHITECTURE.md:38` adds the `forms/` row to the tree. The symbols it names exist: `createFormAction` at `action.ts:109`, `FormShell`, `Field`, and `post.ts`/`wire.ts`.
- `:48` is the brief's sentence verbatim. § Forms flow (D11) exists at `:201`.
- `:151` now says "19 entries today; `/blog` is never in this set — `rules.json` keeps it, R53". The data agrees:
  - `redirects/gone.json` has 19 entries and none mention blog;
  - `rules.json` has 49 rows, including `{"from":"/blog","to":"/blog","disposition":"keep"}`;
  - `e2e/redirects.spec.ts:52-59` asserts `/blog/anything` is not gone;
  - `legacy.json` has 328 rows, which matches `:149`.
- The redirect data is untouched.

### Regression sweep

- **Verify.** HEAD passes 49 files / 328 tests. Per-commit replays in scratch copies (tsc, eslint, prettier, vitest) are all green: `d94a404` 325, `c91efa8` 326, `48f7344` 328, `6a22c01` 328. These match the report exactly.
- **Build.** `npm run build` is green (13/13 static pages).
- **Diff scope.** `git diff --stat f798495..HEAD` shows 12 files, +160/−22. `CLAUDE.md`, `docs/superpowers/**`, the ruling log and `produces-final.md` are untouched. The controller's saved diff is identical to `git diff f798495..HEAD`.
- **Commits.** The four commits cite W119, W121 and Minor 2–4, and carry the brief's `Co-Authored-By: Claude Fable 5.1` trailer.
- **JS size** (W120 method: gzip-9 over `<script src>`, excluding `noModule`):

  | routes | gz-9 | br-11 |
  |---|---|---|
  | `/`, `/en`, `/isci-talebi`, `/en/hire-workers` | 167,097 B | 144,296 B |
  | `/tesekkurler?form=hire` | 167,488 B | 144,652 B |

  That is +25 B gz / +24 B br over W120's `f798495` figures, from the `ContactLink` handler, and far below 204,800 B.

## The implementer's concerns and deviations — verdicts

**Concerns**

1. **The W121 test has no RED phase.** Accepted. It is a pinning guard and the table was never wrong. The mutation above shows it goes RED on a dynamic key.
2. **`Omit<…, 'onAuxClick'>`.** Accepted as a Produces refinement; do not revert.
   - `ContactLink` sets `onAuxClick` after `{...rest}`, so a caller's `onAuxClick` would be silently dropped, and replaced by `undefined` for a non-contact href.
   - The `Omit` makes that visible in the type, for the same reason `onClick` is omitted.
   - No caller passes it: 10 `ContactLink` call sites, 0 `onAuxClick`. Task 5's planned `ContactCta` (`task-5-brief.md:1749-1815`) passes only href, placement, className, aria-label, target and rel, so it compiles unchanged.
   - Correction: the report says "the brief explicitly directed exactly this addition". The brief directed the handler, not the `Omit`.
   - The controller should record the refinement in `produces-final.md` (Task 3 block) and in `task-5-additions.md`, because `task-5-brief.md:37` quotes the old signature. P5 below also lists the fifth `chrome.spec.ts` case.
3. **`ARCHITECTURE.md:133` "Forms → Operations intake — designed, not yet built".** Confirmed stale.
   - The § heading at `:201` reads "Forms flow (D11) — built in WP2a (`src/forms/`)".
   - The fix round's own `:48` sentence says the kernel was built in Task 2.
   - `createFormAction` and the server-only `post.ts` exist.
   - Yes, the controller should fix this line in the close-out docs commit. It is one line, and the wording should stay code-factual (for example "built in WP2a Task 2 — `src/forms/`, server-only; see § Forms flow (D11) below"), leaving live/flag status to `WORKSPACE-STATE.md`.

Concern 4 (the original Concern 5 is now resolved) is correct.

**Deviations**

1. **The ~259/~282 wording.** Accepted. Verified at `f798495`: neither line contained `xl:inline-flex`; both said "`xl`-only". Both now name `max-xl:hidden`.
2. **The real TR bundle plus an ESLint exemption.** Accepted.
   - The golden fixture carries only `desktopNav`, so it would skip most chrome groups.
   - The exemption is an exact path with the siblings' rationale, and the comment's "three" became generic.
   - A `readFileSync` load (the `ctas.test.ts` pattern) would have avoided growing the list; that is optional.
3. **A token `Set` instead of a regex.** Accepted. The 18 edge cases show the same semantics as the brief's rule, and splitting on whitespace is newline-safe.
4. **Editing the file's top doc block.** Accepted. It is the block that carried the "edit its entry here" invitation, and the declaration has no comment of its own.
5. **The tree-column plateau.** Accepted as cosmetic. The tree already has plateaus (e2e/public/redirects) and a jump (lib → messages).

## New findings (Critical / Important / Minor) — or "none"

**Critical:** none. **Important:** none.

**Minor** (all optional; none blocks close-out):

1. **e2e selector keyed to data and styling (test brittleness).**
   - The W119 case scopes the phone link through a styling class (`div.bg-navy` + `.first()`) and names it by `settings.phoneDisplay` (`'+90 501 124 03 40'`).
   - That is bundle data, and it becomes Operations-editable in Phase B.
   - A settings edit or a slim-bar restyle breaks the case. It breaks loudly (the visible half fails), and it follows the file's existing bundle-copy literals.
   - `locator('a[href^="tel:"]')` inside the scope would decouple it from the number.
2. **Guard comment over-generalises (nit).**
   - `visibility.test.tsx:24-29` says `hidden` "only wins … when that utility carries a variant prefix". "That utility" is ambiguous, and the claim is not generally true.
   - The built CSS orders the display utilities alphabetically: `.block` 12856, `.contents`, `.flex` 12904, `.grid`, `.hidden` 12942, `.inline` 12963, `.inline-flex` 13021. So a bare `hidden` does beat `block`, `contents`, `flex` and `grid` today.
   - The rule itself (ban every pair) is right, because that order is an implementation accident. Only the explanation generalises from `inline-flex`.
3. **Report ledger line.** "Ledger figures" says this round leaves 167,072 B unchanged, but it touched two client components. Measured at `6a22c01`: 167,097 B gz-9 / 144,296 B br-11 (+25 / +24 B). Record the HEAD figure in the ledger.

## Parked for the WP2a final review

- **P1. W119's wider family: same-property collisions.** These are pre-existing (WP1-inherited), not introduced by this round.
  - A CSSOM audit of the chrome (1440 px, `/` and `/tesekkurler`) finds 8 collision signatures. Five resolve as intended:
    - `bg-ink` over `bg-blue-safe`, by alphabetical accident;
    - `mb-*` over `m-0`, because the shorthand sorts first;
    - `focus:absolute` over `focus:not-sr-only`, because more-properties sorts first.
  - Three lose:
    - (a) **Header primary hover.** The primary variant's `hover:bg-ink` (28759) sorts after the header's `hover:bg-blue-safe` (28692). Computed: resting ink rgb(22,32,46), hovered ink rgb(22,32,46). The designed blue hover never shows (`HeaderCtas.tsx:8`, since WP1 `ba2c8b5`).
    - (b) **Slim-bar pills** (`/temsilci-dogrulama`, `/portal-girisi`). `LINK`'s `text-white/70` (23113) beats `PILL`'s `text-sky` (22307), so they render white/70 instead of sky (`SlimBar.tsx:20`; the same strings are on `main`).
    - (c) **Footer store badges.** `FLINK`'s `text-white/60` beats `STORE`'s `text-white` (`Footer.tsx:27`, WP1 `1cec5f1`).
  - Recommendation:
    - Widen W119's rule to "never append a utility for a property the base string already sets at the same variant — Tailwind orders by variant, property and name, never by position in the class string".
    - Fix (a)–(c) with a dedicated variant (for example a nav Button variant `bg-ink text-white hover:bg-blue-safe`) or by dropping the base class.
    - This matters before Task 5, whose `ContactCta` and `StickyCtaBar` compose `buttonClassName(variant, size, className)` with caller classes.
- **P2. W119 guard reach.**
  - The render sweep sees only `SiteChrome`'s first render: not ClientIslands, `StickyCtaBar`, an open MobileNav, or Task 5 blocks.
  - Its list omits `inline-table|flow-root|list-item|table-row|table-cell`, which are not flagged.
  - The static scan finds 0 offenders today. For Task 5, extend the list and/or add a static class-literal scan over `src/` (it covers blocks without rendering them).
  - Tailwind also scans test files, which is why `.xl\:inline-flex` is still emitted. This is negligible.
- **P3. IA note.** The fix restores the design's gap: at 901–1100 the top chrome has no route to `/partner-with-us`. The secondary is hidden, the desktop row excludes the promoted route and the hamburger is hidden. The footer carries 2 links. This is design-faithful (`.ja-nav-cta-secondary` is hidden at ≤1100) and is for owner/pixel-pass awareness only.
- **P4. Pixel pass, beside the parked "header wrap 901–999".** All of these predate this round, because the elements were already visible at these widths.
  - The header is 113 px at 901 (79 px at 1000–1100).
  - The EN header wraps at 1101 to about 1149 (107 px) once "Partner With Us" appears.
  - The TR slim bar is two lines (64 px) at 901–1100; EN is 38 px at 1100.
- **P5. Controller-owned doc sync.**
  - `produces-final.md` (Task 3 block) and `task-5-additions.md` have no W119, W121 or `ContactLink` `Omit` line.
  - `task-5-brief.md:37` quotes the old `ContactLink` signature.
  - The Produces block says `chrome.spec.ts` has four cases; it now has five (additive and brief-directed).
  - `ARCHITECTURE.md:133` needs the concern 3 fix.
- **P6. Pre-existing comment nit.** `(site)/[...rest]/page.tsx:3-4` says an unmatched URL "renders the root `app/not-found.tsx`". That file never existed in any ref (`git log --all`); Next's built-in `/_not-found` is what renders. Fix it on the next touch.
