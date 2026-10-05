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

/** The process journey's top-right line icons (Partner With Us ll. 913–937): a document (you
 *  apply), a video camera (the call), a closed lock (portal access), an open lock (first
 *  placement). Stroke 1.8 at 22 px, coloured by the caller (`ProcessSteps` row variant). */
export type StepIconKind = 'doc' | 'video' | 'lock' | 'unlock';
export function StepIcon({ kind, className }: { kind: StepIconKind; className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...STROKE}
      strokeWidth={1.8}
    >
      {kind === 'doc' && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </>
      )}
      {kind === 'video' && (
        <>
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </>
      )}
      {kind === 'lock' && (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </>
      )}
      {kind === 'unlock' && (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 4.5 2.8" />
        </>
      )}
    </svg>
  );
}
