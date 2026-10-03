import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { CheckIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import { GlobeIcon } from '../_components/icons';
import { HERO_IDS, type Tf } from '../_lib/content';
import { NetworkCard } from './NetworkCard';

/**
 * The dark hero. A gradient, not the design's full-bleed `pw-hero` photo (§10 #4: photography
 * on the Homepage and Hire Workers only), so the h1 is the LCP element (D26) and the page has no
 * hero placeholder. Crumbs are this page's own ids (W109); `whatsappHref` carries only the static
 * `sys.partner.whatsapp.prefill` (W95) and fires `whatsapp_click` `page_cta` (W12).
 */
export function Hero({
  locale,
  tf,
  metrics,
  whatsappHref,
}: {
  locale: Locale;
  tf: Tf;
  metrics: Record<string, string>;
  whatsappHref: string;
}) {
  return (
    <Section
      tone="dark"
      className="relative overflow-hidden bg-gradient-to-br from-navy to-[#0a1428]"
    >
      <div className="container-site" data-testid="partner-hero">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="min-w-0">
            <Breadcrumbs
              locale={locale}
              tone="dark"
              className="mb-4"
              items={[
                { name: tf(HERO_IDS.crumbHome), href: '/' },
                { name: tf(HERO_IDS.crumbSelf), href: '/partner-with-us' },
              ]}
            />
            <h1
              data-testid="page-h1"
              data-lcp-slot="h1"
              className="text-h1 m-0 mb-4 leading-[1.02] tracking-[-0.03em] text-white max-md:text-[31px] max-md:leading-[1.07] max-md:tracking-[-1.1px] xl:text-balance"
            >
              {tf(HERO_IDS.h1)}
            </h1>
            <p className="text-body-lg m-0 mb-7 max-w-[560px] text-white/80">
              <span className="max-md:hidden">{tf(HERO_IDS.leadDesk)}</span>
              <span className="md:hidden">{tf(HERO_IDS.leadMob)}</span>
            </p>
            <ul className="m-0 mb-7 flex max-w-[580px] list-none flex-wrap gap-x-8 gap-y-3 p-0 max-md:flex-col max-md:gap-2.5 max-md:rounded-sm max-md:border max-md:border-white/20 max-md:bg-white/5 max-md:p-3.5">
              {HERO_IDS.ticks.map(([lead, tail]) => (
                <li key={lead} className="flex items-start gap-2 text-body-sm text-white/80">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-[#4ade80]" />
                  <span>
                    <strong className="font-extrabold text-white">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            {/* ≤ 700 px the design stretches both CTAs full width: the wrapper turns into a
                one-column grid, the buttons keep their own classes (W122). */}
            <div className="mb-6 flex flex-wrap gap-3 max-md:grid">
              <Button variant="primary" size="lg" href="#tracks">
                {tf(HERO_IDS.ctaTracks)}
              </Button>
              <ContactCta
                placement="page_cta"
                variant="success"
                size="lg"
                external
                href={whatsappHref}
              >
                <WhatsAppIcon size={16} />
                {tf(HERO_IDS.ctaWhatsApp)}
              </ContactCta>
            </div>
            <p className="m-0 flex items-start gap-2 text-body-sm text-white/75">
              <GlobeIcon className="mt-0.5 shrink-0 text-sky" />
              <span>
                {tf(HERO_IDS.speakLead)}{' '}
                <strong className="font-bold text-white">{tf(HERO_IDS.speakTail)}</strong>
              </span>
            </p>
          </div>
          <NetworkCard tf={tf} metrics={metrics} />
        </div>
      </div>
    </Section>
  );
}
