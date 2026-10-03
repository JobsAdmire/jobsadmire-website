import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';
import { WA_TAILS, waPrefill } from '../prefill';
import { sysFor } from './helpers';

/** The page's id-less copy (W9/W23) — the frozen key set both message files carry. */
const SYS_WP_KEYS = [
  'documents.count',
  'faq.emailSubject',
  'faq.exemptionAnswer',
  'hero.updated',
  'sample.foreignerId',
  'sample.label',
  'sample.validity',
  'whatsapp.exemption',
  'whatsapp.permitOnly',
  'whatsapp.permitType',
  'whatsapp.question',
  'whatsapp.quote',
  'whatsapp.renewal',
  'wizard.options.abroad',
  'wizard.options.atLeast',
  'wizard.options.below',
  'wizard.options.no',
  'wizard.options.yes',
  'wizard.points.ratio',
  'wizard.prefill.intro',
  'wizard.prefill.result',
  'wizard.progress',
  'wizard.progressLabel',
];

type Tree = Record<string, unknown>;
const flatten = (o: Tree, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const sysOf = (file: unknown) => (file as { sys: Tree }).sys;
const wp = (file: unknown) => sysOf(file).wp as Tree;
const leaf = (file: unknown, path: string) =>
  path.split('.').reduce<unknown>((o, k) => (o as Tree)[k], wp(file)) as string;

describe('sys.wp.* and sys.seo.wp.* (W9/W23)', () => {
  it('carry the pinned key sets, identical in both locales', () => {
    expect(flatten(wp(tr)).sort()).toEqual([...SYS_WP_KEYS].sort());
    expect(flatten(wp(en)).sort()).toEqual([...SYS_WP_KEYS].sort());
    for (const file of [tr, en])
      expect(flatten((sysOf(file).seo as Tree).wp as Tree).sort()).toEqual([
        'description',
        'title',
      ]);
  });

  it('W2: the wizard ratio point makes no timing claim', () => {
    expect(leaf(en, 'wizard.points.ratio')).not.toMatch(
      /\b(month|months|7th|day|days|week|weeks)\b/i,
    );
    expect(leaf(tr, 'wizard.points.ratio')).not.toMatch(/(\bay\b|ayından|gün|hafta|7\.)/iu);
  });

  it('D17: the ratio, the month and the counts arrive as ICU values — no typed figure', () => {
    for (const file of [tr, en]) {
      for (const key of ['wizard.options.atLeast', 'wizard.options.below', 'wizard.points.ratio'])
        expect(leaf(file, key)).toContain('{ratio}');
      expect(leaf(file, 'wizard.points.ratio').replace('1:{ratio}', '')).not.toMatch(/\d/);
      expect(leaf(file, 'hero.updated')).toContain('{month}');
      expect(leaf(file, 'hero.updated')).not.toMatch(/\d/);
      expect(leaf(file, 'documents.count')).toContain('{n');
    }
  });

  it('W154: the company is "JobsAdmire"; the WhatsApp tails continue the visitor-voice greeting', () => {
    for (const file of [tr, en]) expect(leaf(file, 'hero.updated')).toContain('JobsAdmire');
    expect(waPrefill(sysFor('tr'), 'permitOnly')).toBe(
      'Merhaba JobsAdmire, kendi işçim var — çalışma iznini siz yürütebilir misiniz?',
    );
    expect(waPrefill(sysFor('en'), 'question')).toBe(
      'Hello JobsAdmire, I have a work permit question.',
    );
    // after "Merhaba JobsAdmire, " the Turkish tail starts lower-case
    for (const tail of WA_TAILS) expect(leaf(tr, `whatsapp.${tail}`)).toMatch(/^\p{Ll}/u);
    expect(leaf(tr, 'wizard.prefill.intro')).toMatch(/^\p{Ll}/u);
  });
});
