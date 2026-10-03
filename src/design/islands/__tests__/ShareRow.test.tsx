import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShareRow } from '../ShareRow';

const labels = {
  heading: 'Share',
  share: 'Share…',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  x: 'X',
  copy: 'Copy link',
  copied: 'Link copied',
};
const url = 'https://www.jobsadmire.com/en/blog/turkey-work-permit-process-employer-guide';

afterEach(() => {
  vi.restoreAllMocks();
  // jsdom ships neither API; the tests define them as configurable own properties and drop them again.
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'clipboard');
});

describe('ShareRow', () => {
  it('offers intent links and copies the URL with a status announcement', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<ShareRow url={url} title="Work permit guide" labels={labels} />);
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/?text=${encodeURIComponent(`Work permit guide ${url}`)}`,
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    );
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('target', '_blank');
    expect(screen.queryByRole('button', { name: 'Share…' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(writeText).toHaveBeenCalledWith(url);
    expect(await screen.findByText('Link copied')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Link copied');
  });

  it('uses the Web Share API when the browser has it', () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    render(<ShareRow url={url} title="Work permit guide" labels={labels} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share…' }));
    expect(share).toHaveBeenCalledWith({ title: 'Work permit guide', url });
  });

  it.each([
    [
      'refuses',
      () => {
        const writeText = vi.fn().mockRejectedValue(new Error('NotAllowedError'));
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
      },
    ],
    ['is missing', () => {}],
  ])('announces copyFailed when the clipboard %s (W133)', async (_case, setup) => {
    setup();
    render(
      <ShareRow
        url={url}
        title="Work permit guide"
        labels={{ ...labels, copyFailed: 'Could not copy the link' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(await screen.findByText('Could not copy the link')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Could not copy the link');
  });

  it('stays silent on a failed copy when the page gives no copyFailed label', async () => {
    render(<ShareRow url={url} title="Work permit guide" labels={labels} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  describe('with fake timers', () => {
    afterEach(() => {
      vi.useRealTimers();
    });
    const copyTwice = async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
      render(<ShareRow url={url} title="Work permit guide" labels={labels} />);
      const status = screen.getByRole('status');
      const copy = screen.getByRole('button', { name: 'Copy link' });
      await act(async () => {
        fireEvent.click(copy);
      });
      expect(status).toHaveTextContent('Link copied');
      const first = status.firstChild;
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      await act(async () => {
        fireEvent.click(copy);
      });
      return { status, first };
    };

    it('clears the status 2 s after the latest copy, not the first (W133)', async () => {
      const { status } = await copyTwice();
      act(() => {
        vi.advanceTimersByTime(1000); // 2.5 s after the first copy, 1 s after the latest
      });
      expect(status).toHaveTextContent('Link copied');
      act(() => {
        vi.advanceTimersByTime(1000); // 2 s after the latest
      });
      expect(status).toBeEmptyDOMElement();
    });

    it('re-announces a repeat copy with a fresh node in the live region (W133)', async () => {
      const { status, first } = await copyTwice();
      expect(status).toHaveTextContent('Link copied');
      expect(first).not.toBeNull();
      expect(status.firstChild).not.toBe(first);
    });
  });
});
