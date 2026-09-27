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

  // W129: the slot owns its box. The ratio is an inline `aspect-ratio`, never a class built
  // from props (Tailwind only generates classes it finds whole in the source).
  const BOX = ['w-full', 'h-auto', 'object-cover'];

  it('gives the placeholder and the image the same box: full width, the width/height ratio', () => {
    const { container } = render(
      <>
        <ImageSlot slot="featured" alt="" width={640} height={202} className="rounded-xs" />
        <ImageSlot
          slot="featured-photo"
          src="/brand/ja-mark.png"
          alt="JobsAdmire"
          width={640}
          height={202}
          className="rounded-xs"
        />
      </>,
    );
    const placeholder = container.querySelector<HTMLElement>('[data-placeholder="featured"]')!;
    const img = screen.getByRole('img', { name: 'JobsAdmire' });
    for (const el of [placeholder, img]) {
      expect(el).toHaveClass(...BOX, 'rounded-xs');
      expect(el.style.aspectRatio).toBe('640 / 202');
    }
    // next/image still gets the intrinsic size from the props (no CLS, the srcset widths).
    expect(img).toHaveAttribute('width', '640');
    expect(img).toHaveAttribute('height', '202');
  });
});
