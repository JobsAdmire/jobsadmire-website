'use client';
import { useId, useState, type ReactNode } from 'react';

/**
 * The red flags (M8, Verify ll. 853–874, 425–429, 455–461): every flag is server-rendered and in
 * the HTML at every width; ≤ 700 px the ones from `foldFrom` on fold behind a real disclosure
 * button (the design's `.ja-vr-more`, "Show 2 more red flags" / "Show fewer red flags" —
 * verify.231 / verify.230). The design's own rule hides only its fifth flag behind a label that
 * promises two; with the copy frozen, two flags fold here (4 and 5), so the label stays true.
 * From 701 px the list is whole and the button hidden.
 */
export function FlagList({
  items,
  foldFrom,
  moreLabel,
  lessLabel,
}: {
  items: { key: string; content: ReactNode }[];
  foldFrom: number;
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  return (
    <>
      <ul id={listId} className="m-0 list-none p-0">
        {items.map((item, i) => (
          <li
            key={item.key}
            className={`flex items-start gap-3 border-t border-[#fbe3e3] py-3.5 max-md:gap-[11px] max-md:py-3${i >= foldFrom && !open ? ' max-md:hidden' : ''}`}
          >
            {item.content}
          </li>
        ))}
      </ul>
      {items.length > foldFrom ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="mt-1 mb-3.5 flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] border-[1.5px] border-danger-border bg-danger-surface p-3 text-[13.5px] font-extrabold text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger md:hidden"
        >
          {open ? lessLabel : moreLabel}
        </button>
      ) : null}
    </>
  );
}
