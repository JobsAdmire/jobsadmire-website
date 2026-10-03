'use client';
import { StickyCtaBar, type StickyCta } from '@/design/chrome/StickyCtaBar';
import { useScrollProgress } from '@/design/islands/useScrollProgress';

export type ScrollEnhancementsProps = {
  /** Article only: the ≤700 px back-to-top button's name (sys.blog.article.backToTop). */
  backToTopLabel?: string;
  /** Article only: the design's sticky bottom bar (StickyCtaBar shows it from `lg`, after
   *  700 px of scroll, and hides it near `hideNearId`). */
  stickyBar?: { message: string; ctas: StickyCta[]; hideNearId?: string };
};

/**
 * B-13: what the blog pages draw only once the visitor scrolls — the 3 px reading-progress bar
 * (decorative, `aria-hidden`: scroll position is not information), the article's back-to-top
 * button (phones; after 12 % of the page; focus moves to `<main>` so a keyboard user lands at
 * the top too) and the article's sticky CTA bar (W81: its WhatsApp CTA is a tracked
 * `ContactCta`). Loaded by `ScrollEnhancementsLoader` on the first scroll, never server-rendered.
 */
export function ScrollEnhancements({ backToTopLabel, stickyBar }: ScrollEnhancementsProps) {
  const progress = useScrollProgress();
  const toTop = () => {
    // `html { scroll-behavior: smooth }` (globals.css) — and `auto` under reduced motion.
    window.scrollTo({ top: 0 });
    document.getElementById('main')?.focus({ preventScroll: true });
  };
  return (
    <>
      <div
        aria-hidden="true"
        data-testid="reading-progress"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      >
        <div
          className="h-full bg-gradient-to-r from-blue to-success"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {backToTopLabel && progress > 0.12 ? (
        <button
          type="button"
          onClick={toTop}
          aria-label={backToTopLabel}
          data-testid="back-to-top"
          className="fixed right-3.5 bottom-[88px] z-[39] flex h-11 w-11 items-center justify-center rounded-pill border border-white/15 bg-ink text-white shadow-social focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe md:hidden"
        >
          <span aria-hidden="true">↑</span>
        </button>
      ) : null}
      {stickyBar ? (
        <StickyCtaBar
          message={stickyBar.message}
          ctas={stickyBar.ctas}
          hideNearId={stickyBar.hideNearId}
        />
      ) : null}
    </>
  );
}
