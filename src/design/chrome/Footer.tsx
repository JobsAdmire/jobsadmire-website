import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { Accordion } from '@/design/primitives';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { CookiePreferencesButton } from './CookiePreferencesButton';
import { MapPinIcon, TelegramIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navGroup } from './nav';
import { NavLink, type ChromeNavItem } from './NavLink';
import { socialLinks } from './SocialRail';

/** The legal row's two links (W11). The frozen contract has no `footerLegal` nav group, so
 *  this is the one route list still declared in the chrome — canonical ids per R15. */
const LEGAL = [
  { href: '/privacy', labelId: 'home.218' },
  { href: '/terms', labelId: 'home.219' },
] as const;

const HEADING = 'm-0 mb-4 text-[14px] font-extrabold uppercase tracking-[0.6px] text-white/90';
// W155: the base carries no colour, so the column links and the store badges each set their
// own — a badge appended onto FLINK's `text-white/60` lost to it by Tailwind's alphabetical
// order (W122).
const FLINK_BASE =
  'inline-flex min-h-[34px] items-center gap-2 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const FLINK = `${FLINK_BASE} text-white/60 hover:text-sky`;
const OFFICE_LABEL = 'm-0 text-[11.5px] font-extrabold uppercase tracking-[1px] text-sky';
const STORE = `${FLINK_BASE} rounded-md border border-white/20 bg-white/5 px-4 text-white hover:text-sky`;

export function Footer({ locale, bundle }: { locale: Locale; bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  const waHref = waLink(settings.whatsappNumber, sys('whatsapp.prefill'));

  // T0b fills `footerEmployers` (incl. the portal login row, W36 — the internal /portal-login
  // chooser since W88) and `footerCompany`; `navGroup` drops /blog below the threshold (W4).
  const column = (items: ChromeNavItem[]) =>
    items.map((item) => <NavLink key={item.href} item={item} className={FLINK} />);
  const office = (name: string, hours: string, map: string) => (
    <span key={name} className="flex flex-col gap-1 border-t border-white/10 pt-2.5">
      <h3 className={OFFICE_LABEL}>{name}</h3>
      {/* /40 is 3.8:1 on navy — opening hours are information, not decoration (D20). */}
      <span className="font-medium text-white/55">{hours}</span>
      <a href={map} target="_blank" rel="noopener noreferrer" className={FLINK}>
        <MapPinIcon size={13} />
        {t('home.192')}
      </a>
    </span>
  );
  const storeLink = (item: ChromeNavItem) => <NavLink item={item} className={STORE} />;

  // One body per column, rendered twice: as a static grid column from `lg` up and inside the
  // mobile accordion below it. The hidden copy is `display:none`, so it is out of the
  // accessibility tree and no media query has to be measured at runtime.
  const columns = [
    {
      id: 'employers',
      heading: t('home.189'),
      body: (
        <div className="flex flex-col gap-1">{column(navGroup(bundle, 'footerEmployers', t))}</div>
      ),
    },
    {
      id: 'company',
      heading: t('home.190'),
      body: (
        <div className="flex flex-col gap-1">{column(navGroup(bundle, 'footerCompany', t))}</div>
      ),
    },
    {
      id: 'contact',
      heading: t('home.191'),
      body: (
        <div className="flex flex-col gap-1">
          <ContactLink href={telLink(settings.phone)} placement="footer" className={FLINK}>
            {settings.phoneDisplay}
          </ContactLink>
          <ContactLink href={mailLink(settings.email)} placement="footer" className={FLINK}>
            {settings.email}
          </ContactLink>
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
          <ContactLink
            href={waHref}
            placement="footer"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-md bg-blue-safe px-5 font-extrabold text-white no-underline hover:bg-sky hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {t('home.193')}
          </ContactLink>
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
              storeLink({
                href: settings.storeLinks.android,
                label: t('hire.240'),
                external: true,
              })}
            {settings.storeLinks.ios &&
              storeLink({ href: settings.storeLinks.ios, label: t('hire.241'), external: true })}
          </div>
        </>
      ),
    },
  ];

  return (
    <footer className="border-t-[3px] border-blue bg-navy text-body-sm">
      <div className="container-site grid gap-10 pt-16 pb-12 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <div>
          {/* 50 × 42 is the asset's own 336 × 285 ratio: a square box here reserves 7 px too
              much and the whole footer jumps when the image lands (CLS). */}
          <Image src="/brand/ja-mark.png" alt="" width={50} height={42} className="mb-4" />
          <p className="m-0 mb-4 max-w-[330px] text-white/65">{t('home.188')}</p>
          <p className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-4 py-1.5 font-bold text-sky">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
            {t('hire.019')}
          </p>
          <div className="mb-4">
            <LanguageSwitcher locale={locale} label={t('home.016')} variant="dark" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* W12: the WhatsApp tile fires whatsapp_click; the others are plain anchors
                (`ContactLink` classifies by href). */}
            {socialLinks(settings, sys('whatsapp.prefill')).map((s) => (
              <ContactLink
                key={s.name}
                href={s.href}
                placement="footer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={`flex h-11 w-11 items-center justify-center rounded-pill border border-white/20 bg-white/5 text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${s.hover}`}
              >
                {s.icon}
              </ContactLink>
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
            headingLevel={2}
            singleOpen={false}
            items={columns.map((c) => ({ id: c.id, title: c.heading, body: c.body }))}
          />
        </div>
      </div>

      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/15 py-5">
        <p className="m-0 text-white/50">{t('home.228')}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {/* W11: Privacy/Terms in the legal row. The pages land in T13; until then the
              `[...rest]` catch-all answers 404 inside the chrome. */}
          <nav aria-label={sys('nav.legal')} className="flex items-center gap-x-4">
            {LEGAL.map((l) => (
              <NavLink
                key={l.href}
                item={{ href: l.href, label: t(l.labelId), external: false }}
                className={FLINK}
              />
            ))}
          </nav>
          {/* R36: consent is withdrawable, and this is where visitors look for it. R40 gates it
              exactly like the banner (R38): with no container id nothing ever asked for
              consent, so there is nothing to withdraw and the button would reopen nothing. */}
          {settings.analytics.consentMode && Boolean(settings.analytics.gtmId) && (
            <CookiePreferencesButton label={sys('consent.manage')} />
          )}
        </div>
      </div>
    </footer>
  );
}
