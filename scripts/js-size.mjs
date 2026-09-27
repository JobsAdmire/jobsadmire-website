#!/usr/bin/env node
// W13 (amended): per-route script transfer size for the WP2 ledger, read from the Lighthouse
// runs scripts/gate.sh just collected (.lighthouseci/lhr-*.json — written by `lhci collect`,
// one file per run, two runs per path). Informational: the gate's own assertion
// (`resource-summary:script:size` in lighthouserc*.json) is what fails a route; this prints the
// numbers the ledger records and flags a route above the 194,560 B lazy-loading line, where the
// ruling demands a next/dynamic pass before the next page task starts.
//   node scripts/js-size.mjs [--dir=.lighthouseci]
//
// W94: `node scripts/js-size.mjs --routes </a,/b>` is a standalone spot-check — it collects the
// given routes itself (against E2E_BASE_URL) into a separate `.lighthouseci-extra` directory
// (lhci's `collect` has no --outputDir of its own, unlike `upload`; the routes are gathered into
// the default `.lighthouseci` folder and only THIS run's new files are moved out, so a gate run's
// own collected reports are never touched) and prints their sizes the same way — never asserted,
// and never part of `npm run gate`.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const SCRIPT_CEILING = 204_800;
export const LAZY_LINE = 194_560;

/** @typedef {{ path: string; runs: number; scriptBytes: number; headroomBytes: number; lcpMs: number | null; performance: number | null; overLazyLine: boolean; overCeiling: boolean }} JsSizeRow */

const isLhr = (x) =>
  Boolean(x) && typeof x === 'object' && typeof x.lighthouseVersion === 'string' && x.audits;

const median = (nums) => {
  const s = [...nums].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

/** @param {unknown[]} lhrs @returns {JsSizeRow[]} */
export function summarizeLhrs(lhrs) {
  /** @type {Map<string, { script: number[]; lcp: number[]; perf: number[] }>} */
  const byPath = new Map();
  for (const lhr of lhrs) {
    if (!isLhr(lhr)) continue;
    const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
    if (typeof url !== 'string') continue;
    const u = new URL(url);
    const path = `${u.pathname}${u.search}`;
    const items = lhr.audits['resource-summary']?.details?.items ?? [];
    const script = items.find((i) => i.resourceType === 'script')?.transferSize;
    const lcp = lhr.audits['largest-contentful-paint']?.numericValue;
    const perf = lhr.categories?.performance?.score;
    const acc = byPath.get(path) ?? { script: [], lcp: [], perf: [] };
    if (typeof script === 'number') acc.script.push(script);
    if (typeof lcp === 'number') acc.lcp.push(Math.round(lcp));
    if (typeof perf === 'number') acc.perf.push(perf);
    byPath.set(path, acc);
  }
  return [...byPath.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, acc]) => {
      const scriptBytes = acc.script.length ? Math.max(...acc.script) : 0;
      return {
        path,
        runs: Math.max(acc.script.length, acc.lcp.length, acc.perf.length),
        scriptBytes,
        headroomBytes: SCRIPT_CEILING - scriptBytes,
        lcpMs: median(acc.lcp),
        performance: acc.perf.length ? Math.min(...acc.perf) : null,
        overLazyLine: scriptBytes > LAZY_LINE,
        overCeiling: scriptBytes > SCRIPT_CEILING,
      };
    });
}

const n = (v) => (typeof v === 'number' ? v.toLocaleString('en-US') : '—');

/** @param {JsSizeRow[]} rows */
export function formatJsSizeTable(rows) {
  const lines = [
    `| route | script B (worst of ${rows[0]?.runs ?? 0} runs) | headroom to ${n(SCRIPT_CEILING)} | LCP ms (median) | perf (min) | note |`,
    '| --- | ---: | ---: | ---: | ---: | --- |',
  ];
  for (const r of rows) {
    const note = r.overCeiling
      ? 'OVER CEILING'
      : r.overLazyLine
        ? `over ${n(LAZY_LINE)} — lazy-loading pass before the next page (W13)`
        : '';
    lines.push(
      `| ${r.path} | ${n(r.scriptBytes)} | ${n(r.headroomBytes)} | ${n(r.lcpMs)} | ${
        r.performance === null ? '—' : r.performance.toFixed(2)
      } | ${note} |`,
    );
  }
  return lines.join('\n');
}

/** W94: `--routes=/a,/b` → `['/a', '/b']`; absent → null. Pure — the CLI's own arg parsing. */
export function parseRoutesArg(argv) {
  const hit = argv.find((a) => a.startsWith('--routes='));
  if (!hit) return null;
  return hit
    .slice('--routes='.length)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const LHR_RE = /^lhr-\d+\.json$/;

/** W94: collects `routes` (against E2E_BASE_URL) into `extraDir`, a directory separate from the
 *  main gate's `.lighthouseci`. `lhci collect` has no --outputDir (unlike `upload`) and always
 *  writes into `./.lighthouseci`, so each route is collected there and only the files it just
 *  produced are moved into `extraDir` — a concurrent or prior gate run's own reports are never
 *  read, wiped or mixed in. */
function collectExtra(routes, baseUrl, extraDir) {
  mkdirSync(extraDir, { recursive: true });
  for (const f of readdirSync(extraDir).filter((f) => LHR_RE.test(f))) rmSync(join(extraDir, f));
  for (const route of routes) {
    const before = new Set(existsSync('.lighthouseci') ? readdirSync('.lighthouseci') : []);
    process.stdout.write(`js-size: collecting ${route}\n`);
    execFileSync('npx', ['lhci', 'collect', '--additive', `--url=${baseUrl}${route}`], {
      stdio: 'inherit',
    });
    const after = readdirSync('.lighthouseci').filter((f) => LHR_RE.test(f) && !before.has(f));
    for (const f of after) renameSync(join('.lighthouseci', f), join(extraDir, f));
  }
}

function main() {
  const argv = process.argv.slice(2);
  const routes = parseRoutesArg(argv);
  const dirArg = argv.find((a) => a.startsWith('--dir='));
  const dir = dirArg
    ? dirArg.slice('--dir='.length)
    : routes
      ? '.lighthouseci-extra'
      : '.lighthouseci';

  if (routes) {
    const base = (process.env.E2E_BASE_URL ?? '').replace(/\/$/, '');
    if (!base) {
      process.stderr.write('js-size: --routes needs E2E_BASE_URL set to the server under test\n');
      process.exit(2);
    }
    collectExtra(routes, base, dir);
  }

  let files;
  try {
    files = readdirSync(dir).filter((f) => LHR_RE.test(f));
  } catch {
    process.stderr.write(`js-size: ${dir} not found — run npm run gate (lhci collect) first\n`);
    process.exit(1);
  }
  const lhrs = files.map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const rows = summarizeLhrs(lhrs);
  if (!rows.length) {
    process.stderr.write(`js-size: no Lighthouse results in ${dir}\n`);
    process.exit(1);
  }
  const heading = routes
    ? `\ngate: per-route script size for --routes (W94, informational, never asserted) — ${dir}\n\n`
    : `\ngate: per-route script size (W13 amended) — paste into the ledger\n\n`;
  process.stdout.write(heading);
  process.stdout.write(`${formatJsSizeTable(rows)}\n\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
