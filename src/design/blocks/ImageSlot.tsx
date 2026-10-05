import type { CSSProperties } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { liquidSizes } from '@/design/zoom';

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

/** One image slot (W27): `next/image` when the asset exists, else the labelled placeholder
 *  (dashed frame, image icon, "image to be added" and the slot id) named `data-placeholder="<slot>"` — never an unnamed one (W55) — so the launch profile's
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
        sizes={sizes ?? liquidSizes(width)}
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
      className={[box, 'relative overflow-hidden bg-gradient-to-br from-tint to-sky', className]
        .filter(Boolean)
        .join(' ')}
    >
      <PlaceholderFrame slot={slot} />
    </div>
  );
}

/** Owner 2026-10-05: a missing image is never a bare gradient or a hidden section — the frame
 *  says "an image goes here" and names the slot, so the owner can see every spot that still needs
 *  a photo. Purely visual: `aria-hidden` (the box keeps its own `role="img"`/label), no pointer
 *  events, colours that read on the tint→sky gradient and under the design's navy overlays. */
function PlaceholderFrame({ slot }: { slot: string }) {
  const sys = useTranslations('sys');
  return (
    <span
      aria-hidden="true"
      data-placeholder-frame=""
      className="pointer-events-none absolute inset-1.5 flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[inherit] border-2 border-dashed border-navy/40 p-1 text-center text-navy/70"
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        focusable="false"
      >
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="M21 16l-5-5-8 8" />
      </svg>
      <span className="block max-w-full truncate text-body-sm font-semibold leading-tight">
        {sys('blocks.imagePlaceholder')}
      </span>
      <span className="block max-w-full truncate font-mono text-body-sm leading-tight text-navy/60">
        {slot}
      </span>
    </span>
  );
}
