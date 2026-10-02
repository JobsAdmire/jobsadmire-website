import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryStorage } from '@/test/storage';
import { ConversionPing } from './ConversionPing';

// R35: the `page` param is the real URL, so the component reads next/navigation's pathname.
vi.mock('next/navigation', () => ({ usePathname: () => '/tesekkurler' }));

type Entry = Record<string, unknown>;
const layer = () => (window as unknown as { dataLayer: Entry[] }).dataLayer;
const events = (name: string) => layer().filter((e) => e.event === name);

describe('ConversionPing (D13 lead events on the thank-you page)', () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: Entry[] }).dataLayer = [];
    // Node ≥23 ships a stub `sessionStorage` without the Storage API (src/test/storage.ts).
    Object.defineProperty(window, 'sessionStorage', { value: memoryStorage(), configurable: true });
  });

  it('pushes exactly one generate_lead and one conversion, generate_lead first, same params', () => {
    render(<ConversionPing formKey="hire" locale="tr" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
    const expected = { form_key: 'hire', page: '/tesekkurler', locale: 'tr' };
    expect(events('generate_lead')[0]).toEqual({ event: 'generate_lead', ...expected });
    expect(events('conversion')[0]).toEqual({ event: 'conversion', ...expected });
    // GA4's key event before the Ads trigger — the GTM container's conversion tag fires on
    // `conversion`, and both must exist by the time it does.
    const names = layer().map((e) => e.event);
    expect(names.indexOf('generate_lead')).toBeLessThan(names.indexOf('conversion'));
  });

  it('dedupes both events per session per form+path (R37) — a remount fires neither again', () => {
    const first = render(<ConversionPing formKey="contact" locale="en" />);
    first.unmount();
    render(<ConversionPing formKey="contact" locale="en" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
    expect(window.sessionStorage.getItem('ja_conv:contact:/tesekkurler')).toBe('1');
  });

  it('a different form key in the same session still counts', () => {
    render(<ConversionPing formKey="hire" locale="tr" />);
    render(<ConversionPing formKey="workers" locale="tr" />);
    expect(events('generate_lead').map((e) => e.form_key)).toEqual(['hire', 'workers']);
    expect(events('conversion').map((e) => e.form_key)).toEqual(['hire', 'workers']);
  });

  it('fires (rather than loses the lead) when storage throws', () => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    render(<ConversionPing formKey="calculator" locale="en" />);
    expect(events('generate_lead')).toHaveLength(1);
    expect(events('conversion')).toHaveLength(1);
  });
});
