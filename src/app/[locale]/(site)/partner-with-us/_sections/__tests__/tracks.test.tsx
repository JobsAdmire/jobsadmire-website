import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BundleSchema, type Bundle } from '../../../../../../../contract/website-bundle.v1';
import { getCollection } from '@/content/collections';
import { makeTf } from '@/content/pure';
import tr from '@/messages/tr.json';
import { renderWithIntl } from '@/test/render';
import { countryOptions } from '../../_lib/country-options';
import { HrAgencyForm, InstituteForm, SourcingPartnerForm, type FormDoor } from '../PartnerForms';
import { TrackPanel } from '../TrackPanel';
import { Tracks } from '../Tracks';

// The 'use server' module is replaced: jsdom renders the shells and never posts — Cycle 2 pins
// the actions, the Cycle 7 gate runs the real round trip.
vi.mock('../../actions', () => ({
  submitHrAgency: vi.fn(async () => ({ status: 'idle' })),
  submitSourcingPartner: vi.fn(async () => ({ status: 'idle' })),
  submitInstitute: vi.fn(async () => ({ status: 'idle' })),
}));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/ortak-olun',
}));

const TR: Bundle = BundleSchema.parse(
  JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'content', 'local', 'bundle.tr.json'), 'utf8'),
  ),
);
const tf = makeTf(TR, 'tr');
const door: FormDoor = {
  turnstileSiteKey: null,
  whatsappNumber: '905011240340',
  contact: {
    phone: '+905011240340',
    phoneDisplay: '+90 501 124 03 40',
    email: 'info@jobsadmire.com',
  },
};
const countries = countryOptions(
  getCollection(TR, 'sourceCountries'),
  getCollection(TR, 'countries'),
  'tr',
);
const tokens = (el: Element | null) => (el?.getAttribute('class') ?? '').split(/\s+/);
/** The visible label of the control with this id, without the required asterisk. */
const labelOf = (id: string) =>
  document.querySelector(`label[for="${id}"]`)?.textContent?.replace(/\s*\*$/, '');
function expectLabels(scope: string, expected: [string, string][]) {
  for (const [name, text] of expected) {
    expect(document.querySelector(`[name="${name}"]`)).toHaveAttribute('id', `f-${scope}-${name}`);
    expect(labelOf(`f-${scope}-${name}`), name).toBe(text);
  }
}

describe('Tracks', () => {
  it('is section#tracks (the W17 header-CTA target) with its heading, the chooser and the HR panel', () => {
    const { container } = renderWithIntl(
      <Tracks
        tf={tf}
        panels={{
          hr: (
            <TrackPanel track="hr" tf={tf}>
              <HrAgencyForm locale="tr" tf={tf} door={door} />
            </TrackPanel>
          ),
          sourcing: <div data-testid="panel-sourcing" />,
          institute: <div data-testid="panel-institute" />,
        }}
      />,
    );
    const section = container.querySelector('section#tracks');
    expect(section).not.toBeNull();
    expect(tokens(section)).toContain('scroll-mt-20');
    expect(screen.getByRole('heading', { level: 2, name: tf('partner.061') })).toBeInTheDocument();
    const group = screen.getByRole('radiogroup', { name: tf('partner.064') });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: tf('partner.038') })).toBeChecked();
    expect(screen.getByRole('radio', { name: tf('partner.040') })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: tf('partner.068') })).not.toBeChecked();
    expect(screen.getByTestId('partner-form-hr')).toHaveAttribute('data-form-key', 'hire');
    expect(screen.queryByTestId('panel-sourcing')).toBeNull();
  });
});

describe('TrackPanel', () => {
  it('lays out eyebrow, h2, lead, four benefits, three asks and a phone-only jump link to its form card', () => {
    renderWithIntl(
      <TrackPanel track="sourcing" tf={tf}>
        <div />
      </TrackPanel>,
    );
    const panel = screen.getByTestId('partner-panel-sourcing');
    expect(within(panel).getByRole('heading', { level: 2 })).toHaveTextContent(tf('partner.100'));
    expect(within(panel).getByText(tf('partner.099'))).toBeInTheDocument();
    const [benefits, asks] = within(panel).getAllByRole('list');
    expect(within(benefits).getAllByRole('listitem')).toHaveLength(4);
    expect(
      within(asks)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['partner.110', 'partner.111', 'partner.112'].map(tf));
    const jump = within(panel).getByRole('link', { name: tf('partner.074') });
    expect(jump).toHaveAttribute('href', '#apply-agent');
    expect(tokens(jump)).toContain('md:hidden');
  });

  it('fills the HR benefits from the metrics (W1/W87: {countries}, {homepageReplyHours})', () => {
    renderWithIntl(
      <TrackPanel track="hr" tf={tf}>
        <div />
      </TrackPanel>,
    );
    const panel = screen.getByTestId('partner-panel-hr');
    expect(panel).toHaveTextContent('13 ülkeden aday listeleri');
    expect(panel).toHaveTextContent('24 saat');
    expect(panel).not.toHaveTextContent(/\{[a-zA-Z]+\}/);
  });
});

describe('the three form shells (W3/W16/W79/W115)', () => {
  it('HR agency: the hire shell with its own id scope, the package labels, the consent tick, no country input', () => {
    renderWithIntl(<HrAgencyForm locale="tr" tf={tf} door={door} />);
    const form = screen.getByTestId('partner-form-hr');
    expect(form).toHaveAttribute('data-form-key', 'hire');
    expectLabels('partner-hr', [
      ['company', tf('partner.093')],
      ['name', tf('partner.094')],
      ['city', tf('partner.095')],
      ['email', tf('partner.096')],
      ['phone', tf('partner.097')],
      ['message', tf('partner.098')],
    ]);
    expect(form.querySelector('#f-partner-hr-consent')).toHaveAttribute('type', 'checkbox');
    expect(form.querySelector('[name="licenceDeclaration"]')).toBeNull();
    expect(form.querySelector('[name="country"]')).toBeNull(); // TR comes from the mapper (W3)
    expect(within(form).getByRole('button', { name: tf('partner.092') })).toHaveAttribute(
      'type',
      'submit',
    );
    const card = document.getElementById('apply-hr');
    expect(card).toContainElement(form);
    expect(within(card as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent(
      tf('partner.086'),
    );
    expect(card).toHaveTextContent('4 iş saati');
  });

  it('sourcing partner: the ISO-2 select (64 rows, source countries first), licence, candidatesPerYear, the declaration beside the consent', () => {
    renderWithIntl(<SourcingPartnerForm locale="tr" tf={tf} door={door} countries={countries} />);
    const form = screen.getByTestId('partner-form-sourcing');
    expect(form).toHaveAttribute('data-form-key', 'partner');
    expectLabels('partner-sourcing', [
      ['company', tf('partner.093')],
      ['name', tf('partner.094')],
      ['country', tf('partner.115')],
      ['licence', tf('partner.116')],
      ['email', tf('partner.117')],
      ['phone', tf('partner.097')],
      ['candidatesPerYear', tr.sys.form.labels.candidatesPerYear],
      ['trades', tf('partner.118')],
    ]);
    const select = form.querySelector('select[name="country"]') as HTMLSelectElement;
    expect(select.options).toHaveLength(65); // sys.form.placeholders.select + 64 rows (W111)
    expect(select.options[0].value).toBe('');
    expect(select.options[1].value).toBe('PK');
    expect(form.querySelector('#f-partner-sourcing-licenceDeclaration')).toHaveAttribute(
      'type',
      'checkbox',
    );
    expect(labelOf('f-partner-sourcing-licenceDeclaration')).toBe(tf('partner.114'));
    expect(form.querySelector('#f-partner-sourcing-consent')).toHaveAttribute('type', 'checkbox');
    expect(form.querySelector('[name="phone"]')).toHaveAttribute('placeholder', '');
    expect(document.getElementById('apply-agent')).toContainElement(form);
  });

  it('institute: its own name label, an optional city beside the country select, no licence and no declaration', () => {
    renderWithIntl(<InstituteForm locale="tr" tf={tf} door={door} countries={countries} />);
    const form = screen.getByTestId('partner-form-institute');
    expect(form).toHaveAttribute('data-form-key', 'partner');
    expectLabels('partner-institute', [
      ['company', tf('partner.134')],
      ['name', tf('partner.094')],
      ['city', tr.sys.form.labels.city],
      ['country', tf('partner.115')],
      ['email', tf('partner.117')],
      ['phone', tf('partner.097')],
      ['candidatesPerYear', tr.sys.form.labels.candidatesPerYear],
      ['trades', tf('partner.136')],
    ]);
    expect(form.querySelector('[name="city"]')).not.toBeRequired();
    expect(form.querySelector('[name="licence"]')).toBeNull();
    expect(form.querySelector('[name="licenceDeclaration"]')).toBeNull();
    expect(form.querySelector('#f-partner-institute-consent')).toHaveAttribute('type', 'checkbox');
    expect(document.getElementById('apply-inst')).toContainElement(form);
  });
});
