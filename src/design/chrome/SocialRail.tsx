import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { waLink } from '@/lib/contact';
import type { Bundle, Settings } from '../../../contract/website-bundle.v1';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from './icons';

export type SocialLink = { name: string; href: string; icon: ReactNode; hover: string };

/** One list for the rail and the footer. The names are brands, not copy — no string ids. */
export function socialLinks(settings: Settings, waPrefill: string): SocialLink[] {
  return [
    {
      name: 'Facebook',
      href: settings.social.facebook,
      icon: <FacebookIcon />,
      hover: 'hover:border-blue hover:bg-blue hover:text-white',
    },
    {
      name: 'Instagram',
      href: settings.social.instagram,
      icon: <InstagramIcon />,
      hover: 'hover:border-blue hover:bg-blue hover:text-white',
    },
    {
      name: 'WhatsApp',
      href: waLink(settings.whatsappNumber, waPrefill),
      icon: <WhatsAppIcon />,
      hover: 'hover:border-success hover:bg-success hover:text-white',
    },
    {
      name: 'Telegram',
      href: settings.telegramUrl,
      icon: <TelegramIcon />,
      hover: 'hover:border-blue hover:bg-blue hover:text-white',
    },
    {
      name: 'TikTok',
      href: settings.social.tiktok,
      icon: <TikTokIcon />,
      hover: 'hover:border-ink hover:bg-ink hover:text-white',
    },
    {
      name: 'LinkedIn',
      href: settings.social.linkedin,
      icon: <LinkedInIcon />,
      hover: 'hover:border-blue-safe hover:bg-blue-safe hover:text-white',
    },
  ];
}

/** Fixed left rail, desktop only — below 1101 px the WhatsApp FAB and the mobile bar carry
 *  the same actions. */
export function SocialRail({ bundle }: { bundle: Bundle }) {
  const sys = useTranslations('sys');
  return (
    <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 xl:flex">
      {socialLinks(bundle.settings, sys('whatsapp.prefill')).map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`flex h-11 w-11 items-center justify-center rounded-pill border border-border-2 bg-white text-text-secondary shadow-social transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe ${s.hover}`}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
