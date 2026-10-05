'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ContactCta } from '@/design/blocks/ContactCta';
import type { ButtonVariant } from '@/design/primitives/Button';
import type { Href } from '@/i18n/navigation';
import { rootZoom } from '@/design/zoom';

export type StickyCta = {
  label: string;
  /** W82: a plain string (tel:/wa.me/mailto:, an external URL or an internal path) or the
   *  typed object form of an internal `Href` — never a contact door itself. */
  href: string | Exclude<Href, string>;
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

/** The design's slide (`.ja-sticky`, `transform .35s`, src/design/motion/motion.css): how long
 *  the bar stays mounted while it slides back below the viewport. */
export const STICKY_CTA_SLIDE_MS = 350;

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
        // scrollY is in zoomed px on the liquid desktop, the threshold in CSS px (W231)
        showAfterPx * rootZoom(),
        target ? target.getBoundingClientRect().top : null,
        window.innerHeight,
      );
    }, [hideNearId, showAfterPx]),
    onServer,
  );
  const ref = useRef<HTMLDivElement>(null);

  // The design's slide: the bar mounts below the viewport (`.ja-sticky`) and slides up a frame
  // later (`.ja-sticky-on`); on hide it slides back down — inert and hidden from assistive tech
  // at once — and unmounts once it is out. `on` and `leaving` are adjusted during render when
  // `visible` flips (React's "state from the previous render" pattern), the frame and the
  // timer below only ever set them from callbacks.
  const [shownFor, setShownFor] = useState(visible);
  const [on, setOn] = useState(false);
  const [leaving, setLeaving] = useState(false);
  if (shownFor !== visible) {
    setShownFor(visible);
    setOn(false);
    setLeaving(!visible);
  }
  useEffect(() => {
    if (visible) {
      // Two frames: the first paints the bar below the viewport, so the second has a start
      // for the transition.
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setOn(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    if (!leaving) return;
    const timer = setTimeout(() => setLeaving(false), STICKY_CTA_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [visible, leaving]);

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

  if (!visible && !leaving) return null;
  return (
    <div
      ref={ref}
      data-testid="sticky-cta"
      inert={!visible}
      aria-hidden={visible ? undefined : true}
      className={`ja-sticky fixed inset-x-0 bottom-0 z-50 hidden border-t border-white/15 bg-navy/95 backdrop-blur lg:block${visible && on ? ' ja-sticky-on' : ''}`}
    >
      <div className="container-site flex flex-wrap items-center justify-between gap-4 py-3">
        <p className="m-0 flex items-center gap-2 font-bold text-white">
          {live && (
            <span
              data-live-dot=""
              aria-hidden="true"
              className="ja-live inline-block h-2 w-2 rounded-pill bg-success"
            />
          )}
          {message}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {/* W81: a tel:/wa.me/mailto: href renders through ContactLink (placement page_cta)
              via ContactCta; any other href — including an object Href (W82) — stays the
              Button face, exactly as ContactCta already resolves for every other block. */}
          {ctas.map((cta, i) => (
            <ContactCta
              prefetch={false}
              key={`${i}-${cta.label}`}
              placement="page_cta"
              variant={cta.variant ?? 'primary'}
              href={cta.href}
              external={cta.external}
            >
              {cta.label}
            </ContactCta>
          ))}
        </div>
      </div>
    </div>
  );
}
