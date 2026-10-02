import type { FieldOption } from '@/forms/client/Field';
import type { Locale } from '@/i18n/routing';

type CountryRow = { code: string; name: string };

/** The ISO-2 `<select>` options (W3/W25): the source countries first, in the collection's
 *  order (the partners this page courts), then every other row of the general list sorted by
 *  its locale name with that locale's collation (Turkish: C < Ç, I < İ). Values are the
 *  upper-case codes the door validates; labels are the collection's locale-resolved names —
 *  data, not copy. A type-only import from the client `Field` module: nothing reaches the
 *  client from here. */
export function countryOptions(
  source: readonly CountryRow[],
  general: readonly CountryRow[],
  locale: Locale,
): FieldOption[] {
  const seen = new Set<string>();
  const take = (rows: readonly CountryRow[]): FieldOption[] => {
    const out: FieldOption[] = [];
    for (const row of rows) {
      if (seen.has(row.code)) continue; // a source country in the general list appears once
      seen.add(row.code);
      out.push({ value: row.code, label: row.name });
    }
    return out;
  };
  const head = take(source);
  const collator = new Intl.Collator(locale);
  const tail = take(general).sort((a, b) => collator.compare(a.label, b.label));
  return [...head, ...tail];
}
