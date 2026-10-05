import { LogoMarquee, type Logo } from '@/design/blocks/LogoMarquee';
import { SampleTag } from '@/design/blocks/SampleTag';

/** The design's `.ja-hw-logos` band (ll. 694–711, hidden ≤ 700 px): the "22+" employers figure
 *  with `hire.073` beside a 38 s masked marquee. Until consented logos exist (W6, §10 #11) it
 *  shows the design's labelled placeholder slots ("Müşteri logosu 1–10", `slotLabels`) with the
 *  `SampleTag` under the figure — the design draws no badge of its own here, so the tag sits in
 *  the band's only heading-like spot. The `employers` figure is a metric (D17, W1): unsigned, the
 *  column keeps only the tag. */
export function ClientLogos({
  tf,
  employers,
  logos,
  slotLabels,
}: {
  tf: (id: string) => string;
  /** metricValues(...).employers — '' when unsigned (W1) */
  employers: string;
  logos: readonly Logo[];
  /** the placeholder slots' labels, used while `logos` is empty */
  slotLabels: readonly string[];
}) {
  const sample = logos.length === 0;
  if (sample && slotLabels.length === 0) return null;
  const stat = (
    <div>
      {employers ? (
        <>
          <p className="m-0 text-[30px] leading-none font-extrabold tracking-[-0.5px] text-ink xl:text-[22.5px] xl:tracking-[-0.375px]">
            {employers}
          </p>
          <p className="m-0 mt-1.5 max-w-[150px] text-body-sm leading-[1.4] font-bold text-text-tertiary xl:max-w-[112.5px]">
            {tf('hire.073')}
          </p>
        </>
      ) : null}
      {sample ? <SampleTag className={employers ? 'mt-2.5' : undefined} /> : null}
    </div>
  );
  return (
    <div
      data-testid="hire-logos"
      data-sample={sample || undefined}
      className="border-b border-border-3 pt-9.5 pb-10.5 max-md:hidden"
    >
      <div className="container-site">
        <LogoMarquee
          logos={[...logos]}
          slots={sample ? [...slotLabels] : []}
          stat={stat}
          durationSec={38}
        />
      </div>
    </div>
  );
}
