import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { makeT } from '@/content/pure';
import { Button } from '@/design/primitives';
import { Link, type Href } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav, type MobileNavItem } from './MobileNav';

export type ChromeCta = { href: string; external?: boolean };

/** The design promotes these out of the desktop row — three into the slim bar and
 *  `/partner-with-us` into the secondary CTA. All four stay in the hamburger panel. */
const PROMOTED = new Set(['/blog', '/careers', '/verify', '/partner-with-us']);
const SECONDARY_CTA = '/partner-with-us';

const NAV_LINK =
  'inline-flex min-h-[44px] items-center whitespace-nowrap text-body-sm font-semibold text-ink no-underline hover:text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

export function Header({
  locale,
  bundle,
  primaryCta,
}: {
  locale: Locale;
  bundle: Bundle;
  primaryCta: ChromeCta;
}) {
  const t = makeT(bundle);
  // `useTranslations` resolves against the request config on the server and against the
  // provider in tests, so `sys.*` needs no prop drilling here.
  const sys = useTranslations('sys');
  const items: MobileNavItem[] = bundle.nav
    .filter((n) => n.group === 'desktopNav')
    .sort((a, b) => a.order - b.order)
    .map((n) => ({ href: n.href, label: t(n.labelId), external: n.external }));
  const secondary = items.find((i) => i.href === SECONDARY_CTA);
  const languageLabel = t('home.016');

  return (
    <header className="sticky top-0 z-40 border-b border-border-3 bg-white">
      <div className="container-site flex items-center justify-between gap-5 py-3">
        <Link href="/" className="flex-none no-underline">
          <Image src="/brand/ja-mark.png" alt="JobsAdmire" width={34} height={34} priority />
        </Link>
        <nav aria-label={sys('nav.main')} className="hidden items-center gap-4 lg:flex">
          {items
            .filter((i) => !PROMOTED.has(i.href))
            .map((item) => (
              <Link key={item.href} href={item.href as Href} className={NAV_LINK}>
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="flex flex-none items-center gap-2">
          <LanguageSwitcher locale={locale} label={languageLabel} />
          {secondary && (
            <Button
              variant="secondary"
              href={secondary.href}
              className="hidden whitespace-nowrap xl:inline-flex"
            >
              {secondary.label}
            </Button>
          )}
          <Button
            variant="primary"
            href={primaryCta.href}
            external={primaryCta.external}
            className="whitespace-nowrap bg-ink hover:bg-blue"
          >
            {t('home.014')} <span className="hidden xl:inline">{t('home.015')}</span>
          </Button>
          <MobileNav
            items={items}
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
