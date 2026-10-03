/** @vitest-environment node */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { expectedRobots, lighthouseConfigFor, siteFace } from '../e2e/helpers/face';

// W135: the ONE site-face helper. It lives beside the e2e specs that assert robots.txt, and is
// tested here because Vitest never collects e2e/** (and Playwright would collect an e2e/*.test.ts).
const env = (o: Record<string, string>) => o as NodeJS.ProcessEnv;

describe('siteFace (W135)', () => {
  it('a *.vercel.app deployment URL is the preview face, whatever this shell says', () => {
    expect(siteFace('https://jobsadmire-web-v2-git-wp2-x.vercel.app', env({}))).toBe('preview');
    expect(
      siteFace(
        'https://jobsadmire-web-v2-abc123.vercel.app/en',
        env({ NEXT_PUBLIC_SITE_FACE: 'production' }),
      ),
    ).toBe('preview');
  });

  it('the staging.jobsadmire.com Preview alias is the preview face', () => {
    expect(siteFace('https://staging.jobsadmire.com', env({}))).toBe('preview');
    expect(siteFace('https://STAGING.jobsadmire.com/isci-talebi', env({}))).toBe('preview');
  });

  it('localhost is production unless NEXT_PUBLIC_SITE_FACE is set to anything but production', () => {
    // Unset (or blank) is production: robots.ts is VERCEL_ENV-driven and prerendered at build,
    // and a local build with VERCEL_ENV unset serves the production rules.
    expect(siteFace('http://localhost:3000', env({}))).toBe('production');
    expect(siteFace('http://localhost:3000', env({ NEXT_PUBLIC_SITE_FACE: '  ' }))).toBe(
      'production',
    );
    expect(siteFace('http://127.0.0.1:3100', env({ NEXT_PUBLIC_SITE_FACE: 'production' }))).toBe(
      'production',
    );
    expect(siteFace('http://localhost:3000', env({ NEXT_PUBLIC_SITE_FACE: 'preview' }))).toBe(
      'preview',
    );
  });

  it('the production host is production; expectedRobots is the site face', () => {
    expect(siteFace('https://www.jobsadmire.com', env({}))).toBe('production');
    expect(expectedRobots('https://staging.jobsadmire.com', env({}))).toBe('preview');
    expect(expectedRobots('http://localhost:3000', env({}))).toBe('production');
  });
});

describe('lighthouseConfigFor (W135/W137 — what gate.sh and js-size collect AND assert with)', () => {
  it('a preview face skips is-crawlable and robots-txt: lighthouserc.preview.json', () => {
    expect(lighthouseConfigFor('https://x-git-wp2.vercel.app', env({}))).toBe(
      'lighthouserc.preview.json',
    );
    expect(lighthouseConfigFor('https://staging.jobsadmire.com', env({}))).toBe(
      'lighthouserc.preview.json',
    );
    // The face wins over localhost: a server answering `Disallow: /` can never score SEO 1.0
    // with the audit live (the local stand-in / VERCEL_ENV=preview rehearsal).
    expect(
      lighthouseConfigFor('http://127.0.0.1:3200', env({ NEXT_PUBLIC_SITE_FACE: 'preview' })),
    ).toBe('lighthouserc.preview.json');
    // W140: robots-txt is skipped for the same reason as is-crawlable — Lighthouse's own robots
    // fetch cannot carry the bypass header, so on a protected preview it parses Vercel's login
    // page instead of the real file.
    const cfg = JSON.parse(readFileSync('lighthouserc.preview.json', 'utf8')) as {
      ci: { collect: { settings: { skipAudits: string[] } } };
    };
    expect(cfg.ci.collect.settings.skipAudits).toEqual(['is-crawlable', 'robots-txt']);
  });

  it('localhost with the production face: lighthouserc.local.json (identical to production since W145)', () => {
    expect(lighthouseConfigFor('http://localhost:3000', env({}))).toBe('lighthouserc.local.json');
    expect(lighthouseConfigFor('http://127.0.0.1:3100/', env({}))).toBe('lighthouserc.local.json');
  });

  it('anything else: lighthouserc.json', () => {
    expect(lighthouseConfigFor('https://www.jobsadmire.com', env({}))).toBe('lighthouserc.json');
  });
});

// W145 (closes W141): the gate measures LCP and performance under DevTools throttling, median of
// three runs, in all three configs. Lantern's simulation charged the whole initial waterfall to a
// text LCP element with no resource of its own (a placeholder page read ~3.0 s simulated vs
// ~1.55 s observed under real throttling), so the assertions keep their values and now judge a
// real, throttled paint — and R50's localhost LCP waiver retires with the simulation it excused.
describe('Lighthouse configs measure under DevTools throttling, median of three (W145)', () => {
  const CONFIGS = ['lighthouserc.json', 'lighthouserc.local.json', 'lighthouserc.preview.json'];
  type Rc = {
    _comment: string;
    ci: {
      collect: { numberOfRuns: number; settings: Record<string, unknown> };
      assert: { aggregationMethod?: string; assertions: Record<string, unknown> };
      upload: unknown;
    };
  };
  const read = (file: string) => JSON.parse(readFileSync(file, 'utf8')) as Rc;

  it.each(CONFIGS)('%s: devtools throttling, 3 runs, asserted on the median', (file) => {
    const { collect, assert } = read(file).ci;
    expect(collect.settings.throttlingMethod).toBe('devtools');
    expect(collect.settings.formFactor).toBe('mobile');
    expect(collect.numberOfRuns).toBe(3);
    expect(assert.aggregationMethod).toBe('median');
  });

  it.each(CONFIGS)('%s: LCP ≤ 2,500 ms and performance ≥ 0.95 are errors, never waived', (file) => {
    const { assertions } = read(file).ci.assert;
    expect(assertions['largest-contentful-paint']).toEqual(['error', { maxNumericValue: 2500 }]);
    expect(assertions['categories:performance']).toEqual(['error', { minScore: 0.95 }]);
  });

  it('R50 retired: the local config equals the production one but for its comment', () => {
    const { ci: local } = read('lighthouserc.local.json');
    expect(local).toEqual(read('lighthouserc.json').ci);
  });

  it('the preview config differs from the production one only by its two skipped audits', () => {
    const preview = read('lighthouserc.preview.json').ci;
    const production = read('lighthouserc.json').ci;
    const { skipAudits, ...settings } = preview.collect.settings;
    expect(skipAudits).toEqual(['is-crawlable', 'robots-txt']);
    expect({ ...preview, collect: { ...preview.collect, settings } }).toEqual(production);
  });
});
