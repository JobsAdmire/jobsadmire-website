import type { Locale } from '@/i18n/routing';

const INTL: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };

/** ISO → `Date`, UTC; throws on anything that is not a real date. Duplicated from
 *  `formatDate.ts` on purpose — see the note there (W156). */
function parseIso(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new RangeError(`not an ISO date: ${iso}`);
  return d;
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
