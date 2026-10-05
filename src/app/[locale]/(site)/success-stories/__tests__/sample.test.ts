import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { BundleSchema, type Bundle } from '../../../../../../contract/website-bundle.v1';
import {
  SAMPLE_APPROVALS,
  SAMPLE_HERO_STATS,
  SAMPLE_KPIS,
  SAMPLE_QUOTES,
  SAMPLE_REDACT,
  WALL_SECTOR_OF,
  WALL_SECTORS,
} from '../_lib/sample';

// readFileSync, never an import: `**/content/local/*` is import-banned in src/** (the D23 rule).
const bundle = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

/** Every package id the page-local sample reads (COPY IS FROZEN: ids only, never design text). */
const IDS = [
  'success.124',
  ...WALL_SECTORS.map((s) => s.labelId),
  ...SAMPLE_APPROVALS.map((a) => a.rolesId),
  ...SAMPLE_HERO_STATS.flatMap((s) => [s.labelId, ...(s.unitId ? [s.unitId] : [])]),
  ...SAMPLE_KPIS.flatMap((k) => [k.labelId, k.bodyId, ...('id' in k.figure ? [k.figure.id] : [])]),
  ...SAMPLE_QUOTES.flatMap((q) => [q.quoteId, q.roleId, q.orgId]),
];

describe('the page-local sample (parity pass, owner 2026-10-05; D23: never a fixture)', () => {
  it.each(['tr', 'en'] as const)(
    'every sample package id exists, non-empty, in the %s bundle',
    (l) => {
      const strings = bundle(l).strings;
      for (const id of IDS) expect(strings[id], id).toMatch(/\S/);
    },
  );

  it('every sample country is a known ISO-2 code of the countries collection', () => {
    const codes = new Set(
      bundle('tr').collections.countries?.map((c) => (c as { code: string }).code),
    );
    for (const a of SAMPLE_APPROVALS)
      for (const c of a.countries) expect(codes.has(c), c).toBe(true);
  });

  it('the nine design approvals: unique ids, full dates, headcounts summing to the hero’s 288', () => {
    expect(SAMPLE_APPROVALS).toHaveLength(9);
    expect(new Set(SAMPLE_APPROVALS.map((a) => a.id)).size).toBe(9);
    for (const a of SAMPLE_APPROVALS) expect(a.approvedAt).toMatch(/^\d{4}-\d{2}-01$/);
    expect(SAMPLE_APPROVALS.reduce((n, a) => n + a.headcount, 0)).toBe(288);
  });

  it('every design chip carries at least one sample approval, so no chip opens on an empty wall', () => {
    for (const s of WALL_SECTORS) {
      expect(
        SAMPLE_APPROVALS.some((a) => a.sector === s.id),
        s.id,
      ).toBe(true);
    }
  });

  it('files every site sector under a design chip (or none, for `other`)', () => {
    const chips = new Set<string>(WALL_SECTORS.map((s) => s.id));
    expect(Object.keys(WALL_SECTOR_OF).sort()).toEqual([...SECTOR_KEYS].sort());
    for (const v of Object.values(WALL_SECTOR_OF)) if (v !== null) expect(chips.has(v)).toBe(true);
    expect(WALL_SECTOR_OF.other).toBeNull();
  });

  it('the redaction bars stay inside the frame', () => {
    for (const b of SAMPLE_REDACT) {
      expect(b.x + b.w).toBeLessThanOrEqual(100);
      expect(b.y + b.h).toBeLessThanOrEqual(100);
    }
  });
});
