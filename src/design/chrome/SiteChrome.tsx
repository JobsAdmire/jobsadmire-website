import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { SkipLink } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { Footer } from './Footer';
import { Header } from './Header';
import { LanguageHint } from './LanguageHint';
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
      <Header locale={locale} bundle={bundle} primaryCta={{ href: '/hire-workers' }} />
      <LanguageHint locale={locale} />
      {variant === 'default' && (
        <>
          <SocialRail bundle={bundle} />
          <WhatsAppFab bundle={bundle} />
        </>
      )}
      {children}
      <MobileBottomBarSpacer />
      <MobileBottomBar bundle={bundle} />
      <Footer locale={locale} bundle={bundle} />
    </>
  );
}
