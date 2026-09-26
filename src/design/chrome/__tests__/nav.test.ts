import { describe, expect, it } from 'vitest';
import { BLOG_NAV_THRESHOLD, blogNavVisible, navGroup } from '../nav';
import {
  BLOG_NAV_THRESHOLD as CANONICAL_THRESHOLD,
  blogNavVisible as canonicalBlogNavVisible,
} from '@/content/collections';
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
const enOnly = (i: number) => post(100 + i, false);

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

const STORE = 'https://play.google.com/store/apps/details?id=com.jobsadmire.portal';

describe('nav groups (W4, W11)', () => {
  it('reads one group, sorted by order, with labels resolved through t() and external passed through', () => {
    const b = bundleWith([
      item('footerEmployers', 3, STORE, 'hire.240'),
      // W88: the portal row is internal — the chooser page links out, the chrome never does
      item('footerEmployers', 2, '/portal-login', 'home.012'),
      item('footerEmployers', 0, '/hire-workers', 'home.002'),
      item('footerEmployers', 1, '/verify', 'home.011'),
      item('desktopNav', 0, '/hire-workers', 'home.002'),
    ]);
    expect(navGroup(b, 'footerEmployers', t)).toEqual([
      { href: '/hire-workers', label: '<home.002>', external: false },
      { href: '/verify', label: '<home.011>', external: false },
      { href: '/portal-login', label: '<home.012>', external: false },
      { href: STORE, label: '<hire.240>', external: true },
    ]);
    expect(navGroup(b, 'footerCompany', t)).toEqual([]);
  });

  it('hides /blog and /blog/[slug] from every group while under the Turkish-body threshold', () => {
    const b = bundleWith(
      [
        item('slimBarRight', 0, '/blog', 'home.013'),
        item('slimBarRight', 1, '/careers', 'home.009'),
        item('hamburger', 0, '/blog/[slug]'),
      ],
      trBodies(BLOG_NAV_THRESHOLD - 1),
    );
    expect(blogNavVisible(b)).toBe(false);
    expect(navGroup(b, 'slimBarRight', t).map((i) => i.href)).toEqual(['/careers']);
    expect(navGroup(b, 'hamburger', t)).toEqual([]);
  });

  it('shows the blog once the threshold is met, counting Turkish bodies only', () => {
    const under = bundleWith(
      [item('footerCompany', 0, '/blog', 'home.013')],
      [...trBodies(BLOG_NAV_THRESHOLD - 1), enOnly(0), enOnly(1)],
    );
    expect(blogNavVisible(under)).toBe(false);
    const at = bundleWith(
      [item('footerCompany', 0, '/blog', 'home.013')],
      trBodies(BLOG_NAV_THRESHOLD),
    );
    expect(blogNavVisible(at)).toBe(true);
    expect(navGroup(at, 'footerCompany', t).map((i) => i.href)).toEqual(['/blog']);
  });

  it('treats a missing blog collection as zero bodies and is the one W4 source (W35)', () => {
    expect(blogNavVisible(bundleWith([]))).toBe(false);
    expect(BLOG_NAV_THRESHOLD).toBe(6);
    expect(BLOG_NAV_THRESHOLD).toBe(CANONICAL_THRESHOLD);
    expect(blogNavVisible).toBe(canonicalBlogNavVisible);
  });
});
