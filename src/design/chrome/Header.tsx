import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { resolveCtas } from './ctas';
import { HeaderCtas } from './HeaderCtas';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { navGroup } from './nav';
import { NavLink } from './NavLink';

/** The design promotes these out of the desktop row — three into the slim bar and
 *  `/partner-with-us` into the secondary CTA. All four stay in the hamburger, which reads its
 *  own `hamburger` nav group (T0b: desktopNav + the portal login). */
const PROMOTED = new Set(['/blog', '/careers', '/verify', '/partner-with-us']);

// `text-nav` is `--fs-nav`: 12px between 901 and 1100, the 11px floor from 1101 (W11).
const NAV_LINK =
  'inline-flex min-h-[44px] items-center whitespace-nowrap text-nav font-semibold text-ink no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

export function Header({ locale, bundle }: { locale: Locale; bundle: Bundle }) {
  const t = makeT(bundle);
  // `useTranslations` resolves against the request config on the server and against the
  // provider in tests, so `sys.*` needs no prop drilling here.
  const sys = useTranslations('sys');
  const desktop = navGroup(bundle, 'desktopNav', t).filter((i) => !PROMOTED.has(i.href));
  const hamburger = navGroup(bundle, 'hamburger', t);
  const languageLabel = t('home.016');

  return (
    <header className="sticky top-0 z-40 border-b border-border-3 bg-white">
      {/* W180: the design's nav is a full-bleed row (padding only) — never the 960 px content
          box the sections share (`chrome-row-nav`, src/app/globals.css). */}
      <div className="chrome-row-nav flex items-center justify-between gap-5 py-3">
        <Link href="/" prefetch={false} className="flex-none no-underline">
          {/* 34 × 29 — the asset's own 336 × 285 ratio (see the footer's copy). */}
          <Image src="/brand/ja-mark.png" alt="JobsAdmire" width={34} height={29} priority />
        </Link>
        {/* W11 (closes R46): the row appears from the design's own 901 px. Between 901 and
            1100 the links are 12 px and may wrap onto a second line inside the nav — the
            design's `.ja-nav { flex-wrap: wrap }` below 1100 does the same — while the
            secondary CTA and the primary's tail stay `xl`-only, exactly as the design hides
            `.ja-nav-cta-secondary` and `.ja-cta-long` at ≤1100. `min-w-0 flex-1` is what lets
            the nav shrink and wrap instead of pushing the actions off the viewport; the width
            sweep at 901/1100 is the proof. Below 901 the hamburger carries the same items. */}
        <nav
          aria-label={sys('nav.main')}
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-0 lg:flex xl:gap-x-4"
        >
          {desktop.map((item) => (
            <NavLink key={item.href} item={item} className={NAV_LINK} />
          ))}
        </nav>
        <div className="flex flex-none items-center gap-2">
          {/* the hamburger panel carries the same switcher below lg */}
          <div className="hidden lg:block">
            <LanguageSwitcher locale={locale} label={languageLabel} />
          </div>
          <HeaderCtas table={resolveCtas(t)} />
          <MobileNav
            items={hamburger}
            locale={locale}
            menuLabel={t('hire.239')}
            closeLabel={sys('nav.close')}
            languageLabel={languageLabel}
          />
        </div>
      </div>
    </header>
  );
}
