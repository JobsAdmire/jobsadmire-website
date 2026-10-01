import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { COMPARE_ROWS, FAQ_PAIRS, INDUSTRIES, PROCESS_STEPS } from '../tables';

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `hire.${String(from + i).padStart(3, '0')}`);

describe('INDUSTRIES (design rows 01–06 → sectors collection keys)', () => {
  it('lists the six placeable sectors in design order, never `other`', () => {
    expect(INDUSTRIES.map((r) => r.key)).toEqual([
      'factory',
      'construction',
      'tourism',
      'agriculture',
      'textile',
      'logistics',
    ]);
    for (const row of INDUSTRIES) expect(SECTOR_KEYS).toContain(row.key);
  });

  it('uses every one of the 41 role ids hire.089–hire.129 exactly once', () => {
    const used = INDUSTRIES.flatMap((r) => [...r.visibleRoleIds, ...r.moreRoleIds]);
    expect(new Set(used).size).toBe(used.length);
    expect([...used].sort()).toEqual(range(89, 129));
  });

  it('carries the six per-sector CTA ids hire.130–135 in order', () => {
    expect(INDUSTRIES.map((r) => r.ctaId)).toEqual(range(130, 135));
  });
});

describe('COMPARE_ROWS', () => {
  it('is 5 + 5 title/body pairs over hire.150–169 in order', () => {
    expect(COMPARE_ROWS.own.map((r) => r.titleId)).toEqual(
      [150, 152, 154, 156, 158].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.own.map((r) => r.bodyId)).toEqual(
      [151, 153, 155, 157, 159].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.with.map((r) => r.titleId)).toEqual(
      [160, 162, 164, 166, 168].map((n) => `hire.${n}`),
    );
    expect(COMPARE_ROWS.with.map((r) => r.bodyId)).toEqual(
      [161, 163, 165, 167, 169].map((n) => `hire.${n}`),
    );
  });
});

describe('PROCESS_STEPS', () => {
  it('is six numbered steps over hire.271–288 (when, title, body per step)', () => {
    expect(PROCESS_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PROCESS_STEPS.flatMap((s) => [s.whenId, s.titleId, s.bodyId])).toEqual(range(271, 288));
  });
});

describe('FAQ_PAIRS', () => {
  it('is seven q/a pairs over hire.289–302 with unique ids', () => {
    expect(FAQ_PAIRS).toHaveLength(7);
    expect(FAQ_PAIRS.flatMap((p) => [p.qId, p.aId])).toEqual(range(289, 302));
    expect(new Set(FAQ_PAIRS.map((p) => p.id)).size).toBe(7);
  });
});
