import { LogoMarquee, type Logo } from '@/design/blocks/LogoMarquee';

/** The design's `.ja-hw-logos` band (hidden ≤ 700 px). Renders nothing until consented logos
 *  exist (W6, §10 #11); the `employers` stat rides with the band, never alone. */
export function ClientLogos({
  tf,
  employers,
  logos,
}: {
  tf: (id: string) => string;
  /** metricValues(...).employers — '' when unsigned (W1) */
  employers: string;
  logos: readonly Logo[];
}) {
  if (logos.length === 0) return null;
  return (
    <div data-testid="hire-logos" className="border-b border-border-3 py-9 max-md:hidden">
      <div className="container-site grid items-center gap-12 md:grid-cols-[auto_1fr]">
        {employers ? (
          <div className="border-r border-border-2 pr-11">
            <p className="m-0 text-stat font-extrabold leading-none text-ink">{employers}</p>
            <p className="m-0 mt-1.5 max-w-[150px] text-body-sm font-bold text-text-tertiary">
              {tf('hire.073')}
            </p>
          </div>
        ) : null}
        <LogoMarquee logos={[...logos]} durationSec={38} />
      </div>
    </div>
  );
}
