/**
 * A byte-level reader of a TrueType/OpenType `cmap` table — enough to ask "does this font carry a
 * glyph for this code point?" without a font library (final pass P2-9, WP2a T4-4 P5). Formats 4
 * (BMP segments) and 12 (full-range groups) are read, which is what the vendored Archivo Bold
 * carries; a font with neither throws rather than answering "no glyphs". Test-only.
 */
export type Cmap = { has(codePoint: number): boolean; missing(text: string): string[] };

const u16 = (v: DataView, o: number) => v.getUint16(o);
const u32 = (v: DataView, o: number) => v.getUint32(o);

type Lookup = (cp: number) => boolean;

function format4(v: DataView, base: number): Lookup {
  const segCount = u16(v, base + 6) / 2;
  const endCodes = base + 14;
  const startCodes = endCodes + segCount * 2 + 2; // past reservedPad
  const idDeltas = startCodes + segCount * 2;
  const idRangeOffsets = idDeltas + segCount * 2;
  return (cp) => {
    if (cp > 0xffff) return false;
    for (let i = 0; i < segCount; i += 1) {
      const end = u16(v, endCodes + i * 2);
      if (cp > end) continue;
      const start = u16(v, startCodes + i * 2);
      if (cp < start || start === 0xffff) return false;
      const delta = u16(v, idDeltas + i * 2);
      const rangeOffsetAddr = idRangeOffsets + i * 2;
      const rangeOffset = u16(v, rangeOffsetAddr);
      if (rangeOffset === 0) return ((cp + delta) & 0xffff) !== 0;
      const glyphAddr = rangeOffsetAddr + rangeOffset + (cp - start) * 2;
      if (glyphAddr + 2 > v.byteLength) return false;
      const glyph = u16(v, glyphAddr);
      return glyph !== 0 && ((glyph + delta) & 0xffff) !== 0;
    }
    return false;
  };
}

function format12(v: DataView, base: number): Lookup {
  const nGroups = u32(v, base + 12);
  const groups = base + 16;
  return (cp) => {
    for (let i = 0; i < nGroups; i += 1) {
      const g = groups + i * 12;
      const start = u32(v, g);
      const end = u32(v, g + 4);
      if (cp >= start && cp <= end) return u32(v, g + 8) + (cp - start) !== 0;
    }
    return false;
  };
}

/** The union of every readable `cmap` subtable in `font` (an sfnt file, not a collection). */
export function readCmap(font: Uint8Array): Cmap {
  const v = new DataView(font.buffer, font.byteOffset, font.byteLength);
  const numTables = u16(v, 4);
  let cmapOffset = -1;
  for (let i = 0; i < numTables; i += 1) {
    const rec = 12 + i * 16;
    const tag = String.fromCharCode(font[rec], font[rec + 1], font[rec + 2], font[rec + 3]);
    if (tag === 'cmap') cmapOffset = u32(v, rec + 8);
  }
  if (cmapOffset < 0) throw new Error('font-cmap: no cmap table');
  const lookups: Lookup[] = [];
  const nSub = u16(v, cmapOffset + 2);
  const seen = new Set<number>();
  for (let i = 0; i < nSub; i += 1) {
    const sub = cmapOffset + u32(v, cmapOffset + 4 + i * 8 + 4);
    if (seen.has(sub)) continue;
    seen.add(sub);
    const format = u16(v, sub);
    if (format === 4) lookups.push(format4(v, sub));
    else if (format === 12) lookups.push(format12(v, sub));
  }
  if (lookups.length === 0) throw new Error('font-cmap: no format 4 or 12 subtable');
  const has = (cp: number) => lookups.some((l) => l(cp));
  return {
    has,
    missing: (text) => [...new Set([...text].filter((ch) => !has(ch.codePointAt(0)!)))],
  };
}
