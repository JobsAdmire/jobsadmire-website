'use client';
import { Link, usePathname, type Href } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';

/** Endonyms, not copy: a switcher has to name the language you are switching *to*, so it
 *  cannot come from the current locale's `sys.languageName`. */
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
 *  current pathname is a browser fact. `usePathname` is `null` outside the App Router. */
export function LanguageSwitcher({
  locale,
  label,
  variant = 'light',
}: {
  locale: Locale;
  label: string;
  variant?: 'light' | 'dark' | 'block';
}) {
  const pathname = usePathname() ?? '/';
  return (
    <div role="group" aria-label={label} className={`flex items-center ${SHELL[variant]}`}>
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={pathname as Href}
            prefetch={false}
            locale={l}
            hrefLang={l}
            aria-current={active ? 'true' : undefined}
            className={`${ITEM} ${active ? ACTIVE[variant] : IDLE[variant]}`}
          >
            {ENDONYM[l]}
          </Link>
        );
      })}
    </div>
  );
}
