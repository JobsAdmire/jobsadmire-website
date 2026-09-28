import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { WhatsAppIcon } from './icons';

/** Only between the mobile bottom bar (≤900 px) and the social rail (≥1101 px). W18: lifts
 *  itself by the height a page-mounted StickyCtaBar publishes as `--sticky-cta-h`. */
export function WhatsAppFab({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  return (
    // N8: a named landmark, so the fixed button no longer sits outside every one (axe `region`).
    // The landmark carries the 901–1100 px range and nothing else — an in-flow box of zero height
    // (its only child is fixed) — so it leaves the accessibility tree with the button at every
    // other width, never an empty landmark.
    <aside aria-label={sys('nav.whatsappFab')} className="hidden lg:block xl:hidden">
      <ContactLink
        href={waLink(bundle.settings.whatsappNumber, sys('whatsapp.prefill'))}
        placement="whatsapp_fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('home.221')}
        className="fixed bottom-[calc(18px+var(--sticky-cta-h,0px))] right-[18px] z-40 flex h-14 w-14 items-center justify-center rounded-pill bg-success-text text-white shadow-[0_12px_30px_rgba(18,129,60,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        <WhatsAppIcon size={27} />
      </ContactLink>
    </aside>
  );
}
