import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { IDLE_FORM_STATE } from '@/forms/types';
import { submitCallback, submitContact, submitVisit } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each is
// a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
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

/** The Operations catalog per key — v1.0 + the confirmed v1.1 optional fields (A/produces-final
 *  § Task 8 as built). Anything else inside `fields` would be dropped silently with a 200. */
const CATALOG = {
  contact: [
    'name',
    'email',
    'phone',
    'company',
    'country',
    'iAm',
    'subject',
    'message',
    'city',
    'topic',
  ],
  callback: ['name', 'phone', 'email', 'preferredTime', 'topic', 'city'],
  visit: [
    'name',
    'company',
    'email',
    'phone',
    'office',
    'preferredDate',
    'preferredTime',
    'message',
  ],
} as const;

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
} as const;

const hire = {
  topic: 'hire',
  company: 'Akdeniz Otel A.Ş.',
  name: 'Ayşe Yılmaz',
  email: 'ayse@example.com',
  phone: '+90 532 000 00 00',
  subject: '10 kaynakçı, 4 CNC operatörü',
  city: 'Antalya',
  reply: 'whatsapp',
  message: 'Mart başında başlasınlar.',
  consent: 'on',
  honeypot: '',
};

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/iletisim');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
});

describe('submitContact — the topic enquiry → contact (W3/W16)', () => {
  it('sends contact catalog names only: topic, iAm, subject, the composed message, v1.1 city; no door → the D11 state', async () => {
    const state = await submitContact(IDLE_FORM_STATE, formData(hire));
    const { key, envelope } = sent();
    expect(key).toBe('contact');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/iletisim',
    });
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      company: 'Akdeniz Otel A.Ş.',
      topic: 'hire',
      iAm: 'direct_employer',
      subject: '10 kaynakçı, 4 CNC operatörü',
      message: '10 kaynakçı, 4 CNC operatörü\nreply: whatsapp\n\nMart başında başlasınlar.',
      city: 'Antalya',
    });
    for (const name of Object.keys(envelope.fields)) expect(CATALOG.contact).toContain(name);
    // D11/W92: no door → the fallback panel state, the typed values echoed for its prefill.
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { company: 'Akdeniz Otel A.Ş.', subject: '10 kaynakçı, 4 CNC operatörü' },
    });
  });

  it('partner: sourcing_partner, the licence as a message line, no city even when one is posted', async () => {
    await submitContact(
      IDLE_FORM_STATE,
      formData({
        ...hire,
        topic: 'partner',
        company: 'Skyline Manpower, Nepal',
        subject: 'kaynakçı ve duvarcı, 200 kişi',
        licence: 'NP-1234',
        city: 'Katmandu',
        reply: 'email',
        message: '',
      }),
    );
    const { envelope } = sent();
    expect(envelope.fields).toMatchObject({
      topic: 'partner',
      iAm: 'sourcing_partner',
      message: 'kaynakçı ve duvarcı, 200 kişi\nlicence: NP-1234\nreply: email',
    });
    expect(envelope.fields).not.toHaveProperty('city');
    expect(envelope.fields).not.toHaveProperty('licence');
  });

  it('a tampered job topic is a field error and never reaches the door (W3)', async () => {
    const state = await submitContact(IDLE_FORM_STATE, formData({ ...hire, topic: 'job' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { topic: 'invalid' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('an unticked consent box is the consent error (W79)', async () => {
    const unticked = Object.fromEntries(Object.entries(hire).filter(([key]) => key !== 'consent'));
    const state = await submitContact(IDLE_FORM_STATE, formData(unticked));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('a received submission navigates to /tesekkurler?form=contact (D13)', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitContact(IDLE_FORM_STATE, formData(hire))).rejects.toThrow('NEXT_REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'contact' } },
      locale: 'tr',
    });
  });
});

describe('submitCallback — the callback widget → callback (W3: name added)', () => {
  it('sends name, phone and the day/slot keys as preferredTime', async () => {
    mocks.getLocale.mockResolvedValue('en');
    const state = await submitCallback(
      IDLE_FORM_STATE,
      formData({
        name: 'Mehmet Kaya',
        phone: '+90 532 000 00 00',
        day: 'tomorrow',
        slot: '14-16',
        consent: 'on',
      }),
    );
    const { key, envelope } = sent();
    expect(key).toBe('callback');
    expect(envelope.locale).toBe('en');
    expect(envelope.fields).toEqual({
      name: 'Mehmet Kaya',
      phone: '+90 532 000 00 00',
      preferredTime: 'tomorrow 14-16',
    });
    for (const name of Object.keys(envelope.fields)) expect(CATALOG.callback).toContain(name);
    expect(state).toMatchObject({ status: 'error', result: { kind: 'unauthorized' } });
  });

  it('refuses a missing name before the door', async () => {
    const state = await submitCallback(
      IDLE_FORM_STATE,
      formData({ phone: '+90 532 000 00 00', day: 'today', consent: 'on' }),
    );
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { name: 'required' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });
});

describe('submitVisit — book-a-visit → visit (W3: name/email/phone added)', () => {
  it('sends the trio, office antalya and the chosen date/time', async () => {
    await submitVisit(
      IDLE_FORM_STATE,
      formData({
        name: 'Ayşe Yılmaz',
        email: 'ayse@example.com',
        phone: '+90 532 000 00 00',
        preferredDate: '2026-10-01',
        preferredTime: '11:00',
        consent: 'on',
      }),
    );
    const { key, envelope } = sent();
    expect(key).toBe('visit');
    expect(envelope.fields).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      phone: '+90 532 000 00 00',
      office: 'antalya',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });
    for (const name of Object.keys(envelope.fields)) expect(CATALOG.visit).toContain(name);
  });

  it('a time outside the five slots is a field error', async () => {
    const state = await submitVisit(
      IDLE_FORM_STATE,
      formData({
        name: 'A',
        email: 'a@b.co',
        phone: '05320000000',
        preferredTime: '12:00',
        consent: 'on',
      }),
    );
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { preferredTime: 'invalid' } });
  });
});
