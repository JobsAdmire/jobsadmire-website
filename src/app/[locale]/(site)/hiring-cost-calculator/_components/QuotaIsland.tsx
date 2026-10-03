'use client';
import { useTranslations } from 'next-intl';
import { Stepper } from '@/design/islands/Stepper';
import type { Locale } from '@/i18n/routing';
import { makeQuotaCopy } from '../_lib/copy';
import { TURKISH_STAFF } from '../_lib/estimate-inputs';
import type { QuotaLabels } from '../_lib/ids';
import { computeQuotaView } from '../_lib/quota-view';
import { setEstimateInputs, useEstimateInputs } from './estimate-store';
import { QuotaView } from './QuotaView';

export type QuotaIslandProps = {
  variant: 'mobile' | 'desktop';
  locale: Locale;
  quotaRatio: number;
  labels: QuotaLabels;
};

/** Gate 1 live: the Turkish-staff stepper (±5, 0–5000 — design 1728/2769) writes the shared store,
 *  so the pass check's quota row follows; the "you picked N" line reads the calculator's
 *  headcount. Loaded 200 px before view (W13 amended); the design's `quota_check` event is not
 *  ported (W12). */
export function QuotaIsland({ variant, locale, quotaRatio, labels }: QuotaIslandProps) {
  const sys = useTranslations('sys');
  const { turkishStaff, headcount } = useEstimateInputs();
  const view = computeQuotaView({
    staff: turkishStaff,
    headcount,
    ratio: quotaRatio,
    locale,
    labels,
    copy: makeQuotaCopy(sys),
  });
  return (
    <QuotaView
      variant={variant}
      view={view}
      labels={labels}
      live
      stepper={
        <Stepper
          id={variant === 'mobile' ? 'calc-staff-m' : 'calc-staff'}
          label={labels.qStaffLbl}
          value={turkishStaff}
          onChange={(v) => setEstimateInputs({ turkishStaff: v })}
          min={0}
          max={TURKISH_STAFF.max}
          step={TURKISH_STAFF.step}
          decrementLabel={sys('calc.a11y.decrease', { step: TURKISH_STAFF.step })}
          incrementLabel={sys('calc.a11y.increase', { step: TURKISH_STAFF.step })}
          className="[&>label]:sr-only"
        />
      }
    />
  );
}
