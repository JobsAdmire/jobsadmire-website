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
