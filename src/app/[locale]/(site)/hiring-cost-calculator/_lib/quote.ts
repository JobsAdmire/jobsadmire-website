import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import {
  estimate,
  formatEstimate,
  sgkRateLabel,
  type CalculatorRole,
  type RateConfig,
  type SgkTier,
} from '@/lib/calculator';
import { designRoles, resolveRole } from './card-view';
import { makeCardCopy, type SysT } from './copy';
import { ESTIMATE_FIELDS, parseEstimateFields, type EstimateInputs } from './estimate-inputs';

const hidden = z.string().max(40).optional();
/** ≥ 8 digits — the door's phone rule, checked here so a short number is a field error, not a 400. */
const PHONE = /(?:\D*\d){8}/;

/** The quote form. `.min(1)` before `.email()` so an empty e-mail reads `required` (kernel rule);
 *  the kernel trims every string before this parses; the `est_*` hidden inputs ride along and
 *  are turned into catalog fields only by `toCalculatorFields`. */
export const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().min(1).max(254).email(),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === '' || PHONE.test(v), { message: 'phone' })
    .optional(),
  company: z.string().trim().max(200).optional(),
  country: z
    .string()
    .trim()
    .refine((v) => v === '' || /^[A-Za-z]{2}$/.test(v), { message: 'invalid' })
    .optional(),
  message: z.string().trim().max(5000).optional(),
  [ESTIMATE_FIELDS.role]: hidden,
  [ESTIMATE_FIELDS.headcount]: hidden,
  [ESTIMATE_FIELDS.months]: hidden,
  [ESTIMATE_FIELDS.salary]: hidden,
  [ESTIMATE_FIELDS.tier]: hidden,
  [ESTIMATE_FIELDS.flight]: hidden,
  [ESTIMATE_FIELDS.housing]: hidden,
  [ESTIMATE_FIELDS.support]: hidden,
  [ESTIMATE_FIELDS.turkishStaff]: hidden,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

/** The Operations catalog's `calculator` field names (v1.0) — the only keys this form sends. */
export const CALCULATOR_FIELD_NAMES = [
  'name',
  'email',
  'phone',
  'company',
  'country',
  'headcount',
  'trade',
  'durationMonths',
  'estimateSummary',
  'message',
] as const;
export type CalculatorField = (typeof CALCULATOR_FIELD_NAMES)[number];
export const ESTIMATE_SUMMARY_MAX = 2000;

export type QuoteContext = {
  locale: Locale;
  roles: readonly CalculatorRole[];
  rateConfig: RateConfig;
  /** `makeTf(bundle, locale)` */
  t: (id: string) => string;
  /** the request locale's `sys` translator */
  sys: SysT;
};

const TIER_LABEL_ID: Record<SgkTier, string> = {
  manufacturing: 'calc.466',
  other: 'calc.467',
  none: 'calc.468',
};

/** The estimate as the inbox reader sees it — recomputed HERE from the posted inputs through
 *  the one engine (a client total is never forwarded as fact), labelled in the request locale
 *  with the package's own labels, the role key beside its label (W77). `null` without roles. */
export function buildEstimateSummary(inputs: EstimateInputs, ctx: QuoteContext) {
  const roles = designRoles(ctx.roles);
  if (roles.length === 0) return null;
  const { locale, rateConfig, t, sys } = ctx;
  const role = resolveRole(roles, inputs.roleKey);
  const est = estimate(
    {
      role,
      headcount: inputs.headcount,
      months: inputs.months,
      grossSalary: inputs.grossSalary,
      sgkTier: inputs.sgkTier,
      flight: inputs.flight,
      housing: inputs.housing,
      supportOptIn: inputs.supportOptIn,
    },
    rateConfig,
  );
  const f = formatEstimate(est, locale);
  const copy = makeCardCopy(sys);
  const months = inputs.months;
  const tier = est.input.sgkTier;
  const covered =
    [
      inputs.flight && t('calc.017'),
      inputs.housing && t('calc.018'),
      inputs.supportOptIn && t('calc.020'),
    ]
      .filter(Boolean)
      .join(' · ') || sys('calc.summary.none');
  const lines = [
    `${t('calc.012')}: ${t(role.labelId)} (${role.key})`,
    `${t('calc.013')}: ${est.input.headcount}`,
    `${t('calc.014')}: ${months === 12 ? t('calc.470') : copy.nMonths(months)}`,
    `${t('calc.015')}: ${f.grossSalary} ${t('calc.464')}`,
    `${t('calc.022')}: ${t(TIER_LABEL_ID[tier])} (${sgkRateLabel(rateConfig, tier, locale)})`,
    `${t('calc.016')}: ${covered}`,
    `${t('calc.142')}: ${inputs.turkishStaff}`,
    `${t('calc.028')}: ${f.monthly.total}`,
    `${t('calc.034')}: ${f.oneOff.total}`,
    `${months === 12 ? t('calc.469') : copy.seasonTotal(months)}: ${f.contract.total} (${f.contract.perWorkerPerMonth} ${t('calc.463')} ${t('calc.464')})`,
    `${sys('calc.summary.rates')}: ${rateConfig.version}`,
  ];
  return {
    summary: lines.join('\n').slice(0, ESTIMATE_SUMMARY_MAX),
    role,
    months,
    headcount: est.input.headcount,
  };
}

/** Exact catalog names and stable values (W3/W77): ISO-2 upper-case, `trade` = the role KEY,
 *  integers as strings. Empty strings are dropped by `buildEnvelope`, never sent. */
export function toCalculatorFields(
  p: QuoteInput,
  ctx: QuoteContext,
): Record<CalculatorField, string> {
  const est = buildEstimateSummary(parseEstimateFields(p as Record<string, unknown>), ctx);
  return {
    name: p.name,
    email: p.email,
    phone: p.phone ?? '',
    company: p.company ?? '',
    country: (p.country ?? '').toUpperCase(),
    headcount: est ? String(est.headcount) : '',
    trade: est ? est.role.key : '',
    durationMonths: est ? String(est.months) : '',
    estimateSummary: est ? est.summary : '',
    message: p.message ?? '',
  };
}
