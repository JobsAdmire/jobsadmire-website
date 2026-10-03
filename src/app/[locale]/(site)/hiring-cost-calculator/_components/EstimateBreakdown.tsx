import { PrintButton } from '@/design/islands/PrintButton';
import type { CardView } from '../_lib/card-view';
import { joinText } from '../_lib/fragments';
import type { CardLabels } from '../_lib/ids';
import { QuoteButton } from './QuoteButton';
import { Sentence } from './Sentence';

function Row({
  label,
  note,
  value,
  tone = 'plain',
}: {
  label: string;
  note?: string;
  value: string;
  tone?: 'plain' | 'green' | 'note';
}) {
  const labelCls = tone === 'green' ? 'text-success-text' : 'text-text-secondary';
  const valueCls =
    tone === 'green' ? 'text-success-text' : tone === 'note' ? 'text-blue-safe' : 'text-ink';
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 max-md:py-[7px]">
      <span className={`text-body-sm ${labelCls}`}>
        {label}
        {note ? (
          <>
            {' '}
            <span className="text-text-tertiary">{note}</span>
          </>
        ) : null}
      </span>
      <span className={`text-body-sm font-extrabold ${valueCls}`}>{value}</span>
    </div>
  );
}

function Total({
  label,
  value,
  testId,
  tone,
}: {
  label: string;
  value: string;
  testId: string;
  tone: 'blue' | 'ink';
}) {
  return (
    <div className="mt-1.5 flex items-baseline justify-between gap-3 border-t border-border-3 pt-3">
      <span className="text-body font-extrabold text-ink">{label}</span>
      <span
        data-testid={testId}
        className={
          tone === 'blue'
            ? 'text-[20px] font-extrabold tracking-[-0.4px] text-blue-safe xl:text-[15px]'
            : 'text-[20px] font-extrabold tracking-[-0.4px] text-[#253063] xl:text-[15px]'
        }
      >
        {value}
      </span>
    </div>
  );
}

/** The card's right column (design 686–736): the monthly box, the one-off box (with the seasonal
 *  note), the total card with the quote button and Print. Rendered by the skeleton and the island
 *  alike. On phones the two boxes collapse behind "See where the money goes" (`breakdownOpen`),
 *  and Print is desktop-only (design line 283). The total card's gradient starts at `blue-safe`
 *  so its white copy reads (D20; the design's #1899D5 is 3.2:1). */
export function EstimateBreakdown({
  view,
  labels,
  breakdownOpen = false,
}: {
  view: CardView;
  labels: CardLabels;
  breakdownOpen?: boolean;
}) {
  const { f } = view;
  const box = [
    'mb-3.5 rounded-base border border-tint-border bg-white px-[22px] py-5 max-md:px-[15px] max-md:py-[15px]',
    breakdownOpen ? '' : 'max-md:hidden',
  ].join(' ');
  return (
    <>
      <div
        data-testid="calc-out-head"
        className={[
          'mb-[18px] flex items-baseline justify-between gap-3',
          breakdownOpen ? 'max-md:mt-3.5 max-md:mb-2.5' : 'max-md:hidden',
        ].join(' ')}
      >
        <span className="text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">
          {labels.cEst}
        </span>
        <span className="text-body-sm font-extrabold text-blue-safe">{view.headcountNote}</span>
      </div>
      <div className={box}>
        <p className="m-0 mb-2.5 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
          {labels.cMonthly}
        </p>
        <Row label={labels.cGross} value={f.monthly.gross} />
        <Row label={labels.cSgkEmp} note={`(${view.sgkRate})`} value={f.monthly.sgk} />
        {view.housing ? <Row label={labels.cAcc} value={f.monthly.housing} /> : null}
        {view.supportOptIn ? (
          <Row
            label={labels.cSupport}
            note={labels.cState}
            value={`− ${f.monthly.support}`}
            tone="green"
          />
        ) : null}
        <Total
          label={labels.cMonthlyTotal}
          value={f.monthly.total}
          testId="calc-monthly-total"
          tone="blue"
        />
      </div>
      <div className={box}>
        <p className="m-0 mb-2.5 text-body-sm font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
          {labels.cOneOffY1}
        </p>
        <Row label={labels.cPermitFees} note={labels.cState} value={f.oneOff.permitFee} />
        {view.flight ? <Row label={labels.cFlightTravel} value={f.oneOff.flight} /> : null}
        <Row label={labels.cServiceFee} value={labels.cQuotedWritten} tone="note" />
        {view.seasonal ? (
          <p
            data-testid="calc-seasonal"
            className="m-0 mt-2 rounded-[10px] border border-warning-border bg-warning-surface px-[13px] py-2.5 text-body-sm text-warning-text"
          >
            <Sentence runs={[labels.sea1, view.perMonthPerWorker, labels.sea2]} />
          </p>
        ) : null}
        <Total
          label={labels.cOneOffTotal}
          value={f.oneOff.total}
          testId="calc-oneoff-total"
          tone="ink"
        />
      </div>
      <div
        data-testid="calc-total-card"
        className={[
          'mt-auto rounded-base bg-[linear-gradient(135deg,#1073a8_0%,#0b5d88_100%)] px-[22px] py-5 max-md:mt-1 max-md:px-[15px] max-md:py-4',
          breakdownOpen ? '' : 'max-md:hidden',
        ].join(' ')}
      >
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <span data-testid="calc-total-title" className="text-body-sm font-extrabold text-white">
            {view.totalTitle}
          </span>
          <span
            data-testid="calc-year-total"
            className="text-[26px] font-extrabold tracking-[-0.6px] text-white max-md:text-[23px] xl:text-[19.5px]"
          >
            {f.contract.total}
          </span>
        </div>
        <p className="m-0 mb-3.5 text-body-sm text-white">
          {joinText([view.yearNote, labels.cFeeNote])}
        </p>
        <div className="print-hidden flex gap-2 max-md:grid max-md:grid-cols-1">
          <QuoteButton
            label={labels.cQuoteBtn}
            variant="secondary"
            className="flex-1"
            testId="calc-quote-open"
          />
          <PrintButton label={labels.cPrint} variant="inverse" className="max-md:hidden" />
        </div>
      </div>
    </>
  );
}
