import { useTranslations } from 'next-intl';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { sp } from '../_lib/fragments';
import { waPrefill } from '../_lib/prefill';

/** The renewal banner — it continues the documents' pale band (no top padding), as designed.
 *  D20: a blue-safe surface and outline-only pills (a translucent white pill on blue drops white
 *  text below 4.5:1, so the eyebrow and the window box darken instead). W10: the desktop/mobile
 *  sentences switch by CSS; ≤ 700 px the design's "60 / gün" date tile (`wp.325`) sits beside
 *  `wp.326`. */
export function Renewal({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const sys = useTranslations('sys');
  const [a, b, c] = [tf('wp.321'), tf('wp.322'), tf('wp.323')];
  return (
    <Section tone="pale" className="pt-0 max-md:pb-10">
      <div className="container-site">
        <div
          data-testid="wp-renewal"
          className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-8 rounded-hero bg-gradient-to-br from-blue-safe to-blue-deep px-12 py-11 text-white shadow-[0_24px_56px_rgba(16,115,168,0.28)] max-md:flex-col max-md:items-stretch max-md:gap-3.5 max-md:rounded-md max-md:px-4.5 max-md:py-5.5"
        >
          <div className="min-w-0 flex-1">
            <p className="m-0 mb-3.5 inline-flex items-center rounded-pill border border-white/40 bg-black/10 px-3.5 py-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase max-md:mb-2.5">
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
            <p
              data-testid="wp-renewal-window"
              className="m-0 mt-3.5 flex items-center gap-3 rounded-sm border border-white/30 bg-black/10 px-3.5 py-3 text-[12.5px] leading-[1.45] font-bold md:hidden"
            >
              <span
                aria-hidden="true"
                className="flex flex-none flex-col items-center rounded-xs bg-white px-2.5 py-1.5 leading-none text-blue-safe"
              >
                <span className="text-[18px] font-extrabold tracking-[-0.5px]">60</span>
                <span className="mt-0.5 text-[8.5px] font-extrabold tracking-[0.6px] uppercase">
                  {tf('wp.325')}
                </span>
              </span>
              <span>{tf('wp.326')}</span>
            </p>
          </div>
          <ContactCta
            placement="page_cta"
            variant="white"
            size="lg"
            shape="rect"
            radius={11}
            className="max-md:w-full"
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
