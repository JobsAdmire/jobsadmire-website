import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

// W144(d): the date tests run under a negative-offset zone, hoisted to file level so every
// describe below (including isReviewDue's exact-instant boundary checks) runs under it, not just
// the calendar-label tests. Two DIFFERENT failure modes are in play, and this zone does not catch
// them the same way (Task 9 re-review, finding N4 — a prior version of this comment had this
// backwards): a FORMATTER regression (e.g. dropping `timeZone: 'UTC'` from the Intl call) shows up
// here because Jan 1 00:00 UTC would then render in the runner's own local time — 31 December
// under America/Los_Angeles — which the calendar-label tests below catch directly. A PARSER
// regression (e.g. dropping the implicit UTC anchor when parsing the ISO string) is NOT visible
// the same way: under this NEGATIVE offset, a local-time parse of a midnight date lands LATER the
// same UTC day (e.g. 08:00 UTC, still "the 1st"), so calendar-only output is unaffected — only an
// exact-instant comparison notices the drift, which is why isReviewDue's boundary tests need to
// run under this zone too, and why a dedicated case pins it explicitly below.
const originalTz = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'America/Los_Angeles';
});
afterAll(() => {
  if (originalTz === undefined) delete process.env.TZ;
  else process.env.TZ = originalTz;
});

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
  it('refuses a calendar-invalid ISO date instead of rolling it over to the next month (W144(b))', () => {
    expect(() => effectiveFromLabel({ ...RATE, effectiveFrom: '2026-02-30' }, 'en')).toThrow(
      CalculatorError,
    );
    expect(() => updatedAtLabel({ ...RATE, updatedAt: '2026-02-29' }, 'en')).toThrow(
      CalculatorError,
    );
    expect(() => effectiveFromLabel({ ...RATE, effectiveFrom: '2026-04-31' }, 'en')).toThrow(
      CalculatorError,
    );
    // 2028 IS a leap year — 29 February is a real date and must not throw.
    expect(effectiveFromLabel({ ...RATE, effectiveFrom: '2028-02-29' }, 'en')).toBe(
      'February 2028',
    );
  });
  it('the day label for 2026-01-01 reads the 1st, not 31 December, under this zone (N4 — pins the formatter half of the guard)', () => {
    expect(updatedAtLabel({ ...RATE, updatedAt: '2026-01-01' }, 'en')).toBe('1 January 2026');
    expect(effectiveFromLabel({ ...RATE, effectiveFrom: '2026-01-01' }, 'en')).toBe('January 2026');
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
  it('also refuses a calendar-invalid reviewDueAt instead of shifting it (W144(b) — confirms isReviewDue uses utcMidnight)', () => {
    expect(() => isReviewDue({ ...RATE, reviewDueAt: '2026-02-30' })).toThrow(CalculatorError);
  });
  it('parses reviewDueAt as UTC midnight, not local midnight (N4 — pins the parser half of the guard)', () => {
    // The correct parse of "2026-01-01" is exactly 2026-01-01T00:00:00.000Z (getUTCDate() 1,
    // getUTCHours() 0). A local-time parse under America/Los_Angeles (UTC−8) would instead anchor
    // 8 hours LATER, at 2026-01-01T08:00:00Z — still "the 1st" in UTC, so the calendar-label tests
    // above cannot tell the difference in this zone (see the file-level comment). This exact
    // boundary can: at the true instant the regressed parse would not yet consider the date due.
    const rate = { ...RATE, reviewDueAt: '2026-01-01' };
    expect(isReviewDue(rate, new Date('2026-01-01T00:00:00.000Z'))).toBe(true);
    expect(isReviewDue(rate, new Date('2025-12-31T23:59:59.999Z'))).toBe(false);
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
  it('snaps additive lines to 4 decimals before rounding so a breakdown always sums to the displayed total (W144(a))', () => {
    // welder, gross 56 212, tier none, 330 workers: the exact monthly SGK is 4,405,615.5, which
    // float noise can put on the wrong side of the half-lira boundary (4,405,615.499999999...).
    const e = estimate(
      { role: role('welder'), headcount: 330, sgkTier: 'none', grossSalary: 56212 },
      RATE,
    );
    const f = formatEstimate(e, 'en');
    expect(f.monthly.gross).toBe('₺18,549,960');
    expect(f.monthly.sgk).toBe('₺4,405,616');
    expect(f.monthly.total).toBe('₺22,955,576');
  });
});
