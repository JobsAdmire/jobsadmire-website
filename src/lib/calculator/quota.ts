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

/** T9-2/§8 G: the visualisation's cap is a caller-supplied argument, not rate data — a stale UI
 *  state, so it is validated the same way `ratioOf` validates a bad `sgkTier` (D17: never degrade
 *  silently). `0` is a valid cap (show none of the blocks). */
const capOf = (cap: number): number => {
  if (!Number.isInteger(cap) || cap < 0) {
    throw new CalculatorError(`cap must be a non-negative integer, got ${String(cap)}`);
  }
  return cap;
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
  const validCap = capOf(cap);
  const staff = count(turkishStaff);
  const full = Math.floor(staff / ratio);
  const remainder = staff % ratio;
  return {
    full,
    remainder,
    shown: Math.min(full, validCap),
    capped: full > validCap,
    nextUnlockIn: ratio - remainder,
  };
}
