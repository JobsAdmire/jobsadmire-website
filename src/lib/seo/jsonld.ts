import type { Locale } from '@/i18n/routing';
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
    // W226: the owner's channels only — Facebook, Instagram, LinkedIn, WhatsApp.
    sameAs: [
      s.social.facebook,
      s.social.instagram,
      s.social.linkedin,
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

/** Drops `undefined`-valued keys so a node never carries one — JSON.stringify would hide it,
 *  a validator or a test would not. Shallow: nested nodes are built through this too. */
function compact<T extends Record<string, unknown>>(node: T): T {
  return Object.fromEntries(Object.entries(node).filter(([, v]) => v !== undefined)) as T;
}

/** ISO 8601 for a schema.org date field. makeT's rule: an invalid value THROWS outside
 *  production (a data defect must fail the page locally) and is OMITTED in production (a bad
 *  CMS date must not take the page down — the node is merely less rich). */
function isoDate(value: string | Date | undefined, field: string): string | undefined {
  if (value === undefined) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    if (process.env.NODE_ENV !== 'production')
      throw new RangeError(`jsonld: ${field} is not a valid date: ${String(value)}`);
    return undefined;
  }
  return d.toISOString();
}

const publisherNode = (s: Settings) => ({
  '@type': 'Organization' as const,
  name: 'JobsAdmire',
  url: s.siteUrl,
  logo: { '@type': 'ImageObject' as const, url: `${s.siteUrl}/brand/ja-mark.png` },
});

export type ArticleJsonLdInput = {
  headline: string;
  description: string;
  url: string;
  image: string | string[];
  datePublished: string | Date;
  dateModified?: string | Date;
  authorName: string;
  authorType?: 'Person' | 'Organization';
  publisherSettings: Settings;
  locale: Locale;
};

/** Blog article pages only (docs/SEO.md § JSON-LD): a BlogPosting with the fields Google's
 *  article rich result reads. `url` is the page's canonical; `image` the OG image. */
export function articleJsonLd(input: ArticleJsonLdInput) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting' as const,
    headline: input.headline,
    description: input.description,
    image: input.image,
    url: input.url,
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': input.url },
    datePublished: isoDate(input.datePublished, 'datePublished'),
    dateModified: isoDate(input.dateModified, 'dateModified'),
    author: { '@type': input.authorType ?? ('Person' as const), name: input.authorName },
    publisher: publisherNode(input.publisherSettings),
    inLanguage: input.locale,
  });
}

/** ISO 8601 duration for schema.org (`205` → `PT3M25S`): whole seconds, hours from one hour. */
export function isoDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${sec || s === 0 ? `${sec}S` : ''}`;
}

export type VideoObjectJsonLdInput = {
  name: string;
  /** the post's excerpt; the name stands in when it is empty */
  description: string;
  /** absolute poster URL */
  thumbnailUrl: string;
  uploadDate: string | Date;
  durationSec: number;
  /** absolute file URL */
  contentUrl: string;
  /** the spoken language */
  inLanguage: string;
};

/** One VideoObject per video an article shows (W249, docs/SEO.md § JSON-LD) — beside its
 *  BlogPosting. The file is the site's own, so `contentUrl` is the MP4 itself (no `embedUrl`). */
export function videoObjectJsonLd(input: VideoObjectJsonLdInput) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'VideoObject' as const,
    name: input.name,
    description: input.description.trim() || input.name,
    thumbnailUrl: input.thumbnailUrl,
    uploadDate: isoDate(input.uploadDate, 'uploadDate'),
    duration: isoDuration(input.durationSec),
    contentUrl: input.contentUrl,
    inLanguage: input.inLanguage,
  });
}

export type JobPostingJsonLdInput = {
  title: string;
  description: string;
  url: string;
  datePosted: string | Date;
  validThrough?: string | Date;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN' | 'OTHER';
  hiringOrganization: Settings;
  /** `country` is ISO-2 upper-case (`TR`, `PK`, W40) — the value the careers catalog carries.
   *  `city` only when the opening names one: a city-less opening emits no `addressLocality`,
   *  never the country's name in its place (W205 ⚠️2). */
  jobLocation: { city?: string; country: string };
  /** W205 ⚠️2: a remote opening (the page passes it when `workModesOf(opening)` is exactly
   *  `['REMOTE']`) → `jobLocationType: 'TELECOMMUTE'`, the office `jobLocation` kept beside it.
   *  `applicantCountries` (country names) → `applicantLocationRequirements` only when the caller
   *  really has them — never invented from the office country (the careers API carries none). */
  remote?: true | { applicantCountries: readonly string[] };
  baseSalary?: {
    currency: string;
    value: number | { min: number; max: number };
    unitText: 'MONTH' | 'YEAR' | 'HOUR';
  };
  identifier?: string;
};

/** Careers DETAIL pages only, never the index (D15, docs/SEO.md § JSON-LD). */
export function jobPostingJsonLd(input: JobPostingJsonLdInput) {
  const s = input.hiringOrganization;
  const salary = input.baseSalary;
  const remote = input.remote;
  const applicantCountries = (remote && remote !== true ? remote.applicantCountries : []).map(
    (name) => ({ '@type': 'Country' as const, name }),
  );
  return compact({
    '@context': 'https://schema.org',
    '@type': 'JobPosting' as const,
    title: input.title,
    description: input.description,
    url: input.url,
    datePosted: isoDate(input.datePosted, 'datePosted'),
    validThrough: isoDate(input.validThrough, 'validThrough'),
    employmentType: input.employmentType,
    hiringOrganization: {
      '@type': 'Organization' as const,
      name: 'JobsAdmire',
      sameAs: s.siteUrl,
      logo: `${s.siteUrl}/brand/ja-mark.png`,
    },
    jobLocation: {
      '@type': 'Place' as const,
      address: compact({
        '@type': 'PostalAddress' as const,
        addressLocality: input.jobLocation.city || undefined,
        addressCountry: input.jobLocation.country,
      }),
    },
    jobLocationType: remote ? ('TELECOMMUTE' as const) : undefined,
    // one node for one country (Google's own example), a list for several
    applicantLocationRequirements:
      applicantCountries.length === 0
        ? undefined
        : applicantCountries.length === 1
          ? applicantCountries[0]
          : applicantCountries,
    baseSalary: salary
      ? {
          '@type': 'MonetaryAmount' as const,
          currency: salary.currency,
          value:
            typeof salary.value === 'number'
              ? {
                  '@type': 'QuantitativeValue' as const,
                  value: salary.value,
                  unitText: salary.unitText,
                }
              : {
                  '@type': 'QuantitativeValue' as const,
                  minValue: salary.value.min,
                  maxValue: salary.value.max,
                  unitText: salary.unitText,
                },
        }
      : undefined,
    identifier: input.identifier
      ? { '@type': 'PropertyValue' as const, name: 'JobsAdmire', value: input.identifier }
      : undefined,
  });
}
