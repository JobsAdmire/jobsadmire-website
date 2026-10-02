import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitHrAgency, submitInstitute, submitSourcingPartner } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92)
// unless a case says otherwise.
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
}));

vi.mock('next-intl/server', () => ({ getLocale: mocks.getLocale }));
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));

/** The Operations catalog names (v1.0 + v1.1 `city`/`track`, W16) — anything else is dropped. */
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

type Envelope = {
  locale: string;
  consentVersion: string;
  sourcePath?: string;
  fields: Record<string, string>;
};
function sent(): { key: string; envelope: Envelope } {
  expect(mocks.postForm).toHaveBeenCalledTimes(1);
  const [key, envelope] = mocks.postForm.mock.calls[0] as [string, Envelope];
  return { key, envelope };
}

function formData(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
}

const ok = {
  kind: 'ok',
  id: 'sub_1',
  status: 'RECEIVED',
  isTest: false,
  replayed: false,
  captchaDegraded: false,
  error: null,
};

const hr = {
  company: 'Akdeniz İK A.Ş.',
  name: 'Ayşe Yılmaz',
  city: 'Antalya',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  message: '',
  consent: 'on',
  honeypot: '',
};
const sourcing = {
  company: 'Karachi Manpower Ltd',
  name: 'Bilal Khan',
  country: 'PK',
  licence: 'OEP-1234',
  email: 'bilal@example.com',
  phone: '+92 300 1234567',
  candidatesPerYear: '250',
  trades: 'Welders, electricians',
  licenceDeclaration: 'on',
  consent: 'on',
  honeypot: '',
};
const institute = {
  company: 'Lahore Technical Institute',
  name: 'Sara Ahmed',
  city: 'Lahore',
  country: 'PK',
  email: 'sara@example.com',
  phone: '+92 42 1234567',
  candidatesPerYear: '',
  trades: 'Plumbing, HVAC',
  consent: 'on',
  honeypot: '',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/ortak-olun');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitHrAgency — the HR-agency track → hire (W3)', () => {
  it('sends hire catalog names only: country TR, iAm hr_agency, city (W16); no door → the D11 state', async () => {
    const state = await submitHrAgency(IDLE_FORM_STATE, formData(hr));
    const { key, envelope } = sent();
    expect(key).toBe('hire');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/ortak-olun',
    });
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Akdeniz İK A.Ş.',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      country: 'TR',
      iAm: 'hr_agency',
      city: 'Antalya',
    });
    for (const name of Object.keys(envelope.fields)) expect(HIRE_CATALOG).toContain(name);
    // D11/W92: no door → the fallback panel state, the typed values echoed for its prefill.
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { company: 'Akdeniz İK A.Ş.', city: 'Antalya' },
    });
  });

  it('refuses a submit without the consent tick (W79) and posts nothing', async () => {
    const state = await submitHrAgency(IDLE_FORM_STATE, formData({ ...hr, consent: '' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('navigates to /thank-you?form=hire when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitHrAgency(IDLE_FORM_STATE, formData(hr))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'hire' } },
      locale: 'tr',
    });
  });
});

describe('submitSourcingPartner — the sourcing track → partner + track sourcing (W16)', () => {
  it('sends partner catalog names only, the ISO-2 country and track sourcing; never the declaration', async () => {
    await submitSourcingPartner(IDLE_FORM_STATE, formData(sourcing));
    const { key, envelope } = sent();
    expect(key).toBe('partner');
    expect(envelope.fields).toEqual({
      name: 'Bilal Khan',
      company: 'Karachi Manpower Ltd',
      email: 'bilal@example.com',
      phone: '+92 300 1234567',
      country: 'PK',
      track: 'sourcing',
      licence: 'OEP-1234',
      candidatesPerYear: '250',
      trades: 'Welders, electricians',
    });
    for (const name of Object.keys(envelope.fields)) expect(PARTNER_CATALOG).toContain(name);
  });

  it('refuses a submit without the declaration and the consent — two field errors, nothing posted', async () => {
    const state = await submitSourcingPartner(
      IDLE_FORM_STATE,
      formData({ ...sourcing, licenceDeclaration: '', consent: '' }),
    );
    expect(state).toMatchObject({
      status: 'fieldErrors',
      errors: { consent: 'consent', licenceDeclaration: 'invalid' },
    });
    const bare = { ...sourcing } as Record<string, string>;
    delete bare.licenceDeclaration;
    delete bare.consent;
    const state2 = await submitSourcingPartner(IDLE_FORM_STATE, formData(bare));
    expect(state2).toMatchObject({
      status: 'fieldErrors',
      errors: { consent: 'consent', licenceDeclaration: 'required' },
    });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });
});

describe('submitInstitute — the institute track → partner + track institute (W16)', () => {
  it('sends city and the ISO-2 country separately, track institute, in the request locale', async () => {
    mocks.getLocale.mockResolvedValue('en');
    mocks.headersStore.set('referer', 'https://www.jobsadmire.com/en/partner-with-us');
    await submitInstitute(IDLE_FORM_STATE, formData(institute));
    const { key, envelope } = sent();
    expect(key).toBe('partner');
    expect(envelope).toMatchObject({ locale: 'en', sourcePath: '/en/partner-with-us' });
    expect(envelope.fields).toEqual({
      name: 'Sara Ahmed',
      company: 'Lahore Technical Institute',
      email: 'sara@example.com',
      phone: '+92 42 1234567',
      country: 'PK',
      track: 'institute',
      city: 'Lahore',
      trades: 'Plumbing, HVAC',
    });
    for (const name of Object.keys(envelope.fields)) expect(PARTNER_CATALOG).toContain(name);
  });

  it('navigates to /thank-you?form=partner when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitInstitute(IDLE_FORM_STATE, formData(institute))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'partner' } },
      locale: 'tr',
    });
  });
});
