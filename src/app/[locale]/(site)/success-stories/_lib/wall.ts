import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';

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
 * form; the English "Showing all 1 approvals" reading at n = 1 is the page's own accepted
 * precedent (design delta 10 — the card headcount's "1 work permits").
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
