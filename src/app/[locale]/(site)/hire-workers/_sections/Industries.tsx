import { getCollection, type Sector } from '@/content/collections';
import { Accordion, type AccordionItem } from '@/design/primitives/Accordion';
import { Section } from '@/design/primitives/Section';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { SectorPrefillLink } from '../_components/SectorPrefillLink';
import { INDUSTRIES } from '../_lib/tables';

const CHIP = 'inline-block rounded-pill border px-3 py-1 text-body-sm font-bold';

/** Design `#industries`: six sector rows (single-open, none open at rest — the design's
 *  `openInd: -1`). Delta 6: the foundation Accordion takes a string trigger, so the subtitle and
 *  every chip sit in the panel; the per-sector CTA is `SectorPrefillLink` (W77). */
export function Industries({ bundle, tf }: { bundle: Bundle; tf: (id: string) => string }) {
  const byKey = new Map<string, Sector>(getCollection(bundle, 'sectors').map((s) => [s.key, s]));
  const items: AccordionItem[] = INDUSTRIES.flatMap((row, i) => {
    const sector = byKey.get(row.key);
    if (!sector) return []; // rendered by data: a sector missing from the collection is no row
    const n = String(i + 1).padStart(2, '0');
    return [
      {
        id: row.key,
        title: `${n} · ${tf(sector.labelId)}`,
        body: (
          <div className="flex flex-col gap-4">
            {sector.subtitleId ? (
              <p className="m-0 text-body-sm font-bold text-blue-safe">{tf(sector.subtitleId)}</p>
            ) : null}
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {row.visibleRoleIds.map((id) => (
                <li key={id} className={`${CHIP} border-border-2 bg-pale-1 text-text-secondary`}>
                  {tf(id)}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-end justify-between gap-6 rounded-sm bg-blue-safe p-5 text-white shadow-card-hover max-md:p-4">
              <div className="min-w-0">
                <p className="m-0 mb-2 text-eyebrow font-extrabold uppercase tracking-[1px] text-white">
                  {tf('hire.136')}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {row.moreRoleIds.map((id) => (
                    <li key={id} className={`${CHIP} border-white/60 text-white`}>
                      {tf(id)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-end gap-2 max-md:w-full max-md:items-stretch">
                <p className="m-0 text-body-sm font-bold text-white">{tf('hire.137')}</p>
                <SectorPrefillLink
                  sector={row.key}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-input bg-white px-5 text-body-sm font-extrabold text-blue-safe no-underline hover:bg-tint"
                >
                  {tf(row.ctaId)}
                </SectorPrefillLink>
              </div>
            </div>
          </div>
        ),
      },
    ];
  });
  return (
    <Section tone="light" id="industries" className="scroll-mt-20">
      <div className="container-site" data-testid="hire-industries">
        <h2 className="m-0 mb-4 text-center text-h2">{tf('hire.074')}</h2>
        <p className="mx-auto mb-11 mt-0 max-w-[560px] text-center text-body-lg text-text-tertiary max-md:mb-6">
          {tf('hire.075')}
        </p>
        <div className="rounded-lg border border-tint-border bg-white px-5 max-md:px-3.5">
          <Accordion items={items} singleOpen headingLevel={3} />
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
