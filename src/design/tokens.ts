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
    textTertiary: '#64748b',
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
  },
  /** clamp() headings: every term scaled on desktop */
  heading: {
    h1: { mobile: 'clamp(40px, 4.6vw, 66px)', desktop: 'clamp(30px, 3.45vw, 49.5px)' },
    h2: { mobile: 'clamp(28px, 3.2vw, 42px)', desktop: 'clamp(21px, 2.4vw, 31.5px)' },
    h2Process: { mobile: 'clamp(30px, 3.4vw, 46px)', desktop: 'clamp(22.5px, 2.55vw, 34.5px)' },
  },
  layout: { maxWidth: 1280, gutterDesktop: 48, gutterMobile: 20, hitTarget: 44, navRow: 46 },
} as const;
