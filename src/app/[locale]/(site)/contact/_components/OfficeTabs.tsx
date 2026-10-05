'use client';
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';

export type OfficeTab = { id: string; label: string; card: ReactNode };

/** Contact's office switch (Contact Us l. 948–951, 539–543): ≤ 700 px an `Antalya | Karaçi`
 *  segmented tablist shows one card; from 701 px both cards show side by side and the tablist is
 *  gone. The cards are rendered once (a hidden twin would double every `office_card` link and
 *  live pill), so this is the design's two-button segmented face (white active, translucent idle) over the cards' own wrappers — `Tabs` itself
 *  hides inactive panels at every width and Tailwind's important utilities cannot beat the
 *  preflight `[hidden]` rule, so it cannot serve a "tabs on phones only" layout (shared request).
 *  `plane` is the divider column; `className` places the grid. */
export function OfficeTabs({
  tabs,
  plane,
  className,
}: {
  tabs: [OfficeTab, OfficeTab];
  plane: ReactNode;
  className?: string;
}) {
  const base = useId();
  const [active, setActive] = useState(tabs[0].id);
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(tabs[next].id);
    e.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  };
  return (
    <>
      <div role="tablist" data-variant="segmented" className="relative mb-3 flex gap-2 md:hidden">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              id={`${base}-${t.id}-tab`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${base}-${t.id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={onKeyDown}
              className={[
                'min-h-[46px] flex-1 rounded-xs border-[1.5px] px-3 text-body-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                on
                  ? 'border-white bg-white text-navy'
                  : 'border-white/25 bg-white/10 text-white/85 hover:bg-white/20',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className={className}>
        <div
          id={`${base}-${tabs[0].id}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-${tabs[0].id}-tab`}
          className={['flex min-w-0', active === tabs[0].id ? '' : 'max-md:hidden'].join(' ')}
        >
          {tabs[0].card}
        </div>
        {plane}
        <div
          id={`${base}-${tabs[1].id}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-${tabs[1].id}-tab`}
          className={['flex min-w-0', active === tabs[1].id ? '' : 'max-md:hidden'].join(' ')}
        >
          {tabs[1].card}
        </div>
      </div>
    </>
  );
}
