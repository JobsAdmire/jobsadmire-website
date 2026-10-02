import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { VisitBooking, type VisitBookingCopy } from '../VisitBooking';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const antalya = { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' };
const copy: VisitBookingCopy = {
  eyebrow: 'Ziyaret ayarlayın',
  title: 'Bizimle yüz yüze görüşmeyi mi tercih edersiniz?',
  body: 'Size uygun gün ve saati seçin.',
  dayLegend: 'Gün',
  timeLegend: 'Saat',
  toggleOpen: 'Bir gün ve saat seçin',
  toggleClose: 'Saatleri gizle',
  nameLabel: 'Adınız',
  emailLabel: 'E-posta',
  phoneLabel: 'Telefon / WhatsApp',
  submit: 'Ziyaret saati talep edin',
  fallbackIntro: 'Merhaba JobsAdmire, ziyaret formu gönderilemedi. Bilgilerim:',
};

describe('VisitBooking', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('offers the next five Antalya open days as ISO-valued chips, the five slots, the W3 trio and a consent checkbox', () => {
    vi.setSystemTime(new Date('2026-09-25T20:00:00Z')); // Friday 23:00 in Istanbul
    renderWithIntl(
      <VisitBooking
        action={idle}
        copy={copy}
        hours={antalya}
        locale="tr"
        turnstileSiteKey={null}
        whatsappNumber="905011240340"
        contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
      />,
      { locale: 'tr' },
    );
    const form = screen.getByTestId('contact-visit-form');
    expect(form).toHaveAttribute('data-form-key', 'visit');
    const days = [...form.querySelectorAll<HTMLInputElement>('input[name="preferredDate"]')];
    expect(days.map((d) => d.value)).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
    ]);
    expect(days.every((d) => d.type === 'radio')).toBe(true);
    expect(within(form).getByText('28 Eyl Pzt')).toBeInTheDocument();
    expect(
      [...form.querySelectorAll<HTMLInputElement>('input[name="preferredTime"]')].map(
        (s) => s.value,
      ),
    ).toEqual(['09:30', '11:00', '13:30', '15:00', '16:30']);
    for (const name of ['name', 'email', 'phone'])
      expect(form.querySelector(`#f-contact-visit-${name}`)).toHaveAttribute('name', name);
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-visit-consent');
    expect(within(form).getByRole('button', { name: 'Ziyaret saati talep edin' })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.getByRole('heading', { level: 3, name: copy.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bir gün ve saat seçin' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
