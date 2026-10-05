import { makeT } from '@/content/pure';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** A float pauses with the rotating word: `RotationToggle` sets `data-paused` on the hero
 *  (`group/hero`), WCAG 2.2.2. `!important` because the loop is the unlayered `.ja-float-*`
 *  shorthand (src/design/motion/motion.css). */
const PAUSE = 'group-data-[paused]/hero:[animation-play-state:paused]!';
const CARD = 'absolute rounded-base border border-white/10 bg-white px-4.5 py-4 text-left text-ink';

function Stars() {
  return (
    <span className="inline-flex gap-px text-warning">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" focusable="false">
          <path d="M12 2.5l2.94 6.1 6.56.9-4.78 4.6 1.17 6.6L12 17.6l-5.89 3.1 1.17-6.6L2.5 9.5l6.56-.9z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * The design's hero art (Blog.dc.html 530–556, desktop only — hidden ≤ 700 px): two floating
 * article cards and the EN · TR pill, decorative (`aria-hidden`). Fixed copy from the package
 * ids, as the design types it (owner, 2026-10-05): card 1, tilted −4°, "Çalışma İzinleri"
 * (blog.011) over blog.027 with the gradient avatar and blog.028; card 2, tilted 3°, the green
 * "İşe alım" pill (blog.029) over blog.030 with five stars and "En çok okunan" (blog.031); the
 * pill "EN · TR 2 dil" (blog.032). The three float (`ja-float-1/2/3`, 6 / 7.5 + 0.9 / 6.5 + 1.6 s);
 * under reduced motion they stand still at their tilt.
 */
export function HeroArt({ bundle }: { bundle: Bundle }) {
  const t = makeT(bundle);
  return (
    <div
      aria-hidden="true"
      data-testid="blog-hero-art"
      className="relative h-70 min-w-0 max-md:hidden"
    >
      <div
        className={`${CARD} ja-float-1 top-4.5 left-[4%] z-2 w-62.5 [transform:rotate(-4deg)] shadow-[0_26px_60px_rgba(3,10,26,0.5)] xl:shadow-[0_19.5px_45px_rgba(3,10,26,0.5)] ${PAUSE}`}
      >
        <div className="mb-2.5 flex items-center gap-2">
          <span className="rounded-pill bg-tint px-2.5 py-0.75 text-[11px] font-extrabold text-blue-safe xl:text-[11px]">
            {t('blog.011')}
          </span>
        </div>
        <p className="m-0 mb-2 text-[14.5px] leading-[1.35] font-extrabold text-ink xl:text-[11px]">
          {t('blog.027')}
        </p>
        <p className="m-0 flex items-center gap-2">
          <span className="inline-block h-5.5 w-5.5 shrink-0 rounded-pill bg-gradient-to-br from-[#1e9ee8] to-success" />
          <span className="text-[11.5px] font-semibold text-text-tertiary xl:text-[11px]">
            {t('blog.028')}
          </span>
        </p>
      </div>
      <div
        className={`${CARD} ja-float-2 top-30 right-0 z-3 w-57.5 [transform:rotate(3deg)] shadow-[0_22px_52px_rgba(3,10,26,0.45)] xl:shadow-[0_16.5px_39px_rgba(3,10,26,0.45)] ${PAUSE}`}
      >
        <div className="mb-2.5 flex items-center gap-2">
          <span className="rounded-pill bg-success-soft px-2.5 py-0.75 text-[11px] font-extrabold text-success-text xl:text-[11px]">
            {t('blog.029')}
          </span>
        </div>
        <p className="m-0 mb-2 text-[14.5px] leading-[1.35] font-extrabold text-ink xl:text-[11px]">
          {t('blog.030')}
        </p>
        <p className="m-0 flex items-center gap-1.5">
          <Stars />
          <span className="text-[11.5px] font-semibold text-text-tertiary xl:text-[11px]">
            {t('blog.031')}
          </span>
        </p>
      </div>
      <p
        className={`ja-float-3 absolute bottom-1.5 left-[12%] z-4 m-0 inline-flex items-center gap-1.75 rounded-pill border border-white/25 bg-white/10 px-4 py-2 text-[12.5px] font-extrabold text-white backdrop-blur-[6px] xl:text-[11px] ${PAUSE}`}
      >
        <span className="text-sky">EN</span>
        <span className="text-white/40">·</span>
        <span className="text-sky">TR</span>
        <span className="font-semibold text-white/70">{t('blog.032')}</span>
      </p>
    </div>
  );
}
