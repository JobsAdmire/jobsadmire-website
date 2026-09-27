import { afterEach, describe, expect, it, vi } from 'vitest';
import robots from './robots';
import { routing } from '@/i18n/routing';
import { robotsDisallowPaths, UNBUILT_PATHNAMES } from '@/lib/seo/routes';

function disallow(): string[] {
  const rules = robots().rules;
  const rule = Array.isArray(rules) ? rules[0] : rules;
  const d = rule.disallow ?? [];
  return Array.isArray(d) ? d : [d];
}

describe('robots', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('disallows /api/ and robotsDisallowPaths() for both locales, and points at the sitemap', () => {
    const d = disallow();
    expect(d[0]).toBe('/api/');
    expect(d).toContain('/tesekkurler');
    expect(d).toContain('/en/thank-you');
    const expected = routing.locales.flatMap((locale) => robotsDisallowPaths(locale));
    expect(d.slice(1)).toEqual(expected);
    for (const path of d) expect(path).not.toContain('[');
    expect(robots().sitemap).toBe('https://www.jobsadmire.com/sitemap.xml');
  });

  it('never names a path that does not exist yet (W20)', () => {
    // Guarded on the set itself so this cannot rot when a page task builds the page and
    // deletes the key — the rule then appears by itself.
    const d = disallow();
    if (UNBUILT_PATHNAMES.has('/portal-login')) expect(d).not.toContain('/portal-girisi');
    if (UNBUILT_PATHNAMES.has('/blog')) expect(d).not.toContain('/blog');
    if (UNBUILT_PATHNAMES.has('/newsletter/confirm')) expect(d).not.toContain('/abone-onay');
  });

  it('blocks everything on a preview deployment', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect(disallow()).toEqual(['/']);
  });
});
