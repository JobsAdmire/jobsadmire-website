'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { FormKey } from './forms';
import { track } from './track';

/** The conversion, fired on arrival at `/tesekkurler?form=<key>` (D13) — the single
 *  navigation every form's success path lands on. Renders nothing; carries only the form key,
 *  the path and the locale, never anything the visitor typed.
 *
 *  Deduped once per session per form+path (R37), so a reload, a back-forward restore or a
 *  re-render cannot inflate the count — while a different form key, or the same form on
 *  another path, still counts. The page renders this with `key={formKey}` so a client-side
 *  navigation between keys remounts it rather than silently reusing the fired instance. */
export function ConversionPing({ formKey, locale }: { formKey: FormKey; locale: string }) {
  // `next/navigation`'s pathname is the real URL (`/tesekkurler`), not next-intl's internal
  // route key — R35: the analytics `page` param is what the visitor's address bar shows.
  const pathname = usePathname() ?? '/';
  const fired = useRef(false);
  useEffect(() => {
    // Strict mode invokes effects twice in dev; a conversion counted twice is worse than one
    // counted late.
    if (fired.current) return;
    fired.current = true;
    const k = `ja_conv:${formKey}:${pathname}`;
    try {
      if (sessionStorage.getItem(k)) return;
    } catch {
      // storage blocked (private mode): no dedupe available — fire rather than lose the lead.
    }
    track('conversion', { form_key: formKey, page: pathname, locale });
    try {
      sessionStorage.setItem(k, '1');
    } catch {
      /* private mode */
    }
    // Deliberately empty: this fires on arrival, not on any later prop change — remounting
    // (via `key`) is how a new form key gets its own ping.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
