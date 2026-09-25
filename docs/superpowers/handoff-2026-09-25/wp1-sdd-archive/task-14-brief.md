### Task 14: The quality gate — Playwright suites (a11y, width sweep), Lighthouse CI, `gate.sh`

**Files:**

- Create: `e2e/a11y.spec.ts`, `e2e/width-sweep.spec.ts`, `e2e/routes.ts`, `lighthouserc.json`
- Modify: `scripts/gate.sh`, `package.json`

**Interfaces:**

- Produces: `GATE_ROUTES` (the list of public routes per locale, imported by a11y/width/seo specs), `npm run gate` (needs `E2E_BASE_URL`; optional `GATE_PROFILE=launch` adds the placeholder counter in WP2).

- [ ] **Step 1: Route list and a11y sweep**

`e2e/routes.ts`:

```ts
export const GATE_ROUTES = [
  '/',
  '/en',
  '/isci-talebi',
  '/en/hire-workers',
  '/tesekkurler?form=hire',
];
```

(WP2 appends every page as it lands.)

`e2e/a11y.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { GATE_ROUTES } from './routes';

for (const route of GATE_ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        null,
        1,
      ),
    ).toEqual([]);
  });
}
```

`e2e/width-sweep.spec.ts` (D19: no layout jump at the desktop boundary):

```ts
import { test, expect } from '@playwright/test';

for (const width of [1440, 1280, 1101, 1100, 900, 700, 560, 460, 390]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
```

- [ ] **Step 2: Lighthouse CI**

```bash
npm install --save-dev @lhci/cli
```

`lighthouserc.json`:

```json
{
  "ci": {
    "collect": { "numberOfRuns": 2, "settings": { "preset": "mobile" } },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": "./lighthouse-report" }
  }
}
```

`scripts/gate.sh`:

```bash
#!/usr/bin/env bash
# Quality gate — runs OUTSIDE the Vercel build (no Chrome there).
# Usage: E2E_BASE_URL=https://<preview-or-local> npm run gate
set -euo pipefail
: "${E2E_BASE_URL:?set E2E_BASE_URL}"
echo "gate → $E2E_BASE_URL"
npx playwright test
URLS=$(node -e "const r=require('./e2e/routes.ts');" 2>/dev/null || echo "")
# routes are TS; use a tiny inline list until WP2 exports JSON — keep in sync with e2e/routes.ts
for path in / /en /isci-talebi /en/hire-workers; do
  npx lhci collect --url="${E2E_BASE_URL}${path}" --settings.preset=mobile >/dev/null
done
npx lhci assert
echo "gate: OK"
```

Add `lighthouse-report/` and `.lighthouseci/` to `.gitignore`. Playwright needs `npx playwright install chromium` once locally (document in README).

- [ ] **Step 3: Run the whole gate against a local production build**

```bash
npm run build && (npm run start -- -p 3100 & echo $! > /tmp/next.pid) && sleep 4 && E2E_BASE_URL=http://localhost:3100 npm run gate; kill $(cat /tmp/next.pid)
```

Expected: Playwright green (routing, redirects, seo, a11y, width-sweep, smoke), Lighthouse ≥ 95/100/100/100 on the shell. If accessibility < 100, fix the component — do not lower the assertion.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "test(gate): axe sweep, width sweep, Lighthouse CI budgets, gate.sh"
```

---

