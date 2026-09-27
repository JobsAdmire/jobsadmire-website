import { SOURCE_MAP_CODES } from './source-map-codes';

/** Every flag in `public/brand/flags.svg`: the 13 source countries + Türkiye (upper-case, W40). */
export const FLAG_CODES = [...SOURCE_MAP_CODES, 'TR'] as const;
export type FlagCode = (typeof FLAG_CODES)[number];

/** Task 1's rows type `code` as `string`; `Flag` wants a `FlagCode` — this is the bridge. */
export function isFlagCode(code: string): code is FlagCode {
  return (FLAG_CODES as readonly string[]).includes(code);
}
