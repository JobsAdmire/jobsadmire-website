import type { MouseEventHandler, ReactNode } from 'react';
import { Link, type Href } from '@/i18n/navigation';

export type ChromeNavItem = { href: string; label: string; external: boolean };

/** One branch for every chrome nav row (desktop, hamburger, footer columns), so an
 *  `external: true` bundle entry can never render as an internal `Link` in one placement
 *  and an anchor in another. Mirrors `Button`'s branching, including the R22 tail: a
 *  `tel:`/`mailto:` href stays a same-tab anchor. */
export function NavLink({
  item,
  className,
  onClick,
  icon,
  iconEnd,
  current,
}: {
  item: ChromeNavItem;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** A decorative glyph before the label (the slim bar's shield / login pills). */
  icon?: ReactNode;
  /** A decorative glyph after the label (the hamburger's portal row →). */
  iconEnd?: ReactNode;
  /** `aria-current="page"` — the desktop nav's active row (`ActiveNavLink`). */
  current?: boolean;
}) {
  const label =
    icon || iconEnd ? (
      <>
        {icon}
        {item.label}
        {iconEnd}
      </>
    ) : (
      item.label
    );
  const aria = current ? ({ 'aria-current': 'page' } as const) : {};
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        {...aria}
      >
        {label}
      </a>
    );
  }
  if (item.href.startsWith('/')) {
    return (
      // prefetch={false} on every chrome link: Next still prefetches on hover, so
      // navigation stays instant, but the eager `_rsc` requests leave the first load (R47c).
      <Link
        href={item.href as Href}
        prefetch={false}
        className={className}
        onClick={onClick}
        {...aria}
      >
        {label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className} onClick={onClick} {...aria}>
      {label}
    </a>
  );
}
