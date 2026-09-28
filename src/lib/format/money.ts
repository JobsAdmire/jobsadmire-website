import type { Locale } from '@/i18n/routing';

const intl: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

// M16 (Task 9 P2): a fresh Intl.NumberFormat per call measured ≈366µs vs ≈6µs cached — the T3
// slider reformats on every drag frame. This module only ever needs a formatter with equal
// min/max fraction digits, so (locale, digits) is a complete cache key: formatInt's "0 digits"
// and formatPercent's "N digits" (default 2, but the calculator also asks for 0) share the same
// formatter whenever their digit counts happen to match, which is correct — the two are
// otherwise identical Intl.NumberFormat configurations.
const cache = new Map<string, Intl.NumberFormat>();

function formatterFor(locale: Locale, digits: number): Intl.NumberFormat {
  const key = `${locale}:${digits}`;
  let nf = cache.get(key);
  if (!nf) {
    nf = new Intl.NumberFormat(intl[locale], {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    cache.set(key, nf);
  }
  return nf;
}

export function formatInt(n: number, locale: Locale): string {
  return formatterFor(locale, 0).format(n);
}

/** D18: TR `38.944 ₺` (trailing), EN `₺38,944` (leading); whole lira. */
export function formatTRY(amount: number, locale: Locale): string {
  const n = formatInt(Math.round(amount), locale);
  return locale === 'tr' ? `${n} ₺` : `₺${n}`;
}

/** D18: TR `%21,75` (sign leads), EN `21.75%`. */
export function formatPercent(value: number, locale: Locale, decimals = 2): string {
  const n = formatterFor(locale, decimals).format(value);
  return locale === 'tr' ? `%${n}` : `${n}%`;
}
