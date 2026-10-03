import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';

/** The renewal banner — it continues the documents' pale band (no top padding), as designed.
 *  D20: a blue-safe surface and outline-only pills (a translucent white pill on blue drops white
 *  text below 4.5:1). W10: the desktop/mobile sentences switch by CSS; the design's ≤ 700 px
 *  "60 / days" numeral has no id (`wp.325` unread, delta 5), so `wp.326` is the ≤ 700 px line. */
export function Renewal({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [a, b, c] = [tf('wp.321'), tf('wp.322'), tf('wp.323')];
  return (
    <Section tone="pale" className="pt-0 max-md:pb-10">
      <div className="container-site">
        <div
          data-testid="wp-renewal"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-8 rounded-hero bg-blue-safe px-12 py-11 text-white shadow-[0_24px_56px_rgba(16,115,168,0.28)] max-md:flex-col max-md:items-stretch max-md:gap-3.5 max-md:rounded-md max-md:px-4.5 max-md:py-5.5"
        >
          <div className="min-w-0 flex-1">
            <p className="m-0 mb-3.5 inline-flex items-center rounded-pill border border-white/50 px-3.5 py-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase max-md:mb-2.5">
              {tf('wp.319')}
            </p>
            <h2 className="m-0 mb-2.5 text-[26px] leading-[1.2] tracking-[-0.01em] text-white max-md:text-[21px] xl:text-[19.5px]">
              {tf('wp.320')}
            </h2>
            <p className="m-0 text-body text-white xl:max-w-[680px]">
              <span data-testid="wp-renewal-desk" className="max-md:hidden">
                {a}
                {sp(a, b)}
                <strong className="font-extrabold">{b}</strong>
                {sp(b, c)}
                {c}
              </span>
              <span data-testid="wp-renewal-mob" className="md:hidden">
                {tf('wp.324')}
              </span>
            </p>
            <p className="m-0 mt-3 rounded-xs border border-white/40 px-3 py-2.5 text-body-sm font-bold md:hidden">
              {tf('wp.326')}
            </p>
          </div>
          <ContactCta
            placement="page_cta"
            variant="secondary"
            size="lg"
            external
            href={waLink(bundle.settings.whatsappNumber, waPrefill(sys, 'renewal'))}
          >
            {tf('wp.327')}
          </ContactCta>
        </div>
      </div>
    </Section>
  );
}
