import { afterEach, describe, expect, it } from 'vitest';
import { alternateHrefToPath, readAlternateHref } from '../use-alternate-path';

function addAlternate(hreflang: string, href: string) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'alternate');
  link.setAttribute('hreflang', hreflang);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

afterEach(() => {
  document.head.querySelectorAll('link[rel="alternate"]').forEach((l) => l.remove());
});

describe('readAlternateHref (W17)', () => {
  it('returns the hreflang tag for the locale, or null when the page has none', () => {
    expect(readAlternateHref('en')).toBeNull();
    addAlternate('tr', 'https://www.jobsadmire.com/blog/sezonluk-isgucu');
    addAlternate('en', 'https://www.jobsadmire.com/en/blog/seasonal-workforce');
    addAlternate('x-default', 'https://www.jobsadmire.com/blog/sezonluk-isgucu');
    expect(readAlternateHref('en')).toBe('https://www.jobsadmire.com/en/blog/seasonal-workforce');
    expect(readAlternateHref('tr')).toBe('https://www.jobsadmire.com/blog/sezonluk-isgucu');
  });
});

describe('alternateHrefToPath', () => {
  it('keeps only the path and query, so a preview host never links to production', () => {
    expect(alternateHrefToPath('https://www.jobsadmire.com/en/blog/x?utm=1')).toBe(
      '/en/blog/x?utm=1',
    );
    expect(alternateHrefToPath('https://www.jobsadmire.com/')).toBe('/');
    expect(alternateHrefToPath('/en/about')).toBe('/en/about');
  });
  it('is null for nothing or garbage', () => {
    expect(alternateHrefToPath(null)).toBeNull();
    expect(alternateHrefToPath('')).toBeNull();
    expect(alternateHrefToPath('http://[')).toBeNull();
  });
});
