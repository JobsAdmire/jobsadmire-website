import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { DESCRIPTION_MIN, fraudFields, fraudSchema } from '../fraud';

const OK = {
  suspectName: '',
  suspectContact: '',
  description: 'A man calling himself a JobsAdmire agent asked me for a 500 USD visa deposit.',
  reporterName: 'Ayşe Yılmaz',
  reporterEmail: 'Ayse@Example.com',
  reporterPhone: '',
};

const codes = (input: Record<string, unknown>) => {
  const r = fraudSchema.safeParse(input);
  return r.success ? {} : fieldErrorsFromIssues(r.error.issues);
};

describe('fraudSchema — the site is stricter than the door, never looser (W3, V-2)', () => {
  it('accepts the minimal report: name + e-mail + a ≥ 20-character description', () => {
    expect(fraudSchema.safeParse(OK).success).toBe(true);
    expect(DESCRIPTION_MIN).toBe(20);
  });

  it('description: empty → required, short → min, over the catalog cap → max', () => {
    expect(codes({ ...OK, description: '' })).toEqual({ description: 'required' });
    expect(codes({ ...OK, description: 'too short' })).toEqual({ description: 'min' });
    expect(codes({ ...OK, description: 'x'.repeat(5001) })).toEqual({ description: 'max' });
  });

  it('reporter name and e-mail are required; a malformed e-mail reads email', () => {
    expect(codes({ ...OK, reporterName: '' })).toEqual({ reporterName: 'required' });
    expect(codes({ ...OK, reporterEmail: '' })).toEqual({ reporterEmail: 'required' });
    expect(codes({ ...OK, reporterEmail: 'not-an-email' })).toEqual({ reporterEmail: 'email' });
  });

  it('reporter phone is optional but, when given, needs ≥ 8 digits (the door rule)', () => {
    expect(fraudSchema.safeParse({ ...OK, reporterPhone: '+90 501 124 03 40' }).success).toBe(true);
    expect(codes({ ...OK, reporterPhone: '123' })).toEqual({ reporterPhone: 'phone' });
  });

  it('the suspect fields are optional and capped at the catalog lengths', () => {
    expect(codes({ ...OK, suspectName: 'x'.repeat(201) })).toEqual({ suspectName: 'max' });
    expect(codes({ ...OK, suspectContact: 'x'.repeat(301) })).toEqual({ suspectContact: 'max' });
  });
});

describe('fraudSchema — evidenceKeys (W101: one hidden input per uploaded file)', () => {
  const KEY = 'website-fraud/5f0c.png';

  it('absent → [], one → [key], several → the array, empty values dropped', () => {
    expect(fraudSchema.parse(OK).evidenceKeys).toEqual([]);
    expect(fraudSchema.parse({ ...OK, evidenceKeys: KEY }).evidenceKeys).toEqual([KEY]);
    expect(
      fraudSchema.parse({ ...OK, evidenceKeys: [KEY, '', 'website-fraud/b.pdf'] }).evidenceKeys,
    ).toEqual([KEY, 'website-fraud/b.pdf']);
  });

  it('a fourth key is max; a key the door never issued is invalid', () => {
    const four = ['a', 'b', 'c', 'd'].map((x) => `website-fraud/${x}.png`);
    expect(codes({ ...OK, evidenceKeys: four })).toEqual({ evidenceKeys: 'max' });
    expect(codes({ ...OK, evidenceKeys: '../careers-cv/x.pdf' })).toEqual({
      evidenceKeys: 'invalid',
    });
  });
});

describe('fraudFields → the exact catalog names', () => {
  it('sends only the fraud catalog names, evidenceKeys as an array', () => {
    const fields = fraudFields(
      fraudSchema.parse({ ...OK, evidenceKeys: ['website-fraud/a.png', 'website-fraud/b.pdf'] }),
    );
    expect(Object.keys(fields)).toEqual([
      'reporterName',
      'reporterEmail',
      'reporterPhone',
      'suspectName',
      'suspectContact',
      'description',
      'evidenceKeys',
    ]);
    expect(fields.evidenceKeys).toEqual(['website-fraud/a.png', 'website-fraud/b.pdf']);
    // the door lower-cases e-mails; the site does not pre-empt it
    expect(fields.reporterEmail).toBe('Ayse@Example.com');
  });
});
