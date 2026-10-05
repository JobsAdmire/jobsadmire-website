'use client';
import type { ReactNode } from 'react';
import {
  buttonClassName,
  withIcons,
  type ButtonRadius,
  type ButtonShape,
  type ButtonVariant,
} from '@/design/primitives/Button';
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
  shape,
  radius,
  icon,
}: {
  label: string;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  className?: string;
  testId?: string;
  /** the design's r11 rectangles (Calculator S1.7 / S12) and a leading glyph */
  shape?: ButtonShape;
  radius?: ButtonRadius;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      data-testid={testId}
      onClick={openQuote}
      onPointerEnter={prefetchQuoteSheet}
      onFocus={prefetchQuoteSheet}
      className={buttonClassName(variant, size, className, { shape, radius })}
    >
      {withIcons(label, icon)}
    </button>
  );
}
