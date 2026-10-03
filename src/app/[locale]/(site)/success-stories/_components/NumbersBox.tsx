import { getCollection, type Metric } from '@/content/collections';
import { makeTf } from '@/content/pure';
// By module path (W147): a barrel import of `@/design/primitives` from this server component
// would make every 'use client' primitive it re-exports (RadioChips, Stat…) a client reference
// of the whole route, even though this file itself has no directive.
import { Section } from '@/design/primitives/Section';
import { Stat } from '@/design/primitives/Stat';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../../../../contract/website-bundle.v1';
import type { NegativeKpi } from '../_lib/signoff';

const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null));

/** "Numbers we do not hide" (success.046–057): the design's dark KPI box. Every figure comes
 *  from the `metrics` collection through the page's `NEGATIVE_KPIS` table — never typed (D17).
 *  Empty table, or no listed KPI signed (W1), or a listed KPI whose metric carries neither a
 *  `value` nor a `text` → null. This component owns its own `Section` (W97 analogue): when it
 *  returns null there is no empty pale band left behind. Test id on an inner div (W113). */
export function NumbersBox({
  bundle,
  locale,
  kpis,
}: {
  bundle: Bundle;
  locale: Locale;
  kpis: NegativeKpi[];
}) {
  if (kpis.length === 0) return null;
  const rows = getCollection(bundle, 'metrics');
  const shown = kpis
    .map((k) => ({ kpi: k, metric: rows.find((m) => m.key === k.key) }))
    .filter((x): x is { kpi: NegativeKpi; metric: Metric } => signed(x.metric));
  if (shown.length === 0) return null;
  const t = makeTf(bundle, locale);
  return (
    <Section tone="band">
      <div className="container-site">
        <div
          data-testid="stories-numbers"
          className="relative overflow-hidden rounded-hero bg-gradient-to-br from-[#253063] via-[#1c2652] to-[#131c40] px-6 py-8 text-white lg:px-11 lg:py-10"
        >
          <div className="mb-8 max-w-[640px]">
            <p className="m-0 mb-3 text-eyebrow font-extrabold uppercase tracking-[1.6px] text-sky">
              {t('success.046')}
            </p>
            <h2 className="m-0 mb-3 text-h2 text-white max-md:text-[24px] max-md:tracking-[-0.7px]">
              {t('success.047')}
            </h2>
            <p className="m-0 text-body text-white/75">{t('success.048')}</p>
          </div>
          <ul className="m-0 grid list-none gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map(({ kpi, metric }) => (
              <li key={kpi.key} className="bg-navy/60 px-6 py-6">
                <Stat
                  value={metric.value ?? undefined}
                  text={metric.text ?? undefined}
                  suffix={metric.unitId ? `${metric.suffix} ${t(metric.unitId)}` : metric.suffix}
                  label={t(kpi.labelId)}
                  locale={locale}
                  tone="dark"
                />
                <p className="m-0 mt-2 text-body-sm text-white/65">{t(kpi.bodyId)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
