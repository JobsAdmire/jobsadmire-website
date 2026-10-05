'use client';
import { useState } from 'react';
// Direct file imports, never a barrel: `@/design/primitives` re-exports every primitive, and
// `@/design/blocks` (which this file never imports at all — see below) re-exports PostCard,
// which imports `@/lib/format/date`, which imports both message JSON files, plus FaqBlock,
// Breadcrumbs and OfficeCard — one barrel import from a client island would drag all of that
// into the client graph (W13/W147; WP2b check, finding B-1). The cards' document frames
// (`ImageSlot`, the watermark) are rendered on the server and handed in as nodes for the same
// reason: this island's own client graph is `RadioChips` + `Button` + `StoryCard`, nothing more.
import { Button } from '@/design/primitives/Button';
import { RadioChips, type RadioChipOption } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import {
  ALL_SECTORS,
  phoneHidden,
  phoneWall,
  PHONE_SLIDES,
  wallResultLabels,
  type WallCard,
  type WallResultCopy,
} from '../_lib/wall';
import { StoryCard, StorySlide, type CardCopy } from './StoryCard';

/** Every label the wall shows, resolved on the server (W148: no `useTranslations` here). */
export type WallCopy = CardCopy & {
  /** `sys.stories.wall.legend` — the chips' (visually hidden) legend */
  legend: string;
  /** `success.144` / `success.145` — the phone slider's "En son onaylar" / "En son — <sektör>" */
  latestAll: string;
  latestPrefix: string;
  /** `success.039` — "Kaydırın →" */
  swipe: string;
  /** `success.136` / `success.135` — the phone list's toggle */
  moreShow: string;
  moreHide: string;
  /** `success.042` — the lock pill "İsimler otomatik olarak filigranlanır ve karartılır" */
  watermarkNote: string;
  /** `success.134` — the design's amber sample badge; absent once real approvals render */
  sampleBadge?: string;
  /** `success.043–045` — a sector chip with no card */
  noneInSector: { title: string; body: string; reset: string };
};

/** The lock glyph of the watermark pill (design L592). */
function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-blue"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/**
 * The approvals wall (design #cases, L492–684): single-select sector chips (the design's seven,
 * navy when checked, one scrolling row on a phone), then
 * - ≤ 700 px only: the "EN SON ONAYLAR · Kaydırın →" slider of the filter's first three cards;
 * - the meta row: the result line, the design's amber sample badge (sample mode) and the lock
 *   pill (hidden on a phone);
 * - the card grid (three columns from 901 px; on a phone the compact list of cards 4–7, then
 *   all of them after "Tüm onayları göster");
 * - or, when a chip has no card, the design's own "No approval published in that sector yet"
 *   (success.043–045) with a reset.
 * Filter, open-card and list state are component state only — facet views canonicalise to the
 * base page (PRD §4) and no filter event exists (W12: `approval_filter` is not allow-listed).
 * Calls no `useTranslations` (W148): every label arrives resolved, the result line as raw
 * `{token}` templates it fills itself (`wallResultLabels`). A light island without
 * `next/dynamic`: it is the page's main content (W13 amended).
 */
export function ApprovalsWall({
  sectors,
  cards,
  locale,
  copy,
  resultTemplates,
}: {
  /** `all` first, then the design's six sector chips with their resolved labels. */
  sectors: RadioChipOption[];
  cards: WallCard[];
  locale: Locale;
  copy: WallCopy;
  resultTemplates: WallResultCopy;
}) {
  const [sector, setSector] = useState<string>(ALL_SECTORS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const shown = sector === ALL_SECTORS ? cards : cards.filter((c) => c.sector === sector);
  const { listEmpty, hasMore } = phoneWall(shown.length);
  const latest =
    sector === ALL_SECTORS
      ? copy.latestAll
      : `${copy.latestPrefix} ${sectors.find((s) => s.value === sector)?.label ?? ''}`;
  const toggle = (id: string) => () => setOpenId((o) => (o === id ? null : id));

  return (
    <div data-testid="stories-wall">
      <RadioChips
        name="sector"
        options={sectors}
        value={sector}
        onChange={setSector}
        legend={copy.legend}
        legendHidden
        face="navy"
        scroll
        // The design's phone row bleeds to the screen edges (`margin: 0 -20px; padding: 2px
        // 20px`): the fieldset takes the 20 px gutter back and its chip row pads it in again.
        className="mb-4 max-md:-mx-5 max-md:mb-3.5 max-md:[&>div]:mx-0 max-md:[&>div]:px-5"
      />

      {shown.length === 0 ? (
        <div
          role="status"
          data-testid="stories-none-in-sector"
          className="flex flex-col items-center rounded-md border-[1.5px] border-dashed border-edge bg-white px-6 py-[2.125rem] text-center"
        >
          <h3 className="m-0 mb-[7px] text-[16.5px] font-extrabold text-ink xl:text-[12.375px]">
            {copy.noneInSector.title}
          </h3>
          <p className="m-0 mb-4 max-w-[32.5rem] text-[14.5px] font-semibold text-text-secondary xl:text-[11px]">
            {copy.noneInSector.body}
          </p>
          <Button variant="primary" shape="rect" radius={11} onClick={() => setSector(ALL_SECTORS)}>
            {copy.noneInSector.reset}
          </Button>
        </div>
      ) : (
        <>
          <div data-testid="stories-slider" className="-mx-5 mb-3.5 md:hidden">
            <div className="flex items-center justify-between gap-2.5 px-5 pb-[9px]">
              <span className="text-[11px] font-extrabold tracking-[1.2px] text-blue-safe uppercase">
                {latest}
              </span>
              <span aria-hidden="true" className="text-[11px] font-bold text-text-tertiary">
                {copy.swipe}
              </span>
            </div>
            <ul className="m-0 flex list-none snap-x snap-mandatory scroll-pl-5 gap-2.5 overflow-x-auto px-5 pb-1.5 [scrollbar-width:none]">
              {shown.slice(0, PHONE_SLIDES).map((card) => (
                <li key={card.id} className="min-w-0 shrink-0 basis-[84%] snap-start">
                  <StorySlide
                    card={card}
                    copy={copy}
                    open={openId === card.id}
                    onToggle={toggle(card.id)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div
            data-testid="stories-meta"
            className="mb-[1.125rem] flex flex-wrap items-center justify-between gap-4 max-md:mb-3 max-md:gap-2"
          >
            <p
              data-testid="stories-result"
              aria-live="polite"
              className="m-0 text-body-sm font-extrabold text-text-tertiary"
            >
              {wallResultLabels(resultTemplates, shown.length, cards.length, locale)}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {copy.sampleBadge && (
                <span
                  data-testid="stories-sample-badge"
                  className="inline-flex items-center gap-[7px] rounded-pill border border-amber-border bg-amber-surface px-3.5 py-1.5 text-[12.5px] font-extrabold text-warning-text xl:text-[11px]"
                >
                  {copy.sampleBadge}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-pill border border-edge bg-pale-1 px-3.5 py-1.5 text-[12.5px] font-bold text-text-tertiary max-md:hidden xl:text-[11px]">
                <LockIcon />
                {copy.watermarkNote}
              </span>
            </div>
          </div>

          <ul
            data-testid="stories-grid"
            className={[
              'm-0 grid list-none gap-[1.125rem] p-0 max-md:gap-2.5 lg:grid-cols-3',
              listEmpty ? 'max-md:hidden' : null,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {shown.map((card, i) => (
              <li
                key={card.id}
                className={phoneHidden(i, moreOpen) ? 'min-w-0 max-md:hidden' : 'min-w-0'}
              >
                <StoryCard
                  card={card}
                  copy={copy}
                  open={openId === card.id}
                  onToggle={toggle(card.id)}
                />
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              type="button"
              data-testid="stories-more"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((o) => !o)}
              className="mt-3 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-[1.5px] border-edge bg-white text-[14.5px] font-extrabold text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe md:hidden"
            >
              {moreOpen ? copy.moreHide : copy.moreShow}
            </button>
          )}
        </>
      )}
    </div>
  );
}
