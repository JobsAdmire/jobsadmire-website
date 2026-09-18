'use client';
import { useId, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { CloseIcon, MenuIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavLink, type ChromeNavItem } from './NavLink';

const ROW =
  'flex min-h-[46px] items-center border-b border-border-3 text-[15px] font-bold text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';

/** The hamburger and its panel. Only translated strings and plain data cross from the
 *  server here (D6) — no bundle, no `t`. */
export function MobileNav({
  items,
  locale,
  menuLabel,
  closeLabel,
  languageLabel,
}: {
  items: ChromeNavItem[];
  locale: Locale;
  menuLabel: string;
  closeLabel: string;
  languageLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : menuLabel}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-sm border-[1.5px] border-border-1 bg-pale-1 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div
        id={panelId}
        hidden={!open}
        // eleven 46 px rows plus the language row outgrow a landscape phone
        className="absolute inset-x-0 top-full max-h-[80dvh] overflow-y-auto border-t border-border-3 bg-white shadow-card-hover"
      >
        <div className="container-site flex items-center gap-3 border-b border-border-3 py-3">
          <span className="text-eyebrow font-extrabold uppercase tracking-[1.1px] text-muted">
            {languageLabel}
          </span>
          <LanguageSwitcher locale={locale} label={languageLabel} variant="block" />
        </div>
        <nav aria-label={menuLabel} className="container-site flex flex-col pb-4">
          {items.map((item) => (
            <NavLink key={item.href} item={item} className={ROW} onClick={() => setOpen(false)} />
          ))}
        </nav>
      </div>
    </div>
  );
}
