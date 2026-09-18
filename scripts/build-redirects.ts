import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathnames } from '../src/i18n/routing';

export type Rule = { from: string; to: string | null; disposition: 'keep' | '301' | '410' };
export type Click = { url: string; clicks: number };
const DROPPED = ['fr', 'de', 'ar', 'ru', 'fa', 'id', 'fil', 'tk', 'tg'];
/**
 * Where a clicked-but-410 route lands (nearest relevant page). Every `410` row in
 * `redirects/rules.json` needs an entry here, or the D21 GSC join cannot rescue it: the
 * promotion below only fires when the row has a target to be promoted *to*. Wildcard rows
 * (`/job-detail/*`) are keyed by the rule's own `from`, wildcard and all.
 */
const RESCUE: Record<string, string> = {
  '/visa': '/work-permit',
  '/visa-e-invitations': '/work-permit',
  '/visa-e-invitation': '/work-permit',
  '/resume-generator': '/careers',
  '/templates': '/careers',
  '/apply-online': '/contact',
  '/services/career-counselling': '/contact',
  '/services/career-councelling': '/contact',
  '/services/interview-coaching-service': '/contact',
  '/services/remote-work-opportunity': '/contact',
  '/services/skill-development-training': '/contact',
  '/immigration/immigrate-to-usa': '/work-permit',
  '/immigration/immigrate-to-uk': '/work-permit',
  '/immigration/immigrate-to-canada': '/work-permit',
  '/immigration/immigrate-to-australia': '/work-permit',
  '/immigration/kazakhstan-residence-permit': '/work-permit',
  '/job-detail/*': '/available-workers',
  '/profile/*': '/available-workers',
};

export function external(locale: 'tr' | 'en', internal: string): string {
  const [path, hash] = internal.split('#');
  const p = pathnames[path as keyof typeof pathnames];
  const ext = typeof p === 'string' ? p : p[locale];
  const withPrefix = locale === 'en' ? `/en${ext === '/' ? '' : ext}` : ext;
  return `${withPrefix || '/'}${hash ? `#${hash}` : ''}`;
}

/**
 * Every external path the new site already serves (TR at the root, EN under /en) — R33. A
 * next.config redirect applies to all traffic, so a legacy rule whose old unprefixed `from`
 * happens to already be a live route on the new site (e.g. the shared '/' and '/blog' keep
 * rows) must never get the unprefixed-English add below, or it would clobber that live route.
 */
export const LIVE = new Set(
  Object.values(pathnames).flatMap((p) =>
    typeof p === 'string' ? [p, `/en${p === '/' ? '' : p}`] : [p.tr, `/en${p.en}`],
  ),
);

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
    // A wildcard row is never itself a clicked URL — the GSC export carries the leaves
    // (`/job-detail/8812`), so the prefix is promoted when *any* URL under it was clicked.
    const hits = wildcard
      ? Array.from(clicked).reduce((n, [url, c]) => (url.startsWith(base) ? n + c : n), 0)
      : (clicked.get(rule.from) ?? 0);
    if (disposition === '410' && hits > 0 && RESCUE[rule.from]) {
      disposition = '301';
      to = RESCUE[rule.from];
    }
    if (disposition === '410') {
      gone.push(wildcard ? base : rule.from);
      continue;
    }
    const target = to ?? rule.from;
    // A promoted wildcard keeps matching the whole space it rescued, in next.config's own
    // source syntax (`/job-detail/:rest*`) — a bare `*` is not a path-to-regexp token.
    const from = wildcard ? `${base}:rest*` : rule.from;
    // old unprefixed = English, unless the old path is itself a live route on the new site
    if (!LIVE.has(from)) add(from, external('en', target), 'en');
    // old /tr → Turkish root slug; dropped locales → English
    add(`/tr${from === '/' ? '' : from}`, external('tr', target), 'tr');
    for (const l of DROPPED) add(`/${l}${from === '/' ? '' : from}`, external('en', target), l);
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
