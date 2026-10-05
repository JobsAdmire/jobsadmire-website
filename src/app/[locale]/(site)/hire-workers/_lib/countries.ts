/** The `countries` collection's row shape this page reads (`getCollection(bundle, 'countries')`
 *  — W25: data, not copy; `name` is locale-resolved). Structural, so tests pass plain rows. */
export type CountryRow = { code: string; name: string; dial: string };

export function dialForCode(
  countries: readonly Pick<CountryRow, 'code' | 'dial'>[],
  code: string,
): string | null {
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return null;
  return countries.find((c) => c.code === upper)?.dial ?? null;
}

/** A country's locale-resolved name by ISO-2 code. The SourceMap's `turkiyeLabel` (W60) is the
 *  `TR` row — the same name the request form's dial select shows. A missing row throws outside
 *  production and degrades to the code in production (makeT's own rule). */
export function countryName(
  countries: readonly Pick<CountryRow, 'code' | 'name'>[],
  code: string,
): string {
  const name = countries.find((c) => c.code === code)?.name;
  if (name) return name;
  const message = `countries collection has no row for ${code}`;
  if (process.env.NODE_ENV !== 'production') throw new Error(message);
  console.error(message);
  return code;
}
