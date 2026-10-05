import type { Locale } from '@/i18n/routing';

/** The grid the index tools island filters (B-5) — the server list renders it, the client island
 *  toggles its rows. Kept here, in a module with no runtime imports, because the island imports it:
 *  anything the island reaches is bundled into the client graph (W147/W158). */
export const POST_LIST_ID = 'blog-grid';

/** The chip value that stands for every category (the design's "All", blog.076). */
export const ALL = 'all';

/** One grid row as the island sees it: the post key, its category and the lower-cased words a
 *  visitor can search (title, excerpt, category label — built on the server by `filterItems`). */
export type FilterItem = { key: string; category: string; text: string };

/** The keys of the rows that match a query (trimmed, lower-cased in the page's locale — TR folds
 *  İ/I correctly) and a category. */
export function matchKeys(
  items: readonly FilterItem[],
  query: string,
  category: string,
  locale: Locale,
): string[] {
  const q = query.trim().toLocaleLowerCase(locale);
  return items
    .filter(
      (it) => (category === ALL || it.category === category) && (q === '' || it.text.includes(q)),
    )
    .map((it) => it.key);
}

/** `{n}` templates (read with `sys.raw`, so next-intl never formats them — W148 keeps
 *  `sys.blog` off the client): the singular only for exactly one. */
export function countLabel(n: number, forms: { one: string; other: string }): string {
  return (n === 1 ? forms.one : forms.other).replace('{n}', String(n));
}

/** The labels the result line needs, resolved on the server (W148). */
export type ResultLineForms = {
  one: string; // sys.blog.tools.results.one — "{n} yazı" / "{n} article"
  other: string; // sys.blog.tools.results.other
  forQuote: string; // blog.085 — "“" / "for “"
};

/**
 * The design's result line (`resultLine`, Blog.dc.html ~1043): the count with the query
 * ("3 yazı “izin”" / "3 articles for “permit”"), else with the topic ("2 yazı · Mevzuat"), else
 * the index total ("22 articles"). Built from the catalogue's own pieces — no new copy.
 */
export function resultLine({
  shown,
  total,
  query,
  topic,
  forms,
}: {
  shown: number;
  total: number;
  query: string;
  /** the active topic's label, or null for "all" */
  topic: string | null;
  forms: ResultLineForms;
}): string {
  const q = query.trim();
  if (q) return `${countLabel(shown, forms)} ${forms.forQuote}${q}”`;
  if (topic) return `${countLabel(shown, forms)} · ${topic}`;
  return countLabel(total, forms);
}
