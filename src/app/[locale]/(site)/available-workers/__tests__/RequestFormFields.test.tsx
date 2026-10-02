import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormErrorsContext } from '@/forms/client/FormErrorsContext';
import { renderWithIntl } from '@/test/render';
import { RequestFormFields, type RequestFormFieldsProps } from '../_components/RequestFormFields';

const props: RequestFormFieldsProps = {
  legend: 'I am',
  roles: {
    direct_employer: {
      tab: 'Employer',
      title: 'Request candidates from the pool',
      subtitle: 'Full CVs, documents and video interviews within 4 working hours.',
      companyLabel: 'Company name',
      tradeLabel: 'Which roles and how many workers?',
      messagePlaceholder: 'City, sector and target start date (optional)',
    },
    hr_agency: {
      tab: 'HR agency',
      title: 'Supply for your clients',
      subtitle: 'We supply the workers and file the permits — your client stays yours.',
      companyLabel: 'Agency name',
      tradeLabel: 'Which roles do your clients need, and what volume?',
      messagePlaceholder: 'Sectors you serve and cities (optional)',
    },
  },
  labels: {
    name: 'Contact person',
    email: 'Email',
    phone: 'Phone / WhatsApp',
    city: 'City in Türkiye',
  },
  startWhenOptions: [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'month1', label: 'Within 1 month' },
  ],
};

describe('RequestFormFields', () => {
  it('renders every catalog-backed field under its catalog name, with the package labels (W115)', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    for (const name of [
      'company',
      'name',
      'email',
      'phone',
      'city',
      'trade',
      'headcount',
      'startWhen',
      'message',
    ])
      expect(container.querySelector(`[name="${name}"]`), name).not.toBeNull();
    // W77/W78: no sector select on `workers`.
    expect(container.querySelector('[name="sector"]')).toBeNull();
    expect(screen.getByLabelText(/^Company name/)).toHaveAttribute('name', 'company');
    expect(screen.getByLabelText(/^Contact person/)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^Phone \/ WhatsApp/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/^City in Türkiye/)).toHaveAttribute('name', 'city');
    expect(screen.getByLabelText(/^Which roles and how many workers\?/)).toHaveAttribute(
      'name',
      'trade',
    );
    // Fields without a package label read `sys.form.labels.*` (W30).
    expect(screen.getByLabelText(/^Number of workers/)).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText(/^When do you need them\?/).tagName).toBe('SELECT');
    // The kernel's placeholder option first, then the shared keys the page passes (W78/W111).
    expect(container.querySelectorAll('select[name="startWhen"] option')).toHaveLength(3);
    expect(container.querySelector('[name="trade"]')).toHaveAttribute('maxlength', '200');
    expect(container.querySelector('[name="city"]')).toHaveAttribute('maxlength', '120');
  });

  it('employer is the default; the head and the message prompt are the employer copy', () => {
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    expect(screen.getByRole('radio', { name: 'Employer' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'HR agency' })).not.toBeChecked();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Request candidates from the pool' }),
    ).toBeInTheDocument();
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'City, sector and target start date (optional)',
    );
  });

  it('switching the role swaps the head, the company and roles labels and the prompt; iAm is the radio pair', async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(<RequestFormFields {...props} />, { locale: 'en' });
    await user.click(screen.getByRole('radio', { name: 'HR agency' }));
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Supply for your clients' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Agency name/)).toHaveAttribute('name', 'company');
    expect(screen.getByLabelText(/^Which roles do your clients need/)).toHaveAttribute(
      'name',
      'trade',
    );
    expect(container.querySelector('[name="message"]')).toHaveAttribute(
      'placeholder',
      'Sectors you serve and cities (optional)',
    );
    // The radio group is what the form posts as `iAm` — no hidden input, no duplicate.
    expect(container.querySelectorAll('[name="iAm"]')).toHaveLength(2);
  });

  it('a failed submit echoes the chosen role back (useFieldValue seeds the state)', () => {
    renderWithIntl(
      <FormErrorsContext.Provider value={{ errors: {}, values: { iAm: 'hr_agency' } }}>
        <RequestFormFields {...props} />
      </FormErrorsContext.Provider>,
      { locale: 'en' },
    );
    expect(screen.getByRole('radio', { name: 'HR agency' })).toBeChecked();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Supply for your clients' }),
    ).toBeInTheDocument();
  });
});
