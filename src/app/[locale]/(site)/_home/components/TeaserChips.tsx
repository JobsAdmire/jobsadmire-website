export type ChipOption = { value: string; label: string };

// W155 pattern: a colourless base plus exactly one of the colour sets below.
const CHIP =
  'inline-flex min-h-[44px] cursor-pointer items-center justify-center whitespace-nowrap rounded-pill border-[1.5px] px-[22px] text-[14px] font-extrabold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe max-xs:whitespace-normal max-xs:px-3 max-xs:text-[13.5px] max-xs:leading-tight xl:px-[16.5px] xl:text-[11px]';
const ON = {
  blue: 'border-blue-safe bg-blue-safe text-white',
  ink: 'border-ink bg-ink text-white',
} as const;
const OFF = 'border-border-1 bg-white text-[#43536a] hover:bg-pale-1';

/**
 * The teaser's chip rows as native radios in a fieldset (arrow keys move within a row, the legend
 * names it) — the page-local stand-in for `RadioChips`, whose required `onChange` cannot render
 * the static server fallback (accepted as page-local in the reconcile rulings). Without
 * `onChange` the radios are read-only: the fallback's state until the island takes over. At
 * ≤ 460 px the row is the design's two-column grid (`.ja-calc-chips`), the last role chip
 * spanning both columns (`spanLast`). No directive: the server section and the island share it.
 */
export function TeaserChips({
  name,
  legend,
  options,
  value,
  onChange,
  emphasis = 'blue',
  spanLast = false,
}: {
  name: string;
  legend: string;
  options: ChipOption[];
  value: string;
  onChange?: (value: string) => void;
  emphasis?: keyof typeof ON;
  spanLast?: boolean;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2.5 p-0 text-[12px] font-extrabold uppercase tracking-[1.2px] text-text-secondary">
        {legend}
      </legend>
      <div className="grid grid-cols-2 gap-2 xs:flex xs:flex-wrap xs:gap-[9px]">
        {options.map((option, i) => {
          const selected = option.value === value;
          const id = `${name}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={[
                CHIP,
                selected ? ON[emphasis] : OFF,
                spanLast && i === options.length - 1 ? 'max-xs:col-span-2' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                readOnly={!onChange}
                onChange={onChange ? () => onChange(option.value) : undefined}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
