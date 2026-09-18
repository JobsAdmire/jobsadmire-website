import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Accordion } from '@/design/primitives';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { CookiePreferencesButton } from './CookiePreferencesButton';
import { MapPinIcon, TelegramIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavLink, type ChromeNavItem } from './NavLink';
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
const OFFICE_LABEL = 'm-0 text-[11.5px] font-extrabold uppercase tracking-[1px] text-sky';
const STORE = `${FLINK} rounded-md border border-white/20 bg-white/5 px-4 text-white`;

export function Footer({ locale, bundle }: { locale: Locale; bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const labels = new Map(
    bundle.nav.map((n) => [n.href, { label: t(n.labelId), external: n.external }]),
  );
  const waHref = waLink(settings.whatsappNumber, sys('whatsapp.prefill'));

  const column = (hrefs: string[]) =>
    hrefs
      .filter((href) => labels.has(href))
      .map((href) => (
        <NavLink
          key={href}
          item={{ href, label: labels.get(href)!.label, external: labels.get(href)!.external }}
          className={FLINK}
        />
      ));
  const office = (name: string, hours: string, map: string) => (
    <span key={name} className="flex flex-col gap-1 border-t border-white/10 pt-2.5">
      <h3 className={OFFICE_LABEL}>{name}</h3>
      <span className="font-medium text-white/40">{hours}</span>
      <a href={map} target="_blank" rel="noopener noreferrer" className={FLINK}>
        <MapPinIcon size={13} />
        {t('home.192')}
      </a>
    </span>
  );
  const externalLink = (item: ChromeNavItem, className = FLINK) => (
    <NavLink item={item} className={className} />
  );

  // One body per column, rendered twice: as a static grid column from `lg` up and inside the
  // mobile accordion below it. The hidden copy is `display:none`, so it is out of the
  // accessibility tree and no media query has to be measured at runtime.
  const columns = [
    {
      id: 'employers',
      heading: t('home.189'),
      body: (
        <div className="flex flex-col gap-1">
          {column(EMPLOYERS)}
          {externalLink({
            href: `${settings.portal.host}${settings.portal.loginPath}`,
            label: t('home.012'),
            external: true,
          })}
        </div>
      ),
    },
    {
      id: 'company',
      heading: t('home.190'),
      body: <div className="flex flex-col gap-1">{column(COMPANY)}</div>,
    },
    {
      id: 'contact',
      heading: t('home.191'),
      body: (
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
          {office(t('home.196'), t('home.198'), settings.maps.antalya)}
          {office(t('home.197'), t('home.199'), settings.maps.karachi)}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue px-5 font-extrabold text-white no-underline hover:bg-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {t('home.193')}
          </a>
        </div>
      ),
    },
    {
      id: 'app',
      heading: t('home.194'),
      body: (
        <>
          <p className="m-0 mb-3.5 text-white/55">{t('home.195')}</p>
          <div className="flex flex-col items-start gap-2">
            {settings.storeLinks.android &&
              externalLink(
                { href: settings.storeLinks.android, label: t('hire.240'), external: true },
                STORE,
              )}
            {settings.storeLinks.ios &&
              externalLink(
                { href: settings.storeLinks.ios, label: t('hire.241'), external: true },
                STORE,
              )}
          </div>
        </>
      ),
    },
  ];

  return (
    <footer className="border-t-[3px] border-blue bg-navy text-body-sm">
      <div className="container-site grid gap-10 pt-16 pb-12 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <div>
          <Image src="/brand/ja-mark.png" alt="" width={50} height={50} className="mb-4" />
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

        {columns.map((c) => (
          <div key={c.id} className="hidden lg:block">
            <h2 className={HEADING}>{c.heading}</h2>
            {c.body}
          </div>
        ))}

        <div className="text-white/80 lg:hidden">
          <Accordion
            singleOpen={false}
            items={columns.map((c) => ({ id: c.id, title: c.heading, body: c.body }))}
          />
        </div>
      </div>

      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/15 py-5">
        <p className="m-0 text-white/50">{t('home.228')}</p>
        {/* R36: consent is withdrawable, and this is where visitors look for it. R40 gates it
            exactly like the banner (R38): with no container id nothing ever asked for
            consent, so there is nothing to withdraw and the button would reopen nothing. */}
        {settings.analytics.consentMode && Boolean(settings.analytics.gtmId) && (
          <CookiePreferencesButton label={sys('consent.manage')} />
        )}
      </div>
    </footer>
  );
}
