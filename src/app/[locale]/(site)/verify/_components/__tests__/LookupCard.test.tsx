import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { LookupCard, type LookupLabels } from '../LookupCard';

// The record dialog is the v1.1 chunk behind RECORD_DIALOG_ENABLED; never loaded here.
vi.mock('next/dynamic', () => ({ default: () => () => null }));

const labels: LookupLabels = {
  heading: 'Check the ID before the meeting',
  inputLabel: 'Representative ID, name, city or number',
  hint: 'Type at least 3 characters of the ID, name, city or number.',
  clear: 'Clear',
  callOffice: 'Call the office instead',
  note: 'The ID is printed on the badge every representative carries.',
  resultTitle: 'The public register is not published yet',
  resultBody: '“{query}” cannot be checked online yet. Call the JobsAdmire office.',
  resultCall: 'Call the office',
  resultWhatsapp: 'Ask on WhatsApp',
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

function renderCard(extra: Partial<Parameters<typeof LookupCard>[0]> = {}) {
  return renderWithIntl(
    <LookupCard
      labels={labels}
      phone="+905011240340"
      whatsappNumber="905011240340"
      livePill={null}
      updatedLabel={null}
      recordLabels={null}
      {...extra}
    />,
    { locale: 'en' },
  );
}

const events = (name: string) => (window.dataLayer ?? []).filter((e) => e.event === name);

describe('LookupCard — W6: the neutral answer, never the red verdict', () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => vi.restoreAllMocks());

  it('is a labelled, described input; no answer below three characters', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    expect(input).toHaveAttribute('aria-describedby');
    expect(document.getElementById(input.getAttribute('aria-describedby') ?? '')).toHaveTextContent(
      labels.hint,
    );
    fireEvent.change(input, { target: { value: 'JA' } });
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
    expect(events('verify_lookup')).toHaveLength(0);
  });

  it('answers any ≥ 3-character query neutrally, fires verify_lookup once per query session, clears', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    const result = screen.getByTestId('verify-lookup-result');
    expect(result).toHaveAttribute('data-outcome', 'register_unavailable');
    expect(result).toHaveTextContent(labels.resultTitle);
    expect(result).toHaveTextContent('“JA-REP-014” cannot be checked online yet.');
    expect(result).not.toHaveTextContent(/authorised list|unauthori[sz]ed/i);
    // the title is announced once through the status line, not re-read on every keystroke
    expect(screen.getByRole('status')).toHaveTextContent(labels.resultTitle);
    expect(events('verify_lookup')).toEqual([
      { event: 'verify_lookup', page: '/', locale: 'en', outcome: 'register_unavailable' },
    ]);

    fireEvent.change(input, { target: { value: 'JA-REP-0145' } });
    expect(events('verify_lookup')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: labels.clear }));
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();

    fireEvent.change(input, { target: { value: 'Ali' } });
    expect(events('verify_lookup')).toHaveLength(2);
  });

  it('Escape clears the query', () => {
    renderCard();
    const input = screen.getByLabelText(labels.inputLabel);
    fireEvent.change(input, { target: { value: 'JA-REP-014' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('verify-lookup-result')).toBeNull();
  });

  it('W95: no DOM href carries the query — the WhatsApp prefill is composed on click', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { container } = renderCard();
    fireEvent.change(screen.getByLabelText(labels.inputLabel), {
      target: { value: 'JA-REP-014' },
    });
    for (const a of container.querySelectorAll('a'))
      expect(a.getAttribute('href') ?? '').not.toContain('JA-REP');

    const call = screen.getByRole('link', { name: labels.resultCall });
    expect(call).toHaveAttribute('href', 'tel:+905011240340');
    call.addEventListener('click', (e) => e.preventDefault()); // jsdom cannot navigate to tel:
    fireEvent.click(call);
    expect(events('call_click')).toEqual([
      { event: 'call_click', page: '/', locale: 'en', placement: 'page_cta' },
    ]);

    const wa = screen.getByRole('link', { name: labels.resultWhatsapp });
    expect(wa).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(wa);
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect(url.startsWith('https://wa.me/905011240340?text=')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(
      'Hello JobsAdmire, I want to check something about JA-REP-014',
    );
    expect([target, features]).toEqual(['_blank', 'noopener']);
    expect(events('whatsapp_click')).toEqual([
      { event: 'whatsapp_click', page: '/', locale: 'en', placement: 'page_cta' },
    ]);
  });

  it('V-1: a ?id= deep link prefills the query after hydration and answers at once', () => {
    window.history.replaceState(null, '', '/en/verify?id=JA-REP-001');
    renderCard();
    expect(screen.getByLabelText(labels.inputLabel)).toHaveValue('JA-REP-001');
    expect(screen.getByTestId('verify-lookup-result')).toHaveAttribute(
      'data-outcome',
      'register_unavailable',
    );
    expect(events('verify_lookup')).toHaveLength(1);
  });

  it('D17: the live pill and the updated line render only when the page passes them', () => {
    const { unmount } = renderCard();
    expect(screen.queryByTestId('verify-live-pill')).toBeNull();
    expect(screen.queryByTestId('verify-updated')).toBeNull();
    unmount();
    renderCard({
      livePill: '14 people authorised today',
      updatedLabel: 'Register last updated: 29 July 2026',
    });
    expect(screen.getByTestId('verify-live-pill')).toHaveTextContent('14 people authorised today');
    expect(screen.getByTestId('verify-updated')).toHaveTextContent('29 July 2026');
  });
});
