import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { FOUNDER_REP } from '../../_lib/__tests__/fixtures';
import type { RecordLabels } from '../RecordDialog';

// The dialog chunk, loaded synchronously here (the page loads it on the first click).
vi.mock('next/dynamic', async () => {
  const mod = await import('../RecordDialog');
  return { default: () => mod.default };
});

import { FounderRecordButton } from '../FounderRecordButton';

const labels: RecordLabels = {
  badgeQrHint: 'Scan the QR on their badge — it must open this same record.',
  authorisedUntil: 'Authorised until',
  noExpiry: 'No expiry',
  contact: 'Official contact',
  languages: 'Languages',
  reportsTo: 'Reports to',
  withJobsAdmire: 'With JobsAdmire',
  desk: 'Desk',
  mayDo: 'May do',
  mayNever: 'May never',
  soleSignatory: 'Sole signatory',
  copyLink: 'Copy record link',
  copied: 'Link copied ✓',
  wrong: 'Something is wrong →',
  close: 'Close the record',
  status: { active: 'Authorised', suspended: 'Suspended', former: 'No longer authorised' },
  whatsappIntro: 'Hello JobsAdmire, I want to check something about',
};

function setup(linkable: boolean) {
  renderWithIntl(
    <FounderRecordButton
      label="Open record"
      className="x"
      record={FOUNDER_REP}
      labels={labels}
      caps={{ can: ['Sign service agreements'], never: ['Keep original passports'] }}
      photo={<span data-testid="photo" />}
      linkable={linkable}
      whatsappNumber="905011240340"
    />,
    { locale: 'en' },
  );
}

describe('FounderRecordButton — "Open record" opens the founder’s record dialog (S3.1)', () => {
  it('Phase A: the dialog with the photo and the lists, no copy link (no permanent URL); Escape closes it', () => {
    setup(false);
    expect(screen.queryByRole('dialog')).toBeNull();
    const button = screen.getByRole('button', { name: 'Open record' });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    fireEvent.click(button);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Founder Example');
    expect(dialog).toHaveTextContent('JA-REP-001');
    expect(dialog).toHaveTextContent('Sign service agreements');
    expect(dialog).toHaveTextContent('Keep original passports');
    expect(screen.getByTestId('photo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy record link' })).toBeNull();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('with a permanent record URL (v1.1) the copy link is offered', () => {
    setup(true);
    fireEvent.click(screen.getByRole('button', { name: 'Open record' }));
    expect(screen.getByRole('button', { name: 'Copy record link' })).toBeInTheDocument();
  });
});
