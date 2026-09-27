/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  collectArgs,
  formatJsSizeTable,
  LAZY_LINE,
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

  it('prints a markdown table the ledger can paste', () => {
    const table = formatJsSizeTable(summarizeLhrs([lhr('https://x.test/en', 172_509, 1400, 0.98)]));
    expect(table).toContain('| /en |');
    expect(table).toContain('172,509');
    expect(table).toContain('32,291');
  });
});

// W94: `node scripts/js-size.mjs --routes <path,...>` collects the given routes on demand (a
// spot-check outside the main gate route list) into a separate .lighthouseci-extra directory and
// prints their sizes the same way — never asserted. The arg parser is the pure, testable part;
// the actual `lhci collect` subprocess call needs a live server and Chrome, so it is exercised
// manually (README § Running the gate), not spawned by this suite (memory rule: at most two
// Lighthouse runs for the whole task, both reserved for the real gate proof).
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
});

// W94/W137: the `--routes` collector runs `lhci collect` with the same config gate.sh picks
// (lighthouseConfigFor — skipAudits is a collect-time setting) and the bypass header only when
// it is non-empty. The argv builder is the pure part; the subprocess needs a server and Chrome.
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
    const extra = args.find((a) => a.startsWith('--extra-headers=')) ?? '';
    expect(JSON.parse(extra.slice('--extra-headers='.length))).toEqual(headers);
    expect(args.at(-1)).toBe('--url=https://x.vercel.app/en');
  });
});
