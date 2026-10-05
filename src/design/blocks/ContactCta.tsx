import type { ReactNode } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { contactKindOf } from '@/analytics/contact-kind';
// By module path, not the barrel (W147): StickyCtaBar, a client module, mounts this block, so
// whatever it imports is bundled into that client graph.
import {
  Button,
  buttonClassName,
  withIcons,
  type ButtonRadius,
  type ButtonShape,
  type ButtonVariant,
} from '@/design/primitives/Button';
import { Link, type Href } from '@/i18n/navigation';

/** The two page-level placements W12 allows next to the chrome's own. */
export type PageContactPlacement = 'page_cta' | 'office_card';

export type ContactCtaProps = {
  placement: PageContactPlacement;
  /** W82: a plain string (tel:/mailto:/wa.me, an external URL, or an internal path) or the
   *  typed object form of an internal `Href` (`{ pathname, params?, hash? }`) — the object
   *  form is never a contact door, so it always renders through the typed `Link` below. */
  href: string | Exclude<Href, string>;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  external?: boolean;
  /** W195: a page's cross-route CTA passes `false` — hover prefetch stays. */
  prefetch?: boolean;
  className?: string;
  'aria-label'?: string;
  /** SHARED 5.1: `rect` + `radius` for the design's 9–14 px rectangles; pills by default */
  shape?: ButtonShape;
  radius?: ButtonRadius;
  /** the design's hover lift (default on) */
  lift?: boolean;
  /** SHARED 5.3: a decorative glyph before / after the label */
  icon?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
};

/** A CTA in the `Button` face that fires the contact event when its href is a contact href.
 *  `tel:` / `mailto:` / `wa.me` (T0c's `contactKindOf`) render through T0c's `ContactLink` —
 *  the one anchor every contact link on the site goes through (`useContactClick(placement)`:
 *  `whatsapp_click`/`call_click`/`email_click`, `page` from `next/navigation`, R35) — wearing
 *  `buttonClassName(variant, size)`; any other string href is an ordinary `Button` link; an
 *  OBJECT href (W82 — `{ pathname: '/hire-workers', hash: '#request-form' }`) can never be a
 *  contact door, so it renders through next-intl's typed `Link` in the same face — `Button`'s
 *  `href` stays string-only (R17). No `'use client'` here: `ContactLink` is the client piece,
 *  so every block around it stays a server component (W13). `contactKindOf` comes from the pure
 *  `@/analytics/contact-kind`, never `@/analytics/useContactClick`: that module imports
 *  `usePathname`, which `next build` refuses in a server component's graph (W125). */
export function ContactCta({
  placement,
  href,
  variant = 'primary',
  size = 'md',
  external,
  prefetch,
  className,
  'aria-label': ariaLabel,
  shape,
  radius,
  lift,
  icon,
  iconEnd,
  children,
}: ContactCtaProps) {
  const look = { shape, radius, lift };
  const body = withIcons(children, icon, iconEnd);
  if (typeof href !== 'string') {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        className={buttonClassName(variant, size, className, look)}
        aria-label={ariaLabel}
      >
        {body}
      </Link>
    );
  }
  const kind = contactKindOf(href);
  if (!kind) {
    return (
      <Button
        variant={variant}
        size={size}
        href={href}
        external={external}
        prefetch={prefetch}
        className={className}
        aria-label={ariaLabel}
        shape={shape}
        radius={radius}
        lift={lift}
      >
        {body}
      </Button>
    );
  }
  return (
    <ContactLink
      href={href}
      placement={placement}
      className={buttonClassName(variant, size, className, look)}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </ContactLink>
  );
}
