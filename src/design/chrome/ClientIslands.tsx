'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { RevealObserver } from '@/design/motion/RevealObserver';
import { keepScrollAcrossZoom } from '@/design/zoom';
import type { Locale } from '@/i18n/routing';
import { hintEligibleHere } from './hint-eligibility';
import { guardFocusUnderHeader, publishHeaderHeight } from './sticky-header';

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
  const pathname = usePathname();
  // W231: a resize that changes the liquid desktop's zoom keeps the reader's place — mounted
  // here because the locale layout renders this boundary on every page, `(bare)` included.
  useEffect(() => keepScrollAcrossZoom(), []);
  // W232: keyboard focus never lands under the sticky header (WCAG 2.2 SC 2.4.11). The guard
  // reads the header afresh on every focus, so one listener serves every page; without a header
  // (`(bare)`) it does nothing.
  useEffect(() => guardFocusUnderHeader(), []);
  // W232: the header's real height for the sticky columns (`--header-h`). This boundary outlives
  // client navigations, and a route into another group (`(site)` ↔ `(minimal)`) swaps the header
  // element, so it is observed afresh on every pathname.
  useEffect(() => publishHeaderHeight(), [pathname]);
  const hint = useSyncExternalStore(
    subscribe,
    useCallback(() => hintEligibleHere(locale), [locale]),
    onServer,
  );
  return (
    <>
      {/* The design's scroll reveal (src/design/motion): tiny and needed on every page, so it is
          part of this boundary rather than a lazy chunk — a deferred one would hold the first
          sections back for another round trip. */}
      <RevealObserver />
      {hint && <LanguageHint locale={locale} />}
      {consent && <ConsentBanner />}
    </>
  );
}
