### Task 9: Calculator engine (W2/W24 — one pure engine for the homepage teaser and the Cost Calculator page)

`src/lib/calculator/` is the single model behind every computed lira figure on the site: pure TypeScript (no React, no `server-only`, no `fs`), no rate literal anywhere — every number derives from the `RateConfig` row (`getRateConfig(bundle)`) and the role rows (`getCollection(bundle, 'calculatorRoles')`) that Task 1 emits, both passed in as arguments. Rulings applied: **W2** (`legalMinGross × multiplier` EXACT — the design's `Math.ceil(mult × MINWAGE / 500) × 500` rounding is NOT ported; support is opt-in, default OFF; the homepage's three presets come from the same table; D18 formatting only at the edge), **W24** (this task's shape: `estimate`, `salaryFloor`, `quotaCheck`, `effectiveFromLabel`, `isReviewDue`, presets, the `COPY_DELTAS` table), **D17** (dated labels from `effectiveFrom`; the badge hides from `reviewDueAt`), **W45** (doc edits sentence-anchored, building on Task 1's appended sentence). Runs after Task 7 in the serial order but consumes only Task 1 (`src/content/collections.ts` and the generated `src/content/local/bundle.tr.json`). Task 5's `date.ts` may not exist — the month/day labels are implemented locally here.

The engine is deliberately unrounded: `formatTRY` rounds once, at the edge (`labels.ts`), so `38 944.025` renders as `38.944 ₺` / `₺38,944` and a per-worker figure multiplied by a headcount never accumulates a rounding drift. Where the design's shown number differs from this model (the 1.5× slider minimum, the teaser's auto-applied support, the page's initial totals), the tests assert the MODEL and list the difference in `COPY_DELTAS` (`src/lib/calculator/__tests__/copy-deltas.test.ts`) so the Homepage (T1) and Cost Calculator (T4) page tasks author their `sys.*` templates from it instead of from the design's samples.

**Files:**

- Create: `src/lib/calculator/types.ts`, `src/lib/calculator/engine.ts`, `src/lib/calculator/quota.ts`, `src/lib/calculator/labels.ts`, `src/lib/calculator/index.ts`
- Test (create): `src/lib/calculator/__tests__/fixtures.ts` (Task 1's `RATE_CONFIG` row and 15-row role table, verbatim), `src/lib/calculator/__tests__/engine.test.ts`, `src/lib/calculator/__tests__/quota.test.ts`, `src/lib/calculator/__tests__/labels.test.ts`, `src/lib/calculator/__tests__/copy-deltas.test.ts` (the `COPY_DELTAS` table + the generated-bundle cross-check)
- Modify: `docs/ARCHITECTURE.md` § Calculator engine (the paragraph as left by Task 1 — rewritten to the as-built API, sentence-anchored, see **Docs in this task**)
- Not touched: `contract/**`, `src/content/**`, `src/lib/format/money.ts`, `src/messages/*.json` (no `sys.*` copy is authored here — the page tasks own `sys.home.*` / `sys.calc.*`), `src/analytics/track.ts` (`calculator_use` already exists), `package.json`

**Interfaces:**

Consumes (Task 1, used as they are — copied exactly from its Produces block; the runtime types are the Zod inferences, i.e. `string`/`number`, and the literal values in Task 1's comment are the seeded row):

- `src/content/collections.ts`: `export type RateConfig = { version: '2026-01'; effectiveFrom: '2026-01-01'; reviewDueAt: '2026-12-20'; updatedAt: string; currency: 'TRY'; legalMinGross: 33030; sgkEmployerRate: 0.2175; sgkRates: { manufacturing: number; other: number; none: number }; supportMonthly: 1270; permitFeeTRY: 16000; flightTRY: 12000; housingMonthlyTRY: number; quotaRatio: number }` (seeded: `sgkRates { manufacturing: 0.1875, other: 0.2175, none: 0.2375 }`, `housingMonthlyTRY: 5000`, `quotaRatio: 5`, `updatedAt: '2026-01-15'`).
- `src/content/collections.ts`: `export type CalculatorRole = { key: string; labelId: string; multiplier: number; group: 'general' | 'skilled' | 'specialist'; preset: boolean; industry: 'factory' | 'construction' | 'hotel' | 'agriculture' | null; industryLabelId: string | null; salaryMin: number | null; salaryMax: number | null }` — 12 roles (`preset: false`) + 3 homepage presets (`preset: true`, multipliers 1 / 1.5 / 2, labelIds `home.240`–`242`).
- `src/content/collections.ts`: `export function getRateConfig(bundle: Bundle): RateConfig` (throws `CollectionError` in every env when absent) and `export function getCollection<K extends CollectionKey>(bundle: Bundle, key: K): z.infer<(typeof CollectionSchemas)[K]>[]` with `K = 'calculatorRoles'`.
- `src/lib/format/money.ts`: `formatTRY(amount: number, locale: Locale): string` (TR `38.944 ₺`, EN `₺38,944`, rounds to whole lira), `formatPercent(value: number, locale: Locale, decimals = 2): string` (takes PERCENT units: `21.75` → TR `%21,75` / EN `21.75%`).
- `src/i18n/routing.ts`: `type Locale` (`'tr' | 'en'`; type-only import).
- `contract/website-bundle.v1.ts`: `BundleSchema` (the cross-check test only).

Produces (frozen for WP2b's T1 Homepage teaser, T4 Cost Calculator, T3 Hire Workers' cost pointer):

```ts
// src/lib/calculator/types.ts — pure types + the one error class; no rate literal
export type { CalculatorRole, RateConfig } from '@/content/collections';
export class CalculatorError extends Error {}
export const SGK_TIERS = ['manufacturing', 'other', 'none'] as const; // keys of rateConfig.sgkRates (calc.022 chips)
export type SgkTier = (typeof SGK_TIERS)[number];
export const LIMITS = { headcountMin: 1, headcountMax: 500, monthsMin: 1, monthsMax: 12 } as const; // UI bounds from the design, not rates
export type EstimateInput = {
  role: CalculatorRole;
  headcount: number;
  months?: number /* default 12 */;
  grossSalary?: number | null /* null → salaryRange(role).min; clamped to the range */;
  sgkTier?: SgkTier /* default 'other' */;
  flight?: boolean /* default true */;
  housing?: boolean /* default false */;
  supportOptIn?: boolean; /* default false — W2 */
};
export type MonthlyLines = {
  gross: number;
  sgk: number;
  housing: number;
  support: number;
  total: number;
}; // total = gross + sgk + housing − support (support is a positive deduction)
export type OneOffLines = { permitFee: number; flight: number; total: number }; // total = permitFee + flight
export type ResolvedInput = {
  role: CalculatorRole;
  headcount: number;
  months: number;
  grossSalary: number;
  sgkTier: SgkTier;
  sgkRate: number;
  flight: boolean;
  housing: boolean;
  supportOptIn: boolean;
}; // after clamping/defaults — what the UI should reflect
export type Estimate = {
  input: ResolvedInput;
  perWorker: { monthly: MonthlyLines; oneOff: OneOffLines };
  monthly: MonthlyLines /* × headcount */;
  oneOff: OneOffLines /* × headcount */;
  contract: {
    months: number;
    payroll: number;
    oneOff: number;
    total: number;
    perWorkerPerMonth: number;
  };
  firstYearTotal: number /* = contract.total: "First-year total" at 12 months, "N-month season total" otherwise */;
  shares: {
    salaryPct: number;
    sgkPct: number;
  }; /* percent units, unrounded, of gross + sgk — the teaser bars home.084/085 */
};

// src/lib/calculator/engine.ts — unrounded numbers; nothing formatted here
export function salaryFloor(role: CalculatorRole, rateConfig: RateConfig): number; // legalMinGross × multiplier, EXACT (W2): 1.5× → 49545, never 50000
export function salaryRange(
  role: CalculatorRole,
  rateConfig: RateConfig,
): { min: number; max: number | null }; // min = max(floor, role.salaryMin ?? floor); max = max(role.salaryMax, min) or null (presets)
export function sgkRate(rateConfig: RateConfig, tier: SgkTier): number; // rateConfig.sgkRates[tier]; CalculatorError on an unknown tier
export function employerMonthlyCost(gross: number, rateConfig: RateConfig, tier?: SgkTier): number; // gross × (1 + sgkRate) — calc.079's ₺40,214 at the minimum wage; the salary-guide cards
export function estimate(input: EstimateInput, rateConfig: RateConfig): Estimate; // the one model (see Estimate); inputs clamped to LIMITS / the salary range, never thrown
export function presets(roles: CalculatorRole[]): CalculatorRole[]; // preset: true rows, ascending multiplier (1, 1.5, 2) — the homepage teaser chips
export function findRole(roles: CalculatorRole[], key: string): CalculatorRole | undefined;

// src/lib/calculator/quota.ts — the 5:1 rule (ratio from rateConfig.quotaRatio, never a literal)
export type QuotaCheck = {
  allowed: boolean;
  maxForeign: number;
  shortfall: number;
  overBy: number;
};
export function quotaCheck(
  turkishStaff: number,
  foreignRequested: number,
  quotaRatio: number,
): QuotaCheck; // maxForeign = floor(staff ÷ ratio); allowed = requested ≤ maxForeign; shortfall = Turkish employees still needed (max(0, requested × ratio − staff)); overBy = max(0, requested − maxForeign); counts sanitised to non-negative integers; CalculatorError when ratio is not a positive integer
export function turkishStaffRequired(foreignRequested: number, quotaRatio: number): number; // requested × ratio (calc.043–045 hint)
export const QUOTA_VIZ_CAP = 8;
export type QuotaBlocks = {
  full: number;
  remainder: number;
  shown: number;
  capped: boolean;
  nextUnlockIn: number;
};
export function quotaBlocks(turkishStaff: number, quotaRatio: number, cap?: number): QuotaBlocks; // the block visualisation (calc.144–147, qvExact/None/Part/Cap): full = floor(staff ÷ ratio), remainder = staff mod ratio, shown = min(full, cap), capped = full > cap, nextUnlockIn = ratio − remainder (ratio when remainder is 0)

// src/lib/calculator/labels.ts — the ONLY formatting edge (formatTRY / formatPercent / Intl dates)
export function effectiveFromLabel(rateConfig: RateConfig, locale: Locale): string; // 'Ocak 2026' / 'January 2026' (month + year, UTC)
export function updatedAtLabel(rateConfig: RateConfig, locale: Locale): string; // '15 Ocak 2026' / '15 January 2026' (tr-TR / en-GB dates — the design's calc.089 pill)
export function effectiveYear(rateConfig: RateConfig): number; // 2026 — the "{year} rates" badges (calc.003, home.068/079)
export function isReviewDue(rateConfig: RateConfig, now?: Date): boolean; // now ≥ reviewDueAt at 00:00 UTC → the dated badge hides (D17)
export function sgkRateLabel(rateConfig: RateConfig, tier: SgkTier, locale: Locale): string; // formatPercent(rate × 100): '%21,75' / '18.75%'
export function multiplierLabel(multiplier: number, locale: Locale): string; // '1,5×' / '1.5×' / '2×'
export type FormattedLines<T> = { [K in keyof T]: string };
export type FormattedEstimate = {
  grossSalary: string;
  perWorker: { monthly: FormattedLines<MonthlyLines>; oneOff: FormattedLines<OneOffLines> };
  monthly: FormattedLines<MonthlyLines>;
  oneOff: FormattedLines<OneOffLines>;
  contract: { payroll: string; oneOff: string; total: string; perWorkerPerMonth: string };
  shares: { salaryPct: string; sgkPct: string };
};
export function formatEstimate(estimate: Estimate, locale: Locale): FormattedEstimate; // every lira line through formatTRY, shares through formatPercent(·, locale, 0)

// src/lib/calculator/index.ts — the barrel pages import from ('@/lib/calculator'); re-exports everything above
```

---

- [ ] **Step 1 (cycle 1 — types + engine): Write the failing test** — create `src/lib/calculator/__tests__/fixtures.ts` (Task 1's seeded row and role table, copied verbatim from `scripts/import-design-package.ts` so every worked figure below is computed over the real data shape) and `src/lib/calculator/__tests__/engine.test.ts`:

`src/lib/calculator/__tests__/fixtures.ts`:

```ts
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
```

`src/lib/calculator/__tests__/engine.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  employerMonthlyCost,
  estimate,
  findRole,
  presets,
  salaryFloor,
  salaryRange,
  sgkRate,
} from '../engine';
import { CalculatorError, LIMITS, SGK_TIERS, type SgkTier } from '../types';
import { RATE, ROLES, role } from './fixtures';

describe('salaryFloor (W2: legalMinGross × multiplier, exact)', () => {
  it('is 49545 for a 1.5× role — never rounded up to the design’s 50000', () => {
    expect(salaryFloor(role('welder'), RATE)).toBe(49545);
    expect(salaryFloor(role('cook'), RATE)).toBe(49545);
  });
  it('is the minimum wage for 1× and double it for the specialist preset', () => {
    expect(salaryFloor(role('machine'), RATE)).toBe(33030);
    expect(salaryFloor(role('specialistPreset'), RATE)).toBe(66060);
  });
  it('holds no rate literal: a different legalMinGross moves the floor', () => {
    expect(salaryFloor(role('welder'), { ...RATE, legalMinGross: 40000 })).toBe(60000);
  });
});

describe('salaryRange (the slider bounds)', () => {
  it('lifts the minimum to the legal floor when the band starts below it', () => {
    expect(salaryRange(role('welder'), RATE)).toEqual({ min: 49545, max: 70000 });
    expect(salaryRange(role('plumber'), RATE)).toEqual({ min: 49545, max: 58000 });
  });
  it('keeps the band’s own minimum when it is above the floor', () => {
    expect(salaryRange(role('cook'), RATE)).toEqual({ min: 50000, max: 78000 });
    expect(salaryRange(role('machine'), RATE)).toEqual({ min: 38000, max: 52000 });
  });
  it('is the floor itself at the minimum wage', () => {
    expect(salaryRange(role('greenhouse'), RATE)).toEqual({ min: 33030, max: 42000 });
  });
  it('presets have no band: min = floor, max = null', () => {
    expect(salaryRange(role('generalPreset'), RATE)).toEqual({ min: 33030, max: null });
    expect(salaryRange(role('skilledPreset'), RATE)).toEqual({ min: 49545, max: null });
  });
  it('never returns max < min', () => {
    const odd = { ...role('welder'), salaryMax: 40000 };
    expect(salaryRange(odd, RATE)).toEqual({ min: 49545, max: 49545 });
  });
});

describe('sgkRate / employerMonthlyCost', () => {
  it('reads the three tiers from rateConfig.sgkRates', () => {
    expect(SGK_TIERS).toEqual(['manufacturing', 'other', 'none']);
    expect(sgkRate(RATE, 'manufacturing')).toBe(0.1875);
    expect(sgkRate(RATE, 'other')).toBe(0.2175);
    expect(sgkRate(RATE, 'none')).toBe(0.2375);
  });
  it('refuses an unknown tier (stale UI state must not become a silent 21.75 %)', () => {
    expect(() => sgkRate(RATE, 'bogus' as SgkTier)).toThrow(CalculatorError);
  });
  it('employer cost at the minimum wage is calc.079’s ₺40,214', () => {
    expect(employerMonthlyCost(33030, RATE)).toBeCloseTo(40214.025, 6);
    expect(employerMonthlyCost(33030, RATE, 'manufacturing')).toBeCloseTo(39223.125, 6);
    expect(employerMonthlyCost(45000, RATE, 'other')).toBeCloseTo(54787.5, 6);
  });
});

describe('estimate — the design’s initial render (welder, 1 worker, other tier, flight on)', () => {
  const e = estimate({ role: role('welder'), headcount: 1 }, RATE);
  it('resolves the defaults: 12 months, other tier, flight on, housing/support off, salary = range min', () => {
    expect(e.input).toEqual({
      role: role('welder'),
      headcount: 1,
      months: 12,
      grossSalary: 49545,
      sgkTier: 'other',
      sgkRate: 0.2175,
      flight: true,
      housing: false,
      supportOptIn: false,
    });
  });
  it('monthly: gross + SGK, unrounded', () => {
    expect(e.perWorker.monthly.gross).toBe(49545);
    expect(e.perWorker.monthly.sgk).toBeCloseTo(10776.0375, 6);
    expect(e.perWorker.monthly.housing).toBe(0);
    expect(e.perWorker.monthly.support).toBe(0);
    expect(e.perWorker.monthly.total).toBeCloseTo(60321.0375, 6);
    expect(e.monthly).toEqual(e.perWorker.monthly);
  });
  it('one-off: permit fee + flight', () => {
    expect(e.oneOff).toEqual({ permitFee: 16000, flight: 12000, total: 28000 });
    expect(e.perWorker.oneOff).toEqual(e.oneOff);
  });
  it('first-year total = 12 × monthly + one-off', () => {
    expect(e.contract.months).toBe(12);
    expect(e.contract.payroll).toBeCloseTo(723852.45, 6);
    expect(e.contract.oneOff).toBe(28000);
    expect(e.contract.total).toBeCloseTo(751852.45, 6);
    expect(e.firstYearTotal).toBe(e.contract.total);
    expect(e.contract.perWorkerPerMonth).toBeCloseTo(62654.370833, 5);
  });
});

describe('estimate — the homepage teaser (general preset, 15 workers)', () => {
  it('per worker with the support opt-in reproduces home.299’s ₺38,944', () => {
    const e = estimate({ role: role('generalPreset'), headcount: 15, supportOptIn: true }, RATE);
    expect(e.perWorker.monthly).toEqual({
      gross: 33030,
      sgk: expect.closeTo(7184.025, 6),
      housing: 0,
      support: 1270,
      total: expect.closeTo(38944.025, 6),
    });
    expect(e.monthly.total).toBeCloseTo(584160.375, 6);
    expect(e.monthly.support).toBe(19050);
    expect(e.oneOff.total).toBe(420000);
    expect(e.shares.salaryPct).toBeCloseTo(82.135524, 5);
    expect(e.shares.sgkPct).toBeCloseTo(17.864476, 5);
    expect(e.shares.salaryPct + e.shares.sgkPct).toBeCloseTo(100, 9);
  });
  it('support is opt-in and OFF by default (W2): the same worker costs ₺40,214', () => {
    const e = estimate({ role: role('generalPreset'), headcount: 15 }, RATE);
    expect(e.perWorker.monthly.support).toBe(0);
    expect(e.perWorker.monthly.total).toBeCloseTo(40214.025, 6);
  });
  it('skilled and specialist presets floor at 1.5× and 2×', () => {
    expect(
      estimate({ role: role('skilledPreset'), headcount: 1 }, RATE).perWorker.monthly.total,
    ).toBeCloseTo(60321.0375, 6);
    expect(
      estimate({ role: role('specialistPreset'), headcount: 1 }, RATE).perWorker.monthly.total,
    ).toBeCloseTo(80428.05, 6);
  });
});

describe('estimate — tiers, housing, seasons, headcount', () => {
  it('SGK tiers change only the SGK line', () => {
    const m = estimate(
      { role: role('generalPreset'), headcount: 1, sgkTier: 'manufacturing' },
      RATE,
    );
    const n = estimate({ role: role('generalPreset'), headcount: 1, sgkTier: 'none' }, RATE);
    expect(m.perWorker.monthly.sgk).toBeCloseTo(6193.125, 6);
    expect(n.perWorker.monthly.sgk).toBeCloseTo(7844.625, 6);
    expect(n.perWorker.monthly.total).toBeCloseTo(40874.625, 6);
    expect(m.input.sgkRate).toBe(0.1875);
  });
  it('a 6-month season with housing: payroll × 6 + the same one-off (calc.038 note)', () => {
    const e = estimate({ role: role('welder'), headcount: 1, months: 6, housing: true }, RATE);
    expect(e.perWorker.monthly.housing).toBe(5000);
    expect(e.perWorker.monthly.total).toBeCloseTo(65321.0375, 6);
    expect(e.contract).toEqual({
      months: 6,
      payroll: expect.closeTo(391926.225, 6),
      oneOff: 28000,
      total: expect.closeTo(419926.225, 6),
      perWorkerPerMonth: expect.closeTo(69987.704167, 5),
    });
    expect(e.firstYearTotal).toBe(e.contract.total);
  });
  it('flight off removes only the flight line', () => {
    const e = estimate({ role: role('welder'), headcount: 1, flight: false }, RATE);
    expect(e.oneOff).toEqual({ permitFee: 16000, flight: 0, total: 16000 });
  });
  it('scales every line by the headcount and totals the scaled lines', () => {
    const e = estimate({ role: role('welder'), headcount: 3, months: 9 }, RATE);
    expect(e.monthly.gross).toBe(148635);
    expect(e.monthly.total).toBeCloseTo(180963.1125, 6);
    expect(e.oneOff.total).toBe(84000);
    expect(e.contract.payroll).toBeCloseTo(1628668.0125, 6);
    expect(e.contract.total).toBeCloseTo(1712668.0125, 6);
    expect(e.contract.perWorkerPerMonth).toBeCloseTo(63432.148611, 5);
  });
  it('a declared salary is clamped into the range', () => {
    const w = role('welder');
    expect(estimate({ role: w, headcount: 1, grossSalary: 10000 }, RATE).input.grossSalary).toBe(
      49545,
    );
    expect(estimate({ role: w, headcount: 1, grossSalary: 999999 }, RATE).input.grossSalary).toBe(
      70000,
    );
    expect(estimate({ role: w, headcount: 1, grossSalary: 55000 }, RATE).input.grossSalary).toBe(
      55000,
    );
    expect(estimate({ role: w, headcount: 1, grossSalary: null }, RATE).input.grossSalary).toBe(
      49545,
    );
    expect(
      estimate({ role: w, headcount: 1, grossSalary: Number.NaN }, RATE).input.grossSalary,
    ).toBe(49545);
    expect(
      estimate({ role: role('generalPreset'), headcount: 1, grossSalary: 999999 }, RATE).input
        .grossSalary,
    ).toBe(999999);
  });
  it('clamps headcount and months to LIMITS instead of throwing', () => {
    expect(LIMITS).toEqual({ headcountMin: 1, headcountMax: 500, monthsMin: 1, monthsMax: 12 });
    const w = role('welder');
    expect(estimate({ role: w, headcount: 0 }, RATE).input.headcount).toBe(1);
    expect(estimate({ role: w, headcount: 9999 }, RATE).input.headcount).toBe(500);
    expect(estimate({ role: w, headcount: 2.7 }, RATE).input.headcount).toBe(2);
    expect(estimate({ role: w, headcount: Number.NaN }, RATE).input.headcount).toBe(1);
    expect(estimate({ role: w, headcount: 1, months: 0 }, RATE).input.months).toBe(1);
    expect(estimate({ role: w, headcount: 1, months: 24 }, RATE).input.months).toBe(12);
    expect(estimate({ role: w, headcount: 1, months: 9 }, RATE).input.months).toBe(9);
  });
  it('does not mutate its inputs', () => {
    const input = { role: role('welder'), headcount: 2 };
    const before = JSON.stringify({ input, RATE });
    estimate(input, RATE);
    expect(JSON.stringify({ input, RATE })).toBe(before);
  });
});

describe('presets / findRole', () => {
  it('presets are the preset:true rows in ascending multiplier (the teaser chips)', () => {
    expect(presets(ROLES).map((r) => [r.key, r.multiplier, r.labelId])).toEqual([
      ['generalPreset', 1, 'home.240'],
      ['skilledPreset', 1.5, 'home.241'],
      ['specialistPreset', 2, 'home.242'],
    ]);
    expect(presets(ROLES.filter((r) => !r.preset))).toEqual([]);
  });
  it('findRole returns the row or undefined', () => {
    expect(findRole(ROLES, 'cook')?.labelId).toBe('calc.548');
    expect(findRole(ROLES, 'nope')).toBeUndefined();
  });
});
```

Run: `npx vitest run src/lib/calculator` — expected failure: `Failed to resolve import "../engine" from "src/lib/calculator/__tests__/engine.test.ts"`.

- [ ] **Step 2: Run test to verify it fails** — `npx vitest run src/lib/calculator` → `Error: Failed to resolve import "../engine"`, 1 failed file (0 tests run).

- [ ] **Step 3: Implement** — create `src/lib/calculator/types.ts`:

```ts
// Pure types for the calculator engine (W2/W24). No React, no server-only, no fs, and no rate
// literal: every figure derives from the `RateConfig` row (bundle.collections.rateConfig, D17)
// and the role rows of bundle.collections.calculatorRoles — Task 1's shapes, re-exported here
// so pages import one module. Numbers leave the engine unrounded; labels.ts is the only
// formatting edge (formatTRY / formatPercent, D18).
import type { CalculatorRole, RateConfig } from '@/content/collections';

export type { CalculatorRole, RateConfig };

export class CalculatorError extends Error {}

/** The employer SGK tiers the page offers (calc.022 chips) — the keys of `rateConfig.sgkRates`. */
export const SGK_TIERS = ['manufacturing', 'other', 'none'] as const;
export type SgkTier = (typeof SGK_TIERS)[number];

/** UI bounds from the design (headcount 1–500, contract 1–12 months). Bounds, not rates. */
export const LIMITS = { headcountMin: 1, headcountMax: 500, monthsMin: 1, monthsMax: 12 } as const;

export type EstimateInput = {
  role: CalculatorRole;
  /** Workers; an integer clamped to LIMITS (a non-number becomes 1). */
  headcount: number;
  /** Contract length in months, clamped to LIMITS; default 12 — the design's "Full year". */
  months?: number;
  /** Declared gross per worker per month; null/undefined/NaN → `salaryRange(role).min`; clamped to the range. */
  grossSalary?: number | null;
  /** Default 'other' — the standard 2-point discount (`sgkEmployerRate`). */
  sgkTier?: SgkTier;
  /** Flight to Türkiye paid by the employer (one-off, per worker); default true as in the design. */
  flight?: boolean;
  /** Shared accommodation paid by the employer (monthly, per worker); default false. */
  housing?: boolean;
  /** Minimum-wage support deducted (monthly, per worker); default false — opt-in (W2). */
  supportOptIn?: boolean;
};

/** Monthly lines, per worker or × headcount. `support` is a positive deduction: total = gross + sgk + housing − support. */
export type MonthlyLines = {
  gross: number;
  sgk: number;
  housing: number;
  support: number;
  total: number;
};

/** One-off lines: total = permitFee + flight. */
export type OneOffLines = { permitFee: number; flight: number; total: number };

/** The input after defaults and clamping — what the UI should reflect back. */
export type ResolvedInput = {
  role: CalculatorRole;
  headcount: number;
  months: number;
  grossSalary: number;
  sgkTier: SgkTier;
  sgkRate: number;
  flight: boolean;
  housing: boolean;
  supportOptIn: boolean;
};

export type Estimate = {
  input: ResolvedInput;
  perWorker: { monthly: MonthlyLines; oneOff: OneOffLines };
  /** × headcount. */
  monthly: MonthlyLines;
  /** × headcount. */
  oneOff: OneOffLines;
  /** payroll = monthly.total × months; total = payroll + oneOff; perWorkerPerMonth = total ÷ months ÷ headcount. */
  contract: {
    months: number;
    payroll: number;
    oneOff: number;
    total: number;
    perWorkerPerMonth: number;
  };
  /** = contract.total — the design's "First-year total" at 12 months, "N-month season total" otherwise. */
  firstYearTotal: number;
  /** Percent units (0–100, unrounded) of gross and SGK within gross + SGK — the teaser bars (home.084/085). */
  shares: { salaryPct: number; sgkPct: number };
};
```

Create `src/lib/calculator/engine.ts`:

```ts
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
```

The code above is already Prettier-formatted (printWidth 100, single quotes, trailing commas); `npx prettier --check src/lib/calculator` must print nothing to fix.

- [ ] **Step 4: Run the tests + `npm run verify`** — `npx vitest run src/lib/calculator` → `Test Files 1 passed (1)`, 27 tests. `npm run verify` → typecheck clean (`SGK_TIERS as readonly string[]` is the only cast; `expect.closeTo` is vitest's asymmetric matcher, valid inside `toEqual`), `eslint .` clean, Prettier clean, all suites green.

- [ ] **Step 5: Commit**

```
git add src/lib/calculator && git commit -m "feat(calculator): pure engine over RateConfig × calculatorRoles — exact legal floor, opt-in support, per-worker/monthly/one-off/contract totals (W2/W24, Task 9)

salaryFloor = legalMinGross × multiplier with no rounding (1.5× → 49 545,
asserted), salaryRange for the slider, sgkRate from rateConfig.sgkRates,
employerMonthlyCost, estimate (defaults + clamping to LIMITS, unrounded
lines, contract total, teaser shares), presets/findRole. Tests over Task 1's
seeded row reproduce calc.079 (40 214), home.299 (38 944 with the support
opt-in) and the page's initial render under the ruled model.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Step 1 (cycle 2 — quota): Write the failing test** — create `src/lib/calculator/__tests__/quota.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { QUOTA_VIZ_CAP, quotaBlocks, quotaCheck, turkishStaffRequired } from '../quota';
import { CalculatorError } from '../types';
import { RATE } from './fixtures';

const ratio = RATE.quotaRatio; // 5 — never a literal in the engine

describe('quotaCheck (calc.140–162: the 5:1 rule, ratio from rateConfig)', () => {
  it('calc.559: 25 Turkish employees allow 5, and you planned 1', () => {
    expect(quotaCheck(25, 1, ratio)).toEqual({
      allowed: true,
      maxForeign: 5,
      shortfall: 0,
      overBy: 0,
    });
  });
  it('calc.153: only complete groups count — 9 employees give one place, not two', () => {
    expect(quotaCheck(9, 1, ratio)).toEqual({
      allowed: true,
      maxForeign: 1,
      shortfall: 0,
      overBy: 0,
    });
    expect(quotaCheck(9, 2, ratio)).toEqual({
      allowed: false,
      maxForeign: 1,
      shortfall: 1,
      overBy: 1,
    });
  });
  it('quotaVsOver: 12 employees, 3 planned → 1 over the rule, 3 more Turkish employees needed', () => {
    expect(quotaCheck(12, 3, ratio)).toEqual({
      allowed: false,
      maxForeign: 2,
      shortfall: 3,
      overBy: 1,
    });
  });
  it('no Turkish staff at all: every requested worker is short by the full ratio', () => {
    expect(quotaCheck(0, 3, ratio)).toEqual({
      allowed: false,
      maxForeign: 0,
      shortfall: 15,
      overBy: 3,
    });
  });
  it('asking for nobody is always allowed', () => {
    expect(quotaCheck(25, 0, ratio).allowed).toBe(true);
    expect(quotaCheck(0, 0, ratio)).toEqual({
      allowed: true,
      maxForeign: 0,
      shortfall: 0,
      overBy: 0,
    });
  });
  it('sanitises the counts: negatives and NaN count as 0, fractions truncate', () => {
    expect(quotaCheck(-4, 1, ratio)).toEqual(quotaCheck(0, 1, ratio));
    expect(quotaCheck(Number.NaN, 1, ratio)).toEqual(quotaCheck(0, 1, ratio));
    expect(quotaCheck(25.9, 1.9, ratio)).toEqual(quotaCheck(25, 1, ratio));
  });
  it('follows the ratio it is given', () => {
    expect(quotaCheck(9, 3, 3)).toEqual({ allowed: true, maxForeign: 3, shortfall: 0, overBy: 0 });
  });
  it('refuses a ratio that is not a positive integer (rate data never degrades silently, D17)', () => {
    expect(() => quotaCheck(25, 1, 0)).toThrow(CalculatorError);
    expect(() => quotaCheck(25, 1, 2.5)).toThrow(CalculatorError);
    expect(() => quotaCheck(25, 1, Number.NaN)).toThrow(CalculatorError);
  });
});

describe('turkishStaffRequired (calc.043–045 hint)', () => {
  it('is requested × ratio', () => {
    expect(turkishStaffRequired(3, ratio)).toBe(15);
    expect(turkishStaffRequired(1, ratio)).toBe(5);
    expect(turkishStaffRequired(0, ratio)).toBe(0);
    expect(turkishStaffRequired(-2, ratio)).toBe(0);
  });
});

describe('quotaBlocks (calc.144–147 visualisation)', () => {
  it('calc.558 / qvExact: 25 employees make exactly 5 complete blocks, 5 more unlock the next', () => {
    expect(quotaBlocks(25, ratio)).toEqual({
      full: 5,
      remainder: 0,
      shown: 5,
      capped: false,
      nextUnlockIn: 5,
    });
  });
  it('qvPart: 12 employees = 2 complete blocks + 2 spare, 3 more unlock one further place', () => {
    expect(quotaBlocks(12, ratio)).toEqual({
      full: 2,
      remainder: 2,
      shown: 2,
      capped: false,
      nextUnlockIn: 3,
    });
  });
  it('qvNone: 3 employees is not one complete block yet — 2 more unlock the first place', () => {
    expect(quotaBlocks(3, ratio)).toEqual({
      full: 0,
      remainder: 3,
      shown: 0,
      capped: false,
      nextUnlockIn: 2,
    });
  });
  it('qvCap: 45 employees = 9 blocks, only the first 8 shown', () => {
    expect(QUOTA_VIZ_CAP).toBe(8);
    expect(quotaBlocks(45, ratio)).toEqual({
      full: 9,
      remainder: 0,
      shown: 8,
      capped: true,
      nextUnlockIn: 5,
    });
    expect(quotaBlocks(45, ratio, 20).capped).toBe(false);
  });
});
```

Run: `npx vitest run src/lib/calculator/__tests__/quota.test.ts` — expected failure: `Failed to resolve import "../quota"`.

- [ ] **Step 2: Run test to verify it fails** — `npx vitest run src/lib/calculator/__tests__/quota.test.ts` → `Error: Failed to resolve import "../quota"`, 1 failed file.

- [ ] **Step 3: Implement** — create `src/lib/calculator/quota.ts`:

```ts
// The 5:1 rule (Gate 1, calc.140–162) as arithmetic only. The RATIO is an argument
// (`rateConfig.quotaRatio`), never a literal, and the TIMING of the rule (day of application vs
// month 7 — the W2 counsel question) is not modelled here: the copy says what it says, and this
// module only counts.
import { CalculatorError } from './types';

export type QuotaCheck = {
  /** requested ≤ maxForeign. */
  allowed: boolean;
  /** floor(turkishStaff ÷ ratio) — complete groups only (calc.153). */
  maxForeign: number;
  /** Turkish employees still needed for the requested headcount: max(0, requested × ratio − staff). */
  shortfall: number;
  /** Requested workers beyond the quota: max(0, requested − maxForeign). */
  overBy: number;
};

const count = (n: number): number => (Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0);

const ratioOf = (quotaRatio: number): number => {
  if (!Number.isInteger(quotaRatio) || quotaRatio < 1) {
    throw new CalculatorError(`quotaRatio must be a positive integer, got ${String(quotaRatio)}`);
  }
  return quotaRatio;
};

export function quotaCheck(
  turkishStaff: number,
  foreignRequested: number,
  quotaRatio: number,
): QuotaCheck {
  const ratio = ratioOf(quotaRatio);
  const staff = count(turkishStaff);
  const requested = count(foreignRequested);
  const maxForeign = Math.floor(staff / ratio);
  return {
    allowed: requested <= maxForeign,
    maxForeign,
    shortfall: Math.max(0, requested * ratio - staff),
    overBy: Math.max(0, requested - maxForeign),
  };
}

/** Turkish employees the workplace needs for `foreignRequested` workers (calc.043–045). */
export function turkishStaffRequired(foreignRequested: number, quotaRatio: number): number {
  return count(foreignRequested) * ratioOf(quotaRatio);
}

/** The design shows at most this many complete blocks (line 1855). */
export const QUOTA_VIZ_CAP = 8;

export type QuotaBlocks = {
  full: number;
  remainder: number;
  shown: number;
  capped: boolean;
  /** Turkish employees that unlock the next place (= ratio when the last block is complete). */
  nextUnlockIn: number;
};

export function quotaBlocks(
  turkishStaff: number,
  quotaRatio: number,
  cap: number = QUOTA_VIZ_CAP,
): QuotaBlocks {
  const ratio = ratioOf(quotaRatio);
  const staff = count(turkishStaff);
  const full = Math.floor(staff / ratio);
  const remainder = staff % ratio;
  return {
    full,
    remainder,
    shown: Math.min(full, cap),
    capped: full > cap,
    nextUnlockIn: ratio - remainder,
  };
}
```

The code above is already Prettier-formatted; `npx prettier --check src/lib/calculator` must be clean.

- [ ] **Step 4: Run the tests + `npm run verify`** — `npx vitest run src/lib/calculator` → `Test Files 2 passed (2)`, 40 tests. `npm run verify` green.

- [ ] **Step 5: Commit**

```
git add src/lib/calculator/quota.ts src/lib/calculator/__tests__/quota.test.ts && git commit -m "feat(calculator): quotaCheck / turkishStaffRequired / quotaBlocks over rateConfig.quotaRatio (W24, Task 9)

Complete groups only (9 → one place), shortfall in Turkish employees, overBy
in workers, the 8-block visualisation cap; the ratio is an argument and a
non-integer ratio throws (D17).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Step 1 (cycle 3 — labels, the formatting edge): Write the failing test** — create `src/lib/calculator/__tests__/labels.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { estimate } from '../engine';
import {
  effectiveFromLabel,
  effectiveYear,
  formatEstimate,
  isReviewDue,
  multiplierLabel,
  sgkRateLabel,
  updatedAtLabel,
} from '../labels';
import { CalculatorError } from '../types';
import { RATE, role } from './fixtures';

describe('dated labels from RateConfig (D17)', () => {
  it('effectiveFromLabel is month + year — calc.003 / home.068 “Updated January 2026”', () => {
    expect(effectiveFromLabel(RATE, 'tr')).toBe('Ocak 2026');
    expect(effectiveFromLabel(RATE, 'en')).toBe('January 2026');
  });
  it('updatedAtLabel is the calc.089 pill: day month year, tr-TR / en-GB', () => {
    expect(updatedAtLabel(RATE, 'tr')).toBe('15 Ocak 2026');
    expect(updatedAtLabel(RATE, 'en')).toBe('15 January 2026');
  });
  it('effectiveYear feeds the “{year} rates” badges', () => {
    expect(effectiveYear(RATE)).toBe(2026);
    expect(effectiveYear({ ...RATE, effectiveFrom: '2027-01-01' })).toBe(2027);
  });
  it('is timezone-proof: the label never slips into the previous month', () => {
    expect(effectiveFromLabel({ ...RATE, effectiveFrom: '2026-03-01' }, 'en')).toBe('March 2026');
    expect(updatedAtLabel({ ...RATE, updatedAt: '2026-12-31' }, 'en')).toBe('31 December 2026');
  });
  it('refuses a malformed date instead of printing “Invalid Date”', () => {
    expect(() => effectiveFromLabel({ ...RATE, effectiveFrom: '2026-1-1' }, 'en')).toThrow(
      CalculatorError,
    );
    expect(() => updatedAtLabel({ ...RATE, updatedAt: 'soon' }, 'tr')).toThrow(CalculatorError);
  });
});

describe('isReviewDue (the badge hides from reviewDueAt, D17)', () => {
  it('is false before the review date and true from 00:00 UTC on it', () => {
    expect(isReviewDue(RATE, new Date('2026-09-20T12:00:00Z'))).toBe(false);
    expect(isReviewDue(RATE, new Date('2026-12-19T23:59:59Z'))).toBe(false);
    expect(isReviewDue(RATE, new Date('2026-12-20T00:00:00Z'))).toBe(true);
    expect(isReviewDue(RATE, new Date('2027-03-01T00:00:00Z'))).toBe(true);
  });
  it('defaults `now` to the clock', () => {
    expect(isReviewDue({ ...RATE, reviewDueAt: '2000-01-01' })).toBe(true);
    expect(isReviewDue({ ...RATE, reviewDueAt: '2999-01-01' })).toBe(false);
  });
});

describe('rate / multiplier labels (D18 through formatPercent)', () => {
  it('sgkRateLabel', () => {
    expect(sgkRateLabel(RATE, 'other', 'tr')).toBe('%21,75');
    expect(sgkRateLabel(RATE, 'other', 'en')).toBe('21.75%');
    expect(sgkRateLabel(RATE, 'manufacturing', 'en')).toBe('18.75%');
    expect(sgkRateLabel(RATE, 'none', 'tr')).toBe('%23,75');
  });
  it('multiplierLabel — calc.557’s “1.5×” / “1,5 katı” number, calc.476/477 chips', () => {
    expect(multiplierLabel(1.5, 'tr')).toBe('1,5×');
    expect(multiplierLabel(1.5, 'en')).toBe('1.5×');
    expect(multiplierLabel(1, 'en')).toBe('1×');
    expect(multiplierLabel(2, 'tr')).toBe('2×');
  });
});

describe('formatEstimate (every lira line through formatTRY)', () => {
  const teaser = estimate({ role: role('generalPreset'), headcount: 15, supportOptIn: true }, RATE);
  it('TR: trailing ₺, dot thousands', () => {
    const f = formatEstimate(teaser, 'tr');
    expect(f.grossSalary).toBe('33.030 ₺');
    expect(f.perWorker.monthly).toEqual({
      gross: '33.030 ₺',
      sgk: '7.184 ₺',
      housing: '0 ₺',
      support: '1.270 ₺',
      total: '38.944 ₺',
    });
    expect(f.perWorker.oneOff).toEqual({
      permitFee: '16.000 ₺',
      flight: '12.000 ₺',
      total: '28.000 ₺',
    });
    expect(f.monthly.total).toBe('584.160 ₺');
    expect(f.oneOff.total).toBe('420.000 ₺');
    expect(f.contract.total).toBe('7.429.925 ₺');
    expect(f.shares).toEqual({ salaryPct: '%82', sgkPct: '%18' });
  });
  it('EN: leading ₺, comma thousands', () => {
    const f = formatEstimate(teaser, 'en');
    expect(f.perWorker.monthly.total).toBe('₺38,944');
    expect(f.oneOff.total).toBe('₺420,000');
    expect(f.contract.perWorkerPerMonth).toBe('₺41,277');
    expect(f.shares).toEqual({ salaryPct: '82%', sgkPct: '18%' });
  });
  it('the design’s initial render under the ruled model (see COPY_DELTAS)', () => {
    const f = formatEstimate(estimate({ role: role('welder'), headcount: 1 }, RATE), 'en');
    expect(f.grossSalary).toBe('₺49,545');
    expect(f.monthly.total).toBe('₺60,321');
    expect(f.contract.total).toBe('₺751,852');
  });
});
```

Run: `npx vitest run src/lib/calculator/__tests__/labels.test.ts` — expected failure: `Failed to resolve import "../labels"`.

- [ ] **Step 2: Run test to verify it fails** — `npx vitest run src/lib/calculator/__tests__/labels.test.ts` → `Error: Failed to resolve import "../labels"`, 1 failed file.

- [ ] **Step 3: Implement** — create `src/lib/calculator/labels.ts`:

```ts
// The calculator's only formatting edge (W24): lira through formatTRY, rates through
// formatPercent (D18), dates through Intl in UTC so an ISO date never slips a day or a month.
// Dates use tr-TR / en-GB — the design formats its "Last updated" pill with en-GB
// ("15 January 2026", Hiring Cost Calculator line 2617); month + year labels read the same in
// en-GB and en-US, and money stays on formatTRY's own locale map. Task 5's date.ts may not exist
// when this lands, so the two date helpers are local and tiny.
import type { Locale } from '@/i18n/routing';
import { formatPercent, formatTRY } from '@/lib/format/money';
import { sgkRate } from './engine';
import {
  CalculatorError,
  type Estimate,
  type MonthlyLines,
  type OneOffLines,
  type RateConfig,
  type SgkTier,
} from './types';

const DATE_INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };
const NUMBER_INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function utcMidnight(iso: string): Date {
  const date = ISO_DATE.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(Number.NaN);
  if (Number.isNaN(date.getTime())) throw new CalculatorError(`not an ISO date: "${iso}"`);
  return date;
}

const formatMonth = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(DATE_INTL[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcMidnight(iso));

const formatDay = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(DATE_INTL[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcMidnight(iso));

/** "Ocak 2026" / "January 2026" — calc.003, home.068/079 (D17: from effectiveFrom, never typed). */
export function effectiveFromLabel(rateConfig: RateConfig, locale: Locale): string {
  return formatMonth(rateConfig.effectiveFrom, locale);
}

/** "15 Ocak 2026" / "15 January 2026" — the calc.089 "Last updated:" pill. */
export function updatedAtLabel(rateConfig: RateConfig, locale: Locale): string {
  return formatDay(rateConfig.updatedAt, locale);
}

/** The year of effectiveFrom — the "{year} rates" badges. */
export function effectiveYear(rateConfig: RateConfig): number {
  return utcMidnight(rateConfig.effectiveFrom).getUTCFullYear();
}

/** True from reviewDueAt 00:00 UTC: the dated badge hides and the owner is due a review (D17). */
export function isReviewDue(rateConfig: RateConfig, now: Date = new Date()): boolean {
  return now.getTime() >= utcMidnight(rateConfig.reviewDueAt).getTime();
}

/** "%21,75" / "21.75%" for a tier. */
export function sgkRateLabel(rateConfig: RateConfig, tier: SgkTier, locale: Locale): string {
  return formatPercent(sgkRate(rateConfig, tier) * 100, locale);
}

/** "1,5×" / "1.5×" / "2×". */
export function multiplierLabel(multiplier: number, locale: Locale): string {
  const n = new Intl.NumberFormat(NUMBER_INTL[locale], { maximumFractionDigits: 2 }).format(
    multiplier,
  );
  return `${n}×`;
}

export type FormattedLines<T> = { [K in keyof T]: string };

export type FormattedEstimate = {
  grossSalary: string;
  perWorker: { monthly: FormattedLines<MonthlyLines>; oneOff: FormattedLines<OneOffLines> };
  monthly: FormattedLines<MonthlyLines>;
  oneOff: FormattedLines<OneOffLines>;
  contract: { payroll: string; oneOff: string; total: string; perWorkerPerMonth: string };
  shares: { salaryPct: string; sgkPct: string };
};

const lira = <T extends Record<string, number>>(lines: T, locale: Locale): FormattedLines<T> =>
  Object.fromEntries(
    Object.entries(lines).map(([key, value]) => [key, formatTRY(value, locale)]),
  ) as FormattedLines<T>;

/** Every lira line through formatTRY (rounded once, here); shares as whole percents. */
export function formatEstimate(estimate: Estimate, locale: Locale): FormattedEstimate {
  return {
    grossSalary: formatTRY(estimate.input.grossSalary, locale),
    perWorker: {
      monthly: lira(estimate.perWorker.monthly, locale),
      oneOff: lira(estimate.perWorker.oneOff, locale),
    },
    monthly: lira(estimate.monthly, locale),
    oneOff: lira(estimate.oneOff, locale),
    contract: {
      payroll: formatTRY(estimate.contract.payroll, locale),
      oneOff: formatTRY(estimate.contract.oneOff, locale),
      total: formatTRY(estimate.contract.total, locale),
      perWorkerPerMonth: formatTRY(estimate.contract.perWorkerPerMonth, locale),
    },
    shares: {
      salaryPct: formatPercent(estimate.shares.salaryPct, locale, 0),
      sgkPct: formatPercent(estimate.shares.sgkPct, locale, 0),
    },
  };
}
```

The code above is already Prettier-formatted; `npx prettier --check src/lib/calculator` must be clean.

- [ ] **Step 4: Run the tests + `npm run verify`** — `npx vitest run src/lib/calculator` → `Test Files 3 passed (3)`, 52 tests (the two `formatEstimate` lira totals: `584 160.375 × 12 + 420 000 = 7 429 924.5` → `7.429.925 ₺`; `7 429 924.5 ÷ 12 ÷ 15 = 41 277.36` → `₺41,277`). `npm run verify` green (`Object.fromEntries` is in the `esnext` lib; `Intl` locale data is full-icu in the Node 20+ Vercel runtime and locally).

- [ ] **Step 5: Commit**

```
git add src/lib/calculator/labels.ts src/lib/calculator/__tests__/labels.test.ts && git commit -m "feat(calculator): labels — effectiveFrom/updatedAt/year, isReviewDue, sgkRateLabel, multiplierLabel, formatEstimate (D17/D18, Task 9)

The engine's only formatting edge: formatTRY/formatPercent for money and
rates, Intl in UTC for the dated badges (tr-TR / en-GB dates as the design's
pill), the badge-hiding predicate from reviewDueAt.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

- [ ] **Step 1 (cycle 4 — barrel, COPY_DELTAS, bundle cross-check, docs): Write the failing test** — create `src/lib/calculator/__tests__/copy-deltas.test.ts`:

```ts
// COPY_DELTAS (W24): where the design's SHOWN number differs from the ruled model, the page
// tasks (T1 Homepage teaser, T4 Cost Calculator) author their sys.* templates from the `model`
// column, not from the design's sample. Rows with `agrees: true` are pins — the design and the
// model print the same figure. Every row is computed live, so the table cannot drift from the
// engine; the `agrees` column is asserted against the rounded model value.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../contract/website-bundle.v1';
import { getCollection, getRateConfig } from '@/content/collections';
import {
  effectiveFromLabel,
  employerMonthlyCost,
  estimate,
  findRole,
  presets,
  quotaBlocks,
  quotaCheck,
  salaryFloor,
  salaryRange,
  sgkRate,
} from '../index';
import { RATE, ROLES, role } from './fixtures';

type Row = {
  /** Package id, or the design-file location when the number has no string id. */
  id: string;
  where: string;
  /** The number the design shows (its sample string or its script's initial render). */
  design: number;
  /** What the ruled model computes for the same inputs (unrounded). */
  model: number;
  agrees: boolean;
  note: string;
};

const initial = estimate({ role: role('welder'), headcount: 1 }, RATE);
const general = estimate({ role: role('generalPreset'), headcount: 15 }, RATE);
const generalWithSupport = estimate(
  { role: role('generalPreset'), headcount: 15, supportOptIn: true },
  RATE,
);

export const COPY_DELTAS: Row[] = [
  {
    id: 'calc.557',
    where: 'threshold note under the salary slider (GEN.threshold)',
    design: 49545,
    model: salaryFloor(role('welder'), RATE),
    agrees: true,
    note: 'the design prints the exact 1.5× floor here — the model everywhere (W2)',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2588 (legalMin)',
    where:
      'slider minimum / salary-guide low / pass-check salary (ckSalB) for welder, cnc, electrician, plumber',
    design: 50000,
    model: salaryRange(role('welder'), RATE).min,
    agrees: false,
    note: 'design rounds up to the next ₺500; W2 forbids it — sys.calc.passcheck.salary and the slider read 49 545',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2588 (legalMin, cook)',
    where: 'slider minimum for cook (band starts at 50 000)',
    design: 50000,
    model: salaryRange(role('cook'), RATE).min,
    agrees: true,
    note: 'the band minimum wins over the floor on both sides',
  },
  {
    id: 'calc.079',
    where: 'basis card b1: employer cost at the minimum wage',
    design: 40214,
    model: employerMonthlyCost(RATE.legalMinGross, RATE),
    agrees: true,
    note: '33 030 × 1.2175',
  },
  {
    id: 'home.299',
    where: 'homepage FAQ: "roughly ₺38,944 per worker per month"',
    design: 38944,
    model: generalWithSupport.perWorker.monthly.total,
    agrees: true,
    note: 'reproduced only WITH the support opt-in — the teaser applied it automatically for General',
  },
  {
    id: 'home.074 / home.082',
    where: 'teaser note "minimum-wage support already applied" + the support row, default state',
    design: 38944,
    model: general.perWorker.monthly.total,
    agrees: false,
    note: 'W2: support is opt-in, OFF by default → the teaser card shows 40 214 unless the visitor opts in; T1 wires a toggle or rewrites home.074 via sys.home.calc.*',
  },
  {
    id: 'home.081',
    where: 'teaser row "SGK employer share · 21.75%"',
    design: 21.75,
    model: sgkRate(RATE, 'other') * 100,
    agrees: true,
    note: 'rateConfig.sgkRates.other',
  },
  {
    id: 'home.086',
    where: 'teaser "permit ₺16,000 + flight ₺12,000"',
    design: 28000,
    model: general.perWorker.oneOff.total,
    agrees: true,
    note: 'permitFeeTRY + flightTRY',
  },
  {
    id: 'calc.021',
    where: '"(₺1,270 / worker / month — if your workplace qualifies)"',
    design: 1270,
    model: generalWithSupport.perWorker.monthly.support,
    agrees: true,
    note: 'rateConfig.supportMonthly',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)',
    where: 'estimate card "Monthly total" on first paint (welder, 1, other, flight on)',
    design: 60875,
    model: initial.monthly.total,
    agrees: false,
    note: '50 000 × 1.2175 in the design vs 49 545 × 1.2175 — follows from the floor rule',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)',
    where: 'total card "First-year total" on first paint',
    design: 758500,
    model: initial.firstYearTotal,
    agrees: false,
    note: '12 × monthly + 28 000 — follows from the floor rule',
  },
  {
    id: 'calc.560',
    where: '"12 months of payroll + one-off costs" (GEN.yearNote)',
    design: 12,
    model: initial.contract.months,
    agrees: true,
    note: 'months defaults to 12',
  },
  {
    id: 'Hiring Cost Calculator.dc.html:2699 (salary guide employer cost)',
    where: 'salary-guide card "employer cost" for welder (band low 45 000)',
    design: 54787.5,
    model: employerMonthlyCost(45000, RATE, 'other'),
    agrees: true,
    note: 'the design fixes 1.2175 regardless of the chosen tier; T4 passes the chosen tier (a delta only when the tier is not "other")',
  },
  {
    id: 'calc.558',
    where: 'quota visualisation note (GEN.qvExact) for 25 Turkish employees',
    design: 5,
    model: quotaBlocks(25, RATE.quotaRatio).full,
    agrees: true,
    note: 'floor(25 ÷ 5)',
  },
  {
    id: 'calc.559',
    where: 'pass-check quota row (GEN.ckQuoOk): "25 Turkish employees allow 5"',
    design: 5,
    model: quotaCheck(25, 1, RATE.quotaRatio).maxForeign,
    agrees: true,
    note: 'and planned 1 → allowed',
  },
  {
    id: 'calc.153',
    where: '"9 employees give one place, not two"',
    design: 1,
    model: quotaCheck(9, 1, RATE.quotaRatio).maxForeign,
    agrees: true,
    note: 'complete groups only',
  },
];

describe('COPY_DELTAS', () => {
  it('every row’s `agrees` flag matches the rounded model against the design figure', () => {
    for (const row of COPY_DELTAS) {
      // agrees ⇔ the design's figure is the model to the lira (or exact for rates)
      expect({ id: row.id, agrees: Math.abs(row.model - row.design) < 0.5 }).toEqual({
        id: row.id,
        agrees: row.agrees,
      });
    }
  });
  it('lists exactly the four places where the page tasks must follow the model, not the design', () => {
    expect(COPY_DELTAS.filter((r) => !r.agrees).map((r) => r.id)).toEqual([
      'Hiring Cost Calculator.dc.html:2588 (legalMin)',
      'home.074 / home.082',
      'Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)',
      'Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)',
    ]);
  });
});

describe('the generated bundle feeds the engine (Task 1 → Task 9 cross-check)', () => {
  // readFileSync is the sanctioned bypass of the D23 import rule for tests (W40) — the running
  // site reaches the bundle only through the adapter.
  const bundle = BundleSchema.parse(
    JSON.parse(
      readFileSync(join(__dirname, '../../../content/local/bundle.tr.json'), 'utf8'),
    ) as unknown,
  );
  const rate = getRateConfig(bundle);
  const roles = getCollection(bundle, 'calculatorRoles');

  it('the seeded row and role table equal the fixtures this suite computed with', () => {
    expect(rate).toEqual(RATE);
    expect(roles).toEqual(ROLES);
  });
  it('the ruled figures hold over the real data', () => {
    const welder = findRole(roles, 'welder');
    expect(welder && salaryFloor(welder, rate)).toBe(49545);
    expect(presets(roles).map((r) => r.multiplier)).toEqual([1, 1.5, 2]);
    expect(quotaCheck(25, 1, rate.quotaRatio).maxForeign).toBe(5);
    expect(effectiveFromLabel(rate, 'tr')).toBe('Ocak 2026');
    expect(effectiveFromLabel(rate, 'en')).toBe('January 2026');
  });
});
```

Run: `npx vitest run src/lib/calculator/__tests__/copy-deltas.test.ts` — expected failure: `Failed to resolve import "../index"`.

- [ ] **Step 2: Run test to verify it fails** — `npx vitest run src/lib/calculator/__tests__/copy-deltas.test.ts` → `Error: Failed to resolve import "../index" from "src/lib/calculator/__tests__/copy-deltas.test.ts"`, 1 failed file.

- [ ] **Step 3: Implement** — (a) create `src/lib/calculator/index.ts`:

```ts
// The calculator engine's public surface (W2/W24). Pages import from '@/lib/calculator' only.
// Pure TypeScript: safe in server components and in 'use client' islands alike.
export {
  CalculatorError,
  LIMITS,
  SGK_TIERS,
  type CalculatorRole,
  type Estimate,
  type EstimateInput,
  type MonthlyLines,
  type OneOffLines,
  type RateConfig,
  type ResolvedInput,
  type SgkTier,
} from './types';
export {
  employerMonthlyCost,
  estimate,
  findRole,
  presets,
  salaryFloor,
  salaryRange,
  sgkRate,
} from './engine';
export {
  QUOTA_VIZ_CAP,
  quotaBlocks,
  quotaCheck,
  turkishStaffRequired,
  type QuotaBlocks,
  type QuotaCheck,
} from './quota';
export {
  effectiveFromLabel,
  effectiveYear,
  formatEstimate,
  isReviewDue,
  multiplierLabel,
  sgkRateLabel,
  updatedAtLabel,
  type FormattedEstimate,
  type FormattedLines,
} from './labels';
```

(b) `docs/ARCHITECTURE.md` § Calculator engine — the edit listed under **Docs in this task** below, verbatim (sentence-anchored on the paragraph as Task 1 left it). Then `npx prettier --write docs/ARCHITECTURE.md` (a one-paragraph replacement; Prettier should change nothing).

If the cross-check `expect(rate).toEqual(RATE)` / `expect(roles).toEqual(ROLES)` fails, Task 1's importer and this fixture have drifted: fix the FIXTURE to the bundle (Task 1 is the source of truth) and re-check every worked figure in this task against the new row before continuing — never edit the generated bundle.

- [ ] **Step 4: Run the tests + `npm run verify`** — `npx vitest run src/lib/calculator` → `Test Files 4 passed (4)`, 56 tests. `npx vitest run` → every suite green (nothing outside `src/lib/calculator/` and `docs/` changed). `npm run verify` green (the ESLint `no-restricted-imports` rule is not tripped: the test reads the bundle with `readFileSync`, and `@/content/collections` is not a `content/local/*` path).

- [ ] **Step 5: Commit**

```
git add src/lib/calculator docs/ARCHITECTURE.md && git commit -m "feat(calculator): public barrel, COPY_DELTAS table, generated-bundle cross-check; ARCHITECTURE § Calculator engine as built (W24, Task 9)

COPY_DELTAS pins the four places the page tasks follow the model rather
than the design's sample (the 1.5× slider minimum, the teaser's auto-applied
support, the page's initial monthly/first-year totals) and twelve agreeing
figures; the cross-check proves the importer's rateConfig/calculatorRoles
rows feed the engine unchanged.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Record in the WP2a ledger under Task 9: the four commit SHAs and the sentence "COPY_DELTAS: 4 deltas / 12 pins — T1 and T4 author sys.* from the model column".

---

**Docs in this task:**

- `docs/ARCHITECTURE.md` § Calculator engine — replace the paragraph that begins "`src/lib/calculator/` — pure functions over the published `RateConfig` (versioned, `effectiveFrom`/`reviewDueAt`, D17)." and ends with Task 1's appended sentence "…the engine takes both as arguments; nothing in `src/lib/calculator/` may hold a rate literal." with this paragraph (one paragraph, verbatim):

  "`src/lib/calculator/` (WP2a Task 9, W2/W24) — pure TypeScript, no React, no `server-only`, no rate literal: every figure derives from the `RateConfig` row (`getRateConfig(bundle)`, `bundle.collections.rateConfig`, D17) and the role rows of `bundle.collections.calculatorRoles` (`getCollection(bundle, 'calculatorRoles')`), both passed in as arguments; the homepage teaser and the Cost Calculator page share it, so there is no duplicated math. `engine.ts`: `salaryFloor(role, rateConfig)` = `legalMinGross × multiplier` exact (a 1.5× role floors at 49 545 — the design's round-up to 50 000 is not ported, W2); `salaryRange(role, rateConfig)` = `{ min: max(floor, role.salaryMin), max: role.salaryMax | null }` for the slider; `sgkRate(rateConfig, tier)` reads `rateConfig.sgkRates` (`manufacturing | other | none`); `employerMonthlyCost(gross, rateConfig, tier)`; `estimate(input, rateConfig)` → `{ input, perWorker, monthly, oneOff, contract, firstYearTotal, shares }` where monthly = gross + SGK + housing (opt-in) − minimum-wage support (opt-in, default OFF), one-off = permit fee + flight (default on), contract total = monthly × months + one-off (months 1–12, default 12), inputs clamped to `LIMITS` and reflected back in `input`; `presets(roles)` = the `preset: true` rows (1 / 1.5 / 2×) for the teaser; `findRole`. `quota.ts`: `quotaCheck(turkishStaff, foreignRequested, rateConfig.quotaRatio)` → `{ allowed, maxForeign, shortfall, overBy }` (complete groups only; `shortfall` in Turkish employees), `turkishStaffRequired`, `quotaBlocks` (the visualisation, cap 8); the rule's timing (day of application vs month 7 — the W2 counsel question) is not modelled. `labels.ts` is the only formatting edge: `effectiveFromLabel` ("Ocak 2026" / "January 2026"), `updatedAtLabel` ("15 Ocak 2026" / "15 January 2026", tr-TR / en-GB dates in UTC), `effectiveYear`, `isReviewDue(rateConfig, now)` (true from `reviewDueAt` 00:00 UTC — the dated badge hides then), `sgkRateLabel`, `multiplierLabel` ("1,5×" / "1.5×") and `formatEstimate` through `formatPercent`/`formatTRY` (D18). Numbers leave the engine unrounded and `formatTRY` rounds once at the edge. Tests (`src/lib/calculator/__tests__/`) pin the model against the design's worked figures over Task 1's seeded row and cross-check the generated bundle; `copy-deltas.test.ts` carries the `COPY_DELTAS` table — the four places where the design's shown number differs from the model (the 1.5× slider minimum 50 000 vs 49 545; `home.074`/`home.082`'s "support already applied" against the opt-in default; the page's initial monthly 60 875 vs 60 321 and first-year 758 500 vs 751 852) plus twelve agreeing pins — which the Homepage and Cost Calculator page tasks author their `sys.*` templates from. Dated labels ("2026 rates", "Updated January 2026") render from `RateConfig.effectiveFrom`, never hard-typed (D17's numbers-out-of-copy lint blocks publishing a string that hard-types a rate or metric value)."

- NOT in this task (other tasks own them): `docs/CONTENT-MODEL.md` (Task 1 documents `rateConfig`/`calculatorRoles`; nothing here changes the data), `docs/ANALYTICS.md` (`calculator_use` exists; Task 3 owns the W26 list), `src/messages/*.json` (the `sys.home.calc.*` / `sys.calc.*` templates for the 23 live-number sentences are the page tasks' copy, authored from `COPY_DELTAS`), `CLAUDE.md` (no convention changes — the "`formatTRY` is a contract" bullet already governs the edge).

**Produces — deviations:**

1. `estimate` takes `rateConfig` as a SECOND argument (`estimate(input, rateConfig)`) rather than the bare `estimate(input)` W24 sketched — Task 1's ARCHITECTURE sentence ("the engine takes both as arguments; nothing in `src/lib/calculator/` may hold a rate literal") forbids the engine from owning the row, and threading it through `input` would let a page forget it silently. `salaryFloor(role, rateConfig)`, `quotaCheck(…, quotaRatio)` follow the same rule (the ratio is `rateConfig.quotaRatio`, never a literal).
2. `salaryFloor` is the LEGAL floor only (`legalMinGross × multiplier`, exact — W2's assertion holds: 49 545 for 1.5×). The design's slider also respects the role's own band minimum (`max(role.min, legalMin)`, cook starts at 50 000), so that composite is a separate `salaryRange(role, rateConfig)` — the slider/guide use the range, the threshold note and pass check use the floor.
3. `quotaCheck` returns one field beyond the ruled trio: `overBy` (requested workers beyond the quota) beside `shortfall` (Turkish employees still needed) — the design's `quotaVsOver` message needs both numbers and deriving `overBy` at every call site would re-implement the floor. `quotaBlocks` and `turkishStaffRequired` are additive helpers for the visualisation and the headcount hint.
4. `labels.ts` carries more than the ruled `effectiveFromLabel`/`isReviewDue`: `updatedAtLabel` (the calc.089 pill), `effectiveYear` (the "{year} rates" badges), `sgkRateLabel`, `multiplierLabel` and `formatEstimate` — all edge formatters over `formatTRY`/`formatPercent`/`Intl`, so neither page re-implements D18 for the same lines. Dates format with `tr-TR` / `en-GB` (the design's own choice for "15 January 2026"), a different English tag from `money.ts`'s `en-US`; month + year labels are identical in both.
5. `estimate` CLAMPS out-of-range inputs (headcount to 1–500, months to 1–12, salary into the range, NaN to the defaults) and reports the resolved values in `estimate.input` rather than throwing — a slider or a stale URL state must never blank the card; only bad RATE DATA throws (`sgkRate` on an unknown tier, `quotaCheck` on a non-integer ratio), per D17.
6. Support is modelled as a positive `support` line with `total = gross + sgk + housing − support` (the design's `mSupport` subtraction) rather than a negative line, so `formatTRY` never has to print a minus; the page renders the deduction sign in its own template.
7. The `COPY_DELTAS` table lives in its own test file (`__tests__/copy-deltas.test.ts`, cycle 4) rather than in `engine.test.ts`, because its quota rows need `quota.ts` (cycle 2) and it is where the generated-bundle cross-check belongs; it is a live table (every `model` value is computed) with an asserted `agrees` column, so it cannot drift from the engine.
8. Extras beyond W24: `LIMITS`, `SGK_TIERS`, `employerMonthlyCost`, `findRole`, `QUOTA_VIZ_CAP`, `FormattedEstimate`/`FormattedLines`, and a fixtures module (`__tests__/fixtures.ts`) that copies Task 1's seeded row and role table so the worked figures are computed over the real shape; the cross-check asserts the fixture equals the generated bundle.

---
