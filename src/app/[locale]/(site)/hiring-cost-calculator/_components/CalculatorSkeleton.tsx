import type { CardView } from '../_lib/card-view';
import type { CardLabels } from '../_lib/ids';
import {
  ADV_TOGGLE,
  BRK_TOGGLE,
  CARD_GRID,
  COVER_BOX,
  COVER_TITLE,
  FIELD_LABEL,
  HEADCOUNT_OPTIONS,
  KICKER,
  LEFT_COL,
  QuotaHint,
  RIGHT_COL,
  RowHead,
  Snapshot,
  TIER_BOX,
  TOGGLE_NOTE,
  TOGGLE_ROW,
  TOGGLE_TEXT,
  monthOptions,
  presetValue,
  tierOptions,
} from './card-ui';
import { EstimateBreakdown } from './EstimateBreakdown';
import { ChipsLook, CheckLook, SelectLook, SliderLook, StepperLook } from './Lookalikes';

function ToggleLook({
  label,
  note,
  checked,
  green,
}: {
  label: string;
  note?: string;
  checked: boolean;
  green?: boolean;
}) {
  return (
    <div className={TOGGLE_ROW}>
      <span className={TOGGLE_TEXT}>
        {label}
        {note ? (
          <>
            {' '}
            <span className={TOGGLE_NOTE}>{note}</span>
          </>
        ) : null}
      </span>
      <CheckLook checked={checked} green={green} />
    </div>
  );
}

/**
 * The calculator card as the server renders it (W13 amended): the island's layout at the given
 * view, with static lookalike controls and the model's real figures, so the first paint, the
 * print view and the pixel harness all see the designed card while the engine and the five
 * controls stay out of the first-load script. The one real control is an `sr-only` button
 * (visible on focus) — focusing or touching anything in the card loads the island
 * (`CalculatorLoader`), which then takes focus itself.
 */
export function CalculatorSkeleton({
  view,
  labels,
  activateLabel,
}: {
  view: CardView;
  labels: CardLabels;
  activateLabel: string;
}) {
  const sliderPct = view.stops.length > 1 ? (view.stopIndex / (view.stops.length - 1)) * 100 : 0;
  const tier = tierOptions(labels).find((o) => o.value === view.sgkTier);
  return (
    <div data-testid="calc-skeleton" className={CARD_GRID}>
      <div className={LEFT_COL}>
        <button
          type="button"
          data-testid="calc-activate"
          className="sr-only focus:not-sr-only focus:mb-3 focus:block focus:rounded-xs focus:bg-tint focus:px-3 focus:py-2 focus:text-body-sm focus:font-extrabold focus:text-blue-safe"
        >
          {activateLabel}
        </button>
        <p className={KICKER}>{labels.cReq}</p>
        <Snapshot view={view} labels={labels} />
        <div className="flex flex-col gap-4">
          <div>
            <p className={FIELD_LABEL}>{labels.cProfession}</p>
            <SelectLook
              text={`${view.roleLabel} · ${view.industryLabel}`}
              className="max-md:hidden"
            />
            <div
              aria-hidden="true"
              className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xs border-[1.5px] border-border-1 bg-white px-3.5 py-[11px] xl:py-[8.25px] md:hidden"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-body font-extrabold text-ink">{view.roleLabel}</span>
                <span className="text-[12px] xl:text-[11px] font-bold text-text-tertiary">
                  {view.industryLabel} · {view.roleRange}
                </span>
              </span>
              <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-tint text-[13px] xl:text-[11px] font-extrabold text-blue-safe">
                ▼
              </span>
            </div>
          </div>
          <div>
            <RowHead label={labels.cWorkers} value={view.headcountText} />
            <div className="flex flex-wrap items-end gap-2.5">
              <StepperLook value={view.headcountText} stretch />
              <ChipsLook options={HEADCOUNT_OPTIONS} value={presetValue(view.headcount)} stretch />
            </div>
            <QuotaHint view={view} labels={labels} />
          </div>
          <div className="max-md:hidden">
            <RowHead label={labels.cContract} value={view.monthsNote} />
            <ChipsLook options={monthOptions(labels)} value={String(view.months)} />
          </div>
          <div data-testid="calc-salary-row">
            <SliderLook
              label={labels.cSalary}
              value={view.salaryLabel}
              minLabel={view.salaryMinLabel}
              maxLabel={view.salaryMaxLabel}
              hint={view.thresholdNote}
              pct={sliderPct}
            />
          </div>
          <div className={`${COVER_BOX} max-md:hidden`}>
            <p className={COVER_TITLE}>{labels.cCover}</p>
            <ToggleLook label={labels.cFlight} checked={view.flight} />
            <ToggleLook label={labels.cAcc} note={labels.cAccNote} checked={view.housing} />
            <ToggleLook
              label={labels.cSupport}
              note={labels.cSupportNote}
              checked={view.supportOptIn}
              green
            />
          </div>
          <div className={`${TIER_BOX} max-md:hidden`}>
            <RowHead
              label={labels.cSgkDisc}
              value={`${tier?.label ?? ''} · ${view.sgkRate}`}
              kicker
            />
            <ChipsLook options={tierOptions(labels)} value={view.sgkTier} />
          </div>
          <div aria-hidden="true" className={`${ADV_TOGGLE} md:hidden`}>
            {labels.advMore}
          </div>
        </div>
      </div>
      <div className={RIGHT_COL}>
        <div aria-hidden="true" className={`${BRK_TOGGLE} md:hidden`}>
          <span>{labels.brkShow}</span>
          <span className="text-[12px] xl:text-[11px] font-extrabold text-blue-safe">+</span>
        </div>
        <EstimateBreakdown view={view} labels={labels} />
      </div>
    </div>
  );
}
