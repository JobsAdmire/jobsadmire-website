import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { PARTNER_PACKAGE_IDS, PARTNER_SYS_KEYS } from '../content';

// D23/R56: src/** never imports src/content/local/*; a test reads the generated bundles from disk.
const stringsOf = (locale: 'tr' | 'en') =>
  (
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ) as { strings: Record<string, string> }
  ).strings;
const TR = stringsOf('tr');
const EN = stringsOf('en');

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const leaf = (o: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, k) => (acc && typeof acc === 'object' ? (acc as Tree)[k] : undefined),
      o,
    );
const partnerOf = (file: unknown) => (file as { sys: Tree }).sys.partner as Tree;
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `partner.${String(from + i).padStart(3, '0')}`);

describe('PARTNER_PACKAGE_IDS', () => {
  it('lists 162 distinct partner ids, first partner.002, last partner.223', () => {
    expect(new Set(PARTNER_PACKAGE_IDS).size).toBe(PARTNER_PACKAGE_IDS.length);
    expect(PARTNER_PACKAGE_IDS).toHaveLength(162);
    for (const id of PARTNER_PACKAGE_IDS) expect(id).toMatch(/^partner\.\d{3}$/);
    expect(PARTNER_PACKAGE_IDS[0]).toBe('partner.002');
    expect(PARTNER_PACKAGE_IDS[PARTNER_PACKAGE_IDS.length - 1]).toBe('partner.223');
  });

  it('exists with a non-empty value in both generated bundles (an unknown id throws in dev)', () => {
    for (const id of PARTNER_PACKAGE_IDS) {
      expect(TR[id], `${id} (tr)`).toBeTruthy();
      expect(EN[id], `${id} (en)`).toBeTruthy();
    }
  });

  it('never reads the chrome ids (R15), the header CTA pair (W17) or the ids the deltas retire', () => {
    const notRead = [
      'partner.001',
      ...range(3, 7),
      ...range(9, 15),
      ...range(17, 22), // chrome labels + the CTA_BY_PATHNAME pair 017/018 (R15/W17)
      'partner.034', // hero photo alt — gradient hero (§10 #4)
      'partner.037',
      'partner.039',
      'partner.045', // captions of the unsigned 5+/20+/25+ figures (W1)
      'partner.088',
      'partner.089', // inline success banner → /tesekkurler (D13)
      'partner.090',
      'partner.091', // the KVKK sentence → the kernel consent (W79)
      'partner.135', // "City, country" → city + the ISO-2 select
      'partner.162',
      'partner.163', // store micro-copy → StoreBadges reads hire.240 (W7)
      ...range(191, 221), // footer chrome (R15)
    ];
    expect(notRead).toHaveLength(61);
    for (const id of notRead) expect(PARTNER_PACKAGE_IDS, id).not.toContain(id);
    // 223 − 61 = 162: every other partner id is read by this page.
    expect([...notRead, ...PARTNER_PACKAGE_IDS].sort()).toEqual(range(1, 223));
  });

  it('carries the W87 re-authored metric spellings in both locales', () => {
    for (const s of [TR, EN]) {
      expect(s['partner.059']).toContain('{replySlaHours}');
      expect(s['partner.077']).toContain('{countries}');
      expect(s['partner.077']).not.toMatch(/12/);
    }
  });
});

describe('sys.partner', () => {
  it('has exactly the page keys, identical in both locales, never empty and never English in TR', () => {
    const trKeys = flatten(partnerOf(tr)).sort();
    expect(trKeys).toEqual([...PARTNER_SYS_KEYS].sort());
    expect(flatten(partnerOf(en)).sort()).toEqual(trKeys);
    for (const key of PARTNER_SYS_KEYS) {
      const t = leaf(partnerOf(tr), key);
      const e = leaf(partnerOf(en), key);
      expect(typeof t === 'string' && t.trim().length > 0, `${key} (tr)`).toBe(true);
      expect(typeof e === 'string' && e.trim().length > 0, `${key} (en)`).toBe(true);
      expect(t, key).not.toBe(e);
    }
  });

  it('writes both WhatsApp prefills in the visitor voice, addressed to JobsAdmire (static text, W95)', () => {
    for (const [file, hello] of [
      [tr, 'Merhaba JobsAdmire'],
      [en, 'Hello JobsAdmire'],
    ] as const) {
      expect(String(leaf(partnerOf(file), 'whatsapp.prefill')).startsWith(hello)).toBe(true);
      expect(String(leaf(partnerOf(file), 'faq.whatsappText')).startsWith(hello)).toBe(true);
    }
  });
});
