'use client';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import { computeCardView, type CardViewLabels, type DesignRole } from '../_lib/card-view';
import { makeCardCopy } from '../_lib/copy';
import type { RecapLabels } from '../_lib/ids';
import { useEstimateInputs } from './estimate-store';
import { RecapCard } from './RecapCard';

export type RecapIslandProps = {
  locale: Locale;
  rateConfig: RateConfig;
  roles: DesignRole[];
  roleLabels: Record<string, string>;
  industryLabels: Record<string, string>;
  cardLabels: CardViewLabels;
  labels: RecapLabels;
};

/** The closing band's phone recap (design .ja-cta-mob) following the calculator. */
export function RecapIsland({
  locale,
  rateConfig,
  roles,
  roleLabels,
  industryLabels,
  cardLabels,
  labels,
}: RecapIslandProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const view = computeCardView({
    inputs,
    roles,
    rateConfig,
    locale,
    roleLabels,
    industryLabels,
    labels: cardLabels,
    copy: makeCardCopy(sys),
  });
  return <RecapCard view={view} labels={labels} />;
}
