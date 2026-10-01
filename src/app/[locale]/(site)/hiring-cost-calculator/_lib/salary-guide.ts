import type { Locale } from '@/i18n/routing';
import { employerMonthlyCost, salaryRange, type RateConfig, type SgkTier } from '@/lib/calculator';
import { formatTRY } from '@/lib/format/money';
import type { DesignRole } from './card-view';

/** The design's bar scale: 30,000 → the highest band maximum (line 2586). */
export const GUIDE_SCALE_MIN = 30000;
export const guideScaleMax = (roles: readonly DesignRole[]) =>
  Math.max(GUIDE_SCALE_MIN + 1, ...roles.map((r) => r.salaryMax));

/** W144(a): snap to the model's 4-decimal precision before the one rounding formatTRY does, so
 *  an exact half-lira product never rounds the wrong way under float noise. */
const snap4 = (v: number) => Math.round(v * 1e4) / 1e4;

export type GuideRow = {
  key: string;
  role: string;
  industry: DesignRole['industry'];
  industryLabel: string;
  range: string;
  employer: string;
  tier: string;
  skilled: boolean;
  barLeftPct: number;
  barWidthPct: number;
  tickPct: number;
};

/** One card per design role. The low is the model's exact floor (W2; the design reuses its
 *  rounded 50,000) and the employer cost follows the tier chosen in the calculator (W59; the
 *  design fixes 1.2175). Every string is formatted here, once (D18). */
export function buildGuideRows({
  roles,
  rateConfig,
  tier,
  locale,
  roleLabels,
  industryLabels,
  labels,
}: {
  roles: readonly DesignRole[];
  rateConfig: RateConfig;
  tier: SgkTier;
  locale: Locale;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  labels: { skilled: string; standard: string };
}): GuideRow[] {
  const max = guideScaleMax(roles);
  const pct = (v: number) =>
    Math.max(0, Math.min(100, ((v - GUIDE_SCALE_MIN) / (max - GUIDE_SCALE_MIN)) * 100));
  const lira = (v: number) => formatTRY(snap4(v), locale);
  return roles.map((r) => {
    const range = salaryRange(r, rateConfig);
    const hi = range.max ?? range.min;
    const left = pct(range.min);
    return {
      key: r.key,
      role: roleLabels[r.key] ?? r.key,
      industry: r.industry,
      industryLabel: industryLabels[r.industry] ?? r.industry,
      range: `${lira(range.min)} – ${lira(hi)}`,
      employer: `${lira(employerMonthlyCost(range.min, rateConfig, tier))} – ${lira(employerMonthlyCost(hi, rateConfig, tier))}`,
      tier: r.multiplier > 1 ? labels.skilled : labels.standard,
      skilled: r.multiplier > 1,
      barLeftPct: left,
      barWidthPct: Math.max(4, pct(hi) - left),
      tickPct: pct(rateConfig.legalMinGross),
    };
  });
}
