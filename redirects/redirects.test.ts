import { describe, expect, it } from 'vitest';
import { buildRedirects, type Rule } from '../scripts/build-redirects';
import rules from './rules.json';

const { redirects, gone } = buildRedirects(rules as Rule[], []);
const froms = new Set(redirects.map((r) => r.from));

describe('legacy redirects (D21)', () => {
  it('expands every rule over the 10 dropped locale prefixes + unprefixed en + /tr', () => {
    // 50 rules in rules.json: 6 'keep' rows produce entries only for the 9 dropped locales +
    // /tr (10 adds each); 24 '301' rows also add an unprefixed /en entry (11 adds each); 20
    // '410' rows become gone prefixes instead of redirects.
    expect(redirects.length + gone.length).toBeGreaterThan(250);
    // Pinned to the generator's actual first-run output (`npm run redirects:build`). These
    // numbers change only when redirects/rules.json changes.
    expect(redirects.length).toBe(324);
    expect(gone.length).toBe(20);
  });
  it('never chains: no destination is another rule source', () => {
    for (const r of redirects) expect(froms.has(r.to), `${r.from} → ${r.to} chains`).toBe(false);
  });
  it('old /tr/* goes to the unprefixed Turkish slug, everything else to /en', () => {
    expect(redirects.find((r) => r.from === '/tr/hire-workers-in-turkey')?.to).toBe('/isci-talebi');
    expect(redirects.find((r) => r.from === '/hire-workers-in-turkey')?.to).toBe(
      '/en/hire-workers',
    );
    expect(redirects.find((r) => r.from === '/de/contact-us')?.to).toBe('/en/contact');
  });
  it('a clicked 410 route is promoted to a 301 (GSC join)', () => {
    const { redirects: r2 } = buildRedirects(rules as Rule[], [{ url: '/visa', clicks: 12 }]);
    expect(r2.find((r) => r.from === '/visa')?.to).toBe('/en/work-permit');
  });
  it('unbounded spaces are 410 prefixes', () => {
    expect(gone).toContain('/blog/');
    expect(gone).toContain('/job-detail/');
  });
});
