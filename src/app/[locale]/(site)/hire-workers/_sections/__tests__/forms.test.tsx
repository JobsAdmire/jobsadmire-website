import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { SECTOR_KEYS } from '@/content/collections';
import { makeTf, metricValues } from '@/content/pure';
import { START_WHEN_KEYS } from '@/forms/options';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { Hero } from '../Hero';
import { QuickQuote } from '../QuickQuote';
import { RequestForm } from '../RequestForm';

// The 'use server' module is replaced: jsdom renders the shells and never posts — Cycle 2 pins
// the actions, the Cycle 7 gate runs the real round trip.
vi.mock('../../actions', () => ({
  submitHireQuick: vi.fn(async () => ({ status: 'idle' })),
  submitHireFull: vi.fn(async () => ({ status: 'idle' })),
}));

const load = (locale: 'tr' | 'en'): Bundle =>
  BundleSchema.parse(
    JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'content', 'local', `bundle.${locale}.json`), 'utf8'),
    ),
  );
const TR = load('tr');
const tf = makeTf(TR, 'tr');
const WA = 'https://wa.me/905011240340';
const tokens = (el: Element) => (el.getAttribute('class') ?? '').split(/\s+/);
/** The visible label of the control with this id, without the required asterisk. */
const labelOf = (id: string) =>
  document.querySelector(`label[for="${id}"]`)?.textContent?.replace(/\s*\*$/, '');
const startWhenOptions = START_WHEN_KEYS.map((key) => ({
  value: key,
  label: tr.sys.form.options.startWhen[key],
}));
const requestForm = (
  <RequestForm
    bundle={TR}
    locale="tr"
    tf={tf}
    dialLabel={tr.sys.hire.form.dial}
    startWhenOptions={startWhenOptions}
  />
);
const hero = (
  <Hero
    bundle={TR}
    locale="tr"
    tf={tf}
    metrics={metricValues(TR, 'tr')}
    whatsappLabel={tr.sys.hire.whatsapp}
  />
);

describe('QuickQuote', () => {
  it('is a hire form with its own id scope and the package labels (W115), hidden ≤ 700 px by max-md:hidden (W10/W119)', () => {
    renderWithIntl(<QuickQuote bundle={TR} locale="tr" tf={tf} />);
    const form = screen.getByTestId('hire-form-quick');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    const expected: [string, string][] = [
      ['company', 'hire.047'],
      ['city', 'hire.048'],
      ['name', 'hire.053'],
      ['roleNeeded', 'hire.049'],
      ['headcount', 'hire.050'],
      ['phone', 'hire.051'],
      ['email', 'hire.052'],
    ];
    for (const [name, id] of expected) {
      expect(form.querySelector(`[name="${name}"]`)).toHaveAttribute('id', `f-hire-quick-${name}`);
      expect(labelOf(`f-hire-quick-${name}`)).toBe(tf(id));
    }
    expect(form.querySelector('#f-hire-quick-consent')).toHaveAttribute('type', 'checkbox'); // W79
    const submit = within(form).getByRole('button', { name: tf('hire.063') });
    expect(submit).toHaveAttribute('type', 'submit');
    // S3.3: the design's full-width green submit with the WhatsApp glyph, ABOVE the consent line
    expect(tokens(submit)).toEqual(expect.arrayContaining(['w-full', 'bg-success-text']));
    expect(submit.querySelector('svg')).not.toBeNull();
    expect(
      submit.compareDocumentPosition(form.querySelector('#f-hire-quick-consent')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // S3.1: placeholder-only fields — the label words are the placeholder, the label stays for AT
    expect(form.querySelector('[name="company"]')).toHaveAttribute('placeholder', tf('hire.047'));
    const desktop = screen.getByTestId('hire-quick-desktop');
    expect(tokens(desktop)).toContain('max-md:hidden');
    expect(tokens(desktop)).not.toContain('hidden');
    expect(desktop).toContainElement(form);
  });

  it('≤ 700 px: the CTA pair and the trust trio stand in for the form (md:hidden from 701 px)', () => {
    renderWithIntl(<QuickQuote bundle={TR} locale="tr" tf={tf} />);
    const mobile = screen.getByTestId('hire-quick-mobile');
    expect(tokens(mobile)).toContain('md:hidden');
    expect(within(mobile).getByRole('link', { name: tf('hire.040') })).toHaveAttribute(
      'href',
      '#request-form',
    );
    expect(within(mobile).getByRole('link', { name: tf('hire.041') })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tf('hire.250'))}`,
    );
  });
});

describe('RequestForm', () => {
  it('is #request-form: a hire form with its own id scope, the package labels, keys as option values, TR preselected', () => {
    const { container } = renderWithIntl(requestForm);
    expect(container.querySelector('section#request-form')).not.toBeNull(); // W152/W158
    const form = screen.getByTestId('hire-form-full');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    const expected: [string, string][] = [
      ['company', tf('hire.047')],
      ['name', tf('hire.053')],
      ['email', tf('hire.052')],
      ['dial', tr.sys.hire.form.dial],
      ['phone', tf('hire.051')],
      ['sector', tf('hire.054')],
      ['roleNeeded', tf('hire.055')],
      ['headcount', tf('hire.056')],
      ['city', tf('hire.057')],
      ['startWhen', tf('hire.058')],
    ];
    for (const [name, label] of expected) {
      expect(form.querySelector(`[name="${name}"]`)).toHaveAttribute('id', `f-hire-full-${name}`);
      expect(labelOf(`f-hire-full-${name}`)).toBe(label);
    }
    const values = (name: string) =>
      Array.from(
        form.querySelectorAll<HTMLOptionElement>(`select[name="${name}"] option`),
        (o) => o.value,
      );
    expect(values('sector')).toEqual(['', ...SECTOR_KEYS]); // W77
    expect(values('startWhen')).toEqual(['', ...START_WHEN_KEYS]); // W78
    // the 64 countries rows (W3), "🇹🇷 +90" faces (SHARED 4.5); preselected, so no empty option
    expect(values('dial')).toHaveLength(64);
    const dial = form.querySelector('select[name="dial"]') as HTMLSelectElement;
    expect(dial.value).toBe('TR');
    expect(dial.selectedOptions[0].textContent).toBe('🇹🇷 +90');
    // M11: the dial sits beside the phone in one row at every width
    expect(dial.closest('[class*="grid-cols-[104px_minmax(0,1fr)]"]')).toContainElement(
      form.querySelector('[name="phone"]') as HTMLElement,
    );
    expect(form.querySelector('#f-hire-full-consent')).toHaveAttribute('type', 'checkbox'); // W79
  });

  it('S13.2/S13.4: no message box; the full-width green submit with its glyph sits above consent', () => {
    renderWithIntl(requestForm);
    const form = screen.getByTestId('hire-form-full');
    expect(form.querySelector('textarea')).toBeNull();
    const submit = within(form).getByRole('button', { name: tf('hire.063') });
    expect(tokens(submit)).toEqual(expect.arrayContaining(['w-full', 'bg-success-text']));
    expect(submit.querySelector('svg')).not.toBeNull();
    expect(
      submit.compareDocumentPosition(form.querySelector('#f-hire-full-consent')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('mails with the subject only (W95); the steps and the phone tile hide ≤ 700 px (W10/W119)', () => {
    renderWithIntl(requestForm);
    const region = screen.getByTestId('hire-request');
    const mailto = `mailto:info@jobsadmire.com?subject=${encodeURIComponent(tf('hire.253'))}`;
    expect(within(region).getByRole('link', { name: tf('hire.222') })).toHaveAttribute(
      'href',
      mailto,
    );
    expect(tokens(region.querySelector('ol')!)).toContain('max-md:hidden');
    const tel = region.querySelector('a[href="tel:+905011240340"]')!;
    expect(tokens(tel)).toContain('max-md:hidden');
    expect(tokens(tel)).not.toContain('hidden');
    // S13.5: both direct-contact tiles lead with their 32 px icon square
    expect(tel.querySelector('svg')).not.toBeNull();
    expect(
      within(region)
        .getAllByRole('link', { name: new RegExp(tf('hire.213')) })[0]
        .querySelector('svg'),
    ).not.toBeNull();
  });
});

describe('RequestForm h2 (Cycle 8(a))', () => {
  it('carries the design tracking and leading, and the ≤ 700 px .ja-rf-copy size (25 px, −0.5 px, 1.13)', () => {
    renderWithIntl(requestForm);
    const h2 = screen.getByTestId('hire-request').querySelector('h2')!;
    expect(tokens(h2)).toEqual(
      expect.arrayContaining([
        'text-h2',
        'leading-[1.05]',
        'tracking-[-1.6px]',
        'xl:tracking-[-1.2px]',
        'max-md:text-[25px]',
        'max-md:leading-[1.13]',
        'max-md:tracking-[-0.5px]',
      ]),
    );
  });
});

describe('Hero', () => {
  it('names the hw-hero photo the one LCP slot, not the h1 (D26, W233); own crumbs (W109); metric pills (W1)', () => {
    const { container } = renderWithIntl(hero);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).not.toHaveAttribute('data-lcp-slot');
    expect(h1.textContent).toBe(`${tf('hire.021')} ${tf('hire.022')} ${tf('hire.023')}`);
    const lcp = container.querySelectorAll('[data-lcp-slot]');
    expect(lcp).toHaveLength(1);
    expect(lcp[0].tagName).toBe('IMG');
    expect(lcp[0]).toHaveAttribute('data-lcp-slot', 'hw-hero');
    expect(lcp[0]).toHaveAttribute('alt', '');
    expect(lcp[0].getAttribute('src')).toContain(encodeURIComponent('/hero/hire-workers.jpg'));
    expect(container.querySelector('[data-placeholder="hw-hero"]')).toBeNull();
    const crumbs = screen.getByRole('navigation', { name: tr.sys.nav.breadcrumbs });
    expect(within(crumbs).getByRole('link', { name: tf('hire.020') })).toHaveAttribute('href', '/');
    expect(within(crumbs).getByText(tf('hire.002'))).toHaveAttribute('aria-current', 'page');
    const pills = screen.getByTestId('hire-hero-pills');
    expect(pills.textContent).toContain('470+');
    expect(pills.textContent).toContain(tf('hire.036'));
    const ctas = screen.getByTestId('hire-hero-ctas');
    expect(tokens(ctas)).toContain('max-md:hidden');
    expect(tokens(ctas)).not.toContain('hidden');
    expect(within(ctas).getByRole('link', { name: tf('hire.032') })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(within(ctas).getByRole('link', { name: tr.sys.hire.whatsapp })).toHaveAttribute(
      'href',
      `${WA}?text=${encodeURIComponent(tf('hire.249'))}`,
    );
  });

  it('anchors the decorative hw-hero photo box top-left at a fixed per-breakpoint size, never sized from the text (W187)', () => {
    // The h1 rewraps when the Turkish web font arrives; a box sized or centred from the hero's
    // height then moves and resizes with it (CLS 0.137 on /isci-talebi). Fixed heights, top-left.
    // Final pass A8 (W189 A5, W210 c): the fixed heights now live in the slot's own cover mode
    // (1,200 / 1,800 / 1,200 px — the measured hero maxima 1,040 / 1,368 / 1,018 px + ≥ 10 %);
    // the wrapper only anchors it top-left at full width. W233: the photo fills that box.
    renderWithIntl(hero);
    const slot = document.querySelector<HTMLElement>('img[data-lcp-slot="hw-hero"]')!;
    const box = slot.parentElement!;
    const t = tokens(box);
    expect(t).toEqual(expect.arrayContaining(['absolute', 'left-0', 'top-0', 'w-full']));
    expect(t.some((c) => /aspect-|(^|:)h-\[/.test(c))).toBe(false);
    for (const c of [...t, ...tokens(slot)])
      expect(c).not.toMatch(/(^|:)(h-full|min-h-full|top-1\/2|left-1\/2|-?translate-[xy]-)/);
    expect(box).not.toHaveAttribute('style');
    expect(slot).toHaveClass('w-full', 'object-cover', 'h-(--cover-h)', 'lg:h-(--cover-h-lg)');
    expect(slot.style.getPropertyValue('--cover-h')).toBe('1200px');
    expect(slot.style.getPropertyValue('--cover-h-md')).toBe('1800px');
    expect(slot.style.getPropertyValue('--cover-h-lg')).toBe('1200px');
    expect(slot.style.getPropertyValue('--cover-h-xl')).toBe('1200px');
  });
});

describe('the two hire shells on one page', () => {
  it('never share a DOM id (idScope hire-quick / hire-full — axe duplicate-id)', () => {
    const { container } = renderWithIntl(
      <>
        {hero}
        {requestForm}
      </>,
    );
    const ids = Array.from(container.querySelectorAll('[id]'), (el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['f-hire-quick-consent', 'f-hire-full-consent']));
  });
});
