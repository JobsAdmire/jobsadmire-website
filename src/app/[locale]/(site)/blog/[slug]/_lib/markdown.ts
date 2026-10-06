import { isBlogImageSrc } from '@/lib/blog-media';

/**
 * The site's blog body grammar (docs/CONTENT-MODEL.md § Blog body grammar; contract `blog.v1`,
 * which Operations validates on save): what the importer writes for the LOCAL article (W64) and
 * what the Operations editor writes.
 *
 * Blocks, separated by blank lines: `## ` h2, `### ` h3, a paragraph, a `- ` list, a `1. ` list,
 * a `> ` quote, the takeaways callout (`> **Title**`, a blank `>`, then `> - item` lines), the
 * leads cards (`**lead** — body` paragraphs), an image line `![alt](url)` and a video line
 * `!video[Title](key)` (W249: a key of the site's video registry, `src/content/videos.ts`).
 * Inline: `**bold**`, `*italic*`, `[text](url)` (https:, mailto: or site-relative `/…`), and `\`
 * escaping `*`, `[` or `]`. Nothing else is markup: there is no HTML pass-through, so there is
 * nothing to sanitise — `ArticleBody` emits React nodes, never a string. A link to any other
 * scheme renders its text only; an image from anywhere but the Operations media route or the site
 * itself is dropped; a malformed video line (no title, a key that is not lower-case words and
 * hyphens, anything else on its line) is a paragraph. Pure: no React, no DOM.
 */
export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; children: Inline[] }
  | { kind: 'em'; children: Inline[] }
  | { kind: 'link'; href: string; external: boolean; children: Inline[] };
export type Heading = { id: string; text: string };
export type Block =
  | { kind: 'p'; inlines: Inline[] }
  | { kind: 'h2'; id: string; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'ul'; items: Inline[][] }
  | { kind: 'ol'; items: Inline[][] }
  | { kind: 'leads'; items: { lead: string; body: Inline[] }[] }
  | { kind: 'callout'; title: string; items: Inline[][] }
  | { kind: 'quote'; inlines: Inline[] }
  | { kind: 'image'; src: string; alt: string }
  /** W249: `key` is not checked here — the renderer looks it up and an unknown one shows nothing. */
  | { kind: 'video'; key: string; title: string };

// No `s` flag (ES2018; the tsconfig targets ES2017): `[\s\S]` spans the joined lines.
const LEAD = /^\*\*(.+?)\*\*\s+—\s+([\s\S]+)$/;
const UL = /^-\s+/;
const OL = /^\d+\.\s+/;
const CALLOUT_TITLE = /^\*\*(.+)\*\*$/;
/** A heading, an image line or a video line is always a block of its own, blank lines or not. */
const OWN_LINE = /^(#{2,3} .*|!(?:video)?\[[^\n]*\]\([^\s()]+\))$/gm;
const IMAGE_LINE = /^!\[((?:\\[\s\S]|[^\\\]])*)\]\(([^\s()]+)\)$/;
/** A video key (W249): lower-case ASCII words joined by single hyphens — a slug's shape. */
export const VIDEO_KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** `!video[Title](key)` alone on its line; the title (escapes allowed, like an image's alt) is
 *  required. */
const VIDEO_LINE = /^!video\[((?:\\[\s\S]|[^\\\]])+)\]\(([a-z0-9]+(?:-[a-z0-9]+)*)\)$/;
const DIACRITICS = /[̀-ͯ]/g; // combining marks left by NFKD (escaped, never literal)

// Sticky (`y`) so each is tried exactly at the scan position. An escape pair (`\x`) is consumed
// as a unit inside every span, so an escaped `*` or `]` never closes one.
const LINK = /\[((?:\\[\s\S]|[^\\\]])+)\]\(([^\s()]+)\)/y;
const STRONG = /\*\*((?:\\[\s\S]|[^\\])+?)\*\*(?!\*)/y;
const EM = /\*((?:\\[\s\S]|\*\*(?:\\[\s\S]|[^\\*])+?\*\*|[^\\*])+)\*/y;
const ESCAPABLE = '*[]';
const MAX_DEPTH = 4;

/** `\*`, `\[`, `\]` → the literal character; any other backslash stays as typed. */
export function unescapeText(text: string): string {
  return text.replace(/\\([*[\]])/g, '$1');
}

/** A link target the site renders: `https:` (a new tab), `mailto:`, or one site-relative path
 *  (`/…`, never the protocol-relative `//host`). Anything else — `http:`, `javascript:`, a bare
 *  word — is not a link. */
export function safeHref(raw: string): string | null {
  if (raw.startsWith('/')) return raw.startsWith('//') ? null : raw;
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(raw)) return raw;
  if (!/^https:\/\//i.test(raw)) return null;
  try {
    return new URL(raw).protocol === 'https:' ? raw : null;
  } catch {
    return null;
  }
}

/** A span's inner text may not start or end with a space (`5 * 3 * 2` is not emphasis). */
const flanked = (inner: string) => inner.length > 0 && inner.trim() === inner;

function at(re: RegExp, src: string, i: number): RegExpExecArray | null {
  re.lastIndex = i;
  return re.exec(src);
}

export function parseInline(src: string, depth = 0, inLink = false): Inline[] {
  const out: Inline[] = [];
  let buf = '';
  const flush = () => {
    if (buf) out.push({ kind: 'text', text: buf });
    buf = '';
  };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\' && i + 1 < src.length && ESCAPABLE.includes(src[i + 1])) {
      buf += src[i + 1];
      i += 2;
      continue;
    }
    if (depth < MAX_DEPTH) {
      const link = c === '[' && !inLink ? at(LINK, src, i) : null;
      if (link) {
        const children = parseInline(link[1], depth + 1, true);
        const href = safeHref(link[2]);
        flush();
        if (href) out.push({ kind: 'link', href, external: /^https:/i.test(href), children });
        else out.push(...children);
        i += link[0].length;
        continue;
      }
      const strong = c === '*' && src[i + 1] === '*' ? at(STRONG, src, i) : null;
      if (strong && flanked(strong[1])) {
        flush();
        out.push({ kind: 'strong', children: parseInline(strong[1], depth + 1, inLink) });
        i += strong[0].length;
        continue;
      }
      const em = c === '*' ? at(EM, src, i) : null;
      if (em && flanked(em[1])) {
        flush();
        out.push({ kind: 'em', children: parseInline(em[1], depth + 1, inLink) });
        i += em[0].length;
        continue;
      }
    }
    buf += c;
    i += 1;
  }
  flush();
  if (out.length === 0) out.push({ kind: 'text', text: '' });
  return out;
}

/** The visible text of inline nodes, markup dropped. */
export function inlineText(inlines: readonly Inline[]): string {
  return inlines.map((n) => (n.kind === 'text' ? n.text : inlineText(n.children))).join('');
}

/** A heading, a callout title or a lead is plain text: markup inside it is dropped, escapes
 *  resolved. */
const plain = (text: string) => inlineText(parseInline(text));

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
      title: plain(title[1]),
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
    .replace(OWN_LINE, '\n$1\n')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((line) => line.trim());
    const single = lines.length === 1 ? lines[0] : null;
    const image = single ? IMAGE_LINE.exec(single) : null;
    const video = single ? VIDEO_LINE.exec(single) : null;
    const videoTitle = video ? unescapeText(video[1]).trim() : '';
    if (single?.startsWith('## ')) {
      const text = plain(single.slice(3).trim());
      blocks.push({ kind: 'h2', id: headingId(text, used), text });
    } else if (single?.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: plain(single.slice(4).trim()) });
    } else if (image) {
      // An image from anywhere else is dropped, never fetched (the contract: only the module's
      // own media, docs/CONTENT-MODEL.md).
      if (isBlogImageSrc(image[2]))
        blocks.push({ kind: 'image', src: image[2], alt: unescapeText(image[1]) });
    } else if (video && videoTitle) {
      // W249: a video of the site's registry; a blank title falls through to a paragraph.
      blocks.push({ kind: 'video', key: video[2], title: videoTitle });
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
        const item = { lead: plain(lead[1]), body: parseInline(lead[2]) };
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
