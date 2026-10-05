import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../client/Field';
import { FormShell } from '../client/FormShell';
import type { FormActionState } from '../types';
import { renderWithIntl } from '@/test/render';

const base = {
  formKey: 'hire' as const,
  locale: 'tr' as const,
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  testId: 'f',
};
const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));

// SHARED 4.3 / 4.4 (parity pass): the design's submit and consent faces.
describe('FormShell — the design look', () => {
  it('submits full width with a trailing arrow by default, after the consent line', () => {
    renderWithIntl(
      <FormShell {...base} action={idle} submitLabel="Teklif al">
        <Field name="name" required />
      </FormShell>,
    );
    const submit = screen.getByRole('button', { name: 'Teklif al' });
    expect(submit).toHaveClass('w-full', 'rounded-pill');
    expect(submit.querySelector('svg')).not.toBeNull();
    const consent = screen.getByRole('checkbox');
    expect(consent.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(consent).toHaveClass('h-[17px]', 'w-[17px]');
  });

  it('takes the variant, shape, icon and placement a page asks for; no doubled arrow', () => {
    renderWithIntl(
      <FormShell
        {...base}
        action={idle}
        submitLabel="WhatsApp'tan gönder →"
        submitVariant="success-solid"
        submitShape="rect"
        submitRadius={11}
        submitIcon={<svg data-testid="wa" aria-hidden="true" />}
        submitPlacement="before-consent"
        consentStyle="box"
      >
        <Field name="name" required />
      </FormShell>,
    );
    const submit = screen.getByRole('button', { name: "WhatsApp'tan gönder →" });
    expect(submit).toHaveClass('bg-success-text', 'rounded-[11px]');
    expect(submit.querySelectorAll('svg')).toHaveLength(1);
    expect(screen.getByTestId('wa')).toBeInTheDocument();
    const consent = screen.getByRole('checkbox');
    expect(submit.compareDocumentPosition(consent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(consent.closest('div')).toHaveClass('bg-pale-1', 'border-edge-soft');
  });

  it('inline layout puts the field and the submit in one row (Newsletter band)', () => {
    renderWithIntl(
      <FormShell {...base} formKey="newsletter" action={idle} layout="inline" submitLabel="Abone">
        <Field name="email" type="email" required />
      </FormShell>,
    );
    const submit = screen.getByRole('button', { name: 'Abone' });
    expect(submit).not.toHaveClass('w-full');
    const row = submit.parentElement!.parentElement!;
    expect(row).toHaveClass('sm:flex-row');
    expect(row).toContainElement(screen.getByRole('textbox'));
  });
});
