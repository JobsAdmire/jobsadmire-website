import { notFound } from 'next/navigation';

/** R6: next-intl's documented 404 pattern. Without this catch-all an unmatched URL renders
 *  the root `app/not-found.tsx` outside the locale segment — no chrome, no messages, and no
 *  `lang` on `<html>`. Here the layout has already resolved the locale, so `notFound()`
 *  renders `[locale]/not-found.tsx` inside the site. */
export default function CatchAllNotFound(): never {
  notFound();
}
