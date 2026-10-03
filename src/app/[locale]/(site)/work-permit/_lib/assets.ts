/** §10 row 4 gives this page no hero photo at launch ("gradients elsewhere"): the `wp-hero`
 *  slot stays a named placeholder behind the navy gradients and the h1 is the LCP element
 *  (D26). A licensed photo lands here (keep the 16:9 ratio of the Hero's cover wrapper);
 *  setting this constant moves `data-lcp-slot` onto the image and adds its preload. */
export const HERO_SRC: string | null = null;
export const HERO_SIZE = { width: 1600, height: 900 } as const;
