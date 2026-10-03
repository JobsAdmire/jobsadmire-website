'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import { RadioChips } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import type { DesignRole } from '../_lib/card-view';
import { CALC_ARM_EVENT } from '../_lib/events';
import type { GuideLabels } from '../_lib/ids';
import { buildGuideRows } from '../_lib/salary-guide';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';
import { SalaryGuideView } from './SalaryGuideView';

export type SalaryGuideIslandProps = {
  locale: Locale;
  roles: DesignRole[];
  rateConfig: RateConfig;
  labels: GuideLabels;
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  scaleMin: string;
  scaleMax: string;
};

/** The guide follows the calculator's tier (W59) and its role; "Use in calculator" sets the role,
 *  asks the card to load (CALC_ARM_EVENT) and scrolls to it — the design's
 *  `calc_role_from_guide` becomes a plain `calculator_use` with the role key (W12). */
export function SalaryGuideIsland({
  locale,
  roles,
  rateConfig,
  labels,
  roleLabels,
  industryLabels,
  scaleMin,
  scaleMax,
}: SalaryGuideIslandProps) {
  const sys = useTranslations('sys');
  const page = usePathname() ?? '/';
  const uiLocale = useLocale();
  const inputs = useEstimateInputs();
  const [industry, setIndustry] = useState('all');
  const rows = buildGuideRows({
    roles,
    rateConfig,
    tier: inputs.sgkTier,
    locale,
    roleLabels,
    industryLabels,
    labels: { skilled: labels.skilled, standard: labels.standard },
  });
  const industries = [...new Set(roles.map((r) => r.industry))];
  const use = (key: string) => {
    setEstimateInputs({ roleKey: key, grossSalary: null });
    track('calculator_use', { page, locale: uiLocale, role: key, headcount: inputs.headcount });
    window.dispatchEvent(new Event(CALC_ARM_EVENT));
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById('calculator')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <SalaryGuideView
      rows={rows.filter((r) => industry === 'all' || r.industry === industry)}
      activeKey={inputs.roleKey}
      labels={labels}
      scaleMin={scaleMin}
      scaleMax={scaleMax}
      onUse={use}
      live
      filter={
        <RadioChips
          name="calc-guide-industry"
          legend={sys('calc.a11y.industries')}
          legendHidden
          value={industry}
          onChange={setIndustry}
          options={[
            { value: 'all', label: labels.allInd },
            ...industries.map((i) => ({ value: i, label: industryLabels[i] ?? i })),
          ]}
        />
      }
    />
  );
}
