import { beforeAll, describe, expect, it, vi } from 'vitest';

// W250: the route renders per request (`connection()`), which needs a Next request scope.
const connection = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/server')>()),
  connection,
}));

import sitemap, { revalidate } from './sitemap';
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
  it("renders per request with the blog feed's 60 s floor (W250)", () => {
    expect(connection).toHaveBeenCalled();
    expect(revalidate).toBe(60);
  });

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

  it('is exactly (static keys − excluded) × locales + the LOCAL blog article (no careers door in the unit suite)', () => {
    const staticKeys = (Object.keys(pathnames) as (keyof typeof pathnames)[]).filter(
      (key) =>
        isStatic(key) &&
        !(NOINDEX_PATHNAMES as readonly string[]).includes(key) &&
        !UNBUILT_PATHNAMES.has(key),
    );
    // W248: the blog source lists the one written article of the LOCAL bundle (EN only).
    expect(urls).toHaveLength(staticKeys.length * routing.locales.length + 1);
    expect(urls).toContain(
      'https://www.jobsadmire.com/en/blog/turkey-work-permit-process-employer-guide',
    );
  });
});
