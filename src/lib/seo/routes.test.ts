import { describe, expect, it } from 'vitest';
import { absoluteUrl, localeAlternates } from './routes';

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
});
