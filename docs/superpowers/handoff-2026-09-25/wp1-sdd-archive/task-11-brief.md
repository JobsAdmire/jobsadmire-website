### Task 11: Legacy redirects as data (D21) — rules, generator, next.config, 410 in proxy

**Files:**

- Create: `redirects/rules.json`, `redirects/gsc-clicks.csv` (header only until the WP0 export lands), `scripts/build-redirects.ts`, `redirects/legacy.json` (generated), `redirects/redirects.test.ts`, `e2e/redirects.spec.ts`
- Modify: `next.config.ts` (`redirects()`), `src/proxy.ts` (410 set), `package.json` (`redirects:build`)

**Interfaces:**

- Produces: `redirects/legacy.json` = `Array<{ from: string; to: string | null; status: 308 | 410; source: string }>`; `next.config.ts` consumes the 308s; `proxy.ts` consumes the 410 prefixes via `import gone from '../redirects/gone.json'` (generated alongside).

Legacy facts: 47 old routes; default locale `en` unprefixed; prefixed locales `fr de tr ar ru fa id fil tk tg`; existing 301s `/home → /`, `/services/career-councelling → /services/career-counselling`.

- [ ] **Step 1: The rules table**

`redirects/rules.json` (one entry per old route; `to` is an INTERNAL pathname key from `src/i18n/routing.ts`; `disposition` is the D21 default before the GSC join):

```json
[
  { "from": "/", "to": "/", "disposition": "keep" },
  { "from": "/home", "to": "/", "disposition": "301" },
  { "from": "/about", "to": "/about", "disposition": "keep" },
  { "from": "/contact-us", "to": "/contact", "disposition": "301" },
  { "from": "/work-permit", "to": "/work-permit", "disposition": "keep" },
  { "from": "/hire-workers-in-turkey", "to": "/hire-workers", "disposition": "301" },
  { "from": "/job-recruitment", "to": "/hire-workers", "disposition": "301" },
  { "from": "/blog", "to": "/blog", "disposition": "keep" },
  { "from": "/blog/*", "to": null, "disposition": "410" },
  { "from": "/certifications", "to": "/about#lisans", "disposition": "301" },
  { "from": "/thankyou", "to": "/thank-you", "disposition": "301" },
  { "from": "/privacy", "to": "/privacy", "disposition": "keep" },
  { "from": "/terms", "to": "/terms", "disposition": "keep" },
  { "from": "/job", "to": "/available-workers", "disposition": "301" },
  { "from": "/job-detail/*", "to": null, "disposition": "410" },
  { "from": "/profile/*", "to": null, "disposition": "410" },
  { "from": "/services", "to": "/", "disposition": "301" },
  { "from": "/services/human-resource", "to": "/hire-workers", "disposition": "301" },
  { "from": "/services/talent-acquisition-process", "to": "/hire-workers", "disposition": "301" },
  { "from": "/services/global-job-placement", "to": "/hire-workers", "disposition": "301" },
  { "from": "/services/immigration", "to": "/work-permit", "disposition": "301" },
  { "from": "/services/visa", "to": "/work-permit", "disposition": "301" },
  { "from": "/services/career-counselling", "to": null, "disposition": "410" },
  { "from": "/services/career-councelling", "to": null, "disposition": "410" },
  { "from": "/services/interview-coaching-service", "to": null, "disposition": "410" },
  { "from": "/services/remote-work-opportunity", "to": null, "disposition": "410" },
  { "from": "/services/resume-service", "to": null, "disposition": "410" },
  { "from": "/services/skill-development-training", "to": null, "disposition": "410" },
  { "from": "/immigration/immigrate-to-usa", "to": null, "disposition": "410" },
  { "from": "/immigration/immigrate-to-uk", "to": null, "disposition": "410" },
  { "from": "/immigration/immigrate-to-canada", "to": null, "disposition": "410" },
  { "from": "/immigration/immigrate-to-australia", "to": null, "disposition": "410" },
  { "from": "/immigration/immigrate-to-turkey", "to": "/work-permit", "disposition": "301" },
  { "from": "/immigration/turkey-residence-permit", "to": "/work-permit", "disposition": "301" },
  { "from": "/immigration/kazakhstan-residence-permit", "to": null, "disposition": "410" },
  { "from": "/turkey-citizenship", "to": "/contact", "disposition": "301" },
  { "from": "/visa", "to": null, "disposition": "410" },
  { "from": "/visa-e-invitations", "to": null, "disposition": "410" },
  { "from": "/visa-e-invitation", "to": null, "disposition": "410" },
  { "from": "/apply-online", "to": null, "disposition": "410" },
  { "from": "/partner/recruiter-agency", "to": "/partner-with-us", "disposition": "301" },
  { "from": "/partner/job-provider", "to": "/partner-with-us", "disposition": "301" },
  { "from": "/partner/register-as-candidate", "to": "/available-workers", "disposition": "301" },
  { "from": "/register-as-candidate", "to": "/contact", "disposition": "301" },
  { "from": "/register-as-company", "to": "/hire-workers", "disposition": "301" },
  { "from": "/register-your-company", "to": "/hire-workers", "disposition": "301" },
  { "from": "/candidate-apply", "to": "/contact", "disposition": "301" },
  { "from": "/login-companies", "to": "/portal-login", "disposition": "301" },
  { "from": "/resume-generator", "to": null, "disposition": "410" },
  { "from": "/templates", "to": null, "disposition": "410" }
]
```

- [ ] **Step 2: Failing tests**

`redirects/redirects.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildRedirects } from '../scripts/build-redirects';
import rules from './rules.json';

const { redirects, gone } = buildRedirects(rules as never, []);
const froms = new Set(redirects.map((r) => r.from));

describe('legacy redirects (D21)', () => {
  it('expands every rule over the 10 dropped locale prefixes + unprefixed en + /tr', () => {
    // 47 routes: 'keep' rows produce entries only for prefixed locales; 301/410 produce 12 each
    expect(redirects.length + gone.length).toBeGreaterThan(400);
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
    const { redirects: r2 } = buildRedirects(rules as never, [{ url: '/visa', clicks: 12 }]);
    expect(r2.find((r) => r.from === '/visa')?.to).toBe('/en/work-permit');
  });
  it('unbounded spaces are 410 prefixes', () => {
    expect(gone).toContain('/blog/');
    expect(gone).toContain('/job-detail/');
  });
});
```

- [ ] **Step 3: Implement the generator**

`scripts/build-redirects.ts`:

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathnames } from '../src/i18n/routing';

type Rule = { from: string; to: string | null; disposition: 'keep' | '301' | '410' };
type Click = { url: string; clicks: number };
const DROPPED = ['fr', 'de', 'ar', 'ru', 'fa', 'id', 'fil', 'tk', 'tg'];
/** where a clicked-but-410 route lands (nearest relevant page) */
const RESCUE: Record<string, string> = {
  '/visa': '/work-permit',
  '/visa-e-invitations': '/work-permit',
  '/visa-e-invitation': '/work-permit',
  '/resume-generator': '/careers',
  '/templates': '/careers',
  '/apply-online': '/contact',
};

function external(locale: 'tr' | 'en', internal: string): string {
  const [path, hash] = internal.split('#');
  const p = pathnames[path as keyof typeof pathnames];
  const ext = typeof p === 'string' ? p : p[locale];
  const withPrefix = locale === 'en' ? `/en${ext === '/' ? '' : ext}` : ext;
  return `${withPrefix || '/'}${hash ? `#${hash}` : ''}`;
}

export function buildRedirects(rules: Rule[], clicks: Click[]) {
  const clicked = new Map(clicks.map((c) => [c.url, c.clicks]));
  const redirects: { from: string; to: string; status: 308; source: string }[] = [];
  const gone: string[] = [];
  const add = (from: string, to: string, source: string) => {
    if (from !== to) redirects.push({ from, to, status: 308, source });
  };
  for (const rule of rules) {
    const wildcard = rule.from.endsWith('/*');
    const base = wildcard ? rule.from.slice(0, -1) : rule.from;
    let disposition = rule.disposition;
    let to = rule.to;
    if (disposition === '410' && (clicked.get(rule.from) ?? 0) > 0 && RESCUE[rule.from]) {
      disposition = '301';
      to = RESCUE[rule.from];
    }
    if (disposition === '410') {
      gone.push(wildcard ? base : rule.from);
      continue;
    }
    const target = to ?? rule.from;
    // old unprefixed = English
    if (disposition === '301') add(rule.from, external('en', target), 'en');
    // old /tr → Turkish root slug; dropped locales → English
    add(`/tr${rule.from === '/' ? '' : rule.from}`, external('tr', target), 'tr');
    for (const l of DROPPED)
      add(`/${l}${rule.from === '/' ? '' : rule.from}`, external('en', target), l);
  }
  return { redirects, gone: Array.from(new Set(gone)) };
}

if (require.main === module) {
  const rules = JSON.parse(
    readFileSync(join(__dirname, '../redirects/rules.json'), 'utf8'),
  ) as Rule[];
  const csv = readFileSync(join(__dirname, '../redirects/gsc-clicks.csv'), 'utf8')
    .trim()
    .split('\n')
    .slice(1)
    .filter(Boolean);
  const clicks = csv.map((line) => {
    const [url, c] = line.split(',');
    return { url: url.trim(), clicks: Number(c) };
  });
  const out = buildRedirects(rules, clicks);
  writeFileSync(
    join(__dirname, '../redirects/legacy.json'),
    JSON.stringify(out.redirects, null, 1),
  );
  writeFileSync(join(__dirname, '../redirects/gone.json'), JSON.stringify(out.gone, null, 1));
  console.log(`${out.redirects.length} redirects, ${out.gone.length} gone prefixes`);
}
```

`redirects/gsc-clicks.csv`: `url,clicks` header only (WP0 baseline fills it; rerun `npm run redirects:build`).

`next.config.ts` add:

```ts
import legacy from './redirects/legacy.json';
// …
async redirects() {
  return (legacy as { from: string; to: string }[]).map((r) => ({ source: r.from, destination: r.to, permanent: true }));
},
```

`src/proxy.ts` — before calling `intl(request)`:

```ts
import gone from '../redirects/gone.json';
const GONE = gone as string[];
// …
const { pathname } = request.nextUrl;
if (GONE.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))) {
  return new NextResponse(null, { status: 410 });
}
```

(import `NextResponse` from `next/server`.)

`e2e/redirects.spec.ts`: `request.get('/contact-us', { maxRedirects: 0 })` → 308 with `location` `/en/contact`; `/tr/hire-workers-in-turkey` → `/isci-talebi`; `/de/about` → `/en/about`; `/job-detail/123` → 410; `/blog/anything` → 410; `/home` → `/en` … (assert exactly what `legacy.json` says for `/home`).

Run: `npm run redirects:build && npm run test -- redirects && npm run build && e2e` Expected: green; `next build` accepts ~500 redirects.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(redirects): data-driven legacy redirect map (GSC-joinable), single-hop 308s in next.config, 410 prefixes in proxy"
```

---

