'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type AccordionItem = { id: string; title: string; body: ReactNode };

export function Accordion({
  items,
  singleOpen = true,
  defaultOpenId,
  headingLevel = 3,
}: {
  items: AccordionItem[];
  singleOpen?: boolean;
  defaultOpenId?: string;
  /** The level each trigger's heading sits at. The WAI-ARIA pattern requires it to match the
   *  surrounding document outline: a panel that stands in for an `h2` column (the footer on
   *  mobile) must not drop to `h3`, or the visible heading order skips a level. */
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(defaultOpenId ? [defaultOpenId] : []),
  );
  // R21: a header always toggles its own panel — with `singleOpen` the others close,
  // without it an already-open panel must still be closable.
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
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
            <Heading className="m-0">
              <button
                id={btnId}
                type="button"
                data-accordion-trigger=""
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                onKeyDown={onKeyDown}
                className="flex min-h-[46px] w-full items-center justify-between gap-4 py-3 text-left font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
              >
                <span>{it.title}</span>
                <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </Heading>
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
