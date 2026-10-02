import type { TrackKey } from '../_lib/tracks';

// W14: inline glyphs lifted from the design, never hot-linked images. Decorative: the control
// or text beside each one carries the accessible name (D20).
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** The track cards' icons: a building (HR agencies), a globe (sourcing), a cap (institutes). */
export function TrackIcon({ track }: { track: TrackKey }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...STROKE}
    >
      {track === 'hr' && (
        <>
          <path d="M3 21V8l6-4 6 4v13" />
          <path d="M15 21V11l6 4v6" />
          <path d="M7 12h2" />
          <path d="M7 16h2" />
        </>
      )}
      {track === 'sourcing' && (
        <>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M2.5 12h19" />
          <path d="M12 2.5a15 15 0 0 1 0 19a15 15 0 0 1 0-19z" />
        </>
      )}
      {track === 'institute' && (
        <>
          <path d="M12 3L2 8l10 5 10-5-10-5z" />
          <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
        </>
      )}
    </svg>
  );
}

/** The hero's languages line. */
export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...STROKE}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
