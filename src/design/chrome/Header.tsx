import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { BRAND } from '@/design/assets/brand';
import { liquidSizes } from '@/design/zoom';
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

/** W183: the design's full wordmark (`logo4.png` = `BRAND.logo`) — never the mark alone. Its
 *  intrinsic box is the 34 px size in the asset's own 742 × 146 ratio (173 × 34), so its space is
 *  reserved before the file lands. With a `sizes` (W231) next/image emits a width-list srcset,
 *  and `LOGO_SIZES` asks for 173 px up to 1440 px and for the logo's share of the screen above. */
const LOGO_H = 34;
const LOGO_W = Math.round((BRAND.logo.width * LOGO_H) / BRAND.logo.height);
/** W231: 130 px is the logo's width from 1101 (25.5 px tall), which the zoom scales above 1440.
 *  A screen from 2.5× asks for 128 px, so a 3× phone keeps the 384 px file the 1x/2x srcset gave
 *  it before (173 × 3 would pick 640); 1× still gets 256 and 2–2.5× 384 (Chrome picks the
 *  smaller of two candidates below their densities' geometric mean, which 2.01× would trip). */
const LOGO_SIZES = liquidSizes(130, `(min-resolution: 2.5dppx) 128px, ${LOGO_W}px`);
// The design's heights: 30 px below 901 (its ≤ 900 `.ja-nav img` rule; ≤ 460 too), the authored
// 34 px at 901–1100, 34 × 0.75 from 1101 (D19). Final pass A3/A4 (W184, W185 A2, W210 b): the box
// ratio is pinned from the asset's own dimensions (`LOGO_RATIO`, so the width never settles by a
// pixel when the file arrives) and the logo is FIXED — the link is `shrink-0`; below 461 a long
// page CTA caps itself at 185 px and wraps its label (`HeaderCtas`), as the design's `.ja-nav-cta`
// does, instead of squeezing the wordmark (82 % TR / 67 % EN on the calculator route at 390, T3).
const LOGO = 'block h-[30px] w-auto object-contain lg:h-[34px] xl:h-[25.5px]';
const LOGO_RATIO = { aspectRatio: `${BRAND.logo.width} / ${BRAND.logo.height}` };

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
      <div className="chrome-row-nav flex items-center justify-between gap-5 py-3 max-xs:gap-2.5">
        <Link href="/" prefetch={false} className="shrink-0 no-underline">
          <Image
            src={BRAND.logo.src}
            alt="JobsAdmire"
            width={LOGO_W}
            height={LOGO_H}
            sizes={LOGO_SIZES}
            preload
            style={LOGO_RATIO}
            className={LOGO}
          />
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
        {/* ≤ 460 the design's `.ja-nav-actions` flexes to the row's end so the capped CTA can take
            the width the fixed logo leaves (W210 b); from 461 the block keeps its own width. */}
        <div className="flex flex-none items-center gap-2 max-xs:min-w-0 max-xs:flex-auto max-xs:justify-end">
          {/* the hamburger panel carries the same switcher below lg */}
          <div className="hidden lg:block">
            <LanguageSwitcher locale={locale} label={languageLabel} />
          </div>
          <HeaderCtas table={resolveCtas(t, locale)} />
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
