import { screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl as render } from '@/test/render';
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

  it('shows a labelled, inert placeholder: dashed frame, icon, "image to be added" and the slot id (owner 2026-10-05)', () => {
    const { container } = render(
      <ImageSlot slot="hw-hero" alt="Workers on site" width={640} height={400} />,
    );
    const box = container.querySelector<HTMLElement>('[data-placeholder="hw-hero"]')!;
    const frame = box.querySelector<HTMLElement>('[data-placeholder-frame]')!;
    expect(frame).toHaveAttribute('aria-hidden', 'true');
    expect(frame).toHaveClass('pointer-events-none', 'border-dashed');
    expect(frame.querySelector('svg')).not.toBeNull();
    expect(frame).toHaveTextContent('Görsel eklenecek');
    expect(frame).toHaveTextContent('hw-hero');
    // the box's own a11y is unchanged: one labelled img, the frame adds no accessible content
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(box).toHaveAttribute('aria-label', 'Workers on site');
  });

  it('labels the placeholder in English under /en', () => {
    const { container } = render(<ImageSlot slot="a-slot" alt="" width={4} height={3} />, {
      locale: 'en',
    });
    expect(container.querySelector('[data-placeholder-frame]')).toHaveTextContent(
      'Image to be added',
    );
  });

  it('never renders the frame for a real image', () => {
    const { container } = render(
      <ImageSlot slot="real" src="/brand/ja-mark.png" alt="JobsAdmire" width={88} height={88} />,
    );
    expect(container.querySelector('[data-placeholder-frame]')).toBeNull();
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

  // W122 (Task 5 re-review N2): the docblock's caller rule must name every property BOX sets,
  // not just width/aspect — a caller's `h-*`/`object-{fit}` class would silently lose to BOX's
  // own `h-auto`/`object-cover` under Tailwind's alphabetical rule order. `object-{position}`
  // classes (`object-top` etc.) are a different property (object-position) and stay allowed.
  const boxPropertyClasses = (el: Element) =>
    el
      .getAttribute('class')!
      .split(/\s+/)
      .filter(
        (c) =>
          (/^(?:(?:min-|max-)?[wh]|size|aspect)-/.test(c) ||
            /^object-(?:contain|cover|fill|none|scale-down)$/.test(c)) &&
          !BOX.includes(c),
      );

  it('flags a caller class for any property BOX sets, never an object-position (W122)', () => {
    const { container } = render(
      <ImageSlot
        slot="w122"
        alt=""
        width={80}
        height={80}
        className="h-[80px] object-contain object-top rounded-xs"
      />,
    );
    const box = container.querySelector('[data-placeholder="w122"]')!;
    expect(boxPropertyClasses(box)).toEqual(['h-[80px]', 'object-contain']);
  });

  // W189 A3/A5 (final pass A8): cover mode — a fixed-height box per breakpoint that the asset
  // covers, for a hero/cover photo whose height must never follow the text beside it (W187). The
  // heights travel as DATA (CSS variables from props) because Tailwind only generates classes it
  // finds whole in the source; a missing step inherits the one below it, so every variable the
  // class list reads is defined (an undefined `var()` would make `height` fall back to `auto`).
  const COVER = [
    'w-full',
    'object-cover',
    'h-(--cover-h)',
    'xs:h-(--cover-h-xs)',
    'sm:h-(--cover-h-sm)',
    'md:h-(--cover-h-md)',
    'lg:h-(--cover-h-lg)',
    'xl:h-(--cover-h-xl)',
  ];

  it('cover mode: both branches get the fixed-height box from the heights, never the ratio box (A8)', () => {
    const { container } = render(
      <>
        <ImageSlot
          slot="blog-cover-x"
          alt=""
          width={980}
          height={430}
          cover={{ base: 190, md: 430, xl: 322.5 }}
        />
        <ImageSlot
          slot="cover-photo"
          src="/brand/ja-mark.png"
          alt="Cover"
          width={980}
          height={430}
          sizes="100vw"
          cover={{ base: 190, md: 430, xl: 322.5 }}
        />
      </>,
    );
    const placeholder = container.querySelector<HTMLElement>('[data-placeholder="blog-cover-x"]')!;
    const img = screen.getByRole('img', { name: 'Cover' });
    for (const el of [placeholder, img]) {
      expect(el).toHaveClass(...COVER);
      expect(el).not.toHaveClass('h-auto');
      expect(el.style.aspectRatio).toBe('');
      expect(el.style.getPropertyValue('--cover-h')).toBe('190px');
      expect(el.style.getPropertyValue('--cover-h-xs')).toBe('190px'); // inherits base
      expect(el.style.getPropertyValue('--cover-h-sm')).toBe('190px');
      expect(el.style.getPropertyValue('--cover-h-md')).toBe('430px');
      expect(el.style.getPropertyValue('--cover-h-lg')).toBe('430px'); // inherits md
      expect(el.style.getPropertyValue('--cover-h-xl')).toBe('322.5px');
    }
    // the intrinsic size still reaches next/image (srcset widths, no CLS on the asset itself)
    expect(img).toHaveAttribute('width', '980');
    expect(img).toHaveAttribute('height', '430');
    expect(img).toHaveAttribute('sizes', '100vw');
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
