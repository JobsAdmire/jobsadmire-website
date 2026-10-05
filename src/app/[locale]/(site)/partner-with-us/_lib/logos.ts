import type { Logo } from '@/design/blocks/LogoMarquee';

/** §10 #11: partner logos arrive in v1.1 with written consent. Empty in Phase A, so the band
 *  shows the design's labelled placeholder slots instead (`PARTNER_LOGO_SLOTS`). Add consented
 *  files under `public/brand/logos/` here, never hot-linked (W14). */
export const PARTNER_LOGOS: readonly Logo[] = [];

/** The design's `partnerLogoSlots` (Partner With Us ll. 1390–1393): 20 slots, "Partner logo
 *  1–10" twice round — the marquee's two laps. Each slot's label is `sys.partner.logos.slot`
 *  with its number. */
export const PARTNER_LOGO_SLOTS = Array.from({ length: 20 }, (_, i) => (i % 10) + 1);

/** The design's "25+" partner-company figure (l. 553) — an unsigned sample (W1), shown beside
 *  the `SampleTag` (owner 2026-10-05), page-local and never a fixture (D23). */
export const PARTNER_COMPANIES_SAMPLE = '25+';
