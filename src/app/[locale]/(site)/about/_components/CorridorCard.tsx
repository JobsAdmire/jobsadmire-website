import { getCollection } from '@/content/collections';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { CorridorLanes } from './CorridorLanes';

/**
 * The hero's corridor card (design `.ja-corridor-card`, About l. 551–603): a white r24 card,
 * the title row with the countries figure, four source-country lanes (ring marker, dashed track,
 * a flying dot per lane in its own colour, rotating through the `sourceCountries` names every
 * 2.5 s — the `CorridorLanes` island) and the Türkiye box (14 px green dot, name, "work permits
 * included"). Phones (≤ 900, l. 289–293): tighter card, one column, the Türkiye box laid out as one
 * row. The figure is the W1 countries metric with its own label, never the list length.
 */
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
  const names = getCollection(bundle, 'sourceCountries').map((c) => c.name);
  return (
    <div
      data-testid="about-corridor"
      className="rounded-hero bg-white px-[34px] pt-8 pb-9 text-ink shadow-hero-form xl:px-[25.5px] max-lg:rounded-md max-lg:px-4 max-lg:pt-[18px] max-lg:pb-5"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 max-lg:mb-4">
        <h2 className="m-0 text-card-title tracking-[-0.3px] max-lg:text-[16.5px]">
          {t('about.032')}
        </h2>
        {countriesText ? (
          <span className="text-body-sm font-bold whitespace-nowrap text-blue-safe">
            {countriesText} {countriesLabel}
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-5.5 max-lg:grid-cols-1 max-lg:gap-3.5">
        <CorridorLanes names={names} />
        <div className="flex flex-col items-center gap-2 rounded-base border border-edge bg-pale-1 px-6 py-5 max-lg:flex-row max-lg:justify-center max-lg:gap-2.5 max-lg:rounded-sm max-lg:px-4 max-lg:py-3">
          <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded-pill bg-success" />
          <span className="text-[17px] font-extrabold xl:text-[12.75px]">{t('about.033')}</span>
          <span className="text-[12px] font-semibold whitespace-nowrap text-text-tertiary xl:text-[11px]">
            {t('about.034')}
          </span>
        </div>
      </div>
    </div>
  );
}
