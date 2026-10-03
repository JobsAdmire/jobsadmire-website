import { describe, expect, it } from 'vitest';
import { buildMetadata } from './metadata';
import { absoluteUrl, pageOgImageUrl } from './routes';
import { makeT } from '@/content/pure';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../contract/website-bundle.v1';

const bundle = BundleSchema.parse(fixture);
const t = makeT(bundle);

const base = {
  locale: 'tr' as const,
  href: '/' as const,
  bundle,
  fallbackTitle: 'JobsAdmire',
  fallbackDescription: 'fallback description',
};

describe('buildMetadata', () => {
  it('takes title, description, canonical and alternates from the page record', () => {
    const md = buildMetadata({ ...base, pageKey: 'home' });
    expect(md.title).toBe(t('home.017'));
    expect(md.description).toBe(t('home.018'));
    expect(md.alternates?.canonical).toBe(absoluteUrl('tr', '/'));
    expect(md.alternates?.languages).toEqual({
      tr: absoluteUrl('tr', '/'),
      en: absoluteUrl('en', '/'),
      'x-default': absoluteUrl('tr', '/'),
    });
    expect(md.robots).toMatchObject({ index: true, follow: true });
  });

  it('honours a noindex page record', () => {
    const noindex = {
      ...bundle,
      pages: { ...bundle.pages, home: { ...bundle.pages.home, robots: 'noindex' as const } },
    };
    const md = buildMetadata({ ...base, bundle: noindex, pageKey: 'home' });
    expect(md.robots).toMatchObject({ index: false, follow: false });
  });

  it('falls back when the bundle carries no record for the page', () => {
    const md = buildMetadata({ ...base, pageKey: 'no-such-page' });
    expect(md.title).toBe('JobsAdmire');
    expect(md.description).toBe('fallback description');
    expect(md.alternates?.canonical).toBe(absoluteUrl('tr', '/'));
    expect(md.robots).toMatchObject({ index: true, follow: true });
  });

  it("uses the fallbacks when the page record's ids are '' (no package SEO string, W23/W38)", () => {
    const blank = {
      ...bundle,
      pages: { ...bundle.pages, home: { ...bundle.pages.home, titleId: '', descriptionId: '' } },
    };
    const md = buildMetadata({ ...base, bundle: blank, pageKey: 'home' });
    expect(md.title).toBe('JobsAdmire');
    expect(md.description).toBe('fallback description');
    expect(md.robots).toMatchObject({ index: true, follow: true });
  });

  // Final pass P2-8 (WP2a T4-4 P3): every generated-route image is a descriptor — url, the route's
  // fixed 1200×630 canvas and the page title as alt — on openGraph AND twitter (Twitter does not
  // inherit the OG images once a twitter block exists).
  const generated = (locale: 'tr' | 'en', pageKey: string, alt: string) => ({
    url: pageOgImageUrl(locale, pageKey),
    width: 1200,
    height: 630,
    alt,
  });

  it('points openGraph and twitter at the generated image when the record has no ogImage', () => {
    const md = buildMetadata({ ...base, pageKey: 'home' });
    const title = t(bundle.pages.home.titleId);
    expect(md.openGraph?.images).toEqual([generated('tr', 'home', title)]);
    expect(md.openGraph?.images).toEqual([
      { url: 'https://www.jobsadmire.com/og/tr/home.png', width: 1200, height: 630, alt: title },
    ]);
    expect(md.twitter?.images).toEqual([generated('tr', 'home', title)]);
    // no record at all → the generic site image, never a 404
    expect(buildMetadata({ ...base, pageKey: 'no-such-page' }).openGraph?.images).toEqual([
      {
        url: 'https://www.jobsadmire.com/og/tr/site.png',
        width: 1200,
        height: 630,
        alt: 'JobsAdmire',
      },
    ]);
  });

  it('a template page reusing its index image (W169) carries the same descriptor with its own title as alt', () => {
    const md = buildMetadata({
      ...base,
      locale: 'en',
      href: { pathname: '/blog/[slug]', params: { slug: 'work-permit-guide' } },
      pageKey: 'blogArticle',
      fallbackTitle: 'Work permit guide | JobsAdmire',
      fallbackDescription: 'excerpt',
      alternates: { en: '/en/blog/work-permit-guide' },
      openGraph: { type: 'article', images: [pageOgImageUrl('en', 'blog')] },
    });
    const image = generated('en', 'blog', 'Work permit guide | JobsAdmire');
    expect(md.openGraph?.images).toEqual([image]);
    expect(md.twitter?.images).toEqual([image]);
  });

  it('lets a record ogImage win over the generated one, and an explicit override win over both', () => {
    const withImage = {
      ...bundle,
      pages: {
        ...bundle.pages,
        home: { ...bundle.pages.home, ogImage: 'https://cdn.example/home.png' },
      },
    };
    // a record ogImage or a foreign override is not the route's canvas: url and alt only — no
    // width/height the metadata cannot vouch for
    const title = t(bundle.pages.home.titleId);
    expect(
      buildMetadata({ ...base, bundle: withImage, pageKey: 'home' }).openGraph?.images,
    ).toEqual([{ url: 'https://cdn.example/home.png', alt: title }]);
    expect(
      buildMetadata({
        ...base,
        bundle: withImage,
        pageKey: 'home',
        openGraph: { images: ['https://cdn.example/override.png'] },
      }).openGraph?.images,
    ).toEqual([{ url: 'https://cdn.example/override.png', alt: title }]);
  });

  it('honours per-locale alternates for a per-locale-slug detail page (D16)', () => {
    const md = buildMetadata({
      ...base,
      href: { pathname: '/blog/[slug]', params: { slug: 'sezonluk-isgucu' } },
      pageKey: 'blogArticle',
      alternates: {
        tr: { pathname: '/blog/[slug]', params: { slug: 'sezonluk-isgucu' } },
        en: { pathname: '/blog/[slug]', params: { slug: 'seasonal-workforce' } },
      },
    });
    expect(md.alternates?.canonical).toBe('https://www.jobsadmire.com/blog/sezonluk-isgucu');
    expect(md.alternates?.languages).toEqual({
      tr: 'https://www.jobsadmire.com/blog/sezonluk-isgucu',
      en: 'https://www.jobsadmire.com/en/blog/seasonal-workforce',
      'x-default': 'https://www.jobsadmire.com/blog/sezonluk-isgucu',
    });
  });

  it('keeps the self-reference and drops the missing locale for a single-language article', () => {
    const md = buildMetadata({
      ...base,
      locale: 'en',
      href: { pathname: '/blog/[slug]', params: { slug: 'only-in-english' } },
      pageKey: 'blogArticle',
      alternates: { en: '/en/blog/only-in-english' },
    });
    expect(md.alternates?.languages).toEqual({
      en: 'https://www.jobsadmire.com/en/blog/only-in-english',
      'x-default': 'https://www.jobsadmire.com/en/blog/only-in-english',
    });
    // an absolute string is used verbatim; the page's own locale is filled from `href` when omitted
    const self = buildMetadata({
      ...base,
      href: { pathname: '/careers/[slug]', params: { slug: 'satis' } },
      pageKey: 'careersDetail',
      alternates: { en: 'https://www.jobsadmire.com/en/careers/sales' },
    });
    expect(self.alternates?.languages).toEqual({
      tr: 'https://www.jobsadmire.com/kariyer/satis',
      en: 'https://www.jobsadmire.com/en/careers/sales',
      'x-default': 'https://www.jobsadmire.com/kariyer/satis',
    });
  });

  it('emits og:type article with its dates and authors on request, website otherwise', () => {
    const article = buildMetadata({
      ...base,
      pageKey: 'blogArticle',
      openGraph: {
        type: 'article',
        publishedTime: '2026-01-12T00:00:00.000Z',
        modifiedTime: '2026-02-01T10:00:00.000Z',
        authors: ['JobsAdmire Editorial'],
      },
    });
    expect(article.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-01-12T00:00:00.000Z',
      modifiedTime: '2026-02-01T10:00:00.000Z',
      authors: ['JobsAdmire Editorial'],
    });
    expect(buildMetadata({ ...base, pageKey: 'home' }).openGraph).toMatchObject({
      type: 'website',
    });
  });
});
