import { makeT } from '@/content/pure';
import { useTranslations } from 'next-intl';
import { telLink, waLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { PhoneIcon, WhatsAppIcon } from './icons';

/** Keeps the fixed bar from covering the end of the page. Rendered as its sibling. */
export function MobileBottomBarSpacer() {
  return <div aria-hidden="true" className="h-[74px] lg:hidden" />;
}

const ACTION =
  'flex min-h-12 items-center justify-center gap-2 rounded-pill text-[15px] font-extrabold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';

export function MobileBottomBar({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2.5 border-t border-white/15 bg-navy/95 px-3.5 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <a
        href={telLink(settings.phone)}
        className={`${ACTION} border-[1.5px] border-white/25 bg-white/10`}
      >
        <PhoneIcon />
        {t('hire.032')}
      </a>
      <a
        href={waLink(settings.whatsappNumber, sys('whatsapp.prefill'))}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION} bg-success`}
      >
        <WhatsAppIcon size={18} />
        {t('home.221')}
      </a>
    </div>
  );
}
