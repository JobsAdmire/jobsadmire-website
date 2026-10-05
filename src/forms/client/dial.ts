import type { FieldOption } from './Field';

/** The regional-indicator flag of an ISO 3166-1 alpha-2 code ("TR" → 🇹🇷). Platforms without
 *  flag glyphs (Windows) show the two letters, which still read as the country. */
export function flagEmoji(code: string): string {
  const upper = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return '';
  return String.fromCodePoint(...[...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** The design's compact dial select options (SHARED 4.5: "🇹🇷 +90" in a 120 px select beside the
 *  phone field): ISO-2 values (W3 — `+1`/`+7` are shared by several countries, so the dial alone
 *  is not a key), "<flag> <dial>" labels, sorted by the locale's collation of the country name so
 *  the list still reads alphabetically. Rows are the `countries` collection's (data, not copy). */
export function dialSelectOptions(
  countries: readonly { code: string; name: string; dial: string }[],
  locale: string,
): FieldOption[] {
  return [...countries]
    .sort((a, b) => a.name.localeCompare(b.name, locale))
    .map((c) => ({ value: c.code, label: `${flagEmoji(c.code)} ${c.dial}`.trim() }));
}
