import { afterEach, describe, expect, it, vi } from 'vitest';
import { articleJsonLd, faqJsonLd, jobPostingJsonLd, organizationJsonLd } from './jsonld';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../contract/website-bundle.v1';

// R13/R23: parse the fixture rather than casting it — the cast would hide a contract drift
// that the schema catches here.
const settings = BundleSchema.parse(fixture).settings;

describe('jsonld', () => {
  it('organization carries the İŞKUR permit, tax id and social profiles', () => {
    const o = organizationJsonLd(settings, {
      name: 'JobsAdmire',
      description: 'x',
    });
    expect(o['@type']).toEqual(['Organization', 'EmploymentAgency']);
    expect(JSON.stringify(o)).toContain('1730');
    expect(o.sameAs.length).toBe(6);
  });
  it('faq pairs become a FAQPage', () => {
    const f = faqJsonLd([{ q: 'Q?', a: 'A.' }]);
    expect(f.mainEntity[0].acceptedAnswer.text).toBe('A.');
  });
});

/** Deep check: JSON-LD is serialised with JSON.stringify, which silently drops `undefined`
 *  values — but a consumer reading the object (a test, a future validator) must never see one. */
function assertNoUndefined(node: unknown, path = '$'): void {
  if (node === undefined) throw new Error(`undefined at ${path}`);
  if (Array.isArray(node)) node.forEach((v, i) => assertNoUndefined(v, `${path}[${i}]`));
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) assertNoUndefined(v, `${path}.${k}`);
}

describe('articleJsonLd', () => {
  const input = {
    headline: 'Sezonluk işgücü planı',
    description: 'Özet',
    url: 'https://www.jobsadmire.com/blog/sezonluk-isgucu',
    image: 'https://www.jobsadmire.com/og/tr/blogArticle.png',
    datePublished: '2026-01-12',
    dateModified: new Date('2026-02-01T10:00:00Z'),
    authorName: 'JobsAdmire Editorial',
    publisherSettings: settings,
    locale: 'tr' as const,
  };

  it('is a BlogPosting carrying the schema.org required fields with ISO dates', () => {
    const a = articleJsonLd(input);
    expect(a['@type']).toBe('BlogPosting');
    expect(a.headline).toBe(input.headline);
    expect(a.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': input.url });
    expect(a.datePublished).toBe('2026-01-12T00:00:00.000Z');
    expect(a.dateModified).toBe('2026-02-01T10:00:00.000Z');
    expect(a.author).toEqual({ '@type': 'Person', name: input.authorName });
    expect(a.publisher.logo.url).toBe(`${settings.siteUrl}/brand/ja-mark.png`);
    expect(a.inLanguage).toBe('tr');
    assertNoUndefined(a);
  });

  it('carries no undefined keys when the optional fields are absent', () => {
    const required = { ...input, dateModified: undefined };
    const a = articleJsonLd(required);
    expect('dateModified' in a).toBe(false);
    assertNoUndefined(a);
  });

  it('accepts an Organization author', () => {
    expect(articleJsonLd({ ...input, authorType: 'Organization' }).author['@type']).toBe(
      'Organization',
    );
  });

  it('rejects an invalid date outside production', () => {
    expect(() => articleJsonLd({ ...input, datePublished: 'not-a-date' })).toThrow(RangeError);
  });
});

describe('jobPostingJsonLd', () => {
  afterEach(() => vi.unstubAllEnvs());

  const input = {
    title: 'Sales Executive (Antalya)',
    description: 'Description',
    url: 'https://www.jobsadmire.com/en/careers/sales-executive-antalya',
    datePosted: '2026-03-01',
    employmentType: 'FULL_TIME' as const,
    hiringOrganization: settings,
    jobLocation: { city: 'Antalya', country: 'TR' },
  };

  it('is a JobPosting with title, description, datePosted, hiringOrganization and jobLocation', () => {
    const j = jobPostingJsonLd(input);
    expect(j['@type']).toBe('JobPosting');
    expect(j.datePosted).toBe('2026-03-01T00:00:00.000Z');
    expect(j.employmentType).toBe('FULL_TIME');
    expect(j.hiringOrganization).toMatchObject({ '@type': 'Organization', name: 'JobsAdmire' });
    expect(j.jobLocation.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Antalya',
      addressCountry: 'TR',
    });
    expect('validThrough' in j).toBe(false);
    expect('baseSalary' in j).toBe(false);
    assertNoUndefined(j);
  });

  it('renders validThrough, a salary range and an identifier when given', () => {
    const j = jobPostingJsonLd({
      ...input,
      validThrough: new Date('2026-04-30T23:59:59Z'),
      baseSalary: { currency: 'TRY', value: { min: 40000, max: 55000 }, unitText: 'MONTH' },
      identifier: 'sales-executive-antalya',
    });
    expect(j.validThrough).toBe('2026-04-30T23:59:59.000Z');
    expect(j.baseSalary).toEqual({
      '@type': 'MonetaryAmount',
      currency: 'TRY',
      value: { '@type': 'QuantitativeValue', minValue: 40000, maxValue: 55000, unitText: 'MONTH' },
    });
    expect(j.identifier).toEqual({
      '@type': 'PropertyValue',
      name: 'JobsAdmire',
      value: 'sales-executive-antalya',
    });
    assertNoUndefined(j);
  });

  it('renders a single salary value as `value`', () => {
    const j = jobPostingJsonLd({
      ...input,
      baseSalary: { currency: 'TRY', value: 45000, unitText: 'MONTH' },
    });
    expect(j.baseSalary?.value).toEqual({
      '@type': 'QuantitativeValue',
      value: 45000,
      unitText: 'MONTH',
    });
  });

  it('omits an invalid date in production instead of crashing the page', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const j = jobPostingJsonLd({ ...input, validThrough: 'never' });
    expect('validThrough' in j).toBe(false);
    assertNoUndefined(j);
  });

  // W205 ⚠️2 (final pass P2-1): a remote opening is TELECOMMUTE; applicantLocationRequirements
  // only from countries the caller really has — never invented from the office country.
  it('a remote opening carries jobLocationType TELECOMMUTE and no invented applicant countries', () => {
    const j = jobPostingJsonLd({ ...input, remote: true });
    expect(j.jobLocationType).toBe('TELECOMMUTE');
    expect('applicantLocationRequirements' in j).toBe(false);
    // the office location stays — Google reads it beside TELECOMMUTE
    expect(j.jobLocation.address).toMatchObject({
      addressLocality: 'Antalya',
      addressCountry: 'TR',
    });
    assertNoUndefined(j);
  });

  it('names applicantLocationRequirements only when applicant countries are given — one node or a list', () => {
    const one = jobPostingJsonLd({ ...input, remote: { applicantCountries: ['Uzbekistan'] } });
    expect(one.jobLocationType).toBe('TELECOMMUTE');
    expect(one.applicantLocationRequirements).toEqual({ '@type': 'Country', name: 'Uzbekistan' });
    const two = jobPostingJsonLd({
      ...input,
      remote: { applicantCountries: ['Uzbekistan', 'Pakistan'] },
    });
    expect(two.applicantLocationRequirements).toEqual([
      { '@type': 'Country', name: 'Uzbekistan' },
      { '@type': 'Country', name: 'Pakistan' },
    ]);
    expect(
      'applicantLocationRequirements' in
        jobPostingJsonLd({ ...input, remote: { applicantCountries: [] } }),
    ).toBe(false);
    assertNoUndefined(one);
    assertNoUndefined(two);
  });

  it('an on-site opening carries no jobLocationType; a city-less one no addressLocality (never the country name)', () => {
    const onSite = jobPostingJsonLd(input);
    expect('jobLocationType' in onSite).toBe(false);
    expect('applicantLocationRequirements' in onSite).toBe(false);
    const cityless = jobPostingJsonLd({ ...input, jobLocation: { country: 'IN' } });
    expect(cityless.jobLocation.address).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    });
    expect('addressLocality' in cityless.jobLocation.address).toBe(false);
    assertNoUndefined(cityless);
  });
});
