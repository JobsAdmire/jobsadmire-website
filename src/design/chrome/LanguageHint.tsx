'use client';
import { useCallback, useId, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, type Href } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { alternatePath } from './alternate-path';

export const HINT_KEY = 'ja-lang-hint';

/** Turkish page + an English browser + not dismissed. Pure so the rule is testable without
 *  a DOM, and so the component never has to decide anything twice. */
export function shouldShowHint(
  locale: string,
  languages: readonly string[],
  dismissed: string | null,
) {
  return (
    locale === 'tr' &&
    languages.some((l) => l.toLowerCase().startsWith('en')) &&
    dismissed !== 'off'
  );
}

// R18's pattern: browser facts (`navigator.languages`, `localStorage`) are never read during
// the server render or the hydrating one — both see `false`, then React re-renders with the
// live value. Nothing pushes updates, so the subscription is a no-op.
const subscribe = () => () => {};
const onServer = () => false;

function readDismissal(): string | null {
  try {
    return window.localStorage.getItem(HINT_KEY);
  } catch {
    // storage blocked (private mode): treat as "not dismissed"
    return null;
  }
}

/** English copy in both locales on purpose: it is read by visitors whose browser is set to
 *  English while they are looking at the Turkish site. */
export function LanguageHint({ locale }: { locale: Locale }) {
  const sys = useTranslations('sys');
  const bodyId = useId();
  // R58: on a dynamic route `usePathname()` is the template (`/blog/[slug]`); the English slug
  // is a different string the client cannot know, so the hint offers the parent index instead.
  const target = alternatePath(usePathname() ?? '/');
  const [dismissed, setDismissed] = useState(false);
  const eligible = useSyncExternalStore(
    subscribe,
    useCallback(
      () => shouldShowHint(locale, navigator.languages ?? [navigator.language], readDismissal()),
      [locale],
    ),
    onServer,
  );

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(HINT_KEY, 'off');
    } catch {
      // storage blocked: the hint simply returns on the next visit
    }
  }

  if (!eligible || dismissed) return null;
  return (
    // R45: out of flow, not a strip above the header. The hint can only be decided in the
    // browser, so in flow it inserted 57 px after hydration and shifted the whole page —
    // CLS 0.099 on every Turkish page, the single largest metric cost on the site. As a fixed
    // sheet it costs nothing: it sits above the mobile bottom bar (74 px, z-50) below `lg`
    // and clears the phone's home indicator; z-55 keeps it under the consent sheet (z-60),
    // which must always win, and above the bar.
    <div
      role="region"
      aria-labelledby={bodyId}
      className="fixed inset-x-3 bottom-[calc(74px+0.75rem+env(safe-area-inset-bottom))] z-[55] rounded-base border border-tint-border bg-tint shadow-card-hover lg:bottom-4 lg:left-1/2 lg:right-auto lg:w-[min(560px,calc(100%-2rem))] lg:-translate-x-1/2"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3">
        <p id={bodyId} className="m-0 font-bold">
          {sys('languageHint.body')}
        </p>
        <Link
          href={target as Href}
          locale="en"
          prefetch={false}
          onClick={dismiss}
          className="inline-flex min-h-[44px] items-center rounded-pill bg-ink px-4 font-extrabold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
        >
          {sys('languageHint.switch')}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          // tertiary (#64748b) is 4.25:1 on the tint strip; secondary clears AA at 5.5:1.
          className="inline-flex min-h-[44px] items-center px-2 font-bold text-text-secondary hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
        >
          {sys('languageHint.dismiss')}
        </button>
      </div>
    </div>
  );
}
