'use client';
import type { ReactNode } from 'react';
import { ArrowRightIcon } from '@/design/chrome/icons';
import type { RoleKey } from '../_lib/options';
import { usePool } from './PoolContext';

export type RequestHeadCopy = Record<RoleKey, { title: string; subtitle: string }>;

/** The phone CTA's copy (design `.ja-form-cta`, ll. 514–521): `{ready}` pill (sys, over the
 *  sample's ready count), 032, 033, 034 and 035. */
export type RequestCtaCopy = {
  ready: string;
  reply: string;
  noFee: string;
  start: string;
  browse: string;
};

const PILL =
  'inline-flex items-center gap-1.5 rounded-pill border px-[11px] py-[5px] text-[11.5px] font-extrabold';

/** The design's user-check glyph at the head band's right edge (l. 511). */
function UserCheckGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6.5 shrink-0 text-white/60"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M20 8l2 2-4.5 4.5L15 12" />
    </svg>
  );
}

function ArrowDownGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M12 5v13" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );
}

/**
 * The hero request card (design `#pool-form`, ll. 506–578): the gradient head band whose title and
 * subtitle follow the role tab, the phone-only collapsed CTA (≤ 700 px: three pills, "Start my
 * request", "Browse the pool"), and the form body (`children`: the `FormShell` and its footer row),
 * hidden on phones until the visitor opens it or adds a profile. Adding a profile rings the card
 * green for a moment (the design's `.ja-form-flash`, here a transition: no page keyframes).
 */
export function RequestCard({
  head,
  cta,
  children,
}: {
  head: RequestHeadCopy;
  cta: RequestCtaCopy;
  children: ReactNode;
}) {
  const { role, formOpen, openForm, flash } = usePool();
  const copy = head[role ?? 'direct_employer'];
  // the CTA button leaves with the collapsed state: focus moves to the selected role tab, the
  // first control of the form it opened, never to <body> (D20)
  const start = () => {
    openForm();
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>('#pool-form-body [role="tab"][aria-selected="true"]')
        ?.focus(),
    );
  };
  return (
    <div
      id="pool-form"
      data-open={formOpen ? 'true' : undefined}
      className={[
        'ja-card-in scroll-mt-20 overflow-hidden rounded-hero border bg-white text-ink transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none max-md:rounded-lg',
        flash
          ? 'border-success shadow-[0_0_0_4px_rgba(22,163,74,0.25),0_34px_80px_rgba(3,10,26,0.5)]'
          : 'border-white/10 shadow-hero-form max-md:shadow-[0_18px_44px_rgba(3,10,26,0.45)]',
      ].join(' ')}
    >
      {/* D20: `blue-safe` → `navy` with full-white copy — white on the design's #1899D5 is 3.2:1
          and the subtitle is small. */}
      <div
        data-testid="workers-form-head"
        className="flex items-center justify-between gap-3 bg-gradient-to-br from-blue-safe to-navy px-6 pt-4 pb-3.5 text-white max-md:px-4.5"
      >
        <div className="min-w-0">
          <h2 className="m-0 mb-[3px] text-[17.5px] font-extrabold tracking-[-0.3px] max-md:text-[17px] xl:mb-[2px] xl:text-[13.1px] xl:tracking-[-0.2px]">
            {copy.title}
          </h2>
          <p className="m-0 text-[12.5px] leading-[1.4] text-white xl:text-[11px]">
            {copy.subtitle}
          </p>
        </div>
        <UserCheckGlyph />
      </div>
      {formOpen ? null : (
        <div
          data-testid="workers-form-cta"
          className="flex flex-col gap-2.5 px-4 pt-3.5 pb-4.5 md:hidden"
        >
          <div className="mb-0.5 flex flex-wrap items-center gap-[7px]">
            <span
              className={`${PILL} border-success-soft-border bg-success-soft text-success-text`}
            >
              <span aria-hidden="true" className="ja-live size-[7px] rounded-pill bg-success" />
              {cta.ready}
            </span>
            <span className={`${PILL} border-edge bg-pale-1 text-text-secondary`}>{cta.reply}</span>
            <span className={`${PILL} border-edge bg-pale-1 text-text-secondary`}>{cta.noFee}</span>
          </div>
          <button
            type="button"
            onClick={start}
            aria-controls="pool-form-body"
            aria-expanded={false}
            className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-br from-ink to-night text-[16px] font-extrabold tracking-[-0.2px] text-white shadow-[0_10px_24px_rgba(10,20,40,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe active:scale-[0.98]"
          >
            {cta.start}
            <ArrowRightIcon size={17} className="text-sky" />
          </button>
          <a
            href="#pool"
            className="flex min-h-[50px] w-full items-center justify-center gap-[9px] rounded-[14px] border-[1.5px] border-tint-border bg-tint text-[15px] font-extrabold text-blue-safe no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe active:bg-tint-hover"
          >
            <ArrowDownGlyph />
            {cta.browse}
          </a>
        </div>
      )}
      <div id="pool-form-body" className={formOpen ? undefined : 'max-md:hidden'}>
        {children}
      </div>
    </div>
  );
}
