'use client';
import { useEffect, useState } from 'react';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { SearchInput } from '@/design/islands/SearchInput';
import { Button } from '@/design/primitives/Button';
import { RadioChips, type RadioChipOption } from '@/design/primitives/RadioChips';
import type { Locale } from '@/i18n/routing';
import { ALL, countLabel, matchKeys, type FilterItem } from '../_lib/filter';

/** Every label resolved on the server (package ids + `sys.blog.tools.*` read raw) — W148. */
export type PostFilterLabels = {
  search: string; // sys.blog.tools.search
  placeholder: string; // blog.088
  clear: string; // blog.033
  reset: string; // blog.089
  all: string; // blog.076
  topic: string; // blog.086
  pickTopic: string; // blog.087
  close: string; // blog.075
  noResults: string; // blog.035
  resultsOne: string; // sys.blog.tools.results.one
  resultsOther: string; // sys.blog.tools.results.other
};

export type PostFilterProps = {
  listId: string;
  locale: Locale;
  items: FilterItem[];
  categories: RadioChipOption[];
  labels: PostFilterLabels;
};

/**
 * B-5: the index tools bar — search, topic chips (a bottom sheet on phones), reset, the live
 * result count and the no-results panel — as a progressive enhancement over the server-rendered
 * card list: it toggles the `hidden` attribute of the list's `li[data-post-key]` rows. Those
 * rows are static RSC output that React never re-renders on the client, so writing the attribute
 * is safe; the match set is derived in render and the effect only writes the DOM (react-hooks 7:
 * no state set in an effect body). Mounted by the page only from `TOOLS_MIN_POSTS` non-featured
 * written articles — never in Phase A.
 */
export function PostFilter({ listId, locale, items, categories, labels }: PostFilterProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hits = matchKeys(items, query, category, locale);
  const signature = hits.join('|');

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const visible = new Set(signature ? signature.split('|') : []);
    for (const row of Array.from(list.querySelectorAll<HTMLElement>('[data-post-key]'))) {
      row.hidden = !visible.has(row.dataset.postKey ?? '');
    }
  }, [listId, signature]);

  const options: RadioChipOption[] = [{ value: ALL, label: labels.all }, ...categories];
  const filtered = query.trim() !== '' || category !== ALL;
  const reset = () => {
    setQuery('');
    setCategory(ALL);
  };

  return (
    <div
      data-testid="blog-tools"
      className="flex flex-col gap-3 rounded-base border border-border-1 bg-white p-3 shadow-social"
    >
      <div className="flex flex-wrap items-start gap-3">
        <SearchInput
          id="blog-search"
          label={labels.search}
          hideLabel
          value={query}
          onChange={setQuery}
          placeholder={labels.placeholder}
          clearLabel={labels.clear}
          resultText={countLabel(hits.length, {
            one: labels.resultsOne,
            other: labels.resultsOther,
          })}
          className="min-w-[230px] flex-1"
        />
        <div className="md:hidden">
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            {labels.topic}
          </Button>
        </div>
        <div className="max-md:hidden">
          <RadioChips
            name="blog-topic"
            options={options}
            value={category}
            onChange={setCategory}
            legend={labels.topic}
            legendHidden
          />
        </div>
        {filtered ? (
          <Button variant="ghost" onClick={reset}>
            {labels.reset}
          </Button>
        ) : null}
      </div>
      {hits.length === 0 ? (
        <p
          role="status"
          data-testid="blog-no-results"
          className="text-body-sm m-0 rounded-base border border-dashed border-border-1 p-4 text-text-secondary"
        >
          {labels.noResults}
        </p>
      ) : null}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={labels.pickTopic}
        closeLabel={labels.close}
      >
        <RadioChips
          name="blog-topic-sheet"
          options={options}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setSheetOpen(false);
          }}
          legend={labels.topic}
          legendHidden
        />
      </BottomSheet>
    </div>
  );
}
