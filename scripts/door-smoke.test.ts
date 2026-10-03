import { describe, expect, it } from 'vitest';
import { FORM_KEYS, type FormKey } from '../src/analytics/forms';
import { CONSENT_VERSION } from '../src/forms/consent';
import {
  classifySmoke,
  expectedSmokeKind,
  formatSmokeTable,
  SMOKE_KEYS,
  smokeEnvelope,
  smokeFields,
  type SmokeRow,
} from './door-smoke.lib';

/** docs/INTEGRATIONS.md I4 (v1.1) — the REQUIRED field per key. A key missing here or a
 *  field missing from `smokeFields` is a 400 at the door, and this table is what the doc
 *  table (Cycle 8) is copied from. Keep the two in step. */
const REQUIRED: Record<FormKey, readonly string[]> = {
  hire: ['name', 'company', 'email', 'phone'],
  contact: ['name', 'email', 'message'],
  partner: ['name', 'company', 'email', 'phone', 'country'],
  workers: ['name', 'company', 'email', 'phone'],
  callback: ['name', 'phone'],
  visit: ['name', 'email', 'phone'],
  calculator: ['name', 'email'],
  careers: ['openingSlug', 'cvKey', 'name', 'email', 'phone', 'country'],
  fraud: ['description'],
  newsletter: ['email'],
};

/** Length caps of every field the smoke bodies send (catalog v1.0 + v1.1, `docs/INTEGRATIONS.md`
 *  I4). The catalog's per-key differences ride in CAP_OVERRIDES: `careers.city` 100 (120 elsewhere),
 *  `careers.name` 200 (120 elsewhere), `callback.topic` 200 (free text; `contact.topic` is the
 *  ≤ 40 enum), `visit.preferredTime` 40 (120 on `callback`) — P/operations-door-contract-as-built.md. */
const CAPS: Record<string, number> = {
  name: 120,
  company: 200,
  email: 254,
  phone: 40,
  country: 2,
  iAm: 40,
  sector: 120,
  roleNeeded: 200,
  headcount: 10,
  startWhen: 120,
  message: 5000,
  city: 120,
  subject: 200,
  topic: 40,
  candidatesPerYear: 20,
  trades: 500,
  licence: 200,
  track: 40,
  trade: 200,
  preferredTime: 120,
  office: 120,
  preferredDate: 40,
  durationMonths: 10,
  estimateSummary: 2000,
  openingSlug: 200,
  cvKey: 300,
  language: 300,
  expectedSalary: 20,
  expectedSalaryCurrency: 3,
  coverLetter: 5000,
  portfolioUrl: 500,
  reporterName: 120,
  reporterEmail: 254,
  reporterPhone: 40,
  description: 5000,
  suspectName: 200,
  suspectContact: 300,
};
const CAP_OVERRIDES: Partial<Record<FormKey, Partial<Record<string, number>>>> = {
  careers: { city: 100, name: 200 },
  callback: { topic: 200 },
  visit: { preferredTime: 40 },
};
const capFor = (key: FormKey, field: string): number => CAP_OVERRIDES[key]?.[field] ?? CAPS[field];

describe('door-smoke.lib — the I4 table as code', () => {
  it('covers every FORM_KEY once, in FORM_KEYS order', () => {
    expect([...SMOKE_KEYS]).toEqual([...FORM_KEYS]);
  });

  it('every smoke body carries every required field of its key, non-empty, under its cap', () => {
    for (const key of FORM_KEYS) {
      const fields = smokeFields(key, '20260921T120000Z', {
        cvKey: 'careers-cv/smoke.pdf',
        openingSlug: 'some-opening',
        country: 'TR',
      });
      for (const req of REQUIRED[key]) {
        expect({
          key,
          req,
          present: typeof fields[req] === 'string' && fields[req].length > 0,
        }).toEqual({ key, req, present: true });
      }
      for (const [name, value] of Object.entries(fields)) {
        const cap = capFor(key, name);
        expect({ key, name, capped: cap !== undefined }).toEqual({ key, name, capped: true });
        if (typeof value === 'string') expect(value.length).toBeLessThanOrEqual(cap);
      }
    }
  });

  it('careers.city stays under its own 100-char cap even though every other city is 120', () => {
    // door-smoke never sends a city long enough to matter today, but a future edit that does
    // must fail here first, not at the door.
    expect(capFor('careers', 'city')).toBe(100);
    expect(capFor('hire', 'city')).toBe(120);
  });

  it('stamps the body so two runs in one hour never replay (sourcePath is not hashed — a field must vary)', () => {
    const a = smokeFields('hire', 'A');
    const b = smokeFields('hire', 'B');
    expect(a).not.toEqual(b);
    expect(JSON.stringify(a)).toContain('A');
  });

  it('sends stable option keys (W77/W78), ISO-2 upper-case countries and ≥ 8-digit phones', () => {
    expect(smokeFields('hire', 's').iAm).toBe('direct_employer');
    expect(smokeFields('hire', 's').sector).toBe('factory');
    expect(smokeFields('hire', 's').startWhen).toBe('month1');
    expect(['asap', 'month1', 'months1to3', 'planning']).toContain(
      smokeFields('workers', 's').startWhen,
    );
    expect(smokeFields('partner', 's').country).toMatch(/^[A-Z]{2}$/);
    expect(smokeFields('partner', 's').track).toBe('sourcing');
    expect(smokeFields('contact', 's').topic).toBe('hire');
    expect(
      (smokeFields('hire', 's').phone as string).replace(/\D/g, '').length,
    ).toBeGreaterThanOrEqual(8);
    expect(smokeFields('fraud', 's').description).toHaveLength(60);
  });

  it('careers needs the caller to supply a real cvKey, openingSlug AND the opening’s own country', () => {
    expect(() => smokeFields('careers', 's')).toThrow(/cvKey/);
    expect(() =>
      smokeFields('careers', 's', { cvKey: 'careers-cv/x.pdf', openingSlug: 'o' }),
    ).toThrow(/country/);
    const fields = smokeFields('careers', 's', {
      cvKey: 'careers-cv/x.pdf',
      openingSlug: 'o',
      country: 'PK',
    });
    expect(fields.cvKey).toBe('careers-cv/x.pdf');
    // W105: the residency rule checks `country === opening.country` — a hardcoded 'TR' would
    // answer 200 + FAILED for a non-TR opening, and a flat classifier would wrongly call that `ok`.
    expect(fields.country).toBe('PK');
  });

  it('the envelope is the kernel’s wire shape with the site-wide consent version', () => {
    const env = smokeEnvelope('callback', 'en', 'S1');
    expect(env).toEqual({
      locale: 'en',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/door-smoke/S1',
      fields: smokeFields('callback', 'S1'),
    });
    expect(Object.keys(env).sort()).toEqual(['consentVersion', 'fields', 'locale', 'sourcePath']);
  });

  it('classifies the door’s answers like postForm does', () => {
    const ok = {
      data: {
        id: 'sub_1',
        formKey: 'hire',
        status: 'HANDLED',
        isTest: true,
        replayed: false,
        captchaDegraded: false,
        error: null,
      },
    };
    expect(classifySmoke('hire', 200, ok)).toMatchObject({
      kind: 'ok',
      doorStatus: 'HANDLED',
      isTest: true,
      replayed: false,
      id: 'sub_1',
    });
    expect(
      classifySmoke('hire', 200, { ...ok, data: { ...ok.data, replayed: true } }),
    ).toMatchObject({ kind: 'ok', replayed: true });
    expect(
      classifySmoke('hire', 200, { data: { ...ok.data, status: 'FAILED', error: 'nope' } }),
    ).toMatchObject({ kind: 'ok', doorStatus: 'FAILED', message: 'nope' });
    expect(
      classifySmoke('hire', 400, {
        message: 'Invalid form fields',
        errors: ['country must be a two-letter ISO code'],
      }),
    ).toMatchObject({ kind: 'invalid', errors: ['country must be a two-letter ISO code'] });
    expect(classifySmoke('hire', 401, { message: 'Invalid website token.' })).toMatchObject({
      kind: 'unauthorized',
    });
    expect(
      classifySmoke('hire', 403, { message: 'Captcha verification failed. Please retry.' }),
    ).toMatchObject({ kind: 'captcha' });
    expect(
      classifySmoke('newsletter', 404, { message: 'This form is not accepting submissions.' }),
    ).toMatchObject({ kind: 'off', message: 'This form is not accepting submissions.' });
    expect(classifySmoke('hire', 404, null)).toMatchObject({ kind: 'off' });
    expect(
      classifySmoke('visit', 429, {
        statusCode: 429,
        message: 'paused',
        reason: 'tripped',
        fallback: 'whatsapp',
      }),
    ).toMatchObject({ kind: 'tripped', fallback: 'whatsapp' });
    expect(classifySmoke('hire', 502, null)).toMatchObject({ kind: 'unavailable' });
    // R28: a 200 that is not the door
    expect(classifySmoke('hire', 200, { html: true })).toMatchObject({ kind: 'unavailable' });
  });

  it('expects ok everywhere except the D14-inactive newsletter', () => {
    for (const key of FORM_KEYS)
      expect(expectedSmokeKind(key)).toBe(key === 'newsletter' ? 'off' : 'ok');
  });

  it('formats a Markdown table the ledger can paste, with a pass column', () => {
    const rows: SmokeRow[] = [
      {
        formKey: 'hire',
        http: 200,
        kind: 'ok',
        doorStatus: 'HANDLED',
        isTest: true,
        replayed: false,
        id: 'sub_1',
        message: null,
        errors: [],
        fallback: null,
        expected: 'ok',
        pass: true,
      },
      {
        formKey: 'newsletter',
        http: 404,
        kind: 'off',
        doorStatus: null,
        isTest: null,
        replayed: null,
        id: null,
        message: 'This form is not accepting submissions.',
        errors: [],
        fallback: null,
        expected: 'off',
        pass: true,
      },
    ];
    const table = formatSmokeTable(rows);
    expect(table.split('\n')[0]).toBe(
      '| form | http | kind | door status | isTest | replayed | id | message | pass |',
    );
    expect(table).toContain('| hire | 200 | ok | HANDLED | true | false | sub_1 |  | ✓ |');
    expect(table).toContain(
      '| newsletter | 404 | off | — | — | — | — | This form is not accepting submissions. | ✓ |',
    );
  });
});
