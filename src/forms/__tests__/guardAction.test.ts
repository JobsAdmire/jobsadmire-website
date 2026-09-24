import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardAction } from '../client/guardAction';
import { IDLE_FORM_STATE, type FormActionState } from '../types';

const formData = (entries: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) fd.append(k, v);
  return fd;
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('guardAction', () => {
  it('passes an answer through untouched', async () => {
    const answer: FormActionState = {
      status: 'fieldErrors',
      errors: { name: 'required' },
      values: {},
    };
    const guarded = guardAction(vi.fn(async () => answer));
    expect(await guarded(IDLE_FORM_STATE, formData({}))).toBe(answer);
  });

  it('turns a rejection into unavailable/network with the typed strings echoed (no internal keys, no files)', async () => {
    const guarded = guardAction(
      vi.fn(async (): Promise<FormActionState> => {
        throw new TypeError('Failed to fetch');
      }),
    );
    const fd = formData({
      name: 'Ayşe',
      consent: 'on',
      honeypot: '',
      'cf-turnstile-response': 'tok_1',
      $ACTION_ID_abc: '',
    });
    fd.append('cv', new File([new Uint8Array(4)], 'cv.pdf', { type: 'application/pdf' }));
    expect(await guarded(IDLE_FORM_STATE, fd)).toEqual({
      status: 'error',
      result: { kind: 'unavailable', cause: 'network' },
      values: { name: 'Ayşe', consent: 'on' },
    });
    expect(console.error).toHaveBeenCalledWith(
      '[forms] the form action rejected',
      expect.any(TypeError),
    );
  });

  it('rethrows a Next redirect — the D13 success path must still navigate', async () => {
    const redirect = Object.assign(new Error('NEXT_REDIRECT'), {
      digest: 'NEXT_REDIRECT;push;/tesekkurler?form=hire;307;',
    });
    const guarded = guardAction(
      vi.fn(async (): Promise<FormActionState> => {
        throw redirect;
      }),
    );
    await expect(guarded(IDLE_FORM_STATE, formData({ name: 'Ayşe' }))).rejects.toBe(redirect);
  });
});
