import QRCode from 'qrcode';
import { describe, expect, it, vi } from 'vitest';
import { qrSvg } from './qr';

const text = 'https://wa.me/905011240340?text=Hello';

describe('qrSvg', () => {
  it('returns a self-contained, deterministic SVG whose grid matches the encoder', () => {
    const svg = qrSvg(text);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg).toContain('<path ');
    expect(svg).toBe(qrSvg(text));
    const size = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size;
    expect(svg).toContain(`viewBox="0 0 ${size + 8} ${size + 8}"`); // default margin 4
    expect(svg).toContain('shape-rendering="crispEdges"');
  });

  it('is decorative by default and an image when labelled, with the label XML-escaped', () => {
    expect(qrSvg(text)).toContain('aria-hidden="true"');
    const labelled = qrSvg(text, { label: 'Scan to chat on WhatsApp & Telegram "now"', size: 120 });
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain(
      'aria-label="Scan to chat on WhatsApp &amp; Telegram &quot;now&quot;"',
    );
    expect(labelled).toContain('width="120"');
    expect(labelled).not.toContain('aria-hidden');
  });

  it('honours margin and colours', () => {
    const svg = qrSvg(text, { margin: 0, dark: '#0a1428', light: null });
    const size = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size;
    expect(svg).toContain(`viewBox="0 0 ${size} ${size}"`);
    expect(svg).toContain('fill="#0a1428"');
    expect(svg).not.toContain('<rect');
  });

  it('returns an empty string for empty text (the encoder would throw "No input text")', () => {
    expect(qrSvg('')).toBe('');
  });

  it('returns an empty string, and logs outside production, for text too big to encode', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(qrSvg('x'.repeat(3000))).toBe(''); // beyond version 40 at ECC M (≈2.3 KB)
      expect(error).toHaveBeenCalledTimes(1);
    } finally {
      error.mockRestore();
    }
  });
});
