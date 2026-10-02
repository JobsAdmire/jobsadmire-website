import type { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import {
  CAPS,
  DECLARATION_FIELD,
  HR_COUNTRY,
  HR_I_AM,
  hrAgencySchema,
  hrAgencyToFields,
  instituteSchema,
  instituteToFields,
  sourcingSchema,
  sourcingToFields,
} from '../forms';

/** The Operations catalog field names — v1.0 (`website-form-catalog.ts`) + the v1.1 additions of
 *  WP2a Task 8 (W16). The door silently DROPS any other name inside `fields`, so a typo loses
 *  data with a 200. */
const HIRE_CATALOG = [
  'name',
  'company',
  'email',
  'phone',
  'country',
  'iAm',
  'sector',
  'roleNeeded',
  'headcount',
  'startWhen',
  'message',
  'city',
];
const PARTNER_CATALOG = [
  'name',
  'company',
  'email',
  'phone',
  'country',
  'candidatesPerYear',
  'trades',
  'licence',
  'message',
  'city',
  'track',
];

/** The kernel's field-error codes for one input (`{}` when it parses). */
const codesOf = <S extends z.ZodTypeAny>(schema: S, input: unknown) => {
  const r = schema.safeParse(input);
  return r.success ? {} : fieldErrorsFromIssues(r.error.issues);
};

const hr = {
  company: 'Akdeniz İK A.Ş.',
  name: 'Ayşe Yılmaz',
  city: 'Antalya',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  message: 'Kaynakçı ve CNC operatörü',
};

describe('HR-agency track → hire (W3)', () => {
  it('maps onto hire catalog names only, forcing country TR and iAm hr_agency', () => {
    const fields = hrAgencyToFields(hrAgencySchema.parse(hr));
    expect(fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Akdeniz İK A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      country: 'TR',
      iAm: 'hr_agency',
      city: 'Antalya',
      message: 'Kaynakçı ve CNC operatörü',
    });
    expect(HR_COUNTRY).toBe('TR');
    expect(HR_I_AM).toBe('hr_agency');
    for (const key of Object.keys(fields)) expect(HIRE_CATALOG, key).toContain(key);
  });

  it('reads empty required fields as required before any format rule', () => {
    expect(
      codesOf(hrAgencySchema, { company: '', name: '', city: '', email: '', phone: '' }),
    ).toEqual({
      company: 'required',
      name: 'required',
      city: 'required',
      email: 'required',
      phone: 'required',
    });
  });

  it('flags a bad e-mail as email and a short phone as phone (the door needs 8 digits)', () => {
    expect(codesOf(hrAgencySchema, { ...hr, email: 'nope', phone: '12 34' })).toEqual({
      email: 'email',
      phone: 'phone',
    });
  });

  it('caps fields at the catalog lengths', () => {
    expect(
      codesOf(hrAgencySchema, {
        ...hr,
        company: 'x'.repeat(CAPS.company + 1),
        city: 'x'.repeat(CAPS.city + 1),
      }),
    ).toEqual({ company: 'max', city: 'max' });
  });

  it('sends an empty message when the textarea is blank or absent (buildEnvelope drops it)', () => {
    expect(hrAgencyToFields(hrAgencySchema.parse({ ...hr, message: '' })).message).toBe('');
    expect(hrAgencyToFields(hrAgencySchema.parse({ ...hr, message: undefined })).message).toBe('');
  });
});

const sourcing = {
  company: 'Karachi Manpower Ltd',
  name: 'Bilal Khan',
  country: 'pk',
  licence: 'OEP-1234',
  email: 'bilal@example.com',
  phone: '+92 300 1234567',
  candidatesPerYear: '250',
  trades: 'Welders, electricians — 20 a month',
  [DECLARATION_FIELD]: 'on',
};

describe('sourcing-partner track → partner + track sourcing (W3/W16)', () => {
  it('maps onto partner catalog names only, upper-cases the ISO-2 country, never sends the declaration', () => {
    const fields = sourcingToFields(sourcingSchema.parse(sourcing));
    expect(fields).toEqual({
      name: 'Bilal Khan',
      company: 'Karachi Manpower Ltd',
      email: 'bilal@example.com',
      phone: '+92 300 1234567',
      country: 'PK',
      track: 'sourcing',
      licence: 'OEP-1234',
      candidatesPerYear: '250',
      trades: 'Welders, electricians — 20 a month',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
    expect(DECLARATION_FIELD).toBe('licenceDeclaration');
    expect(PARTNER_CATALOG).not.toContain(DECLARATION_FIELD);
  });

  it('requires the licence declaration tick as its own field (W79: beside the consent, not instead)', () => {
    const unticked: Record<string, string> = { ...sourcing };
    delete unticked[DECLARATION_FIELD];
    expect(codesOf(sourcingSchema, unticked)).toEqual({ [DECLARATION_FIELD]: 'required' });
    expect(codesOf(sourcingSchema, { ...sourcing, [DECLARATION_FIELD]: 'yes' })).toEqual({
      [DECLARATION_FIELD]: 'invalid',
    });
  });

  it('rejects a free-text country (the door would 400) and reads the empty select as required', () => {
    expect(codesOf(sourcingSchema, { ...sourcing, country: 'Pakistan' })).toEqual({
      country: 'invalid',
    });
    expect(codesOf(sourcingSchema, { ...sourcing, country: '' })).toEqual({ country: 'required' });
  });

  it('requires the licence number and caps trades (500) and candidatesPerYear (20)', () => {
    expect(
      codesOf(sourcingSchema, {
        ...sourcing,
        licence: '',
        trades: 'x'.repeat(CAPS.trades + 1),
        candidatesPerYear: '1'.repeat(CAPS.candidatesPerYear + 1),
      }),
    ).toEqual({ licence: 'required', trades: 'max', candidatesPerYear: 'max' });
  });

  it('turns blank optionals into empty strings (buildEnvelope sends nothing for them)', () => {
    const fields = sourcingToFields(
      sourcingSchema.parse({ ...sourcing, candidatesPerYear: '', trades: '' }),
    );
    expect(fields.candidatesPerYear).toBe('');
    expect(fields.trades).toBe('');
  });
});

const institute = {
  company: 'Lahore Technical Institute',
  name: 'Sara Ahmed',
  city: 'Lahore',
  country: 'PK',
  email: 'sara@example.com',
  phone: '+92 42 1234567',
  candidatesPerYear: '',
  trades: 'Plumbing, HVAC — 60 graduates per batch',
};

describe('institute track → partner + track institute (W3/W16)', () => {
  it('maps city and country separately and sends track institute, no licence and no message', () => {
    const fields = instituteToFields(instituteSchema.parse(institute));
    expect(fields).toEqual({
      name: 'Sara Ahmed',
      company: 'Lahore Technical Institute',
      email: 'sara@example.com',
      phone: '+92 42 1234567',
      country: 'PK',
      track: 'institute',
      city: 'Lahore',
      candidatesPerYear: '',
      trades: 'Plumbing, HVAC — 60 graduates per batch',
    });
    for (const key of Object.keys(fields)) expect(PARTNER_CATALOG, key).toContain(key);
  });

  it('keeps city optional and country required (the design asked "City, country" in one box)', () => {
    expect(instituteSchema.safeParse({ ...institute, city: '' }).success).toBe(true);
    expect(codesOf(instituteSchema, { ...institute, country: '' })).toEqual({
      country: 'required',
    });
  });
});
