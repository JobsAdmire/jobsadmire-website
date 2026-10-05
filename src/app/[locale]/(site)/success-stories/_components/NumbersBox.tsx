import type { ReactNode } from 'react';
import { getCollection, type Metric } from '@/content/collections';
import { makeTf } from '@/content/pure';
// By module path (W147): a barrel import of `@/design/primitives` from this server component
// would make every 'use client' primitive it re-exports (RadioChips, Stat…) a client reference
// of the whole route, even though this file itself has no directive.
import { SampleTag } from '@/design/blocks/SampleTag';
import { Section } from '@/design/primitives/Section';
import { Stat } from '@/design/primitives/Stat';
import type { Locale } from '@/i18n/routing';
import { formatInt, formatPercent } from '@/lib/format/money';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import { SAMPLE_KPIS, type SampleKpi } from '../_lib/sample';
import type { NegativeKpi } from '../_lib/signoff';

const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null));

/** The figure's face (design L697: 32 px / 800 / −1 px, 24 px on a phone). */
const FIGURE =
  'm-0 mb-2.5 text-[32px] leading-none font-extrabold tracking-[-1px] text-white max-md:mb-1.5 max-md:text-[24px] xl:text-[24px] xl:tracking-[-0.75px]';
const LABEL =
  'm-0 mb-[0.4375rem] text-[14px] font-extrabold text-white max-md:mb-1 max-md:text-[13.5px] xl:text-[11px]';
const BODY =
  'm-0 text-[13px] leading-[1.5] font-semibold text-[#9fadd0] max-md:text-[12.5px] max-md:leading-[1.45] xl:text-[11px]';

function sampleFigure(f: SampleKpi['figure'], locale: Locale, t: (id: string) => string): string {
  if ('percent' in f) return formatPercent(f.percent, locale, 0);
  if ('int' in f) return formatInt(f.int, locale);
  return t(f.id);
}

/** "Numbers we do not hide" (design L686–720, success.046–057): the navy-gradient box with the
 *  sky glow, the head and four KPI cells joined by hairlines. Signed negative KPIs (the page's
 *  `NEGATIVE_KPIS`, read from the `metrics` collection — D17) render untagged; until one is
 *  signed (W1) the box shows the design's sample figures (`SAMPLE_KPIS`: %7 / +19 gün / %4 / 11)
 *  with the sample tag beside its eyebrow (parity pass, owner 2026-10-05). Owns its own
 *  `Section` (W97 analogue). Test id on an inner div (W113). */
export function NumbersBox({
  bundle,
  locale,
  kpis,
}: {
  bundle: Bundle;
  locale: Locale;
  kpis: NegativeKpi[];
}) {
  const t = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'metrics');
  const real = kpis
    .map((k) => ({ kpi: k, metric: rows.find((m) => m.key === k.key) }))
    .filter((x): x is { kpi: NegativeKpi; metric: Metric } => signed(x.metric));
  const sample = real.length === 0;
  const cells: { key: string; figure: ReactNode; body: string }[] = sample
    ? SAMPLE_KPIS.map((k) => ({
        key: k.labelId,
        figure: (
          <>
            <p className={FIGURE}>{sampleFigure(k.figure, locale, t)}</p>
            <p className={LABEL}>{t(k.labelId)}</p>
          </>
        ),
        body: t(k.bodyId),
      }))
    : real.map(({ kpi, metric }) => ({
        key: kpi.key,
        figure: (
          <Stat
            value={metric.value ?? undefined}
            text={metric.text ?? undefined}
            suffix={metric.unitId ? `${metric.suffix} ${t(metric.unitId)}` : metric.suffix}
            label={t(kpi.labelId)}
            locale={locale}
            tone="dark"
            className="mb-[0.4375rem]"
          />
        ),
        body: t(kpi.bodyId),
      }));
  return (
    <Section tone="light" className="ja-reveal pt-0 pb-[4.75rem] max-md:pb-10">
      <div className="container-site">
        <div
          data-testid="stories-numbers"
          className="relative overflow-hidden rounded-hero bg-[linear-gradient(158deg,var(--color-indigo)_0%,#1c2652_52%,#131c40_100%)] px-6 py-[3.25rem] text-white max-md:rounded-md max-md:px-[18px] max-md:py-6 lg:px-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-[6.875rem] h-[32.5rem] w-[32.5rem] rounded-pill bg-[radial-gradient(circle,rgba(24,153,213,0.3)_0%,rgba(24,153,213,0)_68%)]"
          />
          <div className="relative">
            <div className="mb-[2.375rem] max-w-[40rem] max-md:mb-5">
              <div className="mb-[0.8125rem] flex flex-wrap items-center gap-2.5">
                <p className="m-0 text-eyebrow font-extrabold tracking-[1.6px] text-sky uppercase">
                  {t('success.046')}
                </p>
                {sample && <SampleTag tone="dark" />}
              </div>
              <h2 className="m-0 mb-3.5 text-h2 text-white max-md:text-[24px] max-md:tracking-[-0.7px]">
                {t('success.047')}
              </h2>
              <p className="m-0 text-body leading-[1.6] font-semibold text-[#c1cbe6] max-md:text-[14.5px] max-md:leading-[1.55]">
                {t('success.048')}
              </p>
            </div>
            <ul className="m-0 grid list-none gap-px overflow-hidden rounded-md border border-white/[0.14] bg-white/[0.14] p-0 max-md:rounded-sm lg:grid-cols-4">
              {cells.map((c) => (
                <li
                  key={c.key}
                  className="bg-[rgba(11,18,44,0.5)] px-6 py-[1.625rem] max-md:px-4 max-md:py-[15px]"
                >
                  {c.figure}
                  <p className={BODY}>{c.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
