// Task 1's seeded rate row and the 12 + 3 role rows, verbatim from
// scripts/import-design-package.ts (RATE_CONFIG / ROLE_TABLE / presets). The cross-check in
// copy-deltas.test.ts proves the generated bundle still agrees with this copy.
import type { CalculatorRole, RateConfig } from '@/content/collections';

export const RATE: RateConfig = {
  version: '2026-01',
  effectiveFrom: '2026-01-01',
  reviewDueAt: '2026-12-20',
  updatedAt: '2026-01-15',
  currency: 'TRY',
  legalMinGross: 33030,
  sgkEmployerRate: 0.2175,
  sgkRates: { manufacturing: 0.1875, other: 0.2175, none: 0.2375 },
  supportMonthly: 1270,
  permitFeeTRY: 16000,
  flightTRY: 12000,
  housingMonthlyTRY: 5000,
  quotaRatio: 5,
};

type Industry = NonNullable<CalculatorRole['industry']>;
const INDUSTRY_LABEL: Record<Industry, string> = {
  factory: 'calc.551',
  construction: 'calc.554',
  hotel: 'calc.552',
  agriculture: 'calc.553',
};
const ROLE_TABLE: Array<[string, string, Industry, number, number, number]> = [
  ['welder', 'calc.555', 'factory', 45000, 70000, 1.5],
  ['cnc', 'hire.093', 'factory', 45000, 65000, 1.5],
  ['machine', 'calc.544', 'factory', 38000, 52000, 1],
  ['textile', 'calc.541', 'factory', 36000, 50000, 1],
  ['electrician', 'calc.545', 'construction', 45000, 62000, 1.5],
  ['plumber', 'calc.546', 'construction', 42000, 58000, 1.5],
  ['labourer', 'calc.542', 'construction', 33030, 44000, 1],
  ['cook', 'calc.548', 'hotel', 50000, 78000, 1.5],
  ['waiter', 'hire.107', 'hotel', 35000, 48000, 1],
  ['housekeeping', 'calc.547', 'hotel', 33030, 44000, 1],
  ['steward', 'calc.543', 'hotel', 33030, 45000, 1],
  ['greenhouse', 'hire.112', 'agriculture', 33030, 42000, 1],
];
const groupOf = (multiplier: number): CalculatorRole['group'] =>
  multiplier >= 2 ? 'specialist' : multiplier >= 1.5 ? 'skilled' : 'general';

export const ROLES: CalculatorRole[] = [
  ...ROLE_TABLE.map(([key, labelId, industry, salaryMin, salaryMax, multiplier]) => ({
    key,
    labelId,
    multiplier,
    group: groupOf(multiplier),
    preset: false,
    industry,
    industryLabelId: INDUSTRY_LABEL[industry],
    salaryMin,
    salaryMax,
  })),
  ...(
    [
      ['generalPreset', 'home.240', 1],
      ['skilledPreset', 'home.241', 1.5],
      ['specialistPreset', 'home.242', 2],
    ] as Array<[string, string, number]>
  ).map(([key, labelId, multiplier]) => ({
    key,
    labelId,
    multiplier,
    group: groupOf(multiplier),
    preset: true,
    industry: null,
    industryLabelId: null,
    salaryMin: null,
    salaryMax: null,
  })),
];

export function role(key: string): CalculatorRole {
  const found = ROLES.find((r) => r.key === key);
  if (!found) throw new Error(`fixture role "${key}" missing`);
  return found;
}
