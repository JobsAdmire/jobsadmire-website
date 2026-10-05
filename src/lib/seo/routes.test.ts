import { describe, expect, it } from 'vitest';
import { PAGE_KEYS } from '@/content/collections';
import {
  absoluteUrl,
  localeAlternates,
  NOINDEX_PATHNAMES,
  noindexExternalPaths,
  OG_PAGE_KEYS,
  pageOgImageUrl,
  robotsDisallowPaths,
} from './routes';

describe('seo routes', () => {
  it('builds absolute localized URLs (TR unprefixed, EN prefixed)', () => {
    expect(absoluteUrl('tr', '/hire-workers')).toBe('https://www.jobsadmire.com/isci-talebi');
    expect(absoluteUrl('en', '/hire-workers')).toBe('https://www.jobsadmire.com/en/hire-workers');
    expect(absoluteUrl('tr', '/')).toBe('https://www.jobsadmire.com/');
    expect(absoluteUrl('en', '/')).toBe('https://www.jobsadmire.com/en');
  });
  it('alternates include both locales and x-default = tr', () => {
    expect(localeAlternates('/about')).toEqual({
      languages: {
        tr: 'https://www.jobsadmire.com/hakkimizda',
        en: 'https://www.jobsadmire.com/en/about',
        'x-default': 'https://www.jobsadmire.com/hakkimizda',
      },
    });
  });
  it('resolves dynamic pathnames through their params', () => {
    expect(absoluteUrl('tr', { pathname: '/blog/[slug]', params: { slug: 'isgucu' } })).toBe(
      'https://www.jobsadmire.com/blog/isgucu',
    );
  });
  it('indexes the blog index (owner 2026-10-05) and keeps articles out of the index', () => {
    expect(NOINDEX_PATHNAMES).not.toContain('/blog');
    expect(NOINDEX_PATHNAMES).toContain('/blog/[slug]');
    // robots form: localized, deduped — the dynamic key becomes its parent prefix with a
    // trailing slash, so /blog itself is not disallowed
    expect(noindexExternalPaths('tr')).toEqual([
      '/tesekkurler',
      '/abone-onay',
      '/abonelikten-cik',
      '/blog/',
    ]);
    expect(noindexExternalPaths('en')).toEqual([
      '/en/thank-you',
      '/en/newsletter/confirm',
      '/en/newsletter/unsubscribe',
      '/en/blog/',
    ]);
  });
});

describe('robotsDisallowPaths (W20/W37)', () => {
  it('is noindexExternalPaths minus the unbuilt keys — today only the thank-you page', () => {
    // Guarded on the set itself so these cannot rot as page tasks delete their keys.
    const d = robotsDisallowPaths('tr');
    expect(d).toContain('/tesekkurler');
    for (const path of d) expect(noindexExternalPaths('tr')).toContain(path);
  });
  it('names the blog articles once their page exists (UNBUILT empty)', () => {
    expect(robotsDisallowPaths('tr', new Set())).toEqual(noindexExternalPaths('tr'));
    expect(robotsDisallowPaths('en', new Set())).toEqual(noindexExternalPaths('en'));
    expect(robotsDisallowPaths('en', new Set())).toContain('/en/blog/');
  });
  it('subtracts per key, before the parent-prefix fold', () => {
    // the articles' prefix rule is dropped only when the key itself is unbuilt
    expect(robotsDisallowPaths('tr', new Set(['/blog/[slug]']))).not.toContain('/blog/');
    expect(robotsDisallowPaths('tr', new Set())).toContain('/blog/');
    // Everything unbuilt: nothing to name.
    expect(robotsDisallowPaths('tr', new Set(NOINDEX_PATHNAMES))).toEqual([]);
  });
});

describe('pageOgImageUrl', () => {
  it('points at the generated PNG for a known page key, per locale', () => {
    expect(pageOgImageUrl('tr', 'home')).toBe('https://www.jobsadmire.com/og/tr/home.png');
    expect(pageOgImageUrl('en', 'hire')).toBe('https://www.jobsadmire.com/og/en/hire.png');
  });
  it('falls back to the site image for a key it does not know', () => {
    expect(OG_PAGE_KEYS.has('no-such-page')).toBe(false);
    expect(pageOgImageUrl('tr', 'no-such-page')).toBe('https://www.jobsadmire.com/og/tr/site.png');
  });
  it('is exactly PAGE_KEYS (every bundle.pages record the importer writes) plus `site`', () => {
    expect([...OG_PAGE_KEYS].sort()).toEqual(['site', ...PAGE_KEYS].sort());
  });
});
