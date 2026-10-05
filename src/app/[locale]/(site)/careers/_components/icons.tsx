import type { ReactNode } from 'react';

/** The page's own glyphs, lifted from Join Our Team (`.dc.html`). Every one is decorative —
 *  the control or text beside it carries the meaning — so all are `aria-hidden`. The chrome's
 *  shared set (`@/design/chrome/icons`) covers the arrow, chevron and WhatsApp glyphs. */
type IconProps = { size?: number; className?: string; strokeWidth?: number };

function Glyph({
  size = 16,
  className,
  strokeWidth = 2.2,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['flex-none', className].filter(Boolean).join(' ')}
    >
      {children}
    </svg>
  );
}

/** Overseas role tile (l. 711). */
export const GlobeIcon = (p: IconProps) => (
  <Glyph strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Glyph>
);

/** Antalya office role tile (l. 714). */
export const BuildingIcon = (p: IconProps) => (
  <Glyph strokeWidth={2} {...p}>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 9h.01" />
    <path d="M9 13h.01" />
    <path d="M9 17h.01" />
    <path d="M15 9h.01" />
    <path d="M15 13h.01" />
    <path d="M15 17h.01" />
  </Glyph>
);

/** The role meta line's location (l. 727). */
export const PinIcon = (p: IconProps) => (
  <Glyph strokeWidth={2.4} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </Glyph>
);

/** The hero's "Countries we work in" pin (l. 642). */
export const MapPinIcon = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </Glyph>
);

/** The role meta line's second item (l. 730). */
export const PersonIcon = (p: IconProps) => (
  <Glyph strokeWidth={2.4} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </Glyph>
);

/** "People with a real local network" (l. 904). */
export const UsersIcon = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  </Glyph>
);

/** "Languages we are short on" (l. 911). */
export const LanguagesIcon = (p: IconProps) => (
  <Glyph {...p}>
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </Glyph>
);

/** "Document and permit people" (l. 918) — with its rule line; without it, the ways note tile. */
export const FileIcon = ({ lined = false, ...p }: IconProps & { lined?: boolean }) => (
  <Glyph {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    {lined ? <path d="M9 15h6" /> : null}
  </Glyph>
);

/** The open-application card's header tile (l. 932). */
export const FileCheckIcon = (p: IconProps) => (
  <Glyph strokeWidth={2} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="m9 15 2 2 4-4" />
  </Glyph>
);

/** The portal pill's ↗ (l. 677). */
export const ExternalIcon = (p: IconProps) => (
  <Glyph strokeWidth={2.4} {...p}>
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </Glyph>
);

/** A tick (the role panel lists, the sent state). */
export const TickIcon = (p: IconProps) => (
  <Glyph strokeWidth={3.2} {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Glyph>
);
