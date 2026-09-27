#!/usr/bin/env node
// W13 (amended): per-route script transfer size for the WP2 ledger, read from the Lighthouse
// runs scripts/gate.sh just collected (.lighthouseci/lhr-*.json — written by `lhci collect`,
// one file per run, two runs per path). Informational: the gate's own assertion
// (`resource-summary:script:size` in lighthouserc*.json) is what fails a route; this prints the
// numbers the ledger records and flags a route above the 194,560 B lazy-loading line, where the
// ruling demands a next/dynamic pass before the next page task starts.
//   node scripts/js-size.mjs [--dir=.lighthouseci]
//
// W94: `node scripts/js-size.mjs --routes </a,/b>` (or `--routes=</a,/b>`) is a standalone
// spot-check — it collects the given routes itself (against E2E_BASE_URL, with the Lighthouse
// config and bypass header the gate uses) into a separate `.lighthouseci-extra` directory (lhci's
// `collect` has no --outputDir of its own, unlike `upload`; each route is collected into the
// default `.lighthouseci` folder and only the `lhr-<ts>.json`/`lhr-<ts>.html` pairs THIS run
// wrote are moved out, so a gate run's own collected reports are never touched) and prints their
// sizes the same way — never asserted, and never part of `npm run gate`.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
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

/** W136: the line printed above the table — the metric (the one the gate asserts, so the ledger's
 *  JS figure) and the host it was measured on, which decides whether the figure binds.
 *  @param {unknown[]} lhrs @returns {string} */
export function formatMethodLine(lhrs) {
  const hosts = new Set();
  for (const lhr of lhrs) {
    if (!isLhr(lhr)) continue;
    const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
    if (typeof url === 'string') hosts.add(new URL(url).host);
  }
  const on = [...hosts].sort().join(', ') || 'an unknown host';
  return (
    `method: Lighthouse resource-summary:script:size, transfer bytes on ${on} — worst run per ` +
    'route, post-hydration chunks and response headers included; the figure the ledger ' +
    'records (W136): the run against the Vercel preview is binding, a local run diagnostic'
  );
}

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

const USAGE = 'usage: node scripts/js-size.mjs [--dir=<dir>] [--routes=</a,/b> | --routes </a,/b>]';
const ROUTES_NEED_A_LIST = '--routes needs a comma-separated list';

const splitRoutes = (list) =>
  list
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** W94/M2: the CLI's arguments — `--routes=/a,/b` or `--routes /a,/b` (W94's own spelling),
 *  `--dir=<dir>`; anything else is an error the CLI answers with exit 2 and the usage line.
 *  Pure. @param {string[]} argv
 *  @returns {{ routes: string[] | null; dir: string | null; errors: string[] }} */
export function parseJsSizeArgs(argv) {
  /** @type {string[] | null} */
  let routes = null;
  /** @type {string | null} */
  let dir = null;
  /** @type {string[]} */
  const errors = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--routes' || a.startsWith('--routes=')) {
      const next = argv[i + 1];
      const list =
        a === '--routes' ? (next !== undefined && !next.startsWith('--') ? next : '') : a.slice(9);
      if (a === '--routes' && list) i++;
      routes = splitRoutes(list);
      if (!routes.length) errors.push(ROUTES_NEED_A_LIST);
    } else if (a.startsWith('--dir=')) {
      dir = a.slice('--dir='.length);
    } else {
      errors.push(`unknown argument '${a}'`);
    }
  }
  return { routes, dir, errors };
}

/** W94: `--routes=/a,/b` or `--routes /a,/b` → `['/a', '/b']`; absent → null. Pure. */
export function parseRoutesArg(argv) {
  return parseJsSizeArgs(argv).routes;
}

const LHR_RE = /^lhr-\d+\.json$/;
/** One Lighthouse run's two files in .lighthouseci: the LHR json and its html report. */
const RUN_FILE_RE = /^lhr-\d+\.(json|html)$/;

/** W94/M3: the files one `lhci collect` just wrote — each run's `lhr-<ts>.json` and
 *  `lhr-<ts>.html` — i.e. the run files in `now` that were not in `before`. Pure.
 *  @param {Set<string>} before @param {string[]} now @returns {string[]} */
export function newRunFiles(before, now) {
  return now.filter((f) => RUN_FILE_RE.test(f) && !before.has(f));
}

/** W94/W137: the `npx` argv for one `--routes` collect — the Lighthouse config gate.sh picks
 *  (`lighthouseConfigFor`, e2e/helpers/face.ts: `skipAudits` is a collect-time setting) and
 *  `--extra-headers` only when the bypass header is non-empty (e2e/helpers/bypass.ts). Pure.
 *  @param {string} route @param {string} baseUrl @param {string} config
 *  @param {Record<string, string>} headers @returns {string[]} */
export function collectArgs(route, baseUrl, config, headers) {
  return [
    'lhci',
    'collect',
    '--additive',
    `--config=${config}`,
    ...(Object.keys(headers).length ? [`--extra-headers=${JSON.stringify(headers)}`] : []),
    `--url=${baseUrl}${route}`,
  ];
}

/** W94: collects `routes` (against E2E_BASE_URL) into `extraDir`, a directory separate from the
 *  main gate's `.lighthouseci`. `lhci collect` has no --outputDir (unlike `upload`) and always
 *  writes into `./.lighthouseci`, so each route is collected there and exactly the run files it
 *  just wrote (`newRunFiles`: the LHR json and its html report) are moved into `extraDir`, which
 *  is emptied of earlier runs first — a concurrent or prior gate run's own reports are never
 *  read, wiped or mixed in. */
function collectExtra(routes, baseUrl, extraDir, config, headers) {
  mkdirSync(extraDir, { recursive: true });
  for (const f of readdirSync(extraDir).filter((f) => RUN_FILE_RE.test(f))) {
    rmSync(join(extraDir, f));
  }
  for (const route of routes) {
    const before = new Set(existsSync('.lighthouseci') ? readdirSync('.lighthouseci') : []);
    process.stdout.write(`js-size: collecting ${route}\n`);
    execFileSync('npx', collectArgs(route, baseUrl, config, headers), { stdio: 'inherit' });
    for (const f of newRunFiles(before, readdirSync('.lighthouseci'))) {
      renameSync(join('.lighthouseci', f), join(extraDir, f));
    }
  }
}

/** W135/W137: the one site-face and bypass-header logic gate.sh uses — TypeScript beside the
 *  e2e specs, loaded through tsx's CommonJS API (its namespaced ESM `tsImport` cannot resolve
 *  bypass.ts's extensionless `./face` import on Node 25). Only the --routes path needs them. */
function gateHelpers() {
  const { require: tsRequire } = createRequire(import.meta.url)('tsx/cjs/api');
  const face = tsRequire('../e2e/helpers/face.ts', import.meta.url);
  const bypass = tsRequire('../e2e/helpers/bypass.ts', import.meta.url);
  return {
    lighthouseConfigFor: face.lighthouseConfigFor,
    protectionBypassHeaders: bypass.protectionBypassHeaders,
    bypassWarning: bypass.bypassWarning,
  };
}

function main() {
  const { routes, dir: dirArg, errors } = parseJsSizeArgs(process.argv.slice(2));
  if (errors.length) {
    process.stderr.write(`js-size: ${errors.join('; ')}\n${USAGE}\n`);
    process.exit(2);
  }
  const dir = dirArg ?? (routes ? '.lighthouseci-extra' : '.lighthouseci');

  if (routes) {
    const base = (process.env.E2E_BASE_URL ?? '').replace(/\/$/, '');
    if (!base) {
      process.stderr.write('js-size: --routes needs E2E_BASE_URL set to the server under test\n');
      process.exit(2);
    }
    const { lighthouseConfigFor, protectionBypassHeaders, bypassWarning } = gateHelpers();
    const warning = bypassWarning(base);
    if (warning) process.stderr.write(`js-size: warning — ${warning}\n`);
    const config = lighthouseConfigFor(base);
    process.stdout.write(`js-size: collecting with ${config}\n`);
    collectExtra(routes, base, dir, config, protectionBypassHeaders());
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
  process.stdout.write(`${formatMethodLine(lhrs)}\n\n`);
  process.stdout.write(`${formatJsSizeTable(rows)}\n\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
