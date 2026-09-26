'use client';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { contactKindOf, useContactClick, type ContactPlacement } from './useContactClick';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  href: string;
  placement: ContactPlacement;
  children: ReactNode;
};

/** The anchor every tel:/wa.me/mailto: link renders through (chrome now, pages and the form
 *  fallback panel in WP2b). Same-tab by default (R22); callers pass `target`/`rel` for wa.me.
 *  A non-contact href is a plain anchor with no handler, so a social row can map over it. */
export function ContactLink({ href, placement, children, ...rest }: Props) {
  const fire = useContactClick(placement);
  const kind = contactKindOf(href);
  return (
    <a {...rest} href={href} onClick={kind ? () => fire(kind) : undefined}>
      {children}
    </a>
  );
}
