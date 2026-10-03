/** Extract numbers as canonical strings: thousands separators dropped, decimal comma → dot. */
export function numericTokens(s: string): string[] {
  const out: string[] = [];
  const re = /\d[\d.,\s ]*\d|\d/g;
  for (const m of s.matchAll(re)) {
    let t = m[0].replace(/[\s ]/g, '');
    // decide decimal separator: the LAST separator followed by exactly 2 digits is a decimal
    const dec = t.match(/^(.*)([.,])(\d{1,2})$/);
    if (dec) t = dec[1].replace(/[.,]/g, '') + '.' + dec[3];
    else t = t.replace(/[.,]/g, '');
    out.push(t);
  }
  return out;
}

export function findParityViolations(
  tr: Record<string, string>,
  en: Record<string, string>,
  exceptions: Record<string, string>,
): string[] {
  const bad: string[] = [];
  for (const id of Object.keys(en)) {
    if (id in exceptions) continue;
    if (tr[id] === '') continue; // deliberately empty fragments
    const a = numericTokens(en[id]).sort();
    const b = numericTokens(tr[id] ?? '').sort();
    if (a.join('|') !== b.join('|')) bad.push(id);
  }
  return bad;
}

/** D18: Turkish writes `38.944 ₺`, never `₺38.944`. */
export function findLeadingLiraViolations(tr: Record<string, string>): string[] {
  return Object.entries(tr)
    .filter(([, v]) => /₺\s?\d/.test(v))
    .map(([id]) => id);
}

export type MetricLiterals = Record<string, readonly string[]>;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A metric literal is the exact spelling a metric takes in copy, with the value span the
 * importer swaps for `{key}` marked in square brackets: `"[22+] clients"`, `"within [24] hours"`,
 * `"[13'ten fazla] ülke"` — unit-bound where the bare number would be ambiguous. No brackets
 * means the whole literal is the value (`"470+"`). `text` is the spelling the lint matches.
 */
export function parseMetricLiteral(literal: string): {
  text: string;
  pre: string;
  span: string;
  post: string;
} {
  const m = literal.match(/^([^[\]]*)\[([^[\]]+)\]([^[\]]*)$/);
  if (m) return { text: `${m[1]}${m[2]}${m[3]}`, pre: m[1], span: m[2], post: m[3] };
  if (/[[\]]/.test(literal))
    throw new Error(`metric literal "${literal}": one [value] span, nothing else`);
  return { text: literal, pre: '', span: literal, post: '' };
}

/**
 * D17: a metric value typed into copy must be a `{placeholder}`. `literals` come from
 * `scripts/metric-placeholders.json` § literals (markers ignored here); `baseline` is
 * `scripts/metric-lint-baseline.json` (legal-flagged strings kept verbatim, with a reason).
 * Case-insensitive so "Within 24h" and "within 24h" are the same literal.
 */
export function findHardTypedMetrics(
  strings: Record<string, string>,
  literals: MetricLiterals,
  baseline: Record<string, string> = {},
): string[] {
  const patterns = Object.values(literals)
    .flat()
    .map((l) => new RegExp(escapeRegExp(parseMetricLiteral(l).text), 'i'));
  return Object.entries(strings)
    .filter(([id, v]) => !(id in baseline) && patterns.some((re) => re.test(v)))
    .map(([id]) => id)
    .sort();
}
