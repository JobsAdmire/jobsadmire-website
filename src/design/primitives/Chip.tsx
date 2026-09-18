'use client';
import type { ReactNode } from 'react';

export function Chip({
  selected = false,
  onToggle,
  children,
}: {
  selected?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={[
        'inline-flex min-h-[44px] items-center rounded-pill border px-4 text-body-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe',
        selected
          ? 'border-tint-border bg-tint text-blue-safe'
          : 'border-border-1 bg-white text-text-secondary hover:bg-pale-1',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
