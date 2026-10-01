import { describe, expect, it } from 'vitest';
import {
  evaluate,
  isComplete,
  POINT_ID,
  POINT_KEYS,
  prefillText,
  QUESTION_KEYS,
  QUESTIONS,
  VERDICT_TITLE_ID,
  type Answers,
  type WizardQuestion,
} from '../eligibility';

const base: Answers = { company: 'yes', staff: 'atLeast', location: 'abroad', debts: 'no' };

describe('QUESTIONS — the design order; stable option keys replace its indices', () => {
  it('asks company → staff → location → debts with the design option order', () => {
    expect(QUESTIONS.map((q) => q.key)).toEqual([...QUESTION_KEYS]);
    expect(QUESTIONS.map((q) => q.qId)).toEqual(['wp.075', 'wp.076', 'wp.077', 'wp.080']);
    expect(QUESTIONS.map((q) => q.options.map((o) => o.key))).toEqual([
      ['yes', 'no'],
      ['atLeast', 'below'],
      ['abroad', 'resident', 'noPermit'],
      ['no', 'yes'],
    ]);
  });
  it('labels an option by its package id where the package has one, else by a sys word', () => {
    expect(
      QUESTIONS.flatMap((q) => q.options.map((o) => ('id' in o ? o.id : `sys:${o.sys}`))),
    ).toEqual([
      'sys:yes',
      'wp.081',
      'sys:atLeast',
      'sys:below',
      'sys:abroad',
      'wp.078',
      'wp.079',
      'sys:no',
      'wp.082',
    ]);
  });
});

describe('evaluate — the design’s eligResult() over keys', () => {
  it('eligible: a company, enough Turkish staff, no debts', () => {
    expect(evaluate(base)).toEqual({
      verdict: 'eligible',
      points: ['locationAbroad', 'thresholds'],
    });
  });
  it('conditional: fewer Turkish staff than the ratio asks for', () => {
    expect(evaluate({ ...base, staff: 'below', location: 'resident' })).toEqual({
      verdict: 'conditional',
      points: ['ratio', 'locationResident', 'thresholds'],
    });
  });
  it('ineligible: no company yet — the thresholds point is suppressed', () => {
    expect(evaluate({ ...base, company: 'no', location: 'noPermit' })).toEqual({
      verdict: 'ineligible',
      points: ['company', 'locationNoPermit'],
    });
  });
  it('ineligible: overdue debts win over the staff rule', () => {
    expect(evaluate({ ...base, staff: 'below', debts: 'yes' })).toEqual({
      verdict: 'ineligible',
      points: ['ratio', 'locationAbroad', 'debts'],
    });
  });
  it('titles the three W67 buckets with the package ids', () => {
    expect(VERDICT_TITLE_ID).toEqual({
      eligible: 'wp.074',
      conditional: 'wp.073',
      ineligible: 'wp.072',
    });
  });
});

describe('W2 — the wizard never reads wp.066', () => {
  it('the ratio point has no package id; every other point keeps its design id', () => {
    expect(POINT_ID).toEqual({
      company: 'wp.065',
      ratio: null,
      locationAbroad: 'wp.067',
      locationResident: 'wp.068',
      locationNoPermit: 'wp.069',
      debts: 'wp.070',
      thresholds: 'wp.071',
    });
    expect(POINT_KEYS).toHaveLength(7);
  });
});

describe('isComplete', () => {
  it('is true only once all four questions are answered', () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete({ company: 'yes', staff: 'atLeast', location: 'abroad' })).toBe(false);
    expect(isComplete(base)).toBe(true);
  });
});

describe('prefillText — the WhatsApp message composed at click time (W76/W95)', () => {
  const questions: WizardQuestion[] = [
    { key: 'company', question: 'Company?', options: [{ key: 'yes', label: 'Yes' }] },
    { key: 'staff', question: 'Staff?', options: [{ key: 'below', label: 'Fewer than 5' }] },
    { key: 'location', question: 'Where?', options: [{ key: 'abroad', label: 'Abroad' }] },
    { key: 'debts', question: 'Debts?', options: [{ key: 'no', label: 'No' }] },
  ];
  it('is the intro, one "• question answer" line per question in order, then the result line', () => {
    expect(
      prefillText(
        'Hello JobsAdmire, my answers:',
        questions,
        { ...base, staff: 'below' },
        'Result: Likely eligible',
      ),
    ).toBe(
      [
        'Hello JobsAdmire, my answers:',
        '• Company? Yes',
        '• Staff? Fewer than 5',
        '• Where? Abroad',
        '• Debts? No',
        'Result: Likely eligible',
      ].join('\n'),
    );
  });
});
