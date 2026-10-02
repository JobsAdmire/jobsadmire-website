'use client';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

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
  /** Final pass B4 (W190 A1c): the design's calculator headcount row at ≤ 700 px (`.ja-cc-head`)
   *  — a 50 px / 1fr / 50 px grid with 8 px gaps, full-width 46 px buttons with their own radius,
   *  a full-width input with its own border; above 700 the attached inline row stays. */
  stretch?: boolean;
};

/** The ≤ 700 px twins `stretch` adds (different variants from the base row, W122). */
export const STEPPER_STRETCH = {
  row: 'max-md:grid max-md:grid-cols-[50px_1fr_50px] max-md:gap-2',
  button: 'max-md:h-[46px] max-md:w-full max-md:rounded-input',
  input: 'max-md:w-full max-md:rounded-input max-md:border',
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const BTN =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-border-1 bg-white text-body font-extrabold text-ink transition-colors hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe aria-disabled:cursor-not-allowed aria-disabled:opacity-40';

/** W131. `value` is the committed number. While the field has focus it holds a draft string,
 *  set only in event handlers (no setState in an effect, R27), so `''` and out-of-range text can
 *  be typed through; the draft is committed — rounded and clamped into [min, max] — on blur and
 *  on Enter, and a field left empty reverts to the committed value. The −/+ buttons and
 *  ArrowUp/ArrowDown step from the current number and clamp at once. Bounds compare against
 *  `min`/`max` directly, so an off-step value still reaches them; a button at its bound is
 *  `aria-disabled` and does nothing — never `disabled`, which would drop keyboard focus. */
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
  stretch = false,
}: StepperProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const hintId = hint ? `${id}-hint` : undefined;
  const parse = (text: string) => {
    if (text.trim() === '') return null;
    const n = Number(text);
    return Number.isFinite(n) ? clamp(Math.round(n), min, max) : null;
  };
  // What −/+ and the arrow keys step from: the typed number while there is one, else the prop.
  const current = (draft === null ? null : parse(draft)) ?? value;
  const atMin = current <= min;
  const atMax = current >= max;
  const set = (next: number) => {
    setDraft(null);
    if (next !== value) onChange(next);
  };
  const commit = () => {
    if (draft === null) return;
    const typed = parse(draft);
    if (typed === null) setDraft(null);
    else set(typed);
  };
  const stepBy = (delta: number) => set(clamp(current + delta, min, max));
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); // the native step would bypass the clamp and the commit
      stepBy(e.key === 'ArrowUp' ? step : -step);
    }
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
      <div
        className={['flex items-stretch', stretch && STEPPER_STRETCH.row].filter(Boolean).join(' ')}
      >
        <button
          type="button"
          aria-label={decrementLabel}
          aria-disabled={atMin || undefined}
          onClick={() => {
            if (!atMin) stepBy(-step);
          }}
          className={[BTN, 'rounded-l-input', stretch && STEPPER_STRETCH.button]
            .filter(Boolean)
            .join(' ')}
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
          value={draft ?? String(value)}
          aria-describedby={hintId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          className={[
            'w-20 border-y border-border-1 text-center text-body font-extrabold tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-safe',
            stretch && STEPPER_STRETCH.input,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <button
          type="button"
          aria-label={incrementLabel}
          aria-disabled={atMax || undefined}
          onClick={() => {
            if (!atMax) stepBy(step);
          }}
          className={[BTN, 'rounded-r-input', stretch && STEPPER_STRETCH.button]
            .filter(Boolean)
            .join(' ')}
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
