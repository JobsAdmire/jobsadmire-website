import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    // sys.* UI copy only — page content comes from the bundle (src/content/adapter.ts)
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
