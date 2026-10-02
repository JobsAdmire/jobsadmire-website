import { describe, expect, it } from 'vitest';
import { fieldErrorsFromIssues } from '@/forms/errors';
import { START_WHEN_KEYS } from '@/forms/options';
import { PROFILE_REFS_PREFIX } from '../_lib/message';
import { toWorkersFields, WORKERS_COUNTRY, WORKERS_SPEC, workersSchema } from '../_lib/spec';

/** The Operations `workers` catalog entry — v1.0 + the v1.1 `city` (WP2a Task 8 as built). A key
 *  outside this set is dropped by the door without an error, so the wire keys are asserted. */
const CATALOG_WORKERS_FIELDS = new Set([
  'name',
  'company',
  'email',
  'phone',
  'country',
  'iAm',
  'trade',
  'headcount',
  'startWhen',
  'message',
  'city',
]);

const valid = {
  iAm: 'direct_employer',
  company: 'Antalya Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 501 124 03 40',
  city: 'Antalya',
  trade: '4 housekeeping, 2 cooks',
  headcount: '6',
  startWhen: 'month1',
  message: 'Summer season, staff housing available.',
};

const ctx = { visitor: { ip: null, ua: null }, locale: 'tr' as const };

describe('workers form spec → Operations catalog `workers`', () => {
  it('sends exactly the catalog field names — the typed roles as `trade`, TR as the country, `city` (v1.1)', () => {
    const fields = toWorkersFields(workersSchema.parse(valid));
    expect(fields).toEqual({
      iAm: 'direct_employer',
      name: 'Ayşe Yılmaz',
      company: 'Antalya Otel A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 501 124 03 40',
      country: 'TR',
      city: 'Antalya',
      trade: '4 housekeeping, 2 cooks',
      headcount: '6',
      startWhen: 'month1',
      message: 'Summer season, staff housing available.',
    });
    expect(WORKERS_COUNTRY).toBe('TR');
    for (const k of Object.keys(fields)) expect(CATALOG_WORKERS_FIELDS.has(k), k).toBe(true);
    // W77/W78: no sector key rides anywhere — `workers` has no `sector` field at all.
    expect(fields).not.toHaveProperty('sector');
  });

  it('omits the optional fields the visitor left blank instead of sending empty strings', () => {
    const fields = toWorkersFields(
      workersSchema.parse({ ...valid, headcount: '', startWhen: '', message: '' }),
    );
    expect(fields).not.toHaveProperty('headcount');
    expect(fields).not.toHaveProperty('startWhen');
    expect(fields).not.toHaveProperty('message');
    expect(fields.city).toBe('Antalya');
    expect(fields.trade).toBe('4 housekeeping, 2 cooks');
  });

  it('`startWhen` accepts exactly the shared W78 keys — the retired page-local keys fail', () => {
    for (const k of START_WHEN_KEYS)
      expect(workersSchema.safeParse({ ...valid, startWhen: k }).success, k).toBe(true);
    for (const k of ['month3', 'flexible', 'tomorrow'])
      expect(workersSchema.safeParse({ ...valid, startWhen: k }).success, k).toBe(false);
  });

  it('folds basket refs into `message` — also when the visitor typed no message', () => {
    expect(
      toWorkersFields(
        workersSchema.parse({ ...valid, message: 'Two welders.', profileRefs: 'ja-1042, JA-1050' }),
      ).message,
    ).toBe(`${PROFILE_REFS_PREFIX}JA-1042, JA-1050\n\nTwo welders.`);
    expect(
      toWorkersFields(workersSchema.parse({ ...valid, message: '', profileRefs: 'JA-1042' }))
        .message,
    ).toBe(`${PROFILE_REFS_PREFIX}JA-1042`);
  });

  it('requires role, name, company, email, phone, city and trade — a blank one reads `required`', () => {
    for (const key of ['name', 'company', 'email', 'phone', 'city', 'trade'] as const) {
      const r = workersSchema.safeParse({ ...valid, [key]: '' });
      expect(r.success, key).toBe(false);
      if (!r.success) expect(fieldErrorsFromIssues(r.error.issues)[key], key).toBe('required');
    }
    const noRole = workersSchema.safeParse({ ...valid, iAm: undefined });
    expect(noRole.success).toBe(false);
    if (!noRole.success) expect(fieldErrorsFromIssues(noRole.error.issues).iAm).toBe('required');
    const badEmail = workersSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(badEmail.success).toBe(false);
    if (!badEmail.success) expect(fieldErrorsFromIssues(badEmail.error.issues).email).toBe('email');
    const badPhone = workersSchema.safeParse({ ...valid, phone: '12 34' });
    expect(badPhone.success).toBe(false);
    if (!badPhone.success) expect(fieldErrorsFromIssues(badPhone.error.issues).phone).toBe('phone');
    expect(workersSchema.safeParse({ ...valid, iAm: 'agency' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, iAm: 'sourcing_partner' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '0' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, headcount: '10000' }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, trade: 'x'.repeat(201) }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, city: 'x'.repeat(121) }).success).toBe(false);
    expect(workersSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('is the `workers` key with a consent checkbox (R55 / W79) and takes the kernel context', async () => {
    expect(WORKERS_SPEC.key).toBe('workers');
    expect(WORKERS_SPEC.consent).toBe('checkbox');
    expect(WORKERS_SPEC.schema).toBe(workersSchema);
    await expect(
      Promise.resolve(WORKERS_SPEC.toFields(workersSchema.parse(valid), new FormData(), ctx)),
    ).resolves.toHaveProperty('country', 'TR');
  });
});
