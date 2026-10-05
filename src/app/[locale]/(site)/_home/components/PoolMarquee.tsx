'use client';
import { useState, type ReactNode } from 'react';

/**
 * The candidate pool's endless track (design ll. 497–521, CSS ll. 69–73 / 139–140): the cards run
 * right-to-left on the shared `marquee` keyframes (`translateX(-50%)` over two copies, src/app/
 * globals.css) in 46 s (34 s at ≤ 460 px), and hold while the pointer or the focus is inside the
 * track. The second copy is the seamless-loop filler — `aria-hidden` and `inert`, so its links are
 * neither focusable nor read twice. D20 / WCAG 2.2.2: moving content needs a pause, so a Pause /
 * Play pill leads the footer row (`sys.marquee.pause/play`, resolved on the server — W148);
 * under `prefers-reduced-motion` the global rule stops the track and `motion-reduce:hidden`
 * removes the control. Only the first copy is a `.ja-stagger` list (its cards tick in once the
 * section is revealed). The `!` utilities beat the unlayered `.marquee` shorthand.
 */
export function PoolMarquee({
  children,
  footer,
  pauseLabel,
  playLabel,
}: {
  children: ReactNode;
  footer: ReactNode;
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <div className="group -mx-1 overflow-hidden p-1" aria-live="off">
        <div
          data-testid="pool-track"
          className="marquee flex w-max [animation-duration:46s]! group-focus-within:[animation-play-state:paused]! group-hover:[animation-play-state:paused]! max-xs:[animation-duration:34s]!"
          style={paused ? { animationPlayState: 'paused' } : undefined}
        >
          <div className="ja-stagger flex">{children}</div>
          <div aria-hidden="true" inert className="flex">
            {children}
          </div>
        </div>
      </div>
      <div className="mt-[26px] flex flex-wrap items-center justify-center gap-3.5 xl:mt-[19.5px]">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          data-testid="pool-toggle"
          className="inline-flex min-h-[44px] items-center rounded-pill border border-border-1 bg-white px-4 text-[13px] font-extrabold text-text-secondary transition-colors hover:border-tint-border hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe motion-reduce:hidden xl:text-[11px]"
        >
          {paused ? playLabel : pauseLabel}
        </button>
        {footer}
      </div>
    </>
  );
}
