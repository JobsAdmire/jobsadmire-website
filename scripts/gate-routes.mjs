#!/usr/bin/env node
// W21: the gate's route list for shell consumers — one path per line on stdout, nothing else.
//   node scripts/gate-routes.mjs          → INDEXABLE_GATE_ROUTES (what Lighthouse audits)
//   node scripts/gate-routes.mjs --all    → GATE_ROUTES (what axe / the width sweep / the
//                                           placeholder counter sweep)
//   node scripts/gate-routes.mjs --json   → the same list as a JSON array
// The list itself lives in e2e/routes.ts (TypeScript, so the specs can import it typed). tsx's
// `tsImport` loads it here, which works on every Node 22 — native type stripping is only
// unflagged from 22.18, and .nvmrc pins the major, not the minor.
//
// W93: appends the first open careers opening's detail rows (`/kariyer/<slug>`,
// `/en/careers/<slug>`) from the public Ops endpoint when OPS_API_URL is set and answers within
// 3 s — the slug is live content, never a hand-maintained gate-route entry. `careersDetailRoutes`
// is exported (dependency-injected env/fetch, the pingOps(env, f) idiom from
// src/app/api/site-health/ops.ts) so scripts/gate-routes.test.ts can prove it with a mocked
// fetch and no child process.
import { tsImport } from 'tsx/esm/api';
import { pathToFileURL } from 'node:url';

const CAREERS_TIMEOUT_MS = 3000;

/** First open opening's slug from `${base}/api/careers/openings` (public, already filtered to
 *  OPEN + publicly listed — "first" is enough), or null on any failure/timeout/empty result. */
async function firstOpenCareersSlug(env, f) {
  const base = (env.OPS_API_URL ?? '').trim().replace(/\/+$/, '');
  if (!base) return null;
  try {
    const res = await f(`${base}/api/careers/openings`, {
      signal: AbortSignal.timeout(CAREERS_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const items = Array.isArray(body)
      ? body
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.data?.items)
          ? body.data.items
          : null;
    const slug = items?.[0]?.slug;
    return typeof slug === 'string' && slug ? slug : null;
  } catch {
    return null;
  }
}

/** @param {NodeJS.ProcessEnv} env @param {typeof fetch} f @returns {Promise<string[]>} */
export async function careersDetailRoutes(env = process.env, f = fetch) {
  const slug = await firstOpenCareersSlug(env, f);
  if (!slug) return [];
  return [`/kariyer/${slug}`, `/en/careers/${slug}`];
}

async function main() {
  const args = process.argv.slice(2);
  const known = new Set(['--all', '--json']);
  const unknown = args.filter((a) => !known.has(a));
  if (unknown.length) {
    process.stderr.write(
      `gate-routes: unknown argument ${unknown.join(' ')} (accepted: --all --json)\n`,
    );
    process.exit(2);
  }

  const routes = await tsImport('../e2e/routes.ts', import.meta.url);
  const base = args.includes('--all') ? routes.GATE_ROUTES : routes.INDEXABLE_GATE_ROUTES;
  const extra = await careersDetailRoutes();
  if (extra.length === 0) {
    process.stderr.write('gate-routes: detail rows skipped (door not configured)\n');
  }
  const list = [...base, ...extra];

  if (args.includes('--json')) {
    process.stdout.write(`${JSON.stringify(list)}\n`);
  } else {
    process.stdout.write(list.map((p) => `${p}\n`).join(''));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
