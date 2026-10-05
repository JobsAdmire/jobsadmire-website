import { makeTf } from '@/content/pure';
// By module path (W147): never the `@/design/blocks` barrel from page code.
import { SampleTag } from '@/design/blocks/SampleTag';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { SAMPLE_HERO_STATS, type SampleHeroStat } from '../_lib/sample';

/** The design's per-card entrance delays (`.ja-card-in`, L466–478). */
const DELAYS = ['0.08s', '0.16s', '0.24s', '0.32s'];

function Figure({ stat, locale, unit }: { stat: SampleHeroStat; locale: Locale; unit?: string }) {
  const n = formatInt(stat.value, locale);
  const sky = (glyph: string) => <span className="text-sky">{glyph}</span>;
  if (stat.percent) {
    // D18: the per-cent sign leads in Turkish (%91), trails in English (91%).
    return locale === 'tr' ? (
      <>
        {sky('%')}
        {n}
      </>
    ) : (
      <>
        {n}
        {sky('%')}
      </>
    );
  }
  return (
    <>
      {n}
      {stat.plus && sky('+')}
      {unit && <span className="text-[18px] text-white/[0.62] xl:text-[13.5px]"> {unit}</span>}
    </>
  );
}

/**
 * The hero's 2 × 2 stat cards (design `.ja-ss-stats`, L465–482): translucent white cards with a
 * hairline edge, the big figure (sky "+" / "%", muted "gün") over a bold caption, each rising in
 * on its own delay (`ja-card-in`). The figures are the design's sample (`SAMPLE_HERO_STATS` — W1:
 * none is a signed metric), so the grid carries the sample tag; a signed hero metric would render
 * through `MetricStrip` instead (the page's `STORIES_HERO_METRICS` path).
 */
export function HeroStats({ bundle, locale }: { bundle: Bundle; locale: Locale }) {
  const t = makeTf(bundle, locale);
  return (
    <div data-testid="stories-hero-stats" className="min-w-0">
      <ul className="m-0 grid list-none grid-cols-2 gap-3.5 p-0 max-md:gap-[9px]">
        {SAMPLE_HERO_STATS.map((s, i) => (
          <li
            key={s.labelId}
            className="ja-card-in rounded-md border border-white/[0.16] bg-white/[0.07] px-6 py-[1.375rem] max-md:rounded-sm max-md:px-[15px] max-md:py-3.5"
            style={{ animationDelay: DELAYS[i] }}
          >
            <p className="m-0 text-stat leading-none font-extrabold tracking-[-1.2px] text-white max-md:text-[25px] max-md:tracking-[-0.8px] xl:tracking-[-0.9px]">
              <Figure stat={s} locale={locale} unit={s.unitId ? t(s.unitId) : undefined} />
            </p>
            <p className="m-0 mt-1.5 text-body-sm leading-[1.4] font-bold text-white/[0.62] max-md:mt-1 max-md:text-[12px] max-md:leading-[1.35]">
              {t(s.labelId)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-end">
        <SampleTag tone="dark" />
      </div>
    </div>
  );
}
