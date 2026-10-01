import type { Messages } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitCalculatorQuote } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts and T2's actions test).
// `postForm` is the door, stubbed door-less (`unauthorized` — every face but staging/production,
// W92); `getBundle` reads the real LOCAL bundle; `getTranslations` is a real next-intl translator.
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
}));

vi.mock('next-intl/server', async () => {
  const { createTranslator } = await import('next-intl');
  const tr = (await import('@/messages/tr.json')).default as Messages;
  const en = (await import('@/messages/en.json')).default as Messages;
  return {
    getLocale: mocks.getLocale,
    getTranslations: async ({ locale }: { locale: 'tr' | 'en' }) =>
      createTranslator({ locale, messages: locale === 'tr' ? tr : en, namespace: 'sys' }),
  };
});
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));
vi.mock('@/content/adapter', async () => {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { BundleSchema } = await import('../../../../../../contract/website-bundle.v1');
  const pure = await import('@/content/pure');
  return {
    ...pure,
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

/** The Operations catalog's `calculator` field names (v1.0; no v1.1 field applies). The door
 *  silently DROPS any other name inside `fields`. */
const CALCULATOR_CATALOG = [
  'name',
  'email',
  'phone',
  'company',
  'country',
  'headcount',
  'trade',
  'durationMonths',
  'estimateSummary',
  'message',
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

const valid = {
  name: 'Ayşe Demir',
  email: 'ayse@acme.example',
  phone: '0532 000 00 00',
  company: 'Acme',
  country: 'TR',
  message: '',
  consent: 'on',
  honeypot: '',
  est_role: 'electrician',
  est_headcount: '4',
  est_months: '9',
  est_salary: '',
  est_tier: 'other',
  est_flight: '1',
  est_housing: '0',
  est_support: '0',
  est_turkishStaff: '30',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/maliyet-hesaplayici');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitCalculatorQuote → the calculator door (W3)', () => {
  it('sends catalog names only, the role key as trade, the server-recomputed summary; no door → fallback', async () => {
    const state = await submitCalculatorQuote(IDLE_FORM_STATE, formData(valid));
    const { key, envelope } = sent();
    expect(key).toBe('calculator');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/maliyet-hesaplayici',
    });
    // empty values (the message here) never travel (buildEnvelope)
    expect(Object.keys(envelope.fields).sort()).toEqual([
      'company',
      'country',
      'durationMonths',
      'email',
      'estimateSummary',
      'headcount',
      'name',
      'phone',
      'trade',
    ]);
    for (const name of Object.keys(envelope.fields)) expect(CALCULATOR_CATALOG).toContain(name);
    expect(envelope.fields).toMatchObject({
      name: 'Ayşe Demir',
      email: 'ayse@acme.example',
      phone: '0532 000 00 00',
      company: 'Acme',
      country: 'TR',
      headcount: '4',
      trade: 'electrician',
      durationMonths: '9',
    });
    expect(envelope.fields.estimateSummary).toContain('Elektrikçi (electrician)');
    expect(envelope.fields.estimateSummary).toContain('9 aylık sezon toplamı: ');
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' } });
  });

  it('writes the summary in the request locale', async () => {
    mocks.getLocale.mockResolvedValue('en');
    await submitCalculatorQuote(IDLE_FORM_STATE, formData(valid));
    const { envelope } = sent();
    expect(envelope.locale).toBe('en');
    expect(envelope.fields.estimateSummary).toContain('Electrician (electrician)');
    expect(envelope.fields.estimateSummary).toContain('9-month season total: ');
  });

  it('refuses a submit without the consent tick (W79) or the e-mail, and posts nothing', async () => {
    expect(
      await submitCalculatorQuote(IDLE_FORM_STATE, formData({ ...valid, consent: '' })),
    ).toMatchObject({
      status: 'fieldErrors',
      errors: { consent: 'consent' },
    });
    expect(
      await submitCalculatorQuote(IDLE_FORM_STATE, formData({ ...valid, email: '' })),
    ).toMatchObject({
      status: 'fieldErrors',
      errors: { email: 'required' },
    });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('navigates to /thank-you?form=calculator when the door accepts (D13)', async () => {
    mocks.postForm.mockResolvedValue({
      kind: 'ok',
      id: 'sub_1',
      status: 'RECEIVED',
      isTest: false,
      replayed: false,
      captchaDegraded: false,
      error: null,
    });
    await expect(submitCalculatorQuote(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'calculator' } },
      locale: 'tr',
    });
  });
});
