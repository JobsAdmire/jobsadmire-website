import { PARAM_ENUMS } from './track';

// W125: the pure half of the contact API — no hook, no `next/navigation` — so a server component
// (`ContactCta`) can classify an href without pulling `useContactClick`'s `usePathname` into its
// module graph, which `next build` refuses. `useContactClick.ts` re-exports all four names, so
// Task 3's public API is unchanged; server code imports them from here.

/** W12: where a contact click happened. The same closed tuple `track()` enforces, so
 *  `placement` can never carry free text or an identifier — the only page-context values GTM
 *  ever sees are these nine. */
export const CONTACT_PLACEMENTS = PARAM_ENUMS.placement;
export type ContactPlacement = (typeof CONTACT_PLACEMENTS)[number];

export type ContactKind = 'call' | 'whatsapp' | 'email';

/** Which of the three contact events an href belongs to — `null` for everything else, so a
 *  social link rendered through `ContactLink` fires nothing. */
export function contactKindOf(href: string): ContactKind | null {
  if (href.startsWith('tel:')) return 'call';
  if (href.startsWith('mailto:')) return 'email';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return 'whatsapp';
  return null;
}
