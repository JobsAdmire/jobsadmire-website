import type { CSSProperties } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { BlogCategory } from '@/content/collections';
import { coverGradient } from '../_lib/category';

/** The design's category-coloured cover (Blog Article DC 524–531, script 1139; blog-posts.js
 *  `JA_BLOG_COVER`): a 135° gradient per category with the image glyph, the category label and
 *  a dashed frame. It is the named placeholder (`data-placeholder="<slot>"`, D26) until the
 *  article has a photo; with `photo` (the post's cover from Operations, W248) the same box shows
 *  it — `next/image` `fill`, cropped to the box, `preload` when it is the article's own cover.
 *  Page-local because the shared `ImageSlot` placeholder has one fixed tint→sky face and a
 *  ratio box, where this one is sized by the caller's height steps (Shared request: a `tone`
 *  prop). `className` carries the box (height steps, radius) — the caller sizes it, like the
 *  design. */
export function CategoryCover({
  slot,
  category,
  label,
  photo = null,
  sizes,
  preload = false,
  className,
  compact = false,
}: {
  slot: string;
  category: BlogCategory;
  label: string;
  photo?: { src: string; alt: string } | null;
  /** `next/image` `sizes` for the photo (the box's rendered widths). */
  sizes?: string;
  /** The article's own cover: above the fold on most screens (never the LCP slot — the h1 is). */
  preload?: boolean;
  className: string;
  /** a small box (the related cards): the glyph and label only, no caption lines */
  compact?: boolean;
}) {
  const sys = useTranslations('sys');
  if (photo) {
    return (
      <div data-cover-photo={slot} className={`relative bg-tint ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      </div>
    );
  }
  const style: CSSProperties = { backgroundImage: coverGradient(category) };
  return (
    <div
      aria-hidden="true"
      data-placeholder={slot}
      data-cover-category={category}
      style={style}
      className={`relative overflow-hidden text-white ${className}`}
    >
      <span className="pointer-events-none absolute inset-1.5 flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[inherit] border-2 border-dashed border-white/40 p-1 text-center">
        <svg
          viewBox="0 0 24 24"
          width={compact ? 22 : 30}
          height={compact ? 22 : 30}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 opacity-90"
          focusable="false"
        >
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <circle cx="8.5" cy="10" r="1.6" />
          <path d="M21 16l-5-5-8 8" />
        </svg>
        <span
          className={`block max-w-full truncate font-extrabold ${compact ? 'max-md:hidden text-[12.5px] xl:text-[11px]' : 'text-[15px] xl:text-[11.25px]'}`}
        >
          {label}
        </span>
        {compact ? null : (
          <span className="block max-w-full truncate font-mono text-[12px] opacity-75 xl:text-[11px]">
            {sys('blocks.imagePlaceholder')} · {slot}
          </span>
        )}
      </span>
    </div>
  );
}
