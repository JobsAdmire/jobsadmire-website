'use client';
import Image from 'next/image';
import { useCallback, useId, useSyncExternalStore, type FormEvent } from 'react';
import { BRAND } from '@/design/assets/brand';
import { rootZoom } from '@/design/zoom';
import { revealResult, useLookup } from './LookupContext';

/** The design's threshold (Verify l. 1266: `scrollY > 620`), in CSS px. */
export const STICKY_SEARCH_AFTER_PX = 620;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}
const onServer = () => false;

const MARK_HEIGHT = 28;

/**
 * The design's sticky mini search (S0s.1, Verify ll. 555–561, 1453): past 620 px a navy bar
 * slides in with the mark, "Verify a representative" and a second input on the page's one
 * lookup query (`LookupProvider` — what is typed here is what the hero card and the answer card
 * show; Enter brings the answer into view). Desktop only (hidden ≤ 700, l. 262). Two deliberate
 * deltas: the input has a visually hidden label (D20 — the design's has none), and the bar sits
 * UNDER the sticky header (`top: --header-h`, sliding out from behind it) instead of over it, so
 * the site navigation stays reachable and keyboard focus is never hidden under it; while it shows
 * it carries `data-sticky-subnav`, so the focus guard (W232) and the sticky columns
 * (`--sticky-top`) clear it as they clear the work-permit jump nav. The design's live count
 * ("18 people authorised today") is withheld by the owner's ruling: no register rows.
 */
export function StickySearch({
  label,
  inputLabel,
  placeholder,
}: {
  /** verify.020 */
  label: string;
  /** verify.032 — the input's (visually hidden) label */
  inputLabel: string;
  /** "Check an ID — JA-REP-014" */
  placeholder: string;
}) {
  const inputId = useId();
  const { raw, setTyped, clear } = useLookup();
  // R18: scroll position is a browser fact, read after hydration only.
  const visible = useSyncExternalStore(
    subscribeToScroll,
    useCallback(() => window.scrollY > STICKY_SEARCH_AFTER_PX * rootZoom(), []),
    onServer,
  );
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    revealResult();
  };
  return (
    <div
      data-testid="verify-sticky-search"
      data-sticky-subnav={visible ? '' : undefined}
      inert={!visible}
      aria-hidden={visible ? undefined : true}
      className={`fixed inset-x-0 top-(--header-h) z-30 bg-navy/[0.97] shadow-[0_10px_30px_rgba(3,10,26,0.35)] backdrop-blur-[8px] transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none max-md:hidden ${visible ? 'visible translate-y-0' : 'invisible -translate-y-[110%]'}`}
    >
      <form
        role="search"
        onSubmit={onSubmit}
        className="container-site flex items-center gap-3.5 py-2.5"
      >
        <Image
          src={BRAND.mark.src}
          alt=""
          width={Math.round((MARK_HEIGHT * BRAND.mark.width) / BRAND.mark.height)}
          height={MARK_HEIGHT}
          className="block h-7 w-auto shrink-0 xl:h-[21px]"
        />
        <span className="text-[13px] font-extrabold whitespace-nowrap text-white xl:text-[11px]">
          {label}
        </span>
        <label htmlFor={inputId} className="sr-only">
          {inputLabel}
        </label>
        <input
          id={inputId}
          type="search"
          value={raw}
          placeholder={placeholder}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') clear();
          }}
          autoComplete="off"
          spellCheck={false}
          className="min-h-[40px] w-full max-w-[420px] min-w-0 flex-1 rounded-[10px] border-[1.5px] border-white/25 bg-white px-3.5 text-[14px] font-bold text-ink placeholder:text-text-tertiary focus:border-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky xl:max-w-[315px] xl:text-[11px]"
        />
      </form>
    </div>
  );
}
