import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { ImageSlot } from '@/design/blocks/ImageSlot';
import type { Locale } from '@/i18n/routing';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CheckIcon } from '../_components/icons';
import { HERO_SIZE, HERO_SRC } from '../_lib/assets';
import { sp } from '../_lib/fragments';
import { QuickQuote } from './QuickQuote';

const PILL = 'inline-flex gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-2';

export function Hero({
  bundle,
  locale,
  tf,
  metrics,
  whatsappLabel,
}: {
  bundle: Bundle;
  locale: Locale;
  tf: (id: string) => string;
  /** metricValues(bundle, locale) — '' for an unsigned metric (W1: its pill is hidden) */
  metrics: Record<string, string>;
  /** sys.hire.whatsapp */
  whatsappLabel: string;
}) {
  const s = bundle.settings;
  const heroIsLcp = HERO_SRC !== null;
  const [h1a, h1b, h1c] = [tf('hire.021'), tf('hire.022'), tf('hire.023')];
  const lead = (a: string, b: string) => {
    const x = tf(a);
    const y = tf(b);
    return (
      <>
        {x}
        {sp(x, y)}
        <strong className="text-white">{y}</strong>
      </>
    );
  };
  return (
    <section data-testid="hire-hero" className="relative overflow-hidden bg-navy text-white">
      {/* D26 + W129: the named hero slot. ImageSlot owns its box (full width at 9:4 —
          HERO_SIZE), so the cover crop is this wrapper's job: height-led, at least full width,
          centred, clipped by the section. With a photo (HERO_SRC) the image is the LCP element
          (`data-lcp-slot="hw-hero"` + preload); without one it is a decorative named placeholder
          and the h1 carries the LCP slot. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 aspect-[9/4] h-full min-w-full -translate-x-1/2 -translate-y-1/2">
          <ImageSlot
            slot="hw-hero"
            lcp={heroIsLcp}
            src={HERO_SRC}
            alt=""
            width={HERO_SIZE.width}
            height={HERO_SIZE.height}
            sizes="100vw"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/55 via-transparent to-navy/70"
      />
      <div className="container-site relative grid items-center gap-10 py-14 max-md:gap-6 max-md:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-16">
        <div>
          {/* W109: this page's own labels — hire.020 (crumbHome), hire.002 (navHire) */}
          <Breadcrumbs
            locale={locale}
            tone="dark"
            className="mb-4"
            items={[
              { name: tf('hire.020'), href: '/' },
              { name: tf('hire.002'), href: '/hire-workers' },
            ]}
          />
          <h1
            data-testid="page-h1"
            data-lcp-slot={heroIsLcp ? undefined : 'h1'}
            className="m-0 mb-4 text-h1 leading-[1.02] tracking-[-0.03em] max-md:text-[31px] max-md:leading-[1.08]"
          >
            {h1a}
            {sp(h1a, h1b)}
            <span className="text-sky">{h1b}</span>
            {sp(h1b, h1c)}
            {h1c}
          </h1>
          <p className="m-0 mb-7 max-w-[540px] text-body-lg text-white/80 max-md:mb-5">
            <span className="max-md:hidden">{lead('hire.024', 'hire.025')}</span>
            <span className="md:hidden">{lead('hire.026', 'hire.027')}</span>
          </p>
          <ul className="m-0 mb-7 flex max-w-[560px] list-none flex-wrap gap-x-8 gap-y-3 p-0 max-md:mb-5 max-md:flex-col max-md:gap-y-2">
            {(
              [
                ['hire.028', 'hire.029'],
                ['hire.030', 'hire.031'],
              ] as const
            ).map(([strong, tail]) => (
              <li key={strong} className="flex items-start gap-2.5 text-body text-white/75">
                <CheckIcon className="mt-1 flex-none text-success-border" />
                <span>
                  <strong className="text-white">{tf(strong)}</strong>
                  {sp(tf(strong), tf(tail))}
                  {tf(tail)}
                </span>
              </li>
            ))}
          </ul>
          {/* ≤ 700 px the design hides this row — the mobile bottom bar carries both doors */}
          <div data-testid="hire-hero-ctas" className="mb-6 flex flex-wrap gap-3 max-md:hidden">
            <ContactCta placement="page_cta" href={telLink(s.phone)} variant="inverse">
              {tf('hire.032')}
            </ContactCta>
            <ContactCta
              placement="page_cta"
              href={waLink(s.whatsappNumber, tf('hire.249'))}
              variant="success"
              external
            >
              {whatsappLabel}
            </ContactCta>
          </div>
          <ul
            data-testid="hire-hero-pills"
            className="m-0 flex list-none flex-wrap gap-3 p-0 text-body-sm"
          >
            <li className={`${PILL} items-center font-bold text-white/80`}>
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
              {tf('hire.034')}
            </li>
            {metrics.placed ? (
              <li className={`${PILL} items-baseline text-white/75`}>
                <span className="text-body font-extrabold text-sky">{metrics.placed}</span>
                {tf('hire.035')}
              </li>
            ) : null}
            {metrics.countries ? (
              <li className={`${PILL} items-baseline text-white/75`}>
                <span className="text-body font-extrabold text-success-border">
                  {metrics.countries}
                </span>
                {tf('hire.036')}
              </li>
            ) : null}
          </ul>
        </div>
        <QuickQuote bundle={bundle} locale={locale} tf={tf} />
      </div>
    </section>
  );
}
