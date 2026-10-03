import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { FormActionError } from '@/forms/types';
import { fullSchema, fullToFields, quickSchema, quickToFields } from '../hire-spec';

const countries = [
  { code: 'TR', name: 'Türkiye', dial: '+90' },
  { code: 'DE', name: 'Almanya', dial: '+49' },
];

describe('quickSchema / quickToFields (hero quick-quote → `hire`)', () => {
  const ok = {
    company: 'Acme Tekstil A.Ş.',
    name: 'Ayşe Yılmaz',
    city: 'Bursa',
    roleNeeded: 'kaynakçı, paketleme',
    headcount: '12',
    phone: '0532 000 00 00',
    email: 'AYSE@ACME.COM.TR',
  };

  it('accepts the designed fields plus the W3 contact name', () => {
    expect(quickSchema.safeParse(ok).success).toBe(true);
  });

  it('reads empty values as `required` before any format rule (email, phone, headcount)', () => {
    const r = quickSchema.safeParse({ ...ok, name: '', email: '', phone: '', headcount: '' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({
        name: 'required',
        email: 'required',
        phone: 'required',
        headcount: 'required',
      });
  });

  it('flags a bad email as `email`, a short phone as `phone`, a non-integer headcount as `invalid`', () => {
    const r = quickSchema.safeParse({ ...ok, email: 'nope', phone: '12 34', headcount: '10-15' });
    expect(r.success).toBe(false);
    if (!r.success)
      expect(fieldErrorsFromIssues(r.error.issues)).toMatchObject({
        email: 'email',
        phone: 'phone',
        headcount: 'invalid',
      });
  });

  it('maps onto the exact catalog names and normalises the phone', () => {
    expect(quickToFields(quickSchema.parse(ok))).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Acme Tekstil A.Ş.',
      email: 'AYSE@ACME.COM.TR', // the door lower-cases; the website sends what was typed
      phone: '+905320000000',
      city: 'Bursa',
      roleNeeded: 'kaynakçı, paketleme',
      headcount: '12',
    });
  });
});

describe('fullSchema / fullToFields (request form → `hire`)', () => {
  const ok = {
    company: 'Acme',
    name: 'Mehmet Kaya',
    email: 'mehmet@acme.com',
    dial: 'TR',
    phone: '532 000 00 00',
    sector: 'factory',
    roleNeeded: 'welder',
    headcount: '5',
    city: '',
    startWhen: '',
    message: '',
  };

  it('accepts a minimal valid submission (city, startWhen, message optional)', () => {
    expect(fullSchema.safeParse(ok).success).toBe(true);
  });

  it('accepts the shared W78 startWhen keys and refuses a retired page-local one', () => {
    for (const key of ['asap', 'month1', 'months1to3', 'planning'])
      expect(fullSchema.safeParse({ ...ok, startWhen: key }).success).toBe(true);
    const r = fullSchema.safeParse({ ...ok, startWhen: '1-2m' });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFromIssues(r.error.issues).startWhen).toBe('invalid');
  });

  it('refuses a sector label or a malformed dial (W3/W77: stable keys only)', () => {
    const r = fullSchema.safeParse({ ...ok, sector: 'Fabrika / Üretim', dial: 'ZZZ' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('invalid');
      expect(errors.dial).toBe('invalid');
    }
  });

  it('reads an empty sector select as `required` and a 33-character phone as `max`', () => {
    const r = fullSchema.safeParse({ ...ok, sector: '', phone: '5'.repeat(33) });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errors = fieldErrorsFromIssues(r.error.issues);
      expect(errors.sector).toBe('required');
      expect(errors.phone).toBe('max');
    }
  });

  it('composes dial + phone into one value and omits empty optionals', () => {
    expect(fullToFields(fullSchema.parse(ok), countries)).toEqual({
      name: 'Mehmet Kaya',
      company: 'Acme',
      email: 'mehmet@acme.com',
      phone: '+905320000000',
      sector: 'factory',
      roleNeeded: 'welder',
      headcount: '5',
    });
  });

  it('sends city (catalog v1.1), startWhen and message when present', () => {
    const fields = fullToFields(
      fullSchema.parse({ ...ok, city: 'Antalya', startWhen: 'month1', message: 'Night shift.' }),
      countries,
    );
    expect(fields).toMatchObject({ city: 'Antalya', startWhen: 'month1', message: 'Night shift.' });
  });

  it('throws a field-scoped FormActionError when the dial code is not in the countries list', () => {
    const parsed = fullSchema.parse({ ...ok, dial: 'XX' });
    expect(() => fullToFields(parsed, countries)).toThrow(FormActionError);
    try {
      fullToFields(parsed, countries);
    } catch (e) {
      expect((e as FormActionError).field).toEqual({ name: 'dial', code: 'invalid' });
    }
  });
});
