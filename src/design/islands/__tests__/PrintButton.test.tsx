import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrintButton } from '../PrintButton';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.classList.remove('print-isolating');
});

describe('PrintButton', () => {
  it('isolates the page for printing only while the print dialog is up', async () => {
    // jsdom defines window.print as a "not implemented" stub — the spy replaces it.
    let isolatingAtPrint = false;
    const print = vi.spyOn(window, 'print').mockImplementation(() => {
      // The class must be on <body> at the moment the browser paginates.
      isolatingAtPrint = document.body.classList.contains('print-isolating');
    });
    render(<PrintButton label="Print estimate" />);
    const btn = screen.getByRole('button', { name: 'Print estimate' });
    expect(btn.className).toContain('print-hidden');
    await userEvent.click(btn);
    expect(print).toHaveBeenCalledTimes(1);
    expect(isolatingAtPrint).toBe(true);
    expect(document.body.classList.contains('print-isolating')).toBe(true);
    window.dispatchEvent(new Event('afterprint'));
    expect(document.body.classList.contains('print-isolating')).toBe(false);
  });
});
