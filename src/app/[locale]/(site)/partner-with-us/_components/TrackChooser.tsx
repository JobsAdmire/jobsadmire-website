'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Fragment, useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { track } from '@/analytics/track';
import {
  DEFAULT_TRACK,
  isPartnerTrack,
  trackFromHash,
  trackHash,
  type TrackKey,
} from '../_lib/tracks';
import { TrackIcon } from './icons';

export type TrackCard = { key: TrackKey; title: string; body: string; cta: string };

/** Per track: the selected border + 4 px halo (+ the pale ground the design gives the chosen
 *  row on phones), the icon tile and the CTA line — the design's #1899D5 / #16a34a / #35468a
 *  accents; every text colour on white is AA (D20). */
const ACCENT: Record<TrackKey, { on: string; icon: string; cta: string }> = {
  hr: {
    on: 'border-blue ring-4 ring-tint max-md:bg-pale-1',
    icon: 'bg-tint text-blue',
    cta: 'text-blue-safe',
  },
  sourcing: {
    on: 'border-success ring-4 ring-success-surface max-md:bg-pale-1',
    icon: 'bg-success-surface text-success',
    cta: 'text-success-text',
  },
  institute: {
    on: 'border-[#35468a] ring-4 ring-[#edf1f9] max-md:bg-pale-1',
    icon: 'bg-[#edf1f9] text-[#35468a]',
    cta: 'text-[#35468a]',
  },
};
const OFF = 'border-border-2 hover:border-tint-border';
/** ≤ 700 the design's `.ja-track` is a compact ROW, not a stacked card (Partner With Us ll.
 *  320–327, QA W220 P-04): `grid 40px 1fr 20px`, gaps 12 / 3, padding 13 × 14, radius 15, no
 *  shadow; the icon spans both rows in column 1, the 16 px title and the clamped 12.5 px body
 *  stack in column 2, and the CTA line becomes a chevron in column 3 — every row sits in an
 *  explicit cell, since auto-placement would put the body beside the title. All `max-md:` twins
 *  (1:1 values, D19); the pale chosen ground stays on `ACCENT.*.on`. */
const CARD =
  'flex h-full cursor-pointer flex-col rounded-lg border-[1.5px] bg-white p-7 shadow-[0_8px_24px_rgba(22,60,90,0.06)] xl:shadow-[0_6px_18px_rgba(22,60,90,0.06)] transition-[border-color,box-shadow] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-safe max-md:grid max-md:grid-cols-[40px_1fr_20px] max-md:items-center max-md:gap-x-3 max-md:gap-y-[3px] max-md:px-3.5 max-md:py-[13px] max-md:rounded-[15px] max-md:shadow-none';
const ICON_BOX =
  'mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-sm max-md:mb-0 max-md:h-10 max-md:w-10 max-md:col-start-1 max-md:row-start-1 max-md:row-span-2 max-md:self-center max-md:rounded-[12px]';
/** The design's phone chevron (`.ja-track > span:last-child::after`: "›", "⌄" on the chosen row)
 *  as an SVG — U+2304 is outside Archivo's cmap and a bare `text-[24px]` would trip the desktop
 *  twins scan — coloured by the track's CTA accent, shown ≤ 700 only (`md:hidden`, W119). */
const CHEVRON =
  'md:hidden max-md:col-start-3 max-md:row-start-1 max-md:row-span-2 max-md:justify-self-end';
const WAYFINDER =
  'm-0 mb-3 flex items-center gap-2 text-body-sm font-extrabold uppercase tracking-[1.1px] xl:tracking-[0.825px] text-text-tertiary';

function subscribeHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
const hashTrack = () => trackFromHash(window.location.hash);
const noHashOnServer = () => null;

/** The design's phone-only step bubble ("1 Who are you?", "2 Your application"). */
function Step({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-pill bg-ink text-[11.5px] xl:text-[11px] tracking-normal text-white"
    >
      {n}
    </span>
  );
}

/**
 * "Three ways to partner" (W96: a plain client component that server-renders the HR panel;
 * Turbopack groups it into the route's page chunk — 7,327 B gz with the forms kernel, the sticky
 * bar and the marquee, accepted by W193/W194): a radiogroup of card radios and, under
 * `#track-detail`, exactly ONE of the three server-rendered panels (the design's `sc-if`). The
 * panel is keyed by track, so switching remounts the form — no typed value and no fallback
 * state crosses from one track's form to another's. State: the visitor's choice → the last
 * `#track-<key>` fragment seen (a later `#tracks`/`#apply-*` fragment keeps it, W194) → the HR
 * default. The fragment is read through
 * `useSyncExternalStore` with a `null` server snapshot (R18), so the server and the hydrating
 * client both render the HR panel and no state is set in an effect. `partner_track_select`
 * fires for the two `partner` tracks only (W67: the enum is `sourcing | institute`); a choice
 * is mirrored into the URL with `replaceState` (no history entry, no scroll), and the page is
 * never scrolled on a choice — the arrow keys move a radio group (D20).
 */
export function TrackChooser({
  legend,
  applyLabel,
  cards,
  panels,
}: {
  /** partner.064 — the radiogroup's name, shown as step 1 on phones */
  legend: string;
  /** partner.070 — step 2 on phones */
  applyLabel: string;
  cards: TrackCard[];
  panels: Record<TrackKey, ReactNode>;
}) {
  const legendId = useId();
  const locale = useLocale();
  const page = usePathname() ?? '/'; // next/navigation: the real URL (R35)
  const fromHash = useSyncExternalStore(subscribeHash, hashTrack, noHashOnServer);
  const [chosen, setChosen] = useState<TrackKey | null>(null);
  // The last `#track-<key>` fragment seen: a later non-track fragment (#tracks, #apply-*, #faq —
  // the hero/sticky/closing CTAs and the panel's own jump link) must not drop a deep-linked
  // visitor back to the HR panel and what they typed. Adjusted during render, never in an
  // effect (R18); no event (W67). T5 review I1, W194.
  const [linked, setLinked] = useState<TrackKey | null>(null);
  if (fromHash !== null && fromHash !== linked) setLinked(fromHash);
  const current = chosen ?? fromHash ?? linked ?? DEFAULT_TRACK;

  const choose = (key: TrackKey) => {
    setChosen(key);
    // Next keeps its router state in `history.state`; handing it back unchanged keeps
    // back/forward intact while only the fragment changes.
    window.history.replaceState(window.history.state, '', trackHash(key));
    if (isPartnerTrack(key)) track('partner_track_select', { page, locale, track: key });
  };

  return (
    <div>
      <fieldset
        role="radiogroup"
        aria-labelledby={legendId}
        data-testid="partner-track-chooser"
        className="m-0 min-w-0 border-0 p-0"
      >
        <legend id={legendId} className={`${WAYFINDER} p-0 md:sr-only`}>
          <Step n={1} />
          {legend}
        </legend>
        <div className="grid gap-3 md:gap-6 lg:grid-cols-3">
          {cards.map((card) => {
            const on = card.key === current;
            const accent = ACCENT[card.key];
            const id = `track-${card.key}`;
            return (
              <div key={card.key} className="relative">
                <input
                  type="radio"
                  id={id}
                  name="partner-track"
                  value={card.key}
                  checked={on}
                  onChange={() => choose(card.key)}
                  aria-labelledby={`${id}-title`}
                  aria-describedby={`${id}-body`}
                  className="peer sr-only scroll-mt-28"
                />
                <label htmlFor={id} className={`${CARD} ${on ? accent.on : OFF}`}>
                  <span aria-hidden="true" className={`${ICON_BOX} ${accent.icon}`}>
                    <TrackIcon track={card.key} />
                  </span>
                  <span
                    id={`${id}-title`}
                    className="block text-card-title font-extrabold text-ink max-md:col-start-2 max-md:row-start-1 max-md:text-[16px] max-md:tracking-[-0.2px]"
                  >
                    {card.title}
                  </span>
                  <span
                    id={`${id}-body`}
                    className="mt-2 block flex-1 text-body-sm text-text-secondary max-md:mt-0 max-md:col-start-2 max-md:row-start-2 max-md:text-[12.5px] max-md:leading-[1.4] max-md:line-clamp-2"
                  >
                    {card.body}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-4 block text-body-sm font-extrabold max-md:hidden ${accent.cta}`}
                  >
                    {card.cta}
                  </span>
                  <span aria-hidden="true" className={`${CHEVRON} ${accent.cta}`}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                      className={on ? 'rotate-90' : undefined}
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <div
        id="track-detail"
        data-testid="partner-track-detail"
        data-track={current}
        className="mt-8 scroll-mt-24 md:mt-10"
      >
        <p className={`${WAYFINDER} md:hidden`}>
          <Step n={2} />
          {applyLabel}
        </p>
        <Fragment key={current}>{panels[current]}</Fragment>
      </div>
    </div>
  );
}
