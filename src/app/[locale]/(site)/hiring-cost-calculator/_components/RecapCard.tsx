import type { CardView } from '../_lib/card-view';
import type { RecapLabels } from '../_lib/ids';

/** The design's phone recap (#calc-cta .ja-cta-mob, lines 1538–1545) — also the quote sheet's
 *  header, so the visitor sees the estimate the form sends. Presentational, no directive. */
export function RecapCard({
  view,
  labels,
  className,
}: {
  view: CardView;
  labels: RecapLabels;
  className?: string;
}) {
  return (
    <div
      data-testid="recap-card"
      className={['rounded-sm bg-navy p-[15px] text-left text-white', className]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="m-0 mb-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky">
        {labels.zEst}
      </p>
      <div className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-2">
        <span className="min-w-0 text-body-sm font-bold text-white/80">
          {view.totalTitle} · {view.headcountNote}
        </span>
        <span data-testid="recap-total" className="text-[21px] font-extrabold tracking-[-0.5px]">
          {view.f.contract.total}
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-body-sm font-bold text-white/80">{labels.zRough}</span>
        <span className="text-body font-extrabold text-sky">
          {view.f.monthly.total} {labels.perMonthSuffix}
        </span>
      </div>
      <p className="m-0 mt-2 border-t border-white/15 pt-2 text-body-sm text-white/80">
        {labels.zFee}
      </p>
    </div>
  );
}
