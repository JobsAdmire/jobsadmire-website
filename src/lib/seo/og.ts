// R23: `@/content/pure`, not the adapter — pure so `og.test.ts` runs without the server-only
// boundary and the route handler stays a thin shell around these two readers.
import { makeT } from '@/content/pure';
import type { Bundle } from '../../../contract/website-bundle.v1';

/** The two `sys` reads the OG image makes, as a plain object: the route wraps next-intl's
 *  translator, the tests pass a stub, and neither depends on the translator's generic type. */
export type SysCopy = { t: (key: string) => string; has: (key: string) => boolean };

export const OG_WORDMARK = 'JobsAdmire';
export const OG_SUBLINE_MAX = 140;

/** Title: the page record's `titleId` when the package has an SEO string (`''` = it has none,
 *  T0b/W38) → the page's own `sys.seo.<pageKey>.title` (W23) → the wordmark. Never typed copy. */
export function ogTitle(bundle: Bundle, pageKey: string, sys: SysCopy): string {
  const seo = bundle.pages[pageKey];
  if (seo?.titleId) return makeT(bundle)(seo.titleId);
  const key = `seo.${pageKey}.title`;
  return sys.has(key) ? sys.t(key) : OG_WORDMARK;
}

/** Subline: the record's `descriptionId` when non-empty, else the site tagline
 *  `sys.seo.ogTagline` (W38 — never `home.188`), word-clamped so it fits the card. */
export function ogSubline(bundle: Bundle, pageKey: string, sys: SysCopy): string {
  const seo = bundle.pages[pageKey];
  const text = seo?.descriptionId ? makeT(bundle)(seo.descriptionId) : sys.t('seo.ogTagline');
  return clampWords(text, OG_SUBLINE_MAX);
}

/** Word-boundary clamp with an ellipsis; cuts mid-word only when the first word alone is
 *  longer than half the budget. */
export function clampWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return `${text.slice(0, cut > max / 2 ? cut : max).trimEnd()}…`;
}
