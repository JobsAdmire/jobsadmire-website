### Task 7: Catalogue lints as tests (numeric parity, currency form, numbers-out-of-copy) with a ratchet baseline

**Files:**

- Create: `src/content/lint.ts`, `src/content/lint.test.ts`, `src/content/lint-baseline.json`, `src/content/lint-exceptions.json`

**Interfaces:**

- Produces: `numericTokens(s: string): string[]`, `findParityViolations(tr, en, exceptions)`, `findLeadingLiraViolations(tr)`, `findHardTypedMetrics(strings, metricValues)`; the baseline file freezes today's violation ids so the test only fails on NEW ones (D17/D18 ratchet).

- [ ] **Step 1: Failing tests**

`src/content/lint.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  findHardTypedMetrics,
  findLeadingLiraViolations,
  findParityViolations,
  numericTokens,
} from './lint';

const tr = JSON.parse(readFileSync(join(__dirname, 'local/bundle.tr.json'), 'utf8'))
  .strings as Record<string, string>;
const en = JSON.parse(readFileSync(join(__dirname, 'local/bundle.en.json'), 'utf8'))
  .strings as Record<string, string>;
const baseline = JSON.parse(readFileSync(join(__dirname, 'lint-baseline.json'), 'utf8')) as {
  parity: string[];
  leadingLira: string[];
};
const exceptions = JSON.parse(
  readFileSync(join(__dirname, 'lint-exceptions.json'), 'utf8'),
) as Record<string, string>;

describe('numericTokens', () => {
  it('normalises separators so 38,944 and 38.944 compare equal', () => {
    expect(numericTokens('Costs ₺38,944 and 21.75%')).toEqual(['38944', '21.75']);
    expect(numericTokens('Maliyet 38.944 ₺ ve %21,75')).toEqual(['38944', '21.75']);
  });
});

describe('EN↔TR numeric parity (D17)', () => {
  it('has no violations beyond the baseline', () => {
    const now = findParityViolations(tr, en, exceptions).sort();
    const fresh = now.filter((id) => !baseline.parity.includes(id));
    expect(fresh, 'new numeric mismatches — fix the string or document an exception').toEqual([]);
  });
});

describe('TR currency form (D18)', () => {
  it('has no leading-₺ strings beyond the baseline', () => {
    const now = findLeadingLiraViolations(tr).sort();
    expect(now.filter((id) => !baseline.leadingLira.includes(id))).toEqual([]);
  });
});

describe('numbers-out-of-copy (D17)', () => {
  it('flags a string that hard-types a metric value', () => {
    expect(findHardTypedMetrics({ 'x.1': 'We placed 470+ workers' }, { placed: 470 })).toEqual([
      'x.1',
    ]);
    expect(findHardTypedMetrics({ 'x.2': 'Call {placed} now' }, { placed: 470 })).toEqual([]);
  });
});
```

- [ ] **Step 2: Implement**

`src/content/lint.ts`:

```ts
/** Extract numbers as canonical strings: thousands separators dropped, decimal comma → dot. */
export function numericTokens(s: string): string[] {
  const out: string[] = [];
  const re = /\d[\d.,\s ]*\d|\d/g;
  for (const m of s.matchAll(re)) {
    let t = m[0].replace(/[\s ]/g, '');
    // decide decimal separator: the LAST separator followed by exactly 2 digits is a decimal
    const dec = t.match(/^(.*)([.,])(\d{1,2})$/);
    if (dec) t = dec[1].replace(/[.,]/g, '') + '.' + dec[3];
    else t = t.replace(/[.,]/g, '');
    out.push(t);
  }
  return out;
}

export function findParityViolations(
  tr: Record<string, string>,
  en: Record<string, string>,
  exceptions: Record<string, string>,
): string[] {
  const bad: string[] = [];
  for (const id of Object.keys(en)) {
    if (id in exceptions) continue;
    if (tr[id] === '') continue; // deliberately empty fragments
    const a = numericTokens(en[id]).sort();
    const b = numericTokens(tr[id] ?? '').sort();
    if (a.join('|') !== b.join('|')) bad.push(id);
  }
  return bad;
}

/** D18: Turkish writes `38.944 ₺`, never `₺38.944`. */
export function findLeadingLiraViolations(tr: Record<string, string>): string[] {
  return Object.entries(tr)
    .filter(([, v]) => /₺\s?\d/.test(v))
    .map(([id]) => id);
}

/** D17: a metric value typed into copy must be a placeholder like {placed}. */
export function findHardTypedMetrics(
  strings: Record<string, string>,
  metrics: Record<string, number>,
): string[] {
  const values = new Set(Object.values(metrics).map(String));
  return Object.entries(strings)
    .filter(([, v]) => numericTokens(v).some((t) => values.has(t)))
    .map(([id]) => id);
}
```

`src/content/lint-exceptions.json` — start with the design's known legitimate differences (each with a reason):

```json
{
  "calc.042": "TR carries the verb fragment only",
  "home.086": "TR sentence lists costs in a different order; same set"
}
```

(Remove or add entries only with a reason; the parity test reads them.)

Generate the baseline once with a throwaway script and commit it:

```bash
npx tsx -e "import {findParityViolations,findLeadingLiraViolations} from './src/content/lint'; const fs=require('fs'); const tr=JSON.parse(fs.readFileSync('src/content/local/bundle.tr.json','utf8')).strings; const en=JSON.parse(fs.readFileSync('src/content/local/bundle.en.json','utf8')).strings; const ex=JSON.parse(fs.readFileSync('src/content/lint-exceptions.json','utf8')); fs.writeFileSync('src/content/lint-baseline.json', JSON.stringify({parity:findParityViolations(tr,en,ex).sort(), leadingLira:findLeadingLiraViolations(tr).sort()},null,1)); console.log('baseline written')"
```

The baseline is the WP6 to-do list (currency normalisation + parity review); it may only shrink.

Run: `npm run test -- src/content/lint.test.ts` Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "test(content): numeric-parity, currency-form and numbers-out-of-copy lints with a ratchet baseline"
```

---

