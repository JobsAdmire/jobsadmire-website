'use client';
import { usePathname } from '@/i18n/navigation';
import { NavLink, type ChromeNavItem } from './NavLink';

/** True when the internal pathname is the item's route or one of its children (`/blog/[slug]`
 *  keeps "Blog" current). `/` never matches a child — it is not a desktop-nav row anyway. */
export function isCurrent(href: string, pathname: string | null): boolean {
  if (!pathname || !href.startsWith('/')) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The desktop nav row with the design's active state (SHARED 2.4: the current page's link in
 *  the brand blue with a 2.5 px underline). next-intl's internal pathname is the same on the
 *  server and in the browser for every static route, so the marked row never flips on
 *  hydration (W17). The colour is the contrast-safe blue (D20); the underline is decorative. */
export function ActiveNavLinks({
  items,
  className,
}: {
  items: ChromeNavItem[];
  className: string;
}) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className={className}
          current={isCurrent(item.href, pathname)}
        />
      ))}
    </>
  );
}
