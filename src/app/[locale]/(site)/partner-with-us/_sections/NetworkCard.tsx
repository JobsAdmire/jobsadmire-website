import { SampleTag } from '@/design/blocks/SampleTag';
import { Stat } from '@/design/primitives/Stat';
import type { Locale } from '@/i18n/routing';
import type { Metric } from '@/content/collections';
import { NETWORK_IDS, type Tf } from '../_lib/content';

type Row = (typeof NETWORK_IDS.rows)[number];

/** The design's figure colours (#1899D5 / #16a34a / #35468a / #f59e0b) in their AA forms on
 *  white and on the phone tiles' pale ground (D20: blue-safe, success-text, warning-text). */
const FIGURE: Record<Row['tone'], string> = {
  blue: 'text-blue-safe',
  green: 'text-success-text',
  indigo: 'text-[#35468a]',
  amber: 'text-warning-text',
};

/** The row's figure: the design's sample (5+ / 20+, W1 — shown with the `SampleTag`) or the
 *  signed metric, numeric (count-up) or text (verbatim). `null` drops the row (an unsigned
 *  metric is hidden, never typed). */
function figureOf(row: Row, metrics: readonly Metric[]) {
  if ('sample' in row) return { value: row.sample.value, suffix: row.sample.suffix };
  const m = metrics.find((x) => x.key === row.metric);
  if (!m) return null;
  if (m.text) return { text: m.text };
  return m.value === null ? null : { value: m.value, suffix: m.suffix };
}

/**
 * "Our network today" (the hero's right column, Partner With Us ll. 516–541): the design's four
 * rows in its order — the HR-agency and sourcing-partner rows carry the design's sample figures
 * with the `SampleTag` (owner 2026-10-05), the countries and placed rows their signed metric (W1).
 * The figure counts up from 0 once in view (`Stat`: 900 ms ease-out cubic, never under reduced
 * motion — the final value ships in the HTML and is the accessible name); the design's
 * desktop/phone label pairs both render, switched by CSS (W10). Motion (src/design/motion/
 * motion.css): the card rises in (`.ja-card-in`), its rows slide in 140 ms apart once in view
 * (`.ja-reveal-group` + `.ja-net-row`), the "growing weekly" dot pulses (`.ja-live`). On phones
 * the rows are the design's 2 × 2 tiles.
 */
export function NetworkCard({
  tf,
  metrics,
  locale,
}: {
  tf: Tf;
  metrics: readonly Metric[];
  locale: Locale;
}) {
  const rows = NETWORK_IDS.rows.flatMap((row) => {
    const figure = figureOf(row, metrics);
    return figure ? [{ row, figure }] : [];
  });
  return (
    <div
      data-testid="partner-network"
      className="ja-card-in min-w-0 rounded-hero border border-white/10 bg-white px-8 py-[30px] text-ink shadow-hero-form max-md:rounded-md max-md:px-[17px] max-md:py-[18px] xl:py-[22.5px]"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 max-md:mb-3.5">
        <h2 className="m-0 text-[19px] font-extrabold tracking-[-0.3px] max-md:text-[17px] xl:text-[14.25px] xl:tracking-[-0.225px]">
          {tf(NETWORK_IDS.heading)}
        </h2>
        <span className="inline-flex items-center gap-[7px] xl:gap-[5.25px] text-[12px] font-extrabold tracking-[0.8px] text-success-text uppercase max-md:text-[11px] xl:text-[11px] xl:tracking-[0.6px]">
          <span
            aria-hidden="true"
            className="ja-live inline-block h-[9px] w-[9px] rounded-pill bg-success"
          />
          {tf(NETWORK_IDS.live)}
        </span>
      </div>
      {rows.length > 0 && (
        <ul className="ja-reveal-group m-0 grid list-none grid-cols-1 p-0 max-md:grid-cols-2 max-md:gap-2">
          {rows.map(({ row, figure }) => (
            <li
              key={row.key}
              data-sample={'sample' in row ? '' : undefined}
              className="ja-net-row flex items-baseline gap-3.5 border-t border-border-4 py-[15px] last:border-b max-md:flex-col max-md:items-start max-md:gap-0.5 max-md:rounded-[13px] max-md:border max-md:bg-pale-2 max-md:px-[13px] max-md:py-3 max-md:last:border-b xl:py-[11.25px]"
            >
              {/* `Stat` observes its own root, so the root keeps a box (never `contents`); its
                  label slot stays empty — the row's label pair sits beside it. */}
              <Stat
                {...figure}
                label=""
                locale={locale}
                className="min-w-[74px] shrink-0 max-md:min-w-0 xl:min-w-[55.5px]"
                figureClassName={`m-0 text-[28px] leading-none font-extrabold tracking-[-0.5px] max-md:text-[23px] max-md:tracking-[-0.8px] xl:text-[21px] xl:tracking-[-0.375px] ${FIGURE[row.tone]}`}
                labelClassName="hidden"
              />
              <span className="min-w-0 text-[15px] leading-[1.5] text-text-secondary max-md:text-[12.5px] max-md:leading-[1.35] max-md:font-semibold max-md:text-text-tertiary xl:text-[11.25px]">
                <span className="max-md:hidden">{tf(row.deskId)}</span>
                <span className="md:hidden">{tf(row.mobId)}</span>
              </span>
              {'sample' in row && (
                <SampleTag className="ml-auto self-center max-md:mt-1 max-md:ml-0 max-md:self-start" />
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-[18px] text-[13.5px] leading-[1.55] text-text-tertiary max-md:mt-3.5 max-md:text-[12.5px] xl:mt-[13.5px] xl:text-[11px] xl:text-pretty">
        {tf(NETWORK_IDS.footnote)}
      </p>
    </div>
  );
}
