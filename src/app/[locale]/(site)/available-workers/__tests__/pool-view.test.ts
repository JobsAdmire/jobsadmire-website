import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROFILE_REF_PATTERN } from '../_lib/message';
import {
  activeFilterCount,
  fillSlots,
  filterPool,
  NO_FILTERS,
  popularIndustries,
  poolStats,
  sortPool,
} from '../_lib/pool-view';
import { SAMPLE_POOL } from '../_lib/sample-pool';
import { ROWS } from './pool-fixture';

const readJson = (path: string) =>
  JSON.parse(readFileSync(join(process.cwd(), path), 'utf8')) as Record<string, unknown>;
const catalogue = readJson('src/content/local/catalogue.json');
const bundles = ['tr', 'en'].map(
  (l) => readJson(`src/content/local/bundle.${l}.json`).strings as Record<string, string>,
);
const refs = (rows: { ref: string }[]) => rows.map((r) => r.ref);

describe('the sample pool (design pool(), ll. 1225–1240 — page-local, never the pool collection, D23)', () => {
  it('copies the design’s twelve profiles with unique public refs', () => {
    expect(SAMPLE_POOL).toHaveLength(12);
    expect(new Set(refs([...SAMPLE_POOL])).size).toBe(12);
    for (const r of SAMPLE_POOL) expect(r.ref).toMatch(PROFILE_REF_PATTERN);
  });

  it('names every word by a package id that both bundles carry, non-empty in Turkish (copy freeze)', () => {
    const ids = SAMPLE_POOL.flatMap((r) => [
      r.tradeId,
      r.countryId,
      r.industryId,
      r.langsId,
      ...r.tags.flatMap((t) => ('id' in t ? [t.id] : [])),
    ]);
    for (const id of ids) {
      expect(catalogue[id], id).toBeDefined();
      for (const strings of bundles) expect(strings[id]?.trim(), id).toBeTruthy();
    }
    // the one tag the package leaves untranslated is a brand name
    expect(SAMPLE_POOL.flatMap((r) => r.tags.filter((t) => 'brand' in t))).toEqual([
      { brand: 'Fanuc' },
    ]);
  });

  it('derives the design’s strip and chips: 7 ready, 8 countries, 11 professions; Construction 4 · Factory 4 · Hotel 3 · Agriculture 1', () => {
    expect(poolStats(ROWS)).toEqual({ ready: 7, countries: 8, trades: 11 });
    expect(popularIndustries(ROWS).map((p) => [p.label, p.count])).toEqual([
      ['Construction', 4],
      ['Factory', 4],
      ['Hotel', 3],
      ['Agriculture', 1],
    ]);
  });
});

describe('filterPool / sortPool (design ll. 1262–1290)', () => {
  it('filters by every field, by package id, and counts the active ones', () => {
    expect(filterPool(ROWS, NO_FILTERS)).toHaveLength(12);
    expect(refs(filterPool(ROWS, { ...NO_FILTERS, industry: 'availworkers.179' }))).toEqual([
      'JA-1103',
      'JA-1118',
      'JA-1155',
    ]);
    expect(refs(filterPool(ROWS, { ...NO_FILTERS, exp: '8+' }))).toEqual([
      'JA-1058',
      'JA-1094',
      'JA-1162',
    ]);
    expect(refs(filterPool(ROWS, { ...NO_FILTERS, lang: 'tr' }))).toEqual([
      'JA-1077',
      'JA-1103',
      'JA-1126',
      'JA-1155',
    ]);
    expect(filterPool(ROWS, { ...NO_FILTERS, avail: 'now' })).toHaveLength(7);
    expect(filterPool(ROWS, { ...NO_FILTERS, avail: '30' })).toHaveLength(11);
    const none = { ...NO_FILTERS, trade: 'availworkers.156', country: 'availworkers.171' };
    expect(filterPool(ROWS, none)).toEqual([]);
    expect(activeFilterCount(none)).toBe(2);
    expect(activeFilterCount(NO_FILTERS)).toBe(0);
  });

  it('sorts soonest-available (then most experience) by default, and by experience, recency, A–Z', () => {
    expect(refs(sortPool(ROWS, 'avail', 'en')).slice(0, 4)).toEqual([
      'JA-1058',
      'JA-1094',
      'JA-1147',
      'JA-1042',
    ]);
    expect(sortPool(ROWS, 'exp', 'en')[0].ref).toBe('JA-1162');
    expect(refs(sortPool(ROWS, 'new', 'en')).slice(0, 4)).toEqual([
      'JA-1042',
      'JA-1077',
      'JA-1103',
      'JA-1147',
    ]);
    expect(sortPool(ROWS, 'az', 'en')[0].trade).toBe('CNC Operator');
  });

  it('fillSlots fills the raw sys templates and leaves an unknown slot alone', () => {
    expect(fillSlots('{total} eşleşmeden {shown} gösteriliyor', { shown: 9, total: 12 })).toBe(
      '12 eşleşmeden 9 gösteriliyor',
    );
    expect(fillSlots('{count} more {x}', { count: 3 })).toBe('3 more {x}');
  });
});
