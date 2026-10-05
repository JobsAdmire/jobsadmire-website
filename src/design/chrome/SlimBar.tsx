import { useLocale, useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { mailLink, telLink } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { LoginIcon, MailIcon, PhoneIcon, ShieldCheckIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navGroup } from './nav';
import { NavLink } from './NavLink';

/** The accented pills in the right-hand group. Keyed by route, not by position, so the
 *  importer's order cannot move the accent: /verify wears the design's green "verified" pill
 *  with its shield (Homepage v4 l. 278), the CRM login row (external since 2026-10-05, opens
 *  the partner portal in a new tab) the sky portal pill with its login arrow (l. 279) — every
 *  external row does. */
const ACCENT: ReadonlySet<string> = new Set(['/verify']);

// 26 px, not the chrome's usual 44: these are inline utility links in a 33 px bar, which
// WCAG 2.5.8 exempts — forcing 44 px here would half again the height of every page's top
// edge. Every primary target (hamburger, CTAs, mobile bar) stays at 44 px; the language pill
// keeps the 24 px minimum (30 px).
// W155: the base carries no colour, so the plain links and the pills each set their own — a
// pill appended onto LINK's `text-white/70` lost to it by Tailwind's alphabetical order (W122).
const LINK_BASE =
  'inline-flex min-h-[26px] items-center gap-1.5 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const LINK = `${LINK_BASE} text-white/70 hover:text-white`;
const PILL_BASE = `${LINK_BASE} rounded-pill border px-3`;
/** The design's portal pill: white/8 face, white/22 edge, sky text — white on hover. */
const PORTAL_PILL = `${PILL_BASE} border-white/20 bg-white/[0.08] text-sky hover:bg-white/15 hover:text-white`;
/** The design's verify pill: green/16 face, mint/35 edge, mint text (#5ddfb0, 11.6:1 on night). */
const VERIFY_PILL = `${PILL_BASE} border-mint/35 bg-success/15 text-mint hover:bg-success/30 hover:text-white`;
/** The design's 1 × 12 px hairline between the groups (`.ja-slim-div`). */
const DIVIDER = 'inline-block h-3 w-px bg-white/25';

export function SlimBar({ bundle, locale: localeProp }: { bundle: Bundle; locale?: Locale }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const current = useLocale() as Locale;
  const locale = localeProp ?? current;
  const { settings } = bundle;
  return (
    // M1: the licence chip and contact links sat outside any landmark — a region names the
    // bar without claiming it is a second `<nav>` (most of it is status text, not links).
    <div
      role="region"
      aria-label={sys('nav.slimBar')}
      className="bg-night text-[12px] text-white/70 lg:text-[12.5px] xl:text-[11px]"
    >
      {/* W180: full-bleed like the design's `.ja-slim` — the container's gutter, no max-width */}
      <div className="chrome-row flex flex-wrap items-center justify-between gap-x-5 gap-y-1 py-1.5 max-lg:gap-x-2.5 max-lg:py-[5px]">
        <span className="flex flex-wrap items-center gap-x-5 font-semibold max-lg:gap-x-[18px]">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="ja-live h-2 w-2 rounded-pill bg-success" />
            {/* the design's `.ja-t-desk` / `.ja-t-mob` pair: the long line from 461 px, the short
                "İŞKUR · 1730" at ≤ 460 */}
            <span className="hidden xs:inline">{t('hire.019')}</span>
            <span className="xs:hidden">{t('calc.419')}</span>
          </span>
          <span aria-hidden="true" className={`${DIVIDER} max-lg:hidden`} />
          <ContactLink
            href={telLink(settings.phone)}
            placement="slimbar"
            className={`max-lg:hidden ${LINK}`}
          >
            <PhoneIcon size={12} />
            {settings.phoneDisplay}
          </ContactLink>
          <ContactLink
            href={mailLink(settings.email)}
            placement="slimbar"
            className={`max-lg:hidden ${LINK}`}
          >
            <MailIcon size={12} />
            {settings.email}
          </ContactLink>
        </span>
        {/* ≤ 900 the design swaps the right group for a compact EN | TR pill (`.ja-slim-lang`,
            Homepage v4 ll. 269–273); the header's own pill is hidden there. */}
        <div className="shrink-0 lg:hidden">
          <LanguageSwitcher locale={locale} label={t('home.016')} variant="slim" />
        </div>
        <span className="hidden flex-wrap items-center gap-x-5 font-semibold lg:flex">
          {/* T0b fills `slimBarRight`: /blog, /careers, /verify and the portal login row (W36 —
              nothing is hard-coded here; the row is the external portal login link, new tab).
              The design draws a hairline before the two pills. */}
          {navGroup(bundle, 'slimBarRight', t).map((item) => {
            const accent = ACCENT.has(item.href);
            const pill = item.external || accent;
            return (
              <span key={item.href} className="inline-flex items-center gap-x-5">
                {accent && <span aria-hidden="true" className={DIVIDER} />}
                {pill ? (
                  <NavLink
                    item={item}
                    className={item.external ? PORTAL_PILL : VERIFY_PILL}
                    icon={item.external ? <LoginIcon /> : <ShieldCheckIcon />}
                  />
                ) : (
                  <NavLink item={item} className={LINK} />
                )}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
}
