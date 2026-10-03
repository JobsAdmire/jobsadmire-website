import { useTranslations } from 'next-intl';
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
        <ul className="mx-auto grid max-w-[1080px] gap-5 max-md:gap-3 lg:grid-cols-3">
          {COST_CARDS.map((c) => (
            <li key={c.titleId} className="min-w-0">
              <article
                className={`flex h-full flex-col rounded-md bg-white px-6 py-6.5 max-md:px-4 max-md:py-4 ${c.ours ? 'border-[1.5px] border-tint-border shadow-[0_10px_26px_rgba(22,60,90,0.07)]' : 'border border-border-2'}`}
              >
                <p
                  className={`m-0 mb-2.5 text-eyebrow font-extrabold tracking-[1.2px] uppercase ${c.ours ? 'text-success-text' : 'text-blue-safe'}`}
                >
                  {tf(c.eyebrowId)}
                </p>
                <h3 className="m-0 mb-1.5 text-card-title">{tf(c.titleId)}</h3>
                <p className="m-0 text-body-sm text-text-secondary">
                  <Frags parts={c.body} tf={tf} />
                </p>
                {c.ours ? (
                  <ContactCta
                    placement="page_cta"
                    variant="success"
                    external
                    className="mt-4 self-start"
                    href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'quote'))}
                  >
                    {tf('wp.296')}
                  </ContactCta>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
