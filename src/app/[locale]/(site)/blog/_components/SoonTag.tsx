import { useTranslations } from 'next-intl';

/**
 * The owner's ruling (2026-10-05): a card whose article has no body in this locale is not a link
 * and says so — "yakında" / "coming soon" (`sys.blog.soon`). The amber face matches the
 * article's related cards (`[slug]/_components/RelatedPosts.tsx`), so the tag reads the same on
 * both blog routes.
 */
export function SoonTag({ className }: { className?: string }) {
  const sys = useTranslations('sys');
  return (
    <span
      data-soon-tag=""
      className={[
        'inline-flex shrink-0 items-center rounded-pill border border-amber-border bg-amber-surface px-2.5 py-0.75 text-[11px] leading-none font-extrabold tracking-[0.5px] text-warning-text uppercase xl:text-[11px] xl:tracking-[0.4px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {sys('blog.soon')}
    </span>
  );
}
