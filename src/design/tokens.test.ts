import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { tokens } from './tokens';

const { color } = tokens;
// every text/background pair the design uses; AA body text = 4.5, large text = 3.0
const pairs: Array<[string, string, number, string]> = [
  [color.ink, color.white, 4.5, 'ink on white'],
  [color.textSecondary, color.white, 4.5, 'secondary on white'],
  [color.textTertiary, color.white, 4.5, 'tertiary on white'],
  [color.blueSafe, color.white, 4.5, 'eyebrow/blue-safe on white'],
  [color.white, color.navy, 4.5, 'white on navy'],
  [color.sky, color.navy, 4.5, 'sky on navy'],
  [color.successText, color.successSurface, 4.5, 'success text on surface'],
  [color.warningText, color.warningSurface, 4.5, 'warning text on surface'],
  [color.danger, color.dangerSurface, 4.5, 'danger text on surface'],
  // The gate's axe sweep reads button labels as normal text, so every surface that carries
  // one is held to 4.5 — that is why the CTA face is `blueSafe` and the WhatsApp action
  // `successText`, not the raw brand colours (D20).
  [color.white, color.blueSafe, 4.5, 'white on blue-safe (primary CTA face)'],
  [color.white, color.successText, 4.5, 'white on the WhatsApp action green'],
  [color.textSecondary, color.tint, 4.5, 'secondary on the tint strip (language hint)'],
  [color.white, color.blue, 3.0, 'white on raw brand blue — icons and large text only'],
];

describe('design tokens', () => {
  it.each(pairs)('%s on %s ≥ %s (%s)', (fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
  it('desktop type is the authored value × 0.75 with an 11px floor', () => {
    for (const [name, t] of Object.entries(tokens.type)) {
      const expected = Math.max(11, Math.round(t.mobile * 0.75 * 100) / 100);
      expect(t.desktop, name).toBe(expected);
    }
  });
  it('breakpoints are the design breakpoints unscaled', () => {
    expect(tokens.breakpoint).toEqual({ xs: 461, sm: 561, md: 701, lg: 901, xl: 1101 });
  });
});
