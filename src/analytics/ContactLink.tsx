'use client';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { contactKindOf, useContactClick, type ContactPlacement } from './useContactClick';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick' | 'onAuxClick'> & {
  href: string;
  placement: ContactPlacement;
  children: ReactNode;
};

/** The anchor every tel:/wa.me/mailto: link renders through (chrome now, pages and the form
 *  fallback panel in WP2b). Same-tab by default (R22); callers pass `target`/`rel` for wa.me.
 *  A non-contact href is a plain anchor with no handler, so a social row can map over it.
 *  `onAuxClick` (Minor 4) catches the middle-click (`button === 1`) that opens a `target="_blank"`
 *  wa.me link in a background tab without ever firing a `click` event; a right-click's `auxclick`
 *  (`button === 2`, the context-menu open) fires nothing, same as today. */
export function ContactLink({ href, placement, children, ...rest }: Props) {
  const fire = useContactClick(placement);
  const kind = contactKindOf(href);
  const onAuxClick = kind
    ? (e: MouseEvent<HTMLAnchorElement>) => {
        if (e.button === 1) fire(kind);
      }
    : undefined;
  return (
    <a {...rest} href={href} onClick={kind ? () => fire(kind) : undefined} onAuxClick={onAuxClick}>
      {children}
    </a>
  );
}
