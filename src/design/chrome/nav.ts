import type { Bundle, NavItem } from '../../../contract/website-bundle.v1';
import type { ChromeNavItem } from './NavLink';

/** One nav group of the bundle as chrome items: sorted by `order`, labels resolved through
 *  `t()`, `external` passed through. Owner 2026-10-05: `/blog` is ALWAYS in the nav (the design's
 *  slim bar, hamburger and footer Company column show it) — the W4 six-article threshold
 *  (`blogNavVisible`, `src/content/collections.ts`) no longer gates any nav row; it still gates
 *  the home Guides section and the work-permit related articles. */
export function navGroup(
  bundle: Bundle,
  group: NavItem['group'],
  t: (id: string) => string,
): ChromeNavItem[] {
  return bundle.nav
    .filter((n) => n.group === group)
    .sort((a, b) => a.order - b.order)
    .map((n) => ({ href: n.href, label: t(n.labelId), external: n.external }));
}
