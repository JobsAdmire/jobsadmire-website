/** §10 row 4 gave this page no hero photo at launch ("gradients elsewhere"); the owner's "use
 *  stock images for now" (2026-10-05, W233) gives it licensed stock (source and licence in
 *  docs/ARCHITECTURE.md § Stock photography), replaced by a real photo when the owner has one.
 *  Keep the 16:9 ratio of the Hero's cover wrapper — the box crops the 3:2 photo. Setting this
 *  constant moves `data-lcp-slot` onto the image and adds its preload; `null` turns `wp-hero` back
 *  into a named placeholder behind the navy gradients with the h1 as the LCP element (D26). W189
 *  A5's cover-mode slot, art-directed sources and true `sizes` are deferred to the later speed
 *  work by the owner ("optimisation later", W233). */
export const HERO_SRC: string | null = '/hero/work-permit.jpg';
export const HERO_SIZE = { width: 1600, height: 900 } as const;
