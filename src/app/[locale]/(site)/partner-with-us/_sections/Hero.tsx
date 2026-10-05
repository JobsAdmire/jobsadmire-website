import { Breadcrumbs } from '@/design/blocks/Breadcrumbs';
import { ContactCta } from '@/design/blocks/ContactCta';
import { CheckIcon, WhatsAppIcon } from '@/design/chrome/icons';
import { Button } from '@/design/primitives/Button';
import { Section } from '@/design/primitives/Section';
import type { Locale } from '@/i18n/routing';
import type { Metric } from '@/content/collections';
import { GlobeIcon } from '../_components/icons';
import { HERO_IDS, type Tf } from '../_lib/content';
import { NetworkCard } from './NetworkCard';

/** The h1's sky accent (Partner With Us l. 497: "recruitment agency" in #7fd0f5) — the span of
 *  partner.023 each locale's wording gives it. Styling, not copy: when the catalogue's wording no
 *  longer contains it, the h1 renders plain. */
const H1_ACCENT: Record<Locale, string> = { tr: 'işe alım ajansıyla', en: 'recruitment agency' };

function AccentedH1({ text, accent }: { text: string; accent: string }) {
  const at = text.indexOf(accent);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-sky">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}

/** ≤ 700 px the design restyles the two hero CTAs (ll. 281–283): the primary takes the 135°
 *  gradient with a blue shadow, WhatsApp turns solid green with white text — in their
 *  contrast-safe forms (D20: `gradient` / `success-solid`'s faces). The buttons keep their
 *  desktop variants; these phone-only rules reach them from their own wrapper. */
const HERO_CTAS =
  'mb-6 flex flex-wrap gap-3 max-md:mb-[18px] max-md:grid max-md:gap-2.5 max-md:[&>a]:min-h-[50px] max-md:[&>a:first-child]:bg-gradient-to-br max-md:[&>a:first-child]:from-blue-safe max-md:[&>a:first-child]:to-blue-deep max-md:[&>a:first-child]:shadow-[0_10px_24px_rgba(24,153,213,0.34)] max-md:[&>a:last-child]:border-success-text max-md:[&>a:last-child]:bg-success-text max-md:[&>a:last-child]:text-white';

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
  metrics: readonly Metric[];
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
              <AccentedH1 text={tf(HERO_IDS.h1)} accent={H1_ACCENT[locale]} />
            </h1>
            <p className="text-body-lg m-0 mb-7 max-w-[560px] font-semibold text-white/80">
              <span className="max-md:hidden">{tf(HERO_IDS.leadDesk)}</span>
              <span className="md:hidden">{tf(HERO_IDS.leadMob)}</span>
            </p>
            <ul className="m-0 mb-7 flex max-w-[580px] list-none flex-wrap gap-x-8 gap-y-3 p-0 max-md:flex-col max-md:gap-2.5 max-md:rounded-sm max-md:border max-md:border-white/20 max-md:bg-white/5 max-md:p-3.5">
              {HERO_IDS.ticks.map(([lead, tail]) => (
                <li
                  key={lead}
                  className="flex items-start gap-2 text-body-sm font-semibold text-white/80"
                >
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-[#4ade80]" />
                  <span>
                    <strong className="font-extrabold text-white">{tf(lead)}</strong> {tf(tail)}
                  </span>
                </li>
              ))}
            </ul>
            {/* ≤ 700 px the design stretches both CTAs full width: the wrapper turns into a
                one-column grid, the buttons keep their own classes (W122) — `HERO_CTAS`. */}
            <div className={HERO_CTAS}>
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
          <NetworkCard tf={tf} metrics={metrics} locale={locale} />
        </div>
      </div>
    </Section>
  );
}
