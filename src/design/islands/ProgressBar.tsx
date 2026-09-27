'use client';
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

/** A client module like every island (W130), with no state of its own: a server page renders
 *  it with plain props — `import { ProgressBar } from '@/design/islands'` is safe there, because
 *  every module behind the barrel carries `'use client'`. */
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
