'use client';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';
import { ALL, matchKeys, type FilterItem } from '../_lib/filter';

export type IndexStateValue = {
  locale: Locale;
  query: string;
  category: string;
  /** how many matching grid cards show (the design's `visibleCount`) */
  visible: number;
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  /** both filters back to "all" (the design's `resetFilters`) */
  reset: () => void;
  loadMore: () => void;
  /** the grid keys that match the query and the topic, in grid order */
  hits: string[];
  /** cards matching the query under `category` — the grid's plus the featured card's (the
   *  design's `countFor`, which the topic button and the sheet rows print) */
  countFor: (category: string) => number;
  /** every listed card: the grid and the featured one */
  total: number;
  filtered: boolean;
};

const Ctx = createContext<IndexStateValue | null>(null);

/**
 * The blog index's one client state (the design's `query` / `category` / `visibleCount`), shared
 * by the islands it wraps — the tools card in the hero, the phone result line and the grid's
 * "load more" — while everything between them stays server-rendered (`children`). A search or a
 * topic change shows the first page of matches again, as the design does. The grid itself is
 * static RSC output: `LoadMore` toggles its rows' `hidden` attribute.
 */
export function IndexState({
  locale,
  items,
  featured,
  pageSize,
  children,
}: {
  locale: Locale;
  /** the grid's rows (not the featured card) */
  items: FilterItem[];
  featured: FilterItem | null;
  pageSize: number;
  children: ReactNode;
}) {
  const [query, setQueryState] = useState('');
  const [category, setCategoryState] = useState<string>(ALL);
  const [visible, setVisible] = useState(pageSize);

  const value = useMemo<IndexStateValue>(() => {
    const countFor = (cat: string) =>
      matchKeys(items, query, cat, locale).length +
      (featured && matchKeys([featured], query, cat, locale).length > 0 ? 1 : 0);
    return {
      locale,
      query,
      category,
      visible,
      setQuery: (q) => {
        setQueryState(q);
        setVisible(pageSize);
      },
      setCategory: (c) => {
        setCategoryState(c);
        setVisible(pageSize);
      },
      reset: () => {
        setQueryState('');
        setCategoryState(ALL);
        setVisible(pageSize);
      },
      loadMore: () => setVisible((v) => v + pageSize),
      hits: matchKeys(items, query, category, locale),
      countFor,
      total: items.length + (featured ? 1 : 0),
      filtered: query.trim() !== '' || category !== ALL,
    };
  }, [locale, items, featured, pageSize, query, category, visible]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIndexState(): IndexStateValue {
  const value = useContext(Ctx);
  if (!value) throw new Error('useIndexState outside <IndexState>');
  return value;
}
