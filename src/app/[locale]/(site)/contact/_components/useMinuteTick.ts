'use client';
import { useSyncExternalStore } from 'react';

// R18: the one clock every live pill and the visit chips on this page share — `null` on the server
// and while hydrating (the server snapshot), the current minute after it; React re-renders the
// readers when the minute changes. One interval for the whole page, started by the first
// subscriber and stopped — its snapshot dropped — by the last, so a later mount reads a fresh
// clock. The directive follows W130 (every hook module that uses a client-only React API is a
// client module).
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let snapshot: number | null = null;

const minuteNow = () => Math.floor(Date.now() / 60_000);

function tick() {
  const next = minuteNow();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  timer ??= setInterval(tick, 15_000);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    if (timer !== null) clearInterval(timer);
    timer = null;
    snapshot = null;
  };
}

function getSnapshot(): number {
  snapshot ??= minuteNow();
  return snapshot;
}

const getServerSnapshot = (): number | null => null;

/** Minutes since the epoch on the client, `null` on the server and during hydration. */
export function useMinuteTick(): number | null {
  return useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot);
}
