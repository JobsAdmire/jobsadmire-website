import { describe, expect, it } from 'vitest';
import { navGroup } from '../nav';
import fixture from '../../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema, type Bundle } from '../../../../contract/website-bundle.v1';

const t = (id: string) => `<${id}>`;
type NavRow = Bundle['nav'][number];

/** A full T0b blog row (Task 1's BlogPostSchema, + `body` per W28). */
const post = (i: number, tr: boolean) => ({
  key: `post-${i}`,
  slug: { tr: tr ? `yazi-${i}` : null, en: `post-${i}` },
  title: { tr: tr ? `Yazı ${i}` : null, en: `Post ${i}` },
  excerpt: { tr: tr ? `Özet ${i}` : null, en: `Excerpt ${i}` },
  category: 'workPermits',
  categoryLabelId: 'home.001',
  author: 'JobsAdmire',
  publishedAt: '2026-06-12',
  readMinutes: 5,
  hasBody: { tr, en: true },
  body: { tr: tr ? `Gövde ${i}` : null, en: `Body ${i}` },
});
const trBodies = (n: number) => Array.from({ length: n }, (_, i) => post(i, true));

function bundleWith(nav: NavRow[], blog: Record<string, unknown>[] = []): Bundle {
  return BundleSchema.parse({ ...fixture, nav, collections: { ...fixture.collections, blog } });
}
const item = (
  group: NavRow['group'],
  order: number,
  href: string,
  labelId = 'home.010',
): NavRow => ({
  group,
  order,
  labelId,
  href,
  external: href.startsWith('http'),
  visibleOn: ['desktop', 'mobile'],
});

const PORTAL = 'https://portal.jobsadmire.com/auth/login';
const STORE = 'https://play.google.com/store/apps/details?id=com.jobsadmire.portal';

describe('nav groups (W4, W11)', () => {
  it('reads one group, sorted by order, with labels resolved through t() and external passed through', () => {
    const b = bundleWith([
      item('footerEmployers', 3, STORE, 'hire.240'),
      // the portal login row is external (owner 2026-10-05)
      item('footerEmployers', 2, PORTAL, 'home.012'),
      item('footerEmployers', 0, '/hire-workers', 'home.002'),
      item('footerEmployers', 1, '/verify', 'home.011'),
      item('desktopNav', 0, '/hire-workers', 'home.002'),
    ]);
    expect(navGroup(b, 'footerEmployers', t)).toEqual([
      { href: '/hire-workers', label: '<home.002>', external: false },
      { href: '/verify', label: '<home.011>', external: false },
      { href: PORTAL, label: '<home.012>', external: true },
      { href: STORE, label: '<hire.240>', external: true },
    ]);
    expect(navGroup(b, 'footerCompany', t)).toEqual([]);
  });

  it('never drops /blog from a nav group, whatever the blog holds (owner 2026-10-05)', () => {
    for (const blog of [[], trBodies(1), trBodies(8)]) {
      const b = bundleWith(
        [
          item('slimBarRight', 0, '/blog', 'home.013'),
          item('slimBarRight', 1, '/careers', 'home.009'),
          item('hamburger', 0, '/blog'),
          item('footerCompany', 0, '/blog', 'home.013'),
        ],
        blog,
      );
      expect(navGroup(b, 'slimBarRight', t).map((i) => i.href)).toEqual(['/blog', '/careers']);
      expect(navGroup(b, 'hamburger', t).map((i) => i.href)).toEqual(['/blog']);
      expect(navGroup(b, 'footerCompany', t).map((i) => i.href)).toEqual(['/blog']);
    }
  });
});
