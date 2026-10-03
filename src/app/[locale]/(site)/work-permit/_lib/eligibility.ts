import type { Locale } from '@/i18n/routing';

/**
 * The eligibility wizard's rules — the design's `eligResult()` with option INDICES replaced by
 * stable option keys, so a translated or reordered option list can never flip a verdict.
 * Pure (one type-only import), so the client island runs it in the browser and the tests in
 * Node. Nothing here is sent anywhere — the card promises "nothing is stored" (wp.045): the
 * island pushes only the verdict bucket (W26/W67) and opens WhatsApp with a message it composes
 * when the visitor clicks (W76/W95).
 */
export const QUESTION_KEYS = ['company', 'staff', 'location', 'debts'] as const;
export type QuestionKey = (typeof QUESTION_KEYS)[number];

/** Where an option's label comes from: a package id, or a `sys.wp.wizard.options.*` key for the
 *  design's script-only words ("Yes", "5 or more", …); `ratio` = the label takes the quota ratio
 *  from `rateConfig.quotaRatio` (D17). */
export type OptionSource = { key: string; id: string } | { key: string; sys: string; ratio?: true };

export const QUESTIONS: readonly {
  key: QuestionKey;
  qId: string;
  options: readonly OptionSource[];
}[] = [
  {
    key: 'company',
    qId: 'wp.075',
    options: [
      { key: 'yes', sys: 'yes' },
      { key: 'no', id: 'wp.081' },
    ],
  },
  {
    key: 'staff',
    qId: 'wp.076',
    options: [
      { key: 'atLeast', sys: 'atLeast', ratio: true },
      { key: 'below', sys: 'below', ratio: true },
    ],
  },
  {
    key: 'location',
    qId: 'wp.077',
    options: [
      { key: 'abroad', sys: 'abroad' },
      { key: 'resident', id: 'wp.078' },
      { key: 'noPermit', id: 'wp.079' },
    ],
  },
  {
    key: 'debts',
    qId: 'wp.080',
    options: [
      { key: 'no', sys: 'no' },
      { key: 'yes', id: 'wp.082' },
    ],
  },
];

export type Answers = Record<QuestionKey, string>;
export type PartialAnswers = Partial<Answers>;

/** W26/W67: the three buckets `eligibility_check_complete.result` accepts. */
export type Verdict = 'eligible' | 'conditional' | 'ineligible';
export const VERDICTS: readonly Verdict[] = ['eligible', 'conditional', 'ineligible'];
/** eligible "You look eligible" · conditional "Likely eligible, with planning" · ineligible
 *  "Fixable — but not yet". */
export const VERDICT_TITLE_ID: Record<Verdict, string> = {
  eligible: 'wp.074',
  conditional: 'wp.073',
  ineligible: 'wp.072',
};

export const POINT_KEYS = [
  'company',
  'ratio',
  'locationAbroad',
  'locationResident',
  'locationNoPermit',
  'debts',
  'thresholds',
] as const;
export type PointKey = (typeof POINT_KEYS)[number];
/** The package id per result point. `ratio` is `null` — W2: the wizard makes no claim about
 *  WHEN the ratio is checked, so `wp.066` ("only checked from the 7th month …") is never read
 *  here; its copy is `sys.wp.wizard.points.ratio`. */
export const POINT_ID: Record<PointKey, string | null> = {
  company: 'wp.065',
  ratio: null,
  locationAbroad: 'wp.067',
  locationResident: 'wp.068',
  locationNoPermit: 'wp.069',
  debts: 'wp.070',
  thresholds: 'wp.071',
};

export function evaluate(a: Answers): { verdict: Verdict; points: PointKey[] } {
  const points: PointKey[] = [];
  if (a.company === 'no') points.push('company');
  if (a.staff === 'below') points.push('ratio');
  if (a.location === 'abroad') points.push('locationAbroad');
  if (a.location === 'resident') points.push('locationResident');
  if (a.location === 'noPermit') points.push('locationNoPermit');
  if (a.debts === 'yes') points.push('debts');
  if (a.company === 'yes' && a.debts === 'no') points.push('thresholds');
  if (a.company === 'no' || a.debts === 'yes') return { verdict: 'ineligible', points };
  if (a.staff === 'below') return { verdict: 'conditional', points };
  return { verdict: 'eligible', points };
}

export function isComplete(a: PartialAnswers): a is Answers {
  return QUESTION_KEYS.every((k) => a[k] !== undefined);
}

/** Resolved on the server and handed to the island as props: the island reads no `sys.*`, so
 *  `CLIENT_SYS` stays unchanged (W148). */
export type WizardOption = { key: string; label: string };
export type WizardQuestion = { key: QuestionKey; question: string; options: WizardOption[] };
export type WizardCopy = {
  heading: string;
  subtitle: string;
  back: string;
  whatsapp: string;
  needWorkers: string;
  seeHiring: string;
  restart: string;
  footer: string;
  progressLabel: string;
  /** "1 / 4" … "4 / 4" — the step pill, one entry per question. */
  progress: string[];
  titles: Record<Verdict, string>;
  points: Record<PointKey, string>;
  /** `sys.whatsapp.prefill` + `sys.wp.wizard.prefill.intro` (the visitor's own voice). */
  prefillIntro: string;
  /** `sys.wp.wizard.prefill.result` filled with each verdict's title. */
  prefillResult: Record<Verdict, string>;
};
export type WizardProps = {
  locale: Locale;
  whatsappNumber: string;
  questions: WizardQuestion[];
  copy: WizardCopy;
};

/** The WhatsApp message the result button opens — composed when the visitor clicks (W76/W95),
 *  never placed in a DOM href: the intro, one line per answer, the verdict line. */
export function prefillText(
  intro: string,
  questions: readonly WizardQuestion[],
  answers: Answers,
  resultLine: string,
): string {
  const lines = questions.map((q) => {
    const answer = q.options.find((o) => o.key === answers[q.key])?.label ?? answers[q.key];
    return `• ${q.question} ${answer}`;
  });
  return [intro, ...lines, resultLine].join('\n');
}
