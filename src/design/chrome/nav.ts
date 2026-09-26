import { blogNavVisible } from '@/content/collections';
import type { Bundle, NavItem } from '../../../contract/website-bundle.v1';
import type { ChromeNavItem } from './NavLink';

/** W35: one W4 source of truth. The threshold and the visibility test live in
 *  `src/content/collections.ts` (T0b — they read the `blog` collection through
 *  `getCollection`); the chrome re-exports them so no chrome caller has to know where the
 *  collection is parsed. Until then `/blog` is also `noindex` (`src/lib/seo/routes.ts`) — one
 *  number, two consumers is deliberate; the index/noindex flip is a manual step (T12/WP-C). */
export { BLOG_NAV_THRESHOLD, blogNavVisible } from '@/content/collections';

const BLOG_HREFS: ReadonlySet<string> = new Set(['/blog', '/blog/[slug]']);

/** One nav group of the bundle as chrome items: sorted by `order`, labels resolved through
 *  `t()`, `external` passed through, the blog routes dropped below the threshold. The importer
 *  already withholds the `/blog` rows today (T0b); this is the second door — for an OPS bundle
 *  and for the day the threshold flips — so the rule can never be forgotten in one placement. */
export function navGroup(
  bundle: Bundle,
  group: NavItem['group'],
  t: (id: string) => string,
): ChromeNavItem[] {
  const showBlog = blogNavVisible(bundle);
  return bundle.nav
    .filter((n) => n.group === group && (showBlog || !BLOG_HREFS.has(n.href)))
    .sort((a, b) => a.order - b.order)
    .map((n) => ({ href: n.href, label: t(n.labelId), external: n.external }));
}
