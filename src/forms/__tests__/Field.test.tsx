import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../client/Field';
import { FormErrorsContext } from '../client/FormErrorsContext';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';

const copy = tr.sys.form;

afterEach(() => vi.restoreAllMocks());

describe('Field', () => {
  it('reads label, placeholder and hint from sys.form.* by name', () => {
    renderWithIntl(<Field name="phone" type="tel" required />);
    const input = screen.getByLabelText(`${copy.labels.phone} *`);
    expect(input).toHaveAttribute('placeholder', copy.placeholders.phone);
    expect(input).toHaveAttribute('id', 'f-phone');
    expect(screen.getByText(copy.hints.phone)).toBeInTheDocument();
  });

  it('marks a non-required field "optional" unless a hint is passed, and hint="" silences it', () => {
    const { unmount } = renderWithIntl(<Field name="company" />);
    expect(screen.getByText(copy.hints.optional)).toBeInTheDocument();
    unmount();
    renderWithIntl(<Field name="city" hint="" />);
    expect(screen.queryByText(copy.hints.optional)).toBeNull();
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
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      copy.placeholders.select,
      'Employer',
      'HR agency',
    ]);
  });
});
