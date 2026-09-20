import { screen, waitFor, within } from '@testing-library/react';
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
