import { useSyncExternalStore } from 'react';

type QuoteState = { open: boolean; requested: boolean };
const CLOSED: QuoteState = { open: false, requested: false };
let state: QuoteState = CLOSED;
const listeners = new Set<() => void>();
const set = (next: QuoteState) => {
  state = next;
  listeners.forEach((l) => l());
};

/** The sheet's chunk (the forms kernel + BottomSheet, W13 amended): fetched on the first
 *  hover/focus of any quote button, awaited by `QuoteSheetHost` on the first open. */
export const loadQuoteSheet = () => import('./QuoteSheet');
export function prefetchQuoteSheet(): void {
  loadQuoteSheet().catch(() => undefined); // the host reports a failed load
}
export function openQuote(): void {
  set({ open: true, requested: true });
}
export function closeQuote(): void {
  if (state.open) set({ open: false, requested: true });
}
/** Tests only. */
export function resetQuote(): void {
  set(CLOSED);
}
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const snapshot = () => state;
const serverSnapshot = () => CLOSED;
export function useQuoteState(): QuoteState {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
