import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitHireFull, submitHireQuick } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92)
// unless a case says otherwise; `getBundle` reads the real LOCAL bundle from disk, so the dial
// lookup runs against the real `countries` collection.
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
vi.mock('@/content/adapter', async () => {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { BundleSchema } = await import('../../../../../../contract/website-bundle.v1');
  return {
    getBundle: async (locale: string) =>
      BundleSchema.parse(
        JSON.parse(
          readFileSync(
            join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`),
            'utf8',
          ),
        ),
      ),
  };
});

/** The Operations catalog's `hire` field names — v1.0 (`website-form-catalog.ts`) + v1.1's
 *  `city` (WP2a Task 8, W16). The door silently DROPS any other name inside `fields`. */
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

const full = {
  company: 'Acme A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@acme.example',
  dial: 'TR',
  phone: '0532 000 00 00',
  sector: 'factory',
  roleNeeded: 'kaynakçı',
  headcount: '5',
  city: 'Antalya',
  startWhen: 'month1',
  message: '',
  consent: 'on',
  honeypot: '',
  $ACTION_ID_hire: '',
};
const quick = {
  company: 'Acme',
  city: 'Bursa',
  name: 'Ali Veli',
  roleNeeded: 'kaynakçı',
  headcount: '3',
  phone: '0532 000 00 00',
  email: 'ali@acme.example',
  consent: 'on',
  honeypot: '',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/isci-talebi');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitHireFull — the request form → hire', () => {
  it('sends catalog names only: dial + phone composed, the sector and startWhen keys, city', async () => {
    const state = await submitHireFull(IDLE_FORM_STATE, formData(full));
    const { key, envelope } = sent();
    expect(key).toBe('hire');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/isci-talebi',
    });
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      company: 'Acme A.Ş.',
      email: 'ayse@acme.example',
      phone: '+905320000000',
      sector: 'factory',
      roleNeeded: 'kaynakçı',
      headcount: '5',
      city: 'Antalya',
      startWhen: 'month1',
    });
    for (const name of Object.keys(envelope.fields)) expect(HIRE_CATALOG).toContain(name);
    // D11/W92: no door → the fallback panel state, the typed values echoed for its WhatsApp prefill
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { company: 'Acme A.Ş.', phone: '0532 000 00 00' },
    });
  });

  it('refuses a submit without the consent tick (W79) and posts nothing', async () => {
    const state = await submitHireFull(IDLE_FORM_STATE, formData({ ...full, consent: '' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('lands an unknown dial code on the dial select and posts nothing', async () => {
    const state = await submitHireFull(IDLE_FORM_STATE, formData({ ...full, dial: 'XX' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { dial: 'invalid' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('navigates to /thank-you?form=hire when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue({
      kind: 'ok',
      id: 'sub_1',
      status: 'RECEIVED',
      isTest: false,
      replayed: false,
      captchaDegraded: false,
      error: null,
    });
    await expect(submitHireFull(IDLE_FORM_STATE, formData(full))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'hire' } },
      locale: 'tr',
    });
  });
});

describe('submitHireQuick — the hero quick-quote → hire', () => {
  it('sends name (W3), company, email, the normalised phone, city (W16), roleNeeded, headcount', async () => {
    const state = await submitHireQuick(IDLE_FORM_STATE, formData(quick));
    const { key, envelope } = sent();
    expect(key).toBe('hire');
    expect(envelope.fields).toEqual({
      name: 'Ali Veli',
      company: 'Acme',
      email: 'ali@acme.example',
      phone: '+905320000000',
      city: 'Bursa',
      roleNeeded: 'kaynakçı',
      headcount: '3',
    });
    for (const name of Object.keys(envelope.fields)) expect(HIRE_CATALOG).toContain(name);
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' } });
  });

  it('refuses a submit without the contact name', async () => {
    const state = await submitHireQuick(IDLE_FORM_STATE, formData({ ...quick, name: '' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { name: 'required' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });
});
