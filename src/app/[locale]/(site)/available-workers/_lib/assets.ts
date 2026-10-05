/** §10 row 4 ("remaining slots"): this page's hero photo is licensed stock for now (owner
 *  2026-10-05, W233; source and licence in docs/ARCHITECTURE.md § Stock photography), replaced by
 *  a real photo when the owner has one. Setting HERO_SRC moves `data-lcp-slot` onto the image and
 *  preloads it; `null` turns `aw-hero` back into a named placeholder (D26/W55) with the h1 as the
 *  LCP element. The box stays 16:9 (HERO_SIZE, the page's `aspect-[16/9]` wrapper) and crops the
 *  3:2 photo. W189 A5's geometry — a cover-mode `ImageSlot` at a fixed height per breakpoint,
 *  art-directed sources and a true `sizes` instead of `sizes="100vw"` on the current W187 box
 *  (3,000 / 1,900 / 1,700 px tall, up to 5,333 px wide) — is deferred to the later speed work by
 *  the owner ("optimisation later", W233). */
export const HERO_SRC: string | null = '/hero/available-workers.jpg';
export const HERO_SIZE = { width: 1600, height: 900 } as const;
