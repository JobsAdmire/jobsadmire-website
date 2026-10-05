import { ImageSlot } from '@/design/blocks/ImageSlot';
import { liquidSizes } from '@/design/zoom';
import type { FounderRow } from '../founder';

/** The founder figure (design 662–678). Renders nothing without a published row (W86): the
 *  hidden state is data-driven, never a deleted section (W6). The quote is the package's own
 *  three-way split around the live figure (about.048 / about.143 / about.049 — W23 permits the
 *  join because the package made the split); the figure is the `placed` metric text. A missing
 *  photo is the named `founder-photo` placeholder (D26/W55). The 102×102 box lives on the
 *  wrapper, never on `ImageSlot` itself (W129): the slot's own `w-full h-auto object-cover`
 *  fills whatever box its parent gives it. */
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
    <figure data-testid="about-founder" className="m-0">
      <figcaption className="mb-7 flex items-center gap-5">
        <div className="w-[102px] shrink-0">
          <ImageSlot
            slot="founder-photo"
            src={founder.photoSrc}
            alt={founder.name}
            width={102}
            height={102}
            sizes={liquidSizes(102)}
            className="rounded-pill"
          />
        </div>
        <span className="min-w-0">
          <span className="block text-card-title font-extrabold">{founder.name}</span>
          <span className="mt-1 block text-body-sm text-text-tertiary">{t(founder.titleId)}</span>
        </span>
      </figcaption>
      <blockquote className="m-0 text-body-lg leading-relaxed text-ink">
        {t('about.048')}{' '}
        <span className="font-extrabold text-blue-safe">
          {placedText} {t('about.143')}
        </span>{' '}
        {t('about.049')}
      </blockquote>
    </figure>
  );
}
