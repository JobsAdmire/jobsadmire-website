import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the route.
import { SkipLink } from '@/design/primitives/SkipLink';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { Footer } from './Footer';
import { Header } from './Header';
import { MobileBottomBar, MobileBottomBarSpacer } from './MobileBottomBar';
import { SlimBar } from './SlimBar';
import { SocialRail } from './SocialRail';
import { WhatsAppFab } from './WhatsAppFab';

/** The whole site's chrome, composed once. `minimal` drops the floating rail and FAB for
 *  pages that must not compete with their own single action (legal, thank-you). */
export function SiteChrome({
  locale,
  bundle,
  variant = 'default',
  children,
}: {
  locale: Locale;
  bundle: Bundle;
  variant?: 'default' | 'minimal';
  children: ReactNode;
}) {
  const sys = useTranslations('sys');
  return (
    <>
      <SkipLink label={sys('skipToContent')} />
      <SlimBar bundle={bundle} />
      <Header locale={locale} bundle={bundle} />
      {variant === 'default' && (
        <>
          <SocialRail bundle={bundle} />
          <WhatsAppFab bundle={bundle} />
        </>
      )}
      {/* M3: a plain `id="main"` moves the skip link's scroll target but not sequential focus in
          Chrome (`document.activeElement` stays `body`); `tabIndex={-1}` makes `<main>` a real
          focus target for every browser, `focus:outline-none` keeps the (invisible, programmatic)
          focus ring off a landmark nobody tabs to directly. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} bundle={bundle} />
      <MobileBottomBar bundle={bundle} />
      {/* R29: last in flow, so the fixed bar clears the footer's legal line, not the page. */}
      <MobileBottomBarSpacer />
    </>
  );
}
