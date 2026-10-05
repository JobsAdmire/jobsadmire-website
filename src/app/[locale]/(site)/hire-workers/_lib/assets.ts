import type { Logo } from '@/design/blocks/LogoMarquee';

/** §10 #4: the hero photo — licensed stock for now (owner 2026-10-05, W233; source and licence in
 *  docs/ARCHITECTURE.md § Stock photography), replaced by a real photo when the owner has one.
 *  Setting this constant moves `data-lcp-slot` onto the image (+ preload); `null` turns the slot
 *  back into a named placeholder with the h1 as the LCP element (D26). The cover-mode slot of W189
 *  A5 is in place (`HERO_COVER` in the Hero); the rest of A5 — art-directed sources (a portrait
 *  crop ≤ 900 px) and a true `sizes` instead of `sizes="100vw"`, while below 901 px the cover box
 *  draws the 3:2 photo 1,800–2,700 px wide — is deferred to the later speed work by the owner
 *  ("optimisation later", W233). */
export const HERO_SRC: string | null = '/hero/hire-workers.jpg';
export const HERO_SIZE = { width: 1440, height: 640 } as const;

/** §10 #11: client logos with consent are v1.1 — the band stays empty (W6) until rows exist. */
export const CLIENT_LOGOS: readonly Logo[] = [];
