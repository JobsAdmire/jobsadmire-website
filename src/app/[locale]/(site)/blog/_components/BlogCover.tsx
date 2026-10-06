import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { BlogCategory } from '@/content/collections';
import { CATEGORY_FACE } from '../_lib/category';

/**
 * The design's category cover (Blog.dc.html 604–606 / 640–642, `coverStyle` → `COVERS`
 * 949–954): a 135° gradient per category behind the image slot, whose placeholder shows the
 * category. Every card cover is a named placeholder until the blog has photos — the dashed frame,
 * the image glyph, the category and "image to be added · <slot>" (the owner's labelled-placeholder
 * rule, 2026-10-05; `data-placeholder` keeps the D26 counter's view). Page-local because the
 * shared `ImageSlot` placeholder has one tint→sky face (Shared request: a `tone`/`label` prop,
 * with the article's `CategoryCover`). `className` carries the box; `rowOnPhone` keeps only the
 * glyph in the 104 px phone row cover. With `photo` (the post's cover from Operations, W248) the
 * box shows the photo instead — `next/image` `fill`, cropped to the box the caller sizes, centred
 * a little above its middle (W250: a crop keeps a face rather than a chin).
 */
export function BlogCover({
  slot,
  category,
  label,
  className,
  rowOnPhone = false,
  photo = null,
  sizes,
}: {
  slot: string;
  category: BlogCategory;
  label: string;
  className: string;
  rowOnPhone?: boolean;
  photo?: { src: string; alt: string } | null;
  /** `next/image` `sizes` for the photo (the box's rendered widths). */
  sizes?: string;
}) {
  const sys = useTranslations('sys');
  if (photo)
    return (
      <div data-cover-photo={slot} className={`relative overflow-hidden bg-tint ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          className="object-cover object-[50%_40%]"
        />
      </div>
    );
  const phoneText = rowOnPhone ? ' max-md:hidden' : '';
  return (
    <div
      aria-hidden="true"
      data-placeholder={slot}
      data-cover-category={category}
      className={`relative overflow-hidden text-white ${CATEGORY_FACE[category].cover} ${className}`}
    >
      <span className="pointer-events-none absolute inset-1.5 flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden border-2 border-dashed border-white/40 p-1 text-center max-md:inset-1 max-md:border-[1.5px]">
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
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
          className={`block max-w-full truncate text-[15px] font-extrabold xl:text-[11.25px]${phoneText}`}
        >
          {label}
        </span>
        <span
          className={`block max-w-full truncate font-mono text-[12px] opacity-75 xl:text-[11px]${phoneText}`}
        >
          {sys('blocks.imagePlaceholder')} · {slot}
        </span>
      </span>
    </div>
  );
}
