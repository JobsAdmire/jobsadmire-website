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
