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
    expect(within(form).getByRole('button', { name: tf('hire.063') })).toHaveAttribute(
      'type',
      'submit',
    );
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
      ['message', tr.sys.form.labels.message],
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
    expect(values('dial')).toHaveLength(65); // the placeholder + the 64 countries rows (W3)
    expect((form.querySelector('select[name="dial"]') as HTMLSelectElement).value).toBe('TR');
    expect(form.querySelector('#f-hire-full-consent')).toHaveAttribute('type', 'checkbox'); // W79
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
  });
});

describe('Hero', () => {
  it('names the h1 the LCP slot while hw-hero is a placeholder (D26); own crumbs (W109); metric pills (W1)', () => {
    const { container } = renderWithIntl(hero);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('data-testid', 'page-h1');
    expect(h1).toHaveAttribute('data-lcp-slot', 'h1');
    expect(h1.textContent).toBe(`${tf('hire.021')} ${tf('hire.022')} ${tf('hire.023')}`);
    expect(container.querySelectorAll('[data-lcp-slot]')).toHaveLength(1);
    expect(container.querySelector('[data-placeholder="hw-hero"]')).not.toHaveAttribute(
      'data-lcp-slot',
    );
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
