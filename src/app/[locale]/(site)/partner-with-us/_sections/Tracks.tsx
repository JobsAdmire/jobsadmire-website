import type { ReactNode } from 'react';
import { Section } from '@/design/primitives/Section';
import { TrackChooser } from '../_components/TrackChooser';
import { TRACKS_IDS, type Tf } from '../_lib/content';
import { TRACK_KEYS, type TrackKey } from '../_lib/tracks';

/**
 * `#tracks` — the W17/W152 anchor the header CTA (`CTA_BY_PATHNAME['/partner-with-us']`), the
 * hero, the sticky bar and the closing band land on. The scroll margin clears the sticky chrome in
 * its three bands — 79 px from 1101, ≈ 114 px (slim bar + nav) at 901–1199, the phone header below
 * — the homepage lead form's values (HeroLeadForm, W152; QA W221 P-05 — a flat `scroll-mt-20`
 * landed the heading under the chrome).
 * The chooser island receives resolved strings and the three server-rendered panels; only the
 * chosen one is in the DOM (the other two ride in the RSC payload — the forms' server actions
 * cross as references).
 */
export function Tracks({ tf, panels }: { tf: Tf; panels: Record<TrackKey, ReactNode> }) {
  return (
    <Section
      tone="light"
      id="tracks"
      className="scroll-mt-[90px] lg:scroll-mt-[125px] min-[1200px]:scroll-mt-[90px]"
    >
      <div className="container-site" data-testid="partner-tracks">
        <h2 className="text-h2 m-0 mb-3 md:text-center max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
          {tf(TRACKS_IDS.heading)}
        </h2>
        <p className="m-0 mb-8 text-body text-text-tertiary md:mx-auto md:mb-11 md:max-w-[560px] md:text-center">
          <span className="max-md:hidden">{tf(TRACKS_IDS.introDesk)}</span>
          <span className="md:hidden">{tf(TRACKS_IDS.introMob)}</span>
        </p>
        <TrackChooser
          legend={tf(TRACKS_IDS.choose)}
          applyLabel={tf(TRACKS_IDS.apply)}
          cards={TRACK_KEYS.map((key) => ({
            key,
            title: tf(TRACKS_IDS.cards[key].title),
            body: tf(TRACKS_IDS.cards[key].body),
            cta: tf(TRACKS_IDS.cardCta),
          }))}
          panels={panels}
        />
      </div>
    </Section>
  );
}
