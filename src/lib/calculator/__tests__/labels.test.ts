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
