import type { Locale } from '@/i18n/routing';
import {
  POINT_ID,
  POINT_KEYS,
  QUESTIONS,
  VERDICT_TITLE_ID,
  VERDICTS,
  type PointKey,
  type Verdict,
  type WizardProps,
} from './eligibility';

/** The call shape of the `sys` translator the page hands over (`getTranslations('sys')`). */
export type SysT = (key: string, values?: Record<string, string | number>) => string;

/** Resolves every string the wizard island shows or sends, on the server (W9: labels are
 *  props): package ids through `tf` (`makeTf`, D17), the design's id-less option words, the W2
 *  ratio point, the step pills and the prefill lines through `sys.wp.wizard.*`, the quota ratio
 *  from `rateConfig.quotaRatio` (D17). */
export function buildWizardProps(args: {
  locale: Locale;
  whatsappNumber: string;
  quotaRatio: number;
  tf: (id: string) => string;
  sys: SysT;
}): WizardProps {
  const { locale, whatsappNumber, quotaRatio, tf, sys } = args;
  const ratio = { ratio: quotaRatio };
  const questions = QUESTIONS.map((q) => ({
    key: q.key,
    question: tf(q.qId),
    options: q.options.map((o) => ({
      key: o.key,
      label: 'id' in o ? tf(o.id) : sys(`wp.wizard.options.${o.sys}`, o.ratio ? ratio : undefined),
    })),
  }));
  const titles = Object.fromEntries(VERDICTS.map((v) => [v, tf(VERDICT_TITLE_ID[v])])) as Record<
    Verdict,
    string
  >;
  const points = Object.fromEntries(
    POINT_KEYS.map((k) => {
      const id = POINT_ID[k];
      return [k, id ? tf(id) : sys('wp.wizard.points.ratio', ratio)];
    }),
  ) as Record<PointKey, string>;
  return {
    locale,
    whatsappNumber,
    questions,
    copy: {
      heading: tf('wp.038'),
      subtitle: tf('wp.039'),
      back: tf('wp.040'),
      whatsapp: tf('wp.041'),
      needWorkers: tf('wp.042'),
      seeHiring: tf('wp.043'),
      restart: tf('wp.044'),
      footer: tf('wp.045'),
      progressLabel: sys('wp.wizard.progressLabel'),
      progress: questions.map((_, i) =>
        sys('wp.wizard.progress', { current: i + 1, total: questions.length }),
      ),
      titles,
      points,
      prefillIntro: `${sys('whatsapp.prefill')}${sys('wp.wizard.prefill.intro')}`,
      prefillResult: Object.fromEntries(
        VERDICTS.map((v) => [v, sys('wp.wizard.prefill.result', { title: titles[v] })]),
      ) as Record<Verdict, string>,
    },
  };
}
