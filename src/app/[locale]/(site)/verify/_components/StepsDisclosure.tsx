'use client';
import { useId, useState, type ReactNode } from 'react';
import { ChevronIcon } from './icons';

/**
 * "Verify in one minute — 3 steps". The design folds the three cards behind a non-focusable
 * `div onClick` at ≤ 700 px; this is the same fold as a real disclosure button (D20). The cards
 * are server-rendered children, so their copy is in the HTML at every width; from 701 px the
 * panel always shows (`md:grid`) and the toggle is hidden (`md:hidden`).
 */
export function StepsDisclosure({ heading, children }: { heading: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="mt-11 border-t border-white/15 pt-8">
      <h2 className="m-0 flex items-center gap-2.5 text-eyebrow font-extrabold uppercase tracking-[1.4px] text-sky">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-blue" />
        <span className="max-md:hidden">{heading}</span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-[44px] items-center gap-2 text-left uppercase md:hidden"
        >
          {heading}
          <ChevronIcon className={open ? 'rotate-180' : undefined} />
        </button>
      </h2>
      <div id={panelId} className={`${open ? 'grid' : 'hidden'} mt-4 gap-4 md:grid md:grid-cols-3`}>
        {children}
      </div>
    </div>
  );
}
