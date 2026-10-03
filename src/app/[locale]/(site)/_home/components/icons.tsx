import type { ReactNode } from 'react';

/** The homepage's own inline glyphs, lifted from the design (the chrome's set is
 *  `@/design/chrome/icons`). Every one is decorative: the link, button or card around it carries
 *  the accessible name (D20). No directive — server sections and the islands both render them. */
type IconProps = { size?: number; className?: string };

function Glyph({ size = 18, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Glyph>
  );
}

export function UserPlusIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 11h-6" />
      <path d="M19 8v6" />
    </Glyph>
  );
}

export function ArrowsIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M21 3l-7.5 7.5" />
      <path d="M3 21l7.5-7.5" />
    </Glyph>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2l7.5 3.2v5.3c0 4.7-3.1 9-7.5 10.5-4.4-1.5-7.5-5.8-7.5-10.5V5.2z" />
      <path d="m9 12 2 2 4-4" />
    </Glyph>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
    </Glyph>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </Glyph>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Glyph>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2l2.4 5.4L20 8l-4 4 1 5.6L12 15l-5 2.6L8 12 4 8l5.6-.6z" />
    </Glyph>
  );
}

export function FileCheckIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15l2 2 4-4" />
    </Glyph>
  );
}

export function MobileIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </Glyph>
  );
}
