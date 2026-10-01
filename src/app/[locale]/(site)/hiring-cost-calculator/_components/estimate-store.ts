import { useSyncExternalStore } from 'react';
import { DEFAULT_INPUTS, sanitizeInputs, type EstimateInputs } from '../_lib/estimate-inputs';

/**
 * The page's one piece of shared client state: the calculator writes it; the quota gate, the
 * pass check, the salary guide, the recap, `LiveSgkRate` and the quote form's hidden inputs read
 * it. Module-level on purpose — every island mounts on its own trigger (W13 amended), so no React
 * context can span them. No directive: only `'use client'` modules import this (a server
 * component importing `useSyncExternalStore` fails `next build`). The server snapshot is the
 * defaults — exactly what the server fallbacks render — so hydration never mismatches (R18/R27).
 */
let state: EstimateInputs = DEFAULT_INPUTS;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function getEstimateInputs(): EstimateInputs {
  return state;
}
export function setEstimateInputs(patch: Partial<EstimateInputs>): void {
  state = sanitizeInputs({ ...state, ...patch });
  notify();
}
/** Tests only. */
export function resetEstimateInputs(): void {
  state = DEFAULT_INPUTS;
  notify();
}
export function subscribeEstimate(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const serverSnapshot = () => DEFAULT_INPUTS;
export function useEstimateInputs(): EstimateInputs {
  return useSyncExternalStore(subscribeEstimate, getEstimateInputs, serverSnapshot);
}
