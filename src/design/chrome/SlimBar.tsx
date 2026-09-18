import { makeT } from '@/content/pure';
import { Link, type Href } from '@/i18n/navigation';
import { mailLink, telLink } from '@/lib/contact';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { MailIcon, PhoneIcon } from './icons';

/** The four links the design promotes into the slim bar. `bundle.nav` only carries the
 *  `desktopNav` group today, so their ids live here until WP2 fills `slimBarRight`. */
const RIGHT = [
  { href: '/blog', labelId: 'home.013', accent: false },
  { href: '/careers', labelId: 'home.009', accent: false },
  { href: '/verify', labelId: 'home.011', accent: true },
] as const;

// 26 px, not the chrome's usual 44: these are inline utility links in a 33 px bar, which
// WCAG 2.5.8 exempts — forcing 44 px here would half again the height of every page's top
// edge. Every primary target (hamburger, language pills, CTAs, mobile bar) stays at 44 px.
const LINK =
  'inline-flex min-h-[26px] items-center gap-2 text-white/70 no-underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky';

export function SlimBar({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  const { settings } = bundle;
  const portalHref = `${settings.portal.host}${settings.portal.loginPath}`;
  return (
    <div className="bg-navy text-body-sm text-white/70">
      <div className="container-site flex flex-wrap items-center justify-between gap-x-5 py-1.5">
        <span className="flex flex-wrap items-center gap-x-5 font-semibold">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
            {/* the long licence line only fits from the desktop nav up */}
            <span className="hidden lg:inline">{t('hire.019')}</span>
            <span className="lg:hidden">{t('calc.419')}</span>
          </span>
          <a href={telLink(settings.phone)} className={`hidden lg:inline-flex ${LINK}`}>
            <PhoneIcon size={12} />
            {settings.phoneDisplay}
          </a>
          <a href={mailLink(settings.email)} className={`hidden lg:inline-flex ${LINK}`}>
            <MailIcon size={12} />
            {settings.email}
          </a>
        </span>
        <span className="hidden flex-wrap items-center gap-x-5 font-semibold lg:flex">
          {RIGHT.map((item) => (
            <Link
              key={item.href}
              href={item.href as Href}
              className={
                item.accent
                  ? `${LINK} rounded-pill border border-success/40 bg-success/15 px-3 text-sky`
                  : LINK
              }
            >
              {t(item.labelId)}
            </Link>
          ))}
          <a
            href={portalHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${LINK} rounded-pill border border-white/20 bg-white/10 px-3 text-sky`}
          >
            {t('home.012')}
          </a>
        </span>
      </div>
    </div>
  );
}
