import { useTranslations } from 'next-intl';
import { makeTf, metricValues } from '@/content/pure';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { SeasonGrid, type SeasonGridCopy, type SeasonRowView } from '../components/SeasonGrid';
import { SeasonPlannerIsland } from '../components/SeasonPlannerIsland';
import { monthNames, SEASON_ROWS, seasonHeadline, seasonRange, type SeasonTx } from '../lib/season';
import { H2, LEAD } from './styles';
import type { SectionProps } from './types';

/** "Season planner" (home.096–103, 217, 243–253). The rows' copy is the package's; the month
 *  ranges are data (`SEASON_ROWS`); the composed lines are `sys.home.season.*` (W9) with Intl
 *  month names; "45 days" in the no-peak line is the `permitDays` metric (W1). */
export function SeasonSection({ locale, bundle }: SectionProps) {
  const tf = makeTf(bundle, locale);
  const sys = useTranslations('sys');
  const permitDays = metricValues(bundle, locale).permitDays ?? '';
  const short = monthNames(locale, 'short');
  const long = monthNames(locale, 'long');
  const tx: SeasonTx = {
    range: (args) => sys('home.season.range', args),
    also: (args) => sys('home.season.also', args),
    signBy: (args) => sys('home.season.signBy', args),
    noPeak: () => sys('home.season.noPeak', { permitDays }),
  };
  const rows: SeasonRowView[] = SEASON_ROWS.map((row) => ({
    key: row.key,
    name: tf(row.nameId),
    sub: row.subId ? tf(row.subId) : sys('home.season.agricultureSub'),
    note: tf(row.noteId),
    range: seasonRange(row, short, tx),
    headline: seasonHeadline(row, long, tx),
    peak: row.peak,
    second: row.second,
  }));
  const copy: SeasonGridCopy = {
    gridLabel: sys('home.season.gridLabel'),
    hint: sys('home.season.selectHint'),
    legend: { peak: tf('home.100'), second: tf('home.101'), now: tf('home.102') },
    cta: tf('home.103'),
  };
  const heading = (
    <div className="min-w-0">
      <Eyebrow>{tf('home.096')}</Eyebrow>
      <h2 className={`${H2} mb-2.5 mt-3`}>{tf('home.097')}</h2>
      <p className={`${LEAD} m-0 max-w-[620px] xl:max-w-[465px]`}>
        {tf('home.098')}
        <span className="max-xs:hidden"> {tf('home.099')}</span>
      </p>
    </div>
  );
  return (
    <Section tone="light" id="season">
      <div className="container-site">
        <SeasonPlannerIsland
          fallback={
            <SeasonGrid
              heading={heading}
              monthsShort={short}
              rows={rows}
              selected={0}
              nowMonth={null}
              nowLabel={null}
              copy={copy}
            />
          }
          heading={heading}
          monthsShort={short}
          rows={rows}
          nowPrefix={tf('home.217')}
          copy={copy}
        />
      </div>
    </Section>
  );
}
