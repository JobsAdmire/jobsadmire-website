import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** Every homepage section is a synchronous server component over the request's bundle: package
 *  ids through `makeTf(bundle, locale)`, `sys.*` through next-intl's `useTranslations('sys')` (the
 *  pattern `src/design/chrome/Header.tsx` uses), so `renderWithIntl` can render each one in a
 *  test. No section awaits anything; the page stays a thin composition. */
export type SectionProps = { locale: Locale; bundle: Bundle };
