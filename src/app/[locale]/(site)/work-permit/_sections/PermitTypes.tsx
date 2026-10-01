import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { Frags } from '../_components/Frags';
import { CheckIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';
import { FIXED_TERM_BULLETS, OTHER_PERMIT_TYPES } from '../_lib/tables';

/** "Which permit type will your workers get?" — the featured fixed-term card, the special
 *  cases and the ask card (D20: blue-safe, not the design's brand-blue gradient) with its
 *  WhatsApp door. */
export function PermitTypes({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [name, local] = [tf('wp.164'), tf('wp.165')];
  return (
    <Section tone="pale">
      <div className="container-site" data-testid="wp-types">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left">
          {tf('wp.161')}
        </h2>
        <p className="mx-auto mb-11 max-w-[560px] text-center text-body-lg text-text-secondary max-md:mb-5 max-md:text-left">
          {tf('wp.162')}
        </p>
        <div className="mx-auto grid max-w-[1080px] gap-5 max-md:gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <article
            data-testid="wp-types-featured"
            className="min-w-0 rounded-lg border-[1.5px] border-tint-border bg-white px-8.5 py-8 shadow-[0_12px_32px_rgba(22,60,90,0.08)] max-md:rounded-base max-md:px-4 max-md:py-4"
          >
            <p className="m-0 mb-3.5">
              <span className="inline-block rounded-pill border border-tint-border bg-tint px-3 py-1 text-eyebrow font-extrabold tracking-[1px] text-blue-safe uppercase">
                {tf('wp.163')}
              </span>
            </p>
            <h3 className="m-0 mb-2.5 text-card-title">
              {name}
              {sp(name, local)}
              <span className="text-body font-bold text-text-tertiary">{local}</span>
            </h3>
            <p className="m-0 mb-4.5 text-body text-text-secondary">{tf('wp.166')}</p>
            <ul className="flex flex-col gap-2.5">
              {FIXED_TERM_BULLETS.map((parts) => (
                <li
                  key={parts[0].id}
                  className="flex items-start gap-2.5 text-body-sm text-text-secondary"
                >
                  <CheckIcon size={16} className="mt-0.5 flex-none text-success" />
                  <span>
                    <Frags parts={parts} tf={tf} />
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <div className="flex min-w-0 flex-col gap-5 max-md:gap-3">
            <div
              data-testid="wp-types-other"
              className="rounded-lg border border-border-2 bg-white px-7 py-6.5 max-md:rounded-base max-md:px-4 max-md:py-4"
            >
              <h3 className="m-0 mb-3.5 text-eyebrow font-extrabold tracking-[1px] text-text-tertiary uppercase">
                {tf('wp.175')}
              </h3>
              <ul className="flex flex-col gap-2.5 text-body-sm text-text-secondary">
                {OTHER_PERMIT_TYPES.map(([nameId, restId]) => {
                  const [a, b] = [tf(nameId), tf(restId)];
                  return (
                    <li key={nameId}>
                      <strong className="font-extrabold text-ink">{a}</strong>
                      {sp(a, b)}
                      {b}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-1 flex-col justify-center rounded-lg bg-blue-safe px-7 py-6 text-white max-md:rounded-base max-md:px-4 max-md:py-4">
              <p className="m-0 mb-1.5 text-body font-extrabold">{tf('wp.184')}</p>
              <p className="m-0 mb-3.5 text-body-sm">{tf('wp.185')}</p>
              <ContactCta
                placement="page_cta"
                variant="secondary"
                external
                className="self-start"
                href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'permitType'))}
              >
                {tf('wp.186')}
              </ContactCta>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
