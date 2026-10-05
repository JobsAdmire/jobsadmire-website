import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { HeroLeadForm, type HeroLeadFormProps } from '../HeroLeadForm';

const action = () => vi.fn(async (prev: FormActionState) => prev);

const props: HeroLeadFormProps = {
  locale: 'tr',
  actions: { hire: action(), callback: action() },
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  whatsappHref: 'https://wa.me/905011240340?text=Merhaba%20JobsAdmire',
  contact: {
    phone: '+905011240340',
    phoneDisplay: '+90 501 124 03 40',
    email: 'info@jobsadmire.com',
  },
  options: {
    sector: [
      { value: 'factory', label: 'Fabrika / Üretim' },
      { value: 'tourism', label: 'Turizm / Konaklama' },
    ],
    startWhen: [
      { value: 'asap', label: 'Hemen' },
      { value: 'month1', label: '1 ay içinde' },
    ],
  },
  copy: {
    title: 'İşçi talebi',
    titleMobile: 'İhtiyacınızı yazın',
    badge: '24 saat içinde yanıt',
    sub: 'Aday profilleri, gerçek aylık maliyet ve çalışma izni takvimi — ücretsiz.',
    openProposal: 'Ücretsiz teklif alın →',
    openCallback: 'Sizi arayalım',
    callbackNote: 'Numaranızı bırakın, Antalya ekibi sizi arasın.',
    labels: {
      company: 'Firma adı',
      name: 'İletişim kişisi',
      phone: 'Telefon / WhatsApp',
      sector: 'Sektör',
      headcount: 'İşçi sayısı',
      city: 'Şehir / bölge',
      startWhen: 'Zamanlama',
    },
    submitHire: 'Teklif isteyin →',
    submitCallback: 'Beni arayın →',
    whatsapp: "WhatsApp'tan yazın",
  },
};

beforeEach(() => {
  window.dataLayer = [];
});

describe('HeroLeadForm', () => {
  it("lays the proposal out in the design's pairs: one column to 900 px, two from 901; e-mail full width under the contact pair (W3)", () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const form = screen.getByTestId('hire-form');
    const order = [...form.querySelectorAll('input[name], select[name]')]
      .map((el) => el.getAttribute('name'))
      .filter((name) => !['honeypot', 'consent', 'cf-turnstile-response'].includes(name ?? ''));
    expect(order).toEqual([
      'company',
      'name',
      'phone',
      'email',
      'sector',
      'headcount',
      'city',
      'startWhen',
    ]);
    const grid = form.querySelector('input[name="company"]')!.closest('.grid')!;
    expect(grid).toHaveClass('lg:grid-cols-2');
    expect(grid).not.toHaveClass('xs:grid-cols-2');
    for (const name of ['company', 'email'])
      expect(
        form.querySelector(`input[name="${name}"]`)!.closest('.lg\\:col-span-2'),
      ).not.toBeNull();
    // `.ja-f-opt`: the optional fields hide at ≤ 460 px; the catalog's required ones never do
    const phoneHidden = (name: string) => {
      const box = form.querySelector(`[name="${name}"]`)!.closest('.max-xs\\:hidden');
      return box !== null && form.contains(box);
    };
    for (const name of ['sector', 'city', 'startWhen']) expect(phoneHidden(name), name).toBe(true);
    for (const name of ['company', 'name', 'phone', 'email', 'headcount'])
      expect(phoneHidden(name), name).toBe(false);
  });

  it('starts in proposal mode: the W3 fields, package labels (W115), key options (W78), the consent checkbox (W79)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const form = screen.getByTestId('hire-form');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    for (const name of ['company', 'name', 'email', 'phone', 'headcount', 'city'])
      expect(form.querySelector(`input[name="${name}"]`), name).not.toBeNull();
    expect(screen.getByRole('textbox', { name: 'Firma adı' })).toHaveAttribute('name', 'company');
    expect(screen.getByRole('textbox', { name: 'İletişim kişisi' })).toHaveAttribute(
      'name',
      'name',
    );
    // no package label for e-mail — Field falls back to sys.form.labels.email (W30/W115)
    expect(screen.getByRole('textbox', { name: 'E-posta' })).toHaveAttribute('name', 'email');
    const startWhen = [...form.querySelectorAll('select[name="startWhen"] option')].map((o) =>
      o.getAttribute('value'),
    );
    expect(startWhen).toEqual(['', 'asap', 'month1']);
    expect(form.querySelector('input[name="consent"][type="checkbox"]')).not.toBeNull();
    expect(screen.queryByTestId('callback-form')).toBeNull();
  });

  it('is the #proposal anchor; below xs the form waits behind the two mode buttons (W10/W17)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    expect(screen.getByTestId('hero-form')).toHaveAttribute('id', 'proposal');
    // Final pass A5 (T1b M6, W206): the sticky header is 113 px tall at 901–1100 and 107 px up to
    // 1199 (the nav wraps to two lines; one line from 1150 TR / 1200 EN), 71 px elsewhere — a
    // `#proposal` jump keeps the card clear of it at every band.
    expect(screen.getByTestId('hero-form')).toHaveClass(
      'scroll-mt-[90px]',
      'lg:scroll-mt-[125px]',
      'min-[1200px]:scroll-mt-[90px]',
    );
    // the design's card title inherits `line-height: normal`, not the site's 1.55 body leading
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('leading-[1.15]');
    expect(document.getElementById('hero-form-body')).toHaveClass('max-xs:hidden');
    expect(screen.getByTestId('hero-mode-proposal').parentElement).toHaveClass('xs:hidden');
  });

  it('"Ask us to call you" swaps to the callback form, shows the note and focuses the first field', async () => {
    const user = userEvent.setup();
    renderWithIntl(<HeroLeadForm {...props} />);
    await user.click(screen.getByTestId('hero-mode-callback'));
    const form = screen.getByTestId('callback-form');
    expect(form).toHaveAttribute('data-form-key', 'callback');
    for (const selector of [
      'input[name="name"]',
      'input[name="phone"]',
      'select[name="topic"]',
      'input[name="city"]',
    ])
      expect(form.querySelector(selector), selector).not.toBeNull();
    expect(form.querySelector('input[name="email"]')).toBeNull();
    expect(screen.getByText(props.copy.callbackNote)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beni arayın →' })).toHaveAttribute('type', 'submit');
    expect(screen.queryByTestId('hero-mode-callback')).toBeNull();
    expect(document.getElementById('hero-form-body')).not.toHaveClass('max-xs:hidden');
    expect(document.activeElement).toBe(form.querySelector('input[name="name"]'));
  });

  it('the WhatsApp link carries only the fixed hire prefill and fires whatsapp_click (page_cta)', () => {
    renderWithIntl(<HeroLeadForm {...props} />);
    const link = screen.getByRole('link', { name: "WhatsApp'tan yazın" });
    expect(link).toHaveAttribute('href', props.whatsappHref);
    expect(link).toHaveAttribute('target', '_blank');
    document.addEventListener('click', (e) => e.preventDefault(), { capture: true, once: true });
    fireEvent.click(link);
    expect(window.dataLayer?.at(-1)).toMatchObject({
      event: 'whatsapp_click',
      locale: 'tr',
      placement: 'page_cta',
    });
  });
});
