import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryStorage } from '@/test/storage';
import { CONSENT_EVENT, CONSENT_KEY, clearConsent, readConsent, writeConsent } from './consent';

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
});
