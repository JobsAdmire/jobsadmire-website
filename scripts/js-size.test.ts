/** @vitest-environment node */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  collectArgs,
  formatJsSizeTable,
  formatMethodLine,
  LAZY_LINE,
  newRunFiles,
  parseJsSizeArgs,
  parseRoutesArg,
  SCRIPT_CEILING,
  summarizeLhrs,
} from './js-size.mjs';

// The shape of the fields js-size reads from a Lighthouse LHR (lhr-<ts>.json): nothing else.
const lhr = (url: string, scriptBytes: number, lcpMs: number, perf: number) => ({
  lighthouseVersion: '12.0.0',
  finalDisplayedUrl: url,
  categories: { performance: { score: perf } },
  audits: {
    'largest-contentful-paint': { numericValue: lcpMs },
    'resource-summary': {
      details: {
        items: [
          { resourceType: 'total', transferSize: scriptBytes + 50_000 },
          { resourceType: 'script', transferSize: scriptBytes },
          { resourceType: 'stylesheet', transferSize: 20_000 },
        ],
      },
    },
  },
});

describe('js-size (W13 amended)', () => {
  it('pins the ceiling and the lazy-loading line', () => {
    expect(SCRIPT_CEILING).toBe(204_800);
    expect(LAZY_LINE).toBe(194_560);
    for (const file of [
      'lighthouserc.json',
      'lighthouserc.local.json',
      'lighthouserc.preview.json',
    ]) {
      const cfg = JSON.parse(readFileSync(file, 'utf8')) as {
        ci: { assert: { assertions: Record<string, [string, { maxNumericValue: number }]> } };
      };
      expect(cfg.ci.assert.assertions['resource-summary:script:size']).toEqual([
        'error',
        { maxNumericValue: SCRIPT_CEILING },
      ]);
    }
  });

  it('groups runs per path, keeps the worst script size, the median LCP and the lowest score', () => {
    const rows = summarizeLhrs([
      lhr('https://x.test/en', 172_509, 1400, 0.98),
      lhr('https://x.test/en', 172_600, 1600, 0.97),
      lhr('https://x.test/', 190_000, 2000, 0.96),
      lhr('https://x.test/', 196_000, 1000, 0.99),
      lhr('https://x.test/', 195_000, 1500, 0.95),
    ]);
    expect(rows.map((r) => r.path)).toEqual(['/', '/en']);
    expect(rows[0]).toMatchObject({
      runs: 3,
      scriptBytes: 196_000,
      headroomBytes: 8_800,
      lcpMs: 1500,
      performance: 0.95,
      overLazyLine: true,
      overCeiling: false,
    });
    expect(rows[1]).toMatchObject({ runs: 2, scriptBytes: 172_600, overLazyLine: false });
  });

  it('flags a route over the ceiling and keeps the query string in the path', () => {
    const [row] = summarizeLhrs([lhr('https://x.test/tesekkurler?form=hire', 210_000, 900, 0.9)]);
    expect(row.path).toBe('/tesekkurler?form=hire');
    expect(row.overCeiling).toBe(true);
    expect(row.headroomBytes).toBe(-5_200);
  });

  it('ignores files that are not Lighthouse results', () => {
    expect(summarizeLhrs([{ not: 'an lhr' }, null, 42])).toEqual([]);
  });

  it('states its method and the host it measured on (W136)', () => {
    const line = formatMethodLine([
      lhr('http://localhost:3000/en', 172_509, 1400, 0.98),
      lhr('http://localhost:3000/', 172_509, 1400, 0.98),
      { not: 'an lhr' },
    ]);
    expect(line).toContain(
      'Lighthouse resource-summary:script:size, transfer bytes on localhost:3000',
    );
    expect(line).toContain('W136');
    expect(formatMethodLine([lhr('https://x.vercel.app/en', 1, 1, 1)])).toContain(
      'transfer bytes on x.vercel.app',
    );
  });

  it('prints a markdown table the ledger can paste', () => {
    const table = formatJsSizeTable(summarizeLhrs([lhr('https://x.test/en', 172_509, 1400, 0.98)]));
    expect(table).toContain('| /en |');
    expect(table).toContain('172,509');
    expect(table).toContain('32,291');
  });
});

// W94: `node scripts/js-size.mjs --routes <path,...>` collects the given routes on demand (a
// spot-check outside the main gate route list) into a separate .lighthouseci-extra directory and
// prints their sizes the same way — never asserted. The arg parser, the collect argv and the
// file selection are the pure, testable parts; the `lhci collect` subprocess itself needs a live
// server and Chrome, so it is never spawned by this suite (memory rule) — README § Running the
// gate documents the command, and a task's report records its run.
describe('parseRoutesArg (W94)', () => {
  it('is null when --routes is absent', () => {
    expect(parseRoutesArg([])).toBeNull();
    expect(parseRoutesArg(['--dir=.lighthouseci'])).toBeNull();
  });

  it('splits a comma-separated route list', () => {
    expect(parseRoutesArg(['--routes=/blog,/en/blog'])).toEqual(['/blog', '/en/blog']);
    expect(parseRoutesArg(['--routes=/isci-talebi'])).toEqual(['/isci-talebi']);
  });

  it('drops empty entries from stray commas', () => {
    expect(parseRoutesArg(['--routes=/a,,/b,'])).toEqual(['/a', '/b']);
  });

  it("also takes W94's own spelling, `--routes <list>` (M2)", () => {
    expect(parseRoutesArg(['--routes', '/blog,/en/blog'])).toEqual(['/blog', '/en/blog']);
    expect(parseJsSizeArgs(['--routes', '/a', '--dir=.x'])).toEqual({
      routes: ['/a'],
      dir: '.x',
      errors: [],
    });
  });

  it('reports an unknown argument and a --routes without a list (M2)', () => {
    expect(parseJsSizeArgs(['--bogus']).errors).toEqual(["unknown argument '--bogus'"]);
    expect(parseJsSizeArgs(['--routes']).errors).toEqual(['--routes needs a comma-separated list']);
    expect(parseJsSizeArgs(['--routes', '--dir=.x']).errors).toEqual([
      '--routes needs a comma-separated list',
    ]);
    expect(parseJsSizeArgs(['--routes=,']).errors).toEqual([
      '--routes needs a comma-separated list',
    ]);
  });
});

// M2: the CLI exits 2 with the usage line instead of silently printing the last gate's table.
describe('js-size.mjs CLI arguments (M2)', () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ['scripts/js-size.mjs', ...args], {
      encoding: 'utf8',
      env: { ...process.env, E2E_BASE_URL: '' },
    });

  it('exits 2 with a usage line on an unknown argument', () => {
    const r = run('--bogus');
    expect(r.status).toBe(2);
    expect(r.stderr).toContain("unknown argument '--bogus'");
    expect(r.stderr).toContain('usage: node scripts/js-size.mjs');
  });

  it('treats `--routes /a,/b` as --routes (needs E2E_BASE_URL), not as no argument at all', () => {
    const r = run('--routes', '/foo,/bar');
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('--routes needs E2E_BASE_URL');
  });
});

// W94/W137: the `--routes` collector runs `lhci collect` with the same config gate.sh picks
// (lighthouseConfigFor — skipAudits is a collect-time setting) and the bypass header only when
// it is non-empty. The argv builder is the pure part; the subprocess needs a server and Chrome.
// `lhci collect` hands Lighthouse only its `settings` (a flags file): the header goes in as
// `--settings.extraHeaders=<JSON>`. A bare `--extra-headers` is not an lhci option and is
// silently dropped — proven against a local preview stand-in in the Task 7 fix round.
describe('collectArgs (W94/W137)', () => {
  it('collects with the chosen config and no header when the secret is blank', () => {
    expect(
      collectArgs('/tesekkurler?form=hire', 'http://localhost:3000', 'lighthouserc.local.json', {}),
    ).toEqual([
      'lhci',
      'collect',
      '--additive',
      '--config=lighthouserc.local.json',
      '--url=http://localhost:3000/tesekkurler?form=hire',
    ]);
  });

  it('passes the bypass header as JSON, whatever the secret contains', () => {
    const headers = { 'x-vercel-protection-bypass': 'q"uo\\te' };
    const args = collectArgs('/en', 'https://x.vercel.app', 'lighthouserc.preview.json', headers);
    expect(args).toContain('--config=lighthouserc.preview.json');
    const extra = args.find((a) => a.startsWith('--settings.extraHeaders=')) ?? '';
    expect(JSON.parse(extra.slice('--settings.extraHeaders='.length))).toEqual(headers);
    expect(args.at(-1)).toBe('--url=https://x.vercel.app/en');
  });

  it('never hands lhci the --extra-headers flag it ignores — gate.sh and js-size alike', () => {
    for (const file of ['scripts/gate.sh', 'scripts/js-size.mjs']) {
      const code = readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => !/^\s*(#|\/\/|\*|\/\*\*)/.test(line))
        .join('\n');
      expect(code, file).not.toContain('--extra-headers');
      expect(code, file).toContain('--settings.extraHeaders=');
    }
    expect(collectArgs('/en', 'https://x.vercel.app', 'c.json', { a: 'b' })).not.toContain(
      '--extra-headers={"a":"b"}',
    );
  });
});

// M3: the --routes collector moves exactly what its own `lhci collect` wrote — each run's
// lhr-<ts>.json AND its lhr-<ts>.html report — out of .lighthouseci, and nothing else.
describe('newRunFiles (W94, M3)', () => {
  it("picks this run's LHR json and html, never an earlier run's or other files", () => {
    const before = new Set(['lhr-1.json', 'lhr-1.html', 'assertion-results.json']);
    const now = [...before, 'lhr-2.json', 'lhr-2.html', 'lhr-3.json', 'lhr-3.html', 'notes.txt'];
    expect(newRunFiles(before, now)).toEqual([
      'lhr-2.json',
      'lhr-2.html',
      'lhr-3.json',
      'lhr-3.html',
    ]);
  });
});
