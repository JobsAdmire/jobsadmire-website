import type { pathnames } from '@/i18n/routing';
import type { Settings } from '../../../contract/website-bundle.v1';

/** The four legal page records (`PAGE_KEYS`), in footer order. */
export const LEGAL_DOCS = ['privacy', 'terms', 'kvkk', 'cookiePolicy'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

/** Each document's internal pathname — equal to `PAGE_PATHNAME[doc]` (pinned by a test), typed
 *  as the literal keys `Breadcrumbs` and `buildMetadata` accept as an `Href`. */
export const LEGAL_HREF = {
  privacy: '/privacy',
  terms: '/terms',
  kvkk: '/kvkk',
  cookiePolicy: '/cookie-policy',
} as const satisfies Record<LegalDoc, keyof typeof pathnames>;

/**
 * W109/W176: the legal pages have no package of their own, so their Home crumb is the string
 * every other page's own crumb carries — "Ana Sayfa" / "Home" (`hire.020`, `about.021`,
 * `contact.023`, … hold the same text per locale; `documents.test.ts` pins it). Never
 * `sys.nav.home` ("Ana sayfa", a different capitalisation): the BreadcrumbList names would
 * differ by case across the site.
 */
export const LEGAL_HOME_CRUMB_ID = 'about.021';

/**
 * Section ids — the `sys.legal.<doc>.sections.<id>.{title,body}` keys, in document order.
 * Privacy: the old site's sections renumbered 1–15 (its headings skipped and repeated numbers —
 * 3, 5, 6→7, 10→12 — and its "special categories" note is folded into `dataCategories`).
 * Terms: the old site's sixteen, as they were. KVKK: none until counsel's text (a placeholder).
 * Cookie policy: the minimal notice spec §10 row 6 names.
 */
export const LEGAL_SECTIONS: Readonly<Record<LegalDoc, readonly string[]>> = {
  privacy: [
    'dataController',
    'scope',
    'dataCategories',
    'purposes',
    'cookies',
    'disclosures',
    'transfers',
    'retention',
    'rights',
    'security',
    'verbis',
    'children',
    'thirdParty',
    'changes',
    'contact',
  ],
  terms: [
    'legalStatus',
    'services',
    'eligibility',
    'accounts',
    'candidateDuties',
    'employerDuties',
    'fees',
    'ip',
    'acceptableUse',
    'dataProtection',
    'thirdParty',
    'availability',
    'liability',
    'indemnification',
    'law',
    'amendments',
  ],
  kvkk: [],
  cookiePolicy: ['essential', 'consent', 'manage'],
};

/** D17: the identifiers the legal copy cites — the ICU arguments `{email}`, `{phoneDisplay}`,
 *  `{permitNo}`, `{lawRef}`, `{taxNo}` — always from settings, never typed into the copy. */
export type LegalValues = {
  email: string;
  phoneDisplay: string;
  permitNo: string;
  lawRef: string;
  taxNo: string;
};

export function legalValues(settings: Settings): LegalValues {
  return {
    email: settings.email,
    phoneDisplay: settings.phoneDisplay,
    permitNo: settings.licence.permitNo,
    lawRef: settings.licence.lawRef,
    taxNo: settings.licence.taxNo,
  };
}
