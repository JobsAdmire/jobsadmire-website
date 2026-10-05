'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type TabItem = { id: string; label: string; panel: ReactNode };

/** SHARED 14.1. `pills` (default): the tint pill per tab. `underline` (Calculator exemptions,
 *  Available Workers role switch): equal-width tabs on a #f7fbfd bar, the active one white with a
 *  3 px brand-blue underline and #1073a8 text. `segmented` (Contact Antalya | Karaçi, Join "Yer",
 *  Work Permit's phone route/timeline switch): a pale track with a white active chip. */
export type TabsVariant = 'pills' | 'underline' | 'segmented';

const TABLIST: Record<TabsVariant, string> = {
  pills: 'flex flex-wrap gap-2',
  underline:
    'grid auto-cols-fr grid-flow-col overflow-hidden rounded-t-sm border-b border-edge bg-pale-2',
  segmented:
    'grid auto-cols-fr grid-flow-col gap-1 rounded-sm border border-edge-soft bg-[#eef5fa] p-1',
};
const TAB_BASE =
  'min-h-[44px] text-body-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe';
const TAB: Record<TabsVariant, { on: string; off: string }> = {
  pills: {
    on: `${TAB_BASE} rounded-pill px-4 bg-tint text-blue-safe`,
    off: `${TAB_BASE} rounded-pill px-4 text-text-secondary hover:bg-pale-1`,
  },
  underline: {
    on: `${TAB_BASE} px-3 bg-white text-blue-safe shadow-[inset_0_-3px_0_var(--color-blue)]`,
    off: `${TAB_BASE} px-3 text-text-secondary hover:bg-white/60 hover:text-ink`,
  },
  segmented: {
    on: `${TAB_BASE} rounded-xs px-3 bg-white text-ink shadow-[0_2px_8px_rgba(22,60,90,0.1)]`,
    off: `${TAB_BASE} rounded-xs px-3 text-text-secondary hover:text-ink`,
  },
};

export function Tabs({
  tabs,
  defaultId,
  onChange,
  panelClassName,
  variant = 'pills',
  listClassName,
}: {
  tabs: TabItem[];
  defaultId: string;
  /** Fired after every selection change (click, arrows, Home/End) with the new tab id —
   *  for a page island that mirrors the tab in its own state (route tabs, calculator modes). */
  onChange?: (id: string) => void;
  /** Extra classes on every panel — the design's open animation (`ja-panel` / `ja-panel-soft`,
   *  src/design/motion/motion.css), which replays each time a panel leaves `hidden`. */
  panelClassName?: string;
  variant?: TabsVariant;
  /** extra classes on the tablist (a page's width or breakpoint) */
  listClassName?: string;
}) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(defaultId);
  // A `defaultId` matching no tab would leave every tab at tabIndex -1 with no panel open,
  // making the tablist unreachable by keyboard: fall back to the first tab.
  const active = tabs.some((t) => t.id === selected) ? selected : (tabs[0]?.id ?? '');

  const select = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

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
    select(tabs[next].id);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        data-variant={variant}
        className={[TABLIST[variant], listClassName].filter(Boolean).join(' ')}
      >
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
              onClick={() => select(t.id)}
              onKeyDown={onKeyDown}
              className={selected ? TAB[variant].on : TAB[variant].off}
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
          className={['pt-6', panelClassName].filter(Boolean).join(' ')}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
