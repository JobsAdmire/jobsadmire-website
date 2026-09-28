import { createTranslator, type Messages } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

// `Messages` (next-intl's un-augmented `Record<string, any>`) keeps `createTranslator`'s key
// typing loose, exactly as `useTranslations('sys')` is typed everywhere else in this repo.
const MESSAGES: Record<Locale, Messages> = { tr, en };

/** `sys.blocks.readMinutes` (ICU plural, W54): EN `5 min read`, TR `5 dk okuma`. Both message
 *  files are imported here, so a client island must never import this module — the block that
 *  needs it (`PostCard`) is a server component and imports it by path (W156), never through the
 *  `@/lib/format/date` barrel. */
export function formatReadMinutes(n: number, locale: Locale): string {
  const t = createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys.blocks' });
  return t('readMinutes', { n: Math.max(1, Math.round(n)) });
}
