/** Every brand file under public/brand with its intrinsic size, so `next/image` calls never
 *  guess dimensions (CLS) and no page hard-codes a path. Sources: docs/ARCHITECTURE.md § Assets. */
export const BRAND = {
  /** The mark alone (design-package/assets/ja-mark.png, R16). */
  mark: { src: '/brand/ja-mark.png', width: 336, height: 285 },
  /** Mark + wordmark + "Özel İstihdam Bürosu" — JobsAdmire's own logo from its live site. */
  logo: { src: '/brand/logo.png', width: 742, height: 146 },
  /** The İŞKUR licence roundel the live site displays (About #lisans, Hire Workers trust row). */
  iskur: { src: '/brand/iskur.png', width: 320, height: 320 },
  /** The design's inline Play glyph; the badge text is hire.240/241 (W7). No App Store file (W8). */
  googlePlay: { src: '/brand/google-play.svg', width: 24, height: 24 },
  flags: '/brand/flags.svg',
} as const;
