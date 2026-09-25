### Task 3: Money and number formatting contract (D18)

**Files:**

- Create: `src/lib/format/money.ts`, `src/lib/format/money.test.ts`

**Interfaces:**

- Produces: `formatTRY(amount: number, locale: Locale): string`, `formatPercent(value: number, locale: Locale, decimals?: number): string`, `formatInt(n: number, locale: Locale): string`.

- [ ] **Step 1: Failing tests from the design's worked examples**

`src/lib/format/money.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatInt, formatPercent, formatTRY } from './money';

describe('formatTRY', () => {
  it('Turkish: dot thousands, trailing symbol', () => {
    expect(formatTRY(38944, 'tr')).toBe('38.944 ₺');
    expect(formatTRY(33030, 'tr')).toBe('33.030 ₺');
    expect(formatTRY(1270, 'tr')).toBe('1.270 ₺');
  });
  it('English: comma thousands, leading symbol', () => {
    expect(formatTRY(38944, 'en')).toBe('₺38,944');
    expect(formatTRY(16000, 'en')).toBe('₺16,000');
  });
  it('rounds to whole lira', () => {
    expect(formatTRY(28075.5, 'tr')).toBe('28.076 ₺');
  });
});

describe('formatPercent', () => {
  it('Turkish: sign leads, comma decimal', () => {
    expect(formatPercent(21.75, 'tr')).toBe('%21,75');
    expect(formatPercent(18.75, 'tr')).toBe('%18,75');
  });
  it('English: dot decimal, sign trails', () => {
    expect(formatPercent(21.75, 'en')).toBe('21.75%');
  });
  it('keeps the requested decimals', () => {
    expect(formatPercent(20, 'tr', 0)).toBe('%20');
  });
});

describe('formatInt', () => {
  it('groups thousands per locale', () => {
    expect(formatInt(1240, 'tr')).toBe('1.240');
    expect(formatInt(1240, 'en')).toBe('1,240');
  });
});
```

Run: `npm run test -- src/lib/format` Expected: FAIL (module missing).

- [ ] **Step 2: Implement**

`src/lib/format/money.ts`:

```ts
import type { Locale } from '@/i18n/routing';

const intl: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

export function formatInt(n: number, locale: Locale): string {
  return new Intl.NumberFormat(intl[locale], { maximumFractionDigits: 0 }).format(n);
}

/** D18: TR `38.944 ₺` (trailing), EN `₺38,944` (leading); whole lira. */
export function formatTRY(amount: number, locale: Locale): string {
  const n = formatInt(Math.round(amount), locale);
  return locale === 'tr' ? `${n} ₺` : `₺${n}`;
}

/** D18: TR `%21,75` (sign leads), EN `21.75%`. */
export function formatPercent(value: number, locale: Locale, decimals = 2): string {
  const n = new Intl.NumberFormat(intl[locale], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return locale === 'tr' ? `%${n}` : `${n}%`;
}
```

Run: `npm run test -- src/lib/format` Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(format): formatTRY/formatPercent/formatInt per the D18 locale contract"
```

---

