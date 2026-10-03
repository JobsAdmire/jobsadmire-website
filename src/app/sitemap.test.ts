import { beforeAll, describe, expect, it } from 'vitest';
import sitemap from './sitemap';
import { pathnames, routing } from '@/i18n/routing';
import {
  absoluteUrl,
  NOINDEX_PATHNAMES,
  UNBUILT_PATHNAMES,
  type StaticPathname,
} from '@/lib/seo/routes';

const isStatic = (href: keyof typeof pathnames): href is StaticPathname => !href.includes('[');

let urls: string[] = [];
beforeAll(async () => {
  urls = (await sitemap()).map((entry) => entry.url);
});

describe('sitemap', () => {
  it('lists the built, indexable routes in both locales', () => {
    expect(urls).toContain('https://www.jobsadmire.com/');
    expect(urls).toContain('https://www.jobsadmire.com/en');
    expect(urls).toContain('https://www.jobsadmire.com/isci-talebi');
    expect(urls).toContain('https://www.jobsadmire.com/en/hire-workers');
  });

  it('omits every noindex route (M-3) and every unbuilt route (W20), in both locales', () => {
    const excluded = [...NOINDEX_PATHNAMES, ...UNBUILT_PATHNAMES].filter(isStatic);
    expect(excluded.length).toBeGreaterThan(0);
    for (const href of excluded)
      for (const locale of routing.locales) expect(urls).not.toContain(absoluteUrl(locale, href));
  });

  it('never emits a dynamic template', () => {
    for (const url of urls) expect(url).not.toContain('[');
  });

  it('is exactly (static keys − excluded) × locales while the detail sources yield nothing (no door in the unit suite)', () => {
    const staticKeys = (Object.keys(pathnames) as (keyof typeof pathnames)[]).filter(
      (key) =>
        isStatic(key) &&
        !(NOINDEX_PATHNAMES as readonly string[]).includes(key) &&
        !UNBUILT_PATHNAMES.has(key),
    );
    expect(urls).toHaveLength(staticKeys.length * routing.locales.length);
  });
});
