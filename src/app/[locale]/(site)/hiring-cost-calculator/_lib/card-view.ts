import type { Locale } from '@/i18n/routing';
import {
  estimate,
  formatEstimate,
  salaryFloor,
  salaryRange,
  sgkRateLabel,
  turkishStaffRequired,
  type CalculatorRole,
  type FormattedEstimate,
  type RateConfig,
  type SgkTier,
} from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { multiplierNumber, type CardCopy } from './copy';
import { DEFAULT_ROLE_KEY, type EstimateInputs, type Months } from './estimate-inputs';
import type { CardLabels } from './ids';

type Industry = NonNullable<CalculatorRole['industry']>;

/** A role this page offers: an industry and a salary band. The `preset: true` rows are the
 *  homepage teaser's (W24) and never appear here. */
export type DesignRole = CalculatorRole & {
  industry: Industry;
  industryLabelId: string;
  salaryMax: number;
};

export function designRoles(roles: readonly CalculatorRole[]): DesignRole[] {
  return roles.filter(
    (r): r is DesignRole =>
      !r.preset && r.industry !== null && r.industryLabelId !== null && r.salaryMax !== null,
  );
}

export function resolveRole(roles: readonly DesignRole[], key: string): DesignRole {
  const role =
    roles.find((r) => r.key === key) ?? roles.find((r) => r.key === DEFAULT_ROLE_KEY) ?? roles[0];
  if (!role)
    throw new Error('calculatorRoles holds no design role — the page renders its empty state');
  return role;
}

/** role key → label, industry key → label, resolved on the server through `makeTf` (W1). */
export function roleLabelMaps(roles: readonly DesignRole[], t: (id: string) => string) {
  const roleLabels: Record<string, string> = {};
  const industryLabels: Record<string, string> = {};
  for (const r of roles) {
    roleLabels[r.key] = t(r.labelId);
    industryLabels[r.industry] = t(r.industryLabelId);
  }
  return { roleLabels, industryLabels };
}

export const SALARY_STEP = 500;

/** The slider's stops: the exact floor (W2 — 49,545 for a 1.5× role), every ₺500 above it, then
 *  the band maximum, so a native range input reaches both ends (a `step="500"` from 49,545 could
 *  never land on 70,000). The slider moves over the stop index. */
export function salaryStops(min: number, max: number, step = SALARY_STEP): number[] {
  const stops = [min];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) if (v > min) stops.push(v);
  if (stops[stops.length - 1] < max) stops.push(max);
  return stops;
}

/** The stop a salary sits on — the last one not above it. */
export function stopIndex(stops: readonly number[], value: number): number {
  let i = 0;
  while (i + 1 < stops.length && stops[i + 1] <= value) i += 1;
  return i;
}

export type CardViewLabels = Pick<
  CardLabels,
  'perWorker' | 'fullYear' | 'firstYear' | 'perMonthSuffix'
>;

export type CardView = {
  roleKey: string;
  roleLabel: string;
  industryLabel: string;
  roleRange: string;
  headcount: number;
  headcountText: string;
  headcountNote: string;
  months: Months;
  monthsNote: string;
  stops: number[];
  stopIndex: number;
  salaryLabel: string;
  salaryMinLabel: string;
  salaryMaxLabel: string;
  thresholdNote: string;
  sgkTier: SgkTier;
  sgkRate: string;
  f: FormattedEstimate;
  seasonal: boolean;
  perMonthPerWorker: string;
  totalTitle: string;
  yearNote: string;
  quotaNeeded: string;
  flight: boolean;
  housing: boolean;
  supportOptIn: boolean;
  whatsappEstimate: string;
};

/** The card's whole view — the server skeleton, the island, the recap and the quote sheet all
 *  render from this one function, so the first paint and the live card cannot disagree. */
export function computeCardView({
  inputs,
  roles,
  rateConfig,
  locale,
  roleLabels,
  industryLabels,
  labels,
  copy,
}: {
  inputs: EstimateInputs;
  roles: readonly DesignRole[];
  rateConfig: RateConfig;
  locale: Locale;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  labels: CardViewLabels;
  copy: CardCopy;
}): CardView {
  const role = resolveRole(roles, inputs.roleKey);
  const range = salaryRange(role, rateConfig);
  const max = range.max ?? range.min;
  const stops = salaryStops(range.min, max);
  const est = estimate(
    {
      role,
      headcount: inputs.headcount,
      months: inputs.months,
      grossSalary: inputs.grossSalary,
      sgkTier: inputs.sgkTier,
      flight: inputs.flight,
      housing: inputs.housing,
      supportOptIn: inputs.supportOptIn,
    },
    rateConfig,
  );
  const f = formatEstimate(est, locale);
  const head = est.input.headcount;
  const months = inputs.months;
  const roleLabel = roleLabels[role.key] ?? role.key;
  const headcountText = formatInt(head, locale);
  return {
    roleKey: role.key,
    roleLabel,
    industryLabel: industryLabels[role.industry] ?? role.industry,
    roleRange: `${formatTRY(range.min, locale)} – ${formatTRY(max, locale)}`,
    headcount: head,
    headcountText,
    headcountNote: head === 1 ? labels.perWorker : copy.forWorkers(headcountText),
    months,
    monthsNote: months === 12 ? labels.fullYear : copy.nMonths(months),
    stops,
    stopIndex: stopIndex(stops, est.input.grossSalary),
    salaryLabel: `${f.grossSalary} ${labels.perMonthSuffix}`,
    salaryMinLabel: formatTRY(range.min, locale),
    salaryMaxLabel: formatTRY(max, locale),
    // W2: the exact floor (legalMinGross × multiplier) — calc.557's wording, the model's figure
    thresholdNote: copy.threshold(
      formatTRY(salaryFloor(role, rateConfig), locale),
      multiplierNumber(role.multiplier, locale),
    ),
    sgkTier: est.input.sgkTier,
    sgkRate: sgkRateLabel(rateConfig, est.input.sgkTier, locale),
    f,
    seasonal: months < 12,
    perMonthPerWorker: `${f.contract.perWorkerPerMonth} ${labels.perMonthSuffix}`,
    totalTitle: months === 12 ? labels.firstYear : copy.seasonTotal(months),
    yearNote: copy.yearNote(months, head),
    quotaNeeded: formatInt(turkishStaffRequired(head, rateConfig.quotaRatio), locale),
    flight: est.input.flight,
    housing: est.input.housing,
    supportOptIn: est.input.supportOptIn,
    whatsappEstimate: copy.whatsappEstimate(headcountText, roleLabel, f.grossSalary, months),
  };
}
