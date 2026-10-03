import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NewsletterActionState, NewsletterForwardResult } from '@/lib/newsletter/types';
import { renderWithIntl } from '@/test/render';
import { NewsletterAction, type NewsletterActionFn } from '../NewsletterAction';

const TOKEN = 'confirm-token-0123456789abcdef';
const copy = (name: string) => ({ title: `${name} title`, body: `${name} body` });
const props = {
  token: TOKEN,
  labels: { button: 'Confirm subscription', pending: 'Confirming…' },
  outcomes: {
    noToken: copy('noToken'),
    invalid: copy('invalid'),
    expired: copy('expired'),
    unavailable: copy('unavailable'),
    CONFIRMED: copy('CONFIRMED'),
    ALREADY_CONFIRMED: copy('ALREADY_CONFIRMED'),
    UNSUBSCRIBED: copy('UNSUBSCRIBED'),
    ALREADY_UNSUBSCRIBED: copy('ALREADY_UNSUBSCRIBED'),
    UNKNOWN: copy('UNKNOWN'),
  },
  fallbackCopy: {
    lead: 'Contact JobsAdmire',
    email: 'E-mail JobsAdmire',
    whatsapp: 'Message on WhatsApp',
  },
  links: {
    emailHref: 'mailto:info@jobsadmire.com?subject=Newsletter%20subscription',
    whatsappHref: 'https://wa.me/905011240340?text=Hello%20JobsAdmire%2C%20',
  },
};
const done = (result: NewsletterForwardResult): NewsletterActionState => ({
  status: 'done',
  result,
});

afterEach(() => vi.restoreAllMocks());

describe('NewsletterAction (T13, I12)', () => {
  it('forwards nothing until the click, then shows the outcome and moves focus to it', async () => {
    const action = vi.fn<NewsletterActionFn>(async () =>
      done({ kind: 'ok', outcome: 'CONFIRMED' }),
    );
    renderWithIntl(<NewsletterAction kind="confirm" action={action} {...props} />, {
      locale: 'en',
    });
    expect(action).not.toHaveBeenCalled();
    expect(screen.getByTestId('newsletter-action')).toHaveAttribute('data-ready', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    const outcome = await screen.findByTestId('newsletter-outcome');
    expect(outcome).toHaveAttribute('data-outcome', 'CONFIRMED');
    expect(outcome).toHaveTextContent('CONFIRMED title');
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][1]).toBe(TOKEN);
    await waitFor(() => expect(screen.getByTestId('newsletter-answer')).toHaveFocus());
    expect(screen.queryByRole('button', { name: 'Confirm subscription' })).toBeNull();
  });

  it('a refused link shows the manual fallback — static hrefs, never the token (W76)', async () => {
    const action = vi.fn<NewsletterActionFn>(async () => done({ kind: 'invalid' }));
    const { container } = renderWithIntl(
      <NewsletterAction kind="confirm" action={action} {...props} />,
      { locale: 'en' },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute(
      'data-outcome',
      'invalid',
    );
    expect(screen.getByRole('link', { name: 'E-mail JobsAdmire' })).toHaveAttribute(
      'href',
      props.links.emailHref,
    );
    expect(screen.getByRole('link', { name: 'Message on WhatsApp' })).toHaveAttribute(
      'href',
      props.links.whatsappHref,
    );
    expect(container.innerHTML).not.toContain(TOKEN);
  });

  it('a rejected server action becomes the unavailable fallback, never the error boundary', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const action = vi.fn<NewsletterActionFn>(async () => {
      throw new Error('fetch failed');
    });
    renderWithIntl(<NewsletterAction kind="unsubscribe" action={action} {...props} />, {
      locale: 'en',
    });
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute(
      'data-outcome',
      'unavailable',
    );
  });

  it('unsubscribe: UNKNOWN keeps the fallback beside the outcome; a stray 410 reads as invalid', async () => {
    const unknown = vi.fn<NewsletterActionFn>(async () => done({ kind: 'ok', outcome: 'UNKNOWN' }));
    const first = renderWithIntl(
      <NewsletterAction kind="unsubscribe" action={unknown} {...props} />,
      { locale: 'en' },
    );
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute(
      'data-outcome',
      'UNKNOWN',
    );
    first.unmount();
    const expired = vi.fn<NewsletterActionFn>(async () => done({ kind: 'expired' }));
    renderWithIntl(<NewsletterAction kind="unsubscribe" action={expired} {...props} />, {
      locale: 'en',
    });
    await userEvent.click(screen.getByRole('button', { name: 'Confirm subscription' }));
    expect(await screen.findByTestId('newsletter-fallback')).toHaveAttribute(
      'data-outcome',
      'invalid',
    );
  });
});
