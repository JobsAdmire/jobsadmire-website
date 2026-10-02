import { describe, expect, it } from 'vitest';
import { assertServableInProduction } from '@/content/pure';
import { readRegister, RegisterError } from '../register';
import { localBundle } from './bundles';
import { FORMER_REP, FOUNDER_REP, OFFICE_REP } from './fixtures';

const EMPTY = { rows: [], active: [], former: [], founder: null, updatedAt: null };

describe('readRegister — Phase A is the designed empty state (W6, §10 row 11)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: the committed bundle has no representatives key, so the register is empty`, () => {
      const bundle = localBundle(locale);
      expect(bundle.collections).not.toHaveProperty('representatives');
      expect(readRegister(bundle)).toEqual(EMPTY);
    });
  }
});

describe('D23 — the representatives fixture is never served in production', () => {
  it('a LOCAL bundle carrying a row is refused in production; OPS and development serve it', () => {
    const bundle = localBundle('tr', { representatives: [FOUNDER_REP] });
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'production')).toThrow(
      /never served from LOCAL/,
    );
    expect(() => assertServableInProduction(bundle, 'OPS', 'production')).not.toThrow();
    expect(() => assertServableInProduction(bundle, 'LOCAL', 'development')).not.toThrow();
  });

  it('both committed bundles pass the production guard as they are', () => {
    for (const locale of ['tr', 'en'] as const)
      expect(() =>
        assertServableInProduction(localBundle(locale), 'LOCAL', 'production'),
      ).not.toThrow();
  });
});

describe('readRegister — the v1.1 rows', () => {
  it('parses the rows, splits active/former, finds the signing founder and the latest update', () => {
    const r = readRegister(
      localBundle('en', { representatives: [FOUNDER_REP, OFFICE_REP, FORMER_REP] }),
    );
    expect(r.rows).toHaveLength(3);
    expect(r.active.map((x) => x.id)).toEqual(['JA-REP-001', 'JA-OPS-004']);
    expect(r.former.map((x) => x.id)).toEqual(['JA-REP-018']);
    expect(r.founder?.id).toBe('JA-REP-001');
    expect(r.updatedAt).toBe('2026-07-29T08:00:00.000Z');
  });

  it('fails closed: an unknown status is a schema miss — thrown outside production, dropped in it', () => {
    const bundle = localBundle('en', {
      representatives: [{ ...FOUNDER_REP, status: 'whatever' }],
    });
    expect(() => readRegister(bundle, 'test')).toThrow(RegisterError);
    expect(readRegister(bundle, 'production')).toEqual(EMPTY);
  });

  it('a suspended founder, or one who may not sign, is not the founder', () => {
    const suspended = { ...FOUNDER_REP, status: 'suspended' as const };
    const noSign = { ...FOUNDER_REP, canSign: false };
    expect(readRegister(localBundle('en', { representatives: [suspended] })).founder).toBeNull();
    expect(readRegister(localBundle('en', { representatives: [noSign] })).founder).toBeNull();
  });
});
