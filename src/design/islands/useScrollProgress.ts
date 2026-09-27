'use client';
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}
function getSnapshot() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 1000) / 1000;
}
const onServer = () => 0;

/** 0…1 document scroll progress. 0 on the server and while hydrating (R18's pattern), so a
 *  progress bar or "min left" line never mismatches the server HTML. Rounded to 1/1000 so
 *  scroll events that do not move the value do not re-render. */
export function useScrollProgress(): number {
  return useSyncExternalStore(subscribe, getSnapshot, onServer);
}
