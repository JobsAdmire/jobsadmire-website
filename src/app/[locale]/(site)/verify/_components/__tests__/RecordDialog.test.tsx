import { fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { RECORD_DIALOG_ENABLED } from '../../_lib/flags';
import { FOUNDER_REP } from '../../_lib/__tests__/fixtures';
import RecordDialog, { type RecordLabels } from '../RecordDialog';

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

function renderDialog(
  record = FOUNDER_REP,
  onClose = vi.fn(),
  extra: Partial<Parameters<typeof RecordDialog>[0]> = {},
) {
  renderWithIntl(
    <RecordDialog
      open
      record={record}
      labels={labels}
      recordUrl="/en/verify?id=JA-REP-001"
      whatsappNumber="905011240340"
      onClose={onClose}
      {...extra}
    />,
    { locale: 'en' },
  );
  return onClose;
}

describe('RecordDialog (the v1.1 scaffold)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is off in Phase A', () => {
    expect(RECORD_DIALOG_ENABLED).toBe(false);
  });

  it('is a named dialog: status header, identity, meta, copy link, close', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onClose = renderDialog();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Founder Example');
    expect(dialog).toHaveTextContent('JA-REP-001');
    expect(dialog).toHaveTextContent('Authorised');
    expect(dialog).toHaveTextContent('Sole signatory');
    expect(dialog).toHaveTextContent('No expiry');
    expect(dialog).toHaveTextContent('Antalya');
    // the company number is the official contact, as a call link
    expect(screen.getByRole('link', { name: '+905011240340' })).toHaveAttribute(
      'href',
      'tel:+905011240340',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy record link' }));
    expect(writeText).toHaveBeenCalledWith('http://localhost:3000/en/verify?id=JA-REP-001');
    expect(await screen.findByRole('status')).toHaveTextContent('Link copied ✓');
    fireEvent.click(screen.getByRole('button', { name: 'Close the record' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('W95: "Something is wrong" is a bare wa.me href; the record id joins the chat on click', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderDialog();
    const wrong = screen.getByRole('link', { name: 'Something is wrong →' });
    expect(wrong).toHaveAttribute('href', 'https://wa.me/905011240340');
    fireEvent.click(wrong);
    expect(decodeURIComponent((open.mock.calls[0] as [string])[0])).toContain(
      'Hello JobsAdmire, I want to check something about JA-REP-001',
    );
  });

  it('never fails open: a former record shows the former label and no signatory pill', () => {
    renderDialog({ ...FOUNDER_REP, status: 'former', canSign: false });
    expect(screen.getByRole('dialog')).toHaveTextContent('No longer authorised');
    expect(screen.queryByText('Sole signatory')).toBeNull();
  });

  it('the founder view: a photo slot, the May do / May never lists, only the cells with a value, no copy link without a permanent URL', () => {
    renderDialog(
      { ...FOUNDER_REP, city: '', country: '', languages: [], reportsTo: null, since: null },
      vi.fn(),
      {
        recordUrl: null,
        photo: <span data-testid="photo-slot" />,
        caps: { can: ['Sign service agreements'], never: ['Ask a worker for any payment'] },
      },
    );
    const dialog = screen.getByRole('dialog');
    expect(screen.getByTestId('photo-slot')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'May do' })).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Sign service agreements');
    expect(screen.getByRole('heading', { level: 3, name: 'May never' })).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Ask a worker for any payment');
    for (const empty of ['Languages', 'Reports to', 'With JobsAdmire', 'Desk'])
      expect(dialog).not.toHaveTextContent(empty);
    expect(dialog).toHaveTextContent('Authorised until');
    expect(dialog).not.toHaveTextContent('—');
    expect(screen.queryByRole('button', { name: 'Copy record link' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Something is wrong →' })).toBeInTheDocument();
  });
});
