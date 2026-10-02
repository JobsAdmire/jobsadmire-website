'use client';
import { useState, type ReactNode } from 'react';
// Direct file imports, never a barrel: `@/design/primitives` re-exports every primitive, and
// `@/design/blocks` (which this file never imports at all — see below) re-exports PostCard,
// which imports `@/lib/format/date`, which imports both message JSON files, plus FaqBlock,
// Breadcrumbs and OfficeCard — one barrel import from a client island would drag all of that
// into the client graph (W13/W147; WP2b check, finding B-1). The W6 empty state is rendered on
// the server by the page and handed in as a `ReactNode` for the same reason: this island's own
// client graph is exactly `RadioChips` + `Button` + `Card` (via `StoryCard`), nothing more.
import { Button } from '@/design/primitives/Button';
import { RadioChips, type RadioChipOption } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import type { StoryCardData } from '../_lib/stories';
import { ALL_SECTORS, wallResultLabels, type WallResultCopy } from '../_lib/wall';
import { StoryCard } from './StoryCard';

/**
 * The approvals wall (design #cases): single-select sector chips over the card grid. Two empty
 * states, both by data: the collection is empty → `emptyState` (the page's server-rendered
 * W6 "first approvals are on their way" card, `data-testid="stories-empty"`); a sector has no
 * card → the design's own "No approval published in that sector yet" (success.043–045) with a
 * reset. Filter state is component state only — facet views canonicalise to the base page
 * (PRD §4) and no filter event exists (W12: `approval_filter` is not allow-listed). Calls no
 * `useTranslations` (W148): `legend`, `resultTemplates`, `noneInSector` and `approvedLabel`
 * arrive resolved (or, for the result line, as raw `{token}` templates it interpolates itself
 * with `wallResultLabels`). A light island without `next/dynamic`: it is the page's main
 * content (W13 amended).
 */
export function ApprovalsWall({
  sectors,
  stories,
  locale,
  legend,
  resultTemplates,
  emptyState,
  noneInSector,
  approvedLabel,
}: {
  /** `all` first, then the site's sector keys with their resolved labels. */
  sectors: RadioChipOption[];
  stories: StoryCardData[];
  locale: Locale;
  legend: string;
  resultTemplates: WallResultCopy;
  emptyState: ReactNode;
  noneInSector: { title: string; body: string; reset: string };
  approvedLabel: string;
}) {
  const [sector, setSector] = useState<string>(ALL_SECTORS);
  const shown = sector === ALL_SECTORS ? stories : stories.filter((s) => s.sector === sector);

  return (
    <div data-testid="stories-wall">
      <RadioChips
        name="sector"
        options={sectors}
        value={sector}
        onChange={setSector}
        legend={legend}
        legendHidden
        className="mb-5"
      />

      {stories.length === 0 ? (
        emptyState
      ) : shown.length === 0 ? (
        <div
          role="status"
          data-testid="stories-none-in-sector"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-1 bg-white px-6 py-10 text-center"
        >
          <h3 className="m-0 text-card-title text-ink">{noneInSector.title}</h3>
          <p className="m-0 max-w-[520px] text-body-sm text-text-secondary">{noneInSector.body}</p>
          <Button variant="primary" className="mt-2" onClick={() => setSector(ALL_SECTORS)}>
            {noneInSector.reset}
          </Button>
        </div>
      ) : (
        <>
          <p
            data-testid="stories-result"
            className="m-0 mb-4 text-body-sm font-extrabold text-text-tertiary"
          >
            {wallResultLabels(resultTemplates, shown.length, stories.length, locale)}
          </p>
          <ul
            data-testid="stories-grid"
            className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((card) => (
              <li key={card.id} className="min-w-0">
                <StoryCard card={card} approvedLabel={approvedLabel} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
