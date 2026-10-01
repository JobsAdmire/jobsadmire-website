import type { AbstractIntlMessages } from 'next-intl';

/** W148 (inverts W90's denylist): the `sys.*` namespaces a `'use client'` module reads — the only
 *  ones `NextIntlClientProvider` receives. Built from a scan of the client modules and kept
 *  minimal: the consent sheet, the language hint, the error boundary's title/retry, the forms
 *  kernel, and the Cost Calculator's islands and quote sheet (`calc`, WP2b T3 — the live ICU
 *  templates need the client translator). Everything else — `thankYou`, `notFoundTitle`/`notFoundBody`, `skipToContent`, `nav`,
 *  `whatsapp`, `blocks`, `marquee` (the server `LogoMarquee` passes its labels as props),
 *  `seo`, `legal` — is read by server components only and stays out of every page's RSC
 *  payload. A client component that needs a namespace lists it here; `client-messages.test.ts`
 *  scans every client module's `sys(…)` keys and fails on an unlisted prefix. */
export const CLIENT_SYS = [
  'consent',
  'languageHint',
  'errorTitle',
  'errorRetry',
  'form',
  'calc',
] as const;

/** W90: the `sys.*` namespaces that must never reach the browser — `sys.legal.*` (the legal
 *  pages' long-form copy) and `sys.seo.*` (the SEO title/description fallbacks), read only by
 *  server components and `generateMetadata`. Since W148 the allowlist above is what decides;
 *  the test pins that these two never join it. */
export const SERVER_ONLY_SYS = ['legal', 'seo'] as const;

/** What the locale layout hands `NextIntlClientProvider`: the `CLIENT_SYS` namespaces of
 *  `sys.*` and nothing else (W148). Server components keep reading the full catalogue through
 *  `getTranslations('sys')`. */
export function pickClientMessages(messages: AbstractIntlMessages): { sys: AbstractIntlMessages } {
  const sys = typeof messages.sys === 'object' ? messages.sys : {};
  return {
    sys: Object.fromEntries(
      Object.entries(sys).filter(([ns]) => (CLIENT_SYS as readonly string[]).includes(ns)),
    ),
  };
}
