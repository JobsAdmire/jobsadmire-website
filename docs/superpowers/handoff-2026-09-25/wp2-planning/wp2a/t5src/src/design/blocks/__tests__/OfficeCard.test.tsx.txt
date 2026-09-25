import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfficeCard } from '../OfficeCard';
import { getOffice } from '@/content/collections';
import { BLOCK_STRINGS, testBundle } from '@/test/bundle';
import { renderWithIntl } from '@/test/render';

// Rows satisfy T0b's `OfficeSchema` exactly (`src/content/collections.ts`): every text field
// is an id, `hours.days` are JS getDay() values (0 = Sunday … 6 = Saturday, W43).
const offices = [
  {
    key: 'antalya',
    kind: 'hq',
    cityId: 'o.city',
    labelId: 'o.label',
    addressId: 'o.addr',
    addressLine2Id: 'o.addr2',
    hoursId: 'o.hours',
    footerLabelId: 'o.foot',
    phone: '+905011240340',
    whatsapp: '905011240340',
    email: 'info@jobsadmire.com',
    hours: { tz: 'Europe/Istanbul', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
    mapUrl: 'https://maps.google.com/?q=Antalya',
  },
];
const bundle = testBundle({
  strings: {
    ...BLOCK_STRINGS,
    'o.city': 'Antalya, Türkiye',
    'o.label': 'Merkez ofis',
    'o.label2': 'Tedarik ofisi',
    'o.addr': 'Adnan Menderes Blv. 7/6',
    'o.addr2': 'Muratpaşa, Antalya',
    'o.hours': 'Pzt–Cum · 09:00–18:00 (TRT)',
    'o.foot': 'Antalya · Merkez ofis',
  },
  collections: { offices },
});
// The parsed row through T0b's own accessor, never the literal: the schema is the contract.
const office = getOffice(bundle, 'antalya');

describe('OfficeCard', () => {
  it('renders city, kind, address, hours and the four contact doors', () => {
    renderWithIntl(
      <OfficeCard bundle={bundle} locale="tr" office={office}>
        <span data-testid="status">Açık</span>
      </OfficeCard>,
      { locale: 'tr' },
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Antalya, Türkiye' })).toBeInTheDocument();
    expect(screen.getByText('Merkez ofis')).toBeInTheDocument();
    expect(screen.getByText(/Adnan Menderes Blv\. 7\/6/)).toBeInTheDocument();
    expect(screen.getByText(/Muratpaşa, Antalya/)).toBeInTheDocument();
    expect(screen.getByText('Pzt–Cum · 09:00–18:00 (TRT)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+905011240340' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    expect(screen.getByRole('link', { name: "WhatsApp'tan yazın" })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/905011240340\?text=/),
    );
    expect(screen.getByRole('link', { name: 'info@jobsadmire.com' })).toHaveAttribute(
      'href',
      'mailto:info@jobsadmire.com',
    );
    const map = screen.getByRole('link', { name: 'Yol tarifi alın' });
    expect(map).toHaveAttribute('href', 'https://maps.google.com/?q=Antalya');
    expect(map).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('labels a sourcing office from its own labelId (W7)', () => {
    renderWithIntl(
      <OfficeCard
        bundle={bundle}
        locale="en"
        office={{ ...office, kind: 'sourcing', labelId: 'o.label2' }}
      />,
      { locale: 'en' },
    );
    expect(screen.getByText('Tedarik ofisi')).toHaveClass('text-success-text');
  });
});
