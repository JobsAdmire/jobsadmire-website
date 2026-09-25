import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageSlot } from '../ImageSlot';

describe('ImageSlot (W27 / D26 markup contract)', () => {
  it('renders the named placeholder when no asset is given', () => {
    render(<ImageSlot slot="hw-hero" alt="Workers on site" width={640} height={400} />);
    const box = screen.getByRole('img', { name: 'Workers on site' });
    expect(box).toHaveAttribute('data-placeholder', 'hw-hero');
    expect(box).not.toHaveAttribute('data-lcp-slot');
    expect(box.style.aspectRatio).toBe('640 / 400');
  });

  it('marks the LCP slot on the placeholder too, so the launch gate can refuse it', () => {
    const { container } = render(<ImageSlot slot="v4-hero" lcp alt="" width={4} height={3} />);
    const box = container.querySelector('[data-placeholder="v4-hero"]')!;
    expect(box).toHaveAttribute('data-lcp-slot', 'v4-hero');
    expect(box).toHaveAttribute('aria-hidden', 'true'); // decorative: empty alt
    expect(box).not.toHaveAttribute('role');
  });

  it('renders next/image with the asset, carrying data-lcp-slot and never data-placeholder', () => {
    render(
      <ImageSlot
        slot="v4-hero"
        lcp
        src="/brand/ja-mark.png"
        alt="JobsAdmire"
        width={88}
        height={88}
      />,
    );
    const img = screen.getByRole('img', { name: 'JobsAdmire' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('data-lcp-slot', 'v4-hero');
    expect(img).not.toHaveAttribute('data-placeholder');
  });
});
