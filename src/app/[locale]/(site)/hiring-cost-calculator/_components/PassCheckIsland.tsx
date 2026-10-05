'use client';
import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ProgressBar } from '@/design/islands/ProgressBar';
import { TriState } from '@/design/islands/TriState';
import { buttonClassName } from '@/design/primitives/Button';
import type { Locale } from '@/i18n/routing';
import type { RateConfig } from '@/lib/calculator';
import type { DesignRole } from '../_lib/card-view';
import { makePassCopy } from '../_lib/copy';
import type { PassLabels } from '../_lib/ids';
import {
  computePassView,
  MANUAL_ROWS,
  type Answers,
  type ManualRow,
  type Tone,
} from '../_lib/pass-check';
import { useEstimateInputs } from './estimate-store';
import { PassCheckView, RESET } from './PassCheckView';
import { WhatsAppIcon } from './icons';
import { WhatsAppComposeLink } from './WhatsAppComposeLink';

export type PassCheckIslandProps = {
  locale: Locale;
  rateConfig: RateConfig;
  roles: DesignRole[];
  roleLabels: Record<string, string>;
  labels: PassLabels;
  whatsappNumber: string;
};

const BAR_TONE: Record<Tone, 'blue' | 'green' | 'amber' | 'red'> = {
  idle: 'blue',
  progress: 'blue',
  green: 'green',
  amber: 'amber',
  red: 'red',
};

/** The five checks in the browser only (calc.378 stays true — nothing is posted, W3); "Send my
 *  result" is the visitor's own WhatsApp click, composed on click (W95). The design's
 *  `passcheck_answer` event is not ported (W12). */
export function PassCheckIsland({
  locale,
  rateConfig,
  roles,
  roleLabels,
  labels,
  whatsappNumber,
}: PassCheckIslandProps) {
  const sys = useTranslations('sys');
  const inputs = useEstimateInputs();
  const [answers, setAnswers] = useState<Answers>({});
  const view = computePassView({
    answers,
    inputs,
    roles,
    rateConfig,
    locale,
    roleLabels,
    labels,
    copy: makePassCopy(sys),
  });
  const titleOf = (row: ManualRow) => view.rows.find((r) => r.key === row)?.title ?? row;
  const controls = Object.fromEntries(
    MANUAL_ROWS.map((row) => [
      row,
      <TriState
        key={row}
        name={`calc-check-${row}`}
        legend={titleOf(row)}
        hideLegend
        value={answers[row] ?? null}
        onChange={(value) => setAnswers((prev) => ({ ...prev, [row]: value }))}
        labels={{ yes: labels.pcYes, no: labels.pcNo, unsure: labels.pcMaybe }}
      />,
    ]),
  ) as Record<ManualRow, ReactNode>;
  return (
    <PassCheckView
      view={view}
      labels={labels}
      live
      controls={controls}
      reset={
        <button
          type="button"
          onClick={() => setAnswers({})}
          className={view.manualAnswered ? RESET : `${RESET} invisible`}
        >
          {labels.pcReset}
        </button>
      }
      bar={
        <ProgressBar
          value={view.progressPct}
          label={labels.vRes}
          valueText={view.count}
          tone={BAR_TONE[view.tone]}
        />
      }
      send={
        <WhatsAppComposeLink
          number={whatsappNumber}
          text={view.whatsappText}
          testId="pass-send"
          className={buttonClassName('success-solid', 'lg', 'w-full', {
            shape: 'rect',
            radius: 13,
          })}
        >
          <WhatsAppIcon size={17} />
          {labels.pcSend}
        </WhatsAppComposeLink>
      }
    />
  );
}
