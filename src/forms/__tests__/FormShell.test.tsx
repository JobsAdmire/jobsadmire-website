import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../client/Field';
import { FormShell } from '../client/FormShell';
import type { FormActionState } from '../types';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

const copy = tr.sys.form;
const base = {
  formKey: 'hire' as const,
  locale: 'tr' as const,
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  contact: { phone: '+905011240340', email: 'info@jobsadmire.com' },
  testId: 'hire-form',
};
const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const SITE_KEY = '1x00000000000000000000AA';
const tokenInput = () =>
  document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')!;
/** A stand-in for Cloudflare's API: the widget answers with `tok_1` as soon as it renders. */
const turnstileApi = () => ({
  render: vi.fn((_el: HTMLElement, opts: Record<string, unknown>) => {
    (opts.callback as (t: string) => void)('tok_1');
    return 'w1';
  }),
  reset: vi.fn(),
  remove: vi.fn(),
});

beforeEach(() => {
  Object.defineProperty(navigator, 'sendBeacon', {
    value: vi.fn(() => true),
    configurable: true,
    writable: true,
  });
  window.dataLayer = [];
});
afterEach(() => {
  Reflect.deleteProperty(navigator, 'sendBeacon');
  delete window.turnstile;
});

describe('FormShell', () => {
  it('renders the fields, the hidden honeypot, the consent checkbox with the privacy link and the submit button', () => {
    renderWithIntl(
      <FormShell {...base} action={idle}>
        <Field name="name" required autoComplete="name" />
        <Field name="email" type="email" required />
        <Field name="message" as="textarea" />
      </FormShell>,
    );
    const form = screen.getByTestId('hire-form');
    expect(form).toHaveAttribute('novalidate');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    expect(within(form).getByLabelText(`${copy.labels.name} *`)).toHaveAttribute(
      'autocomplete',
      'name',
    );
    expect(within(form).getByLabelText(`${copy.labels.email} *`)).toHaveAttribute('type', 'email');
    expect(within(form).getByLabelText(copy.labels.message).tagName).toBe('TEXTAREA');
    const honeypot = form.querySelector<HTMLInputElement>('input[name="honeypot"]')!;
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot).toHaveAttribute('autocomplete', 'off');
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
    const consent = within(form).getByRole('checkbox');
    expect(consent).toHaveAttribute('name', 'consent');
    expect(consent).toBeRequired();
    expect(within(form).getByRole('link', { name: 'aydınlatma metni' })).toHaveAttribute(
      'href',
      '/gizlilik',
    );
    expect(within(form).getByRole('button', { name: copy.submit.default })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(form.querySelector('input[name="cf-turnstile-response"]')).toBeNull();
  });

  it('renders the Turnstile slot and hidden token input when a site key is configured', () => {
    renderWithIntl(
      <FormShell {...base} turnstileSiteKey="1x00000000000000000000AA" action={idle}>
        <Field name="name" />
      </FormShell>,
    );
    const form = screen.getByTestId('hire-form');
    expect(form.querySelector('input[name="cf-turnstile-response"]')).not.toBeNull();
    expect(within(form).getByTestId('turnstile')).toBeInTheDocument();
  });

  it('shows field errors from the action state next to the fields, echoes the typed values and keeps the consent tick', () => {
    const state: FormActionState = {
      status: 'fieldErrors',
      errors: { name: 'required', email: 'email' },
      values: { name: '', email: 'nope', consent: 'on' },
    };
    renderWithIntl(
      <FormShell {...base} action={idle} initialState={state}>
        <Field name="name" required />
        <Field name="email" type="email" required />
      </FormShell>,
    );
    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toEqual([copy.errors.required, copy.errors.email]);
    expect(screen.getByLabelText(`${copy.labels.email} *`)).toHaveValue('nope');
    expect(screen.getByLabelText(`${copy.labels.email} *`)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders the consent error under the checkbox', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        initialState={{ status: 'fieldErrors', errors: { consent: 'consent' }, values: {} }}
      >
        <Field name="name" />
      </FormShell>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(copy.errors.consent);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders a _form error (object-level refine, strict extra key) as a form-level alert', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        initialState={{ status: 'fieldErrors', errors: { _form: 'invalid' }, values: {} }}
      >
        <Field name="name" />
      </FormShell>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(copy.errors.form);
    expect(alert).toHaveTextContent(copy.errors.invalid);
  });

  it('lists errors on names no Field renders in the form-level alert; rendered fields keep theirs', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        initialState={{
          status: 'fieldErrors',
          errors: { name: 'required', openingSlug: 'required' },
          values: {},
        }}
      >
        <Field name="name" required />
        <input type="hidden" name="openingSlug" value="" />
      </FormShell>,
    );
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent(copy.errors.required); // under the name field
    expect(alerts[0]).not.toHaveTextContent(copy.errors.form);
    const formAlert = alerts[1];
    expect(formAlert).toHaveTextContent(copy.errors.form);
    expect(formAlert).toHaveTextContent(`${copy.labels.openingSlug}: ${copy.errors.required}`);
    expect(within(formAlert).getAllByRole('listitem')).toHaveLength(1);
  });

  it('shows no form-level alert when every errored name has its Field', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        initialState={{
          status: 'fieldErrors',
          errors: { name: 'required', consent: 'consent' },
          values: {},
        }}
      >
        <Field name="name" required />
      </FormShell>,
    );
    expect(screen.getAllByRole('alert').map((a) => a.textContent)).toEqual([
      copy.errors.required,
      copy.errors.consent,
    ]);
  });

  it('renders the fallback panel for an error state, with the echoed values in the WhatsApp link', () => {
    const state: FormActionState = {
      status: 'error',
      result: { kind: 'tripped' },
      values: { name: 'Ali Veli', email: 'ali@example.com' },
    };
    renderWithIntl(
      <FormShell {...base} action={idle} initialState={state}>
        <Field name="name" />
      </FormShell>,
    );
    const panel = screen.getByRole('alert');
    expect(
      within(panel).getByRole('heading', { name: copy.fallback.tripped.title }),
    ).toBeInTheDocument();
    expect(
      decodeURIComponent(
        within(panel).getByRole('link', { name: copy.fallback.whatsapp }).getAttribute('href')!,
      ),
    ).toContain('Ali Veli');
    expect(screen.getByLabelText(copy.labels.name)).toHaveValue('Ali Veli');
    expect(document.body).toHaveFocus(); // a starting state never steals focus
  });

  it('submits through the action and renders its answer (an error state here)', async () => {
    const action = vi.fn(
      async (_prev: FormActionState, data: FormData): Promise<FormActionState> => ({
        status: 'error',
        result: { kind: 'unavailable', cause: 'network' },
        values: { name: String(data.get('name')) },
      }),
    );
    renderWithIntl(
      <FormShell {...base} action={action}>
        <Field name="name" />
      </FormShell>,
    );
    await userEvent.type(screen.getByLabelText(copy.labels.name), 'Ayşe');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(action).toHaveBeenCalledTimes(1);
    const data = action.mock.calls[0][1];
    expect(data.get('name')).toBe('Ayşe');
    expect(data.get('consent')).toBe('on');
    expect(data.get('honeypot')).toBe('');
    expect(
      screen.getByRole('heading', { name: copy.fallback.unavailable.title }),
    ).toBeInTheDocument();
  });

  it('keeps the Turnstile token across a shell re-render (a fieldErrors answer re-renders every child)', () => {
    window.turnstile = turnstileApi();
    const { rerender } = renderWithIntl(
      <FormShell {...base} turnstileSiteKey={SITE_KEY} action={idle}>
        <Field name="name" />
      </FormShell>,
    );
    expect(tokenInput()).toHaveValue('tok_1');
    rerender(
      <FormShell
        {...base}
        turnstileSiteKey={SITE_KEY}
        action={idle}
        initialState={{ status: 'fieldErrors', errors: { name: 'required' }, values: {} }}
      >
        <Field name="name" />
      </FormShell>,
    );
    expect(tokenInput()).toHaveValue('tok_1');
  });

  it('resets the Turnstile widget once per action result, and the token survives a real submit', async () => {
    const api = turnstileApi();
    window.turnstile = api;
    const action = vi.fn<(prev: FormActionState, data: FormData) => Promise<FormActionState>>(
      async () => ({ status: 'fieldErrors', errors: { name: 'required' }, values: { name: '' } }),
    );
    renderWithIntl(
      <FormShell {...base} turnstileSiteKey={SITE_KEY} action={action}>
        <Field name="name" />
      </FormShell>,
    );
    expect(api.reset).not.toHaveBeenCalled();
    const submit = screen.getByRole('button', { name: copy.submit.default });
    await userEvent.click(submit);
    await waitFor(() => expect(api.reset).toHaveBeenCalledTimes(1));
    expect(api.reset).toHaveBeenCalledWith('w1');
    expect(action.mock.calls[0][1].get('cf-turnstile-response')).toBe('tok_1');
    expect(tokenInput()).toHaveValue('tok_1');
    await userEvent.click(submit);
    await waitFor(() => expect(api.reset).toHaveBeenCalledTimes(2));
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('a rejected action (the browser→Vercel call failed) renders the unavailable panel with the typed values, not the error boundary', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const action = vi.fn(async (): Promise<FormActionState> => {
      throw new TypeError('Failed to fetch');
    });
    renderWithIntl(
      <FormShell {...base} action={action}>
        <Field name="name" />
        <Field name="email" type="email" />
      </FormShell>,
    );
    await userEvent.type(screen.getByLabelText(copy.labels.name), 'Ayşe');
    await userEvent.type(screen.getByLabelText(copy.labels.email), 'ayse@example.com');
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    const panel = await screen.findByTestId('form-fallback');
    expect(panel).toHaveAttribute('data-kind', 'unavailable');
    expect(
      within(panel).getByRole('heading', { name: copy.fallback.unavailable.title }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(copy.labels.name)).toHaveValue('Ayşe');
    expect(screen.getByLabelText(copy.labels.email)).toHaveValue('ayse@example.com');
    expect(logged).toHaveBeenCalledTimes(1);
    logged.mockRestore();
  });

  it('derives every id from idScope ?? formKey, so two forms of one key on a page never share an id', async () => {
    renderWithIntl(
      <>
        <FormShell
          {...base}
          testId="a"
          idScope="contact-top"
          turnstileSiteKey={SITE_KEY}
          action={idle}
        >
          <Field name="name" />
        </FormShell>
        <FormShell
          {...base}
          testId="b"
          idScope="contact-bottom"
          turnstileSiteKey={SITE_KEY}
          action={idle}
        >
          <Field name="name" />
        </FormShell>
      </>,
    );
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    const a = screen.getByTestId('a');
    const b = screen.getByTestId('b');
    expect(within(b).getByLabelText(copy.labels.name)).toHaveAttribute(
      'id',
      'f-contact-bottom-name',
    );
    expect(within(b).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-bottom-consent');
    expect(b.querySelector('input[name="honeypot"]')).toHaveAttribute(
      'id',
      'f-contact-bottom-honeypot',
    );
    expect(within(b).getByTestId('turnstile')).toHaveAttribute('id', 'f-contact-bottom-turnstile');
    // A label click toggles its own form's checkbox, not the first one on the page.
    await userEvent.click(within(b).getByRole('checkbox').closest('label')!);
    expect(within(b).getByRole('checkbox')).toBeChecked();
    expect(within(a).getByRole('checkbox')).not.toBeChecked();
  });

  it('scopes ids by formKey when no idScope is given', () => {
    renderWithIntl(
      <FormShell {...base} action={idle}>
        <Field name="name" />
      </FormShell>,
    );
    expect(screen.getByLabelText(copy.labels.name)).toHaveAttribute('id', 'f-hire-name');
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'f-hire-consent');
  });

  it('keeps the submit button focusable while pending (aria-disabled + aria-busy, never disabled) and ignores a second submit', async () => {
    let release: (s: FormActionState) => void = () => {};
    const action = vi.fn(
      () =>
        new Promise<FormActionState>((resolve) => {
          release = resolve;
        }),
    );
    renderWithIntl(
      <FormShell {...base} consent="notice" action={action}>
        <Field name="name" />
      </FormShell>,
    );
    const form = screen.getByTestId('hire-form');
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    await waitFor(() => expect(form).toHaveAttribute('aria-busy', 'true'));
    const pending = screen.getByRole('button', { name: copy.submit.sending });
    expect(pending).not.toBeDisabled();
    expect(pending).toHaveAttribute('aria-disabled', 'true');
    expect(pending).toHaveFocus();
    await userEvent.click(pending);
    await act(async () => release({ status: 'idle' }));
    await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: copy.submit.default })).not.toHaveAttribute(
      'aria-disabled',
    );
  });

  it('moves focus to the first invalid control after a fieldErrors answer', async () => {
    const action = vi.fn(async (): Promise<FormActionState> => ({
      status: 'fieldErrors',
      errors: { email: 'email', consent: 'consent' },
      values: { name: 'Ayşe', email: 'nope' },
    }));
    renderWithIntl(
      <FormShell {...base} action={action}>
        <Field name="name" />
        <Field name="email" type="email" />
      </FormShell>,
    );
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    await waitFor(() => expect(screen.getByLabelText(copy.labels.email)).toHaveFocus());
  });

  it('moves focus to the form-level alert when no rendered control is invalid', async () => {
    const action = vi.fn(async (): Promise<FormActionState> => ({
      status: 'fieldErrors',
      errors: { _form: 'invalid' },
      values: {},
    }));
    renderWithIntl(
      <FormShell {...base} consent="notice" action={action}>
        <Field name="name" />
      </FormShell>,
    );
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus());
  });

  it('moves focus to the fallback panel after an error answer — and never on mount', async () => {
    const action = vi.fn(async (): Promise<FormActionState> => ({
      status: 'error',
      result: { kind: 'tripped' },
      values: {},
    }));
    renderWithIntl(
      <FormShell {...base} consent="notice" action={action}>
        <Field name="name" />
      </FormShell>,
    );
    expect(document.body).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: copy.submit.default }));
    await waitFor(() => expect(screen.getByTestId('form-fallback')).toHaveFocus());
  });

  it('notice mode renders the KVKK line instead of a checkbox, and the title/submitLabel props', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        consent="notice"
        title="Hızlı teklif"
        submitLabel="Teklif al"
      >
        <Field name="name" />
      </FormShell>,
    );
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.getByTestId('hire-form')).toHaveTextContent('aydınlatma metni');
    expect(screen.getByRole('heading', { name: 'Hızlı teklif' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Teklif al' })).toBeInTheDocument();
  });
});
