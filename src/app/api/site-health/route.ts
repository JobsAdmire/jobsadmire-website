import { NextResponse } from 'next/server';
import { contentSource, getBundle } from '@/content/adapter';
// Relative on purpose: the `@/` alias covers `src/` only, and `contract/` is a sibling.
import { CONTRACT_VERSION } from '../../../../contract/website-bundle.v1';
import { formBeaconCount } from '../form-beacon/state';
import { lastRevalidateAt } from '../revalidate/state';
import { evaluate, type CheckResult, type Checks } from './checks';
import { opsPingCheck, pingOps } from './ops';

// D25: this is what the external monitor watches, so it is never cached and never answers
// from a build-time snapshot — a health check that can be stale is not a health check.
export const dynamic = 'force-dynamic';

const REVALIDATE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const settled = (r: PromiseSettledResult<unknown>): CheckResult =>
  r.status === 'fulfilled' ? 'ok' : 'fail';

export async function GET() {
  const source = contentSource();
  // The ping (≤ 3 s) runs beside the bundle checks, not after them.
  const [[tr, en], ops] = await Promise.all([
    Promise.allSettled([getBundle('tr'), getBundle('en')]),
    pingOps(),
  ]);
  const last = lastRevalidateAt();
  const checks: Checks = {
    bundleTr: settled(tr),
    bundleEn: settled(en),
    // In LOCAL the bundle ships with the deploy: there is nothing to revalidate, so a
    // timestamp would be noise. In OPS a missing or day-old one means publishes are not
    // reaching the site. (Best-effort — see `revalidate/state.ts`.)
    lastRevalidate:
      source === 'LOCAL'
        ? 'skip'
        : last === null || Date.now() - last > REVALIDATE_MAX_AGE_MS
          ? 'fail'
          : 'ok',
    // The door's own ping with the forms' write token (docs/OPERATING.md): W75 — `off`,
    // `unauthorized` and `unreachable` are a `fail`; only `unconfigured` is `skip`.
    opsPing: opsPingCheck(ops),
  };
  const { ok, reasons } = evaluate(checks);
  return NextResponse.json(
    {
      ok,
      reasons,
      checks,
      ops,
      // Best-effort per instance (form-beacon/state.ts): fallback panels shown since this
      // instance started — a rising number with `ops.state: 'ok'` is a client-side problem.
      formBeacons: formBeaconCount(),
      contractVersion: CONTRACT_VERSION,
      source,
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      at: new Date().toISOString(),
    },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
