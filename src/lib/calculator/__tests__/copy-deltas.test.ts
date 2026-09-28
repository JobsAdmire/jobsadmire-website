// COPY_DELTAS (W24/W143) now lives as importable data in `../copy-deltas`; this file only
// asserts it (the `agrees`/`legal` flags, the disagreeing-id list) and cross-checks the generated
// bundle against the fixtures the table was computed with.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BundleSchema } from '../../../../contract/website-bundle.v1';
import { getCollection, getRateConfig } from '@/content/collections';
import { COPY_DELTAS } from '../copy-deltas';
import { effectiveFromLabel, findRole, presets, quotaCheck, salaryFloor } from '../index';
import { RATE, ROLES } from './fixtures';

type CatalogueEntry = { legal?: boolean };
const catalogue = JSON.parse(
  readFileSync(join(__dirname, '../../../content/local/catalogue.json'), 'utf8'),
) as Record<string, CatalogueEntry>;

/** A COPY_DELTAS id is one or two package ids ("a / b", or "a (component)"), or a design-file
 * citation with no catalogue entry at all. */
const PACKAGE_ID = /\b[a-z]+\.\d+\b/g;
function catalogueLegalFor(id: string): boolean {
  const ids = id.match(PACKAGE_ID) ?? [];
  if (ids.length === 0) return false; // a design-file citation — nothing in the catalogue to check
  return ids.every((packageId) => catalogue[packageId]?.legal === true);
}

describe('COPY_DELTAS', () => {
  it('every row’s `agrees` flag matches the rounded model against the design figure', () => {
    for (const row of COPY_DELTAS) {
      // agrees ⇔ the design's figure is the model to the lira (or exact for rates)
      expect({ id: row.id, agrees: Math.abs(row.model - row.design) < 0.5 }).toEqual({
        id: row.id,
        agrees: row.agrees,
      });
    }
  });
  it('every row’s `legal` flag matches the catalogue (W142(f)/W143 — the WP-C legal-review list)', () => {
    for (const row of COPY_DELTAS) {
      expect({ id: row.id, legal: catalogueLegalFor(row.id) }).toEqual({
        id: row.id,
        legal: row.legal,
      });
    }
  });
  it('lists exactly the six places where the page tasks must follow the model, not the design (W142(a)(c))', () => {
    expect(COPY_DELTAS.filter((r) => !r.agrees).map((r) => r.id)).toEqual([
      'Hiring Cost Calculator.dc.html:2588 (legalMin)',
      'home.299',
      'home.074 / home.082',
      'Hiring Cost Calculator.dc.html:2646 (mTotal, initial render)',
      'Hiring Cost Calculator.dc.html:2657 (yearTotal, initial render)',
      'Hiring Cost Calculator.dc.html:2718 (salary guide employer cost)',
    ]);
  });
});

describe('the generated bundle feeds the engine (Task 1 → Task 9 cross-check)', () => {
  // readFileSync is the sanctioned bypass of the D23 import rule for tests (W40) — the running
  // site reaches the bundle only through the adapter.
  const bundle = BundleSchema.parse(
    JSON.parse(
      readFileSync(join(__dirname, '../../../content/local/bundle.tr.json'), 'utf8'),
    ) as unknown,
  );
  const rate = getRateConfig(bundle);
  const roles = getCollection(bundle, 'calculatorRoles');

  it('the seeded row and role table equal the fixtures this suite computed with', () => {
    expect(rate).toEqual(RATE);
    expect(roles).toEqual(ROLES);
  });
  it('the ruled figures hold over the real data', () => {
    const welder = findRole(roles, 'welder');
    expect(welder && salaryFloor(welder, rate)).toBe(49545);
    expect(presets(roles).map((r) => r.multiplier)).toEqual([1, 1.5, 2]);
    expect(quotaCheck(25, 1, rate.quotaRatio).maxForeign).toBe(5);
    expect(effectiveFromLabel(rate, 'tr')).toBe('Ocak 2026');
    expect(effectiveFromLabel(rate, 'en')).toBe('January 2026');
  });
});
