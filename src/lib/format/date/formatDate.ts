import type { Locale } from '@/i18n/routing';

const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };

/** ISO → `Date`, UTC; throws on anything that is not a real date. Kept local to this file (and
 *  duplicated in `formatMonth.ts`) rather than shared, so neither pure formatter pulls the other
 *  in — each is a standalone by-path import (W156). */
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
