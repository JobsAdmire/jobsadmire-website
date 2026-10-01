import type { ReactNode } from 'react';
import { buttonClassName } from '@/design/primitives/Button';
import type { TeaserView } from '../lib/teaser-keys';

/** The estimate link's face: the design's green WhatsApp outline is the `success` variant (W127). */
export const TEASER_WA_CLASS = buttonClassName('success', 'md');
/** The rows the ≤ 460 px disclosure controls. */
export const TEASER_ROWS_ID = 'calc-rows';

export type TeaserCardCopy = {
  per: string;
  /** home.079 while the rate config is in review; null from `reviewDueAt` (D17/W150) */
  rates: string | null;
  sgk: string;
  support: string;
  supportValue: string;
  total: string;
  salaryPct: string;
  sgkPct: string;
  monthlyPayroll: string;
  oneOff: string;
  whatsapp: string;
  more: string;
  less: string;
  disc: string;
};

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[7px]">
      <span className="text-body-sm text-text-secondary">{label}</span>
      <span
        className={
          muted
            ? 'text-right text-body-sm font-bold text-text-secondary'
            : 'whitespace-nowrap text-body-sm font-extrabold text-ink'
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * The design's cost card (lines 562–611). `expanded`/`onToggle` drive the ≤ 460 px "See cost
 * breakdown" disclosure; from `xs` up the rows always show (W10). `whatsapp` is the estimate link
 * — `ContactLink` with the bare href in the server fallback, `WhatsAppComposeLink` in the island
 * (both render the same anchor, W95). `ctas` = the phone-only calculator/permits pair. No
 * directive: the server fallback and the island share it.
 */
export function TeaserCard({
  view,
  copy,
  expanded,
  onToggle,
  ctas,
  whatsapp,
}: {
  view: TeaserView;
  copy: TeaserCardCopy;
  expanded: boolean;
  onToggle?: () => void;
  ctas: ReactNode;
  whatsapp: ReactNode;
}) {
  const rows = expanded ? undefined : 'max-xs:hidden';
  return (
    <div className="overflow-hidden rounded-hero border border-border-1 bg-white shadow-[0_22px_50px_rgba(22,60,90,0.10)] max-xs:rounded-xl">
      <div className="border-b border-dashed border-border-4 px-7 pb-[18px] pt-6 max-xs:px-5 max-xs:pb-4 max-xs:pt-[18px] xl:px-[21px] xl:pt-[18px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1.1px] text-text-tertiary">
            {copy.per}
          </span>
          {copy.rates ? (
            <span
              data-testid="calc-rates-badge"
              className="inline-flex items-center whitespace-nowrap rounded-pill border border-success-border bg-success-surface px-3 py-1 text-[11px] font-extrabold text-success-text"
            >
              {copy.rates}
            </span>
          ) : null}
        </div>
        <div id={TEASER_ROWS_ID} className={rows}>
          <Row label={view.grossLabel} value={view.gross} />
          <Row label={copy.sgk} value={view.sgk} />
          <Row label={copy.support} value={copy.supportValue} muted />
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-border-3 pb-0.5 pt-3">
          <span className="text-body-sm font-extrabold text-ink">{copy.total}</span>
          <span
            data-testid="calc-per-worker"
            className="whitespace-nowrap text-body font-extrabold text-blue-safe"
          >
            {view.perWorker}
          </span>
        </div>
        <div className={rows}>
          <div
            aria-hidden="true"
            className="mt-3.5 flex h-2.5 overflow-hidden rounded-pill bg-border-3"
          >
            <span className="block h-full bg-blue" style={{ width: `${view.salaryPct}%` }} />
            <span className="block h-full bg-[#16294f]" style={{ width: `${view.sgkPct}%` }} />
          </div>
          <div className="mt-[9px] flex flex-wrap items-center gap-4 text-[11.5px] font-bold text-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-[9px] w-[9px] rounded-[3px] bg-blue"
              />
              {copy.salaryPct} {view.salaryPctLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-[9px] w-[9px] rounded-[3px] bg-[#16294f]"
              />
              {copy.sgkPct} {view.sgkPctLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={TEASER_ROWS_ID}
          onClick={onToggle}
          className="mt-3 flex min-h-[44px] w-full items-center gap-2 text-left text-[13px] font-extrabold text-blue-safe xs:hidden"
        >
          {expanded ? copy.less : copy.more}
        </button>
      </div>
      <div className="bg-[#f7fbfd] px-7 pb-6 pt-5 max-xs:px-5 xl:px-[21px]">
        <div className="mb-3.5 flex items-baseline justify-between gap-3">
          <span className="text-body-sm font-extrabold text-text-secondary">
            {view.headcountLabel} · {copy.monthlyPayroll}
          </span>
          <span
            data-testid="calc-monthly"
            className="whitespace-nowrap font-display text-[clamp(24px,2.4vw,30px)] font-extrabold leading-none tracking-[-1.2px] text-ink max-xs:text-[30px] xl:text-[clamp(18px,1.8vw,22.5px)]"
          >
            {view.monthly}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border-4 pt-[13px] max-xs:flex-col max-xs:items-start max-xs:gap-[3px]">
          <span className="text-body-sm font-bold text-text-secondary">{copy.oneOff}</span>
          <span
            data-testid="calc-oneoff"
            className="whitespace-nowrap text-body font-extrabold text-ink"
          >
            {view.oneOff}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-border-3 bg-white px-7 pb-5 pt-[13px] max-xs:px-5 xl:px-[21px]">
        {whatsapp}
        <div className="flex flex-col gap-2.5 xs:hidden">{ctas}</div>
        <p className="m-0 text-[12px] font-semibold leading-normal text-text-tertiary">
          {copy.disc}
        </p>
      </div>
    </div>
  );
}
