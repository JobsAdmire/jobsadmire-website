import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { CallbackWidget, type CallbackWidgetCopy } from '../CallbackWidget';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const copy: CallbackWidgetCopy = {
  title: 'Can’t talk right now?',
  sub: 'Pick a slot — we call you back on your number',
  dayLegend: 'Which day',
  slotLegend: 'Best time',
  days: { today: 'Today', tomorrow: 'Tomorrow', this_week: 'This week' },
  anyTime: 'any time',
  nameLabel: 'Your name',
  phoneLabel: 'Phone / WhatsApp',
  phonePlaceholder: 'Your number, e.g. +90 5xx xxx xx xx',
  submit: 'Request call',
  note: 'We call from +90 501 124 03 40.',
  fallbackIntro:
    'Hello JobsAdmire, the callback form did not go through — please call me back. My details:',
};

const renderWidget = () =>
  renderWithIntl(
    <CallbackWidget
      action={idle}
      copy={copy}
      locale="en"
      turnstileSiteKey={null}
      whatsappNumber="905011240340"
      contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
    />,
    { locale: 'en' },
  );

describe('CallbackWidget', () => {
  it('is closed like the design: a toggle, its panel hidden, no form in the DOM', () => {
    renderWidget();
    const toggle = screen.getByRole('button', { name: /Can’t talk right now\?/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(toggle.getAttribute('aria-controls') ?? '')).toHaveAttribute(
      'hidden',
    );
    expect(screen.queryByTestId('contact-callback-form')).toBeNull();
  });

  it('opens to a callback form: day and slot chips posting keys, name + phone, a consent checkbox (W3/W79)', () => {
    renderWidget();
    fireEvent.click(screen.getByRole('button', { name: /Can’t talk right now\?/ }));
    const form = screen.getByTestId('contact-callback-form');
    expect(form).toHaveAttribute('data-form-key', 'callback');
    const days = [...form.querySelectorAll<HTMLInputElement>('input[name="day"]')];
    expect(days.map((d) => d.value)).toEqual(['today', 'tomorrow', 'this_week']);
    expect(days[0].checked).toBe(true);
    const slots = [...form.querySelectorAll<HTMLInputElement>('input[name="slot"]')];
    expect(slots.map((s) => s.value)).toEqual(['09-11', '11-13', '14-16', '16-18', 'any']);
    expect(within(form).getByText('14:00–16:00')).toBeInTheDocument();
    expect(within(form).getByText('any time')).toBeInTheDocument();
    expect(within(form).getByRole('textbox', { name: /^Your name/ })).toHaveAttribute(
      'id',
      'f-contact-callback-name',
    );
    expect(within(form).getByRole('textbox', { name: /^Phone \/ WhatsApp/ })).toHaveAttribute(
      'type',
      'tel',
    );
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-callback-consent');
    expect(within(form).getByRole('button', { name: 'Request call' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
