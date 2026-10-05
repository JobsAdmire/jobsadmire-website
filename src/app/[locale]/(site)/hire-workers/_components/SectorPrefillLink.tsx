'use client';
import type { ReactNode } from 'react';
import type { SectorKey } from '@/content/collections';

/**
 * The industries panel's "Request <sector> workers →" CTA. The design (`requestInd1..6`)
 * pre-selects the request form's sector and scrolls to it; here it is a real anchor to
 * `#request-form` (works without JS, keyboard-reachable, fires no analytics event — it is not a
 * contact door, W12) whose click also sets the form's `sector` select before the hash navigation
 * runs. The select is the kernel's uncontrolled `Field`, so setting `.value` and dispatching
 * `change` is the whole hand-off: no cross-island state, nothing in the URL (W95). The value is
 * the sector KEY (W77). Reads no `sys.*` copy — the label arrives as children (W148).
 */
export function SectorPrefillLink({
  sector,
  className,
  'aria-label': ariaLabel,
  children,
}: {
  sector: SectorKey;
  className?: string;
  /** the industry row's round → (design `.ja-arrow`, `requestIndN`) has no words of its own */
  'aria-label'?: string;
  children: ReactNode;
}) {
  const prefill = () => {
    const select = document.querySelector<HTMLSelectElement>('#request-form select[name="sector"]');
    if (!select) return;
    if (!Array.from(select.options).some((o) => o.value === sector)) return;
    select.value = sector;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };
  return (
    <a href="#request-form" onClick={prefill} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
