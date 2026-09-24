import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FallbackPanel, whatsappFallbackText } from '../client/FallbackPanel';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

// `usePathname()` from next/navigation is null outside the App Router (R35), so `page` is '/'.
const copy = tr.sys.form.fallback;
const values = {
  name: 'Ali Veli',
  phone: '+90 532 000 00 00',
  email: 'ali@example.com',
  message: 'Need 10 welders',
};
const base = {
  values,
  formKey: 'hire' as const,
  locale: 'tr' as const,
  whatsappNumber: '905011240340',
  contact: {
    phone: '+905011240340',
    phoneDisplay: '+90 501 124 03 40',
    email: 'info@jobsadmire.com',
  },
};

let sendBeacon: ReturnType<typeof vi.fn>;
let open: ReturnType<typeof vi.spyOn<Window, 'open'>>;
beforeEach(() => {
  open = vi.spyOn(window, 'open').mockImplementation(() => null);
  sendBeacon = vi.fn(() => true);
  Object.defineProperty(navigator, 'sendBeacon', {
    value: sendBeacon,
    configurable: true,
    writable: true,
  });
  window.dataLayer = [];
});
afterEach(() => {
  Reflect.deleteProperty(navigator, 'sendBeacon');
  vi.restoreAllMocks();
});

describe('FallbackPanel', () => {
  it('is an alert with the per-kind copy, WhatsApp primary for tripped, and the tel/mail escape hatches', () => {
    renderWithIntl(<FallbackPanel {...base} result={{ kind: 'tripped' }} />);
    const panel = screen.getByRole('alert');
    expect(within(panel).getByRole('heading', { name: copy.tripped.title })).toBeInTheDocument();
    expect(panel).toHaveTextContent(copy.tripped.body);
    const wa = within(panel).getByRole('link', { name: copy.whatsapp });
    // W76: nothing the visitor typed ever sits in a DOM href (GA4 outbound clicks, GTM Click URL).
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    expect(wa.className).toContain('bg-blue-safe'); // primary face
    expect(within(panel).getByRole('link', { name: copy.call })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(within(panel).getByRole('link', { name: copy.email })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
  });

  it('demotes WhatsApp to secondary for captcha/failed/invalid and shows the visitor-safe door error', () => {
    renderWithIntl(
      <FallbackPanel {...base} result={{ kind: 'failed', error: 'Bu ilan kapatıldı.' }} />,
    );
    const panel = screen.getByRole('alert');
    expect(within(panel).getByRole('heading', { name: copy.failed.title })).toBeInTheDocument();
    expect(panel).toHaveTextContent('Bu ilan kapatıldı.');
    expect(within(panel).getByRole('link', { name: copy.whatsapp }).className).not.toContain(
      'bg-blue-safe',
    );
  });

  it.each(['captcha', 'off', 'unauthorized', 'unavailable', 'invalid'] as const)(
    'renders the %s copy',
    (kind) => {
      const result =
        kind === 'unavailable'
          ? ({ kind, cause: 'network' } as const)
          : kind === 'invalid'
            ? ({ kind, message: 'x' } as const)
            : ({ kind } as const);
      renderWithIntl(<FallbackPanel {...base} result={result} />);
      expect(screen.getByRole('heading', { name: copy[kind].title })).toBeInTheDocument();
    },
  );

  it('sends one beacon on mount with the form key, kind and page — never the values', () => {
    const { rerender } = renderWithIntl(
      <FallbackPanel {...base} result={{ kind: 'unavailable', cause: 'timeout' }} />,
    );
    rerender(<FallbackPanel {...base} result={{ kind: 'unavailable', cause: 'timeout' }} />);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [url, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(url).toBe('/api/form-beacon');
    expect(JSON.parse(body)).toEqual({ formKey: 'hire', kind: 'unavailable', page: '/' });
    expect(body).not.toContain('Ali');
  });

  it('tracks whatsapp_click with placement form_fallback on click (W12), nothing typed', async () => {
    renderWithIntl(<FallbackPanel {...base} result={{ kind: 'off' }} />);
    const wa = screen.getByRole('link', { name: copy.whatsapp });
    wa.addEventListener('click', (e) => e.preventDefault()); // jsdom has no navigation
    await userEvent.click(wa);
    expect(window.dataLayer).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'form_fallback' },
    ]);
  });

  it('W76: composes the prefilled wa.me URL only at click time and opens it with noopener', async () => {
    renderWithIntl(<FallbackPanel {...base} result={{ kind: 'tripped' }} />);
    const wa = screen.getByRole('link', { name: copy.whatsapp });
    expect(wa.getAttribute('href')).not.toContain('text=');
    expect(document.body.innerHTML).not.toContain(encodeURIComponent('Ali Veli'));
    const clicked = new MouseEvent('click', { bubbles: true, cancelable: true });
    wa.dispatchEvent(clicked);
    expect(clicked.defaultPrevented).toBe(true); // the bare href never navigates on a click
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect(url).toMatch(/^https:\/\/wa\.me\/905011240340\?text=/);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain(tr.sys.form.fallback.whatsappIntro);
    expect(text).toContain(`${tr.sys.form.labels.name}: Ali Veli`);
    expect(text).toContain(`${tr.sys.form.labels.message}: Need 10 welders`);
    expect(target).toBe('_blank');
    expect(features).toBe('noopener');
    expect(window.dataLayer).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'tr', placement: 'form_fallback' },
    ]);
  });

  it('renders without the escape hatches when no contact is given', () => {
    renderWithIntl(<FallbackPanel {...base} contact={undefined} result={{ kind: 'off' }} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});

describe('whatsappFallbackText', () => {
  it('lists the known fields in a fixed order under the intro, skipping blanks', () => {
    const text = whatsappFallbackText(
      'Intro:',
      { message: 'Hi', name: 'Ali', phone: '', company: 'ACME', consent: 'on' },
      (k) => k.toUpperCase(),
    );
    expect(text).toBe('Intro:\nNAME: Ali\nCOMPANY: ACME\nMESSAGE: Hi');
  });
});
