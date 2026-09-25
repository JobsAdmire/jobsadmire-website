'use client';
import { useId } from 'react';

export type RadioChipOption = { value: string; label: string };

/** Single-select chips (calculator role, blog category, form option sets). Native radios in a
 *  `role="radiogroup"` fieldset: arrow keys, focus and form submission under `name` come for
 *  free, and a FormShell form posts the chosen value like any other field. The chip face is
 *  the `Chip` primitive's, driven by the radio's checked state. */
export function RadioChips({
  name,
  options,
  value,
  onChange,
  legend,
  legendHidden = false,
  className,
}: {
  name: string;
  options: RadioChipOption[];
  value: string | null;
  onChange: (value: string) => void;
  legend: string;
  legendHidden?: boolean;
  className?: string;
}) {
  const base = useId();
  const legendId = `${base}-legend`;
  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={legendId}
      className={['m-0 min-w-0 border-0 p-0', className].filter(Boolean).join(' ')}
    >
      <legend
        id={legendId}
        className={
          legendHidden
            ? 'sr-only'
            : 'mb-2 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe'
        }
      >
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const checked = o.value === value;
          return (
            <label key={o.value} htmlFor={id} className="relative inline-flex">
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
                  'inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border px-4 text-body-sm font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe',
                  checked
                    ? 'border-tint-border bg-tint text-blue-safe'
                    : 'border-border-1 bg-white text-text-secondary hover:bg-pale-1',
                ].join(' ')}
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
