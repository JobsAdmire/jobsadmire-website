const px = (mobile: number) => ({
  mobile,
  desktop: Math.max(11, Math.round(mobile * 0.75 * 100) / 100),
});

export const tokens = {
  color: {
    ink: '#16202e',
    blue: '#1899D5',
    blueSafe: '#1073a8',
    navy: '#0e1a37',
    sky: '#7fd0f5',
    tint: '#e8f4fb',
    tintBorder: '#bfdff0',
    pale1: '#f4f9fc',
    pale2: '#f7fbfe',
    pale3: '#fbfdff',
    white: '#ffffff',
    textSecondary: '#556377',
    textTertiary: '#5f6e86', // W205: contrast on the pale surfaces (was #64748b)
    muted: '#94a3b8',
    border1: '#dbe8f2',
    border2: '#e2ebf2',
    border3: '#eef4f8',
    border4: '#e6eef4',
    success: '#16a34a',
    successText: '#12813c',
    successSurface: '#dcfce7',
    successBorder: '#bbf7d0',
    warning: '#f59e0b',
    warningText: '#b45309',
    warningSurface: '#fff7ed',
    warningBorder: '#fed7aa',
    danger: '#b91c1c',
    dangerSurface: '#fef2f2',
    dangerBorder: '#fecaca',
  },
  radius: { pill: 999, hero: 24, xl: 22, lg: 20, md: 18, base: 16, sm: 14, xs: 12, input: 9 },
  shadow: {
    heroForm: '0 34px 80px rgba(3,10,26,0.5)',
    social: '0 6px 18px rgba(22,60,90,0.10)',
    card: '0 1px 3px rgba(22,32,46,0.04)',
    cardHover: '0 2px 10px rgba(22,32,46,0.06)',
  },
  /** min-width breakpoints; the design authored max-width 460/560/700/900/1100 */
  breakpoint: { xs: 461, sm: 561, md: 701, lg: 901, xl: 1101 },
  /** authored (mobile 1:1) and desktop (×0.75, floor 11) sizes — never scale breakpoints */
  type: {
    body: px(16),
    bodyLarge: px(17.5),
    bodySmall: px(13.5),
    cardTitle: px(18.5),
    stat: px(34),
    eyebrow: px(12),
    micro: px(12),
    /** header desktop-row links: authored 13.5, 12 between 901 and 1100 (W11), the 11 floor from 1101 */
    nav: { ...px(13.5), tablet: 12 },
  },
  /** clamp() headings: every term scaled on desktop */
  heading: {
    h1: { mobile: 'clamp(40px, 4.6vw, 66px)', desktop: 'clamp(30px, 3.45vw, 49.5px)' },
    h2: { mobile: 'clamp(28px, 3.2vw, 42px)', desktop: 'clamp(21px, 2.4vw, 31.5px)' },
    h2Process: { mobile: 'clamp(30px, 3.4vw, 46px)', desktop: 'clamp(22.5px, 2.55vw, 34.5px)' },
  },
  /** W180 (D19): `.container-site` and the full-bleed chrome rows (`src/app/globals.css`). */
  layout: {
    /** the content box from 1101 px: 1240 px since the owner widened it (W228; the design's own
     *  `max-width:1280px` wrapper × 0.75 was 960 px) */
    maxWidth: 1240,
    /** container/slim-bar side padding: the design's 48 × 0.75 from 1101 … */
    gutterDesktop: 36,
    /** … the authored 48 between 901 and 1100 (no zoom there) … */
    gutterTablet: 48,
    /** … and the design's own ≤ 900 px 20 */
    gutterMobile: 20,
    /** the header row (the design's full-bleed `.ja-nav`, padding 32): 32 at 901–1100, 24 from
     *  1101; below 901 the design's own `.ja-nav` rules — 14 px to 900, 12 px at ≤ 460 (final
     *  pass A2, W184) */
    navGutterPhone: 12,
    navGutterMobile: 14,
    navGutterTablet: 32,
    navGutterDesktop: 24,
    hitTarget: 44,
    navRow: 46,
    /** W11 (closes R46): the desktop nav row and hamburger swap at `lg`; the social rail
     *  (and the D19 scale) at `xl`. Must equal `breakpoint.lg` / `breakpoint.xl`. */
    headerRowFrom: 901,
    socialRailFrom: 1101,
  },
} as const;
