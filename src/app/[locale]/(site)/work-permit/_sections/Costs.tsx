import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { Frags } from '../_components/Frags';
import { waPrefill } from '../_lib/prefill';
import { COST_CARDS } from '../_lib/tables';

/** "What a work permit costs" (#costs): three cost lines and, by design, no amounts — the state
 *  fees change every January and the service fee is quoted in writing (`wp.282`/`wp.295`), so
 *  there is nothing here for D17 to render. */
export function Costs({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  return (
    <Section tone="light" id="costs" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-costs">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px]">
          {tf('wp.281')}
        </h2>
        <p className="mx-auto mb-11 max-w-[600px] text-center text-body-lg text-text-tertiary max-md:mb-5 max-md:text-left">
          {tf('wp.282')}
        </p>
        {/* ≤ 700 px the design merges the three lines into one card split by hairlines, the
            "our side" row tinted, its CTA a full-width outlined button (CSS .ja-cost-*) */}
        <ul className="mx-auto grid max-w-[1080px] gap-5 max-md:gap-0 max-md:overflow-hidden max-md:rounded-base max-md:border max-md:border-border-2 max-md:bg-white max-md:shadow-[0_6px_20px_rgba(22,60,90,0.06)] lg:grid-cols-3">
          {COST_CARDS.map((c) => {
            const href = waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'quote'));
            return (
              <li key={c.titleId} className="min-w-0">
                <article
                  className={`flex h-full flex-col rounded-md bg-white px-6 py-6.5 max-md:rounded-none max-md:border-x-0 max-md:border-b-0 max-md:px-4 max-md:py-3.5 max-md:shadow-none ${c.ours ? 'border-[1.5px] border-tint-border shadow-[0_10px_26px_rgba(22,60,90,0.07)] max-md:border-t-success-soft-border max-md:bg-[#f6fbf8]' : 'border border-border-2 max-md:border-t-border-4 max-md:first:border-t-0'}`}
                >
                  <p
                    className={`m-0 mb-2.5 text-eyebrow font-extrabold tracking-[1.2px] uppercase max-md:mb-1.5 ${c.ours ? 'text-success-text' : 'text-blue-safe'}`}
                  >
                    {tf(c.eyebrowId)}
                  </p>
                  <h3 className="m-0 mb-1.5 text-card-title max-md:mb-1 max-md:text-[16px]">
                    {tf(c.titleId)}
                  </h3>
                  <p className="m-0 text-body-sm text-text-secondary">
                    <Frags parts={c.body} tf={tf} />
                  </p>
                  {c.ours ? (
                    <>
                      {/* desktop: the design's plain green text link */}
                      <ContactLink
                        href={href}
                        placement="page_cta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3.5 self-start text-body-sm font-extrabold text-success-text no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:hidden"
                      >
                        {tf('wp.296')}
                      </ContactLink>
                      {/* ≤ 700 px: full-width outlined 46 px rectangle */}
                      <ContactCta
                        placement="page_cta"
                        variant="outline-green"
                        external
                        shape="rect"
                        radius={11}
                        lift={false}
                        className="mt-2.5 w-full md:hidden"
                        href={href}
                      >
                        {tf('wp.296')}
                      </ContactCta>
                    </>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
