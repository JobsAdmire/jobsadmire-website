import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIR = join(process.cwd(), 'src/design/fonts');

describe('src/design/fonts (OG image font bytes)', () => {
  it('ships the static Archivo Bold instance the OG route reads, byte-exact', () => {
    const bytes = readFileSync(join(DIR, 'Archivo-Bold.ttf'));
    // TrueType magic — not an HTML error page saved as .ttf
    expect(bytes.subarray(0, 4)).toEqual(Buffer.from([0x00, 0x01, 0x00, 0x00]));
    expect(bytes.length).toBe(192180);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(
      '951a0ebab63b1bb0d90a26c27625bda803d570dace3851fa2f1eea65852d8983',
    );
  });

  it('ships the licence next to the font', () => {
    const ofl = readFileSync(join(DIR, 'OFL.txt'), 'utf8');
    expect(ofl).toContain('SIL Open Font License, Version 1.1');
    expect(ofl).toContain('Archivo');
    expect(createHash('sha256').update(ofl).digest('hex')).toBe(
      '108b4e57c9c796d3d38d0428ca7ee39de47ad93187302718d9b2d8864b9b716b',
    );
  });
});
