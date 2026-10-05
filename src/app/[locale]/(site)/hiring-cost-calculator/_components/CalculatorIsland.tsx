'use client';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { RangeSlider } from '@/design/islands/RangeSlider';
import { Stepper } from '@/design/islands/Stepper';
import { RadioChips } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import { LIMITS, SGK_TIERS, type RateConfig, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import { computeCardView, type DesignRole } from '../_lib/card-view';
import { makeCardCopy } from '../_lib/copy';
import { MONTH_OPTIONS, type Months } from '../_lib/estimate-inputs';
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
  ROLE_BUTTON,
  RowHead,
  SELECT,
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
import { setEstimateInputs, useEstimateInputs } from './estimate-store';

export type CalculatorIslandProps = {
  locale: Locale;
  rateConfig: RateConfig;
  roles: DesignRole[];
  labels: CardLabels;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  /** `sys.nav.close`, resolved on the server (`nav` stays out of CLIENT_SYS, W148). */
  closeLabel: string;
  /** true when the card was entered by keyboard: take focus once mounted (the skeleton's focused
   *  button is gone). */
  focusOnMount?: boolean;
};

function Toggle({
  id,
  label,
  note,
  checked,
  onChange,
  green = false,
}: {
  id: string;
  label: string;
  note?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  green?: boolean;
}) {
  return (
    <label htmlFor={id} className={TOGGLE_ROW}>
      <span className={TOGGLE_TEXT}>
        {label}
        {note ? (
          <>
            {' '}
            <span className={TOGGLE_NOTE}>{note}</span>
          </>
        ) : null}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={
          green
            ? 'h-[18px] w-[18px] shrink-0 cursor-pointer accent-success max-md:h-6 max-md:w-6'
            : 'h-[18px] w-[18px] shrink-0 cursor-pointer accent-blue-safe max-md:h-6 max-md:w-6'
        }
      />
    </label>
  );
}

/**
 * The live calculator (design #calculator, 574–737) — its own chunk, loaded by `CalculatorLoader`
 * on the first touch of the card (W13 amended). One engine (W2/W24) through `computeCardView`;
 * state in the shared store so the quota gate, the pass check, the guide, the recap and the quote
 * form follow it. `calculator_use` fires on every role or headcount commit with the role KEY and
 * the integer (W12); nothing else is tracked (the design's calc_print/calc_months/calc_sgk_tier
 * are not in the allowlist).
 */
export function CalculatorIsland({
  locale,
  rateConfig,
  roles,
  labels,
  roleLabels,
  industryLabels,
  closeLabel,
  focusOnMount = false,
}: CalculatorIslandProps) {
  const sys = useTranslations('sys');
  const page = usePathname() ?? '/'; // R35: the real URL
  const uiLocale = useLocale();
  const inputs = useEstimateInputs();
  const rootRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState(false);
  const [sheetIndustry, setSheetIndustry] = useState('all');
  const [advanced, setAdvanced] = useState(false);
  const [breakdown, setBreakdown] = useState(false);

  useEffect(() => {
    if (!focusOnMount) return;
    const controls = rootRef.current?.querySelectorAll<HTMLElement>('select, button, input') ?? [];
    Array.from(controls)
      .find((el) => el.offsetParent !== null)
      ?.focus();
  }, [focusOnMount]);

  const view = computeCardView({
    inputs,
    roles,
    rateConfig,
    locale,
    roleLabels,
    industryLabels,
    labels,
    copy: makeCardCopy(sys),
  });
  const used = (role: string, headcount: number) =>
    track('calculator_use', { page, locale: uiLocale, role, headcount });
  const pickRole = (roleKey: string) => {
    setEstimateInputs({ roleKey, grossSalary: null });
    used(roleKey, view.headcount);
  };
  const pickHeadcount = (headcount: number) => {
    setEstimateInputs({ headcount });
    used(view.roleKey, headcount);
  };
  const industries = [...new Set(roles.map((r) => r.industry))];
  const adv = advanced ? '' : 'max-md:hidden';

  return (
    <div ref={rootRef} data-testid="calc-island" className={CARD_GRID}>
      <div className={LEFT_COL}>
        <p className={KICKER}>{labels.cReq}</p>
        <Snapshot view={view} labels={labels} />
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="calc-role" className={`${FIELD_LABEL} max-md:hidden`}>
              {labels.cProfession}
            </label>
            <select
              id="calc-role"
              value={view.roleKey}
              onChange={(e) => pickRole(e.target.value)}
              className={`${SELECT} max-md:hidden`}
            >
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {roleLabels[r.key]} · {industryLabels[r.industry]}
                </option>
              ))}
            </select>
            <p id="calc-role-m-label" className={`${FIELD_LABEL} md:hidden`}>
              {labels.cProfession}
            </p>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-labelledby="calc-role-m-label calc-role-m-value"
              onClick={() => {
                setSheetIndustry('all');
                setSheet(true);
              }}
              className={`${ROLE_BUTTON} md:hidden`}
            >
              <span id="calc-role-m-value" className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-body font-extrabold text-ink">{view.roleLabel}</span>
                <span className="text-[12px] xl:text-[11px] font-bold text-text-tertiary">
                  {view.industryLabel} · {view.roleRange}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-input bg-tint text-[13px] xl:text-[11px] font-extrabold text-blue-safe"
              >
                ▼
              </span>
            </button>
            <BottomSheet
              open={sheet}
              onClose={() => setSheet(false)}
              title={labels.sheetPick}
              closeLabel={closeLabel}
            >
              <RadioChips
                name="calc-sheet-industry"
                legend={sys('calc.a11y.industries')}
                legendHidden
                face="solid"
                value={sheetIndustry}
                onChange={setSheetIndustry}
                options={[
                  { value: 'all', label: labels.allShort },
                  ...industries.map((i) => ({ value: i, label: industryLabels[i] ?? i })),
                ]}
                className="mb-3"
              />
              <ul className="m-0 list-none p-0">
                {roles
                  .filter((r) => sheetIndustry === 'all' || r.industry === sheetIndustry)
                  .map((r) => (
                    <li key={r.key}>
                      <button
                        type="button"
                        aria-pressed={r.key === view.roleKey}
                        onClick={() => {
                          pickRole(r.key);
                          setSheet(false);
                        }}
                        className={[
                          'mb-1.5 flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-3 rounded-xs border-[1.5px] px-[13px] xl:px-[9.75px] py-2.5 text-left',
                          r.key === view.roleKey
                            ? 'border-blue-safe bg-pale-3'
                            : 'border-border-3 bg-white',
                        ].join(' ')}
                      >
                        <span className="flex flex-col">
                          <span className="font-extrabold text-ink">{roleLabels[r.key]}</span>
                          <span className="text-body-sm text-text-tertiary">
                            {industryLabels[r.industry]}
                          </span>
                        </span>
                        <span aria-hidden="true" className="font-extrabold text-blue-safe">
                          {r.key === view.roleKey ? '✓' : ''}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </BottomSheet>
          </div>
          <div>
            <RowHead label={labels.cWorkers} value={view.headcountText} hidden />
            <div className="flex flex-wrap items-center gap-2.5">
              <Stepper
                id="calc-headcount"
                label={labels.cWorkers}
                value={view.headcount}
                onChange={pickHeadcount}
                min={LIMITS.headcountMin}
                max={LIMITS.headcountMax}
                decrementLabel={sys('calc.a11y.decrease', { step: 1 })}
                incrementLabel={sys('calc.a11y.increase', { step: 1 })}
                className="[&>label]:sr-only"
                stretch
              />
              <RadioChips
                name="calc-headcount-preset"
                legend={sys('calc.a11y.headcountPresets')}
                legendHidden
                stretch
                face="solid"
                compact
                className="md:ml-1"
                value={presetValue(view.headcount)}
                onChange={(v) => pickHeadcount(Number(v))}
                options={HEADCOUNT_OPTIONS}
              />
            </div>
            <QuotaHint view={view} labels={labels} />
          </div>
          <div className={adv}>
            <RowHead label={labels.cContract} value={view.monthsNote} hidden />
            <RadioChips
              name="calc-months"
              legend={labels.cContract}
              legendHidden
              face="solid"
              value={String(view.months)}
              onChange={(v) => {
                const m = Number(v);
                if ((MONTH_OPTIONS as readonly number[]).includes(m))
                  setEstimateInputs({ months: m as Months });
              }}
              options={monthOptions(labels)}
            />
          </div>
          <div data-testid="calc-salary-row">
            <RangeSlider
              id="calc-salary"
              label={labels.cSalary}
              min={0}
              max={view.stops.length - 1}
              step={1}
              value={view.stopIndex}
              onChange={(i) => setEstimateInputs({ grossSalary: view.stops[i] ?? null })}
              formatValue={(i) =>
                `${formatTRY(view.stops[i] ?? view.stops[0], locale)} ${labels.perMonthSuffix}`
              }
              minLabel={view.salaryMinLabel}
              maxLabel={view.salaryMaxLabel}
              hint={view.thresholdNote}
            />
          </div>
          <div role="group" aria-labelledby="calc-cover" className={`${COVER_BOX} ${adv}`}>
            <p id="calc-cover" className={COVER_TITLE}>
              {labels.cCover}
            </p>
            <Toggle
              id="calc-flight"
              label={labels.cFlight}
              checked={view.flight}
              onChange={(flight) => setEstimateInputs({ flight })}
            />
            <Toggle
              id="calc-housing"
              label={labels.cAcc}
              note={labels.cAccNote}
              checked={view.housing}
              onChange={(housing) => setEstimateInputs({ housing })}
            />
            <Toggle
              id="calc-support"
              label={labels.cSupport}
              note={labels.cSupportNote}
              checked={view.supportOptIn}
              onChange={(supportOptIn) => setEstimateInputs({ supportOptIn })}
              green
            />
          </div>
          <div className={`${TIER_BOX} ${adv}`}>
            <RowHead label={labels.cSgkDisc} value={view.sgkRate} kicker hidden />
            <RadioChips
              name="calc-tier"
              legend={labels.cSgkDisc}
              legendHidden
              face="solid"
              compact
              value={view.sgkTier}
              onChange={(v) => {
                // W144: estimate() throws on an unknown tier — only a known key reaches the store
                if ((SGK_TIERS as readonly string[]).includes(v))
                  setEstimateInputs({ sgkTier: v as SgkTier });
              }}
              options={tierOptions(labels)}
            />
          </div>
          <button
            type="button"
            aria-expanded={advanced}
            onClick={() => setAdvanced((v) => !v)}
            className={`${ADV_TOGGLE} md:hidden`}
          >
            {advanced ? labels.advFew : labels.advMore}
          </button>
        </div>
      </div>
      <div className={RIGHT_COL}>
        <button
          type="button"
          aria-expanded={breakdown}
          onClick={() => setBreakdown((v) => !v)}
          className={`${BRK_TOGGLE} md:hidden`}
        >
          <span>{breakdown ? labels.brkHide : labels.brkShow}</span>
          <span
            aria-hidden="true"
            className="text-[12px] xl:text-[11px] font-extrabold text-blue-safe"
          >
            {breakdown ? '−' : '+'}
          </span>
        </button>
        <EstimateBreakdown view={view} labels={labels} breakdownOpen={breakdown} />
      </div>
      <p className="sr-only" aria-live="polite">
        {view.totalTitle}: {view.f.contract.total} · {view.headcountNote}
      </p>
    </div>
  );
}
