import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every sys key this page adds (W9/W23) — `messages.test.ts` proves the two files share one key
 *  set; this pins the page's own set, so a renamed key fails here, not in a dev render. */
const KEYS = [
  'seo.contact.title',
  'seo.contact.description',
  'contact.languages.tr',
  'contact.languages.en',
  'contact.languages.fr',
  'contact.languages.hi',
  'contact.languages.ru',
  'contact.channels.whatsapp',
  'contact.channels.open',
  'contact.status.openNow',
  'contact.status.closedOpensAt',
  'contact.status.closedOpensTomorrow',
  'contact.status.closedOpensOn',
  'contact.status.opensAt',
  'contact.status.waWatched',
  'contact.status.waOff',
  'contact.visit.submit',
  'contact.wa.main',
  'contact.wa.jobseeker',
  'contact.wa.visitSite',
  'contact.fallbackIntro.contact',
  'contact.fallbackIntro.callback',
  'contact.fallbackIntro.visit',
  'contact.faq.a3',
  'contact.faq.a5',
  'contact.footnote',
] as const;

type Tree = Record<string, unknown>;
const get = (obj: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Tree)[k] : undefined), obj);
const leaves = (obj: Tree, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? leaves(v as Tree, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const FILES = [
  ['tr', tr.sys],
  ['en', en.sys],
] as const;

describe('sys.contact.* + sys.seo.contact.*', () => {
  it('pins 26 keys, each a non-empty string in both locales', () => {
    expect(KEYS).toHaveLength(26);
    for (const [, sys] of FILES)
      for (const key of KEYS) {
        const v = get(sys, key);
        expect(typeof v, key).toBe('string');
        expect((v as string).length, key).toBeGreaterThan(0);
      }
  });

  it('adds nothing else under sys.contact (the list above is the whole namespace)', () => {
    const expected = KEYS.filter((k) => k.startsWith('contact.'))
      .map((k) => k.slice('contact.'.length))
      .sort();
    for (const [, sys] of FILES) expect(leaves(sys.contact as Tree).sort()).toEqual(expected);
  });

  it('is ICU-safe: no ASCII apostrophe (a quote escape in next-intl), typographic ’ only', () => {
    for (const [, sys] of FILES)
      for (const key of KEYS) expect(get(sys, key), key).not.toMatch(/'/);
  });

  it('the live-status templates carry only {time} {open} {close} {day} — LiveStatus fills them on the client without ICU, so sys.contact stays out of CLIENT_SYS (W148)', () => {
    for (const [, sys] of FILES)
      for (const key of [
        'openNow',
        'closedOpensAt',
        'closedOpensTomorrow',
        'closedOpensOn',
        'opensAt',
        'waWatched',
        'waOff',
      ]) {
        const v = get(sys, `contact.status.${key}`) as string;
        expect(v.replace(/\{(time|open|close|day)\}/g, ''), key).not.toMatch(/[{}#]/);
      }
  });

  it('declares exactly the arguments the page and the island pass', () => {
    for (const [, sys] of FILES) {
      const args = (key: string) =>
        [...(get(sys, key) as string).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      expect(args('contact.status.openNow')).toEqual(['close', 'time']);
      expect(args('contact.status.closedOpensAt')).toEqual(['open', 'time']);
      expect(args('contact.status.closedOpensTomorrow')).toEqual(['open']);
      expect(args('contact.status.closedOpensOn')).toEqual(['day', 'open']);
      expect(args('contact.status.opensAt')).toEqual(['open']);
      expect(args('contact.faq.a3')).toEqual(['hours', 'replyHours']);
      expect(args('contact.faq.a5')).toEqual([]);
    }
  });

  it('the endonym chips are identical in both files (a language names itself)', () => {
    expect(get(tr.sys, 'contact.languages')).toEqual(get(en.sys, 'contact.languages'));
  });

  it('types no figure into the copy (D17): numbers come from the metrics and the offices rows', () => {
    for (const [, sys] of FILES)
      for (const key of KEYS)
        expect((get(sys, key) as string).replace('B2B', ''), key).not.toMatch(/\d/);
  });
});
