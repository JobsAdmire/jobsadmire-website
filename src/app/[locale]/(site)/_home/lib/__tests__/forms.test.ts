import { describe, expect, it } from 'vitest';
import { SECTOR_KEYS } from '@/content/collections';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { START_WHEN_KEYS } from '@/forms/options';
import {
  callbackSchema,
  callbackSpec,
  callbackToFields,
  HERO_SECTOR_KEYS,
  HERO_SECTOR_LABEL_IDS,
  hireSchema,
  hireSpec,
  hireToFields,
  START_WHEN_LABEL_IDS,
} from '../forms';

const hire = {
  company: 'Akdeniz Tekstil A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 501 000 00 00',
  sector: 'factory',
  headcount: '15',
  city: 'Antalya',
  startWhen: 'month1',
};

const codes = (result: ReturnType<typeof hireSchema.safeParse>) =>
  result.success ? {} : fieldErrorsFromIssues(result.error.issues);

describe('the option sets (W77/W78/W115)', () => {
  it('sector keys are a subset of the sectors collection keys, labelled by home.036–040', () => {
    for (const key of HERO_SECTOR_KEYS) expect(SECTOR_KEYS).toContain(key);
    expect(HERO_SECTOR_LABEL_IDS).toEqual({
      factory: 'home.036',
      agriculture: 'home.037',
      tourism: 'home.038',
      construction: 'home.039',
      other: 'home.040',
    });
  });

  it('startWhen is the shared START_WHEN_KEYS set, labelled by the package’s home.044–047', () => {
    expect(Object.keys(START_WHEN_LABEL_IDS)).toEqual([...START_WHEN_KEYS]);
    expect(Object.values(START_WHEN_LABEL_IDS)).toEqual([
      'home.044',
      'home.045',
      'home.046',
      'home.047',
    ]);
  });
});

describe('hireSchema → hireToFields (catalog names — W3/W16)', () => {
  it('maps a full submission onto the exact `hire` catalog field names', () => {
    expect(hireToFields(hireSchema.parse(hire))).toEqual({
      company: 'Akdeniz Tekstil A.Ş.',
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 501 000 00 00',
      headcount: '15',
      sector: 'factory',
      city: 'Antalya',
      startWhen: 'month1',
    });
  });

  it('omits the optional fields the visitor left empty', () => {
    const fields = hireToFields(hireSchema.parse({ ...hire, sector: '', city: '', startWhen: '' }));
    expect(Object.keys(fields).sort()).toEqual(['company', 'email', 'headcount', 'name', 'phone']);
  });

  it('requires name and e-mail — the door does, the design did not (W3)', () => {
    expect(codes(hireSchema.safeParse({ ...hire, name: '', email: '' }))).toMatchObject({
      name: 'required',
      email: 'required',
    });
    expect(codes(hireSchema.safeParse({ ...hire, email: 'not-an-address' }))).toMatchObject({
      email: 'email',
    });
  });

  it('a phone needs eight digits (the door rule) and reports the phone code', () => {
    expect(codes(hireSchema.safeParse({ ...hire, phone: '+90 12' }))).toMatchObject({
      phone: 'phone',
    });
  });

  it('headcount is a positive integer of at most ten digits', () => {
    for (const headcount of ['0', 'fifteen', '12345678901'])
      expect(codes(hireSchema.safeParse({ ...hire, headcount }))).toMatchObject({
        headcount: 'invalid',
      });
  });

  it('only the stable keys pass — a localized label is never a wire value (W77)', () => {
    expect(hireSchema.safeParse({ ...hire, sector: 'Fabrika / Üretim' }).success).toBe(false);
    expect(hireSchema.safeParse({ ...hire, startWhen: 'Within 1 month' }).success).toBe(false);
    for (const sector of HERO_SECTOR_KEYS)
      expect(hireSchema.safeParse({ ...hire, sector }).success).toBe(true);
    for (const startWhen of START_WHEN_KEYS)
      expect(hireSchema.safeParse({ ...hire, startWhen }).success).toBe(true);
  });

  it('the spec posts to `hire` with the consent checkbox (W79)', () => {
    expect(hireSpec.key).toBe('hire');
    expect(hireSpec.consent).toBe('checkbox');
    expect(hireSpec.schema).toBe(hireSchema);
  });
});

describe('callbackSchema → callbackToFields (catalog `callback`)', () => {
  const base = { name: 'Mehmet Kaya', phone: '05320000000' };

  it('maps onto name, phone, topic (the sector key) and city', () => {
    expect(
      callbackToFields(callbackSchema.parse({ ...base, topic: 'tourism', city: 'Antalya' })),
    ).toEqual({ name: 'Mehmet Kaya', phone: '05320000000', topic: 'tourism', city: 'Antalya' });
    expect(
      Object.keys(callbackToFields(callbackSchema.parse({ ...base, topic: '', city: '' }))),
    ).toEqual(['name', 'phone']);
  });

  it('name and phone are required; topic takes only the sector keys', () => {
    expect(callbackSchema.safeParse({ name: '', phone: '' }).success).toBe(false);
    expect(callbackSchema.safeParse({ ...base, topic: 'Turizm' }).success).toBe(false);
  });

  it('the spec posts to `callback` with the consent checkbox (W79)', () => {
    expect(callbackSpec.key).toBe('callback');
    expect(callbackSpec.consent).toBe('checkbox');
  });
});
