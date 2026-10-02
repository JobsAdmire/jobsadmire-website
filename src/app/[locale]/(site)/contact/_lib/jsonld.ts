import type { Locale } from '@/i18n/routing';
import { LANGUAGE_CODES } from './options';

/** schema.org day names by JS getDay() index (W43). */
const SCHEMA_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type ContactPageJsonLdInput = {
  /** contact.228 */
  name: string;
  /** absoluteUrl(locale, '/contact') — never the design's /contact-us */
  url: string;
  locale: Locale;
  siteUrl: string;
  phone: string;
  /** the partner line — `partnerLineOf(settings).phone` (`@/lib/contact/partner-line`, W176/W208):
   *  `settings.partnershipsPhone`, the main line while it is null (today) */
  partnerPhone: string;
  email: string;
  /** the Antalya `offices` row's hours — the lines' hours */
  hours: { days: number[]; open: string; close: string };
};

/** The page's own node (docs/SEO.md § Pages). The site-wide Organization/EmploymentAgency node in
 *  the locale layout keeps the addresses, the permit and the social profiles; this node names the
 *  page and carries what only the contact page states — the two lines, their languages and hours —
 *  built from settings and the `offices` row, never hand-typed. */
export function contactPageJsonLd(input: ContactPageJsonLdInput) {
  const hoursAvailable = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: input.hours.days.map((d) => SCHEMA_DAYS[d]),
    opens: input.hours.open,
    closes: input.hours.close,
  };
  const availableLanguage = [...LANGUAGE_CODES];
  const contactPoint: Record<string, unknown>[] = [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: input.phone,
      email: input.email,
      areaServed: 'TR',
      availableLanguage,
      hoursAvailable,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'partnerships',
      telephone: input.partnerPhone,
      availableLanguage,
      hoursAvailable,
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: input.name,
    url: input.url,
    inLanguage: input.locale,
    isPartOf: { '@type': 'WebSite', url: input.siteUrl },
    mainEntity: { '@type': 'Organization', name: 'JobsAdmire', url: input.siteUrl, contactPoint },
  };
}
