import { useTranslations } from 'next-intl';
import { getCollection } from '@/content/collections';
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

/**
 * "Live candidates" (design ll. 487–527). Owner 2026-10-05: until the Available Workers feed is
 * live (Phase B) the section shows the design's six sample profiles (page-local `SAMPLE_POOL`,
 * package ids — never the `pool` collection, D23) with the `SampleTag` beside the eyebrow. Each
 * card: the `pool-<ref>` photo slot as a labelled placeholder (never a real photo), the flag chip
 * (country name and flag from `sourceCountries`), the "LIVE" pill, the trade, two tags, the ref and
 * "View profile →", all one link to the Available Workers page. `PoolMarquee` runs the track; the
 * footer row is the live note and the blue "Browse 14+ live profiles →".
 */
export function PoolSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const countries = new Map(getCollection(bundle, 'sourceCountries').map((c) => [c.code, c.name]));
  const cards = SAMPLE_POOL.map((w) => (
    <Link
      key={w.ref}
      prefetch={false}
      href="/available-workers"
      data-pool-card={w.ref}
      className="ja-hover-card relative mr-4 flex w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-border-2 bg-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-xs:mr-3 max-xs:w-[270px] xl:mr-3 xl:w-[225px] xl:rounded-[16.5px]"
    >
      <div className="relative bg-[linear-gradient(160deg,#16294f,#0d1834)]">
        <ImageSlot
          slot={`pool-${w.ref}`}
          src={null}
          alt=""
          width={300}
          height={170}
          cover={PHOTO}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,20,40,0.8)_100%)]"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-[7px] rounded-pill border border-white/20 bg-night/75 px-3 py-[5px] text-[11.5px] font-extrabold text-white backdrop-blur-[4px] xl:left-[9px] xl:top-[9px] xl:text-[11px]">
          {isFlagCode(w.country) ? <Flag code={w.country} size={17} /> : null}
          {countries.get(w.country) ?? w.country}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-pill border border-mint/40 bg-night/75 px-[11px] py-[5px] text-[10.5px] font-extrabold text-mint backdrop-blur-[4px] xl:right-[9px] xl:top-[9px] xl:text-[11px]">
          <LiveDot />
          {tf('home.222')}
        </span>
        <span className="absolute inset-x-3.5 bottom-3 font-display text-[19px] font-extrabold leading-[1.1] tracking-[-0.5px] text-white xl:inset-x-[10.5px] xl:bottom-[9px] xl:text-[14.25px]">
          {tf(w.tradeId)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-[18px] pb-[18px] pt-4 xl:px-[13.5px] xl:pb-[13.5px]">
        <span className="flex flex-wrap gap-1.5">
          {[sys('home.pool.years', { n: w.years }), w.tagId ? tf(w.tagId) : (w.tag ?? '')].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-pill border border-edge-soft bg-pale-1 px-[11px] py-1 text-[11.5px] font-bold text-[#43536a] xl:text-[11px]"
              >
                {tag}
              </span>
            ),
          )}
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
  return (
    <Section tone="light" id="candidates" className="ja-reveal">
      <div data-testid="pool" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Eyebrow>{tf('home.062')}</Eyebrow>
              <SampleTag />
            </div>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.063')}</h2>
          </div>
          <Button prefetch={false} variant="nav" href="/available-workers">
            {tf('home.064')}
          </Button>
        </div>
        <PoolMarquee
          pauseLabel={sys('marquee.pause')}
          playLabel={sys('marquee.play')}
          footer={
            <>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-text-tertiary xl:text-[11px]">
                <LiveDot />
                {tf('home.066')}
              </span>
              <Button prefetch={false} variant="primary" href="/available-workers">
                {tf('home.067')}
              </Button>
            </>
          }
        >
          {cards}
        </PoolMarquee>
      </div>
    </Section>
  );
}
