import type { ReactNode } from 'react';
import { makeTf } from '@/content/pure';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import { MetricStrip } from '@/design/blocks/MetricStrip';
import { Button, buttonClassName } from '@/design/primitives/Button';
import { Link } from '@/i18n/navigation';
import { LiveDot } from '../components/LiveDot';
import { HERO_PHOTO } from '../lib/assets';
import { hasRows } from '../lib/phase-a';
import type { SectionProps } from './types';

/**
 * The cinematic hero (design lines 361–445): the full-bleed photo slot under the design's two
 * overlays, the badge, the three-line h1 (the package splits it into home.018–020 on purpose, the
 * `<br/>`s are authored), the sub, the CTAs and the metric strip. The right column is the
 * `#proposal` lead card, passed in as `form` so the page owns the server actions (Cycle 2).
 * D26: while `v4-hero` is a placeholder the h1 carries the page's one `data-lcp-slot`;
 * `HERO_PHOTO` moves it onto the image. W10: the badge and the CTA row are hidden at ≤ 460 px by
 * class, exactly as the design's `.ja-hero-1` / `.ja-hero-cta-primary` rules do.
 */
export function Hero({ locale, bundle, form }: SectionProps & { form: ReactNode }) {
  const tf = makeTf(bundle, locale);
  const photoIsLcp = HERO_PHOTO !== null;
  return (
    <section
      data-testid="hero"
      className="relative flex min-h-[660px] flex-col justify-end overflow-hidden bg-[#0a1428] text-white max-xs:min-h-0 xl:min-h-[495px]"
    >
      {/* W129: the slot owns its 16:9 box; this wrapper only pins it behind the hero. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <ImageSlot
          slot="v4-hero"
          lcp={photoIsLcp}
          src={HERO_PHOTO}
          alt=""
          width={1600}
          height={900}
          sizes="100vw"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,40,0.95)_0%,rgba(10,20,40,0.88)_50%,rgba(10,20,40,0.7)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.5)_0%,transparent_30%,rgba(10,20,40,0.75)_100%)]"
      />
      <div className="container-site relative grid w-full items-center gap-[34px] pb-8 pt-10 xs:pb-11 xs:pt-[72px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-[42px] xl:pb-[33px] xl:pt-[54px]">
        <div className="min-w-0">
          <p className="mb-[26px] inline-flex items-center gap-2.5 rounded-pill border border-white/30 px-[18px] py-2 text-[12.5px] font-bold uppercase tracking-[0.6px] max-xs:hidden xl:mb-5 xl:px-[13.5px] xl:py-1.5 xl:text-[11px]">
            <LiveDot />
            {tf('home.017')}
          </p>
          <h1
            data-testid="page-h1"
            data-lcp-slot={photoIsLcp ? undefined : 'h1'}
            className="m-0 mb-5 max-w-[620px] text-h1 leading-none tracking-[-2.4px] text-white text-pretty max-xs:leading-[1.06] max-xs:tracking-[-1.2px] xl:mb-[15px] xl:max-w-[465px] xl:tracking-[-1.8px]"
          >
            {tf('home.018')}
            <br />
            {tf('home.019')}
            <br />
            <span className="text-[#4fc1f0]">{tf('home.020')}</span>
          </h1>
          <p className="m-0 mb-7 max-w-[520px] text-body-lg text-white/78 max-xs:text-body xl:mb-[21px] xl:max-w-[390px]">
            {tf('home.021')}
          </p>
          <div className="flex flex-wrap items-center gap-3 max-xs:hidden">
            {/* R22: an in-page anchor stays a plain <a>, never the typed Link. */}
            <a href="#proposal" className={buttonClassName('primary', 'lg')}>
              {tf('home.022')}
            </a>
            <Button prefetch={false} variant="inverse" size="lg" href="/available-workers">
              {tf('home.023')}
            </Button>
            <span className="ml-1.5 text-body-sm font-bold text-white/60">{tf('home.024')}</span>
          </div>
        </div>
        <div className="min-w-0">{form}</div>
      </div>
      <HeroStats locale={locale} bundle={bundle} />
    </section>
  );
}

/** The design's stats bar: W1 metrics through `MetricStrip` (dark tone; an unsigned metric is
 *  hidden, never 0). The fourth design cell ("All cases are public →") is a claim about the
 *  approvals wall, so it renders only once `stories` has rows (W6). */
function HeroStats({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  return (
    <div className="relative border-t border-white/15 bg-[rgba(10,20,40,0.35)] backdrop-blur-[6px]">
      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 xl:py-4">
        <div className="min-w-0 flex-1">
          <MetricStrip
            bundle={bundle}
            locale={locale}
            metrics={['placed', 'countries', 'permitDays']}
            tone="dark"
          />
        </div>
        {hasRows(bundle, 'stories') ? (
          <div data-testid="hero-proof" className="flex flex-col max-xs:hidden">
            <Link
              prefetch={false}
              href="/success-stories"
              className="text-body-sm font-extrabold text-sky no-underline hover:underline"
            >
              {tf('home.053')}
            </Link>
            <span className="mt-1 text-[12.5px] font-semibold text-white/60">{tf('home.054')}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
