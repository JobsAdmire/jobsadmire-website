import type { Locale } from '@/i18n/routing';
import { quotaCheck, salaryFloor, turkishStaffRequired, type RateConfig } from '@/lib/calculator';
import { formatInt, formatTRY } from '@/lib/format/money';
import { resolveRole, type DesignRole } from './card-view';
import { multiplierNumber, type PassCopy } from './copy';
import type { EstimateInputs } from './estimate-inputs';
import { joinText } from './fragments';
import type { PassLabels } from './ids';

export const PASS_CHECK_ROWS = ['capital', 'quota', 'sgk', 'salary', 'docs'] as const;
export type PassRow = (typeof PASS_CHECK_ROWS)[number];
export type ManualRow = Exclude<PassRow, 'quota'>;
export const MANUAL_ROWS: readonly ManualRow[] = ['capital', 'sgk', 'salary', 'docs'];
/** Structurally `TriStateValue`; kept local so this pure module imports no client module. */
export type Answer = 'yes' | 'no' | 'unsure';
export type Answers = Partial<Record<ManualRow, Answer>>;
export type Tone = 'idle' | 'progress' | 'green' | 'amber' | 'red';

/** The design's verdict (passCheck, lines 1899–1965): any "no" → red; else any "not sure" →
 *  amber; else all five answered → green; else more than one answered → progress; else idle.
 *  The quota row is answered from the calculator, so `answered` starts at 1. */
export function passCheckVerdict(answers: Answers, quotaOk: boolean) {
  const value = (row: PassRow): Answer | null =>
    row === 'quota' ? (quotaOk ? 'yes' : 'no') : (answers[row] ?? null);
  const rows = PASS_CHECK_ROWS.map((row) => ({ row, v: value(row) }));
  const answered = rows.filter((r) => r.v !== null).length;
  const blockers = rows.filter((r) => r.v === 'no').map((r) => r.row);
  const unsure = rows.filter((r) => r.v === 'unsure').map((r) => r.row);
  const clear = rows.filter((r) => r.v === 'yes').length;
  const tone: Tone = blockers.length
    ? 'red'
    : unsure.length
      ? 'amber'
      : answered === rows.length
        ? 'green'
        : answered > 1
          ? 'progress'
          : 'idle';
  return {
    tone,
    clear,
    answered,
    unanswered: rows.length - answered,
    blockers,
    unsure,
    progressPct: Math.round((clear / rows.length) * 100),
    values: Object.fromEntries(rows.map((r) => [r.row, r.v])) as Record<PassRow, Answer | null>,
  };
}

export type PassRowView = {
  key: PassRow;
  n: number;
  title: string;
  body: string;
  fix: string;
  value: Answer | null;
  mark: string;
};

export type PassView = {
  rows: PassRowView[];
  tone: Tone;
  kicker: string;
  title: string;
  body: string;
  count: string;
  progressPct: number;
  fixes: { key: PassRow; text: string; unsure: boolean }[];
  quotaOk: boolean;
  manualAnswered: boolean;
  whatsappText: string;
};

export function computePassView({
  answers,
  inputs,
  roles,
  rateConfig,
  locale,
  roleLabels,
  labels,
  copy,
}: {
  answers: Answers;
  inputs: EstimateInputs;
  roles: readonly DesignRole[];
  rateConfig: RateConfig;
  locale: Locale;
  roleLabels: Record<string, string>;
  labels: PassLabels;
  copy: PassCopy;
}): PassView {
  const role = resolveRole(roles, inputs.roleKey);
  const roleLabel = roleLabels[role.key] ?? role.key;
  const n = (v: number) => formatInt(v, locale);
  const ratio = rateConfig.quotaRatio;
  const quota = quotaCheck(inputs.turkishStaff, inputs.headcount, ratio);
  const need = turkishStaffRequired(inputs.headcount, ratio);
  // W144: the legal floor, never the (band-clamped) salary the estimate uses
  const amount = formatTRY(salaryFloor(role, rateConfig), locale);
  const text: Record<PassRow, { title: string; body: string; fix: string }> = {
    capital: { title: labels.ckCapT, body: labels.ckCapB, fix: labels.ckCapF },
    quota: {
      title: labels.ckQuoT,
      body: quota.allowed
        ? copy.quotaOk(n(inputs.turkishStaff), n(quota.maxForeign), n(inputs.headcount))
        : copy.quotaNo(n(inputs.headcount), n(need), n(inputs.turkishStaff)),
      fix: copy.quotaFix(n(need), n(inputs.headcount)),
    },
    sgk: { title: labels.ckSgkT, body: labels.ckSgkB, fix: labels.ckSgkF },
    salary: {
      title: labels.ckSalT,
      body: copy.salary(roleLabel, amount, multiplierNumber(role.multiplier, locale)),
      fix: copy.salaryFix(amount),
    },
    docs: { title: labels.ckDocT, body: labels.ckDocB, fix: labels.ckDocF },
  };
  const verdict = passCheckVerdict(answers, quota.allowed);
  const rows: PassRowView[] = PASS_CHECK_ROWS.map((key, i) => {
    const value = verdict.values[key];
    const mark =
      value === 'yes' ? '✓' : value === 'no' ? '!' : value === 'unsure' ? '?' : String(i + 1);
    return { key, n: i + 1, ...text[key], value, mark };
  });
  const tone = verdict.tone;
  const kicker =
    tone === 'idle' ? labels.vIdleK : tone === 'progress' ? labels.vProgK : labels.vRes;
  const title =
    tone === 'idle'
      ? labels.vIdleT
      : tone === 'progress'
        ? labels.vProgT
        : tone === 'green'
          ? labels.vGreenT
          : tone === 'amber'
            ? verdict.unsure.length === 1
              ? labels.vAmber1
              : copy.amberN(verdict.unsure.length)
            : verdict.blockers.length === 1
              ? labels.vRed1
              : copy.redN(verdict.blockers.length);
  const body = {
    idle: labels.vIdleB,
    progress: labels.vProgB,
    green: labels.vGreenB,
    amber: labels.vAmberB,
    red: labels.vRedB,
  }[tone];
  const fixes = [
    ...verdict.blockers.map((key) => ({ key, text: text[key].fix, unsure: false })),
    ...verdict.unsure.map((key) => ({
      key,
      text: joinText([labels.pcConfirm, text[key].fix]),
      unsure: true,
    })),
  ];
  const word = (v: Answer | null) =>
    v === 'yes'
      ? labels.pcYes
      : v === 'no'
        ? labels.pcNo
        : v === 'unsure'
          ? labels.pcMaybe
          : copy.unanswered();
  const summary = rows.map((r) => `${r.n}. ${r.title} — ${word(r.value)}`).join('\n');
  return {
    rows,
    tone,
    kicker,
    title,
    body,
    count: copy.count(verdict.clear, PASS_CHECK_ROWS.length, verdict.unanswered),
    progressPct: verdict.progressPct,
    fixes,
    quotaOk: quota.allowed,
    manualAnswered: MANUAL_ROWS.some((r) => answers[r] !== undefined),
    // W95: this text holds the visitor's answers — it only ever reaches a click-time window.open
    whatsappText: copy.whatsapp(roleLabel, inputs.headcount, n(inputs.turkishStaff), summary),
  };
}
