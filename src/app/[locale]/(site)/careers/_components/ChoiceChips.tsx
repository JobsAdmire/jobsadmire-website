'use client';
import { useId } from 'react';

export type ChoiceOption = { value: string; label: string };

/** Class slots per use: the filter bar's "Where" track and its "Engagement" grid — each lays
 *  the same chips out differently below 901 px (design ll. 352–362). */
export type ChoiceChipsLook = {
  group?: string;
  label?: string;
  row?: string;
  item?: string;
  chip?: string;
};

/**
 * The design's solid chips (`chip()`, Join Our Team l. 1264): white with a 1.5 px #d3e6f2 edge,
 * the checked one solid blue with white text — the contrast-safe blue (D20). A page-local cousin
 * of `RadioChips` (parity S4.2/M7): this page labels each group with a small grey caps
 * label beside its chips (`#94a3b8` in the design — the contrast-safe tertiary grey here, D20)
 * and needs the ≤ 700 px segmented track and 2 × 2 grid, which `RadioChips` does not lay out.
 * Native radios in a `role="radiogroup"` named by the label (visually hidden where the design
 * hides it), so arrow keys, focus and form submission under `name` come for free.
 */
export function ChoiceChips({
  name,
  label,
  options,
  value,
  onChange,
  look = {},
}: {
  name: string;
  label: string;
  options: ChoiceOption[];
  value: string;
  onChange: (value: string) => void;
  look?: ChoiceChipsLook;
}) {
  const base = useId();
  const labelId = `${base}-label`;
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className={['min-w-0', look.group].filter(Boolean).join(' ')}
    >
      <span
        id={labelId}
        className={[
          'text-[11.5px] font-extrabold tracking-[1.2px] text-text-tertiary uppercase xl:text-[11px]',
          look.label,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </span>
      <div className={['flex flex-wrap gap-2', look.row].filter(Boolean).join(' ')}>
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const checked = o.value === value;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={['relative inline-flex', look.item].filter(Boolean).join(' ')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                className={[
                  'inline-flex min-h-9 cursor-pointer items-center justify-center rounded-pill border-[1.5px] px-[15px] text-[13px] font-extrabold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe xl:text-[11px]',
                  checked
                    ? 'border-blue-safe bg-blue-safe text-white'
                    : 'border-edge bg-white text-[#43536a] hover:border-tint-border hover:bg-pale-1',
                  look.chip,
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
    </div>
  );
}
