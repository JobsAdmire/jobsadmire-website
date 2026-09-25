'use client';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { formatInt } from '@/lib/format/money';

const DURATION_MS = 900;

/**
 * D18: a numeric `value` is always rendered through `formatInt`; a `text` metric (a range
 * such as "6–8", W1) is rendered verbatim and never animated. Neither → nothing: an unsigned
 * metric is hidden, not shown as 0.
 * D20/R18: the final value ships in the server HTML and is the accessible name (a
 * visually-hidden span); the count-up animates a separate `aria-hidden` span only after
 * mount, only when motion is not reduced, and only once in view.
 */
export function Stat({
  value,
  text,
  prefix = '',
  suffix = '',
  label,
  locale,
  tone = 'light',
}: {
  value?: number;
  text?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  locale: Locale;
  tone?: 'light' | 'dark';
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `null` until the count-up actually runs, so a changed `value` is shown immediately when
  // motion is reduced or no IntersectionObserver exists — state is never seeded from the prop.
  const [animated, setAnimated] = useState<number | null>(null);
  // Only a numeric metric without text animates; the effect below is a no-op otherwise.
  const numeric = text === undefined ? value : undefined;

  useEffect(() => {
    const node = ref.current;
    if (!node || numeric === undefined) return;
    if (typeof window.matchMedia !== 'function') return; // R18 guard (jsdom has none)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver !== 'function') return;

    let frame = 0;
    let started = false;
    const step = (start: number) => (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setAnimated(Math.round(numeric * (1 - Math.pow(1 - p, 3))));
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
  }, [numeric]);

  if (text === undefined && value === undefined) return null;

  const labelCls =
    tone === 'dark' ? 'text-body-sm text-white/55' : 'text-body-sm text-text-secondary';
  const figureCls =
    tone === 'dark' ? 'text-stat font-extrabold text-white' : 'text-stat font-extrabold';

  return (
    <div ref={ref}>
      <p className={figureCls}>
        {text !== undefined ? (
          <span>
            {prefix}
            {text}
            {suffix}
          </span>
        ) : (
          <>
            <span aria-hidden="true">
              {prefix}
              {formatInt(animated ?? (value as number), locale)}
              {suffix}
            </span>
            <span className="sr-only">
              {prefix}
              {formatInt(value as number, locale)}
              {suffix}
            </span>
          </>
        )}
      </p>
      <p className={labelCls}>{label}</p>
    </div>
  );
}
