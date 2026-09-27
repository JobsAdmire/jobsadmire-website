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
