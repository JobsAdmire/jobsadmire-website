import type { ReactNode } from 'react';

/** The page's line glyphs, lifted from the design (decorative: the step titles carry the
 *  meaning, so every one is `aria-hidden`). */
function Line({
  size,
  strokeWidth,
  className,
  children,
}: {
  size: number;
  strokeWidth: number;
  className?: string;
  children: ReactNode;
}) {
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
      className={className}
    >
      {children}
    </svg>
  );
}

/** "What verified means" (ll. 785–807): 22 px glyphs top-right of each card — a checked document,
 *  a wrench, a video camera and, in green on the last card, an open lock. */
export const VETTING_ICONS: readonly ReactNode[] = [
  <Line key="doc" size={22} strokeWidth={1.8} className="size-5.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13l2 2 4-4" />
  </Line>,
  <Line key="wrench" size={22} strokeWidth={1.8} className="size-5.5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Line>,
  <Line key="video" size={22} strokeWidth={1.8} className="size-5.5">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </Line>,
  <Line key="lock" size={22} strokeWidth={1.8} className="size-5.5 text-success">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </Line>,
];

/** "After you pick" (ll. 839–867): the white glyph inside each gradient dot — a document, a video
 *  camera, a pen and a tick. */
export const AFTER_ICONS: readonly ReactNode[] = [
  <Line key="doc" size={16} strokeWidth={2.2} className="size-4 max-md:size-3.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </Line>,
  <Line key="video" size={16} strokeWidth={2.2} className="size-4 max-md:size-3.5">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </Line>,
  <Line key="pen" size={16} strokeWidth={2.2} className="size-4 max-md:size-3.5">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
  </Line>,
  <Line key="tick" size={16} strokeWidth={2.4} className="size-4 max-md:size-3.5">
    <path d="M20 6L9 17l-5-5" />
  </Line>,
];

/** The vetting footnote's green shield with a tick (l. 819). */
export function ShieldTickGlyph() {
  return (
    <Line size={16} strokeWidth={2.4} className="size-4 shrink-0 text-success-text">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </Line>
  );
}
