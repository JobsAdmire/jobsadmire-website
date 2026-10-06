import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LicenceBlock, type LicenceRow, type ProfileDownload } from '../_components/LicenceBlock';

const PENDING: LicenceRow = { slot: 'licence-pdf-iskur-permit', title: 'İŞKUR permit', href: null };
const FILLED: LicenceRow = {
  slot: 'licence-pdf-iskur-annex',
  title: 'İŞKUR permit — annex',
  href: '/docs/licence/iskur-annex.pdf',
};
const PROFILE_PENDING: ProfileDownload = {
  slot: 'licence-pdf-company-profile',
  label: 'Download Company Profile →',
  href: null,
  soonNote: 'The company profile PDF is coming soon.',
};
const COPY = {
  title: 'Licence and documents',
  body: 'The İŞKUR permit and its supporting documents, as PDFs.',
  legal: 'İŞKUR permit No. 1730 · Tax No: 48422122',
  openLabel: 'Open PDF',
  pendingLabel: 'PDF being added',
  profile: PROFILE_PENDING,
};

describe('LicenceBlock (#lisans, D26 — the design profile strip, About l. 898–905)', () => {
  it('is the #lisans region, named by its heading, carrying the legal line verbatim', () => {
    render(<LicenceBlock {...COPY} rows={[PENDING]} />);
    const region = screen.getByRole('region', { name: 'Licence and documents' });
    expect(region).toHaveAttribute('id', 'lisans');
    expect(region).toHaveTextContent('İŞKUR permit No. 1730 · Tax No: 48422122');
  });

  it('shows the profile download disabled, named as a placeholder and described by the note, while there is no PDF', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[]} />);
    const button = screen.getByRole('button', { name: 'Download Company Profile →' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-placeholder', 'licence-pdf-company-profile');
    expect(button).toHaveAccessibleDescription('The company profile PDF is coming soon.');
    expect(container.querySelector('a')).toBeNull();
  });

  it('turns the profile download into a PDF link once the file is set (no note, no placeholder)', () => {
    const { container } = render(
      <LicenceBlock
        {...COPY}
        profile={{ ...PROFILE_PENDING, href: '/docs/licence/company-profile.pdf' }}
        rows={[]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Download Company Profile →' });
    expect(link).toHaveAttribute('href', '/docs/licence/company-profile.pdf');
    expect(link).toHaveAttribute('type', 'application/pdf');
    // "İndir" is a download (W246); the design's l. 903 link stays in the same tab
    expect(link).toHaveAttribute('download');
    expect(link).not.toHaveAttribute('target');
    expect(screen.queryByText('The company profile PDF is coming soon.')).toBeNull();
    expect(container.querySelector('[data-placeholder]')).toBeNull();
  });

  it('renders a missing document as a named placeholder row, never a link (W55, D20)', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[PENDING]} />);
    const row = container.querySelector<HTMLElement>(
      '[data-placeholder="licence-pdf-iskur-permit"]',
    );
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).queryByRole('link')).toBeNull();
    expect(row).toHaveTextContent('PDF being added');
  });

  it('renders a supplied document as a described link and drops its placeholder mark', () => {
    const { container } = render(<LicenceBlock {...COPY} rows={[FILLED]} />);
    expect(container.querySelector('[data-placeholder="licence-pdf-iskur-annex"]')).toBeNull();
    const link = screen.getByRole('link', { name: 'Open PDF' });
    expect(link).toHaveAttribute('href', '/docs/licence/iskur-annex.pdf');
    expect(link).toHaveAccessibleDescription('İŞKUR permit — annex');
    // W246: a document opens its PDF in a new tab
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('mixes supplied and pending rows: one link per file, one placeholder per missing slot', () => {
    const CERT: LicenceRow = {
      slot: 'licence-pdf-iso-21001',
      title: 'ISO 21001:2018 certificate (BELCERT, 04.04.2024 – 04.04.2025)',
      href: '/docs/licence/jobsadmire-iso-21001-2018.pdf',
    };
    const { container } = render(<LicenceBlock {...COPY} rows={[FILLED, PENDING, CERT]} />);
    expect(screen.getAllByRole('link', { name: 'Open PDF' })).toHaveLength(2);
    expect(container.querySelectorAll('li[data-placeholder]')).toHaveLength(1);
    expect(screen.getByText(CERT.title)).toBeInTheDocument();
  });
});
