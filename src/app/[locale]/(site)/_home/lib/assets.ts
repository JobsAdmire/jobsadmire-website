/**
 * §10 row 4 (D26): the Homepage hero photograph — licensed stock for now (owner 2026-10-05, W233;
 * source and licence in docs/ARCHITECTURE.md § Stock photography), replaced by a real photo when
 * the owner has one. With a path set, the full-bleed slot `v4-hero` renders the image under the
 * two overlays as the page's LCP element: `ImageSlot` takes `lcp` (+ `preload`) and the h1 drops
 * its attribute, so the page still names exactly one LCP slot (docs/SEO.md § Pages). `null` turns
 * the slot back into a named gradient placeholder with the h1 as the LCP element
 * (`data-lcp-slot="h1"`). W189 A5's art-directed sources and true `sizes` are deferred to the later
 * speed work by the owner ("optimisation later", W233).
 */
export const HERO_PHOTO: string | null = '/hero/home.jpg';
