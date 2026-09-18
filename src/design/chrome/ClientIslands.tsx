'use client';
import dynamic from 'next/dynamic';
import type { Locale } from '@/i18n/routing';

/** The two chrome islands that only ever exist in the browser, behind `ssr: false` so their
 *  code (and the primitives barrel the consent sheet pulls in) leaves the initial script
 *  graph — D27's 120 KB budget. A server layout cannot pass `ssr: false` itself, which is the
 *  only reason this boundary component exists; it adds no behaviour of its own.
 *
 *  `consent` carries R38's gate unchanged: no container id means no tag can fire, so there is
 *  nothing to consent to and the sheet must not appear — and with the flag false the chunk is
 *  never even fetched. */
const ConsentBanner = dynamic(() => import('./ConsentBanner').then((m) => m.ConsentBanner), {
  ssr: false,
});
const LanguageHint = dynamic(() => import('./LanguageHint').then((m) => m.LanguageHint), {
  ssr: false,
});

export function ClientIslands({ consent, locale }: { consent: boolean; locale: Locale }) {
  return (
    <>
      <LanguageHint locale={locale} />
      {consent && <ConsentBanner />}
    </>
  );
}
