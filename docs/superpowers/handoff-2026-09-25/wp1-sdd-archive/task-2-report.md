# Task 2 report — Design tokens, Tailwind theme, fonts, reduced motion

## What I implemented

1. **`src/design/contrast.ts`** — `luminance(hex)` and `contrastRatio(a, b)`, transcribed
   verbatim from the brief (WCAG relative-luminance formula).
2. **`src/design/tokens.test.ts`** — transcribed verbatim from the brief: 10 contrast pairs
   (AA 4.5 for body/text pairs, 3.0 for white-on-brand-blue large text), a desktop-scale
   test (`×0.75`, 11px floor) over every entry in `tokens.type`, and a breakpoint-shape test.
3. **`src/design/tokens.ts`** — transcribed verbatim from the brief: `color`, `radius`,
   `shadow`, `breakpoint` (min-width, unscaled), `type` (mobile/desktop pairs via the `px()`
   helper), `heading` (clamp() pairs, every term pre-scaled ×0.75 for desktop), `layout`.
4. **`src/app/globals.css`** — brief's `@theme` block (colours/radii/shadows/breakpoints/
   fonts) kept verbatim, with **Controller Ruling R3** applied to the responsive type scale:
   - `:root` and its `@media (min-width: 1101px)` override now declare `--fs-body`,
     `--fs-body-lg`, `--fs-body-sm`, `--fs-card-title`, `--fs-stat`, `--fs-eyebrow`,
     `--fs-h1`, `--fs-h2`, `--fs-h2-process` (same values as the brief; `--gutter` unchanged).
   - Added a second `@theme inline { … }` block right after the main `@theme` block, mapping
     `--text-*` → `var(--fs-*)` exactly as R3 specifies, so Tailwind 4 generates the
     `text-body`, `text-body-sm`, `text-eyebrow`, `text-card-title`, `text-stat`, `text-h1`,
     `text-h2`, `text-h2-process` utilities later tasks need.
   - `html { font-size: var(--fs-body); }` (brief said `var(--text-body)`; per R3 this must
     reference `--fs-body` since `--text-body` is now the Tailwind-derived alias).
   - `.container-site`, the heading font rules (`h1,h2,h3,h4`), and the reduced-motion block
     kept exactly as the brief wrote them.
5. **`src/app/[locale]/layout.tsx`** — added the `Archivo` import (`latin`, `latin-ext`
   subsets; weights 500/600/700/800; `display: 'swap'`; `variable: '--font-archivo'`) and
   `className={archivo.variable}` on `<html>`. Everything else in the file (Task 1's routing,
   `generateStaticParams`, `NextIntlClientProvider`) is untouched.

## TDD evidence

**RED** — `npm run test -- src/design/tokens.test.ts` (contrast.ts + tokens.test.ts written,
tokens.ts not yet created):

```
 FAIL  src/design/tokens.test.ts [ src/design/tokens.test.ts ]
Error: Failed to resolve import "./tokens" from "src/design/tokens.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: .../src/design/tokens.test.ts:3:23
  1  |  import { describe, expect, it } from "vitest";
  2  |  import { contrastRatio } from "./contrast";
  3  |  import { tokens } from "./tokens";
     |                          ^
  4  |  const { color } = tokens;
...
 Test Files  1 failed (1)
      Tests  no tests
```

**GREEN** — same command, after writing `tokens.ts`:

```
 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  21:47:19
   Duration  452ms
```

(12 = 10 contrast pairs + the desktop-scale test + the breakpoint-shape test, matching the
brief's `tokens.test.ts` exactly.)

## `npm run verify` output summary

```
> tsc --noEmit                    → clean
> eslint .                        → clean
> prettier --check .              → "All matched files use Prettier code style!"
> vitest run                      → Test Files  3 passed (3)
                                     Tests  16 passed (16)
```

All 16 tests across 3 files (the pre-existing suite + the new `tokens.test.ts`) pass. The only
console noise is the pre-existing Vitest `configLoader: 'native'` warning about
`vitest.config.ts` ESM/CJS resolution — present before this task, unrelated to these changes,
and already known to the controller. No EBADENGINE warning appeared in this run (local Node is
v25.8.2 against the repo's `engines: "node": "22.x"`; npm did not surface a warning for the
`run` subcommands used here).

`npm run format:write` was run on the touched files before `verify`; all five were already
correctly formatted (Prettier reported "unchanged" for each).

## Files changed

- Created: `src/design/tokens.ts`, `src/design/tokens.test.ts`, `src/design/contrast.ts`
- Modified: `src/app/globals.css`, `src/app/[locale]/layout.tsx`

## README vs brief — mismatches noticed

None. Cross-checked `design-package/README.md` §"Design tokens" (colour table, typography
table, radius, shadow, breakpoints) against every value in the brief's `tokens.ts` and
`globals.css` — all hex codes, radii, shadow values, and breakpoint numbers match verbatim.

One **intentional** divergence, already flagged by the brief and governed by CLAUDE.md D20:
the README's typography table lists the eyebrow label colour as `#1899D5` (raw brand blue),
but the brief's `tokens.ts`/`globals.css` correctly do NOT use raw blue for eyebrow text
anywhere — `color.blueSafe` (`#1073a8`) is the token used for eyebrow/text contexts per D20
(accessibility-over-pixel-fidelity). This is not a transcription error; it's the documented
accessibility override. The `tokens.test.ts` pair `[color.blueSafe, color.white, 4.5, 'eyebrow/blue-safe on white']`
confirms the safe colour clears AA; raw `#1899D5` on white would not.

Other brief values that are midpoints of a README range (body large 17.5 of 16–17.5, body
small 13.5 of 13–13.5, card title 18.5 of 18–19, eyebrow/micro 12 of 11–12.5) are the
controller's already-chosen transcription, not something this task re-derives — reproduced
verbatim as instructed.

## Self-review findings

- **Completeness:** all three new files present with every field the brief specifies; both
  CSS blocks (`@theme`, `@theme inline`) and the reduced-motion block present; R3's three
  numbered requirements all applied (variable renaming, the inline theme block placed
  immediately after the main `@theme` block, `html { font-size: var(--fs-body) }`).
- **Quality:** naming matches the brief/R3 exactly (`--fs-*`, `--text-*`, `tokens.color`,
  `tokens.type`, etc.). No renaming, no restructuring.
- **Discipline:** nothing added beyond the brief + R3. `layout.tsx` untouched apart from the
  font import and the `className` prop, as instructed.
- **Testing:** the test suite exercises real behaviour — actual WCAG contrast-ratio math
  against the shipped hex values (not mocked), the actual `×0.75`/11px-floor arithmetic
  against every `tokens.type` entry, and a structural check on `tokens.breakpoint`. Output is
  pristine apart from the pre-existing `configLoader` warning.
- No issues found requiring a fix before commit.

## Concerns

None. `next build` and Playwright were intentionally not run, per instructions — only
`npm run verify` was used for verification. The Archivo Google Fonts download was not
exercised (that only happens under `next build`/`next dev`), so I cannot independently confirm
network access to Google Fonts from this environment; if a later task's `next build` fails to
fetch it, that is a network-access finding for that task, not a defect in this one's config.

## Commit

`fb0e6af` — `feat(design): tokens, Tailwind theme, Archivo (latin-ext), reduced-motion baseline`
(local only, not pushed, per instructions).
