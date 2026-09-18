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

/** D17: a metric value typed into copy must be a placeholder like {placed}. */
export function findHardTypedMetrics(
  strings: Record<string, string>,
  metrics: Record<string, number>,
): string[] {
  const values = new Set(Object.values(metrics).map(String));
  return Object.entries(strings)
    .filter(([, v]) => numericTokens(v).some((t) => values.has(t)))
    .map(([id]) => id);
}
