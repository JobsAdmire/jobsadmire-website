/**
 * §10 row 4 (D26): the licensed Homepage hero photograph. `null` until the stock pack lands — the
 * full-bleed slot `v4-hero` then renders as a named gradient placeholder and the h1 is the page's
 * LCP element (`data-lcp-slot="h1"`). When the file ships under `public/photos/`, set its path
 * here and nothing else: `ImageSlot` takes `lcp` (+ `preload`) and the h1 drops its attribute, so
 * the page still names exactly one LCP slot (docs/SEO.md § Pages).
 */
export const HERO_PHOTO: string | null = null;
