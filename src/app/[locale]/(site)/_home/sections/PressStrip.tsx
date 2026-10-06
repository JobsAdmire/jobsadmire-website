import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { liquidSizes } from '@/design/zoom';
import { Link } from '@/i18n/navigation';
import { pressFeature } from '../lib/press';
import type { SectionProps } from './types';

/** The thumbnail: 120 × 68 px (16:9), 88 × 50 at ≤ 460 px (the title keeps its one line down to
 *  a 360 px phone), growing with the liquid desktop. */
const THUMB_SIZES = liquidSizes(120, '(max-width: 460px) 88px, 120px');

/**
 * "ATV'de JobsAdmire" (owner 2026-10-06, W249): a slim press strip between the hero and the case
 * bar, only while the feed carries a featured article with the interview (`pressFeature` — the TR
 * home today; the EN home once an English article shows it). The whole strip is one link to the
 * article: a decorative play thumbnail (the video's poster), the title and line (`sys.home.press.*`)
 * and the call to action. A fixed height per band (88 px, 74 px at ≤ 460 px) with one-line,
 * truncated text, so it never moves what follows; a pale card in the 1240 px box, the CTAs' 10 px
 * rect radius, the sections' `ja-reveal` entrance.
 */
export function PressStrip({ locale, bundle }: SectionProps) {
  const sys = useTranslations('sys');
  const press = pressFeature(bundle, locale);
  if (!press) return null;
  return (
    <div data-testid="home-press" className="ja-reveal bg-white">
      <div className="container-site py-3">
        <Link
          prefetch={false}
          href={{ pathname: '/blog/[slug]', params: { slug: press.slug } }}
          data-press-video={press.video.key}
          className="flex h-[88px] items-center gap-4 rounded-[10px] border border-tint-border bg-pale-1 px-2.5 no-underline transition-colors hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-xs:h-[74px] max-xs:gap-3 max-xs:px-2"
        >
          <span
            aria-hidden="true"
            className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-[7px] bg-ink max-xs:h-[50px] max-xs:w-[88px]"
          >
            <Image
              src={press.video.video.poster}
              alt=""
              fill
              sizes={THUMB_SIZES}
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-white/90 text-blue-safe shadow-[0_2px_8px_rgba(10,20,40,0.35)] max-xs:h-7 max-xs:w-7">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="currentColor"
                  focusable="false"
                  className="ml-0.5"
                >
                  <path d="M8 5.5v13l10.5-6.5z" />
                </svg>
              </span>
            </span>
          </span>
          {/* The `{' '}`s keep the link's name in words ("…JobsAdmire Kurucu…"); white space
              between flex items is never rendered. */}
          <span className="flex min-w-0 flex-1 flex-col md:flex-row md:items-center md:gap-6">
            <span className="flex min-w-0 flex-col md:flex-1">
              <strong className="truncate text-[16px] leading-snug font-extrabold text-ink max-xs:text-[14px] xl:text-[13px]">
                {sys('home.press.title')}
              </strong>{' '}
              <span className="text-body-sm truncate font-semibold text-text-secondary max-xs:text-[12.5px]">
                {sys('home.press.sub')}
              </span>
            </span>{' '}
            <span className="text-body-sm truncate font-extrabold text-blue-safe max-xs:text-[12.5px] md:shrink-0">
              {sys('home.press.cta')}
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
