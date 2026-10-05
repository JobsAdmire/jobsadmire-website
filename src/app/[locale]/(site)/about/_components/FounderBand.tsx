import { ImageSlot } from '@/design/blocks/ImageSlot';
import { liquidSizes } from '@/design/zoom';
import type { FounderRow } from '../founder';

/** The founder figure (design `.ja-founder`, About l. 667–679). Renders nothing without a
 *  published row (W86): the hidden state is data-driven, never a deleted section (W6). The
 *  owner published the row on 2026-10-05 (Haris Jiva, `/team/haris-jiva.jpg`), so it is real
 *  content, not a sample. The design's face: the 102 px round photo inside a 4 px
 *  #1E9EE8 → #16a34a gradient ring (110 px), the name and the row's own title id, the 27 px / 500
 *  quote with the families figure in blue, and a 64 × 4 gradient rule. Phones (≤ 900, l. 315–321):
 *  a white #d3e6f2 card, a 70 px photo in a 78 px ring, a 19 px quote (24 px from 701). The quote
 *  is the package's own three-way split around the live figure (about.048 / about.143 /
 *  about.049 — W23 permits the join because the package made the split); the figure is the
 *  `placed` metric text (W1). A missing photo is the named `founder-photo` placeholder (D26/W55).
 *  The photo box lives on the wrapper, never on `ImageSlot` itself (W129). */
export function FounderBand({
  founder,
  placedText,
  t,
}: {
  founder: FounderRow | null;
  /** `metricValues(bundle, locale).placed` */
  placedText: string;
  t: (id: string) => string;
}) {
  if (!founder) return null;
  return (
    <figure
      data-testid="about-founder"
      className="m-0 max-lg:rounded-lg max-lg:border max-lg:border-edge max-lg:bg-white max-lg:px-[18px] max-lg:pt-5 max-lg:pb-[22px] max-lg:shadow-[0_12px_30px_rgba(22,60,90,0.08)]"
    >
      <figcaption className="mb-7.5 flex items-center gap-5 max-lg:mb-5.5 max-lg:gap-3.5">
        <div className="shrink-0 rounded-pill bg-gradient-to-br from-[#1e9ee8] to-success p-1">
          <div className="w-[102px] max-lg:w-[70px] xl:w-[76.5px]">
            <ImageSlot
              slot="founder-photo"
              src={founder.photoSrc}
              alt={founder.name}
              width={102}
              height={102}
              sizes={liquidSizes(76.5, '102px')}
              className="rounded-pill"
            />
          </div>
        </div>
        <span className="min-w-0">
          <span className="block text-[18px] font-extrabold text-ink xl:text-[13.5px]">
            {founder.name}
          </span>
          <span className="mt-[3px] block text-[14px] font-semibold text-text-tertiary xl:mt-[2.25px] xl:text-[11px]">
            {t(founder.titleId)}
          </span>
        </span>
      </figcaption>
      <blockquote className="m-0 mb-6.5 text-[27px] leading-[1.5] font-medium tracking-[-0.3px] text-ink xl:text-[20.25px] xl:tracking-[-0.225px] max-lg:mb-4 max-lg:text-[24px] max-md:text-[19px] max-md:tracking-[-0.2px]">
        {t('about.048')}{' '}
        <span className="font-extrabold text-blue-safe">
          {placedText} {t('about.143')}
        </span>{' '}
        {t('about.049')}
      </blockquote>
      <div
        aria-hidden="true"
        className="h-1 w-16 rounded-[2px] bg-gradient-to-r from-[#1e9ee8] to-success max-lg:w-14"
      />
    </figure>
  );
}
