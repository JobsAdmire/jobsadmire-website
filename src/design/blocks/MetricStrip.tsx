import { getCollection, type Metric, type MetricKey } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { Stat } from '@/design/primitives';
import type { Locale } from '@/i18n/routing';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** Signed = a number or a text, and a label. Anything else is hidden, never rendered as 0 (W1). */
const signed = (m: Metric | undefined): m is Metric =>
  Boolean(m && (m.value !== null || m.text !== null) && m.labelId !== null);

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
}: {
  bundle: Bundle;
  locale: Locale;
  metrics: MetricKey[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const t = makeTf(bundle, locale);
  const rows = getCollection(bundle, 'metrics');
  const shown = metrics.map((key) => rows.find((r) => r.key === key)).filter(signed);
  if (shown.length === 0) return null;
  const divider = tone === 'dark' ? 'divide-white/15' : 'divide-border-1';
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
      {shown.map((m) => (
        <li key={m.key} className="px-4 first:pl-0 last:pr-0">
          <Stat
            value={m.value ?? undefined}
            text={m.text ?? undefined}
            suffix={m.unitId ? `${m.suffix} ${t(m.unitId)}` : m.suffix}
            label={t(m.labelId as string)}
            locale={locale}
            tone={tone}
          />
        </li>
      ))}
    </ul>
  );
}
