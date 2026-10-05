import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { EmptyState } from '@/design/blocks/EmptyState';
import { ImageSlot, type CoverHeights } from '@/design/blocks/ImageSlot';
import { effectiveFromLabel, effectiveYear, isReviewDue } from '@/lib/calculator';
import { CalculatorLoader } from '../_components/CalculatorLoader';
import { CalculatorSkeleton } from '../_components/CalculatorSkeleton';
import { Sentence } from '../_components/Sentence';
import type { CalcCtx } from './context';

const BADGE =
  'm-0 mb-4 inline-flex items-center gap-[9px] rounded-pill border border-[rgba(74,222,128,0.35)] bg-[rgba(74,222,128,0.12)] px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[1.2px] text-[#86efac] max-md:mb-3 max-md:px-3 max-md:py-[5px] max-md:text-[11px] max-md:tracking-[1px] xl:text-[11px]';
/** W233 (QA W220 contact-01's fix, W187 / final pass A8): the photo's fixed height per band, each
 *  ≥ 10 % above the tallest hero — the calculator card included — measured in both locales, with
 *  and without the island, every 10 px from 320 to 1440 (1,574 / 1,364 / 1,270 / 2,004 / 1,531 /
 *  1,071 px at ≤ 460 / 461–560 / 561–700 / 701–900 / 901–1100 / ≥ 1101). The width-driven 16:9
 *  box stopped at 180–810 px, so the photo ended in a hard edge under the h1 on a phone. */
const HERO_COVER: CoverHeights = { base: 1750, md: 2250, lg: 1700, xl: 1200 };

/**
 * Final pass A7 (W190 A1b, W210 a): the design's global `@media (max-width: 600px) { h1 { 32px;
 * -0.6px } }` rides on the h1 as `max-[601px]:` twins (no repo breakpoint; never `max-sm:`).
 * Design 559–572: the navy hero — breadcrumbs (W109: this page's own calc.001 → `/`, calc.002 →
 * this page), the D17 badge, the three-part h1 (the page's LCP element, `data-lcp-slot="h1"`,
 * D26) and the lede; `children` is the calculator card, which sits inside the hero as in the
 * design. The full-bleed photo slot `calc-hero` carries licensed stock (owner 2026-10-05, W233)
 * under the 90–97 % navy gradient — decorative and preloaded, never the LCP: the h1 keeps the
 * page's one `data-lcp-slot` (D26); `ImageSlot` owns its box (W129), so it is wrapped, and since
 * W233 it covers the whole hero in cover mode (HERO_COVER) instead of its own aspect box.
 */
export function Hero({ ctx, children }: { ctx: CalcCtx; children: ReactNode }) {
  const { t, sys, locale, rateConfig } = ctx;
  // D17/W150: data, never typed; hidden from reviewDueAt 00:00 UTC — the page revalidates daily.
  // `year` is a string: an ICU number argument would be grouped ("2.026").
  const badge = isReviewDue(rateConfig)
    ? null
    : sys('calc.hero.badge', {
        year: String(effectiveYear(rateConfig)),
        month: effectiveFromLabel(rateConfig, locale),
      });
  const highlight = t('calc.005');
  return (
    <div
      data-testid="calc-top"
      className="relative overflow-hidden bg-navy pt-14 pb-[68px] max-md:pt-6 max-md:pb-[30px] xl:pt-[42px] xl:pb-[51px]"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <ImageSlot
          slot="calc-hero"
          src="/hero/hiring-cost-calculator.jpg"
          priority
          alt=""
          width={1600}
          height={900}
          sizes="100vw"
          cover={HERO_COVER}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0.9)_0%,rgba(10,20,40,0.94)_45%,rgba(10,20,40,0.97)_100%)]"
      />
      <div className="container-site relative">
        <div className="mx-auto mb-[34px] max-w-[720px] text-center max-md:mb-4 max-md:text-left xl:mb-[25.5px] xl:max-w-[540px]">
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-3.5 flex justify-center max-md:justify-start"
            items={[
              { name: t('calc.001'), href: '/' },
              { name: t('calc.002'), href: '/hiring-cost-calculator' },
            ]}
          />
          {badge ? (
            <p data-testid="calc-badge" className={BADGE}>
              <span
                aria-hidden="true"
                className="ja-live inline-block h-[9px] w-[9px] rounded-pill bg-success"
              />
              {badge}
            </p>
          ) : null}
          <h1
            data-testid="page-h1"
            data-lcp-slot="h1"
            className="m-0 mb-4 text-[clamp(36px,4.2vw,54px)] leading-[1.03] tracking-[-2.1px] text-white max-md:leading-[1.07] max-md:tracking-[-1.1px] max-[601px]:text-[32px] max-[601px]:tracking-[-0.6px] xl:tracking-[-1.575px] xl:text-[clamp(27px,3.15vw,40.5px)]"
          >
            <Sentence
              runs={[
                t('calc.004'),
                { node: <span className="text-sky">{highlight}</span>, text: highlight },
                t('calc.006'),
              ]}
            />
          </h1>
          <p className="m-0 text-body-lg text-white/75 max-md:text-[15px]">{t('calc.007')}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * The card (design 574–737) — `id="calculator"`, the `CTA_BY_PATHNAME` anchor (W152/W158) and
 * the one `.print-isolate` region `PrintButton` prints (the design's @media print rule, made
 * opt-in). The server skeleton paints the model's defaults; the island loads on the first
 * hover/touch/focus or at `#calculator` (W13 amended). Without design roles it is the designed
 * empty state, its CTA an object Href to the closing band's quote button (W82). The fine print
 * `calc.040` closes it (on `pale-1`: `text-text-secondary`, D20). A `#calculator` jump clears the
 * sticky chrome at its three heights — the homepage `#proposal` bands (HeroLeadForm, W152); W231
 * review: `scroll-mt-5` landed the card's first row under the header.
 */
export function CalculatorCard({ ctx }: { ctx: CalcCtx }) {
  const { t, sys, locale, rateConfig, roles, roleLabels, industryLabels, labels, defaultView } =
    ctx;
  return (
    <div
      id="calculator"
      className="ja-card-in print-isolate mx-auto max-w-[1080px] scroll-mt-[90px] lg:scroll-mt-[125px] min-[1200px]:scroll-mt-[90px] overflow-hidden rounded-xl border border-tint-border bg-white shadow-[0_24px_60px_rgba(22,60,90,0.14)] max-md:rounded-base max-md:shadow-[0_16px_38px_rgba(3,10,26,0.4)] xl:max-w-[1040px]"
    >
      {defaultView ? (
        <CalculatorLoader
          locale={locale}
          rateConfig={rateConfig}
          roles={roles}
          labels={labels.card}
          roleLabels={roleLabels}
          industryLabels={industryLabels}
          closeLabel={sys('nav.close')}
          fallback={
            <CalculatorSkeleton
              view={defaultView}
              labels={labels.card}
              activateLabel={sys('calc.skeleton.activate')}
            />
          }
        />
      ) : (
        <EmptyState
          testId="calc-empty"
          headingLevel={2}
          title={sys('calc.empty.title')}
          body={sys('calc.empty.body')}
          cta={{
            label: t('calc.105'),
            href: { pathname: '/hiring-cost-calculator', hash: '#calc-cta' },
          }}
          className="m-6"
        />
      )}
      <p className="m-0 border-t border-border-4 bg-pale-1 px-[34px] py-[13px] text-[12.5px] leading-[1.5] text-text-secondary max-md:px-[15px] max-md:py-3 max-md:text-[11.5px] xl:px-[25.5px] xl:py-[10px] xl:text-[11px]">
        {t('calc.040')}
      </p>
    </div>
  );
}
