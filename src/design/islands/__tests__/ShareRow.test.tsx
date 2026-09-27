import { fireEvent, render, screen } from '@testing-library/react';
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
});
