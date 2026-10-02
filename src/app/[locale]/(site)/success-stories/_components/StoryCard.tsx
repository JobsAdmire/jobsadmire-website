import { Card } from '@/design/primitives/Card';
import type { StoryCardData } from '../_lib/stories';

/** The v1 approval card (D9): approved pill + sector pill, headcount + unit, roles, month · place ·
 *  countries. No scan, no document track, no watermark (v1.1). Every string arrives resolved. */
export function StoryCard({ card, approvedLabel }: { card: StoryCardData; approvedLabel: string }) {
  return (
    <Card as="article" hover className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-success-border bg-success-surface px-3 py-1 text-body-sm font-extrabold text-success-text">
          <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-success" />
          {approvedLabel}
        </span>
        <span className="rounded-pill border border-border-1 bg-pale-1 px-3 py-1 text-body-sm font-bold text-text-secondary">
          {card.sectorLabel}
        </span>
      </div>
      <p className="m-0 text-card-title font-extrabold text-ink">{card.headcountLabel}</p>
      <p className="m-0 text-body-sm text-text-secondary">{card.roles}</p>
      <p className="m-0 mt-auto text-body-sm font-bold text-text-tertiary">
        <span>{card.monthLabel}</span>
        <span aria-hidden="true"> · </span>
        <span>{card.place}</span>
        {card.countries.length > 0 && (
          <>
            <span aria-hidden="true"> · </span>
            <span>{card.countries.join(' · ')}</span>
          </>
        )}
      </p>
    </Card>
  );
}
