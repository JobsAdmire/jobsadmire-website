import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathnames } from '../src/i18n/routing';

export type Rule = { from: string; to: string | null; disposition: 'keep' | '301' | '410' };
export type Click = { url: string; clicks: number };
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
