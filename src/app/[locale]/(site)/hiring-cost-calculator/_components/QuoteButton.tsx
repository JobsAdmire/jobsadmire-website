'use client';
import { buttonClassName, type ButtonVariant } from '@/design/primitives/Button';
import { openQuote, prefetchQuoteSheet } from './quote-store';

/** One of the page's written-quote CTAs (`calc.011`, `calc.036`, `calc.105` — W3). A button, not
 *  a link: the form is a dialog; hovering or focusing it prefetches the sheet's chunk. `className`
 *  is for layout only (`w-full`, `flex-1`) — a different face is a variant (W122). */
export function QuoteButton({
  label,
  variant = 'primary',
  size = 'md',
  className,
  testId,
}: {
  label: string;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  className?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      data-testid={testId}
      onClick={openQuote}
      onPointerEnter={prefetchQuoteSheet}
      onFocus={prefetchQuoteSheet}
      className={buttonClassName(variant, size, className)}
    >
      {label}
    </button>
  );
}
