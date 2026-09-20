import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fieldErrorsFromIssues, isFormErrorCode, issueToCode } from '../errors';

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(1).email(),
  phone: z.string().regex(/(\D*\d){8,}/, { message: 'phone' }),
  site: z.string().url().optional(),
  headcount: z.string().min(1),
  message: z.string().min(20).max(5000),
  iAm: z.enum(['direct_employer', 'hr_agency']),
  cv: z.string().min(1, { message: 'file' }),
});

describe('issueToCode / fieldErrorsFromIssues', () => {
  it('maps the common Zod issues to sys.form.errors.* codes, first issue per field', () => {
    const r = schema.safeParse({
      name: '',
      email: 'not-an-email',
      phone: '12',
      site: 'nope',
      message: 'short',
      iAm: '',
      cv: '',
    });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(fieldErrorsFromIssues(r.error.issues)).toEqual({
      name: 'required',
      email: 'email',
      phone: 'phone',
      site: 'url',
      headcount: 'required',
      message: 'min',
      iAm: 'required',
      cv: 'file',
    });
  });

  it('reads a schema message that is itself a code, and falls back to invalid otherwise', () => {
    const r = z.object({ a: z.string().max(2), b: z.number() }).safeParse({ a: 'abc', b: 'x' });
    if (r.success) throw new Error('expected failure');
    expect(r.error.issues.map(issueToCode)).toEqual(['max', 'invalid']);
    expect(isFormErrorCode('phone')).toBe(true);
    expect(isFormErrorCode('Required')).toBe(false);
  });

  it('names a root-level issue _form', () => {
    const r = z.string().safeParse(5);
    if (r.success) throw new Error('expected failure');
    expect(fieldErrorsFromIssues(r.error.issues)).toEqual({ _form: 'invalid' });
  });
});
