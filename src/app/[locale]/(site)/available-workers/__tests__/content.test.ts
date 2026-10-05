import { describe, expect, it } from 'vitest';
import { testBundle } from '@/test/bundle';
import { afterSteps, verifiedSteps, WORKERS_FAQ, workersFaqItems } from '../_lib/content';

// Every id the FAQ builder reads, as plain strings (no `{metric}` tokens — this test is about
// pairing and gating; the golden fixture carries no metrics collection).
const STRINGS = Object.fromEntries(
  WORKERS_FAQ.flatMap((f) => [
    [f.q, `Q ${f.q}`],
    [f.a, `A ${f.a}`],
  ]),
);
const tf = (id: string) => `<${id}>`;

describe('Available Workers FAQ (W9)', () => {
  it('shows all eight pairs, "How current is this list?" first, and answers the two JS-only questions with their package twins', () => {
    const items = workersFaqItems(testBundle({ strings: STRINGS }), 'en');
    expect(items.map((i) => i.id)).toEqual([
      'availworkers.210',
      'availworkers.212',
      'availworkers.214',
      'availworkers.216',
      'availworkers.218',
      'availworkers.219',
      'availworkers.221',
      'availworkers.222',
    ]);
    expect(items.find((i) => i.id === 'availworkers.218')?.a).toBe('A wp.350');
    expect(items.find((i) => i.id === 'availworkers.221')?.a).toBe('A hire.302');
    for (const item of items) {
      expect(item.q.startsWith('Q ')).toBe(true);
      expect(item.a.startsWith('A ')).toBe(true);
    }
  });
});

describe('the two step lists', () => {
  it('"What verified means": four checks over 074–082, step 4 carrying the "Goes live" pill (081)', () => {
    expect(verifiedSteps(tf)).toEqual([
      { n: 1, titleId: 'availworkers.074', bodyId: 'availworkers.075' },
      { n: 2, titleId: 'availworkers.076', bodyId: 'availworkers.077' },
      { n: 3, titleId: 'availworkers.078', bodyId: 'availworkers.079' },
      { n: 4, titleId: 'availworkers.080', bodyId: 'availworkers.082', when: '<availworkers.081>' },
    ]);
  });

  it('"After you pick": four steps over 090–099 with their badges; the arrival badge is absent while firstDayWeeks is unsigned (D17)', () => {
    const signed = afterSteps(tf, { days1to3: 'Days 1–3', arrival: 'Weeks 6–8' });
    expect(signed.map((s) => [s.titleId, s.bodyId])).toEqual([
      ['availworkers.090', 'availworkers.092'],
      ['availworkers.093', 'availworkers.094'],
      ['availworkers.095', 'availworkers.097'],
      ['availworkers.098', 'availworkers.099'],
    ]);
    expect(signed.map((s) => s.when)).toEqual([
      '<availworkers.091>',
      'Days 1–3',
      '<availworkers.096>',
      'Weeks 6–8',
    ]);
    expect(afterSteps(tf, { days1to3: 'Days 1–3' })[3]).toEqual({
      n: 4,
      titleId: 'availworkers.098',
      bodyId: 'availworkers.099',
    });
  });
});
