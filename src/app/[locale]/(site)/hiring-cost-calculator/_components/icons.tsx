import type { ReactNode, SVGProps } from 'react';

/*
 * The calculator page's inline SVGs (Hiring Cost Calculator.dc.html: 39 `<svg>`s). One 24 × 24
 * viewBox, `currentColor` (the tile or note around an icon sets its colour, never the icon),
 * decorative (`aria-hidden`) — the text beside each carries the meaning. No directive: server
 * sections render these. `size` is the rendered px (design: 18 in tiles, 16 in rows/buttons).
 */

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

function Svg({
  size = 18,
  strokeWidth = 2,
  fill = 'none',
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={fill === 'none' ? 'currentColor' : 'none'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const DollarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 1v22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Svg>
);
export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);
/** the quota hint's two-person glyph */
export const UsersIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);
export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);
export const PlaneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l4 4.8-2.2 2.2-2.1-.6-.8.8 2.6 1.8 1.8 2.6.8-.8-.6-2.1 2.2-2.2 4.8 4a.5.5 0 0 0 .8-.5z" />
  </Svg>
);
export const AlertCircleIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
    <circle cx="12" cy="12" r="10" />
  </Svg>
);
export const ClockIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Svg>
);
export const TargetIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <circle cx="12" cy="12" r="6" />
  </Svg>
);
export const WalletIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </Svg>
);
export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2l3 6 7 1-5 5 1.2 7L12 18l-6.2 3 1.2-7-5-5 7-1z" />
  </Svg>
);
export const XCircleIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6" />
    <path d="M9 9l6 6" />
  </Svg>
);
export const ShieldCheckIcon = (p: IconProps) => (
  <Svg strokeWidth={2.3} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);
export const GradCapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M22 10L12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </Svg>
);
export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </Svg>
);
export const PrinterIcon = (p: IconProps) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </Svg>
);
export const WhatsAppIcon = (p: IconProps) => (
  <Svg fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.3c-.22.62-1.28 1.2-1.77 1.24-.48.05-.93.22-3.12-.65-2.64-1.04-4.31-3.73-4.44-3.9-.13-.18-1.06-1.42-1.06-2.7 0-1.29.67-1.92.91-2.18.24-.26.52-.33.7-.33h.5c.16 0 .38-.06.6.45.22.53.75 1.83.82 1.96.06.13.1.29.02.47-.09.17-.13.28-.26.44-.13.15-.28.34-.4.46-.13.13-.27.28-.12.54.15.27.68 1.12 1.46 1.81 1 .9 1.85 1.17 2.11 1.3.27.14.42.11.58-.06.15-.18.66-.77.84-1.03.17-.27.35-.22.59-.13.24.09 1.52.72 1.78.85.26.13.44.2.5.3.07.12.07.62-.14 1.16z" />
  </Svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Svg strokeWidth={3} {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

/** The design's 40 px (34 / 38 / 32 variants) rounded tile behind a card icon. */
export const TILE_TONE = {
  blue: 'bg-tint text-blue-safe',
  green: 'bg-success-surface text-success-text',
  navy: 'bg-[#edf1f9] text-[#253063]',
  amber: 'bg-[#fdf3e3] text-warning-text',
  grey: 'bg-pale-1 text-text-secondary border border-border-2',
} as const;
export type TileTone = keyof typeof TILE_TONE;

const TILE_SIZE = {
  lg: 'h-10 w-10 rounded-[12px]',
  md: 'h-[38px] w-[38px] rounded-[11px]',
  sm: 'h-[34px] w-[34px] rounded-[10px]',
  xs: 'h-8 w-8 rounded-[10px]',
} as const;

export function IconTile({
  tone,
  size = 'lg',
  className,
  children,
}: {
  tone: TileTone;
  size?: keyof typeof TILE_SIZE;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-flex shrink-0 items-center justify-center',
        TILE_SIZE[size],
        TILE_TONE[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
