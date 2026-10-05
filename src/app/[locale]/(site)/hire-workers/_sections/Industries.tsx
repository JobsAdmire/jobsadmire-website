import { getCollection, type Sector } from '@/content/collections';
import { Section } from '@/design/primitives/Section';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { IndustryRows, type IndustryRowView } from '../_components/IndustryRows';
import { INDUSTRIES } from '../_lib/tables';

/** Design `#industries` (ll. 713–908): six sector rows that show their number tile, title,
 *  subtitle and role chips at rest, single-open, none open at rest (the design's `openInd: -1`).
 *  Every string is resolved here on the server; `IndustryRows` is the client island that owns
 *  the open row. The per-sector CTA and the round → are `SectorPrefillLink` (W77). */
export function Industries({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const byKey = new Map<string, Sector>(getCollection(bundle, 'sectors').map((s) => [s.key, s]));
  const rows: IndustryRowView[] = INDUSTRIES.flatMap((row, i) => {
    const sector = byKey.get(row.key);
    if (!sector) return []; // rendered by data: a sector missing from the collection is no row
    return [
      {
        key: row.key,
        n: String(i + 1).padStart(2, '0'),
        title: tf(sector.labelId),
        subtitle: sector.subtitleId ? tf(sector.subtitleId) : null,
        accent: i === 0,
        chips: row.visibleRoleIds.map((id) => tf(id)),
        more: row.moreRoleIds.map((id) => tf(id)),
        cta: tf(row.ctaId),
      },
    ];
  });
  return (
    <Section tone="light" id="industries" className="scroll-mt-20 lg:pb-10">
      <div className="container-site" data-testid="hire-industries">
        <h2 className="m-0 mb-4 text-center text-h2 leading-[1.05] tracking-[-1.6px] max-[601px]:text-[25px] max-[601px]:tracking-[-0.4px] xl:tracking-[-1.2px]">
          {tf('hire.074')}
        </h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-6">
          {tf('hire.075')}
        </p>
        <div className="overflow-hidden rounded-lg border border-edge bg-white">
          <IndustryRows rows={rows} moreLabel={tf('hire.136')} arrival={tf('hire.137')} />
        </div>
        <p className="m-0 mt-7 text-center text-body text-text-tertiary">
          {tf('hire.138')}{' '}
          <a href="#request-form" className="font-extrabold text-blue-safe no-underline">
            {tf('hire.139')}
          </a>
        </p>
      </div>
    </Section>
  );
}
