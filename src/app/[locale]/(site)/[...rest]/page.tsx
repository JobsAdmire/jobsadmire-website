import { notFound } from 'next/navigation';

/** R6: next-intl's documented 404 pattern. Without this catch-all an unmatched URL renders
 *  Next's own built-in `/_not-found` outside the locale segment — no chrome, no messages, and
 *  no `lang` on `<html>` (there is no root `app/not-found.tsx` in this repo to render instead).
 *  Here the layout has already resolved the locale, so `notFound()` renders `(site)/not-found.tsx`
 *  inside the site — after hydration; see ARCHITECTURE.md § Routing (W151) for the initial,
 *  pre-hydration response. */
export default function CatchAllNotFound(): never {
  notFound();
}
