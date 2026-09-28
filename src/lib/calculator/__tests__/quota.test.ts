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
