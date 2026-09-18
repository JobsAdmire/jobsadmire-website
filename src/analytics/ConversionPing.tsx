'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { track } from './track';

/** The conversion, fired once on arrival at `/tesekkurler?form=<key>` (D13) — the single
 *  navigation every form's success path lands on. Renders nothing; carries only the form key,
 *  the path and the locale, never anything the visitor typed. */
export function ConversionPing({ formKey, locale }: { formKey: string; locale: string }) {
  const pathname = usePathname() ?? '/';
  const fired = useRef(false);
  useEffect(() => {
    // Once per mount: StrictMode invokes effects twice in dev, and a conversion counted twice
    // is worse than one counted late.
    if (fired.current) return;
    fired.current = true;
    track('conversion', { form_key: formKey, page: pathname, locale });
    // Deliberately empty: this fires on arrival, not on any later prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
