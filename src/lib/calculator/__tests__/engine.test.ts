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
