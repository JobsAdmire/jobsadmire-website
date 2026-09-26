import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { PARAM_ENUMS, track } from './track';

/** W12: where a contact click happened. The same closed tuple `track()` enforces, so
 *  `placement` can never carry free text or an identifier — the only page-context values GTM
 *  ever sees are these nine. */
export const CONTACT_PLACEMENTS = PARAM_ENUMS.placement;
export type ContactPlacement = (typeof CONTACT_PLACEMENTS)[number];

export type ContactKind = 'call' | 'whatsapp' | 'email';

const EVENT = { call: 'call_click', whatsapp: 'whatsapp_click', email: 'email_click' } as const;

/** Which of the three contact events an href belongs to — `null` for everything else, so a
 *  social link rendered through `ContactLink` fires nothing. */
export function contactKindOf(href: string): ContactKind | null {
  if (href.startsWith('tel:')) return 'call';
  if (href.startsWith('mailto:')) return 'email';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'whatsapp';
  return null;
}

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
