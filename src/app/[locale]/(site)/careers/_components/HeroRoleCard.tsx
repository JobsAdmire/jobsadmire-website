import { Link } from '@/i18n/navigation';
import type { RoleCard } from '../_lib/roles';

export type HeroRoleCardLabels = {
  title: string; // jt.030
  lead: string; // jt.031
  live: string; // jt.032
  newBadge: string; // jt.033
  footer: string; // jt.034
  all: string; // jt.035
};

/** The design's "Overseas roles open now" card (`.ja-jt-rolecard`): up to four overseas roles,
 *  each a link to its detail page (where the full description lives — `jt.031`; rows lift on
 *  hover like the design's `.ja-ch`). Nothing when no overseas role is open (W6). The header is solid
 *  `blue-safe` with full-white text and a darkened "Live" pill (D20 — white/85 on the design's
 *  #1899d5 gradient is under 4.5:1). Up to 900 px the design shows two roles: the third and
 *  fourth are hidden by CSS, never by conditional rendering (W10, W119). */
export function HeroRoleCard({ cards, labels }: { cards: RoleCard[]; labels: HeroRoleCardLabels }) {
  if (cards.length === 0) return null;
  return (
    <section
      data-testid="careers-hero-roles"
      aria-labelledby="careers-hero-roles-title"
      // the design's `.ja-card-in` lands 0.14 s after the copy column's `.ja-up` (l. 609)
      style={{ animationDelay: '0.14s' }}
      className="ja-card-in overflow-hidden rounded-lg border border-[#d3e6f2] bg-white text-ink shadow-[0_30px_70px_rgba(6,12,36,0.42)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-safe px-6 py-5 text-white">
        <div>
          <h2 id="careers-hero-roles-title" className="text-card-title text-white">
            {labels.title}
          </h2>
          <p className="mt-1 text-body-sm text-white">{labels.lead}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/40 bg-black/15 px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-white">
          <span
            aria-hidden="true"
            className="ja-live ja-live-soft h-2 w-2 rounded-pill bg-[#86efac]"
          />
          {labels.live}
        </span>
      </div>
      <ul className="grid gap-2 p-4">
        {cards.map((c, i) => (
          <li
            key={c.slug}
            data-testid="careers-hero-role"
            data-slug={c.slug}
            className={i >= 2 ? 'max-lg:hidden' : undefined}
          >
            <Link
              href={c.href}
              prefetch={false}
              className="ja-hover-card flex items-center gap-4 rounded-base border border-[#e6f0f7] bg-[#f6fafc] px-5 py-4 text-ink no-underline hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-extrabold">{c.title}</span>
                  {c.isNew && (
                    <span className="rounded-pill bg-success-surface px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.05em] text-success-text">
                      {labels.newBadge}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2 text-body-sm font-bold text-text-tertiary">
                  <span className="truncate">{c.location}</span>
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 flex-none rounded-pill bg-[#cbd5e1]"
                  />
                  <span className="flex-none whitespace-nowrap">{c.engagementLabel}</span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-[11px] bg-tint text-blue-safe"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 px-6 pb-5">
        <span className="text-body-sm font-bold text-text-tertiary">{labels.footer}</span>
        {/* a flex item, never inline in a text block, so no underline (design l. 635; axe
            link-in-text-block does not apply); the design's hover darkens it */}
        <a
          href="#roles"
          className="text-body-sm font-extrabold text-blue-safe no-underline hover:text-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
        >
          {labels.all}
        </a>
      </div>
    </section>
  );
}
