import { useTranslations } from 'next-intl';
import { getCollection } from '@/content/collections';
import { nationalityName, newestFirst, type PoolCandidate } from '@/content/pool-candidates';
import { makeTf } from '@/content/pure';
import { isFlagCode } from '@/design/assets/flag-codes';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { SampleTag } from '@/design/blocks/SampleTag';
import { Flag } from '@/design/Flag';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { LiveDot } from '../components/LiveDot';
import { PoolMarquee } from '../components/PoolMarquee';
import { SAMPLE_POOL } from '../lib/samples';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

/** The card's 170 px photo band (127.5 px from 1101, D19), a fixed height the slot covers. */
const PHOTO = { base: 170, xl: 128 };
/** Real cards on the marquee (owner 2026-11-02): the eight newest. */
export const HOME_POOL_CARDS = 8;

/** One marquee card's data, whichever the source: the sample's package ids resolved, or a real
 *  candidate's own words in this locale. */
type MarqueeCard = {
  ref: string;
  /** the real candidate's display name; absent on the sample */
  name?: string;
  trade: string;
  /** ISO-2 for the flag, when there is one */
  flag: string | null;
  country: string;
  photo: string | null;
  tags: string[];
};

const CARD_LINK =
  'ja-hover-card relative mr-4 flex w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-border-2 bg-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-xs:mr-3 max-xs:w-[270px] xl:mr-3 xl:w-[225px] xl:rounded-[16.5px]';

/**
 * "Live candidates" (design ll. 487–527). Two sources, one switch (`src/content/pool-feed.ts`):
 * - `candidates` (POOL_SOURCE=OPS, owner 2026-11-02): the eight newest real candidates — the
 *   feed's photo in the `pool-<ref>` slot (its placeholder when there is none), the display name
 *   over the position, the nationality's flag chip, years and the first skill; no sample tag, and
 *   the footer button counts the real profiles (`sys.workers.card.browseAll`, D17: a number is
 *   data). An empty feed keeps the head and the footer doors, no track.
 * - `null` / absent: the design's six sample profiles (page-local `SAMPLE_POOL`, package ids —
 *   never the `pool` collection, D23) with the `SampleTag` beside the eyebrow and a labelled
 *   placeholder per photo slot.
 * Each card is one link to the Available Workers page: the "LIVE" pill, the ref and "View profile
 * →". `PoolMarquee` runs the track; the footer row is the live note and the blue browse button.
 * Nothing on a card names who sourced the candidate (firewall).
 */
export function PoolSection({
  locale,
  bundle,
  candidates = null,
}: SectionProps & { candidates?: readonly PoolCandidate[] | null }) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const countries = new Map(getCollection(bundle, 'sourceCountries').map((c) => [c.code, c.name]));
  const real = candidates !== null;
  const data: MarqueeCard[] = real
    ? newestFirst(candidates)
        .slice(0, HOME_POOL_CARDS)
        .map((c) => ({
          ref: c.ref,
          name: c.name,
          trade: c.position.label[locale],
          flag: c.nationality,
          country: nationalityName(c, locale, countries),
          photo: c.photo?.url ?? null,
          tags: [
            c.yearsExperience !== null ? sys('home.pool.years', { n: c.yearsExperience }) : '',
            c.skills[0] ?? '',
          ].filter(Boolean),
        }))
    : SAMPLE_POOL.map((w) => ({
        ref: w.ref,
        trade: tf(w.tradeId),
        flag: w.country,
        country: countries.get(w.country) ?? w.country,
        photo: null,
        tags: [sys('home.pool.years', { n: w.years }), w.tagId ? tf(w.tagId) : (w.tag ?? '')],
      }));
  const cards = data.map((w) => (
    <Link
      key={w.ref}
      prefetch={false}
      href="/available-workers"
      data-pool-card={w.ref}
      className={CARD_LINK}
    >
      <div className="relative bg-[linear-gradient(160deg,#16294f,#0d1834)]">
        {w.name && !w.photo ? (
          // a real candidate without a photo: the band's own dark ground, never the labelled
          // "image to be added" placeholder on a live card
          <div aria-hidden="true" className="h-[170px] xl:h-[128px]" />
        ) : (
          <ImageSlot
            slot={`pool-${w.ref}`}
            src={w.photo}
            alt=""
            width={300}
            height={170}
            cover={PHOTO}
            className={w.photo ? 'object-[50%_25%]' : undefined}
          />
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,20,40,0.8)_100%)]"
        />
        {w.country && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-[7px] rounded-pill border border-white/20 bg-night/75 px-3 py-[5px] text-[11.5px] font-extrabold text-white backdrop-blur-[4px] xl:left-[9px] xl:top-[9px] xl:text-[11px]">
            {w.flag && isFlagCode(w.flag) ? <Flag code={w.flag} size={17} /> : null}
            {w.country}
          </span>
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-pill border border-mint/40 bg-night/75 px-[11px] py-[5px] text-[10.5px] font-extrabold text-mint backdrop-blur-[4px] xl:right-[9px] xl:top-[9px] xl:text-[11px]">
          <LiveDot />
          {tf('home.222')}
        </span>
        <span className="absolute inset-x-3.5 bottom-3 flex flex-col gap-0.5 xl:inset-x-[10.5px] xl:bottom-[9px]">
          {w.name && (
            <span className="truncate font-display text-[19px] font-extrabold leading-[1.1] tracking-[-0.5px] text-white xl:text-[14.25px]">
              {w.name}
            </span>
          )}
          <span
            className={
              w.name
                ? 'truncate text-[13px] font-bold leading-[1.2] text-white/85 xl:text-[11px]'
                : 'font-display text-[19px] font-extrabold leading-[1.1] tracking-[-0.5px] text-white xl:text-[14.25px]'
            }
          >
            {w.trade}
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-[18px] pb-[18px] pt-4 xl:px-[13.5px] xl:pb-[13.5px]">
        <span className="flex flex-wrap gap-1.5">
          {w.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-edge-soft bg-pale-1 px-[11px] py-1 text-[11.5px] font-bold text-[#43536a] xl:text-[11px]"
            >
              {tag}
            </span>
          ))}
        </span>
        <span className="mt-auto flex items-center justify-between gap-2.5 border-t border-border-3 pt-3">
          <span className="text-[11.5px] font-extrabold tracking-[0.5px] text-text-tertiary xl:text-[11px]">
            {w.ref}
          </span>
          <span className="text-[12px] font-extrabold text-blue-safe xl:text-[11px]">
            {tf('home.065')}
          </span>
        </span>
      </div>
    </Link>
  ));
  const footer = (
    <>
      <span className="inline-flex items-center gap-2 text-[13px] font-bold text-text-tertiary xl:text-[11px]">
        <LiveDot />
        {tf('home.066')}
      </span>
      <Button prefetch={false} variant="primary" href="/available-workers">
        {real ? sys('workers.card.browseAll', { count: candidates.length }) : tf('home.067')}
      </Button>
    </>
  );
  return (
    <Section tone="light" id="candidates" className="ja-reveal">
      <div data-testid="pool" data-pool-source={real ? 'ops' : 'sample'} className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Eyebrow>{tf('home.062')}</Eyebrow>
              {!real && <SampleTag />}
            </div>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.063')}</h2>
          </div>
          <Button prefetch={false} variant="nav" href="/available-workers">
            {tf('home.064')}
          </Button>
        </div>
        {cards.length > 0 ? (
          <PoolMarquee
            pauseLabel={sys('marquee.pause')}
            playLabel={sys('marquee.play')}
            footer={footer}
          >
            {cards}
          </PoolMarquee>
        ) : (
          <div className="mt-[26px] flex flex-wrap items-center justify-center gap-3.5 xl:mt-[19.5px]">
            {footer}
          </div>
        )}
      </div>
    </Section>
  );
}
