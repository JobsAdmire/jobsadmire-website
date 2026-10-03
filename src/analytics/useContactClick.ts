import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { ContactKind, ContactPlacement } from './contact-kind';
import { track } from './track';

// W125: the classifier and the placement tuple live in the pure `./contact-kind` (server
// components import them from there — this module imports `usePathname`, which `next build`
// refuses in a server component's graph); re-exported here so Task 3's API is unchanged.
export {
  CONTACT_PLACEMENTS,
  contactKindOf,
  type ContactKind,
  type ContactPlacement,
} from './contact-kind';

const EVENT = { call: 'call_click', whatsapp: 'whatsapp_click', email: 'email_click' } as const;

/** One handler factory for every tel:/wa.me/mailto: anchor (W32: returns `(kind) => void`,
 *  not a mouse handler — a Button-style caller pairs it with `contactKindOf`). `page` is the
 *  real URL pathname from `next/navigation` (R35), never next-intl's internal key; `locale`
 *  comes from the provider, so callers pass nothing but the placement. */
export function useContactClick(placement: ContactPlacement): (kind: ContactKind) => void {
  const page = usePathname() ?? '/';
  const locale = useLocale();
  return useCallback(
    (kind: ContactKind) => {
      track(EVENT[kind], { page, locale, placement });
    },
    [page, locale, placement],
  );
}
