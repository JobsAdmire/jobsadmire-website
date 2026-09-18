'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type AccordionItem = { id: string; title: string; body: ReactNode };

export function Accordion({
  items,
  singleOpen = true,
  defaultOpenId,
}: {
  items: AccordionItem[];
  singleOpen?: boolean;
  defaultOpenId?: string;
}) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(defaultOpenId ? [defaultOpenId] : []),
  );
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (!prev.has(id)) next.add(id);
      return next;
    });
  // WAI-ARIA accordion pattern: Home/End move focus to the first/last header button.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Home' && e.key !== 'End') return;
    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]') ?? [],
    );
    if (triggers.length === 0) return;
    e.preventDefault();
    (e.key === 'Home' ? triggers[0] : triggers[triggers.length - 1]).focus();
  };
  return (
    <div ref={listRef} className="divide-y divide-border-1">
      {items.map((it) => {
        const isOpen = open.has(it.id);
        const btnId = `${base}-${it.id}-btn`;
        const panelId = `${base}-${it.id}-panel`;
        return (
          <div key={it.id}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                data-accordion-trigger=""
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                onKeyDown={onKeyDown}
                className="flex min-h-[46px] w-full items-center justify-between gap-4 py-3 text-left font-extrabold"
              >
                <span>{it.title}</span>
                <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-4 text-text-secondary"
            >
              {it.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
