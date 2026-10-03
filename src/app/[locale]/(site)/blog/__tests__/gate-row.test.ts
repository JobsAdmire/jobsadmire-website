import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getCollection } from '@/content/collections';
import { BundleSchema } from '../../../../../../contract/website-bundle.v1';
import { GATE_ROUTE_TABLE } from '../../../../../../e2e/routes';
import { writtenPosts } from '../_lib/posts';

const load = (locale: 'tr' | 'en') =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src/content/local', `bundle.${locale}.json`), 'utf8'),
    ),
  );

describe('the blog gate rows (W21, B-14)', () => {
  const blogRows = GATE_ROUTE_TABLE.filter(
    (r) => r.path === '/blog' || r.path.startsWith('/blog/') || r.path.startsWith('/en/blog'),
  );

  it('sweeps both indexes and the one written article — all noindex, never audited by Lighthouse', () => {
    expect(blogRows.map((r) => r.path)).toEqual([
      '/blog',
      '/en/blog',
      '/en/blog/turkey-work-permit-process-employer-guide',
    ]);
    expect(blogRows.every((r) => !r.indexable)).toBe(true);
  });

  it('the article row is the newest written EN article; no TR article row while TR has none', () => {
    const [newest] = writtenPosts(getCollection(load('en'), 'blog'), 'en');
    expect(blogRows.find((r) => r.path.startsWith('/en/blog/'))?.path).toBe(
      `/en/blog/${newest.slug.en}`,
    );
    expect(writtenPosts(getCollection(load('tr'), 'blog'), 'tr')).toHaveLength(0);
    expect(blogRows.some((r) => r.path.startsWith('/blog/'))).toBe(false);
  });
});
