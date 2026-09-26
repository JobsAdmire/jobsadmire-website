import type { AbstractIntlMessages } from 'next-intl';

/** W90: the `sys.*` namespaces that never reach the browser. `sys.legal.*` (the legal pages'
 *  long-form copy) and `sys.seo.*` (the SEO title/description fallbacks) are read only by
 *  server components and `generateMetadata`, so they stay out of every page's RSC payload. */
export const SERVER_ONLY_SYS = ['legal', 'seo'] as const;

/** What the locale layout hands `NextIntlClientProvider` (W90): every `sys.*` namespace except
 *  the server-only ones — excluded by name, so a namespace added later reaches client
 *  components unless it is listed above. Server components keep reading the full catalogue
 *  through `getTranslations('sys')`. */
export function pickClientMessages(messages: AbstractIntlMessages): { sys: AbstractIntlMessages } {
  const sys = typeof messages.sys === 'object' ? messages.sys : {};
  return {
    sys: Object.fromEntries(
      Object.entries(sys).filter(([ns]) => !(SERVER_ONLY_SYS as readonly string[]).includes(ns)),
    ),
  };
}
