'use client';
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export type AccordionItem = { id: string; title: string; body: ReactNode };

/** `list`: hairline-divided rows with a bare +/− (the original face). `cards` (SHARED 6.1): one
 *  white card per question — #e6eef4 edge, r14, 12 px apart (9 px on phones), 20/24 padding, a
 *  58 px minimum row, the question 16 px/800, the tint edge + a soft shadow on hover, the answer
 *  15 px/600 in the secondary grey. `footer` (SHARED 3.8): the dark footer's phone accordion —
 *  uppercase 800 headings, a rotating ⌄, white/12 rules. */
export type AccordionVariant = 'list' | 'cards' | 'footer';

/** The toggle glyph. `plus`: the design's 26 px pale-tint circle with a blue + that turns into
 *  a − (calc, avail, permit, partner, contact, hire); `chevron`: the blue ⌄ that rotates 180°
 *  (Home, Verify on phones, Article); `chevron-muted`: the grey ⌄ (Join Our Team). */
export type AccordionToggle = 'plus' | 'chevron' | 'chevron-muted';

const LIST: Record<AccordionVariant, string> = {
  list: 'divide-y divide-border-1',
  cards: 'flex flex-col gap-3 max-md:gap-[9px]',
  footer: 'flex flex-col',
};

const ITEM: Record<AccordionVariant, string> = {
  list: '',
  cards:
    'overflow-hidden rounded-sm border border-border-4 bg-white transition-[border-color,box-shadow] duration-200 hover:border-tint-border hover:shadow-[0_8px_22px_rgba(22,60,90,0.07)]',
  footer: 'border-b border-white/10',
};

const TRIGGER: Record<AccordionVariant, string> = {
  list: 'flex min-h-[46px] w-full items-center justify-between gap-4 py-3 text-left font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe',
  cards:
    'flex min-h-[58px] w-full items-center justify-between gap-4 px-6 py-5 text-left text-[16px] leading-[1.4] font-extrabold text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-safe max-md:px-[18px] max-md:py-4 max-md:text-[15px] xl:px-[18px] xl:py-[15px] xl:text-[12px]',
  footer:
    'flex min-h-[48px] w-full items-center justify-between gap-4 py-[15px] text-left text-[14px] font-extrabold tracking-[0.6px] text-white/90 uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky',
};

const PANEL: Record<AccordionVariant, string> = {
  list: 'pb-4 text-text-secondary',
  cards:
    'px-6 pb-5 text-[15px] leading-[1.65] font-semibold text-text-secondary max-md:px-[18px] max-md:pb-4 max-md:text-[14.5px] xl:px-[18px] xl:pb-[15px] xl:text-[11.25px]',
  footer: 'pt-3.5 pb-1',
};

function Toggle({
  open,
  toggle,
  variant,
}: {
  open: boolean;
  toggle: AccordionToggle | undefined;
  variant: AccordionVariant;
}) {
  if (toggle === 'plus')
    return (
      <span
        aria-hidden="true"
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-pill bg-tint text-[15px] font-extrabold text-blue-safe xl:h-[20px] xl:w-[20px] xl:text-[12px]"
      >
        {open ? '−' : '+'}
      </span>
    );
  if (toggle === 'chevron' || toggle === 'chevron-muted' || variant === 'footer')
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={variant === 'footer' ? 2.4 : 2.6}
        strokeLinecap="round"
        className={[
          'shrink-0 transition-transform duration-200',
          open ? 'rotate-180' : '',
          variant === 'footer'
            ? 'text-white/90'
            : toggle === 'chevron-muted'
              ? 'text-text-tertiary'
              : 'text-blue',
        ].join(' ')}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  return <span aria-hidden="true">{open ? '−' : '+'}</span>;
}

export function Accordion({
  items,
  singleOpen = true,
  defaultOpenId,
  headingLevel = 3,
  panelClassName,
  variant = 'list',
  toggle,
  className,
  itemClassName,
}: {
  items: AccordionItem[];
  singleOpen?: boolean;
  defaultOpenId?: string;
  /** The level each trigger's heading sits at. The WAI-ARIA pattern requires it to match the
   *  surrounding document outline: a panel that stands in for an `h2` column (the footer on
   *  mobile) must not drop to `h3`, or the visible heading order skips a level. */
  headingLevel?: 2 | 3 | 4;
  /** Extra classes on every panel — the design's open animation (`ja-panel` / `ja-panel-soft`,
   *  src/design/motion/motion.css), which replays each time a panel leaves `hidden`. */
  panelClassName?: string;
  variant?: AccordionVariant;
  /** the toggle glyph; defaults to the bare +/− (`list`), `plus` (`cards`), ⌄ (`footer`) */
  toggle?: AccordionToggle;
  /** extra classes on the list (a page's gap or border override) */
  className?: string;
  /** extra classes on every item wrapper (FaqBlock's `mobileGrouped` fold) */
  itemClassName?: string;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(defaultOpenId ? [defaultOpenId] : []),
  );
  const glyph = toggle ?? (variant === 'cards' ? 'plus' : undefined);
  // R21: a header always toggles its own panel — with `singleOpen` the others close,
  // without it an already-open panel must still be closable.
  const flip = (id: string) =>
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
    <div
      ref={listRef}
      data-variant={variant}
      className={[LIST[variant], className].filter(Boolean).join(' ')}
    >
      {items.map((it) => {
        const isOpen = open.has(it.id);
        const btnId = `${base}-${it.id}-btn`;
        const panelId = `${base}-${it.id}-panel`;
        return (
          <div
            key={it.id}
            className={[ITEM[variant], itemClassName].filter(Boolean).join(' ') || undefined}
          >
            <Heading className="m-0">
              <button
                id={btnId}
                type="button"
                data-accordion-trigger=""
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => flip(it.id)}
                onKeyDown={onKeyDown}
                className={TRIGGER[variant]}
              >
                <span>{it.title}</span>
                <Toggle open={isOpen} toggle={glyph} variant={variant} />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className={[PANEL[variant], panelClassName].filter(Boolean).join(' ')}
            >
              {it.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
