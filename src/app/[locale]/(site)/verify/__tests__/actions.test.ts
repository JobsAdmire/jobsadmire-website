import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_VERSION } from '@/forms/consent';
import { FormActionError, FormDoorError, IDLE_FORM_STATE } from '@/forms/types';
import { submitFraud, uploadEvidence } from '../actions';

// The kernel reads the request through Next/next-intl; none of that exists under Vitest, so each
// is a recorded stub (the pattern of src/forms/__tests__/action.test.ts). `postForm` is the door,
// stubbed door-less (`unauthorized` — what every face but `staging`/production answers, W92);
// `uploadFraudEvidence` is stubbed per case (its own behaviour is pinned by uploads.test.ts).
const mocks = vi.hoisted(() => ({
  getLocale: vi.fn(async (): Promise<string> => 'tr'),
  headersStore: new Map<string, string>(),
  redirect: vi.fn((args: unknown): never => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { digest: 'NEXT_REDIRECT', args });
  }),
  postForm: vi.fn(),
  upload: vi.fn(),
}));

vi.mock('next-intl/server', () => ({ getLocale: mocks.getLocale }));
vi.mock('next/headers', () => ({
  headers: async () => ({ get: (k: string) => mocks.headersStore.get(k.toLowerCase()) ?? null }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/forms/post', () => ({ postForm: mocks.postForm }));
vi.mock('@/forms/uploads', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/forms/uploads')>()),
  uploadFraudEvidence: mocks.upload,
}));

/** The Operations catalog's `fraud` field names (v1.0; v1.1 adds nothing to `fraud`). Anything
 *  else inside `fields` would be dropped silently with a 200. */
const FRAUD_CATALOG = [
  'reporterName',
  'reporterEmail',
  'reporterPhone',
  'description',
  'suspectName',
  'suspectContact',
  'evidenceKeys',
];

type Envelope = {
  locale: string;
  consentVersion: string;
  sourcePath?: string;
  fields: Record<string, string | string[]>;
};
function sent(): { key: string; envelope: Envelope; visitor: unknown } {
  expect(mocks.postForm).toHaveBeenCalledTimes(1);
  const [key, envelope, visitor] = mocks.postForm.mock.calls[0] as [string, Envelope, unknown];
  return { key, envelope, visitor };
}

/** Entries, not an object: `evidenceKeys` repeats, one hidden input per uploaded file. */
function formData(entries: [string, string][]) {
  const fd = new FormData();
  for (const [k, v] of entries) fd.append(k, v);
  return fd;
}

const REPORT: [string, string][] = [
  ['suspectName', 'Ali Veli'],
  ['suspectContact', '+90 555 000 00 00'],
  [
    'description',
    'Kendini JobsAdmire temsilcisi olarak tanıtan biri 500 USD vize depozitosu istedi.',
  ],
  ['reporterName', 'Ayşe Yılmaz'],
  ['reporterEmail', 'ayse@example.com'],
  ['reporterPhone', ''],
  ['evidenceKeys', 'website-fraud/5f0c.png'],
  ['evidenceKeys', 'website-fraud/9a1b.pdf'],
  ['consent', 'on'],
  ['honeypot', ''],
];
const without = (name: string) => REPORT.filter(([k]) => k !== name);

const ok = {
  kind: 'ok',
  id: 'sub_1',
  status: 'RECEIVED',
  isTest: false,
  replayed: false,
  captchaDegraded: false,
  error: null,
} as const;

beforeEach(() => {
  mocks.headersStore.clear();
  mocks.headersStore.set('user-agent', 'vitest');
  mocks.headersStore.set('referer', 'https://www.jobsadmire.com/temsilci-dogrulama');
  mocks.headersStore.set('x-forwarded-for', '203.0.113.7, 10.0.0.1');
  mocks.getLocale.mockResolvedValue('tr');
  mocks.redirect.mockClear();
  mocks.postForm.mockReset();
  mocks.postForm.mockResolvedValue({ kind: 'unauthorized' });
  mocks.upload.mockReset();
});

describe('submitFraud — the report → fraud (W3/W79/W101)', () => {
  it('sends the fraud catalog names only, the uploaded keys as an array; no door → the D11 state', async () => {
    const state = await submitFraud(IDLE_FORM_STATE, formData(REPORT));
    const { key, envelope, visitor } = sent();
    expect(key).toBe('fraud');
    expect(envelope).toMatchObject({
      locale: 'tr',
      consentVersion: CONSENT_VERSION,
      sourcePath: '/temsilci-dogrulama',
    });
    expect(envelope.fields).toEqual({
      reporterName: 'Ayşe Yılmaz',
      reporterEmail: 'ayse@example.com',
      suspectName: 'Ali Veli',
      suspectContact: '+90 555 000 00 00',
      description:
        'Kendini JobsAdmire temsilcisi olarak tanıtan biri 500 USD vize depozitosu istedi.',
      evidenceKeys: ['website-fraud/5f0c.png', 'website-fraud/9a1b.pdf'],
    });
    for (const name of Object.keys(envelope.fields)) expect(FRAUD_CATALOG).toContain(name);
    expect(visitor).toEqual({ ip: '203.0.113.7', ua: 'vitest' });
    expect(mocks.upload).not.toHaveBeenCalled(); // W101: nothing uploads inside toFields
    // D11/W92: no door → the fallback panel state, the typed values echoed for its prefill.
    expect(state).toMatchObject({
      status: 'error',
      result: { kind: 'unauthorized' },
      values: { reporterName: 'Ayşe Yılmaz', suspectName: 'Ali Veli' },
    });
  });

  it('a report without evidence sends no evidenceKeys at all', async () => {
    await submitFraud(IDLE_FORM_STATE, formData(REPORT.filter(([k]) => k !== 'evidenceKeys')));
    expect(sent().envelope.fields).not.toHaveProperty('evidenceKeys');
  });

  it('W79: no consent tick is a field error and never reaches the door', async () => {
    const state = await submitFraud(IDLE_FORM_STATE, formData(without('consent')));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { consent: 'consent' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('a short description and a missing reporter e-mail are field errors (catalog min 20; V-2)', async () => {
    const state = await submitFraud(
      IDLE_FORM_STATE,
      formData([
        ...without('description').filter(([k]) => k !== 'reporterEmail'),
        ['description', 'çok kısa'],
        ['reporterEmail', ''],
      ]),
    );
    expect(state).toMatchObject({
      status: 'fieldErrors',
      errors: { description: 'min', reporterEmail: 'required' },
    });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('a fourth key is max and a key the door never issued is invalid — neither reaches the door', async () => {
    const four = await submitFraud(
      IDLE_FORM_STATE,
      formData([
        ...REPORT,
        ['evidenceKeys', 'website-fraud/c.png'],
        ['evidenceKeys', 'website-fraud/d.png'],
      ]),
    );
    expect(four).toMatchObject({ status: 'fieldErrors', errors: { evidenceKeys: 'max' } });
    const forged = await submitFraud(
      IDLE_FORM_STATE,
      formData([...without('evidenceKeys'), ['evidenceKeys', 'careers-cv/x.pdf']]),
    );
    expect(forged).toMatchObject({ status: 'fieldErrors', errors: { evidenceKeys: 'invalid' } });
    expect(mocks.postForm).not.toHaveBeenCalled();
  });

  it('D13: a RECEIVED report navigates to /tesekkurler?form=fraud', async () => {
    mocks.postForm.mockResolvedValue(ok);
    await expect(submitFraud(IDLE_FORM_STATE, formData(REPORT))).rejects.toThrow('NEXT_REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'fraud' } },
      locale: 'tr',
    });
  });
});

describe('uploadEvidence — one file per server-action call (W73/W101/W116)', () => {
  const file = () =>
    new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'shot.png', {
      type: 'image/png',
    });
  const oneFile = (f: File) => {
    const fd = new FormData();
    fd.append('file', f, f.name);
    return fd;
  };

  it('answers the key only, and hands the door the visitor the kernel derives (visitorOf)', async () => {
    mocks.upload.mockResolvedValue({ key: 'website-fraud/5f0c.png' });
    const f = file();
    expect(await uploadEvidence(oneFile(f))).toEqual({ ok: true, key: 'website-fraud/5f0c.png' });
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    const [sentFile, visitor] = mocks.upload.mock.calls[0] as [File, unknown];
    expect(sentFile.name).toBe('shot.png');
    expect(visitor).toEqual({ ip: '203.0.113.7', ua: 'vitest' });
  });

  it('a visitor-side refusal (empty, over 3 MiB, door 400) is reason file', async () => {
    mocks.upload.mockRejectedValue(
      new FormActionError('over 3 MB', { name: 'evidence', code: 'file' }),
    );
    expect(await uploadEvidence(oneFile(file()))).toEqual({ ok: false, reason: 'file' });
  });

  it('a door failure (unconfigured, 401/404/429/5xx, timeout) is reason door', async () => {
    mocks.upload.mockRejectedValue(new FormDoorError({ kind: 'unauthorized' }));
    expect(await uploadEvidence(oneFile(file()))).toEqual({ ok: false, reason: 'door' });
  });

  it('an unexpected throw is logged and answered as door — never a rejection to the island', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.upload.mockRejectedValue(new Error('boom'));
    expect(await uploadEvidence(oneFile(file()))).toEqual({ ok: false, reason: 'door' });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it('no file part (or a string in its place) is reason file and calls nothing', async () => {
    expect(await uploadEvidence(new FormData())).toEqual({ ok: false, reason: 'file' });
    const text = new FormData();
    text.append('file', 'not a file');
    expect(await uploadEvidence(text)).toEqual({ ok: false, reason: 'file' });
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});
