### Task 13: Error pages, site-health and revalidate routes, dev gallery

**Files:**

- Create: `src/app/[locale]/not-found.tsx`, `src/app/[locale]/error.tsx`, `src/app/global-error.tsx`, `src/app/api/site-health/route.ts`, `src/app/api/site-health/checks.ts`, `src/app/api/site-health/checks.test.ts`, `src/app/[locale]/_dev/gallery/page.tsx`
- Modify: `src/app/api/revalidate/route.ts`

**Interfaces:**

- Produces: `GET /api/site-health` → `{ ok: boolean, reasons: string[], checks: Record<string, 'ok'|'fail'|'skip'>, contractVersion, source, commit }` with HTTP 200/503; `POST /api/revalidate` (Bearer `REVALIDATE_SECRET`, body `{ tags: string[] }`) → `{ revalidated: string[], at: string }`; `recordRevalidate()` / `lastRevalidateAt()` (module-level, best-effort on serverless).

- [ ] **Step 1: Failing test for the health evaluation (pure)**

`src/app/api/site-health/checks.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { evaluate } from './checks';

describe('site-health evaluate', () => {
  it('is ok when every check passes', () => {
    expect(
      evaluate({ bundleTr: 'ok', bundleEn: 'ok', lastRevalidate: 'skip', opsPing: 'skip' }),
    ).toEqual({ ok: true, reasons: [] });
  });
  it('fails with reason codes', () => {
    expect(
      evaluate({ bundleTr: 'fail', bundleEn: 'ok', lastRevalidate: 'skip', opsPing: 'fail' }),
    ).toEqual({ ok: false, reasons: ['BUNDLE_TR', 'OPS_PING'] });
  });
});
```

- [ ] **Step 2: Implement**

`checks.ts`:

```ts
export type CheckResult = 'ok' | 'fail' | 'skip';
export type Checks = {
  bundleTr: CheckResult;
  bundleEn: CheckResult;
  lastRevalidate: CheckResult;
  opsPing: CheckResult;
};
const CODES: Record<keyof Checks, string> = {
  bundleTr: 'BUNDLE_TR',
  bundleEn: 'BUNDLE_EN',
  lastRevalidate: 'REVALIDATE_STALE',
  opsPing: 'OPS_PING',
};
export function evaluate(c: Checks) {
  const reasons = (Object.keys(c) as (keyof Checks)[])
    .filter((k) => c[k] === 'fail')
    .map((k) => CODES[k]);
  return { ok: reasons.length === 0, reasons };
}
```

`route.ts` (site-health): `export const dynamic = 'force-dynamic'`; loads both bundles via `getBundle` (fail → `fail`), `lastRevalidate` = `skip` in LOCAL mode / `fail` when OPS and older than 24 h (WP5 wires the real timestamp store), `opsPing` = `skip` in LOCAL (WP3a adds the real ping), returns `evaluate` + metadata (`process.env.VERCEL_GIT_COMMIT_SHA`), status 503 when `!ok`, `Cache-Control: no-store`.

`revalidate/route.ts`: constant-time compare of the Bearer token against `REVALIDATE_SECRET` (`timingSafeEqual` on equal-length buffers; 401 otherwise), parse `{ tags: string[] }` (≤ 50, each `/^[a-z0-9:_-]+$/`), `revalidateTag(tag)` for each, record the timestamp, return JSON; 503 when the secret is unset (never open).

Error pages: `[locale]/not-found.tsx` (uses `sys.notFoundTitle/Body`, links home via `Link`), `[locale]/error.tsx` (client, `sys.errorTitle`, retry button), `global-error.tsx` (minimal, no i18n). Dev gallery: renders every primitive and chrome variant with sample props; `if (process.env.NODE_ENV === 'production') notFound()` at the top.

Run: `npm run test -- src/app/api` + build + `curl -s localhost:3100/api/site-health | jq .ok` → true; `curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" -d '{"tags":["site:tr"]}' -H 'content-type: application/json' localhost:3100/api/revalidate` → 200.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(ops): site-health and revalidate routes, error pages, dev component gallery"
```

---

