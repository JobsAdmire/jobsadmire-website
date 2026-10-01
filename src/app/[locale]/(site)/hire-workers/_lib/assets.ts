import type { Logo } from '@/design/blocks/LogoMarquee';

/** §10 #4: the licensed stock hero lands here as `/hero/hire-workers.jpg` (2880×1280 source,
 *  rendered through `ImageSlot` at 1440×640 — keep the ratio equal to the Hero's cover wrapper
 *  `aspect-[9/4]`). Until then the slot is a named placeholder and the h1 is the LCP element
 *  (D26); setting this constant moves `data-lcp-slot` onto the image. */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1440, height: 640 } as const;

/** §10 #11: client logos with consent are v1.1 — the band stays empty (W6) until rows exist. */
export const CLIENT_LOGOS: readonly Logo[] = [];
