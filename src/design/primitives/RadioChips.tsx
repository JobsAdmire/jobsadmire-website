'use client';
import { useId } from 'react';

export type RadioChipOption = { value: string; label: string };

/** Final pass B4 (W190 A1c): the ≤ 700 px twins `stretch` adds — the design's headcount
 *  quick-pick chips (`.ja-cc-hchips`: `repeat(4, 1fr)`, 7 px gaps) as equal columns for however
 *  many chips, each full-width and centred; the 44 px target stays (D20 over the design's 40).
 *  `root` makes the fieldset span its container: as a flex item its `width: auto` would size the
 *  grid to 4 × the widest chip (W216 (3)). */
export const CHIPS_STRETCH = {
  root: 'max-md:w-full',
  row: 'max-md:grid max-md:grid-flow-col max-md:auto-cols-fr max-md:gap-[7px]',
  label: 'max-md:flex',
  chip: 'max-md:w-full max-md:justify-center max-md:px-2',
} as const;

const CHECKED = {
  tint: 'border-tint-border bg-tint text-blue-safe',
  solid: 'border-blue-safe bg-blue-safe text-white',
  navy: 'border-indigo bg-indigo text-white',
} as const;

/** Single-select chips (calculator role, blog category, form option sets). Native radios in a
 *  `role="radiogroup"` fieldset: arrow keys, focus and form submission under `name` come for
 *  free, and a FormShell form posts the chosen value like any other field. The chip face is
 *  the `Chip` primitive's, driven by the radio's checked state.
 *
 *  W198: React 19 resets a `<form action={fn}>` after every action — FormShell's failed-submit
 *  path included — and `form.reset()` restores each radio to its DEFAULT checkedness (the
 *  `checked` attribute), which React writes only once, at mount, from the first `value`. A
 *  controlled `checked` alone is not re-applied when `value` has not changed, so the chips
 *  snapped back to the server default while the page's state kept the visitor's choice (and a
 *  second submit posted the default). Each radio's `defaultChecked` therefore follows `value`
 *  (a ref callback, set on every commit), so a reset lands on the chosen radio. A `key` remount
 *  on `value` would do the same but drop keyboard focus on every arrow-key move. */
export function RadioChips({
  name,
  options,
  value,
  onChange,
  legend,
  legendHidden = false,
  className,
  stretch = false,
  face = 'tint',
  compact = false,
  inlineLegend = false,
  scroll = false,
}: {
  name: string;
  options: RadioChipOption[];
  value: string | null;
  onChange: (value: string) => void;
  legend: string;
  legendHidden?: boolean;
  className?: string;
  /** ≤ 700 px: equal-column grid of full-width chips (B4, `CHIPS_STRETCH`). */
  stretch?: boolean;
  /** SHARED 14.2 — the checked chip's face: `tint` (pale, default), `solid` (the design's solid
   *  blue with white text — here the contrast-safe blue, D20: calculator, join, home calculator),
   *  `navy` (#253063, Success Stories) */
  face?: 'tint' | 'solid' | 'navy';
  /** the design's compact chips: r9, 36 px, 13 px (the 24 px target minimum holds) */
  compact?: boolean;
  /** the legend as a small inline label before the chips (Contact "Bana şuradan yanıt verin") */
  inlineLegend?: boolean;
  /** ≤ 700 px: one horizontally scrolling chip row (Success M3, Join M6/M7, Available M1) */
  scroll?: boolean;
}) {
  const base = useId();
  const legendId = `${base}-legend`;
  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={legendId}
      className={['m-0 min-w-0 border-0 p-0', stretch && CHIPS_STRETCH.root, className]
        .filter(Boolean)
        .join(' ')}
    >
      <legend
        id={legendId}
        className={
          legendHidden
            ? 'sr-only'
            : inlineLegend
              ? 'float-left mr-3 py-2 text-[12.5px] font-bold text-text-tertiary xl:text-[11px]'
              : 'mb-2 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe'
        }
      >
        {legend}
      </legend>
      <div
        className={[
          'flex gap-2',
          scroll
            ? 'flex-wrap max-md:-mx-1 max-md:flex-nowrap max-md:overflow-x-auto max-md:px-1 max-md:pb-1 max-md:[scrollbar-width:none]'
            : 'flex-wrap',
          stretch && CHIPS_STRETCH.row,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const checked = o.value === value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={[
                'relative inline-flex',
                scroll ? 'max-md:shrink-0' : null,
                stretch && CHIPS_STRETCH.label,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                ref={(el) => {
                  if (el) el.defaultChecked = checked;
                }}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                className={[
                  'inline-flex cursor-pointer items-center border font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe',
                  scroll ? 'max-md:whitespace-nowrap' : null,
                  compact
                    ? 'min-h-9 rounded-[9px] px-3 text-[13px] xl:text-[11px]'
                    : 'min-h-[44px] rounded-pill px-4 text-body-sm',
                  checked
                    ? CHECKED[face]
                    : 'border-border-1 bg-white text-text-secondary hover:bg-pale-1',
                  stretch && CHIPS_STRETCH.chip,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
