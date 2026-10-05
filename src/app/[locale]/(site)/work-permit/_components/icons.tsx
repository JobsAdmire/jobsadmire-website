import type { ReactNode } from 'react';

/** The design's decorative strokes as SVG, always `aria-hidden`: the text beside an icon is the
 *  label (D20), and a ✓/! is never a text glyph — axe's `color-contrast` scores a glyph as text,
 *  an SVG stroke as a graphic. */
type IconProps = { size?: number; className?: string };

function Svg({
  size,
  className,
  strokeWidth = 2.2,
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
    <Svg size={size} className={className} strokeWidth={2.6}>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

export function AlertIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
      <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" />
    </Svg>
  );
}

export function InfoIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </Svg>
  );
}

export function ClockIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Svg>
  );
}

export function DocIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </Svg>
  );
}

export function FileIcon({ size = 22, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={1.8}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M8 12h8" />
      <path d="M8 8h4" />
      <path d="M8 16h6" />
    </Svg>
  );
}

export function UsersIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function UserCheckIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M20 8l2 2-4.5 4.5L15 12" />
    </Svg>
  );
}

export function BuildingIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
    </Svg>
  );
}

export function CalculatorIcon({ size = 18, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h4" />
      <path d="M8 18h8" />
    </Svg>
  );
}

export function ShieldIcon({ size = 14, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

export function WrenchIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  );
}

export function GlobeIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function LeafIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M12 2v8" />
      <path d="M4.9 10.6c-.6 5 2.6 9.4 7.1 9.4s7.7-4.4 7.1-9.4" />
      <path d="M2 10.6h20" />
    </Svg>
  );
}

export function AwardIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 13.9L17 22l-5-3-5 3 1.5-8.1" />
    </Svg>
  );
}

export function PackageIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M16.5 9.4L7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </Svg>
  );
}

export function PieIcon({ size = 22, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={1.8}>
      <path d="M21.2 15.9A10 10 0 1 1 8 2.8" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </Svg>
  );
}

export function UserIcon({ size = 20, className }: IconProps) {
  return (
    <Svg size={size} className={className} strokeWidth={2}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}
