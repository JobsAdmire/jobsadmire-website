// By module path, not the engine barrel: this module is on the page's EAGER client path (the
// store behind `LiveSgkRate`), and `types.ts` carries only the constants — engine.ts, labels.ts and
// money.ts stay in the lazy islands' chunk (W13 amended).
import { LIMITS, SGK_TIERS, type SgkTier } from '@/lib/calculator/types';

/** The hidden inputs the quote form posts (the store's state); prefixed `est_` so no name can be
 *  mistaken for a catalog field — only `_lib/quote.ts` turns them into the ten catalog names. */
export const ESTIMATE_FIELDS = {
  role: 'est_role',
  headcount: 'est_headcount',
  months: 'est_months',
  salary: 'est_salary',
  tier: 'est_tier',
  flight: 'est_flight',
  housing: 'est_housing',
  support: 'est_support',
  turkishStaff: 'est_turkishStaff',
} as const;

export const MONTH_OPTIONS = [6, 9, 12] as const;
export type Months = (typeof MONTH_OPTIONS)[number];
export const HEADCOUNT_PRESETS = [5, 10, 25, 50] as const;
export const TURKISH_STAFF = { default: 25, step: 5, max: 5000 } as const;
export const DEFAULT_ROLE_KEY = 'welder';

export type EstimateInputs = {
  roleKey: string;
  headcount: number;
  months: Months;
  grossSalary: number | null;
  sgkTier: SgkTier;
  flight: boolean;
  housing: boolean;
  supportOptIn: boolean;
  turkishStaff: number;
};

/** The design's first paint (line 1728): welder × 1, full year, other tier, flight on,
 *  accommodation off, minimum-wage support OFF (W2/W58), 25 Turkish staff. */
export const DEFAULT_INPUTS: EstimateInputs = {
  roleKey: DEFAULT_ROLE_KEY,
  headcount: 1,
  months: 12,
  grossSalary: null,
  sgkTier: 'other',
  flight: true,
  housing: false,
  supportOptIn: false,
  turkishStaff: TURKISH_STAFF.default,
};

const int = (v: unknown, fallback: number, min: number, max: number) => {
  const n = typeof v === 'number' ? v : Number.parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};
const bool = (v: unknown, fallback: boolean) =>
  v === '1' || v === true ? true : v === '0' || v === false ? false : fallback;

/** Anything (a store patch, posted hidden inputs) → valid inputs within the design's bounds. The
 *  tier is validated HERE: `estimate` throws `CalculatorError` on an unknown tier (W144). */
export function sanitizeInputs(
  raw: Partial<Record<keyof EstimateInputs, unknown>>,
): EstimateInputs {
  const months = int(raw.months, 12, 1, 12);
  const salary =
    raw.grossSalary === null || raw.grossSalary === undefined || raw.grossSalary === ''
      ? null
      : int(raw.grossSalary, 0, 0, 10_000_000);
  return {
    roleKey:
      typeof raw.roleKey === 'string' && raw.roleKey !== ''
        ? raw.roleKey.slice(0, 40)
        : DEFAULT_ROLE_KEY,
    headcount: int(raw.headcount, LIMITS.headcountMin, LIMITS.headcountMin, LIMITS.headcountMax),
    months: (MONTH_OPTIONS as readonly number[]).includes(months) ? (months as Months) : 12,
    grossSalary: salary === 0 ? null : salary,
    sgkTier: (SGK_TIERS as readonly string[]).includes(String(raw.sgkTier))
      ? (raw.sgkTier as SgkTier)
      : 'other',
    flight: bool(raw.flight, true),
    housing: bool(raw.housing, false),
    supportOptIn: bool(raw.supportOptIn, false),
    turkishStaff: int(raw.turkishStaff, TURKISH_STAFF.default, 0, TURKISH_STAFF.max),
  };
}

/** The store's state as `[name, value]` pairs — the hidden inputs `EstimateFields` renders. */
export function estimateFieldValues(i: EstimateInputs): [string, string][] {
  return [
    [ESTIMATE_FIELDS.role, i.roleKey],
    [ESTIMATE_FIELDS.headcount, String(i.headcount)],
    [ESTIMATE_FIELDS.months, String(i.months)],
    [ESTIMATE_FIELDS.salary, i.grossSalary === null ? '' : String(i.grossSalary)],
    [ESTIMATE_FIELDS.tier, i.sgkTier],
    [ESTIMATE_FIELDS.flight, i.flight ? '1' : '0'],
    [ESTIMATE_FIELDS.housing, i.housing ? '1' : '0'],
    [ESTIMATE_FIELDS.support, i.supportOptIn ? '1' : '0'],
    [ESTIMATE_FIELDS.turkishStaff, String(i.turkishStaff)],
  ];
}

/** Posted hidden inputs → inputs (the server action's side; never trusts the client). */
export function parseEstimateFields(data: Record<string, unknown>): EstimateInputs {
  return sanitizeInputs({
    roleKey: data[ESTIMATE_FIELDS.role],
    headcount: data[ESTIMATE_FIELDS.headcount],
    months: data[ESTIMATE_FIELDS.months],
    grossSalary: data[ESTIMATE_FIELDS.salary],
    sgkTier: data[ESTIMATE_FIELDS.tier],
    flight: data[ESTIMATE_FIELDS.flight],
    housing: data[ESTIMATE_FIELDS.housing],
    supportOptIn: data[ESTIMATE_FIELDS.support],
    turkishStaff: data[ESTIMATE_FIELDS.turkishStaff],
  });
}
