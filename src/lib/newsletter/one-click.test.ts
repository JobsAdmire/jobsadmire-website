import { describe, expect, it } from 'vitest';
import { pathnames } from '@/i18n/routing';
import { isOneClickUnsubscribe, ONE_CLICK_PATHS } from './one-click';

describe('the newsletter paths mirror Ops NEWSLETTER_PATHS verbatim (never change one side alone)', () => {
  it('confirm and unsubscribe keep the slugs Operations prints into the mails', () => {
    expect(pathnames['/newsletter/confirm']).toEqual({
      tr: '/abone-onay',
      en: '/newsletter/confirm',
    });
    expect(pathnames['/newsletter/unsubscribe']).toEqual({
      tr: '/abonelikten-cik',
      en: '/newsletter/unsubscribe',
    });
    expect([...ONE_CLICK_PATHS]).toEqual(['/abonelikten-cik', '/en/newsletter/unsubscribe']);
  });
});

describe('isOneClickUnsubscribe (the proxy predicate, RFC 8058)', () => {
  it('matches a POST without Next-Action to either unsubscribe page', () => {
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik', false)).toBe(true);
    expect(isOneClickUnsubscribe('POST', '/en/newsletter/unsubscribe', false)).toBe(true);
    expect(isOneClickUnsubscribe('post', '/abonelikten-cik', false)).toBe(true);
  });

  it('never matches a server action, a GET, the confirm page or another spelling', () => {
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik', true)).toBe(false);
    expect(isOneClickUnsubscribe('GET', '/abonelikten-cik', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/abone-onay', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/en/newsletter/confirm', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/abonelikten-cik/', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/tr/abonelikten-cik', false)).toBe(false);
    expect(isOneClickUnsubscribe('POST', '/newsletter/unsubscribe', false)).toBe(false);
  });
});
