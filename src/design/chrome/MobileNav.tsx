'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { CloseIcon, MenuIcon } from './icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavLink, type ChromeNavItem } from './NavLink';

const ROW_BASE =
  'flex min-h-[46px] items-center text-[15px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const ROW = `${ROW_BASE} border-b border-border-3 font-bold text-ink`;
/** The design's last row — the portal login — in the contrast-safe blue, 800, with a → and no
 *  rule under it (Homepage v4 l. 326). */
const PORTAL_ROW = `${ROW_BASE} font-extrabold text-blue-safe`;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // M2: a disclosure pattern closes on Escape (focus returns to the trigger, never left stranded
  // inside a now-hidden panel) and on an outside click (a visitor tapping the page behind the
  // panel expects it gone, not a second tap to dismiss it first). Listens only while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden" ref={containerRef}>
      <button
        ref={buttonRef}
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
        <div className="container-site flex items-center gap-2.5 border-b border-border-3 pt-2.5 pb-3">
          <span className="flex-none text-[11.5px] font-extrabold uppercase tracking-[1.1px] text-text-tertiary">
            {languageLabel}
          </span>
          <LanguageSwitcher locale={locale} label={languageLabel} variant="block" />
        </div>
        <nav aria-label={menuLabel} className="container-site flex flex-col pb-4">
          {items.map((item) =>
            item.external ? (
              <NavLink
                key={item.href}
                item={item}
                className={PORTAL_ROW}
                iconEnd={<span aria-hidden="true">&nbsp;→</span>}
                onClick={() => setOpen(false)}
              />
            ) : (
              <NavLink key={item.href} item={item} className={ROW} onClick={() => setOpen(false)} />
            ),
          )}
        </nav>
      </div>
    </div>
  );
}
