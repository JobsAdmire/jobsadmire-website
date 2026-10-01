import type { CalculatorRole, RateConfig } from '@/content/collections';
import type { Locale } from '@/i18n/routing';
import { estimate, formatEstimate, multiplierLabel } from '@/lib/calculator';
import { HEADCOUNT_PRESETS, stateKey, type TeaserView } from './teaser-keys';

/** The translated pieces a view needs — the section passes closures over `useTranslations`; the
 *  model itself never touches next-intl (R23). */
export type TeaserLabels = {
  grossMin: string;
  grossFloor: (multiplier: string) => string;
  headcount: (n: number) => string;
  estimate: (args: { role: string; headcount: number; monthly: string; oneOff: string }) => string;
};

/**
 * One teaser state through the shared engine (W2): the exact floor (`legalMinGross ×
 * multiplier`, never rounded up), the default SGK tier, the minimum-wage support OFF (W58 — the
 * General figure is ₺40,214, COPY_DELTAS' model; the design's ₺38,944 applied the support), and
 * every figure formatted once at the edge (D18/W144).
 */
export function teaserView(input: {
  role: CalculatorRole;
  roleLabel: string;
  headcount: number;
  rateConfig: RateConfig;
  locale: Locale;
  labels: TeaserLabels;
}): TeaserView {
  const { role, roleLabel, rateConfig, locale, labels } = input;
  const est = estimate({ role, headcount: input.headcount, supportOptIn: false }, rateConfig);
  const f = formatEstimate(est, locale);
  const headcount = est.input.headcount;
  return {
    roleKey: role.key,
    headcount,
    grossLabel:
      role.multiplier === 1
        ? labels.grossMin
        : labels.grossFloor(multiplierLabel(role.multiplier, locale)),
    gross: f.perWorker.monthly.gross,
    sgk: f.perWorker.monthly.sgk,
    perWorker: f.perWorker.monthly.total,
    salaryPct: est.shares.salaryPct,
    sgkPct: est.shares.sgkPct,
    salaryPctLabel: f.shares.salaryPct,
    sgkPctLabel: f.shares.sgkPct,
    headcountLabel: labels.headcount(headcount),
    monthly: f.monthly.total,
    oneOff: f.oneOff.total,
    whatsappText: labels.estimate({
      role: roleLabel,
      headcount,
      monthly: f.monthly.total,
      oneOff: f.oneOff.total,
    }),
  };
}

/** Every (preset row × chip) state, keyed by `stateKey` — what the island switches between. */
export function teaserViews(input: {
  roles: { row: CalculatorRole; label: string }[];
  rateConfig: RateConfig;
  locale: Locale;
  labels: TeaserLabels;
}): Record<string, TeaserView> {
  const views: Record<string, TeaserView> = {};
  for (const { row, label } of input.roles)
    for (const headcount of HEADCOUNT_PRESETS)
      views[stateKey(row.key, headcount)] = teaserView({
        role: row,
        roleLabel: label,
        headcount,
        rateConfig: input.rateConfig,
        locale: input.locale,
        labels: input.labels,
      });
  return views;
}
