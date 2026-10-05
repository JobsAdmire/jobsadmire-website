'use client';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
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
import { track } from '@/analytics/track';
import { LOOKUP_MIN_CHARS, normaliseQuery, readDeepLinkId } from '../_lib/lookup';

/** The one outcome Phase A can have (W6/W67): there is no published register to match. */
export const LOOKUP_OUTCOME = 'register_unavailable' as const;

/** Where the answer card sits — below the hero (the design's `#verify`, Verify l. 653). */
export const RESULT_ID = 'verify';

export type LookupState = {
  /** what the inputs show: the typed text, else the `?id=` deep link, else '' */
  raw: string;
  /** `raw`, trimmed and with its whitespace collapsed */
  query: string;
  /** a query long enough to answer (the design's `> 2`) */
  showResult: boolean;
  setTyped: (value: string) => void;
  clear: () => void;
};

/** Outside a provider (a section rendered on its own in a unit test) the inputs are inert. */
const INERT: LookupState = {
  raw: '',
  query: '',
  showResult: false,
  setTyped: () => {},
  clear: () => {},
};

const LookupCtx = createContext<LookupState>(INERT);

const subscribeNoop = () => () => {};
const readClientDeepLink = () => readDeepLinkId(window.location.search, window.location.hash);
const readServerDeepLink = () => null;

/**
 * The page's one lookup query, shared by the hero's input (`LookupCard`), the answer card below
 * the hero (`LookupResult`) and the sticky mini search (`StickySearch`) — the design keeps one
 * `query` state for all three (Verify ll. 559, 603, 653). V-1: the deep link is a browser fact
 * read after hydration (R18 — the server and the hydrating client both see null: no mismatch, no
 * setState in an effect); once the visitor types, `typed` wins, and Clear sets '' (not null) so
 * the URL's id does not come back. Nothing is stored or fetched; Operations is never called (D6).
 */
export function LookupProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  // R35: the real URL path, never next-intl's internal key.
  const page = usePathname() ?? '/';
  const deepLink = useSyncExternalStore(subscribeNoop, readClientDeepLink, readServerDeepLink);
  const [typed, setTyped] = useState<string | null>(null);
  const raw = typed ?? deepLink ?? '';
  const query = normaliseQuery(raw);
  const showResult = query.length >= LOOKUP_MIN_CHARS;

  // One event per query session: fires when the answer first appears, re-arms on clear.
  const fired = useRef(false);
  useEffect(() => {
    if (!showResult) {
      fired.current = false;
      return;
    }
    if (fired.current) return;
    fired.current = true;
    track('verify_lookup', { page, locale, outcome: LOOKUP_OUTCOME });
  }, [showResult, page, locale]);

  const value = useMemo<LookupState>(
    () => ({ raw, query, showResult, setTyped, clear: () => setTyped('') }),
    [raw, query, showResult],
  );
  return <LookupCtx.Provider value={value}>{children}</LookupCtx.Provider>;
}

export function useLookup(): LookupState {
  return useContext(LookupCtx);
}

/** Enter in either input brings the answer card into view: it sits below the hero, under the
 *  fold on a laptop screen. */
export function revealResult() {
  document.getElementById(RESULT_ID)?.scrollIntoView?.({ block: 'center' });
}
