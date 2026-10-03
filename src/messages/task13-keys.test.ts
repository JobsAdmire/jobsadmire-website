import { createTranslator, type Messages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import type { Locale } from '@/i18n/routing';
import { LEGAL_DOCS, LEGAL_SECTIONS } from '@/lib/legal/documents';
import { NEWSLETTER_STATES, stateCopyKey } from '@/lib/newsletter/copy';
import en from './en.json';
import tr from './tr.json';

/**
 * T13's `sys.*` keys (W9/W23). Every one is read by a server component through
 * `getTranslations('sys')` — never by a client island (W90/W148; the newsletter island receives
 * resolved strings as props) — so a missing key would render a MISSING_MESSAGE string that no e2e
 * text check reliably catches. Pinned per locale here, each formatted through next-intl itself
 * with an `onError` that throws.
 */
const MESSAGES: Record<Locale, Messages> = { tr, en };

/** The five ICU arguments every legal string receives (`legalValues(settings)`, D17). */
const LEGAL_VALUES = {
  email: 'info@example.com',
  phoneDisplay: '+90 000 000 00 00',
  permitNo: '1730',
  lawRef: '4904',
  taxNo: '48422122',
};

/**
 * W175 (owner check, Preconditions): `privacy@jobsadmire.com` is published as the Privacy
 * policy's "Alternative e-mail" only while the owner has confirmed the mailbox exists. Leave
 * `true` when the controller's brief states that confirmation; set `false` when it does not —
 * Cycle 4 Step 3's W175 fallback then removes the bullet in both locales and the test below
 * expects it gone (only `{email}` stays). Cycle 6 replaces this file: keep Cycle 4's value.
 * W207 (owner, 2026-10-02): no privacy mailbox exists — info@jobsadmire.com is the only address,
 * so this stays `false` for good.
 */
const PRIVACY_MAILBOX_CONFIRMED = false;

const PORTAL_KEYS = ['seo.portal.title', 'seo.portal.description', 'portal.intro', 'portal.signIn'];

const LEGAL_KEYS = [
  'legal.updatedLabel',
  'legal.contents',
  ...LEGAL_DOCS.flatMap((doc) => [
    `seo.${doc}.title`,
    `seo.${doc}.description`,
    `legal.${doc}.title`,
    `legal.${doc}.intro`,
    `legal.${doc}.updatedAt`,
    ...LEGAL_SECTIONS[doc].flatMap((id) => [
      `legal.${doc}.sections.${id}.title`,
      `legal.${doc}.sections.${id}.body`,
    ]),
  ]),
  'legal.terms.englishOnlyNotice',
  'legal.terms.finalNote',
  'legal.kvkk.pendingTitle',
  'legal.kvkk.pendingBody',
  'legal.kvkk.privacyLink',
  'legal.privacy.cookiePolicyLink', // QA W221 LEGAL-04: the Privacy page's door to the Cookie Policy
  'legal.cookiePolicy.pendingTitle',
  'legal.cookiePolicy.pendingBody',
];

const NEWSLETTER_KEYS = [
  'seo.newsletterConfirm.title',
  'seo.newsletterConfirm.description',
  'seo.newsletterUnsubscribe.title',
  'seo.newsletterUnsubscribe.description',
  'newsletter.backHome',
  'newsletter.fallback.lead',
  'newsletter.fallback.email',
  'newsletter.fallback.whatsapp',
  'newsletter.fallback.subject',
  ...(['confirm', 'unsubscribe'] as const).flatMap((kind) => [
    `newsletter.${kind}.title`,
    `newsletter.${kind}.body`,
    `newsletter.${kind}.button`,
    `newsletter.${kind}.pending`,
    ...NEWSLETTER_STATES[kind].flatMap((state) => [
      `${stateCopyKey(kind, state)}.title`,
      `${stateCopyKey(kind, state)}.body`,
    ]),
  ]),
];

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

/** `sys.legal.<doc>` as plain data, for the structural checks. */
const legalOf = (locale: Locale) =>
  (MESSAGES[locale] as { sys: { legal: Record<string, Record<string, unknown>> } }).sys.legal;

describe('T13 sys keys (W9/W23)', () => {
  for (const locale of ['tr', 'en'] as const) {
    it(`${locale}: every portal, legal and newsletter key is a non-empty, fully formatted string`, () => {
      const t = translator(locale);
      for (const key of [...PORTAL_KEYS, ...LEGAL_KEYS, ...NEWSLETTER_KEYS]) {
        const value = t(key, LEGAL_VALUES);
        expect(value.trim().length, key).toBeGreaterThan(0);
        expect(value, key).not.toMatch(/[{}]/);
      }
    });

    it(`${locale}: every legal updatedAt is a real calendar date (D17)`, () => {
      for (const doc of LEGAL_DOCS) {
        const iso = String(legalOf(locale)[doc].updatedAt);
        expect(iso, doc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10), doc).toBe(iso);
      }
    });

    it(`${locale}: every legal body is Markdown-lite — a block is all "- " lines or none`, () => {
      const t = translator(locale);
      for (const key of LEGAL_KEYS.filter((k) => k.endsWith('.body'))) {
        for (const block of t(key, LEGAL_VALUES).split(/\n[ \t]*\n/)) {
          const lines = block
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          const listed = lines.filter((l) => l.startsWith('- ')).length;
          expect(listed === 0 || listed === lines.length, key).toBe(true);
        }
      }
    });

    it(`${locale}: the alternative privacy mailbox appears only in the privacy rights and contact sections, and only while the owner confirmed it (W175)`, () => {
      const t = translator(locale);
      const contact = t('legal.privacy.sections.contact.body', LEGAL_VALUES);
      expect(contact).toContain(LEGAL_VALUES.email);
      expect(/Alternative e-mail|Alternatif e-posta/.test(contact)).toBe(PRIVACY_MAILBOX_CONFIRMED);
      const mentions = LEGAL_KEYS.filter((key) =>
        t(key, LEGAL_VALUES).includes('privacy@jobsadmire.com'),
      );
      expect(mentions).toEqual(
        PRIVACY_MAILBOX_CONFIRMED
          ? ['legal.privacy.sections.rights.body', 'legal.privacy.sections.contact.body']
          : [],
      );
    });
  }

  it('the Turkish Terms carry the English text, spelled out in tr.json (§10 row 6, W107)', () => {
    const [trTerms, enTerms] = [legalOf('tr').terms, legalOf('en').terms];
    expect(trTerms.intro).toBe(enTerms.intro);
    expect(trTerms.finalNote).toBe(enTerms.finalNote);
    expect(trTerms.sections).toEqual(enTerms.sections);
    expect(trTerms.title).not.toBe(enTerms.title);
    expect(trTerms.englishOnlyNotice).not.toBe(enTerms.englishOnlyNotice);
  });
});
