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
