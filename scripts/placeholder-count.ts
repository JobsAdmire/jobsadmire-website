import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { GATE_ROUTES } from '../e2e/routes';

/**
 * D26 content-readiness (the launch profile of `scripts/gate.sh`): every image slot a page
 * renders without its real asset carries `data-placeholder="<design slot id>"` (Task 5's
 * `ImageSlot` emits it; W55: always named); the element Lighthouse will pick as LCP carries
 * `data-lcp-slot="<slot>"` (the hero `<img>` once the photo ships, the h1 on a gradient hero).
 * A page's named LCP slot may never be a placeholder. Server HTML is enough — both attributes
 * are rendered by server components, so no browser runs.
 */
export type PlaceholderScan = { placeholders: string[]; lcpSlots: string[]; both: string[] };
export type RouteVerdict = {
  route: string;
  status: number | null;
  placeholders: string[];
  lcpSlot: string | null;
  problems: string[];
};

const TAG_RE = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;

/** Attribute value from a start tag's attribute string; `''` for a bare attribute, `null` when absent. */
function attr(attrs: string, name: string): string | null {
  const re = new RegExp(
    `(?:^|\\s)${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>/]+)))?(?=[\\s/]|$)`,
  );
  const m = re.exec(attrs);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? '';
}

export function scanPlaceholders(html: string): PlaceholderScan {
  // The RSC flight payload (`<script>self.__next_f.push(…)`) carries the same props as JSON —
  // never as tags — but strip scripts and comments anyway so nothing but rendered markup counts.
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const scan: PlaceholderScan = { placeholders: [], lcpSlots: [], both: [] };
  for (const m of markup.matchAll(TAG_RE)) {
    const attrs = m[2];
    const placeholder = attr(attrs, 'data-placeholder');
    const lcp = attr(attrs, 'data-lcp-slot');
    if (placeholder !== null) scan.placeholders.push(placeholder);
    if (lcp !== null) scan.lcpSlots.push(lcp);
    if (placeholder !== null && lcp !== null) scan.both.push(lcp || placeholder);
  }
  return scan;
}

export function evaluateScan(
  route: string,
  status: number | null,
  scan: PlaceholderScan,
): RouteVerdict {
  const problems: string[] = [];
  if (status === null) problems.push('no response');
  else if (status !== 200) problems.push(`HTTP ${status}`);
  if (scan.lcpSlots.length === 0) problems.push('no data-lcp-slot on the page');
  if (scan.lcpSlots.length > 1)
    problems.push(`more than one data-lcp-slot: ${scan.lcpSlots.join(', ')}`);
  const flagged = new Set<string>(scan.both);
  for (const slot of scan.lcpSlots) if (slot && scan.placeholders.includes(slot)) flagged.add(slot);
  for (const slot of flagged) problems.push(`LCP slot "${slot}" is a placeholder (D26)`);
  if (scan.placeholders.includes('')) problems.push('unnamed data-placeholder (W55)');
  return {
    route,
    status,
    placeholders: scan.placeholders,
    lcpSlot: scan.lcpSlots[0] ?? null,
    problems,
  };
}

const name = (s: string) => (s === '' ? '(unnamed)' : s);

export function formatReadinessTable(verdicts: RouteVerdict[]): string {
  const lines = [
    '| route | status | placeholders | slots | LCP slot | verdict |',
    '| --- | ---: | ---: | --- | --- | --- |',
  ];
  for (const v of verdicts) {
    lines.push(
      `| ${v.route} | ${v.status ?? '—'} | ${v.placeholders.length} | ${
        v.placeholders.length ? v.placeholders.map(name).join(', ') : '—'
      } | ${v.lcpSlot ?? '—'} | ${v.problems.length ? `FAIL: ${v.problems.join('; ')}` : 'ok'} |`,
    );
  }
  return lines.join('\n');
}

async function fetchRoute(
  base: string,
  route: string,
): Promise<{ status: number | null; html: string }> {
  try {
    const res = await fetch(`${base}${route}`, {
      headers: { accept: 'text/html' },
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
    return { status: res.status, html: res.ok ? await res.text() : '' };
  } catch {
    return { status: null, html: '' };
  }
}

async function main() {
  const base = (process.env.E2E_BASE_URL ?? '').replace(/\/$/, '');
  if (!base) {
    console.error('placeholder-count: set E2E_BASE_URL to the preview or local URL');
    process.exit(2);
  }
  const verdicts: RouteVerdict[] = [];
  for (const route of GATE_ROUTES) {
    const { status, html } = await fetchRoute(base, route);
    verdicts.push(evaluateScan(route, status, scanPlaceholders(html)));
  }
  const table = formatReadinessTable(verdicts);
  console.log(`\ngate: content readiness (D26) — ${base}\n\n${table}\n`);
  const outDir = join(__dirname, '..', 'lighthouse-report');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'content-readiness.json'),
    JSON.stringify({ base, generatedAt: new Date().toISOString(), routes: verdicts }, null, 1),
  );
  const failing = verdicts.filter((v) => v.problems.length);
  if (failing.length) {
    console.error(`placeholder-count: ${failing.length} route(s) fail the LCP-slot / naming rules`);
    process.exit(1);
  }
  const total = verdicts.reduce((n, v) => n + v.placeholders.length, 0);
  console.log(
    `placeholder-count: ${total} placeholder(s) across ${verdicts.length} route(s); no LCP slot is a placeholder`,
  );
}

if (require.main === module) void main();
