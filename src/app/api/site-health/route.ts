import { NextResponse } from 'next/server';
import { contentSource, getBundle } from '@/content/adapter';
// Relative on purpose: the `@/` alias covers `src/` only, and `contract/` is a sibling.
import { CONTRACT_VERSION } from '../../../../contract/website-bundle.v1';
import { lastRevalidateAt } from '../revalidate/state';
import { evaluate, type CheckResult, type Checks } from './checks';

// D25: this is what the external monitor watches, so it is never cached and never answers
// from a build-time snapshot — a health check that can be stale is not a health check.
export const dynamic = 'force-dynamic';

const REVALIDATE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const settled = (r: PromiseSettledResult<unknown>): CheckResult =>
  r.status === 'fulfilled' ? 'ok' : 'fail';

export async function GET() {
  const source = contentSource();
  const [tr, en] = await Promise.allSettled([getBundle('tr'), getBundle('en')]);
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
    // WP3a adds the real Operations ping. Until that call exists there is nothing to measure
    // in either mode, and reporting 'ok' for a check that never ran is exactly the
    // dishonesty D25 forbids.
    opsPing: 'skip',
  };
  const { ok, reasons } = evaluate(checks);
  return NextResponse.json(
    {
      ok,
      reasons,
      checks,
      contractVersion: CONTRACT_VERSION,
      source,
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      at: new Date().toISOString(),
    },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
