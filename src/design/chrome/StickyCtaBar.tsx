'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { Button, type ButtonVariant } from '@/design/primitives';

export type StickyCta = {
  label: string;
  href: string;
  variant?: ButtonVariant;
  external?: boolean;
};

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}
const onServer = () => false;

/** Mounted by pages, never by the layout: it repeats that page's own offer once the visitor
 *  has scrolled past it. Below `lg` the mobile bottom bar already occupies this space. */
export function StickyCtaBar({
  message,
  ctas,
  showAfterPx = 700,
}: {
  message: string;
  ctas: StickyCta[];
  showAfterPx?: number;
}) {
  // R18's pattern: the scroll position is a browser fact, read after hydration only.
  const past = useSyncExternalStore(
    subscribeToScroll,
    useCallback(() => window.scrollY > showAfterPx, [showAfterPx]),
    onServer,
  );

  if (!past) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-white/15 bg-navy/95 backdrop-blur lg:block">
      <div className="container-site flex flex-wrap items-center justify-between gap-4 py-3">
        <p className="m-0 font-bold text-white">{message}</p>
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
