'use client';
import { useId, useState } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { buttonClassName } from '@/design/primitives/Button';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Link } from '@/i18n/navigation';
import type { Engagement, Place } from '@/lib/careers-pure';
import type { RoleCard } from '../_lib/roles';

/** The design shows four roles, then "Show N more roles". */
export const INITIAL_SHOWN = 4;

export type RolesListCopy = {
  where: string; // jt.048
  engagement: string; // jt.049
  all: string; // sys.careers.filters.all
  office: string; // jt.261
  overseas: string; // jt.262
  fullTime: string; // jt.099
  partTime: string; // jt.100
  project: string; // jt.073
  apply: string; // jt.052
  ask: string; // jt.053
  newBadge: string; // jt.033
  /** sys.careers.roles.resultAll, resolved on the server (the total never changes here) */
  resultAll: string;
  /** sys.careers.roles.resultFiltered — a plain `{shown}` / `{total}` template */
  resultFiltered: string;
  /** sys.careers.roles.showMore — a plain `{count}` template */
  showMore: string;
  showFewer: string; // jt.306
  noMatchTitle: string; // jt.054
  noMatchBody: string; // jt.055
  showAll: string; // jt.056
};

type PlaceFilter = 'all' | Place;
type EngagementFilter = 'all' | Engagement;

/** `{name}` → value. The island fills its two plain templates itself and never calls
 *  `useTranslations`, so `sys.careers.*` stays out of every page's client payload (W148). */
const fillTemplate = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  );

/**
 * The live roles list (design `#roles`): Where × Engagement filters, the result line, four
 * cards then show-more / show-fewer, the no-match state. Server-rendered and hydrated — never
 * `ssr: false`: it is the page's main content and SEO-bearing (W13 amended). Every string and
 * href arrives resolved from the server; each card's "Ask a question first" link carries only
 * the role's title and location (W95).
 */
export function RolesList({ cards, copy }: { cards: RoleCard[]; copy: RolesListCopy }) {
  const listId = useId();
  const [place, setPlace] = useState<PlaceFilter>('all');
  const [engagement, setEngagement] = useState<EngagementFilter>('all');
  const [expanded, setExpanded] = useState(false);

  const matching = cards.filter(
    (c) =>
      (place === 'all' || c.place === place) &&
      (engagement === 'all' || c.engagement === engagement),
  );
  const filtered = place !== 'all' || engagement !== 'all';
  const shown = expanded ? matching : matching.slice(0, INITIAL_SHOWN);
  const more = matching.length - Math.min(matching.length, INITIAL_SHOWN);
  const result = filtered
    ? fillTemplate(copy.resultFiltered, { shown: shown.length, total: matching.length })
    : copy.resultAll;
  const clear = () => {
    setPlace('all');
    setEngagement('all');
  };

  return (
    <div data-testid="careers-roles-list">
      <div className="mb-5 flex flex-wrap items-start gap-6 rounded-[18px] border border-border-2 bg-white px-5 py-4 shadow-card">
        <RadioChips
          name="careers-place"
          legend={copy.where}
          value={place}
          onChange={(value) => setPlace(value as PlaceFilter)}
          options={[
            { value: 'all', label: copy.all },
            { value: 'office', label: copy.office },
            { value: 'overseas', label: copy.overseas },
          ]}
        />
        <RadioChips
          name="careers-engagement"
          legend={copy.engagement}
          value={engagement}
          onChange={(value) => setEngagement(value as EngagementFilter)}
          options={[
            { value: 'all', label: copy.all },
            { value: 'fullTime', label: copy.fullTime },
            { value: 'partTime', label: copy.partTime },
            { value: 'project', label: copy.project },
          ]}
        />
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mb-4 text-body-sm font-extrabold text-text-tertiary"
      >
        {result}
      </p>

      {matching.length === 0 ? (
        <div
          data-testid="careers-no-match"
          className="rounded-[18px] border-[1.5px] border-dashed border-tint-border bg-white p-8 text-center"
        >
          <p className="text-body-lg font-extrabold text-ink">{copy.noMatchTitle}</p>
          <p className="mx-auto mt-2 mb-4 max-w-[560px] text-body-sm text-text-secondary">
            {copy.noMatchBody}
          </p>
          <button type="button" onClick={clear} className={buttonClassName('primary')}>
            {copy.showAll}
          </button>
        </div>
      ) : (
        <ul id={listId} className="flex flex-col gap-3">
          {shown.map((c) => (
            <li key={c.slug}>
              <article
                data-testid="careers-role"
                data-slug={c.slug}
                data-place={c.place}
                data-engagement={c.engagement}
                className="relative overflow-hidden rounded-[18px] border border-border-2 bg-white shadow-card"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1.5 ${c.place === 'overseas' ? 'bg-[#253063]' : 'bg-blue-safe'}`}
                />
                <div className="flex flex-col gap-4 py-5 pr-6 pl-7 md:flex-row md:items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="flex flex-wrap items-center gap-2 text-card-title text-ink">
                      <Link
                        href={c.href}
                        prefetch={false}
                        className="text-ink no-underline hover:underline"
                      >
                        {c.title}
                      </Link>
                      {c.isNew && (
                        <span className="rounded-pill bg-success-surface px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-success-text">
                          {copy.newBadge}
                        </span>
                      )}
                    </h3>
                    {c.summary && (
                      <p className="mt-1 text-body-sm text-text-tertiary">{c.summary}</p>
                    )}
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-sm font-bold text-text-secondary">
                      <span>{c.location}</span>
                      {c.workModes && <span>{c.workModes}</span>}
                      <span className="text-text-tertiary">{c.posted}</span>
                    </p>
                  </div>
                  <div className="flex flex-none flex-col items-start gap-3 md:items-end">
                    <span className="rounded-pill bg-tint px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.06em] text-blue-safe">
                      {c.engagementLabel}
                    </span>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Link
                        href={c.applyHref}
                        prefetch={false}
                        aria-label={`${copy.apply}: ${c.title}`}
                        className={buttonClassName('primary')}
                      >
                        {copy.apply}
                      </Link>
                      <ContactLink
                        href={c.askHref}
                        placement="page_cta"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${copy.ask}: ${c.title}`}
                        className={buttonClassName('secondary')}
                      >
                        {copy.ask}
                      </ContactLink>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {matching.length > INITIAL_SHOWN && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((open) => !open)}
            className={buttonClassName('secondary', 'lg')}
          >
            {expanded ? copy.showFewer : fillTemplate(copy.showMore, { count: more })}
          </button>
        </div>
      )}
    </div>
  );
}
