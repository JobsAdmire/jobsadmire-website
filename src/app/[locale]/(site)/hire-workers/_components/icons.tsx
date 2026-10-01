import type { ReactNode } from 'react';

/** Decorative marks drawn as SVG (the design's own strokes), always `aria-hidden`. Never a
 *  "✓"/"×" text glyph: axe's `color-contrast` rule scores a glyph as text — white on the success
 *  green is 3.3:1, grey on its pale disc 4.3:1 — while an SVG stroke is a graphic (D20). */
type IconProps = { size?: number; className?: string };

function Svg({
  size,
  className,
  children,
}: {
  size: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
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
