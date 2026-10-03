'use client';
import { useId, useState, type ReactNode } from 'react';

const TRIGGER =
  'flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-sm border-[1.5px] bg-white px-[15px] py-3.5 text-left md:hidden';
const TRIGGER_TONE = {
  closed: 'border-border-1',
  open: 'border-blue shadow-[0_8px_20px_rgba(22,60,90,0.09)]',
} as const;
const CHEVRON =
  'grid h-[34px] w-[34px] flex-none place-items-center rounded-[11px] border border-sky/30 bg-[linear-gradient(160deg,#253063_0%,#0e1a37_100%)] text-[13px] font-extrabold text-sky transition-transform';

/**
 * The design's ≤ 700 px per-section accordion (`.ja-cs` / `.ja-cstog`, CSS 292–308) — W10: the
 * body is hidden with a `max-md:` class, never removed, and from 701 px the trigger is gone and
 * the body always shows. The section's own h2 + subtitle live OUTSIDE this toggle
 * (`_sections/CalcSection.tsx`, `max-md:sr-only`), so the outline is the same at every width. The
 * server renders it closed and the first client render matches (no effect, no hydration
 * mismatch). The chevron is a text glyph (delta 9). The body stays a plain container: islands
 * inside it (`LazyIsland`) see no intersection while it is `display:none`, so a collapsed
 * section loads nothing on phones.
 */
export function SectionToggle({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
        className={`${TRIGGER} ${open ? TRIGGER_TONE.open : TRIGGER_TONE.closed}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold leading-[1.25] text-ink">{title}</span>
          <span className="mt-[3px] block text-[12px] font-semibold leading-[1.4] text-text-tertiary">
            {subtitle}
          </span>
        </span>
        <span aria-hidden="true" className={open ? `${CHEVRON} rotate-180` : CHEVRON}>
          ▾
        </span>
      </button>
      <div
        id={bodyId}
        data-testid="section-body"
        data-open={open ? 'true' : 'false'}
        className={open ? 'max-md:pt-4' : 'max-md:hidden'}
      >
        {children}
      </div>
    </>
  );
}
