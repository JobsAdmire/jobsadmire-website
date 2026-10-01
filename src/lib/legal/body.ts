/**
 * Markdown-lite for the legal documents (D14, T13): blocks are separated by a blank line; a
 * block whose every line starts with `- ` is a bullet list, any other block one paragraph (its
 * lines joined by a space); `**text**` is a bold run. Nothing else — no links, no headings
 * (section titles are their own keys), no HTML — so a counsel edit can never inject markup.
 * The bodies arrive already formatted by next-intl (the ICU arguments filled, D17).
 */
export type LegalRun = { text: string; strong: boolean };
export type LegalBlock = { type: 'p'; runs: LegalRun[] } | { type: 'ul'; items: LegalRun[][] };

const BOLD = /\*\*(.+?)\*\*/g;

export function parseRuns(text: string): LegalRun[] {
  const runs: LegalRun[] = [];
  let last = 0;
  for (const match of text.matchAll(BOLD)) {
    const at = match.index ?? 0;
    if (at > last) runs.push({ text: text.slice(last, at), strong: false });
    runs.push({ text: match[1] ?? '', strong: true });
    last = at + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), strong: false });
  return runs.length > 0 ? runs : [{ text: '', strong: false }];
}

export function parseLegalBody(body: string): LegalBlock[] {
  return body
    .split(/\n[ \t]*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
    .map((lines): LegalBlock =>
      lines.every((line) => line.startsWith('- '))
        ? { type: 'ul', items: lines.map((line) => parseRuns(line.slice(2).trim())) }
        : { type: 'p', runs: parseRuns(lines.join(' ')) },
    );
}
