import { Section } from '@/design/primitives/Section';
import { Tabs } from '@/design/primitives/Tabs';
import { Frags } from '../_components/Frags';
import { CheckIcon, InfoIcon } from '../_components/icons';
import { sp } from '../_lib/fragments';
import { COMPARE_ROWS } from '../_lib/tables';
import { SampleCard } from './SampleCard';

const HEAD = 'px-7 py-6 text-white max-lg:px-4 max-lg:py-4';
const HEAD_PILL =
  'mt-2 inline-block rounded-pill border border-white/60 px-2.5 py-0.5 text-eyebrow font-extrabold tracking-[0.6px] uppercase';
const CELL =
  'min-w-0 px-7 py-4.5 text-body-sm leading-relaxed text-text-secondary max-lg:px-4 max-lg:py-3 xl:text-pretty';
const CAPTION = 'mb-1 block text-eyebrow font-extrabold tracking-[0.7px] uppercase lg:sr-only';

/** "Two legal routes" (#routes): the design's three-column table from 901 px; below it the two
 *  sides stack under each criterion. D20: the design's ≤ 700 px two-tab switcher hid one route,
 *  so it is not ported; each side carries the real strings `wp.099`/`wp.100` as its caption
 *  (the design's English-only CSS `::before` labels), `sr-only` from 901 px so screen readers
 *  always hear which route a cell belongs to. The sample permit card closes the section. */
export function RoutesComparison({ tf }: { tf: (id: string) => string }) {
  const [important, warning] = [tf('wp.137'), tf('wp.138')];
  return (
    <Section tone="light" id="routes" className="scroll-mt-24 lg:scroll-mt-32 xl:scroll-mt-40">
      <div className="container-site" data-testid="wp-routes">
        <h2 className="m-0 mb-3.5 text-center text-h2 leading-[1.05] tracking-[-0.03em] max-md:text-left max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
          {tf('wp.097')}
        </h2>
        <p className="mx-auto mb-11 max-w-[620px] text-center text-body-lg text-text-tertiary max-md:mb-5 max-md:text-left">
          {tf('wp.098')}
        </p>
        {/* ≤ 700 px: the design's two-tab switcher (.ja-vs-tabs) shows ONE route at a time — an
            ARIA tablist (Tabs, segmented); the full table below is the 701 px+ view. */}
        <div data-testid="wp-routes-tabs" className="mx-auto max-w-[1080px] md:hidden">
          <Tabs
            variant="segmented"
            defaultId="permit"
            listClassName="-mb-3"
            tabs={[
              { id: 'permit', label: tf('wp.099'), panel: <MobileRoute side="permit" tf={tf} /> },
              { id: 'exempt', label: tf('wp.100'), panel: <MobileRoute side="exempt" tf={tf} /> },
            ]}
          />
        </div>
        <div className="mx-auto max-w-[1080px] overflow-hidden rounded-xl border border-border-1 bg-white shadow-[0_18px_48px_rgba(22,60,90,0.1)] max-md:hidden">
          <div className="grid lg:grid-cols-[1fr_150px_1fr]">
            {/* D20: blue-safe, not the design's #1899d5 → #1073a8 gradient */}
            <div data-testid="wp-routes-permit" className={`${HEAD} bg-blue-safe`}>
              <p className="m-0 mb-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase">
                {tf('wp.101')}
              </p>
              <p className="m-0 text-card-title font-extrabold">{tf('wp.102')}</p>
              <span className={HEAD_PILL}>{tf('wp.103')}</span>
            </div>
            <div
              aria-hidden="true"
              className="flex items-center justify-center bg-ink max-lg:hidden"
            >
              <span className="flex h-13 w-13 items-center justify-center rounded-pill bg-white text-body-sm font-extrabold text-ink">
                {tf('wp.104')}
              </span>
            </div>
            <div
              data-testid="wp-routes-exempt"
              className={`${HEAD} bg-gradient-to-br from-[#253063] to-[#16204a] lg:text-right`}
            >
              <p className="m-0 mb-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase">
                {tf('wp.105')}
              </p>
              <p className="m-0 text-card-title font-extrabold">{tf('wp.106')}</p>
              <span className={HEAD_PILL}>{tf('wp.107')}</span>
            </div>
          </div>
          {COMPARE_ROWS.map((row) => (
            <div
              key={row.labelId}
              className="grid border-t border-border-3 lg:grid-cols-[1fr_150px_1fr]"
            >
              {/* DOM order label → permit → exempt reads right for screen readers; from 901 px
                  `order` puts the label in the middle column, as designed. */}
              <p className="m-0 flex items-center bg-pale-2 px-4 py-2 text-eyebrow font-extrabold tracking-[0.8px] text-text-secondary uppercase lg:order-2 lg:justify-center lg:border-x lg:border-border-3 lg:px-2.5 lg:py-0 lg:text-center">
                {tf(row.labelId)}
              </p>
              <div className={`${CELL} lg:order-1`}>
                <span className={`${CAPTION} text-blue-safe`}>{tf('wp.099')}</span>
                <Frags parts={row.permit} tf={tf} />
              </div>
              <div className={`${CELL} lg:order-3 lg:text-right`}>
                <span className={`${CAPTION} text-[#253063]`}>{tf('wp.100')}</span>
                <Frags parts={row.exempt} tf={tf} />
              </div>
            </div>
          ))}
          <div className="grid border-t border-border-3 lg:grid-cols-2">
            <p className="m-0 flex items-center gap-2.5 bg-[#f4fafd] px-7 py-4 text-body-sm font-bold text-blue-safe max-lg:px-4 max-lg:py-3">
              <CheckIcon size={15} className="flex-none" />
              {tf('wp.135')}
            </p>
            <p className="m-0 flex items-center gap-2.5 border-border-3 bg-[#f0f3fa] px-7 py-4 text-body-sm font-bold text-[#253063] max-lg:border-t max-lg:px-4 max-lg:py-3 lg:flex-row-reverse lg:border-l lg:text-right">
              <CheckIcon size={15} className="flex-none" />
              {tf('wp.136')}
            </p>
          </div>
        </div>
        <p className="mx-auto mt-6 mb-0 flex max-w-[1080px] items-start gap-3 rounded-sm border border-warning-border bg-warning-surface px-5.5 py-4 text-body-sm leading-relaxed text-[#7a5210] max-md:mt-3.5 max-md:px-3.5 max-md:py-3">
          <InfoIcon size={18} className="mt-0.5 flex-none" />
          <span className="xl:max-w-[820px]">
            <strong className="font-extrabold text-ink">{important}</strong>
            {sp(important, warning)}
            {warning}
          </span>
        </p>
        <SampleCard tf={tf} />
      </div>
    </Section>
  );
}

/** One route as the ≤ 700 px card: its head, each criterion (label over the cell) and its
 *  closing line. Pure markup — the tab state lives in `Tabs`. */
function MobileRoute({ side, tf }: { side: 'permit' | 'exempt'; tf: (id: string) => string }) {
  const permit = side === 'permit';
  const ids = permit
    ? { eyebrow: 'wp.101', title: 'wp.102', pill: 'wp.103', foot: 'wp.135' }
    : { eyebrow: 'wp.105', title: 'wp.106', pill: 'wp.107', foot: 'wp.136' };
  return (
    <div className="overflow-hidden rounded-base border border-border-1 bg-white shadow-[0_18px_48px_rgba(22,60,90,0.1)]">
      <div
        className={`${HEAD} ${permit ? 'bg-gradient-to-br from-blue-safe to-blue-deep' : 'bg-gradient-to-br from-[#253063] to-[#16204a]'}`}
      >
        <p className="m-0 mb-1 text-eyebrow font-extrabold tracking-[1.2px] uppercase">
          {tf(ids.eyebrow)}
        </p>
        <p className="m-0 text-card-title font-extrabold">{tf(ids.title)}</p>
        <span className={HEAD_PILL}>{tf(ids.pill)}</span>
      </div>
      {COMPARE_ROWS.map((row) => (
        <div key={row.labelId} className="border-t border-border-3 px-4 py-3">
          <p className="m-0 mb-1 text-eyebrow font-extrabold tracking-[0.8px] text-text-tertiary uppercase">
            {tf(row.labelId)}
          </p>
          <p className="m-0 text-body-sm leading-relaxed text-text-secondary">
            <Frags parts={permit ? row.permit : row.exempt} tf={tf} />
          </p>
        </div>
      ))}
      <p
        className={`m-0 flex items-center gap-2.5 border-t border-border-3 px-4 py-3 text-body-sm font-bold ${permit ? 'bg-[#f4fafd] text-blue-safe' : 'bg-[#f0f3fa] text-[#253063]'}`}
      >
        <CheckIcon size={15} className="flex-none" />
        {tf(ids.foot)}
      </p>
    </div>
  );
}
