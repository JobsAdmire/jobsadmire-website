'use client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { RoleKey } from '../_lib/options';
import {
  filterPool,
  NO_FILTERS,
  PAGE_STEP,
  sortPool,
  type FilterKey,
  type PoolFilters,
  type PoolSort,
  type PoolWorker,
} from '../_lib/pool-view';

/** The design's phone step (`window.innerWidth <= 700`): six cards a page, the collapsed form. */
const PHONE_QUERY = '(max-width: 700px)';
const hasMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

function subscribePhone(onChange: () => void) {
  if (!hasMatchMedia()) return () => {};
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const phoneNow = () => hasMatchMedia() && window.matchMedia(PHONE_QUERY).matches;
const onServer = () => false;

/** How long the request card's green ring stays after a profile joins the basket (the design's
 *  `.ja-form-flash`, 0.8 s, cleared at 850 ms). */
export const FLASH_MS = 850;

/** Scrolls a section into view under its own `scroll-margin-top` — smooth unless the visitor
 *  asked for reduced motion (the design's `scrollTo({ behavior: 'smooth' })`). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = hasMatchMedia() && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export type PoolState = {
  /** null until the visitor picks a tab — the form then shows its echoed or default role */
  role: RoleKey | null;
  setRole: (role: RoleKey) => void;
  basket: string[];
  inBasket: (ref: string) => boolean;
  toggleRef: (ref: string) => void;
  removeRef: (ref: string) => void;
  clearBasket: () => void;
  filters: PoolFilters;
  setFilter: <K extends FilterKey>(key: K, value: PoolFilters[K]) => void;
  clearFilters: () => void;
  sort: PoolSort;
  setSort: (sort: PoolSort) => void;
  filtersOpen: boolean;
  toggleFilters: () => void;
  /** the mobile pool pill's "Filter": open the panel and jump to it */
  openFiltersJump: () => void;
  /** the mobile request card: collapsed to its CTA until opened (≤ 700 px) */
  formOpen: boolean;
  openForm: () => void;
  /** open the card and bring it into view (closing band, basket bar) */
  goToForm: () => void;
  /** a hero "popular" chip: filter by its industry and jump to the pool */
  pickIndustry: (key: string) => void;
  flash: boolean;
  phone: boolean;
  filtered: PoolWorker[];
  visible: PoolWorker[];
  remaining: number;
  loadMore: () => void;
};

const PoolCtx = createContext<PoolState | null>(null);

export function usePool(): PoolState {
  const value = useContext(PoolCtx);
  if (!value) throw new Error('usePool() outside <PoolProvider>');
  return value;
}

/**
 * The page's one piece of client state, shared by its islands — the hero chips, the request card,
 * the pool (tools, filters, cards, load-more), the phone pill and basket bar, the closing band's
 * phone button: the design's single component state (ll. 1092, 1256–1470). It wraps the page's
 * server sections as `children`, which stay server-rendered. Nothing here leaves the browser: no
 * network, no analytics (D13 — candidate refs never ride an event); the basket reaches the
 * Operations door only inside the visitor's own submit (`profileRefs`).
 */
export function PoolProvider({
  rows,
  locale,
  children,
}: {
  rows: PoolWorker[];
  locale: string;
  children: ReactNode;
}) {
  const [role, setRole] = useState<RoleKey | null>(null);
  const [basket, setBasket] = useState<string[]>([]);
  const [filters, setFilters] = useState<PoolFilters>(NO_FILTERS);
  const [sort, setSortState] = useState<PoolSort>('avail');
  const [pages, setPages] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phone = useSyncExternalStore(subscribePhone, phoneNow, onServer);

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  const value = useMemo<PoolState>(() => {
    const step = phone ? PAGE_STEP.phone : PAGE_STEP.desktop;
    const filtered = filterPool(rows, filters);
    const sorted = sortPool(filtered, sort, locale);
    const visible = sorted.slice(0, step * (pages + 1));
    const add = (ref: string) => {
      setBasket((b) => (b.includes(ref) ? b : [...b, ref]));
      setFormOpen(true);
      setFlash(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), FLASH_MS);
      // the design brings the card back when it has scrolled away above (desktop only, l. 1462)
      const card = document.getElementById('pool-form');
      if (!phoneNow() && card && card.getBoundingClientRect().bottom < 0) scrollToId('pool-form');
    };
    return {
      role,
      setRole,
      basket,
      inBasket: (ref) => basket.includes(ref),
      toggleRef: (ref) =>
        basket.includes(ref) ? setBasket((b) => b.filter((r) => r !== ref)) : add(ref),
      removeRef: (ref) => setBasket((b) => b.filter((r) => r !== ref)),
      clearBasket: () => setBasket([]),
      filters,
      setFilter: (key, v) => setFilters((f) => ({ ...f, [key]: v })),
      clearFilters: () => setFilters(NO_FILTERS),
      sort,
      setSort: (s) => {
        setSortState(s);
        setPages(0);
      },
      filtersOpen,
      toggleFilters: () => setFiltersOpen((o) => !o),
      openFiltersJump: () => {
        setFiltersOpen(true);
        scrollToId('pool-filters');
      },
      formOpen,
      openForm: () => setFormOpen(true),
      goToForm: () => {
        setFormOpen(true);
        scrollToId('pool-form');
      },
      pickIndustry: (key) => {
        setFilters((f) => ({ ...f, industry: key }));
        setPages(0);
        scrollToId('pool');
      },
      flash,
      phone,
      filtered,
      visible,
      remaining: sorted.length - visible.length,
      loadMore: () => setPages((p) => p + 1),
    };
  }, [rows, locale, role, basket, filters, sort, pages, filtersOpen, formOpen, flash, phone]);

  return <PoolCtx.Provider value={value}>{children}</PoolCtx.Provider>;
}
