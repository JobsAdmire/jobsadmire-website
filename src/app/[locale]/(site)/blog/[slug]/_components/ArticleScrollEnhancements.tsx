'use client';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import { useScrollProgress } from '@/design/islands/useScrollProgress';

export type ArticleScrollEnhancementsProps = {
  /** The ≤700 px back-to-top button's name (sys.blog.article.backToTop). */
  backToTopLabel: string;
  /** The design's white sticky bottom bar (StickyCtaBar `tone="light"`: from `lg`, after 700 px of
   *  scroll, hidden near `hideNearId`). */
  stickyBar: { message: string; ctas: StickyCta[]; hideNearId?: string };
};

/**
 * B-13 / parity (Blog Article script 1146–1159, CSS .ja-art-top): what the article draws only once
 * the visitor scrolls — the 3 px reading-progress bar (width eases 80 ms linear), the phones'
 * back-to-top button (fades and rises in .25 s after 12 % of the page; focus moves to `<main>` so
 * a keyboard user lands at the top too) and the white sticky CTA bar. Page-local copy of the
 * blog index's `ScrollEnhancements` (that one is shared with `/blog` and stays untouched); loaded
 * by `ArticleScrollEnhancementsLoader` on the first scroll, never server-rendered.
 */
export function ArticleScrollEnhancements({
  backToTopLabel,
  stickyBar,
}: ArticleScrollEnhancementsProps) {
  const progress = useScrollProgress();
  const toTop = () => {
    // `html { scroll-behavior: smooth }` (globals.css) — and `auto` under reduced motion.
    window.scrollTo({ top: 0 });
    document.getElementById('main')?.focus({ preventScroll: true });
  };
  const shown = progress > 0.12;
  return (
    <>
      <div
        aria-hidden="true"
        data-testid="reading-progress"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      >
        <div
          className="h-full bg-gradient-to-r from-blue to-success transition-[width] duration-[80ms] ease-linear motion-reduce:transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <button
        type="button"
        onClick={toTop}
        aria-label={backToTopLabel}
        data-testid="back-to-top"
        data-shown={shown ? 'true' : 'false'}
        tabIndex={shown ? 0 : -1}
        className={[
          'fixed right-3.5 bottom-[88px] z-[39] flex h-11 w-11 items-center justify-center rounded-pill border border-white/15 bg-ink p-0 text-white shadow-[0_10px_26px_rgba(22,32,46,0.32)] xl:shadow-[0_7.5px_19.5px_rgba(22,32,46,0.32)] transition-[opacity,transform] duration-[250ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe motion-reduce:transition-none md:hidden',
          shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2.5 opacity-0',
        ].join(' ')}
      >
        <svg
          aria-hidden="true"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
      <StickyCtaBar
        tone="light"
        message={stickyBar.message}
        ctas={stickyBar.ctas}
        hideNearId={stickyBar.hideNearId}
      />
    </>
  );
}
