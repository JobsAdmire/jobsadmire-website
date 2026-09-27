import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ImageSlot } from '../ImageSlot';

// A pass-through spy: every test still renders the real next/image; this one records the
// loading props it was handed (M3 — `priority` is deprecated in Next 16.3.5, `preload` replaces
// it, and the two render identically, so only the props can tell them apart).
const nextImage = vi.hoisted(() => ({ calls: [] as { preload?: boolean; priority?: boolean }[] }));
vi.mock('next/image', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/image')>();
  const Real = actual.default;
  function SpyImage(props: ComponentProps<typeof Real>) {
    nextImage.calls.push({ preload: props.preload, priority: props.priority });
    return <Real {...props} />;
  }
  return { ...actual, default: SpyImage };
});

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

  it('maps the frozen lcp/priority props to next/image `preload`, never the deprecated `priority` (M3)', () => {
    nextImage.calls.length = 0;
    render(
      <>
        <ImageSlot
          slot="m3-lcp"
          lcp
          src="/brand/ja-mark.png?m3=lcp"
          alt="LCP"
          width={88}
          height={88}
        />
        <ImageSlot
          slot="m3-priority"
          priority
          src="/brand/ja-mark.png?m3=priority"
          alt="Priority"
          width={88}
          height={88}
        />
        <ImageSlot
          slot="m3-lazy"
          src="/brand/ja-mark.png?m3=lazy"
          alt="Lazy"
          width={88}
          height={88}
        />
      </>,
    );
    expect(nextImage.calls).toEqual([
      { preload: true, priority: undefined },
      { preload: true, priority: undefined },
      { preload: false, priority: undefined },
    ]);
    // What next/image emits for a preloaded image in jsdom: no `loading` attribute (eager, where
    // the rest are `loading="lazy"`) and a hoisted <link rel="preload" as="image"> for its srcset.
    const preloaded = (img: HTMLElement) =>
      Array.from(document.head.querySelectorAll('link[rel="preload"][as="image"]')).some(
        (link) => link.getAttribute('imagesrcset') === img.getAttribute('srcset'),
      );
    for (const name of ['LCP', 'Priority']) {
      const img = screen.getByRole('img', { name });
      expect(img).not.toHaveAttribute('loading');
      expect(preloaded(img)).toBe(true);
    }
    const lazy = screen.getByRole('img', { name: 'Lazy' });
    expect(lazy).toHaveAttribute('loading', 'lazy');
    expect(preloaded(lazy)).toBe(false);
  });
});
