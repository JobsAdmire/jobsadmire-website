import type { ReactNode } from 'react';

/** D20: the contrast-safe blue, never the raw brand blue. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-eyebrow font-extrabold uppercase tracking-[1.6px] text-blue-safe">
      {children}
    </p>
  );
}
