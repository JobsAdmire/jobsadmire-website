import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { CONSENT_DEFAULT_SCRIPT } from './consent';

/** D13 loading order: the Consent Mode v2 defaults run inline, before any tag, then GTM —
 *  and GA4/Ads only ever load *inside* the container, never directly from this codebase.
 *  `beforeInteractive` is legal here because this renders from the root layout.
 *  With no container id yet (Phase A) the defaults still ship, so the first tag that ever
 *  loads — WP2's, or the owner's from the Integrations screen — starts denied. */
export function GtmLoader({ gtmId }: { gtmId: string | null }) {
  return (
    <>
      {/* The lint rule below predates the App Router: `beforeInteractive` is exactly right
          here, and legal, because this renders from the root layout — which is the whole
          point, the defaults must run before any tag. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="consent-default" strategy="beforeInteractive">
        {CONSENT_DEFAULT_SCRIPT}
      </Script>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
    </>
  );
}
