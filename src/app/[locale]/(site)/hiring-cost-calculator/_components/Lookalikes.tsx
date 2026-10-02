/**
 * Static stand-ins for the foundation controls inside the server fallbacks: the same boxes as the
 * real `Stepper`, `RadioChips`, `RangeSlider`, checkbox, `<select>`, `TriState` and `ProgressBar`,
 * without behaviour and `aria-hidden` (the fallback's text carries every value). The class strings
 * mirror src/design/islands/{Stepper,RangeSlider,TriState,ProgressBar}.tsx and
 * src/design/primitives/RadioChips.tsx so the island's arrival does not move a box — a change to
 * one of those faces is mirrored here. No directive: server fallbacks render these.
 */
const STEP_BTN =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-border-1 bg-white text-body font-extrabold text-ink';

/** Final pass B4: the ≤ 700 px classes `Stepper stretch` / `RadioChips stretch` wear — copied, not
 *  imported: those are `'use client'` modules, whose non-component exports reach a server module
 *  only as client references. `Lookalikes.test.tsx` pins the two copies equal to the primitives. */
const STEPPER_STRETCH = {
  row: 'max-md:grid max-md:grid-cols-[50px_1fr_50px] max-md:gap-2',
  button: 'max-md:h-[46px] max-md:w-full max-md:rounded-input',
  input: 'max-md:w-full max-md:rounded-input max-md:border',
} as const;
const CHIPS_STRETCH = {
  row: 'max-md:grid max-md:grid-flow-col max-md:auto-cols-fr max-md:gap-[7px]',
  label: 'max-md:flex',
  chip: 'max-md:w-full max-md:justify-center max-md:px-2',
} as const;

export function StepperLook({ value, stretch = false }: { value: string; stretch?: boolean }) {
  const btn = [STEP_BTN, stretch && STEPPER_STRETCH.button].filter(Boolean).join(' ');
  return (
    <div aria-hidden="true" className="flex flex-col gap-1">
      <div
        className={['flex items-stretch', stretch && STEPPER_STRETCH.row].filter(Boolean).join(' ')}
      >
        <span className={`${btn} rounded-l-input`}>−</span>
        <span
          className={[
            'grid w-20 place-items-center border-y border-border-1 bg-white text-body font-extrabold tabular-nums',
            stretch && STEPPER_STRETCH.input,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {value}
        </span>
        <span className={`${btn} rounded-r-input`}>+</span>
      </div>
    </div>
  );
}

const CHIP =
  'inline-flex min-h-[44px] items-center rounded-pill border px-4 text-body-sm font-bold';
const CHIP_ON = 'border-tint-border bg-tint text-blue-safe';
const CHIP_OFF = 'border-border-1 bg-white text-text-secondary';

export function ChipsLook({
  options,
  value,
  stretch = false,
}: {
  options: readonly { value: string; label: string }[];
  value: string | null;
  stretch?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={['flex flex-wrap gap-2', stretch && CHIPS_STRETCH.row].filter(Boolean).join(' ')}
    >
      {options.map((o) => (
        // the live chip is a <label><input/><span/></label>: the label's `max-md:flex` and the
        // span's twins both sit on this one span, so the swap keeps the same box
        <span
          key={o.value}
          className={[
            CHIP,
            o.value === value ? CHIP_ON : CHIP_OFF,
            stretch && `${CHIPS_STRETCH.label} ${CHIPS_STRETCH.chip}`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {o.label}
        </span>
      ))}
    </div>
  );
}

/** RangeSlider's layout: the label/value row and the hint stay readable text (the skeleton's
 *  accessible content); only the track is decoration. */
export function SliderLook({
  label,
  value,
  minLabel,
  maxLabel,
  hint,
  pct = 0,
}: {
  label: string;
  value: string;
  minLabel: string;
  maxLabel: string;
  hint: string;
  pct?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body-sm font-bold">{label}</span>
        <span className="text-body font-extrabold tabular-nums">{value}</span>
      </div>
      <div aria-hidden="true" className="relative h-4">
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-pill bg-border-1" />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-blue-safe"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div aria-hidden="true" className="flex justify-between text-body-sm text-text-secondary">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <p className="text-body-sm text-text-tertiary">{hint}</p>
    </div>
  );
}

export function CheckLook({ checked, green = false }: { checked: boolean; green?: boolean }) {
  const on = green
    ? 'border-success bg-success text-white'
    : 'border-blue-safe bg-blue-safe text-white';
  return (
    <span
      aria-hidden="true"
      className={[
        'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] border text-[12px] font-extrabold leading-none max-md:h-6 max-md:w-6',
        checked ? on : 'border-muted bg-white text-white',
      ].join(' ')}
    >
      {checked ? '✓' : ''}
    </span>
  );
}

export function SelectLook({ text, className }: { text: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        'flex min-h-[50px] w-full items-center justify-between gap-3 rounded-input border-[1.5px] border-border-1 bg-white px-[15px] text-body font-bold text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="truncate">{text}</span>
      <span className="text-body-sm text-text-tertiary">▾</span>
    </div>
  );
}

const TRI =
  'inline-flex min-h-[44px] items-center rounded-pill border border-border-1 bg-white px-4 text-body-sm font-bold text-text-secondary';

export function TriStateLook({ labels }: { labels: readonly [string, string, string] }) {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-2">
      {labels.map((l) => (
        <span key={l} className={TRI}>
          {l}
        </span>
      ))}
    </div>
  );
}

const BAR_TONE = {
  blue: 'bg-blue-safe',
  green: 'bg-success',
  amber: 'bg-warning',
  red: 'bg-danger',
} as const;

/** ProgressBar's layout at its first render (label row + bar). */
export function BarLook({
  label,
  valueText,
  pct,
  tone,
}: {
  label: string;
  valueText: string;
  pct: number;
  tone: keyof typeof BAR_TONE;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-body-sm font-bold">
        <span>{label}</span>
        <span className="tabular-nums">{valueText}</span>
      </div>
      <div aria-hidden="true" className="h-2 w-full overflow-hidden rounded-pill bg-border-3">
        <div className={`h-full rounded-pill ${BAR_TONE[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
