'use client';
import NextLink from 'next/link';
import { getPathname, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { alternatePath } from './alternate-path';
import { useAlternatePath } from './use-alternate-path';

/** The typed internal pathname `getPathname` accepts (`src/lib/seo/routes.ts` has the same
 *  alias): NOT `next/link`'s own `Href`, whose object variant's `query` is a plain `UrlObject`
 *  field and does not structurally match `getPathname`'s narrower one. Both pills now resolve
 *  their href through `getPathname` (M1), so this is the only shape that matters here. */
type Href = Parameters<typeof getPathname>[0]['href'];

/** Endonyms, not copy: a switcher has to name the language you are switching *to*, so it
 *  cannot come from a `sys.*` string in the *current* locale — which is why no such key
 *  exists (M-10 removed the unused `sys.languageName`). */
const ENDONYM: Record<Locale, string> = { tr: 'Türkçe', en: 'English' };

const SHELL: Record<'light' | 'dark' | 'block', string> = {
  light: 'gap-1 rounded-pill border border-border-1 bg-pale-1 p-1',
  dark: 'gap-1 rounded-pill border border-white/20 bg-white/10 p-1',
  block: 'gap-2',
};

const ITEM =
  'inline-flex min-h-[44px] items-center rounded-pill px-3 text-body-sm font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

const ACTIVE: Record<'light' | 'dark' | 'block', string> = {
  light: 'bg-white text-ink shadow-card',
  dark: 'bg-white/90 text-navy',
  block: 'bg-navy text-white',
};

const IDLE: Record<'light' | 'dark' | 'block', string> = {
  light: 'text-text-secondary hover:text-blue-safe',
  dark: 'text-white/70 hover:text-white',
  block: 'border border-border-1 text-text-secondary hover:text-blue-safe',
};

/** Client-only: the switch has to keep the visitor on the page they are reading, and the
 *  current pathname is a browser fact. `usePathname` is `null` outside the App Router.
 *  On a dynamic route it returns the template, so `alternatePath` sends the switch to the
 *  parent index rather than a slug that does not exist in the other locale (R58) — unless
 *  the page's own hreflang tag names the real alternate, which wins once hydrated (W17). */
export function LanguageSwitcher({
  locale,
  label,
  variant = 'light',
}: {
  locale: Locale;
  label: string;
  variant?: 'light' | 'dark' | 'block';
}) {
  const target = alternatePath(usePathname() ?? '/');
  return (
    <div role="group" aria-label={label} className={`flex items-center ${SHELL[variant]}`}>
      {locales.map((l) => (
        <LanguageLink
          key={l}
          to={l}
          active={l === locale}
          fallback={target as Href}
          className={`${ITEM} ${l === locale ? ACTIVE[variant] : IDLE[variant]}`}
        />
      ))}
    </div>
  );
}

/** One pill. The hook is called here, once per locale, never inside the `.map` callback. */
function LanguageLink({
  to,
  active,
  fallback,
  className,
}: {
  to: Locale;
  active: boolean;
  fallback: Href;
  className: string;
}) {
  const alternate = useAlternatePath(to);
  // One element type for both sources, so hydration only ever patches `href` and never
  // remounts the pill (M1): the tag's path is already localized; the fallback is an internal
  // pathname resolved through next-intl's `getPathname`, same as the tag would have been.
  const href = alternate ?? getPathname({ href: fallback, locale: to });
  return (
    <NextLink
      href={href}
      prefetch={false}
      hrefLang={to}
      aria-current={active ? ('true' as const) : undefined}
      className={className}
    >
      {ENDONYM[to]}
    </NextLink>
  );
}
