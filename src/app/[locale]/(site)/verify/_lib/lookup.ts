/** The design's format hint in the empty lookup and the sticky search (Verify ll. 559, 603) — an
 *  id shape, not a person; locale-free, so a constant rather than copy. */
export const ID_EXAMPLE = 'JA-REP-014';
/** A result renders once the normalised query has this many characters (the design's `> 2`). */
export const LOOKUP_MIN_CHARS = 3;
/** The longest query a URL may prefill — a badge id is 10 characters; 80 covers a full name. */
export const DEEP_LINK_MAX = 80;
/** V-1: `?id=` is the canonical record deep link; `?rep=` and `#id=` are the design's aliases. */
export const DEEP_LINK_PARAMS = ['id', 'rep'] as const;
/** The token `sys.verify.lookup.resultBody` carries where the typed query is echoed. */
export const QUERY_TOKEN = '{query}';

export function normaliseQuery(q: string): string {
  return q.trim().replace(/\s+/g, ' ');
}

/** The prefilled query from `location.search` / `location.hash`, or null. Never throws: a
 *  malformed percent-escape in the hash falls back to the raw value (the query string is decoded
 *  by `URLSearchParams`, which never throws). */
export function readDeepLinkId(search: string, hash: string): string | null {
  const params = new URLSearchParams(search);
  const candidates: (string | null)[] = DEEP_LINK_PARAMS.map((k) => params.get(k));
  const match = /^#id=(.*)$/.exec(hash);
  if (match) {
    let value = match[1];
    try {
      value = decodeURIComponent(value);
    } catch {
      /* keep the raw value */
    }
    candidates.push(value);
  }
  for (const candidate of candidates) {
    if (candidate === null) continue;
    const value = normaliseQuery(candidate).slice(0, DEEP_LINK_MAX);
    if (value.length > 0) return value;
  }
  return null;
}

/** The raw result template split at its one `{query}`, so the island can bold the echo as React
 *  text (never HTML). A template without the token echoes nothing rather than printing it. */
export function splitAtQuery(template: string): {
  before: string;
  after: string;
  hasQuery: boolean;
} {
  const at = template.indexOf(QUERY_TOKEN);
  if (at === -1) return { before: template, after: '', hasQuery: false };
  return {
    before: template.slice(0, at),
    after: template.slice(at + QUERY_TOKEN.length),
    hasQuery: true,
  };
}
