import type { CSSProperties } from 'react';
import Image from 'next/image';

/** Cover-mode heights in px per min-width step (`xs` 461, `sm` 561, `md` 701, `lg` 901, `xl`
 *  1101); a missing step inherits the one below it. */
export type CoverHeights = {
  base: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

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
  /** W189 A3/A5 (final pass A8): cover mode — a FIXED-height box per breakpoint that the asset
   *  covers (`object-cover`), for a hero or cover photo whose height must never follow the text
   *  beside it (W187). The heights travel as data: CSS variables on the element, read by
   *  `COVER_BOX`'s `h-(--cover-h…)` classes — Tailwind only generates classes it finds whole in
   *  the source, so a caller can never spell a height class (W129 holds). Without `cover` the slot
   *  stays width-driven (the `width`/`height` ratio box). */
  cover?: CoverHeights;
};

/** The box both branches share (W129): the wrapper's full width, the height that the
 *  `width`/`height` ratio gives it, and a photo cropped to that box rather than reshaping it. */
const BOX = 'w-full h-auto object-cover';
/** The cover-mode box: full width, one fixed height per step from the `--cover-h*` variables. */
const COVER_BOX =
  'w-full object-cover h-(--cover-h) xs:h-(--cover-h-xs) sm:h-(--cover-h-sm) md:h-(--cover-h-md) lg:h-(--cover-h-lg) xl:h-(--cover-h-xl)';

/** Every step's variable, a missing step inheriting the one below it — an undefined `var()`
 *  would make `height` fall back to `auto` at that step. */
function coverVars(c: CoverHeights): CSSProperties {
  const xs = c.xs ?? c.base;
  const sm = c.sm ?? xs;
  const md = c.md ?? sm;
  const lg = c.lg ?? md;
  const xl = c.xl ?? lg;
  return {
    '--cover-h': `${c.base}px`,
    '--cover-h-xs': `${xs}px`,
    '--cover-h-sm': `${sm}px`,
    '--cover-h-md': `${md}px`,
    '--cover-h-lg': `${lg}px`,
    '--cover-h-xl': `${xl}px`,
  } as CSSProperties;
}

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
  cover,
}: ImageSlotProps) {
  const lcpSlot = lcp ? slot : undefined;
  const box = cover ? COVER_BOX : BOX;
  const style = cover ? coverVars(cover) : { aspectRatio: `${width} / ${height}` };
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={priority ?? lcp}
        style={style}
        className={[box, className].filter(Boolean).join(' ')}
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
      style={style}
      className={[box, 'bg-gradient-to-br from-tint to-sky', className].filter(Boolean).join(' ')}
    />
  );
}
