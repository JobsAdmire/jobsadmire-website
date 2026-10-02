import { getCollection } from '@/content/collections';
import { Flag } from '@/design/Flag';
import { isFlagCode } from '@/design/assets/flag-codes';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';

/** The design rotates four lanes through its country list every 2.5 s (about.139) and flies a
 *  dot along each (`ja-fly`). The rotation is not ported. It is the one animation on the page
 *  with no reduced-motion override, it would need a live-region-safe client island, and it
 *  adds nothing a visitor can act on (D20). So the first four `sourceCountries` rows stand
 *  still, and the dots keep the motion through CSS only. */
const LANES = 4;
const DELAY = ['', '[animation-delay:1.5s]', '[animation-delay:3s]', '[animation-delay:4.5s]'];

export function CorridorCard({
  bundle,
  t,
  countriesText,
  countriesLabel,
}: {
  bundle: Bundle;
  /** `makeTf(bundle, locale)` from the page. */
  t: (id: string) => string;
  /** `metricValues(bundle, locale).countries` — the W1 figure, never the list length. */
  countriesText: string;
  /** The countries metric's own label (`home.051`). The design's `about.142` "+ countries"
   *  suffix would print "13+", which W1 normalised to the exact 13. */
  countriesLabel: string;
}) {
  const lanes = getCollection(bundle, 'sourceCountries').slice(0, LANES);
  return (
    <div
      data-testid="about-corridor"
      className="rounded-hero bg-white p-5 text-ink shadow-hero-form sm:p-8"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-card-title">{t('about.032')}</h2>
        {countriesText ? (
          <span className="text-body-sm font-extrabold text-blue-safe">
            {countriesText} {countriesLabel}
          </span>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <ul className="m-0 grid list-none gap-3 p-0">
          {lanes.map((c, i) => (
            <li key={c.code} className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
              <span className="flex items-center gap-2 text-body-sm font-extrabold">
                {isFlagCode(c.code) ? <Flag code={c.code} size={18} /> : null}
                {c.name}
              </span>
              <span aria-hidden="true" className="relative block h-0.5 rounded-pill bg-border-1">
                <span className={`about-fly absolute inset-y-0 right-2 left-0 ${DELAY[i] ?? ''}`}>
                  <span className="absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-pill bg-blue-safe" />
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="rounded-base border border-tint-border bg-pale-1 px-4 py-3 text-center">
          <span className="block text-body font-extrabold">{t('about.033')}</span>
          <span className="block text-body-sm text-text-secondary">{t('about.034')}</span>
        </div>
      </div>
    </div>
  );
}
