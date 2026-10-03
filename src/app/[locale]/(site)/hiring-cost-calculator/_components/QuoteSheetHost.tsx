'use client';
import { lazy, Suspense, type ComponentType } from 'react';
import { closeQuote, loadQuoteSheet, useQuoteState } from './quote-store';
import type { QuoteSheetProps } from './QuoteSheet';

type HostProps = Omit<QuoteSheetProps, 'open' | 'onClose'> & { loadingLabel: string };

const Unavailable: ComponentType<QuoteSheetProps> = () => null;
// Module scope: one lazy component for the page's life. A failed chunk (a deploy mid-visit)
// renders nothing instead of reaching the route's error boundary; logged outside production.
const QuoteSheet = lazy((): Promise<{ default: ComponentType<QuoteSheetProps> }> =>
  loadQuoteSheet()
    .then((m) => ({ default: m.QuoteSheet }))
    .catch((error: unknown) => {
      if (process.env.NODE_ENV !== 'production') console.error('QuoteSheet: chunk failed', error);
      return { default: Unavailable };
    }),
);

/** Mounted once, at the end of the page. Renders nothing — and ships no forms-kernel code — until
 *  a quote button asks for the sheet; from then on it stays mounted and follows the store. */
export function QuoteSheetHost({ loadingLabel, ...props }: HostProps) {
  const { open, requested } = useQuoteState();
  if (!requested) return null;
  return (
    <Suspense
      fallback={
        open ? (
          <p
            role="status"
            className="fixed inset-x-0 bottom-0 z-[100] m-0 bg-navy px-6 py-4 text-center text-body-sm font-bold text-white"
          >
            {loadingLabel}
          </p>
        ) : null
      }
    >
      <QuoteSheet {...props} open={open} onClose={closeQuote} />
    </Suspense>
  );
}
