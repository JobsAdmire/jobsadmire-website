import type { ReactNode } from 'react';
import type { QuotaLabels } from '../_lib/ids';
import type { QuotaView as QuotaViewModel } from '../_lib/quota-view';
import { Sentence } from './Sentence';

const SQUARE = 'inline-block h-[11px] w-[11px] rounded-[3px]';
const DASHED = `${SQUARE} border-[1.5px] border-dashed border-muted bg-white`;

function Blocks({ view }: { view: QuotaViewModel }) {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-[9px] xl:gap-[6.75px]">
      {view.blocks.map((b, i) => (
        <div
          key={i}
          className={[
            'flex items-center gap-1 rounded-[9px] px-2.5 py-[7px] xl:py-[5.25px]',
            b.kind === 'used'
              ? 'border border-success-border bg-success-surface'
              : b.kind === 'free'
                ? 'border border-border-2 bg-pale-2'
                : 'border border-dashed border-border-1 bg-white opacity-85',
          ].join(' ')}
        >
          {Array.from({ length: view.ratio }, (_, j) => (
            <span key={j} className={j < b.filled ? `${SQUARE} bg-blue` : DASHED} />
          ))}
          <span className="mx-0.5 text-[11px] xl:text-[11px] text-text-tertiary">→</span>
          <span className={b.kind === 'partial' ? DASHED : `${SQUARE} bg-success`} />
        </div>
      ))}
    </div>
  );
}

/** Gate 1 (design 1063–1105) on desktop, the phone step + answer cards (1031–1049) on phones.
 *  `stepper` is the live `Stepper` in the island and a `StepperLook` in the server fallback — the
 *  rest is shared, so the swap keeps every box (W132). `live` marks which one is showing. */
export function QuotaView({
  variant,
  view,
  labels,
  stepper,
  live,
}: {
  variant: 'mobile' | 'desktop';
  view: QuotaViewModel;
  labels: QuotaLabels;
  stepper: ReactNode;
  live: boolean;
}) {
  const picked = (strong: string) => (
    <Sentence
      runs={[labels.qPicked1, { b: view.headcountText }, labels.qPicked2, view.vsPlan]}
      strong={strong}
    />
  );
  if (variant === 'mobile') {
    // QA W221 calc-05: the answer follows the stepper — a polite, atomic live region, as the
    // CalculatorIsland total is.
    return (
      <div data-testid="quota-view-m" data-live={live} aria-live="polite" aria-atomic="true">
        <div className="mb-2.5 rounded-sm border border-border-1 bg-white p-3.5">
          <p className="m-0 mb-1 text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-text-tertiary">
            {labels.qmS1}
          </p>
          <p className="m-0 mb-[11px] xl:mb-[8.25px] text-body font-extrabold leading-[1.3] text-ink">
            {labels.qmS1T}
          </p>
          {stepper}
        </div>
        <div className="mb-2.5 rounded-sm bg-navy px-[15px] xl:px-[11.25px] py-4 text-white">
          <p className="m-0 mb-[7px] xl:mb-[5.25px] text-[11px] xl:text-[11px] font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-sky">
            {labels.qmAns}
          </p>
          <p
            data-testid="quota-allowed-m"
            className="m-0 mb-[7px] xl:mb-[5.25px] text-[26px] xl:text-[19.5px] font-extrabold leading-[1.1] tracking-[-0.7px] xl:tracking-[-0.525px]"
          >
            {view.allowedText}
          </p>
          <p className="m-0 text-body-sm text-white/80">{view.msg}</p>
          <p className="m-0 mt-[11px] xl:mt-[8.25px] border-t border-white/15 pt-[11px] xl:pt-[8.25px] text-body-sm text-white/80">
            {picked('font-extrabold text-white')}
          </p>
        </div>
      </div>
    );
  }
  const box = view.ok
    ? 'rounded-sm border border-success-border bg-success-surface px-5 py-[18px] xl:py-[13.5px]'
    : 'rounded-sm border border-warning-border bg-warning-surface px-5 py-[18px] xl:py-[13.5px]';
  const title = view.ok
    ? 'm-0 mb-1.5 text-body-sm font-extrabold uppercase tracking-[0.6px] xl:tracking-[0.45px] text-success-text'
    : 'm-0 mb-1.5 text-body-sm font-extrabold uppercase tracking-[0.6px] xl:tracking-[0.45px] text-warning-text';
  return (
    <div
      data-testid="quota-view"
      data-live={live}
      className="overflow-hidden rounded-lg border border-tint-border bg-white shadow-[0_18px_44px_rgba(22,60,90,0.10)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border-3 bg-pale-2 px-[26px] xl:px-[19.5px] py-4">
        <span className="text-eyebrow font-extrabold uppercase tracking-[1px] xl:tracking-[0.75px] text-text-tertiary">
          {labels.qG1}
        </span>
        <span className="rounded-pill border border-success-border bg-success-surface px-2.5 py-[3px] xl:py-[2.25px] text-[11.5px] xl:text-[11px] font-extrabold text-success-text">
          {labels.qLive}
        </span>
      </div>
      <div className="px-[26px] xl:px-[19.5px] py-6">
        <p className="m-0 mb-2.5 text-body-sm font-extrabold text-ink">{labels.qStaffLbl}</p>
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          {stepper}
          <span className="text-body-sm text-text-tertiary">{labels.qSameBranch}</span>
        </div>
        {/* QA W221 calc-05: the whole verdict box re-announces when the stepper changes it */}
        <div className={box} aria-live="polite" aria-atomic="true">
          <p className={title}>{view.title}</p>
          <p
            data-testid="quota-allowed"
            className="m-0 mb-2 text-[32px] font-extrabold leading-[1.1] tracking-[-0.8px] xl:tracking-[-0.6px] text-ink xl:text-[24px]"
          >
            {view.allowedText}
          </p>
          <p data-testid="quota-msg" className="m-0 text-body-sm text-text-secondary">
            {view.msg}
          </p>
        </div>
        <div className="mt-5 border-t border-border-3 pt-[18px] xl:pt-[13.5px]">
          <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[0.8px] xl:tracking-[0.6px] text-text-tertiary">
            {labels.qSplit}
          </p>
          <Blocks view={view} />
          <p data-testid="quota-viz-note" className="m-0 mt-3 text-body-sm text-text-tertiary">
            {view.vizNote}
          </p>
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-[18px] xl:gap-[13.5px] p-0 text-[12px] xl:text-[11px] font-bold text-text-tertiary">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`${SQUARE} bg-blue`} />
              {labels.qLegTr}
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`${SQUARE} bg-success`} />
              {labels.qLegPlace}
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className={DASHED} />
              {labels.qLegInc}
            </li>
          </ul>
        </div>
        <p
          data-testid="quota-vs-plan"
          className="m-0 mt-[18px] xl:mt-[13.5px] border-t border-border-3 pt-4 text-body-sm text-text-tertiary"
        >
          {picked('font-extrabold text-ink')}
        </p>
      </div>
    </div>
  );
}
