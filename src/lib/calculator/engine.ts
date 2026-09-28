// The one calculator model (W2/W24): pure, unrounded, every figure from the arguments.
// Design parity notes: the page script (Hiring Cost Calculator.dc.html 2582–2606) is the
// reference for the SHAPE of the model; its `Math.ceil(mult × MINWAGE / 500) × 500` legal
// floor is deliberately not ported (W2 — the exact 1.5× floor is 49 545, the figure calc.557
// itself prints). Support is opt-in and off by default on both pages (W2).
import {
  CalculatorError,
  LIMITS,
  SGK_TIERS,
  type CalculatorRole,
  type Estimate,
  type EstimateInput,
  type MonthlyLines,
  type OneOffLines,
  type RateConfig,
  type SgkTier,
} from './types';

const clampInt = (value: number | undefined, min: number, max: number, fallback: number) => {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
};

/** Legal salary floor for a role: `legalMinGross × multiplier`, exact (W2 — never rounded up). */
export function salaryFloor(role: CalculatorRole, rateConfig: RateConfig): number {
  return rateConfig.legalMinGross * role.multiplier;
}

/** Slider bounds: the band's minimum lifted to the legal floor; presets (no band) are open-ended. */
export function salaryRange(
  role: CalculatorRole,
  rateConfig: RateConfig,
): { min: number; max: number | null } {
  const floor = salaryFloor(role, rateConfig);
  const min = Math.max(floor, role.salaryMin ?? floor);
  const max = role.salaryMax === null ? null : Math.max(role.salaryMax, min);
  return { min, max };
}

/** Employer SGK share for a tier, read from `rateConfig.sgkRates`. */
export function sgkRate(rateConfig: RateConfig, tier: SgkTier): number {
  if (!(SGK_TIERS as readonly string[]).includes(tier)) {
    throw new CalculatorError(`unknown SGK tier "${String(tier)}"`);
  }
  return rateConfig.sgkRates[tier];
}

/** gross × (1 + SGK rate) — calc.079's employer cost at the minimum wage; the salary-guide cards. */
export function employerMonthlyCost(
  gross: number,
  rateConfig: RateConfig,
  tier: SgkTier = 'other',
): number {
  return gross * (1 + sgkRate(rateConfig, tier));
}

const clampSalary = (
  value: number | null | undefined,
  range: { min: number; max: number | null },
): number => {
  if (value === null || value === undefined || !Number.isFinite(value)) return range.min;
  const atLeastMin = Math.max(range.min, value);
  return range.max === null ? atLeastMin : Math.min(range.max, atLeastMin);
};

const monthlyLines = (
  gross: number,
  sgk: number,
  housing: number,
  support: number,
): MonthlyLines => ({ gross, sgk, housing, support, total: gross + sgk + housing - support });

const oneOffLines = (permitFee: number, flight: number): OneOffLines => ({
  permitFee,
  flight,
  total: permitFee + flight,
});

export function estimate(input: EstimateInput, rateConfig: RateConfig): Estimate {
  const { role } = input;
  const headcount = clampInt(
    input.headcount,
    LIMITS.headcountMin,
    LIMITS.headcountMax,
    LIMITS.headcountMin,
  );
  const months = clampInt(input.months, LIMITS.monthsMin, LIMITS.monthsMax, LIMITS.monthsMax);
  const sgkTier: SgkTier = input.sgkTier ?? 'other';
  const rate = sgkRate(rateConfig, sgkTier);
  const grossSalary = clampSalary(input.grossSalary, salaryRange(role, rateConfig));
  const flight = input.flight ?? true;
  const housing = input.housing ?? false;
  const supportOptIn = input.supportOptIn ?? false;

  const perMonthly = monthlyLines(
    grossSalary,
    grossSalary * rate,
    housing ? rateConfig.housingMonthlyTRY : 0,
    supportOptIn ? rateConfig.supportMonthly : 0,
  );
  const perOneOff = oneOffLines(rateConfig.permitFeeTRY, flight ? rateConfig.flightTRY : 0);
  const monthly = monthlyLines(
    perMonthly.gross * headcount,
    perMonthly.sgk * headcount,
    perMonthly.housing * headcount,
    perMonthly.support * headcount,
  );
  const oneOff = oneOffLines(perOneOff.permitFee * headcount, perOneOff.flight * headcount);
  const payroll = monthly.total * months;
  const total = payroll + oneOff.total;
  const base = perMonthly.gross + perMonthly.sgk;

  return {
    input: {
      role,
      headcount,
      months,
      grossSalary,
      sgkTier,
      sgkRate: rate,
      flight,
      housing,
      supportOptIn,
    },
    perWorker: { monthly: perMonthly, oneOff: perOneOff },
    monthly,
    oneOff,
    contract: {
      months,
      payroll,
      oneOff: oneOff.total,
      total,
      perWorkerPerMonth: total / months / headcount,
    },
    firstYearTotal: total,
    shares: { salaryPct: (perMonthly.gross / base) * 100, sgkPct: (perMonthly.sgk / base) * 100 },
  };
}

/** The homepage teaser's chips: the `preset: true` rows, ascending multiplier (1, 1.5, 2). */
export function presets(roles: CalculatorRole[]): CalculatorRole[] {
  return roles.filter((r) => r.preset).sort((a, b) => a.multiplier - b.multiplier);
}

export function findRole(roles: CalculatorRole[], key: string): CalculatorRole | undefined {
  return roles.find((r) => r.key === key);
}
