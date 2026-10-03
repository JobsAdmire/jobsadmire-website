import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryStorage } from '@/test/storage';
import {
  CONSENT_DEFAULT_SCRIPT,
  CONSENT_EVENT,
  CONSENT_KEY,
  clearConsent,
  readConsent,
  writeConsent,
} from './consent';

type TestWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
};
const w = window as TestWindow;

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
  w.dataLayer = [];
  delete w.gtag;
  document.cookie = `${CONSENT_KEY}=; Max-Age=0; Path=/`;
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete w.gtag;
});

describe('readConsent', () => {
  it('is "unknown" before the visitor has chosen', () => {
    expect(readConsent()).toBe('unknown');
  });

  it('reports the stored choice', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    expect(readConsent()).toBe('denied');
  });

  it('falls back to the cookie when storage is blocked', () => {
    document.cookie = `${CONSENT_KEY}=granted; Path=/`;
    vi.stubGlobal('localStorage', {
      getItem() {
        throw new Error('private mode');
      },
    });
    expect(readConsent()).toBe('granted');
  });
});

describe('writeConsent', () => {
  it('stores the choice, sets the cookie, signals the dataLayer and notifies subscribers', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    try {
      writeConsent('granted');
    } finally {
      window.removeEventListener(CONSENT_EVENT, listener);
    }

    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(readConsent()).toBe('granted');
    expect(document.cookie).toContain(`${CONSENT_KEY}=granted`);
    expect(w.dataLayer).toEqual([{ event: 'consent_update' }]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not throw when the consent-default script never ran (gtag undefined)', () => {
    expect(w.gtag).toBeUndefined();
    expect(() => writeConsent('denied')).not.toThrow();
    expect(readConsent()).toBe('denied');
  });

  it('forwards the Consent Mode v2 update to gtag when it is defined', () => {
    const gtag = vi.fn();
    w.gtag = gtag;
    writeConsent('granted');
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  });
});

describe('clearConsent', () => {
  it('un-chooses: both records gone, subscribers told, banner back to unknown', () => {
    writeConsent('granted');
    expect(readConsent()).toBe('granted');

    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    try {
      clearConsent();
    } finally {
      window.removeEventListener(CONSENT_EVENT, listener);
    }

    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
    expect(readConsent()).toBe('unknown');
    expect(document.cookie).not.toContain(`${CONSENT_KEY}=granted`);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('re-denies through gtag so tags stop within the same page view (R39)', () => {
    const gtag = vi.fn();
    w.gtag = gtag;
    writeConsent('granted');
    gtag.mockClear();

    clearConsent();

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  });

  it('does not throw when the consent-default script never ran (gtag undefined)', () => {
    expect(w.gtag).toBeUndefined();
    expect(() => clearConsent()).not.toThrow();
  });
});

describe('CONSENT_DEFAULT_SCRIPT (W225: a stored grant is re-applied on every page load)', () => {
  type Entry = ArrayLike<unknown>;
  const run = () => {
    w.dataLayer = [];
    // The inline <head> script, evaluated the way the browser does: globals only.
    new Function(CONSENT_DEFAULT_SCRIPT)();
    return (w.dataLayer as unknown as Entry[]).map((e) => Array.from(e));
  };
  const updates = (entries: unknown[][]) =>
    entries.filter((e) => e[0] === 'consent' && e[1] === 'update');
  const GRANTED = {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  };

  it('always sets the denied defaults first, and adds nothing when the visitor has not chosen', () => {
    const entries = run();
    expect(entries[0][0]).toBe('consent');
    expect(entries[0][1]).toBe('default');
    expect((entries[0][2] as Record<string, unknown>).analytics_storage).toBe('denied');
    expect(updates(entries)).toEqual([]);
  });

  it('re-applies a grant stored in localStorage, after the defaults', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    const entries = run();
    expect(updates(entries)).toEqual([['consent', 'update', GRANTED]]);
    expect(entries.findIndex((e) => e[1] === 'update')).toBeGreaterThan(
      entries.findIndex((e) => e[1] === 'default'),
    );
  });

  it('falls back to the cookie when storage holds nothing', () => {
    document.cookie = `${CONSENT_KEY}=granted; Path=/`;
    expect(updates(run())).toEqual([['consent', 'update', GRANTED]]);
  });

  it('leaves a stored "denied" (or a look-alike cookie value) on the defaults', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    expect(updates(run())).toEqual([]);
    localStorage.removeItem(CONSENT_KEY);
    document.cookie = `${CONSENT_KEY}=granted_later; Path=/`;
    expect(updates(run())).toEqual([]);
  });

  it('never throws when storage is blocked — the defaults still run', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    const entries = run();
    expect(entries[0][1]).toBe('default');
    expect(updates(entries)).toEqual([]);
  });
});
