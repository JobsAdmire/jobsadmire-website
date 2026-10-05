import { useTranslations } from 'next-intl';
import { ContactLink } from '@/analytics/ContactLink';
import { makeT } from '@/content/pure';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { MailIcon, PhoneIcon } from './icons';
import { navGroup } from './nav';
import { NavLink } from './NavLink';

/** The accented pills in the right-hand group. Keyed by route, not by position, so the
 *  importer's order cannot move the accent: /verify wears the success accent, the CRM login
 *  row (external since 2026-10-05, opens the partner portal in a new tab) the portal pill —
 *  every external row does. */
const ACCENT: ReadonlySet<string> = new Set(['/verify']);

// 26 px, not the chrome's usual 44: these are inline utility links in a 33 px bar, which
// WCAG 2.5.8 exempts — forcing 44 px here would half again the height of every page's top
// edge. Every primary target (hamburger, language pills, CTAs, mobile bar) stays at 44 px.
// W155: the base carries no colour, so the plain links and the pills each set their own — a
// pill appended onto LINK's `text-white/70` lost to it by Tailwind's alphabetical order (W122).
const LINK_BASE =
  'inline-flex min-h-[26px] items-center gap-2 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';
const LINK = `${LINK_BASE} text-white/70 hover:text-white`;
const PILL = `${LINK_BASE} rounded-pill px-3 text-sky hover:text-white`;

export function SlimBar({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const sys = useTranslations('sys');
  const { settings } = bundle;
  return (
    // M1: the licence chip and contact links sat outside any landmark — a region names the
    // bar without claiming it is a second `<nav>` (most of it is status text, not links).
    <div
      role="region"
      aria-label={sys('nav.slimBar')}
      className="bg-navy text-body-sm text-white/70"
    >
      {/* W180: full-bleed like the design's `.ja-slim` — the container's gutter, no max-width */}
      <div className="chrome-row flex flex-wrap items-center justify-between gap-x-5 py-1.5">
        <span className="flex flex-wrap items-center gap-x-5 font-semibold">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="ja-live h-2 w-2 rounded-pill bg-success" />
            {/* the long licence line only fits from the desktop nav up */}
            <span className="hidden lg:inline">{t('hire.019')}</span>
            <span className="lg:hidden">{t('calc.419')}</span>
          </span>
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
        <span className="hidden flex-wrap items-center gap-x-5 font-semibold lg:flex">
          {/* T0b fills `slimBarRight`: /careers, /verify and the portal login row (W36 —
              nothing is hard-coded here; the row is the external portal login link, new tab);
              /blog is always listed. The portal row wears the portal pill, /verify the accent. */}
          {navGroup(bundle, 'slimBarRight', t).map((item) => (
            <NavLink
              key={item.href}
              item={item}
              className={
                item.external
                  ? `${PILL} border border-white/20 bg-white/10`
                  : ACCENT.has(item.href)
                    ? `${PILL} border border-success/40 bg-success/15`
                    : LINK
              }
            />
          ))}
        </span>
      </div>
    </div>
  );
}
