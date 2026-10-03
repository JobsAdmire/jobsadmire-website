import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import { renderWithIntl } from '@/test/render';
import { localBundle } from '../../_lib/__tests__/bundles';
import { Faq } from '../Faq';
import { Hero } from '../Hero';
import { Message } from '../Message';
import { Offices } from '../Offices';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));
const en = localBundle('en');
const tr = localBundle('tr');
const WA = 'https://wa.me/905011240340';
const prefillOf = (href: string | null) =>
  decodeURIComponent((href ?? '').split('?text=')[1] ?? '');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-23T07:32:00Z')); // Wednesday 10:32 in Istanbul, 12:32 in Karachi
  window.dataLayer = [];
});
afterEach(() => vi.useRealTimers());

describe('Hero', () => {
  it('EN: one h1 as the only LCP slot, the named photo placeholder, this page’s own crumbs (D26/W109)', () => {
    const { container } = renderWithIntl(<Hero bundle={en} locale="en" submitCallback={idle} />, {
      locale: 'en',
    });
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Talk to the people who do the work');
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(
      [...container.querySelectorAll('[data-placeholder]')].map((el) =>
        el.getAttribute('data-placeholder'),
      ),
    ).toEqual(['contact-hero']);
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(crumbs).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(crumbs).getByText('Contact')).toHaveAttribute('aria-current', 'page');
  });

  // QA W220 contact-01: the design's `image-slot#contact-hero` is `inset: 0; height: 100%` under
  // the two overlays. A width-driven 16:9 box stopped at 219 / 506 px while the hero ran to
  // ≈ 1,090 / 1,325 px (390 / 900) — a seam through the h1. Like hw-hero (W187, final pass A8):
  // cover mode at a fixed height per band, anchored top-left, never sized from the text.
  it('runs the contact-hero slot in cover mode over the whole hero, anchored top-left (contact-01)', () => {
    renderWithIntl(<Hero bundle={en} locale="en" submitCallback={idle} />, { locale: 'en' });
    const slot = document.querySelector<HTMLElement>('[data-placeholder="contact-hero"]')!;
    const box = slot.parentElement!;
    const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
    expect(tokens(box)).toEqual(expect.arrayContaining(['absolute', 'left-0', 'top-0', 'w-full']));
    expect(box).not.toHaveAttribute('style');
    expect(slot).toHaveClass('w-full', 'object-cover', 'h-(--cover-h)', 'lg:h-(--cover-h-lg)');
    expect(slot.style.aspectRatio).toBe('');
    expect(slot.style.getPropertyValue('--cover-h')).toBe('1500px');
    expect(slot.style.getPropertyValue('--cover-h-md')).toBe('1800px');
    expect(slot.style.getPropertyValue('--cover-h-lg')).toBe('1300px');
    expect(slot.style.getPropertyValue('--cover-h-xl')).toBe('1300px');
  });

  it('the channel cards carry the settings doors: WhatsApp with the company prefill, both lines, the e-mail with the metric SLA', () => {
    const { container } = renderWithIntl(<Hero bundle={en} locale="en" submitCallback={idle} />, {
      locale: 'en',
    });
    const wa = container.querySelector(`a[href^="${WA}?text="]`);
    expect(prefillOf(wa?.getAttribute('href') ?? null)).toBe(
      'Hello JobsAdmire, I have a question about hiring workers in Türkiye.',
    );
    expect(wa).toHaveAttribute('target', '_blank');
    expect(container.querySelector('a[href="tel:+905011240340"]')).toHaveTextContent(
      '+90 501 124 03 40',
    );
    // W208: the Agencies card is on the main line too (settings.partnershipsPhone is null)
    expect(container.querySelectorAll('a[href="tel:+905011240340"]')).toHaveLength(2);
    expect(container.querySelectorAll('a[href^="tel:"]')).toHaveLength(2);
    expect(container.querySelector('a[href="mailto:info@jobsadmire.com"]')).toHaveTextContent(
      'Reply within ~4 business hours',
    );
    const pills = screen.getAllByTestId('live-status');
    expect(pills.map((p) => p.getAttribute('data-variant'))).toEqual([
      'hero',
      'whatsapp',
      'lines',
      'lines',
    ]);
    expect(pills[0]).toHaveTextContent('Office open now · 10:32 in Antalya');
    expect(pills[2]).toHaveTextContent('Lines open now · Mon–Fri 09:00–18:00');
    expect(
      [...container.querySelectorAll('li[lang]')].map((li) => li.getAttribute('lang')),
    ).toEqual(['tr', 'en', 'fr', 'hi', 'ru']);
    expect(screen.getByRole('button', { name: /Can’t talk right now\?/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('the Agencies card falls back to the main line when settings.partnershipsPhone is null (W176)', () => {
    const noPartners = { ...en, settings: { ...en.settings, partnershipsPhone: null } };
    const { container } = renderWithIntl(
      <Hero bundle={noPartners} locale="en" submitCallback={idle} />,
      { locale: 'en' },
    );
    expect(container.querySelector('a[href="tel:+905533832549"]')).toBeNull();
    const main = container.querySelectorAll('a[href="tel:+905011240340"]');
    expect(main).toHaveLength(2); // the Employers card and the Agencies card, both on the main line
    expect(main[1]).toHaveTextContent('+90 501 124 03 40');
    expect(screen.getAllByTestId('live-status')).toHaveLength(4);
  });

  it('TR: the h1 is the package’s own split (contact.025 + contact.026)', () => {
    renderWithIntl(<Hero bundle={tr} locale="tr" submitCallback={idle} />, { locale: 'tr' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'İşi asıl yapan kişilerle konuşun',
    );
  });
});

describe('Message', () => {
  it('is section#message (the header CTA target, W17): four steps with the metric SLA, the local QR (W14), the WhatsApp CTA', () => {
    const { container } = renderWithIntl(<Message bundle={en} locale="en" submitContact={idle} />, {
      locale: 'en',
    });
    expect(container.querySelector('section#message')).not.toBeNull();
    const steps = container.querySelectorAll('ol[data-variant="plain"] > li');
    expect(steps).toHaveLength(4);
    expect(steps[3]).toHaveTextContent('Written numbers within 24 hours');
    const qr = within(screen.getByTestId('contact-qr')).getByRole('img', {
      name: 'QR code — scan to open a WhatsApp chat with JobsAdmire',
    });
    expect(qr.tagName.toLowerCase()).toBe('svg');
    expect(
      prefillOf(screen.getByRole('link', { name: 'Chat on WhatsApp' }).getAttribute('href')),
    ).toBe('Hello JobsAdmire, I have a question about hiring workers in Türkiye.');
  });

  it('holds the enquiry card: the hire form first, the e-mail line under it', () => {
    renderWithIntl(<Message bundle={en} locale="en" submitContact={idle} />, { locale: 'en' });
    const form = screen.getByTestId('contact-enquiry-form');
    expect(
      within(form).getByRole('heading', { level: 3, name: 'Tell us the roles' }),
    ).toBeInTheDocument();
    expect(within(form).getByRole('textbox', { name: /^City in Türkiye/ })).toHaveAttribute(
      'name',
      'city',
    );
    expect(
      within(form).getByRole('textbox', { name: /^Anything else \(optional\)/ }),
    ).toHaveAttribute('name', 'message');
    expect(screen.getByRole('link', { name: 'Rather email? →' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
  });
});

describe('Offices', () => {
  it('two office cards with pills from their own rows, the notes and the available-workers link', () => {
    const { container } = renderWithIntl(<Offices bundle={en} locale="en" submitVisit={idle} />, {
      locale: 'en',
    });
    const cards = [...container.querySelectorAll('article')] as HTMLElement[];
    expect(cards).toHaveLength(2);
    expect(
      within(cards[0]).getByRole('heading', { level: 3, name: 'Antalya' }),
    ).toBeInTheDocument();
    expect(
      within(cards[1]).getByRole('heading', { level: 3, name: 'Karachi' }),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByTestId('live-status')
        .map((p) => p.querySelector('[data-live-text]')?.textContent),
    ).toEqual(['Open now · 10:32 local · closes 18:00', 'Open now · 12:32 local · closes 19:00']);
    expect(
      within(cards[1]).getByRole('link', { name: 'See who is available →' }),
    ).toBeInTheDocument();
    // OfficeCard renders its own tel / WhatsApp / mail rows with the office_card placement (W12).
    expect(cards[0].querySelector('a[href="tel:+905011240340"]')).not.toBeNull();
  });

  it('the site-visit band links WhatsApp with the company prefill; the visit card carries the visit form', () => {
    const { container } = renderWithIntl(<Offices bundle={en} locale="en" submitVisit={idle} />, {
      locale: 'en',
    });
    expect(
      prefillOf(screen.getByRole('link', { name: 'Request a site visit' }).getAttribute('href')),
    ).toBe('Hello JobsAdmire, I would like a site visit before deciding on worker numbers.');
    expect(screen.getByTestId('contact-visit-form')).toHaveAttribute('data-form-key', 'visit');
    expect(container.querySelectorAll('input[name="preferredDate"][type="radio"]')).toHaveLength(5);
  });
});

describe('Faq', () => {
  it('#faq with six pairs — answer 3 carries the lines’ hours and the SLA metric, answer 5 the JobsAdmire voice — and one FAQPage node', () => {
    const { container } = renderWithIntl(<Faq bundle={en} locale="en" />, { locale: 'en' });
    expect(container.querySelector('#faq')).not.toBeNull();
    expect(container.querySelectorAll('[data-accordion-trigger]')).toHaveLength(6);
    type Faq = {
      '@type': string;
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    const nodes = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? '{}') as Faq,
    );
    const faq = nodes.filter((n) => n['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    expect(faq[0].mainEntity).toHaveLength(6);
    expect(faq[0].mainEntity[2].acceptedAnswer.text).toBe(
      'WhatsApp is the fastest channel in office hours (Mon–Fri 09:00–18:00, Turkish time); e-mail is answered within about 4 business hours. Messages sent at night or over the weekend are picked up the next business morning.',
    );
    expect(faq[0].mainEntity[4].acceptedAnswer.text).toMatch(
      /^Yes, but JobsAdmire does not take individual applications directly/,
    );
  });
});
