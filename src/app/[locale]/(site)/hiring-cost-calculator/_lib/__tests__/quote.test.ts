import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { RATE, ROLES } from '@/lib/calculator/__tests__/fixtures';
import tr from '@/messages/tr.json';
import { ESTIMATE_FIELDS } from '../estimate-inputs';
import { CALCULATOR_FIELD_NAMES, quoteSchema, toCalculatorFields } from '../quote';

const sys = createTranslator({ locale: 'tr', messages: tr as Messages, namespace: 'sys' });
const t = (id: string) => `<${id}>`;
const ctx = { locale: 'tr' as const, roles: ROLES, rateConfig: RATE, t, sys };

describe('quoteSchema', () => {
  it('requires name and e-mail; an empty e-mail reads "required", not "email"', () => {
    const r = quoteSchema.safeParse({ name: '', email: '' });
    expect(r.success).toBe(false);
    expect(fieldErrorsFromIssues(r.success ? [] : r.error.issues)).toEqual({
      name: 'required',
      email: 'required',
    });
  });
  it('accepts the optional fields empty; refuses a phone under 8 digits and a non-ISO country', () => {
    expect(
      quoteSchema.safeParse({ name: 'Ayşe', email: 'a@b.co', phone: '', company: '', country: '' })
        .success,
    ).toBe(true);
    const bad = quoteSchema.safeParse({
      name: 'Ayşe',
      email: 'a@b.co',
      phone: '12 34',
      country: 'Turkey',
    });
    expect(fieldErrorsFromIssues(bad.success ? [] : bad.error.issues)).toEqual({
      phone: 'phone',
      country: 'invalid',
    });
  });
});

describe('toCalculatorFields — the catalog names, keys on the wire (W77), the summary recomputed', () => {
  it('sends exactly the ten catalog names; trade is the role KEY; the summary is the model’s', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({
        name: 'Ayşe Demir',
        email: 'AYSE@example.com ',
        phone: '+90 501 000 00 00',
        company: 'Demir Tekstil',
        country: 'tr',
        message: 'Antalya',
      }),
      ctx,
    );
    expect(Object.keys(fields).sort()).toEqual([...CALCULATOR_FIELD_NAMES].sort());
    expect(fields).toMatchObject({
      name: 'Ayşe Demir',
      email: 'AYSE@example.com',
      phone: '+90 501 000 00 00',
      company: 'Demir Tekstil',
      country: 'TR',
      headcount: '1',
      trade: 'welder',
      durationMonths: '12',
      message: 'Antalya',
    });
    // the label rides only inside the free-text summary, beside the key
    expect(fields.estimateSummary).toContain('<calc.012>: <calc.555> (welder)');
    // COPY_DELTAS model figures: 49,545 × 1.2175 = 60,321.04; × 12 + 28,000 = 751,852.45
    expect(fields.estimateSummary).toContain('<calc.028>: 60.321 ₺');
    expect(fields.estimateSummary).toContain('<calc.469>: 751.852 ₺');
    expect(fields.estimateSummary).toContain('<calc.016>: <calc.017>');
    expect(fields.estimateSummary).toContain('Oran sürümü: 2026-01');
    expect(fields.estimateSummary.length).toBeLessThanOrEqual(2000);
  });
  it('recomputes from the est_* inputs — a client total is never forwarded', () => {
    const fields = toCalculatorFields(
      quoteSchema.parse({
        name: 'A',
        email: 'a@b.co',
        [ESTIMATE_FIELDS.role]: 'cook',
        [ESTIMATE_FIELDS.headcount]: '5',
        [ESTIMATE_FIELDS.months]: '6',
        [ESTIMATE_FIELDS.salary]: '10',
        [ESTIMATE_FIELDS.tier]: 'manufacturing',
        [ESTIMATE_FIELDS.support]: '1',
      }),
      ctx,
    );
    expect(fields).toMatchObject({ headcount: '5', trade: 'cook', durationMonths: '6' });
    expect(fields.estimateSummary).toContain('<calc.015>: 50.000 ₺ <calc.464>'); // the band floor, not 10
    expect(fields.estimateSummary).toContain('<calc.022>: <calc.466> (%18,75)');
    expect(fields.estimateSummary).toContain('6 aylık sezon toplamı: ');
    expect(fields.estimateSummary).toContain('<calc.020>');
  });
  it('sends no estimate when the bundle has no design role (the page shows its empty state)', () => {
    const fields = toCalculatorFields(quoteSchema.parse({ name: 'A', email: 'a@b.co' }), {
      ...ctx,
      roles: [],
    });
    expect(fields).toMatchObject({
      trade: '',
      headcount: '',
      durationMonths: '',
      estimateSummary: '',
    });
  });
});
