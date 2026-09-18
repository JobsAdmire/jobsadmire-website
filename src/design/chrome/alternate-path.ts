/**
 * R58 — the other-locale target for the two language links (`LanguageSwitcher`, `LanguageHint`).
 *
 * next-intl's `usePathname()` returns the *internal* pathname, which for a dynamic route is the
 * template itself: `/blog/[slug]`, `/careers/[slug]`. Blog and careers slugs are authored per
 * locale (D16), so the other locale's slug is not derivable from the one being read — emitting
 * the template, or guessing a slug, lands the visitor on a 404 in the language they just asked
 * for. The links therefore fall back to the route's parent index (`/blog`, `/careers`), which
 * exists in both locales.
 *
 * Pure and string-in/string-out so the rule is testable without a router. WP2's detail pages can
 * pass a real per-article alternate from the bundle's page record; until one exists, never a
 * guessed slug.
 */
export function alternatePath(internal: string): string {
  let path = internal;
  while (path.includes('[')) {
    const cut = path.lastIndexOf('/');
    // A bracket in the first segment leaves no parent index to fall back to.
    if (cut <= 0) return '/';
    path = path.slice(0, cut);
  }
  return path;
}
