import QRCode from 'qrcode';

export type QrOptions = {
  /** Rendered width/height in CSS px (the SVG scales; the design uses 82-86 px). */
  size?: number;
  /** Quiet zone in modules (the QR spec's minimum is 4). */
  margin?: number;
  dark?: string;
  /** `null` = transparent background. */
  light?: string | null;
  /** When given the SVG is `role="img"` named by it; otherwise it is decorative. */
  label?: string;
};

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Server-side QR → SVG string (ECC level M, byte mode — what the package's qr.js produced).
 * Pure so it is unit-testable; render it from a server component only (`QrCode.tsx` is the
 * door), never from a client island — the encoder would join the page's JS budget (W13).
 * Returns `''` (render nothing) for empty text and for text the encoder refuses — beyond
 * version 40 at ECC M, about 2.3 KB — logging the latter outside production: a bad QR input
 * must not take the server render of the whole page down.
 */
export function qrSvg(text: string, options: QrOptions = {}): string {
  if (!text) return '';
  const { size = 86, margin = 4, dark = '#0a1428', light = '#ffffff', label } = options;
  let qr: ReturnType<typeof QRCode.create>;
  try {
    qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`qrSvg: cannot encode ${text.length} characters as a QR code`, error);
    }
    return '';
  }
  const { modules } = qr;
  const n = modules.size;
  const total = n + margin * 2;

  // One path of horizontal runs: `M x y h len v1 h -len z` per run, which is both smaller than
  // one rect per module and immune to hairline gaps between adjacent rects.
  const runs: string[] = [];
  for (let row = 0; row < n; row++) {
    let col = 0;
    while (col < n) {
      if (!modules.get(row, col)) {
        col++;
        continue;
      }
      let len = 1;
      while (col + len < n && modules.get(row, col + len)) len++;
      runs.push(`M${col + margin} ${row + margin}h${len}v1h-${len}z`);
      col += len;
    }
  }

  const a11y = label
    ? `role="img" aria-label="${escapeAttr(label)}"`
    : 'aria-hidden="true" focusable="false"';
  const bg = light ? `<rect width="${total}" height="${total}" fill="${light}"/>` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}" shape-rendering="crispEdges" ${a11y}>` +
    bg +
    `<path fill="${dark}" d="${runs.join('')}"/>` +
    `</svg>`
  );
}
