'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { LazyIsland } from '@/design/islands/LazyIsland';
import { CALC_ARM_EVENT } from '../_lib/events';
import type { CalculatorIslandProps } from './CalculatorIsland';

// A function prop cannot cross the server → client boundary, so the `load` thunk lives here; the
// type-only import keeps the island out of this eager chunk.
const load = () => import('./CalculatorIsland').then((m) => ({ default: m.CalculatorIsland }));

// Armed from outside the card: the page at #calculator (the header CTA, W17), a later hash change
// to it, or another island asking (CALC_ARM_EVENT — the salary guide's "Use in calculator"). A
// module latch read through useSyncExternalStore: the server snapshot is "not armed", so
// hydration always matches the skeleton (R18/R27 — no setState in an effect).
let armedElsewhere = false;
function subscribe(onChange: () => void): () => void {
  const onArm = () => {
    armedElsewhere = true;
    onChange();
  };
  const onHash = () => {
    if (window.location.hash === '#calculator') onArm();
  };
  window.addEventListener(CALC_ARM_EVENT, onArm);
  window.addEventListener('hashchange', onHash);
  return () => {
    window.removeEventListener(CALC_ARM_EVENT, onArm);
    window.removeEventListener('hashchange', onHash);
  };
}
const snapshot = () => armedElsewhere || window.location.hash === '#calculator';
const serverSnapshot = () => false;
/** Tests only. */
export function resetCalculatorArm(): void {
  armedElsewhere = false;
}

type Props = Omit<CalculatorIslandProps, 'focusOnMount'> & { fallback: ReactNode };

/**
 * W13 amended: the card sits in the first viewport, so a viewport trigger would fetch the island
 * during the Lighthouse load. This wrapper renders the server skeleton until the first
 * hover/touch/focus inside the card (or an outside arming), then hands over to the foundation's
 * `LazyIsland` — in view by then, so the island's chunk loads at once (W85/W132: no page-local
 * lazy helper; this only decides WHEN `LazyIsland` exists).
 */
export function CalculatorLoader({ fallback, ...props }: Props) {
  const external = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [touched, setTouched] = useState<'pointer' | 'keyboard' | null>(null);
  const armed = external || touched !== null;
  const arm = (how: 'pointer' | 'keyboard') => () => setTouched((t) => t ?? how);
  return (
    <div
      data-testid="calc-card"
      data-island={armed ? 'armed' : 'idle'}
      onPointerEnter={armed ? undefined : arm('pointer')}
      onPointerDown={armed ? undefined : arm('pointer')}
      onFocusCapture={armed ? undefined : arm('keyboard')}
    >
      {armed ? (
        <LazyIsland<CalculatorIslandProps>
          load={load}
          props={{ ...props, focusOnMount: touched === 'keyboard' }}
          fallback={fallback}
          rootMargin="0px"
        />
      ) : (
        fallback
      )}
    </div>
  );
}
