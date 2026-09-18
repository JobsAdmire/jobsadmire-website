import type { MouseEventHandler } from 'react';
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
}: {
  item: ChromeNavItem;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }
  if (item.href.startsWith('/')) {
    return (
      // prefetch={false} on every chrome link: Next still prefetches on hover, so
      // navigation stays instant, but the eager `_rsc` requests leave the first load (R47c).
      <Link href={item.href as Href} prefetch={false} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className} onClick={onClick}>
      {item.label}
    </a>
  );
}
