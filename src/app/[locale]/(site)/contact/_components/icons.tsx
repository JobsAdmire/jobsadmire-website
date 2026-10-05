import type { ReactNode } from 'react';

// The Contact design's own glyphs (inline SVG, W14) that the chrome's icon set does not carry.
// Decorative everywhere — the card, link or button around each one carries the name (D20). No
// directive: the server sections and the client islands both render them.
type IconProps = { size?: number; className?: string };

function Glyph({
  size = 18,
  className,
  filled = false,
  children,
}: IconProps & { filled?: boolean; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Glyph>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </Glyph>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Glyph>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m6 9 6 6 6-6" />
    </Glyph>
  );
}

export function PlaneIcon(props: IconProps) {
  return (
    <Glyph {...props} filled>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </Glyph>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
    </Glyph>
  );
}

// W181: the chrome itself never renders a check mark or a link glyph, so the client topic picker
// draws its own instead of importing `CheckIcon`/`LinkIcon` from the chrome icons module (which
// would ride in every route's shared chunk).
export function CheckMarkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M20 6L9 17l-5-5" />
    </Glyph>
  );
}

export function ChainLinkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </Glyph>
  );
}

/** The callback card's phone-outgoing glyph (Contact Us l. 713): the handset plus a ↗ arrow. */
export function PhoneOutgoingIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M15 3h6v6" />
      <path d="m21 3-6 6" />
    </Glyph>
  );
}

/** The Turkish flag as the design's card head draws it (Contact Us l. 951). */
export function FlagTR({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 30 20"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="11" cy="10" r="5" fill="#fff" />
      <circle cx="12.2" cy="10" r="4" fill="#E30A17" />
      <path d="M18.5 10l-3.4 1.1 2.1-2.9v3.6l-2.1-2.9z" fill="#fff" />
    </svg>
  );
}

/** The Pakistani flag (Contact Us l. 975). */
export function FlagPK({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 30 20"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="30" height="20" fill="#01411C" />
      <rect width="7.5" height="20" fill="#fff" />
      <circle cx="19.5" cy="10" r="5" fill="#fff" />
      <circle cx="21" cy="9" r="4.4" fill="#01411C" />
    </svg>
  );
}
