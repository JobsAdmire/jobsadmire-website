'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { useScrollProgress } from './useScrollProgress';

export type TocHeading = { id: string; text: string };

export type ScrollSpyTocProps = {
  headings: TocHeading[];
  /** Accessible name of the <nav> (sys copy, e.g. "In this article"). */
  label: string;
  /** Optional visible eyebrow above the list. */
  heading?: string;
  readMinutes?: number;
  remainingLabel?: (minutesLeft: number) => string;
  /** W85: an ICU-free alternative to `remainingLabel` for a server caller, which cannot pass a
   *  function prop across the server/client boundary. Each template carries the literal token
   *  `{n}`; `remainingSingular` is used when exactly one minute is left, `remainingPlural`
   *  otherwise. Ignored when `remainingLabel` is given; ignored unless both are given. */
  remainingSingular?: string;
  remainingPlural?: string;
  /** Viewport offset below which a heading counts as reached (the sticky header's height). */
  offsetPx?: number;
  className?: string;
};

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/** Blog Article sidebar TOC: plain in-page anchors, the active one marked `aria-current`.
 *  "Active" = the last heading whose top has passed `offsetPx`; the first heading before any
 *  has. The remaining-time line uses the post's own read time, not the design's hard-coded 8. */
export function ScrollSpyToc({
  headings,
  label,
  heading,
  readMinutes,
  remainingLabel,
  remainingSingular,
  remainingPlural,
  offsetPx = 96,
  className,
}: ScrollSpyTocProps) {
  const first = headings[0]?.id ?? '';
  const getActive = useCallback(() => {
    let active = first;
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.getBoundingClientRect().top <= offsetPx) active = h.id;
    }
    return active;
  }, [headings, first, offsetPx]);
  const onServer = useCallback(() => first, [first]);
  const active = useSyncExternalStore(subscribe, getActive, onServer);
  const progress = useScrollProgress();
  const minutesLeft =
    readMinutes != null ? Math.max(0, Math.ceil(readMinutes * (1 - progress))) : null;
  const remainingText =
    minutesLeft == null
      ? null
      : remainingLabel
        ? remainingLabel(minutesLeft)
        : remainingSingular && remainingPlural
          ? (minutesLeft === 1 ? remainingSingular : remainingPlural).replace(
              '{n}',
              String(minutesLeft),
            )
          : null;

  return (
    <nav aria-label={label} className={className}>
      {heading ? (
        <p className="mb-2 text-eyebrow font-extrabold uppercase tracking-wide text-blue-safe">
          {heading}
        </p>
      ) : null}
      <ol className="m-0 list-none p-0">
        {headings.map((h) => {
          const current = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={current ? 'location' : undefined}
                className={[
                  'block border-l-2 py-1.5 pl-3 text-body-sm no-underline transition-colors',
                  current
                    ? 'border-blue-safe font-extrabold text-ink'
                    : 'border-border-2 text-text-secondary hover:text-ink',
                ].join(' ')}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
      {remainingText ? (
        <p className="mt-3 text-body-sm text-text-tertiary">{remainingText}</p>
      ) : null}
    </nav>
  );
}
