'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type TabItem = { id: string; label: string; panel: ReactNode };

export function Tabs({ tabs, defaultId }: { tabs: TabItem[]; defaultId: string }) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(defaultId);

  // Roving tabindex: only the selected tab is in the tab order; arrows/Home/End move
  // selection and focus together (WAI-ARIA tabs pattern, automatic activation).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const current = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next < 0 || tabs.length === 0) return;
    e.preventDefault();
    setActive(tabs[next].id);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div>
      <div ref={listRef} role="tablist" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              id={`${base}-${t.id}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${base}-${t.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={onKeyDown}
              className={[
                'min-h-[44px] rounded-pill px-4 text-body-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe',
                selected ? 'bg-tint text-blue-safe' : 'text-text-secondary hover:bg-pale-1',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${base}-${t.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-${t.id}-tab`}
          hidden={t.id !== active}
          tabIndex={0}
          className="pt-6"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
