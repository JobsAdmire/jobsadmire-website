import { makeT } from '@/content/pure';
import { useTranslations } from 'next-intl';
import { waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { WhatsAppIcon } from './icons';

/** Only between the mobile bottom bar (≤900 px) and the social rail (≥1101 px). */
export function WhatsAppFab({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  return (
    <a
      href={waLink(bundle.settings.whatsappNumber, sys('whatsapp.prefill'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('home.221')}
      className="fixed bottom-[18px] right-[18px] z-40 hidden h-14 w-14 items-center justify-center rounded-pill bg-success text-white shadow-[0_12px_30px_rgba(22,163,74,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe lg:flex xl:hidden"
    >
      <WhatsAppIcon size={27} />
    </a>
  );
}
