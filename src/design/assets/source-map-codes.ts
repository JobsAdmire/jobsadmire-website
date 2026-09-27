/** The countries the sourcing map plots: `design-package/design/source-map.js`'s 12 plus
 *  Sri Lanka (ruling W1 — Senegal stays; Ghana/Tunisia are out), as upper-case ISO2 (W40),
 *  in the importer's order. Coordinates are the design's own marker positions (LK at the
 *  island's centre); `atlasId` is the ISO 3166-1 numeric id world-atlas keys its features
 *  by, so the build script never matches on English names. `__tests__/source-map-codes.test.ts`
 *  asserts this list equals T0b's `sourceCountries` collection (codes, order, lon/lat). */
export const SOURCE_MAP_CODES = [
  'PK',
  'NP',
  'IN',
  'UZ',
  'KG',
  'TM',
  'PH',
  'ID',
  'RU',
  'ML',
  'SN',
  'CM',
  'LK',
] as const;
export type SourceMapCode = (typeof SOURCE_MAP_CODES)[number];

export function isSourceMapCode(code: string): code is SourceMapCode {
  return (SOURCE_MAP_CODES as readonly string[]).includes(code);
}

export const SOURCE_MAP_POINTS: Record<
  SourceMapCode,
  { lon: number; lat: number; atlasId: string }
> = {
  PK: { lon: 69.3, lat: 30.4, atlasId: '586' },
  NP: { lon: 84.1, lat: 28.4, atlasId: '524' },
  IN: { lon: 78.9, lat: 22.6, atlasId: '356' },
  UZ: { lon: 64.6, lat: 41.4, atlasId: '860' },
  KG: { lon: 74.8, lat: 41.2, atlasId: '417' },
  TM: { lon: 59.6, lat: 39.0, atlasId: '795' },
  PH: { lon: 121.8, lat: 12.9, atlasId: '608' },
  ID: { lon: 113.9, lat: -1.5, atlasId: '360' },
  RU: { lon: 50.0, lat: 55.5, atlasId: '643' },
  ML: { lon: -4.0, lat: 17.5, atlasId: '466' },
  SN: { lon: -14.5, lat: 14.5, atlasId: '686' },
  CM: { lon: 12.4, lat: 6.0, atlasId: '120' },
  LK: { lon: 80.7, lat: 7.9, atlasId: '144' },
};

export const TURKIYE_POINT = { lon: 35.2, lat: 39.0, atlasId: '792' } as const;

/** `SourceMap`'s `labels` from Task 1's `sourceCountries` rows (`getCollection(bundle,
 *  'sourceCountries')`): one localized name per code. A missing code throws outside
 *  production and falls back to the code itself in production — makeT's own rule. */
export function sourceMapLabels(
  countries: ReadonlyArray<{ code: string; name: string }>,
): Record<SourceMapCode, string> {
  const byCode = new Map(countries.map((c) => [c.code, c.name]));
  const out = {} as Record<SourceMapCode, string>;
  for (const code of SOURCE_MAP_CODES) {
    const name = byCode.get(code);
    if (!name) {
      if (process.env.NODE_ENV !== 'production')
        throw new Error(`sourceMapLabels: no sourceCountries row for ${code}`);
      out[code] = code;
      continue;
    }
    out[code] = name;
  }
  return out;
}
