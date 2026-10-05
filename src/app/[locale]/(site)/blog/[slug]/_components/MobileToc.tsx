'use client';
import { useState } from 'react';
import type { TocHeading } from '@/design/islands/ScrollSpyToc';

/**
 * ≤ 700 px: the TOC as a disclosure above the body (B-12, DC 540–551) — a 30 px list-icon tile,
 * the label and "N sections · ≈ M min left", a "+" / "−"; a tap on an entry closes it (the
 * collapsed section it points at opens itself, `CollapsibleSection`). Native `<details>`, so it
 * works before hydration; the state only lets a link tap close it.
 */
export function MobileToc({
  headings,
  label,
  sub,
}: {
  headings: readonly TocHeading[];
  label: string;
  sub: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details
      data-testid="article-toc-mobile"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="overflow-hidden rounded-base border-[1.5px] border-[#dbe8f2] bg-white max-md:mb-[18px] max-md:shadow-[0_8px_22px_rgba(22,60,90,0.07)] md:hidden"
    >
      <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 max-md:h-[30px] max-md:w-[30px] items-center justify-center rounded-[10px] bg-tint text-blue-deep"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              focusable="false"
            >
              <path d="M4 6h16" />
              <path d="M4 12h11" />
              <path d="M4 18h7" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col gap-px">
            <span className="font-extrabold text-ink max-md:text-[14.5px]">{label}</span>
            <span className="font-bold text-text-tertiary max-md:text-[12px]">{sub}</span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 font-extrabold text-blue-deep max-md:text-[13px]"
        >
          {open ? '−' : '+'}
        </span>
      </summary>
      <nav aria-label={label}>
        {/* QA W221 BLOG-08: `list-none` strips the list semantics in Safari — explicit role */}
        <ul role="list" className="m-0 flex list-none flex-col px-2.5 pt-0.5 pb-2.5">
          {headings.map((h) => (
            <li key={h.id} className="border-t border-border-3">
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-[46px] items-center px-2 font-bold max-md:text-[14.5px] text-text-secondary no-underline"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
