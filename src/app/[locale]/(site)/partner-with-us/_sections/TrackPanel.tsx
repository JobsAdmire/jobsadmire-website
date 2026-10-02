import type { ReactNode } from 'react';
import { CheckIcon } from '@/design/chrome/icons';
import { PANEL_COPY, PANEL_SHARED, type Tf } from '../_lib/content';
import { FORM_ANCHOR, type TrackKey } from '../_lib/tracks';

/** Per track: the panel's pale gradient + edge, the eyebrow colour, the asks card edge and the
 *  phone-only jump link (the design's blue / green / indigo accents, AA on their grounds). */
const LOOK: Record<TrackKey, { panel: string; eyebrow: string; edge: string; jump: string }> = {
  hr: {
    panel: 'border-tint-border bg-gradient-to-b from-pale-1 to-[#e8f3f9]',
    eyebrow: 'text-blue-safe',
    edge: 'border-tint-border',
    jump: 'border-blue-safe text-blue-safe',
  },
  sourcing: {
    panel: 'border-[#c9e8d6] bg-gradient-to-b from-[#f4fbf6] to-[#e8f6ee]',
    eyebrow: 'text-success-text',
    edge: 'border-[#c9e8d6]',
    jump: 'border-success-text text-success-text',
  },
  institute: {
    panel: 'border-[#ccd6ea] bg-gradient-to-b from-[#f6f8fc] to-[#e9eef7]',
    eyebrow: 'text-[#35468a]',
    edge: 'border-[#ccd6ea]',
    jump: 'border-[#35468a] text-[#35468a]',
  },
};

/**
 * One track's panel (the design's `sc-if` body): eyebrow, h2, lead, the ≤ 700 px "Go to the
 * application form ↓" jump link (W10: CSS, not conditional), four benefit rows (SVG ticks, never
 * text glyphs), the "What we ask from you" card (the package's bullets carry their own "· "),
 * and the track's form card as `children`.
 */
export function TrackPanel({
  track,
  tf,
  children,
}: {
  track: TrackKey;
  tf: Tf;
  children: ReactNode;
}) {
  const copy = PANEL_COPY[track];
  const look = LOOK[track];
  return (
    <div
      data-testid={`partner-panel-${track}`}
      className={`grid gap-6 rounded-hero border p-5 md:gap-8 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14 lg:p-12 ${look.panel}`}
    >
      <div className="min-w-0">
        <p
          className={`m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.6px] ${look.eyebrow}`}
        >
          {tf(copy.eyebrow)}
        </p>
        <h2 className="text-h2 m-0 mb-3">{tf(copy.heading)}</h2>
        <p className="m-0 mb-6 text-body text-text-secondary">{tf(copy.lead)}</p>
        <a
          href={`#${FORM_ANCHOR[track]}`}
          className={`mb-5 flex min-h-[46px] items-center justify-center rounded-xs border-[1.5px] border-dashed text-body font-extrabold no-underline md:hidden ${look.jump}`}
        >
          {tf(PANEL_SHARED.jump)}
        </a>
        <ul className="m-0 mb-7 flex list-none flex-col gap-3.5 p-0">
          {copy.benefits.map(([titleId, bodyId]) => (
            <li key={titleId} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-success text-white"
              >
                <CheckIcon size={13} />
              </span>
              <div className="min-w-0">
                <p className="m-0 font-extrabold text-ink">{tf(titleId)}</p>
                <p className="m-0 text-body-sm text-text-secondary">{tf(bodyId)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={`rounded-base border bg-white px-6 py-5 ${look.edge}`}>
          <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1px] text-text-tertiary">
            {tf(PANEL_SHARED.asksHeading)}
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-text-secondary">
            {copy.asks.map((id) => (
              <li key={id}>{tf(id)}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
