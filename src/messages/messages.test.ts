import { describe, expect, it } from 'vitest';
import en from './en.json';
import tr from './tr.json';

/** Every leaf path of a message object, `a.b.c` style. */
function leaves(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? leaves(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

/** W30: every field name the ten catalog forms use (v1 + Task 8's v1.1) has a label. */
const LABELS = [
  'name',
  'email',
  'phone',
  'company',
  'city',
  'country',
  'sector',
  'headcount',
  'startWhen',
  'roleNeeded',
  'message',
  'subject',
  'iAm',
  'preferredTime',
  'cv',
  'consent',
  'reporterName',
  'reporterEmail',
  'reporterPhone',
  'suspectName',
  'suspectContact',
  'description',
  'evidence',
  'office',
  'preferredDate',
  'trade',
  'candidatesPerYear',
  'trades',
  'licence',
  'durationMonths',
  'track',
  'topic',
  'portfolioUrl',
  'expectedSalary',
  'expectedSalaryCurrency',
  'currentSalary',
  'currentSalaryCurrency',
  'coverLetter',
  'linkedinUrl',
  'language',
  'openingSlug',
  'estimateSummary',
];
const PLACEHOLDERS = [
  'name',
  'email',
  'phone',
  'company',
  'city',
  'headcount',
  'roleNeeded',
  'message',
  'subject',
  'select',
  'description',
  'trade',
  'trades',
  'licence',
  'candidatesPerYear',
  'durationMonths',
  'portfolioUrl',
  'linkedinUrl',
  'expectedSalary',
  'coverLetter',
  'language',
  'suspectName',
  'suspectContact',
  'reporterName',
  'reporterEmail',
  'reporterPhone',
  'preferredDate',
  'preferredTime',
];
const HINTS = [
  'phone',
  'cv',
  'evidence',
  'optional',
  'description',
  'portfolioUrl',
  'linkedinUrl',
  'expectedSalary',
];
const ERRORS = [
  'required',
  'email',
  'phone',
  'min',
  'max',
  'url',
  'file',
  'consent',
  'captcha',
  'invalid',
  'form',
];
const FALLBACK_KINDS = [
  'captcha',
  'off',
  'tripped',
  'unauthorized',
  'unavailable',
  'failed',
  'invalid',
];

describe('src/messages — sys.* parity (W9/W23)', () => {
  it('tr and en carry exactly the same key set', () => {
    expect(leaves(tr).sort()).toEqual(leaves(en).sort());
  });

  it('carries every sys.form.* key the forms kernel reads (W30)', () => {
    const keys = new Set(leaves(tr));
    const expectKey = (k: string) => expect(keys.has(k), k).toBe(true);
    for (const k of LABELS) expectKey(`sys.form.labels.${k}`);
    for (const k of PLACEHOLDERS) expectKey(`sys.form.placeholders.${k}`);
    for (const k of HINTS) expectKey(`sys.form.hints.${k}`);
    for (const k of ERRORS) expectKey(`sys.form.errors.${k}`);
    for (const kind of FALLBACK_KINDS) {
      expectKey(`sys.form.fallback.${kind}.title`);
      expectKey(`sys.form.fallback.${kind}.body`);
    }
    for (const k of [
      'sys.form.consent.label',
      'sys.form.consent.notice',
      'sys.form.submit.default',
      'sys.form.submit.sending',
      'sys.form.honeypot',
      'sys.form.fallback.whatsapp',
      'sys.form.fallback.call',
      'sys.form.fallback.email',
      'sys.form.fallback.whatsappIntro',
    ])
      expectKey(k);
  });

  it('no sys.form leaf is empty in either file, and the consent copy carries the <link> tag', () => {
    for (const file of [tr, en]) {
      const form = file.sys.form as Record<string, unknown>;
      for (const path of leaves(form)) {
        const value = path
          .split('.')
          .reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], form);
        expect(typeof value === 'string' && value.trim().length > 0, `sys.form.${path}`).toBe(true);
      }
      expect(file.sys.form.consent.label).toMatch(/<link>.+<\/link>/);
      expect(file.sys.form.consent.notice).toMatch(/<link>.+<\/link>/);
    }
  });
});
