import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { waLink } from '@/lib/contact';
import type { Bundle, Settings } from '../../../contract/website-bundle.v1';
import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from './icons';

export type SocialLink = { name: string; href: string; icon: ReactNode; hover: string };

/** One list for the rail and the footer. The names are brands, not copy — no string ids.
 *  W226 (owner): Facebook, Instagram, WhatsApp and LinkedIn only — the design's Telegram and
 *  TikTok tiles are gone (`settings.telegramUrl` / `social.tiktok` stay unused in the bundle). */
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
      name: 'LinkedIn',
      href: settings.social.linkedin,
      icon: <LinkedInIcon />,
      hover: 'hover:border-blue-safe hover:bg-blue-safe hover:text-white',
    },
  ];
}

/** Fixed left rail, desktop only — below 1101 px the WhatsApp FAB and the mobile bar carry
 *  the same actions. N8: a named complementary landmark (axe `region`), top-level beside the
 *  header/main/footer. */
export function SocialRail({ bundle }: { bundle: Bundle }) {
  const sys = useTranslations('sys');
  return (
    <aside
      aria-label={sys('nav.socialRail')}
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 xl:flex"
    >
      {/* SHARED 2.7: the design's 26 px hairlines above and below the tiles (Homepage v4
          ll. 347/355, #c9d8e4) — decorative. */}
      <span aria-hidden="true" className="mb-0.5 block h-[26px] w-px bg-[#c9d8e4]" />
      {/* W12: the WhatsApp tile fires whatsapp_click (placement social_rail); the rest are
          plain anchors — `ContactLink` classifies by href. */}
      {socialLinks(bundle.settings, sys('whatsapp.prefill')).map((s) => (
        <ContactLink
          key={s.name}
          href={s.href}
          placement="social_rail"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`flex h-11 w-11 items-center justify-center rounded-pill border border-border-2 bg-white text-text-secondary shadow-social transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe ${s.hover}`}
        >
          {s.icon}
        </ContactLink>
      ))}
      <span aria-hidden="true" className="mt-0.5 block h-[26px] w-px bg-[#c9d8e4]" />
    </aside>
  );
}
