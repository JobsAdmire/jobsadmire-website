import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this task adds (W9/W23), relative to `sys`. */
export const VERIFY_SYS_KEYS = [
  'seo.verify.title',
  'seo.verify.description',
  'verify.hero.lead',
  'verify.lookup.hint',
  'verify.lookup.resultTitle',
  'verify.lookup.resultBody',
  'verify.lookup.whatsapp',
  'verify.empty.title',
  'verify.empty.body',
  'verify.faq.whoSigns',
  'verify.faq.howToCheck',
  'verify.steps.qr',
  'verify.steps.match',
  'verify.flags.qr', // W222 (2): red flag 2's body while the register is empty
  'verify.report.submit',
  'verify.record.close',
  'verify.record.former',
  'verify.register.tapToChange', // parity: the ≤ 700 register picker's pill
  'form.evidence.uploading',
  'form.evidence.attached',
  'form.evidence.remove',
  'form.evidence.tooBig',
  'form.evidence.badType',
  'form.evidence.refused',
  'form.evidence.failed',
  'form.evidence.tooMany',
  'form.evidence.wait',
] as const;

const read = (file: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, k) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
      file,
    );

const LOCALES = [
  ['tr', tr.sys],
  ['en', en.sys],
] as const;

describe('sys.verify / sys.seo.verify / sys.form.evidence (T10)', () => {
  for (const key of VERIFY_SYS_KEYS) {
    it(`${key}: a non-empty string in both locales, translated (not copied across)`, () => {
      const a = read(tr.sys, key);
      const b = read(en.sys, key);
      expect(typeof a, 'tr').toBe('string');
      expect(typeof b, 'en').toBe('string');
      expect((a as string).trim()).not.toBe('');
      expect((b as string).trim()).not.toBe('');
      expect(a).not.toBe(b);
    });
  }

  it('the ICU arguments the page passes are in both locales; {query} appears exactly once', () => {
    const tokens: Record<string, string[]> = {
      'verify.lookup.hint': ['{min}'],
      'verify.lookup.resultBody': ['{query}'],
      'form.evidence.uploading': ['{name}'],
      'form.evidence.attached': ['{name}'],
      'form.evidence.remove': ['{name}'],
      'form.evidence.tooBig': ['{name}', '{maxMb}'],
      'form.evidence.badType': ['{name}'],
      'form.evidence.refused': ['{name}'],
      'form.evidence.failed': ['{name}'],
      'form.evidence.tooMany': ['{max}'],
    };
    for (const [locale, sys] of LOCALES) {
      for (const [key, list] of Object.entries(tokens))
        for (const token of list) expect(read(sys, key), `${locale} ${key}`).toContain(token);
      expect((read(sys, 'verify.lookup.resultBody') as string).split('{query}')).toHaveLength(2);
    }
  });

  it('D17: no figure is typed into this copy — numbers arrive as arguments', () => {
    for (const [locale, sys] of LOCALES)
      for (const key of VERIFY_SYS_KEYS)
        expect(read(sys, key), `${locale} ${key}`).not.toMatch(/\d/);
  });

  it('§10 row 3: the name-less founder claims never carry the name the package strings embed', () => {
    for (const [, sys] of LOCALES)
      for (const key of ['verify.hero.lead', 'verify.faq.whoSigns'])
        expect(read(sys, key)).not.toMatch(/Haris|Jiva/);
  });

  it('W202: the SEO description fits a search snippet (≤ 160 characters, full sentences)', () => {
    for (const [locale, sys] of LOCALES) {
      const description = read(sys, 'seo.verify.description') as string;
      expect([...description].length, locale).toBeLessThanOrEqual(160);
      expect(description, locale).toMatch(/[.!?]$/);
      expect(description, locale).not.toMatch(/…|\.\.\./);
    }
  });

  it('W6: the lookup copy never gives the red verdict', () => {
    for (const [, sys] of LOCALES)
      expect(JSON.stringify(read(sys, 'verify.lookup'))).not.toMatch(
        /unauthori[sz]ed|authorised list|yetkisiz|yetkili listemizde/i,
      );
  });
});
