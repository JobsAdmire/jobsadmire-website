import type { CardView } from '../_lib/card-view';
import { HEADCOUNT_PRESETS, MONTH_OPTIONS } from '../_lib/estimate-inputs';
import type { CardLabels } from '../_lib/ids';
import { QuoteButton } from './QuoteButton';
import { Sentence } from './Sentence';

/**
 * What the server skeleton and the live island share, so the swap after the first touch keeps
 * every box in place (W13 amended). Design: #calculator, lines 574–737 (desktop values are the
 * package's × 0.75 from 1101 px, D19; ≤ 700 px rules from lines 257–291). D20: blue text is
 * `blue-safe`, the `#94a3b8` kickers are `text-text-tertiary`. No directive.
 */
export const CARD_GRID = 'grid md:grid-cols-[1fr_1.05fr]';
export const LEFT_COL =
  'border-border-3 px-[15px] py-4 md:border-r md:px-[34px] md:py-[30px] xl:px-[25.5px] xl:py-[22.5px]';
export const RIGHT_COL =
  'flex flex-col bg-pale-2 px-[15px] py-4 md:px-[34px] md:py-[30px] xl:px-[25.5px] xl:py-[22.5px]';
export const KICKER =
  'm-0 mb-[18px] text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary';
export const FIELD_LABEL = 'mb-[7px] block text-body-sm font-extrabold text-ink';
export const SELECT =
  'min-h-[50px] w-full cursor-pointer rounded-input border-[1.5px] border-border-1 bg-white px-[15px] text-body font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
export const ROLE_BUTTON =
  'flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-3.5 py-[11px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
export const COVER_BOX = 'flex flex-col gap-1 border-t border-border-3 pt-1';
export const COVER_TITLE =
  'm-0 pt-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary';
export const TOGGLE_ROW = 'flex min-h-[44px] cursor-pointer items-center justify-between gap-3';
export const TOGGLE_TEXT = 'text-body-sm font-bold text-text-secondary';
export const TOGGLE_NOTE = 'font-semibold text-text-tertiary';
export const TIER_BOX = 'border-t border-border-3 pt-3';
export const ADV_TOGGLE =
  'flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xs border-[1.5px] border-dashed border-tint-border bg-pale-1 p-3 text-body-sm font-extrabold text-blue-safe';
export const BRK_TOGGLE =
  'mb-3 flex min-h-[50px] w-full cursor-pointer items-center justify-between gap-2.5 rounded-xs border-[1.5px] border-tint-border bg-white px-[15px] py-[13px] text-left text-body-sm font-extrabold text-ink';

export const HEADCOUNT_OPTIONS = HEADCOUNT_PRESETS.map((n) => ({
  value: String(n),
  label: String(n),
}));
export const presetValue = (headcount: number): string | null =>
  (HEADCOUNT_PRESETS as readonly number[]).includes(headcount) ? String(headcount) : null;
export const monthOptions = (labels: CardLabels) =>
  MONTH_OPTIONS.map((m) => ({
    value: String(m),
    label: m === 6 ? labels.chip6 : m === 9 ? labels.chip9 : labels.chip12,
  }));
export const tierOptions = (labels: CardLabels) => [
  { value: 'manufacturing', label: labels.tierManuf },
  { value: 'other', label: labels.tierOther },
  { value: 'none', label: labels.tierNone },
];

/** "Label ……… value" above a control. `hidden` in the island (the control itself is labelled),
 *  readable in the skeleton (it is the skeleton's accessible text). */
export function RowHead({
  label,
  value,
  kicker = false,
  hidden = false,
}: {
  label: string;
  value: string;
  kicker?: boolean;
  hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="mb-2 flex items-baseline justify-between gap-2.5"
    >
      <span
        className={
          kicker
            ? 'text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary'
            : 'text-body-sm font-extrabold text-ink'
        }
      >
        {label}
      </span>
      <span className="text-body-sm font-extrabold text-blue-safe">{value}</span>
    </div>
  );
}

/** The ≤ 700 px snapshot (design `.ja-cc-snap`): the live total and the quote button up top. */
export function Snapshot({ view, labels }: { view: CardView; labels: CardLabels }) {
  const cell = (label: string, value: string) => (
    <div className="rounded-[10px] border border-white/15 bg-white/10 px-2.5 py-2">
      <p className="m-0 mb-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-white/80">
        {label}
      </p>
      <p className="m-0 text-[15px] font-extrabold">{value}</p>
    </div>
  );
  return (
    <div className="mb-3.5 rounded-sm bg-[linear-gradient(135deg,#16202e_0%,#253063_100%)] px-[15px] py-3.5 text-white md:hidden">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-[1.1px] text-sky">
          {view.totalTitle}
        </span>
        <span className="text-[11.5px] font-extrabold text-white/80">{view.headcountNote}</span>
      </div>
      <p className="m-0 mt-1.5 mb-2.5 text-[29px] font-extrabold leading-[1.05] tracking-[-1.2px]">
        {view.f.contract.total}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {cell(labels.cPerMonth, view.f.monthly.total)}
        {cell(labels.cOneOff, view.f.oneOff.total)}
      </div>
      <QuoteButton
        label={labels.cQuoteArrow}
        variant="secondary"
        size="lg"
        className="mt-2.5 w-full"
        testId="calc-quote-open-snap"
      />
    </div>
  );
}

/** "Can you hire N? … needs 5·N Turkish employees … Check your quota →" (calc.041–049): a same-page
 *  link to the quota gate; the desktop and phone sentences are both in the DOM (W10). */
export function QuotaHint({ view, labels }: { view: CardView; labels: CardLabels }) {
  return (
    <a
      href="#quota"
      className="mt-[11px] flex items-start gap-2.5 rounded-[11px] border border-border-2 bg-pale-2 px-3.5 py-[11px] text-body-sm text-text-secondary no-underline hover:border-tint-border hover:bg-tint"
    >
      <span>
        <strong className="font-extrabold text-ink">
          <Sentence runs={[labels.cQuotaQ1, view.headcountText, labels.cQuotaQ2]} />
        </strong>{' '}
        <span className="max-md:hidden">
          <Sentence
            runs={[
              labels.cQuotaD1,
              { b: `${view.quotaNeeded} ${labels.cQuotaStaff}` },
              labels.cQuotaD2,
            ]}
          />
        </span>
        <span className="md:hidden">
          <Sentence
            runs={[
              labels.cQuotaM1,
              { b: `${view.quotaNeeded} ${labels.cQuotaStaffShort}` },
              labels.cQuotaM2,
            ]}
          />
        </span>{' '}
        <span className="whitespace-nowrap font-extrabold text-blue-safe">{labels.cQuotaLink}</span>
      </span>
    </a>
  );
}
