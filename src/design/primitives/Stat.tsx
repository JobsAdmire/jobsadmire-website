'use client';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';

const DURATION_MS = 900;

/**
 * D18: the number is always rendered through `formatInt`.
 * D20/R18: the final value ships in the server HTML and is the accessible name
 * (a visually-hidden span); the count-up animates a separate `aria-hidden` span
 * only after mount, only when motion is not reduced, and only once in view.
 */
export function Stat({
  value,
  suffix,
  label,
  locale,
}: {
  value: number;
  suffix?: string;
  label: string;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `null` until the count-up actually runs, so a changed `value` is shown immediately when
  // motion is reduced or no IntersectionObserver exists — state is never seeded from the prop.
  const [animated, setAnimated] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof window.matchMedia !== 'function') return; // R18 guard (jsdom has none)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver !== 'function') return;

    let frame = 0;
    let started = false;
    const step = (start: number) => (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setAnimated(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step(start));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        observer.disconnect();
        setAnimated(0);
        frame = requestAnimationFrame(step(performance.now()));
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div ref={ref}>
      <p className="text-stat font-extrabold">
        <span aria-hidden="true">
          {formatInt(animated ?? value, locale)}
          {suffix}
        </span>
        <span className="sr-only">
          {formatInt(value, locale)}
          {suffix}
        </span>
      </p>
      <p className="text-body-sm text-text-secondary">{label}</p>
    </div>
  );
}
