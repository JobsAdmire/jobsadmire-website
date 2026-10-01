import type { Logo } from '@/design/blocks/LogoMarquee';

/** §10 #4: the licensed stock hero lands here as `/hero/hire-workers.jpg`. Until then the slot
 *  is a named placeholder and the h1 is the LCP element (D26). Before this constant is set, the
 *  photo's geometry is decided per W189: a cover-mode `ImageSlot` at a fixed height per
 *  breakpoint with art-directed sources (a portrait crop ≤ 900 px) and a true `sizes` — never
 *  `sizes="100vw"` on the current 2,700/4,050 px wide W187 box. Setting this constant moves
 *  `data-lcp-slot` onto the image. */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1440, height: 640 } as const;

/** §10 #11: client logos with consent are v1.1 — the band stays empty (W6) until rows exist. */
export const CLIENT_LOGOS: readonly Logo[] = [];
