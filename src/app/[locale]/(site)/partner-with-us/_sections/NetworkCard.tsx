import { NETWORK_IDS, type Tf } from '../_lib/content';

type RowMetric = (typeof NETWORK_IDS.rows)[number]['metric'];

/** The figure colours of the design's rows, AA on white (D20: `warning-text`, not #f59e0b). */
const FIGURE: Record<RowMetric, string> = {
  countries: 'text-[#35468a]',
  placed: 'text-warning-text',
};

/**
 * "Our network today" (the hero's right column): one row per SIGNED metric (W1) — the design's
 * "5+ HR agencies", "20+ sourcing partners" rows have no metric and are not rendered; a row
 * whose metric value is empty is dropped rather than shown with a typed number. The design's
 * desktop/phone label pairs both render, switched by CSS (W10); no count-up animation.
 */
export function NetworkCard({ tf, metrics }: { tf: Tf; metrics: Record<string, string> }) {
  const rows = NETWORK_IDS.rows.filter((row) => (metrics[row.metric] ?? '') !== '');
  return (
    <div
      data-testid="partner-network"
      className="min-w-0 rounded-hero bg-white p-5 text-ink shadow-hero-form md:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-card-title font-extrabold">{tf(NETWORK_IDS.heading)}</h2>
        <span className="inline-flex items-center gap-2 text-eyebrow font-extrabold uppercase tracking-[0.8px] xl:tracking-[0.6px] text-success-text">
          <span aria-hidden="true" className="inline-block h-2 w-2 rounded-pill bg-success" />
          {tf(NETWORK_IDS.live)}
        </span>
      </div>
      {rows.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-1 md:gap-0">
          {rows.map((row) => (
            <li
              key={row.metric}
              className="flex flex-col gap-0.5 rounded-xs border border-border-4 bg-pale-3 px-3 py-3 md:flex-row md:items-baseline md:gap-4 md:rounded-none md:border-0 md:border-t md:bg-transparent md:px-0 md:py-4 md:last:border-b"
            >
              <span
                className={`min-w-0 text-[23px] xl:text-[17.25px] font-extrabold tracking-[-0.5px] xl:tracking-[-0.375px] md:min-w-[74px] md:text-stat ${FIGURE[row.metric]}`}
              >
                {metrics[row.metric]}
              </span>
              <span className="text-body-sm text-text-secondary">
                <span className="max-md:hidden">{tf(row.deskId)}</span>
                <span className="md:hidden">{tf(row.mobId)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-4 text-body-sm text-text-tertiary">{tf(NETWORK_IDS.footnote)}</p>
    </div>
  );
}
