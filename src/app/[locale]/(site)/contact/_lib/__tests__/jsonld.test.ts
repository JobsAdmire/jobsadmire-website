import { describe, expect, it } from 'vitest';
import { contactPageJsonLd } from '../jsonld';
import { partnerLineOf } from '@/lib/contact/partner-line';

const input = {
  name: 'Contact JobsAdmire',
  url: 'https://www.jobsadmire.com/en/contact',
  locale: 'en' as const,
  siteUrl: 'https://www.jobsadmire.com',
  phone: '+905011240340',
  partnerPhone: '+905533832549',
  email: 'info@jobsadmire.com',
  hours: { days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
};
const hoursAvailable = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '09:00',
  closes: '18:00',
};
const availableLanguage = ['tr', 'en', 'fr', 'hi', 'ru'];

describe('contactPageJsonLd', () => {
  it('names the page, its canonical URL and language, and carries the two contact points from data', () => {
    expect(contactPageJsonLd(input)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact JobsAdmire',
      url: 'https://www.jobsadmire.com/en/contact',
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', url: 'https://www.jobsadmire.com' },
      mainEntity: {
        '@type': 'Organization',
        name: 'JobsAdmire',
        url: 'https://www.jobsadmire.com',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: '+905011240340',
            email: 'info@jobsadmire.com',
            areaServed: 'TR',
            availableLanguage,
            hoursAvailable,
          },
          {
            '@type': 'ContactPoint',
            contactType: 'partnerships',
            telephone: '+905533832549',
            availableLanguage,
            hoursAvailable,
          },
        ],
      },
    });
  });
  it('carries the main line on the partnerships point while settings.partnershipsPhone is null (W176)', () => {
    const { phone: partnerPhone } = partnerLineOf({
      phone: input.phone,
      phoneDisplay: '+90 501 124 03 40',
      partnershipsPhone: null,
    });
    const node = contactPageJsonLd({ ...input, partnerPhone });
    expect(node.mainEntity.contactPoint.map((p) => p.telephone)).toEqual([
      '+905011240340',
      '+905011240340',
    ]);
  });
  it('carries no undefined value anywhere (JSON.stringify would drop it silently)', () => {
    const node = contactPageJsonLd({
      ...input,
      locale: 'tr',
      url: 'https://www.jobsadmire.com/iletisim',
      name: 'JobsAdmire ile iletişime geçin',
    });
    expect(JSON.parse(JSON.stringify(node))).toEqual(node);
  });
});
