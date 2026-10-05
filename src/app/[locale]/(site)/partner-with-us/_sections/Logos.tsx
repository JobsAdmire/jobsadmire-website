import { useTranslations } from 'next-intl';
import { LogoMarquee, type Logo } from '@/design/blocks/LogoMarquee';
import { SampleTag } from '@/design/blocks/SampleTag';
import { Section } from '@/design/primitives/Section';
import { LOGOS_IDS, type Tf } from '../_lib/content';
import { PARTNER_COMPANIES_SAMPLE, PARTNER_LOGO_SLOTS } from '../_lib/logos';

/**
 * The partner logo band (Partner With Us ll. 550–567): the "25+ partner companies" figure with
 * its right divider, then the masked 38 s marquee. Until consented logos exist (W6, §10 #11) the
 * marquee runs the design's 20 labelled placeholder slots (`partnerLogoSlots`) and the figure —
 * an unsigned sample (W1) — wears the `SampleTag` (owner 2026-10-05). On phones the band turns
 * pale and the figure becomes the design's blue pill beside its caption (ll. 291–297).
 */
export function Logos({ tf, logos }: { tf: Tf; logos: readonly Logo[] }) {
  const sys = useTranslations('sys');
  const slots = PARTNER_LOGO_SLOTS.map((n) => sys('partner.logos.slot', { n }));
  const stat = (
    <div className="max-md:flex max-md:items-center max-md:gap-[9px] max-md:text-left">
      <p className="m-0 text-[30px] leading-none font-extrabold tracking-[-0.5px] text-ink max-md:flex-none max-md:rounded-pill max-md:border max-md:border-tint-border max-md:bg-tint max-md:px-[11px] max-md:py-[3px] max-md:text-[15px] max-md:text-blue-safe xl:text-[22.5px] xl:tracking-[-0.375px]">
        {PARTNER_COMPANIES_SAMPLE}
      </p>
      <p className="m-0 mt-1.5 max-w-[160px] text-[13.5px] leading-[1.4] font-bold text-text-tertiary max-md:mt-0 max-md:max-w-none max-md:text-[12.5px] max-md:leading-[1.35] xl:mt-[4.5px] xl:max-w-[120px] xl:text-[11px]">
        {tf(LOGOS_IDS.caption)}
      </p>
      <SampleTag className="mt-2.5 max-md:mt-0" />
    </div>
  );
  return (
    <Section
      tone="light"
      className="border-b border-border-3 pt-[38px] pb-[42px] max-md:bg-pale-2 max-md:pt-[22px] max-md:pb-6 xl:pt-[28.5px] xl:pb-[31.5px]"
    >
      <div className="container-site" data-testid="partner-logos">
        <LogoMarquee logos={[...logos]} slots={logos.length > 0 ? [] : slots} stat={stat} />
      </div>
    </Section>
  );
}
