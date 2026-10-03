import { createEvent, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import { EVIDENCE_MAX_BYTES, type EvidenceUploadResult } from '../../_lib/evidence';
import { EvidenceUpload } from '../EvidenceUpload';

const file = (name: string, type = 'image/png', size = 10) =>
  new File([new Uint8Array(size)], name, { type });

function deferred() {
  let resolve!: (r: EvidenceUploadResult) => void;
  const promise = new Promise<EvidenceUploadResult>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function setup(upload: (data: FormData) => Promise<EvidenceUploadResult>) {
  const spy = vi.fn(upload);
  renderWithIntl(
    <form data-testid="report">
      <EvidenceUpload upload={spy} />
    </form>,
    { locale: 'en' },
  );
  const input = screen.getByLabelText('Evidence files') as HTMLInputElement;
  const pick = (files: File[]) => fireEvent.change(input, { target: { files } });
  const keys = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="evidenceKeys"]'),
    ).map((i) => i.value);
  return { spy, input, pick, keys, form: screen.getByTestId('report') as HTMLFormElement };
}

describe('EvidenceUpload — one file per server-action call (W73/W101/W116)', () => {
  it('uploads each file alone, one after another, and keeps each key in a hidden evidenceKeys input', async () => {
    const first = deferred();
    const answers = [
      first.promise,
      Promise.resolve({ ok: true, key: 'website-fraud/b.pdf' } as const),
    ];
    const { spy, input, pick, keys } = setup(() => answers.shift()!);
    expect(input).not.toHaveAttribute('name'); // the bytes never ride the report
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp,application/pdf');
    pick([file('a.png'), file('b.pdf', 'application/pdf')]);
    expect(await screen.findByText('Uploading a.png…')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(1); // the second waits for the first
    first.resolve({ ok: true, key: 'website-fraud/a.png' });
    await waitFor(() => expect(keys()).toEqual(['website-fraud/a.png', 'website-fraud/b.pdf']));
    expect(spy).toHaveBeenCalledTimes(2);
    for (const [body] of spy.mock.calls) {
      const parts = Array.from((body as FormData).entries());
      expect(parts.map(([k]) => k)).toEqual(['file']);
    }
    expect(screen.getByText('a.png attached')).toBeInTheDocument();
  });

  it('refuses an over-cap file and a declared non-evidence type in the browser — no call', () => {
    const { spy, pick, keys } = setup(async () => ({ ok: true, key: 'website-fraud/x.png' }));
    pick([
      file('big.png', 'image/png', EVIDENCE_MAX_BYTES + 1),
      file('notes.txt', 'text/plain'),
      file('empty.png', 'image/png', 0),
    ]);
    expect(
      screen.getByText('big.png is larger than 3 MB. Choose a smaller file.'),
    ).toBeInTheDocument();
    expect(screen.getByText('notes.txt is not a JPEG, PNG, WEBP or PDF file.')).toBeInTheDocument();
    // M1 (W204): a 0-byte pick is listed as refused, never dropped silently
    expect(screen.getByText(/empty\.png/)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
    expect(keys()).toEqual([]);
  });

  it('a door failure or a failed call reads failed, a door refusal reads refused; no key is kept', async () => {
    const answers: (() => Promise<EvidenceUploadResult>)[] = [
      async () => ({ ok: false, reason: 'door' }),
      async () => ({ ok: false, reason: 'file' }),
      async () => {
        throw new Error('network');
      },
    ];
    const { pick, keys } = setup(() => answers.shift()!());
    pick([file('a.png'), file('b.png'), file('c.png')]);
    expect(
      await screen.findByText(
        'a.png could not be uploaded right now. Send the report without it and share the file on WhatsApp.',
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('b.png was not accepted. Check its type and size.'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        'c.png could not be uploaded right now. Send the report without it and share the file on WhatsApp.',
      ),
    ).toBeInTheDocument();
    expect(keys()).toEqual([]);
  });

  it('three files at most: a fourth is not uploaded and the limit is announced', async () => {
    let n = 0;
    const { spy, pick, keys } = setup(async () => ({ ok: true, key: `website-fraud/k${++n}.png` }));
    pick([file('1.png'), file('2.png'), file('3.png'), file('4.png')]);
    expect(screen.getByText('Up to 3 files can be attached.')).toBeInTheDocument();
    await waitFor(() => expect(keys()).toHaveLength(3));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(screen.queryByText(/4\.png/)).toBeNull();
    // M2 (W204): removing a file ends the "up to 3" notice
    fireEvent.click(screen.getAllByRole('button', { name: /1\.png/ })[0]);
    expect(screen.queryByText('Up to 3 files can be attached.')).toBeNull();
  });

  it('removing an attached file drops its key', async () => {
    const { pick, keys } = setup(async () => ({ ok: true, key: 'website-fraud/a.png' }));
    pick([file('a.png')]);
    await waitFor(() => expect(keys()).toEqual(['website-fraud/a.png']));
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    expect(keys()).toEqual([]);
    expect(screen.queryByText('a.png attached')).toBeNull();
  });

  it('holds the report while a file is uploading, then lets it through', async () => {
    const pending = deferred();
    const { pick, form, keys } = setup(() => pending.promise);
    pick([file('a.png')]);
    await screen.findByText('Uploading a.png…');
    const held = createEvent.submit(form);
    fireEvent(form, held);
    expect(held.defaultPrevented).toBe(true);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A file is still uploading. Send the report once it has finished.',
    );
    pending.resolve({ ok: true, key: 'website-fraud/a.png' });
    await waitFor(() => expect(keys()).toEqual(['website-fraud/a.png']));
    expect(screen.queryByRole('alert')).toBeNull();
    const released = createEvent.submit(form);
    fireEvent(form, released);
    expect(released.defaultPrevented).toBe(false);
  });
});
