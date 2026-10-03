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
