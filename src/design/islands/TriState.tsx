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
