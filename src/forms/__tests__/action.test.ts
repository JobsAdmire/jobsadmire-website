import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { CONSENT_VERSION } from '../consent';
import { createFormAction, FormActionError, FormDoorError, IDLE_FORM_STATE } from '../action';

// The action reads the request through Next/next-intl; none of that exists under Vitest, so
// each is a recorded stub and the assertions are on what the action does with the answers.
// `vi.hoisted` + `vi.mock` are both lifted above the imports by Vitest, so the order below is
// only what `import/first` wants to see.
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
vi.mock('../post', () => ({ postForm: mocks.postForm }));

const { getLocale, headersStore, redirect, postForm } = mocks;

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(1).email(),
  phone: z.string().regex(/(\D*\d){8,}/, { message: 'phone' }),
  message: z.string().max(5000).optional(),
});
const action = createFormAction({
  key: 'hire',
  schema,
  toFields: (p) => ({ name: p.name, email: p.email, phone: p.phone, message: p.message ?? '' }),
});

const ok = {
  kind: 'ok',
  id: 'sub_1',
  status: 'RECEIVED',
  isTest: false,
  replayed: false,
  captchaDegraded: false,
  error: null,
} as const;

function formData(entries: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries))
    for (const one of Array.isArray(v) ? v : [v]) fd.append(k, one);
  return fd;
}
const valid = {
  name: 'Ali Veli',
  email: 'ali@example.com',
  phone: '+90 532 000 00 00',
  message: 'Need 10 welders',
  consent: 'on',
  honeypot: '',
  'cf-turnstile-response': 'tok_123',
  $ACTION_ID_abc: '',
};
const echoed = {
  name: 'Ali Veli',
  email: 'ali@example.com',
  phone: '+90 532 000 00 00',
  message: 'Need 10 welders',
  consent: 'on',
};

beforeEach(() => {
  headersStore.clear();
  headersStore.set('x-forwarded-for', '203.0.113.9, 10.0.0.1');
  headersStore.set('user-agent', 'Mozilla/5.0 test');
  headersStore.set('referer', 'https://www.jobsadmire.com/isci-talebi?utm=x');
  getLocale.mockResolvedValue('tr');
  postForm.mockReset();
  redirect.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('createFormAction', () => {
  it('posts the envelope with locale, visitor and sourcePath, then redirects to /thank-you?form=<key>', async () => {
    postForm.mockResolvedValueOnce(ok);
    await expect(action(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    expect(postForm).toHaveBeenCalledWith(
      'hire',
      {
        locale: 'tr',
        consentVersion: CONSENT_VERSION,
        captchaToken: 'tok_123',
        sourcePath: '/isci-talebi',
        fields: {
          name: 'Ali Veli',
          email: 'ali@example.com',
          phone: '+90 532 000 00 00',
          message: 'Need 10 welders',
        },
      },
      { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' },
    );
    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: '/thank-you', query: { form: 'hire' } },
      locale: 'tr',
    });
  });

  it('redirects for SPAM and replayed answers too (a bot sees success; the same submission already landed)', async () => {
    postForm.mockResolvedValueOnce({ ...ok, status: 'SPAM' });
    await expect(
      action(IDLE_FORM_STATE, formData({ ...valid, honeypot: 'http://spam' })),
    ).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });
    expect(postForm.mock.calls[0][1]).toMatchObject({ honeypot: 'http://spam' });
    postForm.mockResolvedValueOnce({ ...ok, replayed: true });
    await expect(action(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
  });

  it('returns fieldErrors with sys.form.errors codes and echoes the typed values — never calls the door', async () => {
    const state = await action(
      IDLE_FORM_STATE,
      formData({ ...valid, name: '', email: 'nope', phone: '12', consent: '' }),
    );
    expect(state).toEqual({
      status: 'fieldErrors',
      errors: { consent: 'consent', name: 'required', email: 'email', phone: 'phone' },
      values: { name: '', email: 'nope', phone: '12', message: 'Need 10 welders', consent: '' },
    });
    expect(postForm).not.toHaveBeenCalled();
  });

  it('trims what the schema sees: a whitespace-only required value is `required`, never a door 400', async () => {
    const state = await action(IDLE_FORM_STATE, formData({ ...valid, name: '   ' }));
    expect(state).toMatchObject({ status: 'fieldErrors', errors: { name: 'required' } });
    expect(postForm).not.toHaveBeenCalled();
    postForm.mockResolvedValueOnce(ok);
    await expect(
      action(IDLE_FORM_STATE, formData({ ...valid, name: '  Ali Veli \n' })),
    ).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });
    expect(postForm.mock.calls[0][1].fields.name).toBe('Ali Veli');
  });

  it('skips the consent check for a notice-mode spec', async () => {
    const notice = createFormAction({
      key: 'callback',
      schema,
      consent: 'notice',
      toFields: (p) => ({ name: p.name }),
    });
    postForm.mockResolvedValueOnce(ok);
    await expect(
      notice(IDLE_FORM_STATE, formData({ ...valid, consent: '' })),
    ).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });
  });

  it('200 + FAILED → error/failed with the visitor-safe message', async () => {
    postForm.mockResolvedValueOnce({ ...ok, status: 'FAILED', error: 'This opening is closed.' });
    const state = await action(IDLE_FORM_STATE, formData(valid));
    expect(state).toEqual({
      status: 'error',
      result: { kind: 'failed', error: 'This opening is closed.' },
      values: echoed,
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it.each([
    [{ kind: 'tripped' }],
    [{ kind: 'captcha' }],
    [{ kind: 'off' }],
    [{ kind: 'unauthorized' }],
    [{ kind: 'unavailable', cause: 'timeout' }],
    [{ kind: 'invalid', message: 'Invalid form fields' }],
  ])('passes %o through as an error state with the echoed values', async (result) => {
    postForm.mockResolvedValueOnce(result);
    const state = await action(IDLE_FORM_STATE, formData(valid));
    expect(state).toEqual({ status: 'error', result, values: echoed });
  });

  it('maps the three kinds of throw from toFields: field-coded refusal, visitor refusal, door failure, crash', async () => {
    const make = (thrower: () => never) =>
      createFormAction({ key: 'careers', schema, toFields: thrower });
    expect(
      await make(() => {
        throw new FormActionError('', { name: 'cv', code: 'file' });
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({ status: 'fieldErrors', errors: { cv: 'file' }, values: echoed });
    expect(
      await make(() => {
        throw new FormActionError('CV must be a PDF under 3 MB.');
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({
      status: 'error',
      result: { kind: 'failed', error: 'CV must be a PDF under 3 MB.' },
      values: echoed,
    });
    expect(
      await make(() => {
        throw new FormDoorError({ kind: 'off' });
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({ status: 'error', result: { kind: 'off' }, values: echoed });
    const boom = new Error('boom');
    expect(
      await make(() => {
        throw boom;
      })(IDLE_FORM_STATE, formData(valid)),
    ).toEqual({
      status: 'error',
      result: { kind: 'unavailable', cause: 'server' },
      values: echoed,
    });
    expect(console.error).toHaveBeenCalledWith('[forms] toFields threw', boom, {
      formKey: 'careers',
    });
    expect(postForm).not.toHaveBeenCalled();
  });

  it('hands toFields the parsed object, the raw FormData and ctx { visitor, locale } (uploads reuse the visitor)', async () => {
    const toFields = vi.fn((p: z.infer<typeof schema>) => ({ name: p.name }));
    const withCtx = createFormAction({ key: 'fraud', schema, toFields });
    getLocale.mockResolvedValueOnce('en');
    postForm.mockResolvedValueOnce(ok);
    const fd = formData(valid);
    await expect(withCtx(IDLE_FORM_STATE, fd)).rejects.toMatchObject({ digest: 'NEXT_REDIRECT' });
    expect(toFields).toHaveBeenCalledTimes(1);
    const [parsed, data, ctx] = toFields.mock.calls[0] as unknown as [
      z.infer<typeof schema>,
      FormData,
      { visitor: unknown; locale: unknown },
    ];
    expect(parsed).toMatchObject({ name: 'Ali Veli', email: 'ali@example.com' });
    expect(data).toBe(fd);
    expect(ctx).toEqual({ visitor: { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' }, locale: 'en' });
    expect(postForm.mock.calls[0][1].locale).toBe('en');
  });

  it('never echoes a File and never validates the internal keys', async () => {
    const fd = formData({ ...valid });
    fd.append('cv', new File([new Uint8Array(8)], 'cv.pdf', { type: 'application/pdf' }));
    postForm.mockResolvedValueOnce({ kind: 'tripped' });
    const state = await action(IDLE_FORM_STATE, fd);
    expect(state).toEqual({ status: 'error', result: { kind: 'tripped' }, values: echoed });
  });

  it('falls back to the default locale, a null ip for a non-IP hop, and no sourcePath without a referer', async () => {
    getLocale.mockResolvedValueOnce('de');
    headersStore.set('x-forwarded-for', 'unknown');
    headersStore.delete('referer');
    postForm.mockResolvedValueOnce(ok);
    await expect(action(IDLE_FORM_STATE, formData(valid))).rejects.toMatchObject({
      digest: 'NEXT_REDIRECT',
    });
    const [, envelope, visitor] = postForm.mock.calls[0];
    expect(envelope.locale).toBe('tr');
    expect(envelope.sourcePath).toBeUndefined();
    expect(visitor).toEqual({ ip: null, ua: 'Mozilla/5.0 test' });
    expect(redirect.mock.calls[0][0]).toMatchObject({ locale: 'tr' });
  });
});
