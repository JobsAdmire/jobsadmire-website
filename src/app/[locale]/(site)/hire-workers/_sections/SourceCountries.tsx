import { getCollection } from '@/content/collections';
import { isFlagCode } from '@/design/assets/flag-codes';
import { SourceMap, sourceMapLabels } from '@/design/assets/source-map';
import { Flag } from '@/design/Flag';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { PausableMarquee } from '@/design/primitives/PausableMarquee';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { PinIcon } from '../_components/icons';
import { countryName } from '../_lib/countries';
import { sp } from '../_lib/fragments';

/** The design's chip order (`sourceCountries` default, Hire Workers l. 1864): the collection is in
 *  its own order, so the page sorts the codes it knows by this list and keeps any other code
 *  after them in collection order — a CMS-added country still shows. */
const DESIGN_ORDER = ['PK', 'NP', 'UZ', 'IN', 'LK', 'KG', 'TM', 'PH', 'ID', 'RU', 'ML', 'CM', 'SN'];
function designRank(code: string): number {
  const i = DESIGN_ORDER.indexOf(code);
  return i === -1 ? DESIGN_ORDER.length : i;
}

function FlagChip({ code, name }: { code: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill border border-tint-border bg-white px-3.5 py-1.5 text-body-sm font-bold text-text-secondary">
      {isFlagCode(code) ? <Flag code={code} size={16} /> : null}
      {name}
    </span>
  );
}

/** Design `.ja-sc`: copy + the build-time map (W14) + flag chips. ≤ 700 px (W10): the copy
 *  column dissolves (`max-md:contents`) so the note moves under the map, and the chips become
 *  the design's 34 s pausable marquee; from 701 px they wrap statically. */
export function SourceCountries({
  bundle,
  tf,
  countries,
  sys,
}: {
  bundle: Bundle;
  tf: (id: string) => string;
  /** metricValues(...).countries — '' when unsigned (W1: the heading falls back to hire.140) */
  countries: string;
  /** sys.hire.sc.* + sys.marquee.*, resolved by the page */
  sys: { titleTail: string; mapTitle: string; pause: string; play: string };
}) {
  // Array.prototype.sort is stable: unknown codes keep their collection order after the known
  const rows = [...getCollection(bundle, 'sourceCountries')].sort(
    (x, y) => designRank(x.code) - designRank(y.code),
  );
  const a = tf('hire.141'); // TR: deliberately '' (never the EN fallback — PRD §3)
  const b = tf('hire.142');
  return (
    <div className="bg-white pb-16 pt-6 lg:pt-15">
      <div className="container-site" data-testid="hire-source-countries">
        <div className="flex flex-col gap-10 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 max-md:gap-0 max-md:rounded-lg max-md:px-4.5 max-md:py-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-14 lg:py-12 xl:grid-cols-[1fr_1fr]">
          <div className="max-md:contents">
            <Eyebrow>{tf('hire.140')}</Eyebrow>
            <h2 className="m-0 mb-4 mt-3 text-h2 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px] max-md:mb-2.5 max-md:text-[25px] max-md:leading-[1.12] max-md:tracking-[-0.5px]">
              {countries ? (
                <>
                  {a}
                  {sp(a, countries)}
                  <span className="text-blue-safe">
                    {countries}
                    {b}
                  </span>
                  {sys.titleTail}
                </>
              ) : (
                tf('hire.140')
              )}
            </h2>
            {/* the design's lede is 16 px / 600 */}
            <p className="m-0 mb-5 text-body leading-[1.65] font-semibold text-text-secondary max-md:mb-4 max-md:text-[14.5px] max-md:leading-[1.55]">
              {tf('hire.143')}
            </p>
            <div className="flex items-start gap-3 rounded-sm border border-tint-border bg-white px-5 py-4 max-md:order-1 max-md:mt-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-input bg-success-surface text-success"
              >
                <PinIcon />
              </span>
              <div>
                <p className="m-0 text-body font-extrabold text-ink">{tf('hire.144')}</p>
                <p className="m-0 mt-0.5 text-body-sm text-text-secondary">{tf('hire.145')}</p>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            {/* ≤ 700 px the map bleeds 8 px past the card's padding, clipped to r14 */}
            <div
              data-testid="hire-map"
              className="max-md:-mx-2 max-md:overflow-hidden max-md:rounded-sm"
            >
              <SourceMap
                id="hire-map"
                title={sys.mapTitle}
                labels={sourceMapLabels(rows)}
                turkiyeLabel={countryName(getCollection(bundle, 'countries'), 'TR')}
              />
            </div>
            <div data-testid="hire-flags" className="mt-4.5 max-md:mt-0">
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0 max-md:hidden">
                {rows.map((c) => (
                  <li key={c.code}>
                    <FlagChip code={c.code} name={c.name} />
                  </li>
                ))}
              </ul>
              {/* ≤ 700 px: the strip runs to the card's edges under an 18 px fade (the design's
                  `.ja-sc-flagwrap`); the pause control (D20) stays, as a small pill below the
                  strip's right end instead of over the chips — clear of the fade */}
              <div className="relative -mx-4.5 mt-3.5 pb-9 motion-reduce:pb-0 [mask-image:linear-gradient(90deg,transparent_0,#000_18px,#000_calc(100%-18px),transparent_100%)] md:hidden [&_.marquee-toggle]:top-auto [&_.marquee-toggle]:right-4.5 [&_.marquee-toggle]:-bottom-9 [&_.marquee-toggle]:min-h-7 [&_.marquee-toggle]:min-w-0 [&_.marquee-toggle]:px-2.5 [&_.marquee-toggle]:text-[12px]">
                <PausableMarquee durationSec={34} labelPause={sys.pause} labelPlay={sys.play}>
                  {rows.map((c) => (
                    <FlagChip key={c.code} code={c.code} name={c.name} />
                  ))}
                </PausableMarquee>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
