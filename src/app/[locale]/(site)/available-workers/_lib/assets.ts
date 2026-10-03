/** §10 row 4 ("remaining slots"): this page's hero photo is an owner input whose auto-default
 *  is the navy gradient — the `aw-hero` slot stays a named placeholder (D26/W55) and the h1 is
 *  the LCP element. A licensed photo lands here (16:9, ≥ 1,600 px wide); setting HERO_SRC moves
 *  `data-lcp-slot` onto the image and preloads it. Before it is set, the photo's geometry is
 *  decided per W189 A5: a cover-mode `ImageSlot` at a fixed height per breakpoint with
 *  art-directed sources and a true `sizes` — never `sizes="100vw"` on the current W187 box
 *  (3,000 / 1,900 / 1,700 px tall, up to 5,333 px wide). */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1600, height: 900 } as const;
