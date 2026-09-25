'use client';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { Button, type ButtonVariant } from '@/design/primitives';

export type StickyCta = {
  label: string;
  href: string;
  variant?: ButtonVariant;
  external?: boolean;
};

/** W18: the bar's rendered height, published on `<html>` while it is visible and `0px`
 *  otherwise, so `LanguageHint` and `WhatsAppFab` can add it to their bottom offset instead
 *  of sitting on top of the bar. Below `lg` the bar is `display:none`, so it publishes 0. */
export const STICKY_CTA_HEIGHT_VAR = '--sticky-cta-h';

/** The design's rule (Hire Workers): shown once the visitor has scrolled past `showAfterPx`,
 *  hidden again while the section it points at (`hideNearId`) has entered the lower tenth
 *  of the viewport or scrolled above it — the bar must never cover the form it advertises. */
export function isBarVisible(
  scrollY: number,
  showAfterPx: number,
  targetTop: number | null,
  viewportHeight: number,
) {
  if (scrollY <= showAfterPx) return false;
  if (targetTop === null) return true;
  return targetTop >= viewportHeight * 0.9;
}

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}
const onServer = () => false;

/** Mounted by pages, never by the layout: it repeats that page's own offer once the visitor
 *  has scrolled past it. Below `lg` the mobile bottom bar already occupies this space. */
export function StickyCtaBar({
  message,
  ctas,
  showAfterPx = 700,
  hideNearId,
  live = false,
}: {
  message: string;
  ctas: StickyCta[];
  showAfterPx?: number;
  /** id of the section the bar points at (e.g. `request-form`); hidden while it is near. */
  hideNearId?: string;
  /** The design's green "live" dot before the message. */
  live?: boolean;
}) {
  // R18's pattern: scroll position and the target's rect are browser facts, read after
  // hydration only; the server and the hydrating client both see "hidden".
  const visible = useSyncExternalStore(
    subscribeToViewport,
    useCallback(() => {
      const target = hideNearId ? document.getElementById(hideNearId) : null;
      return isBarVisible(
        window.scrollY,
        showAfterPx,
        target ? target.getBoundingClientRect().top : null,
        window.innerHeight,
      );
    }, [hideNearId, showAfterPx]),
    onServer,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const node = ref.current;
    if (!visible || !node) {
      root.style.setProperty(STICKY_CTA_HEIGHT_VAR, '0px');
      return;
    }
    const publish = () => root.style.setProperty(STICKY_CTA_HEIGHT_VAR, `${node.offsetHeight}px`);
    publish();
    // Re-publish when the bar wraps (narrow desktop) or crosses `lg` (display:none → 0).
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(publish) : null;
    observer?.observe(node);
    return () => {
      observer?.disconnect();
      root.style.setProperty(STICKY_CTA_HEIGHT_VAR, '0px');
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-white/15 bg-navy/95 backdrop-blur lg:block"
    >
      <div className="container-site flex flex-wrap items-center justify-between gap-4 py-3">
        <p className="m-0 flex items-center gap-2 font-bold text-white">
          {live && (
            <span
              data-live-dot=""
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-pill bg-success"
            />
          )}
          {message}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {ctas.map((cta) => (
            <Button
              key={cta.href}
              variant={cta.variant ?? 'primary'}
              href={cta.href}
              external={cta.external}
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
