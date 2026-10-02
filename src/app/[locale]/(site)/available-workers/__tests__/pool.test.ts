import { describe, expect, it } from 'vitest';
import { assertServableInProduction } from '@/content/pure';
import { testBundle } from '@/test/bundle';
import { cardsVisible, POOL_CARDS, poolRows, poolSigned } from '../_lib/pool';

// Test-only rows, built here: the design's 12-record JS fixture is never imported (D23).
const POOL_ROWS = [
  { publicRef: 'JA-1042', trade: 'Welder', country: 'PK', availability: 'now' },
  { publicRef: 'JA-1050', trade: 'Cook', country: 'NP', availability: '30d' },
];

describe('pool gates (D2 / D23 / W6)', () => {
  it('per-profile cards are off at launch — the D2 switch is code, not content', () => {
    expect(POOL_CARDS).toBe(false);
  });

  it('an absent or empty pool collection is unsigned: no badge, no card copy', () => {
    for (const b of [testBundle(), testBundle({ collections: { pool: [] } })]) {
      expect(poolRows(b)).toEqual([]);
      expect(poolSigned(b)).toBe(false);
      expect(cardsVisible(b)).toBe(false);
    }
  });

  it('rows alone never show card-presupposing copy while the D2 switch is off', () => {
    const b = testBundle({ collections: { pool: POOL_ROWS } });
    expect(poolRows(b)).toHaveLength(2);
    expect(poolSigned(b)).toBe(true);
    expect(cardsVisible(b)).toBe(false);
  });

  it('a LOCAL bundle carrying pool rows can never be served in production (previews included)', () => {
    const b = testBundle({ collections: { pool: POOL_ROWS } });
    // Vercel sets NODE_ENV=production on previews too, so this is the preview rule as well.
    expect(() => assertServableInProduction(b, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL in production/,
    );
    // The only lawful source of pool rows is the Operations bundle (Phase B / v1.1).
    expect(() => assertServableInProduction(b, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(b, 'LOCAL', 'development')).not.toThrow();
  });
});
