import { describe, expect, it } from 'vitest';
import { buildRedirects, external, LIVE, type Rule } from '../scripts/build-redirects';
import { pathnames } from '../src/i18n/routing';
import rules from './rules.json';

const { redirects, gone } = buildRedirects(rules as Rule[], []);
const froms = new Set(redirects.map((r) => r.from));
const isGone = (path: string) =>
  gone.some((p) => path === p || path.startsWith(p.endsWith('/') ? p : `${p}/`));

describe('legacy redirects (D21)', () => {
  it('expands every rule over the 10 dropped locale prefixes + unprefixed en + /tr', () => {
    // 49 rules in rules.json: every non-410 rule adds /tr + the 9 dropped locales (10 adds
    // each), plus an unprefixed /en add unless the old path is itself a live route on the new
    // site (R33) — only the shared '/' and '/blog' keep rows are guarded, so 4 of the 6 'keep'
    // rows and all 24 '301' rows get that 11th add. 19 '410' rows become gone prefixes instead.
    expect(redirects.length + gone.length).toBeGreaterThan(250);
    // Pinned to the generator's actual output (`npm run redirects:build`). These numbers change
    // only when redirects/rules.json (or the pathnames table it targets) changes.
    expect(redirects.length).toBe(328);
    expect(gone.length).toBe(19);
  });
  it('never chains: no destination is another rule source', () => {
    for (const r of redirects) expect(froms.has(r.to), `${r.from} → ${r.to} chains`).toBe(false);
  });
  it('never redirects a live route', () => {
    // A next.config redirect applies to all traffic, so a legacy rule must never fire on a path
    // the new site already serves (R33) — e.g. the shared '/' and '/blog' keep rows.
    for (const r of redirects) {
      expect(LIVE.has(r.from), `${r.from} is a live route and must not redirect`).toBe(false);
    }
  });
  it('old unprefixed English keep routes land on /en', () => {
    // The old site was English-unprefixed; these 'keep' rows now have different TR slugs
    // (/hakkimizda, /calisma-izni, /gizlilik, /kullanim-kosullari), so the bare old path must
    // redirect to the new /en equivalent instead of 404ing (R33).
    expect(redirects.find((r) => r.from === '/about')?.to).toBe('/en/about');
    expect(redirects.find((r) => r.from === '/work-permit')?.to).toBe('/en/work-permit');
    expect(redirects.find((r) => r.from === '/privacy')?.to).toBe('/en/privacy');
    expect(redirects.find((r) => r.from === '/terms')?.to).toBe('/en/terms');
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
  it('a clicked leaf under a wildcard 410 promotes the whole prefix (R57)', () => {
    // The GSC export carries leaves, never the `/job-detail/*` pattern itself, so the join
    // has to look under the prefix — and the promoted source is emitted in next.config's own
    // wildcard syntax, not a bare `*`.
    const { redirects: r2, gone: g2 } = buildRedirects(rules as Rule[], [
      { url: '/job-detail/8812', clicks: 7 },
    ]);
    expect(g2).not.toContain('/job-detail/');
    expect(r2.find((r) => r.from === '/job-detail/:rest*')?.to).toBe('/en/available-workers');
    expect(r2.find((r) => r.from === '/tr/job-detail/:rest*')?.to).toBe('/adaylar');
  });
  it('unbounded spaces are 410 prefixes — but the blog namespace is not (R53)', () => {
    expect(gone).toContain('/job-detail/');
    expect(gone).toContain('/profile/');
    // R53: `/blog/<slug>` is a live Turkish route (pathnames '/blog/[slug]' at the TR root),
    // so the old blog space cannot be a 410 prefix. Old article URLs 404 through the locale
    // catch-all instead; their slugs came from a dead API and cannot be enumerated.
    expect(gone).not.toContain('/blog/');
  });
  it('no live route — including a dynamic one — falls inside a 410 prefix (R53)', () => {
    // The invariant the /blog/* row broke: a pathnames entry that the proxy would answer 410
    // for is dead on arrival. Same prefix semantics as src/proxy.ts.
    for (const internal of Object.keys(pathnames) as (keyof typeof pathnames)[]) {
      for (const locale of ['tr', 'en'] as const) {
        const path = external(locale, internal).replace('[slug]', 'sample');
        expect(isGone(path), `${locale} ${internal} → ${path} is inside a 410 prefix`).toBe(false);
      }
    }
  });
  it('no destination is swallowed by a 410 prefix', () => {
    // Same prefix semantics as src/proxy.ts's GONE check; the hash (if any) is client-only and
    // never sent to the server, so it's stripped before checking.
    for (const r of redirects) {
      const pathname = r.to.split('#')[0];
      expect(isGone(pathname), `${r.from} → ${r.to} lands on a 410 prefix`).toBe(false);
    }
  });
});
