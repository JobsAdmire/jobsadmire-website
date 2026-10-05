import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { getOffice, type OfficeKey } from '@/content/collections';
import { makeT } from '@/content/pure';
import { BRAND } from '@/design/assets/brand';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the route.
import { Accordion } from '@/design/primitives/Accordion';
import { liquidSizes } from '@/design/zoom';
import { mailLink, telLink, waLink } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { CookiePreferencesButton } from './CookiePreferencesButton';
import { MapPinIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navGroup } from './nav';
import { NavLink, type ChromeNavItem } from './NavLink';
import { socialLinks } from './SocialRail';

/** The legal row's four links (W11; QA W221 LEGAL-04). The frozen contract has no `footerLegal`
 *  nav group, so this is the one route list still declared in the chrome — canonical ids per
 *  R15 for the two the package names; the KVKK notice and the Cookie Policy have no package id
 *  (T13 pages), so they read their own `sys.legal.*.title` — until this row linked them they were
 *  orphan pages (indexable, in the sitemap, named by every consent checkbox, linked from nowhere
 *  while the consent banner is unmounted). */
const LEGAL = [
  { href: '/privacy', labelId: 'home.218' },
  { href: '/terms', labelId: 'home.219' },
  { href: '/kvkk', sysLabelId: 'legal.kvkk.title' },
  { href: '/cookie-policy', sysLabelId: 'legal.cookiePolicy.title' },
] as const;

/** W183: the design's footer logo is the full wordmark (`BRAND.logo`), 50 px tall — 37.5 px from
 *  1101 (D19) — turned white by its own `filter: brightness(0) invert(1)` at opacity .95 (no white
 *  variant of the file exists yet — docs/ARCHITECTURE.md § Assets). 254 × 50 is the asset's own
 *  742 × 146 ratio, so the box is reserved before the image lands (CLS). */
const LOGO_H = 50;
const LOGO_W = Math.round((BRAND.logo.width * LOGO_H) / BRAND.logo.height);
/** W231: 191 px is the logo's width from 1101 (37.5 px tall), which the zoom scales above 1440.
 *  A screen from 2.5× asks for 213 px, so a 3× phone keeps the 640 px file the 1x/2x srcset gave
 *  it before (254 × 3 would pick 828); 1× still gets 256 and 2–2.5× 640. */
const LOGO_SIZES = liquidSizes(191, `(min-resolution: 2.5dppx) 213px, ${LOGO_W}px`);
const LOGO =
  'mb-4 block h-[50px] w-auto object-contain object-left brightness-0 invert opacity-95 xl:h-[37.5px] xl:max-w-none';
const HEADING =
  'm-0 mb-4 text-[14px] font-extrabold uppercase tracking-[0.6px] text-white/90 xl:text-balance';
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
  const office = (key: OfficeKey, name: string, hours: string, map: string) => {
    const row = getOffice(bundle, key);
    return (
      <span key={name} className="flex flex-col gap-1 border-t border-white/10 pt-2.5">
        <h3 className={OFFICE_LABEL}>{name}</h3>
        {/* The design's two address lines (Homepage v4 ll. 1170/1176, rgba .6 = `white/60`, ≈ 6.5:1
            on navy) — the offices row's own package ids (contact.133/134, contact.105/103), as
            OfficeCard and the Organization JSON-LD read them (W34). QA W220 H-01. */}
        <span className="font-medium leading-normal text-white/60">
          {t(row.addressId)}
          <br />
          {t(row.addressLine2Id)}
        </span>
        {/* /40 is 3.8:1 on navy — opening hours are information, not decoration (D20). */}
        <span className="font-medium text-white/55">{hours}</span>
        <a href={map} target="_blank" rel="noopener noreferrer" className={FLINK}>
          <MapPinIcon size={13} />
          {t('home.192')}
        </a>
      </span>
    );
  };
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
          {office('antalya', t('home.196'), t('home.198'), settings.maps.antalya)}
          {office('karachi', t('home.197'), t('home.199'), settings.maps.karachi)}
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
      {/* W180 (D19): from 1101 the design's `minmax(200px, 1fr)` and `gap: 40px 36px` × 0.75, so
          its five columns stay in one row of the 1240 px box (W228). Tailwind's preflight caps
          every img at its column width and object-fit defaults to stretch, so the wordmark carries
          `object-contain object-left` and, from 1101, `xl:max-w-none` so it keeps its aspect and
          overhangs its 150 px column into the gap as the design's does (T1b review I1). */}
      <div className="container-site grid gap-10 pt-16 pb-12 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] xl:gap-x-[27px] xl:gap-y-[30px]">
        <div>
          {/* decorative: the header's logo already names the site */}
          <Image
            src={BRAND.logo.src}
            alt=""
            width={LOGO_W}
            height={LOGO_H}
            sizes={LOGO_SIZES}
            className={LOGO}
          />
          <p className="m-0 mb-4 max-w-[330px] text-white/65">{t('home.188')}</p>
          <p className="m-0 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-4 py-1.5 font-bold text-sky xl:text-balance">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
            {/* W230: a no-break space keeps the "·" at the end of line 1 when the chip wraps */}
            {t('hire.019').replace(' · ', ' · ')}
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

      {/* Final pass A6 (T1b M7): the divider spans the content box, gutters included — on an
          inner div, so the container's own padding never shortens the line. */}
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/15 py-5">
          <p className="m-0 text-white/50">{t('home.228')}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {/* W11: Privacy/Terms in the legal row — all four legal pages exist since T13
              (`(minimal)/privacy`, `/terms`, `/kvkk`, `/cookie-policy`); the row wraps (LEGAL-04). */}
            <nav aria-label={sys('nav.legal')} className="flex flex-wrap items-center gap-x-4">
              {LEGAL.map((l) => (
                <NavLink
                  key={l.href}
                  item={{
                    href: l.href,
                    label: 'labelId' in l ? t(l.labelId) : sys(l.sysLabelId),
                    external: false,
                  }}
                  className={FLINK}
                />
              ))}
            </nav>
            {/* QA W221 H-04: the design's legal row ends with `<span>© 2026 Jobs Admire</span>`
              (Homepage v4 l. 1222) — partner.214 is the package's one © string (brand one word
              since W221), the chrome's canonical id for it (R15). */}
            <span className="text-white/50">{t('partner.214')}</span>
            {/* R36: consent is withdrawable, and this is where visitors look for it. R40 gates it
              exactly like the banner (R38): with no container id nothing ever asked for
              consent, so there is nothing to withdraw and the button would reopen nothing. */}
            {settings.analytics.consentMode && Boolean(settings.analytics.gtmId) && (
              <CookiePreferencesButton label={sys('consent.manage')} />
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
