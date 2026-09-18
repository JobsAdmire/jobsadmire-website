import type { Settings } from '../../../contract/website-bundle.v1';

/** Site-wide Organization/EmploymentAgency node: İŞKUR permit, tax id, social profiles. */
export function organizationJsonLd(s: Settings, o: { name: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EmploymentAgency'],
    name: o.name,
    description: o.description,
    url: s.siteUrl,
    logo: `${s.siteUrl}/brand/ja-mark.png`,
    telephone: s.phone,
    email: s.email,
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'İŞKUR Private Employment Agency Permit',
        value: s.licence.permitNo,
      },
      { '@type': 'PropertyValue', propertyID: 'Tax No', value: s.licence.taxNo },
    ],
    sameAs: [
      s.social.instagram,
      s.social.tiktok,
      s.social.linkedin,
      s.social.facebook,
      s.telegramUrl,
      `https://wa.me/${s.whatsappNumber}`,
    ],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Adnan Menderes Blv. No 7/6',
        addressLocality: 'Muratpaşa, Antalya',
        addressCountry: 'TR',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Shahrah-e-Faisal',
        addressLocality: 'Karachi',
        addressCountry: 'PK',
      },
    ],
  };
}

export const websiteJsonLd = (s: Settings) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: s.siteUrl,
  name: 'JobsAdmire',
  inLanguage: ['tr', 'en'],
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

/** AEO only — FAQ rich results are no longer shown for commercial sites (docs/SEO.md). */
export const faqJsonLd = (pairs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pairs.map((p) => ({
    '@type': 'Question',
    name: p.q,
    acceptedAnswer: { '@type': 'Answer', text: p.a },
  })),
});
