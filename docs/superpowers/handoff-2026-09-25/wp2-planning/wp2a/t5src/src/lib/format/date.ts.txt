import { createTranslator, type Messages } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** `en-GB`, not `en-US`: the design's bylines read "12 January 2026" (day first, no comma). */
const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };
// `Messages` (next-intl's un-augmented `Record<string, any>`) keeps `createTranslator`'s key
// typing loose, exactly as `useTranslations('sys')` is typed everywhere else in this repo.
const MESSAGES: Record<Locale, Messages> = { tr, en };

function parseIso(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new RangeError(`not an ISO date: ${iso}`);
  return d;
}

/** TR `12 Ocak 2026`, EN `12 January 2026`. Dates are calendar dates: formatted in UTC so a
 *  date-only ISO string (`2026-01-12`) never slips a day in a western-hemisphere runtime. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseIso(iso));
}

/** TR `Ocak 2026`, EN `January 2026` — for "Updated January 2026"-style dated labels (D17:
 *  rendered from `RateConfig.effectiveFrom`/`publishedAt`, never typed into copy). */
export function formatMonth(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseIso(iso));
}

/** `sys.blocks.readMinutes` (ICU plural, W54): EN `5 min read`, TR `5 dk okuma`. Both message
 *  files are imported here, so a client island must never import this module — the block that
 *  needs it (`PostCard`) is a server component, and tests run it directly. */
export function formatReadMinutes(n: number, locale: Locale): string {
  const t = createTranslator({ locale, messages: MESSAGES[locale], namespace: 'sys.blocks' });
  return t('readMinutes', { n: Math.max(1, Math.round(n)) });
}
