import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Turnstile, TURNSTILE_SCRIPT } from '../client/Turnstile';
import { CAPTCHA_FIELD } from '../types';

const scriptTags = () => document.querySelectorAll(`script[src="${TURNSTILE_SCRIPT}"]`);
const hidden = () => document.querySelector<HTMLInputElement>(`input[name="${CAPTCHA_FIELD}"]`)!;

afterEach(() => {
  delete window.turnstile;
  scriptTags().forEach((s) => s.remove());
});

// No intl provider: the widget carries no copy of its own.
function Harness({ siteKey = '1x00000000000000000000AA' }: { siteKey?: string }) {
  return (
    <form data-testid="f">
      <label htmlFor="n">Name</label>
      <input id="n" name="name" />
      <Turnstile siteKey={siteKey} locale="tr" />
    </form>
  );
}

describe('Turnstile', () => {
  it('renders the host and an empty hidden token input, and loads NO script until the visitor interacts (W13 amended)', async () => {
    render(<Harness />);
    expect(screen.getByTestId('turnstile')).toBeInTheDocument();
    expect(hidden()).toHaveValue('');
    expect(scriptTags()).toHaveLength(0);
    await userEvent.click(screen.getByLabelText('Name'));
    expect(scriptTags()).toHaveLength(1);
    expect(scriptTags()[0]).toHaveAttribute('async');
    await userEvent.click(screen.getByLabelText('Name'));
    expect(scriptTags()).toHaveLength(1);
  });

  it('renders the widget through the API when it is already on the page and fills the token from its callback', () => {
    const api = {
      render: vi.fn((_el: HTMLElement, opts: Record<string, unknown>) => {
        (opts.callback as (t: string) => void)('tok_abc');
        return 'w1';
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    };
    window.turnstile = api;
    const { unmount } = render(<Harness />);
    expect(api.render).toHaveBeenCalledTimes(1);
    const [el, opts] = api.render.mock.calls[0];
    expect(el).toBe(screen.getByTestId('turnstile'));
    expect(opts).toMatchObject({
      sitekey: '1x00000000000000000000AA',
      appearance: 'interaction-only',
      language: 'tr',
      'response-field': false,
    });
    expect(hidden()).toHaveValue('tok_abc');
    (opts['expired-callback'] as () => void)();
    expect(hidden()).toHaveValue('');
    expect(api.reset).toHaveBeenCalledWith('w1');
    expect(scriptTags()).toHaveLength(0);
    unmount();
    expect(api.remove).toHaveBeenCalledWith('w1');
  });
});
