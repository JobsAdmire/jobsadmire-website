'use client';
import dynamic from 'next/dynamic';
import { useCallback, useSyncExternalStore } from 'react';
import type { Locale } from '@/i18n/routing';
import { hintEligibleHere } from './hint-eligibility';

/** The two chrome islands that only ever exist in the browser, behind `ssr: false` so their
 *  code leaves the initial script graph — D27's budget. A server layout cannot pass
 *  `ssr: false` itself, which is the first reason this boundary component exists.
 *
 *  `consent` carries R38's gate unchanged: no container id means no tag can fire, so there is
 *  nothing to consent to and the sheet must not appear — and with the flag false the chunk is
 *  never even fetched.
 *
 *  W148: the language hint decides BEFORE it loads. `next/dynamic` requests a chunk when the
 *  component first renders, so `LanguageHint` is rendered — and its chunk (≈ 3 KB gz)
 *  requested — only once `hintEligibleHere` (the pure `shouldShowHint` over
 *  `navigator.languages` and the stored dismissal) says so: never on an English page, never for
 *  a Turkish browser, never after a dismissal. */
const ConsentBanner = dynamic(() => import('./ConsentBanner').then((m) => m.ConsentBanner), {
  ssr: false,
});
const LanguageHint = dynamic(() => import('./LanguageHint').then((m) => m.LanguageHint), {
  ssr: false,
});

// R18: browser facts are read after hydration only — the server render and the hydrating one
// both see `false` (nothing to mismatch), then React re-renders with the live value. Nothing
// pushes updates, so the subscription is a no-op.
const subscribe = () => () => {};
const onServer = () => false;

export function ClientIslands({ consent, locale }: { consent: boolean; locale: Locale }) {
  const hint = useSyncExternalStore(
    subscribe,
    useCallback(() => hintEligibleHere(locale), [locale]),
    onServer,
  );
  return (
    <>
      {hint && <LanguageHint locale={locale} />}
      {consent && <ConsentBanner />}
    </>
  );
}
