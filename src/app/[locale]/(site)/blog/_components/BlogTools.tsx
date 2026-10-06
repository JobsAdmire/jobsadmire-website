'use client';
import NextLink from 'next/link';
import { useState, type KeyboardEvent } from 'react';
import { BottomSheet } from '@/design/islands/BottomSheet';
import { RadioChips } from '@/design/primitives/RadioChips';
import { ALL, resultLine, type ResultLineForms } from '../_lib/filter';
import { useIndexState } from './IndexState';

/** A topic as the tools show it: the chip / sheet row label and the sheet row's dot class
 *  (`CATEGORY_FACE[…].dot`, `ALL_DOT` for "all"). The first option is "all" (blog.076). */
export type TopicOption = { value: string; label: string; dot: string };

/** The hero's EN / TR pair: links to the two locales' indexes (`/en/blog`, `/blog`). */
export type LangLink = { code: string; href: string; hrefLang: string; current: boolean };

/** Every label resolved on the server (package ids + `sys.blog.tools.*` read raw — W148). */
export type BlogToolsLabels = {
  search: string; // sys.blog.tools.search — the field's visually hidden label
  placeholder: string; // blog.088
  clear: string; // blog.033
  topic: string; // blog.086
  pickTopic: string; // blog.087
  close: string; // blog.075
  language: string; // blog.018 — the EN/TR group's name
  results: ResultLineForms;
};

const TOOLS =
  'mt-7.5 flex flex-wrap items-center gap-3 rounded-base border border-white/15 bg-white px-3.5 py-3 text-ink shadow-[0_26px_60px_rgba(3,10,26,0.42)] xl:shadow-[0_19.5px_45px_rgba(3,10,26,0.42)] max-md:mt-[22px] max-md:gap-2.5 max-md:rounded-lg max-md:p-3 max-md:shadow-[0_26px_60px_rgba(3,10,26,0.42),inset_0_1px_0_rgba(255,255,255,0.8)]';
const SEARCH =
  'flex min-w-57.5 flex-1 items-center gap-2.5 rounded-[11px] bg-pale-1 px-4 py-2.75 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-blue-safe max-md:min-h-14 max-md:min-w-0 max-md:basis-full max-md:gap-[11px] max-md:rounded-base max-md:border-[1.5px] max-md:border-border-1 max-md:bg-white max-md:py-2 max-md:pr-2.5 max-md:pl-2 max-md:shadow-[0_8px_22px_rgba(22,60,90,0.10)] max-md:has-[input:focus-visible]:border-blue';
/** desktop: the bare grey glyph; phones: the 40 px gradient tile with a white glyph */
const SICON =
  'inline-flex shrink-0 text-muted max-md:h-10 max-md:w-10 max-md:items-center max-md:justify-center max-md:rounded-xs max-md:bg-[linear-gradient(135deg,#1899d5,#146fa1)] max-md:text-white max-md:shadow-[0_6px_14px_rgba(24,153,213,0.35)]';
const INPUT =
  'min-w-0 flex-1 border-0 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-text-tertiary xl:text-[11px] [&::-webkit-search-cancel-button]:hidden max-md:min-h-10 max-md:text-[16px] max-md:font-semibold';
/** the design shows the clear button on phones only (`.ja-blog-clear`); Escape clears anywhere */
const CLEAR =
  'hidden flex-none items-center justify-center rounded-pill bg-tint font-extrabold text-blue-safe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:inline-flex max-md:h-[34px] max-md:w-[34px] max-md:text-[15px]';
const TOPIC =
  'hidden cursor-pointer items-center justify-between gap-3 rounded-sm border-[1.5px] border-border-1 bg-pale-1 px-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe max-md:flex max-md:min-h-[52px] max-md:w-full';
const LANG =
  'inline-flex shrink-0 overflow-hidden rounded-pill border-[1.5px] border-edge bg-white max-md:hidden';
const LANG_LINK =
  'inline-flex min-h-[44px] items-center px-4.5 text-[13px] font-extrabold no-underline xl:text-[11px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-safe';
const ROW =
  'mb-1.5 flex min-h-[54px] w-full cursor-pointer items-center justify-between gap-3 rounded-xs border-[1.5px] px-3.25 py-2.5 text-left has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe';

function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="h-4 w-4 max-md:h-[18px] max-md:w-[18px]"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/**
 * The design's tools card inside the dark hero (Blog.dc.html 558–588; phones 315–323, 379–383):
 * the search field, the topic chips and the EN/TR pair from 701 px; on phones the search card
 * with its gradient glyph tile, and a topic button that opens the bottom sheet (831–853: a dot,
 * the label, the count and a tick per topic) — chips and EN/TR hidden. Filtering is client-side
 * over the server-rendered grid (`IndexState` + `LoadMore`), the featured card included (it is
 * the grid's first since W250). One polite status line announces the result count at every width
 * (the visible count line is the phone-only `ResultLine`).
 */
export function BlogTools({
  labels,
  topics,
  langs,
}: {
  labels: BlogToolsLabels;
  topics: TopicOption[];
  langs: LangLink[];
}) {
  const s = useIndexState();
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = topics.find((o) => o.value === s.category) ?? topics[0];
  const line = resultLine({
    shown: s.countFor(s.category),
    total: s.total,
    query: s.query,
    topic: s.category === ALL ? null : active.label,
    forms: labels.results,
  });
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && s.query) {
      e.preventDefault();
      s.setQuery('');
    }
  };

  return (
    <div data-testid="blog-tools" className={TOOLS}>
      <div className={SEARCH}>
        <span aria-hidden="true" className={SICON}>
          <SearchGlyph />
        </span>
        <label htmlFor="blog-search" className="sr-only">
          {labels.search}
        </label>
        <input
          id="blog-search"
          type="search"
          value={s.query}
          onChange={(e) => s.setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={labels.placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className={INPUT}
        />
        {s.query ? (
          <button
            type="button"
            onClick={() => s.setQuery('')}
            aria-label={labels.clear}
            className={CLEAR}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
      <button
        type="button"
        data-testid="blog-topic-button"
        aria-haspopup="dialog"
        onClick={() => setSheetOpen(true)}
        className={TOPIC}
      >
        <span className="flex min-w-0 flex-col gap-px">
          <span className="font-extrabold text-text-tertiary uppercase max-md:text-[10.5px] max-md:tracking-[0.9px]">
            {labels.topic}
          </span>
          <span className="truncate font-extrabold text-ink max-md:text-[15.5px]">
            {active.label}
          </span>
        </span>
        <span className="flex flex-none items-center gap-2">
          <span className="rounded-pill bg-tint px-2.5 py-1 font-extrabold text-blue-safe max-md:text-[12.5px]">
            {s.countFor(s.category)}
          </span>
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] bg-tint font-extrabold text-blue-safe max-md:text-[12px]"
          >
            ▼
          </span>
        </span>
      </button>
      <div className="max-md:hidden">
        <RadioChips
          name="blog-topic"
          options={topics}
          value={s.category}
          onChange={s.setCategory}
          legend={labels.topic}
          legendHidden
          face="solid"
        />
      </div>
      <div role="group" aria-label={labels.language} className={LANG}>
        {langs.map((l) => (
          <NextLink
            key={l.code}
            href={l.href}
            hrefLang={l.hrefLang}
            lang={l.hrefLang}
            prefetch={false}
            aria-current={l.current ? 'page' : undefined}
            className={`${LANG_LINK} ${l.current ? 'bg-blue-safe text-white' : 'bg-white text-text-secondary hover:bg-pale-1'}`}
          >
            {l.code}
          </NextLink>
        ))}
      </div>
      <p role="status" data-testid="blog-tools-status" className="sr-only">
        {line}
      </p>
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={labels.pickTopic}
        closeLabel={labels.close}
      >
        <fieldset role="radiogroup" aria-label={labels.topic} className="m-0 min-w-0 border-0 p-0">
          {topics.map((o) => {
            const on = o.value === s.category;
            return (
              <label
                key={o.value}
                className={`${ROW} ${on ? 'border-blue bg-[#f2fafe]' : 'border-border-3 bg-white'}`}
              >
                <input
                  type="radio"
                  name="blog-topic-sheet"
                  value={o.value}
                  checked={on}
                  onChange={() => {
                    s.setCategory(o.value);
                    setSheetOpen(false);
                  }}
                  onClick={() => {
                    if (on) setSheetOpen(false);
                  }}
                  className="sr-only"
                />
                <span className="flex min-w-0 items-center gap-2.75">
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 flex-none rounded-pill ${o.dot}`}
                  />
                  <span className="truncate text-[15.5px] font-extrabold text-ink xl:text-[11.625px]">
                    {o.label}
                  </span>
                </span>
                <span className="flex flex-none items-center gap-2.25">
                  <span className="text-[13px] font-extrabold text-text-tertiary xl:text-[11px]">
                    {s.countFor(o.value)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-3.5 text-right text-[14px] font-extrabold text-blue-safe xl:text-[11px]"
                  >
                    {on ? '✓' : ''}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
      </BottomSheet>
    </div>
  );
}
