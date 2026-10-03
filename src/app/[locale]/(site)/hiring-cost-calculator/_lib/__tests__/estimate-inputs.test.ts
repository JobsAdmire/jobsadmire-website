import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INPUTS,
  ESTIMATE_FIELDS,
  estimateFieldValues,
  parseEstimateFields,
  sanitizeInputs,
} from '../estimate-inputs';

describe('sanitizeInputs', () => {
  it('starts from the design defaults: welder × 1, 12 months, other tier, flight on, support OFF (W2/W58)', () => {
    expect(DEFAULT_INPUTS).toEqual({
      roleKey: 'welder',
      headcount: 1,
      months: 12,
      grossSalary: null,
      sgkTier: 'other',
      flight: true,
      housing: false,
      supportOptIn: false,
      turkishStaff: 25,
    });
    expect(sanitizeInputs({})).toEqual(DEFAULT_INPUTS);
  });
  it('clamps to the design bounds and validates the tier before the engine sees it (W144)', () => {
    expect(
      sanitizeInputs({
        headcount: 9999,
        turkishStaff: -3,
        months: 7,
        sgkTier: 'x',
        grossSalary: 0,
      }),
    ).toMatchObject({
      headcount: 500,
      turkishStaff: 0,
      months: 12,
      sgkTier: 'other',
      grossSalary: null,
    });
    expect(sanitizeInputs({ headcount: 0, turkishStaff: 99999 })).toMatchObject({
      headcount: 1,
      turkishStaff: 5000,
    });
    expect(sanitizeInputs({ sgkTier: 'manufacturing', months: 6 })).toMatchObject({
      sgkTier: 'manufacturing',
      months: 6,
    });
  });
});

describe('the est_* hidden inputs', () => {
  it('round-trip through estimateFieldValues → parseEstimateFields', () => {
    const inputs = {
      ...DEFAULT_INPUTS,
      roleKey: 'cook',
      headcount: 12,
      months: 6 as const,
      grossSalary: 55000,
      sgkTier: 'manufacturing' as const,
      flight: false,
      housing: true,
      supportOptIn: true,
      turkishStaff: 40,
    };
    const posted = Object.fromEntries(estimateFieldValues(inputs));
    expect(Object.keys(posted).sort()).toEqual(Object.values(ESTIMATE_FIELDS).sort());
    expect(parseEstimateFields(posted)).toEqual(inputs);
  });
  it('turn garbage into the defaults', () => {
    expect(
      parseEstimateFields({
        [ESTIMATE_FIELDS.headcount]: 'abc',
        [ESTIMATE_FIELDS.months]: '7',
        [ESTIMATE_FIELDS.tier]: 'x',
        [ESTIMATE_FIELDS.salary]: '',
      }),
    ).toEqual(DEFAULT_INPUTS);
  });
});
