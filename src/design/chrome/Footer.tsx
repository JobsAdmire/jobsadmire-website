import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Link, type Href } from '@/i18n/navigation';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { MapPinIcon, TelegramIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { socialLinks } from './SocialRail';

const EMPLOYERS = [
  '/hire-workers',
  '/available-workers',
  '/hiring-cost-calculator',
  '/work-permit',
  '/verify',
];
const COMPANY = ['/about', '/success-stories', '/blog', '/partner-with-us', '/careers', '/contact'];

const HEADING = 'm-0 mb-4 text-[14px] font-extrabold uppercase tracking-[0.6px] text-white/90';
const FLINK =
  'inline-flex min-h-[34px] items-center gap-2 text-white/60 no-underline hover:text-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const OFFICE_LABEL =
  'm-0 text-[11.5px] font-extrabold uppercase tracking-[1px] text-sky font-[inherit]';

export function Footer({ locale, bundle }: { locale: Locale; bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const labels = new Map(bundle.nav.map((n) => [n.href, t(n.labelId)]));
  const column = (hrefs: string[]) =>
    hrefs
      .filter((href) => labels.has(href))
      .map((href) => (
        <Link key={href} href={href as Href} className={FLINK}>
          {labels.get(href)}
        </Link>
      ));
  const offices = [
    { name: t('home.196'), hours: t('home.198'), map: settings.maps.antalya },
    { name: t('home.197'), hours: t('home.199'), map: settings.maps.karachi },
  ];

  return (
    <footer className="border-t-[3px] border-blue bg-navy text-body-sm">
      <div className="container-site grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 pt-16 pb-12">
        <div>
          <Image
            src="/brand/ja-mark.png"
            alt="JobsAdmire"
            width={50}
            height={50}
            className="mb-4"
          />
          <p className="m-0 mb-4 max-w-[330px] text-white/65">{t('home.188')}</p>
          <p className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-4 py-1.5 font-bold text-sky">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
            {t('hire.019')}
          </p>
          <div className="mb-4">
            <LanguageSwitcher locale={locale} label={t('home.016')} variant="dark" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {socialLinks(settings, sys('whatsapp.prefill')).map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={`flex h-11 w-11 items-center justify-center rounded-pill border border-white/20 bg-white/5 text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${s.hover}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className={HEADING}>{t('home.189')}</h2>
          <div className="flex flex-col gap-1">
            {column(EMPLOYERS)}
            <a
              href={`${settings.portal.host}${settings.portal.loginPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className={FLINK}
            >
              {t('home.012')}
            </a>
          </div>
        </div>

        <div>
          <h2 className={HEADING}>{t('home.190')}</h2>
          <div className="flex flex-col gap-1">{column(COMPANY)}</div>
        </div>

        <div>
          <h2 className={HEADING}>{t('home.191')}</h2>
          <div className="flex flex-col gap-1">
            <a href={telLink(settings.phone)} className={FLINK}>
              {settings.phoneDisplay}
            </a>
            <a href={mailLink(settings.email)} className={FLINK}>
              {settings.email}
            </a>
            <a
              href={settings.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={FLINK}
            >
              <TelegramIcon />
              {t('home.202')}
            </a>
            {offices.map((office) => (
              <span
                key={office.name}
                className="flex flex-col gap-1 border-t border-white/10 pt-2.5"
              >
                <h3 className={OFFICE_LABEL}>{office.name}</h3>
                <span className="font-medium text-white/40">{office.hours}</span>
                <a href={office.map} target="_blank" rel="noopener noreferrer" className={FLINK}>
                  <MapPinIcon size={13} />
                  {t('home.192')}
                </a>
              </span>
            ))}
            <a
              href={waLink(settings.whatsappNumber, sys('whatsapp.prefill'))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue px-5 font-extrabold text-white no-underline hover:bg-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
            >
              {t('home.193')}
            </a>
          </div>
        </div>

        <div>
          <h2 className={HEADING}>{t('home.194')}</h2>
          <p className="m-0 mb-3.5 text-white/55">{t('home.195')}</p>
          <div className="flex flex-col items-start gap-2">
            {settings.storeLinks.android && (
              <a
                href={settings.storeLinks.android}
                target="_blank"
                rel="noopener noreferrer"
                className={`${FLINK} rounded-md border border-white/20 bg-white/5 px-4 text-white`}
              >
                {t('hire.240')}
              </a>
            )}
            {settings.storeLinks.ios && (
              <a
                href={settings.storeLinks.ios}
                target="_blank"
                rel="noopener noreferrer"
                className={`${FLINK} rounded-md border border-white/20 bg-white/5 px-4 text-white`}
              >
                {t('hire.241')}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="container-site border-t border-white/15 py-5">
        <p className="m-0 text-white/50">{t('home.228')}</p>
      </div>
    </footer>
  );
}
