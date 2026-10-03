import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PAGE_KEYS, PAGE_PATHNAME } from '@/content/collections';
import { testBundle } from '@/test/bundle';
import { BundleSchema } from '../../../contract/website-bundle.v1';
import {
  LEGAL_DOCS,
  LEGAL_HOME_CRUMB_ID,
  LEGAL_HREF,
  LEGAL_SECTIONS,
  legalValues,
} from './documents';

/** The generated LOCAL bundle (the `src/content/local-bundle.test.ts` pattern): `testBundle()`
 *  carries only the golden fixture's 20 strings, and the Home crumb ids live in the package. */
const localBundle = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(readFileSync(join(__dirname, `../../content/local/bundle.${locale}.json`), 'utf8')),
  );

/** Every designed page's own Home crumb (W109): each page reads its own id for the same text. */
const OWN_HOME_CRUMB_IDS = [
  'hire.020',
  'calc.001',
  'partner.016',
  'wp.021',
  'about.021',
  'verify.021',
  'jt.021',
  'contact.023',
  'availworkers.021',
  'success.022',
  'blog.022',
  'blogarticle.022',
];

describe('legal document tables (T13)', () => {
  it('the four documents are page-record keys, routed exactly as PAGE_PATHNAME says', () => {
    expect(LEGAL_DOCS).toEqual(['privacy', 'terms', 'kvkk', 'cookiePolicy']);
    for (const doc of LEGAL_DOCS) {
      expect(PAGE_KEYS).toContain(doc);
      expect(LEGAL_HREF[doc]).toBe(PAGE_PATHNAME[doc]);
    }
  });

  it('section ids are unique and in document order: privacy 15, terms 16, KVKK none, cookie 3', () => {
    expect(LEGAL_SECTIONS.privacy).toHaveLength(15);
    expect(LEGAL_SECTIONS.terms).toHaveLength(16);
    expect(LEGAL_SECTIONS.kvkk).toEqual([]);
    expect(LEGAL_SECTIONS.cookiePolicy).toEqual(['essential', 'consent', 'manage']);
    for (const doc of LEGAL_DOCS)
      expect(new Set(LEGAL_SECTIONS[doc]).size).toBe(LEGAL_SECTIONS[doc].length);
  });

  it('the identifiers the copy cites come from settings, never literals (D17)', () => {
    const { settings } = testBundle();
    expect(legalValues(settings)).toEqual({
      email: settings.email,
      phoneDisplay: settings.phoneDisplay,
      permitNo: settings.licence.permitNo,
      lawRef: settings.licence.lawRef,
      taxNo: settings.licence.taxNo,
    });
  });

  it('the Home crumb is the package string every page carries ("Ana Sayfa" / "Home"), never sys.nav.home (W109/W176)', () => {
    for (const locale of ['tr', 'en'] as const) {
      const { strings } = localBundle(locale);
      const home = strings[LEGAL_HOME_CRUMB_ID];
      expect(home, locale).toBe(locale === 'tr' ? 'Ana Sayfa' : 'Home');
      for (const id of OWN_HOME_CRUMB_IDS) expect(strings[id], `${locale} ${id}`).toBe(home);
    }
  });
});
