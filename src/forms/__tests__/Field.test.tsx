import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../client/Field';
import { FormErrorsContext } from '../client/FormErrorsContext';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

const copy = tr.sys.form;

afterEach(() => vi.restoreAllMocks());

describe('Field', () => {
  // SHARED 4.1 (parity pass): the placeholder-only face is the default — the label stays (visually
  // hidden, still the accessible name), its words become the placeholder, and the catalogue hint
  // stays for assistive tech only (sr-only, still in aria-describedby).
  it('placeholder-only by default: hidden label, label words as placeholder, hint for AT only', () => {
    renderWithIntl(<Field name="phone" type="tel" required />);
    const input = screen.getByLabelText(`${copy.labels.phone} *`);
    expect(input).toHaveAttribute('placeholder', copy.labels.phone);
    expect(input).toHaveAttribute('id', 'f-phone');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(document.querySelector('label[for="f-phone"]')).toHaveClass('sr-only');
    const hint = screen.getByText(copy.hints.phone);
    expect(hint).toHaveClass('sr-only');
    expect(input.getAttribute('aria-describedby')).toContain(hint.id);
  });

  it('labelMode="visible" keeps the catalogue placeholder and shows the hint on request', () => {
    renderWithIntl(<Field name="phone" type="tel" required labelMode="visible" showHint />);
    const input = screen.getByLabelText(`${copy.labels.phone} *`);
    expect(input).toHaveAttribute('placeholder', copy.placeholders.phone);
    expect(document.querySelector('label[for="f-phone"]')).not.toHaveClass('sr-only');
    expect(screen.getByText(copy.hints.phone)).not.toHaveClass('sr-only');
  });

  it('labelMode="small" draws the grey caption without an asterisk (Contact, SHARED 4.8)', () => {
    renderWithIntl(<Field name="email" type="email" required labelMode="small" />);
    const label = document.querySelector('label[for="f-email"]');
    expect(label).toHaveTextContent(copy.labels.email);
    expect(label).not.toHaveTextContent('*');
    expect(label).toHaveClass('text-text-tertiary');
  });

  it('an empty placeholder never leaves a placeholder-only field without visible words', () => {
    renderWithIntl(<Field name="phone" type="tel" placeholder="" hint="" />);
    expect(screen.getByLabelText(copy.labels.phone)).toHaveAttribute(
      'placeholder',
      copy.labels.phone,
    );
  });

  it('shows an explicit hint; keeps "optional" for AT only, and hint="" silences it', () => {
    const { unmount } = renderWithIntl(<Field name="company" />);
    expect(screen.getByText(copy.hints.optional)).toHaveClass('sr-only');
    unmount();
    const second = renderWithIntl(<Field name="city" hint="Şehir veya ilçe" />);
    expect(screen.getByText('Şehir veya ilçe')).not.toHaveClass('sr-only');
    second.unmount();
    renderWithIntl(<Field name="city" hint="" />);
    expect(screen.queryByText(copy.hints.optional)).toBeNull();
  });

  it('renders the dial select beside a phone field as its own labelled, echoed field (SHARED 4.5)', () => {
    renderWithIntl(
      <FormErrorsContext.Provider
        value={{ errors: { dial: 'required' }, values: { dial: 'PK', phone: '3001234567' } }}
      >
        <Field
          name="phone"
          type="tel"
          required
          dial={{
            name: 'dial',
            label: 'Ülke kodu',
            required: true,
            defaultValue: 'TR',
            options: [
              { value: 'PK', label: '🇵🇰 +92' },
              { value: 'TR', label: '🇹🇷 +90' },
            ],
          }}
        />
      </FormErrorsContext.Provider>,
    );
    const dial = screen.getByLabelText('Ülke kodu *') as HTMLSelectElement;
    expect(dial.tagName).toBe('SELECT');
    expect(dial).toHaveAttribute('name', 'dial');
    expect(dial).toHaveValue('PK');
    expect(dial).toHaveAttribute('aria-invalid', 'true');
    expect(dial.getAttribute('aria-describedby')).toContain(`${dial.id}-error`);
    expect(screen.getByLabelText(`${copy.labels.phone} *`)).toHaveValue('3001234567');
  });

  it('W30: a name without a sys.form.labels entry must pass label — throws outside production', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithIntl(<Field name="cvKey" />)).toThrow(/sys\.form\.labels\.cvKey/);
    renderWithIntl(<Field name="cvKey" label="Attached CV" />);
    expect(screen.getByLabelText('Attached CV')).toBeInTheDocument();
  });

  it('renders the error text and echoed value from the context, never for a file input', () => {
    renderWithIntl(
      <FormErrorsContext.Provider
        value={{ errors: { email: 'email', cv: 'file' }, values: { email: 'nope', cv: 'x' } }}
      >
        <Field name="email" type="email" />
        <Field name="cv" type="file" accept="application/pdf" />
      </FormErrorsContext.Provider>,
    );
    const email = screen.getByLabelText(copy.labels.email);
    expect(email).toHaveValue('nope');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(copy.labels.cv)).not.toHaveAttribute('value');
    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toEqual([copy.errors.email, copy.errors.file]);
  });

  it('passes minLength/maxLength/disabled through, and defaultValue unless a submit echoed a value', () => {
    const { unmount } = renderWithIntl(
      <>
        <Field name="description" as="textarea" minLength={20} maxLength={5000} defaultValue="Hi" />
        <Field name="city" defaultValue="İstanbul" disabled />
        <Field
          name="iAm"
          as="select"
          defaultValue="hr_agency"
          options={[
            { value: 'direct_employer', label: 'Employer' },
            { value: 'hr_agency', label: 'HR agency' },
          ]}
        />
      </>,
    );
    const description = screen.getByLabelText(copy.labels.description);
    expect(description).toHaveAttribute('minlength', '20');
    expect(description).toHaveAttribute('maxlength', '5000');
    expect(description).toHaveValue('Hi');
    const city = screen.getByLabelText(copy.labels.city);
    expect(city).toHaveValue('İstanbul');
    expect(city).toBeDisabled();
    expect(screen.getByLabelText(copy.labels.iAm)).toHaveValue('hr_agency');
    unmount();
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: {}, values: { city: 'Ankara' } }}>
        <Field name="city" defaultValue="İstanbul" />
      </FormErrorsContext.Provider>,
    );
    expect(screen.getByLabelText(copy.labels.city)).toHaveValue('Ankara');
  });

  it('renders a select with the placeholder option first and echoes the chosen value', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: {}, values: { iAm: 'hr_agency' } }}>
        <Field
          name="iAm"
          as="select"
          options={[
            { value: 'direct_employer', label: 'Employer' },
            { value: 'hr_agency', label: 'HR agency' },
          ]}
        />
      </FormErrorsContext.Provider>,
    );
    const select = screen.getByLabelText(copy.labels.iAm);
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveValue('hr_agency');
    // the placeholder-only face names the field in its empty option (the design's "Sektör")
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      copy.labels.iAm,
      'Employer',
      'HR agency',
    ]);
  });

  it('W205 ⚠️3: a locked single-option select renders no empty placeholder option; anything else keeps it', () => {
    const uz = [{ value: 'UZ', label: 'Uzbekistan' }];
    renderWithIntl(
      <>
        <Field name="country" as="select" options={uz} defaultValue="UZ" />
        <Field name="dial" label="Dial" as="select" options={uz} />
        <Field
          name="iAm"
          as="select"
          options={[
            { value: 'direct_employer', label: 'Employer' },
            { value: 'hr_agency', label: 'HR agency' },
          ]}
        />
      </>,
    );
    // the careers form's residency country: one option, preselected — nothing to choose
    const locked = screen.getByLabelText(copy.labels.country) as HTMLSelectElement;
    expect([...locked.options].map((o) => o.value)).toEqual(['UZ']);
    expect(locked).toHaveValue('UZ');
    // one option WITHOUT the matching defaultValue is not locked — the visitor still has to choose
    const dial = screen.getByLabelText('Dial') as HTMLSelectElement;
    expect([...dial.options].map((o) => o.value)).toEqual(['', 'UZ']);
    const open = screen.getByLabelText(copy.labels.iAm) as HTMLSelectElement;
    expect([...open.options].map((o) => o.value)).toEqual(['', 'direct_employer', 'hr_agency']);
  });

  it('W193: a select keeps the echoed choice through the post-action re-render and form reset', async () => {
    // FormShell after a failed action: the context switches from the idle `values: {}` to the
    // action's echoed values (one re-render), then React 19 resets the <form>. An input follows
    // its new defaultValue; a select applies defaultValue on mount only, so without a remount the
    // reset put it back on the placeholder (T5's partner country select showed '' for 'PK').
    const options = [
      { value: 'PK', label: 'Pakistan' },
      { value: 'NP', label: 'Nepal' },
    ];
    const ui = (values: Record<string, string>) => (
      <FormErrorsContext.Provider value={{ errors: {}, values }}>
        <form data-testid="shell">
          <Field name="country" as="select" options={options} />
          <Field name="dial" label="Dial" as="select" options={options} defaultValue="NP" />
          <Field name="city" />
        </form>
      </FormErrorsContext.Provider>
    );
    const { rerender } = renderWithIntl(ui({}));
    await userEvent.selectOptions(screen.getByLabelText(copy.labels.country), 'PK');
    // a select that starts from a defaultValue (T2's dial) must keep the visitor's change too (M5)
    await userEvent.selectOptions(screen.getByLabelText('Dial'), 'PK');
    await userEvent.type(screen.getByLabelText(copy.labels.city), 'Lahore');
    rerender(ui({ country: 'PK', dial: 'PK', city: 'Lahore' }));
    (screen.getByTestId('shell') as HTMLFormElement).reset();
    expect(screen.getByLabelText(copy.labels.country)).toHaveValue('PK');
    expect(screen.getByLabelText('Dial')).toHaveValue('PK');
    expect(screen.getByLabelText(copy.labels.city)).toHaveValue('Lahore');
  });
});
