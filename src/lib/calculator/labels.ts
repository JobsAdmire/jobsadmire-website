// The calculator's only formatting edge (W24): lira through formatTRY, rates through
// formatPercent (D18), dates through Intl in UTC so an ISO date never slips a day or a month.
// Dates use tr-TR / en-GB — the design formats its "Last updated" pill with en-GB
// ("15 January 2026", Hiring Cost Calculator line 2617); month + year labels read the same in
// en-GB and en-US, and money stays on formatTRY's own locale map. Task 5's date.ts may not exist
// when this lands, so the two date helpers are local and tiny.
import type { Locale } from '@/i18n/routing';
import { formatPercent, formatTRY } from '@/lib/format/money';
import { sgkRate } from './engine';
import {
  CalculatorError,
  type Estimate,
  type MonthlyLines,
  type OneOffLines,
  type RateConfig,
  type SgkTier,
} from './types';

const DATE_INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };
const NUMBER_INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function utcMidnight(iso: string): Date {
  const date = ISO_DATE.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(Number.NaN);
  if (Number.isNaN(date.getTime())) throw new CalculatorError(`not an ISO date: "${iso}"`);
  return date;
}

const formatMonth = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(DATE_INTL[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcMidnight(iso));

const formatDay = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(DATE_INTL[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcMidnight(iso));

/** "Ocak 2026" / "January 2026" — calc.003, home.068/079 (D17: from effectiveFrom, never typed). */
export function effectiveFromLabel(rateConfig: RateConfig, locale: Locale): string {
  return formatMonth(rateConfig.effectiveFrom, locale);
}

/** "15 Ocak 2026" / "15 January 2026" — the calc.089 "Last updated:" pill. */
export function updatedAtLabel(rateConfig: RateConfig, locale: Locale): string {
  return formatDay(rateConfig.updatedAt, locale);
}

/** The year of effectiveFrom — the "{year} rates" badges. */
export function effectiveYear(rateConfig: RateConfig): number {
  return utcMidnight(rateConfig.effectiveFrom).getUTCFullYear();
}

/** True from reviewDueAt 00:00 UTC: the dated badge hides and the owner is due a review (D17). */
export function isReviewDue(rateConfig: RateConfig, now: Date = new Date()): boolean {
  return now.getTime() >= utcMidnight(rateConfig.reviewDueAt).getTime();
}

/** "%21,75" / "21.75%" for a tier. */
export function sgkRateLabel(rateConfig: RateConfig, tier: SgkTier, locale: Locale): string {
  return formatPercent(sgkRate(rateConfig, tier) * 100, locale);
}

/** "1,5×" / "1.5×" / "2×". */
export function multiplierLabel(multiplier: number, locale: Locale): string {
  const n = new Intl.NumberFormat(NUMBER_INTL[locale], { maximumFractionDigits: 2 }).format(
    multiplier,
  );
  return `${n}×`;
}

export type FormattedLines<T> = { [K in keyof T]: string };

export type FormattedEstimate = {
  grossSalary: string;
  perWorker: { monthly: FormattedLines<MonthlyLines>; oneOff: FormattedLines<OneOffLines> };
  monthly: FormattedLines<MonthlyLines>;
  oneOff: FormattedLines<OneOffLines>;
  contract: { payroll: string; oneOff: string; total: string; perWorkerPerMonth: string };
  shares: { salaryPct: string; sgkPct: string };
};

const lira = <T extends Record<string, number>>(lines: T, locale: Locale): FormattedLines<T> =>
  Object.fromEntries(
    Object.entries(lines).map(([key, value]) => [key, formatTRY(value, locale)]),
  ) as FormattedLines<T>;

/** Every lira line through formatTRY (rounded once, here); shares as whole percents. */
export function formatEstimate(estimate: Estimate, locale: Locale): FormattedEstimate {
  return {
    grossSalary: formatTRY(estimate.input.grossSalary, locale),
    perWorker: {
      monthly: lira(estimate.perWorker.monthly, locale),
      oneOff: lira(estimate.perWorker.oneOff, locale),
    },
    monthly: lira(estimate.monthly, locale),
    oneOff: lira(estimate.oneOff, locale),
    contract: {
      payroll: formatTRY(estimate.contract.payroll, locale),
      oneOff: formatTRY(estimate.contract.oneOff, locale),
      total: formatTRY(estimate.contract.total, locale),
      perWorkerPerMonth: formatTRY(estimate.contract.perWorkerPerMonth, locale),
    },
    shares: {
      salaryPct: formatPercent(estimate.shares.salaryPct, locale, 0),
      sgkPct: formatPercent(estimate.shares.sgkPct, locale, 0),
    },
  };
}
