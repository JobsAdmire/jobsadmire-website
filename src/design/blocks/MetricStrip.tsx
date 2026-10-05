import { getCollection, type Metric, type MetricKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
// By module path, not the barrel (W147): a server component's barrel import makes every
// 'use client' primitive the barrel re-exports a client reference of the page.
import { Stat } from '@/design/primitives/Stat';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';
import { SampleTag } from './SampleTag';

/** Signed = a number or a text, and a label. Anything else is hidden, never rendered as 0 (W1). */
const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null) && m.labelId !== null);

/** A static cell after the metrics — a page-local sample figure (About's "%98", SHARED 12.3)
 *  shown with the `SampleTag`, never a metric typed into copy as if it were data (D17). */
export type MetricExtra = { figure: string; label: string; sample?: boolean };

/** `grid` (default): the ruled columns. `hero` (Homepage hero, SHARED 12.1): `grid` on the
 *  dark strip, and ≤ 460 px the design's 2 × 1 + 1 fold — the third cell spans the row with its
 *  label inline beside the figure, a fourth cell hides. `pill` (About hero, 12.2): translucent
 *  rounded pills, figure + label inline, the figures sky / green / violet; one row of three on
 *  phones with hairline dividers. `centered-divided` (About stats, 12.3): centred cells with
 *  vertical #d3e6f2 dividers under a top rule; a centred 2 × 2 with a centre divider on phones. */
export type MetricStripVariant = 'grid' | 'hero' | 'pill' | 'centered-divided';

/** The pill figures' colours in order (About l. 532–543: #7fd0f5, #4ade80, #c4b5fd). */
const PILL_FIGURE = ['text-sky', 'text-[#4ade80]', 'text-[#c4b5fd]'] as const;

/** The headline-number strip (Homepage hero stats, About, Hire, Partner, Work Permit): every
 *  figure from the `metrics` collection (D17), never typed into copy. `unitId` (permitDays →
 *  home.206 "days") joins the suffix. Renders nothing when no requested metric is signed —
 *  the Phase A empty wall (W6). */
export function MetricStrip({
  bundle,
  locale,
  metrics,
  tone = 'light',
  className,
  variant = 'grid',
  extra = [],
}: {
  bundle: Bundle;
  locale: Locale;
  metrics: MetricKey[];
  tone?: 'light' | 'dark';
  className?: string;
  variant?: MetricStripVariant;
  /** static cells appended after the metrics (sample figures with the SampleTag) */
  extra?: MetricExtra[];
}) {
  const t = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'metrics');
  const shown = metrics.map((key) => rows.find((r) => r.key === key)).filter(signed);
  if (shown.length === 0 && extra.length === 0) return null;
  const suffixOf = (m: Metric) => (m.unitId ? `${m.suffix} ${t(m.unitId)}` : m.suffix);

  if (variant === 'pill') {
    return (
      <ul
        className={[
          'm-0 flex list-none flex-wrap gap-3 p-0 max-md:flex-nowrap max-md:gap-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {shown.map((m, i) => (
          <li
            key={m.key}
            className="rounded-pill border border-white/20 bg-white/[0.08] px-[18px] py-[9px] max-md:flex-1 max-md:rounded-none max-md:border-y-0 max-md:border-r-0 max-md:border-l-white/15 max-md:bg-transparent max-md:px-2 max-md:py-0 max-md:text-center max-md:first:border-l-0"
          >
            <Stat
              value={m.value ?? undefined}
              text={m.text ?? undefined}
              suffix={suffixOf(m)}
              label={t(m.labelId as string)}
              locale={locale}
              tone="dark"
              className="flex items-baseline gap-[7px] max-md:flex-col max-md:items-center max-md:gap-0.5"
              figureClassName={`m-0 text-[18px] font-extrabold max-md:text-[24px] xl:text-[13.5px] ${PILL_FIGURE[i % PILL_FIGURE.length]}`}
              labelClassName="m-0 text-[13.5px] font-semibold text-white/70 max-md:text-[11.5px] xl:text-[11px]"
            />
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'centered-divided') {
    const divider = tone === 'dark' ? 'border-white/15' : 'border-edge';
    const figure =
      tone === 'dark'
        ? 'm-0 text-[32px] font-extrabold text-white max-md:text-[26px] xl:text-[24px]'
        : 'm-0 text-[32px] font-extrabold text-ink max-md:text-[26px] xl:text-[24px]';
    const label =
      tone === 'dark'
        ? 'm-0 mt-1 text-[13.5px] font-semibold text-white/60 xl:text-[11px]'
        : 'm-0 mt-1 text-[13.5px] font-semibold text-text-tertiary xl:text-[11px]';
    const cell = `px-3 text-center md:border-r md:last:border-r-0 max-md:py-4 max-md:odd:border-r ${divider}`;
    return (
      <ul
        className={[
          `m-0 grid list-none grid-cols-2 border-t p-0 pt-8 md:grid-flow-col md:auto-cols-fr ${divider}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {shown.map((m) => (
          <li key={m.key} className={cell}>
            <Stat
              value={m.value ?? undefined}
              text={m.text ?? undefined}
              suffix={suffixOf(m)}
              label={t(m.labelId as string)}
              locale={locale}
              tone={tone}
              figureClassName={figure}
              labelClassName={label}
            />
          </li>
        ))}
        {extra.map((x) => (
          <li key={`${x.figure}-${x.label}`} className={cell}>
            <p className={figure}>{x.figure}</p>
            <p className={label}>
              {x.label}
              {x.sample ? <SampleTag className="ml-1.5" /> : null}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  const divider = tone === 'dark' ? 'divide-white/15' : 'divide-border-1';
  const hero = variant === 'hero';
  return (
    <ul
      className={[
        'm-0 grid list-none grid-cols-2 gap-y-6 p-0 lg:grid-flow-col lg:auto-cols-fr lg:divide-x',
        divider,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* QA W221 H-06 (= about-03): below lg the strip is a two-column grid, so a per-item
          `px-4 first:pl-0 last:pr-0` indented the right column and every later row by 16 px on
          phones; per column there (odd = left, flush; even = right, the 16 px gutter; no right
          padding), per item in the lg row as the design's `.ja-stat + .ja-stat` border rhythm.
          `hero` ≤ 460 (SHARED 12.1): the third cell spans the row, its label inline; a fourth
          cell hides. */}
      {shown.map((m, i) => (
        <li
          key={m.key}
          className={[
            'max-lg:odd:pl-0 max-lg:even:pl-4 max-lg:pr-0 lg:px-4 lg:first:pl-0 lg:last:pr-0',
            hero && i === 2 ? 'max-xs:col-span-2' : null,
            hero && i === 3 ? 'max-xs:hidden' : null,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Stat
            value={m.value ?? undefined}
            text={m.text ?? undefined}
            suffix={suffixOf(m)}
            label={t(m.labelId as string)}
            locale={locale}
            tone={tone}
            className={
              hero && i === 2 ? 'max-xs:flex max-xs:items-baseline max-xs:gap-2.5' : undefined
            }
          />
        </li>
      ))}
      {extra.map((x) => (
        <li
          key={`${x.figure}-${x.label}`}
          className="max-lg:odd:pl-0 max-lg:even:pl-4 max-lg:pr-0 lg:px-4 lg:first:pl-0 lg:last:pr-0"
        >
          <p
            className={
              tone === 'dark' ? 'text-stat font-extrabold text-white' : 'text-stat font-extrabold'
            }
          >
            {x.figure}
          </p>
          <p
            className={
              tone === 'dark' ? 'text-body-sm text-white/55' : 'text-body-sm text-text-secondary'
            }
          >
            {x.label}
            {x.sample ? (
              <SampleTag tone={tone === 'dark' ? 'dark' : 'light'} className="ml-1.5" />
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
}
