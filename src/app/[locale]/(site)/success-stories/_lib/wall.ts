import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';
import type { StoryCardData } from './stories';

/** The synthetic "all sectors" filter value (`success.124` "All sectors") — shared by the page
 *  (building the first chip option) and the island (the default filter state and its
 *  comparison), so the sentinel string lives in one place rather than two. */
export const ALL_SECTORS = 'all';

/** The two RAW (un-interpolated) `{token}` templates — `sys.stories.wall.showingAll` /
 *  `showingFiltered` — the page resolves server-side with `sys.raw(...)` and hands the island
 *  as plain strings. Never functions: a Server Component cannot pass a closure to a Client
 *  Component, and `ApprovalsWall` calls no `useTranslations` of its own, so `sys.stories.*`
 *  never joins `CLIENT_SYS` (W148). The island's own `wallResultLabels()` call below does the
 *  substitution against its live (client-state) filter counts. */
export type WallResultCopy = { showingAll: string; showingFiltered: string };

/**
 * Pure `{token}` substitution — not ICU MessageFormat, because the templates travel as plain
 * strings rather than through next-intl's client runtime. Every count goes through `formatInt`
 * (D18). Turkish nouns do not inflect for plural, so `showingAll`'s "onay" never needs a second
 * form; the English reading is "Showing all approvals (n)" (W200 — the count sits in brackets,
 * so n = 1 reads correctly); the card headcount's "1 work permits" stays the accepted design
 * delta 10 until the v1.1 cards task resolves it through ICU (W200 A2).
 */
export function wallResultLabels(
  templates: WallResultCopy,
  shown: number,
  total: number,
  locale: Locale,
): string {
  return shown === total
    ? templates.showingAll.replace('{count}', formatInt(total, locale))
    : templates.showingFiltered
        .replace('{shown}', formatInt(shown, locale))
        .replace('{total}', formatInt(total, locale));
}

/** A card as the island receives it: the resolved labels plus its two document frames, rendered
 *  on the server (`ApprovalFrame` — `ImageSlot` and the watermark read `sys.*` namespaces that
 *  stay out of `CLIENT_SYS`, W148) and handed in as React nodes: the grid card's 250 px frame
 *  and the phone slider's 172 px one. */
export type WallCard = StoryCardData & { frame: ReactNode; slideFrame: ReactNode };

/** The design's phone wall (≤ 700 px, `.ja-ss-slider` / `.ja-ss-grid` / `.ja-ss-more`): the
 *  first three approvals of the current filter ride the swipe slider; the compact list below it
 *  carries the rest — cards 4–7 at first, every card after "Tüm onayları göster". */
export const PHONE_SLIDES = 3;
export const PHONE_LIST_FIRST = 7;

/** `.ja-ss-listempty` (≤ 3 cards: the slider holds them all, no list) and `.ja-ss-nomore`
 *  (≤ 7: no "show all" toggle). */
export function phoneWall(count: number): { listEmpty: boolean; hasMore: boolean } {
  return { listEmpty: count <= PHONE_SLIDES, hasMore: count > PHONE_LIST_FIRST };
}

/** Whether the compact list hides the card at `index` on a phone: the slider's three, and —
 *  until the visitor opens the list — everything past the seventh. */
export function phoneHidden(index: number, moreOpen: boolean): boolean {
  return index < PHONE_SLIDES || (!moreOpen && index >= PHONE_LIST_FIRST);
}
