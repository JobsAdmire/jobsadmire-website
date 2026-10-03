import type { ReactNode } from 'react';

/** Decorative marks drawn as SVG (the design's own strokes), always `aria-hidden`. Never a
 *  "✓"/"×" text glyph: axe's `color-contrast` rule scores a glyph as text — white on the success
 *  green is 3.3:1, grey on its pale disc 4.3:1 — while an SVG stroke is a graphic (D20). */
type IconProps = { size?: number; className?: string };

function Svg({
  size,
  className,
  strokeWidth = 2.4,
  children,
}: {
  size: number;
  className?: string;
  strokeWidth?: number;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
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

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function CrossIcon({ size = 14, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </Svg>
  );
}

export function PinIcon({ size = 17, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </Svg>
  );
}

/** The portal block's feature-card marks (the design's own 18 px strokes, W181: page-local —
 *  this module is server-only, so neither glyph reaches a client chunk). */
export function StarIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M12 2l2.4 5.4L20 8l-4 4 1 5.6L12 15l-5 2.6L8 12 4 8l5.6-.6z" />
    </Svg>
  );
}

export function PhoneIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </Svg>
  );
}
