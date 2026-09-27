import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FLAG_CODES, isFlagCode } from '../flag-codes';
import {
  isSourceMapCode,
  SOURCE_MAP_CODES,
  SOURCE_MAP_POINTS,
  sourceMapLabels,
  TURKIYE_POINT,
} from '../source-map-codes';

type Row = { code: string; name: string; lon: number; lat: number };
const bundle = JSON.parse(
  readFileSync(join(__dirname, '..', '..', '..', 'content', 'local', 'bundle.tr.json'), 'utf8'),
) as { collections: { sourceCountries: Row[] } };
const rows = bundle.collections.sourceCountries;

describe('source-map codes (W40: one code set, upper-case ISO2, shared with T0b)', () => {
  it('equals the importer’s sourceCountries codes, in order', () => {
    expect(rows.map((r) => r.code)).toEqual([...SOURCE_MAP_CODES]);
    expect(SOURCE_MAP_CODES).toHaveLength(13); // W1: source-map.js's 12 + LK
    expect(SOURCE_MAP_CODES).toContain('LK');
    expect(SOURCE_MAP_CODES).toContain('SN'); // Senegal stays
    for (const code of SOURCE_MAP_CODES) expect(code).toMatch(/^[A-Z]{2}$/);
  });

  it('plots every country at the importer’s coordinates (source-map.js + Sri Lanka)', () => {
    for (const r of rows) {
      expect(isSourceMapCode(r.code)).toBe(true);
      if (!isSourceMapCode(r.code)) continue;
      expect(SOURCE_MAP_POINTS[r.code].lon).toBe(r.lon);
      expect(SOURCE_MAP_POINTS[r.code].lat).toBe(r.lat);
      expect(SOURCE_MAP_POINTS[r.code].atlasId).toMatch(/^\d{3}$/); // ISO 3166-1 numeric
    }
    expect(TURKIYE_POINT).toEqual({ lon: 35.2, lat: 39.0, atlasId: '792' });
  });

  it('builds the SourceMap labels from the collection rows', () => {
    const labels = sourceMapLabels(rows);
    expect(Object.keys(labels)).toEqual([...SOURCE_MAP_CODES]);
    expect(labels.UZ).toBe('Özbekistan');
    expect(labels.LK).toBe('Sri Lanka');
    // A missing row is a defect in every environment but production (makeT's own rule).
    expect(() => sourceMapLabels(rows.filter((r) => r.code !== 'ML'))).toThrow(/ML/);
  });

  it('FLAG_CODES = the source countries + TR, guarded for Task 1’s `code: string` rows', () => {
    expect(FLAG_CODES).toEqual([...SOURCE_MAP_CODES, 'TR']);
    expect(FLAG_CODES).toHaveLength(14);
    expect(isFlagCode('PK')).toBe(true);
    expect(isFlagCode('TR')).toBe(true);
    expect(isFlagCode('pk')).toBe(false); // W40: never lower-case
    expect(isFlagCode('GH')).toBe(false); // W1: Ghana is out
  });
});
