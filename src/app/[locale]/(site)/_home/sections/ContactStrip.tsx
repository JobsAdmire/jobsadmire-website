import { useTranslations } from 'next-intl';
import { makeTf } from '@/content/pure';
import { ContactCta } from '@/design/blocks/ContactCta';
import { Section } from '@/design/primitives/Section';
import { telLink, waLink } from '@/lib/contact';
import { LiveDot } from '../components/LiveDot';
import type { SectionProps } from './types';

/**
 * The contact strip (design ll. 1091–1106) — a page-local copy of `ClosingCtaBand`'s `navy` tone
 * adapted to the design (a shared request: the block has no per-CTA phone rule and always puts
 * the buttons beside the copy): the night card (#0a1428, r26) with the blue glow, the h2 and body
 * over the button row, which wraps UNDER the copy as the design's four buttons do. The doors: the
 * hero's "Request workers →" back to `#proposal` (home.022), WhatsApp with the fixed hire prefill
 * and the design's pulsing `ja-live` dot, and "Call the office". The design's Telegram button is
 * gone (W226, owner: WhatsApp is the messaging channel), so at ≤ 460 px — where the design keeps
 * "Request workers" and Telegram as two full-width rows — WhatsApp takes Telegram's place and the
 * call button hides. Every CTA renders through `ContactCta`, so WhatsApp and the phone fire
 * `whatsapp_click` / `call_click` with `placement: 'page_cta'` (W12).
 */
export function ContactStrip({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const s = bundle.settings;
  return (
    <Section tone="band" className="ja-reveal">
      <div data-testid="cta-band" className="container-site">
        <div
          data-tone="navy"
          className="relative overflow-hidden rounded-[26px] bg-night px-[46px] py-10 text-white max-xs:rounded-xl max-xs:px-[22px] max-xs:py-7 xl:rounded-[19.5px] xl:px-[34.5px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[120px] -top-40 h-[480px] w-[480px] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.24),transparent_65%)] xl:-right-[90px] xl:-top-[120px] xl:h-[360px] xl:w-[360px]"
          />
          <div className="relative flex flex-col items-start gap-8">
            <div className="max-w-[600px] xl:max-w-[450px]">
              <h2 className="m-0 mb-2.5 text-[clamp(24px,2.6vw,34px)] leading-[1.08] tracking-[-1.4px] text-white max-xs:tracking-[-1px] xl:text-[clamp(18px,1.95vw,25.5px)] xl:tracking-[-1.05px]">
                {tf('home.184')}
              </h2>
              <p className="m-0 text-[15.5px] font-semibold leading-[1.6] text-white/70 xl:text-[11.625px]">
                {tf('home.185')}
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-3 max-xs:flex-col">
              <ContactCta
                placement="page_cta"
                variant="primary"
                href="#proposal"
                size="lg"
                className="max-xs:min-h-[54px] max-xs:w-full"
              >
                {tf('home.022')}
              </ContactCta>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                external
                href={waLink(s.whatsappNumber, sys('home.whatsapp.hire'))}
                icon={<LiveDot />}
                size="lg"
                className="max-xs:w-full"
              >
                {tf('home.221')}
              </ContactCta>
              <ContactCta
                placement="page_cta"
                variant="inverse"
                href={telLink(s.phone)}
                size="lg"
                className="max-xs:hidden"
              >
                {tf('home.187')}
              </ContactCta>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
