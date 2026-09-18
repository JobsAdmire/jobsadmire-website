import type { Locale } from '@/i18n/routing';

const intl: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

export function formatInt(n: number, locale: Locale): string {
  return new Intl.NumberFormat(intl[locale], { maximumFractionDigits: 0 }).format(n);
}

/** D18: TR `38.944 ₺` (trailing), EN `₺38,944` (leading); whole lira. */
export function formatTRY(amount: number, locale: Locale): string {
  const n = formatInt(Math.round(amount), locale);
  return locale === 'tr' ? `${n} ₺` : `₺${n}`;
}

/** D18: TR `%21,75` (sign leads), EN `21.75%`. */
export function formatPercent(value: number, locale: Locale, decimals = 2): string {
  const n = new Intl.NumberFormat(intl[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return locale === 'tr' ? `%${n}` : `${n}%`;
}
