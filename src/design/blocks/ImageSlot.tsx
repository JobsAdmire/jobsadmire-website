import Image from 'next/image';

export type ImageSlotProps = {
  /** The design slot id — the value `data-placeholder`/`data-lcp-slot` carry (D26 counter). */
  slot: string;
  /** This slot is the page's LCP element: the image gets `data-lcp-slot` + `preload`. */
  lcp?: boolean;
  src?: string | null;
  /** '' for a decorative image (the placeholder is then `aria-hidden`, not a labelled img). */
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  /** Extra classes (a radius, a border) — never a class for a property the box already sets
   *  (`w-*`, `h-*`, `aspect-*`, `object-{fit}`; an `object-top`-style position is a different
   *  property and is fine): the slot owns its box (W129/W122 — BOX below also sets `h-auto`
   *  and `object-cover`, so a caller's `h-[…]`/`object-contain` would silently lose). A caller
   *  that needs a narrower slot wraps it in a sized element (`<div className="w-[104px]
   *  shrink-0">`) and gives the text beside it `min-w-0`. */
  className?: string;
  /** Overrides the preload `lcp` implies (`priority ?? lcp`). Kept by name (frozen), it maps
   *  to next/image's `preload`: that component's own `priority` is deprecated in 16.3.5 (M3). */
  priority?: boolean;
};

/** The box both branches share (W129): the wrapper's full width, the height that the
 *  `width`/`height` ratio gives it, and a photo cropped to that box rather than reshaping it. */
const BOX = 'w-full h-auto object-cover';

/** One image slot (W27): `next/image` when the asset exists, else the gradient placeholder
 *  named `data-placeholder="<slot>"` — never an unnamed one (W55) — so the launch profile's
 *  counter (`scripts/placeholder-count.ts`, D26) reports the slot by id and refuses a page
 *  whose LCP slot is still a placeholder. Both branches carry the same box — `BOX` plus
 *  `aspect-ratio: width / height` — so the placeholder reserves exactly the box the photo will
 *  fill (no CLS when it lands) and an off-ratio asset is cropped, never letting its own shape
 *  resize the slot. The ratio is an inline style, not an `aspect-[w/h]` class: Tailwind only
 *  generates classes it finds whole in the source, never one composed from props at runtime. */
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
  const ratio = { aspectRatio: `${width} / ${height}` };
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={priority ?? lcp}
        style={ratio}
        className={[BOX, className].filter(Boolean).join(' ')}
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
      style={ratio}
      className={[BOX, 'bg-gradient-to-br from-tint to-sky', className].filter(Boolean).join(' ')}
    />
  );
}
