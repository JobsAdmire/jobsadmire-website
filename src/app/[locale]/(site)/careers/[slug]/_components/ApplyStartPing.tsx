'use client';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { track } from '@/analytics/track';

/** W12/W26/W67: `career_apply_start` once per page view, on the visitor's first focus inside the
 *  apply form. `slug` is the opening's public URL segment (≤ 80 characters), never anything a
 *  visitor typed; `page` is the real URL from `next/navigation` (R35), not next-intl's internal
 *  key. An inert marker finds its form, so `FormShell` needs no ref. */
export function ApplyStartPing({ slug }: { slug: string }) {
  const marker = useRef<HTMLSpanElement>(null);
  const page = usePathname() ?? '/';
  const locale = useLocale();
  useEffect(() => {
    const form = marker.current?.closest('form');
    if (!form) return;
    const onFirstFocus = () => {
      track('career_apply_start', { page, locale, slug: slug.slice(0, 80) });
      form.removeEventListener('focusin', onFirstFocus);
    };
    form.addEventListener('focusin', onFirstFocus);
    return () => form.removeEventListener('focusin', onFirstFocus);
  }, [page, locale, slug]);
  return <span ref={marker} hidden />;
}
