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
  const rows = getCollection(bundle, 'sourceCountries');
  const a = tf('hire.141'); // TR: deliberately '' (never the EN fallback — PRD §3)
  const b = tf('hire.142');
  return (
    <div className="bg-white pb-16 pt-6 lg:pt-12">
      <div className="container-site" data-testid="hire-source-countries">
        <div className="flex flex-col gap-10 rounded-hero border border-tint-border bg-gradient-to-b from-pale-1 to-tint px-6 py-10 max-md:gap-0 max-md:rounded-lg max-md:px-4 max-md:py-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-14 lg:py-12">
          <div className="max-md:contents">
            <Eyebrow>{tf('hire.140')}</Eyebrow>
            <h2 className="m-0 mb-4 mt-3 text-h2 leading-[1.05] tracking-[-1.6px] xl:tracking-[-1.2px]">
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
            <p className="m-0 mb-5 text-body text-text-secondary">{tf('hire.143')}</p>
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
            <div data-testid="hire-map">
              <SourceMap
                id="hire-map"
                title={sys.mapTitle}
                labels={sourceMapLabels(rows)}
                turkiyeLabel={countryName(getCollection(bundle, 'countries'), 'TR')}
              />
            </div>
            <div data-testid="hire-flags" className="mt-4">
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0 max-md:hidden">
                {rows.map((c) => (
                  <li key={c.code}>
                    <FlagChip code={c.code} name={c.name} />
                  </li>
                ))}
              </ul>
              <div className="md:hidden">
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
