import Image from 'next/image';

export type ImageSlotProps = {
  /** The design slot id — the value `data-placeholder`/`data-lcp-slot` carry (D26 counter). */
  slot: string;
  /** This slot is the page's LCP element: the image gets `data-lcp-slot` + `priority`. */
  lcp?: boolean;
  src?: string | null;
  /** '' for a decorative image (the placeholder is then `aria-hidden`, not a labelled img). */
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/** One image slot (W27): `next/image` when the asset exists, else the gradient placeholder
 *  named `data-placeholder="<slot>"` — never an unnamed one (W55) — so the launch profile's
 *  counter (`scripts/placeholder-count.ts`, D26) reports the slot by id and refuses a page
 *  whose LCP slot is still a placeholder. Aspect ratio comes from `width`/`height` so the
 *  placeholder reserves the same box as the image (no CLS when the photo lands). */
export function ImageSlot({
  slot,
  lcp = false,
  src = null,
  alt,
  width,
  height,
  sizes,
  className,
  priority,
}: ImageSlotProps) {
  const lcpSlot = lcp ? slot : undefined;
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority ?? lcp}
        className={className}
        data-lcp-slot={lcpSlot}
      />
    );
  }
  const decorative = alt === '';
  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      data-placeholder={slot}
      data-lcp-slot={lcpSlot}
      style={{ aspectRatio: `${width} / ${height}` }}
      className={['w-full bg-gradient-to-br from-tint to-sky', className].filter(Boolean).join(' ')}
    />
  );
}
