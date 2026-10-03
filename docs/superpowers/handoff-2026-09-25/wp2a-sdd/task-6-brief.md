### Task 6: Client islands + build-time assets (T0d, last two bullets)

Nine accessible client islands under `src/design/islands/`, a build-time asset pipeline (sourcing-map SVG pre-rendered from `design-package/design/source-map.js` + LK, a local flag sprite, a local QR encoder, local brand files), and the "no runtime external fetch" rule written into `docs/ARCHITECTURE.md`. Rulings in force: **W1** (13 source countries = source-map.js's 12 + Sri Lanka; Senegal stays), **W8** (Android badge only, iOS hidden), **W9/W23** (islands never carry copy — every label is a prop the page fills from `sys.*` or a package id; that now includes the map's "Türkiye" label), **W10** (visibility by CSS class, not conditional rendering), **W12** (no new analytics events here: print/share/copy are not in the allowlist), **W13 amended** (islands are small; the heavy consumers — calculator, blog TOC/search — are `next/dynamic` on the page side), **W14** (assets at build time only), **W40** (country codes are upper-case ISO2 everywhere — `'PK'`…`'LK'`, `'TR'` — and this task carries the cross-check test against Task 1's `sourceCountries`), **W41** (the dev gallery lives at `src/app/[locale]/(site)/dev/gallery/` after Task 3 — edit the moved `page.tsx`, never create a second one), **W42** (`package.json` scripts are edited additively), **W45** (doc edits anchor on sentences and build on the text Tasks 3 and 5 left), **R16** (brand files live in `public/brand`), **R18/R20** (browser facts read after hydration via `useSyncExternalStore`; reduced motion honoured by the global CSS rule), **R56** (`src/**` never imports `design-package/**` — only `scripts/` reads it).

Working rules for the executor: repo `jobsadmire-website`, branch `wp2/foundation` (after Tasks 1–5 have landed (Task 7 runs after this task and consumes its `assets:*` scripts) — this task runs after Task 5's gallery edits and Task 3's route-group move); **one build/test job at a time** (Mac Studio memory rule); `npm run verify` before every commit; the design package is read only from `scripts/`; `npm run dev` appends a `nextjs-agent-rules` block to `CLAUDE.md` — revert it before every commit.

**Files:**

Create

- `src/design/islands/RangeSlider.tsx`, `Stepper.tsx`, `TriState.tsx`, `ProgressBar.tsx`, `BottomSheet.tsx`, `SearchInput.tsx`, `useScrollProgress.ts`, `ScrollSpyToc.tsx`, `ShareRow.tsx`, `PrintButton.tsx`, `index.ts`
- `src/design/islands/__tests__/RangeSlider.test.tsx`, `Stepper.test.tsx`, `TriState.test.tsx`, `ProgressBar.test.tsx`, `BottomSheet.test.tsx`, `SearchInput.test.tsx`, `ScrollSpyToc.test.tsx`, `ShareRow.test.tsx`, `PrintButton.test.tsx`
- `src/design/assets/source-map-codes.ts`, `src/design/assets/flag-codes.ts`, `src/design/assets/source-map.ts`, `src/design/assets/source-map.generated.tsx` (generated, committed), `src/design/assets/brand.ts`, `src/design/assets/__tests__/source-map-codes.test.ts` (the W40 cross-check)
- `src/design/Flag.tsx`, `src/design/__tests__/Flag.test.tsx`, `src/design/QrCode.tsx`
- `src/lib/qr.ts`, `src/lib/qr.test.ts`
- `scripts/build-flags.ts`, `scripts/build-flags.test.ts`, `scripts/build-source-map.ts`, `scripts/build-source-map.test.ts`, `scripts/fetch-brand.sh`
- `public/brand/flags.svg` (generated, committed), `public/brand/logo.png` + `public/brand/iskur.png` (fetched once, committed), `public/brand/google-play.svg` (hand-authored from the design's inline glyph)
- `.gitattributes` (new file)
- `src/app/[locale]/(site)/dev/gallery/IslandsDemo.tsx` (W41 path)

Modify

- `src/design/primitives/Dialog.tsx` — the function head (`export function Dialog({ … }: { … }) {`) and the two container `<div>`s of the return; optional `variant?: 'center' | 'sheet'`
- `src/design/primitives/__tests__/Dialog.test.tsx` — one more `it` at the end of the `describe('Dialog')` block
- `src/design/chrome/icons.tsx` — append `XIcon`, `LinkIcon` at the end of the file (after Task 5's `CheckIcon`/`ClockIcon` appends)
- `src/app/globals.css` — append at the end of the file (after Task 3's `--fs-nav` additions inside the existing blocks and anything Task 5 appended): source-map animations + print end-states, print isolation
- `.prettierignore` — append one line; `eslint.config.mjs` — one entry inside `globalIgnores([...])`
- `package.json` — three `scripts` entries (additive Edits, W42), one `dependencies` entry, eight `devDependencies` entries
- `src/app/[locale]/(site)/dev/gallery/page.tsx` — four imports after Task 5's `import { Wp2Blocks } from './Wp2Blocks';`; two new `Block`s after the `Dialog (client wrapper) / SkipLink` block
- `docs/ARCHITECTURE.md` (§ Design system — append one paragraph after Task 5's; the "Pages:" paragraph — one fragment; new § Assets), `docs/PRD.md` (§ 11 Design-system bullet, two fragments)

Test

- the nine island tests, `src/design/__tests__/Flag.test.tsx`, `src/design/assets/__tests__/source-map-codes.test.ts`, `src/lib/qr.test.ts`, `scripts/build-flags.test.ts`, `scripts/build-source-map.test.ts`, the extended `Dialog.test.tsx`

**Interfaces:**

Consumes (verified against `main @ ad58fb8` unless marked with the producing task)

- `Button({ variant, size?, href?, external?, type?, disabled?, prefetch?, className?, children, ...HTMLAttributes<HTMLElement> })`, `type ButtonVariant` (`'primary' | 'secondary' | 'ghost' | 'danger'`, plus `'inverse'` after Task 5) and `Dialog({ open, onClose, titleId, children })` from `@/design/primitives` (`src/design/primitives/Button.tsx:25–37`, `Dialog.tsx:7–17`; Task 5 edits the barrel additively — W39 — so `Dialog` stays exported).
- `CloseIcon`, `WhatsAppIcon`, `LinkedInIcon` from `@/design/chrome/icons` (`src/design/chrome/icons.tsx:53,62,104`); the file-local `type IconProps = { size?: number; className?: string }` and the `base()`/`stroke` helpers (lines 4–15) — not exported, used only inside the file.
- Tailwind theme utilities from `src/app/globals.css` (`rounded-pill`, `rounded-input`, `rounded-t-hero` from `--radius-hero`, `text-body`, `text-body-sm`, `text-card-title`, `text-eyebrow`, `bg-tint`, `border-tint-border`, `text-blue-safe`, `accent-blue-safe`, `border-border-1`, `border-border-2`, `bg-border-3`, `bg-pale-1`, `text-text-secondary`, `text-text-tertiary`, `text-success-text`, `bg-success`/`bg-warning`/`bg-danger`, `shadow-hero-form`, `sr-only`, `peer-*`); the global reduced-motion rule (lines 121–131) collapses every animation to a single 0.01 ms run.
- The R18 pattern `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` from `src/design/chrome/StickyCtaBar.tsx:12–33`.
- `scripts/` may import `src/**` (`scripts/build-redirects.ts:3` imports `../src/i18n/routing`); `__dirname` and `require.main === module` are the sanctioned script idioms (`scripts/import-design-package.ts:4,135`, `scripts/build-redirects.ts:94–96`); `__dirname` also works in `*.test.ts` under Vitest (`src/content/lint.test.ts:11`), and `readFileSync` over `src/content/local/bundle.tr.json` is the sanctioned lint-rule bypass (`eslint.config.mjs` comment, lines 26–31).
- `vitest.setup.ts` registers `afterEach(cleanup)` globally (R25) — island tests do not repeat it.
- **Task 1** (`@/content/collections`): `getCollection(bundle, 'sourceCountries')` → 13 rows `{ code: string /* ISO2 upper-case, /^[A-Z]{2}$/ */; nameId: string | null; name: string /* locale-resolved */; lon: number; lat: number; flag: string }` in the order `PK NP IN UZ KG TM PH ID RU ML SN CM LK` (task-1.md `SourceCountrySchema`, importer test "emits 13 source countries"); the committed `src/content/local/bundle.tr.json` carries them under `collections.sourceCountries`.
- **Task 3**: the gallery is `src/app/[locale]/(site)/dev/gallery/page.tsx` (route groups, W19/W41); `Header` there takes `{ locale, bundle }` only.
- **Task 5**: `src/app/[locale]/(site)/dev/gallery/page.tsx` has `import { Wp2Blocks } from './Wp2Blocks';` after `import { DialogDemo } from './DialogDemo';` and renders `<Wp2Blocks bundle={bundle} locale={locale} />`; `icons.tsx` ends with Task 5's `CheckIcon`/`ClockIcon`; `docs/ARCHITECTURE.md` § Design system is Task 5's "`src/design/` — tokens (…), **14** accessible primitives … `src/lib/format/date.ts` (…) always UTC calendar dates; it imports both message files, so only server components and tests use it." paragraph; `docs/PRD.md` § 11's Design-system bullet reads "… 14 accessible primitives (`RadioChips` joined in WP2a T0d) and the shared page blocks (`src/design/blocks/`), the shared chrome (…), the 901px (header row, W11) / 1101px (D19 scale, social rail) breakpoint scheme." (Task 5 + Task 3 wording).

Produces (the WP2b pages and Task 5's blocks rely on these — exact names, paths, signatures)

```ts
// src/design/islands/index.ts  (every island is 'use client' unless noted; every label is a prop — W9)
export { RangeSlider, type RangeSliderProps } from './RangeSlider';
//   RangeSlider({ id, label, min, max, step = 1, value, onChange(value: number), formatValue?(v: number): string,
//                 minLabel?, maxLabel?, hint?, className? })   — real <input type="range">, aria-valuetext = formatValue(value)
export { Stepper, type StepperProps } from './Stepper';
//   Stepper({ id, label, value, onChange(value: number), min, max, step = 1, decrementLabel, incrementLabel, hint?, className? })
//     — real <input type="number"> + two labelled buttons; value clamped to [min,max] on every change; buttons disabled at bounds
export { TriState, type TriStateProps, type TriStateValue } from './TriState';
//   type TriStateValue = 'yes' | 'no' | 'unsure';
//   TriState({ name, legend, value: TriStateValue | null, onChange(v: TriStateValue), labels: Record<TriStateValue,string>, hideLegend?, className? })
//     — <fieldset>/<legend> + three real radios (sr-only) styled as chips
export { ProgressBar, type ProgressBarProps, type ProgressTone } from './ProgressBar';   // no hooks, no directive: usable from server components too
//   type ProgressTone = 'blue' | 'green' | 'amber' | 'red';
//   ProgressBar({ value, max = 100, label, valueText?, tone = 'blue', className? })  — role="progressbar" aria-valuenow/min/max, aria-label = label
export { BottomSheet, type BottomSheetProps } from './BottomSheet';
//   BottomSheet({ open, onClose, title, closeLabel, children, className? })  — Dialog variant="sheet": focus trap, Escape, scroll lock, restore
export { SearchInput, type SearchInputProps } from './SearchInput';
//   SearchInput({ id, label, value, onChange(value: string), placeholder?, clearLabel, resultText?, hideLabel?, className? })
//     — <input type="search">; clear button when non-empty; Escape clears; resultText in a polite live region
export { ScrollSpyToc, type ScrollSpyTocProps, type TocHeading } from './ScrollSpyToc';
//   type TocHeading = { id: string; text: string };
//   ScrollSpyToc({ headings, label, heading?, readMinutes?, remainingLabel?(minutesLeft: number): string, offsetPx = 96, className? })
//     — <nav aria-label={label}> of #id links; aria-current="location" on the active heading; "≈ N min left" from readMinutes × (1 − progress)
export { ShareRow, type ShareRowProps, type ShareLabels } from './ShareRow';
//   type ShareLabels = { heading: string; share: string; whatsapp: string; linkedin: string; x: string; copy: string; copied: string };
//   ShareRow({ url, title, labels, className? })  — Web Share button when navigator.share exists (client-only fact), else wa.me / LinkedIn / X intents; Copy → clipboard + role="status" "Copied"
export { PrintButton, type PrintButtonProps } from './PrintButton';
//   PrintButton({ label, variant = 'secondary', className? })  — adds body.print-isolating, window.print(), removes on afterprint;
//     the page marks the printable region with className="print-isolate" and non-printing controls with "print-hidden"
export { useScrollProgress } from './useScrollProgress';   // (): number — 0…1 document scroll progress, 0 on the server (R18)

// src/design/primitives/Dialog.tsx — additive
Dialog({ open, onClose, titleId, children, variant?: 'center' | 'sheet' })   // 'center' is the existing rendering; 'sheet' docks to the bottom edge

// src/design/chrome/icons.tsx — additive (IconProps = { size?: number; className?: string }, file-local as today)
export function XIcon(props: IconProps): React.JSX.Element; export function LinkIcon(props: IconProps): React.JSX.Element;

// src/design/assets/source-map-codes.ts  (client-safe, no fs; W40: upper-case ISO2, same order as Task 1's sourceCountries)
export const SOURCE_MAP_CODES = ['PK','NP','IN','UZ','KG','TM','PH','ID','RU','ML','SN','CM','LK'] as const;   // W1: source-map.js's 12 + LK
export type SourceMapCode = (typeof SOURCE_MAP_CODES)[number];
export function isSourceMapCode(code: string): code is SourceMapCode;
export const SOURCE_MAP_POINTS: Record<SourceMapCode, { lon: number; lat: number; atlasId: string }>;   // design coordinates + world-atlas numeric id
export const TURKIYE_POINT: { readonly lon: 35.2; readonly lat: 39; readonly atlasId: '792' };
export function sourceMapLabels(countries: ReadonlyArray<{ code: string; name: string }>): Record<SourceMapCode, string>;
//   = Object.fromEntries over Task 1's sourceCountries rows, checked complete: a missing code throws outside production, falls back to the code in production.
//   Pages: `labels={sourceMapLabels(getCollection(bundle, 'sourceCountries'))}`.

// src/design/assets/source-map.ts  (what pages import: `import { SourceMap, sourceMapLabels } from '@/design/assets/source-map'`)
export { SourceMap, SOURCE_MAP_MARKERS, SOURCE_MAP_VIEWBOX, type SourceMapProps } from './source-map.generated';
export { SOURCE_MAP_CODES, SOURCE_MAP_POINTS, isSourceMapCode, sourceMapLabels, type SourceMapCode } from './source-map-codes';
//   SourceMap({ title, labels: Record<SourceMapCode, string>, turkiyeLabel, id = 'source-map', className? })  — server component (no hooks, no directive),
//     inline <svg viewBox="0 0 640 397" role="img" aria-labelledby>; every marker <g data-country="<CODE>"> carries <title>{labels[CODE]}</title>;
//     the Türkiye marker is <g data-country="TR"> with <title>{turkiyeLabel}</title> and the visible map label {turkiyeLabel} (W9: the design's
//     hard-coded "Türkiye" becomes a prop — pass t('<package id>') or the literal, both locales spell it the same);
//     arcs dash in, dots pulse (CSS, reduced-motion + print safe)
//   SOURCE_MAP_MARKERS: Record<SourceMapCode | 'TR', { x: number; y: number }>;  SOURCE_MAP_VIEWBOX = { width: 640, height: 397 }

// src/design/assets/flag-codes.ts
export const FLAG_CODES = [...SOURCE_MAP_CODES, 'TR'] as const;  export type FlagCode = (typeof FLAG_CODES)[number];
export function isFlagCode(code: string): code is FlagCode;   // Task 1's `code: string` rows → `Flag` (which wants FlagCode) go through this guard
// src/design/Flag.tsx (no hooks, no directive — server or client)
export function Flag({ code: FlagCode, size = 20, label?: string, className? }): React.JSX.Element   // <svg><use href="/brand/flags.svg#flag-<CODE>"/></svg>, 4:3, decorative unless label

// src/lib/qr.ts (pure, no 'server-only' so it is unit-testable; call it from server components only — QrCode.tsx is the door)
export type QrOptions = { size?: number; margin?: number; dark?: string; light?: string | null; label?: string };
export function qrSvg(text: string, options?: QrOptions): string   // deterministic <svg …> string, ECC M, `qrcode` package, no client JS
// src/design/QrCode.tsx ('server-only')
export function QrCode({ text, label, size = 86, className? }): React.JSX.Element

// src/design/assets/brand.ts
export const BRAND = {
  mark:       { src: '/brand/ja-mark.png',    width: 336, height: 285 },
  logo:       { src: '/brand/logo.png',       width: 742, height: 146 },   // JobsAdmire's own logo, fetched once from the live site
  iskur:      { src: '/brand/iskur.png',      width: 320, height: 320 },   // the İŞKUR licence mark the live site already displays
  googlePlay: { src: '/brand/google-play.svg', width: 24, height: 24 },   // the design's inline Play glyph; W8: no App Store file
  flags: '/brand/flags.svg',
} as const;

// package.json scripts (added beside "redirects:build"; Task 7 lists them in its final block, W42)
"assets:brand": "bash scripts/fetch-brand.sh"       // one-time fetch of logo.png + iskur.png (committed; never runs in the build)
"assets:flags": "tsx scripts/build-flags.ts"        // regenerates public/brand/flags.svg from the flag-icons devDependency
"assets:map":   "tsx scripts/build-source-map.ts"   // regenerates src/design/assets/source-map.generated.tsx

// CSS (src/app/globals.css): .source-map__arc / .source-map__pulse animations with @media print end-states;
//   body.print-isolating + .print-isolate / .print-hidden print isolation

// Sprite ids (public/brand/flags.svg): <symbol id="flag-PK" viewBox="0 0 640 480"> … one per FLAG_CODES entry, upper-case (W40)
```

---

#### Cycle 1 — form-control islands: `RangeSlider`, `Stepper`, `TriState`, `ProgressBar`

- [ ] **Step 1: Write the failing tests**

`src/design/islands/__tests__/RangeSlider.test.tsx`

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RangeSlider } from '../RangeSlider';

describe('RangeSlider', () => {
  it('is a real range input, labelled, with a formatted aria-valuetext', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        id="salary"
        label="Gross salary"
        min={30000}
        max={78000}
        step={500}
        value={33030}
        onChange={onChange}
        formatValue={(v) => `₺${v}`}
        minLabel="₺30,000"
        maxLabel="₺78,000"
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Gross salary' });
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '30000');
    expect(slider).toHaveAttribute('max', '78000');
    expect(slider).toHaveAttribute('step', '500');
    expect(slider).toHaveAttribute('aria-valuetext', '₺33030');
    // The visible value is the same formatted string, in an <output> bound to the input.
    expect(screen.getByText('₺33030')).toHaveAttribute('for', 'salary');
    fireEvent.change(slider, { target: { value: '40000' } });
    expect(onChange).toHaveBeenCalledWith(40000);
  });

  it('falls back to the raw number when no formatter is given', () => {
    render(<RangeSlider id="n" label="N" min={0} max={10} value={3} onChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '3');
  });
});
```

`src/design/islands/__tests__/Stepper.test.tsx`

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from '../Stepper';

const labels = { decrementLabel: 'Fewer', incrementLabel: 'More' };

describe('Stepper', () => {
  it('renders a labelled number input and two labelled buttons', async () => {
    const onChange = vi.fn();
    render(
      <Stepper
        id="headcount"
        label="Headcount"
        value={1}
        onChange={onChange}
        min={1}
        max={500}
        {...labels}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Headcount' });
    expect(input).toHaveValue(1);
    expect(screen.getByRole('button', { name: 'Fewer' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('clamps typed values into [min, max] and steps by `step`', () => {
    const onChange = vi.fn();
    render(
      <Stepper
        id="staff"
        label="Turkish staff"
        value={25}
        onChange={onChange}
        min={0}
        max={5000}
        step={5}
        {...labels}
      />,
    );
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '9999' } });
    expect(onChange).toHaveBeenLastCalledWith(5000);
    fireEvent.click(screen.getByRole('button', { name: 'Fewer' }));
    expect(onChange).toHaveBeenLastCalledWith(20);
  });

  it('disables the increment at max', () => {
    render(
      <Stepper id="h" label="H" value={500} onChange={() => {}} min={1} max={500} {...labels} />,
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeDisabled();
  });
});
```

`src/design/islands/__tests__/TriState.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TriState } from '../TriState';

const labels = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

describe('TriState', () => {
  it('is a fieldset of three real radios named by the legend', async () => {
    const onChange = vi.fn();
    render(
      <TriState
        name="capital"
        legend="Paid-in capital ≥ ₺100,000?"
        value={null}
        onChange={onChange}
        labels={labels}
      />,
    );
    expect(screen.getByRole('group', { name: 'Paid-in capital ≥ ₺100,000?' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    await userEvent.click(screen.getByRole('radio', { name: 'No' }));
    expect(onChange).toHaveBeenCalledWith('no');
  });

  it('reflects the controlled value', () => {
    render(<TriState name="c" legend="Q" value="unsure" onChange={() => {}} labels={labels} />);
    expect(screen.getByRole('radio', { name: 'Not sure' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Yes' })).not.toBeChecked();
  });
});
```

`src/design/islands/__tests__/ProgressBar.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('exposes value/min/max and an accessible name', () => {
    render(<ProgressBar value={3} max={5} label="Checks answered" valueText="3 / 5" />);
    const bar = screen.getByRole('progressbar', { name: 'Checks answered' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });

  it('clamps the visual width into 0–100 %', () => {
    const { container } = render(<ProgressBar value={12} max={10} label="x" />);
    expect(container.querySelector('[role="progressbar"] > div')).toHaveStyle({ width: '100%' });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/design/islands` → four suites fail with `Failed to resolve import "../RangeSlider"` (and `../Stepper`, `../TriState`, `../ProgressBar`).

- [ ] **Step 3: Implement**

`src/design/islands/RangeSlider.tsx`

```tsx
'use client';
import type { ChangeEvent } from 'react';

export type RangeSliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Visible + spoken rendering of the value (D18: pass `formatTRY` for money). */
  formatValue?: (value: number) => string;
  minLabel?: string;
  maxLabel?: string;
  hint?: string;
  className?: string;
};

/** A real `<input type="range">`: arrow/Home/End keys, aria-valuemin/max and the
 *  formatted `aria-valuetext` come from the platform, not from a re-implementation (D20). */
export function RangeSlider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  minLabel,
  maxLabel,
  hint,
  className,
}: RangeSliderProps) {
  const shown = formatValue ? formatValue(value) : String(value);
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-body-sm font-bold">
          {label}
        </label>
        {/* aria-live="off": the slider already announces its valuetext on every step. */}
        <output htmlFor={id} aria-live="off" className="text-body font-extrabold tabular-nums">
          {shown}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={shown}
        aria-describedby={hintId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        className="w-full accent-blue-safe focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-safe"
      />
      {minLabel || maxLabel ? (
        <div aria-hidden="true" className="flex justify-between text-body-sm text-text-secondary">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-body-sm text-text-tertiary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
```

`src/design/islands/Stepper.tsx`

```tsx
'use client';
import type { ChangeEvent } from 'react';

export type StepperProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  decrementLabel: string;
  incrementLabel: string;
  hint?: string;
  className?: string;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const BTN =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-border-1 bg-white text-body font-extrabold text-ink transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe disabled:cursor-not-allowed disabled:opacity-40';

/** Fully controlled: the prop is the only state, every change is clamped into [min, max].
 *  No local text state, so there is no setState-in-effect to keep in sync (R27's rule). */
export function Stepper({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  decrementLabel,
  incrementLabel,
  hint,
  className,
}: StepperProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') return; // mid-edit: keep the last committed value
    const n = Number(e.target.value);
    if (Number.isFinite(n)) onChange(clamp(Math.round(n), min, max));
  };
  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}
    >
      <label id={`${id}-label`} htmlFor={id} className="text-body-sm font-bold">
        {label}
      </label>
      <div className="flex items-stretch">
        <button
          type="button"
          aria-label={decrementLabel}
          disabled={value - step < min}
          onClick={() => onChange(clamp(value - step, min, max))}
          className={`${BTN} rounded-l-input`}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={hintId}
          onChange={onInput}
          className="w-20 border-y border-border-1 text-center text-body font-extrabold tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-safe"
        />
        <button
          type="button"
          aria-label={incrementLabel}
          disabled={value + step > max}
          onClick={() => onChange(clamp(value + step, min, max))}
          className={`${BTN} rounded-r-input`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="text-body-sm text-text-tertiary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
```

`src/design/islands/TriState.tsx`

```tsx
'use client';

export type TriStateValue = 'yes' | 'no' | 'unsure';

export type TriStateProps = {
  name: string;
  legend: string;
  value: TriStateValue | null;
  onChange: (value: TriStateValue) => void;
  labels: Record<TriStateValue, string>;
  hideLegend?: boolean;
  className?: string;
};

const ORDER: TriStateValue[] = ['yes', 'no', 'unsure'];

/** Three real radios styled as chips: the platform gives arrow-key movement and the
 *  group semantics; the visible chip is a sibling of an `sr-only` input (`peer`). */
export function TriState({
  name,
  legend,
  value,
  onChange,
  labels,
  hideLegend = false,
  className,
}: TriStateProps) {
  return (
    <fieldset className={['m-0 min-w-0 border-0 p-0', className].filter(Boolean).join(' ')}>
      <legend className={hideLegend ? 'sr-only' : 'mb-2 text-body-sm font-bold'}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {ORDER.map((v) => (
          <label key={v} className="relative inline-flex">
            <input
              type="radio"
              name={name}
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-text-secondary transition-colors hover:bg-pale-1 peer-checked:border-tint-border peer-checked:bg-tint peer-checked:text-blue-safe peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe">
              {labels[v]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
```

`src/design/islands/ProgressBar.tsx` (no directive — no hooks, so server components may render it)

```tsx
export type ProgressTone = 'blue' | 'green' | 'amber' | 'red';

export type ProgressBarProps = {
  value: number;
  max?: number;
  /** Accessible name of the bar. */
  label: string;
  /** Visible rendering of the value, already localized by the page (e.g. "3 / 5", "%60"). */
  valueText?: string;
  tone?: ProgressTone;
  className?: string;
};

const TONE: Record<ProgressTone, string> = {
  blue: 'bg-blue-safe',
  green: 'bg-success',
  amber: 'bg-warning',
  red: 'bg-danger',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  valueText,
  tone = 'blue',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      {valueText ? (
        <div className="flex justify-between text-body-sm font-bold">
          <span>{label}</span>
          <span className="tabular-nums">{valueText}</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(clamped)}
        className="h-2 w-full overflow-hidden rounded-pill bg-border-3"
      >
        <div
          className={`h-full rounded-pill transition-[width] ${TONE[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
```

`src/design/islands/index.ts` (first version; later cycles append, kept sorted by export name)

```ts
export { ProgressBar, type ProgressBarProps, type ProgressTone } from './ProgressBar';
export { RangeSlider, type RangeSliderProps } from './RangeSlider';
export { Stepper, type StepperProps } from './Stepper';
export { TriState, type TriStateProps, type TriStateValue } from './TriState';
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/islands` → 4 files, 9 tests pass. `npx prettier --write src/design/islands` then `npm run verify` → typecheck, lint, prettier, vitest all green.

- [ ] **Step 5: Commit**

```
git add src/design/islands && git commit -m "feat(islands): RangeSlider, Stepper, TriState, ProgressBar — real inputs, labelled, clamped

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 2 — `Dialog` sheet variant, `BottomSheet`, `SearchInput`

- [ ] **Step 1: Write the failing tests**

`src/design/primitives/__tests__/Dialog.test.tsx` — add a third case after the `keeps focus when an inline onClose changes identity on re-render` case, before the `describe('Dialog')` block's closing `});`:

```tsx
it('docks to the bottom edge as a sheet when asked', () => {
  render(
    <Dialog open onClose={() => {}} titleId="t" variant="sheet">
      <h2 id="t">Sheet</h2>
    </Dialog>,
  );
  const dialog = screen.getByRole('dialog');
  expect(dialog.className).toContain('rounded-t-hero');
  expect(dialog.parentElement?.className).toContain('items-end');
});
```

`src/design/islands/__tests__/BottomSheet.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BottomSheet } from '../BottomSheet';

describe('BottomSheet', () => {
  it('is a named dialog with a labelled close button, and closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Choose a role" closeLabel="Close">
        <button>Welder</button>
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Choose a role' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders nothing while closed', () => {
    render(
      <BottomSheet open={false} onClose={() => {}} title="T" closeLabel="Close">
        x
      </BottomSheet>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
```

`src/design/islands/__tests__/SearchInput.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  it('is a labelled searchbox with a clear button that appears when there is text', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SearchInput
        id="q"
        label="Search articles"
        value=""
        onChange={onChange}
        clearLabel="Clear search"
      />,
    );
    expect(screen.getByRole('searchbox', { name: 'Search articles' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    rerender(
      <SearchInput
        id="q"
        label="Search articles"
        value="permit"
        onChange={onChange}
        clearLabel="Clear search"
        resultText="3 articles"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('3 articles');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('clears on Escape', async () => {
    const onChange = vi.fn();
    render(
      <SearchInput id="q" label="Search" value="abc" onChange={onChange} clearLabel="Clear" />,
    );
    screen.getByRole('searchbox').focus();
    await userEvent.keyboard('{Escape}');
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/design/primitives/__tests__/Dialog.test.tsx src/design/islands` → the Dialog sheet case fails (`expected 'max-h-[90vh] …' to contain 'rounded-t-hero'`); the BottomSheet and SearchInput suites fail to resolve their imports.

- [ ] **Step 3: Implement**

`src/design/primitives/Dialog.tsx` — replace the function head (from `export function Dialog({` through the line `}) {`, i.e. lines 7–17 on main) with:

```tsx
export function Dialog({
  open,
  onClose,
  titleId,
  children,
  variant = 'center',
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
  /** `sheet` docks the panel to the bottom edge (BottomSheet); `center` is the modal. */
  variant?: 'center' | 'sheet';
}) {
```

and replace the two container elements of the return — the `<div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/60 p-4" onMouseDown=…>` and the inner `<div ref={ref} role="dialog" … className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-hero-form">` — with:

```tsx
    <div
      className={[
        'fixed inset-0 z-[100] flex justify-center bg-navy/60',
        variant === 'sheet' ? 'items-end p-0' : 'items-center p-4',
      ].join(' ')}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={
          variant === 'sheet'
            ? 'max-h-[85vh] w-full max-w-lg overflow-auto rounded-t-hero bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-hero-form'
            : 'max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6 shadow-hero-form'
        }
      >
```

(the `{children}` and the closing tags below are unchanged; the jsdom comment above the outer div, the focus trap, Escape, scroll lock and focus restoration are untouched).

`src/design/islands/BottomSheet.tsx`

```tsx
'use client';
import { useId, type ReactNode } from 'react';
import { CloseIcon } from '@/design/chrome/icons';
import { Dialog } from '@/design/primitives';

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  className?: string;
};

/** The design's mobile role picker / topic picker: a Dialog docked to the bottom edge.
 *  Focus trap, Escape, scroll lock and focus restoration all come from Dialog (D20). */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
  className,
}: BottomSheetProps) {
  const titleId = useId();
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId} variant="sheet">
      <div
        className={['mb-4 flex items-center justify-between gap-4', className]
          .filter(Boolean)
          .join(' ')}
      >
        <h2 id={titleId} className="m-0 text-card-title font-extrabold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-pill hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
        >
          <CloseIcon />
        </button>
      </div>
      {children}
    </Dialog>
  );
}
```

`src/design/islands/SearchInput.tsx`

```tsx
'use client';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { CloseIcon } from '@/design/chrome/icons';

export type SearchInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearLabel: string;
  /** Localized result line ("3 articles"), announced politely as it changes. */
  resultText?: string;
  hideLabel?: boolean;
  className?: string;
};

export function SearchInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  clearLabel,
  resultText,
  hideLabel = false,
  className,
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const clear = () => {
    onChange('');
    ref.current?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      clear();
    }
  };
  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-body-sm font-bold'}>
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[44px] w-full rounded-input border border-border-1 bg-white py-2 pl-4 pr-12 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            aria-label={clearLabel}
            className="absolute right-1 top-1/2 inline-flex min-h-[36px] min-w-[36px] -translate-y-1/2 items-center justify-center rounded-pill text-text-secondary hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
          >
            <CloseIcon size={16} />
          </button>
        ) : null}
      </div>
      <p
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem] text-body-sm text-text-secondary"
      >
        {resultText}
      </p>
    </div>
  );
}
```

`src/design/islands/index.ts` — now:

```ts
export { BottomSheet, type BottomSheetProps } from './BottomSheet';
export { ProgressBar, type ProgressBarProps, type ProgressTone } from './ProgressBar';
export { RangeSlider, type RangeSliderProps } from './RangeSlider';
export { SearchInput, type SearchInputProps } from './SearchInput';
export { Stepper, type StepperProps } from './Stepper';
export { TriState, type TriStateProps, type TriStateValue } from './TriState';
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/primitives/__tests__/Dialog.test.tsx src/design/islands` → all green (Dialog 3, BottomSheet 2, SearchInput 2 + Cycle 1's 9). `npx prettier --write src/design/primitives src/design/islands` then `npm run verify` green. The gallery's `DialogDemo` keeps working — `variant` defaults to `'center'`.

- [ ] **Step 5: Commit**

```
git add src/design/primitives/Dialog.tsx src/design/primitives/__tests__/Dialog.test.tsx src/design/islands && git commit -m "feat(islands): BottomSheet (Dialog sheet variant) and SearchInput

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 3 — `useScrollProgress`, `ScrollSpyToc`, `ShareRow`, `PrintButton` + print CSS + two icons

- [ ] **Step 1: Write the failing tests**

`src/design/islands/__tests__/ScrollSpyToc.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollSpyToc } from '../ScrollSpyToc';

const HEADINGS = [
  { id: 'overview', text: 'Overview' },
  { id: 'documents', text: 'Documents' },
  { id: 'process', text: 'Process' },
];

/** jsdom has no layout: give each heading a top relative to the viewport by id. */
function stubTops(tops: Record<string, number>) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const top = tops[this.id] ?? 0;
    return {
      top,
      bottom: top + 40,
      left: 0,
      right: 0,
      width: 0,
      height: 40,
      x: 0,
      y: top,
      toJSON: () => ({}),
    };
  });
}

afterEach(() => vi.restoreAllMocks());

describe('ScrollSpyToc', () => {
  it('links every heading and marks the last one scrolled past as current', () => {
    stubTops({ overview: -300, documents: 40, process: 900 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc
          headings={HEADINGS}
          label="In this article"
          readMinutes={8}
          remainingLabel={(m) => `≈ ${m} min left`}
        />
      </>,
    );
    const nav = screen.getByRole('navigation', { name: 'In this article' });
    const links = nav.querySelectorAll('a');
    expect(links).toHaveLength(3);
    expect(links[1]).toHaveAttribute('href', '#documents');
    expect(links[1]).toHaveAttribute('aria-current', 'location');
    expect(links[0]).not.toHaveAttribute('aria-current');
    // No scroll in jsdom → progress 0 → the whole read time is left.
    expect(screen.getByText('≈ 8 min left')).toBeInTheDocument();
  });

  it('falls back to the first heading when none has been reached', () => {
    stubTops({ overview: 500, documents: 900, process: 1300 });
    render(
      <>
        <h2 id="overview">Overview</h2>
        <h2 id="documents">Documents</h2>
        <h2 id="process">Process</h2>
        <ScrollSpyToc headings={HEADINGS} label="Contents" />
      </>,
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });
});
```

`src/design/islands/__tests__/ShareRow.test.tsx` (no user-event here: `userEvent.setup()` swaps in its own clipboard stub, so the copy path is exercised with `fireEvent` against an explicit `navigator.clipboard` stub the test controls)

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShareRow } from '../ShareRow';

const labels = {
  heading: 'Share',
  share: 'Share…',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  x: 'X',
  copy: 'Copy link',
  copied: 'Link copied',
};
const url = 'https://www.jobsadmire.com/en/blog/turkey-work-permit-process-employer-guide';

afterEach(() => {
  vi.restoreAllMocks();
  // jsdom ships neither API; the tests define them as configurable own properties and drop them again.
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'clipboard');
});

describe('ShareRow', () => {
  it('offers intent links and copies the URL with a status announcement', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<ShareRow url={url} title="Work permit guide" labels={labels} />);
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/?text=${encodeURIComponent(`Work permit guide ${url}`)}`,
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    );
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('target', '_blank');
    expect(screen.queryByRole('button', { name: 'Share…' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(writeText).toHaveBeenCalledWith(url);
    expect(await screen.findByText('Link copied')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Link copied');
  });

  it('uses the Web Share API when the browser has it', () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    render(<ShareRow url={url} title="Work permit guide" labels={labels} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share…' }));
    expect(share).toHaveBeenCalledWith({ title: 'Work permit guide', url });
  });
});
```

`src/design/islands/__tests__/PrintButton.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrintButton } from '../PrintButton';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.classList.remove('print-isolating');
});

describe('PrintButton', () => {
  it('isolates the page for printing only while the print dialog is up', async () => {
    // jsdom defines window.print as a "not implemented" stub — the spy replaces it.
    let isolatingAtPrint = false;
    const print = vi.spyOn(window, 'print').mockImplementation(() => {
      // The class must be on <body> at the moment the browser paginates.
      isolatingAtPrint = document.body.classList.contains('print-isolating');
    });
    render(<PrintButton label="Print estimate" />);
    const btn = screen.getByRole('button', { name: 'Print estimate' });
    expect(btn.className).toContain('print-hidden');
    await userEvent.click(btn);
    expect(print).toHaveBeenCalledTimes(1);
    expect(isolatingAtPrint).toBe(true);
    expect(document.body.classList.contains('print-isolating')).toBe(true);
    window.dispatchEvent(new Event('afterprint'));
    expect(document.body.classList.contains('print-isolating')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/design/islands` → the three new suites fail to resolve `../ScrollSpyToc`, `../ShareRow`, `../PrintButton`.

- [ ] **Step 3: Implement**

`src/design/chrome/icons.tsx` — append at the end of the file (after Task 5's `ClockIcon`; the file-local `IconProps`, `base` and `stroke` are already in scope):

```tsx
export function XIcon(props: IconProps) {
  return (
    <svg {...base({ size: 15, ...props })} fill="currentColor">
      <path d="M18.9 1.2h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6.1 7H1.9l7.9-9.1L1.5 1.2h7l4.8 6.4 5.6-6.4zm-1.2 18h1.9L7.4 3.1H5.4l12.3 16.1z" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}
```

`src/design/islands/useScrollProgress.ts` (no directive — a hook file, imported by client components only, like `useContactClick`)

```ts
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}
function getSnapshot() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 1000) / 1000;
}
const onServer = () => 0;

/** 0…1 document scroll progress. 0 on the server and while hydrating (R18's pattern), so a
 *  progress bar or "min left" line never mismatches the server HTML. Rounded to 1/1000 so
 *  scroll events that do not move the value do not re-render. */
export function useScrollProgress(): number {
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}
```

`src/design/islands/ScrollSpyToc.tsx`

```tsx
'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { useScrollProgress } from './useScrollProgress';

export type TocHeading = { id: string; text: string };

export type ScrollSpyTocProps = {
  headings: TocHeading[];
  /** Accessible name of the <nav> (sys copy, e.g. "In this article"). */
  label: string;
  /** Optional visible eyebrow above the list. */
  heading?: string;
  readMinutes?: number;
  remainingLabel?: (minutesLeft: number) => string;
  /** Viewport offset below which a heading counts as reached (the sticky header's height). */
  offsetPx?: number;
  className?: string;
};

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/** Blog Article sidebar TOC: plain in-page anchors, the active one marked `aria-current`.
 *  "Active" = the last heading whose top has passed `offsetPx`; the first heading before any
 *  has. The remaining-time line uses the post's own read time, not the design's hard-coded 8. */
export function ScrollSpyToc({
  headings,
  label,
  heading,
  readMinutes,
  remainingLabel,
  offsetPx = 96,
  className,
}: ScrollSpyTocProps) {
  const first = headings[0]?.id ?? '';
  const getActive = useCallback(() => {
    let active = first;
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.getBoundingClientRect().top <= offsetPx) active = h.id;
    }
    return active;
  }, [headings, first, offsetPx]);
  const onServer = useCallback(() => first, [first]);
  const active = useSyncExternalStore(subscribe, getActive, onServer);
  const progress = useScrollProgress();
  const minutesLeft =
    readMinutes != null ? Math.max(0, Math.ceil(readMinutes * (1 - progress))) : null;

  return (
    <nav aria-label={label} className={className}>
      {heading ? (
        <p className="mb-2 text-eyebrow font-extrabold uppercase tracking-wide text-blue-safe">
          {heading}
        </p>
      ) : null}
      <ol className="m-0 list-none p-0">
        {headings.map((h) => {
          const current = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={current ? 'location' : undefined}
                className={[
                  'block border-l-2 py-1.5 pl-3 text-body-sm no-underline transition-colors',
                  current
                    ? 'border-blue-safe font-extrabold text-ink'
                    : 'border-border-2 text-text-secondary hover:text-ink',
                ].join(' ')}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
      {minutesLeft != null && remainingLabel ? (
        <p className="mt-3 text-body-sm text-text-tertiary">{remainingLabel(minutesLeft)}</p>
      ) : null}
    </nav>
  );
}
```

`src/design/islands/ShareRow.tsx`

```tsx
'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { LinkedInIcon, LinkIcon, WhatsAppIcon, XIcon } from '@/design/chrome/icons';

export type ShareLabels = {
  heading: string;
  share: string;
  whatsapp: string;
  linkedin: string;
  x: string;
  copy: string;
  copied: string;
};

export type ShareRowProps = {
  /** Absolute, locale-aware URL built by the page (SITE_URL + getPathname) — never a design literal. */
  url: string;
  title: string;
  labels: ShareLabels;
  className?: string;
};

const noSubscribe = () => () => {};
const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';
const onServer = () => false;

const ITEM =
  'inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-ink no-underline transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** Blog Article share row. Web Share is a browser fact read after hydration (R18); the
 *  intent links are ordinary anchors so the row works without JS. No analytics: share/copy
 *  are not in the W12 allowlist. */
export function ShareRow({ url, title, labels, className }: ShareRowProps) {
  const webShare = useSyncExternalStore(noSubscribe, canShare, onServer);
  const [copied, setCopied] = useState(false);
  // The "Copied" line clears itself 2 s after the latest copy. Keyed on `copied`, so the
  // timer lives and dies with the state it resets — no ref read in a cleanup, no setState
  // during the effect body (react-hooks 7's `set-state-in-effect` and `refs` rules).
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* clipboard denied: the visible URL bar is the fallback */
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      /* dismissed */
    }
  };
  const text = encodeURIComponent(`${title} ${url}`);
  const encoded = encodeURIComponent(url);
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <p className="m-0 text-body-sm font-bold text-text-secondary">{labels.heading}</p>
      <div className="flex flex-wrap gap-2">
        {webShare ? (
          <button type="button" onClick={share} className={ITEM}>
            {labels.share}
          </button>
        ) : null}
        <a href={`https://wa.me/?text=${text}`} {...external} className={ITEM}>
          <WhatsAppIcon size={15} />
          {labels.whatsapp}
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          {...external}
          className={ITEM}
        >
          <LinkedInIcon size={15} />
          {labels.linkedin}
        </a>
        <a
          href={`https://x.com/intent/post?url=${encoded}&text=${encodeURIComponent(title)}`}
          {...external}
          className={ITEM}
        >
          <XIcon size={14} />
          {labels.x}
        </a>
        <button type="button" onClick={copy} className={ITEM}>
          <LinkIcon size={15} />
          {labels.copy}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="m-0 min-h-[1.25rem] text-body-sm text-success-text"
      >
        {copied ? labels.copied : ''}
      </p>
    </div>
  );
}
```

`src/design/islands/PrintButton.tsx`

```tsx
'use client';
import { Button, type ButtonVariant } from '@/design/primitives';

export type PrintButtonProps = {
  label: string;
  variant?: ButtonVariant;
  className?: string;
};

const ISOLATING = 'print-isolating';

/** Prints only the page's `.print-isolate` region (the design's `#calculator` print rule,
 *  made opt-in per page — see the `@media print` block in globals.css). The body class is
 *  added before `window.print()` and removed on `afterprint`, so a cancelled dialog never
 *  leaves the page in its print state. The button itself never prints (`print-hidden`). */
export function PrintButton({ label, variant = 'secondary', className }: PrintButtonProps) {
  const onClick = () => {
    const body = document.body;
    const done = () => {
      body.classList.remove(ISOLATING);
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    body.classList.add(ISOLATING);
    window.print();
  };
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={['print-hidden', className].filter(Boolean).join(' ')}
    >
      {label}
    </Button>
  );
}
```

`src/app/globals.css` — append at the end of the file (after the `.marquee-toggle` rule's closing `}` and anything Tasks 3/5 appended after it):

```css
/* PrintButton (src/design/islands/PrintButton.tsx): while `body.print-isolating` is set, only
   the page's `.print-isolate` region prints — the design's own #calculator print rule, made
   opt-in per page. `.print-hidden` keeps controls (Print, WhatsApp buttons) off paper. */
@media print {
  body.print-isolating * {
    visibility: hidden;
  }
  body.print-isolating .print-isolate,
  body.print-isolating .print-isolate * {
    visibility: visible;
  }
  body.print-isolating .print-isolate {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .print-hidden {
    display: none !important;
  }
}
```

`src/design/islands/index.ts` — final form:

```ts
export { BottomSheet, type BottomSheetProps } from './BottomSheet';
export { PrintButton, type PrintButtonProps } from './PrintButton';
export { ProgressBar, type ProgressBarProps, type ProgressTone } from './ProgressBar';
export { RangeSlider, type RangeSliderProps } from './RangeSlider';
export { ScrollSpyToc, type ScrollSpyTocProps, type TocHeading } from './ScrollSpyToc';
export { SearchInput, type SearchInputProps } from './SearchInput';
export { ShareRow, type ShareRowProps, type ShareLabels } from './ShareRow';
export { Stepper, type StepperProps } from './Stepper';
export { TriState, type TriStateProps, type TriStateValue } from './TriState';
export { useScrollProgress } from './useScrollProgress';
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/islands` → 9 files green (18 tests). `npx prettier --write src/design/islands src/design/chrome/icons.tsx src/app/globals.css` then `npm run verify` green (no `react-hooks/refs` or `set-state-in-effect` findings: the only effect is the `copied`-keyed timer).

- [ ] **Step 5: Commit**

```
git add src/design/islands src/design/chrome/icons.tsx src/app/globals.css && git commit -m "feat(islands): ScrollSpyToc, ShareRow, PrintButton (+print isolation CSS), useScrollProgress

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 4 — country codes (W40) + flag sprite: `flag-icons` → `public/brand/flags.svg` + `Flag`

Source: the `flag-icons` npm package (MIT, Lipis), its `flags/4x3/<cc>.svg` files (lower-case file names, viewBox `0 0 640 480`). It is a **devDependency**; the sprite is generated by `npm run assets:flags`, committed, and served as a static file. Nothing from the package reaches the runtime bundle. Codes are **upper-case ISO2 everywhere** (W40) — the code list, the sprite ids (`flag-PK`), `FlagCode`, `SourceMapCode`, `data-country` — matching Task 1's `sourceCountries.code`; only the file lookup lower-cases.

- [ ] **Step 1: Write the failing tests**

`src/design/assets/__tests__/source-map-codes.test.ts` (the W40 cross-check: `readFileSync` over the committed TR bundle is the sanctioned way round the `content/local` import rule — `eslint.config.mjs` says so; no `import` of the bundle)

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FLAG_CODES, isFlagCode } from '../flag-codes';
import {
  isSourceMapCode,
  SOURCE_MAP_CODES,
  SOURCE_MAP_POINTS,
  sourceMapLabels,
  TURKIYE_POINT,
} from '../source-map-codes';

type Row = { code: string; name: string; lon: number; lat: number };
const bundle = JSON.parse(
  readFileSync(join(__dirname, '..', '..', '..', 'content', 'local', 'bundle.tr.json'), 'utf8'),
) as { collections: { sourceCountries: Row[] } };
const rows = bundle.collections.sourceCountries;

describe('source-map codes (W40: one code set, upper-case ISO2, shared with T0b)', () => {
  it('equals the importer’s sourceCountries codes, in order', () => {
    expect(rows.map((r) => r.code)).toEqual([...SOURCE_MAP_CODES]);
    expect(SOURCE_MAP_CODES).toHaveLength(13); // W1: source-map.js's 12 + LK
    expect(SOURCE_MAP_CODES).toContain('LK');
    expect(SOURCE_MAP_CODES).toContain('SN'); // Senegal stays
    for (const code of SOURCE_MAP_CODES) expect(code).toMatch(/^[A-Z]{2}$/);
  });

  it('plots every country at the importer’s coordinates (source-map.js + Sri Lanka)', () => {
    for (const r of rows) {
      expect(isSourceMapCode(r.code)).toBe(true);
      if (!isSourceMapCode(r.code)) continue;
      expect(SOURCE_MAP_POINTS[r.code].lon).toBe(r.lon);
      expect(SOURCE_MAP_POINTS[r.code].lat).toBe(r.lat);
      expect(SOURCE_MAP_POINTS[r.code].atlasId).toMatch(/^\d{3}$/); // ISO 3166-1 numeric
    }
    expect(TURKIYE_POINT).toEqual({ lon: 35.2, lat: 39.0, atlasId: '792' });
  });

  it('builds the SourceMap labels from the collection rows', () => {
    const labels = sourceMapLabels(rows);
    expect(Object.keys(labels)).toEqual([...SOURCE_MAP_CODES]);
    expect(labels.UZ).toBe('Özbekistan');
    expect(labels.LK).toBe('Sri Lanka');
    // A missing row is a defect in every environment but production (makeT's own rule).
    expect(() => sourceMapLabels(rows.filter((r) => r.code !== 'ML'))).toThrow(/ML/);
  });

  it('FLAG_CODES = the source countries + TR, guarded for Task 1’s `code: string` rows', () => {
    expect(FLAG_CODES).toEqual([...SOURCE_MAP_CODES, 'TR']);
    expect(FLAG_CODES).toHaveLength(14);
    expect(isFlagCode('PK')).toBe(true);
    expect(isFlagCode('TR')).toBe(true);
    expect(isFlagCode('pk')).toBe(false); // W40: never lower-case
    expect(isFlagCode('GH')).toBe(false); // W1: Ghana is out
  });
});
```

`scripts/build-flags.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { FLAG_CODES } from '../src/design/assets/flag-codes';
import { buildFlagSprite } from './build-flags';

describe('build-flags', () => {
  const sprite = buildFlagSprite();

  it('emits one <symbol id="flag-<CODE>"> per flag code (13 source countries + TR)', () => {
    expect(FLAG_CODES).toHaveLength(14);
    for (const code of FLAG_CODES) {
      expect(sprite).toContain(`<symbol id="flag-${code}" viewBox="0 0 640 480">`);
    }
    expect((sprite.match(/<symbol id="flag-/g) ?? []).length).toBe(14);
    expect(sprite).not.toContain('id="flag-pk"'); // W40: upper-case ids only
  });

  it('strips every source root <svg> and never repeats an id', () => {
    expect(sprite.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(sprite).not.toContain('id="flag-icons-'); // flag-icons' own root id must not survive
    const ids = [...sprite.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is deterministic', () => {
    expect(buildFlagSprite()).toBe(sprite);
  });
});
```

`src/design/__tests__/Flag.test.tsx`

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flag } from '../Flag';

describe('Flag', () => {
  it('references the sprite symbol and is decorative without a label', () => {
    const { container } = render(<Flag code="PK" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '15');
    expect(svg.querySelector('use')).toHaveAttribute('href', '/brand/flags.svg#flag-PK');
  });

  it('is an image named by its label when given one', () => {
    const { container } = render(<Flag code="TR" size={40} label="Türkiye" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Türkiye');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg).toHaveAttribute('height', '30');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

`npx vitest run src/design/assets scripts/build-flags.test.ts src/design/__tests__/Flag.test.tsx` → all three fail to resolve (`../source-map-codes`, `../flag-codes`, `./build-flags`, `../Flag`).

- [ ] **Step 3: Implement**

Install (one job): `npm install -D flag-icons@^7.2.3`

`src/design/assets/source-map-codes.ts` (client-safe: no `fs`, no `server-only`; the W40 cross-check test pins it to Task 1's collection)

```ts
/** The countries the sourcing map plots: `design-package/design/source-map.js`'s 12 plus
 *  Sri Lanka (ruling W1 — Senegal stays; Ghana/Tunisia are out), as upper-case ISO2 (W40),
 *  in the importer's order. Coordinates are the design's own marker positions (LK at the
 *  island's centre); `atlasId` is the ISO 3166-1 numeric id world-atlas keys its features
 *  by, so the build script never matches on English names. `__tests__/source-map-codes.test.ts`
 *  asserts this list equals T0b's `sourceCountries` collection (codes, order, lon/lat). */
export const SOURCE_MAP_CODES = [
  'PK',
  'NP',
  'IN',
  'UZ',
  'KG',
  'TM',
  'PH',
  'ID',
  'RU',
  'ML',
  'SN',
  'CM',
  'LK',
] as const;
export type SourceMapCode = (typeof SOURCE_MAP_CODES)[number];

export function isSourceMapCode(code: string): code is SourceMapCode {
  return (SOURCE_MAP_CODES as readonly string[]).includes(code);
}

export const SOURCE_MAP_POINTS: Record<
  SourceMapCode,
  { lon: number; lat: number; atlasId: string }
> = {
  PK: { lon: 69.3, lat: 30.4, atlasId: '586' },
  NP: { lon: 84.1, lat: 28.4, atlasId: '524' },
  IN: { lon: 78.9, lat: 22.6, atlasId: '356' },
  UZ: { lon: 64.6, lat: 41.4, atlasId: '860' },
  KG: { lon: 74.8, lat: 41.2, atlasId: '417' },
  TM: { lon: 59.6, lat: 39.0, atlasId: '795' },
  PH: { lon: 121.8, lat: 12.9, atlasId: '608' },
  ID: { lon: 113.9, lat: -1.5, atlasId: '360' },
  RU: { lon: 50.0, lat: 55.5, atlasId: '643' },
  ML: { lon: -4.0, lat: 17.5, atlasId: '466' },
  SN: { lon: -14.5, lat: 14.5, atlasId: '686' },
  CM: { lon: 12.4, lat: 6.0, atlasId: '120' },
  LK: { lon: 80.7, lat: 7.9, atlasId: '144' },
};

export const TURKIYE_POINT = { lon: 35.2, lat: 39.0, atlasId: '792' } as const;

/** `SourceMap`'s `labels` from Task 1's `sourceCountries` rows (`getCollection(bundle,
 *  'sourceCountries')`): one localized name per code. A missing code throws outside
 *  production and falls back to the code itself in production — makeT's own rule. */
export function sourceMapLabels(
  countries: ReadonlyArray<{ code: string; name: string }>,
): Record<SourceMapCode, string> {
  const byCode = new Map(countries.map((c) => [c.code, c.name]));
  const out = {} as Record<SourceMapCode, string>;
  for (const code of SOURCE_MAP_CODES) {
    const name = byCode.get(code);
    if (!name) {
      if (process.env.NODE_ENV !== 'production')
        throw new Error(`sourceMapLabels: no sourceCountries row for ${code}`);
      out[code] = code;
      continue;
    }
    out[code] = name;
  }
  return out;
}
```

`src/design/assets/flag-codes.ts`

```ts
import { SOURCE_MAP_CODES } from './source-map-codes';

/** Every flag in `public/brand/flags.svg`: the 13 source countries + Türkiye (upper-case, W40). */
export const FLAG_CODES = [...SOURCE_MAP_CODES, 'TR'] as const;
export type FlagCode = (typeof FLAG_CODES)[number];

/** Task 1's rows type `code` as `string`; `Flag` wants a `FlagCode` — this is the bridge. */
export function isFlagCode(code: string): code is FlagCode {
  return (FLAG_CODES as readonly string[]).includes(code);
}
```

`scripts/build-flags.ts`

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FLAG_CODES } from '../src/design/assets/flag-codes';

const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'node_modules', 'flag-icons', 'flags', '4x3');
const OUT = join(ROOT, 'public', 'brand', 'flags.svg');

/** flag-icons' files are self-contained SVGs whose inner ids ("a", "b", clipPaths…) repeat
 *  from flag to flag. One sprite = one id namespace, so every id and every reference to it is
 *  prefixed with the flag's code. The package names its files in lower-case; the sprite ids
 *  keep the upper-case code (W40). */
function toSymbol(code: string): string {
  const svg = readFileSync(join(SRC, `${code.toLowerCase()}.svg`), 'utf8');
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
  const ns = inner
    .replace(/\sid="([^"]+)"/g, (_, id: string) => ` id="${code}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${code}-${id})`)
    .replace(
      /(xlink:)?href="#([^"]+)"/g,
      (_, x: string | undefined, id: string) => `${x ?? ''}href="#${code}-${id}"`,
    );
  return `<symbol id="flag-${code}" viewBox="0 0 640 480">${ns}</symbol>`;
}

export function buildFlagSprite(): string {
  const symbols = FLAG_CODES.map(toSymbol).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n<!-- GENERATED by scripts/build-flags.ts from the flag-icons package (MIT). Do not edit; run: npm run assets:flags -->\n${symbols}\n</svg>\n`;
}

if (require.main === module) {
  writeFileSync(OUT, buildFlagSprite());
  console.log(`flags.svg: ${FLAG_CODES.length} flags → ${OUT}`);
}
```

`src/design/Flag.tsx` (no directive; no hooks)

```tsx
import type { FlagCode } from '@/design/assets/flag-codes';

/** A flag from the local sprite (`public/brand/flags.svg`, built by `npm run assets:flags`).
 *  Decorative unless `label` is given — next to a country name the name is the label; alone
 *  (a flag chip with only a count) pass the localized country name. 4:3 like the design's
 *  20×14 flagcdn tiles, which this replaces (W14: no runtime fetch to flagcdn). Codes are
 *  upper-case ISO2 (W40); bridge Task 1's `code: string` with `isFlagCode`. */
export function Flag({
  code,
  size = 20,
  label,
  className,
}: {
  code: FlagCode;
  size?: number;
  label?: string;
  className?: string;
}) {
  const height = Math.round(size * 0.75);
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 640 480"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={[
        'inline-block flex-none overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(22,60,90,0.15)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <use href={`/brand/flags.svg#flag-${code}`} />
    </svg>
  );
}
```

`package.json` — with the Edit tool, insert one line into the `scripts` object right after the `"redirects:build": "tsx scripts/build-redirects.ts"` line (W42: additive; never paste a whole scripts block):

```json
    "assets:flags": "tsx scripts/build-flags.ts",
```

Generate and commit the sprite: `npm run assets:flags` → `public/brand/flags.svg` (expect ~60–110 KB; the Sri Lanka, Turkmenistan and Kyrgyzstan flags are the heavy ones). Sanity: `grep -c '<symbol id="flag-' public/brand/flags.svg` prints `14`; `grep -c 'id="flag-PK"' public/brand/flags.svg` prints `1`.

`.gitattributes` (new)

```
public/brand/flags.svg linguist-generated=true
src/design/assets/*.generated.tsx linguist-generated=true
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/design/assets scripts/build-flags.test.ts src/design/__tests__/Flag.test.tsx` → 9 tests green (4 + 3 + 2). `npx prettier --write scripts/build-flags.ts scripts/build-flags.test.ts src/design/assets src/design/Flag.tsx src/design/__tests__ package.json` then `npm run verify` green (Prettier does not parse `.svg` or `.gitattributes`, so neither needs an ignore entry).

- [ ] **Step 5: Commit**

```
git add package.json package-lock.json scripts/build-flags.ts scripts/build-flags.test.ts src/design/assets/source-map-codes.ts src/design/assets/flag-codes.ts src/design/assets/__tests__/source-map-codes.test.ts src/design/Flag.tsx src/design/__tests__/Flag.test.tsx public/brand/flags.svg .gitattributes && git commit -m "feat(assets): upper-case source-country codes pinned to T0b (W40), local flag sprite (13 + TR) from flag-icons, Flag component

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 5 — sourcing map pre-rendered at build time

What the design does at runtime (`design-package/design/source-map.js`): injects d3 7.9 + topojson-client 3.1 from unpkg, fetches `world-atlas@2.0.2/countries-110m.json` from jsdelivr, `d3.geoMercator().fitExtent([[16,18],[W-16,H-18]], MultiPoint(12 countries + Türkiye))`, `geoPath`, fills Turkey `#1899D5`, the source countries `#cfe6f4`, everything else `#eaf1f6` with a white 0.7 stroke, draws great-circle `LineString` arcs to Türkiye (stroke `#1899D5` 1.4 round, opacity .55, dash-in 900 ms staggered 110 ms from 220 ms), dots (r 4.5 `#1073a8`, white 1.6 stroke) with a pulsing ring (r 4.5→15, opacity .75→0, 1.9 s, staggered 260 ms from 700 ms), hover tooltips, and a Türkiye marker (r 7 `#16a34a`, white 2.2 stroke) labelled "Türkiye" (13 px / 800 / `#0f5c2e`, white 3.5 paint-order stroke).

What this task does instead: the **same projection code, run once at build time** with `d3-geo` + `topojson-client` + `world-atlas` as **devDependencies** (none of the three is imported from `src/**`; the generated file contains only path strings and numbers), at the design's 640 px default width (`H = round(640 × 0.62) = 397`), clipped to the viewBox so the Americas and Antarctica do not bloat the file, emitted as a server component. Animations move to CSS (`pathLength="1"` on every arc replaces the runtime `getTotalLength`), tooltips become SVG `<title>`s on the marker groups, the hard-coded "Türkiye" label becomes the `turkiyeLabel` prop (W9), and reduced motion / print are handled by the stylesheet.

- [ ] **Step 1: Write the failing test**

`scripts/build-source-map.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { SOURCE_MAP_CODES } from '../src/design/assets/source-map-codes';
import { buildSourceMap, VIEWBOX } from './build-source-map';

describe('build-source-map', () => {
  const { tsx, markers } = buildSourceMap();

  it('plots the 13 source countries (W1: + LK) and Türkiye inside the design viewBox', () => {
    expect(VIEWBOX).toEqual({ width: 640, height: 397 });
    for (const code of [...SOURCE_MAP_CODES, 'TR'] as const) {
      const m = markers[code];
      expect(m.x).toBeGreaterThan(0);
      expect(m.x).toBeLessThan(640);
      expect(m.y).toBeGreaterThan(0);
      expect(m.y).toBeLessThan(397);
      expect(tsx).toContain(`data-country="${code}"`); // W40: upper-case
    }
    // Sri Lanka sits south-east of Pakistan; Senegal is the western edge; Türkiye is north of Mali.
    expect(markers.LK.x).toBeGreaterThan(markers.PK.x);
    expect(markers.LK.y).toBeGreaterThan(markers.PK.y);
    expect(markers.SN.x).toBeLessThan(markers.ML.x);
    expect(markers.TR.y).toBeLessThan(markers.ML.y);
  });

  it('emits a self-contained server component: land paths, 13 arcs, titles, no runtime imports', () => {
    expect(tsx).toContain("import type { SourceMapCode } from './source-map-codes';");
    expect(tsx).not.toMatch(/from ['"](d3|d3-geo|topojson|topojson-client|world-atlas)/);
    expect((tsx.match(/className="source-map__arc"/g) ?? []).length).toBe(13);
    expect((tsx.match(/<title>\{labels\.[A-Z]{2}\}<\/title>/g) ?? []).length).toBe(13);
    expect((tsx.match(/\{turkiyeLabel\}/g) ?? []).length).toBe(2); // <title> + the visible <text>
    expect(tsx).not.toContain('>Türkiye<'); // W9: no hard-coded label
    expect((tsx.match(/<path d="/g) ?? []).length).toBeGreaterThan(60); // clipped world, per-country paths
    expect(tsx).toContain('fill="#1899D5"'); // Türkiye
    expect(tsx).toContain('fill="#cfe6f4"'); // source countries
    expect(tsx).toContain('pathLength="1"');
    expect(tsx).toContain('export function SourceMap(');
  });

  it('is deterministic', () => {
    expect(buildSourceMap().tsx).toBe(tsx);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

`npx vitest run scripts/build-source-map.test.ts` → `Failed to resolve import "./build-source-map"`.

- [ ] **Step 3: Implement** (in this order — the door file re-exports the generated file, so it is written only after `npm run assets:map` has produced it)

(a) Install (one job): `npm install -D d3-geo@^3.1.1 @types/d3-geo@^3.1.0 topojson-client@^3.1.0 @types/topojson-client@^3.1.5 @types/topojson-specification@^1.0.5 @types/geojson@^7946.0.16 world-atlas@^2.0.2`
(`d3-geo` is ESM-only; the script is a `.ts` run by `tsx`, which handles ESM-from-CJS, and Node 22.12+ has native `require(esm)`. If `tsx` ever reports `ERR_REQUIRE_ESM`, run it as `node --import tsx scripts/build-source-map.ts` — do not rewrite the script as `.mts`.)

(b) `scripts/build-source-map.ts`

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, LineString, MultiPoint } from 'geojson';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import {
  SOURCE_MAP_CODES,
  SOURCE_MAP_POINTS,
  TURKIYE_POINT,
  type SourceMapCode,
} from '../src/design/assets/source-map-codes';

const ROOT = join(__dirname, '..');
const ATLAS = join(ROOT, 'node_modules', 'world-atlas', 'countries-110m.json');
const OUT = join(ROOT, 'src', 'design', 'assets', 'source-map.generated.tsx');

/** The design renders at its container width (default 640) with H = round(W × 0.62). */
export const VIEWBOX = { width: 640, height: 397 } as const;
const INSET: [[number, number], [number, number]] = [
  [16, 18],
  [VIEWBOX.width - 16, VIEWBOX.height - 18],
];

const FILL = { turkiye: '#1899D5', source: '#cfe6f4', other: '#eaf1f6' } as const;

type Marker = { x: number; y: number };
const r1 = (n: number) => Math.round(n * 10) / 10;

export function buildSourceMap(): {
  tsx: string;
  markers: Record<SourceMapCode | 'TR', Marker>;
} {
  const topo = JSON.parse(readFileSync(ATLAS, 'utf8')) as Topology;
  const countries = feature(
    topo,
    topo.objects.countries as GeometryCollection,
  ) as FeatureCollection;

  const points: MultiPoint = {
    type: 'MultiPoint',
    coordinates: [
      ...SOURCE_MAP_CODES.map((c) => [SOURCE_MAP_POINTS[c].lon, SOURCE_MAP_POINTS[c].lat]),
      [TURKIYE_POINT.lon, TURKIYE_POINT.lat],
    ],
  };
  // clipExtent first: d3's fit* ignores it while fitting and restores it afterwards, so land
  // outside the viewBox (Americas, Antarctica) is cut at the edge instead of shipped.
  const projection = geoMercator()
    .clipExtent([
      [0, 0],
      [VIEWBOX.width, VIEWBOX.height],
    ])
    .fitExtent(INSET, points);
  const path = geoPath(projection).digits(1);

  const sourceIds = new Set(SOURCE_MAP_CODES.map((c) => SOURCE_MAP_POINTS[c].atlasId));
  const land: string[] = [];
  const sorted = [...countries.features].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (const f of sorted) {
    const d = path(f);
    if (!d) continue; // entirely outside the clip extent
    const id = String(f.id);
    const fill =
      id === TURKIYE_POINT.atlasId ? FILL.turkiye : sourceIds.has(id) ? FILL.source : FILL.other;
    land.push(`        <path d="${d}" fill="${fill}" stroke="#ffffff" strokeWidth="0.7" />`);
  }

  const project = (lon: number, lat: number): Marker => {
    const p = projection([lon, lat]);
    if (!p) throw new Error(`unprojectable point ${lon},${lat}`);
    return { x: r1(p[0]), y: r1(p[1]) };
  };
  const markers = Object.fromEntries(
    SOURCE_MAP_CODES.map((c) => [c, project(SOURCE_MAP_POINTS[c].lon, SOURCE_MAP_POINTS[c].lat)]),
  ) as Record<SourceMapCode, Marker>;
  const TR = project(TURKIYE_POINT.lon, TURKIYE_POINT.lat);

  const arcs = SOURCE_MAP_CODES.map((c, i) => {
    const line: LineString = {
      type: 'LineString',
      coordinates: [
        [SOURCE_MAP_POINTS[c].lon, SOURCE_MAP_POINTS[c].lat],
        [TURKIYE_POINT.lon, TURKIYE_POINT.lat],
      ],
    };
    const d = path(line) ?? '';
    const delay = (0.22 + i * 0.11).toFixed(2);
    return `        <path className="source-map__arc" pathLength="1" d="${d}" style={{ animationDelay: '${delay}s' }} />`;
  });

  const dots = SOURCE_MAP_CODES.map((c, i) => {
    const m = markers[c];
    const delay = (0.7 + i * 0.26).toFixed(2);
    return [
      `        <g data-country="${c}" transform="translate(${m.x},${m.y})">`,
      `          <title>{labels.${c}}</title>`,
      `          <circle r="4.5" fill="#1073a8" stroke="#ffffff" strokeWidth="1.6" />`,
      `          <circle className="source-map__pulse" r="4.5" fill="none" stroke="#1899D5" strokeWidth="1.4" style={{ animationDelay: '${delay}s' }} />`,
      `        </g>`,
    ].join('\n');
  });

  const markerLiteral = JSON.stringify({ ...markers, TR }, null, 2).replace(/"(\w+)":/g, '$1:');

  const tsx = `/* GENERATED FILE — do not edit by hand. Regenerate with \`npm run assets:map\`.
 * Source: design-package/design/source-map.js (12 countries + LK per ruling W1) projected with
 * d3-geo's Mercator, fitted to the 14 points inside a ${VIEWBOX.width}×${VIEWBOX.height} viewBox with the design's
 * 16/18 px inset, over world-atlas@2.0.2 countries-110m (Natural Earth, public domain). Nothing
 * here is fetched or computed at runtime (W14). Styling: .source-map__* in globals.css. */
import type { SourceMapCode } from './source-map-codes';

export const SOURCE_MAP_VIEWBOX = { width: ${VIEWBOX.width}, height: ${VIEWBOX.height} } as const;

export const SOURCE_MAP_MARKERS: Record<SourceMapCode | 'TR', { x: number; y: number }> = ${markerLiteral};

export type SourceMapProps = {
  /** Accessible name of the whole figure (sys copy). */
  title: string;
  /** Localized country names, one per marker — \`sourceMapLabels(getCollection(bundle, 'sourceCountries'))\`. */
  labels: Record<SourceMapCode, string>;
  /** The Türkiye marker's label (W9: the design's hard-coded "Türkiye" is a prop). */
  turkiyeLabel: string;
  /** Unique per instance when a page mounts the map twice. */
  id?: string;
  className?: string;
};

/** The sourcing map (Homepage agent-network split, Hire Workers source countries). Desktop
 *  only in the design (hidden ≤460 by class, W10); the phone card lists Flag chips instead. */
export function SourceMap({ title, labels, turkiyeLabel, id = 'source-map', className }: SourceMapProps) {
  return (
    <svg
      viewBox="0 0 ${VIEWBOX.width} ${VIEWBOX.height}"
      role="img"
      aria-labelledby={\`\${id}-title\`}
      className={className}
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'hidden' }}
    >
      <title id={\`\${id}-title\`}>{title}</title>
      <g className="source-map__land">
${land.join('\n')}
      </g>
      <g className="source-map__arcs" fill="none" stroke="#1899D5" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
${arcs.join('\n')}
      </g>
      <g className="source-map__markers">
${dots.join('\n')}
      </g>
      <g data-country="TR" transform="translate(${TR.x},${TR.y})">
        <title>{turkiyeLabel}</title>
        <circle r="7" fill="#16a34a" stroke="#ffffff" strokeWidth="2.2" />
        <text y="-14" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f5c2e" stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke">
          {turkiyeLabel}
        </text>
      </g>
    </svg>
  );
}
`;
  return { tsx, markers: { ...markers, TR } };
}

if (require.main === module) {
  const { tsx } = buildSourceMap();
  writeFileSync(OUT, tsx);
  console.log(`source-map.generated.tsx: ${(tsx.length / 1024).toFixed(1)} KB → ${OUT}`);
}
```

(c) `package.json` — with the Edit tool, insert one line right after the `"assets:flags"` line (W42):

```json
    "assets:map": "tsx scripts/build-source-map.ts",
```

(d) Generate: `npm run assets:map` → `src/design/assets/source-map.generated.tsx` (expect 40–70 KB). Sanity: `grep -c 'data-country' src/design/assets/source-map.generated.tsx` prints `14`; `grep -c 'data-country="pk"' …` prints `0`.

(e) `src/design/assets/source-map.ts` (the import door for pages)

```ts
/** Pages import the map from here, never from the generated file directly, so a regeneration
 *  or a future hand-written replacement changes one line. */
export {
  SourceMap,
  SOURCE_MAP_MARKERS,
  SOURCE_MAP_VIEWBOX,
  type SourceMapProps,
} from './source-map.generated';
export {
  SOURCE_MAP_CODES,
  SOURCE_MAP_POINTS,
  isSourceMapCode,
  sourceMapLabels,
  type SourceMapCode,
} from './source-map-codes';
```

(f) `src/app/globals.css` — append at the end of the file (after the Cycle 3 print block):

```css
/* SourceMap (src/design/assets/source-map.generated.tsx): arcs dash in once, source dots pulse.
   `pathLength="1"` on every arc normalises the dash, so no path length is measured at runtime.
   Reduced motion: the global rule above collapses both to a single 0.01 ms run — arcs end drawn
   (`forwards`), the pulse ring settles at its resting radius. */
@keyframes source-map-dash {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes source-map-pulse {
  from {
    transform: scale(1);
    opacity: 0.75;
  }
  to {
    transform: scale(3.3);
    opacity: 0;
  }
}
.source-map__arc {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: source-map-dash 0.9s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}
.source-map__pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: source-map-pulse 1.9s cubic-bezier(0.33, 1, 0.68, 1) infinite;
}
@media print {
  .source-map__arc {
    animation: none;
    stroke-dashoffset: 0;
  }
  .source-map__pulse {
    display: none;
  }
}
```

(g) `.prettierignore` — append one line at the end of the file:

```
src/design/assets/source-map.generated.tsx
```

(h) `eslint.config.mjs` — inside `globalIgnores([...])`, add right after the `'design-package/**',` entry:

```js
    // Build-time generated assets (scripts/build-source-map.ts) — regenerated, never hand-edited
    'src/design/assets/*.generated.tsx',
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run scripts/build-source-map.test.ts` → 3 tests green. `npx prettier --write scripts/build-source-map.ts scripts/build-source-map.test.ts src/design/assets/source-map.ts src/app/globals.css package.json eslint.config.mjs` then `npm run verify` green — typecheck covers the generated file (`tsc` accepts the inline `style={{ animationDelay: '…' }}` objects as `CSSProperties` without a cast), lint and Prettier skip it.

- [ ] **Step 5: Commit**

```
git add package.json package-lock.json scripts/build-source-map.ts scripts/build-source-map.test.ts src/design/assets/source-map.ts src/design/assets/source-map.generated.tsx src/app/globals.css .prettierignore eslint.config.mjs && git commit -m "feat(assets): sourcing map pre-rendered at build time (d3-geo/world-atlas devDeps, 13 countries + LK, upper-case codes, no runtime fetch)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 6 — local QR encoder: `src/lib/qr.ts` + `QrCode`

Replaces the package's `design/qr.js` (CRM Login) and the Contact page's `api.qrserver.com` fetch. The `qrcode` package (runtime dependency, server side only) does the encoding; the SVG is assembled here as one `<path>` of horizontal runs, so the output is small, deterministic and needs no client JS.

- [ ] **Step 1: Write the failing test**

`src/lib/qr.test.ts`

```ts
import QRCode from 'qrcode';
import { describe, expect, it } from 'vitest';
import { qrSvg } from './qr';

const text = 'https://wa.me/905011240340?text=Hello';

describe('qrSvg', () => {
  it('returns a self-contained, deterministic SVG whose grid matches the encoder', () => {
    const svg = qrSvg(text);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg).toContain('<path ');
    expect(svg).toBe(qrSvg(text));
    const size = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size;
    expect(svg).toContain(`viewBox="0 0 ${size + 8} ${size + 8}"`); // default margin 4
    expect(svg).toContain('shape-rendering="crispEdges"');
  });

  it('is decorative by default and an image when labelled, with the label XML-escaped', () => {
    expect(qrSvg(text)).toContain('aria-hidden="true"');
    const labelled = qrSvg(text, { label: 'Scan to chat on WhatsApp & Telegram "now"', size: 120 });
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain(
      'aria-label="Scan to chat on WhatsApp &amp; Telegram &quot;now&quot;"',
    );
    expect(labelled).toContain('width="120"');
    expect(labelled).not.toContain('aria-hidden');
  });

  it('honours margin and colours', () => {
    const svg = qrSvg(text, { margin: 0, dark: '#0a1428', light: null });
    const size = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size;
    expect(svg).toContain(`viewBox="0 0 ${size} ${size}"`);
    expect(svg).toContain('fill="#0a1428"');
    expect(svg).not.toContain('<rect');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

`npx vitest run src/lib/qr.test.ts` → `Failed to resolve import "qrcode"` / `"./qr"`.

- [ ] **Step 3: Implement**

Install (one job): `npm install qrcode@^1.5.4 && npm install -D @types/qrcode@^1.5.5`

`src/lib/qr.ts`

```ts
import QRCode from 'qrcode';

export type QrOptions = {
  /** Rendered width/height in CSS px (the SVG scales; the design uses 82–86 px). */
  size?: number;
  /** Quiet zone in modules (the QR spec's minimum is 4). */
  margin?: number;
  dark?: string;
  /** `null` = transparent background. */
  light?: string | null;
  /** When given the SVG is `role="img"` named by it; otherwise it is decorative. */
  label?: string;
};

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Server-side QR → SVG string (ECC level M, byte mode — what the package's qr.js produced).
 * Pure so it is unit-testable; render it from a server component only (`QrCode.tsx` is the
 * door), never from a client island — the encoder would join the page's JS budget (W13).
 */
export function qrSvg(text: string, options: QrOptions = {}): string {
  const { size = 86, margin = 4, dark = '#0a1428', light = '#ffffff', label } = options;
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const n = modules.size;
  const total = n + margin * 2;

  // One path of horizontal runs: `M x y h len v1 h -len z` per run, which is both smaller than
  // one rect per module and immune to hairline gaps between adjacent rects.
  const runs: string[] = [];
  for (let row = 0; row < n; row++) {
    let col = 0;
    while (col < n) {
      if (!modules.get(row, col)) {
        col++;
        continue;
      }
      let len = 1;
      while (col + len < n && modules.get(row, col + len)) len++;
      runs.push(`M${col + margin} ${row + margin}h${len}v1h-${len}z`);
      col += len;
    }
  }

  const a11y = label
    ? `role="img" aria-label="${escapeAttr(label)}"`
    : 'aria-hidden="true" focusable="false"';
  const bg = light ? `<rect width="${total}" height="${total}" fill="${light}"/>` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}" shape-rendering="crispEdges" ${a11y}>` +
    bg +
    `<path fill="${dark}" d="${runs.join('')}"/>` +
    `</svg>`
  );
}
```

`src/design/QrCode.tsx`

```tsx
import 'server-only';
import { qrSvg } from '@/lib/qr';

/** Inline QR for wa.me / Play Store / verify-record links (Contact "In a hurry?", Portal
 *  entry app card, Verify record). Server-rendered markup, zero client JS (W14). The `label`
 *  is the accessible name — pass the localized alt (e.g. contact.089). */
export function QrCode({
  text,
  label,
  size = 86,
  className,
}: {
  text: string;
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={['inline-block leading-none', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: qrSvg(text, { size, label }) }}
    />
  );
}
```

- [ ] **Step 4: Run the tests + `npm run verify`**

`npx vitest run src/lib/qr.test.ts` → 3 tests green. `npx prettier --write src/lib/qr.ts src/lib/qr.test.ts src/design/QrCode.tsx package.json` then `npm run verify` green (`QrCode.tsx` is never imported by a test — `server-only` resolves through Next at build time exactly as `src/content/adapter.ts`'s import does today).

- [ ] **Step 5: Commit**

```
git add package.json package-lock.json src/lib/qr.ts src/lib/qr.test.ts src/design/QrCode.tsx && git commit -m "feat(assets): local server-side QR (qrcode → SVG string), QrCode server component

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

#### Cycle 7 — brand files, gallery demo, docs

What exists: `design-package/assets/ja-mark.png` (already copied to `public/brand/ja-mark.png` in WP1, R16) is the **only** asset in the package. The designs otherwise hot-link **JobsAdmire's own live-site files** — `https://www.jobsadmire.com/logos/logo4.png` (the full logo: mark + "Jobs Admire / Özel İstihdam Bürosu" wordmark, 742×146 RGBA) and `https://www.jobsadmire.com/logos/iskur.png` (the İŞKUR "Özel İstihdam Bürosu" licence roundel the current site displays, 320×320) — plus Google's and Apple's hosted badge images (Hire Workers ≤700 px) and an inline Play-glyph SVG (`JobsAdmire Homepage v4.dc.html` line 898 and 1200; the Hire Workers store buttons). Verified 2026-09-20: both live-site PNGs answer 200; the Contact page fetches `api.qrserver.com/v1/create-qr-code/…`, the Homepage/Hire/Verify pages fetch `flagcdn.com/w40/…`. No vector logo exists anywhere → the SVG variants the interface named are an **owner ask** (see Docs), not something this task can draw.

Copied vs generated vs fetched:

| File                           | How                                                                 | Why                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/brand/ja-mark.png`     | already there (R16)                                                 | package asset                                                                                                                                  |
| `public/brand/logo.png`        | fetched once by `scripts/fetch-brand.sh`, committed                 | the company's own logo from its live site; the legacy site moves to `legacy.jobsadmire.com` at cutover, so the fetch must never run in a build |
| `public/brand/iskur.png`       | fetched once, committed                                             | same                                                                                                                                           |
| `public/brand/google-play.svg` | hand-authored from the design's inline glyph (Homepage v4 line 898) | the design's own artwork; `StoreBadges` (Task 5) composes the badge in HTML with hire.240/241 text (W7), so no badge bitmap is needed          |
| `public/brand/flags.svg`       | generated (Cycle 4)                                                 |                                                                                                                                                |
| App Store badge                | **none** (W8: iOS hidden)                                           |                                                                                                                                                |

- [ ] **Step 1: Write the failing test**

No unit test for static files. The check is `test -s public/brand/logo.png && test -s public/brand/iskur.png && test -s public/brand/google-play.svg` (fails until the files exist), plus the gallery route rendering under `npm run dev` for a visual check of every island (not a gate). The gallery edit is type-checked by `npm run verify`.

- [ ] **Step 2: Run the check to verify it fails**

`test -s public/brand/logo.png; echo $?` → `1`. `npm run typecheck` passes before the edit; after adding the `<IslandsDemo />` reference without the file it fails with `Cannot find module './IslandsDemo'` — that is the red step for the gallery.

- [ ] **Step 3: Implement**

`scripts/fetch-brand.sh`

```sh
#!/usr/bin/env bash
# One-time fetch of JobsAdmire's own raster brand files from the live site — the designs
# hot-link these (README "hot-linked logo"). The outputs are committed; this never runs in a
# build (the legacy site moves to legacy.jobsadmire.com at cutover). Re-run only to refresh.
set -euo pipefail
cd "$(dirname "$0")/.."
curl -fsSL --max-time 20 -o public/brand/logo.png  https://www.jobsadmire.com/logos/logo4.png
curl -fsSL --max-time 20 -o public/brand/iskur.png https://www.jobsadmire.com/logos/iskur.png
file public/brand/logo.png public/brand/iskur.png
# expected: logo.png 742 x 146 RGBA; iskur.png 320 x 320
```

`package.json` — with the Edit tool, insert one line right before the `"assets:flags"` line (W42; the three `assets:*` lines end up together, alphabetical: brand, flags, map):

```json
    "assets:brand": "bash scripts/fetch-brand.sh",
```

Run `chmod +x scripts/fetch-brand.sh && npm run assets:brand` and confirm the two sizes printed by `file`.

`public/brand/google-play.svg` (the design's glyph, verbatim paths)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M4 3.5v17c0 .4.45.65.8.42l.2-.12L15.5 12 5 3.2l-.2-.12A.5.5 0 0 0 4 3.5z" fill="#2196F3"/><path d="M18.9 9.9L15.5 12 5 3.2l13.9 6.7z" fill="#4CAF50"/><path d="M18.9 14.1L15.5 12 5 20.8l13.9-6.7z" fill="#F44336"/><path d="M18.9 9.9l2.3 1.3c.7.4.7 1.2 0 1.6l-2.3 1.3L15.5 12l3.4-2.1z" fill="#FFC107"/></svg>
```

`src/design/assets/brand.ts`

```ts
/** Every brand file under public/brand with its intrinsic size, so `next/image` calls never
 *  guess dimensions (CLS) and no page hard-codes a path. Sources: docs/ARCHITECTURE.md § Assets. */
export const BRAND = {
  /** The mark alone (design-package/assets/ja-mark.png, R16). */
  mark: { src: '/brand/ja-mark.png', width: 336, height: 285 },
  /** Mark + wordmark + "Özel İstihdam Bürosu" — JobsAdmire's own logo from its live site. */
  logo: { src: '/brand/logo.png', width: 742, height: 146 },
  /** The İŞKUR licence roundel the live site displays (About #lisans, Hire Workers trust row). */
  iskur: { src: '/brand/iskur.png', width: 320, height: 320 },
  /** The design's inline Play glyph; the badge text is hire.240/241 (W7). No App Store file (W8). */
  googlePlay: { src: '/brand/google-play.svg', width: 24, height: 24 },
  flags: '/brand/flags.svg',
} as const;
```

`src/app/[locale]/(site)/dev/gallery/IslandsDemo.tsx` (W41 path; dev-only; labels are hard-coded English on purpose — the gallery is not a site route, R41)

```tsx
'use client';
import { useState } from 'react';
import {
  BottomSheet,
  PrintButton,
  ProgressBar,
  RangeSlider,
  ScrollSpyToc,
  SearchInput,
  ShareRow,
  Stepper,
  TriState,
  type TriStateValue,
} from '@/design/islands';
import { Button } from '@/design/primitives';

/** Every island needs state or a handler, which never crosses the RSC boundary — hence one
 *  client demo for the gallery, like DialogDemo. */
export function IslandsDemo() {
  const [salary, setSalary] = useState(33030);
  const [head, setHead] = useState(15);
  const [tri, setTri] = useState<TriStateValue | null>(null);
  const [q, setQ] = useState('');
  const [sheet, setSheet] = useState(false);
  return (
    <div className="print-isolate flex w-full flex-col gap-6">
      <RangeSlider
        id="g-salary"
        label="Gross salary"
        min={30000}
        max={78000}
        step={500}
        value={salary}
        onChange={setSalary}
        formatValue={(v) => `₺${v}`}
        minLabel="₺30,000"
        maxLabel="₺78,000"
      />
      <Stepper
        id="g-head"
        label="Headcount"
        value={head}
        onChange={setHead}
        min={1}
        max={500}
        decrementLabel="Fewer"
        incrementLabel="More"
        hint="1–500"
      />
      <TriState
        name="g-tri"
        legend="Paid-in capital ≥ ₺100,000?"
        value={tri}
        onChange={setTri}
        labels={{ yes: 'Yes', no: 'No', unsure: 'Not sure' }}
      />
      <ProgressBar
        value={tri ? 1 : 0}
        max={5}
        label="Checks answered"
        valueText={`${tri ? 1 : 0} / 5`}
        tone="green"
      />
      <SearchInput
        id="g-q"
        label="Search articles"
        value={q}
        onChange={setQ}
        placeholder="permit…"
        clearLabel="Clear search"
        resultText={q ? `Filtering by “${q}”` : undefined}
      />
      <ScrollSpyToc
        headings={[
          { id: 'g-a', text: 'Primitives' },
          { id: 'g-b', text: 'Islands' },
        ]}
        label="On this page"
        heading="Contents"
        readMinutes={3}
        remainingLabel={(m) => `≈ ${m} min left`}
      />
      <ShareRow
        url="https://www.jobsadmire.com/"
        title="JobsAdmire"
        labels={{
          heading: 'Share',
          share: 'Share…',
          whatsapp: 'WhatsApp',
          linkedin: 'LinkedIn',
          x: 'X',
          copy: 'Copy link',
          copied: 'Link copied',
        }}
      />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setSheet(true)}>
          Open bottom sheet
        </Button>
        <PrintButton label="Print this block" />
      </div>
      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Choose a role"
        closeLabel="Close"
      >
        <Button variant="primary" onClick={() => setSheet(false)}>
          Welder
        </Button>
      </BottomSheet>
    </div>
  );
}
```

`src/app/[locale]/(site)/dev/gallery/page.tsx` (the file Task 3 moved and Task 5 already edited — `git ls-files | grep 'dev/gallery/page.tsx'` must print exactly this one path; never create a second `page.tsx` for the same URL) — three sentence-anchored edits:

1. Right after Task 5's line `import { Wp2Blocks } from './Wp2Blocks';` add:

```tsx
import { IslandsDemo } from './IslandsDemo';
import { getCollection } from '@/content/collections';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { Flag } from '@/design/Flag';
import { isFlagCode } from '@/design/assets/flag-codes';
import { QrCode } from '@/design/QrCode';
```

(`eslint-config-next` enforces no import order, so the position is a convention only: keep the four `@/` imports with the other `@/` imports if a reviewer prefers.)

2. Inside `Gallery`, right after the line `const t = makeT(bundle);` add:

```tsx
const sourceCountries = getCollection(bundle, 'sourceCountries');
```

3. Immediately after the closing `</Block>` of the `<Block title="Dialog (client wrapper) / SkipLink">` block (i.e. before `<Block title="PausableMarquee">`) add:

```tsx
      <Block title="Islands (src/design/islands)">
        <IslandsDemo />
      </Block>

      <Block title="Assets: Flag sprite / QR / SourceMap (upper-case codes, W40)">
        <div className="flex flex-wrap gap-2">
          {sourceCountries.map((c) =>
            isFlagCode(c.code) ? <Flag key={c.code} code={c.code} label={c.name} size={28} /> : null,
          )}
          <Flag code="TR" label="Türkiye" size={28} />
        </div>
        <QrCode text={`https://wa.me/${bundle.settings.whatsappNumber}`} label="WhatsApp QR" />
        <div className="w-full max-w-[640px]">
          <SourceMap
            title="Countries we source from"
            labels={sourceMapLabels(sourceCountries)}
            turkiyeLabel="Türkiye"
          />
        </div>
      </Block>
```

`docs/ARCHITECTURE.md` — three sentence-anchored edits (W45), building on the text Tasks 3 and 5 left:

1. In § Design system, **after** Task 5's paragraph (the one that starts "`src/design/` — tokens (…" and ends "… always UTC calendar dates.") and **before** the "Pages: one server component per page, …" paragraph, insert a new paragraph:

```md
Nine **page islands** live in `src/design/islands/` (`RangeSlider`, `Stepper`, `TriState`, `ProgressBar`, `BottomSheet`, `SearchInput`, `ScrollSpyToc`, `ShareRow`, `PrintButton`, plus the `useScrollProgress` hook; `Dialog` gained a `variant="sheet"` bottom-docked mode for `BottomSheet`). Islands are built once here and reused by pages; each is a real platform control (`<input type="range">`, `<input type="number">`, real radios in a `<fieldset>`, `<input type="search">`, in-page anchors with `aria-current`) with labels supplied by the page from `sys.*` or a package id (W9 — no island carries copy), browser facts read only after hydration through `useSyncExternalStore` (R18: Web Share support, scroll position, heading offsets), and motion left to the stylesheet so the global reduced-motion rule covers them. `PrintButton` prints only the page's `.print-isolate` region (the design's `#calculator` rule made opt-in: `body.print-isolating` for the dialog's duration; `.print-hidden` for controls). Share/copy/print fire no analytics (W12). Islands are small; the heavy compositions that use them — the calculator, the season planner, the blog search/TOC — are loaded with `next/dynamic` on interaction or viewport by the page (W13 amended). The dev gallery (`[locale]/(site)/dev/gallery`) renders every island and asset.
```

2. In the "Pages:" paragraph, replace the fragment "local flag assets; the sourcing map pre-rendered from `design-package/design/source-map.js`'s country list; local QR generation (replacing the package's `qr.js`);" with "build-time assets only — the local flag sprite, the pre-rendered sourcing map and the local QR encoder (§ Assets below);".

3. **After** the "Pages:" paragraph and **before** the `### Chrome` heading, insert the new section:

```md
### Assets — build time only, no runtime external fetch (W14)

The 14 designs fetch from seven third-party origins at runtime. **The production site fetches from none of them**; every asset is either generated by a script and committed, or a committed file under `public/brand/`. `next.config.ts` has no `images.remotePatterns` on purpose. Country codes are upper-case ISO2 everywhere (W40) — the same `'PK'`…`'LK'` Task 1's `sourceCountries` collection carries; `src/design/assets/__tests__/source-map-codes.test.ts` pins the map's code list, order and coordinates to that collection.

| The design fetched (runtime)                                                                                                                     | Replaced by                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Regenerate             |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| d3 7.9 + topojson-client 3.1 from unpkg, `world-atlas@2.0.2/countries-110m.json` from jsdelivr (`design/source-map.js`, Homepage + Hire Workers) | `src/design/assets/source-map.generated.tsx` — the same Mercator `fitExtent` projection run once by `scripts/build-source-map.ts` (`d3-geo`, `topojson-client`, `world-atlas` are devDependencies; `src/**` never imports them), 13 source countries (`source-map.js`'s 12 + Sri Lanka, W1) + Türkiye, arcs and pulses in CSS (`.source-map__*`, `pathLength="1"`), tooltips as SVG `<title>`s, `data-country="<CODE>"` on every marker, the Türkiye label as the `turkiyeLabel` prop (W9). Pages import `SourceMap` and `sourceMapLabels` from `@/design/assets/source-map` and pass `labels={sourceMapLabels(getCollection(bundle, 'sourceCountries'))}`. The code list lives in `src/design/assets/source-map-codes.ts`. | `npm run assets:map`   |
| `https://flagcdn.com/w40/<iso>.png` (Homepage, Hire Workers, Verify) and emoji flags (Hire Workers dial select)                                  | `public/brand/flags.svg` — a `<symbol id="flag-<CODE>">` sprite of the 13 source countries + TR built from the `flag-icons` package's 4x3 files (devDependency, MIT; inner ids namespaced per flag), rendered by `Flag` (`src/design/Flag.tsx`, `<use href="/brand/flags.svg#flag-PK">`); `isFlagCode` bridges the collection's `code: string`.                                                                                                                                                                                                                                                                                                                                                                             | `npm run assets:flags` |
| `https://api.qrserver.com/…` (Contact "In a hurry?") and the package's `design/qr.js` (CRM Login)                                                | `src/lib/qr.ts` `qrSvg(text, options)` — the `qrcode` package on the server, ECC M, one `<path>` of module runs; `QrCode` (`src/design/QrCode.tsx`, `server-only`) is the component. Zero client JS.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | —                      |
| `https://www.jobsadmire.com/logos/logo4.png`, `…/logos/iskur.png` (every page's header/footer, About)                                            | `public/brand/logo.png` (742×146) and `public/brand/iskur.png` (320×320) — the company's own files, fetched **once** by `scripts/fetch-brand.sh` and committed (never in the build: the legacy site moves to `legacy.jobsadmire.com` at cutover). Sizes in `src/design/assets/brand.ts` (`BRAND`). **Owner ask:** vector versions (SVG, incl. a white variant for dark bands) — until then dark surfaces use `ja-mark.png` + an HTML wordmark as the chrome already does.                                                                                                                                                                                                                                                   | `npm run assets:brand` |
| `play.google.com/…/en_badge_web_generic.png`, `developer.apple.com/…/download-on-the-app-store.svg` (Hire Workers ≤700 px)                       | `public/brand/google-play.svg` — the design's own inline Play glyph; `StoreBadges` composes the badge in HTML with hire.240/241 (W7). **No App Store file** (W8: iOS hidden while `storeLinks.ios` is null).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | hand-authored          |
| Google Fonts `Archivo` `<link>`                                                                                                                  | `next/font/google`, self-hosted (WP1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | —                      |
| `image-slot.js` placeholders / hot-linked photography                                                                                            | per-slot image policy (D26); local files only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                      |

Generated files (`src/design/assets/*.generated.tsx`, `public/brand/flags.svg`) are committed, Prettier- and ESLint-ignored, marked `linguist-generated` in `.gitattributes`, and still type-checked. A change to the country list, the flag set or the design's map styling is made in the script or its inputs and regenerated — never in the output.
```

`docs/PRD.md` — § 11 "WP1 delivered", the **Design system** bullet, two sentence-anchored edits on the text Tasks 5 and 3 left (W45):

1. Replace Task 5's fragment "14 accessible primitives (`RadioChips` joined in WP2a T0d) and the shared page blocks (`src/design/blocks/`)" with "14 accessible primitives (`RadioChips` joined in WP2a T0d), the shared page blocks (`src/design/blocks/`) and nine page islands (`src/design/islands/`, WP2a T0d)".
2. Replace the bullet's closing fragment "the 901px (header row, W11) / 1101px (D19 scale, social rail) breakpoint scheme." with "the 901px (header row, W11) / 1101px (D19 scale, social rail) breakpoint scheme; build-time assets only — pre-rendered sourcing map, local flag sprite, local QR, local brand files (`docs/ARCHITECTURE.md` § Assets, W14)."

- [ ] **Step 4: Run the checks + `npm run verify`**

`test -s public/brand/logo.png && test -s public/brand/iskur.png && test -s public/brand/google-play.svg && echo ok` → `ok`. `git ls-files | grep 'dev/gallery/page.tsx'` → exactly `src/app/[locale]/(site)/dev/gallery/page.tsx`. `npx prettier --write "src/app/[locale]/(site)/dev/gallery" src/design/assets/brand.ts package.json docs/ARCHITECTURE.md docs/PRD.md` (Prettier re-aligns the markdown tables) then `npm run verify` → green (the gallery page type-checks the island props, `isFlagCode` narrows `c.code`, `sourceMapLabels` returns the `labels` type). Then, one job: `npm run dev` and open `/dev/gallery` and `/en/dev/gallery` — every island operable by keyboard, the 14 flags render from the sprite with their collection names as labels, the QR renders, the map shows land + 13 dots + arcs drawing in with the collection's localized names as tooltips; with `prefers-reduced-motion` emulated, nothing moves; `next build` output still lists `/[locale]/dev/gallery` once. Revert the `nextjs-agent-rules` block `npm run dev` appends to `CLAUDE.md` before committing.

- [ ] **Step 5: Commit**

```
git add package.json scripts/fetch-brand.sh public/brand/logo.png public/brand/iskur.png public/brand/google-play.svg src/design/assets/brand.ts "src/app/[locale]/(site)/dev/gallery/IslandsDemo.tsx" "src/app/[locale]/(site)/dev/gallery/page.tsx" docs/ARCHITECTURE.md docs/PRD.md && git commit -m "feat(assets): brand files (logo, İŞKUR mark, Play glyph), BRAND sizes, gallery islands demo; docs § Assets

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

**Docs in this task:**

- `docs/ARCHITECTURE.md` § Design system: one paragraph **appended after Task 5's** "`src/design/` — tokens (…) … always UTC calendar dates." paragraph (the nine islands, the W9/R18/print rules, the W12 no-events note, the W13-amended dynamic-loading note, the `(site)/dev/gallery` path — W45, never a line-number replace); the "Pages:" paragraph's "local flag assets; … `qr.js`);" fragment → the § Assets pointer; the new **§ Assets — build time only, no runtime external fetch (W14)** section inserted between the "Pages:" paragraph and `### Chrome` (the seven origins the designs fetched and what replaces each; the W40 upper-case-code rule and its cross-check test; regenerate commands; the owner ask for vector logos; the generated-file policy).
- `docs/PRD.md` § 11 Design-system bullet: two fragment replacements on the Task 5 + Task 3 wording (islands added beside the blocks; build-time assets clause appended after the 901px/1101px fragment, pointer to § Assets).
- No change to `docs/CONTENT-MODEL.md` (islands carry no copy; `sourceMapLabels` reads Task 1's collection, whose row shape Task 1 documents; page tasks add their `sys.*` labels incl. the map's `turkiyeLabel`), `docs/ANALYTICS.md` (no new events — W12), `docs/INTEGRATIONS.md` or `docs/DEPLOYMENT.md` (no env, no Operations contract).

**Produces — deviations:**
(1) `public/brand/logo.png` + `iskur.png` (raster, fetched once from the company's own live site) instead of `logo.svg`/`logo-white.svg`/`iskur.svg` — no vector exists anywhere in the package or on the live site; the SVGs (and the white variant) become an owner ask recorded in ARCHITECTURE § Assets, and dark surfaces keep the chrome's `ja-mark.png` + HTML wordmark. (2) `google-play.svg` is the design's inline Play **glyph** (24×24), not a full badge bitmap — `StoreBadges` composes the badge from hire.240/241 per W7. (3) Additions beyond the skeleton: `useScrollProgress` hook, `ProgressBar.valueText` (page-formatted, D18), `Dialog.variant`, `XIcon`/`LinkIcon`, `src/design/assets/{source-map-codes,flag-codes,brand}.ts`, `src/design/assets/source-map.ts` as the import door, `src/design/QrCode.tsx`, `assets:brand` script, `.gitattributes`. (4) `src/lib/qr.ts` has no `server-only` import (so it is unit-testable, like `content/pure.ts` under R2); `QrCode.tsx` carries it. (5) `SourceMap` takes `labels` + `title` + **`turkiyeLabel`** (required — the design's hard-coded "Türkiye" text is copy, W9) + optional `id` (the skeleton listed only "inline SVG server component … data-country"). (6) **W40:** every code is upper-case ISO2 (`SOURCE_MAP_CODES = ['PK', …, 'LK']`, `FLAG_CODES` + `'TR'`, sprite ids `flag-PK`, `data-country="PK"`, `SOURCE_MAP_MARKERS.TR`) — the earlier draft's lower-case set is withdrawn; `isSourceMapCode`/`isFlagCode` type guards and `sourceMapLabels(rows)` are added so pages feed `Flag` and `SourceMap` straight from Task 1's `sourceCountries` rows (`code: string`), and `src/design/assets/__tests__/source-map-codes.test.ts` pins the list, order and coordinates to the committed TR bundle (replacing the earlier draft's unbacked "its test asserts it" claim). (7) The gallery demo lives at `src/app/[locale]/(site)/dev/gallery/IslandsDemo.tsx` and edits the moved `page.tsx` (W41), not the pre-move path.

---

