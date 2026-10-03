### Task 2: Design tokens, Tailwind theme, fonts, reduced motion

**Files:**

- Create: `src/design/tokens.ts`, `src/design/tokens.test.ts`, `src/design/contrast.ts`
- Modify: `src/app/globals.css`, `src/app/[locale]/layout.tsx` (font + html classes)

**Interfaces:**

- Produces: `tokens` (colour, radius, shadow, breakpoint, type scale with `mobile`/`desktop` px), `contrastRatio(hexA, hexB): number`, CSS custom properties `--color-*`, `--text-*`, `--radius-*`, `--shadow-*`, Tailwind utilities (`bg-navy`, `text-ink`, `text-blue-safe`, `rounded-pill`…), the `archivo` font variable.

- [ ] **Step 1: Write the contrast test first**

`src/design/contrast.ts`:

```ts
function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
export function luminance(hex: string) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
```

`src/design/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { tokens } from './tokens';

const { color } = tokens;
// every text/background pair the design uses; AA body text = 4.5, large text = 3.0
const pairs: Array<[string, string, number, string]> = [
  [color.ink, color.white, 4.5, 'ink on white'],
  [color.textSecondary, color.white, 4.5, 'secondary on white'],
  [color.textTertiary, color.white, 4.5, 'tertiary on white'],
  [color.blueSafe, color.white, 4.5, 'eyebrow/blue-safe on white'],
  [color.white, color.navy, 4.5, 'white on navy'],
  [color.sky, color.navy, 4.5, 'sky on navy'],
  [color.successText, color.successSurface, 4.5, 'success text on surface'],
  [color.warningText, color.warningSurface, 4.5, 'warning text on surface'],
  [color.danger, color.dangerSurface, 4.5, 'danger text on surface'],
  [color.white, color.blue, 3.0, 'white on brand blue (buttons, large text)'],
];

describe('design tokens', () => {
  it.each(pairs)('%s on %s ≥ %s (%s)', (fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
  it('desktop type is the authored value × 0.75 with an 11px floor', () => {
    for (const [name, t] of Object.entries(tokens.type)) {
      const expected = Math.max(11, Math.round(t.mobile * 0.75 * 100) / 100);
      expect(t.desktop, name).toBe(expected);
    }
  });
  it('breakpoints are the design breakpoints unscaled', () => {
    expect(tokens.breakpoint).toEqual({ xs: 461, sm: 561, md: 701, lg: 901, xl: 1101 });
  });
});
```

Run: `npm run test -- src/design/tokens.test.ts` Expected: FAIL (tokens missing).

- [ ] **Step 2: Write the tokens**

`src/design/tokens.ts` (values from `design-package/README.md`; the eyebrow uses `blueSafe` per D20):

```ts
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
```

Run: `npm run test -- src/design/tokens.test.ts` Expected: PASS (if a pair fails contrast, the token is wrong — do not lower the threshold; the only sanctioned change is `blueSafe` for text).

- [ ] **Step 3: Tailwind 4 theme + CSS variables + reduced motion**

`src/app/globals.css`:

```css
@import 'tailwindcss';

@theme {
  --color-ink: #16202e;
  --color-blue: #1899d5;
  --color-blue-safe: #1073a8;
  --color-navy: #0e1a37;
  --color-sky: #7fd0f5;
  --color-tint: #e8f4fb;
  --color-tint-border: #bfdff0;
  --color-pale-1: #f4f9fc;
  --color-pale-2: #f7fbfe;
  --color-pale-3: #fbfdff;
  --color-text-secondary: #556377;
  --color-text-tertiary: #64748b;
  --color-muted: #94a3b8;
  --color-border-1: #dbe8f2;
  --color-border-2: #e2ebf2;
  --color-border-3: #eef4f8;
  --color-border-4: #e6eef4;
  --color-success: #16a34a;
  --color-success-text: #12813c;
  --color-success-surface: #dcfce7;
  --color-success-border: #bbf7d0;
  --color-warning: #f59e0b;
  --color-warning-text: #b45309;
  --color-warning-surface: #fff7ed;
  --color-warning-border: #fed7aa;
  --color-danger: #b91c1c;
  --color-danger-surface: #fef2f2;
  --color-danger-border: #fecaca;

  --radius-pill: 999px;
  --radius-hero: 24px;
  --radius-xl: 22px;
  --radius-lg: 20px;
  --radius-md: 18px;
  --radius-base: 16px;
  --radius-sm: 14px;
  --radius-xs: 12px;
  --radius-input: 9px;

  --shadow-hero-form: 0 34px 80px rgba(3, 10, 26, 0.5);
  --shadow-social: 0 6px 18px rgba(22, 60, 90, 0.1);
  --shadow-card: 0 1px 3px rgba(22, 32, 46, 0.04);
  --shadow-card-hover: 0 2px 10px rgba(22, 32, 46, 0.06);

  --breakpoint-xs: 461px;
  --breakpoint-sm: 561px;
  --breakpoint-md: 701px;
  --breakpoint-lg: 901px;
  --breakpoint-xl: 1101px;

  --font-display: var(--font-archivo), system-ui, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

/* Responsive type scale: authored 1:1 up to 1100px, ×0.75 from 1101px (D19). */
:root {
  --text-body: 16px;
  --text-body-lg: 17.5px;
  --text-body-sm: 13.5px;
  --text-card-title: 18.5px;
  --text-stat: 34px;
  --text-eyebrow: 12px;
  --text-h1: clamp(40px, 4.6vw, 66px);
  --text-h2: clamp(28px, 3.2vw, 42px);
  --text-h2-process: clamp(30px, 3.4vw, 46px);
  --gutter: 20px;
}
@media (min-width: 1101px) {
  :root {
    --text-body: 12px;
    --text-body-lg: 13.13px;
    --text-body-sm: 11px;
    --text-card-title: 13.88px;
    --text-stat: 25.5px;
    --text-eyebrow: 11px;
    --text-h1: clamp(30px, 3.45vw, 49.5px);
    --text-h2: clamp(21px, 2.4vw, 31.5px);
    --text-h2-process: clamp(22.5px, 2.55vw, 34.5px);
    --gutter: 48px;
  }
}

html {
  scroll-behavior: smooth;
  color: var(--color-ink);
  background: #fff;
  font-family: var(--font-body);
  font-weight: 600; /* the design leans heavy: body 600, headings 800 */
  font-size: var(--text-body);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
  font-weight: 800;
}
.container-site {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: var(--gutter);
}

/* Every animation must stop under reduced motion (README: not optional polish). */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In `src/app/[locale]/layout.tsx` add the font (self-hosted at build by `next/font/google`; `latin-ext` is required for ş ğ İ ı ç ö ü):

```tsx
import { Archivo } from 'next/font/google';
const archivo = Archivo({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700', '800'], display: 'swap', variable: '--font-archivo' });
// …
<html lang={locale} className={archivo.variable}>
```

- [ ] **Step 4: Verify and commit**

Run: `npm run verify` Expected: pass (tokens test green).

```bash
git add -A && git commit -m "feat(design): tokens, Tailwind theme, Archivo (latin-ext), reduced-motion baseline"
```

---

