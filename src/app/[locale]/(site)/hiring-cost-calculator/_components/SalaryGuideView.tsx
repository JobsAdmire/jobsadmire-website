import type { ReactNode } from 'react';
import type { GuideLabels } from '../_lib/ids';
import type { GuideRow } from '../_lib/salary-guide';

const TIER_SKILLED =
  'shrink-0 whitespace-nowrap rounded-pill border border-success-border bg-success-surface px-2.5 py-1 text-[11px] xl:text-[11px] font-extrabold text-success-text';
const TIER_STANDARD =
  'shrink-0 whitespace-nowrap rounded-pill border border-border-1 bg-pale-1 px-2.5 py-1 text-[11px] xl:text-[11px] font-extrabold text-text-secondary';
const USE_ON =
  'min-h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-[10px] border border-success-border bg-success-surface px-[13px] xl:px-[9.75px] text-[12.5px] xl:text-[11px] font-extrabold text-success-text';
const USE_OFF =
  'min-h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-[10px] border border-tint-border bg-pale-1 px-[13px] xl:px-[9.75px] text-[12.5px] xl:text-[11px] font-extrabold text-blue-safe';

/** The salary guide's cards (design 833–864). `filter` is the island's `RadioChips` or the
 *  fallback's `ChipsLook`; `onUse` exists only in the island (the server fallback renders the same
 *  buttons, inert until the island arrives 200 px before view). */
export function SalaryGuideView({
  rows,
  activeKey,
  labels,
  scaleMin,
  scaleMax,
  filter,
  legend,
  onUse,
  live,
}: {
  rows: GuideRow[];
  activeKey: string;
  labels: GuideLabels;
  scaleMin: string;
  scaleMax: string;
  filter: ReactNode;
  /** the colour key under the chips (S4.2: heading, chips, legend, cards) */
  legend?: ReactNode;
  onUse?: (key: string) => void;
  live: boolean;
}) {
  return (
    <div data-testid="guide-view" data-live={live}>
      <div className="mb-[22px] xl:mb-[16.5px]">{filter}</div>
      {legend}
      <div className="grid gap-[18px] xl:gap-[13.5px] lg:grid-cols-3">
        {rows.map((r) => {
          const active = r.key === activeKey;
          return (
            <article
              key={r.key}
              data-role={r.key}
              className={[
                'flex flex-col gap-[15px] xl:gap-[11.25px] rounded-base border-[1.5px] bg-white px-[22px] xl:px-[16.5px] py-5 transition-shadow',
                active
                  ? 'border-blue-safe shadow-[0_14px_34px_rgba(24,153,213,0.18)]'
                  : 'border-border-2 shadow-card',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0">
                  <h3 className="m-0 text-body font-extrabold leading-[1.3] text-ink">{r.role}</h3>
                  <p className="m-0 mt-0.5 text-body-sm font-bold text-text-tertiary">
                    {r.industryLabel}
                  </p>
                </div>
                <span className={r.skilled ? TIER_SKILLED : TIER_STANDARD}>{r.tier}</span>
              </div>
              <div>
                <div className="mb-[9px] xl:mb-[6.75px] flex flex-wrap items-baseline gap-2">
                  <span className="whitespace-nowrap text-[19px] font-extrabold tracking-[-0.4px] xl:tracking-[-0.3px] text-ink xl:text-[14.25px]">
                    {r.range}
                  </span>
                  <span className="whitespace-nowrap text-[12px] xl:text-[11px] font-bold text-text-tertiary">
                    {labels.sGrossMo}
                  </span>
                </div>
                <div aria-hidden="true" className="relative h-2 rounded-pill bg-border-3">
                  <div
                    className="absolute inset-y-0 rounded-pill bg-[linear-gradient(90deg,#1899d5_0%,#5cc0ef_100%)]"
                    style={{ left: `${r.barLeftPct}%`, width: `${r.barWidthPct}%` }}
                  />
                  <div
                    className="absolute -inset-y-1 w-0.5 rounded-[1px] bg-ink"
                    style={{ left: `${r.tickPct}%` }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="mt-[7px] xl:mt-[5.25px] flex justify-between text-[11.5px] xl:text-[11px] font-bold text-text-tertiary"
                >
                  <span>{scaleMin}</span>
                  <span>{scaleMax}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2.5 border-t border-border-3 pt-[13px] xl:pt-[9.75px]">
                <div>
                  <p className="m-0 text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[0.7px] xl:tracking-[0.525px] text-text-tertiary">
                    {labels.sEmpCost}
                  </p>
                  {/* QA W221 calc-03: the "₺58.835 – ₺83.125" range never wraps inside the
                      one-column card (≤ 900); from 901 the grid is three narrow columns, where an
                      unconditional nowrap overflowed the document by 42 px at exactly 901
                      (width-sweep, proof attempt 1) — there the figure may wrap. */}
                  <p className="m-0 mt-0.5 text-body-sm font-extrabold max-lg:whitespace-nowrap text-blue-safe">
                    {r.employer}
                  </p>
                </div>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={onUse ? () => onUse(r.key) : undefined}
                  className={active ? USE_ON : USE_OFF}
                >
                  {active ? labels.inCalc : labels.useCalc}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
