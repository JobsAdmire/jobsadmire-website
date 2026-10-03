import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LicenceBlock, type LicenceRow } from '../_components/LicenceBlock';

const PENDING: LicenceRow = { slot: 'licence-pdf-iskur-permit', title: 'İŞKUR permit', href: null };
const FILLED: LicenceRow = {
  slot: 'licence-pdf-company-profile',
  title: 'Company profile (PDF)',
  href: '/docs/licence/company-profile.pdf',
};
const COPY = {
  title: 'Licence and documents',
  body: 'The İŞKUR permit and its supporting documents, as PDFs.',
  legal: 'İŞKUR permit No. 1730 · Tax No: 48422122',
  openLabel: 'Open PDF',
  pendingLabel: 'PDF being added',
};

describe('LicenceBlock (#lisans, D26)', () => {
  it('is the #lisans region, named by its heading, carrying the legal line verbatim', () => {
    render(<LicenceBlock {...COPY} rows={[PENDING]} />);
    const region = screen.getByRole('region', { name: 'Licence and documents' });
    expect(region).toHaveAttribute('id', 'lisans');
    expect(region).toHaveTextContent('İŞKUR permit No. 1730 · Tax No: 48422122');
  });

  it('renders a missing file as a named placeholder row, never a link (W55, D20)', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[PENDING]} />);
    const row = container.querySelector<HTMLElement>(
      '[data-placeholder="licence-pdf-iskur-permit"]',
    );
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).queryByRole('link')).toBeNull();
    expect(row).toHaveTextContent('PDF being added');
  });

  it('renders a supplied file as a described link and drops the placeholder mark', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[FILLED]} />);
    expect(container.querySelector('[data-placeholder]')).toBeNull();
    const link = screen.getByRole('link', { name: 'Open PDF' });
    expect(link).toHaveAttribute('href', '/docs/licence/company-profile.pdf');
    expect(link).toHaveAccessibleDescription('Company profile (PDF)');
  });
});
