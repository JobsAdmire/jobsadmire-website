/**
 * W148: whether the English-language hint applies to this visitor — decided BEFORE the hint's
 * code is requested. `ClientIslands` reads it and only then renders the `next/dynamic`
 * `LanguageHint`, so an ineligible visitor (every English page, a Turkish browser, a dismissed
 * hint) never downloads the sheet (≈ 3 KB gz and a request on every page). No React, no
 * next-intl: this module is the rule, its storage key and the one browser read, nothing else.
 * `LanguageHint` re-exports `shouldShowHint`/`HINT_KEY`, so their WP2a import path still works.
 */
export const HINT_KEY = 'ja-lang-hint';

/** Turkish page + an English browser + not dismissed. Pure, so the rule is testable without a
 *  DOM, and so no caller ever decides it twice. */
export function shouldShowHint(
  locale: string,
  languages: readonly string[],
  dismissed: string | null,
): boolean {
  return (
    locale === 'tr' &&
    languages.some((l) => l.toLowerCase().startsWith('en')) &&
    dismissed !== 'off'
  );
}

function readDismissal(): string | null {
  try {
    return window.localStorage.getItem(HINT_KEY);
  } catch {
    // storage blocked (private mode): treat as "not dismissed"
    return null;
  }
}

/** `shouldShowHint` over this browser's facts (`navigator.languages`, the stored dismissal).
 *  Browser-only: callers read it after hydration (R18 — `useSyncExternalStore` with a `false`
 *  server snapshot), never during the server render or the hydrating one. */
export function hintEligibleHere(locale: string): boolean {
  return shouldShowHint(locale, navigator.languages ?? [navigator.language], readDismissal());
}
