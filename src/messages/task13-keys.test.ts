import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import type { Locale } from '@/i18n/routing';
import en from './en.json';
import tr from './tr.json';

/**
 * T13's `sys.*` keys (W9/W23). Every one is read by a server component through
 * `getTranslations('sys')` — never by a client island (W90/W148) — so a missing key would render
 * a MISSING_MESSAGE string that no e2e text check reliably catches. Pinned per locale here, each
 * formatted through next-intl itself with an `onError` that throws.
 */
const MESSAGES: Record<Locale, Messages> = { tr, en };

const PORTAL_KEYS = ['seo.portal.title', 'seo.portal.description', 'portal.intro', 'portal.signIn'];

function translator(locale: Locale) {
  return createTranslator({
    locale,
    messages: MESSAGES[locale],
    namespace: 'sys',
    onError: (error) => {
      throw error;
    },
  });
}

describe('T13 sys keys — portal entry (W9/W23)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: every key is a non-empty, fully formatted string`, () => {
      const t = translator(locale);
      for (const key of PORTAL_KEYS) {
        const value = t(key);
        expect(value.trim().length, key).toBeGreaterThan(0);
        expect(value, key).not.toMatch(/[{}]/);
      }
    });
  }
});
