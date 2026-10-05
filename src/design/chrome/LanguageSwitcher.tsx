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
 *  exists (M-10 removed the unused `sys.languageName`). The compact pills show the design's
 *  two-letter codes and keep the endonym as the accessible name. */
const ENDONYM: Record<Locale, string> = { tr: 'Türkçe', en: 'English' };
const CODE: Record<Locale, string> = { tr: 'TR', en: 'EN' };

/** The design lists English first in every switcher (`LANGS = [["EN"…], ["TR"…]]`, Homepage v4
 *  l. 1582): the header and slim-bar pills read `EN | TR`, the footer `English | Türkçe`. */
const ORDER: readonly Locale[] = ['en', 'tr'].filter((l): l is Locale =>
  (locales as readonly string[]).includes(l),
);

export type LanguageSwitcherVariant = 'light' | 'slim' | 'dark' | 'block';

/** `light`: the header's compact `EN | TR` pill (#f4f9fc track, 1.5 px #dbe8f2 edge, ink active
 *  chip — Homepage v4 ll. 300–304, 1784–1789). `slim`: the slim bar's ≤ 900 pill (white/8 track,
 *  white active chip with night text — ll. 269–273, 1801–1806). `dark`: the footer's
 *  `English | Türkçe` pill (white/6 track, the contrast-safe blue active chip — the design's
 *  #1899D5 is 3.2:1 under white, D20). `block`: the hamburger panel's two full-width buttons
 *  (ll. 310–317, 1807–1812). Every chip keeps the 24 px target minimum (WCAG 2.5.8). */
const SHELL: Record<LanguageSwitcherVariant, string> = {
  light: 'gap-[3px] rounded-pill border-[1.5px] border-border-1 bg-pale-1 p-[3px]',
  slim: 'gap-[3px] rounded-pill border border-white/20 bg-white/[0.08] p-[2px]',
  dark: 'gap-[3px] rounded-pill border border-white/20 bg-white/[0.06] p-[3px]',
  block: 'flex-1 gap-2',
};

const ITEM_BASE =
  'inline-flex items-center justify-center font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

const ITEM: Record<LanguageSwitcherVariant, string> = {
  light: `${ITEM_BASE} min-h-[30px] rounded-pill px-[11px] text-[12px] tracking-[0.4px] focus-visible:outline-blue-safe`,
  slim: `${ITEM_BASE} min-h-[30px] rounded-pill px-3 text-[12px] tracking-[0.4px] focus-visible:outline-sky`,
  dark: `${ITEM_BASE} min-h-[32px] rounded-pill px-[15px] text-[12.5px] focus-visible:outline-sky xl:text-[11px]`,
  block: `${ITEM_BASE} min-h-[44px] flex-1 rounded-xs border-[1.5px] text-[14px] focus-visible:outline-blue-safe`,
};

const ACTIVE: Record<LanguageSwitcherVariant, string> = {
  light: 'bg-ink text-white',
  slim: 'bg-white text-night',
  dark: 'bg-blue-safe text-white',
  block: 'border-ink bg-ink text-white',
};

const IDLE: Record<LanguageSwitcherVariant, string> = {
  light: 'text-text-tertiary hover:text-ink',
  slim: 'text-white/65 hover:text-white',
  dark: 'text-white/60 hover:text-white',
  block: 'border-border-1 bg-white text-text-secondary hover:text-ink',
};

const COMPACT: ReadonlySet<LanguageSwitcherVariant> = new Set(['light', 'slim']);

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
  variant?: LanguageSwitcherVariant;
}) {
  const target = alternatePath(usePathname() ?? '/');
  const compact = COMPACT.has(variant);
  return (
    // `w-fit` is the design's own `width: fit-content` on the shell (Homepage v4 l. 1126): below
    // lg the footer column is the full container width and a block-level flex shell would fill
    // it (QA W220 H-02). Not `inline-flex`: inside the Header's `div.hidden.lg:block` that makes
    // an inline-level box with line-box descent and nudges the row heights W210 pins.
    <div
      role="group"
      aria-label={label}
      className={`flex items-center ${variant === 'block' ? '' : 'w-fit '}${SHELL[variant]}`}
    >
      {ORDER.map((l) => (
        <LanguageLink
          key={l}
          to={l}
          active={l === locale}
          fallback={target as Href}
          text={compact ? CODE[l] : ENDONYM[l]}
          name={compact ? ENDONYM[l] : undefined}
          className={`${ITEM[variant]} ${l === locale ? ACTIVE[variant] : IDLE[variant]}`}
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
  text,
  name,
  className,
}: {
  to: Locale;
  active: boolean;
  fallback: Href;
  /** what the pill shows: the endonym, or the two-letter code on the compact pills */
  text: string;
  /** the full endonym as the accessible name when the pill shows only the code */
  name?: string;
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
      aria-label={name}
      className={className}
    >
      {text}
    </NextLink>
  );
}
