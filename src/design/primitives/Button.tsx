import type { HTMLAttributes, ReactNode } from 'react';
import { Link, type Href } from '@/i18n/navigation';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse';

const VARIANT: Record<ButtonVariant, string> = {
  // D20: white on the raw brand blue (#1899d5) is 3.2:1 — enough for large text, not for
  // a 15 px button label. The contrast-safe blue is the CTA face; `blue` survives as a
  // decorative/hover surface behind icons only.
  primary: 'bg-blue-safe text-white hover:bg-ink',
  secondary: 'border border-border-1 bg-white text-ink hover:border-tint-border hover:bg-pale-1',
  ghost: 'text-blue-safe hover:bg-tint',
  danger: 'bg-danger text-white hover:opacity-90',
  // The design's translucent white outline on navy/gradient bands (ClosingCtaBand's
  // WhatsApp/Telegram/call buttons): white text on navy is 15:1, the face only frames it.
  inverse: 'border border-white/30 bg-white/10 text-white hover:bg-white/20',
};

const SIZE = {
  md: 'min-h-[44px] px-5 text-body-sm',
  lg: 'min-h-[52px] px-7 text-body',
} as const;

// 44 px minimum target and a visible focus ring on every branch (D20).
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-pill text-center font-extrabold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe disabled:cursor-not-allowed disabled:opacity-60';

/** The exact class string `<Button>` renders, for the one caller that cannot go through it:
 *  a next-intl `Link` with an *object* href (`{ pathname, hash }`), which `Button`'s
 *  string-only `href` (R17) cannot carry. Same face, same focus ring, same hit target. */
export function buttonClassName(
  variant: ButtonVariant,
  size: 'md' | 'lg' = 'md',
  className?: string,
): string {
  return [BASE, VARIANT[variant], SIZE[size], className].filter(Boolean).join(' ');
}

export type ButtonProps = {
  variant: ButtonVariant;
  size?: 'md' | 'lg';
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** Chrome CTAs pass `false` so they do not add an eager `_rsc` request to the first load;
   *  hover prefetch is unaffected (R47c). Page CTAs keep Next's default. */
  prefetch?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Button({
  variant,
  size = 'md',
  href,
  external,
  type = 'button',
  disabled,
  prefetch,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = buttonClassName(variant, size, className);
  // A disabled CTA must never navigate, whatever its href says.
  if (disabled || !href) {
    return (
      <button {...rest} type={type} disabled={disabled} className={cls}>
        {children}
      </button>
    );
  }
  if (external) {
    return (
      <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      // R17: `href` is a plain string at this component's boundary; next-intl's typed
      // pathnames are re-imposed here. The one sanctioned cast in this module.
      <Link {...rest} href={href as Href} prefetch={prefetch} className={cls}>
        {children}
      </Link>
    );
  }
  // R22: anything else that is still a link — `https://wa.me/…`, `tel:`, `mailto:` — stays a
  // same-tab anchor rather than degrading into a button that goes nowhere.
  return (
    <a {...rest} href={href} className={cls}>
      {children}
    </a>
  );
}
