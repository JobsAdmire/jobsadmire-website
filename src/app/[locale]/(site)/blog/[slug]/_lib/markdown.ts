/**
 * The v1 blog body grammar (docs/CONTENT-MODEL.md § Blog, B-8): exactly what the importer writes
 * today (W64 — the EN body composed from blogarticle.025–063) and what the Phase B editor may
 * write. Blocks are separated by blank lines; inside a block only `**bold**` is markup. Anything
 * else — HTML, links, images — is text: there is no HTML pass-through, so there is nothing to
 * sanitise, and `ArticleBody` emits React nodes, never a string. Pure: no React, no DOM.
 */
export type Inline = { kind: 'text'; text: string } | { kind: 'strong'; text: string };
export type Heading = { id: string; text: string };
export type Block =
  | { kind: 'p'; inlines: Inline[] }
  | { kind: 'h2'; id: string; text: string }
  | { kind: 'ul'; items: Inline[][] }
  | { kind: 'ol'; items: Inline[][] }
  | { kind: 'leads'; items: { lead: string; body: Inline[] }[] }
  | { kind: 'callout'; title: string; items: Inline[][] }
  | { kind: 'quote'; inlines: Inline[] };

const STRONG = /\*\*(.+?)\*\*/g;
// No `s` flag (ES2018; the tsconfig targets ES2017): `[\s\S]` spans the joined lines.
const LEAD = /^\*\*(.+?)\*\*\s+—\s+([\s\S]+)$/;
const UL = /^-\s+/;
const OL = /^\d+\.\s+/;
const CALLOUT_TITLE = /^\*\*(.+)\*\*$/;
const HEADING_LINE = /^(## .*)$/gm;
const DIACRITICS = /[\u0300-\u036f]/g; // combining marks left by NFKD (escaped, never literal)

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(STRONG)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: 'text', text: text.slice(last, at) });
    out.push({ kind: 'strong', text: m[1] });
    last = at + m[0].length;
  }
  if (last < text.length || out.length === 0) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

/** Deterministic ASCII heading ids (the TOC anchors): Turkish letters fold to ASCII so both
 *  locales produce the same id shape; a collision — or a reserved page id such as `faq` — gets a
 *  numeric suffix. */
export function headingId(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .normalize('NFKD')
      .replace(DIACRITICS, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  let id = base;
  for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
  used.add(id);
  return id;
}

/** A blockquote: `**Title**` + a `- ` list is the takeaways callout; anything else a quote. */
function parseQuote(lines: readonly string[]): Block {
  const groups: string[][] = [[]];
  for (const raw of lines) {
    const line = raw.replace(/^>\s?/, '').trim();
    const current = groups[groups.length - 1];
    if (line === '') {
      if (current.length > 0) groups.push([]);
    } else {
      current.push(line);
    }
  }
  const parts = groups.filter((g) => g.length > 0);
  const title = parts.length === 2 ? CALLOUT_TITLE.exec(parts[0].join(' ')) : null;
  if (title && parts[1].every((line) => UL.test(line))) {
    return {
      kind: 'callout',
      title: title[1],
      items: parts[1].map((line) => parseInline(line.replace(UL, ''))),
    };
  }
  return { kind: 'quote', inlines: parseInline(parts.map((g) => g.join(' ')).join(' ')) };
}

/** Blocks in document order. `reserved` seeds the heading-id set with the page's own ids
 *  (`faq`, `blog-cta`, `main`), so a body heading never shadows one. */
export function parseMarkdown(md: string, reserved: readonly string[] = []): Block[] {
  const used = new Set<string>(reserved);
  const blocks: Block[] = [];
  const chunks = md
    .replace(/\r\n?/g, '\n')
    .replace(HEADING_LINE, '\n$1\n') // a heading is always a block of its own
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((line) => line.trim());
    if (lines.length === 1 && lines[0].startsWith('## ')) {
      const text = lines[0].slice(3).trim();
      blocks.push({ kind: 'h2', id: headingId(text, used), text });
    } else if (lines.every((line) => line.startsWith('>'))) {
      blocks.push(parseQuote(lines));
    } else if (lines.every((line) => UL.test(line))) {
      blocks.push({ kind: 'ul', items: lines.map((line) => parseInline(line.replace(UL, ''))) });
    } else if (lines.every((line) => OL.test(line))) {
      blocks.push({ kind: 'ol', items: lines.map((line) => parseInline(line.replace(OL, ''))) });
    } else {
      const joined = lines.join(' ');
      const lead = LEAD.exec(joined);
      const previous = blocks[blocks.length - 1];
      if (lead) {
        const item = { lead: lead[1], body: parseInline(lead[2]) };
        if (previous?.kind === 'leads') previous.items.push(item);
        else blocks.push({ kind: 'leads', items: [item] });
      } else {
        blocks.push({ kind: 'p', inlines: parseInline(joined) });
      }
    }
  }
  return blocks;
}

/** The h2 entries of a parsed body, in order (the TOC). */
export function headings(blocks: readonly Block[]): Heading[] {
  return blocks.flatMap((b) => (b.kind === 'h2' ? [{ id: b.id, text: b.text }] : []));
}
