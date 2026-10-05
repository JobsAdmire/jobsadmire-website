'use client';
import { useEffect, useId, useState, useSyncExternalStore, type ReactNode } from 'react';

const PHONE = '(max-width: 700px)';
const noSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;
const hasMatchMedia = () => typeof window.matchMedia === 'function';
function subscribePhone(onChange: () => void) {
  if (!hasMatchMedia()) return () => {};
  const mq = window.matchMedia(PHONE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const isPhone = () => hasMatchMedia() && window.matchMedia(PHONE).matches;

/**
 * One article h2 section (Blog Article CSS 322–326, script 1076–1086). From 701 px it is just the
 * heading and its blocks. At ≤ 700 px — once hydrated, so a reader without JS still gets the whole
 * text — the section collapses behind its heading: a hairline above, the 18.5 px heading with the
 * 30 px "+" / "−" tile, and a tap on a TOC link (or a `#id` in the URL) opens the section it
 * points at. The tile is decorative; the heading becomes a real `<button aria-expanded>` on
 * phones only, so desktop keyboards never tab through a control that does nothing.
 */
export function CollapsibleSection({
  id,
  title,
  headingClassName,
  children,
}: {
  id: string;
  title: string;
  headingClassName: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const armed = useSyncExternalStore(noSubscribe, onClient, onServer);
  const phone = useSyncExternalStore(subscribePhone, isPhone, onServer);
  const panelId = useId();

  useEffect(() => {
    const openIfTarget = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (a && a.getAttribute('href') === `#${id}`) setOpen(true);
    };
    const frame = requestAnimationFrame(openIfTarget);
    window.addEventListener('hashchange', openIfTarget);
    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', openIfTarget);
      document.removeEventListener('click', onClick);
    };
  }, [id]);

  const tile = (
    <span
      aria-hidden="true"
      className="ml-auto hidden shrink-0 items-center justify-center rounded-[10px] bg-tint font-extrabold text-blue-deep max-md:flex max-md:h-[30px] max-md:w-[30px] max-md:text-[13px]"
    >
      {open ? '−' : '+'}
    </span>
  );
  return (
    <div
      data-testid="article-section"
      data-armed={armed ? '' : undefined}
      data-open={open ? '' : undefined}
      className="group/sec max-md:border-t max-md:border-[#eef3f7] max-md:[&[data-armed]:not([data-open])>*:not(h2)]:hidden"
    >
      <h2 id={id} className={headingClassName}>
        {phone ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="flex min-h-[44px] w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 py-4 text-left font-[inherit] text-[length:inherit] leading-[inherit] font-extrabold tracking-[inherit] text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe group-data-[open]/sec:pb-2.5"
          >
            <span>{title}</span>
            {tile}
          </button>
        ) : (
          <>
            {title}
            {tile}
          </>
        )}
      </h2>
      <div id={panelId} className="contents">
        {children}
      </div>
    </div>
  );
}
